---
title: （十一）期约与异步函数
date: 2022-02-09
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h0xw8fi1wfj20sg0lcdh0.jpg
---

ES6 及之后发布的版本逐步加大了对异步编程机制的支持，提供了令人眼前一亮的特性。ES6 新增了正式的`Promise`（期约）引用类型，支持优雅定义和组织异步逻辑。接下来几个版本增加了使用`async`和`await`关键字定义异步函数的机制。

<iframe width="560" height="315" src="https://www.youtube.com/embed/SrNQS8J67zc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# 异步编程

同步行为和异步行为的对立统一是计算机科学的一个基本概念。JavaScript 运行时才用了单线程事件循环模型，因此同步操作和异步操作更是代码所要依赖的核心机制。异步行为是为了优化因计算量大而时间长的操作。如果在等待其他操作完成的同时，即使运行其他指令，系统也能保持稳定，那么这样做就是务实的。

重要的是，异步操作并不一定计算量大或者要等待很久。只要不想为了等待某个异步操作而阻塞线程执行，那么任何时候都可以用。

## 同步与异步

**同步行为**对应内存中顺序执行的处理器指令。每条指令都会严格按照它们出栈的顺序来执行，每条指令执行后也能立即获得存储在系统本地的信息（如寄存器或内存中的数据）。这样的执行流程容易分析程序在执行到代码任意位置时的状态（例如变量的值）。

在同步执行的过程中，程序执行的每一步的状态都是可以推断的。因为后面的指令总是在前面的指令完成后才会执行。

```javascript
let x = 3
x += 4
```

这两行 JavaScript 代码对应的机器指令可以想象。首先，操作系统会在栈内存上分配一个存储浮点数的空间，然后针对这个值做一次浮点运算，然后将结果写回之前分配的内存中。所有这些指令都是在单个线程中按序执行的，在低级指令的层面，有充足的工具可以确定系统状态。

相对地，**异步行为**类似系统中断，即当前进程外部的实体可以触发代码执行。异步操作经常是必要的，因为强制进程等待一个长时间的操作是对计算资源的极大浪费（同步操作则必须等待）。如果代码需要访问一些高延迟的资源，例如向远程服务器发送请求并等待响应，那么就会出现长时间等待。

```javascript
let x = 3
setTimeout(() => (x += 4), 1000)
```

在以上类似在定时回调中进行数学计算的简单异步操作中，执行线程不知道变量`x`的值何时改变，因为这取决于回调何时从消息队列中出列并执行。

异步代码不容易推断。虽然这个例子很简单，但是第二个指令块是由系统计时器触发的，这会生成一个入队执行的中断。到底什么时候触发这个中断，对 JavaScript 运行时来说是无法知道的（尽管可以保证发生在当前线程的同步代码执行之后，否则回调没有机会出列执行）。无论如何，在排定回调以后基本没有办法知道系统状态何时变化。

为了让后续代码能够使用`x`，异步执行的函数需要在更新`x`的值以后通知其他代码。如果程序不需要这个值，那么就只管继续执行，不必等待这个结果了。设计一个能够知道`x`什么时候可以读取的系统是非常难的，`JavaScript`在实现这样一个系统的过程中也经历了几次迭代。

## 早期异步编程模式

虽然异步行为是 JavaScript 的基础，但是早期的实现并不理想。早期 JavaScript 只支持定义回调函数来表明异步操作完成。串联多个异步操作是一个常见的问题，通常需要深度嵌套的回调函数（俗称“回调地狱”）来解决。

假设一个异步操作回返回一个有用的值，有什么好办法来将这个值传给需要它的地方？广泛接受的一个策略是给异步操作提供一个回调，这个回调中包含要使用异步返回值的代码。

```javascript
function double(value, callback) {
  setTimeout(() => {
    callback(value * 2)
  }, 1000)
}

double(3, x => console.log(`recieve ${x}`))
```

这里的`setTimeout`调用告诉 JavaScript 运行时在`1000`毫秒之后将一个函数推到消息队列上。这个函数会由运行时负责异步调度执行。而位于函数闭包中的回调及其参数在异步执行时仍然是可用的。

异步操作并不总是成功的，因此自然需要在模型中使用失败回调。

```javascript
function double(value, success, failure) {
  setTimeout(() => {
    try {
      if (typeof value !== 'number') {
        throw 'Must Provide number'
      }
      success(2 * value)
    } catch (e) {
      failure(e)
    }
  }, 1000)
}

const successCallback = x => console.log(x)
const failureCallback = e => console.error(e)

double(3, successCallback, failureCallback)
double('a', successCallback, failureCallback)
```

如果异步返回值又依赖另一个异步返回值，那么回调的情况还会进一步复杂。在实际代码中，这就要求嵌套回调。随着代码变得更加复杂，回调策略是不具有扩展性的，“回调地狱”这个称呼意味着嵌套回调的代码维护起来就是噩梦。

# 期约

**期约`Promise`是对尚不存在结果的一个替身**。早在 1976 年的论文中就有学者提出`Promise`的概念。直到 1988 年，这个概念才真正确立了下来。这个概念描述了一种异步程序执行的机制。

## Promises/A+规范

早期的期约机制在 jQuery 和 Dojo 中都出现过（Deferred API）。到了 2010 年，CommonJS 项目实现的 Promise/A 规范日益流行起来。很多第三方的 JavaScript 期约库得到了社区认可，但是实现多少有些不同。为了弥合现有实现之间的差异，2012 年 Promises/A+组织 fork 了 CommonJS 的 Promise/A 建议，制定了 Promises/A+规范。这个规范最终成为了 ES6 规范实现的范本。

