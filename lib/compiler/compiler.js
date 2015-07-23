import {isFunction} from '../utils';

export function Compiler() {}

function normalize(input) {
    if (input && (input[input.length-1] !== ';' || input[input.lenght-1] !== '\n')) {
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

    compile: function(program) {
        let ret = this.accept(program);
        return ret;
    },
    accept: function(node) {
        let ret = this[node.type](node);
        return ret;
    },
    Program: function(program) {
        let statements = program.statements;
        let ret = [];

        for (let i = 0; i < statements.length; i++) {
            ret.push(this.accept(statements[i]));
        }
        return ret;
    },
    Statement: function(statement) {
        return this.accept(statement.content);
    },
    EmptyStatement: function(emptyStatement) {
        return null;
    },
    Operator: function(operator) {
        return this.operators[operator.op];
    },
    Variable: function(variable) {
        return this.variables[variable.identifier];
    },
    AssignmentExpr: function(assignmentExpr) {
        var right = this.accept(assignmentExpr.operand2);
        var op = this.accept(assignmentExpr.operator);

        op = op || ((v) => {return v;});

        var id =  assignmentExpr.operand1.identifier;
        this.variables[id] = op(right);

        return right;
    },
    AddictiveExpr: function(addictiveExpr) {
        return this.evalBinExpr(addictiveExpr);
    },
    MultiplicativeExpr: function(multiplicativeExpr) {
        return this.evalBinExpr(multiplicativeExpr);
    },
    Number: function(number) {
        return +number.value;
    },
    String: function(str) {
        return str.value.substring(1, str.value.length-1);
    },
    Id: function(id) {
        return this.variables[id.identifier];
    },
    CallExpr: function(callExpr) {
        var fn = this.accept(callExpr.fn);
        var args = [];

        if (callExpr.args && callExpr.args.length > 0) {
            args = callExpr.args.map( (arg) => {
                return this.accept(arg);
            });
        }
        if (fn && isFunction(fn)) {
            return fn.apply({
                operators: this.operators,
                variables: this.variables
            }, args);
        } else {
            //TODO: exception
            throw new Error('no such function');
        }
    },
    evalBinExpr: function(expr) {
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

export function compile(input, options, env) {
    if (!validate(input)) {
        return false;
    }
    let ast = env.parse(normalize(input), options);
    let compiler = new env.Compiler();

    compiler.operators = env.operators;
    compiler.variables = env.variables;

    return compiler.compile(ast);
}

export function eval(input, options, env) {
    if (!validate(input)) {
        return false;
    }
    let ast = env.parse(normalize(input), options);
    let compiler = new env.Compiler();

    compiler.operators = env.operators;
    compiler.variables = env.variables;

    let ret = compiler.compile(ast);
    if (ret && ret.length > 0) {
        return ret[0];
    }

    return false;
}
