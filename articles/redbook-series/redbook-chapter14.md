---
title: （十四）DOM
date: 2022-02-12
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h0xwa4k5h0j20rs0jg759.jpg
---

文档对象模型（DOM, Document Object Model）是 HTML 和 XML 文档的编程接口。DOM 表示由多节点构成的文档，通过它开发者可以添加、删除和修改页面的各个部分。脱胎于网景和微软早期的动态 HTML（DHTML），**DOM 现在是真正的跨平台、语言无关的表示和操作网页的方式**。

DOM Level 1 在 1998 年成为 W3C 推荐标准，提供了基本文档结构和查询的接口。DOM 直接与浏览器中的 HTML 网页相关，并且在浏览器环境 JavaScript 中提供了 DOM API。

<iframe width="560" height="315" src="https://www.youtube.com/embed/cCOL7MC4Pl0" title="更多关于事件循环" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# 节点层级

任何 HTML 或 XML 文档都可以用 DOM 表示为一个由节点构成的层级结构。节点分为很多类型，每种类型对应着文档中不同的信息和标记，也都有自己不同的特性、数据和方法，并且和其他类型有某种关系。这些关系构成了层级，让标记可以表示为一个以特定节点为根的树形结构。以下面的 HTML 为例：

```html
<html>
  <head>
    <title>Sample Page</title>
  </head>
  <body>
    <p>Hello World!</p>
  </body>
</html>
```

它在 DOM 中就可以表示为层级结构。用`document`表示文档的根节点，根节点下面的唯一子节点是`<html>`元素，称为**文档元素**`documentElement`。文档元素是文档最外层的元素，所有其他元素都存在于这个元素之内。每个文档**只能有一个文档元素**。在 HTML 页面中，文档元素始终是`<html>`元素。在 XML 文档中，没有预定义这样的元素，任何元素都可能成为文档元素。

HTML 中的每段标记都可以表示为这个树形结构的一个节点。元素节点表示 HTML 元素，属性节点表示属性，文档节点表示文档类型，注释节点表示注释。DOM 中总共有 12 种节点类型，这些类型都继承一种基本类型。

## `Node`类型

