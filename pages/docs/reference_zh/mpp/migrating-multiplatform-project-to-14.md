---
type: doc
layout: reference
title: "将跨平台项目迁移到 Kotlin 1.4.0"
---

# 将跨平台项目迁移到 Kotlin 1.4.0

本页面最终更新: 2022/02/28

在 Kotlin 1.4.0 中, 跨平台程序开发工具有了很多新功能特性和改进.
其中一些对既有的项目可以立即使用, 其他一些则需要额外的配置步骤.
本向导帮助你将跨平台项目迁移到 1.4.0 或更高版本, 以便可以使用它的所有新功能特性.

## 针对跨平台项目作者的指南

### 更新 Gradle

从 1.4.0 开始, Kotlin 跨平台项目需要 Gradle 6.0 或更高版本.
请确认你的项目使用了正确版本的 Gradle, 如果需要请升级.
关于与 Kotlin 无关的迁移指南, 详情请参见
[Gradle 文档](https://docs.gradle.org/current/userguide/upgrading_version_5.html).

### 简化构建配置

Gradle 模块元数据(module metadata) 提供了富发布(rich publishing)和依赖项解析的功能特性,
这些功能特性是 Kotlin 跨平台项目需要使用的.
在 Gradle 6.0 及以上版本, 模块元数据用于依赖项解析, 并在发布时默认包含.
因此, 只要更新到这些新版本, 你就可以从项目的 `settings.gradle` 文件中删除 `enableFeaturePreview("GRADLE_METADATA")`.

如果你使用带元数据发布的库, 那么只需要在共用的代码集中一次性指定对这些库的依赖项,
在 1.4.0 以前的版本, 则需要在共用代码集和平台专用代码集中, 指定对同一个库的不同变体的依赖项.

从 1.4.0 开始, 不再需要在各个代码集中手工声明对 `stdlib` 的依赖项 – 这个库的依赖项
[现在会默认添加](mpp-add-dependencies.html#dependency-on-the-标准-library).
自动添加的标准库的版本将与 Kotlin Gradle plugin 版本相同, 因为它们使用相同的版本号.

有了这些功能特性, 你可以让你的 Gradle 构建文件更加简洁, 更加易读:

```kotlin
//...
android()
ios()
js()

sourceSets {
    commonMain {
        dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}")
        }
    }
}
//...
```

不要使用 kotlinx 库带 `-common` 或 `-native` 后缀的 artifact 名称, 因为它们不再支持了.
应该改用库的根 artifact 名称, 上面示例程序中是 `kotlinx-coroutines-core`.

### 试用层级项目结构

通过 [新的层级项目结构功能](mpp-share-on-platforms.html#share-code-on-similar-platforms),
你可以在一个跨平台项目的多个编译目标间共用代码.
在多个原生编译目标之间共用的代码集中, 可以使用平台依赖的库, 比如 `Foundation`, `UIKit`, 以及 `posix`.
这个功能可以帮助你共用更多原生代码, 不受平台相关的依赖项的限制.

通过启用层级结构, 以及在共用代码集中使用平台依赖库的能力,
不再需要用各种变通方法来让 IDE 支持在多个原生编译目标之间共享代码集,
比如在 `iosArm64` 和 `iosX64` 之间:

```kotlin
kotlin {
    // 变通方法 1: 依赖 Xcode 环境变量来选择 iOS 目标平台
    val iOSTarget: (String, KotlinNativeTarget.() -> Unit) -> KotlinNativeTarget =
        if (System.getenv("SDK_NAME")?.startsWith("iphoneos") == true)
            ::iosArm64
        else
            ::iosX64

    iOSTarget("ios")
}
```

```bash
# 变通方法 2: 创建符号链接来对两个编译目标使用一个代码集
ln -s iosMain iosArm64Main && ln -s iosMain iosX64Main
```

现在不再需要这些变通方法, 对典型的多编译目标场景, 可以使用
[编译目标的简写(shortcut)](mpp-share-on-platforms.html#use-target-shortcuts)
来创建一个层级结构, 或者也可以手动声明, 并连接各个代码集.
比如, 可以使用 `ios()` 简写, 创建 2 个 iOS 编译目标, 以及 1 个共用代码集:

```kotlin
kotlin {
   ios() // iOS 设备和模拟器编译目标; iosMain 和 iosTest 代码集
}
```

要启用层级项目结构, 并在共用代码集中使用平台依赖的库, 请在你的 `gradle.properties` 文件中添加以下设定:

```kotlin
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
```

在将来的版本中, 对 Kotlin 跨平台项目将会默认启用层级项目结构, 因此我们强烈建议你现在就开始使用这个功能.

## 针对库作者的指南

### 从 Gradle Bintray plugin 迁移到 Maven Publish plugin

如果你使用 `gradle-bintray-plugin` 来发布库文件, 请将你的项目迁移到 `maven-publish` plugin.
请参见 [我们如何对 `kotlinx.serialization` 进行了这个迁移](https://github.com/Kotlin/kotlinx.serialization/commit/c5f1af6ad78a77fe5861588d9fb00b7d3a9bc3e5#diff-439aadfed1f3c340acdcc871c00258aeL5).
更多详情请参见 [发布跨平台的库](mpp-publish-lib.html).

如果由于某些原因, 你需要发布到 Bintray, 并需要使用 Gradle Bintray plugin,
请记住, 这个 plugin 不支持发布 Gradle 模块元数据(module metadata).
要解决这个问题, 请使用
[这个替代方法](https://github.com/bintray/gradle-bintray-plugin/issues/229#issuecomment-473123891).

### 遵循默认的库布局

kotlinx 库的布局已经改变, 现在遵循默认布局, 我们推荐使用这样的默认布局:
_root_ 或 _umbrella_ 库模块的名称现在没有后缀(比如, 是 `kotlinx-coroutines-core` 而不是 `kotlinx-coroutines-core-native`).
使用 [maven-publish Gradle plugin](https://docs.gradle.org/current/userguide/publishing_maven.html) 发布库, 默认会遵循这样的布局.
更多详情请参见 [发布跨平台的库](mpp-publish-lib.html).

### 迁移到层级项目结构

使用层级项目结构, 可以在类似的编译目标中重用代码, 而且可以发布和消费那些针对类似平台的粗粒度(granular) API 的库.
迁移到 Kotlin 1.4.0 或更高版本时, 我们推荐将你的库切换到层级项目结构:

* 默认情况下, 使用层级项目结构发布的库 只兼容于使用层级结构的项目.
要允许兼容不使用层级结构的项目, 请在你的库项目中添加以下 `gradle.properties` 文件:

  ```kotlin
  kotlin.mpp.enableCompatibilityMetadataVariant=true
  ```

* 不使用层级项目结构发布的库, 在共用的原生代码集中不能使用.
  比如说, 在 `build.gradle.(kts)` 文件中使用了 `ios()` 简写的使用者, 在他们的 iOS 共用代码中, 将无法使用你的库.

跨平台项目与库之间的兼容性如下:

|使用层级项目结构的库|使用层级项目结构的项目|兼容性|
| --- | --- | --- |
|是|是|✅|
|是|否|需要启用 `enableCompatibilityMetadataVariant`|
|否|是|在共用的原生代码集中不能使用库|
|否|否|✅|

在将来的版本中, 跨平台项目中, 将会默认启用层级项目结构, 以及在共用代码集中使用平台依赖的库.
因此你越快支持这些功能特性, 用户就可以越快迁移.
如果你能将发现的任何 bug 报告到我们的问题追踪系统, 我们会非常感谢.

要启用层级项目结构, 请在你的 `gradle.properties` 文件添加以下设定:

```kotlin
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.mpp.enableCompatibilityMetadataVariant=true // 允许与不使用层级结构的项目兼容
```

## 针对构建脚本作者的指南

### 检查任务名称

在跨平台项目中引入层级项目结构, 导致了一些 Gradle 任务名称的变化:

* `metadataJar` 任务改名为 `allMetadataJar`.
* 对所有的发布的中间代码集(intermediate source set), 有了新的 `compile<SourceSet>KotlinMetadata` 任务.

这些变化仅限于使用层级项目结构的项目.

## 关于 Kotlin/JS 编译目标的使用

### 关于 npm 依赖项管理的变化

声明 npm 包的依赖项时, 现在可以指定一个明确的版本,
或一个基于 [npm semver 语法](https://docs.npmjs.com/misc/semver#versions) 的版本范围.
也支持指定多个版本范围.

尽管我们不推荐, 如果你不想指定明确的版本或版本范围, 你仍然可以在版本号的地方使用通配符 `*`.

### 关于 Kotlin/JS IR 编译器的变化

Kotlin 1.4.0 为 Kotlin/JS 引入了 Alpha IR 编译器.
更多详情请参见 [Kotlin/JS IR 编译器的后端, 以及如何配置](../js/js-ir-compiler.html).

要选择不同的 Kotlin/JS 编译器选项, 可以在你的 `gradle.properties` 文件中,
将 `kotlin.js.compiler` 设置为 `legacy`, `ir`, 或 `both`.
或者, 也可以在你的 `build.gradle(.kts)` 文件中, 向 `js` 函数传递参数 `LEGACY`, `IR`, 或 `BOTH`.

```groovy
kotlin {
    js(IR) { // 或者: LEGACY, BOTH
        // . . .
    }
    binaries.executable()
}
```

#### `both` 模式中的变化

选择 `both` 作为编译器选项 (因此它会同时使用 legacy 和 IR 后端进行编译) 意味着一些 Gradle 任务会改名,
以明确的表示它们只影响 legacy 编译.
`compileKotlinJs` 会改名为 `compileKotlinJsLegacy`, `compileTestKotlinJs` 会改名为 `compileTestKotlinJsLegacy`.

#### 明确开启可执行文件的创建

使用 IR 编译器时, 你的 `build.gradle(.kts)` 文件的 `js` 编译目标的配置代码段内, 必须出现 `binaries.executable()` 指令.
如果省略这个选项, 那么只会生成 Kotlin-internal 库文件. 这些文件可以在其他项目中使用, 但自身不能运行.

为了向后兼容, 对 Kotlin/JS 使用 legacy 编译器时, 包含或省略 `binaries.executable()` 不会产生效果 –
两种情况下都会生成可执行文件.
如果要让 legacy 后端在没有 `binaries.executable()` 指令时, 停止产生可执行文件
(比如, 在不需要可执行的 artifact 的情况下, 想要改善构建时间),
请在你的 `gradle.properties` 文件中, 设置 `kotlin.js.generate.executable.default=false`.

### 关于 Dukat 的变化

在 Kotlin 1.4.0 中, 对 Gradle 的 Dukat 集成发生了少量名称和功能的变化 .

* `kotlin.js.experimental.generateKotlinExternals` 标记改名为 `kotlin.js.generate.externals`.
这个标记控制 Dukat 对所有指定的 npm 依赖项的默认行为.
* `npm` 依赖项函数, 现在在包名称和版本之后接受第 3 个参数: `generateExternals`.
这个参数允许你分别控制 Dukat 是否应该对指定的依赖项生成声明, 而且它会覆盖 `generateKotlinExternals` 设置.

详情请参见 [手动切换是否生成 Kotlin 外部声明](../js/js-external-declarations-with-dukat.html).

### 在 Kotlin 1.3.x 项目中使用 Kotlin 1.4.x 构建的库文件

在 Kotlin 1.3.xx 中还不能选择 `IR` 和 `LEGACY` 编译器.
因此, 如果你的某个依赖项(或任何传递依赖项)使用 Kotlin 1.4+ 构建, 但你的项目使用 Kotlin 1.3.xx,
你可能会遇到 Gradle 错误 `Cannot choose between the following variants...`.
[这里](https://youtrack.jetbrains.com/issue/KT-40226) 提供了一种变通方法.
