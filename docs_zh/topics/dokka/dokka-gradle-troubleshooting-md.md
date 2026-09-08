[//]: # (title: Dokka Gradle 的问题与解决方案)

本章介绍在 Gradle 构建中使用 Dokka 生成文档时可能遇到的常见问题.

如果你遇到的问题未在本章列出, 请在我们的 [问题跟踪系统](https://kotl.in/dokka-issues) 中提交反馈意见, 或报告问题,
或在官方 [Kotlin Slack](https://kotlinlang.slack.com/) 中与 Dokka 开发社区交流.
请点击 [这里](https://kotl.in/slack) 获取 Slack 邀请.

## 内存问题 {id="memory-issues"}

对于大型项目, Dokka 在生成文档时可能会消耗大量内存.
这可能会超过 Gradle 的内存限制, 尤其是在处理大量数据时.

当 Dokka 生成文档时内存耗尽, 构建将会失败,
Gradle 可能会抛出 `java.lang.OutOfMemoryError: Metaspace` 这样的异常.

目前正在积极改进 Dokka 的性能, 但部分限制来自于 Gradle 本身.

如果你遇到内存问题, 请尝试以下变通方法:

* [增加堆空间](#increase-heap-space)
* [在 Gradle 进程内运行 Dokka](#run-dokka-within-the-gradle-process)

### 增加堆空间 {id="increase-heap-space"}

解决内存问题的一种方法是增加 Dokka 生成器进程的 Java 堆内存量.
在 `build.gradle.kts` 文件中, 调整以下配置选项:

```kotlin
    dokka {
        // Dokka 生成一个由 Gradle 管理的新进程
        dokkaGeneratorIsolation = ProcessIsolation {
            // 配置堆大小
            maxHeapSize = "4g"
        }
    }
```

在这个示例中, 最大堆大小被设置为 4 GB (`"4g"`).
请调整并测试这个值, 找到适合你的构建的最优设置.

如果你发现 Dokka 需要相当大的堆空间, 例如明显高于 Gradle 本身的内存使用量,
请 [在 Dokka 的 GitHub 仓库中创建一个 issue](https://kotl.in/dokka-issues).

> 你需要对每个子项目应用这个配置.
> 推荐在应用于所有子项目的约定插件(convention plugin)中配置 Dokka.
>
{style="note"}

### 在 Gradle 进程内运行 Dokka {id="run-dokka-within-the-gradle-process"}

当 Gradle 构建和 Dokka 生成文档都需要大量内存时, 它们可能会作为独立的进程运行,
在单台机器上消耗大量内存.

为了优化内存使用, 你可以在 Gradle 的同一个进程内运行 Dokka, 而不是作为独立的进程运行.
这样, 只需要为 Gradle 配置一次内存, 而不用为每个进程分别分配内存.

要在 Gradle 的同一个进程内运行 Dokka, 请在 `build.gradle.kts` 文件中调整以下配置选项:

```kotlin
    dokka {
        // 在当前 Gradle 进程中运行 Dokka
        dokkaGeneratorIsolation = ClassLoaderIsolation()
    }
```

与 [增加堆空间](#increase-heap-space) 一样, 请测试这个配置, 确认它是否适用于你的项目.

关于配置 Gradle JVM 内存的更多详情,
请参见 [Gradle 文档](https://docs.gradle.org/current/userguide/config_gradle.html#sec:configuring_jvm_memory).

> 修改 Gradle 的 Java 选项会启动一个新的 Gradle daemon, 它可能会长时间保持运行.
> 你可以 [手动停止其他 Gradle 进程](https://docs.gradle.org/current/userguide/gradle_daemon.html#sec:stopping_an_existing_daemon).
>
> 此外, 使用 `ClassLoaderIsolation()` 配置时, Gradle 的已知问题可能会 [导致内存泄漏](https://github.com/gradle/gradle/issues/18313).
>
{style="note"}
