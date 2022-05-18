---
title: （十二）图
date: 2022-05-18
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h2cx3tn1h9j20kl0hv3zp.jpg
---

本章，我们将学习另一种非线性数据结构——图（graph）。本章将包含不少图的巧妙运用，图是一个庞大的主题，深入探索图的奇妙世界就足够写一本书了。在本章中我们将讨论以下话题：

- 图的相关术语
- 图的三种不同表示
- 图数据结构
- 图的搜索算法
- 最短路径算法（Dijkstra 算法、Floyd-Warshall 算法）
- 最小生成树算法（Prim 算法，Kruskal 算法）

# 图的相关术语

图是网络结构的抽象模型。图是一组由**边**连接的**节点**（或**顶点**）。学习图是重要的，因为任何二元关系都可以用图来表示。

任何社交网络，如 Facebook、Twitter 和 Google+，都可以用图来表示。

我们还可以用图来表示道路、航班以及通信，如下图所示。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h2cx96mjr6j211g0iwjsk.jpg)

让我们来学习一下图在数学以及技术上的概念。一个图 _G_=(_V_,_E_)由以下元素组成：

- _V_：一组顶点
- _E_： 一组边，连接 _V_ 中的顶点

下图表示一个图：

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h2cxb8yiegj20qk0esaal.jpg)

在着手实现算法之前，让我们先了解一下图的一些术语。

由一条边连接在一起的顶点称为**相邻顶点**。例如，A 和 B 是相邻的，A 和 D 是相邻的，A 和 C 是相邻的，A 和 E 是不相邻的。

一个顶点的**度**是其相邻顶点的数量。例如，A 和其他三个顶点相连接，因此 A 的度为 3；E 和其他两个顶点相连，因此 E 的度为 2。

**路径**是顶点 v<sub>1</sub>,v<sub>2</sub>,...,v<sub>k</sub> 的一个连续序列，其中 v<sub>i</sub> 和 v<sub>i+1</sub> 是相邻的。以上一示意图中的图为例，其中包含路径 ABEI 和 ACDG。

简单路径要求不包含重复的顶点。举个例子，ADG 是一条简单路径。除去最后一个顶点（因为它和第一个顶点是同一个顶点），**环**也是一个简单路径，例如 ADCA（最后一个顶点重新回到 A）。

如果图中不存在环，则称该图是**无环的**。如果图中每两个点之间都存在路径，则该图是**连通的**。

## 有向图和无向图

图可以是无向的（边没有方向）或是有向的（有向图）。如下图所示，有向图的边有一个方向。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h2cxneb2bfj20ue0iowf9.jpg)

如果图中每两个顶点间在双向上都存在路径，则该图是**强连通的**。例如，C 和 D 是强连通的，而 A 和 B 不是强连通的。

图还可以是**未加权的**（目前为止我们看到的图都是未加权的）或是**加权的**。如下图所示，加权图的边被赋予了权值。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h2cxq45cwpj20lu0dm0t7.jpg)

我们可以使用图来解决计算机科学世界中的许多问题，例如搜索图中的一个特定顶点或搜索一条特定边，寻找图中的一条路径（从一个顶点到另一个顶点），寻找两个顶点之间的最短路径，以及环检测。

# 图的表示

从数据结构的角度来说，我们有很多种方式来表示图。在所有的表示法种，不存在绝对正确的方式。图的正确表示法取决于待解决的问题和图的类型。

## 邻接矩阵

图最常见的实现是**邻接矩阵**。每个节点都和一个整数相关联，该整数将作为数组的索引。我们用一个二维数组来表示顶点之间的连接。如果索引为<sub>i</sub>的节点和索引为<sub>j</sub>的节点相邻，则`array[i][j] === 1`，否则`array[i][j] === 0`，如下图所示。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h2cxyqie6zj20vq0f6dh1.jpg)

不是强连通的图（**稀疏图**）如果用邻接矩阵来表示，则矩阵中将会有很多 0，这意味着我们浪费了计算机存储空间来表示根本不存在的边。例如，找给定顶点的相邻顶点，即使该顶点只有一个相邻顶点，我们也不得不迭代一整行。邻接矩阵表示法不够好的另一个理由是，图中顶点的数量可能会变，而二维数组不太灵活。

## 邻接表

