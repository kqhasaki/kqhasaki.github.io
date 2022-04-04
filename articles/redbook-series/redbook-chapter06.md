---
title: 红宝书系列（六）集合引用类型
date: 2022-01-17
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h0xw3y4j70j20sg0e8wf0.jpg
---

# Object

在 ECMAScript 中，最多使用的引用类型是`Object`类型，其实例不具备多少有用的方法，但是很适合用来存储和交换数据，常用的 JSON 数据结构就是指 JavaScript 对象标记。一般来说很少使用`new`操作符和`Object`构造函数来直接实例化`Object`，而更多使用**对象字面量**表示法。
对象字面量是对象定义的简写形式，目的是为了简化包含大量属性的对象创建。

```javascript
// new操作实例化
const person = new Object()
person.name = 'Louis K'
person.age = 25

// 对象字面量
const person = {
  name: 'Peter',
  age: 20,
}
```

`{`出现在表达式上下文中表示对象字面的开始，表达式上下文是指期待返回值的上下文；它出现在语句上下文中时，表示一个语句块的开始。

在对象字面量表示法中，所有创建的对象都是无序的键值对。数值属性也会自动转换为字符串：

```javascript
const person = {
  name: 'Louis K',
  age: 25,
  5: ['1', '2'],
}

function createPerson({ name, age, gender, height, weight }) {
  // ...
}
```

对象字面量也是给函数传递大量可选参数的主要方式。

> 在使用对象字面表示法定义对象时，并不会实际调用`Object`构造函数。

# Array

`Array`是 ECMAScript 中最常用的数据类型之一。ECMAScript 的数组本质上也是一个对象，它并不限制元素的类型，可以存储任意类型的数据，并且它的大小也是动态的。

创建数组可以使用`Array`构造函数，是否使用`new`操作符返回的结果是相同的。

```javascript
const arr1 = new Array()
const arr2 = Array()
```

和对象一样，可以通过字面量表示法来创建数组，同样地，在使用数组字面量表示法创建数组时不会调用`Array`构造函数。`Array`构造函数还提供了两个 ES6 新增的静态方法来创建数组，`Array.from()`和`Array.of()`。前者用来将类数组结构（即任何可迭代对象）转换成数组实例，后者用来将一组参数转换为数组实例。

> `Array.from()`方法可以接受第二个映射函数参数，可以直接将可迭代对象映射为新数组。`Array.from([1, 2, 3], x => x ** 2)`

注意，数组字面量定义时最好避免数组空位的写法，类似：

```javascript
const arr = ['a', 'b', , , 'c']
// 最好显示使用undefined
const arr = ['a', 'b', undefined, undefined, 'c']
```

ECMAScript 数组同样可以通过索引来读取和写入值。使用中括号语法可以使用索引，如果把一个值设置给超过数组最大索引的索引，那么数组的长度就会自动扩展到该索引值加 1。此外，数组的`length`属性，用来返回数组的长度。但是它不是一个只读的属性，通过设置这个属性，ECMAScript 数组的大小会改变，从而从数组末尾添加或者删除元素。注意在实际开发中不建议使用这种方法来改变数组的长度，应该将`length`作为一个只读属性来使用。

> ECMAScript 数组的最大长度是 4294_967_295 个元素（`2 ** 32 - 1`)。

判断一个对象是否是数组的方法可以是`instanceof`操作符，但是它有一个问题，那就是依赖于一个全局执行上下文。如果网页存在多个全局执行上下文，因此会有两个不同版本的`Array`构造函数，因此有可能产生错误。为了解决这个问题，ECMAScript 推出一个可靠的判断数组的方法，那就是`Array.isArray()`方法，它可以确定一个对象是否是数组而不对全局执行上下文作出假设。

迭代一个 ECMAScript 数组可以使用 for-of 循环或者普通 for 循环。在 ES6 中，`Array`的原型暴露了 3 个用于检索数组内容的方法：`keys()`，`values()`，`entries()`。使用 ES6 的数组解构语法，可以非常容易地在循环中拆分键/值对：

