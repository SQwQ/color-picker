# Color Picker & Palette Manager

A Chrome browser extension that allows you to pick colors from anywhere on your screen, manage color palettes, and work completely offline. Features an adorable "Color Meow" mascot!

## Features

- **Color Picker**: Pick any color from your screen using the EyeDropper API
  - View RGB and HSV values in real-time
  - Interactive color wheel showing picked color position
  - Automatically adds picked colors to selected palette
  - Click any color in current palette to view its info and position
  - Visual markers on color wheel for all palette colors
  - Create new palettes directly from the picker

- **Palette Management**: Create and manage color palettes
  - Create unlimited palettes with custom names
  - View current palette while picking colors
  - Click palette colors to display their RGB/HSV values
  - Delete individual colors from palettes (hover to reveal × button)
  - Delete entire palettes from the list view (hover to reveal × button)
  - See all palette colors visualized on the color wheel
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

1. Click the Color Meow extension icon in your toolbar
2. Click "Color Picker"
3. Select a palette from the dropdown (or create a new one with "+ New")
4. Click "Pick Color from Screen"
5. Click anywhere on your screen to pick a color
6. The color is automatically added to the selected palette
7. View RGB/HSV values, color wheel position, and all palette colors
8. Click any color in the current palette to view its information

**Pro Tip**: All colors in your current palette are displayed as small markers on the color wheel, while the currently selected color shows as a larger pulsing indicator.

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
- Canvas-based color wheel visualization
- RGB ↔ HSV color conversion utilities

## File Structure

```
color-picker/
├── manifest.json          # Extension manifest (Manifest V3)
├── icons/                 # Extension icons
│   ├── icon16.png        # Generated from color-meow.png
│   ├── icon32.png        # Toolbar icon
│   ├── icon48.png        # Extensions page
│   ├── icon128.png       # Chrome Web Store
│   └── color-meow.png    # Original mascot artwork
├── src/
│   ├── popup.html        # Main popup UI (500x600px max)
│   ├── popup.css         # Styling with animations
│   ├── popup.js          # Main application logic
│   ├── colorWheel.js     # Canvas-based color wheel
│   ├── storage.js        # Chrome Storage API wrapper
│   └── utils.js          # RGB/HSV conversion utilities
├── create_icons.py       # Icon generation script
└── README.md
```

## License

MIT License - See LICENSE file for details
