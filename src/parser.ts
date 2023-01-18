import Token from "./Token";
import TokenType, {tokenTypesList} from "./TokenType";
import ExpressionNode from "./ast/ExpressionNode";
import StatementsNode from "./AST/StatementsNode";
import NumberNode from "./AST/NumberNode";
import VariableNode from "./AST/VariableNode";
import BinOperationNode from "./AST/BinOperationNode";
import UnarOperationNode from "./AST/UnarOperationNode";
import IdentifierNode from "./ast/IdentifierNode";
import LiteralNode from "./ast/LiteralNode";
import ObjectExpressionNode from "./ast/ObjectNode";
import PropertyNode from "./ast/PropiertyNode";

export default class Parser {
    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    tokens: Token[];
    pos: number = 0;
    scope: any = {};

    ast: any = []

    match(expected: TokenType[], isChangePos: boolean = false): Token | null {
        if (this.pos < this.tokens.length) {
            const currentToken = this.tokens[this.pos];
            if (expected.find((type) => type.name === currentToken.type.name)) {
                if (isChangePos) {
                    this.pos += 1;
                }
                return currentToken;
            }
        }
        return null;
    }

    require(...expected: TokenType[]): Token {
        const token = this.match(expected);
        if (!token) {
            throw new Error(`на позиции ${this.pos} ожидается ${expected[0].name}`);
        }
        return token;
    }

    get(relativePosition: number) {
        const position = this.pos + relativePosition
        if (position >= this.tokens.length) throw  new Error('');
        return this.tokens[position];
    }

    getTokenByPos(position: number) {
        const token = this.tokens[position];
        if (!token) {
            throw new Error(`на позиции ${this.pos} не найден токен`);
        }
        return token
    }

    // parseVariableOrNumber(): ExpressionNode {
    //     const number = this.match(tokenTypesList.NUMBER);
    //     if (number != null) {
    //         return new NumberNode(number);
    //     }
    //     const variable = this.match(tokenTypesList.VARIABLE);
    //     if (variable != null) {
    //         return new VariableNode(variable);
    //     }
    //     throw new Error(`Ожидается переменная или число на ${this.pos} позиции`);
    // }

    // parsePrint(): ExpressionNode {
    //     const operatorLog = this.match(tokenTypesList.LOG);
    //     if (operatorLog != null) {
    //         return new UnarOperationNode(operatorLog, this.parseFormula());
    //     }
    //     throw new Error(
    //         `Ожидается унарный оператор КОНСОЛЬ на ${this.pos} позиции`
    //     );
    // }

    // parseParentheses(): ExpressionNode {
    //     if (this.match(tokenTypesList.LPAR) != null) {
    //         const node = this.parseFormula();
    //         this.require(tokenTypesList.RPAR);
    //         return node;
    //     } else {
    //         return this.parseVariableOrNumber();
    //     }
    // }

    // parseFormula(): ExpressionNode {
    //     let leftNode = this.parseParentheses();
    //     let operator = this.match(tokenTypesList.MINUS, tokenTypesList.PLUS);
    //     while (operator != null) {
    //         const rightNode = this.parseParentheses();
    //         leftNode = new BinOperationNode(operator, leftNode, rightNode);
    //         operator = this.match(tokenTypesList.MINUS, tokenTypesList.PLUS);
    //     }
    //     return leftNode;
    // }

    parseExpression(): ExpressionNode {
        if (this.match([tokenTypesList.LCURLYBRACKET]) !== null) {
            while (this.pos < this.tokens.length) {
                // вызываем функцию `walk`, которая возвращает узел
                // помещаем этот узел в `params`
                this.ast.push(this.walk())
            }
        }

        // let variableNode = this.parseVariableOrNumber();
        // const assignOperator = this.match(tokenTypesList.ASSIGN);
        // if (assignOperator != null) {
        //     const rightFormulaNode = this.parseFormula();
        //     const binaryNode = new BinOperationNode(
        //         assignOperator,
        //         variableNode,
        //         rightFormulaNode
        //     );
        //     return binaryNode;
        // }
        throw new Error(
            `После переменной ожидается оператор создания объекта ${this.pos}`
        );
    }

