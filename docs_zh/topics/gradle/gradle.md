[//]: # (title: Gradle)

最终更新: %latestDocDate%

Gradle 是一个构建系统, 帮助你自动化并管理你的构建过程. 它会下载需要的依赖项, 打包你的代码, 并做好编译前的准备工作.
关于 Gradle 的基本概念与详细信息, 请参见 [Gradle 网站](https://docs.gradle.org/current/userguide/userguide.html).

通过 [这些使用说明](gradle-configure-project.md), 你可以对不同的平台设置你自己的项目,
或者可以学习一个小的 [step-by-step 教程](get-started-with-jvm-gradle-project.md),
它会演示如何使用 Kotlin 创建一个简单的 "Hello World" 后台应用程序.

> 关于 Kotlin, Gradle, 和 Android Gradle plugin 各版本的兼容性, 详情请参见 [这里](gradle-configure-project.md#apply-the-plugin).
>
{style="tip"}

在本章中, 你将会学习:
* [编译器选项, 以及如何传递编译器选项](gradle-compiler-options.md).
* [增量编译, 缓存, 构建报告, 以及 Kotlin Daemon](gradle-compilation-and-caches.md).
* [对 Gradle plugin 变体(variant)的支持](gradle-plugin-variants.md).

## 下一步做什么?

学习:
* **Gradle Kotlin DSL**.
  [Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html)
  是一种领域特定语言(Domain Specific Language), 你可以用它快速高效的编写构建脚本.
* **注解处理**.
  Kotlin 通过 [Kotlin 符号处理 API](ksp-reference.md) 支持注解处理.
* **生成文档**.
  要为 Kotlin 项目生成文档, 请使用 [Dokka](https://github.com/Kotlin/dokka);
  关于它的配置方法, 请参照 [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-gradle-plugin).
  Dokka 支持混合语言项目, 可以生成多种格式的输出文档, 包括标准的 Javadoc.
* **OSGi**.
  关于 OSGi 支持, 请参见 [Kotlin OSGi 文档](kotlin-osgi.md).
