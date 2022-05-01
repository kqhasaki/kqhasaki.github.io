---
title: （十五）DOM扩展
date: 2022-02-19
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h0xwli81noj218g0p0jrx.jpg
---

尽管 DOM API 已经相当不错，但仍然不断有标准或者专有的扩展出现，以支持更多的功能。2008 年以前，大部分浏览器对 DOM 的扩展是专有的。以后 W3C 开始着手将这些已经成为事实标准的专有扩展编制成正式规范。

基于以上背景，诞生了描述 DOM 扩展的两个标准：Selectors API 和 HTML5。这两个标准体现了社区需求和标准化某些手段及 API 的愿景。另外还有较小的 Element Traversal 规范，增加了一些 DOM 属性。专有扩展虽然还有，但是这两个规范（特别是 HTML5）已经覆盖了其中大部分。本章也会讨论专有扩展。

# Selectors API

JavaScript 库中最流行的一种能力就是根据 CSS 选择符的模式匹配 DOM 元素。例如 jQuery 就完全以 CSS 选择符 DOM 获取元素的引用，而不是使用`getElementById()`和`getElementByTagName()`。

Selectors API 是 W3C 推荐标准，规定了浏览器原生支持的 CSS 查询 API。支持这一特性的所有 JavaScript 库都会实现一个基本的 CSS 解析器，然后使用已有的 DOM 方法搜索文档并匹配目标节点。虽然库开发者在不断改进其性能，但是 JavaScript 代码能做到的毕竟有限。通过浏览器原生支持这个 API，解析和遍历 DOM 树可以通过底层编译语言实现，性能也有了数量级的提升。

Selectors API Level 1 的核心是两个方法：`querySelector()`和`querySelectorAll()`。在兼容浏览器中，`Document`类型和`Element`类型的实例上都会暴露这两个方法。Selectors API Level 2 规范在`Element`类型上新增了更多方法，例如`matches()`， `find()`和`findAll()`。不过，目前还没有浏览器实现或者宣称实现`find()`和`findAll()`。

## `querySelector()`

`querySelector()`方法接收 CSS 选择符参数，返回匹配该模式的第一个后代元素，如果没有匹配项则返回`null`。下面是一些例子：

```javascript
const body = document.querySelector('body')

const myDiv = document.querySelector('#myDiv')

const selected = document.querySelector('.selected')

const img = document.body.querySelector('img.button')
```

在`Document`上使用`querySelector()`方法时，会从文档元素开始搜索；在`Element`上使用`querySelector()`方法时，则只会从当前元素的后代中查询。

用于查询模式的 CSS 选择符可繁可简，依需求而定。如果选择符有语法错误或碰不到支持的选择符，则`querySelector()`方法**会抛出错误**。

## `querySelectorAll()`

`querySelectorAll()`方法跟`querySelector()`一样，也接收一个用于查询的参数，但它会返回所有匹配的节点，而且不止一个。这个方法返回的**是一个`NodeList`静态实例**。

再强调一次，`querySelectorAll()`返回的`NodeList`实例一个属性和方法都不缺，但是它是一个静态的“快照”而不是“实时”的查询。这样的底层实现避免了使用`NodeList`对象可能造成的性能问题。

> 注意，DOM Level 1 中定义的`document.getElementsByTagName()`方法返回的`HTMLCollection`对象是一个“实时”查询，访问该对象的代价比`querySelectorAll()`返回的`NodeList`静态实例要高昂许多。

以有效 CSS 选择符调用`querySelectorAll()`都会返回`NodeList`，无论匹配多少个元素都可以。如果没有匹配项，则返回空的`NodeList`实例。与`querySelector()`一样，`querySelectorAll()`也可以在`Document`、`DocumentFragment`和`Element`类型上使用。

```javascript
const elements = document.getElementById('myDiv').querySelector('em')
const selecteds = document.querySelectorAll('.selected')
const strongs = document.querySelectorAll('p strong')
```

