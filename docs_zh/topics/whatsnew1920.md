[//]: # (title: Kotlin 1.9.20 版中的新功能)

_[发布日期: 2023/11/01](releases.md#release-details)_

Kotlin 1.9.20 已经发布了, [K2 编译器对于所有编译目标已进入 Beta 版](#new-kotlin-k2-compiler-updates),
[Kotlin Multiplatform 已进入稳定版](#kotlin-multiplatform-is-stable).
此外, 还有以下一些重要功能:

* [跨平台项目时默认使用新的层级结构模板](#template-for-configuring-multiplatform-projects)
* [Kotlin Multiplatform 中对 Gradle 配置缓存的完全支持](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [在 Kotlin/Native 中默认启用自定义内存分配器](#custom-memory-allocator-enabled-by-default)
* [在 Kotlin/Native 中垃圾收集器的性能改进](#performance-improvements-for-the-garbage-collector)
* [Kotlin/Wasm 中的新的构建目标以及改名的构建目标](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [在 Kotlin/Wasm 标准库中支持 WASI API](#support-for-the-wasi-api-in-the-standard-library)

关于本次更新的概要介绍, 你可以观看以下视频:

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="Kotlin 1.9.20 版中的新功能"/>

## IDE 支持 {id="ide-support"}

在以下 IDE 中可以使用支持 1.9.20 版的 Kotlin plugin:

| IDE            | 支持的版本                                  |
|----------------|----------------------------------------|
| IntelliJ IDEA  | 2023.1.x, 2023.2.x, 2023.x             |
| Android Studio | Hedgehog (2023.1.1), Iguana (2023.2.1) |

> 从 IntelliJ IDEA 2023.3.x 和 Android Studio Iguana (2023.2.1) Canary 15 开始, 会自动包含并更新 Kotlin plugin.
> 你只需要在你的项目中更新 Kotlin 版本.
>
{style="note"}

## 新 Kotlin K2 编译器的更新 {id="new-kotlin-k2-compiler-updates"}

JetBrains 的 Kotlin 开发组一直在努力稳定新的 K2 编译器,
这个编译器将会带来显著的性能改进, 加快新的语言功能的开发, 统一 Kotlin 支持的所有平台, 并为跨平台项目提供更好的架构.

K2 目前对所有的编译目标都处于 **Beta 版**.
[详情请参见 release blog](https://blog.jetbrains.com/kotlin/2023/11/kotlin-1-9-20-released/)

### 对 Kotlin/Wasm 的支持 {id="support-for-kotlin-wasm"}

从这个发布版开始, Kotlin/Wasm 支持新的 K2 编译器.
参见 [如何在你的项目中启用它](#how-to-enable-the-kotlin-k2-compiler).

### 针对 K2 的 kapt 编译器 plugin 预览版 {id="preview-kapt-compiler-plugin-with-k2"}

> 在 kapt 编译器 plugin 中对 K2 的支持是 [实验性功能](components-stability.md).
> 需要使用者同意(Opt-in) (详情见下文),
> 请注意, 只为评估和试验目的来使用这个功能.
>
{style="warning"}

在 1.9.20 中, 你可以试用针对 K2 编译器的 [kapt 编译器 plugin](kapt.md).
要在你的项目中使用 K2 编译器, 请向你的 `gradle.properties` 文件添加以下选项:

```text
kotlin.experimental.tryK2=true
kapt.use.k2=true
```

或者, 你可以通过以下步骤启用针对 K2 的 kapt:
1. 在你的 `build.gradle.kts` 文件中, [设置语言版本](gradle-compiler-options.md#example-of-setting-languageversion) 为 `2.0`.
2. 在你的 `gradle.properties` 文件中, 添加 `kapt.use.k2=true`.

如果你在使用针对 K2 编译器的 kapt 时遇到任何问题, 请到我们的 [问题追踪系统](http://kotl.in/issue) 提交报告.

### 如何启用 Kotlin K2 编译器 {id="how-to-enable-the-kotlin-k2-compiler"}

#### 在 Gradle 中启用 K2

要启用并检验 Kotlin K2 编译器, 请通过下面的编译器选项使用新的语言版本:

```bash
-language-version 2.0
```

你可以在你的 `build.gradle.kts` 文件中指定这个选项:

```kotlin
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = "2.0"
        }
    }
}
```

#### 在 Maven 中启用 K2

要启用并检验 Kotlin K2 编译器, 请更新的你 `pom.xml` 文件的 `<project/>` 小节:

```xml
<properties>
    <kotlin.compiler.languageVersion>2.0</kotlin.compiler.languageVersion>
</properties>
```

#### 在 IntelliJ IDEA 中启用 K2

要在 IntelliJ IDEA 中启用并检验 Kotlin K2 编译器, 请选择菜单 **Settings** | **Build, Execution, Deployment** | **Compiler** | **Kotlin Compiler**,
将 **Language Version** 选项更新为 `2.0 (experimental)`.

### 留下你对于新 K2 编译器的反馈意见

如果你能提供你的反馈意见, 我们将会非常感谢!

* 在 Kotlin Slack 频道中, 直接向 K2 开发者提供你的反馈意见 – [获得邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw),
  并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道.
* 在 [我们的问题追踪系统](https://kotl.in/issue) 中, 报告你遇到的新 K2 编译器的问题.
* [启用 Send usage statistics 选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html),
  允许 JetBrains 收集关于 K2 使用状况的匿名数据.

## Kotlin/JVM

从 1.9.20 版开始, 编译器能够生成包含 Java 21 字节码的类.

## Kotlin/Native {id="kotlin-native"}

Kotlin 1.9.20 包含稳定的内存管理器, 其中包括, 默认使用新的内存分配器, 对垃圾收集器的性能改进, 以及其他更新:

* [默认启用自定义内存分配器](#custom-memory-allocator-enabled-by-default)
* [垃圾收集器的性能改进](#performance-improvements-for-the-garbage-collector)
* [`klib` artifact 的增量编译](#incremental-compilation-of-klib-artifacts)
* [解决库链接的问题](#managing-library-linkage-issues)
* [类构造器调用时的伴随对象初始化](#companion-object-initialization-on-class-constructor-calls)
* [对所有的 cinterop 声明要求使用者同意(Opt-in)](#opt-in-requirement-for-all-cinterop-declarations)
* [链接器错误的自定义信息](#custom-message-for-linker-errors)
* [删除了旧的内存管理器](#removal-of-the-legacy-memory-manager)
* [我们的编译目标层级策略的变更](#change-to-our-target-tiers-policy)

### 默认启用自定义内存分配器 {id="custom-memory-allocator-enabled-by-default"}

Kotlin 1.9.20 默认启用新的内存分配器.
它的设计目标是取代以前的默认分配器, `mimaloc`,
使得垃圾收集更加高效, 并提高 [Kotlin/Native 内存管理器](native-memory-manager.md) 的运行期性能.

新的自定义分配器将系统内存分为多个页面(Page), 允许按连续的顺序进行独立的清理.
每次分配的内存都会成为一个页面(Page)内的内存块(Memory Block), 并且页面会追踪各个块的大小.
各种不同的页面类型进行了不同的优化, 以适应于不同的内存分配大小.
内存块的连续排列保证了可以对所有的分配块进行高效的迭代.

当一个线程分配内存时, 它会根据分配的大小搜索适当的页面.
线程会根据不同的大小类别维护一组页面.
对于一个确定的大小, 当前页通常可以容纳这个内存分配.
如果不能, 那么线程会从共享的分配空间请求一个不同的页面.
这个页面的状态可能是可用, 需要清理, 或需要创建.

新的内存分配器允许同时使用多个多个独立的分配空间,
因此 Kotlin 开发组可以实验不同的页面布局, 进一步提高性能.

#### 如何启用自定义内存分配器

从 Kotlin 1.9.20 开始, 新的内存分配器默认启用. 不需要额外的设置.

如果你遇到内存消耗过高的情况,
你可以在你的 Gradle 构建脚本中使用 `-Xallocator=mimalloc` 或 `-Xallocator=std` 选项,
切换回原来的 `mimaloc`, 或系统分配.
请将这样的问题报告到 [YouTrack](https://kotl.in/issue), 帮助我们改进新的内存分配器.

关于新的分配器设计的技术细节, 请参见 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md).

### 垃圾收集器的性能改进 {id="performance-improvements-for-the-garbage-collector"}

Kotlin 开发组一直在改进新的 Kotlin/Native 内存管理器的性能和稳定性.
这个发布版带来了对垃圾收集器 (GC)的很多重大变更, 包括以下重要功能:

* [使用完全并行标记(Full Parallel Mark), 减少 GC 的暂停时间](#full-parallel-mark-to-reduce-the-pause-time-for-the-gc)
* [追踪大块内存, 提高分配性能](#tracking-memory-in-big-chunks-to-improve-the-allocation-performance)

#### 使用完全并行标记(Full Parallel Mark), 减少 GC 的暂停时间 {id="full-parallel-mark-to-reduce-the-pause-time-for-the-gc"}

以前, 默认的垃圾收集器执行的只是部分的并行标记.
当转换器线程(Mutator Thread) 被暂停时, 它会从它自己的根开始标记 GC, 例如线程局部变量(thread–local variable)和调用栈.
同时, 一个单独的 GC 线程负责从全局根(global root) 开始标记, 以及所有那些正在运行原生代码因此没有暂停的转换器的根.

如果只存在有限数量的全局对象, 而且转换器线程(Mutator Thread)花费很多时间在运行状态下执行 Kotlin 代码, 那么这种方案曾经工作得很好.
但是, 对于典型的 iOS 应用程序, 就不是这样的情况了.

现在 GC 使用完全并行标记(Full Parallel Mark), 它结合了暂停的转换器(Paused Mutator), GC 线程, 以及可选的标记线程(Marker Thread),
来处理标记队列(Mark Queue).
默认情况下, 标记过程由以下二者执行:

* 暂停的转换器(Paused Mutator). 不是处理它们自己的根, 然后进入空闲状态, 不执行代码, 相反, 它们会参与整个标记过程.
* GC 线程. 这样可以确保至少存在一个线程会执行标记过程.

这个新方案让标记过程更加高效, 减少了 GC 的暂停时间.

#### 追踪大块内存, 提高分配性能 {id="tracking-memory-in-big-chunks-to-improve-the-allocation-performance"}

以前, GC 调度器分别追踪每个对象的内存分配.
但是, 新的默认的自定义分配器和 `mimalloc` 内存分配器都不会为每个对象分配单独的存储空间;
它们会一次性为多个对象分配大块的区域.

在 Kotlin 1.9.20 中, GC 追踪内存区域而不是追踪单独的对象.
这样会减少每次分配时执行的任务数量, 因此可以提高小对象的内存分配速度,
也有助于尽量减少垃圾收集器的内存使用量.

### klib artifact 的增量编译 {id="incremental-compilation-of-klib-artifacts"}

> 这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除. 需要使用者同意(Opt-in) (详情见下文).
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://kotl.in/issue) 提供你的反馈意见.
>
{style="warning"}

Kotlin 1.9.20 引入了对 Kotlin/Native 的新的编译时间优化.
从 `klib` artifact 到原生代码的编译, 现在是部分增量的编译.

在 debug 模式下将 Kotlin 源代码编译为原生二进制代码时, 编译经过两个阶段:

1. 源代码编译为 `klib` artifact.
2. `klib` artifact, 以及依赖项, 编译为二进制代码.

为了优化第二阶段的编译时间, 开发组实现了对依赖项的编译器缓存.
依赖项到原生代码只会编译一次, 编译结果会在每次编译二进制代码时重新使用.
但是, 每次项目发生变更时, 从项目源代码到 `klib` artifact 的构建, 总是会完全重编译为原生代码.

通过新的增量编译, 如果项目模块的变更导致只有一部分源代码重编译为 `klib` artifact,
那么也只有一部分的 `klib` 会被重新编译为二进制代码.

要启用增量编译, 请向你的 `gradle.properties` 文件添加以下选项:

```none
kotlin.incremental.native=true
```

如果你遇到问题, 请报告到 [YouTrack](https://kotl.in/issue).

### 解决库链接的问题 {id="managing-library-linkage-issues"}

这个发布版改进了 Kotlin/Native 编译器链接 Kotlin 库时发生问题的处理方式.
错误消息现在包含更加易于阅读的声明, 因为它们使用签名名称而不是 hash 值, 可以帮助你更加容易的查找并修复错误.
下面是一个例子:

```text
No function found for symbol 'org.samples/MyClass.removedFunction|removedFunction(kotlin.Int;kotlin.String){}[0]'
```
Kotlin/Native 编译器发现与第 3 方 Kotlin 库链接的错误, 并在运行期报告错误.
如果一个第 3 方 Kotlin 库的作者对实验性 API进行了不兼容的变更, 而这个 API 又被另一个第 3 方 Kotlin 库使用, 你就会遇到这样的问题.

从 Kotlin 1.9.20 开始, 编译器默认以静默模式检测链接错误.
你可以在你的项目中修改设定:

* 如果你希望在你的编译日志中记录这些错误, 请使用 `-Xpartial-linkage-loglevel=WARNING` 编译器选项, 启用警告.
* 也可以使用 `-Xpartial-linkage-loglevel=ERROR`, 将编译器报告的警告提升为编译错误.
这种情况下, 编译会失败, 你会在编译日志中得到所有的错误. 使用这个选项, 可以更加严格的检查链接错误.

```kotlin
// 在 Gradle 构建文件中传递编译器参数的示例:
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                // 将链接错误报告为警告:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=WARNING")

                // 将链接错误的警告提升为错误:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")
            }
        }
    }
}
```

如果你在使用这个功能时遇到意外的问题, 你随时可以使用 `-Xpartial-linkage=disable` 编译器选项关闭这个功能.
请记得将这样的问题报告到 [我们的问题追踪系统](https://kotl.in/issue).

### 类构造器调用时的伴随对象初始化 {id="companion-object-initialization-on-class-constructor-calls"}

从 Kotlin 1.9.20 开始, Kotlin/Native 后端会在类的构造器中调用伴随对象的静态初始化器:

```kotlin
class Greeting {
    companion object {
        init {
            print("Hello, Kotlin!")
        }
    }
}

fun main() {
    val start = Greeting() // 输出结果为 "Hello, Kotlin!"
}
```

这个行为现在与 Kotlin/JVM 平台统一了, 在 Kotlin/JVM 平台上,
在与 Java 静态初始化器语义匹配的对应的类被装载时(被解析时), 伴随对象就会被初始化.

现在这个功能的实现在各个平台之间更加一致了, 因此在 Kotlin Multiplatform 项目中更加容易共用代码.

### 对所有的 cinterop 声明要求使用者同意(Opt-in) {id="opt-in-requirement-for-all-cinterop-declarations"}

从 Kotlin 1.9.20 开始, 由 `cinterop` 工具从 C 和 Objective-C 库(例如 libcurl 和 libxml)生成的所有 Kotlin 声明,
都被标记为 `@ExperimentalForeignApi`.
如果缺少使用者同意(Opt-in)注解, 你的代码将无法编译.

这个要求反应了 C 和 Objective-C 库导入功能的 [实验性](components-stability.md#stability-levels-explained) 状态.
我们建议你将这个功能限制在你的项目的特定区域中.
这样可以在我们稳定库导入功能之后, 让你的迁移更加容易.

> 对于随 Kotlin/Native 一起发布的原生平台库 (例如 Foundation, UIKit, 以及 POSIX),
> 它们的 API 只有一部分需要使用 `@ExperimentalForeignApi` 注解标注使用者同意.
> 对这样的情况, 你会得到警告信息, 要求你标注使用者同意.
>
{style="note"}

### 链接器错误的自定义信息 {id="custom-message-for-linker-errors"}

如果你是库的作者, 现在你可以通过自定义消息来帮助你的用户解决链接器错误.

如果你的 Kotlin 库依赖于 C 或 Objective-C 库, 例如, 使用了 [CocoaPods 集成](native-cocoapods.md),
那么你的库的使用者需要在本地机器上存在这些依赖库, 或者在项目的构建脚本中明确配置这些库.
否则, 使用者会遇到一个令人迷惑的 "Framework not found" 消息.

现在你可以在编译失败的信息中提供具体的指示或链接.
方法是, 向 `cinterop` 传递 `-Xuser-setup-hint` 编译器选项
或者在你的 `.def` 文件中添加 `userSetupHint=message` 属性.

### 删除了旧的内存管理器 {id="removal-of-the-legacy-memory-manager"}

在 Kotlin 1.6.20 中引入了 [新的内存管理器](native-memory-manager.md), 而且在 1.7.20 中默认启用.
之后, 我们对它进行了很多更新, 并改进了性能, 现在它已经称为稳定版.

现在已经到了完成废弃周期, 并删除旧的内存管理器的时刻.
如果你还在使用它, 请从你的 `gradle.properties` 文件删除 `kotlin.native.binary.memoryModel=strict` 选项,
并遵照我们的 [迁移指南](native-migration-guide.md), 进行必要的变更.

### 我们的编译目标层级策略的变更 {id="change-to-our-target-tiers-policy"}

我们决定升级对 [第 1 层支持](native-target-support.md#tier-1) 的要求.
Kotlin 开发组致力于对符合第 1 层条件的编译目标, 提供编译器发布版本之间的源代码和二进制兼容性.
这些编译目标还必须使用 CI 工具进行常规测试, 以确保能够编译和运行.
目前, 对于 macOS 主机, 第 1 层包括以下编译目标:

* `macosX64`
* `macosArm64`
* `iosSimulatorArm64`
* `iosX64`

在 Kotlin 1.9.20 中, 我们还删除了很多以前废弃的编译目标, 即:

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxMips32`
* `linuxMipsel32`

关于编译目标的完整列表, 请参见目前 [支持的编译目标](native-target-support.md).

## Kotlin Multiplatform

Kotlin 1.9.20 集中于 Kotlin Multiplatform 的稳定性, 并提供了新的项目向导和其它重要功能, 进一步改进开发者体验:

* [Kotlin Multiplatform 已进入稳定版](#kotlin-multiplatform-is-stable)
* [用于配置跨平台项目的模板](#template-for-configuring-multiplatform-projects)
* [新的项目向导](#new-project-wizard)
* [对 Gradle 配置缓存的完全支持](#full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform)
* [新的标准库版本在 Gradle 更容易配置](#easier-configuration-of-new-standard-library-versions-in-gradle)
* [对第 3 方 cinterop 库的默认支持](#default-support-for-third-party-cinterop-libraries)
* [在 Compose Multiplatform 项目中对 Kotlin/Native 编译缓存的支持](#support-for-kotlin-native-compilation-caches-in-compose-multiplatform-projects)
* [兼容性指南](#compatibility-guidelines)

### Kotlin Multiplatform 已进入稳定版 {id="kotlin-multiplatform-is-stable"}

1.9.20 版的发布标志了 Kotlin 演化历程中的一个重要的里程碑: [Kotlin Multiplatform](multiplatform-intro.md)
终于进入了稳定版.
这表示这个技术已经可以安全的用于你的项目, 并且 100% 可以用于真实生产环境.
还意味着 Kotlin Multiplatform 未来的开发会继续符合我们严格的 [向后兼容性规则](https://kotlinfoundation.org/language-committee-guidelines/).

请注意, Kotlin Multiplatform 的一些高级功能还在继续演化.
在使用这些功能时, 你会收到警告信息, 代表你使用的功能目前的稳定性状态.
在 IntelliJ IDEA 中使用任何实验性功能之前,
你需要通过菜单 **Settings** | **Advanced Settings** | **Kotlin** | **Experimental Multiplatform**, 明确的启用它.

* 查看 [Kotlin blog](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/), 阅读关于 Kotlin Multiplatform 稳定性和未来开发计划的更多信息.
* 查看 [Multiplatform 兼容性指南](multiplatform-compatibility-guide.md), 看看在向稳定版演化时有哪些重要变更.
* 阅读 [预期(Expected)声明与实际(Actual)声明机制](multiplatform-expect-actual.md),
  这是 Kotlin Multiplatform 的重要部分,在本次发布版中, 它也部分的稳定了.

### 用于配置跨平台项目的模板 {id="template-for-configuring-multiplatform-projects"}

从 Kotlin 1.9.20 开始, Kotlin Gradle plugin 会为常见的跨平台场景自动创建共享的源代码集.
如果你的项目设置属于这样的情况, 你就不需要手动配置源代码集层级结构.
只需要为你的项目明确指定必要的编译目标.

由于有了 Kotlin Gradle plugin 的新功能: 默认的层级结构模板, 设置变得更加容易了.
它是 plugin 内置的预定义的源代码集层级结构模板.
其中包含 Kotlin 为你声明的编译目标自动创建的中间源代码集.
[参见完整的模板](#see-the-full-hierarchy-template).

#### 更容易的创建你的项目

假设有一个跨平台项目, 编译目标包括 Android 和 iPhone 设备, 开发环境为 Apple silicon MacBook.
我们来比较一下不同版本的 Kotlin 中的项目设置:

<table>
    <tr>
        <td>Kotlin 1.9.0 和以前的版本 (标准设置)</td>
        <td>Kotlin 1.9.20</td>
    </tr>
    <tr>
<td>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        val commonMain by getting

        val iosMain by creating {
            dependsOn(commonMain)
        }

        val iosArm64Main by getting {
            dependsOn(iosMain)
        }

        val iosSimulatorArm64Main by getting {
            dependsOn(iosMain)
        }
    }
}
```

</td>
<td>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    // iosMain 源代码集会自动创建
}
```

</td>
</tr>
</table>

请注意, 使用默认的层级结构模板显著减少了设置你的项目时需要的样板代码的数量.

当你在你的代码中声明 `androidTarget`, `iosArm64`, 和 `iosSimulatorArm64` 编译目标时,
Kotlin Gradle plugin 会从模板中找到合适的共享源代码集, 并为你创建这些源代码集.
最后产生的层级结构类似下图:

![使用默认的编译目标层级结构的示例](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

绿色的源代码集会自动创建并包含到项目中, 同时, 默认模板中的灰色的源代码集会被忽略.

#### 对源代码集使用自动补完功能

为了更容易的使用创建的项目结构, IntelliJ IDEA 现在对使用默认层级结构模板创建的源代码集提供了自动补完功能:

<img src="multiplatform-hierarchy-completion.animated.gif" alt="IDE 对源代码集名称的自动补完" width="350" />

如果你没有声明某个编译目标, 因而不存在对应的源代码集, 那么在你试图访问这个不存在的源代码集时, Kotlin 会提示警告.
在下面的示例中, 不存在 JVM 编译目标 (只有 `androidTarget`, 这是不同的编译目标).
但我们来试试使用 `jvmMain` 源代码集, 看看会发生什么:

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        jvmMain {
        }
    }
}
```

在这种情况下, Kotlin 会在构建日志中报告警告:

```none
w: Accessed 'source set jvmMain' without registering the jvm target:
  kotlin {
      jvm() /* <- register the 'jvm' target */

      sourceSets.jvmMain.dependencies {

      }
  }
```

#### 设置编译目标层级结构

从 Kotlin 1.9.20 开始, 会自动启用默认的层级结构模板. 大多数情况下, 不需要更多设置.

但是, 如果你在迁移一个在 1.9.20 版之前创建的既有项目,
如果你曾经使用 `dependsOn()` 调用, 手动的引入了中间源代码(Intermediate Source), 你可能遇到警告.
为了解决这个问题, 请执行以下步骤:

* 如果现在默认的层级结构模板已经包含了你的中间源代码集, 请删除所有的手动 `dependsOn()` 调用,
  以及使用 `by creating` 构造创建的源代码集.

  关于全部的默认源代码集, 请参见 [完整的层级结构模板](#see-the-full-hierarchy-template).

* 如果你想要默认的层级结构模板没有提供的其他源代码集, 例如, 在 macOS 和 JVM 编译目标之间共用代码的源代码集,
  请调整层级结构, 方法是使用 `applyDefaultHierarchyTemplate()` 来明确的重新适用模板,
  然后和通常的做法一样, 使用 `dependsOn()` 来手动配置其他源代码集:

  ```kotlin
  kotlin {
      jvm()
      macosArm64()
      iosArm64()
      iosSimulatorArm64()

      // 明确的适用默认的层级结构. 它会创建一系列源代码集, 例如, iosMain 源代码集:
      applyDefaultHierarchyTemplate()

      sourceSets {
          // 额外创建一个 jvmAndMacos 源代码集
          val jvmAndMacos by creating {
              dependsOn(commonMain.get())
          }

          macosArm64Main.get().dependsOn(jvmAndMacos)
          jvmMain.get().dependsOn(jvmAndMacos)
      }
  }
  ```

* 如果在你的项目中已经有了源代码集, 名称与模板生成的源代码集相同, 但在不同的编译目标之间共用,
  目前没有办法可以修改模板的源代码集之间的默认的 `dependsOn` 关系.

  一种解决方法是, 为你的目标找到不同的源代码集, 要么使用默认的层级结构模板中的源代码集, 要么使用手动创建的源代码集.
  另一种方法是完全禁用模板.

  要禁用模板, 请向你的 `gradle.properties` 文件添加 `kotlin.mpp.applyDefaultHierarchyTemplate=false`, 并手动配置其它所有的源代码集.

  我们目前正在开发一个 API, 用于创建你自己的层级结构模板, 以简化这类设置过程.

#### 查看完整的层级结构模板 {id="see-the-full-hierarchy-template" initial-collapse-state="collapsed" collapsible="true"}

当你声明你的项目的编译目标时, plugin 会从模板中选取对应的共用源代码集, 并在你的项目中创建它们.

![默认的层级结构模板](full-template-hierarchy.svg)

> 这个示例只显示了项目的 production 部分, 省略了 `Main` 后缀 (例如, 使用 `common` 而不是 `commonMain`).
> 但是, 还有完全相同的一组 `*Test` 源代码集.
>
{style="tip"}

### 新的项目向导 {id="new-project-wizard"}

JetBrains 开发组引入了一种新的方式来创建跨平台项目 – [Kotlin Multiplatform web 向导](https://kmp.jetbrains.com).

新的 Kotlin Multiplatform 向导的第一个实现包含了最常见的 Kotlin Multiplatform 使用场景.
它包含了对之前的项目模板的所有反馈意见, 使得架构尽可能的健壮和可靠.

新的向导使用分布式架构, 使得我们可以拥有统一的后端和不同的前端, 使用 web 版是其中的第一步.
我们正在考虑将来实现 IDE 版, 并创建命令行工具.
在 web 版中, 你永远能够使用向导的最新版本, 而在 IDE 中, 你则需要等待下一个版本的发布.

使用新的向导, 项目设置会变的比过去更加简单. 你可以针对移动环境, 服务器, 以及桌面开发来选择目标平台, 根据你的需求来调整你的项目.
我们还计划在未来的发布中增加 Web 开发目标平台.

<img src="multiplatform-web-wizard.png" alt="Multiplatform Web 向导" width="400"/>

新的项目向导现在是使用 Kotlin 创建跨平台项目的首选方式.
从 1.9.20 开始, Kotlin plugin 不再 在 IntelliJ IDEA 中提供 **Kotlin Multiplatform** 项目向导.

新的向导将会引导你轻松的完成初始设置, 让你的开始过程更加顺利.
如果你遇到任何问题, 请报告到 [YouTrack](https://kotl.in/issue), 帮助我们改进向导的使用体验.

<a href="https://kmp.jetbrains.com">
    <img src="multiplatform-create-project-button.png" alt="创建项目" style="block"/>
</a>

### Kotlin Multiplatform 中对 Gradle 配置缓存的完全支持 {id="full-support-for-the-gradle-configuration-cache-in-kotlin-multiplatform"}

在以前的版本中, 我们曾经引入了 Gradle 配置缓存功能的 [预览版](whatsnew19.md#preview-of-the-gradle-configuration-cache),
可以用于 Kotlin 跨平台库.
从 1.9.20 开始, Kotlin Multiplatform plugin 更加前进了一步.

它现在对 [Kotlin CocoaPods Gradle plugin](native-cocoapods-dsl-reference.md) 支持 Gradle 配置缓存,
也对 Xcode 构建需要的集成任务, 例如 `embedAndSignAppleFrameworkForXcode`, 支持 Gradle 配置缓存.

现在所有的跨平台项目都可以由于构建时间的改进而获益.
Gradle 配置缓存可以对后续的构建重用配置阶段的结果, 因而加快构建过程.
更多详情, 以及配置说明, 请参见 [Gradle 文档](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage).

### 新的标准库版本在 Gradle 更容易配置 {id="easier-configuration-of-new-standard-library-versions-in-gradle"}

在你创建跨平台项目时, 会对每个源代码集自动添加对标准库(`stdlib`)的依赖项.
这是设置你的跨平台项目的最简单的方式.

在之前的版本中, 如果你想要手动配置对标准库的依赖项, 你需要对每个源代码集分别配置.
从 `kotlin-stdlib:1.9.20` 开始, 你只需要在 `commonMain` 根源代码集中, 配置这个依赖项 **一次**:

<table>
   <tr>
       <td>1.9.10 和之前版本的标准库</td>
       <td>1.9.20 版本的标准库</td>
   </tr>
   <tr>
<td>

```kotlin
kotlin {
    sourceSets {
        // 设置 common 源代码集
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib-common:1.9.10")
            }
        }

        // 设置 JVM 源代码集
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.10")
            }
        }

        // 设置 JS 源代码集
        val jsMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib-js:1.9.10")
            }
        }
    }
}
```

</td>
<td>

```kotlin
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation("org.jetbrains.kotlin:kotlin-stdlib:1.9.20")
            }
        }
    }
}
```

</td>
</tr>
</table>

这个变更是通过在标准库的 Gradle metadata 中包含新信息而实现的.
这使得 Gradle 能够对其他源代码集自动解析正确的标准库 artifact.

### 对第 3 方 cinterop 库的默认支持 {id="default-support-for-third-party-cinterop-libraries"}

对使用了 [Kotlin CocoaPods Gradle](native-cocoapods.md) plugin 的项目, Kotlin 1.9.20 添加了对所有 cinterop 依赖项的默认支持
(而不是通过使用者同意(Opt-in)的支持).

因此, 你现在可以共用更多原生代码, 而不是限制于平台相关的依赖项.
例如, 你可以向 `iosMain` 共用源代码集添加 [对 Pod 库的依赖项](native-cocoapods-libraries.md).

在以前的版本中, 这个功能只能用于随 Kotlin/Native 一起发布的 [平台相关的库](native-platform-libs.md)
(例如 Foundation, UIKit, 和 POSIX).
现在, 所有的第 3 方 Pod 库默认都可以在共用源代码集中使用.
你不再需要指定单独的 Gradle 属性来支持它们.

### 在 Compose Multiplatform 项目中对 Kotlin/Native 编译缓存的支持 {id="support-for-kotlin-native-compilation-caches-in-compose-multiplatform-projects"}

本次发布解决了与 Compose Multiplatform 编译器 plugin 的一个兼容性问题, 这个问题主要影响 iOS 的 Compose Multiplatform 项目.

过去, 为了绕过这个问题, 你需要使用 `kotlin.native.cacheKind=none` Gradle 属性禁用缓存.
但是, 这个变通方法会造成性能问题: 它使得编译速度变慢, 因为在 Kotlin/Native 编译器中缓存不再有效.

现在这个问题已经解决了, 你可以从你的 `gradle.properties` 文件中删除 `kotlin.native.cacheKind=none`,
并在你的 Compose Multiplatform 项目中享受编译速度的改进.

关于改进编译速度的更多技巧, 请参见 [Kotlin/Native 文档](native-improving-compilation-time.md).

### 兼容性指南 {id="compatibility-guidelines"}

在配置你的项目时, 请检查 Kotlin Multiplatform Gradle plugin 与 Gradle, Xcode, 和 Android Gradle plugin (AGP) 版本之间的兼容性:

| Kotlin Multiplatform Gradle plugin | Gradle    | Android Gradle plugin | Xcode         |
|------------------------------------|-----------|-----------------------|---------------|
| 1.9.20                             | 7.5 及以后版本 | 7.4.2–8.2             | 15.0. 详情请参见下文 |

从这个发布版开始, Xcode 的推荐版本为 15.0.
完全支持随 Xcode 15.0 一起发布的库, 你可以在你的 Kotlin 代码的任何地方访问这些库.

但是, XCode 14.3 在大多数情况下仍然可以使用.
请记住, 如果你在你的本地机器上使用 14.3 版, 那么随 Xcode 15 一起发布的库将会可见, 但不能访问.

## Kotlin/Wasm

在 1.9.20 中, Kotlin Wasm 的稳定性达到了 [Alpha 级](components-stability.md).

* [与 Wasm GC phase 4 和最新的 opcode 之间的兼容性](#compatibility-with-wasm-gc-phase-4-and-final-opcodes)
* [新的 `wasm-wasi` 编译目标, 以及 `wasm` 编译目标改名为 `wasm-js`](#new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js)
* [在标准库中支持 WASI API](#support-for-the-wasi-api-in-the-standard-library)
* [Kotlin/Wasm API 的改进](#kotlin-wasm-api-improvements)

> Kotlin Wasm 现在处于 [Alpha 版](components-stability.md).
> 它随时可能发生变更. 请注意, 只为评估和试验目的来使用这个功能.
>
> 希望你能通过 [YouTrack](https://kotl.in/issue) 提供你的反馈意见.
>
{style="note"}

### 与 Wasm GC phase 4 和最新的 opcode 之间的兼容性 {id="compatibility-with-wasm-gc-phase-4-and-final-opcodes"}

Wasm GC 已经进入了最后阶段, 它要求更新 opcode – 在二进制表达中使用的常数值.
Kotlin 1.9.20 支持最新的 opcode, 因此我们强烈推荐你将你的 Wasm 项目更新到最新版的 Kotlin.
我们还推荐使用支持 Wasm 环境的最新版本的浏览器:
* 对 Chrome 和基于 Chromium 的浏览器, 119 或更新版本.
* Firefox, 119 或更新版本. 注意, 在 Firefox 119 中, 你需要 [手动启用 Wasm GC](wasm-troubleshooting.md).

### 新的 wasm-wasi 编译目标, 以及 wasm 编译目标改名为 wasm-js {id="new-wasm-wasi-target-and-the-renaming-of-the-wasm-target-to-wasm-js"}

在这个发布版中, 我们对 Kotlin/Wasm 引入了一个新的编译目标 – `wasm-wasi`.
我还将 `wasm` 编译目标改名为 `wasm-js`.
在 Gradle DSL 中, 这些编译目标可以分别通过 `wasmWasi {}` 和 `wasmJs {}` 访问.

要在你的项目中使用这些编译目标, 请更新 `build.gradle.kts` 文件:

```kotlin
kotlin {
    wasmWasi {
        // ...
    }
    wasmJs {
        // ...
    }
}
```

以前引入的 `wasm {}` 代码段已经被废弃, 请改为使用 `wasmJs {}`.

要迁移你的既有的 Kotlin/Wasm 项目, 请执行以下步骤:
* 在 `build.gradle.kts` 文件中, 将 `wasm {}` 代码段改名为 `wasmJs {}`.
* 在你的项目结构中, 将 `wasmMain` 目录改名为 `wasmJsMain`.

### 在标准库中支持 WASI API {id="support-for-the-wasi-api-in-the-standard-library"}

在这个发布版中, 我们包含了对 [WASI](https://github.com/WebAssembly/WASI) 的支持, 这是对 Wasm 平台的一个系统接口.
支持 WASI, 提供了一组标准化的 API 来访问系统资源, 使你能够更容易的在浏览器之外的环境中使用 Kotlin/Wasm, 例如, 在服务器端应用程序中.
此外, WASI 提供了基于能力的安全性(Capability–based Security) – 在访问外部资源时的另一个安全层.

要运行 Kotlin/Wasm 应用程序, 你需要一个支持 Wasm 垃圾收集 (GC) 的 VM, 例如, Node.js 或 Deno.
Wasmtime, WasmEdge, 以及其它环境, 对 Wasm GC 的完整支持还在开发中.

要导入一个 WASI 函数, 请使用 `@WasmImport` 注解:

```kotlin
import kotlin.wasm.WasmImport

@WasmImport("wasi_snapshot_preview1", "clock_time_get")
private external fun wasiRawClockTimeGet(clockId: Int, precision: Long, resultPtr: Int): Int
```

[你可以在我们的 GitHub 仓库找到完整的示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example).

> 对于 `wasmWasi` 编译目标, 不能使用 [与 JavaScript 的交互功能](wasm-js-interop.md).
>
{style="note"}

### Kotlin/Wasm API 的改进 {id="kotlin-wasm-api-improvements"}

在这个发布版中, 包含了对 Kotlin/Wasm API 使用体验的一些改进.
例如, 你不再需要从 DOM 事件监听器中返回一个值:

<table>
   <tr>
       <td>1.9.20 版之前</td>
       <td>1.9.20 版</td>
   </tr>
   <tr>
<td>

```kotlin
fun main() {
    window.onload = {
        document.body?.sayHello()
        null
    }
}
```

</td>
<td>

```kotlin
fun main() {
    window.onload = { document.body?.sayHello() }
}
```

</td>
</tr>
</table>

## Gradle {id="gradle"}

Kotlin 1.9.20 完全兼容于 Gradle 6.8.3 到 8.1 的版本.
你也可以使用最新的 Gradle 版本, 但如果你这样做, 请注意, 你可能遇到废弃警告, 或一些新的 Gradle 功能无法工作.

这个发布版带来了以下变更:
* [支持 test fixture 访问内部声明](#support-for-test-fixtures-to-access-internal-declarations)
* [用于配置 Konan 目录路径的新属性](#new-property-to-configure-paths-to-konan-directories)
* [对 Kotlin/Native 任务的新的构建报告统计指标](#new-build-report-metrics-for-kotlin-native-tasks)

### 支持 test fixture 访问内部声明 {id="support-for-test-fixtures-to-access-internal-declarations"}

在 Kotlin 1.9.20 中, 如果你使用 Gradle 的 `java-test-fixtures` plugin, 那么你的 [test fixture](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)
现在可以访问 `main` 源代码集的类中的 `internal` 声明.
而且, 任何 test 源代码都可以访问 test fixture 类中的任何 `internal` 声明.

### 用于配置 Konan 目录路径的新属性 {id="new-property-to-configure-paths-to-konan-directories"}

在 Kotlin 1.9.20 中, `kotlin.data.dir` Gradle 属性可以用来定义你的指向 `~/.konan` 目录的路径,
因此你不需要通过环境变量 `KONAN_DATA_DIR` 来配置它.

或者, 你可以使用 `-Xkonan-data-dir` 编译器选项, 通过 `cinterop` 和  `konanc` 工具来配置你的指向 `~/.konan` 目录的自定义路径.

### 对 Kotlin/Native 任务的新的构建报告统计指标 {id="new-build-report-metrics-for-kotlin-native-tasks"}

在 Kotlin 1.9.20 中, Gradle 构建报告现在包含 Kotlin/Native 任务的统计指标. 下面是一个包含这些统计指标的构建报告示例:

```none
Total time for Kotlin tasks: 20.81 s (93.1 % of all tasks time)
Time   |% of Kotlin time|Task
15.24 s|73.2 %          |:compileCommonMainKotlinMetadata
5.57 s |26.8 %          |:compileNativeMainKotlinMetadata

Task ':compileCommonMainKotlinMetadata' finished in 15.24 s
Task info:
  Kotlin language version: 2.0
Time metrics:
  Total Gradle task time: 15.24 s
  Spent time before task action: 0.16 s
  Task action before worker execution: 0.21 s
  Run native in process: 2.70 s
    Run entry point: 2.64 s
Size metrics:
  Start time of task action: 2023-07-27T11:04:17

Task ':compileNativeMainKotlinMetadata' finished in 5.57 s
Task info:
  Kotlin language version: 2.0
Time metrics:
  Total Gradle task time: 5.57 s
  Spent time before task action: 0.04 s
  Task action before worker execution: 0.02 s
  Run native in process: 1.48 s
    Run entry point: 1.47 s
Size metrics:
  Start time of task action: 2023-07-27T11:04:32
```

此外, `kotlin.experimental.tryK2` 构建报告现在包含所有被编译的 Kotlin/Native 任务, 并列出使用的语言版本:

```none
##### 'kotlin.experimental.tryK2' results #####
:lib:compileCommonMainKotlinMetadata: 2.0 language version
:lib:compileKotlinJvm: 2.0 language version
:lib:compileKotlinIosArm64: 2.0 language version
:lib:compileKotlinIosSimulatorArm64: 2.0 language version
:lib:compileKotlinLinuxX64: 2.0 language version
:lib:compileTestKotlinJvm: 2.0 language version
:lib:compileTestKotlinIosSimulatorArm64: 2.0 language version
:lib:compileTestKotlinLinuxX64: 2.0 language version
##### 100% (8/8) tasks have been compiled with Kotlin 2.0 #####
```

> 如果你使用 Gradle 8.0, 你可能遇到构建报告的一些问题, 尤其是启用 Gradle 配置缓存时.
> 这是一个已知的问题, 在 Gradle 8.1 和之后的版本中已经修正.
>
{style="note"}

## 标准库

在 Kotlin 1.9.20 中, the [Kotlin/Native 标准库进入了稳定版](#the-kotlin-native-standard-library-becomes-stable),
还有一些新的功能:
* [替换了 Enum 类型值的泛型函数](#replacement-of-the-enum-class-values-generic-function)
* [改进了 Kotlin/JS 中的 HashMap 操作的性能](#improved-performance-of-hashmap-operations-in-kotlin-js)

### 替换了 Enum 类型值的泛型函数 {id="replacement-of-the-enum-class-values-generic-function"}

> 这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文).
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [YouTrack](https://kotl.in/issue) 提供你的反馈意见.
>
{style="warning"}

在 Kotlin 1.9.0 中, 枚举类的 `entries` 属性进入了稳定版. `entries` 属性是 `values()` 合成(synthetic)函数的现代而且高性能的替代者.
作为 Kotlin 1.9.20 的一部分, 还提供了 `enumValues<T>()` 泛型函数的替代者: `enumEntries<T>()`.

> `enumValues<T>()` 函数仍然继续支持, 但我们推荐你改为使用 `enumEntries<T>()` 函数, 因为它的性能影响较小.
> 每次你调用 `enumValues<T>()`, 都会创建一个新的数组,
> 而每次你调用 `enumEntries<T>()`, 都会返回相同的 List , 这样的方式效率要高很多.
>
{style="tip"}

例如:

```kotlin
enum class RGB { RED, GREEN, BLUE }

@OptIn(ExperimentalStdlibApi::class)
inline fun <reified T : Enum<T>> printAllValues() {
    print(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>()
// 输出结果为 RED, GREEN, BLUE
```

#### 如何启用 enumEntries 函数

要试用这个功能, 请使用 `@OptIn(ExperimentalStdlibApi)` 注解来标注使用者同意(Opt-in), 并使用 1.9 或更高的语言版本.
如果你使用 Kotlin Gradle plugin 的最新版, 那么你不需要指定语言版本来试用这个功能.

### Kotlin/Native 标准库进入了稳定版 {id="the-kotlin-native-standard-library-becomes-stable"}

在 Kotlin 1.9.0 中, 我们 [解释了](whatsnew19.md#the-kotlin-native-standard-library-s-journey-towards-stabilization)
我们为了使标准库更加接近于我们的稳定性目标而采取的行动.
在 Kotlin 1.9.20 中, 我们终于完成了这项工作, 让 Kotlin/Native 标准库进入了稳定版.
以下是这个发布版的一些重要变更:

* [`Vector128`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-vector128/) 类从 `kotlin.native` 包移动到了 `kotlinx.cinterop` 包.
* 对 Kotlin 1.9.0 中引入的 `ExperimentalNativeApi` 和 `NativeRuntimeApi` 注解的使用者同意(Opt-in)要求级别, 从 `WARNING` 级提升到了 `ERROR` 级.
* Kotlin/Native 集合现在能够检测并发的修改, 例如, 在 [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/) 和 [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/) 集合中.
* `Throwable` 类的 [`printStackTrace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/print-stack-trace.html)
  函数现在会打印到 `STDERR`, 而不是 `STDOUT`.
  > `printStackTrace()` 的输出格式还没有稳定, 可能会发生变更.
  >
  {style="warning"}

#### Atomics API 的改进

在 Kotlin 1.9.0 中, 我们提到, 在 Kotlin/Native 标准库进入稳定版时, Atomics API 也会进入稳定版.
Kotlin 1.9.20 还包含了以下变更:

* 引入了实验性的 `AtomicIntArray`, `AtomicLongArray`, 和 `AtomicArray<T>` 类.
  这些新的类专门设计用来与 Java 的 atomic 数组保持一致, 使得它们将来能够包含进入共通的标准库中.
  > `AtomicIntArray`, `AtomicLongArray`, 和 `AtomicArray<T>` 类是 [实验性功能](components-stability.md#stability-levels-explained).
  > 它们随时有可能变更或被删除.
  > 要试用这些功能, 请使用 `@OptIn(ExperimentalStdlibApi)` 标注使用者同意(Opt-in).
  > 请注意, 只为评估和试验目的来使用这些功能.
  > 希望你能通过我们的 [YouTrack](https://kotl.in/issue) 提供你的反馈意见.
  >
  {style="warning"}
* 在 `kotlin.native.concurrent` 包中, 在 Kotlin 1.9.0 中废弃的 Atomics API, 过去的废弃级别为 `WARNING`, 现在废弃级别提升到了 `ERROR`.
* 在 `kotlin.concurrent` 包中,  [`AtomicInt`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-int/index.html) 和 [`AtomicLong`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-long/index.html) 类的成员函数, 过去的废弃级别为 `ERROR`, 现在已被删除.
* `AtomicReference` 类的所有 [成员函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.concurrent/-atomic-reference/#functions)
  现在使用原子化的函数.

关于 Kotlin 1.9.20 中的所有变更, 请参见我们的 [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-61028/Behavioural-changes-to-the-Native-stdlib-API).

### 改进了 Kotlin/JS 中的 HashMap 操作的性能 {id="improved-performance-of-hashmap-operations-in-kotlin-js"}

Kotlin 1.9.20 改进了 Kotlin/JS 中 `HashMap` 操作的性能, 并减少了它的内存占用量.
在内部, Kotlin/JS 将它的内部实现变更为开放寻址(Open Addressing).
因此, 对于以下情况你会看到性能的改进:
* 向 `HashMap` 插入新的元素.
* 在 `HashMap` 中查找存在的元素.
* 遍历 `HashMap` 的 key 或 value.

## 文档更新

Kotlin 文档有了一些重要变更:
* [JVM 元数据](https://kotlinlang.org/api/kotlinx-metadata-jvm/) API 参考文档 – 查阅这个文档, 看看如何使用 Kotlin/JVM 解析元数据.
* [时间测量指南](time-measurement.md) – 学习如何在 Kotlin 中计算和测量时间.
* 改进了 [Kotlin 观光之旅](kotlin-tour-welcome.md) 中关于集合的章节 – 通过理论和实践章节, 学习 Kotlin 编程语言的基础知识.
* [确定不为 null 的类型](generics.md#definitely-non-nullable-types) – 学习确定不为 null 的泛型类型.
* 改进了关于 [数组](arrays.md) 的章节 – 学习数组, 以及在什么情况下使用它们.
* [Kotlin Multiplatform 中的预期声明与实际声明](multiplatform-expect-actual.md) – 学习 Kotlin Multiplatform 中的预期声明与实际声明机制.

## 安装 Kotlin 1.9.20

### 检查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2023.1.x 和 2023.2.x 会自动建议将 Kotlin plugin 更新到 1.9.20 版本.
IntelliJ IDEA 2023.3 会包含 Kotlin 1.9.20 plugin.

Android Studio Hedgehog (231) 和 Iguana (232) 会在后续的发布版中支持 Kotlin 1.9.20.

新的命令行编译器可以通过 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.9.20) 下载.

### 配置 Gradle 的设置 {id="configure-gradle-settings"}

要下载 Kotlin 的 artifact 和依赖项, 请更新你的 `settings.gradle(.kts)` 文件, 使用 Maven Central 仓库:

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```
{validate="false"}

如果没有指定仓库, Gradle 会使用已废弃的 JCenter 仓库, 导致无法下载 Kotlin artifact 的错误.
