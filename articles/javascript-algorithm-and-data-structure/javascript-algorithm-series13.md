---
title: （十三）排序和搜索算法
date: 2022-06-06
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h2ycyc11b0j20d6097jrc.jpg
---

排序算法（sorting algorithm）对我们的生活极其重要。本章将会使用 JavaScript 实现常用的几种排序算法。假设我们有一个没有任何排列顺序的号码簿。当需要添加联络人和电话时，你只能将其写在下一个空位上。假定你的联系人列表上有很多人。某天，你需要找到某个联系人及其电话号码。但是由于联系人列表没有按照任何顺序来组织，你只能逐个检查，直到找到那个你想要的联系人为止。这个方法太吓人了，想象一下要在一本电话黄页上挨个寻找直到找到一个联系人，需要花多少时间啊！

因此（还有其他原因）我们需要组织信息集，例如那些存储在数据结构里面的信息。排序和搜索算法广泛地运用在待解决的日常问题中。

本章将会学习最常用的排序和搜索算法，例如冒泡排序、选择排序、插入排序、希尔排序、归并排序、快速排序、计数排序、桶排序、基数排序，以及顺序搜索、内插搜索和二分搜索法。

# 排序算法

本节会介绍一些在计算机科学里面最著名的排序算法。我们会从最慢的一个开始，接着是一些性能较好的算法。我们要理解：首先要学会如何排序，然后再搜索我们需要的信息。

## 冒泡排序

人们开始学习排序算法时，通常都先学习冒泡算法，因为它在所有排序算法中最简单。然而，从运行时间的角度来看，冒泡排序是最差的一个，接来下你会知晓原因。

**冒泡排序**比较所有相邻的两个项，如果第一个比第二个大，则交换它们。元素项向上移动至正确的顺序，就好像气泡升至表面一样，冒泡排序因此得名。

下面我们来实现一下冒泡排序。

```javascript
function bubbleSort(array, compareFn = defaultCompare) {
  const { length } = array
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length - 1 - i; j++) {
      if (compareFn(array[j], array[j + 1]) === Compare.BIGGER_THAN) {
        swap(array, j, j + 1)
      }
    }
  }

  return array
}
```

本章创建的**非分布式**排序算法都会接受一个待排序的数组作为参数以及一个比较函数。为了使测试更容易理解，我们会在例子中使用包含数字的数组。不过如果需要对包含复杂对象的数组进行排序，也可以奏效。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h2ydjrk0ouj21hc0fego1.jpg)

注意冒泡排序算法的复杂度是 O(n<sup>2</sup>)，性能很差，不推荐使用。

## 选择排序

## 快速排序

**快速排序**也许是最常用的排序算法了。它的时间复杂度为 O(<i>n</i>log(<i>n</i>))，且性能通常比其他复杂度相同的算法要好。和归并排序一样，快速排序也使用分而治之的方法，将原始数组分为较小的数组（但它没有像归并排序那样将它们分割开）。

快速排序比其他排序算法略为复杂一些。我们一步步来学习：

1. 首先，从数组中选出一值作为**主元**（pivot），也就是数组中间的那个值。
2. 创建两个指针（引用），左边一个指向数组第一个值，右边一个指向数组最后一个值。移动左指针直到我们找到一个比主元大的值，接着移动右指针找到一个比主元小的值，然后交换它们，重复这个过程，直到左指针超过了右指针。这个过程将使得比主元小的值都排在主元之前，而比主元大的值都排在主元之后。这一步叫做**划分**（partition）操作。
3. 接着，算法对划分后的小数组（较主元小的值组成的子数组，以及较主元大的值组成的子数组）重复之前的两个步骤，直至数组已经完全排序。

一个快速的动画示意如下：

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h3a7zxefl1g20l40b3gx7.gif)

再看下详细的慢速演示：

![](https://assets.leetcode-cn.com/solution-static/912/912_fig1.gif)

让我们来实现一下快速排序：

```jsx
function quickSort(nums) {
  return quick(nums, 0, nums.length - 1)
}

function quick(array, left, right) {
  let idx
  if (array.length > 1) {
    idx = partition(array, left, right)
    if (left < idx - 1) {
      quick(array, left, idx - 1)
    }
    if (idx < right) {
      quick(array, idx, right)
    }
  }

  return array
}

function partition(array, left, right) {
  const pivot = array[Math.floor((right + left) / 2)]
  let i = left
  let j = right

  while (i <= j) {
    while (array[i] < pivot) {
      i++
    }
    while (array[j] > pivot) {
      j--
    }
    if (i <= j) {
      swap(array, i, j)
      i++
      j--
    }
  }

  return i
}

function swap(array, i, j) {
  const temp = array[j]
  array[j] = array[i]
  array[i] = temp
}

const arr = [11, 3, 4, 0, 9, 1, 5, 0, 2]

console.log(quickSort(arr))
```
