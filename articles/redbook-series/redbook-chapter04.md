---
title: （四）变量、作用域与内存
date: 2022-04-03
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h0xvv0rzwuj20m80br757.jpg
---

<iframe src="https://www.youtube.com/embed/AeUCN2lPqL8" title="JavaScript中的内存管理" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

相比于其他语言，JavaScript 中的变量可谓独树一帜。正如 ECMA-262 所规定的，JavaScript 中的变量是松散类型的。而且变量不过就是特定时间点一个特定值的名称而已。由于没有规则定义变量必须包含什么数据类型，变量的值和数据类型在脚本生命期内可以改变。这样的变量很有意思，很强大，当然也会有不少问题。本章会剖析错综复杂的变量。

# 原始值与引用值

ECMAScript 变量可以包含两种不同类型的数据，原始值和引用值。**原始值**（primitive value）就是最简单的数据，**引用值**（reference value）则是由多个值构成的对象。

在把一个值赋给变量时，JavaScript 引擎必须确定这个值是原始值还是引用值。上一章讨论了 6 种原始值：`undefined`、`null`、`boolean`、`number`、`string`和`symbol`。保存原始值的变量是**按值**（by value）访问的。因为我们操作的就是存储在变量中的实际值。

引用值是保存在内存中的对象。和其他语言不同，JavaScript 不允许访问内存位置，因此也就不能直接操作对象所在的内存空间。在操作对象时，实际上操作的是对该对象的**引用**（reference）而非实际的对象本身。为此，保存引用值的变量是**按引用**（by reference）访问的。

> 在很多语言中，字符串是使用对象表示的，因此被认为是引用类型。ECMAScript 打破了这个惯例。

## 动态属性

原始值和引用值的定义方式很类似，都是创建一个变量，然后给它赋一个值。不过，在变量保存了这个值之后，可以对这个值做什么，则大有不同。对于引用值而言，可以随时添加、修改和删除其属性和方法。例如：

```jsx
const person = new Object()
person.name = 'Nicholas'
console.log(person.name) // 'Nicholas'
```

这里创建了一个对象，并把它保存在变量`person`中。然后给这个对象添加了一个名为`name`的属性，并且给这个属性值赋值了一个字符串`'Nicholas'`。在此之后就可以访问这个新属性，直到对象被销毁或属性被显式地删除。

原始值不能有属性，尽管尝试给原始值添加属性不会报错。比如：

```jsx
let name = 'Nicholas'
name.age = 27
console.log(name.age) // undefined
```

在此，代码想给字符串`name`定义一个`age`属性并给该属性赋值 27。紧接着在下一行，属性不见了。记住，只有引用值可以动态添加后面可以使用的属性。

注意，原始类型的初始化可以只使用原始字面量形式。如果使用的`new`关键字，则 JavaScript 会创建一个`Object`类型的实例，但其行为类似原始值。下面来看看这两种初始化方式的差异：

```jsx
let name1 = 'Nicholas'
let name2 = new String('Matt')
name1.age = 27
name2.age = 26
console.log(name1.age) // undefined
console.log(name2.age) // 26
console.log(typeof name1) // string
console.log(typeof name2) // object
```

## 复制值

除了存储方式不同，原始值和引用值在通过变量复制时也有所不同。在通过变量把一个原始值赋值到另一个变量时，原始值会被复制到新变量的位置。

```jsx
let num1 = 5
let num2 = num1
```

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h0xxwwn006j21gs0lwq42.jpg)

在把引用值从一个变量赋给另一个变量时，存储在变量中的值也会被复制到新变量所在的位置。区别在于，这里复制的值实际上是一个指针，它指向存储在堆内存中的对象。在操作完成后，两个变量实际上指向同一个对象，因此一个对象上面的变化会在另一个对象上反映出来。例如：

```jsx
let obj1 = new Object()
let obj2 = obj1
obj1.name = 'Nicholas'
console.log(obj2.name) // 'Nicholas'
```

在这个例子中，变量`obj1`保存了一个新对象的实例。然后，这个值被复制到`obj2`，此时两个变量都指向了同一个对象。在给`obj1`创建属性`name`并赋值后，通过`obj2`也可以访问这个属性，因为它们都指向同一个对象。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h0xy29gsr4j21co0lyjti.jpg)

## 传递参数

ECMAScript 中所有函数的参数都是按值传递的。这意味着函数外的值会被复制到函数内部的参数中，就像从一个变量复制到另一个变量一样。如果是原始值，那么就跟原始值变量的复制一样，如果是引用值，那么就跟引用值变量的复制一样。

在按值传递参数时，值会被复制到一个局部变量（即一个明明参数，或者用 ECMAScript 的话说，就是`arguments`对象中的一个槽位）。在按引用传递参数时，值在内存中的位置会被保存在一个局部变量，这意味着对本地变量的修改会反映到函数外部。（这在 ECMA Script 中是不可能的）。

