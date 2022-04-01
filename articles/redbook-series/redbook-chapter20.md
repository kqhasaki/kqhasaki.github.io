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

# File API 与 Blob API

Web 应用程序的一个主要痛点是无法操作用户计算机上的文件。2000 年之前，处理文件的唯一方式是把`<input type="file">`放到一个表单里，仅此而已。File API 与 Blob API 是为了让 Web 开发者能以安全的方式访问客户端机器上的文件，从而更好地与这些文件交互而设计的。

## `File`类型

**File API 仍然以表单中的文件输入字段为基础**，但是增加了直接访问文件信息的能力。HTML5 在 DOM 上为输入元素添加了`files`集合。当用户在文件字段中选择一个或多个文件时，这个`file`集合中会包含一组`File`对象，表示被选中的文件。每个`File`对象都有一些**只读**属性。

- `name`：本地系统中的文件名
- `size`：以字节计算的文件大小
- `type`：包含文件 MIME 类型的字符串
- `lastModifiedDate`：表示文件最后修改事件的字符串。这个属性目前只有 Chrome 实现了。

例如，通过监听`change`事件然后遍历`files`集合可以取得每个选中文件的信息：

```javascript
const fileList = document.getElementById('files-list')

filesList.addEventListener('change', event => {
  const files = event.target.files
  let i = 0
  while (i < files.length) {
    const f = files[i]
    console.log(`${f.name}, ${f.type}, ${f.size} bytes`)
    i++
  }
})
```

这个例子简单将每个文件的信息输出到控制台。仅就这个能力而言，Web 应用已经比没有 File API 之前迈进了一大步。不过，File API 还提供了`FileReader`类型，让我们可以实际从文件中读取数据。

## `FileReader`类型

`FileReader`类型表示一种异步文件读取机制。可以把`FileReader`想象成类似于`XMLHttpRequest`，只不过是用于从文件系统读取文件，而不是从服务器读取数据。`FileReader`类型提供了几个读取文件数据的方法。

- `readAsText(file, encoding)`：从文件中读取纯文本内容并保存在`result`属性中。第二个参数表示编码，是可选的。
- `readAsDataURL(file)`：读取文件并将内容的数据 URI 保存在`result`属性中。
- `readAsBinaryString(file)`：读取文件并将每个字符的二进制数据保存在`result`属性中。
- `readAsArrayBuffer(file)`：读取文件并将文件内容以`ArrayBuffer`形式保存在`result`属性。

这些读取数据的方法为处理文件数据提供了极大的灵活性。例如，为了向用户显示图片，可以将图片数据读取为 URI，而为了解析文件内容，可以将文件读取为文本。

因为这些读取方法是异步的，所以每个`FileReader`会发布几个事件，其中 3 个最有用的事件是`progress`、`error`和`load`，分别表示还有更多数据、发生了错误和读取完成。

`progress`事件每 50 毫秒就会触发一次，和 XHR 的`progress`事件具有相同的信息：`lengthComputable`、`loaded`和`total`。此外，在`progress`事件中可以读取`FileReader`的`result`属性，即使其中尚未包含全部数据。

`error`事件会在由于某种原因无法读取文件时触发。触发`error`事件时，`FileReader`的`error`属性会包含错误信息。这个属性是一个对象，只包含一个属性：`code`。这个错误码的值可能是 1（未找到文件）、2（安全错误）、3（读取被中断）、4（文件不可读）或 5（编码错误）。

`load`事件会在文件加载成功后触发。如果`error`事件被触发，则不会再触发`load`事件。

```javascript
const filesList = document.getElementById('files-list')

filesList.addEventListener('change', event => {
  const info = ''
  const output = document.getElementById('output')
  const progress = document.getElementById('progress')
  const files = event.target.files
  const type = 'default'
  const reader = new FileReader()

  if (/image/.test(files[0].type)) {
    reader.readAsDataURL(files[0])
    type = 'image'
  } else {
    reader.readAsText(files[0])
    type = 'text'
  }

  reader.onerror = function () {
    output.innerHTML = 'Could not read file, error code is ' + reader.error.code
  }

  reader.onprogress = function (event) {
    if (event.lengthComputable) {
      progress.innerHTML = `${event.loaded}/${event.total}`
    }
  }

  reader.onload = function () {
    let html = ''

    switch (type) {
      case 'image':
        html = `<img src="${reader.result}">`
        break
      case 'text':
        html = reader.result
        break
    }
    output.innerHTML = html
  }
})
```

以上代码从表单字段中读取一个文件，并将其内容显示在了网页上。如果文件的 MIME 类型表示它是一个图片，那么就将其读取后保存为数据 URL，在`load`事件触发时将数据 URI 作为图片插入页面中。如果文件不是图片，则读取后将其保存为文本并原样输出到网页上。`progress`事件用于跟踪和显示读取文件的进度，而`error`事件用于监控错误。

如果想提前结束文件读取，则可以在过程中调用`abort()`方法，从而触发`abort`事件。在`load`、`error`和`abort`事件触发后，还会触发`loadend`事件。`loadend`事件表示在上述 3 种情况下，所有读取操作都已结束。`readAsText()`和`readAsDataURL()`方法已经得到了所有主流浏览器支持。

## `FileReaderSync`类型

顾名思义，`FileReaderSync`类型就是`FileReader`的**同步版本**。这个类型拥有与`FileReader`相同的方法，只有在整个文件都加载到内存之后才会继续执行。`FileReaderSync`只在工作线程中可用，因为如果读取整个文件耗时太长则会影响全局。

假设通过`postMessage()`向工作线程发送了一个`File`对象。以下代码会让工作线程同步将文件读取到内存中，然后将文件的数据 URL 发送回来。

```javascript
// worker.js

self.onmessage = messageEvent => {
  const syncReader = new FileReaderSync()
  console.log(syncReader) // FileReaderSync {}

  // 读取文件时阻塞工作线程
  const result = syncReader.readAsDataURL(messageEvent.data)

  // PDF文件的示例响应
  console.log(result) // data:application/pdf;base64,....

  // 把URL发回去
  self.postMessage(result)
}
```

## `Blob`与部分读取

某些情况下，可能需要读取部分文件而不是整个文件。为此，`File`对象提供了一个名为`slice()`的方法。`slice()`方法接收两个参数：起始字节和要读取的字节数。这个方法返回一个`Blob`实例，而`Blob`实际上是`File`的基类。

Blob 表示**二进制大对象**(binary large object)，是 JavaScript 对不可修改二进制数据的封装类型。包含字符串的数组、`ArrayBuffers`、`ArrayBufferViews`，甚至其他`Blob`都可以用来创建 blob。`Blob`构造函数可以接受一个`options`参数，并在其中指定 MIME 类型：

```javascript
console.log(new Blob(['foo']))
// Blob {size: 3, type: ''}

console.log(new Blob(['{"a", "b"}'], { type: 'application/json' }))
// {size: 10, type: "application/json"}

console.log(new Blob(['<p>Foo</p>', '<p>Bar</p>'], { type: 'text/html' }))
// {size: 20, type: 'text/html'}
```

`Blob`对象有一个`size`属性和一个`type`属性，还有一个`slice()`方法用于进一步切分数据。另外也可以使用`FileReader`从`Blob`中读取数据。下面的例子只会读取文件的前 32 字节：

```javascript
const fileList = document.getElementById('files-list')

filesList.addEventListener('change', event => {
  const info = ''
  const output = document.getElementById('output')
  const progress = document.getElementById('progress')
  const files = event.target.files
  const reader = new FileReader()
  const blob = blobSlice(files[0], 0, 32)

  if (blob) {
    reader.readAsText(blob)

    reader.onerror = function () {
      output.innerHTML =
        'Could not read file, error code is ' + reader.error.code
    }

    reader.onload = function () {
      output.innerHTML = reader.result
    }
  } else {
    console.log('You browser does not support slice()')
  }
})
```

只读取部分文件可以节省时间，特别是只需要数据特定部分例如文件头部。

## 对象 URL 和`Blob`

对象 URL 有时候也称为 Blob URL，是指引用存储在`File`或`Blob`中数据的 URL。对象 URL 的优点是不用把文件内容读取到 JavaScript 也可以使用文件。只要在适当位置提供对象 URL 即可。要创建对象 URL，可以使用`window.URL.createObjectURL()`方法并传入`File`或`Blob`对象。这个函数返回的值是一个指向内存中地址的字符串。因为这个字符串是 URL，所以可以在 DOM 中直接使用。例如下面的代码使用对象 URL 在页面中显示了一张图片：

