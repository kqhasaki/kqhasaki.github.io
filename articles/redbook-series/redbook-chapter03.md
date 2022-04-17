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

`undefined`值是由`null`值派生而来的，因此ECMA-262将他们定义为表面上相等：

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