```jsx
function addTen(num) {
  num += 10
  return num
}

let count = 20
let result = addTen(count)
console.log(count) // 20，没有变化
console.log(result) // 30
```

这里，函数`addTen()`有一个参数`num`，它其实是一个局部变量。在调用时，变量`count`作为参数传入。`count`的值是 20，这个值被复制到参数`num`以便在`addTen()`内部使用。

> 重要的是要记住，ECMAScript 中参数是**按值传递**的。并且函数的参数就是局部变量。

## 确定类型

前一章提到的`typeof`操作符最适合用来判断一个变量是否为原始类型。更确切地说，它是**判断一个变量是否为字符串、数值、布尔值或`undefined`的最好方式**。如果值是对象或者`null`那么`typeof`会返回`"object"`。

`typeof`虽然对原始值很有用，但是它对引用值的用处不大。我们通常不关系一个值是不是对象，而是想知道它是什么类型的对象。为了解决这个问题，ECMAScript 提供了`instanceof`操作法：

```jsx
result = variable instanceof constructor
```

如果变量是给定引用类型（由其原型链决定）的实例，则`instanceof`操作符返回`true`。

按照定义所有引用值都是`Object`的实例，因此通过`instanceof`操作操作符检测任何引用值和`Object`构造函数都会返回`true`。类似地，如果用`instanceof`检测原始值，则始终会返回`false`，因为原始值不是对象。

> `typeof`操作符在用于检测函数时也会返回`"function"`。在 Safari 和早期 Chrome 版本中用于检测正则表达式时，由于实现细节的原因，`typeof`也会返回`"function"`。而在 IE 和 Firefox 和后续 Chrome 中，`typeof`对正则表达式返回`"object"`。

# 执行上下文与作用域

执行上下文（以下简称“上下文”）的概念在 JavaScript 中是颇为重要的。变量或函数的上下文决定了它们可以访问哪些数据，以及它们的行为。每个上下文都有一个关联的**变量对象**（variable object），而这个上下文中定义的所有变量和函数都存在于这个对象上。虽然无法通过代码访问代码对象，但后台处理数据会用到它。

全局上下文是最外层的上下文。根据 ECMAScript 实现的宿主环境，表示全局上下文的对象可能不一样。在浏览器中，全局上下文就是我们常说的`window`对象，因此所有通过`var`定义的全局变量和函数会成为`window`对象的属性和方法。使用`let`和`const`的顶级声明不会定义在全局上下文中，但在作用域链解析上效果是一样的。上下文在其所有代码都执行完毕后会被销毁，包括定义在它上面的所有变量和函数（全局上下文在应用程序退出前才会被销毁）。

每个函数调用都有自己的上下文。当代码执行流进入函数时，函数的上下文被推到一个上下文栈上。在函数执行完之后，上下文栈会弹出该函数上下文，将控制权返还给之前的执行上下文。ECMAScript 程序的执行流就是通过这个上下文栈进行控制的。

上下文的代码在执行的时候，会创建变量对象的一个**作用域链**（scope chain）。这个作用域链决定了各级上下文中的代码在访问变量和函数时的顺序。代码正在执行的上下文的变量对象始终位于作用域链的最前端。如果上下文是函数，则其**活动对象**（activation object）用作变量对象。活动对象最初只有一个定义变量：`arguments`。（全局上下文中没有这个变量。）作用域链中的下一个变量对象来自包含上下文，再下一个对象来自再下一个包含上下文。以此类推直至全局上下文；全局上下文的变量对象是作用域链的最后一个变量对象。

代码执行时的标识符解析是通过沿作用域链逐级搜索标识符名称完成的。搜索过程中始终从作用域链的最前端开始，然后逐级往后，直到找到标识符。（如果没有找到标识符，那么通常会报错。）

```jsx
var color = 'blue'

function changeColor() {
  if (color === 'blue') {
    color = 'red'
  } else {
    color = 'blue'
  }
}

changeColor()
```

对这个例子而言，函数`changeColor()`的作用域链包含两个对象：一个是它自己的变量对象（就是定义`arguments`对象的那个），另一个是全局上下文的变量对象。这个函数内部之所以能够访问变量`color`，就是因为可以再作用域链中找到它。

此外，局部作用域中定义的变量可以用于在局部上下文中替换全局变量。

```jsx
var color = 'blue'

function changeColor() {
  let anotherColor = 'red'

  function swapColors() {
    let tempColor = anotherColor
    anotherColor = color
    color = tempColor

    // 这里可以访问color、anotherColor和tempColor
  }

  swapColor()
}

changeColor()
```

