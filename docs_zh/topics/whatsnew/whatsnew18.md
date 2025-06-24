[//]: # (title: Kotlin 1.8.0 版中的新功能)

_[发布日期: 2022/12/28](releases.md#release-details)_

Kotlin 1.8.0 已经发布了, 以下是它的一些最重要的功能:

* [JVM 平台的新的实验性功能: 目录内容的递归复制或递归删除](#recursive-copying-or-deletion-of-directories)
* [kotlin-reflect 的性能改善](#improved-kotlin-reflect-performance)
* [新的 -Xdebug 编译器选项, 改进调试体验](#a-new-compiler-option-for-disabling-optimizations)
* [`kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 合并到 `kotlin-stdlib`](#updated-jvm-compilation-target)
* [与 Objective-C/Swift 交互能力的改进](#improved-objective-c-swift-interoperability)
* [兼容 Gradle 7.3](#gradle)

## IDE 支持

以下 IDE 可以使用支持 1.8.0 的 Kotlin plugin:

| IDE           | 支持的版本                     |
|---------------|------------------------------------|
| IntelliJ IDEA | 2021.3, 2022.1, 2022.2             |
| Android Studio | Electric Eel (221), Flamingo (222) |

> 在 IntelliJ IDEA 2022.3 中, 你可以将你的项目升级到 Kotlin 1.8.0, 而不必升级 IDE plugin.
>
> 在 IntelliJ IDEA 2022.3 中, 要将已有的项目迁移到 Kotlin 1.8.0, 请将 Kotlin 版本修改为 `1.8.0`,
> 然后重新导入你的 Gradle 项目或 Maven 项目.
>
{style="note"}

## Kotlin/JVM

从 1.8.0 版开始, 编译器可以生成字节码版本对应于 JVM 19 的类.
新的语言版本还包括以下功能:

* [一个编译器选项, 关闭 JVM 注解对象的生成](#ability-to-not-generate-type-use-and-type-parameter-annotation-targets)
* [一个新的 `-Xdebug` 编译器选项, 禁用代码优化](#a-new-compiler-option-for-disabling-optimizations)
* [删除了旧的编译器后端](#removal-of-the-old-backend)
* [支持 Lombok 的 @Builder 注解](#support-for-lombok-s-builder-annotation)

### 不生成 TYPE_USE 和 TYPE_PARAMETER 注解目标(Target)的能力 {id="ability-to-not-generate-type-use-and-type-parameter-annotation-targets"}

如果一个 Kotlin 注解的 Kotlin 注解目标(Target)中包含 `TYPE`,
那么映射的 Java 注解目标会包含 `java.lang.annotation.ElementType.TYPE_USE`.
同样的, Kotlin 注解目标 `TYPE_PARAMETER` 会映射为 Java 注解目标 `java.lang.annotation.ElementType.TYPE_PARAMETER`.
对于 API 级别低于 26 的 Android 用户来说, 这会造成问题, 因为在 API 中不存在这些注解目标.

从 Kotlin 1.8.0 开始, 你可以使用新的编译器选项 `-Xno-new-java-annotation-targets`,
避免生成 `TYPE_USE` 和 `TYPE_PARAMETER` 注解目标.

### 新的编译器选项, 禁止代码优化 {id="a-new-compiler-option-for-disabling-optimizations"}

Kotlin 1.8.0 添加了一个新的 `-Xdebug` 编译器选项, 它会禁止代码优化, 改善调试体验.
目前, 这个选项会对 coroutine 禁用 "was optimized out" 功能.
将来, 我们添加了更多的代码优化之后, 这个选项也会禁用这些代码优化功能.

当你使用挂起函数时, "was optimized out" 功能会优化变量.
如果变量被优化, 调试代码会变得困难, 因为你看不到变量值.

> **绝对不要在产品环境中使用这个选项**: 使用 `-Xdebug` 禁用这个功能,
> 会 [导致内存泄露](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0).
>
{style="warning"}

### 删除了旧的编译器后端 {id="removal-of-the-old-backend"}

在 Kotlin 1.5.0 中, 我们 [宣布了](whatsnew15.md#stable-jvm-ir-backend) 基于 IR 的编译器后端进入 [稳定版](components-stability.md).
因此从 Kotlin 1.4.* 开始的旧的编译器后端已被废弃. 在 Kotlin 1.8.0 中, 我们完全删除了旧的编译器后端.
同时, 我们也删除了编译器选项 `-Xuse-old-backend` 和 Gradle 选项 `useOldBackend`.

### 支持 Lombok 的 @Builder 注解 {id="support-for-lombok-s-builder-annotation"}

由于开发社区大量投票支持 [Kotlin Lombok: Support generated builders (@Builder)](https://youtrack.jetbrains.com/issue/KT-46959),
因此我们决定支持 [@Builder 注解](https://projectlombok.org/features/Builder).

我们还没有支持 `@SuperBuilder` 和 `@Tolerate` 注解的计划,
但如果有足够多的人投票支持
[@SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder)
和 [@Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate)
, 我们可以考虑增加这个功能.

参见 [如何配置 Lombok 编译器插件](lombok.md#gradle).

## Kotlin/Native

Kotlin 1.8.0 包含对 Objective-C 和 Swift 交互能力的改进, 支持 Xcode 14.1, 以及对 CocoaPods Gradle plugin 改进:

* [支持 Xcode 14.1](#support-for-xcode-14-1)
* [Objective-C/Swift 交互能力的改进](#improved-objective-c-swift-interoperability)
* [在 CocoaPods Gradle plugin 中默认使用动态框架(Dynamic framework)](#dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin)

### 支持 Xcode 14.1 {id="support-for-xcode-14-1"}

Kotlin/Native 编译器限制支持 Xcode 的最新稳定版, 14.1. 具体改善的内容包括:

* 对 watchOS 编译目标, 添加了新的 `watchosDeviceArm64` 预设置(preset), 支持 ARM64 平台上的 Apple watchOS.
* Kotlin CocoaPods Gradle plugin 对 Apple 框架不再默认包含 bitcode 嵌入(embedding).
* 更新了平台库, 以反应 Apple 编译目标 Objective-C 框架的变更.

### Objective-C/Swift 交互能力的改进 {id="improved-objective-c-swift-interoperability"}

为了增强 Kotlin 与 Objective-C 和 Swift 的交互能力, 添加了 3 个新的注解:

* [`@ObjCName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-obj-c-name/)
  允许你指定一个在 Swift 或 Objective-C 中更加符合语言习惯的名称, 而不是使用 Kotlin 声明的名称.

  这个注解指示 Kotlin 编译器, 对类, 属性, 参数, 或函数, 使用一个自定义的 Objective-C 和 Swift 名称:

   ```kotlin
   @ObjCName(swiftName = "MySwiftArray")
   class MyKotlinArray {
       @ObjCName("index")
       fun indexOf(@ObjCName("of") element: String): Int = TODO()
   }

   // 使用 ObjCName 注解后的用法
   let array = MySwiftArray()
   let index = array.index(of: "element")
   ```

* [`@HiddenFromObjC`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-hidden-from-obj-c/)
  允许你对 Objective-C 隐藏一个 Kotlin 声明.

  这个注解指示 Kotlin 编译器, 不要将一个函数或属性导出到 Objective-C 以及 Swift.
  这样可以让你的 Kotlin 代码对 Objective-C/Swift 更加友好.

* [`@ShouldRefineInSwift`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-should-refine-in-swift/)
  可以将一个 Kotlin 声明在 Swift 中替换为一个 wrapper.

  这个注解指示 Kotlin 编译器, 将一个函数或属性标记为 `swift_private` 在生成的 Objective-C API 中.
  这样的声明会带上 `__` 前缀, 因此对于 Swift 代码来说不可见.

  你仍然可以在 Swift 代码中使用这些声明, 来创建 Swift 友好的 API, 但在 Xcode 的代码自动完成功能中, 不会显示这些声明.

  关于如何在 Swift 中润色(Refine) Objective-C 声明,
  详情请参见 [Apple 官方文档](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift).

> 这个新注解需要 [使用者同意(Opt-in)](opt-in-requirements.md).
>
{style="note"}

Kotlin 开发组非常感谢 [Rick Clephas](https://github.com/rickclephas) 实现了这些注解.

### CocoaPods Gradle plugin 中默认使用动态框架(Dynamic framework)  {id="dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin"}

从 Kotlin 1.8.0 开始, 由 CocoaPods Gradle plugin 注册的 Kotlin 框架默认使用动态链接.
以前的静态实现与 Kotlin Gradle plugin 的行为不一致.

```kotlin
kotlin {
    cocoapods {
        framework {
            baseName = "MyFramework"
            isStatic = false // 现在默认是 dynamic
        }
    }
}
```

如果你已有的项目使用静态链接类型, 而且你想要升级到 Kotlin 1.8.0 (或者明确修改链接类型), 那么在项目执行时可能会发生错误.
要修正这个错误, 请关闭你的 Xcode 项目, 并在 Podfile 目录中运行 `pod install`.

详情请参见, [CocoaPods Gradle plugin DSL 参考文档](native-cocoapods-dsl-reference.md).

## Kotlin Multiplatform: 新的 Android 源代码集布局

Kotlin 1.8.0 引入了新的 Android 源代码集布局, 替换了以前的目录命名方式, 旧方式容易造成很多误解.

例如, 假设在当前的布局中创建了 2 个 `androidTest` 目录. 一个用于 `KotlinSourceSets`, 另一个用于 `AndroidSourceSets`:

* 这 2 个目录代表不同的含义: Kotlin 的 `androidTest` 属于 `unitTest` 类型, 而 Android 的属于 `integrationTest` 类型.
* 这 2 个目录造成了易于误解的 `SourceDirectories` 布局,
  因为 `src/androidTest/kotlin` 包含 `UnitTest`, 而 `src/androidTest/java` 包含 `InstrumentedTest`.
* 对于 Gradle 配置来说, `KotlinSourceSets` 和 `AndroidSourceSets` 都使用类似的命名方式,
  因此 Kotlin 和 Android 源代码集 `androidTest` 的配置结果是一样的:
  `androidTestImplementation`, `androidTestApi`, `androidTestRuntimeOnly`, 以及 `androidTestCompileOnly`.

为了解决这些问题, 以及其他一些问题, 我们引入了一种新的 Android 源代码集布局.
以下是两种布局的一些关键差别:

#### KotlinSourceSet 命名方式

| 当前的源代码集布局                        | 新的源代码集布局                  |
|----------------------------------------|---------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` 与 `{KotlinSourceSet.name}` 的对应关系如下:

|               | 当前源代码集布局           | 新的源代码集布局                  |
|--------------|---------------------------|--------------------------------|
| main         | androidMain               | androidMain                    |
| test         | androidTest               | android<b>Unit</b>Test         |
| androidTest  | android<b>Android</b>Test | android<b>Instrumented</b>Test |

#### SourceDirectories

| 当前源代码集布局                           | 新的源代码集布局                                                    |
|-------------------------------------------|-------------------------------------------------------------------|
| 布局会添加额外的 `/kotlin` 源代码目录 | `src/{AndroidSourceSet.name}/kotlin`, `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` 与 `{包含的 SourceDirectories}` 的对应关系如下:

|             | 当前源代码集布局                                              | 新的源代码集布局                                                                                 |
|-------------|------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin, src/main/kotlin, src/main/java     | src/androidMain/kotlin, src/main/kotlin, src/main/java                                         |
| test        | src/androidTest/kotlin, src/test/kotlin, src/test/java     | src/android<b>Unit</b>Test/kotlin, src/test/kotlin, src/test/java                              |
| androidTest | src/android<b>Android</b>Test/kotlin, src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin, src/androidTest/java, <b>src/androidTest/kotlin</b> |

#### AndroidManifest.xml 文件的位置

| 当前源代码集布局                                         | 新的源代码集布局                                         |
|--------------------------------------------------------|-------------------------------------------------------|
| src/{<b>Android</b>SourceSet.name}/AndroidManifest.xml | src/{<b>Kotlin</b>SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}` 与 `{AndroidManifest.xml 位置}` 的对应关系如下:

|       | 当前源代码集布局                | 新的源代码集布局                               |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/<b>android</b>Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

#### Android 测试与 common 测试之间的关系

新的 Android 源代码集布局改变了 Android-instrumented 测试 (在新的布局中名称变更为 `androidInstrumentedTest`)
与 common 测试之间的关系.

在以前的版本中, `androidAndroidTest` 和 `commonTest` 之间存在默认的 `dependsOn` 关系.
具体来说, 代表以下含义:

* 在 `androidAndroidTest` 中可以访问 `commonTest` 中的代码.
* `commonTest` 中的 `expect` 声明在 `androidAndroidTest` 中必须有对应的 `actual` 实现.
* 在 `commonTest` 中声明的测试, 也会作为 Android instrumented 测试执行.

在新的 Android 源代码集布局中, 不再默认添加这个 `dependsOn` 关系.
如果你期望切换到以前的行为, 请在你的 `build.gradle.kts` 文件中, 手动声明这个关系:

```kotlin
kotlin {
    // ...
    sourceSets {
        val commonTest by getting
        val androidInstrumentedTest by getting {
            dependsOn(commonTest)
        }
    }
}
```

#### 对 Android flavor 的支持

在以前的版本中, Kotlin Gradle plugin 会在很早的阶段创建对应于 `debug` 和 `release` 构建类型的 Android 源代码集,
或对应于自定义 flavor 的 Android 源代码集, 例如 `demo` 和 `full`.
因此这些源代码集可以通过 `val androidDebug by getting { ... }` 这样的结构来访问.

在新的 Android 源代码集布局中, 这些源代码集会在 `afterEvaluate` 阶段创建.
因此上面的表达式不再有效, 会导致错误: `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found`.

为了解决这样的错误, 请在你的 `build.gradle.kts` 文件中使用新的 `invokeWhenCreated()` API:

```kotlin
kotlin {
    // ...
    sourceSets.invokeWhenCreated("androidFreeDebug") {
        // ...
    }
}
```

### 配置与设置

在未来的发布版中, 将会默认使用新的布局. 你可以使用以下 Gradle 选项来启用它:

```none
kotlin.mpp.androidSourceSetLayoutVersion=2
```

> 新的布局需要 Android Gradle plugin 7.0 或更高版本, 以及 Android Studio 2022.3 或更高版本.
>
{style="note"}

现在不再鼓励使用以前的 Android 风格目录布局. Kotlin 1.8.0 开始启动了旧布局的废弃周期, 会对当前的布局提示警告信息.
你可以使用以下 Gradle 属性来禁止这个警告:

```none
kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true
```

## Kotlin/JS

Kotlin 1.8.0 发布了 JS IR 编译器后端的稳定版, 并对 JavaScript 相关的 Gradle 构建脚本带来了新的功能特性:
* [JS IR 编译器后端的稳定版](#stable-js-ir-compiler-backend)
* [新的设置, 用于报告 yarn.lock 文件已被更新](#new-settings-for-reporting-that-yarn-lock-has-been-updated)
* [通过 Gradle 属性添加用于浏览器的测试目标](#add-test-targets-for-browsers-via-gradle-properties)
* [向你的项目添加 CSS 支持的新方式](#new-approach-to-adding-css-support-to-your-project)

### JS IR 编译器后端的稳定版 {id="stable-js-ir-compiler-backend"}

从这个发布版开始, [基于中间代码 (Intermediate Representation, IR) 的 Kotlin/JS 编译器](js-ir-compiler.md) 后端进入稳定版.
我们花费了一些时间来对全部三种后端统一基础设施, 但现在这些后端对 Kotlin 代码可以使用相同的 IR.

由于 JS IR 编译器后端已经进入稳定版, 因此旧的后端现在已被废弃.

对于 JS IR 编译器的稳定版, 增量编译会默认启用.

如果你还在使用旧的编译器, 请将你的项目切换到新的后端, 具体方法请参见我们的 [迁移指南](js-ir-migration.md).

### 新的设置, 用于报告 yarn.lock 文件已被更新 {id="new-settings-for-reporting-that-yarn-lock-has-been-updated"}

如果你使用 `yarn` 包管理器, 有 3 个新的专用 Gradle 设置, 可以通知你 `yarn.lock` 文件是否有更新.
如果你想要在 CI 构建过程中 `yarn.lock` 被更新时收到通知, 可以使用这些设定.

这 3 个新的 Gradle 属性是:

* `YarnLockMismatchReport`, 指示如何报告 `yarn.lock` 文件的变更. 可以使用以下设定值之一:
    * `FAIL` 让相应的 Gradle task 失败. 这是默认设定.
    * `WARNING` 将更新的相关信息写入 warning log.
    * `NONE` 禁用更新报告.
* `reportNewYarnLock`, 明确的报告最近创建的 `yarn.lock` 文件.
  默认情况下, 这个选项会被禁用: 初次启动时生成新的 `yarn.lock` 文件是常见的做法.
  你可以使用这个选项来确保这个文件被提交到你的代码仓库.
* `yarnLockAutoReplace`, 每次 Gradle task 运行时, 自动替换 `yarn.lock` 文件.

要使用这些选项, 请更新你的构建脚本文件 `build.gradle.kts`, 如下:

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java) {
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // 或 NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // 或 true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // 或 true
}
```

### 通过 Gradle 属性添加用于浏览器的测试目标 {id="add-test-targets-for-browsers-via-gradle-properties"}

从 Kotlin 1.8.0 开始, 你可以直接在 Gradle properties 文件中对不同的浏览器设置测试目标.
这样可以减少构建脚本文件的大小, 因为你不再需要在 `build.gradle.kts` 中编写所有的测试目标.

你可以使用这个属性对所有的模块定义浏览器列表, 然后在某些模块的构建脚本中添加特定的浏览器.

例如, 在你的 Gradle property 文件中, 以下代码将会对所有模块, 在 Firefox 和 Safari 中运行测试:

```none
kotlin.js.browser.karma.browsers=firefox,safari
```

请参见 [GitHub 代码中, 这个属性的所有可用值](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/js/testing/karma/KotlinKarma.kt#L106).

Kotlin 开发组非常感谢 [Martynas Petuška](https://github.com/mpetuska) 实现了这个功能.

### 向你的项目添加 CSS 支持的新方式 {id="new-approach-to-adding-css-support-to-your-project"}

这个发布版提供了一种新的方式来向你的项目添加 CSS 支持.
我们估计这个功能会影响到很多项目, 因此不要忘记更新你的 Gradle 构建脚本文件, 具体方法如下.

在 Kotlin 1.8.0 以前, 使用 `cssSupport.enabled` 属性来添加 CSS 支持:

```kotlin
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
}
```

现在, 你应该在 `cssSupport {}` 代码段中使用 `enabled.set()` 方法:

```kotlin
browser {
    commonWebpackConfig {
        cssSupport {
            enabled.set(true)
        }
    }
}
```

## Gradle

Kotlin 1.8.0 **完全** 支持 Gradle 7.2 和 7.3. 你也可以使用 Gradle 的最新版本,
但如果你这样做, 请注意, 你可能会遇到 deprecation 警告, 或者 Gradle 的某些新功能可能不能工作.

这个版本带来了很多变更:
* [将 Kotlin 编译器选项导出为 Gradle 的 lazy 属性](#exposing-kotlin-compiler-options-as-gradle-lazy-properties)
* [提升了最低支持版本](#bumping-the-minimum-supported-versions)
* [可以禁用 Kotlin daemon 的 fallback 策略](#ability-to-disable-the-kotlin-daemon-fallback-strategy)
* [kotlin-stdlib 最新版本在传递依赖项中的使用](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)
* [对相关的 Kotlin 和 Java 编译任务的 JVM 编译目标的兼容性是否相等的强制检查](#obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks)
* [Kotlin Gradle plugin 的传递依赖项的解析](#resolution-of-kotlin-gradle-plugins-transitive-dependencies)
* [废弃与删除的功能](#deprecations-and-removals)

### 将 Kotlin 编译器选项导出为 Gradle 的 lazy 属性 {id="exposing-kotlin-compiler-options-as-gradle-lazy-properties"}

为了将可用的 Kotlin 编译器选项导出为 [Gradle 的 lazy 属性](https://docs.gradle.org/current/userguide/lazy_configuration.html),
并更好的集成到 Kotlin task 中, 我们进行了很多变更:

* 编译任务有了新的 `compilerOptions` 输入, 与已有的 `kotlinOptions` 类似,
  但使用 Gradle 属性 API 的 [`Property`](https://docs.gradle.org/current/javadoc/org/gradle/api/provider/Property.html)
  作为返回类型:

  ```kotlin
  tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile::class.java) {
      compilerOptions {
          useK2.set(true)
      }
  }
  ```

* Kotlin 工具 task `KotlinJsDce` 和 `KotlinNativeLink` 有了新的 `toolOptions` 输入, 与已有的 `kotlinOptions` 输入类似.
* 新的输入带有 [`@Nested` Gradle 注解](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/Nested.html).
  输入内的每个属性都有相关的 Gradle 注解, 例如
  [`@Input` 或 `@Internal`](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks).
* Kotlin Gradle plugin API artifact 有 2 个新的接口:
    * `org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask`, 它带有 `compilerOptions` 输入和 `compileOptions()` 方法.
      所有的 Kotlin 编译 task 都实现这个接口.
    * `org.jetbrains.kotlin.gradle.tasks.KotlinToolTask`, 它带有 `toolOptions` 输入和 `toolOptions()` 方法.
      所有的 Kotlin 工具 task – `KotlinJsDce`, `KotlinNativeLink`, 和 `KotlinNativeLinkArtifactTask` – 都实现这个接口.
* 有些 `compilerOptions` 使用新的类型, 而不是 `String` 类型:
    * [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)
    * [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)
      (用于 `apiVersion` 和 `languageVersion` 输入)
    * [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt)
    * [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)
    * [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)

  例如, 你可以使用 `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`, 而不是 `kotlinOptions.jvmTarget = "11"`.

  `kotlinOptions` 类型没有变更, 它会在内部转换为 `compilerOptions` 类型.
* Kotlin Gradle plugin API 与以前的发布版保持二进制兼容. 然而, 在 `kotlin-gradle-plugin` artifact 中存在一些源代码变更, 以及 ABI 不兼容的变更.
  这些变更大多涉及到对某些内部类型的新增的泛型参数. 一个重要的变更是, `KotlinNativeLink` task 不再继承 `AbstractKotlinNativeCompile` task.
* `KotlinJsCompilerOptions.outputFile` 以及相关的 `KotlinJsOptions.outputFile` 选项已被废弃. 请改为使用 `Kotlin2JsCompile.outputFileProperty` task 输入.

> Kotlin Gradle plugin 仍然会向 Android 扩展添加 `KotlinJvmOptions` DSL:
>
> ```kotlin
> android {
>     kotlinOptions {
>         jvmTarget = "11"
>     }
> }
> ```
>
> 在 [这个问题](https://youtrack.jetbrains.com/issue/KT-15370/Gradle-DSL-add-module-level-kotlin-options) 中,
> 这个功能会被修改为, 将 `compilerOptions` DSL 添加到模块级别.
>
{style="note"}

#### 限制

> `kotlinOptions` task 输入和 `kotlinOptions{...}` task DSL 现在处于支持模式, 将会在未来的发布版中被废弃.
> 我们只会对 `compilerOptions` 和 `toolOptions` 进行功能改进.
>
{style="warning"}

对 `kotlinOptions` 调用任何 setter 或 getter, 会被代理到 `compilerOptions` 中的相关属性.
因此会造成以下限制:
* `compilerOptions` 和 `kotlinOptions` 在 task 的执行阶段不能修改 (有一种例外情况, 参见下面的章节).
* `freeCompilerArgs` 返回不可变的 `List<String>`, 也就是说, 比如,
  `kotlinOptions.freeCompilerArgs.remove("something")` 会失败.

有一些 plugin, 包括 `kotlin-dsl`, 以及启用了 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的 Android Gradle plugin (AGP),
会在 task 的执行阶段试图修改 `freeCompilerArgs` 属性.
在 Kotlin 1.8.0 中, 我们为它们添加了一个变通方法.
这个变通方法允许任何构建脚本或 plugin 在执行阶段修改 `kotlinOptions.freeCompilerArgs`, 但会在构建 log 中输出警告.
要禁用这个警告, 请使用新的 Gradle 属性 `kotlin.options.suppressFreeCompilerArgsModificationWarning=true`.
Gradle 将会为
[`kotlin-dsl` plugin](https://github.com/gradle/gradle/issues/22091)
和 [启用了 Jetpack Compose 的 AGP](https://issuetracker.google.com/u/1/issues/247544167)
修正这个问题.

### 提升了最低支持版本 {id="bumping-the-minimum-supported-versions"}

从 Kotlin 1.8.0 开始, 最低支持的 Gradle 版本是 6.8.3, 最低支持的 Android Gradle plugin 版本是 4.1.3.

详情请参见 [Kotlin Gradle plugin 与可用的 Gradle 版本之间的兼容性](gradle-configure-project.md#apply-the-plugin)

### 可以禁用 Kotlin daemon 的 fallback 策略 {id="ability-to-disable-the-kotlin-daemon-fallback-strategy"}

有一个新的 Gradle 属性 `kotlin.daemon.useFallbackStrategy`, 默认值为 `true`.
当设定为 `false` 时, daemon 启动或通信时问题会导致构建失败.
在 Kotlin 编译 task 中还有一个新的 `useDaemonFallbackStrategy` 属性, 如果同时使用, 它的优先级会高于 Gradle 属性.
如果运行编译所需要的内存不足, 你会在 log 中看到相关信息.

Kotlin 编译器的 fallback 策略是, 如果 Kotlin daemon 因为某种原因失败, 那么会在 daemon 之外运行编译任务.
如果 Gradle daemon 已启动, 编译器会使用 "In process" 策略.
如果 Gradle daemon 没有启动, 编译器会使用 "Out of process" 策略.
详情请参见 [执行策略的相关文档](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy).
注意, 静默的 fallback 到其他策略, 会消耗大量的系统资源, 或导致不确定的构建结果;
关于这个问题, 详情请参见这个
[YouTrack issue](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy).

### kotlin-stdlib 最新版本在传递依赖项中的使用 {id="usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies"}

如果你在依赖项中将 Kotlin 版本明确指定为 1.8.0 或更高版本, 例如:
`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`,
那么 Kotlin Gradle Plugin 对 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 传递依赖项会使用这个 Kotlin 版本.
这样做是为了避免不同的 stdlib 版本中出现重复的类
(详情请参见 [`kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 合并到 `kotlin-stdlib`](#updated-jvm-compilation-target)).
你可以使用 `kotlin.stdlib.jdk.variants.version.alignment` Gradle 属性禁用这个行为:

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

如果你遇到与版本对齐相关的问题, 请使用 Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import)
对齐所有的版本, 方法是在你的构建脚本中声明一个 `kotlin-bom` 的平台依赖项:

```kotlin
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

关于其他情况, 以及我们建议的解决方案, 详情请参见 [这篇文档](gradle-configure-project.md#other-ways-to-align-versions).

### 对相关的 Kotlin 和 Java 编译任务的 JVM 编译目标的强制检查 {id="obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks"}

> 即使你的源代码文件全部都是 Kotlin, 并没有使用 Java, 本节仍然适用于你的 JVM 项目.
>
{style="note"}

[从这个发布版开始](https://youtrack.jetbrains.com/issue/KT-54993/Raise-kotlin.jvm.target.validation.mode-check-default-level-to-error-when-build-is-running-on-Gradle-8),
[`kotlin.jvm.target.validation.mode` 属性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)
对 Gradle 8.0+ 项目 (Gradle 的这个版本还未正式发布) 的默认值是 `error`,
如果发现 JVM 编译目标不兼容, plugin 会让构建失败.

将默认值从 `warning` 提示到 `error` 是为了平滑的迁移到 Gradle 8.0 的预备步骤.
**我们鼓励你将这个属性设置为 `error`**, 并 [配置工具链](gradle-configure-project.md#gradle-java-toolchains-support),
或者手动对齐 JVM 版本.

详情请参见 [如果你不检查编译目标的兼容性, 可能会导致什么样的错误](gradle-configure-project.md#what-can-go-wrong-if-targets-are-incompatible).

### Kotlin Gradle plugin 的传递依赖项的解析 {id="resolution-of-kotlin-gradle-plugins-transitive-dependencies"}

在 Kotlin 1.7.0 中, 我们引入了 [对 Gradle plugin 变体的支持](whatsnew17.md#support-for-gradle-plugin-variants).
由于这些 plugin 变体的存在, 一个构建的 classpath 可以包含 [Kotlin Gradle plugin](https://plugins.gradle.org/u/kotlin) 的不同版本,
并依赖到某些依赖项的不同版本, 通常是 `kotlin-gradle-plugin-api`.
这种情况可能导致依赖项解析的问题, 我们建议使用下面的变通方法, 下面以 `kotlin-dsl` plugin 为例.

Gradle 7.6 中的 `kotlin-dsl` plugin 依赖于 `org.jetbrains.kotlin.plugin.sam.with.receiver:1.7.10` plugin,
后一个 plugin 又依赖于 `kotlin-gradle-plugin-api:1.7.10`.
如果你添加 `org.jetbrains.kotlin.gradle.jvm:1.8.0` plugin,
这个 `kotlin-gradle-plugin-api:1.7.10` 的传递依赖项可能导致依赖项解析错误,
因为版本 (`1.8.0` 和 `1.7.10`) 与变体属性 [`org.gradle.plugin.api-version`](https://docs.gradle.org/current/javadoc/org/gradle/api/attributes/plugin/GradlePluginApiVersion.html)
值不匹配.
变通方法是, 添加这个
[constraint](https://docs.gradle.org/current/userguide/dependency_constraints.html#sec:adding-constraints-transitive-deps)
来对齐版本.
我们正在计划实现 [Kotlin Gradle Plugin 库对齐平台](https://youtrack.jetbrains.com/issue/KT-54691/Kotlin-Gradle-Plugin-libraries-alignment-platform),
在此之前, 可能一直需要使用这个变通方法:

```kotlin
dependencies {
    constraints {
        implementation("org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0")
    }
}
```

这个 constraint 对构建的 classpath 中的传递依赖项强制使用 `org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0` 版本.
参见 [Gradle issue tracker 中的一个类似情况](https://github.com/gradle/gradle/issues/22510#issuecomment-1292259298).

### 废弃与删除的功能 {id="deprecations-and-removals"}

在 Kotlin 1.8.0 中, 以下属性和方法的废弃周期继续向前推进:

* [在 Kotlin 1.7.0 的公告中](whatsnew17.md#changes-in-compile-tasks),
  `KotlinCompile` task 仍然有已废弃的 Kotlin 属性 `classpath`, 它将在未来的发布版中删除.
  现在, 我们将 `KotlinCompile` task 的 `classpath` 属性的废弃级别修改为 `error`.
  所有的编译任务使用 `libraries` 输入来指定编译所需要的库列表.
* 我们删除了 `kapt.use.worker.api` 属性, 它可以通过 Gradle Workers API 来运行 [kapt](kapt.md).
  从 Kotlin 1.3.70 开始, 默认情况下, [kapt 使用 Gradle worker](kapt.md#run-kapt-tasks-in-parallel),
  我们建议使用这种方法.
* 在 Kotlin 1.7.0 中, 我们 [宣布了 `kotlin.compiler.execution.strategy` 属性的废弃周期开始](whatsnew17.md#deprecation-of-the-kotlin-compiler-execution-strategy-system-property).
  在这个发布版中, 我们删除了这个属性. 详情请参见 [如何使用其它方式定义 Kotlin 编译器执行策略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy).

## 标准库

在 Kotlin 1.8.0 中:
* 更新了 [JVM 编译目标](#updated-jvm-compilation-target).
* 一系列函数进入稳定版 – [Java 与 Kotlin TimeUnit 之间的转换](#timeunit-conversion-between-java-and-kotlin),
  [`cbrt()`](#cbrt), [Java `Optionals` 扩展函数](#java-optionals-extension-functions).
* 提供了一个 [可比较和可相减的 `TimeMarks` (预览版)](#comparable-and-subtractable-timemarks).
* 包含 [`java.nio.file.path` 的扩展函数 (实验性功能)](#recursive-copying-or-deletion-of-directories).
* 提供了 [kotlin-reflect 的性能改善](#improved-kotlin-reflect-performance).

### 更新了 JVM 编译目标 {id="updated-jvm-compilation-target"}

在 Kotlin 1.8.0 中, 标准库 (`kotlin-stdlib`, `kotlin-reflect`, 和 `kotlin-script-*`) 使用 JVM 1.8 编译.
以前的版本中, 标准库使用 JVM 1.6 编译.

Kotlin 1.8.0 不再支持 JVM 1.6 和 1.7 编译目标. 因此, 你不再需要在构建脚本中分布声明 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8`,
因为这些库文件的内容已经合并到了 `kotlin-stdlib` 之内.

> 如果在你的构建脚本中明确声明了 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 依赖项,
> 那么你应该将它们替换为 `kotlin-stdlib`.
>
{style="note"}

注意, 混合使用 stdlib 库文件的不同版本可能导致类重复, 或类缺失.
为了避免这种问题, Kotlin Gradle plugin 可以帮助你 [对齐 stdlib 版本](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies).

### cbrt()

`cbrt()` 函数, 可以计算一个 `double` 或 `float` 值的 real 三次方根, 现在进入稳定版.

```kotlin
import kotlin.math.*

fun main() {
    val num = 27
    val negNum = -num

    println("The cube root of ${num.toDouble()} is: " +
            cbrt(num.toDouble()))
    println("The cube root of ${negNum.toDouble()} is: " +
            cbrt(negNum.toDouble()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

### Java 与 Kotlin TimeUnit 之间的转换 {id="timeunit-conversion-between-java-and-kotlin"}

`kotlin.time` 中的 `toTimeUnit()` 和 `toDurationUnit()` 函数现在进入稳定版.
这些函数在 Kotlin 1.6.0 中作为实验性功能引入, 它们可以改进 Kotlin 与 Java 之间的交互能力.
现在你可以很容易在 Java `java.util.concurrent.TimeUnit` 和 Kotlin `kotlin.time.DurationUnit` 之间进行转换.
这些函数只能用于 JVM 平台.

```kotlin
import kotlin.time.*

// 供 Java 代码使用
fun wait(timeout: Long, unit: TimeUnit) {
    val duration: Duration = timeout.toDuration(unit.toDurationUnit())
    ...
}
```

### 可比较和可相减的 TimeMarks {id="comparable-and-subtractable-timemarks"}

> `TimeMarks` 的新功能是 [实验性功能](components-stability.md#stability-levels-explained),
> 要使用这些功能, 你需要使用 `@OptIn(ExperimentalTime::class)` 或 `@ExperimentalTime` 进行使用者同意(Opt-in).
>
{style="warning"}

在 Kotlin 1.8.0 之前, 如果你想要计算多个 `TimeMarks` 和 **now** 之间的时间差,
你每次只能对一个 `TimeMark` 调用 `elapsedNow()`.
这个限制会造成比较结果时的困难, 因为两次 `elapsedNow()` 函数调用无法在完全相同的时刻执行.

为了解决这个问题, 在 Kotlin 1.8.0 中, 你可以对相同的时间源(Time Source) 相减和比较 `TimeMarks`.
现在你可以创建一个新的 `TimeMark` 实例来表达 **now**, 然后对它减去另一个 `TimeMarks`.
通过这种方式, 你从这些计算得到的结果可以保证是正确的.

```kotlin
import kotlin.time.*
fun main() {
//sampleStart
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // 等待 0.5 秒
    val mark2 = timeSource.markNow()

    // 在 1.8.0 版以前
    repeat(4) { n ->
        val elapsed1 = mark1.elapsedNow()
        val elapsed2 = mark2.elapsedNow()

        // 根据两次 elapsedNow() 调用之间经过了多长时间不同
        // elapsed1 和 elapsed2 之间的差别可能发生变化
        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    println()

    // 从 1.8.0 开始
    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        // 现在相对于 mark3 来计算经过的时间,
        // 而 mark3 是固定的值
        println("Measurement 2.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // 也可以对 time marks 进行比较
    // 这里的输出结果为 true, 因为 mark2 的捕获是在 mark1 之后
    println(mark2 > mark1)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

这个新功能在动画计算中非常有用, 这种情况下, 你需要对代表不同的帧的多个 `TimeMarks` 计算它们之间的时间差, 或比较先后.

### 递归的复制或删除目录 {id="recursive-copying-or-deletion-of-directories"}

> `java.nio.file.path` 的这些新函数是 [实验性功能](components-stability.md#stability-levels-explained).
> 要使用它们, 你需要使用 `@OptIn(kotlin.io.path.ExperimentalPathApi::class)` 或 `@kotlin.io.path.ExperimentalPathApi` 进行使用者同意(Opt-in).
> 或者, 你也可以使用编译器选项 `-opt-in=kotlin.io.path.ExperimentalPathApi`.
>
{style="warning"}

我们为 `java.nio.file.Path` 引入了 2 个新的扩展函数, `copyToRecursively()` 和 `deleteRecursively()`,
它们可以:

* 将一个目录以及其中的内容, 递归的复制到另一个目标目录.
* 递归的删除一个目录以及其中的内容.

要实现文件备份功能, 这些函数会非常有用.

#### 错误处理

使用 `copyToRecursively()` 函数时, 你可以覆盖 `onError` lambda 函数, 来定义在复制过程中发生异常时, 应该如何处理:

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false,
    onError = { source, target, exception ->
        logger.logError(exception, "Failed to copy $source to $target")
        OnErrorResult.TERMINATE
    })
```
{validate="false"}

当你使用 `deleteRecursively()` 时, 如果在删除一个文件或目录时发生异常, 那么这个文件或目录会被跳过.
删除过程结束后, `deleteRecursively()` 会抛出 `IOException`, 其中包含删除过程中发生的所有异常.

#### 文件覆盖

如果 `copyToRecursively()` 发现一个文件在目标目录中已经存在, 那么会发生异常.
如果你想要覆盖文件, 请使用这个函数带有 `overwrite` 参数的重载版本, 并将这个参数设置为 `true`:

```kotlin
fun setUpEnvironment(projectDirectory: Path, fixtureName: String) {
    fixturesRoot.resolve(COMMON_FIXTURE_NAME)
        .copyToRecursively(projectDirectory, followLinks = false)
    fixturesRoot.resolve(fixtureName)
        .copyToRecursively(projectDirectory, followLinks = false,
            overwrite = true) // 覆盖 common fixture 中相同的内容
}
```
{validate="false"}

#### 自定义复制行为

要定义你自己的复制逻辑, 请使用这个函数的带有额外参数 `copyAction` 的覆盖版本.
使用 `copyAction`, 你可以提供一个 lambda 函数, 指定你想要的复制动作:

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false) { source, target ->
    if (source.name.startsWith(".")) {
        CopyActionResult.SKIP_SUBTREE
    } else {
        source.copyToIgnoringExistingDirectory(target, followLinks = false)
        CopyActionResult.CONTINUE
    }
}
```
{validate="false"}

关于这些扩展函数, 更多详情请参见
[我们的 API 参考文档](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/copy-to-recursively.html).

### Java Optionals 扩展函数 {id="java-optionals-extension-functions"}

在 [Kotlin 1.7.0](whatsnew17.md#new-experimental-extension-functions-for-java-optionals) 中引入的扩展函数现在进入稳定版.
这些函数简化了 Java 中的 Optional 类的使用. 可以用来在 JVM 中解包或变换 `Optional` 对象, 使得使用 Java API 时代码更加简洁.
更多详情请参见, [Kotlin 1.7.0 版中的新功能](whatsnew17.md#new-experimental-extension-functions-for-java-optionals).

### kotlin-reflect 的性能改善 {id="improved-kotlin-reflect-performance"}

由于 `kotlin-reflect` 现在使用 JVM 1.8 进行编译, 因此我们将内部的缓存机制迁移到了 Java 的 `ClassValue`.
以前我们只缓存 `KClass`, 现在我们还可以缓存 `KType` 和 `KDeclarationContainer`.
这些变更带来了调用 `typeOf()` 时的显著的性能改善.

## 文档更新

Kotlin 文档有了很大的变更:

### 文档的改进和新增

* [Gradle 概述](gradle.md) –
  学习如何使用 Gradle 构建系统配置和构建一个 Kotlin 项目, 可用的编译器选项, 编译, 以及 Kotlin Gradle plugin 中的缓存.
* [Java 和 Kotlin 中的可空性(Nullability)](java-to-kotlin-nullability-guide.md) –
  学习 Java 和 Kotlin 处理可空变量方式的的差异.
* [Lincheck 指南](lincheck-guide.md) –
  学习如何设置和使用 Lincheck 框架, 在 JVM 平台上测试并发算法.

### 教程的改进和新增

* [Gradle 与 Kotlin/JVM 入门](get-started-with-jvm-gradle-project.md) –
  使用 IntelliJ IDEA 和 Gradle 创建一个控制台应用程序.
* [使用 Ktor 和 SQLDelight 创建跨平台应用程序](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html) –
  使用 Kotlin Multiplatform Mobile, 创建一个运行于 iOS 和 Android 的移动应用程序.
* [Kotlin Multiplatform 入门](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) –
  学习使用 Kotlin 进行跨平台移动应用程序开发, 并创建一个可以同时运行于 Android 和 iOS 平台的应用程序.

## 安装 Kotlin 1.8.0 {id="install-kotlin-1-8-0"}

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3, 2022.1, 和 2022.2
会自动建议将 Kotlin plugin 更新到版本 1.8.0.
IntelliJ IDEA 2022.3 的后续小版本更新, 会带有 Kotlin plugin 的 1.8.0 版本.

> 要在 IntelliJ IDEA 2022.3 中将已有的项目迁移到 Kotlin 1.8.0, 请将 Kotlin 版本变更为 `1.8.0`,
> 然后重新导入你的 Gradle 或 Maven 项目.
>
{style="note"}

对于 Android Studio Electric Eel (221) 和 Flamingo (222),
Android Studios 的后续更新会带有 Kotlin plugin 的 1.8.0 版本.
新的命令行编译器可以通过 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.8.0) 下载.

## Kotlin 1.8.0 的兼容性指南 {id="compatibility-guide-for-kotlin-1-8-0"}

Kotlin 1.8.0 是一个 [功能性发布版(Feature Release)](kotlin-evolution-principles.md#language-and-tooling-releases),
因此可能带来一些变更, 与你针对旧版本编写的代码不兼容.
关于这些不兼容的变更, 详情请参见 [Kotlin 1.8.0 兼容性指南](compatibility-guide-18.md).
