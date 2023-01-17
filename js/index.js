"curly bracket";

import {objectTokensGenerator} from "./lib/expressions.js";

const WHITESPACE = /\s/;
const NUMBERS = /[0-9]/;
const LETTERS = /[a-z]/;

const tokens = [
	{type: "curlyBracket", value: "{"},
	{type: "name", value: "add"},
	{type: "number", value: "2"},
	{type: "paren", value: "("},
	{type: "name", value: "subtract"},
];

// const obj = { name: 'EssentialLink', props: { title: { type: String, required: true } } }

// const compilator = (code) => {
//   const js = new Function(['a'], code)
//   console.log(js)
//   const data = code.data
// }
// const visitor = {
//   NumberLiteral: {
//     enter(node, parent) {},
//     exit(node, parent) {}
//   },
//   StringLiteral: {
//     enter(node, parent) {},
//     exit(node, parent) {}
//   },
//   ObjectLiteral: {
//     enter(node, parent) {},
//     exit(node, parent) {}
//   },
//   ObjectKey: {
//     enter(node, parent) {},
//     exit(node, parent) {}
//   },
//   ObjectValue: {
//     enter(node, parent) {},
//     exit(node, parent) {}
//   },
//   FunctionExpression: {
//     enter(node, parent) {},
//     exit(node, parent) {}
//   },
//   FunctionParams: {
//     enter(node, parent) {},
//     exit(node, parent) {}
//   },
//   FunctionBody: {
//     enter(node, parent) {},
//     exit(node, parent) {}
//   },
// }

const originalAst = {
	type: "Program",
	body: [
		{
			type: "CallExpression",
			name: "add",
			params: [
				{
					type: "NumberLiteral",
					value: "2",
				},
				{
					type: "CallExpression",
					name: "subtract",
					params: [
						{
							type: "NumberLiteral",
							value: "4",
						},
						{
							type: "NumberLiteral",
							value: "2",
						},
					],
				},
			],
		},
	],
};

//Ast types
//ObjectExpression
//properties[]
//Property
//    key
//    value
//FunctionExpression
//  params[]
//  body{}
//ArrayExpression
//  elements[]

// преобразованное AST
const transformedAst = {
	type: "Program",
	body: [
		{
			type: "ExpressionStatement",
		},
	],
};

function tokenize(input) {
	// своего рода курсор (cursor) для отслеживания нашей позиции в коде
	let current = 0;
	
	// массив токенов
	const tokens = [];
	
	while (current < input.length) {
		// текущий символ
		let char = input[current];
		
		// если текущим символом является открывающая или закрывающая скобка
		if (char === "(" || char === ")") {
			// формируем токен и помещаем его в массив
			tokens.push({
				type: "paren",
				value: char,
			});
			
			// инкрементируем курсор (увеличиваем его значение на 1)
			current++;
			
			// и переходим на следующий цикл итерации
			continue;
		}
		
		// если текущим символом является пробел,
		// просто инкрементируем курсор и
		// переходим на следующий цикл
		if (WHITESPACE.test(char)) {
			current++;
			continue;
		}
		
		// следующим типом токена является число,
		// которое может состоять из любого количества символов
		// (add 123 456)
		//      ^^^ ^^^ числовые токены
		// мы хотим "захватывать" (capture) всю последовательность символов в качестве одного токена
		if (NUMBERS.test(char)) {
			// переменная для последовательности символов, из которых состоит число
			let value = "";
			
			// двигаемся по последовательности до достижения символа, который не является числом
			// помещаем каждое число в последовательность и увеличиваем значение курсора
			while (NUMBERS.test(char)) {
				value += char;
				char = input[++current];
			}
			
			// формируем токен и добавляем его в массив
			tokens.push({
				type: "number",
				value,
			});
			
			// переходим на следующий цикл
			continue;
		}
		
		// добавляем поддержку для строк, окруженных двойными кавычками (")
		// (concat "foo" "bar")
		//          ^^^   ^^^ строковые токены
		if (char === '"') {
			let value = "";
			
			// пропускаем открывающую двойную кавычку
			char = input[++current];
			
			// двигаемся по последовательности до достижения закрывающей двойной кавычки
			while (char !== '"') {
				value += char;
				char = input[++current];
			}
			
			// пропускаем закрывающую двойную кавычку
			char = input[++current];
			
			tokens.push({
				type: "string",
				value,
			});
			
			continue;
		}
		
		// последним типом является именованный токен (токен с типом `name`)
		// данный тип представляет токен, состоящий из последовательности символов,
		// которые не являются числом
		// в нашем случае речь идет о названиях функций
		// (add 2 4)
		//  ^^^ именованный токен
		if (LETTERS.test(char)) {
			let value = "";
			
			while (LETTERS.test(char)) {
				value += char;
				char = input[++current];
			}
			
			tokens.push({
				type: "name",
				value,
			});
			
			continue;
		}
		
		// выбрасываем исключение при наличии в строке кода символа неизвестного типа
		throw new TypeError(`Неизвестный символ: ${char}`);
	}
	
	// возвращаем массив токенов
	return tokens;
}

