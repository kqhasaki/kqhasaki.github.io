---
title: 红宝书系列（十七）事件
date: 2022-02-22
cover: https://tva1.sinaimg.cn/large/008i3skNgy1gy6bw9bv2hj30jg0oo40x.jpg
---

JavaScript 与 HTML 的交互是通过事件实现的，**事件代表文档或浏览器窗口某个有意义的时刻**。可以使用仅在事件发生时执行的**监听器**（也叫处理程序）订阅事件。在传统软件工程领域，这个模型叫“观察者模式”，其能够做到页面行为（在 JavaScript 中定义）与页面展示（在 HTML 和 CSS 中定义）的分离。

事件最早时在 IE3 和 Netscape Navigator2 中出现的，当时的用意是把某些表单处理工作从服务器转移到浏览器上来。到了IE4和Netscape Navigator3发布的时候，这两家浏览器都提供了类似但又不同的API，而且持续了好几代。**DOM2开始尝试以符合逻辑的方式来标准化DOM事件API**。**目前所有现代浏览器都实现了DOM2 Events的核心部分**。IE8是最后一个使用专有事件系统的主浏览器。

浏览器的事件系统非常复杂。即使所有主流浏览器都实现了DOM2 Events，规范也没有涵盖所有的事件类型。BOM也支持事件，这些事件与DOM事件之间的关系由于长期以来缺乏文档，经常容易被混淆（HTML5已经致力于明确这些关系）。而DOM3新增的事件API又让这些问题进一步复杂化了。根据具体的需求不同，使用事件可能会相对简单，也可能会非常复杂。但无论如何，理解其中的核心概念还是最重要的。

# 事件流

在第四代Web浏览器（IE4和Netscape Communicator4）开始开发时，开发团队碰到一个有意思的问题：页面的哪个部分拥有特定的事件呢？要理解这个问题，可以在一张纸上画几个同心圆。将手指放到圆心上，则手指不仅是在一个圆圈里，而是在所有的圆圈里。两家浏览器的开发团队都是以同样的方式来看待浏览器事件的。当你点击一个按钮时，实际上不光点击了这个按钮，点击了它的容器及整个页面。

**事件流**描述了页面接收事件的顺序。结果非常有意思，IE和Netscape开发团队提出了几乎完全相反的事件流方案。IE将支持事件冒泡流，而Netscape Communicator将支持事件捕获流。

## 事件冒泡

IE事件流被称为**事件冒泡**，这是因为事件被定义为从最具体的元素（文档树中最深的节点）开始出发，然后向上传播至没有那么具体的元素（文档）。例如点击页面的某个元素`<div>`，被点击的元素会最先触发`click`事件。然后`click`事件沿DOM树一路向上，在经过每个节点上依次触发，直到到达`document`对象。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1gzmnynfsx4j21na0hsgmq.jpg)

所有现代浏览器都支持事件冒泡，这是实现方式上有一些区别。现代浏览器中的事件会一直冒泡到`window`对象。

## 事件捕获

Netscape Communicator团队提出了另一种名为**事件捕获**的事件流。事件捕获的意思是最不具体的节点应该最先收到事件，而最具体的节点应该最后收到事件。事件捕获实际上是为了在事件到达最终目标前拦截事件。如果前面的例子使用事件捕获，则点击`<div>`元素会以下列顺序触发`click`事件：

1. `document`
2. `<html>`
3. `<body>`
4. `<div>`

在事件捕获中，`click`事件首先由`document`元素捕获，然后沿DOM树依次向下传播，直至到达实际的目标元素`<div>`。虽然这是Netscape Communicator唯一的事件流模型，但事件捕获得到了所有现代浏览器的支持。事件上所有浏览器都是从`window`对象开始捕获事件，而DOM2 Events规范规定的是从`document`开始。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1gzmo5axiwgj21pi0icwfm.jpg)

由于旧版浏览器不支持，因此实际当中几乎不会使用事件捕获。**通常情况下建议使用事件冒泡，少数特殊情况下可以使用事件捕获**。

## DOM事件流

