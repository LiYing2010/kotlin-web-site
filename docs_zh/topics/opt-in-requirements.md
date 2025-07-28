[//]: # (title: 明确要求使用者同意的功能(Opt-in Requirement))

Kotlin 标准库提供了一种机制, 可以要求用户明确同意使用某些 API 元素.
对于某些需要使用者明确同意的情况, 库的作者可以通过这种机制告知使用者,
例如, 如果一个 API 还出在实验性阶段, 未来可能发生变化.

为了保护使用者, 编译器提示这些条件的警告信息, 并要求他们同意(Opt-in), 然后才能够使用 API.

## 同意使用 API {id="opt-in-to-api"}

如果库的作者将库中的一个 API 标记为 **[要求使用者同意(requiring opt-in)](#require-opt-in-to-use-api)**,
那么你必须明确表示同意使用(Opt-in), 然后才能在自己的代码中使用它.
有几种方法来表示同意使用(Opt-in). 我们建议选择最适合你情况的方法.

### 局部同意 {id="opt-in-locally"}

当你在你的代码中使用一个特定的 API 元素时, 要表示同意,
请使用 [`@OptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/) 注解,
注解中引用实验性 API 的标注.
例如, 假设你想要使用 `DateProvider` 类, 它要求使用者同意:

```kotlin
// 库代码
@RequiresOptIn(message = "This API is experimental. It could change in the future without notice.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime

@MyDateTime
// 一个明确要求使用者同意的类
class DateProvider
```

在你的代码中, 在声明一个使用 `DateProvider` 类的函数之前,
请添加 `@OptIn` 注解, 其中包含 `MyDateTime` 注解类的引用:

```kotlin
// 库的使用者代码
@OptIn(MyDateTime::class)

// 使用 DateProvider
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

需要注意的是, 使用这种方法时, 如果 `getDate()` 函数在你的代码的其它地方调用, 或被其它开发者使用, 它本身不需要使用者同意:

```kotlin
// 库的使用者代码
@OptIn(MyDateTime::class)

// 使用 DateProvider
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    // OK: 不需要使用者同意
    println(getDate())
}
```

使用者同意的要求不会传播, 也就是说, 其它人可能会在不知情的情况下使用实验性的 API.
为了避免这个问题, 传播使用者同意的要求会更加安全.

#### 传播同意(opt-in)要求 {id="propagate-opt-in-requirements"}

如果你在代码中使用了某个 API, 而你的代码本身又打算给第三方使用, 例如, 是一个库,
那么你也可以将这个的 API 的要求使用者同意设定传递给你的 API.
为了做到这一点, 需要用库使用的 **[明确要求使用者同意(Opt-in Requirement) 注解](#create-opt-in-requirement-annotations)**
来标记你的函数的声明部分.

例如, 在声明使用 `DateProvider` 类的函数之前, 添加 `@MyDateTime` 注解:

```kotlin
// 库的使用者代码
@MyDateTime
fun getDate(): Date {
    // OK: 使用这个类的函数本身也要求使用者同意
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    println(getDate())
    // 编译错误: getDate() 要求使用者同意
}
```

在上面的示例中我们可以看到, 被注解的函数变得象是 `@MyDateTime` API 的一部分.
对使用者同意的强制要求传递到了 `getDate()` 函数的使用者.

如果一个 API 元素的签名包含一个要求使用者同意的类型, 那么签名本身也必须要求使用者同意.
否则, 如果一个 API 元素不要求使用者同意, 但它的签名包含要求使用者同意的类型, 那么使用它就会触发错误.

```kotlin
// 库的使用者代码
@MyDateTime
fun getDate(dateProvider: DateProvider = DateProvider()): Date

@MyDateTime
fun displayDate() {
    // OK: 这个函数也要求使用者同意
    println(getDate())
}
```

类似的, 如果你向一个签名中包含要求使用者同意的类型的声明使用 `@OptIn`, 那么对使用者同意的强制要求仍然会传播:

```kotlin
// 库的使用者代码
@OptIn(MyDateTime::class)
// 由于签名中存在 DateProvider, 因此会传播对使用者同意的强制要求
fun getDate(dateProvider: DateProvider = DateProvider()): Date

fun displayDate() {
    println(getDate())
    // 编译错误: getDate() 要求使用者同意
}
```

在传播使用者同意要求时, 很重要的一点是需要了解, 如果一个 API 元素进入稳定版, 不再要求使用者同意,
其它仍然要求使用者同意的 API 元素还是继续处于实验状态.
例如, 假设库作者对 `getDate()` 函数删除了使用者同意的要求, 因为它现在进入了稳定版:

```kotlin
// 库代码
// 不要求使用者同意
fun getDate(): Date {
    val dateProvider: DateProvider
    // ...
}
```

如果你使用 `displayDate()` 函数, 但没有删除使用者同意注解,
那么即使它已经不再需要使用者同意, 但它还是继续保持实验性状态:

```kotlin
// 库的使用者代码

// 仍然处于实验状态!
@MyDateTime
fun displayDate() {
    // 使用稳定版的库函数
    println(getDate())
}
```

#### 对多个 API 表示使用者同意 {id="opt-in-to-multiple-apis"}

要对多个 API 表示使用者同意, 请使用它们所有的使用者同意注解来标记声明.
例如:

```kotlin
@ExperimentalCoroutinesApi
@FlowPreview
```

或者也可以使用 `@OptIn`:

```kotlin
@OptIn(ExperimentalCoroutinesApi::class, FlowPreview::class)
```

### 在整个源代码文件中表示使用者同意 {id="opt-in-a-file"}

如果想要对一个源代码文件中的所有类和所有函数使用某个要求使用者同意的 API,
可以在文件最前部, 在包声明和包导入语句之前, 添加源代码文件级别的 `@file:OptIn` 注解.

```kotlin
// 库的使用者代码
@file:OptIn(MyDateTime::class)
```

### 在整个模块中表示使用者同意 {id="opt-in-a-module"}

> 从 Kotlin 1.6.0 开始支持编译器选项 `-opt-in`. 对更早的 Kotlin 版本, 请使用 `-Xopt-in`.
>
{style="note"}

如果你不希望在你的代码中每次使用需要同意的 API 的地方都添加标注, 那么你可以在你的整个模块级别上同意使用这些 API.
要在一个模块内同意使用某个 API, 可以使用参数 `-opt-in` 来编译模块,
并指定你所使用的 API 的要求用户同意标注的完全限定名称: `-opt-in=org.mylibrary.OptInAnnotation`.
使用这个参数来编译代码, 效果等于让模块内的每一个声明都添加 `@OptIn(OptInAnnotation::class)` 注解.

如果使用 Gradle 编译模块, 你可以象下面的例子这样来添加参数:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions.optIn.add("org.mylibrary.OptInAnnotation")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        optIn.add('org.mylibrary.OptInAnnotation')
    }
}
```

</tab>
</tabs>

如果你的 Gradle 模块是一个跨平台模块, 请使用 `optIn` 方法:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        optIn.add("org.mylibrary.OptInAnnotation")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    compilerOptions {
        optIn.add('org.mylibrary.OptInAnnotation')
    }
}
```

</tab>
</tabs>

对于 Maven, 请使用下面的设置:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <executions>...</executions>
            <configuration>
                <args>
                    <arg>-opt-in=org.mylibrary.OptInAnnotation</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

如果要在整个模块级别同意使用多个 API, 请对你的模块中使用到的每个要求用户同意的元素逐个添加上述参数.

### 对继承一个类或接口要求使用者同意 {id="opt-in-to-inherit-from-a-class-or-interface"}

有时候, 库作者会提供一个 API, 但希望要求使用者在扩展它之前明确表示同意.
例如, 库 API 的使用已经进入稳定状态, 但继承还没有进入稳定状态, 因为它将来可能会使用新的抽象函数进行扩展.
库作者可以使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 注解
标注 [开放类](inheritance.md) 或 [抽象类](classes.md#abstract-classes) 和 [非函数式接口](interfaces.md),
强制要求使用者同意.

要在你的代码中同意使用这样的 API 元素, 并扩展它, 请使用 `@SubclassOptInRequired` 注解, 其中指定注解类的引用.
例如, 假设你想要使用 `CoreLibraryApi` 接口, 它要求使用者同意:

```kotlin
// 库代码
@RequiresOptIn(
    level = RequiresOptIn.Level.WARNING,
    message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 一个接口, 要求使用者同意, 然后才能扩展它
interface CoreLibraryApi
```

在你的代码中, 在创建一个从 `CoreLibraryApi` 接口继承的新接口之前,
请添加 `@SubclassOptInRequired` 注解, 其中指定 `UnstableApi` 注解类的引用:

```kotlin
// 库的使用者代码
@SubclassOptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi
```

注意, 当你对一个类使用 `@SubclassOptInRequired` 注解时, 使用者同意的要求不会传播到任何 [内部类或嵌套类](nested-classes.md):

```kotlin
// 库代码
@RequiresOptIn
annotation class ExperimentalFeature

@SubclassOptInRequired(ExperimentalFeature::class)
open class FileSystem {
    open class File
}

// 库的使用者代码

// 要求使用者同意
class NetworkFileSystem : FileSystem()

// 嵌套类 class
// 不需要使用者同意
class TextFile : FileSystem.File()
```

或者, 你也可以使用 `@OptIn` 注解来表示使用者同意.
你也可以使用实验性标记注解, 将使用者同意要求传播到你的代码中任何使用这个类的地方:

```kotlin
// 库的使用者代码
// 带有 @OptIn 注解
@OptInRequired(UnstableApi::class)
interface SomeImplementation : CoreLibraryApi

// 使用引用注解类的注解
// 传播使用者同意要求
@UnstableApi
interface SomeImplementation : CoreLibraryApi
```

## 对使用 API 要求使用者同意 {id="require-opt-in-to-use-api"}

你可以要求库的使用者在使用你的 API 之前明确表示使用者同意.
此外, 你可以告知使用者使用你的 API 所需要的任何特殊条件, 直到你决定删除使用者同意要求.

### 创建表示要求使用者同意(Opt-in requirement)的注解 {id="create-opt-in-requirement-annotations"}

为了要求使用者明确同意使用你的模块中的 API, 需要创建一个注解, 用来作为 **要求使用者同意(Opt-in requirement)注解**.
这个注解类本身必须标注 [`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/) 注解:

```kotlin
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime
```

要求使用者同意(Opt-in requirement)注解, 必须满足几个要求. 它们必须包含以下设定:

* [retention](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/)
  设置为 `BINARY` 或 `RUNTIME`.
* [target](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)
  中包含 `EXPRESSION`, `FILE`, `TYPE`, 或 `TYPE_PARAMETER` .
* 没有参数.

对用户同意要求的严重 [级别](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/-level/) 可以是以下两种之一:

* `RequiresOptIn.Level.ERROR`.
  用户的明确同意是必须的. 否则, 被这个注解标注过的 API, 使用它的代码会编译失败. 这个级别是默认值.
* `RequiresOptIn.Level.WARNING`.
  用户的明确同意不是必须的, 但建议你明确表示同意. 否则, 编译器会给出警告.

请使用 `@RequiresOptIn` 注解的`level` 参数来设置你希望的严重级别.

此外, 你还可以为 API 使用者提供一个 `message`.
对于企图使用这个 API 但没有明确同意的用户, 编译器会显示这个警告信息:

```kotlin
@RequiresOptIn(level = RequiresOptIn.Level.WARNING, message = "This API is experimental. It can be incompatibly changed in the future.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

如果你需要对外公布多个独立的功能, 都要求用户同意, 那么请为其中的每一个分别定义不同的标注注解.
不同的注解可以使你的 API 的使用者在使用这些功能时更加安全, 因为他们可以只使用他们明确接受的那部分功能.
同时也意味着你能够对各个功能分别取消用户同意的强制要求, 使得你的 API 更加易于维护.

### 标记要求使用者同意的 API 元素 {id="mark-api-elements"}

要对 API 的使用要求使用者同意, 请在它的声明部分添加你定义的那个要求使用者同意的注解:

```kotlin
@MyDateTime
class DateProvider

@MyDateTime
fun getTime(): Time {}
```

注意, 对于一些语言元素, 不能使用要求使用者同意的注解:

* 对覆盖方法(overriding method)标注的注解只能是这个函数在基类声明中已经出现过的注解.
* 不能用这种注解标注属性的后端域变量(backing field)或取值函数(getter), 只能标注属性本身.
* 不能用这种注解标注局部变量或函数的值参数.

## 对扩展 API 要求使用者同意 {id="require-opt-in-to-extend-api"}

有些时候, 你会希望更加精细的控制你的 API 的哪些部分可以使用和扩展.
例如, 你可能有一些 API 能够稳定的使用, 但是:

* **不能稳定的实现**,
  由于它还在演化中, 例如, 你有一组接口, 并期望在其中添加新的抽象函数, 但没有默认的实现.
* **实现时很精细或脆弱**,
  例如多个单独的函数, 需要通过某种协调方式才能运行.
* **存在契约, 未来可能会被削弱**
  这样的削弱对于外部实现来说可能是不向后兼容的,
  例如, 输入参数 `T` 改变为可为 null 的版本 `T?`, 而之前的代码没有考虑过 `null` 值.

在这种情况下, 你可以要求使用者在对你的 API 进行扩展之前明确表示同意.
使用者扩展你的 API 的方式, 包括从 API 继承, 或实现抽象函数.
使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/) 注解,
你可以对 [开放类](inheritance.md) 或 [抽象类](classes.md#abstract-classes) 和 [非函数式接口](interfaces.md)
强制要求使用者同意.

要添加向一个 API 元素使用者同意要求, 请使用 [`@SubclassOptInRequired`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-subclass-opt-in-required/)
注解, 其中包含注解类的引用:

```kotlin
@RequiresOptIn(
    level = RequiresOptIn.Level.WARNING,
    message = "Interfaces in this library are experimental"
)
annotation class UnstableApi()

@SubclassOptInRequired(UnstableApi::class)
// 一个接口, 要求使用者同意, 然后才能扩展它
interface CoreLibraryApi
```

注意, 当你使用 `@SubclassOptInRequired` 注解来要求使用者同意时, 这个要求不会传播到任何 [内部类或嵌套类](nested-classes.md).

关于如何在你的 API 中使用 `@SubclassOptInRequired` 注解的真实示例,
请参见 `kotlinx.coroutines` 库中的 [`SharedFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-shared-flow/) 接口.

## 未稳定发布的 API 对使用者同意的要求 {id="opt-in-requirements-for-pre-stable-apis"}

如果你对未稳定发布的功能要求使用者同意, 请仔细维护你的 API, 确保不要破坏使用者的代码.

一旦你的未稳定发布的 API 开发完成, 并以稳定模式发布之后, 请在你的声明中删除要求使用者同意的注解.
之后, 使用者的代码就能够不受限制地使用这些 API 了.
但是, 你还需要将这些注解类继续保留在模块中, 以与现有的使用者代码保持兼容.

如果要鼓励 API 的使用者更新他们的模块, 从他们的代码中删除这些注解, 并重新编译,
请将注解标记为 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/), 并在描述信息中解释原因.

```kotlin
@Deprecated("This opt-in requirement is not used anymore. Remove its usages from your code.")
@RequiresOptIn
annotation class ExperimentalDateTime
```
