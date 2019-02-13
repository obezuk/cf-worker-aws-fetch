import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'worker',
      file: pkg.main
    },
    plugins: [
      resolve(),
      commonjs()
    ]
  }
]
