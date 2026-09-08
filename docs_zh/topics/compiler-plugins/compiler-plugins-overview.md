[//]: # (title: 编译器 Plugin)

<snippet id="compiler-plugin-description">
在代码被编译时, 编译器 Plugin 会挂接到编译过程中, 对代码进行分析或修改, 而不需要修改编译器本身.
例如, 它们可以对代码添加注解, 或生成新的代码, 使代码与其他框架或 API 兼容.
</snippet>

本章介绍可供你使用的 Kotlin 编译器 Plugin , 以及在没有合适的 Plugin 时你可以采取什么措施.

Kotlin 团队维护以下编译器 Plugin:

| Plugin                                                                                         | 描述                                                                                                |
|------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| [All-open](all-open-plugin.md)                                                                 | 自动将添加了注解的类及其成员设置为 `open`, 使框架能够在运行时对它们进行扩展.                                                       |
| [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)                                         | 将原子操作转换为高效的, 特定于平台的实现, 以支持无锁并发.                                                                   |
| [DataFrame](https://kotlin.github.io/dataframe/compiler-plugin.html)                           | 生成类型化的 API, 让你能够以安全的, Kotlin 友好的方式使用 [`DataFrame`](https://kotlin.github.io/dataframe/home.html). |
| [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)           | 生成应用程序二进制接口(Application Binary Interface, ABI) JAR 文件.                                            |
| [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects) | 将 Kotlin 类暴露为普通的 JavaScript 对象, 改善与 JS 工具和库的互操作性.                                                 |
| [kapt](kapt.md)                                                                                | 在 Kotlin 代码上运行 Java 注解处理器, 并生成额外的源文件.                                                             |
| [Lombok](lombok.md)                                                                            | 使 Kotlin 代码能够理解和使用 Java 源代码中 Lombok 注解生成的代码.                                                      |
| [`no-arg`](no-arg-plugin.md)                                                                   | 为添加了注解的类生成无参数的构造器, 以支持需要无参数的构造器的框架.                                                               |
| [Power-assert](power-assert.md)                                                                | 显示表达式中每个部分的详细值, 来增强断言失败时的错误信息.                                                                    |
| [SAM with receiver](sam-with-receiver-plugin.md)                                               | 允许 SAM 接口使用带有接收者的 Lambda 表达式, 以实现更符合 DSL 风格的语法.                                                   |
| [Serialization](serialization.md)                                                              | 生成代码, 不需要使用反射即可对 Kotlin 对象进行序列化和反序列化.                                                             |

Google 的 Android 团队维护:

| Plugin                                                                                      | 描述                                                     |
|---------------------------------------------------------------------------------------------|--------------------------------------------------------|
| [Compose compiler Gradle plugin](https://developer.android.com/develop/ui/compose/compiler) | 将 Compose 编译器与 Gradle 集成, 以启用声明式 UI 功能和 Compose 特有的优化. |
| [Parcelize plugin](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize) | 自动生成 `Parcelable` 实现, 让你能够在 Android 组件之间传递 Kotlin 对象.  |

如果你需要以某种方式调整编译过程, 而这些 Plugin 无法实现, 请首先检查是否可以使用
[Kotlin 符号处理 (Kotlin Symbol Processing, KSP) API](ksp-overview.md), 或外部 linter, 例如 [Android lint](https://developer.android.com/studio/write/lint).
你可以查看我们的 [Kotlin Slack](https://slack-chats.kotlinlang.org/c/compiler), 或 [联系我们](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up),
就你的使用场景寻求建议.

如果你 _仍然_ 找不到你需要的功能, 你可以 [创建自定义编译器 Plugin](custom-compiler-plugins.md).
请只在万不得已时才使用这种方式, 因为 Kotlin 编译器 Plugin API 仍然 **不稳定** .
如果你创建了自定义编译器 Plugin, 你需要投入大量精力来不断维护它, 因为编译器的每个新版本都会引入破坏性的变更.
