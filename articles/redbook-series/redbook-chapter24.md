---
title: 红宝书系列（二十四）网络请求与远程资源
date: 2022-04-05
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h0z7nmxobmj20sg0hnmxd.jpg
---

2005 年，Jesse James Garrett 撰写了一篇文章，“Ajax——A New Approach to Web Applications”。这篇文章中描绘了一个被他称作 Ajax（Asynchronous JavaScript + XML，即异步 JavaScript 加 XML）的技术。这个技术涉及发送服务器请求额外数据而不刷新页面，从而实现更好的用户体验。Garrett 解释了这个技术怎样改变自 Web 诞生以来一直延续的传统单击等待模式。

将 Ajax 推到历史舞台上的关键技术是`XMLHttpRequest`（XHR）对象。这个对象最早由微软发明，然后被其他浏览器所借鉴。在 XHR 出现以前，Ajax 风格的通信不许通过一些黑科技实现，主要是使用隐藏的窗格或者内嵌窗格。XHR 为发送服务器请求和获取响应提供了合理的接口。这个接口可以实现异步从服务器获取额外数据，意味着用户点击不用页面刷新也可以获取数据。通过 XHR 对象获取数据后，可以使用 DOM 方法将数据插入网页。虽然 Ajax 这个名字中包含 XML，但实际上 Ajax 通信与数据格式无关。这个技术主要是可以实现在不刷新页面的情况下从服务器获取数据，格式并不一定是 XML。

实际上，Garrett 所称的这种 Ajax 技术已经出现很长时间了。在 Garrett 的那篇文章之前，一般称这种技术为**远程脚本**。这种浏览器与服务器的通信早在 1998 年就通过不同方式实现了。最初 JavaScript 对服务器的请求可以通过中介（例如 Java 小程序或 Flash 影片）来发送。后来 XHR 对象又为开发者提供了原生的浏览器通信能力，减少了实现这个目的的工作量。

XHR 对象的 API 被普遍认为比较难用，而 Fetch API 自从诞生以后就迅速成为了 XHR 更现代的替代标准。Fetch API 支持期约和服务线程，已经成为极其强大的 Web 开发工具。

> 本章会全面介绍`XMLHttpRequest`，但它实际上是过时的 Web 规范的产物，应该只在旧版本浏览器中使用。实际开发中应该尽可能使用`fetch()`。

# `XMLHttpRequest`对象

IE5 是第一个引入 XHR 对象的浏览器。这个对象是通过 ActiveX 对象实现并包含在 MSXML 库中的。为此，XHR 对象的 3 个版本在浏览器中分别被暴露为`MSXML2.XMLHttp`、`MSXML2.XMLHttp.3.0`和`MSXL2.XHMLHttp.6.0`。

所有现代浏览器都通过`XHMLHttpRequest`构造函数原生支持 XHR 对象：

```jsx
let xhr = new XMLHttpRequest()
```

## 使用 XHR

使用 XHR 对象首先要调用`open()`方法，这个方法接收 3 个参数：请求类型（`"get"`、`"post"`等）、请求 URL，以及表示请求是否异步的布尔值。下面是一个例子：

```jsx
xhr.open('get', 'example.php', false)
```

这行代码就可以向 example.php 发送一个同步的 GET 请求。关于这行代码需要说明几点。首先这里的 URL 是相对于代码所在页面的，当然也可以使用绝对 URL。其次，调用`open()`不会实际发送请求，只是为发送请求做好准备。

> 只能访问同源 URL，也就是域名相同、端口相同、协议相同。如果请求的 URL 与发送请求的页面在任何方面有所不同，则会抛出安全错误。

要发送定义好的请求，必须像下面这样调用`send()`方法：

```javascript
xhr.open('get', 'example.txt', false)
xhr.send(null)
```

`send()`方法接收一个参数，是作为请求体发送的数据。如果不需要发送请求体，则必须传`null`，因为这个参数在某些浏览器中是必须的。调用`send()`之后，请求就会发送到服务器。

因为这个请求是同步的，所以 JavaScript 代码会等待服务器响应之后再继续执行。收到响应后，XHR 对象的以下属性会被填充上数据。

- `responseText`：作为响应体返回的文本。
- `responseXML`：如果响应的内容类型是`"text/xml"`或`"application/xml"`，那就是包含响应数据的 XML DOM 文档。
- `status`：响应的 HTTP 状态。
- `statusText`：响应的 HTTP 状态描述。

收到响应后，第一步要检查`status`属性以确保响应成功返回。一般来说，HTTP 状态码 2xx 表示成功。此时，`responseText`或`responseXML`（如果内容类型正确）属性中会有内容。如果 HTTP 状态码是 304，则表示资源未修改过，是从浏览器缓存中直接拿取的。当然这也意味着响应有效。为确保收到正确的响应，应该检查这些状态，如下所示：

```jsx
xhr.open('get', 'example.txt', false)
xhr.send(null)

if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
  alert(xhr.responseText)
} else {
  alert('Request was unsuccessful: ' + xhr.status)
}
```

以上代码可能显示服务器返回的内容，也可能是显示错误消息，取决于 HTTP 响应的状态码。未确定下一步该执行什么操作，最好检查`status`而不是`statusText`属性，因为后者已经被证明在跨浏览器的情况下不可靠。无论是什么响应内容类型，`responseText`属性始终会保存响应体，而`responseXML`则对于非 XML 数据是`null`。

虽然可以像前面的例子一样发送同步请求，但多数情况下最好使用异步请求，这样可以不阻塞 JavaScript 代码继续执行。XHR 对象有一个`readyState`属性，表示当前处在请求/响应过程的哪个阶段。这个属性可能有以下的值：

- 0：未初始化。尚未调用`open()`方法。
- 1：已打开。已经调用了`open()`方法，尚未调用`send()`方法。
- 2：已发送。已调用`send()`方法，尚未收到响应。
- 3：接受中。已经收到部分响应。
- 4：完成。已经收到所有响应，可以使用了。

每次`readyState`从一个值变成另一个值，都会触发`readyStateChange`事件。可以借此机会检查`readyState`的值。一般来说，我们唯一关心的`readyState`的值是 4，表示数据已经就绪。为保证跨浏览器兼容，`onreadystatechange`事件处理程序应该在调用`open()`之前赋值。来看下面的例子：

