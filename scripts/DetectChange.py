import matplotlib
matplotlib.use('Agg')  # Use a non-interactive backend for the server

import argparse
import cv2
import numpy as np
import matplotlib.pyplot as plt
import os
from datetime import datetime

def preprocess_image(image_path):
    """Load and preprocess satellite image"""
    print(f"[SCRIPT] Loading image: {image_path}")
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not load image: {image_path}")
    
    # Convert BGR to RGB
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Resize to standard size for processing
    height, width = image.shape[:2]
    if width > 1024 or height > 1024:
        scale = min(1024/width, 1024/height)
        new_width = int(width * scale)
        new_height = int(height * scale)
        image = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)
    
    return image

def detect_changes(image_before, image_after):
    """Perform change detection analysis"""
    print("[SCRIPT] Performing change detection analysis...")
    
    # Convert to grayscale for analysis
    gray_before = cv2.cvtColor(image_before, cv2.COLOR_RGB2GRAY)
    gray_after = cv2.cvtColor(image_after, cv2.COLOR_RGB2GRAY)
    
    # Apply Gaussian blur to reduce noise
    gray_before = cv2.GaussianBlur(gray_before, (5, 5), 0)
    gray_after = cv2.GaussianBlur(gray_after, (5, 5), 0)
    
    # Calculate absolute difference
    diff = cv2.absdiff(gray_before, gray_after)
    
    # Apply morphological operations to clean up the difference
    kernel = np.ones((3, 3), np.uint8)
    diff = cv2.morphologyEx(diff, cv2.MORPH_CLOSE, kernel)
    diff = cv2.morphologyEx(diff, cv2.MORPH_OPEN, kernel)
    
    # Create change map with multiple thresholds
    change_map = np.zeros_like(diff)
    
    # Define thresholds for different change levels
    threshold_high = 50
    threshold_medium = 25
    threshold_low = 10
    
    change_map[diff > threshold_high] = 255  # Significant change
    change_map[(diff > threshold_medium) & (diff <= threshold_high)] = 170  # Moderate change
    change_map[(diff > threshold_low) & (diff <= threshold_medium)] = 85   # Minor change
    
    return change_map, diff

def create_visualization(image_before, image_after, change_map, output_path, date_before, date_after):
    """Create comprehensive change detection visualization"""
    print("[SCRIPT] Creating change detection visualization...")
    
    fig, axes = plt.subplots(2, 2, figsize=(16, 12))
    fig.suptitle('Satellite Change Detection Analysis', fontsize=16, fontweight='bold')
    
    # Before image
    axes[0, 0].imshow(image_before)
    axes[0, 0].set_title(f'Before ({date_before})', fontsize=12, fontweight='bold')
    axes[0, 0].axis('off')
    
    # After image
    axes[0, 1].imshow(image_after)
    axes[0, 1].set_title(f'After ({date_after})', fontsize=12, fontweight='bold')
    axes[0, 1].axis('off')
    
    # Change map
    change_colors = ['#1e40af', '#10b981', '#f59e0b', '#ef4444']  # Blue, Green, Yellow, Red
    cmap = plt.matplotlib.colors.ListedColormap(change_colors)
    
    # Normalize change map for color mapping
    change_normalized = change_map / 255.0 * 3
    
    im = axes[1, 0].imshow(change_normalized, cmap=cmap, vmin=0, vmax=3)
    axes[1, 0].set_title('Change Detection Map', fontsize=12, fontweight='bold')
    axes[1, 0].axis('off')
    
    # Add colorbar
    cbar = plt.colorbar(im, ax=axes[1, 0], shrink=0.8)
    cbar.set_ticks([0.375, 1.125, 1.875, 2.625])
    cbar.set_ticklabels(['No Change', 'Minor Change', 'Moderate Change', 'Significant Change'])
    
    # Statistics panel
    axes[1, 1].axis('off')
    
    # Calculate change statistics
    total_pixels = change_map.size
    no_change = np.sum(change_map == 0)
    minor_change = np.sum(change_map == 85)
    moderate_change = np.sum(change_map == 170)
    significant_change = np.sum(change_map == 255)
    
    stats_text = f"""
Change Detection Statistics

Total Area Analyzed: {total_pixels:,} pixels

Change Distribution:
• No Change: {(no_change/total_pixels)*100:.1f}%
• Minor Change: {(minor_change/total_pixels)*100:.1f}%
• Moderate Change: {(moderate_change/total_pixels)*100:.1f}%
• Significant Change: {(significant_change/total_pixels)*100:.1f}%

Analysis Details:
• Time Period: {date_before} to {date_after}
• Data Source: Sentinel-2 Satellite
• Resolution: 10-15 meters
• Processing: Multi-temporal Analysis

Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
    """
    
    axes[1, 1].text(0.05, 0.95, stats_text.strip(), transform=axes[1, 1].transAxes,
                   fontsize=10, verticalalignment='top', fontfamily='monospace',
                   bbox=dict(boxstyle='round,pad=0.5', facecolor='lightgray', alpha=0.8))
    
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    
    print(f"[SCRIPT] Change detection visualization saved to: {output_path}")

def main():
    parser = argparse.ArgumentParser(description='Satellite Change Detection Analysis')
    parser.add_argument('--input_image_one', required=True, help='Path to first image')
    parser.add_argument('--input_image_two', required=True, help='Path to second image')
    parser.add_argument('--output_directory', required=True, help='Output directory')
    parser.add_argument('--date_before', required=True, help='Date of first image')
    # This line below is now corrected
    parser.add_argument('--date_after', required=True, help='Date of second image')
    
    args = parser.parse_args()
    
    try:
        # Load and preprocess images
        image_before = preprocess_image(args.input_image_one)
        image_after = preprocess_image(args.input_image_two)
        
        # Ensure images are the same size
        if image_before.shape != image_after.shape:
            height = min(image_before.shape[0], image_after.shape[0])
            width = min(image_before.shape[1], image_after.shape[1])
            image_before = cv2.resize(image_before, (width, height))
            image_after = cv2.resize(image_after, (width, height))
        
        # Perform change detection
        change_map, diff = detect_changes(image_before, image_after)
        
        # Create visualization
        output_path = os.path.join(args.output_directory, 'ChangeMap.jpg')
        create_visualization(image_before, image_after, change_map, output_path, 
                           args.date_before, args.date_after)
        
        print("[SCRIPT] Change detection analysis completed successfully!")
        
    except Exception as e:
        print(f"[SCRIPT] ERROR: {str(e)}")
        raise

if __name__ == '__main__':
    main()