---
title: 红宝书系列（二十）JavaScript API
date: 2022-03-10
cover: https://tva1.sinaimg.cn/large/008i3skNgy1gy6bw9bv2hj30jg0oo40x.jpg
---

随着 Web 浏览器能力的增加，其复杂性也在迅速增加。从很多方面来看，现代 Web 浏览器已经成为构建于诸多规范之上、集不同 API 于一身的“瑞士军刀”。浏览器规范的生态在某种程度上是混乱而无序的。一些规范如 HTML5，定义了一批增强已有标准的 API 和浏览器特性。而另一些规范如 Web Cryptography API 和 Notifications API，只为一个特性定义了一个 API。不同浏览器实现这些新 API 的情况也不同，有的会实现其中一部分，有的则干脆尚未实现。

最终，是否使用这些比较新的 API 还是要看项目是支持更多浏览器，还是要采用更多现代特性。有些 API 可以使用腻子脚本（polyfill）来模拟，但是腻子脚本通常会带来性能问题，此外也会增加网站 JavaScript 代码的体积。

Web API 的数量之多令人难以置信。本章要介绍的 API 仅限于与大多数开发者有关、已经得到多个浏览器支持的部分。

# Atomics 和`SharedArrayBuffer`

多个上下文访问`SharedArrayBuffer`时，如果同时对缓冲区执行操作，就可能出现资源争用问题。Atomics API 通过强制同一时刻只能对缓冲区执行一个操作，可以让多个上下文安全地读写一个`SharedArrayBuffer`。Atomics API 是 ES2017 中定义的。

仔细研究会发现 Atomics API 非常像一个简化版的指令集架构（ISA），这并非意外。原子操作的本质会排斥操作系统或计算机硬件通常会自动执行的优化（例如指令重新排序）。原子操作也让并发访问内存变得不可能，如果应用不当就可能导致程序执行变慢。因此，Atomics API 的设计初衷是在最少但很稳定的原子行为基础之上，构建复杂的多线程 JavaScript 程序。

## `SharedArrayBuffer`

`SharedArrayBuffer`和`ArrayBuffer`具有同样的 API。二者的主要区别是`ArrayBuffer`必须在不同的执行上下文之间切换，`SharedArrayBuffer`则可以被任意多个执行上下文同时使用。

在多个执行上下文间共享内存意味着并发线程操作成为了可能。传统 JavaScript 操作对于并发内存访问导致的资源争用没有提供保护。下面的例子演示了 4 个专用工作线程访问同一个`SharedArrayBuffer`导致的资源争用问题：

```javascript
const workerScript = `
	self.onmessage = ({data}) => {
		const view = new Unit32Array(data)
		// 执行1000，000次加操作
		for (let i = 0; i < 1e6; i++) {
			// 线程不加安全操作会导致资源争用
			view[0] += 1
		}
		self.postMessage(null)
	}
`

const workerScriptBlobUrl = URL.createObjectURL(new Blob([workerScript]))

// 创建容量为4的工作线程池
const workers = []
for (let i = 0; i < 4; i++) {
  workers.push(new Worker(workerScriptBlobUrl))
}
// 在最后一个工作线程完成后打印出最终值
let responseCount = 0
for (const worker of workers) {
  worker.onmessage = () => {
    if (++responseCount === workers.length) {
      console.log(`Final buffer value: ${view[0]}`)
    }
  }
}

// 初始化SharedArrayBuffer
const sharedArrayBuffer = new SharedArrayBuffer(4)
const view = new Unit32Array(sharedArrayBuffer)
view[0] = 1

// 把SharedArrayBuffer发送到每个工作线程
for (const worker of workers) {
  worker.postMessage(sharedArrayBuffer)
}

// 期待的结果为4000001，结果是不符合的
// Final buffer value: 2145106
```

为了解决这个问题，Atomics API 应运而生。Atomics API 可以保证`SharedArrayBuffer`上的 JavaScript 操作是线程安全的。

## 原子操作基础

