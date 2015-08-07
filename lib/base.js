Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.JellymarkerEnvironment = JellymarkerEnvironment;

function JellymarkerEnvironment(operators, variables) {
    this.operators = operators || {};
    this.variables = variables || {};
}

JellymarkerEnvironment.prototype = {

    constructor: JellymarkerEnvironment,

    registerVariables: function registerVariables(name, obj) {
        this.variables[name] = obj;
    },

    unregisterVariables: function unregisterVariables(name) {
        delete this.variables[name];
    },

    registerOperators: function registerOperators(name, obj) {
        this.operators[name] = obj;
    },

    unregisterOperators: function unregisterOperators(name) {
        delete this.operators[name];
    }

};