以上代码涉及了 3 个上下文：全局上下文，`changeColor()`的局部上下文和`swapColors()`的局部上下文。

内部上下文可以通过作用域链访问外部上下文中的一切，但外部上下文无法访问内部上下文中的任何东西。上下文之间的连接是线性的、有序的。每个上下文都可以到上一级上下文中去搜索变量和函数，但任何上下文都不能达到下一级上下文中去搜索。`swapColors()`局部上下文的作用域有 3 个对象：`swapColors()`的变量对象，`changeColor()`的变量对象和全局变量对象。`swapColors()`的局部上下文首先从自己的对象、`changeColor()`的上下文的作用域链中只有两个对象：它自己的变量对象和全局变量。因此，它不能访问`swapColors()`的上下文。

> 函数参数被任务是当前上下文中的变量，因此也跟上下文中的其他变量遵循相同的访问规则。

## 作用域链增强

虽然执行上下文主要全局上下文和函数上下文两种（`eval()`调用内部存在第三种上下文），但有其他方式来增强作用域链。某些语句会导致在作用域链前端临时添加上下文，这个上下文在代码执行后被删除。通常在两种情况下会出现这个现象，即代码执行到下面任意一种情况时：

- `try/catch`语句的`catch`块
- `with`语句

这两种情况下，都会在作用域链前端添加一个变量对象。对`with`语句来说，会向作用域链前端添加指定的对象；对`catch`语句而言，则会创建一个新的变量对象，这个变量对象会包含要抛出的错误对象的声明。看下面的例子：

```jsx
function buildURL() {
  let qs = '?debug=true'

  with (location) {
    let url = herf + qs
  }

  return url
}
```

这里，`with`语句将`location`对象作为上下文，因此`location`会被添加到作用域链前端。`buildURL()`函数中定义了一个变量`qs`。当`with`语句中的代码引用变量`href`时，实际上是引用的`location.href`，也就是自己变量对象的属性。在引用`qs`时，引用的则是定义在`buildURL()`中那个变量，它定义在函数上下文的变量对象上。而在`with`语句中使用`var`声明的变量`url`会成为函数上下文的一部分，可以作为函数的值被返回；但像这里使用`let`声明的变量`url`，因为被限制在块级作用域（稍后介绍），所以在`with`块之外没有定义。

> IE 的实现在 IE8 之前是有偏差的，即它们会将`catch`语句中捕获的错误添加执行上下文的变量对象上，而不是`catch`语句的变量对象上，导致在`catch`块外部都可以访问到错误。IE9 纠正了这个问题。

## 变量声明

ES6 之后，JavaScript 的变量声明经历了翻天覆地的变化。直到 ES5.1，`var`都是声明变量的唯一关键字。ES6 不仅增加了`let`和`const`两个关键字，而且还让这两个关键字压倒性地超越了`var`成为了首选。（实际上在现代的开发规范中，应该完全放弃`var`关键字了）。

### 使用`var`的函数作用域声明

在使用`var`声明变量时，变量会被自动添加到最接近的上下文。在函数中，最接近的上下文就是函数的局部上下文。在`with`语句中，最接近的上下文也是函数上下文。如果变量未经声明就被初始化了，那么它就会被自动被添加到全局上下文：

```jsx
function add(num1, num2) {
  var sum = num1 + num2
  return sum
}

let result = add(10, 20)
console.log(sum) // 报错：sum在这里不是有效变量
```

这里，函数`add()`定义了一个局部变量`sum`，保存加法操作的结果。这个值作为函数的值被返回，但变量`sum`在函数外部是访问不到的。如果省略了上面例子中的关键字`var`，那么`sum`在`add()`被调用之后就变成可以访问的了：

```jsx
function add(num1, num2) {
  sum = num1 + num2
  return sum
}

let result = add(10, 20)
console.log(sum) // 30
```

> 未经声明就初始化变量是 JavaScript 编程中一个非常常见的错误，会导致很多问题。为此，读者在初始化变量之前一定到先声明变量。在严格模式下，未经声明就初始化变量会报错。

`var`声明会被拿到函数或全局作用域的顶部，位于作用域中所有代码之前。这个现象叫做“提升”（hoisting）。提升让同一个作用域中的代码不必考虑变量是否已经声明就可以直接使用。可是在实践中，提升也会导致合法却奇怪的现象，即在变量声明之前使用变量。

```jsx
var name = 'Jake'

// 等价于
name = 'Jake'
var name

function fn1() {
  var name = 'Jake'
}

// 等价于
function fn2() {
  var name
  name = 'Jake'
}
```

### 使用 let 的快级作用域声明

ES6 新增的`let`关键字跟`var`很相似，但它的作用域是块级的，这也是 JavaScript 中的新概念。块级作用域由最近的一对包含花括号`{}`界定。任何代码块都是`let`声明变量的作用域。

