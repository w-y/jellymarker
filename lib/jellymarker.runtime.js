import * as base from './base';

function create() {
    let tm = new base.JellymarkerEnvironment();
    
    return tm;
}

let inst = create();
inst.create = create;

inst['default'] = inst;

export default inst;
