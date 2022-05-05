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

一个树结构包含一系列存在父子关系的节点。每个节点都有一个父节点（除了顶部的第一个节点，根节点）以及零个或多个子节点。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1tzb5h1ahj21bs0kqq5c.jpg)

位于树顶部的节点叫做**根节点**。它没有父节点。树中的每个元素都叫做节点，节点分为**内部节点**和**外部节点**（或**叶节点**）。至少有一个子节点的节点称为内部节点，没有子元素的节点称为外部节点或叶节点。

一个节点可以有祖先和后代。一个节点（除了根节点）的祖先包括父节点、祖父节点、曾祖父节点等。一个节点的后代包括子节点、孙子节点、曾孙节点等。

有关树的另一个术语是**子树**。子树由节点和它的后代构成。

节点的一个属性是深度，节点的深度取决于它的祖先节点的数量。例如，节点 3 有 3 个祖先节点，它的深度为 3。

树的高度取决于所有节点深度的最大值。一棵树也可以被分解成层级。根节点在第 0 层，它的子节点在第 1 层，以此类推。上图中树的高度是 3。

# 二叉树和二叉搜索树

**二叉树**中的节点最多只能有两个子节点：一个是左侧子节点，另一个是右侧子节点。这个定义有助于我们写出更高效地在树中插入、查找和删除节点的算法。二叉树在计算机科学中的应用非常广泛。

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
    // 键等于node.key
    if (isNullOrUndefined(node.left) && isNullOrUndefined(node.right)) {
      node = null
      return node
    }

    // 第二种情况
    if (isNullOrUndefined(node.left)) {
      node = node.right
      return node
    }
    else if (isNullOrUndefined(node.right)) {
      node = node.left
      return node
    }

    // 第三种情况
    const aux = this.minNode(node.right)
    node.key = aux.key
    node.right = this.removeNode(node.right, aux.key)
    return node
  }
}
```

如果正在检测的节点为`null`，那么说明键不存在于树中，所以返回`null`。如果不为`null`，我们需要在树中找到要移除的键。因此，如果要找的键比当前节点的值小，就沿着树的左边找到下一个节点。如果要找的键比当前的节点的值大，那么就沿着树的右边找到下一个节点，也就是说我们要分析它的子树。

如果我们找到了要找的键（键和`node.key`相等），就需要处理三种不同的情况。

### 移除一个叶节点

第一种情况是该节点是一个没有左侧或右侧子节点的叶节点。这种情况下，我们要做的就是给这个节点赋值`null`来移除它。这里，这个节点没有任何子节点，但是它有一个父节点，因此需要通过返回`null`来将对应的父节点的子节点指针赋予`null`值。

现在这个节点的值是`null`了，父节点指向它的指针也会收到这个值，这也是我们为什么要在函数中返回节点的值。父节点总是会收到函数的返回值。另一种可行的办法是将父节点和节点本身都作为参数传入方法内部。

下图展现了移除一个叶节点的过程：

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xs4fxhzsj20vm0g8dgw.jpg)

### 移除有一个左侧或右侧子节点的节点

看第二种情况，移除有一个左侧子节点或右侧子节点的节点。这种情况下需要跳过这个节点，直接将父节点指向它的指针指向子节点。如果这个节点没有左侧子节点，也就是说它有一个右侧子节点。因此我们把对它的引用改为对它右侧子节点的引用，并返回更新后的节点。如果这个节点没有右侧子节点，也是一样——把对它的引用改为对它左侧子节点的引用，并返回更新后的值。

下图展现了移除只有一个左侧子节点或右侧子节点的节点的过程。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xsd4ir2gj20wi0go0ts.jpg)

### 移除有两个子节点的节点

现在是第三种情况，也是最复杂的情况，就是要移除的节点有两个子节点——左侧子节点和右侧子节点。要移除有两个子节点的节点，需要执行四个步骤：

1. 当找到了需要移除的节点后，需要找到它右边子树中最小的节点。
2. 然后用它右侧子树中最小节点的键去更新这个节点的值。通过这一步，我们改变了这个节点的键，也就是说它被移除了。
3. 但是，这样在树中有两个拥有相同键的节点了，这是不行的。要继续把右侧子树中的最小节点移除，毕竟它已经被移至要移除的节点的位置了。
4. 最后，向它的父节点返回更新后节点的引用。

下图展示了移除有两个子节点的过程。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xsjf9smbj20zs0iwwfy.jpg)

# 自平衡树

现在我们已经知道如何使用二叉搜索树了。BST 存在一个问题：取决于添加的节点数，树的一条边可能会非常深。也就是说，树的一条分支会有很多层，但是其他的分支却只有几层。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xsm0861gj20zo0rowfz.jpg)

这会在需要在某条边上添加、移除和搜索某个节点时引起一些性能问题。为了解决这个问题，有一种树叫做 Adelson-Velskii-Landi 树（AVL 树）。AVL 树是一种自平衡二叉搜索树，意思是任何一个节点左右两侧子树的高度之差最多为 1。

## Adelson-Velskii-Landi 树（AVL 树）

AVL 树是一种自平衡树。添加或移除节点时，AVL 树会尝试保持自平衡。任意一个节点（不论深度）的左子树和右子树高度最多相差 1。添加或移除节点时，AVL 树会尽可能尝试转换为完全树。

从创建我们的`AVLTree`类开始，声明如下：

```jsx
class AVLTree extends BinarySearchTree {
  constructor(compareFn = defaultCompare) {
    super(compareFn)
    this.compareFn = compareFn
    this.root = null
  }
}
```

既然 AVL 树是一个 BST，我们可以扩展我们写的 BST 类，只需要覆盖用来维持 AVL 树平衡的方法，也就是`insert()`、`insertNode()`和`removeNode()`方法。所有其他的 BST 方法将会被`AVLTree`类继承。

在 AVL 树中插入或移除节点和 BST 完全相同。然而，AVL 树的不同之处在于我们需要检验它的**平衡因子**，如果有需要，会将其逻辑应用于树的自平衡。

我们将学习怎样创建`remove()`和`insert()`方法，但是首先需要学习 AVL 树的术语和它的旋转操作。

### 节点高度和平衡因子

如前所述，节点的高度是从节点到其任意子节点边的最大值。下图展示了一个包含每个节点高度的树。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xsze8hx9j20mw0dqdga.jpg)

计算一个节点高度的代码如下：

```jsx
getNodeHeight(node) {
  if (isNullOrUndefined(null)) {
    return -1
  }
  return Math.max(this.getNodeHeight(node.left), this.getNodeHeight(node.right)) + 1
}
```

在 AVL 树中，需要对每个节点计算右子树高度（`hr`）和左子树高度（`hl`）之间的差值，该值`hr - hl`应该是 0、-1 或 1。如果不是这三个值之一，就需要平衡该 AVL 树。这就是平衡因子的概念。

下图举例说明了一些树的平衡因子（所有树都是平衡的）。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xts48vfxj20x80f2dg6.jpg)

遵循计算一个节点的平衡因子并返回其值的代码如下。

```jsx
getBalanceFactor(node) {
  const heightDifference = this.getNodeHeight(node.left) - this.getNodeHeight(node.right)
  swicth(heightDifference) {
    case -2:
      return BalanceFactor.UNBALANCED_RIGHT
    case -1:
      return BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT
    case 1:
      return BalanceFactor.SLIGHTLY_UNBALANCED_LEFT
    case 2:
      return BalanceFactor.UNBALANCED_LEFT
    default
      return BalanceFactor.BALANCED
  }
}
```

为了避免直接在代码中处理平衡因子的数值，我们还要创建一个用来作为计数器的 JavaScript 常量。

```jsx
const BalanceFactor = {
  UNBALANCED_RIGHT: 1,
  SLIGHTLY_UNBALANCED_RIGHT: 2,
  BALANCED: 3,
  SLIGHTLY_UNBALANCED_LEFT: 4,
  UNBALANCED_LEFT: 5,
}
```

### 平衡操作——AVL 旋转

在对 AVL 树添加或移除节点后，我们要计算节点的高度并验证树是否需要进行平衡。向 AVL 树插入节点时，可以执行单旋转或双旋转两种平衡操作，分别对应四种场景。

- 左-左（LL）：向右的单旋转
- 右-右（RR）：向左的单旋转
- 左-右（LR）：向右的双旋转（先 LL 旋转，再 RR 旋转）
- 右-左（RL）：向左的双旋转（先 RR 旋转，再 LL 旋转）

**左-左（LL）：向右的单旋转**。这种情况出现于节点的左侧子节点的高度大于右侧子节点的高度时，并且左侧子节点也是平衡或较重的。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xu485jv5j20t40bq74q.jpg)

我们来看一个实际的例子，如下图所示。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xu4h8ieyj20z40ekt9o.jpg)

假设向 AVL 树插入节点 5，这会造成树失衡，需要恢复树的平衡。需要执行以下操作：

- 与平衡操作相关的节点有三个（X、Y、Z），将节点 X 置于节点 Y 所在的位置；
- 节点 X 的左子树保持不变；
- 将节点 Y 的左子节点置为节点 X 的右子节点 Z；
- 将节点 X 的右子节点置为节点 Y。

下面代码举例说明了整个过程：

```jsx
rotationLL(node) {
  const tmp = node.left
  node.left = tmp.right
  tmp.right = node
  return tmp
}
```

**右-右（RR）：向左的单旋转**。右-右的情况和左-左的情况相反，它出现于右侧子节点的高度大于左侧子节点的高度，并且右侧子节点也是平衡或右侧较重的。如下所示：

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xv7gemh0j20pa0b0glz.jpg)

我们来看一个实际的例子，如下图所示。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xv83qkymj20xc0e2dgq.jpg)

假设向 AVL 树插入节点 90，这会造成树失衡。为了恢复树的平衡，需要执行以下操作：

- 与平衡操作相关的节点有三个（X、Y、Z），将节点置于节点 Y 所在的位置；
- 节点 X 的右子树保持不变；
- 将节点 Y 的右子节点置为节点 X 的左子节点 Z；
- 将节点 X 的左子节点置为节点 Y。

下面的代码举例说明了整个过程：

```jsx
rotationRR(node) {
  const tmp = node.right
  node.right = tmp.left
  tmp.left = node
  return tmp
}
```

**左-右（LR）：向右的双旋转**。这种情况出现于左侧子节点的高度大于右侧子节点的高度，并且左侧子节点右侧较重。这种情况下，我们可以对左侧子节点进行左旋来修复，这样会形成左-左的情况，然后再对不平衡的节点进行一个右旋来修复，如下图所示。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xvhcvy07j21eq0gignd.jpg)

我们来看一个实际的例子，如下图所示：

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xvnrxjdgj21040g275h.jpg)

基本上就是先做一次 LL 旋转，再做一次 RR 旋转。

```jsx
rotateLR(node) {
  node.left = this.rotationRR(node.left)
  return this.rotationLL(node)
}
```

**右-左（RL）：向左的双旋转**。右-左的情况和左右相反，这种情况出现于右侧子节点的高度大于左侧子节点的高度，并且右侧子节点左侧较重。在这种情况下我们可以对右侧节点进行右旋转来修复，这样会形成右-右的情况，然后我们再对不平衡的节点进行一个左旋转来修复。如下图所示。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xvsefngoj21ek0g2myy.jpg)

我们来看一个实际例子，如下所示。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xvidzhgrj20zi0f2jsi.jpg)

基本上就是先做一次 RR 旋转，再做一次 LL 旋转。

```jsx
rotationRL(node) {
  node.right = this.rotationLL(node.right)
  return this.rotationRR(node)
}
```

理解了这些概念，我们就可以专注于向树添加节点和从树中移除节点的代码了。

### 向 AVL 树插入节点

向 AVL 树插入节点和在 BST 中是一样的。除了插入节点外，我们还要验证插入后树是否还是平衡的，如果不是，就要进行必要的旋转操作。

下面的代码向 AVL 树插入了一个新节点。

```jsx
insert(key) {
  this.root = this.insertNode(this.root, key)
}

