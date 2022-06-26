---
title: （八）对象、类与面向对象编程
date: 2022-05-25
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h2jxk10fjcj20jg0bo0t5.jpg
---

ECMA-262 将对象定义为一组属性的无序集合。严格来说，这意味着对象是一组没有特定顺序的值。对象的每个属性或方法都由一个名称来标识，这个名称映射到一个值。正因如此，可以将 ECMAScript 的对象想象成一个散列表，其中的内容就是一组名/值对，值可以是数据或者函数。

# 理解对象

创建自定义对象的通常方式是创建`Object`的一个新实例，然后再给它添加属性和方法，例如：

```jsx
const person = new Object()
person.name = 'Nicholas'
person.age = 29
person.job = 'Software Engineer'
person.sayName = function () {
  console.log(this.name)
}
```

这个例子创建了一个名为`person`的对象，而且又添加了三个属性和一个方法。`sayName()`方法会显示`this.name`的值，这个属性会被解析成`person.name`。早期 JavaScript 开发者频繁使用这种方式创建新对象。几年后，对象字面量变成了更流行的方式。前面的例子如果使用对象字面量可以这样写：

```jsx
const person = {
  name: 'Nicholas',
  age: 29,
  job: 'Software Engineer',
  sayName() {
    console.log(this.name)
  },
}
```

这个例子中的`person`对象跟前面例子中的`person`对象是等价的，它们的属性和方法都一样。这些属性都有自己的特征，而这些特征决定了它们在 JavaScript 中的行为。

## 属性的类型

ECMA-262 使用一些内部特性来描述属性的特征。这些特性是由为 JavaScript 实现引擎的规范定义的。因此，开发者不能在 JavaScript 中直接访问这些特性。为了将某个特性标识为内部特性，规范会用两个中括号把特性的名称括起来，例如`[[Enuerable]]`。

属性分两种：数据属性和访问器属性。

### 数据属性

数据属性包含一个保存数据值的位置。值会从这个位置读取，也会写入到这个位置。数据属性有 4 个特性描述它们的行为。

- `[[Configurable]]`：表示属性是否可以通过`delete`删除并重新定义，是否可以修改它的特性，以及是否可以把它改为访问器属性。默认情况下，所有直接定义在对象上的属性的这个特性都是`true`，如前面的例子所示。
- `[[Enumerable]]`：表示属性是否可以通过`for-in`循环返回。默认情况下，所有直接定义在对象上的属性的这个特性都是`true`。
- `[[Writable]]`：表示属性的值是否可以被修改。默认情况下，所有直接定义在对象上的属性的这个特性都是`true`。
- `[[Value]]`：包含属性实际的值。这就是前面提到的那个读取和写入属性值的位置。这个特性的默认值为`undefined`。

在像前面例子中那样将属性显式添加到对象之后，`[[Configurable]]`、`[[Enuerable]]`和`[[Writable]]`都会被设置为`true`，而`[[Value]]`特性会被设置为指定的值。

要修改属性的默认特性，就**必须**使用`Object.defineProperty()`方法。这个方法接收 3 个参数：要给其添加属性的对象、属性的名称和一个描述符对象。最后一个参数，即描述符对象上的属性可以包含：`configurable`、`enumerable`、`writable`和`value`，跟相关特性的名称一一对应。根据要修改的特性，可以设置其中一个或多个值。例如：

```jsx
const person = {}
Object.defineProperty(person, 'name', {
  writable: false,
  value: 'Nicholas',
})
console.log(person.name) // 'Nicholas'
person.name = 'Greg'
console.log(person.name)
```

这个例子创建了一个名为`name`的属性并给它赋予了一个只读的值`"Nicholas"`。这个属性的值就不能再修改了，在非严格模式下尝试给这个属性重新赋值会被忽略。在严格模式下，尝试修改只读属性的值会抛出错误。

类似的规则也适用于创建不可配置的属性，例如：

```jsx
const person = {}
Object.defineProperty(person, 'name', {
  configurable: false,
  value: 'Nicholas',
})

console.log(person.name) // 'Nicholas'
delete person.name
console.log(person.name) // 'Nicholas'
```

这个例子把`configurable`设置为`false`，意味着这个属性不能从对象上删除。非严格模式下对这个属性调用`delete`没有效果，严格模式下会抛出错误。此外，一个属性被定义为不可配置后，就不能再变回可配置的了。再次调用`Object.defineProperty()`并修改任何非`writable`属性会导致错误：

```jsx
const person = {}
Object.defineProperty(person, 'name', {
  configurable: false,
  value: 'Nicholas',
})

// 抛出错误
Object.defineProperty(person, 'name', {
  configurable: true,
  value: 'Nicholas',
})
```

因此，虽然可以对同一个属性多次调用`Object.defineProperty()`，但在把`configurable`设置为`false`之后就会受限制了。

在调用`Object.defineProperty()`时，`configurable`、`enumerable`和`writable`的值如果不指定，则都默认为`false`。多数情况下，可能都不需要`Object.defineProperty()`提供的这些强大的设置，但要理解 JavaScript 对象，就要理解这些概念。

### 访问器属性

访问器属性不包含数据值。相反，它们包含一个获取（getter）函数和一个设置（setter）函数，不过这两个函数不是必需的。在读取访问器属性时，会调用获取函数，这个函数的责任就是返回一个有效的值。在写入访问器属性时，会调用设置函数并传入新值，这个函数必须决定对数据做出什么修改。访问器属性有 4 个特性描述它们的行为。

- `[[Configurable]]`：表示属性是否可以通过`delete`删除并重新定义，是否可以修改它的特性，以及是否可以把它改为数据属性。默认情况下，所有直接定义在对象上的属性的这个特性都是`true`。
- `[[Enumerable]]`：表示属性是否可以通过`for-in`循环返回。默认情况下，所有直接定义在对象上的属性的这个特性都是`true`。
- `[[Get]]`：获取函数，在读取属性时调用。默认值为`undefined`。
- `[[Set]]`：设置函数，在写入属性时调用。默认值为`undefined`。

**访问器属性是不能直接定义的**，必须使用`Object.defineProperty()`。下面是一个例子：

```jsx
// 定义一个对象，包含私有成员year_和公共成员edition
const book = {
  year_: 2017,
  edition: 1,
}

Object.defineProperty(book, 'year', {
  get() {
    return this.year_
  },
  set(newValue) {
    if (newValue > 2017) {
      this.year_ = newValue
      this.edition += newValue - 2017
    }
  },
})

book.year = 2018
console.log(book.edition) // 2
```

在这个例子中，对象`book`有两个默认属性：`year_`和`edition`。`year_`中的下划线常用来表示改属性并不希望在对象方法的外部被访问。另一个属性`year`被定义为一个访问器属性，其中获取函数简单地返回`year_`的值，而设置函数会做一些计算以决定正确的版本（edition）。因此，把`year`属性改为 2018，也会导致`year_`变为 2018，`edition`变成 2。这是访问器属性的典型使用场景，即设置一个属性值会导致一些其他变化发生。

