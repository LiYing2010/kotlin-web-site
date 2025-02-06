[//]: # (title: Kotlin Multiplatform 项目结构的基础知识)

使用 Kotlin Multiplatform, 你可以在不同的平台之间共用代码.
本文解释共用代码的限制, 如何区分代码的共用部分和平台相关部分, 以及如何指定这些共用代码运行的平台.

你还会了解 Kotlin Multiplatform 项目设置的核心概念, 例如共通代码, 编译目标, 平台相关的源代码集和中间源代码集, 以及测试集成.
这些知识将会帮助你将来设置你的跨平台项目.

与 Kotlin 真正使用的模型相比, 本文使用的是简化后的模型.
但是, 这个基本模型应该可以适用于大多数情况.

## 共通代码(Common Code) {id="common-code"}

_共通代码(Common Code)_ 是在不同平台之间共用的 Kotlin 代码.

考虑一个简单的 "Hello, World" 示例程序:

```kotlin
fun greeting() {
    println("Hello, Kotlin Multiplatform!")
}
```

在平台之间共用的 Kotlin 代码通常位于 `commonMain` 目录中.
代码文件的位置是很重要的, 它会影响到这些代码编译到哪些平台.

Kotlin 编译器以源代码作为输入, 生成一组平台相关的二进制文件作为结果.
在编译跨平台项目时, 它可以从相同的代码生成多个二进制文件.
例如, 编译器可以从相同的 Kotlin 文件生成 JVM 的 `.class` 文件, 以及原生的可执行文件:

![共通代码](common-code-diagram.svg){width=700}

并不是每一段 Kotlin 代码都能够编译到所有的平台.
Kotlin 编译器会阻止你在共用代码中使用平台相关的函数或类, 因为这样的代码不能编译到不同的平台.

例如, 你不能在共通代码中使用 `java.io.File` 依赖项.
它是 JDK 的一部分, 而共通代码还会被编译为原生代码, 这种情况下就不能使用 JDK 的类:

![未能解析的 Java 引用](unresolved-java-reference.png){width=500}

在共通代码中, 你可以使用 Kotlin Multiplatform 库.
这些库提供了共通的 API, 在不同的平台上有不同的实现.
这种情况下, 还提供了额外的平台相关的 API, 在共通代码中使用这样的 API 会导致错误.

例如, `kotlinx.coroutines` 是一个 Kotlin Multiplatform 库, 支持所有的编译目标,
但它还有一个平台相关的部分, 将 `kotlinx.coroutines` 的并发原语转换为 JDK 的并发原语,
例如 `fun CoroutinesDispatcher.asExecutor(): Executor`.
API 的这些附加部分不能在 `commonMain` 中使用.

## 编译目标(Target) {id="targets"}

编译目标(Target) 定义 Kotlin 将共通代码编译到的目标平台.
这些平台可以是, 例如, JVM, JS, Android, iOS, 或 Linux.
上面的示例程序会将共通代码编译到 JVM 和原生平台.

一个 _Kotlin 编译目标_ 是一个标识符, 描述一个编译的目标平台.
它定义生成的二进制文件格式, 可以使用的语言结构, 以及允许使用的依赖项.

> 编译目标也可以叫做目标平台.
> 参见完整的 [支持的编译目标列表](multiplatform-dsl-reference.md#targets).
>
{style="note"}

你应该首先 _声明_ 一个编译目标, 指示 Kotlin 为这个特定的目标平台编译代码.
在 Gradle 中, 你可以在 `kotlin {}` 代码段内使用预定义的 DSL 调用来声明编译目标:

```kotlin
kotlin {
    jvm() // 声明 JVM 编译目标
    iosArm64() // 声明对应于 64-bit iPhones 的编译目标
}
```

通过这种方式, 每个跨平台项目定义一组支持的编译目标.
参见 [层级项目结构](multiplatform-hierarchy.md) 章节, 进一步了解如何在你的构建脚本中声明编译目标.

声明 `jvm` 和 `iosArm64` 编译目标之后, `commonMain` 中的共通代码将被编译到这些目标平台:

![编译目标](target-diagram.svg){width=700}

要理解哪部分代码会被编译到特定的平台, 你可以将编译目标看作附加在 Kotlin 源代码文件上的标签.
Kotlin 使用这些标签来决定如何编译你的代码, 生成哪个二进制文件, 以及代码中允许使用哪些语言结构和依赖项.

如果你还想将 `greeting.kt` 文件编译到 `.js`, 你只需要声明 JS 编译目标.
`commonMain` 中的代码就会得到新的 `js` 标签, 对应于 JS 编译目标, 它会指示 Kotlin 生成 `.js` 文件:

![编译目标标签](target-labels-diagram.svg){width=700}

这就是 Kotlin 编译器处理共通代码的方式, 共通代码会编译到所有声明的编译目标.
参见 [源代码集](#source-sets), 进一步了解如何编写平台相关的代码.

## 源代码集(Source Set) {id="source-sets"}

一个 _Kotlin 源代码集(Source Set)_ 是一组源代码文件, 有它独自的编译目标, 依赖项, 以及编译器选项.
它是在跨平台项目中共用代码的主要方式.

在一个跨平台项目中, 每个源代码集:

* 有一个项目中唯一的名称.
* 包含一组源代码文件和资源, 通常保存在与源代码集同名的目录中.
* 指定一组编译目标, 表示这个源代码集中的代码会编译到哪些目标平台.
  这些编译目标会影响到, 这个源代码集中可以使用哪些语言结构和依赖项.
* 定义它自己的依赖项和编译器选项.

Kotlin 提供了一组预定义的源代码集.
其中一个是 `commonMain`, 它出现在所有的跨平台项目中, 并被编译到所有声明的编译目标.

在 Kotlin Multiplatform 项目中, 你可以将源代码集当作 `src` 中的目标.
例如, 一个项目有 `commonMain`, `iosMain`, 和 `jvmMain` 源代码集, 它的结构如下:

![共用的代码](src-directory-diagram.png){width=350}

在 Gradle 脚本中, 你可以在 `kotlin.sourceSets {}` 代码段中通过名称访问源代码集:

```kotlin
kotlin {
    // 编译目标声明:
    // ...

    // 源代码集声明:
    sourceSets {
        commonMain {
            // 配置 commonMain 源代码集
        }
    }
}
```

除 `commonMain` 之外, 其他源代码集可以使平台相关的源代码集, 也可以是中间源代码集.

### 平台相关的源代码集 {id="platform-specific-source-sets"}

如果只有共通代码, 那将会非常便利, 但并不总是可行的.
`commonMain` 中的代码会编译到所有声明的编译目标, 而 Kotlin 不允许你在共通代码中使用任何平台相关的 API.

在一个带有原生和 JS 编译目标的跨平台项目中, `commonMain` 中的以下代码将无法编译:

```kotlin
// commonMain/kotlin/common.kt
// 在共通代码中无法编译
fun greeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

解决方案是, Kotlin 创建平台相关的源代码集, 也叫做平台源代码集.
每个编译目标有一个对应的平台源代码集, 这个源代码集只编译到这个编译目标.
例如, `jvm` 编译目标有对应的 `jvmMain` 源代码集, 这个源代码集只编译到 JVM.
Kotlin 允许在这些源代码集中使用平台相关的依赖项, 例如, 在 `jvmMain` 中可以使用 JDK:

```kotlin
// jvmMain/kotlin/jvm.kt
// 你可以在 `jvmMain` 源代码集中使用 Java 依赖项
fun jvmGreeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

### 编译到特定的编译目标 {id="compilation-to-a-specific-target"}

编译到特定的编译目标适用于多个源代码集.
当 Kotlin 将一个跨平台项目编译到一个特定的编译目标时, 它会收集带有这个编译目标标签的所有源代码集, 并从这些源代码集生成二进制文件.

例如, 假设有 `jvm`, `iosArm64`, 和 `js` 编译目标.
Kotlin 为共通代码创建 `commonMain` 源代码集, 并为特点的编译目标创建对应的 `jvmMain`, `iosArm64Main`, 和 `jsMain` 源代码集:

![编译到指定的编译目标](specific-target-diagram.svg){width=700}

编译到 JVM 时, Kotlin 会选择带有 "JVM" 标签的所有源代码集, 也就是, `jvmMain` 和 `commonMain`.
然后它将这些源代码集一起编译为 JVM class 文件:

![编译到 JVM](compilation-jvm-diagram.svg){width=700}

由于 Kotlin 将 `commonMain` 和 `jvmMain` 一起编译, 产生的结果二进制文件会包含来自 `commonMain` 和 `jvmMain` 的全部声明.

在开发跨平台项目时, 要记住:

* 如果你希望 Kotlin 将代码编译到特定的平台, 请声明相应的编译目标.
* 要选择一个目录或源代码文件来保存代码, 首先要决定你想在哪些编译目标之间共用你的代码:
    * 如果代码要在所有的编译目标之间共用, 那么它应该在 `commonMain` 中声明.
    * 如果代码只供一个编译目标使用, 那么它应该这个编译目标的平台源代码集在中定义(例如, 用于 JVM 平台的 `jvmMain` 源代码集).
* 在平台相关的源代码集中编写的代码, 可以访问共通源代码集中的声明.
  例如, `jvmMain` 中的代码可以使用 `commonMain` 的代码. 但是, 反过来不行: `commonMain` 不能使用 `jvmMain` 中的代码.
* 在平台相关的源代码集中编写的代码, 可以使用对应的平台依赖项.
  例如, `jvmMain` 中的代码可以使用 Java 专用的库, 例如 [Guava](https://github.com/google/guava)
  或 [Spring](https://spring.io/).

### 中间源代码集 {id="intermediate-source-sets"}

简单的跨平台项目通常只有共通代码和平台相关的代码.
`commonMain` 源代码集代表共通代码, 在所有声明的编译目标之间共用.
平台相关的源代码集, 例如 `jvmMain`, 代表平台相关的代码, 只编译到各自的编译目标.

在实践中, 你经常会需要更加细粒度的代码共用.

考虑一个例子, 你需要编译到所有现代的 Apple 设备和 Android 设备:

```kotlin
kotlin {
    androidTarget()
    iosArm64()   // 64 位 iPhone 设备
    macosArm64() // 现代的基于 Apple Silicon 的 Macs
    watchosX64() // 现代的 64 位 Apple Watch 设备
    tvosArm64()  // 现代的 Apple TV 设备
}
```

而且你需要一个源代码集, 用来添加一个函数, 为所有的 Apple 设备生成 UUID:

```kotlin
import platform.Foundation.NSUUID

fun randomUuidString(): String {
    // 你希望访问 Apple 专用的 API
    return NSUUID().UUIDString()
}
```

你不能将这个函数添加到 `commonMain`.
`commonMain` 会编译到所有声明的编译目标, 包括 Android, 但 `platform.Foundation.NSUUID` 是一个 Apple 专用的 API, 在 Android 上无法使用.
如果你想要在 `commonMain` 中访问 `NSUUID`, Kotlin 会提示错误.

你可以将这段代码复制粘贴到每个 Apple 相关的源代码集: `iosArm64Main`, `macosArm64Main`, `watchosX64Main`, 和 `tvosArm64Main`.
但不推荐这样的方法, 因为这种重复的代码很容易导致错误.

为了解决这个问题, 你可以使用 _中间源代码集_.
中间源代码集是一个 Kotlin 源代码集, 它会编译到项目中的一部分编译目标, 但不是全部的编译目标.
你还会看到, 中间源代码集又叫做层级源代码集, 或者直接简称层级.

Kotlin 默认创建一些中间源代码集.
在这个具体案例中, 最终的项目结构类似这样:

![中间源代码集](intermediate-source-sets-diagram.svg){width=700}

其中, 下方的彩色方块是平台相关的源代码集. 为了清晰起见, 省略了编译目标的标签.

`appleMain` 方块是 Kotlin 创建的一个中间源代码集, 用于共用那些编译到 Apple 相关编译目标的代码.
`appleMain` 源代码集只编译到 Apple 编译目标.
因此, Kotlin 允许在 `appleMain` 中使用 Apple 专用的 API, 你可以将 `randomUUID()` 函数添加在这里.

> 参见 [层级项目结构](multiplatform-hierarchy.md), 在这里可以看到 Kotlin 默认创建和设置的所有中间源代码集,
> 并了解, 如果 Kotlin 没有默认提供你需要的中间源代码集, 应该如何处理.
>
{style="tip"}

在编译到特定的编译目标时, Kotlin 会得到所有的源代码集, 包括带有这个编译目标标签的中间源代码集.
因此, 在编译到 `iosArm64` 目标平台时, `commonMain`, `appleMain`, 和 `iosArm64Main` 源代码集中编写的所有代码会组合到一起:

![原生可执行文件](native-executables-diagram.svg){width=700}

> 如果一部分源代码集中没有源代码也是可以的. 例如, 在 iOS 开发中, 通常不需要提供专用于 iOS 设备但不用于 iOS 模拟器的代码.
> 因此 `iosArm64Main` 很少需要用到.
>
{style="tip"}

#### Apple 设备与模拟器的编译目标 {id="apple-device-and-simulator-targets" initial-collapse-state="collapsed" collapsible="true"}

如果你使用 Kotlin Multiplatform 开发 iOS 移动应用程序, 你通常会使用 `iosMain` 源代码集.
你可能会认为它是一个平台相关的源代码集, 用于 `ios` 编译目标, 但其实并没有单独的 `ios` 编译目标.
大多数移动项目需要至少 2 个编译目标:

* **设备编译目标** 用于生成能够在 iOS 设备上执行的二进制文件.
  对于 iOS, 目前只有 1 个 设备编译目标: `iosArm64`.
* **模拟器编译目标** 用于为你的机器上启动的 iOS 模拟器生成二进制文件.
  如果你使用基于 Apple silicon 的 Mac 计算机, 请选择 `iosSimulatorArm64` 作为模拟器编译目标.
  如果你使用基于 Intel 的 Mac 计算机, 请使用 `iosX64` 作为模拟器编译目标.

如果你只声明 `iosArm64` 设备编译目标, 那么你将无法在你的本地机器上运行和调试你的应用程序和测试程序.

平台相关的源代码集, 例如 `iosArm64Main`, `iosSimulatorArm64Main`, 和 `iosX64Main`, 通常是空的,
因为 Kotlin 用于 iOS 设备和模拟器的代码通常在同一处.
你可以只使用 `iosMain` 中间源代码集, 对所有这些平台共用代码.

对于其他非 Mac Apple 的编译目标也是如此.
例如, 如果你有 `tvosArm64` 设备编译目标, 用于 Apple TV,
以及 `tvosSimulatorArm64` 和 `tvosX64` 模拟器编译目标, 分别用于基于 Apple silicon 和基于 Intel 的设备上的 Apple TV 模拟器,
你可以对所有这些编译目标使用 `tvosMain` 中间源代码集.

## 与测试集成 {id="integration-with-tests"}

除了 main 产品代码之外, 现实世界的项目还需要测试.
因此默认创建的所有源代码集都带有 `Main` 和 `Test` 后缀.
`Main` 包含产品代码, `Test` 包含对产品代码的测试代码.
它们之间的连接会自动创建, 测试代码可以使用 `Main` 代码提供的 API, 不需要额外的配置.

对应的 `Test` 部分也是源代码集, 与 `Main` 类似.
例如, `commonTest` 对应于 `commonMain`, 并编译到所有声明的编译目标, 你可以用来编写共通的测试.
平台相关的测试源代码集, 例如 `jvmTest`, 用来编写平台相关的测试, 例如, JVM 相关的测试, 或需要 JVM API 的测试.

除了拥有源代码集来编写共通测试之外, 你还需要跨平台的测试框架.
Kotlin 提供了一个默认的 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) 库,
其中有 `@kotlin.Test` 注解, 和各种断言方法, 例如 `assertEquals` 和 `assertTrue`.

对每个平台, 你可以在它们对应的源代码集中编写平台相关的测试, 和通常的测试一样.
和 main 代码一样, 你可以对每个源代码集设置平台相关的依赖项, 例如用于 JVM 的 `JUnit`, 和用于 iOS 的 `XCTest`.
要对特定的编译目标运行测试, 请使用 `<targetName>Test` task.

关于如何创建并运行跨平台的测试, 请参见 [测试你的跨平台应用程序教程](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html).

## 下一步做什么? {id="what-s-next"}

* [学习如何在 Gradle 脚本中声明和使用预定义的源代码集 ](multiplatform-hierarchy.md)
* [探索跨平台项目结构中的高级概念](multiplatform-advanced-project-structure.md)
* [关于目标平台的编译以及创建自定义的编译](multiplatform-configure-compilations.md)
