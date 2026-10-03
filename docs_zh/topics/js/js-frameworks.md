[//]: # (title: Kotlin/JS 框架)

要利用现有的 Kotlin/JavaScript 框架来简化 Web 开发.
这些框架提供了可以直接使用的组件, 路由, 状态管理, 以及用于构建现代 Web 应用程序的其他工具.

以下是社区提供的一些 Kotlin/JS Web 框架:

## Kobweb {id="kobweb"}

[Kobweb](https://kobweb.varabyte.com/) 是一个 Kotlin 框架, 用于使用 [Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html) 创建网站和 Web 应用程序.
它支持实时重载(Live Reloading), 以便快速开发. 受 [Next.js](https://nextjs.org/) 的启发, Kobweb 推广了一种标准结构, 用于添加 Widget, 布局和页面.

Kobweb 提供了很多开箱即用的功能, 包括页面路由, 亮色/暗色(Light/Dark) 模式, CSS 样式, Markdown 支持, 后端 API, 等等.
它还包含 [Silk](https://silk-ui.netlify.app/), 一个拥有一系列多功能 Widget 的 UI 库, 用于构建现代 UI.

Kobweb 还支持站点导出, 通过生成页面快照来支持 SEO 和自动搜索索引. 此外, 它能够创建基于 DOM 的 UI, 能够根据状态变化高效地更新.

更多详情和示例, 请参见 [Kobweb 文档](https://kobweb.varabyte.com/docs/getting-started/what-is-kobweb).

关于框架的更新和讨论, 请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的
[#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8)
和 [#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) 频道.

## Kilua {id="kilua"}

[Kilua](https://kilua.dev/) 是一个可组合(Composable)的 Web 框架, 基于 [Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime) 构建,
与 [compose-html](https://github.com/JetBrains/compose-multiplatform#compose-html) 库类似.
与 compose-html 不同的是, Kilua 同时支持 Kotlin/Wasm 和 Kotlin/JS 编译目标.

Kilua 提供了一个模块化的 API, 用于创建声明式 UI 组件, 并管理其状态.
它还包含一组立即可用的组件, 适用于 Web 应用程序的常见使用场景.

Kilua 是 [KVision](https://kvision.io) 框架的继承者.
Kilua 的设计目的是, 让 Compose 用户 (`@Composable` 函数, 状态管理, 协程/Flow 集成) 和 KVision 用户 (基于组件的 API, 可以对 UI 组件进行一些命令式交互) 都很熟悉.

更多详情和示例, 请参见 [Kilua 文档](https://kilua.dev/introduction).

关于框架的更新和讨论, 请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的
[#kilua](https://kotlinlang.slack.com/archives/C06UAH52PA7) 频道.

## Summon {id="summon"}

[Summon](https://summon.yousef.codes/) 是一个 Kotlin Multiplatform 前端框架, 用于构建跨 JVM, Kotlin/JS, 和 Kotlin/Wasm 平台的高性能应用程序.
它支持基于组件的 UI 开发, 对具备 HTML 流式传输的服务器端渲染 (Server-Side Rendering, SSR)提供一级支持,
还支持修饰符驱动的样式设计, 能够编译为简洁的 CSS.

Summon 还专注于支持无障碍访问功能和高级行为的运行期感知组件, 同时保持一个跨平台的统一代码库.

更多详情和示例, 请参见 [Summon 文档](https://summon.yousef.codes/docs).

## Kinetica {id="kinetica"}

[Kinetica](https://kinetica.heapy.io/) 是一个 Kotlin UI 框架, 专注于 Web 应用程序的实际成效:
通过服务器端渲染实现快速的首页加载, SEO 友好的 HTML 输出, 以及页面加载完成后平滑过渡到交互式客户端 UI.
它还支持无头测试(headless test), 帮助开发团队快速可靠的测试 UI 行为, 而不必依赖于完整的浏览器环境.

Kinetica 的开箱即用功能包括路由, 表单, 以及持久化模块, 帮助开发团队更快速的交付常见的应用程序功能.
它的更新模型只产生最小的 DOM 变更, 有助于在状态变更时保持交互的响应速度,
同时, 它的一致性响应式模型设计旨在减少大型应用程序中的意外行为.

更多详情和示例, 请参见 [Kinetica 文档](https://kinetica.heapy.io/docs/getting-started).

## Kotlin React {id="kotlin-react"}

[React](https://react.dev/) 是一个基于组件的库, 广泛用于 Web 和原生用户界面.
它提供了庞大的组件生态系统, 丰富的学习资料, 以及活跃的社区.

[Kotlin React](https://github.com/JetBrains/kotlin-wrappers/blob/e874e48396217cbe4d4f3b706ee4e4441724a6ba/docs/guide/react.md) 是 React 的 Kotlin 封装库,
将 React 生态系统与 Kotlin 的类型安全性和表达能力结合在一起.

关于库的更新和讨论, 请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的
[#react](https://kotlinlang.slack.com/messages/react)
和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道.

## KVision {id="kvision"}

[KVision](https://kvision.io) 是一个面向对象的 Web 框架, 通过可直接使用的 UI 组件构建 Kotlin/JS 应用程序.
这些组件可以作为你的应用程序 UI 的构建模块.

使用这个框架, 你可以使用响应式和命令式两种编程模型来构建前端.
还可以通过 Ktor, Spring Boot 以及其他框架的连接器, 将前端与后端应用程序集成.
此外, 你可以使用 [Kotlin Multiplatform](get-started.topic) 共用代码.

更多详情, 教程和示例, 请参见 [KVision 文档](https://kvision.gitbook.io/kvision-guide).

关于框架的更新和讨论, 请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的
[#kvision](https://kotlinlang.slack.com/messages/kvision)
和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道.

## fritz2 {id="fritz2"}

[fritz2](https://www.fritz2.dev) 是一个独立的框架, 用于构建响应式 Web 用户界面.
它提供了自己的类型安全 DSL, 用于构建和渲染 HTML 元素, 并使用 Kotlin 的协程和 Flow 来定义组件及其数据绑定.

fritz2 提供了很多开箱即用的功能, 包括状态管理, 校验, 路由, 等等.
它还可以与 Kotlin Multiplatform 项目集成.

更多详情, 教程和示例, 请参见 [fritz2 文档](https://www.fritz2.dev/docs/).

关于框架的更新和讨论, 请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的
[#fritz2](https://kotlinlang.slack.com/messages/fritz2)
和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道.

## Doodle {id="doodle"}

[Doodle](https://nacular.github.io/doodle/) 是一个基于矢量的 Kotlin/JS UI 框架.
Doodle 应用程序使用浏览器的图形能力来绘制用户界面, 而不依赖于 DOM, CSS 或 JavaScript.
这种方式让你能够控制任意 UI 元素, 矢量图形, 渐变和自定义可视化的渲染.

更多详情, 教程和示例, 请参见 [Doodle 文档](https://nacular.github.io/doodle/docs/introduction/).

关于框架的更新和讨论, 请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的
[#doodle](https://kotlinlang.slack.com/messages/doodle)
和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道.