获取函数和设置函数不一定都要定义。只定义获取函数意味着属性是只读的，尝试修改属性会被忽略。在严格模式下，尝试写入只定义了获取函数的属性会抛出错误。类似地，只有一个设置函数的属性是不能读取的，非严格模式下读取会返回`undefined`，严格模式下会抛出错误。

在不支持`Object.defineProperty()`的浏览器中没有办法修改`[[Configurable]]`或`[[Enumerable]]`。

> 注意，在 ES5 以前，开发者会使用两个非标准的访问创建访问器属性：`__defineGetter__()`和`__defineSetter__()`。这两个方法最早是 Firefox 引入的，后来 Safari、Chrome 和 Opera 也实现了。

## 定义多个属性

在一个对象上同时定义多个属性的可能性是非常大的。为此，ECMAScript 提供了`Object.defineProperties()`方法。这个方法可以通过多个描述符一次性定义多个属性。它接收两个参数：要为之添加或修改属性的对象和另一个描述符对象，其属性与要添加或修改的属性一一对应。例如：

```jsx
const book = {}
Object.defineProperties(book, {
  year_: {
    value: 2007,
  },
  edition: {
    value: 1,
  },
  year: {
    get() {
      return this.year_
    },
    set(newValue) {
      if (newValue > 2017) {
        this.year_ = newValue
        this.edition += newValue - 2017
      }
    },
  },
})
```

这段代码在`book`对象上定义了两个数据属性`year_`和`edition`，还有一个访问器属性`year`。最终的对象跟上一节示例中的一样。唯一的区别是所有属性都是同时定义的，并且数据属性的`configurable`、`enumerable`和`writable`特性值都是`false`。

## 读取属性的特性

使用`Object.getOwnPropertyDescriptor()`方法可以取得指定属性的属性描述符。这个方法接收两个参数：属性所在的对象和要取得其描述符的属性名。返回值是一个对象，对于访问器属性包含`configurable`、`enumerable`、`get`和`set`属性，对于数据属性包含`configurable`、`enumerable`、`writable`和`value`属性。例如：

```jsx
const book = {}
Object.defineProperties(book, {
  year_: {
    value: 2007,
  },
  edition: {
    value: 1,
  },
  year: {
    get() {
      return this.year_
    },
    set(newValue) {
      if (newValue > 2017) {
        this.year_ = newValue
        this.edition += newValue - 2017
      }
    },
  },
})

const descriptor = Object.getOwnPropertyDescriptor(book, 'year_')
console.log(descriptor.value) // 2017
console.log(descriptor.configurable) // false
console.log(typeof descriptor.get) // undefined
const descriptor2 = Object.getOwnPropertyDescriptor(book, 'year')
console.log(descriptor2.value) // undefined
console.log(descriptor2.enumerable) // false
console.log(typeof descriptor2.get) // function
```

对于数据属性`year_`，`value`等于原来的值，`configurable`是`false`，`get`是`undefined`。对与访问器属性`year`，`value`是`undefined`，`enumerable`是`false`，`get`是一个指向获取函数的指针。

ECMAScript 2017 新增了`Object.getOwnPropertyDescriptors()`静态方法。这个方法实际上会在每个自有属性上调用`Object.getOwnPropertyDescriptor()`并在一个新对象中返回它们。对于前面的例子，使用这个静态方法会返回如下对象：

```jsx
const book = {}
Object.defineProperties(book, {
  year_: {
    value: 2017,
  },
  edition: {
    value: 1,
  },
  year: {
    get: function () {
      return this.year_
    },
    set: function (newValue) {
      if (newValue > 2017) {
        this.year_ = newValue
        this.edition += newValue - 2017
      }
    },
  },
})

console.log(Object.getOwnPropertyDescriptors(book))
// {
//   year_: {
//     value: 2017,
//     writable: false,
//     enumerable: false,
//     configurable: false
//   },
//   edition: { value: 1, writable: false, enumerable: false, configurable: false },
//   year: {
//     get: [Function: get],
//     set: [Function: set],
//     enumerable: false,
//     configurable: false
//   }
// }
```

## 合并对象

JavaScript 开发者经常觉得“合并”（merge）两个对象很有用。更具体地说，就是把源对象所有的本地属性一起复制到目标对象上。有时候这种操作也被称为“混入”（mixin），因为目标对象通过混入源对象的属性得到了增强。

ECMAScript 6 专门为合并对象提供了`Object.assign()`方法。这个方法接收一个目标对象和一个或多个源对象作为参数，然后将每个源对象中可枚举（`Object.prototype.propertyIsEnumerable()`返回`true`）和自有属性（`Object.prototype.hasOwnProperty()`返回`true`）复制到目标对象。以字符串和符号为键的属性会被复制。对每个符合条件的属性，这个方法会使用源对象上的`[[Get]]`取得属性的值，然后使用目标对象上的`[[Set]]`设置属性的值。

```jsx
let dest, src, result

dest = {}
src = { id: 'src' }

result = Object.assign(dest, src)

// Object.assign修改目标对象，也会返回修改后的目标对象
console.log(dest === result) // true
console.log(dest !== src) // true
console.log(result) // { id: src }
console.log(dest) // { id: src }

// 多个源对象
dest = {}
result = Object.assign(dest, { a: 'foo' }, { b: 'bar' })
console.log(result) // { a: foo, b: bar }

// 获取函数和设置函数
dest = {
  set a(val) {
    console.log(`Invoked dest setter with param ${val}`)
  },
}

src = {
  get a() {
    console.log(`Invoked src getter`)
    return 'foo'
  },
}

Object.assign(dest, src)
// 调用 src 的获取方法
// 调用 dest 的设置方法并传入参数"foo"
// 因为这里的设置函数不执行赋值操作
// 所以实际上并没有把值转移过来
```

`Object.assign()`实际上对每个源对象执行的是浅复制。如果多个源对象都有相同的属性，则使用最后一个复制的值。此外，从源对象访问器属性取得的值，例如获取函数，会作为一个静态值赋给目标对象。换句话说，不能在两个对象间转移获取函数和设置函数。

> 如果赋值期间出错，则操作会终止并退出，同时抛出错误。`Object.assign()`没有“回滚”之前赋值的概念，因此它是一个尽力而外、可能只会完成部分复制的方法。
>
> ```jsx
> let dest, src, result
>
> dest = {}
>
> src = {
>   a: 'foo',
>   get b() {
>     throw new Error()
>   },
>   c: 'bar',
> }
>
> try {
>   Object.assign(dest, src)
> } catch (ignore) {}
>
> // Object.assign()没办法回滚已经完成的修改，因此在抛出错误之前，对象上已经完成的修改会继续存在。
> console.log(dest) // { a: 'foo' }
> ```

## 对象标识及相等判定

在 ECMAScript 6 之前，有些特殊情况即使是使用`===`操作符也无能为力：