```jsx
const xhr = new XMLHttpRequest()
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
      alert(xhr.responseText)
    } else {
      alert('Request was unsuccessful: ' + xhr.status)
    }
  }
}

xhr.open('get', 'example.txt', true)
xhr.send(null)
```

以上代码使用 DOM Level 0 风格为 XHR 对象添加了事件处理程序，因为并不是所有浏览器都支持 DOM Level 2 风格。与其他事件处理程序不同，`onreadystatechange`事件处理程序不会收到`event`对象。在事件处理程序中，必须使用 XHR 对象本身来确定接下来该做什么。

> 由于`onreadystatechange`事件处理程序作用域问题，这个例子在`onreadystatechange`事件处理程序中使用了`xhr`对象而不是`this`对象。使用`this`可能导致功能失败或错误，取决于用户使用的是什么浏览器。因此还是使用保存 XHR 对象的变量更保险一些。

在收到响应之前如果想要取消异步请求，可以调用`abort()`方法：

```jsx
xhr.abort()
```

调用这个方法后，XHR 对象会停止触发事件，并阻止访问这个对象上任何与响应相关的属性。中断请求后，应该取消对 XHR 对象的引用。由于内存问题，不推荐重用 XHR 对象。

## HTTP 头部

每个 HTTP 请求和响应都会携带一些头部字段，这些字段可能对开发者有用。XHR 对象会通过一些方法暴露与请求和响应相关的头部字段。默认情况下，XHR 请求会发送以下头部字段：

- `Accept`：浏览器可以处理的内容类型。
- `Accept-Charset`：浏览器可以显示的字符集。
- `Accept-Encoding`：浏览器可以处理的压缩编码类型。
- `Accept-Language`：浏览器使用的语言。
- `Connection`：浏览器与服务器的连接类型。
- `Cookie`：页面中设置的 Cookie。
- `Host`：发送请求的页面所在的域。
- `Referer`：发送请求的页面 URI。注意，这个字段在 HTTP 规范中就拼错了，所以考虑到兼容性问题也必须将错就错。（正确的拼写应该是 Referrer。）
- `User-Agent`：浏览器的用户代理字符串。

虽然不同浏览器发送的确切头部字段可能各不相同，但这些通常都是会发送的。如果需要发送额外的请求头部，可以使用`setRequestHeader`方法。这个方法接收两个参数：头部字段的名称和值。为保证请求头部被发送，必须在`open()`之后、`send()`之前调用`setRequestHeader()`，如下面例子所示：

```jsx
const xhr = new XMLHttpRequest()
xhr.onreadystatechange = function () {
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
    alert(xhr.responseText)
  } else {
    alert('Request was unsuccessful: ' + xhr.status)
  }
}

xhr.open('get', 'exmaple.php', true)
xhr.setRequestHeader('MyHeader', 'MyValue')
xhr.send(null)
```

服务器通过读取自定义头部可以确定适当的操作。自定义头部一定要区别于浏览器正常发送的头部，否则就可能影响服务器正常响应。有些浏览器允许重写默认头部，有些浏览器则不允许。

可以使用`getResponseHeader()`方法从 XHR 对象获取响应头部，只要传入要求获取头部的名称即可。如果想取得所有响应头部，可以使用`getAllResponseHeaders()`方法，这个方法会返回包含所有响应头部的字符串。下面是调用这两个方法的例子：

```jsx
const myHeader = xhr.getResponseHeader('MyHeader')
const allHeaders = xhr.getAllResponseHeaders()
```

服务器可以使用头部向浏览器传递额外的结构化数据。`getAllResponseHeaders()`方法通常返回类似如下的字符串：

```text
Date: Sun, 14 Nov 2022 18:04:03 GMT
Server: Apache/1.3.29 (Unix)
Vary: Accept
X-Powered-By: PHP/4.3.8
Connection: close
Content-Type: text/html; charset=iso-8859-1
```

通过解析以上头部字段的输出，就可以知道服务器发送的所有头部，而不需要单独去检查了。

## GET 请求

最常用的请求方法是 GET 请求，用于向服务器查询某些信息。必要时需要在 GET 请求的 URL 后面添加查询字符串参数。对于 XHR 而言，查询字符串必须正确编码后添加到 URL 后面，然后再传给`open()`方法。

发送 GET 请求最常见的一个错误是查询字符串格式不对。查询字符串中的每个名和值都必须使用`encodeURIComponent()`编码，所有名/值对必须以**和号**（&）分隔，例如：

```jsx
xhr.open('get', 'example.php?name1=value1&name2=value2', true)
```

可以使用以下函数将查询字符串参数添加到现有的 URL 末尾：

```jsx
function addURLParam(url, name, value) {
  url += url.indexOf('?') === -1 ? '?' : '&'
  url += encodeURIComponent(name) + '=' + encodeURIComponent(value)
  return url
}
```

可以用这个函数构建请求 URL，例如：

```jsx
const url = 'example.php'

url = addURLParam(url, 'name', 'Nicholas')
url = addUrlParam(url, 'book', 'Professional JavaScript')

xhr.open('get', url, false)
```

这里使用`addURLParam()`函数可以保证通过 XHR 发送请求的 URL 格式正确。

## POST 请求

第二个最常见的请求是 POST 请求，用于向服务器发送应该保存的数据。每个 POST 请求都应该在请求体中携带提交的数据，而 GET 请求则不然。POST 请求的请求体可以包含非常多的数据，而且数据可以是任意格式。要初始化 POST 请求，`open()`方法的第一个参数要传`"post"`，例如：

```jsx
xhr.open('post', 'example.php', true)
```

接下来就是要给`send()`方法传入要发送的数据。因为 XHR 最初主要设计用于发送 XML，所以可以传入序列化之后的 XML DOM 文档作为请求体，当然也可以传入任意字符串。

默认情况下，对于服务器而言，POST 请求与提交表单是不一样的。服务器逻辑需要读取原始 POST 数据才能取得浏览器发送的数据。不过可以使用 XHR 模拟表单提交。为此第一步需要把`Content-Type`头部设置为`"application/x-www-formurlencoded"`，这是提交表单时使用的内容类型。第二步是创建对应格式的字符串。POST 数据此时使用与查询字符串相同的格式。如果网页中确实有一个表单需要序列化并通过 XHR 发送到服务器，可以使用特定的序列化函数来创建相应的字符串。

