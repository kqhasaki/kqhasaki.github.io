---
title: 红宝书系列（二十五）客户端存储
date: 2022-04-16
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h1bjh8vvjyj20kq0e8js5.jpg
---

随着 Web 应用程序的出现，直接在客户端存储用户信息的需求也随之出现。这背后的想法是合理的：与特定用户相关的信息应该保护在用户的机器上。无论是登陆信息、个人偏好，还是其他数据，Web 应用程序提供者都需要有办法把它们保存在客户端。对该问题的第一个解决方案就是 cookie，cookie 由古老的网景公司发明，由一份名为*Persistent Client State: HTTP Cookies*的规范定义。今天，cookie 只是在客户端存储数据的一个选项。

# cookie

HTTP cookie 通常也叫作 cookie，最初用于在客户端存储会话信息。这个规范要求服务器在响应 HTTP 请求时，通过发送`Set-Cookie`HTTP 头部包含会话信息。例如，下面是包含这个头部的一个 HTTP 响应：

```
HTTP/1.1 200 OK
Content-Type: text/html
Set-Cookie: name=value
Other-Header: other-header-value
```

这个 HTTP 响应会设置一个名为`"name"`，值为`"value"`的 cookie。名和值在发送时都会经过 URL 编码。浏览器会存储这些会话信息，并在之后的每个请求中都会通过 HTTP 头部 cookie 再将它们发回服务器，例如：

```
GET /index.js1 HTTP/1.1
Cookie: name=value
Other-Header: other-header-value
```

这些发送回服务器的额外信息可用于唯一标识发送请求的客户端。

## 限制

cookie 是与特定域绑定的。设置 cookie 后，它会与请求一起发送到创建它的域。这个限制能保证 cookie 中存储的信息只对被认可的接受者开放，不被其他域访问。

因为 cookie 存储在客户端机器上，所以为保证它不会被恶意利用，浏览器会施加限制。同时，cookie 也不会占用太多磁盘空间。

通常只要遵循以下大致的限制，就不会在任何浏览器中碰到问题：

- 不超过 300 个 cookie
- 每个 cookie 不超过 4096 字节（每个 cookie 都是一个 name/value 对）
- 每个域不超过 20 个 cookie
- 每个域不超过 81920 个字节

每个域能设置的 cookie 总数也是受限的，但不同浏览器的限制不同。例如：

- 最新版 IE 和 Edge 限制每个域不超过 50 个 cookie
- 最新版 Firefox 限制每个域不超过 150 个 cookie
- 最新版 Opera 限制每个域不超过 180 个 cookie
- Safari 和 Chrome 对每个域的 cookie 没有硬性限制

如果 cookie 总数超过了单个域的上限，浏览器就会删除之前设置的 cookie。IE 和 Opera 会按照最近最少使用（LRU，Least Recently Used）原则删除之前的 cookie，以便为新设置的 cookie 腾出空间。Firefox 好像会随机删除之前的 cookie，因此为避免不确定的结果，最好不要超出限制。

浏览器也会限制 cookie 的大小。大多数浏览器对 cookie 的限制是不超过 4096 字节，上下可以有一个字节的误差。为跨浏览器兼容，最好保证 cookie 的大小不超过 4095 字节。**这个大小限制适用于一个域的所有 cookie，而不是单个 cookie**。

如果创建的 cookie 超过最大限制，则该 cookie 会被静默删除。注意，一个字节通常会占 1 字节。如果使用多字节字符（如 UTF-8 Unicode 字符），则每个字符最多可能占 4 字节。

## cookie 构成

cookie 在浏览器中是由以下参数构成的。