我们也可以使用一种叫做**邻接表**的动态数据结构来表示图。邻接表由图中每个顶点的相邻顶点列表所组成。存在好几种方式来表示这种数据结构。我们可以用列表（数组）、链表，甚至是散列表或是字典来表示相邻顶点列表。下面的示意图展示了邻接表数据结构。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h2cy5c4pwuj20s60eggmd.jpg)

尽管邻接表可能对大多数问题来说都是更好的选择，但以上两种表示法都很有用，且它们有着不同的性质（例如，要找出顶点 v 和 w 是否相邻，使用邻接矩阵会比较快）。在本书的示例中，我们将会使用邻接表表示法。

## 关联矩阵

还可以用**关联矩阵**来表示图。在关联矩阵中，矩阵的行表示顶点，列表示边。如下图所示，使用二维数组来表示两者之间的连通性，如果顶点 v 是边 e 的入射点，则`array[v][e] === 1`；否则，`array[v][e] === 0`。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h2cy9iwmwlj211m0gs40c.jpg)

关联矩阵通常用于边的数量比顶点多的情况，以节省空间和内存。

# 创建`Graph`类

照例，我们声明类的骨架：

```jsx
class Graph {
  constructor(isDirected = false) {
    this.isDirected = isDirected
    this.vertices = []
    this.adjList = new Dictionary()
  }
}
```

`Graph`构造函数可以接受一个参数来表示图是否有向，默认情况下，图是无向的。我们使用一个数组来存储图中所有顶点的名字，以及一个字典来存储邻接表。字典将会使用顶点的名字作为键，邻接顶点列表作为值。

接着我们将实现两个方法：一个用来向图中添加一个新的顶点（因为图实例化后是空的），另外一个方法用来添加顶点之间的边。我们先实现`addVertex`方法。

```jsx
addVertex(v) {
  if (!this.vertices.includes(v)) {
    this.vertices.push(v)
    this.adjList.set(v, [])
  }
}
```

这个方法接收顶点 v 作为参数。只有在这个顶点不存在于图中时，我们将该顶点添加到顶点列表中，并且在邻接表中，设置顶点 v 作为键对应的字典值为一个空数组。

接下来我们实现`addEdge()`方法。

```jsx
addEdge(v, w) {
  if (!this.adjList.get(v)) {
    this.addVertex(v)
  }
  if (!this.adjList.get(w)) {
    this.addVertex(w)
  }
  this.adjList.get(v).push(w)
  if (!this.isDirected) {
    this.adjList.get(w).push(v)
  }
}
```

这个方法接收两个顶点作为参数，也就是我们要建立连接的两个顶点。在连接顶点之前，需要验证顶点是否存在于图中。如果顶点 v 或 w 不存在于图中，要将它们加入顶点列表。

然后，通过将 w 加入到 v 的邻接表中，我们添加了一条自顶点 v 到 w 的边。如果想要实现一个有向图，则只添加一个邻接表项就够了。由于本章中大多数例子都是基于无向图的，我们需要添加一条自 w 到 v 的边。

> 注意这里指需要往邻接表项数组里面新增元素，因为添加顶点的时候，其邻接表项已经初始化为空数组了。

要完成创建`Graph`类，我们还要声明两个取值的方法：一个返回顶点列表，另一个返回邻接表。

```jsx
getVertices() {
  return this.vertices
}

getAdjList() {
  return this.adjList
}
```

# 图的遍历

和树数据结构类似，我们可以访问图的所有节点。有两种算法可以对图进行遍历，**广度优先搜索**（breadth-first search, BFS）和**深度优先搜索**（depth-first search, DFS）。图遍历可以用来寻找特定的顶点或寻找两个顶点之间的路径，检查图是否连通，检查图是否含有环等等。

在实现算法之前，让我们来更好地理解一下图遍历的思想。

**图遍历算法**的思想是必须追踪每个第一次访问的节点，并且追踪有哪些节点还没有被完全探索。对于两种图遍历算法，都需要明确指出第一个被访问的顶点。

完全探索一个顶点要求我们查看该顶点的每一条边。对于每一条边所连接的没有被访问过的顶点，将其标注为被发现的，并将其加进待访问顶点列表中。

为了保证算法的效率，务必访问每个顶点最多两次。连通图中的每条边和顶点都会被访问到。

