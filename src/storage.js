// Chrome storage wrapper for palette management

const StorageManager = {
  /**
   * Get all palettes from storage
   * @returns {Promise<Array>} Array of palette objects
   */
  async getAllPalettes() {
    try {
      const result = await chrome.storage.local.get(['palettes']);
      return result.palettes || [];
    } catch (error) {
      console.error('Error getting palettes:', error);
      return [];
    }
  },

  /**
   * Save a palette to storage
   * @param {Object} palette - Palette object with name, description, and colors
   * @returns {Promise<boolean>} Success status
   */
  async savePalette(palette) {
    try {
      const palettes = await this.getAllPalettes();

      // Generate unique ID if new palette
      if (!palette.id) {
        palette.id = Date.now().toString();
        palette.createdAt = new Date().toISOString();
        palettes.push(palette);
      } else {
        // Update existing palette
        const index = palettes.findIndex(p => p.id === palette.id);
        if (index !== -1) {
          palette.updatedAt = new Date().toISOString();
          palettes[index] = palette;
        } else {
          palettes.push(palette);
        }
      }

      await chrome.storage.local.set({ palettes });
      return true;
    } catch (error) {
      console.error('Error saving palette:', error);
      return false;
    }
  },

  /**
   * Delete a palette from storage
   * @param {string} paletteId - ID of palette to delete
   * @returns {Promise<boolean>} Success status
   */
  async deletePalette(paletteId) {
    try {
      const palettes = await this.getAllPalettes();
      const filtered = palettes.filter(p => p.id !== paletteId);
      await chrome.storage.local.set({ palettes: filtered });
      return true;
    } catch (error) {
      console.error('Error deleting palette:', error);
      return false;
    }
  },

  /**
   * Get a single palette by ID
   * @param {string} paletteId - ID of palette to retrieve
   * @returns {Promise<Object|null>} Palette object or null if not found
   */
  async getPalette(paletteId) {
    try {
      const palettes = await this.getAllPalettes();
      return palettes.find(p => p.id === paletteId) || null;
    } catch (error) {
      console.error('Error getting palette:', error);
      return null;
    }
  },

  /**
   * Add a color to a palette
   * @param {string} paletteId - ID of palette
   * @param {Object} color - Color object with rgb and hsv
   * @returns {Promise<boolean>} Success status
   */
  async addColorToPalette(paletteId, color) {
    try {
      const palette = await this.getPalette(paletteId);
      if (!palette) return false;

      if (!palette.colors) {
        palette.colors = [];
      }

      palette.colors.push(color);
      return await this.savePalette(palette);
    } catch (error) {
      console.error('Error adding color to palette:', error);
      return false;
    }
  },

  /**
   * Remove a color from a palette
   * @param {string} paletteId - ID of palette
   * @param {number} colorIndex - Index of color to remove
   * @returns {Promise<boolean>} Success status
   */
  async removeColorFromPalette(paletteId, colorIndex) {
    try {
      const palette = await this.getPalette(paletteId);
      if (!palette || !palette.colors) return false;

      palette.colors.splice(colorIndex, 1);
      return await this.savePalette(palette);
    } catch (error) {
      console.error('Error removing color from palette:', error);
      return false;
    }
  },

  /**
   * Export all palettes to JSON
   * @returns {Promise<string>} JSON string of all palettes
   */
  async exportPalettes() {
    try {
      const palettes = await this.getAllPalettes();
      return JSON.stringify(palettes, null, 2);
    } catch (error) {
      console.error('Error exporting palettes:', error);
      return '[]';
    }
  },

  /**
   * Import palettes from JSON
   * @param {string} jsonString - JSON string of palettes
   * @param {boolean} merge - If true, merge with existing palettes; if false, replace
   * @returns {Promise<boolean>} Success status
   */
  async importPalettes(jsonString, merge = true) {
    try {
      const importedPalettes = JSON.parse(jsonString);

      if (!Array.isArray(importedPalettes)) {
        throw new Error('Invalid palette data');
      }

      let palettes = [];
      if (merge) {
        palettes = await this.getAllPalettes();

        // Assign new IDs to imported palettes to avoid conflicts
        importedPalettes.forEach(palette => {
          palette.id = Date.now().toString() + Math.random().toString(36).substring(2);
          palette.importedAt = new Date().toISOString();
          palettes.push(palette);
        });
      } else {
        palettes = importedPalettes;
      }

      await chrome.storage.local.set({ palettes });
      return true;
    } catch (error) {
      console.error('Error importing palettes:', error);
      return false;
    }
  }
};
