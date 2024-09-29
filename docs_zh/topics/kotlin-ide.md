[//]: # (title: 支持 Kotlin 开发的 IDE)
[//]: # (description: JetBrains 为 IntelliJ IDEA, Fleet 和 Android Studio 提供了 Kotlin plugin . Eclipse 有社区支持的 Kotlin plugin.)

最终更新: %latestDocDate%

JetBrains 为 [IntelliJ IDEA](#intellij-idea), [JetBrains Fleet](#fleet), 和 [Android Studio](#android-studio)
提供了官方的 Kotlin plugin.

其他 IDE 和代码编辑器, 比如 [Eclipse](#eclipse), Visual Studio Code, 和 Atom, 也有 Kotlin 社区支持的 plugin.

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 是一个用于 JVM 语言的 IDE, 它致力于最大限度的提高开发者的生产效率.
它替你你完成日常重复的任务, 提供智能代码完成, 静态代码分析, 以及重构等功能, 让你的精力集中到软件开发的美好的一面,
不仅生产率高, 而且使用体验很愉快.

Kotlin plugin 包含在 IntelliJ IDEA 的每个发布版内.

关于 IntelliJ IDEA, 详情请参见 [官方文档](https://www.jetbrains.com/help/idea/discover-intellij-idea.html).

## Fleet

> JetBrains Fleet 目前是 Public Preview 状态, 可以自由使用.
>
{style="note"}

[JetBrains Fleet](https://www.jetbrains.com/fleet/) 是一个支持多种语言的 IDE 和代码编辑器, 为 Kotlin 提供高级支持,
对 Kotlin 开发者提供流畅的开发体验.
你可以使用 Fleet 作为代码编辑器, 以便快速修改代码,
也可以打开 Smart Mode, 将它变成一个功能完备的 IDE, 包含智能代码提示功能.

各个 Fleet 发布版都包含了 Kotlin plugin.

Fleet 也支持 Kotlin Multiplatform 项目, 目标平台包括 Android, iOS, 以及 Desktop 平台, 支持代码的测试和调试.
Fleet 的 Smart Mode 会选择适当的代码处理引擎, 并可以在 Kotlin Multiplatform 代码
和其他能与 Kotlin 互操作的语言编写的代码之间, 进行代码导航.

Fleet 的使用入门, 请参见教程 [使用 Fleet 进行跨平台开发](https://www.jetbrains.com/help/kotlin-multiplatform-dev/fleet.html).

## Android Studio

[Android Studio](https://developer.android.com/studio) 是用于 Android App 开发的官方 IDE,
它基于 [IntelliJ IDEA](https://www.jetbrains.com/idea/).
在 IntelliJ 强大的代码编辑器和开发工具的基础之上, Android Studio 还提供了更多功能, 在 Android App 的开发过程中提高你的生产效率.

Kotlin plugin 包含在 Android Studio 的每个发布版内.

关于 Android Studio, 详情请参见 [官方文档](https://developer.android.com/studio/intro).

## Eclipse

[Eclipse](https://eclipseide.org/release/) 是一个用于各种编程语言开发应用程序的 IDE, 包括 Kotlin.
Eclipse 也有 Kotlin plugin: 最初由 JetBrains 开发, 现在 Kotlin plugin 由 Kotlin 社区贡献者维护.

你可以 [从 Eclipse Marketplace 手动安装 Kotlin plugin](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse).

Kotlin 开发组管理 Kotlin plugin for Eclipse 的开发和贡献过程.
如果你想要贡献内容给这个 plugin, 请向
[Kotlin for Eclipse 的 GitHub 代码仓库](https://github.com/Kotlin/kotlin-eclipse)
提交 pull request.

## 与 Kotlin 语言各版本的兼容性

对于 IntelliJ IDEA, Fleet 和 Android Studio, Kotlin plugin 包含在 IDE 的各个发布版之内.
新的 Kotlin 版本发布之后, 这些 IDE 会自动建议更新 Kotlin 到最新的版本.
关于各个 IDE 支持的最新的语言版本, 请参见 [Kotlin 的发布版本](releases.md#ide-support).

## 对其他 IDE 的支持

JetBrains 没有为其他 IDE 提供 Kotlin plugin.
但是, 其他 IDE 和源代码编辑器, 比如 Eclipse, Visual Studio Code, 和 Atom,
也有它们自己的, 由 Kotlin 社区维护的 Kotlin plugin.

你可以使用任何文本编辑器来编写 Kotlin 代码, 但没有 IDE 相关的功能: 代码格式化, 调试工具, 等等.
要在文本编辑器中使用 Kotlin, 你可以从
Kotlin [GitHub 发布页面](%kotlinLatestUrl%)
下载最新的 Kotlin 命令行编译器 (`kotlin-compiler-%kotlinVersion%.zip`),
然后 [手动安装它](command-line.md#manual-install).
你也可以使用包管理器, 比如
[Homebrew](command-line.md#homebrew),
[SDKMAN!](command-line.md#sdkman),
以及 [Snap 包](command-line.md#snap-package).

## 下一步做什么?

* [使用 IntelliJ IDEA IDE 创建你的第一个项目](jvm-get-started.md)
* [使用 Fleet 创建 Multiplatform 项目](https://www.jetbrains.com/help/kotlin-multiplatform-dev/fleet.html)
* [使用 Android Studio 创建你的第一个跨平台移动应用程序](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
* 学习如何 [安装 Kotlin plugin 的 EAP 版本](install-eap-plugin.md)
