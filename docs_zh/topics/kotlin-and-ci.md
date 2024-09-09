---
type: doc
layout: reference
category:
title: "使用 TeamCity 对 Kotlin 项目进行持续集成(Continuous Integration)"
---

# 使用 TeamCity 对 Kotlin 项目进行持续集成(Continuous Integration)

最终更新: {{ site.data.releases.latestDocDate }}

在本章中, 你将学习如何设置 [TeamCity](https://www.jetbrains.com/teamcity/) 来构建你的 Kotlin 项目.
关于 TeamCity 的基本知识和更多信息, 请参见 [官方文档](https://www.jetbrains.com/teamcity/documentation/),
其中包括如何安装, 基本配置, 等等.

Kotlin 可以使用不同的构建工具, 因此如果你在使用标准的构建工具, 比如 Ant, Maven 或 Gradle,
那么设置 Kotlin 项目的过程, 与这些工具集成的其他语言或库是相同的.
TeamCity 也支持 IntelliJ IDEA 的内置构建系统, 使用时存在少量的要求和配置不同.

## Gradle, Maven, 和 Ant

如果使用 Ant, Maven 或 Gradle, 设置过程很简单. 只需要定义构建步骤(Build Step).
比如, 如果使用 Gradle, 只需要直接定义需要的参数, 比如 Step Name, 以及对这个 Runner Type 需要执行的 Gradle tasks.

<img src="/assets/docs/images/kotlin-and-ci/teamcity-gradle.png" alt="Gradle Build Step" width="700"/>

由于 Kotlin 所有需要的依赖项都定义在 Gradle 文件中, 因此 Kotlin 不需要其他配置, 即可正确运行.

如果使用 Ant 或 Maven, 可以使用相同的配置. 唯一的区别是, Runner Type 应该是 Ant 或 Maven.

## IntelliJ IDEA 构建 System

如果在 TeamCity 中使用 IntelliJ IDEA 构建系统, 请确认 IntelliJ IDEA 使用的 Kotlin 的版本与 TeamCity 运行的版本相同.
你可能需要下载 Kotlin plugin 的特定版本, 并安装到 TeamCity.

幸运的是, 可以使用一个元运行器(meta-runner), 它能够完成大部分的手工工作.
如果不熟悉 TeamCity 元运行器(meta-runner) 的概念, 请参见 [文档](https://www.jetbrains.com/help/teamcity/working-with-meta-runner.html).
元运行器是非常简单而且强大方法, 可以引入自定义的运行器, 而不需要编写插件.

### 下载并安装元运行器(meta-runner)

针对 Kotlin 的元运行器可从 [GitHub](https://github.com/jonnyzzz/Kotlin.TeamCity) 找到.
请下载这个元运行器, 并从 TeamCity 用户界面导入它

<img src="/assets/docs/images/kotlin-and-ci/teamcity-metarunner.png" alt="元运行器" width="700"/>

### 设置 Kotlin 编译器的获取步骤

这个步骤基本上只包括定义 Step Name, 以及你需要的 Kotlin 版本. 可以使用 Tag.

<img src="/assets/docs/images/kotlin-and-ci/teamcity-setupkotlin.png" alt="设置 Kotlin 编译器" width="700"/>

运行器会根据 IntelliJ IDEA 项目的路径设置, 为属性 `system.path.macro.KOTLIN.BUNDLED` 设置正确的值.
但是, 这个值需要在 TeamCity 中定义 (并且可以设置为任意值).
因此, 你需要将它定义为一个系统变量.

### 设置 Kotlin 编译步骤

最终的步骤是定义项目的实际编译任务, 它使用标准的 IntelliJ IDEA Runner Type.

<img src="/assets/docs/images/kotlin-and-ci/teamcity-idearunner.png" alt="IntelliJ IDEA Runner" width="700"/>

这样, 我们的项目现在可以构建, 并能够产生对应的 artifact 了.

## 其他 CI 服务器

如果使用 TeamCity 以外的其他持续集成(Continuous Integration)工具, 只要它支持构建工具的任何一种,
或者调用命令行工具, 编译 Kotlin 并对一些工作进行自动化, 使其成为 CI 过程的一部分, 都应该是可以实现的.
