import ExpressionNode from "./ExpressionNode";
import ObjectExpressionNode from "./ObjectNode";
import LiteralNode from "./LiteralNode";
import IdentifierNode from "./IdentifierNode";
import FunctionExpressionNode from "./FunctionExpressionNode";

export default class PropertyNode extends ExpressionNode {

    key: IdentifierNode;
    value: LiteralNode | ObjectExpressionNode | FunctionExpressionNode;

    constructor(
        start: number,
        end: number,
        key: IdentifierNode,
        value: LiteralNode | ObjectExpressionNode | FunctionExpressionNode
    ) {
        super(start, end);
        this.key = key
        this.value = value
    }
}