```javascript
const filesList = document.getElementById('files-list')

filesList.addEventListener('change', event => {
  const info = ''
  const output = document.getElementById('output')
  const progress = document.getElementById('progress')
  const files = event.target.files
  const reader = new FileReader()
  const url = window.URL.createObjectURL(files[0])

  if (url) {
    if (/image/.test(files[0].type)) {
      output.innerHTML = `<img src="${url}"}>`
    } else {
      output.innerHTML = 'Not an image.'
    }
  } else {
    output.innerHTML = `Your browser doesn't support object URLs.`
  }
})
```

如果把对象 URL 直接放到`<img>`标签，就不要把数据预先读取到 JavaScript 中了。`<img>`标签可以直接从相应的内存位置把数据读取到页面上。

使用完数据后，最好能释放与之关联的内存。只要对象 URL 在使用中，就不能释放内存。如果想表明不再使用某个对象 URL，则可以将其传给`window.URL.revokeObjectURL()`。页面卸载时，所有对象 URL 占用的内存都会被释放。不过，最好在不使用时就会立即释放内存，以便尽可能保持页面占用最少资源。

## 读取拖放文件

组合使用 HTML5 拖放 API 和 File API 可以创建读取文件信息的有趣功能。在页面上创建放置目标后，可以从桌面上把文件拖动并放到放置目标。这样会像拖放图片或链接一样触发`drop`事件。被放置的文件可以通过事件的`event.dataTransfer.files`属性读取到，这个属性保存着一组`File`对象，就像文本输入字段一样。

下面的例子会把拖放到页面放置目标上的文件信息打印出来：

```javascript
const droptarget = document.getElementById('droptarget')

function handleEvent(event) {
  const info = ''
  const output = document.getElementById('output')
  let files, i, len
  event.preventDefault()

  if (event.type === 'drop') {
    files = event.dataTransfer.files
    i = 0
    len = files.length
    while (i < len) {
      info += `${files[i].name} (${files[i].type}), ${files[i].size} bytes<br>`
      i++
    }

    output.innerHTML = info
  }
}

droptarget.addEventListener('dragenter', handleEvent)
droptarget.addEventListener('dragover', handleEvent)
droptarget.addEventListener('drop', handleEvent)
```

与后面要介绍的拖放例子一样，必须取消`dragenter`、`dragover`和`drop`的默认行为。在`drop`事件处理程序中，可以通过`event.dataTransfer.files`读取到文件，此时可以获取文件的相关信息。

# 媒体元素

随着嵌入音频和视频元素在 Web 应用上的流行，大多数内容提供商会强迫使用 Flash 以便达到最佳的跨浏览器兼容性。HTML5 新增了两个与媒体相关的元素，即`<audio>`和`<video>`，从而为浏览器提供了嵌入音频和视频的统一解决方案。

这两个元素既支持 Web 开发者在页面中嵌入媒体文件，也支持 JavaScript 实现对媒体的自定义控制。以下是它们的用法：

```jsx
<!-- 嵌入视频 -->
<video src="conference.mpg" id="myVideo">Video player not available.</video>
<!-- 嵌入音频 -->
<audio src="song.mp3" id="myAudio">Audio player not available.</audio>
```

每个元素至少要求有一个`src`属性，以表示要加载的媒体文件。我们也可以指定表示视频播放器大小的`width`和`height`属性，以及在视屏加载期间显示图片 URI 的`poster`属性。另外，`controls`属性如果存在，则表示浏览器应该显示播放界面，让用户可以直接控制媒体。**开始和结束标签之间的内容是在媒体播放器不可用时显示的替代内容**。

由于浏览器支持的媒体格式不同，因此可以指定多个不同的媒体源。为此需要从元素中删除`src`属性，使用一个或多个`<source>`元素代替，例如下面的例子：

```jsx
<!-- 嵌入视频 -->
<video id="myVideo">
  <source src="conference.webm" type="video/webm; codecs='vp8, vorbis'" />
  <source src="conference.ogv" type="video/ogg; codecs='theora, vorbis'" />
  <source src="conference.mpg" />
  Video Player not available.
</video>

<!-- 嵌入音频 -->
<audio id="myAudio">
  <source src="song.ogg" type="audio/ogg" />
  <source src="song.mp3" type="audio/mpeg" />
  Audio Player not available.
</audio>
```

讨论不同音频和视频的编解码器超出了本书范围，但浏览器支持的编解码器确实可能有所不同，因此指定多个源文件通常是必须的。

## 属性

`<video>`和`<audio>`元素提供了稳健的 JavaScript 接口。这两个元素有很多共有属性，可以用于确定媒体的当前状态。

## 事件

除了有很多属性，媒体元素还有很多事件。这些事件会监控由于媒体回放或用户交互导致的不同属性的变化。这些事件被设计得尽可能具体，以便 Web 开发者能够使用较少的 HTML 和 JavaScript 创建自定义的音频/视频播放器（而不是创建新 Flash 影片）。

## 自定义媒体播放器

使用`<audio>`和`<video>`的`play()`和`pause()`方法，可以手动控制媒体文件的播放。综合使用属性、事件和这些方法，可以方便地创建自定义的媒体播放器。例如下面例子：

```jsx
<div class="mediaplayer">
  <div class="video">
    <video
      id="player"
      src="movie.mov"
      poster="mymovie.jpg"
      width="300"
      height="200"
    >
      Video player not available.
    </video>
  </div>
  <div class="controls">
    <input type="button" value="Play" id="video-btn" />
    <span id="curtime">0</span>/<span id="duration">0</span>
  </div>
</div>
```

```javascript
const player = document.getElementById('player')
const btn = document.getElementById('video-btn')
const curtime = document.getElementById('curtime')
const duration = document.getElementById('duration')

duration.innerHTML = player.duration

btn.addEventListener('click', event => {
  if (player.paused) {
    player.play()
    btn.value = 'Pause'
  } else {
    player.pause()
    btn.value = 'Play'
  }
})

setInterval(() => {
  curTime.innerHTML = player.currentTime
}, 250)
```

这里的 JavaScript 代码简单地为按钮添加了事件处理程序，可以根据当前状态播放和暂停视频。此外，还给`<video>`元素的`load`事件添加了事件处理程序，以便显示视频的时长。最后重复的计时器用于更新当前时间。通过监听更多事件以及使用更多属性，可以进一步扩展这个自定义的视频播放器。同样的代码也可以用于`<audio>`元素以创建自定义的音频播放器。

## 检测编解码器

如前所述，并不是所有浏览器都支持`<video>`和`<audio>`的所有编解码器，这通常意味着必须提供多个媒体源。为此，也有 JavaScript API 可以用来检测浏览器是否支持给定格式和编解码器。这两个媒体元素都有一个名为`canPlayType()`的方法，改方法接收一个格式/编解码器字符串，返回一个字符串值：`"probably"`、`"maybe"`或`""`（空字符串），其中空字符串就是假值，意味着可以在`if`语句中像这样使用`canPlayType()`:

```javascript
if (audio.canPlayType('audio/mpeg')) {
  // 执行某些操作
}
```

`"probably"`和`"maybe"`都是真值，在`if`语句的上下文中可以转型为`true`。

在只给`canPlayType()`提供一个 MIME 类型的情况下，最可能返回的值是`"maybe"`和空字符串。这是因为文件实际上只是一个包装音频和视频数据的容器，而真正决定文件是否可以播放的是编码。在同时提供 MIME 类型和编解码器的情况下，返回值的可能性会提高到`probably`。

## 音频类型

`<audio>`元素还有一个名为`Audio`的原生 JavaScript 构造函数，支持在任何时候播放音频。`Audio`类型和`Image`类似，都是 DOM 元素的对等体，只是不需插入文档即可工作。要通过`Audio`播放音频，只需创建一个新实例并传入音频源文件：

```jsx
const audio = new Audio('sound.mp3')
EventUtil.addHandler(audio, 'canplaythrough', function (event) {
  audio.play()
})
```

创建`Audio`的新实例就会下载指定的文件。下载完毕之后，可以调用`play()`来播放音频。在 iOS 中调用`play()`方法会弹出一个对话框，请求用户授权播放声音。为了连续播放，必须在`onfinish`事件处理程序中立即调用`play()`。

# 原生拖放

IE4 最早在网页中为 JavaScript 引入了对拖放功能的支持。当时，网页中只有两样东西可以触发拖放：图片和文本。拖动图片就是简单地在图片上按住鼠标不放然后移动鼠标。而对于文本，必须先选中，然后再以同样的方式拖动。在 IE4 中唯一有效的放置目标是文本框。IE5 扩展了拖放能力，添加了新的事件，让网页中几乎一切都可以成为放置目标。IE5.5 又进一步，允许几乎一切都可以拖动（IE6 也支持）。**HTML5 在 IE 的拖放实现基础上标准化了拖放功能。**所有主流浏览器都根据 HTML5 规范实现了原生的拖放。

关于拖放最有意思的可能就是可以跨窗格、跨浏览器容器，有时候甚至可以跨应用程序拖动元素。浏览器对拖放的支持可以让我们实现这些功能。

## 拖放事件

拖放事件几乎可以让开发者控制拖放操作的方方面面。关键的部分是确定每个事件是在哪里触发的。有的事件在被拖放元素上触发，有的事件则在放置目标上触发。在某个元素被拖动时，会（按顺序）触发以下事件：

- `dragstart`
- `drag`
- `dragend`

在按住鼠标键不放并开始移动鼠标的那一刻，被拖动元素上触发`dragstart`事件。此时光标会变成非放置符号，表示元素不能放到自身上。拖动开始时，可以在`ondragstart`事件处理程序中通过 JavaScript 执行某些操作。

`dragstart`事件触发后，只要目标还被拖动就会持续触发`drag`事件。这个事件类似于`mousemove`，即随着鼠标移动而不断触发。当拖动停止时（把元素放到有效或无效的放置目标上），会触发`dragend`事件。

所有这 3 个事件的目标都是被拖动的元素。默认情况下，浏览器在拖动开始后不会改变被拖动元素的外观，因此是否改变外观由你来决定。不过，大多数浏览器此时会创建元素的一个半透明副本，始终跟随在光标下方。在把元素拖动到一个有效的放置目标上，会依次触发以下事件：

- `dragenter`
- `dragover`
- `dragleave`或者`drop`

只要一把元素拖动到放置目标上，`dragenter`事件（类似于`mouseover`事件）就会触发。`dragenter`事件触发之后，会立即触发`dragover`事件，并且元素在放置目标范围内被拖动期间此事件会持续触发。当元素被拖动到放置目标之外时，`dragover`事件停止触发，`dragleave`事件触发（类似于`mouseout`事件）。如果被拖动元素被放到了目标上，则会触发`drop`事件而不是`dragleave`事件。这些事件的目的是放置目标元素。

## 自定义放置目标

在把某个元素拖动到无效放置目标上时，会看到一个特殊光标表示不能放下。即使所有元素都支持放置目标事件，这些元素默认是不允许放置的。如果把元素拖动到不允许放置的目标上，无论用户动作是什么都不会触发`drop`事件。不过，通过覆盖`dragenter`和`dragover`事件的默认行为，可以把任何元素转换为有效的放置目标。例如，如果有一个 ID 为`"droptarget"`的`<div>`元素，那么可以使用以下代码把它转换成一个放置目标：

```jsx
const droptarget = document.getElementById('droptarget')

