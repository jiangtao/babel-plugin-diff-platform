const { existsSync } = require('fs')
const { join, resolve } = require('path')

module.exports = ({ types }) => {
  function getNodeValue(depName){
    return {
      value: depName,
      extra: {
        rawValue: depName,
        raw: JSON.stringify(depName)
      }
    }
  }
  function getRoot(){
    return resolve(join(__dirname,
      __dirname.indexOf('node_modules') > -1 ?
      '../../../' :
      '../'))
  }
  function replaceDependence(depName, {
    root = getRoot(),
    platform,
    extensions = ['.js', '.json']
  }) {
    let result = getNodeValue(depName)
    if (!root || !platform) return result

    // 迭代找到platform下的文件
    if (Array.isArray(extensions)) {
      let ext, fullPath
      for (let i in extensions) {
        ext = extensions[i]
        fullPath = join(root, 'node_modules', depName, platform, `index${ext}`)
        if (existsSync(fullPath)) {
          return getNodeValue(join(depName, platform))
        }
      }
    }
    return result
  }
  return {
    visitor: {
      // import表达式处理
      ImportDeclaration(path, { opts }) {
        const { node } = path
        let { value } = node.source
        Object.assign(node.source, replaceDependence(value, opts))
      },
      // 处理require
      CallExpression(path, { opts }) {
        const { node } = path
        const { name } = node.callee
        if (types.isIdentifier(node.callee)
            && name === 'require'
        ) {
          const [{value: v}] = node.arguments
          if(v && typeof v === 'string'){
            node.arguments[0] = Object.assign(node.arguments[0], replaceDependence(v, opts))
          }
        }
      }
    }
  }
}
