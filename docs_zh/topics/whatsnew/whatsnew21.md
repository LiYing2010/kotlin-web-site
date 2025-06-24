[//]: # (title: Kotlin 2.1.0 中的新功能)

_[发布日期: 2024/11/27](releases.md#release-details)_

Kotlin 2.1.0 已经发布了! 以下是它的一些最重要的功能:

* **新的语言功能特性(预览版)**: [带主语(Subject)的 `when` 中的保护条件(Guard Condition)](#guard-conditions-in-when-with-a-subject),
  [非局部的(non-local) `break` 和 `continue`](#non-local-break-and-continue), 以及 [多 `$` 符号字符串插值(Interpolation)](#multi-dollar-string-interpolation).
* **K2 编译器更新**: [编译器检查的更多灵活性](#extra-compiler-checks) 以及 [kapt 实现的改善](#improved-k2-kapt-implementation).
* **Kotlin Multiplatform**: 引入了 [对 Swift 导出的基本支持](#basic-support-for-swift-export),
  [用于编译器选项的 Gradle DSL 进入稳定版](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable), 等等.
* **Kotlin/Native**: [改善了对 `iosArm64` 的支持](#iosarm64-promoted-to-tier-1), 以及其它更新.
* **Kotlin/Wasm**: 多种更新, 包括 [对增量编译的支持](#support-for-incremental-compilation).
* **Gradle 支持**: [改善了更新版本的 Gradle 与 Android Gradle plugin 的兼容性](#gradle-improvements),
  以及 [对 Kotlin Gradle plugin API 的更新](#new-api-for-kotlin-gradle-plugin-extensions).
* **文档**: [Kotlin 文档的重大改进](#documentation-updates).

## IDE 支持 {id="ide-support"}

最新的 IntelliJ IDEA 和 Android Studio 中绑定了支持 2.1.0 的 Kotlin plugin.
你不需要在你的 IDE 中更新 Kotlin plugin.
你需要做的只是在你的构建脚本中将 Kotlin 版本修改为 2.1.0.

详情请参见 [更新到新的 Kotlin 版本](releases.md#update-to-a-new-kotlin-version).

## 语言 {id="language"}

在发布了包含 K2 编译器的 Kotlin 2.0.0 之后, JetBrains 开发组致力于通过新的功能特性来改进语言.
在这个发布版中, 我们很高兴的宣布语言设计方面的几项新改进.

这些功能特性目前是预览版, 我们鼓励你试用这些功能, 并分享你的反馈:

* [带主语(Subject)的 `when` 中的保护条件(Guard Condition)](#guard-conditions-in-when-with-a-subject)
* [非局部的(non-local) `break` 和 `continue`](#non-local-break-and-continue)
* [多 `$` 符号字符串插值(Interpolation): 改进了字符串字面值中的 `$` 处理](#multi-dollar-string-interpolation)

> 在最新的 IntelliJ IDEA 2024.3 版本(启用 K2 模式)中, 所有这些功能特性都拥有 IDE 支持.
>
> 详情请参见 [IntelliJ IDEA 2024.3 的 blog](https://blog.jetbrains.com/idea/2024/11/intellij-idea-2024-3/).
>
{style="tip"}

[参见 Kotlin 语言设计的功能特性与提案的完整列表](kotlin-language-features-and-proposals.md).

这个发布版还带来了以下语言更新:

* [](#support-for-requiring-opt-in-to-extend-apis)
* [](#improved-overload-resolution-for-functions-with-generic-types)
* [](#improved-exhaustiveness-checks-for-when-expressions-with-sealed-classes)

### 带主语(Subject)的 when 中的保护条件(Guard Condition) {id="guard-conditions-in-when-with-a-subject"}

> 这个功能是 [预览版](kotlin-evolution-principles.md#pre-stable-features),
> 需要使用者同意(Opt-in) (详情见下文).
>
> 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71140) 提供你的反馈意见.
>
{style="warning"}

从 2.1.0 开始, 你可以在带主语(Subject)的 `when` 表达式或语句中使用保护条件(Guard Condition).

保护条件允许你在 `when` 表达式的分支中包含一个以上的条件, 让复杂的控制流变得更加明确和简洁, 并使代码结构更加扁平.

要在一个分支中包含保护条件, 请将它放在主条件之后, 用 `if` 分隔:

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal {
        fun feedCat() {}
    }

    data class Dog(val breed: String) : Animal {
        fun feedDog() {}
    }
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // 只带有主条件的分支. 当 `animal` 是 `Dog` 时, 调用 `feedDog()`
        is Animal.Dog -> animal.feedDog()
        // 带有主条件和保护条件的分支. 当 `animal` 是 `Cat`, 并且不是 `mouseHunter` 时, 调用 `feedCat()`
        is Animal.Cat if !animal.mouseHunter -> animal.feedCat()
        // 如果上面的条件都不成立, 打印输出 "Unknown animal"
        else -> println("Unknown animal")
    }
}
```

在单个 `when` 表达式中, 你可以组合使用带有保护条件和不带保护条件的分支.
带有保护条件的分支中的代码, 只有在主条件和保护条件的计算结果都为 `true` 时才会运行.
如果主条件不成立, 那么保护条件不会被计算.
此外, 保护条件支持 `else if`.

在你的项目中要启用保护条件, 请在命令行中使用以下编译器选项:

```bash
kotlinc -Xwhen-guards main.kt
```

或者, 将它添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码块:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-guards")
    }
}
```

### 非局部的(non-local) break 和 continue {id="non-local-break-and-continue"}

> 这个功能是 [预览版](kotlin-evolution-principles.md#pre-stable-features),
> 需要使用者同意(Opt-in) (详情见下文).
>
> 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-1436) 提供你的反馈意见.
>
{style="warning"}

Kotlin 2.1.0 添加了另一个期待已久的功能的预览版, 允许使用非局部的(non-local) `break` 和 `continue`.
这个功能扩展了你在内联函数范围内能够使用的工具集, 并减少你的项目中的样板代码.

以前, 你只能使用非局部的(non-local) 返回.
现在, Kotlin 还支持非局部的 `break` 和 `continue` [跳转表达式](returns.md).
这就意味着, 对于包含循环的内联函数, 在作为参数传递给这个内联函数的 Lambda 表达式中, 你可以使用它们:

```kotlin
fun processList(elements: List<Int>): Boolean {
    for (element in elements) {
        val variable = element.nullableMethod() ?: run {
            log.warning("Element is null or invalid, continuing...")
            continue
        }
        if (variable == 0) return true // 如果 variable 为 0, 返回 true
    }
    return false
}
```

要在你的项目中试用这个功能, 请在命令行中使用 `-Xnon-local-break-continue` 编译器选项:

```bash
kotlinc -Xnon-local-break-continue main.kt
```

或者, 将它添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码块:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnon-local-break-continue")
    }
}
```

我们计划在将来的 Kotlin 发布版中让这个功能进入稳定版.
如果你在使用非局部的 `break` 和 `continue` 时遇到任何问题,
请在我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-1436) 中报告问题.

### 多 `$` 符号字符串插值(Interpolation) {id="multi-dollar-string-interpolation"}

> 这个功能是 [预览版](kotlin-evolution-principles.md#pre-stable-features)
> 需要使用者同意(Opt-in) (详情见下文).
>
> 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-2425) 提供你的反馈意见.
>
{style="warning"}

Kotlin 2.1.0 引入了对多 `$` 符号字符串插值(Interpolation)的支持, 它改进了字符串字面值中对 `$` 符号的处理方式.
这个功能对需要使用多个 `$` 符号的情况很有帮助,
例如模板引擎, JSON 模式, 或其它数据格式.

Kotlin 中的字符串插值使用单个 `$` 符号.
但是, 在字符串中将 `$` 符号用作字面值, (这是财物数据和模板系统中的常见情况), 会需要变通方法, 例如 `${'$'}`.
启用多 `$` 符号插值功能后, 你就可以配置需要多少个 `$` 符号来触发插值, 较少的 `$` 符号会被当做字符串字面值.

下面是一个示例, 演示如何生成 JSON 模式的多行字符串, 其中带有使用 `$` 的占位符:

```kotlin
val KClass<*>.jsonSchema : String
    get() = $$"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta"
      "title": "$${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

这个示例中, `$$` 前缀表示你需要 **2 个 `$` 符号** (`$$`) 来触发插值.
它会阻止 `$schema`, `$id`, 和 `$dynamicAnchor` 被翻译为插值标记.

在处理那些占位符语法中使用 `$` 符号的系统时, 这种方法非常有帮助.

要启用这个功能, 请在命令行中使用以下编译器选项:

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

或者, 更新你的 Gradle 构建文件的 `compilerOptions {}` 代码块:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

如果你的代码已经使用了标准的单个 `$` 符号的字符串插值, 那么不需要任何变更.
你可以在字符串中需要 `$` 符号字面值时, 使用 `$$`.

### 支持对扩展 API (extend API) 要求使用者同意 {id="support-for-requiring-opt-in-to-extend-apis"}

Kotlin 2.1.0 引入了 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 注解,
它允许库的开发者, 在使用者实现实验性的接口或继承实验性的类之前, 明确要求使用者同意.

如果一个库 API 的使用已经进入稳定状态, 但继承还没有进入稳定状态, 因为它将来可能会引入新的抽象函数进行演进,
那么这个功能可以很有用.

要对一个 API 元素添加使用者同意的要求, 请使用 `@SubclassOptInRequired` 注解, 其中指定注解类的引用:

```kotlin
@RequiresOptIn(
level = RequiresOptIn.Level.WARNING,
message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
interface CoreLibraryApi
```

这个示例中, `CoreLibraryApi` 接口要求使用者同意, 然后才可以实现它.
使用者可以这样表示使用者同意:

```kotlin
@OptIn(UnstableApi::class)
interface MyImplementation: CoreLibraryApi
```

> 当你使用 `@SubclassOptInRequired` 注解来要求使用者同意,
> 使用者同意要求不会传播到任何 [内部类或嵌套类](nested-classes.md).
>
{style="note"}

关于如何在你的 API 中使用 `@SubclassOptInRequired` 注解的真实示例,
请参见 `kotlinx.coroutines` 库中的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) 接口.

### 改进了对带有泛型类型的函数的重载(overload)解析 {id="improved-overload-resolution-for-functions-with-generic-types"}

以前, 如果你的一个函数存在很多重载(overload), 其中一部分重载存在泛型类型的值参数,
其它重载在相同的参数位置存在函数类型, 那么这样的重载的解析动作有时可能会不一致.

根据你的重载是成员函数还是扩展函数, 会导致不同的行为.
例如:

```kotlin
class KeyValueStore<K, V> {
    fun store(key: K, value: V) {} // 重载函数 1
    fun store(key: K, lazyValue: () -> V) {} // 重载函数 2
}

fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, value: V) {} // 重载函数 1
fun <K, V> KeyValueStore<K, V>.storeExtension(key: K, lazyValue: () -> V) {} // 重载函数 2

fun test(kvs: KeyValueStore<String, Int>) {
    // 成员函数
    kvs.store("", 1)    // 解析到重载函数 1
    kvs.store("") { 1 } // 解析到重载函数 2

    // 扩展函数
    kvs.storeExtension("", 1)    // 解析到重载函数 1
    kvs.storeExtension("") { 1 } // 无法解析
}
```

在这个示例中, `KeyValueStore` 类的 `store()` 函数有 2 个重载,
其中一个重载的函数参数是泛型类型 `K` 和 `V`,
另一个重载的参数是 Lambda 函数, 返回泛型类型 `V`.
类似的, 扩展函数 `storeExtension()` 也有 2 重载.

当使用和不使用 Lambda 函数来调用 `store()` 函数时, 编译器成功的解析到正确的重载函数.
但是, 当使用 Lambda 函数调用扩展函数 `storeExtension()` 时,
编译器不能解析到正确的重载, 因为它错误的认为 2 个重载都可以使用.

为了解决这个问题, 我们引入了一个新的启发方法,
当泛型类型的函数参数根据另一个参数的信息无法接受 Lambda 函数时, 编译器可以丢弃一个可能的重载.
这个变更让成员函数和扩展函数的行为保持一致, 而且在 Kotlin 2.1.0 中默认启用.

### 改进了使用封闭类的 when 表达式的穷尽检查 {id="improved-exhaustiveness-checks-for-when-expressions-with-sealed-classes"}

在 Kotlin 的以前版本中, 对于带有封闭上限(Sealed Upper Bound)的类型参数的 `when` 表达式,
即使已经覆盖了 `sealed class` 层级结构中的所有情况, 编译器仍然会要求 `else` 分支.
在 Kotlin 2.1.0 中, 已经解决并改善了这个问题, 使得穷尽检查更加强大,
并允许你删除不必要的 `else` 分支, 让 `when` 表达式更清晰, 更直观.

下面的示例演示这个变更:

```kotlin
sealed class Result
object Error: Result()
class Success(val value: String): Result()

fun <T : Result> render(result: T) = when (result) {
    Error -> "Error!"
    is Success -> result.value
    // 不需要 else 分支
}
```

## Kotlin K2 编译器 {id="kotlin-k2-compiler"}

在 Kotlin 2.1.0 中, K2 编译器现在提供了 [使用编译器检查](#extra-compiler-checks)
和 [警告](#global-warning-suppression) 时的更多灵活性, 以及 [对 kapt plugin 支持的改善](#improved-k2-kapt-implementation).

### 额外的编译器检查 {id="extra-compiler-checks"}

在 Kotlin 2.1.0 中, 现在你可以启用 K2 编译器的额外检查.
这些检查是额外的声明, 表达式, 和类型检查, 通常对编译并不重要,
但如果想要校验以下情况, 这些检查会很有用:

| 检查 类型                                                 | 注释                                                                             |
|-------------------------------------------------------|--------------------------------------------------------------------------------|
| `REDUNDANT_NULLABLE`                                  | 使用了 `Boolean??`, 而不是 `Boolean?`                                                |
| `PLATFORM_CLASS_MAPPED_TO_KOTLIN`                     | 使用了 `java.lang.String`, 而不是 `kotlin.String`                                    |
| `ARRAY_EQUALITY_OPERATOR_CAN_BE_REPLACED_WITH_EQUALS` | 使用了 `arrayOf("") == arrayOf("")`, 而不是 `arrayOf("").contentEquals(arrayOf(""))` |
| `REDUNDANT_CALL_OF_CONVERSION_METHOD`                 | 使用了 `42.toInt()`, 而不是 `42`                                                     |
| `USELESS_CALL_ON_NOT_NULL`                            | 使用了 `"".orEmpty()`, 而不是 `""`                                                   |
| `REDUNDANT_SINGLE_EXPRESSION_STRING_TEMPLATE`         | 使用了 `"$string"`, 而不是 `string`                                                  |
| `UNUSED_ANONYMOUS_PARAMETER`                          | 一个参数传递给了 Lambda 表达式, 但未被使用                                                     |
| `REDUNDANT_VISIBILITY_MODIFIER`                       | 使用了 `public class Klass`, 而不是 `class Klass`                                    |
| `REDUNDANT_MODALITY_MODIFIER`                         | 使用了 `final class Klass`, 而不是 `class Klass`                                     |
| `REDUNDANT_SETTER_PARAMETER_TYPE`                     | 使用了 `set(value: Int)`, 而不是 `set(value)`                                        |
| `CAN_BE_VAL`                                          | 定义了 `var local = 0`, 但没有重新赋值, 可以改为使用 `val local = 42`                          |
| `ASSIGNED_VALUE_IS_NEVER_READ`                        | 定义了 `val local = 42`, 但在之后的代码中没有使用                                             |
| `UNUSED_VARIABLE`                                     | 定义了 `val local = 0`, 但在代码中没有使用                                                 |
| `REDUNDANT_RETURN_UNIT_TYPE`                          | 使用了 `fun foo(): Unit {}`, 而不是 `fun foo() {}`                                   |
| `UNREACHABLE_CODE`                                    | 存在代码语句, 但永远无法执行                                                                |

如果检查结果为 true, 你会收到编译器警告, 包含如何修正问题的建议.

额外检查默认禁用.
要启用这些检查, 请在命令行中使用 `-Wextra` 编译器选项,
或在你的 Gradle 构建文件的 `compilerOptions {}` 代码块中指定 `extraWarnings`:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
    }
}
```

关于如何定义和使用编译器选项,
详情请参见 [Kotlin Gradle plugin 中的编译器选项](gradle-compiler-options.md).

### 全局压制警告 {id="global-warning-suppression"}

在 2.1.0 中, Kotlin 编译器有了一个开发者普遍要求的功能 – 全局压制警告.

现在你可以在整个项目中压制某个特定的警告, 方法是在命令行中使用 `-Xsuppress-warning=WARNING_NAME` 语法,
或者在你的构建文件的 `compilerOptions {}` 代码块中使用 `freeCompilerArgs` 属性.

例如, 如果你的项目中启用了 [额外的编译器检查](#extra-compiler-checks), 但想要压制其中某一种警告, 请使用以下设置:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        extraWarnings.set(true)
        freeCompilerArgs.add("-Xsuppress-warning=CAN_BE_VAL")
    }
}
```

如果你想要压制某个警告, 但不知道它的名称, 请选择那个元素, 并点击灯泡图标
(或使用快捷键 <shortcut>Cmd + Enter</shortcut>/<shortcut>Alt + Enter</shortcut>):

![警告 名称 intention](warning-name-intention.png){width=500}

新的编译器选项目前是 [实验性功能](components-stability.md#stability-levels-explained).
还要注意以下几点:

* 不允许压制错误.
* 如果你指定一个未知的警告名称, 编译会报告错误.
* 你可以一次性指定多个警告:

   <tabs>
   <tab title="命令行">

   ```bash
   kotlinc -Xsuppress-warning=NOTHING_TO_INLINE -Xsuppress-warning=NO_TAIL_CALLS_FOUND main.kt
   ```

   </tab>
   <tab title="构建文件">

   ```kotlin
   // build.gradle.kts
   kotlin {
       compilerOptions {
           freeCompilerArgs.addAll(
               listOf(
                   "-Xsuppress-warning=NOTHING_TO_INLINE",
                   "-Xsuppress-warning=NO_TAIL_CALLS_FOUND"
               )
           )
       }
   }
   ```

   </tab>
   </tabs>

### K2 kapt 实现的改善 {id="improved-k2-kapt-implementation"}

> 针对 K2 编译器的 kapt plugin (K2 kapt) 目前是 [Alpha 版](components-stability.md#stability-levels-explained).
> 它随时有可能变更.
>
> 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback) 提供你的反馈意见.
>
{style="warning"}

目前, 使用 [kapt](kapt.md) plugin 的项目默认使用 K1 编译器,
支持的 Kotlin 版本到 1.9.

在 Kotlin 1.9.20 中, 我们启动了 kapt plugin 的一个实验性实现, 使用 K2 编译器 (K2 kapt).
我们现在改进了 K2 kapt 的内部实现, 以缓解技术性问题和性能问题.

尽管新的 K2 kapt 实现没有引入新的功能特性, 但它的性能与以前的 K2 kapt 实现相比有了显著的改善.
此外, K2 kapt plugin 的行为更加接近于 K1 kapt.

要使用新的 K2 kapt plugin 实现, 启用它的方法与以前的 K2 kapt plugin 相同.
请向你的项目的 `gradle.properties` 文件添加以下选项:

```kotlin
kapt.use.k2=true
```

在后续的发布版中, 实现会默认启用 K2 kapt, 而不是 K1 kapt, 因此将来你不需要手动启用它.

在新的实现进入稳定版之前, 我们非常感谢你提供 [反馈意见](https://youtrack.jetbrains.com/issue/KT-71439/K2-kapt-feedback).

### 解析无符号类型与非基本类型之间的重载冲突 {id="resolution-for-overload-conflicts-between-unsigned-and-non-primitive-types"}

在之前版本中, 如果函数的重载使用了无符号类型与非基本类型, 可能发生的重载冲突解析问题,
这个发布版解决了这个问题, 如下面的示例所示:

#### 扩展函数的重载 {id="overloaded-extension-functions"}

```kotlin
fun Any.doStuff() = "Any"
fun UByte.doStuff() = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    uByte.doStuff() // 在 Kotlin 2.1.0 之前, 会发生重载解析歧义
}
```

在较早的版本中, 调用 `uByte.doStuff()` 会导致歧义, 因为 `Any` 和 `UByte` 的扩展都可以使用.

#### 顶级函数的重载 {id="overloaded-top-level-functions"}

```kotlin
fun doStuff(value: Any) = "Any"
fun doStuff(value: UByte) = "UByte"

fun main() {
    val uByte: UByte = UByte.MIN_VALUE
    doStuff(uByte) // 在 Kotlin 2.1.0 之前, 会发生重载解析歧义
}
```

类似的, 调用 `doStuff(uByte)` 也会发生歧义, 因为编译器无法决定应该使用 `Any` 还是 `UByte` 的版本.
在 2.1.0 中, 编译器现在能够正确处理这种情况, 通过优先使用更加具体的类型来解决歧义,
在这个例子中会使用 `UByte`.

## Kotlin/JVM {id="kotlin-jvm"}

从版本 2.1.0 开始, 编译器可以生成包含 Java 23 字节码的类.

### JSpecify 可否为 null(Nullability) 不匹配诊断的严重性变更为 strict {id="change-of-jspecify-nullability-mismatch-diagnostics-severity-to-strict"}

对于 `org.jspecify.annotations` 中的可否为 null(Nullability) 注解,
Kotlin 2.1.0 强制要求 strict 处理, 以改善与 Java 交互时的类型安全性.

受到影响的可否为 null 注解如下:

* `org.jspecify.annotations.Nullable`
* `org.jspecify.annotations.NonNull`
* `org.jspecify.annotations.NullMarked`
* `org.jspecify.nullness` 中的旧注解 (JSpecify 0.2 及之前版本)

从 Kotlin 2.1.0 开始, 默认将可否为 null 的不匹配问题从警告提升为错误.
这样可以确保在类型检查中强制使用 `@NonNull` 和 `@Nullable` 之类的注解,
预防运行期发生意外的 可否为 null 问题.

`@NullMarked` 注解也会影响它的范围内的所有成员可否为 null,
使得你在使用被注解的 Java 代码时行为更加可预测.

下面的示例演示新的默认行为:

```java
// Java
import org.jspecify.annotations.*;
public class SomeJavaClass {
    @NonNull
    public String foo() { //...
    }

    @Nullable
    public String bar() { //...
    }
}
```

```kotlin
// Kotlin
fun test(sjc: SomeJavaClass) {
    // 访问一个非 null 的结果, 这样是允许的
    sjc.foo().length

    // 在默认的 strict 模式中会发生错误, 因为结果可能为 nullable
    // 要避免这个错误, 要改为使用 ?.length
    sjc.bar().length
}
```

你可以对这些注解手动控制诊断的严重性.
方法是使用 `-Xnullability-annotations` 编译器选项来选择一个模式:

* `ignore`: 忽略可否为 null 不匹配问题.
* `warning`: 对可否为 null 不匹配问题报告警告.
* `strict`: 对可否为 null 不匹配问题报告错误 (这是默认模式).

详情请参见 [可否为 null 注解](java-interop.md#nullability-annotations).

## Kotlin Multiplatform {id="kotlin-multiplatform"}

Kotlin 2.1.0 引入了 [对 Swift 导出的基本支持](#basic-support-for-swift-export),
并使得
[发布 Kotlin Multiplatform 库](#ability-to-publish-kotlin-libraries-from-any-host) 更加容易.
它还致力于与 Gradle 相关的改善, 稳定了 [配置编译器选项的新 DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable),
并带来了 [隔离项目(Isolated Project)功能的预览版](#preview-gradle-s-isolated-projects-in-kotlin-multiplatform).

### 跨平台项目中用于编译器选项的新 Gradle DSL 进入稳定版 {id="new-gradle-dsl-for-compiler-options-in-multiplatform-projects-promoted-to-stable"}

在 Kotlin 2.0.0 中, [我们引入了一个新的实验性的 Gradle DSL](whatsnew20.md#new-gradle-dsl-for-compiler-options-in-multiplatform-projects),
来简化你的跨平台项目的编译器选项配置.
在 Kotlin 2.1.0 中, 这个 DSL 提升到了稳定版.

整体的项目配置现在包含 3 个层.
最高层是扩展层, 之后是编译目标层, 最低的是编译单元 (通常是一个编译 task):

![Kotlin 编译器选项的层](compiler-options-levels.svg){width=700}

关于不同的层, 以及在各层之间如何配置编译器选项,
详情请参见 [编译器选项](multiplatform-dsl-reference.md#compiler-options).

### Kotlin Multiplatform 中的 Gradle 隔离项目(Isolated Project) (预览版) {id="preview-gradle-s-isolated-projects-in-kotlin-multiplatform"}

> 这个功能是 [实验性功能](components-stability.md#stability-levels-explained), 目前在 Gradle 中处于 Alpha 版之前的状态.
> 只能在 Gradle 版本 8.10 使用这个功能, 而且完全只能用于评估目的.
> 它随时有可能变更或被删除.
>
> 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 提供你的反馈意见.
> 需要使用者同意(Opt-in) (详情见下文).
>
{style="warning"}

在 Kotlin 2.1.0 中,
你可以在你的跨平台项目中预览 Gradle 的 [隔离项目(Isolated Project)](https://docs.gradle.org/current/userguide/isolated_projects.html) 功能.

Gradle 中的隔离项目(Isolated Project) 功能, 通过"隔离" 各个 Gradle 项目的配置, 改善构建性能.
每个项目的构建逻辑不允许直接访问其它项目的可变状态, 因此它们可以安全的并行运行.
为了支持这个功能, 我们对 Kotlin Gradle plugin 的模型进行了一些变更,
我们很有兴趣了解你在预览阶段的体验状况.

有 2 种方法启用 Kotlin Gradle plugin 的新模型:

* 选项 1: **不启用 隔离项目, 检查兼容性** –
  要在不启用隔离项目功能的情况下, 检查 Kotlin Gradle plugin 的新模型的兼容性,
  请在你的项目的 `gradle.properties` 文件中, 添加以下 Gradle 属性:

  ```none
  # gradle.properties
  kotlin.kmp.isolated-projects.support=enable
  ```

* 选项 2: **启用隔离项目, 检查兼容性** –
  在 Gradle 中启用隔离项目功能, 会自动配置 Kotlin Gradle plugin, 让它使用新的模型.
  要启用隔离项目功能, 请 [设置系统属性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it).
  这种情况下, 你不需要对你的项目添加 Kotlin Gradle plugin 的 Gradle 属性.

### 对 Swift 导出的基本支持 {id="basic-support-for-swift-export"}

> 这个功能目前处于开发的早期阶段.
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文).
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过 [YouTrack](https://kotl.in/issue) 提供你的反馈意见.
>
{style="warning"}

版本 2.1.0 向在 Kotlin 中支持 Swift 导出迈出了第一步,
这个功能允许你将 Kotlin 源代码直接导出到 Swift 接口, 不使用 Objective-C 头文件.
这样可以让针对 Apple 平台的跨平台开发更加容易.

目前的基本支持包括以下能力:

* 从 Kotlin 直接导出多个 Gradle 模块到 Swift.
* 通过 `moduleName` 属性, 定义自定义的 Swift 模块名称.
* 通过 `flattenPackage` 属性, 设置包结构的折叠规则(Collapse Rule).

你可以在你的项目中使用以下构建文件, 作为设置 Swift 导出的起始配置:

```kotlin
// build.gradle.kts
kotlin {
    iosX64()
    iosArm64()
    iosSimulatorArm64()

    @OptIn(ExperimentalSwiftExportDsl::class)
    swiftExport {
        // 根模块名称
        moduleName = "Shared"

        // 折叠规则(Collapse Rule)
        // 在生成的 Swift 代码中, 删除包前缀
        flattenPackage = "com.example.sandbox"

        // 导出外部模块
        export(project(":subproject")) {
            // 导出的模块的名称
            moduleName = "Subproject"
            // 导出的依赖项的折叠规则
            flattenPackage = "com.subproject.library"
        }
    }
}
```

你也可以 clone 我们的 [公开示例](https://github.com/Kotlin/swift-export-sample),
其中已经设置好了 Swift 导出.

编译器会自动生成所有需要的文件 (包括 `swiftmodule` 文件, 静态的 `a` 库, 以及头文件和 `modulemap` 文件),
并将这些文件复制到 App 的构建目录, 你可以在 Xcode 中访问这个目录.

#### 如何启用 Swift 导出 {id="how-to-enable-swift-export"}

要注意, 这个功能目前还处于开发的早期阶段.

如果跨平台项目使用 [直接集成](multiplatform-direct-integration.md) 来将 iOS Framework 连接到 Xcode 项目,
Swift 导出目前可以适用于这样的项目.
在 Android Studio 中创建, 或使用 [Web 向导](https://kmp.jetbrains.com/) 创建的 Kotlin Multiplatform 项目, 这是标准配置.

要在你的项目中试用 Swift 导出, 请执行以下步骤:

1. 向你的 `gradle.properties` 文件添加以下 Gradle 选项:

   ```none
   # gradle.properties
   kotlin.experimental.swift-export.enabled=true
   ```

2. 在 Xcode 中, 打开项目设置.
3. 在 **Build Phases** 页面, 找到包含 `embedAndSignAppleFrameworkForXcode` task 的 **Run Script** 阶段.
4. 调整脚本, 在运行脚本阶段使用 `embedSwiftExportForXcode` task:

   ```bash
   ./gradlew :<共用的模块名称>:embedSwiftExportForXcode
   ```

   ![Add the Swift 导出 脚本](xcode-swift-export-run-script-phase.png){width=700}

#### 留下对 Swift 导出功能的反馈意见 {id="leave-feedback-on-swift-export"}

在将来的 Kotlin 发布版中, 我们计划扩展并稳定 Swift 导出功能.
请在 [这个 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-64572) 中留下你的反馈意见.

### 能够从任何主机发布 Kotlin 库 {id="ability-to-publish-kotlin-libraries-from-any-host"}

> 这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
> 需要使用者同意(Opt-in) (详情见下文).
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290) 提供你的反馈意见.
>
{style="warning"}

Kotlin 编译器会为发布 Kotlin 库生成 `.klib` artifact.
以前, 你可以从任何主机得到需要的 artifact, Apple 平台的编译目标除外, 它需要 Mac 机器.
这对针对 iOS, macOS, tvOS, 以及 watchOS 目标平台的 Kotlin Multiplatform 项目造成了特殊的限制.

Kotlin 2.1.0 消除了这个限制, 增加了对交叉编译的支持.
现在你可以使用任何主机来生成 `.klib` artifact,
这样能够大大简化 Kotlin 和 Kotlin Multiplatform 库的发布过程.

#### 如何启用从任何主机发布库的功能 {id="how-to-enable-publishing-libraries-from-any-host"}

要在你的项目中试用交叉编译, 请向你的 `gradle.properties` 文件添加以下选项:

```none
# gradle.properties
kotlin.native.enableKlibsCrossCompilation=true
```

这个功能目前是实验性功能, 并且存在一些限制.
对于以下情况, 你仍然需要使用 Mac 机器:

* 你的库存在 [cinterop 依赖项](native-c-interop.md).
* 你的项目中设置了 [CocoaPods 集成](native-cocoapods.md).
* 你需要对 Apple 平台构建或测试 [最终二进制文件](multiplatform-build-native-binaries.md).

#### 对从任何主机发布库的功能留下反馈意见 {id="leave-feedback-on-publishing-libraries-from-any-host"}

在将来的 Kotlin 发布版中, 我们计划稳定这个功能, 并进一步改进库的发布功能.
请在我们的问题追踪系统 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71290) 中留下你的反馈意见.

详情请参见 [发布跨平台的库](multiplatform-publish-lib.md).

### 支持不打包的(non-packed) klib {id="support-for-non-packed-klibs"}

Kotlin 2.1.0 允许生成不打包的(non-packed) `.klib` 文件 artifact.
通过这个功能, 你可以直接配置对 klib 的依赖项, 而不必先解包它们.

这个变更也可以改善性能, 减少你的 Kotlin/Wasm, Kotlin/JS, 和 Kotlin/Native 项目的编译和链接时间.

例如, 我们的基准测试显示, 在包含 1 个链接 task 和 10 个编译 task 的项目中, 总构建时间的性能提升了大约 3%
(这个项目构建一个单独的原生可执行二进制文件, 依赖于 9 个简化的项目).
但是, 对构建时间的实际影响取决于子项目的数量, 以及它们各自的大小.

#### 如何设置你的项目 {id="how-to-set-up-your-project"}

默认情况下, Kotlin 编译和链接 task 现在配置为使用新的不打包的 artifact.

如果你设置了自定义的构建逻辑, 用于解析 klib, 并且希望使用新的不打包 artifact,
那么你需要在你的 Gradle 构建文件中, 明确的指定希望使用的 klib 包解析的变体:

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.plugin.attributes.KlibPackaging
// ...
val resolvableConfiguration = configurations.resolvable("resolvable") {
    // 用于新的不打包配置:
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.NON_PACKED))

    // 用于之前的打包配置:
    attributes.attribute(KlibPackaging.ATTRIBUTE, project.objects.named(KlibPackaging.PACKED))
}
```

在你的项目构建目录中, 不打包的 `.klib` 文件, 使用之前的打包文件的生成路径.
而打包的 klib 现在生成到 `build/libs` 目录中.

如果没有指定属性, 会使用打包的变体.
你可以通过以下控制台命令, 查看可用的属性和变体列表:

```shell
./gradlew outgoingVariants
```

希望你能通过 [YouTrack](https://kotl.in/issue) 提供你对这个功能的反馈意见.

### 进一步废弃旧的 `android` 编译目标 {id="further-deprecation-of-old-android-target"}

In Kotlin 2.1.0, 对旧的 `android` 编译目标名称的废弃警告提升为错误.

目前, 我们推荐在你的针对 Android 的 Kotlin Multiplatform 项目中使用 `androidTarget` 选项.
这是一个必要的临时变更, 目的是将 `android` 的名称留给未来由 Google 提供的 Android/KMP plugin 使用.

新的 plugin 发布后, 我们会提供更多迁移说明.
Google 的新 DSL 将成为在 Kotlin Multiplatform 中使用 Android 编译目标的首选方式.

详情请参见 [Kotlin Multiplatform 兼容性指南](multiplatform-compatibility-guide.md#rename-of-android-target-to-androidtarget).

### 不再支持声明相同类型的多个编译目标 {id="dropped-support-for-declaring-multiple-targets-of-the-same-type"}

在 Kotlin 2.1.0 之前, 在你的跨平台项目中, 你可以声明相同类型的多个编译目标.
但是, 这回导致各个编译目标难以区分, 有效的支持共用源代码集也变得困难.
大多数情况下, 更加简单的设置, 例如使用分离的 Gradle 项目, 效果会更好.
关于如何迁移的详细指南和示例,
请参见 Kotlin Multiplatform 兼容性指南中的 [声明多个类似的编译目标](multiplatform-compatibility-guide.md#declaring-several-similar-targets).

如果你的跨平台项目中声明了相同类型的多个编译目标, Kotlin 1.9.20 会触发废弃警告.
在 Kotlin 2.1.0 中, 对所有的编译目标, 这个废弃警告现在升级为错误, 只有 Kotlin/JS 例外.
关于 Kotlin/JS 编译目标为什么会例外, 请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode) 中的这个 issue.

## Kotlin/Native {id="kotlin-native"}

Kotlin 2.1.0 包含一个 [对 `iosArm64` 编译目标的支持的更新](#iosarm64-promoted-to-tier-1),
[改进了 cinterop 缓存处理](#changes-to-caching-in-cinterop), 以及其它更新.

### iosArm64 提升为第 1 层 {id="iosarm64-promoted-to-tier-1"}

对 [Kotlin Multiplatform](multiplatform-intro.md) 开发至关重要的 `iosArm64` 编译目标, 已经提升到了第 1 层. 这是 Kotlin/Native 编译器中最高的支持层级.

这意味着这个编译目标在 CI 环境进行过常规测试, 保证能够编译和运行.
我们还对这个编译目标提供编译器发布版之间的源代码和二进制兼容性.

关于对编译目标的支持层级, 详情请参见 [Kotlin/Native 支持的目标平台](native-target-support.md).

### LLVM 从 11.1.0 更新到 16.0.0 {id="llvm-update-from-11-1-0-to-16-0-0"}

在 Kotlin 2.1.0 中, 我们将 LLVM 版本从 11.1.0 更新到 16.0.0.
新的版本包括 bug 修正和安全更新.
对于某些情况, 它还提供了编译器优化, 以及更快的编译速度.

如果在你的项目中存在 Linux 编译目标,
请注意, Kotlin/Native 编译器现在对所有的 Linux 编译目标默认使用 `lld` 连接器.

这个更新不会影响你的代码, 但如果你遇到任何问题, 请报告到我们的 [问题追踪系统](http://kotl.in/issue).

### 对在 cinterop 中缓存的变更 {id="changes-to-caching-in-cinterop"}

在 Kotlin 2.1.0 中, 我们对 cinterop 的缓存处理进行了一些变更.
[`CacheableTask`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/CacheableTask.html) 注解类型不再存在.
推荐的新方法是使用 [`cacheIf`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.tasks/-task-outputs/cache-if.html) 输出类型, 来缓存任务的结果.

这个变更会解决 `UP-TO-DATE`检查无法检测到 [定义文件](native-definition-file.md) 中指定的头文件的变更的问题,
这个问题会导致构建系统不会重编译代码.

### 废弃 mimalloc 内存分配器 {id="deprecation-of-the-mimalloc-memory-allocator"}

在 Kotlin 1.9.0 中, 我们引入了新的内存分配器, 之后, 在 Kotlin 1.9.20 中我们默认启用了它.
新的分配器能够让垃圾收集更加高效, 并改善 Kotlin/Native 内存管理器的运行期性能.

新的内存分配器替代了以前的默认分配器, [mimalloc](https://github.com/microsoft/mimalloc).
现在, 是时候在 Kotlin/Native 编译器中废弃 mimalloc 了.

你现在可以从你的构建脚本中删除 `-Xallocator=mimalloc` 编译器选项.
如果你遇到任何问题, 请报告到我们的 [问题追踪系统](http://kotl.in/issue).

关于 Kotlin 中的内存分配器和垃圾收集, 详情请参见 [Kotlin/Native 内存管理](native-memory-manager.md).

## Kotlin/Wasm {id="kotlin-wasm"}

Kotlin/Wasm 有了多个更新, 并 [支持增量编译](#support-for-incremental-compilation).

### 对增量编译的支持 {id="support-for-incremental-compilation"}

以前, 当你在 Kotlin 代码中修改一些内容时, Kotlin/Wasm 工具链必须重编译整个代码库.

从 2.1.0 开始, 对 Wasm 编译目标支持增量编译.
在开发任务中, 编译器现在只会重编译最后一次编译之后发生变化的相关文件, 显著的减少了编译时间.

这个变更目前将编译速度提升了一倍, 我们还计划在将来的发布版中继续改进它.

在目前的设置中, 增量编译对 Wasm 编译目标默认禁用.
要启用增量编译, 请向你的项目的 `local.properties` 或 `gradle.properties` 文件添加以下内容:

```none
# gradle.properties
kotlin.incremental.wasm=true
```

请试用 Kotlin/Wasm 增量编译, 并 [分享你的反馈意见](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback).
你的见解将会帮助这个功能尽快进入稳定版, 并默认启用.

### 浏览器 APIs 移动到了独立的 kotlinx-browser 库 {id="browser-apis-moved-to-the-kotlinx-browser-stand-alone-library"}

以前, Web API 和相关目标的实用程序的声明 是 Kotlin/Wasm 标准库的一部分.

在这个发布版中, `org.w3c.*` 声明从 Kotlin/Wasm 标准库移动到了新的 [kotlinx-browser 库](https://github.com/kotlin/kotlinx-browser).
这个库还包含其它 Web 相关的包, 例如 `org.khronos.webgl`, `kotlin.dom`, 和 `kotlinx.browser`.

库的这个分离提供了模块化, 使得 Web 相关的 API 能够在 Kotlin 的发布周期之外独立的进行更新.
此外, Kotlin/Wasm 标准库现在只包含所有 JavaScript 环境中都能使用的声明.

要使用移动后的包中的声明, 你需要向你的项目的构建配置文件添加 `kotlinx-browser` 依赖项:

```kotlin
// build.gradle.kts
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```

### 改善了 Kotlin/Wasm 的调试体验 {id="improved-debugging-experience-for-kotlin-wasm"}

以前, 在 Web 浏览器中调试 Kotlin/Wasm 代码时, 你可能会在调试界面中遇到变量值的低层表达形式.
这个通常会让追踪应用程序的目前状态变得困难.

![Kotlin/Wasm 的旧调试器](wasm-old-debugger.png){width=700}

为了改善这个体验, 在变量视图中添加了自定义格式化器.
这个实现使用了 [自定义格式化器 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html),
大多数主流浏览器都支持这个 API, 例如 Firefox 和基于 Chromium 的浏览器.

通过这个变更, 你现在可以通过更加用户友好, 更加易于理解的方式, 来显示并定位变量值.

![Kotlin/Wasm 改善后的调试器](wasm-debugger-improved.png){width=700}

要试用新的调试体验, 请执行以下步骤:

1. 向 `wasmJs {}` 编译器选项添加以下编译器选项:

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

2. 在你的浏览器中启用自定义格式化器:

    * 在 Chrome DevTools 中, 通过 **Settings | Preferences | Console** 设置:

      ![在 Chrome 中启用自定义格式化器](wasm-custom-formatters-chrome.png){width=700}

    * 在 Firefox DevTools 中, 通过 **Settings | Advanced settings** 设置:

      ![在 Firefox 中启用自定义格式化器](wasm-custom-formatters-firefox.png){width=700}

### 减少了 Kotlin/Wasm 二进制文件的大小 {id="reduced-size-of-kotlin-wasm-binaries"}

由生产构建产生的 Wasm 二进制文件大小, 会减少高达 30%, 而且你会看到一些性能改善.
这是因为 `--closed-world`, `--type-ssa`, 和 `--type-merging` Binaryen 选项,
现在被认为能够安全的使用于所有的 Kotlin/Wasm 项目, 并且默认启用了.

### 改善了 Kotlin/Wasm 中的 JavaScript 数组互操作性 {id="improved-javascript-array-interoperability-in-kotlin-wasm"}

尽管 Kotlin/Wasm 的标准库为 JavaScript 数组提供了 `JsArray<T>` 类型,
但没有直接的方法将 `JsArray<T>` 转换为 Kotlin 的原生 `Array` 或 `List` 类型.

这个缺陷导致需要创建自定义函数进行数组变换, 使得 Kotlin 与 JavaScript 代码之间的互操作性变得复杂.

这个发布版引入了一个适配器函数, 能够自动将 `JsArray<T>` 转换到 `Array<T>`, 以及反向转换, 简化了数组操作.

下面是泛型类型之间转换的一个示例: Kotlin `List<T>` 和 `Array<T>` 与 JavaScript `JsArray<T>` 之间转换.

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// 使用 .toJsArray(), 将 List 或 Array 转换为 JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// 使用 .toArray() 和 .toList(), 转换回 Kotlin 类型
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

还有类似的方法, 可以将类型数组转换为 Kotlin 中对应的类型(例如, `IntArray` 和 `Int32Array`).
更多详细信息和具体实现, 请参见 [`kotlinx-browser` 代码仓库]( https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt).

下面是类型数组之间转换的一个示例: Kotlin `IntArray` 与 JavaScript `Int32Array` 之间转换.

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)
    
    // 使用 .toInt32Array(), 将 Kotlin IntArray 转换为 JavaScript Int32Array
    val jsInt32Array: Int32Array = intArray.toInt32Array()
    
    // 使用 toIntArray(), 将 JavaScript Int32Array 转换回 Kotlin IntArray
    val kotlinIntArray: IntArray = jsInt32Array.toIntArray()
```

### 在 Kotlin/Wasm 中支持访问 JavaScript 异常的详细信息 {id="support-for-accessing-javascript-exception-details-in-kotlin-wasm"}

以前, 在 Kotlin/Wasm 中发生 JavaScript 异常时,
`JsException` 类型只提供一个粗略的消息, 不包含原始的 JavaScript 错误的详细信息.

从 Kotlin 2.1.0 开始, 你可以启用一个特定的编译器选项来配置 `JsException`,
使它包含原始的错误消息, 和栈追踪(Stack Trace)信息.
这样可以提供更多上下文信息, 帮助诊断源自 JavaScript 的问题.

这个行为依赖于 `WebAssembly.JSTag` API, 这个 API 只能在特定的浏览器中使用:

* **Chrome**: 从版本 115 开始支持
* **Firefox**: 从版本 129 开始支持
* **Safari**: 目前还不支持

这个功能默认禁用, 要启用这个功能, 请向你的 `build.gradle.kts` 文件添加以下编译器选项:

```kotlin
// build.gradle.kts
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-attach-js-exception")
        }
    }
}
```

下面的示例演示这个新的行为:

```kotlin
external object JSON {
    fun <T: JsAny> parse(json: String): T
}

fun main() {
    try {
        JSON.parse("an invalid JSON")
    } catch (e: JsException) {
        println("Thrown value is: ${e.thrownValue}")
        // 输出结果为: SyntaxError: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Message: ${e.message}")
        // 输出结果为: Message: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Stacktrace:")
        // 输出结果为: Stacktrace:

        // 打印输出完整的 JavaScript 栈追踪
        e.printStackTrace()
    }
}
```

启用 `-Xwasm-attach-js-exception` 选项后, `JsException` 类型会提供来自 JavaScript 错误的详细信息.
如果不启用这个选项, `JsException` 只包含粗略的信息, 表示在运行 JavaScript 代码时抛出了异常.

### 废弃默认导出 {id="deprecation-of-default-exports"}

作为向命名导出(named export)迁移的一部分,
当在 JavaScript 中对 Kotlin/Wasm 导出使用默认导入(default import)时, 以前会在控制台打印一个错误.

在 2.1.0 中, 为了完全支持命名导出, 默认导入已被完全删除.

在针对 Kotlin/Wasm 编译目标使用 JavaScript 编程时,
你现在需要使用相应的命名导入(named import), 而不能使用默认导入.

这个变更标志着迁移到命名导出的废弃周期的最后阶段:

**在 2.0.0 版中:** 会打印输出一个警告消息到控制台, 解释说通过默认导出方式导出实体已被废弃.

**在 2.0.20 版中:** 会发生一个错误, 要求使用相应的命名导入.

**在 2.1.0 版中:** 默认导入的使用已被完全删除.

### 子项目特定的 Node.js 设置 {id="subproject-specific-node-js-settings"}

你可以对 `rootProject` 定义 `NodeJsRootPlugin` 类的属性, 来为你的项目配置 Node.js 设置.
在 2.1.0 中, 你可以使用一个新的类 `NodeJsPlugin`, 对每个子项目配置这些设置.
下面是一个示例, 演示如何对一个子项目设置一个特定的 Node.js 版本:

```kotlin
// build.gradle.kts
project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
    project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "22.0.0"
}
```

要对整个项目使用新的类, 请在 `allprojects {}` 代码块中添加同样的代码:

```kotlin
// build.gradle.kts
allprojects {
    project.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsPlugin> {
        project.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsEnvSpec>().version = "你的 Node.js version"
    }
}
```

你也可以使用 Gradle convention plugin, 将这些设置适用于一组特定的子项目.

## Kotlin/JS {id="kotlin-js"}

### 在属性中支持非标识符字符 {id="support-for-non-identifier-characters-in-properties"}

Kotlin/JS 以前不允许在 [测试方法名称](coding-conventions.md#names-for-test-methods) 中使用带反引号的空格.

类似的, 也不能访问名称中包含 Kotlin 标识符中不允许的字符的 JavaScript 对象属性,
例如连字符或空格:

```kotlin
external interface Headers {
    var accept: String?

    // 无效的 Kotlin 标识符, 因为包含连字符
    var `content-length`: String?
}

val headers: Headers = TODO("value provided by a JS library")
val accept = headers.accept
// 发生错误, 因为属性名称中存在连字符
val length = headers.`content-length`
```

这个行为与 JavaScript 和 TypeScript 存在差异, 它们允许使用非标识符字符访问这样的属性.

从 Kotlin 2.1.0 开始, 这个功能默认启用.
Kotlin/JS 现在允许你使用反引号 (``) 和 `@JsName` 注解,
与包含非标识符字符的 JavaScript 属性交互, 并在测试方法名称中使用.

此外, 你可以使用 `@JsName` 和 ` @JsQualifier` 注解,
将 Kotlin 属性名称映射到 JavaScript 中对应的部分:

```kotlin
object Bar {
    val `property example`: String = "bar"
}

@JsQualifier("fooNamespace")
external object Foo {
    val `property example`: String
}

@JsExport
object Baz {
    val `property example`: String = "bar"
}

fun main() {
    // 在 JavaScript 中, 被编译为 Bar.property_example_HASH
    println(Bar.`property example`)
    // 在 JavaScript 中, 被编译为 fooNamespace["property example"]
    println(Foo.`property example`)
    // 在 JavaScript 中, 被编译为 Baz["property example"]
    println(Baz.`property example`)
}
```

### 支持生成 ES2015 箭头函数(Arrow Function) {id="support-for-generating-es2015-arrow-functions"}

在 Kotlin 2.1.0 中, Kotlin/JS 引入了对生成 ES2015 箭头函数(Arrow Function)的支持,
例如 `(a, b) => expression`, 而不是生成匿名函数.

使用箭头函数可以减少你的项目的捆包大小,
尤其是在使用实验性的 `-Xir-generate-inline-anonymous-functions` 模式时.
这也使得生成的代码与现代的 JS 更加一致.

当目标平台为 ES2015 时, 这个功能默认启用.
或者, 你可以使用 `-Xes-arrow-functions` 命令行参数启用它.

详情请参见 [ES2015 (ECMAScript 2015, ES6) 官方文档](https://262.ecma-international.org/6.0/).

## Gradle 改善 {id="gradle-improvements"}

Kotlin 2.1.0 完全兼容于 Gradle 版本 7.6.3 到 8.6.
Gradle 版本 8.7 到 8.10 也支持, 只有一个例外.
如果你使用 Kotlin Multiplatform Gradle plugin,
在跨平台项目中调用 JVM 编译目标中的 `withJava()` 函数时, 可能会看到废弃警告.
我们计划尽快解决这个问题.

详情请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66542) 中的相关问题.

你也可以使用 Gradle 的最新发布版,
但如果这样做, 请记住, 你可能遇到废弃警告, 或者某些新的 Gradle 功能特性可能无法工作.

### 支持的 AGP 最低版本提升到 7.3.1 {id="minimum-supported-agp-version-bumped-to-7-3-1"}

从 Kotlin 2.1.0 开始, 支持的 Android Gradle plugin 最低版本是 7.3.1.

### 支持的 Gradle 最低版本提升到 7.6.3 {id="minimum-supported-gradle-version-bumped-to-7-6-3"}

从 Kotlin 2.1.0 开始, 支持的 Gradle 最低版本是 7.6.3.

### 针对 Kotlin Gradle plugin 扩展的新 API {id="new-api-for-kotlin-gradle-plugin-extensions"}

Kotlin 2.1.0 引入了一个新的 API, 可以更容易的创建你自己的 plugin, 来配置 Kotlin Gradle plugin.
这个变更废弃了 `KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig`
接口, 并为 plugin 开发者引入了以下接口:

| 名称                       | 描述                                                                                                                                                                                                                   |
|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `KotlinBaseExtension`    | 一个 plugin DSL 扩展类型, 用于对整个项目配置共通的 Kotlin JVM, Android, 和 Multiplatform plugin 选项:<list><li>`org.jetbrains.kotlin.jvm`</li><li>`org.jetbrains.kotlin.android`</li><li>`org.jetbrains.kotlin.multiplatform`</li></list> |
| `KotlinJvmExtension`     | 一个 plugin DSL 扩展类型, 用于对整个项目配置 Kotlin **JVM** plugin 选项.                                                                                                                                                              |
| `KotlinAndroidExtension` | 一个 plugin DSL 扩展类型, 用于对整个项目配置 Kotlin **Android** plugin 选项.                                                                                                                                                          |

例如, 如果你想要对 JVM 和 Android 项目都配置编译器选项, 请使用 `KotlinBaseExtension`:

```kotlin
configure<KotlinBaseExtension> {
    if (this is HasConfigurableKotlinCompilerOptions<*>) {
        with(compilerOptions) {
            if (this is KotlinJvmCompilerOptions) {
                jvmTarget.set(JvmTarget.JVM_17)
            }
        }
    }
}
```

这段代码会对 JVM 和 Android 项目都将 JVM 编译目标配置为 17.

要只对 JVM 项目配置编译器选项, 请使用 `KotlinJvmExtension`:

```kotlin
configure<KotlinJvmExtension> {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }

    target.mavenPublication {
        groupId = "com.example"
        artifactId = "example-project"
        version = "1.0-SNAPSHOT"
    }
}
```

这个示例与前面类似, 它对 JVM 项目将 JVM 编译目标配置为 17.
它还对项目配置 Maven 发布, 让它的输出发布到一个 Maven 仓库.

你可以通过完全相同的方式来使用 `KotlinAndroidExtension`.

### 编译器 符号 hidden from the Kotlin Gradle plugin API {id="compiler-symbols-hidden-from-the-kotlin-gradle-plugin-api"}

以前, KGP 在它的运行期依赖项中包含了 `org.jetbrains.kotlin:kotlin-compiler-embeddable`,
导致内部的编译器符号在构建脚本类路径中可以访问.
这些符号本来的意图是只供内部使用.

从 Kotlin 2.1.0 开始, KGP 在它的 JAR 文件中捆绑了 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 的一部分类文件,
并会逐渐删除它们.
这个变更是为了防止出现兼容性问题, 并简化 KGP 的维护.

如果你的构建逻辑的其它部分, 例如 `kotlinter` 之类的 plugin,
依赖的 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 版本与 KGP 捆绑的版本不同, 可能会导致冲突, 并发生运行时异常.

为了防止这样的问题, 如果 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 与 KGP 一起出现在构建的类路径中, KGP 现在会显示警告.

作为一种长期的解决方案, 如果你是 plugin 作者, 使用了 `org.jetbrains.kotlin:kotlin-compiler-embeddable` 类,
我们推荐您在一个隔离的类装载器中运行它们.
例如, 你可以使用带类装载器隔离(classloader isolation)或进程隔离(process isolation)的
[Gradle Workers API](https://docs.gradle.org/current/userguide/worker_api.html).

#### 使用 Gradle Workers API {id="using-the-gradle-workers-api"}

这个示例演示如何在生成 Gradle plugin 的项目中安全的使用 Kotlin 编译器.
首先, 在你的构建脚本中添加一个 compile-only 依赖项.
这个会让符号只在编译期可用:

```kotlin
// build.gradle.kts
dependencies {
    compileOnly("org.jetbrains.kotlin:kotlin-compiler-embeddable:%kotlinVersion%")
}
```

然后, 定义一个 Gradle work action, 打印输出 Kotlin 编译器版本:

```kotlin
import org.gradle.workers.WorkAction
import org.gradle.workers.WorkParameters
import org.jetbrains.kotlin.config.KotlinCompilerVersion
abstract class ActionUsingKotlinCompiler : WorkAction<WorkParameters.None> {
    override fun execute() {
        println("Kotlin compiler version: ${KotlinCompilerVersion.getVersion()}")
    }
}
```

现在, 创建一个 task, 将这个 action 提交给使用类装载器隔离(classloader isolation)的 worker 执行器:

```kotlin
import org.gradle.api.DefaultTask
import org.gradle.api.file.ConfigurableFileCollection
import org.gradle.api.tasks.Classpath
import org.gradle.api.tasks.TaskAction
import org.gradle.workers.WorkerExecutor
import javax.inject.Inject
abstract class TaskUsingKotlinCompiler: DefaultTask() {
    @get:Inject
    abstract val executor: WorkerExecutor

    @get:Classpath
    abstract val kotlinCompiler: ConfigurableFileCollection

    @TaskAction
    fun compile() {
        val workQueue = executor.classLoaderIsolation {
            classpath.from(kotlinCompiler)
        }
        workQueue.submit(ActionUsingKotlinCompiler::class.java) {}
    }
}
```

最后, 在你的 Gradle plugin 中配置 Kotlin 编译器类路径:

```kotlin
import org.gradle.api.Plugin
import org.gradle.api.Project
abstract class MyPlugin: Plugin<Project> {
    override fun apply(target: Project) {
        val myDependencyScope = target.configurations.create("myDependencyScope")
        target.dependencies.add(myDependencyScope.name, "$KOTLIN_COMPILER_EMBEDDABLE:$KOTLIN_COMPILER_VERSION")
        val myResolvableConfiguration = target.configurations.create("myResolvable") {
            extendsFrom(myDependencyScope)
        }
        target.tasks.register("myTask", TaskUsingKotlinCompiler::class.java) {
            kotlinCompiler.from(myResolvableConfiguration)
        }
    }

    companion object {
        const val KOTLIN_COMPILER_EMBEDDABLE = "org.jetbrains.kotlin:kotlin-compiler-embeddable"
        const val KOTLIN_COMPILER_VERSION = "%kotlinVersion%"
    }
}
```

## Compose 编译器的更新 {id="compose-compiler-updates"}

### 支持多个稳定性配置文件 {id="support-for-multiple-stability-configuration-files"}

Compose 编译器能够理解多个稳定性配置文件,
但 Compose 编译器 Gradle plugin 的 `stabilityConfigurationFile` 选项以前只允许指定单个文件.
在 Kotlin 2.1.0 中, 修改了这个功能, 允许对单个模块使用多个稳定性配置文件:

* `stabilityConfigurationFile` 选项已废弃.
* 有了一个新的选项, `stabilityConfigurationFiles`, 类型为 `ListProperty<RegularFile>`.

下面是使用新的选项向 Compose 编译器传递多个文件的方法:

```kotlin
// build.gradle.kt
composeCompiler {
    stabilityConfigurationFiles.addAll(
        project.layout.projectDirectory.file("configuration-file1.conf"),
        project.layout.projectDirectory.file("configuration-file2.conf"),
    )
}
```

### 可暂停的组合(Pausable composition) {id="pausable-composition"}

可暂停的组合(Pausable composition)是一个新的实验性功能, 它会改变编译器生成可跳过函数(skippable function)的方式.
启用这个功能后, 组合在运行期可以在跳过点(skipping point)上挂起, 因此能够将长时间运行的组合拆分到多个帧(frame)中.
Lazy List 和其它性能密集的组件使用可暂停的组合预获取内容,
如果以阻塞的方式执行, 可能导致视觉卡顿.

要试用可暂停的组合, 请在对 Compose 编译器的 Gradle 配置中添加以下功能特性 flag:

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.PausableComposition
    )
}
```

> 在 `androidx.compose.runtime` 的 1.8.0-alpha02 版本中添加了对这个功能的运行期支持.
> 如果使用旧的运行期版本, 这个功能特性 flag 不会发生效果.
>
{style="note"}

### 对 open 和可覆盖的(overridden) @Composable 函数的变更 {id="changes-to-open-and-overridden-composable-functions"}

虚拟的 (open, abstract, 以及可覆盖的(overridden)) `@Composable` 函数不再能够重新启动.
为可重新启动的组的生成的调用 [无法与继承正确配合](https://issuetracker.google.com/329477544), 会导致运行期的程序崩溃.

这就意味着虚拟函数不会被重新启动, 也不会被跳过: 当它们的状态无效时, 运行期会重新组合它们的父级 composable.
如果你的代码对重组很敏感, 你可能会注意到运行期行为中的变化.

### 性能改善 {id="performance-improvements"}

Compose 编译器过去会创建一个模块 IR 的完全拷贝, 以转换 `@Composable` 类型.
拷贝与 Compose 无关的元素不仅会增加内存消耗,
在 [某些边缘情况](https://issuetracker.google.com/365066530) 下, 这个行为还会破坏下游的编译器 plugin.

这个拷贝操作已被删除, 使得编译速度更快.

## 标准库 {id="standard-library"}

### 对标准库 API 废弃的严重级别的变更 {id="changes-to-the-deprecation-severity-of-standard-library-apis"}

在 Kotlin 2.1.0 中, 我们对几个标准库 API 的废弃严重级别, 从警告提升到错误.
如果你的代码依赖于这些 API, 你需要更新代码, 以保证兼容性.
最重要的变化包括:

* **对 `Char` 和 `String` 的 Locale 相关的大小写变换函数已被废弃:**
  `Char.toLowerCase()`, `Char.toUpperCase()`, `String.toUpperCase()`, 以及 `String.toLowerCase()` 函数现在已被废弃,
  使用它们会出现错误.
  请改为使用与 Locale 无关的替代函数, 或其它大小写变换机制.
  如果你想要继续使用默认的 Locale, 请将 `String.toLowerCase()` 重要的调用替换为 `String.lowercase(Locale.getDefault())`,
  明确指定 Locale.
  要使用与 Locale 无关的转换, 请替换为 `String.lowercase()`, 这个函数默认使用不变的(invariant) Locale.

* **Kotlin/Native 冻结(freezing) API 已被废弃:**
  使用以前标注了 `@FreezingIsDeprecated` 注解的冻结(freezing) 相关的声明, 现在会出现错误.
  这个变化反映了从 Kotlin/Native 中的旧内存管理器的过渡, 旧内存管理器在线程之间共用对象时, 要求先冻结对象.
  关于如何从冻结相关的 API 迁移到新的内存模型, 请参见 [Kotlin/Native 迁移指南](native-migration-guide.md#update-your-code).
  详情请参见 [关于废弃冻结功能公告](whatsnew1720.md#freezing).

* **`appendln()` 已被废弃, 改为使用 `appendLine()`:**
  `StringBuilder.appendln()` 和 `Appendable.appendln()` 函数现在已被废弃, 使用它们会出现错误.
  要替换这些函数, 请改为使用 `StringBuilder.appendLine()` 或 `Appendable.appendLine()` 函数.
  `appendln()` 函数被废弃, 是因为在 Kotlin/JVM 上, 它使用 `line.separator` 系统属性, 但在各个 OS 上的默认值不同.
  在 Kotlin/JVM 上, 这个属性的默认值在 Windows 上为 `\r\n` (CR LF), 但在其它操作系统上为 `\n` (LF).
  而 `appendLine()` 函数始终使用 `\n` (LF) 作为行分隔符, 确保在不同的平台上的行为一致.

关于这个发布版中受到影响的 API 的完整列表, 请参见 [KT-71628](https://youtrack.jetbrains.com/issue/KT-71628) YouTrack issue.

### 对 java.nio.file.Path 的文件树遍历扩展函数进入稳定版 {id="stable-file-tree-traversal-extensions-for-java-nio-file-path"}

Kotlin 1.7.20 为 `java.nio.file.Path` 类引入了实验性的 [扩展函数](extensions.md#extension-functions),
可以用来遍历一个文件树.
在 Kotlin 2.1.0 中, 以下文件树遍历扩展函数现在进入 [稳定版](components-stability.md#stability-levels-explained):

* `walk()`
  以懒惰模式(lazily)遍历以指定的路径为根的文件树.
* `fileVisitor()`
  能够单独创建一个 `FileVisitor`.
  `FileVisitor` 指定在遍历期间对目录和文件执行的动作.
* `visitFileTree(fileVisitor: FileVisitor, ...)`
  遍历一个文件树, 对遇到的每个节点调用指定的 `FileVisitor`, 它的底层使用 `java.nio.file.Files.walkFileTree()` 函数.
* `visitFileTree(..., builderAction: FileVisitorBuilder.() -> Unit)`
  使用指定的 `builderAction` 创建一个 `FileVisitor`,
  并调用`visitFileTree(fileVisitor, ...)` 函数.
* `sealed interface FileVisitorBuilder`
  允许你定义一个自定义的 `FileVisitor` 实现.
* `enum class PathWalkOption`
  为 `Path.walk()` 函数提供遍历选项.

下面的示例演示如何使用这些文件遍历 API 来创建自定义的 `FileVisitor` 行为, 用来实现指定的动作访问文件和目录.

例如, 你可以明确创建一个 `FileVisitor`, 并在之后使用它:

```kotlin
val cleanVisitor = fileVisitor {
    onPreVisitDirectory { directory, attributes ->
        // 在这里添加访问目录的逻辑
        FileVisitResult.CONTINUE
    }

    onVisitFile { file, attributes ->
        // 在这里添加访问文件的逻辑
        FileVisitResult.CONTINUE
    }
}

// 在这里添遍历之前的一般设置逻辑
projectDirectory.visitFileTree(cleanVisitor)
```

你也可以使用 `builderAction` 创建一个 `FileVisitor`, 并立即使用它进行遍历:

```kotlin
projectDirectory.visitFileTree {
    // 定义 builderAction:
    onPreVisitDirectory { directory, attributes ->
        // 某些访问目录的逻辑
        FileVisitResult.CONTINUE
    }

    onVisitFile { file, attributes ->
        // 某些访问文件的逻辑
        FileVisitResult.CONTINUE
    }
}
```

另外, 你可以使用 `walk()` 函数, 遍历一个以指定的路径为根的文件树:

```kotlin
fun traverseFileTree() {
    val cleanVisitor = fileVisitor {
        onPreVisitDirectory { directory, _ ->
            if (directory.name == "build") {
                directory.toFile().deleteRecursively()
                FileVisitResult.SKIP_SUBTREE
            } else {
                FileVisitResult.CONTINUE
            }
        }

        // 删除扩展名为 .class 的文件
        onVisitFile { file, _ ->
            if (file.extension == "class") {
                file.deleteExisting()
            }
            FileVisitResult.CONTINUE
        }
    }

    // 设置根目录和文件
    val rootDirectory = createTempDirectory("Project")

    // 创建 src 目录, 包含 A.kt 和 A.class 文件
    rootDirectory.resolve("src").let { srcDirectory ->
        srcDirectory.createDirectory()
        srcDirectory.resolve("A.kt").createFile()
        srcDirectory.resolve("A.class").createFile()
    }

    // 创建 build 目录, 包含 Project.jar 文件
    rootDirectory.resolve("build").let { buildDirectory ->
        buildDirectory.createDirectory()
        buildDirectory.resolve("Project.jar").createFile()
    }

    // 使用 walk() 函数:
    val directoryStructure = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
        .map { it.relativeTo(rootDirectory).toString() }
        .toList().sorted()
    println(directoryStructure)
    // 输出结果为: "[, build, build/Project.jar, src, src/A.class, src/A.kt]"
  
    // 使用 cleanVisitor 遍历文件树, 应用 rootDirectory.visitFileTree(cleanVisitor) 清除规则
    val directoryStructureAfterClean = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
        .map { it.relativeTo(rootDirectory).toString() }
        .toList().sorted()
    println(directoryStructureAfterClean)
    // 输出结果为: "[, src, src/A.kt]"
}
```

## 文档更新 {id="documentation-updates"}

Kotlin 文档有了一些重要更新:

### 语言概念 {id="language-concepts"}

* 改进了 [Null 值安全性](null-safety.md) 章节 –
  学习如何在你的代码中安全的处理 `null` 值.
* 改进了 [对象声明与对象表达式](object-declarations.md) 章节 –
  学习如何通过一个步骤定义一个类并创建一个实例.
* 改进了 [when 表达式和 when 语句](control-flow.md#when-expressions-and-statements) 章节 –
  学习 `when` 条件, 以及使用方法.
* 更新了 [Kotlin 发展路线图](roadmap.md), [Kotlin 的演化原则](kotlin-evolution-principles.md), 以及 [Kotlin 语言的功能特性与提案](kotlin-language-features-and-proposals.md) 章节 –
  了解 Kotlin 的开发计划, 正在进行中的开发, 和指导原则.

### Compose 编译器 {id="compose-compiler"}

* [Compose 编译器文档](compose-compiler-migration-guide.md) 现在移动到编译器与 plugin 章节中 –
  了解 Compose 编译器, 编译器选项, 以及迁移步骤.

### API 参考文档 {id="api-references"}

* 新的 [Kotlin Gradle plugin API 参考文档](https://kotlinlang.org/api/kotlin-gradle-plugin) –
  查看 Kotlin Gradle plugin 和 Compose 编译器 Gradle plugin 的 API 参考文档.

### 跨平台开发 {id="multiplatform-development"}

* 新的 [构建跨平台的 Kotlin 库](api-guidelines-build-for-multiplatform.md) 章节 –
  学习如何设计支持 Kotlin Multiplatform 的 Kotlin 库.
* 新的 [Kotlin Multiplatform 简介](multiplatform-intro.md) 章节 –
  学习 Kotlin Multiplatform 的核心概念, 依赖项, 库, 等等.
* 更新了 [Kotlin Multiplatform 概述](multiplatform.topic) 章节 –
  了解 Kotlin Multiplatform 的基本内容和常见使用场景.
* 新的 [iOS 集成](multiplatform-ios-integration-overview.md) 章节 –
  学习如何将 Kotlin Multiplatform 的共用模块集成到 你的 iOS App.
* 新的 [Kotlin/Native 定义文件](native-definition-file.md) 章节 –
  学习如何创建定义文件, 来使用 C 和 Objective-C 库.
* [WASI 入门](wasm-wasi.md) –
  学习如何在各种 WebAssembly 虚拟机中运行一个使用 WASI 的简单的 Kotlin/Wasm 应用程序.

### 工具 {id="tooling"}

* [新的 Dokka 迁移指南](dokka-migration.md) –
  学习如何迁移到 Dokka Gradle plugin v2.

## Kotlin 2.1.0 兼容性指南 {id="compatibility-guide-for-kotlin-2-1-0"}

Kotlin 2.1.0 是一个功能发布版, 因此可能会带来一些变更, 与你针对语言的旧版本编写的代码不兼容.
关于这些变更的详细列表, 请参见 [Kotlin 2.1.0 兼容性指南](compatibility-guide-21.md).

## 安装 Kotlin 2.1.0 {id="install-kotlin-2-1-0"}

从 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 开始,
Kotlin plugin 作为一个包含在 IDE 中的捆绑 plugin 发布.
这意味着你不再能够通过 JetBrains Marketplace 安装这个 plugin.

要更新到新的 Kotlin 版本, 请在你的构建脚本中 [变更 Kotlin 版本](releases.md#update-to-a-new-kotlin-version) 到 2.1.0.