```javascript
const arr = ['some', 'string', 'I', 'want', 'to', 'use']

for (const [idx, element] of arr.entries()) {
  alert(idx)
  alert(element)
}
```

值得一提的是，ES6 还为数组添加了`Array.prototype.copyWithin`方法和`Array.prototype.fill`方法。在指定了数组实例上的一个范围索引（包含开始，不包含结束），进行数组填充或者浅拷贝。

ECMAScript 给数组定义了几个方法来使得数组可以实现栈和队列。主要是`pop()`，`shift()`，`push()`和`unshift()`方法。

ECMAScript 数组提供了两个方法来对自身包含的元素进行重新排序：`reverse()`和`sort()`，故名思义，`reverse()`就是将数组按照当前排序的相反数序排列。而`sort()`方法接受一个比较函数，如果前一个值需要排在后面，那么比较函数返回正数。

数组的搜索和位置方法分为两种：严格相等和断言函数。前者包括使用`indexOf()`，`lastIndexOf()`，`includes()`；后者包括`find()`，`findIndex()`，接受一个断言函数来判读元素是否匹配条件。

ECMAScript 数组定义了 5 个常用的迭代方法。每个方法都接受一个以每一项为参数运行的函数。

- `every()`：对数组的每一项都运行传入的函数，如果对每一项都返回`true`，则方法返回`true`否则`false`。
- `filter()`：对数组的每一项都运行传入的函数，函数返回`true`的项组成的数组之后返回。
- `forEach()`：对数组每一项都运行传入的函数，没有返回值。
- `map()`：对数组的每一项都运行传入的函数，返回由每次调用的结果组成的数组。
- `some()`：对数组的每一项都运行传入的函数，如果有一项函数返回`true`，则这个方法返回`true`。

最后，ECMAScript 数组还定义了两个归并方法：`reduce()`和`reduceRight()`。这两个方法都会迭代数组的所有项，并在此基础上构建一个最终返回值。
`reduce()`方法从数组的第一项开始遍历到最后一项，而`reduceRight()`方法从最后一项开始遍历到第一项。

# 定型数组

定型数组（typed array）是 ES6 新增的数据结构，目的是提升向原生库传输数据的效率。实际上 ECMAScript 并没有 TypedArray 类型，定型数组是指一种包含特定数值类型的数组。

随着浏览器的流行，人们期待它可以用来运行复杂的 3D 应用程序。早在 2006 年，部分厂商就实验性地在浏览器中增加了用于渲染复杂图形应用程序的编程平台而无需安装任何插件。其目标是开发一套 JavaScript API，从而充分利用 3D 图形 API 和 GPU 加速，以便在`<canvas>`元素上渲染复杂的图形。

> **WebGL**: 最后的 JavaScript API 是基于 OpenGL ES（OpenGL for Embedded Systems）2.0 规范的。OpenGL ES 是 OpenGL 专注于 2D 和 3D 计算机图形的子集。这个新 API 被命名为 WebGL（Web Graphics Library），于 2011 年发布了 1.0 版本。有了它，Web 开发者可以编写涉及复杂图形的应用程序，它会被兼容 WebGL 的浏览器原生解释执行。
>
> 在 WebGL 早期版本中，因为 JavaScript 数组与原生数组之间不匹配，所以出现了性能问题。图形驱动程序 API 通常不需要以 JavaScript 默认双精度浮点格式传递给它们的数值，而这恰好是 JavaScript 数组在内存中的格式。因此每次 WebGL 和 JavaScript 运行时之间传递数组时，WebGL 绑定都需要在目标环境分配新数组，以其当前格式迭代数组，然后将数值转型为新数组中的适当格式，而这些要花费很多时间。

