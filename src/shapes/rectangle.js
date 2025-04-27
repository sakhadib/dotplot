import { BaseShape } from './baseShape.js';

export class Rectangle extends BaseShape {
  constructor(options = {}) {
    super(options);
    
    // Dimensions
    this.position = options.position || { x: 0, y: 0 };
    this.width = options.width || 30;
    this.height = options.height || 20;
    this.cornerRadius = options.cornerRadius || 0; // For rounded corners
    
    // Styles
    this.fill = options.fill || 'transparent';
    this.stroke = options.stroke || '#000000';
    this.strokeWidth = options.strokeWidth || 1;
    this.dashArray = options.dashArray || [];
    this.rotation = options.rotation || 0; // Degrees
  }

  toSVG() {
    const attrs = {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height,
      rx: this.cornerRadius || undefined, // Only include if non-zero
      fill: this.fill,
      stroke: this.stroke,
      'stroke-width': this.strokeWidth,
      'stroke-dasharray': this.dashArray.join(','),
      transform: this.rotation 
        ? `rotate(${this.rotation} ${this.position.x + this.width/2} ${this.position.y + this.height/2})` 
        : undefined
    };

    // Filter out undefined attributes
    const attrString = Object.entries(attrs)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    return `<rect ${attrString} />`;
  }

  // Get center point (calculated property)
  get center() {
    return {
      x: this.position.x + this.width/2,
      y: this.position.y + this.height/2
    };
  }

  // Check if point is inside rectangle
  containsPoint(point) {
    return (
      point.x >= this.position.x &&
      point.x <= this.position.x + this.width &&
      point.y >= this.position.y &&
      point.y <= this.position.y + this.height
    );
  }

  // Get bounding box (same as rectangle dimensions)
  getBBox() {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height
    };
  }
}