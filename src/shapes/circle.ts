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

    setCenter(newCenter: Point): string {
        this.center = newCenter;
        return this.toSVG();
    }

    setRadius(newRadius: number): string {
        this.radius = newRadius;
        return this.toSVG();
    }

    setStroke(newStroke: string): string {
        this.style.stroke = newStroke;
        return this.toSVG();
    }

    setFill(newFill: string): string {
        this.style.fill = newFill;
        return this.toSVG();
    }

    setStrokeWidth(newStrokeWidth: number): string {
        this.style.strokeWidth = newStrokeWidth;
        return this.toSVG();
    }

    setOpacity(newOpacity: number): string {
        this.style.opacity = newOpacity;
        return this.toSVG();
    }
}