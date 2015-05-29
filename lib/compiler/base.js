import parser from './parser.js';
import AST from './ast';
import { extend } from '../utils';

export { parser };

let yy = {};
extend(yy, AST);

export function parse(input) {
    parser.yy = yy;

    return parser.parse(input);
}
