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
    IDENTIFIER,
    EQUAL,
    LEFT_BRACE,
    RIGHT_BRACE,
} = require('./TokenType');
const {
    Unary,
    Binary,
    Literal,
    Grouping,
    Variable,
    Assign,
} = require('./Expr');
const {
    Print,
    Expression,
    Var,
    Block,
} = require('./Stmt');
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
            const declarations = [];
            while (!this.isAtEnd()) {
                declarations.push(this.declaration());
            }
            return declarations;
        } catch (e) {
            if (e instanceof ParseError) {
                require('./index').parseError(e);
                return null;
            } else {
                throw e;
            }
        }
    }
    declaration() {
        if (this.match(VAR)) return this.varDeclaration();
        return this.statement();
    }
    varDeclaration() {
        const name = this.consume(IDENTIFIER, "Expect variable name.");
        let initializer = null;
        if (this.match(EQUAL)) {
            initializer = this.expression();
        }
        this.consume(SEMICOLON, "Expected ';' after variable declaration.");
        return new Var({ name, initializer });
    }
    statement() {
        if (this.match(PRINT)) return this.printStatement();
            if (this.match(LEFT_BRACE)) return new Block({ statements: this.block() });
        return this.expressionStatement();
    }
    block() {
        const statements = [];
        while(!this.check(RIGHT_BRACE) && !this.isAtEnd()) {
            statements.push(this.declaration());
        }

        this.consume(RIGHT_BRACE, "Expect '}' after block.");
        return statements;
    }
    expressionStatement() {
        const expr = this.expression();
        this.consume(SEMICOLON, "Expect ';' after expression.")
        return new Expression({ expression: expr });
    }
    printStatement() {
        const value = this.expression();
        this.consume(SEMICOLON, "Expect ';' after value.")
        return new Print({ expression: value });
    }
    expression() {
        return this.assignment();
    }
    assignment() {
        const expr = this.equality()
        if (this.match(EQUAL)) {
            const equals = this.previous();
            const value = this.assignment();

            if (expr instanceof Variable) {
                const name = expr.name;
                return new Assign({ name, value });
            }
            throw new ParseError(equals, "Invalid assignment target");
        }
        return expr;

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
        if (this.match(IDENTIFIER)) {
            return new Variable({ name: this.previous() });
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