droptarget.addEventListener('dragover', event => {
  event.preventDefault()
})

droptarget.addEventListener('dragenter', event => {
  event.preventDefault()
})
```

执行上面的代码后，把元素拖动到这个`<div>`上应该可以看到光标变成了允许放置的样子。另外，`drop`事件也会触发。

在 Firefox 中，放置事件的默认行为是导航到放在放置目标上的 URL。这意味着把图片拖动到放置目标上导致页面导航到图片文件，把文本拖动到放置目标上会导致无效 URL 错误。为阻止这个行为，在 Firefox 中必须取消`drop`事件的默认行为：

```jsx
droptarget.addEventListener('drop', event => {
  event.preventDefault()
})
```

## `dataTransfer`对象

除非数据受影响，否则简单的拖放并没有实际意义。为实现拖动操作中的数据传输，IE5 在`event`对象上暴露了`dataTransfer`对象，用于从被拖动元素向放置目标传递字符串数据。因为这个对象是`event`的属性，所以在拖放事件的事件处理程序外部无法访问`dataTransfer`。在事件处理程序内部，可以使用这个对象的属性和方法实现拖放功能。`dataTransfer`对象的标准化现在已经纳入了 HTML5 草案。

`dataTransfer`对象有两个主要方法：`getData()`和`setData()`。顾名思义，`getData()`用来获取`setData()`存储的值。`setData()`的第一个参数以及`getData()`的唯一参数是一个字符串，表示要设置的数据类型：`"text"`或`"URL"`。

```jsx
event.dataTransfer.setData('text', 'some text')
const text = event.dataTransfer.getData('text')

