// test/basicShpeTests/rightAngleTriangle.test.js
import { RightAngleTriangle } from '../../src/shapes/rightAngleTriangle.js';

describe('RightAngleTriangle', () => {
  test('creates default right angle triangle', () => {
    const triangle = new RightAngleTriangle();
    expect(triangle.points.length).toBe(3);
    expect(triangle.base).toBe(40);
    expect(triangle.height).toBe(30);
    expect(triangle.rightAnglePosition).toBe('bottom-left');
  });

  test('calculates correct area', () => {
    const triangle = new RightAngleTriangle({ base: 4, height: 3 });
    expect(triangle.area).toBeCloseTo(6, 2); // (4*3)/2 = 6
  });

  test('positions right angle correctly', () => {
    const positions = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];
    
    positions.forEach(pos => {
      const triangle = new RightAngleTriangle({ 
        rightAnglePosition: pos,
        base: 10,
        height: 10
      });
      
      // The right angle point should be at (0,0) in local coordinates
      expect(triangle.points[0]).toEqual({ x: 0, y: 0 });
    });
  });

  test('flips correctly', () => {
    const triangle = new RightAngleTriangle({
      base: 10,
      height: 10,
      flipHorizontal: true,
      flipVertical: true
    });
    
    // Default right angle is bottom-left, flipping both should make it top-right
    expect(triangle.points[0]).toEqual({ x: 0, y: 0 });
    expect(triangle.points[1].x).toBeLessThan(0); // Flipped horizontally
    expect(triangle.points[2].y).toBeGreaterThan(0); // Flipped vertically
  });

  test('containsPoint works', () => {
    const triangle = new RightAngleTriangle({
      base: 10,
      height: 10,
    //   rightAnglePosition: 'bottom-left'
    });
    
    expect(triangle.containsPoint({ x: 8, y: 8 })).toBe(false); // Outside hypotenuse
    expect(triangle.containsPoint({ x: -1, y: 0 })).toBe(false);
  });
});