```jsx
// 这些情况在不同JavaScript引擎中表现不同，但仍被认为相等
console.log(+0 === -0) // true
console.log(+0 === 0) // true
console.log(-0 === 0) // true

// 要确定NaN的相等性，必须使用讨厌的isNaN()
console.log(NaN === NaN) // false
console.log(isNaN(NaN)) // false
```

为改善这类情况，ECMAScript 6 规范新增了`Object.is()`，这个方法和`===`很像，但同时也考虑到了上述边界情形。这个方法必须接收两个参数：

```jsx
console.log(Object.is(true, 1)) // false
console.log(Object.is({}, {})) // false
console.log(Object.is('2', 2)) // false

console.log(Object.is(+0, -0)) // false
console.log(Object.is(+0, 0)) // true
console.log(Object.is(-0, 0)) // false

console.log(Object.is(NaN, NaN)) // true
```

要检查超过两个值，递归地利用相等性即可：

```jsx
function recrusivelyCheckEqual(x, ...rest) {
  return Object.is(x, rest[0]) && (res.length < 2 || recursivelyCheckEqual(..rest))
}
```

## 增强的对象语法

ECMAScript 6 为定义和操作对象新增了很多极其有用的语法糖特性。这些特性都没有改变现有引擎的行为，但极大提升了处理对象的方便程度。

> 本节介绍的所有对象语法同样适用于 ES6 的类。

### 属性值简写

在给对象添加变量的时候，开发者经常会发现，变量名和属性名是一样的，例如：

```jsx
const name = 'Peter'

const person = {
  name: name,
}
```

为此，简写属性名语法出现了。简写属性名只要使用变量名就会被自动解释为同名的属性键。如果没有找到同名变量，会抛出`ReferenceError`。

以下代码和之前的代码等价：

```jsx
const name = 'Peter'

const person = {
  name,
}
```

代码压缩程序会在不同作用于间保留属性名，以防止找不到引用。

### 可计算属性

在引入可计算属性之前，如果想使用变量的值作为属性，那么必须先声明对象，然后使用中括号语法来添加属性。换句话说就是不能在对象字面量中直接动态命名属性，例如：

```jsx
const nameKey = 'name'
const ageKey = 'age'
const jobKey = 'job'

const person = {}
person[nameKey] = 'Matt'
person[ageKey] = 27
person[jobKey] = 'Software engineer'
```

有了可计算属性，就可以在对象字面量中完成动态属性赋值。中括号包围的对象属性键告诉运行时将其作为 JavaScript 表达式而不是字符串来求值。

```jsx
const nameKey = 'name'
const ageKey = 'age'
const jobKey = 'job'

const person = {
  [nameKey]: 'Matt',
  [ageKey]: 27,
  [jobKey]: 'Software engineer',
}
```

因为被当作 JavaScript 表达式求值，所以可计算属性本身可以是复杂的表达式，在实例化时再求值。

> 注意可计算属性表达式中抛出任何错误都会中断对象创建。如果计算属性的表达式有副作用，那就要小心了，因为如果表达式抛出错误，那么之前完成的计算是不能回滚的。

### 简写方法名

以前给对象定义方法的时候，需要写一个方法名、冒号，然后再引用一个匿名函数表达式，如下所示：

```jsx
const person = {
  sayName: function (name) {
    console.log(`${name}`)
  },
}

person.sayName()
```

新的简写方法遵循同样的模式，但是开发者要放弃给函数表达式命名。相应地，这样可以明显缩短方法声明：

```jsx
const person = {
  sayName(name) {
    console.log(`${name}`)
  },
}
```

简写方法名对获取函数和设置函数也是适用的：

```jsx
const person = {
  name_: '',
  get name() {
    return this.name_
  },
  set name(name) {
    this.name_ - name
  }
  sayName() {
    console.log(this.name_)
  }
}
```

简写方法名与可计算属性键相互兼容：

```jsx
const methodKey = 'sayName'

const person = {
  [methodKey](name) {
    console.log(name)
  },
}
```

## 对象结构

ECMAScript 6 新增了对象解构语法，可以在一条语句中使用嵌套数据实现一个或者多个赋值操作。简单来说，对象结构就是使用与对象匹配的结构来实现对象属性赋值。

```jsx
const person = {
  name: 'Matt',
  age: 27,
}

const { name: personName, age: personAge } = person

console.log(personName)
console.log(personAge)
```

解构赋值不一定与对象的属性匹配。赋值的时候可以忽略某些属性，而如果引用的属性不存在，则该变量的值就是`undefined`。

也可以在解构赋值的同时定义默认值，这适用于前面提到的引用的属性不存在于源对象中的情况：

```jsx
const person = {
  name: 'Matt',
  age: 27,
}

const { name, job = 'Software Engineer' } = person
```

解构在内部使用函数`ToObject()`（不能在运行时环境中直接访问）把源数据结构转换为对象。这意味着在对象解构的上下文中，原始值会被当成对象。这也意味着（根据`ToObject()`的定义），`null`和`undefined`不能被结构，否则会抛出错误。

```jsx
const { length } = 'foobar'
console.log(length) // 6

const { constructor: c } = 4
console.log(c === Number) // true

let { _ } = null // TypeError
let { _ } = undefined // TypeError
```

解构并不要求变量必须在解构表达式中声明。不过，如果是给事先声明的变量赋值，则赋值表达式必须包含在一对括号中：

```jsx
let personName, personAge

const person = {
  name: 'Matt',
  age: 27,
}

;({ name: personName, age: personAge } = person)
```

### 嵌套解构

解构对于引用嵌套的属性或赋值目标没有限制。为此，可以通过解构来复制对象属性。

```jsx
const person = {
  name: 'Matt',
  age: 27,
  job: {
    title: 'Software Engineer',
  },
}

const personCopy = {}

;({ name: personCopy.name, age: personCopy.age, job: personCopy.job } = person)
```

解构赋值可以使用嵌套结构，以匹配嵌套的属性：

```jsx
const person = {
  name: 'Matt',
  age: 27,
  job: {
    title: 'Software engineer',
  },
}

// 声明title变量并将person.job.title的值赋给它
const {
  job: { title },
} = person
```

在外层属性没有定义的情况下不能使用嵌套解构。无论源对象还是目标对象都一样。

### 部分解构

需要注意的是，涉及多个属性的解构赋值是一个输出无关的顺序化操作。如果一个解构表达式涉及多个赋值，开始的赋值成功而后面的赋值出错，则整个解构赋值只会完成一部分。

```jsx
const person = {
  name: 'Matt',
  age: 27,
}

let personName, personBar, personAge

try {
  ;({
    name: personName,
    foo: { bar: personBar },
    age: personAge,
  } = person)
} catch (ignore) {}

console.log(personName, personBar, personAge)
// Matt, undefined, undefined
```

### 参数上下文匹配

在函数参数列表中也可以进行解构赋值。对参数的解构赋值不会影响`arguments`对象，但可以在函数签名中声明在函数体内使用局部变量：

