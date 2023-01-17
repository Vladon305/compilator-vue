import ExpressionNode from "./ExpressionNode";
import Token from "../Token";

export default class VariableNode extends ExpressionNode {
    variable: Token;

    constructor(
        start: number,
        end: number,
        variable: Token
    ) {
        super(start, end);
        this.variable = variable;
    }
}