ES6 增加了对 Promises/A+规范的完善支持，即`Promise`类型。一经推出后，`Promise`就大受欢迎成为了主导的异步编程机制。所有的现代浏览器都支持 ES6 期约，很多其他浏览器 API 例如`fetch`和 Battery Status API 也以期约为基础。

## 期约基础

ES6 新增的引用类型期约`Promise`可以通过`new`操作符实例化。创建新期约时需要传入执行器函数作为参数。

```javascript
const p = new Promise((resolve, reject) => {
  try {
    setTimeout(() => resolve('OK'), 1000)
  } catch (e) {
    reject(e)
  }
})
console.log(p) // Promise { <pending> }

setTimeout(() => {
  console.log(p) // Promise { 'OK' }
}, 1001)
```

期约采用了有限状态机模型。一个期约实例传给`console.log`时，控制台会输出期约的状态。一个期约对象可以处于三种状态之一：

- 待定（pending）
- 兑现（fulfilled，有时候称为“解决”，resolved)
- 拒绝（rejected）

**待定**（pending）是期约最初始的状态。在待定状态下，期约可以进一步**落定**（settled）为代表成功的**兑现**状态或者代表失败的**拒绝**状态。无论期约落定为哪种状态都是不可逆的。只要从待定转换为兑现或者拒绝，期约的状态就不再改变。而且，也不能保证期约必然会脱离待定状态。因此，组织合理的代码无论期约最终解决还是拒绝，甚至一直待定，都应该具有恰当的行为。

重要的是，期约的状态是私有的，不能通过 JavaScript 以任何方式来检测到。这主要是为了避免根据读取到期约的状态来以同步的方式处理期约对象。这个状态也无法被 JavaScript 以任何方式从对象外部修改。**期约故意将异步行为封装起来，从而隔离外部的同步代码**。

期约主要有两大用途。首先是抽象表示一个异步操作。期约的状态代表期约是否完成。“待定”表示尚未开始或者正在执行中。“兑现”表示异步任务已经成功完成，而“拒绝”则表示没有成功完成。

某些情况下，这个状态机就是期约可以提供的最有用的信息。知道一段异步代码已经完成，对于其他代码而言已经足够了。例如假设期约要向服务器发送一个 HTTP 请求。请求返回 200 ～ 299 内的状态码就足以让期约的状态变为“兑现”。类似如果不在这个范围，期约状态切换为“拒绝”。

在另一些情况下，期约封装的异步操作会实际生成某个值，而程序期待状态改变时可以访问这个值。相应地，如果期约被拒绝，程序就会期待期约状态改变时可以拿到拒绝理由。例如假设期约向服务器发送一个 HTTP 请求并且预定会返回一个 JSON。如果请求返回范围在 200 ～ 299 的状态码，则足以让期约状态变为兑现。此时期约内部就可以收到一个 JSON 字符串。类似如果请求返回的状态码不在 200 ～ 299 这个范围内，那么就会把期约状态切换为拒绝。此时拒绝的理由可能是一个`Error`对象，包含着 HTTP 状态码及相关错误消息。

为了支持这两种用例，每个期约只要状态切换为兑现，就会有一个私有的内部**值**（value）。类似地，每个期约只要切换状态为拒绝，就会有一个私有的内部**理由**（reason）。无论是值还是理由，都是包含原始值或对象的不可修改的引用。二者都是可选的，并且默认值为`undefined`。在期约到达到某个落定状态时执行的异步代码始终会收到这个值或理由。

由于期约的状态是私有的，所以只能在内部进行操作。内部操作在期约的执行器函数中完成。执行器函数主要有两项职责：初始化期约的异步行为和控制状态的最终转换。其中，控制期约状态的转换是通过调用它的两个函数参数实现的。这两个函数参数通常都命名为`resolve()`和`reject()`。调用`resolve()`会把状态切换为兑现，调用`reject()`会把状态切换为拒绝。另外，调用`reject()`也会抛出错误。

期约并非一开始就必须处于待定状态，然后通过执行器函数才能转换为落定状态。通过调用`Promise.resolve()`静态方法可以实例化一个解决的期约。

```javascript
// 下面两个期约实例实际上是一样的
const p1 = new Promise((resolve, reject) => resolve())
const p2 = Promise.resolve()
```

Promise 的设计很大程度上会导致一种全新的计算模式。下面的例子完美展示了这点：

```javascript
try {
  throw new Error('foo')
} catch (e) {
  console.log(e.message) // 正确捕获异常
}

try {
  Promise.reject('some error')
} catch (e) {
  console.log(e.message) // 并不能在这里捕获到异常，原因是只能捕获到同步代码中抛出的异常
}

Promise.reject('some error').catch(e => console.log(e)) // 正确捕获异常
```

可以看出期约真正的异步特性：它们是同步对象（在同步执行模式中使用），但也是**异步**执行模式的媒介。这个例子中，拒绝期约的错误没有抛到执行同步代码的线程里，而是通过浏览器异步消息队列来处理的。因此`try/catch`块并不能捕获错误。代码一旦开始以异步模式执行，则唯一与之交互的方式就是使用异步结构，即期约的方法。

## 期约的实例方法

期约实例的方法是连接外部同步代码和内部异步代码之前的桥梁。这些方法可以访问异步操作返回的数据，处理期约成功和失败的结果，连续对期约求值，或者添加只有期约进入终止状态时才会执行的代码。

### 实现`Thenable`接口

在 ECMAScript 暴露的异步结构中，任何对象都有一个`then()`方法。这个方法被认为实现了`Thenable`接口。下面的例子展示了最简单的实现了这一接口的类：