function parse(tokens) {
	// курсор
	let current = 0;
	
	// в данном случае вместо цикла (`while`) мы используем рекурсию
	function walk() {
		// извлекаем текущий токен
		let token = tokens[current];
		
		// если типом токена является число
		if (token.type === "number") {
			// инкрементируем курсор
			current++;
			
			// возвращаем узел AST типа `NumberLiteral` со значением токена
			return {
				type: "NumberLiteral",
				value: token.value,
			};
		}
		
		// делаем то же самое для строки
		if (token.type === "string") {
			current++;
			
			return {
				type: "StringLiteral",
				value: token.value,
			};
		}
		
		// если текущим токеном является открывающая скобка,
		// значит, далее будет название (вызов) функции
		if (token.type === "paren" && token.value === "(") {
			// пропускаем открывающую скобку
			token = tokens[++current];
			
			// создаем базовый узел типа `CallExpression`
			// со значением текущего токена в качестве названия,
			// поскольку за открывающей скобкой следует именованный токен
			const node = {
				type: "CallExpression",
				name: token.value,
				params: [],
			};
			
			// пропускаем именованный токен
			token = tokens[++current];
			
			/*
			 * перебираем токены, которые станут параметрами (`params`)
			 * выражения вызова (`CallExpression`), до достижения закрывающей скобки
			 *
			 * здесь в игру вступает рекурсия. Вместо того, чтобы пытаться парсить потенциально бесконечный
			 * вложенный набор узлов, мы используем рекурсию
			 *
			 * рассмотрим наш код на LIST. Мы видим, что
			 * параметрами `add` является число и вложенное `CallExpression`,
			 * которое также содержит числа
			 *
			 * (add 2 (subtract 4 2))
			 *
			 * вы также могли заметить, что в нашем массиве токенов имеется 2 закрывающие скобки
			 * [
			 *   { type: 'paren',  value: '(' },
			 *   { type: 'name',   value: 'add' },
			 *   { type: 'number', value: '2' },
			 *   { type: 'paren',  value: '(' },
			 *   { type: 'name',   value: 'subtract' },
			 *   { type: 'number', value: '4' },
			 *   { type: 'number', value: '2' },
			 *   { type: 'paren',  value: ')' }, <<< закрывающая скобка
			 *   { type: 'paren',  value: ')' }, <<< закрывающая скобка
			 * ]
			 *
			 * мы используем функцию `walk` для увеличения значения курсора и
			 * пропуска любых сложенных `CallExpression`
			 *
			 * перебираем токены до достижения токена с типом `paren` и значением закрывающей скобки
			 */
			while (
					token.type !== "paren" ||
					(token.type === "paren" && token.value !== ")")
					) {
				// вызываем функцию `walk`, которая возвращает узел
				// помещаем этот узел в `params`
				node.params.push(walk());
				token = tokens[current];
			}
			
			// пропускаем закрывающую скобку
			current++;
			
			// и возвращаем узел
			return node;
		}
		
		// если нам встретился токен с неизвестным типом
		throw new TypeError(`Неизвестный тип токена: ${token.type}`);
	}
	
	// создаем AST с корневым (root) узлом типа `Program`
	const ast = {
		type: "Program",
		body: [],
	};
	
	// вызываем `walk`, которая возвращает узлы AST
	// помещаем их в массив `ast.body`
	//
	// причина, по которой мы делаем это внутри цикла, состоит в том,
	// что в нашей программе `CallExpression` могут следовать одно за другим
	// вместо того, чтобы быть вложенными
	//
	// (add 2 2)
	// (subtract 4 2)
	//
	while (current < tokens.length) {
		ast.body.push(walk());
	}
	
	// возвращаем AST
	return ast;
}

function traverse(ast, visitor) {
	// данная функция перебирает массив и
	// для каждого его элемента вызывает функцию `traverseNode`
	function traverseArray(array, parent) {
		array.forEach((child) => {
			traverseNode(child, parent);
		});
	}
	
	// данная функция принимает узел и его предка для их передачи методам посетителя
	function traverseNode(node, parent) {
		// извлекаем методы посетителя по типу узла
		const methods = visitor[node.type];
		
		// вызываем метод `enter` при его наличии
		if (methods && methods.enter) {
			methods.enter(node, parent);
		}
		
		// выполняем операцию на основе типа узла
		switch (node.type) {
				// на верхнем уровне у нас имеется узел типа `Program`
				// у этого узла имеется свойство `body` - массив узлов,
				// который мы передаем функции `traverseArray`
				//
				// поскольку `traverseArray`, в свою очередь, вызывает `traverseNode`,
				// мы выполняем рекурсивный обход дерева
			case "Program":
				traverseArray(node.body, node);
				break;
				
				// обходим параметры выражения вызова
			case "CallExpression":
				traverseArray(node.params, node);
				break;
				
				// в случае с числом и строкой узлы для посещения отсутствуют,
				// поэтому мы их пропускаем
			case "NumberLiteral":
			case "StringLiteral":
				break;
				
				// если нам встретился узел с неизвестным типом
			default:
				throw new TypeError(`Неизвестный тип узла: ${node.type}`);
		}
		
		// вызываем метод `exit` при его наличии
		if (methods && methods.exit) {
			methods.exit(node, parent);
		}
	}
	
	// запускаем обход, вызывая `traverseNode` с AST, но без предка,
	// поскольку на верхнем уровне AST не имеет родительских узлов
	traverseNode(ast, null);
}

