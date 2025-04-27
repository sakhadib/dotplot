import { Rectangle } from '../src/shapes/rectangle.js';

describe('Rectangle', () => {
  test('creates default rectangle', () => {
    const rect = new Rectangle();
    expect(rect.width).toBe(30);
    expect(rect.height).toBe(20);
    expect(rect.cornerRadius).toBe(0);
  });

  test('generates correct SVG', () => {
    const rect = new Rectangle({
      position: { x: 10, y: 20 },
      width: 50,
      height: 30,
      fill: '#00ff00'
    });
    const svg = rect.toSVG();
    expect(svg).toContain('x="10"');
    expect(svg).toContain('width="50"');
    expect(svg).toContain('fill="#00ff00"');
  });

  test('handles rounded corners', () => {
    const rect = new Rectangle({
      cornerRadius: 5
    });
    expect(rect.toSVG()).toContain('rx="5"');
  });

  test('calculates center correctly', () => {
    const rect = new Rectangle({
      position: { x: 100, y: 100 },
      width: 40,
      height: 60
    });
    expect(rect.center).toEqual({ x: 120, y: 130 });
  });

  test('handles rotation', () => {
    const rect = new Rectangle({
      position: { x: 50, y: 50 },
      width: 40,
      height: 40,
      rotation: 45
    });
    const svg = rect.toSVG();
    expect(svg).toContain('rotate(45 70 70)'); // Rotates around center
  });
});