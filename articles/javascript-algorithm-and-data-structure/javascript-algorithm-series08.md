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

在字典中，理想的情况是用字符串作为键名，值可以是任何类型。但是由于 JavaScript 不是强类型语言，我们不能保证键一定是字符串。我们需要把所有作为键名传入的对象转化为字符，使得从`Dictionary`类中搜索和获取值更为简单。要实现此功能，我们需要一个将`key`转化为字符串的函数。

```jsx
// defaultToString函数声明
export function defaultToString(item) {
  if (item === null) {
    return 'NULL'
  } else if (item === undefined) {
    return 'UNDEFINED'
  } else if (typeof item === 'string' || item instanceof String) {
    return `${item}`
  }

  return item.toString()
}
```

> 注意，如果`item`变量是一个对象的话，它需要实现`toString`方法，否则会导致出现异常的输出结果，如`[object object]`。这对用户是不友好的。

如果键（`item`）是一个字符串，那么我们直接返回它，否则要调用`item`的`toString`方法。

然后，我们需要声明一些映射/字典所能使用的方法。

- `set(key, value)`：向字典中添加新元素。如果`key`已经存在，那么已存在的`value`会被新的值覆盖。
- `remove(key)`：如果使用键值作为参数来从字典中移除键值对应的数据值。
- `hasKey(key)`：如果某个键值存在于该字典中，返回`true`，否则返回`false`。
- `get(key)`：通过以键值作为参数查找特定的数值并返回。
- `clear()`：删除该字典中的所有值。
- `size()`：返回字典中所包含值的数量。与数组的`length`属性类似。
- `isEmpty()`：在`size`等于 0 时返回`true`，否则返回`false`。
- `keys()`：将字典所包含的所有键名以数组形式返回。
- `values()`：将字典所包含的所有值以数组形式返回。

- `keyValues()`：将字典中所有键/值对返回。
- `forEach(callbackFn)`：迭代字典中所有的键值对。`callbackFn`有两个参数：`key`和`value`。该方法可以在回调函数返回`false`时被中止（和`Array`类中的`every`方法相似）。

### 检测一个键是否存在于字典中

首先来实现`hasKey(key)`方法，之所以要实现这个方法，是因为它会被`set()`和`remove()`等其他方法调用。可以通过如下代码实现：

```jsx
hasKey(key) {
	const res = this.table[this.toStrFn(key)]
  return !isNullOrUndefined(res)
}
```

JavaScript 只允许我们使用字符串作为对象的键名或属性名。如果传入一个复杂对象作为键，需要将它转化为一个字符串。因此我们需要调用`toStrFn`函数。如果已经存在一个给定键名的键值对，那么返回`true`否则返回`false`。

### 在字典和`ValuePair`类中设置键和值

下面，我们来实现`set`方法，代码如下：

```jsx
set(key, value) {
  if (!isNullOrUndefined(key) && !isNullOrUndefined(value)) {
    const tableKey = this.toStrFn(key)
    this.table[tableKey] = new ValuePair(key, value)
    return true
  }
  return false
}
```

该方法接收`key`和`value`作为参数，如果`key`和`value`不是`undefined`或`null`，那么我们获取表示`key`的字符串，创建一个新的键值对并且将其赋值给`table`对象上的`key`属性。如果`key`和`value`是合法的，返回`true`，表示字典可以将键/值对保存下来，否则返回`false`。

该方法可以用来添加新的值，或是更新已有的值。

```jsx
// ValuePair类定义
class ValuePair {
  constructor(key, value) {
    this.key = key
    this.value = value
  }

  toString() {
    return `[#${this.key}: ${this.value}]`
  }
}
```

为了在字典中保存`value`，我们将`key`转化为了字符串，而为了保存信息的需要，我们同样需要保存原始的`key`。因此，我们不是只将`value`保存在字典中，而是要保存两个值：原始的`key`和`value`。为了字典能更简单地通过`toString()`方法输出结果，我们同样要为`ValuePair`类创建`toString()`方法。

### 从字典中移除一个值

接下来实现`remove()`方法。它和`Set`类中的`delete`方法很相似，唯一的不同在于我们将先搜索`key`，而不是`value`。

```jsx
remove(key) {
  if (this.hasKey(key)) {
    delete this.table[this.toStrFn(key)]
    return true
  }

  return false
}
```

然后，可以使用 JavaScript 的`delete`运算符来从`items`对象中移除`key`属性。如果能够将`value`从字典中移除的话，就返回`true`，否则将返回`false`。

### 从字典中检索一个值

如果我们想在字典中查找一个特定的`key`，并检索它的`value`，可以使用下面的方法。

```jsx
get(key) {
  const valuePair = this.table[this.toStrFn(key)]
  return isNullOrUndefined(valuePair) ? undefined : valuePair.value
}

