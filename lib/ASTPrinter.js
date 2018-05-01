class ASTPrinter {
    print(expr) {
        // console.log(expr);
        return expr.accept(this);
    }
    visitBinaryExpr(expr) {
        return this.parenthesize(expr.operator.lexeme, [expr.leftExpr, expr.rightExpr])
    }

    visitGroupingExpr(expr) {
        return this.parenthesize("group", [expr.expression])
    }

    visitLiteralExpr(expr) {
        if (expr.value === null) return "nil";
        return expr.value.toString();
    }

    visitUnaryExpr(expr) {
        return this.parenthesize(expr.operator.lexeme, [expr.rightExpr]);
    }

    parenthesize(name, exprs) {
        return `(${name} ${exprs.map(expr => expr.accept(this)).join(' ')})`;
    }
}

module.exports = ASTPrinter;