返回的`NodeList`对象可以通过`for-of`循环、`item()`方法或者中括号语法取得个别元素。与`querySelector()`方法一样，如果选择符有语法错误或者碰到不支持的选择符，则方法抛出错误。

## `matches()`

`matches()`方法（在规范草案中成为`matchesSelector()`）接收一个 CSS 选择符参数，如果元素匹配则选择符则返回`true`，否则返回`false`。例如：

```javascript
if (document.body.matches('body.page1')) {
  // true
}
```

使用这个方法可以方便地检测某个元素会不会被`querySelector()`或者`querySelectorAll()`方法返回。所有主流浏览器均支持`matches()`。

# 元素遍历

IE9 之前的版本不会把元素间的空格当成空白节点，而其他浏览器会。这样就导致了`childNodes`和`firstChild`等属性上的差异。为了弥补这个差异，同时不影响 DOM 规范，W3C 通过新的 Element Traversal 规范定义了一组新属性。

Element Traversal API 为 DOM 元素添加了 5 个属性：

- `childElementCount`，返回子元素数量（不包含文本节点和注释节点）
- `firstElementChild`，指向第一个`Element`类型的子元素（`Element`版`firstChild`)
- `lastElementChild`，指向最后一个`Element`类型的子元素（`Element`版`lastChild`）
- `previousElementSibling`，指向前一个`Element`类型的同胞元素（`Element`版`previousSibling`）
- `nextElementSibling`，指向后一个`Element`类型的同胞元素（`Element`版`nextSibling`)

在支持的浏览器中，所有 DOM 元素都会有这些属性，为遍历 DOM 元素提供便利。这样开发者就不用担心空白文本节点的问题了。

# HTML5

HTML5 代表着与以前的 HTML 截然不同的方向。在所有以前的 HTML 规范中，从未出现过描述 JavaScript 接口的情形，HTML 就是一个纯粹标记语言。JavaScript 绑定的事情，一概交给 DOM 规范去定义。

然而 HTML5 规范却包含了大量与标记相关的 JavaScript API 定义。其中有的 API 与 DOM 重合，定义了浏览器应该提供的 DOM 扩展。

> 注意： 因为 HTML5 覆盖的范围极其广泛，所以这里讨论影响所有 DOM 节点的部分。HTML5 的其他特性不在此处讨论。

## CSS 扩展

自 HTML4 被广泛采用以来，Web 开发中一个主要变化是`class`属性使用得越来越多，其用处是为元素添加样式以及语义信息。自然地，JavaScript 和 CSS 类的交互就增多了，包括动态修改类名，以及根据给定的一个或一组类名查询元素，等等。为了适应开发者和他们对`class`属性的认可，HTML5 增加了一些特性以方便使用 CSS 类。

`getElementsByClassName()`是 HTML5 新增的最受欢迎的一个方法，暴露在`document`对象和所有 HTML 元素上。正方脱胎于基于原有 DOM 特性实现该功能的 JavaSript 库，提供了性能较高的原生实现。

`getElementsByClassName()`方法接收一个参数，即包含一个或者多个类名的字符串，返回类名中包含相应类的元素的`NodeList`。如果提供了多个类名，则顺序无关紧要。下面是几个示例：

```javascript
const allCurrentUserNames = document.getElementsByClassName('username current')
const selected = document
  .getElementById('myDiv')
  .getElementsByClassName('selected')
```

这个方法只会返回以调用它的对象为根元素的子树中所有匹配的元素。在`document`上调用`getElementsByClassName()`返回文档中所有匹配的元素，而在特定元素上调用`getElementsByClassName()`则返回该元素后代中匹配的元素。

如果要给包含特定类（而不是特定 ID 或标签）的元素添加事件处理程序，使用这个方法会很方便。不过要记住，因为返回值是`NodeList`，所以使用这个方法会遇到跟使用`getElementsByTagName()`和其他返回`NodeList`对象的 DOM 方法同样的问题。