// 或者
get(key) {
	if (this.hasKey(key)) {
    return this.table[this.toStrFn(key)]
  }

  return undefined
}
```

但是，在第二种方式中，我们会获取两次`key`的字符串以及访问两次`table`对象：第一次是在`hasKey`方法中，第二次是在`if`语句内。这是个小细节，不过第一种方式消耗更少。

### `keys`、`values`和`valuePairs`方法

我们已经给`Dictionary`类创建了最重要的方法，现在来创建一些很有用的辅助方法。

下面我们将创建`valuePairs`方法，它会以数组形式返回字典中的所有`valuePair`对象。代码如下：

```jsx
keyValues() {
  return Object.values(this.table)
}

// 或者
keyValues() {
  const valuePairs = []
  for (const k in this.table) {
    if (this.hasKey(k)) {
      valuePairs.push(this.table[k])
    }
  }
  return valuePairs
}
```

> 我们不能仅使用`for-in`语句来迭代`table`对象的所有属性，还需要使用`hasKey()`方法，因为对象的原型也会包含对象其他的属性，包括那些在当前数据结构中不需要的属性。

接下来是创建`keys`方法，该方法返回`Dictionary`类中用于识别值的所有（原始）键名。

```jsx
keys() {
  return this.keyValues().map(valuePair => valuePair.key)
}
```

我们将会调用所创建的`keyValues()`方法来返回一个包含`valuePair`实例的数组，然后迭代每个`valuePair`。由于我们只对`valuePair`的`key`属性感兴趣，就只返回它的`key`。

在上面的代码中，我们使用了`Array`类中的`map`方法来迭代每个`valuePair`。`map`方法可以将一个`value`转化为其他值。在本例中，我们将每个`valuePair`转化为了它的`key`。

和`keys`方法相似，我们还有一个`values`方法。`values`方法返回一个字典包含的所有值构成的数组。它的代码和`keys`方法很相似，只不过不同于返回`ValuePair`类的`key`属性，我们返回的`value`属性。

```jsx
values() {
  return this.keyValues().map(valuePair => valuePair.value)
}
```

### 用`forEach`迭代字典中的每个键值对

到目前为止，我们还没创建一个可以迭代数据结构中每个值的方法。下面给`Dictionary`类创建一个`forEach()`方法：

```jsx
forEach(callbackFn) {
  const valuePairs = this.keyValues()
  for (let i = 0; i < valuePairs.length; i++) {
    const result = callbackFn(valuePairs[i].key, valuePairs[i].value)
    if (result === false) {
      break
    }
  }
}
```

首先我们获取字典中所有`valuePair`构成的数组，然后迭代每个`valuePair`并执行以参数形式传入`forEach`方法的`callbackFn`函数，保存它的结果。如果回调函数函数返回了`false`，会中断`forEach()`方法的执行，打断正在迭代`valuePairs`的`for`循环。

### `clear`、`size`、`isEmpty`和`toString()`方法

`size()`方法返回字典中的值的个数。我们可以用`Object.keys()`方法来获取`table`对象中的所有键名。

```jsx
size() {
  return Object.keys(this.table).length
}
```

我们也可以调用`keyValues()`方法并返回它所返回的数组长度（`return this.keyValues().length`）。

要检验字典是否为空，可以获取它的`size`看看是否为 0。如果`size`为零，表示字典为空。`isEmpty()`方法的实现就使用了这种逻辑。

```jsx
isEmpty() {
  return this.size() === 0
}
```

要清空字典内容，我们只需将一个新对象赋值给`table`即可。

```jsx
clear() {
  this.table = {}
}
```

最后，可以像下面这样创建`toString()`方法：

```jsx
toString() {
  if (this.isEmpty()) {
    return ''
  }
  const valuePairs = this.keyValues()
	return valuePairs.reduce((str, val) => `${str}, ${val}`, '').slice(2)
}
```

在`toString()`方法中，如果字典为空，返回一个空字符串，否则根据`valuePair`构建字符串。

## 使用`Dictionary`类

```jsx
const dictionary = new Dictionary()

dictionary.set('Gandalf', 'gandalf@email.com')
dictionary.set('John', 'johnsnow@email.com')
dictionary.set('Tyrion', 'tyrion@email.com')

console.log(dictionary.size())
console.log(dictionary.keys())
console.log(dictionary.values())
console.log(dictionary.get('Tyrion'))

dictionary.remove('John')

console.log(dictionary.keys())
console.log(dictionary.values())
console.log(dictionary.keyValues())