```jsx
const person = {
  name: 'Matt',
  age: 27,
}

function printPerson(foo, { name, age }, bar) {
  console.log(arguments)
  console.log(name, age)
}

function printPerson2(foo, { name: personName, age: personAge }, bar) {
  console.log(arguments)
  console.log(personName, personAge)
}

printPerson('1st', person, '2nd')
// ['1st', { name: 'Matt', age: 27 }, '2nd']
// 'Matt', 27

printPerson2('1st', person, '2nd')
// ['1st', { name: 'Matt', age: 27 }, '2nd']
// 'Matt', 27
```

# 创建对象

虽然使用`Object`构造函数或者对象字面量可以方便地创建对象，但这些方式也有明显不足：创建具有同样接口的多个对象需要重复编写很多代码。

## 概述

综观 ECMAScript 规范的历次发布，每个版本的特性似乎都出人意料。ECMAScript5.1 并没有正式支持面向对象的结构，例如类或继承。但是，巧妙运用原型式继承可以成功模拟同样的行为。

ECMAScript 6 开始正式支持类和继承。ES6 的类旨在完全涵盖之前规范设计的基于原型的继承模式。不过，无论从哪方面来看，ES6 的类都仅仅是封装了 ES5.1 的构造函数加原型继承的语法糖而已。

> 虽然是语法糖，但是采用面向对象编程模式的 JavaScript 代码还是应该优先使用 ES6 提供的类。但不管怎么说，理解 ES6 类出现之前的惯例是有益无害的，特别是 ES6 的类定义本身就相当于对原有结构的封装。

## 工厂模式

工厂模式是一种众所周知的设计模式，广泛应用于软件工程领域，用于抽象创建特定对象的过程。下面的例子展示了一种按照特定接口创建对象的方式：

```jsx
function createPerson(name, age, job) {
  const o = new Object()
  o.name = name
  o.job = job
  o.sayName = function () {
    console.log(this.name)
  }

  return 0
}

let person1 = createPerson('Nicholas', 29, 'Software Engineer')
let person2 = createPerson('Greg', 27, 'Doctor')
```

这种工厂模式虽然可以解决创建多个类似对象的问题，但是没有解决**对象标识问题**（即新创建的对象是什么类型）。

## 构造函数模式

前面几章提到过，ECMAScript 中的构造函数是用于创建特定类型对象的。像`Object`和`Array`这样的原生构造函数，运行时可以直接在执行环境中使用。当然也可以自定义构造函数，以函数的形式为自己的对象类型定义属性和方法。

例如，前面的例子使用构造函数模式可以这样写：

```jsx
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = function () {
    console.log(this.name)
  }
}
let person1 = new Person('Nicholas', 29, 'Software Engineer')
let person2 = new Person('Greg', 27, 'Doctor')
person1.sayName()
// Nicholas 10
person2.sayName()
// Greg
```

在这个例子中，`Person()`构造函数代替了`createPerson()`工厂函数。实际上，`Person()`内部的代码跟`createPerson()`基本是一样的，只是有如下区别：

- 没有显式地创建对象
- 属性和方法直接赋值给了`this`
- 没有`return`

另外，要注意函数名`Person`的首字母大写了。按照惯例，构造函数名称的首字母都需要大写，非构造函数则以小写字母开头。这是从面向对象编程语言那里借鉴来的，有助于在 ECMAScript 中区分构造函数和普通函数。毕竟 ECMAScript 的构造函数就是能创建对象的函数。

要创建`Person`的实例，应使用`new`操作符。以这种方式调用构造函数会执行如下操作：

1. 在内存中创建一个新对象。
2. 这个新对象内部的`[[Prototype]]`特性被赋值为构造函数的`prototype`属性。
3. 构造函数内部的`this`被赋值为这个新对象（即`this`指向新对象）。
4. 继续执行构造函数内部的代码（给新对象添加属性）。
5. 如果构造函数返回非空对象，则返回该对象；否则，返回刚创建的新对象。

上一个例子最后，`person1`和`person2`分别保存着`Person`的不同实例。这两个对象都有一个`constructor`属性指向`Person`。

`constructor`本来是用来标识对象类型的。不过一般认为`instanceof`操作符是确定对象类型更可靠的方式。前面的例子中的每个对象都是`Object`实例，同时也是`Person`的实例。

定义自定义构造函数可以确保实例被标识为特定类型，相比于工厂模式，这是一个很大的好处。在这个例子中，`person1`和`person2`之所以也被认为是`Object`的实例，是因为所有自定义对象都继承自`Object`。

构造函数不一定要写成函数声明的形式，赋值给变量的函数表达式也可以表示构造函数：

```jsx
const Person = function (name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = function () {
    console.log(this.name)
  }
}

let person1 = new Person('Nicholas', 29, 'Software Engineer')
let person2 = new Person('Greg', 27, 'Doctor')
person1.sayName() // Nicholas
person2.sayName() // Greg
console.log(person1 instanceof Object) // true
console.log(person1 instanceof Person) // true
console.log(person2 instanceof Object) // true
console.log(person2 instanceof Person) // true
```

在实例化时，如果不想传参数，那么构造函数后面的括号可加可不加。只要有`new`操作符，就可以调用相应的构造函数：

```jsx
function Person() {
  this.name = 'Jake'
  this.sayName = function () {
    console.log(this.name)
  }
}

const person1 = new Person()
// const person2 = new Person 也可以
```

### 构造函数也是函数

构造函数与普通函数唯一的区别就是调用方式不同。除此之外，构造函数也是函数。并没有把某个函数定义为构造函数的特殊语法。任何函数只要使用`new`操作符调用就是构造函数，而不使用`new`操作符调用的函数就是普通函数。例如，前面的例子中定义的`Person()`可以像下面这样调用：

```jsx
// 作为构造函数
const person = new Person('Nicholas', 29, 'Software Engineer')
person.sayName() // 'Nicholas'

// 作为函数调用
Person('Greg', 27, 'Doctor') // 添加到window对象
window.sayName()

// 在另一个对象的作用域中调用
let o = new Object()
Person.call(o, 'Kristen', 25, 'Nurse')
o.sayName() // "Kristen"
```

### 构造函数的问题

构造函数虽然有用，但也不是没有问题。构造函数的主要问题在于，其定义的方法会在每个实例上都创建一遍。因此对前面的例子而言，`person1`和`person2`都有名为`sayName()`的方法，但这两个方法不是同一个`Function`实例。我们知道 ECMAScript 中的函数是对象，因此每次定义函数时，都会初始化一个对象。逻辑上讲，这个构造函数实际上是这样的：

```jsx
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = new Function('console.log(this.name)') // 逻辑等价
}
```

可以清楚发现，每个`Person`实例都会有自己的`Function`实例用于显示`name`属性。当然了，以这种方式创建函数会带来不同的作用域链和标识符解析。但创建新`Function`实例的机制是一样的。因此不同实例上的函数虽然同名却不相等。

因为都是做一样的事，所以没必要定义两个不同的`Function`实例。况且，`this`对象可以把函数与对象的绑定推迟到运行时。

