---
title: 红宝书系列（二十四）网络请求与远程资源
date: 2022-04-05
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h0z7nmxobmj20sg0hnmxd.jpg
---

2005年，Jesse James Garrett撰写了一篇文章，“Ajax——A New Approach to Web Applications”。这篇文章中描绘了一个被他称作Ajax（Asynchronous JavaScript + XML，即异步JavaScript加XML）的技术。这个技术涉及发送服务器请求额外数据而不刷新页面，从而实现更好的用户体验。Garrett解释了这个技术怎样改变自Web诞生以来一直延续的传统单击等待模式。

将Ajax推到历史舞台上的关键技术是`XMLHttpRequest`（XHR）对象。这个对象最早由微软发明，然后被其他浏览器所借鉴。在XHR出现以前，Ajax风格的通信不许通过一些黑科技实现，主要是使用隐藏的窗格或者内嵌窗格。XHR为发送服务器请求和获取响应提供了合理的接口。这个接口可以实现异步从服务器获取额外数据，意味着用户点击不用页面刷新也可以获取数据。通过XHR对象获取数据后，可以使用DOM方法将数据插入网页。虽然Ajax这个名字中包含XML，但实际上Ajax通信与数据格式无关。这个技术主要是可以实现在不刷新页面的情况下从服务器获取数据，格式并不一定是XML。

实际上，Garrett所称的这种Ajax技术已经出现很长时间了。在Garrett的那篇文章之前，一般称这种技术为**远程脚本**。这种浏览器与服务器的通信早在1998年就通过不同方式实现了。最初JavaScript对服务器的请求可以通过中介（例如Java小程序或Flash影片）来发送。后来XHR对象又为开发者提供了原生的浏览器通信能力，减少了实现这个目的的工作量。

XHR对象的API被普遍认为比较难用，而Fetch API自从诞生以后就迅速成为了XHR更现代的替代标准。Fetch API支持期约和服务线程，已经成为极其强大的Web开发工具。

> 本章会全面介绍`XMLHttpRequest`，但它实际上是过时的Web规范的产物，应该只在旧版本浏览器中使用。实际开发中应该尽可能使用`fetch()`。

# `XMLHttpRequest`对象