```jsx
class MyThenable {
  then() {}
}
```

ECMAScript 的`Promise`类型实现了`Thenable`接口。这个简化的接口跟 TypeScript 或其他包中的接口或类定义不同，它们都设定了`Thenable`接口更具体的形式。

### `Promise.prototype.then()`

`Promise.prototype.then()`是为期约实例添加处理程序的主要方法。这个`then()`方法接收最多两个参数：`onResolved`处理程序和`onRejected`处理程序。这两个参数都是可选的，如果提供的话，则会在期约分别进入“兑换”和“拒绝”状态时执行。

> 当 promise 变成兑现状态时会调用`onResolved`，该函接收一个参数，即兑现的结果。如果该参数不是函数，则会在内部被替换为`(x) => x`，即原样返回 promise 最终结果的函数；当 promise 变为拒绝状态时，会调用`onRejected`，该函数由一个参数，即拒绝的原因。如果参数不是函数，则会在内部被替换为一个"Thrower"函数。

```jsx
function onResolved(id) {
  setTimeout(console.log, 0, id, 'resolved')
}

function onRejected(id) {
  setTimeout(console.log, 0, id, 'rejected')
}

const p1 = new Promise((resolve, reject) => setTimeout(resolve, 3000))
const p2 = new Promise((resolve, reject) => setTimeout(reject, 3000))

p1.then(
  () => onResolved('p1'),
  () => onRejected('p1')
)

p2.then(
  () => onResolved('p2'),
  () => onRejected('p2')
)

// p1 resolved
// p2 resolved
```

因为期约只能转换为最终形态一次，所以这两个操作一定是互斥的。

如前所述，两个处理程序参数都是可选的。而且，传给`then()`的任何非函数类型的参数都会被静默忽略。如果只想提供`onRejected`参数，那就要在`onResolved`参数位置上传入`null`。这样有助于避免在内存中创建多余的对象，对期待函数参数类型系统也是一个交代。

```jsx
function onResolved(id) {
  setTimeout(console.log, 0, id, 'resolved')
}

function onRejected(id) {
  setTimeout(console.log, 0, id, 'rejected')
}

const p1 = new Promise((resolve, reject) => setTimeout(resolve, 3000))
const p2 = new Promise((resolve, reject) => setTimeout(resolve, 3000))

// 非函数处理程序参数会被静默忽略，不推荐
p1.then('foo bar')

// 不传onResolved处理程序的规范写法
p2.then(null, () => onRejected('p2'))
```

`Promise.prototype.then()`方法返回一个新的期约实例：

```jsx
const p1 = new Promise(() => {})
const p2 = p1.then()

setTimeout(console.log, 0, p1)
setTimeout(console.log, 0, p2)
setTimeout(console.log, 0, p1 ==== p2) // false
```

`then()`这个新期约实例基于`onResolved`处理程序的返回值构建。换句话说，该处理程序的返回值会通过`Promise.resolve()`包装来生成新期约。如果没有提供这个处理程序，则`Promise.resolve()`就会包装上一个期约解决之后的值。如果没有显式的返回语句，则`Promise.resolve()`会包装默认的返回值`undefined`。

> `Promise.resolve(value)`方法会返回一个以给定值解析后的`Promise`对象。如果这个值是一个 promise，那么将返回这个 promise；如果这个值是 thenable，返回的 promise 会“跟随”这个 thenable 对象，采用它的最终形态；否则返回的 promise 将以此值完成。此函数会将类 promise 对象的多层嵌套展平。

```jsx
const p1 = Promise.resolve('foo')

const p2 = p1.then()

setTimeout(console.log, 0, p2)

// 以下代码等效
const p3 = p1.then(() => undefined)
const p4 = p1.then(() => {})
const p5 = p1.then(() => Promise.resolve())
```

如果有显式的返回值，则`Promise.resolve()`会包装这个值。

```jsx
const p3 = p1.then(() => 'bar')
const p4 = p1.thne(() => Promise.resolve('bar'))
```

注意，在`onResolved`处理程序中返回一个错误对象，不会触发拒绝，而是将其包装在一个解决的期约中：

```jsx
const p3 = p1.then(() => new Error('qux'))

setTimeout(console.log, 0, p3) // Promise <resolved>: Error: qux
```

`onRejected`处理程序也与之类似：`onRejected`处理程序返回的值也会被`Promise.resolve()`包装。乍一看这可能有点违反直觉，但想一想，`onRejected`处理程序的任务不就是捕获异步错误吗？因此，拒绝处理程序在捕获错误后不抛出异常是符合预期的行为，应该返回一个期约。

```jsx
const p1 = Promise.reject('foo')

let p2 = pt.then()
// Uncaught (in promise) foo

setTimeout(console.log, 0, p2) // Promise <rejected>: foo

// 以下代码等效
const p3 = p1.then(null, () => undefined)
const p4 = p1.then(null, () => {})
const p5 = p1.then(null, () => Promise.resolve())
```

### `Promise.prototype.catch()`

`Promise.prototype.catch()`方法用于给期约添加拒绝处理程序。这个方法只接收一个参数：`onRejected`处理程序。事实上，这个方法就是一个语法糖，调用它就相当于调用`Promise.prototype.then(null, onRejected)`。

```jsx
const p = Promise.reject()
const onRejected = function (e) {
  setTimeout(console.log, 0, 'rejected')
}

// 下面代码等效
p.then(null, onRejected) // rejected
p.catch(onRejected) // rejected
```

`Promise.prototype.catch()`返回一个新的期约实例。在返回新期约实例方面，`Promise.prototype.catch()`的行为与`Promise.prototype.then()`的`onRejected`处理程序是一样的。