```jsx
if (true) {
  let a
}
console.log(a) // ReferenceError: a 没有定义

while (true) {
  let b
}

console.log(b) // ReferenceError: b 没有定义

function foo() {
  let c
}

console.loog(c) // ReferenceError: c 没有定义

{
  let d
}

console.log(d) // ReferenceError: d 没有定义
```

`let`和`var`的另一个不同之处是在同一作用域内不能声明两次。重复的`var`声明会被忽略，而重复的`let`声明会抛出`SyntaxError`。

```jsx
var a
var a
// 不会报错

{
  let b
  let b
}
// SyntaxError: 标识符b已经声明过了
```

`let`的行为非常适合在循环中声明迭代变量。使用`var`声明的迭代变量会泄漏到循环外部，这种情况应该避免。

```jsx
for (var i = 0; i < 10; i++) {}
console.log(i) // 10

for (let j = 0; j < 10; j++) {}
console.log(j) // ReferenceError: j 没有定义
```

严格来讲，`let`在 JavaScript 运行时中也会被提升，但由于“暂时性死区”（temporal dead zone）的缘故，实际上不能在声明之前使用`let`变量。因此，从写 JavaScript 代码的角度说，`let`的提升跟`var`是不一样的。

### 使用 const 的常量声明

除了`let`，ES6 还增加了`const`关键字。使用`const`声明的变量必须同时初始化为某个值。一经声明，在其声明周期的任何时候都不能再重新赋予新值。

```jsx
const a // SyntaxError: 常量声明时没有初始化
const b
console.log(b) // 3
b = 4 // TypeError: 给常量赋值
```

`const`除了要遵循以上规则，其他方面与`let`声明是一样的：

```jsx
if (true) {
  const a = 0
}
console.log(a) // ReferenceError: a 没有定义
while (true) {
  const b = 1
}
console.log(b) // ReferenceError: b 没有定义

function foo() {
  const c = 2
}
console.log(c) // ReferenceError: c 没有定义

{
  const d = 3
}
console.log(d) // ReferenceError: d 没有定义
```

`const`声明只应用到顶级原语或者对象。换句话说，赋值为对象的`const`变量不能再被重新赋值为其他引用值，但对象的键则不受限制。

```jsx
const o1 = {}
o1 = {}

const o2 = {}
o2.name = 'Jake'
console.log(o2.name) // 'Jake'
```

如果想让整个对象都不能修改，可以使用`Object.freeze()`，这样再给属性赋值时虽然不会报错，但会静默失败。

```jsx
const o3 = Object.freeze({})
o3.name = 'Jake'
console.log(o3.name) // undefined
```

由于`const`声明暗示变量的值是单一类型且不可修改，JavaScript 运行时编译器可以将其所有实例都替换成实际的值，而不会通过查询进行变量查找。谷歌的 V8 引擎就执行这种优化。

> 开发实践表明，如果开发流程并不会因此受到很大影响，就应该尽可能地多使用`const`声明，除非确实需要一个将来会重新赋值的变量。这样可以从根本上保证提前发现重新赋值导致的 bug。

### 标识符查找

当在特定上下文中为读取或写入而引用一个标识符时，必须通过搜索确定这个标识符表示什么。搜索开始于作用域链前端，以特定的名称搜索对应的标识符。如果在局部上下文中找到该标识符，则搜索停止，变量确定；如果没有找到变量名，则继续沿作用域链搜索。（注意，作用域链中的对象也有一个原型链，因此搜索可能涉及每个对象的原型链。）这个过程一直持续到搜索至全局上下文的变量对象。如果仍然没有找到标识符，则说明其未声明。

```jsx
var color = 'blue'

function getColor() {
  return color
}

console.log(getColor()) // 'blue'
```

在这个例子中，调用函数`getColor()`时会引用变量`color`。为确定`color`的值会进行两步搜索。第一步，搜索`getColor()`的变量对象，查找名为`color`的标识符。结果没有找到，于是继续搜索下一个变量对象（来自全局上下文），然后就找到了名为`color`的标识符。因为全局变量对象上有`color`的定义，所以搜索结束。

对于这个搜索过程而言，引用局部变量会让搜索自动停止，而不继续搜索下一级变量对象。也就是说，如果局部上下文中有一个同名标识符，那就不能在该上下文中引用父上下文中的同名标识符。

```jsx
var color = 'blue'

function getColor() {
  let color = 'red'
  return color
}

console.log(getColor()) // 'red'
```

使用块级作用域声明并不会改变搜索流程，但是可以给词法层级添加额外的层次：

```jsx
var color = 'blue'

function getColor() {
  let color = 'red'
  {
    let color = 'green'
    return color
  }
}

console.log(getColor()) // 'green'
```