广度优先搜索算法和深度优先搜索算法基本上是相同的，只有一点不同，那就是待访问顶点列表的数据结构，如下表所示。

|     算法     | 数据结构 |                               描述                               |
| :----------: | :------: | :--------------------------------------------------------------: |
| 深度优先搜索 |    栈    | 将顶点存入栈，顶点是沿着路径被探索的，存在新的相邻顶点就去访问。 |
| 广度优先搜索 |   队列   |           将顶点存入队列，最先入队列的顶点最先被探索。           |

当要标注已经访问过的顶点时，我们用三种颜色来反映它的状态。

- 白色：表示该顶点还没有被访问。
- 灰色：表示该顶点被访问过，但并未被探索过。
- 黑色：表示该顶点被访问过且被完全探索过。

这就是之前提到的务必访问每个顶点最多两次的原因。

为了有助于在广度优先和深度优先算法中标记顶点，我们要使用`Colors`变量（作为一个枚举器），声明如下：

```jsx
const Colors = {
  WHITE: 0,
  GREY: 1,
  BLACK: 2,
}
```

两个算法还需要一个辅助对象来帮助存储顶点是否被访问过。在每个算法的开头，所有的顶点会被标记为未访问（白色）。我们要使用下面的函数来初始化每个顶点的颜色。

```jsx
const initializeColor = vertices => {
  const color = {}
  for (const vertex of vertices) {
    color[vertex] = Colors.WHITE
  }
  return color
}
```

<iframe width="560" height="315" src="https://www.youtube.com/embed/cWNEl4HE2OE" title="图遍历算法" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 广度优先搜索

广度优先搜索方法会从指定的第一个顶点开始遍历图，先访问其所有的邻点（相邻顶点），就像一次访问图的一层。换句话说，就是先宽后深地访问顶点，如下图所示。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h2czj9elu2j20p80fwwf6.jpg)

以下是从顶点 v 开始的广度优先搜索算法所遵循的步骤。

1. 创建一个队列 Q。
2. 标注 v 为被发现的（灰色），并将 v 入队列 Q。
3. 如果 Q 非空，则执行以下步骤：
   1. 将 u 从 Q 中移出队列；
   2. 标注 u 为被发现的（灰色）；
   3. 将 u 所有未被访问过的邻点（白色）入队列；
   4. 标注 u 为已被探索的（黑色）。

让我们来实现广度优先算法。

```jsx
export const breadthFirstSearch = (graph, startVertex, callback) => {
  const vertices = graph.getVertices()
  const adjList = graph.getAdjList()
  const color = initializeColor(vertices)
  const queue = new Queue()

  queue.enqueue(startVertex)

  while (!queue.isEmpty()) {
    const u = queue.dequeue()
    const neighbors = adjList.get(u)
    color[u] = Colors.GREY
    for (let i = 0; i < neighbors.length; i++) {
      const w = neighbors[i]
      if (color[w] === Colors.WHITE) {
        color[w] = Colors.GREY
        queue.enqueue(w)
      }
    }
    color[u] = Colors.BLACK
    if (callback) {
      callback(u)
    }
  }
}
```

让我们深入学习广度优先搜索方法的实现。我们要做的第一件事情是用`initializeColor`函数来将`color`数组初始化为白色。我们还需要声明和创建一个`Queue`实例，它将会存储待访问和待探索的顶点。

`breadthFirstSearch`方法接收一个图实例和顶点作为算法的起始点。起始顶点是必要的，我们将此顶点入队列。

如果队列非空，我们将通过出队列操作从队列中移除一个顶点，并取得一个包含其所有邻点的邻接表。该顶点将被标注为灰色，表示我们发现了它（但是还未完成对其的探索）。

对于 u 的每个邻点，我们取得其值，如果它还未被访问过（颜色为白色），则将其标注为我们已经发现了它（颜色设置为灰色），并将这个顶点加入队列。这样当其从队列中出列的时候，我们可以完成对其的探索。

当完成探索该顶点和其相邻顶点后，我们将该顶点标注为已探索过的（颜色设置为黑色）。

我们实现的这个`breadthFirstSearch`方法也接收一个回调。这个参数是可选的，如果我们传递了回调函数，就会用到它。

### 使用 BFS 寻找最短路径

