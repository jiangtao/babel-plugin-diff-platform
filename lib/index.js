'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('fs'),
    existsSync = _require.existsSync;

var _require2 = require('path'),
    join = _require2.join,
    resolve = _require2.resolve,
    isAbsolute = _require2.isAbsolute;

module.exports = function (_ref) {
  var types = _ref.types;

  return {
    visitor: {
      ImportDeclaration: function ImportDeclaration(path, _ref2) {
        var opts = _ref2.opts;
        var node = path.node;
        var value = node.source.value;


        node.source = (0, _assign2.default)(node.source, replaceDependence(value, opts));
      },
      CallExpression: function CallExpression(path, _ref3) {
        var opts = _ref3.opts;
        var node = path.node;
        var name = node.callee.name;


        if (types.isIdentifier(node.callee) && name === 'require') {
          var _node$arguments = node.arguments,
              v = _node$arguments[0].value;


          if (v && typeof v === 'string') {
            node.arguments[0] = (0, _assign2.default)(node.arguments[0], replaceDependence(v, opts));
          }
        }
      }
    }
  };
};

function getNodeValue(depName) {
  return {
    value: depName,
    extra: {
      rawValue: depName,
      raw: (0, _stringify2.default)(depName)
    }
  };
}

function replaceDependence(depName, _ref4) {
  var platform = _ref4.platform,
      _ref4$extensions = _ref4.extensions,
      extensions = _ref4$extensions === undefined ? ['.js', '.json', '.vue'] : _ref4$extensions,
      _ref4$path = _ref4.path,
      path = _ref4$path === undefined ? 'dist' : _ref4$path;

  var root = process.cwd();
  var result = getNodeValue(depName);
  var prefixPath = '';

  if (!platform) return result;

  // if the appended path exists, replace the origin path with it
  if (Array.isArray(extensions)) {

    var ext = void 0,
        fullPath = void 0;
    var absolute = isAbsolute(path);
    for (var i in extensions) {
      ext = extensions[i];
      fullPath = absolute ? resolve(join(path, platform, 'index' + ext)) : resolve(join(root, 'node_modules', depName, path, platform, 'index' + ext));
      if (existsSync(fullPath)) {

        return getNodeValue(absolute ? fullPath : join(depName, path, platform));
      }
    }
  }
  return result;
}