event.dataTransfer.setData('URL', 'http://www.wrox.com')
const url = event.dataTransfer.getData('URL')
```

虽然这两种数据类型是 IE 最初引入的，但 HTML5 已经将其扩展为允许任何 MIME 类型。为向后兼容，HTML5 还会继续支持`"text"`和`"URL"`，但是它们会分别映射到`"text/plain"`和`"text/uri-list"`。

`dataTransfer`对象实际上可以包含每种 MIME 类型的一个值，也就是说可以同时保存文本和 URL，两者不会相互覆盖。存储在`dataTransfer`对象中的数据只能在放置事件中读取。如果没有在`ondrop`事件处理程序中取得这些数据，`dataTransfer`对象就会被销毁，数据也会丢失。

在从文本框拖动图片时，浏览器会调用`setData()`并把 URL 存储起来。当数据被放置在目标上时，可以使用`getData()`获取这些数据。当然，可以在`dragstart`事件中手动调用`setData()`存储自定义数据，以便将来使用。

作为文本的数据和作为 URL 的数据有一个区别。当把数据作为文本存储时，数据不会被特殊对待。而当把数据作为 URL 存储，数据会被作为网页中的一个链接，意味着如果把它放到另一个浏览器窗口，浏览器会导航到该 URL。

## `dropEffect`和`effectAllowed`

`dataTransfer`对象不仅可以用于实现简单的数据传输，还可以用于确定能够对被拖动元素和放置目标执行什么操作。为此可以使用两个属性：`dropEffect`和`effectAllowed`。

`dropEffect`属性可以告诉浏览器允许哪种放置行为。这个属性有以下 4 种可能的值。

- `"none"`：被拖动元素不能放到这里。这是除文本框之外所有元素的默认值。
- `"move"`：被拖动元素应该移动到放置目标。
- `"copy"`：被拖动元素应该复制到放置目标。
- `"link"`：表示放置目标会导航到被拖动元素（仅在它是 URL 的情况下）。

在把元素拖动到放置目标上，上述每种值都会导致显示一种不同的光标。不过，是否导致光标示意的动作还要取决于开发者。换句话说，如果没有代码参与，就不会有什么自动移动、复制或链接。唯一不用考虑的就是光标自己会变。为了使用`dropEffect`属性，必须在放置目标的`ondragenter`事件处理程序中设置它。

除非同时设置`effectAllowed`，否则`dropEffect`属性也没有用。`effectAllowed`属性表示对被拖动元素是否允许`dropEffect`。

## 可拖动能力

默认情况下，图片、链接和文本是可拖动的，这意味着无须额外代码用户便可以拖动它们。文本只有在被选中后才可以拖动，而图片和链接在任意时候都是可以拖动的。

我们可以让其他元素变得可拖动。HTML5 在所有 HTML 元素上规定了一个`draggable`属性，表示元素是否可以拖动。图片和链接的`draggable`属性自动被设置为`true`，而其他所有此属性的默认值为`false`。如果想让其他元素可以拖动，或者不允许图片和链接被拖动，都可以设置这个属性。例如：

```html
<!-- 禁止拖动图片 -->
<img src="simle.gif" draggable="false" alt="Smiley face" />
<!-- 让元素可以拖动 -->
<div draggable="true">...</div>
```

## 其他成员

HTML5 规范还为`dataTransfer`对象定义了下列方法。

- `addElement(element)`：为拖动操作添加元素。这纯粹是为了传输数据，不会影响拖动操作的外观。在本书写作时，还没有浏览器实现这个方法。
- `clearData(format)`：清除以特定格式存储的数据。
- `setDragImage(element, x, y)`：允许指定拖动发生时显示在光标下面的图片。这个方法接收 3 个参数：要显示的 HTML 元素以及光标位置的图片上的 x 和 y 坐标。这里的 HTML 元素可以时一张图片，此时显示图片；也可以是其他任何元素，此时显示渲染后的元素。
- `types`：当前存储的数据类型列表。这个集合类似数组，以字符串形式保存数据类型，例如`"text"`。

# Page Visibility API

Web 开发中一个很常见的问题是开发者不知道用户什么时候真正在使用页面。如果页面被最小化或隐藏在其他标签页的后面，那么轮询服务器或更新动画等功能可能就没必要了。Page Visibility API 旨在为开发者提供页面对用户是否可见的信息。

这个 API 本身非常简单，由 3 部分组成：

- 页面在后台标签页或浏览器中最小化了。

  - 页面在前台标签页中。

  - 实际页面隐藏了，但对页面的预览是可见。

  - 页面在屏幕外面渲染。

- `visibilitychange`事件，该事件会在文档中从隐藏变为可见（或反之）时触发。

- `document.hidden`布尔值，表示页面是否隐藏。这可能意味着页面在后台标签页或浏览器中被最小化了。这个值时为了向后兼容才继续被浏览器支持的，应该优先使用`document.visibilityState`检测页面可见性。

想要在页面从可见变为隐藏或从隐藏变为可见时得到通知，需要监听`visibilitychange`事件。`document.visibilityState`的值是以下三个字符串之一：

- `"hidden"`
- `"visible"`
- `"pretender"`

# Streams API

Streams API 是为了解决一个简单又基础的问题而生的：Web 应用如何消费有序的小信息块而不是大块信息？这种能力主要有两种应用场景。

- 大块数据可能不会一次性都可用。网络请求是一个典型例子。网络负载是以连续信息包形式交付的，而流式处理可以让用用在数据一到达就能使用，而不必等到所有数据都加载完毕。
- 大块数据可能需要分小部分处理。视频处理、数据压缩、图像编码和 JSON 解析都是可以分成小部分进行处理，而不必等到所有数据都在内存中时再处理的例子。

后面讨论网络请求和远程资源时会介绍 Streams API 在`fetch()`中的应用，不过 Streams API 本身是通用的。实现 Observable 接口的 JavaScript 库共享了很多流的基础概念。

> 虽然 Fetch API 已经得到所有主流浏览器支持，但 Streams API 则没有那么得到支持。

## 理解流

提到流，可以把数据想象成某种通过管道输送的液体。JavaScript 中的流借用了管道相关的概念，因为原理是想通的。根据规范，“这些 API 实际是为映射低级 I/O 原语而设计，包括适当时候对字节流的规范化”。Stream API 直接解决的问题是处理网络请求和读写磁盘。

Stream API 定义了三种流。

- **可读流**：可以通过某个公共接口读取数据块的流。数据在内部从底层源进入流，然后由**消费者**进行处理。
- **可写流**：可以通过某个公共接口写入数据块的流。**生产者**将数据写入流，数据在内部传入底层数据槽（sink）。
- **转换流**：由两种流组成，可写流用于接收数据（可写端），可读流用于输出数据（可读端）。这两个流之间是**转换程序**，可以根据需要检查和修改流内容。

### 块、内部队列和反压

流的基本单位是**块**（chunk）。块可以是任意数据类型，但通常是定型数组。每个块都是离散的流片段，可以作为一个整体来处理。更重要的是，块不是固定大小的，也不一定按固定间隔到达。在理想的流当中，块的大小通常近似相同，到达间隔也近似相等。不过好的流实现需要考虑边界情况。

前面提到的各种类型的流都有入口和出口的概念。有时候，由于数据进出的速率不同，可能会出现不匹配的情况。为此流平衡可能出现如下三种情形：

- 流出口处理数据的速度比入口提供数据的速度快。流出口经常空闲（可能意味着流入口效率较低），但只会浪费一点内存或计算资源，因此这种流的不平衡是可以接受的。
- 流入和流出均衡，这是理想状态。
- 流入口提供数据的速度比出口处理数据的速度快。这种流不平衡是固有的问题。此时一定会在某个地方出现数据积压，流必须相应做出处理。

**流不平衡**是常见问题，但流也提供了解决这个问题的工具。所有流都会为进入流但尚未离开流的块提供一个内部队列。对于均衡流，这个内部队列中会有零个或少量排队的块，因为流出口块出列的速度与流入口块入列的速度近似相等。这种流的内部队列所占用的内存相对比较小。

如果块入列速度快于出列速度，则内部队列会不断增大。流不能允许其内部队列无限增大，因此它会使用**反压**（backpressure）通知流入口停止发送数据，直到队列大小降到某个既定的阈值之下。这个阈值由排列策略决定，这个策略定义了内部队列可以占用的最大内存，即**高水位线**（high water mark）。

## 可读流

可读流是对底层数据源的封装。底层数据源可以将数据填充到流中，允许消费者通过流的公共接口读取数据。

### `ReadableStreamDefaultController`

看下面的生成器函数，它每 1000 毫秒就会生成一个递增的整数：

```jsx
async function* ints() {
  for (let i = 0; i < 5; i++) {
    yield await new Promise(resolve => setTimeout(resolve, 1000, i))
  }
}
```

这个生成器的值可以通过可读流的控制器传入可读流。访问这个控制器最简单的方式就是创建`ReadableStream`的一个实例，并且在这个构造函数的`underlyingSource`参数（第一个参数）中定义`start()`方法，然后在这个方法中使用作为参数传入的`controller`。默认情况下，这个控制器参数是`ReadableStreamDefaultController`的一个实例。

```jsx
const readableStream = new ReadableStream({
  start(controller) {
    console.log(controller) // ReadableStreamDefaultController {}
  },
})
```

调用控制器的`enqueue()`方法可以把值传入控制器。所有值都传完之后使用`close()`关闭流：

```jsx
async function* ints() {
  for (let i = 0; i < 5; i++) {
    yield await new Promise(resolve => setTimeout(resolve, 1000, i))
  }
}

const readableStream = new ReadableStream({
  async start(controller) {
    for await (let chunk of ints()) {
      controller.enqueue(chunk)
    }
    controller.close()
  },
})
```

> `for await ... of`**语句**创建一个循环，该循环遍历异步可迭代对象以及同步可迭代对象，包括：内置的`String`、`Array`，类数组对象（例如`arguments`或`NodeList`），`TypedArray`，`Map`，`Set`和用户定义的异步/同步迭代器。它使用对象的每个不同属性的值调用要执行的语句来调用自定义迭代钩子。
>
> 类似于`await`运算符一样，该语句只能在一个`async function`内部使用。

### `ReadableStreamDefaultReader`

前面的例子把 5 个值加入了流的队列，但没有把它们从队列中读出来。为此，需要一个`ReadableStreamDefaultReader`的实例，该实例可以通过流的`getReader()`方法获取。调用这个方法会获得流的锁，保证只有这个读取器可以从流中读取值：

```jsx
async function* ints() {
  for (let i = 0; i < 5; i++) {
    yield await new Promise(resolve => setTimeout(resolve, 1000, i))
  }
}

const readableStream = new ReadableStream({
  async start(controller) {
    for await (let chunk of ints()) {
      constroller.enqueue(chunk)
    }
    controller.close()
  },
})

console.log(readableStream.locked) // false
const readableStreamDefaultReader = readableStream.getReader()
console.log(readableStream.locked) // true
```

消费者使用这个读取器实例的`read()`方法可以读出值：

```jsx
async function* ints() {
  for (let i = 0; i < 5; i++) {
    yield await Promise(resolve => setTimeout(resolve, 1000, i))
  }
}

const readableStream = new ReadableStream({
  async start(controller) {
    for await (let chunk of ints()) {
      controller.enqueue(chunk)
    }
    controller.close()
  },
})

console.log(readableStream.locked) // false
const readableStreamDefaultReader = readableStream.getReader()
console.log(readableStream.locked) // true
;(async function () {
  while (true) {
    const { done, value } = await readableStreamDefaultReader.read()
    if (done) {
      break
    } else {
      console.log(value)
    }
  }
})()

// 0
// 1
// 2
// 3
// 4
```

## 可写流

可写流是底层数据槽的封装。底层数据槽处理通过的流的公共接口写入的数据。

### 创建`WritableStream`

还是上面的生成器:

```jsx
async function* ints() {
  for (let i = 0; i < 5; i++) {
    yield await new Promise(resolve => setTimeout(resolve, 1000, i))
  }
}
```

这些值通过可写流的公共接口可以写入流。在传给`WritableStream`构造函数的`underlyingSink`参数中，通过实现`write()`方法可以获得写入的数据：

```jsx
const readableStream = new WritableStream({
  write(value) {
    console.log(value)
  },
})
```

### `WritableStreamDefaultWriter`

要把获得的数据写入流，可以通过流的`getWriter()`方法获取`WritableStreamDefaultWriter`的实例。这样会获得流的锁，确保只有一个写入器可以向流中写入数据：

```jsx
async function* ints() {
  for (let i = 0; i < 5; i++) {
    yield await new Promise(resolve => setTimeout(resolve, 1000, i))
  }
}

const writableStream = new WritableStream({
  write(value) {
    console.log(value)
  },
})

