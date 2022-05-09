---
title: （十七）事件
date: 2022-02-22
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h0xwn569lnj20lz0gqabr.jpg
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/MY0UBGX2FtA" title="古怪的JavaScript面试题" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

JavaScript 与 HTML 的交互是通过事件实现的，**事件代表文档或浏览器窗口某个有意义的时刻**。可以使用仅在事件发生时执行的**监听器**（也叫处理程序）订阅事件。在传统软件工程领域，这个模型叫“观察者模式”，其能够做到页面行为（在 JavaScript 中定义）与页面展示（在 HTML 和 CSS 中定义）的分离。

事件最早时在 IE3 和 Netscape Navigator2 中出现的，当时的用意是把某些表单处理工作从服务器转移到浏览器上来。到了 IE4 和 Netscape Navigator3 发布的时候，这两家浏览器都提供了类似但又不同的 API，而且持续了好几代。**DOM2 开始尝试以符合逻辑的方式来标准化 DOM 事件 API**。**目前所有现代浏览器都实现了 DOM2 Events 的核心部分**。IE8 是最后一个使用专有事件系统的主浏览器。

浏览器的事件系统非常复杂。即使所有主流浏览器都实现了 DOM2 Events，规范也没有涵盖所有的事件类型。BOM 也支持事件，这些事件与 DOM 事件之间的关系由于长期以来缺乏文档，经常容易被混淆（HTML5 已经致力于明确这些关系）。而 DOM3 新增的事件 API 又让这些问题进一步复杂化了。根据具体的需求不同，使用事件可能会相对简单，也可能会非常复杂。但无论如何，理解其中的核心概念还是最重要的。

# 事件流

在第四代 Web 浏览器（IE4 和 Netscape Communicator4）开始开发时，开发团队碰到一个有意思的问题：页面的哪个部分拥有特定的事件呢？要理解这个问题，可以在一张纸上画几个同心圆。将手指放到圆心上，则手指不仅是在一个圆圈里，而是在所有的圆圈里。两家浏览器的开发团队都是以同样的方式来看待浏览器事件的。当你点击一个按钮时，实际上不光点击了这个按钮，点击了它的容器及整个页面。

**事件流**描述了页面接收事件的顺序。结果非常有意思，IE 和 Netscape 开发团队提出了几乎完全相反的事件流方案。IE 将支持事件冒泡流，而 Netscape Communicator 将支持事件捕获流。

## 事件冒泡

IE 事件流被称为**事件冒泡**，这是因为事件被定义为从最具体的元素（文档树中最深的节点）开始出发，然后向上传播至没有那么具体的元素（文档）。例如点击页面的某个元素`<div>`，被点击的元素会最先触发`click`事件。然后`click`事件沿 DOM 树一路向上，在经过每个节点上依次触发，直到到达`document`对象。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1gzmnynfsx4j21na0hsgmq.jpg)

所有现代浏览器都支持事件冒泡，这是实现方式上有一些区别。现代浏览器中的事件会一直冒泡到`window`对象。

## 事件捕获

Netscape Communicator 团队提出了另一种名为**事件捕获**的事件流。事件捕获的意思是最不具体的节点应该最先收到事件，而最具体的节点应该最后收到事件。事件捕获实际上是为了在事件到达最终目标前拦截事件。如果前面的例子使用事件捕获，则点击`<div>`元素会以下列顺序触发`click`事件：

1. `document`
2. `<html>`
3. `<body>`
4. `<div>`

在事件捕获中，`click`事件首先由`document`元素捕获，然后沿 DOM 树依次向下传播，直至到达实际的目标元素`<div>`。虽然这是 Netscape Communicator 唯一的事件流模型，但事件捕获得到了所有现代浏览器的支持。事件上所有浏览器都是从`window`对象开始捕获事件，而 DOM2 Events 规范规定的是从`document`开始。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1gzmo5axiwgj21pi0icwfm.jpg)

由于旧版浏览器不支持，因此实际当中几乎不会使用事件捕获。**通常情况下建议使用事件冒泡，少数特殊情况下可以使用事件捕获**。

## DOM 事件流

DOM2 Events 规范规定事件流分为 3 个阶段：事件捕获、到达目标和事件冒泡。事件捕获最先发生，为提前拦截事件提供了可能。然后实际的目标元素接收到事件。最后一个阶段是冒泡，最迟要在这个阶段响应事件。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1gzmo8tkxz6j21py0jiabp.jpg)

在 DOM 事件流中，实际的目标在捕获阶段不会接收到事件。这是因为捕获阶段从`document`到`<html>`再到`<body>`就结束了。下一阶段，即会在`<div>`元素上触发事件的“到达目标”阶段，通常在事件处理时被认为是冒泡阶段的一部分。然后冒泡阶段开始，事件反向传播至文档。

大多数支持 DOM 事件流的浏览器实现了一个小小的扩展。虽然 DOM2 Events 规范明确捕获阶段不命中事件目标，但是现代浏览器都会在捕获阶段在事件目标上触发事件。最终结果是在事件目标上有两个机会来处理事件。

所有现代浏览器都支持 DOM 事件流。

# 事件处理程序

事件意味着用户或者浏览器执行的某种动作。例如，单击（`click`）、加载（`load`）、鼠标悬停（`mouseover`）。为响应事件而调用的函数被称为**事件处理程序**或者**事件监听器**。事件处理程序的名字以`"on"`开头，因此`click`事件的处理程序叫做`onclick`，而`load`事件的处理程序叫做`onload`。有很多方式可以指定事件处理程序。

## HTML 事件处理程序

特定元素支持的每个事件都可以使用事件处理程序的名字以 HTML 属性的形式来指定。此时属性值必须是能够执行的 JavaScript 代码。例如，要在按钮被点击时执行某些 JavaScript 代码，可以使用以下 HTML 属性：

```html
<input type="button" value="click me" onclick="console.log('clicked')" />
```

点击这个按钮以后，控制台会输出。这种交互能力是通过为`onclick`属性指定 JavaScript 代码来实现的。注意，因为属性的值是 JavaScript 代码，所以不能在未经转义的情况下使用 HTML 语法字符。

在 HTML 中定义的事件处理程序可以包含精确的动作指令，也可以调用在页面其他地方定义的脚本，例如：

```html
<script>
  function showMessage() {
    console.log('Hello World!')
  }
</script>
<input type="button" value="click me" onclick="showMessage()" />
```

在这个例子中，单击按钮会调用`showMessage()`函数。`showMessage()`函数是在单独的`<script>`元素中定义的，而且也可以在外部文件中定义。作为事件处理程序执行的代码可以访问全局作用域中的一切。

以这种方式指定的事件处理程序又一些特殊的地方。首先会创建一个函数来封装属性的值。这个函数有一个特殊的局部变量`event`，其中保存的就是`event`对象。

```html
<input type="button" value="click me" onclick="console.log(event.type)" />
```

有了这个对象，就不用开发者另外定义其他变量，也不用从包装函数的参数列表中去取了。

在这个函数中，`this`值相当于事件的目标元素，如下面的例子：

```html
<input type="button" value="click me" onclick="console.log(this.value)" />
```

这个动态创建的包装函数还有一个特别有意思的地方，就是其作用域链被扩展了。在这个函数中，`document`和元素自身的成员都可以被当成局部变量来访问。这是通过`with`实现的：

