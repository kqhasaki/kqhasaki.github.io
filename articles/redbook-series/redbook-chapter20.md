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
  const info = ""
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
  
  reader.onerror = function() {
    output.innerHTML = 'Could not read file, error code is ' + reader.error.code
  }
  
  reader.onprogress = function(event) {
    if (event.lengthComputable) {
      progress.innerHTML = `${event.loaded}/${event.total}`
    }
  }
  
  reader.onload = function() {
    let html = ''
    
    switch(type) {
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

以上代码从表单字段中读取一个文件，并将其内容显示在了网页上。如果文件的MIME类型表示它是一个图片，那么就将其读取后保存为数据URL，在`load`事件触发时将数据URI作为图片插入页面中。如果文件不是图片，则读取后将其保存为文本并原样输出到网页上。`progress`事件用于跟踪和显示读取文件的进度，而`error`事件用于监控错误。

如果想提前结束文件读取，则可以在过程中调用`abort()`方法，从而触发`abort`事件。在`load`、`error`和`abort`事件触发后，还会触发`loadend`事件。`loadend`事件表示在上述3种情况下，所有读取操作都已结束。`readAsText()`和`readAsDataURL()`方法已经得到了所有主流浏览器支持。

## `FileReaderSync`类型

顾名思义，`FileReaderSync`类型就是`FileReader`的**同步版本**。这个类型拥有与`FileReader`相同的方法，只有在整个文件都加载到内存之后才会继续执行。`FileReaderSync`只在工作线程中可用，因为如果读取整个文件耗时太长则会影响全局。

假设通过`postMessage()`向工作线程发送了一个`File`对象。以下代码会让工作线程同步将文件读取到内存中，然后将文件的数据URL发送回来。

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

Blob表示**二进制大对象**(binary large object)，是JavaScript对不可修改二进制数据的封装类型。包含字符串的数组、`ArrayBuffers`、`ArrayBufferViews`，甚至其他`Blob`都可以用来创建blob。`Blob`构造函数可以接受一个`options`参数，并在其中指定MIME类型：

```javascript
console.log(new Blob(['foo']))
// Blob {size: 3, type: ''}

console.log(new Blob(['{"a", "b"}'], { type: 'application/json' }))
// {size: 10, type: "application/json"}

console.log(new Blob(['<p>Foo</p>', '<p>Bar</p>'], { type: 'text/html' }))
// {size: 20, type: 'text/html'}
```

`Blob`对象有一个`size`属性和一个`type`属性，还有一个`slice()`方法用于进一步切分数据。另外也可以使用`FileReader`从`Blob`中读取数据。下面的例子只会读取文件的前32字节：

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
    
    reader.onerror = function() {
      output.innerHTML = 'Could not read file, error code is ' + reader.error.code
    }
    
    reader.onload = function() {
      output.innerHTML = reader.result
    }
  } else {
    console.log('You browser does not support slice()')
  }
})
```

只读取部分文件可以节省时间，特别是只需要数据特定部分例如文件头部。

## 对象URL和`Blob`

对象URL有时候也称为Blob URL，是指引用存储在`File`或`Blob`中数据的URL。对象URL的优点是不用把文件内容读取到JavaScript也可以使用文件。只要在适当位置提供对象URL即可。要创建对象URL，可以使用`window.URL.createObjectURL()`方法并传入`File`或`Blob`对象。这个函数返回的值是一个指向内存中地址的字符串。因为这个字符串是URL，所以可以在DOM中直接使用。例如下面的代码使用对象URL在页面中显示了一张图片：

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

如果把对象URL直接放到`<img>`标签，就不要把数据预先读取到JavaScript中了。`<img>`标签可以直接从相应的内存位置把数据读取到页面上。

使用完数据后，最好能释放与之关联的内存。只要对象URL在使用中，就不能释放内存。如果想表明不再使用某个对象URL，则可以将其传给`window.URL.revokeObjectURL()`。页面卸载时，所有对象URL占用的内存都会被释放。不过，最好在不使用时就会立即释放内存，以便尽可能保持页面占用最少资源。

## 读取拖放文件

组合使用HTML5拖放API和File API可以创建读取文件信息的有趣功能。在页面上创建放置目标后，可以从桌面上把文件拖动并放到放置目标。这样会像拖放图片或链接一样触发`drop`事件。被放置的文件可以通过事件的`event.dataTransfer.files`属性读取到，这个属性保存着一组`File`对象，就像文本输入字段一样。

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

随着嵌入音频和视频元素在Web应用上的流行，大多数内容提供商会强迫使用Flash以便达到最佳的跨浏览器兼容性。HTML5新增了两个与媒体相关的元素，即`<audio>`和`<video>`，从而为浏览器提供了嵌入音频和视频的统一解决方案。

这两个元素既支持Web开发者在页面中嵌入媒体文件，也支持JavaScript实现对媒体的自定义控制。以下是它们的用法：

```jsx
<!-- 嵌入视频 --> 
<video src="conference.mpg" id="myVideo">Video player not available.</video>
<!-- 嵌入音频 --> 
<audio src="song.mp3" id="myAudio">Audio player not available.</audio>
```

每个元素至少要求有一个`src`属性，以表示要加载的媒体文件。我们也可以指定表示视频播放器大小的`width`和`height`属性，以及在视屏加载期间显示图片URI的`poster`属性。另外，`controls`属性如果存在，则表示浏览器应该显示播放界面，让用户可以直接控制媒体。**开始和结束标签之间的内容是在媒体播放器不可用时显示的替代内容**。

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

`<video>`和`<audio>`元素提供了稳健的JavaScript接口。这两个元素有很多共有属性，可以用于确定媒体的当前状态。

## 事件

除了有很多属性，媒体元素还有很多事件。这些事件会监控由于媒体回放或用户交互导致的不同属性的变化。这些事件被设计得尽可能具体，以便Web开发者能够使用较少的HTML和JavaScript创建自定义的音频/视频播放器（而不是创建新Flash影片）。

## 自定义媒体播放器

使用`<audio>`和`<video>`的`play()`和`pause()`方法，可以手动控制媒体文件的播放。综合使用属性、事件和这些方法，可以方便地创建自定义的媒体播放器。例如下面例子：

```jsx
<div class="mediaplayer">
  <div class="video">
    <video id="player" src="movie.mov" poster="mymovie.jpg" width="300" height="200">
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

