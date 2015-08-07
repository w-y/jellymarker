Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jellymarkerRuntime = require('./jellymarker.runtime');

var _jellymarkerRuntime2 = _interopRequireDefault(_jellymarkerRuntime);

var _compilerAst = require('./compiler/ast');

var _compilerAst2 = _interopRequireDefault(_compilerAst);

var _compilerBase = require('./compiler/base');

var _compilerCompiler = require('./compiler/compiler');

var _utils = require('./utils');

var _create = _jellymarkerRuntime2['default'].create;

function create() {
    var tm = _create();

    tm.compile = function (input, options) {
        return (0, _compilerCompiler.compile)(input, options, tm);
    };
    tm.eval = function (input, options) {
        return (0, _compilerCompiler.eval)(input, options, tm);
    };
    tm.AST = _compilerAst2['default'];
    tm.Compiler = _compilerCompiler.Compiler;
    tm.Parser = _compilerBase.parser;
    tm.parse = _compilerBase.parse;
    tm.util = { extend: _utils.extend };

    return tm;
}

var inst = create();
inst.create = create;

inst['default'] = inst;

exports['default'] = inst;
module.exports = exports['default'];