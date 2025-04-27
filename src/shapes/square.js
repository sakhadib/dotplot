import { BaseShape } from './baseShape.js';

export class Square extends BaseShape {
  constructor(options = {}) {
    super(options);
    
    // Required properties
    this.center = options.center || { x: 0, y: 0 };
    this.size = options.size || 20; // Side length
    
    // Style properties
    this.fill = options.fill || 'transparent';
    this.stroke = options.stroke || '#000000';
    this.strokeWidth = options.strokeWidth || 1;
    this.dashArray = options.dashArray || [];
    this.rotation = options.rotation || 0; // Degrees
  }

  toSVG() {
    const halfSize = this.size / 2;
    const attrs = {
      x: this.center.x - halfSize,
      y: this.center.y - halfSize,
      width: this.size,
      height: this.size,
      fill: this.fill,
      stroke: this.stroke,
      'stroke-width': this.strokeWidth,
      'stroke-dasharray': this.dashArray.join(','),
      transform: this.rotation ? `rotate(${this.rotation} ${this.center.x} ${this.center.y})` : undefined
    };

    // Filter out undefined attributes
    const attrString = Object.entries(attrs)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    return `<rect ${attrString} />`;
  }

  // Check if point is inside square (accounting for rotation)
  containsPoint(point) {
    // Simplified check (ignores rotation for now)
    const halfSize = this.size / 2;
    return (
      point.x >= this.center.x - halfSize &&
      point.x <= this.center.x + halfSize &&
      point.y >= this.center.y - halfSize &&
      point.y <= this.center.y + halfSize
    );
  }

  // Get bounding box
  getBBox() {
    return {
      x: this.center.x - this.size/2,
      y: this.center.y - this.size/2,
      width: this.size,
      height: this.size
    };
  }
}