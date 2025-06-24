[//]: # (title: Gradle 最佳实践)

[Gradle](https://docs.gradle.org/current/userguide/userguide.html) 是一个构建系统, 很多 Kotlin 项目使用它来对构建过程进行自动化和管理.

充分利用 Gradle 是非常重要的, 能够帮助你减少管理构建和等待构建的时间, 将更多时间投入到代码编写中.
我们在这里提供一组最佳实践, 分为 2 个关键领域: **项目组织** 和 **项目优化**.

## 组织 {id="organize"}

本节重点介绍如何构造你的 Gradle 项目, 以提高清晰度, 可维护性, 以及可扩展性.

### 使用 Kotlin DSL {id="use-kotlin-dsl"}

要使用 Kotlin DSL, 而不是传统的 Groovy DSL. 这样可以不必学习另一种语言, 并且得到严格类型的优势.
严格类型使 IDE 能够对重构和自动代码补全提供更好的支持, 提高开发效率.

详情请参见 [Gradle 的 Kotlin DSL 入门](https://docs.gradle.org/current/userguide/kotlin_dsl.html).

请阅读 Gradle Blog: [Kotlin DSL 成为 Gradle 构建的默认选项](https://blog.gradle.org/kotlin-dsl-is-now-the-default-for-new-gradle-builds).

### 使用版本目录 {id="use-a-version-catalog"}

使用 `libs.versions.toml` 文件中的版本目录, 集中管理依赖项.
这样你就可以在整个项目中, 一致的定义和重用版本, 库, 以及 plugin.

```kotlin
[versions]
kotlinxCoroutines = "%coroutinesVersion%"

[libraries]
kotlinxCoroutines = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "kotlinxCoroutines" }
```

将以下依赖项添加到你的 `build.gradle.kts` 文件:

```kotlin
dependencies {
    implementation(libs.kotlinxCoroutines)
}
```

详情请参见 Gradle 文档: [依赖项管理基础知识](https://docs.gradle.org/current/userguide/dependency_management_basics.html#version_catalog).

### 使用约定 plugin {id="use-convention-plugins"}

<primary-label ref="advanced"/>

使用约定 plugin, 在多个构建文件中封装和重用共通的构建逻辑.
Moving a shared 配置 into a plugin helps simplify and modularize 你的 构建 脚本.

尽管初期设置可能会很耗时, 但完成之后, 维护和添加新的构建逻辑会很容易.

详情请参见 Gradle 文档: [约定 plugin](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins).

## 优化 {id="optimize"}

本节介绍增强 Gradle 构建的性能和效率的策略.

### 使用本地构建缓存 {id="use-local-build-cache"}

使用本地构建缓存, 重用其它构建产生的输出, 可以节约时间. 构建缓存可以从你之前创建的构建得到输出.

详情请参见 Gradle 文档 [构建缓存](https://docs.gradle.org/current/userguide/build_cache.html).

### 使用配置缓存 {id="use-configuration-cache"}

> 配置缓存目前还不支持所有的核心 Gradle plugin.
> 最新信息请参见 Gradle 文档:
> [支持的 plugin 列表](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:plugins:core).
>
{style="note"}

使用配置缓存, 可以缓存配置阶段的结果, 并在之后的构建中重用, 这样能够显著改善构建性能.
如果 Gradle 检测到构建配置或相关的依赖项没有变化, 它会跳过配置阶段.

详情请参见 Gradle 文档: [配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html).

### 对多编译目标改善构建时间 {id="improve-build-times-for-multiple-targets"}

如果你的跨平台项目包含多个编译目标, `build` 和 `assemble` 等等 task 可能会为每个编译目标,
对相同的代码进行多次编译, 导致编译时间变长.

如果你正在对某个特定平台积极的进行开发和测试, 请改为运行对应的 `linkDebug*` task.

详情请参见, [改善编译时间的技巧](native-improving-compilation-time.md#gradle-configuration).

### 从 kapt 迁移到 KSP {id="migrate-from-kapt-to-ksp"}

如果你在使用某个库, 依赖到 [kapt](kapt.md) 编译器 plugin, 请检查是否能够改为使用 [Kotlin 符号处理(Kotlin Symbol Processing, KSP) API](ksp-overview.md).
KSP API 能够减少注解处理的时间, 改善构建性能.
KSP 比 kapt 更快, 更高效, 因为它直接处理源代码, 而不需要生成中间的 Java stub.

关于具体的迁移步骤, 请参见 Google 的 [迁移指南](https://developer.android.com/build/migrate-to-ksp).

关于 KSP 与 kapt 的比较, 请阅读 [为什么使用 KSP](ksp-why-ksp.md).

### 使用模块化 {id="use-modularization"}

<primary-label ref="advanced"/>

> 模块化只有利于中型到大型项目. 对于基于微服务架构的项目没有益处.
>
{style="note"}

使用模块化项目结构能够增加构建速度, 简化并行开发.
将你的项目结构组织为一个根项目, 以及一个或多个子项目.
如果修改只影响一个子项目, Gradle 只会重构建这个子项目.

```none
.
└── root-project/
    ├── settings.gradle.kts
    ├── app subproject/
    │   └── build.gradle.kts
    └── lib subproject/
        └── build.gradle.kts
```

详情请参见 Gradle 文档: [使用 Gradle 组织项目结构](https://docs.gradle.org/current/userguide/multi_project_builds.html).

### 设置 CI/CD {id="set-up-ci-cd"}
<primary-label ref="advanced"/>

设置 CI/CD 过程, 通过使用增量构建和缓存依赖项, 可以显著减少构建时间.
添加持久存储, 或使用远程构建缓存, 就可以获得这些优势.
这个过程并不一定耗费时间, 因为某些供应商, 例如 [GitHub](https://github.com/features/actions), 几乎开箱即用的提供了这些服务.

阅读 Gradle 的社区手册: [将 Gradle 与持续集成系统(Continuous Integration system) 结合使用](https://cookbook.gradle.org/ci/).

### 使用远程构建缓存 {id="use-remote-build-cache"}
<primary-label ref="advanced"/>

与 [本地构建缓存](#use-local-build-cache) 一样, 远程构建缓存能够重用其它构建的输出, 帮助你节约时间.
它能够从之前任何人运行的任何构建得到 task 的输出, 而不仅仅是最后一次.

远程构建缓存使用缓存访问器, 在各个构建之间共用 task 输出.
例如, 在一个 CI/CD 访问器的开发环境中, 访问器上的所有构建都会生成远程缓存.
当你 check out main 分支来开发一个新的功能时, 你可以立即使用增量构建.

要注意, 如果网络连接缓慢, 可能导致缓存结果的传输比在本地运行 task 更慢.

详情请参见 Gradle 文档: [构建缓存](https://docs.gradle.org/current/userguide/build_cache.html).
