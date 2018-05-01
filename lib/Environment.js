const {
    RuntimeError
} = require('./Error');

class Environment {
    constructor(enclosing = null) {
        this.values = {};
        this.enclosing = enclosing;
    }
    define(key, value) {
        this.values[key] = value;
    }
    receive(name) {
        if (typeof this.values[name.lexeme] !== 'undefined') {
            return this.values[name.lexeme];
        }
        if (this.enclosing != null) {
            return this.enclosing.receive(name);
        }
        throw new RuntimeError(name, `Undefined variable '${name.lexeme}'.`);
    }
    assign(name, value) {
        if (this.values[name.lexeme]) {
            this.values[name.lexeme] = value;
            return;
        }
        if (this.enclosing != null) {
            return this.enclosing.assign(name, value);
        }
        throw new RuntimeError(name, `Undefined variable '${name.lexeme}'.`);
    }
}

module.exports = Environment;
