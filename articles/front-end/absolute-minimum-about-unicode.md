---
title: “关于Unicode和字符集，你至少应该了解这些”
date: 2022-05-07
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h1z5o20k5mj20fu09i0ue.jpg
---

> 本文翻译自 Joel Spolsky 的博文[The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets (No Excuses!)](https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/)
>
> PS：这个博主是个超级大牛，他是知名网站 Stack Overflow 的创始人，著名黑客，甚至还参加过以色列伞兵。。。

你是否曾好奇 HTTP 报文中`Content-Type`的作用？（当然它作为响应头告诉客户端实际返回内容的类型；在请求中，如 POST、PUT，告知服务器实际发送的数据类型）

你是否曾接受到来自保加利亚朋友的邮件，结果主题变成了“？？？？？？？”？

我曾惊异于这样一个发现：如此多的软件开发者完全不了解关于字符集、编码和 Unicode 的相关知识。