insertNode(node, key) {
  // 像在BST中一样插入节点
  if (isNullOrUndefined(node)) {
    return new Node(key)
  } else if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
    ndoe.left = this.insertNode(node.left, key)
  } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
    node.right = this.insertNode(node.right, key)
  } else {
    return node // 重复的键
  }

  // 如果需要，将树进行平衡操作
  const balanceFactor = this.getBalanceFactor(node)
  if (balanceFactor === BalanceFactor.UNBALANCED_LEFT) {
    if (this.compareFn(key, node.left.key) === Compare.LESS_THAN) {
      node = this.rotationLL(node)
    } else {
      return this.rotationLR(node)
    }
  }
  if (balanceFactor === BalanceFactor.UNBALANCED_RIGHT) {
    if (this.compareFn(key, node.right.key) === Compare.BIGGER_THAN) {
      node = this.rotationRR(node)
    } else {
      return this.rotationRL(node)
    }
  }

  return node
}
```

在向 AVL 树中插入节点后，我们需要检查树是否需要进行平衡，因此要使用递归计算以每个插入树的节点为根的节点的平衡因子，然后对每种情况应用正确的旋转。

如果在向左侧子树插入节点后树不平衡了，我们需要比较是否插入的键小于左侧子节点的键。如果是，我们要进行 LL 旋转。否则，要进行 LR 旋转。

如果在向右侧子树插入节点后树不平衡了，我们需要比较是否插入的键小于右侧子节点的键。如果是，我们要进行 RR 旋转。否则，需要进行 RL 旋转。

### 从 AVL 树中移除节点

从 AVL 树中移除节点和在 BST 中是一样的。除了移除节点外，我们还要验证移除后树是否还是平衡的，如果不是，就进行必要的旋转操作。

下面的代码从 AVL 树移除了一个节点。

```jsx
removeNode(node, key) {
  node = super.removeNode(node, key)
  if (isNullOrUndefined(node)) {
    return node // null 不要进行平衡
  }

  // 检测树是否平衡
  const balanceFactor = this.getBalanceFactor(node)
  if (balanceFactor === BalanceFactor.UNBALANCED_LEFT) {
    const balanceFactorLeft = this.getBalanceFactor(node.left)
    if (
      balanceFactorLeft === BalanceFactor.BALANCED ||
      balanceFactorLeft === BalanceFactor.SLIGHTLY_UNBALANCED_LEFT
    ) {
      return this.rotationLL(node)
    }

    if (balanceFactorLeft === BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT) {
      return this.rotationLR(node.left)
    }
  }
  if ((balanceFactor = BalanceFactor.UNBALANCED_RIGHT)) {
    const balanceFactorRight = this.getBalanceFactor(node.right)
    if (
      balanceFactorRight === BalanceFactor.BALANCED ||
      balanceFactorRight === BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT
    ) {
      return this.rotationRR(node)
    }
    if (balanceFactorRight === BalanceFactor.SLIGHTLY_UNBALANCED_LEFT) {
      return this.rotationRL(node.right)
    }
  }

  return node
}
```

既然`AVLTree`类是`BinarySearchTree`类的子类，我们也可以使用 BST 的`removeNode()`方法来从 AVL 树中移除节点。在从 AVL 树中移除节点后，我们需要检查是否需要进行平衡，所以使用递归计算以每个移除的节点为根的节点的平衡因子，然后需要对每种情况应用正确的旋转。

如果在从左侧子树移除节点后树不平衡了，我们要计算左侧子树的平衡因子。如果左侧子树向左不平衡，要进行 LL 旋转；如果左侧子树向右不平衡，要进行 LR 旋转。

最后一种情况是，如果在从右侧子树移除节点后树不平衡了，我们需要计算右侧子树的平衡因子。如果右侧子树向右不平衡，要进行 RR 旋转；如果右侧子树向左不平衡，要进行 lR 旋转。

## 红黑树

和 AVL 树一样，**红黑树**也是一个自平衡二叉树。我们学习了对 AVL 树插入和移除节点可能会造成旋转，所以如果我们需要一个会多次插入和删除的自平衡树，红黑树是比较好的。如果插入和删除的频率较低（更多需要进行搜索操作），那么 AVL 树比红黑树更好。

在红黑树中，每个节点都遵循以下规则：

1. 顾名思义，每个节点不是红的就是黑的；
2. 树的根节点是黑的；
3. 所有叶节点都是黑的；
4. 如果一个节点是红的，那么它的两个子节点都是黑的；
5. 不能有两个相邻的红节点，一个红节点不能有红的父节点或子节点；
6. 从给定的节点到它的后代节点的所有路径包含相同数量的黑色节点。

我们从创建`RedBlackTree`类开始，如下所示。

```jsx
class RedBlackTree extends BinarySearchTree {
  constructor(compareFn = defaultCompare) {
    super(compareFn)
    this.compareFn = compareFn
    this.root = null
  }
}
```

由于红黑树叶是二叉搜索树，可以扩展我们创建的二叉搜索树类并重写红黑树属性所需要的那些方法。我们从`insert()`和`insertNode()`方法开始。

### 向红黑树中插入节点

向红黑树中插入节点和在二叉搜索树中是一样的。除了插入的代码，我们还要在插入后给节点应用一种颜色，并且验证树是否满足红黑树的条件及是否还是自平衡的。

下面的代码向红黑树中插入了新的节点。

```jsx
insert(key) {
  if (isNullOrUndefined(this.root)) {
    this.root = new RedBlackNode(key)
    this.root.color = Colors.BLACK
  } else {
    const newNode = this.insertNode(this.root, key)
    this.fixTreeProperties(newNode)
  }
}
```

如果树是空的，那么我们需要创建一个红黑树节点。我们需要将这个根节点的颜色设置为黑色。默认情况下，创建的节点颜色是红色。如果树不是空的，我们会像二叉搜索树一样在正确的位置插入节点。在这种情况下，`insertNode()`方法需要返回新插入的节点，这样我们可以验证在插入后，红黑树的规则是否得到了满足。

对红黑树来说，节点和之前比起来需要一些额外的属性：节点的颜色和指向父节点的引用。代码如下所示。

```jsx
class RedBlackNode extends Node {
  constructor(key) {
    super(key)
    this.key = key
    this.color = Colors.RED
    this.parent = null
  }