DOM Level1 描述了名为`Node`的接口，这个接口是所有 DOM 节点类型都必须实现的。`Node`接口在 JavaScript 被实现为`Node`类型，在除 IE 之外的所有浏览器中都可以直接访问这个类型。在 JavaScript 中，所有节点类型都继承`Node·类型，因此所有类型都共享相同的基本属性和方法。

每个节点都有`nodeType`属性，表示该节点的类型。节点类型由定义在`Node`类型上的 12 个数值常量表示：

- `Node.ELEMENT_NODE`（1）
- `Node.ATTRIBUTE_NODE`（2）
- `Node.TEXT_NODE`（3）
- `Node.CDATA_SECTION_NODE`（4）
- `Node.ENTITY_REFERENCE_NODE`（5）
- `Node.ENTITY_NODE`（6）
- `Node.PROCESSING_INSTRUCTION_NODE`（7）
- `Node.COMMENT_NODE`（8）
- `Node.DOCUMENT_NODE`（9）
- `Node.DOCUMENT_TYPE_NODE`（10）
- `Node.DOCUMENT_FRAGMENT_NODE`（11）
- `Node.NOTATION_NODE`（12）

节点类型可以通过与这些常量比较来确定，例如：

```javascript
if (someNode.nodeType === Node.ELEMENT_NODE) {
  alert('Node is an element.')
}
```

浏览器并不支持所有的 DOM 节点类型。开发者最常用的两个节点是**元素节点**和**文本节点**。`nodeName`和`nodeValue`保存着有关节点的信息。这两个属性的值完全取决于节点类型。

文档中的所有节点都与其他节点有关系。这些关系可以形容为家族关系，相当于将文档树比做家谱。在 HTML 中，`<body>`元素是`<html>`元素的子元素，而后者是前者的父元素。`<head>`元素是`<body>`元素的同胞元素，因为它们有共同的父元素`<html>`。

每个节点都有一个`childNodes`属性，其中包含一个`NodeList`的实例。`NodeList`是一个类数组对象，用于存储可以按位置存取的有序节点。注意`NodeList`并不是`Array`的实例，但可以使用中括号访问它的值，也具有`length`属性。`NodeList`对象独特的地方在于，它其实是一个对 DOM 结构的查询，因此 DOM 结构的变化会自动地在`NodeList`中反映出来。我们通常说`NodeList`是实时的活动对象，而不是第一次访问时所获得内容的快照。

下面的例子展示了如何使用中括号或使用`item()`方法访问`NodeList`中的元素：

```javascript
const firstChild = someNode.childNodes[0]
const secondChild = someNode.childNodes.item(1)
const count = someNode.childNodes.length
```

无论是使用中括号还是`item()`方法都是可以的，但多数开发者倾向于使用中括号，因为它是一个类数组对象。注意，`length`属性表示那一时刻`NodeList`中节点的数量。使用`Array.from()`可以将`NodeList`对象转换为数组。

每个节点都一个`parentNode`属性，指向其 DOM 树中的父元素。`childNodes`中的所有节点都有同一个父元素，因此它们的`parentNode`属性都指向同一节点。此外`childNodes`列表中的每个节点都是同一列表中其他节点的同胞节点。而使用`previousSibling`和`nextSibling`可以在这个列表的节点间导航。第一个节点的`previousSibling`和最后一个节点的`nextSibling`属性也是`null`：

```javascript
if (someNode.nextSibling === null) {
  alert(`Last node in the parent's childNodes list.`)
} else if (someNode.previousSibling === null) {
  alert(`First node in the parent's childNodes list.`)
}
```

父节点中它的第一个和最后一个子节点也有专门属性：`firstChild`和`lastChild`分别指向`childNodes`中的第一个和最后一个子节点。

![](https://tva1.sinaimg.cn/large/008i3skNgy1gzc6n59b8oj31s50jtq4y.jpg)

有了这些关系，`childNodes`属性的作用远远不是必备的属性那么简单了。这是因为利用这些关系指针，几乎可以访问到文档树中的任何节点，这种便利性就是`childNodes`的最大亮点。还有一个方法是`hasChildNodes()`，这个方法如果返回`true`则说明节点有一个或者多个子节点。

之后还有一个所有节点都共享的关系。`ownerDocument`属性是一个指向代表整个文档的文档节点的指针。所有节点都被创建它们（或自己所在）的文档拥有，因为一个节点不可能同时存在于两个或多个文档中。这个属性为迅速访问文档节点提供了便利，因为无需在文档结构中逐渐上溯了。

因为所有关系指针都是只读的，所以 DOM 又提供了一些操纵节点的方法。**最常用**的方法是`appendChild()`，用于在`childNodes`列表末尾添加节点。添加新节点会更新相关的关系指针，包括父节点和之前的最后一个子节点。`appendChild()`方法返回新添加的节点，如下面所示：

```javascript
const returnNode = someNode.appendChild(newNode)
alert(returnNode === newNode) // true
alert(someNode.lastChild === newNode) // true
```

如果将文档中已经存在的节点传给`appendChild()`，那么这个节点会从之前的位置被转移到新位置。即使 DOM 树通过各种关系指针维系，一个节点也不会在文档中同时出现在两个或更多的地方。因此，如果调用`appendChild()`传入父元素的第一个子节点，则这个节点会成为父元素的最后一个子节点：

```javascript
const returnNode = someNode.appendChild(someNode.firstChild)
alert(returnNode === someNode.firstChild) // false
alert(returnNode === someNode.lastChild) // true
```

如果想把放到`childNodes`中的特定位置而不是末尾，则可以使用`insertBefore()`方法。这个方法接收两个参数：要插入的节点和参照节点。调用这个方法后，要插入的节点会变成参照节点的前一个同胞节点，并被返回。如果参照节点是`null`，则`insertBefor()`与`appendChild()`效果相同：

```javascript
// 作为最后一个子节点插入
const retunNode = someNode.insertBefore(newNode, null)
alert(returnNode === someNode.lastChild) // true
// 作为新的第一个子节点插入
const returnNode = someNode.insertBefore(newNode, someNode.firstChild)
alert(returnNode === newNode) // true
alert(newNode === someNode.firstChild) // true
// 插入最后一个子节点前面
const returnNode = someNode.insertBefore(newNode, someNode.lastChild)
alert(newNode === someNode.childNodes[someNode.childNodes.length - 2]) // true
```

`appendChild()`和`insertBefore()`在插入节点时不会删除任何已有节点。相对地，`replaceChild()`方法接收两个参数：要插入的节点和要替换的节点。要替换的节点被返回并从文档树中完全移除，要插入的节点会取而代之。

```javascript
// 替换第一个子节点
const returnNode = someNode.replaceChild(newNode, someNode.firstChild)
// 替换最后一个子节点
const returnNode = someNode.replaceChild(newNode, someNode.lastChild)
```

使用`replaceChild()`插入一个节点后，所有的关系指针都会被从替换的节点复制过来。虽然被替换的节点从技术上说仍然被同一个文档所拥有，但是文档中已经没有它的位置。

要移除节点而不是替换节点，可以使用`removeChild()`方法，这个方法接受一个参数，即要删除的节点。被移除的节点会被返回。

```javascript
// 删除第一个子节点
const formerFirstChild = someNode.removeChild(someNode.firstChild)
// 删除最后一个子节点
const formerLastChild = someNode.removeChild(someNode.lastChild)
```

与`replaceChild()`方法一样，通过`removeChild()`被移除的节点从技术上说仍然被同一文档所拥有，但文档中已经没有它的位置。

上面介绍的 4 个方法都用于操纵某个节点的子元素，也就是说使用它们之前必须先取得父节点（使用前面的`parentNode`属性）。并非所有节点类型都有子节点，如果在不支持子节点的节点上调用这些方法，则会导致抛出错误。

所有节点类型还共享了两个方法。一个是`cloneNode()`，会返回与调用它的节点一模一样的节点。`cloneNode()`方法接收一个布尔值参数，表示是否深复制。在传入`true`参数时，会进行深复制，即复制子节点及其整个 DOM 树。如果传入`false`则只会复制调用该方法的节点。复制返回的节点**属于文档所有**，但是尚未指定父节点，所以可以成为**孤儿节点**。可以通过`appendChild()`、`insertBefore()`或者`replaceChild()`方法把孤儿节点添加到文档中；另一个方法是`normalize()`。这个方法唯一的任务就是处理文档子树中的文本节点。由于解析器实现的差异或者 DOM 操作等原因，可能会出现并不包含文本的文本节点，或者文本节点之间互为同胞关系。在节点上调用`normalize()`方法会检测这个节点的所有后代，从中搜索上述两种情形。如果发现空文本节点，则将其删除；如果两个同胞节点是相邻的，则将其合并为一个文本的节点。

## `Document`类型

`Document`类型是 JavaScript 中表示文档节点的类型。在浏览器中，文档对象`document`是`HTMLDocument`的实例（`HTMLDocument`继承`Document`），表示整个 HTML 页面。`document`是`window`对象的属性，因此是一个全局对象。`Document`类型的节点有以下特征：

- `nodeType`值为 9（`Node.DOCUMENT_NODE`）
- `nodeName`值为`#document`
- `nodeValue`值为`null`
- `parentNode`值为`null`
- `ownerDocument`值为`null`
- 子节点可以是`DocumentType`（最多一个）、`Element`（最多一个）、`ProcessingInstruction`或`Comment`类型。

`Document`类型可以表示 HTML 页面后者其他 XML 文档，但是最常用的还是通过`HTMLDocument`实例获取`document`对象。`document`对象可用于获取关于页面的信息以及操纵其外观和底层结构。

虽然 DOM 规范规定`Document`节点的子节点可以是`DocumentType`、`Element`、`ProcessingInstruction`或者`Comment`，但也提供了两个访问节点的快捷方式。一个是`documentElement`属性，始终指向 HTML 页面中的`<html>`元素。另外，通过`document.childNodes`中始终有`<html> `元素。

作为`HTMLDocument`的实例，`document`对象还有一个`body`属性，直接指向`<body>`元素。因为这个元素是开发者使用最多的元素，故而在 DOM 编程中经常看到`document.body`。

