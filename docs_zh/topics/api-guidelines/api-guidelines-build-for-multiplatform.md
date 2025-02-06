[//]: # (title: 构建跨平台的 Kotlin 库)

在创建 Kotlin 库时, 请考虑构建和 [发布支持 Kotlin Multiplatform 的库](multiplatform-publish-lib.md).
这样可以扩大你的库的目标受众, 使它兼容于针对多个平台的项目.

以下章节提供一份指南, 帮助你高效的构建 Kotlin Multiplatform 库.

## 尽可能扩大你的覆盖范围 {id="maximize-your-reach"}

要让你的库能够作为依赖项, 供最多数量的项目使用,
应该支持尽可能多的 Kotlin Multiplatform [编译目标平台](multiplatform-dsl-reference.md#targets).

如果你的库不支持一个跨平台项目所使用的平台, 无论这个项目是一个库还是一个应用程序, 那么这个项目依赖你的库就会变得很困难.
这种情况下, 这个项目在某些平台上可以使用你的库, 但对其它平台则需要实现单独的解决方案,
或者, 他们会完全选择另一个支持他们所有平台的替代库.

为了提高 artifact 的生成效率, 你可以试用实验性的 [交叉编译(Cross-Compilation)](multiplatform-publish-lib.md#host-requirements) 功能,
从任何主机发布 Kotlin Multiplatform 库.
这个功能让你能够生成针对 Apple 编译目标的 `.klib` artifact, 而不需要使用 Apple 机器.
我们计划在将来稳定这个功能, 并进一步改善库的发布.
请在我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290) 中留下你关于这个功能的反馈意见.

> 对于 Kotlin/Native 编译目标, 请考虑使用 [分层方案](native-target-support.md#for-library-authors) 来支持所有可能的编译目标.
>
{style="note"}

## 设计可以在共通代码中使用的 API {id="design-apis-for-use-from-common-code"}

在创建一个库时, 要将 API 设计成能够共通 Kotlin 代码在中使用, 而不是编写平台相关的实现.

要尽可能提供合理的默认配置, 并包含平台相关的配置选项.
好的默认值让使用者能够在共通 Kotlin 代码中使用库的 API, 而不需要编写平台相关的实现来配置库.

要将 API 放置在最广泛的相关源代码集中, 使用以下优先级:

* **`commonMain` 源代码集:**
  `commonMain` 源代码集中的 API 可以在库支持的所有平台中使用. 要尽量将你的库的大部分 API 放在这里.
* **中间源代码集:**
  如果一部分平台不支持某些API, 请使用 [中间源代码集](multiplatform-discover-project.md#intermediate-source-sets) 来针对特定的平台.
  例如, 你可以创建一个 `concurrent` 源代码集, 用于支持多线程的编译目标, 或者一个 `nonJvm` 源代码集, 用于所有的非-JVM 编译目标.
* **平台相关的源代码集:**
  对于平台相关的 API, 请使用 `androidMain` 之类的源代码集.

> 关于 Kotlin Multiplatform 项目的源代码集, 详情请参见 [层级项目结构](multiplatform-hierarchy.md).
>
{style="tip"}

## 确保跨平台的行为一致性  {id="ensure-consistent-behavior-across-platforms"}

为了确保你的库在所有支持的平台上保持动作的一致性,
跨平台的库中的 API 应该在所有的平台上接受相同范围的有效输入, 执行相同的动作, 并返回相同的结果.
类似的, 库应该在所有的平台上统一的处理无效的输入, 并一致的报告错误, 或抛出异常.

不一致的行为会让库难以使用, 并强迫使用者在共通代码中添加条件逻辑, 来管理特定平台的差异.

你可以使用 [`expect` 和 `actual` 声明](multiplatform-expect-actual.md), 在共通代码中声明函数,
这些函数具有平台特定的实现, 能够完全访问各个平台的原生 API.
这些实现还必须具有相同的行为, 以确保它们能够在共通代码中可靠的使用.

当 API 行为在各个平台上保持一致时, 它们只需要在 `commonMain` 源代码集中编写一次文档.

> 如果平台差异无法避免, 例如一个平台支持更大的输入范围, 那么应该尽量减小这些差异.
> 例如, 你可能不希望缩减一个平台的功能来匹配其它平台.
> 这种情况下, 要为具体的差异编写清晰的文档.
>
> {style=”note”}

## 在所有的平台上测试 {id="test-on-all-platforms"}

跨平台库可以在共通代码中编写 [跨平台的测试](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html),
在所有平台上运行.
在你支持的平台上定期执行这个共通测试套件, 能够确保库的行为正确, 并且一致.

在所有的发布平台上定期测试 Kotlin/Native 编译目标可能会很困难.
但是, 为了确保更广泛的兼容性, 请考虑对它能够支持所有的编译目标发布库,
在测试兼容性时使用 [分层方案](native-target-support.md#for-library-authors).

使用 [`kotlin-test`](https://kotlinlang.org/api/latest/kotlin.test/) 库, 在共通代码中编写测试,
并使用平台特定的测试运行器执行这些测试.

## 考虑非 Kotlin 使用者 {id="consider-non-kotlin-users"}

Kotlin Multiplatform 在它支持的目标平台上平台, 提供了与原生 API 和语言的互操作能力.
在创建 Kotlin Multiplatform 库时, 请考虑使用者是否可能需要在 Kotlin 之外的语言中使用你的库的类型和声明.

例如, 如果你的库的某些类型  将会通过互操作性暴露给 Swift 代码,
请将这些类型设计成在 Swift 中易于访问.
在 Swift 中调用时 Kotlin API 如何表现,
[Kotlin-Swift interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia) 提供了很有用的信息.

## 推广你的库 {id="promote-your-library"}

你的库可以在 [JetBrains 的检索平台](https://klibs.io/) 上展示.
它的目标是为了让使用者便利的根据目标平台查找 Kotlin Multiplatform 库.

符合标准的库会被自动添加进来.
关于如何添加你的库, 详情请参见 [FAQ](https://klibs.io/faq).
