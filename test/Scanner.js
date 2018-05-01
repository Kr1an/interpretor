const expect = require('chai').expect;
const Scanner = require('../lib/Scanner');
const TokenType = require('../lib/TokenType');
const ReservedTokenType = require('../lib/ReservedTokenType');

describe('Scanner', function() {
    describe('scanTokens', function() {
        it('multi line', function() {
            const tokens = new Scanner('hello = "hello world";\nprint(hello);\n').scanTokens().map(x => ({ type: x.type, lexem: x.lexem }))
            
            const expectedTokens = [
                { type: TokenType.IDENTIFIER, lexem: 'hello' },
                { type: TokenType.EQUAL, lexem: '=' },
                { type: TokenType.STRING, lexem: '"hello world"' },
                { type: TokenType.SEMICOLON, lexem: ';' },
                { type: ReservedTokenType.print, lexem: 'print' },
                { type: TokenType.LEFT_PAREN, lexem: '(' },
                { type: TokenType.IDENTIFIER, lexem: 'hello' },
                { type: TokenType.RIGHT_PAREN, lexem: ')' },
                { type: TokenType.SEMICOLON, lexem: ';' },
                { type: TokenType.EOF, lexem: '' },
            ]
          
            expect(tokens).to.be.eql(expectedTokens);
        })
        it('should skip multi line comments', function() {
            const tokens = new Scanner('4 + 2 /* / 2\n multiline comment */ number / 2').scanTokens().map(x => ({ type: x.type, lexem: x.lexem }))
            
            const expectedTokens = [
                { type: TokenType.NUMBER, lexem: '4' },
                { type: TokenType.PLUS, lexem: '+' },
                { type: TokenType.NUMBER, lexem: '2' },
                { type: TokenType.IDENTIFIER, lexem: 'number' },
                { type: TokenType.SLASH, lexem: '/' },
                { type: TokenType.NUMBER, lexem: '2' },
                { type: TokenType.EOF, lexem: '' },
            ]
          
            expect(tokens).to.be.eql(expectedTokens);
        })
        it('should skip single line comments', function() {
            const tokens = new Scanner('4 + 2 // / 2').scanTokens().map(x => ({ type: x.type, lexem: x.lexem }))
            
            const expectedTokens = [
                { type: TokenType.NUMBER, lexem: '4' },
                { type: TokenType.PLUS, lexem: '+' },
                { type: TokenType.NUMBER, lexem: '2' },
                { type: TokenType.EOF, lexem: '' },
            ]
          
            expect(tokens).to.be.eql(expectedTokens);
        })
        it('should parse simple expression', function() {
            const tokens = new Scanner('4 + 2 / 2').scanTokens().map(x => ({ type: x.type, lexem: x.lexem }))
            
            const expectedTokens = [
                { type: TokenType.NUMBER, lexem: '4' },
                { type: TokenType.PLUS, lexem: '+' },
                { type: TokenType.NUMBER, lexem: '2' },
                { type: TokenType.SLASH, lexem: '/' },
                { type: TokenType.NUMBER, lexem: '2' },
                { type: TokenType.EOF, lexem: '' },
            ]
          
            expect(tokens).to.be.eql(expectedTokens);
        })
    })
})