- **名称**：唯一标识是 cookie 的名称。cookie 名不区分大小写，因此`myCookie`和`MyCookie`是同一个名称。不过实践中最好将 cookie 名当成区分大小写来对待，因为一些服务器软件可能这样对待它们。cookie 名必须经过 URL 编码。
- **值**：存储在 cookie 里的字符串值。这个值必须经过 URL 编码。
- **域**：cookie 有效的域。发送到这个域的所有请求都会包含对应的 cookie。这个值可能包含子域（如`www.wrox.com`），也可以不包含（如.wrox.com 表示对 wrox.com 的所有子域都有效）。如果不明确设置，则默认为设置 cookie 域。
- **路径**：请求 URL 中包含这个路径才会把 cookie 发送到服务器。例如，可以指定 cookie 只能由`http://www.wrox.com/books/`访问，因此访问`http://www.wrox.com/`下的页面就不会发送 cookie，即使请求的同一个域。
- **过期时间**：表示何时删除 cookie 的时间戳（即什么时间之后就不发送到服务器了）。默认情况下，浏览器会话结束后删除所有的 cookie。不过，也可以设置删除 cookie 的时间。这个值是 GMT 格式（Wdy，DD-Mon-YYYY HH:MM:SS GMT），用于指定删除 cookie 的具体时间。这样即使关闭浏览器 cookie 也会保留在用户机器上。把过期时间设置为过去的时间会立即删除 cookie。
- **安全标志**：设置之后，只在使用 SSL 安全连接的情况下才会把 cookie 发送到服务器。例如，请求`https://www.wrox.com`会发送 cookie，而请求`http://www.wrox.com`则不会。

这些参数在`Set-Cookie`头部中使用分号加空格隔开，例如：

```
HTTP/1.1 200 OK
Content-Type: text/html
Set-Cookie: name=value; expires=Mon, 22-Jan-07 07:10:24 GMT; domain=.wrox.com
Other-Header: other-header-value
```

这个头部设置一个名为`"name"`的 cookie，这个 cookie 还约定了过期时间，并且对`www.wrox.com`及其他`wrox.com`的子域（如`p2p.wrox.com`）有效。

安全标志`secure`是 cookie 中唯一的非名/值对，只需一个`secure`就可以了。例如：

```
HTTP/1.1 200 OK
Content-Type: text/html
Set-Cookie: name=value; domain=.wrox.com; path=/; secure
```

这里创建的 cookie 对所有 wrox.com 的子域及改域中的所有页面有效（通过`path=/`指定）。不过，这个 cookie 只能在 SSL 连接上发送，因为设置了`secure`标志。

要知道，域、路径、过期时间和`secure`标志用于告诉浏览器什么情况下应该在请求中包含 cookie。这些参数并不会随请求发送给服务器，实际发送的只有 cookie 的名/值对。

## JavaScript 中的 cookie

在 JavaScript 中处理的 cookie 比较麻烦，因为接口过于简单，只有 BOM 的`document.cookie`属性。根据用法不同，该属性的表现迥异。要使用该属性获取值时，`document.cookie`返回包含页面中所有有效 cookie 的字符串（根据域、路径、过期时间和安全设置），以分号分隔，如下面的例子：

```
name1=value1;name2=value2;name3=value3
```

所有名和值都是 URL 编码的，因此必须使用`decodeURIComponent()`解码。

在设置值时，可以通过`document.cookie`属性设置新的 cookie 字符串。这个字符串在被解析后会添加到原有 cookie 中。设置`document.cookie`不会覆盖之前存在的任何 cookie，除非设置了已有的 cookie。设置 cookie 的格式如下，与`Set-Cookie`头部的格式一样：

```
name=value; expires=expiration_time; path=domain_path; domain=domain_name; secure
```

在所有这些参数中，只有 cookie 的名称和值是必需的。下面是个简单的例子：

```jsx
document.cookie = 'name=Nicholas'
```

这些代码会创建一个名为`"name"`的会话 cookie，其值为`"Nicholas"`。这个 cookie 在每次客户端向服务器发送请求时都会被带上，在浏览器关闭时就会被删除。虽然这样直接设置也可以，因为不需要在名称或值中编码任何字符，但最好还是使用`encodeURIComponent()`对名称和值进行编码，例如：

