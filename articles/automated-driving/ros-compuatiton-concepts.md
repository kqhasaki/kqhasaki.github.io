---
title: ROS基本概念
date: 2022-09-14
cover: https://tva1.sinaimg.cn/large/e6c9d24egy1h668udz54aj20xc0ir0us.jpg
---

ROS 通信中有以下最基本的概念：

- **ROS 节点（node）**：一些使用 ROS API 的进程。

- **ROS master**：一个用来将 ROS 节点连接起来的中间程序。

- **ROS parameter server**： 这个程序通常和 ROS master 一起启动。用户可以在这个服务器上存放多个参数，其他节点可以访问到这个参数。当然，参数可以配置访问权限。

- **ROS topic**：一个具名的通信总线，ROS 节点可以通过它发布消息或者订阅消息。

- **ROS message**：通过 ROS topic 传递的消息。ROS 定义了一系列由原始数据类型组成的标准消息，用户也可以自定义消息。

- **ROS service**：ROS topic 是一种发布/订阅机制实现节点间通信的手段。ROS 也支持 request/reply 模式的通信，这种机制就是 ROS 服务。ROS 服务是一个回调函数，每当客户节点向服务器节点发送请求时被调用。

- **ROS bag**：ROS 数据包文件。是一种非常有用的存储和回放 ROS topic 的机制。很适用于将机器人数据记录下来便于后期处理。
