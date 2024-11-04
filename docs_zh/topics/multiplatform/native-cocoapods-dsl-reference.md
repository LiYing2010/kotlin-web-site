[//]: # (title: CocoaPods Gradle plugin DSL 参考文档)

Kotlin CocoaPods Gradle plugin 是一个用来创建 Podspec 文件的工具.
将你的 Kotlin 项目与 [CocoaPods 依赖项管理器](https://cocoapods.org/) 集成时, 会需要这些文件.

本文档将会介绍, 使用 [CocoaPods 集成](native-cocoapods.md) 时,
你可以使用的 Kotlin CocoaPods Gradle plugin 的所有代码段, 函数, 属性.

* 学习如何 [设置开发环境并配置 Kotlin CocoaPods Gradle plugin](native-cocoapods.md).
* 根据你的项目和目的不同, 你可以添加 [Kotlin 项目与 Pod 库](native-cocoapods-libraries.md) 之间的依赖项,
  也可以添加 [Kotlin Gradle 项目与 Xcode 项目](native-cocoapods-xcode.md) 之间的依赖项.

## 启用 plugin

要启用 CocoaPods plugin, 请在 `build.gradle(.kts)` 文件添加以下代码:

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
    kotlin("native.cocoapods") version "%kotlinVersion%"
}
```

plugin 版本与 [Kotlin 发布版本](releases.md) 相同. 最新的稳定版本是 %kotlinVersion%.

## cocoapods 代码段

`cocoapods` 代码段是用于 CocoaPods 配置的的最顶层代码段.
它包含 Pod 的一般信息, 包括必须信息, 例如 Pod 版本, 概述, homepage, 以及可选的功能特性.

在这个代码段内部, 你可以使用以下代码段, 函数, 和属性:

| **名称**     | **描述**     |
|-------------|------------------------------------------------------------------------------------|
| `version`   | Pod 版本. 如果不指定, 会使用 Gradle 项目的版本. 如果 Gradle 项目的版本也没有设置, 会发生错误. |
| `summary`   | 通过这个项目构建得到的 Pod 的描述信息, 必须指定. |
| `homepage`  | 通过这个项目构建得到的 Pod 的 homepage 链接, 必须指定. |
| `authors`   | 通过这个项目构建得到的 Pod 的作者. |
| `podfile`   | 配置已有的 `Podfile` 文件. |
| `noPodspec()`   | 设置 plugin 不要为 `cocoapods` 小节生成 Podspec 文件. |
| `name`      | 通过这个项目构建得到的 Pod 的名称. 如果不指定, 会使用项目的名称. |
| `license`   | 通过这个项目构建得到的 Pod 的许可协议类型, 以及文字. |
| `framework` | framework 代码段对 plugin 生成的框架进行配置. |
| `source`    | 通过这个项目构建得到的 Pod 的位置. |
| `extraSpecAttributes` | 配置其他 Podspec 属性, 例如 `libraries` 或 `vendored_frameworks`. |
| `xcodeConfigurationToNativeBuildType` | 将自定义的 Xcode 配置映射到 NativeBuildType: "Debug" 映射为 `NativeBuildType.DEBUG`, "Release" 映射为 `NativeBuildType.RELEASE`. |
| `publishDir`| 配置 Pod 发布时的输出目录. |
| `pods`      | 返回 Pod 依赖项列表. |
| `pod()`     | 向通过这个项目构建得到的 Pod 添加一个 CocoaPods 依赖项. |
| `specRepos` | 添加一个使用 `url()` 的特定的仓库. 当使用私有 Pod 作为依赖项时, 需要这样的设置. 详情请参见 [CocoaPods 文档](https://guides.cocoapods.org/making/private-cocoapods.html). |

### 编译目标

| iOS                 | macOS        | tvOS                 | watchOS                 |
|---------------------|--------------|----------------------|-------------------------|
| `iosArm64`          | `macosArm64` | `tvosArm64`          | `watchosArm64`          |
| `iosX64`            | `macosX64`   | `tvosX64`            | `watchosX64`            |
| `iosSimulatorArm64` |              | `tvosSimulatorArm64` | `watchosSimulatorArm64` |
|                     |              |                      | `watchosArm32`          |
|                     |              |                      | `watchosDeviceArm64`    |

对每个编译目标, 可以使用 `deploymentTarget` 属性来对 Pod 库指定编译目标最低版本.

指定这个属性后, CocoaPods 会对所有的编译目标添加 `debug` 和 `release` 框架, 作为输出的二进制文件.

```kotlin
kotlin {
    iosArm64()

    cocoapods {
        version = "2.0"
        name = "MyCocoaPod"
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"

        extraSpecAttributes["vendored_frameworks"] = 'CustomFramework.xcframework'
        license = "{ :type => 'MIT', :text => 'License text'}"
        source = "{ :git => 'git@github.com:vkormushkin/kmmpodlibrary.git', :tag => '$version' }"
        authors = "Kotlin Dev"

        specRepos {
            url("https://github.com/Kotlin/kotlin-cocoapods-spec.git")
        }
        pod("example")

        xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
   }
}
```

### framework 代码段

`framework` 代码段嵌套在 `cocoapods` 代码段内, 用来配置通过项目构建的 Pod 的框架属性.

> 注意, `baseName` 是必须指定的项目.
>
{style="note"}

| **名称**           | **描述**                                      |
|--------------------|----------------------------------------------|
| `baseName`         | 框架名称, 必须指定. `frameworkName` 已被废弃, 请改为使用这个属性. |
| `isStatic`         | 定义框架的链接类型. 默认为 dynamic. |
| `transitiveExport` | 启用依赖项导出. |

```kotlin
kotlin {
    cocoapods {
        framework {
            baseName = "MyFramework"
            isStatic = false
            export(project(":anotherKMMModule"))
            transitiveExport = true
        }
    }
}
```

## pod() 函数

`pod()` 函数调用会对通过这个项目构建得到的 Pod 添加一个 CocoaPods 依赖项.
每个依赖项都需要一个单独的 `pod()` 函数调用.

在函数参数中, 你可以指定一个 Pod 库的名称. 在这个函数的配置代码段中, 还可以指定其他参数, 例如库的 `version` 和 `source`:

| **名称**       | **描述**                                                                                                                                                                                                             |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`     | 库的版本. 要使用库的最新版本, 请省略这个参数.                                                                                                                                                                                          |
| `source`      | 可以使用以下几种方式来配置 Pod: <list><li>通过 `git()` 函数, 使用 Git 仓库中的 Pod. 在 `git()` 之后的代码段中, 你可以指定 `commit` 来使用特定的 commit, 可以指定 `tag` 来使用特定的 tag, 可以指定 `branch` 来使用 特定的 branch</li><li>通过 `path()` 函数, 使用本地仓库中的 Pod</li></list> |
| `packageName` | 指定包名称.                                                                                                                                                                                                             |
| `extraOpts`   | 为 Pod 库指定选项列表. 例如, 特定的参数: <code-block lang="Kotlin">extraOpts = listOf("-compiler-option")</code-block>                                                                                                            |
| `linkOnly`                   | 让 CocoaPods plugin 使用动态框架(Dynamic Framework)的 Pod 依赖项, 不生成 cinterop 绑定. 如果对静态框架(Static Framework)使用这个选项, 会删除整个 Pod 依赖项.                                                                                            |
| `interopBindingDependencies` | 包含对其他 Pod 的依赖项列表. 在对新的 Pod 构建 Kotlin 绑定时会使用这个列表.                                                                                                                                                                   |
| `useInteropBindingFrom()`    | 指定用做依赖项的已存在的 Pod 的名称. 这个 Pod 需要在函数执行之前声明. 这个函数让 CocoaPods plugin 在对新的 Pod 构建 Kotlin 绑定时, 使用已存在的 Pod 的绑定.                                                                                                           |

```kotlin
kotlin {
    iosArm64()

    cocoapods {
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"

        iosArm64.deploymentTarget = "13.5"

        pod("pod_dependency") {
            version = "1.0"
            linkOnly = true
            source = path(project.file("../pod_dependency"))
        }
    }
}
```