> 标识符查找并没有代价。访问局部变量比访问全局变量还要快，因为不用切换作用域。不过，JavaScript 引擎在优化标识符查找上做了很多工作，将来这个差异就可能微不足道了。

# 垃圾回收

JavaScript 是使用垃圾回收的语言，也就是说执行环境负责在代码执行时管理内存。在 C 和 C++等语言中，跟踪内存使用对开发者来说是个很大的负担，也是很多问题的来源。JavaScript 为开发者卸下了这个负担，通过自动内存管理实现内存分配和闲置资源回收。基本思路很简单：确定哪个变量不会再使用，然后释放它占用的内存。这个过程是周期性的，即垃圾回收程序每隔一定时间（或者说在代码执行过程中某个预定的收集时间）就会自动运行。垃圾回收过程是一个近似且不完美的方案，因为某块内存是否还有用，属于“不可判定的”的问题，意味着靠算法是解决不了的。

我们以函数中局部变量的正常生命周期为例。函数中的局部变量会在函数执行时存在。此时，栈（或堆）内存会分配空间以保存相应的值。函数在内部使用了变量，然后退出。此时，就不再需要那个局部变量了，它占用的内存可以释放，供后面使用。这种情况下显然不再需要局部变量了，但并不是所有时候都会这么明显。垃圾回收程序必须跟踪记录哪个变量还会使用，以及哪个变量不会再使用，以便回收内存。如何标记未使用的变量也许有不同的实现方式。不过在浏览器的发展历史上，用到过两种主要的标记策略：**标记清理**和**引用计数**。

## 标记清理

<iframe src="https://www.youtube.com/embed/DIzouoy13UM" title="内存管理与垃圾回收" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

JavaScript 最常用的垃圾回收策略是**标记清理**（mark-and-sweep）。当变量进入上下文，比如在函数内部声明一个变量时，这个变量会被加上存在于上下文中的标记。而在上下文中的变量，逻辑上讲，永远不应该释放它们的内存，因为只要上下文中的代码在运行，就有可能用到它们。当变量离开上下文时，也会被加上离开上下文的标记。

给变量加标记的方式有很多种。例如，当变量进入上下文时，反转某一位；或者可以维护”在上下文中“和”不在上下文中“两个变量列表，可以把变量从一个列表转移到另一个列表。标记过程中的实现并不重要，关键是策略。

垃圾回收程序运行的时候，会标记内存中存储的所有变量（记住，标记方法有很多种）。然后，它会将所有在上下文中的变量，以及被在上下文中的变量引用的变量的标记去掉。在此之后再被加上标记的变量就是待删除的了，原因是任何在上下文中的变量都访问不到它们了。随后垃圾回收程序做一次**内存清理**，销毁带标记的所有值并回收它们的内存。

到了 2008 年，IE、Firefox、Opera、Chrome 和 Safari 都在自己的 JavaScript 实现中采用标记清理（或其变体），只是在运行垃圾回收的频率上有所差异。

## 引用计数

另一种没有那么常用的垃圾回收策略是**引用计数**（reference counting）。其思路是对每个值都记录它被引用的次数。声明变量并给它赋一个引用值时，这个值的引用数为 1。如果同一个值又被赋予给另一个变量，那么引用数加 1。类似地，如果保存对该值引用的变量被其他值给覆盖了，那么引用数减 1。当一个值的引用数为 0 时，就说明没办法再访问到这个值了，因此可以安全地回收其内存。垃圾回收程序下次运行的时候就会释放引用数为 0 的值的内存。

引用计数最早是由 Netscape Navigator3.0 采用，但很快就遇到了严重的问题：循环引用。所谓**循环引用**，就是对象 A 有一个指针指向对象 B，而对象 B 也指向了对象 A。例如：

```jsx
function problem() {
  let objectA = new Object()
  let objectB = new Object()

  objectA.someOtherObject = objectB
  objectB.anotherObject = objectA
}
```

这个例子中，`objectA`和`objectB`通过各自的属性相互引用，意味着它们的引用数都是 2。在标记清理策略下，这不是问题，因为在函数结束后，这两个对象中都不在作用域中。而在引用计数策略下，`objectA`和`objectB`在函数结束后还存在，因为它们的引用计数永远不会变成 0。如果函数被多次调用，则会导致大量内存永远不会被释放。为此，Netscape 在 4.0 版本中放弃了引用计数，转而采用标记清理。事实上，引用计数策略的问题还不止于此。

在 IE8 及更早版本的 IE 中，并非所有对象都是原生 JavaScript 对象。BOM 和 DOM 中的对象是 C++实现的组件对象模型（COM，Component Object Model）对象，而 COM 对象使用引用计数实现垃圾回收。因此，即使这些版本 IE 的 JavaScript 引擎使用标记清理，而 COM 对象使用引用计数实现垃圾回收。换句话说，只要涉及 COM 对象，就无法避开循环引用问题。

