/*let s = 'A = B = 100.0\n'+
'A = 100*2\n'+
'A = CLOSE\n'+
'A = CLOSE + OPEN\n'+
'C = (CLOSE+OPEN)\n'+
'D = MACD(CLOSE, 100)\n'+
'E = (MACD(MA(CLOSE, 100)) + (B)) * 100 + C\n';*/

let s = 'A = (CLOSE + OPEN)/2\n'+
'B = (CLOSE - OPEN) / 2\n'+
'C = MA(OPEN+CLOSE)\n';

module.exports = s;
