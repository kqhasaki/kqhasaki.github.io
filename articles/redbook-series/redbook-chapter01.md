---
title: （一）什么是JavaScript？
date: 2022-05-09
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h0xvyadkw4j20jz0iqdhq.jpg
---

《JavaScript 高级程序设计》，也就是前端 er 们常说的红宝书，已经出到了第四版了。相比第三版，内容充实了非常多，把 ES6 和更新的 JS 改动都介绍得很好，是前端工程师打基础的必读书籍。我在阅读本书的过程中发现了书中存在一些错误，或是翻译错误、或是原文就有错，也或是已经过时的知识点；于是有了这个抄书系列，实际上就是把每个涉及重要知识点的章节摘抄一遍，同时纠正一些细节上的错误。对于部分有歧义的地方，我也会进行标注。

> 笔者注：JavaScript 并不是我最早接触的编程语言，前端也不是我最早接触的技术领域。和许多人一样，我最早接触编程语言是大学时学习的 C 语言，也接触过汇编语言，读研期间，我常用 Python 进行数据分析和处理，甚至用 Django 完成了我的第一个网站。但是让我彻底喜欢上编程，并且决心以此为职业，是在我接触了 JavaScript 之后。前端开发这件事和 JavaScript 语言本身都让我觉得编程是一件美妙、快乐和充满成就感的事情。
>
> 但是不得不说的是，JavaScript 诞生很久以来一直是一门 DSL（Domain Specific Lanugage），而不是一门通用的编程语言。再加上最初语言草案的仓促和很久以来 Web 开发的随意性，导致了很多人对 JavaScript 和前端开发有些刻板印象。认为 JavaScript 并非真正的编程语言，前端开发者也不能算是严肃的程序员。但是随着 Web 技术的进步、Node.js 等可以直运行于操作系统上的运行时出现以及 JavaScript 自身语言规范的一次次修订，如今的 JavaScript 已经是一门通用的、强大的编程语言了。不仅在开源领域大放异彩，在企业开发中也已经不可或缺。
>
> 如今，掌握 JavaScript 已经是一门有趣、充满挑战，并且能够带来回报的事！

<iframe width="560" height="315" src="https://www.youtube.com/embed/uVwtVBpw7RQ" title="什么是Node.js" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

本书的第一章有一句话让我印象很深：

> 它很简单，学会只要几分钟；它又很复杂，掌握它需要很多年。

这句话对有学习 JavaScript 经历的人来说，觉得很是贴切。确实，和书中所说一样“要真正学好用好 JavaScript，理解其本质、历史和局限性是非常重要的”。

# JavaScript 的诞生

<iframe width="560" height="315" src="https://www.youtube.com/embed/80wh_-7c4TU" title="浏览器之战（上）" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

红宝书第一章内容简要介绍了 JavaScript 的历史以及其现状。最初的问题便是——为什么要有 JavaScript？要了解一个新事物的意义，那么需看没有这个事物之前的状况。在 JavaScript 出现之前，万维网已经在 1991 年首次亮相公共服务，1993 年万维网更是向世界上任何人免费开放。最早的网页浏览器也已经出现，很多著名网站也开始活跃。当时网络浏览器的主要功能仅仅是接受 HTML 文档并展示，而用户已经可以在网页中进行输入来和服务器进行交互。由于网页没有自己的脚本语言，因此所有的数据检查都必须返回到服务器端来进行。在那个年代，网络的时延让人们非常不耐烦，因此催生出在客户端处理某些数据验证的迫切需求。

1994 年，Mosaic 的主要开发人员创立了网景（Netscape）公司，推出了 Netscape Navigator 浏览器，很快占领了绝大部分市场。网景公司也预感到需要一种胶水语言，丰富浏览器的能力。

1995 年，布兰登·艾克（Brendan Eich）进入网景公司，他希望把 Scheme 语言嵌入到 Netscape Navigator 浏览器中。但是在更早之前，网景公司已经和 Sun 公司合作在其浏览器中支持 Java，于是在公司内部产生了激烈争论。最终公司决定发明一种和 Java 搭配使用的辅助语言脚本并且在语法上有类似。为了能够尽快在公司争论中给出提案，艾克需要给出一个可以运作的原型，于是他在 1995 年 5 月份仅仅花了 10 天就设计出来了。最初，这门语言被命名为 Mocha，1995 年 9 月在浏览器的 2.0 Beta 版本中改名为 LiveScript。就在当年的 12 月，浏览器的 2.0 Beta3 版本中命名为 JavaScript。实际上为了赶上发布时间，当时的网景公司和 Sun 公司组成了开发者联盟，因此为了蹭上 Java 编程语言“热词”，因此在发布前给它取了这个名字。然而这门语言和 Java 编程语言可说是风马牛不相及，日后 JavaScript 这个名字引起了大众的诸多误解。

