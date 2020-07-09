---
type: doc
layout: reference
category: "概述"
title: "在服务器端开发中使用 Kotlin"
---

# 在服务器端开发中使用 Kotlin

Kotlin 非常适合于开发服务器端应用程序, 使用 Kotlin 可以编写出简洁高效的代码, 同时又可以完全兼容既有的 Java 技术栈(Java-based technology stacks), 而且其学习曲线比较平滑:

 * **表达能力**: Kotlin 拥有许多创造性的语言特性, 比如它支持 [类型安全的构建器(type-safe builder)](type-safe-builders.html)
   以及 [委托属性(delegated property)](delegated-properties.html), 可以帮助你构造出强大而且易用的抽象层.
 * **伸缩性**: Kotlin 对 [协程(coroutine)](coroutines.html) 的支持可以帮助你构建出性能强大的服务器端应用程序, 能够为巨量用户提供服务, 但只要求很低的硬件配置.
 * **互操作性**: Kotlin 完全兼容于所有基于 Java 的框架(framework), 因此你既可以享受一个更加现代的语言带来的利益, 同时又可以继续使用你熟悉的技术栈.
 * **可移植性**: 对于大规模的 Java 代码库, Kotlin 语言支持平滑地, 逐步的迁移. 你可以只使用 Kotlin 来编写新代码, 同时对系统中既有的部分继续沿用旧的 Java 代码.
 * **开发工具**: 除了 IDE 的支持之外, 在 IntelliJ IDEA Ultimate 的插件中, Kotlin 还提供了针对特定框架(比如, Spring)的开发工具支持.
 * **学习曲线**: 对于 Java 开发者, Kotlin 是非常易于学习的. Kotlin 插件中包含了 Java 代码到 Kotlin 代码的自动转换器, 可以帮助你完成最初的工作.
 [Kotlin Koans](/docs/tutorials/koans.html) 中有一系列的交互式练习题, 可以指导你学习 Kotlin 语言的关键特性.

## Kotlin 服务器端开发的一些相关框架

 * [Spring](https://spring.io) 从 5.0 版本开始, 使用 Kotlin 的语言特性实现了 [更加简洁的 API](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0) . [在线工程生成器](https://start.spring.io/#!language=kotlin) 可以帮助你使用 Kotlin 语言快速生成新的工程.

 * [Vert.x](http://vertx.io), 一个创建基于 JVM 的交互式 Web 应用程序的框架, 对 Kotlin 提供了 [专门支持](https://github.com/vert-x3/vertx-lang-kotlin), 包含 [完整的文档](http://vertx.io/docs/vertx-core/kotlin/).

 * [Ktor](https://github.com/kotlin/ktor) 是 JetBrains 公司开发的框架, 用 Kotlin 来开发 Web 应用程序, 使用协程(coroutine)实现了高度伸缩性, 并提供了易用而且符合习惯的 API.

 * [kotlinx.html](https://github.com/kotlin/kotlinx.html) 是一种 DSL, 可用于在 Web 应用程序中构建 HTML. 可用来替代传统的模板系统, 比如 JSP 和FreeMarker.

 * [Micronaut](https://micronaut.io/) 是一个现代化的, 基于 JVM 的全栈框架, 用于创建模块化的, 便于测试的微服务(microservice)或无服务(serverless)应用程序.
 它带有很多内建的, 便利的功能.

 * [Javalin](https://javalin.io) 是一个用于 Kotlin 和 Java的, 非常轻量的 web 框架, 支持 WebSockets, HTTP2 以及异步请求.

 * 关于数据的持久化存储, 可以选择直接的 JDBC 访问, 或者使用 JPA, 或者通过 Java 驱动程序使用 NoSQL 数据库. 对于 JPA, [kotlin-jpa 编译器插件](compiler-plugins.html#jpa-support) 可以使 Kotlin 编译的 class文件符合 JPA 框架的要求.

## 发布 Kotlin 服务器端应用程序

Kotlin 应用程序可以发布到任何支持 Java Web 应用程序的主机上, 包括 Amazon Web Services, Google Cloud Platform 以及其他等等.

要在 [Heroku](https://www.heroku.com) 上发布 Kotlin 应用程序, 你可以参照 [Heroku 官方教程](https://devcenter.heroku.com/articles/getting-started-with-kotlin).

AWS Labs 提供了一个 [示例工程](https://github.com/awslabs/serverless-photo-recognition) , 演示如何使用 Kotlin 来编写 [AWS Lambda](https://aws.amazon.com/lambda/) 函数.

Google 云平台也提供了一系列教程, 演示如何将 Kotlin 应用程序发布到 Google 云平台上, 包括 [在 Google App Engine 上运行 Kotlin Ktor 应用程序](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8) 和 [在 Google App Engine 上运行 Kotlin Spring 应用程序](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8). 此外还有一篇 [向导式代码文档](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin) 介绍如何发布 Kotlin Spring 应用程序.

## 使用 Kotlin 进行服务端开发的使用者

[Corda](https://www.corda.net/) 是一个开源的分布式帐务平台, 受各大主要银行支持, 完全使用 Kotlin 语言开发.

[JetBrains Account](https://account.jetbrains.com/), 这个系统负责 JetBrains 公司所有的许可证销售和验证过程, 系统 100% 使用 Kotlin 编写, 自 2015 年起运行在生产环境中, 未发生任何严重问题.


## 下一步

* [使用 Http Servlet 创建 Web 应用程序](/docs/tutorials/httpservlets.html) 以及 [使用 Spring Boot 创建 REST Web Service](/docs/tutorials/spring-boot-restful.html) 教程将向你演示如何使用 Kotlin 来创建并运行小型 Web 应用程序.
* 关于对 Kotlin 语言的更加深入介绍, 请参加本站的 [参考文档](index.html) , 以及 [Kotlin Koans](/docs/tutorials/koans.html).
* Micronaut 也提供了很多非常详细的 [向导文档](https://guides.micronaut.io/tags/kotlin.html), 解释如何使用 Kotlin 创建微服务(microservice).
