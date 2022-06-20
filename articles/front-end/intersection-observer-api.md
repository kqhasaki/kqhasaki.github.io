---
title: Intersection Observer API
date: 2022-06-20
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h3ehi30buej20d609jwef.jpg
---

Intersection Observer API 提供了一种异步检测目标元素与祖先元素或视口相交情况变化的方法。工作中有可能遇到如下业务场景，需要我们在某个元素进入用户视口（viewport）时触发某种操作：

> 在计算机图形学里面，**视口**（viewport）代表了一个可看见的多边形区域（通常来说是矩形）。在浏览器范畴里，它代表的是浏览器中网站可见内容的部分。视口外的内容在被滚动进来之前都是不可见的。视口当前可见的部分叫做**可视视口**（visual viewport），可视视口可能会比**布局视口**（layout viewport）更小，因为当用户缩小浏览器缩放比例时，布局视口不变，而可视视口变小了。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h3eh884nrxg208w0i177o.gif)

# 背景

过去，要检测一个元素是否可见或者两个元素是否相交并不容易，很多解决办法不可靠或者性能很差。然而随着互联网的发展，这种需求却与日俱增。例如，下面这些情况都需要用到相交检测：

- 图片懒加载——当图片滚动到可见时才进行加载;
- 内容无限滚动——也就是用户滚动到接近内容底部时直接加载更多，而无需用户操作翻页，给用户一种网页可以无限滚动的错觉；
- 检测广告曝光情况——为了计算广告收益，需要知道广告元素的曝光情况；
- 在用户看见某个区域时执行任务或播放动画。

过去，相交检测通常要用到事件监听，并且需要频繁调用`Element.getBoundingClientRect()`方法以获取相关元素的边界信息。事件监听和调用`Element.getBoundingClientRect()`都是在主线程上运行，因此频繁触发、调用可能会造成性能问题。这种检测方法极其怪异且不优雅。

假如有一个无限滚动的网页，开发者使用了一个第三方库来管理整个页面的广告，又用了另外一个库来实现消息盒子和点赞，并且页面有很多动画（动画往往意味着较高的性能消耗）。两个库都有自己的相交检测程序，都运行在主线程里，而网站开发者对这些库的内部实现知之甚少，所以并未意识到有什么问题。当用户滚动页面时，这些相交检测程序就会在页面滚动回调里面不停触发调用，造成性能问题，体验效果令人失望。

Intersection Observer API 会注册一个回调函数，每当被监视的元素进入或者退出另外一个元素时（或者 viewport），或者两个元素的相交部分大小发生变化时，该回调方法被触发执行。这样，我们网站的主线程不需要再为了监听元素相交而辛苦劳作，浏览器会自行优化元素相交管理。

注意 Intersection Observer API 无法提供重叠的像素个数或者具体哪个像素重叠，他的更常见的使用方式是——当两个元素相交比例在 N%左右时，触发回调，以执行某些逻辑。

# Intersection Observer 的概念和用法

Intersection Observer API 允许你配置一个回调函数，当以下情况发生时会被调用：

- 每当目标（target）元素与设备视窗或者其他指定元素发生交集的时候执行。设备视窗或者其他元素我们称它为根元素或根（root）。
- Observer 第一次监听目标元素的时候。

通常，我们需要关注文档最接近的可滚动祖先元素的交集更改，如果元素不是可滚动元素的后代，则默认为设备视窗。如果要观察相对于根元素的交集，请指定根元素为`null`。

无论我们使用视口还是其他元素作为根，API 都以相同的方式工作，只要目标元素的可见性发生变化，就会执行我们提供的回调函数，以便与它所需的交叉点交叉。

目标元素与根元素之的交叉度是交叉比。这是目标元素相对于根的交集百分比的表示，它的取值在 0.0 和 1.0 之间。

# 创建一个`IntersectionObserver`

创建一个`IntersectionObserver`实例对象，并传入相应参数和回调函数。该回调函数将会在目标元素和根元素的交集大小超过阈值规定的大小时候被执行。

```jsx
const options = {
  root: document.querySelector('#scrollArea'),
  rootMargin: '0px',
  threshold: 1.0,
}

const observer = new IntersectionObserver(callback, options)
```