IE9 及以上版本，以及所有的现代浏览器都支持`getElementsByClassName()`方法。

要操作类名，可以通过`className`属性实现添加、删除和替换。但是`className`是一个字符串，所以每次操作之后都需要重新设置这个值才能生效，即使只改动了部分字符串也一样。例如：

```html
<div class="bd user disabled">...</div>
```

这个`<div>`元素有 3 个类名。想要删除其中一个，就需先把`className`拆开，删除不想要的那个，再把剩余类的字符串设置回去。例如：

```javascript
const targetClass = 'user'
const classNames = div.className.split(/\s+/)
const idx = classNames.indexOf(targetClass)
if (idx > -1) {
  className.splice(i, 1)
}
div.className = classNames.join(' ')
```

这就是从`<div>`元素的类名中删除`"user"`类需要写的代码。替换类名和检测类名也要涉及同样的算法。添加类名只涉及字符串拼接，但必须先检查一下确保不会重复添加相同的类名。很多 JavaScript 库为这些操作实现了便利方法。

HTML5 通过给所有元素增加`classList`属性为这些操作提供了更简单也更安全的实现方式。`classList`是一个新的集合类型`DOMTokenList`的实例。和其他 DOM 集合类型一样，`DOMTokenList`也有`length`属性来表明自己包含多少项，也可以通过`item()`或中括号取得个别的元素。此外，`DOMTokenList`还增加了以下方法：

- `add(value)`，向类名列表中添加指定的字符串值`value`。如果这个值已经存在，则什么也不做。
- `contains(value)`，返回布尔值，表示给定的`value`是否存在。
- `remove(value)`，从类名列表中删除指定的字符串值`value`。
- `toggle(value)`，如果类名列表中已经存在指定的`value`则删除；如果不存在，则添加。

这样以来，之前的代码可以等价于：

```javascript
div.classList.remove('user')
```

这行代码可以再不影响其他类名的情况下完成删除。其他方法同样极大地简化了操作类名的复杂性，例如：

```javascript
div.classList.remove('disabled')
div.classList.add('current')
div.classList.toggle('user')
if (div.classList.contains('bd') && !div.classList.contains('disabled')) {
  // ...
}
for (const className of div.classList) {
  doStuff(className)
}
```

添加了`classList`属性之后，除非是完全删除或者是重写元素的`class`属性，否则`className`属性就用不到了。现代浏览器已经完全实现了`classList`属性。

## 焦点管理

HTML5 增加了辅助 DOM 焦点管理的功能。首先是`document.activeElement`，始终包含当前拥有焦点的 DOM 元素。页面加载时，可以通过用户输入（按 Tab 键或者代码中使用`focus()`方法）让某个元素自动获得焦点。

```javascript
const button = document.getElementById('myButton')
button.focus()
console.log(document.activeElement === button) // true
```

默认情况下，`document.activeElement`在页面刚刚加载完之后会设置为`document.body`。而在页面完全加载之前，`document.activeElement`值为`null`。

其次是`document.hasFocus()`方法，该方法返回布尔值，表示文档是否拥有焦点：

```javascript
const button = document.getElementById('myButton')
button.focus()
console.log(document.hasFocus()) // true
```

确定文档是否获得了焦点，就可以帮助确定用户是否在操作页面。

第一个方法可以用来查询文档，确定哪个元素拥有焦点，第二个方法可以查询文档是否获得了焦点，而这对于保证 Web 应用程序的无障碍使用是非常重要的。无障碍 Web 应用程序的一个重要方面就是焦点管理，而能够确定哪个元素当前拥有焦点是一个很大的进步。

## `HTMLDocument`扩展

HTML5 扩展了`HTMLDocument`类型，增加了更多功能。和其他 HTML5 定义的 DOM 扩展一样，这些变化同样基于所有浏览器事实上都已经支持的专有扩展。为此，即使这些扩展的标准化相对较晚，很多浏览器也早就实现了相应的功能。

