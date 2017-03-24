Object.defineProperty(exports, "__esModule", {
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

exports.default = AST;