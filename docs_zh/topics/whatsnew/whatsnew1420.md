[//]: # (title: Kotlin 1.4.20 版中的新功能)

_[发布日期: 2020/11/23](releases.md#release-details)_

Kotlin 1.4.20 带来了很多新的实验性功能特性, 并对既有的提供了功能特性很多 bug 修正和改进,
包括 1.4.0 中添加的那些新功能特性.

关于新功能特性, 也可以阅读 [这篇 Blog](https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/), 其中包含很多示例.


## Kotlin/JVM

Kotlin/JVM 改进的目标是为了让它跟上现代 Java 版本的功能特性:

- [Java 15 编译目标](#java-15-target)
- [invokedynamic 字符串 拼接](#invokedynamic-string-concatenation)

### Java 15 编译目标 {id="java-15-target"}

现在 Kotlin/JVM 编译目标可以使用 Java 15.

### invokedynamic 字符串拼接 {id="invokedynamic-string-concatenation"}

> `invokedynamic` 字符串拼接是 [实验性功能](components-stability.md). 这个功能随时可能抛弃或改变.
> 使用这个功能需要使用者同意(Opt-in)(详情请参见下文). 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
>
{style="warning"}

对于 JVM 9 以上版本的编译目标, Kotlin 1.4.20 能够将字符串拼接编译为 [动态调用(dynamic invocation)](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic),
进而改善性能.

现在, 这个功能特性还是实验性功能, 包含以下使用场景:
- `String.plus`: 操作符形式(`a + b`), 明确调用形式(`a.plus(b)`), 以及方法参照形式(`(a::plus)(b)`).
- `toString`: 在内联类和数据类中.
- 字符串模板, 带单个非常数参数的情况除外(参见 [KT-42457](https://youtrack.jetbrains.com/issue/KT-42457)).

要启用 `invokedynamic` 字符串拼接功能, 请添加 `-Xstring-concat` 编译器参数, 指定以下值:
- `indy-with-constants`, 对字符串执行 `invokedynamic` 拼接, 使用 [StringConcatFactory.makeConcatWithConstants()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-).
- `indy`: 对字符串执行 `invokedynamic` 拼接, 使用 [StringConcatFactory.makeConcat()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcat-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-).
- `inline`: 切换回原来的拼接方法, 使用 `StringBuilder.append()`.

## Kotlin/JS

Kotlin/JS 还在继续快速演进, 在 1.4.20 中你会看到很多实验性的功能特性和改进:

- [Gradle DSL 的变更](#gradle-dsl-changes)
- [新的向导模板](#new-wizard-templates)
- [IR 编译器忽略编译错误](#ignoring-compilation-errors-with-ir-compiler)

### Gradle DSL 的变更 {id="gradle-dsl-changes"}

Kotlin/JS 的 Gradle DSL 有了很多更新, 可以简化项目的配置和自定义.
这些更新包括 webpack 配置的调整, 自动生成的 `package.json` 文件的修正, 以及对传递依赖的控制的改进.

#### 对 webpack 配置的单点控制

对浏览器编译目标可以使用新的配置代码段 `commonWebpackConfig`.
在这个代码段内, 可以集中在一处调整共通设置, 而不必对 `webpackTask`, `runTask`, 和 `testTask` 任务进行重复配置.

要对这 3 个任务默认启用 CSS 支持, 请在你的项目的 `build.gradle(.kts)` 文件中添加以下代码:

```groovy
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
    binaries.executable()
}
```

更多详情请参见 [webpack 打包(Bundling)配置](js-project-setup.md#webpack-bundling).

#### 通过 Gradle 自定义 package.json 文件

要对你的 Kotlin/JS 包的管理和发布进行更加精确的控制, 现在可以通过 Gradle DSL 向项目文件 [`package.json`](https://nodejs.dev/learn/the-package-json-guide) 添加属性.

要向你的 `package.json` 文件添加自定义的项目, 请在编译任务的 `packageJson` 代码段中使用 `customField` 函数:

```kotlin
kotlin {
    js(BOTH) {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

更多详情请参见 [自定义 `package.json` 文件](js-project-setup.md#package-json-customization).

#### 可选择的 yarn 依赖项解析

> 可选择的 yarn 依赖项解析是 [实验性功能](components-stability.md). 这个功能随时可能抛弃或改变.
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
>
{style="warning"}

Kotlin 1.4.20 提供一种方法来配置 Yarn 的 [可选择的依赖项解析](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/) -
用来覆盖你依赖的包的依赖项的机制.

在 Gradle 中可以通过 `YarnPlugin` 中的 `YarnRootExtension` 使用这个功能.
要对你的项目影响一个包解析的版本, 请使用 `resolution` 函数, 传入参数是包名称选择器 (与 Yarn 指定的相同),
以及它应当解析的版本.

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().apply {
        resolution("react", "16.0.0")
        resolution("processor/decamelize", "3.0.0")
    }
}
```

这里, 你的 _所有_ 需要 `react` 的 npm 依赖项都将得到版本 `16.0.0`,
而 `processor` 对它的依赖项 `decamelize` 将会得到版本 `3.0.0`.

#### 禁用粗粒度 workspace

> 禁用粗粒度 workspace 是 [实验性功能](components-stability.md). 这个功能随时可能抛弃或改变.
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
>
{style="warning"}

为了提高构建速度, Kotlin/JS Gradle plugin 只安装特定 Gradle 任务所需要的依赖项.
比如, `webpack-dev-server` 包, 只有在你执行某个 `*Run` 任务时才会安装, 而在执行 assemble 任务时不会安装.
当你并行运行多个 Gradle 任务时, 这种行为可能带来潜在的问题.
当需求的依赖项发生冲突时, npm 包的两种不同安装会导致错误.

为了解决这个问题, Kotlin 1.4.20 包含了一个参数来禁用这种 _粗粒度 workspace_.
在 Gradle 中可以通过 `YarnPlugin` 中的 `YarnRootExtension` 来使用这个功能特性.
要使用它, 请在你的 `build.gradle.kts` 文件中添加以下代码段:

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().disableGranularWorkspaces()
}
```

### 新的向导模板 {id="new-wizard-templates"}

在创建项目阶段, 为了提供更方便的方法来自定义你的项目, Kotlin 项目创建向导为 Kotlin/JS 应用程序提供了新的模板:
- **Browser 应用程序** - 一个最小的 Kotlin/JS Gradle 项目, 运行在浏览器内.
- **React 应用程序** - 一个 React 应用程序, 使用适当的 `kotlin-wrappers`.
    它提供参数来集成样式表(style sheet), 导航组件, 或状态容器.
- **Node.js 应用程序** - 一个最小的项目, 运行在 Node.js 环境内.
    它提供参数来包含实验性的 `kotlinx-nodejs` 包.

### IR 编译器忽略编译错误 {id="ignoring-compilation-errors-with-ir-compiler"}

> _忽略编译错误_ 模式是 [实验性功能](components-stability.md). 这个功能随时可能抛弃或改变.
> 使用这个功能需要使用者同意(Opt-in)(详情请参见下文). 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
>
{style="warning"}

Kotlin/JS 的 [IR 编译器](js-ir-compiler.md) 有一个新的实验性模式 - _带错误编译_ 模式.
在这种模式下, 即使你的代码包含错误也可以运行, 比如, 你可能希望试验某部分功能, 虽然整个应用程序还未完成.

这个模式有两种错误宽容策略:
- `SEMANTIC`: 编译器会接受那些语法正确, 但语义不正确的代码,
    比如 `val x: String = 3`.

- `SYNTAX`: 编译器会接受任何代码, 即使包含语法错误.

要允许带错误编译, 请添加 `-Xerror-tolerance-policy=` 编译器参数, 指定上述值.

[更多详情请参见 Kotlin/JS IR 编译器](js-ir-compiler.md).

## Kotlin/Native

在 1.4.20 中, Kotlin/Native 的优先任务是改进性能, 以及改进既有的功能特性.
值得注意的改进包括:

- [逃逸分析(Escape analysis)](#escape-analysis)
- [性能改进与 bug 修复](#performance-improvements-and-bug-fixes)
- [包装 Objective-C 异常(需要使用者同意)](#opt-in-wrapping-of-objective-c-exceptions)
- [CocoaPods plugin 改进](#cocoapods-plugin-improvements)
- [支持 Xcode 12 库](#support-for-xcode-12-libraries)

### 逃逸分析(Escape analysis)

> 逃逸分析机制是 [实验性功能](components-stability.md). 这个功能随时可能抛弃或改变.
> 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
>
{style="warning"}

Kotlin/Native 有了一个新的 [逃逸分析(escape analysis)](https://en.wikipedia.org/wiki/Escape_analysis) 机制的原型.
它会将特定的对象分配在栈(stack)中, 而不是分配在堆(heap)中, 因此改进了运行期性能.
在我们的基准测试中, 这个机制表现出 10% 的平均性能改进, 我们还会继续改进它, 让它能够更多的提高程序运行速度.

对发布构建(release build) (使用 `-opt` 编译器参数), 会在单独的编译阶段中运行逃逸分析.

如果你希望禁用逃逸分析, 请使用 `-Xdisable-phases=EscapeAnalysis` 编译器参数.

### 性能改进与 bug 修复 {id="performance-improvements-and-bug-fixes"}

Kotlin/Native 的很多组件有了性能改进和 bug 修复, 包括 1.4.0 中添加的部分,
比如, [代码共用机制](multiplatform-share-on-platforms.md#share-code-on-similar-platforms).

### 包装 Objective-C 异常(需要使用者同意) {id="opt-in-wrapping-of-objective-c-exceptions"}

> Objective-C 异常包装机制是 [实验性功能](components-stability.md). 这个功能随时可能抛弃或改变.
> 使用这个功能需要使用者同意(Opt-in)(详情请参见下文). 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
>
{style="warning"}

Kotlin/Native 现在可以处理 Objective-C 代码在运行期抛出的异常, 避免程序崩溃.

你可以同意使用(opt in) 将 `NSException` 包装为 Kotlin 的 `ForeignException` 类型的异常.
这些异常会保存原来的 `NSException` 的引用. 因此你可以得到原始错误的信息, 并进行正确的处理.

要启用 Objective-C 异常的包装, 请在 `cinterop` 调用中指定 `-Xforeign-exception-mode objc-wrap` 参数,
或对 `.def` 文件添加 `foreignExceptionMode = objc-wrap` 属性.
如果你使用 [CocoaPods 集成](multiplatform-cocoapods-overview.md), 请在一个依赖项的 `pod {}` 构建脚本代码段中指定参数,
比如:

```kotlin
pod("foo") {
    extraOpts = listOf("-Xforeign-exception-mode", "objc-wrap")
}
```

不启用这个功能时, 默认行为仍然保持不变: 当 Objective-C 代码抛出异常时, 程序会终止.

### CocoaPods plugin 改进 {id="cocoapods-plugin-improvements"}

Kotlin 1.4.20 继续改进与 CocoaPods 的集成. 你可以试用以下新功能特性:

- [任务执行的改进](#improved-task-execution)
- [DSL 扩展](#extended-dsl)
- [与 Xcode 集成的更新](#updated-integration-with-xcode)

#### 任务执行的改进 {id="improved-task-execution"}

CocoaPods plugin 的任务执行流程有改进. 比如, 如果你添加一个新的 CocoaPods 依赖项,
既有的依赖项不会重新构建. 添加一个额外的编译目标也不会影响既有编译目标依赖项的重新构建.

#### DSL 扩展 {id="extended-dsl"}

向你的 Kotlin 项目添加 [CocoaPods](multiplatform-cocoapods-overview.md) 依赖项的 DSL, 有了新的功能.

除了本地的 Pod 以及来自  CocoaPods 仓库的 Pod 之外, 你也可以将以下类型的库添加为依赖项:
* 来自自定义规格仓库的库.
* 来自 Git 仓库的远程库.
* 来自 archive 的库 (也可以使用任意 HTTP 地址).
* 静态库.
* 使用自定义 cinterop 参数的库.

更多详情请参见 在 Kotlin 项目中 [添加 CocoaPods 依赖项](multiplatform-cocoapods-libraries.md).
示例程序请参见 [Kotlin 使用 CocoaPods 示例](https://github.com/Kotlin/kmm-with-cocoapods-sample).

#### 与 Xcode 集成的更新 {id="updated-integration-with-xcode"}

为了更好的与 Xcode 协同工作, Kotlin 要求 Podfile 的一些变化:

* 如果你的 Kotlin Pod 有任何 Git, HTTP, 或 specRepo Pod 的依赖项, 那么你还需要在 Podfile 中指定这些依赖项.
* 当你添加一个来自自定义 spec 的库, 那么还需要在你的  Podfile 开头, 指定 spec 的 [位置](https://guides.cocoapods.org/syntax/podfile.html#source).

在 IDEA 中, 集成错误现在有了详细的描述信息. 因此当你遇到 Podfile 相关的问题, 可以立即知道如何修复.

更多详情请参见 [创建 Kotlin pod](multiplatform-cocoapods-xcode.md).

### 支持 Xcode 12 库 {id="support-for-xcode-12-libraries"}

对随 Xcode 12 一起发布的新库, 我们添加了支持. 现在你可以在 Kotlin 代码中使用这些库.

## Kotlin Multiplatform

### 跨平台库发布的结构更新

从 Kotlin 1.4.20 开始, 不再有单独的元数据发布. 元数据 artifact 现在包含在 _root_ 发布之内,
它代表整个库, 并且在添加为共通源代码集的依赖项时, 会自动解析为适当的平台相关 artifact.

更多详情请参见 [发布跨平台库](multiplatform-publish-lib-setup.md).

#### 与以前版本的兼容性

这样的结构变化, 破坏了使用 [层级项目结构](multiplatform-share-on-platforms.md#share-code-on-similar-platforms) 的项目之间的兼容性.
如果一个跨平台项目和它依赖的一个库都使用了层级项目结构, 那么你需要将它们同步更新到 Kotlin 1.4.20 或更高版本.
使用 Kotlin 1.4.20 发布的库, 不能供以前版本发布的项目使用.

不使用层级项目结构的项目和库仍然保持兼容.

## 标准库

Kotlin 1.4.20 的标准库提供了一些用来处理文件的新的扩展, 并改进了性能.

- [对 java.nio.file.Path 的扩展](#extensions-for-java-nio-file-path)
- [String.replace 函数性能改进](#improved-string-replace-function-performance)

### 用于 java.nio.file.Path 的扩展 {id="extensions-for-java-nio-file-path"}

> 用于 `java.nio.file.Path` 的扩展是 [实验性功能](components-stability.md). 这个功能随时可能抛弃或改变.
> 使用这个功能需要使用者同意(Opt-in)(详情请参见下文). 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
>
{style="warning"}

标准库提供用于 `java.nio.file.Path` 的实验性的扩展.
现在可以通过符合 Kotlin 习惯的方式来使用现代的 JVM 文件 API, 与 `kotlin.io` 包中的 `java.io.File` 扩展类似.

```kotlin
// 使用除 (/) 操作符构造路径
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory"

// 列出目录中的文件
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

这些扩展在 `kotlin-stdlib-jdk7` 模块的 `kotlin.io.path` 包内.
要使用这些扩展, 需要对实验性的注解 `@ExperimentalPathApi` 标注 [使用者同意(opt-in)](opt-in-requirements.md).

### String.replace 函数性能改进 {id="improved-string-replace-function-performance"}

`String.replace()` 的新实现提高了这个函数的执行速度.
大小写相关的版本使用一种基于 `indexOf` 的手动替换循环, 大小写无关的版本使用正规表达式匹配.

## Kotlin Android Extensions

在 1.4.20 中, Kotlin Android Extensions plugin 已废弃, `Parcelable` 实现代码生成器移动到了一个单独的 plugin 中.

- [废弃合成视图(synthetic view)](#deprecation-of-synthetic-views)
- [Parcelable 实现代码生成器的新 plugin](#new-plugin-for-parcelable-implementation-generator)

### 废弃合成视图(synthetic view) {id="deprecation-of-synthetic-views"}

以前 Kotlin Android Extensions plugin 中曾有过 _合成视图(synthetic view)_, 用来简化与 UI 元素的交互, 并减少样板代码.
现在 Google 提供了一种原生机制来完成相同的工作 - Android Jetpack 的 [视图绑定](https://developer.android.com/topic/libraries/view-binding),
因此我们废弃了合成视图, 请改用这个新功能.

我们从 `kotlin-android-extensions` 中抽取了 Parcelable 实现代码生成器, 并对这个 plugin 的其他部分(也就是合成视图)开始了废弃周期.
这些功能现在还能继续工作, 但会有废弃警告信息.
将来, 你需要为你的项目使用其他解决方案.
这里有一篇 [指南](https://goo.gle/kotlin-android-extensions-deprecation),
可以帮助你将 Android 项目从合成视图(synthetic view) 迁移到视图绑定(view binding).

### Parcelable 实现代码生成器的新 plugin {id="new-plugin-for-parcelable-implementation-generator"}

`Parcelable` 实现代码生成器移动到了新的 `kotlin-parcelize` plugin 中.
请使用这个 plugin 而不是原来的 `kotlin-android-extensions`.

> 在同一个模块中, `kotlin-parcelize` 和 `kotlin-android-extensions` 不能同时使用.
>
{style="note"}

`@Parcelize` 注解移动到了 `kotlinx.parcelize` 包中.

更多详情请参见 [Android 文档](https://developer.android.com/kotlin/parcelize) 中的 `Parcelable` 实现代码生成器.