`readyState`是 IE4 最早添加到`document`对象上的属性，后来其他浏览器也都依葫芦画瓢地支持这个属性。最终 HTML5 将这个属性写进了标准。`document.readyState`属性有两个可能的值：

- `loading`，表示文档正在加载
- `complete`，表示文档加载完成

实际开发中，最好是把`document.readyState`当成一个指示器，用来判断文档是否加载完毕。在这个属性得到广泛支持之前，通常要依赖`onload`事件处理程序设置一个标记，表示文档加载完了。这个属性的基本用法如下：

```javascript
if (document.readyState === 'complete') {
  // 执行操作
}
```

自从 IE6 提供了以标准或者混杂模式渲染页面的能力后，检测页面渲染模式成为一个必要的需求。IE 为`document`添加了`compatMode`属性，这个属性唯一的任务是指示浏览器当前处于什么渲染模式。如下面的例子所示，标准模式下`document.compatMode`的值是`CSS1Compat`，而在混杂模式下，`document.compatMode`的值是`BackCompat`：

```javascript
if (document.compatMode === 'CSS1Compat') {
  console.log('Standards mode')
} else {
  console.log('Quirks mode')
}
```

HTML5 最终也把`compatMode`属性的实现标准化了。

作为对`document.body`（指向文档`<body>`元素）的补充，HTML5 增加了`document.head`属性，指向文档的`<head>`元素。可以像下面这样直接取得`<head>`元素：

```javascript
const head = document.head
```

## 字符集属性

HTML5 增加了几个与文档字符集有关的新属性。其中，`characterSet`属性表示文档实际使用的字符集，也可以用来指定新字符集。这个属性的默认值是`"UTF-16"`，但可以通过`<meta>`元素或者响应头，以及新增的`characterSet`属性来修改。

```javascript
console.log(document.characterSet) // 'UTF-16'
document.characterSet = 'UTF-8'
```

## 自定义数据属性

HTML5 允许给元素指定非标准的属性，但要使用前缀`data-`以便告诉浏览器，这些属性既不包含与渲染有关的信息，也不包含元素的语义信息。除了前缀，自定义属性对命名是没有限制的，`data-`后面跟什么都可以。下面是一个例子：

```html
<div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>
```

定义了自定义数据属性后，可以通过元素的`dataset`属性来访问。`dataset`属性是一个`DOMStringMap`的实例，包含一组键/值对映射。元素的每个`data-name`在`dataset`中都可以通过`data-`后面的字符串作为键来访问（例如，属性`data-myname`、`data-myName`可以通过`myname`访问，但要注意`data-my-name`、`data-My-Name`要通过`myName`来访问）。

自定义数据属性非常适合需要给元素附加某些数据的场景，例如链接追踪和在聚合应用程序中标识页面的不同部分。另外，单页应用程序框架也非常多地使用了自定义数据属性。

## 插入标记

DOM 操作虽然已经为操纵节点提供了很多 API，但向文档中一次性插入大量 HTML 时还是比较麻烦。相比先创建一堆节点，再把它们以正确的顺序连接起来，直接插入一个 HTML 字符串要简单（快速）得多。HTML5 已经通过以下 DOM 扩展将这种能力标准化了。

在读取 innerHTML 属性时，会返回元素所有后代的 HTML 字符串，包括元素、注释和文本节点。而在写入`innerHTML`时，则会根据提供的字符串值以新的 DOM 子树替代元素中原来包含的所有节点。例如下面的 HTML 代码：

```html
<div id="content">
  <p>This is a <strong>paragraph</strong> with a list following it.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</div>
```

对于这里的`<div>`元素而言，其`innerHTML`属性会返回以下字符串：

