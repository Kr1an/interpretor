// const Interpretor = require('./lib');

// const input = process.argv.slice(2).join(' ')
// const interpretor = new Interpretor();

// if (input.length) {
//     interpretor.runFile(input);
// } else {
//     interpretor.runPrompt();
// }

// const test = require('./lib/test');

class Parent {
    constructor(obj) {
        Object.assign(this, obj);
    }
}
class Child extends Parent {
    hello() {
        console.log(`hello from ${this.name}`);
    }
}

const person = new Child({name: 'Anton'})

person.hello();