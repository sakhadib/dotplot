import { babel } from '@rollup/plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/gdl.js',
    format: 'umd',
    name: 'GDL'
  },
  plugins: [
    babel({ babelHelpers: 'bundled' })
  ]
};