所有主流浏览器都支持`document.documentElement`和`document.body`。`Document`类型另一种可能的子节点是`DocumentType`。`<!doctype>`标签是文档中独立的部分，其信息可以通过`doctype`属性（在浏览器中是`document.doctype`来访问。

> 一般来说，`appendChild()`、`removeChild()`和`replaceChild()`方法不会用在`document`对象上。这是因为文档类型（如果存在）是只读的，并且只能有一个`Element`类型的子节点（即`<html>`）。

作为`HTMLDocument`实例的`document`对象，还有一些标准`Document`对象上所没有的属性。这些属性提供浏览器所加载网页的信息。其中第一个属性是`title`，包含了`<title>`元素中的文本，通常显示在浏览器窗口或者标签页的标题栏。通过这个属性可以读写页面的标题，修改后的标题也会反映在浏览器标题栏上。不过修改`title`属性并不会改变`title`元素。

```javascript
const originTitle = document.title
document.title = 'New Page Title'
```

另外`URL`、`domain`和`referrer`属性含有网页的地址信息。其中`URL`包含当前页面的完整 URL（地址栏中的 URL），`domain`包含了页面的域名，而`referrer`包含链接到当前页面的那个页面的 URL。如果当前页面没有来源，那么`referrer`属性包含空字符串。所有这些信息都可以在请求的 HTTP 头部信息中获取，只是在 JavaScript 中通过这几个属性暴露出来而已。这几个属性中只有`domain`是可以设置的。出于安全考虑给`domain`属性的值是有限制的。如果 URL 包含子域名如`p2p.wrox.com`，则可以将`domain设置为`wrox.com`（URL 包含“WWW”也是一样）。不能给这个属性设置 URL 中不包含的值。

当页面中包含来自某个不同子域的窗格（`<frame>`）或者内嵌窗格（`<iframe>`）时，设置`document.domain`是有用的。因为跨源通信存在安全隐患，所以不同子域的页面无法通过 JavaScript 通信。此时，在每个页面上把`document.domain`设置为相同的值，这些页面就可以访问对方的 JavaScript 对象了。例如一个加载自`www.wrox.com`的页面中包含一个内嵌窗格，其中的页面加载自`p2p.wrox.com`。这两个页面的`document.domain`包含了不同的字符串，内部和外部之间不能访问对方的 JavaScript 对象。如果每个页面都把`document.domain`设置为`wrox.com`，俺么这两个页面之间就可以通信了。浏览器对`domain`属性还有一个限制，即这个属性一旦放松就不能再收紧。

> 注：笔者摘抄的日期为 2022-02-15，在 chrome 浏览器中测试`domain`属性可以收紧回原来。

使用 DOM 最常见的情形可能就是获取某个或某些元素的引用，然后对它们执行某些操作。`document`对象上暴露一些方法，可以实现这些操作。`getElementById()`和`getElementsByTagName()`就是`Document`类型提供的两个方法。

`getElementById()`方法接收一个参数，即要获取元素的 ID，如果找到了则返回这个元素，如果没找到则返回`null`。参数 ID 必须跟元素在页面中的`id`属性值完全匹配，包括大小写。例如页面中有以下元素：

```html
<div id="myDiv">Some text</div>
```

可以使用以下代码获取该元素：

```javascript
const div = document.getElementById('myDiv') // 获取对<div>元素的引用
```

如果页面中确实存在多个具有相同 ID 的元素，则`getElementById()`返回在 DOM 树中出现的第一个元素。

`getElementsByTagName()`是另一个常用来获取元素引用的方法。这个方法接收一个参数，即要获取元素的标签名，返回包含零个或者多个元素的`NodeList`。在 HTML 文档中，这个方法返回一个`HTMLCollection`对象。考虑到这两者都是“实时”的列表，`HTMLCollection`和`NodeList`是很相似的。

```javascript
const images = document.getElementsByTagName('img')
```

这里把返回的`HTMLCollection`对像保存在了变量`images`中。与`NodeList`对象一样，也可以使用中括号或者`item()`方法从`HTMLCollection`取得特定的元素。而取得元素的数量同样可以通过`length`属性得知。`HTMLCollection`对象还有一个额外的方法`namedItem()`，可以通过标签的`name`属性取得某一项的引用。例如，假设页面中包含如下的`<img>`元素：

```html
<img src="myImage.gif" name="myImage" />
```

那么也可以从`images`中获取对这个元素的引用：

```javascript
const myImage = images.namedItem('myImage')
```

这样`HTMLCollection`就提供了除索引之外的另一种获取列表项的方式，从而为取得元素提供了便利。对于`name`属性的元素，还可以直接使用中括号来获取，如下面的例子所示：

```javascript
const myImage = images['myImage']
```

对`HTMLCollection`对象而言，中括号既可以接受数值索引，也可以接受字符串索引。而在后台，数值索引会调用`item()`，字符串索引会调用`namedItem()`。

```javascript
const allElements = document.getElementsByTagName('*')
```

传入通配符`*`可以获取文档中的所有元素。另外`document.getElementsByName()`方法可以匹配具有给定`name`属性的所有元素，也返回`HTMLCollection`。

另外`document`对象上还暴露了几个特殊集合，这些集合都是`HTMLCollection`的实例。这些集合是访问文档中公共部分的快捷方式：

- `document.anchors`返回文档中所有带有`name`属性的`<a>`元素。
- `document.forms`返回文档中所有的`<form>`元素。
- `document.images`返回文档中所有`<img>`元素。
- `document.links`返回文档中所有带有`href`属性的`<a>`元素。

这些特殊集合始终存在于`HTMLDocument`对象上，而且与所有`HTMLCollection`对象一样，其内容也会实时更新以符合当前文档的内容。

> 由于 DOM 有多个 Level 和多个部分，因此确定浏览器实现了 DOM 的哪些部分是很必要的。`document.implementation`属性是一个对象，提供了与浏览器 DOM 实现相关的信息和能力。DOM Level 1 在`document.implementation`上定义了一个方法即`hasFeature()`。这个方法接收两个参数：特性名称和 DOM 版本。如果支持，则返回`true`：
>
> ```javascript
> const hasXmlDom = document.implementation.hasFeature('XML', '1.0')
> ```
>
> 但是由于实现不一致，因此其返回值不可靠。目前这个方法已经被废弃，主流浏览器为了向后兼容仍然支持这个方法，但是无法检测什么都一律返回`true`。

**`document`对象有一个古老的能力**，即向网页输出流中写入内容。这个能力对应四个方法：`write()`、`writeln()`、`open()`、`close()`。其中，`write()`和`written()`方法都能接受一个字符串参数，可以将这个字符串写入网页中。`write()`简单地写入文本，而`writeln()`在字符串末尾追加一个换行符`\n`。这两个方法可以用来在页面加载期间动态添加内容。页面渲染期间如果 JavaScript 脚本已经执行，则`document.write()`可以向文档中输入内容。但是如果在页面加载完之后再调用`document.write()`，则输出的内容会重写整个页面。`open()`和`close()`方法分别用于打开和关闭网页输出流。在调用`write()`和`writeln()`时，这两个方法都不是必须的。注意，现在已经没有理由使用这些古老的方法，因此不要在代码中出现。

## `Element`类型

除了`Document`类型，`Element`类型就是 Web 开发中最常用的类型了。`Element`表示 XML 或者 HTML 元素，对外暴露出访问元素标签名、子节点和属性的能力。`Element`类型的节点具有以下特征：

- `nodeType`等于 1
- `nodeName`值为元素的标签名
- `nodeValue`值为`null`
- `parentNode`值为`Document`或者`Element`对象
- 子节点可以是`Element`、`Text`、`Comment`、`ProcessingInstruction`、`CDATASection`、`EntityReference`类型。

可以通过`nodeName`或者`tagName`属性来获取元素的标签名。这两个属性返回同样的值（添加后一个属性明显是为了不让人误会）。

```javascript
const div = document.getElementById('myDiv')

