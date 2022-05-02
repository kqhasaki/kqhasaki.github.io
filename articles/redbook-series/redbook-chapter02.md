---
title: （二）HTML中的JavaScript
date: 2022-01-09
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h0xw0fsbufj20jg0bo0td.jpg
---

将 JavaScript 引入网页，首先要解决它与网页主导语言 HTML 的关系问题。在 JavaScript 早期，网景公司的工作人员希望在将 JavaScript 引入 HTML 页面的同时，不会导致页面在其他浏览器中渲染出问题。通过反复试错和讨论，他们最终做出了一些决定，并达成了向网页中引入通用脚本能力的共识。当初他们的很多工作得到了保留，并且最终形成了 HTML 规范。

# `<script>`元素

将 JavaScript 插入 HTML 的主要方法是使用`<script>`元素。这个元素是由网景公司创造出来，并最早在 Netscape Navigator 2 中实现的。后来这个元素被正式添加到 HTML 规范。`<script>`元素有下列 8 个属性：

- `async`：可选。表示应该立即开始下载脚本，但不能阻止其他页面动作，例如下载资源或等待其他脚本加载。只对外部脚本文件有效。
- `charset`：可选。使用`src`属性指定的代码字符集。这个属性很少使用，因为大多数浏览器不在乎它的值。
- `crossorigin`：可选。配置相关相关请求的 CORS 设置。默认不使用 CORS。`crossorigin="anonymous"`配置文件请求不必设置凭据标志。`crossorigin="use-credentials"`设置凭据标志，意味着出站请求会包含凭据。
- `defer`：可选。表示脚本可以延迟到文档完全被解析和显示之后再执行。只对外部脚本文件有效。
- `integrity`：可选。允许比对接收到的资源和指定的加密签名来验证子资源完整性（SRI，Subresource Integrity）。如果接收到的资源的签名与这个属性指定的签名不匹配，则页面会报错。脚本不会执行。这个属性可以用于确保内容分发网络（CDN，Content Delivery Network）不会提供恶意内容。
- `language`：废弃。最初用于表示代码快中的脚本语言（如`"JavaScript"`、`"JavaScript1.2"`、`"VBScript"`）。大多数浏览器都会忽略这个属性，不应该再使用它。
- `src`：可选。表示包含要执行的代码的外部文件。
- `type`：可选。代理`language`，表示代码块中脚本语言的内容类型（也称 MIME 类型）。按照惯例，这个值始终都是`"text/javascript"`，尽管`"text/javascript"`和`"text/ecmascript"`都已经废弃了。JavaScript 文件的 MIME 类型通常是`"application/x-javascript"`，不过给`"type"`属性这个值有可能导致脚本被忽略。在非 IE 浏览器中有效的其他值还有`"application/javascript"`和`application/ecmascript`。如果这个值是`module`，则代码会被当成 ES6 模块，而且只有这时候，代码中才能出现`import`和`export`关键字。

使用`<script>`的方式有两种：通过它直接在网页中嵌入 JavaScript 代码，以及通过它在网页中包含外部 JavaScript 文件。

要嵌入行内 JavaScript 代码，直接把代码放在`<script>`元素中就行：

```html
<script>
  function sayHi() {
    console.log('Hi!')
  }
</script>
```

包含在`<script>`标签内的代码会被从上倒下解释。在上面的例子中，被解释的是一个函数定义，并且该函数会被保存在解释器环境中。在`<script>`元素中的代码被计算完成之前，页面的其余内容不会被加载，也不会被显示。

在使用行内 JavaScript 代码时，要注意代码中不能出现字符串`</script>`，需要转义`/`字符才行。

要包含外部文件中的 JavaScript 就必须使用`src`属性。这个属性的值是一个 URL，指向包含 JavaScript 代码的文件。例如：

```html
<script src="example.js"></script>
```

这个例子在页面中加载了一个名为 example.js 的外部文件。文件本身只需要包含放在`<script>`的起始及结束标签中间的 JavaScript 代码。与解释行内 JavaScript 一样，在解释外部 JavaScript 文件时，页面也会阻塞。（阻塞时间也包含下载文件的时间。）

