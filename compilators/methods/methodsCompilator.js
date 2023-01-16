import { tokenizeMethods } from './methodsTokenizator.js'

export function compileMethods(input) {
  const tokens = tokenizeMethods(input)
  console.log('tokens:', tokens)
  // const ast = parseProps(tokens)
  // const newAst = transformProps(ast)
  // const output = generatePropsCode(newAst)

  // return output
}

//methods compiller
//Key
//Value

//ObjectExpression

//methods: {
// key: (value) => {
// }
// }
//===========>
// const props = defineProps(ObjectExpression => val)