### `Promise.prototype.finally()`

`Promise.prototype.finally()`方法用于给期约添加`onFinally`处理程序，这个处理程序在期约转换为解决或拒绝状态时都会执行。这个方法可以避免`onResolved`和`onRejected`处理程序中出现冗余代码。但`onFinally`处理程序没有办法知道期约的状态时解决还是拒绝，所以这个方法主要用于添加清理代码。

```jsx
const p1 = Promise.resolve()
const p2 = Promise.reject()

const onFinally = function () {
  setTimeout(console.log, 0, 'Finally!')
}

p1.finally(onFinally) // Finally
p2.finally(onFinally) // Finally
```

`Promise.prototype.finally()`方法返回一个新的期约实例。因为`onFinally`被设计为一个状态无关的方法，因此传入的回调不接收任何参数，它仅用于无论如论期约的最终结果如何都要执行的情况。大多数情况下它将表现为父期约的传递。

```jsx
const p = Promise.resolve('foo')

const p1 = p.finally(() => 'bar')
const p2 = p.finally(() => {})
const p3 = p.finally(() => new Error('wrong'))

setTimeout(console.log, 0, p1)
setTimeout(console.log, 0, p2)
setTimeout(console.log, 0, p3)
// Promise { 'foo' }
// Promise { 'foo' }
// Promise { 'foo' }
```

如果返回的是一个待定的期约，或者`onFinally`程序抛出错误（显式抛出或返回一个拒绝的期约），则会返回相应的期约。

```jsx
const p = Promise.resolve('foo')

const p1 = p.finally(() => Promise.resolve('bar'))
const p2 = p.finally(
  () =>
    new Promise(resolve => {
      setTimeout(resolve, 1000, 'bar')
    })
)
const p3 = p.finally(() => {
  throw 'wrong'
})
p3.catch(() => {})
const p4 = p.finally(() => Promise.reject('wrong'))
p4.catch(() => {})

setTimeout(console.log, 0, p1)
setTimeout(console.log, 0, p2)
setTimeout(console.log, 0, p3)
setTimeout(console.log, 0, p4)

// Promise { 'foo' }
// Promise { <pending> }
// Promise { <rejected> 'wrong' }
// Promise { <rejected> 'wrong' }
```

返回待定期约的情形并不常见，因为只要期约一解决，新期约仍然会原样后传初始期约。

### 非重入期约方法

当期约进入落定状态时，与该状态相关的处理程序仅仅会被**排期**，而非立即执行。跟在添加这个处理程序的代码之后的同步代码一定会在处理程序之先执行。即使期约一开始就时与附加处理程序关联的状态，执行顺序也是这样的。这个特性由 JavaScript 运行时保证，被称为“非重入”（non-reentrancy）特性。

```jsx
// 创建解决的期约
const p = Promise.resolve()

// 添加解决处理程序
// 直觉上，这个处理程序会等待期约一解决就执行
p.then(() => console.log('onResolved handler'))

// 同步输出
console.log('then() returns')

// 实际的输出
// then() returns
// onResolved handler
```

这个例子中，在一个解决了的期约上调用`then()`会把`onResolved`处理程序推进消息队列（微任务队列）。但这个处理程序在当前线程上的同步代码完成之前肯定不会执行。

先添加处理程序后解决期约也是一样的。如果添加处理程序后，同步代码才改变期约状态，那么处理程序仍然会根据该状态变化表现出非重入特性。

```jsx
let synchronousResolve

const p = new Promise(resolve => {
  synchronousResolve = function () {
    console.log('1: invoking resolve()')
    resolve()
    console.log('2: resolve() returns')
  }
})

p.then(() => console.log('4: then() handler executes'))

synchronousResolve()
console.log('3: synchronousResolve() returns')

// 1: invoking resolve()
// 2: resolve() returns
// 3: synchronousResolve() returns
// 4: then() handler executes
```

### 邻近处理程序的执行顺序

如果给期约添加了多个处理程序，当期约状态变化时，相关处理程序会按照添加它们的顺序依次执行。无论是`then()`、`catch()`还是`finally()`添加的处理程序都是如此。

### 传递解决值和拒绝理由

拿到了落定状态后，期约会提供其解决值（如果兑现）或其拒绝理由（如果拒绝）给相关状态的处理程序。拿到返回值后，就可以进一步对这个值进行操作。比如，第一次网络请求返回的 JSON 是发送第二次请求所必须的数据，那么第一次请求返回的值就应该传给`onResolved`处理程序继续处理。当然，失败的网络请求也应该把 HTTP 状态码传给`onRejected`处理程序。

在执行函数中，解决的值和拒绝的理由是分别作为`resolve()`和`reject()`的第一个参数往后传的。然后，这些值又会传给它们各自的处理程序，作为`onResolved`或`onRejected`处理程序的唯一参数。

```jsx
const p1 = new Promise((resolve, reject) => resolve('foo'))
p1.then(value => console.log(value)) // foo

const p2 = new Promise((resolve, reject) => reject('bar))
p1.catch(reason => console.log(reason)) // bar
```

`Promise.resolve()`和`Promise.reject()`在被调用时就会接收解决值和拒绝理由。同样地，它们返回的期约也像执行器一样把这些值传给`onResolved`或`onRejected`处理程序：

```jsx
const p1 = Promise.resolve('foo')
p1.then(value => console.log(value)) // foo

const p2 = Promise.reject('bar')
p2.then(reason => console.log(reason)) // bar
```

### 拒绝期约与拒绝错误处理

