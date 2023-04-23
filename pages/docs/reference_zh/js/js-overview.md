---
type: doc
layout: reference
category: "Introduction"
title: "使用 Kotlin 进行 JavaScript 开发"
---

# 使用 Kotlin 进行 JavaScript 开发

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin/JS 能够将你的 Kotlin 代码, Kotlin 标准库, 以及所有兼容的依赖项转换为 JavaScript.
Kotlin/JS 目前的实现针对 [ES5](https://www.ecma-international.org/ecma-262/5.1/) 标准.

推荐的方式是通过 `kotlin.js` 和 `kotlin.multiplatform` Gradle 插件来使用 Kotlin/JS.
这些插件可以帮助你便利的集中配置和控制针对 JavaScript 的 Kotlin 项目.
其中包含了很多必要的功能, 比如控制你的应用程序的打包(Bundling), 通过 npm 直接添加 JavaScript 依赖项, 等等.
关于具体的选项, 详情请参见 [Kotlin/JS 项目设置](js-project-setup.html).

## Kotlin/JS IR 编译器

[Kotlin/JS IR 编译器](js-ir-compiler.html) 与旧的默认编译器相比, 带来了许多改进.
比如, 它通过死代码消除, 改善了生成的可执行文件的尺寸,
而且与 JavaScript 生态系统的交互变得更加顺畅.

> 从 Kotlin 1.8.0 开始, 旧的编译器已被废弃.
{:.note}

通过从 Kotlin 代码生成 TypeScript 声明文件 (`d.ts`), IR 编译器使得 "混合(hybrid)" 应用程序的开发更加容易,
这种应用程序可以混合 TypeScript 和 Kotlin 代码, 也可以使用 Kotlin 跨平台项目来共用代码.

关于 Kotlin/JS IR 编译器的功能, 以及如何在项目中使用,
更多详情请参见 [Kotlin/JS IR 编译器文档](js-ir-compiler.html) 以及 [迁移向导](js-ir-migration.html).

## Kotlin/JS 使用场景

Kotlin/JS 的使用方式有很多.
下面是 Kotlin/JS 使用场景的一些例子:

* **使用 Kotlin/JS 编写前端(frontend) Web 应用程序**
    * 使用 Kotlin/JS, 你可以通过类型安全的方式 **使用强大的浏览器和 Web API**.
    创建, 修改文档对象模型(Document Object Model, DOM)中的元素, 与其进行交互,
    使用 Kotlin 代码来控制 `canvas` 或 WebGL 组件的描绘,
    并可以使用现代浏览器支持的许多特性.
    * 使用 JetBrain 提供的 [`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers),
    可以用 Kotlin/JS 编写 **完整, 类型安全的 React 应用程序**,
    `kotlin-wrappers` 对 React 和其它流行的 JavaScript 框架提供了方便的抽象和深度的集成.
    `kotlin-wrappers` 还支持一部分相关技术, 比如 `react-redux`, `react-router`, 以及 `styled-components`.
    与 JavaScript 生态系统的互操作性意味着你还可以使用第三方的 React 组件或组件库.
    * 使用 **[Kotlin/JS 框架](#kotlin-js-frameworks)**,
    这些框架充分利用了 Kotlin 的概念, 它的表达能力, 以及它的简洁性.

* **使用 Kotlin/JS 编写服务器端(Server-side)以及无服务器(serverless)应用程序**
    * Kotlin/JS 提供的 Node.js 编译目标, 让你能够创建 **运行在服务器上** 或者 **在无服务器环境运行** 的应用程序.
    你可以获得在 JavaScript 环境中运行的益处, 比如 **更快的启动速度** 以及 **内存消耗量减少**.
    使用 [`kotlinx-nodejs`](https://github.com/Kotlin/kotlinx-nodejs),
    在你的 Kotlin 代码中, 你可以通过类型安全的方式直接访问 [Node.js API](https://nodejs.org/docs/latest/api/).

*  **使用 Kotlin [跨平台(multiplatform)](../multiplatform/multiplatform.html) 项目, 与其他 Kotlin 编译目标共用代码**
    * 使用 Kotlin `multiplatform` Gradle 插件时, 可以使用 Kotlin/JS 的所有功能.
    * 如果你的后端也使用 Kotlin 开发, 那么可以与 Kotlin/JS 编写的前端 **共用代码**, 比如数据模型, 或校验逻辑,
    因此可以 **编写和维护全栈式(full-stack) Web 应用程序**.
    * 你还可以 **在你的 Web 应用程序和 Android 和 iOS App 之间共用业务逻辑**, 避免重复编写共通功能,
    比如对 REST API 的抽象, 用户验证, 以及业务模型.

* **创建 JavaScript 和 TypeScript 中使用的库**
    * 你不必使用 Kotlin/JS 编写整个应用程序, 另一种选择是可以 **通过你的 Kotlin 代码生成库**,
    这些库可以作为模块, 在 JavaScript 或 TypeScript 编写的任何代码中使用, 无论同时使用了其他什么样的框架和技术.
    通过这种 **创建混合应用程序** 的方法, 可以充分运用你和你的开发组在 Web 开发中已有的技术能力,
    帮助你 **减少重复工作**, 使你的 Web 开发平台与你的应用程序的其他开发平台更容易保持一致.

当然, 以上只是列举的少量例子, 除此之外还有许多其他有利的方式来使用 Kotlin/JS.
我们希望你能试用各种不同方式的组合, 寻找最适合你的项目的方式.

无论你具体的使用方式如何, Kotlin/JS 项目都可以使用兼容的 **来自 Kotlin 生态环境的库**, 以及 **来自 JavaScript 和 TypeScript 生态环境的第三方库**.
要在 Kotlin 代码中使用后一种库, 你可以自行编写类型安全的封装, 使用社区维护的封装,
也可以让 [Dukat](js-external-declarations-with-dukat.html) 为你自动生成 Kotlin 声明.
通过使用 Kotlin/JS 专有的 [动态类型](dynamic-type.html), 你可以解除 Kotlin 类型系统的严格限制,
因此不必为库创建繁琐的类型封装, 但代价是失去类型安全性.

Kotlin/JS 还兼容最常用的模块系统: UMD, CommonJS, 以及 AMD.
能够 [生成和使用模块](js-modules.html)
就意味着你可以通过结构化的方式, 与 JavaScript 生态系统交互.

## Kotlin/JS 框架

现代的 Web 开发通过使用各种框架得到很大的益处, 框架可以简化 Web 应用程序的创建.
下面是可用于 Kotlin/JS 的一些流行的 Web 框架的例子:

### KVision

_KVision_ 是一个面向对象的 Web 框架, 可以使用 Kotlin/JS 编写应用程序, 可以通过各种现成的组件来组合成你的用户界面.
你可以使用响应式(reactive)或命令式(imperative)编程模式来创建你的前端,
然后使用 connector for Ktor, Spring Boot, 以及其他框架, 与你的服务端应用程序连接,
并使用 [Kotlin 跨平台程序](../multiplatform/multiplatform.html) 来共用代码.

请 [访问 KVision 网站](https://kvision.io), 查看 KVision 的文档, 教程, 和示例.

关于框架的更新和讨论, 请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 的
[#kvision](https://kotlinlang.slack.com/messages/kvision)
和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道.

### fritz2

_fritz2_ 是一个独立的框架, 用于构建响应式(reactive) Web 用户界面.
它提供了自己的类型安全的 DSL 来构建和渲染 HTML 元素, 它使用 Kotlin 的协程(Coroutine)和数据流(Flow)来表达 UI 组件及其数据绑定.
它提供了状态管理, 校验, 路由, 以及很多其他功能, 并与 Kotlin 跨平台项目集成.

请 [访问 fritz2 网站](https://www.fritz2.dev), 查看 fritz2 的文档, 教程, 和示例.

关于框架的更新和讨论, 请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 的
[#fritz2](https://kotlinlang.slack.com/messages/fritz2)
和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道.

### Doodle

_Doodle_ 是一个用于 Kotlin/JS 的基于矢量的(vector-based) UI 框架.
Doodle 应用程序使用浏览器的图形功能来描绘用户界面, 而不是依赖于 DOM, CSS, 和 Javascript.
使用这种方法, Doodle 使你能够精确描绘任何 UI 元素, 矢量图形, 梯度(gradient), 以及定制的可视化图形.

请 [访问 Doodle 网站](https://nacular.github.io/doodle/), 查看 Doodle 的文档, 教程, 和示例.

关于框架的更新和讨论, 请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 的
[#doodle](https://kotlinlang.slack.com/messages/doodle)
和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道.

### Compose for Web

_Compose for Web_, 是 Compose Multiplatform 的一部分, 使你能在浏览器内使用 [Google 的 Jetpack Compose UI toolkit](https://developer.android.com/jetpack/compose).
它可以帮助你使用 Jetpack Compose 的概念来构建响应式(reactive) Web 用户界面.
它提供了 DOM API 来描述你的网站, 以及一些跨平台的布局管理功能(目前还是实验性功能).
Compose for Web 还允许你将一部分 UI 代码和业务逻辑代码在 Android, 桌面, 以及 Web 端共用.

关于 Compose Multiplatform 的更多信息, 请参见 [启动页面](https://www.jetbrains.com/lp/compose-mpp/).

请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 的
[#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) 频道, 参与 Compose for Web 的讨论,
或加入 [#compose](https://kotlinlang.slack.com/archives/CJLTWPH7S) 频道, 参与 Compose Multiplatform 的讨论.

## Kotlin/JS 的现在和未来

在[这个视频](https://www.youtube.com/watch?v=fZUL8_kgHXg)中,
Kotlin 开发者 Advocate Sebastian Aigner 会向你解释 Kotlin/JS 的主要好处,
分享一些使用技巧和使用场景, 还会告诉你 Kotlin/JS 未来的开发计划, 以及即将开发的新功能.

<iframe width="560" height="315" src="https://www.youtube.com/embed/fZUL8_kgHXg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Kotlin/JS 开发入门

如果你是 Kotlin 新手, 那么建议你首先熟悉一下 Kotlin 语言的 [基本语法](../basic-syntax.html).

要开始使用 Kotlin/JS, 请参见 [创建 Kotlin/JS 工程](js-project-setup.html),
你也可以完成一个 [教程](#tutorials-for-kotlin-js),
或者学习 [Kotlin/JS 示例项目](#sample-projects-for-kotlin-js).
其中包含了很多有用的代码片段和模式, 可以用作你自己项目的很好的起点.


### Kotlin/JS 教程

* [教程 - 使用 React 和 Kotlin/JS 创建 Web 应用程序](js-react.html)
引导你使用 React 框架创建一个简单的 Web 应用程序, 演示如何使用一种面向 HTML 的类型安全的 Kotlin DSL,
便捷地创建相应式 DOM 元素, 还展示如何使用第三方 React 组件, 以及如何通过 API 获取信息,
整个应用程序逻辑全部使用纯 Kotlin/JS 代码编写.

* [使用 Kotlin Multiplatform 构建一个全栈 Web 应用程序](../multiplatform/multiplatform-full-stack-app.html)
创建一个客户端-服务器端应用程序, 其中用到共通代码, 序列化, 以及其他跨平台范例,
向你讲授创建面向 Kotlin/JVM 和 Kotlin/JS 平台应用程序背后的概念.
它还简要介绍如何将 Ktor 用作服务器端框架和客户端框架.


### Kotlin/JS 示例项目

* [Spring 全栈项目: 协作工作的待办事项列表(to-do list)](https://github.com/Kotlin/full-stack-spring-collaborative-todo-list-sample)
介绍在 JS 和 JVM 目标平台上如何使用 `kotlin-multiplatform` 创建一个用于协作工作的待办事项列表(to-do list),
后端开发使用 Spring, Kotlin/JS 和 React 用于前端开发和 RSocket.
* [Kotlin/JS 与 React Redux 开发的待办事项列表(to-do list)](https://github.com/Kotlin/react-redux-js-ir-todo-list-sample)
实现 React Redux 的待办事项列表(to-do list),
演示如何使用 npm 的 JS 库(`react`, `react-dom`, `react-router`, `redux`, 以及 `react-redux`), 使用 Webpack 进行打包, 最小化, 并运行项目.
* [全栈的演示项目](https://github.com/Kotlin/full-stack-web-jetbrains-night-sample)
指导你如何构建一个应用程序, 接受用户生成的贴文和评论.
项目中的所有的数据都由 fakeJSON 和 JSON Placeholder 服务提供.

## 加入 Kotlin/JS 开发者社区

你还可以加入官方 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
的 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道, 与开发者社区和开发团队交谈.