```jsx
let element = document.getElementById('some_element')
let myObject = new Object()
myObject.element = element
element.someObject = myObject
```

这个例子在一个 DOM 对象（`element`）和一个原生 JavaScript 对象（`myObject`）之间制造了循环引用。`myObject`变量有一个名为`element`的属性指向 DOM 对象`element`，而`element`对象有一个`someObject`属性指回`myObject`对象。由于存在循环引用，因此 DOM 元素的内存永远不会被回收，即使它们已经被从页面上删除了也是如此。

为避免类似的循环引用问题，应该在确保不使用的情况下切断原生 JavaScript 对象与 DOM 元素之间的连接。例如：

```jsx
myObject.element = null
element.someObject = null
```

把变量设置为`null`实际上回切断变量与其之前引用值之间的关系。当下次垃圾回收程序运行时，这些值就会被删除，内存会被回收。

为了补救这一点，IE9 把 BOM 和 DOM 对象都改成了 JavaScript 对象，这同时也避免了由于存在两套垃圾回收算法而导致的问题，还消除了常见的内存泄漏现象。

## 性能

垃圾回收程序会周期性运行，如果内存中分配了很多变量，则可能造成性能损失，因此垃圾回收的时间调度很重要。尤其是在内存有限的移动设备上，垃圾回收有可能会明显拖慢渲染的速度和帧率。开发者不知道什么时候运行时会收集垃圾，因此最好的办法是在写代码时就要做到：无论什么时候开始收集垃圾，都能让它尽快结束工作。

现代垃圾回收程序会基于对 JavaScript 运行时的探测来决定何时运行，探测机制因引擎而异，但基本上都是根据已分配对象的大小和数量来判断的。例如根据 V8 团队 2016 年的一片博文的说法：“在一次完整的垃圾回收后，V8 的堆增长策略会根据活跃对象的数量外加一些余量来确定何时再次垃圾回收。”

由于调度垃圾回收程序方面的问题会导致性能下降，IE 曾饱受诟病。它的粗略是根据分配数，例如分配了 256 个变量，4096 个对象/数组字面量和数据槽位（slot），或者 64KB 字符串。只要满足其中某个条件，垃圾回收程序就会运行。这样实现的问题在于，分配那么多变量的脚本，很可能在其整个生命周期内始终需要那么多变量，结果就会导致垃圾回收程序过于频繁地运行。由于对性能的严重影响，IE7 最终更新了垃圾回收程序。

IE7 发布后，JavaScript 引擎的垃圾回收程序被调优为动态改变分配变量、字面量或数组槽位等会触发垃圾回收的阈值。IE7 的起始阈值都与 IE6 相同。如果垃圾回收程序回收的内存不到已分配的 15%，这些变量、字面量或数组槽位的阈值就会翻倍。如果有一次回收的内存达到已分配的 85%，则阈值为默认值。这么一个简单的修改，极大地提升了重度依赖 JavaScript 的网页在浏览器中的性能。

> 在某些浏览器中是有可能（但是不推荐）主动触发垃圾回收的。在 IE 中，`window.CollectGarbage()`方法会立即触发垃圾回收。在 Opera7 及更高版本中，调用`window.opera.collect()`也会启动垃圾回收程序。

## 内存管理

在使用垃圾回收的编程环境中，开发者通常无需关心内存管理。不过，JavaScript 运行在一个内存管理和垃圾回收都很特殊的环境。分配给浏览器的内存通常比分配给桌面软件的要少很多，分配给移动浏览器的都更少了。这更多处于安全的考虑而不是别的，就是为了避免运行大量 JavaScript 的网页耗尽系统内存而导致操作系统崩溃。这个内存限制不仅影响变量分配，也影响调用栈以及能够同时在一个线程中执行的语句数量。

将内存占用量保持在一个较小的值可以让页面的性能更好。优化内存占用的最佳手段就是保证在执行代码时只保存必要的数据。如果数据不再必要，那么把它设置为`null`从而释放其引用。这也可以叫做**解除引用**。这个建议最适合全局变量和全局对象的属性。局部变量在超出作用域后会被自动解除引用，例如：

```jsx
function createPerson(name) {
  let localPerson = new Object()
  localPerson.name = name
  return localPerson
}

let globalPerson = createPerson('Nicholas')

// 解除globalPerson对值的引用
globalPerson = null
```

在上面的代码中，变量`globalPerson`中保存着`createPerson()`函数调用返回的值。在`createPerson()`内部，`localPerson`创建了一个对象并给它添加了一个`name`属性。然后，`localPerson`作为函数值被返回，并被赋值给`globalPerson`。`localPerson`在`createPerson()`执行完成超出上下文后会自动被解除引用，不需要显式处理。但`globalPerson`是一个全局变量，应该在不需要时手动解除其引用，最后一行就是这么做的。

