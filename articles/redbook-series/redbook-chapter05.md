---
title: 红宝书系列（五）基本引用类型
date: 2022-04-26
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h1nij4egf8j20p00gtq3m.jpg
---

引用值（或者对象）是某个特定**引用类型**的实例。在 ECMAScript 中，引用类型是把数据和功能组织到一起的结构，经常被人错误地称为“类”。虽然从技术上讲 JavaScript 是一门面向对象语言，但 ECMAScript 缺少传统面向对象编程语言所具备的某些基本结构，包括类和接口。引用类型有时候也被称为**对象定义**，因为它们描述了自己的对象应有的属性和方法。

> 引用类型虽然有点像”类“，但跟类并不是一个概念。

对象被认为是某个特定引用类型的**实例**。新对象通过使用`new`操作符后跟一个**构造函数**（constructor）来创建。构造函数就是用来创建新对象的函数，例如：

```jsx
const now = new Date()
```

这行代码创建了引用类型`Date`的一个新实例，并将它保存在变量`now`中。`Date()`在这里就是构造函数，它负责创建一个只有默认属性和方法的简单对象。ECMAScript 提供了很多像`Date`这样的原生引用类型，帮助开发者实现常见的任务。

# `Date`

ECMAScript 的`Date`类型参考了 Java 早期版本中的`java.util.Date`。为此，`Date`类型将日期保存为自协调世界时（UTC，Universal Time Coordinated）时间 1970 年 1 月 1 日午夜（零时）至今所经过毫秒数。使用这种存储格式，`Date`类型可以精确表示 1970 年 1 月 1 日至之后 285616 年的日期。

要创建日期对象，就使用`new`操作符来调用`Date`构造函数：

```jsx
const now = new Date()
```

在不给`Date`构造函数传参数的情况下，创建的对象将保存当前的日期和时间。要基于其他日期和时间创建日期对象，必须传入其毫秒表示（UNIX 纪元 1970 年 1 月 1 日午夜之后的毫秒数）。ECMAScript 为此提供了两个辅助方法：`Date.parse()`和`Date.UTC()`。

`Date.parse()`方法接收一个表示日期的字符串参数，尝试将这个字符串转换为表示该日期的毫秒数。

