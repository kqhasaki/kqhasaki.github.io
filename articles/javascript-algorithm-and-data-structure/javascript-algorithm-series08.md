---
title: （八）字典和散列表
date: 2022-05-01
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h1sw6q5z09j20zk0k0dgk.jpg
---

第 7 章中，我们学习了 JavaScript 中的集合。本章会继续学习使用字典和散列表来存储唯一的值（不重复的值）的数据结构。

在集合中，我们感兴趣的是每个值本身，并把它当作主要元素。在字典（或映射）中，我们使用键/值对（key/value）的形式来存储数据。在散列表中也是一样（也是以键/值对形式来存储数据）。但是两种数据结构的实现方式略有不同，例如字典中的每个键只能有一个值。

本章内容包括：字典数据结构、散列表数据结构、处理散列表中的冲突、ES6 中的`Map`、`WeakMap`和`WeakSet`类。

# 字典

我们已经知道，集合表示一组互不相同的元素（不重复的元素）。在字典中，存储的是键/值对，其中键名是用来查询特定元素的。字典和集合很相似，集合以值/值的形式存储元素，字典则以键/值的形式来存储元素。字典也称作**映射**、**符号表**或**关联数组**。

## 创建字典类

与`Set`类相似，ES6 中同样包含了一个`Map`类的实现，即我们所说的字典。

本章要实现的类就是以 ES6 中的`Map`类的实现为基础的。我们会发现它和`Set`类很相似，但不同于存储值/值对的形式，我们要存储的是键/值对。

以下是我们的`Dictionary`类的骨架：

```jsx
import { defaultToString } from '../util'

export default class Dictionary {
  constructor(toStrFn = defaultToString) {
    this.toStrFn = toStrFn
    this.table = {}
  }
}
```

与`Set`类类似，我们将在一个`Object`的实例而不是数组中存储字典中的元素（`table`属性）。我们会将键/值对保存为`table[key] = { key, value }`。
