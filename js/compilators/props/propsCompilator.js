import { generatePropsCode } from './propsGenerator.js'
import { parseProps } from './propsParser.js'
import { tokenizeProps } from './propsTokenizator.js'
import { transformProps } from './propsTransformer.js'

export function compileProps(input) {
  const tokens = tokenizeProps(input)
  const ast = parseProps(tokens)
  const newAst = transformProps(ast)
  const output = generatePropsCode(newAst)

  return output
}
