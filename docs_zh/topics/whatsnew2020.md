[//]: # (title: Kotlin 2.0.20 中的新功能)

_[发布日期: 2024/08/22](releases.md#release-details)_

Kotlin 2.0.20 已经发布了!
在 Kotlin 2.0.0 中我们宣布了 Kotlin K2 编译器的稳定版, Kotlin 2.0.20 版包含针对 Kotlin 2.0.0 的性能改善和 bug 修正.
下面是这个发布版中其它一些值得注意的重要内容:

* [数据类的 copy 函数将具有与构造器相同的可见度](#data-class-copy-function-to-have-the-same-visibility-as-constructor)
* [在跨平台项目中, 对来自默认编译目标层级结构的源代码集, 现在可以使用静态访问器](#static-accessors-for-source-sets-from-the-default-target-hierarchy)
* [Kotlin/Native 的垃圾收集器中实现了并发的标记](#concurrent-marking-in-garbage-collector)
* [Kotlin/Wasm 中的 `@ExperimentalWasmDsl` 注解移动到了新的位置](#new-location-of-experimentalwasmdsl-annotation)
* [添加了对 Gradle 版本 8.6–8.8 的支持](#gradle)
* [添加了新选项, 可以在 Gradle 项目间以类文件形式共用 JVM artifact](#option-to-share-jvm-artifacts-between-projects-as-class-files)
* [更新了 Compose 编译器](#compose-compiler)
* [对 UUID 的支持添加到了共通的 Kotlin 标准库](#support-for-uuids-in-the-common-kotlin-standard-library)

## IDE 支持 {id="ide-support"}

最新的 IntelliJ IDEA 和 Android Studio 中捆绑了支持 2.0.20 的 Kotlin plugin.
你不需要在你的 IDE 中更新 Kotlin plugin.
你需要做的只是在你的构建脚本中 [修改 Kotlin 版本](configure-build-for-eap.md) 为 2.0.20.

详情请参见 [更新到新的发布版](releases.md#update-to-a-new-kotlin-version).

## 语言 {id="language"}

从 Kotlin 2.0.20 开始, 引进了一些变更, 以改进数据类中的一致性, 并替换实验性的上下文接受者(Context Receiver)功能.

### 数据类的 copy 函数将具有与构造器相同的可见度 {id="data-class-copy-function-to-have-the-same-visibility-as-constructor"}

目前, 如果你创建一个数据类, 使用 `private` 构造器, 自动生成的 `copy()` 函数的可见度会不同.
这可能之后在你的代码中导致问题.
在将来的 Kotlin 发布版中, 我们将会引入新的行为, 让 `copy()` 函数的默认可见度与构造器相同.
这个变更将会逐步的引入, 以帮助你尽可能平滑的迁移你的代码.

我们的迁移计划从 Kotlin 2.0.20 开始, 这个版本会在你的代码中, 对可见度未来会发生变更的地方发出警告.
例如:

```kotlin
// 在 2.0.20 中, 会触发一个警告
data class PositiveInteger private constructor(val number: Int) {
    companion object {
        fun create(number: Int): PositiveInteger? = if (number > 0) PositiveInteger(number) else null
    }
}

fun main() {
    val positiveNumber = PositiveInteger.create(42) ?: return
    // 在 2.0.20 中, 会触发一个警告
    val negativeNumber = positiveNumber.copy(number = -1)
    // 警告: Non-public primary constructor is exposed via the generated 'copy()' method of the 'data' class.
    // The generated 'copy()' will change its visibility in future releases.
}
```

关于我们的迁移计划, 最新信息请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-11914) 中相应的问题.

为了让你更好的控制这个行为, 在 Kotlin 2.0.20 中我们引入了 2 个注解:

* `@ConsistentCopyVisibility`, 在我们在未来的发布版中将它设置为默认行为之前, 现在就选择性加入这个行为.
* `@ExposedCopyVisibility`, 选择性的退出这个行为, 并在声明处压制警告.
  注意, 即使使用了这个注解, 编译器仍然会在 `copy()` 函数被调用时报告警告.

如果你想要对整个模块而不是对单个的类, 选择性的加入 2.0.20 中的新的行为,
你可以使用 `-Xconsistent-data-class-copy-visibility` 编译器选项.
这个选项的效果, 等于对一个模块中所有的数据类添加 `@ConsistentCopyVisibility` 注解.

### 上下文接受者(Context Receiver)逐步替换为上下文参数(Context Parameter) {id="phased-replacement-of-context-receivers-with-context-parameters"}

在 Kotlin 1.6.20 中, 我们引入了 [实验性](components-stability.md#stability-levels-explained) 功能 [上下文接受者(Context Receiver)](whatsnew1620.md#prototype-of-context-receivers-for-kotlin-jvm).
在听取了社区的反馈之后, 我们决定不再继续使用这个方案, 而是采取不同的方向.

在未来的 Kotlin 发布版中, 上下文接受者(Context Receiver)将被上下文参数(Context Parameter)替换.
上下文参数现在还在设计阶段, 你可以在 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md) 中找到它的提案.

由于上下文参数的实现需要对编译器进行很大的修改, 我们决定不同时支持上下文接受者和上下文参数.
这个决定大大的简化了实现, 并减小了造成不稳定行为的风险.

我们理解上下文接受者已经被大量开发者使用了. 因此, 我们会开始逐步删除对上下文接受者的支持.
我们的迁移计划从 Kotlin 2.0.20 开始, 在你的代码中通过 `-Xcontext-receivers` 编译器选项使用上下文接受者的地方, 这个版本会发出警告.
例如:

```kotlin
class MyContext

context(MyContext)
// 警告: Experimental context receivers are deprecated and will be superseded by context parameters.
// Please don't use context receivers. You can either pass parameters explicitly or use members with extensions.
fun someFunction() {
}
```

在未来的 Kotlin 发布版中, 这个警告会变成错误.

如果在你的代码中使用了上下文接受者, 我们推荐你迁移你的代码, 使用以下两种方式之一:

* 明确指定参数.

   <table>
      <tr>
          <td>迁移之前</td>
          <td>迁移之后</td>
      </tr>
      <tr>
   <td>

   ```kotlin
   context(ContextReceiverType)
   fun someFunction() {
       contextReceiverMember()
   }
   ```

   </td>
   <td>

   ```kotlin
   fun someFunction(explicitContext: ContextReceiverType) {
       explicitContext.contextReceiverMember()
   }
   ```

   </td>
   </tr>
   </table>

* 扩展成员函数 (如果可能的话).

   <table>
      <tr>
          <td>迁移之前</td>
          <td>迁移之后</td>
      </tr>
      <tr>
   <td>

   ```kotlin
   context(ContextReceiverType)
   fun contextReceiverMember() = TODO()
   
   context(ContextReceiverType)
   fun someFunction() {
       contextReceiverMember()
   }
   ```

   </td>
   <td>

   ```kotlin
   class ContextReceiverType {
       fun contextReceiverMember() = TODO()
   }
   
   fun ContextReceiverType.someFunction() {
       contextReceiverMember()
   }
   ```

   </td>
   </tr>
   </table>

或者, 你也可以等待编译器支持上下文参数的 Kotlin 发布版.
注意, 上下文参数最初会作为实验性功能引入.

## Kotlin Multiplatform {id="kotlin-multiplatform"}

Kotlin 2.0.20 brings 改进了跨平台项目中的源代码集管理,
并且由于 Gradle 的最新变更, 废弃了对一些 Gradle Java plugin 的兼容性.

### 来自默认编译目标层级结构的源代码集的静态访问器 {id="static-accessors-for-source-sets-from-the-default-target-hierarchy"}

从 Kotlin 1.9.20 开始, [默认层级结构模板](multiplatform-hierarchy.md#default-hierarchy-template)
会自动适用到所有的 Kotlin Multiplatform 项目.
并且, 对来自默认层级结构模板的所有源代码集, Kotlin Gradle plugin 提供了类型安全的访问器.
通过这种方式, 你可以访问所有指定的编译目标的源代码集, 不必使用使用 `by getting` 或 `by creating` 构造.

Kotlin 2.0.20 致力于进一步改善你的 IDE 使用体验.
现在它在 `sourceSets {}` 代码块中, 对来自默认层级结构模板的所有源代码集, 提供静态的访问器.
我们相信这个变更 可以让通过名称访问源代码集 变得更容易, 更可预测.

每个这样的源代码集现在有一个带有示例的详细的 KDoc 注释,
以及一个带警告的诊断信息, 以防你在没有预先声明对应的编译目标之前, 尝试访问源代码集:

```kotlin
kotlin {
    jvm()
    linuxX64()
    linuxArm64()
    mingwX64()

    sourceSets {
        commonMain.languageSettings {
            progressiveMode = true
        }

        jvmMain { }
        linuxX64Main { }
        linuxArm64Main { }
        // 警告: accessing source set without registering the target
        iosX64Main { }
    }
}
```

![通过名称访问源代码集](accessing-sourse-sets.png){width=700}

详情请参见 [Kotlin Multiplatform 中的层级项目结构](multiplatform-hierarchy.md).

### 废弃 Kotlin Multiplatform Gradle plugin 和 Gradle Java plugin 的兼容性 {id="deprecated-compatibility-with-kotlin-multiplatform-gradle-plugin-and-gradle-java-plugins"}

在 Kotlin 2.0.20 中, 我们引入了一个废弃警告,
如果你将 Kotlin Multiplatform Gradle plugin 和以下任何一个 Gradle Java plugin 应用于同一个项目: [Java](https://docs.gradle.org/current/userguide/java_plugin.html),
[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html), 以及 [Application](https://docs.gradle.org/current/userguide/application_plugin.html), 就会发生这个警告.
当你的跨平台项目中的另一个 Gradle plugin 应用某个 Gradle Java plugin 时, 这个警告也会出现.
例如, [Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/gradle-plugin/index.html) 会自动应用 Application plugin.

我们添加这个废弃警告, 是由于 Kotlin Multiplatform 的项目模型与 Gradle 的 Java 生态系统 plugin 之间存在根本性的兼容问题.
Gradle 的 Java 生态系统 plugin 目前没有考虑其他 plugin 可能会:

* 通过与 Java 生态系统 plugin 不同的方式, 针对 JVM 编译目标进行发布或编译.
* 在同一个项目中存在两种不同的 JVM 编译目标, 例如 JVM 和 Android.
* 具有复杂的跨平台项目结构, 其中可能存在多个非 JVM 编译目标.

不幸的是, Gradle 目前没有提供任何 API 来解决这些问题.

我们之前在 Kotlin Multiplatform 中使用了一些变通方法, 来帮助与 Java 生态系统 plugin 的集成.
但是, 这些变通方法未能真正解决兼容性问题, 而且从 Gradle 8.8 发布版开始, 这些变通方法也变得不再可行.
详情请参见, 我们的 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning).

尽管我们不知道如何解决这个兼容性问题, 但我们致力于继续支持你的 Kotlin Multiplatform 项目中的某种形式的 Java 源代码编译能力.
最小限度, 我们将会支持你的跨平台项目中的 Java 源代码编译,
以及使用 Gradle 的 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html)
plugin.

与此同时, 如果在你的跨平台项目中看到这个废弃警告, 我们推荐你进行以下步骤:
1. 确定你的项目中是否真的需要 Gradle Java plugin. 如果不需要, 请考虑删除它.
2. 检查 Gradle Java plugin 是否只用于单个 task. 如果是, 你可能可以删除 plugin, 而不产生大的影响.
   例如, 如果 task 使用一个 Gradle Java plugin 来创建一个 Javadoc JAR 文件, 你可以改为手动定义 Javadoc task.

或者, 如果你想要在你的跨平台项目中同时使用 Kotlin Multiplatform Gradle plugin, 和这些针对 Java 的 Gradle plugin,
我们推荐你进行以下步骤:

1. 在你的跨平台项目中, 创建一个单独的子项目.
2. 在单独的子项目中, 应用针对 Java 的 Gradle plugin.
3. 在单独的子项目中, 添加一个对你的父跨平台项目的依赖项.

> 单独的子项目必须 **不是** 一个跨平台项目, 而且你必须只使用它来设置对你的跨平台项目的依赖项.
>
{style="warning"}

例如, 你有一个跨平台项目, 名为 `my-main-project`,
而且你想要使用 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle plugin,
来运行一个 JVM 应用程序.

首先你创建一个子项目, 我们叫它 `subproject-A`, 你的父项目结构应该类似这样:

```text
.
├── build.gradle.kts
├── settings.gradle
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

在你的子项目的 `build.gradle.kts` 文件中, 在 `plugins {}` 代码块中应用 Application plugin:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("application")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id('application')
}
```

</tab>
</tabs>

在你的子项目的 `build.gradle.kts` 文件中, 添加一个对你的父跨平台项目的依赖项:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(project(":my-main-project")) // 你的父跨平台项目的名称
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // 你的父跨平台项目的名称
}
```

</tab>
</tabs>

现在你的父项目已经设置完成, 可以同时使用两种 plugin.

## Kotlin/Native {id="kotlin-native"}

Kotlin/Native 改进了垃圾收集器, 以及从 Swift/Objective-C 代码中调用 Kotlin 挂起函数.

### 垃圾收集器中的并发标记 {id="concurrent-marking-in-garbage-collector"}

在 Kotlin 2.0.20 中, JetBrains 开发组对于改进 Kotlin/Native 的运行期性能, 又有了新的进展.
我们对垃圾收集器(GC)中的并发标记, 添加了实验性的支持.

默认情况下, 当 GC 正在标记堆中的对象时, 应用程序线程必须暂停.
这个问题极大的影响了 GC 暂停时间的持续时间, 对于延迟很敏感的应用程序,
例如使用 Compose Multiplatform 构建的 UI 应用程序, 这是非常重要的问题.

现在, 垃圾收集的标记阶段可以与应用程序线程同时运行.
这可以显著缩短 GC 暂停时间, 有助于改善 App 的响应能力.

#### 如何启用 {id="how-to-enable"}

这个功能目前是 [实验性功能](components-stability.md#stability-levels-explained).
要启用它, 请在你的 `gradle.properties` 文件中设置以下选项:

```none
kotlin.native.binary.gc=cms
```

如果遇到任何问题, 请报告到我们的问题追踪系统 [YouTrack](https://kotl.in/issue).

### 删除了对 Bitcode 内嵌功能(Bitcode embedding)的支持 {id="support-for-bitcode-embedding-removed"}

从 Kotlin 2.0.20 开始, Kotlin/Native 编译器不再支持 Bitcode 内嵌(Bitcode embedding).
Bitcode 内嵌在 Xcode 14 中已被废弃, 并在 Xcode 15 中对所有的 Apple 编译目标删除.

现在, 用于框架配置的 `embedBitcode` 参数,
以及 `-Xembed-bitcode` 和 `-Xembed-bitcode-marker` 命令行参数, 已经被废弃了.

如果你还在使用更早版本的 Xcode, 但想要升级到 Kotlin 2.0.20, 请在你的 Xcode 项目中禁用 Bitcode 内嵌.

### 使用 signpost 进行 GC 性能监控的变更 {id="changes-to-gc-performance-monitoring-with-signposts"}

Kotlin 2.0.0 可以通过 Xcode Instruments 监控 Kotlin/Native 垃圾收集器(GC) 的性能.
Instruments 包含 signpost 工具, 可以将 GC 暂停作为事件显示.
在检查你的 iOS App 中的与 GC 相关冻结时, 这个功能非常有用.

这个功能默认启用, 但不幸的是, 在应用程序与 Xcode Instruments 同时运行时, 它有时会导致崩溃.
从 Kotlin 2.0.20 开始, 需要使用以下编译器选项, 明确的使用者同意(Opt-in):

```none
-Xbinary=enableSafepointSignposts=true
```

关于 GC 性能分析, 详情请参见 [文档](native-memory-manager.md#monitor-gc-performance).

### 能够从 Swift/Objective-C 中, 在非主线程上调用 Kotlin 挂起函数 {id="ability-to-call-kotlin-suspending-functions-from-swift-objective-c-on-non-main-threads"}

以前, Kotlin/Native 存在一个默认的限制,
从 Swift 和 Objective-C 调用 Kotlin 挂起函数被限制为必须是主线程.
Kotlin 2.0.20 解除了这个限制, 允许你从 Swift/Objective-C, 在任何线程上运行 Kotlin `suspend` 函数.

如果你之前使用二进制选项 `kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none`,
从默认行为切换到了非主线程, 那么你现在可以从你的 `gradle.properties` 文件删除这个选择.

## Kotlin/Wasm {id="kotlin-wasm"}

在 Kotlin 2.0.20, Kotlin/Wasm 继续向命名导出(Named Export) 迁移, 并移动了 `@ExperimentalWasmDsl` 注解的位置.

### 使用默认导出时的错误 {id="error-in-default-export-usage"}

作为向命名导出(Named Export)迁移的一部分,
在 JavaScript 中使用 Kotlin/Wasm 导出的一个默认导入时, 之前的版本会打印输出一个警告消息到控制台.

为了完全支持命名导出, 这个警告现在升级为错误. 如果你使用一个默认导入, 你会遇到以下错误消息:

```text
Do not use default import. Use the corresponding named import instead.
```

这个变更是向命名导出迁移的废弃循环的一部分.
每个阶段预期的动作是:

* **在 2.0.0 版中**: 会打印输出一个警告消息到控制台, 解释说通过默认导出方式导出实体已被废弃.
* **在 2.0.20 版中**: 会发生一个错误, 要求使用相应命名的导入.
* **在 2.1.0 版中**: 默认导入的使用会被完全删除.

### ExperimentalWasmDsl 注解移动到了新的位置 {id="new-location-of-experimentalwasmdsl-annotation"}

之前, 针对 WebAssembly (Wasm) 功能的 `@ExperimentalWasmDsl` 注解放在 Kotlin Gradle plugin 内的这个位置:

```Kotlin
org.jetbrains.kotlin.gradle.targets.js.dsl.ExperimentalWasmDsl
```

在 2.0.20 中, `@ExperimentalWasmDsl` 注解移动到了:

```Kotlin
org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

之前的位置已被废弃, 会发生未解析的引用, 导致构建失败.

要反应 `@ExperimentalWasmDsl` 注解的新位置 , 请更新你的 Gradle 构建脚本中的 import 语句.
对 `@ExperimentalWasmDsl` 的新位置, 使用明确的 import:

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalWasmDsl
```

或者, 删除这个使用星号从旧包导入的 import 语句:

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.dsl.*
```

## Kotlin/JS {id="kotlin-js"}

Kotlin/JS 引入了一些实验性功能, 在 JavaScript 中支持静态成员, 以及在 JavaScript 中创建 Kotlin 集合.

### 支持在 JavaScript 中使用 Kotlin 静态成员 {id="support-for-using-kotlin-static-members-in-javascript"}

> 这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
> 请注意, 只为评估目的来使用这个功能.
> 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-18891/JS-provide-a-way-to-declare-static-members-JsStatic) 提供你的反馈意见.
>
{style="warning"}

从 Kotlin 2.0.20 开始, 你可以使用 `@JsStatic` 注解.
它的功能类似于 [@JvmStatic](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/),
指示编译器为目标声明生成额外的静态方法.
这可以帮助你在 JavaScript 中直接使用你的 Kotlin 代码中的静态成员.

你可以对命名对象中定义的函数使用 `@JsStatic` 注解, 也可以用于在类和接口内部声明的同伴对象(Companion Object)中定义的函数.
编译器会生成对象的一个静态方法, 以及对象自身中的实例方法. 例如:

```kotlin
class C {
    companion object {
        @JsStatic
        fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

现在, 在 JavaScript 中, `callStatic()` 是静态的, 而 `callNonStatic()` 不是:

```javascript
C.callStatic();              // 可以运行, 访问静态函数
C.callNonStatic();           // 错误, 在生成的 JavaScript 中, 不是一个静态函数
C.Companion.callStatic();    // 实例方法继续存在
C.Companion.callNonStatic(); // 唯一可行的方法
```

`@JsStatic` 注解也可以应用于一个对象或一个同伴对象的属性,
让它的 get 和 set 方法变成这个对象中的静态成员, 或包含同伴对象的类中的静态成员.

### 能够在 JavaScript 中创建 Kotlin 集合 {id="ability-to-create-kotlin-collections-from-javascript"}

> 这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
> 请注意, 只为评估目的来使用这个功能.
> 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-69133/Kotlin-JS-Add-support-for-collection-instantiation-in-JavaScript) 提供你的反馈意见.
>
{style="warning"}

Kotlin 2.0.0 引入了将 Kotlin 集合导出到 JavaScript (以及 TypeScript) 的功能.
现在, JetBrains 开发组正在进一步改进集合的互操作能力.
从 Kotlin 2.0.20 开始, 能够在 JavaScript/TypeScript 端直接创建 Kotlin 集合.

你可以在 JavaScript 中创建 Kotlin 集合, 然后它们作为参数传递给导出的构造器或函数.
只要你在导出的声明中提到一个集合, Kotlin 就会对集合生成一个工厂, 在 JavaScript/TypeScript 中可以使用这个工厂.

我们来看看下面这个导出的函数:

```kotlin
// Kotlin
@JsExport
fun consumeMutableMap(map: MutableMap<String, Int>)
```

由于提到了 `MutableMap` 集合, Kotlin 生成一个对象, 带有一个工厂方法, 可以在 JavaScript/TypeScript 中使用.
然后这个工厂方法会从一个 JavaScript `Map` 创建一个 `MutableMap`:

```javascript
// JavaScript
import { consumeMutableMap } from "an-awesome-kotlin-module"
import { KtMutableMap } from "an-awesome-kotlin-module/kotlin-kotlin-stdlib"

consumeMutableMap(
    KtMutableMap.fromJsMap(new Map([["First", 1], ["Second", 2]]))
)
```

这个功能也适用于 `Set`, `Map`, 和 `List` Kotlin 集合类型, 以及它们对应的可变集合类型.

## Gradle {id="gradle"}

Kotlin 2.0.20 完全兼容于 Gradle 6.8.3 到 8.6 版本.
也支持 Gradle 8.7 和 8.8, 但存在一个例外:
如果你使用 Kotlin Multiplatform Gradle plugin, 在你的跨平台项目中调用
[JVM 编译目标中的 `withJava()` 函数](multiplatform-dsl-reference.md#jvm-targets)
时, 你可能会看到废弃警告.
我们计划尽快修正这个问题.

详情请参见这个 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning).

你也可以使用最新的 Gradle 发布版, 但如果你这样做, 请记住, 你可能遇到废弃警告, 或者 Gradle 的某些新功能可能无法工作.

这个版本带来了一些变更, 例如,
开始了旧的基于 JVM 历史文件的增量编译方案的废弃过程,
以及在项目之间共用 JVM artifact 的一种新方式.

### 废弃了基于 JVM 历史文件的增量编译 {id="deprecated-incremental-compilation-based-on-jvm-history-files"}

在 Kotlin 2.0.20 中, 基于 JVM 历史文件的增量编译方案已被废弃,
改为使用新的增量编译方案, 这个新方案从 Kotlin 1.8.20 开始默认启用.

基于 JVM 历史文件的增量编译方案存在很多限制, 例如, 不能与 [Gradle 的构建缓存](https://docs.gradle.org/current/userguide/build_cache.html) 一起工作,
以及不支持编译回避(Compilation Avoidance).
相比之下, 新的增量编译方案解决了这些限制, 而且自引入依赖一直表现良好.

由于新的增量编译方案在 Kotlin 过去的两个主发布版中已经默认使用,
因此在 Kotlin 2.0.20 中, Gradle 属性 `kotlin.incremental.useClasspathSnapshot` 已被废弃.
所以, 如果你使用它来选择性禁用(opt out), 你会看到一个废弃警告.

### 用于在项目间以类文件形式共用 JVM artifact 的选项 {id="option-to-share-jvm-artifacts-between-projects-as-class-files"}

> 这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
> 请注意, 只为评估目的来使用这个功能.
> 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 提供你的反馈意见.
> 需要使用者同意(Opt-in) (详情见下文).
>
{style="warning"}

在 Kotlin 2.0.20 中, 我们引入了一个新方案, 改变了 Kotlin/JVM 的编译输出, 例如 JAR 文件, 在项目间共用的方式.
通过这个方案, Gradle 的 `apiElements` 配置现在有了另一个变体, 它提供对包含编译后的 `.class` 文件的目录的访问.
配置后, 你的项目在编译中会使用这个目录, 而不是请求压缩的 JAR artifact.
这样可以减少 JAR 文件压缩和解压缩的次数, 尤其是对于增量构建的情况.

我们的测试显示, 这个新方案可以对 Linux 和 macOS 主机实现构建性能的改善.
但是, 在 Windows 主机上, 我们看到了性能的下降, 这是由于 Windows 使用文件时处理 I/O 操作的方式造成的.

要试用这个新方案, 请向你的 `gradle.properties` 文件添加以下属性:

```none
kotlin.jvm.addClassesVariant=true
```

默认情况下, 这个属性被设置为 `false`, Gradle 中的 `apiElements` 变体会请求压缩的 JAR artifact.

> Gradle 有一个相关的属性, 你可以在你的纯 Java 项目中使用这个属性, 在编译中只暴露压缩的 JAR artifact,
> **而不是** 包含编译后的 `.class` 文件的目录:
>
> ```none
> org.gradle.java.compile-classpath-packaging=true
> ```
>
> 关于这个属性以及它的用途, 详情请参见 Gradle 文档:
> [在 Windows 上, 对大型多项目的构建性能显著下降](https://docs.gradle.org/current/userguide/java_library_plugin.html#sub:java_library_known_issues_windows_performance).
>
{style="note"}

我们希望你对这个新方案提出反馈意见. 你在使用它时是否注意到了任何性能改善?
请在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-61861/Gradle-Kotlin-compilations-depend-on-packed-artifacts) 中留下评论, 告诉我们.

### 对编译 task 缺少一个 artifact 的罕见情况添加了 task 依赖项 {id="added-task-dependency-for-rare-cases-when-the-compile-task-lacks-one-on-an-artifact"}

在 2.0.20 之前, 我们发现存在某些情况, 一个编译 task 缺少对它的 artifact 输入的 task 依赖项.
这意味着被依赖的编译 task 的结果是不稳定的, 因为有些时候 artifact 能够及时生成, 但有些时候不会.

为了解决这个问题, Kotlin Gradle plugin 现在会在这样的情况下自动添加需要的 task 依赖项.

在非常罕见的情况下, 我们发现这个新的行为可能导致循环依赖项的错误.
例如, 如果你有多个编译, 其中一个编译可以看到另一个编译的所有内部声明,
而且生成的 artifact 依赖于两个编译 task 的输出, 你可能看到类似这样的错误:

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

为了修正这个循环依赖项的错误, 我们添加了一个 Gradle 属性: `archivesTaskOutputAsFriendModule`.

默认情况下, 这个属性设置为 `true`, 会追踪 task 依赖项.
要在编译 task 中禁止使用 artifact, 使得不需要 task 依赖项,
请在你的 `gradle.properties` 文件中添加以下内容:

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

详情请参见这个 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-69330).

## Compose 编译器 {id="compose-compiler"}

在 Kotlin 2.0.20 中, Compose 编译器有了一些改进.

### 修正了 2.0.0 中引入的不必要的重新组合(recomposition)问题 {id="fix-for-the-unnecessary-recompositions-issue-introduced-in-2-0-0"}

Compose 编译器 2.0.0 存在一个问题, 在带有非 JVM 编译目标的跨平台项目中, 它有时会错误的推断类型的稳定性.
这可能导致不必要的 (甚至无限的) 重新组合(recomposition).
我们强烈推荐将使用 Kotlin 2.0.0 构建的 Compose Apps 更新到 2.0.10 或更高版本.

如果你的 App 使用 Compose 编译器 2.0.10 或更高版本构建, 但使用了 2.0.0 版本构建的依赖项,
这些旧的依赖项仍然可能导致重新组合(recomposition)问题.
要防止这个问题, 请更新依赖项, 使用与你的 App 相同的 Compose 编译器构建的版本.

### 配置编译器选项的新方式 {id="new-way-to-configure-compiler-options"}

我们引入了一个新的选项配置机制, 以避免顶级(top-level)参数的混乱.
对于 Compose 编译器开发组来说, 通过创建或删除`composeCompiler {}` 代码块的顶级(top-level) 元素来进行测试, 是很困难的.
因此, 现在可以通过 `featureFlags` 属性, 启用一些选项,
例如, 强跳过模式(Strong Skipping Mode), 以及非跳过组优化(Non-skipping Group Optimization).
这个属性会被用于测试新的 Compose 编译器选项, 这些选项将来会成为默认选项.

这个变更也也应用于 Compose 编译器的 Gradle plugin.
要配置功能标记(feature flag), 请使用以下语法(这段代码会翻转所有的默认值):

```kotlin
composeCompiler {
    featureFlags = setOf(
        ComposeFeatureFlag.IntrinsicRemember.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups,
        ComposeFeatureFlag.StrongSkipping.disabled()
    )
}
```

或者, 如果你直接配置 Compose 编译器, 请使用以下语法:

```text
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=IntrinsicRemember
```

因此, `enableIntrinsicRemember`, `enableNonSkippingGroupOptimization`, 和 `enableStrongSkippingMode` 属性已被废弃.

我们希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-68651/Compose-provide-a-single-place-in-extension-to-configure-all-compose-flags) 对这个新方案提出反馈意见.

### 默认启用强跳过模式(Strong Skipping Mode) {id="strong-skipping-mode-enabled-by-default"}

Compose 编译器的强跳过模式(Strong Skipping Mode)现在默认启用.

强跳过模式是一个 Compose 编译器配置选项, 它会改变可以跳过哪些可组合项(Composable)的规则.
启用强跳过模式后, 带有不稳定的参数的可组合项(Composable)现在也可以跳过.
强跳过模式还会自动记住 composable 函数中使用的 Lambda 表达式,
因此你不再需要使用 `remember` 包装你的 Lambda 表达式, 来避免重新组合(recomposition).

详情请参见 [强跳过模式文档](https://developer.android.com/develop/ui/compose/performance/stability/strongskipping).

### 默认启用组合追踪标记器(Composition Trace Marker) {id="composition-trace-markers-enabled-by-default"}

Compose 编译器 Gradle plugin 中的 `includeTraceMarkers` 选项现在默认设置为 `true`, 以匹配编译器 plugin 中的默认值.
这可以让你在 Android Studio 的 system trace profiler 中看到 composable 函数.
关于组合追踪, 详情请参见这篇 [Android Developers blog](https://medium.com/androiddevelopers/jetpack-compose-composition-tracing-9ec2b3aea535).

### 非跳过组优化(Non-skipping Group Optimization) {id="non-skipping-group-optimizations"}

这个发布版包含一个新的编译器选项:
启用时, 不可跳过的(non-skippable)和不可重启的(non-restartable) composable 函数将不会围绕 composable 函数体生成一个组.
这会使得分配次数更少, 并改进性能.
这个选项是实验性功能, 默认禁用, 但可以如 [上文](#new-way-to-configure-compiler-options) 讲到的那样,
通过功能标记(feature flag) `OptimizeNonSkippingGroups` 启用.

这个功能标记已经准备好进行更加广泛的测试.
在启用这个功能时发现的任何问题, 可以提交到这个 [Google issue tracker](https://goo.gle/compose-feedback).

### 支持抽象 composable 函数中的默认参数 {id="support-for-default-parameters-in-abstract-composable-functions"}

你现在可以向抽象 composable 函数添加默认参数.

以前, 如果这样做, Compose 编译器会报告错误, 尽管这是正确的 Kotlin 代码.
我们现在在 Compose 编译器中添加了对这个功能的支持, 去掉了这个限制.
对于包含默认 `Modifier` 值的情况, 这个功能特别有用:

```kotlin
abstract class Composables {
    @Composable
    abstract fun Composable(modifier: Modifier = Modifier)
}
```

对于 open composable 函数的默认参数, 在 2.0.20 中仍然受到限制.
这个限制会在未来的发布版中解决.

## 标准库 {id="standard-library"}

标准库现在支持 UUID(Universally Unique Identifier) (实验性功能), 并且包含对 Base64 解码的一些变更.

### 在共通的 Kotlin 标准库中对 UUID 的支持 {id="support-for-uuids-in-the-common-kotlin-standard-library"}

> 这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
> 要表示使用者同意(Opt-in), 请使用 `@ExperimentalUuidApi` 注解, 或编译器选项 `-opt-in=kotlin.uuid.ExperimentalUuidApi`.
>
{style="warning"}

Kotlin 2.0.20 在共通的 Kotlin 标准库中引入了一个类来表示 [UUID (universally unique identifier)](https://en.wikipedia.org/wiki/Universally_unique_identifier),
以解决唯一标识项目的问题.

此外, 这个功能还为以下 UUID 相关操作提供了 API:

* 生成 UUID.
* 从字符串表达解析 UUID, 以及将 UUID 格式化为字符串表达.
* 从指定的 128 位值创建 UUID.
* 访问一个 UUID 的 128 位值.

以下示例代码演示这些操作:

```kotlin
// 构造一个 byte 数组, 用于创建 UUID
val byteArray = byteArrayOf(
    0x55, 0x0E, 0x84.toByte(), 0x00, 0xE2.toByte(), 0x9B.toByte(), 0x41, 0xD4.toByte(),
    0xA7.toByte(), 0x16, 0x44, 0x66, 0x55, 0x44, 0x00, 0x00
)

val uuid1 = Uuid.fromByteArray(byteArray)
val uuid2 = Uuid.fromULongs(0x550E8400E29B41D4uL, 0xA716446655440000uL)
val uuid3 = Uuid.parse("550e8400-e29b-41d4-a716-446655440000")

println(uuid1)
// 输出结果为: 550e8400-e29b-41d4-a716-446655440000
println(uuid1 == uuid2)
// 输出结果为: true
println(uuid2 == uuid3)
// 输出结果为: true

// 访问 UUID 的 bit 值
val version = uuid1.toLongs { mostSignificantBits, _ ->
    ((mostSignificantBits shr 12) and 0xF).toInt()
}
println(version)
// 输出结果为: 4

// 生成一个随机的 UUID
val randomUuid = Uuid.random()

println(uuid1 == randomUuid)
// 输出结果为: false
```

为了维持与使用 `java.util.UUID` 的 API 的兼容性, Kotlin/JVM 中有 2 个扩展函数,
用来在 `java.util.UUID` 和 `kotlin.uuid.Uuid` 之间进行转换: `.toJavaUuid()` 和 `.toKotlinUuid()`.
例如:

```kotlin
val kotlinUuid = Uuid.parseHex("550e8400e29b41d4a716446655440000")
// 将 Kotlin UUID 转换为 java.util.UUID
val javaUuid = kotlinUuid.toJavaUuid()

val javaUuid = java.util.UUID.fromString("550e8400-e29b-41d4-a716-446655440000")
// 将 Java UUID 转换为 kotlin.uuid.Uuid
val kotlinUuid = javaUuid.toKotlinUuid()
```

这个功能和相关的 API, 可以在多个平台之间共用代码, 简化了跨平台软件开发.
在难以生成唯一标识符的环境中, UUID 也是理想的方案.

涉及 UUID 的一些使用场景例子包含:

* 为数据库记录赋予唯一 ID.
* 生成 Web Session 标识符.
* 需要唯一标识符或追踪的其它场景.

### 在 HexFormat 中支持 minLength {id="support-for-minlength-in-hexformat"}

> [`HexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/) 类及其属性是
> [实验性功能](components-stability.md#stability-levels-explained).
> 要表示使用者同意(Opt-in), 请使用 `@OptIn(ExperimentalStdlibApi::class)` 注解,
> 或编译器选项 `-opt-in=kotlin.ExperimentalStdlibApi`.
>
{style="warning"}

Kotlin 2.0.20 向 [`NumberHexFormat`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/-number-hex-format/) 类添加了一个新的 `minLength` 属性,
通过 [`HexFormat.number`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-hex-format/number.html) 访问.
你可以通过这个属性指定数字值的 16 进制表达的最小位数, 可以填充 0 以满足要求的长度,
使用 `removeLeadingZeros` 属性可以去除前导的 0:

```kotlin
fun main() {
    println(93.toHexString(HexFormat {
        number.minLength = 4
        number.removeLeadingZeros = true
    }))
    // 输出结果为: "005d"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-minlength-hexformat" validate="false"}

`minLength` 属性不影响 16 进制值的解析.
但是, 如果多余的前导数字是 0, 解析现在允许 16 进制字符串存在比类型宽度允许范围更多数字.

### Base64 解码器行为的变更 {id="changes-to-the-base64-s-decoder-behavior"}

> [`Base64` 类](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.encoding/-base64/) 及其相关功能
> 是 [实验性功能](components-stability.md#stability-levels-explained).
> 要表示使用者同意(Opt-in), 请使用 `@OptIn(ExperimentalEncodingApi::class)` 注解,
> 或编译器选项 `-opt-in=kotlin.io.encoding.ExperimentalEncodingApi`.
>
{style="warning"}

在 Kotlin 2.0.20 中, 对 Base64 解码器的行为引入了 2 个变更:

* [Base64 解码器 now requires padding](#the-base64-decoder-now-requires-padding)
* [一个 `withPadding` 函数 has been added for padding 配置](#withpadding-function-for-padding-configuration)

#### Base64 解码器现在要求填充(padding) {id="the-base64-decoder-now-requires-padding"}

Base64 编码器现在默认会添加填充(padding), 解码器要求填充, 并在解码时禁止非 0 的填充位.

#### 用于填充(padding)配置的 withPadding 函数 {id="withpadding-function-for-padding-configuration"}

引入了一个新的 `.withPadding()` 函数, 使用者可以控制 Base64 编码和解码的填充行为:

```kotlin
val base64 = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT_OPTIONAL)
```

这个函数可以使用不同的填充选项来创建 `Base64` 示例 :

| `PaddingOption`    | 对于编码 | 对于解码   |
|--------------------|------|--------|
| `PRESENT`          | 添加填充 | 要求填充   |
| `ABSENT`           | 省略填充 | 不允许填充  |
| `PRESENT_OPTIONAL` | 添加填充 | 填充是可选项 |
| `ABSENT_OPTIONAL`  | 省略填充 | 填充是可选项 |

你可以使用不同的填充选项创建 `Base64` 实例, 并使用它们编码和解码数据:

```kotlin
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

@OptIn(ExperimentalEncodingApi::class)
fun main() {
    // 将要编码的示例数据
    val data = "fooba".toByteArray()

    // 创建一个 Base64 实例, 使用 URL 安全的字母表, 和 PRESENT 填充选项
    val base64Present = Base64.UrlSafe.withPadding(Base64.PaddingOption.PRESENT)
    val encodedDataPresent = base64Present.encode(data)
    println("Encoded data with PRESENT padding: $encodedDataPresent")
    // 使用 PRESENT 填充选项编码的数据: Zm9vYmE=

    // 创建一个 Base64 实例, 使用 URL 安全的字母表, 和 ABSENT 填充选项
    val base64Absent = Base64.UrlSafe.withPadding(Base64.PaddingOption.ABSENT)
    val encodedDataAbsent = base64Absent.encode(data)
    println("Encoded data with ABSENT padding: $encodedDataAbsent")
    // 使用 ABSENT 填充选项编码的数据: Zm9vYmE

    // 解码回原来的数据
    val decodedDataPresent = base64Present.decode(encodedDataPresent)
    println("Decoded data with PRESENT padding: ${String(decodedDataPresent)}")
    // 使用 PRESENT 填充选项解码的数据: fooba

    val decodedDataAbsent = base64Absent.decode(encodedDataAbsent)
    println("Decoded data with ABSENT padding: ${String(decodedDataAbsent)}")
    // 使用 ABSENT 填充选项解码的数据: fooba
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-2-0-20-base64-decoder" validate="false"}

## 文档更新 {id="documentation-updates"}

Kotlin 文档有了一些重要的更新:

* 改进了 [标准输入 章节](standard-input.md) -
  学习如何使用 Java Scanner 和 `readln()`.
* 改进了 [K2 编译器迁移向导](k2-compiler-migration-guide.md) -
  学习性能改善, 与 Kotlin 库的兼容性, 以及如何处理你的自定义编译器 plugin.
* 改进了 [异常 章节](exceptions.md) -
  学习异常, 如何抛出和捕获它们.
* 改进了 [在 JVM 中使用 JUnit 测试代码 - 教程](jvm-test-using-junit.md) -
  学习如何使用 JUnit 创建测试.
* 改进了 [Interoperability with Swift/Objective-C 章节](native-objc-interop.md) -
  学习如何在 Swift/Objective-C 代码中使用 Kotlin 声明, 以及如何在 Kotlin 代码中使用 Objective-C 声明.
* 改进了 [Swift 包导出设置 章节](native-spm.md) -
  学习如何设置可以被 Swift 包管理器依赖项使用的 Kotlin/Native 输出.

## 安装 Kotlin 2.0.20 {id="install-kotlin-2-0-20"}

从 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 开始,
Kotlin plugin 作为一个包含在 IDE 中的捆绑 plugin 发布.
这意味着你不再能够通过 JetBrains Marketplace 安装这个 plugin.

要更新到新的 Kotlin 版本, 请在你的构建脚本中 [变更 Kotlin 版本](releases.md#update-to-a-new-kotlin-version)
到 2.0.20.
