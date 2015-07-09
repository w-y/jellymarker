
export function JellymarkerEnvironment(operators, variables) {
    this.operators = operators || {};
    this.variables = variables || {};
}

JellymarkerEnvironment.prototype = {

    constructor: JellymarkerEnvironment,

    registerVariables: function(name, obj) {
        this.variables[name] = obj;
    },

    unregisterVariables: function(name) {
        delete this.variables[name];
    },

    registerOperators: function(name, obj) {
        this.operators[name] = obj;
    },

    unregisterOperators: function(name) {
        delete this.operators[name];
    }

};
