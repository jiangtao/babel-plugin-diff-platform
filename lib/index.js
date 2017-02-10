'use strict';

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require("fs"),
    existsSync = _require.existsSync;

var _require2 = require("path"),
    join = _require2.join,
    resolve = _require2.resolve;

module.exports = function (_ref) {
  var types = _ref.types;

  function getNodeValue(depName) {
    return {
      value: depName,
      extra: {
        rawValue: depName,
        raw: (0, _stringify2.default)(depName)
      }
    };
  }
  function getRoot() {
    return resolve(join(__dirname, __dirname.indexOf('node_modules') > -1 ? '../../../' : '../'));
  }
  function replaceDependence(depName, _ref2) {
    var _ref2$root = _ref2.root,
        root = _ref2$root === undefined ? getRoot() : _ref2$root,
        platform = _ref2.platform,
        _ref2$extensions = _ref2.extensions,
        extensions = _ref2$extensions === undefined ? ['.js', '.json'] : _ref2$extensions;

    var result = getNodeValue(depName);
    if (!root || !platform) return result;

    // 迭代找到platform下的文件
    if (Array.isArray(extensions)) {
      var ext = void 0,
          fullPath = void 0;
      for (var i in extensions) {
        ext = extensions[i];
        fullPath = join(root, 'node_modules', depName, platform, 'index' + ext);
        if (existsSync(fullPath)) {
          return getNodeValue(join(depName, platform));
        }
      }
    }
    return result;
  }
  return {
    visitor: {
      // import表达式处理
      ImportDeclaration: function ImportDeclaration(path, _ref3) {
        var opts = _ref3.opts;
        var node = path.node;
        var value = node.source.value;

        (0, _assign2.default)(node.source, replaceDependence(value, opts));
      },

      // 处理require
      CallExpression: function CallExpression(path, _ref4) {
        var opts = _ref4.opts;
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