DOM2 Events规范规定事件流分为3个阶段：事件捕获、到达目标和事件冒泡。事件捕获最先发生，为提前拦截事件提供了可能。然后实际的目标元素接收到事件。最后一个阶段是冒泡，最迟要在这个阶段响应事件。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1gzmo8tkxz6j21py0jiabp.jpg)

在DOM事件流中，实际的目标在捕获阶段不会接收到事件。这是因为捕获阶段从`document`到`<html>`再到`<body>`就结束了。下一阶段，即会在`<div>`元素上触发事件的“到达目标”阶段，通常在事件处理时被认为是冒泡阶段的一部分。然后冒泡阶段开始，事件反向传播至文档。

大多数支持DOM事件流的浏览器实现了一个小小的扩展。虽然DOM2 Events规范明确捕获阶段不命中事件目标，但是现代浏览器都会在捕获阶段在事件目标上触发事件。最终结果是在事件目标上有两个机会来处理事件。

所有现代浏览器都支持DOM事件流。

# 事件处理程序

事件意味着用户或者浏览器执行的某种动作。例如，单击（`click`）、加载（`load`）、鼠标悬停（`mouseover`）。为响应事件而调用的函数被称为**事件处理程序**或者**事件监听器**。事件处理程序的名字以`"on"`开头，因此`click`事件的处理程序叫做`onclick`，而`load`事件的处理程序叫做`onload`。有很多方式可以指定事件处理程序。

## HTML事件处理程序

特定元素支持的每个事件都可以使用事件处理程序的名字以HTML属性的形式来指定。此时属性值必须是能够执行的JavaScript代码。例如，要在按钮被点击时执行某些JavaScript代码，可以使用以下HTML属性：

```html
<input type="button" value="click me" onclick="console.log('clicked')" />
```

点击这个按钮以后，控制台会输出。这种交互能力是通过为`onclick`属性指定JavaScript代码来实现的。注意，因为属性的值是JavaScript代码，所以不能在未经转义的情况下使用HTML语法字符。

在HTML中定义的事件处理程序可以包含精确的动作指令，也可以调用在页面其他地方定义的脚本，例如：

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
  <input type="text" name="username" value="">
  <input type="button" value="echo username" onclick="console.log(username.value)">
</form>
```

以上事件处理程序中的代码直接引用了`username`。

在HTML中指定事件的处理程序会有一些问题。第一个问题是时机问题。有可能HTML元素已经显示在页面上，用户都与其交互了，而事件处理程序的代码还无法执行。例如前面的例子，如果`showMessage()`函数是在页面后面，在按钮中代码的后面定义的，那么当用户在`showMessage()`函数被定义之前点击按钮时，就会发生错误。为此，大多数HTML事件处理程序会封装在`try/catch`中，以便在这种情况下**静默失败**。

```html
<input type="button" value="click me" onclick="try{showMessage();}catch(ex) {}">
```

另一个问题是对事件处理程序作用域链的扩展在不同浏览器中可能导致不同的结果。不同JavaScript引擎中标识符解析的规则存在差异，因此访问无限定的对象成员可能导致错误。

使用HTML指定事件处理程序的最后一个问题是HTML与JavaScript强耦合。如果需要修改事件处理程序，必须在两个地方，即HTML和JavaScript中同时修改代码。这导致实际开发中没有人会使用HTML直接指定事件处理程序，而是在JavaScript中指定事件处理程序。

## DOM0事件处理程序

在JavaScript中指定事件处理程序的传统方式是把一个函数赋值给（DOM元素的）一个事件处理程序属性。这也是在第四代Web浏览器中开始支持的事件处理程序赋值方法，直到现在所有现代浏览器仍然都支持此方法，主要原因是简单。要使用JavaScript指定事件处理程序，必须先取得要操作对象的引用。

每个元素（包括`window`和`document`）都有通常小写的事件处理程序属性，例如`onclick`。只要把这个属性赋值为一个函数即可：

```javascript
const btn = document.getElementById('myBtn')

