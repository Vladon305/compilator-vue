import ExpressionNode from "./ExpressionNode";

export default class IdentifierNode extends ExpressionNode {
    value: string;

    constructor(start: number, end: number, value: string) {
        super(start, end);
        this.value = value
    }
}