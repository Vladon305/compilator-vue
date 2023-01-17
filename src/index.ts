import Lexer from "./Lexer";
import Parser from "./Parser";

const code = `{
    name: '',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      withFlat: {
        type: Boolean,
        default: true
      },
      withPostalCode: {
        type: Boolean,
        default: false
      }
    },
    data: {
      useFias: true,
      address: {
        postalcode: '',
        fulladdress: '',
        addressObject: {id: '', name: ''},
        houseObject: {id: '', name: ''},
        flat: ''
    },
  }
}`;

const lexer = new Lexer(code);

lexer.lexAnalysis();

console.log(lexer.tokenList);

// const parser = new Parser(lexer.tokenList);

// const rootNode = parser.parseCode();

// parser.run(rootNode);
