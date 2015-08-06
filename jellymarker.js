(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.JellymarkerEnvironment = JellymarkerEnvironment;

function JellymarkerEnvironment(operators, variables) {
    this.operators = operators || {};
    this.variables = variables || {};
}

JellymarkerEnvironment.prototype = {

    constructor: JellymarkerEnvironment,

    registerVariables: function registerVariables(name, obj) {
        this.variables[name] = obj;
    },

    unregisterVariables: function unregisterVariables(name) {
        delete this.variables[name];
    },

    registerOperators: function registerOperators(name, obj) {
        this.operators[name] = obj;
    },

    unregisterOperators: function unregisterOperators(name) {
        delete this.operators[name];
    }

};

},{}],2:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});
var AST = {
    Program: function Program(statements) {
        this.type = 'Program';
        this.statements = statements;
    },
    Statement: function Statement(content) {
        this.type = 'Statement';
        this.content = content;
    },
    EmptyStatement: function EmptyStatement() {
        this.type = 'EmptyStatement';
    },
    ExprStatement: function ExprStatement() {
        this.type = 'ExprStatement';
    },
    ExprNoBF: function ExprNoBF() {
        this.type = 'ExprNoBF';
    },
    Expr: function Expr() {
        this.type = 'Expr';
    },
    AssignmentExpr: function AssignmentExpr(operator, operand1, operand2) {
        this.type = 'AssignmentExpr';
        this.operator = operator;
        this.operand1 = operand1;
        this.operand2 = operand2;
    },
    AssignmentExprNoBF: function AssignmentExprNoBF() {
        this.type = 'AssignmentExprNoBF';
    },
    LeftHandSideExprNoBF: function LeftHandSideExprNoBF() {
        this.type = 'LeftHandSideExprNoBF';
    },
    LeftHandSideExpr: function LeftHandSideExpr() {
        this.type = 'LeftHandSideExpr';
    },
    AssignmentOperator: function AssignmentOperator() {
        this.type = 'AssignmentOperator';
    },
    AddictiveExprNoBF: function AddictiveExprNoBF() {
        this.type = 'AddictiveExprNoBF';
    },
    AddictiveExpr: function AddictiveExpr(operator, operand1, operand2) {
        this.type = 'AddictiveExpr';
        this.operator = operator;
        this.operand1 = operand1;
        this.operand2 = operand2;
    },
    CallExpr: function CallExpr(fn, args) {
        this.type = 'CallExpr';
        this.fn = fn;
        this.args = args;
    },
    PrimaryExprNoBrace: function PrimaryExprNoBrace() {
        this.type = 'PrimaryExprNoBrace';
    },
    Arguments: function Arguments() {
        this.type = 'Arguments';
    },
    ArgumentList: function ArgumentList() {
        this.type = 'ArgumentList';
    },
    MultiplicativeExprNoBF: function MultiplicativeExprNoBF() {
        this.type = 'MultiplicativeExprNoBF';
    },
    MultiplicativeExpr: function MultiplicativeExpr(operator, operand1, operand2) {
        this.type = 'MultiplicativeExpr';

        this.operator = operator;
        this.operand1 = operand1;
        this.operand2 = operand2;
    },
    UnaryExprNoBF: function UnaryExprNoBF() {
        this.type = 'UnaryExprNoBF';
    },
    Num: function Num(value) {
        this.type = 'Number';
        this.value = value;
    },
    String: function String(value) {
        this.type = 'String';
        this.value = value;
    },
    Id: function Id(identifier) {
        this.type = 'Id';
        this.identifier = identifier;
    },
    Operator: function Operator(op) {
        this.type = 'Operator';
        this.op = op;
    }
};

exports['default'] = AST;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
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

},{"../utils":8,"./ast.js":2,"./parser.js":5}],4:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.Compiler = Compiler;
exports.compile = compile;
exports.eval = eval;

var _utils = require('../utils');

function Compiler() {}

function normalize(input) {
    if (input && (input[input.length - 1] !== ';' || input[input.lenght - 1] !== '\n')) {
        return input + ';';
    }
    return input;
}

function validate(input) {
    if (input === '' || input === null || typeof input === 'undefined') {
        return false;
    }
    return true;
}

Compiler.prototype = {
    compiler: Compiler,

    compile: function compile(program) {
        var ret = this.accept(program);
        return ret;
    },
    accept: function accept(node) {
        var ret = this[node.type](node);
        return ret;
    },
    Program: function Program(program) {
        var statements = program.statements;
        var ret = [];

        for (var i = 0; i < statements.length; i++) {
            ret.push(this.accept(statements[i]));
        }
        return ret;
    },
    Statement: function Statement(statement) {
        return this.accept(statement.content);
    },
    EmptyStatement: function EmptyStatement(emptyStatement) {
        return null;
    },
    Operator: function Operator(operator) {
        return this.operators[operator.op];
    },
    Variable: function Variable(variable) {
        return this.variables[variable.identifier];
    },
    AssignmentExpr: function AssignmentExpr(assignmentExpr) {
        var right = this.accept(assignmentExpr.operand2);
        var op = this.accept(assignmentExpr.operator);

        op = op || function (v) {
            return v;
        };

        var id = assignmentExpr.operand1.identifier;
        this.variables[id] = op(right);

        return right;
    },
    AddictiveExpr: function AddictiveExpr(addictiveExpr) {
        return this.evalBinExpr(addictiveExpr);
    },
    MultiplicativeExpr: function MultiplicativeExpr(multiplicativeExpr) {
        return this.evalBinExpr(multiplicativeExpr);
    },
    Number: function Number(number) {
        return +number.value;
    },
    String: function String(str) {
        return str.value.substring(1, str.value.length - 1);
    },
    Id: function Id(id) {
        return this.variables[id.identifier];
    },
    CallExpr: function CallExpr(callExpr) {
        var _this = this;

        var fn = this.accept(callExpr.fn);
        var args = [];

        if (callExpr.args && callExpr.args.length > 0) {
            args = callExpr.args.map(function (arg) {
                return _this.accept(arg);
            });
        }
        if (fn && (0, _utils.isFunction)(fn)) {
            return fn.apply({
                operators: this.operators,
                variables: this.variables
            }, args);
        } else {
            //TODO: exception
            throw new Error('no such function');
        }
    },
    evalBinExpr: function evalBinExpr(expr) {
        var operator = this.accept(expr.operator);
        var operand1 = this.accept(expr.operand1);
        var operand2 = this.accept(expr.operand2);

        if (operator) {
            return operator(operand1, operand2);
        } else {
            //TODO: exception
            throw new Error('no such operator');
        }
    }
};

function compile(input, options, env) {
    if (!validate(input)) {
        return false;
    }
    var ast = env.parse(normalize(input), options);
    var compiler = new env.Compiler();

    compiler.operators = env.operators;
    compiler.variables = env.variables;

    return compiler.compile(ast);
}

function eval(input, options, env) {
    if (!validate(input)) {
        return false;
    }
    var ast = env.parse(normalize(input), options);
    var compiler = new env.Compiler();

    compiler.operators = env.operators;
    compiler.variables = env.variables;

    var ret = compiler.compile(ast);
    if (ret && ret.length > 0) {
        return ret[0];
    }

    return false;
}

},{"../utils":8}],5:[function(require,module,exports){
module.exports = require('../../src/rule.js');

},{"../../src/rule.js":12}],6:[function(require,module,exports){
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

},{"./compiler/ast":2,"./compiler/base":3,"./compiler/compiler":4,"./jellymarker.runtime":7,"./utils":8}],7:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _base = require('./base');

var base = _interopRequireWildcard(_base);

function create() {
    var jm = new base.JellymarkerEnvironment();

    return jm;
}

var inst = create();
inst.create = create;

inst['default'] = inst;

exports['default'] = inst;
module.exports = exports['default'];

},{"./base":1}],8:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extend = extend;
exports.isFunction = isFunction;

function extend(obj /* , ...source */) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
        obj[key] = arguments[i][key];
      }
    }
  }
  return obj;
}

function isFunction(obj) {
  return !!(obj && obj.constructor && obj.call && obj.apply);
}

},{}],9:[function(require,module,exports){

},{}],10:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))

},{"_process":11}],11:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],12:[function(require,module,exports){
(function (process){
/* parser generated by jison 0.4.15 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function () {
    var o = function o(k, v, _o, l) {
        for (_o = _o || {}, l = k.length; l--; _o[k[l]] = v);return _o;
    },
        $V0 = [1, 6],
        $V1 = [1, 7],
        $V2 = [1, 18],
        $V3 = [1, 15],
        $V4 = [1, 16],
        $V5 = [1, 17],
        $V6 = [1, 8, 9, 23, 27, 28, 29],
        $V7 = [8, 9],
        $V8 = [8, 9, 31, 32, 35, 36],
        $V9 = [2, 43],
        $Va = [1, 24],
        $Vb = [8, 9, 19, 31, 32, 35, 36],
        $Vc = [1, 28],
        $Vd = [8, 9, 31, 32],
        $Ve = [1, 30],
        $Vf = [1, 31],
        $Vg = [8, 9, 19, 23, 24, 26, 31, 32, 35, 36],
        $Vh = [24, 26, 31, 32, 35, 36],
        $Vi = [2, 44],
        $Vj = [24, 26],
        $Vk = [19, 24, 26, 31, 32, 35, 36],
        $Vl = [24, 26, 31, 32],
        $Vm = [1, 53],
        $Vn = [1, 54];
    var parser = { trace: function trace() {},
        yy: {},
        symbols_: { "error": 2, "Program": 3, "SourceElements": 4, "Statement": 5, "EmptyStatement": 6, "ExprStatement": 7, ";": 8, "NEWLINE": 9, "ExprNoBF": 10, "AssignmentExprNoBF": 11, "Expr": 12, "AssignmentExpr": 13, "LeftHandSideExprNoBF": 14, "AssignmentOperator": 15, "AddictiveExprNoBF": 16, "LeftHandSideExpr": 17, "AddictiveExpr": 18, "=": 19, "CallExprNoBF": 20, "PrimaryExprNoBrace": 21, "Arguments": 22, "(": 23, ")": 24, "ArgumentList": 25, ",": 26, "IDENT": 27, "NUMBER": 28, "STRING": 29, "MultiplicativeExprNoBF": 30, "+": 31, "-": 32, "MultiplicativeExpr": 33, "UnaryExprNoBF": 34, "*": 35, "/": 36, "UnaryExpr": 37, "$accept": 0, "$end": 1 },
        terminals_: { 2: "error", 8: ";", 9: "NEWLINE", 19: "=", 23: "(", 24: ")", 26: ",", 27: "IDENT", 28: "NUMBER", 29: "STRING", 31: "+", 32: "-", 35: "*", 36: "/" },
        productions_: [0, [3, 1], [4, 1], [4, 2], [5, 1], [5, 1], [6, 1], [6, 1], [7, 2], [7, 2], [10, 1], [12, 1], [11, 3], [11, 1], [13, 3], [13, 1], [15, 1], [20, 2], [20, 2], [22, 2], [22, 3], [25, 1], [25, 3], [14, 1], [14, 1], [17, 1], [17, 1], [21, 1], [21, 1], [21, 1], [21, 3], [16, 1], [16, 3], [16, 3], [18, 1], [18, 3], [18, 3], [30, 1], [30, 3], [30, 3], [33, 1], [33, 3], [33, 3], [34, 1], [37, 1]],
        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, /* action[1] */$$, /* vstack */_$ /* lstack */) {
            /* this == yyval */

            var $0 = $$.length - 1;
            switch (yystate) {
                case 1:

                    this.$ = $$[$0];
                    return this.$;

                    break;
                case 2:

                    this.$ = new yy.Program([new yy.Statement($$[$0])]);

                    break;
                case 3:

                    $$[$0 - 1].statements.push(new yy.Statement($$[$0]));
                    this.$ = $$[$0 - 1];

                    break;
                case 4:case 5:case 10:case 11:case 13:case 15:case 23:case 24:case 25:case 26:case 31:case 34:case 37:case 40:case 43:case 44:

                    this.$ = $$[$0];

                    break;
                case 6:case 7:

                    this.$ = new yy.EmptyStatement($$[$0]);

                    break;
                case 8:case 9:case 20:case 30:

                    this.$ = $$[$0 - 1];

                    break;
                case 12:case 14:

                    this.$ = new yy.AssignmentExpr($$[$0 - 1], $$[$0 - 2], $$[$0]);

                    break;
                case 16:

                    this.$ = new yy.Operator($$[$0]);

                    break;
                case 17:case 18:

                    this.$ = new yy.CallExpr($$[$0 - 1], $$[$0]);

                    break;
                case 19:

                    this.$ = [];

                    break;
                case 21:

                    this.$ = [$$[$0]];

                    break;
                case 22:

                    this.$ = $$[$0 - 2].concat($$[$0]);

                    break;
                case 27:

                    this.$ = new yy.Id($$[$0]);

                    break;
                case 28:

                    this.$ = new yy.Num($$[$0]);

                    break;
                case 29:

                    this.$ = new yy.String($$[$0]);

                    break;
                case 32:case 33:case 35:case 36:

                    this.$ = new yy.AddictiveExpr(new yy.Operator($$[$0 - 1]), $$[$0 - 2], $$[$0]);

                    break;
                case 38:case 39:case 41:case 42:

                    this.$ = new yy.MultiplicativeExpr(new yy.Operator($$[$0 - 1]), $$[$0 - 2], $$[$0]);

                    break;
            }
        },
        table: [{ 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 8: $V0, 9: $V1, 10: 8, 11: 9, 14: 10, 16: 11, 20: 13, 21: 12, 23: $V2, 27: $V3, 28: $V4, 29: $V5, 30: 14, 34: 19 }, { 1: [3] }, { 1: [2, 1], 5: 20, 6: 4, 7: 5, 8: $V0, 9: $V1, 10: 8, 11: 9, 14: 10, 16: 11, 20: 13, 21: 12, 23: $V2, 27: $V3, 28: $V4, 29: $V5, 30: 14, 34: 19 }, o($V6, [2, 2]), o($V6, [2, 4]), o($V6, [2, 5]), o($V6, [2, 6]), o($V6, [2, 7]), { 8: [1, 21], 9: [1, 22] }, o($V7, [2, 10]), o($V8, $V9, { 15: 23, 19: $Va }), o($V7, [2, 13], { 31: [1, 25], 32: [1, 26] }), o($Vb, [2, 23], { 22: 27, 23: $Vc }), o($Vb, [2, 24], { 22: 29, 23: $Vc }), o($Vd, [2, 31], { 35: $Ve, 36: $Vf }), o($Vg, [2, 27]), o($Vg, [2, 28]), o($Vg, [2, 29]), { 12: 32, 13: 33, 17: 34, 18: 35, 20: 37, 21: 36, 23: $V2, 27: $V3, 28: $V4, 29: $V5, 33: 38, 37: 39 }, o($V8, [2, 37]), o($V6, [2, 3]), o($V6, [2, 8]), o($V6, [2, 9]), { 11: 40, 14: 10, 16: 11, 20: 13, 21: 12, 23: $V2, 27: $V3, 28: $V4, 29: $V5, 30: 14, 34: 19 }, o([23, 27, 28, 29], [2, 16]), { 14: 42, 20: 13, 21: 12, 23: $V2, 27: $V3, 28: $V4, 29: $V5, 30: 41, 34: 19 }, { 14: 42, 20: 13, 21: 12, 23: $V2, 27: $V3, 28: $V4, 29: $V5, 30: 43, 34: 19 }, o($Vg, [2, 17]), { 13: 46, 17: 34, 18: 35, 20: 37, 21: 36, 23: $V2, 24: [1, 44], 25: 45, 27: $V3, 28: $V4, 29: $V5, 33: 38, 37: 39 }, o($Vg, [2, 18]), { 14: 42, 20: 13, 21: 12, 23: $V2, 27: $V3, 28: $V4, 29: $V5, 34: 47 }, { 14: 42, 20: 13, 21: 12, 23: $V2, 27: $V3, 28: $V4, 29: $V5, 34: 48 }, { 24: [1, 49] }, { 24: [2, 11] }, o($Vh, $Vi, { 15: 50, 19: $Va }), o($Vj, [2, 15], { 31: [1, 51], 32: [1, 52] }), o($Vk, [2, 25], { 22: 27, 23: $Vc }), o($Vk, [2, 26], { 22: 29, 23: $Vc }), o($Vl, [2, 34], { 35: $Vm, 36: $Vn }), o($Vh, [2, 40]), o($V7, [2, 12]), o($Vd, [2, 32], { 35: $Ve, 36: $Vf }), o($V8, $V9), o($Vd, [2, 33], { 35: $Ve, 36: $Vf }), o($Vg, [2, 19]), { 24: [1, 55], 26: [1, 56] }, o($Vj, [2, 21]), o($V8, [2, 38]), o($V8, [2, 39]), o($Vg, [2, 30]), { 13: 57, 17: 34, 18: 35, 20: 37, 21: 36, 23: $V2, 27: $V3, 28: $V4, 29: $V5, 33: 38, 37: 39 }, { 17: 59, 20: 37, 21: 36, 23: $V2, 27: $V3, 28: $V4, 29: $V5, 33: 58, 37: 39 }, { 17: 59, 20: 37, 21: 36, 23: $V2, 27: $V3, 28: $V4, 29: $V5, 33: 60, 37: 39 }, { 17: 59, 20: 37, 21: 36, 23: $V2, 27: $V3, 28: $V4, 29: $V5, 37: 61 }, { 17: 59, 20: 37, 21: 36, 23: $V2, 27: $V3, 28: $V4, 29: $V5, 37: 62 }, o($Vg, [2, 20]), { 13: 63, 17: 34, 18: 35, 20: 37, 21: 36, 23: $V2, 27: $V3, 28: $V4, 29: $V5, 33: 38, 37: 39 }, o($Vj, [2, 14]), o($Vl, [2, 35], { 35: $Vm, 36: $Vn }), o($Vh, $Vi), o($Vl, [2, 36], { 35: $Vm, 36: $Vn }), o($Vh, [2, 41]), o($Vh, [2, 42]), o($Vj, [2, 22])],
        defaultActions: { 33: [2, 11] },
        parseError: function parseError(str, hash) {
            if (hash.recoverable) {
                this.trace(str);
            } else {
                throw new Error(str);
            }
        },
        parse: function parse(input) {
            var self = this,
                stack = [0],
                tstack = [],
                vstack = [null],
                lstack = [],
                table = this.table,
                yytext = "",
                yylineno = 0,
                yyleng = 0,
                recovering = 0,
                TERROR = 2,
                EOF = 1;
            var args = lstack.slice.call(arguments, 1);
            var lexer = Object.create(this.lexer);
            var sharedState = { yy: {} };
            for (var k in this.yy) {
                if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
                    sharedState.yy[k] = this.yy[k];
                }
            }
            lexer.setInput(input, sharedState.yy);
            sharedState.yy.lexer = lexer;
            sharedState.yy.parser = this;
            if (typeof lexer.yylloc == "undefined") {
                lexer.yylloc = {};
            }
            var yyloc = lexer.yylloc;
            lstack.push(yyloc);
            var ranges = lexer.options && lexer.options.ranges;
            if (typeof sharedState.yy.parseError === "function") {
                this.parseError = sharedState.yy.parseError;
            } else {
                this.parseError = Object.getPrototypeOf(this).parseError;
            }
            function popStack(n) {
                stack.length = stack.length - 2 * n;
                vstack.length = vstack.length - n;
                lstack.length = lstack.length - n;
            }
            _token_stack: function lex() {
                var token;
                token = lexer.lex() || EOF;
                if (typeof token !== "number") {
                    token = self.symbols_[token] || token;
                }
                return token;
            }
            var symbol,
                preErrorSymbol,
                state,
                action,
                a,
                r,
                yyval = {},
                p,
                len,
                newState,
                expected;
            while (true) {
                state = stack[stack.length - 1];
                if (this.defaultActions[state]) {
                    action = this.defaultActions[state];
                } else {
                    if (symbol === null || typeof symbol == "undefined") {
                        symbol = lex();
                    }
                    action = table[state] && table[state][symbol];
                }
                if (typeof action === "undefined" || !action.length || !action[0]) {
                    var errStr = "";
                    expected = [];
                    for (p in table[state]) {
                        if (this.terminals_[p] && p > TERROR) {
                            expected.push("'" + this.terminals_[p] + "'");
                        }
                    }
                    if (lexer.showPosition) {
                        errStr = "Parse error on line " + (yylineno + 1) + ":\n" + lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                    } else {
                        errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == EOF ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
                    }
                    this.parseError(errStr, {
                        text: lexer.match,
                        token: this.terminals_[symbol] || symbol,
                        line: lexer.yylineno,
                        loc: yyloc,
                        expected: expected
                    });
                }
                if (action[0] instanceof Array && action.length > 1) {
                    throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
                }
                switch (action[0]) {
                    case 1:
                        stack.push(symbol);
                        vstack.push(lexer.yytext);
                        lstack.push(lexer.yylloc);
                        stack.push(action[1]);
                        symbol = null;
                        if (!preErrorSymbol) {
                            yyleng = lexer.yyleng;
                            yytext = lexer.yytext;
                            yylineno = lexer.yylineno;
                            yyloc = lexer.yylloc;
                            if (recovering > 0) {
                                recovering--;
                            }
                        } else {
                            symbol = preErrorSymbol;
                            preErrorSymbol = null;
                        }
                        break;
                    case 2:
                        len = this.productions_[action[1]][1];
                        yyval.$ = vstack[vstack.length - len];
                        yyval._$ = {
                            first_line: lstack[lstack.length - (len || 1)].first_line,
                            last_line: lstack[lstack.length - 1].last_line,
                            first_column: lstack[lstack.length - (len || 1)].first_column,
                            last_column: lstack[lstack.length - 1].last_column
                        };
                        if (ranges) {
                            yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
                        }
                        r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));
                        if (typeof r !== "undefined") {
                            return r;
                        }
                        if (len) {
                            stack = stack.slice(0, -1 * len * 2);
                            vstack = vstack.slice(0, -1 * len);
                            lstack = lstack.slice(0, -1 * len);
                        }
                        stack.push(this.productions_[action[1]][0]);
                        vstack.push(yyval.$);
                        lstack.push(yyval._$);
                        newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                        stack.push(newState);
                        break;
                    case 3:
                        return true;
                }
            }
            return true;
        } };
    /* generated by jison-lex 0.3.4 */
    var lexer = (function () {
        var lexer = {

            EOF: 1,

            parseError: function parseError(str, hash) {
                if (this.yy.parser) {
                    this.yy.parser.parseError(str, hash);
                } else {
                    throw new Error(str);
                }
            },

            // resets the lexer, sets new input
            setInput: function setInput(input, yy) {
                this.yy = yy || this.yy || {};
                this._input = input;
                this._more = this._backtrack = this.done = false;
                this.yylineno = this.yyleng = 0;
                this.yytext = this.matched = this.match = "";
                this.conditionStack = ["INITIAL"];
                this.yylloc = {
                    first_line: 1,
                    first_column: 0,
                    last_line: 1,
                    last_column: 0
                };
                if (this.options.ranges) {
                    this.yylloc.range = [0, 0];
                }
                this.offset = 0;
                return this;
            },

            // consumes and returns one char from the input
            input: function input() {
                var ch = this._input[0];
                this.yytext += ch;
                this.yyleng++;
                this.offset++;
                this.match += ch;
                this.matched += ch;
                var lines = ch.match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno++;
                    this.yylloc.last_line++;
                } else {
                    this.yylloc.last_column++;
                }
                if (this.options.ranges) {
                    this.yylloc.range[1]++;
                }

                this._input = this._input.slice(1);
                return ch;
            },

            // unshifts one char (or a string) into the input
            unput: function unput(ch) {
                var len = ch.length;
                var lines = ch.split(/(?:\r\n?|\n)/g);

                this._input = ch + this._input;
                this.yytext = this.yytext.substr(0, this.yytext.length - len);
                //this.yyleng -= len;
                this.offset -= len;
                var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                this.match = this.match.substr(0, this.match.length - 1);
                this.matched = this.matched.substr(0, this.matched.length - 1);

                if (lines.length - 1) {
                    this.yylineno -= lines.length - 1;
                }
                var r = this.yylloc.range;

                this.yylloc = {
                    first_line: this.yylloc.first_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.first_column,
                    last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
                };

                if (this.options.ranges) {
                    this.yylloc.range = [r[0], r[0] + this.yyleng - len];
                }
                this.yyleng = this.yytext.length;
                return this;
            },

            // When called from action, caches matched text and appends it on next action
            more: function more() {
                this._more = true;
                return this;
            },

            // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
            reject: function reject() {
                if (this.options.backtrack_lexer) {
                    this._backtrack = true;
                } else {
                    return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });
                }
                return this;
            },

            // retain first n characters of the match
            less: function less(n) {
                this.unput(this.match.slice(n));
            },

            // displays already matched input, i.e. for error messages
            pastInput: function pastInput() {
                var past = this.matched.substr(0, this.matched.length - this.match.length);
                return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
            },

            // displays upcoming input, i.e. for error messages
            upcomingInput: function upcomingInput() {
                var next = this.match;
                if (next.length < 20) {
                    next += this._input.substr(0, 20 - next.length);
                }
                return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
            },

            // displays the character position where the lexing error occurred, i.e. for error messages
            showPosition: function showPosition() {
                var pre = this.pastInput();
                var c = new Array(pre.length + 1).join("-");
                return pre + this.upcomingInput() + "\n" + c + "^";
            },

            // test the lexed token: return FALSE when not a match, otherwise return token
            test_match: function test_match(match, indexed_rule) {
                var token, lines, backup;

                if (this.options.backtrack_lexer) {
                    // save context
                    backup = {
                        yylineno: this.yylineno,
                        yylloc: {
                            first_line: this.yylloc.first_line,
                            last_line: this.last_line,
                            first_column: this.yylloc.first_column,
                            last_column: this.yylloc.last_column
                        },
                        yytext: this.yytext,
                        match: this.match,
                        matches: this.matches,
                        matched: this.matched,
                        yyleng: this.yyleng,
                        offset: this.offset,
                        _more: this._more,
                        _input: this._input,
                        yy: this.yy,
                        conditionStack: this.conditionStack.slice(0),
                        done: this.done
                    };
                    if (this.options.ranges) {
                        backup.yylloc.range = this.yylloc.range.slice(0);
                    }
                }

                lines = match[0].match(/(?:\r\n?|\n).*/g);
                if (lines) {
                    this.yylineno += lines.length;
                }
                this.yylloc = {
                    first_line: this.yylloc.last_line,
                    last_line: this.yylineno + 1,
                    first_column: this.yylloc.last_column,
                    last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
                };
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                if (this.options.ranges) {
                    this.yylloc.range = [this.offset, this.offset += this.yyleng];
                }
                this._more = false;
                this._backtrack = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
                if (this.done && this._input) {
                    this.done = false;
                }
                if (token) {
                    return token;
                } else if (this._backtrack) {
                    // recover context
                    for (var k in backup) {
                        this[k] = backup[k];
                    }
                    return false; // rule action called reject() implying the next rule should be tested instead.
                }
                return false;
            },

            // return next match in input
            next: function next() {
                if (this.done) {
                    return this.EOF;
                }
                if (!this._input) {
                    this.done = true;
                }

                var token, match, tempMatch, index;
                if (!this._more) {
                    this.yytext = "";
                    this.match = "";
                }
                var rules = this._currentRules();
                for (var i = 0; i < rules.length; i++) {
                    tempMatch = this._input.match(this.rules[rules[i]]);
                    if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                        match = tempMatch;
                        index = i;
                        if (this.options.backtrack_lexer) {
                            token = this.test_match(tempMatch, rules[i]);
                            if (token !== false) {
                                return token;
                            } else if (this._backtrack) {
                                match = false;
                                continue; // rule action called reject() implying a rule MISmatch.
                            } else {
                                // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                                return false;
                            }
                        } else if (!this.options.flex) {
                            break;
                        }
                    }
                }
                if (match) {
                    token = this.test_match(match, rules[index]);
                    if (token !== false) {
                        return token;
                    }
                    // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                    return false;
                }
                if (this._input === "") {
                    return this.EOF;
                } else {
                    return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
                        text: "",
                        token: null,
                        line: this.yylineno
                    });
                }
            },

            // return next match that has a token
            lex: function lex() {
                var r = this.next();
                if (r) {
                    return r;
                } else {
                    return this.lex();
                }
            },

            // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
            begin: function begin(condition) {
                this.conditionStack.push(condition);
            },

            // pop the previously active lexer condition state off the condition stack
            popState: function popState() {
                var n = this.conditionStack.length - 1;
                if (n > 0) {
                    return this.conditionStack.pop();
                } else {
                    return this.conditionStack[0];
                }
            },

            // produce the lexer rule set which is active for the currently active lexer condition state
            _currentRules: function _currentRules() {
                if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
                    return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                } else {
                    return this.conditions["INITIAL"].rules;
                }
            },

            // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
            topState: function topState(n) {
                n = this.conditionStack.length - 1 - Math.abs(n || 0);
                if (n >= 0) {
                    return this.conditionStack[n];
                } else {
                    return "INITIAL";
                }
            },

            // alias for begin(condition)
            pushState: function pushState(condition) {
                this.begin(condition);
            },

            // return the number of states currently on the stack
            stateStackSize: function stateStackSize() {
                return this.conditionStack.length;
            },
            options: {},
            performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
                var YYSTATE = YY_START;
                switch ($avoiding_name_collisions) {
                    case 0:
                        return 28;
                        break;
                    case 1:
                        return 29;
                        break;
                    case 2:
                        return 27;
                        break;
                    case 3:
                        return "=";
                        break;
                    case 4:
                        return "(";
                        break;
                    case 5:
                        return ")";
                        break;
                    case 6:
                        return ",";
                        break;
                    case 7:
                        return "+";
                        break;
                    case 8:
                        return "-";
                        break;
                    case 9:
                        return "*";
                        break;
                    case 10:
                        return "/";
                        break;
                    case 11:
                        return ";";
                        break;
                    case 12:
                        return 9;
                        break;
                    case 13:
                        return "";
                        break;
                }
            },
            rules: [/^(?:[0-9]+(\.[0-9]+)?\b)/, /^(?:"[^"\n]*["\n]|'[^'\n]*['\n])/, /^(?:[a-zA-Z_$][a-zA-Z_0-9$]*)/, /^(?:=)/, /^(?:\()/, /^(?:\))/, /^(?:,)/, /^(?:\+)/, /^(?:-)/, /^(?:\*)/, /^(?:\/)/, /^(?:;)/, /^(?:[\n]+)/, /^(?:[ \t\n]+)/],
            conditions: { "INITIAL": { "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], "inclusive": true } }
        };
        return lexer;
    })();
    parser.lexer = lexer;
    function Parser() {
        this.yy = {};
    }
    Parser.prototype = parser;parser.Parser = Parser;
    return new Parser();
})();