btn.onclick = function () {
  console.log('clicked')
}
```

这里先从文档中取得按钮，然后给它的`onclick`事件处理程序赋值一个函数。注意前面的代码在运行之后才会给事件处理程序赋值。因此如果在页面中上面的代码出现在按钮之后，有可能出现用户点击按钮没有反应的情况。

像这样使用DOM0方式为事件处理程序赋值时，所赋函数被视为元素的方法。因此事件处理程序会在元素的作用域中运行，即`this`等于元素。

```javascript
const btn = document.getElementById('myBtn') 

btn.onclick = function () {
  console.log(this.id) // 'myBtn'
}
```

点击按钮，这段代码会显示元素的ID。这个ID是通过`this.id`获取的，不仅仅是`id`，在事件处理程序中可以通过`this`访问元素的任何属性和方法。以这种方式添加事件处理程序是注册在事件流的冒泡阶段的。

通过将事件处理程序属性的值设置为`null`，可以移除通过DOM0方式添加的事件处理程序，如下例子所示：

```javascript
btn.onclick = null // 移除事件处理程序
```

将事件处理程序设置为`null`，再点击按钮就不会执行任何操作了。

> 如果事件处理程序是在HTML中指定的，则`onclick`属性的值是一个包装相应HTML事件处理程序属性值的函数。这些事件处理程序也可以通过在JavaScript中将相应属性值设置为`null`来移除。

## DOM2事件处理程序

DOM2 Events为事件处理程序的赋值和移除定义了两个方法：`addEventListener()`和`removeEventListener()`。这两个方法暴露在所有的DOM节点上，它们接收3个参数：事件名、事件处理函数和一个布尔值，`true`代表在捕获阶段调用事件处理程序，`false`（默认值）表示在冒泡阶段调用事件处理程序。

例如给按钮添加`click`事件处理程序：

```javascript
const btn = document.getElementById('myBtn') 

btn.addEventListener('click', () => {
  console.log(this.id)
}, false)
```

以上代码为按钮添加了会在事件冒泡阶段触发的`onclick`事件处理程序（因为最后一个参数为`false`）。与DOM0方法类似，这个事件处理程序同样在被附加到的元素的作用域中运行。**使用DOM2方式的主要优势是可以为同一个事件添加多个事件处理程序**。看下面的例子：

```javascript
const btn = document.getElementById('myBtn')

btn.addEventListener('click', () => {
  console.log(this.id)
}, false)
btn.addEventListener('click', () => {
  console.log('Hello World!')
}, false)
```

这里给按钮添加了两个事件处理程序。多个事件处理程序以添加顺序来触发，因此前面的代码会先打印元素ID，然后显示消息`"Hello World!"`。

通过`addEventListener()`添加的事件处理程序**只能使用`removeEventListener()`并出入与添加时同样的参数来移除**。

> 这意味着通过`addEventListener()`添加的匿名函数无法移除。

```javascript
const btn = document.getElementById('myBtn')
const handler = function() {
  console.log(this.id)
}
btn.addEventListener('click', handler, false)
btn.removeEventListener('click', handler, false)
```

大多数情况下，事件处理程序会被天际到事件流的冒泡阶段，主要是跨浏览器兼容性好。把事件注册到捕获阶段通常用于在事件到达其目标之前拦截事件。如果不需拦截，则不要使用事件捕获。

## 跨浏览器事件处理程序

为了以垮浏览器兼容的方式处理事件，很多开发者会选择使用一个JavaScript库，其中抽象了不同浏览器的差异。

# 事件对象

在DOM中发生事件时，所有相关信息都会被收集并存储在一个名为`event`的对象中。这个对象包含了一些基本信息，例如导致事件的元素、发生的事件类型，以及可能与特定事件相关的任何其他数据。例如，鼠标操作导致的事件会生成鼠标位置信息，而键盘操作导致的事件会生成与被按下的键有关的信息。所有浏览器都支持这个`event`对象，尽管支持方式不同。

## DOM事件对象

**在DOM合规的浏览器中，`event`对象是传给事件处理程序的唯一参数**。不管以哪种方式（DOM0或DOM2）指定事件处理程序，都会传入这个event对象。

```javascript
const btn = document.getElementById('btn')
btn.onclick = function(event) {
  console.log(event.type)
}

