---
type: doc
layout: reference
title: "查看跨平台项目的结构"
---

# 查看跨平台项目的结构

本页面最终更新: 2022/02/28

你的跨平台项目主要包含以下部分:

* [Multiplatform plugin](#multiplatform-plugin)
* [编译目标](#targets)
* [源代码集](#source-sets)
* [编译任务](#compilations)

## Multiplatform plugin

[创建跨平台项目](mpp-create-lib.html) 时, 项目创建向导会自动在 `build.gradle`(`.kts`) 文件中使用 `kotlin-multiplatform` Gradle plugin.

也可以手动使用这个插件.

>`kotlin-multiplatform` plugin 需要 Gradle {{ site.data.releases.minGradleVersion }} 或以上版本.
{:.note}

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
plugins {
    kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}
```

</div>
</div>

`kotlin-multiplatform` plugin 对创建应用程序或库的项目进行配置, 使它能够在多个目标平台工作,
并做好在这些平台进行构建的准备工作.

在 `build.gradle`(`.kts`) 文件中, 它会在最顶级创建 `kotlin` 扩展,
其中包括对 [编译目标](#targets), [源代码集](#source-sets), 以及依赖项的配置.

## 编译目标

跨平台项目的开发目标是多个目标平台, 由不同的编译目标来表示这些平台.
一个编译目标是整个构建过程的一部分, 它负责针对一个特定的平台构建, 测试, 并打包应用程序, 目标平台包括 macOS, iOS, 或 Android.
完整的列表请参见 [支持的平台](mpp-supported-platforms.html).

创建一个跨平台项目时, 在 `build.gradle` (`build.gradle.kts`) 文件的 `kotlin` 代码段会添加编译目标.

```kotlin
kotlin {
    jvm()    
    js {
        browser {}
    }
 }
```

详情请参见 [手动设置编译目标](mpp-set-up-targets.html).

## 源代码集(Source Set)

项目包含 Kotlin 源代码集, 在 `src` 目录下, 源代码集是指一组 Kotlin 源代码文件, 以及它的资源, 依赖项, 以及语言设置.
一个源代码集可以用于对一个或多个目标平台的 Kotlin 编译.

每个源代码集目录包含 Kotlin 源代码文件 (`kotlin` 目录) 和 `resources`.
创建项目向导会对共通代码以及所有添加的编译目标的 `main` 和 `test` 编译创建默认源代码集.

<img src="{{ url_for('asset', path='/docs/images/mpp/source-sets.png' )}}" alt="源代码集" width="300"/>

>源代码集的名称是大小写相关的.
{:.note}

源代码集会添加到顶级 `kotlin` 代码段的 `sourceSets` 代码段.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting { /* ... */ }
        val commonTest by getting { /* ... */ }
        val jvmMain by getting { /* ... */ }
        val jvmTest by getting { /* ... */ }
        val jsMain by getting { /* ... */ }
        val jsTest by getting { /* ... */ }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain { /* ... */}
        commonTest { /* ... */}
        jvmMain { /* ... */}
        jvmTest { /* ... */ }
        jsMain { /* ... */}
        jsTest { /* ... */}    
    }
}
```

</div>
</div>

源代码集组成一个层级结构, 用来共用代码. 在一个被多个编译目标共用的源代码集中,
你可以使用所有这些编译目标都支持的平台相关语言特性和依赖项.

比如, `desktopMain` 源代码集的编译目标是 Linux (`linuxX64`), Windows (`mingwX64`), 和 macOS (`macosX64`) 平台,
在这个源代码集中, 可以使用所有的 Kotlin/Native 特性.

![层级结构]({{ url_for('asset', path='docs/images/mpp/hierarchical-structure.png') }})

详情请参见 [构建源代码集的层级结构](mpp-share-on-platforms.html#share-code-on-similar-platforms).

## 编译任务

每个编译目标可以包含一个或多个编译任务, 比如, 针对产品源代码的编译任务, 以及针对测试源代码的编译任务.

对于每个编译目标, 默认的编译任务包括:

*   对 JVM, JS, 和 Native 编译目标: `main` 和 `test` 编译任务.
*   对于 Android 编译目标: 对每个 [Android 构建变体(build variant)](https://developer.android.com/studio/build/build-variants) 的编译任务.

![编译任务]({{ url_for('asset', path='docs/images/mpp/compilations.png') }})

每个编译任务都有默认的源代码集, 包含源代码文件, 以及与这个编译任务相关的依赖项.

详情请参见 [配置编译任务](mpp-configure-compilations.html).
