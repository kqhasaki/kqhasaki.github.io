---
title: electron中的进程模型
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h0vthp7700j20og0lvmzd.jpg
date: 2022-04-02
---

electron 从 Chromium 继承了多进程的架构，使得 electron 在架构上与现代 Web 浏览器非常相似。本节着重阐述 electron 中进程的基本概念。

# 为什么不使用单进程

Web 浏览器是极其复杂的应用程序。它们的主要功能是展示 Web 内容，但同时也具备很多其他功能。例如管理多个打开的窗口或者页面，亦或加载第三方扩展。

在 web 浏览器发展的早期，使用的是单一进程来实现以上所有功能。尽管这种模式减少了打开每个页面的开支，但是与此同时意味着一个正在打开的网页的崩溃或阻塞会影响到整个浏览器进程。

# 多进程模型

为了解决这个问题，Chrome 浏览器的开发团队决定对每一个页面在自己的进程中渲染。每个页面拥有单独的渲染进程，可以防止某个网页中代码的 bug 或者恶意攻击影响到整个浏览器应用。另外，存在唯一的一个浏览器进程管理这些页面进程，并且整体上控制浏览器应用的生命周期。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h0vu5cclhqj215s0u0tcy.jpg)

在[谷歌漫画](https://www.google.com/googlebooks/chrome/med_00.html)某处清晰展示了这种多进程架构。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h0vuc1d9nuj20wq0u0jup.jpg)

electron 应用的结构就非常类似这种多进程架构。作为应用开发者，你可以控制两种不同的进程：主进程和渲染进程。这些进程类似 Chrome 浏览器中的主进程和渲染进程。

# 主进程

每个 electron 应用都有唯一的主进程，它充当整个应用的入口。这个主进程运行在 Node.js 环境中，意味着它可以使用所有 Node.js 的模块和 API。

## 窗口管理

主进程的一个主要任务就是创建并且管理应用程序打开的窗口，这对应着`BrowserWindow`模块。

每个`BrowserWindow`类型的实例都创建了一个应用窗口，这个窗口可以在自己的渲染进程中加载网页。在主进程中可以通过窗口实例的`webContents`属性来访问该窗口中的内容。

```jsx
const { BrowserWindow } = require('electron')

const win = new BrowserWindow({ width: 800, height: 1500 })
win.loadURL('https://github.com')

const contents = win.webContents
console.log(contents)
```

> 注意：对于通过类似`BrowserView`创建的 Web 嵌入元素，electron 同样会创建其私有的渲染进程。

因为`BrowserWindow`继承自 Node.js 中的`EventEmitter`，故而可以在窗口实例上添加各种各样的事件和处理程序。

每当`BrowserWindow`的实例被销毁时，其对应的渲染进程也被终止。

## 生命周期

主进程的另一个任务是控制整个 electron 应用的生命周期，对应的模块是`app`。这个模块提供了一个庞大的事件和方法的集合，提供给开发者用于自定义应用的行为。
（例如，编程式地退出应用程序，更改应用程序的 dock 栏显示，或者显示一个“关于”面板）。

在[quick start 教程](electronjs.org/zh/docs/latest/tutorial/quick-start#manage-your-windows-lifecycle)中展示了如何使用`app`的 API 来提供一个更加接近于原生应用的窗口体验：

```jsx
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
```

## 原生 API

可以将 electron 应用看作是一个对 Chromium 的包装，通过 Chromium 内核来显示 Web 内容。但 electron 并非只是做了简单包装，因为在主进程中可以直接调用操作系统的 API。electron 暴露了若干提供原生桌面应用功能的模块，例如菜单、对话框和图标等。

在 [API 文档](https://www.electronjs.org/zh/docs/latest/api/app)可查询关于 electron 主进程相关模块的更多信息。

# 渲染进程

在 electron 应用程序中，每当一个`BrowserWindow`或者 web 嵌入元素被实例化时，都会创建一个独立的渲染进程。顾名思义，渲染进程负责 Web 内容的渲染。在渲染进程中运行的任何代码，其行为应该符合 web 标准（至少与 Chromium 的行为保持一致）。

因此，在 electron 应用中，在某个窗口中运行的任何 UI 和交互功能都应该和面向浏览器的 Web 开发遵循相同的规范、使用相同的工具。

这意味着开发 electron 应用时，需要理解几点：

- 每个渲染进程的入口是一个 HTML 文件
- UI 的样式通过 CSS 来定义
- 所有的 JavaScript 代码都可以通过`<script>`标签引入

另外，这意味着渲染进程是不能直接访问 Node.js 提供的任何功能的。为了在渲染进程中使用 npm 安装的各个模块，必须使用打包和构建工具例如`webpack`和`parcel`，就像是 Web 开发一样。

> 为了开发的方便，渲染进程可以直接由 Node.js 创建。在过去，这曾是默认行为，但是现今处于安全性考虑禁止了。

此时，你可能会好奇：既然只有主进程可以访问 Node.js 的 API，那么渲染进程里面运行的 UI 如何能够使用 Node.js 的各种能力和 electron 提供的原生桌面功能呢？事实上在渲染进程中，确实没有任何直接访问 electron 功能的方法。

# 预加载脚本

预加载脚本（preload scripts）中的代码会在渲染进程中执行，但是会发生在页面内容加载之前。这些脚本可以在渲染进程的上下文中执行，但是拥有访问 Node.js API 的能力。

预加载脚本可以通过在主进程中实例化`BrowserWindow`时通过`webPreferences`选项指定：

```jsx
const { BrowserWindow } = require('electron')

const win = new BrowserWindow({
  webPreferences: {
    preload: 'path/to/preload.js',
  },
})
```

因为预加载脚本可以访问到存在于渲染进程中的`window`接口，同时也能够访问 Node.js API，故而可以将处理后的 Node.js API 能力暴露在`window`上，从而渲染进程中的页面内容可以消费这些能力。

虽然预加载脚本通过`window`向渲染进程中暴露 Node.js 提供的能力，但是不可以直接在脚本中向`window`添加属性。

```jsx
// preload.js
window.myAPI = {
  desktop: true,
}

// renderer.js
console.log(window.myAPI)
// => undefined
```

由于`contextIsolation`（上下文隔离）的存在，在`window`中直接添加属性不会成功。**上下文隔离**的存在意味着预加载脚本和渲染进程中运行的 JavaScript 代码在某种程度上是隔离的。这样可以防止像渲染进程中意外暴露应用程序级别的、受保护的 API。

正确的做法是通过`contextBridge`来安全地向渲染进程暴露 Node.js 能力：

```jsx
// preload.js
const { contextBrige } = require('electron')

contextBrige.exposeInMainWorld('myAPI', {
  desktop: true,
})

// render.js
console.log(window.myAPI)
// => { desktoop: true }
```

在下列场景下，这个特性极其有用：

- 通过向渲染进程暴露`ipcRenderer`对象，就可以通过进程间通信（IPC）来在渲染进程中触发主进程中的任务（或者反过来）。
- 如果要开发 electron 应用是一个已有的远程 Web 应用的壳，那么可以通过给渲染进程添加属性的方式来通知 Web 应用启用桌面版功能。
