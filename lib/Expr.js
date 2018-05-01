class Expr {
    constructor(ini) {
        Object.assign(this, ini);
    }
    accept(visitor) {}
}
module.exports = {
Binary: class extends Expr {
    accept(visitor) {
        return visitor.visitBinaryExpr(this);
    }
},
Unary: class extends Expr {
    accept(visitor) {
        return visitor.visitUnaryExpr(this);
    }
},
Literal: class extends Expr {
    accept(visitor) {
        return visitor.visitLiteralExpr(this);
    }
},
Grouping: class extends Expr {
    accept(visitor) {
        return visitor.visitGroupingExpr(this);
    }
}
}