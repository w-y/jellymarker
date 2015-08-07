import Jellymarker from '../dist/jellymarker';

var jellymarker = Jellymarker.create();
var jellymarker2 = Jellymarker.create();

let isNumber = function(n) {
    return typeof n === 'number';
};

class DDVector {
    constructor(items) {
        this.items = items;
    }

    static opVector(v1, v2, fn) {
        let ret = [];
        let nv1 = [];
        let nv2 = [];
        let i = 0;
        DDVector.normalize(v1.items, v2.items, nv1, nv2);

        for (i = 0; i < nv1.length; i++) {
            ret.push({
                date: nv1[i].date,
                value: fn(nv1[i].value, nv2[i].value)
            });
        }

        return new DDVector(ret);
    }

    static opScalar(v1, v2, fn) {
        var ret = [];

        for (let i = 0; i < v1.items.length; i++) {
            ret.push({
                date: v1.items[i].date,
                value: fn(v1.items[i].value, v2)
            });
        }
        return new DDVector(ret);
    }

    static normalize(v1, v2, refNv1, refNv2) {
        let nv1 = refNv1;
        let nv2 = refNv2;
        let i = 0;
        let j = 0;

        while (i < v1.length && j < v2.length && v1[i].date < v2[j].date) {
            nv1.push(v1[i]);
            nv2.push({
                date: v1[i].date,
                value: 0
            });

            i++;
        }

        while (i < v1.length && j < v2.length && v1[i].date > v2[j].date) {
            nv1.push({
                date: v2[j].date,
                value: 0
            });
            nv2.push(v2[j]);

            j++;
        }

        while (i < v1.length && j < v2.length && v1[i].date === v2[j].date) {
            nv1.push(v1[i]);
            nv2.push(v2[j]);
            i++;
            j++;
        }

        while (i < v1.length) {
            nv1.push(v1[i]);
            nv2.push({
                date: v1[i].date,
                value: 0
            });
            i++;
        }

        while (j < v2.length) {
            nv1.push({
                date: v2[j].date,
                value: 0
            });
            nv2.push(v2[j]);
            j++;
        }
    }
}

let v1 = new DDVector([
    {
        date: '20150710',
        value: 100
    },
    {
        date: '20150711',
        value: 101
    },
    {
        date: '20150712',
        value: 102
    },
    {
        date: '20150713',
        value: 103
    }
]);

let v2 = new DDVector([
    {
        date: '20150711',
        value: 101
    },
    {
        date: '20150712',
        value: 102
    }
]);

let add = (v1, v2) => { return v1+v2; };
let sub = (v1, v2) => { return v1-v2; };
let mul = (v1, v2) => { return v1*v2; };
let div = (v1, v2) => { return v1/v2; };

jellymarker.registerOperators('+', function(operand1, operand2) {

    if (isNumber(operand1) && isNumber(operand2)) {
        return operand1 + operand2;
    }

    if (isNumber(operand1)) {
        return DDVector.opScalar(operand2, operand1, add);
    } else if (isNumber(operand2)) {
        return DDVector.opScalar(operand1, operand2, add);
    } else {
        return DDVector.opVector(operand1, operand2, add);
    }
});

jellymarker.registerOperators('-', function(operand1, operand2) {
    if (isNumber(operand1) && isNumber(operand2)) {
        return operand1 - operand2;
    }
    if (isNumber(operand1)) {
        return DDVector.opScalar(operand2, operand1, sub);
    } else if (isNumber(operand2)) {
        return DDVector.opScalar(operand1, operand2, sub);
    } else {
        return DDVector.opVector(operand1, operand2, sub);
    }
});

jellymarker.registerOperators('*', function(operand1, operand2) {
    if (isNumber(operand1) && isNumber(operand2)) {
        return operand1 * operand2;
    }
    if (isNumber(operand1)) {
        return DDVector.opScalar(operand2, operand1, mul);
    } else if (isNumber(operand2)) {
        return DDVector.opScalar(operand1, operand2, mul);
    } else {
        return DDVector.opVector(operand1, operand2, mul);
    }
});

jellymarker.registerOperators('/', function(operand1, operand2) {
    if (isNumber(operand1) && isNumber(operand2)) {
        return operand1 / operand2;
    }
    if (isNumber(operand1)) {
        return DDVector.opScalar(operand2, operand1, div);
    } else if (isNumber(operand2)) {
        return DDVector.opScalar(operand1, operand2, div);
    } else {
        return DDVector.opVector(operand1, operand2, div);
    }
});


jellymarker.registerVariables('AVG', function(v) {
    return this.operators['/'](v, 2);
});

jellymarker.registerVariables('OPEN', v1);

jellymarker.registerVariables('CLOSE', v2);

jellymarker2.compile('A=100;', {});
