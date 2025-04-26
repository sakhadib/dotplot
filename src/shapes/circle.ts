import type { Point, Style} from '../types';

export class Circle {
    center: Point;
    radius: number;
    style: Style;

    constructor(center: Point, radius: number, style: Style) {
        this.center = center;
        this.radius = radius;
        this.style = style;
    }

    toSVG(): string {
        const {fill = 'none', stroke = 'black', strokeWidth = 1, opacity = 1} = this.style;
        return `<circle cx="${this.center.x}" cy="${this.center.y}" r="${this.radius}" fill="${this.style.fill}" stroke="${this.style.stroke}" stroke-width="${this.style.strokeWidth}" opacity="${this.style.opacity}"/>`;
    }

    setCenter(newCenter: Point): void {
        this.center = newCenter;
    }

    setRadius(newRadius: number): void {
        this.radius = newRadius;
    }

    setStroke(newStroke: string): void {
        this.style.stroke = newStroke;
    }

    setFill(newFill: string): void {
        this.style.fill = newFill;
    }

    setStrokeWidth(newStrokeWidth: number): void {
        this.style.strokeWidth = newStrokeWidth;
    }

    setOpacity(newOpacity: number): void {
        this.style.opacity = newOpacity;
    }
}