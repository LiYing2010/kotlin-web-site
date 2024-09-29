[//]: # (title: Kotlin plugin 的发布版本)

最终更新: %latestDocDate%
---

# Kotlin plugin 的发布版本

[IntelliJ Kotlin plugin](https://plugins.jetbrains.com/plugin/6954-kotlin) 和 [IntelliJ IDEA](https://www.jetbrains.com/idea/) 现在使用相同的发布周期.
为了加快新功能特性的测试和发布速度, plugin 和 IntelliJ IDEA 平台已经移动到了相同的代码库, 并且同时发布.
Kotlin 单独发布, 遵循 [新的发布周期](https://blog.jetbrains.com/kotlin/2020/10/new-release-cadence-for-kotlin-and-the-intellij-kotlin-plugin/).

Kotlin 和 Kotlin plugin 包含不同的功能特性:
* Kotlin 发布版本 包含语言, 编译器, 以及标准库的功能特性.
* Kotlin plugin 发布版本只会引入 IDE 相关的功能特性. 比如, 代码格式化工具, 以及代码调试工具.

这个变化也会影响 Kotlin plugin 的版本. 发布版本现在与同时发布的 IntelliJ IDEA 使用相同的版本.
关于新的发布周期, 详情请阅读这篇 [Blog](https://blog.jetbrains.com/kotlin/2020/10/new-release-cadence-for-kotlin-and-the-intellij-kotlin-plugin/).

## Kotlin plugin 2020.3

这个 plugin 发布版本引入以下功能特性:
* [新类型的 inline 重构](#new-types-of-inline-refactorings)
* [结构化的查找和替换](#structural-search-and-replace)
* [EditorConfig 支持](#editorconfig-support)
* [用于 Jetpack Compose for Desktop 的项目模板](#project-templates-for-jetpack-compose-for-desktop)

### 新类型的 inline 重构

从 Kotlin plugin 的 2020.3 版开始, 可以进行跨语言的转换.
对于在 Java 中定义的 Kotlin 元素, 现在也可以进行 inline 重构.

Kotlin plugin 可以对带有源代码的库中的代码进行内联(inline).
也就是说, 你可以对所有的 [Kotlin 作用域函数(scope function)](/docs/reference_zh/scope-functions.html) 进行 [inline 重构](https://www.jetbrains.com/help/idea/inline.html) :  _also_, _let_, _run_, _apply_, 和 _with_.

而且, 这个发布版还改进了对 Lambda 表达式的重构. 现在 IDE 能够更加彻底的分析 Lambda 表达式的语法, 并正确的进行格式化.

### 结构化的查找和替换

现在对于 Kotlin 可以进行 [结构化的查找和替换(Structural search and replace, SSR)](https://www.jetbrains.com/help/idea/structural-search-and-replace.html).
SSR 功能允许你查找并替换代码模式, 查找替换时会考虑源代码的语法和语义.

要开始使用这个功能, 请对你的 `.kt` 文件打开 **Structural Search** 对话框, 然后选择一个 [模板](https://www.jetbrains.com/help/idea/search-templates.html),
或者自己创建模板.

### EditorConfig 支持

从 2020.3 开始, Kotlin API 完全支持 [.editorconfig](https://editorconfig.org/) 文件, 这个文件用于 [在文件夹级别管理代码风格](https://www.jetbrains.com/help/idea/configuring-code-style.html#editorconfig).

### 用于 Jetpack Compose for Desktop 的的项目模板

在 Kotlin 项目向导中, 可以使用新的实验性的 Jetpack Compose for Desktop 模板.
你可以使用以下模板创建项目:
* **Desktop** – Compose 项目, 针对桌面 JVM 平台: Windows, Linux, 或 macOS.
* **Multiplatform** – 跨平台的 Compose 项目, 针对桌面 JVM 平台 (Windows, Linux, macOS) 以及 Android 平台, 在共通模块中共用代码.

![Kotlin 项目向导 – Jetpack Compose 项目]({{ url_for('asset', path='images/reference/whats-new/jetpack-compose.png') }})

要创建一个项目, 请在创建新项目时选择一个模板, 并指定 Gradle 构建系统. Kotlin plugin 会自动创建所有的配置文件.
你可以通过学习 [Compose for Desktop 入门教程](https://github.com/JetBrains/compose-jb/tree/master/tutorials/Getting_Started) 来试用这个实验性功能.

关于 Jetpack Compose 的功能特性, 更多详情请参见这篇 [Blog](https://blog.jetbrains.com/cross-post/jetpack-compose-for-desktop-milestone-1-released/),
并阅读 [Compose 应用程序示例](https://github.com/JetBrains/compose-jb/tree/master/examples).
