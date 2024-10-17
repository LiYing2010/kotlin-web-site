[//]: # (title: Kotlin Gradle plugin 中的编译与缓存)

在本章中, 你将学习以下内容:
* [增量编译(Incremental compilation)](#incremental-compilation)
* [对 Gradle 构建缓存的支持](#gradle-build-cache-support)
* [对 Gradle 配置缓存的支持](#gradle-configuration-cache-support)
* [Kotlin daemon 及其在 Gradle 中的使用](#the-kotlin-daemon-and-how-to-use-it-with-gradle)
* [定义 Kotlin 编译器执行策略](#defining-kotlin-compiler-execution-strategy)
* [Kotlin 编译器的 fallback 策略](#kotlin-compiler-fallback-strategy)
* [构建报告](#build-reports)

## 增量编译(Incremental compilation)

Kotlin Gradle plugin 支持增量编译模式.
增量编译模式会监视源代码文件在两次编译之间的变更, 因此只有变更过的文件会被编译.

增量编译模式支持 Kotlin/JVM 和 Kotlin/JS 工程, 并且默认开启.

有以下几种方式可以禁用增量编译设定:

* 对 Kotlin/JVM 项目: 设置 `kotlin.incremental=false` .
* 对 Kotlin/JS 项目: 设置 `kotlin.incremental.js=false` .
* 在命令行参数中, 添加 `-Pkotlin.incremental=false` 或 `-Pkotlin.incremental.js=false` .

  需要向所有后续的编译命令都添加这个参数.

注意: 任何一次编译如果关闭了增量编译模式, 都会导致增量编译的缓存失效. 初次编译不会是增量编译.

> 有时增量编译的问题会在错误发生之后再经过多轮才报告给使用者.
> 请使用 [构建报告](#build-reports) 来追踪变更历史和编译历史.
> 这样可以帮助你提供可重现的 bug 报告.
>
{style="tip"}

### 增量编译的新方案

从 Kotlin 1.7.0 开始, 针对 JVM 后端, 而且只在 Gradle 构建系统中, 可以使用增量编译的新方案.
从 Kotlin 1.8.20 开始, 默认启用这个新方案.
这种方案支持发生在依赖的非 Kotlin 模块内的变更,
包括编译回避功能的改进, 并且与 [Gradle 构建缓存](#gradle-build-cache-support) 兼容.

这些功能改进可以减少非增量式构建的次数, 让整体的编译时间更加快速.
如果你使用构建缓存, 或者在非 Kotlin Gradle 模块中频繁进行修改, 那么可以得到显著的性能改进.

要关闭这个新方案, 请在你的 `gradle.properties` 中设置以下选项:

```none
kotlin.incremental.useClasspathSnapshot=false
```

希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-49682) 提供你对这个功能的反馈意见.

关于增量编译的新方案的底层实现细节, 请参见
[这篇 Blog](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/).

### 对编译任务的输出的精确备份

> 对编译任务的输出的精确备份是 [实验性功能](components-stability.md#stability-levels-explained).
> 希望你能通过我们的 [问题追踪系统](https://kotl.in/issue/experimental-ic-optimizations) 提供你的反馈意见.
>
{style="warning"}

从 Kotlin 1.8.20 开始, 你可以启用精确备份功能, 这时只有 Kotlin 在增量编译中重新编译的那些类会被备份.
完整备份和精确备份都可以帮助在发生编译错误后再次运行增量构建.
精确备份与完整备份相比, 会耗费较少的构建时间.
对于大型的项目, 或者很多任务都创建备份, 那么完整备份可能会花费 **明显** 更长的构建时间, 尤其是如果项目位于速度较慢的 HDD 上.

要启用这个优化功能, 请向 `gradle.properties` 文件添加 `kotlin.compiler.preciseCompilationResultsBackup` Gradle 属性:

```none
kotlin.compiler.preciseCompilationResultsBackup=true
```

#### JetBrains 使用精确备份的例子

在下面的图表中, 你可以看到使用精确备份与完整备份相对比的示例:

<img src="comparison-of-full-and-precise-backups.png" alt="完整备份与精确备份的对比" width="700"/>

第一个和第二个对比图显示了在 Kotlin 项目中使用精确备份时对 Kotlin Gradle plugin 构建的影响:

1. 进行一个小的 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 变更之后:
   向一个被大量模块依赖的模块添加一个新的 public 方法.
2. 进行一个小的非 ABI 变更之后:
   向一个没有被其他模块依赖的模块添加一个 private 函数.

第三个对比图显示了在 [Space](https://www.jetbrains.com/space/) 项目中使用精确备份时, 在小的非 ABI 更改后对 Web 前端构建的影响:
向一个被大量模块依赖的 Kotlin/JS 模块添加一个 private 函数.

我们在使用 Apple M1 Max CPU 的计算机上进行这些测量; 在不同的计算机上会出现稍微不同的结果.
影响性能的因素包括但不限于以下几点:

* [Kotlin daemon](#the-kotlin-daemon-and-how-to-use-it-with-gradle)
  和 [Gradle daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html) 热身状况(warm)如何.
* 硬盘速度如何.
* CPU 型号, 以及它的繁忙程度.
* 哪些模块受到变更的影响, 以及这些模块有多大.
* 是 ABI 变更还是非 ABI 变更.

#### 使用构建报告来评估优化

要对你的项目和场景, 评估优化在你的计算机上的影响, 你可以使用 [Kotlin 构建报告](#build-reports).
请向你的 `gradle.properties` 文件添加下面的属性, 启用文本文件格式的构建报告:

```text
kotlin.build.report.output=file
```

下面是在启用精确备份*之前*, 构建报告的相关部分的示例:

```text
Task ':kotlin-gradle-plugin:compileCommonKotlin' finished in 0.59 s
<...>
Time metrics:
 Total Gradle task time: 0.59 s
 Task action before worker execution: 0.24 s
  Backup output: 0.22 s // 注意这个数字
<...>
```

下面是在启用精确备份*之后*, 构建报告的相关部分的示例:

```text
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

## 对 Gradle 构建缓存的支持 {id="gradle-build-cache-support"}

Kotlin 插件支持 [Gradle 构建缓存](https://docs.gradle.org/current/userguide/build_cache.html),
构建缓存会保存构建的输出, 并在未来的构建中重复使用.

如果想要对所有的 Kotlin 任务禁用缓存, 请将系统属性 `kotlin.caching.enabled` 设置为 `false`
(也就是使用参数 `-Dkotlin.caching.enabled=false` 来执行编译).

## 对 Gradle 配置缓存的支持 {id="gradle-configuration-cache-support"}

Kotlin plugin 使用 [Gradle 配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html),
通过对之后的构建重用配置阶段的结果, 来增加构建处理的速度.

关于如何启用配置缓存, 请参见
[Gradle 文档](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage).
启用这个功能之后, Kotlin Gradle plugin 会自动开始使用它.

## Kotlin daemon 及其在 Gradle 中的使用 {id="the-kotlin-daemon-and-how-to-use-it-with-gradle"}

Kotlin daemon 会:
* 与 Gradle daemon 共同运行来编译项目.
* 当你使用 IntelliJ IDEA 内建的构建系统来编译项目时, 它会在 Gradle daemon 之外单独运行.

在 Gradle 的 [执行阶段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:build_phases),
当一个 Kotlin 编译任务开始编译源代码时, Kotlin daemon 就会启动.
Kotlin daemon 会和 Gradle daemon 一起停止, 或在没有 Kotlin 编译任务执行, 空闲 2 个小时之后停止.

Kotlin daemon 使用与 Gradle daemon 相同的 JDK.

### 设置 Kotlin daemon 的 JVM 参数 {id="setting-kotlin-daemon-s-jvm-arguments"}

以下列表是设置参数的几种不同方式, 列表中设置方式按照优先级排列, 每种方式都会覆盖在它之前的其他方式:
* [继承 Gradle daemon 参数](#gradle-daemon-arguments-inheritance)
* [设置系统属性 `kotlin.daemon.jvm.options`](#kotlin-daemon-jvm-options-system-property)
* [设置属性 `kotlin.daemon.jvmargs`](#kotlin-daemon-jvmargs-property)
* [使用 `kotlin` 扩展](#kotlin-extension)
* [使用特定的任务定义](#specific-task-definition)

#### 继承 Gradle daemon 参数 {id="gradle-daemon-arguments-inheritance"}

如果不做任何设定, Kotlin daemon 会从 Gradle daemon 继承 JVM 参数.
比如, 在 `gradle.properties` 文件中:

```none
org.gradle.jvmargs=-Xmx1500m -Xms=500m
```

#### 设置系统属性 kotlin.daemon.jvm.options {id="kotlin-daemon-jvm-options-system-property"}

如果 Gradle daemon 的 JVM 参数包含 `kotlin.daemon.jvm.options` 系统属性 – 请在 `gradle.properties` 文件中指定:

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m,Xms=500m
```

传递参数时, 要遵守以下规则:
* **只有** 在参数 `Xmx`, `XX:MaxMetaspaceSize`, 和 `XX:ReservedCodeCacheSize` 之前要使用减号 `-`, 在其它参数之前不要使用.
* 参数之间的分隔使用逗号 (`,`), _不带空格_. 空格之后的参数会被 Gradle daemon 使用, 而不是被 Kotlin daemon 使用.

> 如果满足以下所有条件, Gradle 会忽略这些属性:
> * Gradle 使用 JDK 1.9 或更高版本.
> * Gradle 版本在 7.0(含) 和 7.1.1(含) 之间.
> * Gradle 正在编译 Kotlin DSL 脚本.
> * Kotlin daemon 没有运行.
>
> 要解决这个问题, 请升级 Gradle 到 7.2 (或更高版本), 或者使用 `kotlin.daemon.jvmargs` 属性 – 参见以下章节.
>
{style="warning"}

#### 设置属性 kotlin.daemon.jvmargs {id="kotlin-daemon-jvmargs-property"}

你可以在 `gradle.properties` 文件中添加 `kotlin.daemon.jvmargs` 属性:

```none
kotlin.daemon.jvmargs=-Xmx1500m -Xms=500m
```

#### 使用 kotlin 扩展 {id="kotlin-extension"}

你可以在 `kotlin` 扩展中指定参数:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    kotlinDaemonJvmArgs = listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    kotlinDaemonJvmArgs = ["-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"]
}
```

</tab>
</tabs>

#### 使用特定的任务定义 {id="specific-task-definition"}

你可以对特定的任务指定参数:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    kotlinDaemonJvmArguments.set(listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(CompileUsingKotlinDaemon::class).configureEach { task ->
    task.kotlinDaemonJvmArguments.set(["-Xmx1g", "-Xms512m"])
}
```

</tab>
</tabs>

> 这种情况下, 会在任务执行时启动一个新的 Kotlin daemon 实例. 更多详情请参见 [指定 JVM 参数时 Kotlin daemon 的行为](#kotlin-daemon-s-behavior-with-jvm-arguments).
>
{style="note"}

### 指定 JVM 参数时 Kotlin daemon 的行为 {id="kotlin-daemon-s-behavior-with-jvm-arguments"}

配置 Kotlin daemon 的 JVM 参数时, 请注意:

* 如果不同的子项目或任务设置了不同的 JVM 参数, 那么会存在多个 Kotlin daemon 实例同时运行.
* 只有当 Gradle 运行相关的编译任务, 而且现存的 Kotlin daemon 实例没有使用相同的 JVM 参数时, 才会启动新的 Kotlin daemon 实例.
  假设你的项目包含很多子项目. 大部分子项目对 Kotlin daemon 需要某种 heap memory 设定,
  但有一个模块需要很大的 heap memory 设定 (然而这个模块很少被编译).
  这种情况下, 你应该对这个模块设定不同的 JVM 参数,
  这样, 就可以只有在开发者编译这个特定模块时, 才会使用很大的 heap memory 启动一个 Kotlin daemon.
  > 如果已有某个 Kotlin daemon 在运行中, 并且它的 heap memory 尺寸足够满足编译的需求,
  > 那么即使另一个任务要求的 JVM 参数不同, 也仍会重用这个 daemon, 而不是启动一个新的实例.
  >
  {style="note"}
* 如果 `Xmx` 参数未指定, Kotlin daemon 会从 Gradle daemon 继承.

## Kotlin 的新编译器 {id="the-new-kotlin-compiler"}

Kotlin 的新 K2 编译器处于 [Beta 阶段](components-stability.md#stability-levels-explained).
它对 Kotlin JVM, Native, Wasm 和 JS 项目提供基本的支持.

新编译器的目标是加速新的语言功能的开发, 统一 Kotlin 支持的所有平台, 带来性能改进, 并为编译器扩展提供 API.

从 Kotlin 2.0 开始, 将会默认使用 K2 编译器.
要在你的项目中试用它, 并检查它的性能, 请使用 `kotlin.experimental.tryK2=true` Gradle 属性, 或执行下面的命令:

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

这个 Gradle 属性会自动将默认语言版本设置为 2.0, 并更新 [构建报告](#build-reports)
其中包含, 与当前的编译器相比, 使用 K2 编译器编译的 Kotlin 任务的数量.

关于 K2 编译器的稳定性, 更多详情请参见我们的 [Kotlin blog](https://blog.jetbrains.com/kotlin/2023/02/k2-kotlin-2-0/)

## 定义 Kotlin 编译器执行策略 {id="defining-kotlin-compiler-execution-strategy"}

_Kotlin 编译器执行策略_ 定义 Kotlin 编译器在哪里执行, 以及各种情况下是否支持增量编译.

有 3 种编译器执行策略:

| 策略 | Kotlin 编译器在哪里执行 | 增量编译 | 其它特征, 以及注意事项 |
|-----|-----------------------|---------|---------------------|
| Daemon         | 在 Kotlin 自己的 daemon 进程之内 | 是    | _默认的, 而且最快的策略_. 可以在不同的 Gradle daemon, 以及多个并行编译之间共用. |
| In process     | 在 Gradle daemon 进程之内     | 否    | 可以与 Gradle daemon 共用 heap. "In process" 执行策略比 "Daemon" 执行策略 _更慢_. 每个 [worker](https://docs.gradle.org/current/userguide/worker_api.html) 会为每个编译创建单独的 Kotlin 编译器 classloader. |
| Out of process | 对每个编译都在单独的进程内 | 否  | 这是最慢的执行策略. 与 "In process" 类似, 但还会为每个编译在 Gradle worker 内创建单独的 Java 进程.  |

要定义一个 Kotlin 编译器执行策略, 你可以使用以下属性之一:
* Gradle 属性 `kotlin.compiler.execution.strategy`.
* Compile Task 属性 `compilerExecutionStrategy`.

Task 属性 `compilerExecutionStrategy` 的优先级高于 Gradle 属性 `kotlin.compiler.execution.strategy`.

`kotlin.compiler.execution.strategy` 属性可以使用的值是:
1. `daemon` (默认值)
2. `in-process`
3. `out-of-process`

在 `gradle.properties` 中使用 Gradle 属性 `kotlin.compiler.execution.strategy`:

```none
kotlin.compiler.execution.strategy=out-of-process
```

Task 属性 `compilerExecutionStrategy` 可以使用的值是:
1. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON` (默认值)
2. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
3. `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

在你的构建脚本中使用 Task 属性 `compilerExecutionStrategy`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType(CompileUsingKotlinDaemon)
    .configureEach {
        compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
    }
```

</tab>
</tabs>

## Kotlin 编译器的 fallback 策略 {id="kotlin-compiler-fallback-strategy"}

Kotlin 编译器的 fallback 策略是指, 如果 daemon 因为某种原因失败, 则在 Kotlin daemon 之外运行编译任务.
如果 Gradle daemon 启动, 编译器会使用 ["In process" 策略](#defining-kotlin-compiler-execution-strategy).
如果 Gradle daemon 没有启动, 编译器会使用 "Out of process" 策略.

当 fallback 发生时, 在你的 Gradle 构建输出中会收到以下警告信息:

```none
Failed to compile with Kotlin daemon: java.lang.RuntimeException: Could not connect to Kotlin compile daemon
[exception stacktrace]
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.
```

但是, 静默的 fallback 到其他策略, 会消耗大量的系统资源, 或导致不确定的构建结果.
关于这个问题, 请参见这个 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy).
要避免这个问题, 有一个 Gradle 属性 `kotlin.daemon.useFallbackStrategy`, 默认值为 `true`.
当它的值设置为 `false` 时, daemon 启动或通信时问题会导致构建失败.
请在 `gradle.properties` 文件中声明这个属性:

```none
kotlin.daemon.useFallbackStrategy=false
```

在 Kotlin 编译任务中也有一个 `useDaemonFallbackStrategy` 属性, 如果同时使用, 它的优先级会高于 Gradle 属性.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks {
    compileKotlin {
        useDaemonFallbackStrategy.set(false)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named("compileKotlin").configure {
    useDaemonFallbackStrategy = false
}
```
</tab>
</tabs>

如果运行编译所需要的内存不足, 你会在 log 中看到相关信息.

## 构建报告 {id="build-reports"}

> 构建报告是 [实验性功能](components-stability.md).
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文). 请注意, 只为评估目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提供你的反馈意见.
>
{style="warning"}

构建报告包括不同编译阶段的持续时间, 以及为什么不能进行增量编译的原因.
如果编译时间太长, 或对于相同的项目出现了不同的编译时间, 可以使用构建报告来调查性能问题.

Kotlin 构建报告可以帮助你调查构建性能相关的问题, 它比 [Gradle build scans](https://scans.gradle.com/) 更加有效,
Gradle Build Scan 中的粒度只是单个 Gradle Task.

通过对长时间运行的编译分析构建报告, 可以帮助你解决两种常见问题:
* 构建不能增量模式运行. 分析原因, 并解决底层问题.
* 构建是增量模式运行, 但耗费太多时间.
  可以尝试重新组织源代码文件 — 切分大的文件, 将不同的类保存到不同的文件, 重构大的类, 在不同的文件中声明顶层函数, 等等.

构建报告还会显示项目中使用的 Kotlin 版本.
此外, 从 Kotlin 1.9.0 开始, 你可以在你的 [Gradle Build Scan](https://scans.gradle.com/) 中看到,
是使用当前编译器还是 [K2 编译器](#the-new-kotlin-compiler)来编译代码.

请参见
[如何阅读构建报告](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_to_read_build_reports)
以及 [JetBrains 如何使用构建报告](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_we_use_build_reports_in_jetbrains).

### 启用构建报告 {id="enabling-build-reports"}

要启用构建报告, 请在 `gradle.properties` 中指定构建报告输出的保存位置:

```none
kotlin.build.report.output=file
```

以下各个值的组合可以用于输出:

| 选项   | 含义   |
|--------|-------|
| `file` | 将构建报告保存到本地文件, 使用可供人类阅读的格式. 默认设置是 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt` |
| `single_file` | 将构建报告保存到本地文件, 使用二进制对象格式 |
| `build_scan` | 将构建报告保存到 [build scan](https://scans.gradle.com/) 的 `custom values` 小节. 注意, Gradle Enterprise plugin 会限制 custom values 的数量和长度. 在很大的项目中, 有些值可能会丢失. |
| `http` | 通过 HTTP(S) 提交构建报告. 使用 POST 方法传送 JSON 格式的测量结果. 你可以在 [Kotlin 代码仓库](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/statistics/CompileStatisticsData.kt) 中看到传送的数据的当前版本. 你可以在 [这篇 Blog](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#enable_build_reports) 看到 HTTP Endpoint 的示例  |

下面是 `kotlin.build.report` 的选项列表:

```none
# 需要的报告输出格式. 可以任意组合
kotlin.build.report.output=file,single_file,http,build_scan

# 如果使用 single_file 输出, 则必须设置. 表示报告的输出位置
# 请使用这个设定, 代替已废弃的 `kotlin.internal.single.build.metrics.file` 属性
kotlin.build.report.single_file=some_filename

# 可选项. 文件格式的报告的输出目录. 默认值是: build/reports/kotlin-build/
kotlin.build.report.file.output_dir=kotlin-reports

# 可选项. 用来标记你的构建报告的标签 (例如, debug parameters)
kotlin.build.report.label=some_label
```

只适用于 HTTP 输出的选项:

```none
# 必须设置. 基于 HTTP(S) 的报告的 POST 地址
kotlin.build.report.http.url=http://127.0.0.1:8080

# 可选项. 如果 HTTP endpoint 要求身份验证, 通过这个设置指定用户名和密码
kotlin.build.report.http.user=someUser
kotlin.build.report.http.password=somePassword

# 可选项. 将构建的 Git branch 名称添加到构建报告
kotlin.build.report.http.include_git_branch.name=true|false

# 可选项. 将编译器参数添加到构建报告
# 如果一个项目包含很多模块, 构建报告中的编译器参数可能非常重, 而且并没有多大帮助
kotlin.build.report.include_compiler_arguments=true|false
```

### custom values 的限制

为了收集 build scan 的统计信息, Kotlin 构建报告会使用 [Gradle 的 custom values](https://docs.gradle.com/enterprise/tutorials/extending-build-scans/).
你和各种 Gradle plugin 都可以向 custom value 写入数据. custom value 的数量存在限制.
关于 custom value 目前的最大件数, 请参见 [Build scan plugin 文档](https://docs.gradle.com/enterprise/gradle-plugin/#adding_custom_values).

如果你的项目很大, 这些 custom value 的数量可能非常大.
如果超过的限制, 你会在 log 中看到以下信息:

```text
Maximum number of custom values (1,000) exceeded
```

要减少 Kotlin plugin 产生的 custom value 数量, 你可以在 `gradle.properties` 文件中使用以下属性:

```none
kotlin.build.report.build_scan.custom_values_limit=500
```

### 关闭对项目和系统属性的收集

HTTP 构建统计 log 可能包含某些项目和系统属性. 这些属性可以改变构建的行为, 因此将它们输出到构建统计信息中会很有用处.
这是属性也可能存储了敏感信息, 例如, 密码, 或项目的完整路径.

你可以向你的 `gradle.properties` 文件添加 `kotlin.build.report.http.verbose_environment` 属性, 来禁止收集这些统计信息.

> JetBrains 不会收集这些统计信息. 你需要选择一个地方来 [存储你的统计报告](#enabling-build-reports).
>
{style="note"}

## 下一步做什么?

学习:
* [Gradle 的基本概念与详细信息](https://docs.gradle.org/current/userguide/userguide.html).
* [对 Gradle plugin 变体的支持](gradle-plugin-variants.md).