任何全局上下文中都有`Atomics`对象，这个对象上暴露了用于执行线程安全操作的一套静态方法，其中多数方法以一个`TypedArray`实例（一个`SharedArrayBuffer`的引用）作为第一个参数，以相关操作数作为后续参数。

### 算术及位操作方法

Atomics API 提供了一套简单的方法用以执行就地修改操作。在 ECMA 规范中，这些方法被定义为`AtomicReadModifyWrite`操作。在底层，这些方法都会从`SharedArrayBuffer`中某个位置读取值，然后执行算术或位操作，最后再把计算结果写回相同的位置。这些操作的原子本质意味着上述读取、修改、写回操作会按照顺序执行，不会被其他线程中断。

下面代码演示了所有算术方法：

```javascript
// 创建大小为1的缓冲区
const sharedArrayBuffer = new SharedArrayBuffer(1)

// 基于缓冲创建Unit8Array
const typedArray = new Unit8Array(sharedArrayBuffer)

// 所有ArrayBuffer全都初始化为0
console.log(typedArray) // Unit8Array[0]

const index = 0
const increment = 5

// 对索引0处的值执行原子加5
Atomics.add(typedArray, index, increment)

console.log(typedArray) // Unit8Array[5]

// 对索引0处的值执行原子减5
Atomics.sub(typedArray, index, increment)

console.log(typedArray) // Unit8Array[0]
```

下面代码演示了所有位方法：

```javascript
const sharedArrayBuffer = new SharedArrayBuffer(1)

const typedArray = new Unit8Array(sharedArrayBuffer)

console.log(typedArray) // Unit8Array[0]

const index = 0

// 对索引0处的值执行原子或0b1111
Atomics.or(typedArray, index, 0b1111)

console.log(typedArray) // Unit8Array[15]

// 对索引0处的值执行原子与0b1111
Atomics.and(typedArray, index, 0b1111)

console.log(typedArray) // Unit8Array[12]

// 对索引0处的值执行原子异或0b1111
Atomics.xor(typedArray, index, 0b1111)

console.log(typedArray) // Unit8Array[3]
```

### 原子读/写

浏览器的 JavaScript 编译器和 CPU 架构本身都有权限重排指令以提升执行效率。正常情况下，JavaScript 的单线程环境是随时可以进行这种优化的。但多线程留下的指令重排可能导致资源争用，而且极难拍错。

Atomics 通过两种主要方式解决了这个问题。

- 所有原子指令相互之间的顺序永远不会重排
- 使用原子读或者原子写保证所有指令（包括原子和非原子指令）都不会相对原子读/写重新排序。这意味着位于原子读/写之前的所有指令会在原子读/写发生前完成，而位于原子读/写之后的所有指令会在原子读/写完成后才会开始。

除了读写缓冲区的值，`Atomics.load()`和`Atomics.store()`还可以构建“代码围栏”。JavaScript 引擎保证非原子指令可以相对于`load()`或`store()`本地重排。但这个重排不会侵犯原子读/写的边界。

### 原子交换

为了保证连续、不间断的先读后写，Atomics API 提供了两种方法： `exchange()`和`compareExchange()`。`Atomics.exchange()`执行简单的交换，以保证其他线程不会中断值的交换：

```javascript
const sharedArrayBuffer = new SharedArrayBuffer(4)
const view = new Unit32Array(sharedArrayBuffer)

Atomics.store(view, 0, 3)

console.log(Atomics.exchange(view, 0, 4)) // 3

console.log(Atomics.load(view, 0)) // 4
```

在多线程程序中，一个线程可能**只希望**在上次读取某个值之后没有其他线程修改该值的情况下才对共享缓冲区执行写操作。如果这个值没有被修改，这个线程就可以安全地写入更新后的值；如果这个值被修改了，那么执行写操作将会破坏其他线程计算的值。对于这种任务，Atomics API 提供了`compareExchange()`方法。这个方法只在目标索引处的值和预期值匹配时才会执行写操作。

