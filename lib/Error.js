class RuntimeError extends Error {
    constructor(token, message, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RuntimeError);
        }
        this.token = token;
        this.message = message;
    }
}

class ParseError extends Error {
    constructor(token, message, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RuntimeError);
        }
        this.token = token;
        this.message = message;
    }
}

class ScannError extends Error {
    constructor(line, source, offset, message, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RuntimeError);
        }
        this.line = line;
        this.message = message;
        this.source = source;
        this.offset = offset;
    }
}

module.exports = {
    RuntimeError,
    ParseError,
    ScannError,
};
