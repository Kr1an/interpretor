const expect = require('chai').expect;
const Scanner = require('../lib/Scanner');
const TokenType = require('../lib/TokenType');
const ReservedTokenType = require('../lib/ReservedTokenType');

describe('Scanner', function() {
    describe('scanTokens', function() {
        it('multi line', function() {
            const tokens = new Scanner('hello = "hello world";\nprint(hello);\n').scanTokens().map(x => ({ type: x.type, lexeme: x.lexeme }))
            
            const expectedTokens = [
                { type: TokenType.IDENTIFIER, lexeme: 'hello' },
                { type: TokenType.EQUAL, lexeme: '=' },
                { type: TokenType.STRING, lexeme: '"hello world"' },
                { type: TokenType.SEMICOLON, lexeme: ';' },
                { type: ReservedTokenType.print, lexeme: 'print' },
                { type: TokenType.LEFT_PAREN, lexeme: '(' },
                { type: TokenType.IDENTIFIER, lexeme: 'hello' },
                { type: TokenType.RIGHT_PAREN, lexeme: ')' },
                { type: TokenType.SEMICOLON, lexeme: ';' },
                { type: TokenType.EOF, lexeme: '' },
            ]
          
            expect(tokens).to.be.eql(expectedTokens);
        })
        it('should skip multi line comments', function() {
            const tokens = new Scanner('4 + 2 /* / 2\n multiline comment */ number / 2').scanTokens().map(x => ({ type: x.type, lexeme: x.lexeme }))
            
            const expectedTokens = [
                { type: TokenType.NUMBER, lexeme: '4' },
                { type: TokenType.PLUS, lexeme: '+' },
                { type: TokenType.NUMBER, lexeme: '2' },
                { type: TokenType.IDENTIFIER, lexeme: 'number' },
                { type: TokenType.SLASH, lexeme: '/' },
                { type: TokenType.NUMBER, lexeme: '2' },
                { type: TokenType.EOF, lexeme: '' },
            ]
          
            expect(tokens).to.be.eql(expectedTokens);
        })
        it('should skip single line comments', function() {
            const tokens = new Scanner('4 + 2 // / 2').scanTokens().map(x => ({ type: x.type, lexeme: x.lexeme }))
            
            const expectedTokens = [
                { type: TokenType.NUMBER, lexeme: '4' },
                { type: TokenType.PLUS, lexeme: '+' },
                { type: TokenType.NUMBER, lexeme: '2' },
                { type: TokenType.EOF, lexeme: '' },
            ]
          
            expect(tokens).to.be.eql(expectedTokens);
        })
        it('should parse simple expression', function() {
            const tokens = new Scanner('4 + 2 / 2').scanTokens().map(x => ({ type: x.type, lexeme: x.lexeme }))
            
            const expectedTokens = [
                { type: TokenType.NUMBER, lexeme: '4' },
                { type: TokenType.PLUS, lexeme: '+' },
                { type: TokenType.NUMBER, lexeme: '2' },
                { type: TokenType.SLASH, lexeme: '/' },
                { type: TokenType.NUMBER, lexeme: '2' },
                { type: TokenType.EOF, lexeme: '' },
            ]
          
            expect(tokens).to.be.eql(expectedTokens);
        })
    })
})