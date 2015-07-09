var source = require('./test.js'); var Jellymarker = require('./jellymarker.js');

Jellymarker.registerOperators('add', function(operand1, operand2) {
    console.log('this is add');
    console.log('operand1 is ' + operand1);
    console.log('operand2 is ' + operand2);
    return operand1 + operand2;
});

Jellymarker.registerOperators('sub', function(operand1, operand2) {
    console.log('this is sub');
    console.log('operand1 is ' + operand1);
    console.log('operand2 is ' + operand2);
    return operand1 - operand2;
});

Jellymarker.registerOperators('mul', function(operand1, operand2) {
    console.log('this is mul');
    console.log('operand1 is ' + operand1);
    console.log('operand2 is ' + operand2);

    return operand1 * operand2;
});

Jellymarker.registerVariables('MACD', function() {
    return 1000;
});

Jellymarker.registerVariables('MA', function() {
    return 999;
});

Jellymarker.registerVariables('OPEN', 99);

Jellymarker.registerVariables('CLOSE', 999);

Jellymarker.compile(source, {}, Jellymarker);
