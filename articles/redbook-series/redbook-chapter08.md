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

JavaScript 开发者经常觉得“合并”（merge）两个对象很有用。
