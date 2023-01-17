import { LETTERS, WHITESPACE } from '../../lib/constants.js'

// const tokens = [
//   { type: 'propsKey', value: 'props' },
//   { type: 'blok', value: '{any}' }
// ]

export function tokenizeProps(input) {
  // своего рода курсор (cursor) для отслеживания нашей позиции в коде
  let current = 0

  // массив токенов
  const tokens = []

  while (current < input.length) {
    // текущий символ
    let char = input[current]

    if (LETTERS.test(char)) {
      let value = ''

      while (LETTERS.test(char)) {
        value += char
        char = input[++current]
      }

      if (value === 'props') {
        tokens.push({
          type: 'propsKey',
          value
        })
      } else {
        tokens.push({
          type: 'objectKey',
          value
        })
      }

      continue
    }

    if (char === '{') {
      let value = ''

      while (current < input.length - 1) {
        value += char
        char = input[++current]
      }
      value += char
      // формируем токен и помещаем его в массив
      tokens.push({
        type: 'blok',
        value
      })

      // инкрементируем курсор (увеличиваем его значение на 1)
      current++

      // и переходим на следующий цикл итерации
      continue
    }

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
