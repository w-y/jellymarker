s = 'A = B = 100.0\n'+
'A = 100*2\n'+
'A = CLOSE\n'+
'A = CLOSE + OPEN\n'+
'C = (CLOSE+OPEN)\n'+
'D = MACD(CLOSE, 100)\n'+
'E = (MACD(MA(CLOSE, 100)) + (B)) * 100 + C\n';

module.exports = s;