```jsx
document.cookie =
  encodeURIComponent('name') + '=' + encodeURIComponent('Nicholas')
```

要为创建的 cookie 指定额外的信息，只要像`Set-Cookie`头部一样直接在后面追加相同格式的字符串即可：

```jsx
document.cookie =
  encodeURIComponent('name') +
  '=' +
  encodeURIComponent('Nicholas') +
  '; domain=.wrox.com; path=/'
```

因为在 JavaScript 中读写 cookie 不是很直观，所以可以通过辅助函数来简化相应的操作。与 cookie 相关的基本操作有读、写和删除。这些在`CookieUtil`对象中表示如下：

```jsx
class CookieUtil {
  static get(name) {
    let cookieName = `${encodeURIComponent(name)}=`
    let cookieStart = document.cookie.indexOf(cookieName)
    let cookieValue = null

    if (cookieStart > -1) {
      let cookieEnd = document.cookie.indexOf(';', cookieStart)
      if (cookieEnd === -1) {
        cookieEnd = document.cookie.length
      }
      cookieValue = decodeURIComponent(
        document.cookie.substring(cookieStart + cookieName.length, cookieEnd)
      )
    }
    return cookieValue
  }

  static get(name, value, expires, path, domain, secure) {
    let cookieText = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
    if (expires instanceof Date) {
      cookieText += `; expires=${expires.toGMTString()}`
    }

    if (path) {
      cookieText += `; path=${path}`
    }

    if (domain) {
      cookieText += `; domain=${domain}`
    }

    if (secure) {
      cookieText += `; secure`
    }

    document.cookie = cookieText
  }

  static unset(name, path, domain, secure) {
    CookieUtil.set(name, '', new Date(0), path, domain, secure)
  }
}
```

`CookieUtil.get()`方法用于取得给定名称的 cookie 值。为此，需要在`document.cookie`返回的字符串中查找是否存在名称后面加上等号。如果找到了，则使用`indexOf()`再查找该位置后面的分毫（表示该 cookie 的末尾）。如果没有找到分号，说明这个 cookie 在字符串末尾，因此字符串剩余部分都是 cookie 的值。取得 cookie 值后使用`decodeURIComponent()`解码，然后返回。如果没有找到 cookie，则返回`null`。

`CookieUtil.set()`方法用于设置页面上的 cookie，接收多个参数：cookie 名称、cookie 值、可选的`Date`对象（表示何时删除 cookie）、可选的 URL 路径、可选的域以及可选的布尔值（表示是否添加`secure`标志）。这些参数以它们的使用频率为序，只有前两个是必需的。在方法内部，使用了`encodeURIComponent()`对名称和值进行编码，然后再依次检查其他参数。如果`expires`参数是`Date`对象，则使用`Date`对象的`toGMTString()`方法添加一个`expires`选项来获得正确的日期格式。剩下的代码就是简单地追加 cookie 字符串，最终设置给`document.cookie`。

没有直接删除已有 cookie 的方法。为此需要再次设置同名 cookie（包括相同路径、域和安全选项），但要将其过期时间设置为某个过去的时间。`CookieUtil.unset()`方法实现了这些处理。这方法接收 4 个参数：要删除 cookie 的名称、可选的路径、可选的域和可选的安全标志。

这些参数会传给`CookieUtil.set()`，将 cookie 值设置为空字符串，将过期时间设置为 1970 年 1 月 1 日（以 0 毫秒初始化的`Date`对象的值）。这样可以保证删除 cookie。

可以像下面这样使用这些方法：

```jsx
// 设置cookie
CookieUtil.set('name', 'Nicholas')
CookieUtil.set('book', 'Professional JavaScript')

// 读取cookie
alert(CookieUtil.get('name')) // 'Nicholas'
alert(CookieUtil.get('book')) // 'Professional JavaScript'

// 删除cookie
CookieUtil.unset('name')
CookieUtil.unset('book')

// 设置有路径、域和过期时间的cookie
CookieUtil.set(
  'name',
  'Nicholas',
  '/books/projs/',
  'www.wrox.com',
  new Date('January 1, 2010')
)

// 删除刚刚设置的cookie
CookieUtil.unset('name', '/books/projs/', 'www.wrox.com')

// 设置安全cookie
CookieUtil.set('name', 'Nicholas', null, null, null, true)
```

