# Color Picker & Palette Manager

A Chrome browser extension that allows you to pick colors from anywhere on your screen, manage color palettes, and work completely offline.

## Features

- **Color Picker**: Pick any color from your screen using the EyeDropper API
  - View RGB and HSV values
  - See the selected color's position on a color wheel
  - Add picked colors to existing palettes

- **Palette Management**: Create and manage color palettes
  - Create unlimited palettes with custom names and descriptions
  - Add/remove colors from palettes
  - View all colors in a palette with their RGB/HSV values
  - See all palette colors visualized on a color wheel

- **Import/Export**: Backup and share your palettes
  - Export all palettes to a JSON file
  - Import palettes from JSON files
  - All data stored locally - works completely offline

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

1. Click the extension icon in your toolbar
2. Click "Color Picker"
3. Click "Pick Color from Screen"
4. Click anywhere on your screen to pick a color
5. View the RGB/HSV values and color wheel position
6. Optionally add the color to an existing palette

### Creating Palettes

1. Click the extension icon
2. Click "Create New Palette"
3. Enter a name and optional description
4. Use the Color Picker to add colors to your palette
5. Click "Save Palette"

### Managing Palettes

1. Click the extension icon
2. Click "View Palettes"
3. Click any palette to edit it
4. Remove colors by clicking the × button on each color
5. Delete palettes using the "Delete Palette" button

### Exporting/Importing

1. Click "View Palettes"
2. Click "Export Palettes" to download all palettes as JSON
3. Click "Import Palettes" to load palettes from a JSON file

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
├── manifest.json          # Extension manifest
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── src/
│   ├── popup.html         # Main popup UI
│   ├── popup.css          # Styling
│   ├── popup.js           # Main application logic
│   ├── colorWheel.js      # Color wheel rendering
│   ├── storage.js         # Chrome storage wrapper
│   └── utils.js           # Color conversion utilities
└── README.md
```

## License

MIT License - See LICENSE file for details