console.log(writableStream.locked) // false
const writableStreamDefaultWriter = writableStream.getWriter()
console.log(writableStream.locked) // true
```

在向流中写入数据之前，生产者必须确保写入器可以接收值。`writableStreamDefaultWriter.ready`返回一个期约，此期约会在能够向流中写入数据时解决。然后就可以把值传给`writableStreamDefaultWriter.write()`方法。写入数据之后，调用`writableStreamDefaultWriter.close()`将流关闭：

```jsx
async function* ints() {
  for (let i = 0; i < 5; i++) {
    yield await new Promise(resolve => setTimeout(resolve, 1000, i))
  }
}

const writableStream = new WritableStream({
  write(value) {
    console.log(value)
  },
})

console.log(writableStream.locked) // false
const writableStreamDefaultWriter = writableStream.getWriter()
console.log(writableStream.locked) // true
;(async function () {
  for await (let chunk of ints()) {
    await writableStreamDefaultWriter.ready
    writableStreamDeafult.write(chunk)
  }

  writableStreamDefaultWriter.close()
})()
```

## 转换流

转换流用来组合可读流和可写流。数据块在两个流之间的转换是通过`transform()`方法完成的。下面的代码创建了一个`TransformStream`的实例，通过`transform()`方法将每个值翻倍：

```jsx
async function* ints() {
  for (let i = 0; i < 5; i++) {
    yield await new Promise(resolve => setTimeout(resolve, 1000, i))
  }
}

const { writable, readable } = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk * 2)
  },
})
```

向转换流的组件流（可读流和可写流）传入数据和从中获取数据，与本章前面介绍的方法相同：

```jsx
async function* ints() {
  for (let i = 0; i < 5; i++) {
    yield await new Promise(resolve => setTimeout(resolve, 1000, i))
  }
}

const { writable, readable } = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk * 2)
  },
})

const readableStreamDefaultReader = readable.getReader()
const writableStreamDefaultWriter = writable.getWriter()

// 消费者
;(async function () {
  while (true) {
    const { done, value } = await readableStreamDefaultReader.read()
    if (done) {
      break
    } else {
      console.log(value)
    }
  }
})()
;(async function () {
  for await (let chunk of ints()) {
    await writableStreamDefaultWriter.ready
    writableStreamDefaultWriter.write(chunk)
  }

  writableStreamDefaultWriter.close()
})()
```

## 通过管道连接流

流可以通过管道连接成一串。最常见的用例是使用`pipeThrough()`方法把`ReadableStream`接入`TransformStream`。从内部看，`ReadableStream`先把自己的值传给`TransformStream`内部的`WritableStream`，然后执行转换，接着转换后的值又在新的`ReadableStream`上出现。下面的例子将一个整数的`ReadableStream`传入`TransformStream`，`TransformStream`对每个值做加倍处理。

```jsx
async function* ints() {
  for (let i = 0; i < 5; i++) {
    yield await new Promise(resolve => setTimeout(resolve, 1000, i))
  }
}

const integerStream = new ReadableStream({
  async start(controller) {
    for await (let chunk of ints()) {
      controller.enqueue(chunk)
    }
  }

  controller.close()
})

const doublingStream = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk * 2)
  }
})

// 通过管道连接流
const pipedStream = integerStream.pipeThrough(doublingStream)

// 从连接流的输出获得读取器
const pipedStreamDefaultReader = pipedStream.getReader()

// 消费者
;(async function() {
  while (true) {
    const { done, value } = await pipedStreamDefaultReader.read()

    if (done) {
      break
    } else {
      console.log(value)
    }
  }
})()

// 0
// 2
// 4
// 6
// 8
```

另外使用`pipeTo()`方法也可以将`ReadableStream`连接到`WritableStream`。整个过程与使用`pipeThrough`类似：

```jsx
async function* ints() {
  for (let i = 0; i < 5; i++) {
    yield await new Promise(resolve => setTimeout(resolve, 1000, i))
  }
}

const integerStream = new ReadableStream({
  async start(controller) {
    for await (let chunk of ints()) {
      controller.enqueue(chunk)
    }
    controller.close()
  },
})

const writableStream = new WritableStream({
  write(value) {
    console.log(value)
  },
})

const pipedStream = integerStream.pipeTo(writableStream)
// 0
// 1
// 2
// 3
// 4
```

注意，这里的管道操作隐式地从`ReadableStream`获得了一个读取器，并把产生的值填充到了`WritableStream`。

# 计时 API

页面性能始终是开发者关心的话题。`Performance`接口通过 JavaScript API 暴露了浏览器内部的度量指标，允许开发者直接访问这些信息并基于这些信息实现自己想要的功能。这个接口暴露在`window.performance`对象上。所有与页面相关的指标，包括已经定义和将来会定义的，都会存在于这个对象上。

`Performance`接口由多个 API 构成：

- High Resolution Time API
- Performance Timeline API
- Navigation Timing API
- User Timing API
- Resource Timing API
- Paint Timing API

有关这些规范的更多信息以及新增的性能相关规范，可以关注 W3C 性能工作组的 GitHub 项目页面。

> 浏览器通常支持被废弃的 Level 1 和作为替代的 Level 2。本节尽量介绍 Level2 级规范。

## High Resolution Time API

`Date.now()`方法只适用于日期时间相关操作，而且是不要求计时精度的操作。在下面例子中，函数`foo()`调用前后分别记录了一个时间戳：

```jsx
const t0 = Date.now()
foo()
const t1 = Date.now()

const duration = t1 - t0

console.log(duration)
```

考虑如下`duration`会包含意外值的情况。

- **`duration`是 0**。`Date.now()`只有毫秒级精度，如果`foo()`执行速度够快，两个时间戳的值会相等。
- **`duration`是负值或极大值**。如果在`foo()`执行时，系统十几种被向后或向前调整了（例如切换到夏令时），则捕获的时间戳不会考虑这种情况，因此时间差中会包含这些调整。

为此必须使用不同的计时 API 来精确且准确地度量时间的流逝。High Resolution Time API 定义了`window.performance.now()`，这个方法返回一个精确到微秒（返回值没有限制在一毫秒的精度内，它带有浮点数，因此精度最高可以达到微秒级）的浮点值。因此使用这个方法先后捕获的时间戳更不可能出现想等的情况。而且这个方法可以保证时间戳单调递增。

```jsx
const t0 = performance.now()
const t1 = performance.now()

console.log(t0)
console.log(t1)
```

`performance.now()`计时器采用**相对**度量。这个计时器在执行上下文创建时从 0 开始计时。例如打开页面或创建工作线程时，`performance.now()`就会从 0 开始计时。由于这个计时器在不同上下文中初始化时可能存在时间差，因此不同上下文之间如果没有共享参照点则不可能直接比较`performance.now()`。`performance.timeOrigin`属性返回计时器初始化时全局系统时钟的值。

```jsx
const relativeTimestamp = performance.now()
const absoluteTimestamp = performance.timeOrigin + relativeTimestamp

console.log(relativeTimestamp)
console.log(absoluteTimestamp)
```

> 通过使用`performance.now()`测量 L1 缓存与主存的延迟差，幽灵漏洞可以执行缓存推断攻击。为了弥补这个安全漏洞，所有的主流浏览器有的选择降低`performance.now()`的精度，有的选择在时间戳里面混入一些随机性。
>
> MDN 的描述：这个时间戳实际上并不是高精度的。为了降低像[Spectre](https://spectreattack.com/)这样的安全威胁，各类浏览器对该类型的值做了不同程度上的四舍五入处理。（Firefox 从 Firefox 59 开始四舍五入到 2 毫秒精度）一些浏览器还可能对这个值作稍微的随机化处理。这个值的精度在未来的版本中可能会再次改善；浏览器开发者还在调查这些时间测定攻击和如何更好的缓解这些攻击。

## Performance Timeline API

Performance Timeline API 使用一套用于度量客户端延迟的工具扩展了`Performance`接口。性能度量将会采用计算结束与开始时间差的形式。这些开始和结束时间会被记录为`DOMHighResTimeStamp`值，而封装这个时间戳的对象是`PerformanceEntry`的实例。

浏览器会自动记录各种`PerformanceEntry`对象，而使用`performance.mark()`也可以记录自定义的`PerformanceEntry`对象。在一个执行上下文中被记录的所有性能条目可以通过`performance.getEntries()`获取。

```jsx
console.log(performance.getEntries())
// [PerformanceNavigationTiming, PerformanceResourceTiming, ... ]
```

这个返回的集合代表浏览器的**性能时间线**。每个`PerformanceEntry`对象都有`name`、`entryType`、`startTime`和`duration`属性：

```jsx
const entry = performance.getEntries()[0]

