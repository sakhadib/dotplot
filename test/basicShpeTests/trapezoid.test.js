import { Trapezoid } from '../../src/shapes/trapezoid.js';

describe('Trapezoid', () => {
  test('creates symmetric trapezoid', () => {
    const trap = new Trapezoid({
      topWidth: 30,
      bottomWidth: 50,
      height: 40
    });
    expect(trap.area).toBe(1600); // (30+50)/2 * 40
  });

  test('generates correct SVG points', () => {
    const trap = new Trapezoid({
      center: { x: 50, y: 50 },
      topWidth: 20,
      bottomWidth: 40,
      height: 30
    });
    const svg = trap.toSVG();
    expect(svg).toContain('points="40,35 60,35 70,65 30,65"');
  });

  test('handles offset', () => {
    const trap = new Trapezoid({
      center: { x: 0, y: 0 },
      topWidth: 20,
      bottomWidth: 40,
      height: 40,
      offset: 10
    });
    const points = trap.toSVG().match(/points="([^"]*)"/)[1];
    expect(points).toContain('0,-20 20,-20');
  });
});