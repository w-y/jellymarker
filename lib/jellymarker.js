import runtime from './jellymarker.runtime';

import AST from './compiler/ast';
import { parser as Parser, parse } from './compiler/base';
import { Compiler, compile } from './compiler/compiler';
import Visitor from './compiler/visitor';

let _create = runtime.create;

function create() {
    let tm = _create();

    tm.compile = function(input, options) {
        return compile(input, options, tm);
    };
    tm.AST = AST;
    tm.Compiler = Compiler;
    tm.Parser = Parser;
    tm.parse = parse;

    return tm;
}

let inst = create();
inst.create = create;

inst.Visitor = Visitor;
inst['default'] = inst;

export default inst;