```javascript
function () {
  with (document) {
    with (this) {
      // 属性值
    }
  }
}
```

这意味着事件处理程序可以更方便地访问自己的属性。下面的代码与前面的示例功能一样：

```html
<input type="button" value="click me" onclick="console.log(value)" />
```

如果这个元素是一个表单输入框，则作用域链中还会包含表单元素，事件处理程序对应的函数等价于如下：

```javascript
function () {
  with (document) {
    with (this.form) {
      with (this) {
        // 属性值
      }
    }
  }
}
```

本质上经过这样的扩展，事件处理程序的代码就不必引用表单元素，而直接访问统一表单中的其他成员了。下面的例子：

```html
<form method="post">
  <input type="text" name="username" value="" />
  <input
    type="button"
    value="echo username"
    onclick="console.log(username.value)"
  />
</form>
```

以上事件处理程序中的代码直接引用了`username`。

在 HTML 中指定事件的处理程序会有一些问题。第一个问题是时机问题。有可能 HTML 元素已经显示在页面上，用户都与其交互了，而事件处理程序的代码还无法执行。例如前面的例子，如果`showMessage()`函数是在页面后面，在按钮中代码的后面定义的，那么当用户在`showMessage()`函数被定义之前点击按钮时，就会发生错误。为此，大多数 HTML 事件处理程序会封装在`try/catch`中，以便在这种情况下**静默失败**。

```html
<input
  type="button"
  value="click me"
  onclick="try{showMessage();}catch(ex) {}"
/>
```

另一个问题是对事件处理程序作用域链的扩展在不同浏览器中可能导致不同的结果。不同 JavaScript 引擎中标识符解析的规则存在差异，因此访问无限定的对象成员可能导致错误。

使用 HTML 指定事件处理程序的最后一个问题是 HTML 与 JavaScript 强耦合。如果需要修改事件处理程序，必须在两个地方，即 HTML 和 JavaScript 中同时修改代码。这导致实际开发中没有人会使用 HTML 直接指定事件处理程序，而是在 JavaScript 中指定事件处理程序。

## DOM0 事件处理程序

在 JavaScript 中指定事件处理程序的传统方式是把一个函数赋值给（DOM 元素的）一个事件处理程序属性。这也是在第四代 Web 浏览器中开始支持的事件处理程序赋值方法，直到现在所有现代浏览器仍然都支持此方法，主要原因是简单。要使用 JavaScript 指定事件处理程序，必须先取得要操作对象的引用。

每个元素（包括`window`和`document`）都有通常小写的事件处理程序属性，例如`onclick`。只要把这个属性赋值为一个函数即可：

```javascript
const btn = document.getElementById('myBtn')

btn.onclick = function () {
  console.log('clicked')
}
```

这里先从文档中取得按钮，然后给它的`onclick`事件处理程序赋值一个函数。注意前面的代码在运行之后才会给事件处理程序赋值。因此如果在页面中上面的代码出现在按钮之后，有可能出现用户点击按钮没有反应的情况。

像这样使用 DOM0 方式为事件处理程序赋值时，所赋函数被视为元素的方法。因此事件处理程序会在元素的作用域中运行，即`this`等于元素。

```javascript
const btn = document.getElementById('myBtn')

btn.onclick = function () {
  console.log(this.id) // 'myBtn'
}
```

点击按钮，这段代码会显示元素的 ID。这个 ID 是通过`this.id`获取的，不仅仅是`id`，在事件处理程序中可以通过`this`访问元素的任何属性和方法。以这种方式添加事件处理程序是注册在事件流的冒泡阶段的。

通过将事件处理程序属性的值设置为`null`，可以移除通过 DOM0 方式添加的事件处理程序，如下例子所示：

```javascript
btn.onclick = null // 移除事件处理程序
```

将事件处理程序设置为`null`，再点击按钮就不会执行任何操作了。

> 如果事件处理程序是在 HTML 中指定的，则`onclick`属性的值是一个包装相应 HTML 事件处理程序属性值的函数。这些事件处理程序也可以通过在 JavaScript 中将相应属性值设置为`null`来移除。

## DOM2 事件处理程序

DOM2 Events 为事件处理程序的赋值和移除定义了两个方法：`addEventListener()`和`removeEventListener()`。这两个方法暴露在所有的 DOM 节点上，它们接收 3 个参数：事件名、事件处理函数和一个布尔值，`true`代表在捕获阶段调用事件处理程序，`false`（默认值）表示在冒泡阶段调用事件处理程序。

例如给按钮添加`click`事件处理程序：

```javascript
const btn = document.getElementById('myBtn')

btn.addEventListener(
  'click',
  () => {
    console.log(this.id)
  },
  false
)
```

以上代码为按钮添加了会在事件冒泡阶段触发的`onclick`事件处理程序（因为最后一个参数为`false`）。与 DOM0 方法类似，这个事件处理程序同样在被附加到的元素的作用域中运行。**使用 DOM2 方式的主要优势是可以为同一个事件添加多个事件处理程序**。看下面的例子：

```javascript
const btn = document.getElementById('myBtn')

btn.addEventListener(
  'click',
  () => {
    console.log(this.id)
  },
  false
)
btn.addEventListener(
  'click',
  () => {
    console.log('Hello World!')
  },
  false
)
```

这里给按钮添加了两个事件处理程序。多个事件处理程序以添加顺序来触发，因此前面的代码会先打印元素 ID，然后显示消息`"Hello World!"`。

通过`addEventListener()`添加的事件处理程序**只能使用`removeEventListener()`并出入与添加时同样的参数来移除**。

> 这意味着通过`addEventListener()`添加的匿名函数无法移除。

```javascript
const btn = document.getElementById('myBtn')
const handler = function () {
  console.log(this.id)
}
btn.addEventListener('click', handler, false)
btn.removeEventListener('click', handler, false)
```

大多数情况下，事件处理程序会被天际到事件流的冒泡阶段，主要是跨浏览器兼容性好。把事件注册到捕获阶段通常用于在事件到达其目标之前拦截事件。如果不需拦截，则不要使用事件捕获。

## 跨浏览器事件处理程序

为了以垮浏览器兼容的方式处理事件，很多开发者会选择使用一个 JavaScript 库，其中抽象了不同浏览器的差异。

# 事件对象

在 DOM 中发生事件时，所有相关信息都会被收集并存储在一个名为`event`的对象中。这个对象包含了一些基本信息，例如导致事件的元素、发生的事件类型，以及可能与特定事件相关的任何其他数据。例如，鼠标操作导致的事件会生成鼠标位置信息，而键盘操作导致的事件会生成与被按下的键有关的信息。所有浏览器都支持这个`event`对象，尽管支持方式不同。

## DOM 事件对象

**在 DOM 合规的浏览器中，`event`对象是传给事件处理程序的唯一参数**。不管以哪种方式（DOM0 或 DOM2）指定事件处理程序，都会传入这个 event 对象。

```javascript
const btn = document.getElementById('btn')
btn.onclick = function (event) {
  console.log(event.type)
}

btn.addEventListener(
  'click',
  event => {
    console.log(event.type)
  },
  false
)
```

在通过 HTML 属性指定的事件处理程序中，一样可以使用`event`引用事件对象。

```html
<input type="button" value="click me" onclick="console.log(event.type)" />
```

以这种方式提供`event`对象，可以让 HTML 属性中的代码实现与 JavaScript 函数同样的功能。

