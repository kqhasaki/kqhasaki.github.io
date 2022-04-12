---
title: 关于no-cors的误区
date: 2022-04-12
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h179v9eovbj20xc0ku40e.jpg
---

> **本文翻译自[Evert's Dugout 的博客文章](https://evertpot.com/no-cors/)**

# 关于 CORS

浏览器中存在“沙盒“（sandbox）的概念。沙盒将来自不同域的 JavaScript 脚本的运行时隔绝开来。这样做主要的目的是为了安全性。

例如一个在`domain1.example.com`的脚本，它是不允许向`domain2.example.org`的资源发送 PUT 请求的。同样地，如果来自`domain1`的网页中的`<iframe>`嵌入了来自`domain2`的内容，`domain1`中的脚本是不允许读取`domain2`的任何内容的。

但是在 JavaScript 中，向其他源发送请求是非常常见和有用的。所以必须需要考虑绕过这种限制的方法。于是 CORS 标准横空出世，提供了非常好的解决方法。CORS 机制允许`domain2`声明：“我允许`domain1`向我发送请求“。

在浏览器的同源策略中，”域“（或者”源“）的概念由协议、域名和端口组成。

这里要澄清一个误区：CORS 并没有增加安全性，它只是通过某种机制选择性移除了安全策略。CORS 对于服务器来说是可选的，如果某个源并不支持 CORS 头部机制，那么来自浏览器的跨源请求就得不到有效响应，那么默认的行为就会生效：这个请求会失败。

# 关于`no-cors`

如果尝试使用`fetch()`去请求某个跨源的资源，并且这个源并没有启用 CORS。那么请求就会抛出一个网络异常。

如果我们并不能控制这个跨源的资源，那么我们获取可以通过`no-cors`这个机制来访问这个资源：

```jsx
const result = await fetch('https://domain2.example.org', {
  method: 'POST',
  mode: 'no-cors',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ foo: 'bar' }),
})
```

第一眼看到`no-cors`选项，可能会有人以为这仅仅是关闭了对于 CORS 头部机制的检查，实际上并不是这样。它并不仅仅告诉浏览器绕过 CORS 机制的检查，它对可以发送的请求有很大的限制，来保证安全性。

- 除了**简单头部**之外的头部，都会被从请求中静默移除。也就是说请求头部只能使用`Accpet`、`Accept-Lanugage`、`Content-Language`、`Content-Type`字段。
- 如果`Content-Type`字段的值不满足`application/x-www-form-urlencoded`、`mutipart/form-data`或`text/plain`三者之一，那么头部就会被忽略，并且设置为`text/plain`。
- 如果发送的请求方法不属于`GET`、`HEAD`和`POST`中的一种，那么就会抛出错误。
- 响应变为`opaque`类型，也就是对 JavaScript 完全不可读，包括响应头部和响应体。

换句话说，我们可以发送`GET`、`HEAD`和`POST`请求，但是并不能知道这个请求是成功了或者失败了。也不能读取响应的内容。如果发送的是一个 POST 请求，那么请求体就必须是`text/plain`或者 HTML 表单格式。

这些限制导致了`no-cors`很少使用（[MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Request/mode)并未提及其用法，《JavaScript 高级程序第四版》中提及其用处是发送探测请求或将请求缓存起来以后使用）。事实上，在工作中遇到的绝大部分使用`no-cors`的场景都是因为用错了。

所以不要产生使用`no-cors`就可以绕过 CORS 和浏览器同源策略的误解，它确实允许了一小部分的跨源请求绕过同源策略，但是使得请求几乎完全不具备可用性。对于几乎所有的场景，都不应该使用`no-cors`。

# 为什么`no-cors`做了这些限制？

在 fetch 和 XHR 出现之前，已经有可以通过 JavaScript 发送跨源请求的机制。通过创建一个 HTML 表单元素并且调用`.submit()`方法。使用这种方式进行跨源请求，JavaScript 无法看到响应并且不能对请求头进行更改。

`no-cors`的存在可以实现类似的请求。它可以提交表单数据，并且 JavaScript 不能介入。

# 总结

`no-cors`完全无法解决跨域问题，因此不要为了解决跨域问题错误使用它。遇到跨域问题，首先需要在服务端解决，如果对接口有控制权，那么可以在服务端支持 CORS；如果没有对接口的控制权，那么可以搭建一个服务端 API 代理，让服务端程序代理所有跨源请求。