console.log(entry.name)
console.log(entry.entryType)
console.log(entry.startTime)
console.log(entry.duration)
```

不过，`PerformanceEntry`实际上是一个抽象基类。所有记录条目虽然都继承`PerformanceEntry`，但最终还是如下某个具体类的实例：

- `PerformanceMark`
- `PerformanceMeasure`
- `PerformanceFrameTiming`
- `PerformanceNavigationTiming`
- `PerformanceResourceTiming`
- `PerformancePaintTiming`

上面每个类都会增加大量属性，用于描述与相应条目有关的元数据。每个实例的`name`和`entryType`属性会因为各自的类不同而不同。

### User Timing API

User Timing API 用于记录和分析自定义性能条目。如前所述，记录自定义性能条目要使用`performance.mark()`方法：

```javascript
performance.mark('foo')

console.log(performance.getEntriesByType('mark')[0])

// PerformanceMark {
//   name: 'foo',
//   entryType: 'mark',
//   startTime: 259.88000000334,
//   duration: 0
// }
```

在计算开始前和结束后各自创建一个自定义性能条目可以计算时间差。最新的标记(mark)会被推到`getEntriesByType()`返回数组的开始：

```jsx
performance.mark('foo')
for (let i = 0; i < 1e6; i++) {}
performance.mark('bar')

const [endMark, startMark] = performance.getEntriesByType('mark')
console.log(startMark.startTime - endMark.startTime) // 1.329999999123213
```

除了自定义性能条目，还可以生成`PerformanceMeasure`（性能度量）条目，对应由名字作为标识的两个标记之间的持续时间。`PerformanceMeasure`的实例由`performance.measure()`方法生成：

```jsx
performance.mark('foo')
for (let i = 0; i < 1e6; i++) {}
performance.mark('bar')

peformance.measure('baz', 'foo', 'bar')

const [differenceMark] = performance.getEntriesByType('measure')

console.log(differenceMark)

// PerformanceMeasure {
//   name: "baz",
//   entryType: "measure",
//   startTime: 298.9800000214018,
//   duration: 1.349999976810068
// }
```

### Navigation Timing API

Navigation Timing API 提供了高精度时间戳，用于度量当前页面加载速度。浏览器会在导航时间发生时自动记录`PerformanceNavigationTiming`条目。这个对象会捕获大量时间戳，用于描述页面何时以及如何加载的。

下面的例子计算了`loadEventStart`和`loadEventEnd`时间戳之间的差：

```jsx
const [performanceNavigationTimingEntry] =
  performance.getEntriesByType('navigation')

console.log(performanceNavigationTimingEntry)

console.log(
  performanceNavigationTimingEntry.loadEventEnd -
    performanceNavigationTimingEntry.loadEventStart
)
```

### Resource Timing API

Resource Timing API 提供了高精度时间戳，用于度量当前页面加载时请求资源的速度。浏览器会在加载资源时自动记录`PerformanceResourceTiming`。这个对象会捕获大量时间戳，用于描述资源加载的速度。

下面的例子计算了加载一个特定资源花费的时间：

```jsx
const performanceResourceTimingEntry =
  performance.getEntriesByType('resource')[0]

console.log(performanceResourceTimingEntry)

console.log(
  performanceResourceTimingEntry.responseEnd -
    performanceResourceTimingEntry.requestStart
)
```

通过计算并分析不同时间的差，可以更全面地审视浏览器加载页面的过程，发现可能存在的性能瓶颈。

# Web 组件

这里所说的 Web 组件指的是一套用于增强 DOM 行为的工具，包括影子 DOM、自定义元素和 HTML 模版。这一套浏览器 API 特别混乱。

- 并没有统一的“Web Components”规范：每个 Web 组件都在一个不同的规范中定义。
- 有些 Web 组件如影子 DOM 和自定义元素，已经出现了向后不兼容的版本问题。
- 浏览器实现极其不一致。

由于存在这些问题，因此使用 Web 组件通常要引入一个 Web 组件库，例如 Polymer。这种库可以作为腻子脚本，模拟浏览器中缺失的 Web 组件。

## HTML 模版

在 Web 组件之前一直缺少基于 HTML 解析构建 DOM 子树，然后在需要时再把这个子树渲染出来的机制。一种间接方案是使用`innerHTML`把标记字符串转换为 DOM 元素，但这种方式存在严重的安全隐患。另一种方式是使用`document.createElement()`构建每个元素，然后逐个将其添加到孤儿跟节点（不是添加到 DOM），但这样做特别麻烦，完全与标记无关。

相反，更好的方式是提前在页面中写出特殊标记，让浏览器自动将其解析为 DOM 子树，但跳过渲染。这正是 HTML 模版的核心思想，而`<template>`标签正是为这个目的而生的。下面是一个简单的 HTML 模版的例子：

```jsx
<template id="foo">
  <p>I'm inside a template</p>
</template>
```

### 使用`DocumentFragment`

在浏览器中渲染时，上面例子中的文本不会被渲染到页面上。因为`<template>`的内容不属于活动文档，所以`document.querySelector()`等 DOM 查询方法不会发现其中的`<p>`标签。这是因为`<p>`存在于一个包含在 HTML 模板中的`DocumentFragment`节点内。

在浏览器中通过开发者工具检查内容时，可以看到`<template>`中的`DocumentFragment`：

```jsx
<template id="foo">
  #document-fragment
  <p>I'm inside a template</p>
</template>
```

通过`<template>`元素的`content`属性可以取得这个`DocumentFragment`的引用：

```jsx
console.log(document.querySelector('#foo').content) // #document-fragment
```

此时的`DocumentFragment`就像一个对应子树的最小化`document`对象。换句话说，`DocumentFragment`上的 DOM 匹配方法可以查询其子树中的节点：

```jsx
const fragment = document.querySelector('#foo').content

console.log(document.querySelector('p')) // null
console.log(fragment.querySelector('p')) // <p> ... <p>
```

`DocumentFragment`也是批量向 HTML 中添加元素的高效工具。例如想要以最快的方式给某个 HTML 元素添加多个子元素。如果连续调用`document.appendChild()`，则不费事，还会导致多次布局重拍。而使用`DocumentFragment`可以一次性添加所有子节点，最多只会有一次布局重排：

```jsx
const fragment = new DocumentFragment()

const foo = document.querySelector('#foo')

// 为DocumentFragment添加子元素不会导致布局重排
fragment.appendChild(document.createElement('p'))
fragment.appendChild(document.createElement('p'))
fragment.appendChild(document.createElement('p'))

console.log(fragment.children.length) // 3

foo.appendChild(fragment)
console.log(fragment.children.length) // 0
console.log(document.body.innerHTML)
```

### 使用`<template>`标签

注意在前面的例子中，`DocumentFragment`的所有子节点都高效地转移到了`foo`元素上，转移之后`DocumentFragment`变空了。同样的过程也可以使用`<template>`标签重现：

```jsx
const fooElement = document.querySelector('#foo')
const barTemplate = document.querySelector('#bar')
const barFragment = barTemplate.content

console.log(document.body.innerHTML)

fooElement.appendChild(barFragment)

console.log(document.body.innerHTML)
```

如果想要复制模板，可以使用`importNode()`方法克隆`DocumentFragment`：

```jsx
const fooElement = document.querySelector('#foo')
const barTemplate = document.querySelector('#bar')
const barFragment = barTemplate.content

console.log(document.body.innerHTML)

fooElement.appendChild(document.importNode(barFragment, true))

console.log(document.body.innerHTML)
```

### 模板脚本

脚本执行可以推迟到将`DocumentFragment`的内容实际添加到 DOM 树。下面的例子演示了这个过程：

```jsx
const fooElement = document.querySelector('#foo')
const barTemplate = document.querySelector('#bar')
const barFragment = barTemplate.content

console.log('About to add template')
fooElement.appendChild(barFragment)
console.log('Added template')
```

如果新添加的元素需要进行某些初始化，这种延迟执行是有用的。

## 影子 DOM

概念上讲，影子 DOM（shadow DOM）Web 组件相当直观，通过它可以讲一个完整的 DOM 树作为节点添加到父 DOM 树。这样可以实现 DOM 封装，意味着 CSS 样式和 CSS 选择符可以限制在影子 DOM 子树而不是整个顶级 DOM 树中。

影子 DOM 与 HTML 模板很相似，因为它们都是类似`document`的结构，并允许与顶级 DOM 有一定程度的分离。不过影子 DOM 与 HTML 模板还是有区别的，主要表现在影子 DOM 的内容会实际渲染到页面上，而 HTML 模板的内容不会。

### 理解影子 DOM

假设有以下 HTML 标记，其中包含某个类似的 DOM 子树：

```jsx
<div>
  <p>Make me red</p>
</div>
<div>
  <p>Make me blue</p>
</div>
<div>
  <p>Make me green</p>
