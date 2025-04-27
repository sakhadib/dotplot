import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/dotplot.min.js',
    format: 'umd',
    name: 'DotPlot'
  },
  plugins: [
    nodeResolve(),
    terser() // Official Rollup 4.x terser plugin
  ]
};