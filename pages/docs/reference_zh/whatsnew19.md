---
type: doc
layout: reference
category:
title: "Kotlin 1.9.0 版中的新功能"
---

# Kotlin 1.9.0 版中的新功能

最终更新: {{ site.data.releases.latestDocDate }}

_[发布日期: 2023/07/06](releases.html#release-details)_

Kotlin 1.9.0 已经发布了, JVM 平台的 K2 编译器已经进入 **Beta** 版.
此外, 还有以下一些重要功能:

* [新的 Kotlin K2 编译器更新](#new-kotlin-k2-compiler-updates)
* [枚举类值函数的替代进入稳定版](#stable-replacement-of-the-enum-class-values-function)
* [用于终端开放(open-ended)的值范围的 `..<` 操作符进入稳定版](#stable-operator-for-open-ended-ranges)
* [新的共通函数, 根据名称获取正规表达式中捕获的组](#new-common-function-to-get-regex-capture-group-by-name)
* [新的路径工具函数, 用于创建父目录](#new-path-utility-to-create-parent-directories)
* [Kotlin Multiplatform 中, Gradle 配置缓存功能的预览版](#preview-of-the-gradle-configuration-cache)
* [Kotlin Multiplatform 中, 对支持的 Android target 的变更](#changes-to-android-target-support)
* [Kotlin/Native 中, 自定义内存分配器的预览版](#preview-of-custom-memory-allocator)
* [Kotlin/Native 中, 库的链接](#library-linkage-in-kotlin-native)
* [Kotlin/Wasm 中, 与编译结果大小相关的优化](#size-related-optimizations)

关于本次更新的概要介绍, 你可以观看以下视频:

<iframe width="560" height="360" src="https://www.youtube.com/embed/fvwTZc-dxsM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>



## IDE 支持

在以下 IDE 中可以使用支持 1.9.0 版的 Kotlin plugin:

| IDE            | 支持的版本                          |
|----------------|--------------------------------|
| IntelliJ IDEA  | 2022.3.x, 2023.1.x             |
| Android Studio | Giraffe (223), Hedgehog (231)* |

*Android Studio Giraffe (223) 和 Hedgehog (231) 的后续发布版中会包含 Kotlin 1.9.0 plugin.

IntelliJ IDEA 2023.2 的后续发布版中会包含 Kotlin 1.9.0 plugin.

> 要下载 Kotlin 的 artifact 和依赖项, 请 [配置你的 Gradle 设置](#configure-gradle-settings), 使用 Maven Central 仓库.
{:.warning}

## 新的 Kotlin K2 编译器更新

JetBrains 的 Kotlin 开发组一直在努力稳定 K2 编译器, 1.9.0 版引入了更多的新功能.
JVM 平台的 K2 编译器现在已进入 **Beta** 版.

对于 Kotlin/Native 和跨平台项目, 也有了基本的支持.

### kapt 编译器 plugin 与 K2 编译器之间的兼容性

你可以在你的项目中和 K2 编译器一起使用 [kapt plugin](kapt.html), 但存在一些限制.
即使将 `languageVersion` 设置为 `2.0`, kapt 编译器 plugin 仍然会使用旧的编译器.

如果你对一个 `languageVersion` 设置为 `2.0` 的项目执行 kapt 编译器 plugin,
kapt 会自动切换到 `1.9`, 并禁用特定版本的兼容性检查.
这个行为相当于包含了下面这些命令行参数:
* `-Xskip-metadata-version-check`
* `-Xskip-prerelease-check`
* `-Xallow-unstable-dependencies`

这些检查对 kapt 任务被禁用了. 所有其他的编译任务仍然会继续使用新的 K2 编译器.

如果你在和 K2 编译器一起使用 kapt 时遇到任何问题, 请报告到我们的 [问题追踪系统](http://kotl.in/issue).

### 在你的项目中试用 K2 编译器

从 1.9.0 开始, 到 Kotlin 2.0 发布之前, 你可以很容易的测试 K2 编译器,
只需要向你的 `gradle.properties` 文件添加 `kotlin.experimental.tryK2=true` Gradle 属性就可以了.
你也可以运行以下命令:

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

这个 Gradle 属性会自动将语言版本设置为 2.0, 而且会更新构建报告,
包括 Kotlin 编译任务中, 使用 K2 编译器和使用当前编译器的任务数量:

```none
##### 'kotlin.experimental.tryK2' results (Kotlin/Native not checked) #####
:lib:compileKotlin: 2.0 language version
:app:compileKotlin: 2.0 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.0 #####
```

### Gradle 构建报告

[Gradle 构建报告](gradle/gradle-compilation-and-caches.html#build-reports) 现在会显示编译代码时使用的是当前编译器还是 K2 编译器.
在 Kotlin 1.9.0 中, 你可以在你的 [Gradle build scan](https://scans.gradle.com/) 中看到这些信息:

<img src="/assets/docs/images/gradle/gradle-build-scan-k1.png" alt="Gradle build scan - 使用 K1 编译器" width="700"/>

<img src="/assets/docs/images/gradle/gradle-build-scan-k2.png" alt="Gradle build scan - 使用 K2 编译器" width="700"/>

你还可以在构建报告中看到项目中使用的 Kotlin 版本:

```none
Task info:
  Kotlin language version: 1.9
```

> 如果你使用 Gradle 8.0, 你可能遇到构建报告的一些问题, 尤其是启用 Gradle 配置缓存时.
> 这是一个已知的问题, 在 Gradle 8.1 和之后的版本中已经修正.
{:.note}

### K2 编译器目前的限制

在你的 Gradle 项目中启用 K2 存在一些限制, 对使用 Gradle 8.3 以下版本的项目, 下面的情况可能会有影响:

* `buildSrc` 中源代码的编译.
* 在被包含的构建中的 Gradle plugin 的编译.
* 在 Gradle 8.3 以下版本的项目中使用的其他 Gradle plugin 的编译.
* Gradle plugin 依赖项的构建.

如果你遇到上面提到的问题, 你可以通过以下步骤来解决:

* 对 `buildSrc`, 任何 Gradle plugin, 以及它们的依赖项, 设置语言版本:

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
    }
}
```

* 当 Gradle 8.3 可以使用时, 将你的项目的 Gradle 版本更新到 8.3.

### 留下你对于新 K2 编译器的反馈意见

如果你能提供你的反馈意见, 我们将会非常感谢!

* 在 Kotlin Slack 频道中, 直接向 K2 开发者提供你的反馈意见 – [获得邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up),
  并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道.
* 在 [我们的问题追踪系统](https://kotl.in/issue) 中, 报告你遇到的新 K2 编译器的问题.
* [启用 **Send usage statistics** 选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html),
  允许 JetBrains 收集关于 K2 使用状况的匿名数据..

## 语言功能特性

在 Kotlin 1.9.0 中, 一些以前版本引入的新语言功能特性升级到了稳定版:
* [枚举类值函数的替代](#stable-replacement-of-the-enum-class-values-function)
* [数据对象与数据类的对称性](#stable-data-objects-for-symmetry-with-data-classes)
* [在内联的值类(inline value class)中支持有 body 的次级构造器(secondary constructor)](#support-for-secondary-constructors-with-bodies-in-inline-value-classes)

### 枚举类值函数的替代进入稳定版

在 1.8.20 中, 引入了实验性功能: 枚举类的 `entries` 属性.
`entries` 属性是 `values()` 合成(synthetic)函数的现代而且高性能的替代者.
在 1.9.0 中, `entries` 属性进入了稳定版.

> `values()` 函数仍然继续支持, 但我们推荐你改为使用 `entries` 属性.
{:.tip}

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```

关于枚举类的 `entries` 属性, 更多详情请参见 [Kotlin 1.8.20 的新功能](whatsnew1820.html#a-modern-and-performant-replacement-of-the-enum-class-values-function).

### 数据对象与数据类的对称性进入稳定版

在 [Kotlin 1.8.20](whatsnew1820.html#preview-of-data-objects-for-symmetry-with-data-classes) 中引入了数据对象的声明,
现在进入了稳定版.
包括为了与数据类保持对称而添加的函数: `toString()`, `equals()`, 和 `hashCode()`.

这个功能在 `sealed` 类型层级结构中非常有用 (例如一个 `sealed class` 或 `sealed interface` 层级结构),
因为 `data object` 声明可以与 `data class` 声明一起方便的使用.
在这个示例中, 将 `EndOfFile` 声明为 `data object`, 而不是普通的 `object`,
代表它自动拥有 `toString()` 函数, 不需要手动的覆盖这个函数.
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

更多详情, 请参见 [Kotlin 1.8.20 的新功能](whatsnew1820.html#preview-of-data-objects-for-symmetry-with-data-classes).

### 在内联的值类(inline value class)中支持有 body 的次级构造器(secondary constructor)

从 Kotlin 1.9.0 开始, [内联的值类(inline value class)](inline-classes.md) 中有 body 的次级构造器(secondary constructor) 默认可以使用了:

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // 从 Kotlin 1.4.30 开始可以使用:
    init {
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }
    // 从 Kotlin 1.9.0 开始默认可以使用:
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```

以前, Kotlin 在内联类中只允许使用 public 的主构造器.
这就造成, 无法封装底层值, 或创建一个内联类来表达某些受限定的值.

随着 Kotlin 的发展, 解决了这个问题. Kotlin 1.4.30 取消了对 `init` 代码块的限制,
之后, Kotlin 1.8.20 提供了预览功能, 允许使用有 body 的次级构造器.
现在这个功能默认可以使用了.
关于 Kotlin 内联类的开发进程, 请参见 [这个 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md).

## Kotlin/JVM

从 version 1.9.0 来时, 编译器能够生成字节码版本对应于 JVM 20的类.
此外, `JvmDefault` 注解和旧的 `-Xjvm-default` 模式的废弃周期继续向前推进.

### `JvmDefault` 注解和旧的 `-Xjvm-default` 模式的废弃

从 Kotlin 1.5 开始, `JvmDefault` 注解的使用被废弃了, 取代它的是新的 `-Xjvm-default` 模式: `all` 和 `all-compatibility`.
随着 Kotlin 1.4 中引入的 `JvmDefaultWithoutCompatibility`,
以及 Kotlin 1.6 中引入的 `JvmDefaultWithCompatibility`,
这些模式提供了对 `DefaultImpls` 类的生成的全面的控制, 并确保与旧的 Kotlin 代码无缝的兼容性.

因此, 在 Kotlin 1.9.0 中, `JvmDefault` 注解不再具有任何意义, 并被标注为已废弃, 使用它会产生编译错误.
它最终将会从 Kotlin 中完全删除.

## Kotlin/Native

除其他改进之外, 这个发布版还带来了 [Kotlin/Native 内存管理器](native-memory-manager.md) 的更多改进,
将会增强它的健壮性和性能:

* [自定义内存分配器的预览版](#preview-of-custom-memory-allocator)
* [主线程上的 Objective-C 或 Swift 对象释放 hook](#objective-c-or-swift-object-deallocation-hook-on-the-main-thread)
* [在 Kotlin/Native 中访问常数值时不会初始化对象](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
* [能够为 iOS 模拟器上的测试配置 standalone 模式](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)
* [Kotlin/Native 中库的链接](#library-linkage-in-kotlin-native)

### 自定义内存分配器的预览版

Kotlin 1.9.0 引入了自定义内存分配器的预览版.
它的分配系统能够提高 [Kotlin/Native 内存管理器](native/native-memory-manager.html) 的运行期性能.

Kotlin/Native 中目前的对象分配系统使用一个一般性的分配器, 不能实现高效的垃圾收集.
作为补偿, 在垃圾收集器 (GC) 将所有已分配的对象合并入单个列表之前
它维护一个线程局部的(thread-local)链表, 其中包含已分配的对象, 这个列表可以在清理过程中遍历.
这种方案造成了几个性能缺陷:

* 清理顺序缺乏内存局部性(memory locality), 并且经常导致分散的内存访问模式, 造成潜在的性能问题.
* 链表对每个对象需要更多内存, 增加了内存使用量, 尤其是在处理大量的小对象的情况下.
* 包含所有已分配对象的单个列表使得难以进行并行清理, 当转换器线程(Mutator Thread)分配对象的速度超过 GC 线程回收它们的速度时, 可能造成内存使用量的问题.

为了解决这些问题, Kotlin 1.9.0 引入了自定义内存分配器的预览版.
它将系统内存分为多个页面(Page), 允许按连续的顺序进行独立的清理.
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

关于新的内存分配器的设计, 更多详情请参见 [README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md).

#### 如何启用

添加 `-Xallocator=custom` 编译器选项:

```kotlin
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                freeCompilerArgs.add("-Xallocator=custom")
            }
        }
    }
}
```

#### 留下你的反馈意见

希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55364/Implement-custom-allocator-for-Kotlin-Native)
提供你的反馈意见, 帮助改进自定义分配器.

### 主线程上的 Objective-C 或 Swift 对象释放 hook

从 Kotlin 1.9.0 开始, 对于 Objective-C 或 Swift 对象, 如果对象在主线程中被传递到 Kotlin, 那么对象的释放 hook 也会在主线程上被调用.
[Kotlin/Native 内存管理器](native/native-memory-manager.html) 以前处理 Objective-C 对象引用的方式可能会导致内存泄露.
我们相信现在的新的行为可以改进内存管理器的健壮性.

考虑一个被 Kotlin 代码引用的 Objective-C 对象, 例如, 当对象作为参数传递时, 被函数返回时, 或者从一个集合获取时.
这种情况下, Kotlin 创建它自己的对象, 其中保持 Objective-C 对象的引用.
当 Kotlin 对象被释放时, Kotlin/Native 运行期库会调用 `objc_release` 函数, 释放 Objective-C 对象的引用.

在以前的版本中, Kotlin/Native 内存管理器在一个特殊的 GC 线程中运行 `objc_release`.
如果它是这个对象的最后引用, 那么对象会被释放.
问题发生在, 如果 Objective-C 对象有自定义的释放 hooks, 例如 Objective-C 中的 `dealloc` 方法, 或 Swift 中的 `deinit` 代码块,
这些 hook 期望在特定的线程上调用.

由于主线程中的对象的 hook 通常也期望在主线程中调用, Kotlin/Native 运行期库现在也在主线程上调用 `objc_release`.
它应该覆盖 Objective-C 对象在主线程上传递到 Kotlin, 并在主线程中创建一个 Kotlin 端的对等对象的情况.
这只对处理主调度队列的情况才有效，对于通常的 UI 应用程序就是这种情况.
如果不是主调度队列, 或者对象在主线程以外的线程中传递到 Kotlin 的情况, 会和以前一样, 在特殊的 GC 线程中调用 `objc_release`.

#### 如何关闭这个功能

如果你遇到问题, 你可以在你的 `gradle.properties` 文件中, 添加以下选项, 禁用这个行为:

```none
kotlin.native.binary.objcDisposeOnMain=false
```

遇到这样的情况, 请报告到 [我们的问题追踪系统](https://kotl.in/issue).

### 在 Kotlin/Native 中访问常数值时不会初始化对象

从 Kotlin 1.9.0 开始, 在访问 `const val` 域变量时, Kotlin/Native 后端不会初始化对象:

```kotlin
object MyObject {
    init {
        println("side effect!")
    }

    const val y = 1
}

fun main() {
    println(MyObject.y) // 第 1 次不会初始化
    val x = MyObject    // 这里会发生初始化
    println(x.y)
}
```

这个行为现在与 Kotlin/JVM 平台统一了, Kotlin/JVM 平台的实现与 Java 一致, 对这种情况对象永远不会初始化.
由于这个变化, 你的 Kotlin/Native 项目还能够有一些性能改进.

### 能够为 iOS 模拟器上的测试配置 standalone 模式

默认情况下, 在对 Kotlin/Native 运行 iOS 模拟器上的测试时, 会使用 `--standalone` 选项, 以避免发生手动的模拟器启动和关闭.
在 1.9.0 中, 现在你可以在 Gradle task 中通过 `standalone` 属性配置是否使用这个选项.
默认会使用 `--standalone` 选项, 启用 standalone 模式.

下面的例子演示在你的 `build.gradle.kts` 文件中如何禁用 standalone 模式:

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.native.tasks.KotlinNativeSimulatorTest>().configureEach {
    standalone.set(false)
}
```

> 如果你禁用 standalone 模式, 那么必须手动启用模拟器. 要从 CLI 启动你的模拟器, 可以使用下面的命令:
>
> ```shell
> /usr/bin/xcrun simctl boot <DeviceId>
>```
{:.warning}

### Kotlin/Native 中库的链接

从 Kotlin 1.9.0 开始, Kotlin/Native 编译器使用与 Kotlin/JVM 相同的方式来处理 Kotlin 库的链接问题.
如果一个第三方 Kotlin 库的作者对实验性 API 进行了不兼容的变更, 而这个 API 又被另一个第三方 Kotlin 库使用, 那么你就可能遇到这样的问题.

对于第三方 Kotlin 库之间发生链接错误的情况, 构建不会在编译过程中失败.
相反, 你只会在运行期间遇到这些错误, 这种行为与 JVM 完全相同.

每当 Kotlin/Native 编译器检测到库链接的问题就会报告警告.
你可以在你的编译日志中找到这样的警告, 例如:

```text
No function found for symbol 'org.samples/MyRemovedClass.doSomething|3657632771909858561[0]'

Can not get instance of singleton 'MyEnumClass.REMOVED_ENTRY': No enum entry found for symbol 'org.samples/MyEnumClass.REMOVED_ENTRY|null[0]'

Function 'getMyRemovedClass' can not be called: Function uses unlinked class symbol 'org.samples/MyRemovedClass|null[0]'
```

在你的项目中, 你可以进一步配置, 甚至禁用这样的行为:

* 如果你不想在你的编译日志中看到这些警告, 可以使用 `-Xpartial-linkage-loglevel=INFO` 编译器选项来禁止警告.
* 也可以使用 `-Xpartial-linkage-loglevel=ERROR`, 将报告的警告级别提升为编译错误.
  这种情况下, 编译会失败, 你会在编译日志中看到所有的错误. 使用这个选项可以更加严密的检测链接错误.
* 如果你在使用这个功能时遇到意想不到的问题, 你可以使用 `-Xpartial-linkage=disable` 编译器选项关闭这个功能.
  遇到这样的情况, 请报告到 [我们的问题追踪系统](https://kotl.in/issue).

```kotlin
// 通过 Gradle 构建文件传递编译器选项的示例.
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {

                // 禁止链接警告:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=INFO")

                // 将链接警告提升为错误:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")

                // 完全禁用这个功能:
                freeCompilerArgs.add("-Xpartial-linkage=disable")
            }
        }
    }
}
```

### 用于与 C 代码交互时的隐式整数转换的编译器选项

我们引入了与 C 代码交互时的一个编译器选项, 允许你使用隐式整数转换.
经过仔细考虑之后, 我们引入了这个编译器选项, 以防止无意的使用,
因为这个功能还有待继续改进, 而我们的目标是拥有最高质量的 API.

下面的示例代码中, 一个隐式整数转换允许 `options = 0`,
尽管 [`options`](https://developer.apple.com/documentation/foundation/nscalendar/options)
是无符号的 `UInt` 类型, 而 `0` 是有符号的整数.

```kotlin
val today = NSDate()
val tomorrow = NSCalendar.currentCalendar.dateByAddingUnit(
    unit = NSCalendarUnitDay,
    value = 1,
    toDate = today,
    options = 0
)
```

要对原生库使用隐式转换, 请使用 `-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion` 编译器选项.

你可以在你的 Gradle `build.gradle.kts` 文件中进行配置:
```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>().configureEach {
    compilerOptions.freeCompilerArgs.addAll(
        "-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion"
    )
}
```

## Kotlin Multiplatform

在 1.9.0 中, Kotlin Multiplatform 有了以下重要更新, 旨在改善你的开发者体验:

* [对支持的 Android target 的变更](#changes-to-android-target-support)
* [默认启用新的 Android 源代码集布局](#new-android-source-set-layout-enabled-by-default)
* [在跨平台项目中的 Gradle 配置缓存功能的预览版](#preview-of-the-gradle-configuration-cache)

### 对支持的 Android target 的变更

我们正在继续努力稳定 Kotlin Multiplatform.
其中必要的一步是为 Android target 提供一级支持.
我们很激动的宣布, 将来, Google 的 Android 开发组将会提供他们自己的 Gradle plugin, 来支持 Kotlin Multiplatform 中的 Android.

为了给这个来自 Google 的新解决方案开辟道路, 我们会重命名 1.9.0 的目前的 Kotlin DSL 中的 `android` 代码块.
请将你的构建脚本中的所有 `android` 代码块改为 `androidTarget`.
这是一个必要的临时变更, 目的是将 `android` 的名称留给未来由 Google 提供的 DSL 使用.

Google plugin 将成为在跨平台项目中使用 Android 的首选方式.
当它完成之后, 我们会提供必要的迁移说明, 让你能够象以前一样使用 `android` 的短名称.

### 默认启用新的 Android 源代码集布局

从 Kotlin 1.9.0 开始, 默认会使用新的 Android 源代码集布局.
它取代了以前的目录命名模式, 这个旧模式在很多方面令人难以理解.
新布局有很多优点:

* 简化的类型语义 – 新的 Android 源代码集布局提供了清晰而且一致的命名规约, 有助于区分不同类型的源代码集.
* 改进的源代码目录布局 – 使用新的布局, `SourceDirectories` 的排列变得更加连贯, 更易于组织代码和定位源代码文件.
* 清晰的 Gradle 配置命名模式 – 在 `KotlinSourceSets` 和 `AndroidSourceSets` 中, 命名模式现在更加一致, 更加易于预测.

新的布局需要使用 Android Gradle plugin 7.0 或更高版本, 以及 Android Studio 2022.3 或更高版本.
请参见我们的 [迁移向导](multiplatform/multiplatform-android-layout.html), 在你的 `build.gradle(.kts)` 文件中进行必要的修改.

{:#preview-of-gradle-configuration-cache}
### Gradle 配置缓存功能的预览版

Kotlin 1.9.0 增加了对跨平台库中的 [Gradle 配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html) 的支持.
如果你是库的作者, 你可以得益于构建性能的改善.

Gradle 配置缓存通过对后续的构建重用配置阶段的结果来加快构建过程.
这个功能从 Gradle 8.1 开始成为稳定版. 要启用它, 请遵照 [Gradle 文档](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage) 中的说明.

> 对于与 Xcode 集成的 task, 或 [Kotlin CocoaPods Gradle plugin](native/native-cocoapods-dsl-reference.html),
> Kotlin Multiplatform plugin 还不支持 Gradle 配置缓存.
> 我们期望在未来的 Kotlin 发布版中添加这个功能.
{:.note}

## Kotlin/Wasm

Kotlin 开发组还在继续实验新的 Kotlin/Wasm 编译目标.
这个发布版引入了几个性能优化和 [与编译结果大小相关的优化](#size-related-optimizations),
以及 [与 JavaScript 交互功能的更新](#updates-in-javascript-interop).

### 与编译结果大小相关的优化

对 WebAssembly (Wasm) 项目, Kotlin 1.9.0 引入了编译结果大小的显著改善.
比较两个 "Hello World" 项目,
Kotlin 1.9.0 中的 Wasm 代码大小比 Kotlin 1.8.20 中要小超过 10 倍以上.

<img src="/assets/docs/images/wasm/wasm-1-9-0-size-improvements.png" alt="Kotlin/Wasm 与编译结果大小相关的优化" width="700"/>

在使用 Kotlin 代码针对 Wasm 平台进行开发时, 这些代码大小优化可以更加高效的利用资源, 并改善性能.

### 与 JavaScript 交互功能的更新

这次 Kotlin 更新引入了 Kotlin/Wasm 的 Kotlin 与 JavaScript 之间交互能力的变更.
由于 Kotlin/Wasm 是一个 [实验性](components-stability.html#stability-levels-explained) 功能, 它的互操作性存在一些限制.

#### 动态类型的限制

从 1.9.0 版开始, Kotlin 在 Kotlin/Wasm 中不再支持使用 `Dynamic` 类型.
这个功能现在已被废弃, 由新的通用的 `JsAny` 类型取代, 这个类型游离于 JavaScript 互操作性.

更多详情, 请参见 [Kotlin/Wasm 与 JavaScript 的互操作性](wasm/wasm-js-interop.html) 文档.

#### 非外部类型(non-external type)的限制

Kotlin/Wasm 在向 JavaScript 传递值时, 或从 JavaScript 传入值时, 支持对特定的 Kotlin 静态的转换.
支持的类型包括:

* 基本类型, 例如有符号的数值, `Boolean`, 以及 `Char`.
* `String`.
* 函数类型.

其他类型传递时不会转换, 而是作为不透明引用(Opaque Reference), 导致 JavaScript 与 Kotlin 子类型之间的不一致.

为了解决这个问题, Kotlin 在与 JavaScript 交互时, 限制为只允许使用一组良好支持的类型.
从 Kotlin 1.9.0 开始, 在 Kotlin/Wasm 的 JavaScript 交互中, 只支持外部(external) 类型, 基本类型, 字符串, 以及函数类型.
此外, 引入了一个单独的显式类型, 名为 `JsReference`, 用来表达可在 JavaScript 交互中使用的 Kotlin/Wasm 对象句柄.

更多详情, 请参见 [Kotlin/Wasm 与 JavaScript 的互操作性](wasm/wasm-js-interop.html) 文档.

### Kotlin Playground 中的 Kotlin/Wasm

Kotlin Playground 支持 Kotlin/Wasm 编译目标.
你可以编写, 运行, 分享你的针对 Kotlin/Wasm 编译目标的 Kotlin 代码.
[马上看看吧](https://pl.kotl.in/HDFAvimga)

> 使用 Kotlin/Wasm 需要在你的浏览器中启用实验性的功能.
>
> [参见: 如何启用这些功能](wasm/wasm-troubleshooting.html).
{:.note}

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-1-9-0-kotlin-wasm-playground">

```kotlin
import kotlin.time.*
import kotlin.time.measureTime

fun main() {
    println("Hello from Kotlin/Wasm!")
    computeAck(3, 10)
}

tailrec fun ack(m: Int, n: Int): Int = when {
    m == 0 -> n + 1
    n == 0 -> ack(m - 1, 1)
    else -> ack(m - 1, ack(m, n - 1))
}

fun computeAck(m: Int, n: Int) {
    var res = 0
    val t = measureTime {
        res = ack(m, n)
    }
    println()
    println("ack($m, $n) = ${res}")
    println("duration: ${t.inWholeNanoseconds / 1e6} ms")
}
```

</div>


## Kotlin/JS

这个发布版引入了 Kotlin/JS 的更新, 包括删除了旧的 Kotlin/JS 编译器, 废弃了 Kotlin/JS Gradle plugin,
以及实验性的支持 ES6:

* [删除了旧的 Kotlin/JS 编译器](#removal-of-the-old-kotlin-js-compiler)
* [废弃了 Kotlin/JS Gradle plugin](#deprecation-of-the-kotlin-js-gradle-plugin)
* [废弃了外部枚举类型(external enum)](#deprecation-of-external-enum)
* [实验性的支持 ES6 类和模块](#experimental-support-for-es6-classes-and-modules)
* [更改了 JS 产品发布(production distribution)的默认目标](#changed-default-destination-of-js-production-distribution)
* [从 stdlib-js 中抽取了 org.w3c 声明](#extract-org-w3c-declarations-from-stdlib-js)

> 从 1.9.0 版开始, 对 Kotlin/JS 还启用了 [部分的库链接](#library-linkage-in-kotlin-native).
{:.note}


### 删除了旧的 Kotlin/JS 编译器

在 Kotlin 1.8.0 中, 我们 [宣布了](whatsnew18.html#stable-js-ir-compiler-backend) 基于 IR 的后端已成为 [稳定版](components-stability.html).
从那之后, 不指定编译器成为一种错误, 使用旧的编译器会导致警告.

在 Kotlin 1.9.0 中, 使用旧的后端会导致错误.
请遵照我们的 [迁移指南](js/js-ir-migration.html), 迁移到 IR 编译器.

### 废弃了 Kotlin/JS Gradle plugin

从 Kotlin 1.9.0 开始, `kotlin-js` Gradle plugin 已被废弃.
我们建议你改为使用 `kotlin-multiplatform` Gradle plugin 中的 `js()` 编译目标.

Kotlin/JS Gradle plugin 的功能本质上与 `kotlin-multiplatform` plugin 是重叠的, 并使用了相同的内部实现.
这种功能重叠导致了理解困难, 并增加了 Kotlin 开发组的维护负担.

关于迁移说明, 请参见我们的 [Kotlin Multiplatform 兼容性指南](multiplatform/multiplatform-compatibility-guide.html#migration-from-kotlin-js-gradle-plugin-to-kotlin-multiplatform-gradle-plugin).
如果你遇到迁移指南中没有提到的其它问题, 请报告到我们的 [问题追踪系统](http://kotl.in/issue).

### 废弃了外部枚举类型(external enum)

在 Kotlin 1.9.0 中, 外部枚举类型(external enum)的使用将被废弃, 原因是枚举类型的静态成员, 例如 `entries`, 不能存在于 Kotlin 之外.
我们建议改为使用外部的封闭类, 并以对象作为它的子类:

```kotlin
// 以前的代码
external enum class ExternalEnum { A, B }

// 现在的代码
external sealed class ExternalEnum {
    object A: ExternalEnum
    object B: ExternalEnum
}
```

通过切换为以对象为子类的外部封闭类, 你可以实现与外部枚举类型相似的功能, 同时又能避免与默认方法相关的问题.

从 Kotlin 1.9.0 开始, 外部枚举类型的使用将被标记为废弃.
我们建议你更新你的代码, 使用上面建议的外部封闭类来实现, 以保证兼容性, 并有利于未来的维护.

### 实验性的支持 ES6 类和模块

本次发布引入了对 ES6 模块和生成 ES6 类的 [实验性](components-stability.html#stability-levels-explained) 支持:
* 模块提供了一种方式, 简化你的代码库, 并提高可维护性.
* 类允许你结合面向对象编程 (OOP) 原则, 产生更加清晰直观的代码.

要启用这些功能, 请更新你的 `build.gradle.kts` 文件:

```kotlin
// build.gradle.kts
kotlin { 
    js(IR) { 
        useEsModules() // 启用 ES6 模块
        browser()
        }
    }

// 启用 ES6 类的生成
tasks.withType<KotlinJsCompile>().configureEach {
    kotlinOptions {
        useEsClasses = true
    }
}
```

关于ECMAScript 2015 (ES6), 更多详情请参见 [官方文档](https://262.ecma-international.org/6.0/).

### 更改了 JS 产品发布(production distribution)的默认目标

在 Kotlin 1.9.0 之前, 发布的目标目录是 `build/distributions`.
但是, 这是一个用于 Gradle archive 的共通目录.
为了解决这个问题, 在 Kotlin 1.9.0 中我们将默认的发布目标目录改为:
`build/dist/<targetName>/<binaryName>`.

例如, `productionExecutable` 过去会发布到 `build/distributions`.
在 Kotlin 1.9.0 中, 它会发布到 `build/dist/js/productionExecutable`.

> 如果你有一个使用这些构建结果的管道, 请确认更新目录的设置.
{:.warning}

### 从 stdlib-js 中抽取了 org.w3c 声明

从 Kotlin 1.9.0 开始, `stdlib-js` 不再包含 `org.w3c` 声明.
这些声明改为移动到一个单独的 Gradle 依赖项中.
当你向你的 `build.gradle.kts` 文件添加 Kotlin Multiplatform Gradle plugin 时,
这些声明会自动包含到你的项目中, 和标准库类似.

不需要任何手动的迁移处理. 必要的调整工作会自动处理.

## Gradle

Kotlin 1.9.0 带来了新的 Gradle 编译器选项, 以及很多其他功能:

* [删除了 classpath 属性](#removed-classpath-property)
* [新的 Gradle 编译器选项](#new-compiler-options)
* [Kotlin/JVM 的项目级编译器选项](#project-level-compiler-options-for-kotlin-jvm)
* [用于 Kotlin/Native 模块名称的编译器选项](#compiler-option-for-kotlin-native-module-name)
* [用于 Kotlin 官方库的单独的编译器 plugin](#separate-compiler-plugins-for-official-kotlin-libraries)
* [增加了最低支持版本](#incremented-minimum-supported-version)
* [kapt 不再过早创建 task](#kapt-doesn-t-cause-eager-task-creation-in-gradle)
* [JVM 编译目标校验模式的程序化配置](#programmatic-configuration-of-the-jvm-target-validation-mode)

### 删除了 classpath 属性

在 Kotlin 1.7.0 中, 我们宣布了 `KotlinCompile` task 属性 `classpath` 废弃周期的开始.
在 Kotlin 1.8.0 中废弃级别提升到了 `ERROR`.
在本次发布版中, 我们最终删除了 `classpath` 属性.
所有的编译任务现在应该使用 `libraries` 输入, 得到编译所需要的库的列表.

### 新的编译器选项

Kotlin Gradle plugin 现在提供新的属性, 用于使用者同意(Opt-in), 以及编译器的渐进模式(progressive mode).

* 要对新的 API 标注使用者同意(Opt-in), 现在你可以使用 `optIn` 属性, 传递一个字符串列表, 例如: `optIn.set(listOf(a, b, c))`.
* 要启用渐进模式, 请使用 `progressiveMode.set(true)`.

### Kotlin/JVM 的项目级编译器选项

从 Kotlin 1.9.0 开始, 在 `kotlin` 配置代码块中, 可以使用一个新的 `compilerOptions` 代码块:

```kotlin
kotlin {
    compilerOptions {
        jvmTarget.set(JVM.Target_11)
    }
}
```

这个功能使得编译器选项的配置更加容易. 但是, 需要注意一些重要的细节:

* 这个配置只适用于项目级.
* 对于 Android plugin, 这个代码块与下面的代码配置相同的对象:

```kotlin
android {
    kotlinOptions {}
}
```

* `android.kotlinOptions` 和 `kotlin.compilerOptions` 配置块会相互覆盖. 只有构建文件中最后出现的 (最下方的) 代码块会起作用.
* 如果在项目级配置了 `moduleName`, 它的值在传递给编译器时可能会变更.
  对 `main` 编译不会如此, 但对其它编译类型, 例如, test source, Kotlin Gradle plugin 会添加  `_test` 后缀.
* `tasks.withType<KotlinJvmCompile>().configureEach {}` (或 `tasks.named<KotlinJvmCompile>("compileKotlin") { }`) 之内的配置会覆盖 `kotlin.compilerOptions` 和 `android.kotlinOptions`.

### 用于 Kotlin/Native 模块名称的编译器选项

在 Kotlin Gradle plugin 中现在可以很容易的使用 Kotlin/Native 的
[`module-name`](compiler-reference.html#module-name-name-native) 编译器选项.

这个选项对编译的模块指定一个名称, 也可以为导入到 Objective-C 的声明添加一个名称前缀.

你可以直接在你的 Gradle 构建文件的 `compilerOptions` 代码块中设置模块名称:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>("compileKotlinLinuxX64") {
    compilerOptions {
        moduleName.set("my-module-name")
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
tasks.named("compileKotlinLinuxX64", org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile.class) {
    compilerOptions {
        moduleName = "my-module-name"
    }
}
```

</div>
</div>

### 用于 Kotlin 官方库的单独的编译器 plugin

Kotlin 1.9.0 为它的官方库引入了单独的编译器 plugin. 以前, 编译器 plugin 内嵌在对应的 Gradle plugin 中.
如果编译器 plugin 编译时使用的 Kotlin 版本比 Gradle build 的 Kotlin 运行期版本更高, 就可能导致兼容性问题.

新的编译器 plugin 添加为单独的依赖项, 因此你不会再遇到与旧版本 Gradle 的兼容性问题.
新方案的另一个主要优点是, 新的编译器 plugin 可以在其他构建系统中使用, 例如 [Bazel](https://bazel.build/).

以下是我们发布到 Maven Central 的新编译器 plugin 的列表:

* kotlin-atomicfu-compiler-plugin
* kotlin-allopen-compiler-plugin
* kotlin-lombok-compiler-plugin
* kotlin-noarg-compiler-plugin
* kotlin-sam-with-receiver-compiler-plugin
* kotlinx-serialization-compiler-plugin

每个 plugin 都有它对应的 `-embeddable`, 例如,
`kotlin-allopen-compiler-plugin-embeddable` 用来与 `kotlin-compiler-embeddable` artifact 一起使用,
这是脚本化 artifact 的默认选项.

Gradle 将这些 plugin 添加为编译器参数. 你不需要对你既有的项目进行任何变更.

### 增加了最低支持版本

从 Kotlin 1.9.0 开始, 支持的 Android Gradle plugin 最低版本是 4.2.2.

参见 [Kotlin Gradle plugin 与可用的 Gradle 版本之间的兼容性](gradle/gradle-configure-project.html#apply-the-plugin).

### kapt 不再过早创建 Gradle 中的 task

在 1.9.0 之前, [kapt 编译器 plugin](kapt.html) 会请求配置后的 Kotlin 编译 task 实例, 导致过早的创建 task.
在 Kotlin 1.9.0 中已经解决了这个问题. 如果你的 `build.gradle.kts` 文件使用默认的配置, 那么你的设置不会受到这个变更的影响.

> 如果你使用自定义的配置, 你的设置会受到不利的影响.
> 例如, 如果你使用 Gradle 的 task API 修改了 `KotlinJvmCompile` task, 你必须在你的构建脚本中对 `KaptGenerateStubs`
> task 进行类似的修改.
>
> 例如, 如果你的脚本对 `KotlinJvmCompile` task 的配置如下:
> ```kotlin
> tasks.named<KotlinJvmCompile>("compileKotlin") { // 你的自定义配置 }
> ```
>
> 这种情况下, 你需要确定 `KaptGenerateStubs` task 中也包含相同的修改:
> ```kotlin
> tasks.named<KaptGenerateStubs>("kaptGenerateStubs") { // 你的自定义配置 }
> ```
{:.warning}

更多详情, 请参见我们的 [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-54468/KAPT-Gradle-plugin-causes-eager-task-creation).

### JVM 编译目标校验模式的程序化配置

在 Kotlin 1.9.0 之前, 只有一种方法来调整 Kotlin 与 Java 之间的 JVM 编译目标不兼容性的检测方式.
你必须在你的 `gradle.properties` 文件中对整个项目设置 `kotlin.jvm.target.validation.mode=ERROR`.

现在, 你也可以在你的 `build.gradle.kts` 文件中, 在 task 级进行配置:

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>("compileKotlin") {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```

## 标准库

Kotlin 1.9.0 对标准库有了一些很大的改进:
* [`..<` 操作符](#stable-operator-for-open-ended-ranges) 和 [时间 API](#stable-time-api) 进入稳定版.
* [Kotlin/Native 标准库经过了彻底的审查和更新](#the-kotlin-native-standard-library-s-journey-towards-stabilization)
* [`@Volatile` 注解可以在更多平台使用](#stable-volatile-annotation)
* [有了一个 **共通的** 函数来通过名称获取正规表达式中捕获的组(capture group)](#new-common-function-to-get-regex-capture-group-by-name)
* [引入了 `HexFormat` 类, 用于 16 进制数的格式化和解析](#new-hexformat-class-to-format-and-parse-hexadecimals)

### 用于终端开放(open-ended)的值范围的 `..<` 操作符进入稳定版

新的 `..<` 操作符用于终端开放(open-ended)的值范围, 它在 [Kotlin 1.7.20](whatsnew1720.html#preview-of-the-operator-for-creating-open-ended-ranges) 中引入, 在 1.8.0 中进入稳定版.
在 1.9.0 中, 用于操作终端开放的值范围的标准库 API也进入了稳定版.

我们的研究显示, 在声明一个终端开放的值范围时, 新的 `..<` 操作符更加易于理解.
如果你使用 [`until`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/until.html) 中缀函数, 很容易错误的理解为, 值范围包含它的上界(upper bound).

下面是使用 `until` 函数的示例:

```kotlin
fun main() {
    for (number in 2 until 10) {
        if (number % 2 == 0) {
            print("$number ")
        }
    }
    // 输出结果为 2 4 6 8
}
```

下面是使用新的 `..<` 操作符示例:

```kotlin
fun main() {
    for (number in 2..<10) {
        if (number % 2 == 0) {
            print("$number ")
        }
    }
    // 输出结果为 2 4 6 8
}
```

> 从 IntelliJ IDEA 2023.1.1 版开始, 有了一个新的代码审查, 对你可以使用 `..<` 操作符的地方, 会高亮显示.
{:.note}

关于如何使用这个操作符, 更多详情请参见 [Kotlin 1.7.20 版中的新功能](whatsnew1720.html#preview-of-the-operator-for-creating-open-ended-ranges).

### 时间 API 进入稳定版

从 1.3.50 开始, 我们引入了一个新的时间测量 API 的预览版.
API 中关于时间长度的部分在 1.6.0 中进入了稳定版.
在 1.9.0 中, 时间测量 API 的其他部分也进入了稳定版.

旧的时间 API 提供了 `measureTimeMillis` 和 `measureNanoTime` 函数, 使用起来不直观.
很明显, 这两个函数都测量时间, 使用不同的单位, 但很难清楚理解的是, `measureTimeMillis` 使用 [wall clock](https://en.wikipedia.org/wiki/Elapsed_real_time)
来测量时间, 而 `measureNanoTime` 使用单调时间源(monotonic time source).
新的时间 API 解决了这个问题, 以及其他问题, 让 API 更加用户友好.

通过新的时间 API, 你可以很容易的实现以下功能:
* 使用单调时间源(monotonic time source), 测量执行某些代码消耗的时间, 使用你希望的时间单位.
* 标记一个时刻.
* 比较两个时刻, 并计算它们之间的差异.
* 检查从某个特定的时刻开始, 经过了多少时间.
* 检查当前时间是否已经经过了某个指定的时刻.

#### 测量代码的执行时间

要测量执行一段代码消耗的时间,
请使用 [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)
内联函数.

要测量执行一段代码消耗的时间, **并且** 返回这段代码的执行结果,
请使用 [`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html)
内联函数.

默认情况下, 这两个函数使用一个单调时间源(monotonic time source).
但是, 如果你想要使用流逝的真实时间源(elapsed real-time source), 也是可以的.
例如, 在 Android 中, 默认的时间源 `System.nanoTime()` 在设备活动时才计算时间.
当设备进入深度睡眠时, 它会失去对时间的追踪.
想要在设备深度睡眠时继续追踪时间, 你可以改为创建一个使用 [`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos()) 的时间源:

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```

#### 标记时刻, 并测量时刻之间的差异

要标记一个特定的时刻, 请使用 [`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/)
接口, 和 [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) 函数
来创建一个 [`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/).
要测量来自同一个时间源的 `TimeMarks` 之间的差异, 请使用减法操作符 (`-`):


<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-elapsed">

```kotlin
import kotlin.time.*

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // 睡眠 0.5 秒.
    val mark2 = timeSource.markNow()

    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // 也可以对时间标记进行比较.
    println(mark2 > mark1) // 比较结果为 true, 因为 mark2 是在 mark1 之后捕获的.
}
```

</div>

要检查是否已经经过了某个截止时刻, 或者是否已经到达超时时间, 请使用 [`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html)
和 [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html) 
扩展函数:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-whats-new-time-passednow">

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    val fiveSeconds: Duration = 5.seconds
    val mark2 = mark1 + fiveSeconds

    // 还没有经过 5 秒
    println(mark2.hasPassedNow())
    // 输出结果为 false

    // 等待 6 秒
    Thread.sleep(6000)
    println(mark2.hasPassedNow())
    // 输出结果为 true
}
```

</div>

### Kotlin/Native 标准库走向稳定

由于我们的 Kotlin/Native 标准库持续增长, 我们决定是时候对它进行一次全面的审查, 以确保它符合我们的高标准.
作为这次审查的一部分, 我们仔细的审查了 **每一个** 现有的 public 签名.
对每一个签名, 我们考虑它是否符合以下规则:

* 有一个单独的目的.
* 与其它 Kotlin API 一致.
* 与它在 JVM 版中的对应部分具有相似的行为.
* 面向未来.

基于这些考虑, 我们对每个签名进行了下面的某个决定:
* 让它进入稳定版.
* 让它进入实验版.
* 将它变为 `private`.
* 修改它的行为.
* 将它移动到其它地方.
* 废弃它.
* 将它标记为已过时.

> 如果一个现有的签名:
> * 移动到其它包, 那么这个签名会继续存在于原来的包中, 但它现在被废弃, 废弃级别为: `WARNING`.
>   IntelliJ IDEA 会在代码审查后自动建议替换.
> * 被废弃, 那么它已被废弃, 废弃级别为: `WARNING`.
> * 被标记为已过时, 那么你可以继续使用它, 但将来它会被替换.
{:.note}

我们不会在这里列出这次审查的全部结果, 但下面是一些重要的部分:
* 我们让 Atomics API 进入了稳定版.
* 我们让 [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/) 进入了实验版,
  使用这个包, 现在会要求另一种使用者同意(Opt-in). 更多详情, 请参见 [显式 C 互操作性 稳定性保证](#explicit-c-interoperability-stability-guarantees).
* 我们将 [`Worker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker/) 类和它的相关 API 标记为已过时.
* 我们将 [`BitSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-bit-set/) 类标记为已过时.
* 我们将 `kotlin.native.internal` 包中的所有 `public` API 标记为 `private`, 或移动到了其它包.

#### 显式 C 互操作性 稳定性保证

为了保护我们的 API 的高质量, 我们决定让 [`kotlinx.cinterop`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/)
进入实验版.
尽管 `kotlinx.cinterop` 已经经过了彻底的试用和测试,
但在我们感到足够满意, 让它进入稳定版之前, 还存在改进的空间.
我们建议你使用这些 API 进行互操作, 但你应该将这些 API 的使用限制在你的项目中的特定部分.
当我们开始改进这个 API, 让它进入稳定版时, 这样可以让你的迁移工作更加容易.

如果你想要使用 C 风格的外部 API, 例如指针, 你必须使用 `@OptIn(ExperimentalForeignApi)` 标注使用者同意, 否则你的代码将不能编译.

要使用 `kotlinx.cinterop` 的其它部分, 包括 Objective-C/Swift 的互操作性, 你需要使用 `@OptIn(BetaInteropApi)` 标注使用者同意.
如果你使用这个 API 但没有标注使用者同意, 你的代码能够编译, 但编译器会提示警告, 对于你会遇到什么样的结果, 警告信息会提供一个清晰的解释.

关于这些注解, 更过详情请参见我们 [`Annotations.kt`](https://github.com/JetBrains/kotlin/blob/56b729f1812733cb6a79673684c2fa5c4c6b3475/kotlin-native/Interop/Runtime/src/main/kotlin/kotlinx/cinterop/Annotations.kt) 的源代码.

关于这次审查带来的 **全部** 变更, 更多详情请参见我们的 [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-55765).

我们欢迎你提供反馈意见! 你可以在这个 [ticket](https://youtrack.jetbrains.com/issue/KT-57728) 中添加评论, 提供你的反馈意见.

### @Volatile 注解进入稳定版

如果你使用 `@Volatile` 注解标注一个 `var` 属性, 那么它的后端域变量(Backing Field) 会被标注这个注解,
使得对这个域变量的所有读写操作都是原子化的, 而且写入操作永远对其它线程可见.

在 1.8.20 之前, [`kotlin.jvm.Volatile` 注解](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-volatile/)
存在于在共通标准库中. 但是, 这个注解只对 JVM 有效.
如果你在其它平台上使用它, 它会被忽略, 因此导致错误.

在 1.8.20 中, 我们引入了一个实验性的共通注解, `kotlin.concurrent.Volatile`, 你可以在 JVM 和 Kotlin/Native 中试用.

在 1.9.0 中, `kotlin.concurrent.Volatile` 进入了稳定版.
如果你在你的跨平台项目中使用 `kotlin.jvm.Volatile`, 我们建议你迁移到 `kotlin.concurrent.Volatile`.

### 新的共通函数, 根据名称获取正规表达式中捕获的组

在 1.9.0 之前, 每个平台都有自己的扩展, 用于根据名称获取正规表达式中捕获的组.
但是, 没有共通的函数.
在 Kotlin 1.8.0 之前, 无法实现这样的共通函数, 因为标准库还支持 JVM 编译目标 1.6 和 1.7.

从 Kotlin 1.8.0 开始, 标准库使用 JVM 编译目标 1.8 来编译.
因此在 1.9.0 中, 现在有了 **共通的** 
[`groups`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-match-result/groups.html) 函数,
你可以用来获取名称获取正规表达式中捕获的组的内容.
当你想要访问属于特定捕获组的正规表达式匹配结果时, 这会非常有用.

下面是一个示例, 使用正规表达式, 包含 3 个捕获组: `city`, `state`, 和 `areaCode`.
你可以使用这些组的名称来访问匹配的值:

```kotlin
fun main() {
    val regex = """\b(?<city>[A-Za-z\s]+),\s(?<state>[A-Z]{2}):\s(?<areaCode>[0-9]{3})\b""".toRegex()
    val input = "Coordinates: Austin, TX: 123"
    
    val match = regex.find(input)!!
    println(match.groups["city"]?.value)
    // 输出结果为 Austin
    println(match.groups["state"]?.value)
    // 输出结果为 TX
    println(match.groups["areaCode"]?.value)
    // 输出结果为 123
}
```

### 新的路径工具函数, 用于创建父目录

在 1.9.0 中, 有一个新的 `createParentDirectories()` 扩展函数, 你可以用来创建一个新的文件, 如果需要, 还会创建所有的父目录.
如果你向 `createParentDirectories()` 指定一个文件路径, 它会检查父目录是否已经存在.
如果存在, 则不做处理. 但是, 如果父目录不存在, 它会为你创建这些父目录.

`createParentDirectories()` 在你复制文件时非常有用.
例如, 你可以结合 `copyToRecursively()` 函数来使用它:

```kotlin
sourcePath.copyToRecursively(
    destinationPath.createParentDirectories(), 
    followLinks = false
 )
```

### 新的 HexFormat 类, 用于 16 进制数的格式化和解析

> 新的 `HexFormat` 类以及相关的扩展函数是 [实验性功能](components-stability.html#stability-levels-explained),
> 要使用它们, 你可以使用 `@OptIn(ExperimentalStdlibApi::class)` 注解标注使用者同意(Opt-in),
> 或者使用编译器参数 `-opt-in=kotlin.ExperimentalStdlibApi`.
{:.warning}

在 1.9.0 中, [`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/)
类以及相关的扩展函数作为实验性的功能提供, 允许你对数字和 16 进制字符串进行转换.
具体来说, 你可以使用扩展函数对 16 进制字符串和 `ByteArrays` 或其他数字类型 (`Int`, `Short`, `Long`) 进行转换.

例如:

```kotlin
println(93.toHexString()) // 输出结果为 "0000005d"
```

`HexFormat` 类包含格式化选项, 你可以使用 `HexFormat{}` 构建器进行配置.

如果你在使用 `ByteArrays`, 你可以通过属性配置以下选项:

| 选项                     | 描述                                                |
|------------------------|---------------------------------------------------|
| `upperCase`            | 16 进制数字是大写还是小写. 默认情况下, 使用小写. `upperCase = false`. |
| `bytes.bytesPerLine`   | 每行最大字节数.                                          |
| `bytes.bytesPerGroup`  | 每组最大字节数.                                          |
| `bytes.bytesSeparator` | 字节之间的分隔符. 默认没有分隔符.                                |
| `bytes.bytesPrefix`    | 前缀字符串, 紧接在每个字节的 2 字符 16 进制表达之前, 默认没有前缀字符串.        |
| `bytes.bytesSuffix`    | 后缀字符串, 紧接在每个字节的 2 字符 16 进制表达之后, 默认没有后缀字符串.        |

示例:

```kotlin
val macAddress = "001b638445e6".hexToByteArray()

// 使用 HexFormat{} 构建器, 在 16 进制字符串之间使用冒号分隔
println(macAddress.toHexString(HexFormat { bytes.byteSeparator = ":" }))
// 输出结果为 "00:1b:63:84:45:e6"

// 使用 HexFormat{} 构建器进行配置:
// * 对 16 进制字符串使用大写字符
// * 每 2 个字节分为 1 组
// * 使用点号分隔
val threeGroupFormat = HexFormat { upperCase = true; bytes.bytesPerGroup = 2; bytes.groupSeparator = "." }

println(macAddress.toHexString(threeGroupFormat))
// 输出结果为 "001B.6384.45E6"
```

如果你在使用数字类型, 你可以通过属性配置以下选项:

| 选项 | 描述                                                                                            |
|--|-----------------------------------------------------------------------------------------------|
| `number.prefix` | 16 进制字符串的前缀, 默认没有前缀.                                                                          |
| `number.suffix` | 16 进制字符串的后缀, 默认没有后缀.                                                                          |
| `number.removeLeadingZeros` | 是否删除 16 进制字符串中的前导 0. 默认不删除前导 0. `number.removeLeadingZeros = false` |

示例:

```kotlin
// 使用 HexFormat{} 构建器, 解析 16 进制字符串, 前缀为: "0x".
println("0x3a".hexToInt(HexFormat { number.prefix = "0x" })) // 输出结果为 "58"
```

## 文档更新

Kotlin 文档有了一些重要变更:
* [Kotlin 观光之旅](tour/kotlin-tour-welcome.html) – 通过理论和实践章节, 学习 Kotlin 编程语言的基础知识.
* [Android 源代码集布局](multiplatform/multiplatform-android-layout.html) – 了解新的 Android 源代码集布局.
* [Kotlin Multiplatform 兼容性指南](multiplatform/multiplatform-compatibility-guide.html) – 了解使用 Kotlin Multiplatform 开发项目时你可能遇到的不兼容的变更.
* [Kotlin Wasm](wasm/wasm-overview.html) – 了解 Kotlin/Wasm, 以及在你的 Kotlin Multiplatform 项目中如何使用它.
* [向 Kotlin/Wasm 项目添加 Kotlin 库的依赖项](wasm/wasm-libraries.html) – 了解 Kotlin/Wasm 支持的 Kotlin 库.

## 安装 Kotlin 1.9.0

### 检查 IDE 版本

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2022.3.3 和 2023.1.1 会自动建议将 Kotlin plugin 更新到 1.9.0 版本.
IntelliJ IDEA 2023.2 会包含 Kotlin 1.9.0 plugin.

Android Studio Giraffe (223) 和 Hedgehog (231) 会在后续的发布版中支持 Kotlin 1.9.0.

新的命令行编译器可以通过 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.9.0) 下载.

### 配置 Gradle 的设置

要下载 Kotlin 的 artifact 和依赖项, 请更新你的 `settings.gradle(.kts)` 文件, 使用 Maven Central 仓库:

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

如果没有指定仓库, Gradle 会使用已废弃的 JCenter 仓库, 导致无法下载 Kotlin artifact 的错误.

## Kotlin 1.9.0 兼容性指南

Kotlin 1.9.0 是一个 [功能发布版](kotlin-evolution.html#feature-releases-and-incremental-releases),
因此其中的变更可能不兼容你之前针对旧版本 Kotlin 编写的代码.
关于这样的变更, 详情请参见 [Kotlin 1.9.0 兼容性指南](compatibility-guide-19.html).
