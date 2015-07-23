import runtime from './jellymarker.runtime';

import AST from './compiler/ast';
import { parser as Parser, parse } from './compiler/base';
import { Compiler, compile, eval } from './compiler/compiler';
import { extend } from './utils';

let _create = runtime.create;

function create() {
    let tm = _create();

    tm.compile = function(input, options) {
        return compile(input, options, tm);
    };
    tm.eval = function(input, options) {
        return eval(input, options, tm);
    };
    tm.AST = AST;
    tm.Compiler = Compiler;
    tm.Parser = Parser;
    tm.parse = parse;
    tm.util = { extend };

    return tm;
}

let inst = create();
inst.create = create;

inst['default'] = inst;

export default inst;
