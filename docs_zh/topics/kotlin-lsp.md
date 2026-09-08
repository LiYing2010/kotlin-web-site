[//]: # (title: Kotlin 语言服务器(Language Server))
<primary-label ref="alpha"/>

<web-summary>Kotlin 语言服务器(Language Server) 是 JetBrains 针对 Kotlin 的官方 LSP 实现, 支持 VS Code, 代码完成, 诊断, 格式化, 以及重构.</web-summary>

[Kotlin 语言服务器(Language Server)](https://github.com/Kotlin/kotlin-lsp) 是 JetBrains 针对 Kotlin 的官方
[语言服务器协议(Language Server Protocol, LSP)](https://microsoft.github.io/language-server-protocol/) 实现.

服务器基于 IntelliJ IDEA, IntelliJ IDEA Kotlin plugin, JetBrains AIR, 以及 Fleet.
设计目标是与支持 LSP 的所有代码编辑器共同工作.

> [IntelliJ IDEA](https://www.jetbrains.com/idea/) 和 [Android Studio](https://developer.android.com/studio)
> 提供了最好的 Kotlin 开发体验.
>
{style="note"}

## 在 Visual Studio Code 中使用 Kotlin {id="kotlin-in-visual-studio-code"}

Kotlin 语言服务器对 [Visual Studio Code](https://code.visualstudio.com/) 提供官方的 Kotlin 语言支持.

如果你使用 Visual Studio Code 进行 Kotlin 开发,
请从 Visual Studio Marketplace 安装官方的 [Kotlin by JetBrains](https://marketplace.visualstudio.com/items?itemName=JetBrains.kotlin-server) 扩展.

要激活 **Kotlin by JetBrains** 扩展, 请在 Visual Studio Code 中打开一个 Kotlin 项目, 然后打开任何 Kotlin 文件.

## 支持的功能特性 {id="supported-features"}

Kotlin 语言服务器包含核心的语言功能特性, 例如:

* 支持最新的 Kotlin 语言版本
* 基于 IntelliJ 的代码完成
* 基于 IntelliJ 的, 针对 Kotlin 和 `kotlinx.*` 库的诊断与快速修正功能
* 针对 JVM 项目的构建系统支持: Gradle, Maven, 以及试验性的 Android Gradle Plugin 支持

  > 对 Kotlin Multiplatform 项目的支持正在开发中.
  >
  {style=”tip”}

* 语法高亮
* 整理 import
* 重命名重构
* 代码格式化
* 文档导航与悬停支持
* 调用的层级结构
* 代码折叠

## 意见反馈 {id="feedback"}

Kotlin 语言服务器正在积极开发中, 在 Alpha 阶段, 您提供的反馈意见尤其宝贵.

如果你遇到任何问题, 或者希望提出改进意见, 请在 [Kotlin LSP repository](https://github.com/Kotlin/kotlin-lsp) 中提出报告.

## 下一步做什么? {id="what-s-next"}

* 浏览 [GitHub 上的 Kotlin 语言服务器代码仓库](https://github.com/Kotlin/kotlin-lsp)
