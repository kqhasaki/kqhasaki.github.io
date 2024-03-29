---
title: Vercel简介 静态博客部署
cover: https://tva1.sinaimg.cn/large/008i3skNgy1gynsyn8yyaj30qo0c0aap.jpg
date: 2022-01-23
---

[Vercel](https://vercel.com/docs) 是很多人强烈推荐的网站托管服务，提供远比 github page 强大的功能，并且还支持部署 serverless 接口。这意味着动态网站也可以通过 Vercel 进行部署，并且这些功能大多是免费的，对个人开发者极其友好！

另外，Vercel 的官方网站提供了非常详细的文档。Vercel 工具的核心思想是减少前端工程师的项目部署工作，符合目前流行的 serverless 思想。通过绑定特定项目的仓库，可以实现免费持续部署。

# 部署静态博客

首先需要到网站上注册一个账号，整体的注册体验非常方便。对于个人开发者，Vercel 的服务几乎完全免费，非常良心。

注册以后，打开文档，然后遵循官方的[get started](https://vercel.com/docs/get-started)的前三步就可以非常轻松地部署静态博客了。

## 新建项目

可以通过三种方式添加项目，`GitHub`，`GitLab`和`Bitbucket`，都可以部署一个已经有的代码仓库。

![](https://tva1.sinaimg.cn/large/008i3skNgy1gynwxyhtw5j317m0j4di9.jpg)

这里我们选择 GitHub 上的仓库。

![](https://tva1.sinaimg.cn/large/008i3skNgy1gynwz807zfj31qg0qktai.jpg)

在创建项目之后，就可以在 DashBoard 看到项目的详细信息了，在这里的 settings 里的 Git 选项可以修改代码仓库和用于发布生产的分支。

![](https://tva1.sinaimg.cn/large/008i3skNgy1gynx1p3ao4j318m0u0jts.jpg)

## 部署项目

部署前端项目非常容易，只需要执行对应的 npm 脚本即可，这里 Vercel 还会自动识别框架，非常人性化。

![](https://tva1.sinaimg.cn/large/008i3skNgy1gynx4pjyvij31430u0dii.jpg)

每次部署的记录都可以查看：

![](https://tva1.sinaimg.cn/large/008i3skNgy1gynx5zw8t4j31jw0u0diw.jpg)

部署成功后，可以预览静态网站了。

![](https://tva1.sinaimg.cn/large/008i3skNgy1gynx7ltohcj31ns06emxj.jpg)

# 域名绑定

Vercel 会自动生成一个 URL，当然我们一般都希望自己的网站使用自己的域名。这里我们可以在阿里云或者 GoDaddy 等域名提供商购买域名，然后在 vercel 中配置域名绑定即可。

![](https://tva1.sinaimg.cn/large/008i3skNgy1gynxg28gjcj31hj0u0whf.jpg)

之后再次预览，即可跳转到自己的域名了，非常简单！