拒绝期约类似于`throw()`表达式，因为它们都代表同一种程序状态，即需要中断或者特殊处理。在期约的执行函数或处理程序中抛出错误会导致拒绝，对应的错误对象会成为拒绝的理由。

```jsx
let p1 = new Promise((resolve, reject) => reject(Error('foo')))
let p2 = new Promise((resolve, reject) => {
  throw Error('foo')
})
let p3 = Promise.resolve().then(() => {
  throw Error('foo')
})
let p4 = Promise.reject(Error('foo'))
setTimeout(console.log, 0, p1) // Promise <rejected>: Error: foo
setTimeout(console.log, 0, p2) // Promise <rejected>: Error: foo
setTimeout(console.log, 0, p3) // Promise <rejected>: Error: foo
setTimeout(console.log, 0, p4) // Promise <rejected>: Error: foo

// 也会抛出4个未捕获错误
```

期约可以以任何理由拒绝，包括`undefined`，但最好统一使用错误对象。这样做主要是因为创建错误对象可以让浏览器捕获错误对象中的栈追踪信息，而这些信息对调试是非常关键的。

所有错误都是异步抛出且未处理的，通过错误对象捕获的栈追踪信息展示了错误发生的路径。注意错误的顺序：`Promise.resolve().then()`的错误最后才出现，这是因为它需要在运行时消息队列中添加处理程序：也就是在最终抛出未捕获错误之前它还会创建另一个期约。

异步错误有一个有意思的副作用。正常情况下，使用`throw()`关键字抛出错误时，JavaScript 运行时的错误处理机制会停止执行抛出错误之后的任何指令。

```jsx
throw Error('foo')

console.log('bar') // 这一行不会执行

// Uncaught Error: foo
```

但是，在期约中抛出错误时，因为错误实际上是从消息队列中异步抛出的，所以并不会阻止运行时继续执行同步指令。

```jsx
Promise.reject(Error('foo'))
console.log('bar')
// bar

// Uncaught (in promise) Error: foo
```

如本章前面的`Promise.reject()`示例所示，异步错误只能通过异步的`onRejected`处理程序捕获：

```jsx
// 正确
Promise.reject(Error('foo').catch(e => {}))

// 不正确
try {
  Promise.reject(Error('foo'))
} catch (e) {}
```

这不包括捕获执行函数中的错误，在解决或拒绝期约之前，仍然可以使用`try/catch`在执行函数中捕获错误：

```jsx
const p = new Promise((resolve, reject) => {
  try {
    throw Error('foo')
  } catch (e) {}

  resolve('bar')
})

setTimeout(console.log, 0, p) // Promise <resolved>: bar
```

`then()`和`catch()`的`onRejected`处理程序在语义上相当于`try/catch`。出发点都是捕获错误之后将其隔离，同时不影响正常逻辑执行。为此，`onRejected`处理程序的任务应该是在捕获异步错误之后返回一个**解决**的期约。

```jsx
const p = new Promise((resolve, reject) => {
  const n = Math.random()
  if (n > 0.5) {
    resolve('foo')
  }
  reject('bar')
  console.log('...code') // 一定会执行
})
```

注意，执行了`resolve()`或者`reject()`会立即改变期约的状态，一经改变，无法变更，但是代码块不会停止执行。

## 期约连锁与期约合成

多个期约组合在一起可以构成强大的代码逻辑。这种组合可以通过两种方式实现：期约连锁与期约合成。前者就是一个期约接一个期约地拼接，后者则是将多个期约组合为一个期约。

### 期约连锁

把期约逐个地串联起来是一种非常有用的编程模式。之所以可以这样做，是因为每个期约实例的方法（`then()`、`catch()`、`finally()`）都会返回一个**新的**期约对象，而这个新期约又有自己的实例方法。这样连缀方法调用就可以构成所谓的“期约连锁”。

```jsx
const p = new Promise((resolve, reject) => {
  resolve(0)
})

const addOne = value => value + 1

p.then(addOne).then(addOne).then(addOne).then(console.log) // 3
```

期约连锁最有用的是串行化异步任务：

```jsx
const p = new Promise((resolve, reject) => {
  console.log('first')
  resolve(0)
})

const addOne = value =>
  new Promise((resolve, reject) => {
    console.log(`add one to ${value}`)
    setTimeout(() => resolve(value + 1), 1000)
  })

p.then(addOne)
  .then(addOne)
  .then(addOne)
  .then(value => console.log(`finally got ${value}`))

// first
// add one to 0
// add one to 1
// add one to 2
// finally got 3
```

每个后序的处理程序都会等待前一个期约的解决，然后实例化一个新期约并返回它。这种结构可以简介地将异步任务串行化，解决回调地狱的难题。

因为`then()`、`catch()`和`finally()`都返回期约，所以串联这些方法也很直观。

```jsx
const p = new Promise((resolve, reject) => {
  console.log('initial promise rejects')
  reject()
})

p.catch(() => console.log('reject handler'))
  .then(() => console.log('resolve handler'))
  .finally(() => console.log('finally handler'))

// initial promise rejects
// reject handler
// resolve handler
// finally handler
```

### 期约图

因为一个期约可以有任意多个处理程序，所以期约连锁可以组成**有向非循环图**结构。这样，每个期约都是图中的一个节点，而使用实例方法添加的处理程序则是有向顶点。因为图中的每个节点都会等待前一个节点**落定**，所以图的方向就是期约的解决或拒绝顺序。

