import Lexer from "./Lexer";
import Parser from "./parser";

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

const code2 = `{
    name: 'a',
    }`

const lexer = new Lexer(code2);

lexer.lexAnalysis();


const parser = new Parser(lexer.tokenList);

const rootNode = parser.parseCode();
console.log(rootNode);

// parser.run(rootNode);
