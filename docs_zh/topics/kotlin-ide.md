[//]: # (title: 支持 Kotlin 开发的 IDE)
[//]: # (description: JetBrains 为 IntelliJ IDEA 和 Android Studio 提供了官方的 Kotlin IDE 支持)

JetBrains 为以下 IDE 和代码编辑器提供官方的 Kotlin 支持:
[IntelliJ IDEA](#intellij-idea) 和 [Android Studio](#android-studio).

其他 IDE 和代码编辑器只有 Kotlin 社区支持的 plugin.

## IntelliJ IDEA {id="intellij-idea"}

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 是一个专用于 JVM 语言 (例如 Kotlin 和 Java)的 IDE, 它致力于最大限度的提高开发者的生产效率.
它为你完成日常重复的任务, 提供智能代码完成, 静态代码分析, 以及重构等功能.
让你的精力集中到软件开发的美好的一面, 不仅生产率高, 而且使用体验很愉快.

Kotlin plugin 包含在 IntelliJ IDEA 的每个发布版内.
IDEA 的每个发布版都会引入新的功能和更新, 改进 Kotlin 开发者在 IDE 中的使用体验.
关于针对 Kotlin 的最新更新和改进, 请参见 [IntelliJ IDEA 中的新功能](https://www.jetbrains.com/idea/whatsnew/) .

关于 IntelliJ IDEA, 详情请参见 [官方文档](https://www.jetbrains.com/help/idea/discover-intellij-idea.html).

## Android Studio {id="android-studio"}

[Android Studio](https://developer.android.com/studio) 是用于 Android App 开发的官方 IDE,
它基于 [IntelliJ IDEA](https://www.jetbrains.com/idea/).
在 IntelliJ 强大的代码编辑器和开发工具的基础之上, Android Studio 还提供了更多功能, 在 Android App 的开发过程中提高你的生产效率.

Kotlin plugin 包含在 Android Studio 的每个发布版内.

关于 Android Studio, 详情请参见 [官方文档](https://developer.android.com/studio/intro).

## Eclipse {id="eclipse"}

[Eclipse](https://eclipseide.org/release/) 帮助开发者使用各种编程语言编写应用程序, 包括 Kotlin.
它也有 Kotlin plugin: 最初由 JetBrains 开发, 现在 Kotlin plugin 由 Kotlin 社区贡献者维护.

你可以 [从 Marketplace 手动安装 Kotlin plugin](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse).

Kotlin 开发组管理 Kotlin plugin for Eclipse 的开发和贡献过程.
如果你想要贡献内容给这个 plugin, 请向它的 [GitHub 代码仓库](https://github.com/Kotlin/kotlin-eclipse) 提交 Pull Request.

## 与 Kotlin 语言各版本的兼容性 {id="compatibility-with-the-kotlin-language-versions"}

对于 IntelliJ IDEA 和 Android Studio, Kotlin plugin 包含在各个发布版之内.
新的 Kotlin 版本发布之后, 这些工具会自动建议更新 Kotlin 到最新的版本.
关于支持的最新语言版本, 请参见 [Kotlin 的发布版本](releases.md#ide-support).

## 对其他 IDE 的支持 {id="other-ides-support"}

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

## 下一步做什么? {id="what-s-next"}

* [使用 IntelliJ IDEA IDE 创建你的第一个项目](jvm-get-started.md)
* [使用 Android Studio 创建你的第一个跨平台移动应用程序](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
