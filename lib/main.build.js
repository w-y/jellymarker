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
Object.defineProperty(exports, '__esModule', {
    value: true
});
var AST = {
    Program: function Program(statements) {
        this.type = 'Program';
        this.statements = statements;
    },
    Statement: function Statement() {
        this.type = 'Statement';
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
    AssignmentExpr: function AssignmentExpr(operator, oprand1, oprand2) {
        this.type = 'AssignmentExpr';
        this.operator = operator;
        this.oprand1 = oprand1;
        this.oprand2 = oprand2;
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
    AddictiveExpr: function AddictiveExpr(operator, oprand1, oprand2) {
        this.type = 'AddictiveExpr';
        this.operator = operator;
        this.oprand1 = oprand1;
        this.oprand2 = oprand2;
    },
    CallExpr: function CallExpr(fn, args) {
        this.type = 'CallExprNoBF';
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
    MultiplicativeExpr: function MultiplicativeExpr(operator, oprand1, oprand2) {
        this.type = 'MultiplicativeExpr';

        this.operator = operator;
        this.oprand1 = oprand1;
        this.oprand2 = oprand2;
    },
    UnaryExprNoBF: function UnaryExprNoBF() {
        this.type = 'UnaryExprNoBF';
    },
    Num: function Num(value) {
        this.type = 'Number';
        this.value = value;
    },
    Id: function Id(identifier) {
        this.type = 'Id';
        this.identifier = identifier;
    }
};

exports['default'] = AST;
module.exports = exports['default'];

},{}],5:[function(require,module,exports){
Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.parse = parse;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _parserJs = require('./parser.js');

var _parserJs2 = _interopRequireDefault(_parserJs);

var _ast = require('./ast');

var _ast2 = _interopRequireDefault(_ast);

var _utils = require('../utils');

exports.parser = _parserJs2['default'];

var yy = {};
(0, _utils.extend)(yy, _ast2['default']);

function parse(input) {
    _parserJs2['default'].yy = yy;

    return _parserJs2['default'].parse(input);
}

},{"../utils":8,"./ast":4,"./parser.js":6}],6:[function(require,module,exports){
module.exports = require('../../src/rule.js');

},{"../../src/rule.js":9}],7:[function(require,module,exports){
s = 'A = B = 100.0\n' + 'A = 100\n' + 'A = CLOSE\n' + 'A = CLOSE + OPEN\n' + 'C = (CLOSE+OPEN)\n' + 'D = MACD(CLOSE, 100)\n' + 'E = (MACD(MA(CLOSE, 100)) + (B)) * 100 + C\n';

module.exports = s;

},{}],8:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extend = extend;

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

},{}],9:[function(require,module,exports){
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
        $V2 = [1, 17],
        $V3 = [1, 15],
        $V4 = [1, 16],
        $V5 = [1, 8, 9, 23, 27, 28],
        $V6 = [8, 9],
        $V7 = [8, 9, 30, 31, 34, 35],
        $V8 = [2, 42],
        $V9 = [1, 23],
        $Va = [8, 9, 19, 30, 31, 34, 35],
        $Vb = [1, 27],
        $Vc = [8, 9, 30, 31],
        $Vd = [1, 29],
        $Ve = [1, 30],
        $Vf = [8, 9, 19, 23, 24, 26, 30, 31, 34, 35],
        $Vg = [24, 26, 30, 31, 34, 35],
        $Vh = [2, 43],
        $Vi = [24, 26],
        $Vj = [19, 24, 26, 30, 31, 34, 35],
        $Vk = [24, 26, 30, 31],
        $Vl = [1, 52],
        $Vm = [1, 53];
    var parser = { trace: function trace() {},
        yy: {},
        symbols_: { "error": 2, "Program": 3, "SourceElements": 4, "Statement": 5, "EmptyStatement": 6, "ExprStatement": 7, ";": 8, "NEWLINE": 9, "ExprNoBF": 10, "AssignmentExprNoBF": 11, "Expr": 12, "AssignmentExpr": 13, "LeftHandSideExprNoBF": 14, "AssignmentOperator": 15, "AddictiveExprNoBF": 16, "LeftHandSideExpr": 17, "AddictiveExpr": 18, "=": 19, "CallExprNoBF": 20, "PrimaryExprNoBrace": 21, "Arguments": 22, "(": 23, ")": 24, "ArgumentList": 25, ",": 26, "IDENT": 27, "NUMBER": 28, "MultiplicativeExprNoBF": 29, "+": 30, "-": 31, "MultiplicativeExpr": 32, "UnaryExprNoBF": 33, "*": 34, "/": 35, "UnaryExpr": 36, "$accept": 0, "$end": 1 },
        terminals_: { 2: "error", 8: ";", 9: "NEWLINE", 19: "=", 23: "(", 24: ")", 26: ",", 27: "IDENT", 28: "NUMBER", 30: "+", 31: "-", 34: "*", 35: "/" },
        productions_: [0, [3, 1], [4, 1], [4, 2], [5, 1], [5, 1], [6, 1], [6, 1], [7, 2], [7, 2], [10, 1], [12, 1], [11, 3], [11, 1], [13, 3], [13, 1], [15, 1], [20, 2], [20, 2], [22, 2], [22, 3], [25, 1], [25, 3], [14, 1], [14, 1], [17, 1], [17, 1], [21, 1], [21, 1], [21, 3], [16, 1], [16, 3], [16, 3], [18, 1], [18, 3], [18, 3], [29, 1], [29, 3], [29, 3], [32, 1], [32, 3], [32, 3], [33, 1], [36, 1]],
        performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, /* action[1] */$$, /* vstack */_$ /* lstack */) {
            /* this == yyval */

            var $0 = $$.length - 1;
            switch (yystate) {
                case 1:

                    this.$ = $$[$0];
                    console.log(this.$);

                    break;
                case 2:

                    this.$ = new yy.Program([new yy.Statement($$[$0])]);

                    break;
                case 3:

                    $$[$0 - 1].statements.push(new yy.Statement($$[$0]));
                    this.$ = $$[$0 - 1];

                    break;
                case 4:case 5:case 10:case 11:case 13:case 15:case 16:case 23:case 24:case 25:case 26:case 30:case 33:case 36:case 39:case 42:case 43:

                    this.$ = $$[$0];

                    break;
                case 8:case 9:case 20:case 29:

                    this.$ = $$[$0 - 1];

                    break;
                case 12:case 14:

                    this.$ = new yy.AssignmentExpr($$[$0 - 1], $$[$0 - 2], $$[$0]);

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
                case 31:case 32:case 34:case 35:

                    this.$ = new yy.AddictiveExpr($$[$0 - 1], $$[$0 - 2], $$[$0]);

                    break;
                case 37:case 38:case 40:case 41:

                    this.$ = new yy.MultiplicativeExpr($$[$0 - 1], $$[$0 - 2], $$[$0]);

                    break;
            }
        },
        table: [{ 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 8: $V0, 9: $V1, 10: 8, 11: 9, 14: 10, 16: 11, 20: 13, 21: 12, 23: $V2, 27: $V3, 28: $V4, 29: 14, 33: 18 }, { 1: [3] }, { 1: [2, 1], 5: 19, 6: 4, 7: 5, 8: $V0, 9: $V1, 10: 8, 11: 9, 14: 10, 16: 11, 20: 13, 21: 12, 23: $V2, 27: $V3, 28: $V4, 29: 14, 33: 18 }, o($V5, [2, 2]), o($V5, [2, 4]), o($V5, [2, 5]), o($V5, [2, 6]), o($V5, [2, 7]), { 8: [1, 20], 9: [1, 21] }, o($V6, [2, 10]), o($V7, $V8, { 15: 22, 19: $V9 }), o($V6, [2, 13], { 30: [1, 24], 31: [1, 25] }), o($Va, [2, 23], { 22: 26, 23: $Vb }), o($Va, [2, 24], { 22: 28, 23: $Vb }), o($Vc, [2, 30], { 34: $Vd, 35: $Ve }), o($Vf, [2, 27]), o($Vf, [2, 28]), { 12: 31, 13: 32, 17: 33, 18: 34, 20: 36, 21: 35, 23: $V2, 27: $V3, 28: $V4, 32: 37, 36: 38 }, o($V7, [2, 36]), o($V5, [2, 3]), o($V5, [2, 8]), o($V5, [2, 9]), { 11: 39, 14: 10, 16: 11, 20: 13, 21: 12, 23: $V2, 27: $V3, 28: $V4, 29: 14, 33: 18 }, o([23, 27, 28], [2, 16]), { 14: 41, 20: 13, 21: 12, 23: $V2, 27: $V3, 28: $V4, 29: 40, 33: 18 }, { 14: 41, 20: 13, 21: 12, 23: $V2, 27: $V3, 28: $V4, 29: 42, 33: 18 }, o($Vf, [2, 17]), { 13: 45, 17: 33, 18: 34, 20: 36, 21: 35, 23: $V2, 24: [1, 43], 25: 44, 27: $V3, 28: $V4, 32: 37, 36: 38 }, o($Vf, [2, 18]), { 14: 41, 20: 13, 21: 12, 23: $V2, 27: $V3, 28: $V4, 33: 46 }, { 14: 41, 20: 13, 21: 12, 23: $V2, 27: $V3, 28: $V4, 33: 47 }, { 24: [1, 48] }, { 24: [2, 11] }, o($Vg, $Vh, { 15: 49, 19: $V9 }), o($Vi, [2, 15], { 30: [1, 50], 31: [1, 51] }), o($Vj, [2, 25], { 22: 26, 23: $Vb }), o($Vj, [2, 26], { 22: 28, 23: $Vb }), o($Vk, [2, 33], { 34: $Vl, 35: $Vm }), o($Vg, [2, 39]), o($V6, [2, 12]), o($Vc, [2, 31], { 34: $Vd, 35: $Ve }), o($V7, $V8), o($Vc, [2, 32], { 34: $Vd, 35: $Ve }), o($Vf, [2, 19]), { 24: [1, 54], 26: [1, 55] }, o($Vi, [2, 21]), o($V7, [2, 37]), o($V7, [2, 38]), o($Vf, [2, 29]), { 13: 56, 17: 33, 18: 34, 20: 36, 21: 35, 23: $V2, 27: $V3, 28: $V4, 32: 37, 36: 38 }, { 17: 58, 20: 36, 21: 35, 23: $V2, 27: $V3, 28: $V4, 32: 57, 36: 38 }, { 17: 58, 20: 36, 21: 35, 23: $V2, 27: $V3, 28: $V4, 32: 59, 36: 38 }, { 17: 58, 20: 36, 21: 35, 23: $V2, 27: $V3, 28: $V4, 36: 60 }, { 17: 58, 20: 36, 21: 35, 23: $V2, 27: $V3, 28: $V4, 36: 61 }, o($Vf, [2, 20]), { 13: 62, 17: 33, 18: 34, 20: 36, 21: 35, 23: $V2, 27: $V3, 28: $V4, 32: 37, 36: 38 }, o($Vi, [2, 14]), o($Vk, [2, 34], { 34: $Vl, 35: $Vm }), o($Vg, $Vh), o($Vk, [2, 35], { 34: $Vl, 35: $Vm }), o($Vg, [2, 40]), o($Vg, [2, 41]), o($Vi, [2, 22])],
        defaultActions: { 32: [2, 11] },
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
                        return 27;
                        break;
                    case 2:
                        return "=";
                        break;
                    case 3:
                        return "(";
                        break;
                    case 4:
                        return ")";
                        break;
                    case 5:
                        return ",";
                        break;
                    case 6:
                        return "+";
                        break;
                    case 7:
                        return "-";
                        break;
                    case 8:
                        return "*";
                        break;
                    case 9:
                        return "/";
                        break;
                    case 10:
                        return ";";
                        break;
                    case 11:
                        return 9;
                        break;
                    case 12:
                        return "";
                        break;
                }
            },
            rules: [/^(?:[0-9]+(\.[0-9]+)?\b)/, /^(?:[a-zA-Z_$][a-zA-Z_0-9$]*)/, /^(?:=)/, /^(?:\()/, /^(?:\))/, /^(?:,)/, /^(?:\+)/, /^(?:-)/, /^(?:\*)/, /^(?:\/)/, /^(?:;)/, /^(?:[\n]+)/, /^(?:[ \t\n]+)/],
            conditions: { "INITIAL": { "rules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "inclusive": true } }
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
},{"_process":3,"fs":1,"path":2}],10:[function(require,module,exports){
var Parser = require('./compiler/base.js');
var source = require('./test.js');

Parser.parse(source);

},{"./compiler/base.js":5,"./test.js":7}]},{},[10]);