要解决这个问题，可以把函数定义转移到构造函数外部：

```jsx
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = sayName
}

function sayName() {
  console.log(this.name)
}

let person1 = new Person('Nicholas', 29, 'Software Engineer')
let person2 = new Person('Greg', 27, 'Doctor')

person1.sayName() // Nicholas
person2.sayName() // Greg
```

在这里，`sayName()`被定义在了构造函数外部。在构造函数内部，`sayName`属性等于全局`sayName()`函数，因为这一次`sayName`属性中包含的只是一个指向外部函数的指针，所以`person1`和`person2`共享了定义在全局作用域上的函数。虽然这样解决了相同逻辑的函数重复定义的问题，但是全局作用域也因此被搞乱了，因为那个函数实际上只能在一个对象上调用。如果这个对象需要多个方法，那么就要在全局作用域中定义多个函数。这会导致自定义类型引用的代码不能很好地聚集在一起。这个新问题可以通过原型模式来解决。

## 原型模式

每个函数都会创建一个`prototype`属性，这个属性是一个对象，包含应该由特定引用类型的实例共享的属性和方法。实际上，这个对象就是通过调用构造函数创建的对象的原型。使用原型对象的好处是，在它上面定义的属性和方法可以被对象实例共享。原来在构造函数中直接赋给对象实例的值，可以直接赋值给它们的原型。

### 理解原型

无论如何，只要创建一个函数，就会按照特定的规则为这个函数创建一个`prototype`属性（指向原型对象）。默认情况下，所有原型对象会自动获得一个名为`constructor`的属性，指回与之关联的构造函数。对前面的例子而言，`Person.prototype.constructor`指向`Person`。然后因构造函数而异，可能会给原型对象添加其他属性和方法。

在自定义构造函数时，原型对象默认只会获得`constructor`属性，其他的方法都继承自`Object`。每次调用构造函数创建一个新实例，这个实例的内部`[[Prototype]]`指针就会被赋值为构造函数的原型对象。脚本中没有访问这个`[[Prototype]]`特性的标准方式，但 Firefox、Safari 和 Chrome 会在每个对象上暴露`__proto__`属性，通过这个属性可以访问对象的原型。在其他实现中，这个特性完全被隐藏了。关键在于理解这一点：**实例与构造函数原型之间有直接的联系，但实例与构造函数之间没有**。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h3jg8ktkpij21760l8abq.jpg)

虽然不是所有实现都对外暴露了`[[Prototype]]`，但可以使用`isPrototypeOf()`方法确定两个对象之间的这种关系。本质上，`isPrototypeOf()`会在传入参数的`[[Prototype]]`指向调用它的对象时返回`true`，如下所示：

```jsx
console.log(Person.prototype.isPrototypeOf(person1)) // true
console.log(Person.prototype.isPrototypeOf(person2)) // true
```

另外，`Object`有一个静态方法`Object.getPrototypeOf()`，返回参数的内部特性`[[Prototype]]`的值。例如：

```jsx
console.log(Object.getPrototypeOf(person1) == Person.prototype) // true
console.log(Object.getPrototypeOf(person1).name) // "Nicholas"
```

> 使用`Object.getPrototypeOf()`可以方便地取得一个对象的原型，而这在通过原型实现继承时显得尤为重要。

`Object`类型还有一个`setPrototypeOf()`方法，可以向实例的私有特性`[[Prototype]]`写入一个新值。这样就可以重写一个对象的原型继承关系：

```jsx
const biped = {
  numLegs: 2,
}
const person = {
  name: 'Matt',
}

Object.setPrototypeOf(person, biped)

console.log(person.name) // Matt
console.log(person.numLegs) // 2
console.log(Object.getPrototypeOf(person) === biped) // true
```

> 警告：`Object.setPrototypeOf()`可能会严重影响代码的性能。Mozilla 文档说得很清楚：“在所有浏览器和 JavaScript 引擎中，修改继承关系的影响都是微妙且深远的。这种影响并不仅是`Object.setPrototypeOf()`语句那么简单，而是会涉及所有访问了那些修改过`[[Prototype]]`的对象的代码。”

为了避免使用`Object.setPrototypeOf()`可能造成的性能下降，可以通过`Object.create()`来创建一个新对象，同时为其指定原型：

```jsx
const biped = {
  numLegs: 2,
}

const person = Object.create(biped)
person.name = 'Matt'

console.log(person.name) // Matt
console.log(person.numLegs) // 2
console.log(Object.getPrototypeOf(person) === biped) // true
```

### 原型层级

在通过对象访问属性时，会按照这个属性的名称开始搜索。搜索开始于对象实例本身。如果在这个实例上发现了给定的名称，则返回该名称对应的值。如果没有找到这个属性，则搜索回沿着指针进入原型对象上，然后在原型对象上找到属性以后，再返回对应的值。这就是原型用于在多个对象实例之间共享属性和方法的原理。

> 前面提到的`contructor`属性只存在于原型对象，因此通过实例对象也是可以访问到的。

虽然可以通过实例读取原型对象上的值，但不可能通过实例重写这些值。如果在实例上添加了一个与原型对象重名的属性，那就会在实例上创建这个属性，这个属性会遮住原型对象上的属性。

只要给对象实例添加一个属性，这个属性就会**遮蔽**（shadow）原型对象上的同名属性，也就是虽然不会修改它们，但会屏蔽对它的访问。即使在实例上把这个属性设置为`null`，也不会恢复它和原型的联系。不过，使用`delete`操作符可以完全删除实例上的这个属性，从而让标识符解析过程能够继续搜索原型对象。

```jsx
function Person() {}
console.log(this.name)
Person.prototype.name = 'Nicholas'
Person.prototype.age = 29
Person.prototype.job = 'Software Engineer'
Person.prototype.sayName = function () {}
let person1 = new Person()
let person2 = new Person()
person1.name = 'Greg'
console.log(person1.name) // "Greg"，来自实例
console.log(person2.name) // "Nicholas"，来自原型
delete person1.name
console.log(person1.name) // "Nicholas"，来自原型
```

`hasOwnProperty()`方法用于确定某个属性是在实例上还是在原型对象上。这个方法时继承自`Object`的，会在属性存在于调用它的对象实例上时返回`true`。

> `Object.getOwnPropertyDescriptor()`方法只对实例属性有效。要取得原型属性的描述符，就必须直接在原型对象上调用`Object.getOwnPropertyDescriptor()`。

### 原型和`in`操作符

有两种方式使用`in`操作符：单独使用和在`for-in`循环中使用。在单独使用时，`in`操作符会在可以通过对象访问指定属性时返回`true`，无论该属性是在实例上还是在原型上。

如果要确定某个属性是否存在于原型上，可以像下面这样同时使用`hasOwnProperty()`和`in`操作符：

```jsx
function hasPrototypeProperty(object, name) {
  return !object.hasOwnProperty(name) && name in object
}
```

只要通过对象可以访问，`in`操作符就会返回`true`，而`hasOwnProperty()`只有属性存在于实例上时才会返回`true`。因此只要`in`操作符返回`true`且`hasOwnProperty()`返回`false`，就说明该属性是一个原型属性。