由于数组和原生数组的不匹配问题导致的时间浪费是难以接受的，Mozilla 为解决这个问题而实现了`CanvasFloatArray`。这是一个提供了 JavaScript 接口的、C 语言风格的浮点值数组。JavaScript 运行时使用这个类型可以分配、读取和写入数组。这个数组可以直接传给底层图形驱动程序 API，也可以直接从底层获取到。最终`CanvasFloatArray`变成了`Float32Array`，也就是今天定型数组中可用的第一个“类型”。

## ArrayBuffer

`Float32Array`实际上是一种“视图”，可以允许 JavaScript 运行时访问一块名为`ArrayBuffer`的预分配内存。`ArrayBuffer`是所有定型数组及视图引用的基本单位。

> `SharedArrayBuffer`是`ArrayBuffer`的一个变体，可以无需复制就在执行上下文间传递它。

`ArrayBuffer`是一个普通的 JavaScript 构造函数，可以用于在内存中分配特定数量的字节空间。

```javascript
const buf = new ArrayBuffer(16) // 在内存中分配16字节
alert(buf.byteLength)
```

`ArrayBuffer`一经创建就不能再调整大小。不过可以使用`slice()`方法将其全部或者部分复制到一个新的实例中：

```javascript
const buf1 = new ArrayBuffer(16)
const buf2 = buf1.slice(4, 12)
alert(buf2.byteLength)
```

不能仅通过 `ArrayBuffer`的引用就读取或写入其内容。要读取或写入`ArrayBuffer`，就必须通过视图。视图有不同的类型，但引用的都是`ArrayBuffer`中存储的二进制数据。

## DataView

第一种允许读写`ArrayBuffer`的视图是`DataView`。这个视图专门为文件 I/O 和网络 I/O 设计，其 API 支持对缓冲数据的高度控制，但相比于其他类型的视图性能也更差些。`DataView`对缓冲内容没有任何假设，并且也**不能迭代**。

必须在已有的`ArrayBuffer`读取或写入时才能创建`DataView`实例。这个实例可以使用全部或者部分的`ArrayBuffer`，且维护着对该缓冲实例的引用，以及视图在缓冲中开始的位置。

```javascript
const buf = new ArrayBuffer(16)

// DataView默认使用整个ArrayBuffer
const fullDataView = new DataView(buf)
alert(fullDataView.byteOffset) // 0
alert(fullDataView.byteLength) // 16
alert(fullDataView.buffer === buf) // true

// 构造函数接受一个可选的字节偏移量和字节长度
// byteOffset表示视图从缓冲区的某个起点开始
// byteLength表示视图限制为前多少个字节
const firstHalfDataView = new DataView(buf, 0, 8)
alert(firstHalfDataView.byteOffset) // 0
alert(firstHalfDataView.byteLength) // 8
alert(firstHalfDataView.buffer === buf) // true

// 如果不制定byteLength，那么DataView会使用剩余的缓冲
const secondHalfDataView = new DataView(buf, 8)
alert(secondHalfDataView.byteOffset) // 8
alert(secondHalfDataView.byteLength) // 8
alert(secondHalfDataView.buffer === buf) // true
```

要通过`DataView`读取缓冲，还需要几个组件：

- 首先是要读/写的字节偏移量，可以看作是`DataView`中的某种“地址”。
- `DataView`应该使用`ElementType`来实现 JavaScript 的 Number 类型到缓冲内二进制格式的转换。
- 最后是内存中的字节序。默认是大端字节序。

> `ElementType`对存储在缓冲区内的数据类型没有假设。它暴露的 API 强制开发者在读/写时指定一个`ElementType`，然后`DataView`会为读写完成相应的转换。ES6 支持 8 种不同的`ElementType`：Int8（8 位有符号整数，`signed char`）、Uint8（8 位无符号整数，`unsigned char`）、Int16（16 位有符号整数，`short`）、Uint16（16 位无符号整数，`unsigned shrot`）、Int32（32 位有符号整数，`int`）、Uint32（32 位无符号整数，`unsigned int`）、Float32（32 位 IEEE-754 浮点数，`float`）、Float64（64 位 IEEE-754 浮点数，`double`）。