> 注意：由于浏览器兼容性问题，强烈建议不要使用`Date.parse()`和`Date`构造函数解析字符串来构造时间，见[MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date#%E4%BE%8B%E5%AD%90)。

```jsx
const someData = new Date(Date.parse('May 23, 2019'))

// 与上面的代码等价
const someDate = new Date('May 23, 2019')
```

如果传给`Date.parse()`的字符串并不表示日期，则该方法返回`NaN`。如果直接把表示日期的字符串传给`Date`构造函数，那么`Date`会在后台调用`Date.parse()`。

`Date.UTC()`方法也返回日期的毫秒表示，但是用的是跟`Date.parse()`不同的信息来生成这个值。传给`Date.UTC()`的参数是年、零起点月数（1 月是 0，2 月是 1，类推）、日（1 ～ 31）、时（0 ～ 23）、分、秒和毫秒。参数里面只有年和月是必须的。不提供日，则默认为 1 日，其他参数的默认值都是 0。

```jsx
const y2k = new Date(Date.UTC(2000, 0))

const allFives = new Date(Date.UTC(2005, 4, 5, 17, 55, 55))
```

ECMAScript 还提供了`Date.now()`方法，返回表示方法执行日期和时间的毫秒数。这个方法可以方便地用在代码分析中：

```jsx
// 起始时间
const start = Date.now()

// 调用函数
doSomething()

// 结束时间
const stop = Date.now()
```

## 继承的方法

和其他类型一样，`Date`类型重写了`toLocaleString()`、`toString()`和`valueOf()`方法。但与其他类型不同，重写后这些方法的返回值不一样。`Date`类型的`toLocaleString()`方法返回与浏览器运行的本地环境一致的日期和时间。这通常意味着格式中包含针对时间的 AM 或 PM，但不包含时区信息。`toString()`方法通常返回带时区信息的日期和时间，而时间也是以 24 小时制（0 ～ 23）表示的。

由于浏览器对这两个方法的返回值可能不尽相同。意味着`toLocaleString()`和`toString()`可能只对调试有用，不能用于显示。

`Date`类型的`valueOf()`方法被重写后返回日期的毫秒表示。因此，操作符（例如小于号和大于号）可以直接使用它的返回值。

```jsx
const date1 = new Date(2019, 0, 1) // 2019年1月1日
const date2 = new Date(2019, 1, 1) // 2019年2月1日

console.log(date1 < date2) // true
console.log(date1 > date2) // false
```

这也是确保日期先后的一个简单方式。

## 日期格式化方法

`Date`类型有几个专门用于格式化日期的方法，它们都返回字符串。

- `toDateString()`显示日期中的星期、月、日、年。
- `toTimeString()`显示日期中的时、分、秒和时区。
- `toLocaleDateString()`显示日期中的星期、月、日、年。
- `toLocaleTimeString()`显示日期中的时、分、秒。
- `toUTCString()`显示完整的 UTC 日期。

这些方法的输出与`toLocaleString()`和`toString()`一样，会因浏览器而异。因此不能用于在用户界面上一致地显示日期。

## 日期/时间组件方法

`Date`类型提供了大量方法直接涉及取得或设置日期值的特定部分。见[MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date#%E5%AE%9E%E4%BE%8B%E6%96%B9%E6%B3%95)

# `RegExp`

ECMAScript 通过`RegExp`类型支持正则表达式。正则表达式使用类似 Perl 的简洁语法来创建：

```jsx
const expression = /pattern/flags
```

这个正则表达式的`pattern`模式可以是任何简单或负责的正则表达式，包括字符类、限定符、分组、向前查找和反向引用。每个正则表达式可以带零个或多个`flags`标记，用于控制正则表达式的行为。

- `g`：全局模式，表示查找字符串的全部内容，而不是找到第一个匹配内容就结束。
- `i`：不区分大小写，表示在查找匹配时忽略`pattern`和字符串的大小写。
- `m`：多行模式，表示查找到一行文本末尾时会继续查找。
- `y`：粘附模式，表示只查找从`lastIndex`开始及之后的字符串。
- `u`：Unicode 模式，启用 Unicode 匹配。
- `s`：`dotAll`模式，表示元字符`.`匹配任何字符（包括`\n`或`\r`）。

使用不同模式和标记可创建各种正则表达式，例如。

```jsx
const pattern1 = /at/g

const pattern2 = /[bc]at/i

// 匹配所有at结尾的三字符组合，忽略大小写
const pattern3 = /.at/gi
```

与其他语言中的正则表达式类似，所有**元字符**在模式中也必须转义。

```
( [ { \ ^ $ | } ] ) ? * + .
```

元字符在正则表达式中都有一种或多种特殊功能，所以要匹配上面这些字符本身，就必须使用反斜杠来转义。

```jsx
const pattern1 = /[bc]at/i

const pattern2 = /\[bc\]at/i

const pattern3 = /.at/gi

const pattern4 = /\.at/gi
```

前面的正则表达式都是用字面量定义的。正则表达式也可以使用`RegExp`构造函数来创建，它接收两个参数：模式字符串和（可选的）标记字符串。任何使用字面量定义的正则表达式也可以通过构造函数来创建。

```jsx
const pattern1 = /[bc]at/i

const pattern2 = new RegExp('[bc]at', 'i')
```

这里的`pattern1`和`pattern2`是等效的正则表达式。注意，`RegExp`构造函数的两个参数都是字符串。因为`RegExp`的模式参数是字符串，所以在某些情况下需要**二次转义**。所有元字符都必须进行二次转义，包括转义字符序列。

> 二次转义显然比直接用字面量麻烦，因此最好不要这样（给构造函数传模式参数和标记参数）构造正则表达式实例。

此外，使用`RegExp`也可以给予已有的正则表达式实例，并可选择地修改它们的标记。

```jsx
const reg1 = /cat/g
console.log(reg1) // "/cat/g"

const reg2 = new RegExp(re1)
console.log(reg2) // "/cat/g"

const reg3 = new RegExp(re1, 'i')
console.log(re3) // "/cat/i"
```

## `RegExp`实例属性

每个`RegExp`实例都有下列属性，提供有关模式的各方面信息。

- `global`：布尔值，表示是否设置了`g`标记。
- `ignoreCase`：布尔值，表示是否设置了`i`标记。
- `unicode`：布尔值，表示是否设置了`u`标记。
- `sticky`：布尔值，表示是否设置了`y`标记。
- `lastIndex`：整数，表示在源字符串中下一次搜索的开始位置，始终从 0 开始。
- `multiline`：布尔值，表示是否设置了`m`标记。
- `dotAll`：布尔值，表示是否设置了`s`标记。
- `source`：正则表达式的字面量字符串（不是传给构造函数的模式字符串），没有开头和结尾的斜杠。
- `falgs`：正则表达式的标记字符串。始终以字面量而非传入构造函数的字符串模式形式返回（没有前后斜杠）。

通过这些属性可以全面了解正则表达式的信息，但是实际开发中用得不多，因为模式声明中包含了这些信息。

## `RegExp`实例方法

`RegExp`实例的主要方法是`exec()`，主要用于配合捕获组使用。这个方法只接收一个参数，即要应用模式的字符串。如果找到了匹配项，则返回包含第一个匹配信息的数组；如果没有找到匹配项，则返回`null`。返回的数组虽然是`Array`的实例，但包含两个额外的属性：`index`和`input`。`index`是字符串中匹配模式的起始位置，`input`是要查找的字符串。这个数组的第一个元素是匹配整个模式的字符串，其他元素是与表达式中的捕获组匹配的字符串。如果模式中没有捕获组，则数组只包含一个元素。

```jsx
const text = 'mom and dad and baby'
const pattern = /mom( and dad( and baby)?)?/gi

const matches = pattern.exec(text)
console.log(matches.index) // 0
console.log(matches.input) // "mom and dad and baby"
console.log(matches[0]) // "mom and dad and baby"
console.log(matches[1]) // " and dad and baby"
console.log(matches[2]) // " and baby"
```

如果模式设置了全局标记，则每次调用`exec()`方法会返回一个匹配的信息。如果没有设置全局标记，则无论对同一个字符串调用多少次`exec()`，也只会返回第一个匹配的信息。

```jsx
const text = 'cat, bat, sat, fat'
const pattern = /.at/

const matches = pattern.exec(text)
console.log(matches.index) // 0
console.log(matches[0]) // cat
console.log(pattern.lastIndex) // 0

matches = pattern.exec(text)
console.log(matches.index) // 0
console.log(matches[0]) // cat
console.log(pattern.lastIndex) // 0
```

上面例子中的模式没有设置全局标记，因此调用`exec()`只返回第一个匹配项`"cat"`。`lastIndex`在非全局模式下始终不变。

如果在这个模式上设置了`g`标记，则每次调用`exec()`都会在字符串中向前搜索下一个匹配项。

```jsx
const text = 'cat, bat, sat, fat'
const pattern = /.at/g
let matches = pattern.exec(text)
console.log(matches.index) // 0
console.log(matches[0]) // cat
console.log(pattern.lastIndex) // 3

matches = pattern.exec(text)
console.log(matches.index) // 5
console.log(matches[0]) // bat
console.log(pattern.lastIndex) // 8

matches = pattern.exec(text)
console.log(matches.index) // 10
console.log(matches[0]) // sat
console.log(pattern.lastIndex) // 13
```

这次模式设置了全局标记，因此每次调用`exec()`都会返回字符串中的下一个匹配项，直到搜索到字符串末尾。注意模式的`lastIndex`属性每次都会变化。在全局匹配模式下，每次调用`exec()`都会更新`lastIndex`值，以反映上次匹配的最后一个字符的索引。

如果模式设置了粘附标记`y`，则每次调用`exec()`就只会在`lastIndex`的位置上寻找匹配项。粘附标记覆盖全局标记。

正则表达式的另一个方法是`test()`，接收一个字符串参数。如果输入的文本与模式匹配，则参数返回`true`，否则返回`false`。这个方法适用于只想测试模式是否匹配，而不需要实际匹配内容的情况。`test()`经常用在`if`语句中。

```jsx
const text = '000-00-0000'
const pattern = /\d{3}-\d{2}-d{4}/

if (pattern.test(text)) {
  console.log('The pattern was matched.')
}
```

在这个例子中，正则表达式用于测试特定的数值序列。如果输入的文本与模式匹配，则显示匹配成功的消息。这个用法常用于验证用户输入，此时我们只在乎输入是否有效，不关心为什么无效。

无论正则表达式是怎么创建的，继承的方法`toLocaleString()`和`toString()`都返回正则表达式的字面量表示。

```jsx
const pattern = new RegExp('\\[bc\\]at', 'gi')
console.log(pattern.toString()) // /\[bc\]at/gi
console.log(pattern.toLocaleString()) // /\[bc\]at/gi
```

这里的模式是通过`RegExp`构造函数创建的，但`toLocaleString()`和`toString()`返回的都是其字面量的形式。

> 正则表达式的`valueOf()`方法返回正则表达式本身。

## `RegExp`构造函数的属性

`RegExp`构造函数本身也有几个属性。（在其他语言中，这种属性被称为静态属性。）这些属性适用于作用域中的所有正则表达式，而且会根据最后执行的正则表达式操作而变化。

> 注意，`RegExp`构造函数的所有属性都没有任何 Web 标准出处，因此不要在代码中使用它们。

## 模式局限

虽然 ECMAScript 对正则表达式的支持有了长足的进步，但仍然缺少 Perl 语言中的一些高级特性。例如`\A`和`\Z`锚、联合及交叉类、原子组、`x`（忽略空格）匹配模式、条件式匹配、正则表达式注释等。虽然还有这些局限，但 ECMAScript 的正则表达式已经非常强大，可以用于大多数模式匹配任务。

# 原始包装值类型

为了方便操作原始值，ECMAScript 提供了三种特殊的引用类型：`Boolean`、`Number`和`String`。这些类型具有本章介绍的其他引用类型一样的特点，但也具有与各自原始类型对应的特殊行为。每当用到某个原始值的方法或属性时，后台都会创建一个相应原始包装类型的对象，从而暴露出操作原始值的各种方法。

```jsx
const s1 = 'some text'
const s2 = s1.substring(2)
```

在这里，`s1`是一个包含字符串的变量，它是一个原始值。第二行紧接着在`s1`上调用了`substring()`方法，并把结果保存在`s2`中。我们知道，原始值本身不是对象，因此在逻辑上不应该有方法。而实际上这个例子又确实按照预期运行了。这是因为后台进行了很多处理，从而实现了上述操作。具体来说，当第二行访问`s1`时，是以读模式访问的，也就是要从内存中读取保存变量的值。在以读模式访问字符串值的任何时候，后台都会执行以下 3 步：

1. 创建一个`String`类型的实例
2. 调用实例上的特定方法
3. 销毁实例

可以把这 3 步想象成执行了如下 3 行 ECMAScript 代码：

```jsx
const s1 = new String('Some text')
const s2 = s1.substring(2)
s1 = null
```

这种行为可以让原始值拥有对象行为。对布尔值和数值而言，以上 3 步也会在后台发生，只不过使用的是`Boolean`和`Number`包装类型而已。

引用类型与原始包装类型的主要区别在于对象的生命周期。在通过`new`实例化引用类型后，得到的实例会在离开作用域时被销毁，而自动创建的原始包装对象则只存在于访问它的那行代码执行期间。这意味着不能在运行时给原始值添加属性和方法。

```jsx
const s1 = 'some text'
s1.color = 'red'
console.log(s1.color) // undefined
```

这里的第二行代码尝试给字符串`s1`添加了一个`color`属性。可是，第三行代码访问`color`属性时，它却不见了。原因是第二行代码运行时会临时创建一个`String`对象，而当第三行代码执行时，这个对象已经被销毁了。实际上，第三行代码在这里创建了自己的`String`对象，但这个对象没有`color`属性。

可以显式地使用`Boolean`、`Number`和`String`构造函数创建原始值包装对象。不过应该在确实必要时再这么做，否则容易让开发者迷惑，分不清它们到底是原始值还是引用值。在原始值包装类型的实例上调用`typeof`会返回`"object"`，所有原始值包装对象都会转换为布尔值`true`。

另外，`Object`构造函数作为一个工厂方法，能够根据传入的类型返回相应原始值包装类型的实例，例如：

```jsx
const obj = new Object('some text')
console.log(obj instanceof String) // true
```

如果传给`Object`的是字符串，则会返回一个`String`的实例。如果是数值，则会创建`Number`的实例。布尔值则会得到`Boolean`的实例。

注意，使用`new`调用原始包装类型的构造函数，与调用同名的转型函数并不一样。例如：

```jsx
let value = '25'
let number = Number(value) // 转型函数
console.log(typeof number) // "number"
let obj = new Number(value) // 构造函数
console.log(obj) // "object"
```

在这个例子中，变量`number`中保存的是一个值为 25 的原始数值，而变量`obj`中保存的是一个`Number`实例。

虽然不推荐显式创建原始值包装类型的实例，但它们对于操作原始值的功能是很重要的。每个原始值包装类型都有相应的一套方法来方便数据操作。

## `Boolean`

`Boolean`是对应布尔值的引用类型。要创建一个`Boolean`对象，就使用`Boolean`构造函数并传入`true`或`false`，如下所示：

```jsx
const booleanObject = new Boolean(true)
```

`Boolean`的实例会重写`valueOf()`方法，返回一个原始值`true`或`false`。`toString()`方法被调用时也会被覆盖，返回字符串`"true"`或`"false"`。不过，`Boolean`对象在 ECMAScript 中用得很少。不仅如此，它们还容易引起误会。因为`new Boolean(false)`实际上转化为布尔值后是一个`true`值。`typeof`操作符对原始值返回`boolean`，但对引用值返回`"object"`。

理解原始布尔值和`Boolean`对象之间的区别非常重要，强烈建议永远不要使用`Boolean`对象。

## `Number`

`Number`是对应数值的引用类型。要创建一个`Number`对象，就使用`Number`构造函数并传入一个数值。

```jsx
const numberObject = new Number(10)
```

与`Boolean`类型一样，`Number`类型重写了`valueOf()`、`toLocaleString()`和`toString()`方法。`valueOf()`方法返回`Number`对象表示的原始数值，另外两个方法返回数值字符串。`toString()`方法可选地接收一个表示基数的参数，并返回相应基数形式的数值字符串。

```jsx
const num = 10
console.log(num.toString()) // "10"
console.log(num.toString(2)) // "1010"
console.log(num.toString(8)) // "12"
console.log(num.toString(10)) // "10"
console.log(num.toString(16)) // "a"
```

除了继承的方法，`Number`类型还提供了几个用于将数值格式化为字符串的方法。

`toFixed()`方法返回包含执行小数点位数的数值字符串。

```jsx
const num = 10
console.log(num.toFixed(2)) // "10.00"
```

这里的`toFixed()`方法接收了参数`2`，表示返回的数值字符串要包含两位小数。结果返回值为`10.00`，小数位填充了 0。如果数值本身的小数位超过了参数指定的位数，则四舍五入到最接近的小数位。

```jsx
const num = 10.005
console.log(num.toFixed(2)) // "10.01"
```

`toFixed()`自动舍入的特点可以用于处理货币。不过要注意的是，多个浮点数值的数学计算不一定得到精确的结果。

另一个用于格式化数值的方法是`toExponential()`，返回以科学记数法（也称为指数记数法）表示的数值字符串。与`toFixed()`一样，`toExponential()`也接收一个参数，表示结果中小数的位数。

```jsx
const num = 10
console.log(num.toExponential(1)) // "1.0e+1"
```

这段代码的输出为`"1.0e+1"`。一般来说这么小的数不需要表示为科学记数法形式。如果想得到数值最适当的形式，那么可以使用`toPrecision()`。

`toPrecision()`方法会根据情况返回最合理的输出结果。可能是固定长度，也可能是科学记数法形式。这个方法接收一个参数，表示结果中数字的总位数（不包含指数）。

```jsx
const num = 99
console.log(num.toPrecision(1)) // "1e+2"
console.log(num.toPrecision(2)) // "99"
console.log(num.toPrecision(3)) // "99.0"
```

在这个例子中，首先要用 1 位数字表示数值 99，得到`"1e+2"`，也就是 100。因为 99 不能只用 1 位数字来精确表示，所以这个方法就将它舍入为 100，这样就可以只用 1 位数字（及其科学记数法形式）来表示了。

与`Boolean`对象类似，`Number`对象也为数值提供了重要能力。但是考虑到两者存在同样的潜在问题，因此并不建议直接实例化`Number`对象。

ES6 新增了`Number.isInteger()`方法，用于辨别一个数值是否保存为整数。

```jsx
console.log(Number.isInteger(1)) // true
console.log(Number.isInteger(1.0)) // true
console.log(Number.isInteger(1.01)) // false
```

IEEE 754 数值格式有一个特殊的数值范围，在这个范围内二进制可以表示一个整数值。这个数值范围从`Number.MIN_SAFE_INTEGER`（-2^53 + 1）到`Number.MAX_SAFE_INTEGER`（2^53 - 1）。对超出这个范围的数值，即使尝试保存为整数，IEEE 754 编码格式也意味着二进制可能会表示一个完全不同的数值。为了鉴别整数是否在这个范围内，可以使用`Number.isSafeInteger()`方法。

```jsx
console.log(Number.isSafeInteger(-1 * 2 ** 53)) // false
console.log(Number.isSafeInteger(-1 * 2 ** 53 + 1)) // true
console.log(Number.isSafeInteger(2 ** 53)) // false
console.log(Number.isSafeInteger(2 ** 53 - 1)) // true
```

## `String`

`String`是对应字符串的引用类型。要创建一个`String`对象，使用`String`构造函数并传入一个数值。

```jsx
const stringObject = new String('hello world')
```

`String`对象的方法可以在所有字符串原始值上调用。3 个继承的方法`valueOf()`、`toLocaleString()`和`toString()`都返回对象的原始字符串值。

每个`String`对象都有一个`length`属性，表示字符串中字符的数量。

```jsx
const stringValue = 'Hello World'
console.log(stringValue.length) // "11"
```

注意，即使字符串中包含双字节字符（而不是单字节的 ASCII 字符），也仍然会按单字符来记数。

`String`类型提供了很多方法来解析和操作字符串。

### JavaScript 字符

JavaScript 字符由 16 位**码元**（code unit）组成。对于多数字符来说，每 16 位码元对应一个字符。换句话说，字符串中的`length`属性表示字符串包含多少 16 位码元。

```jsx
const message = 'abcde'
console.log(message.length) // 5
```

此外，`charAt()`方法返回给定索引位置的字符，由传给方法的整数参数指定。具体来说，这个方法查找指定索引位置的 16 位码元，并返回该码元对应的字符。

```jsx
const message = 'abcde'

console.log(message.charAt(2)) // "c"
```

JavaScript 字符串使用了两种 Unicode 编码混合的策略：UCS-2 和 UTF-16。对于可以采用 16 位编码的字符（U+0000 ～ U+FFFF），这两种编码实际上是一样的。

使用`charCodeAt()`方法可以查看指定码元的字符编码。这个方法返回索引位置的码元值，索引以整数指定。

```jsx
const message = 'abcde'

console.log(message.charCodeAt(2)) // 99

console.log(99 === 0x63) // true
```

`fromCharCode()`方法用于根据给定的 UTF-16 码元创建字符串中的字符。这个方法可以接受任意多个数值，并返回将所有数值对应的字符拼接起来的字符串。

```jsx
console.log(String.fromCharCode(0x61, 0x62, 0x63, 0x64, 0x65)) // "abcde"

// Ox0061 === 97
// 0x0062 === 98
// 0x0063 === 99
// 0x0064 === 100
// 0x0065 === 101

console.log(String.fromCharCode(97, 98, 99, 100, 101)) // "abcde"
```

对于 U+0000~U+FFFF 范围内的字符，`length`、`charAt()`、`charCodeAt()`和`fromCharCode()`返回的结果都跟预期是一样的。这是因为在这个范围内，每个字符都是用 16 位表示的，而这几个方法也都基于 16 位码元完成操作。只要字符编码大小与码元大小一一对应，这些方法就能如期工作。

这个对应关系在扩展到 Unicode 增补平面时就不成立了。问题很简单，即 16 位只能唯一标识 65536 个字符。这对于大多数语言字符集是足够了，在 Unicode 中称为**基本多语言平面**（BMP）。为了表示更多的字符，Unicode 采用了一个策略，即每个字符使用另外 16 位去选择一个**增补平面**。这种每个字符使用两个 16 位码元的策略称为**代理对**。

在涉及增补平面的字符串时，前面讨论的字符串方法就会出问题。

```jsx
const str = '😊'

console.log(str.length) // 2

console.log(str.charAt(0)) // �

console.log(str.charCodeAt(0)) // 55357

console.log(String.fromCodePoint(0x1f60a)) // 😊

console.log(String.fromCharCode(97, 98, 55357, 56842, 100, 101)) // ab😊de
```

这些方法仍然将 16 位码元当作一个字符，事实上索引 0 和 1 对应的码元应该被看成一个代理对，只对应一个字符。`fromCharCode()`方法仍然返回正确的结果，因为它实际上是基于提供的二进制表示直接组合成字符串。浏览器可以正确解析代理对（由两个码元组成），并正确地将其识别为一个 Unicode 笑脸字符。

为正确解析既包含单码元字符又包含代理对字符的字符串，可以使用`codePointAt()`来代替`charCodeAt()`。跟使用`charCodeAt()`时类似，`codePointAt()`接收 16 位码元的索引并返回该索引位置上的码点（code point）。**码点**是 Unicode 中一个字符的完整标识。例如`"c"`的码点是 0x0063，而`"😊"`的码点是 0x1f60a。码点可能是 16 位，也可能是 32 位。而`codePointAt()`方法可以从指定码元位置识别完整的码点。

注意如果传入的码元并非代理对的开头，就会返回错误的码点。这种错误只有检测单个字符串的时候才会出现，可以通过从左到右按正确的码元数遍历字符串来规避。迭代字符串可以智能地识别代理对的码点。

```jsx
console.log([...'ab😊de']) // ["a", "b", "😊", "d", "e"]
```

与`charCodeAt()`有对应的`codePointAt()`一样，`fromCharCode()`也有一个对应的`fromCodePoint()`。这个方法接收任意数量的码点，返回对应字符拼接起来的字符串。

```jsx
console.log(String.fromCharCode(97, 98, 55357, 56842, 100, 101)) // ab😊de
console.log(String.fromCodePoint(97, 98, 128522, 100, 101)) // ab😊de
```

### `normalize()`方法

某些 Unicode 字符可以有多种编码方式。有的字符既可以通过一个 BMP 字符表示，也可以通过一个代理对表示。为了解决这个问题，Unicode 提供了 4 种规范化形式，可以将类似上面的字符串规范化为一致的格式，无论底层字符的代码是什么。可以使用`normalize()`方法对字符串应用规范化形式，使用时需要传入表示哪种形式的字符串：`"NFD"`、`"NFC"`、`"NFKD"`或`"NFKC"`。

### 字符串操作方法

`concat()`用于将一个或多个字符串拼接为一个新字符串。

```jsx
let stringValue = 'hello'
let result = stringValue.concat('world')

console.log(result) // 'hello world'
console.log(stringValue) // 'hello'
```

在这个例子中，对`stringValue`调用`concat()`方法的结果是得到`"hello world"`，但`stringValue`的值保持不变。`concat()`方法可以接收任意多个参数，因此可以一次性拼接多个字符串，例如：

```jsx
let stringValue = 'hello'
let result = stringValue.concat('world', '!')

console.log(result) // 'hello world'
console.log(stringValue) // 'hello'
```

虽然`concat()`方法可以拼接字符串，但更常用的方式是使用加号操作符`+`。而且多数情况下，对于拼接多个字符串来说，使用加号更方便。

ECMAScript 提供了 3 个从字符串中提取子字符串的方法：`slice()`、`substr()`和`substring()`。这 3 个方法都返回调用它们的字符串的一个子字符串，而且都接收一个或两个参数。第一个参数表示字符串开始的位置，第二个参数表示字符串结束的位置。对`slice()`和`substring()`而言，第二个参数是提取结束的位置（即该位置之前的字符会被提取出来）。对`substr()`而言，第二个参数表示返回的子字符串中字符数量。

> 注意，尽管`String.prototype.substr(...)`没有被严格废弃，但是它被认为是遗留的函数应该避免使用。并非 JavaScript 核心语言的一部分，未来可能被移除掉。如果可以的话，应该使用`substring()`替代它。

常用的是`substring()`和`slice()`。

`substring(indexStart, indexEnd)`提取从`indexStart`到`indexEnd`（不包括）之间的字符。特别的：

- 如果`indexStart`等于`indexEnd`，返回一个空字符串。
- 如果省略`indexEnd`，提取字符一直到字符串末尾。
- 如果任一参数小于 0 或为`NaN`，则被当作 0。
- 如果任一参数大于`string.length`，则被当作`string.length`。
- 如果`indexStart`大于`indexEnd`，则`substring`的执行效果就像两个参数调换了一样。

`slice(beginIndex, endIndex)`提取某个字符串的一部分，并返回一个新的字符串，且不会改动原字符串。

- `beginIndex`，从改索引开始提取原字符串中的字符。如果值为负数，那么会被当作`strLength + beginIndex`看待，这里的`strLength`是字符串的长度。
- `endIndex`，在该索引处结束提取字符串。如果参数为负数，则被看作是`strLength + endIndex`。

### 字符串位置方法

有两个方法用于在字符串中定位子字符串：`indexOf()`和`lastIndexOf()`。这两个方法从字符串中搜索传入的字符串，并返回位置（如果没找到则返回`-1`）。这两者的区别在于，`indexOf()`方法从字符串开头开始查找字符串，而`lastIndexOf()`方法从字符串末尾开始查找字符串。

```jsx
let stringValue = 'hello world'
console.log(stringValue.indexOf('o')) // 4
console.log(stringValue.lastIndexOf('o')) // 7
```

这两个方法都接收可选的第二个参数，表示开始搜索的位置。这意味着，`indexOf()`会从这个参数指定的位置开始向字符串末尾搜索，忽略该位置之前的字符；`lastIndexOf()`则会从这个参数指定的位置开始向字符串开头搜索，忽略该位置之后直到字符串末尾的字符串。

```jsx
let stringValue = 'hello world'
console.log(stringValue.indexOf('o', 6)) // 7
console.log(stringValue.lastIndexOf('o', 6)) // 4
```

### 字符串包含方法

ES6 增加了 3 个用于判断字符串中是否包含另一个字符串的方法：`startWith()`、`endsWith()`和`includes()`。这些方法都会从字符串中搜索传入的字符串，并返回一个表示是否包含的布尔值。它们的区别在于，`startsWith()`检查开始于索引 0 的匹配项，`endsWith()`检查开始于索引`(string.length - substring.length)`的匹配项，而`includes()`检查整个字符串。

`startsWith()`和`includes()`方法接收可选的第二个参数，表示开始搜索的位置。如果传入第二个参数，则意味着这两个方法会从指定位置向着字符串末尾搜索，忽略该位置之前的所有字符。

`endsWith()`方法接收可选的第二个参数，表示应该当作字符串末尾的位置。如果不提供这个参数，默认就是字符串长度。如果提供这个参数，那么就好像字符串只有那么多字符一样。

### `trim()`方法

ECMAScript 在所有字符串上都提供了`trim()`方法。这个方法会创建字符串的一个副本，删除前后所有空格符，再返回结果。

```jsx
const stringValue = ' hello world '
const trimmedStringValue = stringValue.trim()
console.log(stringValue) // ' hello world '
console.log(trimmedStringValue) // 'hello world'
```

另外，`trimLeft()`和`trimRight()`方法分别用于从字符串开始和末尾清理空格符。

### `repeat()`方法

ECMAScript 在所有字符串上都提供了`repeat()`方法。这个方法接收一个整数参数，表示要将字符串复制多少次，然后返回拼接所有副本的结果。

```jsx
const stringValue = 'na '
console.log(stringValue.repeat(16) + 'batman')
// na na na na na na na na na na na na na na na na batman
```

### `padStart()`和`padEnd()`方法

`padStart()`和`padEnd()`方法会复制字符串，如果小于指定长度，则在相应一边填充字符，直至满足长度条件。这两个方法的第一个参数是长度，第二个参数是可选的填充字符串，默认为空格（U+0020）。

```jsx
const stringValue = 'foo'

console.log(stringValue.padStart(6)) // '   foo'
console.log(stringValue.padStart(9, '.')) // "......foo"
console.log(stringValue.padEnd(6)) // "foo   "
console.log(stringValue.padEnd(9, '.')) // "foo......"
```

可选的第二个参数并不限于一个字符。如果提供了多个字符的字符串，则会将其拼接并截断以匹配指定长度。此外，如果长度小于或等于字符串长度，则会返回原始字符串。

```jsx
const stringValue = 'foo'

console.log(stringValue.padStart(8, 'bar')) // "barbafoo"
console.log(stringValue.padStart(2)) // "foo"
console.log(stringValue.padEnd(8, 'bar')) // "foobarba"
console.log(stringValue.padEnd(2)) // "foo"
```

### 字符串迭代与解构

字符串的原型上暴露了一个`@@iterator`方法，表示可以迭代字符串的每个字符。

```jsx
let message = 'abc'
let stringIterator = message[Symbol.iterator]()

console.log(stringIterator.next()) // { value: 'a', done: false }
console.log(stringIterator.next()) // { value: 'b', done: false }
console.log(stringIterator.next()) // { value: 'c', done: false }
console.log(strintIterator.next()) // { value: undefined, done: true }
```

在`for-of`循环中可以通过这个迭代器按序访问每个字符。

```jsx
for (const c of 'abcde') [console.log(c)]

// a
// b
// c
// d
// e
```

有了这个迭代器之后，字符串就可以通过解构操作符来解构了。

```jsx
const message = 'abcde'

console.log([...message]) // ['a', 'b', 'c', 'd', 'e']
```

### 字符串大小写转换

下一组方法涉及大小写转换，包括 4 个方法：`toLowerCase()`、`toLocaleLowerCase()`、`toUpperCase()`和`toLocaleUpperCase()`。`toLowerCase()`和`toUpperCase()`方法是原来就有的方法，与`java.lang.String`中的方法同名。在很多地区，地区特定的方法与通用的方法是一样的。但在少数语言中，Unicode 的大小写转换需要应用特殊规则，需要使用地区特定的方法才能实现正确转换。

```jsx
const stringValue = 'hello world'
console.log(stringValue.toLocaleUpperCase()) // "HELLO WORLD"
console.log(stringValue.toUpperCase()) // "HELLO WORLD"
console.log(stringValue.toLocaleLowerCase()) // "hello world"
console.log(stringValue.toLowerCase()) // "hello world"
```

通常，如果不知道代码涉及什么语言，则会好使用地区特定的转换方法。

### 字符串模式匹配方法

`String`类型专门为在字符串中实现模式匹配设计了几个方法。第一个就是`match()`方法，这个方法本质上跟`RegExp`对象的`exec()`方法相同。`match()`方法接收一个参数，可以是一个正则表达式字符串，也可以是一个`RegExp`对象。

```jsx
const text = 'cat, bat, sat, fat'
const pattern = /.at/

// 等价于pattern.exec(text)
const matches = text.match(pattern)
console.log(matches.index) // 0
console.log(matches[0]) // 'cat'
console.log(pattern.lastIndex) // 0
```

`match()`方法返回的数组与`RegExp`对象的`exec()`方法返回的数值是一样的：第一个元素是与整个模式匹配的字符串，其余元素则是与表达式中的捕获组匹配的字符串。

另一个查找模式的字符串方法是`search()`。这个方法唯一的参数与`match()`方法一样：正则表达式字符串或`RegExp`对象。这个方法返回模式第一个匹配的位置索引，如果没有找到则返回-1。`search()`始终从字符串开头向后匹配模式。

```jsx
const text = 'cat, bat, sat, fat'
const pos = text.search(/at/)
console.log(pos) // 1
```

这里，`search(/at/)`返回`1`，即`"at"`的第一个字符在字符串中的位置。

为了简化字符串替换操作，ECMAScript 提供了`replace()`方法。这个方法接收两个参数，第一个参数可以是一个`RegExp`对象或一个字符串（这个字符串避讳转换为正则表达式），第二个参数可以是一个字符串或一个函数。如果第一个参数是字符串，那么只会替换第一个字符串。想要替换所有子字符串，第一个参数必须为正则表达式并且带全局标记。

```jsx
console.log(result) // "cond, bat, sat, fat" 13
let text = 'cat, bat, sat, fat'
let result = text.replace('at', 'ond')
result = text.replace(/at/g, 'ond')
console.log(result) // "cond, bond, sond, fond"
```

第二个参数是字符串的情况下，有几个特殊的字符序列，可以用来插入正则表达式操作的值。ECMA-262 中规定了下表中的值。

| 字符序列  |                                                                            替换文本                                                                            |
| :-------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|   `$$`    |                                                                              `$`                                                                               |
|   `$&`    |                                                         匹配整个模式的字符串。与`RegExp.lastMatch`相同                                                         |
|   `$'`    |                                                    匹配的子字符串之前的字符串。与`RegExp.rightContext`相同                                                     |
| `` $`  `` |                                                      匹配的字符串之后的字符串。与`RegExp.leftContext`相同                                                      |
|   `$n`    |   匹配第`n`个捕获组的字符串，其中`n`是 0 ～ 9。例如`$1`是匹配第一个捕获组的字符串，`$2`是匹配第二个捕获组的字符串，依此类推。如果没有捕获组，则值为空字符串    |
|   `$nn`   | 匹配第`nn`个捕获的字符串，其中`nn`是 01~99。例如，`$01`是匹配第一个捕获组的字符串，`$02`是匹配第二个捕获组的字符串，依此类推。如果没有捕获组，则值为空字符串。 |

> 这里再次说明，`RegExp`构造函数的所有属性都没有任何 Web 标准出处，因此不要使用它们。

使用这些特殊的序列，可以在替换文本中使用之前匹配的内容，如下面的例子所示：

```jsx
const text = 'cat, bat, sat, bat'
result = text.replace(/(.at)/g, 'word ($1)')
console.log(result) // word (cat), word (bat), word (sat), word (fat)
```

`replace()`的第二个参数可以是一个函数。在只有一个匹配项时，这个函数会收到三个参数：与整个模式匹配的字符串、匹配项在字符串中的开始位置，以及整个字符串。在有多个捕获组的情况下，每个匹配捕获组的字符串也会作为参数传给这个函数，但最后两个参数还是与整个模式匹配的开始位置和原始字符串。这个函数应该返回一个字符串，表示应该把匹配项替换成什么。使用函数作为第二个参数，可以更精细地控制替换过程。

```jsx
function htmlEscape(text) {
  return text.replace(/[<>"&]/g, function(match, pos, originalText) {
    switch (match) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt'
      case '&':
        return '&amp'
      case '\':
        return '&quot;'
    }
  })
}

console.log(htmlEscape("<p class=\"greeting\">Hello World!</p>"))
// "&lt;p class=&quot;greeting&quot;&gt;Hello world!</p>"
```

最后一个与模式匹配相关的字符串方法是`split()`，这个方法会根据传入的分隔符将字符串拆分成数组。还可以传入第二个参数，即数组大小，确保返回的数组不会超过指定大小。

```jsx
let colorText = 'red,blue,green,yellow'
let colors1 = colorText.split(',') // ["red", "blue", "green", "yellow"]
let colors2 = colorText.split(',', 2) // ["red", "blue"]
let colors3 = colorText.split(/[^,]+/) // ["", ",", ",", ",", ""]
```

最后一次`split()`时，返回的数组前后包含两个空字符串。这是因为正则表达式指定的分隔符出现在了字符串开头和末尾。

### `localeCompare()`方法

最后一个方法是`localeCompare()`，这个方法比较两个字符串，返回如下 3 个值中的一个。

- 如果按照字母表顺序，字符串应该排在字符串参数前头，则返回负值。通常是-1，具体要看与实际值相关的实现。
- 如果字符串与字符串参数相等，返回 0。
- 如果按照字母表顺序，字符串应该排在字符串参数后头，则返回正值。通常是-1，具体要看与实际值相关的实现。

### HTML 方法

早期的浏览器开发商认为使用 JavaScrip 动态生成 HTML 标签是一个需求。因此早期浏览器扩展了规范，增加了辅助生成 HTML 标签的方法。例如`anchor()`、`link()`等等，但是因为通常结果不是语义化标记，现在已经基本没有人使用了。

# 单例内置对象

ECMA-262 对内置对象的定义是“任何由 ECMAScript 实现提供、与宿主环境无关，并在 ECMAScript 程序开始执行时就存在的对象”。这意味着，开发者不用显式地实例化内置对象，因为它们已经实例化好了。前面已经接触了大部分内置对象，包括`Object`、`Array`和`String`。本节介绍 ECMA-262 定义的另外两个单例内置对象：`Global`和`Math`。

## `Global`

`Global`对象是 ECMAScript 中最特别的对象，因为代码不会显式地访问它。ECMA-262 规定`Global`对象为一种兜底对象，它所针对的是不属于任何对象的属性和方法。事实上，不存在全局变量或全局函数这种东西。在全局作用域中定义的变量和函数都会变成`Global`对象的属性。本书前面介绍的函数，包括`isNaN()`、`isFinite()`、`parseInt()`和`parseFloat()`，实际上都是`Global`对象的方法。除了这些，`Global`对象上还有另外一些方法。

### URL 编码方法

`encodeURI()`和`encodeURIComponent()`方法用于编码统一资源标识符（URI），以便传给浏览器。有效的 URI 不能包含某些字符，例如空格。使用 URI 编码方法来编码 URI 可以让浏览器能够理解它们，同时又以特殊的 UTF-8 编码替换掉所有无效字符。

`encodeURI()`方法用于对整个 URI 进行编码，例如`"www.wrox.com/illegal value js"`。而`encodeURIComponent()`方法用于编码 URI 中单独的组件，例如前面 URL 中的`"illegal value js"`。这两个方法的主要区别是，`encodeURI()`不会编码属于 URL 组件的特殊字符，例如冒号、斜杠、问好、并号，而`encodeURIComponent()`会编码它发现的所有非标准字符。

```jsx
const url = 'http://www.wrox.com/illegal value.js#start'

console.log(encodeURI(url))
// http://www.wrox.com/illegal%20value.js#start

console.log(encodeURIComponent(url))
// http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.js%23start
```

这里使用`encodeURI()`编码后，除空格被替换为`%20`之外，没有任何变化。而`encodeURIComponent()`方法将所有非字母字符都替换成了相应的编码形式。这就是使用`encodeURI()`编码整个 URI，但只使用`encodeURIComponent()`编码那些会追加到已有 URI 后面的字符串的原因。

> 一般来说，使用`encodeURIComponent()`应该比使用`encodeURI()`的频率更高，这是因为编码查询字符串参数比编码基准 URI 的次数更多。

与`encodeURI()`和`encodeURIComponent()`相对的是`decodeURI()`和`decodeUIRComponent()`。`decodeURI()`只对使用`encodeURI()`编码过的字符解码。例如，`%20`会被替换为空格，但`%23`不会被替换为井号（`#`），是因为井号不是由`encodeURI()`替换的。类似地，`decodeURIComponent()`解码所有被`encodeURIComponent()`编码的字符，基本上就是解码所有特殊值。

```jsx
const uri = 'http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.js%23start'

console.log(decodeURI(uri))
// 'http%3A%2F%2Fwww.wrox.com%2Fillegal value.js%23start'

console.log(decodeURIComponent(uri))
// 'http://www.wrox.com/illegal value.js#start'
```

> URI 方法`encodeURI()`、`encodeURIComponent()`、`decodeURI()`和`decodeURIComponent()`取代了`escape()`和`unescape()`方法，后者在 ECMA-262 第 3 版中就已经废弃了。URI 方法始终是首选方法，因为它们对所有 Unicode 字符进行编码，而原来的方法只能正确编码 ASCII 字符。不要在生产环境使用`escape()`和`unescape()`。

### `eval()`方法

最后一个方法可能是整个 ECMAScript 语言中最强大的了，它就是`eval()`。这个方法就是一个完整的 ECMAScript 解释器，它接收一个参数，即一个要执行的 ECMAScript（JavaScript）字符串。

```jsx
eval("console.log('hi')")
```

上面这行代码的功能与下一行等价：

```jsx
console.log('hi')
```

当解释器发现`eval()`调用时，会将参数解释为实际的 ECMAScript 语句，然后将其插入到该位置。通过`eval()`执行的代码属于该调用所在上下文，被执行的代码与该上下文拥有相同的作用域链。这意味着定义在包含上下文中的变量可以在`eval()`调用内部被引用。

```jsx
let msg = 'hello world'
eval('console.log(msg)') // 'hello world'
```

这里，变量`msg`是在`eval()`调用的外部上下文中定义的，而`console.log()`显示了文本`"hello world"`。

类似地，可以在`eval()`内部定义一个函数函数或变量，然后在外部代码中引用。

```jsx
eval("function sayHi() { console.log('hi') }")
console.log(msg) // Reference Error: msg is not defined
```

通过`eval()`定义的任何变量和函数都不会被提升，这是因为在解析代码的时候，它们是被包含在一个字符串中的。它们只是在`eval()`执行的时候才会被创建。

在严格模式下，在`eval()`内部创建的变量和函数无法被外部访问。

> 解释代码字符串的能力非常强大，但也非常危险。在使用`eval()`的时候必须极为慎重，特别是在解释用户输入的内容时。因为这个方法会对 XSS 利用暴露出很大的攻击面。

### `Global`对象属性

`Global`对象有很多属性，其中一些前面已经提到过了。像`undefined`、`NaN`和`Infinity`等特殊值都是`Global`对象的属性。此外，所有原生引用类型构造函数，例如`Object`和`Function`，也都是`Global`对象的属性。

### `window`对象

虽然 ECMA-262 没有直接规定访问`Global`对象的方式，但浏览器将`window`对象实现为`Global`对象的代理。因此，所有全局作用域中声明的变量和函数都变成了`window`的属性。

```jsx
var color = 'red'

function sayColor() {
  console.log(window.color)
}

window.sayColor() // 'red'
```

这里定义了一个名为`color`的全局变量和一个名为`sayColor()`的全局函数。在`sayColor()`内部，通过`window.color`访问了`color`变量，说明全局变量变成了`window`的属性。接着，又通过`window`对象直接调用了`window.sayColor()`函数，从而输出字符串。

> `window`对象在 JavaScript 中远不止实现了`ECMAScript`的`Global`对象那么简单。

另一种获取`Global`对象的方式是使用如下的代码：

```jsx
let global = (function () {
  return this
})()
```

这段代码创建一个立即调用的函数表达式，返回了`this`的值。如前所述，当一个函数在没有明确（通过成为某个对象的方法，或者通过`call()/apply()`）指定`this`值的情况下执行时，`this`值等于`Global`对象。因此，调用一个简单返回`this`的函数是在任何执行上下文中获取`Global`对象的通用方式。

## `Math`

ECMAScript 提供了`Math`对象作为保存数学公式、信息和计算的地方。`Math`对象提供了一些辅助计算的属性和方法。

> `Math`对象上提供的计算要比直接在 JavaScript 实现的快得多，因为`Math`对象上的计算使用了 JavaScript 引擎中更高效的实现和处理器指令。但使用`Math`计算的问题是精度会因浏览器、操作系统、指令集和硬件而异。

### `Math`对象属性

`Math`对象有一些属性，主要用于保存数学中的一些特殊值。

### `min()`和`max()`方法

`Math`对象也提供了很多辅助执行简单或复杂数学计算的方法。`min()`和`max()`方法用于确定一组数值中的最小值和最大值。这两个方法都接收任意多个参数。

```jsx
let max = Math.max(3, 54, 32, 16)
console.log(max) // 54

let min = Math.min(3, 54, 32, 16)
console.log(min) // 3
```

在 3、54、32 和 16 中，`Math.max()`返回 54，`Math.min()`返回 3。使用这两个方法可以避免使用额外的循环和`if`语句来确定一组数值的最大最小值。

要知道数组中的最大值和最小值，可以像这样使用扩展操作符：

```jsx
let values = [1, 2, 3, 4, 5, 6, 7, 8]
let max = Math.max(...values)
```

### 舍入方法

接下来是用于把小数值舍入为整数的 4 个方法：`Math.ceil()`、`Math.floor()`、`Math.round()`和`Math.fround()`。这几个方法处理舍入的方式如下：

- `Math.ceil()`方法始终向上舍入为最接近的整数。
- `Math.floor()`方法始终向下舍入为最接近的整数。
- `Math.round()`方法执行四舍五入。
- `Math.fround()`方法返回数值最接近的单精度（32 位）浮点值表示。

以下示例展示了这些方法的用法：

```jsx
console.log(Math.ceil(25.9)) // 26
console.log(Math.ceil(25.5)) // 26
console.log(Math.ceil(25.1)) // 26
console.log(Math.round(25.9)) // 26
console.log(Math.round(25.5)) // 26
console.log(Math.round(25.1)) // 25
console.log(Math.fround(0.4)) // 0.4000000059604645
console.log(Math.fround(0.5)) // 0.5
console.log(Math.fround(25.9)) // 25.899999618530273
console.log(Math.floor(25.9)) // 25
console.log(Math.floor(25.5)) // 25
console.log(Math.floor(25.1)) // 25
```

对于 25 和 26（不包含）之间的所有值，`Math.cell()`都会返回 26，因为它始终向上舍入。`Math.round()`只在数值大于等于`25.5`时返回 26，否则返回 25。最后，`Math.floor()`对所有 25 和 26（不包含）之间的值都会返回 25。

### `random()`方法

`Math.random()`方法返回一个 0 ～ 1 范围内的随机数，其中包含 0 但不包含 1。对于希望显示随机名言或随机新闻的网页，这个方法是非常方便的。可以基于如下公式使用`Math.random()`从一组整数中随机选择一个数：

```jsx
number = Math.floor(
  Math.random() * total_number_of_choices + first_possible_value
)
```

这里使用了`Math.floor()`方法，因为`Math.random()`始终返回小数，即便乘以一个数再加上一个小数也是小数。因此，如果想从 1 ～ 10 范围内选择一个数，代码就是这样的：

```jsx
const num = Math.floor(Math.random() * 10 + 1)
```

这样就有 10 个可能的值（1 ～ 10），其中最小的值是 1。如果想选择一个 2 ～ 10 范围内的值，则代码就想要写成这样：

```jsx
const num = Math.floor(Math.random() * 9 + 2)
```

2 ～ 10 只有 9 个数，所以可选总数（`total_number_of_choices`）是 9，而最小可能的值（`first_possible_value`）是 2。很多时候，通过函数来算出可选总数和最小可能的值更方便，例如：

```jsx
function selectFrom(lowerValue, upperValue) {
  let choices = upperValue - lowerValue + 1
  return Math.floor(Math.random() * choices + lowerValue)
}
let num = selectFrom(2, 10)
console.log(num) //2~10范围内的值，其中包含2和10
```

这里的函数`selectFrom()`接收两个参数：应该返回的最小值和最大值。通过将这两个值相减再加 1 得到可选总数，然后再套用上面的公式。于是，调用`selectFrom(2, 10)`就可以从 2 ～ 10 范围内选择一个值了。使用这个函数，从一个数组中随机选择一个元素就很容易。

```jsx
let colors = ['red', 'green', 'blue', 'yellow', 'black', 'purple', 'brown']
let color = colors[selectFrom(0, colors.length - 1)]
```

在这个例子中，传给`selecFrom()`的第二参数是数组长度减 1，即数组最大的索引值。

> 注意，这里使用`Math.random()`方法演示是没有问题的。如果是为了加密而需要生成随机数（传给生成器的输入需要较高的不确定性），那么建议使用`window.crypto.getRandomValues()`。

### 其他方法

`Math`对象还有很多涉及各种简单或高阶数运算的方法。讨论每种方法的具体细节或者它们的使用场景超出了本书的范畴。

# 小结

JavaScript 中的对象称为引用值，几种内置的引用类型可用于创建特定类型的对象。

- 引用值与传统面向对象编程语言中的类相似，但实现不同。
- `Date`类型提供关于日期和时间的信息，包括当前日期、时间及相关计算。
- `RegExp`类型是 ECMAScript 支持正则表达式的接口，提供了大多数基础的和部分高级的正则表达式功能。

JavaScript 比较独特的一点是，函数实际上`Function`类型的实例，也就是说函数也是对象。因为函数也是对象，所以函数也有方法，可以用于增强其能力。

由于原始包装类型的存在，JavaScript 中的原始值可以被当成对象来使用。有 3 种原始值包装类型：`Boolean`、`Number`和`String`。它们都具备如下特点。

- 每种包装类型都映射到同名的原始类型。
- 以读模式访问原始值时，后台会实例化一个原始值包装类型的对象，借助这个对象可以操作相应的数据。
- 涉及原始值的语句执行完毕后，包装对象就会被销毁。

当代码开始执行，全局上下文中会存在两个内置对象：`Global`和`Match`。其中，`Global`对象在大多数 ECMAScript 实现中无法直接访问。不过浏览器将其实现为`window`对象。所有全局变量和函数都是`Global`对象的属性。`Math`对象包含辅助完成复杂计算的属性和方法。
