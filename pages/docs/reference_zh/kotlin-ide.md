---
type: doc
layout: reference
category:
title: "支持 Kotlin 开发的 IDE"
---

# 支持 Kotlin 开发的 IDE
[//]: # (description: JetBrains provides Kotlin plugin support for IntelliJ IDEA and Android Studio.)

最终更新: {{ site.data.releases.latestDocDate }}

JetBrains 为 2 种集成开发环境(IDE)提供了官方的 Kotlin plugin: [IntelliJ IDEA](#intellij-idea) 和 [Android Studio](#android-studio).

其他 IDE 和源代码编辑器, 比如 Eclipse, Visual Studio Code, 和 Atom, 也有 Kotlin 社区支持的 plugin.

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 是一个用于 JVM 语言的集成开发环境(IDE), 它致力于最大限度的提高开发者的生产效率.
它替你你完成日常重复的任务, 提供智能代码完成, 静态代码分析, 以及重构等功能, 让你的精力集中到软件开发的美好的一面,
不仅生产率高, 而且使用体验很愉快.

Kotlin plugin 包含在 IntelliJ IDEA 的每个发布版内.

关于 IntelliJ IDEA, 详情请参见 [官方文档](https://www.jetbrains.com/help/idea/discover-intellij-idea.html).

## Android Studio

[Android Studio](https://developer.android.com/studio) 是用于 Android App 开发的官方集成开发环境 (IDE), 它基于 [IntelliJ IDEA](https://www.jetbrains.com/idea/). 
在 IntelliJ 强大的代码编辑器和开发工具的基础之上, Android Studio 还提供了更多功能, 在 Android App 的开发过程中提高你的生产效率.

Kotlin plugin 包含在 Android Studio 的每个发布版内.

关于 Android Studio, 详情请参见 [官方文档](https://developer.android.com/studio/intro).

## 与 Kotlin 语言各版本的兼容性

对于 IntelliJ IDEA 和 Android Studio, Kotlin plugin 包含在 IDE 的各个发布版之内.
新的 Kotlin 版本发布之后, 这些 IDE 会自动建议更新 Kotlin 到最新的版本.
关于各个 IDE 支持的最新的语言版本, 请参见 [Kotlin 的发布版本](releases.html#ide-support)

## 对其他 IDE 的支持

JetBrains 没有为其他 IDE 提供 Kotlin plugin.
但是, 其他 IDE 和源代码编辑器, 比如 Eclipse, Visual Studio Code, 和 Atom, 也有它们自己的, 由 Kotlin 社区开发的 Kotlin plugin.

你可以使用任何文本编辑器来编写 Kotlin 代码, 但没有 IDE 相关的功能: 代码格式化, 调试工具, 等等.
要在文本编辑器中使用 Kotlin, 你可以从
Kotlin [GitHub 发布页面]({{ site.data.releases.latest.url }})
下载最新的 Kotlin 命令行编译器 (`kotlin-compiler-{{ site.data.releases.latest.version }}.zip`),
然后 [手动安装它](command-line.html#manual-install).
你也可以使用包管理器, 比如
[Homebrew](command-line.html#homebrew),
[SDKMAN!](command-line.html#sdkman),
以及 [Snap 包](command-line.html#snap-package).

## 下一步做什么?

* [使用 IntelliJ IDEA IDE 创建你的第一个项目](jvm/jvm-get-started.html)
* [使用 Android Studio 创建你的第一个跨平台移动应用程序](multiplatform-mobile/multiplatform-mobile-create-first-app.html)
* 学习如何 [安装 Kotlin plugin 的 EAP 版本](install-eap-plugin.html)