不过要注意，解除对一个值的引用并不会自动导致相关内存被回收。解除引用的关键在于确保相关的值已经不在上下文里了，因此它在下次垃圾回收时会被回收。

### 通过`const`和`let`声明提升性能

ES6 增加的这两个关键字不仅有助于改善代码风格，而且同样有助于改进垃圾回收的过程。因为`const`和`let`都以块（而非函数）为作用域，所以相比于使用`var`，使用这两个新关键字有可能会更早地让垃圾回收程序介入，尽早回收应该回收的内存。在块作用域比函数作用域更早终止的情况下，这就有可能方式。

### 隐藏类和删除操作

根据 JavaScript 所在的运行环境，有时候需要根据浏览器使用的 JavaScript 引擎来采取不同的性能优化策略。截止 2017 年，Chrome 是最流行的浏览器，使用 V8 JavaScript 引擎。V8 将解释后的 JavaScript 代码编译为实际的机器码时会利用“隐藏类”。如果你的代码非常注重性能，那么这一点可能对你很重要。

运行期间，V8 会将创建的对象与隐藏类关联起来，以跟踪它们的属性特征。能够共享隐藏类的对象性能会更好，V8 会根据这种情况进行优化，但不一定总能做到。

```jsx
function Article() {
  this.title = 'Inauguration Ceremony Features Kazoo Band'
}

let a1 = new Article()
let a2 = new Article()
```

V8 会在后台配置，让这两个类实例共享相同的隐藏类，因为这两个实例共享同一个构造函数和原型。假设之后又添加了下面的代码：

```jsx
a2.author = 'Jake'
```

此时两个`Article`实例就会对应两个不同的隐藏类。根据这种操作的频率和隐藏类的大小，可能会对性能产生明显影响。

当然，解决方案就是避免 JavaScript 的“先创建再补充”（ready-fire-aim）式的动态属性赋值，并在构造函数中一次性声明所有属性。

```jsx
function Article(opt_author) {
  this.title = 'Inaguration Ceremony Features Kazoo Band'
  this.author = opt_author
}

let a1 = new Article()
let a2 = new Article('Jake')
```

这样，这两个实例基本上就一样了（不考虑`hasOwnProperty`的返回值），因此可以共享一个隐藏类，从而带来潜在的性能提升。不过要记住，使用`delete`关键字会导致生成相同的隐藏类片段。

```jsx
function Article(opt_author) {
  this.title = 'Inaguration Ceremony Features Kazoo Band'
  this.author = opt_author
}

let a1 = new Article()
let a2 = new Article()

delete a1.author
```

在代码结束后，即使两个实例使用了同一个构造函数，它们也不再共享一个隐藏类。动态删除属性与动态添加属性导致的后果一样。最佳实践是把不想要的属性设置为`null`。这样可以保持隐藏类不变和继续共享，同样也能达到删除引用值供垃圾回收程序回收的效果。

### 内存泄漏

写得不好的 JavaScript 可能出现难以察觉且有害的内存泄漏问题。在内存有限的设备上，或者在函数会被调用很多次的情况下，内存泄漏可能是个大问题。JavaScript 中的内存泄漏大部分是由不合理的引用导致的。

意外声明全局变量是最常见但也最容易修复的内存泄漏问题。下面的代码没有使用任何关键字声明变量：

```jsx
function setName() {
  name = 'Jake'
}
```

此时解释器会把`name`当作`window`的属性来创建。可想而知，在`window`对象上创建的属性，只要`window`本身不被清理就不会消失。这个问题很容易解决，只要在变量声明前面加上`var`、`let`、`const`关键字即可，这样变量就会在函数执行完毕后离开作用域。

定时器也可能悄悄导致内存泄漏。

```jsx
let name = 'Jax'

// 定时器的回调通过闭包引用了外部变量
setInterval(() => {
  console.log(name)
}, 100)
```

只要定时器一直运行，回调函数中引用的`name`就会一直占用内存。垃圾回收程序当然知道这一点，因而就不会清理外部变量。

使用 JavaScript 闭包含容易在不知不觉中造成内存泄漏：

```jsx
let outer = function () {
  let name = 'Jake'
  return function () {
    return name
  }
}
```

调用`outer()`会导致分配给`name`的内存被泄漏。以上代码执行后创建了一个内部闭包，只要返回的函数存在就不能清理`name`，因为闭包一直在引用着它。假如`name`的内容很大（不止是一个小字符串），那么可能就是大问题了。

### 静态分配与对象池

