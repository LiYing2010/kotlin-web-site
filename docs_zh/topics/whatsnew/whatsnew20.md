[//]: # (title: Kotlin 2.0.0 中的新功能)

_[发布日期: 2024/05/21](releases.md#release-details)_

Kotlin 2.0.0 已经发布了, 并且 [新的 Kotlin K2 编译器](#kotlin-k2-compiler) 已经进入稳定版!
此外, 还有以下重要功能:

* [新的 Compose 编译器 Gradle plugin](#new-compose-compiler-gradle-plugin)
* [使用 invokedynamic 生成 Lambda 函数](#generation-of-lambda-functions-using-invokedynamic)
* [kotlinx-metadata-jvm 库进入稳定版](#the-kotlinx-metadata-jvm-library-is-stable)
* [在 Kotlin/Native 中, 在 Apple 平台使用 signpost 监控 GC 性能](#monitoring-gc-performance-with-signposts-on-apple-platforms)
* [在 Kotlin/Native 中, 解决与 Objective-C 方法的冲突](#resolving-conflicts-with-objective-c-methods)
* [在 Kotlin/Wasm 中, 支持命名导出(Named Export)](#support-for-named-export)
* [在 Kotlin/Wasm 中, 在带有 @JsExport 的函数中支持无符号的基本类型(Unsigned Primitive Type)](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
* [默认使用 Binaryen 优化生产构建(Production Build)](#optimized-production-builds-by-default-using-binaryen)
* [跨平台项目中, 新的用于编译器选项的 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
* [枚举类型值的泛型函数的替代进入稳定版](#stable-replacement-of-the-enum-class-values-generic-function)
* [AutoCloseable 接口进入稳定版](#stable-autocloseable-interface)

Kotlin 2.0 对于 JetBrains 开发组来说是一个巨大的里程碑.
这个发布版是 KotlinConf 2024 的核心内容.
请观看我们的开幕主题演讲, 我们宣布了激动人心的更新, 并讨论了我们对 Kotlin 语言的最新工作:

<video src="https://www.youtube.com/v/Ar73Axsz2YA" title="KotlinConf'24 - Keynote"/>

## IDE 支持 {id="ide-support"}

最新版的 IntelliJ IDEA 和 Android Studio 中绑定了支持 Kotlin 2.0.0 的 Kotlin plugin.
你不需要在你的 IDE 中更新 Kotlin plugin.
你需要做的只是在你的构建脚本中 [变更 Kotlin 版本](releases.md#update-to-a-new-kotlin-version) 为 Kotlin 2.0.0.

* 关于 IntelliJ IDEA 对 Kotlin K2 编译器的支持, 请参见 [IDE 中的支持](#support-in-ides).
* 关于 IntelliJ IDEA 对 Kotlin 的支持, 请参见 [Kotlin 的发布版本](releases.md#ide-support).

## Kotlin K2 编译器 {id="kotlin-k2-compiler"}

完成 K2 编译器的道路是很漫长的, 但是现在 JetBrains 开发组终于准备好宣布它进入稳定版.
在 Kotlin 2.0.0 中, 默认使用新的 Kotlin K2 编译器, 并且它对于所有的编译目标平台都进入 [稳定版](components-stability.md):
JVM, Native, Wasm, 以及 JS.
新的编译器带来了很大的性能改善, 加快新的语言功能的开发, 统一了 Kotlin 支持的所有平台, 并为跨平台项目提供一个更好的架构.

JetBrains 开发组成功的编译了来自选定的用户项目以及内部项目的 1000 万行代码, 确保了新编译器的质量.
18,000 名开发者参与了编译器稳定化的过程, 在总计 80,000 项目中测试了新的 K2 编译器, 并报告他们发现的问题.

为了帮助使用者尽可能平滑的迁移到新编译器, 我们创建了 [K2 编译器迁移向导](k2-compiler-migration-guide.md).
这个向导解释了编译器的各种优点, 指出你可能遇到的各种变更, 并描述在必要的情况下如何回退到之前的版本.

在一篇 [Blog](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/) 中,
我们讨论了 K2 编译器在不同项目中的性能.
如果你想要查看 K2 编译器性能的真实数据, 并找到如何在你自己的项目中收集性能基准的说明, 请阅读这篇 Blog.

你也可以观看 KotlinConf 2024 的这次演讲, 其中语言首席设计师 Michail Zarečenskij, 讨论了 Kotlin 和 K2 编译器中的功能演化:

<video src="https://www.youtube.com/v/tAGJ5zJXJ7w" title="Kotlin Language Features in 2.0 and Beyond"/>

### K2 编译器目前的限制 {id="current-k2-compiler-limitations"}

在你的 Gradle 项目中启用 K2 存在一些限制, 对于下面的情况, 可能影响使用低于 Gradle 8.3 版本的项目:

* 编译来自 `buildSrc` 的源代码.
* 编译包含的构建中的 Gradle plugin.
* 编译低于 Gradle 8.3 版本的项目中使用到的其它 Gradle plugin.
* 构建 Gradle plugin 依赖项.

如果你遇到上面提到的问题, 你可以通过下面的步骤来解决这些问题:

* 对 `buildSrc`, 任何 Gradle plugin, 以及它们的依赖项, 设置语言版本:

  ```kotlin
  kotlin {
      compilerOptions {
          languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
          apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
      }
  }
  ```

  > 如果你对指定的 task 配置语言和 API 版本, 这些值会覆盖由 `compilerOptions` 扩展设置的值.
  > 这种情况下, 语言和 API 版本不应该高于 1.9.
  >
  {style="note"}

* 更新你的项目的 Gradle 版本到 8.3 或更高版本.

### 智能类型转换(Smart Cast)的改进 {id="smart-cast-improvements"}

在特定的情况下, Kotlin 编译器能够将一个对象自动转换为一个类型, 省去你必须自己进行明确类型转换的麻烦.
这个功能称为 [智能类型转换](typecasts.md#smart-casts).
Kotlin K2 编译器能够在比以前更多的场景中进行智能类型转换.

在 Kotlin 2.0.0 中, 我们在以下方面, 对智能类型转换进行了改进:

* [局部变量与后续作用域(Further Scope)](#local-variables-and-further-scopes)
* [使用逻辑 `or` 操作符的类型检查](#type-checks-with-logical-or-operator)
* [内联(Inline)函数](#inline-functions)
* [函数类型的属性](#properties-with-function-types)
* [异常处理](#exception-handling)
* [自增(Increment)和自减(Decrement)操作符](#increment-and-decrement-operators)

#### 局部变量与后续作用域(Further Scope) {id="local-variables-and-further-scopes"}

以前, 如果一个变量在 `if` 条件中被计算为非 `null`, 那么变量会被智能类型转换.
这个变量的信息会在 `if` 代码块的作用域中继续共用.

但是, 如果你在 `if` 条件 **之外** 声明变量, 在 `if` 条件中将没有变量的信息可用, 因此它不能进行智能类型转换.
在 `when` 表达式 和 `while` 循环也会发生这样的情况.

从 Kotlin 2.0.0 开始, 如果你在 `if`, `when`, 或 `while` 条件中使用变量之前声明这个变量,
那么编译器收集的关于这个变量的所有信息, 都可以在相应的代码块中访问, 以进行智能类型转换.

如果你想要进行将布尔条件抽取到变量之类的操作, 这会很有用.
之后, 你可以给变量一个有意义的名称, 这样可以改善你的代码的可读性, 并且可以在后面的代码中重用这个变量.
例如:

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // 在 Kotlin 2.0.0 中, 编译器能够访问 isCat 的信息,
        // 因此它知道 animal 已被智能类型转换为 Cat 类型.
        // 所以, 可以调用 purr() 函数.
        // 在 Kotlin 1.9.20 中, 编译器不知道这个智能类型转换信息
        // 因此调用 purr() 函数会发生错误.
        animal.purr()
    }
}

fun main() {
    val kitty = Cat()
    petAnimal(kitty)
    // 输出结果为: Purr purr
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-local-variables" validate="false"}

#### 使用逻辑 or 操作符的类型检查 {id="type-checks-with-logical-or-operator"}

在 Kotlin 2.0.0 中, 如果你使用 `or` 操作符 (`||`) 将对象的类型检查组合起来, 会执行智能类型转换, 转换为它们最近的共通超类型.
在这次变更之前, 智能类型转换总是会转换为 `Any` 类型.

这种情况下, 你仍然需要手动检查对象类型, 然后才能访问它的属性, 或调用它的函数.
例如:

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus 被智能类型转换为共通的超类型 Status
        signalStatus.signal()
        // 在 Kotlin 2.0.0 之前, signalStatus 被智能类型转换为 Any 类型,
        // 因此调用 signal() 函数会导致未解析的引用错误.
        // signal() 函数只有在另一次类型检查, 才能成功调用:

        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 共通超类型是联合类型(Union Type)的一种 **近似**.
> Kotlin 中不支持 [联合类型](https://en.wikipedia.org/wiki/Union_type).
>
{style="note"}

#### 内联(Inline)函数 {id="inline-functions"}

在 Kotlin 2.0.0 中, K2 编译器以不同的方式处理内联(Inline)函数, 使得它能够结合其它编译器分析, 来确定是否能够安全的进行智能类型转换.

具体来说, 内联函数现在被看作拥有一个隐含的 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html)
契约(Contract).
这就意味着, 传递给内联函数的任何 Lambda 函数都会被原地调用(call in place).
由于 Lambda 函数被原地调用, 编译器就知道 Lambda 函数不会泄露它的函数 body 部中包含的任何变量的引用.

编译器使用这个信息, 结合其它编译器分析, 来决定是否能够对捕获的变量安全的进行智能类型转换.
例如:

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // 在 Kotlin 2.0.0 中, 编译器知道 processor 是一个局部变量,
        // inlineAction() 是一个内联函数, 因此对 processor 的引用不会泄露.
        // 所以, 可以安全的对 processor 进行智能类型转换.

        // 如果 processor 不为 null, processor 会被智能类型转换
        if (processor != null) {
            // 编译器知道 processor 不为 null, 因此不需要安全调用(safe call)
            processor.process()

            // 在 Kotlin 1.9.20, 你必须进行安全调用(safe call):
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 函数类型的属性 {id="properties-with-function-types"}

在 Kotlin 的之前版本中, 有一个 bug, 导致类的函数类型的属性不能智能类型转换.
我们在 Kotlin 2.0.0 和 K2 编译器中修正了这个行为. 例如:

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // 在 Kotlin 2.0.0 中, 如果 provider 不为 null,
        // 那么 provider 会被智能类型转换
        if (provider != null) {
            // 编译器知道 provider 不为 null
            provider()

            // 在 1.9.20, 编译器不知道 provider 不为 null,
            // 因此会产生错误:
            // Reference has a nullable type '(() -> Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

这个变更也适用于对 `invoke` 操作符进行重载(overload)的情况. 例如:

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () -> String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider()
            // 在 1.9.20 中, 编译器会产生错误:
            // Reference has a nullable type 'Provider?' use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 异常处理 {id="exception-handling"}

在 Kotlin 2.0.0 中, 我们对异常处理进行了改进, 使得智能类型转换信息能够传递到 `catch` 和 `finally` 代码块.
这个变更让你的代码更加安全, 因为编译器会追踪你的对象是不是可为 null 的类型. 例如:

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput 被智能类型转换为 String 类型
    stringInput = ""
    try {
        // 编译器知道 stringInput 不为 null
        println(stringInput.length)
        // 输出结果为: 0

        // 编译器拒绝之前的 stringInput 智能类型转换信息.
        // 现在 stringInput 的类型为 String?.
        stringInput = null

        // 产生一个异常
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // 在 Kotlin 2.0.0, 编译器知道 stringInput 可以为 null,
        // 因此 stringInput 继续是可为 null 的类型.
        println(stringInput?.length)
        // 输出结果为: null

        // 在 Kotlin 1.9.20 中, 编译器认为这里不需要安全调用, 但这是不正确的.
    }
}

//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-exception-handling"}

#### 自增(Increment)和自减(Decrement)操作符 {id="increment-and-decrement-operators"}

在 Kotlin 2.0.0 之前, 编译器不能理解在使用自增(Increment)或自减(Decrement)操作符之后, 对象类型可能会改变.
由于编译器不能准确的追踪对象类型, 你的代码可能会发生未解析的引用错误.
在 Kotlin 2.0.0 中, 解决了这个问题:

```kotlin
interface Rho {
    operator fun inc(): Sigma = TODO()
}

interface Sigma : Rho {
    fun sigma() = Unit
}

interface Tau {
    fun tau() = Unit
}

fun main(input: Rho) {
    var unknownObject: Rho = input

    // 检查 unknownObject 是否继承 Tau 接口
    // 注意, unknownObject 有可能同时继承 Rho 和 Tau 接口.
    if (unknownObject is Tau) {
        // 使用来自 Rho 接口的重载的 inc() 操作符.
        // 在 Kotlin 2.0.0 中, unknownObject 的类型被智能类型转换为 Sigma.
        ++unknownObject

        // 在 Kotlin 2.0.0 中, 编译器知道 unknownObject 的类型为 Sigma,
        // 因此可以成功的调用 sigma() 函数.
        unknownObject.sigma()

        // 在 Kotlin 1.9.20 中, 在 inc() 被调用时, 编译器不会进行智能类型转换,
        // 因此编译器仍然认为 unknownObject 的类型为 Tau.
        // 调用 sigma() 函数会抛出编译期错误.
        
        // 在 Kotlin 2.0.0 中, 编译器知道 unknownObject 类型为 Sigma,
        // 因此调用 tau() 函数会抛出编译期错误.
        unknownObject.tau()
        // Unresolved reference 'tau'

        // 在 Kotlin 1.9.20 中, 由于编译器错误的认为 unknownObject 类型为 Tau,
        // 因此可以调用 tau() 函数,
        // 但它会抛出 ClassCastException.
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### Kotlin Multiplatform 的改进 {id="kotlin-multiplatform-improvements"}

在 Kotlin 2.0.0 中, 我们在以下方面, 对与 Kotlin Multiplatform 相关的 K2 编译器进行了改进:

* [在编译时分离共通源代码和平台源代码](#separation-of-common-and-platform-sources-during-compilation)
* [预期与实际声明(Expected and Actual Declarations)的不同可见度级别](#different-visibility-levels-of-expected-and-actual-declarations)

#### 在编译时分离共通源代码和平台源代码 {id="separation-of-common-and-platform-sources-during-compilation"}

之前, Kotlin 编译器的设计使得它在编译时不能分离共通源代码集和平台源代码集.
结果, 共通代码可以访问平台代码, 导致平台之间的行为不同.
此外, 共通代码使用的一些编译器设置和依赖项也会被泄露到平台代码中.

在 Kotlin 2.0.0 中, 我们的新的 Kotlin K2 编译器的实现包括了编译方案的重新设计, 以确保共通源代码集和平台源代码集严格分离.
当你使用 [预期(Expected)与实际(Actual) 函数](multiplatform-expect-actual.md#expected-and-actual-functions) 时, 这个变更最为明显.
之前, 你的共通代码中的函数调用, 可以被解析为平台代码中的函数. 例如:

<table>
   <tr>
       <td>共通代码</td>
       <td>平台代码</td>
   </tr>
   <tr>
<td>

```kotlin
fun foo(x: Any) = println("common foo")

fun exampleFunction() {
    foo(42)
}
```

</td>
<td>

```kotlin
// JVM
fun foo(x: Int) = println("platform foo")

// JavaScript
// 在 JavaScript 平台上, 没有 foo() 函数的重载
```

</td>
</tr>
</table>

在这个示例中, 共通代码运行在不同平台上时, 会出现不同的行为:

* 在 JVM 平台上, 在共通代码中调用 `foo()` 函数, 导致平台代码的 `foo()` 函数被调用,
  结果是 `platform foo`.
* 在 JavaScript 平台上, 在共通代码中调用 `foo()` 函数导致, 共通代码的 `foo()` 函数被调用,
  结果是 `common foo`, 因为平台代码中没有这个函数可用.

在 Kotlin 2.0.0 中, 共通代码不能访问平台代码, 因此两个平台都会成功的将 `foo()` 函数解析为共通代码中的 `foo()` 函数 : `common foo`.

除了改进平台之间的行为一致性之外, 我们还努力修正了在 IntelliJ IDEA 或 Android Studio 与编译器之间存在行为冲突的情况.
例如, 当你使用 [预期类与实际类](multiplatform-expect-actual.md#expected-and-actual-classes) 时,
会发生下面的情况:

<table>
   <tr>
       <td>共通代码</td>
       <td>平台代码</td>
   </tr>
   <tr>
<td>

```kotlin
expect class Identity {
    fun confirmIdentity(): String
}

fun common() {
    // 在 2.0.0 之前,
    // 会导致 IDE 独有的错误
    Identity().confirmIdentity()
    // RESOLUTION_TO_CLASSIFIER : Expected class
    // Identity has no default constructor.
}
```

</td>
<td>

```kotlin
actual class Identity {
    actual fun confirmIdentity() = "expect class fun: jvm"
}
```

</td>
</tr>
</table>

在这个示例中, 预期类 `Identity` 没有默认构造器, 因此在共通代码中不能成功的调用.
之前, 只有 IDE 会报告这个错误, 但在 JVM 上代码仍然能够成功编译.
但是, 现在编译器能够正确的报告错误:

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 解析行为不会变化的情况 {id="when-resolution-behavior-doesn-t-change"}

我们还在迁移到新的编译方案的过程中, 因此当你调用不在同一个源代码集的函数时, 解析行为仍然相同.
这个差别主要出现在, 你在共通代码中使用来自重载的情况.

假设你有一个库, 其中有 2 个 `whichFun()` 函数, 带有不同的签名:

```kotlin
// 示例库

// 模块: common
fun whichFun(x: Any) = println("common function")

// 模块: JVM
fun whichFun(x: Int) = println("platform function")
```

如果你在共通代码中调用 `whichFun()` 函数, 会被解析为库中参数类型最接近的函数:

```kotlin
// 一个在 JVM 编译目标上使用这个示例库的项目

// 模块: common
fun main() {
    whichFun(2)
    // 输出结果为: platform function
}
```

相比之下, 如果你在相同的源代码集中为 `whichFun()` 声明重载, 那么函数调用会被解析为共通代码中的函数,
因为你的代码不能访问平台相关的版本:

```kotlin
// 没有使用示例库

// 模块: common
fun whichFun(x: Any) = println("common function")

fun main() {
    whichFun(2)
    // 输出结果为: common function
}

// 模块: JVM
fun whichFun(x: Int) = println("platform function")
```

与跨平台库类似, 由于 `commonTest` 模块是在单独的源代码集中, 因此它仍然能够访问平台相关的代码.
因此, `commonTest` 模块中的函数调用的解析, 与旧的编译方案的行为相同.

将来, 这些保留不变的情况, 会变得与新的编译方案更加一致.

#### 预期与实际声明(Expected and Actual Declarations)的不同可见度级别 {id="different-visibility-levels-of-expected-and-actual-declarations"}

在 Kotlin 2.0.0 之前, 如果你在 Kotlin Multiplatform 项目中使用 [预期与实际声明(Expected and Actual Declarations)](multiplatform-expect-actual.md), 它们必须具有相同的 [可见度级别](visibility-modifiers.md).
Kotlin 2.0.0 现在也支持不同的可见度级别, 但 **只允许** 实际声明比预期声明 _更加_ 宽松.
例如:

```kotlin
expect internal class Attribute // 可见度为 internal
actual class Attribute          // 可见度默认为 public, 更加宽松
```

类似的, 如果你在实际声明中使用 [类型别名](type-aliases.md), **低层类型** 的可见度应该与预期声明相同, 或更加宽松.
例如:

```kotlin
expect internal class Attribute                 // 可见度为 internal
internal actual typealias Attribute = Expanded

class Expanded                                  // 可见度默认为 public, 更加宽松
```

### 编译器 plugin 支持 {id="compiler-plugins-support"}

目前, Kotlin K2 编译器支持以下 Kotlin 编译器 plugin:

* [`all-open`](all-open-plugin.md)
* [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)
* [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)
* [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)
* [kapt](whatsnew1920.md#preview-kapt-compiler-plugin-with-k2)
* [Lombok](lombok.md)
* [`no-arg`](no-arg-plugin.md)
* [Parcelize](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [serialization](serialization.md)
* [Power-assert](power-assert.md)

此外, Kotlin K2 编译器还支持:

* [Jetpack Compose](https://developer.android.com/jetpack/compose) 编译器 plugin 2.0.0,
  [已被移动进入到 Kotlin 代码仓库](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html).
* [Kotlin Symbol Processing (KSP) plugin](ksp-overview.md) 从 [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 开始的版本.

> 如果你使用任何其它编译器 plugin, 请查看它们的文档, 确定它们是否与 K2 兼容.
>
{style="tip"}

### Kotlin Power-assert 编译器 plugin (实验性功能) {id="experimental-kotlin-power-assert-compiler-plugin"}

> Kotlin Power-assert plugin 是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更.
>
{style="warning"}

Kotlin 2.0.0 引入了实验性的 Power-assert 编译器 plugin.
这个 plugin 会在失败消息中包含上下文信息, 让调试更加容易, 更加高效, 改善编写测试的体验.

开发者经常需要使用复杂的断言库来编写有效的测试.
Power-assert plugin 能够简化这个过程, 它会自动生成失败消息, 其中包含断言表达式的中间值.
这可以帮助开发者款素理解测试失败的原因.

当一个断言在测试中失败时, 改进的错误消息会显示断言中所有变量和子表达式的值, 可以清楚的看出, 是条件的哪部分导致了失败.
对于检查多个条件的复杂断言, 这会特别有用.

要在你的项目中启用这个 plugin, 请在你的 `build.gradle(.kts)` 文件中配置它:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "2.0.0"
    kotlin("plugin.power-assert") version "2.0.0"
}

powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertTrue")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.0.0'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '2.0.0'
}

powerAssert {
    functions = ["kotlin.assert", "kotlin.test.assertTrue"]
}
```

</tab>
</tabs>

详情请参见 [Kotlin Power-assert plugin 文档](power-assert.md).

### 如何启用 Kotlin K2 编译器 {id="how-to-enable-the-kotlin-k2-compiler"}

从 Kotlin 2.0.0 开始, Kotlin K2 编译器默认启用. 不需要额外的操作.

### 在 Kotlin Playground 中试用 Kotlin K2 编译器 {id="try-the-kotlin-k2-compiler-in-kotlin-playground"}

Kotlin Playground 支持 2.0.0 发布版. [去看看吧!](https://pl.kotl.in/czuoQprce)

### IDE 中的支持 {id="support-in-ides"}

默认情况下, IntelliJ IDEA 和 Android Studio 仍然使用之前的编译器进行代码分析, 代码完成, 高亮, 以及其它与 IDE 相关的功能.
要在你的 IDE 中得到完整的 Kotlin 2.0 体验, 请启用 K2 模式.

在你的 IDE 中, 进入 **Settings** | **Languages & Frameworks** | **Kotlin**, 并选择 **Enable K2 mode** 选项.
IDE 使用它的 K2 模式分析你的代码.

![启用 K2 模式](k2-mode.png){width=200}

启用 K2 模式之后, 由于编译器行为的变化, 你可能会注意到 IDE 分析中的不同.
关于新的 K2 编译器与以前版本的不同, 详情请参见我们的 [迁移向导](k2-compiler-migration-guide.md).

* 关于 K2 模式, 更多详情请参见 [我们的 Blog](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/).
* 我们正在积极收集关于 K2 模式的反馈意见, 因此请在我们的 [公开 Slack 频道](https://kotlinlang.slack.com/archives/C0B8H786P) 中分享你的看法.

### 留下你对新的 K2 编译器的反馈意见 {id="leave-your-feedback-on-the-new-k2-compiler"}

我们非常感谢你的反馈意见!

* 如果你遇到的新的 K2 编译器的任何问题, 请在 [我们的问题追踪系统](https://kotl.in/issue) 中报告.
* [启用 "Send usage statistics" 选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html),
  允许 JetBrains 收集关于 K2 使用状况的匿名数据.

## Kotlin/JVM {id="kotlin-jvm"}

从 2.0.0 版开始, 编译器能够生成包含 Java 22 字节码的类.
这个版本还带来了以下变更:

* [使用 invokedynamic 生成 Lambda 函数](#generation-of-lambda-functions-using-invokedynamic)
* [kotlinx-metadata-jvm 库进入稳定版](#the-kotlinx-metadata-jvm-library-is-stable)

### 使用 invokedynamic 生成 Lambda 函数 {id="generation-of-lambda-functions-using-invokedynamic"}

Kotlin 2.0.0 引入了一个新的默认方法, 使用 `invokedynamic` 生成 Lambda 函数.
这个变更与传统的生成匿名类相比, 减少了应用程序的二进制文件大小.

从第一个版本开始, Kotlin 会将 Lambda 生成为匿名类.
但是, 从 [Kotlin 1.5.0](whatsnew15.md#lambdas-via-invokedynamic) 开始, 可以通过 `-Xlambdas=indy` 编译器选项, 生成 `invokedynamic`.
在 Kotlin 2.0.0 中, `invokedynamic` 成为 Lambda 生成的默认方法.
这个方法产生更小的二进制文件, 并使 Kotlin 与 JVM 优化保持一致, 确保应用程序能够收益于现在的和未来的 JVM 性能改进.

目前, 与通常的 Lambda 编译相比, 存在 3 个限制:

* 编译为 `invokedynamic` 的 Lambda 不能序列化.
* 实验性的 [`reflect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html)
  API 不支持使用 `invokedynamic` 生成的 Lambda.
* 在这样的 Lambda 上调用 `.toString()` 会产生可读性更差的字符串表达:

```kotlin
fun main() {
    println({})

    // 使用 Kotlin 1.9.24 和反射功能, 使用
    // () -> kotlin.Unit
    
    // 使用 Kotlin 2.0.0, 使用
    // FileKt$$Lambda$13/0x00007f88a0004608@506e1b77
}
```

要保留生成 Lambda 函数的原来的行为, 你可以使用以下方法中的某一种:

* 对特定的 Lambda 标注 `@JvmSerializableLambda` 注解.
* 使用编译器选项 `-Xlambdas=class`, 对模块中所有的 Lambda, 使用原来的方法生成.

### kotlinx-metadata-jvm 库进入稳定版 {id="the-kotlinx-metadata-jvm-library-is-stable"}

在 Kotlin 2.0.0 中, `kotlinx-metadata-jvm` 库进入 [稳定版](components-stability.md#stability-levels-explained).
现在这个库改为使用 `kotlin` 包, 以及对应的座标(coordinate), 你可以通过 `kotlin-metadata-jvm` (没有 "x") 找到它.

之前, `kotlinx-metadata-jvm` 库拥有独自的发布方案和版本.
现在, 我们将构建和发布 `kotlin-metadata-jvm` 的更新, 作为 Kotlin 发布循环的一部分,
提供与 Kotlin 标准库相同的向后兼容性保证.

`kotlin-metadata-jvm` 库提供一个 API, 读取和修改 Kotlin/JVM 编译器生成的二进制文件的元数据(metadata).

<!-- Learn more about the `kotlinx-metadata-jvm` library in the [documentation](kotlin-metadata-jvm.md). -->

## Kotlin/Native {id="kotlin-native"}

这个版本带来了以下变更:

* [使用 signpost 监控 GC 性能](#monitoring-gc-performance-with-signposts-on-apple-platforms)
* [解决与 Objective-C 方法的冲突](#resolving-conflicts-with-objective-c-methods)
* [修改了 Kotlin/Native 中编译器参数的 log 级别](#changed-log-level-for-compiler-arguments)
* [向 Kotlin/Native 明确添加了标准库和平台依赖项](#explicitly-added-standard-library-and-platform-dependencies-to-kotlin-native)
* [Gradle 配置缓存中的 Task 错误](#tasks-error-in-gradle-configuration-cache)

### 在 Apple 平台使用 signpost 监控 GC 性能 {id="monitoring-gc-performance-with-signposts-on-apple-platforms"}

之前, 只能通过查看日志来监控 Kotlin/Native 的垃圾收集器(Garbage Collector, GC)的性能.
但是, 这些日志没有与 Xcode Instruments 集成, 它是一种用来调查 iOS App 性能问题的常用工具包.

从 Kotlin 2.0.0 开始, GC 使用 Instruments 中的 signpost 来报告暂停.
Signpost 允许定制你的 App 中的日志, 因此, 现在调试 iOS App 的性能时, 你可以检查应用程序的冻结是不是由 GC 暂停引起的.

关于 GC 性能分析, 详情请参见 [文档](native-memory-manager.md#monitor-gc-performance).

### 解决与 Objective-C 方法的冲突 {id="resolving-conflicts-with-objective-c-methods"}

Objective-C 方法可以有不同的名称, 但使用相同的数量和类型的参数.
例如,
[`locationManager:didEnterRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423560-locationmanager?language=objc)
和 [`locationManager:didExitRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423630-locationmanager?language=objc).
在 Kotlin 中, 这些方法拥有相同的签名, 试图使用它们会导致重载(overload)冲突的错误.

以前, 你需要手动压制冲突的重载, 以避免这个编译错误.
为了改善 Kotlin 与 Objective-C 的互操作性, Kotlin 2.0.0 引入了新的 `@ObjCSignatureOverride` 注解.

这个注解指示 Kotlin 编译器忽略冲突的重载, 应对从 Objective-C 类继承了带有相同参数类型但不同参数名称的多个函数的情况.

适用这个注解也比普遍的压制错误更加安全. 这个注解只能用于覆盖 Objective-C 方法的情况,
这些方法受到支持并经过测试, 而普遍的压制错误可能会隐藏重要的错误, 并导致静默的代码破坏.

### 修改了编译器参数的 log 级别 {id="changed-log-level-for-compiler-arguments"}

在这个发布版中, Kotlin/Native Gradle task (例如 `compile`, `link`, 和
`cinterop`) 中的编译器参数 log 级别, 从 `info` 变更为 `debug`.

使用 `debug` 作为默认值, log 级别与其他 Gradle 编译 task 保持一致, 并提供详细的调试信息, 包括所有的编译器参数.

### 向 Kotlin/Native 明确添加了标准库和平台依赖项 {id="explicitly-added-standard-library-and-platform-dependencies-to-kotlin-native"}

之前, Kotlin/Native 编译器会隐含的解析标准库和平台依赖项, 导致Kotlin Gradle plugin 在不同的 Kotlin 编译目标上的工作方式不一致.

现在, 每个 Kotlin/Native Gradle 编译都会通过 `compileDependencyFiles` [编译参数](multiplatform-dsl-reference.md#compilation-parameters),
在它的编译期库路径中明确的包含标准库和平台依赖项.

### Gradle 配置缓存中的 Task 错误 {id="tasks-error-in-gradle-configuration-cache"}

从 Kotlin 2.0.0 开始, 你可能会遇到配置缓存错误, 显示以下消息:
`invocation of Task.project at execution time is unsupported`.

这个错误出现在 `NativeDistributionCommonizerTask` 和 `KotlinNativeCompile` 等 task 中.

但是, 这是一个虚假的错误.
底层问题是存在与 Gradle 配置缓存不兼容的 task, 例如 `publish*` task.

你可能无法立即理解这个差异, 因为错误消息指出了一个不同的根本原因.

由于错误报告没有明确的说明正确的错误原因, [Gradle 开发组正在处理这个问题, 以修正错误报告](https://github.com/gradle/gradle/issues/21290).

## Kotlin/Wasm {id="kotlin-wasm"}

Kotlin 2.0.0 改善了性能, 以及与 JavaScript 的互操作性:

* [默认使用 Binaryen 优化生产构建(Production Build)](#optimized-production-builds-by-default-using-binaryen)
* [支持命名导出(Named Export)](#support-for-named-export)
* [在带有 `@JsExport` 的函数中支持无符号的基本类型(Unsigned Primitive Type)](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
* [在 Kotlin/Wasm 中生成 TypeScript 声明文件](#generation-of-typescript-declaration-files-in-kotlin-wasm)
* [支持捕获 JavaScript 异常](#support-for-catching-javascript-exceptions)
* [新的异常处理方案, 可以作为选项使用](#new-exception-handling-proposal-is-now-supported-as-an-option)
* [`withWasm()` 函数分为 JS 和 WASI 变体](#the-withwasm-function-is-split-into-js-and-wasi-variants)

### 默认使用 Binaryen 优化生产构建(Production Build) {id="optimized-production-builds-by-default-using-binaryen"}

Kotlin/Wasm 工具链现在会对所有的项目, 在生产编译过程中使用 [Binaryen](https://github.com/WebAssembly/binaryen) 工具, 而不是以前的手动设置方案.
根据我们的估计, 它应该能够改善运行期性能, 并减少你的项目的二进制文件大小.

> 这个变更只影响生产编译. 开发编译的过程继续保持不变.
>
{style="note"}

### 支持命名导出(Named Export) {id="support-for-named-export"}

之前, 来自 Kotlin/Wasm 的所有导出声明, 在导入到 JavaScript 时使用默认导出:

```javascript
//JavaScript:
import Module from "./index.mjs"

Module.add()
```

现在, 你可以使用名称导入每个标记了 `@JsExport` 的 Kotlin 声明:

```kotlin
// Kotlin:
@JsExport
fun add(a: Int, b: Int) = a + b
```

```javascript
//JavaScript:
import { add } from "./index.mjs"
```

命名导出使得在 Kotlin 和 JavaScript 模块之间共用代码更加容易.
它改进了可读性, 并帮助你管理模块之间的依赖.

### 在带有 @JsExport 的函数中支持无符号的基本类型(Unsigned Primitive Type) {id="support-for-unsigned-primitive-types-in-functions-with-jsexport"}

从 Kotlin 2.0.0 开始, 你可以在带有 `@JsExport` 注解的外部声明和函数中, 使用 [无符号的基本类型(Unsigned Primitive Type)](unsigned-integer-types.md), 这个注解让 Kotlin/Wasm 函数可以在 JavaScript 代码 中使用.

之前的版本存在限制, 在导出和外部声明中不能直接使用 [无符号的基本类型](unsigned-integer-types.md),
这个功能可以缓解这个限制.

现在你可以导出使用无符号基本类型作为返回类型或参数类型的函数, 并使用那些返回或使用无符号基本类型的外部声明.

关于 Kotlin/Wasm 与 JavaScript 的互操作性, 详情请参见 [文档](wasm-js-interop.md#use-javascript-code-in-kotlin).

### 在 Kotlin/Wasm 中生成 TypeScript 声明文件 {id="generation-of-typescript-declaration-files-in-kotlin-wasm"}

> 在 Kotlin/Wasm 中生成 TypeScript 声明文件是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
>
{style="warning"}

在 Kotlin 2.0.0 中, Kotlin/Wasm 编译器现在能够根据你的 Kotlin 代码中的任何 `@JsExport` 声明生成 TypeScript 定义.
这些定义可以供 IDE 和 JavaScript 工具使用, 用来提供代码自动完成, 帮助进行类型检查, 并使在 JavaScript 中包含 Kotlin 代码变得更加容易.

Kotlin/Wasm 编译器会收集任何标记了 `@JsExport` 的 [顶级函数](wasm-js-interop.md#functions-with-the-jsexport-annotation),
并自动在一个 `.d.ts` 文件中生成 TypeScript 定义.

要生成 TypeScript 定义, 请在你的 `build.gradle(.kts)` 文件中, 在 `wasmJs {}` 代码块中,
添加 `generateTypeScriptDefinitions()` 函数:

```kotlin
kotlin {
    wasmJs {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

### 支持捕获 JavaScript 异常 {id="support-for-catching-javascript-exceptions"}

之前, Kotlin/Wasm 代码不能捕获 JavaScript 异常, 因此难以处理由程序的 JavaScript 端产生的错误.

在 Kotlin 2.0.0 中, 我们实现了在 Kotlin/Wasm 中捕获 JavaScript 异常的功能.
这个实现允许你使用 `try-catch` 代码块, 捕获特定的类型, 例如 `Throwable` 或 `JsException`,
来正确的处理这些错误.

此外, 帮助代码无论是否发生异常都会执行的 `finally` 代码块, 也能正常工作了.
尽管我们引入了对捕获 JavaScript 异常的支持, 但在 JavaScript 异常发生时,
不会提供额外的信息, 例如调用栈.
但是, [我们正在努力实现这些功能](https://youtrack.jetbrains.com/issue/KT-68185/WasmJs-Attach-js-exception-object-to-JsException).

### 新的异常处理方案, 可以作为选项使用 {id="new-exception-handling-proposal-is-now-supported-as-an-option"}

在这个发布版中, 我们在 Kotlin/Wasm 中引入了对 WebAssembly 新版本 [异常处理方案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)
的支持.

这个更新确保新的方案符合 Kotlin 的要求, 允许在只支持方案最新版本的虚拟机上使用 Kotlin/Wasm.

请使用 `-Xwasm-use-new-exception-proposal` 编译器选项来启用新的异常处理方案, 这个选项默认关闭.

### withWasm() 函数分为 JS 和 WASI 变体 {id="the-withwasm-function-is-split-into-js-and-wasi-variants"}

用来为层级结构模板提供 Wasm 编译目标的 `withWasm()` 函数, 已被废弃,
改为使用专门的 `withWasmJs()` 和 `withWasmWasi()` 函数.

现在你可以在树定义中, 将 WASI 和 JS 编译目标分离到不同的组.

## Kotlin/JS {id="kotlin-js"}

除了其它变更之外, 这个版本还为 Kotlin 带来了现代 JS 编译, 支持更多来自 ES2015 标准的功能:

* [新的编译目标](#new-compilation-target)
* [使用 ES2015 生成器(Generator) 编译挂起函数](#suspend-functions-as-es2015-generators)
* [向 main 函数传递参数](#passing-arguments-to-the-main-function)
* [对 Kotlin/JS 项目的逐个文件编译](#per-file-compilation-for-kotlin-js-projects)
* [集合互操作性的改善](#improved-collection-interoperability)
* [支持 createInstance()](#support-for-createinstance)
* [支持类型安全的普通(plain) JavaScript 对象](#support-for-type-safe-plain-javascript-objects)
* [支持 npm 包管理器](#support-for-npm-package-manager)
* [编译 task 的变更](#changes-to-compilation-tasks)
* [不再支持旧的 Kotlin/JS JAR artifact](#discontinuing-legacy-kotlin-js-jar-artifacts)

### 新的编译目标 {id="new-compilation-target"}

在 Kotlin 2.0.0 中, 我们对 Kotlin/JS 添加了一个新的编译目标, `es2015`.
这是一种新的方式, 可以在 Kotlin 中一次性启用所有的 ES2015 功能支持.

你可以在 `build.gradle(.kts)` 文件中这样设置:

```kotlin
kotlin {
    js {
        compilerOptions {
            target.set("es2015")
        }
    }
}
```

新的编译目标会自动启用 [ES 类和模块](whatsnew19.md#experimental-support-for-es2015-classes-and-modules),
以及新支持的 [ES 生成器](#suspend-functions-as-es2015-generators).

### 使用 ES2015 生成器(Generator) 编译挂起函数 {id="suspend-functions-as-es2015-generators"}

这个发布版引入了对 ES2015 生成器(Generator) 的 [实验性](components-stability.md#stability-levels-explained) 支持,
用于编译 [挂起函数](composing-suspending-functions.md).

使用生成器而不是状态机, 能够改善你的项目的最终捆绑包(bundle)大小.
例如, JetBrains 开发组通过使用 ES2015 生成器, 成功的将它的 Space 项目的捆绑包大小减少了 20%.

[关于 ES2015 (ECMAScript 2015, ES6), 详情请参见官方文档](https://262.ecma-international.org/6.0/).

### 向 main 函数传递参数 {id="passing-arguments-to-the-main-function"}

从 Kotlin 2.0.0 开始, 你可以为 `main()` 函数指定 `args` 的来源.
这个功能使得使用命令行和传递参数变得更加容易.

要使用这个功能, 请使用新的 `passAsArgumentToMainFunction()` 函数定义 `js {}` 代码块, 这个函数返回一个字符串数组:

```kotlin
kotlin {
    js {
        binary.executable()
        passAsArgumentToMainFunction("Deno.args")
    }
}
```

函数会在运行期执行. 它接受 JavaScript 表达式, 并将它用作 `args: Array<String>` 参数,
而不是 `main()` 函数调用.

而且, 如果你使用 Node.js 运行环境, 你可以利用一个特殊的别名.
使用它, 你可以将 `process.argv` 传递给 `args` 参数, 而不是每次都手动添加它:

```kotlin
kotlin {
    js {
        binary.executable()
        nodejs {
            passProcessArgvToMainFunction()
        }
    }
}
```

### 对 Kotlin/JS 项目的逐个文件编译 {id="per-file-compilation-for-kotlin-js-projects"}

Kotlin 2.0.0 对 Kotlin/JS 项目的输出引入了一个新的粒度选项.
你现在可以设置逐个文件的编译, 为每个 Kotlin 文件生成一个 JavaScript 文件.
它有助于显著优化最终捆绑包(bundle)的大小, 并改善程序的装载时间.

之前, 只有 2 个输出选项. Kotlin/JS 编译器可以为整个项目生成单个 `.js` 文件.
但是, 这个文件可能太大, 不便于使用.
只要你想使用来自你项目的一个函数, 你就不得不包含整个 JavaScript 文件作为依赖项.
或者, 你也可以配置编译, 对每个项目模块生成单独的 `.js` 文件.
这仍然是默认的选项.

由于模块文件也可能太大, 因此在 Kotlin 2.0.0 中, 我们添加了一个更加细粒度的输出,
为每个 Kotlin 文件生成 1 个 JavaScript 文件(如果文件包含导出声明, 则生成 2 个JavaScript 文件).
要启用逐个文件编译模式, 请执行以下步骤:

1. 向你的构建文件添加 [`useEsModules()`](whatsnew19.md#experimental-support-for-es2015-classes-and-modules) 函数,
   以支持 ECMAScript 模块:

   ```kotlin
   // build.gradle.kts
   kotlin {
       js(IR) {
           useEsModules() // 启用 ES2015 模块
           browser()
       }
   }
   ```

   你也可以使用新的 `es2015` [编译目标](#new-compilation-target) 做到这一点.

2. 适用 `-Xir-per-file` 编译器选项, 或更新你的 `gradle.properties` 文件, 如下:

   ```none
   # gradle.properties
   kotlin.js.ir.output.granularity=per-file // 默认设定是 `per-module`
   ```

### 集合互操作性的改善 {id="improved-collection-interoperability"}

从 Kotlin 2.0.0 开始, 可以将签名中包含 Kotlin 集合类型的声明导出到 JavaScript (以及 TypeScript).
对于 `Set`, `Map`, 和 `List` 集合类型, 以及它们的可变(Mutable)类型, 都是如此.

要在 JavaScript 中使用 Kotlin 集合, 首先要对需要的声明标注
[`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 注解:

```kotlin
// Kotlin
@JsExport
data class User(
    val name: String,
    val friends: List<User> = emptyList()
)

@JsExport
val me = User(
    name = "Me",
    friends = listOf(User(name = "Kodee"))
)
```

然后你就可以在 JavaScript 中, 象通常的 JavaScript 数组一样使用它们:

```javascript
// JavaScript
import { User, me, KtList } from "my-module"

const allMyFriendNames = me.friends
    .asJsReadonlyArrayView()
    .map(x => x.name) // ['Kodee']
```

> 不幸的是, 还不能在 JavaScript 中创建 Kotlin 集合.
> 我们计划在 Kotlin 2.0.20 中添加这个功能.
>
{style="note"}

### 支持 createInstance() {id="support-for-createinstance"}

从 Kotlin 2.0.0 开始, 你可以在 Kotlin/JS 编译目标中使用
[`createInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/create-instance.html)
函数.
之前, 这个函数只能在 JVM 中使用.

这个函数来自 [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) 接口,
它创建指定的类的一个新的实例, 对于获得一个 Kotlin 类的运行期引用很有用.

### 支持类型安全的普通(plain) JavaScript 对象 {id="support-for-type-safe-plain-javascript-objects"}

> `js-plain-objects` plugin 是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
> `js-plain-objects` plugin **只** 支持 K2 编译器.
>
{style="warning"}

为了更容易的使用 JavaScript API, 在 Kotlin 2.0.0 中, 我们提供了一个新的 plugin: [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects),
你可以使用它创建类型安全的普通(plain) JavaScript 对象.
这个 plugin 检查你的代码中带有 `@JsPlainObject` 注解的所有 [外部接口](wasm-js-interop.md#external-interfaces),
并添加:

* 同伴对象(Companion Object)中的一个内联的 `invoke` 操作符函数, 你可以将它用作构造器.
* 一个 `.copy()` 函数, 你可以用它创建你的对象的一个拷贝, 同时修改它的一些属性.

例如:

```kotlin
import kotlinx.js.JsPlainObject

@JsPlainObject
external interface User {
    var name: String
    val age: Int
    val email: String?
}

fun main() {
    // 创建一个 JavaScript 对象
    val user = User(name = "Name", age = 10)
    // 复制这个对象, 并添加一个 email
    val copy = user.copy(age = 11, email = "some@user.com")

    println(JSON.stringify(user))
    // 输出结果为: { "name": "Name", "age": 10 }
    println(JSON.stringify(copy))
    // 输出结果为: { "name": "Name", "age": 11, "email": "some@user.com" }
}
```

通过这种方式创建任何 JavaScript 对象都更加安全, 因为你可以在编译期看到错误, 甚至你的 IDE 还可以高亮显示错误,
而不是在运行期才能看到错误.

考虑下面的示例, 它使用一个 `fetch()` 函数与 JavaScript API 交互, 使用外部接口描述 JavaScript 对象的形式:

```kotlin
import kotlinx.js.JsPlainObject

@JsPlainObject
external interface FetchOptions {
    val body: String?
    val method: String
}

// 对 Window.fetch 的封装
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// 会发生编译期错误, 因为 "metod" 不能识别为 method
fetch("https://google.com", options = FetchOptions(metod = "POST"))
// 会发生编译期错误, 因为 method 是必须的
fetch("https://google.com", options = FetchOptions(body = "SOME STRING")) 
```

相比之下, 如果你使用 `js()` 函数, 而不是创建你的 JavaScript 对象,
就只能在运行期发现错误, 或者根本不会发生错误:

```kotlin
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// 不会发生错误. 因为 "metod" 无法识别, 会使用错误的 method(GET).
fetch("https://google.com", options = js("{ metod: 'POST' }"))

// 默认会使用 GET method. 会发生运行期错误, 因为不应该出现 body.
fetch("https://google.com", options = js("{ body: 'SOME STRING' }"))
// TypeError: Window.fetch: HEAD or GET Request cannot have a body
```

要使用 `js-plain-objects` plugin, 请向你的 `build.gradle(.kts)` 文件添加以下内容:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.js-plain-objects") version "2.0.0"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.js-plain-objects" version "2.0.0"
}
```

</tab>
</tabs>

### 支持 npm 包管理器 {id="support-for-npm-package-manager"}

之前, Kotlin Multiplatform Gradle plugin 只能使用 [Yarn](https://yarnpkg.com/lang/en/) 作为包管理器, 来下载和安装 npm 依赖项.
从 Kotlin 2.0.0 开始, 你可以改为使用 [npm](https://www.npmjs.com/) 作为你的包管理器.
使用 npm 作为包管理器, 意味着在你的设置过程中, 减少了一个需要管理的工具.

为了保持向后兼容性, Yarn 仍然是默认的包管理器.
要使用 npm 作为你的包管理器, 请在你的 `gradle.properties` 文件中设置以下属性:

```kotlin
kotlin.js.yarn = false
```

### 编译 task 的变更 {id="changes-to-compilation-tasks"}

之前, `webpack` 和 `distributeResources` 编译 task 都输出到相同的目录.
而且, `distribution` task 也将 `dist` 声明为它的输出目录.
这就导致输出重叠,并产生编译警告.

因此, 从 Kotlin 2.0.0 开始, 我们实现了以下变更:

* `webpack` task 现在输出到单独的文件夹.
* `distributeResources` task 被完全删除.
* `distribution` task 现在的类型为 `Copy`, 并输出到 `dist` 文件夹.

### 不再支持旧的 Kotlin/JS JAR artifact {id="discontinuing-legacy-kotlin-js-jar-artifacts"}

从 Kotlin 2.0.0 开始, Kotlin 的发布版不再包含旧的 `.jar` 扩展名的 Kotlin/JS artifact.
旧的 artifact 过去曾在旧 Kotlin/JS 编译器中使用, 这个旧编译器已经不再支持了,
对于 IR 编译器, 使用 `klib` 格式, 不再需要旧的 artifact.

## Gradle 的改进 {id="gradle-improvements"}

Kotlin 2.0.0 完全兼容 Gradle 6.8.3 到 8.5版本.
你也可以使用最新的 Gradle 发布版, 但如果你这样做, 请记住, 你可能遇到废弃警告, 或者 Gradle 的某些新功能可能无法工作.

这个版本带来了以下变更:

* [跨平台项目中, 用于编译器选项的新的 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
* [新的 Compose 编译器 Gradle plugin](#new-compose-compiler-gradle-plugin)
* [新的属性, 用于区分 JVM 和 Android 发布的库](#new-attribute-to-distinguish-jvm-and-android-published-libraries)
* [在 Kotlin/Native 中, 改进了对 CInteropProcess 的 Gradle 依赖项处理](#improved-gradle-dependency-handling-for-cinteropprocess-in-kotlin-native)
* [Gradle 中的可见度变更](#visibility-changes-in-gradle)
* [Gradle 项目中, Kotlin 数据使用新的目录](#new-directory-for-kotlin-data-in-gradle-projects)
* [在需要时下载 Kotlin/Native 编译器](#kotlin-native-compiler-downloaded-when-needed)
* [废弃编译器选项的旧的定义方式](#deprecated-old-ways-of-defining-compiler-options)
* [提高了 AGP 的最低支持版本](#bumped-minimum-supported-agp-version)
* [新的 Gradle 属性, 用于试用最新的语言版本](#new-gradle-property-for-trying-the-latest-language-version)
* [构建报告的新的 JSON 输出格式](#new-json-output-format-for-build-reports)
* [kapt 配置从父配置(superconfiguration)继承注解处理器](#kapt-configurations-inherit-annotation-processors-from-superconfigurations)
* [Kotlin Gradle plugin 不再使用已废弃的 Gradle 约定](#kotlin-gradle-plugin-no-longer-uses-deprecated-gradle-conventions)

### 跨平台项目中, 用于编译器选项的新的 Gradle DSL {id="new-gradle-dsl-for-compiler-options-in-multiplatform-projects"}

> 这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
> 请注意, 只为评估目的来使用这个功能.
> 希望你能通过 [YouTrack](https://kotl.in/issue) 提供你的反馈意见.
>
{style="warning"}

在 Kotlin 2.0.0 之前, 在使用 Gradle 的跨平台项目中配置编译器选项, 只能在比较低的级别上进行, 例如对各个 task, 编译, 或源代码集.
为了更容易的在项目中更加宽泛的级别上配置编译器选项, Kotlin 2.0.0 带来了新的 Gradle DSL.

使用这个新 DSL, 你可以对所有的编译目标和共用的源代码集, 例如 `commonMain`, 在扩展级别配置编译器选项,
以及对特定的编译目标, 在编译目标级别配置编译器选项:

```kotlin
kotlin {
    compilerOptions {
        // 扩展级别共通的编译器选项
        // 对所有的编译目标和共用的源代码集, 用作默认设定
        allWarningsAsErrors.set(true)
    }
    jvm {
        compilerOptions {
            // 编译目标级别的 JVM 编译器选项
            // 对这个编译目标中的所有编译, 用作默认设定
            noJdk.set(true)
        }
    }
}
```

整个项目配置现在包含 3 层. 最高层是扩展级别, 然后是编译目标级别,
最低层是编译单元 (通常是一个编译 task):

![Kotlin 编译器选项的级别](compiler-options-levels.svg){width=700}

较高级别的设置会被用作较低级别的约定 (默认) 值:

* 扩展级编译器选项的值, 是编译目标级编译器选项的默认值, 包括共用的源代码集,
  例如 `commonMain`, `nativeMain`, 和 `commonTest`.
* 编译目标级编译器选项的值, 会被用作编译单元(task)的编译器选项的默认值,
  例如, `compileKotlinJvm` 和 `compileTestKotlinJvm` task.

反过来, 较低级别的配置, 会覆盖较高级别的相关设置:

* Task 级的编译器选项, 会覆盖编译目标级或扩展级的相关配置.
* 编译目标级的编译器选项, 会覆盖扩展级的相关配置.

在配置你的项目时, 要注意, 某些设置编译器选项的旧方式已经被 [废弃](#deprecated-old-ways-of-defining-compiler-options) 了.

我们鼓励你在跨平台项目中试用新的 DSL, 在 [YouTrack](https://kotl.in/issue) 留下反馈意见中,
因为我们计划让这个 DSL 成为推荐的编译器选项配置方案.

### 新的 Compose 编译器 Gradle plugin {id="new-compose-compiler-gradle-plugin"}

Jetpack Compose 编译器, 负责将可组合项(composable)翻译为 Kotlin 代码, 现在已被合并进入 Kotlin 代码仓库.
这将帮助 Compose 项目过渡到 Kotlin 2.0.0, 因为 Compose 编译器将会始终与 Kotlin 同时发布.
这也会将 Compose 编译器版本提升为 2.0.0.

要在你的项目中使用新的 Compose 编译器, 请在你的 `build.gradle(.kts)` 文件中适用 `org.jetbrains.kotlin.plugin.compose` Gradle plugin,
并将它的版本设置为与 Kotlin 2.0.0 相同.

关于这个变更, 以及迁移指南, 详情请参见 [Compose 编译器](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html) 文档.

### 新的属性, 用于区分 JVM 和 Android 发布的库 {id="new-attribute-to-distinguish-jvm-and-android-published-libraries"}

从 Kotlin 2.0.0 开始, [`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes)
Gradle 属性默认会和所有的 Kotlin 变体一起发布.

这个属性有助于发布 Kotlin Multiplatform 库的 JVM 和 Android 变体.
它指明某个库变体更加适合于某个 JVM 环境.
目标环境可以是 "android", "standard-jvm", 或 "no-jvm".

发布这个属性, 可以让非跨平台的客户端, 例如只用于 Java 的项目,
在使用带有 JVM 和 Android 编译目标的 Kotlin Multiplatform 库时更加健壮.

如果必要, 你可以禁止发布这个属性.
要做到这一点, 请向你的 `gradle.properties` 文件添加以下 Gradle 选项:

```none
kotlin.publishJvmEnvironmentAttribute=false
```

### 在 Kotlin/Native 中, 改进了对 CInteropProcess 的 Gradle 依赖项处理 {id="improved-gradle-dependency-handling-for-cinteropprocess-in-kotlin-native"}

在这个发布版中, 我们增强了 `defFile` 属性的处理, 以确保在 Kotlin/Native 项目中更好的管理 Gradle task 依赖项.

在这个更新之前, 如果 `defFile` 属性被指定为另一个还未执行的 task 的输出, 那么 Gradle 构建可能失败.
对这个问题的变通方法是, 添加一个对这个 task 的依赖项:

```kotlin
kotlin {
    macosArm64("native") {
        compilations.getByName("main") {
            cinterops {
                val cinterop by creating {
                    defFileProperty.set(createDefFileTask.flatMap { it.defFile.asFile })
                    project.tasks.named(interopProcessingTaskName).configure {
                        dependsOn(createDefFileTask)
                    }
                }
            }
        }
    }
}
```

为了解决这个问题, 有了一个新的 `RegularFileProperty` 属性, 名为 `definitionFile`.
现在, Gradle 会在关联的 task 在构建过程的稍后阶段运行之后, 延迟验证 `definitionFile` 属性是否存在.
通过这个新方案, 不再需要额外的依赖项.

`CInteropProcess` task 和 `CInteropSettings` 类使用 `definitionFile` 属性, 而不是 `defFile` 和 `defFileProperty`:

<tabs group ="build-script">
<tab id="kotlin" title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    macosArm64("native") {
        compilations.getByName("main") {
            cinterops {
                val cinterop by creating {
                    definitionFile.set(project.file("def-file.def"))
                }
            }
        }
    }
}
```

</tab>
<tab id="groovy" title="Groovy" group-key="groovy">

```groovy
kotlin {
    macosArm64("native") {
        compilations.main {
            cinterops {
                cinterop {
                    definitionFile.set(project.file("def-file.def"))
                }
            }
        }
    }
}
```

</tab>
</tabs>

> `defFile` 和 `defFileProperty` 参数已废弃.
>
{style="warning"}

### Gradle 中的可见度变更 {id="visibility-changes-in-gradle"}

> 这个变更只影响 Kotlin DSL 使用者.
>
{style="note"}

在 Kotlin 2.0.0 中, 我们修改了 Kotlin Gradle Plugin, 以便在你的构建脚本中得到更好的控制, 以及更高的安全性.
之前, 用于特定的 DSL 上下文的某些 Kotlin DSL 函数和属性, 会被无意中泄露到其它 DSL 上下文中.
这种泄露可能导致, 使用错误的编译器选项, 设置被多次适用, 以及其它配置错误:

```kotlin
kotlin {
    // 编译目标 DSL 不能访问
    // 定义在 kotlin{} 扩展 DSL 中的方法和属性
    jvm {
        // 编译 DSL 不能访问
        // 定义在 kotlin{} 扩展 DSL 和 Kotlin jvm{} 编译目标 DSL 中的方法和属性
        compilations.configureEach {
            // 编译 task DSL 不能访问
            // 定义在 kotlin{} 扩展, Kotlin jvm{} 编译目标, 或 Kotlin 编译 DSL 中的方法和属性
            compileTaskProvider.configure {
                // 例如:
                explicitApi()
                // 错误, 因为它定义在 kotlin{} 扩展 DSL 中
                mavenPublication {}
                // 错误, 因为它定义在 Kotlin jvm{} target DSL 中
                defaultSourceSet {}
                // 错误, 因为它定义在 Kotlin 编译 DSL 中
            }
        }
    }
}
```

为了解决这个问题, 我们添加了 `@KotlinGradlePluginDsl` 注解,
防止 Kotlin Gradle plugin DSL 函数和属性暴露到它们不应该能够使用的层级.
以下层级之间会相互分离:

* Kotlin 扩展
* Kotlin 编译目标
* Kotlin 编译
* Kotlin 编译 task

对于最常见的情况, 我们添加了编译器警告, 其中包含当你的构建脚本配置不正确时如何修正的建议.
例如:

```kotlin
kotlin {
    jvm {
        sourceSets.getByName("jvmMain").dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:1.7.3")
        }
    }
}
```

这种情况下, 对 `sourceSets` 的警告消息是:

```none
[DEPRECATION] 'sourceSets: NamedDomainObjectContainer<KotlinSourceSet>' is deprecated.Accessing 'sourceSets' container on the Kotlin target level DSL is deprecated. Consider configuring 'sourceSets' on the Kotlin extension level.
```

对于这个变更, 希望你能提供反馈意见!
请在我们的 [#gradle Slack channel](https://kotlinlang.slack.com/archives/C19FD9681) 中, 直接向 Kotlin 开发者分享你的评论.
[请到这里获取 Slack 邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

### Gradle 项目中, Kotlin 数据使用新的目录 {id="new-directory-for-kotlin-data-in-gradle-projects"}

> 不要将 `.kotlin` 目录提交到版本控制系统.
> 例如, 如果你使用 Git, 请将 `.kotlin` 添加到你的项目的 `.gitignore` 文件.
>
{style="warning"}

在 Kotlin 1.8.20 中, Kotlin Gradle plugin 将它的数据存储切换到了 Gradle 项目缓存目录中: `<project-root-directory>/.gradle/kotlin`.
但是, `.gradle` 目录被保留为专供 Gradle 使用, 因此不能保证它未来能够正常使用.

为了解决这个问题, 从 Kotlin 2.0.0 开始, 我们默认将 Kotlin 数据存储在你的 `<project-root-directory>/.kotlin` 中.
我们会继续将一些数据存储在 `.gradle/kotlin` 目录中, 以保证向后兼容性.

你可以配置的新的 Gradle 属性是:

| Gradle 属性                                           | 描述                                                           |
|-----------------------------------------------------|--------------------------------------------------------------|
| `kotlin.project.persistent.dir`                     | 配置你的项目级数据的存储位置. 默认值: `<project-root-directory>/.kotlin`      |
| `kotlin.project.persistent.dir.gradle.disableWrite` | 一个 boolean 值, 控制是否禁止将 Kotlin 数据写入 `.gradle` 目录. 默认值: `false` |

要让这些属性生效, 请将它们添加到你的项目的 `gradle.properties` 文件.

### 在需要时下载 Kotlin/Native 编译器 {id="kotlin-native-compiler-downloaded-when-needed"}

在 Kotlin 2.0.0 之前, 如果在你的跨平台项目的 Gradle 构建脚本中, 存在 [Kotlin/Native 编译目标](native-target-support.md) 配置,
Gradle 总是会在 [配置阶段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:configuration)
下载 Kotlin/Native 编译器.

即使不存在 [执行阶段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution) 运行的,
对 Kotlin/Native 编译目标编译代码的 task, 也会发生这种情况.
对于只想查看他们项目中的 JVM 或 JavaScript 代码的使用者来说, 通过这种方式下载 Kotlin/Native 编译器是非常低效的.
例如, 作为 CI 流程的一部分, 对他们的 Kotlin 项目执行测试或检查的情况.

在 Kotlin 2.0.0 中, 我们修改了 Kotlin Gradle plugin 中的这个行为,
让 Kotlin/Native 编译器在 [执行阶段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution) 下载,
并且 **只有** 要求对 Kotlin/Native 编译目标进行编译时才会下载.

反过来, Kotlin/Native 编译器的依赖项, 现在也不会作为编译器的一部分下载, 而是在执行阶段中下载.

如果你遇到与这个新行为相关的任何问题, 你可以向你的 `gradle.properties` 文件添加以下 Gradle 属性, 暂时切换回之前的行为:

```none
kotlin.native.toolchain.enabled=false
```

从 Kotlin 1.9.20-Beta 开始, 除 CDN 之外, Kotlin/Native 的发行版还会发布到 [Maven Central](https://repo.maven.apache.org/maven2/org/jetbrains/kotlin/kotlin-native-prebuilt/).

这使得我们能够改变 Kotlin 查找并下载必要的 artifact 的方式.
默认情况下, 它现在使用你在项目的 `repositories {}` 代码块中指定的 Maven 仓库, 而不是 CDN.

你可以在你的 `gradle.properties` 文件中设置以下 Gradle 属性, 暂时切换到以前的行为:

```none
kotlin.native.distribution.downloadFromMaven=false
```

如果遇到任何问题, 请报告到我们的问题追踪系统 [YouTrack](https://kotl.in/issue).
这两个修改默认行为的 Gradle 属性都只是临时的, 会在未来的发布版中删除.

### 废弃编译器选项的旧的定义方式 {id="deprecated-old-ways-of-defining-compiler-options"}

在这个发布版中, 我们继续编译器选项的设置方式.
它应该能够解决不同方式之间的歧义, 并使得项目配置更加直观.

从 Kotlin 2.0.0 开始, 以下用于指定编译器选项的 DSL 已被废弃:

* `KotlinCompile` 接口中的 `kotlinOptions` DSL, 实现所有的 Kotlin 编译 task.
  请改为使用 `KotlinCompilationTask<CompilerOptions>`.
* `KotlinCompilation` 接口中的, 类型为 `HasCompilerOptions` 的 `compilerOptions` 属性.
  这个 DSL 与其它 DSL 不一致, 并且与 `KotlinCompilation.compileTaskProvider` 编译 task 中的 `compilerOptions`
  配置相同的 `KotlinCommonCompilerOptions` 对象, 因此让使用者困惑.

  相反, 我们推荐使用 Kotlin 编译 task 中的 `compilerOptions` 属性:

  ```kotlin
  kotlinCompilation.compileTaskProvider.configure {
      compilerOptions { ... }
  }
  ```

  例如:

  ```kotlin
  kotlin {
      js(IR) {
          compilations.all {
              compileTaskProvider.configure {
                  compilerOptions.freeCompilerArgs.add("-Xir-minimized-member-names=false")
              }
          }
      }
  }
  ```

* `KotlinCompilation` 接口中的 `kotlinOptions` DSL.
* `KotlinNativeArtifactConfig` 接口中的 `kotlinOptions` DSL,
  `KotlinNativeLink` 类, 以及 `KotlinNativeLinkArtifactTask` 类.
  请改为使用 `toolOptions` DSL.
* `KotlinJsDce` 接口中的 `dceOptions` DSL. 请改为使用 `toolOptions` DSL.

关于如何在 Kotlin Gradle plugin 中指定编译器选项, 请参见 [如何定义选项](gradle-compiler-options.md#how-to-define-options).

### 提高了 AGP 的最低支持版本 {id="bumped-minimum-supported-agp-version"}

从 Kotlin 2.0.0 开始, 最低支持的 Android Gradle plugin 版本是 7.1.3.

### 新的 Gradle 属性, 用于试用最新的语言版本 {id="new-gradle-property-for-trying-the-latest-language-version"}

在 Kotlin 2.0.0 之前, 我们提供了以下 Gradle 属性来试用新的 K2 编译器: `kotlin.experimental.tryK2`.
现在 K2 编译器在 Kotlin 2.0.0 中已经默认启用了, 我们决定将这个属性演化为一个新的形式,
你可以使用它在你的项目中试用最新的语言版本: `kotlin.experimental.tryNext`.
当你在 `gradle.properties` 文件中使用这个属性时, Kotlin Gradle plugin 会使用比你的 Kotlin 版本的默认语言版本更高一个版本.
例如, 在 Kotlin 2.0.0 中, 默认的语言版本是 2.0, 因此这个属性会将语言版本配置为 2.1.

这个新的 Gradle 属性会在 [构建报告](gradle-compilation-and-caches.md#build-reports) 中,
生成与之前使用 `kotlin.experimental.tryK2` 时类似的指标.
配置的语言版本会包含在输出中. 例如:

```none
##### 'kotlin.experimental.tryNext' results #####
:app:compileKotlin: 2.1 language version
:lib:compileKotlin: 2.1 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.1 #####
```

关于如何启用构建报告, 以及构建报告的内容, 请参见 [构建报告](gradle-compilation-and-caches.md#build-reports).

### 构建报告的新的 JSON 输出格式 {id="new-json-output-format-for-build-reports"}

在 Kotlin 1.7.0 中, 我们引入了构建报告, 帮助追踪编译器的性能.
随着时间的推移, 我们添加了更多的指标, 让这些报告更加详细, 在调查性能问题时更有帮助.
之前, 本地文件唯一的输出格式是 `*.txt` 格式.
在 Kotlin 2.0.0 中, 我们支持 JSON 输出格式, 使得更容易使用其它工具进行分析.

要为你的构建报告配置 JSON 输出格式, 请在你的 `gradle.properties` 文件中声明以下属性:

```none
kotlin.build.report.output=json

// 用来存储你的构建报告的目录
kotlin.build.report.json.directory=my/directory/path
```

或者, 你也可以运行以下命令:

```shell
./gradlew assemble -Pkotlin.build.report.output=json -Pkotlin.build.report.json.directory="my/directory/path"
``` 

配置完成后, Gradle 会在你指定的目录中生成构建报告, 名称为:
`${project_name}-date-time-<sequence_number>.json`.

下面是一个使用 JSON 输出格式的构建报告的示例片段, 其中包含构建指标和汇总指标:

```json
"buildOperationRecord": [
    {
     "path": ":lib:compileKotlin",
      "classFqName": "org.jetbrains.kotlin.gradle.tasks.KotlinCompile_Decorated",
      "startTimeMs": 1714730820601,
      "totalTimeMs": 2724,
      "buildMetrics": {
        "buildTimes": {
          "buildTimesNs": {
            "CLEAR_OUTPUT": 713417,
            "SHRINK_AND_SAVE_CURRENT_CLASSPATH_SNAPSHOT_AFTER_COMPILATION": 19699333,
            "IR_TRANSLATION": 281000000,
            "NON_INCREMENTAL_LOAD_CURRENT_CLASSPATH_SNAPSHOT": 14088042,
            "CALCULATE_OUTPUT_SIZE": 1301500,
            "GRADLE_TASK": 2724000000,
            "COMPILER_INITIALIZATION": 263000000,
            "IR_GENERATION": 74000000,
...
          }
        }
...
 "aggregatedMetrics": {
    "buildTimes": {
      "buildTimesNs": {
        "CLEAR_OUTPUT": 782667,
        "SHRINK_AND_SAVE_CURRENT_CLASSPATH_SNAPSHOT_AFTER_COMPILATION": 22031833,
        "IR_TRANSLATION": 333000000,
        "NON_INCREMENTAL_LOAD_CURRENT_CLASSPATH_SNAPSHOT": 14890292,
        "CALCULATE_OUTPUT_SIZE": 2370750,
        "GRADLE_TASK": 3234000000,
        "COMPILER_INITIALIZATION": 292000000,
        "IR_GENERATION": 89000000,
...
      }
    }
```

### kapt 配置从父配置(superconfiguration)继承注解处理器 {id="kapt-configurations-inherit-annotation-processors-from-superconfigurations"}

在 Kotlin 2.0.0 之前, 如果你想要在一个单独的 Gradle 配置中定义一组共通的注解处理器, 并在子项目的 kapt 相关配置中扩展这个配置,
kapt 会跳过注解处理, 因为它无法找到任何注解处理器.
在 Kotlin 2.0.0 中, kapt 可以成功的检测到, 存在对你的注解处理器的间接依赖项.

例如, 对一个使用 [Dagger](https://dagger.dev/) 的子项目, 在你的 `build.gradle(.kts)` 文件中, 使用以下配置:

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

在这个示例中, Gradle 配置 `commonAnnotationProcessors` 是你对注解处理的共通配置, 你希望对所有的项目使用这个配置.
你使用 [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom)
方法, 将 `commonAnnotationProcessors` 添加为父配置(superconfiguration).
kapt 会看到 Gradle 配置 `commonAnnotationProcessors` 存在一个对 Dagger 注解处理器的依赖项.
因此, kapt 会在它的配置中包含 Dagger 注解处理器, 用于注解处理.

感谢 Christoph Loy [实现了这个功能](https://github.com/JetBrains/kotlin/pull/5198)!

### Kotlin Gradle plugin 不再使用已废弃的 Gradle 约定 {id="kotlin-gradle-plugin-no-longer-uses-deprecated-gradle-conventions"}

在 Kotlin 2.0.0 之前, 如果你使用 Gradle 8.2 或更高版本, Kotlin Gradle plugin 会错误的使用 Gradle 8.2 中已被废弃的约定.
这会导致 Gradle 报告构建废弃警告.
在 Kotlin 2.0.0 中, Kotlin Gradle plugin 已经更新, 当你使用 Gradle 8.2 或更高版本时, 不再触发这些废弃警告.

## 标准库 {id="standard-library"}

这个发布版为 Kotlin 标准库带来了进一步的稳定性, 并让更多的既有的函数成为所有平台上共通函数:

* [枚举类型值的泛型函数的替代进入稳定版](#stable-replacement-of-the-enum-class-values-generic-function)
* [AutoCloseable 接口进入稳定版](#stable-autocloseable-interface)
* [共通的 protected 属性 AbstractMutableList.modCount](#common-protected-property-abstractmutablelist-modcount)
* [共通的 protected 函数 AbstractMutableList.removeRange](#common-protected-function-abstractmutablelist-removerange)
* [共通的 String.toCharArray(destination)](#common-string-tochararray-destination-function)

### 枚举类型值的泛型函数的替代进入稳定版 {id="stable-replacement-of-the-enum-class-values-generic-function"}

在 Kotlin 2.0.0 中, `enumEntries<T>()` 函数进入 [稳定版](components-stability.md#stability-levels-explained).
`enumEntries<T>()` 函数是对泛型函数 `enumValues<T>()` 的替代.
新的函数返回一个 List, 包含指定的枚举类型 `T` 的所有枚举值.
之前引入了枚举类的 `entries` 属性, 而且也进入稳定版, 可以替代合成(synthetic)函数 `values()`.
关于 `entries` 属性, 详情请参见 [Kotlin 1.8.20 中的新功能](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function).

> `enumValues<T>()` 函数仍然支持, 但我们推荐你改为使用 `enumEntries<T>()` 函数, 因为它的性能损失较少.
> 每次调用 `enumValues<T>()`, 都会创建一个新的数组,
> 而每次调用 `enumEntries<T>()`, 都会返回相同的 List, 这样要高效得多.
>
{style="tip"}

例如:

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>()
// 输出结果为: RED, GREEN, BLUE
```

### AutoCloseable 接口进入稳定版 {id="stable-autocloseable-interface"}

在 Kotlin 2.0.0 中, 共通的 [`AutoCloseable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/)
接口进入 [稳定版](components-stability.md#stability-levels-explained).
它帮助你轻松的关闭资源, 并包含一组有用的函数:

* `use()` 扩展函数, 在指定的资源上执行给定的代码块函数, 然后正确的关闭资源, 无论是否有异常抛出.
* `AutoCloseable()` 构造器函数, 创建 `AutoCloseable` 接口的实例.

在下面的示例中, 我们定义 `XMLWriter` 接口, 并假定有一个资源实现了这个接口.
例如, 这个资源可以是一个类, 它打开文件, 写入 XML 内容, 然后关闭文件:

```kotlin
interface XMLWriter {
    fun document(encoding: String, version: String, content: XMLWriter.() -> Unit)
    fun element(name: String, content: XMLWriter.() -> Unit)
    fun attribute(name: String, value: String)
    fun text(value: String)

    fun flushAndClose()
}

fun writeBooksTo(writer: XMLWriter) {
    val autoCloseable = AutoCloseable { writer.flushAndClose() }
    autoCloseable.use {
        writer.document(encoding = "UTF-8", version = "1.0") {
            element("bookstore") {
                element("book") {
                    attribute("category", "fiction")
                    element("title") { text("Harry Potter and the Prisoner of Azkaban") }
                    element("author") { text("J. K. Rowling") }
                    element("year") { text("1999") }
                    element("price") { text("29.99") }
                }
                element("book") {
                    attribute("category", "programming")
                    element("title") { text("Kotlin in Action") }
                    element("author") { text("Dmitry Jemerov") }
                    element("author") { text("Svetlana Isakova") }
                    element("year") { text("2017") }
                    element("price") { text("25.19") }
                }
            }
        }
    }
}
```

### 共通的 protected 属性 AbstractMutableList.modCount {id="common-protected-property-abstractmutablelist-modcount"}

在这个发布版中, `AbstractMutableList` 接口中的 `protected` 属性 [`modCount`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/mod-count.html)
成为共通属性.
之前, `modCount` 属性可以在各个平台使用, 但不能在共通编译目标中使用.
现在, 你可以创建 `AbstractMutableList` 的自定义实现, 并访问在共通代码中这个属性.

这个属性追踪对集合执行的结构化修改的次数.
包括改变集合大小的操作, 或以可能导致正在进行的迭代返回错误结果的方式改变列表的操作.

在实现自定义 List 时, 你可以使用 `modCount` 属性来注册和检测并发的修改.

### 共通的 protected 函数 AbstractMutableList.removeRange {id="common-protected-function-abstractmutablelist-removerange"}

在这个发布版中, `AbstractMutableList` 接口中的 `protected` 函数 [`removeRange()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/remove-range.html)
成为共通函数.
之前, 它可以在各个平台使用, 但不能在共通编译目标中使用.
现在, 你可以创建 `AbstractMutableList` 的自定义实现, 并在共通代码中覆盖这个函数.

The 函数 removes elements from this list 以下 the specified range. By overriding this 函数, 你 可以 take
advantage of the custom implementations and improve the 性能 of the list operation.

### 共通的 String.toCharArray(destination) 函数 {id="common-string-tochararray-destination-function"}

这个发布版引入了一个共通的 [`String.toCharArray(destination)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html)
函数.
之前, 它只能在 JVM 上使用.

让我们来比较这个函数和既有的 [`String.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html)
函数.
它会创建一个新的 `CharArray`, 其中包含指定的字符串中的字符.
然而, 新的共通函数 `String.toCharArray(destination)`, 会将 `String` 字符移动到一个既有的目标 `CharArray` 中.
如果你已经有了一个缓冲区, 想要填充这个缓冲区, 这会很有用:

```kotlin
fun main() {
    val myString = "Kotlin is awesome!"
    val destinationArray = CharArray(myString.length)

    // 转换字符串, 并存储到 destinationArray 中:
    myString.toCharArray(destinationArray)

    for (char in destinationArray) {
        print("$char ")
        // 输出结果为: K o t l i n   i s   a w e s o m e !
    }
}
```
{kotlin-runnable="true"}

## 安装 Kotlin 2.0.0 {id="install-kotlin-2-0-0"}

从 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 开始,
Kotlin plugin 作为一个包含在 IDE 中的捆绑 plugin 发布.
这意味着你不再能够通过 JetBrains Marketplace 安装这个 plugin.

要更新到新的 Kotlin 版本, 请在你的构建脚本中 [变更 Kotlin 版本](releases.md#update-to-a-new-kotlin-version) 到 2.0.0.
