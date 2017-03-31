const { existsSync } = require('fs')
const { join, resolve, isAbsolute } = require('path')

module.exports = ({ types }) => {
  return {
    visitor: {
      ImportDeclaration(path, { opts }) {

        const { node } = path
        let { value } = node.source

        node.source = Object.assign(node.source, replaceDependence(value, opts))
      },
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

function getNodeValue(depName){
    return {
      value: depName,
      extra: {
        rawValue: depName,
        raw: JSON.stringify(depName)
      }
    }
  }

  function replaceDependence(depName, {
    platform,
    extensions = ['.js', '.json', '.vue'],
    path = 'dist'
  }) {
    let root = process.cwd()
    let result = getNodeValue(depName)
    let prefixPath = ''

    if (!platform) return result

    // if the appended path exists, replace the origin path with it
    if (Array.isArray(extensions)) {

      let ext, fullPath
      let absolute = isAbsolute(path)
      for (let i in extensions) {
        ext = extensions[i]
        fullPath = absolute
          ? resolve(join(path, platform, `index${ext}`))
          : resolve(join(root, 'node_modules', depName, path, platform, `index${ext}`))
        if (existsSync(fullPath)) {

          return getNodeValue( absolute ? fullPath : join(depName, path, platform) )
        }
      }
    }
    return result
  }