如前所述，事件对象包含与特定事件相关的属性和方法。不同的事件生成的事件对象也会包含不同的属性和方法。不过，所有事件对象都会包含一些公共成员：

|          属性/方法           |      类型      | 读/写 |                                            说明                                            |
| :--------------------------: | :------------: | :---: | :----------------------------------------------------------------------------------------: |
|          `bubbles`           |     布尔值     | 只读  |                                      表示事件是否冒泡                                      |
|         `cancelable`         |     布尔值     | 只读  |                               表示是否可以取消事件的默认行为                               |
|       `currentTarget`        |      元素      | 只读  |                                 当前事件处理程序所在的元素                                 |
|      `defaultPrevented`      |     布尔值     | 只读  |                  `true`表示已经调用`preventDefault()`方法（DOM3 中新增）                   |
|           `detail`           |      整数      | 只读  |                                     事件相关的其他信息                                     |
|         `eventPhase`         |      整数      | 只读  |           表示调用事件处理程序的阶段：1 代表捕获，2 代表到达目标，3 代表冒泡阶段           |
|      `preventDefault()`      |      函数      | 只读  |             用于取消事件的默认行为。只有`cancelable`为`true`才可以调用这个方法             |
| `stopImmediatePropagation()` |      函数      | 只读  |     用于取消所有后续事件捕获或事件冒泡，并组织调用任何后续事件处理程序（DOM3 中新增）      |
|     `stopPropagation()`      |      函数      | 只读  |         用于取消所有后续事件捕获或事件冒泡。只有`bubbles`为`true`才可以调用此方法          |
|           `target`           |      元素      | 只读  |                                          事件目标                                          |
|          `trusted`           |     布尔值     | 只读  | `true`表示事件是由浏览器生成的。`false`表示事件是开发者通过 JavaScript 创建的（DOM3 新增） |
|            `type`            |     字符串     | 只读  |                                      被触发的事件类型                                      |
|            `view`            | `AbstractView` | 只读  |                     与事件相关的抽象视图。等于事件所发生的`window`对象                     |

在事件处理程序内部，`this`对象始终等于`currentTarget`的值，而`target`只包含事件的实际目标。如果事件处理程序直接添加在了意图的目标，则`this`、`currentTarget`和`target`的值是一样的。

```javascript
const btn = document.getElementById('myBtn')
btn.onclick = function (event) {
  console.log(event.currentTarget === this) // true
  console.log(event.target === this) // true
}
```

上面的代码检测了`currentTarget`和`target`的值是否等于`this`。因为`click`事件的目标是按钮，所以这三个值就是相等的。如果这个事件处理程序是添加到按钮的父节点（例如`document.body`）上，那么它们的值就不一样了。

```javascript
document.body.onclick = function (event) {
  console.log(event.currentTarget === document.body) // true
  console.log(this === document.body) // true
  console.log(event.target === document.getElementById('myBtn')) // true
}
```

这种情况下点击按钮，`this`和`currentTarget`都等于`document.body`，因为它是注册事件处理程序的元素。而`target`属性等于按钮本身，这是因为那才是`click`事件真正的目标。由于按钮本身没有注册事件处理程序，因此`click`事件冒泡到`document.body`，从而触发了它上面注册的处理程序。

`type`属性在一个处理程序处理多个事件时很有用。例如：

```javascript
const btn = document.getElementById('myBtn')
const handler = function (event) {
  switch (event.type) {
    case 'click':
      console.log('clicked')
      break
    case 'mouseover':
      event.target.style.backgroundColor = 'red'
      break
    case 'mouseout':
      event.target.style.backgroundColor = ''
      break
    default:
      break
  }
}

btn.onclick = handler
btn.onmouseover = handler
btn.onmouseout = handler
```

在这个例子中，函数`handler`被用于处理 3 种不同的事件：`click`、`mouseover`和`mouseout`。这个函数使用`event.type`属性确定了事件类型，从而可以做出不同的响应。

`preventDefault()`方法用于组织特定事件的默认动作。例如链接元素的默认行为就是在被单击时导航到`href`属性指定的 URL。如果想阻止这个导航行为，可以在`onclick`事件处理程序中取消，如下：

```javascript
const link = document.getElementById('myLink')
link.onclick = function (event) {
  event.preventDefault()
}
```

任何可以通过`preventDefault()`取消默认行为的事件，其事件对象的`cancelable`属性都会设置为`true`。

`stopPropagation()`方法用于立即组织事件流在 DOM 结构中传播，取消后续的事件捕获或冒泡。例如，直接添加到按钮的事件处理程序中调用`stopPropagation()`，可以阻止`document.body`上注册的事件处理程序执行。例如：

```javascript
const btn = document.getElementById('myBtn')
btn.onclick = function (event) {
  console.log('clicked')
  event.stopPropagation()
}
document.body.onclick = function (event) {
  console.log('body clicked')
}
```

如果这个例子中不调用`stopPropagation()`，那么点击按钮就会打印两条消息，但是由于`click`事件不会传播到`document.body`，因此`'onclick`事件处理程序永远不会执行。

`eventPhase`属性可以用于确定事件流当前所处的阶段。如果事件处理程序在捕获阶段被调用，则`eventPhase`等于 1；如果事件处理程序在目标上被调用，则`eventPhase`等于 2；如果事件处理程序在冒泡阶段被调用，则`eventPhase`等于 3。不过要注意的是，虽然“到达目标”是在冒泡阶段发生的，但其`eventPhase`仍然等于 2。

```javascript
const btn = document.getElementById('myBtn')
btn.onclick = function (event) {
  console.log(event.eventPhase) // 2
}
document.body.addEventListener(
  'click',
  event => {
    console.log(event.eventPhase) // 1
  },
  true
)
document.body.onclick = event => {
  console.log(event.eventPhase) // 3
}
```

这个例子中，点击按钮首先会触发注册在捕获阶段的`document.body`上的事件处理程序，显示`eventPhase`为 1。接着，会触发按钮本身的事件处理程序（尽管是注册在冒泡阶段），此时显示`eventPhase`等于 2。最后触发的是注册在冒泡阶段的`document.body`上的事件处理程序，显示为`eventPhase`为 3。而当`eventPhase`等于 2 时，`this`、`target`和`currentTarget`三者相等。

> `event`对象只会在事件处理程序执行期间存在，一旦执行完毕，就会被销毁。

# 事件类型

Web 浏览器中可以发生很多种事件。如前所述，所发生事件的类型决定了事件对象中会保存什么信息。DOM3 Events 定义了如下的事件类型：

- **用户界面事件**（`UIEvent`）：涉及与 BOM 交互的通用浏览器事件。
- **焦点事件**（`FocusEvent`）：在元素获得和失去焦点时触发。
- **鼠标事件**（`MouseEvent`）：使用鼠标在页面上执行某些操作时触发。
- **滚轮事件**（`WheelEvent`）：使用鼠标滚轮（或类似设备）时触发。
- **输入事件**（`InputEvent`）：向文档中输入文本时触发。
- **键盘事件**（`KeyboardEvent`）：使用键盘在页面上执行某些操作时触发。
- **合成事件**（`CompositionEvent`）：在使用某种 IME（输入法编辑器）输入字符时触发。

除了这些事件类型之外，HTML5 还定义另外一组事件，而浏览器通常在 DOM 和 BOM 上实现专有事件。这些专有事件基本上都是根据开发者需求而不是按照规范增加的，因此不同浏览器的实现可能不同。