### 原子 Futex 操作与枷锁

如果没有某种锁机制，多线程程序就无法支持复杂需求。为此，Atomics API 提供了模仿 Linux Futex（快速用户空间互斥量，fast user-space mutex）的方法。这些方法本身虽然非常简单，但是可以作为更复杂的锁机制的基本组件。

# 跨上下文消息

**跨文档消息**，有时候简称为 XDM（cross-document messaging)，是一种在不同执行上下文（如不同工作者线程或不同源的页面）间传递信息的能力。例如`www.wrox.com`上的页面想要与包含在内嵌窗格中`p2p.wrox.com`上面的页面通信。在 XDM 之前，要以安全方式实现这种通信需要做很多工作。XDM 以安全易用的方式规范化了这个功能。

> 跨上下文消息用于窗口之间或者工作线程之间通信。

XDM 的核心是`postMessage()`方法。除了 XDM，这个方法名还在 HTML5 中很多地方用到过，但目的都是一样，都是把数据传送到另一个位置。

`postMessage()`方法接收 3 个参数：消息、表示目标接收源的字符串和可选的可传输对象的数组（只与工作线程相关）。第二个参数对于安全非常重要，其可以限制浏览器交付数据的目标。下面看一个例子：

```javascript
const iframeWindow = document.getElementById('myframe').contentWindow

iframeWindow.postMessage('A secret', 'http://www.wrox.com')
```

最后一行代码尝试向内嵌窗格中发送一条消息，而且指定了源必须是`"http://www.wrox.com"`。如果源匹配，那么消息将会交付到内嵌窗格；否则，`postMessage()`什么也不做。这个限制可以保护信息不会因为地址改变而泄漏。如果不想知限制接收目标，则可以给`postMessage()`的第二个参数传`"*"`，但不推荐这么做。

接收到 XDM 消息后，`window`对象上触发`message`事件。这个事件是异步触发的，因此从消息发出到接收到消息（接收窗口触发`message`事件）可能有延迟。传给`onmessage`事件处理程序的`event`对象包含以下 3 方法重要信息：

- `data` 作为第一个参数传递给`postMessage()`的字符串数据
- `origin` 发送消息的文档源，例如`"http://ww.wrox.com"`
- `source` 发送消息的文档中`window`对象的代理。这个代理对象主要用于在发送一条消息的窗口中执行`postMessage()`方法。如果发送窗口有相同的源，那么这个对象应该就是`window`对象。

接收消息之后验证发送窗口的源是非常重要的。与`postMessage()`的第二个参数可以保证数据不回意外地传给未知页面一样。在`onmessage`事件处理程序中检查发送窗口的源可以保证数据来自正确的地方。

大多数情况下，`event.source`是某个`window`对象的代理，而非实际的`window`对象。因此不能通过它访问所有窗口下的信息。最好只使用`postMessage()`，这个方法永远存在且可以调用。

在通过内嵌窗格加载不同的域时，使用 XDM 是非常方便的。这种方法在混搭`mashup`和社交应用中非常常用。通过使用 XDM 与内嵌窗格中的网页通信，可以保证包含页面的安全。XDM 也可以用于同源页面之间的通信。

# Encodding API

Encoding API 主要用于实现字符串与定型数组之间的转换。规范新增了 4 个用于执行转换的全局类：`TextEncoder`、`TextEncoderStream`、`TextDecoder`和`TextDecoderStream`。

> 相比于**批量（bulk）**的编解码，对**流（stream）**编解码的支持很有限。

## 文本编码

Encoding API 提供了两种将字符串转换为定型数组二进制格式的方法：批量编码和流编码。把字符串转换为定型数组时，编码器始终使用 UTF-8。

### 批量编码

所谓**批量**，指的是 JavaScript 引擎会同步编码整个字符串。对于非常长的字符串，可能会花较长时间。批量编码是通过`TextEncoder`的实例完成的：

```javascript
const textEncoder = new TextEncoder()
```

