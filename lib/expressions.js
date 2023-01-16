import { LETTERS, NUMBERS, WHITESPACE } from './constants.js'

export function objectTokensGenerator(input) {
  let current = 0

  // массив токенов
  const tokens = []

  while (current < input.length) {
    // текущий символ
    let char = input[current]

    console.log('char', char)
    if (LETTERS.test(char)) {
      let value = ''

      while (LETTERS.test(char)) {
        value += char
        char = input[++current]
      }

      tokens.push({
        type: 'key',
        value
      })

      continue
    }

    if (char === '{') {
      // формируем токен и помещаем его в массив
      tokens.push({
        type: 'objectExpressionStart',
        value: current
      })

      // инкрементируем курсор (увеличиваем его значение на 1)
      current++

      // и переходим на следующий цикл итерации
      continue
    }

    if (char === '}') {
      // формируем токен и помещаем его в массив
      tokens.push({
        type: 'objectExpressionEnd',
        value: current
      })

      // инкрементируем курсор (увеличиваем его значение на 1)
      current++

      // и переходим на следующий цикл итерации
      continue
    }

    if (char === '"') {
      let value = ''

      // пропускаем открывающую двойную кавычку
      char = input[++current]

      // двигаемся по последовательности до достижения закрывающей двойной кавычки
      while (char !== '"') {
        value += char
        char = input[++current]
      }

      // пропускаем закрывающую двойную кавычку
      char = input[++current]

      tokens.push({
        type: 'string',
        value
      })

      continue
    }

    if (char === ':') {
      let type
      tokens.push({
        type: 'colon',
        value: char
      })

      console.log('char1', char)
      console.log('current', current)
      char = input[++current]

      console.log('char1', char)
      console.log('current', current)

      // let value = ''

      // while (LETTERS.test(char)) {
      //   value += char
      //   char = input[++current]
      // }

      // while (char !== ',' || char !== '') {
      //   if (WHITESPACE.test(char)) {
      //     current++
      //     continue
      //   }

      //   if (char === '{') {
      //     // формируем токен и помещаем его в массив
      //     tokens.push({
      //       type: 'objectExpressionStart',
      //       value: current
      //     })

      //     // инкрементируем курсор (увеличиваем его значение на 1)
      //     current++

      //     // и переходим на следующий цикл итерации
      //     continue
      //   }

      //   if (char === '}') {
      //     // формируем токен и помещаем его в массив
      //     tokens.push({
      //       type: 'objectExpressionEnd',
      //       value: current
      //     })

      //     // инкрементируем курсор (увеличиваем его значение на 1)
      //     current++

      //     // и переходим на следующий цикл итерации
      //     continue
      //   }

      //   while (char !== ',') {
      //     value += char
      //     char = input[+current]
      //   }
      //   console.log('a')

      //   if (LETTERS.test(char)) {
      //     while (LETTERS.test(char)) {
      //       value += char
      //       char = input[++current]
      //     }
      //     tokens.push({
      //       type: 'value',
      //       value
      //     })
      //     current++

      //     continue
      //   }

      //   current++
      //   continue
      // }
    }

    if (char === ',') {
      tokens.push({
        type: 'comma',
        value: char
      })
      current++

      continue
    }

    if (WHITESPACE.test(char)) {
      current++
      continue
    }

    // выбрасываем исключение при наличии в строке кода символа неизвестного типа
    throw new TypeError(`Неизвестный символ: ${char}`)
  }

  return tokens
}