这里的JavaScript代码简单地为按钮添加了事件处理程序，可以根据当前状态播放和暂停视频。此外，还给`<video>`元素的`load`事件添加了事件处理程序，以便显示视频的时长。最后重复的计时器用于更新当前时间。通过监听更多事件以及使用更多属性，可以进一步扩展这个自定义的视频播放器。同样的代码也可以用于`<audio>`元素以创建自定义的音频播放器。

## 检测编解码器

如前所述，并不是所有浏览器都支持`<video>`和`<audio>`的所有编解码器，这通常意味着必须提供多个媒体源。为此，也有JavaScript API可以用来检测浏览器是否支持给定格式和编解码器。这两个媒体元素都有一个名为`canPlayType()`的方法，改方法接收一个格式/编解码器字符串，返回一个字符串值：`"probably"`、`"maybe"`或`""`（空字符串），其中空字符串就是假值，意味着可以在`if`语句中像这样使用`canPlayType()`:

```javascript
if (audio.canPlayType('audio/mpeg')) {
  // 执行某些操作
}
```

`"probably"`和`"maybe"`都是真值，在`if`语句的上下文中可以转型为`true`。

在只给`canPlayType()`提供一个MIME类型的情况下，最可能返回的值是`"maybe"`和空字符串。这是因为文件实际上只是一个包装音频和视频数据的容器，而真正决定文件是否可以播放的是编码。在同时提供MIME类型和编解码器的情况下，返回值的可能性会提高到`probably`。

## 音频类型

`<audio>`元素还有一个名为`Audio`的原生JavaScript构造函数，支持在任何时候播放音频。`Audio`类型和`Image`类似，都是DOM元素的对等体，只是不需插入文档即可工作。要通过`Audio`播放音频，只需创建一个新实例并传入音频源文件：

```jsx
const audio = new Audio('sound.mp3')
EventUtil.addHandler(audio, 'canplaythrough', function(event) {
  audio.play()
})
```

创建`Audio`的新实例就会下载指定的文件。下载完毕之后，可以调用`play()`来播放音频。在iOS中调用`play()`方法会弹出一个对话框，请求用户授权播放声音。为了连续播放，必须在`onfinish`事件处理程序中立即调用`play()`。

