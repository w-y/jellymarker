import AST from './ast';

function Visitor() {
    this.parents = [];
}

Visitor.prototype = {
    constructor: Visitor,
    mutating: false,

    accept: function(object) {
        if (!object) {
            return;
        }
    }
};

export default Visitor;
