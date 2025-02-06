[//]: # (title: Compose 编译器选项 DSL)

Compose 编译器 Gradle plugin 提供了一个 DSL, 用于配置各种编译器选项.
对于适用了 Compose 编译器 Gradle plugin 的模块, 可以在`build.gradle.kts` 文件的 `composeCompiler {}` 代码块中, 使用这个 DSL 来配置编译器.

你可以指定 2 种类型的选项:

* 一般编译器设置.
* 功能特性 flag, 启用或禁用新的功能特性和实验性功能特性, 这些功能特性将来会成为默认功能的一部分.

下面是一个配置示例:

```kotlin
composeCompiler {
    includeSourceInformation = true

    featureFlags = setOf(
        ComposeFeatureFlag.StrongSkipping.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups
    )
}
```

> Gradle plugin 对一些 Compose 编译器选项提供了默认值, 以前只能手动指定.
> 如果你使用 `freeCompilerArgs` 设置了这些选项, 例如, Gradle 会报告重复选项的错误.
>
{style="warning"}

## General 设置 {id="general-settings"}

### generateFunctionKeyMetaClasses {id="generatefunctionkeymetaclasses"}

**类型**: `Property<Boolean>`

**默认值**: `false`

如果设置为 `true`, 会生成带有注解的函数 key meta 类, 指明函数及其 group 的 key.

### includeSourceInformation {id="includesourceinformation"}

**类型**: `Property<Boolean>`

**默认值**: `false` (`true` for Android)

如果设置为 `true`, 在生成的代码中包含源代码信息.

记录源代码信息, 可以供工具使用, 以确定对应的 composable 函数的源代码位置.
这个选项不会影响通常由 Kotlin 编译器添加的符号或行信息的有无;
它只控制由 Compose 编译器添加的源代码信息.

### metricsDestination {id="metricsdestination"}

**类型**: `DirectoryProperty`

当指定一个目录时, Compose 编译器会使用这个目录来输出 [编译器指标](https://github.com/JetBrains/kotlin/blob/master/plugins/compose/design/compiler-metrics.md#reports-breakdown).
这些指标对于调试和优化你的应用程序的运行期性能会很有用:
指标会显示哪些 composable 函数可跳过, 可重启, 只读, 等等.

[reportsDestination](#reportsdestination) 选项也允许输出描述性报告(Descriptive Report).

要深入了解编译器指标, 请参见 [Composable 指标的 blog](https://chrisbanes.me/posts/composable-metrics/).

### reportsDestination {id="reportsdestination"}

**类型**: `DirectoryProperty`

当指定一个目录时, Compose 编译器会使用这个目录来输出 [编译器指标报告](https://github.com/JetBrains/kotlin/blob/master/plugins/compose/design/compiler-metrics.md#reports-breakdown).
这些报告对于优化你的应用程序的运行期性能会很有用:
报告会显示哪些 composable 函数可跳过, 可重启, 只读, 等等.

[metricsDestination](#metricsdestination) 选项允许输出原始指标(Raw Metric).

要深入了解编译器指标, 请参见 [Composable 指标的 blog](https://chrisbanes.me/posts/composable-metrics/).

### stabilityConfigurationFile {id="stabilityconfigurationfile"}

> 在 Kotlin 2.1.0-Beta1 中 _已废弃_, 请改为使用 [stabilityConfigurationFiles](#stabilityconfigurationfiles),
> 它可以使用多个稳定性配置文件.
>
{style="warning"}

**类型**: `RegularFileProperty`

一个稳定性配置文件(Stability Configuration File), 包含类的列表, 这些类会被认为是稳定的.
详情请参见 Jetpack Compose 文档中的 [稳定性配置文件](https://developer.android.com/develop/ui/compose/performance/stability/fix#configuration-file).

### stabilityConfigurationFiles {id="stabilityconfigurationfiles"}

**类型**: `ListProperty<RegularFile>`

用于当前模块的稳定性配置文件(Stability Configuration File).

稳定性配置文件包含类的列表, 这些类会被编译器认为是稳定的.
详情请参见 Jetpack Compose 文档中的 [稳定性配置文件](https://developer.android.com/develop/ui/compose/performance/stability/fix#configuration-file).

下面是一个示例, 指定多个文件路径:

```kotlin
composeCompiler {
    stabilityConfigurationFiles.addAll(
        project.layout.projectDirectory.file("configuration-file1.conf"),
        project.layout.projectDirectory.file("configuration-file2.conf"),
    )
}
```

### includeTraceMarkers {id="includetracemarkers"}

**类型**: `Property<Boolean>`

**默认值**: `true`

如果设置为 `true`, 会在生成的代码中包含组合追踪标记(Composition Trace Marker).

Compose 编译器可以向字节码注入额外的追踪信息, 这些信息可以用来在 Android Studio 的系统追踪分析器(System Trace Profiler)中显示 composable 函数.

详情请参见这篇 [Android 开发者 blog](https://medium.com/androiddevelopers/jetpack-compose-composition-tracing-9ec2b3aea535).

### targetKotlinPlatforms {id="targetkotlinplatforms"}

**类型**: `SetProperty<KotlinPlatformType>`

指示 Compose 编译器 Gradle plugin 应该被适用到哪些 Kotlin 平台.
默认情况下, plugin 会被适用到所有的 Kotlin 平台.

要只启用一个特定的 Kotlin 平台, 例如, Kotlin/JVM:

```kotlin
composeCompiler {
    targetKotlinPlatforms.set(setOf(KotlinPlatformType.jvm))
}
```

要对一个或多个 Kotlin 平台禁用 Gradle plugin, 例如, Kotlin/Native 和 Kotlin/JS:

```kotlin
composeCompiler {
    targetKotlinPlatforms.set(
        KotlinPlatformType.values()
            .filterNot { it == KotlinPlatformType.native || it == KotlinPlatformType.js }
            .asIterable()
    )
}
```

## 功能特性 flag {id="feature-flags"}

功能特性 flag 组织为一个单独的 set, 以便尽量减少对顶级属性的变更, 因为新的 flag 会持续不断的推出和废弃.

要启用一个默认禁用的功能特性, 请在 set 中指定它, 例如:

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

要禁用一个默认启用的功能特性, 请对它调用 `disabled()` 函数, 例如:

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

如果你直接配置 Compose 编译器, 请使用以下语法, 向它传递功能特性 flag:

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

### IntrinsicRemember {id="intrinsicremember"}

**默认值**: 启用

如果启用, 会打开内在记忆(Intrinsic Remember)性能优化.

内在记忆(Intrinsic Remember)是一种优化模式, 它会内联(inline) `remember` 调用,
并且, 在可能的情况下, 将对 key 的 `.equals()` 比较替换为对 `$changed` 元参数(Meta Parameter)的比较.
这会使得运行期使用更少的 slot, 执行更少的比较.

### OptimizeNonSkippingGroups {id="optimizenonskippinggroups"}

<primary-label ref="experimental-general"/>

**默认值**: 禁用

如果启用, 会删除围绕不可跳过的 composable 函数的 group.

不可跳过的 composable 函数不需要 group,
这个优化会跳过围绕这些函数的不必要的 group, 改善你的应用程序的运行期性能.
这个优化会删除围绕一些函数的 group, 例如, 明确标记为 `@NonSkippableComposable` 的函数,
以及隐含的不可跳过的函数 (内联函数, 以及返回非 `Unit` 值的函数, 例如 `remember`).

### PausableComposition {id="pausablecomposition"}

<primary-label ref="experimental-general"/>

**默认值**: 禁用

如果启用, 会改变 composable 函数的代码生成, 允许在可暂停的组合的一部分时暂停.
这可以让 Compose 运行期在跳过点(skipping point)挂起组合,
将长时间运行的组合拆分到多个帧(frame)中.

Lazy List 和其它性能密集的组件使用可暂停的组合预获取内容,
如果以阻塞的方式执行, 可能导致视觉卡顿.

> 这个功能特性 flag 只会影响支持可暂停组合的 Compose 运行期版本的行为,
> 从 `androidx.compose.runtime` 1.8.0-alpha02 开始.
> 旧的版本会忽略这个功能特性 flag.
>
{style="note"}

### StrongSkipping {id="strongskipping"}

**默认值**: 启用

如果启用, 会打开强跳过(Strong Skipping)模式.

强跳过(Strong Skipping)模式会适用以前只用于参数未改变的 composable 函数的稳定值(Stable Value)的优化,
改善你的应用程序的运行期性能.
例如, 具体不稳定参数(Unstable Parameter)的 composable 函数会成为可跳过函数,
具有不稳定捕获值(Unstable Capture)的 Lambda 表达式会被记忆.

详情请参见, Kotlin GitHub 代码仓库中的 [强跳过(Strong Skipping)模式的描述](https://github.com/JetBrains/kotlin/blob/master/plugins/compose/design/strong-skipping.md).