为了提升 JavaScript 性能，最后要考虑的一点往往就是压榨浏览器了。此时一个关键问题就是如何减少浏览器执行垃圾回收的次数。开发者无法直接控制什么时候开始收集垃圾，但可以间接控制触发垃圾回收的条件。理论上，如果能够合理使用分配的内存，同时避免多余的垃圾回收，就可以保住因为释放内存而损失的性能。

浏览器决定何时运行垃圾回收程序的一个标注就是对象更替的速度。如果有很多对象被初始化，然后一下子又都超出了作用域，那么浏览器就会采用更激进的方式调度垃圾回收程序运行，这样当然会影响性能。

```jsx
function addVector(a, b) {
  let resultant = new Vector()
  resultant.x = a.x + b.x
  resultant.y = a.y + b.y
  return resultant
}
```

调用这个函数时，会在堆上创建一个新对象，然后修改它，最后再把它返回给调用者。如果这个矢量对象的生命周期很短，那么它很快会失去所有对它的引用，成为可以被回收的值。假如这个矢量加法函数频繁被调用，那么垃圾回收调度程序会发现这里对象更替的速度很快，从而会更频繁地安排垃圾回收。

该问题的解决方案是不要动态创建矢量对象：

```jsx
function addVector(a, b, resultant) {
  resultant.x = a.x + b.x
  resultant.y = a.y + b.y
  return resultant
}
```

当然这需要在其他地方实例化矢量参数`resultant`，但这个函数的行为没有变。那么在哪里创建矢量可以不让垃圾回收调度程序顶上呢？

一个策略是使用对象池。在初始化的某一刻，可以创建一个对象池，用来管理一组可回收的对象。应用程序可以向这个对象池请求一个对象、设置其属性、使用它，然后在操作完成后再把它还给对象池。由于没有发生对象初始化，垃圾回收探测就不会发现有对象更替，因此垃圾回收程序就不会那么频繁地运行。

如果对象池只按需分配矢量（在对象不存在时创建新的，对象存在时则复用存在的），那么这个实现本质上是一种贪婪算法，有单调增长但为静态的内存。这个对象池必须使用某种结构维护所有对象，数组是比较好的选择。不过最好在初始化时就创建一个足够大的数组，从而避免删除数组再创建数组的操作（JavaScript 数组大小动态可变）导致垃圾回收。

> 静态分配是优化的一种**极端形式**。如果你的应用程序被垃圾回收严重地拖了后腿，可以利用它提升性能，但这种情况并不多见。大多数情况下，这都属于过早优化，因此不用考虑。

# 小结

JavaScript 变量可以保存两种类型的值：原始值和引用值。原始值可能是以下 6 种原始数据类型之一：`undefined`、`null`、`boolean`、`number`、`string`、`symbol`。原始值和引用值有以下特点：

- 原始值大小固定，因此保存在栈上。
- 从一个变量到另个变量赋值原始值会创建该值的第二个副本。
- 引用值是对象，存储在堆内存上。
- 包含引用值的变量实际上只包含指向相应对象的一个指针，而不是对象本身。
- 从一个变量到另一个变量复制引用值只会复制指针，因此结果是两个变量都指向同一个对象。
- `typeof`操作符可以确定值的原始类型，而`instanceof`操作符用于确保值的引用类型。

任何变量都存在于某个执行上下文中（也成为作用域）。这个上下文（作用域）决定了变量的生命周期，以及它们可以访问代码的哪些部分。执行上下文可以总结如下：

- 执行上下文分全局上下文、函数上下文和块级上下文。
- 代码执行流每进入一个新上下文，都会创建一个作用域链，用于搜索变量和函数。
- 函数或块的局部上下文不仅可以访问自己作用域内的变量，而且也可以访问任何包含上下文乃至全局上下文中的变量。
- 全局上下文只能访问全局上下文中的变量和函数，不能直接访问局部上下文中的任何数据。
- 变量的执行上下文用于确定什么时候释放内存。

JavaScript 是使用垃圾回收的编程语言，开发者不需要操心内存分配和回收。JavaScript 的垃圾回收程序可以总结如下：

- 离开作用域的值会被自动标记为可回收，然后在垃圾回收期间被删除。
- 主流的垃圾回收算法是标记清理，即先给当前不使用的值加上标记，再回来回收它们的内存。
- 引用计数是另一种垃圾回收策略，需要记录值被引用了多少次。JavaScript 引擎不再使用这种算法，但某些旧版本的 IE 仍会受到这种算法的影响，原因是 JavaScript 会访问非原生 JavaScript 对象（如 DOM 元素）。
- 引用计数在代码中存在循环引用时会出现问题。
- 解除变量的引用不仅可以消除循环引用，而且对垃圾回收也有帮助。为促进内存回收，全局对象、全局对象的属性和循环引用都应该在不要时解除引用。
