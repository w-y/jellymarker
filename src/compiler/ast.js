let AST = {
    Program: function(statements) {
        this.type = 'Program';
        this.statements = statements;
    },
    Statement: function(content) {
        this.type = 'Statement';
        this.content = content;
    },
    EmptyStatement: function() {
        this.type = 'EmptyStatement';
    },
    ExprStatement: function() {
        this.type = 'ExprStatement';
    },
    ExprNoBF: function() {
        this.type = 'ExprNoBF';
    },
    Expr: function() {
        this.type = 'Expr';
    },
    AssignmentExpr: function(operator, operand1, operand2) {
        this.type = 'AssignmentExpr';
        this.operator = operator;
        this.operand1 = operand1;
        this.operand2 = operand2;
    },
    AssignmentExprNoBF: function() {
        this.type = 'AssignmentExprNoBF';
    },
    LeftHandSideExprNoBF: function() {
        this.type = 'LeftHandSideExprNoBF';
    },
    LeftHandSideExpr: function() {
        this.type = 'LeftHandSideExpr';
    },
    AssignmentOperator: function() {
        this.type = 'AssignmentOperator';
    },
    AddictiveExprNoBF: function() {
        this.type = 'AddictiveExprNoBF';
    },
    AddictiveExpr: function(operator, operand1, operand2) {
        this.type = 'AddictiveExpr';
        this.operator = operator;
        this.operand1 = operand1;
        this.operand2 = operand2;
    },
    CallExpr: function(fn, args) {
        this.type = 'CallExpr';
        this.fn = fn;
        this.args = args;
    },
    PrimaryExprNoBrace: function() {
        this.type = 'PrimaryExprNoBrace';
    },
    Arguments: function() {
        this.type = 'Arguments';
    },
    ArgumentList: function() {
        this.type = 'ArgumentList';
    },
    MultiplicativeExprNoBF: function() {
        this.type = 'MultiplicativeExprNoBF';
    },
    MultiplicativeExpr: function(operator, operand1, operand2) {
        this.type = 'MultiplicativeExpr';

        this.operator = operator;
        this.operand1 = operand1;
        this.operand2 = operand2;
    },
    UnaryExprNoBF: function() {
        this.type = 'UnaryExprNoBF';
    },
    Num: function(value) {
        this.type = 'Number';
        this.value = value;
    },
    String: function(value) {
        this.type = 'String';
        this.value = value;
    },
    Id: function(identifier) {
        this.type = 'Id';
        this.identifier = identifier;
    },
    Operator: function(op) {
        this.type = 'Operator';
        this.op = op;
    }
};

export default AST;
