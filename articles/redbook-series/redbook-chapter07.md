---
title: （七）迭代器与生成器
date: 2022-02-07
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h0xw5gatecj20xc0ildgg.jpg
---

迭代是指按照既定顺序反复多次执行一段程序，通常会有明确的终止条件。ES6 规范新增了两个高级特性：迭代器和生成器。它们的引入使得 ECMAScript 可以更加清晰、方便、高效地实现迭代。

# 为什么要有迭代器

最简单的迭代是使用普通`for`循环：

```javascript
for (let i = 1; i <= 10; i++) {
  console.log(i)
}
```

循环需要指定迭代的次数、每次迭代执行的例程和迭代的终止条件。迭代会在一个有序集合上进行，数组是一个典型的有序集合。因为数组具有已知长度并且可以按索引取值，所以数组可以通过遍历索引进行迭代操作。但是通过循环计数的方式迭代并不理想：

- **在迭代之前就需要知道如何使用数据结构**，这种做法不够通用。
- **遍历顺序并不是数据结构固有的**，通过递增索引来访问数组可以，但并非所有数据结构都适用。

ES5 新增了`Array.prototype.forEach()`方法，是向通用迭代需求的一次迈进（但不完美）。

```javascript
const collection = ['a', 'b', 'c']
collection.forEach(item => console.log(item))
```

使用`forEach`可以解决单独记录数组索引取值的问题。不过，没有办法标识迭代何时终止。因此这个方法仅适用于数组，并且使用回调结构略显笨拙。

在 ECMAScript 早期版本中，执行迭代必须使用循环或者其他辅助结构。代码量增加时会变得混乱。很多语言都通过原生语言结构解决了本问题，**开发者无须知道如何迭代就能够实现迭代操作**。这个解决方案就是**迭代器**模式。

# 迭代器模式

**迭代器模式**给出了这样一个解决方案：将有些结构称为“可迭代对象”，因为它们都正式实现了`Iterable`接口，并且可以通过迭代器`Iterator`消费。

一个可迭代对象通常是一个集合，并且需要符合两个基本特征：1）包含有限个元素；2）具有无歧义的遍历顺序。例如数组的元素是有限个，并且可以通过递增索引来按序访问元素；`Set`实例的元素是有限个，并且可以按照插入的顺序来顺序访问每个元素。

> 可迭代对象不一定是集合对象，也可以仅仅是具有类似数组行为的其他数据结构，例如一个计数循环。该循环生成的值是暂时性的，但是循环本身是在执行迭代。计数循环也具有可迭代对象的行为。（临时性可迭代对象可以实现为生成器。）

任何实现`Iterable`接口的数据结构都可以被实现`Iterator`接口的结构“消费”。**迭代器**是按需创建的一次性对象。每个迭代器都会关连一个**可迭代对象**，而迭代器会暴露迭代其关联可迭代对象的 API。迭代器无须了解其关联的可迭代对象的结构，只需要知道如何取得连续的值。这种概念上的分离正是迭代器模式的强大之处。

## 可迭代协议

实现`Iterable`接口（可迭代协议）需要同时具备支持迭代的自我识别能力和创建实现`Iterator`接口的对象的能力。在 ECMAScript 中，这意味着该对象必须暴露一个属性作为“默认迭代器”，而且这个属性必须使用特殊的`Symbol.iterator`作为键。这个默认迭代器属性必须引用一个迭代器工厂函数，调用这个工厂函数必须返回一个新迭代器。ES6 中很多内置类型都实现了`Iterable`接口：

- 数组
- 字符串
- 映射`Map`
- 集合`Set`
- `arguments`对象
- `NodeList`等 DOM 集合类型

检查是否存在默认迭代器属性可以暴露这个工厂函数：

```javascript
const arr = ['a', 'b', 'c']
console.log(arr[Symbol.iterator]) // [Function: values]
const num = 2020
console.log(num[Symbol.iterator]) // undefined
```

代码编写过程中不需要显式调用这个工厂函数来生成迭代器。实现可迭代协议的所有类型都会自动兼容接收可迭代对象的任何语言特性。这些原生语言特性包括：