> 按照惯例，外部 JavaScript 文件的扩展名是.js。实际上这并不是必须的，因为浏览器不会检查所包含 JavaScript 文件的扩展名。这就为使用服务器端脚本语言动态生成 JavaScript 代码或在浏览器中将 JavaScript 扩展语言（如 TypeScript，JSX）转义为 JavaScript 代码提供了可能性。不过要注意，服务器经常会根据文件扩展来确定响应的正确 MIME 类型。

另外，使用了`src`属性的`<script`元素不应该再在标签内部包含其他 JavaScript 代码。如果两者都提供的话，浏览器只会下载并执行脚本文件，忽略行内的代码。

`<script>`元素一个最为强大、同时也备受争议的特性是，它可以包含来自外部域的 JavaScript 文件。根`<img>`元素很像，`<script>`元素的`src`属性可以是一个完整的 URL，而且这个 URL 指向的资源可以跟包含它的 HTML 页面不在同一个域中。

```html
<script src="http://www.somewhere.com/afile.js"></script>
```

浏览器在解析这个资源时，会向`src`属性指定的路径发送一个 GET 请求，以取得相应资源，假定是一个 JavaScript 文件。这个初始的请求不受浏览器同源策略限制，但返回并被执行的 JavaScript 则受限制。当然，这个请求仍然受父页面 HTTP/HTTPS 协议的限制。

来自外部域的代码会被当成加载它的页面的一部分来加载和解释。这个能力可以让我们通过不同的域分发 JavaScript。不过，引用了放在别人服务器上的 JavaScript 文件要格外小心，因为恶意的程序员随时可能替换这个文件。在包含外部域的 JavaScript 文件时，要确保该域是自己所有的，或者该域是一个可信的来源。`<script>`标签的`integrity`属性是防范这种问题的一个武器，但这个属性也不是所有浏览器都支持。

不管包含的是什么代码，浏览器都会按照`<script>`在页面中出现的顺序依次解释它们，前提是它们没有使用`defer`和`async`属性。第二个`<script>`元素的代码必须在第一个`<script>`元素的代码解释完毕才能开始解释，第三个则必须等第二个解释完，以此类推。

## 标签位置

过去，所有的`<script>`元素都被放在页面的`<head>`标签内，如下面的例子所示：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>demo page</title>
    <script src="example1.js"></script>
    <script src="example2.js"></script>
  </head>

  <body>
    <!-- 页面内容 -->
  </body>
</html>
```

这种做法的主要目的是把外部的 CSS 和 JavaScript 文件都集中放到一起。不过，把所有 JavaScript 文件都放在`<head>`里，也就意味着必须把所有的 JavaScript 代码都下载、解析和执行完成后，才能开始渲染页面（页面在浏览器解析到`<body>`的起始标签时开始渲染）。对于需要很多 JavaScript 的页面，这会导致页面渲染的明显延迟，在此期间浏览器窗口完全空白。为解决这个问题，现代 Web 应用程序通常将所有 JavaScript 引用放在`<body>`元素中的页面内容后面。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>demo page</title>
  </head>

  <body>
    <!-- 页面内容 -->
    <script src="example1.js"></script>
    <script src="example2.js"></script>
  </body>
</html>
```

这样一来，页面会在加载 JavaScript 代码之前解析初始的 HTML 文件。用户会感觉页面加载更快了，因为浏览器显示空白页面的时间更短了。

> 注意，书中原文“这样一来，页面会在处理 JavaScript 代码之前完全渲染页面。用户会感觉页面加载更快了，因为浏 览器显示空白页面的时间短了”，这里是有错误的，放在`<body>`标签底部的`<script>`文件在被解析到时就立即加载，`<script>`标签如果没有`defer`或`async`属性，都会阻塞渲染。
>
> 浏览器获取了 HTML 文件后，就会立即开始解析，解析过程是根据 HTML 文档构建 DOM 和 CSSOM 的过程，之后才能进入渲染阶段，完成 UI 的绘制。在解析 HTML 时，遇到非阻塞资源例如图片或 css 文件时，浏览器回请求这些文件，但解析器不会被阻塞，而`<script>`标签会默认阻塞解析器。

## 推迟执行脚本

HTML4.01 就为`<script>`元素定义了一个叫`defer`的属性。这个属性表示脚本在执行的时候不会改变页面的结构。也就是说，脚本会被延迟到整个页面都解析完毕后再运行。因此，在`<script>`元素上设置`defer`属性，相当于告诉浏览器立即下载，但延迟执行。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>demo page</title>
    <script defer src="example1.js"></script>
    <script defer src="example2.js"></script>
  </head>

  <body>
    <!-- 页面内容 -->
  </body>