console.log(div.tagName === div.nodeName)
```

例子中元素标签名称为`div`，ID 为`myDiv`。注意`tagName`返回的是大写。在 HTML 中元素标签名始终以全大写表示：在 XML 中，标签名始终与源代码中的大小写一致。如果不确定脚本是在 HTML 文档还是 XML 文档中运行，最好将标签名转换为小写形式，以便于比较：

```javascript
if (element.tagName.toLowerCase() === 'div') {
  // 推荐，适用于所有文档
}
```

这个例子演示了比较`tagName`属性的情形，是推荐的写法。

所有的 HTML 元素都通过`HTMLElement`类型表示，包括其实例和间接实例。另外，`HTMLElement`直接继承了`Element`并增加了一些属性。每个属性都对应下列属性，它们是所有 HTML 元素都有的标准属性：

- `id`，元素在文档中的唯一标识符；
- `title`，包含元素的额外信息，通常以提示条形式展示；
- `lang`，元素内容的语言代码，很少用；
- `dir`，语言的书写方向，很少用；
- `className`，相当于`class`属性，用于指定元素的 CSS 类，因为`class`是 ECMAScript 关键字，所以不能直接用这个名字。

所有这些都可以用来获取对应的属性值，也可以用来修改相应的值。例如有下面的 HTML 元素：

```html
<div id="myDiv" class="bd" title="body text" lang="en" dir="ltr"></div>
```

修改`dir`会导致页面文本立即向左对齐或向右对齐。修改`className`会立即反映应用到新类名的 CSS 样式。

如前所述，所有 HTML 元素都是`HTMLElement`或其子类型的实例。所有元素都有多个属性，通常用于为元素或者其内容附加更多信息。与属性相关的 DOM 方法主要有三个：`getAttribute()`、`setAttribute()`和`removeAttribute()`。这些方法主要用于操纵属性，包括在`HTMLElement`类型上定义的属性。注意传递给`getAttribute()`的属性名和它们实际的属性名是一样的，因此这里要传`class`而非`className`，如果给定的属性不存在则`getAttribute()`返回`null`。

`getAttribute()`方法也能取得不是 HTML 语言正式属性的自定义属性值，例如：

```html
<div id="myDiv" my_special_attribute="hello!"></div>
```

这个元素有一个自定义属性，可以像其他属性一样使用`getAttribute()`取得这个属性的值：

```javascript
const value = div.getAttribute('my_special_attribute')
```

注意，属性名不区分大小写，因此`ID`和`id`被认为是同一个属性。另外，根据 HTML5 规范的要求，自定义属性名应该前缀`data-`以方便验证。

元素的所有属性也可以通过相应的 DOM 元素对象的属性来取得。通过 DOM 对象访问的属性中有两个返回的值跟使用`getAttribute()`取得的值不一样。首先是`style`属性，这个属性用于为元素设定 CSS 样式。在使用`getAttribute()`访问`style`属性时，返回的是 CSS 字符串。而通过 DOM 对象的属性访问时，`style`属性返回的是一个`CSSStyleDeclaration`对象。DOM 对象的`style`属性用于以编程方式来读写元素样式，因此不会直接映射为元素中`style`属性的字符串值。

第二个属性其实是一类属性，即事件处理程序，例如`onclick`。在元素上使用事件属性时（例如`onclick`）、属性的值时一段 JavaScript 代码。如果使用`getAttribute()`访问事件属性，则返回的是字符串形式的源代码。而通过 DOM 对象的属性访问事件属性时返回的是一个 JavaScript 函数（未指定该属性则返回`null`）。这是因为`onclick`及其他事件属性是可以接受函数作为值的。考虑到以上差异，开发者在进行 DOM 编程时通常会放弃使用`getAttribute()`而只使用对象属性。**实际开发中，只使用`getAttribute()`来获取自定义属性的值**。同理，实际上也很少使用`setAttribute()`为元素属性赋值，而是直接给 DOM 对象的属性属性赋值。

可以使用`document.createElement()`方法创建新元素。这个方法接收一个参数，即要创建元素的标签名。在 HTML 文档中，标签名是不区分大小写的，而 XML 文档是区分大小写的。

```javascript
const div = document.createElement('div')
```

使用`createElement()`方法创建新元素的同时也会将其`ownerDocument`属性设置为`document`。此时可以再为其添加属性、添加更多子元素。

> 在新元素设置这些属性只会附加信息，因为这个元素还没有添加到文档树，所以不会影响浏览器显示。

要把元素添加到文档树，所以不会影响浏览器显示。要把元素添加到文档树，可以使用`appendChild()`、`insertBefore()`或`replaceChild()`。元素被添加到文档树之后，浏览器会立即将其渲染出来。之后再对这个元素所做的任何修改都会立即在浏览器中反映出来。

元素可以拥有任意多个子元素和后代元素，因为元素本身也可以是其他元素的子元素。`childNodes`属性包含元素所有的子节点，这些子节点可能是其他元素、文本节点、注释或者处理指令。不同浏览器在识别这些节点时的表现有明显不同。要取得某个元素的子节点和其他后代节点，可以使用元素的`getElmentsByTagName()`方法。在元素上调用这个方法与文档上调用是一样的，只不过搜索范围限制在当前元素之内，只会返回当前元素的后代。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1gzgwfbuqwgj20u8032t9a.jpg)

> 注意`Element`类型上只定义了`getElementsByTagName`和`getElementsByClassName`方法（由 DOM1 扩展提供），没有`getElementById`。

## `Text`类型

`Text`节点由`Text`类型表示，包含按字面解释的纯文本，也可能包含转义后的 HTML 字符，但不含 HTML 代码。`Text`类型的节点具有一下特征：

- `nodeType`等于 3
- `nodeName`值为`#text`
- `nodeValue`值为节点中包含的文本
- `parentNode`值为`Element`对象
- **不支持子节点**

