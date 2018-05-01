const Interpretor = require('./lib');

const input = process.argv.slice(2).join(' ')
const interpretor = new Interpretor();

if (input.length) {
    interpretor.runFile(input);
} else {
    interpretor.runPrompt();
}

// const test = require('./lib/test');


// const ASTPrinter = require('./lib/ASTPrinter');
// const {
//     Binary,
//     Unary,
//     Literal,
//     Grouping,
// } = require('./lib/Expr');
// const Token = require('./lib/Token');
// const TokenType = require('./lib/TokenType');

// const expression = new Binary({
//     leftExpr: new Unary({
//         operator: new Token(TokenType.MINUS, "-", null, 1),
//         rightExpr: new Literal({ value: 123 }),
//     }),
//     operator: new Token(TokenType.STAR, "*", null, 1),
//     rightExpr: new Grouping({
//         expression: new Literal({ value: 45.67 }),
//     })
// })

// console.log(new ASTPrinter().print(expression));