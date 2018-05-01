const defineAST = require('./util/defineAST');

const args = process.argv.slice(2);
const outputDir = args.splice(0, 1)[0];

console.log(outputDir);

defineAST(outputDir, 'Expr', [
    "Binary",
    "Unary",
    "Literal",
    "Grouping", 
    "Variable", // name: Token
    "Assign", // name: Token, value: Expr
]);

defineAST(outputDir, 'Stmt', [
    "Expression",
    "Print",
    "Var", // name: Token, initializer: Expr
    "Block", // statements: []
]);

