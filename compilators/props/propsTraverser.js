export function traverseProps(ast, visitor) {
  // данная функция перебирает массив и
  // для каждого его элемента вызывает функцию `traverseNode`
  function traverseArray(array, parent) {
    array?.forEach((child) => {
      traverseNode(child, parent)
    })
  }

  // данная функция принимает узел и его предка для их передачи методам посетителя
  function traverseNode(node, parent) {
    // извлекаем методы посетителя по типу узла
    const methods = visitor[node.type]

    // вызываем метод `enter` при его наличии
    if (methods && methods.enter) {
      methods.enter(node, parent)
    }

    // выполняем операцию на основе типа узла
    switch (node.type) {
      // на верхнем уровне у нас имеется узел типа `Program`
      // у этого узла имеется свойство `body` - массив узлов,
      // который мы передаем функции `traverseArray`
      //
      // поскольку `traverseArray`, в свою очередь, вызывает `traverseNode`,
      // мы выполняем рекурсивный обход дерева
      case 'Program':
        traverseArray(node.body, node)
        break

      // обходим параметры выражения вызова
      case 'PropsKey':
        node.params, node
        break

      case 'BlokExpression':
        node.params, node
        break

      // если нам встретился узел с неизвестным типом
      default:
        throw new TypeError(`Неизвестный тип узла: ${node.type}`)
    }

    // вызываем метод `exit` при его наличии
    if (methods && methods.exit) {
      methods.exit(node, parent)
    }
  }

  // запускаем обход, вызывая `traverseNode` с AST, но без предка,
  // поскольку на верхнем уровне AST не имеет родительских узлов
  traverseNode(ast, null)
}
