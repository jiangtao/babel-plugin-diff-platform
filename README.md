---

单个ui库需要支持不同的平台适配，开发者需要每个平台不同支持，不同的样式，于是诞生了包。

<p>
  <a href="https://www.npmjs.com/package/babel-plugin-diff-platform">
    <img src="https://img.shields.io/npm/v/babel-plugin-diff-platform.svg?style=flat-square" />
  </a>
  <a href="https://vuejs.org">
    <img src="https://img.shields.io/badge/vue-2.1.8-brightgreen.svg?style=flat-square" />
  </a>
  <a href="https://travis-ci.org/Jerret321/babel-plugin-diff-platform">
    <img src="https://img.shields.io/travis/Jerret321/babel-plugin-diff-platform.svg?style=flat-square" />
  </a>
  <a href="https://codecov.io/gh/Jerret321/babel-plugin-diff-platform">
    <img src="https://img.shields.io/codecov/c/github/Jerret321/babel-plugin-diff-platform.svg?style=flat-square" />
  </a>
  <a href="https://david-dm.org/Jerret321/babel-plugin-diff-platform">
    <img src="https://img.shields.io/david/Jerret321/babel-plugin-diff-platform.svg?style=flat-square" />
  </a>
  <a href="https://img.shields.io/npm/dm/babel-plugin-diff-platform.svg?style=flat-square">
    <img src="https://img.shields.io/npm/dm/babel-plugin-diff-platform.svg?style=flat-square" />
  </a>
</p>

<!-- TOC -->

- [安装](#安装)
- [配置.babelrc](#配置babelrc)
- [输入](#输入)
- [输出](#输出)
- [原理](#原理)
- [优劣](#优劣)

<!-- /TOC -->

### 安装

```bash
npm install -D babel-plugin-diff-platform
```

### 配置.babelrc

```json
{
  "plugins": [
    ["diff-platform", {
        "platform": "pc", // 定义依赖追加路径
        "path": "dist", // 默认是dist 支持绝对路径引用
        "extensions": [".js", ".json", ".vue", ".jsx"] // 定义追加路径主文件后缀， 默认 .js .json .vue
    }]
  ]
}
```

### 输入

```javascript
import Buttons from 'vt-button'
import { join } from 'path'
const { readFile } = require('fs')
const img = require('./assets/a.png')
```

### 输出

```javascript
import Buttons from "vt-button/pc";
import { join } from "path";
const { readFile } = require("fs");
const img = require("./assets/a.png");
```

### 原理

通过`babel` ast解析到`import`,`require`的依赖，依次迭代根据`extensions`包装后的路径,若命中，则返回包装后的资源，反之则返回原资源。

### 优劣

**优势**

UI库使用者一次配置，在不同平台项目只需修改`platform`即可，插件会自动找到对应平台的依赖。另外，兼容其他ui库的引用。

**劣势**

由于使用迭代，`node_module`中文件过多，使用babel编译会慢些。但目前现今社会机器配置已很好，不怎么影响。