`DataView`为每一种类型都暴露了`get`和`set`方法，这些方法使用`byteOffset`（字节偏移量）定位要读取或写入值的位置。类型是可以互换使用的。

## 定型数组

定型数组是另一种形式的`ArrayBuffer`视图。虽然概念上和`DataView`接近，但定型数组的区别在于，它特定于一种`ElementType`并且遵循原生的字节序。相应地，定型数组提供了适用面更广的 API 和更高的性能。设计定型数组的目的就是提高与 WebGL 等原生库交换二进制数据的效率。由于定型数组的二进制表示对操作系统而言是一种容易使用的格式，JavaScript 引擎可以重度优化算术运算和其他对定型数组的常见操作，因此使用它们速度极快。

创建定型数组的方式包括读取已有的缓冲、使用自有缓冲、填充可迭代结构，以及填充基于任意类型的定型数组。另外通过`<ElementType>.from()`和`<ElementType>.of()`也可以创建定型数组。

```javascript
const buf = new ArrayBuffer(12) // 12字节的缓冲区

const ints = new Int32Array(buf)
alert(ints.length) // 这个定型数组知道自己的每个元素需要4字节，因此长度为3

const ints2 = new Int32Array(6) // 创建一个长度为6的Int32Array定型数组
alert(ints2.buffer.byteLength) // 类似DataView，定型数组也有一个指向关联缓冲区的引用

const ints3 = new Int32Array([2, 4, 6, 8]) // 创建一个包含了2、4、6、8的Int32Array
alert(ints3.length) // 4
alert(ints3.buffer.byteLength) // 16
alert(ints3[2]) // 6

const ints4 = new Int16Array(ints3) // 通过复制ints3的值创建一个Int16Array，这个新数组会分配自己的缓冲区，对应索引的每个值会转换成对应的格式
alert(ints4.length) // 4
alert(ints4.buffer.byteLength) // 8
alert(ints4[2]) // 6

const ints5 = Int16Array.from([3, 5, 7, 9]) // 基于普通数组来创建一个Int16Array
alert(ints5.length) // 4
alert(ints5.buffer.byteLength) // 8
alert(ints5[2]) // 7

const floats = Float32Array.of(3.14, 2.718, 1.618) // 基于传入的参数创建一个Float32Array
alert(floats.length) // 3
alert(floats.buffer.byteLength) // 12
alert(floats[2]) // 1.61800000305175781
```

定型数组的构造函数和实例都有一个`BYTE_PER_ELEMENT`属性，返回该类型数组中的每个元素的大小。

# Map

ES6 之前，在 JavaScript 中实现键/值对式存储可以使用`Object`实例高效完成，也就是使用对象属性作为键，属性作为值。但是这种实现并非没有问题，为此 TC39 委员会专门为“键/值”对存储定义了一个规范。

作为 ES6 的新增特性，`Map`是一种功能新的集合类型，为这门语言带来了真正的键/值存储机制。`Map`的大多数特性都可以通过`Object`类型实现，但是二者之间存在些许差异，使用时需要仔细选择。

## 基本 API

使用`new`关键字和`Map`构造函数可以创建一个空映射：

```javascript
const m = new Map()
```

初始化时可以给`Map`构造函数传入一个可迭代对象，需要包含键/值对数组。可迭代对象中的每个键/值对都会按照顺序插入到新映射中：

```javascript
const m1 = new Map([
  ['key1', 'val1'],
  ['key2', 'val2'],
  ['key3', 'val3'],
])
```

初始化后可以通过`set()`方法添加键/值对。另外，可以使用`get()`和`has()`进行查询，可以通过`size`属性来获取映射中键/值对的数量，还可以使用`clear()`和`delete()`来删除值。

与`Object`只能用数值、字符串或者`Symbol`作为键不同，`Map`可以使用任何 ECMAScript 数据类型作为键。`Map`内部使用 SameValueZero 比较操作（ECMAScript 内部定义，语言中不能使用），基本上相当于使用严格对象相等的标准来检查键的匹配性。与`Object`类似，键的值没有限制。