到目前为止，我们只展示了 BFS 算法的工作原理。我们可以用该算法做更多事情，而不只是输出被访问顶点的顺序。例如，考虑如何来解决下面这个问题。

给定一个图 G 和源顶点 v，找出每个顶点 u 和 v 之间最短路径的距离（以边的数量计）。

对于给定顶点 v，广度优先算法会访问所有与其距离为 1 的顶点，接着是距离为 2 的顶点，以此类推。所以，可以用广度优先算法来解决这个问题。我们可以修改`breadthFirstSearch`方法以返回给我们一些信息。

- 从 v 到 u 的距离`distances[u]`；
- 前溯点`predecessors[u]`，用来推导出从 v 到其他每个顶点 u 的最短路径。

让我们来看看改进过的广度优先方法的实现。

```jsx
const BFS = (graph, startVertex) => {
  const vertices = graph.getVertices()
  const adjList = graph.getAdjList()
  const color = initializeColor(vertices)
  const queue = new Queue()
  const distances = {}
  const predecessors = {}
  queue.enqueue(startVertex)

  for (let i = 0; i < vertices.length; i++) {
    distances[vertices[i]] = 0
    predecessors[vertices[i]] = null
  }

  while (!queue.isEmpty()) {
    const u = queue.dequeue()
    const neighbors = adjList.get(u)
    color[u] = Colors.GREY
    for (let i = 0; i < neighbors.length; i++) {
      const w = neighbors[i]
      if (color[w] === Colors.WHITE) {
        color[w] = Colors.GREY
        distances[w] = distances[u] + 1
        predecessors[w] = u
        queue.enqueue(w)
      }
    }
    color[u] = Colors.BLACK
  }

  return {
    distances,
    predecessors,
  }
}
```

来看看这个版本的 BFS 方法有什么改变？

我们还需要声明数组`distances`来表示距离，以及`predecessors`数组来表示前溯点。下一步则是对于图中的每一个顶点，用`0`来初始化数组`distances`，用`null`来初始化数组`predecessors`。

当我们发现顶点`u`的邻点`w`时，则设置`w`的前溯点值为`u`。我们还通过给`distances[u]`加 1 来增加`v`和`w`之间的距离（`u`是`w`的前溯点，`distances[u]`的值已经有了）。

方法最后返回了一个包含`distances`和`predecessors`的对象。现在，我们可以再次执行`BFS`方法，并将其返回值存在一个变量中。

```jsx
const shortestPathA = BFS(graph, myVertices[0])
console.log(shortestPathA)
```

对顶点`A`执行`BFS`方法，以下将会是输出。

```
distances: [A: 0, B: 1, C: 1, D: 1, E: 2, F: 2, G: 2, H: 2 , I: 3],
predecessors: [A: null, B: "A", C: "A", D: "A", E: "B", F: "B", G: "C", H: "D", I: "E"]
```

这意味着顶点`A`与顶点`B`、`C`和`D`的距离为 1；与顶点`E`、`F`、`G`和`H`的距离为 2；与顶点`I`的距离为 3。通过前溯点数组，我们可以用下面这段代码来构建从顶点`A`到其他顶点的路径。

```jsx
const fromVertex = myVertices[0]

for (let i = 0; i < myVertices.length; i++) {
  const toVertex = myVertices[i]
  const path = new Stack()
  for (let v = toVertex; v !== fromVertex; v = shortestPathA.predecessors[v]) {
    path.push(v)
  }
  path.push(fromVertex)
  let s = path.pop()
  while (!path.isEmpty()) {
    s += ' - ' + path.pop()
  }
  console.log(s)
}
```

我们用顶点`A`作为源顶点。对于每个其他顶点，我们会计算顶点`A`到它的路径。我们从`myVertices`数组得到值，然后会创建一个栈来存储路径值。

接着我们追溯`toVertex`到`fromVertex`的路径。变量`v`被赋值为其前溯点的值，这样我们能够反向追溯这条路径。将变量`v`添加到栈中。最后，源顶点也会被添加到栈中，以得到完整路径。

之后，我们创建了一个`s`字符串，并将源顶点赋值给它（它是最后一个加入栈中的，所以是第一个被弹出的项）。当栈是非空的，我们就从栈中移除一个项并将其拼接到字符串`s`的后面。最后，在控制台上输出路径。

执行该段代码，会得到如下输出：