- `for-of`循环
- 数组解构
- 扩展操作符
- `Array.from()`
- 创建集合
- 创建映射
- `Promise.all()`接收由期约组成的可迭代对象
- `Promise.race()`
- `yield*`操作符，在生成器中使用

这些原生语言结构都在后台调用提供的可迭代对象的这个工厂函数，从而创建一个迭代器。

## 迭代器协议

前面已经提及，迭代器是一种一次性使用的对象，用于迭代与其关联的可迭代对象。迭代器 API 使用`next()`方法在可迭代对象中遍历数据。每次成功调用`next()`都会返回一个`IteratorResult`对象，其中包含迭代器返回的下一个值。若不调用`next()`，则无法知道迭代器的当前位置。

`next()`方法返回的`IteratorResult`包含两个属性：`done`和`value`。`done`是一个布尔值，表示是否还可以再次调用`next()`获取下一个值；`value`包含可迭代对象的下一个值（`done`为`false`），或者`undefined`（`done`为`true`）。`done: true`状态称为“耗尽”。

```javascript
const arr = [1, 3, 2, 3]
const iter = arr[Symbol.iterator]()
iter.next() // { value: 1, done: false }
iter.next() // { value: 3, done: false }
iter.next() // { value: 2, done: false }
iter.next() // { value: 3, done: false }
iter.next() // { value: undefined, done: true }
```

迭代器并不知道怎么从可迭代对象中获取下一个值，也不知道可迭代对象有多大。只要迭代器到达`done: true`状态，后续调用`next()`就一直返回同样的值了。每个迭代器都表示对可迭代对象的一次性有序遍历。不同迭代器的实例相互之间没有联系，只会独 立地遍历可迭代对象。

迭代器并不与可迭代对象某个时刻的快照绑定，而仅仅是使用游标来记录遍历可迭代对象的历程。如果可迭代对象在迭代期间被修改了，那么迭代器也会反映相应的变化：

```javascript
const arr = [1, 2, 3, 4]
const iter = arr[Symbol.iterator]()
iter.next() // { value: 1, done: false }
iter.next() // { value: 2, done: false }
arr.splice(2, 1, 44)
iter.next() // { value: 44, done: false }
iter.next() // { value: 4, done: false }
arr.push(5)
iter.next() // { value: 5, done: false }
iter.next() // { value: undefined, done: true }
```

> 注意迭代器会维护一个指向可迭代对象的引用，因此迭代器会阻止垃圾回收程序回收可迭代对象。

## 自定义迭代器

与`Iterable`接口类似，任何实现`Iterator`接口的对象都可以作为迭代器使用。

```javascript
class Counter {
  constructor(limit) {
    this.limit = limit
  }

  [Symbol.iterator]() {
    let count = 1
    const limit = this.limit
    return {
      next() {
        if (count < limit) {
          return { done: false, value: count++ }
        } else {
          return { done: true, value: undefined }
        }
      },
    }
  }
}
```

## 提前终止迭代器

可选的`return()`方法用于指定在迭代器关闭时执行的逻辑。执行迭代的结构在想让迭代器知道它不想遍历到可迭代对象耗尽时，就可以“关闭”迭代器。可能的情况包括：

- `for-of`循环提前退出
- 解构操作并未消费所有值

`return()`方法必须返回一个有效的`IteratorResult`对象。简单情况下，可以只返回`{done: true}`。**这个返回值只会用在生成器的上下文中**。

内置语言结构发现还有更多值可以迭代，但不会消费这些值时，会自动调用`return()`方法。

```javascript
class Counter {
  constructor(limit) {
    this.limit = limit
  }

  [Symbol.iterator]() {
    let count = 1
    const limit = this.limit
    return {
      next() {
        if (count <= limit) {
          return {
            done: false,
            value: count++
          }
        } else {
          return {
            done: true
          }
        },
        return () {
          console.log('exiting prematurely')
          return {
            done: true
          }
        }
      }
    }
  }
}
```

# 生成器

生成器是 ES6 新增的一个非常灵活的结构，拥有在一个函数块内部暂停和恢复代码执行的能力。这种能力具有很深的影响，例如使用生成器可以自定义迭代器和实现协程。

## 生成器语法

生成器的形式是一个函数，函数名称前面加上`*`表明这是一个生成器。只要是可以定义函数的地方都可以定义生成器。

