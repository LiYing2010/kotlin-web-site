[//]: # (title: Kotlin 2.4.20 中的新功能)

<show-structure depth="2"/>

<web-summary>阅读 Kotlin 2.4.20 发布说明, 包括实验性的新功能, 以及标准库, Native, Wasm, JS, Gradle, BTA 和 Kotlin 编译器的更新</web-summary>

_[发布日期: 2026/09/07](releases.md#release-history)_

Kotlin 2.4.20 已经发布了! 以下是它的一些最重要的功能:

* **标准库:** [支持协程的堆栈跟踪恢复, 新函数, 用于检查集合元素是否相等或唯一, 以及 `kotlin.test` 断言函数的新的重载](#standard-library)
* **Kotlin/Native:** [Swift 导出的新功能, 改进了增量编译, 以及为 SwiftPM 依赖项自动生成 `Package.swift` 文件](#kotlin-native)
* **Kotlin/Wasm:** [`@JsFun` 声明中顶层 `require()` 调用的变更, 改进了同伴对象的初始化顺序, 在 Kotlin Gradle plugin 中支持 Wasmtime, 新的编译模式, 以及缩小了函数式接口的二进制文件大小](#kotlin-wasm)
* **Kotlin/JS:** [新的浏览器测试 DSL, 支持将挂起的 Lambda 表达式导出为异步函数, 以及改进了数据类的导出能力](#kotlin-js)
* **Gradle:** [支持 Gradle 9.7.0, 以及改进了 Problems API 中的报告](#gradle)
* **构建工具 API:** [支持新的编译目标: Kotlin/JS, Kotlin/Wasm, 以及 Kotlin Metadata](#build-tools-api)
* **Kotlin 编译器:** [`kotlinr` 运行命令, 以及独立的原生镜像](#kotlin-compiler)

> 关于 Kotlin 的发布周期, 详情请参见 [Kotlin 发布过程](releases.md).
>
{style="tip"}

## 升级到 Kotlin 2.4.20 {id="update-to-kotlin-2-4-20"}

Kotlin 的最新版本已包含在 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
和 [Android Studio](https://developer.android.com/studio) 的最新版本中.

要升级到新的 Kotlin 版本, 请确保你的 IDE 已更新到最新版本, 并在构建脚本中 [修改 Kotlin 版本](releases.md#update-to-a-new-kotlin-version)
为 2.4.20.

## 新的稳定版功能特性 {id="new-stable-features"}
<primary-label ref="stable"/>

Kotlin 2.2.20 为 JVM 21 及更高版本引入了实验性的功能,
使用 `invokedynamic` 编译 `when` 表达式.

在 Kotlin 2.4.20 中, 这个功能已达到 [稳定](components-stability.md#stability-levels-explained) 状态, 并默认启用.

详情请参见 [文档](control-flow.md#bytecode-generation-on-the-jvm).

## 新的未稳定版功能特性 {id="new-experimental-features"}
<primary-label ref="experimental-exp"/>

这个发布版包括以下未稳定的功能特性,
包括处于 [Beta](components-stability.md#stability-levels-explained), [Alpha](components-stability.md#stability-levels-explained), 以及 [实验性](components-stability.md#stability-levels-explained) 状态的功能:

* [标准库: 支持协程的堆栈跟踪恢复](#support-for-coroutine-stack-trace-recovery)
* [标准库: 新函数, 用于检查集合元素是否相等或唯一](#new-functions-to-check-collection-elements-for-equality-and-uniqueness)
* [标准库: `kotlin.test` 断言函数的新的重载](#new-overloads-for-kotlin-test-assertion-functions)
* [Kotlin/Native: Swift 导出的新功能](#new-swift-export-features)
* [Kotlin/Native: 改进了 `klib` artifact 的增量编译](#improved-incremental-compilation-of-klib-artifacts)
* [Kotlin/JS: 新的浏览器测试 DSL](#a-new-dsl-for-browser-testing)
* [Kotlin/JS: 支持将挂起的 Lambda 表达式导出为异步函数](#support-for-exporting-suspending-lambdas-as-async-functions)
* [构建工具 API: 支持 Kotlin/JS, Kotlin/Wasm, 以及 Kotlin Metadata](#support-for-kotlin-js-kotlin-wasm-and-kotlin-metadata)
* [Kotlin 编译器: 独立的原生镜像](#native-image)

## 标准库 {id="standard-library"}

Kotlin 2.4.20 新增了协程的堆栈跟踪恢复功能, 引入了新函数, 用于检查集合元素是否相等或唯一,
并为 `kotlin.test` 断言函数增加了新的重载.

### 协程的堆栈跟踪恢复功能 {id="support-for-coroutine-stack-trace-recovery"}
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="standard-library"/>

Kotlin 2.4.20 在标准库中新增了 [`StackTraceRecoverable`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines.debug/-stack-trace-recoverable/) 接口.
通过这个接口, 你可以定义堆栈跟踪恢复时如何创建新的异常实例, 而不需要添加对 `kotlinx.coroutines` 的依赖,
因此改善了与 `kotlinx.coroutines` 库的集成.

当一个协程抛出异常, 而另一个协程重新抛出这个异常时, 堆栈跟踪恢复功能有助于进行调试.
你可以看到异常的原始来源, 以及另一个协程重新抛出它的位置.

`kotlinx.coroutines` 库能够恢复堆栈跟踪, 方法是创建新异常实例, 其中包含额外的协程堆栈跟踪信息.
如果异常的构造器只接收异常消息, 原因, 或者两者都有, 或者没有任何参数, 那么这个过程会自动进行.

如果异常的构造器还需要其他必须的参数, 例如行号或错误代码, 请实现 `StackTraceRecoverable` 接口,
定义 `kotlinx.coroutines` 库应该如何创建这个异常的新实例.

要实现这个接口, 请覆盖 [`copyForStackTraceRecovery()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.coroutines.debug/-stack-trace-recoverable/copy-for-stack-trace-recovery.html) 函数.
在覆盖函数中, 返回用于堆栈跟踪恢复的新的异常实例, 如果不希望 `kotlinx.coroutines` 库复制这个异常, 请返回 `null`.

> `StackTraceRecoverable` 接口适用于所有编译目标, 但 `kotlinx.coroutines` 库只在 JVM 上使用它恢复堆栈跟踪.
>
{style="note"}

这些 API 处于 [实验性](components-stability.md#stability-levels-explained) 状态,
需要使用 `@OptIn(ExperimentalStdlibCoroutineSupportApi::class)` 注解表示使用者同意.

下面是一个自定义异常的示例, 展示在为堆栈跟踪恢复创建新的实例时, 如何保留 `line` 属性:

```kotlin
import kotlin.coroutines.ExperimentalStdlibCoroutineSupportApi
import kotlin.coroutines.debug.StackTraceRecoverable

@OptIn(ExperimentalStdlibCoroutineSupportApi::class)
class FileEditException
// 这个实现需要 private 构造器,
// 将异常原因传递给 IllegalStateException 构造器
private constructor(
    val line: Int,
    private val detail: String,
    cause: Throwable?,
) : IllegalStateException("When editing line $line: $detail", cause),
    // 实现 StackTraceRecoverable, 用于恢复堆栈跟踪
    StackTraceRecoverable<FileEditException> {

    constructor(line: Int, detail: String) : this(line, detail, null)

    // 复制行号和详细的消息
    override fun copyForStackTraceRecovery(): FileEditException =
        FileEditException(line, detail, this)
}

fun main() {
    val original = FileEditException(15, "Unexpected token")

    // 通常不需要直接调用这个函数, 除非要测试它的行为
    // kotlinx.coroutines 库会在恢复堆栈跟踪时自动调用它
    val copy = original.copyForStackTraceRecovery()

    println(copy.message)
    // 输出结果为: When editing line 15: Unexpected token

    println(copy.cause == original)
    // 输出结果为: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4.20"}

详情请参见这个功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/stdlib/KEEP-0461-stacktrace-recoverable.md).

欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-86595) 中提供反馈意见.

### 新函数, 检查集合元素是否相等或唯一 {id="new-functions-to-check-collection-elements-for-equality-and-uniqueness"}
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="standard-library"/>

在 Kotlin 2.4.20 之前, 如果要检查集合中的元素是否全部不同或全部相等, 必须使用效率不高的代码模式.

Kotlin 2.4.20 引入了以下实验性函数来填补这一空缺:

| 函数                                                                                                       | 检查内容                        |
|------------------------------------------------------------------------------------------------------------|---------------------------------|
| [`allDistinct()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/all-distinct.html)      | 集合中的每个值是否唯一.         |
| [`allDistinctBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/all-distinct-by.html) | 每个对象的指定的属性值是否唯一. |
| [`allEqual()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/all-equal.html)            | 集合中的每个值是否相同.         |
| [`allEqualBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/all-equal-by.html)       | 每个对象的指定的属性值是否相同. |

这些函数可以用于集合, 序列和数组. 它们通过结构相等来比较元素, 与其他集合操作一样.

这些函数处于 [实验性](components-stability.md#stability-levels-explained) 状态,
需要通过 `@OptIn(ExperimentalStdlibApi::class)` 注解, 或 `-opt-in=kotlin.ExperimentalStdlibApi` 编译器选项, 选择使用者同意(Opt-in):

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
    data class Response(
        val participantId: String,
        val answer: String,
        val responseDate: String
    )

    val responses = listOf(
        Response("P001", "Yes", "2026-07-21"),
        Response("P002", "Maybe", "2026-07-21"),
        Response("P003", "No", "2026-07-21")
    )

    // 检查所有参与者是否给出了相同的答案
    println(responses.allEqualBy { it.answer })
    // 输出结果为: false

    // 检查是否有重复的参与者
    println(responses.allDistinctBy { it.participantId })
    // 输出结果为: true

    // 检查所有回答是否在同一天提交
    println(responses.allEqualBy { it.responseDate })
    // 输出结果为: true

    val answers = responses.map { it.answer }

    // 检查答案是否全部相同
    println(answers.allEqual())
    // 输出结果为: false

    // 检查答案是否全部不同
    println(answers.allDistinct())
    // 输出结果为: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4.20"}

欢迎在 [KEEP](https://github.com/Kotlin/KEEP/discussions/495) 中提供反馈意见.

### `kotlin.test` 断言函数的新的重载 {id="new-overloads-for-kotlin-test-assertion-functions"}
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="standard-library"/>

Kotlin 2.4.20 为 `kotlin.test` 断言函数增加了新的重载.
这些重载接收一个 Lambda 表达式, 只有在断言失败时才通过 Lambda 表达式延迟生成错误消息.

在之前的版本中, `kotlin.test` 断言函数, 例如 `assertTrue()` 或 `assertEquals()`, 只接收预先格式化的错误消息,
每次断言都会构建消息, 即使断言成功, 消息完全不会使用的情况也是如此.

新的重载使 `kotlin.test` API 与 JUnit 5 保持一致, 通过 Lambda 表达式接受消息提供者, 而不是直接接受字符串.
这有助于提高性能, 尤其是对于 [Power-assert 编译器插件](power-assert.md), 因为它会为断言生成详细的错误消息.

新的重载适用于下面的断言函数:

| 函数                                                                                                                                                                                                   | 说明                                                                                       |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| [`assertTrue()`](https://kotlinlang.org/api/core/kotlin-test/kotlin.test/assert-true.html) / [`assertFalse()`](https://kotlinlang.org/api/core/kotlin-test/kotlin.test/assert-false.html)              | 检查值是 `true` 还是 `false`.                                                              |
| [`assertEquals()`](https://kotlinlang.org/api/core/kotlin-test/kotlin.test/assert-equals.html) / [`assertNotEquals()`](https://kotlinlang.org/api/core/kotlin-test/kotlin.test/assert-not-equals.html) | 检查值是否相等.                                                                            |
| [`assertSame()`](https://kotlinlang.org/api/core/kotlin-test/kotlin.test/assert-same.html) / [`assertNotSame()`](https://kotlinlang.org/api/core/kotlin-test/kotlin.test/assert-not-same.html)         | 检查值是否引用同一个实例.                                                                  |
| [`assertIs()`](https://kotlinlang.org/api/core/kotlin-test/kotlin.test/assert-is.html) / [`assertIsNot()`](https://kotlinlang.org/api/core/kotlin-test/kotlin.test/assert-is-not.html)                 | 检查值是否不是指定的类型. 对于 `assertIs()`, 断言函数还会将它智能转换为这个类型.           |
| [`assertNull()`](https://kotlinlang.org/api/core/kotlin-test/kotlin.test/assert-null.html)                                                                                                             | 检查值是否为 `null`.                                                                       |
| [`assertContains()`](https://kotlinlang.org/api/core/kotlin-test/kotlin.test/assert-contains.html)                                                                                                     | 检查集合, 数组, 序列, 范围或 Map 中, 是否包含指定元素 (key, 字符, 子字符串, 或正规表达式). |
| [`assertContentEquals()`](https://kotlinlang.org/api/core/kotlin-test/kotlin.test/assert-content-equals.html)                                                                                          | 检查集合, 序列, 或数组, 是否按相同顺序包含相等的元素.                                      |

要使用新的 API, 请通过 `@OptIn(ExperimentalKotlinTestApi::class)` 注解, 明确的选择使用者同意(Opt-in):

```kotlin
import kotlin.test.ExperimentalKotlinTestApi
import kotlin.test.assertEquals
import kotlin.test.assertTrue

@OptIn(ExperimentalKotlinTestApi::class)
fun testValues(actual: Int, expected: Int, items: List<String>) {
    // 只在断言失败时构建消息
    assertTrue(actual > 0) { "Expected a positive value but got $actual" }

    // 除非断言失败, 否则不格式化 List 内容
    assertEquals(expected, actual) { "Unexpected value for items: ${items.joinToString()}" }
}
```

详情请参见这个功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/stdlib/KEEP-0465-kotlin.test-lazy-assertion-messages.md).

## Kotlin/Native {id="kotlin-native"}

Kotlin 2.4.20 能够为 Kotlin Multiplatform 项目中的 SwiftPM 依赖项自动生成 `Package.swift` 文件,
为 Swift 导出增加了新功能, 包括支持封闭类和跨语言继承, 并改进了增量编译.

### 为 SwiftPM 依赖项生成 `Package.swift` 文件 {id="generated-package-swift-for-swiftpm-dependencies"}
<secondary-label ref="native"/>

导出依赖 SwiftPM 包的 XCFramework 时, 必须发布生成的 SwiftPM 包, 才能正确解析依赖.
为了帮助解决这个问题, `assembleSharedXCFramework` Gradle 任务现在会生成 `Package.swift` 文件, 可以与 XCFramework 一同分发.

详情请参见 [SwiftPM 导出](multiplatform-spm-export.md).

### Swift 导出的新功能 {id="new-swift-export-features"}
<primary-label ref="alpha"/>
<secondary-label ref="native"/>

#### 封闭类 {id="sealed-classes"}

Kotlin 2.4.20 的 Swift 导出功能, 增加了对封闭类和封闭接口的支持.

在之前的版本中, 对封闭类型编写的每个 `switch` 语句都必须包含 `default` 分支.
现在, Kotlin 中定义的封闭类型层级会映射为 Swift 的枚举类型, 因此可以编写穷尽式 `switch` 语句, 并在 Xcode 中支持完整的自动补全.

Swift 导出会在每个封闭类型上生成 `sealedType()` 方法.
这个方法返回一个 Swift 枚举, 它分支对应封闭类型层级的直接子类. 可以嵌套调用这个方法, 来匹配类型层级中更深的子类.

例如, 在 Kotlin 中声明一个封闭接口, 包含类继承层级:

```kotlin
// Kotlin
sealed interface Shape

class Circle : Shape {
    override fun toString(): String = "Circle"
}

class Rectangle : Shape {
    override fun toString(): String = "Rectangle"
}

fun createCircle(): Shape = Circle()
```

在 Swift 代码中, 可以使用穷尽式 `switch`, 不需要 `default` 分支:

```swift
// Swift
let shape = createCircle()

let name = switch shape.sealedType() {
    case let .circle(type): "It's a \(type.value)"
    case let .rectangle(type): "It's a \(type.value)"
}
// 运行结果为: name == "It's a Circle"
```

由于 `switch` 涵盖了所有情况, 如果封闭类型的层级中新增了子类, 编译器会发出警告,
因此你可以立即处理, 而不必依赖 `default` 分支.

#### Swift 导出中的跨语言继承 {id="cross-language-inheritance-in-swift-export"}

Kotlin 2.4.20 在 Swift 导出功能中引入了跨语言继承支持.

这个功能的一个常见使用场景是 [反向导入](native-lib-import-stability.md#swift-library-import) 模式,
在 Kotlin 中定义契约, 然后在 Swift 中提供平台特定的实现.
当需要使用纯 Swift 库, 但无法直接导入 Kotlin 时, 这种模式非常有用.

要实现这种模式, 需要先声明一个供 Swift 实现继承的 Kotlin 超类, 和一个 Kotlin 接口.
然后在 Swift 中实现这个接口, 并将 Swift 对象传给接受这个接口的 Kotlin 函数.
例如, 对于 CryptoKit 库:

1. 在 Kotlin 代码中, 声明接口, 接受这个接口的函数, 和一个 `open` 基类:

   ```kotlin
   // Kotlin
   interface CryptoProvider {
       fun hashMD5(input: String): String
   }

   fun processHash(provider: CryptoProvider, input: String): String = provider.hashMD5(input)

   open class SwiftBase
   ```

2. 在 Swift 代码中, 继承导出的 `SwiftBase` 类, 使用纯 Swift 库实现接口, 再将对象传回给 Kotlin:

   ```swift
   // Swift
   import CryptoKit

   final class IosCryptoProvider: SwiftBase, CryptoProvider {
       func hashMD5(input: String) -> String {
           guard let data = input.data(using: .utf8) else { return "failed" }
           return Insecure.MD5.hash(data: data).description
       }
   }

   let provider = IosCryptoProvider()

   // 调用 Kotlin 函数, 这个函数又会调用 Swift 中的 hashMD5()
   print(processHash(provider: provider, input: "Hello, world!"))
   ```

Kotlin 收到 Swift 对象时, 会将它视为通常的接口的实现, 并直接调用 Swift 代码.

关于 Swift 导出功能, 详情请参见我们的 [文档](native-swift-export.md).

### 改进了 `klib` artifact 的增量编译 {id="improved-incremental-compilation-of-klib-artifacts"}
<primary-label ref="beta"/>
<secondary-label ref="native"/>

Kotlin 2.4.20 改进了 `klib` artifact 增量编译功能的稳定性.
这个功能目前处于 [Beta](components-stability.md#kotlin-native) 阶段.

这项优化最初在 [Kotlin 1.9.20](whatsnew1920.md#incremental-compilation-of-klib-artifacts) 中引入, 并已证明可以大幅缩短 debug 构建的编译时间.
之后, 我们修复了很多错误, 并改进了性能.

要试用增量编译功能, 请在 `gradle.properties` 文件中添加以下选项:

```properties
kotlin.incremental.native=true
```

我们正在积极收集反馈, 并计划在之后的 Kotlin 版本中, 对所有项目默认启用增量编译功能.
如果遇到问题, 请在我们的 [问题跟踪系统](https://kotl.in/issue) 中报告.

## Kotlin/Wasm {id="kotlin-wasm"}

Kotlin 2.4.20 调整了 Kotlin/Wasm 对 `@JsFun` 声明中顶层 `require()` 调用的处理方式,
调整了同伴对象的初始化顺序, 与 JVM 保持一致, 缩小了函数式接口的二进制文件大小, 引入了新的编译模式,
并在 Kotlin Gradle plugin 中为 `wasmWasi` 编译目标增加了对 Wasmtime 运行时的支持.

### `@JsFun` 声明中的顶层 `require()` 调用的变更 {id="changes-to-top-level-require-calls-in-jsfun-declarations"}
<secondary-label ref="wasm"/>

如果 [`@JsFun`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-js-fun/) 声明使用了顶层 `require()` 函数,
现在 Kotlin/Wasm 会报告错误.

在之前的版本中, 编译器会在 `import-object.mjs` 文件中生成 `require` 变量, 让 `@JsFun` 声明能够调用 `require()`.

这种行为意外的暴露了编译器的实现细节.
为了帮助迁移, Kotlin/Wasm 删除了这个生成的 `require` 声明, 编译器现在会对这类调用报告错误.
例如:

```kotlin
// 报告错误
@JsFun("(mod) => require(mod)")
external fun loadModule(mod: String): JsAny
```

要适应这个变更, 请将 `@JsFun` 声明中的顶层 `require()` 调用,
替换为 [`@JsModule`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.js/-js-module/) 注解:

```kotlin
@JsModule("module")
external val module: Module

external interface Module {
    // 定义预期的模块成员
}
```

对于动态模块加载的情况, 请改为使用 `import()` 表达式.
添加特殊注释 `/* webpackIgnore: true */`, 以防止 webpack 解析动态导入:

```kotlin
@JsFun("""
    ((module) => () => module)(
        await import(/* webpackIgnore: true */ "module")
    )
""")
private external fun loadModuleDynamically(): JsAny?
```

也可以有条件的使用 `import()` 表达式. 例如, 只有在 Node.js 中运行时才加载模块:

```kotlin
@JsFun("""
    ((module) => () => module)(
        ((typeof process !== "undefined") && (process.release.name === "node"))
            ? await import(/* webpackIgnore: true */ "module")
            : null
    )
""")
private external fun loadNodeModule(): JsAny?
```

如果你的项目依赖的库需要使用顶层 `require()` 函数, 可以使用替代方案, 将它添加为 `globalThis` 的属性:

```kotlin
@JsFun("""
    ((module) => {
        globalThis.require = module.default.createRequire(import.meta.url)
        return () => {}
    })(await import("node:module"))
""")
external fun defineRequire()
```

如果遇到问题, 请在我们的 [问题跟踪系统](https://youtrack.jetbrains.com/issue/KT-86192) 中提供反馈.

### 改进了同伴对象的初始化顺序 {id="improved-companion-object-initialization-order"}
<secondary-label ref="wasm"/>

Kotlin/Wasm 现在会先初始化超类的同伴对象, 再初始化子类的同伴对象, 与 JVM 的行为保持一致.
在之前的版本中, 初始化顺序可能相反, 导致不同平台的行为不一致.

这个更新改善了跨平台一致性, 减少了类初始化行为中的平台差异.
它还能在更深的继承层级中正确的处理同伴对象的初始化, 即使中间层的类没有声明同伴对象.

### 在 Kotlin Gradle plugin 中支持 Wasmtime {id="support-for-wasmtime-in-the-kotlin-gradle-plugin"}
<secondary-label ref="wasm"/>

Kotlin 2.4.20 在 Kotlin Gradle plugin 中, 为 `wasmWasi` 编译目标增加了对 [Wasmtime](https://docs.wasmtime.dev/) 运行时的支持.

在之前的版本中, `wasmWasi` 编译目标只支持 Node.js 运行时, 因此需要 JavaScript 引导代码来运行 WASI 应用程序.
有了对 Wasmtime 的支持, 现在你可以在独立的 WebAssembly 运行时上运行 Kotlin/Wasm 应用程序.

要将 Wasmtime 用作 `wasmWasi` 编译目标的运行时, 请在 Gradle 构建文件中添加 `wasmtime()`:

```kotlin
kotlin {
    wasmWasi {
        wasmtime()
    }
}
```

欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-86633) 中提供反馈意见.

### 新的编译模式 {id="new-compilation-modes"}
<secondary-label ref="wasm"/>

Kotlin 2.4.20 支持选择 Kotlin/Wasm 编译模式, 包括新的多模块模式.
在之前的版本中, 编译器使用整体(monolith)编译模式, 将项目和它的依赖项一起编译, 并生成单个二进制文件.
这样, 编译器可以执行死代码清除(Dead Code Elimination, DCE), 并生成最小的输出.

现在, 可以选择以下编译模式:

| 编译模式                   | 编译方式                                                | 输出                               | 优化行为                                                  |
|----------------------------|---------------------------------------------------------|------------------------------------|-----------------------------------------------------------|
| `monolith` (默认)          | 将项目和它的依赖项一起编译.                             | 单个二进制文件                     | 删除不可到达的声明, 并对整个程序进行优化, 包括依赖项.     |
| `multimodule-open-world`   | 对每个模块单独编译, 而且只重新编译发生变更的模块.       | 对每个模块生成相互独立的二进制文件 | 不进行跨模块优化, 因此二进制文件更大.                     |
| `multimodule-closed-world` | 在一次调用中处理所有模块, 而且只重新编译发生变更的模块. | 生成多个二进制文件, 但存在相互依赖 | 删除不可到达的声明, 但对每个 Wasm 二进制文件独立进行优化. |

要选择编译模式, 请在 `gradle.properties` 文件中添加 `kotlin.wasm.compilationMode` 属性:

```properties
kotlin.wasm.compilationMode=multimodule-open-world
```

你也可以配置 Kotlin/Wasm, 对开发构建使用 closed-world 多模块编译, 对生产构建使用 monolith 编译.
这样可以减少开发期间的重新编译时间, 并为生产构建生成最小的输出.

要使用这样的配置, 请在 `gradle.properties` 文件中添加以下属性:

```properties
kotlin.wasm.compilationMode=multimodule-closed-world-only-in-dev
```

欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-86919) 中提供反馈意见.

### 缩小了 Lambda 表达式和函数式接口的二进制文件大小 {id="reduced-binary-size-for-lambdas-and-functional-interfaces"}
<secondary-label ref="wasm"/>

Kotlin 2.4.20 修改了 Kotlin/Wasm 编译 Lambda 表达式和函数式接口的方式.
编译器现在不再生成单独的匿名类, 而是生成函数, 并使用共用的基类.

使用 [KotlinConf 应用程序](https://github.com/JetBrains/kotlinconf-app) 进行的测试表明, 这个变更使 Wasm 二进制文件的大小缩小了大约 5–10%.

由于这个变更引入了更多的动态调用, 可能会影响运行期性能.
如果遇到问题, 请在我们的 [问题跟踪系统](https://youtrack.jetbrains.com/issue/KT-83159) 中报告.

## Kotlin/JS {id="kotlin-js"}

Kotlin 2.4.20 改进了数据类的导出能力, 引入了新的实验性浏览器测试 DSL, 并支持将挂起的 Lambda 表达式导出为 JavaScript 异步函数.

### 数据类中的合成函数导出的一致性 {id="consistent-exportability-of-synthetic-functions-on-exported-data-classes"}
<secondary-label ref="js"/>

Kotlin 2.4.20 修复了 `@JsExport.Ignore` 注解无法正确应用于数据类属性的问题.

在以前的版本中, 当你使用 `@JsExport` 标注数据类时, 由于自动生成的 `copy()` 和 `componentN()` 函数,
编译器仍然会报告数据类导出能力的警告.
即使使用`@JsExport.Ignore`, 将构造器和属性明确的标记为忽略导出, 也会发生这个问题. 

例如, 要将数据类 `Session` 导出到 JavaScript, 它还引用了不希望导出的内部类 `DatabaseConnection`:

```kotlin
// Kotlin
// 不会导出到 JavaScript 的内部类型
class DatabaseConnection

@JsExport
data class Session @JsExport.Ignore constructor(
    val userId: String,
    @JsExport.Ignore val connection: DatabaseConnection,
)
```

现在这个问题已经修复, 编译器会考虑 `@JsExport.Ignore` 注解, 因此 `Session` 的合成函数 `copy()` 和 `componentN()` 不再会由于未导出的 `DatabaseConnection` 类而触发警告.
这个行为与 [`@ConsistentCopyVisibility` 和 `@ExposedCopyVisibility` 注解](whatsnew2020.md#data-class-copy-function-to-have-the-same-visibility-as-constructor)
引入的可见性规则保持一致.

### 新的浏览器测试 DSL {id="a-new-dsl-for-browser-testing"}
<primary-label ref="experimental-opt-in"/>
<secondary-label ref="js"/>

Kotlin 2.4.20 引入了新的实验性 DSL, 用于在浏览器环境中运行 Kotlin/JS 测试.

目前, Kotlin Gradle plugin 使用 [Karma](https://github.com/karma-runner/karma) 作为浏览器启动器, 在不同的浏览器中运行 JavaScript 测试.
Karma 项目已经废弃了 2 年, 因此我们开始探索支持浏览器测试的替代方案.

新 DSL 旨在取代 Karma, 在底层管理各种工具, 包括:

* [Playwright](https://playwright.dev/) 作为浏览器驱动和分发管理器, 支持 Chromium, Firefox 和 WebKit (Safari) 浏览器引擎.
* [Mocha](https://mochajs.org/) 作为测试运行器.
* [webpack](https://webpack.js.org/) 作为打包工具 (计划在 [未来的发布版本](https://youtrack.jetbrains.com/issue/KT-48308/) 中替换为 [Vite](https://vite.dev/)).

要试用新的浏览器测试 DSL, 请在 Kotlin/JS 编译目标的 `browser {}` 中, 添加需要使用者同意的 `test {}` 代码块:

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalJsTestDsl
import kotlin.time.Duration.Companion.seconds

kotlin {
    js {
        browser {
            // 添加并配置新的 test {} 代码块
            @OptIn(ExperimentalJsTestDsl::class)
            test {
                // 为所有运行器配置默认超时时间
                timeout = 2.seconds
                // 使用 Gradle provider 配置无头模式
                headless = providers
                    .environmentVariable("IS_IN_CI")
                    .map { it.toBoolean() }
                    .orElse(false)
                // 启用并配置 Chromium 测试运行器
                chromium {
                    // 覆盖共通的超时时间选项
                    timeout = 5.seconds
                    // 添加额外的启动参数
                    launchArgs.add("--no-sandbox")
                }
                // 启用 Firefox 测试运行器
                firefox()
                // 启用 WebKit 测试运行器
                webkit()
                // 启用并配置另一个 WebKit 测试运行器
                webkit("noheadless") {
                    // 设置自定义选项
                    headless = false
                }
            }
        }
    }
}
```

新的浏览器测试 DSL 仍在积极开发中. 欢迎在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66897) 中提供反馈意见.

详情请参见 [在 Kotlin/JS 中运行测试](js-running-tests.md).

### 支持将挂起的 Lambda 表达式导出为异步函数 {id="support-for-exporting-suspending-lambdas-as-async-functions"}
<primary-label ref="experimental-general"/>
<secondary-label ref="js"/>

从 Kotlin 2.4.20 开始, 可以将挂起的 [Lambda 表达式](lambdas.md#lambda-expressions-and-anonymous-functions)
导出为 JavaScript `async` 函数.

在之前的版本中, 无法从 Kotlin/JS 库中导出包含挂起的 Lambda 表达式的声明.
现在, Kotlin 编译器会自动处理 Kotlin 的 `suspend` 函数与 JavaScript 的原生 [`async`/`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
模型之间的桥接, 这对混合使用 Kotlin 和 TypeScript 的代码库非常有用.

要启用这个功能, 请在 `build.gradle.kts` 文件中添加以下编译器选项:

```kotlin
kotlin {
    js {
        compilations.all {
            compileTaskProvider.configure {
                compilerOptions {
                    freeCompilerArgs.add("-Xsuspend-lambda-exporting")
                }
            }
        }
    }
}
```

然后, 使用 `@JsExport` 标记相关的声明:

```kotlin
// Kotlin
@JsExport
class TaskRunner {
    suspend fun runTask(task: suspend () -> String): String {
        return task()
    }
}
```

在 TypeScript 代码中, 挂起的 Lambda 表达式会成为通常的 `async` 函数:

```typescript
// TypeScript
import { TaskRunner } from "..."

const runner = new TaskRunner();
const result = await runner.runTask(async () => "done");
console.log(result); // 输出结果为: "done"
```

关于 `@JsExport` 注解, 详情请参见 [我们的文档](js-to-kotlin-interop.md#jsexport-annotation).

## Gradle {id="gradle"}

Kotlin 2.4.20 完全兼容于 Gradle 7.6.3 到 9.7.0. 你也可以使用最新的 Gradle.
但请注意, 这样做可能会导致废弃警告, 并且某些新的 Gradle 功能特性可能无法正常工作.

Kotlin 2.4.20 还改进了与 Problems API 的集成.

### 改进了 Problems API 中的报告 {id="improved-reporting-in-problems-api"}
<secondary-label ref="gradle"/>

Kotlin 2.2.0 是 [Kotlin Gradle Plugin (KGP) 与 Gradle 的 Problems API 集成](whatsnew22.md#integration-of-problems-api-within-kgp-diagnostics) 的第一个版本.
Kotlin 2.4.0 增加了 [将 Kotlin/JVM 编译器消息写入 Problems API](whatsnew24.md#compiler-messages-written-to-problems-api-for-kotlin-jvm) 的支持.

Kotlin 2.4.20 在编译器传递给 [Problems API](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.problems/index.html)
的信息中增加了编译器诊断 ID.
而且还按这些 ID 对诊断信息分组, 让编译问题的来源更容易确认.

从 Gradle 8.6 开始, KGP 默认启用这个集成功能.
由于这个 API 仍在发展中, 因此请使用最新的 Gradle 版本, 以利用最近的改进.

## 构建工具 API {id="build-tools-api"}

Kotlin 2.4.20 为构建工具 API 增加了对 Kotlin/JS, Kotlin/Wasm 以及 Kotlin Metadata 的实验性支持.

### 支持 Kotlin/JS, Kotlin/Wasm, 以及 Kotlin Metadata {id="support-for-kotlin-js-kotlin-wasm-and-kotlin-metadata"}
<primary-label ref="experimental-general"/>
<secondary-label ref="bta"/>

在 [Kotlin 2.2.0](whatsnew22.md#new-experimental-build-tools-api) 中, 构建工具 API (Build Tools API, BTA) 开始支持 Kotlin/JVM.
Kotlin 2.4.20 使 BTA 向稳定化又迈进一步, 增加了对新的编译目标的支持: Kotlin/JS, Kotlin/Wasm, 以及 Kotlin Metadata.

通过这次变更, Kotlin Gradle Plugin 与编译器的交互更加一致. 在某些情况下, 编译还会更快, 更稳定.

BTA 是一个通用 API, 充当构建系统与 Kotlin 编译器生态系统之间的抽象层.
它能够帮助在现有的构建工具中支持 Kotlin 功能, 并保持与 Kotlin 编译器的兼容性.

在 Kotlin 2.4.20 中, 对新的编译目标使用 BTA 需要使用者同意(Opt-in). 要试用这个功能, 请在 `gradle.properties` 文件中添加相应的属性:

```properties
kotlin.wasm.runViaBuildToolsApi=true
kotlin.js.runViaBuildToolsApi=true
kotlin.metadata.runViaBuildToolsApi=true
```

从 Kotlin 2.5.0 开始, 我们计划对 Kotlin/JS, Kotlin/Wasm 和 Kotlin Metadata 默认启用 BTA.

如果对 BTA 提案感兴趣, 或希望提供反馈意见, 请参见这个 [KEEP](https://github.com/Kotlin/KEEP/blob/build-tools-api/proposals/extensions/build-tools-api.md).

## Kotlin 编译器 {id="kotlin-compiler"}

Kotlin 2.4.20 将 Kotlin 运行命令更改为 `kotlinr`, 并引入了实验性的 Kotlin 编译器原生镜像.

### Kotlin 运行命令从 `kotlin` 更改为 `kotlinr` {id="changed-the-kotlin-runner-command-from-kotlin-to-kotlinr"}
<secondary-label ref="compiler"/>

`kotlinr` 替代了 `kotlin`, 成为 Kotlin 运行命令, 以避免与 [Kotlin Toolchain](https://kotlin-toolchain.org/latest/) 中的 `kotlin` 命令的名称冲突.
如果你使用 `kotlin` 命令, Kotlin 运行器也会发出警告, 并建议改用 `kotlinr`.

### 原生镜像(Native Image) {id="native-image"}
<primary-label ref="experimental-general"/>
<secondary-label ref="compiler"/>

Kotlin 2.4.20 首次发布了 [实验性](components-stability.md#stability-levels-explained) 的 Kotlin 编译器原生镜像(Native Image).
原生镜像可以直接替代标准的 `kotlinc` 命令行工具, 并提供更快的启动速度, 和更高的性能.

要试用原生镜像, 请从 [GitHub Releases](https://github.com/JetBrains/kotlin/releases/tag/v2.4.20) 下载构建版本.

原生镜像还捆绑了以下编译器插件, 可以通过 `-Xplugin` 或 `-Xcompiler-plugin` CLI 选项来使用:

* [序列化](serialization.md)
* [Compose 编译器](compose-compiler-options.md)
* [All-open](all-open-plugin.md)
* [`no-arg`](no-arg-plugin.md)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [Assignment](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.assignment)
* [Lombok](lombok.md)
* [Power-assert](power-assert.md)

关于 Kotlin 编译器原生镜像, 详情请参见它的 [README](https://github.com/JetBrains/kotlin/blob/master/prepare/compiler-native-image/README.md).

## 破坏性变更和废弃 {id="breaking-changes-and-deprecations"}

本节重点介绍重要的破坏性变更和废弃. 完整的概述, 请参见我们的 [兼容性指南](compatibility-guide-24.md).

* 由于 Apple 即将停止支持它的 32 位 watchOS 编译目标, `watchosArm32` [Kotlin/Native](native-target-support.md) 编译目标现在已被废弃.
  计划在 Kotlin 2.5.0 中移除, 以确保与 Xcode 27 兼容.
* 从 Kotlin 2.4.20 开始, Kotlin/Native 编译器禁止在 `public` 内联函数中, 或在被其他文件调用的 `internal` 内联函数中, 执行 AtomicFU 原子操作.
* Kotlin 2.4.20 将 webpack 的 npm 依赖项更新到了 5.108.1.
  这个变更可能从以下 2 个方面影响你的项目:
  * webpack 已将它的内置代码压缩工具依赖项从 `terser-webpack-plugin` 迁移到了适用范围更广的 [`minimizer-webpack-plugin`](https://www.npmjs.com/package/minimizer-webpack-plugin).
    Terser 仍然用作默认的 JavaScript 代码压缩工具, 但如果你的项目配置直接使用, 或依赖使用 `terser-webpack-plugin`, 可能需要更新配置.
  * webpack 在确定 JavaScript 文件的模块类型时, 不再忽略 `import.meta`.
    如果文件中存在 `import.meta`, webpack 会将其视为 ES 模块, 这可能使同时使用 CommonJS 结构的文件无法正常工作.
    对于 Kotlin/JS, 可以 [通过 `useEsModules()` Gradle DSL 将编译目标配置为使用 ES 模块](js-modules.md#choose-the-target-module-system).
    对于 Kotlin/Wasm, 大多数情况下不需要额外配置即可工作.
    如果在 Kotlin/Wasm 中遇到 `import.meta` 错误, 请检查你的项目源代码, 直接依赖项, 或传递依赖项是否使用了 `import.meta`.
    请根据需要, 更新你自己的代码. 如果问题是由依赖项引起的, 如果已有兼容的版本, 请更新版本, 否则请将问题报告给库的维护者.
* 从 Kotlin 2.4.20 开始, Kotlin/Wasm 废弃了生成的 JavaScript `wasmExports` API.
  编译器禁止访问所有的导出, `wasmExports.memory` 除外, 它暂时还可以访问, 但会产生警告.
  请使用 `kotlin.wasm.unsafe.wasmMemory` 属性, 来访问模块的 `WebAssembly.Memory` 对象.

## 文档更新 {id="documentation-updates"}

在上次版本发布之后, 我们为 Kotlin 生态系统的文档创建了新的页面和教程, 并重新编写了一部分现有的页面:

* [配置 iOS 交付流水线](https://kotlinlang.org/docs/multiplatform/ios-ci-cd-teamcity.html) -
  使用 TeamCity 为 Kotlin Multiplatform iOS 应用程序配置持续交付.
* Compose Multiplatform 更新:
  * [弹出窗口](https://kotlinlang.org/docs/multiplatform/compose-popups.html)
    – 学习如何在 Compose Multiplatform 中创建和配置弹出窗口.
  * [窗口与对话框 API v2](https://kotlinlang.org/docs/multiplatform/compose-desktop-top-level-windows-management.html#window-and-dialog-api-v2)
    – 探索 Compose Multiplatform 中管理桌面窗口与对话框的新 API.
  * [系统托盘和通知](https://kotlinlang.org/docs/multiplatform/compose-desktop-tray.html)
    – 学习如何在 Compose Multiplatform 桌面程序中向系统托盘添加应用图标, 和发送系统通知.
  * [菜单栏](https://kotlinlang.org/docs/multiplatform/compose-desktop-menu-bar.html)
    – 学习如何在 Compose Multiplatform 桌面程序中为特定窗口创建菜单栏.
  * [拖放](https://kotlinlang.org/docs/multiplatform/compose-drag-drop.html#platform-specific-data-handling)
    – 在 Compose Multiplatform 中实现拖放时处理平台特定的数据.
  * [Liquid Glass 的 UIKit 替代方案](https://kotlinlang.org/docs/multiplatform/ios-liquid-glass.html#alternative-skip-swiftui-and-drive-uikit-from-kotlin)
    – 探索使用 UIKit 导航代替 SwiftUI 的 Liquid Glass 实现方案.
  * [面向 AI Agent 的 MCP 服务器](compose-hot-reload.md#mcp-server-for-ai-agents)
    – 学习在 Compose Hot Reload 中如何使用 MCP 服务器, 将 AI Agent 接入你的开发流程.
* [使用 Spring 缓存](https://spring.io/guides/gs/caching)
  – 通过新的 Kotlin 示例, 学习如何为 Spring 应用添加缓存.
* [Exposed IntelliJ IDEA 插件](https://www.jetbrains.com/help/idea/exposed.html)
  – 学习如何在 IntelliJ IDEA 中使用代码补全, 数据库感知的检查功能, 以及实时模板, 来处理 Exposed.
* [Kotlin 序列化](serialization.md)
  – 学习如何序列化 Kotlin 数据, 自定义 JSON 结构和类型表达, 以及处理更高级的序列化场景.
* [数据流(Flow)](coroutines-flow.md) 和 [数据流(Flow)操作符](coroutines-flow-operators.md)
  – 学习如何创建和收集冷数据流(Flow)与热数据流(Flow), 处理异常, 以及使用各种数据流操作符.
* [调试协程](coroutines-debugging.md)
  – 学习如何使用调试模式, 堆栈跟踪恢复, 以及调试代理, 在 JVM 上调试协程.
* Lincheck
  – 学习 Lincheck 中的 [模型检查](lincheck-model-checking.md) 如何工作, 如何使用 [操作执行选项](lincheck-operation-execution-options.md),
  以及如何 [验证](lincheck-results-validation.md) 测试结果.
* [kapt 编译器 plugin](kapt.md)
  – 学习如何在 Gradle, Maven 和命令行编译器中配置 kapt 编译器 plugin.
* [Kotlin 项目中的代码质量工具](jvm-code-analysis.md)
  – 探索分析 JVM 字节码和 Kotlin 代码的工具.
* [在 Maven 中使用 Power-assert plugin](jvm-test-maven.md#get-detailed-failure-messages)
  – 学习如何使用 Power-assert plugin 获取更加详细的测试失败消息.
* [KSP 多轮处理](ksp-multi-round.md)
  – 探索 KSP 如何跨多个处理轮次工作, 包括生成文件, 延迟处理的符号, 以及验证.
* 不可明确表示(Non-denotable)的类型
  – 学习 Kotlin 中的 [平台类型](java-interop.md#null-safety-and-platform-types), [捕获类型](generics.md#captured-types), 以及 [交集类型](typecasts.md#intersection-types).
* [类型别名](type-aliases.md)
  – 学习类型别名的作用域和可见度.
* [this 表达式](this-expressions.md)
  – 学习隐式 `this` 如何解析, 以及何时需要明确使用 `this` 来引用接受者.
* [字符串](strings.md)
  – 学习字符串模板, 常见的字符串操作, 字符串构建, 以及类型转换.
* [包与导入](packages.md)
  – 学习如何使用包和导入来组织 Kotlin 代码.