这个实例上有一个`encode()`方法，该方法接收一个字符串参数，并以`Unit8Array`格式返回每个字符的 UTF-8 编码：

```javascript
const textEncoder = new TextEncoder()
const decodedText = 'foo'
const encodedText = textEncoder.encode(decodedText)

console.log(encodedText) // Unit8Array(3) [102, 111, 111]
```

编码器是用于处理字符的，有些字符（例如表情符号）在最终返回的数组中可能会占据多个索引：

```javascript
const textEncoder = new TextEncoder()
const decodedText = '☺'
const encodedText = textEncoder.encode(decodedText)

console.log(encodedText) // Unit8Array(3) [226, 152, 186]
```

编码器实例还有一个`encodeInto()`方法，该方法接收一个字符串和目标`Unit8Array`，返回一个字典，该字典包含`read`和`written`属性，分别表示成功从源字符串读取了多少字符和向目标数组写入了多少字符。如果定型数组的空间不够，编码就会提前终止，返回的字典会体现这个结果。

```javascript
const textEncoder = new TextEncoder()
const fooArr = new Unit8Array(3)
const barArr = new Unit8Array(2)
const fooResult = textEncoder.encodeInto('foo', fooArr)
const barResult = textEncoder.encodeInto('bar', barArr)

console.log(foArr) // Unit8Array(3) [102, 111, 111]
console.log(fooResult) // { read: 3, written: 3 }
console.log(barArr) // Unit8Array(2) [98, 97]
console.log(barResult) // { read: 2, written: 2 }
```

`encode()`要求分配一个新的`Unit8Array`，`encodeInto()`则不要。对于追求性能的应用，这个差别可能会带来显著不同。

> 文本编码会始终使用 UTF-8 格式，而且必须写入`Unit8Array`实例。使用其他类型数组会导致`encodeInto()`抛出错误。

### 流编码

`TextEncoderStream`其实就是`TransformStream`形式的`TextEncoder`。将解码后的文本流通过管道输入流编码器会得到编码后文本块的流：

```javascript
async function* chars() {
  const decodeText = 'foo'
  for (const char of decodeText) {
    yield await new Promise(resolve => setTimeout(resolve, 1000, char))
  }
}

const decodedTextStream = new ReadableStream({
  async start(controller) {
    for await (let chunk of chars()) {
      controller.enqueue(chunk)
    }

    controller.close()
  },
})

const encodedTextStream = decodedTextStream.pipeThrough(new TextEncoderStream())

const readableStreamDefaultReader = encodeTextStream.getReader()(
  async function () {
    while (true) {
      const { done, value } = await readableStreamDefaultReader.read()
      if (done) {
        break
      } else {
        console.log(value)
      }
    }
  }
)()

// Unit8Array [102]
// Unit8Array [111]
// Unit8Array [111]
```

## 文本解码

Encoding API 提供了两种将定型数组转换为字符串的方式：批量解码和流解码。与编码器类不同，在将定型数组转换为字符串时，解码器支持非常多的字符串编码。默认字符编码格式是 UTF-8。

### 批量解码

所谓**批量**，指的是 JavaScript 引擎会同步解码整个字符串。对于非常长的字符串，可能会花较长时间。批量解码是通过`TextDecoder`的实例完成的：

```javascript
const textDecoder = new TextDecoder()
```

这个实例上有一个`decode()`方法，该方法接收一个定型数组参数，返回解码后的字符串：

```javascript
const textDecoder = new TextDecoder()
const encodedText = Uint8Array.of(102, 111, 111)
const decodedText = textDecoder.decode(encodedText)

console.log(decodedText) // foo
```

解码器不关心传入的是哪种定型数组，它只会专心解码整个二进制表示。在下面这个例子中，只包含 8 位字符的 32 位值被解码为 UTF-8 格式，解码得到的字符串中填充了空格：

```javascript
const textDecoder = new TextDecoder()

const encodedText = Uint32Array.of(102, 111, 111)
const decodedText = textDecoder.decode(encodedText)

console.log(decodedText) // 'foo'
```

