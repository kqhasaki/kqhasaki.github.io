---
title: （八）字典和散列表
date: 2022-05-01
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h1sw6q5z09j20zk0k0dgk.jpg
---

第 7 章中，我们学习了 JavaScript 中的集合。本章会继续学习使用字典和散列表来存储唯一的值（不重复的值）的数据结构。

在集合中，我们感兴趣的是每个值本身，并把它当作主要元素。在字典（或映射）中，我们使用键/值对（key/value）的形式来存储数据。在散列表中也是一样（也是以键/值对形式来存储数据）。但是两种数据结构的实现方式略有不同，例如字典中的每个键只能有一个值。

本章内容包括：字典数据结构、散列表数据结构、处理散列表中的冲突、ES6 中的`Map`、`WeakMap`和`WeakSet`类。

<iframe width="560" height="315" src="https://www.youtube.com/embed/KyUTuwz_b7Q" title="哈希表" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

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

## 散列表和散列集合

在一些编程语言中，还有一种叫**散列集合**的实现。散列集合由一个集合构成，但是插入、移除或获取元素时，使用的是`hashCode()`函数。我们可以复用本章所有的代码来实现散列集合，不同之处在于，不再添加键值对，只是插入值而没有键。和集合相似，散列集合只存储不重复的唯一值。

## 处理散列表中的冲突

有时候一些键会有相同的散列值。不同的散列值在散列表中对应相同位置的时候，我们称为**冲突**。当这种情况发生时，就需要解决冲突。处理冲突有几种方法：**分离链接**、**线性探查**和**双散列法**。

### 分离链接

**分离链接**法包括为散列表的每一个位置创建一个链表并将元素存储在里面。它是解决冲突的最简单的方法，但是在`HashTable`实例之外还需要额外的存储空间。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1tw8ifomej21em0mo76e.jpg)

对于分离链接和线性探查来说，只需要重写三个方法；`put`、`get`和`remove`。这三个方法在每种技术实现中都是不同的。和之前一样，我们来声明`HashTableSeparateChaining`的基本结构。

```jsx
class HashTableSeparateChaining {
  constructor(toStrFn = defaultToString) {
    this.toStrFn = toStrFn
    this.table = {}
  }
}
```

我们来实现第一个方法，即`put`方法。

```jsx
put(key, value) {
  if (!isNullOrUndefined(key) && !isNullOrUndefined(value)) {
    const position = this.hashCode(key)
    if (isNullOrUndefined(this.table[position])) {
      this.table[position] = new LinkedList()
    }
    this.table[position].push(new ValuePair(key, value))
    return true
  }

  return false
}
```

在这个方法中，我们将验证要加入新元素的位置是否已经被占据。如果是第一次向该位置加入元素，我们会在该位置上初始化一个`LinkedList`类的实例。然后使用链表的`push`方法向`LinkedList`实例中添加一个`ValuePair`实例。

然后，我们实现`get`方法，用来获取给定键的值。

```jsx
get(key) {
  const position = this.hashCode(key)
  const linkedList = this.table[position]
  if (!isNullOrUndefined(linkedList) && !linkedList.isEmpty()) {
    let current = linkedList.getHead()
    while (!isNullOrUndefined(current)) {
      if (current.element.key === key) {
        return current.element.value
      }
      current = current.next
    }
  }

  return undefined
}
```

首先要验证的是在特定位置上是否有元素存在。我们在`position`位置检索`linkedList`，并检验是否存在`linkedList`实例。如果没有，则返回`undefined`，表示没有找到该值。如果位置上有值存在，则搜索这个链表，看是否有对应的值存储在链表中。

接下来实现`remove()`方法，从`HashTableSeparateChaining`实例中移除一个元素和之前实现`remove()`方法有一些不同。我们需要从链表中移除一个元素。

```jsx
remove(key) {
  const position = this.hashCode(key)
  const linkedList = this.table[position]
  if (!isNullOrUndefined(linkedList) && !linkedList.isEmpty()) {
    let current = linkedList.getHead()
    while (!isNullOrUndefined(current)) {
      if (current.element.key === key) {
        linkedList.remove(current.element)
        if (linkedList.isEmpty()) {
          // delete this.table[position]
          this.table[position] = undefined
        }
        return true
      }
      current = current.next
    }
  }
  return false
}
```

