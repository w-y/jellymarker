%lex

/* %s */

%%

[0-9]+("."[0-9]+)?\b  return 'NUMBER'
[a-zA-Z_$][a-zA-Z_0-9$]*  return 'IDENT'

"="  return  '='
"("  return  '('
")"  return  ')'
","  return  ','

"+"  return  '+'
"-"  return  '-'
"*"  return  '*'
"/"  return  '/'

";"  return  ';'

[\n]+  return 'NEWLINE'

[ \t\n]+  return  ''
/lex

%start Program

%%

Program
    : SourceElements {
        $$ = $1;
        return $$;
    }
    ;

SourceElements
    : Statement {
        $$ = new yy.Program([new yy.Statement($1)]);
    }
    | SourceElements Statement {
        $1.statements.push(new yy.Statement($2));
        $$ = $1;
    }
    ;

Statement
    : EmptyStatement {
        $$ = $1;
    }
    | ExprStatement {
        $$ = $1;
    }
    ;

EmptyStatement
    : ';'
    | NEWLINE
    ;
ExprStatement
    : ExprNoBF ';' {
        $$ = $1;
    }
    | ExprNoBF NEWLINE {
        $$ = $1;
    }
    ;

ExprNoBF
    : AssignmentExprNoBF {
        $$ = $1;
    }
    ;

Expr
    : AssignmentExpr {
        $$ = $1;
    }
    ;

AssignmentExprNoBF
    : LeftHandSideExprNoBF AssignmentOperator AssignmentExprNoBF {
        $$ = new yy.AssignmentExpr($2, $1, $3);
    }
    | AddictiveExprNoBF {
        $$ = $1;
    }
    ;

AssignmentExpr
    : LeftHandSideExpr AssignmentOperator AssignmentExpr {
        $$ = new yy.AssignmentExpr($2, $1, $3);
    }
    | AddictiveExpr {
        $$ = $1;
    }
    ;

AssignmentOperator
    : '=' {
        $$ = new yy.Operator($1);
    }
    ;

CallExprNoBF
    : PrimaryExprNoBrace Arguments {
        $$ = new yy.CallExpr($1, $2);
    }
    | CallExprNoBF Arguments {
        $$ = new yy.CallExpr($1, $2);
    }
    ;

Arguments
    : '(' ')' {
        $$ = [];
    }
    | '(' ArgumentList ')' {
        $$ = $2;
    }
    ;

ArgumentList
    : AssignmentExpr {
        $$ = [$1];
    }
    | ArgumentList ',' AssignmentExpr {
        $$ = $1.concat($3);
    }
    ;

LeftHandSideExprNoBF
    : PrimaryExprNoBrace {
        $$ = $1;
    }
    | CallExprNoBF {
        $$ = $1;
    }
    ;

LeftHandSideExpr
    : PrimaryExprNoBrace {
        $$ = $1;
    }
    | CallExprNoBF {
        $$ = $1;
    }
    ;

PrimaryExprNoBrace
    : IDENT {
        $$ = new yy.Id($1);
    }
    | NUMBER {
        $$ = new yy.Num($1);
    }
    | '(' Expr ')' {
        $$ = $2;
    }
    ;

AddictiveExprNoBF
    : MultiplicativeExprNoBF {
        $$ = $1;
    }
    | AddictiveExprNoBF '+' MultiplicativeExprNoBF {
        $$ = new yy.AddictiveExpr($2, $1, $3);
    }
    | AddictiveExprNoBF '-' MultiplicativeExprNoBF {
        $$ = new yy.AddictiveExpr($2, $1, $3);
    }
    ;

AddictiveExpr
    : MultiplicativeExpr {
        $$ = $1;
    }
    | AddictiveExpr '+' MultiplicativeExpr {
        $$ = new yy.AddictiveExpr($2, $1, $3);
    }
    | AddictiveExpr '-' MultiplicativeExpr {
        $$ = new yy.AddictiveExpr($2, $1, $3);
    }
    ;

MultiplicativeExprNoBF
    : UnaryExprNoBF {
        $$ = $1;
    }
    | MultiplicativeExprNoBF '*' UnaryExprNoBF {
        $$ = new yy.MultiplicativeExpr($2, $1, $3);
    }
    | MultiplicativeExprNoBF '/' UnaryExprNoBF {
        $$ = new yy.MultiplicativeExpr($2, $1, $3);
    }
    ;

MultiplicativeExpr
    : UnaryExpr {
        $$ = $1;
    }
    | MultiplicativeExpr '*' UnaryExpr {
        $$ = new yy.MultiplicativeExpr($2, $1, $3);
    }
    | MultiplicativeExpr '/' UnaryExpr {
        $$ = new yy.MultiplicativeExpr($2, $1, $3);
    }
    ;

UnaryExprNoBF
    : LeftHandSideExprNoBF {
        $$ = $1;
    }
    ;

UnaryExpr
    : LeftHandSideExpr {
        $$ = $1;
    }
    ;
