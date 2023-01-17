import ExpressionNode from "./ExpressionNode";

export default class LiteralNode extends ExpressionNode {
    value: string;

    constructor(start: number, end: number, value: string) {
        super(start, end);
        this.value = value
    }

}


