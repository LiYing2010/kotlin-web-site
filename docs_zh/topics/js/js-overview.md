[//]: # (title: Kotlin/JavaScript)

Kotlin/JavaScript (Kotlin/JS) 能够将你的 Kotlin 代码, Kotlin 标准库, 以及所有兼容的依赖项转译为 JavaScript.
这样, 你的 Kotlin 应用程序就能够在任何支持 JavaScript 的环境中运行.

通过 [Kotlin Multiplatform Gradle plugin](multiplatform-dsl-reference.md) (`kotlin.multiplatform`),
可以集中的配置和管理针对 JavaScript 的 Kotlin 项目.

Kotlin Multiplatform Gradle plugin 提供的功能包括: 控制应用程序的打包(Bundling),
以及直接从 npm 添加 JavaScript 依赖项.
关于可用配置选项的概述, 请参见 [设置 Kotlin/JS 项目](js-project-setup.md).

> Kotlin/JS 目前的实现针对 [ES5](https://www.ecma-international.org/ecma-262/5.1/)
> 和 [ES2015](https://262.ecma-international.org/6.0/) 标准.
>
{style="tip"}

## Kotlin/JS 的使用场景 {id="use-cases-for-kotlin-js"}

以下是 Kotlin/JS 的一些常见使用方式:

* **在前端和 JVM 后端之间共用通用逻辑**

  如果你的后端使用 Kotlin 或其他 JVM 兼容语言编写,
  你可以在 Web 应用程序和后端之间共用通用代码.
  包括数据传输对象(DTO), 验证和认证规则, REST API 端点(Endpoint)的抽象等等.

* **在 Android, iOS 和 Web 客户端之间共用通用逻辑**

  你可以在 Web 界面与 Android, iOS 移动应用程序之间共用业务逻辑,
  同时在各个平台保持原生的用户界面. 这样可以避免重复实现共同的功能,
  例如 REST API 抽象, 用户认证, 表单验证, 以及领域模型等等.

* **使用 Kotlin/JS 构建前端 Web 应用程序**

  使用 Kotlin 开发传统的 Web 前端, 同时与现有的工具和库集成:

  * 如果你熟悉 Android 开发, 可以使用基于 Compose 的框架构建 Web 应用程序,
    例如 [Kobweb](https://kobweb.varabyte.com/) 或 [Kilua](https://kilua.dev/).
  * 使用 JetBrains 提供的 [对常用 JavaScript 库的 Kotlin 封装](https://github.com/JetBrains/kotlin-wrappers),
    用 Kotlin/JS 构建完全类型安全的 React 应用程序.
    Kotlin 封装 (`kotlin-wrappers`) 提供了对 React 和其他 JavaScript 框架的抽象和集成.

    这些封装还支持补充库, 例如
    [React Redux](https://react-redux.js.org/), [React Router](https://reactrouter.com/),
    以及 [styled-components](https://styled-components.com/).
    你还可以通过与 JavaScript 生态系统的互操作能力, 使用第三方 React 组件和组件库.

  * 使用 [Kotlin/JS 框架](js-frameworks.md),
    这些框架与 Kotlin 生态系统集成, 支持简洁而富有表达力的代码.

* **构建支持旧版浏览器的跨平台应用程序**

  使用 Compose Multiplatform, 你可以用 Kotlin 构建应用程序, 并在 Web 项目中复用移动端和桌面端的用户界面.
  虽然 [Kotlin/Wasm](wasm-overview.md) 是这一目的的主要目标平台,
  但你也可以同时面向 Kotlin/JS 目标平台, 扩展对旧版浏览器的支持.

* **使用 Kotlin/JS 构建服务端和无服务器应用程序**

  Kotlin/JS 中的 Node.js 目标平台, 让你能够在 JavaScript 运行环境创建服务端或无服务器环境的应用程序.
  这个功能提供了快速启动和低内存占用的优点.
  [`kotlinx-nodejs`](https://github.com/Kotlin/kotlinx-nodejs) 库
  提供了从 Kotlin 对 [Node.js API](https://nodejs.org/docs/latest/api/) 的类型安全的访问能力.

根据你的使用场景, Kotlin/JS 项目可以使用来自 Kotlin 生态系统的兼容库,
以及来自 JavaScript 和 TypeScript 生态系统的第三方库.

要在 Kotlin 代码中使用第三方库, 你可以创建自己的类型安全封装, 或使用社区维护的封装.
此外, 你也可以使用 Kotlin/JS [动态类型](dynamic-type.md),
它允许你跳过严格类型检查和库封装, 但代价是失去了类型安全性.

Kotlin/JS 还兼容于最常用的模块系统:
[ESM](https://tc39.es/ecma262/#sec-modules),
[CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules),
[UMD](https://github.com/umdjs/umd),
以及 [AMD](https://github.com/amdjs/amdjs-api).
这个功能让你能够 [生成和使用模块](js-modules.md), 并以有结构化的方式与 JavaScript 生态系统集成.

### 分享你的使用场景 {id="share-your-use-cases"}

[Kotlin/JS 的使用场景](#use-cases-for-kotlin-js) 中列举的并不是所有情况.
欢迎尝试不同的方案, 找到最适合你项目的方法.

请在 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 的
[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道,
与 Kotlin/JS 开发社区分享你的使用场景, 经验, 以及问题.

## Kotlin/JS 入门 {id="get-started-with-kotlin-js"}

探索 Kotlin/JS 的基础知识和初始步骤:

* 如果你是 Kotlin 新手, 请先阅读 [基本语法](basic-syntax.md), 并探索 [Kotlin 观光之旅](kotlin-tour-welcome.md).
* 查看 [Kotlin/JS 示例项目](#sample-projects-for-kotlin-js) 列表, 获取灵感.
  这些示例包含了有用的代码片段和模式, 可以帮助你启动你的项目.
* 如果你是 Kotlin/JS 新手, 请从 [设置向导](js-project-setup.md) 开始, 然后再探索更高级的主题.

想要尝试 Kotlin/JS 吗?

<a href="js-get-started.md"><img src="js-get-started-button.svg" width="500" alt="Get started with Kotlin/JS" style="block"/></a>

## Kotlin/JS 示例项目 {id="sample-projects-for-kotlin-js"}

下表列出了一组示例项目, 演示 Kotlin/JS 的各种使用场景, 架构, 以及代码共用策略:

| 项目                                                                                                                   | 说明                                                                                                                                                                                                                                      |
|----------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Petclinic, 在 Spring 和 Angular 之间共用通用代码](https://github.com/Kotlin/kmp-spring-petclinic/#readme)                     | 演示如何通过共用数据传输对象, 验证和认证规则, 以及 REST API 端点(Endpoint)的抽象, 避免在企业级应用程序中的代码重复. 代码在 [Spring Boot](https://spring.io/projects/spring-boot) 后端和 [Angular](https://angular.dev/) 前端之间共用.                                                           |
| [Fullstack Conference CMS](https://github.com/Kotlin/kmp-fullstack-conference-cms/#readme)                           | 展示了多种代码共用方式, 从最简单的到完全共用, 涵盖 [Ktor](https://ktor.io/), [Jetpack Compose](https://developer.android.com/compose) 和 [Vue.js](https://vuejs.org/) 应用程序之间的代码共用.                                                                              |
| [基于 Compose-HTML 的 Kobweb 框架的待办事项应用程序](https://github.com/varabyte/kobweb-templates/tree/main/examples/todo/#readme) | 演示如何以 Android 开发者熟悉的方案, 创建待办事项列表应用程序. 它使用 [Kobweb 框架](https://kobweb.varabyte.com/) 构建客户端 UI 应用程序.                                                                                                                                      |
| [Android, iOS 和 Web 之间的简单逻辑共用](https://github.com/Kotlin/kmp-logic-sharing-simple-example/#readme)                   | 包含一个模板, 用于构建项目, 其中包含 Kotlin 编写的通用逻辑, 这些通用逻辑可在 Android ([Jetpack Compose](https://developer.android.com/compose)), iOS ([SwiftUI](https://developer.apple.com/tutorials/swiftui/)) 和 Web ([React](https://react.dev/)) 的平台原生 UI 应用程序中使用. |
| [全栈协作的待办事项列表](https://github.com/kotlin-hands-on/jvm-js-fullstack/#readme)                                           | 演示如何使用 Kotlin Multiplatform 的 JS 和 JVM 目标平台, 创建用于协作工作的待办事项列表应用程序. 后端使用 [Ktor](https://ktor.io/), 前端使用 Kotlin/JS 和 React.                                                                                                                |

## Kotlin/JS 框架 {id="kotlin-js-frameworks"}

Kotlin/JS 框架提供直接可用的组件, 路由, 状态管理, 以及其他工具, 简化了现代化 Web 应用程序的开发.

[查看不同作者编写的 Kotlin/JS 可用框架](js-frameworks.md).

## 加入 Kotlin/JS 开发社区 {id="join-the-kotlin-js-community"}

你可以加入官方 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
的 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道,
与社区和 Kotlin/JS 开发团队交流.

## 下一步 {id="whats-next"}

* [设置 Kotlin/JS 项目](js-project-setup.md)
* [运行 Kotlin/JS 项目](running-kotlin-js.md)
* [调试 Kotlin/JS 代码](js-debugging.md)
* [在 Kotlin/JS 中运行测试](js-running-tests.md)
