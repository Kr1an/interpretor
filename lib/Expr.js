class Expr {

}
class Binary extends Expr {
    constructor(leftExpr, operator, rightExpr) {
        this.leftExpr = leftExpr;
        this.operator = operator;
        this.rightExpr = rightExpr;
    }
}