> 注意，开发中不鼓励使用`delete`运算符来删除对象的属性，原因是`delete`并不保证触发 gc，因此并不会优化性能；此外，对于 V8 引擎而言，通过`delete`运算符删除对象的属性，会变更其隐藏类，频繁对对象进行`delete`操作可能导致对象变成一个“慢对象”（属性查询通过字典结构，而非通过隐藏类和描述符数组。见[文章](/articles/front-end/fast-properties-in-v8)），使得对象属性的访问性能下降。所以如果不再使用某个对象属性，将其置为`undefined`是比较好的选择。

在`remove()`方法中，我们使用和`get()`方法一样的步骤找到要找的元素。迭代`linkedList`实例时，如果链表中的`current`元素就是要找的元素，使用`remove()`方法将其从链表中移除。然后进行额外验证，如果链表空了，则将散列表该位置设置为`undefined`。这样搜索一个元素的时候，就可以跳过这个位置了。

### 线性探查

另一种解决冲突的方法是**线性探查**。之所以称为线性，是因为它处理冲突的方法是将元素直接存储到表中，而不是在单独的数据结构中。

当像向表中某个位置添加一个新元素的时候，如果索引为`position`的位置已经被占据了，就尝试`position+1`的位置。如果它也被占据，则尝试`position+2`的位置，以此类推，直到在散列表中找到一个空闲的位置。想象一下，有一个已经包含一些元素的散列表，我们想要添加一个新的键和值。我们计算这个新键的`hash`，并检查散列表中对应的位置是否被占据。如果没有就将该值添加到正确的位置，如果被占据了，就迭代散列表，直到找到一个空闲的位置。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1txmmpn9vj21cs0ocju0.jpg)

当我们从散列表中移除一个键值对的时候，仅将之前数据结构所实现位置的元素移除是不够的。如果我们仅是移除了元素，就可能在查找有相同`hash`的其他元素时找到一个空的位置，这会导致算法出现问题。

线性探查技术分为两种。第一种是**软删除**方法。我们使用一个特殊的值（标记）来表示键值对被删除了（惰性删除或软删除），而不是真的删除它。经过一段时间，散列表被操作过后，我们会得到了一个标记了若干删除位置的散列表。这会逐渐降低散列表的效率，因为搜索键值会随着时间变慢。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1txte30xej214q0kudi1.jpg)

第二种方法需要检验是否有必要将一个或多个元素移动到之前的位置。当搜索一个键的时候，这种方法可以避免找到一个空位置。如果移动元素是必要的，就需要在散列表中挪动键值对。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1txvhbmlmj214e0towgg.jpg)

在线性探查的情况下，我们实现需要重写的三个方法。第一个是`put()`方法。

```jsx
put(key, value) {
  if (!isNullOrUndefined(key) && !isNullOrUndefined(value)) {
    const position = this.hashCode(key)
    if (isNullOrUndefined(this.table[position])) {
      this.table[position] = new ValuePair(key, value)
    } else {
      let index = position + 1
      while (!isNullOrUndefined(this.table[index])) {
        index++
      }
      this.table[index] = new ValuePair(key, value)
    }
    return true
  }
  return false
}
```

> 在一些编程语言中，我们需要定义数组的大小。如果使用线性探查的话，需要注意的一个问题是数组的可用位置可能会被用完。当算法到达数组的尾部时，它需要循环回到开头并继续迭代元素。如果必要的话，我们还需要创建一个更大的数组并将元素复制到新数组中。在 JavaScript 中，我们不需要担心这个问题。我们不需要定义数组的大小，因为它可以根据需要自动改变，这是 JavaScript 内置的一个功能。

接下来实现`get()`方法来获取它们的值。

