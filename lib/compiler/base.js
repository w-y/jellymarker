Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parser = undefined;
exports.parse = parse;

var _parser = require('./parser.js');

var _parser2 = _interopRequireDefault(_parser);

var _ast = require('./ast.js');

var _ast2 = _interopRequireDefault(_ast);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.parser = _parser2.default;


var yy = {};
(0, _utils.extend)(yy, _ast2.default);

function parse(input) {
    _parser2.default.yy = yy;

    return _parser2.default.parse(input);
}