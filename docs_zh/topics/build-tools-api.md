[//]: # (title: 构建工具 API)

<primary-label ref="experimental-general"/>

<tldr>目前, BTA 只支持 Kotlin/JVM.</tldr>

Kotlin 2.2.0 引入了实验性功能, 构建工具 API(Build Tools API, BTA), 它简化了构建系统与 Kotlin 编译器的集成.

之前, 向一个构建系统添加完整的 Kotlin 支持 (例如增量编译, Kotlin 编译器 plugin, daemon, 以及 Kotlin Multiplatform) 需要付出极大的努力.
BTA 的目标是, 通过在构建系统和 Kotlin 编译器生态系统之间通过提供统一的 API, 降低这种复杂性.

BTA 构建系统定义了可以实现的单一入口点. 因此不再需要与内部的编译器细节进行深度的集成.

> BTA 本身还未公开发布, 还不能在你自己的构建工具集成中直接使用.
> 如果你对这个提案有兴趣, 或者希望分享你的反馈意见, 请参见 [KEEP](https://github.com/Kotlin/KEEP/issues/421).
> 请在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76255) 中关注它的实现进展.
> 
{style="warning"}

## 与 Gradle 集成 {id="integration-with-gradle"}

Kotlin Gradle plugin (KGP) 实验性的支持 BTA, 你需要表示使用者同意(Opt-in) 才能使用它.

> 关于使用 KGP 的体验, 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56574)
> 提供你的反馈意见.
> 
{style="note"}

### 如何启用 {id="how-to-enable"}

向你的 `gradle.properties` 文件添加以下属性 :

```properties
kotlin.compiler.runViaBuildToolsApi=true
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
    kotlin("jvm") version "2.2.0"
}

group = "org.jetbrains.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

kotlin {
    jvmToolchain(8)
    @OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class)
    compilerVersion.set("2.1.21") // <-- 与 2.2.0 不同的版本
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

KGP 支持 3 种 [编译器执行策略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy).
通常, "in-process" 策略 (这种策略在 Gradle daemon 中运行编译器) 不支持增量编译.

使用 BTA, "in-process" 策略现在可以支持增量编译.
要启用它, 请向你的 `gradle.properties` 文件添加以下属性:

```properties
kotlin.compiler.execution.strategy=in-process
```

## 与 Maven 集成 {id="integration-with-maven"}

从 Kotlin 2.2.0 开始, BTA 在 [`kotlin-maven-plugin`](maven.md) 中默认启用.

尽管 BTA 现在还不能为 Maven 使用者带来直接的益处, 但它为开发以下功能特性提供了一个坚实的基础:

* [Kotlin daemon 支持](https://youtrack.jetbrains.com/issue/KT-77587)
* [增量编译稳定化](https://youtrack.jetbrains.com/issue/KT-77086)
