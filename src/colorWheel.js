// Color wheel rendering and interaction

class ColorWheel {
  /**
   * Create a color wheel instance
   * @param {HTMLCanvasElement} canvas - Canvas element to draw on
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.radius = canvas.width / 2;
    this.centerX = this.radius;
    this.centerY = this.radius;
    this.markers = []; // Array of {h, s, v} color markers
  }

  /**
   * Draw the color wheel
   */
  draw() {
    const ctx = this.ctx;
    const centerX = this.centerX;
    const centerY = this.centerY;
    const radius = this.radius - 10; // Leave margin

    // Clear canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw color wheel using radial segments
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = (angle - 90) * Math.PI / 180;
      const endAngle = (angle + 1 - 90) * Math.PI / 180;

      for (let r = 0; r < radius; r += 1) {
        const sat = (r / radius) * 100;
        const val = 100; // Full brightness for the wheel

        const rgb = hsvToRgb(angle, sat, val);
        ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, startAngle, endAngle);
        ctx.arc(centerX, centerY, r + 1, endAngle, startAngle, true);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw white center circle for low saturation
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 0.2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.2, 0, 2 * Math.PI);
    ctx.fill();

    // Draw outer border
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  /**
   * Draw markers on the color wheel for multiple colors
   * @param {Array} colors - Array of color objects with hsv property
   */
  drawWithMarkers(colors) {
    this.draw();

    if (!colors || colors.length === 0) return;

    const ctx = this.ctx;
    const radius = this.radius - 10;

    colors.forEach(color => {
      if (!color.hsv) return;

      const pos = hsvToWheelPosition(color.hsv.h, color.hsv.s, radius);
      const x = this.centerX + pos.x;
      const y = this.centerY + pos.y;

      // Draw marker
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  /**
   * Get HSV color at a specific position on the wheel
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {Object|null} HSV object or null if outside wheel
   */
  getColorAtPosition(x, y) {
    const radius = this.radius - 10;
    const relX = x - this.centerX;
    const relY = y - this.centerY;
    const distance = Math.sqrt(relX * relX + relY * relY);

    if (distance > radius) {
      return null;
    }

    const hsv = wheelPositionToHsv(relX, relY, radius);
    return { h: hsv.h, s: hsv.s, v: 100 };
  }

  /**
   * Get canvas position for a given HSV color
   * @param {number} h - Hue (0-360)
   * @param {number} s - Saturation (0-100)
   * @returns {Object} Position object with x, y coordinates
   */
  getPositionForColor(h, s) {
    const radius = this.radius - 10;
    const pos = hsvToWheelPosition(h, s, radius);

    return {
      x: this.centerX + pos.x,
      y: this.centerY + pos.y
    };
  }
}

/**
 * Update color indicator position on the UI
 * @param {HTMLElement} indicator - Color indicator element
 * @param {number} x - X position
 * @param {number} y - Y position
 */
function updateColorIndicator(indicator, x, y) {
  indicator.style.left = `${x}px`;
  indicator.style.top = `${y}px`;
  indicator.classList.add('active');
}

/**
 * Hide color indicator
 * @param {HTMLElement} indicator - Color indicator element
 */
function hideColorIndicator(indicator) {
  indicator.classList.remove('active');
}