dictionary.forEach((k, v) => {
  console.log('forEach: ', `key: ${k}, value: ${v}`)
})
```

# 散列表

本节，我们将构造一个`HashTable`类，也叫`HashMap`类，它是`Dictionary`类的一种散列表实现方式。

**散列**算法的作用是尽可能快地在数据结构中找到一个值。在之前的章节中，我们已经知道如果要在数据结构中获得一个值（使用`get`方法），需要迭代整个数据结构来找到它。如果使用散列函数，就知道值的具体位置，因此能够快速检索到该值。散列函数的作用是给定一个键值，然后返回在表中的地址。

散列表有一些在计算机科学中应用的例子。因为它是字典的一种实现，所以可以用作关联数组。它也可以用来对数据进行索引。当我们在关系型数据库中创建一个新的表时，一个不错的做法是同时创建一个索引来更快地查询到记录的`key`。在这种情况下，散列表可以用来保存键和对表中记录的引用。另一个很常见的应用是使用散列表来表示对象。JavaScript 语言内部就是使用散列表来表示每个对象。此时，对象的每个属性和方法被存储为`key`对象类型，每个`key`指向对应的对象成员。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1tatyjm6aj21dk0lmjtu.jpg)

## 创建散列表

我们将使用一个关联数组（对象）来表示我们的数据结构，和我们在`Dictionary`类中所做的一样。

```jsx
class HashTable {
  constructor(toStrFn = defaultToString) {
    this.toStrFn = toStrFn
    this.table = {}
  }
}
```

然后给类添加一些方法。我们需要给类实现三个基本方法：

- `put(key, value)`：向散列表增加一个新的项（也能更新散列表）。
- `remove(key)`：根据键值从散列表中移除值。
- `get(key)`：返回根据键值检索到特定的值。

### 创建散列函数

在实现这三个方法之前，我们首先要实现的第一个方法是散列函数。

```jsx
loseloseHashCode(key) {
  if (typeof key === 'number') {
    return key
  }
  const tableKey = this.toStrFn(key)
  let hash = 0
  for (let i = 0; i < tableKey.length; i++) {
    hash += tableKey.charCodeAt(i)
  }
  return hash % 37
}

hashCode(key) {
  return this.loseloseHashCode(key)
}
```

`hashCode`方法简单地调用了`loseloseHashCode()`方法，将`key`作为参数传入。

### 将键和值加入散列表

现在我们有了自己的`hashCode()`函数，下面来实现`put`方法。

```jsx
put(key, value) {
  if(!isNullOfUndefined(key) && !isNullOrUndefined(key)) {
    const position = this.hashCode(key)
    this.table[position] = new ValuePair(key, value)
    return true
  }
  return false
}
```

`put`方法和`Dictionary`类中的`set`方法逻辑相似。我们也可以将其命名为`set`，但大多数编程语言会在`HashTable`数据结构中使用`put`方法，因此我们遵循相同的命名方式。

首先，检验`key`和`value`是否合法。对于给出的`key`参数，需要用所创建的`hashCode()`函数在表中找到一个位置。然后，用`key`和`value`创建一个`ValuePair`实例。和`Dictionary`类相似，我们会为了信息备份将原始的`key`保存下来。

### 从散列表获取一个值

从`HashTable`实例中获取一个值也很简单。

```jsx
get(key) {
  const valuePair = this.table[this.hashCode(key)]
  return isNullOrUndefined(valuePair) ? undefined : valuePair.value
}
```

首先，我们会用所创建的`hashCode()`方法获取`key`参数的位置。该函数会返回对应的位置，我们要做的只是到`table`数组中对应的位置取到值并返回。

> `HashTable`和`Dictionary`类很相似。不同之处在于在`Dictionary`类中，我们将`valuePair`保存在`table`的`key`属性中（在它被转化为字符串之后），而在`HashTable`类中，我们由`key(hash)`生成一个数，并将`valuePair`保存在`hash`位置（或属性）。
>
> 注意：JavaScript 对象表现得很像是一个字典（字符串键和任意类型的值），但是 JavaScript 虚拟机实现有时采用了不同的策略，可以参考这篇[v8 文档](https://v8.dev/blog/fast-properties)。

### 从散列表移除一个值

最后一个要实现的方法就是`remove()`。

```jsx
remove(key) {
  const hash = this.hashCode(key)
  const valuePair = this.table[hash]
  if (!isNullOfUndefined(key)) {
    delete this.table[hash]
    return true
  }
  return false
}
```

> 除了使用`delete`运算符，也可以直接将`hash`位置赋值为`null`或`undefined`。
