[//]: # (title: 改善编译速度的技巧)

Kotlin/Native 编译器正在不断更新, 并改善它的性能.
使用最新的 Kotlin/Native 编译器, 以及正确配置的构建环境, 对于使用 Kotlin/Native 编译目标的项目, 你可以显著的改善编译速度.

关于如何提高 Kotlin/Native 编译过程速度, 请阅读我们的建议.

## 一般性建议 {id="general-recommendations"}

### 使用 Kotlin 的最新版本 {id="use-the-latest-version-of-kotlin"}

这样, 你始终可以得到最新的性能改善.
最新的 Kotlin 版本是 %kotlinVersion%.

### 不要创建巨大的类 {id="avoid-creating-huge-classes"}

尽量不要创建巨大的类, 这样的类会需要很长时间来编译, 执行期的装载时间也很长.

### 在多次构建之间, 保留下载的和缓存的组件 {id="preserve-downloaded-and-cached-components-between-builds"}

编译项目时, Kotlin/Native 会下载需要的组件,
并将它的一些工作结果缓存到 `$USER_HOME/.konan` 目录.
编译器会在后续的编译中使用这个目录, 使编译工作更快完成.

在容器(比如 Docker)内或者使用持续集成系统(Continuous Integration)构建时, 编译器可能在每次构建时都需要重新创建 `~/.konan` 目录.
为了避免这样的步骤, 请配置你的环境, 使其在多次构建之间保留 `~/.konan`.
比如, 使用 Gradle 属性 `kotlin.data.dir` 来重新定义它的位置.

或者, 也可以使用 `-Xkonan-data-dir` 编译器选项, 通过 `cinterop` 和  `konanc` 工具来配置你的的自定义目录路径.

## Gradle 配置 {id="gradle-configuration"}

使用 Gradle 的第 1 次编译通常会比之后的构建耗费更多时间, 因为需要下载依赖项目, 构建缓存, 并执行一些额外步骤.
你应该构建你的项目至少 2 次, 才能得到准确的编译时间.

下面是如何配置 Gradle 改善编译性能的一些建议.

### 增加 Gradle 的 heap 大小 {id="increase-gradle-heap-size"}

要增加 [Gradle heap 尺寸](https://docs.gradle.org/current/userguide/performance.html#adjust_the_daemons_heap_size), 请向你的 `gradle.properties` 文件添加 `org.gradle.jvmargs=-Xmx3g` 设置.

如果你使用 [并行构建](https://docs.gradle.org/current/userguide/performance.html#parallel_execution) 功能,
你可能需要使用 `org.gradle.workers.max` 属性或 `--max-workers` 命令行选项, 来选择正确的 worker 数量.
默认值是 CPU 的处理器个数.

### 只构建必须的二进制文件 {id="build-only-necessary-binaries"}

除非你真的需要这样, 否则不要运行构建整个项目的 Gradle 任务, 比如 `build` 或 `assemble`.
这样的任务会多次构建相同的代码, 增加编译时间.
典型情况下, 比如在 IntelliJ IDEA 中运行测试, 或从 Xcode 启动应用程序, Kotlin 工具会避免执行不必要的 Gradle 任务.

如果你遇到比较特殊的场景, 或使用了特殊的构建配置, 你可能需要自行选择 Gradle 任务:

* `linkDebug*`.
  为了在开发期间运行你的代码, 你通常只需要一个二进制文件, 因此只运行对应的 `linkDebug*` 任务通常就够了.
* `embedAndSignAppleFrameworkForXcode`.
  由于 iOS 各种模拟器和各种真实设备使用不同的处理器架构, 因此通常会将 Kotlin/Native 二进制文件以 universal (fat) 框架的形式发布.

  但是, 在本地开发时, 只为你正在使用的平台构建 `.framework` 文件会比较快.
  要构建一个平台专用的框架, 请使用 [embedAndSignAppleFrameworkForXcode](multiplatform-direct-integration.md#connect-the-framework-to-your-project) task.

### 只构建必须的编译目标 {id="build-only-for-necessary-targets"}

和上面的建议类似, 不要一次性对所有的原生平台构建二进制文件.
例如, 编译 [XCFramework](multiplatform-build-native-binaries.md#build-xcframeworks)
(使用 `*XCFramework` task) 会对所有的编译目标构建相同的代码, 可能会比针对单个编译目标的构建消耗更多的时间.

如果你的设置确实需要 XCFramework, 你可以减少编译目标的数量.
例如, 如果你不在 Intel 架构的 Mac 机器上的 iOS 模拟器内运行这个项目, 你就不需要 `iosX64`.

> 针对各种编译目标的二进制文件, 通过 `linkDebug*$Target` 和 `linkRelease*$Target` Gradle task 来构建.
> 要查看执行的 task, 可以检查构建日志中,
> 或使用 `--scan` 选项运行一个 Gradle 构建, 然后查看
> [Gradle 构建扫描(Build Scan)](https://docs.gradle.org/current/userguide/build_scans.html).
>
{style="tip"}

### 不要构建不必要的发布版二进制文件 {id="don-t-build-unnecessary-release-binaries"}

Kotlin/Native 支持 2 种构建模式, [调试版(Debug)和发布版(Release)](multiplatform-build-native-binaries.md#declare-binaries).
发布版经过高度优化, 这会需要大量时间: 发布版二进制文件的编译需要的时间, 比调试版多一个数量级.

除了真正的发布之外, 在通常的开发过程中, 所有这些优化可能都是不必要的.
如果你在开发过程中使用了名称中带有 `Release` 的 task, 请考虑将它替换为 `Debug`.
例如, 你可以运行 `assembleSharedDebugXCFramework`, 而不是运行 `assembleXCFramework`.

> 发布版二进制文件通过 `linkRelease*` Gradle task 构建.
> 你可以在构建日志中查看这些 task,
> 或使用 `--scan` 选项运行一个 Gradle 构建, 然后查看
> [Gradle 构建扫描(Build Scan)](https://docs.gradle.org/current/userguide/build_scans.html).
>
{style="tip"}

### 不要禁用 Gradle daemon {id="don-t-disable-gradle-daemon"}

如果没有重要的原因, 请不要禁用 [Gradle daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html).
默认情况下 [Kotlin/Native 从 Gradle daemon 启动](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native).
Gradle daemon 启用时, 会使用相同的 JVM 进程, 因此不必为每次编译重新最准备.

### 不要使用传递导出(Transitive Export) {id="don-t-use-transitive-export"}

使用 [`transitiveExport = true`](multiplatform-build-native-binaries.md#export-dependencies-to-binaries)
很多情况下会导致死代码剔除(Dead Code Elimination)功能被关闭, 因此编译器必须处理很多未使用的代码.
这样会增加编译时间.
相反, 要明确使用 `export` 方法, 来导出需要的项目和依赖项.

### 不要导出太多模块 {id="don-t-export-modules-too-much"}

尽量避免不必要的 [模块导出](multiplatform-build-native-binaries.md#export-dependencies-to-binaries).
每个导出的模块都会对编译时间和二进制文件大小产生不好的影响.

### 使用 Gradle 的构建缓存(Build Caching) {id="use-gradle-build-caching"}

启用 Gradle 的 [构建缓存](https://docs.gradle.org/current/userguide/build_cache.html) 功能:

* **本地构建缓存**.
  对本地缓存, 请向你的 `gradle.properties` 文件添加 `org.gradle.caching=true` 设置,
  或在命令行运行构建时使用 `--build-cache` 选项.
* **远程构建缓存**
  详情请参见如何为持续集成环境 [配置远程构建缓存](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_configure_remote).

### 使用 Gradle 的配置缓存 {id="use-gradle-configuration-cache"}

要使用 Gradle 的 [配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html),
请向你的 `gradle.properties` 文件添加 `org.gradle.configuration-cache=true`.

> 配置缓存也会启用 `link*` task 的并发运行, 可能造成机器负荷很高, 尤其是有很多 CPU 核的情况.
> 这个问题将在 [KT-70915](https://youtrack.jetbrains.com/issue/KT-70915) 中解决.
>
{style="note"}

### 启用以前禁用的功能 {id="enable-previously-disabled-features"}

有些 Kotlin/Native 属性会禁用 Gradle daemon 和编译器缓存:

* `kotlin.native.disableCompilerDaemon=true`
* `kotlin.native.cacheKind=none`
* `kotlin.native.cacheKind.$target=none`,
  其中 `$target` 是一个 Kotlin/Native 编译目标, 例如 `iosSimulatorArm64`.

如果你过去曾遇到与这些功能相关的问题, 并向你的 `gradle.properties` 文件或 Gradle 命令行添加过这些参数,
请删除这些参数, 再次检查构建是否成功.
有可能以前添加过这些属性来绕过某些问题, 但这些问题现在已经解决了.

### 尝试使用klib artifact 的增量编译功能 {id="try-incremental-compilation-of-klib-artifacts"}

使用增量编译时, 如果项目模块产生的 `klib` artifact 只发生了部分变更,
那么只有 `klib` 的一部分会被重新编译为二进制文件.

这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
要启用这个功能, 请向你的 `gradle.properties` 文件添加 `kotlin.incremental.native=true` 选项.
如果你遇到问题, 请 [在 YouTrack 中创建 issue](https://kotl.in/issue).

## Windows 配置 {id="windows-configuration"}

Windows Security 可能会让 Kotlin/Native 编译器变慢.
为了避免这样的情况, 你可以将 `.konan` 目录添加到 Windows Security 的排除项目, 这个目录默认在 `%\USERPROFILE%` 下.
详情请参见 [添加 Windows Security 的排除项目](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26).