```jsx
//    A
//   /\
//  B  C
// /\  /\
// D E F G
let A = new Promise((resolve, reject) => {
  console.log('A')
  resolve()
})
let B = A.then(() => console.log('B'))
let C = A.then(() => console.log('C'))
B.then(() => console.log('D'))
B.then(() => console.log('E'))
C.then(() => console.log('F'))
C.then(() => console.log('G'))

// A
// B
// C
// D
// E
// F
// G
```

注意，日志的输出语句是对二叉树的层序遍历。如前所述，期约的处理程序是按照它们添加的顺序执行的。由于期约的处理程序是**先**添加到微任务队列，**然后**才逐个执行，因此构成了层序遍历。

树只是期约图的一种形式。考虑到根节点不一定唯一，且多个期约也可以组合成一个期约，所以有向非循环图是体现期约连锁可能性的最准确表达。

### `Promise.all()`和`Promise.race()`

`Promise`类提供两个将多个期约实例组合成一个期约的静态方法：`Promise.all()`和`Promise.race()`。而合成后的期约的行为取决于内部期约的行为。

`Promise.all()`静态方法创建的期约会在一组期约全部解决之后再解决。这个静态方法接收一个可迭代对象（可迭代对象中的元素如果不是期约，将会通过`Promise.resolve()`转换为期约），返回一个新期约。

```jsx
const p1 = Promise.all([Promise.resolve(), Promise.resolve()])

// 可迭代对象中的元素会通过Promise.resolve()转换为期约
const p2 = Promise.all([2, 4])

// 空的可迭代对象等价于Promise.resolve()
const p3 = Promise.all([])

// 无效语法
const p4 = Promise.all()
```

合成的期约只会在每个包含的期约都解决之后才解决：

```jsx
const p = new Promise.all([
  Promise.resolve(),
  new Promise((resolve, reject) => setTimeout(resolve, 1000)),
])

setTimeout(console.log, 0, p)

p.then(() => setTimeout(console.log, 0, 'all() resolved!'))
```

如果至少有一个包含的期约待定，则合成的期约也会待定。如果有一个包含的期约拒绝，则合成的期约也会拒绝。如果所有的期约都成功解决，则合成的期约的解决值就是所有包含期约解决值的数组，按照迭代器顺序：

```jsx
const p = Promise.all([
  Promise.resolve(3),
  Promise.resolve(),
  Promise.resolve(4),
])

p.then(console.log) // [ 3, undefined, 4 ]
```

如果有期约拒绝，则第一个拒绝的期约会将自己的理由作为合成期约的拒绝理由。之后再拒绝的期约不会影响最终期约的拒绝理由。不过，这不影响所有包含期约正常的拒绝操作。合成的期约会静默处理所有包含期约的拒绝操作。

`Promise.race()`静态方法返回一个包装期约，是一组集合中最先解决或拒绝的期约的镜像。这个方法接收一个可迭代对象，返回一个新期约。

```jsx
let p1 = Promise.race([Promise.resolve(), Promise.resolve()])
// 可迭代对象中的元素会通过Promise.resolve()转换为期约
let p2 = Promise.race([3, 4])
// 空的可迭代对象等价于new Promise(() => {})
let p3 = Promise.race([])
// 无效的语法
let p4 = Promise.race()
// TypeError: cannot read Symbol.iterator of undefined
```

`Promise.race()`不会对解决或拒绝的期约区别对待。无论是解决还是拒绝，只要是第一个落定的期约，`Promise.race()`就会包装其解决值或拒绝理由并返回新期约。如果有一个期约拒绝，只要它是第一个落定的，就会称为拒绝合成期约的理由。之后再拒绝的期约不会影响最终期约的拒绝理由。不过，这并不影响所包含期约正常的拒绝操作，类似`Promise.all()`，合成的期约会静默处理所有包含期约的拒绝操作。

## 期约扩展

ES6 期约实现是很可靠的，但也有不足之处。例如，很多第三方期约库实现中具备而 ECMAScript 规范却未涉及的两个特性：期约取消和进度追踪。

### 期约取消

我们经常会遇到期约正在处理过程中，程序却不再需要其结果的情形。这时候如果能够取消期约就好了。某些第三方库，例如 Bluebird 就提供了这种特性。实际上 TC39 委员会也曾准备添加这个特性，但是相关的提案被撤回了。结果，ES6 期约被认为是“激进的”：只要期约的逻辑开始执行，就没有办法阻止它执行到完成。

实际上可以在现有实现基础上提供一种临时性的封装，以实现期约取消的功能。这可以用到**取消令牌**。生成的令牌实例提供了一个接口，利用这个接口可以取消期约；同时也提供了一个期约的实例，可以用来触发取消后的操作并求值取消状态。

下面是`CancelToken`类的一个例子：

```jsx
class CancelToken {
  constructor(cancelFn) {
    this.promise = new Promise((resolve, reject) => {
      cancelFn(resolve)
    })
  }
}
```

这个类包装了一个期约，把解决方法暴露给了`cancelFn`参数。这样，外部代码就可以向构造函数中传入一个函数，从而控制什么情况下可以取消期约。这里期约是令牌类的公共成员，因此可以给它添加处理程序以取消期约。

这个类大概可以这样使用：

```html
<button id="start">Start</button> <button id="cancel">Cancel</button>
```

```jsx
class CancelToken {
  constructor(cancelFn) {
    this.promise = new Promise((resolve, reject) => {
      cancelFn(() => {
        setTimeout(console.log, 0, 'delay cancelled')
        resolve()
      })
    })
  }
}

const startButton = document.querySelector('#start')
const cancelButton = document.querySeledtor('#cancel')

function cancellableDelayedResolve(delay) {
  setTimeout(console.log, 0, 'set delay')

  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      setTimeout(console.log, 0, 'delayed resolve')
      resolve()
    }, delay)

    const cancelToken = new CancelToken(cancelCallback => {
      cancelButton.addEventListener('click', cancelCallback)
    })

    cancelToken.promise.then(() => clearTimeout(id))
  })
}

startButton.addEventListenr('click', () => cancellableDelayedResolve(1000))
```

