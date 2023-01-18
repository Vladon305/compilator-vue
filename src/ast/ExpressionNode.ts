export default class ExpressionNode {
    start?: number = 0;
    end?: number = 0;

    constructor(
        start?: number,
        end?: number,
    ) {
        this.start = start;
        this.end = end;
    }

    changeEnd(key: 'start' | 'end', value: number) {
        this[key] = value
    }

    changeValue(key: string, value: any) {
        //@ts-ignore
        this[key] = value
    }
}