DOM3 Events 在 DOM2 Events 基础上重新定义了事件，并且添加了新的事件类型。所有主流浏览器都支持 DOM2 Events 和 DOM3 Events。

## 用户界面事件

用户界面事件或 UI 事件不一定跟用户操作有关。这类事件在 DOM 规范出现之前就已经以某种形式存在了，保留它们是为了向后兼容。UI 事件主要有以下几种：

- `DOMActivate`：元素被用户通过鼠标或键盘操作激活时触发（比`click`或`keydown`更通用）。这个事件在 DOM3 Events 中已经废弃。
- `load`：在`window`上当页面加载完成后触发，在窗套(`<frameset>`)上当所有窗格（`<frame>`）都加载完成后触发，在`<img>`元素上当图片加载完成后触发，在`<object>`元素上当相应对象加载完成后触发。
- `unload`：在`window`上当页面完全卸载后触发，在窗套上当所有窗格都卸载完成后触发，在`<object>`元素上当相应对象卸载完成后触发。
- `abort`：在`<object>`元素上当相应对象加载完成前被用户提前终止下载时触发。
- `error`：在`window`上当 JavaScript 加载报错时触发，在`<img>`元素上当无法加载指定图片时触发，在`<object>`元素上当无法加载相应对象时触发，在窗套上当一个或多个窗格无法完成加载时触发。
- `select`：在文本框（`<input>`或者`<textarea>`）上当用户选择了一个或多个字符时触发。
- `resize`：在`window`或窗格上当窗口或窗格被缩放时触发。
- `scroll`：当用户滚动包含滚动条的元素时在元素上触发。`<body>`元素包含已加载页面的滚动条。

大多数 HTML 事件与`window`对象和表单控件有关。

除了`DOMActivate`这些事件在 DOM2 Events 中都归类为 HTML Events。

### `load`事件

`load`事件可能是 JavaScript 中最常用的事件。在`window`对象上，`load`事件会在整个页面（包括所有外部资源如图片、JavaScript 文件和 CSS 文件）加载完成后触发。可以通过两种方式指定`load`事件处理程序。第一种是 JavaScript 方式：

```javascript
window.addEventListener('load', event => {
  console.log('loaded!')
})
```

这是使用`addEventListener()`方法来指定事件处理程序。和其他事件一样，事件处理程序会接收到一个`event`对象。这个`event`对象并没有提供有关这种类型事件的额外信息，虽然在 DOM 合规的浏览器中，`event.target`会被设置为`document`。

第二种指定`load`事件处理程序的方式是向`<body>`元素添加`onload`属性。实际开发中最好使用 JavaScript 方式。

> 根据 DOM2 Events，`load`事件应该在`document`而非`window`上触发。但是为了向后兼容，所有浏览器都在`window`上实现了`load`事件。

图片上也会触发`load`事件，包括 DOM 中的图片和非 DOM 中的图片。可以在 HTML 直接给`<img>`元素的`onload`属性指定事件处理程序。

```html
<img src="smile.gif" onload="console.log('image loaded.')" />
```

```javascript
const image = document.getElementById('my Image')
image.addEventListener('load', event => {
  console.log(event.target.src)
})
```

这里使用 JavaScript 为图片制定了 load 事件处理程序。处理程序会接收到`event`对象，虽然这个对象上没有多少有用的信息。这个事件的目标是`<img>`元素，因此可以直接从`event.target.src`属性中取得图片地址并打印出来。

在通过 JavaScript 创建新`<img>`元素时，也可以给这个元素指定一个在加载完成后执行的事件处理程序。这里，关键是要在赋值`src`属性前指定事件处理程序：

```javascript
window.addEventListener('load', () => {
  const image = document.createElement('img')
  image.addEventListener('load', event => {
    console.log(event.target.src)
  })
  document.body.appendChild(image)
  image.src = 'smile.gif'
})
```

这个了例子首先为`window`制定了一个`load`事件处理程序。因为示例涉及向 DOM 中添加新元素，所以必须确保页面已经加载完成。如果在页面加载完成之前操作`document.body`，则会导致错误。然后，代码创建了一个新的`<img>`元素，并为这个元素设置了`load`事件处理程序。最后才把元素添加到文档中并指定了其`src`属性。**注意，下载图片并不一定要把`<img>`元素添加到文档，只要给他设置了`src`属性它就会立即开始下载**。

同样的技术也适用于 DOM0 的`Image`对象。在 DOM 出现之前，客户端都使用`Image`对象预先加载图片。可以像使用前面（通过`createElement()`方法创建）的`<img>`元素一样使用`Image`对象。只是不能把后者添加到 DOM 树。

```javascript
window.addEventListener('load', () => {
  const image = new Image()
  image.addEventListener('load', event => {
    console.log('Image loaded!')
  })
  image.src = 'smile.gif'
})
```

这里调用`Image`构造函数创建了一个新图片，并给它设置了事件处理程序。有些浏览器会把`Image`对象实现为`<img>`元素，但并非所有浏览器都如此。所以最好把它看成两个东西。

### `unload`事件

和`load`事件相对的是`unload`事件，`unload`事件会在文档卸载完成之后触发。`unload`事件一般是在从一个页面导航到另一个页面时触发，最常用于清理引用，避免内存泄漏。与`load`事件类似，`unload`事件也有两种指定方式。

一般来说很少会在 JavaScript 代码中使用`unload`事件。

### `resize`事件

当浏览器窗口被缩放到新高度或宽度时，会触发`resize`事件。这个事件在`window`上触发，因此可以通过 JavaScript 在`window`上或者为`<body>`元素添加`onresize`属性来指定事件处理程序。优先使用 JavaScript 方式：

```javascript
window.addEventListener('resize', event => {
  console.log('Resized')
})
```

类似于其他在`window`上发生的事件，此时会生成`event`对象，且这个对象的`target`属性在 DOM 合规的浏览器中是`document`。

不同浏览器在决定何时触发`resize`事件上存在着重要差异。有的浏览器会在缩放超过 1 像素时触发`resize`事件，然后随着用户缩放浏览器窗口不断触发。有的仅仅在用户停止缩放浏览器窗口时触发。无论如何都应该避免在这个事件处理程序中做过多计算，否则可能由于执行过于频繁而导致浏览器响应变慢。事实上除非特殊用途否则不要使用这个事件处理程序。

> 部分浏览器窗口在最大化和最小化时也会触发`resize`事件。

### `scroll`事件

虽然`scroll`事件发生在`window`上，但是实际上反映的是页面中相应元素的变化。在混杂模式下，可以通过`<body>`元素检测`scrollLeft`和`scrollTop`属性的变化。而在标准模式下，这些变化在除早期版本的 Safari 之外的所有浏览器中都发生在`<html>`元素上（早期 Safari 在`<body>`上跟踪滚动位置）。

类似于`resize`，`scroll`事件也会随着文档滚动而重复触发，因此最好保持事件处理程序的代码尽可能简单。

## 焦点事件

焦点事件在页面元素获取或失去焦点时触发。这些事件可以与`document.hasFocus()`和`document.activeElement`一起为开发者提供用户在页面中导航的信息。焦点事件有以下 6 种：

