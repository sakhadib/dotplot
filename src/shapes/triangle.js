import { BaseShape } from './baseShape.js';

export class Triangle extends BaseShape {
  constructor(options = {}) {
    super(options);
    
    // Points (default to equilateral triangle)
    this.points = options.points || [
      { x: 0, y: -20 },  // Top
      { x: -20, y: 20 }, // Bottom-left
      { x: 20, y: 20 }   // Bottom-right
    ];
    
    // Style
    this.fill = options.fill || 'transparent';
    this.stroke = options.stroke || '#000000';
    this.strokeWidth = options.strokeWidth || 1;
    this.dashArray = options.dashArray || [];
    this.rotation = options.rotation || 0; // Degrees
    this.center = options.center || this._calculateCenter();
  }

  toSVG() {
    const pointsString = this.points
      .map(p => `${p.x + this.center.x},${p.y + this.center.y}`)
      .join(' ');

    const attrs = {
      points: pointsString,
      fill: this.fill,
      stroke: this.stroke,
      'stroke-width': this.strokeWidth,
      'stroke-dasharray': this.dashArray.join(','),
      transform: this.rotation ? `rotate(${this.rotation} ${this.center.x} ${this.center.y})` : undefined
    };

    const attrString = Object.entries(attrs)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    return `<polygon ${attrString} />`;
  }

  _calculateCenter() {
    const avgX = (this.points[0].x + this.points[1].x + this.points[2].x) / 3;
    const avgY = (this.points[0].y + this.points[1].y + this.points[2].y) / 3;
    return { x: avgX, y: avgY };
  }

  // Calculate area using Heron's formula
  get area() {
    const [a, b, c] = this.sideLengths;
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  }

  // Get lengths of all sides
  get sideLengths() {
    return [
      this._distance(this.points[0], this.points[1]),
      this._distance(this.points[1], this.points[2]),
      this._distance(this.points[2], this.points[0])
    ];
  }

  _distance(p1, p2) {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  }

  containsPoint(point) {
    // Convert to triangle-local coordinates
    let localX = point.x - this.center.x;
    let localY = point.y - this.center.y;
    
    if (this.rotation !== 0) {
      const angleRad = -this.rotation * Math.PI / 180;
      const cos = Math.cos(angleRad);
      const sin = Math.sin(angleRad);
      localX = point.x * cos - point.y * sin;
      localY = point.x * sin + point.y * cos;
    }
    
    // Barycentric coordinate method
    const [a, b, c] = this.points;
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