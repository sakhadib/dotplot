import { BaseShape } from './baseShape.js';

export class Line extends BaseShape {
  constructor(options = {}) {
    super(options);
    
    // Points
    this.start = options.start || { x: 0, y: 0 };
    this.end = options.end || { x: 50, y: 50 };
    
    // Style
    this.stroke = options.stroke || '#000000';
    this.strokeWidth = options.strokeWidth || 2;
    this.dashArray = options.dashArray || [];
    
    // Arrows
    this.arrowStart = options.arrowStart || false;
    this.arrowEnd = options.arrowEnd || false;
    this.arrowSize = options.arrowSize || 8;
  }

  toSVG() {
    // Main line
    const lineAttrs = {
      x1: this.start.x,
      y1: this.start.y,
      x2: this.end.x,
      y2: this.end.y,
      stroke: this.stroke,
      'stroke-width': this.strokeWidth,
      'stroke-dasharray': this.dashArray.join(','),
      'marker-start': this.arrowStart ? `url(#arrow-start-${this.id})` : undefined,
      'marker-end': this.arrowEnd ? `url(#arrow-end-${this.id})` : undefined
    };

    const lineAttrString = Object.entries(lineAttrs)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    // Arrow markers (if needed)
    let markers = '';
    if (this.arrowStart || this.arrowEnd) {
      markers = `
        <defs>
          ${this.arrowStart ? this._createArrowMarker('start') : ''}
          ${this.arrowEnd ? this._createArrowMarker('end') : ''}
        </defs>
      `;
    }

    return `${markers}<line ${lineAttrString} />`;
  }

  _createArrowMarker(type) {
    const id = `arrow-${type}-${this.id}`;
    const orient = type === 'start' ? 'auto-start-reverse' : 'auto';
    const color = this.stroke;
    
    return `
      <marker id="${id}"
              markerWidth="${this.arrowSize}" 
              markerHeight="${this.arrowSize}"
              refX="${type === 'start' ? this.arrowSize : 0}"
              refY="${this.arrowSize/2}"
              orient="${orient}">
        <path d="M0,0 L${this.arrowSize},${this.arrowSize/2} L0,${this.arrowSize} Z" 
              fill="${color}" />
      </marker>
    `;
  }

  // Get length of line
  get length() {
    const dx = this.end.x - this.start.x;
    const dy = this.end.y - this.start.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Get angle in degrees
  get angle() {
    const dx = this.end.x - this.start.x;
    const dy = this.end.y - this.start.y;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }

  // Get bounding box
  getBBox() {
    return {
      x: Math.min(this.start.x, this.end.x),
      y: Math.min(this.start.y, this.end.y),
      width: Math.abs(this.end.x - this.start.x),
      height: Math.abs(this.end.y - this.start.y)
    };
  }
}