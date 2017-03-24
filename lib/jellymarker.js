Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jellymarker = require('./jellymarker.runtime');

var _jellymarker2 = _interopRequireDefault(_jellymarker);

var _ast = require('./compiler/ast');

var _ast2 = _interopRequireDefault(_ast);

var _base = require('./compiler/base');

var _compiler = require('./compiler/compiler');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _create = _jellymarker2.default.create;

function create() {
    var tm = _create();

    tm.compile = function (input, options) {
        return (0, _compiler.compile)(input, options, tm);
    };
    tm.eval = function (input, options) {
        return (0, _compiler.evaluate)(input, options, tm);
    };
    tm.AST = _ast2.default;
    tm.Compiler = _compiler.Compiler;
    tm.Parser = _base.parser;
    tm.parse = _base.parse;
    tm.util = { extend: _utils.extend };

    return tm;
}

var inst = create();
inst.create = create;

inst['default'] = inst;

exports.default = inst;