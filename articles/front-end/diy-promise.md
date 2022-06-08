---
title: 手动实现一个Promise
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h36lrpee4jj20ka0f8js8.jpg
date: 2022-06-13
---

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