btn.addEventListener('click', (event) => {
  console.log(event.type)
}, false)
```

在通过HTML属性指定的事件处理程序中，一样可以使用`event`引用事件对象。

```html
<input type="button" value="click me" onclick="console.log(event.type)" />
```

以这种方式提供`event`对象，可以让HTML属性中的代码实现与JavaScript函数同样的功能。

如前所述，事件对象包含与特定事件相关的属性和方法。不同的事件生成的事件对象也会包含不同的属性和方法。不过，所有事件对象都会包含一些公共成员：

|          属性/方法           |      类型      | 读/写 |                             说明                             |
| :--------------------------: | :------------: | :---: | :----------------------------------------------------------: |
|          `bubbles`           |     布尔值     | 只读  |                       表示事件是否冒泡                       |
|         `cancelable`         |     布尔值     | 只读  |                表示是否可以取消事件的默认行为                |
|       `currentTarget`        |      元素      | 只读  |                  当前事件处理程序所在的元素                  |
|      `defaultPrevented`      |     布尔值     | 只读  |    `true`表示已经调用`preventDefault()`方法（DOM3中新增）    |
|           `detail`           |      整数      | 只读  |                      事件相关的其他信息                      |
|         `eventPhase`         |      整数      | 只读  | 表示调用事件处理程序的阶段：1代表捕获，2代表到达目标，3代表冒泡阶段 |
|      `preventDefault()`      |      函数      | 只读  | 用于取消事件的默认行为。只有`cancelable`为`true`才可以调用这个方法 |
| `stopImmediatePropagation()` |      函数      | 只读  | 用于取消所有后续事件捕获或事件冒泡，并组织调用任何后续事件处理程序（DOM3中新增） |
|     `stopPropagation()`      |      函数      | 只读  | 用于取消所有后续事件捕获或事件冒泡。只有`bubbles`为`true`才可以调用此方法 |
|           `target`           |      元素      | 只读  |                           事件目标                           |
|          `trusted`           |     布尔值     | 只读  | `true`表示事件是由浏览器生成的。`false`表示事件是开发者通过JavaScript创建的（DOM3新增） |
|            `type`            |     字符串     | 只读  |                       被触发的事件类型                       |
|            `view`            | `AbstractView` | 只读  |      与事件相关的抽象视图。等于事件所发生的`window`对象      |

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
  console.log(event.currentTarget === document.body)  // true
  console.log(this === document.body) // true
  console.log(event.target === document.getElementById('myBtn')) // true 
}
```

这种情况下点击按钮，`this`和`currentTarget`都等于`document.body`，因为它是注册事件处理程序的元素。而`target`属性等于按钮本身，这是因为那才是`click`事件真正的目标。由于按钮本身没有注册事件处理程序，因此`click`事件冒泡到`document.body`，从而触发了它上面注册的处理程序。

`type`属性在一个处理程序处理多个事件时很有用。例如：

