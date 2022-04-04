---
title: 红宝书系列（三）JavaScript语言基础
date: 2022-01-09
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h0xw24rfidj20zk0k0jtg.jpg
---

JavaScript 的核心是 ECMAScript 标准所定义的一组语言基础，描述了它如何在最基本的层面上工作。ECMAScript 定义了所有涉及语法、操作符、数据类型和标准全局 API，在此基础上才可以构建复杂的解决方案。

# ECMAScript 语法

ECMAScript 的语法类似 Java 等类 C 语言，都使用了 C 语言的语法风格。不过 ECMAScript 不是静态类型语言，整体语法更加灵活、松散。

在 JavaScript 中，标志符的开头必须是字母或者`_`,`$`，其他特殊符号或者数字都不可以作为开头。按照 ECMAScript 的推荐惯例，标识符应该使用大小驼峰的形式。语言定义的关键字、保留字、`true`，`false`，`null`都不能作为标识符。JavaScript 的单行注释和多行注释都沿用了 C 语言风格。

> **严格模式**
> 在 ECMAScript5 中加入了严格模式的概念。在脚本开头一行加入`"use strict"`
> 将会对整个脚本启用严格模式。任何支持 JavaScript 的引擎看到这条预处理指令都会切换到严格模式。
> 在严格模式下，JavaScript 的执行有所不同，几乎所有现代浏览器都支持严格模式。

关于 JavaScript 代码要不加分号，本书中给出的建议是“即使语句末尾的分号不是必须的，也应该加上”。一方面，引擎会自动补全分号，有些情况下如果不加分号会导致不必要的错误；而另一方面，不添加分号在代码的整洁美观上提升不少，许多 JavaScript 项目的源码（例如 Vue）也是不使用分号的。在实际开发中，最好是坚持一种风格，并且使用代码格式化工具。

## 关键字和保留字

ECMAScript 标准描述了一组保留的关键字，关键字在函数定义、流程控制和执行某些特定操作都有特殊用途。下面列出我认为需要注意的关键字（平时不经常用到）：

- `debugger`: 当 `debugger` 被调用时, 执行暂停在 `debugger` 语句的位置。就像在脚本源代码中的断点一样。
- `delete`: `delete` 操作符用于删除对象的某个属性；如果没有指向这个属性的引用，那它最终会被释放。
- `void`: `void` 运算符 对给定的表达式进行求值，然后返回 undefined。
- `with`: 不建议使用 `with` 语句，因为它可能是混淆错误和兼容性问题的根源。
- `yield`: `yield` 关键字用来暂停和恢复一个生成器函数，迭代器和生成器是 ES6 的一个重要新特性。

另外，规范中还定义了一些保留字，它们同样不能用作标识符或者属性名，虽然保留字在语言中没有特定用途，但是它们是保留给将来作为关键字用的。使用保留的保留字是`enum`，严格模式下会有更多的保留字：`implements`, `package`, `public`, `interface`, `protected`, `static`, `private`。

> 不要使用保留字作为任何标识符和属性名。

## 变量

在 ES6 以前，JavaScript 没有块作用域，只有函数作用域。任何使用`var`关键字定义的变量都会首先被提升（所有变量声明都拉到函数作用域的顶部，初始化为`undefined`），下面的代码可以看出：

```javascript
console.log(foo) // undefined
var foo = 'json'

console.log(bar) // Uncaught ReferenceError
const bar = 'name'

for (var i = 0; i < 5; i++) {}
console.log(i) // 5

for (let i = 0; i < 5; i++) {}
console.log(i) // Uncaught ReferenceError
```

使用关键字`let`，`const`声明的变量具有块作用域，并且如果在变量声明语句之前使用变量会报错（实际上在解析代码的时候，JavaScript 引擎会注意到出现在块内的`let`声明，只不过在此之前不能使用未声明的变量，在声明前的执行区域称为“暂时性死区”）。在实际开发中，好的实践是完全不使用`var`来声明变量，优先使用`const`，如果一个变量保存的值会变化（基础类型变化或者指针变化）则使用`let`。

# 数据类型

ECMAScript 有 6 种原始数据类型：`undefined`, `null`, `number`, `boolean`, `string`, `symbol`。（注意其中`typeof null`返回的是`object`）。其中`symbol`（符号）是 ES6 新增的。在 ECMAScript 中不能定义自己的数据类型，唯一的引用类型就是`obejct`，它是一种无序的键值对的集合。

> 一般来说永远不要显示地给某个变量值设置`undefined`。这个值的目的就是正式明确空指针`null`和未初始化变量的区别。
