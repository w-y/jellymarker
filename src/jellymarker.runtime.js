import * as base from './base';

function create() {
    let jm = new base.JellymarkerEnvironment();

    return jm;
}

let inst = create();
inst.create = create;

inst['default'] = inst;

export default inst;