```javascript
const btn = document.getElementById('myBtn')
const handler = function (event) {
  switch(event.type) {
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

在这个例子中，函数`handler`被用于处理3种不同的事件：`click`、`mouseover`和`mouseout`。这个函数使用`event.type`属性确定了事件类型，从而可以做出不同的响应。

`preventDefault()`方法用于组织特定事件的默认动作。例如链接元素的默认行为就是在被单击时导航到`href`属性指定的URL。如果想阻止这个导航行为，可以在`onclick`事件处理程序中取消，如下：

```javascript
const link = document.getElementById('myLink')
link.onclick = function (event) {
  event.preventDefault()
}
```

任何可以通过`preventDefault()`取消默认行为的事件，其事件对象的`cancelable`属性都会设置为`true`。

`stopPropagation()`方法用于立即组织事件流在DOM结构中传播，取消后续的事件捕获或冒泡。例如，直接添加到按钮的事件处理程序中调用`stopPropagation()`，可以阻止`document.body`上注册的事件处理程序执行。例如：

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

`eventPhase`属性可以用于确定事件流当前所处的阶段。如果事件处理程序在捕获阶段被调用，则`eventPhase`等于1；如果事件处理程序在目标上被调用，则`eventPhase`等于2；如果事件处理程序在冒泡阶段被调用，则`eventPhase`等于3。不过要注意的是，虽然“到达目标”是在冒泡阶段发生的，但其`eventPhase`仍然等于2。

```javascript
const btn = document.getElementById('myBtn')
btn.onclick = function (event) {
  console.log(event.eventPhase) // 2
}
document.body.addEventListener('click', event => {
  console.log(event.eventPhase) // 1
}, true)
document.body.onclick = event => {
  console.log(event.eventPhase) // 3
}
```

这个例子中，点击按钮首先会触发注册在捕获阶段的`document.body`上的事件处理程序，显示`eventPhase`为1。接着，会触发按钮本身的事件处理程序（尽管是注册在冒泡阶段），此时显示`eventPhase`等于2。最后触发的是注册在冒泡阶段的`document.body`上的事件处理程序，显示为`eventPhase`为3。而当`eventPhase`等于2时，`this`、`target`和`currentTarget`三者相等。

> `event`对象只会在事件处理程序执行期间存在，一旦执行完毕，就会被销毁。

# 事件类型

Web浏览器中可以发生很多种事件。如前所述，所发生事件的类型决定了事件对象中会保存什么信息。DOM3 Events定义了如下的事件类型：

- **用户界面事件**（`UIEvent`）：涉及与BOM交互的通用浏览器事件。
- **焦点事件**（`FocusEvent`）：在元素获得和失去焦点时触发。
- **鼠标事件**（`MouseEvent`）：使用鼠标在页面上执行某些操作时触发。
- **滚轮事件**（`WheelEvent`）：使用鼠标滚轮（或类似设备）时触发。
- **输入事件**（`InputEvent`）：向文档中输入文本时触发。
- **键盘事件**（`KeyboardEvent`）：使用键盘在页面上执行某些操作时触发。
- **合成事件**（`CompositionEvent`）：在使用某种IME（输入法编辑器）输入字符时触发。

除了这些事件类型之外，HTML5还定义另外一组事件，而浏览器通常在DOM和BOM上实现专有事件。这些专有事件基本上都是根据开发者需求而不是按照规范增加的，因此不同浏览器的实现可能不同。

DOM3 Events在DOM2 Events基础上重新定义了事件，并且添加了新的事件类型。所有主流浏览器都支持DOM2 Events和DOM3 Events。

## 用户界面事件

用户界面事件或UI事件不一定跟用户操作有关。这类事件在DOM规范出现之前就已经以某种形式存在了，保留它们是为了向后兼容。UI事件主要有以下几种：

- `DOMActivate`：元素被用户通过鼠标或键盘操作激活时触发（比`click`或`keydown`更通用）。这个事件在DOM3 Events中已经废弃。
- `load`：在`window`上当页面加载完成后触发，在窗套(`<frameset>`)上当所有窗格（`<frame>`）都加载完成后触发，在`<img>`元素上当图片加载完成后触发，在`<object>`元素上当相应对象加载完成后触发。
- `unload`：在`window`上当页面完全卸载后触发，在窗套上当所有窗格都卸载完成后触发，在`<object>`元素上当相应对象卸载完成后触发。
- `abort`：在`<object>`元素上当相应对象加载完成前被用户提前终止下载时触发。
- `error`：在`window`上当JavaScript加载报错时触发，在`<img>`元素上当无法加载指定图片时触发，在`<object>`元素上当无法加载相应对象时触发，在窗套上当一个或多个窗格无法完成加载时触发。
- `select`：在文本框（`<input>`或者`<textarea>`）上当用户选择了一个或多个字符时触发。
- `resize`：在`window`或窗格上当窗口或窗格被缩放时触发。
- `scroll`：当用户滚动包含滚动条的元素时在元素上触发。`<body>`元素包含已加载页面的滚动条。

大多数HTML事件与`window`对象和表单控件有关。

除了`DOMActivate`这些事件在DOM2 Events中都归类为HTML Events。

### `load`事件

`load`事件可能是JavaScript中最常用的事件。在`window`对象上，`load`事件会在整个页面（包括所有外部资源如图片、JavaScript文件和CSS文件）加载完成后触发。可以通过两种方式指定`load`事件处理程序。第一种是JavaScript方式：

```javascript
window.addEventListener('load', event => {
  console.log('loaded!')
})
```

这是使用`addEventListener()`方法来指定事件处理程序。和其他事件一样，事件处理程序会接收到一个`event`对象。这个`event`对象并没有提供有关这种类型事件的额外信息，虽然在DOM合规的浏览器中，`event.target`会被设置为`document`。

第二种指定`load`事件处理程序的方式是向`<body>`元素添加`onload`属性。实际开发中最好使用JavaScript方式。

> 根据DOM2 Events，`load`事件应该在`document`而非`window`上触发。但是为了向后兼容，所有浏览器都在`window`上实现了`load`事件。

图片上也会触发`load`事件，包括DOM中的图片和非DOM中的图片。可以在HTML直接给`<img>`元素的`onload`属性指定事件处理程序。

```html
<img src="smile.gif" onload="console.log('image loaded.')" />
```

```javascript
const image = document.getElementById('my Image')
image.addEventListener('load', event => {
  console.log(event.target.src)
})
```

这里使用JavaScript为图片制定了load事件处理程序。处理程序会接收到`event`对象，虽然这个对象上没有多少有用的信息。这个事件的目标是`<img>`元素，因此可以直接从`event.target.src`属性中取得图片地址并打印出来。

在通过JavaScript创建新`<img>`元素时，也可以给这个元素指定一个在加载完成后执行的事件处理程序。这里，关键是要在赋值`src`属性前指定事件处理程序：

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

这个了例子首先为`window`制定了一个`load`事件处理程序。因为示例涉及向DOM中添加新元素，所以必须确保页面已经加载完成。如果在页面加载完成之前操作`document.body`，则会导致错误。然后，代码创建了一个新的`<img>`元素，并为这个元素设置了`load`事件处理程序。最后才把元素添加到文档中并指定了其`src`属性。**注意，下载图片并不一定要把`<img>`元素添加到文档，只要给他设置了`src`属性它就会立即开始下载**。

同样的技术也适用于DOM0的`Image`对象。在DOM出现之前，客户端都使用`Image`对象预先加载图片。可以像使用前面（通过`createElement()`方法创建）的`<img>`元素一样使用`Image`对象。只是不能把后者添加到DOM树。

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

一般来说很少会在JavaScript代码中使用`unload`事件。

### `resize`事件

当浏览器窗口被缩放到新高度或宽度时，会触发`resize`事件。这个事件在`window`上触发，因此可以通过JavaScript在`window`上或者为`<body>`元素添加`onresize`属性来指定事件处理程序。优先使用JavaScript方式：

```javascript
window.addEventListener('resize', event => {
  console.log('Resized')
})
```

类似于其他在`window`上发生的事件，此时会生成`event`对象，且这个对象的`target`属性在DOM合规的浏览器中是`document`。

不同浏览器在决定何时触发`resize`事件上存在着重要差异。有的浏览器会在缩放超过1像素时触发`resize`事件，然后随着用户缩放浏览器窗口不断触发。有的仅仅在用户停止缩放浏览器窗口时触发。无论如何都应该避免在这个事件处理程序中做过多计算，否则可能由于执行过于频繁而导致浏览器响应变慢。事实上除非特殊用途否则不要使用这个事件处理程序。

> 部分浏览器窗口在最大化和最小化时也会触发`resize`事件。

### `scroll`事件

虽然`scroll`事件发生在`window`上，但是实际上反映的是页面中相应元素的变化。在混杂模式下，可以通过`<body>`元素检测`scrollLeft`和`scrollTop`属性的变化。而在标准模式下，这些变化在除早期版本的Safari之外的所有浏览器中都发生在`<html>`元素上（早期Safari在`<body>`上跟踪滚动位置）。

类似于`resize`，`scroll`事件也会随着文档滚动而重复触发，因此最好保持事件处理程序的代码尽可能简单。

## 焦点事件

焦点事件在页面元素获取或失去焦点时触发。这些事件可以与`document.hasFocus()`和`document.activeElement`一起为开发者提供用户在页面中导航的信息。焦点事件有以下6种：

- `blur`：当元素失去焦点时触发。**这个事件不冒泡**，所有浏览器都支持。
- `DOMFocusIn`：当元素获得焦点时触发。这个事件是`focus`的冒泡版，DOM3废弃了这个事件，推荐使用`focusin`。
- `DOMFocusOut`：当元素失去焦点时触发。这个事件是`blur`的通用版，DOM3废弃了这个事件，推荐使用`focusout`。
- `focus`：当元素获得焦点时触发。**这个事件不冒泡**，所有浏览器都支持。
- `focusin`：当元素获得焦点时触发。这个事件是`focus`的冒泡版。
- `focusout`：当元素失去焦点时触发。这个事件时`blur`的通用版。

焦点事件中的两个主要事件是`focus`和`blur`，这两个事件在JavaScript早期就得到了浏览器支持。它们最大的问题是不支持冒泡。这导致后来IE增加了`focusin`和`focusout`，Opera又增加了`DOMFocusIn`和`DOMFocusOut`。IE新增的这两个事件已经被DOM3 Events标准化。

当焦点从页面中的一个元素移到另一个元素时，会依次发生如下事件：

1. `focusout`在失去焦点的元素上触发。
2. `focusin`在获得焦点的元素上触发。
3. `blur`在失去焦点的元素上触发。
4. `focus`在获得焦点的元素上触发。

其中，`blur`和`focusout`的事件目标是失去焦点的元素，而`focus`和`focusin`的事件目标是获得焦点的元素。

## 鼠标和滚轮事件

**鼠标事件**是Web开发中最常用的一组事件，只是因为鼠标是用户最主要的定位设备。DOM3 Events定义了9种鼠标事件：

- `click`：在用户单击鼠标主键（通常是左键）或者按回车键时触发。这主要是基于无障碍的考虑，让键盘和鼠标都可以触发`onclick`事件处理程序。
- `dblclick`：在用户双击鼠标主键（通常是左键）时触发。这个事件不是在DOM2 Events中定义的，但是得到了很好的支持，DOM3 Events将其进行了标准化。
- `mousedown`：**用户按下任意鼠标按键时触发**。这个事件不能通过键盘触发。
- `mouseenter`：在用户把光标从元素外部移动到元素内部时触发。**这个事件不冒泡，也不会在光标经过后代元素时触发**。`mouseenter`事件不是在DOM2 Events中定义的，而是DOM3 Events中新增的事件。
- `mouseleave`：在用户把光标从元素内部移动到元素外部时触发。**这个事件不冒泡，也不会在光标经过后代元素时触发**。`mouseleave`事件不是在DOM2 Events中定义的，而是DOM3 Events中新增的事件。
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
const div = document.getElementById("myDiv")
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

虽然鼠标事件主要是通过鼠标触发的，但有时候要确定用户想要实现的操作，还要考虑键盘按键的状态。键盘上的**修饰键**Shift、Ctrl、Alt和Meta经常用于修改鼠标事件的行为。DOM规定了4个属性来表示这四个修饰键的状态：`shiftKey`、`ctrlKey`、`altKey`和`metaKey`。这几个属性会在各自对应的修饰键被按下时包含布尔值`true`，没有被按下时包含`false`。在鼠标事件发生的，可以通过这几个属性来检测修饰键是否被按下。

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

> 所有现代浏览器都支持这4个修饰键。

### 相关元素

对`mouseover`和`mouseout`事件而言，还存在与事件相关的其他元素。这两个事件都涉及从一个元素的边界之内把光标移动到另一个元素的边界之内。对`mouseover`元素来说，事件的主要目标是获得光标的元素，相关元素是失去光标的元素。类似地对于`mouseout`事件来说，事件的主要目标是失去光标的元素，而相关元素是获得光标的元素。

DOM通过`event`对象的`relatedTarget`属性提供了相关元素的信息。这个属性只有在`mouseover`和`mouseout`事件发生时才包含值，其他所有事件的这个属性值都是`null`。

### 鼠标按键

只有在元素上单击鼠标主键（或按下键盘回车键）时`click`事件才会触发，因此按键信息并不是必须的。对`mousedown`和`mouseup`事件来说，`event`对象上会有一个`button`属性，表示按下或释放的是哪个按键。DOM位这个`button`属性定义了三个值：`0`表示鼠标主键，`1`表示鼠标中键（通常也是滚轮键），`2`表示鼠标附键。按照惯例，鼠标主键通常是左边的按键，附键通常是右边的按键。

### 额外事件信息

DOM2 Events规范在`event`对象上提供了`detail`属性，以给出更多关于事件的信息。对鼠标事件来说，`detail`包含一个数值，表示在给定位置上发生了多少次单击。单击相当于在同一个像素上发生一次`mousedown`紧跟一次`mouseup`。`detail`的值从1开始，每次单击会加1。如果鼠标在`mousedown`和`mouseup`之间移动了，则`detail`会重置为0。

### `mousewheel`事件

`mousewheel`事件在HTML5标准中添加，会在用户使用鼠标滚轮时触发，包括在垂直方向上任意滚动。这个事件会在任何元素上触发，并且冒泡到`document`和`window`。`mousewheel`事件的`event`对象包含鼠标事件的所有标准信息，此外还有一个名为`wheelDelta`的新属性。当鼠标滚轮向前滚动时，`wheelDelta`每次都是+120；而当鼠标滚轮向后滚动时，`wheelDelta`每次都是-120。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1gztlp25q8bj213e0faaab.jpg)

可以为页面上的任何元素或文档添加`onmousewheel`事件处理程序，以处理所有鼠标滚轮交互。

```javascript
document.addEventListener('mousewheel', event => {
  console.log(event.wheelDelta)
})
```

### 触摸屏设备

iOS和Andriod等触摸屏设备的实现大相径庭，因为触摸屏通常不支持鼠标操作。在为触摸屏设备开发时，需要记住：

- **不支持`dblclick`事件**。双击浏览器窗口可以放大，但是没有办法覆盖这个默认行为。
- 单指点触屏幕上的可点击元素会触发`mousemove`事件。如果操作会导致内容发生变化，则不会再触发其他事件。如果屏幕上没有变化，则会相继触发`mousedown`、`mouseup`和`click`事件。点触不可点击的元素不会触发事件。可点击元素是指点击时有默认动作的元素（如链接）或指定了`onclick`事件处理程序的元素。
- `mousemove`事件也会触发`mouseover`和`mouseout`事件。
- 双指点触屏幕并滑动导致页面滚动时会触发`mousewheel`和`scroll`事件。

### 无障碍

如果Web应用需要考虑到残障人士通过屏幕阅读器使用，那么必须小心使用鼠标事件。如前所述，回车键可以触发`click`事件，但是其他鼠标事件不能通过键盘触发。因此建议不要使用除了`click`事件之外的其他鼠标事件像用户提示功能或者触发代码执行。因为其他鼠标事件会严格妨碍盲人或视觉障碍用户使用。下面是一些使用鼠标事件的无障碍建议：

- 使用`click`事件执行代码。
- 不要使用`mouseover`向用户显示新选项。同样是屏幕阅读器无法触发`mousedown`事件。
- 不要使用`dblclick`执行重要的操作，因为键盘不能触发这个事件。

遵循这些简单的建议可以极大提升Web应用对于残章人士的无障碍性。

## 键盘与输入事件

**键盘事件**是用户操作键盘时触发的。DOM2 Events最初定义了键盘事件，但该规范在最终发布前删除了相应内容。因此键盘事件很大程度上是基于原始的DOM0实现的。

DOM3 Events为键盘事件提供了一个首先在IE9中完全实现的规范。其他浏览器也开始实现该规范，但仍然存在很多遗留的实现。

键盘事件包含3个事件：

- `keydown`，用户按下键盘上某个键时触发，而且持续按住会重复触发。
- `keypress`，用户按下键盘上某个键并产生字符时触发，而且持续按住会重复触发。Esc键也会触发这个事件。DOM3 Events废弃了`keypress`事件，而推荐`textInput`事件。
- `keyup`，用户释放键盘上某个键时触发。

虽然所有元素都支持这些事件，但当用户在文本框输入内容时最容易看到。

输入事件只有一个，即`textInput`。这个事件是对`keypress`事件的扩展，用户在文本显示给用户之前更方便地截获文本输入。`textInput`会在文本被插入到文本框之前触发。
