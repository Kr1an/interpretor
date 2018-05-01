const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const Scanner = require('../lib/Scanner');
const TokenType = require('../lib/TokenType');
const ReservedTokenType = require('../lib/ReservedTokenType');
const Parser = require('../lib/Parser');
const ASTPrinter = require('../lib/ASTPrinter');
const Interpreter = require('../lib/Interpreter');

chai.use(sinonChai);


describe('Interpreter', function() {
    describe('interpret', function() {
        beforeEach(function() {
            sinon.spy(console, 'log');
        })
        afterEach(function() {
            console.log.restore();
        })
        it('parse difficult expression print ((4)/(1)+43) == 3 == false;', function() {
            const source = 'print ((4)/(1)+43) == 3 == false;';
            const scanner = new Scanner(source);
            const tokens = scanner.scanTokens();
            const parser = new Parser(tokens);
            const expression = parser.parse();
            const interpreter = new Interpreter();

            const expectedResult = true;

            interpreter.interpret(expression);
            expect(console.log).to.have.been.calledWith(true)
        });
        it('parse simple expression print (43 + 2) <= 32;', function() {
            const source = 'print (43 + 2) <= 32;';
            const scanner = new Scanner(source);
            const tokens = scanner.scanTokens();
            const parser = new Parser(tokens);
            const expression = parser.parse();
            const interpreter = new Interpreter();

            const expectedResult = false;

            interpreter.interpret(expression);
            expect(console.log).to.have.been.calledWith(false)
        });
    });
});
