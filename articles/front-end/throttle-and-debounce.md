---
title: 防抖和节流
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h30y9xsrqtj20rs0bo3ys.jpg
date: 2022-06-08
---

在浏览器中，JavaScript 事件循环在时刻不停运行着，随时准备处理任务队列里面的事件处理程序。一些例如`input`输入事件、`scroll`滚动事件的事件处理程序有可能因为事件的触发频繁而被高频调用。众所周知，JavaScript 主线程只有一个，当前执行栈如果一直有代码执行，那么就会导致用户交互失去响应。为了减少高频事件处理程序频繁调用，需要采用两种策略：防抖（debounce）和节流（throttle）。它们本质上都是优化高频率执行代码的一种手段。

# 认识防抖和节流

除了之前提到的事件外，例如浏览器的`resize`、`keypress`、`mousemove`等事件在触发时，会不断地调用绑定在事件上的回调函数，极大地浪费资源，降低前端性能。

优化此类事件处理程序的执行频率是必要的，为此引入函数防抖和节流：

- **防抖**：在给定时间`t`之后执行函数，如果函数执行在`t`范围内被重复触发，则重新计时。
- **节流**：在给定时间`t`内只执行一次函数，如果函数执行`t`范围内被重复触发，则只有一次生效。

一个非常经典的比喻，想象每天上下班写字楼的电梯。把电梯每完成一次运送看作是一次事件的响应和回调函数的执行。假设电梯具有两种策略，`debounce`和`throttle`，设定时间为 15 秒，不考虑容量限制：1）一个人进来后，15 秒后电梯准时运送一次，这是节流；2）一个人进来后，电梯等待 15 秒，如果 15 秒内有其他人进来，那么 15 秒倒计时重新计算，这是防抖。

> 推荐：一个[非常形象的演示](https://redd.one/blog/debounce-vs-throttle)

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h30ziflx5jj20ku0dnmxd.jpg)

# 实现函数防抖

## 简单版本实现

因为函数防抖是在事件停止触发一段时间之后延迟调用处理程序，因此可以使用定时器实现。

一个简单版本使用定时器的实现如下：

```javascript
function debounce(func, wait) {
  let timeout = null

  return function () {
    let context = this
    let args = arguments

    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}
```

如果需要防抖函数立即执行，可以加入第三个参数用来判断：

```jsx
function debounce(func, wait, immediate) {
  let timeout = null

  return function () {
    let context = this
    let args = arguments
    clearTimeout(timeout)

    if (immediate) {
      // 第一次会立即执行，以后需要等待事件停止触发一段时间后才会执行
      let callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) {
        func.apply(context, args)
      }
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      })
    }
  }
}
```

## `lodash`源码实现

```jsx
import isObject from './isObject.js'
import root from './.internal/root.js'

function debounce(func, wait, options) {
  let lastArgs, lastThis, maxWait, result, timerId, lastCallTime

  let lastInvokeTime = 0
  let leading = false
  let maxing = false
  let trailing = true

  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  const useRAF =
    !wait && wait !== 0 && typeof root.requestAnimationFrame === 'function'

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  wait = +wait || 0
  if (isObject(options)) {
    leading = !!options.leading
    maxing = 'maxWait' in options
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }

  function invokeFunc(time) {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function startTimer(pendingFunc, wait) {
    if (useRAF) {
      root.cancelAnimationFrame(timerId)
      return root.requestAnimationFrame(pendingFunc)
    }
    return setTimeout(pendingFunc, wait)
  }

  function cancelTimer(id) {
    if (useRAF) {
      return root.cancelAnimationFrame(id)
    }
    clearTimeout(id)
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait)
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    )
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time))
  }

  function trailingEdge(time) {
    timerId = undefined

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now())
  }

  function pending() {
    return timerId !== undefined
  }

  function debounced(...args) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait)
    }
    return result
  }
  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = pending
  return debounced
}

export default debounce
```

# 实现函数节流

## 简单版本实现

节流可以使用时间戳或者定时器来实现。

使用时间戳实现的简单版本如下：

```jsx
function throttle(func, delay) {
  let oldTime = Date.now()
  return function () {
    const context = this
    const args = arguments
    let newTime = Date.now()
    if (newTime - oldTime >= delay) {
      func.apply(context, args)
      oldTime = Date.now()
    }
  }
}
```

使用定时器写法的简单版本如下：

```jsx
function throttle(func, delay) {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(context, args)
        timer = null
      }, delay)
    }
  }
}
```

可以将时间戳和定时器相结合，实现一个较为精确的节流：

```jsx
function throttle(func, delay) {
  let timer = null
  let oldTime = Date.now()
  return function () {
    let newTime = Date.now()

    // 计算从上一次倒现在，还剩多少时间
    let remaining = delay - (newTime - oldTime)
    const context = this
    const args = arguments
    clearTimeout(timer)
    if (remaining <= 0) {
      func.apply(context, args)
      oldTime = Date.now()
    } else {
      timer = setTimeout(() => {
        func.apply(context, args)
      }, remaining)
    }
  }
}
```

## `lodash`源码实现

```jsx
import debounce from './debounce.js'
import isObject from './isObject.js'

function throttle(func, wait, options) {
  let leading = true
  let trailing = true

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }
  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  })
}

export default throttle
```
