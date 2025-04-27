import { Triangle } from '../../src/shapes/triangle.js';

describe('Triangle', () => {
  test('creates default triangle', () => {
    const triangle = new Triangle();
    expect(triangle.points.length).toBe(3);
    expect(triangle.area).toBeCloseTo(800, 0); // Area of default triangle
  });

  test('generates correct SVG', () => {
    const triangle = new Triangle({
      points: [
        { x: 0, y: 0 },
        { x: 50, y: 0 },
        { x: 25, y: 50 }
      ]
    });
    const svg = triangle.toSVG();
    expect(svg).toContain('points="25,16.666666666666668 75,16.666666666666668 50,66.66666666666667"');
  });

  test('containsPoint works', () => {
    const triangle = new Triangle({
      points: [
        { x: 0, y: 0 },
        { x: 50, y: 0 },
        { x: 25, y: 50 }
      ],
      center: { x: 0, y: 0 }
    });
    
    expect(triangle.containsPoint({ x: 25, y: 25 })).toBe(true);
    expect(triangle.containsPoint({ x: 10, y: 10 })).toBe(true);
    expect(triangle.containsPoint({ x: 40, y: 10 })).toBe(true);
    expect(triangle.containsPoint({ x: 25, y: -5 })).toBe(false);
  });

  test('rotation works', () => {
    const triangle = new Triangle({
      rotation: 90
    });
    expect(triangle.toSVG()).toContain('rotate(90');
  });
});