# 原生拖放

IE4最早在网页中为JavaScript引入了对拖放功能的支持。当时，网页中只有两样东西可以触发拖放：图片和文本。拖动图片就是简单地在图片上按住鼠标不放然后移动鼠标。而对于文本，必须先选中，然后再以同样的方式拖动。在IE4中唯一有效的放置目标是文本框。IE5扩展了拖放能力，添加了新的事件，让网页中几乎一切都可以成为放置目标。IE5.5又进一步，允许几乎一切都可以拖动（IE6也支持）。**HTML5在IE的拖放实现基础上标准化了拖放功能。**所有主流浏览器都根据HTML5规范实现了原生的拖放。

关于拖放最有意思的可能就是可以跨窗格、跨浏览器容器，有时候甚至可以跨应用程序拖动元素。浏览器对拖放的支持可以让我们实现这些功能。

## 拖放事件

拖放事件几乎可以让开发者控制拖放操作的方方面面。关键的部分是确定每个事件是在哪里触发的。有的事件在被拖放元素上触发，有的事件则在放置目标上触发。在某个元素被拖动时，会（按顺序）触发以下事件：

- `dragstart`
- `drag`
- `dragend`

在按住鼠标键不放并开始移动鼠标的那一刻，被拖动元素上触发`dragstart`事件。此时光标会变成非放置符号，表示元素不能放到自身上。拖动开始时，可以在`ondragstart`事件处理程序中通过JavaScript执行某些操作。

`dragstart`事件触发后，只要目标还被拖动就会持续触发`drag`事件。这个事件类似于`mousemove`，即随着鼠标移动而不断触发。当拖动停止时（把元素放到有效或无效的放置目标上），会触发`dragend`事件。

所有这3个事件的目标都是被拖动的元素。默认情况下，浏览器在拖动开始后不会改变被拖动元素的外观，因此是否改变外观由你来决定。不过，大多数浏览器此时会创建元素的一个半透明副本，始终跟随在光标下方。在把元素拖动到一个有效的放置目标上，会依次触发以下事件：

- `dragenter`
- `dragover`
- `dragleave`或者`drop`

只要一把元素拖动到放置目标上，`dragenter`事件（类似于`mouseover`事件）就会触发。`dragenter`事件触发之后，会立即触发`dragover`事件，并且元素在放置目标范围内被拖动期间此事件会持续触发。当元素被拖动到放置目标之外时，`dragover`事件停止触发，`dragleave`事件触发（类似于`mouseout`事件）。如果被拖动元素被放到了目标上，则会触发`drop`事件而不是`dragleave`事件。这些事件的目的是放置目标元素。

## 自定义放置目标

在把某个元素拖动到无效放置目标上时，会看到一个特殊光标表示不能放下。即使所有元素都支持放置目标事件，这些元素默认是不允许放置的。如果把元素拖动到不允许放置的目标上，无论用户动作是什么都不会触发`drop`事件。不过，通过覆盖`dragenter`和`dragover`事件的默认行为，可以把任何元素转换为有效的放置目标。例如，如果有一个ID为`"droptarget"`的`<div>`元素，那么可以使用以下代码把它转换成一个放置目标：

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

在Firefox中，放置事件的默认行为是导航到放在放置目标上的URL。这意味着把图片拖动到放置目标上导致页面导航到图片文件，把文本拖动到放置目标上会导致无效URL错误。为阻止这个行为，在Firefox中必须取消`drop`事件的默认行为：

```jsx
droptarget.addEventListener('drop', event => {
  event.preventDefault()
})
```

## `dataTransfer`对象

除非数据受影响，否则简单的拖放并没有实际意义。为实现拖动操作中的数据传输，IE5在`event`对象上暴露了`dataTransfer`对象，用于从被拖动元素向放置目标传递字符串数据。因为这个对象是`event`的属性，所以在拖放事件的事件处理程序外部无法访问`dataTransfer`。在事件处理程序内部，可以使用这个对象的属性和方法实现拖放功能。`dataTransfer`对象的标准化现在已经纳入了HTML5草案。