    parseCode(): ExpressionNode {
        const root = new StatementsNode();
        while (this.pos < this.tokens.length) {
            console.log('parse')
            const codeNode = this.parseExpression();
            root.addNode(codeNode);
        }
        return root;
    }

    run(node: ExpressionNode): any {
        if (node instanceof NumberNode) {
            return parseInt(node.number.text);
        }
        if (node instanceof UnarOperationNode) {
            switch (node.operator.type.name) {
                case tokenTypesList.LOG.name:
                    console.log(this.run(node.operand));
                    return;
            }
        }
        if (node instanceof BinOperationNode) {
            switch (node.operator.type.name) {
                case tokenTypesList.PLUS.name:
                    return this.run(node.leftNode) + this.run(node.rightNode);
                case tokenTypesList.MINUS.name:
                    return this.run(node.leftNode) - this.run(node.rightNode);
                case tokenTypesList.ASSIGN.name:
                    const result = this.run(node.rightNode);
                    const variableNode = <VariableNode>node.leftNode;
                    this.scope[variableNode.variable.text] = result;
                    return result;
            }
        }
        if (node instanceof VariableNode) {
            if (this.scope[node.variable.text]) {
                return this.scope[node.variable.text];
            } else {
                throw new Error(
                    `Переменная с названием ${node.variable.text} не обнаружена`
                );
            }
        }
        if (node instanceof StatementsNode) {
            node.codeStrings.forEach((codeString) => {
                this.run(codeString);
            });
            return;
        }
        throw new Error("Ошибка!");
    }

    walk(): any {
        // // console.log(this.match([tokenTypesList.LCURLYBRACKET], true))
        // let token = this.tokens[this.pos];
        // console.log(token)
        if (this.match([tokenTypesList.LCURLYBRACKET])) {
            const object = new ObjectExpressionNode(this.pos, this.pos, [])

            //Набиваем массив properties
            while (this.pos < this.tokens.length) {
                this.pos += 1;
                let token = this.tokens[this.pos];
                console.log(token)
                if (token.type.name === tokenTypesList.COLON.name) {
                    this.pos -= 1;
                    const key = new IdentifierNode(this.pos, this.pos, this.require(tokenTypesList.VARIABLE).text)
                    const value = new LiteralNode(this.pos, this.pos, token.text)

                    if (this.match([tokenTypesList.LCURLYBRACKET], true) !== null) {

                    } else {
                        value.changeValue('value', this.getTokenByPos(this.pos).text)
                    }
                    const property = new PropertyNode(this.pos, this.pos, key, value)
                    object.pushNode(property)
                }
                const commaToken = this.match([tokenTypesList.COMMA])

            }
            return object
        }
        if (this.match([tokenTypesList.VARIABLE])) {
            const token = this.require(tokenTypesList.VARIABLE)
            this.pos++
            return new IdentifierNode(this.pos, this.pos, token.text);
        }
        // if (this.match([tokenTypesList.STRINGSB])) {
        //     this.pos -= 1
        //     const token = this.require(tokenTypesList.STRINGSB)
        //     return new LiteralNode(this.pos, this.pos, token.text);
        // }
        // if (this.match([tokenTypesList.COLON])) {
        //     if (this.match([tokenTypesList.VARIABLE])) {
        //         this.pos -= 1
        //         const token = this.require(tokenTypesList.VARIABLE)
        //         return new IdentifierNode(this.pos, this.pos, token.text);
        //     }
        //     const token = this.require(tokenTypesList.STRINGSB)
        //     return new PropertyNode(this.pos, this.pos, token.text);
        // }


        // если нам встретился токен с неизвестным типом
        throw new TypeError(`Неизвестный тип токена на: ${this.pos} позиции`)
    }

    parseObject() {
        if (this.match([tokenTypesList.LCURLYBRACKET]) != null) {
            // while (this.pos) {
            //
            // }
            // const properties = new PropertyNode(this.pos, this.pos,)
            // return new ObjectExpressionNode(this.pos, this.pos);
        }
        throw new Error(
            `Ожидается оператор объекта на ${this.pos} позиции`
        );
    }
}