这些方法通过处理解析和 cookie 字符串构建，简化了使用 cookie 存储数据的操作。

## 子 cookie

为绕过浏览器对每个域 cookie 数的限制，有些开发者提出了子 cookie 的概念。子 cookie 是在单个 cookie 存储的小块数据，本质上是使用 cookie 的值在单个 cookie 中存储多个名/值对。最常用的子 cookie 模式如下：

```
name=name1=value1&name2=value2&name3=value3&name4=value4&name5=value5
```

子 cookie 的格式类似于查询字符串。这些值可以存储为单个 cookie，而不用单独存储为自己的名/值对。结果就是网站或 Web 程序能够在单域 cookie 数限制下存储更多的结构化数据。

要操作子 cookie，就需要再添加一些辅助方法。解析和序列化子 cookie 的方式不一样，且因为对子 cookie 的使用而变得复杂。例如，要取得某个子 cookie，就需要先取得 cookie，然后在解码值之前需要先像下面这样找到子 cookie：

```jsx
class SubCookieUtil {
  static get(name, subName) {
    let subCookies = SubCookieUtil.getAll(name)
    return subCookies ? subCookies[subzName] : null
  }

  static getAll(name) {
    let cookieName = encodeURIComponent(name) + '='
    let cookieStart = document.cookie.indexOf(cookieName)
    let cookieValue = null
    let cookieEnd = null
    let subCookies = null
    let parts = null
    let result = {}

    if (cookieStart > -1) {
      cookieEnd = document.cookie.indexOf(';', cookieStart)
      if (cookieEnd === -1) {
        cookieEnd = document.cookie.length
      }
      cookieValue = document.cookie.substring(
        cookieStart + cookieName.length,
        cookieEnd
      )

      if (cookieValue.length > 0) {
        subCookies = cookieValue.split('&')

        for (let i = 0, len = subCookies.length; i < len; i++) {
          parts = subCookies[i].split('=')
          result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1])
        }

        return result
      }
    }

    return null
  }

  // 省略其他代码
}
```

取得子 cookie 有两个方法：`get()`和`getAll()`。`get()`用于取得一个子 cookie 的值，`getAll()`用于取得所有子 cookie，并以对象形式返回，对象的属性是子 cookie 的名称，值是子 cookie 的值。`get()`方法接收两个参数：cookie 的名称和子 cookie 的名称。这个方法先调用`getAll()`取得所有子 cookie，然后返回要取得的子 cookie（如果不存在则返回`null`）。

`SubCookieUtil.getAll()`方法在解析 cookie 值方面与`CookieUtil.get()`方法非常相似。不同的是`SubCookieUtil.getAll()`方法不会立即解码 cookie 的值，而是先用和号（`&`）拆分，将所有子 cookie 保护数组。然后，再基于等号（`=`）拆分每个子 cookie，使`parts`数组的第一个元素是子 cookie 的名称，第二个元素是子 cookie 的值。两个元素都使用`decodeURIComponent()`解码，并添加到`result`对象，最后返回`result`对象。如果 cookie 不存在则返回`null`。

可以像下面这样使用方法：

```jsx
// 假设 document.cookie=data=name=Nicholas&book=Professional%20JavaScript

// 取得所有子cookie
let data = SubCookieUtil.getAll('data')
alert(data.name) // 'Nicholas'
alert(data.book) // 'Professional JavaScript'

// 取得个别子cookie
alert(SubCookieUtil.get('data', 'name')) // 'Nicholas'
alert(SubCookieUtil.get('data', 'book')) // 'Professional JavaScript'
```

要写入子 cookie，可以使用另外两个方法：`set()`和`setAll()`。这两个方法的实现如下：

