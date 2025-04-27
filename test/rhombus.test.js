import { Rhombus } from '../src/shapes/rhombus.js';

describe('Rhombus', () => {
  test('creates default rhombus', () => {
    const rhombus = new Rhombus();
    expect(rhombus.width).toBe(40);
    expect(rhombus.height).toBe(60);
  });

  test('generates correct SVG points', () => {
    const rhombus = new Rhombus({
      center: { x: 50, y: 50 },
      width: 40,
      height: 60
    });
    const svg = rhombus.toSVG();
    expect(svg).toContain('points="50,20 70,50 50,80 30,50"');
  });

  test('handles rotation in SVG', () => {
    const rhombus = new Rhombus({
      center: { x: 50, y: 50 },
      rotation: 45
    });
    expect(rhombus.toSVG()).toContain('rotate(45 50 50)');
  });

  test('containsPoint works with rotation', () => {
    const rhombus = new Rhombus({
      center: { x: 50, y: 50 },
      width: 40,
      height: 60,
      rotation: 45
    });
    expect(rhombus.containsPoint({ x: 50, y: 50 })).toBe(true);
    expect(rhombus.containsPoint({ x: 70, y: 50 })).toBe(false);
  });

  test('getBBox accounts for rotation', () => {
    const rhombus = new Rhombus({
      center: { x: 50, y: 50 },
      width: 40,
      height: 60,
      rotation: 45
    });
    const bbox = rhombus.getBBox();
    expect(bbox.width).toBeCloseTo(70.71, 2); // 50 * √2
  });
});