在`for-in`循环中使用`in`操作符时，可以通过对象访问且可以被枚举的属性都会返回，包括实例属性和原型属性。遮蔽原型中不可枚举（`[[Enumerable]]`特性被设置为`false`）属性的实例属性也会在`for-in`循环中返回，因为默认情况下开发者定义的属性都是可枚举的。

要获得对象上所有可枚举的实例属性，可以使用`Object.keys()`方法。这个方法接收一个对象作为参数，返回包含该对象的所有可枚举属性名称的字符串数组；如果想要列出所有实例属性，无论是否可以枚举，都可以使用`Object.getOwnPropertyNames()`。`Object.keys()`和`Object.getPropertyNames()`在适当的时候都可以用来代替`for-in`循环。

在 ECMAScript 6 新增符号类型之后，相应地出现了增加一个`Object.getOwnPropertyNames()`的兄弟方法的需求，因为以符号为键的属性没有名称的概念。因此，`Object.getOwnPropertySymbols()`方法就出现了，这个方法与`Object.getOwnPropertyNames()`类似，只是针对符号而已：

```jsx
const k1 = Symbol('k1')
const k2 = Symbol('k2')

const o = {
  [k1]: 'k1',
  [k2]: 'k2',
}

console.log(Object.getOwnPropertySymbols(o))
// [Symbol(k1), Symbol(k2)]
```

### 属性枚举顺序

`for-in`循环、`Object.keys()`、`Object.getOwnPropertyNames()`、`Object.getOwnPropertySymbols()`以及`Object.assign()`在属性枚举顺序方面有很大区别。`for-in`循环和`Object.keys()`的枚举顺序是不确定的，取决于 JavaScript 引擎，可能因浏览器而异。

`Object.getOwnPropertyNames()`、`Object.getOwnPropertySymbols()`和`Object.assign()`的枚举顺序是确定的。先以升序枚举数值键，然后以插入顺序枚举字符串和符号键。在对象字面量中定义的键以它们逗号分隔的顺序插入。

```jsx
const k1 = Symbol('k1')
const k2 = Symbol('k2')

const o = {
  1: 1,
  first: 'first',
  [k1]: 'sym2',
  second: 'second',
  0: 0,
}

o[k2] = 'sym2'
o[3] = 3
o.third = 'third'
o[2] = 2

console.log(Object.getOwnPropertyNames(o))
// [ '0', '1', '2', '3', 'first', 'second', 'third' ]

console.log(Object.getOwnPropertySymbols(o))
// [ Symbol(k1), Symbol(k2) ]
```

## 对象迭代

在 JavaScript 有史以来的大部分时间里，迭代对象属性都是一个难题。ECMAScript 2017 新增了两个静态方法，用于将对象内容转换为序列化的——更重要的是可迭代的格式。这两个静态方法`Object.values()`和`Object.entries()`接收一个对象，返回它们内容的数组。`Object.values()`返回对象值的数组，`Object.entries()`返回键/值对的数组。

下面的示例展示了这两个方法：

```jsx
const o = {
  foo: 'bar',
  baz: 1,
  qux: {},
}

console.log(Object.values(o))
// ["bar", 1, {}]

console.log(Object.entries(o))
// [["foo", "bar"], ["baz", 1], ["qux", {}]]
```

注意，非字符串属性会被转换为字符串输出。另外这两个方法执行对象的浅复制。并且，符号属性会被忽略。

```jsx
const sym = Symbol()
const o = {
  [sym]: 'foo',
}

console.log(Object.values(o))
console.log(Object.entries(o))
```

### 其他原型语法

注意到，前面的例子中每次定义一个属性或者方法都会把`Person.prototype`重写一遍。为了减少代码冗余，也为了从视觉上更好地封装原型功能，直接通过一个包含所有属性和方法的对象字面量来重写原型成为了一种常见的做法。

```jsx
function Person() {}

Person.prototype = {
  name: 'Nicholas',
  age: 29,
  job: 'Software Engineer',
  sayName() {
    console.log(this.name)
  },
}
```

在这个例子中，`Person.prototype`被设置为等于一个通过对象字面量创建的新对象。最终结果是一样的，只有一个问题：这样重写之后，`Person.constructor`属性就不指向`Person`了。在创建函数的时候，也会自动创建它的`prototype`对象，同时会自动给这个原型的`constructor`属性赋值。而上面的写法完全重写了默认的`prototype`对象，因此其`constructor`属性也指向了完全不同的新对象（`Object`构造函数），不再指向原来的构造函数。虽然`instanceof`操作符还能可靠地返回值，但我们不再能依靠`constructor`属性来识别类型了，例如下面例子所示：

```jsx
const friend = new Person()

console.log(friend instanceof Object) // true
console.log(friend instanceof Person) // true
console.log(friend.constructor === Person) // false
console.log(friend.consturctor === Object) // true
```

所以，如果`constructor`的值很重要，就可以在重写原型对象时专门设置一下它的值：

```jsx
function Person() {}

Person.prototype = {
  constructor: Person,
  name: 'Nicholas',
  age: 29,
  job: 'Software Engineer',
  sayName() {
    console.log(this.name)
  },
}
```

但是要注意，这种方式回复`constructor`属性会创建一个`[[Enumerable]]`为`true`的属性。而原生`constructor`属性默认是不可枚举的。因此如果你使用的是兼容 ECMAScript 的 JavaScript 引擎，那可以改用`Object.defineProperty()`方法来定义`constructor`属性：

```jsx
function Person() {}

Person.prototype = {
  name: 'Nicholas',
  age: 29,
  job: 'Software Engineer',
  sayName() {
    console.log(this.name)
  },
}

Object.defineProperty(Person.prototype, 'constructor', {
  enumerable: false,
  value: Person,
})
```

### 原型的动态性

因为从原型上搜索值的过程是动态的，所以即使实例在修改原型之前已经存在，任何时候对原型对象所做的修改也会在实例上反映出来。下面是一个例子：

```jsx
const friend = new Person()

Person.prototype.sayHi = function () {
  console.log('hi')
}

friend.sayHi()
```

虽然随时能给原型添加属性和方法，并能够立即反映在所有对象实例上，但这跟重写整个原型是两回事。实例的`[[Prototype]]`指针是在调用构造函数时自动赋值的，这个指针即使把原型修改为不同的对象也不会变。重写整个原型会切断最初原型与构造函数的联系，但实例引用的仍然是最初的原型。记住，实例只有指向原型的指针，没有指向构造函数的指针。

```jsx
function Person() {}

const me = new Person()

Person.prototype = {
  name: 'Nicholas',
  age: 29,
  job: 'Software Engineer',
  sayName() {
    console.log(this.name)
  },
}

const friend = new Person()

console.log(Object.getPrototypeOf(me) === Person.prototype) // false
console.log(Object.getPrototypeOf(friend) === Person.prototype) // true
console.log(me instanceof Person) // false
console.log(friend instanceof Person) // true

me.sayName() // TypeError
friend.sayName() // Nicholas
```

