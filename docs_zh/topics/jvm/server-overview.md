[//]: # (title: 使用 Kotlin 进行后端开发)

<web-summary>使用 Kotlin, Spring, Ktor 以及其它后端框架构建服务器应用程序</web-summary>

Kotlin 非常适合于开发服务器端应用程序. 使用 Kotlin 可以编写简洁高效的代码, 同时又可以完全兼容既有的 Java 技术栈.

## 入门 {id="get-started"}

Kotlin 支持大规模代码库从 Java 到 Kotlin 的逐步迁移.
你可以使用 Kotlin 编写测试, 或新的产品代码, 同时保持项目的其他部分继续使用 Java.

配置你的 Java 项目来使用 Kotlin, 并使用 IntelliJ IDEA 中包含的 Java 到 Kotlin 自动转换器:

<a href="mixing-java-kotlin-intellij.md"><img src="backend-get-started-button.svg" alt="在你的 Java 项目中引入 Kotlin" style="block"/></a>

## 探索框架 {id="explore-frameworks"}

Kotlin 完全兼容于所有基于 Java 的框架, 因此你可以继续使用熟悉的技术栈, 同时享受 Kotlin 语法带来的好处.
除了出色的 IDE 支持外, Kotlin 还提供针对特定框架的工具, 
例如在 IntelliJ IDEA Ultimate 订阅版中对 Spring 和 Ktor 的支持.

### Spring {id="spring"}

[Spring](https://spring.io) 利用 Kotlin 的语言特性, 提供了更加简洁的 API.
[在线项目生成器](https://start.spring.io/#!language=kotlin) 可以帮助你快速生成新的 Kotlin 项目.

<a href="jvm-get-started-spring-boot.md"><img src="spring-get-started-button.svg" alt="Spring Boot 和 Kotlin 入门" style="block"/></a>

### Ktor {id="ktor"}

[Ktor](https://github.com/kotlin/ktor) 是 JetBrains 公司开发的框架, 使用 Kotlin 创建 Web 应用程序.
它使用协程(Coroutine)实现高度伸缩性, 并提供易用而且符合惯用法的 API.

<a href="https://ktor.io/docs/server-create-a-new-project.html"><img src="ktor-get-started-button.svg" alt="创建新的 Ktor 项目" style="block"/></a>

### 其他框架 {id="other-frameworks"}

以下是其他一些 Kotlin 后端框架的示例:

| 框架                                                     | 描述                                                                                                                                                                                                                                                                                                                                                                  |
|--------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Quarkus](https://quarkus.io/guides/kotlin)            | 一个开源框架, 对 Kotlin 提供一级支持. Quarkus 是为 Kubernetes 全新构建的, 利用数百种精选的库, 提供了一个整合的全栈框架.                                                                                                                                                                                                                                                                                      |
| [Vert.x](https://vertx.io)                             | 一个用于在 JVM 上构建反应式(Reactive) Web 应用程序的框架. Vert.x 对 Kotlin 提供了 [专门支持](https://github.com/vert-x3/vertx-lang-kotlin), 包括 [与 Kotlin 协程的集成](https://vertx.io/docs/vertx-lang-kotlin-coroutines/kotlin/).                                                                                                                                                                  |
| [kotlinx.html](https://github.com/kotlin/kotlinx.html) | 一种 DSL, 可用于在 Web 应用程序中构建 HTML. 可用来替代传统的模板系统(例如 JSP 和 FreeMarker).                                                                                                                                                                                                                                                                                                   |
| [Micronaut](https://micronaut.io/)                     | 一个现代化的, 基于 JVM 的全栈框架, 用于构建模块化的, 易于测试的微服务(Microservice)和无服务(Serverless)应用程序. 可以观看网络研讨会 [使用 Kotlin 和 Micronaut 开发微服务](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/), 并阅读详细的 [向导](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html), 了解如何在 Micronaut 框架中使用 [Kotlin 扩展函数](extensions.md#extension-functions). |
| [http4k](https://http4k.org/)                          | 一个尺寸很小的工具包, 用于 Kotlin HTTP 应用程序, 使用纯 Kotlin 编写. http4k 提供了 [命令行工具箱](https://toolbox.http4k.org) 来生成完整的项目模板, 以及基于 Web 的 [项目向导](https://toolbox.http4k.org/project), 可以使用选定的后端, 模块和构建工具, 启动一个可运行的 http4k 应用程序.                                                                                                                                                        |
| [Javalin](https://javalin.io)                          | 一个非常轻量的 Web 框架, 用于 Kotlin 和 Java, 支持 WebSocket, HTTP2 以及异步请求.                                                                                                                                                                                                                                                                                                       |

## 发布你的应用程序 {id="deploy-your-applications"}

Kotlin 应用程序可以发布到任何支持 Java Web 应用程序的主机上, 包括 Amazon Web Services (AWS),
Google Cloud Platform (GCP), 以及其他许多服务.

* **AWS** 提供了专用的 [Kotlin SDK](https://docs.aws.amazon.com/sdk-for-kotlin/latest/developer-guide/home.html)
  来与它的服务交互. 对于无服务(Serverless)部署, 可以参考 [适用于 Kotlin 的 AWS Lambda 代码示例](https://docs.aws.amazon.com/sdk-for-kotlin/latest/developer-guide/kotlin_lambda_code_examples.html).
* **Ktor** 允许你将 Kotlin 应用程序发布到各种云服务提供商. 例如, 你可以按照 Ktor 教程,
  学习如何部署到 [Google App Engine](https://ktor.io/docs/google-app-engine.html) 和其他服务.
* **Spring** 应用程序也兼容大多数流行的云服务提供商.
  关于如何将 Spring Boot 应用程序部署到云端, 请参见 [Spring 官方文档](https://docs.spring.io/spring-boot/how-to/deployment/cloud.html).

## 下一步 {id="next-steps"}

* [学习如何使用 Kotlin 和 JUnit 测试你的 Java Maven 项目](jvm-test-using-junit.md)
* [探索如何使用 Ktor 构建异步的服务器应用程序](https://ktor.io/docs/server-create-a-new-project.html)
