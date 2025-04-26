import { Circle } from '../src/shapes/circle'; // Adjust the import path as necessary

test('Circle renders correctly to SVG', () => {
    const center = {x: 50, y: 50};
    const radius = 20;
    const style = {fill: 'red', stroke: 'black', strokeWidth: 2, opacity: 0.5};
    const circle = new Circle(center, radius, style);
    
    const expectedSVG = `<circle cx="50" cy="50" r="20" fill="red" stroke="black" stroke-width="2" opacity="0.5"/>`;
    
    expect(circle.toSVG()).toBe(expectedSVG);
});