在这个例子中, `Person`的第一个实例`me`是在原型对象重写之前创建的。因为`me`指向的原型还是最初的原型，因此无法通过`instanceof`运算符来判定`me`是`Person`的实例，并且无法通过原型找到`sayName()`方法。

重写构造函数上的原型之后再创建的实例才会引用新的原型。而在此之前创建的实例仍然会引用最初的原型。

### 原生对象原型

原型模式之所以重要，不仅体现在自定义类型上，而且还因为它也是实现所有原生引用类型的模式。所有原生引用类型的构造函数（包括`Array`、`Object`、`String`等）都在原型上定义了实例方法。例如，数组实例的`sort()`方法就是`Array.prototype`上定义的，而字符串包装对象的`substring()`方法也是在`String.prototype`上定义的。

通过原生对象的原型可以取得所有默认方法的引用，也可以给原生类型的实例定义新的方法。可以像修改自定义对象原型一样修改原生对象原型，因此随时可以添加方法。例如，下面的代码就给`String`原始值包装类型的实例添加了一个`startsWith()`方法：

```jsx
String.prototype.startsWith = function (text) {
  return this.indexOf(text) === 0
}

const msg = 'Hello World'
console.log(msg.startsWith('Hello')) // true
```

> 尽管可以这么做，但是不推荐在产品环境中修改原生对象原型。这样做很可能造成误会，而且可能引发命名冲突（例如一个名称在某个浏览器实现中不存在，在另一实现中却存在）。另外还有可能意外重写原生的方法。**推荐的做法是创建一个自定义的类**，**继承原生类型**。

### 原型的问题

原型模式也并非没有问题。首先，它弱化了向构造函数传递初始化参数的能力，会导致所有实例默认都取得相同的属性值。虽然这会带来不便，但还不是原型的最大问题。原型最主要问题源于它的共享特性。

我们知道，原型上的所有属性是在实例间共享的，这对函数来说比较合适。另外包含原始值的属性也还好，可以通过在实例上添加同名属性简单遮蔽原型上的属性。真正的问题来自包含引用值的属性。

```jsx
function Person() {}

Person.prototype = {
  constructor: Person,
  name: 'Nicholas',
  age: 29,
  job: 'Software engineer',
  friends: ['Shelly', 'Court'],
  sayName() {
    console.log(this.name)
  },
}

const person1 = new Person()
const person2 = new Person()

person1.friends.push('Van')

console.log(person1.friends) // "Shelby,Court,Van"
console.log(person2.friends) // "Shelby,Court,Van"
console.log(person1.friends === person2.friends) // true
```

如果上面的代码是有意在多个实例间共享数组，那么没什么问题。但是一般来说，不同的实例应该有属于自己的属性副本。这就是实际开发中通常不单独使用原型模式的原因。

# 继承

继承是面相对象编程中讨论最多的话题。很多面相对象语言都支持两种继承：接口继承和实现继承。前者只继承方法签名，后者继承实际的方法。接口继承在 ECMAScript 中是不可能的，因为函数没有签名。实现继承是 ECMAScript 中唯一支持的继承方式，而这主要是通过原型链实现的。

## 原型链

ECMA-262 将**原型链**定义为 ECMAScript 的主要继承方式。其基本思想就是通过原型继承多个引用类型的属性和方法。重温一下构造函数、原型和实例的关系：每个构造函数都有一个原型对象，原型有一个属性指向构造函数，而实例有一个内部指针指向原型。如果原型是另一个类型的实例呢？那就意味着这个原型本身有一个内部指针指向另一个原型，相应地另一个原型也有一个指针指向另一个构造函数。这样就在实例和原型之间构造了一条原型链。这就是原型链的基本思想。

实现原型链涉及如下代码模式：

```jsx
function SuperType() {
  this.property = true
}

SuperType.prototype.getSuperValue = function () {
  return this.property
}

function SubType() {
  this.subproperty = false
}

// 继承SuperType

SubType.prototype = new SuperType()

SubType.prototype.getSubValue = function () {
  return this.subproperty
}

const instance = new SubType()
console.log(instance.getSuperType()) // true
```

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h3ly3qfe45j20m90brwf7.jpg)

这个例子中实现继承的关键，是`SubType`没有使用默认原型，而是将其替换成了一个新的对象。这个新的对象恰好是`SuperType`的实例。这样一来，`SubType`的实例不仅能从`SuperType`的实例中继承属性和方法，而且还与`SuperType`的原型挂上钩。于是`instance`通过内部的`[[Prototype]]`指向`SubType.prototype`，而`SubType.prototype`作为`SuperType`的实例又通过内部的`[[Prototype]]`指向`SuperType.prototype`。注意，`getSuperValue()`方法还在`SuperType.prototype`对象上，而`property`属性则在`SubType.prototype`上。这是因为`getSuperValue()`是一个原型方法，而`property`是一个实例属性。`SubType.prototype`现在是`SuperType`的一个实例，因此`property`才会存储在它上面。

还要注意，由于`SubType.prototype`的`constructor`属性被重写为指向`SuperType`，所以`instance.constructor`也指向`SuperType`。

原型链扩展了前面描述的原型搜索机制。我们知道，在读取实例上的属性时，首先会在实例上搜索这属性，如果没有，就会搜索实例的原型。在通过原型链实现继承之后，搜索就可以继续向上，搜索原型的原型。对前面的例子而言，调用`instane.getSuperValue()`就经过了 3 步搜索：`instance`、`SubType.prototype`和`SuperType.prototype`，最后一步才找到这个方法。对属性和方法的搜索会一直持续到原型链的末端。

### 默认原型

实际上原型链中还有一环。默认情况下，所有引用类型都继承自`Object`，这也是通过原型链实现的。任何函数的默认原型都是一个`Object`的实例，这意味着这个实例有一个内部指针指向`Object.prototype`。这也是为什么自定义类型能够继承包括`toString()`、`valueOf()`在内的所有默认方法的原因。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h3lyx4s7rdj20la0kmjsx.jpg)

### 原型与继承的关系

原型与实例的关系可以通过两种方式确定。第一种方式是使用`instanceof`操作符，如果一个实例的原型链中出现过相应的构造函数，则`instanceof`返回`true`。

确定这种关系的第二种方式是使用`isPrototypeOf()`方法，原型链中的每一个原型都可以调用这个方法。

### 关于方法

子类有时候需要覆盖父类的方法，或者增加父类没有的方法。为此，这些方法必须在原型赋值之后再添加到原型上。看下面例子：

```jsx
function SuperType() {
  this.property = true
}

SuperType.prototype.getSuperValue = function () {
  return this.property
}

function SubType() {
  this.subproperty = false
}

// 继承SuperType
SubType.prototype = new SuperType()

// 新方法
SubType.prototype.getSubValue = function () {
  return this.subproperty
}

// 覆盖已有方法
SubType.prototype.getSuperValue = function () {
  return false
}

const instance = new SubType()
console.log(instance.getSuperValue()) // false
```

