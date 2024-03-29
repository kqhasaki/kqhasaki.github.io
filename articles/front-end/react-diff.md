---
title: React diffing算法
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h03xdkara1j20ah05jdg6.jpg
date: 2022-03-09
---

React 提供的声明式 API 让开发者可以在对 React 底层实现并不了解的情况下编写应用。在开发者编写应用时，可以保持相对简单的心智，但开发者无法了解其内部的实现原理。本文描述了在实现 React 的“diffing”算法过程中做出的设计决策，以保证组件更新可预测，且在繁杂的业务场景下仍然保持应用的高性能。

<iframe width="560" height="315" src="https://www.youtube.com/embed/7YhdqIR2Yzo" title="React如何工作？" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# 设计动机

在某一时间节点调用 React 的`render()`方法，会创建一棵由 React 元素组成的树。在下一次`state`或者`props`更新时，相同的`render()`方法会返回一棵不同的树。React 需要基于这两棵树之间的差别来判断如何高效地更新 UI，以保证当前 UI 和最新的树保持同步。

此算法有一些通用的解决方案，即生成将一个棵树转换为另一棵树的最小操作次数。然而，即使使用[最优的算法](https://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf)，该算法的复杂程度仍为 O(n<sup>3</sup>)，其中`n`是树中元素的数量。

如果在 React 中使用该算法，那么展示 1000 个元素需要 10 亿次比较。这个开销过于高昂。于是 React 在以下两个假设的基础之上提出了一套 O(n)的启发式算法：

1. 两个不同类型的元素会产出不同树；
2. 开发者可以通过设置`key`属性，来告知渲染哪些子元素在不同的渲染下可以保存不变；

在实践中，React 团队发现以上假设在几乎所有实用的场景下都成立。

# Diffing 算法

当对比两棵树时，React 首先比较两棵树的根节点。不同类型的根节点元素会有不同的形态。

## 对比不同类型的元素

当根节点为不同类型的元素时，React 会拆卸原有的树并且建立起新的树。例如，当一个元素从`<a>`变成`<img>`，从`<Article>`变成`<Comment>`，或从`<Button>`变成`<div>`都会触发一个完整的重建流程。

当卸载一棵树时，对应的 DOM 节点也会被销毁。组件实例将执行`componentWillUnmount()`方法。当建立一棵新的树时，对应的 DOM 节点会被创建以及插入到 DOM 中。组件实例将执行`UNSAFE_componentWillMount()`方法，紧接着执行`componentDidMount()`方法。所有与之前的树相关联的`state`也会被销毁。

在根节点以下的组件也会被卸载，它们的状态会被销毁。例如：

```html
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

当发生以上变更时，React 会销毁`Counter`组件并且重新装载一个新的组件。

> 避免在代码中使用过时方法`UNSAFE_componentWillMount()`。

## 对比同一类型的元素

当对比两个相同类型的 React 元素时，React 会保留 DOM 节点，仅对比及更新所有改变的属性。

```html
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

通过对比这两个元素，React 知道只要修改 DOM 元素上的`className`属性。

当更新`style`属性时，React 仅更新所有变更的属性。

```jsx
<div style={{color: 'red', fontWeight: 'bold'}} />

<div style={{color: 'green', fontWeight: 'bold'}} />
```

通过对比这两个元素，React 知道只需要修改 DOM 元素上的`color`样式，无需修改`fontWeight`。

在处理完当前节点之后，React 继续对子节点进行递归。

## 对比同类型的组件元素

当一个组件更新时，组件实例会保持不变，因此可以在不同的渲染时保持`state`一致。React 将更新该组件实例的`props`以保证与最新的元素保持一致，并且调用实例的`UNSFAE_componentWillReceiveProps()`、`UNSAFE_componentWillUpdate()`以及`componentDidUpdate()`方法。

下一步，调用`render()`方法，diff 算法将在之前的结果以及新的结果中进行递归。

> 避免在代码中使用过时方法：
>
> - `UNSAFE_componentWillUpdate()`
> - `UNSAFE_componentWillReceiveProps()`。

## 对子节点进行递归

默认情况下，当递归 DOM 节点的子元素时，React 会同时遍历两个子元素的列表；当产生差异时，生成一个 mutation。

在子元素的末尾新增元素时，更新开销比较小。例如：

```jsx
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

React 会先匹配两个`<li>first</li>`对应的树，然后匹配第二个元素`<li>second</li>`对应的树，最后插入第三个元素的`<li>third</li>`树。

如果只是简单地将新增元素插入表头，那么更新开销会比较大。例如：

```jsx
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

React 并不会意识到应该保留`<li>Duke</li>`和`<li>Villanova</li>`，而是会重建每一个子元素。这种情况显然会带来性能问题。

## Keys

为了解决上述问题，React 引入了`key`属性。当子元素拥有`key`时，React 使用`key`来匹配原有树上的子元素以及最新树上的子元素。以下示例在新增`key`之后，使得树的转换效率得以提高：

```jsx
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

现在 React 知道只有带着`'2014'`key 的元素是新元素，带着`'2015'`和`'2016'`key 的元素仅仅移动了。

实际开发中编写一个 key 并不困难。你要展现的元素可能已经有了一个唯一 ID，于是 key 可以直接从数据中提取。

```jsx
<li key={item.id}>{item.name}</li>
```

以上情况不成立时，你可以增加一个 ID 字段到你的模型中，或者利用一部分内容作为哈希值来生成一个 key。这个 key 不需要全局唯一，但是在列表中需要保持唯一。

最后，你也可以使用元素在数组中的下标作为 key。这个策略在元素不尽兴重新排序时比较合适，如果有顺序修改，diff 就会变慢。

当基于下标的组件进行重新排序时，组件 state 可能会遇到一些问题。由于组件实例是基于它们的 key 来决定是否更新以及复用，如果 key 是一个下标，那么修改顺序时会修改当前的 key，导致**非受控组件**的 state（例如输入框）可能相互篡改，会出现无法预期的变动。

> 在 HTML 中，表单元素（`<input>`、`<textarea>`和`<select>`）通常自己维护 state，并且根据用户输入进行更新。而在 React 中，可变状态（mutable state）通常保存在组件的 state 属性中，并且只能通过使用`setState()`来更新。

# 权衡

请谨记协调算法是一个实现细节。React 可以在每个 action 之后对整个应用进行重新渲染，得到的最终结果也是一样的。在此情景下，重新渲染表示在所有组件内调用`render`方法，这不代表 React 会装载或卸载它们。React 只会基于以上提到的规则来决定如何进行差异的合并。

React 团队定期优化启发式算法，让常见用例更高效地执行。在当前的实现中，可以理解为一棵子树能在其兄弟之间移动，但是不能移动到其他位置。在这种情况下，算法会重新渲染整棵子树。

由于 React 依赖启发式算法，因此当以下假设没有得到满足，性能会有所损耗。

- 该算法不会尝试匹配不同组件类型的子树。如果你发现自己在两种不同类型的组件之间相互切换，但输出非常相似的内容，建议把它们改成同一类型。在实践中很少遇到这类问题。
- key 应该具有稳定、可预测，以及列表内唯一的特质。不稳定的 key（例如随机数）会导致许多组件实例和 DOM 节点被不必要地重新创建，可能导致性能下降和子组件中的状态丢失。

<iframe width="560" height="315" src="https://www.youtube.com/embed/i793Qm6kv3U" title="React如何渲染UI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
