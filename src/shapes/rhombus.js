import { BaseShape } from './baseShape.js';

export class Rhombus extends BaseShape {
  constructor(options = {}) {
    super(options);
    
    // Geometry
    this.center = options.center || { x: 0, y: 0 };
    this.width = options.width || 40;
    this.height = options.height || 60;
    
    // Styles
    this.fill = options.fill || 'transparent';
    this.stroke = options.stroke || '#000000';
    this.strokeWidth = options.strokeWidth || 1;
    this.dashArray = options.dashArray || [];
    this.rotation = options.rotation || 0; // Degrees
  }

  toSVG() {
    const points = [
      { x: this.center.x, y: this.center.y - this.height/2 }, // Top
      { x: this.center.x + this.width/2, y: this.center.y },  // Right
      { x: this.center.x, y: this.center.y + this.height/2 }, // Bottom
      { x: this.center.x - this.width/2, y: this.center.y }   // Left
    ];

    const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');

    const attrs = {
      points: pointsString,
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

    return `<polygon ${attrString} />`;
  }

  // Check if point is inside rhombus
  containsPoint(point) {
    // Transform point to unrotated coordinate system
    const angleRad = -this.rotation * Math.PI / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    
    const translatedX = point.x - this.center.x;
    const translatedY = point.y - this.center.y;
    
    const rotatedX = translatedX * cos - translatedY * sin;
    const rotatedY = translatedX * sin + translatedY * cos;
    
    // Check against diamond equation
    return (
      Math.abs(rotatedX) / (this.width/2) + 
      Math.abs(rotatedY) / (this.height/2) <= 1
    );
  }

  // Get bounding box (accounting for rotation)
  getBBox() {
    const angleRad = this.rotation * Math.PI / 180;
    const cos = Math.abs(Math.cos(angleRad));
    const sin = Math.abs(Math.sin(angleRad));
    
    const w = this.width/2;
    const h = this.height/2;
    
    const bboxWidth = w * cos + h * sin;
    const bboxHeight = w * sin + h * cos;
    
    return {
      x: this.center.x - bboxWidth,
      y: this.center.y - bboxHeight,
      width: bboxWidth * 2,
      height: bboxHeight * 2
    };
  }
}