const {
    MINUS,
    BANG,
    SLASH,
    STAR,
    GREATE,
    PLUS,
    GREATER_EQUAL,
    LESS,
    LESS_EQUAL,
    BANG_EQUAL,
    EQUAL_EQUAL,
} = require('./TokenType');

const {
    RuntimeError,
} = require('./Error');

class Interpreter {
    interpret(expression) {
        try {
            const value = this.evaluate(expression);
            console.log(value);
        } catch (e) {
            if (e instanceof RuntimeError) {
                require('./index').runtimeError(e);
            } else {
                throw e;
            }
        }
    }
    visitBinaryExpr(expr) {
        const left = this.evaluate(expr.leftExpr);
        const right = this.evaluate(expr.rightExpr);

        switch (expr.operator.type) {
            case BANG_EQUAL: return !this.isEqual(left, right);
            case EQUAL_EQUAL: return this.isEqual(left, right);
            case GREATE: {
                this.checkNumberOperands(expr.operator, left, right);
                return (+left) > (+right);
            }
            case GREATER_EQUAL: {
                this.checkNumberOperands(expr.operator, left, right);
                return (+left) >= (+right);
            }
            case LESS: {
                this.checkNumberOperands(expr.operator, left, right);
                return (+left) < (+right);
            }
            case LESS_EQUAL: {
                this.checkNumberOperands(expr.operator, left, right);
                return (+left) <= (+right);
            }
            case MINUS: {
                this.checkNumberOperands(expr.operator, left, right);
                return (+left) - (+right);
            }
            case SLASH: {
                this.checkNumberOperands(expr.operator, left, right);
                return (+left) / (+right);
            }
            case STAR: {
                this.checkNumberOperands(expr.operator, left, right);
                return (+left) * (+right);
            }
            case PLUS: {
                if (typeof left === 'number' && typeof right === 'number') {
                    return (+left) + (+right);
                }
                if (typeof left === 'string' && typeof right === 'string') {
                    return `${left}${right}`;
                }
                throw new RuntimeError(expr.operator, "Operands must be two numbers or two strings.");
            }
        }

        return null;
    }
    visitLiteralExpr(expr) {
        return expr.value;
    }
    visitGroupingExpr(expr) {
        return this.evaluate(expr.expression);
    }
    visitUnaryExpr(expr) {
        const right = this.evaluate(expr.right);
        switch (expr.operator.type) {
            case MINUS: return -right;
            case BANG: return !this.isTrythy(right);
        }
        return null;
    }
    evaluate(expr) {
        return expr.accept(this);
    }
    isTrythy(value) {
        if (value === null) return false;
        if (typeof value === 'boolean') return !!value;
        return true
    }
    isEqual(a, b) {
        if (a === null && b == null) return true;
        if (a === null || b === null) return false;

        return a == b;
    }
    checkNumberOperands(operator, left, right) {
        if (typeof left === 'number' && typeof right === 'number') return;
        throw new RuntimeError(operator, 'Operands must be numbers');
    }
    checkNumberOperand(operator, operand) {
        if (typeof operator === 'number') return;
        throw new RuntimeError(operator, "Operator must be a number");
    }
}

module.exports = Interpreter;