const {
    GREATE,
    GREATER_EQUAL,
    LESS,
    LESS_EQUAL,
    BANG,
    BANG_EQUAL,
    EQUAL_EQUAL,
    MINUS,
    FALSE,
    TRUE,
    NIL,
    NUMBER,
    STRING,
    LEFT_PAREN,
    RIGHT_PAREN,
    EOF,
    SLASH,
    STAR,
    PLUS,
    SEMICOLON,
    CLASS,
    FUN,
    VAR,
    FOR,
    IF,
    WHILE,
    PRINT,
    RETURN,
} = require('./TokenType');
const {
    Unary,
    Binary,
    Literal,
    Grouping,
} = require('./Expr');
const {
    ParseError,
} = require('./Error');

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.current = 0;
    }
    parse() {
        try {
            return this.expression();
        } catch (e) {
            if (e instanceof ParseError) {
                require('./index').parseError(e);
                return null;
            } else {
                throw e;
            }
        }
    }
    expression() {
        return this.equality();
    }
    equality() {
        let leftExpr = this.comparison();

        while (this.match(BANG_EQUAL, EQUAL_EQUAL)) {
            const operator = this.previous();
            const rightExpr = this.comparison();
            leftExpr = new Binary({ leftExpr, operator, rightExpr });
        }

        return leftExpr;
    }
    comparison() {
        let leftExpr = this.addition();

        while (this.match(GREATE, GREATER_EQUAL, LESS, LESS_EQUAL)) {
            const operator = this.previous();
            const rightExpr = this.addition();
            leftExpr = new Binary({ leftExpr, operator, rightExpr })
        }

        return leftExpr

    }
    addition() {
        let leftExpr = this.multiplication();

        while (this.match(PLUS, MINUS)) {
            const operator = this.previous();
            const rightExpr = this.multiplication();
            leftExpr = new Binary({ leftExpr, operator, rightExpr })
        }

        return leftExpr
    }
    multiplication() {
        let leftExpr = this.unary();

        while (this.match(SLASH, STAR)) {
            const operator = this.previous();
            const rightExpr = this.unary();
            leftExpr = new Binary({ leftExpr, operator, rightExpr });

        }

        return leftExpr;
    }
    unary() {
        if (this.match(BANG, MINUS)) {
            const operator = this.previous();
            const rightExpr = this.unary();
            return new Unary({ operator, rightExpr })
        }
        return this.primary();
    }
    primary() {
        if (this.match(FALSE)) return new Literal({ value: false });
        if (this.match(TRUE)) return new Literal({ value: true });
        if (this.match(NIL)) return new Literal({ value: null });

        if (this.match(NUMBER, STRING)) {
            return new Literal({ value: this.previous().literal });
        }
        if (this.match(LEFT_PAREN)) {
            const expr = this.expression();
            this.consume(RIGHT_PAREN, "Expect ')' after expression.");
            return new Grouping({ expression: expr });
        }
        throw new ParseError(this.peek(), "Expect expression.");
        
    }
    synchronize() {
        this.advance();
        while (!this.isAtEnd()) {
            if (this.previous().type === SEMICOLON) return;

            switch (this.peek().type) {
                case CLASS:
                case FUN:
                case VAR:
                case FOR:
                case IF:
                case WHILE:
                case PRINT:
                case RETURN:
                    return;
            }
        }
        this.advance();
    }

    consume(type, message) {
        if (this.check(type)) return this.advance();
        throw new ParseError(this.peek(), message);
    }
    match() {
        const types = Array.from(arguments);
        for (let key in types) {
            if (this.check(types[key])) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    check(tokenType) {
        if (this.isAtEnd()) return false;
        return this.peek().type === tokenType;
    }
    advance() {
        if (!this.isAtEnd()) this.current += 1;
        return this.previous();
    }
    peek() {
        return this.tokens[this.current];
    }
    isAtEnd() {
        return this.peek().type === EOF;
    }
    previous() {
        return this.tokens[this.current - 1];
    }

}

module.exports = Parser;