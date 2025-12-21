// Main popup script - handles UI navigation and functionality

// State management
let currentView = 'main-menu';
let currentColor = null;
let currentPalette = null;
let currentPaletteId = null;
let colorWheel = null;
let editorColorWheel = null;

// Initialize on load
document.addEventListener('DOMContentLoaded', async () => {
  initializeViews();
  initializeColorWheel();
  initializeEventListeners();
  await loadPalettes();
});

// View management
function initializeViews() {
  showView('main-menu');
}

function showView(viewId) {
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });

  const view = document.getElementById(viewId);
  if (view) {
    view.classList.add('active');
    currentView = viewId;
  }
}

// Initialize color wheels
function initializeColorWheel() {
  const canvas = document.getElementById('color-wheel');
  if (canvas) {
    colorWheel = new ColorWheel(canvas);
    colorWheel.draw();
  }

  const editorCanvas = document.getElementById('editor-color-wheel');
  if (editorCanvas) {
    editorColorWheel = new ColorWheel(editorCanvas);
    editorColorWheel.draw();
  }
}

// Event Listeners
function initializeEventListeners() {
  // Main menu buttons
  document.getElementById('btn-color-picker').addEventListener('click', () => {
    showView('color-picker-view');
    loadPaletteSelect();
  });

  document.getElementById('btn-create-palette').addEventListener('click', () => {
    startNewPalette();
  });

  document.getElementById('btn-view-palettes').addEventListener('click', () => {
    showView('palettes-list-view');
    renderPalettesList();
  });

  // Back buttons
  document.getElementById('back-from-picker').addEventListener('click', () => {
    showView('main-menu');
    resetColorPicker();
  });

  document.getElementById('back-from-editor').addEventListener('click', () => {
    showView('main-menu');
    resetPaletteEditor();
  });

  document.getElementById('back-from-list').addEventListener('click', () => {
    showView('main-menu');
  });

  // Color picker
  document.getElementById('pick-color-btn').addEventListener('click', pickColor);
  document.getElementById('add-to-palette-btn').addEventListener('click', addColorToPalette);
  document.getElementById('palette-select').addEventListener('change', (e) => {
    const btn = document.getElementById('add-to-palette-btn');
    btn.disabled = !e.target.value || !currentColor;
  });

  // Palette editor
  document.getElementById('save-palette-btn').addEventListener('click', savePalette);
  document.getElementById('delete-palette-btn').addEventListener('click', deletePalette);

  // Palettes list
  document.getElementById('export-palettes-btn').addEventListener('click', exportPalettes);
  document.getElementById('import-palettes-btn').addEventListener('click', () => {
    document.getElementById('import-file-input').click();
  });
  document.getElementById('import-file-input').addEventListener('change', importPalettes);
}

// Color Picker Functions
async function pickColor() {
  try {
    // Use EyeDropper API if available
    if (!window.EyeDropper) {
      alert('Color picker is not supported in this browser. Please use Chrome 95+ or Edge 95+.');
      return;
    }

    const eyeDropper = new EyeDropper();
    const result = await eyeDropper.open();

    if (result && result.sRGBHex) {
      const rgb = hexToRgb(result.sRGBHex);
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

      currentColor = {
        rgb: rgb,
        hsv: hsv,
        hex: result.sRGBHex
      };

      displayPickedColor(currentColor);
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error picking color:', error);
      alert('Failed to pick color. Please try again.');
    }
  }
}

function displayPickedColor(color) {
  // Update color preview
  const preview = document.getElementById('color-preview');
  preview.style.backgroundColor = color.hex;

  // Update color values
  document.getElementById('rgb-value').textContent = formatRgb(color.rgb.r, color.rgb.g, color.rgb.b);
  document.getElementById('hsv-value').textContent = formatHsv(color.hsv.h, color.hsv.s, color.hsv.v);

  // Update color wheel indicator
  const pos = colorWheel.getPositionForColor(color.hsv.h, color.hsv.s);
  const indicator = document.getElementById('color-indicator');
  const canvas = document.getElementById('color-wheel');
  const rect = canvas.getBoundingClientRect();

  updateColorIndicator(indicator, pos.x, pos.y);

  // Enable add to palette button if palette is selected
  const paletteSelect = document.getElementById('palette-select');
  const btn = document.getElementById('add-to-palette-btn');
  btn.disabled = !paletteSelect.value;
}

function resetColorPicker() {
  currentColor = null;
  document.getElementById('color-preview').style.backgroundColor = '';
  document.getElementById('rgb-value').textContent = '-';
  document.getElementById('hsv-value').textContent = '-';
  hideColorIndicator(document.getElementById('color-indicator'));
  document.getElementById('add-to-palette-btn').disabled = true;
  document.getElementById('palette-select').value = '';
}

async function loadPaletteSelect() {
  const select = document.getElementById('palette-select');
  const palettes = await StorageManager.getAllPalettes();

  // Clear existing options except first
  select.innerHTML = '<option value="">-- Select Palette --</option>';

  palettes.forEach(palette => {
    const option = document.createElement('option');
    option.value = palette.id;
    option.textContent = palette.name;
    select.appendChild(option);
  });
}

async function addColorToPalette() {
  if (!currentColor) {
    alert('Please pick a color first');
    return;
  }

  const paletteId = document.getElementById('palette-select').value;
  if (!paletteId) {
    alert('Please select a palette');
    return;
  }

  const success = await StorageManager.addColorToPalette(paletteId, currentColor);

  if (success) {
    alert('Color added to palette successfully!');
    resetColorPicker();
  } else {
    alert('Failed to add color to palette');
  }
}

