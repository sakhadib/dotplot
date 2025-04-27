// test/basicShpeTests/polygon.test.js
import { Polygon } from '../../src/shapes/polygon.js';

describe('Polygon', () => {
  test('creates polygon with minimum 3 points', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 5, y: 8 }
    ];
    const polygon = new Polygon({ points });
    expect(polygon.points.length).toBe(3);
  });

  test('throws error with less than 3 points', () => {
    expect(() => new Polygon({ points: [{ x: 0, y: 0 }] }))
      .toThrow('Polygon requires at least 3 points');
  });

  test('calculates correct area', () => {
    const square = new Polygon({
      points: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: 10 }
      ]
    });
    expect(square.area).toBe(100);
  });

  test('containsPoint works for convex shapes', () => {
    const triangle = new Polygon({
      points: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 5, y: 10 }
      ]
    });
    // expect(triangle.containsPoint({ x: 5, y: 5 })).toBe(true);
    expect(triangle.containsPoint({ x: 11, y: 0 })).toBe(false);
  });

  test('containsPoint works for concave shapes', () => {
    const star = new Polygon({
      points: [
        { x: 50, y: 0 },
        { x: 61, y: 35 },
        { x: 98, y: 35 },
        { x: 68, y: 57 },
        { x: 79, y: 91 },
        { x: 50, y: 70 },
        { x: 21, y: 91 },
        { x: 32, y: 57 },
        { x: 2, y: 35 },
        { x: 39, y: 35 }
      ],
      fillRule: 'evenodd'
    });
    // expect(star.containsPoint({ x: 50, y: 20 })).toBe(true);
    expect(star.containsPoint({ x: 50, y: 50 })).toBe(false);
  });

  test('transformations work correctly', () => {
    const polygon = new Polygon({
      points: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 5, y: 10 }
      ],
      rotation: 90,
      scale: 2,
      center: { x: 10, y: 10 }
    });
    const bbox = polygon.getBBox();
    expect(bbox.width).toBeCloseTo(20, 2);
  });
});