```jsx
get(key) {
  const position = this.hashCode(key)
  if (!isNullOrUndefined(this.table[position])) {
    if (this.table[position].key === key) {
      return this.table[position].value
    }
    let index = position + 1
    while (!isNullOrUndefined(this.table[index]) && this.table[index].key !== key) {
      index++
    }
    if (!isNullOrUndefined(this.table[index]) && this.table[index].key === key) {
      return this.table[position].value
    }
  }
  return undefined
}
```

要获得一个键对应的值，先要确定这个键存在。如果这个键不存在，说明要查找的值不在散列表中，因此可以返回`undefined`。如果这个键存在，需要检查我们要找的值是否就是原始位置上的值。如果是就返回这个值。如果不是，就在`HashTableLinearProbing`的下一个位置继续查找，我们会按位置递增的顺序查找散列表上的元素直到找到我们想要的键。

下面实现`remove()`方法：

```jsx
remove(key) {
  const position = this.hashCode(key)
  if (!isNullOrUndefined(this.table[position])) {
    if (this.table[position].key === key) {
      this.table[position] = undefined
      this.verifyRemoveSideEffect(key, position)
      return true
    }
    let index = position + 1
    while (!isNullOrUndefined(this.table[index]) && this.table[index].key === key) {
      this.table[index] = undefined
      this.verifyRemoveSideEffect(key, index)
      return true
    }
  }
  return false
}
```

在`get`方法中，当我们找到了要找的`key`后，返回它的值。在`remove()`中，我们会从散列表中删除元素。

## 更好的散列函数

我们使用的 lose lose 散列函数并不是一个表现良好的散列函数，因为它会产生太多的冲突。一个表现良好的散列函数是由几个方面组成的：插入和检索元素的时间（即性能），以及较低冲突的可能性。

一个更好的，容易实现的散列函数是`djb2`。

```jsx
djb2HashCode(key) {
  const tableKey = this.toStrFn(key)
  let hash = 5381
  for (let i = 0; i < tableKey.length; i++) {
    hash = 33 * hash + tableKey.charCodeAt(i)
  }

  return hash % 1013
}
```

在将键转化为字符串后，`djbHashCode`方法包括初始化一个`hash`变量并赋值为一个质数，然后迭代参数`key`，将`hash`与 33 相乘，并和当前迭代到的码元的 Unicdoe 码值相加。

<iframe width="560" height="315" src="https://www.youtube.com/embed/b4b8ktEV4Bg" title="散列算法与安全" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# ES6 `Map`类

ES6 新增了`Map`类。和我们的`Dictionary`类不同，ES6 的`Map`类的`values()`方法和`keys()`方法都返回一个迭代器，而不是值或键构成的数组。另一个区别是，我们实现的`size()`方法返回字典中存储值的个数，ES6 的`Map`类有一个`size`属性。

删除`map`中的元素可以使用`delete()`方法。`clear()`方法会重置`map`数据结构，与我们在`Dictionary`类中实现的一样。

# ES6 `WeakMap`类和`WeakSet`类

除了`Set`和`Map`这两种新的数据结构，ES6 还增加了它们的弱化版本，`WeakSet`和`WeakMap`。基本上，`Map`和`Set`与其弱化版本的区别是：

- `WeakSet`或`WeakMap`类没有`entries()`、`keys()`或`values()`等方法；
- 只能用对象作为键。

创建和使用这两个类主要是为了性能。`WeakSet`和`WeakMap`是弱化的（用对象作为键），没有强引用的键。这是的 JavaScript 的垃圾回收器可以从中清除整个入口。

另一个优点是，必须用键才可以取出值。这些类没有迭代器方法，因此除非你知道键，否则没有办法取出值。使用`WeakMap`类可以封装 ES6 类的私有属性。

`WeakMap`类也可以使用`set()`方法，但是不能使用除了对象以外的类型。

# 小结

本章介绍了字典相关的知识，了解了如何添加、移除和获取元素以及其他一些方法。还了解了字典和集合的不同之处。

我们也学习了散列运算，怎样创建一个散列表数据结构，如何添加、移动和获取元素，以及如何创建散列函数。还了解了如何使用两种不同的方法解决散列表中的冲突问题，分离链接和线性探查。