### 期约进度通知

执行中的期约可能会有不少离散的“阶段”，在最终解决之前必须依次经过。某些情况下，监控期约的执行进度会很有用。ES6 期约并不支持进度追踪，但是可以通过扩展来实现。

一种实现方式是扩展`Promise`类，为它添加`notify()`方法。

```jsx
class TrackablePromise extends Promise {
  constructor(executor) {
    const notifyHandlers = []

    super((resolve, reject) => {
      return executor(resolve, reject, status => {
        notifyHandlers.map(hanlder => hanlder(status))
      })
    })

    this.notifyHandlers = notifyHandlers
  }

  notify(notifyHandler) {
    this.notifyHandlers.push(notifyHandler)
    return this
  }
}
```

> ES6 不支持取消期约和通知进度，一个主要的原因是这样会导致期约连锁和期约合成过度复杂化。例如在一个期约连锁中，如果某个被其他期约依赖的期约被取消了或发出了通知，那么接下来应该发生什么完全说不清楚。毕竟，如果取消了`Promise.all()`中的一个期约，或者期约连锁连锁中前面的期约发送了一个通知，那么接下来应该怎么办才比较合理呢？

# 异步函数

异步函数，也称为“async/await”（语法关键字），是 ES6 期约模式在 ECMAScript 函数中的应用。async/await 是 ES8 规范新增的。这个特性从行为和语法上都增强了 JavaScript，让以同步代码的代码能够异步执行。下面来看一个最简单的例子，这个期约在超时之后会解决为一个值：

```jsx
const p = new Promise((resolve, reject) => setTimeout(resolve, 1000, 3))
```

这个期约在 1000 毫秒后解决为数值 3。如果程序中的其他代码想要在这个值可以使用时访问它，需要添加一个解决处理程序。

```jsx
const p = new Promise((resolve, reject) => setTimeout(resolve, 1000, 3))

p.then(x => console.log(x)) // 3
```

这看上去并不方便，因为其他代码都不许塞到期约处理程序中。也就是说，任何需要访问这个期约所产生值的代码，都需要以处理程序的形式来接收这个值。也就是说，代码必须放在期约处理程序中。ES8 为此提供了 async/await 关键字。

## 异步函数

ES8 的 async/await 旨在解决利用异步结构组织代码的问题。为此，ECMAScript 对函数进行了扩展，为其增加了两个新关键字：`async`和`await`。

### `async`

`async`关键字用于声明异步函数。这个关键字可以用在函数、函数表达式、箭头函数和方法上：

```jsx
async function foo() {}

const bar = async function () {}

const baz = async () => {}

class Qux {
  async qux() {}
}
```

使用`async`关键字可以让函数具有异步特征，但总体上其代码仍然是同步求值的。而在参数或闭包方面，异步函数仍然具有普通 JavaScript 函数的正常行为。正如下面的例子所示，`foo()`函数仍然还会在后面的指令之前被求值：

```jsx
async function foo() {
  console.log(1)
}

foo()
console.log(2)

// 1
// 2
```

不过，异步函数如果使用`return`关键字返回了值（如果没有`return`返回`undefined`），这个值会被`Promise.resolve()`包装为一个期约对象。异步函数始终返回期约对象。在函数外部调用这个函数可以得到它返回的期约。

```jsx
async function foo() {
  console.log(1)
  return 3
}

// 给返回的期约添加一个解决处理程序
foo().then(console.log)

console.log(2)

// 1
// 2
// 3
```

当然直接返回一个期约对象也是一样的：

```jsx
async function foo() {
  console.log(1)
  return Promise.resolve(3)
}

// 给返回的期约添加一个解决处理程序
foo().then(console.log)

console.log(2)

// 1
// 2
// 3
```

异步函数的返回值期待（但实际上并不要求）一个实现`thenable`接口的对象，但常规的值也可以。如果返回的是实现`thenable`接口的对象，则这个对象可以由提供给`then()`的处理程序“解包“。如果不是，则返回值被当作已经解决的期约。

```jsx
// 返回一个原始值
async function foo() {
  return 'foo'
}

foo().then(console.log) // foo

// 返回一个没有实现thenable接口的对象
async function bar() {
  return ['bar']
}

bar().then(console.log)
// ['bar']

// 返回了一个实现了thenable接口的非期约对象
async function baz() {
  const thenable = {
    then(callback) {
      callback('baz')
    },
  }
  return thenable
}

baz().then(console.log)
// baz

// 返回一个期约
async function qux() {
  return Promise.resolve('qux')
}

qux().then(console.log)
// qux
```

在与期约处理程序中一样，在异步函数中抛出错误会返回拒绝的期约：

```jsx
async function foo() {
  console.log(1)
  throw 3
}

// 给返回的期约添加一个拒绝处理程序
foo().catch(console.log)
console.log(2)

// 1
// 2
// 3
```

不过，拒绝期约的错误不会被异步函数捕获：

```jsx
async function foo() {
  console.log(1)
  Promise.reject(3)
}

foo.catch(console.log)
console.log(2)

// 1
// 2
// Uncaught (in promise): 3
```

### `await`

因为异步函数主要针对不会马上完成的任务，所以自然需要一种暂停和恢复执行的能力。使用`await`关键字可以暂停异步函数代码的执行，等待期约解决。