`Text`节点中包含的文本可以通过`nodeValue`属性访问，也可以通过`data`属性访问，这两个属性包含相同的值。修改`nodeValue`或者`data`的值，也会在另一个属性反映出来。文本节点包含了以下操作文本的方法：

- `appendData(text)`，向节点末尾添加文本`text`
- `deleteData(offset, count)`，从位置`offset`开始删除`count`个字符
- `insertData(offset, text)`，在位置`offset`插入`text`
- `replaceData(offset, count, text)`，用`text`替换从位置`offset`到`offset + count`的文本
- `splitText(offset)`，在位置`offset`将当前文本节点拆分为两个文本节点
- `subStringData(offset, count)`，提取从位置`offset`到`offset + count`的文本

除了这些方法，还可以通过`length`属性获取文本节点中包含的字符数量。这个值等于`nodeValue.length`和`data.length`。

默认情况下，包含文本内容的每个元素最多只能有一个文本节点。例如：

```html
<div></div>
<!-- 没有内容，因此没有文本节点 -->

<div></div>
<!-- 有空格，因此有一个文本节点 -->

<div>Hello World!</div>
<!-- 有内容，因此有一个文本节点 -->
```

示例中的第一个`<div>`元素中不包含内容，因此不会产生文本节点。只要开始标签和结束标签之间有内容，就会创建一个文本节点，因此第二个`<div>`元素会有一个文本节点的子节点，虽然它只包含空格。这个文本节点的`nodeValue`就是一个空格。第三个`<div>`元素也有一个文本节点的子节点，其`nodeValue`的值为`Hello World!`。下列代码可以用来访问这个文本节点：

```javascript
const textNode = div.firstChild // 或div.childNodes[0]
div.firstChild.nodeValue = 'some other message'
```

只要节点在当前的文档树中，这样的修改就会马上反映出来。修改文本节点还有一点需要注意，就是 HTML 或者 XML 代码会被转换成实体编码，即小于号、大于号或者引号会被转义：

```javascript
div.firstChild.nodeValue = 'Some <strong>other</strong> message'
```

这实际上是将 HTML 插入 DOM 文档前进行编码的有效方式。

使用`document.createTextNode()`可以用来创建新文本节点，它接收一个参数，即要插入节点的文本。跟设置已有的文本节点的值一样，这些要插入的文本也会应用 HTML 或者 XML 编码。例如：

```javascript
const textNode = document.createTextNode('<strong>Hello</strong> world!')
```

创建文本节点后，其`ownerDocument`属性会被设置为`document`。但在把这个节点添加到文档树之前，我们不会在浏览器中看到它。

```javascript
const element = document.createElement('div')
element.className = 'message'

const textNode = document.createTextNode('Hello World!')
element.appendChild(textNode)

document.body.appendChild(element)
```

这个例子首先创建了一个`<div>`元素并给它添加了值为`message`的`class`属性，然后创建了一个文本节点并且添加到该元素。最后一步是把这个元素添加到文档的主体上，这样元素及其包含的文本会出现在浏览器中。

一般来说一个元素只包含一个文本子节点。不过也可以染个元素包含多个文本子节点。

```javascript
const element = document.createElement('div')
element.className = 'message'

const textNode = document.createTextNode('Hello World')
element.appendChild(textNode)

const anotherTextNode = document.createTextNode('Yippe!')
element.appendChild(anotherTextNode)

document.body.appendChild(element)
```

将一个文本节点作为另一个文本节点的同胞插入之后，两个文本节点之间不会包含空格。

DOM 文档中的同胞文本节点可能导致困惑。因为一个文本节点足以表示一个文本字符串。同样，DOM 文档中也经常出现两个相邻文本节点。为此有一个方法可以合并相邻的文本节点。这个方法叫做`normalize()`，是在`Node`类型中定义的（因此所有类型的节点上都有这个方法）。在包含两个或者多个相邻文本节点的父节点上调用`normalize()`时，所有同胞文本节点会被合并为一个文本节点，这个文本节点的`nodeValue`就等于之前所有同胞节点`nodeValue`拼接在一起的到的字符串。

```javascript
const element = document.createElement('div')
element.className = 'message'

const textNode = document.createTextNode('Hello World!')
element.appendChild(textNode)

const anotherTextNode = document.createTextNode('Yippee!')
element.appendChild(anotherTextNode)

document.body.appendChild(element)

alert(element.childNodes.length) // 2
element.normalize()
alert(element.childNodes.length) // 1
alert(element.firstChild.nodeValue) // 'Hello World!Yippee!'
```

浏览器在解析文档时，永远不会创建同胞文本节点。同胞文本节点只会出现在 DOM 脚本生成的文档树中。