```jsx
class SubCookieUtil {
  // 省略之前的代码

  static set(name, subName, value, expires, path, domain, secure) {
    const subcookies = SubCookieUtil.getAll(name) || {}
    subcookies[subName] = value
    SubCookieUtil.setAll(name, subcookies, expires, path, domain, secure)
  }

  static setAll(name, subcookies, expires, path, domain, secure) {
    let cookieText = encodeURIComponent(name) + '='
    let subcookieParts = new Array()
    let subName

    for (subName in subcookies) {
      if (subName.length > 0 && subcookies.hasOwnProperty(subName)) {
        subcookieParts.push(
          `${encodeURIComponent(subName)}=${encodeURIComponent(
            subcookies[subName]
          )}`
        )
      }
    }

    if (cookieParts.length > 0) {
      cookieText += subcookieParts.join('&')

      if (expires instanceof Date) {
        cookieText += `; expires=${expires.toGMTString()}`
      }

      if (path) {
        cookieText += `; path=${path}`
      }

      if (domain) {
        cookieText += `; domains=${domain}`
      }

      if (secure) {
        cookieText += `; secure`
      }
    } else {
      cookieText += `; expires=${new Date(0).toGMTString()}`
    }

    document.cookie = cookieText
  }

  // 省略其他代码
}
```

## 使用 cookie 的注意事项

还有一种叫作 HTTP-only 的 cookie。HTTP-only 可以在浏览器设置，也可以在服务器设置，但只能在服务器上读取，这是因为 JavaScript 无法取得这种 cookie 的值。

因为所有 cookie 都会作为请求头部由浏览器发送给服务器，所以在 cookie 中保存大量信息有可能会影响特定域浏览器请求的性能。保存的 cookie 越大，请求完成的时间就越长。即使浏览器对 cookie 大小有限制，最好还是尽可能只通过 cookie 保存必要信息，以避免性能问题。

对 cookie 的限制以及其特性决定了 cookie 并不是存储大量数据的理想方式。因此其他客户端存储技术出现了。

> 不要在 cookie 中存储重要或敏感的信息。cookie 数据不是保存在安全的环境中，因此任何人都能获得。应该避免把信用卡号或个人地址等信息保存在 cookie 中。

# Web Storage

Web Storage 最早是网页超本文应用技术工作组（WHATWG，Web Hypertext Application Technical Working Group）在 Web Application 1.0 规范中提出的。这个规范中的草案最终成为了 HTML5 的一部分，后来又独立成为自己的规范。Web Storage 的目的是解决通过客户端存储不需要频繁发送回服务器的数据时使用 cookie 的问题。

Web Storage 规定最新的版本是第 2 版，这一版规范主要有两个目标：

- 提供在 cookie 之外的存储会话数据的途径
- 提供跨会话持久化存储大量数据的机制

Web Storage 的第二版定义了两个对象：`localStorage`和`sessionStorage`。`localStorage`是永久存储机制，`sessionStorage`提供了另一种存储会话数据的途径。这两种浏览器存储 API 提供了在浏览器中不受页面刷新影响而存储数据的两种方式。所有现代浏览器都在`window`对象上支持`localStorage`和`sessionStorage`。

> Web Storage 第一版曾使用过`globalStorage`，不过目前已经废弃。

## `Storage`类型

`Storage`类型用于保存名/值对数据，直至存储空间上限（由浏览器决定）。`Storage`的实例和其他对象一样，但增加了以下方法：

- `clear()`：删除所有值；不在 Firefox 中实现
- `getItem(name)`：取得给定的`name`的值
- `key(index)`：取得给定数值位置的名称
- `removeItem(name)`：删除给定`name`的名/值对
- `setIem(name, value)`：设置给定`name`的值

