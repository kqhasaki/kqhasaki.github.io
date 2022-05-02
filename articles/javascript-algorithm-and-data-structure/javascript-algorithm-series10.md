---
title: （十）树
date: 2022-05-03
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h1tz3g74f5j20it0czq3j.jpg
---

前面章节介绍的数组、栈、队列、链表等都是顺序的数据结构，而字典、集合都是非顺序数据结构。本章要介绍另一种非顺序数据结构——**树**，它对于存储需要快速查找的数据非常有用。

本章内容包括：1）树的基本概念；2）二叉搜索树；3）树的遍历；4）添加和移除节点；5）AVL 树。

# 树数据结构

树是一种分层数据的抽象模型。现实生活中最常见的树的例子是家谱，或是公司的组织架构图。
![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1tz8xb375j21bc0my0ul.jpg)

# 树的基本概念

一个树结构包含一系列存在父子关系的节点。每个节点都有一个父节点（除了顶部的第一个节点，根节点）以及零个或多个字节点。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1tzb5h1ahj21bs0kqq5c.jpg)

位于树顶部的节点叫做**根节点**。它没有父节点。树中的每个元素都叫做节点，节点分为**内部节点**和**外部节点**（或**叶节点**）。至少有一个子节点的节点称为内部节点，没有子元素的节点称为外部节点或叶节点。

一个节点可以有祖先和后代。一个节点（除了根节点）的祖先包括父节点、祖父节点、曾祖父节点等。一个节点的后代包括子节点、孙子节点、曾孙节点等。

有关树的另一个术语是**子树**。子树由节点和它的后代构成。

节点的一个属性是深度，节点的深度取决于它的祖先节点的数量。例如，节点 3 有 3 个祖先节点，它的深度为 3。

树的高度取决于所有节点深度的最大值。一棵树也可以被分解成层级。根节点在第 0 层，它的子节点在第 1 层，以此类推。上图中树的高度是 3。

# 二叉树和二叉搜索树

**二叉树**中的节点最多只能有两个字节点：一个是左侧子节点，另一个是右侧子节点。这个定义有助于我们写出更高效地在树中插入、查找和删除节点的算法。二叉树在计算机科学中的应用非常广泛。

**二叉搜索树**（BST）是二叉树的一种，但是只允许在左侧节点存储（比父节点）小的值，右侧节点存储（比父节点）大的值。

二叉搜索树将是本章中主要研究的数据结构。

## 创建`BinarySearchTree`类

先来创建`Node`类来表示二叉搜索树中的每个节点。

```jsx
export class Node {
  constructor(key) {
    this.key = key // 节点值
    this.left = null // 左侧子节点引用
    this.right = null // 右侧子节点引用
  }
}
```

下图展示了二叉搜索树数据结构的组织方式：

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1u7zfrpgpj214s0fut9x.jpg)

和链表一样，我们通过指针（引用）来表示节点之间的关系（树相关的术语称其为**边**）。在双向链表中，每个节点包含两个指针，一个指向下一个节点，一个指向上一个节点。对于树，采用类似的方式，也使用两个指针，但是一个指向**左侧**子节点，另一个指向**右侧**子节点。因此，将声明一个`Node`类来表示树中的每个节点。值得注意的一个小细节，不同于在之前的章节中将节点本身称作节点或顶，我们会称其为键。键是树相关的术语中对节点的称呼。

下面会声明`BinarySearchTree`类的基本结构。

```jsx
import { Compare, defaultCompare } from '../util'
import { Node } from './models/node'

export default class BinarySearchTree {
  constructor(compareFn = defaultCompare) {
    this.compareFn = compareFn // 用来比较节点值
    this.root = null // Node类型的根节点
  }
}
```

我们将声明一个变量来控制此结构中的第一个节点。在树中，即为根节点`root`。

然后需要实现一些接口：

- `insert(key)`：向树中插入一个新的键
- `search(key)`：在树中查找一个键。如果节点存在，则返回`true`；如果不存在，则返回`false`。
- `inOrderTraverse()`：通过中序遍历方式遍历所有节点。
- `preOrderTraverse()`：通过先序遍历方式遍历所有节点。
- `postOrderTraverse()`：通过后序遍历方式遍历所有节点。
- `min()`：返回树中最小的值/键。
- `max()`：返回树中最大的值/键。
- `remove(key)`：从树中移除某个键。