1995 年 3 月正式发布的 Netscape Navigator 上的 JavaScript1.0 收获了很大成功，同年微软就在 IE 浏览器上发布了一个实现。微软的实现（JScript，这个名字是为了避免和网景发生许可纠纷）意味着出现了两个版本的 JavaScript。此时 JavaScript 没有规范其语法或特性的标准，业界开始担忧起语言的未来。于是在 1997 年 JavaScript1.1 被网景公司提交给 ECMA（欧洲计算机制造商协会，European Computer Manufacturers Association）制定为标准，称为 ECMAScript。希望能够发展为一门“通用的、跨平台、厂商中立的脚本语言”。自此以后，ISO 也将 ECMAScript 采纳为标准，自此以后各个浏览器都将 ECMAScript 标准作为自己实现 JavaScript 实现的依据。

<iframe width="560" height="315" src="https://www.youtube.com/embed/vFAlh4ws3m0" title="浏览器之战（下）" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# ECMAScript

ECMAScript 仅仅规定了 JavaScript 作为一门语言的定义和规范，并没有对浏览器提供的宿主环境和如何使用 JavaScript 和文档元素作交互这两方面作出规定。要让一个浏览器完整实现对 JavaScript 的支持，仅仅实现 ECMAScript 的标准还不够。实际上，浏览器的一个完整 JavaScript 应该包括三个部分：

- 语言核心（ECMAScript）
- 文档对象模型（DOM）：提供与网页内容交互的接口
- 浏览器对象模型（BOM）：提供与浏览器交互的接口

ECMAScript 定义的语言并不局限于 Web 浏览器，并且没有定义输入和输出之类的方法。它仅在基本的层面描述了语言的下面部分：语法、类型、语句、关键字、保留字、操作符、全局对象。

Web 浏览器只是 ECMAScript 实现可能的一种宿主环境。ECMAScript 的基准实现和与环境的交互必须的扩展都要由宿主环境提供。例如规定的全局变量都需要与平台无关（因此 JavaScript1.1 和 1.2 都不符合 ECMAScript 标准要求）。扩展（例如 DOM）使用 ECMAScript 核心类型和语法，提供特定于环境的额外功能。在服务器端，我们可以使用 Node.js 作为实现 JavaScript 的宿主环境（当然它不提供 DOM 和 BOM）。

为了适应 JavaScript 不断发展，ECMAScript 标准也在逐年变化，为了让浏览器厂商能够共同实现这些更新的特性。ECMAScript 第 1 版实际上与网景的 JavaScript1.1 大同小异，仅是删除了所有浏览器特定的代码，并有少量细微修改；ECMAScript 第 2 版仅是做了一些编校工作，主要是为了更新之后严格符合 ISO 的要求，没有对特性作出更变；ECMAScript 第 3 版第一次真正更新了这个标准，更新了字符串处理、错误定义和数值输出。此外还增加了对正则表达式、新的控制语句、try/catch 异常处理的支持，以及为了更好地让标准国际化做了少量修改。自此，可以说 ECMAScript 真正成为了一门编程语言而存在了；原计划发布的 ECMAScript 第 4 版是对这门语言一次彻底的修订。为了满足这门语言的未来发展，Ecma T39 进行了大刀阔斧的改革，几乎在第 3 版上基础上完全定义了一门新语言。甚至包括了强类型变量、新语句、新数据结构、真正的类等等。与此同时，TC39 的一个子委员会也提出了一份 ECMAScript 3.1 提案。只对这门语言进行了较少的改动，他们认为第 4 版对于这门语言来说改动过于跳跃，最终第 4 版在正式发布之前被放弃；而 ECMAScript 3.1 变成了 ECMAScript 第 5 版，于 2009 年 12 月正式发布。第 5 版理清了第 3 版存在的一些歧义，添加了包括原生的解析和序列化 JSON 数据的`JSON`对象、方便继承和高级属性定义的方法，以及新的增强 ECMAScript 引擎解释和执行代码能力的的严格模式；

到了 2015 年，ECMAScript 终于迎来了有史以来真正意义上的大改动，包含了最重要的一批增强特性。第 6 版，也称为 ES6，正式支持了类、模块、迭代器、生成器、箭头函数、期约、反射、代理和众多新数据类型，这一次改动大大强化了 ECMAScript 语言的表达能力，开发者们甚至开始习惯将之后的版本统称为 ES6。