```jsx
const p = new Promise((resolve, reject) => setTimeout(resolve, 1000, 3))

p.then(x => console.log(x))

// 改写成async/await
async function foo() {
  const p = new Promise((resolve, reject) => setTimeout(resolve, 1000, 3))
  console.log(await p)
}

foo()
// 3
```

注意，`await`关键字会暂停执行异步函数后面的代码，让出 JavaScript 运行时的执行线程。这个行为与生成器函数中的`yield`关键字是一样的。`await`关键字同样是尝试“解包”对象的值，然后将这个值传给表达式，再恢复异步函数的执行。

`await`关键字的用法与 JavaScript 的一元操作一样。它可以单独使用，也可以再表达式中使用，如下所示：

```jsx
// 异步打印foo
async function foo() {
  console.log(await Promise.resolve('foo'))
}
foo()
// foo

// 异步打印bar
async function bar() {
  return await Promise.resolve('bar')
}
bar().then(console.log)
// bar

// 1000毫秒后打印baz
async function baz() {
  await new Promise((resolve, reject) => setTimeout(resolve, 1000))
  console.log('baz')
}
baz()
// baz
```

`await`关键字期待（但实际上并不要求）一个实现`thenable`接口的对象，但常规的值也可以。如果是实现`thenable`接口的对象，则这个对象可以由`await`来“解包”。如果不是，则这个值就被当作已经解决的期约。

```jsx
// 等待一个原始值
async function foo() {
  console.log(await 'foo')
}

foo()
// foo

// 等待一个没有实现thenable接口的对象
async function bar() {
  console.log(await ['bar'])
}
bar()
// ['bar']

// 等待一个实现了thenable接口的非期约对象
async function baz() {
  const thenable = {
    then(callback) {
      callback('baz')
    },
  }
  console.log(await thenable)
}
baz()
// baz

// 等待一个期约
async function qux() {
  console.log(await Promise.resolve('qux'))
}
qux()
// qux
```

等待会抛出错误的同步操作，会返回拒绝的期约：

```jsx
async function foo() {
  console.log(1)
  await (() => {
    throw 3
  })()
}

foo.catch(console.log)
console.log(2)

// 1
// 2
// 3
```

如前面的例子所示，单独的`Promise.reject()`不会被异步函数捕获，而抛出未捕获错误。不过，对拒绝的期约使用`await`则会释放（unwrap）错误值。

```jsx
async function foo() {
  console.log(1)
  await Promise.reject(3)
  console.log(4) // 这行代码不会执行
}

foo().catch(console.log)
console.log(2)

// 1
// 2
// 3
```

### `await`限制

`await`关键字必须再异步函数中使用，不能在顶级上下文如`<script>`标签或模块中使用。不过，定义并立即调用函数是没问题的。下面两段代码实际上是相同的：

```jsx
async function foo() {
  console.log(await Promise.resolve(3))
}
foo()

// 3
;(async function () {
  console.log(await Promise.resolve(3))
})()

// 3
```

此外，异步函数的特质不会扩展到嵌套函数。因此，`await`关键字也只能直接出现在异步函数的定义中。在同步函数内部使用`await`会抛出`SyntaxError`。

## 停止和恢复执行

使用`await`关键字之后的区别其实比看上去的还要微妙一些。例如，下面例子中按顺序调用了 3 个函数，但它们的输出顺序相反：

```jsx
async function foo() {
  console.log(await Promise.resolve('foo')) // await右边的值立即可用
}

async function bar() {
  console.log(await 'bar') // await右边的值立即可用
}

async function baz() {
  console.log('baz')
}

foo()
bar()
baz()

// baz
// foo
// bar
```

async/await 中真正起作用的是`await`。`async`关键字，无论从哪方面来看，都不过是一个标识符。毕竟，异步函数如果不包含`await`关键字，其执行基本上跟普通函数没有什么区别。

```jsx
async function foo() {
  console.log(2)
}

console.log(1)
foo()
console.log(3)

// 1
// 2
// 3
```

要完全理解`await`关键字，必须知道它并非只是等待一个值可用那么简单。JavaScript 运行时在碰到`await`关键字时会记录在哪里暂停执行。等到`await`右边的值可用了，JavaScript 会向微任务队列中推送一个任务，这个任务会恢复异步函数的执行。

因此，即使`await`后面跟着一个立即可用的值，函数的其余部分也会被**异步**求值。

```jsx
async function foo() {
  console.log(2)
  await null
  console.log(4)
}

console.log(1)
foo()
console.log(3)

// 1
// 2
// 3
// 4
```

实际开发中，对于并行的异步操作通常更关注结果，而不依赖执行顺序。

# 小结

长期以来，掌握单线程 JavaScript 运行时的异步行为一直都是个艰巨的任务。随着 ES6 新增了期约和 ES8 新增了异步函数，ECMAScript 的异步编程特性有了长足的进步。通过期约和 async/await，不仅可以实现之前难以实现或不可能实现的任务，而且也能写出更清晰、简洁并且容易理解、调试的代码。

期约的主要功能是为异步代码提供了清晰的抽象。可以用期约表示异步执行的代码块，也可以用期约表示异步计算的值。在需要串行异步代码时，期约的价值最为突出。作为可塑性极强的一种结构，期约可以被序列化、连锁使用、复合、扩展和重组。

异步函数是将期约应用于 JavaScript 函数的结果。异步函数可以暂停执行，而不阻塞主线程。无论是编写基于期约的代码，还是组织串行或平行执行的异步代码，使用异步函数都非常得心应手。异步函数可以说是现代 JavaScript 工具箱中最重要的工具之一。
