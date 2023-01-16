import { LETTERS, WHITESPACE } from '../../lib/constants.js'
import { objectTokensGenerator } from '../../lib/expressions.js'

// const tokens = [
//   { type: 'propsKey', value: 'props' },
//   { type: 'blok', value: '{any}' }
// ]

export function tokenizeMethods(input) {
  // своего рода курсор (cursor) для отслеживания нашей позиции в коде
  let current = 0

  // массив токенов
  const tokens = []

  while (current < input.length) {
    // текущий символ
    let char = input[current]

    tokens.push(objectTokensGenerator())

    // если текущим символом является пробел,
    // просто инкрементируем курсор и
    // переходим на следующий цикл
    if (WHITESPACE.test(char) || char === ':') {
      current++
      continue
    }

    // выбрасываем исключение при наличии в строке кода символа неизвестного типа
    throw new TypeError(`Неизвестный символ: ${char}`)
  }

  // возвращаем массив токенов
  return tokens
}
