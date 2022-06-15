---
title: 使用JavaScript实现深拷贝
date: 2022-06-15
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h3925zwqtoj21hc0u0tbw.jpg
---

对一个对象进行**深拷贝**（deep copy）是指这个新的拷贝的所有属性和嵌套对象的属性都不能拥有和之前对象相同的引用值。使用深拷贝的好处是，无论对新对象进行何种修改，原对象都不会收到影响。这和**浅拷贝**（shallow copy）是不一样的，操作后者有可能会在原对象上造成副作用，因为嵌套对象的属性指针是和原来一样的。

在 JavaScript 中，标准内置方法例如`Array.prototype.concat()`、`Array.prototype.slice()`、`Array.from()`、`Object.assign()`和`Object.create()`等，都不会创建深拷贝，而是创建浅拷贝。

# 使用序列化方法

如果一个对象可以被序列化，那么可以使用`JSON.stringify()`将其转化为一个 JSON 字符串，然后再使用`JSON.parse()`将其重新解析，得到一个新的对象。这个过程可以保证对象是深拷贝的。

虽然这种方法很方便，但是许多的 JavaScript 对象并没有这么简单，它们是不能被序列化的。例如一个对象中具有以下元素：函数、`Symbol`、DOM 对象、循环引用等等。此时调用`JSON.stringify()`来进行序列化会失败，所以无法通过这种方法实现深拷贝。

# 使用`structedClone()`

全局的克隆方法`structuredClone`使用**结构化克隆算法**将给定的值进行深拷贝。

结构化克隆算法是由 HTML5 规范定义的用于复制复杂 JavaScript 对象的算法。通过来自`Workers`的`postMessage()`或使用`IndexedDB`存储对象时在内部使用。它通过递归输入对象来构建克隆，同时保持先前访问过的引用的映射，以避免无限遍历循环。

结构化克隆支持的类型很多，包括：1）所有的原始类型，`Symbol`除外；2）`Boolean`对象；3）`String`对象；4）`Date`；5）`RegExp`，`lastIndex`字段不保留；6）`Blob`；7）`File`；8）`FileList`；9）`ArrayBuffer`；10）`ArrayBufferView`，这基本上意味着所有的定型数组，例如`Int32Array`等；11）`ImageData`；12）`Array`；13）`Object`，仅包括普通对象（例如对象字面量）；14）`Map`；15）`Set`。

结构化克隆有一些不足：

- `Error`和`Function`对象是不能被复制的，如果尝试这样做，会导致抛出`DATA_CLONE_ERR`异常。
- 企图克隆 DOM 节点同样会抛出`DATA_CLONE_ERR`异常。
- 对象的某些特定参数也不会被保留：例如`RegExp`对象上的`lastIndex`字段不会被保留；属性描述符、setters 和 getters 以及其他类似元数据的功能也同样不会被复制。例如，如果一个对象用属性描述符标记为`read-only`，它将会被复制为`read-write`，因为是默认情况。
- 原型链上的属性也不会被追踪以及复制。

# 自定义深拷贝

由于`structedClone()`浏览器支持不完全，故而许多场景下我们需要自己去实现深拷贝方法。

评价一个深拷贝是否完善，可以检查以下条件是否满足：

1. **基本数据类型**能否拷贝？
2. 键和值都是基本类型的**普通对象**能否拷贝？
3. `Symbol`作为对象的键是否能拷贝？
4. `Date`和`RegExp`对象类型是否能拷贝？
5. `Map`和`Set`对象类型是否能拷贝？
6. `Function`对象类型是否能拷贝？（虽然函数一般不用深拷贝）
7. 对象的**原型**是否能拷贝？
8. **不可枚举属性**是否能拷贝？
9. 能否处理**循环引用**？

## 简易版本深拷贝

最简单版本的深拷贝可以处理基本类型和普通对象。

```jsx
function deepClone(target) {
  if (typeof target === 'object' && target) {
    const cloneObj = {}
    for (const key in target) {
      const val = target[key]
      if (typeof val === 'object' && val) {
        cloneObj[key] = deepClone(val)
      } else {
        cloneObj[key] = val
      }
    }

    return cloneObj
  } else {
    return target
  }
}
```

