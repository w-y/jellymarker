import Jellymarker from './jellymarker';

let jellymarker = Jellymarker.create();

let block = [{
    name: 'display',
    value: 'block',
    priority: 1,
    state: 'default'
}];

let absolute = [{
    name: 'position',
    value: 'absolute',
    priority: 1,
    state: 'default'
}];

let colorDefault = [{
    name: 'color',
    value: '#cccccc',
    priority: 1,
    state: 'default'
}];

let colorRedWhenHover = [{
    name: 'color',
    value: '#ff3333',
    priority: 1,
    state: 'hover'
}];


let findByName = function(v, name) {
    if (!Array.isArray(v)) {
        return -1;
    }
    for (let i = 0; i < v.length; i++) {
        if (v[i].name === name) {
            return i;
        }
    }
    return -1;
};
let clone = function(v) {
    return JSON.parse(JSON.stringify(v));
};

jellymarker.registerVariables('block', block);
jellymarker.registerVariables('absolute', absolute);
jellymarker.registerVariables('colorDefault', colorDefault);
jellymarker.registerVariables('colorRedWhenHover', colorRedWhenHover);

['width', 'height', 'left', 'right', 'marginLeft', 'marginRight'].forEach(function(k) {
    jellymarker.registerVariables(k, function(v) {
        return [{
            name: k,
            value: v,
            priority: 1,
            state: 'default'
        }];
    });
});



jellymarker.registerOperators('+', function(v1, v2) {
    let v3 = clone(v1);
    v2.forEach(function(v) {
        let index = findByName(v3, v.name);

        if (index >= 0) {
            if (v3[index].priority < v.priority) {
                v3.push(clone(v));
            } else {
                throw new Error('cant add two style with same priority');
            }
        } else {
            v3.push(clone(v));
        }
    });
    return v3;
});

jellymarker.registerOperators('-', function(v1, v2) {
    let v3 = clone(v1);

    v2.forEach(function(v) {
        let index = findByName(v3, v.name);

        if (index >= 0) {
            v3.splice(index, 1);
        }
    });
    return v3;
});

jellymarker.registerOperators('*', function(v1, v2) {
    let v3 = clone(v1);

    v2.forEach(function(v) {
        let index = findByName(v3, v.name);

        if (index >= 0) {
            let stateMap1 = {};
            let stateMap2 = {};

            if (Array.isArray(v3[index].state)) {
                v3[index].state.forEach(function(s, ii) {
                    stateMap1[s] = v3[index].value[ii];
                });
            } else {
                stateMap1[v3[index].state] = v3[index].value;
            }

            if (Array.isArray(v.state)) {
                v.state.forEach(function(s, ii) {
                    stateMap2[s] = v.value[ii];
                });
            } else {
                stateMap2[v.state] = v.value;
            }
            let stateMap = Jellymarker.util.extend({}, stateMap1, stateMap2);

            v3[index].state = Object.keys(stateMap);
            v3[index].value = Object.keys(stateMap).map(function(k) {
                return stateMap[k];
            });
        }
    });
    return v3;
});

jellymarker.registerOperators('/', function(v1, v2) {
    let v3 = clone(v1);

    v2.forEach(function(v) {
        let index = findByName(v3, v.name);

        if (index >= 0) {
            let stateMap1 = {};
            let stateMap2 = {};

            if (Array.isArray(v3[index].state)) {
                v3[index].state.forEach(function(s, ii) {
                    stateMap1[s] = v3[index].value[ii];
                });
            } else {
                stateMap1[v3[index].state] = v3[index].value;
            }

            if (Array.isArray(v.state)) {
                v.state.forEach(function(s, ii) {
                    stateMap2[s] = v.value[ii];
                });
            } else {
                stateMap2[v.state] = v.value;
            }

            Object.keys(stateMap1).forEach(function(k) {
                if (stateMap2[k] != null && typeof stateMap2[k] !== 'undefined') {
                    delete stateMap1[k];
                }
            });

            let states = Object.keys(stateMap1);
            let values = Object.keys(stateMap1).map(function(k) {
                return stateMap1[k];
            });

            if (states.length === 1) {
                v3[index].state = states[0];
                v3[index].value = values[0];
            } else {
                v3[index].state = states;
                v3[index].value = values;
            }
        }
    });

    return v3;
});

let trans = (attrList) => {
    return attrList.map((attr) => {
        return {[attr.name]:attr.value};
    }).reduce((prev, next) => {
        Jellymarker.util.extend(prev, next); 
        return prev;
    }, {});
};

jellymarker.compile('a = absolute + block + left(0) + right(0) + marginLeft("auto") + marginRight("auto") + width(10) + height(20);');

console.log(trans(jellymarker.variables.a));