// Palette Editor Functions
function startNewPalette() {
  currentPaletteId = null;
  currentPalette = {
    name: '',
    description: '',
    colors: []
  };

  document.getElementById('editor-title').textContent = 'Create New Palette';
  document.getElementById('palette-name').value = '';
  document.getElementById('palette-description').value = '';
  document.getElementById('delete-palette-btn').style.display = 'none';

  renderPaletteColors([]);
  editorColorWheel.draw();

  showView('palette-editor-view');
}

async function editPalette(paletteId) {
  currentPaletteId = paletteId;
  currentPalette = await StorageManager.getPalette(paletteId);

  if (!currentPalette) {
    alert('Palette not found');
    return;
  }

  document.getElementById('editor-title').textContent = 'Edit Palette';
  document.getElementById('palette-name').value = currentPalette.name || '';
  document.getElementById('palette-description').value = currentPalette.description || '';
  document.getElementById('delete-palette-btn').style.display = 'block';

  renderPaletteColors(currentPalette.colors || []);
  editorColorWheel.drawWithMarkers(currentPalette.colors || []);

  showView('palette-editor-view');
}

function renderPaletteColors(colors) {
  const container = document.getElementById('palette-colors');
  container.innerHTML = '';

  document.getElementById('color-count').textContent = `(${colors.length})`;

  colors.forEach((color, index) => {
    const colorItem = document.createElement('div');
    colorItem.className = 'color-item';

    const colorInner = document.createElement('div');
    colorInner.className = 'color-item-inner';
    colorInner.style.backgroundColor = color.hex || rgbToHex(color.rgb.r, color.rgb.g, color.rgb.b);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      removeColorFromPalette(index);
    });

    const tooltip = document.createElement('div');
    tooltip.className = 'color-item-tooltip';
    tooltip.textContent = `${formatRgb(color.rgb.r, color.rgb.g, color.rgb.b)}\n${formatHsv(color.hsv.h, color.hsv.s, color.hsv.v)}`;

    colorItem.appendChild(colorInner);
    colorItem.appendChild(removeBtn);
    colorItem.appendChild(tooltip);

    container.appendChild(colorItem);
  });

  // Update color wheel
  editorColorWheel.drawWithMarkers(colors);
}

async function removeColorFromPalette(index) {
  if (!currentPalette || !currentPalette.colors) return;

  currentPalette.colors.splice(index, 1);
  renderPaletteColors(currentPalette.colors);
}

async function savePalette() {
  const name = document.getElementById('palette-name').value.trim();

  if (!name) {
    alert('Please enter a palette name');
    return;
  }

  currentPalette.name = name;
  currentPalette.description = document.getElementById('palette-description').value.trim();

  if (currentPaletteId) {
    currentPalette.id = currentPaletteId;
  }

  const success = await StorageManager.savePalette(currentPalette);

  if (success) {
    alert('Palette saved successfully!');
    showView('main-menu');
    resetPaletteEditor();
  } else {
    alert('Failed to save palette');
  }
}

async function deletePalette() {
  if (!currentPaletteId) return;

  if (!confirm('Are you sure you want to delete this palette?')) {
    return;
  }

  const success = await StorageManager.deletePalette(currentPaletteId);

  if (success) {
    alert('Palette deleted successfully!');
    showView('main-menu');
    resetPaletteEditor();
  } else {
    alert('Failed to delete palette');
  }
}

function resetPaletteEditor() {
  currentPaletteId = null;
  currentPalette = null;
  document.getElementById('palette-name').value = '';
  document.getElementById('palette-description').value = '';
  renderPaletteColors([]);
}

// Palettes List Functions
async function renderPalettesList() {
  const container = document.getElementById('palettes-list');
  const palettes = await StorageManager.getAllPalettes();

  container.innerHTML = '';

  palettes.forEach(palette => {
    const card = document.createElement('div');
    card.className = 'palette-card';
    card.addEventListener('click', () => editPalette(palette.id));

    const name = document.createElement('div');
    name.className = 'palette-card-name';
    name.textContent = palette.name;

    const colorsContainer = document.createElement('div');
    colorsContainer.className = 'palette-card-colors';

    const displayColors = (palette.colors || []).slice(0, 10);
    displayColors.forEach(color => {
      const colorBox = document.createElement('div');
      colorBox.className = 'palette-card-color';

      const colorInner = document.createElement('div');
      colorInner.className = 'palette-card-color-inner';
      colorInner.style.backgroundColor = color.hex || rgbToHex(color.rgb.r, color.rgb.g, color.rgb.b);

      colorBox.appendChild(colorInner);
      colorsContainer.appendChild(colorBox);
    });

    card.appendChild(name);
    card.appendChild(colorsContainer);
    container.appendChild(card);
  });
}

async function loadPalettes() {
  // Initial load - could be used for any startup logic
  const palettes = await StorageManager.getAllPalettes();
  console.log(`Loaded ${palettes.length} palettes`);
}

// Export/Import Functions
async function exportPalettes() {
  const jsonString = await StorageManager.exportPalettes();

  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `palettes-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert('Palettes exported successfully!');
}

async function importPalettes(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const success = await StorageManager.importPalettes(text, true);

    if (success) {
      alert('Palettes imported successfully!');
      renderPalettesList();
    } else {
      alert('Failed to import palettes. Please check the file format.');
    }
  } catch (error) {
    console.error('Import error:', error);
    alert('Failed to import palettes. Invalid file format.');
  }

  // Reset file input
  event.target.value = '';
}