`Text`类型定义了一个与`normalize()`相反的方法——`splitText()`。这个方法可以在指定的偏移位置拆分`nodeValue`，将一个文本节点拆分成两个文本节点。拆分之后，原来的文本节点包含开头到偏移位置前的文本，新文本节点包含剩下的文本。这个方法返回新的文本节点，具有与原来的文本节点相同的`parentNode`。

```javascript
const element = document.createElement('div')
element.className = 'message'

const textNode = document.createTextNode('hello world')
element.appendChil(textNode)

document.body.appendChild(element)

const newNode = element.firstChild.splitText(5)
```

这个例子中，包含`hello world`的文本节点被从位置`5`拆分成两个文本节点。位置`5`对应`hello`和`world`之间的空格。拆分文本节点最常用于从文本节点中提取数据的 DOM 解析技术。

## `Comment`类型

DOM 中的注释通过`Comment`类型表示。`Comment`类型节点具有以下特征：

- `nodeType`等于 8
- `nodeName`值为`#comment`
- `nodeValue`值为注释的内容
- `parentNode`值为`Document`或者`Element`对象
- 不支持子节点

`Comment`类型与`Text`类型继承同一个基类（`CharacterDatat`），因此拥有除`splitText()`之外`Text`节点所有的字符串操作方法。和`Text`类型相似，注释的实际内容可以通过`nodeValue`或者`data`属性获得。注释节点可以作为父节点的子节点来访问。例如：

```html
<div id="myDiv">
  <!-- A comment -->
</div>
```

这里的注释是`<div>`元素的子节点，这意味着可以像下面这样访问它：

```javascript
const div = document.getElementById('myDiv')
const comment = div.firstChild
alert(comment.data) // 'A comment'
```

可以通过`document.createComment()`方法创建注释节点，参数为注释文本。显然，注释节点很少通过 JavaScript 创建和访问，因为注释几乎不涉及算法逻辑。此外，浏览器不承认结束的`</html>`之后的注释。如果要访问注释节点，必须确定它们是`<html>`元素的后代。

## `DocumentType`类型

`DocumentType`类型的节点包含文档的文档类型（`doctype`）信息，具有以下特征：

- `nodeType`等于 10
- `nodeName`值为文档类型的名称
- `nodeValue`值为`null`
- `parentNode`值为`Document`对象
- 不支持子节点

`DocumentType`对象在 DOM Level1 中不支持动态创建，只能在解析文档代码时创建。对于支持这个类型的浏览器，`DocumentType`对象保存在`document.doctype`属性中。DOM Level1 规定了`DocumentType`对象的 3 个属性：`name`、`entities`和`notations`。其中，`name`是文档类型的名称，`entities`是这个文档类型描述的实体的`NamedNodeMap`，而`notations`是这个文档类型描述的表示法的`NamedNodeMap`。因为浏览器中的文档通常是 HTML 或者 XHTML 文档类型，所以`entites`和`notations`列表为空。无论如何，只有`name`属性是有用的。这个属性包含文档类型的名称，即紧跟在`<!DOCTYPE`后面的那串文本。

## `DocumentFragment`类型

在所有节点类型中，`DocumentFragment`类型是唯一一个在标记中没有对应表示的类型。DOM 将文档片段定义为“轻量级”文档，能够包含和操作节点，却没有完整文档那样额外的消耗。`DocumentFragment`节点具有以下特征：

- `nodeType`等于 11
- `nodeName`值为`#document-fragment`
- `nodeValue`值为`null`
- `parentNode`值为`null`
- 子节点可以是`Element`、`ProcessingInstruction`、`Comment`、`Text`、`CDATASection`或者`EntityReference`

不能直接把文档片段添加到文档。相反，文档片段的作用是充当其他要被添加到文档的节点的仓库。可以使用`document.createDocumentFragement()`方法创建文档片段。

```javascript
const fragment = document.createDocumentFragment()
```

文档片段从`Node`类型继承了所有文档类型具备的可以执行 DOM 操作的方法。如果文档中的一个节点被添加到一个文档片段，则该节点会从文档树中移除，不会再被浏览器渲染。添加到文档片段的新节点同样不属于文档树，不会被浏览器渲染。可以通过`appendChild()`或者`insertBefore()`方法将文档片段的内容添加到文档。在把文档片段作为参数传给这些方法时，这个文档片段的所有子节点会被添加到文档中相应的位置。文档片段本身永远不会被添加到文档树。

```html
<ul id="myList"></ul>
```

假设想要给这个`<ul>`元素添加三个列表项。如果分 3 次给这个元素添加列表项，浏览器就要重新渲染 3 次页面，以反映新添加的内容。为避免多次渲染，下面的代码示例使用文档片段创建了所有列表项，然后一次性将它们添加到了`<ul>`元素：

```javascript
const fragment = document.createDocumentFragment()
const ul = document.getElementById('myList')

for (let i = 0; i < 3; i++) {
  const li = document.createElement('li')
  li.appendChild(document.createTextNode(`Item ${i + 1}`))
  fragment.appendChild(li)
}

ul.appendChild(fragment)
```

这个例子先创建了一个文档片段，然后取得了`<ul>`元素的引用。接着通过`for`循环创建了 3 个列表项，每一项都包含表明自己身份的文本。为此创建`<li>`元素，再创建文本节点并添加到该元素。然后通过`appendChild()`把`<li>`元素添加到文档片段。循转结束后，将文档片段传给`appendChild()`将所有列表添加到了`<ul>`元素。此时文档片段的子节点全部被转移到了`<ul>`元素。

## `Attr`类型

元素数据在 DOM 中通过`Attr`类型表示。`Attr`类型构造函数和原型在所有浏览器中都可以直接访问。技术上讲，属性是存在于元素`attributes`属性中的节点。虽然属性节点也是节点，但是却不被认为是 DOM 文档树的一部分。

> `Attr`节点几乎不使用，因为将属性作为节点来访问多数情况下并无必要。推荐使用`getAttribute()`、`removeAttribute()`和`setAttribute()`方法操作属性，而不是直接操作属性节点。

# DOM 编程

很多时候，操作 DOM 是很直观的。通过 HTML 代码能实现的，也一样可以通过 JavaScript 实现。但有些时候，DOM 也没有看起来那么简单。浏览器能力的参差不齐和各种问题，也会导致 DOM 的某些方面会复杂一些。