`getItem()`、`removeItem()`和`setItem()`方法可以直接或间接通过`Storage`对象调用。因为每个数据项都作为属性存储在该对象上，所以可以使用点或花括号操作符访问这些属性，通过同样的操作来设置值，也可以使用`delete`操作符删除属性。即便如此，通常我们还是建议使用方法而非属性来执行这些操作，以免意外重写某个已存在的对象成员。

通过`length`属性可以确定`Storage`对象中保存了多少名/值对。我们无法确定对象中所有数据占用的空间大小。

> `Storage`类型只能存储字符串。非字符串数据在存储之前会自动转换为字符串。注意这种转换不能在获取数据时撤销。

## `sessionStorage`对象

`sessionStorage`对象只存储会话数据，这意味着数据只会存储到浏览器关闭。这跟浏览器关闭时会消失的会话 cookie 类似。存储在`sessionStorage`中的数据不受页面刷新影响，并可以在浏览器崩溃并重启后恢复（取决于浏览器）。

因为`sessionStorage`对象与服务器会话紧密相关，所以运行在本地文件时不能使用。存储在`sessionStorage`对象中的数据只能由最初存储数据的页面使用，在多页程序中的用处有限。

因为`sessionStorage`对象是`Storage`的实例，所以可以通过使用`setItem()`方法或直接给属性赋值给它添加数据。下面是使用这两种方式的例子：

```jsx
// 使用方法存储数据
sessionStorage.setItem('name', 'Nicholas')

// 使用属性存储数据
sessionStorage.book = 'Professional JavaScript'
```

所有现代浏览器在实现存储写入时都使用了**同步阻塞方式**，因此数据会被立即提交到存储。具体 API 的实现可能不会立即把数据写入磁盘（而是使用某种不同的物理存储），但这个区别在 JavaScript 层是不可见的。通过 Web Storage 写入的任何数据都可以立即被读取。

对于`sessionStorage`上的数据，可以使用`getItem()`或直接访问属性名来取得。下面是使用这两种方式的例子：

```jsx
// 使用方法取得数据
const name = sessionStorage.getItem('name')

// 使用属性获取数据
const book = sessionStorage.book
```

可以结合`sessionStorage`的`length`属性和`key()`方法遍历所有的值：

```jsx
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i)
  let value = sessionStorage.getItem(key)
  alert(`${key}=${value}`)
}
```

这里通过`key()`先取得给定位置中的数据名称，然后使用该名称通过`getItem()`取得值，可以依次访问`sessionStorage`中的名/值对。

也可以使用`for-in`循环迭代`sessionStorage`的值：

```jsx
for (let key in sessionStorage) {
  let value = sessionStorage.getItem(key)
  alert(`${key}=${value}`)
}
```

每次循环，`key`都会被赋予`sessionStorage`中的一个名称；这里不会返回内置方法或`length`属性。

要从`sessionStorage`中删除数据，可以使用`delete`操作符直接删除对象属性，也可以使用`removeItem()`方法。下面是使用这两种方法的例子：

```jsx
// 使用delete删除值
delete sessionStorage.name

// 使用方法删除值
sessionStorage.removeItem('book')
```

`sessionStorage`对象应该主要用于存储只在会话期间有效的小块数据。如果需要跨会话持久存储数据，可以使用`localStorage`。

## `localStorage`对象

在修订的 HTML5 规范里，`localStorage`对象取代了`globalStorage`，作为在客户端持久存储数据的机制。要访问同一个`localStorage`对象，页面必须来自同一个域（子域不可以）、在相同的端口上使用相同的协议。

因为`localStorage`是`Storage`的实例，所以可以像使用`sessionStorage`一样使用`localStorage`。例如下面这几个例子：

```jsx
// 使用方法存储数据
localStorage.setItem('name', 'Nicholas')

// 使用属性存储数据
localStorage.book = 'Professional JavaScript'

// 使用方法取得数据
const name = localStorage.getItem('name')

// 使用属性取得数据
const book = localStorage.book
```

两种存储方法的区别在于，存储在`localStorage`中的数据会保留到通过 JavaScript 删除或者用户清除浏览器缓存。`localStorage`数据不受页面刷新影响。