`dataTransfer`对象有两个主要方法：`getData()`和`setData()`。顾名思义，`getData()`用来获取`setData()`存储的值。`setData()`的第一个参数以及`getData()`的唯一参数是一个字符串，表示要设置的数据类型：`"text"`或`"URL"`。

```jsx
event.dataTransfer.setData('text', 'some text')
const text = event.dataTransfer.getData('text')

event.dataTransfer.setData('URL', 'http://www.wrox.com')
const url = event.dataTransfer.getData('URL')
```

虽然这两种数据类型是IE最初引入的，但HTML5已经将其扩展为允许任何MIME类型。为向后兼容，HTML5还会继续支持`"text"`和`"URL"`，但是它们会分别映射到`"text/plain"`和`"text/uri-list"`。

`dataTransfer`对象实际上可以包含每种MIME类型的一个值，也就是说可以同时保存文本和URL，两者不会相互覆盖。存储在`dataTransfer`对象中的数据只能在放置事件中读取。如果没有在`ondrop`事件处理程序中取得这些数据，`dataTransfer`对象就会被销毁，数据也会丢失。

在从文本框拖动图片时，浏览器会调用`setData()`并把URL存储起来。当数据被放置在目标上时，可以使用`getData()`获取这些数据。当然，可以在`dragstart`事件中手动调用`setData()`存储自定义数据，以便将来使用。

作为文本的数据和作为URL的数据有一个区别。当把数据作为文本存储时，数据不会被特殊对待。而当把数据作为URL存储，数据会被作为网页中的一个链接，意味着如果把它放到另一个浏览器窗口，浏览器会导航到该URL。

## `dropEffect`和`effectAllowed`

`dataTransfer`对象不仅可以用于实现简单的数据传输，还可以用于确定能够对被拖动元素和放置目标执行什么操作。为此可以使用两个属性：`dropEffect`和`effectAllowed`。

`dropEffect`属性可以告诉浏览器允许哪种放置行为。这个属性有以下4种可能的值。

- `"none"`：被拖动元素不能放到这里。这是除文本框之外所有元素的默认值。
- `"move"`：被拖动元素应该移动到放置目标。
- `"copy"`：被拖动元素应该复制到放置目标。
- `"link"`：表示放置目标会导航到被拖动元素（仅在它是URL的情况下）。

在把元素拖动到放置目标上，上述每种值都会导致显示一种不同的光标。不过，是否导致光标示意的动作还要取决于开发者。换句话说，如果没有代码参与，就不会有什么自动移动、复制或链接。唯一不用考虑的就是光标自己会变。为了使用`dropEffect`属性，必须在放置目标的`ondragenter`事件处理程序中设置它。

除非同时设置`effectAllowed`，否则`dropEffect`属性也没有用。`effectAllowed`属性表示对被拖动元素是否允许`dropEffect`。

## 可拖动能力

默认情况下，图片、链接和文本是可拖动的，这意味着无须额外代码用户便可以拖动它们。文本只有在被选中后才可以拖动，而图片和链接在任意时候都是可以拖动的。

我们可以让其他元素变得可拖动。HTML5在所有HTML元素上规定了一个`draggable`属性，表示元素是否可以拖动。图片和链接的`draggable`属性自动被设置为`true`，而其他所有此属性的默认值为`false`。如果想让其他元素可以拖动，或者不允许图片和链接被拖动，都可以设置这个属性。例如：

```html
<!-- 禁止拖动图片 -->
<img src="simle.gif" draggable="false" alt="Smiley face" />
<!-- 让元素可以拖动 -->
<div draggable="true">...</div>
```

## 其他成员

HTML5规范还为`dataTransfer`对象定义了下列方法。

- `addElement(element)`：为拖动操作添加元素。这纯粹是为了传输数据，不会影响拖动操作的外观。在本书写作时，还没有浏览器实现这个方法。
- `clearData(format)`：清除以特定格式存储的数据。
- `setDragImage(element, x, y)`：允许指定拖动发生时显示在光标下面的图片。这个方法接收3个参数：要显示的HTML元素以及光标位置的图片上的x和y坐标。这里的HTML元素可以时一张图片，此时显示图片；也可以是其他任何元素，此时显示渲染后的元素。
- `types`：当前存储的数据类型列表。这个集合类似数组，以字符串形式保存数据类型，例如`"text"`。

# Notifications API

