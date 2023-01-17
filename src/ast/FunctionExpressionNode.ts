import ExpressionNode from "./ExpressionNode";
import IdentifierNode from "./IdentifierNode";

export default class FunctionExpressionNode extends  ExpressionNode{
    params: IdentifierNode[];
    body: string;
    constructor(start: number, end: number, params: IdentifierNode[], body: string) {
        super(start, end);
        this.params = params
        this.body = body
    }
}