</div>
```

从其文本节点可以看出，这 3 个子树会分别渲染为不同的颜色。常规情况下，为了给每个子树应用唯一的样式，又不使用`style`属性，就需要给每个子树添加一个唯一的类名，然后通过相应的选择符为它们添加样式：

当然这个方案不是十分理想，因为这跟在全局命名空间中定义变量没有太大区别。尽管知道这些样式和其他地方无关，所有 CSS 样式还是应用到整个 DOM。为此，就要保持 CSS 选择符足够特别，以防止这些样式渗透到其他地方。但这也仅是一个这种的办法而已。理想情况下，应该能够把 CSS 限制在使用它们的 DOM 上：这正是影子 DOM 最初的使用场景。

### 创建影子 DOM

考虑到安全及避免影子 DOM 冲突，并非所有元素都可以包含影子 DOM。尝试给无效元素或者已经有了影子 DOM 的元素添加影子 DOM 会导致抛出错误。影子 DOM 是通过`attachShadow()`方法创建并添加给有效 HTML 元素的。容纳影子 DOM 的元素被称为**影子宿主**（shadow host）。影子 DOM 的根节点被称为**影子根**（shadow root）。

`attachShadow()`方法需要一个`shadowRootInit`对象，返回影子 DOM 的实例。`shadowRootInit`对象必须包含一个`mode`属性，值为`"open"`或`"closed"`。对`"open"`影子 DOM 的引用可以通过`shadowRoot`属性在 HTML 元素上获得，而对`"closed"`影子 DOM 的引用无法这样获取。下面的代码演示了不同`mode`的区别：

```jsx
document.body.innerHTML = `
  <div id="foo"></div>
  <div id="bar"></div>
`

const foo = document.querySelector('#foo')
const bar = document.querySelector('#bar')

const openShadowDOM = foo.attachShadow({ mode: 'open' })
const closedShadowDOM = bar.attachShadow({ mode: 'closed' })

console.log(openShadowDOM) // #shadow-root (open)
console.log(closedShadow) // #shadow-root (closed)

console.log(foo.shadowRoot) // #shadow-root (open)
console.log(bar.shadowRoot) // null
```

一般来说，需要创建保密（closed）影子 DOM 的场景很少。虽然这可以限制通过影子宿主访问影子 DOM，但恶意代码有很多方法绕过这个限制，恢复对影子 DOM 的访问。简言之，**不能**为了安全而创建保密影子 DOM。

> 如果想保护独立的 DOM 树不受未信任代码影响，影子 DOM 并不适合这个需求。对`<iframe>`施加的跨源限制更可靠。

### 使用影子 DOM

将影子 DOM 添加到元素后，可以像使用常规 DOM 一样使用影子 DOM。来看下面的例子：

```javascript
for (const color of ['red', 'green', 'blue']) {
  const div = document.createElement('div')
  const shadowDOM = div.attachShadow({ mode: 'open' })

  document.body.appendChild(div)
  shadowDOM.innerHTML = `
    <p>Make me ${color}</p>
    
    <style>
    p {
      color: ${color}
    }
    </style>
  `
}
```

虽然这里使用相同的选择符应用了 3 种不同的颜色，但每个选择符只会把样式应用到它们所在的影子 DOM 上。为此，3 个`<p>`元素会出现 3 种不同的颜色。

可以这样验证这些元素分别位于其自己的影子 DOM 中：

```javascript
for (const color of ['red', 'green', 'blue']) {
  const div = document.createElement('div')
  const shadowDOM = div.attachShadow({ mode: 'open' })

  document.body.appendChild(div)

  shadowDOM.innerHTML = `
    <p>Make me ${color}</p>
    
    <style>
    p {
      color: ${color};
    }
    </style>
  `
}

function countP(node) {
  console.log(node.querySelectorAll('p').length)
}

countP(document)

for (let element of document.querySelectorAll('div')) {
  countP(element.shadowRoot)
}
```

在浏览器开发者工具可以更清楚地看到影子 DOM。例如前面的例子在检查浏览器窗口时会显示成如下：

```jsx
<body>
  <div>
    #shadow-root (open)
    <p>Make me red!</p>
    <style>
      p {
        color: 'red';
      }
    </style>
  </div>

  <div>
    #shadow-root (open)
    <p>Make me green!</p>
    <style>
      p {
        color: green;
      }
    </style>
  </div>

  <div>
    #shadow-root(open)
    <p>Make me blue!</p>

    <style>
      p {
        color: blue;
      }
    </style>
  </div>
</body>
```

影子 DOM 并非铁板一块。HTML 元素可以在 DOM 树间无限制移动：

```jsx
document.body.innerHTML = `<div></div><p id="foo">Move me</p>`

const divElement = document.querySelector('div')
const pElement = document.querySelector('p')

const shadowDOM = divElement.attachShadow({ mode: 'open' })

// 从父DOM中移除元素
divElement.parentElement.removeChild(pElement)

// 将元素添加到影子DOM
shadowDOM.appendChild(pElement)

// 检查元素是否移动到了影子DOM中
console.log(shadowDOM.innerHTML) // <p id="foo">Move me</p>
```

### 合成与影子 DOM 槽位

影子 DOM 是为自定义 Web 组件设计的，为此需要支持嵌套 DOM 片段。从概念上讲，可以这么说：位于影子宿主中的 HTML 需要一种机制以渲染到影子 DOM 中去，但这些 HTML 又不必属于影子 DOM 树。默认情况下，嵌套内容会隐藏。来看下面的例子，其中的文本在 100ms 后会被隐藏：

```jsx
document.body.innerHTML = `
  <div>
    <p>Foo</p>
  </div>
`

setTimeout(
  () => document.querySelector('div').attachShadow({ mode: 'open' }),
  1000
)
```

影子 DOM 一旦添加到元素中，浏览器就会赋予它最高优先级，优先渲染它的内容而不是原来的文本。在这里例子中由于影子 DOM 是空的，因此`<div>`在 1000ms 后会变成空的。

为了显示文本内容，需要使用`<slot>`标签来指示浏览器在哪里放置原来的 HTML。下面的代码修改了前面的例子，让影子宿主中的文本出现在了影子 DOM 中：

```jsx
document.body.innerHTML = `
  <div id="foo">
    <p>Foo</p>
  </div>
`

document
  .querySelector('div')
  .attachShadow({ mode: 'open' }).innerHTML = `<div id="bar">
    <slot></slot>
  </div>`
```

现在投射进去的内容就会像自己存在于影子 DOM 中一样。检查页面会发现原来的内容实际上替代了`<slot>`：

```jsx
<body>
  <div id="foo">
    #shadow-root (open)
    <div id="bar">
      <p>Foo</p>
    </div>
  </div>
</body>
```

注意，虽然在页面检查窗口中看到内容在影子 DOM 中，但这实际上只是 DOM 内容的**投射**（projection)。实际的元素仍然处于外部 DOM 中。另外除了默认槽位，还可以使用**命名槽位**来实现多个投射。这是通过匹配的`slot/name`属性对实现的。

### 事件重定向

如果影子 DOM 中发生了浏览器事件（例如`click`），那么浏览器需要一种方式以让父 DOM 处理事件。不过实现也需要考虑到影子 DOM 的边界。为此事件会逃出影子 DOM 并经过**事件重定向**在外部被处理。逃出后，事件就好像是由影子宿主本身而非真正的包装元素触发的一样。下面的代码演示了这个过程：

```jsx
// 创建一个元素作为影子宿主
document.body.innerHTML = `
  <div onclick="console.log('handled outside:', event.target)"></div>
`

// 添加影子DOM并向其中插入HTML
document.querySelector('div').attachShadow({ mode: 'open' }).innerHTML = `
  <button onclick="console.log('handled inside:', event.target)">Foo</button>
`
```

注意事件重定向只会发生在影子 DOM 中实际存在的元素上。使用`<slot>`标签从外部投射进来的元素不会发生事件重定向，因为从技术上讲，这些元素仍然处于影子 DOM 外部。

## 自定义元素

如果你使用 JavaScript 框架，那么很可能熟悉自定义元素的概念。这是因为所有主流框架都以某种形式提供了这个特性。自定义元素为 HTML 元素引入了面向对象编程的风格。基于这种风格，可以创建自定义的、复杂的和可重用的元素，而且只要使用简单的 HTML 标签就可以创建相应的实例。

### 创建自定义元素

浏览器会尝试无法识别的元素所谓通用元素整合进 DOM。当然，这些元素默认也不会做任何通过 HTML 元素不能做的事。来看下面的例子，其中胡乱编的 HTML 标签会变成一个`HTMLElment`实例：

```jsx
document.body.innerHTML = `
  <x-foo>I'm inside a nonsense element.</x-foo>
`

