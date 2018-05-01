const expect = require('chai').expect;
const Scanner = require('../lib/Scanner');
const TokenType = require('../lib/TokenType');
const ReservedTokenType = require('../lib/ReservedTokenType');
const Parser = require('../lib/Parser');
const ASTPrinter = require('../lib/ASTPrinter');

describe('Parser', function() {
    describe('parse', function() {
        it('parse difficult expression (((4)/(1) + !!43 == 3 == 1));', function() {
            const source = '(((4)/(1) + !!43 == 3 == 1));';
            const scanner = new Scanner(source);
            const tokens = scanner.scanTokens();
            const parser = new Parser(tokens);
            const expression = parser.parse()[0].expression;
            const astPrinter = new ASTPrinter();

            const expectedOutput = '(group (group (== (== (+ (/ (group 4) (group 1)) (! (! 43))) 3) 1)))';

            expect(astPrinter.print(expression)).to.be.equal(expectedOutput);
        });
        it('parse simple expression (43 + 2) <= 32;', function() {
            const source = '(43 + 2) <= 32;';
            const scanner = new Scanner(source);
            const tokens = scanner.scanTokens();
            const parser = new Parser(tokens);
            const declarations = parser.parse();
            const expression = declarations[0].expression;
            // console.log(expression);
            const astPrinter = new ASTPrinter();

            const expectedOutput = '(<= (group (+ 43 2)) 32)';

            expect(astPrinter.print(expression)).to.be.equal(expectedOutput);
        });
    });
});
