import ExpressionNode from "./ExpressionNode";
import Token from "../Token";

export default class BinOperationNode extends ExpressionNode {
    operator: Token;
    leftNode: ExpressionNode;
    rightNode: ExpressionNode;

    constructor(
        start: number,
        end: number,
        operator: Token,
        leftNode: ExpressionNode,
        rightNode: ExpressionNode
    ) {
        super(start, end);
        this.operator = operator;
        this.leftNode = leftNode;
        this.rightNode = rightNode;
    }
}
