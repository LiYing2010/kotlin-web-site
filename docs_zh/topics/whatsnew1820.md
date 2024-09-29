[//]: # (title: Kotlin 1.8.20 版中的新功能)

最终更新: %latestDocDate%

_[发布日期: 2023/04/25](releases.md#release-details)_

Kotlin 1.8.20 已经发布了, 其中一些重要更新如下:

* [新的 Kotlin K2 编译器的更新](#new-kotlin-k2-compiler-updates)
* [新的 Kotlin/Wasm 编译目标(实验性功能)](#new-kotlin-wasm-target)
* [Gradle 中默认启用新的 JVM 增量编译](#new-jvm-incremental-compilation-by-default-in-gradle)
* [Kotlin/Native 编译目标的更新](#update-for-kotlin-native-targets)
* [Kotlin Multiplatform 中的 Gradle 复合构建(composite build) (预览版)](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [Xcode 中 Gradle 错误信息的改进](#improved-output-for-gradle-errors-in-xcode)
* [标准库支持 AutoCloseable 接口 (实验性功能)](#support-for-the-autocloseable-interface)
* [标准库支持 Base64 编码(实验性功能)](#support-for-base64-encoding)

关于本次更新的概要介绍, 你可以观看以下视频:

<video src="https://youtu.be/R1JpkpPzyBU" title="Kotlin 1.8.20 版中的新功能"/>

## IDE 支持 {id="ide-support"}

在以下 IDE 中可以使用支持 1.8.20 版的 Kotlin plugin:

| IDE            | 支持的版本            |
|----------------|-------------------------------|
| IntelliJ IDEA  | 2022.2.x, 2022.3.x,  2023.1.x |
| Android Studio | Flamingo (222)                |

> 要正确下载 Kotlin 的 artifact 和依赖项, 请 [配置你的 Gradle 设置](#configure-gradle-settings)
> 使用 Maven Central 仓库.
>
{style="warning"}

## 新的 Kotlin K2 编译器的更新 {id="new-kotlin-k2-compiler-updates"}

Kotlin 开发组一直在努力稳定 K2 编译器.
在 [Kotlin 1.7.0 版发布公告](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha) 中曾经提到,
它现在还处于 **Alpha 版**.
为了向 [K2 Beta 版](https://youtrack.jetbrains.com/issue/KT-52604) 推进, 本次发布引入了更多的改进.

从本次 1.8.20 发布版开始, Kotlin K2 编译器:

* 有了一个序列化 plugin (预览版).
* 对 [JS IR 编译器](js-ir-compiler.md) 提供 Alpha 支持.
* 介绍未来版本: [新的语言版本, Kotlin 2.0](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/).

关于新编译器和它的益处, 更多详情请观看以下视频:

* [关于新 Kotlin K2 编译器, 每个人都应该了解的知识](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [新 Kotlin K2 编译器: 专家评审](https://www.youtube.com/watch?v=db19VFLZqJM)

### 如何启用 Kotlin K2 编译器 {id="how-to-enable-the-kotlin-k2-compiler"}

要启用并测试 Kotlin K2 编译器, 请通过下面的编译器选项, 使用新的语言版本:

```bash
-language-version 2.0
```

你可以在你的 `build.gradle(.kts)` 文件中指定这个选项:

```kotlin
kotlin {
   sourceSets.all {
       languageSettings {
           languageVersion = "2.0"
       }
   }
}
```

以前的 `-Xuse-k2` 编译器选项已被废弃.

> 新 K2 编译器的 Alpha 版只能用于 JVM 和 JS IR 项目.
> 它还不支持 Kotlin/Native, 也不支持任何 跨平台项目.
>
{style="warning"}

### 留下你对于新 K2 编译器的反馈意见 {id="leave-your-feedback-on-the-new-k2-compiler"}

如果你能提供你的反馈意见, 我们将会非常感谢!

* 在 Kotlin Slack 频道中, 直接向 K2 开发者提供你的反馈意见 – [获得邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道.
* 在 [我们的问题追踪系统](https://kotl.in/issue) 中报告你遇到的新 K2 编译器的问题.
* [启用 **Send usage statistics** 选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html),
  允许 JetBrains 收集关于 K2 使用状况的匿名数据.

## 语言

随着 Kotlin 的不断演化, 我们在 1.8.20 中引入了新的语言功能的预览版:

* [枚举类值函数的现代而且高性能的替代者](#a-modern-and-performant-replacement-of-the-enum-class-values-function)
* [与数据类(Data Class)对称的数据对象(Data Object)](#preview-of-data-objects-for-symmetry-with-data-classes)
* [解除对内联类(Inline class)中有 body 的次级构造器(secondary constructor)的限制](#preview-of-lifting-restriction-on-secondary-constructors-with-bodies-in-inline-classes)

### 枚举类值函数的现代而且高性能的替代者 {id="a-modern-and-performant-replacement-of-the-enum-class-values-function"}

> 这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文).
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过 [YouTrack](https://kotl.in/issue) 提供你的反馈意见.
>
{style="warning"}

枚举类有一个合成(synthetic)函数 `values()`, 它返回一个数组, 其中包含枚举类中定义的枚举常数.
但是, 使用数组可能导致 Kotlin 和 Java 中的 [隐含的性能问题](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md#examples-of-performance-issues).
此外, 大多数 API 都使用集合, 因此最终还是需要转换.
为了解决这些问题, 我们为枚举类引入了 `entries` 属性, 用来替代 `values()` 函数.
调用时, `entries` 属性返回一个预先分配的可不变 List, 其中包含枚举类中定义的枚举常数.

> `values()` 函数仍然继续支持, 但我们推荐你改为使用 `entries` 属性.
>
{style="tip"}

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

@OptIn(ExperimentalStdlibApi::class)
fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```
{validate="false"}

#### 如何启用 entries 属性

要试用这个功能, 请使用 `@OptIn(ExperimentalStdlibApi)` 注解标注使用者同意(Opt-in), 并启用 `-language-version 1.9` 编译器选项.
在 Gradle 项目中, 可以在你的 `build.gradle(.kts)` 文件中添加以下代码:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>

> 从 IntelliJ IDEA 2023.1 开始, 如果你对这个功能标注了使用者同意(Opt-in),
> IDE 的代码检查功能会通知你将 `values()` 转换为 `entries`, 并为你提供快速修正.
>
{style="tip"}

关于这个提案, 更多详情请参见 [KEEP 条目](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md).

### 与数据类(Data Class)对称的数据对象(Data Object) (预览版) {id="preview-of-data-objects-for-symmetry-with-data-classes"}

数据对象(Data Object) 允许你声明 singleton 语义的对象, 并带有一个干净的 `toString()` 表达.
在下面的代码片段中, 你可以看到向一个对象声明添加 `data` 关键字, 如何改善它的 `toString()` 输出的可读性:

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // 输出结果为 org.example.MyObject@1f32e575
    println(MyDataObject) // 输出结果为 MyDataObject
}
```

特别是对于 `sealed` 类型层级结构(例如 `sealed class` 或 `sealed interface` 类型层级结构), 非常适合使用 `data objects`,
因为可以与 `data class` 声明一起方便的使用.
在下面的代码片段中, 将 `EndOfFile` 声明为 `data object` 而不是普通的 `object`, 代表它自动拥有漂亮的 `toString`, 不需要手动的覆盖这个函数.
这样就保持了与相应的数据类定义的对称性.

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) // 输出结果为 Number(number=7)
    println(EndOfFile) // 输出结果为 EndOfFile
}
```

#### 数据对象的语义

从 [Kotlin 1.7.20](whatsnew1720.md#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects) 中的第一个预览版之后, 数据对象的语义有了一些改进.
编译器现在会自动为它们生成一些便利的函数:

##### toString

数据对象的 `toString()` 函数返回对象的简单名称:

```kotlin
data object MyDataObject {
    val x: Int = 3
}

fun main() {
    println(MyDataObject) // 输出结果为 MyDataObject
}
```

##### equals 和 hashCode

`data object` 的 `equals()` 函数会保证你的 `data object` 的所有对象都被看作相等.
大多数情况下, 你的数据对象在运行期只会存在单个实例(毕竟, `data object` 声明的就是一个单子(singleton)).
但是, 在某些特殊情况下, 也可以在运行期生成相同类型的其他对象
(例如, 通过 `java.lang.reflect` 使用平台的反射功能, 或通过底层使用了这个 API 的 JVM 序列化库),
这个功能可以确保这些对象被当作相等.

请确保只对 `data objects` 进行结构化的相等比较 (使用 `==` 操作符), 而不要进行引用相等比较 (使用 `===` 操作符).
如果数据对象在运行期有一个以上的实例存在, 这样可以帮助你避免错误.
下面的代码片段演示这种特殊情况:

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) // 输出结果为 MySingleton
    println(evilTwin) // 输出结果为 MySingleton

    // 即使一个库强行创建了 MySingleton 的第二个实例, 它的 `equals` 方法也会返回 true:
    println(MySingleton == evilTwin) // 输出结果为 true

    // 不要使用 === 比较数据对象.
    println(MySingleton === evilTwin) // 输出结果为 false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin 的反射功能不允许创建数据对象的实例.
    // 这段代码 "强行" 创建新的 MySingleton 实例 (也就是通过 Java 平台的反射功能)
    // 在你的代码中一定不要这样做!
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

编译器生成的 `hashCode()` 函数的行为与 `equals()` 函数保持一致, 因此一个 `data object` 的所有运行期实例都拥有相同的 hash 值.

##### 数据对象没有 copy 和 componentN 函数

尽管 `data object` 和 `data class` 声明经常一起使用, 而且很相似, 但对于 `data object` 有一些函数没有生成:

因为 `data object` 声明通常用作单子对象, 因此不会生成 `copy()` 函数.

这种单子模式将一个类限定为只有单个实例, 如果允许创建实例的拷贝, 就破坏了只存在单个实例的原则.

而且, 与 `data class` 不同, `data object` 没有任何数据属性.
对这种没有数据属性的对象进行解构是没有意义的, 因此不会生成 `componentN()` 函数.

关于这个功能, 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-4107) 提供你的反馈意见.

#### 如何启用数据对象的预览版

要试用这个功能, 请启用 `-language-version 1.9` 编译器选项.
在 Gradle 项目中, 可以在你的 `build.gradle(.kts)` 文件中添加以下代码:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>

### 解除对内联类(Inline class)中有 body 的次级构造器(secondary constructor)的限制 (预览版) {id="preview-of-lifting-restriction-on-secondary-constructors-with-bodies-in-inline-classes"}

> 这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文).
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过 [YouTrack](https://kotl.in/issue) 提供你的反馈意见.
>
{style="warning"}

Kotlin 1.8.20 解除了在 [内联类(Inline class)](inline-classes.md) 中使用有 body 的次级构造器(secondary constructor)的限制.

内联类过去只允许 public 的主构造器, 不允许使用 `init` 代码块或次级构造器, 以便保证初始化代码的语义清晰.
这就造成, 无法封装底层值, 或创建一个内联类来表达某些受限定的值.

这些问题现在已经解决了.
Kotlin 1.4.30 取消了对 `init` 代码块的限制.
现在我们更进一步, 允许有 body 的次级构造器 (预览版):

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // 从 Kotlin 1.4.30 开始可以使用:
    init { 
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }
    // 从 Kotlin 1.8.20 开始可以使用 (预览版):
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```

#### 如何启用有 body 的次级构造器

要试用这个功能, 请启用 `-language-version 1.9` 编译器选项.
在 Gradle 项目中, 可以在你的 `build.gradle(.kts)` 文件中添加以下代码:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
```

</tab>
</tabs>


我们鼓励你试用这个功能, 并在 [YouTrack](https://kotl.in/issue) 中报告问题, 帮助我们让这个功能在 Kotlin 1.9.0 中默认启用.

关于 Kotlin 内联类的进展, 请参见 [这个 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md).

## 新的 Kotlin/Wasm 编译目标 {id="new-kotlin-wasm-target"}

Kotlin/Wasm (Kotlin WebAssembly) 在本次发布中进入了 [实验阶段](components-stability.md#stability-levels-explained).
Kotlin 开发组认为 [WebAssembly](https://webassembly.org/) 是一项很有前途的技术,
并希望找到更好的方式, 让你使用它, 同时又得到 Kotlin 的一切益处.

Wasm 为 Kotlin 和其他编程语言提供了在 Web 上运行的编译目标.
WebAssembly 二进制格式是平台独立的, 因为它运行在自己的虚拟机上.
几乎所有的现代浏览器都已经支持 WebAssembly 1.0.
要设置环境来运行 WebAssembly, 你只需要启用 Kotlin/Wasm 编译目标的一个实验性的垃圾收集模式.
具体做法请参见: [如何启用 Kotlin/Wasm](#how-to-enable-kotlin-wasm).

我们想要重点介绍新的 Kotlin/Wasm 编译目标的以下优势:

* 与 `wasm32` Kotlin/Native 编译目标相比, 编译速度更快, 因为 Kotlin/Wasm 不必使用 LLVM.
* 与 `wasm32` 编译目标相比, 与 JS 的互操性以及与浏览器的集成都更加容易, 这是因为使用了 [Wasm 垃圾收集器](https://github.com/WebAssembly/gc).
* 与 Kotlin/JS 和 JavaScript 相比, 应用程序启动速度可能更快, 因为 Wasm 的字节码更小, 并且易于解析.
* 与 Kotlin/JS 和 JavaScript 相比, 应用程序的运行期性能更好, 因为 Wasm 是一种静态类型语言.

从 1.8.20 版开始, 你可以在你的实验性项目中使用 Kotlin/Wasm.
我们为 Kotlin/Wasm 提供了开箱即用的 Kotlin 标准库(`stdlib`) 和测试库(`kotlin.test`).
IDE 支持会在未来的发布版中添加.

[观看这个 YouTube 视频, 了解关于 Kotlin/Wasm 的更多信息](https://www.youtube.com/watch?v=-pqz9sKXatw).

### 如何启用 Kotlin/Wasm {id="how-to-enable-kotlin-wasm"}

要启用并测试 Kotlin/Wasm, 请更新你的 `build.gradle.kts` 文件:

```kotlin
plugins {
    kotlin("multiplatform") version "1.8.20"
}

kotlin {
    wasm {
        binaries.executable()
        browser {
        }
    }
    sourceSets {
        val commonMain by getting
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test"))
            }
        }
        val wasmMain by getting
        val wasmTest by getting
    }
}
```

> 请查看 [Kotlin/Wasm 示例程序的 GitHub 代码仓库](https://github.com/Kotlin/kotlin-wasm-examples).
>
{style="tip"}

要运行 Kotlin/Wasm 项目, 你需要更新目标环境的设定:

<tabs>
<tab title="Chrome">

* 对 109 版本:

使用 `--js-flags=--experimental-wasm-gc` 命令行参数运行应用程序.

* 对 110 或以上版本:

  1. 在你的浏览器中进入 `chrome://flags/#enable-webassembly-garbage-collection`.
  2. 启用 **WebAssembly Garbage Collection**.
  3. 重新启动你的浏览器.

</tab>
<tab title="Firefox">

对 109 或以上版本:

1. 在你的浏览器中进入 `about:config`.
2. 启用 `javascript.options.wasm_function_references` and `javascript.options.wasm_gc` 选项.
3. 重新启动你的浏览器.

</tab>
<tab title="Edge">

对 109 或以上版本:

使用 `--js-flags=--experimental-wasm-gc` 命令行参数运行应用程序.

</tab>
</tabs>

### 留下你对于 Kotlin/Wasm 的反馈意见

如果你能提供你的反馈意见, 我们将会非常感谢!

* 在 Kotlin Slack 频道中, 直接向开发者提供你的反馈意见 – [获得邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw),
  并加入 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 频道.
* 在 [这个 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-56492) 中, 报告你遇到的 Kotlin/Wasm 的问题.

## Kotlin/JVM {id="kotlin-jvm"}

Kotlin 1.8.20 引入了 [Java 合成属性(synthetic property)的引用 (预览版)](#preview-of-java-synthetic-property-references)
和 [在 kapt stub 生成任务中默认支持 JVM IR 后端](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task-by-default).

### Java 合成属性(synthetic property)的引用 (预览版) {id="preview-of-java-synthetic-property-references"}

> 这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过 [YouTrack](https://kotl.in/issue) 提供你的反馈意见.
>
{style="warning"}

Kotlin 1.8.20 引入了新的功能, 可以创建 Java 合成属性(synthetic property) 引用, 例如, 对这段 Java 代码:

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }
}
```

Kotlin 允许你使用 `person.age`, 其中 `age` 是一个合成属性.
现在, 你还可以创建 `Person::age` 和 `person::age` 的引用. 对 `name` 也是一样.

```kotlin
val persons = listOf(Person("Jack", 11), Person("Sofie", 12), Person("Peter", 11))
    Persons
        // 调用 Java 合成属性的引用:
        .sortedBy(Person::age)
        // 通过 Kotlin 的属性语法, 调用 Java 取值方法:
        .forEach { person -> println(person.name) }
```
{validate="false"}

#### 如何启用 Java 合成属性的引用

要试用这个功能, 请启用 `-language-version 1.9` 编译器选项.
在 Gradle 项目中, 你可以对你的 `build.gradle(.kts)` 文件添加以下内容:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
}
```

</tab>
</tabs>

### 在 kapt stub 生成任务中默认支持 JVM IR 后端 {id="support-for-the-jvm-ir-backend-in-kapt-stub-generating-task-by-default"}

在 Kotlin 1.7.20 中, 我们引入了 [在 kapt stub 生成任务中支持 JVM IR 后端](whatsnew1720.md#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task) 功能.
从这个发布版开始, 默认启用这个支持.
你不再需要在你的 `gradle.properties` 中指定 `kapt.use.jvm.ir=true` 来启用这个功能.
关于这个功能, 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682) 提供你的反馈意见.

## Kotlin/Native {id="kotlin-native"}

Kotlin 1.8.20 包含的变更有: Kotlin/Native 支持的目标平台, 与 Objective-C 互操作性, CocoaPods Gradle plugin 的改进, 以及其他更新:

* [对 Kotlin/Native 目标平台的更新](#update-for-kotlin-native-targets)
* [废弃了旧的内存管理器](#deprecation-of-the-legacy-memory-manager)
* [支持带 @import 指令的 Objective-C 头文件](#support-for-objective-c-headers-with-import-directives)
* [支持 Cocoapods Gradle plugin 中的 link-only 模式](#support-for-the-link-only-mode-in-cocoapods-gradle-plugin)
* [在 UIKit 中将 Objective-C 扩展导入为类的成员](#import-objective-c-extensions-as-class-members-in-uikit)
* [在编译器中重新实现了编译器的缓存管理](#reimplementation-of-compiler-cache-management-in-the-compiler)
* [在 Cocoapods Gradle plugin 中废弃了 `useLibraries()`](#deprecation-of-uselibraries-in-cocoapods-gradle-plugin)
  
### Kotlin/Native 目标平台的更新 {id="update-for-kotlin-native-targets"}

Kotlin 开发组决定重新审查 Kotlin/Native 支持的目标平台,
将它们分为不同的支持层级, 并从 Kotlin 1.8.20 开始废弃其中的一部分.
关于支持的和废弃的目标平台的完整列表, 请参见 [Kotlin/Native 支持的目标平台](native-target-support.md).

从 Kotlin 1.8.20 开始, 以下目标平台已被废弃, 将在 1.9.20 中删除:

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxArm32Hfp`
* `linuxMips32`
* `linuxMipsel32`

对于剩下的目标平台, 根据 Kotlin/Native 编译器中支持和测试程度的不同, 现在分为 3 个支持层级.
一个目标平台可能被移动到不同的层级.
例如, 将来我们会尽最大努力对 `iosArm64` 提供完全的支持, 因为它对
[Kotlin Multiplatform](multiplatform-get-started.md) 非常重要.

如果你是库的作者, 这 3 个支持层级能够帮助你决定在 CI 工具中测试哪些目标平台, 略过哪些目标平台.
Kotlin 开发组在 Kotlin 官方库的开发中也使用这个方案, 例如 [kotlinx.coroutines](coroutines-guide.md).

关于这些变更的原因, 详情请阅读我们的 [blog](https://blog.jetbrains.com/kotlin/2023/02/update-regarding-kotlin-native-targets/).

### 废弃了旧的内存管理器 {id="deprecation-of-the-legacy-memory-manager"}

从 1.8.20 开始, 旧的内存管理器已被废弃, 并将在 1.9.20 中删除.
[新的内存管理器](native-memory-manager.md) 已在 1.7.20 中默认启用,
之后还进行了一些稳定性更新和性能改进.

如果你还在使用旧的内存管理器, 请从你的 `gradle.properties` 文件删除 `kotlin.native.binary.memoryModel=strict` 选项,
并遵循我们的 [迁移指南](native-migration-guide.md) 进行必要的变更.

新的内存管理器不支持 `wasm32` 目标平台.
这个目标平台 [从这个发布版开始已被废弃](#update-for-kotlin-native-targets), 并将在 1.9.20 中删除.

### 支持带 @import 指令的 Objective-C 头文件 {id="support-for-objective-c-headers-with-import-directives"}

> 这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文).
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过 [YouTrack](https://kotl.in/issue) 提供你的反馈意见.
>
{style="warning"}

Kotlin/Native 现在可以导入带 `@import` 指令的 Objective-C 头文件.
在使用具有自动生成的 Objective-C 头文件的 Swift 库, 或使用 Swift 编写的 CocoaPods 依赖项的类时,
这个功能非常有用.

在以前的版本中, cinterop 工具无法通过 `@import` 指令分析依赖于 Objective-C 模块的头文件.
因为它缺乏对 `-fmodules` 选项的支持.

从 Kotlin 1.8.20 开始, 你可以使用带 `@import` 的 Objective-C 头文件.
为了使用这个功能, 请在定义文件中通过 `compilerOpts` 向编译器传递 `-fmodules` 选项.
如果你使用 [CocoaPods 集成](native-cocoapods.md),
请在 `pod()` 函数的在配置代码块中指定 cinterop 选项, 如下:

```kotlin
kotlin {
    ios()

    cocoapods {
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"

        ios.deploymentTarget = "13.5"

        pod("PodName") {
            extraOpts = listOf("-compiler-option", "-fmodules")
        }
    }
}
```

这是一个 [期待已久的功能](https://youtrack.jetbrains.com/issue/KT-39120),
我们欢迎你在 [YouTrack](https://kotl.in/issue) 中提供你的反馈意见, 帮助我们在未来的发布版中将它变成默认功能.

### 支持 Cocoapods Gradle plugin 中的 link-only 模式 {id="support-for-the-link-only-mode-in-cocoapods-gradle-plugin"}

从 Kotlin 1.8.20 开始, 你可以将 Pod 依赖项和动态框架(dynamic framework)一起使用,
只用于链接, 而不生成 cinterop 绑定.
对于 cinterop 绑定已经生成的情况, 这个功能可能会有用.

考虑一个项目, 有 2 个模块, 1 个是库, 1 个是应用程序.
库依赖于一个 Pod, 但不产生框架, 只产生 1 个 `.klib`. 应用程序依赖于库, 并产生一个动态框架(dynamic framework).
对于这样的情况, 你需要使用使用库依赖的 Pod 来链接这个框架, 但你不需要 cinterop 绑定, 因为已经为库生成了绑定.

要启用这个功能, 请在添加 Pod 依赖项时使用 `linkOnly` 选项, 或构建器属性:

```kotlin
cocoapods {
    summary = "CocoaPods test library"
    homepage = "https://github.com/JetBrains/kotlin"

    pod("Alamofire", linkOnly = true) {
        version = "5.7.0"
    }
}
```

> 如果你对静态框架使用这个选项, 它会删除整个 Pod 依赖项, 因为对静态框架的链接不会使用 Pod.
>
{style="note"}

### 在 UIKit 中将 Objective-C 扩展导入为类的成员 {id="import-objective-c-extensions-as-class-members-in-uikit"}

从 Xcode 14.1 开始, 来自 Objective-C 类的一些方法已经被移动为类别成员(category member).
这会导致生成不同的 Kotlin API, 而且这些方法会被导入为 Kotlin 扩展, 而不是方法.

在使用 UIKit 并覆盖方法时, 你可能已经遇到了这个变更造成的问题.
例如, 在 Kotlin 中继承 UIVIew 类时, 将会无法覆盖 `drawRect()` 或 `layoutSubviews()` 方法.

从 1.8.20 开始, 在与 NSView 和 UIView 类相同的头文件中声明的类别成员(category member), 会被导入为这些类的成员.
因此, 从 NSView 和 UIView 继承的子类, 可以很容易的覆盖这些方法, 就像其它方法一样.

如果一切顺利, 我们计划对所有的 Objective-C 类默认启用这个行为.

### 在编译器中重新实现了编译器的缓存管理 {id="reimplementation-of-compiler-cache-management-in-the-compiler"}

为了加快编译器缓存功能的演进速度, 我们将编译器缓存管理从 Kotlin Gradle plugin 移动到了 Kotlin/Native 编译器中.
这样做就使得我们可以进行几项重要的改进工作, 包括编译速度和编译器缓存灵活性相关的改进.

如果你遇到问题, 需要回到原来的行为, 请使用 Gradle 属性 `kotlin.native.cacheOrchestration=gradle`.

希望你能通过 [YouTrack](https://kotl.in/issue) 提供你的反馈意见.

### 在 Cocoapods Gradle plugin 中废弃了 useLibraries() {id="deprecation-of-uselibraries-in-cocoapods-gradle-plugin"}

Kotlin 1.8.20 开始了 `useLibraries()` 函数的废弃周期, 这个函数用于静态库的 [CocoaPods 集成](native-cocoapods.md).

我们过去引入 `useLibraries()` 函数, 是为了允许使用包含静态库的 Pod 依赖项.
随着时间的推移, 这样的情况变得非常罕见.
大多数 Pod 都使用源代码来发布, 而且二进制的发布通常会选择 Objective-C 框架或 XCFramework.

由于不再需要使用这个函数, 而且它会导致一些问题, 使得 Kotlin CocoaPods Gradle plugin 的开发变得复杂, 我们决定废弃它.

关于框架和 XCFramework, 更多详情请参见 [构建最终的原生二进制文件](multiplatform-build-native-binaries.md).

## Kotlin Multiplatform

Kotlin 1.8.20 致力于改善开发者体验, 对 Kotlin Multiplatform 进行了以下更新:

* [设置源代码集层级结构的新方案](#new-approach-to-source-set-hierarchy)
* [Kotlin Multiplatform 支持 Gradle 复合构建(composite build) (预览版)](#preview-of-gradle-composite-builds-support-in-kotlin-multiplatform)
* [Xcode 中 Gradle 错误信息的改进](#improved-output-for-gradle-errors-in-xcode)

### 源代码集层级结构的新方案 {id="new-approach-to-source-set-hierarchy"}

> 源代码集层级结构的新方案是 [实验性功能](components-stability.md#stability-levels-explained).
> 在未来的 Kotlin 发布版中, 它随时有可能变更, 不会预先通知.
> 需要使用者同意(Opt-in) (详情见下文).
> 希望你能通过 [YouTrack](https://kotl.in/issue) 提供你的反馈意见.
>
{style="warning"}

Kotlin 1.8.20 提供了一种新的方式, 在你的跨平台项目中设置源代码集层级结构 − 默认的编译目标层级结构.
新方案旨在替代编译目标的简写(shortcut), 例如 `ios`, 这些编译目标简写(shortcut)存在 [设计缺陷](#why-replace-shortcuts).

默认的编译目标层级结构背后的理念非常简单: 你要明确声明你的项目所有编译目标,
Kotlin Gradle plugin 会根据指定的编译目标自动创建共用的源代码集.

#### 设置你的项目

以下面这个简单的跨平台移动应用程序为例子:

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
kotlin {
    // 启用默认的编译目标层级结构:
    targetHierarchy.default()

    android()
    iosArm64()
    iosSimulatorArm64()
}
```

你可以将默认的编译目标层级结构看作一个模板, 其中包含所有可能的编译目标以及它们的共用源代码集.
当你在你的代码中声明最终的编译目标 `android`, `iosArm64`, 和 `iosSimulatorArm64` 时,
Kotlin Gradle plugin 会从模板中找到合适的共用源代码集, 并为你创建这些共用源代码集.
最终产生的层级结构如下:

![使用默认的编译目标层级结构的示例](default-hierarchy-example.svg){thumbnail="true" width="350" thumbnail-same-file="true"}

绿色的源代码集会自动创建并包含到项目中, 同时, 默认模板中的灰色的源代码集会被忽略.
你可以看到, Kotlin Gradle plugin 没有创建一些源代码集, 例如 `watchos`,
因为项目中没有 watchOS 编译目标.

如果你添加一个 watchOS 编译目标, 例如 `watchosArm64`, `watchos` 源代码集就会被创建,
来自 `apple`, `native`, 和 `common` 源代码集的代码也会被编译到 `watchosArm64`.

关于默认的编译目标层级结构的完整构成, 请参见 [文档](multiplatform-hierarchy.md#default-hierarchy-template).

> 在这个示例中, `apple` 和 `native` 源代码集只会对 `iosArm64` 和 `iosSimulatorArm64` 编译目标编译.
> 因此, 尽管它们的名字不是 ios, 它们可以访问完整的 iOS API.
> 对于 `native` 这样的源代码集, 这可能会违反直觉, 因为你可能会期望在这个源代码集中, 只能访问那些所有原生编译目标都能够使用的 API.
> 这个行为未来可能会变更.
>
{style="note"}

#### 为什么要替换简写(shortcut) {id="why-replace-shortcuts"}

创建源代码集层级结构, 可能繁琐, 易出错, 而且对初学者不友好.
我们之前的解决方案是, 引入 `ios` 这样的简写(shortcut), 它会为你创建层级结构的一部分.
但是, 使用简写已被证明存在很大的设计缺陷: 它们很难变更.

以 `ios` 简写为例子. 它只创建 `iosArm64` 和 `iosX64` 编译目标,
这可能令人困惑, 而且如果使用基于 M1 的主机, 还需要 `iosSimulatorArm64` 编译目标, 就会导致错误.
但是, 添加 `iosSimulatorArm64` 编译目标, 对于用户项目来说可能是一个引起混乱的变更:

* 在 `iosMain` 源代码集中使用的所有依赖项必须支持 `iosSimulatorArm64` 编译目标; 否则, 依赖项解析会失败.
* 在添加新的编译目标时 (尽管对于 `iosSimulatorArm64` 的情况, 这不太可能), `iosMain` 中使用的一些原生 API 可能会消失.
* 某些情况下, 例如, 在你的基于 Intel 的 MacBook 上编写一个小的玩具项目的时候, 你可能根本不需要这个变更.

很明显, 简写并不能解决层级结构配置的问题, 所以我们在某个时候停止添加新的简写.

初看起来, 默认的编译目标层级结构可能与简写很类似,
但它们有一个关键的区别: **用户必须明确指定编译目标集**.
这个编译目标集定义你的项目如何编译, 如何发布, 如何参与依赖项解析.
由于这个编译目标集是固定的, Kotlin Gradle plugin 对默认配置的变更, 对于生态系统造成的影响应该会显著减少,
并且提供工具辅助的迁移将会更加容易.

#### 如何启用默认的层级结构

这个新功能是 [实验性功能](components-stability.md#stability-levels-explained).
对于 Kotlin Gradle 构建脚本,
你需要使用 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 标注使用者同意(Opt-in).

更多详情请参见 [层级项目结构](multiplatform-hierarchy.md#default-hierarchy-template).

#### 留下你的反馈意见

这是跨平台项目的重大变更. 希望你能提供你的 [反馈意见](https://kotl.in/issue), 帮助然它变得更好.

### Kotlin Multiplatform 中支持 Gradle 复合构建(composite build) (预览版) {id="preview-of-gradle-composite-builds-support-in-kotlin-multiplatform"}

> 从 Kotlin Gradle Plugin 1.8.20 开始, 在 Gradle 构建中支持这个功能.
> 对于 IDE 支持, 请使用 IntelliJ IDEA 2023.1 Beta 2 (231.8109.2) 或更高版本,
> 以及 Kotlin Gradle plugin 1.8.20, 与任何版本的 Kotlin IDE plugin 一起使用.
>
{style="note"}

从 1.8.20 开始, Kotlin Multiplatform 支持 [Gradle 复合构建(composite build)](https://docs.gradle.org/current/userguide/composite_builds.html).
复合构建允许你将其他项目的构建, 或同一项目的其它部分的构建, 包含到单个构建中.

由于一些技术困难, 对 Kotlin Multiplatform 使用 Gradle 符合构建还只有部分的支持.
Kotlin 1.8.20 包含了对复合构建支持的改进(预览版), 应该能够适用于更多种类的项目.
要试用这个功能, 请向你的 `gradle.properties` 添加以下选项:

```none
kotlin.mpp.import.enableKgpDependencyResolution=true
```

这个选项会启用新的导入模式的预览版.
除了支持复合构建, 它还提供了跨平台项目中更流畅的导入体验,
因为我们包含了一些重大的 Bug 修复和改进, 使得导入功能更加稳定.

#### 已知的问题

这个功能仍然是预览版, 需要继续改进稳定性, 在此过程中你可能遇到一些与导入相关的问题.
下面是一些已知的问题, 我们计划在 Kotlin 1.8.20 最终发布之前修复:

* 对于 IntelliJ IDEA 2023.1 EAP 目前还没有 Kotlin 1.8.20 plugin 可用.
  尽管如此, 你还是可以将 Kotlin Gradle plugin 版本设置为 1.8.20-RC2, 在这个 IDE 中试用复合构建.
* 如果你的项目包含指定了 `rootProject.name` 的构建, 复合构建可能会无法解析 Kotlin metadata.
  关于这个问题的详细情况, 以及变通方法, 请参见这个 [Youtrack issue](https://youtrack.jetbrains.com/issue/KT-56536).

我们鼓励你试用这个功能, 并提交报告到 [YouTrack](https://kotl.in/issue), 帮助我们, 让这个功能在 Kotlin 1.9.0 中默认启用.

### Xcode 中 Gradle 错误信息的改进 {id="improved-output-for-gradle-errors-in-xcode"}

如果在 Xcode 中构建你的跨平台项目时遇到问题, 你可能看到 "Command PhaseScriptExecution failed with a nonzero exit code" 错误信息.
这个错误信息表示 Gradle 调用失败了, 但要调查问题的原因, 这个错误信息就没什么帮助.

从 Kotlin 1.8.20 开始, Xcode 能够解析 Kotlin/Native 编译器的输出.
而且, 对于 Gradle 构建失败的情况, 你会在 Xcode 中看到来自根本原因异常的附加错误信息.
大多数情况下, 这些信息能够帮助你找到根本问题.

![Xcode 中 Gradle 错误信息的改进](xcode-gradle-output.png){width=700}

对用于 Xcode 集成的标准 Gradle task, 这个新行为默认启用,
例如 `embedAndSignAppleFrameworkForXcode`, 它能够将 iOS 框架从你的跨平台应用程序连接到 Xcode 中的 iOS 应用程序.
也可以使用 `kotlin.native.useXcodeMessageStyle` Gradle 属性来启用 (或关闭).

## Kotlin/JavaScript

Kotlin 1.8.20 修改了 TypeScript 定义的生成方式. 还包含了一个变更, 改善你的调试体验:

* [从 Gradle plugin 中删除 Dukat 集成](#removal-of-dukat-integration-from-gradle-plugin)
* [代码映射(Source Map) 中的 Kotlin 变量和函数名称](#kotlin-variable-and-function-names-in-source-maps)
* [TypeScript 定义文件生成的使用者同意](#opt-in-for-generation-of-typescript-definition-files)

### 从 Gradle plugin 中删除 Dukat 集成 {id="removal-of-dukat-integration-from-gradle-plugin"}

在 Kotlin 1.8.20 中, 我们从 Kotlin/JavaScript Gradle plugin 中删除了
[实验性的](components-stability.md#stability-levels-explained) Dukat 集成功能.
Dukat 集成功能支持从 TypeScript 声明文件 (`.d.ts`) 到 Kotlin 外部声明的自动转换.

你仍然可以使用我们的 [Dukat 工具](https://github.com/Kotlin/dukat), 将 TypeScript 声明文件 (`.d.ts`) 转换为 Kotlin 外部声明.

> Dukat 工具是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
>
{style="warning"}

### 代码映射(Source Map) 中的 Kotlin 变量和函数名称 {id="kotlin-variable-and-function-names-in-source-maps"}

为了帮助调试, 我们引入了一种功能, 能够向你的代码映射(Source Map)添加你在 Kotlin 代码中声明的变量和函数的名称.
在 1.8.20 之前, 这些名称在代码映射(Source Map)中是不可用的, 因此在调试器中, 你看到的是生成的 JavaScript 的变量和函数名称.

你可以在你的 Gradle 文件 `build.gradle.kts` 中使用 `sourceMapNamesPolicy` 来配置添加哪些名称, 也可以使用编译器选项 `-source-map-names-policy`.
下表是可用的设置:

| 设置                      | 说明                    | 输出示例                              |
|-------------------------|-----------------------|-----------------------------------|
| `simple-names`          | 添加变量名称和函数的简单名称. (默认值) | `main`                            |
| `fully-qualified-names` | 添加变量名称和函数的完全限定名称.     | `com.example.kjs.playground.main` |
| `no`                    | 不添加变量名称和函数名称.         | 无                                 |

下面是在 `build.gradle.kts` 文件中配置的示例:

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.Kotlin2JsCompile>().configureEach {
    compilercompileOptions.sourceMapNamesPolicy.set(org.jetbrains.kotlin.gradle.dsl.JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES) // 或 SOURCE_MAP_NAMES_POLICY_NO, or SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES
}
```
{validate="false"}

调试工具, 例如基于 Chromium 的浏览器中提供的调试工具, 能够从你的代码映射中获取原始的 Kotlin 名称, 改进你的调用栈的可读性.
祝你调试快乐!

> 在代码映射中添加变量和函数名称是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
>
{style="warning"}

### TypeScript 定义文件生成的使用者同意 {id="opt-in-for-generation-of-typescript-definition-files"}

以前, 如果你的项目生成可执行的文件 (`binaries.executable()`), Kotlin/JS IR 编译器会收集所有标注了 `@JsExport` 的顶级声明,
并自动在一个 `.d.ts` 文件中生成 TypeScript 定义.

由于这个功能并不是对每个项目都有用, 在 Kotlin 1.8.20 中我们修改了这个行为.
如果你想要生成 TypeScript 定义, 你需要在你的 Gradle 构建文件中明确的配置.
向你的 `build.gradle.kts.file` 文件的 [`js` 小节](js-project-setup.md#execution-environments) 添加 `generateTypeScriptDefinitions()`.
例如:

```kotlin
kotlin {
    js {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```
{validate="false"}

> TypeScript 定义 (`d.ts`) 的生成是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
>
{style="warning"}

## Gradle

除 [Multiplatform plugin 中的一些特殊情况](https://youtrack.jetbrains.com/issue/KT-55751) 外, Kotlin 1.8.20 与 Gradle 6.8 到 7.6 完全兼容.
你也可以使用最新的 Gradle 版本,
但如果你这样做, 请注意, 你可能遇到废弃警告, 或一些新的 Gradle 功能无法工作.

这个发布版带来了以下变更:

* [新的 Gradle plugin 版本对齐方式](#new-gradle-plugins-versions-alignment)
* [Gradle 中默认启用新的 JVM 增量编译](#new-jvm-incremental-compilation-by-default-in-gradle)
* [对编译任务的输出的精确备份](#precise-backup-of-compilation-tasks-outputs)
* [对所有 Gradle 版本, 延迟创建 Kotlin/JVM 任务](#lazy-kotlin-jvm-tasks-creation-for-all-gradle-versions)
* [处理编译任务的输出目录不是默认位置的情况](#non-default-location-of-compile-tasks-destinationdirectory)
* [能够选择性禁用(opt out)向 HTTP 统计服务报告编译器参数的功能](#ability-to-opt-out-from-reporting-compiler-arguments-to-an-http-statistics-service)

### 新的 Gradle plugin 版本对齐方式 {id="new-gradle-plugins-versions-alignment"}

Gradle 提供了一种方式, 保证那些需要一起工作的依赖项能够 [对齐它们的版本](https://docs.gradle.org/current/userguide/dependency_version_alignment.html#aligning_versions_natively_with_gradle).
Kotlin 1.8.20 也采用了这个方案.
这个功能默认启用, 因此你不需要修改或更新你的配置来启用它.
此外, 你不再需要 [使用这个变通方法来解析 Kotlin Gradle plugin 的传递依赖项](whatsnew18.md#resolution-of-kotlin-gradle-plugins-transitive-dependencies).

希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-54691) 提供你的反馈意见.

### Gradle 中默认启用新的 JVM 增量编译 {id="new-jvm-incremental-compilation-by-default-in-gradle"}

增量编译的新方案, [从 Kotlin 1.7.0 开始可以使用](whatsnew17.md#a-new-approach-to-incremental-compilation),
现在变为默认使用.
你不再需要在你的 `gradle.properties` 中指定 `kotlin.incremental.useClasspathSnapshot=true` 来启用它.

希望你能提供你的反馈意见. 你可以在 YouTrack 中 [提交一个 issue](https://kotl.in/issue).

### 对编译任务的输出的精确备份 {id="precise-backup-of-compilation-tasks-outputs"}

> 对编译任务的输出的精确备份是 [实验性功能](components-stability.md#stability-levels-explained).
> 要使用这个功能, 请向 `gradle.properties` 添加 `kotlin.compiler.preciseCompilationResultsBackup=true`.
> 希望你能通过 [YouTrack](https://kotl.in/issue/experimental-ic-optimizations) 提供你的反馈意见.
>
{style="warning"}

从 Kotlin 1.8.20 开始, 你可以启用精确备份,
这时只有 Kotlin 在 [增量编译](gradle-compilation-and-caches.md#incremental-compilation) 中重新编译的那些类会被备份.
完整备份和精确备份都可以帮助在发生编译错误后再次运行增量构建.
精确备份与完整备份相比, 会耗费较少的构建时间.
对于大型的项目, 或者很多任务都创建备份, 那么完整备份可能会花费 **明显** 更长的构建时间, 尤其是如果项目位于速度较慢的 HDD 上.

这个优化是实验性功能.
要启用这个功能, 请向 `gradle.properties` 文件添加 `kotlin.compiler.preciseCompilationResultsBackup` Gradle 属性:

```none
kotlin.compiler.preciseCompilationResultsBackup=true
```

#### JetBrains 使用精确备份的例子

在下面的图表中, 你可以看到使用精确备份与完整备份相对比的示例:

![完整备份与精确备份的对比](comparison-of-full-and-precise-backups.png){width=700}

第一个和第二个对比图显示了在 Kotlin 项目中使用精确备份时对 Kotlin Gradle plugin 构建的影响:

1. 进行一个小的 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 变更之后:
   向一个被大量模块依赖的模块添加一个新的 public 方法.
2. 进行一个小的非 ABI 变更之后:
   向一个没有被其他模块依赖的模块添加一个 private 函数.

第三个对比图显示了在 [Space](https://www.jetbrains.com/space/) 项目中使用精确备份时, 在小的非 ABI 更改后对 Web 前端构建的影响:
向一个被大量模块依赖的 Kotlin/JS 模块添加一个 private 函数.

我们在使用 Apple M1 Max CPU 的计算机上进行这些测量; 在不同的计算机上会出现稍微不同的结果.
影响性能的因素包括但不限于以下几点:

* [Kotlin daemon](gradle-compilation-and-caches.md#the-kotlin-daemon-and-how-to-use-it-with-gradle) 和
  [Gradle daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html) 热身状况(warm)如何..
* 硬盘速度如何.
* CPU 型号, 以及它的繁忙程度.
* 哪些模块受到变更的影响, 以及这些模块有多大.
* 是 ABI 变更还是非 ABI 变更.

#### 使用构建报告来评估优化

要对你的项目和场景, 评估优化在你的计算机上的影响, 你可以使用 [Kotlin 构建报告](gradle-compilation-and-caches.md#build-reports).
请向你的 `gradle.properties` 文件添加下面的属性, 启用文本文件格式的构建报告:

```none
kotlin.build.report.output=file
```

下面是在启用精确备份之前, 构建报告的相关部分的示例:

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.59 s
<...>
Time metrics:
 Total Gradle task time: 0.59 s
 Task action before worker execution: 0.24 s
  Backup output: 0.22 s // 注意这个数字
<...>
```

下面是在启用精确备份之后, 构建报告的相关部分的示例:

```none
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.46 s
<...>
Time metrics:
 Total Gradle task time: 0.46 s
 Task action before worker execution: 0.07 s
  Backup output: 0.05 s // 备份消耗的时间减少了
 Run compilation in Gradle worker: 0.32 s
  Clear jar cache: 0.00 s
  Precise backup output: 0.00 s // 与精确备份相关的输出
  Cleaning up the backup stash: 0.00 s // 与精确备份相关的输出
<...>
```

### 对所有 Gradle 版本, 延迟创建 Kotlin/JVM 任务 {id="lazy-kotlin-jvm-tasks-creation-for-all-gradle-versions"}

对于在 Gradle 7.3+ 中使用了 `org.jetbrains.kotlin.gradle.jvm` plugin 的项目,
Kotlin Gradle plugin 不会过早的创建和配置 `compileKotlin` 任务.
在更低版本的 Gradle 中, 它只是简单的注册所有任务, 不会在空运行(dry run)阶段配置任务.
在使用 Gradle 7.3+ 时, 现在也会是相同的行为.

### 处理编译任务的输出目录不是默认位置的情况 {id="non-default-location-of-compile-tasks-destinationdirectory"}

如果你有下面的设置, 那么请更新你的构建脚本, 添加一些新的设置:

* 覆盖了 Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile` 任务的 `destinationDirectory` 位置.
* 使用了废弃的 Kotlin/JS/非 IR [变体(variant)](gradle-plugin-variants.md), 并覆盖了 `Kotlin2JsCompile`
  任务的 `destinationDirectory`.

在你的 JAR 文件中, 除 `sourceSets.main.outputs` 之外, 你需要明确的添加 `sourceSets.main.kotlin.classesDirectories`  :

```
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

### 能够选择性禁用(opt out)向 HTTP 统计服务报告编译器参数的功能 {id="ability-to-opt-out-from-reporting-compiler-arguments-to-an-http-statistics-service"}

现在你可以控制 Kotlin Gradle plugin 是否应该在 HTTP [构建报告](gradle-compilation-and-caches.md#build-reports) 中包含编译器参数.
有些时候, 你可能不需要让 plugin 报告这些参数.
如果一个项目包含很多模块, 它在报告中的的编译器参数 可能非常多, 而且没什么用处.
现在有一种方法能够关闭这个信息, 并节省内存.
请在你的 `gradle.properties` 或 `local.properties` 文件中, 使用 `kotlin.build.report.include_compiler_arguments=(true|false)` 属性.

希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55323/) 提供你的反馈意见.

## 标准库

Kotlin 1.8.20 添加了很多新的功能, 包括一些对 Kotlin/Native 开发非常有用的功能:

* [支持 AutoCloseable 接口](#support-for-the-autocloseable-interface)
* [支持 Base64 编码和解码](#support-for-base64-encoding)
* [在 Kotlin/Native 中支持 @Volatile](#support-for-volatile-in-kotlin-native)
* [在 Kotlin/Native 中使用正规表达式时堆栈溢出问题的重大修正](#bug-fix-for-stack-overflow-when-using-regex-in-kotlin-native)

### 支持 AutoCloseable 接口 {id="support-for-the-autocloseable-interface"}

> 新的 `AutoCloseable` 接口是 [实验性功能](components-stability.md#stability-levels-explained),
> 要使用它, 你需要通过 `@OptIn(ExperimentalStdlibApi::class)` 标注使用者同意(Opt-in),
> 或通过编译器参数 `-opt-in=kotlin.ExperimentalStdlibApi`.
>
{style="warning"}

`AutoCloseable` 接口已经添加到了共通的标准库, 因此你可以对所有的库使用共通的接口来关闭资源.
在 Kotlin/JVM 中, `AutoCloseable` 接口是 [`java.lang.AutoClosable`](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html) 的别名(alias).

此外, 还包含了扩展函数 `use()`, 它会对一个指定的资源执行一个给定的函数块, 然后正确的关闭这个资源, 无论函数块执行过程中是否抛出了异常.

在共通的标准库中没有实现 `AutoCloseable` 接口的 public 类.
在下面的示例中, 我们定义了一个 `XMLWriter` 接口, 假设有一个资源实现了这个接口.
例如, 这个资源可以是一个类, 它打开文件, 写入 XML 内容, 然后关闭文件.

```kotlin
interface XMLWriter : AutoCloseable {
    fun document(encoding: String, version: String, content: XMLWriter.() -> Unit)
    fun element(name: String, content: XMLWriter.() -> Unit)
    fun attribute(name: String, value: String)
    fun text(value: String)
}

fun writeBooksTo(writer: XMLWriter) {
    writer.use { xml ->
        xml.document(encoding = "UTF-8", version = "1.0") {
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
{validate="false"}

### 支持 Base64 编码 {id="support-for-base64-encoding"}

> 新的编码和解码功能是 [实验性功能](components-stability.md#stability-levels-explained),
> 要使用它, 你需要通过 `@OptIn(ExperimentalEncodingApi::class)` 标注使用者同意(Opt-in),
> 或通过编译器参数 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi`.
>
{style="warning"}

我们添加了 Base64 编码和解码的支持. 我们提供了 3 个类实例, 每个使用不同的编码方案, 并表现出不同的行为.
对于标准的 [Base64 编码方案](https://www.rfc-editor.org/rfc/rfc4648#section-4), 请使用 `Base64.Default` 实例.

对于 ["URL 和文件名安全的"](https://www.rfc-editor.org/rfc/rfc4648#section-5) 编码方案, 请使用 `Base64.UrlSafe` 实例.

对于 [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 编码方案, 请使用 `Base64.Mime` 实例.
如果你使用 `Base64.Mime` 实例, 所有的编码函数会对每 76 个字符插入 1 个行分隔符.
对于解码的情况, 所有的非法字符会被跳过, 不抛出异常.

> `Base64.Default` 实例 `Base64` 类的是伴随对象.
> 因此, 你可以通过 `Base64.encode()` 和 `Base64.decode()` 的方式调用它的函数,
> 而不必写为 `Base64.Default.encode()` 和 `Base64.Default.decode()`.
>
{style="tip"}

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // 结果为 "Zm8="
// 也可以写为:
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // 结果为 "Zm9vYmFy"

Base64.Default.decode("Zm8=") // 结果等于 foBytes
// 也可以写为:
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // 结果等于 foobarBytes
```
{validate="false"}

你可以使用其它函数编码或解码字节, 结果输出到已经存在的缓冲区, 或者将结果添加到指定的 `Appendable` 类型对象.

在 Kotlin/JVM 中, 我们还添加了扩展函数 `encodingWith()` 和 `decodingWith()`,
可以对输入和输出流执行 Base64 编码和解码操作.

### 在 Kotlin/Native 中支持 @Volatile {id="support-for-volatile-in-kotlin-native"}

> Kotlin/Native 中的 `@Volatile` 是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文).
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过 [YouTrack](https://kotl.in/issue) 提供你的反馈意见.
>
{style="warning"}

如果你使用 `@Volatile` 注解标注一个 `var` 属性, 那么它的后端域变量(Backing Field) 会被标注这个注解,
使得对这个域变量的所有读写操作都是原子化的, 而且写入操作永远对其它线程可见.

在 1.8.20 之前, [`kotlin.jvm.Volatile` 注解](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)
存在于在共通标准库中. 但是, 这个注解只对 JVM 有效.
如果你在 Kotlin/Native 中使用它, 它会被忽略, 因此导致错误.

在 1.8.20 中, 我们引入了一个共通的注解, `kotlin.concurrent.Volatile`, 你可以在 JVM 和 Kotlin/Native 中使用.

#### 如何启用

要试用这个功能, 请使用 `@OptIn(ExperimentalStdlibApi)` 标注使用者同意(Opt-in),
并启用 `-language-version 1.9` 编译器选项.
在 Gradle 项目中, 你可以在你的 `build.gradle(.kts)` 文件中添加以下内容:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
}
```

</tab>
</tabs>

### 在 Kotlin/Native 中使用正规表达式时堆栈溢出问题的重大修正 {id="bug-fix-for-stack-overflow-when-using-regex-in-kotlin-native"}

以前 Kotlin 的版本中, 如果你的正规表达式的输入包含了大量的字符, 可能会发生崩溃, 即使正规表达式模式本身非常简单.
在 1.8.20 中, 已经解决了这个问题.
更多详情, 请参见 [KT-46211](https://youtrack.jetbrains.com/issue/KT-46211).

## 序列化的更新

Kotlin 1.8.20 包含 [对 Kotlin K2 编译器的 Alpha 支持](#prototype-serialization-compiler-plugin-for-kotlin-k2-compiler),
以及 [禁止通过伴随对象定制序列化器](#prohibit-implicit-serializer-customization-via-companion-object).

### 对 Kotlin K2 编译器的序列化编译器 plugin (Prototype) {id="prototype-serialization-compiler-plugin-for-kotlin-k2-compiler"}

> 对 K2 的序列化编译器 plugin 支持处于 [Alpha 阶段](components-stability.md#stability-levels-explained).
> 要使用它, 请 [启用 Kotlin K2 编译器](#how-to-enable-the-kotlin-k2-compiler).
>
{style="warning"}

从 1.8.20 开始, 序列化编译器 plugin 可以与 Kotlin K2 编译器一起使用.
请试用它, 并 [向我们提供你的反馈意见](#leave-your-feedback-on-the-new-k2-compiler)!

### 禁止通过伴随对象隐含的定制序列化器 {id="prohibit-implicit-serializer-customization-via-companion-object"}

目前, 可以使用 `@Serializable` 注解将一个类声明为可序列化,
同时还可以在它的伴随对象上, 使用 `@Serializer` 注解声明一个自定义的序列化器.

例如:

```kotlin
import kotlinx.serialization.*

@Serializable
class Foo(val a: Int) {
    @Serializer(Foo::class)
    companion object {
        // KSerializer<Foo> 的自定义实现
    }
}
```

这种情况下, 从 `@Serializable` 注解无法看出使用了哪个序列化器.
实际上, `Foo` 类存在一个自定义的序列化器.

为了防止这种混乱, 在 Kotlin 1.8.20 中, 在检测到这种情况时, 我们引入了一个编译器警告.
警告信息中包含一个可能的迁移方案来解决这个问题.

如果你在你的代码中使用了这样的结构, 我们建议修改如下:

```kotlin
import kotlinx.serialization.*

@Serializable(Foo.Companion::class)
class Foo(val a: Int) {
    // 无论是是否标注 @Serializer(Foo::class), 都会起作用
    companion object: KSerializer<Foo> {
        // KSerializer<Foo> 的自定义实现
    }
}
```

如果这个方案, 可以很清楚的看到, `Foo` 类使用了伴随对象中声明的自定义的序列化器.
更多详情, 请参见我们的 [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-54441).

> 在 Kotlin 2.0 中, 我们计划将编译警告升级为编译错误.
> 如果你看到这个警告, 我们建议你迁移你的代码.
>
{style="tip"}

## 文档更新

Kotlin 文档有了一些重要变更:

* [Spring Boot 和 Kotlin 入门](jvm-get-started-spring-boot.md) –
  创建一个使用数据库的简单的应用程序, 详细了解 Spring Boot 和 Kotlin 的功能.
* [作用域函数(Scope Function)](scope-functions.md) –
  了解如何使用标准库中有用的作用域函数来简化代码.
* [CocoaPods 集成](native-cocoapods.md) – 设置使用 CocoaPods 的环境.

## 安装 Kotlin 1.8.20

### 检查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.2 和 2022.3 会自动建议将 Kotlin plugin 更新到 1.8.20.
IntelliJ IDEA 2023.1 会包含 Kotlin plugin 1.8.20.

Android Studio Flamingo (222) 和 Giraffe (223) 会在后续的发布版中支持 Kotlin 1.8.20.

新的命令行编译器可以通过 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.8.20) 下载.

### 配置 Gradle 的设置 {id="configure-gradle-settings"}

要正确下载 Kotlin 的 artifact 和依赖项, 请更新你的 `settings.gradle(.kts)` 文件, 使用 Maven Central 仓库:

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

如果没有指定仓库, Gradle 会使用已废弃的 JCenter 仓库, 导致无法下载 Kotlin artifact 的错误.