- `blur`：当元素失去焦点时触发。**这个事件不冒泡**，所有浏览器都支持。
- `DOMFocusIn`：当元素获得焦点时触发。这个事件是`focus`的冒泡版，DOM3 废弃了这个事件，推荐使用`focusin`。
- `DOMFocusOut`：当元素失去焦点时触发。这个事件是`blur`的通用版，DOM3 废弃了这个事件，推荐使用`focusout`。
- `focus`：当元素获得焦点时触发。**这个事件不冒泡**，所有浏览器都支持。
- `focusin`：当元素获得焦点时触发。这个事件是`focus`的冒泡版。
- `focusout`：当元素失去焦点时触发。这个事件时`blur`的通用版。

焦点事件中的两个主要事件是`focus`和`blur`，这两个事件在 JavaScript 早期就得到了浏览器支持。它们最大的问题是不支持冒泡。这导致后来 IE 增加了`focusin`和`focusout`，Opera 又增加了`DOMFocusIn`和`DOMFocusOut`。IE 新增的这两个事件已经被 DOM3 Events 标准化。

当焦点从页面中的一个元素移到另一个元素时，会依次发生如下事件：

1. `focusout`在失去焦点的元素上触发。
2. `focusin`在获得焦点的元素上触发。
3. `blur`在失去焦点的元素上触发。
4. `focus`在获得焦点的元素上触发。

其中，`blur`和`focusout`的事件目标是失去焦点的元素，而`focus`和`focusin`的事件目标是获得焦点的元素。

## 鼠标和滚轮事件

**鼠标事件**是 Web 开发中最常用的一组事件，只是因为鼠标是用户最主要的定位设备。DOM3 Events 定义了 9 种鼠标事件：

- `click`：在用户单击鼠标主键（通常是左键）或者按回车键时触发。这主要是基于无障碍的考虑，让键盘和鼠标都可以触发`onclick`事件处理程序。
- `dblclick`：在用户双击鼠标主键（通常是左键）时触发。这个事件不是在 DOM2 Events 中定义的，但是得到了很好的支持，DOM3 Events 将其进行了标准化。
- `mousedown`：**用户按下任意鼠标按键时触发**。这个事件不能通过键盘触发。
- `mouseenter`：在用户把光标从元素外部移动到元素内部时触发。**这个事件不冒泡，也不会在光标经过后代元素时触发**。`mouseenter`事件不是在 DOM2 Events 中定义的，而是 DOM3 Events 中新增的事件。
- `mouseleave`：在用户把光标从元素内部移动到元素外部时触发。**这个事件不冒泡，也不会在光标经过后代元素时触发**。`mouseleave`事件不是在 DOM2 Events 中定义的，而是 DOM3 Events 中新增的事件。
- `mousemove`：在鼠标光标在元素上移动时**反复触发**。这个事件不能通过键盘触发。
- `mouseout`：在用户把光标从一个元素移动到另一个元素上时触发。移动到的元素可以是原始元素的外部元素，也可以是原始元素的子元素。这个事件不能通过键盘触发。
- `mouseover`：在用户把光标从元素外部移动到元素内部时触发。这个事件不能通过键盘触发。
- `mouseup`：在用户释放鼠标键时触发。这个事件不能通过键盘触发。

页面中的所有元素都支持鼠标事件。除了`mouseenter`和`mouseleave`，所有鼠标事件都会冒泡，都可以被取消，而这会影响浏览器的默认行为。

由于事件之间存在关系，因此取消鼠标事件的默认行为也会影响其他事件。

例如，`click`事件触发的前提是`mousedown`事件触发后，紧接着又在同一个元素上触发了`mouseup`事件。如果`mousedown`或者`mouseup`事件任意一个被取消，那么`click`事件就不会触发。类似地，两次连续的`click`事件会导致`dblclick`事件触发。只要有任何逻辑阻止了这两个`click`事件发生，那么`dblclick`事件就不会被触发。这四个事件永远会按照下列顺序触发：

1. `mousedown`
2. `mouseup`
3. `click`
4. `mousedown`
5. `mouseup`
6. `click`
7. `dblclick`

