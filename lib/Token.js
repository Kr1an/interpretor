class Token {
    constructor(type, lexeme, literal, line, offset=0) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
        this.offset = offset;
    }

    toString() {
        return `
            type: ${this.type}
            lexeme: ${this.lexeme}
            literal: ${this.literal}
            line: ${this.line}
        `;
    }
}

module.exports = Token;