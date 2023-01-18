import TokenType from "./TokenType";

export default class Token {
    type: TokenType;
    text: string;
    pos: number;

    constructor(type: TokenType, text: string, pos: number) {
        this.type = type;
        this.text = text;
        this.pos = pos;
    }

    getType() {
        return this.type;
    }

    setType(type: TokenType) {
        this.type = type;
    }

    getText() {
        return this.text;
    }

    setText(text: string) {
        this.text = text;
    }

    public toString(): string {
        return this.type + " " + this.text;
    }
}