</html>
```

虽然这个例子中`<script>`元素包含在`<head>`中，但它们会在浏览器解析到结束的`</html>`标签后才会执行。HTML5 规范要求脚本应该按照它们出现的顺序执行，因此第一个推迟的脚本应该在第二个推迟的脚本之前执行，并且两者都会在`DOMContentLoaded`事件（这个事件会在 DOM 树构建完成后立即触发，不用等待图片、JavaScript 文件、CSS 文件或其他资源加载完成）之前执行。不过在实际中，推迟执行的脚本不一定总会按顺序执行或在`DOMContentLoaded`事件之前执行，因此最好只包含一个这样的脚本。

如前所述，`defer`属性只对外部脚本文件才有效。这是 HTML5 中明确规定的，因此支持 HTML5 的浏览器会忽略行内脚本的`defer`属性。一般来说，为了兼容更多浏览器，最好还是把要推迟执行的脚本放在页面底部。

## 异步执行脚本

HTML5 为`<script>`元素定义了`async`属性。从改变脚本处理方式上看，`async`属性与`defer`类似。当然，它们两者也都只适用于外部脚本，都会告诉浏览器立即开始下载。不过，与`defer`不同的是，标记为`async`的脚本并不保证能按照它们出现的次序执行。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>demo page</title>
    <script async src="example1.js"></script>
    <script async src="example2.js"></script>
  </head>

  <body>
    <!-- 页面内容 -->
  </body>
</html>
```

在这个例子中，第二个脚本可能先于第一个脚本执行。因此重点在于它们之间没有依赖关系。给脚本添加`async`的目的是告诉浏览器，不必等脚本下载和执行完之后再加载页面，同样也不必等到该异步脚本下载和执行后再添加其他脚本。正因如此，异步脚本不应该再加载期间修改 DOM。

异步脚本保证会在页面的`load`事件前执行，但可能会在`DOMContentLoaded`之前或之后。

## 动态加载脚本

除了`<script>`标签，还有其他方式可以加载脚本。因为 JavaScript 可以使用 DOM API，所以通过向 DOM 中动态添加`script`元素同样可以加载指定的脚本。只要创建一个`script`元素并将其添加到 DOM 即可。

```jsx
const script = document.createElement('script')
script.src = 'gibberish.js'
document.head.appendChild(script)
```

当然，在把`HTMLElement`元素添加到 DOM 且执行到这段代码之前不会发送请求。默认情况下，以这种方式创建的`<script>`元素是以异步方式加载的，相当于添加了`async`属性。不过这样做可能有问题，因为所有浏览器都支持`createElement()`方法，但不是所有浏览器都支持`async`属性。因此要统一动态脚本的加载行为，可以明确将其设置为同步加载。

```jsx
const script = document.createElement('script')
script.src = 'gibberish.js'
script.async = false
document.head.appendChild(script)
```

以这种方式获取的资源对浏览器预加载器是不可见的。这回严重影响它们在资源获取队列中的优先级。根据应用程序的工作方式以及怎么使用，这种方式可能会严重影响性能。要想让预加载器知道这些动态请求文件的存在，可以在文档头部显式声明它们。

```html
<link rel="preload" href="gibberish.js" />
```

# 行内代码与外部文件

虽然可以直接在 HTML 中嵌入 JavaScript 代码，但是公认的推荐实践是尽可能将 JavaScript 代码放在外部文件中。不过这个最佳实践并不是明确的强制性规则。推荐使用外部文件的理由如下：

- **可维护性**。JavaScript 代码如果分散到很多 HTML 页面，会导致维护困难。而用一个目录保存所有的 JavaScript 文件，则容易维护，这样开发者就可以独立使用它们的 HTML 页面来编辑代码。
- **缓存**。浏览器会根据特定的设置缓存所有外部链接的 JavaScript 文件，这意味着如果两个页面都用到同一个文件，该文件就只需要下载一次。这最终意味着页面加载更快。

在配置浏览器请求外部文件时，要重点考虑的一点是它们会占用多少带宽。在 SPDY/HTTP2 中，预请求的消耗已显著降低。以轻量、独立 JavaScript 组件形式向客户端送达脚本更具优势。

