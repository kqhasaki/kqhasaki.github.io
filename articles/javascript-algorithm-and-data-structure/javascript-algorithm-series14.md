---
title: （十四）算法设计与技巧
date: 2022-05-06
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h1z1xjj2fxj20n00cywfi.jpg
---

计算机科学领域流传着一句名言，[“程序=数据结构+算法”](https://en.wikipedia.org/wiki/Algorithms_%2B_Data_Structures_%3D_Programs)（Algorithms + Data_Structures = Programs）。在编程的世界中，算法很有意思。算法（以及编程逻辑）最美的地方在于有不同的方法可以解决同一类问题，而有些算法特别适合解决特定类型的问题。我们可以使用迭代的方式解决问题，也可以使用递归使代码可读性更高。还有另一些技巧可以用来解决算法问题。本章将介绍更多不同的技巧，进一步了解算法的世界，并探讨进一步深入其中的途径。我们将会学习：1）分而治之（divde and conquer）；2）动态规划（dynamic programming）；3）贪心算法（greedy strategy）；4）回溯算法（backtracking）；5）著名的算法问题。

# 分而治之

分而治之是算法设计中的一种方法。它将一个问题分解成多个和原问题相似的小问题（互相独立），递归解决小问题，再将解决方式合并以解决原来的问题。

分而治之算法可以分成三部分。

1. **分解**原问题为多个字问题（原问题的多个小实例）。
2. **解决**子问题，用返回解决子问题的方式的递归算法。递归算法的基本情形可以用来解决子问题。
3. **组合**这些子问题的解决方式，得到原问题的解。

这里我们要学习怎么利用分而治之的方式实现二分搜索。

## 二分搜索

我们可以用迭代的方式实现二分搜索。同样也可以用分而治之的方式实现这个算法，逻辑如下。

- **分解**：计算`mid`并搜索数组较小或较大的一半。
- **解决**：在较小或较大的一半中搜索值。
- **合并**：这步不再需要，因为我们直接返回了索引值。

分而治之版本的二分搜索算法可以实现为如下：

```javascript
function binarySearchRecursive(
  array,
  value,
  low,
  high,
  compareFn = defaultCompare
) {
  if (low < high) {
    const mid = Math.floor((low + high) / 2)
    const element = array[mid]

    if (compareFn(element, value) === Compare.LESS_THAN) {
      return binarySearchRecursive(array, value, mid + 1, high, compareFn)
    } else if (compareFn(element, value) === Compare.BIGGER_THAN) {
      return binarySearchRecursive(array, value, low, mid - 1, compareFn)
    } else {
      return mid
    }
  }
  return DOES_NOT_EXIST
}

export function binarySearch(array, value, compareFn = defaultCompare) {
  const sortedArray = quickSort(array)
  const low = 0
  const high = sortedArray.length - 1

  return binarySearchRecursive(array, value, low, high, compareFn)
}
```

在上面的算法中，我们有两个函数：`binarySearch`和`binarySearchRecursive`。`binarySearch`函数用来暴露给开发者进行二分搜索。`binarySearchRecursive`是分而治之算法。我们将`low`参数以`0`传递，将`high`参数以`sortedArray.length - 1`传递，来在已排序的数组中进行搜索。在计算`mid`元素的索引值后，我们确定待搜索的值比`mid`大还是小。如果小，就再次调用`binarySearchRecursive`函数，但是这次，我们在子数组中进行搜索，改变`low`或`high`参数。如果不大也不小，表示我们找到了这个值并且这就是一种基本情形。还有一种情况是`low`比`high`要大，这表示算法没有找到这个值。

下图展示了算法的过程。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h1z4hjaakzj20xe0doab2.jpg)

# 动态规划

动态规划是一种将复杂问题分解成更小子问题来解决的优化技术。

> 注意，动态规划和分而治之是不同的方法。分而治之方法是把问题分解成相互独立的子问题，然后组合它们的解。而动态规划则是将问题分解成相互依赖的子问题。

用动态规划解决问题时，需要遵循三个重要步骤：

1. 定义子问题；
2. 实现要反复执行来解决子问题的部分；
3. 识别并求解出基线条件。

能用动态规划解决的一些著名问题如下。

- **背包问题**：给出一组项，各自有值和容量，目标是找出总值最大的项的集合。这个问题的限制是，总容量必须小于等于“背包”的容量。
- **最长公共子序列**：找出一组序列的最长公共子序列（可由另一序列删除元素但不会改变余下元素的顺序而得到）。
- **矩阵链相乘**：给出一系列矩阵，目标是找到这些矩阵相乘的最高效办法（计算次数尽可能少）。相乘运算不会进行，解决方案是找到这些矩阵各自相乘的顺序。
- **硬币找零**：给出面额为 d1，...，dn 的一定数量的硬币和要找零的钱数，找出有多少种找零的方法。
- **图的全源最短路径**：对所有顶点对（u,v)，找出从顶点 u 到 v 的最短路径。

## 最少硬币找零问题

**最少硬币找零问题**是**硬币找零问题**的一个变种。硬币找零问题是给定要找零的钱数，以及可用的硬币面额 d1，...，dn 以及其数量，找出有多少种找零方法。最少硬币找零问题是给出要找零的钱数，以及可用的硬币面额 d1，...，dn 以及其数量，找到所需的最少硬币的个数。

例如美国有日下面额的硬币：d1 = 1, d2 = 5, d3 = 10, d4 = 25。

如果要找 36 美分的零钱，我们可以使用 1 个 25 美分、1 个 10 美分和 1 个便士（1 美分），那么如何使用算法找到这个问题的解？

```jsx
function minCoinChange(coins, amount) {
  const cache = []

  const makeChange = value => {
    if (!value) {
      return []
    }

    if (cache[value]) {
      return cache[value]
    }

    let min = []
    let newMin
    let newAmount
    for (let i = 0; i < coins.length; i++) {
      const coin = coins[i]
      newAmount = value - coin
      if (newAmount >= 0) {
        newMin = makeChange(newAmount)
      }

      if (
        newAmount >= 0 &&
        (newMin.length < min.length - 1 || !min.length) &&
        (newMin.length || !newAmount)
      ) {
        min = [coin].concat(newMin)
        console.log(`new Min ${min} for ${amount}`)
      }
    }
    return (cache[value] = min)
  }

  return makeChange(amount)
}
```

我们来看算法的主要逻辑。首先，如果`amount`不为正，就返回空数组。方法执行结束后，会返回一个数组，包含用来找零的各个面额的硬币数量（最少硬币数）。接着，检查`cache`缓存，如果结果已经缓存，则直接返回结果；否则执行算法。

对每个面额都计算`newAmount`的值，它会一直减小，直到能找零的最小钱数。假设`newAmount`是正值，我们会计算它的找零结果。

最后判断`newAmount`是否有效，`minValue`是否是最优解，与此同时`minValue`和`newAmount`是否是合理的值。若以上判断都成立，意味着有一个比之前更优的答案。最后，返回结果。

<iframe src="https://www.youtube.com/embed/jgiZlGzXMBw" title="解决最少硬币问题" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 背包问题
