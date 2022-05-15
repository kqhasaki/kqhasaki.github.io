---
title: 利用ESLint、Prettier统一团队内代码风格
date: 2022-05-15
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h29cyvvp5sj20y80mot9g.jpg
---

在工作中，我们不免会遇到许多人一起协作一个项目的情况。往往，团队内部同时有资历不同、技术背景不同的同学一起贡献代码。最近我也遇到类似的情况，并且由于业务的堆积和进度要求紧迫，大家都忙着写业务，没有时间统一编撰一个代码规范。然而，JavaScript 项目建立一个代码规范也是比较重要的，需要花些时间至少统一以下两点：

- 代码检查工具的规则配置（linter）要统一；
- 代码格式化工具的配置（formatter）要统一。

# 背景

首先概述这两者的基本作用，并介绍统一 linter 配置和 formatter 配置的重要性。

## 统一检查工具

代码检查工具（目前使用最为广泛的是[ESLint](https://cn.eslint.org/docs/user-guide/getting-started)）是用来检测代码中特性模式是否合规的工具，它的目的是**保证代码的一致性和避免错误**。linter 所提供的功能可以作为插件安装在代码编辑器中。安装插件后，我们配置相应的规则即可（对于 ESLint，只需下载对应的规则文件），插件会定时运行检查工具，检查工具会根据规则检查当前代码，给出错误或者警告，之后编辑器会对错误或警告的代码区域进行高亮。所谓的统一检查工具，具体就是指**使用相同的插件**和**使用相同的规则文件**。

统一代码检查工具很重要的原因有两点。一是因为 JavaScript 语言本身经历了多次的修订、其框架生态的迭代更新尤为迅速，针对 ECMAScript 语言自身的编码规范和针对 React、Vue 等框架的编码规范也经历了多次迭代，这种情况下，团队中每个人对编码规范的细节理解就会不同，导致自发的统一实践起来会很困难。另外一个重要原因是，团队内不免会有技术新人或者其他技术栈的同学贡献代码，其实对他们来说，迫切需要一个适用于当前技术栈的代码规范。由于他们对 JavaScript 和其框架的一些特性和坑不熟悉，而代码检查工具能够针对某些特性的误用做出非常好的提示，这对他们养成更好编程习惯、熟悉语言和框架特性有显著促进效果。

## 统一格式化

代码格式化工具同样通过插件安装在代码编辑器中。对于 JavaScript 项目，目前社区使用最为广泛的 formatter 是 [Prettier](https://www.prettier.cn/docs/index.html)。格式化插件普遍支持自定义配置，只要配置文件统一，就会输出完全一致的代码样式。这也就是说，在团队中必须使用同一份代码格式化配置文件，并且确保每个开发者在提交代码前进行格式化。

统一代码格式化工具的重要性就很直观了。最大的好处就是避免因为格式化引起的冲突，并且格式化后的代码更加工整、可读性更强，统一格式化配置也有利于产生清晰的 commit 记录，这对一个长期维护的项目非常重要。然而对于 ECMAScript 这门语言而言，出于其迥异于其他语言的语法和历史上出现诸如“回调地狱”等各种各样的历史原因，对“工整”的 JavaScript 代码应该具有什么样的结构，其实并没有客观的标准。例如，虽然绝大多数的编码规范（例如[airbnb 规范](https://github.com/airbnb/javascript)）推荐了 2 个空格作为缩进，但是还是有部分人是赞成 4 个空格（毕竟现在“回调地狱”已经不会出现了）；另一个例子，“加不加分号？”，这在社区已经争论不休多年了。一方面，总是在语句末尾加上分号可以避免一些错误，（React 的代码库以及其官网的 demo 都加上了分号）；但是另一方面，许多人认为没有必要的分号会让代码变得不整洁。（Node.js 的官网 demo、Vue、Next.js 等框架的代码库和其官网 demo 都是不加分号的）。其实关于代码格式化的规则完全看个人偏好，但是在团队中必须形成一致。

# ESLint

<iframe width="560" height="315" src="https://www.youtube.com/embed/hppJw2REb8g" title="用ESLint改善代码质量" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

对于 JavaScript，和 ESLint 类似的代码检查工具有很多，例如 JSlint、JShint 等，但是 ESLint 现今大受欢迎。

ESLint 最初是由 Nicholas C. Zakas 于 2013 年 6 月创建的开源项目。它的目标是提供一个插件化的 javascript 代码检测工具。促使其流行的最主要的原因是它完全支持自定义配置项。我们不仅可以下载并启用不同的检查规则，也可以随时修改这些规则，甚至可以编写自己的规则。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h29gzv0zqrj21a60psabs.jpg)

> 下文引用自[ESLint 文档](https://cn.eslint.org/docs/about/)：
>
> “ESLint 是一个开源的 JavaScript 代码检查工具，由 Nicholas C. Zakas 于 2013 年 6 月创建。代码检查是一种静态的分析，常用于寻找有问题的模式或者代码，**并且不依赖于具体的编码风格**。对大多数编程语言来说都会有代码检查，一般来说编译程序会内置检查工具。
>
> JavaScript 是一个动态的弱类型语言，在开发中比较容易出错。因为没有编译程序，为了寻找 JavaScript 代码错误通常需要在执行过程中不断调试。像 ESLint 这样的可以让程序员在编码的过程中发现问题而不是在执行的过程中。
>
> ESLint 的初衷是为了让程序员可以创建自己的检测规则。ESLint 的所有规则都被设计成可插入的。ESLint 的默认规则与其他的插件并没有什么区别，规则本身和测试可以依赖于同样的模式。为了便于人们使用，ESLint 内置了一些规则，当然，你可以在使用过程中自定义规则。
>
> ESLint 使用 Node.js 编写，这样既可以有一个快速的运行环境的同时也便于安装。
>
> **Philosophy**:
>
> 所有都是可拔插的
>
> - 内置规则和自定义规则共用一套规则 API
> - 内置的格式化方法和自定义的格式化方法共用一套格式化 API
> - 额外的规则和格式化方法能够在运行时指定
> - 规则和对应的格式化方法并不强制捆绑使用
>
> 每条规则:
>
> - 各自独立
> - 可以开启或关闭（没有什么可以被认为“太重要所以不能关闭”）
> - 可以将结果设置成警告或者错误
>
> 另外:
>
> - ESLint 并不推荐任何编码风格，规则是自由的
> - 所有内置规则都是泛化的
>
> 项目:
>
> - 通过丰富文档减少沟通成本
> - 尽可能的简单透明
> - 相信测试的重要性
>   ”

再次明确一点，ESLint 本身是一个代码检查工具，与代码风格无关。ESLint 也不推荐任何代码风格，规则是完全自由的。对代码风格的约束完全体现在自定义的检测规则中。

## 基本用法

要使用 ESLint，最好全局安装 ESLint 包，确保使用足够新版本的`Node.js`和`npm`，因为这个检查工具本质上就是一个 Node.js 脚本。

```shell
npm install --global eslint
```

安装之后，在项目的根目录进行配置文件的初始化。

```shell
eslint --init
```

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h29i4k2008j20s60autav.jpg)

例如，我们对一个 React 项目初始化 ESLint 配置，按照以上选项，会在根目录下产生`.eslintrc.js`文件。这个文件就是 ESLint 之后检查我们代码时的依据了，为了保证团队使用相同的配置，这个文件是需要 Git 追踪的。

```jsx
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recomended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {},
}
```

其中`rules`和`extends`都是可以配置的，我们可以自定义规则，并且安装规则配置插件。

之后，可以在任何文件或目录运行 ESLint 来检查代码。

```shell
eslint targetfile.js
```

如果 ESLint 没有发现任何配置文件，则会抛出错误日志。

## VSCode 中使用

只需安装 ESLint 插件（或者其他类似插件，本质上是调用`eslint`命令）即可，这个插件会每隔一段时间调用`eslint`命令来检查当前打开的所有代码文件，并且获取检查结果后对改变码文本渲染样式，提示错误或者警告。

# Prettier

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h29jrsitg8j21a60gs77b.jpg)

<iframe width="560" height="315" src="https://www.youtube.com/embed/hkfBvpEfWdA" title="简介Prettier" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 基本用法

类似 ESLint，Prettier 也是一个 Node.js 脚本。

全局安装 Prettier 后，我们可以对以下类型的代码文件进行格式化。

![](https://tva1.sinaimg.cn/large/e6c9d24egy1h29jiwr95wj20su0k4t9r.jpg)

```shell
npm install --global prettier

prettier targetfile.js
```

## formatter 对比 linter

对于 ESLint 这样的 linter，其实可以配置两类规则（关于代码格式与关于代码质量）：

- 代码格式规则（例如`max-len`、`no-mixed`、`comma-style`等）。有了 Prettier 这样的 formatter，这类规则我们完全不用配置了。因为在代码编辑完成后，formatter 立即根据规则格式化好代码，因此代码永远不会违反这些格式化规则了。

- 代码质量规则（例如`no-unused-vars`、`no-extra-bind`、`no-implicit-globals`等。formatter 是不管这些的，这是 linter 的工作。

因此，实践中使用 Prettier 进行代码格式化，使用 ESLint 进行代码检查就对了。

## VSCode 中使用

只需安装 Prettier 插件（或者其他类似插件，本质上是调用`prettier`命令）即可。在用户触发了格式化代码的指令后（例如手动格式化，或者配置为保存时自动格式化），插件会运行`prettier`命令，获取其输出的格式化后的代码文本，替换掉当前编辑的代码文本。

通过在用户主目录配置`.prettierrc`文件，或者在 vscode 中（`settings.json`）进行配置，我们可以自定义 Prettier 格式化规则。

# 其他插件

了解了检查和格式化的基本工作原理之后，可以发现一点。ESLint 和 Prettier 本质上都是 Node.js 脚本，至于它如何集成到 VSCode 这类编辑器上方便开发者使用，是另一回事了。因此，部分其他插件，也可以集成这些功能。

## Vetur

Vetur 是一个广泛用于 Vue 项目的插件。它集成了若干项功能，包括了对`.vue`文件的语法高亮、语义高亮，支持自动补全等，当然也包括了语法检查和代码格式化功能。对于开发 Vue 项目编辑器需要提供的各种辅助功能做了一个集成，是一个一揽子解决方案。

### 代码检查

Vetur 可以进行代码检查（它依赖于 ESLint 插件，看上去很像是拿一套写死的规则去调用 ESLint 插件），Vetur 使用的规则是[`vue3-essential`](https://eslint.vuejs.org/rules/#priority-a-essential-error-prevention-for-vue-js-3-x)（Vue3）。Vetur 不支持读取 ESLint 的配置文件自定义检查。如果需要[自定义 ESLint 规则](https://vuejs.github.io/vetur/guide/linting-error.html#linting)，则需要首先关闭 Vetur 的检查，然后正常使用 ESLint 插件即可。

### 代码格式化

对于代码格式化，Vetur 支持在后台调用多种格式化插件，都是可配置的。

```json
{
  "vetur.format.defaultFormatter.html": "prettier",
  "vetur.format.defaultFormatter.pug": "prettier",
  "vetur.format.defaultFormatter.css": "prettier",
  "vetur.format.defaultFormatter.postcss": "prettier",
  "vetur.format.defaultFormatter.scss": "prettier",
  "vetur.format.defaultFormatter.less": "prettier",
  "vetur.format.defaultFormatter.stylus": "stylus-supremacy",
  "vetur.format.defaultFormatter.js": "prettier",
  "vetur.format.defaultFormatter.ts": "prettier",
  "vetur.format.defaultFormatter.sass": "sass-formatter"
}
```

在使用 Vetur，通过 Prettier 自身配置规则即可，具体可见[文档](https://vuejs.github.io/vetur/guide/formatting.html#vetur-formatter-config)。