```javascript
function* generatorFn() {}

const generatorFn = function* () {}

let foo = {
  *generatoreFn() {},
}

class Foo {
  *generatorFn() {}
}

class Bar {
  static *generatorFn() {}
}
```

> 箭头函数不能用来定义生成器函数

调用生成器函数会产生一个**生成器对象**。生成器对象一开始处于暂停状态（suspended)。与迭代器类似，生成器对象实现了`Iterator`接口，具有`next()`方法。调用这个方法会让生成器开始或恢复执行。

```javascript
function* generatorFn() {}
const g = generatorFn()
console.log(g) // Ojbect [Generator] {}
console.log(g.next) // { value: undefined, done: true }
```

`next()`的返回值类似于迭代器，有一个`done`属性和一个`value`属性。函数体为空的生成器函数中间不会停留，调用一次`next()`就终止。

```javascript
function* generatorFn() {
  for (let i = 0; i < 5; i++) {
    yield i ** 2
  }
  return 'oops'
}

const g = generatorFn()

console.log(g.next())
console.log(g.next())
console.log(g.next())
console.log(g.next())
console.log(g.next())
console.log(g.next())
console.log(g.next())
/*
{ value: 0, done: false }
{ value: 1, done: false }
{ value: 4, done: false }
{ value: 9, done: false }
{ value: 16, done: false }
{ value: 'oops', done: true }
{ value: undefined, done: true }
*/

function* gen() {
  console.log('next value')
}

const g = gen()

console.log(g.next())
// next value
// { value: undefined, done: true }

console.log(g[Symbol.iterator]() === g)
// true
```

`value`属性是生成器函数的返回值，默认值为`undefined`。

## 通过`yield`中断执行

`yield`关键字可以让生成器停止和开始执行，这也是生成器有用的地方。生成器函数在遇到 yield 关键字之前会正常执行。遇到之后，执行会停止，函数的作用域状态会保留。停止执行的生成器函数只有通过在生成器对象上调用`next()`方法来恢复执行。

> `yield`关键字有点类似于函数的中间返回语句，它生成的值会出现在`next()`的返回对象中。通过`yield`关键字退出的生成器函数会处在`done: false`状态；通过`return`关键字退出的生成器函数会处于`done: true`状态。

```javascript
function* generatorFn() {
  yield 'foo'
  yield 'bar'
  yield 'baz'

  return 'hello'
}

const g = generatorFn()

console.log(g.next())
console.log(g.next())
console.log(g.next())
console.log(g.next())
/*
{ value: 'foo', done: false }
{ value: 'bar', done: false }
{ value: 'baz', done: false }
{ value: 'hello', done: true }
*/
```

生成器函数内部的执行流程会针对每个生成器对象区分作用域。在一个生成器上调用`next()`不会影响其他生成器。

`yield`关键字只能在生成器函数内部使用，用在其他地方会抛出错误。类似函数的`return`关键字。`yield`关键字必须直接位于生成器函数的定义中，不能使用在其函数体内定义的嵌套非生成器函数中。

```javascript
function* nTimes(n) {
  while (n) {
    yield n--
  }
}

const g = nTimes(10)
console.log([...g])
/* 
[
  10, 9, 8, 7, 6,
   5, 4, 3, 2, 1
]
*/
```

## 使用`yield`实现输入输出

除了可以作为函数的中间返回语句使用，`yield`还可以作为函数的中间参数使用。上一次让生成器函数暂停的`yield`关键字会接收到传给`next()`方法的第一个值。第一次调用`next()`传入的值不会被使用，因为这一次调用是为了开始执行生成器函数。

```javascript
function* generatorFn() {
  return yield 'foo'
}

const g = generatorFn()
console.log(g.next('bar')) // { value: 'foo', done: false }
console.log(g.next('bar')) // { value: 'bar', done: true }
```

这里因为函数必须对整个表达式求值才能确定要返回的值，因此在遇到`yield`关键字时暂停执行并且计算出要产生的值。下一次调用`next()`传入了参数，作为交给同一个`yield`的值，然后这个值被确定为本次生成器函数要返回的值。

### 产生可迭代对象

