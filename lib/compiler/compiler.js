import AST from './ast';

export function Compiler() {}

Compiler.prototype = {
    compiler: Compiler,

    compile: function(program) {
        return this.accept(program);
    },

    accept: function(node) {
        let ret = this[node.type](node);
        return ret;
    },
    Program: function(program) {
        let statements = program.statements;

        for (let i = 0; i < statements.length; i++) {
            this.accept(statements[i]);
        }
    },
    Statement: function(statement) {
        this.accept(statement.content);
    },
    Operator: function() {
         
    },
    AssignmentExpr: function(assignmentExpr) {
        var operator = assignmentExpr.operator;
        var oprand1 = assignmentExpr.oprand1;
        var oprand2 = assignmentExpr.oprand2;

        console.log(assignmentExpr);
    },
    AddictiveExpr: function(addictiveExpr) {

    },
    MultiplicativeExpr: function(multiplicativeExpr) {
    }
};

export function compile(input, options = {}, env) {
    let ast = env.parse(input, options);
    let compiler = new env.Compiler();
    //console.log(ast);
    //
    compiler.accept(ast);
}