## 存储事件

每当`Storage`对象发生变化时，都会在文档上触发`storage`事件。使用属性或`setItem()`设置值、使用`delete`或`removeItem()`删除值，以及每次调用`clear()`时都会触发这个事件。这个事件的事件对象有如下 4 个属性：

- `domain`：存储变化对应的域
- `key`：被设置或删除的键
- `newValue`：键被设置的新值，若键被删除则为`null`
- `oldValue`：键变化之前的值

可以使用如下代码监听`storage`事件：

```jsx
window.addEventListener('storage', event =>
  alert(`Storage changed for ${event.domain}`)
)
```

对于`sessionStorage`和`localStorage`上的 renew 变更都会触发`storage`事件，但`storage`事件不会区分这两者。

## 限制

与其他客户端数据存储方案一样，Web Storage 也有限制。具体的限制取决于特定的浏览器。一般来说，客户端数据的大小限制是按照每个源（协议、域和端口）来设置的，因此每个源有固定大小的数据存储空间。分析存储数据的页面的源可以加强这一限制。

不同浏览器给`localStorage`和`sessionStorage`设置了不同的空间限制，但大多数会限制为每个源 5MB。关于每种媒介的新配额限制信息表，可以参考 web.dev 网站上的文章“Storage for the Web”。

# IndexedDB

Indexed Database API 简称 IndexedDB，是浏览器中存储结构化数据的一个方案。IndexedDB 用于代替目前已废弃的 Web SQL Database API。IndexedDB 背后的思想是创造一套 API，方便 JavaScript 对象的存储和获取，同时也支持查询和搜索。

IndexedDB 的设计几乎完全是异步的。为此大多数操作以请求的形式执行，这些请求会异步执行，产生成功的结果或错误。绝大多数 IndexedDB 操作要求添加`onerror`和`onsuccess`事件处理程序来确定输出。

现代浏览器都完全或部分支持了 IndexedDB。

## 数据库

IndexedDB 是类似于 MySQL 或 Web SQL Database 的数据库。与传统数据库最大的区别在于，IndexedDB 使用对象存储而不是表格保存数据。IndexedDB 数据库就是在一个公共命名空间下的一组对象存储，类似于 NoSQL 风格的实现。

使用 IndexedDB 数据库的第一步是调用`indexedDB.open()`方法，并给它传入一个要打开的数据库名称。如果给定名称的数据库已存在，则会发送一个打开它的请求；如果不存在，则会发送创建并打开这个数据库的请求。这个方法会返回`IDBRequest`的实例，可以在这个实例上添加`onerror`和`onsuccess`事件处理程序。举例如下：

```jsx
let db
let request
let version = 1

request = indexedDB.open('admin', version)
request.onerror = event => {
  alert(`Failed to open: ${event.target.errorCode}`)
}
request.onsuccess = event => {
  db = event.target.result
}
```

以前，IndexedDB 使用`setVersion()`方法指定版本号。这个方法目前已经废弃。如前面代码所示，要在打开数据库的时候指定版本。这个版本号会被转换为一个`unsigned long long`数值，因此不要使用小数，而要使用整数。

在两个事件处理程序中，`event.target`都指向`request`，因此使用哪个都可以。如果`onsuccess`事件处理程序被调用，说明可以通过`event.target.result`访问数据库（`IDBDatabase`）实例了，这个实例会被保存到`db`变量中。之后所有与数据库相关的操作都要通过`db`对象本身来进行。如果打开数据库期间发生错误，`event.target.errorCode`中就会存储表示问题的错误码。

> 以前，出错时会使用`IDBDatabaseException`表示 IndexedDB 发生的错误。目前它已经被标准的`DOMExceptions`取代。

## 对象存储

建立了数据库连接之后，下一步就是使用对象存储。如果数据库版本与期待的不一致，那可能需要创建对象存储。不过在创建对象存储之前，有必要想一想要存储什么类型的数据。
