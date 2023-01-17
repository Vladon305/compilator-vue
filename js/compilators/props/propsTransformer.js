import { traverseProps } from './propsTraverser.js'

export function transformProps(ast) {
  // новое AST
  const newAst = {
    type: 'Program',
    body: []
  }

  // я собираюсь немного схитрить. Мы будем использовать
  // свойство `context` родительского узла - узлы будут помещаться в их родительский контекст
  //
  // контекст - это ссылка *из* старого AST *на* новый
  ast._context = newAst.body

  // выполняем обход с AST и посетителем
  traverseProps(ast, {
    PropsKey: {
      // мы посещаем его на входе
      enter(node, parent) {
        // создаем новый одноименный узел
        // и помещаем его в родительский контекст

        parent._context.push({
          type: 'PropsKey',
          value: `const ${node.value} = `
        })
      }
    },

    // делаем то же самое для `BlokExpression`
    BlokExpression: {
      enter(node, parent) {
        parent._context.push({
          type: 'BlokExpression',
          value: `defineProps(${node.value})`
        })
      }
    }
  })

  // и возвращаем новое AST
  return newAst
}
