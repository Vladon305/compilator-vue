import ExpressionNode from "./ExpressionNode";
import PropertyNode from "./PropiertyNode";

export default class ObjectExpressionNode extends ExpressionNode {

    properties: PropertyNode[];

    constructor(
        start: number,
        end: number,
        properties: PropertyNode[]
    ) {
        super(start, end);
        this.properties = properties;
    }

    pushNode(node: PropertyNode) {
        this.properties.push(node)
    }
}