ECMAScript 第 7 版于 2016 年 6 月发布，仅包含了少量语法层面的增强；例如`Array.prototype.includes`和指数操作符；ECMAScript 第 8 版于 2017 年更新，这一版增加了异步函数、`SharedArrayBuffer`及 Atomics API，在`Object`对象上添加了更多方法，添加了字符串填充方法，另外明确支持了对象字面量最后的逗号；ECMAScript 第 9 版与 2018 年更新，添加了异步迭代、剩余和扩展属性、一组新的正则表达式特性、`Promise.prototype.finally()`，以及模版字面量修订。

# DOM

浏览器中实现的 JavaScript 还需要包括文档对象模型（DOM），它提供了操作文档元素的统一标准。DOM 将整个页面抽象为一组分层节点。通过 DOM 可以将 HTML 文档表示为一组分层节点，DOM 通过创建表示文档的树，让开发者可以随意控制文档的内容和结构。使用 DOM API，可以轻松地删除、添加、替换、修改节点。

DOM 对于 JavaScript 来说是必须的。最早微软和网景的浏览器支持不同形式的动态 HTML（DHTML），使得开发者可以不刷新页面就修改页面的外观和内容。这代表了 Web 技术的一个巨大进步，但是同时人们担心微软和网景采用不同思路开发 DHTML，会导致 Web 失去其跨平台的特性。为了防止浏览器厂商各行其是，导致 Web 开发发生分裂。就在这时，万维网联盟（W3C）开始制定 DOM 标准的进程。

1998 年 10 月，DOM Level1 成为 W3C 的推荐标准。这个规范由两个模块组成：DOM Core 和 DOM HTML。前者提供了一种映射 XML 文档，从而方便访问和操作文档任意部分的方式；后者扩展了前者，并增加了特定于 HTML 的对象和方法。

> DOM 标准是无关语言的，它对其他语言也可提供 API，并且确实也有很多其他语言实现了；但是对于 Web 浏览器来说，DOM 就是用 JavaScript 实现的。

DOM Level1 的目标是映射文档结构，而 DOM Level2 的目标宽泛很多。这个对最初 DOM 的扩展增加了对鼠标和用户界面事件、范围、遍历（迭代 DOM 节点的方法）的支持，而且通过对象接口支持了层叠样式表（CSS）。主要来说 DOM Level2 新增了下面的模块，以支持新的接口。

- DOM 视图：描述追踪文档不同视图的接口
- DOM 事件：描述事件及事件处理的接口
- DOM 样式：描述处理元素 CSS 样式的接口
- DOM 遍历和范围：描述遍历和操作 DOM 树的接口

DOM Level3 又进一步扩展了 DOM。目前 W3C 已经不再按照 Level 来维护 DOM 了，现维护标准称为 DOM Living Standard。支持 DOM 是浏览器厂商的重中之重，现在绝大多数浏览器都已经支持了 DOM 核心部分。

# BOM

自 IE3 和 Netscape Navigator3 就提供了浏览器对象模型（BOM）API，用于支持访问和操作浏览器的窗口。使用 BOM，开发者就可以通过 JavaScript 来操作浏览器显示文档以外的部分。而 BOM 是唯一一个没有标准的 JavaScript 实现。但是现在由于 HTML5 的出现，之前很多与 BOM 有关的问题都迎刃而解了。

人们希望 BOM 能够提供任何特定于浏览器的 API，例如：

- 控制浏览器窗口的能力
- navigator 对象，能够提供关于浏览器的详尽信息
- location 对象，能够提供浏览器加载页面的详尽信息
- screen 对象，能够提供关于用户屏幕分辨率的详尽信息
- performance 对象，能够提供浏览器的内存占用、导航行为和时间统计的详尽信息
- 对 cookie 的支持
- 其他自定义对象，如 XHR，Fetch 等

在很长的时间内，BOM 没有对应的标准，所以每个浏览器都实现自己的 BOM。但是在各个厂商的版本迭代中，逐渐形成了一些共识，现在又有了 HTML5，BOM 的实现细节应该会逐渐一致。

# 小结

上一个短视频吧：

<iframe width="560" height="315" src="https://www.youtube.com/embed/DHjqpvDnNGE" title="100秒了解JavaScript" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

另外，随着 JavaScript 日渐运用于企业开发和大型项目，对类型系统的呼声也越来越高。[TypeScript](https://www.typescriptlang.org/)就是一门由微软推出的 JavaScript 语言扩展，引入了强大的类型系统，能够有效提升大型项目的开发效率和可维护性。

<iframe width="560" height="315" src="https://www.youtube.com/embed/zQnBQ4tB3ZA" title="100秒了解TypeScript" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