```jsx
function submitData() {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        alert(xhr.responseText)
      } else {
        alert('Request was un successful: ' + xhr.status)
      }
    }
  }

  xhr.open('post', 'postexample.php', true)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  const form = document.getElementById('user-info')
  xhr.send(serialize(form))
}
```

在这个函数中，来自 ID 为`"user-info"`的表单数中的数据被序列化之后发送给了服务器。

> POST 请求相比 GET 请求要占用更多资源。从性能方面来说，发送相同数量的数据，GET 请求要比 POST 请求快两倍。

## XMLHttpRequest Level 2

XHR 对象作为事实标准的迅速流行，也促使 W3C 为规范这一行为而制定了正式标准。XMLHttpRequest Level 1 只是把已经存在的 XHR 对象的实现细节明确了一下。XMLHttpRequest Level 2 又进一步发展了 XHR 对象。并非所有的浏览器都实现了 XMLHttpRequest Level 2 的所有部分，但所有浏览器都实现了其中部分功能。

### `FormData`类型

现代 Web 应用程序中经常需要对表单数据进行序列化，因此 XMLHttpRequest Level 2 新增了`FormData`类型。`FormData`类型便于表单序列化，也便于创建与表单类似格式的数据然后通过 XHR 发送。下面的代码创建了一个`FormData`对象，并填充了一些数据：

```jsx
const data = new FormData()
data.append('name', 'Nicholas')
```

`append()`方法接收两个参数：键和值，相当于表单字段名称和该字段的值。可以像这样添加任意多个键/值对数据。此外，通过直接给`FormData`构造函数传入一个表单元素，也可以将表单中的数据作为键/值对填充进去：

```jsx
const data = new FormData(document.forms[0])
```

有了`FormData`实例，可以像下面这样直接传给 XHR 对象的`send()`方法：

```jsx
const xhr =  new XMLHttpRequest()
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
      alert(xhr.responseText)
    } else {
      alert('Request was unsuccessful: ' + xhr.status)
    }
  }
}

xhr.open('post', 'postexample.php', true)
const form = document.getElementById('user-info')
xhr.send(nwe FormData(form))
```

使用`FormData`的另一个方便之处是不再需要给 XHR 对象显式设置任何请求头部了。XHR 对象能够识别作为`FormData`实例传入的数据类型并自动配置相应的头部。

### 超时

IE8 给 XHR 对象增加了一个`timeout`属性，用于表示发送请求后等待多少毫秒，如果响应不成功就中断请求。之后所有的浏览器都在自己的 XHR 实现中增加了这个属性。在给`timeout`属性设置了一个事件且在该时间之后没有收到响应时，XHR 对象就会触发`timeout`事件，调用`ontimeout`事件处理程序。这个特性后来也被添加到了 XMLHttpRequest Level 2 规范。看下面的例子：

```jsx
const xhr = new XMLHttpRequest()
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    try {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        alert(xhr.responseText)
      } else {
        alert('Request was unsuccessful: ' + xhr.status)
      }
    } catch (ex) {
      // 假设由ontimeout处理
    }
  }
}

xhr.open('get', 'timeout.php', true)
xhr.ontimeout = function () {
  alert('Request did not return in a second')
}
xhr.send(null)
```

这个例子演示了使用`timeout`设置超时。给`timeout`设置 1000 毫秒意味着，如果请求没有在 1 秒钟内返回则会中断。此时触发`ontimeout`事件处理程序，`readyState`仍然会变成 4，因此也会调用`onreadystatechange`事件处理程序。不过如果在超时之后访问`status`属性则会发生错误。因此为了做好防护，可以把检查`status`属性的代码封装在`try/catch`语句中。

### `overrideMimeType()`方法

Firefox 首选引入了`overrideMimeType()`方法用于重写 XHR 响应的 MIME 类型。这个特性后来也被添加到 XMLHttpRequest Level 2.因为响应返回的 MIME 类型决定了 XHR 对象如何处理响应，所以如果有办法覆盖服务器返回的类型，那么是有帮助的。

假设服务器实际发送了 XML 数据，但响应头部设置的 MIME 类型是`text/plain`。结果就会导致虽然数据是 XML，但`responseXML`属性值是`null`。此时调用`overrideMimeType()`可以保证将响应当成 XML 而不是纯文本来处理。

```jsx
const xhr = new XMLHttpRequest()
xhr.open('get', 'text.php', true)
xhr.overrideMimeType('text/xml')
xhr.send(null)
```

这个例子强制让 XHR 把响应当成 XML 而不是纯文本来处理。为了正确覆盖响应的 MIME 类型，必须在调用`send()`之前调用`overrideMimeType()`。

# 进度事件

Progress Events 是 W3C 的工作草案，定义了客户端—服务器端通信。这些事件最初只针对 XHR，现在也推广到了其他类似的 API。有以下 6 个进度相关的事件。

`loadstart`：在接收到响应的第一个字节时触发。

`progress`：在接收响应期间反复触发。

`error`：在请求出错时触发。

`abort`：在调用`abort()`终止连接时触发。

`load`：在成功接收完响应时触发。

`loadend`：在通信完成时，且在`error`、`abort`或`load`之后触发。

每次请求都会首先触发`loadstart`事件，之后是一个或者多个`progress`事件，接着是`error`、`abort`或`load`中的一个，最后以`loadend`事件结束。这些事件大部分都很好理解，但其中有两个需要说明一下。

## `load`事件

Firefox 最初在实现 XHR 的时候，曾致力于简化交互模式。最终，增加了一个`load`事件用于替代`readystatechange`事件。`load`事件在响应接收完成之后立即触发，这样就不用检查`readyState`属性了。`onload`事件处理程序会收到一个`event`对象，其`target`属性设置为 XHR 实例，在这个实例上可以访问所有的 XHR 对象属性和方法。不过并不是所有浏览器都实现了这个事件的`event`对象。考虑到跨浏览器兼容，还是需要像下面这样使用 XHR 对象变量：

```jsx
const xhr = new XMLHttpRequest()
xhr.onload = function () {
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
    alert(xhr.responseText)
  } else {
    alert('Request was unsuccessful: ' + xhr.status)
  }
}

xhr.open('get', 'altevent.php', true)
xhr.send(null)
```