## 向二叉搜索树中插入一个键

在关于树的操作中，经常用到递归。下面的代码用来向树插入一个新键的算法的第一部分。

```jsx
insert(key) {
  if (isNullOrUndefined(this.root)) {
    this.root = new Node(key)
  } else {
    this.insertNode(this.root, key)
  }
}
```

要向树中插入一个新的节点，要经历三个步骤。

第一个步骤是验证插入操作是否是特殊情况。对于二叉搜索树的而言，要检查尝试插入的树节点是否为根节点。如果是，则需要实例化一个`Node`对象，并将其赋值给根节点引用。此时左右指针会初始化为`null`。

第二步是将节点添加到根节点以外的位置。此情况下，需要辅助方法`insertNode()`。

```jsx
insertNode(node, key) {
  if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
    if (isNullOrUndefined(node.left)) {
      node.left = new Node(key)
    } else {
      this.insertNode(node.left, key)
    }
  } else {
    if (isNullOrUndefined(node.right)) {
      node.right = new Node(key)
    } else {
      this.insertNode(node.right, key)
    }
  }
}
```

`insertNode()`方法会帮助我们找到新节点应该插入的正确位置。下面是这个函数实现的步骤。

- 如果树非空，需要找到插入新节点的位置。因此，在调用`insertNode()`方法时要通过参数传入树的根节点和要插入的节点。
- 如果新节点的键小于当前节点的键，那么需要检查当前节点的左侧子节点。注意在这里，由于键可能是复杂的对象而不是数，我们使用传入二叉搜索树构造函数的`compareFn`函数来比较值。如果它没有左侧子节点，那么插入新的节点。如果有左侧子节点，需要通过递归调用`insertNode()`方法继续找到树的下一层。在这里，下次需要比较的节点是当前节点的左子树。
- 如果节点的键比当前的节点键大，同时当前节点没有右侧节点，就在那里插入新的节点。如果有右侧子节点，同样需要递归调用`insertNode()`方法，但是要用来和新节点比较的节点将会是右侧子树。

```jsx
const tree = new BinarySearhTree()
tree.insert(11)
tree.insert(7)
tree.insert(15)
tree.insert(5)
tree.insert(3)
tree.insert(9)
tree.insert(8)
tree.insert(10)
tree.insert(13)
tree.insert(12)
tree.insert(14)
tree.insert(20)
tree.insert(18)
tree.insert(25)
```

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1u8lowow9j20xk0fmwfc.jpg)

```jsx
tree.insert(6)
```

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1u8pprycvj214y0heq44.jpg)

# 树的遍历

遍历一棵树是指访问树的每个节点并对它们进行某种操作的过程。但是我们应该怎样去做呢？应该先从树的顶端还是底端开始呢？从左开始还是从右开始呢？访问树的所有节点有三种方法：中序、先序和后序。我们会深入了解这三种遍历方式的用法和实现。

## 中序遍历

**中序**遍历是一种以上行顺序访问 BST 所有节点的遍历方式，也就是以从最小到最大的顺序访问所有节点。中序遍历的一种应用就是对树进行排序操作。

```jsx
inOrderTraverse(callback) {
  this.inOrderTraverseNode(this.root, callback)
}
```

`inOrderTraverse()`方法接收一个回调函数作为参数。回调函数用来定义我们对遍历到的每个节点进行的操作（这也叫做[访问者模式](https://zh.wikipedia.org/zh-cn/%E8%AE%BF%E9%97%AE%E8%80%85%E6%A8%A1%E5%BC%8F)）。由于我们在 BST 中最常实现的算法是递归，这里使用了一个辅助方法，来接收一个节点和对应的回调函数作为参数。辅助方法如下：

```jsx
inOrderTraverseNode(node, callback) {
  if (!isNullOrUndefined(node)) {
    this.inOrderTraverseNode(node.left, callback)
    callback(node.key)
    this.inOrderTraverseNode(node.right, callback)
  }
}
```

要通过中序遍历的方法遍历一棵树，首先要检查以参数形式传入的节点是否为`null`——这就是停止递归继续执行的判断条件，即递归算法的基线条件。

然后，递归调用相同的函数来访问左侧子节点。接着对当前节点进行一些操作（`callback`），然后再访问右侧子节点。

```jsx
const printNode = value => console.log(value)
tree.inOrderTraverse(printNode)
```

执行代码后，控制台输出顺序如下：

```jsx
  3 5 6 7 8 9 10 11 12 13 14 15 18 20 25
```

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1u941kgfxj20vy0fcq49.jpg)