## 顺序与迭代

和`Object`的一个主要差异是`Map`实例会维护键值对的插入顺序，因此可以根据插入顺序执行迭代操作。映射实例可以提供一个迭代器(Iterator)，能以插入顺序生成`[key, value]`形式的数组。可以通过`entries()`方法取得这个迭代器：

```javascript
const m = new Map([
  ['key1', 'val1'],
  ['key2', 'val2'],
  ['key3', 'val3'],
])

alert(m.entries === m[Symbol.Iterator]) // true

for (let pair of m.entries()) {
  const [key, value] = pair
  // ...
}

m.forEach((val, key) => alert(key, val)) // 注意在forEach传入函数中第一个参数获取的是值，第二个才是键
```

另外`keys()`和`values()`分别返回以插入顺序生成键和值的迭代器。

对于多数 Web 开发任务来说，选择哪一个只是个人喜好问题。不过多数时候`Map`的性能和内存占用表现更好，尤其是删除性能。

# WeakMap

ES6 新增的`WeakMap`（弱映射）是一种新集合类型，为这门语言带来了增强的键/值对存储机制。`WeakMap`是`Map`的兄弟类型，其 API 也是`Map`的子集。`WeakMap`的“弱”是指 JavaScript 垃圾回收程序对待“弱映射”中键的方式。

## 基本 API

可以使用`new`关键字实例化一个空的`WeakMap`：

```javascript
const wm = new WeakMap()
```

弱映射中的键只能是`Object`或者继承自`Object`的类型，尝试使用非对象设置键会抛出`TypeError`。值的类型没有限制。

## 弱键

`WeakMap`中“weak”表示弱映射的键是“弱弱地拿着”的。意思是，这些键不属于正式的引用，不会阻止垃圾回收。但是弱映射的值不是“弱弱地拿着”的，只要键存在，键/值对就会存在于映射中，并被当作对值的引用，因此就不会被当作垃圾回收。

来看下面的例子：

```javascript
const wm = new WeakMap()

wm.set({}, 'val')
```

`set()`方法初始化了一个新对象并将它用作一个字符串的键。因为没有指向这个对象的其他引用，所以当这行代码执行完成后，这个对象就会被当作垃圾回收。然后，这个键/值对就会从弱映射中消失了，使其成为一个空映射。此例中值也没有被引用，所以这对键/值被破坏后，值也成为垃圾回收的目标。

`WeakMap`中的键/值对随时都有可能被销毁，因此不需要提供迭代能力。`WeakMap` 实例之所以限制只能用对象作为键，是为了保证只有通过键对象的引用才能取得值。如果允许原始值，那就没办法区分初始化时使用的字符串字面量和初始化之后使用的一个相等的字符串了。

> **使用`WeakMap`** `WeakMap`的用法并不常见，两个最主要的使用场景是：1）弱映射造就了在 JavaScript 中实现真正私有变量的一种新方式；2）因为 WeakMap 实例不会妨碍垃圾回收，所以非常适合保存 DOM 节点关联元数据。

## 保存 DOM 关联元数据

```javascript
const m = new Map()
const loginButton = document.querySelector('#login')
// 给这个节点关联一些元数据
m.set(loginButton, { disabled: true })
```

假设在上面的代码执行后，页面被 JavaScript 改变了，原来的登录按钮从 DOM 树中被删掉了。但由于映射中还保存着按钮的引用，所以对应的 DOM 节点仍然会逗留在内存中，除非明确将其从映射中删除或者等到映射本身被销毁。

如果这里使用的是弱映射，如以下代码所示，那么当节点从 DOM 树中被删除后，垃圾回收程序就 可以立即释放其内存（前提是对象没有其他引用）：

```javascript
const wm = new WeakMap()
const loginButton = document.querySelector('#login')
// 给这个节点关联一些元数据
wm.set(loginButton, { disabled: true })
```