这个基础版本存在许多问题：1）不能处理循环引用；2）只考虑了`Object`普通对象，而对于`Array`、`Date`、`Map`、`Set`、`RegExp`对象，都被处理成了`Object`对象，并且值也不对；3）丢失了键为`Symbol`类型的属性；4）丢失了不可枚举的属性；5）原型上的属性也被添加到了拷贝的对象中了。

> 如果存在循环引用，以上代码会导致无限递归，从而栈溢出：
>
> ```jsx
> const a = {}
> const b = {}
> a.b = b
> b.a = a
> deepClone(a)
> ```
>
> ![](https://tva1.sinaimg.cn/large/e6c9d24egy1h3a5s7x3f4j20p60k0dh2.jpg)
>
> 那么应该如何避免循环引用导致的栈溢出呢？一种简单的方式就是将已经添加的对象引用记录下来，下次碰到相同的对象引用时，直接指向记录中的对象即可。

## 完善版深拷贝

针对简易版深拷贝存在的问题，我们可以一一改进。

对于不能存在循环引用的解决方案是使用一个`WeakMap`作为一个字典来查询，如果遇到某个相同的对象需要再次拷贝，直接返回之前拷贝结果即可；对于特殊类型`Date`、`RegExp`、`Function`、`Map`、`Set`，可以直接构造一个新实例返回；针对不可枚举属性以及`Symbol`属性，使用`Reflect.ownKeys()`；对于原型上的属性，可以通过`Object.getOwnPropertyDescriptors()`设置属性描述符对象，以及使用`Object.create()`方式继承原型链。

> 注：`Reflect.ownKeys(obj)`相当于`[...Object.getOwnPropertynames(obj), ...Object.getOwnPropertySymbols(obj)]`。

代码实现如下：

```jsx
function deepClone(target) {
  const record = new WeakMap()

  const isObject = item => {
    return (typeof item === 'object' && item) || typeof item === 'function'
  }

  const clone = item => {
    if (!isObject(item)) {
      return item
    }

    // 日期或者正则，构造新对象返回
    if ([Date, RegExp].includes(item.constructor)) {
      return new item.constructor(item)
    }

    // 克隆函数对象
    if (typeof item === 'function') {
      return new Function('return ' + item.toString())()
    }

    // 如果这个对象已经被克隆过，返回存储的克隆副本
    if (record.has(item)) {
      return record.get(item)
    }

    // 克隆Map对象
    if (item instanceof Map) {
      const result = new Map()
      record.set(item, result)
      item.forEach((val, key) => {
        if (isObject(val)) {
          result.set(key, clone(val))
        } else {
          result.set(key, val)
        }
      })

      return result
    }

    // 处理Set对象
    if (item instanceof Set) {
      const result = new Set()
      record.set(item, result)
      item.forEach(val => {
        if (isObject(val)) {
          result.add(clone(val))
        } else {
          result.add(val)
        }
      })

      return result
    }

    // 处理普通Object对象，考虑了Symbol和不可枚举属性
    const keys = Reflect.ownKeys(item)

    // 获取对象的所有属性及其描述符
    const allDesc = Object.getOwnPropertyDescriptors(item)

    // 结合Object.create创建新对象并继承原对象的原型链，得到的result是对item的一个浅拷贝
    const result = Object.create(Object.getPrototypeOf(item), allDesc)

    record.set(item, result)

    // Object.create()是浅拷贝，所以要判断并递归执行深拷贝
    keys.forEach(key => {
      const val = item[key]
      if (isObject(val)) {
        result[key] = clone(val)
      } else {
        result[key] = val
      }
    })

    return result
  }

  return clone(target)
}

const test = {
  a: 'tes',
  sayHello: () => {
    console.log('hello')
  },
  b: new Set([1, 2, 2, 3]),
  c: {
    name: 'json',
    title: {
      prod: {
        dev: 'sit',
      },
    },
  },
}

console.log(deepClone(test))
```