只要是从服务器接收到响应，无论状态码是什么，都会触发`load`事件。这意味着还需要检查`status`属性才能确定数据是否有效。Firefox、Opera、Chrome 和 Safari 都支持`load`事件。

## `progress`事件

Mozilla 在 XHR 对象上另一个创新是`progress`事件，在浏览器接收数据期间，这个事件反复触发。每次触发时，`onprogress`事件处理程序都会收到`event`对象，其`target`属性是 XHR 对象，且包含 3 个额外属性：`lengthComputable`、`position`和`totalSize`。其中`lengthComputable`是一个布尔值，表示进度信息是否可用：`position`是接收到的字节数；`totalSize`是响应的`Content-Length`头部定义的总字节数。有了这些信息，就可以给用户提供进度条了。以下代码演示了如何向用户展示进度：

```jsx
const xhr = new XMLHttpRequest()
xhr.onload = function () {
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
    alert(xhr.responseText)
  } else {
    alert('Request was unsuccessful: ' + xhr.status)
  }
}

xhr.onprogress = function (event) {
  const divStatus = document.getElementById('status')
  if (event.lengthComputable) {
    divStatus.innerHTML = `Received ${event.position} of ${event.totalSize} bytes.`
  }
}

xhr.open('get', 'altevents.php', true)
xhr.send(null)
```

为了保证正确执行，必须在调用`open()`之前添加`onprogress`事件处理程序。在前面的例子中，每次触发`progress`事件都会更新 HTML 元素中的信息。假设响应有`Content-Length`头部，就可以利用这些信息计算出已经收到响应的百分比。

# 跨源资源共享

通过 XHR 进行 Ajax 通信的一个主要限制是跨源安全策略。默认情况下，XHR 只能访问与发起请求的页面在同一个域内的资源。这个安全限制可以防止某些恶意行为。不过浏览器也需要支持合法跨源访问的能力。

跨源资源共享（CORS，Cross-Origin Resource Sharing）定义了浏览器与服务器如何实现跨源通信。CORS 背后的基本思路就是使用自定义的 HTTP 头部允许浏览器和服务器互相了解，以确认请求或响应应该成功还是失败。

对于简单的请求，例如 GET 或 POST 请求，没有自定义头部，而且请求体是`text/plain`类型，这样的请求在发送时会有一个额外的头部叫`Origin`。`Origin`头部包含发送请求的页面的源（协议、域名和端口），以便服务器确定是否为其提供响应。下面是`Origin`头部的一个实例：

```
Origin: http://www.nczonline.net
```

如果服务器决定响应请求，那么应该发送`Access-Control-Allow-Origin`头部，包含相同的源；或者如果资源是公开的，那么就包含`"*"`。例如：

```
Access-Control-Allow-Origin: http://www.nczonline.net
```

如果没有这个头部，或者有但源不匹配，则表明不会响应浏览器请求。否则，服务器就会处理这个请求。注意，无论请求还是响应都不会包含 cookie 信息。

现代浏览器通过`XMLHttpRequest`对象原生支持 CORS。在尝试访问不同资源时，这个行为会被自动触发。要向不同域的源发送请求，可以使用标准 XHR 对象并给`open()`方法传入一个绝对 URL，例如：

```jsx
const xhr = new XMLHttpRequest()
xhr.onload = function () {
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
    alert(xhr.responseText)
  } else {
    alert('Request was unsuccessful: ' + xhr.status)
  }
}

xhr.open('get', 'http://www.somewhere-else.com/page', true)
xhr.send(null)
```

跨域 XHR 对象允许访问`status`和`statusText`属性，也允许同步请求。处于安全考虑，跨域 XHR 对象也施加了一些额外限制。

- 不能使用`setRequestHeader()`设置自定义头部。
- 不能发送和接收 cookie。
- `getAllResponseHeaders()`方法始终返回空字符串。

因为无论同域还是跨域请求都使用同一个接口，所以最好在访问本地资源时使用相对 URL，在访问远程资源时使用绝对 URL。这样可以明确区分使用场景，同时避免出现访问本地资源时出现头部或 cookie 信息访问受限的问题。

## 预检请求

CORS 通过一种叫**预检请求**（preflighted request）的服务器验证机制，允许使用自定义头部、除 GET 和 POST 之外的方法，以及不同请求体内容类型。在要发送涉及上述某种高级选项的请求时，会先向服务器发送一个“预检”请求。这个请求使用 OPTIONS 方法发送并包含以下头部：

- `Origin`：与简单请求相同。
- `Access-Control-Request-Medhod`：请求希望使用的方法。
- `Access-Control-Request-Headers`：（可选）要使用的逗号分隔的自定义头部列表。

下面是一个假设的 POST 请求，包含自定义的`NCZ`头部：

```
Origin: http://www.nczonline.net
Access-Control-Request-Method: POST
Access-Control-Request-Headers: NCZ
```

在这个请求发送后，服务器可以确定是否允许这种类型的请求。服务器会通过在响应中发送如下头部与浏览器沟通这些信息：

- `Access-Control-Allow-Origin`：与简单请求相同。
- `Access-Control-Allow-Methods`：允许的方法（逗号分隔的列表）。
- `Access-Control-Allow-Headers`：服务器允许的头部（逗号分隔的列表）。
- `Access-Control-Max-Age`：缓存预检请求的秒数。

例如：

```
Access-Control-Allow-Origin: http://www.nczonline.net
Access-Control-Allow-Methods: POST, GET
Access-Control-Allow-Headers: NCZ
Access-Control-Max-Age: 1728000
```

预检请求返回后，结果会按响应指定的时间缓存一段时间。换句话说，只有第一次发送这种类型的请求时才会多发送一次额外的 HTTP 请求。

## 凭据请求

默认情况下，跨源请求不提供凭据（cookie、HTTP 认证和客户端 SSL 证书）。可以通过将`withCredentials`属性设置为`true`来表明会发送凭据。如果服务器允许带凭据的请求，那么可以在响应中包含如下 HTTP 头部：

```
Access-Control-Allow-Credentials: true
```

如果发送了凭据请求而服务器返回的响应中没有这个头部，则浏览器不会把响应交给 JavaScript（`responseText`是空字符串，`status`是 0，`onerror()`被调用）。注意服务器也可以在预检请求的响应中发送这个 HTTP 头部，以表明这个源允许发送凭据请求。

