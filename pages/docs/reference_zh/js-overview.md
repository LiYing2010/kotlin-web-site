---
type: doc
layout: reference
category: "Introduction"
title: "在 JavaScript 开发中使用 Kotlin"
---

# Kotlin JavaScript 概述

Kotlin 提供了在 JavaScript 平台上运行的能力. 实现方法是将 Kotlin 代码转换为 JavaScript. 目前的实现针对 ECMAScript 5.1 标准, 但我们计划最终实现 ECMAScript 2015 标准.

当你选择编译目标为 JavaScript 时, 所有的 Kotlin 代码, 包括你的工程内的代码, 以及 Kotlin 自带的标准库的代码, 全部都会转换为 JavaScript.
但是不包括 JDK, 以及你使用到的任何 JVM, 或其他 Java 框架, 或其他库. Kotlin 代码之外的一切文件都会在编译期间被忽略掉.

Kotlin 编译器在编译时会尝试实现以下目标:

* 保证编译输出的 JavaScript 代码在尺寸方面最优化
* 保证编译输出的 JavaScript 代码是易读的
* 实现与现有的模块系统(module system)的互操作性
* 无论是编译到 JavaScript 还是JVM, (最大限度地)保证标准库的功能等同.

## 如何使用

在以下场景中, 你可能会希望将 Kotlin 代码编译为 JavaScript:

* 编写 Kotlin 代码, 用于客户端 JavaScript

    * **与 DOM 元素交互**. Kotlin 提供了一系列静态类型的接口, 可以与文档对象模型(Document Object Model)进行交互, 可以用来创建或修改 DOM 元素.

    * **与图形交互, 比如 WebGL**. 你可以编写 Kotlin 代码, 在 Web 页面中使用 WebGL 来创建图形元素 .

* 编写 Kotlin 代码, 用于服务器端 JavaScript

    * **使用服务器端技术**. 你可以使用 Kotlin 来与服务器端 JavaScript 交互, 比如 Node.js

Kotlin 可以与既有的第三方库和框架共同工作, 比如 jQuery 或 React. 要使用强类型 API 的第三方框架, 你可以使用 [dukat](https://github.com/kotlin/dukat) 工具, 将 [Definitely Typed](http://definitelytyped.org/) 类型定义库中的 TypeScript 定义转换为 Kotlin. 或者, 你也可以使用 [动态类型(Dynamic Type)](dynamic-type.html) 功能来访问任何没有强类型的框架.

Kotlin 兼容于 CommonJS, AMD 以及 UMD, 因此可以直接[与不同的模块系统交互](/docs/tutorials/javascript/working-with-modules/working-with-modules.html).


## Kotlin/JS 开发入门

关于如何使用 Kotlin 进行 JavaScript 开发, 请参见 [创建 Kotlin/JS 工程](js-project-setup.html).


## Kotlin/JS 实践实验室(Hands-on lab)

实践实验室(Hands-on lab) 是一种长篇的教程, 它针对某个专题, 引导你完成一个独立的项目, 帮助你学习一种技术.

教程中的示例项目可以用作你自己项目的开始模板, 而且包含了很多有用的代码片段和编程模式.

对于 Kotlin/JS, 目前的实践实验室包括:

* [使用 React 和 Kotlin/JS 创建 Web 应用程序](https://play.kotlinlang.org/hands-on/Building%20Web%20Applications%20with%20React%20and%20Kotlin%20JS/01_Introduction) 引导你使用 React 框架创建一个简单的 Web 应用程序, 演示如何使用一种面向 HTML 的类型安全的 Kotlin DSL, 便捷地创建相应式 DOM 元素, 还展示如何使用第三方 React 组件, 以及如何通过 API 获取信息, 整个应用程序逻辑全部使用纯 Kotlin/JS 代码编写.

* [使用 Kotlin 跨平台功能创建全栈 Web 应用程序](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/01_Introduction) 创建一个客户端-服务器端应用程序, 其中用到共通代码, 序列化, 以及其他跨平台范例, 想你讲授创建面向 Kotlin/JVM 和 Kotlin/JS 平台应用程序背后的概念.
它还简要介绍如何将 Ktor 用作服务器端框架和客户端框架.


## 加入 Kotlin/JS 开发者社区
你还可以加入官方 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 的 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道, 与开发者社区和开发团队交谈.
