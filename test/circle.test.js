import { Circle } from '../src/shapes/circle.js';

describe('Circle', () => {
  test('creates SVG circle', () => {
    const circle = new Circle({
      center: { x: 50, y: 50 },
      radius: 20,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 2,
    });

    const svg = circle.toSVG();
    expect(svg).toContain('<circle');
    expect(svg).toContain('cx="50"');
    expect(svg).toContain('cy="50"');
    expect(svg).toContain('r="20"');
    expect(svg).toContain('fill="red"');
    expect(svg).toContain('stroke="black"');
    expect(svg).toContain('stroke-width="2"');

  });
});