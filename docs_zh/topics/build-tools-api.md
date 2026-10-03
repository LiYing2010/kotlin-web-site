[//]: # (title: 构建工具 API)

<primary-label ref="beta"/>

<tldr> BTA 支持 Kotlin/JVM, Kotlin/JS, 以及 Kotlin/Wasm.<p/>  目前不支持 Kotlin/Native.</tldr>

Kotlin 包含构建工具 API(Build Tools API, BTA) 功能, 它简化了构建系统与 Kotlin 编译器的集成.

向一个构建系统添加完整的 Kotlin 支持 (例如增量编译, Kotlin 编译器 plugin, daemon, 以及 Kotlin Multiplatform) 需要付出极大的努力.
BTA 的目标是, 通过在构建系统和 Kotlin 编译器生态系统之间通过提供统一的 API, 降低这种复杂性.

BTA 构建系统定义了可以实现的单一入口点. 因此不再需要与内部的编译器细节进行深度的集成.

这个功能的稳定级别根据目标平台不同: BTA 在 Kotlin/JVM 是 Beta, 在 Kotlin/JS 和 Kotlin/Wasm 是 Alpha.
详情请参见 [](components-stability.md#build-tools-api-bta).
要使用 BTA, 需要通过 `@OptIn(ExperimentalBuildToolsApi::class)` 表示使用者同意(Opt-in).

> 如果你对这个提案有兴趣, 或者希望分享你的反馈意见, 请参见 [KEEP](https://github.com/Kotlin/KEEP/blob/build-tools-api/proposals/extensions/build-tools-api.md).
> 请在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76255) 中关注它的实现进展.
> 
{style="note"}

## 与 Gradle 集成 {id="integration-with-gradle"}

Kotlin Gradle plugin (KGP) 对 Kotlin/JVM 编译默认使用 BTA.

> 关于使用 KGP 的体验, 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56574)
> 提供你的反馈意见.
> 
{style="note"}

### 对 Kotlin/JS, Kotlin/Wasm 和 Kotlin Metadata 启用 BTA {id="enable-the-bta-for-kotlin-js-kotlin-wasm-and-kotlin-metadata"}

<primary-label ref="alpha"/>

从 Kotlin 2.4.20 开始, KGP 也能够通过 BTA 执行 Kotlin/JS, Kotlin/Wasm 和 Kotlin Metadata 的编译.
这使得 KGP 与编译器的交互更加一致, 而且在某些情况下, 编译变得更快, 而且更加稳定.

在 Kotlin 2.4.20 中, 可以通过使用者同意(Opt-in)来使用这些编译目标.
要试用这些功能, 请向你的 `gradle.properties` 文件添加对应的属性:

```properties
kotlin.js.runViaBuildToolsApi = true
kotlin.wasm.runViaBuildToolsApi = true
kotlin.metadata.runViaBuildToolsApi = true
```

### 配置不同的编译器版本 {id="configure-different-compiler-versions"}

使用 BTA, 你现在可以使用与 KGP 使用的版本不同的 Kotlin 编译器版本.
这对以下情况是很有用的:

* 你想要试用新的 Kotlin 功能, 但还没有更新你的构建脚本.
* 你需要最新的 plugin 修正, 但暂时还向继续使用旧的编译器版本.

下面是一个示例, 演示如何在你的 `build.gradle.kts` 文件中进行这种配置:

```kotlin
import org.jetbrains.kotlin.buildtools.api.ExperimentalBuildToolsApi
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins {
    kotlin("jvm") version "2.4.20"
}

group = "org.jetbrains.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

kotlin {
    jvmToolchain(8)
    @OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class)
    compilerVersion.set("2.3.21") // <-- 与 2.4.20 不同的版本
}
```

#### 兼容的 Kotlin 编译器版本和 KGP 版本 {id="compatible-kotlin-compiler-and-kgp-versions"}

BTA 支持:

* 之前的 3 个 Kotlin 编译器主版本.
* 未来的 1 个主版本.

例如, 在 KGP 2.2.0 中, 支持的 Kotlin 编译器版本是:

* 1.9.25
* 2.0.x
* 2.1.x
* 2.2.x
* 2.3.x

#### 限制 {id="limitations"}

使用不同的编译器版本和编译器 plugin, 可能导致 Kotlin 编译器异常.
Kotlin 开发组计划在未来的 Kotlin 发布版中解决这个问题.

### 使用 "in process" 策略启用增量编译 {id="enable-incremental-compilation-with-in-process-strategy"}

KGP 支持 3 种 [编译器执行策略](compiler-execution-strategy.md).
通常, "in-process" 策略 (这种策略在 Gradle daemon 中运行编译器) 不支持增量编译.

使用 BTA, "in-process" 策略现在可以支持增量编译.
要启用它, 请向你的 `gradle.properties` 文件添加以下属性:

```properties
kotlin.compiler.execution.strategy=in-process
```

## 与 Maven 集成 {id="integration-with-maven"}

BTA 会启用 [`kotlin-maven-plugin`](maven.md), 以支持 [Kotlin Daemon](kotlin-daemon.md),
它是默认的 [编译器执行策略](maven-kotlin-compiler.md#choose-execution-strategy).
`kotlin-maven-plugin` 默认使用 BTA, 因此不需要任何配置.

有了 BTA 的帮助, 未来我们可以提供更多功能, 例如 [增量编译功能的稳定版](https://youtrack.jetbrains.com/issue/KT-77086).