# 替代性跨源技术

CORS 出现之前，实现跨源 Ajax 通信是有点麻烦的。开发这需要依赖能够执行跨源请求的 DOM 特性，在不使用 XHR 对象的情况下发送某种类型的请求。虽然 CORS 目前已经得到了广泛支持，但这些技术仍然没有过时，因为它们不需要修改服务器。

## 图片探测

图片探测是利用`<img>`标签实现跨域通信的最早的一种技术。**任何页面都可以跨域加载图片而不必担心限制**，因此这也是在线广告跟踪的主要方式。可以动态创建图片，然后通过它们的`onload`和`onerror`事件处理程序得知何时收到响应。

这种动态创建图片的技术经常用于**图片探测**（image pings）。图片探测是与服务器之间简单、跨域、单向的通信。数据通过查询字符串发送，响应可以随意设置，不过一般是位图图片或者值为 204 的状态码。浏览器通过图片探测拿不到任何数据，但是可以通过监听`onload`和`onerror`事件知道什么时候能收到响应。下面看一个例子：

```jsx
const img = new Image()
img.onload = img.onerror = function () {
  alert('Done!')
}
img.src = 'http://www.example.com/test?name=Nicholas'
```

这个例子创建了一个新的`Image`实例，然后为它的`onload`和`onerror`事件处理程序添加了同一个函数。这样可以确保请求完成时无论什么响应都会收到通知。设置完`src`属性之后请求就开始了，这个例子向服务器发送了一个`name`值。

图片探测频繁用于跟踪用户在页面上的点击操作或动态显示广告。当然图片探测的缺点是只能发送 GET 请求并无法获取服务器响应的内容。这也是只能利用图片探测实现浏览器与服务器单向通信的原因。

## JSONP

JSONP 是“JSON with padding”的简写，是在 Web 服务上流行的一种 JSON 变体。JSONP 看起来跟 JSON 一样，只是会被包在一个函数调用里，例如：

```jsx
callback({ name: 'Nicholas' })
```

JSONP 格式包括两个部分：回调和数据。回调是在页面接收到响应之后应该调用的函数，通常回调函数的名称是通过请求来动态指定的。而数据就是作为参数传给回调函数的 JSON 数据。下面是一个典型的 JSONP 请求：

```
http://freegeoip.net/json/?callback=handleResponse
```

这个 JSONP 请求的 URL 是一个地理位置服务。JSONP 服务通常以查询字符串形式指定回调函数的名称。例如这个例子就把回调函数的名字指定为`handleResponse()`。

JSONP 调用是通过动态创建`<script>`元素并为`src`属性指定跨域 URL 实现的。此时的`<script>`与`<img>`元素类似，能够不受限制地从其他域加载资源。因为 JSONP 是有效的 JavaScript，所以 JSONP 响应在被加载完成之后会立即执行。例如下面这个例子：

```jsx
function handleResponse(response) {
  console.log(`
    You're at IP address ${response.ip}, which is in 
    ${response.city}, ${response.region_name}
  `)
}

const script = document.createElement('script')
script.src = 'http://freegeoip.net/json/?callback=handleResponse'
document.body.insertBefore(script, document.body.firstChild)
```

这个例子会显示从地理位置服务获取的 IP 地址以及位置信息。

JSONP 由于其简单易用，在开发者中非常流行。相比于图片探测，使用 JSONP 可以直接访问响应，实现浏览器与服务器的双向通信。不过 JSONP 也有一些缺点。

首先，JSONP 是从不同的域拉取可执行代码。如果这个域不可信，则可能在响应中加入恶意内容。此时除了完全删除 JSONP 没有其他办法。在使用不受控的 Web 服务时一定要保证是可以信任的。

第二个缺点是不好确定 JSONP 请求是否失败。虽然 HTML5 规定了`<script>`元素的`onerror`事件处理程序，但还没有被任何浏览器实现。为此，开发者经常使用计时器来决定是否放弃等待响应。这种方式并不准确，毕竟不同用户的网络连接速度和带宽是不一样的。

# Fetch API

Fetch API 能够执行`XMLHttpRequest`对象的所有任务，但更容易使用，接口也更现代化，能够在 Web 工作线程等现代 Web 工具中使用。`XMLHttpRequest`可以选择异步，而 Fetch API 则必须是异步。

Fetch API 是 WHATWG 的一个“活标准”（living standard)，用规范原文说，就是“Fetch 标准定义请求、响应，以及绑定二者的流程：获取（fetch）”。

Fetch API 本身是使用 JavaScript 请求资源的优秀工具，同时这个 API 也能够应用在服务线程（service worker）中，提供拦截、重定向和修改通过`fetch()`生成的请求接口。

## 基本用法

`fetch()`方法是暴露在全局作用域中的，包括主页面执行线程、模块和工作线程。调用这个方法，浏览器就会向给定 URL 发送请求。

### 分派请求

`fetch()`只有一个必需的参数`input`。多数情况下，这个参数是要获取资源的 URL。这个方法返回一个期约：

```jsx
const r = fetch('/bar')
console.log(r) // Promise <pending>
```

URL 的格式（相对路径、绝对路径等）的解释与 XHR 对象一样。

请求完成、资源可用时，期约会解决为一个`Response`对象。这个对象是 API 的封装，可以通过它取得相应资源。获取资源要使用这个对象的属性和方法，掌握响应的情况并将负载转换为有用的形式，如下所示：

```jsx
fetch('bar.txt').then(response => {
  console.log(response)
})

// Response {type: 'basic', url: ... }
```

### 读取响应

读取响应内容的最简单方式是取得纯文本格式的内容，这要用到`text()`方法。这个方法返回一个期约，会解决为取得资源的完整内容：

```jsx
fetch('bar.txt').then(response => {
  response.text().then(data => {
    console.log(data)
  })
})

// bar.txt的内容
```

内容的结构通常是打平的：

```jsx
fetch('bar.txt')
  .then(response => response.text())
  .then(data => console.log(data))
```

### 处理状态码和请求失败

Fetch API 支持通过`Response`的`status`（状态码）和`statusText`（状态文本）属性检查响应状态。成功获取响应的请求通常会产生值为 200 的状态码，例如：

```jsx
fetch('/bar').then(response => {
  console.log(response.status) // 200
  console.log(response.statusText) // OK
})
```

