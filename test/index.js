const test = require('ava')
const { transform } = require('babel-core')
const { types } = require('babel-types')
const { resolve, join } = require('path')
const plugin = require('../src/index')

test('import default match', t => {
  let { code } = transform("import Alert from 'vt-alert'", {
    plugins: [[plugin, {
      platform: 'pc'
    }]]
  })

  t.is(code, 'import Alert from "vt-alert/dist/pc";')
})

test('import not match', t => {
  let { code } = transform("import Alert from 'vt-button'", {
    plugins: [[plugin, {
      platform: 'pc'
    }]]
  })

  t.is(code, 'import Alert from "vt-button";')
})


test('require default match', t => {
  let { code } = transform("require('vt-alert')", {
    plugins: [[plugin, {
      platform: 'pc'
    }]]
  })

  t.is(code, 'require("vt-alert/dist/pc");')
})


test('require not match', t => {
  let { code } = transform("require('vt-button')", {
    plugins: [[plugin, {
      platform: 'pc'
    }]]
  })

  t.is(code, 'require("vt-button");')
})

