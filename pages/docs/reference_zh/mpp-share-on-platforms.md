---
type: doc
layout: reference
title: "在不同的平台之间共用代码"
---

# 在不同的平台之间共用代码

通过 Kotlin Multiplatform, 你可以使用 Kotlin 提供的以下机制共用代码:

*   [在你的项目中使用的所有平台上共用代码](#share-code-on-all-platforms).
通过这种方式, 可以共用那些适用于所有平台的共通业务逻辑.
*   [在你的项目中使用的一部分(但不是所有)平台上共用代码](#share-code-on-similar-platforms).
可以通过一种阶层结构, 在相似的平台上共用很大部分代码.
你可以对编译目标的共通组合使用 [编译目标的简写](#use-target-shortcuts),
或者 [手动创建层级结构](#configure-the-hierarchical-structure-manually).

如果需要在共用代码中访问平台相关的 API, 可以使用 Kotlin 的 [预期声明与实际声明(expected and actual declaration)](mpp-connect-to-apis.html) 机制.

## 在所有平台上共用代码

如果你的业务逻辑对所有的平台都是共通的, 那么没有必要对每个平台编写相同的代码 –
只需要在共通源代码集中共用这些代码就可以了.

![所有平台上共用的代码]({{ url_for('asset', path='images/reference/mpp/flat-structure.png') }})

平台相关的源代码集默认会依赖于共通源代码集.
对默认源代码集, 比如 `jvmMain`, `macosX64Main` 等等, 不需要手动指定任何 `dependsOn` 关系.

如果在共用的代码中需要访问平台相关的 API, 可以使用 Kotlin 的 [预期声明与实际声明(expected and actual declaration)](mpp-connect-to-apis.html) 机制.

## 在类似的平台上共用代码

开发过程中经常会需要创建几种原生编译目标, 它们之间可能共用很多共通逻辑和第三方 API.

比如, 在一个包含 iOS 编译目标的典型的跨平台项目中, 有两种 iOS 相关的编译目标: 一个是 iOS ARM64 设备, 另一个是 x64 模拟器.
它们的平台相关源代码集是分开的, 但实际上真实设备和模拟器很少需要不同的代码, 而且它们的依赖项也基本相同.
因此对这些编译目标, iOS 相关的代码可以共用.

很明显, 在这种设置中, 对两个 iOS 编译目标我们需要一个共用的源代码集,
其中包含的 Kotlin/Native 代码, 仍然可以直接调用那些对 iOS 设备和模拟器共通的 API.

这种情况下, 可以使用层级结构, 在你的项目中的多个原生编译目标之间共用代码.

要启用层级结构功能, 请在 `gradle.properties` 文件中添加以下设置.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
kotlin.mpp.enableGranularSourceSetsMetadata=true
```

</div>

有两种方法来创建层级结构:

* [使用编译目标的简写](#use-target-shortcuts): 对原生编译目标的共通组合, 可以方便的创建层级结构.
* [手动配置层级结构](#configure-the-hierarchical-structure-manually).

更多详情请参见 [在多个库之间共用代码](#share-code-in-libraries) 以及 [在层级结构中使用原生库](#use-native-libraries-in-the-hierarchical-structure).

### 使用编译目标的简写

假设一个典型的跨平台项目包含两个 iOS 相关的编译目标 – `iosArm64` 和 `iosX64`,
层级结构包括一个中间源代码集 (`iosMain`), 平台相关的源代码集会使用它.

<img class="img-responsive" src="{{ url_for('asset', path='images/reference/mpp/iosmain-hierarchy.png') }}" alt="对 iOS 编译目标共用代码" width="400"/>

`kotlin-multiplatform` plugin 提供了编译目标的简写, 来对编译目标的共通组合创建层级结构.

| 编译目标简写 | 编译目标 |
|-----------------| -------- |
| `ios` | `iosArm64`, `iosX64` |
| `watchos` | `watchosArm32`, `watchosArm64`, `watchosX86` |
| `tvos` | `tvosArm64`, `tvosX64` |

所有的简写都会在代码中创建类似的层级结构. 比如, `ios` 简写创建下面的层级结构:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin {
    sourceSets{
        iosMain {
            dependsOn(commonMain)
            iosX64Main.dependsOn(it)
            iosArm64Main.dependsOn(it)
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets{
        val commonMain by sourceSets.getting
        val iosX64Main by sourceSets.getting
        val iosArm64Main by sourceSets.getting
        val iosMain by sourceSets.creating {
            dependsOn(commonMain)
            iosX64Main.dependsOn(this)
            iosArm64Main.dependsOn(this)
        }
    }
}
```

</div>
</div>

### 手动配置层级结构

要手动创建层级结构, 需要引入一个中间源代码集, 包含针对多个编译目标的共用代码,
然后创建一个源代码集层级结构, 包含这个中间源代码集.

![层级结构]({{ url_for('asset', path='images/reference/mpp/hierarchical-structure.png') }})

比如, 如果你想要创建共用代码, 用于原生 Linux, Windows, 和 macOS 编译目标 – `linuxX64M`, `mingwX64`, 和 `macosX64`:

1. 添加中间源代码集 `desktopMain`, 其中包含用于这些编译目标的共用逻辑.
2. 使用 `dependsOn` 关系, 指定源代码集的层级结构.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin {
    sourceSets {
        desktopMain {
            dependsOn(commonMain)
        }
        linuxX64Main {
            dependsOn(desktopMain)
        }
        mingwX64Main {
            dependsOn(desktopMain)
        }
        macosX64Main {
            dependsOn(desktopMain)
        }
    }
}

```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin{
    sourceSets {
        val desktopMain by creating {
            dependsOn(commonMain)
        }
        val linuxX64Main by getting {
            dependsOn(desktopMain)
        }
        val mingwX64Main by getting {
            dependsOn(desktopMain)
        }
        val macosX64Main by getting {
            dependsOn(desktopMain)
        }
    }
}
```

</div>
</div>

对以下编译目标组合, 可以共用源代码集:

* JVM + JS + Native
* JVM + Native
* JS + Native
* JVM + JS
* Native

对以下编译目标组合, 目前我们不支持共用源代码集:

* 多个 JVM 编译目标
* JVM + Android 编译目标
* 多个 JS 编译目标

如果你需要在共用的原生源代码集中访问平台相关的 API, IntelliJ IDEA 可以帮助你查找在共用的原生代码中可以使用的共通声明.
其他情况下, 请使用 Kotlin 的 [预期声明与实际声明](mpp-connect-to-apis.html) 机制.

### 在多个库之间共用代码

感谢项目层级结构的帮助, 多个库也可以对一组编译目标提供共通的 API.
当 [库发布](mpp-publish-lib.html) 时, 它的中间源代码集的 API 会与项目结构信息一起嵌入到库的 artifact 中.
当你使用这个库时, 你的项目的中间源代码集只能访问各个源代码集的编译目标所能得到的库的 API.

比如, `kotlinx.coroutines` 代码仓库的源代码集层级结构如下:

![Library 层级结构]({{ url_for('asset', path='images/reference/mpp/lib-hierarchical-structure.png') }})

`concurrent` 源代码集 声明了函数 runBlocking, 然后针对 JVM 和原生编译目标进行编译.
当 `kotlinx.coroutines` 库更新并携带项目的层级结构信息一起发布之后,
你可以依赖到这个库, 并在 JVM 和原生编译目标之间共用的源代码集中调用 `runBlocking`,
因为它与库的 `concurrent` 源代码集“编译目标签名”相符.

### 在层级结构中使用原生库

在多个原生编译目标之间共用的源代码集中, 可以使用平台相关的库, 比如 Foundation, UIKit, 以及 POSIX.
这个功能可以帮助你共用更多的原生代码, 不会受到平台相关的依赖项的限制.

不需要额外的步骤 – 一切都是自动完成的. IntelliJ IDEA 会帮助你查找在共用的代码中可以使用的共通声明.

但是, 要注意以下限制:

* 这种方式只适用于在平台相关的源代码集之间共用的原生源代码集. 不能用于在源代码集层级的更高层次中共用的原生源代码集.
    比如, 如果你有 `nativeDarwinMain`, 它是 `watchosMain` 和 `iosMain` 的父,
    而 `iosMain` 有两个子 – `iosArm64Main` 和 `iosX64Main`,
    那么你只能对 `iosMain` 使用平台相关的库, 而不能对 `nativeDarwinMain` 使用.
* 这种方式只适用于随同 Kotlin/Native 一起发布的 interop 库 .

要允许在共用源代码集中使用平台相关的库, 请在 `gradle.properties` 文件中添加以下设置:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
```

</div>

更多详情请参见 [技术细节](https://github.com/JetBrains/kotlin/blob/1.4.0/native/commonizer/README.md).
