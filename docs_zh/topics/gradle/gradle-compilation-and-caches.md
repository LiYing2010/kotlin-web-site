[//]: # (title: Kotlin Gradle plugin 中的编译与缓存)

在本章中, 你将学习以下内容:
* [增量编译(Incremental compilation)](#incremental-compilation)
* [对 Gradle 构建缓存的支持](#gradle-build-cache-support)
* [对 Gradle 配置缓存的支持](#gradle-configuration-cache-support)
* [Kotlin daemon 及其在 Gradle 中的使用](#the-kotlin-daemon-and-how-to-use-it-with-gradle)
* [回退到以前的编译器](#rolling-back-to-the-previous-compiler)
* [定义 Kotlin 编译器执行策略](#defining-kotlin-compiler-execution-strategy)
* [Kotlin 编译器的 fallback 策略](#kotlin-compiler-fallback-strategy)
* [试用最新的语言版本](#trying-the-latest-language-version)
* [构建报告](#build-reports)

## 增量编译(Incremental Compilation) {id="incremental-compilation"}

Kotlin Gradle plugin 支持增量编译(Incremental Compilation)模式, 对 Kotlin/JVM 和 Kotlin/JS 项目默认启用.
增量编译模式会监视 classpath 中的文件在两次编译之间的变更, 因此只有变更过的文件会被编译.
这种方法与 [Gradle 的构建缓存](#gradle-build-cache-support) 一起配合工作,
并支持 [编译回避(compilation avoidance)](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance).

对 Kotlin/JVM, 增量编译依赖于类路径快照(Classpath Snapshot),
类路径快照捕获模块的 API 结构, 确定什么时候需要重新编译.
为了优化整个流程管道, Kotlin 编译器使用两种类型的类路径快照:

* **细粒度快照(Fine-grained Snapshot):** 包含类成员的详细信息, 例如属性或函数.
  当检测到成员级变更时, Kotlin 编译器只重编译依赖于被修改的成员的那些类.
  为了保持性能, Kotlin Gradle plugin 会创建为 Gradle 缓存中的 `.jar` 文件粗粒度快照(Coarse-grained Snapshot).
* **粗粒度快照(Coarse-grained Snapshot):** 只包含类 [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) 的 hash.
  当 ABI 的一部分发生变更时, Kotlin 编译器会重编译依赖于被修改的类的所有类.
  对于不经常变更的类, 例如外部库, 这很有用.

> Kotlin/JS 项目 使用另一种基于历史文件的增量编译方式.
>
{style="note"}

有以下几种方式可以禁用增量编译设定:

* 对 Kotlin/JVM 项目: 设置 `kotlin.incremental=false` .
* 对 Kotlin/JS 项目: 设置 `kotlin.incremental.js=false` .
* 在命令行参数中, 添加 `-Pkotlin.incremental=false` 或 `-Pkotlin.incremental.js=false` .

  需要向所有后续的编译命令都添加这个参数.

当你禁用增量编译时, 增量编译的缓存会在构建后失效.
初次编译永远不会是增量编译.

> 有时增量编译的问题会在错误发生之后再经过多轮才报告给使用者.
> 请使用 [构建报告](#build-reports) 来追踪变更历史和编译历史.
> 这样可以帮助你提供可重现的 bug 报告.
>
{style="tip"}

关于我们目前的增量编译方案如何工作, 以及与以前方案的区别,
请阅读我们的 [blog](https://blog.jetbrains.com/kotlin/2022/07/a-new-approach-to-incremental-compilation-in-kotlin/).

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

默认情况下, Kotlin daemon 会从 Gradle daemon 继承一组参数,
但会使用对 Kotlin daemon 直接指定的任何 JVM 参数覆盖继承得到的参数.
例如, 如果你在 `gradle.properties` 文件中添加以下 JVM 参数:

```none
org.gradle.jvmargs=-Xmx1500m -Xms500m -XX:MaxMetaspaceSize=1g
```

这些参数之后会被添加到 Kotlin daemon 的 JVM 参数:

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -XX:MaxMetaspaceSize=1g -XX:UseParallelGC -ea -XX:+UseCodeCacheFlushing -XX:+HeapDumpOnOutOfMemoryError -Djava.awt.headless=true -Djava.rmi.server.hostname=127.0.0.1 --add-exports=java.base/sun.nio.ch=ALL-UNNAMED
```

> 关于 Kotlin daemon 使用 JVM 参数的默认行为, 请参见 [Kotlin daemon 使用 JVM 参数的行为](#kotlin-daemon-s-behavior-with-jvm-arguments).
>
{style="note"}

#### 设置系统属性 kotlin.daemon.jvm.options {id="kotlin-daemon-jvm-options-system-property"}

如果 Gradle daemon 的 JVM 参数包含 `kotlin.daemon.jvm.options` 系统属性 – 请在 `gradle.properties` 文件中指定:

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m,Xms500m
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
kotlin.daemon.jvmargs=-Xmx1500m -Xms500m
```

注意, 如果在这里, 或在 Gradle 的 JVM 参数中, 你没有指定 `ReservedCodeCacheSize` 参数,
Kotlin Gradle plugin 会使用默认值 `320m`:

```none
-Xmx1500m -XX:ReservedCodeCacheSize=320m -Xms500m
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
tasks.withType(CompileUsingKotlinDaemon).configureEach { task ->
    task.kotlinDaemonJvmArguments = ["-Xmx1g", "-Xms512m"]
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

> 这种情况下, 会在任务执行时启动一个新的 Kotlin daemon 实例.
> 更多详情请参见 [Kotlin daemon 使用 JVM 参数的行为](#kotlin-daemon-s-behavior-with-jvm-arguments).
>
{style="note"}

### Kotlin daemon 使用 JVM 参数的行为 {id="kotlin-daemon-s-behavior-with-jvm-arguments"}

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

如果没有指定以下参数, Kotlin daemon 会从 Gradle daemon 继承这些参数:

* `-Xmx`
* `-XX:MaxMetaspaceSize`
* `-XX:ReservedCodeCacheSize`. 如果没有指定或继承, 默认值为 `320m`.

Kotlin daemon 具有以下默认 JVM 参数:
* `-XX:UseParallelGC`. 只有在没有指定其它垃圾收集器时, 这个参数才会适用.
* `-ea`
* `-XX:+UseCodeCacheFlushing`
* `-Djava.awt.headless=true`
* `-D{java.servername.property}={localhostip}`
* `--add-exports=java.base/sun.nio.ch=ALL-UNNAMED`. 这个参数只对 JDK 16 或更高版本适用.

> Kotlin daemon 的默认 JVM 参数列表对不同的版本可能发生变化.
> 你可以使用 [VisualVM](https://visualvm.github.io/) 之类的工具检查一个运行中的 JVM 进程的实际设置, 例如 Kotlin daemon.
>
{style="note"}

## 回退到以前的编译器 {id="rolling-back-to-the-previous-compiler"}

从 Kotlin 2.0.0 开始, 默认使用 K2 编译器.

要在 Kotlin 2.0.0 之后的版本中使用以前的编译器, 请使用以下方法:

* 在你的 `build.gradle.kts` 文件中, [设置语言版本](gradle-compiler-options.md#example-of-setting-languageversion) 为 `1.9`.

  或者
* 使用以下编译器选项: `-language-version 1.9`.

关于 K2 编译器的优点, 请参见 [K2 编译器迁移向导](k2-compiler-migration-guide.md).

## 定义 Kotlin 编译器执行策略 {id="defining-kotlin-compiler-execution-strategy"}

_Kotlin 编译器执行策略_ 定义 Kotlin 编译器在哪里执行, 以及各种情况下是否支持增量编译.

有 3 种编译器执行策略:

| 策略             | Kotlin 编译器在哪里执行          | 增量编译 | 其它特征, 以及注意事项                                                                                                                                                                 |
|----------------|--------------------------|------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Daemon         | 在 Kotlin 自己的 daemon 进程之内 | 是    | _默认的, 而且最快的策略_. 可以在不同的 Gradle daemon, 以及多个并行编译之间共用.                                                                                                                          |
| In process     | 在 Gradle daemon 进程之内     | 否    | 可以与 Gradle daemon 共用 heap. "In process" 执行策略比 "Daemon" 执行策略 _更慢_. 每个 [worker](https://docs.gradle.org/current/userguide/worker_api.html) 会为每个编译创建单独的 Kotlin 编译器 classloader. |
| Out of process | 对每个编译都在单独的进程内            | 否    | 这是最慢的执行策略. 与 "In process" 类似, 但还会为每个编译在 Gradle worker 内创建单独的 Java 进程.                                                                                                        |

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
        compilerExecutionStrategy = KotlinCompilerExecutionStrategy.IN_PROCESS
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

## 试用最新的语言版本 {id="trying-the-latest-language-version"}

从 Kotlin 2.0.0 开始, 要试用最新的语言版本, 请在你的 `gradle.properties` 文件中设置 `kotlin.experimental.tryNext` 属性.
使用这个属性时, Kotlin Gradle plugin 会将语言版本增加到比你的 Kotlin 版本的默认值的下一个版本.
例如, 在 Kotlin 2.0.0 中, 默认的语言版本是 2.0, 因此这个属性会将语言版本配置为 2.1.

或者, 你也可以运行以下命令:

```shell
./gradlew assemble -Pkotlin.experimental.tryNext=true
``` 

在 [构建报告](#build-reports) 中, 你可以看到用来编译每个任务的语言版本.

## 构建报告 {id="build-reports"}

构建报告包括不同编译阶段的持续时间, 以及为什么不能进行增量编译的原因.
如果编译时间太长, 或对于相同的项目出现了不同的编译时间, 可以使用构建报告来调查性能问题.

Kotlin 构建报告可以帮助你调查构建性能相关的问题, 它比 [Gradle build scans](https://scans.gradle.com/) 更加有效,
Gradle Build Scan 中的粒度只是单个 Gradle Task.

通过对长时间运行的编译分析构建报告, 可以帮助你解决两种常见问题:
* 构建不能增量模式运行. 分析原因, 并解决底层问题.
* 构建是增量模式运行, 但耗费太多时间.
  可以尝试重新组织源代码文件 — 切分大的文件, 将不同的类保存到不同的文件, 重构大的类, 在不同的文件中声明顶层函数, 等等.

构建报告还会显示项目中使用的 Kotlin 版本.
此外, 从 Kotlin 1.9.0 开始, 你可以在你的 [Gradle Build Scan](https://scans.gradle.com/) 中看到, 编译代码时使用的是哪个编译器.

请参见
[如何阅读构建报告](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_to_read_build_reports)
以及 [JetBrains 如何使用构建报告](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#how_we_use_build_reports_in_jetbrains).

### 启用构建报告 {id="enabling-build-reports"}

要启用构建报告, 请在 `gradle.properties` 中指定构建报告输出的保存位置:

```none
kotlin.build.report.output=file
```

以下各个值的组合可以用于输出:

| 选项            | 含义                                                                                                                                                                                                                                                                                                                                                                                                   |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `file`        | 将构建报告保存到本地文件, 使用可供人类阅读的格式. 默认设置是 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt`                                                                                                                                                                                                                                                                                        |
| `single_file` | 将构建报告保存到本地文件, 使用二进制对象格式.                                                                                                                                                                                                                                                                                                                                                                             |
| `build_scan`  | 将构建报告保存到 [build scan](https://scans.gradle.com/) 的 `custom values` 小节. 注意, Gradle Enterprise plugin 会限制 custom values 的数量和长度. 在很大的项目中, 有些值可能会丢失.                                                                                                                                                                                                                                                     |
| `http`        | 通过 HTTP(S) 提交构建报告. 使用 POST 方法传送 JSON 格式的测量结果. 你可以在 [Kotlin 代码仓库](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt) 中看到传送的数据的当前版本. 你可以在 [这篇 Blog](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/#enable_build_reports) 看到 HTTP Endpoint 的示例 |
| `json`        | 将构建报告保存到本地文件, 使用 JSON 格式. 请使用 `kotlin.build.report.json.directory` 来设置你的构建报告的路径 (参见下文). 默认情况下, 文件名是 `${project_name}-build-<date-time>-<index>.json`.                                                                                                                                                                                                                                                |

下面是 `kotlin.build.report` 的选项列表:

```none
# 需要的报告输出格式. 可以任意组合
kotlin.build.report.output=file,single_file,http,build_scan,json

# 如果使用 single_file 输出, 则必须设置. 表示报告的输出位置
# 请使用这个设定, 代替已废弃的 `kotlin.internal.single.build.metrics.file` 属性
kotlin.build.report.single_file=some_filename

# 如果使用 json 输出, 则必须设置. 表示报告的输出位置
kotlin.build.report.json.directory=my/directory/path

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

### custom values 的限制 {id="limit-of-custom-values"}

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

### 关闭对项目和系统属性的收集 {id="switching-off-collecting-project-and-system-properties"}

HTTP 构建统计 log 可能包含某些项目和系统属性. 这些属性可以改变构建的行为, 因此将它们输出到构建统计信息中会很有用处.
这是属性也可能存储了敏感信息, 例如, 密码, 或项目的完整路径.

你可以向你的 `gradle.properties` 文件添加 `kotlin.build.report.http.verbose_environment` 属性, 来禁止收集这些统计信息.

> JetBrains 不会收集这些统计信息. 你需要选择一个地方来 [存储你的统计报告](#enabling-build-reports).
>
{style="note"}

## 下一步做什么? {id="what-s-next"}

学习:
* [Gradle 的基本概念与详细信息](https://docs.gradle.org/current/userguide/userguide.html).
* [对 Gradle plugin 变体的支持](gradle-plugin-variants.md).