例如，第一个页面包含如下脚本：

```html
<script src="mainA.js"></script>
<script src="component1.js"></script>
<script src="component2.js"></script>
<script src="component3.js"></script>
```

后续页面可能包含如下脚本：

```html
<script src="mainB.js"></script>
<script src="component3.js"></script>
<script src="component4.js"></script>
<script src="component5.js"></script>
```

在初次请求时，如果浏览器支持 SPDY/HTTP2 就可以同从一个地方取得一批文件，并将它们逐个放到浏览器缓存中。从浏览器角度看，通过 SPDY/HTTP2 获取所有这些独立的资源与获取一个大的 JavaScript 文件的延迟差不多。

在第二个页面请求时，由于已经把应用程序切割成了轻量可缓存的文件，第二个页面也依赖的某些组件此时已经存在于浏览器中了。

当然，这里假设浏览器支持 SPDY/HTTP2，只有比较新的浏览器才满足。如果还想支持那些比较老的浏览器，可能还是使用一个大文件较为合适。

# 文档模式

IE5.5 发明了文档模式的概念，即可以使用`doctype`切换文档模式。最初的文档模式有两种：**混杂模式**（quirks mode）和**标准模式**（standards mode）。前者让 IE 像 IE5 一样，支持一些非标准的特性，后者让 IE 具有兼容标准的行为。虽然这两种模式的主要区别只体现在通过 CSS 渲染的内容方面，但对 JavaScript 也有一些关联影响，或称为副作用。本书会经常提到这些副作用。

IE 初次支持切换文档模式后，其他浏览器也跟着实现了。随着浏览器的普遍实现，又出现了**准标准模式**（almost standards mode）。这种模式下的浏览器支持很多标准的特性，但是没有标准规定的那么严格。

> 在 HTML 中，文档类型的声明是必要的。在所有的文档头部时，都会看到一个`"<!DOCTYPE html>"`的身影。这个声明的目的是防止浏览器在渲染文档时，切换到”混杂模式“（也叫怪异模式、兼容模式）的渲染模式。`"<!DOCTYPE html>"`确保浏览器按照最佳的相关规范进行渲染，而不是使用一个不符合规范的渲染模式。

# `<noscript>`元素

针对早期浏览器不支持 JavaScript 的问题，需要一个优雅的降级方案。最终，`<noscript>`元素出现，被用于给不支持 JavaScript 的浏览器提供替代内容。虽然如今的浏览器已经完全支持 JavaScript，但是有时候用户会处于安全考虑禁用 JavaScript，此时这个元素仍然有用。

`<noscript>`元素可以包含任何可以出现在`<body>`中的 HTML 元素，`<script>`除外。在下列两种情况下，浏览器将显示`<noscript>`中的内容：

- 浏览器不支持脚本
- 浏览器对脚本的支持被关闭

任何一个条件被满足，包含在`<noscript>`中的内容就会被渲染。否则，浏览器不会渲染`<noscript>`中的内容。

# 小结

JavaScript 是通过`<script>`元素插入到 HTML 页面中的。这个元素可以用于把 JavaScript 代码嵌入到 HTML 页面中，跟其他标记混合在一起，也可以用于保存在外部文件中的 JavaScript。

- 要包含外部 JavaScript 文件，必须将`src`属性设置为要包含文件的 URL。文件可以跟网页同源也可以不同源。
- 所有`<script>`元素会依照它们在网页中出现的次序被解释。在不使用`defer`和`async`属性的情况下，包含在`<script>`元素中的代码必须严格按次序解释。
- 对于不推迟执行的脚本，浏览器必须解释完位于`<script>`元素中的代码，然后才能继续渲染页面的剩余部分。为此，通常应该把`<script>`元素放到页面末尾，介于主内容之后及`</body>`标签之前。
- 可以使用`defer`属性将脚本推迟到文档解析完毕之后再执行。推迟的脚本原则上按照它们被列出的次序执行。
- 可以使用`async`属性表示脚本不需要等待其他脚本，同时也不阻塞文档渲染，即异步加载。异步脚本不能保证按照它们在页面中出现的顺序执行。
- 通过使用`<noscript>`元素，可以指定在浏览器不支持脚本时显示的内容。如果浏览器支持并启用脚本，则`<noscript>`元素中的任何内容都不会被渲染。