阈值为 1.0 意味着目标元素完全出现在 root 选项指定的元素中可见时，回调函数将会被执行。

# `IntersectionObserver`选项

传递到`IntersectionObserver()`构造函数的`options`对象，允许我们控制观察者的回调函数的被调用时的环境。它有以下字段：

- `root`，指定根元素，用于检查目标的可见性。必须是目标元素的父级元素，如果未指定或者为`null`，则默认为浏览器视窗。
- `rootMargin`，根元素的外边距。类似于 CSS 中的`margin`属性。如果有指定`root`参数，则`rootMargin`也可以使用百分比来取之。该属性值是用作 root 元素和 target 发生交集时候的计算交集的区域范围，使用该属性可以控制 root 元素每一边的收缩或者扩张。默认值为 0。
- `threshold`，可以是单一的 number 也可以是 number 数组，target 元素和 root 元素相交程度到达该值的时候 IntersectionObserver 注册的回调函数将被执行。如果你只是想要 target 元素在 root 元素中的可见性超过 50%的时候，你可以指定该属性值为 0.5。如果想要 target 元素在 root 元素的可见程序每多 25%就执行一次回调，那么可以指定一个数组`[0, 0.25, 0.5, 0.75, 1]`。默认值是 0（意味着只要有一个 target 像素出现在 root 元素中，回调函数将会被执行）。该值为 1.0 含义是当 target 完全出现在 root 元素中时候回调才会被执行。

# 观察指定目标

创建一个 observer 之后需要给定一个目标元素进行观察。

```jsx
const target = document.querySelector('#listItem')
observer.observe(target)
```

每当目标满足该观察者指定的`threshold`值，回调被调用。

只要目标满足为`IntersectionObserver`指定的阈值，就会调用回调。回调接收`IntersectionObserverEntry`对象和观察者的列表：

```jsx
const callback = (entries, observer) => {
  entries.forEach(entry => {
    // Each entry describes an intersection change for one observed target element:
    // entry.boundingClientRect
    // entry.intersectionRatio
    // entry.intersectionRect
    // entry.isIntersecting
    // entry.rootBounds
    // entry.target
    // entry.time
  })
}
```

请留意，我们注册的回调函数将会在主线程中被执行。所以该函数执行速度要尽可能块，如果有一些耗时的操作需要执行，建议使用`window.requestIdleCallback()`方法。

> `window.requestIdleCallback()`方法插入一个函数，这个函数将会在浏览器空闲时被调用。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，例如动画和输入响应。函数一般会按照先进先调用的顺序执行，然而如果回调函数指定了执行超时事件`timeout`，则有可能为了在超时前执行函数而打乱顺序。
> 我们可以在空闲回调函数中调用`resquestIdleCallback()`，以便在下一次通过事件循环之前调度另一个回调。

# 交集的计算

所有区域均被 Intersection Observer API 当作一个矩形来看待。如果元素是不规则的图形也将会被看成一个包含元素所有区域的最小矩形，相似地，如果元素发生的交集部分不是一个矩形，那么也会被看作是一个包含它所有交集区域的最小矩形。

上述解释有助于理解`IntersectionObserverEntry`提供的属性，其用于描述目标元素和根的交集。

# `thresholds`选项

Intersection API 并不会每次在元素的交集发生变化的时候都会执行回调。相反它使用了`threshold`选项。当我们创建一个 observer 的时候，可以提供一个或者多个`number`类型的数值用来表示目标元素在根元素的可见程度的百分比。然后 API 的回调函数只会在元素达到规定的阈值时执行。

可以通过检测在每次交集发生变化的时候都会传递给回调函数的参数`isIntersecting`属性值来判断目标元素在根元素中的可见性是否发生变化。如果`isIntersecting`为真，表示目标元素至少已经达到 threshold 里面规定的一个阈值，如果为假，则表明目标元素不在给定的阈值范围内可见。

# API

- `IntersectionObserver.prototype.disconnect()`，使`IntersectionObserver`对象停止监听工作。

- `IntersectionObserver.prototype.observe()`，使`IntersectionObserver`开始监听一个元素。

- `IntersectionObserver.prototype.unobserve()`，停止监听特定目标元素。
