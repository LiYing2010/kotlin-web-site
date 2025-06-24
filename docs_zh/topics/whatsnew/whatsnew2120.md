[//]: # (title: Kotlin 2.1.20 中的新功能)

_[发布日期: 2025/03/20](releases.md#release-details)_

Kotlin 2.1.20 已经发布了! 以下是它的一些最重要的功能:

* **K2 编译器 更新**: [对新的 kapt 和 Lombok plugin 的更新](#kotlin-k2-compiler)
* **Kotlin Multiplatform**: [替代 Gradle 的 Application plugin 的新 DSL](#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)
* **Kotlin/Native**: [新的内联(inlining)优化](#new-inlining-optimization)
* **Kotlin/Wasm**: [默认使用自定义格式(Custom Formatter), 支持 DWARF, 以及迁移到 Provider API](#kotlin-wasm)
* **Gradle 支持**: [兼容 Gradle 的隔离项目(Isolated Project)和自定义发布变体(Publication Variant)](#gradle)
* **标准库**: [共通的原子类型, UUID 支持的改进, 以及新的时间追踪功能](#standard-library)
* **Compose 编译器**: [放宽了 `@Composable` 函数的限制, 以及其它更新](#compose-compiler)
* **文档**: [Kotlin 文档的一些重要改进](#documentation-updates).

## IDE 支持 {id="ide-support"}

最新的 IntelliJ IDEA 和 Android Studio 中绑定了支持 2.1.20 的 Kotlin plugin.
你不需要在你的 IDE 中更新 Kotlin plugin.
你需要做的只是在你的构建脚本中将 Kotlin 版本修改为 2.1.20.

详情请参见 [更新到新的发布版](releases.md#update-to-a-new-kotlin-version).

### 在支持 OSGi 的项目中下载 Kotlin artifact 源代码 {id="download-sources-for-kotlin-artifacts-in-projects-with-osgi-support"}

`kotlin-osgi-bundle` 库的所有依赖项的源代码现在都包含在发行版中.
因此 IntelliJ IDEA 可以下载这些源代码, 提供 Kotlin 符号的文档, 并改善调试体验.

## Kotlin K2 编译器 {id="kotlin-k2-compiler"}

我们一直在持续的改进对新的 Kotlin K2 编译器的 plugin 支持.
这个发布版带来了对新的 kapt 和 Lombok plugin 的更新.

### 默认启用新的 kapt plugin {id="new-default-kapt-plugin"}
<primary-label ref="beta"/>

从 Kotlin 2.1.20 开始, 对所有的项目默认启用 kapt 编译器 plugin 的 K2 实现.

JetBrains 开发组早在 Kotlin 1.9.20 中就发布了与 K2 编译器配合工作的 kapt plugin 的新实现.
之后, 我们进一步开发了 K2 kapt 的内部实现, 并让它的行为接近于 K1 版本, 同时显著的提升了它的性能.

如果你在使用 kapt 和 K2 编译器时遇到任何问题, 可以暂时回退到之前的 plugin 实现.

方法是, 向你的项目的 `gradle.properties` 文件添加以下选项:

```kotlin
kapt.use.k2=false
```

如果遇到问题, 请在我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback) 中提交报告.

### Lombok 编译器 plugin: 支持 `@SuperBuilder`, 以及对 `@Builder` 的更新 {id="lombok-compiler-plugin-support-for-superbuilder-and-updates-on-builder"}
<primary-label ref="experimental-general"/>

[Kotlin Lombok 编译器 plugin](lombok.md) 现在支持 `@SuperBuilder` 注解, 可以更加容易的为类的层级结构创建构建器.
之前, 在 Kotlin 中使用 Lombok 的开发者, 在使用类的层级结构时必须手动定义构建器.
通过 `@SuperBuilder`, 构建器会自动继承父类的域变量, 你可以在构建对象时初始化它们.

此外, 这个更新还包含几个改进和 bug 修正:

* `@Builder` 注解现在可以用于构造器, 能够更加灵活的创建对象.
  详情请参见对应的 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-71547).
* 修正了与 Kotlin 中 Lombok 代码生成相关的几个问题, 改进了整体的兼容性.
  详情请参见 [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20).

关于 `@SuperBuilder` 注解, 详情请参见官方的 [Lombok 文档](https://projectlombok.org/features/experimental/SuperBuilder).

## Kotlin Multiplatform: 替代 Gradle 的 Application plugin 的新 DSL {id="kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin"}
<primary-label ref="experimental-opt-in"/>

从 Gradle 8.7 开始, [Application](https://docs.gradle.org/current/userguide/application_plugin.html) plugin 与 Kotlin Multiplatform Gradle plugin 不再兼容.
Kotlin 2.1.20 引入了实验性的 DSL, 来实现类似的功能.
新的 `executable {}` 代码段会为 JVM 编译目标配置执行 task, 以及 Gradle [发布](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin).

在你的构建脚本的 `executable {}` 代码段之前, 请添加以下 `@OptIn` 注解:

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
```

例如:

```kotlin
kotlin {
    jvm {
        @OptIn(ExperimentalKotlinGradlePluginApi::class)
        binaries {
            // 为这个编译目标中的 "main" 编译任务, 配置一个 JavaExec task, 名为 "runJvm", 以及一个 Gradle 发布
            executable {
                mainClass.set("foo.MainKt")
            }

            // 为 "main" 编译任务, 配置一个 JavaExec task, 名为 "runJvmAnother", 以及一个 Gradle 发布
            executable(KotlinCompilation.MAIN_COMPILATION_NAME, "another") {
                // 设置不同的类
                mainClass.set("foo.MainAnotherKt")
            }

            // 为 "test" 编译任务, 配置一个 JavaExec task, 名为 "runJvmTest", 以及一个 Gradle 发布
            executable(KotlinCompilation.TEST_COMPILATION_NAME) {
                mainClass.set("foo.MainTestKt")
            }

            // 为 "test" 编译任务, 配置一个 JavaExec task, 名为 "runJvmTestAnother", 以及一个 Gradle 发布 
            executable(KotlinCompilation.TEST_COMPILATION_NAME, "another") {
                mainClass.set("foo.MainAnotherTestKt")
            }
        }
    }
}
```

在这个示例中, Gradle 的 [Distribution](https://docs.gradle.org/current/userguide/distribution_plugin.html#distribution_plugin) plugin 会被适用于第一个 `executable {}` 代码段.

如果遇到问题, 请在我们的 [问题追踪系统](https://kotl.in/issue) 中提交报告, 或在我们的 [公开 Slack 频道](https://kotlinlang.slack.com/archives/C19FD9681) 中通知我们.

## Kotlin/Native: 新的内联(inlining)优化 {id="new-inlining-optimization"}
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 引入了新的内联优化过程, 这个过程发生在实际的代码生成阶段之前.

Kotlin/Native 编译器中的新的内联过程应该比标准的 LLVM 内敛器表现更好, 并能够改进生成的代码的运行期性能.

新的内联过程目前是 [实验性功能](components-stability.md#stability-levels-explained). 要试用这个功能, 请使用以下编译器选项:

```none
-Xbinary=preCodegenInlineThreshold=40
```

我们的实验显示, 将阈值设置为 40 个 token (由编译器解析的代码单元) 可以为编译优化提供合理的折衷方案.
根据我们的基准测试, 这个设置可以让整体性能提升 9.5%. 当然, 你也可以尝试其它阈值设置.

如果你遇到二进制文件尺寸变大, 或编译时间变长的问题, 请在 [YouTrack](https://kotl.in/issue) 中提交报告.

## Kotlin/Wasm {id="kotlin-wasm"}

这个发布版改进了 Kotlin/Wasm 的调试和属性使用. 自定义格式(Custom Formatter)现在可以在开发构建中开箱即用,
DWARF 调试功能改进了代码检查.
此外, Provider API 简化了 Kotlin/Wasm 和 Kotlin/JS 中的属性使用.

### 默认启用自定义格式(Custom Formatter) {id="custom-formatters-enabled-by-default"}

之前, 在开发 Kotlin/Wasm 代码时, 你必须 [手动配置](whatsnew21.md#improved-debugging-experience-for-kotlin-wasm) 自定义格式(Custom Formatter) 来改善 Web 浏览器中的调试.

在这个发布版中, 在开发构建中默认启用自定义格式, 因此你不需要进行额外的 Gradle 配置.

要使用这个功能, 你只需要在你的浏览器的开发者工具中确保启用了自定义格式:

* 在 Chrome DevTools 中, 请在 **Settings | Preferences | Console** 中找到 Custom formatters 选择框:

  ![在 Chrome 中启用自定义格式](wasm-custom-formatters-chrome.png){width=400}

* 在 Firefox DevTools 中, 请在 **Settings | Advanced settings** 找到 Custom formatters 选择框:

  ![在 Firefox 中启用自定义格式](wasm-custom-formatters-firefox.png){width=400}

这个变更主要影响 Kotlin/Wasm 的开发构建(Development Build).
如果对生产构建(Production Build)有特定的要求, 你需要相应的调整你的 Gradle 配置.
方法是, 向 `wasmJs {}` 代码段添加以下编译器选项:

```kotlin
// build.gradle.kts
kotlin {
    wasmJs {
        // ...

        compilerOptions {
            freeCompilerArgs.add("-Xwasm-debugger-custom-formatters")
        }
    }
}
```

### 支持 DWARF 调试 Kotlin/Wasm 代码 {id="support-for-dwarf-to-debug-kotlin-wasm-code"}

Kotlin 2.1.20 在 Kotlin/Wasm 中引入了对 DWARF (debugging with arbitrary record format) 的支持.

通过这个变更, Kotlin/Wasm 编译器能够将 DWARF 数据嵌入到生成的 WebAssembly (Wasm) 二进制文件中.
很多调试器和虚拟机能够读取这个数据, 深入了解编译后的代码.

DWARF 主要用于在独立的 Wasm 虚拟机 (VM) 中调试 Kotlin/Wasm 应用程序.
要使用这个功能, Wasm VM 和调试器必须支持 DWARF.

通过支持 DWARF, 你可以单步执行 Kotlin/Wasm 应用程序, 查看变量, 以及检查代码.
要启用这个功能, 请使用以下编译器选项:

```bash
-Xwasm-generate-dwarf
```
### 迁移到 Kotlin/Wasm 和 Kotlin/JS 属性的 Provider API {id="migration-to-provider-api-for-kotlin-wasm-and-kotlin-js-properties"}

之前, Kotlin/Wasm 和 Kotlin/JS 扩展中的属性必须是可变的 (`var`), 并在构建脚本中直接赋值:

```kotlin
the<NodeJsExtension>().version = "2.0.0"
```

现在, 属性通过 [Provider API](https://docs.gradle.org/current/userguide/properties_providers.html) 公开,
你必须使用 `.set()` 函数来赋值:

```kotlin
the<NodeJsEnvSpec>().version.set("2.0.0")
```

Provider API 确保值被延迟计算, 并与 task 依赖项正确的集成, 改进构建性能.

通过这个变更, 对属性直接赋值已被废弃, 请改用 `*EnvSpec` 类, 例如 `NodeJsEnvSpec` 和 `YarnRootEnvSpec`.

此外, 还删除了几个别名 task, 以避免混淆:

| 废弃的 task               | 替代者                                                            |
|------------------------|----------------------------------------------------------------|
| `wasmJsRun`            | `wasmJsBrowserDevelopmentRun`                                  |
| `wasmJsBrowserRun`     | `wasmJsBrowserDevelopmentRun`                                  |
| `wasmJsNodeRun`        | `wasmJsNodeDevelopmentRun`                                     |
| `wasmJsBrowserWebpack` | `wasmJsBrowserProductionWebpack` 或 `wasmJsBrowserDistribution` |
| `jsRun`                | `jsBrowserDevelopmentRun`                                      |
| `jsBrowserRun`         | `jsBrowserDevelopmentRun`                                      |
| `jsNodeRun`            | `jsNodeDevelopmentRun`                                         |
| `jsBrowserWebpack`     | `jsBrowserProductionWebpack` 或 `jsBrowserDistribution`         |

如果你在构建脚本中只使用 Kotlin/JS 或 Kotlin/Wasm, 那么不必进行任何行动, 因为 Gradle 会自动处理赋值.

但是, 如果你在维护基于 Kotlin Gradle Plugin 的 plugin, 而且你的 plugin 没有适用 `kotlin-dsl`,
那么你必须更新属性赋值语句, 改为使用 `.set()` 函数.

## Gradle {id="gradle"}

Kotlin 2.1.20 完全兼容于 Gradle 版本 7.6.3 到 8.11. 你也可以使用 Gradle 的最新版本.
但请注意, 这样可能会导致废弃警告, 以及一些新的 Gradle 特性可能无法工作.

这个版本的 Kotlin 包括, Kotlin Gradle plugin 兼容 Gradle 的隔离项目(Isolated Project),
以及对自定义 Gradle 发布变体(Publication Variant)的支持.

### Kotlin Gradle plugin 兼容 Gradle 的隔离项目(Isolated Project) {id="kotlin-gradle-plugins-compatible-with-gradle-s-isolated-projects"}
<primary-label ref="experimental-opt-in"/>

> 这个功能在 Gradle 中目前处于前 Alpha 阶段. 目前不支持 JS 和 Wasm 编译目标.
> 请只在 Gradle 8.10 或更高版本中使用, 而且只用于评估目的.
>
{style="warning"}

从 Kotlin 2.1.0 开始, 你可以在你的项目中 [预览使用 Gradle 的隔离项目功能](whatsnew21.md#preview-gradle-s-isolated-projects-in-kotlin-multiplatform).

之前, 你必须配置 Kotlin Gradle plugin 来让你的项目兼容于隔离项目功能, 然后才能试用这个功能.
在 Kotlin 2.1.20 中, 不再需要这个额外的步骤了.

现在, 要启用隔离项目功能, 你只需要 [设置系统属性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it).

Kotlin Gradle plugin 插件支持的 Gradle 的隔离项目功能, 可以用于跨平台项目和只包含 JVM 或 Android 编译目标的项目.

特别是对于跨平台项目, 如果升级后在你的 Gradle 构建中发现问题,
你可以选择关闭新的 Kotlin Gradle plugin 行为, 方法是添加以下设定:

```none
kotlin.kmp.isolated-projects.support=disable
```

但是, 如果在你的跨平台项目中使用这个 Gradle 属性, 你将无法使用隔离项目功能.

请在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 中分享你使用这个功能的体验.

### 支持添加自定义的 Gradle 发布变体(Publication Variant) {id="support-for-adding-custom-gradle-publication-variants"}
<primary-label ref="experimental-opt-in"/>

Kotlin 2.1.20 引入了对添加自定义 [Gradle 发布变体(Publication Variant)](https://docs.gradle.org/current/userguide/variant_attributes.html) 的支持.
这个功能可以用于跨平台项目和 JVM 平台项目.

> 你不能通过这个功能来修改已经存在的 Gradle 变体.
>
{style="note"}

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
要选择使用者同意, 请使用 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 注解.

要添加一个自定义的 Gradle 发布变体, 请调用 `adhocSoftwareComponent()` 函数, 它返回一个
[`AdhocComponentWithVariants`](https://docs.gradle.org/current/javadoc/org/gradle/api/component/AdhocComponentWithVariants.html) 实例, 你可以在 Kotlin DSL 中对它进行配置:

```kotlin
plugins {
    // 只支持 JVM 和 跨平台
    kotlin("jvm")
    // 或
    kotlin("multiplatform")
}

kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    publishing {
        // 返回一个 AdhocSoftwareComponent 实例
        adhocSoftwareComponent()
        // 或者, 你也可以在 DSL 代码段中配置 AdhocSoftwareComponent, 如下
        adhocSoftwareComponent {
            // 在这里使用 AdhocSoftwareComponent API, 添加你的自定义变体
        }
    }
}
```

> 关于变体, 详情请参见 Gradle 的 [自定义发布指南](https://docs.gradle.org/current/userguide/publishing_customization.html).
>
{style="tip"}

## 标准库 {id="standard-library"}

这个发布版为标准库带来了新的实验性功能: 共通的原子类型, 改进了对 UUID 的支持,
以及新的时间追踪功能.

### 共通的原子类型 {id="common-atomic-types"}
<primary-label ref="experimental-opt-in"/>

在 Kotlin 2.1.20 中, 我们在标准库的 `kotlin.concurrent.atomics` 包中引入了共通的原子类型, 对线程安全的操作, 支持共用的, 平台独立的代码.
这样能够在各个数据集中消除重复的原子操作相关的代码逻辑, 简化 Kotlin 跨平台项目的开发.

`kotlin.concurrent.atomics` 包, 以及它的属性是 [实验性功能](components-stability.md#stability-levels-explained).
要选择使用者同意, 请使用 `@OptIn(ExperimentalAtomicApi::class)` 注解, 或编译器选项 `-opt-in=kotlin.ExperimentalAtomicApi`.

下面是一个示例, 演示如何使用 `AtomicInt`, 跨越多个线程安全的对已处理的项目进行计数:

```kotlin
// 导入需要的库
import kotlin.concurrent.atomics.*
import kotlinx.coroutines.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
suspend fun main() {
    // 初始化原子化计数器, 用于已处理的项目
    var processedItems = AtomicInt(0)
    val totalItems = 100
    val items = List(totalItems) { "item$it" }
    // 将项目拆分为多个块, 由多个协程进行处理
    val chunkSize = 20
    val itemChunks = items.chunked(chunkSize)
    coroutineScope {
        for (chunk in itemChunks) {
            launch {
                for (item in chunk) {
                    println("Processing $item in thread ${Thread.currentThread()}")
                    processedItems += 1 // 以原子化方式增加计数器
                }
            }
         }
    }
//sampleEnd
    // 打印输出已处理的项目的总数
    println("Total processed items: ${processedItems.load()}")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

为了实现 Kotlin 的原子类型和 Java 的 [`java.util.concurrent.atomic`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/package-summary.html)
原子类型之间的无缝集成, API 提供了 `.asJavaAtomic()` 和 `.asKotlinAtomic()` 扩展函数.
在 JVM 平台, Kotlin 原子类型和 Java 原子类型在运行期是相同的类型, 因此你可以将 Java 原子类型转换为 Kotlin 原子类型,
或者反过来, 不会发生任何开销.

下面是一个示例, 演示 Kotlin 和 Java atomic 原子类型如何协同工作:

```kotlin
// 导入需要的库
import kotlin.concurrent.atomics.*
import java.util.concurrent.atomic.*

//sampleStart
@OptIn(ExperimentalAtomicApi::class)
fun main() {
    // 将 Kotlin 的 AtomicInt 转换为 Java 的 AtomicInteger
    val kotlinAtomic = AtomicInt(42)
    val javaAtomic: AtomicInteger = kotlinAtomic.asJavaAtomic()
    println("Java atomic value: ${javaAtomic.get()}")
    // 输出结果为: Java atomic value: 42

    // 将 Java 的 AtomicInteger 转换回 Kotlin 的 AtomicInt
    val kotlinAgain: AtomicInt = javaAtomic.asKotlinAtomic()
    println("Kotlin atomic value: ${kotlinAgain.load()}")
    // 输出结果为: Kotlin atomic value: 42
}
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### UUID 解析, 格式化, 以及兼容性的变更 {id="changes-in-uuid-parsing-formatting-and-comparability"}
<primary-label ref="experimental-opt-in"/>

JetBrains 开发组在持续的改进对 [在 2.0.20 中引入到标准库](whatsnew2020.md#support-for-uuids-in-the-common-kotlin-standard-library) 的 UUID 的支持.

之前, `parse()` 函数只支持 "16进制-横线" 格式的 UUID.
在 Kotlin 2.1.20 中, `parse()` 能够 _同时_ 处理 "16进制-横线" 和 "纯16进制" (没有横线) 格式.

在这个发布版中, 我们还引入了专用于操作 "16进制-横线" 格式的函数:

* `parseHexDash()`, 从 "16进制-横线" 格式解析 UUID.
* `toHexDashString()`, 将一个 `Uuid` 转换为 `String`, 使用 "16进制-横线" 格式 (与 `toString()` 的功能完全相同).

这些函数类似于之前版本引入的, 处理16进制格式的 [`parseHex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/parse-hex.html) 和 [`toHexString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/to-hex-string.html) 函数.
对解析和格式化功能明确命名, 可以改善代码的清晰度以及你使用 UUID 时的整体体验.

Kotlin 中的 UUID 现在是 `Comparable` 类型.
从 Kotlin 2.1.20 开始, 你可以直接对 `Uuid` 类型的值进行比较和排序.
因此可以使用 `<` 和 `>` 操作符, 以及标准库中专用于 `Comparable` 类型或 `Comparable` 类型构成的集合的扩展 (例如 `sorted()`),
而且可以将 UUID 传递给接口中要求 `Comparable` 类型的任何函数或 API.

请记住, 标准库中的 UUID 支持功能还是 [实验性功能](components-stability.md#stability-levels-explained).
要选择使用者同意, 请使用 `@OptIn(ExperimentalUuidApi::class)` 注解, 或编译器选项 `-opt-in=kotlin.uuid.ExperimentalUuidApi`:

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

//sampleStart
@OptIn(ExperimentalUuidApi::class)
fun main() {
    // parse() 接受纯16进制格式的 UUID
    val uuid = Uuid.parse("550e8400e29b41d4a716446655440000")

    // 转换为 "16进制-横线" 格式
    val hexDashFormat = uuid.toHexDashString()
 
    // 使用 "16进制-横线" 格式输出 UUID
    println(hexDashFormat)

    // 按照升序排列, 输出 UUID
    println(
        listOf(
            uuid,
            Uuid.parse("780e8400e29b41d4a716446655440005"),
            Uuid.parse("5ab88400e29b41d4a716446655440076")
        ).sorted()
    )
   }
//sampleEnd
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

### 新的时间追踪功能 {id="new-time-tracking-functionality"}
<primary-label ref="experimental-opt-in"/>

从 Kotlin 2.1.20 开始, 标准库提供了表示某个时刻的功能.
这个功能只存在于 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) 中, 这是一个官方的 Kotlin 库.

[`kotlinx.datetime.Clock`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-clock/) 接口现在引入到标准库中, 成为 `kotlin.time.Clock`,
[`kotlinx.datetime.Instant`](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/-instant/) 类成为 `kotlin.time.Instant`.
这些概念自然的与标准库中的 `time` 包保持一致, 因为它们只关注某个时刻, 更复杂的日历和时区功能继续保留在 `kotlinx-datetime` 中.

如果你需要精确的时间追踪, 而不考虑时区或日期, `Instant` 和 `Clock` 会非常有用.
例如, 你可以使用它们记录带时间戳的事件, 测量两个时间点之间的时长, 以及获取系统进程的目前时刻.

为了提供与其它语言的交互能力, 还提供了额外的转换函数:

* `.toKotlinInstant()` 将一个时间值转换为 `kotlin.time.Instant` 的实例.
* `.toJavaInstant()` 将 `kotlin.time.Instant` 值转换为 `java.time.Instant` 值.
* `Instant.toJSDate()` 将 `kotlin.time.Instant` 值转换为 JS `Date` 类的实例.
  这个转换并不精确; JS 使用毫秒精度表示日期, 而 Kotlin 可以使用纳秒精度.

标准库的新的时间功能还是 [实验性功能](components-stability.md#stability-levels-explained).
要选择使用者同意, 请使用 `@OptIn(ExperimentalTime::class)` 注解:

```kotlin
import kotlin.time.*

@OptIn(ExperimentalTime::class)
fun main() {

    // 得到目前时刻
    val currentInstant = Clock.System.now()
    println("Current time: $currentInstant")

    // 计算两个时刻之间的差值
    val pastInstant = Instant.parse("2023-01-01T00:00:00Z")
    val duration = currentInstant - pastInstant

    println("Time elapsed since 2023-01-01: $duration")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="2.1.20"}

关于具体实现, 请参见这个 [KEEP 提案](https://github.com/Kotlin/KEEP/pull/387/files).

## Compose 编译器 {id="compose-compiler"}

在 2.1.20 中, Compose 编译器放宽了之前版本中引入的 `@Composable` 函数的一些限制.
此外, Compose 编译器 Gradle plugin 默认设置为包含源代码信息, 使所有平台的行为与 Android 保持一致.

### 支持 open 的 `@Composable` 函数中的默认参数 {id="support-for-default-arguments-in-open-composable-functions"}

之前, 编译器限制了 open 的 `@Composable` 函数中的默认参数, 原因是编译器输出不正确, 会导致运行期崩溃.
底层的问题现在已经解决, 在与 Kotlin 2.1.20 或更高版本一起使用时, 完全支持默认参数.

Compose 编译器在 [版本 1.5.8](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8) 之前, 允许使用 open 的函数中的默认参数, 因此这种支持依赖于项目配置:

* 如果一个 open 的 composable 函数使用 Kotlin version 2.1.20 或更高版本编译, 编译器会为默认参数生成正确的包装器.
  包括与 1.5.8 之前版本二进制文件兼容的包装器, 这就意味着下游库也能够使用这个 open 函数.
* 如果 open 的 composable 函数使用 Kotlin 2.1.20 之前的版本编译, Compose 会使用兼容模式, 可能导致运行期崩溃.
  使用兼容模式时, 编译器会发出警告, 标记出潜在的问题.

### final 覆盖函数允许重新启动 {id="final-overridden-functions-are-allowed-to-be-restartable"}

虚函数 (对 `open` 和 `abstract` 的覆盖, 包括接口) [从 2.1.0 版开始强制为不可重新启动](whatsnew21.md#changes-to-open-and-overridden-composable-functions).
对于 final 类的成员函数, 或本身为 `final` 的函数, 这个限制现在已经放宽了 – 它们将象通常那样重新启动, 或跳过.

升级到 Kotlin 2.1.20 之后, 你可能会看到受影响的函数的一些行为发生了变化.
如果要强制使用之前版本的不可重新启动逻辑, 请对函数使用 `@NonRestartableComposable` 注解.

### 从 public API 中删除了 `ComposableSingletons` {id="composablesingletons-removed-from-public-api"}

`ComposableSingletons` 是 Compose 编译器在优化 `@Composable` Lambda 表达式时创建的类.
不捕获任何参数的 Lambda 表达式只分配一次, 并缓存在这个类的一个属性中, 以节约运行期的分配.
这个类生成时可见度为 internal, 只用于在一个编译单元(通常是一个文件)中优化 Lambda 表达式.

但是, 这个优化也应用于 `inline` 函数的 body 部, 导致单体 Lambda 表达式实例泄露到 public API 中.
为了解决这个问题, 从 2.1.20 开始, `@Composable` Lambda 表达式不再被优化为内联函数中的单体.
同时, Compose 编译器会继续为内联函数生成单体类和 Lambda 表达式, 以支持在之前模式下编译的模块的二进制兼容性.

### 默认包含源代码信息 {id="source-information-included-by-default"}

Compose 编译器 Gradle plugin 在 Android 中已经默认启用了 [包含源代码信息](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/include-source-information.html) 功能.
从 Kotlin 2.1.20 开始, 这个功能会对所有的平台默认启用.

请记得检查是否使用 `freeCompilerArgs` 设置了这个选项.
这个方法在与 plugin 一起使用时, 可能导致构建失败, 因为选项实际上被设置了两次.

## 破坏性变更和废弃 {id="breaking-changes-and-deprecations"}

* 为了让 Kotlin Multiplatform 与 Gradle 中即将推出的变更保持一致, 我们会逐步废弃 `withJava()` 函数.
  [现在会默认创建 Java 源代码集](multiplatform-compatibility-guide.md#java-source-sets-created-by-default).

* JetBrains 开发组正在逐步废弃 `kotlin-android-extensions` plugin.
  如果试图在你的项目中使用它, 现在会发生配置错误, 不会执行任何 plugin 代码.

* 旧的 `kotlin.incremental.classpath.snapshot.enabled` 属性已从 Kotlin Gradle plugin 中删除.
  过去这个属性用来在 JVM 上提供回退到内建的 ABI 快照的功能.
  plugin 现在使用其它方法来检测, 并避免不必要的重编译, 因此淘汰了这个属性.

## 文档更新 {id="documentation-updates"}

Kotlin 文档有了一些重要更新:

### 改版和新增页面 {id="revamped-and-new-pages"}

* [Kotlin 发展路线图](roadmap.md)
  – 查看 Kotlin 在语言和生态系统演化方面的优先事项最新列表.
* [Gradle 最佳实践](gradle-best-practices.md) 页面
  – 学习关于优化 Gradle 构建和改善性能的基本的最佳实践.
* [Compose Multiplatform 与 Jetpack Compose](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-and-jetpack-compose.html)
  – 关于这两个 UI 框架之间关系的概述.
* [Kotlin Multiplatform 与 Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html)
  – 查看这两个流行的跨平台框架的比较.
* [与 C 代码交互](native-c-interop.md)
  – 探索 Kotlin 与 C 交互的细节.
* [数值类型](numbers.md)
  – 了解用于表示数值的各种 Kotlin 类型.

### 新的和更新的教程 {id="new-and-updated-tutorials"}

* [将你的库发布到 Maven Central](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)
  – 学习如何将 KMP 库 artifact 发布到最流行的 Maven 仓库.
* [使用 Kotlin/Native 开发动态库](native-dynamic-libraries.md)
  – 创建动态 Kotlin 库.
* [使用 Kotlin/Native 开发 Apple Framework](apple-framework.md)
  – 创建你的自己的 Framework, 并在 macOS 和 iOS 上的 Swift/Objective-C 应用程序中使用 Kotlin/Native 代码.

## 如何更新到 Kotlin 2.1.20 {id="how-to-update-to-kotlin-2-1-20"}

从 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 开始, Kotlin plugin 作为一个包含在 IDE 中的捆绑 plugin 发布.
这意味着你不再能够通过 JetBrains Marketplace 安装这个 plugin.

要更新到新的 Kotlin 版本, 请在你的构建脚本中 [变更 Kotlin 版本](releases.md#update-to-a-new-kotlin-version)到 2.1.20.
