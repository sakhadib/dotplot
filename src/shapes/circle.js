import { BaseShape } from './baseShape.js';

export class Circle extends BaseShape {
  constructor(options = {}) {
    super(options);
    this.center = options.center || { x: 0, y: 0 };
    this.radius = options.radius || 10;
    this.fill = options.fill || 'transparent';
    this.stroke = options.stroke || '#000';
    this.strokeWidth = options.strokeWidth || 1;
  }

  toSVG() {
    return `
      <circle 
        cx="${this.center.x}" 
        cy="${this.center.y}" 
        r="${this.radius}"
        fill="${this.fill}"
        stroke="${this.stroke}"
        stroke-width="${this.strokeWidth}"
      />
    `;
  }
}