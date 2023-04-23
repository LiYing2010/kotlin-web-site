---
type: doc
layout: reference
category: "Other"
title: "层级项目结构"
---

# Hierarchical project structure

最终更新: {{ site.data.releases.latestDocDate }}

在 Kotlin 1.6.20 中, 每个新建的跨平台项目都会使用层级项目结构. 也就是说源代码集组成一个层级结构, 以便在在多个编译目标中共用共通的代码.
这个功能为你提供了很多新的能力, 包括在共通源代码集中使用平台依赖的库, 以及在创建跨平台库时可以共用代码.

要在你的项目中默认使用层级项目结构, 请 [更新到最新版本](../releases.html#update-to-a-new-release).
如果你还想继续使用 1.6.20 之前的版本, 那么可以手动启用这个功能.
方法是在你的 `gradle.properties` 文件中添加以下设定:

```none
kotlin.mpp.enableGranularSourceSetsMetadata=true
kotlin.native.enableDependencyPropagation=false
```

## 针对跨平台项目作者的指南

通过 新的层级项目结构功能,
在一个跨平台项目中, 你可以在一部分, 但不是所有的, [编译目标](multiplatform-dsl-reference.html#targets) 之间共用代码.

在多个原生编译目标之间共用的代码集中, 你也可以使用平台依赖的库, 比如 `UIKit` 和 `POSIX`,
一种常见的使用场景是, 在所有 iOS 编译目标之间共用的代码时, 可以访问 iOS 平台的依赖项, 比如 `Foundation`.
这个新的结构可以帮助你共用更多原生代码, 不受平台相关的依赖项的限制.

通过使用层级结构, 以及在共用代码集中使用平台依赖库,
不再需要用各种变通方法来让 IDE 支持在多个原生编译目标之间共享代码集,
比如在 `iosArm64` 和 `iosX64` 之间:

```kotlin
// 变通方法 1: 依赖 Xcode 环境变量来选择 iOS 目标平台
kotlin {
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
[编译目标的简写(shortcut)](multiplatform-share-on-platforms.html#use-target-shortcuts)
来创建一个层级结构, 或者也可以手动声明, 并连接各个代码集.
比如, 可以使用 `ios()` 简写, 创建 2 个 iOS 编译目标, 以及 1 个共用代码集:

```kotlin
kotlin {
    ios() // iOS 设备和模拟器编译目标; iosMain 和 iosTest 代码集
}
```

Kotlin 工具链将会提供正确的默认依赖项, 并在共用代码中找到可用的 API 接口.
这可以防止某些不正常的情况, 比如在为 Windows 环境共用的代码中, 使用 macOS 专有的函数.

## 针对库作者的指南

使用层级项目结构, 可以在类似的编译目标中重用代码, 而且可以发布和消费那些针对类似平台的粗粒度(granular) API 的库.

Kotlin 工具链会自动识别出在库的使用者源代码集中可用的 API, 并检查不安全的使用, 比如在 JS 代码中使用针对 JVM 的 API.

* 使用新的层级项目结构发布的库, 只兼容于使用层级结构的项目.
  要允许兼容不使用层级结构的项目, 请在你的库项目的 `gradle.properties` 文件中添加以下内容:

  ```none
  kotlin.mpp.enableCompatibilityMetadataVariant=true
  ```

 > 这种情况下, 只有来自 `commonMain` 源代码集的源代码会使用旧的 metadata 编译器进行编译.
 > 如果你在 `commonMain` 中使用平台相关的代码, 它将无法编译为旧的格式.
 {:.warning}

* 不使用层级项目结构发布的库, 在共用的原生代码集中不能使用.
  比如, 在 `build.gradle.(kts)` 文件中使用了 `ios()` 简写的使用者, 在他们的 iOS 共用代码中, 将无法使用你的库.

详情请参见 [兼容性](#compatibility)

## 兼容性

跨平台项目与库之间的兼容性如下:

| 使用层级项目结构的库 | 使用层级项目结构的项目 | 兼容性 |
|-------------------|--------------------|--------|
| 是 | 是 | ✅  |
| 是 | 否 | 需要在库的项目中启用 `enableCompatibilityMetadataVariant`     |
| 否 | 是 | 在共用的原生代码集中不能使用库 |
| 否 | 否 | ✅  |

## 如何禁用

要禁用层级结构, 请在你的 `gradle.properties` 文件中将以下选项设置为 `false`:

```none
kotlin.mpp.hierarchicalStructureSupport=false
```

对于 `kotlin.mpp.enableCompatibilityMetadataVariant` 选项,
它会允许使用层级项目结构发布的库与非层级结构项目兼容 – 默认是禁用的.
对这个选项不需要额外设置.
