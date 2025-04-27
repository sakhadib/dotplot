// src/shapes/rightAngleTriangle.js
export class RightAngleTriangle {
    constructor(options = {}) {
      // Identification
      this.id = options.id || `triangle-${Math.random().toString(36).slice(2, 9)}`;
      this.classes = options.classes || [];
      
      // Dimensions
      this.base = options.base || 40;
      this.height = options.height || 30;
      
      // Positioning
      this.rightAnglePosition = options.rightAnglePosition || 'bottom-left';
      this.center = options.center || { x: 0, y: 0 };
      
      // Transformations
      this.rotation = options.rotation || 0;
      this.flipHorizontal = options.flipHorizontal || false;
      this.flipVertical = options.flipVertical || false;
      this.scale = options.scale || 1;
      
      // Style properties
      this.fill = options.fill || 'transparent';
      this.stroke = options.stroke || '#000000';
      this.strokeWidth = options.strokeWidth || 1;
      this.strokeDasharray = options.strokeDasharray || [];
      this.opacity = options.opacity !== undefined ? options.opacity : 1;
      this.style = options.style || {};
      
      // Generate points
      this.points = this._generatePoints();
    }
  
    _generatePoints() {
      // Start with bottom-left right angle as default
      let points = [
        { x: 0, y: 0 },          // Right angle point
        { x: this.base, y: 0 },  // Bottom right
        { x: 0, y: -this.height } // Top left
      ];
  
      // Adjust points based on right angle position
      switch (this.rightAnglePosition) {
        case 'bottom-right':
          points = [
            { x: 0, y: 0 },
            { x: -this.base, y: 0 },
            { x: 0, y: -this.height }
          ];
          break;
        case 'top-left':
          points = [
            { x: 0, y: 0 },
            { x: this.base, y: 0 },
            { x: 0, y: this.height }
          ];
          break;
        case 'top-right':
          points = [
            { x: 0, y: 0 },
            { x: -this.base, y: 0 },
            { x: 0, y: this.height }
          ];
          break;
      }
  
      // Apply flips
      if (this.flipHorizontal) {
        points = points.map(p => ({ x: -p.x, y: p.y }));
      }
      if (this.flipVertical) {
        points = points.map(p => ({ x: p.x, y: -p.y }));
      }

    // Replace '-0' with '0' in points
    points = points.map(p => ({
      x: p.x === -0 ? 0 : p.x,
      y: p.y === -0 ? 0 : p.y
    }));
  
      // Apply scale
      if (this.scale !== 1) {
        points = points.map(p => ({
          x: p.x * this.scale,
          y: p.y * this.scale
        }));
      }
  
      return points;
    }
  
    toSVG() {
      const pointsString = this.points
        .map(p => `${p.x + this.center.x},${p.y + this.center.y}`)
        .join(' ');
  
      const attributes = {
        points: pointsString,
        fill: this.fill,
        stroke: this.stroke,
        'stroke-width': this.strokeWidth,
        'stroke-dasharray': this.strokeDasharray.join(','),
        opacity: this.opacity,
        transform: [
          this.rotation ? `rotate(${this.rotation} ${this.center.x} ${this.center.y})` : null,
          ...(this.style.transform ? [this.style.transform] : [])
        ].filter(Boolean).join(' '),
        class: this.classes.join(' '),
        id: this.id,
        style: Object.entries(this.style)
          .filter(([key]) => key !== 'transform')
          .map(([key, value]) => `${key}:${value}`)
          .join(';')
      };
  
      const attributeString = Object.entries(attributes)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
  
      return `<polygon ${attributeString} />`;
    }
  
    get area() {
      return (this.base * this.height) / 2;
    }
  
    containsPoint(point) {
      // Convert to triangle-local coordinates
      const localX = point.x - this.center.x;
      const localY = point.y - this.center.y;
  
      // Get the three points
      const [a, b, c] = this.points;
  
      // Barycentric coordinate method
      const v0 = { x: c.x - a.x, y: c.y - a.y };
      const v1 = { x: b.x - a.x, y: b.y - a.y };
      const v2 = { x: localX - a.x, y: localY - a.y };
  
      const dot00 = v0.x * v0.x + v0.y * v0.y;
      const dot01 = v0.x * v1.x + v0.y * v1.y;
      const dot02 = v0.x * v2.x + v0.y * v2.y;
      const dot11 = v1.x * v1.x + v1.y * v1.y;
      const dot12 = v1.x * v2.x + v1.y * v2.y;
  
      const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
      const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
      const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
  
      return (u >= 0) && (v >= 0) && (u + v < 1);
    }
  
    getBBox() {
      const xs = this.points.map(p => p.x + this.center.x);
      const ys = this.points.map(p => p.y + this.center.y);
  
      return {
        x: Math.min(...xs),
        y: Math.min(...ys),
        width: Math.max(...xs) - Math.min(...xs),
        height: Math.max(...ys) - Math.min(...ys)
      };
    }
  }