---
type: doc
layout: reference
category: "Introduction"
title: "在 JavaScript 开发中使用 Kotlin"
---

# Kotlin/JS 概述

Kotlin/JS 能够将你的 Kotlin 代码, Kotlin 标准库, 以及所有兼容的依赖项转换为 JavaScript.
Kotlin/JS 目前的实现针对 [ES5](https://www.ecma-international.org/ecma-262/5.1/) 标准.

推荐的方式是通过 `kotlin.js` 和 `kotlin.multiplatform` Gradle 插件来使用 Kotlin/JS.
这些插件提供一种集中而且便利的方式来配置和控制针对 JavaScript 的 Kotlin 项目.
其中包含了很多必要的功能, 比如控制你的应用程序的打包(Bundling), 通过 npm 直接添加 JavaScript 依赖项, 等等.
关于具体的选项, 详情请参见 [Kotlin/JS 项目设置](js-project-setup.html) documentation.

## Kotlin/JS 的一些使用场景

Kotlin/JS 的使用方式有很多. 下面是 Kotlin/JS 使用场景的一些例子.

* **使用 Kotlin/JS 编写前端(frontend) Web 应用程序**
    * 使用 Kotlin/JS, 你可以通过类型安全的方式 **使用强大的浏览器和 Web API**.
    创建, 修改文档对象模型(Document Object Model, DOM)中的元素, 与其进行交互, 使用 Kotlin 代码来控制 `canvas` 或 WebGL 组件的描绘,
    并可以使用现代浏览器支持的许多特性.
    * 使用 JetBrain 提供的 [`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers), 可以用 Kotlin/JS 编写 **完整, 类型安全的 React 应用程序**,
    React 是最流行的 JavaScript 框架之一, `kotlin-wrappers` 对它提供了方便的抽象和深度的集成.
    `kotlin-wrappers` 还支持一部分相关技术, 比如 `react-redux`, `react-router`, 以及 `styled-components`.
    与 JavaScript 生态系统的互操作性也就意味着你还可以使用第三方的 React 组件或组件库.
    * 或者, 也可以使用 **社区维护的 Kotlin/JS 框架** – 比如 [KVision](https://kvision.io) 和 [fritz2](https://www.fritz2.dev/),
    这些框架充分利用了 Kotlin 概念的优势, 比如它的表达能力和简洁性 .

* **使用 Kotlin/JS 编写服务器端(Server-side)以及无服务器(serverless)应用程序**
    * Kotlin/JS 提供的 Node.js 编译目标, 让你能够创建 **运行在服务器上** 或者 **在无服务器环境运行** 的应用程序.
    象其他运行在 JavaScript 环境的应用程序一样, 你可以享受到很多好处, 比如 **更快的启动速度** 以及 **内存消耗量减少**.
    使用 [`kotlinx-nodejs`](https://github.com/Kotlin/kotlinx-nodejs), 在你的 Kotlin 代码中, 你可以通过类型安全的方式直接访问 [Node.js API](https://nodejs.org/docs/latest/api/).

*  **使用 Kotlin [跨平台(multiplatform)](multiplatform.html) 项目, 与其他 Kotlin 编译目标共用代码**
    * 使用 Kotlin `multiplatform` Gradle 插件时, 可以使用 Kotlin/JS 的所有功能.
    * 如果你的后端也使用 Kotlin 开发, 那么可以与 Kotlin/JS 编写的前端 **共用代码**, 比如数据模型, 或校验逻辑,
    因此可以 **编写和维护全栈式(full-stack) Web 应用程序**.
    * 你还可以 **在你的 Web 应用程序和 Android 和 iOS App 之间共用业务逻辑**, 避免重复编写共通功能,
    比如对 REST API 的抽象, 用户验证, 以及业务模型.

* **创建 JavaScript 和 TypeScript 中使用的库**
    * 你不必使用 Kotlin/JS 编写整个应用程序, 另一种选择是可以 **通过你的 Kotlin 代码生成库**,
    这些库可以作为模块, 在 JavaScript 或 TypeScript 编写的任何代码中使用, 无论同时使用了其他什么样的框架和技术.
    通过这种 **创建混合应用程序** 的方法, 可以充分运用你和你的开发组在 Web 开发中已有的技术能力,
    帮助你 **减少重复工作**,
    使你的 Web 开发平台与你的应用程序的其他开发平台更容易保持一致.

当然, 以上只是列举的少量例子, 除此之外还有许多其他有利的方式来使用 Kotlin/JS.
我们希望你能以上各种方式组合起来试用, 寻找最适合你的项目的方式.

无论你具体的使用方式如何, Kotlin/JS 项目都可以使用兼容的 **来自 Kotlin 生态环境的库**, 以及 **来自 JavaScript 和 TypeScript 生态环境的第三方库**.
要在 Kotlin 代码中使用后一种库, 你可以自行编写类型安全的封装, 使用社区维护的封装,
也可以让 [Dukat](js-external-declarations-with-dukat.html) 为你自动生成 Kotlin 声明.
通过使用 Kotlin/JS 专有的 [动态类型](dynamic-type.html), 你可以解除 Kotlin 类型系统的严格限制,
因此不必为库创建繁琐的类型封装 - 代价是失去类型安全性.

Kotlin/JS 还兼容最常用的模块系统: UMD, CommonJS, 以及 AMD.
能够 [生成和使用模块](/docs/tutorials/javascript/working-with-modules/working-with-modules.html)
就意味着你可以通过结构化的方式, 与 JavaScript 生态系统交互.

## Kotlin/JS 的现在和未来

**想要了解 Kotlin/JS 的更多信息吗?**

下面的视频中, Kotlin 开发者 Advocate Sebastian Aigner 会向你解释 Kotlin/JS 的主要好处,
分享一些使用技巧和使用场景, 还会告诉你 Kotlin/JS 未来的开发计划, 以及即将开发的新功能.

<iframe width="560" height="315" src="https://www.youtube.com/embed/fZUL8_kgHXg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Kotlin/JS 开发入门

如果你是 Kotlin 新手, 那么建议你首先熟悉一下 Kotlin 语言的 [基本语法](basic-syntax.html).

要开始使用 Kotlin/JS, 请参见 [创建 Kotlin/JS 工程](js-project-setup.html),
或者阅读下一节的实践实验室(Hands-on lab).


## Kotlin/JS 实践实验室(Hands-on lab)

实践实验室(Hands-on lab) 是一种长篇的教程, 它针对某个专题, 引导你完成一个独立的项目, 帮助你学习一种技术.

教程中的示例项目可以用作你自己项目的开始模板, 而且包含了很多有用的代码片段和编程模式.

对于 Kotlin/JS, 目前的实践实验室包括:

* [使用 React 和 Kotlin/JS 创建 Web 应用程序](https://play.kotlinlang.org/hands-on/Building%20Web%20Applications%20with%20React%20and%20Kotlin%20JS/01_Introduction) 引导你使用 React 框架创建一个简单的 Web 应用程序, 演示如何使用一种面向 HTML 的类型安全的 Kotlin DSL, 便捷地创建相应式 DOM 元素, 还展示如何使用第三方 React 组件, 以及如何通过 API 获取信息, 整个应用程序逻辑全部使用纯 Kotlin/JS 代码编写.

* [使用 Kotlin 跨平台功能创建全栈 Web 应用程序](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/01_Introduction) 创建一个客户端-服务器端应用程序, 其中用到共通代码, 序列化, 以及其他跨平台范例, 想你讲授创建面向 Kotlin/JVM 和 Kotlin/JS 平台应用程序背后的概念.
它还简要介绍如何将 Ktor 用作服务器端框架和客户端框架.


## 新的 Kotlin/JS IR 编译器

[新的 Kotlin/JS IR 编译器](js-ir-compiler.html) (目前的稳定级别为 [Alpha](evolution/components-stability.html)) 与现在的默认编译器相比, 带来了许多改进.
比如, 它通过死代码消除, 改善了生成的可执行文件的尺寸, 而且 与 JavaScript 生态系统的交互变得更加.
通过从 Kotlin 代码生成 TypeScript 声明文件 (d.ts), 新编译器使得 “混合(hybrid)” 应用程序的开发更加容易,
这种应用程序可以混合 TypeScript 和 Kotlin 代码, 也可以使用 Kotlin 跨平台项目来共用代码.

关于新的 Kotlin/JS IR 编译器的功能, 以及如何在项目中使用, 更多详情请参见 [Kotlin/JS IR 编译器文档](js-ir-compiler.html).

## 加入 Kotlin/JS 开发者社区
你还可以加入官方 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 的 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道, 与开发者社区和开发团队交谈.