请求不存在的资源通常会产生值为 404 的状态码：

```jsx
fetch('/does-not-exist').then(response => {
  console.log(response.status) // 404
  console.log(response.statusText) // Not Found
})
```

请求的 URL 如果抛出服务器错误会产生值为 500 的状态码：

```jsx
fetch('/does-not-exist').then(response => {
  console.log(response.status) // 500
  console.log(response.statusText) // Internal Server Error
})
```

可以显式地设置`fetch()`在遇到重定向时的行为，不过默认行为是跟随重定向并返回状态码不是 300 ～ 399 的响应。跟随重定向时，响应对象的`redirected`属性会被设置为`true`，而状态码仍然是 200：

```jsx
fetch('/permament-redirect').then(response => {
  // 默认行为是跟随重定向直到最终URL
  // 这个例子会出现至少两轮网络请求
  // <origin url>/permament-redirect ==> <redirect url>
  console.log(response.status) // 200
  console.log(response.statusText) // OK
  console.log(response.redirected) // true
})
```

在前面这几个例子中，虽然请求可能失败（例如状态码为 500），但都只执行了期约的**解决**处理函数。事实上，只要服务器返回了响应，`fetch()`期约都会解决。这个行为是合理的：系统级网络协议已经成功完成消息的一次往返传输。至于真正的“成功”请求，则需要在处理响应时再定义。

通常状态码为 200 时就会被认为成功了，其他情况可以被认为未成功。为区分这两种情况，可以在状态码非 200 ～ 299 时检查`Response`对象的`ok`属性：

```jsx
fetch('/bar').then(response => {
  console.log(response.status) // 200
  console.log(response.ok) // true
})

fetch('/does-not-exist').then(response => {
  console.log(response.status) // 404
  console.log(response.ok) // false
})
```

因为服务器没有响应而导致浏览器超时，这样真正的`fetch()`失败会导致期约被拒绝：

```jsx
fetch('/hangs-forever').then(
  response => {
    console.log(response)
  },
  err => {
    console.log(err)
  }
)

// （浏览器超时后）
// TypeError: "NetworkError when attempting to fetch resource."
```

违反 CORS、无网络连接、HTTPS 错配以及其他浏览器/网络策略问题都会导致期约被拒绝。

可以通过`url`属性检查通过`fetch()`发送请求时使用的完整 URL：

```jsx
// foo.com/bar/baz 发送的请求
console.log(window.location.href) // https://foo.com/bar/baz

fetch('qux').then(response => console.log(response.url)) // https://foo.com/bar/qux

fetch('//qux.com').then(response => console.log(response.url)) // https://qux.com

fetch('https://qux.com').then(response => console.log(response.url)) // https://qux.com
```

### 自定义选项

只使用 URL 时，`fetch()`会发送 GET 请求，只包含最低限度的请求头。要进一步配置如何发送请求，需要传入可选的第二个参数`init`对象。`init`对象要按照下表中的键/值对进行填充。

|       键        | 值                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :-------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `body`      | 指定使用请求体时请求体的内容。必须是`Blob`、`BufferSource`、`FormData`、`URLSearchParams`、`ReadableStream`或`String`的实例。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|     `cache`     | 用于控制浏览器与 HTTP 缓存的交互。要跟踪缓存的重定向，请求的`redirect`属性值必须是`follow`，而且必须符合同源策略限制。必须是下列值之一：1) `Default`。此时`fetch()`返回命中的有效缓存，不发送请求；命中无效（stale）缓存会发送条件式请求。如果响应已经改变，则更新缓存的值。然后`fetch()`返回缓存的值；命中缓存会发送请求，并缓存响应。然后`fetch()`返回响应。2）`no-store`。浏览器不检查缓存，直接发送请求；不缓存响应，直接通过`fetch()`返回。3）`reload`。浏览器不检查缓存，直接发送请求；缓存响应，再通过`fetch()`返回。4）`no-cache`。无论命中有效缓存还是无效缓存都会发送条件式请求。如果响应已经改变，则更新缓存的值。然后`fetch()`返回缓存的值；未命中缓存会发送请求，并缓存响应。然后`fetch()`返回响应。5)`force-cache`。无论命中有效缓存还是无效缓存都通过`fetch()`返回。不发送请求；命中无效缓存会发送请求，并缓存响应。然后`fetch()`返回响应；6）`only-if-cached`。只在请求模式为`same-origin`时使用缓存；无论命中有效缓存还是无效缓存都通过`fetch()`返回，不发送请求；未命中缓存返回状态码为 504（网关超时）的响应。 |
|  `credentials`  | 用于指定在外发请求中如何包含 cookie。与`XMLHttpRequest`的`withCredentials`标签类似必须是下列字符串值之一：1）`omit`：不发送 cookie；2）`same-origin`：只在请求 URL 与发送`fetch()`请求的页面同源时发送 cookie；3）`include`：无论同源还是跨源都包含 cookie。在支持 Credential Management API 的浏览器中，也可以是一个`FederatedCredential`或`PasswordCredential`的实例。默认为`same-origin`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|    `headers`    | 用于指定头部。必须是`Headers`对象实例或者包含字符串格式键/值对的常规对象。默认值不为不包含键/值对的`Headers`对象。这不意味着请求不包含任何头部，浏览器仍然会随请求发送一些头部。虽然这些头部对 JavaScript 不可见，但浏览器的网络检查器可以观察到。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|   `integrity`   | 用于强制子资源完整性。必须是包含子资源完整性标志服的字符串。默认为空字符串。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|   `keepalive`   | 用于指示浏览器允许请求存在时间超出页面声明周期。适合报告时间或分析，例如页面在`fetch()`后很快卸载。设置`keepalive`标识的`fetch()`请求可用于替代`Navigator.sendBeacon()。`必须是布尔值。默认为`false`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|    `method`     | 用于指定 HTTP 请求方法。基本上就是如下字符串值：`"GET"`、`"POST"`、`"PUT"`、`"PATCH"`、`"DELETE"`、`"HEAD"`、`"OPTIONS"`、`"CONNECT"`、`"TRACE"`。默认为`"GET"`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|     `mode`      | 用于指定请求模式。这个模式决定来自跨源请求的响应是否有效，以及客户端可以读取多少响应。违反这里指定模式的请求会抛出错误。必须是下列字符串之一：1）`cors`：允许遵守 CORS 协议的跨源请求。响应是“CORS 过滤的响应”，意思是响应中可以访问的浏览器头部是经过浏览器强制白名单过滤的；2）`no-cors`：允许不要发送预检请求的跨源请求（HEAD、GET 和只有带满足 CORS 请求头部的 POST）。响应类型是`opaque`，意思是不能读取响应内容；3）`same-origin`：任何跨源请求都不允许发送；4）`navigate`：用于支持 HTML 导航，只在文档间导航时使用，基本用不到。在通过构造函数手动创建`Request`实例时使用`mode`则默认为`cors`；否则默认为`no-cors`。                                                                                                                                                                                                                                                                                                                                                                                                      |
|   `redirect`    | 用于指定如何处理重定向响应（状态码为 301、302、303、307 或 308）。必须是下列字符串值之一：1）`follow`：跟踪重定向请求，以最终非重定向 URL 的响应作为最终响应；2）`error`：重定向请求会抛出错误；3）`manual`：不跟踪重定向请求，而是返回`opaqueredirect`类型的响应，同时仍然暴露期望的重定向 URL，允许以手动方式跟踪重定向。默认为`follow`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|   `referrer`    | 用于指定 HTTP 的`Referer`头部的内容。必须是下列字符串值之一：1）`no-referrer`：以`no-referrer`作为值；2）`client/about:client`：以当前 URL 或`no-referrer`（取决于来源策略`referrerPolicy`）作为值；3）`<URL>`：以伪造 URL 作为值。伪造 URL 的源必须与执行脚本的源匹配。默认为`client/about:client`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `refererPolicy` | 用于指定 HTTP 的`Referrer`头部。必须是下列字符串之一：1）`no-referrer`：请求中不包含`Referrer`头部；2）`no-referrer-when-downgrade`：对于从安全 HTTPS 上下文发送到 HTTP URL 的请求，不包含`Referrer`头部，对于所有其他请求，将`Referer`设置为完整 URL；3）`origin`：对于所有请求，将`Referer`设置为只包含源；4）`same-origin`：对于跨源请求，不包含`Referer`头部，对于同源请求，将`Referer`设置为完整 URL；5）`strict-origin`：对于从安全 HTTPS 上下文发送到 HTTP URL 的请求，不包含`Referer`头部，对于所有其他请求将`Refer`设置为只包含源；6）`origin-when-cross-origin`：对于跨源请求，将`Referer`设置为只包含源，对于同源请求，将`Referer`设置为完整 URL；7）`strict-origin-when-cross-origin`：对于从安全 HTTPS 上下文发送到 HTTP URL 的请求，不包含`Referer`头部，对于所有其他跨源请求，将`Referer`设置为只包含源，对于同源请求，将`Referer`设置为完整 URL；8）`unsafe-url`：对于所有请求，将`Referer`设置为完整 URL。默认为`no-referrer-when-downgrade`。                                                                   |
|    `signal`     | 用于支持通过`AbortController`中断进行中的`fetch()`请求。必须是`AbortSignal`的实例；默认为未关联控制器的`AbortSignal`实例。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

