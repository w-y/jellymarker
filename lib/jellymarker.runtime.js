Object.defineProperty(exports, "__esModule", {
    value: true
});

var _base = require('./base');

var base = _interopRequireWildcard(_base);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function create() {
    var jm = new base.JellymarkerEnvironment();

    return jm;
}

var inst = create();
inst.create = create;

inst['default'] = inst;

exports.default = inst;