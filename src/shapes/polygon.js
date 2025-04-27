// src/shapes/polygon.js
export class Polygon {
    constructor(options = {}) {
      // Core properties
      this.id = options.id || `polygon-${Math.random().toString(36).slice(2, 9)}`;
      this.classes = options.classes || [];
      
      // Points configuration (required)
      if (!options.points || options.points.length < 3) {
        throw new Error('Polygon requires at least 3 points');
      }
      this.points = options.points;
      
      // Transformations
      this.center = options.center || this._calculateCentroid();
      this.rotation = options.rotation || 0;
      this.scale = options.scale || 1;
      this.flipX = options.flipX || false;
      this.flipY = options.flipY || false;
      
      // Style properties
      this.fill = options.fill || 'transparent';
      this.stroke = options.stroke || '#000000';
      this.strokeWidth = options.strokeWidth || 1;
      this.strokeDasharray = options.strokeDasharray || [];
      this.opacity = options.opacity !== undefined ? options.opacity : 1;
      this.style = options.style || {};
      
      // Advanced features
      this.closePath = options.closePath !== false; // default true
      this.fillRule = options.fillRule || 'nonzero'; // or 'evenodd'
    }
  
    // Calculate centroid of the polygon
    _calculateCentroid() {
      let x = 0, y = 0;
      for (const point of this.points) {
        x += point.x;
        y += point.y;
      }
      return {
        x: x / this.points.length,
        y: y / this.points.length
      };
    }
  
    // Get transformed points (applying scale, flip, rotation)
    get transformedPoints() {
      return this.points.map(point => {
        // Apply scale first
        let x = point.x * this.scale;
        let y = point.y * this.scale;
        
        // Apply flips
        if (this.flipX) x = -x;
        if (this.flipY) y = -y;
        
        // Apply rotation if needed
        if (this.rotation !== 0) {
          const rad = (this.rotation * Math.PI) / 180;
          const cos = Math.cos(rad);
          const sin = Math.sin(rad);
          const tx = x * cos - y * sin;
          const ty = x * sin + y * cos;
          x = tx;
          y = ty;
        }
        
        // Apply center offset
        return {
          x: x + this.center.x,
          y: y + this.center.y
        };
      });
    }
  
    toSVG() {
      const pointsString = this.transformedPoints
        .map(p => `${p.x},${p.y}`)
        .join(' ');
  
      const attributes = {
        points: pointsString,
        fill: this.fill,
        'fill-rule': this.fillRule,
        stroke: this.stroke,
        'stroke-width': this.strokeWidth,
        'stroke-dasharray': this.strokeDasharray.join(','),
        opacity: this.opacity,
        class: this.classes.join(' '),
        id: this.id,
        style: Object.entries(this.style)
          .map(([key, value]) => `${key}:${value}`)
          .join(';')
      };
  
      const attributeString = Object.entries(attributes)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
  
      return `<polygon ${attributeString} />`;
    }
  
    // Calculate area using shoelace formula
    get area() {
      let area = 0;
      const n = this.points.length;
      
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        area += this.points[i].x * this.points[j].y;
        area -= this.points[j].x * this.points[i].y;
      }
      
      return Math.abs(area / 2);
    }
  
    // Check if point is inside polygon using ray-casting algorithm
    containsPoint(point) {
      const x = point.x - this.center.x;
      const y = point.y - this.center.y;
      
      let inside = false;
      const n = this.points.length;
      
      for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi = this.points[i].x;
        const yi = this.points[i].y;
        const xj = this.points[j].x;
        const yj = this.points[j].y;
        
        const intersect = ((yi > y) !== (yj > y)) &&
          (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        
        if (intersect) inside = !inside;
      }
      
      return inside;
    }
  
    // Get bounding box
    getBBox() {
      const xs = this.transformedPoints.map(p => p.x);
      const ys = this.transformedPoints.map(p => p.y);
  
      return {
        x: Math.min(...xs),
        y: Math.min(...ys),
        width: Math.max(...xs) - Math.min(...xs),
        height: Math.max(...ys) - Math.min(...ys)
      };
    }
  
    // Add a point to the polygon
    addPoint(point) {
      this.points.push(point);
      this.center = this._calculateCentroid();
    }
  
    // Remove a point by index
    removePoint(index) {
      if (index >= 0 && index < this.points.length) {
        this.points.splice(index, 1);
        this.center = this._calculateCentroid();
      }
    }
  }