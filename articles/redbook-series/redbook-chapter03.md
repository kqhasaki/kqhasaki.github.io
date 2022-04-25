---
title: 红宝书系列（三）JavaScript语言基础
date: 2022-01-09
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h0xw24rfidj20zk0k0jtg.jpg
---

任何语言的核心所描述的都是这门语言在最基本的层面上如何工作，涉及语法、操作符、数据类型以及内置功能，在此基础之上才可以构建复杂的解决方案。如前所属，ECMA-262 以一个名为 ECMAScript 的伪语言的形式，定义了 JavaScript 的所有这些方面。

ECMA-262 第 5 版（ES5）定义的 ECMAScript，是目前实现得最为广泛（受浏览器支持最好）的一个版本。第 6 版（ES6）在浏览器中的实现程度次之。到了 2017 年底，大多数主流浏览几乎或全部实现了这一版的规范。为此，本章接下来的内容主要基于 ECMAScript 的第 6 版。

# 语法

ECMAScript 的语法很大程度上借鉴了 C 语言和其他类 C 语言，如 Java 和 Perl。熟悉这些语言的开发者，应该很容易理解 ECMAScript 宽松的语法。

## 区分大小写

首先要知道的是，ECMAScript 中的一切都区分大小写。无论是变量、函数名还是操作符，都区分大小写。换句话说，变量`test`和`Test`是两个完全不同的变量。类似地，`typeof`不能作为函数名，因为它是一个关键字。但`Typeof`是一个完全有效的函数名。

## 标识符

所谓**标识符**，就是变量、函数、属性或函数参数的名称。标识符可以由一或多个下列字符组成：

- 第一个字符必须是一个字母、下划线（`_`）或美元符号（`$`）
- 剩下的其他字符可以是字母、下划线、美元符号或数字

标识符中的字母可以是扩展 ASCII（Extended ASCII）中的字母，也可以是 Unicode 的字母字符（但不推荐使用）。

按照惯例，ECMAScript 标识符使用驼峰大小写形式，即第一个单词的首字母小写，后面每个单词的首字母大写，如：

```
firstSecond
myCar
doSomethingImportant
```

虽然这种写法不是强制性的，但是因为这种形式跟 ECMAScript 内置函数和对象命名方式一致，所以算是最佳实践。

> 注意，关键字、保留字、`true`、`false`和`null`不能作为标识符。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1d1rra2gij20nt054aap.jpg)

> 补充：一个有趣的现象是可以给`undefined`赋值而不报错，实际上`undefined`并不是语言的一个关键字或保留字，它是全局对象的一个只读的属性，因此可以赋值。但由于其只读，内部`[[writable]]`为`false`，因此赋值是无效的。而`null`是 JavaScript 中一个特殊的字面量，它和`true`、`false`一样不能被赋值。在严格模式下，给`undefined`赋值会报错，因为严格模式下，禁止给对象的只读属性赋值。类似的还有`NaN`、`Infinity`等。

## 注释

ECMAScript 采用 C 语言风格的注释，包括单行注释和块注释。单行注释以两个斜杠字符开头，如：

```jsx
// 单行注释
```

块注释以一个斜杠和一个星号（`/*`）开头，已其反向组合（`*/`）结尾，例如：

```jsx
/* 这是多行
注释 */
```

## 严格模式

ES5 增加了严格模式（strict mode）的概念。严格模式是一种不同的 JavaScript 解析和执行模型，ECMAScript3 的一些不规范写法在这种模式下会被处理，对于不安全的活动将抛出错误。要对整个脚本启用严格模式，在脚本开头加上：

```jsx
'use strict'
```

虽然看起来像是个没有赋值给任何变量的字符串，但它其实是一个预处理指令。任何支持 ES5 的引擎看到它都会切换到严格模式。选择这种语法形式的目的是不破坏 ECMAScript 3 语法。

也可以单独指定一个函数在严格模式下执行，只要把这个预处理指令放到函数体开头即可：

```jsx
function doSomething() {
  'use strict'
  // 函数体
}
```

严格模式会影响 JavaScript 执行的很多方面，所有现代浏览器都支持严格模式。

## 语句

ECMAScript 中的语句以分号结尾。省略分号意味着由解析器确定语句在哪里结尾，例如下面例子所示：

```jsx
const sum = a + b // 没有分号也有效，但不推荐
const diff = a - b // 加分号有效，推荐
```

即使语句末尾的分号不是必须的，也应该加上。记着加分号有助于防止省略造成的问题，例如可以避免输入内容不完整。此外，加分号也有助于开发者通过删除空行来压缩代码（如果没有结尾的分号，只删除空行，则会导致语法错误）。加分号也有助于在某些情况下提升性能，因为解析器会尝试在合适的位置补上分号以纠正语法错误。

> 补充：需要说明的是，部分现代 JavaScript 框架的源码并不鼓励加分号，例如 Vue3、Next.js 等，甚至 Node.js 的官网样例也均不加分号。由于现代 JavaScript 开发过程中普遍使用现代构建、编译工具，最终交付给浏览器的生产代码都是加过分号并且经过压缩的。故而在开发代码库中是否需要加分号并不关系到运行时的问题，而更多地是一种偏好。省略分号在一定程度上提升代码的整洁度和可读性，而加分号可以避免部分换行不正确的错误（实际上有经验的开发者极少犯此类错误）。

多条语句可以合并到一个 C 语言风格的代码块中。代码块由一个左花括号`{`标识开始，一个右花括号`}`标识结束：

```jsx
if (test) {
  test = false
  console.log(test)
}
```

`if`之类的控制语句只在执行多条语句时要求必须有代码块。不过最佳实践是始终在控制语句中使用代码块，即使只有一条语句，例如：

```jsx
if (test) console.log(test)

// 推荐
if (test) {
  console.log(test)
}
```

在控制语句中使用代码块可以让内容更清晰，在需要修改代码时也可以减少出错的可能性。

# 关键字与保留字

ECMA-262 描述了一组保留的**关键字**，这些关键字有特殊用途，例如表示控制语句的开始或结束，或者执行特定的操作。按照规定，保留的关键字不能用作标识符或属性名。ES6 规定的所有关键字如下：

```
break case catch class const continue debugger default delete
do else export extends finally for function if import
in instanceof new return super switch this throw try
typeof var void while with yield
```

> 补充：一个有趣的现象是`let`并不是一个保留字，导致在非严格模式下可以给`let`赋值而不报错。这个问题是由于历史原因，早在 2000 年的 ES3 标准中就已经定义了所有的保留字。处于向前兼容的原因，无法扩展这个列表了（会导致部分老的 JavaScript 无法运行）。当时的标准制定者并没有预见到未来 JavaScript 的发展。因此有许多”新关键字“并没有在当时列入保留字，如果要让 JavaScript 引擎判定其为保留字，则需要开启严格模式。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1d3laaeq9j20iv050jro.jpg)

规范中也描述了一组**未来的保留字**，同样不能用作标识符或属性名。虽然保留字在语言中没有特定用途，但它们是保留给将来做关键字用的。

以下是 ES6 为将来保留的所有词汇：

|      分类      |                                         保留字                                          |
| :------------: | :-------------------------------------------------------------------------------------: |
|    始终保留    |                                         `enum`                                          |
| 严格模式下保留 | `implements`、`package`、`public`、`interface`、`protected`、`static`、`let`、`private` |
| 模块代码中保留 |                                         `await`                                         |

这些词汇不能用作标识符，但现在还可以用作对象的属性名。一般来说，最好还是不要使用关键字和保留字作为标识符和属性名，以确保兼容过去和未来的 ECMAScript 版本。

