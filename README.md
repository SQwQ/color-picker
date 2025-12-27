# Color Picker & Palette Manager

A Chrome browser extension that allows you to pick colors from anywhere on your screen, manage color palettes, and work completely offline. Features a cute yellow cat mascot!

## Features

- **Color Picker**: Pick any color from your screen using the EyeDropper API
  - View RGB, HSV, and HEX values in real-time
  - Dual color wheel visualization:
    - **Standard Color Wheel**: Shows picked color position with all palette colors as markers
    - **HSV Wheel**: Interactive hue ring + saturation/value triangle for precise color selection
  - Click anywhere on the HSV wheel to select colors interactively
  - Automatically adds picked colors to selected palette
  - Click any color in current palette to view its info and copy HEX code
  - One-click copy to clipboard for HEX codes (click color preview or palette colors)
  - Visual markers on color wheel for all palette colors
  - Create new palettes directly from the picker

- **Palette Management**: Create and manage color palettes
  - Create unlimited palettes with custom names
  - View current palette while picking colors
  - Click palette colors to display their RGB/HSV/HEX values AND copy HEX to clipboard
  - Delete individual colors from palettes (hover to reveal × button)
  - Delete entire palettes from the list view (hover to reveal × button)
  - See all palette colors visualized on both color wheels
  - Side-by-side layout for easy viewing

- **Import/Export**: Backup and share your palettes
  - Export all palettes to JSON file (one click, no confirmation)
  - Import palettes from JSON files
  - All data stored locally using Chrome Storage API
  - Works completely offline

## Installation

### Load as Unpacked Extension (Development Mode)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the `color-picker` folder
6. The extension should now appear in your extensions toolbar

## Usage

### Picking Colors

**From Screen:**
1. Click the extension icon in your toolbar
2. Click "Color Picker"
3. Select a palette from the dropdown (or create a new one with "+ New")
4. Click "Pick Color from Screen"
5. Click anywhere on your screen to pick a color
6. The color is automatically added to the selected palette
7. View RGB/HSV/HEX values and both color wheel visualizations

**From HSV Wheel:**
1. Click anywhere on the hue ring (outer donut) to select a hue
2. Click within the triangle to select saturation and value
3. Color automatically updates and adds to the selected palette

**Copying Colors:**
- Click the color preview box to copy HEX code to clipboard
- Click any color in the current palette to copy its HEX code
- HEX code is copied instantly without confirmation

**Pro Tips**:
- All colors in your current palette are displayed as small white dots on the standard color wheel
- The currently selected color shows as a larger pulsing indicator
- The HSV wheel's triangle rotates to show the selected hue at the top vertex

### Creating Palettes

**From Color Picker:**
1. In the Color Picker view, click the "+ New" button
2. Enter a palette name
3. Start picking colors - they'll be added automatically

**From Palette Editor:**
1. Click "View Palettes"
2. Click any existing palette to edit it
3. Edit the name, description, or manually add/remove colors
4. Click "Save Palette"

### Managing Palettes

**Deleting Colors:**
- Hover over any color in the current palette preview
- Click the red × button that appears
- No confirmation needed - instant deletion

**Deleting Palettes:**
- Go to "View Palettes"
- Hover over any palette card
- Click the red × button next to the palette name
- No confirmation needed - instant deletion

### Exporting/Importing

**Export:**
1. Click "View Palettes"
2. Click "Export Palettes"
3. JSON file downloads automatically (named `palettes-[timestamp].json`)

**Import:**
1. Click "View Palettes"
2. Click "Import Palettes"
3. Select a JSON file from your computer
4. Palettes are merged with existing ones

## Browser Requirements

- Chrome 95+ or Edge 95+ (required for EyeDropper API)
- The extension uses modern web APIs and requires a recent browser version

## Technical Details

- Built with vanilla JavaScript (no frameworks)
- Uses Chrome Extension Manifest V3
- Offline-first using Chrome Storage API
- Dual canvas-based color wheel visualizations:
  - Standard RGB color wheel with palette markers
  - HSV wheel with interactive hue ring and saturation/value triangle
- RGB ↔ HSV color conversion utilities
- Clipboard API for one-click HEX code copying
- Barycentric coordinate system for triangle color selection

## File Structure

```
color-picker/
├── manifest.json          # Extension manifest (Manifest V3)
├── icons/                 # Extension icons
│   ├── icon16.png        # 16x16 toolbar icon
│   ├── icon32.png        # 32x32 icon
│   ├── icon48.png        # 48x48 extensions page icon
│   ├── icon128.png       # 128x128 Chrome Web Store icon
│   ├── newAvatar.png     # Source mascot artwork (yellow cat)
│   └── color-meow.png    # Original mascot artwork (archived)
├── src/
│   ├── popup.html        # Main popup UI (500x600px max)
│   ├── popup.css         # Styling with animations
│   ├── popup.js          # Main application logic
│   ├── colorWheel.js     # Standard RGB color wheel
│   ├── hsvWheel.js       # HSV wheel with hue ring + SV triangle
│   ├── storage.js        # Chrome Storage API wrapper
│   └── utils.js          # RGB/HSV conversion utilities
├── create_icons.py       # Icon generation script (accepts filename argument)
└── README.md
```

## Generating Icons

To regenerate icons from a source image:

```bash
python create_icons.py <filename>
```

Example:
```bash
python create_icons.py newAvatar.png
```

This will create icon16.png, icon32.png, icon48.png, and icon128.png from the source image.

## License

MIT License - See LICENSE file for details