console.log(document.querySelector('x-foo') instanceof HTMLElement) // true
```

自定义元素在此基础上更进一步。利用自定义元素，可以在`<x-foo>`标签出现时为它定义复杂的行为，同样也可以在 DOM 中将其纳入元素生命周期管理。自定义元素要使用全局属性`customElements`，这个属性会返回`CustomElementRegistry`对象。

调用`customElements.define()`方法可以创建自定义元素。下面的代码创建了一个简单的自定义元素，这个元素继承`HTMLElement`：

```jsx
class FooElement extends HTMLElement {}
customElements.define('x-foo', FooElement)

document.body.innerHTML = `
  <x-foo>I'm inside a nonsense element.</x-foo>
`

console.log(document.querySelector('x-foo') instanceof FooElement) // true
```

> 注意自定义元素名必须至少包含一个不在名称开头和末尾的连字符，而且元素标签不能自关闭。

自定义元素的威力源自类定义。例如可以通过调用自定义元素的构造函数来控制这个类在 DOM 中每个实例的行为：

```jsx
class FooElement extends HTMLElement {
  constructor() {
    super()
    console.log('x-foo')
  }
}
customElements.define('x-foo', FooElement)

document.body.innerHTML = `
  <x-foo></x-foo>
  <x-foo></x-foo>
`

// x-foo
// x-foo
```

> 注意在自定义元素的构造函数中必须始终调用`super()`。如果元素继承了`HTMLElement`或相似类型而不会覆盖构造函数，则没有必要调用`super()`，因为原型构造函数默认会做这件事。很少有创建自定义元素而不继承`HTMLElement`的。

如果自定义元素继承了一个元素类，那么可以使用`is`属性和`extends`选项将标签指定为该自定义元素的实例：

```jsx
class FooElement extends HTMLDivElement {
  constructor() {
    super()
    console.log('x-foo')
  }
}
customElements.define('x-foo', FooElement, { extends: 'div' })

document.body.innerHTML = `
  <div is="x-foo"></div>
  <div is="x-foo"></div>
`

// x-foo
// x-foo
```

### 添加 Web 组件内容

因为每次将自定义元素添加到 DOM 中都会调用其类构造函数，所以很容易自动给自定义元素添加子 DOM 内容。虽然不能在构造函数添加子 DOM（会抛出`DOMException`），但可以为自定义元素添加影子 DOM 并将内容添加到这个影子 DOM 中：

```jsx
class FooElement extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })

    this.shadowRoot.innerHTML = `
      <p>I'm inside a custom element!</p>
    `
  }
}

customElements.define('x-foo', FooElement)

document.body.innerHTML += `<x-foo></x-foo>`

// <body>
// <x-foo>
//   #shadow-root (open)
//     <p>I'm inside a custom elemnt!</p>
// </x-foo>
// </body>
```

为避免字符串模版和`innerHTML`不干净，可以使用 HTML 模板和`document.createElement()`重构这个例子：

```jsx
// 初始的HTML
// <template id="x-foo-tpl">
//   <p>I'm inside a custom element template!</p>
// </template>

const template = document.querySelector('#x-foo-tpl')

class FooElement extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

customElements.define('x-foo', FooElement)
document.body.innerHTML += `<x-foo></x-foo>`
```

这样可以在自定义元素中实现高度的 HTML 和代码重用，以及 DOM 封装。使用这种模式能够自由创建可重用的组件而不必担心外部 CSS 污染组件的样式。

### 使用自定义元素生命周期方法

可以在自定义元素的不同生命周期执行代码。带有相应名称的自定义元素的实例方法会在不同生命周期阶段被调用。自定义元素有以下 5 个生命周期方法。

- `constructor()`：在创建元素实例或将已有 DOM 元素升级为自定义元素时调用。
- `connectedCallback()`：在每次将这个自定义元素实例添加到 DOM 中时调用。
- `disconnectedCallback()`：在每次将这个自定义元素实例从 DOM 中移除时调用。
- `attributeChangedCallback()`：在每次**可观察属性**的值发生变化时调用。在元素实例初始化时，初始值的定义也算一次变化。
- `adoptedCallback()`：在通过`document.adoptNode()`将这个自定义元素实例移动到新文档对象时调用。

下面的例子演示了这些构建、连接和断开连接的回调：

```jsx
class FooElement extends HTMLElement {
  constructor() {
    super()
    console.log('ctor')
  }

  connectedCallback() {
    console.log('connected')
  }

  disconnectedCallback() {
    console.log('disconnected')
  }
}

customElements.define('x-foo', FooElement)

const fooElement = document.createElement('x-foo')
// ctor

document.body.appendChild(fooElement)
// connected

document.body.removeChild(fooElement)
// disconnected
```

### 反射自定义元素属性

自定义元素既是 DOM 实体又是 JavaScript 对象，因此两者之间应该同步变化。换句话说对 DOM 的修改应该反映到 JavaScript 对象，反之亦然。要从 JavaScript 对象反射到 DOM，常见的方式是使用获取函数和设置函数。下面的例子演示了在 JavaScript 对象和 DOM 之间反射`bar`属性的过程：

```jsx
document.body.innerHTML = `<x-foo></x-foo>`

class FooElement extends HTMLElement {
  constructor() {
    super()
    this.bar = true
  }

  get bar() {
    return this.getAttribute('bar')
  }

  set bar(value) {
    this.setAttribute('bar', value)
  }
}
customFields.define('x-foo', FooElement)

console.log(document.body.innerHTML)
// <x-foo bar="true"></x-foo>
```

另一个方向的反射（从 DOM 到 JavaScript 对象）需要给相应的属性添加监听器。为此可以使用`observedAttributes()`获取函数让自定义元素的属性值每次改变时都调用`attributeChangedCallback()`：

```jsx
class FooElement extends HTMLElement {
  static get observedAttributes() {
    return ['bar']
  }

  get bar() {
    return this.getAttribute('bar')
  }

  set bar(value) {
    this.setAttribute('bar', value)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      console.log(`${oldValue} -> ${newValue}`)
      this[name] = newValue
    }
  }
}

customElements.define('x-foo', FooElement)

document.body.innerHTML = `<x-foo bar="false"></x-foo>`
// null -> false

document.querySelector('x-foo')
// false -> true
```

### 升级自定义元素

并非始终可以先定义自定义元素，然后再在 DOM 中使用相应的元素标签。为解决这个先后次序问题，Web 组件在`CustomElementRegistry`上额外暴露了一些方法。这些方法可以用来检测自定义元素是否定义完成，然后可以用它来升级已有元素。

如果自定义元素已经有定义，那么`CustomElementRegistry.get()`方法会返回相应自定义元素的类。类似地，`CustomElementRegistry.whenDefined()`方法会返回一个期约，当相应自定义元素有定义之后解决：

```jsx
customElements.whenDefined('x-foo').then(() => console.log('defined!'))

console.log(customElements.get('x-foo'))
// undefined

customElements.define('x-foo', class {})
// defined!

console.log(customElements.get('x-foo'))
// class FooElement {}
```

连接到 DOM 的元素在自定义元素有定义时会**自动升级**。如果想要在元素连接到 DOM 之前强制升级，可以使用`CustomElementRegistry.upgrade()`方法：

```jsx
const fooElement = document.createElement('x-foo')

class FooElement extends HTMLElement {}
customElements.define('x-foo', FooElement)

console.log(fooElement instanceof FooElement) // false

customElements.upgrate(fooElement) // 强制升级

console.log(fooElement instanceof FooElement) // true
```

# 小结

除了定义新标签，HTML5还定义了一些JavaScript API。这些API可以为开发者提供更便捷的Web接口，暴露堪比桌面应用的能力。

- Atomics API用于保护代码在多线程内存访问模式下不发生资源争用。
- `postMessage()`API支持从不同源跨文档发送消息，同时保证安全和遵循同源策略。
- Encoding API用于实现字符串与缓冲区之间的无缝转换。
- File API提供了发送、接收和读取大型二进制对象的可靠工具。
- 媒体元素`<audio>`和`<video>`拥有自己的API，用于操作音频和视频。并不是每个浏览器都会支持所有媒体格式，使用`canPlayType()`方法可以检测浏览器支持情况。
- 拖放API支持方便地将元素标识为可拖动，并在操作系统完成放置时给出回应。可以利用它创建自定义可拖动元素和放置目标
- Notifications API提供了一种浏览器中立的方式，以此向用户展示消息通知弹层。
- Streams API支持以全新方式读取、写入和处理数据。
- Timing API支持以全新方式读取、写入和处理数据。
- Web Components API为元素重用和封装技术向前迈进提供了有力支撑。
