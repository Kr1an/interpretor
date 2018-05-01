class Token {
    constructor(type, lexem, literal, line, offset=0) {
        this.type = type;
        this.lexem = lexem;
        this.literal = literal;
        this.line = line;
        this.offset = offset;
    }

    toString() {
        return `
            type: ${this.type}
            lexem: ${this.lexem}
            literal: ${this.literal}
            line: ${this.line}
        `;
    }
}

module.exports = Token;