```
A-B
A-C
A-D
A-B-E
A-B-F
A-C-G
A-D-H
A-B-E-I
```

这里，我们得到了从顶点`A`到图中其他顶点的最短路径。（衡量标准是边的数量）。

### 深入学习最短路径算法

本章中的图不是加权图。如果要计算加权图中的最短路径（例如城市 A 和 B 之间的最短路径——GPS 和 Google Maps 中常用的算法），广度优先搜索未必合适。

举几个例子，**Dijkstra**算法解决了单源最短路径的问题。**Bellman-Ford**算法解决了边权值为负的单源最短路径问题。**A\*搜索算法**解决了求仅一对顶点间的最短路径问题，用经验法则来加速搜索过程。**Floyd-Warshall**算法解决了求所有顶点对之间的最短路径这一问题。

本章后面会学习 Dijkstra 算法和 Floyd-Warshall 算法。

## 深度优先搜索

深度优先搜索算法将会从第一个指定的顶点开始遍历图，沿着路径直到这条路径最后一个顶点被访问了，接着原路回退并探索下一条路径。换句话说，它是先深度后广度地访问顶点，如下图所示。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h2hacxcv10j20lq0akglx.jpg)

深度优先搜索算法并不需要一个源顶点。在深度优先搜索算法中，若图中顶点 v 未访问，则访问顶点 v。

要访问顶点 v，照如下步骤做：

1. 标注 v 为被发现的（灰色）；
2. 对于 v 的所有未访问（白色）的邻点 w，访问顶点 w；
3. 标注 v 为已被探索的（黑色）。

如你所见，深度优先搜索的步骤是递归的。这意味着深度优先搜索算法使用栈来存储函数调用（由递归调用所创建的栈）。

让我们来实现一下深度优先算法：

```jsx
const depthFirstSearch = (graph, callback) => {
  const vertices = graph.getVertices()
  const adjList = graph.getAdjList()
  const color = initializeColor(vertices)

  for (let i = 0; i < vertices.length; i++) {
    if (color[vertices[i]] === Colors.WHITE) {
      depthFirstSearchVisit(vertices[i], color, adjList, callback)
    }
  }
}

const depthFirstSearchVisit = (u, color, adjList, callback) => {
  color[u] = Colors.GREY
  if (callback) {
    callback(u)
  }

  const neighbours = adjList.get(u)
  for (let i = 0; i < neighbors.length; i++) {
    const w = neighbors[i]
    if (color[w] === Colors.WHITE) {
      depthFirstSearchVisit(w, color, adjList, callback)
    }
  }
  color[u] = Colors.BLACK
}
```

`depthFirstSearch`函数接收一个`Graph`类实例和回调函数作为参数。在初始化每个顶点的颜色后，对于图实例中每一个未被访问过的顶点，我们调用私有的递归函数。`depthFirstSearchVisit`，传递的参数为要访问的顶点`u`、颜色数组以及回调函数。

当访问顶点`u`时，我们标注其为被发现的。如果有`callback`函数的话，则执行该函数已访问过的顶点。接下来的一步是取得包含顶点`u`所有邻点的列表。对于顶点`u`的每一个未被访问过（颜色为白色）的邻点`w`，将调用`depthFirstSearchVisit`函数，传递`w`和其他参数。最后，在该顶点和邻点按深度访问之后，我们回退，意思是该顶点已经被完全探索，并将其标注为黑色。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h2harjnhqpj216w0u0wjp.jpg)

> Angular2 在探测虚拟 DOM 变更时使用的算法和深度优先搜索算法非常相似。数据结构和算法对于理解前端框架是怎样工作的以及将你的知识提升到更高的层次也是很重要的。

### 探索深度优先算法

到目前为止，我们只是展示了深度优先搜索算法的工作原理。我们可以用该算法做更多的事情，而不只是输出被访问顶点的顺序。

对于给定的图 G，我们希望深度优先搜索算法遍历图 G 的所有节点，构建“森林”（**有根树**的一个集合）以及一组源顶点（根），并输出两个数组：发现时间和完成探索时间。我们可以修改`depthFirstSearch`函数来返回一些信息：

- 顶点`u`的发现时间`d[u]`；
- 当顶点`u`被标注为黑色时，`u`的完成探索时间`f[u]`；
- 顶点`u`的前溯点`p[u]`。

