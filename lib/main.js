var source = require('./test.js');
var Jellymarker = require('./jellymarker.js');

Jellymarker.registerOperators('+', function(operand1, operand2) {
    return operand1 + operand2;
});

Jellymarker.registerOperators('-', function(operand1, operand2) {
    return operand1 - operand2;
});

Jellymarker.registerOperators('*', function(operand1, operand2) {
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
