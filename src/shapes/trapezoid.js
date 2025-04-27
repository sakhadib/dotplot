import { BaseShape } from './baseShape.js';

export class Trapezoid extends BaseShape {
  constructor(options = {}) {
    super(options);
    
    this.center = options.center || { x: 0, y: 0 };
    this.topWidth = options.topWidth || 30;
    this.bottomWidth = options.bottomWidth || 50;
    this.height = options.height || 40;
    this.offset = options.offset || 0;
    
    this.fill = options.fill || 'transparent';
    this.stroke = options.stroke || '#000000';
    this.strokeWidth = options.strokeWidth || 1;
    this.dashArray = options.dashArray || [];
    this.rotation = options.rotation || 0;
  }

  // Add area getter
  get area() {
    return ((this.topWidth + this.bottomWidth) / 2) * this.height;
  }

  toSVG() {
    const halfTop = this.topWidth / 2;
    const halfBottom = this.bottomWidth / 2;
    const halfHeight = this.height / 2;
    
    const points = [
      // Top-left
      { 
        x: this.center.x - halfTop + this.offset, 
        y: this.center.y - halfHeight 
      },
      // Top-right
      { 
        x: this.center.x + halfTop + this.offset, 
        y: this.center.y - halfHeight 
      },
      // Bottom-right
      { 
        x: this.center.x + halfBottom, 
        y: this.center.y + halfHeight 
      },
      // Bottom-left
      { 
        x: this.center.x - halfBottom, 
        y: this.center.y + halfHeight 
      }
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

    const attrString = Object.entries(attrs)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    return `<polygon ${attrString} />`;
  }

  containsPoint(point) {
    // Convert to trapezoid-local coordinates
    let localX = point.x - this.center.x;
    let localY = point.y - this.center.y;
    
    // Account for rotation if needed
    if (this.rotation !== 0) {
      const angleRad = -this.rotation * Math.PI / 180;
      const cos = Math.cos(angleRad);
      const sin = Math.sin(angleRad);
      const rotatedX = localX * cos - localY * sin;
      const rotatedY = localX * sin + localY * cos;
      localX = rotatedX;
      localY = rotatedY;
    }
    
    const halfH = this.height / 2;
    if (Math.abs(localY) > halfH) return false;
    
    // Calculate width at current y-level
    const t = (localY + halfH) / this.height; // 0 at bottom, 1 at top
    const currentWidth = this.bottomWidth + (this.topWidth - this.bottomWidth) * t;
    const currentOffset = this.offset * t; // Offset affects top more than bottom
    
    const leftEdge = -currentWidth/2 + currentOffset;
    const rightEdge = currentWidth/2 + currentOffset;
    
    return localX >= leftEdge && localX <= rightEdge;
  }

  getBBox() {
    const halfTop = this.topWidth / 2;
    const halfBottom = this.bottomWidth / 2;
    const halfHeight = this.height / 2;
    
    const left = Math.min(
      -halfTop + this.offset,
      -halfBottom
    );
    const right = Math.max(
      halfTop + this.offset,
      halfBottom
    );
    
    return {
      x: this.center.x + left,
      y: this.center.y - halfHeight,
      width: right - left,
      height: this.height
    };
  }
}