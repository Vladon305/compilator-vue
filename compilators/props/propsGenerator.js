export function generatePropsCode(node) {
  // выполняем операцию на основе типа узла
  switch (node.type) {
    // если типом узла является `Program`, мы перебираем узлы в `body`
    // и прогоняем их через генератор кода,
    // объединяя с помощью символа перевода на новую строку
    case 'Program':
      return node.body.map(generatePropsCode).join('')

    case 'PropsKey':
      return node.value

    case 'BlokExpression':
      return node.value

    default:
      throw new TypeError(`Неизвестный тип узла: ${node.type}`)
  }
}
