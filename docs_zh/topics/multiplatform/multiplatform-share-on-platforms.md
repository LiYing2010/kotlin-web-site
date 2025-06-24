[//]: # (title: 在不同的平台之间共用代码)

通过 Kotlin Multiplatform, 你可以使用 Kotlin 提供的以下机制共用代码:

* [在你的项目中使用的所有平台上共用代码](#share-code-on-all-platforms).
通过这种方式, 可以共用那些适用于所有平台的共通业务逻辑.
* [在你的项目中使用的一部分(但不是所有)平台上共用代码](#share-code-on-similar-platforms).
通过使用层级结构(Hierarchical Structure), 你可以在相似的平台上重用代码.

如果需要在共用代码中访问平台相关的 API, 可以使用 Kotlin 的
[预期声明与实际声明(expected and actual declaration)](multiplatform-expect-actual.md) 机制.

## 在所有平台上共用代码 {id="share-code-on-all-platforms"}

如果你的业务逻辑对所有的平台都是共通的, 那么没有必要对每个平台编写相同的代码 –
只需要在共通源代码集中共用这些代码就可以了.

![所有平台上共用的代码](flat-structure.svg)

源代码集之间一些依赖关系会默认设置. 对于以下源代码集, 你不需要手动指定任何 `dependsOn` 关系:
* 所有平台相关的源代码集会默认依赖于共通源代码集, 比如 `jvmMain`, `macosX64Main`, 等等.
* 某个特定编译目标的 `main` 与 `test` 源代码集之间会默认依赖, 比如 `androidMain` 与 `androidUnitTest`.

如果在共用的代码中需要访问平台相关的 API, 可以使用 Kotlin 的
[预期声明与实际声明(expected and actual declaration)](multiplatform-expect-actual.md)
机制.

## 在类似的平台上共用代码 {id="share-code-on-similar-platforms"}

开发过程中经常会需要创建几种原生编译目标, 它们之间可能共用很多共通逻辑和第三方 API.

比如, 在一个包含 iOS 编译目标的典型的跨平台项目中, 有两种 iOS 相关的编译目标: 一个是 iOS ARM64 设备, 另一个是 x64 模拟器.
它们的平台相关源代码集是分开的, 但实际上真实设备和模拟器很少需要不同的代码, 而且它们的依赖项也基本相同.
因此对这些编译目标, iOS 相关的代码可以共用.

很明显, 在这种设置中, 对两个 iOS 编译目标我们需要一个共用的源代码集,
其中包含的 Kotlin/Native 代码, 仍然可以直接调用那些对 iOS 设备和模拟器共通的 API.

这种情况下, 可以通过以下任何一种方法, 使用[层级结构(Hierarchical Structure)](multiplatform-hierarchy.md),
在你的项目中的多个原生编译目标之间共用代码:

* [使用默认的层级模板](multiplatform-hierarchy.md#default-hierarchy-template)
* [手动配置层级结构](multiplatform-hierarchy.md#manual-configuration)

更多详情请参见 [在多个库之间共用代码](#share-code-in-libraries) 以及 [连接平台相关的库](#connect-platform-specific-libraries).

## 在多个库之间共用代码 {id="share-code-in-libraries"}

感谢项目层级结构的帮助, 多个库也可以对一组编译目标提供共通的 API.
当 [库发布](multiplatform-publish-lib.md) 时, 它的中间源代码集的 API 会与项目结构信息一起嵌入到库的 artifact 中.
当你使用这个库时, 你的项目的中间源代码集只能访问各个源代码集的编译目标所能得到的库的 API.

比如, `kotlinx.coroutines` 代码仓库的源代码集层级结构如下:

![Library 层级结构](lib-hierarchical-structure.svg)

`concurrent` 源代码集声明了函数 runBlocking, 然后针对 JVM 和原生编译目标进行编译.
当 `kotlinx.coroutines` 库更新并携带项目的层级结构信息一起发布之后,
你可以依赖到这个库, 并在 JVM 和原生编译目标之间共用的源代码集中调用 `runBlocking`,
因为它与库的 `concurrent` 源代码集的 "编译目标签名" 相符.

## 连接平台相关的库 {id="connect-platform-specific-libraries"}

为了共用更多的原生代码, 而不是仅仅局限于平台相关的依赖项, 你可以使用 [平台库](native-platform-libs.md),
例如 Foundation, UIKit, 和 POSIX.
这些库随 Kotlin/Native 一起发布, 在共用的源代码集中默认可以使用.

此外, 如果在你的项目中使用 [Kotlin CocoaPods Gradle](native-cocoapods.md) plugin,
你也可以使用 [`cinterop` 机制](native-c-interop.md) 导入的第三方原生库.

## 下一步做什么?

* [阅读使用 Kotlin 预期声明与实际声明机制共用代码的相关文档](multiplatform-expect-actual.md)
* [学习层级项目结构](multiplatform-hierarchy.md)
* [为你的跨平台库设置发布](multiplatform-publish-lib.md)
* [阅读我们推荐的跨平台项目中的源代码文件命名规约](coding-conventions.md#source-file-names)