`mousedown和`mouseup`则不会受其他事件影响。

鼠标事件还有一个名为**滚轮事件**的子类别。滚轮事件只有一个——`mousewheel`，反映的是鼠标滚轮或带滚轮的类似设备上滚轮的交互。

### 客户端坐标

鼠标事件都是在浏览器视口的某个位置上发生的。这些信息被保存在`event`对象的`clientX`和`clientY`属性中。这两个属性表示事件发生时鼠标光标在视口中的坐标，所有浏览器都支持。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1gztklgrvbaj21fl0u079b.jpg)

可以通过下面的方式获取鼠标事件的客户端坐标：

```javascript
const div = document.getElementById('myDiv')
div.addEventListener('click', event => {
  console.log(`Client coordinates: ${event.clientX}, ${event.clientY}`)
})
```

注意客户端坐标不考虑页面滚动，因此这两个值不代表鼠标在页面上的位置。

### 页面坐标

客户端坐标是事件发生时鼠标光标在客户端视口中的坐标，**而页面坐标是事件发生时鼠标光标在页面上的坐标**，通过`event`对象的`pageX`和`pageY`属性可以获取。这两个属性表示鼠标光标在页面上的位置，因此反映的是光标到页面而非视口左边和上边的距离。

在页面没有滚动时，`pageX`和`pageY`与`clientX`和`clientY`的值相同。

### 屏幕坐标

鼠标事件不仅是在浏览器窗口中发生的，也是在整个屏幕上发生的。可以通过`event`对象的`screenX`和`screenY`属性来获取鼠标光标在屏幕上的坐标。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1gztkuui03nj21fv0u00wk.jpg)

### 修饰键

虽然鼠标事件主要是通过鼠标触发的，但有时候要确定用户想要实现的操作，还要考虑键盘按键的状态。键盘上的**修饰键**Shift、Ctrl、Alt 和 Meta 经常用于修改鼠标事件的行为。DOM 规定了 4 个属性来表示这四个修饰键的状态：`shiftKey`、`ctrlKey`、`altKey`和`metaKey`。这几个属性会在各自对应的修饰键被按下时包含布尔值`true`，没有被按下时包含`false`。在鼠标事件发生的，可以通过这几个属性来检测修饰键是否被按下。

```javascript
const div = document.getElementById('myDiv')
div.addEventListener('click', event => {
  const keys = new Array()

  if (event.shiftKey) {
    keys.push('shift')
  }

  if (event.ctrlKey) {
    keys.push('ctrl')
  }

  if (event.altKey) {
    keys.push('alt')
  }

  if (event.metaKey) {
    keys.push('meta')
  }

  console.log(`Keys: ${keys.join(',')}`)
})
```

> 所有现代浏览器都支持这 4 个修饰键。

### 相关元素

对`mouseover`和`mouseout`事件而言，还存在与事件相关的其他元素。这两个事件都涉及从一个元素的边界之内把光标移动到另一个元素的边界之内。对`mouseover`元素来说，事件的主要目标是获得光标的元素，相关元素是失去光标的元素。类似地对于`mouseout`事件来说，事件的主要目标是失去光标的元素，而相关元素是获得光标的元素。

DOM 通过`event`对象的`relatedTarget`属性提供了相关元素的信息。这个属性只有在`mouseover`和`mouseout`事件发生时才包含值，其他所有事件的这个属性值都是`null`。

### 鼠标按键

只有在元素上单击鼠标主键（或按下键盘回车键）时`click`事件才会触发，因此按键信息并不是必须的。对`mousedown`和`mouseup`事件来说，`event`对象上会有一个`button`属性，表示按下或释放的是哪个按键。DOM 位这个`button`属性定义了三个值：`0`表示鼠标主键，`1`表示鼠标中键（通常也是滚轮键），`2`表示鼠标附键。按照惯例，鼠标主键通常是左边的按键，附键通常是右边的按键。

### 额外事件信息

DOM2 Events 规范在`event`对象上提供了`detail`属性，以给出更多关于事件的信息。对鼠标事件来说，`detail`包含一个数值，表示在给定位置上发生了多少次单击。单击相当于在同一个像素上发生一次`mousedown`紧跟一次`mouseup`。`detail`的值从 1 开始，每次单击会加 1。如果鼠标在`mousedown`和`mouseup`之间移动了，则`detail`会重置为 0。

### `mousewheel`事件

`mousewheel`事件在 HTML5 标准中添加，会在用户使用鼠标滚轮时触发，包括在垂直方向上任意滚动。这个事件会在任何元素上触发，并且冒泡到`document`和`window`。`mousewheel`事件的`event`对象包含鼠标事件的所有标准信息，此外还有一个名为`wheelDelta`的新属性。当鼠标滚轮向前滚动时，`wheelDelta`每次都是+120；而当鼠标滚轮向后滚动时，`wheelDelta`每次都是-120。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1gztlp25q8bj213e0faaab.jpg)

可以为页面上的任何元素或文档添加`onmousewheel`事件处理程序，以处理所有鼠标滚轮交互。

```javascript
document.addEventListener('mousewheel', event => {
  console.log(event.wheelDelta)
})
```

### 触摸屏设备

iOS 和 Andriod 等触摸屏设备的实现大相径庭，因为触摸屏通常不支持鼠标操作。在为触摸屏设备开发时，需要记住：

- **不支持`dblclick`事件**。双击浏览器窗口可以放大，但是没有办法覆盖这个默认行为。
- 单指点触屏幕上的可点击元素会触发`mousemove`事件。如果操作会导致内容发生变化，则不会再触发其他事件。如果屏幕上没有变化，则会相继触发`mousedown`、`mouseup`和`click`事件。点触不可点击的元素不会触发事件。可点击元素是指点击时有默认动作的元素（如链接）或指定了`onclick`事件处理程序的元素。
- `mousemove`事件也会触发`mouseover`和`mouseout`事件。
- 双指点触屏幕并滑动导致页面滚动时会触发`mousewheel`和`scroll`事件。

### 无障碍

如果 Web 应用需要考虑到残障人士通过屏幕阅读器使用，那么必须小心使用鼠标事件。如前所述，回车键可以触发`click`事件，但是其他鼠标事件不能通过键盘触发。因此建议不要使用除了`click`事件之外的其他鼠标事件像用户提示功能或者触发代码执行。因为其他鼠标事件会严格妨碍盲人或视觉障碍用户使用。下面是一些使用鼠标事件的无障碍建议：

- 使用`click`事件执行代码。
- 不要使用`mouseover`向用户显示新选项。同样是屏幕阅读器无法触发`mousedown`事件。
- 不要使用`dblclick`执行重要的操作，因为键盘不能触发这个事件。

遵循这些简单的建议可以极大提升 Web 应用对于残章人士的无障碍性。

## 键盘与输入事件

**键盘事件**是用户操作键盘时触发的。DOM2 Events 最初定义了键盘事件，但该规范在最终发布前删除了相应内容。因此键盘事件很大程度上是基于原始的 DOM0 实现的。

DOM3 Events 为键盘事件提供了一个首先在 IE9 中完全实现的规范。其他浏览器也开始实现该规范，但仍然存在很多遗留的实现。

键盘事件包含 3 个事件：

- `keydown`，用户按下键盘上某个键时触发，而且持续按住会重复触发。
- `keypress`，用户按下键盘上某个键并产生字符时触发，而且持续按住会重复触发。Esc 键也会触发这个事件。DOM3 Events 废弃了`keypress`事件，而推荐`textInput`事件。
- `keyup`，用户释放键盘上某个键时触发。

虽然所有元素都支持这些事件，但当用户在文本框输入内容时最容易看到。

输入事件只有一个，即`textInput`。这个事件是对`keypress`事件的扩展，用户在文本显示给用户之前更方便地截获文本输入。`textInput`会在文本被插入到文本框之前触发。

当用户按下键盘上的某个字符键时，首先会触发`keydown`事件，然后触发`keypress`事件，最后触发`keyup`事件。注意这里的`keydown`和`keypress`事件会在文本框出现变化之前触发，而`keyup`事件会在文本框出现变化之后触发。如果一个字符键被按住不放，`keydown`和`keypress`就会重复触发，直到这个键被释放。

对于非字符键，在键盘上按一下这个键，会先触发`keydown`事件，然后触发`keyup`事件。如果按住某个非字符键不放，则会重复触发`keydown`事件直到这个键被释放，此时会触发`keyup`事件。

> 键盘事件与鼠标事件支持相同的修饰键。`shiftKey`、`ctrlKey`、`altKey`和`metaKey`属性在键盘事件中都是可以用的。

### 键码

对于`keydown`和`keyup`事件，`event`对象的`keyCode`属性中会保存一个键码，对应键盘上特定的一个键。对于字母和数字键，`keyCode`的值与小写字母和数字的 ASCII 编码一致。例如数字键 7 键的`keyCode`为 55，而字母 A 键的`keyCode`为 65，而且跟是否按了 Shift 键无关。DOM 和 IE 的`event`对象都支持`keyCode`属性。

```javascript
const textbox = document.getElementById('myText')
textbox.addEventListener('keyup', event => {
  console.log(event.keyCode)
})
```

### 字符编码

在`keypress`事件发生时，意味着按键会影响屏幕上的文本。对插入或移除字符的键，所有浏览器都会触发`keypress`事件，其他键则取决于浏览器。因为 DOM3 Events 规范才刚刚开始实现，所以不同浏览器之间的实现存在显著差异。

浏览器在`event`对象上支持`charCode`属性，只有发生在`keypress`事件时这个属性才会被设置值，

### `textInput`事件

DOM3 Events 规范添加了一个名为`textInput`的事件，其在字符被输入到可编辑区域时触发。作为对`keypress`的替代，`textInput`事件的行为有些不一样。一个区别是`keypress`会在任何可以获得焦点的元素上触发，而`textInput`只在可编辑区域上触发。另一个区别是`textInput`只在有新字符被插入时才会触发，而`keypress`对任何可能影响文本的键都会触发（包括退格键）。

因为`textInput`事件主要关注字符，所以在`event`对象上提供了一个`data`属性，包含要插入的字符（不是字符编码）。`data`的值始终是要被插入的字符，因此如果在按 S 键时没有按 Shift 键，`data`的值就是`"s"`，但在 S 键时同时按 Shift 键，`data`的值则是`"S"`。

```javascript
const textbox = document.getElementById('myText')
textbox.addEventListener('textInput', event => console.log(event.data))
```

这个例子会实时把输入文本框的文本通过日志打印出来。

`event`对象上还有一个名为`inputMethod`的属性，该属性表示向控件中输入文本的手段。

## HTML5 事件

DOM 规范并为涵盖浏览器都支持的所有事件。很多浏览器根据特定的用户需求或使用场景实现了自定义事件。HTML5 详尽地列出了浏览器支持的所有事件。这里讨论 HTML5 中得到浏览器较好支持的一些事件。注意这些并不是浏览器支持的所有事件。

### `contextmenu`事件

Windows95 通过单击鼠标右键为 PC 用户增加了上下文菜单的概念。不久，这个概念也在 Web 上得以实现。开发者面临的问题是如何确定何时该显示上下文菜单（在 Windows 上是右键鼠标，Mac 上可以是 Ctrl + 单击），以及如何避免默认的上下文菜单起作用。结果就出现了`contextmenu`事件，以专门用于表示何时该显示上下文菜单，从而允许开发者取消默认的上下文菜单并提供自定义菜单。

`contextmenu`事件冒泡，因此只要给`document`指定一个事件处理程序就可以处理页面上的所有同类事件。事件目标是触发操作的元素。这个事件在所有浏览器中都可以取消，在 DOM 合规的浏览器中使用`event.preventDefault()`，在 IE8 及更早的版本中将`event.returnValue`设置为`false`。`contextmenu`事件应该算是一种鼠标事件，因此`event`对象上的很多属性都与光标位置有关。通常，自定义的上下文菜单都是通过`oncontextmenu`事件处理程序触发显示，并通过`onclick`事件处理程序触发隐藏的。

### `beforeunload`事件

`beforeunload`事件会在`window`上触发，用意是给开发者提供阻止页面被卸载的机会。这个事件会在页面即将从浏览器中卸载时触发，如果页面需要继续使用，则可以不被卸载。这个事件不能取消，负责就意味着可以把用户永久拦阻拦在一个页面上。相反，这个事件会向用户显示一个确认框，其中的消息表明浏览器即将卸载页面，并请求用户确认。

```javascript
window.addEventListener('beforeunload', event => {
  const message = 'some text'
  event.returnValue = message
  return message
})
```

### `DOMContentLoaded`事件

`window`的`load`事件会在页面完全加载后触发，因为要等待很多外部资源加载完成，所以会花费较长时间。而`DOMContentLoaded`事件会在 DOM 树构建完成后立即触发，而不用等待图片、JavaScrip 文件、CSS 文件或其他资源加载完成。相对于`load`事件，`DOMContentLoaded`可以让开发者在外部资源下载的同时就能指定事件处理程序，从而让用户能更快地与页面交互。

要处理`DOMContentLoaded`事件，需要给`document`或者`window`添加事件处理程序（实际的事件目标是`document`，但是会冒泡到`window`）。下面是一个例子：

```javascript
document.addEventListener('DOMContentLoaded', event => {
  console.log('Content loaded')
})
```

`DOMContentLoaded`事件的`event`对象中不包含任何额外信息（除了`target`等于`document`）。

`DOMContentLoaded`事件通常常用于添加事件处理程序或执行其他 DOM 操作，这个事件始终在`load`事件之前触发。

对于不支持`DOMContentLoaded`事件的浏览器，可以使用超时为 0 的`setTimeout()`函数，通过其回调来设置事件处理程序。

### `pageshow`和`pagehide`事件

FireFox 和 Opera 开发了一个名为**往返缓存**的功能，此功能旨在使用浏览器“前进”和“后退”按钮加快页面之间的切换。这个缓存不仅存储页面数据，也存储 DOM 和 JavaScript 状态，实际上是把整个页面都保存在内存里。如果页面在缓存中，那么导航到这个页面时就不会触发`load`事件。通常这不会导致什么问题，因为整个页面状态都被保存起来了。不过 Firefox 决定提供一些事件，把往返缓存的行为暴露出来。

第一个事件是`pageshow`，其会在页面显示时触发，无论是否来自往返缓存。在新加载的页面上，`pageshow`会在`load`事件之后触发；在来自往返缓存的页面上，`pageshow`会在页面状态完全恢复后触发。注意，虽然这个事件的目标是`document`，但事件处理程序必须添加到`window`上。

```javascript
;(function () {
  let showCount = 0

  window.addEventListener('load', () => {
    console.log('Load fired')
  })

  window.addEventListener('pageshow', () => {
    showCount++
    console.log(`show has been fired ${showCount} times.`)
  })
})()
```

这个例子使用了私有作用域保证了`showCount`不会进入全局作用域。在页面首次加载时`showCount`为 0。之后每次触发`pageshow`事件，`showCount`都会加 1 并输出消息。如果从包含以上代码的页面跳走，然后又点击“后退”按钮以恢复它，就能够每次都看到`showCount`的值。这是因为变量的状态连通整个页面状态都保存在了内存中，导航回来后可以恢复。如果是点击了浏览器的“刷新“按钮，则`showCount`的值会重置为 0，因为页面会重新加载。

除了常用属性，`pageshow`的`event`对象还包含了一个名为`persisted`的属性。这个属性是一个布尔值，如果页面存储在了往返缓存中就是`true`，否则就是`false`。可以像下面这样在事件处理程序中检测这个属性：

```javascript
;(function () {
  let showCount = 0

  window.addEventListener('load', () => {
    console.log('Load fired')
  })

  window.addEventListener('pageshow', () => {
    showCount++
    console.log(
      `Show has been fired ${showCount} times. Persisted? ${event.persisted}`
    )
  })
})()
```

通过检测`persisted`属性可以根据页面是否取自往返缓存而决定是否采取不同操作。

和`pageshow`对应的事件是`pagehide`，这个事件会在页面从浏览器中卸载后，在`unload`事件之前触发。

> 注册了`onunload`事件处理程序的页面会自动排除在往返缓存之外。这是因为`onunload`事件典型的使用场景是撤销`onload`事件发生所做的事情，如果使用往返缓存，则下一次页面显示时就不会触发`onload`事件，而这可能导致页面无法使用。

### `hashchange`事件

HTML5 增加了`hashChange`事件，用于在 URL 散列值发生变化时通知开发者。这是因为开发者经常在 Ajax 应用程序中使用 URL 散列值存储状态信息或路由导航信息。

`onhashchange`事件处理程序必须添加给`window`，每次 URL 散列值发生变化时会调用它。`event`对象有两个新属性：`oldURL`和`newURL`。这两个属性分别保存变化前后的 URL，而且是包含散列值的完整 URL。下面的例子展示了如何获取变化前后的 URL：

```javascript
window.addEventListener('hashchange', event => {
  console.log(`Old URL: ${event.oldURL}, New URL: ${event.newURL}`)
})
```

如果想要确定散列值，最好使用`location`对象。

```javascript
window.addEventListener('hashchange', event => {
  console.log(`Current hash: ${location.hash}`)
})
```

# 内存与性能

因为事件处理程序在现代 Web 应用中可以实现交互，所以很多开发者会错误地在页面中大量使用它们。在创建 GUI 的语言如 C#中，通常会给 GUI 上的每个按钮设置一个`onclick`事件处理程序，这样做不会有什么性能损耗。在 JavaScript 中，页面中事件处理程序的数量和页面整体性能直接相关。原因有很多，首先每个函数都是对象，都占用内存空间，对象越多，性能越差。其次，为指定事件处理程序所访问 DOM 得次数会先期造成整个页面交互的延迟。只要在使用事件处理程序时多注意一些方法就可以改善页面性能。

## 事件委托

“过多事件处理程序”的解决方案是使用**事件委托**。事件委托利用事件冒泡，可以只使用一个事件处理程序来管理某一类型的事件。例如`click`事件冒泡到`document`。这意味着可以为整个页面指定一个`onclick`事件处理程序，而不用为每个可点击元素分别指定事件处理程序。

例如，因为页面中的所有 DOM 元素都是`document`节点的后代，所有元素上的点击事件都会冒泡到`document`。因此只要在`document`的事件处理程序中指定事件目标，就可以分别处理。使用事件委托的处理结果对用户来说没有区别，这种方式占用方式更少。所有使用按钮的事件（大多数鼠标事件和键盘事件）都适用于这个方案。

只要可行，就应该考虑只给`document`添加一个事件处理程序，通过它处理页面中所有某种类型的事件。因为相对于之前的技术，事件委托具有如下优点：

- `document`对象随时可用，任何时候都可以给它添加事件处理程序（不用等待`DOMContentLoaded`事件或者`load`事件）。这意味着只要页面渲染出可点击的元素，就可以无延迟地起作用。
- 节省花费在设置页面处理程序上的时间。只指定一个事件处理程序即可以节省 DOM 引用，也可以节省时间。
- 减少整个页面所需的内存，提升整体性能。

最适合使用事件委托的事件包括：`click`、`mousedown`、`mouseup`、`keydown`和`keypress`。`mouseover`和`mouseout`事件虽然也冒泡，但是很难适当处理，因为经常需要计算元素的位置。

## 删除事件处理程序

将事件处理程序指定给元素后，在浏览器代码和负责页面交互的 JavaScript 代码之间就建立了联系。这种联系建立地越多，页面性能就越差。除了通过事件委托来限制这种连接之外，还应该及时删除不用的事件处理程序。很多 Web 应用性能不佳都是因为无用的事件处理程序常驻内存导致的。

导致这个问题的主要原因有两个。第一个是删除带有事件处理程序的元素，例如通过真正的 DOM 方法`removeChild()`或`replaceChild()`删除节点。最常见的还是使用`innerHTML`整体替换页面的某一部分。这时候，被`innerHTML`删除的元素上如果有事件处理程序，就不会被垃圾回收程序正常清理。

> 事件委托也有助于解决这种问题。如果提前知道页面某一部分会被使用`innerHTML`删除，就不要直接给这部分中的元素添加事件处理程序了。把事件处理程序添加到更高层级的节点上同样可以处理改区域的事件。

另一个可能导致内存中残留引用的问题是页面卸载。如果在页面卸载后事件处理程序没有被清理，则它们仍然会残留在内存中。之后浏览器每次加载和卸载页面（例如通过前进、后退或刷新），内存中残留的对象数量都会增加，这是因为事件处理程序不会被回收。

一般来说，最好在`onunload`事件处理程序中趁页面尚未卸载时先删除所有事件处理程序。这时候也能体现使用事件委托的优势，因为事件处理程序很少，所以很容易记住要删除哪些。关于卸载页面时的清理，可以记住一点：`onload`事件处理程序中做了什么，最好在`onunload`事件处理程序中恢复。

# 模拟事件

**事件就是为了表示网页中某个有意的时刻**。通常事件都是由用户交互或浏览器功能触发。**实际上很少有人知道可以通过 JavaScript 在任何时刻触发任何事件，而这些事件会被当成浏览器创建的事件**。这意味着同样会有事件冒泡，因而也会触发相应的事件处理程序。这种能力在 Web 应用测试时特别有用。DOM3 规范指明了模拟特定类型事件的方式。

## DOM 事件模拟

任何时候，都可以使用`document.createEvent()`方法创建一个`event`对象（这个返回的对象必须先初始化，并且可以被传递给`element.dispatchEvent`）。这个方法接收一个参数，这个参数是一个表示要创建事件类型的字符串。在 DOM2 中，所有这些字符串都是英文复数形式，但是在 DOM3 中，都改为了英文单数形式。可用的字符串是以下值之一：

- `"UIEvents"`（DOM3 中是`"UIEvent"`）：通用用户界面事件（鼠标事件和键盘事件都是继承自这个事件）。
- `"MouseEvents"`（DOM3 中是`"MouseEvent"`）：通用鼠标事件。
- `"HTMLEvents"`（DOM3 中没有）：通用 HTML 事件（已经分散到了其他事件大类中）。

注意键盘事件不是在 DOM Events2 中规定的，而是后来在 DOM Events3 中增加的。

创建`event`对象后，需要使用事件相关的信息来初始化。每种类型的`event`对象都有特定的方法，可以使用相应数据来完成初始化。方法的名字并不相同，这取决于调用`createEvent()`时传入的参数。

事件模拟的最后一步是触发事件。为此要使用`dispatchEvent()`方法，这个方法存在于所有支持事件的 DOM 节点上。`dispatchEvent()`方法接收一个参数，即表示要触发事件的`event`对象。调用`displayEvent()`方法之后，事件就“转正”了，接着便冒泡并触发事件处理程序执行。

### 模拟鼠标事件

模拟鼠标事件需要先创建一个新的鼠标`event`对象，然后再使用必要的信息对其进行初始化。要创建鼠标`event`对象，可以调用`createEvent()`方法并传入`"MouseEvents"`参数。这样就会返回一个`event`对象，这个对象有一个`initMouseEvent()`方法，用于为新对象指定鼠标的特定信息。`initMouseEvent()`方法接收 15 个参数，分别对应鼠标事件会暴露的属性。这些参数和鼠标事件的`event`对象属性是一一对应的。前 4 个参数：`type`，`bubbles`，`cancelable`，`view`（表示与事件关联的视图，基本上始终是`document.defualtView`）是正确模拟事件**唯一重要的几个参数**，这是因为它们是浏览器要用的，其他参数则是事件处理程序要用的。`event`对象的`target`属性会自动设置为调用`dispatchEvent()`方法时传入的节点（例子：`target.dispatchEvent(event)`）。

```javascript
const btn = document.getElementById('myBtn')

