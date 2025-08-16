import os
import subprocess
from datetime import datetime
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import numpy as np
import cv2
import sys

# The script is now run from the project root, so we can use relative paths directly.
# The current working directory is the project root.
PROJECT_ROOT = os.getcwd() 

app = Flask(__name__)
CORS(app)

# Initialize Google Earth Engine
try:
    import ee
    ee.Initialize(project='gee-change-detection')
    print("[SERVER] Google Earth Engine initialized successfully.")
    GEE_AVAILABLE = True
except Exception as e:
    print(f"[SERVER] WARNING: Could not initialize GEE. Error: {e}")
    GEE_AVAILABLE = False

def create_mock_satellite_images(output_dir):
    """Create mock 'before' and 'after' satellite images."""
    print("[SERVER] Creating mock satellite images.")
    width, height = 512, 512
    
    image_before = np.full((height, width, 3), (34, 139, 34), dtype=np.uint8)
    noise = np.random.randint(-15, 15, (height, width, 3), dtype=np.int16)
    image_before = np.clip(image_before.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    
    image_after = image_before.copy()
    cv2.circle(image_after, (width // 2, height // 2), 80, (70, 130, 180), -1)
    cv2.line(image_after, (0, height - 50), (width, height - 150), (128, 128, 128), 10)
    
    before_path = os.path.join(output_dir, 'image_before.png')
    after_path = os.path.join(output_dir, 'image_after.png')
    
    cv2.imwrite(before_path, cv2.cvtColor(image_before, cv2.COLOR_RGB2BGR))
    cv2.imwrite(after_path, cv2.cvtColor(image_after, cv2.COLOR_RGB2BGR))
    
    print(f"[SERVER] Mock images saved to {before_path} and {after_path}")
    return before_path, after_path

@app.route('/api/detect-change', methods=['POST'])
def detect_change_api():
    try:
        output_dir = os.path.join(PROJECT_ROOT, 'output')
        if not os.path.exists(output_dir): 
            os.makedirs(output_dir)

        # We will use the mock data flow to ensure it works first.
        image_before_path, image_after_path = create_mock_satellite_images(output_dir)
        date_before, date_after = '2021-06-15', '2024-06-15'

        script_path = os.path.join(PROJECT_ROOT, 'scripts', 'DetectChange.py')
        
        command = [
            sys.executable, script_path,
            '--input_image_one', image_before_path,
            '--input_image_two', image_after_path,
            '--output_directory', output_dir,
            '--date_before', date_before,
            '--date_after', date_after
        ]

        print(f"[SERVER] Running command: {' '.join(command)}")
        # Added encoding='utf-8' for better compatibility on Windows
        result = subprocess.run(command, check=True, capture_output=True, text=True, encoding='utf-8')
        print(f"[SERVER] Script STDOUT: {result.stdout.strip()}")
        
        change_map_path = os.path.join(output_dir, 'ChangeMap.jpg')
        
        if not os.path.exists(change_map_path):
            raise FileNotFoundError("Change detection analysis failed to generate results.")
            
        return send_file(change_map_path, mimetype='image/jpeg')

    except subprocess.CalledProcessError as e:
        print("\n--- SCRIPT CRASHED: TRACEBACK ---")
        print(e.stderr)
        print("--- END TRACEBACK ---\n")
        return jsonify({"error": "Change detection script failed.", "details": e.stderr.strip()}), 500
    except Exception as e:
        print(f"\n--- UNEXPECTED SERVER ERROR: {e} ---\n")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')