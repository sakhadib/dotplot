import { Square } from '../src/shapes/square.js';

describe('Square', () => {
  test('creates default square', () => {
    const square = new Square();
    expect(square.size).toBe(20);
    expect(square.fill).toBe('transparent');
  });

  test('generates correct SVG', () => {
    const square = new Square({
      center: { x: 50, y: 50 },
      size: 40,
      fill: '#ff0000'
    });
    const svg = square.toSVG();
    expect(svg).toContain('x="30"');  // 50 - (40/2)
    expect(svg).toContain('width="40"');
    expect(svg).toContain('fill="#ff0000"');
  });

  test('handles rotation', () => {
    const square = new Square({
      center: { x: 50, y: 50 },
      rotation: 45
    });
    expect(square.toSVG()).toContain('rotate(45 50 50)');
  });
});