解码器是用于处理定型数组中分散在多个索引上的字符的，包括表情符号：

```javascript
const textDecoder = new TextDecoder()

const encodedText = Uint8Array.of(240, 159, 152, 138)
const decodedText = textDecoder.decode(encodedText)

console.log(decodedText) // '😊'
```

和`TextEncoder`不同，`TextDecoder`可以兼容很多字符编码。例如下面的例子就使用了 UTF-16 而非默认的 UTF-8:

```javascript
const textDecoder = new TextDecoder('utf-16')

const encodedText = Uint16Array.of(102, 111, 111)
const decodedText = textDecoder.decode(encodedText)

console.log(decodedText) // 'foo'
```

### 流解码

`TextDecoderStream`其实就是`TransformStream`形式的`TextDecoder`。将编码后的文本流通过管道输入流解码器会得到解码后的文本块的流：

```javascript
async function* chars() {
  const encodedText = [102, 111, 111].map(x => Uint8Array.of(x))
  for (const char of encodedText) {
    yield await new Promise(resolve => setTimeout(resolve, 1000, char))
  }
}

const encodedTextStream = new ReadableStream({
  async start(controller) {
    for await (const chunk of chars()) {
      controller.enqueue(chunk)
    }

    controller.close()
  },
})

const decodedTextStream = encodedTextStream.pipeThrough(new TextDecoderStream())
const readableStreamDefaultReader = decodedTextStream.getReader()(
  async function () {
    while (true) {
      const { done, value } = await readableStreamDefaultReader.read()

      if (done) {
        break
      } else {
        console.log(value)
      }
    }
  }
)()

// f
// o
// o
```

文本解码器流能够识别可能分散在不同块上的代理对。解码器流会保持块片段直到取得完整的字符。例如在下面的例子中，流解码器在解码流并输出字符之前会等待传入 4 个块：

```javascript
async function* chars() {
  const encodedText = [240, 159, 152, 138].map(x => Uint8Array.of(x))

  for (const char of encodedText) {
    yield await new Promise(resolve => setTimeout(resolve, 1000, char))
  }
}

const encodedTextStream = new ReadableStream({
  async start(controller) {
    for await (const chunk of chars()) {
      controller.enqueue(chunk)
    }
    controller.close()
  },
})

const decodedTextStream = encodedTextStream.pipeThrough(new TextDecoderStream())

const readableStreamDefaultReader = decodeTextStream.getReader()(
  async function () {
    while (true) {
      const { done, value } = await readableStreamDefaultReader.read()

      if (done) {
        break
      } else {
        console.log(value)
      }
    }
  }
)()

// '😊'
```

文本解码器流经常与`fetch()`一起使用，因为响应体可以作为`ReadableStream`来处理。例如：

```javascript
const response = await fetch(url) 
const stream = response.body.pipeThrough(new TextDecoderStream())
const decodedStream = stream.getReader()

for await (const decodedChunk of decodedStream) {
  console.log(decodedChunk)
}
```

# File API与Blob API

Web应用程序的一个主要痛点是无法操作用户计算机上的文件。2000年之前，处理文件的唯一方式是把`<input type="file">`放到一个表单里，仅此而已。File API与Blob API是为了让Web开发者能以安全的方式访问客户端机器上的文件，从而更好地与这些文件交互而设计的。

## `File`类型

**File API仍然以表单中的文件输入字段为基础**，但是增加了直接访问文件信息的能力。HTML5在DOM上为输入元素添加了`files`集合。当用户在文件字段中选择一个或多个文件时，这个`file`集合中会包含一组`File`对象，表示被选中的文件。每个`File`对象都有一些**只读**属性。

- `name`：本地系统中的文件名
- `size`：以字节计算的文件大小
- `type`：包含文件MIME类型的字符串
- `lastModifiedDate`：表示文件最后修改事件的字符串。这个属性目前只有Chrome实现了。
