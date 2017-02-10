---

ui库开发的时候 同样的ui库 需要写不同的样式，但对于使用者来说不关心这些，因此有了这个插件

### 安装

```bash
npm install -D babel-plugin-diff-platform
yarn install -D babel-plugin-diff-platform
```

### 配置.babelrc

```json
{
  "plugins": [
    ["diff-platform", {
        "platform": "pc", // 定义依赖追加路径
        "extensions": [".js", ".json", ".vue"] // 定义追加路径主文件后缀， 默认 .js .json
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