可以使用`*`加强`yield`的行为，让它能够迭代一个可迭代对象，从而一次产出一个值。

```javascript
function generatorFn() {
  yield* [1, 2, 3, 4]
}

function nTimes(n) {
  if (n > 0) {
    yield* nTimes(n - 1)
    yield n - 1
  }
}
```

## 生成器作为默认迭代器

因为生成器对象实现了`Iterable`接口，并且生成器函数和默认迭代器被调用之后都产生迭代器，因此**生成器函数特别适合作为默认迭代器**。

```javascript
class Foo {
  constructor() {
    this.values = [1, 2, 3, 4]
  }

  *[Symbol.iterator]() {
    yield* this.values
  }
}

for (const x of new Foo()) {
  console.log(x)
}
/*
1
2
3
4
*/
```

## 提前终止生成器

和迭代器类似，生成器也支持“关闭”的概念。一个实现`Iterator`接口的对象一定有`next()`方法，还有一个可选的`return()`方法用于提前终止迭代器。生成器对象除了有这两个方法，还有第三个方法`throw()`。

`return()`和`throw`都可以用于强制生成器进入关闭状态。

```javascript
function* generatorFn() {
  yield* [1, 2, 3, 4]
}

const g = generatorFn()

g.return(4)

console.log(g.next()) // { value: undefined, done: true }
```

`return()`方法会强制生成器进入关闭状态，并且无法恢复。所有生成器对象都有`return()`方法。后续调用`next()`会显示`done: true`状态，提供的任何返回值都不会被存储或传播。`for-of`循环等内置语言结构会忽略状态为`done: true`的`IteratorObject`内部返回的值。

`throw()`方法会在暂停的时候将一个错误注入到生成器对象中。如果错误未被处理，那么生成器就会关闭。不过加入生成器函数**内部**处理了这个错误，那么生成器就不会关闭，而且还可以恢复执行。错误处理会跳过对应的`yield`。

```javascript
function* generatorFn() {
  for (const x of [1, 2, 3, 4]) {
    try {
      yield x
    } catch (ignore) {}
  }
}

const g = generatorFn()

console.log(g.next())
g.throw('foo')
console.log(g.next())
console.log(g.next())
console.log(g.next())
/*
{ value: 1, done: false }
{ value: 3, done: false }
{ value: 4, done: false }
{ value: undefined, done: true }
*/
```

在这个例子中，生成器在`try/catch`块中的`yield`关键字处暂停执行。在暂停期间，`throw()`方法向生成器对象内部注入了一个错误。这个错误被`yield`关键字抛出。因为例子中错误仍然被生成器内部捕获，因此没有关闭。但是`yield`抛出了那个错误，所以生成器就不会再产出值`2`。因此生成器函数继续执行。

> 如果生成器对象还没有开始执行，那么调用`throw()`抛出的错误不会在函数内部被捕获，因为这相当于在函数块外部抛出了错误。

# 总结

迭代是一种所有编程语言中常见的模式。ES6 正式支持迭代模式，并且引入了两个新的语言特性：**迭代器**和**生成器**。

迭代器是一个可以由任意对象实现的接口，支持连续获取对象产出的每一个值。任何实现`Iterable`接口的对象都有一个`Symbol.iterator`属性，这个属性引用默认迭代器。默认迭代器就像一个迭代器工厂，也就是一个函数，调用之后会产生一个实现`Iterator`接口的对象。

迭代器必须通过连续调用`next()`方法才能连续获取值，这个方法返回一个`IteratorObject`。这个对象包含一个`done`属性和一个`value`属性。前者是一个布尔值，表示是否还有更多值可以访问；后者包含迭代器返回的当前值。这个接口可以通过反复手动调用`next()`方法来消费，也可以通过原生消费者，例如`for-of`循环来自动消费。

生成器是一种特殊的函数，调用之后会返回一个生成器对象。生成器对象实现了`Iterable`接口，因此可以用在任何可以消费可迭代对象的地方。生成器的独特之处在于支持内部使用`yield`关键字，能够暂停执行生成器函数。使用`yield`关键字还可以通过`next()`方法接收输入和产生输出。`yield*`可以将跟在后面的可迭代对象序列化为一串值。