注意，以对象字面量方式创建原型方法会破坏之前的原型链，因为这相当于重写了原型链。

### 原型链的问题

原型链虽然是实现继承的强大工具，但它也有问题。主要问题出现在原型中包含引用值的时候。原型中包含的引用值会在所有实例间共享，这也是为什么属性通常会在构造函数中定义而不会定义在原型上的原因。在使用原型实现继承时，原型实际上变成了另一个类型的实例。这意味着原先的实例属性摇身一变成为了原型属性。

原型链的第二个问题是，**子类型在实例化时不能给父类型的构造函数传参**。事实上，我们无法在不影响所有对象实例的情况下把参数传进父类的构造函数。再加上之前提到的原型中包含引用值的问题，就导致原型链基本不会被单独使用。

## 盗用构造函数

为了解决原型包含引用值导致的继承问题，一种叫做“盗用构造函数”（constructor stealing）的技术在开发社区流行起来（这种技术有时也称为“对象伪装”或“经典继承”）。基本思路很简单：在子类构造函数中调用父类构造函数。因为毕竟函数就是在特定上下文中执行代码的简单对象，所以可以使用`apply()`和`call()`方法以创建新的对象为上下文执行构造函数。

```jsx
function SuperType() {
  this.colors = ['red', 'blue', 'green']
}

function SubType() {
  // 继承SuperType
  SuperType.call(this)
}

const instance1 = new SubType()
instance1.colors.push('black')
console.log(instance1.colors) // 'red, blue, green, black'

const instance2 = new SubType()
console.log(instance2.colors) // 'red, blue, green'
```

通过使用`call()`或者`apply()`方法，`SuperTyp`构造函数在为`SubType`的实例创建的新对象的上下文中执行了。这相当于新的`SubType`对象上运行了`SuperType()`函数中的所有初始化代码。结果就是每个实例都会有自己的`colors`属性。

### 传递参数

相比于使用原型链，盗用构造函数的一个优点就是可以在子类构造函数中向父类构造函数传参。

```jsx
function SuperType(name) {
  this.name = name
}

function SubType() {
  // 继承SuperType并传参
  SuperType.call(this, 'Nicholas')

  // 实例属性
  this.age = 29
}

const instance = new SubType()
console.log(instance.name) // 'Nicholas'
console.log(instance.age) // 29
```

在这个例子中，`SuperType`构造函数接收一个参数`name`，然后将它赋值给一个属性。在`SubType`构造函数中调用`SuperType`构造函数时，传入这个参数，实际上会在`SubType`的实例上定义`name`属性。为了确保`SuperType`构造函数不会覆盖`SubType`定义的属性，可以在调用父类构造函数之后再给子类实例添加额外的属性。

### 盗用构造函数的问题

盗用构造函数的主要缺点，也是使用构造函数模式自定义类型的问题：必须在构造函数中定义方法，因此函数不能重用。另外，子类也不能访问父类原型上的方法，因此所有类型智能使用构造函数模式。由于存在这些问题，盗用构造函数基本上也不能单独使用。

## 组合继承

**组合继承**（有时候也叫伪经典继承）综合了原型链和盗用构造函数，将两者的优点集中了起来。基本的思路是使用原型链继承原型上的属性和方法，而通过盗用构造函数来继承实例属性。这样既可以把方法定义在原型上以实现重用，又可以让每个实例都有自己的属性。

```jsx
function SuperType(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}

SuperType.prototype.sayName = function () {
  console.log(this.name)
}

function SubType(name, age) {
  // 继承属性
  SuperType.call(this, name)
  this.age = age
}

// 继承方法
SubType.prototype = new SuperType()

SubType.prototype.sayAge = function () {
  console.log(this.age)
}

const instance1 = new SubType('Nicholas', 29)
instance1.colors.push('black')
console.log(instance1.colors) // "red,blue,green,black"
instance1.sayName() // "Nicholas";
instance1.sayAge() // 29

const instance2 = new SubType('Greg', 27)
console.log(instance2.colors) // "red,blue,green"
instance2.sayName() // "Greg";
instance2.sayAge() // 27
```

组合继承弥补了原型链和盗用构造函数的不足，是 JavaScript 中使用最多的继承模式。而且组合式继承也保留了`instanceof`操作符和`isPrototypeOf()`方法识别合成对象的能力。

# 类

前面讲述了如何只使用 ECMAScript 5 的特性来模拟类似于类（class-like）的行为。不难看出，各种策略都有自己的问题，也有相应的妥协。正因为如此，实现继承的代码也显得非常冗长和混乱。

为解决这些问题，ECMAScript 6 新引入的`class`关键字具有正式定义类的能力。类是 ECMAScript 中新的基础性语法糖结构，因此刚开始接触时可能会不太习惯。虽然 ECMAScript 6 类表面上看起来可以支持正式的面向对象编程，但实际上它背后使用的仍然是原型和构造函数的概念。

## 类定义

与函数类型相似，定义类页游两种主要方式：类声明和类表达式。这两种方式都用`class`关键字加大括号。

```jsx
class Person {}

const Animal = class {}
```

和函数表达式类似，类表达式在它们被求值前也不能引用。不过和函数定义不同的是，虽然函数声明可以提升，但是类定义不能。

```jsx
console.log(testFunc)

function testFunc() {}

console.log(TestType) // ReferenceError

class TestType {}
```

另一个跟函数声明不同的地方是，函数声明受函数作用域限制，而类声明受块作用域限制：

```jsx
{
  function FunctionDeclaration() {}

  class ClassDeclaration {}
}

console.log(FunctionDeclaration)
console.log(ClassDeclaration) // ReferenceError
```

### 类的构成

类可以包含构造函数、实例方法、获取函数、设置函数和静态类方法，但这些都不是必须的。空的类构造器同样有效。

> 默认情况下，类定义中的代码都在严格模式下执行。

和构造函数一样，多数编程风格都建议类名的首字母要大写，以区别于通过它创建的实例（例如，通过`class Foo {}`创建实例`foo`）：

类表达式的名称是可选的。在把类表达式赋值给变量后，可以通过`name`属性取得类表达式的名称字符串。但不能在类表达式作用域外部访问这个标识符。

```jsx
const Person = class PersonName {
  identify() {
    console.log(Person.name, PersonName.name)
  }
}

const p = new Person()

p.identify()

console.log(Person.name)
console.log(PersonName) // ReferenceError
```

## 类构造函数

`constructor`关键字用于在类定义块内部创建类的构造函数。方法名`constructor`会告诉解释器在使用`new`操作符创建类的新实例时应该调用这个函数。构造函数的定义不是必须的，不定义构造函数相当于将构造函数定义为空函数。

### 实例化

使用`new`操作符实例化`Person`的操作等于使用`new`调用其构造函数。唯一可感知的不同就是，JavaScript 解释器知道使用`new`和类意味着应该使用`constructor`函数进行实例化。