## 常见 Fetch 请求模式

与`XMLHttpRequest`一样，`fetch()`既可以发送数据也可以接收数据。使用`init`对象参数，可以配置`fetch()`在请求体中发送各种序列化的数据。

### 发送 JSON 数据

可以像这样发送简单 JSON 字符串：

```jsx
const payload = JSON.stringify({
  foo: 'bar',
})

const jsonHeaders = new Headers({
  'Content-Type': 'application/json',
})

fetch('/send-me-json', {
  method: 'POST',
  body: payload,
  headers: jsonHeaders,
})
```

### 在请求体中发送参数

因为请求体支持任意字符串值，可以通过它发送请求参数：

```jsx
const payload = 'foo=bar&baz=quz'

const paramHeaders = new Headers({
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
})

fetch('/send-me-params', {
  method: 'POST', // 发送请求体时必须使用一种HTTP方法
  body: payload,
  headers: paramHeaders,
})
```

### 发送文件

因为请求体支持`FormData`实现，所以`fetch()`也可以序列化并发送文件字段中的文件：

```jsx
const imageFormData = new FormData()
const imageInput = document.querySelector(`input[type='file']`)

imageFormData.append('image', imageInput.files[0])

fetch('/img-upload', {
  method: 'POST',
  body: imageFormData,
})
```

这个`fetch()`实现可以支持多个文件：

```jsx
const imageFormData = new FormData()
const imageInput = document.querySelector(`input[type='file'][multiple]`)

for (let i = 0; i < imageInput.files.length; i++) {
  imageFormData.append('image', imageInput.files[i])
}

fetch('/img-upload', {
  method: 'POST',
  body: imageFormData,
})
```

### 加载`Blob`文件

Fetch API 也能提供`Blob`类型的响应，而`Blob`又可以兼容多种浏览器 API。一种常见的做法是明确将图片文件加载到内存，然后将其添加到 HTML 图片元素。为此，可以使用响应对象上暴露的`blob()`方法。这个方法返回一个期约，解决为一个`Blob`的实例。然后可以将这个实例传给`URL.createObjectURL()`以生成可以添加给图片元素`src`属性的值。

```jsx
const imageElement = document.querySelector('img')

fetch('my-image.png')
  .then(response => response.blob())
  .then(blobl => (imageElement.src = URL.createObjectURL(blob)))
```

### 发送跨源请求

从不同的源请求资源，响应要包含 CORS 头部才能保证浏览器收到响应。没有这些头部，跨源请求会失败并抛出错误。

```jsx
fetch('//cross-origin.com')
// TypeError: Failed to fetch
// No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

如果代码不需要访问响应，也可以发送`no-cors`请求。此时响应的`type`属性值为`opaque`，因此无法读取响应内容。这种方式适合发送探测请求或者将响应缓存起来供以后使用。

```jsx
fetch('//cross-origin.com', { method: 'no-cors' }).then(response =>
  console.log(response.type)
)

// opaque
```

### 中断请求

Fetch API 支持通过`AbortController/AbortSignal`对中断请求。调用`AbortController.abort()`会中断所有网络传输，特别适合希望停止传输大型负载的情况。中断进行中的`fetch()`请求会导致包含错误的拒绝。

```jsx
const abortController = new AbortController()

