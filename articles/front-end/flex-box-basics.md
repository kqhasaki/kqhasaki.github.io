---
title: flex布局的基本概念
date: 2022-06-15
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h38yu0f4ugj208m04jdft.jpg
---

Flexible Box 模型，通常被称为 flexbox，是一种一维的布局模型。它给 flexbox 的子元素之间提供了强大的空间分布和对齐能力。

我们说 flexbox 是一种一维的布局，是因为一个 flexbox 一次只能处理一个维度上的元素布局，一行或者一列。作为对比的是另外一个二维布局[CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)，可以同时处理行和列上的布局。

# flex 上的两根轴线

当使用 flex 布局时，首先想到的是两根轴线——主轴和交叉轴。主轴由`flex-direction`定义，另一根轴垂直于它。我们使用 flexbox 的所有属性都跟这两根轴线有关，所以有必要在一开始首先理解它。

## 主轴

主轴由`flex-direction`定义，可以取 4 个值：

- `row`
- `row-reverse`
- `column`
- `column-reverse`

如果你选择了`row`或者`row-reverse`，你的主轴将沿着 inline 方向延伸。

![](https://mdn.mozillademos.org/files/15614/Basics1.png)

选择`column`或者`column-reverse`时，你的主轴会沿着上下方向延伸——也就是**block 排列的方向**。

![](https://mdn.mozillademos.org/files/15615/Basics2.png)

## 交叉轴

交叉轴垂直于主轴，所以如果你的`flex-direction`（主轴）设置成了`row`或者`row-reverse`的话，交叉轴的方向就是沿着列向下的。

![](https://mdn.mozillademos.org/files/15616/Basics3.png)

如果主轴方向设成了`column`或者`column-reverse`，交叉轴就是水平方向。

![](https://mdn.mozillademos.org/files/15617/Basics4.png)

理解主轴和交叉轴的概念对于对齐 flexbox 里面的元素是很重要的；flexbox 的特性是沿着主轴或者交叉轴对齐之中的元素。

# 起始线和终止线

另外一个需要理解的重点是 flexbox 不会对文档的书写模式提供假设。过去，CSS 的书写模式主要被认为是水平的，从左到右的。现代的布局方式涵盖了书写模式的范围，所以我们不再假设一行文字是从文档的左上角开始向右书写，新的行也不是必须出现在另一行的下面。

举例可以帮助理解下为什么不用上下左右来描述 flexbox 的方向：如果`flex-direction`是`row`，并且我们在书写英文，那么主轴的起始线是左边，终止线是右边。

![](https://mdn.mozillademos.org/files/15618/Basics5.png)

如果我们在书写阿拉伯文，那么主轴的起始线是右边，终止线是左边。

![](https://mdn.mozillademos.org/files/15619/Basics6.png)

在这两种情况下，交叉轴的起始线是 flex 容器的顶部，终止线是底部，因为两种语言都是水平书写模式。

现在我们理解了：用起始和终止来描述比左右更合适，这会对理解其他相同模式的布局方法（例如 CSS Grid Layout）起到帮助的作用。

# Flex 容器

文档中采用了 flexbox 的区域就叫做 **flex 容器**。为了创建 flex 容器，我们把一个容器的`display`属性改为`flex`或者`inline-flex`。完成这一步之后，容器中的直系子元素就会变为**flex 元素**。**所有 CSS 属性都会有一个初始值**，所以 flex 容器中的所有 flex 元素都会有下列行为：

- 元素排列为一行（`flex-direction`属性的初始值为`row`）
- 元素从主轴的起始线开始
- 元素不会在主维度方向拉伸，但是可以缩小
- 元素被拉伸来填充交叉轴大小
- `flex-basis`属性为`auto`
- `flex-wrap`属性为`nowrap`

这会让你的元素呈线形排列，并且把自己的大小作为主轴上的大小。如果有太多元素超出容器，它们会溢出而不会换行。如果一些元素比其他元素高，那么元素会沿交叉轴被拉伸来填满它的大小。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h38zp39o48j211q0q60ur.jpg)

## 更改 flex 方向

在 flex 容器中添加`flex-direction`属性可以让我们更改 flex 元素的排列方向。设置`flex-direction: row-reverse`可以让元素沿着行的方向显示，但是起始线和终止线位置会交换。

将 flex 容器的属性`flex-direction`改为`column`，主轴和交叉轴交换，元素沿着列的方向排列显示。改为`column-reverse`，起始线和终止线交换。

下面的例子中，`flex-direction`的值为`row-reverse`。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h38zsa73j2j210g0fw0u4.jpg)

# 实现多行 Flex 容器

虽然 flex box 是一维模型，但同样可以引用到多行中。在这样做的时候，**可以把每一行看作是一个新的 flex 容器**。任何空间分布都将在该行发生，而不影响该空间分布的其他行。

为了实现多行效果，请为属性`flex-wrap`添加一个属性值`wrap`。现在，如果 flex 元素太大而无法全部显示在一行中，则会换行显示。

如果将其值设置为`no-wrap`，它们将会缩小以适应容器，因为它们使用的是允许缩小的初始属性值。如果 flex 元素无法缩小，使用`nowrap`会导致元素溢出。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h38zz99z60j210k0hiabj.jpg)

# 简写属性`flex-flow`

你可以将两个简写属性`flex-direction`和`flex-wrap`组合为简写属性`flex-flow`。第一个指定的值为`flex-direction`，第二个指定的值为`flex-wrap`。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h3901c7s3ej210y0hkmyp.jpg)

# flex 元素上的属性

为了更好地控制 flex 元素，有三个属性可以作用于它们：

- `flex-grow`
- `flex-shrink`
- `flex-basis`

在考虑这几个属性之前，需要先了解一下**可用空间**这个概念。这几个 flex 属性的作用其实就是改变了 flex 容器中的可用空间的行为。同时，可用空间对于 flex 元素的对齐行为也是很重要的。

假设在 1 个 500px 的容器中，我们有 3 个 `100px` 宽的元素，那么这 3 个元素需要占 `300px` 的宽，剩下 `200px` 的可用空间。在默认情况下，flexbox 的行为会把这 `200px` 的空间留在最后一个元素的后面。

![](https://mdn.mozillademos.org/files/15620/Basics7.png)

如果期望这些元素能自动地扩展去填满剩下的空间，那么我们需要去控制可用空间在这几个元素间如何分配，这就是元素上的那些`flex`属性要做的事。

## Flex 元素属性`flex-basis`

`flex-basis`属性定义了该元素的**空间大小**，flex 容器里除了元素所占空间以外的富余空间就是**可用空间**。该属性的默认值是`auto`。此时，浏览器会检测这个元素是否具有确定的尺寸。在上面的例子中，所有元素都设置了宽度为`100px`，所以`flex-basis`的值为`100px`。

如果没有给元素设定尺寸，`flex-basis`的值采用元素内容的尺寸。这就解释了：我们只要给 Flex 元素的父元素声明`display: flex`，所有子元素就会排成一行，且自动分配大小以充分展示元素的内容。

## Flex 元素属性：`flex-grow`

`flex-grow`若被赋值为一个正整数，flex 元素会以`flex-basis`为基础，沿主轴方向增长尺寸。这会使该元素延展，并占据此方向轴上的可用空间。如果有其他元素也被允许延展，那么他们会各自占据可用空间的一部分。

如果我们给上例中的所有元素设定`flex-grow`值为 1，容器中的可用空间会被这些元素平分。它们会延展以填满容器主轴方向上的空间。

`flex-grow`属性可以按比例分配空间。如果第一个元素`flex-grow`的值为 2，其他元素值为 1，则第一个元素将占有 2/4（200px 中的 100px），另外两个元素各占有 1/4（50px）

## Flex 元素属性：`flex-shrink`

`flex-grow`属性是处理 flex 元素在主轴上增加空间的问题，相反`flex-shrink`属性是处理 flex 元素收缩的问题。如果我们的容器中没有足够排列 flex 元素的空间，那么可以把 flex 元素`flex-shrink`属性设置为正整数来缩小它所占空间到`flex-basis`以下。与`flex-grow`属性一样，可以赋予不同值来控制 flex 元素收缩的程度——给`flex-shrink`属性赋予更大的数值可以比赋予小数值的同级元素收缩程度更大。

在计算 flex 元素收缩的大小时，它的最小尺寸也会被考虑进去，也就是说实际上`flex-shrink`属性可能会和`flex-grow`属性表现地不一致。

> 更多可以参考文章——[控制 Flex 子元素在主轴上的比例](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Controlling_Ratios_of_Flex_Items_Along_the_Main_Ax)。

## Flex 元素属性的简写

你可能很少看到`flex-grow`、`flex-shrink`和`flex-basis`属性单独使用，而是混合着写在`flex`属性简写形式中。Flex 简写允许把这三个数值按照`flex-grow`、`flex-shrink`、`flex-basis`的顺序书写。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h391c7rrayj210y0p476b.jpg)

大多数情况下可以用预定义的简写形式，多数情况下都可以这么使用。下面是几种预定义的值：

- `flex: initial`
- `flex: auto`
- `flex: none`
- `flex: <positive-number>`

`flex: initial`是把 flex 元素重置为 Flexbox 的初始值，它相当于`flex: 0 1 auto`。在这里`flex-grow`的值为 0，所以 flex 元素不会超过它们`flex-basis`的尺寸。`flex-shrink`的值为 1，所以可以缩小 flex 元素来防止它们溢出。`flex-basis`的值为`auto`。

`flex: auto`等同于`flex: 1 1 auto`；和上面基本相同，但是这种情况下，flex 元素在需要的时候既可以拉伸也可以收缩。

`flex: none`可以把 flex 元素设置为不可伸缩。它等价于`flex: 0 0 auto`。元素既不能拉伸也不能收缩，但是元素会按具有`flex-basis: auto`属性的 flexbox 进行布局。

> `flex: 1`相当于`flex: 1 1 0`。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h391kfm4n3j210s0oydhs.jpg)

# 元素对齐和空间分配

Flexbox 的一个关键特性是能够设置 flex 元素沿主轴方向和交叉轴方向的对齐方式，以及它们之间的空间分配。

## `align-items`

`align-items`属性可以使元素**在交叉轴方向对齐**。

这个属性的初始值为`stretch`，这就是为什么 flex 元素默认被拉到最高元素的高度。实际上，它们被拉伸来填满 flex 容器——最高的元素定义了容器的高度。

你也可以设置`align-items`的值为`flex-start`，使 flex 元素按 flex 容器的顶部对齐，`flex-end`使它们按 flex 容器的下部对齐，或者`center`使它们居中对齐。

也就是说，`align-items`有四种值：

- `stretch`
- `flex-start`
- `flex-end`
- `center`

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h391rqfonfj210k0pkabx.jpg)

## `justify-content`

`justify-content`属性用来使元素在主轴方向上对齐，主轴方向是通过`flex-direction`设置的方向。初始值是`flex-start`，元素从容器的起始线排列。但是也可以把值设置为`flex-end`，从终止线开始排列，或者`center`，在中间排列。

你也可以把值设置为`space-between`，把元素排列好之后的剩余空间拿出来，平均分配到元素之间，所以元素之间间隔相等。或者使用`space-around`，使每个元素的左右空间相等。

也就是说，`justify-content`有如下取值：

- `flex-start`
- `flex-end`
- `center`
- `space-around`
- `space-between`

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h391zdztc8j210w0gaq4k.jpg)
