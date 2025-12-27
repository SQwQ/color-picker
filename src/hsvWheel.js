// HSV Color Wheel with Hue Ring and SV Triangle
class HSVColorWheel {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.outerRadius = 90;
    this.innerRadius = 70;
    this.currentHue = 0;
    this.currentSaturation = 100;
    this.currentValue = 100;

    this.hueIndicator = { angle: 0 };
    this.svIndicator = { x: 0, y: 0 };

    this.onColorChange = null; // Callback for color changes

    // Add click event listener
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
  }

  drawHueRing() {
    const ctx = this.ctx;
    const steps = 360;

    // Draw each hue segment
    for (let i = 0; i < steps; i++) {
      const startAngle = (i / steps) * 2 * Math.PI - Math.PI / 2; // Start at top (12 o'clock)
      const endAngle = ((i + 1) / steps) * 2 * Math.PI - Math.PI / 2;
      const hue = (i / steps) * 360;

      ctx.beginPath();
      ctx.arc(this.centerX, this.centerY, this.outerRadius, startAngle, endAngle);
      ctx.arc(this.centerX, this.centerY, this.innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fill();
    }
  }

  // Calculate triangle vertices based on current hue
  getTriangleVertices() {
    const radius = this.innerRadius - 5;

    // Top vertex (pure hue - 100% saturation, 100% value)
    const topAngle = -Math.PI / 2; // Point upward
    const top = {
      x: this.centerX + radius * Math.cos(topAngle),
      y: this.centerY + radius * Math.sin(topAngle)
    };

    // Bottom left vertex (white - 0% saturation, 100% value)
    const bottomLeftAngle = topAngle + (2 * Math.PI / 3);
    const bottomLeft = {
      x: this.centerX + radius * Math.cos(bottomLeftAngle),
      y: this.centerY + radius * Math.sin(bottomLeftAngle)
    };

    // Bottom right vertex (black - 0% value)
    const bottomRightAngle = topAngle + (4 * Math.PI / 3);
    const bottomRight = {
      x: this.centerX + radius * Math.cos(bottomRightAngle),
      y: this.centerY + radius * Math.sin(bottomRightAngle)
    };

    return { top, bottomLeft, bottomRight };
  }

  drawSVTriangle() {
    const ctx = this.ctx;
    const vertices = this.getTriangleVertices();
    const { top, bottomLeft, bottomRight } = vertices;

    // Create a fine gradient mesh for the triangle
    const steps = 50;

    for (let i = 0; i < steps; i++) {
      for (let j = 0; j < steps - i; j++) {
        const u = i / steps;
        const v = j / steps;
        const w = 1 - u - v;

        if (w < 0) continue;

        // Interpolate position
        const x = top.x * w + bottomLeft.x * u + bottomRight.x * v;
        const y = top.y * w + bottomLeft.y * u + bottomRight.y * v;

        // Calculate HSV values at this position
        // Top = full hue (S=100%, V=100%)
        // Bottom left = white (S=0%, V=100%)
        // Bottom right = black (V=0%)
        const saturation = w * 100 + v * 0; // Interpolate between top and bottom
        const value = w * 100 + u * 100; // White on left, black on right

        // Convert HSV to RGB for rendering
        const rgb = this.hsvToRgb(this.currentHue, saturation, value);

        ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        ctx.fillRect(x - 1, y - 1, 3, 3);
      }
    }

    // Draw triangle outline
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(bottomLeft.x, bottomLeft.y);
    ctx.lineTo(bottomRight.x, bottomRight.y);
    ctx.closePath();
    ctx.stroke();
  }

  hsvToRgb(h, s, v) {
    s = s / 100;
    v = v / 100;
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r, g, b;

    if (h >= 0 && h < 60) {
      [r, g, b] = [c, x, 0];
    } else if (h >= 60 && h < 120) {
      [r, g, b] = [x, c, 0];
    } else if (h >= 120 && h < 180) {
      [r, g, b] = [0, c, x];
    } else if (h >= 180 && h < 240) {
      [r, g, b] = [0, x, c];
    } else if (h >= 240 && h < 300) {
      [r, g, b] = [x, 0, c];
    } else {
      [r, g, b] = [c, 0, x];
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw hue ring
    this.drawHueRing();

    // Draw SV triangle
    this.drawSVTriangle();
  }

  drawIndicators(hue, saturation, value) {
    this.currentHue = hue;
    this.currentSaturation = saturation;
    this.currentValue = value;

    // Redraw the wheel
    this.draw();

    const ctx = this.ctx;

    // Draw hue indicator on ring
    const hueAngle = (hue / 360) * 2 * Math.PI - Math.PI / 2; // -90 degrees offset
    const ringRadius = (this.outerRadius + this.innerRadius) / 2;
    const hueX = this.centerX + ringRadius * Math.cos(hueAngle);
    const hueY = this.centerY + ringRadius * Math.sin(hueAngle);

    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(hueX, hueY, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Draw SV indicator in triangle
    const vertices = this.getTriangleVertices();
    const svPosition = this.getSVPosition(saturation, value, vertices);

    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(svPosition.x, svPosition.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  getSVPosition(saturation, value, vertices) {
    const { top, bottomLeft, bottomRight } = vertices;

    // Convert S,V to barycentric coordinates
    // Top vertex: S=100%, V=100%
    // Bottom left: S=0%, V=100%
    // Bottom right: S=any, V=0%

    const s = saturation / 100;
    const v = value / 100;

    // Interpolate within the triangle
    // w = weight for top (pure hue)
    // u = weight for bottom left (white)
    // v_weight = weight for bottom right (black)

    const v_weight = 1 - v; // How much black
    const remaining = 1 - v_weight;
    const w = remaining * s; // Pure hue component
    const u = remaining * (1 - s); // White component

    const x = top.x * w + bottomLeft.x * u + bottomRight.x * v_weight;
    const y = top.y * w + bottomLeft.y * u + bottomRight.y * v_weight;

    return { x, y };
  }

  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const dx = x - this.centerX;
    const dy = y - this.centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if click is in hue ring
    if (distance >= this.innerRadius && distance <= this.outerRadius) {
      this.handleHueRingClick(x, y);
    }
    // Check if click is in SV triangle
    else if (distance < this.innerRadius) {
      this.handleTriangleClick(x, y);
    }
  }

  handleHueRingClick(x, y) {
    const dx = x - this.centerX;
    const dy = y - this.centerY;
    let angle = Math.atan2(dy, dx);

    // Convert to degrees with -90 offset to match ring orientation (0° at top)
    // atan2 gives angle from right (+X axis), we add 90 to make 0° at top (-Y axis)
    let hue = ((angle * 180 / Math.PI) + 90 + 360) % 360;

    this.currentHue = hue;
    this.drawIndicators(this.currentHue, this.currentSaturation, this.currentValue);

    if (this.onColorChange) {
      this.onColorChange(this.currentHue, this.currentSaturation, this.currentValue);
    }
  }

  handleTriangleClick(x, y) {
    const vertices = this.getTriangleVertices();
    const { top, bottomLeft, bottomRight } = vertices;

    // Convert click position to barycentric coordinates
    const v0x = bottomLeft.x - top.x;
    const v0y = bottomLeft.y - top.y;
    const v1x = bottomRight.x - top.x;
    const v1y = bottomRight.y - top.y;
    const v2x = x - top.x;
    const v2y = y - top.y;

    const dot00 = v0x * v0x + v0y * v0y;
    const dot01 = v0x * v1x + v0y * v1y;
    const dot02 = v0x * v2x + v0y * v2y;
    const dot11 = v1x * v1x + v1y * v1y;
    const dot12 = v1x * v2x + v1y * v2y;

    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    // Check if point is inside triangle
    if (u >= 0 && v >= 0 && u + v <= 1) {
      const w = 1 - u - v;

      // Calculate saturation and value from barycentric coordinates
      // w = pure hue weight, u = white weight, v = black weight
      const value = (w + u) * 100; // Value = not black
      const saturation = value > 0 ? (w / (w + u)) * 100 : 0; // Saturation = hue proportion

      this.currentSaturation = Math.round(saturation);
      this.currentValue = Math.round(value);

      this.drawIndicators(this.currentHue, this.currentSaturation, this.currentValue);

      if (this.onColorChange) {
        this.onColorChange(this.currentHue, this.currentSaturation, this.currentValue);
      }
    }
  }
}