if (typeof require !== "undefined" && typeof exports !== "undefined") {
    exports.parser = parser;
    exports.Parser = parser.Parser;
    exports.parse = function () {
        return parser.parse.apply(parser, arguments);
    };
    exports.main = function commonjsMain(args) {
        if (!args[1]) {
            console.log("Usage: " + args[0] + " FILE");
            process.exit(1);
        }
        var source = require("fs").readFileSync(require("path").normalize(args[1]), "utf8");
        return exports.parser.parse(source);
    };
    if (typeof module !== "undefined" && require.main === module) {
        exports.main(process.argv.slice(1));
    }
};module.exports = parser;

}).call(this,require('_process'))

},{"_process":11,"fs":9,"path":10}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS93YW5neXVlL2RldmVsb3AvamVsbHltYXJrZXIvbGliL2Jhc2UuanMiLCIvaG9tZS93YW5neXVlL2RldmVsb3AvamVsbHltYXJrZXIvbGliL2NvbXBpbGVyL2FzdC5qcyIsIi9ob21lL3dhbmd5dWUvZGV2ZWxvcC9qZWxseW1hcmtlci9saWIvY29tcGlsZXIvYmFzZS5qcyIsIi9ob21lL3dhbmd5dWUvZGV2ZWxvcC9qZWxseW1hcmtlci9saWIvY29tcGlsZXIvY29tcGlsZXIuanMiLCIvaG9tZS93YW5neXVlL2RldmVsb3AvamVsbHltYXJrZXIvbGliL2NvbXBpbGVyL3BhcnNlci5qcyIsIi9ob21lL3dhbmd5dWUvZGV2ZWxvcC9qZWxseW1hcmtlci9saWIvamVsbHltYXJrZXIuanMiLCIvaG9tZS93YW5neXVlL2RldmVsb3AvamVsbHltYXJrZXIvbGliL2plbGx5bWFya2VyLnJ1bnRpbWUuanMiLCIvaG9tZS93YW5neXVlL2RldmVsb3AvamVsbHltYXJrZXIvbGliL3V0aWxzLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wYXRoLWJyb3dzZXJpZnkvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL2hvbWUvd2FuZ3l1ZS9kZXZlbG9wL2plbGx5bWFya2VyL3NyYy9ydWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O1FDQ2dCLHNCQUFzQixHQUF0QixzQkFBc0I7O0FBQS9CLFNBQVMsc0JBQXNCLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRTtBQUN6RCxRQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsSUFBSSxFQUFFLENBQUM7QUFDakMs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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pCQSxJQUFJLE1BQU0sR0FBRyxDQUFDLFlBQVU7QUFDeEIsUUFBSSxDQUFDLEdBQUMsV0FBUyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUMsRUFBQyxDQUFDLEVBQUM7QUFBQyxhQUFJLEVBQUMsR0FBQyxFQUFDLElBQUUsRUFBRSxFQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFDLENBQUE7S0FBQztRQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQUMsR0FBRyxHQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQztRQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUM7UUFBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDO1FBQUMsR0FBRyxHQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQztRQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQztRQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQztRQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUM7UUFBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDO1FBQUMsR0FBRyxHQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxDQUFDO1FBQUMsR0FBRyxHQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQztRQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQztRQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUM7UUFBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDO1FBQUMsR0FBRyxHQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxDQUFDO1FBQUMsR0FBRyxHQUFDLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLENBQUM7UUFBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDO1FBQUMsR0FBRyxHQUFDLENBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQztRQUFDLEdBQUcsR0FBQyxDQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQztRQUFDLEdBQUcsR0FBQyxDQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsQ0FBQztRQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUM7UUFBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUM7QUFDcGIsUUFBSSxNQUFNLEdBQUcsRUFBQyxLQUFLLEVBQUUsU0FBUyxLQUFLLEdBQUcsRUFBRztBQUN6QyxVQUFFLEVBQUUsRUFBRTtBQUNOLGdCQUFRLEVBQUUsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLFNBQVMsRUFBQyxDQUFDLEVBQUMsZ0JBQWdCLEVBQUMsQ0FBQyxFQUFDLFdBQVcsRUFBQyxDQUFDLEVBQUMsZ0JBQWdCLEVBQUMsQ0FBQyxFQUFDLGVBQWUsRUFBQyxDQUFDLEVBQUMsR0FBRyxFQUFDLENBQUMsRUFBQyxTQUFTLEVBQUMsQ0FBQyxFQUFDLFVBQVUsRUFBQyxFQUFFLEVBQUMsb0JBQW9CLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBQyxFQUFFLEVBQUMsZ0JBQWdCLEVBQUMsRUFBRSxFQUFDLHNCQUFzQixFQUFDLEVBQUUsRUFBQyxvQkFBb0IsRUFBQyxFQUFFLEVBQUMsbUJBQW1CLEVBQUMsRUFBRSxFQUFDLGtCQUFrQixFQUFDLEVBQUUsRUFBQyxlQUFlLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsY0FBYyxFQUFDLEVBQUUsRUFBQyxvQkFBb0IsRUFBQyxFQUFFLEVBQUMsV0FBVyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsY0FBYyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLE9BQU8sRUFBQyxFQUFFLEVBQUMsUUFBUSxFQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLHdCQUF3QixFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsb0JBQW9CLEVBQUMsRUFBRSxFQUFDLGVBQWUsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLFdBQVcsRUFBQyxFQUFFLEVBQUMsU0FBUyxFQUFDLENBQUMsRUFBQyxNQUFNLEVBQUMsQ0FBQyxFQUFDO0FBQ2hrQixrQkFBVSxFQUFFLEVBQUMsQ0FBQyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsR0FBRyxFQUFDLENBQUMsRUFBQyxTQUFTLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUMsRUFBRSxFQUFDLFFBQVEsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDO0FBQ3BJLG9CQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUM7QUFDNVQscUJBQWEsRUFBRSxTQUFTLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsT0FBTyxpQkFBa0IsRUFBRSxjQUFlLEVBQUUsZUFBZTs7O0FBRzNILGdCQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUN2QixvQkFBUSxPQUFPO0FBQ2YscUJBQUssQ0FBQzs7QUFFRSx3QkFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDaEIsMkJBQU8sSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFdEIsMEJBQU07QUFBQSxBQUNOLHFCQUFLLENBQUM7O0FBRUUsd0JBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFNUQsMEJBQU07QUFBQSxBQUNOLHFCQUFLLENBQUM7O0FBRUUsc0JBQUUsQ0FBQyxFQUFFLEdBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRCx3QkFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFDLENBQUMsQ0FBQyxDQUFDOztBQUUxQiwwQkFBTTtBQUFBLEFBQ04scUJBQUssQ0FBQyxDQUFDLEFBQUMsS0FBSyxDQUFDLENBQUMsQUFBQyxLQUFLLEVBQUUsQ0FBQyxBQUFDLEtBQUssRUFBRSxDQUFDLEFBQUMsS0FBSyxFQUFFLENBQUMsQUFBQyxLQUFLLEVBQUUsQ0FBQyxBQUFDLEtBQUssRUFBRSxDQUFDLEFBQUMsS0FBSyxFQUFFLENBQUMsQUFBQyxLQUFLLEVBQUUsQ0FBQyxBQUFDLEtBQUssRUFBRSxDQUFDLEFBQUMsS0FBSyxFQUFFLENBQUMsQUFBQyxLQUFLLEVBQUUsQ0FBQyxBQUFDLEtBQUssRUFBRSxDQUFDLEFBQUMsS0FBSyxFQUFFLENBQUMsQUFBQyxLQUFLLEVBQUUsQ0FBQyxBQUFDLEtBQUssRUFBRTs7QUFFcEksd0JBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUV4QiwwQkFBTTtBQUFBLEFBQ04scUJBQUssQ0FBQyxDQUFDLEFBQUMsS0FBSyxDQUFDOztBQUVOLHdCQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFL0MsMEJBQU07QUFBQSxBQUNOLHFCQUFLLENBQUMsQ0FBQyxBQUFDLEtBQUssQ0FBQyxDQUFDLEFBQUMsS0FBSyxFQUFFLENBQUMsQUFBQyxLQUFLLEVBQUU7O0FBRXhCLHdCQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTFCLDBCQUFNO0FBQUEsQUFDTixxQkFBSyxFQUFFLENBQUMsQUFBQyxLQUFLLEVBQUU7O0FBRVIsd0JBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFbkUsMEJBQU07QUFBQSxBQUNOLHFCQUFLLEVBQUU7O0FBRUMsd0JBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUV6QywwQkFBTTtBQUFBLEFBQ04scUJBQUssRUFBRSxDQUFDLEFBQUMsS0FBSyxFQUFFOztBQUVSLHdCQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVuRCwwQkFBTTtBQUFBLEFBQ04scUJBQUssRUFBRTs7QUFFQyx3QkFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRXBCLDBCQUFNO0FBQUEsQUFDTixxQkFBSyxFQUFFOztBQUVDLHdCQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRTFCLDBCQUFNO0FBQUEsQUFDTixxQkFBSyxFQUFFOztBQUVDLHdCQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUV6QywwQkFBTTtBQUFBLEFBQ04scUJBQUssRUFBRTs7QUFFQyx3QkFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRW5DLDBCQUFNO0FBQUEsQUFDTixxQkFBSyxFQUFFOztBQUVDLHdCQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFcEMsMEJBQU07QUFBQSxBQUNOLHFCQUFLLEVBQUU7O0FBRUMsd0JBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUV2QywwQkFBTTtBQUFBLEFBQ04scUJBQUssRUFBRSxDQUFDLEFBQUMsS0FBSyxFQUFFLENBQUMsQUFBQyxLQUFLLEVBQUUsQ0FBQyxBQUFDLEtBQUssRUFBRTs7QUFFMUIsd0JBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFbkYsMEJBQU07QUFBQSxBQUNOLHFCQUFLLEVBQUUsQ0FBQyxBQUFDLEtBQUssRUFBRSxDQUFDLEFBQUMsS0FBSyxFQUFFLENBQUMsQUFBQyxLQUFLLEVBQUU7O0FBRTFCLHdCQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFeEYsMEJBQU07QUFBQSxhQUNMO1NBQ0E7QUFDRCxhQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsR0FBRyxFQUFDLENBQUMsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLEVBQUMsRUFBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxFQUFDLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxFQUFDLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxFQUFDLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLEVBQUMsRUFBQyxFQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsRUFBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxFQUFDLEVBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsRUFBQyxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsRUFBQyxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsRUFBQyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxFQUFDLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLEVBQUMsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxFQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBQyxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFDLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUMsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsRUFBQyxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxFQUFDLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNyN0Qsc0JBQWMsRUFBRSxFQUFDLEVBQUUsRUFBQyxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsRUFBQztBQUMzQixrQkFBVSxFQUFFLFNBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDdkMsZ0JBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNsQixvQkFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNuQixNQUFNO0FBQ0gsc0JBQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDeEI7U0FDSjtBQUNELGFBQUssRUFBRSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUU7QUFDekIsZ0JBQUksSUFBSSxHQUFHLElBQUk7Z0JBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUFFLE1BQU0sR0FBRyxFQUFFO2dCQUFFLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQztnQkFBRSxNQUFNLEdBQUcsRUFBRTtnQkFBRSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUs7Z0JBQUUsTUFBTSxHQUFHLEVBQUU7Z0JBQUUsUUFBUSxHQUFHLENBQUM7Z0JBQUUsTUFBTSxHQUFHLENBQUM7Z0JBQUUsVUFBVSxHQUFHLENBQUM7Z0JBQUUsTUFBTSxHQUFHLENBQUM7Z0JBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUN4SyxnQkFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzNDLGdCQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QyxnQkFBSSxXQUFXLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7QUFDN0IsaUJBQUssSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUNuQixvQkFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNsRCwrQkFBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNsQzthQUNKO0FBQ0QsaUJBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN0Qyx1QkFBVyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQzdCLHVCQUFXLENBQUMsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDN0IsZ0JBQUksT0FBTyxLQUFLLENBQUMsTUFBTSxJQUFJLFdBQVcsRUFBRTtBQUNwQyxxQkFBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7YUFDckI7QUFDRCxnQkFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUN6QixrQkFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQixnQkFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUNuRCxnQkFBSSxPQUFPLFdBQVcsQ0FBQyxFQUFFLENBQUMsVUFBVSxLQUFLLFVBQVUsRUFBRTtBQUNqRCxvQkFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQzthQUMvQyxNQUFNO0FBQ0gsb0JBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUM7YUFDNUQ7QUFDRCxxQkFBUyxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ2pCLHFCQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQyxzQkFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNsQyxzQkFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzthQUNyQztBQUNELHdCQUFZLEVBQ1IsU0FBUyxHQUFHLEdBQUc7QUFDWCxvQkFBSSxLQUFLLENBQUM7QUFDVixxQkFBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLENBQUM7QUFDM0Isb0JBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO0FBQzNCLHlCQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUM7aUJBQ3pDO0FBQ0QsdUJBQU8sS0FBSyxDQUFDO2FBQ2hCO0FBQ0wsZ0JBQUksTUFBTTtnQkFBRSxjQUFjO2dCQUFFLEtBQUs7Z0JBQUUsTUFBTTtnQkFBRSxDQUFDO2dCQUFFLENBQUM7Z0JBQUUsS0FBSyxHQUFHLEVBQUU7Z0JBQUUsQ0FBQztnQkFBRSxHQUFHO2dCQUFFLFFBQVE7Z0JBQUUsUUFBUSxDQUFDO0FBQ3hGLG1CQUFPLElBQUksRUFBRTtBQUNULHFCQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDaEMsb0JBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUM1QiwwQkFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3ZDLE1BQU07QUFDSCx3QkFBSSxNQUFNLEtBQUssSUFBSSxJQUFJLE9BQU8sTUFBTSxJQUFJLFdBQVcsRUFBRTtBQUNqRCw4QkFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO3FCQUNsQjtBQUNELDBCQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDakQ7QUFDVyxvQkFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3ZFLHdCQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsNEJBQVEsR0FBRyxFQUFFLENBQUM7QUFDZCx5QkFBSyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQ3BCLDRCQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sRUFBRTtBQUNsQyxvQ0FBUSxDQUFDLElBQUksQ0FBQyxHQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFJLENBQUMsQ0FBQzt5QkFDbkQ7cUJBQ0o7QUFDRCx3QkFBSSxLQUFLLENBQUMsWUFBWSxFQUFFO0FBQ3BCLDhCQUFNLEdBQUcsc0JBQXNCLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQSxBQUFDLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQyxZQUFZLEVBQUUsR0FBRyxjQUFjLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUEsQUFBQyxHQUFHLEdBQUksQ0FBQztxQkFDcEwsTUFBTTtBQUNILDhCQUFNLEdBQUcsc0JBQXNCLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQSxBQUFDLEdBQUcsZUFBZSxJQUFJLE1BQU0sSUFBSSxHQUFHLEdBQUcsY0FBYyxHQUFHLEdBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQSxBQUFDLEdBQUcsR0FBSSxDQUFBLEFBQUMsQ0FBQztxQkFDN0o7QUFDRCx3QkFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7QUFDcEIsNEJBQUksRUFBRSxLQUFLLENBQUMsS0FBSztBQUNqQiw2QkFBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTTtBQUN4Qyw0QkFBSSxFQUFFLEtBQUssQ0FBQyxRQUFRO0FBQ3BCLDJCQUFHLEVBQUUsS0FBSztBQUNWLGdDQUFRLEVBQUUsUUFBUTtxQkFDckIsQ0FBQyxDQUFDO2lCQUNOO0FBQ0wsb0JBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLEtBQUssSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNqRCwwQkFBTSxJQUFJLEtBQUssQ0FBQyxtREFBbUQsR0FBRyxLQUFLLEdBQUcsV0FBVyxHQUFHLE1BQU0sQ0FBQyxDQUFDO2lCQUN2RztBQUNELHdCQUFRLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDakIseUJBQUssQ0FBQztBQUNGLDZCQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25CLDhCQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQiw4QkFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUIsNkJBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsOEJBQU0sR0FBRyxJQUFJLENBQUM7QUFDZCw0QkFBSSxDQUFDLGNBQWMsRUFBRTtBQUNqQixrQ0FBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDdEIsa0NBQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ3RCLG9DQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztBQUMxQixpQ0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDckIsZ0NBQUksVUFBVSxHQUFHLENBQUMsRUFBRTtBQUNoQiwwQ0FBVSxFQUFFLENBQUM7NkJBQ2hCO3lCQUNKLE1BQU07QUFDSCxrQ0FBTSxHQUFHLGNBQWMsQ0FBQztBQUN4QiwwQ0FBYyxHQUFHLElBQUksQ0FBQzt5QkFDekI7QUFDRCw4QkFBTTtBQUFBLEFBQ1YseUJBQUssQ0FBQztBQUNGLDJCQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0Qyw2QkFBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztBQUN0Qyw2QkFBSyxDQUFDLEVBQUUsR0FBRztBQUNQLHNDQUFVLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQSxBQUFDLENBQUMsQ0FBQyxVQUFVO0FBQ3pELHFDQUFTLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUztBQUM5Qyx3Q0FBWSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUMsWUFBWTtBQUM3RCx1Q0FBVyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFdBQVc7eUJBQ3JELENBQUM7QUFDRiw0QkFBSSxNQUFNLEVBQUU7QUFDUixpQ0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FDYixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFDM0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUNyQyxDQUFDO3lCQUNMO0FBQ0QseUJBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FDaEMsTUFBTSxFQUNOLE1BQU0sRUFDTixRQUFRLEVBQ1IsV0FBVyxDQUFDLEVBQUUsRUFDZCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQ1QsTUFBTSxFQUNOLE1BQU0sQ0FDVCxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2hCLDRCQUFJLE9BQU8sQ0FBQyxLQUFLLFdBQVcsRUFBRTtBQUMxQixtQ0FBTyxDQUFDLENBQUM7eUJBQ1o7QUFDRCw0QkFBSSxHQUFHLEVBQUU7QUFDTCxpQ0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNyQyxrQ0FBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ25DLGtDQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7eUJBQ3RDO0FBQ0QsNkJBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVDLDhCQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQiw4QkFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdEIsZ0NBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25FLDZCQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3JCLDhCQUFNO0FBQUEsQUFDVix5QkFBSyxDQUFDO0FBQ0YsK0JBQU8sSUFBSSxDQUFDO0FBQUEsaUJBQ2Y7YUFDSjtBQUNELG1CQUFPLElBQUksQ0FBQztTQUNmLEVBQUMsQ0FBQzs7QUFFSCxRQUFJLEtBQUssR0FBRyxDQUFDLFlBQVU7QUFDdkIsWUFBSSxLQUFLLEdBQUk7O0FBRWIsZUFBRyxFQUFDLENBQUM7O0FBRUwsc0JBQVUsRUFBQyxTQUFTLFVBQVUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQ2xDLG9CQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFO0FBQ2hCLHdCQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUN4QyxNQUFNO0FBQ0gsMEJBQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3hCO2FBQ0o7OztBQUdMLG9CQUFRLEVBQUMsa0JBQVUsS0FBSyxFQUFFLEVBQUUsRUFBRTtBQUN0QixvQkFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUM7QUFDOUIsb0JBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLG9CQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7QUFDakQsb0JBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDaEMsb0JBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUM3QyxvQkFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2xDLG9CQUFJLENBQUMsTUFBTSxHQUFHO0FBQ1YsOEJBQVUsRUFBRSxDQUFDO0FBQ2IsZ0NBQVksRUFBRSxDQUFDO0FBQ2YsNkJBQVMsRUFBRSxDQUFDO0FBQ1osK0JBQVcsRUFBRSxDQUFDO2lCQUNqQixDQUFDO0FBQ0Ysb0JBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDckIsd0JBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUM3QjtBQUNELG9CQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUNoQix1QkFBTyxJQUFJLENBQUM7YUFDZjs7O0FBR0wsaUJBQUssRUFBQyxpQkFBWTtBQUNWLG9CQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLG9CQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNsQixvQkFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2Qsb0JBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNkLG9CQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztBQUNqQixvQkFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDbkIsb0JBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN4QyxvQkFBSSxLQUFLLEVBQUU7QUFDUCx3QkFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2hCLHdCQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO2lCQUMzQixNQUFNO0FBQ0gsd0JBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7aUJBQzdCO0FBQ0Qsb0JBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDckIsd0JBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7aUJBQzFCOztBQUVELG9CQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DLHVCQUFPLEVBQUUsQ0FBQzthQUNiOzs7QUFHTCxpQkFBSyxFQUFDLGVBQVUsRUFBRSxFQUFFO0FBQ1osb0JBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDcEIsb0JBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7O0FBRXRDLG9CQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQy9CLG9CQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQzs7QUFFOUQsb0JBQUksQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDO0FBQ25CLG9CQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNqRCxvQkFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDekQsb0JBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUUvRCxvQkFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNsQix3QkFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztpQkFDckM7QUFDRCxvQkFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7O0FBRTFCLG9CQUFJLENBQUMsTUFBTSxHQUFHO0FBQ1YsOEJBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVU7QUFDbEMsNkJBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUM7QUFDNUIsZ0NBQVksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVk7QUFDdEMsK0JBQVcsRUFBRSxLQUFLLEdBQ2QsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFBLEdBQzdELFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FDdEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsR0FBRztpQkFDbkMsQ0FBQzs7QUFFRixvQkFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNyQix3QkFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUM7aUJBQ3hEO0FBQ0Qsb0JBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDakMsdUJBQU8sSUFBSSxDQUFDO2FBQ2Y7OztBQUdMLGdCQUFJLEVBQUMsZ0JBQVk7QUFDVCxvQkFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsdUJBQU8sSUFBSSxDQUFDO2FBQ2Y7OztBQUdMLGtCQUFNLEVBQUMsa0JBQVk7QUFDWCxvQkFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRTtBQUM5Qix3QkFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7aUJBQzFCLE1BQU07QUFDSCwyQkFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLHdCQUF3QixJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFBLEFBQUMsR0FBRyxrSUFBa0ksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUU7QUFDOU4sNEJBQUksRUFBRSxFQUFFO0FBQ1IsNkJBQUssRUFBRSxJQUFJO0FBQ1gsNEJBQUksRUFBRSxJQUFJLENBQUMsUUFBUTtxQkFDdEIsQ0FBQyxDQUFDO2lCQUVOO0FBQ0QsdUJBQU8sSUFBSSxDQUFDO2FBQ2Y7OztBQUdMLGdCQUFJLEVBQUMsY0FBVSxDQUFDLEVBQUU7QUFDVixvQkFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ25DOzs7QUFHTCxxQkFBUyxFQUFDLHFCQUFZO0FBQ2Qsb0JBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNFLHVCQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsS0FBSyxHQUFDLEVBQUUsQ0FBQSxHQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQzlFOzs7QUFHTCx5QkFBYSxFQUFDLHlCQUFZO0FBQ2xCLG9CQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3RCLG9CQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFO0FBQ2xCLHdCQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ2pEO0FBQ0QsdUJBQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFBLENBQUMsQ0FBRSxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ25GOzs7QUFHTCx3QkFBWSxFQUFDLHdCQUFZO0FBQ2pCLG9CQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDM0Isb0JBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVDLHVCQUFPLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7YUFDdEQ7OztBQUdMLHNCQUFVLEVBQUMsb0JBQVUsS0FBSyxFQUFFLFlBQVksRUFBRTtBQUNsQyxvQkFBSSxLQUFLLEVBQ0wsS0FBSyxFQUNMLE1BQU0sQ0FBQzs7QUFFWCxvQkFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRTs7QUFFOUIsMEJBQU0sR0FBRztBQUNMLGdDQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7QUFDdkIsOEJBQU0sRUFBRTtBQUNKLHNDQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQ2xDLHFDQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7QUFDekIsd0NBQVksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVk7QUFDdEMsdUNBQVcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVc7eUJBQ3ZDO0FBQ0QsOEJBQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtBQUNuQiw2QkFBSyxFQUFFLElBQUksQ0FBQyxLQUFLO0FBQ2pCLCtCQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87QUFDckIsK0JBQU8sRUFBRSxJQUFJLENBQUMsT0FBTztBQUNyQiw4QkFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO0FBQ25CLDhCQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07QUFDbkIsNkJBQUssRUFBRSxJQUFJLENBQUMsS0FBSztBQUNqQiw4QkFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO0FBQ25CLDBCQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7QUFDWCxzQ0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUM1Qyw0QkFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO3FCQUNsQixDQUFDO0FBQ0Ysd0JBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDckIsOEJBQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDcEQ7aUJBQ0o7O0FBRUQscUJBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDMUMsb0JBQUksS0FBSyxFQUFFO0FBQ1Asd0JBQUksQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQztpQkFDakM7QUFDRCxvQkFBSSxDQUFDLE1BQU0sR0FBRztBQUNWLDhCQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTO0FBQ2pDLDZCQUFTLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDO0FBQzVCLGdDQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXO0FBQ3JDLCtCQUFXLEVBQUUsS0FBSyxHQUNMLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUNsRixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTTtpQkFDekQsQ0FBQztBQUNGLG9CQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QixvQkFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsb0JBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLG9CQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2pDLG9CQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO0FBQ3JCLHdCQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ2pFO0FBQ0Qsb0JBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLG9CQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUN4QixvQkFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakQsb0JBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLHFCQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEgsb0JBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQzFCLHdCQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztpQkFDckI7QUFDRCxvQkFBSSxLQUFLLEVBQUU7QUFDUCwyQkFBTyxLQUFLLENBQUM7aUJBQ2hCLE1BQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFOztBQUV4Qix5QkFBSyxJQUFJLENBQUMsSUFBSSxNQUFNLEVBQUU7QUFDbEIsNEJBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3ZCO0FBQ0QsMkJBQU8sS0FBSyxDQUFDO2lCQUNoQjtBQUNELHVCQUFPLEtBQUssQ0FBQzthQUNoQjs7O0FBR0wsZ0JBQUksRUFBQyxnQkFBWTtBQUNULG9CQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7QUFDWCwyQkFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO2lCQUNuQjtBQUNELG9CQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNkLHdCQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztpQkFDcEI7O0FBRUQsb0JBQUksS0FBSyxFQUNMLEtBQUssRUFDTCxTQUFTLEVBQ1QsS0FBSyxDQUFDO0FBQ1Ysb0JBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2Isd0JBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLHdCQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztpQkFDbkI7QUFDRCxvQkFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ2pDLHFCQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNuQyw2QkFBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRCx3QkFBSSxTQUFTLEtBQUssQ0FBQyxLQUFLLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFBLEFBQUMsRUFBRTtBQUNoRSw2QkFBSyxHQUFHLFNBQVMsQ0FBQztBQUNsQiw2QkFBSyxHQUFHLENBQUMsQ0FBQztBQUNWLDRCQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFO0FBQzlCLGlDQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0MsZ0NBQUksS0FBSyxLQUFLLEtBQUssRUFBRTtBQUNqQix1Q0FBTyxLQUFLLENBQUM7NkJBQ2hCLE1BQU0sSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ3hCLHFDQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ2QseUNBQVM7NkJBQ1osTUFBTTs7QUFFSCx1Q0FBTyxLQUFLLENBQUM7NkJBQ2hCO3lCQUNKLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO0FBQzNCLGtDQUFNO3lCQUNUO3FCQUNKO2lCQUNKO0FBQ0Qsb0JBQUksS0FBSyxFQUFFO0FBQ1AseUJBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUM3Qyx3QkFBSSxLQUFLLEtBQUssS0FBSyxFQUFFO0FBQ2pCLCtCQUFPLEtBQUssQ0FBQztxQkFDaEI7O0FBRUQsMkJBQU8sS0FBSyxDQUFDO2lCQUNoQjtBQUNELG9CQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssRUFBRSxFQUFFO0FBQ3BCLDJCQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ25CLE1BQU07QUFDSCwyQkFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLHdCQUF3QixJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFBLEFBQUMsR0FBRyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUU7QUFDcEgsNEJBQUksRUFBRSxFQUFFO0FBQ1IsNkJBQUssRUFBRSxJQUFJO0FBQ1gsNEJBQUksRUFBRSxJQUFJLENBQUMsUUFBUTtxQkFDdEIsQ0FBQyxDQUFDO2lCQUNOO2FBQ0o7OztBQUdMLGVBQUcsRUFBQyxTQUFTLEdBQUcsR0FBRztBQUNYLG9CQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDcEIsb0JBQUksQ0FBQyxFQUFFO0FBQ0gsMkJBQU8sQ0FBQyxDQUFDO2lCQUNaLE1BQU07QUFDSCwyQkFBTyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7aUJBQ3JCO2FBQ0o7OztBQUdMLGlCQUFLLEVBQUMsU0FBUyxLQUFLLENBQUMsU0FBUyxFQUFFO0FBQ3hCLG9CQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUN2Qzs7O0FBR0wsb0JBQVEsRUFBQyxTQUFTLFFBQVEsR0FBRztBQUNyQixvQkFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLG9CQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDUCwyQkFBTyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDO2lCQUNwQyxNQUFNO0FBQ0gsMkJBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDakM7YUFDSjs7O0FBR0wseUJBQWEsRUFBQyxTQUFTLGFBQWEsR0FBRztBQUMvQixvQkFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQ25GLDJCQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztpQkFDckYsTUFBTTtBQUNILDJCQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDO2lCQUMzQzthQUNKOzs7QUFHTCxvQkFBUSxFQUFDLFNBQVMsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN0QixpQkFBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN0RCxvQkFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ1IsMkJBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDakMsTUFBTTtBQUNILDJCQUFPLFNBQVMsQ0FBQztpQkFDcEI7YUFDSjs7O0FBR0wscUJBQVMsRUFBQyxTQUFTLFNBQVMsQ0FBQyxTQUFTLEVBQUU7QUFDaEMsb0JBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDekI7OztBQUdMLDBCQUFjLEVBQUMsU0FBUyxjQUFjLEdBQUc7QUFDakMsdUJBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7YUFDckM7QUFDTCxtQkFBTyxFQUFFLEVBQUU7QUFDWCx5QkFBYSxFQUFFLFNBQVMsU0FBUyxDQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUMseUJBQXlCLEVBQUMsUUFBUSxFQUFFO0FBQzdFLG9CQUFJLE9BQU8sR0FBQyxRQUFRLENBQUM7QUFDckIsd0JBQU8seUJBQXlCO0FBQ2hDLHlCQUFLLENBQUM7QUFBQywrQkFBTyxFQUFFLENBQUE7QUFDaEIsOEJBQU07QUFBQSxBQUNOLHlCQUFLLENBQUM7QUFBQywrQkFBTyxFQUFFLENBQUE7QUFDaEIsOEJBQU07QUFBQSxBQUNOLHlCQUFLLENBQUM7QUFBQywrQkFBTyxFQUFFLENBQUE7QUFDaEIsOEJBQU07QUFBQSxBQUNOLHlCQUFLLENBQUM7QUFBQywrQkFBUSxHQUFHLENBQUE7QUFDbEIsOEJBQU07QUFBQSxBQUNOLHlCQUFLLENBQUM7QUFBQywrQkFBUSxHQUFHLENBQUE7QUFDbEIsOEJBQU07QUFBQSxBQUNOLHlCQUFLLENBQUM7QUFBQywrQkFBUSxHQUFHLENBQUE7QUFDbEIsOEJBQU07QUFBQSxBQUNOLHlCQUFLLENBQUM7QUFBQywrQkFBUSxHQUFHLENBQUE7QUFDbEIsOEJBQU07QUFBQSxBQUNOLHlCQUFLLENBQUM7QUFBQywrQkFBUSxHQUFHLENBQUE7QUFDbEIsOEJBQU07QUFBQSxBQUNOLHlCQUFLLENBQUM7QUFBQywrQkFBUSxHQUFHLENBQUE7QUFDbEIsOEJBQU07QUFBQSxBQUNOLHlCQUFLLENBQUM7QUFBQywrQkFBUSxHQUFHLENBQUE7QUFDbEIsOEJBQU07QUFBQSxBQUNOLHlCQUFLLEVBQUU7QUFBQywrQkFBUSxHQUFHLENBQUE7QUFDbkIsOEJBQU07QUFBQSxBQUNOLHlCQUFLLEVBQUU7QUFBQywrQkFBUSxHQUFHLENBQUE7QUFDbkIsOEJBQU07QUFBQSxBQUNOLHlCQUFLLEVBQUU7QUFBQywrQkFBTyxDQUFDLENBQUE7QUFDaEIsOEJBQU07QUFBQSxBQUNOLHlCQUFLLEVBQUU7QUFBQywrQkFBUSxFQUFFLENBQUE7QUFDbEIsOEJBQU07QUFBQSxpQkFDTDthQUNBO0FBQ0QsaUJBQUssRUFBRSxDQUFDLDBCQUEwQixFQUFDLGtDQUFrQyxFQUFDLCtCQUErQixFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsU0FBUyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsUUFBUSxFQUFDLFNBQVMsRUFBQyxTQUFTLEVBQUMsUUFBUSxFQUFDLFlBQVksRUFBQyxlQUFlLENBQUM7QUFDek4sc0JBQVUsRUFBRSxFQUFDLFNBQVMsRUFBQyxFQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLENBQUMsRUFBQyxXQUFXLEVBQUMsSUFBSSxFQUFDLEVBQUM7U0FDbkYsQUFBQyxDQUFDO0FBQ0gsZUFBTyxLQUFLLENBQUM7S0FDWixDQUFBLEVBQUcsQ0FBQztBQUNMLFVBQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLGFBQVMsTUFBTSxHQUFJO0FBQ2pCLFlBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0tBQ2Q7QUFDRCxVQUFNLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNqRCxXQUFPLElBQUksTUFBTSxFQUFBLENBQUM7Q0FDakIsQ0FBQSxFQUFHLENBQUM7O0FBR0wsSUFBSSxPQUFPLE9BQU8sS0FBSyxXQUFXLElBQUksT0FBTyxPQUFPLEtBQUssV0FBVyxFQUFFO0FBQ3RFLFdBQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3hCLFdBQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUMvQixXQUFPLENBQUMsS0FBSyxHQUFHLFlBQVk7QUFBRSxlQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztLQUFFLENBQUM7QUFDOUUsV0FBTyxDQUFDLElBQUksR0FBRyxTQUFTLFlBQVksQ0FBQyxJQUFJLEVBQUU7QUFDdkMsWUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNWLG1CQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUMsT0FBTyxDQUFDLENBQUM7QUFDdkMsbUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbkI7QUFDRCxZQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDcEYsZUFBTyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN2QyxDQUFDO0FBQ0YsUUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7QUFDNUQsZUFBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3JDO0NBQ0EsQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbmV4cG9ydCBmdW5jdGlvbiBKZWxseW1hcmtlckVudmlyb25tZW50KG9wZXJhdG9ycywgdmFyaWFibGVzKSB7XG4gICAgdGhpcy5vcGVyYXRvcnMgPSBvcGVyYXRvcnMgfHwge307XG4gICAgdGhpcy52YXJpYWJsZXMgPSB2YXJpYWJsZXMgfHwge307XG59XG5cbkplbGx5bWFya2VyRW52aXJvbm1lbnQucHJvdG90eXBlID0ge1xuXG4gICAgY29uc3RydWN0b3I6IEplbGx5bWFya2VyRW52aXJvbm1lbnQsXG5cbiAgICByZWdpc3RlclZhcmlhYmxlczogZnVuY3Rpb24obmFtZSwgb2JqKSB7XG4gICAgICAgIHRoaXMudmFyaWFibGVzW25hbWVdID0gb2JqO1xuICAgIH0sXG5cbiAgICB1bnJlZ2lzdGVyVmFyaWFibGVzOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnZhcmlhYmxlc1tuYW1lXTtcbiAgICB9LFxuXG4gICAgcmVnaXN0ZXJPcGVyYXRvcnM6IGZ1bmN0aW9uKG5hbWUsIG9iaikge1xuICAgICAgICB0aGlzLm9wZXJhdG9yc1tuYW1lXSA9IG9iajtcbiAgICB9LFxuXG4gICAgdW5yZWdpc3Rlck9wZXJhdG9yczogZnVuY3Rpb24obmFtZSkge1xuICAgICAgICBkZWxldGUgdGhpcy5vcGVyYXRvcnNbbmFtZV07XG4gICAgfVxuXG59O1xuIiwibGV0IEFTVCA9IHtcbiAgICBQcm9ncmFtOiBmdW5jdGlvbihzdGF0ZW1lbnRzKSB7XG4gICAgICAgIHRoaXMudHlwZSA9ICdQcm9ncmFtJztcbiAgICAgICAgdGhpcy5zdGF0ZW1lbnRzID0gc3RhdGVtZW50cztcbiAgICB9LFxuICAgIFN0YXRlbWVudDogZnVuY3Rpb24oY29udGVudCkge1xuICAgICAgICB0aGlzLnR5cGUgPSAnU3RhdGVtZW50JztcbiAgICAgICAgdGhpcy5jb250ZW50ID0gY29udGVudDtcbiAgICB9LFxuICAgIEVtcHR5U3RhdGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy50eXBlID0gJ0VtcHR5U3RhdGVtZW50JztcbiAgICB9LFxuICAgIEV4cHJTdGF0ZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnR5cGUgPSAnRXhwclN0YXRlbWVudCc7XG4gICAgfSxcbiAgICBFeHByTm9CRjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudHlwZSA9ICdFeHByTm9CRic7XG4gICAgfSxcbiAgICBFeHByOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy50eXBlID0gJ0V4cHInO1xuICAgIH0sXG4gICAgQXNzaWdubWVudEV4cHI6IGZ1bmN0aW9uKG9wZXJhdG9yLCBvcGVyYW5kMSwgb3BlcmFuZDIpIHtcbiAgICAgICAgdGhpcy50eXBlID0gJ0Fzc2lnbm1lbnRFeHByJztcbiAgICAgICAgdGhpcy5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICB0aGlzLm9wZXJhbmQxID0gb3BlcmFuZDE7XG4gICAgICAgIHRoaXMub3BlcmFuZDIgPSBvcGVyYW5kMjtcbiAgICB9LFxuICAgIEFzc2lnbm1lbnRFeHByTm9CRjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudHlwZSA9ICdBc3NpZ25tZW50RXhwck5vQkYnO1xuICAgIH0sXG4gICAgTGVmdEhhbmRTaWRlRXhwck5vQkY6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnR5cGUgPSAnTGVmdEhhbmRTaWRlRXhwck5vQkYnO1xuICAgIH0sXG4gICAgTGVmdEhhbmRTaWRlRXhwcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudHlwZSA9ICdMZWZ0SGFuZFNpZGVFeHByJztcbiAgICB9LFxuICAgIEFzc2lnbm1lbnRPcGVyYXRvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudHlwZSA9ICdBc3NpZ25tZW50T3BlcmF0b3InO1xuICAgIH0sXG4gICAgQWRkaWN0aXZlRXhwck5vQkY6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnR5cGUgPSAnQWRkaWN0aXZlRXhwck5vQkYnO1xuICAgIH0sXG4gICAgQWRkaWN0aXZlRXhwcjogZnVuY3Rpb24ob3BlcmF0b3IsIG9wZXJhbmQxLCBvcGVyYW5kMikge1xuICAgICAgICB0aGlzLnR5cGUgPSAnQWRkaWN0aXZlRXhwcic7XG4gICAgICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcbiAgICAgICAgdGhpcy5vcGVyYW5kMSA9IG9wZXJhbmQxO1xuICAgICAgICB0aGlzLm9wZXJhbmQyID0gb3BlcmFuZDI7XG4gICAgfSxcbiAgICBDYWxsRXhwcjogZnVuY3Rpb24oZm4sIGFyZ3MpIHtcbiAgICAgICAgdGhpcy50eXBlID0gJ0NhbGxFeHByJztcbiAgICAgICAgdGhpcy5mbiA9IGZuO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgIH0sXG4gICAgUHJpbWFyeUV4cHJOb0JyYWNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy50eXBlID0gJ1ByaW1hcnlFeHByTm9CcmFjZSc7XG4gICAgfSxcbiAgICBBcmd1bWVudHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnR5cGUgPSAnQXJndW1lbnRzJztcbiAgICB9LFxuICAgIEFyZ3VtZW50TGlzdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudHlwZSA9ICdBcmd1bWVudExpc3QnO1xuICAgIH0sXG4gICAgTXVsdGlwbGljYXRpdmVFeHByTm9CRjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudHlwZSA9ICdNdWx0aXBsaWNhdGl2ZUV4cHJOb0JGJztcbiAgICB9LFxuICAgIE11bHRpcGxpY2F0aXZlRXhwcjogZnVuY3Rpb24ob3BlcmF0b3IsIG9wZXJhbmQxLCBvcGVyYW5kMikge1xuICAgICAgICB0aGlzLnR5cGUgPSAnTXVsdGlwbGljYXRpdmVFeHByJztcblxuICAgICAgICB0aGlzLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHRoaXMub3BlcmFuZDEgPSBvcGVyYW5kMTtcbiAgICAgICAgdGhpcy5vcGVyYW5kMiA9IG9wZXJhbmQyO1xuICAgIH0sXG4gICAgVW5hcnlFeHByTm9CRjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudHlwZSA9ICdVbmFyeUV4cHJOb0JGJztcbiAgICB9LFxuICAgIE51bTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgdGhpcy50eXBlID0gJ051bWJlcic7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9LFxuICAgIFN0cmluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgdGhpcy50eXBlID0gJ1N0cmluZyc7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9LFxuICAgIElkOiBmdW5jdGlvbihpZGVudGlmaWVyKSB7XG4gICAgICAgIHRoaXMudHlwZSA9ICdJZCc7XG4gICAgICAgIHRoaXMuaWRlbnRpZmllciA9IGlkZW50aWZpZXI7XG4gICAgfSxcbiAgICBPcGVyYXRvcjogZnVuY3Rpb24ob3ApIHtcbiAgICAgICAgdGhpcy50eXBlID0gJ09wZXJhdG9yJztcbiAgICAgICAgdGhpcy5vcCA9IG9wO1xuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFTVDtcbiIsImltcG9ydCBwYXJzZXIgZnJvbSAnLi9wYXJzZXIuanMnO1xuaW1wb3J0IEFTVCBmcm9tICcuL2FzdC5qcyc7XG5pbXBvcnQgeyBleHRlbmQgfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCB7IHBhcnNlciB9O1xuXG5sZXQgeXkgPSB7fTtcbmV4dGVuZCh5eSwgQVNUKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKGlucHV0KSB7XG4gICAgcGFyc2VyLnl5ID0geXk7XG5cbiAgICByZXR1cm4gcGFyc2VyLnBhcnNlKGlucHV0KTtcbn1cbiIsImltcG9ydCB7aXNGdW5jdGlvbn0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gQ29tcGlsZXIoKSB7fVxuXG5mdW5jdGlvbiBub3JtYWxpemUoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQgJiYgKGlucHV0W2lucHV0Lmxlbmd0aC0xXSAhPT0gJzsnIHx8IGlucHV0W2lucHV0LmxlbmdodC0xXSAhPT0gJ1xcbicpKSB7XG4gICAgICAgIHJldHVybiBpbnB1dCArICc7JztcbiAgICB9XG4gICAgcmV0dXJuIGlucHV0O1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZShpbnB1dCkge1xuICAgIGlmIChpbnB1dCA9PT0gJycgfHwgaW5wdXQgPT09IG51bGwgfHwgdHlwZW9mIGlucHV0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuXG5Db21waWxlci5wcm90b3R5cGUgPSB7XG4gICAgY29tcGlsZXI6IENvbXBpbGVyLFxuXG4gICAgY29tcGlsZTogZnVuY3Rpb24ocHJvZ3JhbSkge1xuICAgICAgICBsZXQgcmV0ID0gdGhpcy5hY2NlcHQocHJvZ3JhbSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcbiAgICBhY2NlcHQ6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgbGV0IHJldCA9IHRoaXNbbm9kZS50eXBlXShub2RlKTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuICAgIFByb2dyYW06IGZ1bmN0aW9uKHByb2dyYW0pIHtcbiAgICAgICAgbGV0IHN0YXRlbWVudHMgPSBwcm9ncmFtLnN0YXRlbWVudHM7XG4gICAgICAgIGxldCByZXQgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXRlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJldC5wdXNoKHRoaXMuYWNjZXB0KHN0YXRlbWVudHNbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG4gICAgU3RhdGVtZW50OiBmdW5jdGlvbihzdGF0ZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWNjZXB0KHN0YXRlbWVudC5jb250ZW50KTtcbiAgICB9LFxuICAgIEVtcHR5U3RhdGVtZW50OiBmdW5jdGlvbihlbXB0eVN0YXRlbWVudCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIE9wZXJhdG9yOiBmdW5jdGlvbihvcGVyYXRvcikge1xuICAgICAgICByZXR1cm4gdGhpcy5vcGVyYXRvcnNbb3BlcmF0b3Iub3BdO1xuICAgIH0sXG4gICAgVmFyaWFibGU6IGZ1bmN0aW9uKHZhcmlhYmxlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhcmlhYmxlc1t2YXJpYWJsZS5pZGVudGlmaWVyXTtcbiAgICB9LFxuICAgIEFzc2lnbm1lbnRFeHByOiBmdW5jdGlvbihhc3NpZ25tZW50RXhwcikge1xuICAgICAgICB2YXIgcmlnaHQgPSB0aGlzLmFjY2VwdChhc3NpZ25tZW50RXhwci5vcGVyYW5kMik7XG4gICAgICAgIHZhciBvcCA9IHRoaXMuYWNjZXB0KGFzc2lnbm1lbnRFeHByLm9wZXJhdG9yKTtcblxuICAgICAgICBvcCA9IG9wIHx8ICgodikgPT4ge3JldHVybiB2O30pO1xuXG4gICAgICAgIHZhciBpZCA9ICBhc3NpZ25tZW50RXhwci5vcGVyYW5kMS5pZGVudGlmaWVyO1xuICAgICAgICB0aGlzLnZhcmlhYmxlc1tpZF0gPSBvcChyaWdodCk7XG5cbiAgICAgICAgcmV0dXJuIHJpZ2h0O1xuICAgIH0sXG4gICAgQWRkaWN0aXZlRXhwcjogZnVuY3Rpb24oYWRkaWN0aXZlRXhwcikge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmFsQmluRXhwcihhZGRpY3RpdmVFeHByKTtcbiAgICB9LFxuICAgIE11bHRpcGxpY2F0aXZlRXhwcjogZnVuY3Rpb24obXVsdGlwbGljYXRpdmVFeHByKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWxCaW5FeHByKG11bHRpcGxpY2F0aXZlRXhwcik7XG4gICAgfSxcbiAgICBOdW1iZXI6IGZ1bmN0aW9uKG51bWJlcikge1xuICAgICAgICByZXR1cm4gK251bWJlci52YWx1ZTtcbiAgICB9LFxuICAgIFN0cmluZzogZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIudmFsdWUuc3Vic3RyaW5nKDEsIHN0ci52YWx1ZS5sZW5ndGgtMSk7XG4gICAgfSxcbiAgICBJZDogZnVuY3Rpb24oaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFyaWFibGVzW2lkLmlkZW50aWZpZXJdO1xuICAgIH0sXG4gICAgQ2FsbEV4cHI6IGZ1bmN0aW9uKGNhbGxFeHByKSB7XG4gICAgICAgIHZhciBmbiA9IHRoaXMuYWNjZXB0KGNhbGxFeHByLmZuKTtcbiAgICAgICAgdmFyIGFyZ3MgPSBbXTtcblxuICAgICAgICBpZiAoY2FsbEV4cHIuYXJncyAmJiBjYWxsRXhwci5hcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGFyZ3MgPSBjYWxsRXhwci5hcmdzLm1hcCggKGFyZykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFjY2VwdChhcmcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZuICYmIGlzRnVuY3Rpb24oZm4pKSB7XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkoe1xuICAgICAgICAgICAgICAgIG9wZXJhdG9yczogdGhpcy5vcGVyYXRvcnMsXG4gICAgICAgICAgICAgICAgdmFyaWFibGVzOiB0aGlzLnZhcmlhYmxlc1xuICAgICAgICAgICAgfSwgYXJncyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL1RPRE86IGV4Y2VwdGlvblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBzdWNoIGZ1bmN0aW9uJyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGV2YWxCaW5FeHByOiBmdW5jdGlvbihleHByKSB7XG4gICAgICAgIHZhciBvcGVyYXRvciA9IHRoaXMuYWNjZXB0KGV4cHIub3BlcmF0b3IpO1xuICAgICAgICB2YXIgb3BlcmFuZDEgPSB0aGlzLmFjY2VwdChleHByLm9wZXJhbmQxKTtcbiAgICAgICAgdmFyIG9wZXJhbmQyID0gdGhpcy5hY2NlcHQoZXhwci5vcGVyYW5kMik7XG5cbiAgICAgICAgaWYgKG9wZXJhdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gb3BlcmF0b3Iob3BlcmFuZDEsIG9wZXJhbmQyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vVE9ETzogZXhjZXB0aW9uXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHN1Y2ggb3BlcmF0b3InKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlKGlucHV0LCBvcHRpb25zLCBlbnYpIHtcbiAgICBpZiAoIXZhbGlkYXRlKGlucHV0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGxldCBhc3QgPSBlbnYucGFyc2Uobm9ybWFsaXplKGlucHV0KSwgb3B0aW9ucyk7XG4gICAgbGV0IGNvbXBpbGVyID0gbmV3IGVudi5Db21waWxlcigpO1xuXG4gICAgY29tcGlsZXIub3BlcmF0b3JzID0gZW52Lm9wZXJhdG9ycztcbiAgICBjb21waWxlci52YXJpYWJsZXMgPSBlbnYudmFyaWFibGVzO1xuXG4gICAgcmV0dXJuIGNvbXBpbGVyLmNvbXBpbGUoYXN0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV2YWwoaW5wdXQsIG9wdGlvbnMsIGVudikge1xuICAgIGlmICghdmFsaWRhdGUoaW5wdXQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgbGV0IGFzdCA9IGVudi5wYXJzZShub3JtYWxpemUoaW5wdXQpLCBvcHRpb25zKTtcbiAgICBsZXQgY29tcGlsZXIgPSBuZXcgZW52LkNvbXBpbGVyKCk7XG5cbiAgICBjb21waWxlci5vcGVyYXRvcnMgPSBlbnYub3BlcmF0b3JzO1xuICAgIGNvbXBpbGVyLnZhcmlhYmxlcyA9IGVudi52YXJpYWJsZXM7XG5cbiAgICBsZXQgcmV0ID0gY29tcGlsZXIuY29tcGlsZShhc3QpO1xuICAgIGlmIChyZXQgJiYgcmV0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmV0dXJuIHJldFswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL3NyYy9ydWxlLmpzJyk7XG4iLCJpbXBvcnQgcnVudGltZSBmcm9tICcuL2plbGx5bWFya2VyLnJ1bnRpbWUnO1xuXG5pbXBvcnQgQVNUIGZyb20gJy4vY29tcGlsZXIvYXN0JztcbmltcG9ydCB7IHBhcnNlciBhcyBQYXJzZXIsIHBhcnNlIH0gZnJvbSAnLi9jb21waWxlci9iYXNlJztcbmltcG9ydCB7IENvbXBpbGVyLCBjb21waWxlLCBldmFsIH0gZnJvbSAnLi9jb21waWxlci9jb21waWxlcic7XG5pbXBvcnQgeyBleHRlbmQgfSBmcm9tICcuL3V0aWxzJztcblxubGV0IF9jcmVhdGUgPSBydW50aW1lLmNyZWF0ZTtcblxuZnVuY3Rpb24gY3JlYXRlKCkge1xuICAgIGxldCB0bSA9IF9jcmVhdGUoKTtcblxuICAgIHRtLmNvbXBpbGUgPSBmdW5jdGlvbihpbnB1dCwgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gY29tcGlsZShpbnB1dCwgb3B0aW9ucywgdG0pO1xuICAgIH07XG4gICAgdG0uZXZhbCA9IGZ1bmN0aW9uKGlucHV0LCBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBldmFsKGlucHV0LCBvcHRpb25zLCB0bSk7XG4gICAgfTtcbiAgICB0bS5BU1QgPSBBU1Q7XG4gICAgdG0uQ29tcGlsZXIgPSBDb21waWxlcjtcbiAgICB0bS5QYXJzZXIgPSBQYXJzZXI7XG4gICAgdG0ucGFyc2UgPSBwYXJzZTtcbiAgICB0bS51dGlsID0geyBleHRlbmQgfTtcblxuICAgIHJldHVybiB0bTtcbn1cblxubGV0IGluc3QgPSBjcmVhdGUoKTtcbmluc3QuY3JlYXRlID0gY3JlYXRlO1xuXG5pbnN0WydkZWZhdWx0J10gPSBpbnN0O1xuXG5leHBvcnQgZGVmYXVsdCBpbnN0O1xuIiwiaW1wb3J0ICogYXMgYmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5mdW5jdGlvbiBjcmVhdGUoKSB7XG4gICAgbGV0IGptID0gbmV3IGJhc2UuSmVsbHltYXJrZXJFbnZpcm9ubWVudCgpO1xuXG4gICAgcmV0dXJuIGptO1xufVxuXG5sZXQgaW5zdCA9IGNyZWF0ZSgpO1xuaW5zdC5jcmVhdGUgPSBjcmVhdGU7XG5cbmluc3RbJ2RlZmF1bHQnXSA9IGluc3Q7XG5cbmV4cG9ydCBkZWZhdWx0IGluc3Q7XG4iLCJleHBvcnQgZnVuY3Rpb24gZXh0ZW5kKG9iaiAvKiAsIC4uLnNvdXJjZSAqLykge1xuICBmb3IgKGxldCBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGZvciAobGV0IGtleSBpbiBhcmd1bWVudHNbaV0pIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXJndW1lbnRzW2ldLCBrZXkpKSB7XG4gICAgICAgIG9ialtrZXldID0gYXJndW1lbnRzW2ldW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiAhIShvYmogJiYgb2JqLmNvbnN0cnVjdG9yICYmIG9iai5jYWxsICYmIG9iai5hcHBseSk7XG59XG4iLG51bGwsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyByZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggYXJyYXkgd2l0aCBkaXJlY3RvcnkgbmFtZXMgdGhlcmVcbi8vIG11c3QgYmUgbm8gc2xhc2hlcywgZW1wdHkgZWxlbWVudHMsIG9yIGRldmljZSBuYW1lcyAoYzpcXCkgaW4gdGhlIGFycmF5XG4vLyAoc28gYWxzbyBubyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIC0gaXQgZG9lcyBub3QgZGlzdGluZ3Vpc2hcbi8vIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBwYXRocylcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICB2YXIgdXAgPSAwO1xuICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICB2YXIgbGFzdCA9IHBhcnRzW2ldO1xuICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICB9IGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgIHVwKys7XG4gICAgfSBlbHNlIGlmICh1cCkge1xuICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgdXAtLTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgcGFydHMudW5zaGlmdCgnLi4nKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cbi8vIFNwbGl0IGEgZmlsZW5hbWUgaW50byBbcm9vdCwgZGlyLCBiYXNlbmFtZSwgZXh0XSwgdW5peCB2ZXJzaW9uXG4vLyAncm9vdCcgaXMganVzdCBhIHNsYXNoLCBvciBub3RoaW5nLlxudmFyIHNwbGl0UGF0aFJlID1cbiAgICAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcbnZhciBzcGxpdFBhdGggPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICByZXR1cm4gc3BsaXRQYXRoUmUuZXhlYyhmaWxlbmFtZSkuc2xpY2UoMSk7XG59O1xuXG4vLyBwYXRoLnJlc29sdmUoW2Zyb20gLi4uXSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJlc29sdmVkUGF0aCA9ICcnLFxuICAgICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuXG4gIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgdmFyIHBhdGggPSAoaSA+PSAwKSA/IGFyZ3VtZW50c1tpXSA6IHByb2Nlc3MuY3dkKCk7XG5cbiAgICAvLyBTa2lwIGVtcHR5IGFuZCBpbnZhbGlkIGVudHJpZXNcbiAgICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5yZXNvbHZlIG11c3QgYmUgc3RyaW5ncycpO1xuICAgIH0gZWxzZSBpZiAoIXBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc29sdmVkUGF0aCA9IHBhdGggKyAnLycgKyByZXNvbHZlZFBhdGg7XG4gICAgcmVzb2x2ZWRBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gIH1cblxuICAvLyBBdCB0aGlzIHBvaW50IHRoZSBwYXRoIHNob3VsZCBiZSByZXNvbHZlZCB0byBhIGZ1bGwgYWJzb2x1dGUgcGF0aCwgYnV0XG4gIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRocyB0byBiZSBzYWZlIChtaWdodCBoYXBwZW4gd2hlbiBwcm9jZXNzLmN3ZCgpIGZhaWxzKVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICByZXNvbHZlZFBhdGggPSBub3JtYWxpemVBcnJheShmaWx0ZXIocmVzb2x2ZWRQYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIXJlc29sdmVkQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICByZXR1cm4gKChyZXNvbHZlZEFic29sdXRlID8gJy8nIDogJycpICsgcmVzb2x2ZWRQYXRoKSB8fCAnLic7XG59O1xuXG4vLyBwYXRoLm5vcm1hbGl6ZShwYXRoKVxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciBpc0Fic29sdXRlID0gZXhwb3J0cy5pc0Fic29sdXRlKHBhdGgpLFxuICAgICAgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KGZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gISFwO1xuICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICBwYXRoID0gJy4nO1xuICB9XG4gIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICBwYXRoICs9ICcvJztcbiAgfVxuXG4gIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLmlzQWJzb2x1dGUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHJldHVybiBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xufTtcblxuLy8gcG9zaXggdmVyc2lvblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZShmaWx0ZXIocGF0aHMsIGZ1bmN0aW9uKHAsIGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICB9XG4gICAgcmV0dXJuIHA7XG4gIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5cbi8vIHBhdGgucmVsYXRpdmUoZnJvbSwgdG8pXG4vLyBwb3NpeCB2ZXJzaW9uXG5leHBvcnRzLnJlbGF0aXZlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgZnJvbSA9IGV4cG9ydHMucmVzb2x2ZShmcm9tKS5zdWJzdHIoMSk7XG4gIHRvID0gZXhwb3J0cy5yZXNvbHZlKHRvKS5zdWJzdHIoMSk7XG5cbiAgZnVuY3Rpb24gdHJpbShhcnIpIHtcbiAgICB2YXIgc3RhcnQgPSAwO1xuICAgIGZvciAoOyBzdGFydCA8IGFyci5sZW5ndGg7IHN0YXJ0KyspIHtcbiAgICAgIGlmIChhcnJbc3RhcnRdICE9PSAnJykgYnJlYWs7XG4gICAgfVxuXG4gICAgdmFyIGVuZCA9IGFyci5sZW5ndGggLSAxO1xuICAgIGZvciAoOyBlbmQgPj0gMDsgZW5kLS0pIHtcbiAgICAgIGlmIChhcnJbZW5kXSAhPT0gJycpIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBhcnIuc2xpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0ICsgMSk7XG4gIH1cblxuICB2YXIgZnJvbVBhcnRzID0gdHJpbShmcm9tLnNwbGl0KCcvJykpO1xuICB2YXIgdG9QYXJ0cyA9IHRyaW0odG8uc3BsaXQoJy8nKSk7XG5cbiAgdmFyIGxlbmd0aCA9IE1hdGgubWluKGZyb21QYXJ0cy5sZW5ndGgsIHRvUGFydHMubGVuZ3RoKTtcbiAgdmFyIHNhbWVQYXJ0c0xlbmd0aCA9IGxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChmcm9tUGFydHNbaV0gIT09IHRvUGFydHNbaV0pIHtcbiAgICAgIHNhbWVQYXJ0c0xlbmd0aCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICB2YXIgb3V0cHV0UGFydHMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IHNhbWVQYXJ0c0xlbmd0aDsgaSA8IGZyb21QYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgIG91dHB1dFBhcnRzLnB1c2goJy4uJyk7XG4gIH1cblxuICBvdXRwdXRQYXJ0cyA9IG91dHB1dFBhcnRzLmNvbmNhdCh0b1BhcnRzLnNsaWNlKHNhbWVQYXJ0c0xlbmd0aCkpO1xuXG4gIHJldHVybiBvdXRwdXRQYXJ0cy5qb2luKCcvJyk7XG59O1xuXG5leHBvcnRzLnNlcCA9ICcvJztcbmV4cG9ydHMuZGVsaW1pdGVyID0gJzonO1xuXG5leHBvcnRzLmRpcm5hbWUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHZhciByZXN1bHQgPSBzcGxpdFBhdGgocGF0aCksXG4gICAgICByb290ID0gcmVzdWx0WzBdLFxuICAgICAgZGlyID0gcmVzdWx0WzFdO1xuXG4gIGlmICghcm9vdCAmJiAhZGlyKSB7XG4gICAgLy8gTm8gZGlybmFtZSB3aGF0c29ldmVyXG4gICAgcmV0dXJuICcuJztcbiAgfVxuXG4gIGlmIChkaXIpIHtcbiAgICAvLyBJdCBoYXMgYSBkaXJuYW1lLCBzdHJpcCB0cmFpbGluZyBzbGFzaFxuICAgIGRpciA9IGRpci5zdWJzdHIoMCwgZGlyLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIHJvb3QgKyBkaXI7XG59O1xuXG5cbmV4cG9ydHMuYmFzZW5hbWUgPSBmdW5jdGlvbihwYXRoLCBleHQpIHtcbiAgdmFyIGYgPSBzcGxpdFBhdGgocGF0aClbMl07XG4gIC8vIFRPRE86IG1ha2UgdGhpcyBjb21wYXJpc29uIGNhc2UtaW5zZW5zaXRpdmUgb24gd2luZG93cz9cbiAgaWYgKGV4dCAmJiBmLnN1YnN0cigtMSAqIGV4dC5sZW5ndGgpID09PSBleHQpIHtcbiAgICBmID0gZi5zdWJzdHIoMCwgZi5sZW5ndGggLSBleHQubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gZjtcbn07XG5cblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24ocGF0aCkge1xuICByZXR1cm4gc3BsaXRQYXRoKHBhdGgpWzNdO1xufTtcblxuZnVuY3Rpb24gZmlsdGVyICh4cywgZikge1xuICAgIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZik7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGYoeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHsgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbikgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8qIHBhcnNlciBnZW5lcmF0ZWQgYnkgamlzb24gMC40LjE1ICovXG4vKlxuICBSZXR1cm5zIGEgUGFyc2VyIG9iamVjdCBvZiB0aGUgZm9sbG93aW5nIHN0cnVjdHVyZTpcblxuICBQYXJzZXI6IHtcbiAgICB5eToge31cbiAgfVxuXG4gIFBhcnNlci5wcm90b3R5cGU6IHtcbiAgICB5eToge30sXG4gICAgdHJhY2U6IGZ1bmN0aW9uKCksXG4gICAgc3ltYm9sc186IHthc3NvY2lhdGl2ZSBsaXN0OiBuYW1lID09PiBudW1iZXJ9LFxuICAgIHRlcm1pbmFsc186IHthc3NvY2lhdGl2ZSBsaXN0OiBudW1iZXIgPT0+IG5hbWV9LFxuICAgIHByb2R1Y3Rpb25zXzogWy4uLl0sXG4gICAgcGVyZm9ybUFjdGlvbjogZnVuY3Rpb24gYW5vbnltb3VzKHl5dGV4dCwgeXlsZW5nLCB5eWxpbmVubywgeXksIHl5c3RhdGUsICQkLCBfJCksXG4gICAgdGFibGU6IFsuLi5dLFxuICAgIGRlZmF1bHRBY3Rpb25zOiB7Li4ufSxcbiAgICBwYXJzZUVycm9yOiBmdW5jdGlvbihzdHIsIGhhc2gpLFxuICAgIHBhcnNlOiBmdW5jdGlvbihpbnB1dCksXG5cbiAgICBsZXhlcjoge1xuICAgICAgICBFT0Y6IDEsXG4gICAgICAgIHBhcnNlRXJyb3I6IGZ1bmN0aW9uKHN0ciwgaGFzaCksXG4gICAgICAgIHNldElucHV0OiBmdW5jdGlvbihpbnB1dCksXG4gICAgICAgIGlucHV0OiBmdW5jdGlvbigpLFxuICAgICAgICB1bnB1dDogZnVuY3Rpb24oc3RyKSxcbiAgICAgICAgbW9yZTogZnVuY3Rpb24oKSxcbiAgICAgICAgbGVzczogZnVuY3Rpb24obiksXG4gICAgICAgIHBhc3RJbnB1dDogZnVuY3Rpb24oKSxcbiAgICAgICAgdXBjb21pbmdJbnB1dDogZnVuY3Rpb24oKSxcbiAgICAgICAgc2hvd1Bvc2l0aW9uOiBmdW5jdGlvbigpLFxuICAgICAgICB0ZXN0X21hdGNoOiBmdW5jdGlvbihyZWdleF9tYXRjaF9hcnJheSwgcnVsZV9pbmRleCksXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uKCksXG4gICAgICAgIGxleDogZnVuY3Rpb24oKSxcbiAgICAgICAgYmVnaW46IGZ1bmN0aW9uKGNvbmRpdGlvbiksXG4gICAgICAgIHBvcFN0YXRlOiBmdW5jdGlvbigpLFxuICAgICAgICBfY3VycmVudFJ1bGVzOiBmdW5jdGlvbigpLFxuICAgICAgICB0b3BTdGF0ZTogZnVuY3Rpb24oKSxcbiAgICAgICAgcHVzaFN0YXRlOiBmdW5jdGlvbihjb25kaXRpb24pLFxuXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIHJhbmdlczogYm9vbGVhbiAgICAgICAgICAgKG9wdGlvbmFsOiB0cnVlID09PiB0b2tlbiBsb2NhdGlvbiBpbmZvIHdpbGwgaW5jbHVkZSBhIC5yYW5nZVtdIG1lbWJlcilcbiAgICAgICAgICAgIGZsZXg6IGJvb2xlYW4gICAgICAgICAgICAgKG9wdGlvbmFsOiB0cnVlID09PiBmbGV4LWxpa2UgbGV4aW5nIGJlaGF2aW91ciB3aGVyZSB0aGUgcnVsZXMgYXJlIHRlc3RlZCBleGhhdXN0aXZlbHkgdG8gZmluZCB0aGUgbG9uZ2VzdCBtYXRjaClcbiAgICAgICAgICAgIGJhY2t0cmFja19sZXhlcjogYm9vbGVhbiAgKG9wdGlvbmFsOiB0cnVlID09PiBsZXhlciByZWdleGVzIGFyZSB0ZXN0ZWQgaW4gb3JkZXIgYW5kIGZvciBlYWNoIG1hdGNoaW5nIHJlZ2V4IHRoZSBhY3Rpb24gY29kZSBpcyBpbnZva2VkOyB0aGUgbGV4ZXIgdGVybWluYXRlcyB0aGUgc2NhbiB3aGVuIGEgdG9rZW4gaXMgcmV0dXJuZWQgYnkgdGhlIGFjdGlvbiBjb2RlKVxuICAgICAgICB9LFxuXG4gICAgICAgIHBlcmZvcm1BY3Rpb246IGZ1bmN0aW9uKHl5LCB5eV8sICRhdm9pZGluZ19uYW1lX2NvbGxpc2lvbnMsIFlZX1NUQVJUKSxcbiAgICAgICAgcnVsZXM6IFsuLi5dLFxuICAgICAgICBjb25kaXRpb25zOiB7YXNzb2NpYXRpdmUgbGlzdDogbmFtZSA9PT4gc2V0fSxcbiAgICB9XG4gIH1cblxuXG4gIHRva2VuIGxvY2F0aW9uIGluZm8gKEAkLCBfJCwgZXRjLik6IHtcbiAgICBmaXJzdF9saW5lOiBuLFxuICAgIGxhc3RfbGluZTogbixcbiAgICBmaXJzdF9jb2x1bW46IG4sXG4gICAgbGFzdF9jb2x1bW46IG4sXG4gICAgcmFuZ2U6IFtzdGFydF9udW1iZXIsIGVuZF9udW1iZXJdICAgICAgICh3aGVyZSB0aGUgbnVtYmVycyBhcmUgaW5kZXhlcyBpbnRvIHRoZSBpbnB1dCBzdHJpbmcsIHJlZ3VsYXIgemVyby1iYXNlZClcbiAgfVxuXG5cbiAgdGhlIHBhcnNlRXJyb3IgZnVuY3Rpb24gcmVjZWl2ZXMgYSAnaGFzaCcgb2JqZWN0IHdpdGggdGhlc2UgbWVtYmVycyBmb3IgbGV4ZXIgYW5kIHBhcnNlciBlcnJvcnM6IHtcbiAgICB0ZXh0OiAgICAgICAgKG1hdGNoZWQgdGV4dClcbiAgICB0b2tlbjogICAgICAgKHRoZSBwcm9kdWNlZCB0ZXJtaW5hbCB0b2tlbiwgaWYgYW55KVxuICAgIGxpbmU6ICAgICAgICAoeXlsaW5lbm8pXG4gIH1cbiAgd2hpbGUgcGFyc2VyIChncmFtbWFyKSBlcnJvcnMgd2lsbCBhbHNvIHByb3ZpZGUgdGhlc2UgbWVtYmVycywgaS5lLiBwYXJzZXIgZXJyb3JzIGRlbGl2ZXIgYSBzdXBlcnNldCBvZiBhdHRyaWJ1dGVzOiB7XG4gICAgbG9jOiAgICAgICAgICh5eWxsb2MpXG4gICAgZXhwZWN0ZWQ6ICAgIChzdHJpbmcgZGVzY3JpYmluZyB0aGUgc2V0IG9mIGV4cGVjdGVkIHRva2VucylcbiAgICByZWNvdmVyYWJsZTogKGJvb2xlYW46IFRSVUUgd2hlbiB0aGUgcGFyc2VyIGhhcyBhIGVycm9yIHJlY292ZXJ5IHJ1bGUgYXZhaWxhYmxlIGZvciB0aGlzIHBhcnRpY3VsYXIgZXJyb3IpXG4gIH1cbiovXG52YXIgcGFyc2VyID0gKGZ1bmN0aW9uKCl7XG52YXIgbz1mdW5jdGlvbihrLHYsbyxsKXtmb3Iobz1vfHx7fSxsPWsubGVuZ3RoO2wtLTtvW2tbbF1dPXYpO3JldHVybiBvfSwkVjA9WzEsNl0sJFYxPVsxLDddLCRWMj1bMSwxOF0sJFYzPVsxLDE1XSwkVjQ9WzEsMTZdLCRWNT1bMSwxN10sJFY2PVsxLDgsOSwyMywyNywyOCwyOV0sJFY3PVs4LDldLCRWOD1bOCw5LDMxLDMyLDM1LDM2XSwkVjk9WzIsNDNdLCRWYT1bMSwyNF0sJFZiPVs4LDksMTksMzEsMzIsMzUsMzZdLCRWYz1bMSwyOF0sJFZkPVs4LDksMzEsMzJdLCRWZT1bMSwzMF0sJFZmPVsxLDMxXSwkVmc9WzgsOSwxOSwyMywyNCwyNiwzMSwzMiwzNSwzNl0sJFZoPVsyNCwyNiwzMSwzMiwzNSwzNl0sJFZpPVsyLDQ0XSwkVmo9WzI0LDI2XSwkVms9WzE5LDI0LDI2LDMxLDMyLDM1LDM2XSwkVmw9WzI0LDI2LDMxLDMyXSwkVm09WzEsNTNdLCRWbj1bMSw1NF07XG52YXIgcGFyc2VyID0ge3RyYWNlOiBmdW5jdGlvbiB0cmFjZSgpIHsgfSxcbnl5OiB7fSxcbnN5bWJvbHNfOiB7XCJlcnJvclwiOjIsXCJQcm9ncmFtXCI6MyxcIlNvdXJjZUVsZW1lbnRzXCI6NCxcIlN0YXRlbWVudFwiOjUsXCJFbXB0eVN0YXRlbWVudFwiOjYsXCJFeHByU3RhdGVtZW50XCI6NyxcIjtcIjo4LFwiTkVXTElORVwiOjksXCJFeHByTm9CRlwiOjEwLFwiQXNzaWdubWVudEV4cHJOb0JGXCI6MTEsXCJFeHByXCI6MTIsXCJBc3NpZ25tZW50RXhwclwiOjEzLFwiTGVmdEhhbmRTaWRlRXhwck5vQkZcIjoxNCxcIkFzc2lnbm1lbnRPcGVyYXRvclwiOjE1LFwiQWRkaWN0aXZlRXhwck5vQkZcIjoxNixcIkxlZnRIYW5kU2lkZUV4cHJcIjoxNyxcIkFkZGljdGl2ZUV4cHJcIjoxOCxcIj1cIjoxOSxcIkNhbGxFeHByTm9CRlwiOjIwLFwiUHJpbWFyeUV4cHJOb0JyYWNlXCI6MjEsXCJBcmd1bWVudHNcIjoyMixcIihcIjoyMyxcIilcIjoyNCxcIkFyZ3VtZW50TGlzdFwiOjI1LFwiLFwiOjI2LFwiSURFTlRcIjoyNyxcIk5VTUJFUlwiOjI4LFwiU1RSSU5HXCI6MjksXCJNdWx0aXBsaWNhdGl2ZUV4cHJOb0JGXCI6MzAsXCIrXCI6MzEsXCItXCI6MzIsXCJNdWx0aXBsaWNhdGl2ZUV4cHJcIjozMyxcIlVuYXJ5RXhwck5vQkZcIjozNCxcIipcIjozNSxcIi9cIjozNixcIlVuYXJ5RXhwclwiOjM3LFwiJGFjY2VwdFwiOjAsXCIkZW5kXCI6MX0sXG50ZXJtaW5hbHNfOiB7MjpcImVycm9yXCIsODpcIjtcIiw5OlwiTkVXTElORVwiLDE5OlwiPVwiLDIzOlwiKFwiLDI0OlwiKVwiLDI2OlwiLFwiLDI3OlwiSURFTlRcIiwyODpcIk5VTUJFUlwiLDI5OlwiU1RSSU5HXCIsMzE6XCIrXCIsMzI6XCItXCIsMzU6XCIqXCIsMzY6XCIvXCJ9LFxucHJvZHVjdGlvbnNfOiBbMCxbMywxXSxbNCwxXSxbNCwyXSxbNSwxXSxbNSwxXSxbNiwxXSxbNiwxXSxbNywyXSxbNywyXSxbMTAsMV0sWzEyLDFdLFsxMSwzXSxbMTEsMV0sWzEzLDNdLFsxMywxXSxbMTUsMV0sWzIwLDJdLFsyMCwyXSxbMjIsMl0sWzIyLDNdLFsyNSwxXSxbMjUsM10sWzE0LDFdLFsxNCwxXSxbMTcsMV0sWzE3LDFdLFsyMSwxXSxbMjEsMV0sWzIxLDFdLFsyMSwzXSxbMTYsMV0sWzE2LDNdLFsxNiwzXSxbMTgsMV0sWzE4LDNdLFsxOCwzXSxbMzAsMV0sWzMwLDNdLFszMCwzXSxbMzMsMV0sWzMzLDNdLFszMywzXSxbMzQsMV0sWzM3LDFdXSxcbnBlcmZvcm1BY3Rpb246IGZ1bmN0aW9uIGFub255bW91cyh5eXRleHQsIHl5bGVuZywgeXlsaW5lbm8sIHl5LCB5eXN0YXRlIC8qIGFjdGlvblsxXSAqLywgJCQgLyogdnN0YWNrICovLCBfJCAvKiBsc3RhY2sgKi8pIHtcbi8qIHRoaXMgPT0geXl2YWwgKi9cblxudmFyICQwID0gJCQubGVuZ3RoIC0gMTtcbnN3aXRjaCAoeXlzdGF0ZSkge1xuY2FzZSAxOlxuXG4gICAgICAgIHRoaXMuJCA9ICQkWyQwXTtcbiAgICAgICAgcmV0dXJuIHRoaXMuJDtcbiAgICBcbmJyZWFrO1xuY2FzZSAyOlxuXG4gICAgICAgIHRoaXMuJCA9IG5ldyB5eS5Qcm9ncmFtKFtuZXcgeXkuU3RhdGVtZW50KCQkWyQwXSldKTtcbiAgICBcbmJyZWFrO1xuY2FzZSAzOlxuXG4gICAgICAgICQkWyQwLTFdLnN0YXRlbWVudHMucHVzaChuZXcgeXkuU3RhdGVtZW50KCQkWyQwXSkpO1xuICAgICAgICB0aGlzLiQgPSAkJFskMC0xXTtcbiAgICBcbmJyZWFrO1xuY2FzZSA0OiBjYXNlIDU6IGNhc2UgMTA6IGNhc2UgMTE6IGNhc2UgMTM6IGNhc2UgMTU6IGNhc2UgMjM6IGNhc2UgMjQ6IGNhc2UgMjU6IGNhc2UgMjY6IGNhc2UgMzE6IGNhc2UgMzQ6IGNhc2UgMzc6IGNhc2UgNDA6IGNhc2UgNDM6IGNhc2UgNDQ6XG5cbiAgICAgICAgdGhpcy4kID0gJCRbJDBdO1xuICAgIFxuYnJlYWs7XG5jYXNlIDY6IGNhc2UgNzpcblxuICAgICAgICB0aGlzLiQgPSBuZXcgeXkuRW1wdHlTdGF0ZW1lbnQoJCRbJDBdKTsgXG4gICAgXG5icmVhaztcbmNhc2UgODogY2FzZSA5OiBjYXNlIDIwOiBjYXNlIDMwOlxuXG4gICAgICAgIHRoaXMuJCA9ICQkWyQwLTFdO1xuICAgIFxuYnJlYWs7XG5jYXNlIDEyOiBjYXNlIDE0OlxuXG4gICAgICAgIHRoaXMuJCA9IG5ldyB5eS5Bc3NpZ25tZW50RXhwcigkJFskMC0xXSwgJCRbJDAtMl0sICQkWyQwXSk7XG4gICAgXG5icmVhaztcbmNhc2UgMTY6XG5cbiAgICAgICAgdGhpcy4kID0gbmV3IHl5Lk9wZXJhdG9yKCQkWyQwXSk7XG4gICAgXG5icmVhaztcbmNhc2UgMTc6IGNhc2UgMTg6XG5cbiAgICAgICAgdGhpcy4kID0gbmV3IHl5LkNhbGxFeHByKCQkWyQwLTFdLCAkJFskMF0pO1xuICAgIFxuYnJlYWs7XG5jYXNlIDE5OlxuXG4gICAgICAgIHRoaXMuJCA9IFtdO1xuICAgIFxuYnJlYWs7XG5jYXNlIDIxOlxuXG4gICAgICAgIHRoaXMuJCA9IFskJFskMF1dO1xuICAgIFxuYnJlYWs7XG5jYXNlIDIyOlxuXG4gICAgICAgIHRoaXMuJCA9ICQkWyQwLTJdLmNvbmNhdCgkJFskMF0pO1xuICAgIFxuYnJlYWs7XG5jYXNlIDI3OlxuXG4gICAgICAgIHRoaXMuJCA9IG5ldyB5eS5JZCgkJFskMF0pO1xuICAgIFxuYnJlYWs7XG5jYXNlIDI4OlxuXG4gICAgICAgIHRoaXMuJCA9IG5ldyB5eS5OdW0oJCRbJDBdKTtcbiAgICBcbmJyZWFrO1xuY2FzZSAyOTpcblxuICAgICAgICB0aGlzLiQgPSBuZXcgeXkuU3RyaW5nKCQkWyQwXSk7XG4gICAgXG5icmVhaztcbmNhc2UgMzI6IGNhc2UgMzM6IGNhc2UgMzU6IGNhc2UgMzY6XG5cbiAgICAgICAgdGhpcy4kID0gbmV3IHl5LkFkZGljdGl2ZUV4cHIobmV3IHl5Lk9wZXJhdG9yKCQkWyQwLTFdKSwgJCRbJDAtMl0sICQkWyQwXSk7XG4gICAgXG5icmVhaztcbmNhc2UgMzg6IGNhc2UgMzk6IGNhc2UgNDE6IGNhc2UgNDI6XG5cbiAgICAgICAgdGhpcy4kID0gbmV3IHl5Lk11bHRpcGxpY2F0aXZlRXhwcihuZXcgeXkuT3BlcmF0b3IoJCRbJDAtMV0pLCAkJFskMC0yXSwgJCRbJDBdKTtcbiAgICBcbmJyZWFrO1xufVxufSxcbnRhYmxlOiBbezM6MSw0OjIsNTozLDY6NCw3OjUsODokVjAsOTokVjEsMTA6OCwxMTo5LDE0OjEwLDE2OjExLDIwOjEzLDIxOjEyLDIzOiRWMiwyNzokVjMsMjg6JFY0LDI5OiRWNSwzMDoxNCwzNDoxOX0sezE6WzNdfSx7MTpbMiwxXSw1OjIwLDY6NCw3OjUsODokVjAsOTokVjEsMTA6OCwxMTo5LDE0OjEwLDE2OjExLDIwOjEzLDIxOjEyLDIzOiRWMiwyNzokVjMsMjg6JFY0LDI5OiRWNSwzMDoxNCwzNDoxOX0sbygkVjYsWzIsMl0pLG8oJFY2LFsyLDRdKSxvKCRWNixbMiw1XSksbygkVjYsWzIsNl0pLG8oJFY2LFsyLDddKSx7ODpbMSwyMV0sOTpbMSwyMl19LG8oJFY3LFsyLDEwXSksbygkVjgsJFY5LHsxNToyMywxOTokVmF9KSxvKCRWNyxbMiwxM10sezMxOlsxLDI1XSwzMjpbMSwyNl19KSxvKCRWYixbMiwyM10sezIyOjI3LDIzOiRWY30pLG8oJFZiLFsyLDI0XSx7MjI6MjksMjM6JFZjfSksbygkVmQsWzIsMzFdLHszNTokVmUsMzY6JFZmfSksbygkVmcsWzIsMjddKSxvKCRWZyxbMiwyOF0pLG8oJFZnLFsyLDI5XSksezEyOjMyLDEzOjMzLDE3OjM0LDE4OjM1LDIwOjM3LDIxOjM2LDIzOiRWMiwyNzokVjMsMjg6JFY0LDI5OiRWNSwzMzozOCwzNzozOX0sbygkVjgsWzIsMzddKSxvKCRWNixbMiwzXSksbygkVjYsWzIsOF0pLG8oJFY2LFsyLDldKSx7MTE6NDAsMTQ6MTAsMTY6MTEsMjA6MTMsMjE6MTIsMjM6JFYyLDI3OiRWMywyODokVjQsMjk6JFY1LDMwOjE0LDM0OjE5fSxvKFsyMywyNywyOCwyOV0sWzIsMTZdKSx7MTQ6NDIsMjA6MTMsMjE6MTIsMjM6JFYyLDI3OiRWMywyODokVjQsMjk6JFY1LDMwOjQxLDM0OjE5fSx7MTQ6NDIsMjA6MTMsMjE6MTIsMjM6JFYyLDI3OiRWMywyODokVjQsMjk6JFY1LDMwOjQzLDM0OjE5fSxvKCRWZyxbMiwxN10pLHsxMzo0NiwxNzozNCwxODozNSwyMDozNywyMTozNiwyMzokVjIsMjQ6WzEsNDRdLDI1OjQ1LDI3OiRWMywyODokVjQsMjk6JFY1LDMzOjM4LDM3OjM5fSxvKCRWZyxbMiwxOF0pLHsxNDo0MiwyMDoxMywyMToxMiwyMzokVjIsMjc6JFYzLDI4OiRWNCwyOTokVjUsMzQ6NDd9LHsxNDo0MiwyMDoxMywyMToxMiwyMzokVjIsMjc6JFYzLDI4OiRWNCwyOTokVjUsMzQ6NDh9LHsyNDpbMSw0OV19LHsyNDpbMiwxMV19LG8oJFZoLCRWaSx7MTU6NTAsMTk6JFZhfSksbygkVmosWzIsMTVdLHszMTpbMSw1MV0sMzI6WzEsNTJdfSksbygkVmssWzIsMjVdLHsyMjoyNywyMzokVmN9KSxvKCRWayxbMiwyNl0sezIyOjI5LDIzOiRWY30pLG8oJFZsLFsyLDM0XSx7MzU6JFZtLDM2OiRWbn0pLG8oJFZoLFsyLDQwXSksbygkVjcsWzIsMTJdKSxvKCRWZCxbMiwzMl0sezM1OiRWZSwzNjokVmZ9KSxvKCRWOCwkVjkpLG8oJFZkLFsyLDMzXSx7MzU6JFZlLDM2OiRWZn0pLG8oJFZnLFsyLDE5XSksezI0OlsxLDU1XSwyNjpbMSw1Nl19LG8oJFZqLFsyLDIxXSksbygkVjgsWzIsMzhdKSxvKCRWOCxbMiwzOV0pLG8oJFZnLFsyLDMwXSksezEzOjU3LDE3OjM0LDE4OjM1LDIwOjM3LDIxOjM2LDIzOiRWMiwyNzokVjMsMjg6JFY0LDI5OiRWNSwzMzozOCwzNzozOX0sezE3OjU5LDIwOjM3LDIxOjM2LDIzOiRWMiwyNzokVjMsMjg6JFY0LDI5OiRWNSwzMzo1OCwzNzozOX0sezE3OjU5LDIwOjM3LDIxOjM2LDIzOiRWMiwyNzokVjMsMjg6JFY0LDI5OiRWNSwzMzo2MCwzNzozOX0sezE3OjU5LDIwOjM3LDIxOjM2LDIzOiRWMiwyNzokVjMsMjg6JFY0LDI5OiRWNSwzNzo2MX0sezE3OjU5LDIwOjM3LDIxOjM2LDIzOiRWMiwyNzokVjMsMjg6JFY0LDI5OiRWNSwzNzo2Mn0sbygkVmcsWzIsMjBdKSx7MTM6NjMsMTc6MzQsMTg6MzUsMjA6MzcsMjE6MzYsMjM6JFYyLDI3OiRWMywyODokVjQsMjk6JFY1LDMzOjM4LDM3OjM5fSxvKCRWaixbMiwxNF0pLG8oJFZsLFsyLDM1XSx7MzU6JFZtLDM2OiRWbn0pLG8oJFZoLCRWaSksbygkVmwsWzIsMzZdLHszNTokVm0sMzY6JFZufSksbygkVmgsWzIsNDFdKSxvKCRWaCxbMiw0Ml0pLG8oJFZqLFsyLDIyXSldLFxuZGVmYXVsdEFjdGlvbnM6IHszMzpbMiwxMV19LFxucGFyc2VFcnJvcjogZnVuY3Rpb24gcGFyc2VFcnJvcihzdHIsIGhhc2gpIHtcbiAgICBpZiAoaGFzaC5yZWNvdmVyYWJsZSkge1xuICAgICAgICB0aGlzLnRyYWNlKHN0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHN0cik7XG4gICAgfVxufSxcbnBhcnNlOiBmdW5jdGlvbiBwYXJzZShpbnB1dCkge1xuICAgIHZhciBzZWxmID0gdGhpcywgc3RhY2sgPSBbMF0sIHRzdGFjayA9IFtdLCB2c3RhY2sgPSBbbnVsbF0sIGxzdGFjayA9IFtdLCB0YWJsZSA9IHRoaXMudGFibGUsIHl5dGV4dCA9ICcnLCB5eWxpbmVubyA9IDAsIHl5bGVuZyA9IDAsIHJlY292ZXJpbmcgPSAwLCBURVJST1IgPSAyLCBFT0YgPSAxO1xuICAgIHZhciBhcmdzID0gbHN0YWNrLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgbGV4ZXIgPSBPYmplY3QuY3JlYXRlKHRoaXMubGV4ZXIpO1xuICAgIHZhciBzaGFyZWRTdGF0ZSA9IHsgeXk6IHt9IH07XG4gICAgZm9yICh2YXIgayBpbiB0aGlzLnl5KSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy55eSwgaykpIHtcbiAgICAgICAgICAgIHNoYXJlZFN0YXRlLnl5W2tdID0gdGhpcy55eVtrXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXhlci5zZXRJbnB1dChpbnB1dCwgc2hhcmVkU3RhdGUueXkpO1xuICAgIHNoYXJlZFN0YXRlLnl5LmxleGVyID0gbGV4ZXI7XG4gICAgc2hhcmVkU3RhdGUueXkucGFyc2VyID0gdGhpcztcbiAgICBpZiAodHlwZW9mIGxleGVyLnl5bGxvYyA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBsZXhlci55eWxsb2MgPSB7fTtcbiAgICB9XG4gICAgdmFyIHl5bG9jID0gbGV4ZXIueXlsbG9jO1xuICAgIGxzdGFjay5wdXNoKHl5bG9jKTtcbiAgICB2YXIgcmFuZ2VzID0gbGV4ZXIub3B0aW9ucyAmJiBsZXhlci5vcHRpb25zLnJhbmdlcztcbiAgICBpZiAodHlwZW9mIHNoYXJlZFN0YXRlLnl5LnBhcnNlRXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5wYXJzZUVycm9yID0gc2hhcmVkU3RhdGUueXkucGFyc2VFcnJvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnBhcnNlRXJyb3IgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcykucGFyc2VFcnJvcjtcbiAgICB9XG4gICAgZnVuY3Rpb24gcG9wU3RhY2sobikge1xuICAgICAgICBzdGFjay5sZW5ndGggPSBzdGFjay5sZW5ndGggLSAyICogbjtcbiAgICAgICAgdnN0YWNrLmxlbmd0aCA9IHZzdGFjay5sZW5ndGggLSBuO1xuICAgICAgICBsc3RhY2subGVuZ3RoID0gbHN0YWNrLmxlbmd0aCAtIG47XG4gICAgfVxuICAgIF90b2tlbl9zdGFjazpcbiAgICAgICAgZnVuY3Rpb24gbGV4KCkge1xuICAgICAgICAgICAgdmFyIHRva2VuO1xuICAgICAgICAgICAgdG9rZW4gPSBsZXhlci5sZXgoKSB8fCBFT0Y7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRva2VuICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHRva2VuID0gc2VsZi5zeW1ib2xzX1t0b2tlbl0gfHwgdG9rZW47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgIH1cbiAgICB2YXIgc3ltYm9sLCBwcmVFcnJvclN5bWJvbCwgc3RhdGUsIGFjdGlvbiwgYSwgciwgeXl2YWwgPSB7fSwgcCwgbGVuLCBuZXdTdGF0ZSwgZXhwZWN0ZWQ7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgc3RhdGUgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgaWYgKHRoaXMuZGVmYXVsdEFjdGlvbnNbc3RhdGVdKSB7XG4gICAgICAgICAgICBhY3Rpb24gPSB0aGlzLmRlZmF1bHRBY3Rpb25zW3N0YXRlXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzeW1ib2wgPT09IG51bGwgfHwgdHlwZW9mIHN5bWJvbCA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHN5bWJvbCA9IGxleCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWN0aW9uID0gdGFibGVbc3RhdGVdICYmIHRhYmxlW3N0YXRlXVtzeW1ib2xdO1xuICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSAndW5kZWZpbmVkJyB8fCAhYWN0aW9uLmxlbmd0aCB8fCAhYWN0aW9uWzBdKSB7XG4gICAgICAgICAgICAgICAgdmFyIGVyclN0ciA9ICcnO1xuICAgICAgICAgICAgICAgIGV4cGVjdGVkID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChwIGluIHRhYmxlW3N0YXRlXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXJtaW5hbHNfW3BdICYmIHAgPiBURVJST1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkLnB1c2goJ1xcJycgKyB0aGlzLnRlcm1pbmFsc19bcF0gKyAnXFwnJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxleGVyLnNob3dQb3NpdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBlcnJTdHIgPSAnUGFyc2UgZXJyb3Igb24gbGluZSAnICsgKHl5bGluZW5vICsgMSkgKyAnOlxcbicgKyBsZXhlci5zaG93UG9zaXRpb24oKSArICdcXG5FeHBlY3RpbmcgJyArIGV4cGVjdGVkLmpvaW4oJywgJykgKyAnLCBnb3QgXFwnJyArICh0aGlzLnRlcm1pbmFsc19bc3ltYm9sXSB8fCBzeW1ib2wpICsgJ1xcJyc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyU3RyID0gJ1BhcnNlIGVycm9yIG9uIGxpbmUgJyArICh5eWxpbmVubyArIDEpICsgJzogVW5leHBlY3RlZCAnICsgKHN5bWJvbCA9PSBFT0YgPyAnZW5kIG9mIGlucHV0JyA6ICdcXCcnICsgKHRoaXMudGVybWluYWxzX1tzeW1ib2xdIHx8IHN5bWJvbCkgKyAnXFwnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VFcnJvcihlcnJTdHIsIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogbGV4ZXIubWF0Y2gsXG4gICAgICAgICAgICAgICAgICAgIHRva2VuOiB0aGlzLnRlcm1pbmFsc19bc3ltYm9sXSB8fCBzeW1ib2wsXG4gICAgICAgICAgICAgICAgICAgIGxpbmU6IGxleGVyLnl5bGluZW5vLFxuICAgICAgICAgICAgICAgICAgICBsb2M6IHl5bG9jLFxuICAgICAgICAgICAgICAgICAgICBleHBlY3RlZDogZXhwZWN0ZWRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgaWYgKGFjdGlvblswXSBpbnN0YW5jZW9mIEFycmF5ICYmIGFjdGlvbi5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcnNlIEVycm9yOiBtdWx0aXBsZSBhY3Rpb25zIHBvc3NpYmxlIGF0IHN0YXRlOiAnICsgc3RhdGUgKyAnLCB0b2tlbjogJyArIHN5bWJvbCk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChhY3Rpb25bMF0pIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgc3RhY2sucHVzaChzeW1ib2wpO1xuICAgICAgICAgICAgdnN0YWNrLnB1c2gobGV4ZXIueXl0ZXh0KTtcbiAgICAgICAgICAgIGxzdGFjay5wdXNoKGxleGVyLnl5bGxvYyk7XG4gICAgICAgICAgICBzdGFjay5wdXNoKGFjdGlvblsxXSk7XG4gICAgICAgICAgICBzeW1ib2wgPSBudWxsO1xuICAgICAgICAgICAgaWYgKCFwcmVFcnJvclN5bWJvbCkge1xuICAgICAgICAgICAgICAgIHl5bGVuZyA9IGxleGVyLnl5bGVuZztcbiAgICAgICAgICAgICAgICB5eXRleHQgPSBsZXhlci55eXRleHQ7XG4gICAgICAgICAgICAgICAgeXlsaW5lbm8gPSBsZXhlci55eWxpbmVubztcbiAgICAgICAgICAgICAgICB5eWxvYyA9IGxleGVyLnl5bGxvYztcbiAgICAgICAgICAgICAgICBpZiAocmVjb3ZlcmluZyA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVjb3ZlcmluZy0tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3ltYm9sID0gcHJlRXJyb3JTeW1ib2w7XG4gICAgICAgICAgICAgICAgcHJlRXJyb3JTeW1ib2wgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGxlbiA9IHRoaXMucHJvZHVjdGlvbnNfW2FjdGlvblsxXV1bMV07XG4gICAgICAgICAgICB5eXZhbC4kID0gdnN0YWNrW3ZzdGFjay5sZW5ndGggLSBsZW5dO1xuICAgICAgICAgICAgeXl2YWwuXyQgPSB7XG4gICAgICAgICAgICAgICAgZmlyc3RfbGluZTogbHN0YWNrW2xzdGFjay5sZW5ndGggLSAobGVuIHx8IDEpXS5maXJzdF9saW5lLFxuICAgICAgICAgICAgICAgIGxhc3RfbGluZTogbHN0YWNrW2xzdGFjay5sZW5ndGggLSAxXS5sYXN0X2xpbmUsXG4gICAgICAgICAgICAgICAgZmlyc3RfY29sdW1uOiBsc3RhY2tbbHN0YWNrLmxlbmd0aCAtIChsZW4gfHwgMSldLmZpcnN0X2NvbHVtbixcbiAgICAgICAgICAgICAgICBsYXN0X2NvbHVtbjogbHN0YWNrW2xzdGFjay5sZW5ndGggLSAxXS5sYXN0X2NvbHVtblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChyYW5nZXMpIHtcbiAgICAgICAgICAgICAgICB5eXZhbC5fJC5yYW5nZSA9IFtcbiAgICAgICAgICAgICAgICAgICAgbHN0YWNrW2xzdGFjay5sZW5ndGggLSAobGVuIHx8IDEpXS5yYW5nZVswXSxcbiAgICAgICAgICAgICAgICAgICAgbHN0YWNrW2xzdGFjay5sZW5ndGggLSAxXS5yYW5nZVsxXVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByID0gdGhpcy5wZXJmb3JtQWN0aW9uLmFwcGx5KHl5dmFsLCBbXG4gICAgICAgICAgICAgICAgeXl0ZXh0LFxuICAgICAgICAgICAgICAgIHl5bGVuZyxcbiAgICAgICAgICAgICAgICB5eWxpbmVubyxcbiAgICAgICAgICAgICAgICBzaGFyZWRTdGF0ZS55eSxcbiAgICAgICAgICAgICAgICBhY3Rpb25bMV0sXG4gICAgICAgICAgICAgICAgdnN0YWNrLFxuICAgICAgICAgICAgICAgIGxzdGFja1xuICAgICAgICAgICAgXS5jb25jYXQoYXJncykpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxlbikge1xuICAgICAgICAgICAgICAgIHN0YWNrID0gc3RhY2suc2xpY2UoMCwgLTEgKiBsZW4gKiAyKTtcbiAgICAgICAgICAgICAgICB2c3RhY2sgPSB2c3RhY2suc2xpY2UoMCwgLTEgKiBsZW4pO1xuICAgICAgICAgICAgICAgIGxzdGFjayA9IGxzdGFjay5zbGljZSgwLCAtMSAqIGxlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFjay5wdXNoKHRoaXMucHJvZHVjdGlvbnNfW2FjdGlvblsxXV1bMF0pO1xuICAgICAgICAgICAgdnN0YWNrLnB1c2goeXl2YWwuJCk7XG4gICAgICAgICAgICBsc3RhY2sucHVzaCh5eXZhbC5fJCk7XG4gICAgICAgICAgICBuZXdTdGF0ZSA9IHRhYmxlW3N0YWNrW3N0YWNrLmxlbmd0aCAtIDJdXVtzdGFja1tzdGFjay5sZW5ndGggLSAxXV07XG4gICAgICAgICAgICBzdGFjay5wdXNoKG5ld1N0YXRlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn19O1xuLyogZ2VuZXJhdGVkIGJ5IGppc29uLWxleCAwLjMuNCAqL1xudmFyIGxleGVyID0gKGZ1bmN0aW9uKCl7XG52YXIgbGV4ZXIgPSAoe1xuXG5FT0Y6MSxcblxucGFyc2VFcnJvcjpmdW5jdGlvbiBwYXJzZUVycm9yKHN0ciwgaGFzaCkge1xuICAgICAgICBpZiAodGhpcy55eS5wYXJzZXIpIHtcbiAgICAgICAgICAgIHRoaXMueXkucGFyc2VyLnBhcnNlRXJyb3Ioc3RyLCBoYXNoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzdHIpO1xuICAgICAgICB9XG4gICAgfSxcblxuLy8gcmVzZXRzIHRoZSBsZXhlciwgc2V0cyBuZXcgaW5wdXRcbnNldElucHV0OmZ1bmN0aW9uIChpbnB1dCwgeXkpIHtcbiAgICAgICAgdGhpcy55eSA9IHl5IHx8IHRoaXMueXkgfHwge307XG4gICAgICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XG4gICAgICAgIHRoaXMuX21vcmUgPSB0aGlzLl9iYWNrdHJhY2sgPSB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy55eWxpbmVubyA9IHRoaXMueXlsZW5nID0gMDtcbiAgICAgICAgdGhpcy55eXRleHQgPSB0aGlzLm1hdGNoZWQgPSB0aGlzLm1hdGNoID0gJyc7XG4gICAgICAgIHRoaXMuY29uZGl0aW9uU3RhY2sgPSBbJ0lOSVRJQUwnXTtcbiAgICAgICAgdGhpcy55eWxsb2MgPSB7XG4gICAgICAgICAgICBmaXJzdF9saW5lOiAxLFxuICAgICAgICAgICAgZmlyc3RfY29sdW1uOiAwLFxuICAgICAgICAgICAgbGFzdF9saW5lOiAxLFxuICAgICAgICAgICAgbGFzdF9jb2x1bW46IDBcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5yYW5nZXMpIHtcbiAgICAgICAgICAgIHRoaXMueXlsbG9jLnJhbmdlID0gWzAsMF07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vZmZzZXQgPSAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4vLyBjb25zdW1lcyBhbmQgcmV0dXJucyBvbmUgY2hhciBmcm9tIHRoZSBpbnB1dFxuaW5wdXQ6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2ggPSB0aGlzLl9pbnB1dFswXTtcbiAgICAgICAgdGhpcy55eXRleHQgKz0gY2g7XG4gICAgICAgIHRoaXMueXlsZW5nKys7XG4gICAgICAgIHRoaXMub2Zmc2V0Kys7XG4gICAgICAgIHRoaXMubWF0Y2ggKz0gY2g7XG4gICAgICAgIHRoaXMubWF0Y2hlZCArPSBjaDtcbiAgICAgICAgdmFyIGxpbmVzID0gY2gubWF0Y2goLyg/Olxcclxcbj98XFxuKS4qL2cpO1xuICAgICAgICBpZiAobGluZXMpIHtcbiAgICAgICAgICAgIHRoaXMueXlsaW5lbm8rKztcbiAgICAgICAgICAgIHRoaXMueXlsbG9jLmxhc3RfbGluZSsrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy55eWxsb2MubGFzdF9jb2x1bW4rKztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJhbmdlcykge1xuICAgICAgICAgICAgdGhpcy55eWxsb2MucmFuZ2VbMV0rKztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2lucHV0ID0gdGhpcy5faW5wdXQuc2xpY2UoMSk7XG4gICAgICAgIHJldHVybiBjaDtcbiAgICB9LFxuXG4vLyB1bnNoaWZ0cyBvbmUgY2hhciAob3IgYSBzdHJpbmcpIGludG8gdGhlIGlucHV0XG51bnB1dDpmdW5jdGlvbiAoY2gpIHtcbiAgICAgICAgdmFyIGxlbiA9IGNoLmxlbmd0aDtcbiAgICAgICAgdmFyIGxpbmVzID0gY2guc3BsaXQoLyg/Olxcclxcbj98XFxuKS9nKTtcblxuICAgICAgICB0aGlzLl9pbnB1dCA9IGNoICsgdGhpcy5faW5wdXQ7XG4gICAgICAgIHRoaXMueXl0ZXh0ID0gdGhpcy55eXRleHQuc3Vic3RyKDAsIHRoaXMueXl0ZXh0Lmxlbmd0aCAtIGxlbik7XG4gICAgICAgIC8vdGhpcy55eWxlbmcgLT0gbGVuO1xuICAgICAgICB0aGlzLm9mZnNldCAtPSBsZW47XG4gICAgICAgIHZhciBvbGRMaW5lcyA9IHRoaXMubWF0Y2guc3BsaXQoLyg/Olxcclxcbj98XFxuKS9nKTtcbiAgICAgICAgdGhpcy5tYXRjaCA9IHRoaXMubWF0Y2guc3Vic3RyKDAsIHRoaXMubWF0Y2gubGVuZ3RoIC0gMSk7XG4gICAgICAgIHRoaXMubWF0Y2hlZCA9IHRoaXMubWF0Y2hlZC5zdWJzdHIoMCwgdGhpcy5tYXRjaGVkLmxlbmd0aCAtIDEpO1xuXG4gICAgICAgIGlmIChsaW5lcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICB0aGlzLnl5bGluZW5vIC09IGxpbmVzLmxlbmd0aCAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHIgPSB0aGlzLnl5bGxvYy5yYW5nZTtcblxuICAgICAgICB0aGlzLnl5bGxvYyA9IHtcbiAgICAgICAgICAgIGZpcnN0X2xpbmU6IHRoaXMueXlsbG9jLmZpcnN0X2xpbmUsXG4gICAgICAgICAgICBsYXN0X2xpbmU6IHRoaXMueXlsaW5lbm8gKyAxLFxuICAgICAgICAgICAgZmlyc3RfY29sdW1uOiB0aGlzLnl5bGxvYy5maXJzdF9jb2x1bW4sXG4gICAgICAgICAgICBsYXN0X2NvbHVtbjogbGluZXMgP1xuICAgICAgICAgICAgICAgIChsaW5lcy5sZW5ndGggPT09IG9sZExpbmVzLmxlbmd0aCA/IHRoaXMueXlsbG9jLmZpcnN0X2NvbHVtbiA6IDApXG4gICAgICAgICAgICAgICAgICsgb2xkTGluZXNbb2xkTGluZXMubGVuZ3RoIC0gbGluZXMubGVuZ3RoXS5sZW5ndGggLSBsaW5lc1swXS5sZW5ndGggOlxuICAgICAgICAgICAgICB0aGlzLnl5bGxvYy5maXJzdF9jb2x1bW4gLSBsZW5cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJhbmdlcykge1xuICAgICAgICAgICAgdGhpcy55eWxsb2MucmFuZ2UgPSBbclswXSwgclswXSArIHRoaXMueXlsZW5nIC0gbGVuXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnl5bGVuZyA9IHRoaXMueXl0ZXh0Lmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuLy8gV2hlbiBjYWxsZWQgZnJvbSBhY3Rpb24sIGNhY2hlcyBtYXRjaGVkIHRleHQgYW5kIGFwcGVuZHMgaXQgb24gbmV4dCBhY3Rpb25cbm1vcmU6ZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9tb3JlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuLy8gV2hlbiBjYWxsZWQgZnJvbSBhY3Rpb24sIHNpZ25hbHMgdGhlIGxleGVyIHRoYXQgdGhpcyBydWxlIGZhaWxzIHRvIG1hdGNoIHRoZSBpbnB1dCwgc28gdGhlIG5leHQgbWF0Y2hpbmcgcnVsZSAocmVnZXgpIHNob3VsZCBiZSB0ZXN0ZWQgaW5zdGVhZC5cbnJlamVjdDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYmFja3RyYWNrX2xleGVyKSB7XG4gICAgICAgICAgICB0aGlzLl9iYWNrdHJhY2sgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VFcnJvcignTGV4aWNhbCBlcnJvciBvbiBsaW5lICcgKyAodGhpcy55eWxpbmVubyArIDEpICsgJy4gWW91IGNhbiBvbmx5IGludm9rZSByZWplY3QoKSBpbiB0aGUgbGV4ZXIgd2hlbiB0aGUgbGV4ZXIgaXMgb2YgdGhlIGJhY2t0cmFja2luZyBwZXJzdWFzaW9uIChvcHRpb25zLmJhY2t0cmFja19sZXhlciA9IHRydWUpLlxcbicgKyB0aGlzLnNob3dQb3NpdGlvbigpLCB7XG4gICAgICAgICAgICAgICAgdGV4dDogXCJcIixcbiAgICAgICAgICAgICAgICB0b2tlbjogbnVsbCxcbiAgICAgICAgICAgICAgICBsaW5lOiB0aGlzLnl5bGluZW5vXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbi8vIHJldGFpbiBmaXJzdCBuIGNoYXJhY3RlcnMgb2YgdGhlIG1hdGNoXG5sZXNzOmZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHRoaXMudW5wdXQodGhpcy5tYXRjaC5zbGljZShuKSk7XG4gICAgfSxcblxuLy8gZGlzcGxheXMgYWxyZWFkeSBtYXRjaGVkIGlucHV0LCBpLmUuIGZvciBlcnJvciBtZXNzYWdlc1xucGFzdElucHV0OmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBhc3QgPSB0aGlzLm1hdGNoZWQuc3Vic3RyKDAsIHRoaXMubWF0Y2hlZC5sZW5ndGggLSB0aGlzLm1hdGNoLmxlbmd0aCk7XG4gICAgICAgIHJldHVybiAocGFzdC5sZW5ndGggPiAyMCA/ICcuLi4nOicnKSArIHBhc3Quc3Vic3RyKC0yMCkucmVwbGFjZSgvXFxuL2csIFwiXCIpO1xuICAgIH0sXG5cbi8vIGRpc3BsYXlzIHVwY29taW5nIGlucHV0LCBpLmUuIGZvciBlcnJvciBtZXNzYWdlc1xudXBjb21pbmdJbnB1dDpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBuZXh0ID0gdGhpcy5tYXRjaDtcbiAgICAgICAgaWYgKG5leHQubGVuZ3RoIDwgMjApIHtcbiAgICAgICAgICAgIG5leHQgKz0gdGhpcy5faW5wdXQuc3Vic3RyKDAsIDIwLW5leHQubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKG5leHQuc3Vic3RyKDAsMjApICsgKG5leHQubGVuZ3RoID4gMjAgPyAnLi4uJyA6ICcnKSkucmVwbGFjZSgvXFxuL2csIFwiXCIpO1xuICAgIH0sXG5cbi8vIGRpc3BsYXlzIHRoZSBjaGFyYWN0ZXIgcG9zaXRpb24gd2hlcmUgdGhlIGxleGluZyBlcnJvciBvY2N1cnJlZCwgaS5lLiBmb3IgZXJyb3IgbWVzc2FnZXNcbnNob3dQb3NpdGlvbjpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwcmUgPSB0aGlzLnBhc3RJbnB1dCgpO1xuICAgICAgICB2YXIgYyA9IG5ldyBBcnJheShwcmUubGVuZ3RoICsgMSkuam9pbihcIi1cIik7XG4gICAgICAgIHJldHVybiBwcmUgKyB0aGlzLnVwY29taW5nSW5wdXQoKSArIFwiXFxuXCIgKyBjICsgXCJeXCI7XG4gICAgfSxcblxuLy8gdGVzdCB0aGUgbGV4ZWQgdG9rZW46IHJldHVybiBGQUxTRSB3aGVuIG5vdCBhIG1hdGNoLCBvdGhlcndpc2UgcmV0dXJuIHRva2VuXG50ZXN0X21hdGNoOmZ1bmN0aW9uIChtYXRjaCwgaW5kZXhlZF9ydWxlKSB7XG4gICAgICAgIHZhciB0b2tlbixcbiAgICAgICAgICAgIGxpbmVzLFxuICAgICAgICAgICAgYmFja3VwO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYmFja3RyYWNrX2xleGVyKSB7XG4gICAgICAgICAgICAvLyBzYXZlIGNvbnRleHRcbiAgICAgICAgICAgIGJhY2t1cCA9IHtcbiAgICAgICAgICAgICAgICB5eWxpbmVubzogdGhpcy55eWxpbmVubyxcbiAgICAgICAgICAgICAgICB5eWxsb2M6IHtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RfbGluZTogdGhpcy55eWxsb2MuZmlyc3RfbGluZSxcbiAgICAgICAgICAgICAgICAgICAgbGFzdF9saW5lOiB0aGlzLmxhc3RfbGluZSxcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RfY29sdW1uOiB0aGlzLnl5bGxvYy5maXJzdF9jb2x1bW4sXG4gICAgICAgICAgICAgICAgICAgIGxhc3RfY29sdW1uOiB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeXl0ZXh0OiB0aGlzLnl5dGV4dCxcbiAgICAgICAgICAgICAgICBtYXRjaDogdGhpcy5tYXRjaCxcbiAgICAgICAgICAgICAgICBtYXRjaGVzOiB0aGlzLm1hdGNoZXMsXG4gICAgICAgICAgICAgICAgbWF0Y2hlZDogdGhpcy5tYXRjaGVkLFxuICAgICAgICAgICAgICAgIHl5bGVuZzogdGhpcy55eWxlbmcsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLm9mZnNldCxcbiAgICAgICAgICAgICAgICBfbW9yZTogdGhpcy5fbW9yZSxcbiAgICAgICAgICAgICAgICBfaW5wdXQ6IHRoaXMuX2lucHV0LFxuICAgICAgICAgICAgICAgIHl5OiB0aGlzLnl5LFxuICAgICAgICAgICAgICAgIGNvbmRpdGlvblN0YWNrOiB0aGlzLmNvbmRpdGlvblN0YWNrLnNsaWNlKDApLFxuICAgICAgICAgICAgICAgIGRvbmU6IHRoaXMuZG9uZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucmFuZ2VzKSB7XG4gICAgICAgICAgICAgICAgYmFja3VwLnl5bGxvYy5yYW5nZSA9IHRoaXMueXlsbG9jLnJhbmdlLnNsaWNlKDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGluZXMgPSBtYXRjaFswXS5tYXRjaCgvKD86XFxyXFxuP3xcXG4pLiovZyk7XG4gICAgICAgIGlmIChsaW5lcykge1xuICAgICAgICAgICAgdGhpcy55eWxpbmVubyArPSBsaW5lcy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy55eWxsb2MgPSB7XG4gICAgICAgICAgICBmaXJzdF9saW5lOiB0aGlzLnl5bGxvYy5sYXN0X2xpbmUsXG4gICAgICAgICAgICBsYXN0X2xpbmU6IHRoaXMueXlsaW5lbm8gKyAxLFxuICAgICAgICAgICAgZmlyc3RfY29sdW1uOiB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbixcbiAgICAgICAgICAgIGxhc3RfY29sdW1uOiBsaW5lcyA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgbGluZXNbbGluZXMubGVuZ3RoIC0gMV0ubGVuZ3RoIC0gbGluZXNbbGluZXMubGVuZ3RoIC0gMV0ubWF0Y2goL1xccj9cXG4/LylbMF0ubGVuZ3RoIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbiArIG1hdGNoWzBdLmxlbmd0aFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnl5dGV4dCArPSBtYXRjaFswXTtcbiAgICAgICAgdGhpcy5tYXRjaCArPSBtYXRjaFswXTtcbiAgICAgICAgdGhpcy5tYXRjaGVzID0gbWF0Y2g7XG4gICAgICAgIHRoaXMueXlsZW5nID0gdGhpcy55eXRleHQubGVuZ3RoO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnJhbmdlcykge1xuICAgICAgICAgICAgdGhpcy55eWxsb2MucmFuZ2UgPSBbdGhpcy5vZmZzZXQsIHRoaXMub2Zmc2V0ICs9IHRoaXMueXlsZW5nXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tb3JlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2JhY2t0cmFjayA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pbnB1dCA9IHRoaXMuX2lucHV0LnNsaWNlKG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgIHRoaXMubWF0Y2hlZCArPSBtYXRjaFswXTtcbiAgICAgICAgdG9rZW4gPSB0aGlzLnBlcmZvcm1BY3Rpb24uY2FsbCh0aGlzLCB0aGlzLnl5LCB0aGlzLCBpbmRleGVkX3J1bGUsIHRoaXMuY29uZGl0aW9uU3RhY2tbdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGggLSAxXSk7XG4gICAgICAgIGlmICh0aGlzLmRvbmUgJiYgdGhpcy5faW5wdXQpIHtcbiAgICAgICAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JhY2t0cmFjaykge1xuICAgICAgICAgICAgLy8gcmVjb3ZlciBjb250ZXh0XG4gICAgICAgICAgICBmb3IgKHZhciBrIGluIGJhY2t1cCkge1xuICAgICAgICAgICAgICAgIHRoaXNba10gPSBiYWNrdXBba107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIHJ1bGUgYWN0aW9uIGNhbGxlZCByZWplY3QoKSBpbXBseWluZyB0aGUgbmV4dCBydWxlIHNob3VsZCBiZSB0ZXN0ZWQgaW5zdGVhZC5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuLy8gcmV0dXJuIG5leHQgbWF0Y2ggaW4gaW5wdXRcbm5leHQ6ZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5FT0Y7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9pbnB1dCkge1xuICAgICAgICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0b2tlbixcbiAgICAgICAgICAgIG1hdGNoLFxuICAgICAgICAgICAgdGVtcE1hdGNoLFxuICAgICAgICAgICAgaW5kZXg7XG4gICAgICAgIGlmICghdGhpcy5fbW9yZSkge1xuICAgICAgICAgICAgdGhpcy55eXRleHQgPSAnJztcbiAgICAgICAgICAgIHRoaXMubWF0Y2ggPSAnJztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcnVsZXMgPSB0aGlzLl9jdXJyZW50UnVsZXMoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBydWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGVtcE1hdGNoID0gdGhpcy5faW5wdXQubWF0Y2godGhpcy5ydWxlc1tydWxlc1tpXV0pO1xuICAgICAgICAgICAgaWYgKHRlbXBNYXRjaCAmJiAoIW1hdGNoIHx8IHRlbXBNYXRjaFswXS5sZW5ndGggPiBtYXRjaFswXS5sZW5ndGgpKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2ggPSB0ZW1wTWF0Y2g7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYmFja3RyYWNrX2xleGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy50ZXN0X21hdGNoKHRlbXBNYXRjaCwgcnVsZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4gIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYmFja3RyYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7IC8vIHJ1bGUgYWN0aW9uIGNhbGxlZCByZWplY3QoKSBpbXBseWluZyBhIHJ1bGUgTUlTbWF0Y2guXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbHNlOiB0aGlzIGlzIGEgbGV4ZXIgcnVsZSB3aGljaCBjb25zdW1lcyBpbnB1dCB3aXRob3V0IHByb2R1Y2luZyBhIHRva2VuIChlLmcuIHdoaXRlc3BhY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLm9wdGlvbnMuZmxleCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRoaXMudGVzdF9tYXRjaChtYXRjaCwgcnVsZXNbaW5kZXhdKTtcbiAgICAgICAgICAgIGlmICh0b2tlbiAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlbHNlOiB0aGlzIGlzIGEgbGV4ZXIgcnVsZSB3aGljaCBjb25zdW1lcyBpbnB1dCB3aXRob3V0IHByb2R1Y2luZyBhIHRva2VuIChlLmcuIHdoaXRlc3BhY2UpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2lucHV0ID09PSBcIlwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5FT0Y7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUVycm9yKCdMZXhpY2FsIGVycm9yIG9uIGxpbmUgJyArICh0aGlzLnl5bGluZW5vICsgMSkgKyAnLiBVbnJlY29nbml6ZWQgdGV4dC5cXG4nICsgdGhpcy5zaG93UG9zaXRpb24oKSwge1xuICAgICAgICAgICAgICAgIHRleHQ6IFwiXCIsXG4gICAgICAgICAgICAgICAgdG9rZW46IG51bGwsXG4gICAgICAgICAgICAgICAgbGluZTogdGhpcy55eWxpbmVub1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4vLyByZXR1cm4gbmV4dCBtYXRjaCB0aGF0IGhhcyBhIHRva2VuXG5sZXg6ZnVuY3Rpb24gbGV4KCkge1xuICAgICAgICB2YXIgciA9IHRoaXMubmV4dCgpO1xuICAgICAgICBpZiAocikge1xuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZXgoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbi8vIGFjdGl2YXRlcyBhIG5ldyBsZXhlciBjb25kaXRpb24gc3RhdGUgKHB1c2hlcyB0aGUgbmV3IGxleGVyIGNvbmRpdGlvbiBzdGF0ZSBvbnRvIHRoZSBjb25kaXRpb24gc3RhY2spXG5iZWdpbjpmdW5jdGlvbiBiZWdpbihjb25kaXRpb24pIHtcbiAgICAgICAgdGhpcy5jb25kaXRpb25TdGFjay5wdXNoKGNvbmRpdGlvbik7XG4gICAgfSxcblxuLy8gcG9wIHRoZSBwcmV2aW91c2x5IGFjdGl2ZSBsZXhlciBjb25kaXRpb24gc3RhdGUgb2ZmIHRoZSBjb25kaXRpb24gc3RhY2tcbnBvcFN0YXRlOmZ1bmN0aW9uIHBvcFN0YXRlKCkge1xuICAgICAgICB2YXIgbiA9IHRoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoIC0gMTtcbiAgICAgICAgaWYgKG4gPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25TdGFjay5wb3AoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvblN0YWNrWzBdO1xuICAgICAgICB9XG4gICAgfSxcblxuLy8gcHJvZHVjZSB0aGUgbGV4ZXIgcnVsZSBzZXQgd2hpY2ggaXMgYWN0aXZlIGZvciB0aGUgY3VycmVudGx5IGFjdGl2ZSBsZXhlciBjb25kaXRpb24gc3RhdGVcbl9jdXJyZW50UnVsZXM6ZnVuY3Rpb24gX2N1cnJlbnRSdWxlcygpIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoICYmIHRoaXMuY29uZGl0aW9uU3RhY2tbdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uc1t0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoIC0gMV1dLnJ1bGVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uc1tcIklOSVRJQUxcIl0ucnVsZXM7XG4gICAgICAgIH1cbiAgICB9LFxuXG4vLyByZXR1cm4gdGhlIGN1cnJlbnRseSBhY3RpdmUgbGV4ZXIgY29uZGl0aW9uIHN0YXRlOyB3aGVuIGFuIGluZGV4IGFyZ3VtZW50IGlzIHByb3ZpZGVkIGl0IHByb2R1Y2VzIHRoZSBOLXRoIHByZXZpb3VzIGNvbmRpdGlvbiBzdGF0ZSwgaWYgYXZhaWxhYmxlXG50b3BTdGF0ZTpmdW5jdGlvbiB0b3BTdGF0ZShuKSB7XG4gICAgICAgIG4gPSB0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aCAtIDEgLSBNYXRoLmFicyhuIHx8IDApO1xuICAgICAgICBpZiAobiA+PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25TdGFja1tuXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBcIklOSVRJQUxcIjtcbiAgICAgICAgfVxuICAgIH0sXG5cbi8vIGFsaWFzIGZvciBiZWdpbihjb25kaXRpb24pXG5wdXNoU3RhdGU6ZnVuY3Rpb24gcHVzaFN0YXRlKGNvbmRpdGlvbikge1xuICAgICAgICB0aGlzLmJlZ2luKGNvbmRpdGlvbik7XG4gICAgfSxcblxuLy8gcmV0dXJuIHRoZSBudW1iZXIgb2Ygc3RhdGVzIGN1cnJlbnRseSBvbiB0aGUgc3RhY2tcbnN0YXRlU3RhY2tTaXplOmZ1bmN0aW9uIHN0YXRlU3RhY2tTaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGg7XG4gICAgfSxcbm9wdGlvbnM6IHt9LFxucGVyZm9ybUFjdGlvbjogZnVuY3Rpb24gYW5vbnltb3VzKHl5LHl5XywkYXZvaWRpbmdfbmFtZV9jb2xsaXNpb25zLFlZX1NUQVJUKSB7XG52YXIgWVlTVEFURT1ZWV9TVEFSVDtcbnN3aXRjaCgkYXZvaWRpbmdfbmFtZV9jb2xsaXNpb25zKSB7XG5jYXNlIDA6cmV0dXJuIDI4XG5icmVhaztcbmNhc2UgMTpyZXR1cm4gMjlcbmJyZWFrO1xuY2FzZSAyOnJldHVybiAyN1xuYnJlYWs7XG5jYXNlIDM6cmV0dXJuICAnPSdcbmJyZWFrO1xuY2FzZSA0OnJldHVybiAgJygnXG5icmVhaztcbmNhc2UgNTpyZXR1cm4gICcpJ1xuYnJlYWs7XG5jYXNlIDY6cmV0dXJuICAnLCdcbmJyZWFrO1xuY2FzZSA3OnJldHVybiAgJysnXG5icmVhaztcbmNhc2UgODpyZXR1cm4gICctJ1xuYnJlYWs7XG5jYXNlIDk6cmV0dXJuICAnKidcbmJyZWFrO1xuY2FzZSAxMDpyZXR1cm4gICcvJ1xuYnJlYWs7XG5jYXNlIDExOnJldHVybiAgJzsnXG5icmVhaztcbmNhc2UgMTI6cmV0dXJuIDlcbmJyZWFrO1xuY2FzZSAxMzpyZXR1cm4gICcnXG5icmVhaztcbn1cbn0sXG5ydWxlczogWy9eKD86WzAtOV0rKFxcLlswLTldKyk/XFxiKS8sL14oPzpcIlteXCJcXG5dKltcIlxcbl18J1teJ1xcbl0qWydcXG5dKS8sL14oPzpbYS16QS1aXyRdW2EtekEtWl8wLTkkXSopLywvXig/Oj0pLywvXig/OlxcKCkvLC9eKD86XFwpKS8sL14oPzosKS8sL14oPzpcXCspLywvXig/Oi0pLywvXig/OlxcKikvLC9eKD86XFwvKS8sL14oPzo7KS8sL14oPzpbXFxuXSspLywvXig/OlsgXFx0XFxuXSspL10sXG5jb25kaXRpb25zOiB7XCJJTklUSUFMXCI6e1wicnVsZXNcIjpbMCwxLDIsMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxM10sXCJpbmNsdXNpdmVcIjp0cnVlfX1cbn0pO1xucmV0dXJuIGxleGVyO1xufSkoKTtcbnBhcnNlci5sZXhlciA9IGxleGVyO1xuZnVuY3Rpb24gUGFyc2VyICgpIHtcbiAgdGhpcy55eSA9IHt9O1xufVxuUGFyc2VyLnByb3RvdHlwZSA9IHBhcnNlcjtwYXJzZXIuUGFyc2VyID0gUGFyc2VyO1xucmV0dXJuIG5ldyBQYXJzZXI7XG59KSgpO1xuXG5cbmlmICh0eXBlb2YgcmVxdWlyZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG5leHBvcnRzLnBhcnNlciA9IHBhcnNlcjtcbmV4cG9ydHMuUGFyc2VyID0gcGFyc2VyLlBhcnNlcjtcbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBwYXJzZXIucGFyc2UuYXBwbHkocGFyc2VyLCBhcmd1bWVudHMpOyB9O1xuZXhwb3J0cy5tYWluID0gZnVuY3Rpb24gY29tbW9uanNNYWluKGFyZ3MpIHtcbiAgICBpZiAoIWFyZ3NbMV0pIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1VzYWdlOiAnK2FyZ3NbMF0rJyBGSUxFJyk7XG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICB9XG4gICAgdmFyIHNvdXJjZSA9IHJlcXVpcmUoJ2ZzJykucmVhZEZpbGVTeW5jKHJlcXVpcmUoJ3BhdGgnKS5ub3JtYWxpemUoYXJnc1sxXSksIFwidXRmOFwiKTtcbiAgICByZXR1cm4gZXhwb3J0cy5wYXJzZXIucGFyc2Uoc291cmNlKTtcbn07XG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgcmVxdWlyZS5tYWluID09PSBtb2R1bGUpIHtcbiAgZXhwb3J0cy5tYWluKHByb2Nlc3MuYXJndi5zbGljZSgxKSk7XG59XG59O21vZHVsZS5leHBvcnRzID0gcGFyc2VyOyJdfQ==