## 动态脚本

`<script>`元素用于向网页中插入 JavaScript 代码，可以是`src`属性包含的外部文件，也可以是作为该元素内容的源代码。动态脚本就是在页面初始加载时不存在，之后又通过 DOM 包含的脚本。与对应的 HTML 元素一样，有两种方式通过`<script>`动态为网页添加脚本：引入外部文件和直接插入源代码。

动态加载外部文件很容易实现，例如下面的`<script>`元素：

```html
<script src="foo.js"></script>
```

可以像这样通过 DOM 编程创建这个节点：

```javascript
const script = document.createElement('script')
script.src = 'foo.js'
document.body = appendChild(script)
```

注意，在上面最后一样把`<script>`元素添加到页面之前，是不会开始下载外部文件的。当然也可以将其添加到`<head>`元素，同样可以实现动态脚本加载。这个过程可以封装为：

```javascript
function loadScript(url) {
  const script = document.createElement('script')
  script.src = url
  documend.body.appendChild(script)
}

// 可以加载外部JavaScript文件
loadScript('client.js')
```

加载之后这个脚本就可以对页面执行操作了。这里有个问题：怎么知道脚本什么时候加载完？这个问题并没标准答案。具体情况取决于使用的浏览器。

另一个动态插入 JavaScript 的方式是嵌入源代码：

```javascript
const script = document.createElment('script')
script.appendChild(document.createTextNode('function sayHi() {alert("hi")}'))
document.body.appendChild(script)
```

## 动态样式

CSS 样式在 HTML 页面中可以通过两个元素加载。`<link>`元素用于包含 CSS 外部文件，而`<style>`元素用于添加嵌入样式。和动态脚本类似，动态样式是页面初始加载时并不存在，而是在之后才添加到页面中的。

来看下面这个典型的`<link>`元素：

```html
<link rel="stylesheet" type="text/css" href="style.css" />
```

这个元素很容易使用 DOM 编程创建出来：

```javascript
const link = document.createElement('link')
link.rel = 'stylesheet'
link.type = 'text/css'
link.href = 'styles.css'
let head = document.getElementByTagName('head')[0]
head.appendChild(link)
```

通过外部文件加载样式是一个异步过程。因此样式的加载和正执行的 JavaScript 代码并没有先后顺序。一般来说，也没有必要知道样式什么时候加载完成。另一种定义样式的方式是使用`<script>`元素包含嵌入的 CSS 规则，此处不赘述。

## 使用`NodeList`

**理解`NodeList`对象和相关的`NamedNodeMap`、`HTMLCollection`**，是理解 DOM 编程的关键。这三个集合类型都是“实时的”，因为文档结构的变化会实时地在它们身上反映出来，因此它们的值始终代表最新的状态。实际上，**`NodeList`就是基于 DOM 文档的实时查询**。例如，下面的代码会陷入死循环：

```javascript
const divs = document.getElementsByTagName('div')

for (let i = 0; i < divs.length; i++) {
  const div = document.createElement('div')
  document.body.appendChild(div)
}
```

以上代码中`divs`是包含文档中所有`div`元素的`HTMLCollection`。因为这个集合是“实时的”，所以任何时候向页面中添加一个新的`div`元素，这个查询集合就会多一项，因为浏览器不希望保存每次创建的集合，就会在每次访问时更新集合。这样就会出现以上问题。

使用 ES6 迭代器也不会解决这个问题，因为迭代的是一个永远增长的实时集合，以下代码仍然会导致死循环：

```javascript
for (const div of document.getElementsByTagName('div')) {
  const newDiv = document.createElement('div')
  document.body.appendChild(newDiv)
}
```

任何时候要迭代`NodeList`，最好再初始化一个保存变量保存当时查询时的长度，然后用循环变量与这个变量进行比较，例如：

```javascript
const divs = document.getElementsByTagName('div')

for (let i = 0, len = divs.length; i < len; i++) {
  const div = document.createElement('div')
  document.body.appendChild(div)
}
```

在这个例子中，又初始化了一个保存集合长度的变量`len`。因为`len`保存着循环开始时集合的长度，而这个值不会随着集合增大动态增长，所以就可以避免前面例子中出现的无穷循环。

一般来说，最好限制操作`NodeList`的次数，因为每次访问这个对象都会触发一次新的查询，会搜索整个文档。因此最好把查询到的`NodeList`缓存起来。

# `MutationObserver`接口

不久前添加到 DOM 规范中的`MutationObserver`接口，可以在 DOM 被修改时异步执行回调。使用`MutationObserver`可以观察整个文档、DOM 树的一部分，或某个元素。此外还可以观察元素属性、子节点、文本，或者前三者任意组合的变化。

> 新引进`MutationObserver`接口是为了取代废弃的`MutationEvent`。

## 基本用法

`MutationObserver`的实例要通过调用`MutationObserver`构造函数并传入一个回调函数来创建：

```javascript
const observer = new MutationObserver(() => console.log('DOM was mutated!'))
```

一个新建的`MutationObserver`实例不会关联 DOM 的任何部分。要把这个`observer`和 DOM 关联起来，需要使用`observer()`方法。这个方法接收两个必须的参数：需要观察其变化的 DOM 节点，以及一个`MutationObserverInit`对象。

`MutationObserverInit`对象用于控制观察哪些方面的变化，是一个键/值对形式配置选项的字典。例如，下面的代码会创建一个观察`observer`）并配置它观察`<body>`元素上的属性变化：

```javascript
const observer = new MutationObserver(() =>
  console.log('<body> attributes changed')
)
observer.observe(document.body, { attributes: true })
```

执行以上代码后，`<body>`元素上任何属性发生变化都会被这个`MutationObserver`实例发现，然后就会异步执行注册的回调函数。`<body>`元素后代的修改或者其他非属性修改都不会触发回调进入任务队列。可以通过以下代码验证：

```javascript
const observer = new MutationObserver(() =>
  console.log('<body> attributes changed')
)

observer.observe(document.body, { attributes: true })
document.body.className = 'foo'
```