让我们看看改进了的`DFS`方法的实现：

```jsx
export const DFS = graph => {
  const vertices = graph.getVertices()
  const adjList = graph.getAdjList()
  const color = initializeColor(vertices)
  const d = {}
  const f = {}
  const p = {}
  const time = { count: 0 }
  for (let i = 0; i < vertices.length; i++) {
    f[vertices[i]] = 0
    d[vertices[i]] = 0
    p[vertices[i]] = null
  }

  for (let i = 0; i < vertices.length; i++) {
    if (color[vertices[i]] === Colors.WHITE) {
      DFSVisit(vertices[i], color, d, f, p, time, adjList)
    }
  }

  return {
    discovery: d,
    finished: f,
    predecessors: p,
  }
}

const DFSVisit = (u, color, d, f, p, time, adjList) => {
  color[u] = Colors.GREY
  d[u] = ++time.count
  const neighbors = adjList.get(u)
  for (let i = 0; i < neighbors.length; i++) {
    const w = neighbors[i]
    if (color[w] === Colors.WHITE) {
      p[w] = u
      DFSVisit(w, color, d, f, p, time, adjList)
    }
  }
  color[u] = Colors.BLACK
  f[u] = ++time.count
}
```

我们需要声明一个变量来追踪发现时间和完成探索时间。

接下来我们声明数组`d`、`f`和`p`，还需要为图的每一个顶点来初始化这些数组。在这个方法结尾处返回这些值，之后需要使用它们。

当一个顶点第一次被发现时，我们追踪其发现时间。当它是由引自顶点`u`的边而被发现的，我们追踪它的前溯点。最后，当这个顶点被完全探索后，我们追踪其完成的时间。

深度优先算法背后的思想是什么？边是从最近发现的顶点`u`处被向外探索的。只有连接到未发现的顶点的边被探索了。当`u`所有的边都被探索了，该算法会退到`u`被发现的地方去探索其他的边。这个过程持续到我们发现了所有从原始顶点能够触及的顶点。如果还留有任何其他未被发现的顶点，我们对新源顶点重复这个过程。重复该算法，直到图中所有的顶点都被探索了。

对于改进过的深度优先搜索，有两点值得注意：

- 时间变量的取值范围只可能在图顶点数量的一倍到两倍之间；
- 对于所有的顶点`u`，`d[u]`<`f[u]`，意味着，发现时间比完成时间小。

在这两个假设下，我们有如下规则：

```
1 <= d[u] < f[u] <= 2|v|
```

如果对同一个图再跑一遍新的深度优先搜索方法，对于图中每个顶点，我们得到如下的发现/完成时间。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h2hbks711uj20pm0g6gmb.jpg)

### 拓扑排序——使用深度优先搜索

给定下图，假定每个顶点都是一个我们需要执行的任务。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h2hbmgn5tlj20fc09kwel.jpg)

> 这是一个有向图，意味着任务的执行是有顺序的。例如，任务 F 不能在任务 A 之前执行。注意这个图没有环，意味着这是一个无环图。所以，可以说这个图是一个**有向无环图**（DAG）

当我们需要编排一些任务或步骤的执行顺序时，这称为**拓扑排序**（topological sorting，简写为 topsort 活 toposort）。在日常生活中，这个问题在不同情形下都会出现。例如，当我们开始学习一门计算机课程，在学习某些知识之前得按顺序完成一些知识储备。当我们在开发一个项目时，需要按顺序执行一些步骤。

拓扑排序只能引用于 DAG。那么，如何使用深度优先搜索来实现拓扑排序呢？让我们在本节示意图上执行一下深度优先搜索：

```jsx
const graph = new Graph(true) // 有向图

myVertices = ['A', 'B', 'C', 'D', 'E', 'F']
for (let i = 0; i < myVertices.length; i++) {
  graph.addVertex(myVertices[i])
}
graph.addEdge('A', 'C')
graph.addEdge('A', 'D')
graph.addEdge('B', 'D')
graph.addEdge('B', 'E')
graph.addEdge('C', 'F')
graph.addEdge('F', 'E')

const result = DFS(graph)
```

这段代码将创建图，添加边，执行改进版本的深度优先搜索算法，并将结果保存到`result`变量。下图展示了深度优先搜索算法执行后，该图的发现和完成时间。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h2hbtj53ykj20hc0akwep.jpg)

