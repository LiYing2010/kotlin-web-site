---
type: doc
layout: reference
category:
title: "改进 Kotlin/Native 编译速度"
---

# 改进 Kotlin/Native 编译速度

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin/Native 编译器正在不断更新, 并改进它的性能.
使用最新的 Kotlin/Native 编译器, 以及正确配置的构建环境, 对于使用 Kotlin/Native 编译目标的项目, 你可以显著的改进编译速度.

关于如何提高 Kotlin/Native 编译过程速度, 请阅读我们的建议.

## 一般性建议

* **使用最新版本的 Kotlin**. 这样你可以得到最新的性能改进.
* **不要创建巨大的类**. 这样的类会需要很长时间来编译, 执行期的装载时间也很长.
* **在多次构建之间, 保留下载的和缓存的组件**. 编译项目时, Kotlin/Native 会下载需要的组件,
  并将它的一些工作结果缓存到 `$USER_HOME/.konan` 目录.
  编译器会在后续的编译中使用这个目录, 使编译工作更快完成.

  在容器(比如 Docker)内或者使用持续集成系统(Continuous Integration)构建时, 编译器可能在每次构建时都需要重新创建 `~/.konan` 目录.
  为了避免这样的步骤, 请配置你的环境, 使其在多次构建之间保留 `~/.konan`.
  比如, 使用 Gradle 属性 `kotlin.data.dir` 来重新定义它的位置.

  或者, 也可以使用 `-Xkonan-data-dir` 编译器选项, 通过 `cinterop` 和  `konanc` 工具来配置你的的自定义目录路径.

## Gradle 配置

使用 Gradle 的第 1 次编译通常会比之后的构建耗费更多时间, 因为需要下载依赖项目, 构建缓存, 并执行一些额外步骤.
你应该构建你的项目至少 2 次, 才能得到准确的编译时间.

下面是如何配置 Gradle 改善编译性能的一些建议:

* **增大 [Gradle heap 尺寸](https://docs.gradle.org/current/userguide/performance.html#adjust_the_daemons_heap_size)**.
  向 `gradle.properties` 添加 `org.gradle.jvmargs=-Xmx3g` 设置.
  如果你使用 [并行构建](https://docs.gradle.org/current/userguide/performance.html#parallel_execution) 功能,
  你可能需要使用 `org.gradle.workers.max` 属性或 `--max-workers` 命令行选项, 来选择正确的 worker 数量.
  默认值是 CPU 的处理器个数.

* **只构建你需要的二进制文件**. 除非你真的需要这样, 否则不要运行构建整个项目的 Gradle 任务, 比如 `build` 或 `assemble`.
  这样的任务会多次构建相同的代码, 增加编译时间.
  典型情况下, 比如在 IntelliJ IDEA 中运行测试, 或从 Xcode 启动应用程序, Kotlin 工具会避免执行不必要的 Gradle 任务. 
  
  如果你遇到比较特殊的场景, 或使用了特殊的构建配置, 你可能需要自行选择 Gradle 任务.
    * `linkDebug*`: 为了在开发期间运行你的代码, 你通常只需要一个二进制文件, 因此只运行对应的 `linkDebug*` 任务通常就够了.
      请记住, 编译一个证实发布版的二进制文件 (`linkRelease*`) 会比编译一个调试版本耗费更多时间.
    * `packForXcode`: 由于 iOS 各种模拟器和各种真实设备使用不同的处理器架构, 因此通常会将 Kotlin/Native 二进制文件以 universal (fat) 框架的形式发布.
      在本地开发时, 只为你正在使用的平台构建 `.framework` 会比较快.
      
      要构建一个平台专用的框架, 请调用 [Kotlin Multiplatform 项目向导](https://kmp.jetbrains.com/)
      创建的 `packForXcode` 任务. 
      
      > 请记住, 这种情况下, 在设备和模拟器之间切换之后, 你将会需要使用 `./gradlew clean` 清除构建.
      > 详情请参见 [这个问题](https://youtrack.jetbrains.com/issue/KT-40907).
      {:.note}


* **不要禁用 [Gradle daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html)**, 如果没有重要的原因, 请不要这样做.
  默认情况下 [Kotlin/Native 从 Gradle daemon 启动](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native).
  Gradle daemon 启用时, 会使用相同的 JVM 进程, 因此不必为每次编译重新最准备.

* **不要使用 [transitiveExport = true](../multiplatform/multiplatform-build-native-binaries.html#export-dependencies-to-binaries)**.
  使用传递导出(Transitive Export)很多情况下会导致死代码剔除(Dead Code Elimination)功能被关闭: 编译器必须处理很多未使用的代码.
  这样会增加编译时间.
  要明确使用 `export`, 来导出需要的项目和依赖项.

* **使用 Gradle 的 [构建缓存](https://docs.gradle.org/current/userguide/build_cache.html)**:
    * **本地构建缓存**: 向你的 `gradle.properties` 文件添加设置 `org.gradle.caching=true`, 或者在命令行运行时添加 `--build-cache` 参数.
    * **远程构建缓存** 用于持续集成环境. 详情请参见 [配置远程构建缓存](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_configure_remote).

* **启用以前禁用的 Kotlin/Native 功能**. 有些属性会禁用 Gradle daemon 和编译器缓存 –
  `kotlin.native.disableCompilerDaemon=true` 和 `kotlin.native.cacheKind=none`.
  如果你过去曾遇到与这些功能相关的问题, 并向你的 `gradle.properties` 文件或 Gradle 命令行添加过这些参数,
  请删除这些参数, 再次检查构建是否成功.
  有可能以前添加过这些属性来绕过某些问题, 但这些问题现在已经解决了.

* **尝试使用 klib artifact 的增量编译功能**. 使用增量编译时, 如果项目模块产生的 `klib` artifact 只发生了部分变更,
  那么只有 `klib` 的一部分会被重新编译为二进制文件.

  这个功能是 [实验性功能](../components-stability.html#stability-levels-explained).
  要启用这个功能, 请向你的 `gradle.properties` 文件添加 `kotlin.incremental.native=true` 选项.
  如果你遇到问题, 请 [在 YouTrack 中创建 issue](https://kotl.in/issue).

## Windows OS 配置

* **配置 Windows Security**. Windows Security 可能会让 Kotlin/Native 编译器变慢.
  为了避免这样的情况, 你可以将 `.konan` 目录添加到 Windows Security 的排除项目, 这个目录默认在 `%\USERPROFILE%` 下.
  详情请参见 [添加 Windows Security 的排除项目](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26).