const event = document.createEvent('MouseEvent')

event.initMouseEvent(
  'click',
  true,
  true,
  document.defaultView,
  0,
  0,
  0,
  0,
  0,
  false,
  false,
  false,
  false,
  0,
  null
)

btn.disptachEvent(event)
```

所有的鼠标事件，包括`dblclick`事件都可以像这样在 DOM 合规的浏览器中模拟出来。

# 总结

事件是 JavaScript 和网页结合的主要方式。最常见的事件是在 DOM3 Events 规范或在 HTML5 中定义的。虽然基本的事件都有规范定义，但是很多浏览器在规范之外实现了自己专有的事件，以便开发者更好地满足用户交互需求。其中有一些专有事件直接与特殊的设备相关。

围绕着使用事件，需要考虑内存与性能问题。例如：

- 最好限制一个页面中事件处理程序的数量，因为它们会占用过多内存，导致页面响应缓慢；
- 利用事件冒泡，事件委托可以解决限制事件处理程序数量的问题；
- 最好在页面卸载之前删除所有事件处理程序；

使用 JavaScript 也可以在浏览器中模拟事件。DOM2 Events 和 DOM3 Events 规范提供了模拟方法，可以模拟所有原生 DOM 事件。

事件是 JavaScript 中最重要的主题之一，理解事件的原理及其对性能的影响非常重要。

<iframe width="560" height="315" src="https://www.youtube.com/embed/jOupHNvDIq8" title="Nodejs如何工作" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
