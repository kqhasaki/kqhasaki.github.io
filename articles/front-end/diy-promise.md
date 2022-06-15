---
title: 手动实现一个Promise
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h36lrpee4jj20ka0f8js8.jpg
date: 2022-06-13
---

Promise 作为 JavaScript 语言的一个重要特性深受广大开发者喜爱。它在 ECMAScript 2015 版本中加入，提供了对异步过程的优雅封装。再加上 ES7 版本加入的异步函数语法，Promise 已经成为极为重要的 JavaScript 编程工具。

标准 Promise 实现需要遵循 Promise A+规范，那么我们能不能尝试自己去手动实现一个呢？

# 基础版本

可以先来回顾一下 Promise 最基本的使用方式：

```jsx
const p1 = new Promise((resolve, reject) => {
  console.log('create a promise')
  resolve('success')
})

const p2 = p1.then(data => {
  console.log(data)
  throw new Error('rejected')
})

const p3 = p2.then(
  data => {
    console.log('success', data)
  },
  err => {
    console.log('failed', err)
  }
)
```

首先，我们在调用`Promise`构造函数后，会返回一个`Promise`对象；构造函数需要传入一个函数参数，称为**执行函数**，Promise 的主要工作代码都在执行函数中；如果执行函数中的工作成功了，那么就会调用`resolve()`函数，如果失败了，会调用`reject`函数；Promise 的状态是不可由外部代码改变的，并且一旦落定就不可逆。

