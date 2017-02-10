const { transform, transformFile, transformFileSync, transformFromAst } = require('babel-core')
const { types } = require('babel-types')
const plugin = require('../lib/index.js')
const { resolve, join } = require('path')
const filename = resolve(join(__dirname, '../example/test.js'))

let {code, ast, map} = transformFileSync(filename, {
  babelrc: true, // use .babelrc file for config
  plugins: [plugin]
})
console.log(code)

