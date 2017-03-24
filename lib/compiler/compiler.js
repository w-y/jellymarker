Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Compiler = Compiler;
exports.compile = compile;
exports.evaluate = evaluate;

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

function evaluate(input, options, env) {
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