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

const Environment = require('./Environment');

class Interpreter {
    constructor() {
        this.environment = new Environment();
    }
    interpret(statements) {
        try {
            statements.forEach(statement => {
                this.execute(statement);
            })
        } catch (e) {
            if (e instanceof RuntimeError) {
                require('./index').runtimeError(e);
            } else {
                throw e;
            }
        }
    }
    execute(stmt) {
        stmt.accept(this);
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
        const right = this.evaluate(expr.rightExpr);
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
    visitExpressionStmt(stmt) {
        this.evaluate(stmt.expression);
        return null;
    }
    visitPrintStmt(stmt) {
        const value = this.evaluate(stmt.expression);
        console.log(value);
        return null;
    }
    visitVarStmt(stmt) {
        let value = null;
        if (stmt.initializer) {
            value = this.evaluate(stmt.initializer);
        }

        this.environment.define(stmt.name.lexeme, value);
        return null;
    }
    visitBlockStmt(stmt) {
        this.executeBlock(stmt.statements, new Environment(this.environment));
        return null;
    }
    executeBlock(statements, environment) {
        const previous = this.environment;
        try {
            this.environment = environment;
            statements.forEach(statement => {
                this.execute(statement);
            })
        } finally {
            this.environment = previous;
        }
    }
    visitVariableExpr(expr) {
        return this.environment.receive(expr.name);
    }
    visitAssignExpr(expr) {
        const value = this.evaluate(expr.value);

        this.environment.assign(expr.name, value);
        return value;
    }
}

module.exports = Interpreter;