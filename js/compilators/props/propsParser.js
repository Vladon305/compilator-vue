export function parseProps(tokens) {
  // курсор
  let current = 0

  // в данном случае вместо цикла (`while`) мы используем рекурсию
  function walk() {
    // извлекаем текущий токен
    let token = tokens[current]

    // делаем то же самое для строки
    if (token.type === 'propsKey') {
      current++

      return {
        type: 'PropsKey',
        value: token.value
      }
    }

    if (token.type === 'blok') {
      token = tokens[current++]

      const node = {
        type: 'BlokExpression',
        value: token.value
      }

      // и возвращаем узел
      return node
    }

    // если нам встретился токен с неизвестным типом
    throw new TypeError(`Неизвестный тип токена: ${type}`)
  }

  // создаем AST с корневым (root) узлом типа `Program`
  const ast = {
    type: 'Program',
    body: []
  }

  while (current < tokens.length) {
    ast.body.push(walk())
  }

  // возвращаем AST
  return ast
}
