---
title: 跨源资源共享（CORS）
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1gzwohn72bbj20pp0hv40q.jpg
date: 2022-03-03
---

# 什么是 CORS？

<iframe src="https://www.youtube.com/embed/4KHiSt0oLJ0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

**跨源资源共享**（CORS）（或通俗翻译为跨域资源共享）是一种基于 HTTP 头的机制，该机制通过允许服务器标示出了它自己以外的其他`origin`（域，协议和端口），这样浏览器可以访问加载这些资源。跨源资源共享还通过一种机制来检查服务器是否允许要发送的真实请求，该机制通过浏览器发起一个到服务器托管的跨源资源的**“预检”请求**。在预检中，浏览器发送的头中标示有 HTTP 方法和真实请求中会用到的头。

跨源 HTTP 请求的一个例子：运行在`https://domain-a.com`的 JavaScript 代码使用`fetch`来发起一个到`https://domain-b.com/data.json`的请求。出于安全性，浏览器限制脚本内发起的跨源 HTTP 请求。例如`XMLHttpRequest`和 Fetch API 遵循**同源策略**。这意味着使用这些 API 的 Web 应用程序只能从加载应用程序的同一个域请求 HTTP 资源，除非响应报文中包含了正确 CORS 响应头。

跨源资源共享机制允许 Web 引用服务器进行跨源访问控制，从而使跨源数据传输得以安全进行。现在浏览器支持在 API 容器中（`XMLHttpRequest`和`Fetch`）使用 CORS，以降低跨源 HTTP 请求所带来的风险。

> 现代浏览器处理跨源资源共享机制的客户端部分，包括 HTTP 头和相关策略的执行。但是这一标准意味着服务器需要处理新的请求头和响应头。

# 什么情况下需要 CORS？

Fetch API 的一个[标准](https://fetch.spec.whatwg.org/#http-cors-protocol)允许在下列场景中使用跨站点 HTTP 请求：

- 由`XMLHttpRequest`或者`Fetch`API 发起的跨源 HTTP 请求；
- Web 字体（CSS 中通过`@font-face`使用跨源字体资源），因此网站可以发布 TrueType 字体资源并且[只允许已授权网站进行跨源调用](https://www.w3.org/TR/css-fonts-3/#font-fetching-requirements)；
- [WebGL 贴图](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL)；
- 使用`drawImage`将 Images/video 画面绘制到 canvas；
- 来自图像的 CSS 图形

# 功能概述

跨源资源共享标准新增了一组 HTTP 首部字段，允许服务器声明哪些源站通过浏览器有权限访问哪些资源。另外，规范要求，对那些可能对服务器数据产生副作用的 HTTP 请求方法（特别是 GET 以外的 HTTP 请求，或者搭配某些 MIME 类型的 POST 请求），浏览器必须首先使用 OPTIONS 方法发起一个预检请求（preflight request），从而获知服务端是否允许该跨域请求。服务器确认允许之后才发起实际的 HTTP 请求。在预检请求的返回中，服务器也可以通知客户端是否需要携带身份凭证，包括 Cookies 和 HTTP 认证相关数据）。

CORS 请求失败会产生错误，但是为了安全从 JavaScript 代码层面无法获知到底具体是哪里出了问题。只能通过查看浏览器控制台查看。

# 访问控制场景

这里，使用三个场景来解释跨源资源共享机制的工作原理。都适用`XMLHttpRequest`对象。

某些请求不会触发[CORS 预检请求](https://developer.mozilla.org/zh-CN/docs/Glossary/Preflight_request)。这种请求也可以称为“简单请求”，注意该术语不属于 CORS 规范。如果**满足如下所有条件**，这个 HTTP 请求可以视为“简单请求”：

- 使用下列方法之一：
  - GET
  - HEAD
  - POST
- 除了被用户代理自动设置的头部字段（例如`Connection`，`User-Agent`）和在 Fetch 规范中定义为[禁用首部名称](https://fetch.spec.whatwg.org/#forbidden-header-name)的其他首部，允许认为设置的字段为 Fetch 规范定义的对 CORS 安全的首部字段集合，该集合为：
  - `Accept`
  - `Accept-Language`
  - `Content-Language`
  - `Content-Type`（需要注意额外的限制）
- `Content-Type`值仅限于下列三者之一：
  - `text/plain`
  - `multipart/form-data`
  - `application/x-www-form-urlencoded`
- 请求中的任意`XMLHttpRequest`对象均没有注册任何事件监听器；`XMLHttpRequest`对象可以使用`XMLHttpRequest.upload`属性访问。
- 请求中没有使用`ReadableStream`对象。

> 使用`Origin`和`Access-Control-Allow-Origin`就能完成最简单的访问控制。
