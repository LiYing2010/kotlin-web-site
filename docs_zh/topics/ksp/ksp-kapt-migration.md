[//]: # (title: 从 kapt 迁移到 KSP)
[//]: # (description: 了解如何将 Kotlin 项目中的注解处理器从 kapt 迁移到 KSP.)

在这篇指南中, 你将学习如何将注解处理器从 [kapt](kapt.md) 迁移到 [KSP](ksp-overview.md),
以便充分利用 Kotlin 的功能特性, 并改善构建性能.

[kapt](kapt.md) (Kotlin Annotation Processing Tool) 是一个有用的工具, 可以在 Kotlin 中使用 Java 注解处理器.
它的工作方式是将 Kotlin 源代码翻译为 Java "桩(stub)" 文件, 然后在这些桩文件上运行注解处理器.
但是, 这个过程代价高昂, 会显著增加构建时间, 并且在翻译过程中会丢失一些 Kotlin 特有的功能特性.

相比之下, [KSP](ksp-overview.md) (Kotlin Symbol Processing) 是 kapt 的替代方案, 专为 Kotlin 而设计.
KSP 了解所有的 Kotlin 功能特性, 并直接分析源代码, 从而缩短构建时间.

在开始之前, 请检查你的项目中的注解处理器是否支持 KSP.
请查看 [支持的库](ksp-overview.md#supported-libraries) 列表, 或查阅注解处理器的文档.

> KSP 和 kapt 可以共通运行, 因此你可以分阶段迁移你的项目, 每次迁移一个库或模块.
>
{style="note"}

## 向你的项目添加 KSP plugin {id="add-the-ksp-plugin-to-your-project"}

在项目级的 `build.gradle(.kts)` 文件的 `plugins {}` 代码块中, 添加 KSP:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.google.devtools.ksp") version "%kspVersion%" apply false
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'com.google.devtools.ksp' version '%kspVersion%' apply false
}
```

</tab>
</tabs>

> 要查找 KSP 的最新版本, 请查看 GitHub [Releases](https://github.com/google/ksp/releases).
>
{style="tip"}

## 更新处理器 {id="update-your-processor"}

找到使用你想要迁移的处理器的模块. 在这个模块的 `build.gradle(.kts)` 文件中进行以下修改:

1. 在 `plugins {}` 代码块中, 添加 KSP:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    plugins {
        id("com.google.devtools.ksp")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    plugins {
        id 'com.google.devtools.ksp'
    }
    ```

    </tab>
    </tabs>

2. 在 `dependencies {}` 代码块中, 将 `kapt` 替换为 `ksp`:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("com.google.dagger:dagger:2.48")
        // kapt("com.google.dagger:dagger-compiler:2.48")

        // KSP 处理器依赖项:
        ksp("com.google.dagger:dagger-compiler:2.48")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    dependencies {
        implementation 'com.google.dagger:dagger:2.48'
        // kapt 'com.google.dagger:dagger-compiler:2.48'

        // KSP 处理器依赖项:
        ksp 'com.google.dagger:dagger-compiler:2.48'
    }
    ```

    </tab>
    </tabs>

> 对于大多数库, 这种替换就足够了.
> 请查阅每个库的文档, 确认是否需要进行其他修改.
>
{style="note"}

## 删除 kapt plugin {id="remove-the-kapt-plugin"}

将所有的处理器迁移到 KSP 之后, 可以安全地从所有的构建文件中移除 kapt plugin:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    // 删除这一行:
    id("org.jetbrains.kotlin.kapt")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    // 删除这一行:
    id 'org.jetbrains.kotlin.kapt'
}
```

</tab>
</tabs>

如果还有残留的 kapt 配置, 也一起删除.

## 下一步做什么? {id="whats-next"}

* 阅读 [KSP 入门](ksp-quickstart.md#create-your-own-processor), 学习如何创建你自己的基于 KSP 的注解处理器.
* 浏览 [KSP 代码仓库](https://github.com/google/ksp/tree/main/examples), 查看使用 KSP 的示例项目.
* 阅读 [概述](ksp-overview.md), 进一步了解 KSP.