fetch('wikipedia.zip', { signal: abortController.signal }).catch(() =>
  console.log('aborted!')
)

setTimeout(() => abortController.abort(), 10)
```

## `Headers`对象

`Headers`对象是所有外发请求和入站响应头部的容器。每个外发的`Request`实例都包含一个空的`Headers`实例，可以通过`Request.prototype.headers`访问，每个入站`Response`实例也可以通过`Response.prototype.headers`访问包含着响应头部的`Headers`对象。这两个属性都是可修改属性。另外，通过`new Headers()`也可以创建一个新实例。

### `Headers`与`Map`的相似之处

`Headers`对象与`Map`对象极为相似。这是合理的，因为 HTTP 头部本质上是序列化后的键/值对，它们的 JavaScript 表示则是中间接口。`Headers`与`Map`类型都有`get()`、`set()`、`has()`和`delete()`等实例方法。如下面代码所示：

```jsx
const h = new Headers()
const m = new Map()

h.set('foo', 'bar')
m.set('foo', 'bar')

console.log(h.has('foo'))
console.log(m.has('foo'))

console.log(h.get('foo'))
console.log(m.get('foo'))

h.set('foo', 'baz')
m.set('foo', 'baz')

h.delete('foo')
m.delete('foo')
```

`Headers`和`Map`都可以使用一个可迭代对象来初始化，例如：

```jsx
const seed = [['foo', 'bar']]

const h = new Headers(seed)
const m = new Map(seed)

console.log(h.get('foo'))
console.log(m.get('foo'))
```

而且，它们也都有相同的`keys()`、`values()`和`entries()`迭代器接口：

```jsx
const seed = [
  ['foo', 'bar'],
  ['baz', 'qux'],
]

const h = new Headers(seed)
const m = new Map(seed)

console.log(...h.keys())
console.log(...m.keys())

console.log(...h.values())
console.log(...m.values())

console.log(...h.entries())
console.log(...m.entries())
```

### `Headers`独有的特性

`Headers`并不是与`Map`处处都一样。在初始化`Headers`对象时，也可以使用键/值对形式的对象，而`Map`不可以：

```jsx
const seed = { foo: 'bar' }

const h = new Headers(seed)
console.log(h.get('foo')) // bar

const m = new Map(seed)
// TypeError: object is not iterable
```

一个 HTTP 头部字段可以有多个值，而`Headers`对象通过`append()`方法支持添加多个值。在`Headers`实例中还不存在的头部上调用`append()`方法相当于调用`set()`。后续调用会以逗号分隔符拼接多个值：

```jsx
const h = new Headers()

h.append('foo', 'bar')
console.log(h.get('foo')) // 'bar'

h.append('foo', 'baz')
console.log(h.get('foo')) // 'bar, baz'
```

### 头部护卫

某些情况下，并非所有 HTTP 头部都可以被客户端修改，而`Headers`对象使用护卫来防止不被允许的修改。不同的护卫设置会改变`set()`、`append()`和`delete()`的行为。违反护卫限制会抛出`TypeError`。

`Headers`实例会因来源不同而展现不同的行为，它们的行为由护卫来控制。JavaScript 可以决定`Headers`实例的护卫设置，下表列出了不同的护卫设置和每种设置对应的行为。

|       护卫        |                             适用情形                             |                                                             限制                                                              |
| :---------------: | :--------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------: |
|      `none`       |              在通过构造函数创建`Headers`实例时激活               |                                                              无                                                               |
|     `request`     | 在通过构造函数初始化`Request`对象，且`mode`值为非`no-cors`时激活 | 不允许修改禁止修改的头部（[MDN 禁止修改的请求头部](https://developer.mozilla.org/zh-CN/docs/Glossary/Forbidden_header_name)） |
| `request-no-cors` |  在通过构造函数初始化`Request`对象，且`mode`值为`no-cors`时激活  |            不允许修改非简单头部（[MDN 简单头部](https://developer.mozilla.org/zh-CN/docs/Glossary/Simple_header)）            |
|    `response`     |             在通过构造函数初始化`Response`对象时激活             |      不允许修改禁止修改的响应头部（[禁止修改的响应头部](https://fetch.spec.whatwg.org/#forbidden-response-header-name)）      |
|    `immutable`    | 在通过`error()`或`redirect()`静态方法初始化`Response`对象时激活  |                                                      不允许修改任何头部                                                       |

## `Request`对象

顾名思义，`Request`对象是获取资源请求的接口。这个接口暴露了请求的相关信息，也暴露了使用请求体的不同方式。

### 创建`Request`对象

可以通过构造函数初始化`Request`对象。为此需要传入一个`input`参数，一般是 URL：

```jsx
const r = new Request('https://foo.com')
console.log(r)
// Request {...}
```

`Request`构造函数也接收第二个参数——一个`init`对象。这个`init`对象与前面介绍的`fetch()`的`init`对象一样。没有在`init`对象中涉及的值则会使用默认值：

```jsx
// 用所有默认值创建Request对象
console.log(new Request(''))

// Request {
//   bodyUsed: false
//   cache: "default"
//   credentials: "same-origin"
//   destination: ""
//   headers: Headers {}
//   integrity: ""
//   isHistoryNavigation: false
//   keepalive: false
//   method: "GET"
//   mode: "cors"
//   redirect: "follow"
//   referrer: "about:client"
//   referrerPolicy: ""
//   signal: AbortSignal {aborted: false, reason: undefined, onabort: null}
//   url: "https://foo.com/"
// }

// 用指定的初始值创建Request对象
console.log(new Request('https://foo.com', { method: 'POST' }))

// Request {
//   bodyUsed: false
//   cache: "default"
//   credentials: "same-origin"
//   destination: ""
//   headers: Headers {}
//   integrity: ""
//   isHistoryNavigation: false
//   keepalive: false
//   method: "POST"
//   mode: "cors"
//   redirect: "follow"
//   referrer: "about:client"
//   referrerPolicy: ""
//   signal: AbortSignal {aborted: false, reason: undefined, onabort: null}
//   url: "https://foo.com/"
// }
```

### 克隆`Request`对象

Fetch API提供了两种不太一样的方式用于创建`Request`对象的副本：使用`Request`构造函数和使用`clone()`方法。