现在要做的仅仅是以倒序来排序完成的时间数组，这便得出了该图的拓扑排序。

```jsx
const fTimes = result.finished
let s = ''
for (let count = 0; count < myVertices.length; count++) {
  let max = 0
  let maxName = null
  for (let i = 0; i < myVertices.length; i++) {
    if (fTimes[myVertices[i]] > max) {
      max = fTimes[myVertices[i]]
      maxName = myVertices[i]
    }
  }
  s += ' - ' + maxName
  delete fTimes[maxName]
}

console.log(s)
```

执行了上述代码后，我们会得到如下的输出：

```
B - A - D - C - F - E
```

注意之前的拓扑排序结果仅是多种可能性之一。如果我们稍微修改一下算法，就会有不同的结果。例如下面的这个结果也是众多其他可能性中的一个。

```
A - B - C - D - F - E
```

这也是一个可以接受的结果。

# 最短路径算法

假设你要从街道地图上的 A 点出发，通过可能最短的路径到达 B 点。举例来说，从洛杉矶的圣莫妮卡大道到好莱坞大道，如下图所示。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h2hc0iike7j21220l6jv7.jpg)

这种问题在生活中非常常见，我们（特别是生活在大城市的人们）会求助于苹果地图、谷歌地图、Waze 等应用程序。当然，也可能有其他的考虑，例如时间或者路况，但是根本的问题仍然是：从 A 到 B 的最短路径是什么？

我们可以用图来解决这个问题，相应的算法被称为最短路径。下节我们将介绍两种非常著名的算法，即 Dijkstra 算法和 Floyd-Warshall 算法。

## Dijkstra 算法

Dijkstra 算法是一种计算从单个源到所有其他源的最短路径的贪心算法，这意味着我们可以用它来计算从图的一个顶点到其余各顶点的最短路径。

考虑下面这个图。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h2hc47fgy8j20qu0b0gm2.jpg)

我们来看看如何找到顶点 A 和其余顶点之间的最短路径。但首先，我们需要声明表示上图的邻接矩阵，如下图所示：

```jsx
var graph = [
  [0, 2, 4, 0, 0, 0],
  [0, 0, 1, 4, 2, 0],
  [0, 0, 0, 0, 3, 0],
  [0, 0, 0, 0, 0, 2],
  [0, 0, 0, 3, 0, 2],
  [0, 0, 0, 0, 0, 0],
]
```

现在，通过下面代码来看看 Dijkstra 算法是如何工作的。

```jsx
const INF = Number.MAX_SAFE_INTEGER

const dijkstra = (graph, src) => {
  const dist = []
  const visited = []
  const { length } = graph
  for (let i = 0; i < length; i++) {
    dist[i] = INF
    visited[i] = false
  }
  dist[src] = 0
  for (let i = 0; i < length - 1; i++) {
    const u = minDistance(dist, visited)
    visited[u] = true
    for (let v = 0; v < length; v++) {
      if (
        !visited[v] &&
        graph[u][v] !== 0 &&
        dist[u] !== INF &&
        dist[u] + graph[u][v] < dist[v]
      ) {
        dist[v] = dist[u] + graph[u][v]
      }
    }
  }

  return dist
}
```

下面是对算法过程的描述。

- 首先，把所有的距离（`dist`）初始化为无限大（JavaScript 最大的数`INF = Number.MAX_SAFE_INTEGER`），将`visited[]`初始化为`false`。
- 然后，把源顶点到自己的距离设为`0`。
- 接下来，要找出其余顶点的最短路径。
- 为此，我们需要从尚未处理的顶点中选出距离最近的顶点。
- 把选出的顶点标为`visited`，避免重复计算。
- 如果找到更短的路径，则更新最短路径的值。
- 处理完所有顶点后，返回从源顶点（`src`）到图中其他顶点最短路径的结果。

要计算顶点间的`minDistance`，就要搜索`dist`数组中的最小值，返回它在数组中的索引。

```jsx
const minDistance = (dist, visited) => {
  let min = INF
  let minIndex = -1
  for (let v = 0; v < dist.length; v++) {
    if (visited[v] === false && dist[v] <= min) {
      min = dist[v]
      minIndex = v
    }
  }
  return minIndex
}
```

## Floyd-Warshall 算法