```html
<p>This is a <strong>paragraph</strong> with a list following it.</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

实际返回的文本会因浏览器而不同。**不要指望不同浏览器的`innerHTML`会返回一样的值**。

在写入模式下，赋值给`innerHTML`属性的值会被解析为 DOM 子树，并替代元素之前的所有节点。因为所赋的值默认为 HTML，所以其中所有标签都会以浏览器处理 HTML 的方式转换为元素（同样，转换结果也会因为浏览器不同而不同）。如果赋值中不含任何 HTML 标签，则直接生成一个文本节点。

```javascript
div.innerHTML = 'some text'
```

> 注意设置`innerHTML`会导致浏览器将 HTML 字符串解析为相应的 DOM 树。这意味着设置`innerHTML`属性后再马上读出来会得到不同的字符串。因为返回的字符串是将原始字符串对应的 DOM 子树序列化之后的结果。

在所有现代浏览器中，通过`innerHTML`插入的`<script>`标签是不会执行的。

读取`outerHTML`属性时，会返回调用它的元素（及所有后代元素）的 HTML 字符串。在写入`outerHTML`属性时，调用它的元素会被传入的 HTML 字符串经解释之后生成的 DOM 子树取代。

使用本节介绍的方法替换子节点可能在浏览器中导致内存问题。例如，如果被移除的子树元素中之前有关联的事件处理程或其他 JavaScript 对象（作为元素的属性），那它们之间的绑定关系会滞留在内存中。如果这种替换操作频繁发生，页面的内存占用就会持续攀升。在使用`innerHTML`、`outerHTML`和`insertAdjacentHTML()`之前，最好要手动删除被替换元素上关联的事件处理程序和 JavaScript 对象。

使用这些属性也有方便的地方，特别是`innerHTML`。一般来说插入大量 HTML 时使用新的 HTML 字符串插入会比多次创建 DOM 节点再插入来得便捷。这是因为 HTML 解析器会解析设置给`innerHTML`（或者`outerHTML`的值）。解析器在浏览器中是底层代码，因此比 JavaScript 快得多。

尽管`innerHTML`不会执行自己创建的`<script>`标签，但仍然向恶意用户暴露了很大的攻击面，因为通过它可以毫不费力地创建元素并执行`onclick`之类的属性。出于安全考虑，尽量减少使用`innerHTML`。

## `scrollIntoView()`

DOM 规范中没有涉及的一个问题是如何滚动页面中的某个区域。为了填充该方面的缺失，不同浏览器实现了不同的控制滚动的方式。在所有这些专有的方法中，HTML5 选择了标准化`scrollIntoView()`。

`scrollIntoView()`方法存在于所有的 HTML 元素上，可以滚动浏览器窗口或者容器元素以便包含元素进入视口。这个方法的参数如下：

- `alignToTop`是一个布尔值。`true`：窗口滚动后元素的顶部与视口顶部对齐。`false`：窗口滚动后元素的底部与视口底部对齐。
- `scrollIntoViewOptions`是一个选项对象。`behavior`：定义过渡动画，可取的值为`"smooth"`和`"auto"`，默认为`"auto"`；`block`：定义垂直方向的对齐，可取的值为`"start"`，`"center"`，`"end"`，`"nearest"`，默认为`"start"`；`"inline"`：定义水平方向的对齐，可取值同上，默认为`"nearest"`。
- 不传参数默认为`alignToTop`为`true`。

这个方法可以用来在页面上发生某个事件时引起用户关注。把焦点设置到一个元素上也会导致浏览 器将元素滚动到可见位置。

# 专有扩展

尽管所有浏览器厂商都理解遵循标准的重要性，但它们都有为弥补功能缺失而为 DOM 添加专有扩展的历史。虽然表面上看是一件坏事，但是专有扩展也为开发者提供了很多重要功能，这些功能后来则有可能被标准化，例如进入 HTML5。

除了已经标准化的，各家浏览器还有很多未被标准化的专有扩展。这并不意味着它们将来不会被纳入标准。

## `children`属性

IE9 之前的版本与其他浏览器在处理空白文本节点上的差异导致了`children`属性的出现。`children`属性是一个`HTMLCollection`，只包含元素`Element`类型的子节点。如果元素的子节点类型全部是元素类型，那`children`和`childNodes`中包含的节点应该是一样的。可以像下面这样使用`children`属性：

```javascript
const childCount = element.children.length
const firstChild = element.children[0]
```

## `contains()`方法

DOM 编程中经常需要确定一个元素是不是另一个元素的后代。IE 首先引入了`contains()`方法，让开发者可以在不遍历 DOM 的情况下获取这个信息。`contains()`方法应该在要搜索的祖先元素上调用，参数是待确定的目标点。

如果目标节点是被搜索节点的后代，`contains()`返回`true`，否则返回`false`。

```javascript
console.log(document.documentElement.contains(document.body)) // true
```

这个例子测试`<html>`元素中是否包含`<body>`元素，在格式正确的 HTML 中会返回`true`。另外，使用 DOM Level3 的`compareDocumentPosition()`方法也可以确定节点间的关系。这个方法会返回表示两个节点关系的位掩码。

所有现代浏览器都支持`contains()`和`compareDocumentPosition()`方法。

## 插入标记

HTML5 将 IE 发明的`innerHTML`和`outerHTML`纳入了标准，但还有两个属性没有入选。这两个剩下的属性是`innerText`和`outerText`。

`innerText`属性对应元素中包含的所有文本内容，无论文本在子树中哪个层级。在用于读取值时，`innerText`会按照深度优先的顺序将子树中所有文本节点的值拼接起来。在用于写入值时，`innerText`会移除元素的所有后代并插入一个包含该值的文本节点。

```html
<div id="content">
  <p>This is a <strong>paragraph</strong> with a list of following it.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</div>