  isRed() {
    return this.color === Colors.RED
  }
}
```

重写的`insertNode()`方法如下。

```jsx
insertNode(node, key) {
  if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
    if (isNullOrUndefined(node.left)) {
      node.left = new RedBlackNode(Key)
      node.left.parent = node
      return node.left
    }
    else {
      return this.insertNode(node.left, key)
    }
  }
  else if (isNullOrUndefined(node.right)) {
    node.right = new RedBlackNode(key)
    node.right.parent = node
    return node.right
  }
  else {
    return this.insertNode(node.right, key)
  }
}
```

我们可以看到，逻辑和二叉搜索树中一样。不同之处在于我们保存了指向被插入节点父节点的引用，并且返回了节点的引用，这样我们可以在后面验证树的属性。

### 在插入节点后验证红黑树属性

要验证红黑树是否还是平衡的以及满足它们的所有要求，我们需要使用两个概念：重新填色和旋转。

在向树中插入节点后，新节点将会是红色。这不影响黑色节点数量的规则，但会影响规则 5：两个后代红色节点不能共存。如果插入节点的父节点是黑色，那没有问题。但是如果插入节点的父节点是红色，那么会违反规则 5。要解决这个冲突，我们只需要改变**父节点**、**祖父节点**和**叔节点**（因为我们同样改变了父节点的颜色）。

下图描述了这个过程。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xxi0k3jqj20w20d43z0.jpg)

下面是`fixTreeProperties()`方法的代码。

```jsx
fixTreeProperties(node) {
  while (node && node.parent && node.parent.isRed() && node.isRed()) {
    const parent = node.parent
    const grandParent = parent.parent

    // 情形A：父节点是左侧子节点
    if (grandParent && grandParent.left === parent) {
      const uncle = grandParent.right

      //情形1A：叔节点也是红色——只需要重新填色
      if (uncle && uncle.isRed()) {
        grandParent.color = Colors.RED
        parent.color = Colors.BlACK
        uncle.color = Colors.BLACk
        node = grandParent
      }
      else {
        // 情形2A：节点是右侧子节点——左旋转
        // 情形3A：节点是左侧子节点——右旋转
      }
    }
    // 情形B：父节点是右侧子节点
    else {
      const uncle = grandParent.left

      // 情形1B：叔节点是红色——只需要重新填色
      if (uncle && uncle.isRed()) {
        grandParent.color = Colors.RED
        parent.color = Colors.BLACK
        uncle.color = Colors.BKACK
        node = grandParent
      }
      else {
        // 情形2B：节点是左侧子节点——右旋转
        // 情形3B：节点是右侧子节点——左旋转
      }
    }
  }
  this.root.color = Colors.BLACK
}
```

从插入的节点开始，我们要验证它的父节点是否是红色，以及这个节点是否不是黑色。为了保证代码的可读性，我们要保存父节点和祖父节点引用。

接下来，我们要验证父节点是左侧子节点（情形 A）还是右侧子节点（情形 B）。对于情形 1A，我们只需要对节点重新填色，父节点是左侧还是右侧子节点没有什么影响。不过在下面的情形中就有影响了。

由于也需要改变叔节点的颜色，我们需要一个指向它的引用。如果叔节点的颜色是红色，就改变祖父节点、父节点和叔节点的颜色，并且将当前节点的引用指向祖父节点，继续检查树是否有其他冲突。

为了保证根节点的颜色始终是黑色，我们在代码最后设置根节点的颜色。

在节点的叔节点颜色为黑时，也就是说仅仅重新填色是不够的，树是不平衡的，我们需要进行旋转操作。

- 左-左（LL）：父节点是祖父节点的左侧子节点，节点是父节点的左侧子节点（情形 3A）。
- 左-右（LR）：父节点是祖父节点的左侧子节点，节点是父节点的右侧子节点（情形 2A）。
- 右-右（RR）：父节点是祖父节点的右侧子节点，节点是父节点的右侧子节点（情形 2A）。
- 右-左（RL）：父节点是祖父节点的右侧子节点，节点是父节点的左侧子节点（情形 2A）。

我们来看看情形 2A 和 3A。

```jsx
// 情形2A：节点是右侧子节点——左旋转
if (node === parent.right) {
  this.rotationRR(parent)
  node = parent
  parent = node.parent
}

