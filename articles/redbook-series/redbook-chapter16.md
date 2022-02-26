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
|            `type`            | `AbstractView` | 只读  |      与事件相关的抽象视图。等于事件所发生的`window`对象      |