```

对这个例子中的`<div>`而言，`innerText`属性会返回以下字符串：

```
This is a paragraph with a list following it.
Item 1
Item 2
Item 3
```

注意不同的浏览器对待空格的方式不同，因此格式化之后的字符串可能包含也可能不包含原始 HTML 代码中的缩进。

`outerText`和`innerText`是类似的，只不过作用范围包含调用它的节点。要读取文本值时，`outerText`和`innerText`实际上返回同样的元素。但是在写入文本值时，`outerText`就大不相同了。

> 注意`outerText`是一个非标准的属性，也没有被标准化的前景。因此不推荐依赖这个属性实现重要的操作。

## 滚动

如前所属，滚动是 HTML5 之前的 DOM 标准没有涉及的领域。虽然 HTML5 把`scrollIntoView()`标准化了，但不同浏览器中仍然有其他专有方法。例如`scrollIntoViewIfNeeded()`作为`HTMLElement`类型的扩展可以在所有元素上调用。

不过一般来说，`scrollIntoView()`是关于滚动唯一一个被标准化的方法，所以只用它就可以了。

# 总结

虽然 DOM 规定了与 XML 和 HTML 文档交互的核心 API，但其他几个规范也定义了对 DOM 得扩展。很多扩展都基于之前的已经称为事实标准的专有特性标准化而来。本章主要介绍了以下三个规范：

- **Selectors API**为基于 CSS 选择符获取 DOM 元素定义了几个方法：`querySelector()`、`querySelectorAll()`和`matches()`。
- **Element Traversal**在 DOM 元素上定义了额外的属性，以方便对 DOM 元素进行遍历。这个需求是因为浏览器处理元素空格的差异而产生的。
- **HTML5**标准 DOM 提供了大量扩展。其中包括对`innerHTML`属性等事实标准进行了标准化，还有焦点管理、字符集、滚动等特性。

DOM 扩展的数量总体还不大，但随着 Web 技术的发展一定会越来越多。浏览器仍然没有停止对专有扩展的探索，如果出现成功的扩展，那么就有可能成为事实标准，或者最终被整合到未来的标准中。