// 情形3A：节点是左侧子节点——右旋转
this.rotationLL(grandParent)
parent.color = Colors.BLACK
grandParent.color = Colors.RED
node = parent
```

如果父节点是左侧子节点并且是右侧子节点，我们要进行两侧旋转，首先是右-右旋转，并更新节点和父节点的引用。在第一次旋转后，我们要再次旋转，以祖父节点为基准，并在旋转过程中更新父节点和祖父节点的颜色。最后我们更新当前节点的引用，以便继续检查树的其他冲突。

情形 2A 如下图所示。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xy7lwjvqj21de0dk75r.jpg)

节点是左侧子节点时，我们直接进行左-左旋转。情形 3A 如下图所示。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xy8e1l2aj210i0femyb.jpg)

现在我们来看看情形 2B 和 3B。

```jsx
// 情形2B:节点是左侧子节点——左旋转
if (node === parent.left) {
  this.rotationLL(parent)
  node = parent
  parent = node.parent
}

// 情形3B:节点是右侧子节点——左旋转
this.rotationRR(grandParent)
parent.color = Colors.BLACK
grandParent.color = Colors.RED
node = parent
```

逻辑是一样的，不同之处在于选择会这样进行：先进行左-左旋转，再进行右-右旋转。情形 2B 如下图所示。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xyaxa47pj21ce0dwjsw.jpg)

最后，情形 3B 如下图所示。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1xybhyqvij212q0f60tu.jpg)

### 红黑树旋转

在插入算法中，我们只使用了右-右旋转和左-左旋转。逻辑和 AVL 树是一样的，但是由于我们保存了父节点的引用，需要将引用更新为旋转后的新父节点。

左-左旋转（右旋转）的代码如下。

```jsx
rotationLL(node) {
  const tmp = node.left
  node.left = tmp.right
  if (tmp.right && tmp.right.key) {
    tmp.right.parent = node
  }
  tmp.parent = node.parent
  if (!node.parent) {
    this.root = tmp
  } else {
    if (node === node.parent.left) {
      node.parent.left = tmp
    } else {
      node.parent.right = tmp
    }
  }
  tmp.right = node
  node.parent = tmp
}
```

右-右旋转（左旋转）的代码如下。

```jsx
rotationRR(node) {
  const tmp = node.right
  node.right = tmp.left
  if (tmp.left && tmp.left.key) {
    tmp.left.parent = node
  }
  tmp.parent = node.parent
  if (!node.parent) {
    this.root = tmp
  } else {
    if (node === node.parent.left) {
      node.parent.left = tmp
    } else {
      node.parent.right = tmp
    }
  }
  tmp.left = node
  node.parent = tmp
}
```

# 小结

本章介绍了在计算机科学中被广泛使用的基本树数据结构——二叉搜索树，以及在其中添加、搜索和移除键的算法。我们同样介绍了访问树中每个节点的三种遍历方式，还学认识了两种自平衡二叉搜索树——AVL 树和红黑树。