每个回调都会收到一个`MutationRecord`实例的数组。`MutationRecord`实例包含的信息包括发生了什么变化，以及 DOM 的哪一部分收到了影响。因为回调执行之前可能同时发生多个满足观察条件的事件，所以每次执行回调都会传入一个包含按顺序入队的`MutationRecord`实例的数组。`MutationRecord`实例包含的信息包括发生了什么变化，以及 DOM 的哪一部分受到了影响。因为回调执行之前可能同时发生多个满足观察条件的事件，所以每次执行回调都会传入一个包含按顺序入队的`MutationRecord`实例的数组。

默认情况下，只要被观察的元素不被垃圾回收，`MutationObserver`的回调就会响应 DOM 变化事件，从而被执行。要提前终止执行回调，可以调用`disconnect()`方法。下面的例演示了同步调用`disconnect()`之后，不仅会停止此后变化事件的回调，也会抛弃已经加入任务队列要异步执行的回调：

```javascript
const observer = new MutationObserver(() =>
  console.log('<body> attributes changed')
)

observer.observe(document.body, { attributes: true })
document.body.className = 'foo'
observer.disconnect()
document.body.className = 'bar'
// 没有日志输出
```

多次调用`observe()`方法可以敷用一个`MutationObserver`对象观察多个不同的目标节点。此时`MutationRecord`的`target`属性可以标识发生变化事件的目标节点。并且调用`disconnect()`并不会结束`MutationObserver`的生命。还可以重新使用这个观察者，再将它关联到新的目标节点。

`MutationObserverInit`对象用于控制对目标节点的观察范围。粗略来讲，观察者可以观察的事件包括属性的变化、文本变化和子节点变化。

> 注意在调用`observe`时，`MutationObserverInit`对象中的`attribute`、`characterData`和`childList`属性必须至少有一项为`true`，否者会抛出错误，因为没有任何变化事件可能会触发回调。

## 异步回调与记录队列

`MutationObserver`接口是出于性能考虑而设计的，其核心是异步回调与记录队列模型。为了在大量变化事件时不影响性能，每次变化的信息（由观察者实例决定）会保存在`MutationRecord`实例中，然后添加到**记录队列**。这个队列对每个`MutationObserver`实例都是唯一的，是所有 DOM 变化事件的有序列表。

每次`MutationRecord`被添加到`MutationObserver`的记录队列时，仅当之前没有已排期的微任务回调时（队列中微任务长度为 0），才会将观察者注册的回调（在初始化`MutationObserver`时传入）作为微任务调度到任务队列上。这样可以保证记录队列的内容不会被回调处理两次。

不过在回调的微任务异步执行期间，有可能又会发生更多变化事件。因此被调用的回调会接收到一个`MutationRecord`实例的数组，顺序为它们进入记录队列的顺序。回调要负责处理这个数组的每一个实例，因为函数退出之后这些实例就不存在了。回调执行后，这些`MutationRecord`就用不着了，因此记录队列会被清空，其内容会被丢弃。

> 注意，`MutationObserver`会将回调推入微任务队列，而不是宏任务队列！

## 性能、内存与垃圾回收

DOM Level 2 规范中描述的`MutationEvent`定义了一组会在各种 DOM 变化时触发的事件。由于浏览器事件的实现机制，这个接口出现了严重的性能问题。因此 DOM Level 3 规定废弃了这些事件。`MutationObserver`接口就是为了替代这些事件而设计的更实用、性能更好的方案。

将变化回调委托给微任务来执行可以保证事件同步触发，同时避免随之而来的混乱。为`MutationObserver`而实现的记录队列，可以保证即使变化事件被爆发式地触发，也不会显著地拖慢浏览器。但是使用`MutationObserver`仍然**不是没有代价的**。因此理解什么时候避免出现这种情况很重要。

`MutationObserver`实例和目标节点之间的引用关系是非对称的。`MutationObserver`拥有对要观察的目标节点的弱引用。因为是弱引用所以不会妨碍垃圾回收程序回收目标节点。然而，目标节点却拥有对`MutationObserver`的强引用。如果目标节点从 DOM 中被移除，随后被垃圾回收，那么关联的`MutationObserver`也会被垃圾回收。

记录队列中的每个`MutationRecord`实例至少包含对已经 DOM 节点的一个引用。如果变化是`childList`类型，则会包含多个节点的引用。记录队列和回调处理的默认行为是耗尽这个队列，处理每个`MutationRecord`，然后让它们超出作用域并被垃圾回收。

有时候可能需要保存某个观察者的完整变化记录。保存这些`MutationRecord`实例，也就会保存它们引用的节点，因而会妨碍这些节点被回收。如果需要尽快释放内存，建议从每个`MutationRecord`中抽取最有用的信息，然后保存到一个新对象中，最后抛弃`MutationRecord`。

# 总结

文档对象模型 DOM 是语言中立的 HTML 和 XML 文档的 API。DOM Level 1 将 HTML 和 XML 定义为一个节点的多层级结构，并暴露出 JavaScript 接口以操作文档的底层结构和外观。DOM 由一系列节点类型构成，主要包括：

- `Node`是基准节点类型，是文档一个部分的抽象表示，其他类型都继承自`Node`。
- `Document`类型表示整个文档，对应树形结构的根节点。在 JavaScript 中，`document`对象是`Document`的实例，拥有查询和获取节点的很多方法。
- `Element`节点表示文档中所有 HTML 或者 XML 元素，可以用来操作它们的内容和属性。
- 其他节点类型分别表示文本内容、注释、文档类型、CDATA 区块和文档片段。

DOM 编程在多数情况下没什么问题，在涉及`<script>`和`<style>`元素时会有一些兼容性问题。因为这些元素分别包含脚本和样式信息，所以浏览器会将它们和其他元素区别对待。

要理解 DOM，最关键的一点是知道影响其性能的问题所在。DOM 操作在 JavaScript 代码中是代价高昂的，`NodeList`对象尤其需要注意。`NodeList`对象是“实时更新”的，这意味着每次访问它都会执行一次新的查询。考虑到这些问题，实践中要尽量减少 DOM 操作的数量。

`MutationObserver`是为替代性能不好的`MutationEvent`而问世的。使用它可以有效精准地监控 DOM 变化，而且 API 也相对简单。
