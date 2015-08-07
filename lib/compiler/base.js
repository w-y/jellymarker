Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.parse = parse;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _parserJs = require('./parser.js');

var _parserJs2 = _interopRequireDefault(_parserJs);

var _astJs = require('./ast.js');

var _astJs2 = _interopRequireDefault(_astJs);

var _utils = require('../utils');

exports.parser = _parserJs2['default'];

var yy = {};
(0, _utils.extend)(yy, _astJs2['default']);

function parse(input) {
    _parserJs2['default'].yy = yy;

    return _parserJs2['default'].parse(input);
}