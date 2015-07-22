(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
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
},{"_process":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"../utils":12,"./ast.js":5,"./parser.js":8}],7:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.Compiler = Compiler;
exports.compile = compile;

var _utils = require('../utils');

function Compiler() {}

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
    var ast = env.parse(input, options);
    var compiler = new env.Compiler();

    compiler.operators = env.operators;
    compiler.variables = env.variables;

    compiler.compile(ast);
}

},{"../utils":12}],8:[function(require,module,exports){
module.exports = require('../../src/rule.js');

},{"../../src/rule.js":13}],9:[function(require,module,exports){
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

},{"./compiler/ast":5,"./compiler/base":6,"./compiler/compiler":7,"./jellymarker.runtime":10,"./utils":12}],10:[function(require,module,exports){
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

},{"./base":4}],11:[function(require,module,exports){
/*let s = 'A = B = 100.0\n'+
'A = 100*2\n'+
'A = CLOSE\n'+
'A = CLOSE + OPEN\n'+
'C = (CLOSE+OPEN)\n'+
'D = MACD(CLOSE, 100)\n'+
'E = (MACD(MA(CLOSE, 100)) + (B)) * 100 + C\n';*/

var s = 'A = (CLOSE + OPEN)/2\n' + 'B = (CLOSE - OPEN) / 2\n' + 'C = MA(OPEN+CLOSE)\n';

module.exports = s;

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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
}module.exports = parser;

}).call(this,require('_process'))
},{"_process":3,"fs":1,"path":2}],14:[function(require,module,exports){
var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _testJs = require('./test.js');

var _testJs2 = _interopRequireDefault(_testJs);

var _jellymarker = require('./jellymarker');

var _jellymarker2 = _interopRequireDefault(_jellymarker);

var jellymarker = _jellymarker2['default'].create();
var jellymarker2 = _jellymarker2['default'].create();

var isNumber = function isNumber(n) {
    return typeof n === 'number';
};

var DDVector = (function () {
    function DDVector(items) {
        _classCallCheck(this, DDVector);

        this.items = items;
    }

    _createClass(DDVector, null, [{
        key: 'opVector',
        value: function opVector(v1, v2, fn) {
            var ret = [];
            var nv1 = [];
            var nv2 = [];
            var i = 0;
            DDVector.normalize(v1.items, v2.items, nv1, nv2);

            for (i = 0; i < nv1.length; i++) {
                ret.push({
                    date: nv1[i].date,
                    value: fn(nv1[i].value, nv2[i].value)
                });
            }

            return new DDVector(ret);
        }
    }, {
        key: 'opScalar',
        value: function opScalar(v1, v2, fn) {
            var ret = [];

            for (var i = 0; i < v1.items.length; i++) {
                ret.push({
                    date: v1.items[i].date,
                    value: fn(v1.items[i].value, v2)
                });
            }
            return new DDVector(ret);
        }
    }, {
        key: 'normalize',
        value: function normalize(v1, v2, refNv1, refNv2) {
            var nv1 = refNv1;
            var nv2 = refNv2;
            var i = 0;
            var j = 0;

            while (i < v1.length && j < v2.length && v1[i].date < v2[j].date) {
                nv1.push(v1[i]);
                nv2.push({
                    date: v1[i].date,
                    value: 0
                });

                i++;
            }

            while (i < v1.length && j < v2.length && v1[i].date > v2[j].date) {
                nv1.push({
                    date: v2[j].date,
                    value: 0
                });
                nv2.push(v2[j]);

                j++;
            }

            while (i < v1.length && j < v2.length && v1[i].date === v2[j].date) {
                nv1.push(v1[i]);
                nv2.push(v2[j]);
                i++;
                j++;
            }

            while (i < v1.length) {
                nv1.push(v1[i]);
                nv2.push({
                    date: v1[i].date,
                    value: 0
                });
                i++;
            }

            while (j < v2.length) {
                nv1.push({
                    date: v2[j].date,
                    value: 0
                });
                nv2.push(v2[j]);
                j++;
            }
        }
    }]);

    return DDVector;
})();

var v1 = new DDVector([{
    date: '20150710',
    value: 100
}, {
    date: '20150711',
    value: 101
}, {
    date: '20150712',
    value: 102
}, {
    date: '20150713',
    value: 103
}]);

var v2 = new DDVector([{
    date: '20150711',
    value: 101
}, {
    date: '20150712',
    value: 102
}]);

var add = function add(v1, v2) {
    return v1 + v2;
};
var sub = function sub(v1, v2) {
    return v1 - v2;
};
var mul = function mul(v1, v2) {
    return v1 * v2;
};
var div = function div(v1, v2) {
    return v1 / v2;
};

jellymarker.registerOperators('+', function (operand1, operand2) {

    if (isNumber(operand1) && isNumber(operand2)) {
        return operand1 + operand2;
    }

    if (isNumber(operand1)) {
        return DDVector.opScalar(operand2, operand1, add);
    } else if (isNumber(operand2)) {
        return DDVector.opScalar(operand1, operand2, add);
    } else {
        return DDVector.opVector(operand1, operand2, add);
    }
});

jellymarker.registerOperators('-', function (operand1, operand2) {
    if (isNumber(operand1) && isNumber(operand2)) {
        return operand1 - operand2;
    }
    if (isNumber(operand1)) {
        return DDVector.opScalar(operand2, operand1, sub);
    } else if (isNumber(operand2)) {
        return DDVector.opScalar(operand1, operand2, sub);
    } else {
        return DDVector.opVector(operand1, operand2, sub);
    }
});

jellymarker.registerOperators('*', function (operand1, operand2) {
    if (isNumber(operand1) && isNumber(operand2)) {
        return operand1 * operand2;
    }
    if (isNumber(operand1)) {
        return DDVector.opScalar(operand2, operand1, mul);
    } else if (isNumber(operand2)) {
        return DDVector.opScalar(operand1, operand2, mul);
    } else {
        return DDVector.opVector(operand1, operand2, mul);
    }
});

jellymarker.registerOperators('/', function (operand1, operand2) {
    if (isNumber(operand1) && isNumber(operand2)) {
        return operand1 / operand2;
    }
    if (isNumber(operand1)) {
        return DDVector.opScalar(operand2, operand1, div);
    } else if (isNumber(operand2)) {
        return DDVector.opScalar(operand1, operand2, div);
    } else {
        return DDVector.opVector(operand1, operand2, div);
    }
});

jellymarker.registerVariables('MA', function (v) {
    return this.operators['/'](v, 2);
});

jellymarker.registerVariables('OPEN', v1);

jellymarker.registerVariables('CLOSE', v2);

jellymarker.compile(_testJs2['default'], {}, jellymarker);

jellymarker2.compile('A=100;', {});

},{"./jellymarker":9,"./test.js":11}]},{},[14]);