结合[Promise/A+规范](https://promisesaplus.com/)，我们可以分析出 Promise 的基本特征：

1. Promise 实例有三个状态：`pending`、`fulfilled`和`rejected`；
2. 调用`Promise`构造函数来创建一个 Promise，并且需要传入一个执行函数，它会立刻运行；
3. 执行函数接受两个参数，分别是`resolve`和`reject`；
4. Promise 的默认状态是`pending`；
5. Promise 有一个`value`用来保存成功状态的值，可以是`undefined`、`thenable`或者 Promise；
6. Promise 有一个`reason`用来保存失败状态的值；
7. Promise 只能从`pending`到`rejected`，或者从`pending`到`fulfilled`，状态一旦确认，就不会再改变了；
8. Promise 必须有一个`then`方法，它接受两个参数，分别是 Promise 成功的回调`onFulfilled`，还有 Promise 失败的回调`onRejected`；
9. 如果调用`then`时，Promise 已经成功，那么执行`onFulfilled`，参数是 Promise 的`value`；
10. 如果调用`then`时，Promise 已经失败，那么执行`onRejected`，参数是 Promise 的`reason`；
11. 如果`then`中抛出了异常，那么就会把这个异常作为参数，传递给下一个`then`的失败的回调`onRejected`。

按照以上特征，我们可以尝试实现一个粗略的 Promise：

```jsx
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor(executor) {
    // 默认状态 pending
    this.status = PENDING

    // 存放成功状态的值
    this.value = undefined

    // 存放失败状态的值
    this.reason = undefined

    // 成功后调用的方法
    const resolve = value => {
      // 状态为PENDING时才可以更新状态，防止executor中调用了两次resolve/reject方法
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
      }
    }

    // 失败后调用的方法
    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
      }
    }

    try {
      // 立即执行，将resolve和reject函数传递给执行函数
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    }

    if (this.status === REJECTED) {
      onRejected(this.reason)
    }
  }
}

function test() {
  const promise = new MyPromise((resolve, _) => {
    resolve('成功')
  }).then(
    data => {
      console.log('success', data)
    },
    error => {
      console.log('failed', error)
    }
  )
}

// success 成功
test()
```

现在我们已经实现了一个最简易的基础版本的 Promise，它有很多不足，最大的一个问题就是不能处理异步操作。如果我们在执行函数中进行异步操作，那么通过 `Promise.prototype.then` 添加的处理函数没有作用。

```jsx
function test() {
  const promise = new MyPromise((resolve, _) => {
    setTimeout(() => {
      resolve('成功')
    }, 1000)
  }).then(
    data => {
      console.log('success', data)
    },
    error => {
      console.log('failed', error)
    }
  )
}

test()
// 没有作用
```

因为 Promise 实例调用`then()`方法时，当前的 Promise 并没有成功，一直处于`pending`状态。所以在调用`then()`方法设置成功和失败的回调时，我们需要将其先保存起来，再在 Promise 落定时调用设置好的回调。

结合这个思路我们优化一下代码：

```jsx
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  constructor(executor) {
    // 默认状态 pending
    this.status = PENDING

    // 存放成功状态的值
    this.value = undefined

    // 存放失败状态的值
    this.reason = undefined

    // 存放成功的回调
    this.onResolvedCallbacks = []

    // 存放失败的回调
    this.onRejectedCallbacks = []

    // 成功后调用的方法
    const resolve = value => {
      // 状态为PENDING时才可以更新状态，防止executor中调用了两次resolve/reject方法
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }

    // 失败后调用的方法
    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }

    try {
      // 立即执行，将resolve和reject函数传递给执行函数
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    }

    if (this.status === REJECTED) {
      onRejected(this.reason)
    }

    if (this.status === PENDING) {
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value)
      })

      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}
```

现在，异步问题已经解决了！

# `then`的链式调用和值穿透

我们都知道 Promise 有一个很方便的特性是可以链式调用。在我们使用 Promise 的时候，当`then`函数中`return`了一个值，不管是什么值，我们都能在下一个`then`中获取到，这就是 **`then`的链式调用**。而且，当我们不在`then`中传入参数，例如：`promise.then().then()`时，那么后面的`then`依旧能够得到前面的`then()`的返回值，这就是所谓**值的穿透**。那么具体应该怎么实现呢？简单思考一下，如果每次调用`then()`的时候，我们都创建一个新的 Promise 对象，并且将上一个`then`的返回结果传给这个新的 Promise 的`then`方法，不就可以一直`then`下去了么？

有了上面的想法，再结合 Promise/A+规范梳理一下要点：

1. `then`的参数`onFulfilled`和`onRejected`可以缺省，如果`onFulfilled`或者`onRejected`不是函数，将其忽略，且依旧可以在下面的`then`中获取到之前返回的值；
2. Promise 可以`then`多次，每次执行完`then()`方法之后返回的都是一个新的 Promise；
3. 如果`then`的返回值`x`是一个普通的值，那么就会把这个结果作为参数，传递给下一个`then`的成功的回调；
4. 如果`then`中抛出了异常，那么就会把这个异常作为参数，传递给下一个`then`的失败的回调；
5. 如果`then`的返回值`x`是一个 Promise，那么就等待这个 Promise 执行完。Promise 如果成功，就走下一个`then`的成功回调；如果失败或者抛出异常就走下一个`then`的失败回调；
6. 如果`then`的返回值`x`和 Promise 是同一个引用对象，造成循环引用则抛出异常，将异常传递给下一个`then`的失败回调；
7. 如果`then`的返回值`x`是一个 Promise，且`x`同时调用`resolve`和`reject`函数，则第一次调用优先，其他所有调用被忽略。

按照这些要求，我们将代码补充完整：

```jsx
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

const resolvePromise = (promise, x, resolve, reject) => {
  if (promise === x) {
    return reject(
      new TypeError('Chaining cycle detected for promise #<Promise>')
    )
  }

  let called

  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(
          x,
          y => {
            if (called) return
            called = true
            resolvePromise(promise, y, resolve, reject)
          },
          r => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        resolve(x)
      }
    } catch (err) {
      if (called) {
        return
      }
      called = true
      reject(err)
    }
  } else {
    resolve(x)
  }
}

class MyPromise {
  constructor(executor) {
    // 默认状态 pending
    this.status = PENDING

    // 存放成功状态的值
    this.value = undefined

    // 存放失败状态的值
    this.reason = undefined

    // 存放成功的回调
    this.onResolvedCallbacks = []

    // 存放失败的回调
    this.onRejectedCallbacks = []

    // 成功后调用的方法
    const resolve = value => {
      // 状态为PENDING时才可以更新状态，防止executor中调用了两次resolve/reject方法
      if (value instanceof Promise) {
        return value.then(resolve, reject)
      }

      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }

    // 失败后调用的方法
    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }

    try {
      // 立即执行，将resolve和reject函数传递给执行函数
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : v => v

    const _promise = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(_promise, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(_promise, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }

      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(_promise, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(_promise, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })

    return _promise
  }
}

function test() {
  const promise = new Promise((resolve, reject) => {
    reject('失败')
  })
    .then()
    .then()
    .then(
      data => {
        console.log(data)
      },
      err => {
        console.log('err', err)
      }
    )
}

test()

// 失败 err
```

至此我们已经完成了 Promise 最关键的部分：`then`的链式调用和值穿透。

# 实现 Promise 的其他 API

我们已经按照符合 Promise/A+规范的方式实现了一个`Promise`类，但原生的 Promise 还提供了一些其他方法，例如：

- `Promise.resolve()`
- `Promise.reject()`
- `Promise.prototype.catch()`
- `Promise.prototype.finally()`
- `Promise.all()`
- `Promise.race()`

下面我们逐一实现这些方法。

## `Promise.resolve()`

它默认产生一个成功的`Promise`，如果传入的参数不是一个值而是一个 Promise，那么会等待这个 Promise 落定。

```jsx
static resolve(data) {
  return new Promise((resolve, reject) => {
    resolve(data)
  })
}
```

## `Promise.reject()`

它默认产生一个失败的 Promise，`Promise.reject`是直接将值变为错误结果。

```jsx
static reject(reason) {
  return new Promise((resolve, reject) => {
    reject(reason)
  })
}
```

## `Promise.prototype.catch()`

`Promise.prototype.catch`用来捕获 Promise 的异常，实际上是`then`的一种简写。

```jsx
Promise.prototype.catch = function (errCallback) {
  return this.then(null, errCallback)
}
```

## `Promise.prototype.finally`

finally 并不表示最终的意思，而表示无论如何都会执行的意思。

```jsx
Promise.prototype.finally = function (callback) {
  return this.then(
    value => {
      return Promise.resolve(callback()).then(() => value)
    },
    reason => {
      return Promise.resolve(callback()).then(() => {
        throw reason
      })
    }
  )
}
```

## `Promise.all`

`Promise.all`用来解决并发多个 Promise 的问题，获取最终的结果（如果有一个失败则失败）。

```jsx
static all(promises) {
  return new Promise((resolve, reject) => {
    const resultArr = []
    let orderIdx = 0
    const processResultByKey = (value, index) => {
      resultArr[index] = value
      if (++orderIndex === promises.length) {
        resolve(resultArr)
      }
    }

    for (let i = 0; i < values.length; i++) {
      const promise = promises[i]
      if (promise && typeof promise.then === 'function') {
        promise.then(value => {
          processResultByKey(value, i)
        }, reject)
      } else {
        procesResultByKey(value, i)
      }
    }
  })
}
```

## `Promise.race`

`Promise.race`用来处理多个异步过程，采用最快的结果。

```jsx
static race(promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      const val = promises[i]
      if (val && typeof val.then === 'function') {
        val.then(resolve, reject)
      } else {
        resolve(val)
      }
    }
  })
}
```

# 完整代码

```jsx
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

const resolvePromise = (promise, x, resolve, reject) => {
  if (promise === x) {
    return reject(
      new TypeError('Chaining cycle detected for promise#<MyPromise>')
    )
  }

  let called

  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      const then = x.then
      if (typeof then === 'function') {
        then.call(
          x,
          y => {
            if (called) return
            called = true
            resolvePromise(promise, y, resolve, reject)
          },
          r => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        resolve(x)
      }
    } catch (err) {
      if (called) return
      called = true
      reject(err)
    }
  }
}

class MyPromise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined

    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = value => {
      if (value instanceof Promise) {
        return value.then(resolve, reject)
      }
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }

    const reject = reason => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : err => {
            throw err
          }

    const _promise = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(_promise, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }, 0)
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(_promise, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }, 0)
      }

      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(_promise, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 0)
        })

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(_promise, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 0)
        })
      }
    })

    return _promise
  }

  catch(errCallback) {
    return this.then(null, errCallback)
  }

  finally(callback) {
    return this.then(
      value => {
        return MyPromise.resolve(callback().then(() => value))
      },
      reason => {
        return MyPromise.resolve(
          callback().then(() => {
            throw reason
          })
        )
      }
    )
  }

  static all(values) {
    if (!Array.isArray(values)) {
      const type = typeof values
      return new TypeError(`TypeError: ${type} ${values} is not iterable`)
    }

    return new MyPromise((resolve, reject) => {
      const resultArr = []
      let orderIdx = 0
      const processResultByKey = (value, index) => {
        resultArr[index] = value
        if (++orderIdx === values.length) {
          resolve(resultArr)
        }
      }

      for (let i = 0; i < values.length; i++) {
        const value = values[i]
        if (value && typeof value.then === 'function') {
          value.then(value => {
            processResultByKey(value, i)
          }, reject)
        } else {
          processResultByKey(value, i)
        }
      }
    })
  }

  static race(values) {
    if (!Array.isArray(values)) {
      const type = typeof values
      return new TypeError(`TypeError: ${type} ${values} is not iterable`)
    }

    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < values.length; i++) {
        const val = values[i]
        if (val && typeof val.then === 'function') {
          val.then(resolve, reject)
        } else {
          resolve(val)
        }
      }
    })
  }

  static resolve(data) {
    return new MyPromise(resolve => {
      resolve(data)
    })
  }

  static reject(reason) {
    return new Promise((_, reject) => {
      reject(reason)
    })
  }
}

const promise = new MyPromise((resolve, reject) => {
  reject('失败')
})
  .then()
  .then()
  .then(
    data => {
      console.log(data)
    },
    err => {
      console.error('error', err)
    }
  )
```
