const Token = require('./Token');
const TokenType = require('./TokenType');
const ReservedTokenTypes = require('./ReservedTokenType');

class Scanner {
    constructor(source) {
        this.source = source;
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.tokens = [];
    }
    isAtEnd() {
        return this.current >= this.source.length;
    }
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
        return this.tokens;
    }
    addToken(type, literal) {
        const text = this.source.slice(this.start, this.current);
        this.tokens.push(new Token(type, text, literal, this.line));
    }
    addTokenNoLiteral(type) {
        this.addToken(type, null);
    }
    advance() {
        this.current += 1;
        return this.source[this.current - 1];
    }
    match(expected) {
        if (this.isAtEnd()) return false;
        if (this.source[this.current] != expected) return false;

        this.current += 1
        return true;
    }
    peek() {
        if (this.isAtEnd()) return '\0';
        return this.source[this.current];
    }
    peekNext() {
        if (this.current + 1 >= this.source.length) return '\0';
        return this.source[this.current + 1];
    }
    number() {
        while (this.isDigit(this.peek())) this.advance();

        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            this.advance();

            while (this.isDigit(this.peek())) this.advance();
        }
        this.addToken(TokenType.NUMBER, +this.source.slice(this.start, this.current));
    }
    string() {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == '\n') this.line += 1;
            this.advance();
        }
        if (this.isAtEnd()) {
            require('./index.js').error(this.line, null, 'Unterminated string.');
            return;
        }

        this.advance();
        const value = this.source.slice(this.start + 1, this.current - 1);
        this.addToken(TokenType.STRING, value);
    }
    isDigit(c) {
        return !!c.match(/[0-9]/);
    }
    isAlpha(c) {
        return !!c.match(/[a-zA-Z_]/);
    }
    isAlphaNumeric(c) {
        return this.isAlpha(c) || this.isDigit(c);
    }
    identifier() {
        while(this.isAlphaNumeric(this.peek())) this.advance();

        const text = this.source.slice(this.start, this.current);
        const type = ReservedTokenTypes[text] || TokenType.IDENTIFIER;

        this.addToken(type);
    }
    multiLineComment() {
        while (true) {
            if (this.match('*') && this.match('/')) break;
            this.advance();
        }
    }
    singleLineComment() {
        while (this.peek() != '\n' && !this.isAtEnd()) this.advance();
    }
    scanToken() {
        const c = this.advance();
        switch(c) {
            case '(': this.addTokenNoLiteral(TokenType.LEFT_PAREN); break;
            case ')': this.addTokenNoLiteral(TokenType.RIGHT_PAREN); break;
            case '{': this.addTokenNoLiteral(TokenType.LEFT_BRACE); break;
            case '}': this.addTokenNoLiteral(TokenType.RIGHT_BRACE); break;
            case ',': this.addTokenNoLiteral(TokenType.COMMA); break;
            case '.': this.addTokenNoLiteral(TokenType.DOT); break;
            case '-': this.addTokenNoLiteral(TokenType.MINUS); break;
            case '+': this.addTokenNoLiteral(TokenType.PLUS); break;
            case ';': this.addTokenNoLiteral(TokenType.SEMICOLON); break;
            case '*': this.addTokenNoLiteral(TokenType.STAR); break;
            case '!': this.addTokenNoLiteral(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG); break;
            case '=': this.addTokenNoLiteral(this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL); break;
            case '<': this.addTokenNoLiteral(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS); break;
            case '>': this.addTokenNoLiteral(this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATE); break;
            case '/': {
                if (this.match('*')) {
                    this.multiLineComment();
                } else if (this.match('/')) {
                    this.singleLineComment();
                } else {
                    this.addTokenNoLiteral(TokenType.SLASH);
                }
                break;
            }
            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n':
                this.line += 1;
                break;
            case '"':
                this.string();
                break;
            default: {
                if (this.isDigit(c)) {
                    this.number();
                } else if (this.isAlpha(c)) {
                    this.identifier();
                } else {
                    require('./index.js').error(this.line, null, 'unexpected character.');
                }
                break;
            }
        }
    }
}


module.exports = Scanner;