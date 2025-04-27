import { Line } from '../../src/shapes/line.js';

describe('Line', () => {
  test('creates default line', () => {
    const line = new Line();
    expect(line.start).toEqual({ x: 0, y: 0 });
    expect(line.end).toEqual({ x: 50, y: 50 });
    expect(line.strokeWidth).toBe(2);
  });

  test('generates correct SVG', () => {
    const line = new Line({
      start: { x: 10, y: 20 },
      end: { x: 30, y: 40 },
      stroke: '#ff0000'
    });
    const svg = line.toSVG();
    expect(svg).toContain('x1="10"');
    expect(svg).toContain('y2="40"');
    expect(svg).toContain('stroke="#ff0000"');
  });

  test('calculates length correctly', () => {
    const line = new Line({
      start: { x: 0, y: 0 },
      end: { x: 3, y: 4 }
    });
    expect(line.length).toBe(5); // 3-4-5 triangle
  });

  test('handles arrows', () => {
    const line = new Line({
      arrowStart: true,
      arrowEnd: true,
      arrowSize: 10
    });
    const svg = line.toSVG();
    expect(svg).toContain('marker-start');
    expect(svg).toContain('marker-end');
    expect(svg).toContain('markerWidth="10"');
  });

  test('calculates angle correctly', () => {
    const horizontal = new Line({
      start: { x: 0, y: 0 },
      end: { x: 10, y: 0 }
    });
    expect(horizontal.angle).toBe(0);
    
    const vertical = new Line({
      start: { x: 0, y: 0 },
      end: { x: 0, y: 10 }
    });
    expect(vertical.angle).toBe(90);
  });
});