function transform(ast) {
	// новое AST
	const newAst = {
		type: "Program",
		body: [],
	};
	
	// я собираюсь немного схитрить. Мы будем использовать
	// свойство `context` родительского узла - узлы будут помещаться в их родительский контекст
	//
	// контекст - это ссылка *из* старого AST *на* новый
	ast._context = newAst.body;
	
	// выполняем обход с AST и посетителем
	traverse(ast, {
		// первый метод принимает `NumberLiteral`
		NumberLiteral: {
			// мы посещаем его на входе
			enter(node, parent) {
				// создаем новый одноименный узел
				// и помещаем его в родительский контекст
				parent._context.push({
					type: "NumberLiteral",
					value: node.value,
				});
			},
		},
		
		// делаем то же самое для `StringLiteral`
		StringLiteral: {
			enter(node, parent) {
				parent._context.push({
					type: "StringLiteral",
					value: node.value,
				});
			},
		},
		
		// далее следует `CallExpression`
		CallExpression: {
			enter(node, parent) {
				// начинаем с создания нового узла `CallExpression`
				// с вложенным `Identifier`
				let expression = {
					type: "CallExpression",
					callee: {
						type: "Identifier",
						name: node.name,
					},
					arguments: [],
				};
				
				// определяем новый контекст в оригинальном `CallExpression`,
				// который содержит ссылку на аргументы `expression`
				node._context = expression.arguments;
				
				// проверяем, является ли родительский узел `CallExpression`
				// если не является
				if (parent.type !== "CallExpression") {
					// оборачиваем `CallExpression` в `ExpressionStatement`
					// `CallExpression` верхнего уровня в `JS` являются инструкциями
					expression = {
						type: "ExpressionStatement",
						expression,
					};
				}
				
				// наконец, мы помещаем наше (возможно, обернутое в `ExpressionStatement`) `CallExpression` в родительский контекст
				parent._context.push(expression);
			},
		},
	});
	
	// и возвращаем новое AST
	return newAst;
}

function generatePropsCode(node) {
	// выполняем операцию на основе типа узла
	switch (node.type) {
			// если типом узла является `Program`, мы перебираем узлы в `body`
			// и прогоняем их через генератор кода,
			// объединяя с помощью символа перевода на новую строку
		case "Program":
			return node.body.map(generatePropsCode).join("\n");
			
			// для `ExpressionStatement` мы вызываем генератор кода для вложенного `expression`
			// и добавляем точку с запятой
		case "ExpressionStatement":
			return `${generatePropsCode(node.expression)};`;
			
			// для `CallExpression` мы формируем `callee` (вызываемого)
			// добавляем открывающую скобку,
			// перебираем узлы из массива `arguments`,
			// пропускаем их через генератор, разделяем их запятыми
			// и добавляем закрывающую скобку
		case "CallExpression":
			return `${generatePropsCode(node.callee)}(${node.arguments
					.map(generatePropsCode)
					.join(", ")})`;
			
			// для `Identifier` мы просто возвращаем название узла
		case "Identifier":
			return node.name;
			
			// возвращаем значение узла
		case "NumberLiteral":
			return node.value;
			
			// возвращаем значение узла, обернутое в двойные кавычки
		case "StringLiteral":
			return `"${node.value}"`;
		
		default:
			throw new TypeError(`Неизвестный тип узла: ${node.type}`);
	}
}

function compile(input) {
	const tokens = tokenize(input);
	const ast = parse(tokens);
	const newAst = transform(ast);
	const output = generatePropsCode(newAst);
	
	return output;
}

//props compiller
//Key
//Value

//ObjectExpression

//props: {
// key: value
// }
//===========>
// const props = defineProps(ObjectExpression => val)

const val = "{ title: { type: String, required: true }, }";

const token = objectTokensGenerator(val);
console.log("token", token);

const props = {
	title: {
		type: String,
		required: true,
	},
	link: {
		type: String,
		default: "/",
	},
	messageType: {
		type: String,
		required: true,
		validator: (val) => ["income", "outcome", "draft", "basket"].includes(val),
	},
};
