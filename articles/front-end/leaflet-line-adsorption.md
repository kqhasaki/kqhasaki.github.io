---
title: 地图工具中的线条吸附——一个简单方案
date: 2022-04-19
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h1ec1zxlgyg20ee0ee1fu.gif
---

笔者当前的工作是基于`leaflet`开发一些供公司内部使用的地图工具平台软件。在近期工作中遇到几次需要在地图上实现将某个绘制的线条（`polyline`）吸附到最近的某条线条（`polyline`）上的功能。这里总结一个比较通用的，较为基础的方案，方便后续遇到类似问题能够快速解决。

# 获取附近线条集合

第一步是确定距离地图上距离当前地理坐标最近的线条元素。这里没有太多技巧，要么将这个逻辑做在后端，通过 GIS 数据库来优化这种根据地理信息条件进行筛选的操作。
另一种方法是在前端进行筛选，这里可以框选某个坐标范围或者根据距离排序，选择前`k`个元素。

从性能和通用性考虑，最好将这种逻辑封装在后端。通过建立良好设计的地理信息数据库，能够高性能地根据地理坐标来查询满足指定条件的各种元素，这对基于 GIS 的应用开发很重要。

# 前端计算地理距离

要将一个线条吸附到某一指定线条上，最重要的一步是确定最近的线条元素。我们已经知道，如果能够封装一个高性能的通用接口是比较好的。但是如果非要在前端计算这个距离，也有办法。

首先需要明确的是，目前地图元素的地理坐标都是“经度”`lat`和“纬度”`lng`值，它们一般都是双精度浮点数。一般来说，需要看绘制线条的终点离谁最近来确定吸附到哪条线上去。也就是说求解一个`(lat, lng)`坐标点到某一条`[(lat, lng), (lat, lng)...]`轨迹线的距离。当然，一般情况下，需要吸附的线条是直线段，但有时候也会有折线的情况。在计算到折线距离的时候，我们可以计算点到折线上各个线段距离的加权平均。

由于绝大多数情况下需要吸附的轨迹线是近似直线段的，因此我们简单地计算点到直线的距离即可。于是很简单地可以使用两种方法：1）通过直线方程求解点到直线距离；2）构造三角形来计算高。由于我们的坐标点 A（终点）和轨迹都是经纬度坐标组成，实际上位于一个球面上，只能近似地构造笛卡尔坐标系，因此这里通过直线方程求解会有一些误差；个人比较推荐第二种方法，首先通过[球面上计算点到点距离的方法](https://en.wikipedia.org/wiki/Spherical_law_of_cosines)来计算轨迹的两个端点和坐标点 A 构成的三角形的三条边长，之后使用余弦定理可以求出角度，从而获取高度，即可求得距离。

# 对稀疏轨迹线插值

吸附本质上就是构造一条新的轨迹线，这个新的轨迹线需要尽可能接近绘制的线条，并且形状契合吸附目标。所以首先我们获取吸附目标线条的所有点坐标，然后对其进行插值。之后在插值后的密集坐标点列表中匹配最接近待吸附轨迹起点和终点的位置，然后截取这个区间内的坐标点即可。

# 代码示例

```jsx
// 获取最近要吸附的目标boundary
function utilSelectNearestBoundary({ point, boundarys }) {
  const boundaryList = [...boundarys]
  const getDistanceToBoundary = window.utilGetDistanceToBoundary
  boundaryList.sort(
    (a, b) =>
      getDistanceToBoundary({ point, boundary: a }) -
      getDistanceToBoundary({ point, boundary: b })
  )
  return boundaryList[0]
}

// 对boundary进行插值
function utilGetInsertedBoundary(route) {
  const maxDistance = 0.1
  const routeInserted = [...route]
  let idx = 1
  while (idx < routeInserted.length) {
    const pre = routeInserted[idx - 1]
    const cur = routeInserted[idx]
    const distance = pre.distanceTo(cur)
    if (distance <= maxDistance) {
      idx++
      continue
    }
    routeInserted.splice(idx, 0, window.utilGetMidLatlng(pre, cur))
  }
  return routeInserted
}

// 计算两个latlng中点
function utilGetMidLatlng(point1, point2) {
  const midPosition = L.latLngBounds([point1, point2]).getCenter()
  return midPosition
}

// 计算点到boundary的距离
function utilGetDistanceToBoundary({ point, boundary }) {
  const { latlngs } = boundary
  const boundaryStart = latlngs[0]
  const boundaryEnd = latlngs[latlngs.length - 1]
  const a = point.distanceTo(boundaryStart)
  const c = point.distanceTo(boundaryEnd)
  const b = boundaryStart.distanceTo(boundaryEnd)
  const cosineAlpha = (a ** 2 + b ** 2 - c ** 2) / (2 * a * b)
  const sineAlpha = Math.sqrt(1 - cosineAlpha ** 2)
  const h = a * sineAlpha
  return h
}

// 将dashSeg吸附到最近的boundary
function utilAttachDashSegToNearestBounary({ dashSeg, nearestBoundary }) {
  const boundaryInserted = window.utilGetInsertedBoundary(
    nearestBoundary.latlngs
  )

  const latlngs = dashSeg.getLatLngs()
  const startPoint = latlngs[0]
  const endPoint = latlngs[latlngs.length - 1]

  const startPointer = { idx: 0, distance: Infinity }
  const endPointer = { idx: 0, distance: Infinity }

  for (let i = 0; i < boundaryInserted.length; i++) {
    const currLatlng = boundaryInserted[i]
    const distanceToStart = startPoint.distanceTo(currLatlng)
    if (distanceToStart < startPointer.distance) {
      startPointer.idx = i
      startPointer.distance = distanceToStart
    }
    const distanceToEnd = endPoint.distanceTo(currLatlng)
    if (distanceToEnd < endPointer.distance) {
      endPointer.idx = i
      endPointer.distance = distanceToEnd
    }
  }
  const startIdx = Math.min(startPointer.idx, endPointer.idx)
  const endIdx = Math.max(startPointer.idx, endPointer.idx)
  const transformedLatlngs = boundaryInserted.slice(startIdx, endIdx + 1)
  dashSeg.setLatLngs([
    transformedLatlngs[0],
    transformedLatlngs[transformedLatlngs.length - 1],
  ])
}
```