> 补充：注意到`async`即使在 ES6 中也并未成为严格模式下的保留字，这或许是因为`async`由于其作为语法组成部分时，可以直接被判定，不会引起语义模糊。这一点和`await`不一样。参见[stackoverflow 上的一个讨论](https://stackoverflow.com/questions/45336937/why-is-async-not-a-a-reserved-word)。

# 变量

ECMAScript 是松散类型的，意思是变量可以用于保存任何类型的数据。每个变量只不过是一个用于保存任意值的命名占位符。有 3 个关键字可以声明变量：`var`、`const`和`let`。其中，`var`在 ECMAScript 任何版本中都可以使用，而`const`和`let`只能在 ECMAScript6 及更晚版本中使用。

## `var`关键字

要定义变量，可以使用`var`操作符（注意`var`是一个关键字），后跟变量名（即标识符，如前所述）：

```js
var message
```

这行代码定义了一个名为`message`的变量，可以用它保存任何类型的值。（不初始化的情况下，变量会保存一个特殊值`undefined`）。ECMAScript 实现变量初始化，因此可以同时定义变量并设置它的值：

```jsx
var message = 'hi'
```

这里，`message`被定义为一个保存字符串值`hi`的变量。像这样初始化变量不会将它标识为字符串类型，只能一个简单的赋值而已。随后，不仅可以改变的值，也可以改变值的类型：

```jsx
var message = 'hi'
message = 100 // 合法，但不推荐
```

在这个例子中，变量`message`首先被定义为一个保存字符串值`hi`的变量，然后又被重写为保存了数值 100。虽然不推荐改变变量保存值的类型，但这在 ECMAScript 中是完全有效的。

### `var`声明作用域

关键的问题在于，使用`var`操作符定义的变量会成为包含它的函数的局部变量。例如，使用`var`在一个函数内部定义一个变量，就意味着该变量将在函数退出时被销毁：

```jsx
function test() {
  var message = 'hi' // 局部变量，拥有函数级作用域
}

test()
console.log(message) // 出错
```

这里，`message`变量是在函数内部使用`var`定义的。函数叫`test()`，调用它会创建这个变量并给它赋值。调用之后变量随即被销毁，因此示例中的最后一行会导致错误。不过，在函数内定义变量时省略`var`操作符，可以创建一个全局变量：

```jsx
function test() {
  message = 'hi' // 全局变量
}

test()
console.log(message) // 'hi'
```

去掉之前的`var`操作符之后，`message`就变成了全局变量。只要调用一次函数`test()`，就会定义这个变量，并且可以在函数外部访问到。

> 注意：虽然可以通过省略`var`操作符定义全局变量，但不推荐这么做。在局部作用域中定义的全局变量很难维护，也会造成困惑。这是因为不能一下子断定省略`var`是不是有意而为之。在严格模式下，如果像这样给未声明的变量赋值，则会导致抛出`ReferenceError`。

如果需要定义多个变量，可以在一条语句中用逗号分隔每个变量（及可选的初始化）：

```jsx
var message = 'hi',
  found = false,
  age = 29
```

这里定义并初始化了 3 个变量。因为 ECMAScript 是松散类型的，所以使用不同数据类型初始化的变量可以用一条语句来声明。插入换行和空格缩进并不是必需的，但这样有利于阅读理解。

> 补充：实际上好的 JavaScript 编码规范中，禁止在一条语句中声明多个变量。因为这样做的可读性更差，也不优雅。

在严格模式下，不能定义名为`eval`和`arguments`的变量，否则会导致语法错误。

### `var`声明提升

使用`var`时，下面的代码不会报错。这是因为使用这个关键字声明的变量会自动提升到函数作用域顶部：

```jsx
function foo() {
  console.log(age)
  var age = 26
}
foo() // undefined
```

之所以不会报错，是因为 ECMAScript 运行时把它看成等价于如下代码：

```jsx
function foo() {
  var age
  console.log(age)
  age = 26
}
foo() // undefined
```

这就是所谓的“提升”（hoist），也就是把所有变量声明都拉到函数作用域的顶部。此外，反复多次使用`var`声明同一个变量也么有问题：

```jsx
function foo() {
  var age = 16
  var age = 26
  var age = 36
  console.log(age)
}
foo() // 36
```

## `let`声明

`let`跟`var`的作用差不多，但有着非常重要的区别。最明显的区别是，`let`声明的范围是块作用域，而`var`声明的范围是函数作用域。

```jsx
if (true) {
  var name = 'Matt'
  console.log(name) // Matt
}
console.log(name) // Matt

if (true) {
  let age = 26
  console.log(age) // 26
}

console.log(age) // ReferenceError: age没有定义
```

在这里，`age`变量之所以不能在`if`块外部被使用，是因为它的作用域仅限于该块内部。块作用域是函数作用域的子集，因此适用于`var`的作用域限制同样也适用于`let`。

`let`也不允许同一个块作用域中出现冗余声明。这样会导致报错：

```jsx
var name
var name

let age
let age // SyntaxError; 标识符age已经声明过了
```

当然，JavaScript 引擎会记录用于变量声明的标识符及其所在的块作用域，因此嵌套使用相同的标识符不会报错，而这是因为同一块中没有重复声明：

```jsx
var name = 'Nicholas'
console.log(name) // 'Nicholas'
if (true) {
  var name = 'Matt'
  console.log(name) // 'Matt'
}

let age = 30
console.log(age) // 30
if (true) {
  let age = 26
  console.log(age) // 26
}
```

对声明冗余报错不会因混用`let`和`var`而受影响。这两个关键字声明的并不是不同类型的变量，它们只是指出变量在相关作用域如何存在。

```jsx
var name
let name // SyntaxError

let age
var age // SyntaxError
```

### 暂时性死区

`let`与`var`的另一个重要的区别，就是`let`声明的变量不会在作用域中被提升。

```jsx
// name会被提升
console.log(name) // undefined
var name = 'Matt'

// age不会被提升
console.log(age) // ReferenceError: age没有定义
let age = 26
```

在解析代码时，JavaScript 引擎也会注意出现在块后面的`let`声明，只不过在此之前不能以任何方式来使用未声明的变量。在`let`声明之前的执行瞬间被称为“暂时性死区”（temporal dead zone），在此阶段引用任何后面才声明的变量都会抛出`ReferenceError`。

### 全局声明

与`var`关键字不同，使用`let`在全局作用域中声明的变量不会成为`window`对象的属性（`var`声明的变量则会）。

```jsx
var name = 'Matt'
console.log(window.name) // 'Matt'

let age = 26
console.log(window.age) // undefined
```

不过，`let`声明仍然是在全局作用域中发生的，相应变量会在生命周期内存续。因此，为了避免`SyntaxError`，必须确保页面不会重复声明同一个变量。

### 条件声明

在使用`var`声明变量时，由于声明会被提升，JavaScript 引擎会自动将多余的声明在作用域顶部合并为一个声明。因为`let`的作用域是块，所以不可能检查前面是否已经使用`let`声明过同名变量，同时也就不可能在没有声明的情况下声明它。

因此，对于`let`这个新的 ES6 声明关键字，不能依赖条件声明模式。

> 不能使用`let`进行条件式声明是件好事，因为条件声明是一种反模式，它让程序变得更难理解。如果你发现自己在使用这个模式，那一定有更好的替代方式。

### `for`循环中的`let`声明

在`let`出现之前，`for`循环定义的迭代变量会渗透到循环体外部：

```jsx
for (var i = 0; i < 5; i++) {
  // 循环逻辑
}
console.log(i) // 5
```

改成使用`let`之后，这个问题就消失了，因为迭代变量的作用域仅限于`for`循环块内部：

```jsx
for (let i = 0; i < 5; i++) {
  // 循环逻辑
}
console.log(i) // ReferenceError: i没有定义
```

在使用`var`的时候，最常见的问题就是对迭代变量的奇特声明和修改：

```jsx
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 0)
}

// 实际上输出5,5,5,5,5
```

之所以会这样，是因为在退出循环时，迭代变量保存的是导致循环退出的值：5。在之后执行超时逻辑时，所有的`i`都是同一个变量，因而输出的都是同一个最终值。

而在使用`let`声明迭代变量时，JavaScript 引擎会在后台为每个迭代循环声明一个新的迭代变量。每个`setTimeout`引用的都是不同的变量实例，所以`console.log`输出了我们期望的值，也就是循环执行过程中每个迭代变量的值。

```jsx
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 0)
}

// 会输出0,1,2,3,4
```

这种每次迭代声明一个独立变量实例的行为适用于所有风格的`for`循环，包括`for-in`和`for-of`循环。

## `const`声明

`const`的行为与`let`基本相同，唯一一个重要的区别是用它们声明变量时必须同时初始化变量，且尝试修改`const`声明的变量会导致运行时错误。

```jsx
const age = 26
age = 36 // TypeError: 给常量赋值

// const也不允许重复声明
const name = 'Matt'
const name = 'Nicholas' // SyntaxError

// const声明的作用域也是块
const name = 'Matt'
if (true) {
  const name = 'Nicholas'
}
console.log(name) // Matt
```

`const`声明的限制只使用于它指向的变量的引用。换句话说，如果`const`变量引用的是一个对象，那么修改这个对象内部的属性并不违反`const`的限制。

```jsx
const person = {}
person.name = 'Matt' // ok
```

`const`声明的限制只适用于它指向的变量的引用。换句话说，如果`const`变量引用的是一个对象，那么修改这个对象内部的属性并不违反`const`的限制。

```jsx
const person = {}
person.name = 'Matt' // ok
```

JavaScript 引擎会为`for`循环中的`let`声明分别创建独立的变量实例，虽然`const`变量跟`let`变量很相似，但是不能用`const`来声明迭代变量（因为迭代变量会自增）：

```jsx
for (const i = 0; i < 10; ++i) {} // TypeError: 给常量赋值
```

不过，如果你只想用`const`声明一个不会修改的`for`循环变量，那也是可以的。也就是说，每次迭代只是创建一个新变量。这对`for-of`和`for-in`循环特别有意义：

```jsx
let i = 0
for (const j = 7; i < 5; i++) {
  console.log(j)
}
// 7, 7, 7, 7, 7

for (const key in { a: 1, b: 2 }) {
  console.log(key)
}
// a, b

for (const value of [1, 2, 3, 4, 5]) {
  console.log(value)
}
// 1, 2, 3, 4, 5
```

## 声明风格及最佳实践

ECMAScript6 增加的`let`和`const`从客观上为这门语言更精确地声明作用域和语义提供了更好的支持。行为怪异的`var`所造成的各种问题，已经让 JavaScript 社区为之苦恼了很多年。随着这两个新关键字的出现，新的有助于提升代码质量的最佳实践也逐渐显现。

### 不使用`var`

有了`let`和`const`，大多数开发者发现自己不再需要`var`了。限制自己只使用`let`和`const`有助于提升代码质量，因为变量有了明确的作用域、声明位置，以及不变的值。

### `const`优先，`let`次之

使用`const`声明可以让浏览器运行时强制保持变量不变，也可以让静态代码分析工具提前发现不合法的赋值操作。因此，很多开发者认为应该优先使用`const`来声明变量，只在提前知道未来会有修改时，再使用`let`。这样可以让开发者更有信心地推断某些变量的值永远不会变，同时也能迅速发现因意外赋值导致的非预期行为。

# 数据类型

ECMAScript 有 6 种简单数据类型（也称为**原始类型**）：`undefined`、`null`、`boolean`、`number`、`string`和`symbol`。`symbol`（符号）是 ES6 新增的。还有一种复杂数据类型叫`Object`（对象）。`Object`是一种无序名值对的集合。因为在 ECMAScript 种不能定义自己的数据类型，所有值都可以用上述 7 种数据类型之一来表示。只有 7 种数据类型似乎不足以表示全部数据。但 ECMAScript 的数据类型很灵活，一种数据类型可以当作多种数据类型来使用。

## `typeof`操作符

因为 ECMAScript 的类型系统是松散的，所以需要一种手段来确定任意变量的数据类型。`typeof`操作符就是为此而生的。对一个值使用`typeof`操作符会返回下列字符串之一：

- `"undefined"`表示值未定义
- `"boolean"`表示值为布尔值
- `"string"`表示值为字符串
- `"number"`表示值为数值
- `"object"`表示值为对象（而不是函数）或`null`
- `"function"`表示值为函数
- `"symbol"`表示值为符号

下面是使用`typeof`操作符的例子：

```jsx
const message = 'some string'
console.log(typeof message) // "string"
console.log(typeof message) // "string"
console.log(typeof 95) // "number"
```

在这个例子中，我们把一个变量（`message`）和一个数值字面量传给了`typeof`操作符。注意因为`typeof`是一个操作符而不是函数，所以不需要参数（但可以使用参数）。

注意`typeof`在某些情况下返回的结果可能让人费解，但技术上讲还是正确的。例如，调用`typeof null`返回的是`object`。这是因为特殊值`null`被认为是一个空对象的引用。

> 注意：严格来讲，函数在 ECMAScript 中被认为是对象，并不代表一种数据类型。可是，函数也有自己特殊的属性。为此，就有必要通过`typeof`操作符来区分函数和其他对象。

## `Undefined`类型

`Undefined`类型只有一个值，就是特殊值`undefined`。当使用`var`或`let`声明了变量但没有初始化时，就相当于给变量赋予了`undefined`值：

```jsx
let message
console.log(message === undefined) // true
```

在这个例子中，变量`message`在声明的时候并未初始化。而在比较它和`undefined`的字面值时，两者是相等的。这个例子等同于如下示例：

```jsx
let message = undefined
console.log(message === undefined) // true
```

这里，变量`message`显式地以`undefined`来初始化。但这是不必要的，因为默认情况下，任何未经初始化的变量都会取得`undefined`值。

> 注意：一般来说，永远不用显式地给某个变量设置`undefined`值。字面值`undefined`主要用于比较，而且在 ECMA-262 第 3 版之前是不存在的。增加这个特殊值的目的就是为了正式明确空对象指针（`null`）和未初始化变量的区别。

注意，包含`undefined`值的变量跟未定义变量是有区别的。请看下面的例子：

```jsx
let message // 这个变量被声明了，只是值为undefined

// 确保没有声明过这个变量
// let age

console.log(message) // "undefined"
console.log(age) // 报错
```

在上面的例子中，第一个`console.log`会指出变量`message`的值，即`"undefined"`。而第二个`console.log`要输出一个未声明的变量`age`的值，因此会导致报错。对未声明比的变量，只能执行一个有用的操作，就是对它调用`typeof`。（对未声明的变量调用`delete`也不会报错，但这个操作没什么用，实际上在严格模式下会抛出错误。）

在对未初始化的变量调用`typeof`时，返回的结果是`"undefined"`，但对未声明的变量调用它时，返回的结果还是`"undefined"`，这就让人有点看不懂了，例如：

```jsx
let message // 这个变量被声明了，只是值为undefined

// 确保没有声明过这个变量
// let age

console.log(typeof message) // "undefined"
console.log(typeof age) // undefined
```

无论是声明还是未声明，`typeof`返回的都是字符串`"undefined"`。逻辑上讲这是对的，因为虽然严格来讲这两个变量存在根本性差异，但它们都无法执行实际操作。

> 注意：即使未初始化的变量会被自动赋予`undefined`值，但我们仍然建议在声明变量的同时进行初始化。这样，当`typeof`返回`"undefined"`时，你就会知道那是因为给定的变量尚未声明，而不是声明了但未初始化。

`undefined`是一个假值。因此，如果需要，可以用更简洁的方式检测它。但是要记住，也有很多其他可能的值同样是假值。所以一定要明确自己想检测的就是`undefined`这个字面值，而不仅仅是假值。

```jsx
let message

if (message) {
  // 这个块不会执行
}

if (!message) {
  // 这个块会执行
}

if (age) {
  // 这里会报错
}
```

## `Null`类型

`Null`类型同样只有一个值，即特殊值`null`。逻辑上讲，`null`值表示一个空对象指针，者也是给`typeof`传一个`null`会返回`Object`的原因：

```jsx
let car = null
console.log(typeof car) // "object"
```

在定义将来要保存对象值的变量时，建议使用`null`来初始化，不要使用其他值。这样，只要检查这个变量的值是不是`null`就可以知道这个变量是否在后来被重新赋予了一个对象的引用，例如：

```jsx
if (car !== null) {
  // car是一个对象的引用
}
```

`undefined`值是由`null`值派生而来的，因此 ECMA-262 将他们定义为表面上相等：

```jsx
console.log(null == undefined) // true
```

注意，一般情况下应该避免使用`==`操作符，因为这个操作符会为了比较而转换它的操作数。

即使`null`和`undefined`有关系，它们的用途也完全不一样的。如前所述，永远不必显式地将变量值设置为`undefined`。但`null`不是这样的。任何时候，只要变量保存对象，而当时又没有那个对象可保存，就要用`null`来填充该变量。这样就可以保持`null`是空对象指针的语义，并进一步将其与`undefined`区分开来。

`null`是一个假值。因此，如果需要，可以用更简洁的方式检测它。不过要记住，很多其他值可能同样是假值。所以一定要明确自己想检测的就是`null`这个字面值，而不仅仅是假值。

```jsx
let message = null
let age

if (message) {
  // 这个块不会执行
}

if (!message) {
  // 这个块会执行
}

if (age) {
  // 这个块不会执行
}

if (!age) {
  // 这个块会执行
}
```

## `Boolean`类型

`Boolean`（布尔值）类型是 ECMAScript 中使用最频繁的类型之一，有两个字面值：`true`和`false`。这个布尔值不同于数值，因此`true`不等于 1，`false`不等于 0。

```jsx
let found = true
let lost = false
```

注意，布尔值字面量`true`和`false`是区分大小写的。

虽然布尔值只有两个，但所有其他 ECMAScript 类型的值都有相应布尔值的等价形式。要将一个其他类型的值转换为布尔值，可以调用特定的`Boolean()`转型函数：

```jsx
const message = 'Hello World'
const messageAsBoolean = Boolean(message)
```

在这个例子中，字符串`message`会被转换为布尔值并保存在变量`messageAsBoolean`中。`Boolean()`转型函数可以在任意类型的数据上调用，而且始终返回一个布尔值。什么值能转换为`true`或`false`的规则取决于数据类型和实际的值。下表总结了不同类型与布尔值之间的转换规则。

|  数据类型   |    转换为`true`的值    | 转换为`false`的值 |
| :---------: | :--------------------: | :---------------: |
|  `Boolean`  |         `true`         |      `false`      |
|  `String`   |       非空字符串       | `""`（空字符串）  |
|  `Number`   | 非零数值（包括无穷值） |    `0`、`NaN`     |
|  `Object`   |        任意对象        |      `null`       |
| `Undefined` |    `N/A`（不存在）     |    `undefined`    |

理解以上转换非常重要，因为像`if`等流控制语句会自动执行其他类型值到布尔值的转换，例如：

```jsx
let message = 'Hello World!'
if (message) {
  console.log('Value is true')
}
```

在这个例子中，`console.log`会输出字符串`"Value is true"`，因为字符串`message`会自动转换为等价的布尔值`true`。由于存在这种自动转换，理解流控制语句中使用的是什么变量就非常重要。错误地使用对象而不是布尔值会明显改变应用程序的执行流。

## `Number`类型

ECMAScript 中最有意思的数据类型或许就是`Number`了。`Number`类型使用 IEEE 754 格式表示整数和浮点值（在某些语言中也叫双精度浮点值）。不同的数值类型相应地也不同的数值字面量格式。

最基本的数值字面量格式是十进制整数，直接写出来即可：

```jsx
let intNum = 55 // 整数
```

整数也可以用八进制或十六进制字面量表示。对于八进制字面量，第一个数字必须是零，然后是相应的八进制数字（数值 0 ～ 7）。如果字面量中包含的数字超过了应有的范围，就会忽略前缀的零，后面的数字序列会被当成十进制数，如下所示：

```jsx
let octalNum1 = 070 // 八进制56
let octalNum2 = 079 // 无效的八进制数值，当成79处理
let octaNum3 = 08 // 无效的八进制数值，当成8处理
```

**八进制字面量在严格模式下是无效的**，会导致 JavaScript 引擎抛出语法错误。

要创建十六进制字面量，必须让真正的数值前缀`0x`（区分大小写），然后是十六进制数字（0 ～ 9 以及 A ～ F）。十六进制数字的字母大小写均可。下面是几个例子：

```jsx
let hexNum1 = 0xa // 十六进制10
let hexNum2 = 0x1f // 十六进制31
```

使用八进制和十六进制创建的数值在所有数学操作中都会视为十进制数值。

> 由于 JavaScript 保存数值的方式，实际中可能存在正零（+0）和负零（-0）。正零和负零在所有情况下都被认为是等同的，这里特地说明一下。

### 浮点值

要定义浮点值，数值中必须包含小数点，而且小数点后面必须至少有一个数字。虽然小数点前面不是必须有整数，但推荐加上。

```jsx
let floatNum1 = 1.1
let floatNum2 = 0.1
let floatNum3 = 0.1 // 有效，但不推荐
```

因为存储浮点值使用的内存空间是存储整数值的两倍，所以 ECMAScript 总是想方设法把值转换为整数。在小数点后面没有数字的情况下，数值就会变成整数。类似地，如果数值本身就是整数，只是小数点后面跟着 0（如 1.0），那它也会被转换为整数。

```jsx
let floatNum1 = 1 // 小数点后面没有数字，当成整数1处理
let floatNum2 = 10.0 // 小数点后面是零，当成整数10处理
```

对于非常大或非常小的数值，浮点值可以用科学记数法来表示。科学计数法用于表示一个应该乘以 10 的给定次幂的数值。ECMAScript 中科学记数法的格式要求是一个数值（整数或浮点数）后跟一个大写或小写的字母 e，再加上一个要乘的 10 的多少次幂。

```jsx
let floatNum = 3.125e7 // 等于31_250_000
```

在这个例子中，`floatNum`等于 31 250 000，只不过科学记数法更简洁。

科学记数法也可以表示非常小的数值。默认情况下，ECMAScript 会将小数点后至少包含 6 个零的浮点值转换为科学记数法（例如，`0.000 000 3`会被转换为`3e-7`）。

浮点值的精确度最高可达 17 位小数，但在算术计算中远不如整数精确。例如，0.1 加 0.2 得到的不是 0.3，而是 0.300 000 000 000 000 04。由于这种微小的舍入错误，导致很难测试特定的浮点值。例如下面的例子：

```jsx
if (a + b === 0.3) {
  // 别这么干！
  console.log('You got 0.3.')
}
```

这里检测两个数值之和是否等于 0.3。如果两个数值分别是 0.05 和 0.25，或者 0.15 和 0.15，那没问题。但如果是 0.1 和 0.2，如前所述，测试将失败。因此永远不要测试某个特定的浮点值。

> 之所以存在这种舍入错误，是因为使用了 IEEE 754 数值，这种错误并非 ECMAScript 所独有。其他使用相同格式的语言也有这个问题。

### 值的范围

由于内存的限制，ECMAScript 并不支持表示这个世界上的所有数值。ECMAScript 可以表示的最小数值保存在`Number.MIN_VALUE`种，这个值在多数浏览器中 5e-324；可以表示的最大数值保存在`Number.MAX_VALUE`中，这个值在多数浏览器中是 1.797 693 134 862 315 7e+308。如果某个计算得到的数值超过了 JavaScript 可以表示的范围，那么这个数值会被自动转换为一个特殊的`Infinity`（无穷）值。任何无法表示的负数以`-Infinity`（负无穷大）表示，任何无法表示的正数以`Infinity`（正无穷大）表示。

如果计算返回正`Infinity`或负`Infinity`，则该值将不能再进一步用于任何计算。这是因为`Infinity`没有可用于计算的数值表示形式。要确定一个值是不是有限大（即介于 JavaScript 能表示的最小值和最大值之间），可以使用`isFinite()`函数，如下所示：

```jsx
let result = Number.MAX_VALUE + Number.MAX_VALUE
console.log(isFinite(result)) //flase
```

虽然超出有限数值范围的计算并不多见，但总归还是有可能的。因此在计算非常大或非常小的数值时，有必要监测一下计算结果是否超出范围。

> 使用`Number.NEGATIVE_INFINITY`和`Number.POSITIVE_INFINITY`也可以获取正、负`Infinity`。没错，这两个属性包含的值分别就是`-Infinity`和`Infinity`。

### `NaN`

又一个特殊的数值叫`NaN`，意思是“不是数值”（Not a Number），用于**表示本来要返回数值的操作失败了**（而不是抛出错误）。比如，用 0 除任意数值在其他语言中通常都会导致错误，从而中止代码执行。但在 ECMAScript 中，0、+0 或-0 相除都会返回`NaN`：

```jsx
console.log(0 / 0) // NaN
console.log(-0 / +0) // NaN
```

如果分子是非 0 值，分母是有符号 0 或无符号 0，则会返回`Infinity`或`-Infinity`：

```jsx
console.log(5 / 0) // Infinity
console.log(5 / -0) // -Infinity
```

`NaN`有几个独特的属性。首先，任何设计`NaN`的操作使用返回`NaN`（如`NaN/10`），在连续多步计算时这可能是个问题。其次，`NaN`不等于包括`NaN`在内的任何值。例如，下面的比较操作会返回`false`：

```jsx
console.log(NaN === NaN) // false
```

为此，ECMAScript 提供了`isNaN()`函数。该函数接收一个参数，可以是任意数据类型，然后判断这个参数是否“不是数值”。把一个值传给`isNaN()`后，该函数会尝试把它转换为数值。某些非数值的值可以直接转换成数值，如字符串`"10"`或布尔值。任何不能转换为数值的值都会导致这个函数返回`true`。举例如下：

```jsx
console.log(isNaN(NaN)) // true
console.log(isNaN(10)) // false, 10是数值
console.log(isNaN('10')) // false，可以转换为数值10
console.log(isNaN('blue')) // true，不可以转换为数值
console.log(isNaN(true)) // false，可以转换为数值1
```

上述的例子测试了 5 个不同的值。首先测试的是`NaN`本身，显然会返回`true`。接着测试了数值 10 和字符串`"10"`，都返回`false`，因为它们的数值都是 10。字符串`"blue"`不能转换为数值，因此函数返回`true`。布尔值`true`可以转换为数值 1，因此返回`false`。

> 虽然不常见，但是`isNaN()`可以用于测试对象。此时，首先会调用对象的`valueOf()`方法，然后再确定返回的值是否可以转换为数值。如果不能，再调用`toString()`方法，并测试其返回值。这通常是 ECMAScript 内置函数和操作符的工作方式。

### 数值转换

有三个函数可以将非数值转换为数值：`Number()`、`parseInt()`和`parseFloat()`。`Number()`是转型函数，可以用于任何数据类型。后两个函数主要用于将字符串转换为数值。对于同样的参数，这 3 个函数执行的操作也不同。

`Number()`函数基于如下规则执行转换：

- 布尔值，`true`转换为 1，`false`转换为 0。
- 数值，直接返回。
- `null`，返回 0。
- `undefined`，返回`NaN`。
- 字符串，应用以下规则：

  - 如果字符串包含数值字符，包括数值字符前面带加、减号的情况，则转换为一个十进制数值。因此，`Number(1)`返回 1，`Number("123")`返回 123，`Number("011")`返回 123，`Number("011")`返回 11（忽略前面的零）。
  - 如果字符串包含有效的浮点值格式如`"1.1"`，则会转换为相应的浮点值。（同样，忽略前面的零）。
  - 如果字符串包含有效的十六进制格式如`"0xf"`，则会转换为与该十六进制对应的十进制整数值。
  - 如果是空字符串（不包含字符），则返回 0。
  - 如果字符串包含除上述情况之外的其他字符，则返回`NaN`。

- 对象，调用`valueOf()`方法，并按照上述规则转换返回的值。如果转换结果是`NaN`，则调用`toString()`方法，再按照转换字符串的规则转换。

从不同数据类型到数值的转换有时候会比较复杂，看一看`Number()`的转换规则就知道了。下面是几个具体的例子：

```jsx
let num1 = Number('Hello World') // NaN
let num2 = Number('') // 0
let num3 = Number('000011') // 11
let num4 = Number(true) // 1
```

可以看到，字符串`"Hello world"`转换之后是`NaN`，因为它找不到对应的数值。空字符串转换后是 0。字符串 000011 转换后是 11，因为前面的零被忽略了。最后，`true`被转换为 1。

> 一元加操作符与`Number()`函数遵循相同的规则。

考虑到用`Number()`函数转换字符串时相对复杂且有点反常规，通常在需要得到整数时可以优先使用`parseInt()`函数。`parseInt()`函数更专注于字符串是否包含数值模式。字符串最前面的空格会被忽略，从第一个非空格字符串开始转换。如果第一个数值不是数值字符、加号或减号，`parseInt()`立即返回`NaN`。这意味着空字符串也会返回`NaN`（这一点跟`Number()`不一样，它返回 0）。如果第一个字符是数值字符、加号或减号，则继续依次检测每个字符，直到字符串末尾，或碰到非数值字符。例如，`"12345blue"`会被转换为 12345，因为`"blue"`会被完全忽略。类似地，`"22.5"`会被转换为 22，因为小数点不是有效的整数字符。

假设字符串中的第一个字符是数值字符，`parseInt()`函数也能识别不同的整数格式（十进制、八进制、十六进制）。换句话说，如果字符串以`"0x"`开头，就会被解释为十六进制整数。如果字符串以`"0"`开头，且紧跟着数值字符，在非严格模式下会被某些实现解释为八进制整数。

下面几个转换有助于理解上述规则：

```jsx
const num1 = parseInt('1234blue') // 1234
const num2 = parseInt('') // NaN
const num3 = parseInt('0xA') // 10，解释为十六进制整数
const num4 = parseInt('22.5') // 22
const num5 = parseInt('70') // 70，解释为十进制值
const num6 = parseInt('0xf') // 15，解释为十六进制整数
```

不同数值格式很容易混淆，因此`parseInt()`也接收第二个参数，用于指定底数（进制数）。如果知道要解析的值是十六进制，那么可以传入 16 作为第二个参数，以便正确解析：

```jsx
const num = parseInt('0xAF', 16) // 175
```

事实上如果提供了十六进制参数，那么字符串前面的`"0x"`可以省掉：

```jsx
const num1 = parseInt('AF', 16) // 175
const num2 = parseInt('AF') // NaN
```

在这个例子中，第一个转换是正确的，而第二个转换失败了。区别在于第一次传入了进制数作为参数，告诉`parseInt()`要解析的是一个十六进制字符串。而第二个转换检测到第一个字符就是非数值字符，随即自动停止并返回`NaN`。

通过第二个参数，可以极大扩展转换后获得的结果类型。例如：

```jsx
let num1 = parseInt('10', 2) // 2
let num2 = parseInt('10', 8) // 8
let num3 = parseInt('10', 10) // 10
let num4 = parseInt('10', 16) // 16
```

因为不传底数参数相当于让`parseInt()`自己决定如何解析，所以为避免出错，建议始终传给它第二个参数。

> 多数情况下解析的应该都是 10 进制数，此时第二个参数就要传入 10。

`parseFloat()`函数的工作方式跟`parseInt()`函数类似，都是从位置 0 开始检测每个字符。同样，它也是解析到字符串末尾或者解析到一个无效的浮点数值字符为止。这意味着第一次出现的小数点是有效的，但第二次出现的小数点就无效了，此时字符串的剩余字符都会被忽略。因此，`"22.34.5"`将转换成 22.34。

`parseFloat()`函数的另一个不同之处在于，它始终忽略字符串开头的零。这个函数能识别前面讨论的所有浮点格式，以及十进制格式（开头的零始终被忽略）。十六进制数值始终会返回 0，因为`parseFloat()`只解析十进制值，不能指定底数。最后如果字符串表示整数（没有小数点，或小数点后只有一个 0），则`parseFloat()`返回整数。

```jsx
let num1 = parseFloat('1234blue') // 1234
let num2 = parseFloat('0xA') // 0
let num3 = parseFloat('22.5') // 22.5
let num4 = parseFloat('22.34.5') // 22.34
let num5 = parseFloat('0908.5') // 908.5
let num6 = parseFloat('3.125e7') // 31250000
```

## `String`类型

`String`（字符串）数据类型表示零或多个 16 位 Unicode 字符序列。字符串可以使用双引号`"`、单引号`'`或反引号`` ` ``表示。

跟某些语言中使用不同的引号会改变对字符串的解释方式不同，ECMAScript 语法中表示字符串的引号没有区别。不过要注意的是，以某种引号作为字符串开头，必须依然以该种引号作为字符串结尾。

### 字符串字面量

字符串数据类型包含一些字符字面量，用于表示非打印字符或有其他用途的字符。

|  字面量   |                                                  含义                                                  |
| :-------: | :----------------------------------------------------------------------------------------------------: |
|   `\n`    |                                                  换行                                                  |
|   `\t`    |                                                  制表                                                  |
|   `\b`    |                                                  退格                                                  |
|   `\r`    |                                                  回车                                                  |
|   `\f`    |                                                  换页                                                  |
|   `\\`    |                                               反斜杠`\`                                                |
|   `\'`    |                                                 单引号                                                 |
|   `\"`    |                                                 双引号                                                 |
| `` \`  `` |                                                 反引号                                                 |
|  `\xnn`   |                           以十六进制编码`nn`表示的字符，例如`\x41`等于`"A"`                            |
| `\unnnn`  | 以十六进制编码`nnnn`表示的 Unicode 字符（其中`n`是十六进制数值 0 ～ F），例如`\u03a3`等于希腊字符`"Σ"` |

这些字符字面量可以出现在字符串中的任意位置，也可以作为单个字符被解释。

```jsx
const text = 'This is the letter sigma: \u03a3'
```

在这个例子中，即使包含 6 个字符长的转义序列，变量`text`仍然是 28 个字符长。因为转移序列表示一个字符，所以只能算一个字符。

字符串的长度可以通过其`length`属性获取：

```jsx
console.log(text.length) // 28
```

这个属性返回字符串中 16 位字符的个数。

> 如果字符串中包含双字节字符，那么`length`属性返回的值可能不是准确的字符数。

### 字符串的特点

ECMAScript 中的字符串是不可变的（immutable），意思是一旦创建，它们的值就不能变了。要修改某个变量中的字符串值，必须先销毁原始的字符串，然后将包含新值的另一个字符串保存到该变量，如下所示：

```jsx
let lang = 'Java'
lang = lang + 'Script'
```

这里变量`lang`一开始包含字符串`"Java"`。紧接着，`lang`被重新定义为包含`"Java"`和`"Script"`的组合，即`JavaScript`。整个过程首先会分配一个足够容纳 10 个字符的空间，然后填充上`"Java"`和`"Script"`。最后销毁原始的字符串`"Java"`和`"Script"`，因为这两个字符串都没有用了。所有处理都是在后台发生的，而这也是一些早期的浏览器（如 Firefox1.0 之前的版本和 IE6.0）拼接字符串时非常慢的原因。这些浏览器在后来的版本中都有针对性地解决了这个问题。

### 转换为字符串

有两种方式把一个值转换为字符串。首先是使用几乎所有值都有的`toString()`方法。这个方法唯一的用途就是返回当前值的字符串等价物。

```jsx
let age = 11
let ageAsString = age.toString() // "11"
let found = true
let foundAsString = found.toString() // "true"
```

`toString()`方法可见于数值、布尔值、对象和字符串值。（没错，字符串值也有`toString()`方法，该方法只是简单地返回自身的一个副本。）`null`和`undefined`值没有`toString()`方法。

多数情况下，`toString()`不接收任何参数。不过，在对数值调用这个方法时，`toString()`可以接收一个底层参数，即以什么底数来输出数值的字符串表示。默认情况下，`toString()`返回数值的十进制字符串表示。而通过传入参数，可以得到数值的二进制、八进制、十六进制，或者其他任何有效基数的字符串表示：

```jsx
let num = 10
num.toString() // "10"
num.toString(2) // "1010"
num.toString(8) // "12"
num.toString(10) // "10"
num.toString(16) // "a"
```

这个例子展示了传入底数参数时，`toString()`输出的字符串值也随之改变。数值 10 可以输出为任意数值格式。注意，默认情况下（不穿参数）的输入与传入参数 10 得到的结果相同。

如果你不确定一个值是不是`null`或`undefined`，可以使用`String()`转型函数，它始终返回表示相应类型值的字符串。`String()`函数遵循如下规则。

- 如果值有`toString()`方法，则调用该方法（不传参数）并返回结果。
- 如果值是`null`，返回`"null"`。
- 如果值时`undefined`，返回`"undefined"`。

> 使用加号操作符给一个值加上一个空字符串也可以将其转换为字符串。

### 模板字面量

ES6 新增了使用模板字面量定义字符串的能力。与使用单引号或双引号不同，模板字面量保留换行符，可以跨行定义字符串：

```jsx
let myMultiLineString = 'first line\nsecond line'
let myMultiLineTemplateLiteral = `first line 
second line`

console.log(myMultiLineString)
// first line
// second line

console.log(myMultiLineTemplateLiteral)
// first line
// second line

console.log(myMultiLineString === myMultiLineTemplateLiteral) // true
```

顾名思义，模板字面量在定义模板时特别有用，例如下面的 HTML 模板：

```jsx
let pageHTML = `
<div>
  <a href="#">
    <span>Jake</span>
  </a>
</div>`
```

由于模板字面量会保持反引号内部的空格，因此在使用时要格外注意。格式正确的模板字符串看起来可能会缩进不当。

```jsx
// 这个模板字面量在换行符之后有 25 个空格符
let myTemplateLiteral = `first line
second line`
console.log(myTemplateLiteral.length) // 47 5

// 这个模板字面量以一个换行符开头
let secondTemplateLiteral = `
first line
second line`
console.log(secondTemplateLiteral[0] === '\n') // true

// 这个模板字面量没有意料之外的字符
let thirdTemplateLiteral = `first line second line`
console.log(thirdTemplateLiteral)
// first line
// second line
```

### 字符串插值

模板字符串最常用的一个特性是支持字符串插值，也就是可以在一个连续定义中插入一个或多个值。技术上讲，模板字符串不是字符串，而是一种特殊的 JavaScript 句法表达式，只不过求值后得到的是字符串。模板字面量在定义时立即求值并转换为字符串实例，任何插入的变量也会从它们最接近的作用域中取值。

字符串插值通过在`${}`中使用一个 JavaScript 表达式实现。

```jsx
let value = 5
let exponent = 'second'

let interpolatedString = `${value} to the ${exponent} power is ${value * value}`

console.log(interpolateString) // 5 to the second power is 25
```

所有插入的值都会使用`toString()`强制转型为字符串，而且任何 JavaScript 表达式都可以用于插值。嵌套的模板字符串无序转义。

在表达式转换为字符串时会调用`toString()`：

```jsx
const foo = {
  toString() {
    return 'World'
  },
}
console.log(`Hello, ${foo}!`) // Hello, World!
```

在插值表达式中可以调用函数和方法：

```jsx
function capitalize(word) {
  return `${word[0].toUpperCase()}${word.slice(1)}`
}
console.log(`${capitalize('hello'), ${capitalize('world')}!`) // Hello, World!
```

此外模板也可以插入自己之前的值：

```jsx
let value = ''
function append() {
  value = `${value}abc`
  console.log(value)
}

append() // abc
append() // abcabc
append() // abcabcabc
```

### 模板字面量标签函数

模板字面量页支持定义**标签函数**（tag function），而通过标签函数可以自定义插值行为。标签函数会接收被插值记号分隔后的模板和对每个表达式求值的结果。

标签函数本身是一个常规函数，通过前缀到模板字面量来引用自定义行为，如下例所示。标签函数接收到的参数依次是**原始字符串数组**和对每个表达式求值的结果。这个函数的返回值是对模板字面量求值得到的字符串。

最好通过一个例子来理解：

```jsx
let a = 6
let b = 9

function simpleTag(strings, ...expressions) {
  console.log(strings)
  for (const expression of expressions) {
    console.log(expression)
  }

  return 'foobar'
}

let taggedResult = simpleTag`${a} + ${b} = ${a + b}`

// ["", " + ", " = ", ""]
// 6
// 9
// 15

console.log(taggedResult) // "foobar"
```

对于有*n*个插值的模板字面量，传给标签函数的表达式参数的个数始终是*n*，而传给标签函数的第一个参数所包含的字符串个数则始终是*n+1*。因此，如果想要把这些字符串和对表达式求值的结果拼接起来作为默认返回的字符串，可以这样做：

```jsx
let a = 6
let b = 9

function zipTag(strings, ...expressions) {
  return (
    strings[0] + expressions.map((e, i) => `${e}${strings[i + 1]}`).join('')
  )
}

let untaggedResult = `${a} + ${b} = ${a + b}`
let taggedResult = zipTag`${a} + ${b} = ${a + b}`

console.log(untaggedResult) // "6 + 9 = 15"
console.log(taggedResult) // "6 + 9 = 15"
```

### 原始字符串

使用模板字面量也可以直接获取原始的模板字面量内容（如换行符或 Unicode 字符），而不是被转换后的字符表示。为此，可以使用默认的`String.raw`函数。

```jsx
// Unicode示例
// \u00A9是版权符号
console.log(`\u00a9`) // ©
console.log(String.raw`\u00a9`) // \u00a9

// 换行符示例
console.log(`first line\nsecond line`)
// first line
// second line

console.log(String.raw`first line\nsecond line`) // "first line\nsecond line"

// 对于实际的换行符来说是不行的
// 它们不会被转换成转义序列的形式
console.log(`first line
second line`)
// first line
// second line

console.log(String.raw`first line
second line`)
// first line
// second line
```

另外，也可以通过标签函数的第一个参数，即字符串数组的`.raw`属性取得每个字符串的原始内容：

```jsx
function printRaw(strings) {
  console.log('Actual characters:')
  for (const string of strings) {
    console.log(string)
  }
  console.log('Escaped characters;')
  for (const rawString of stings.raw) {
    console.log(rawString)
  }
}

printRaw`\u00A9${'and'}\n`
// Actual characters:
// ©
//（换行符）
// Escaped characters:
// \u00A9
// \n
```

## `Symbol`类型

`Symbol`（符号）是 ES6 新增的数据类型。符号是原始值，且符号示例是唯一、不可变的。符号的用途是确保对象属性使用唯一标识符，不会发生属性冲突的危险。

尽管听起来与私有属性有点类似，但是符号并不是为了提供私有属性的行为才增加的（尤其是因为 Object API 提供了方法，可以更方便地发现符号属性）。相反，符号就是用来创建唯一记号，进而用作非字符串形式的对象属性。

### 符号的基本用法

符号需要使用`Symbol()`函数初始化。因为符号本身是原始类型，所以`typeof`操作符对符号返回`symbol`。

```jsx
let sym = Symbol()
console.log(typeof sym) // symbol
```

调用`Symbol()`函数，也可以传入一个字符串参数作为对符号的描述，将来可以通过这个字符串来调试代码。但是这个字符串参数与符号定义或标识完全无关。

```jsx
let genericSymbol = Symbol()
let otherGenericSymbol = Symbol()

let fooSymbol = Symbol('foo')
let otherFooSymbol = Symbol('foo')

console.log(genericSymbol === otherGenericSymbol) // false
console.log(fooSymbol === otherFooSymbol) // false
```

符号没有字面量语法，这也是它们发挥作用的关键。按照规范，你只要创建`Symbol()`示例并将其用作对象的新属性，就可以保证它不会覆盖已有的对象属性，无论是符号属性还是对象属性。

```jsx
let genericSymbol = Symbol()
console.log(genericSymbol) // Symbol()

let fooSymbol = Symbol('foo')
console.log(fooSymbol) // Symbol(foo)
```

最重要的是，`Symbol()`函数不能与`new`关键字一起作为构造函数使用。这样做是为了避免创建符号包装对象，像使用`Boolean`、`String`或`Number`那样，它们都支持构造函数且可用于初始化包含原初始值的包装对象：

```jsx
let myBoolean = new Boolean()
console.log(typeof myBoolean) // "object"

let myString = new String()
console.log(typeof myString) // "object"

let myNumber = new Number()
console.log(typeof myNumber) // "object"

let mySymbol = new Symbol() // TypeError: Symbol is not a constuctor
```

如果你确实想使用符号包装对象，可以借用`Object()`函数：

```jsx
let mySymbol = Symbol()
let myWrappedSymbol = Object(mySymbol)
console.log(typeof myWrappedSymbol) // "object"
```

### 使用全局符号注册表

如果运行时的不同部分需要共享和重用符号实例，那么可以用一个字符串作为键，在全局符号注册表中创建并重用符号。

为此，需要使用`Symbol.for()`方法：

```jsx
let fooGlobalSymbol = Symbol.for('foo')
console.log(typeof fooGlobalSymbol) // symbol
```

`Symbol.for()`对每个字符串键都执行幂等操作。第一次使用某个字符串调用时，它会检查全局运行时注册表，发现不存在对应的符号，于是就会生成一个新符号实例并添加到注册表中。后续使用相同字符串的调用同样会检查注册表，发现存在与该字符串对应的符号，然后就会返回该符号实例。

```jsx
let fooGlobalSymbol = Symbol.for('foo') // 创建新符号
let ohterFooGlobalSymbol = Symbol.for('foo') // 重用已有符号

console.log(fooGlobalSymbol === otherFooGlobalSymbol) // true
```

全局注册表中的符号必须使用字符串键来创建，因此作为参数传给`Symbol.for()`的任何值都会被转换为字符串。此外，注册表中使用的键同时也会被用作符号描述。

```jsx
let emptyGlobalSymbol = Symbol.for()
console.log(emptyGlobalSymbol) // Symbol(undefined)
```

还可以使用`Symbol.keyFor()`来查询全局注册表，这个方法接收符号，返回该全局符号对应的字符串键。如果查询的不是全局符号，则返回`undefined`。

```jsx
// 创建全局符号
let s = Symbol.for('foo')
console.log(Symbol.keyFor(s)) // foo

// 创建普通符号
let s2 = Symbol('bar')
console.log(Symbol.keyFor(s2)) // undefined
```

如果传给`Symbol.keyFor()`的不是符号，该方法会抛出`TypeError`：

```jsx
Symbol.keyFor(123) // TypeError: 123 is not a symbol
```

### 使用符号作为属性

凡是可以使用字符串或者数值作为属性的地方，都可以使用符号。这就包括了对象字面量属性和`Object.defineProperty()`或`Object.defineProperties()`定义的属性。对象字面量只能在计算属性语法中使用符号作为属性。

```jsx
const s1 = Symbol('foo')
const s2 = Symbol('bar')
const s3 = Symbol('baz')
const s4 = Symbol('qux')

const o = {
  [s1]: 'foo val',
}

console.log(o)
// {Symbol(foo): foo val}

Object.defineProperty(o, s2, { value: 'bar val' })

console.log(o)
// {Symbol(foo): foo val, Symbol(bar): bar val}

Object.defineProperties(o, {
  [s3]: { value: 'baz, val' },
  [s4]: { value: 'qux val' },
})

console.log(o)
// {Symbol(foo): foo val, Symbol(bar): bar val,
//  Symbol(baz): baz val, Symbol(qux): qux val}
```

类似于`Object.getOwnPropertyNames()`返回对象实例的常规属性数组，`Object.getOwnPropertySymbols()`返回对象实例的符号属性数组。这两个方法的返回值彼此互斥。`Object.getOwnPropertyDescriptors()`会返回同时包含常规符和符号属性描述的对象。`Reflect.ownKeys()`会返回两种类型的键：

```jsx
const s1 = Symbol('foo')
const s2 = Symbol('bar')

const o = {
  [s1]: 'foo val',
  [s2]: 'bar val',
  baz: 'baz val',
  qux: 'qux val',
}

console.log(Object.getOwnPropertySymbols(o))
// [Symbol(foo), Symbol(bar)]

console.log(Object.getOwnPropertyNames(o))
// ['baz', 'qux']

console.log(Object.getOwnPropertyDescriptors(o))
// {baz: {...}, qux: {...}, Symbol(foo): {...}, Symbol(bar): {...}}

console.log(Reflect.ownKeys(o))
// ["baz", "qux", Symbol(foo), Symbol(bar)]
```

因为符号属性是对内存中符号的一个引用，所以直接创建并用作属性的符号不会丢失。但是，如果没有显式地保存对这些属性的引用，那么必须遍历对象的所有符号才能找到相应的属性键：

```jsx
const o = {
  [Symbol('foo')]: 'foo val',
  [Symbol('bar')]: 'bar val',
}

console.log(o)
// {Symbol(foo): 'foo val', Symbol(bar): 'bar val'}

const barSymbol = Object.getOwnPropertySymbols(o).find(symbol =>
  symbol.toString().match(/bar/)
)

console.log(barSymbol)
// Symbol(bar)
```

### 常用内置符号

ES6 也引入了一批**常用内置符号**（well-known symbol），用于暴露语言内部行为，开发者可以访问、重写或模拟这些行为。这些内置符号都以`Symbol`工厂函数字符串属性的形式存在。

这些内置符号最重要的用途之一是重新定义它们，从而改变原生结构的行为。比如，我们知道`for-of`循环会在相关对象上使用`Symbol.iterator`属性，那么就可以通过在自定义对象上重新定义`Symbol.iterator`的值，来改变`for-of`在迭代该对象时的行为。

这些内置符号也没有什么特别之处，它们就是全局函数`Symbol`的普通字符串属性，指向一个符号的实例。**所有内置符号属性都是不可写、不可枚举、不可配置的**。

> 在提到 ECMAScript 规范时，经常会引用到符号在规范中的名称，前缀为`@@`。例如，`@@iterator`指的就是`Symbol.iterator`。

### `Symbol.asyncIterator`

根据 ECMAScript 规范，这个符号作为一个属性表示“一个方法，该方法返回对象默认的`AsyncIterator`。由`for-await-of`语句使用“。换句话说，这个符号表示实现异步迭代器 API 的函数。

`for-await-of`循环会利用这个函数执行异步迭代操作。循环时，它们会调用以`Symbol.asyncIterator`为键的函数，并期望这个函数返回一个实现迭代器 API 的对象。很多时候，返回的对象是实现该 API 的`AsyncGenerator`：

```jsx
class Foo {
  async *[Symbol.asyncIterator]() {}
}

let f = new Foo()

console.log(f[Symbol.asyncIterator]())
// AsyncGenerator {<suspended>}
```

技术上，这个由`Symbol.asyncIterator`函数生成的对象应该通过其`next()`方法陆续返回`Promise`实例。可以通过显式调用`next()`方法返回，也可以隐式地通过异步生成器函数返回：

```jsx
class Emitter {
  constructor(max) {
    this.max = max
    this.asyncIdx = 0
  }

  async *[Symbol.asyncIterator]() {
    while (this.asyncIdx < this.max) {
      yield new Promise(resolve => resolve(this.asyncIdx++))
    }
  }
}

async function asyncCount() {
  let emitter = new Emitter(5)

  for await (const x of emitter) {
    console.log(x)
  }
}

asyncCount()
// 0
// 1
// 2
// 3
// 4
```

> `Symbol.asyncIterator`是 ES2018 规范定义的，因此只有版本比较新的浏览器支持它。

### `Symbol.hasInstance`

根据 ECMAScript 规范，这个符号作为一个属性表示“一个方法，该方法决定一个构造器对象是否认可一个对象是它的实例。由`instanceof`操作符使用”。`instanceof`操作符可以用来确定一个对象实例的原型链上是否有原型。`instanceof`的典型使用场景如下：

```jsx
function Foo() {}
const f = new Foo()
console.log(f instanceof Foo) // true

class Bar {}
const b = new Bar()
console.log(b instanceof Bar) // true
```

在 ES6 中，`instanceof`操作符会使用`Symbol.hasInstance`函数来确定关系。以`Symbol.hasInstance`为键的函数会执行同样的操作，只是操作数对调了一下：

```jsx
function Foo() {}
const f = new Foo()
console.log(Foo[Symbol.hasInstance](f)) // true

class Bar {}
const b = new Bar()
console.log(Bar[Symbol.hasInstance](b)) // true
```

这个属性定义在`Function`的原型上，因此默认在所有函数和类上都可以调用。由于`instanceof`操作符会在原型链上寻找这个定义，就跟在原型链上寻找其他属性一样，因此可以在继承的类上通过静态方法重新定义这个函数：

```jsx
class Bar {}
class Baz extends Bar {
  static [Symbol.hasInstance]() {
    return false
  }
}

const b = new Baz()
console.log(Bar[Symbol.hasInstance](b)) // true
console.log(b instanceof Bar) // true
console.log(Baz[Symbol.hasInstance](b)) // false
console.log(b instanceof Baz) // false
```

### `Symbol.isConcatSpreadable`

根据 ECMAScript 规范，这个符号作为一个属性表示“一个布尔值，如果是`true`，则意味着对象应该用`Array.prototype.concat()`打平其数组元素。ES6 中的`Array.prototype.concat()`方法会根据接收到的对象类型选择如何将一个类数组对象拼接成数组实例。覆盖`Symbol.isConcatSpreadable`的值可以修改这个行为。覆盖`Symbol.isConcatSpreadable`的值可以修改这个行为。

数组对象默认情况下会被打平到已有的数组，`false`或假值会导致整个对象被追加到数组末尾。类数组对象默认情况下会被追加到数组末尾，`true`或真值会导致这个类数组对象被打平到数组实例。其他不是类数组对象在`Symbol.isConcatSpreadable`被设置为`true`的情况下会被忽略。

```jsx
const initial = ['foo']

const array = ['bar']
console.log(array[Symbol.isConcatSpreadable]) // undefined
console.log(initial.concat(array)) // ['foo', 'bar']
array[Symbol.isConcatSpreadable] = false
console.log(initial.concat(array)) // ['foo', Array(1)]

const arrayLikeObject = { length: 1, 0: 'baz' }
console.log(arrayLikeObject[Symbol.isConcatSpreadable]) // undefined
console.log(initial.concat(arrayLikeSpreadable)) // ['foo', {...}]
arrayLikeObject[Symbol.isConcatSpreadable] = true
console.log(initial.concat(arrayLikeObject)) // ['foo', 'baz']

const otherObject = new Set().add('qux')
console.log(otherObject[Symbol.isConcatSpreadable]) // undefined
console.log(initial.concat(otherObject)) // ['foo', Set(1)]
otherObject[Symbol.isConcatSpreadable] = true
console.log(initial.concat(otherObject)) // ['foo']
```

### `Symbol.iterator`

根据 ECMAScript 规范，这个符号作为一个属性表示“一个方法，该方法返回默认对象的迭代器。由`for-of`语句使用”。换句话说，这个符号表示实现迭代器 API 的函数。

`for-of`循环这样的语言结构会利用这个函数执行迭代操作。循环时，它们会调用以`Symbol.iterator`为键的函数，并默认这个函数会返回一个实现迭代器 API 的对象。很多时候，返回的对象是实现该 API 的`Generator`：

```jsx
class Foo {
  *[Symbol.iterator]() {}
}

const f = new Foo()

console.log(f[Symbol.iterator]())
// Generator {<suspended>}
```

技术上，这个由`Symbol.iterator`函数生成的对象应该通过其`next()`方法陆续返回值。可以通过显式地调用`next()`方法返回，也可以隐式地通过生成器函数返回。

```jsx
class Emitter {
  constructor(max) {
    this.max = max
    this.idx = 0
  }

  *[Symbol.iterator]() {
    while (this.idx < this.max) {
      yield this.idx++
    }
  }
}

function count() {
  const emitter = new Emitter(5)

  for (const x of emitter) {
    console.log(x)
  }
}

count()
// 0
// 1
// 2
// 3
// 4
```

### `Symbol.match`

根据 ECMAScript 规范，这个符号作为一个属性表示“一个正则表达式方法，该方法用正则表达式去匹配字符串。由`String.prototype.match()`方法使用”。`String.prototype.match()`方法会使用以`Symbol.match`为键的函数来对正则表达式求值。正则表达式的原型上默认有这个函数的定义，因此所有正则表达式实例默认是这个`String`方法的有效参数：

```jsx
console.log(RegExp.prototype[Symbol.match])
// f [Symbol.match]() { [native code] }

console.log('foobar'.match(/bar/))
// ["bar", index: 3, input: "foobar", groups: undefined]
```

给这个方法传入非正则表达式值会导致该值被转换为`RegExp`对象。如果想改变这种行为，让方法直接使用参数，则可以重新定义`Symbol.match`函数以取代默认对正则表达式求值的行为，从而让`match`方法使用非正则表达式实例。`Symbol.match`函数接收一个参数，就是调用`match()`方法的字符串实例。返回的值没有限制：

```jsx
class FooMatcher {
  static [Symbol.match](target) {
    return target.includes('foo')
  }
}

console.log('foobar'.match(FooMatcher)) // true
console.log('barbaz'.match(FooMatcher)) // false

class StringMatcher {
  constructor(str) {
    this.str = str
  }

  [Symbol.match](target) {
    return target.includes(this.str)
  }
}

console.log('foobar'.match(new StringMatcher('foo'))) // true
console.log('barbaz'.match(new StringMatcher('qux'))) // false
```

### `Symbol.replace`

根据 ECMAScript 规范，这个符号作为一个属性表示“一个正则表达式方法，该方法替换一个字符串中匹配的子串。由`String.prototype.replace()`“方法使用。`String.prototype.replace()`方法会使用以`Symbol.replace`为键的函数来对正则表达式求值。正则表达式的原型上默认有这个函数的定义，因此所有正则表达式实例默认是这个`String`方法的有效参数：

```jsx
console.log(RegExp.prototype[Symbol.replace])
// f [Symbol.replace]() { [native code] }

console.log('foobarbaz'.replace(/bar/, 'qux'))
// 'fooquxbaz'
```

给这个方法传入非正则表达式会导致该值被转换为`RegExp`对象。如果想改变这种行为，让方法直接使用参数，可以重新定义`Symbol.replace`函数以取代对正则表达式求值的行为，从而让`replace()`方法使用非正则表达式实例。`Symbol.replace`函数接收两个参数，即调用`replace()`方法的字符串实例和替换字符串。返回的值没有限制：

```jsx
class FooReplacer {
  static [Symbol.replace](target, replacement) {
    return target.split('foo').join(replacement)
  }
}

console.log('barfoobaz'.replace(FooReplacer, 'qux'))
// "barquxbaz"

class StringReplacer {
  constructor(str) {
    this.str = str
  }

  [Symbol.replace](target, replacement) {
    return target.split(this.str).join(replacement)
  }
}

console.log('barfoobaz'.replace(new StringReplacer('foo'), 'qux'))
// "barquxbaz"
```

### `Symbol.search`

根据 ECMAScript 规范，这个符号作为一个属性表示“一个正则表达式方法，该方法返回字符串中匹配正则表达式的索引。由`String.prototype.search()`方法使用“。`String.prototype.search()`方法会使用以`Symbol.search`为键的函数来对正则表达式求值。正则表达式的原型上默认由这个函数的定义，因此所有正则表达式实例默认是这个`String`方法的有效参数：

```jsx
console.log(RegExp.prototype[Symbol.search])
// f [Symbol.search]() { [native code] }

console.log('foobar'.search(/bar/))
// 3
```

给这个方法传入非正则表达式值会导致该值被转换为`RegExp`对象。如果想改变这种行为，让方法直接使用参数，可以重新定义`Symbol.search`函数以取代默认对正则表达式求值的行为，从而让`search()`方法使用非正则表达式实例。`Symbol.search`函数接收一个参数，就是调用`match()`方法的字符串实例。返回的值没有限制：

```jsx
class FooSearcher {
  static [Symbol.search](target) {
    return target.indexOf('foo')
  }
}

console.log('foobar'.search(FooSearcher)) // 0
console.log('barfoo'.search(FooSearcher)) // 3
console.log('barbaz'.search(FooSearcher)) // -1

class StringSearcher {
  constructor(str) {
    this.str = str
  }

  [Symbol.search](target) {
    return target.indexOf(this.str)
  }
}

console.log('foobar'.search(new StringSearcher('foo'))) // 0
console.log('barfoo'.search(new StringSearcher('foo'))) // 3
console.log('barbaz'.search(new StringSearcher('qux'))) // -1
```

### `Symbol.species`

根据 ECMAScript 规范，这个符号作为一个属性表示“一个函数值，该函数作为创建派生对象的构造函数”。这个属性在内置类型中最常用，对于内置类型实例方法的返回值暴露实例化派生对象的方法。用`Symbol.species`定义静态的获取器（getter）方法，可以覆盖新创建实例的原型定义。

```jsx
class Bar extends Array {}
class Baz extends Array {
  static get [Symbol.species]() {
    return Array
  }
}

let bar = new Bar()
console.log(bar instanceof Array) // true
console.log(bar instanceof Bar) // true
bar = bar.concat('bar')
console.log(bar instanceof Array) // true
console.log(bar instanceof Bar) // true

let baz = new Baz()
console.log(baz instanceof Array) // true
console.log(baz instanceof Baz) // true
baz = baz.concat(baz)
console.log(baz instanceof Array) // true
console.log(baz instanceof Baz) // false
```

> 关于这个内置符号的使用，可以参见[MDN 上的示例](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species#%E7%A4%BA%E4%BE%8B)。

### `Symbol.split`

根据 ECMAScript 规范，这个符号作为一个属性表示“一个正则表达式方法，该方法在匹配正则表达式的索引位置拆分字符串。由`String.prototype.split()`方法使用”。`String.prototype.split()`方法会使用以`Symbol.split`为键的函数来对正则表达式求值。正则表达式的原型上默认有这个函数的定义，因此所有正则表达式实例默认是这个`String`方法的有效参数。

```jsx
console.log(RegExp.prototype[Symbol.split])
// f [Symbol.split]() { [native code] }

console.log('foobarbaz'.split(/bar/))
// ['foo', 'baz']
```

给这个方法传入非正则表达式值会导致该值被转换为`RegExp`对象。如果想改变这种行为，让方法直接使用参数，可以重新定义`Symbol.split`函数以取代默认对正则表达式求值的行为，从而让`split()`方法使用非正则表达式实例。`Symbol.split`函数接收一个参数，就是调用`match()`方法的字符串实例。返回的值没有限制：

```jsx
class FooSpliter {
  static [Symbol.split](target) {
    return target.split('foo')
  }
}

console.log('barfoobaz'.split(FooSplitter))
// ["bar", "baz"]

class StringSplitter {
  constructor(str) {
    this.str = str
  }

  [Symbol.split](target) {
    return target.split(this.str)
  }
}

console.log('barfoobaz'.split(new StringSplitter('foo')))
// ["bar", "baz"]
```

### `Symbol.toPrimitive`

根据 ECMAScript 规范，这个符号作为一个属性表示“一个方法，该方法将对象转换为相应的原始值。由`ToPrimitive`抽象操作使用”。很多内置操作都会尝试强制将对象转换为原始值，包括字符串、数值和未指定的原始类型。对于一个自定义对象实例，通过在这个实例的`Symbol.toPrimitive`属性上定义一个函数可以改变默认行为。

根据提供给这个函数的参数（`sting`、`number`或`default`），可以控制返回的原始值：

```jsx
class Foo {}
let foo = new Foo()

console.log(3 + foo) // "3[object Object]"
console.log(3 - foo) // NaN
console.log(String(foo)) // "[object Object]"

class Bar {
  constructor() {
    this[Symbol.toPrimitive] = function (hint) {
      switch (hint) {
        case 'number':
          return 3
        case 'stirng':
          return 'string bar'
        default:
          return 'default bar'
      }
    }
  }
}

let bar = new Bar()

console.log(3 + bar) // "3default bar"
console.log(3 - bar) // 0
console.log(String(bar)) // "string bar"
```

### `Symbol.toStringTag`

根据 ECMAScript 规范，这个符号作为一个属性表示“一个字符串，该字符串用于创建对象的默认字符串描述。由内置方法`Object.prototype.toString()`使用”。

通过`toString()`方法获取对象标识事，会检索由`Symbol.toStringTag`指定的实例标识符，默认为`"Object"`。内置类型已经指定了这个值，但自定义实例还需要明确定义：

```jsx
const s = new Set()

console.log(s) // Set(0) {}
console.log(s.toString()) // [object Set]
console.log(s[Symbol.toStringTag]) // Set

class Foo {}
const foo = new Foo()

console.log(foo) // Foo {}
console.log(foo.toString()) // [object Object]
console.log(foo[Symbol.toStringTag]) // undefined

class Bar {
  constructor() {
    this[Symbol.toStringTag] = 'Bar'
  }
}
const bar = new Bar()

console.log(bar) // Bar {}
console.log(bar.toString()) // [object Bar]
console.log(bar[Symbol.toStringTag]) // Bar
```

### `Symbol.unscopables`

根据 ECMAScript 规范，这个符号作为一个属性表示“一个对象，该对象所有的以及继承的属性，都会从关联的`with`环境绑定中排除”。设置这个符号并让其映射对应属性的键值为`true`，就可以阻止该属性出现在`with`绑定环境中，如下所示：

```jsx
const o = { foo: 'bar' }

with (o) {
  console.log(bar) // bar
}

o[Symbol.unscopables] = {
  foo: true,
}

with (o) {
  console.log(foo) // RefereceError
}
```

> 注意：不推荐使用`with`，因此也不推荐使用`Symbol.unscopables`。

## `Object`类型

ECMAScript 中的对象其实就是一组数据和功能的集合。对象通过`new`操作符后跟对象类型的名称来创建。开发者可以通过创建`Object`类型的实例来创建自己的对象，然后再给对象添加属性和方法：

```jsx
const o = new Object()
```

这个语法类似 Java，但是 ECMAScript 值要求在给构造函数提供参数时使用括号。如果没有参数，如上面例子所示，那么完全可以省略括号（不推荐）：

```jsx
const o = new Object() // 合法，但是不推荐
```

`Object`的实例本身不是很有用，但是理解与它相关的概念非常重要。类似 Java 中的`java.lang.Object`，ECMAScript 中的`Object`也是派生其他对象的基类。`Object`类型的所有属性和方法在派生的对象上同样存在。

每个`Object`实例都有如下属性和方法；

- `constructor`：用于创建当前对象的函数。在前面的例子中，这个属性的值就是`Object()`函数。
- `hasOwnProperty(propertyName)`：用于判断当前对象实例（不是原型）上是否存在给定的属性。要检查的属性名必须是字符串（例如`o.hasOwnProperty('name')`或符号。
- `isPrototypeOf(object)`：用于判断当前对象是否为另一个对象的原型。
- `propertyIsEnumerable(propertyName)`：用于判断给定的属性是否可以使用`for-in`语句枚举。与`hasOwnProperty()`一样，属性名必须是字符串。
- `toLocaleString()`：返回对象的字符串表示，该字符串反映对象所在的本地化执行环境。
- `toString()`：返回对象的字符串表示。
- `valueOf()`：将对象转换为原始值。很少需要自己调用`valueOf()`方法，当遇到要预期的原始值的对象时，JavaScript 会自动调用它。

> 注：这里《JavaScript 高级程序设计第 4 版》所写“返回对象对应的字符串、数值或布尔值表示。通常与 `toString()`的返回值相同。“阐述并不准确，可参见[MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf)。

因为在 ECMAScript 中`Object`是所有对象的基类，所以任何对象都有这些属性和方法。

> 严格来讲，ECMA-262 中的对象行为不一定适合 JavaScript 中的其他对象。例如浏览器环境中的 BOM 和 DOM 对象，都是由宿主环境定义和提供的宿主对象。而宿主对象不受 ECMA-262 约束，所以它们可能会也可能不会继承`Object`。

# 操作符

ECMA-262 描述了一组可用于操作数据值的**操作符**，包括数学操作符（例如加、减）、位操作符、关系操作符和相等操作符等。ECMAScript 中的操作符是独特的，因为它们可用于各种值，包括字符串、数值、布尔值，甚至还有对象。在应用给对象时，操作符通常会调用`valueOf()`和/或`toString()`方法来取得可以计算的值。

## 一元操作符

只操作一个值的操作符叫**一元操作符**（unary operator）。一元操作符是 ECMAScript 中最简单的操作符。

### 递增/递减操作符

递增和递减操祖父直接照搬自 C 语言，但有两个版本：前缀版和后缀版。顾名思义，前缀版就是位于要操作的变量前头，后缀版就是位于要操作的变量后头。前缀递增操作符会给数值加 1，把两个加号（`++`）放到变量前头即可：

```jsx
let age = 29
++age
```

在这个例子中，前缀递增操作符把`age`的值变成了 30。因此等价于：

```jsx
let age = 29
age = age + 1
```

前缀递减操作符也类似，只不过是从一个数值减 1。使用前缀递减操作符，只要把两个减号（`--`）放到变量前头即可：

```jsx
let age = 29
--age
```

执行之后，`age`的值变成了 28。

无论使用前缀递增还是前缀递减操作符，变量的值都会在语句被求值之前改变。（在计算机科学中，这通常被称为具有**副作用**。）看下面的例子：

```jsx
let age = 29
let anotherAge = --age + 2

console.log(age) // 28
console.log(anotherAge) // 30
```

在这个例子中，变量`anotherAge`以`age`减 1 后的值再加 2 进行初始化。因为递减操作先发生，所以`age`的值先变成 28，然后再加 2，结果是 30。

前缀递增和递减语句中的优先级是相等的，因此会从左到右依次求值。例如：

```jsx
let num1 = 2
let num2 = 20
let num3 = --num1 + num2
let num4 = num1 + num2

console.log(num3) // 21
console.log(num4) // 21
```

递增和递减的后缀版语法一样，只不过要放在变量后面。后缀版本和前缀版本的区别在于，后缀版本递增和递减在语句被求值后才发生。

**这四个操作符可以作用于任何值**，**意思是不限于整数——字符串、布尔值、浮点值，甚至对象都可以**。递增和递减操作符遵循如下规则：

- 对于字符串，如果是有效的数值形式，则转换为数值再应用改变。变量类型从字符串变成数值。
- 对于字符串，如果不是有效的数值形式，则将变量的值设置为`NaN`。变量类型从字符串变成数值。
- 对于布尔值，如果是`false`，则转换为 0 再应用改变。变量类型从布尔值变成数值。
- 对于布尔值，如果是`true`，则转换为 1 再应用改变。变量类型从布尔值变成数值。
- 对于浮点值，加 1 或减 1。
- 如果是对象，则调用其`valueOf()`方法取得可以操作的值。对得到的值应用上述规则。如果是`NaN`，则调用`toString()`并再次应用其他规则。变量类型从对象变成数值。

```jsx
let s1 = '2'
let s2 = 'z'
let b = false
let f = 1.1
let o = {
  valueOf() {
    return -1
  },
}

console.log(++s1)
console.log(++s2)
console.log(++b)
console.log(--f)
console.log(--o)

// 3
// NaN
// 1
// 0.10000000000000009
// - 2
```

### 一元加和减

一元加和减操作符对大多数开发者来说并不陌生，它们在 ECMAScript 中跟在数学的用途类似。一元加由一个加号表示，放在变量前面，对数值没有任何影响：

```jsx
let num = -22.5
console.log(+num) // -22.5
```

如果将一元加应用到非数值，则会执行与使用`Number()`转型函数一样的类型转换：布尔值`false`和`true`转换为 0 和 1，字符串根据特殊规则进行解析，对象会调用它们的`valueOf()`和/或`toString()`方法可以得到转换的值。

下面的例子演示了一元加在应用到不同数据类型时的行为：

```jsx
let s1 = '01'
let s2 = '1.1'
let s3 = 'z'
let b = false
let f = 1.1
let o = {
  valueOf() {
    return -1
  },
}

console.log(+s1)
console.log(+s2)
console.log(+s3)
console.log(+b)
console.log(+f)
console.log(+o)

// 1
// 1.1
// NaN
// 0
// 1.1
// -1
```

一元减由一个减号（`-`）表示，放在变量前头，主要用于把数值变成其相反数值。如果应用到非数值，会遵循和一元加同样的规则，先对它们进行转换，然后再取负值。

一元加和减操作符主要用于基本算术，但也可以像上面例子一样，用于数据类型转换。

## 位操作符

位操作符用于数值的底层操作，也就是操作内存中表示数据的比特（位）。ECMAScript 中的所有数字都以 IEEE 754 64 位格式存储，但位操作并不直接应用到 64 位表示，而是**先把值转换为 32 位整数**再进行位操作，之后再把结果转换为 64 位。对开发者而言，就好像只有 32 位整数一样，因为 64 位整数存储格式是不可见的。既然知道了这些，就只需要考虑 32 位整数即可。

有符号整数使用 32 位的前 31 位表示整数值。第 32 位表示数值的符号，如 0 表示正，1 表示负。这一个位称为**符号位**（sign bit），它的值决定了数值其余部分的格式。正值以真正的二进制格式存储，即 31 位中的每一位都代表 2 的幂。例如，数值 18 的二进制格式为 00000000000000000000000000010010。

负值以一种称为**二补数**（补码）的二进制编码存储。一个数值的补码通过如下 3 个步骤计算得到：

- 确定绝对值的二进制表示
- 找到数值的一补数（反码），换句话说，就是每个 0 都变成 1，每个 1 都变成 0
- 给结果加 1

> “补码系统的最大优点就是可以在加法或减法处理中，不需因为数字的正负而使用不同的计算方式。只要一种加法电路就可以处理各种有符号加法，而且减法可以用一个数加上另一个数的补码来表示，因此只要有加法电路及补码电路即可完成各种有符号数加法及减法，在电路设计上相当方便。另外，补码系统的 0 只有一个表示方式，这和反码系统不同（0 有两种表示方式），因此在判断数值是否为 0 时，只要比较一次即可。” —— [维基百科](https://zh.wikipedia.org/wiki/%E4%BA%8C%E8%A3%9C%E6%95%B8)

在将负值输出为一个二进制字符串时，我们只会得到一个前面加了减号的绝对值。例如：

```jsx
let num = -18
console.log(num.toString(2)) // "-10010"
```

在将-18 转换为二进制字符串时，结果得到-10010。转换过程会求得补码，然后再以更加符合逻辑的形式表示出来。

> 默认情况下，ECMAScript 中的所有整数都表示为有符号整数。不过，确实存在无符号整数。对无符号整数来说，第 32 位不表示符号，因为只有正值。无符号整数比有符号整数的范围更大，因为符号位被用来表示数值了。

在对 ECMAScript 中的数值应用位操作符时，后台会发生转换：64 位数值会转换为 32 位数值，然后执行位操作，最后再把结果从 32 位转换为 64 位存储起来。整个过程就像处理 32 位数值一样，这让二进制操作变得与其他语言类似。但这个转换也导致了一个奇特的副作用，即特殊值`NaN`和`Infinity`在位操作中都会被当成 0 处理。

如果将位操作符应用到非数值，那么首先会使用`Number()`函数将该值转换为数值（这个过程是自动的），然后再应用位操作。最终结果是数值。

### 按位非

按位非操作符用波浪符（`~`）表示，它的作用是返回数值的反码。按位非是 ECMAScript 中位数不多的几个二进制操作符之一。

```jsx
let num1 = 25 // 二进制00000000000000000000000000011001
let num2 = ~num1 // 二进制11111111111111111111111111100110
console.log(num2) // -26
```

这里，按位非操作符作用到了数值 25，得到的结果是-26。由此可以看出，按位非的最终效果是对数值取反并减 1，就像执行如下操作的结果一样：

```jsx
let num1 = 25
let num2 = -num1 - 1
console.log(num2) // "-26"
```

实际上，尽管两者返回的结果一样，但位操作的速度快得多。这是因为位操作是在数值的底层表示上完成的。

### 按位与

按位与操作符用和号（`&`）表示，有两个操作数。本质上，按位与就是将两个数的每个位对齐，然后基于真值表中的规则，对每一位执行相应的与操作。

按位与在两个位都是 1 时返回 1，在任何一位是 0 时返回 0。

```jsx
const result = 25 & 3
// 25 = 0000 0000 0000 0000 0000 0000 0001 1001
// 3 = 0000 0000 0000 0000 0000 0000 0000 0011
// AND = 0000 0000 0000 0000 0000 0000 0000 0001
console.log(result) // 1
```

### 按位或

按位或操作符用管道符（`|`）表示，同样有两个操作数。在至少一位是 1 时返回 1，两位都是 0 时返回 0。

仍然用按位与的示例，如果对 25 和 3 执行按位或，代码如下：

```jsx
let result = 25 | 3
console.log(result) // 27

// 25 = 0000 0000 0000 0000 0000 0000 0001 1001
// 3 = 0000 0000 0000 0000 0000 0000 0000 0011
// OR = 0000 0000 0000 0000 0000 0000 0001 1011
```

在参与计算的两个数中，有 4 位都是 1，因此它们直接对应到结果上。二进制码 11011 等于 27。

### 按位异或

按位异或用脱字符（`^`）表示，同样有两个操作数。按位抑或只在一位上是 1 的时候返回 1。

对数值 25 和 3 执行按位异或操作：

```jsx
let result = 25 ^ 3
console.log(result) // 26
// 25 = 0000 0000 0000 0000 0000 0000 0001 1001
// 3 = 0000 0000 0000 0000 0000 0000 0000 0011
// XOR = 0000 0000 0000 0000 0000 0000 0001 1010
```

两个数在 4 位上都是 1，但两个数的第 0 位都是 1，因此那一位在结果中就变成了 0。其余位上的 1 在另一个数上没有对应的 1，因此会直接传递到结果中。二进制码 11010 等于 26。

### 左移

左移操作符用两个小于号（`<<`）表示，会按照指定的位数将数值的所有位向左移动。比如，如果数值 2（二进制 10）向左移 5 位，就会得到 64（二进制 1000000），如下所示：

```jsx
let oldValue = 2 // 10
let newValue = oldValue << 5 // 10000000，即十进制64
```

注意在移位后，数值右端会空出 5 位。左移会以 0 填充这些空位，让结果是完整的 32 位数值。

左移会保留它所操作数值的符号。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1l6fqckzwj21fw0fugn5.jpg)

### 有符号右移

有符号右移由两个大号（`>>`）表示，会将数值的所有 32 位都向右移，同时保留符号（正或负）。有符号右移实际上是左移的逆运算。例如将 64 右移 5 位，就是 2。

```jsx
let oldValue = 64 // 1000000
let newValue = oldValue >> 5 // 10，即十进制2
```

同样，移位后就会出现空位。不过，右移后空位出现在左侧，且在符号位之后。ECMAScript 会用符号位的值来填充这些空位，以得到完整的数值。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1l6o2svwlj21hg0fggn7.jpg)

### 无符号右移

无符号右移用 3 个大于号表示（`>>>`），会将数值的所有 32 位都向右移。对于正数，无符号右移于有符号右移结果相同。

```jsx
let oldValue = 64 // 二进制1000000
let newValue = oldValue >>> 5 // 二进制10，即十进制2
```

对于负数，有时候差异会非常大。与有符号右移不同，无符号右移会给空位补 0，而不管符号位是什么。对正数来说，这跟有符号右移效果相同。但对负数来说，结果就差太多了。无符号右移操作符将负数的二进制表示当成正数的二进制表示来处理。因为负数时绝对值的补码，所以右移之后结果变得非常之大。如下：

```jsx
let oldValue = -65 // 等于二进制11111111111111111111111111000000
let newValue = oldValue >>> 5 // 等于十进制 134217726
```

在对-64 无符号右移 5 位后，结果是 134217726。

## 布尔操作符

对于编程语言来说，布尔操作符跟相等操作符几乎同样重要。如果没有能力测试两个值的关系，那么像`if-else`和循环这样的语句也没有什么用了。布尔操作符一共有 3 个：逻辑非、逻辑与和逻辑或。

### 逻辑非

逻辑非操作符由一个叹号（！）表示，可应用给 ECMAScript 中的任何值。这个操作符始终返回布尔值，无论应用到的是什么数值类型。逻辑非操作符会遵循如下规则。

- 如果操作数是对象，则返回`false`。
- 如果操作数是空字符串，则返回`true`。
- 如果操作数是非空字符串，返回`false`。
- 如果操作数是数值 0，则返回`true`。
- 如果操作数是非 0 数值（包括`Infinity`），则返回`false`。
- 如果操作数是`null`，则返回`true`。
- 如果操作数是`NaN`，则返回`true`。
- 如果操作数是`undefined`，则返回`true`。

逻辑非操作符也可以用于把任意值转换为布尔值。同时使用两个叹号（！！），相当于调用了转型函数`Boolean()`。无论操作数是什么类型，第一个叹号总会返回布尔值。第二个叹号对该布尔值取反，从而给出变量真正对应的布尔值。结果与对同一个值使用`Boolean()`函数是一样的。

### 逻辑与

逻辑与操作符由两个和号（`&&`）表示，应用到两个值。

逻辑与操作符可用于任何类型的操作数，不限于布尔值。如果有操作数不是布尔值，则逻辑与并不一定会返回布尔值，而是遵循如下规则。

- 如果第一个操作数的布尔值为`true`，则返回第二个操作数。
- 如果第一个操作数的布尔值为`false`，则返回第一个操作数。

逻辑与操作符是一种短路操作符，意思就是如果第一个操作数决定了结果，那么永远不会对第二个操作数求值。对逻辑与操作符来说，如果第一个操作数是`false`，那么无论第二个操作数是什么值，结果也不可能等于`true`。

```jsx
let found = true
let result = found && someUndeclaredVariable // 这里出错
console.log(result) // 不会执行
```

上面的代码之所以会报错，是因为`someUndeclaredVariable`没有事先声明，所以当逻辑与操作符对它求值时就会报错。假如变量`found`的值是`false`，那么就不会报错了：

```jsx
let found = false
let result = found && someUndeclaredVariable // 不会出错
console.log(result) // 会执行
```

这里，`console.log`会成功执行。即使变量`someUndeclaredVariable`没有定义，由于第一个操作数是`false`，逻辑与操作符也不会对它求值。在使用逻辑与操作符时，一定别忘了其短路的特性。

### 逻辑或

逻辑或操作符由两个管道符（`||`）表示，例如：

```jsx
let result = true || false
```

与逻辑与类似，如果有一个操作数不是布尔值，那么逻辑或操作符也不一定返回布尔值。它遵循如下规则：

- 如果第一个操作数的布尔值为`true`，则返回第一个操作数。
- 如果第一个操作数求值为`false`，则返回第二个操作数。

同样与逻辑与类似，逻辑或操作符也具有短路的特性。只不过对逻辑或而言，第一个操作数求值为`true`，第二个操作数就不会再被求值了。

利用这个行为，可以避免给变量赋值`null`或`undefined`。

```jsx
const myObject = preferredObject || backupObject
```

在这个例子中，变量`myObject`会被赋予两个值中的一个。其中，`preferredObject`变量包含首选的值，`backupObject`变量包含备用的值。如果`preferredObject`不是`null`，则它的值就会赋给`myObject`；如果`preferredObject`是`null`，则`backupObject`的值就会赋给`myObject`。这种模式在 ECMAScript 代码中经常用于变量赋值。

## 乘性操作符

ECMAScript 定义了 3 个乘性操作符：乘法、除法和取模。这些操作符跟它们在 Java、C 语言及 Perl 中对应的操作符作用一样，但在处理非数值时，它们也会包含一些自动的类型转换。如果乘性操作符有不是数值的操作数，则该操作数会在后台被使用`Number()`转型函数转换为数值。这意味着空字符串会被当成 0，而布尔值`true`会被当成 1。

### 乘法操作符

乘法操作符由一个星号（`*`）表示，可以用于计算两个数值的乘积。其语法类似于 C 语言，例如：

```jsx
const result = 34 * 56
```

不过乘法操作符在处理特殊值时有一些特殊行为。

- 如果操作数都是数值，则执行常规的乘法运算，即两个正值相乘是正值，两个负值相乘是正值，正负符号不同的值相乘的到负值。如果 ECMAScript 不能表示乘积，则返回`Infinity`或`-Infinity`。
- 如果有任一操作数是`NaN`，则返回`NaN`。
- 如果是`Infinity`乘以 0，则返回`NaN`。
- 如果是`Infinity`乘以非 0 的有限数值，则根据第二个操作数的符号返回`Infinity`或`-Infinity`。
- 如果是`Infinity`乘以`Infinity`，则返回`Infinity`。
- 如果有不是数值的操作数，则先在后台用`Number()`将其转换为数值，然后再应用上述规则。

### 除法操作符

除法操作符由一个斜杠（`/`）表示，用于计算第一个操作数除以第二个操作数的商，例如：

```jsx
const result = 66 / 11
```

跟乘法操作符一样，除法操作符针对特殊值也有一些特殊的行为。

- 如果操作数都是数值，则执行常规的除法运算，即两个正值相除是正值，两个负值相除也是正值，符号不同的值相除得到负值。如果 ECMAScript 不能表示商，则返回`Infinity`或`-Infinity`。
- 如果有任一操作数是`NaN`，则返回`NaN`。
- 如果是`Infinity`除以`Infinity`，则返回`NaN`。
- 如果是 0 除以 0，则返回`NaN`。
- 如果是非 0 的有限值除以 0，则根据第一个操作符的符号返回`Infinity`或`-Infinity`。
- 如果是`Infinity`除以任何数值，则根据第二个操作符的符号返回`Infinity`或`-Infinity`。
- 如果有不是数值的操作数，则现在后台用`Number()`函数将其转换为数值，然后再应用上述规则。

### 取模操作符

取模（余数）操作符由一个百分比符号（`%`）表示，例如：

```jsx
const result = 26 % 5 // 等于1
```

和其他乘性操作符一样，取模操作符对特殊值也有一些特殊的行为。

- 如果操作数是数值，则执行常规除法运算，返回余数。
- 如果被除数是无限值，除数是有限制，返回`NaN`。
- 如果被除数是有限值，除数是 0，则返回`NaN`。
- 如果是`Infinity`除以`Infinity`，则返回`NaN`。
- 如果被除数是有限值，除数是无限值，则返回被除数。
- 如果被除数是 0，除数不是 0，则返回 0。
- 如果有不是数值的操作数，则先在后台用`Number()`函数将其转换为数值，再应用上述规则。

## 指数操作符

ECMAScript 7 新增了指数操作符，`Math.pow()`现在有了自己的操作符`**`，结果是一样的：

```jsx
console.log(Math.pow(3, 2)) // 9
console.log(3 ** 2) // 9

console.log(Math.pow(16, 0.5)) // 4
console.log(16 ** 0.5) // 4
```

不仅如此，指数操作符也有自己的指数赋值操作符`**=`，该操作符执行指数运算和结果的赋值操作。

```jsx
let squared = 3
squared **= 2
console.log(squared) // 9
let sqrt = 16
sqrt **= 0.5
console.log(sqrt) // 4
```

## 加性操作符

加性操作符，即加法和减法操作符，一般都是编程语言中最简单的操作符。不过，在 ECMA Script 中，这两个操作符有一些特殊的行为。与乘性操作符类似，加性操作符在后台会发生不同类型的转换。只不过对于这两个操作符来说，转换规则不是那么直观。

### 加法操作符

加法操作符`+`用于求两个数的和，例如：

```jsx
const result = 1 + 2
```

如果两个操作数都是数值，加法操作符执行加法运算并根据如下规则返回结果：

- 如果有任一操作是`NaN`，则返回`NaN`。
- 如果是`Infinity`加`Infinity`，则返回`Infinity`。
- 如果是`-Infinity`加`-Infinity`，则返回`-Infinity`。
- 如果是`Infinity`加`-Infinity`，则返回`NaN`。
- 如果是`+0`加`+0`，则返回`+0`。
- 如果是`-0`加`+0`，则返回`+0`。
- 如果是`-0`加`-0`，则返回`-0`。

不过，如果有一个操作数是字符串，则要应用如下规则：

- 如果两个操作数都是字符串，则将第二个字符串拼接到第一个字符串后面。
- 如果只有一个操作数是字符串，则将另一个操作数转换为字符串，再将两个字符串拼接在一起。

如果有任一操作数是对象、数值或布尔值，则调用它们的`toString()`方法以获取字符串，然后再应用前面关于字符串的规则。对于`undefined`和`null`，则调用`String()`函数，分别获取`"undefined"`和`"null"`。

### 减法操作符

减法操作符`-`也是使用很频繁的一种操作符。与加法操作符一样，减法操作符也有一组规则用于处理 ECMAScript 中不同类型之间的转换。

- 如果两个操作符都是数值，则执行数学减法运算并返回结果。
- 如果有任一操作符是`NaN`，则返回`NaN`。
- 如果是`Infinity`减`Infinity`，则返回`NaN`。
- 如果是`Infinity`减`-Infinity`，则返回`Infinity`。
- 如果是`-Infinity`减`Infinity`，则返回`-Infinity`。
- 如果是`+0`减`+0`，则返回`+0`。
- 如果是`+0`减`-0`，则返回`-0`。
- 如果是`-0`减`-0`，则返回`+0`。
- 如果有任一操作数是字符串、布尔值、`null`或`undefined`，则先在后台使用`Number()`将其转换为数值，然后再根据前面的规则执行数学运算。如果转换结果是`NaN`，则减法计算的结果是`NaN`。
- 如果有任一操作数是对象，则调用其`valueOf()`方法取得表示它的数值。如果该值是`NaN`，则减法计算的结果是`NaN`。如果对象没有`valueOf()`方法，则调用其`toString()`方法，然后再将得到的字符串转换为数值。

## 关系操作符

关系操作符执行比较两个值的操作，包括小于`<`，大于`>`，小于等于`<=`和大于等于`>=`用法与数学中的逻辑一样。这几个操作符都返回布尔值。

```jsx
const result1 = 5 > 3 // true
const result2 = 5 < 3 // false
```

与 ECMAScript 中的其他操作符一样，在将它们应用到不同数据类型时也会发生类型转换和其他行为。

- 如果操作数都是数值，则执行数值比较。
- 如果操作数都是字符串，则逐个比较字符串中对应字符的编码。
- 如果有任一操作数是数值，则将另一个操作数转换为数值，执行数值比较。
- 如果有任一操作数是对象，则调用其`valueOf()`方法，取得结果后再根据前面的规则执行比较。如果没有`valueOf()`操作符，则调用`toString()`方法，取得结果后再根据前面的规则执行比较。

- 如果有任一操作数是布尔值，则将其转换为数值再执行比较。

在使用关系操作符比较两个字符串时，会发生一个有趣的现象。很多人认为小于意味着“字母顺序靠前”，而大于意味着“字母顺序靠后”，实际上不是这么回事。对字符串而言，关系操作符会比较字符串中对应字符的编码，而这些编码是数值。比较完之后，会返回布尔值。问题的关键在于，大写字母的编码都小于小写字母的编码，因此以下情况会发生：

```jsx
const result = 'Brick' < 'alphabet' // true
```

在这里，字符串`"Brick"`被认为小于字符串`"alphabet"`，因为字母 B 的编码是 66，字母 a 的编码是 97。要得到确实按字母顺序比较的结果，就必须把两者都转换为相同的大小写形式（全大写或全小写），然后再比较：

```jsx
const result = 'Brick'.toLowerCase() < 'alphabet'.toLowerCase() // false
```

将两个操作数都转换为小写，就能保证按照字母表顺序判定`"alphabet"`在`"Brick"`前头。

## 相等操作符

判断两个变量是否相等是编程中最重要的操作之一。在比较字符串、数值和布尔值是否相等，过程都很直观。但是在比较两个对象是否相等时，情形就比较复杂了。ECMAScript 中的相等和不相等操作符，原本在比较之前会执行类型转换，但很快就有人质疑这种转换是否因该发生。最终，ECMAScript 提供了两组操作符。第一组是**等于**和**不等于**，它们在比较之前执行转换。第二组是**全等**和**不全等**，它们在比较之前不执行转换。

### 等于和不等于

ECMAScript 中的等于操作符用两个等于号（`==`）表示，如果操作数相等，则会返回`true`。这两个数都会先进行类型转换（通常称为**强制类型转换**）再确定操作数是否相等。

在转换操作数的类型时，相等和不相等操作符遵循如下规则。

- 如果任一操作数是布尔值，则将其转换为数值再比较是否相等。`false`转换为 0，`true`转换为 1。
- 如果一个操作数是字符串，另一个操作数是数值，则尝试将字符串转换为数值，再比较是否相等。
- 如果一个操作数是对象，另一个操作数不是，则调用对象的`valueOf()`取得其原始值，再根据前面的规则进行比较。

在进行比较时，这两个操作符会遵循如下规则：

- `null`和`undefined`相等。
- `null`和`undefined`不能转换为其他类型的值再进行比较。
- 如果有任一操作数是`NaN`，则相等操作符返回`false`，不相等操作符返回`true`。记住：即使两个操作数都是`NaN`，相等操作符也返回`false`，因为按照规则，`NaN`不等于`NaN`。
- 如果两个操作符都是对象，则比较它们是不是同一个对象。如果两个操作数都指向同一个对象，则相等操作符返回`true`。否则，两者不相等。

### 全等和不全等

全等和不全等操作符与相等和不相等操作符类似，只不过它们在比较相等时不转换操作数。全等操作符用`===`表示，不全等操作符用`!==`表示。`null === undefined`是`false`，因为它们不是相同的数据类型。

> 由于相等和不相等操作符存在类型转换问题，因此推荐使用全等和不全等操作符。这样有助于在代码中保持数据类型的完整性。

## 条件操作符

条件操作符是 ECMAScript 中用途最为广泛的操作符之一，语法跟 Java 中的一样：

```jsx
variable = boolean_expression ? true_vlaue : false_value
```

上面的代码执行了条件赋值操作。条件操作符也叫三目运算符。

## 赋值操作符

简单赋值用等于号（`=`）表示，将右边的值赋给左边的变量。

注意，类似`+=`、`*=`这样的复合赋值操作符仅仅是简写语法，在 ECMAScript 中使用它们并不会提升性能。

## 逗号运算符

逗号操作符可以用来在一条语句中执行多个操作。

```jsx
let num1 = 1,
  num2 = 2,
  num3 = 3
```

在一条语句中同时声明多个变量是逗号操作符最常用的场景。不过，也可以使用逗号操作符来辅助赋值。在赋值时使用逗号操作符分隔值，最终会返回表达式中最后一个值。

```jsx
let num = (5, 1, 4, 8, 0) // num的值为0
```

逗号操作符的这种使用场景并不多见，但是需要了解其规则。

# 语句

ECMA-262 描述了一些语句（也称为**控制流语句**），而 ECMAScript 中的大部分语法都体现在语句中。语句通常使用一个或多个关键字完成既定的任务。语句可以简单，也可以复杂。

## `if`语句

`if`语句是使用最频繁的语句之一，语法如下：

```jsx
if (condition) statement1 else statement2
```

这里的条件（`condition`）可以是任何表达式，并且求值结果不一定是布尔值。ECMAScript 会自动调用`Boolean()`函数将这个表达式的值转换为布尔值。如果条件求值为`true`，则执行语句`statement1`；如果条件求值为`false`，则执行语句`statement2`。这里的语句可能是一行代码，也可能是一个代码块（即包含在一对花括号中的多行代码）。

```jsx
if (i > 25) console.log('Greater than 25.')
// 只有一行代码的语句
else {
  console.log('Less than or equal to 25.') // 一个语句块
}
```

这里的最佳实践是使用语句块，即使只有一行代码要执行也是如此。这是因为语句块可以避免对什么条件下执行什么产生困惑。

## `do-while`语句

`do-while`语句是一种后测试循环语句，即循环体中的代码执行后才会对退出条件进行求值。换句话说，循环体内的代码至少执行一次。`do-while`的语法如下：

```jsx
do {
  statement
} while (expression)
```

## `while`语句

`while`语句是一种先测试循环语句，即先检测退出条件，再执行循环体内的代码。因此，`while`循环体内的代码有可能不会执行。下面是`while`循环的语法：

```jsx
while (expression) statement
```

## `for`语句

`for`语句也是先测试语句，只不过增加了进入循环之前的初始代码，以及循环执行后要执行的表达式，语法如下：

```jsx
for (initialization; expression; post - loop - expression) statement
```

下面是一个用例：

```jsx
let count = 10
for (let i = 0; i < count; i++) {
  console.log(i)
}
```

以上代码在循环开始前定义了变量`i`的初始值为 0。然后求值条件表达式，如果求值结果为`true`（`i < count`），则执行循环体。因此循环体也可能不会被执行。如果循环体被执行了，则循环后表达式也会执行，以便递增变量`i`。`for`循环跟下面的`while`循环是一样的。

```jsx
let count = 10
let i = 0
while (i < count) {
  console.log(i)
  i++
}
```

无法通过`while`循环实现的逻辑，同样也无法使用`for`循环实现。因此`for`循环只是将循环相关的代码封装在了一起而已。

在`for`循环的初始化代码中，其实是可以不使用变量声明关键字的。不过，初始化定义的迭代器变量在循环执行完成后几乎不可能再用到了。因此，最清晰的写法是使用`let`声明迭代器变量，这样就可以将这个变量的作用域限定在循环中。

初始化、条件表达式和循环后表达式都不是必须的。因此，下面的写法可以创建一个无穷循环：

```jsx
for (;;) {
  doSomething()
}
```

如果只包含条件表达式，那么`for`循环就变成了`while`循环：

```jsx
let count = 10
let i = 0
for (; i < count; ) {
  console.log(i)
  i++
}
```

这种多功能性使得`for`语句在这门语言中使用非常广泛。

## `for-in`语句

`for-in`语句是一种严格的迭代语句，用于枚举对象中的非符号键属性，语法如下：

```jsx
for (property in expression) statement
```

下面是一个例子：

```jsx
for (const propName in window) {
  document.write(propName)
}
```

这个例子使用`for-in`循环显示了 BOM 对象`window`的所有属性。每次执行循环，都会给变量`propName`赋予一个`window`对象的属性作为值，直到`window`的所有属性都被枚举一遍。与`for`循环一样，这里控制语句中的`const`也不是必需的。但为了确保这个局部变量不会修改，推荐使用`const`。

ECMAScript 中对象的属性是无序的，因此`for-in`语句不能保证返回对象属性的顺序。换句话说，所有**可枚举**的属性都会返回一次，但返回的顺序可能会因浏览器而异。

如果`for-in`循环要迭代的变量是`null`或`undefined`，则不执行循环体。

## `for-of`语句

`for-of`是一种严格的迭代语句，用于遍历可迭代对象的元素，语法如下：

```jsx
for (property of expression) statement
```

下面是示例：

```jsx
for (const el of [2, 4, 6, 8]) {
  document.write(el)
}
```

在这个例子中，我们使用`for-of`语句显示了一个包含 4 个元素的数组中的所有元素。循环会一直持续到将所有元素都迭代完。与`for`循环一样，这里控制语句中的`const`也不是必须的，但为了确保它作为局部变量且不会被修改，推荐使用`const`。

`for-of`循环会按照可迭代对象的`next()`方法产生值的顺序迭代元素。如果尝试迭代的变量不支持迭代，则`for-of`语句会抛出错误。

> ES2018 对`for-of`语句进行了扩展，增加了`for-await-of`循环，以支持生成期约（promise）的异步可迭代对象。

## 标签语句

标签语句用于给语句添加标签。

```jsx
label: statement
```

下面是一个例子：

```jsx
start: for (let i = 0; i < count; i++) {
  console.log(i)
}
```

在这个例子中，`start`是一个标签，可以在后面通过`break`或`continue`语句引用。标签语句的典型应用场景是嵌套循环。

## `break`和`continue`语句

`break`和`continue`语句为执行循环代码提供了更严格的控制手段。其中，`break`语句用于立即退出循环，强制执行循环后的下一条语句。而`continue`语句也用于立即退出循环，但会再次从循环顶部开始执行。

```jsx
let num = 0
for (let i = 1; i < 10; i++) {
  if (i % 5 === 0) {
    break
  }
  num++
}

console.log(num) // 4
```

```jsx
let num = 0

for (let i = 0; i < 10; i++) {
  if (i % 5 === 0) {
    continue
  }
  num++
}

console.log(num) // 8
```

组合使用标签语句和`break`、`continue`能实现复杂的逻辑，但是也容易出错。因此最好避免使用标签，并且嵌套不要太深。

## `with`语句

`with`语句的用途是将代码作用域设置为特定的对象。

```jsx
with (expression) statement
```

使用`with`语句的主要场景是针对一个对象反复操作，这时候将代码作用域设置为该对象能提供便利。

```jsx
let qs = location.search.substring(1)
let hostName = location.hostname
let url = location.href
```

上面代码的每一行都使用了`location`对象，如果使用`with`语句，就可以少写一些代码：

```jsx
with (location) {
  let qs = search.substring(1)
  let hostName = hostname
  let url = href
}
```

这里，`with`语句用于连接`location`对象。这意味着在这个语句内部，每个变量首先会被认为是一个局部变量。如果没有找到该局部变量，则会搜索`location`对象，看它是否具有一个同名的属性。如果有，则该变量会被求值为`location`对象的属性。

严格模式不允许使用`with`语句，否则会抛出错误。

> 由于`with`语句影响性能，并且难于调试其中的代码，通常建议不使用`with`语句。

## `switch`语句

`switch`语句是与`if`语句紧密相关的一种流控制语句，从其他语言借鉴而来。ECMAScript 中`switch`语句跟 C 语言中`switch`语句的语法非常相似，如下所示：

```jsx
switch (expression) {
  case value1:
    statement
    break
  case value2:
    statement
    break
  default:
    statement
}
```

虽然`switch`语句是从其他语言借鉴过来的，但是 ECMAScript 为它赋予了一些独有的特性。首先`switch`语句可以用于所有数据类型（在很多语言中，它只能适用于数值），因此可以使用字符串甚至对象。其次，条件的值不需要是常量，也可以是变量或表达式。

```jsx
let num = 25

switch (true) {
  case num < 0:
    console.log('less than 0')
    break
  case num >= 0 && num <= 10:
    console.log('Between 0 and 10.')
    break
  default:
    console.log('...')
}
```

> `switch`语句在比较每个条件的值时会使用全等操作符，因此不会强制转换数据类型。

# 函数

函数对任何语言来说都是核心组件，因为它们可以封装语句，然后在任何地方、任何时间执行。ECMAScript 中的函数使用`function`关键字声明，后跟一组参数，然后是函数体。

```jsx
function functionName(arg0, arg1, ..., argN) {
  statements
}
```

可以通过函数名来调用函数。

```jsx
sayHi('Nicholas', 'how are you tody')
```

ECMAScript 函数不需要指定是否返回值。任何函数在任何时间都可以使用`return`语句来返回函数的值。

> 最佳实践是函数要么返回值，要么不返回值。只在某个条件下返回值的函数会带来麻烦，尤其是调试时。

严格模式对函数也有一些限制：

- 函数不能以`eval`或`arguments`作为名称
- 函数的参数不能叫`eval`或`arguments`
- 两个命名参数不能拥有同一个名称

如果违反上述规则，则会导致语法错误，代码也不会执行。

# 小结

JavaScript 的核心语言特性在 ECMA-262 中以伪语言 ECMAScript 的形式来定义。ECMAScript 包含所有基本语法、操作符、数据类型和对象，能完成基本的计算任务，但没有提供获得输入和产生输出的机制。理解 ECMAScript 及其复杂的细节是完全理解浏览器中的 JavaScript 的关键。下面总结一下 ECMAScript 中的基本元素。

- ECMAScript 中的基本数据类型包括`undefined`、`null`、`boolean`、`number`、`string`和`symbol`。
- 与其他语言不同，ECMAScript 不区分整数和浮点值，只有`Number`一种数值数据类型。
- `Object`是一种复杂数据类型，它是这门语言中所有对象的基类。
- 严格模式为这门语言中某些容易出错的部分施加了限制。
- ECMAScript 提供了 C 语言和类 C 语言中常见的很多基本操作符，包括数学操作符、布尔操作符、关系操作符、相等操作符和赋值操作符等。
- 这门语言中的流控制语句大多是从其他语言中借鉴来的，例如`if`语，`for`语句和`switch`语句等。

ECMAScript 中的函数与其他语言中的函数不一样。

- 不需要指定函数的返回值，因为任何函数可以在任何时候返回任何值。
- 不指定返回值的函数实际上会返回特殊值`undefined`。