## 先序遍历

**先序**遍历是以优先于后代节点的顺序访问每个节点的。先序遍历的一种应用是打印一个结构化的文档。

```jsx
preOrderTraverse(callback)) {
  this.preOrderTraverseNode(this.root, callback)
}

preOrderTraverseNode(node, callback) {
  if (!isNullOrUndefined(node)) {
    callback(node.key)
    this.preOrderTraverseNode(node.left, callback)
    this.preOrderTraverseNode(node.right, callback)
  }
}
```

先序遍历和中序遍历的不同点是，先序遍历会先访问节点本身，然后再访问它的左侧子节点，最后是右侧子节点。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1ud1312l3j21100icgmx.jpg)

## 后序遍历

**后序**遍历则是先访问节点的后代节点，再访问节点本身。后序遍历的一个应用是计算一个目录及其子目录中所有文件所占空间的大小。

```jsx
postOrderTraverse(callback) {
  this.postOrderTraverseNode(this.root, callback)
}

postOrderTraverseNode(node, callback) {
  if (!isNullOrUndefined(node)) {
    this.postOrderTraverseNode(node.left, callback)
    this.postOrderTraverseNode(node.right, callback)
    callback(node.key)
  }
}
```

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1udbckgf2j20wo0gqq49.jpg)

# 搜索树中的值

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1udf7ngf7j20ts0h4wfl.jpg)

观察可以发现，最后一层最左侧的节点就是这个棵树中最小的键。首先来看寻找树中最小键的方法：

```jsx
min() {
  return this.minNode(this.root)
}
```

`min()`方法将会暴露给用户。这个方法调用了`minNode()`方法。

```jsx
minNode() {
  let current = node
  while (!isNullOrUndefined(current) && !isNullOrUndefined(current.left)) {
    current = current.left
  }

  return current
}
```

`minNode()`方法允许我们从树的任意一个节点开始寻找最小的键。我们可以用它来找到一棵树或其子树最小的键。因此，我们在调用`minNode()`方法的时候传入树的根节点，因为我们想要找到整棵树的最小键。在`minNode()`方法内部，我们会遍历树的左边直到最下层。

相似的方式可以实现`max()`方法。

```jsx
max() {
  return this.maxNode(this.root)
}

maxNode(node) {
  let current = node
  while(!isNullOrUndefined(current) && !isNullOrUndefined(current.right)) {
    current = current.right
  }
  return current
}
```

## 搜索一个特定的值

我们将在 BST 中实现搜索的方法，查找数据结构中的一个特定的值。

```jsx
search(key) {
  return this.searchNode(this.root, key)
}

searchNode(node, key) {
  if (isNullOrUndefined(node)) {
    return false
  }

  if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
    return this.searchNode(node.left, key)
  } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
    return this.searchNode(node.right, key)
  }
  return true
}
```

## 移除一个节点

我们要为 BST 实现的最后一个方法是`remove()`方法，这是一个比较复杂的方法。

```jsx
remove(key) {
  this.root = this.removeNode(this.root, key)
}

removeNode(node, key) {
  if (isNullOrUndefined(node)) {
    return null
  }

  if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
    node.left = this.removeNode(node.left, key)
    return node
  } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
    node.right = this.removeNode(node.right, key)
    return node
  } else {
    if (isNullOrUndefined(node.left) && isNullOrUndefined(node.right)) {
      node = null
      return node
    }
    if (isNullOrUndefined(node.left)) {
      node = node.right
      return node
    }
    else if (isNullOrUndefined(node.right)) {
      node = node.left
      return node
    }
    const aux = this.minNode(node.right)
    node.key = aux.key
    node.right = this.removeNode(node.right, aux.key)
    return node
  }
}
```
