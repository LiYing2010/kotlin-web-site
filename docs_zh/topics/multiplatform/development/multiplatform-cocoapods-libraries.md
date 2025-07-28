[//]: # (title: 添加 Pod 库依赖项)

<tldr>

   * 在添加 Pod 依赖项之前, 请 [完成初始配置](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods).
   * 示例项目请参见我们的 [GitHub 代码仓库](https://github.com/Kotlin/kmp-with-cocoapods-sample).

</tldr>

在你的 Kotlin 项目中, 可以添加位于不同位置的 Pod 库的依赖项.

要添加一个 Pod 依赖项, 请在共用模块的 `build.gradle(.kts)` 文件中调用 `pod()` 函数.
每个依赖项都需要单独调用这个函数.
可以在函数的配置代码中对依赖项指定参数.

* 添加新的依赖项, 并在你的 IDE 中重新导入项目之后, 库会自动连接进来.
* 要让你的 Kotlin 项目与 Xcode 协同工作, 首先请 [修改项目的 Podfile 文件](multiplatform-cocoapods-overview.md#update-podfile-for-xcode).

> 如果你不指定部署目标(deployment target)最小版本, 而且依赖项 Pod 需要更高的部署目标版本, 那么会发生错误.
>
{style="note"}

示例项目参见 [这里](https://github.com/Kotlin/kmm-with-cocoapods-sample).

## 使用 CocoaPods 仓库 {id="from-the-cocoapods-repository"}

要添加一个位于 CocoaPods 仓库中的 Pod 库的依赖项, 请执行以下步骤:

1. 在 `pod()` 函数内指定 Pod 库名称.

   在配置代码段中, 可以使用 `version` 参数指定库的版本.
   要使用库的最新版本, 可以完全省略这个参数.

   > 也可以添加对 subspecs 的依赖项.
   >
   {style="note"}

2. 指定 Pod 库的部署目标(deployment target)最小版本.

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

3. 在 IntelliJ IDEA 中, 运行 **Build** | **Reload All Gradle Projects**
   (如果是 Android Studio, 请运行 **File** | **Sync Project with Gradle Files**),
   重新导入项目.

要在 Kotlin 代码中使用这些依赖项, 需要导入 `cocoapods.<library-name>` 包:

```kotlin
import cocoapods.SDWebImage.*
```

## 使用本地保存的库 {id="on-a-locally-stored-library"}

要添加一个本地保存的 Pod 库的依赖项, 请执行以下步骤:

1. 在 `pod()` 函数内指定 Pod 库名称.

   在配置代码段中, 指定本地 Pod 库的路径: 在 `source` 参数值中使用 `path()` 函数.

   > 也可以添加本地 subspecs 的依赖项.
   > `cocoapods {}` 代码段可以同时包含保存在本地的 Pod 库的依赖项, 以及 CocoaPods 仓库的 Pod 库的依赖项.
   >
   {style="note"}

2. 指定 Pod 库的部署目标(deployment target)最小版本.

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            pod("pod_dependency") {
                version = "1.0"
                extraOpts += listOf("-compiler-option")
                source = path(project.file("../pod_dependency"))
            }
            pod("subspec_dependency/Core") {
                version = "1.0"
                extraOpts += listOf("-compiler-option")
                source = path(project.file("../subspec_dependency"))
            }
            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

   > 也可以在配置代码段中使用 `version` 参数指定库的版本.
   > 要使用库的最新版本, 可以省略这个参数.
   >
   {style="note"}

3. 在 IntelliJ IDEA 中, 运行 **Build** | **Reload All Gradle Projects**
   (如果是 Android Studio, 请运行 **File** | **Sync Project with Gradle Files**),
   重新导入项目.

要在 Kotlin 代码中使用这些依赖项, 需要导入 `cocoapods.<library-name>` 包:

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
import cocoapods.SDWebImage.*
```

## 使用自定义的 Git 仓库 {id="from-a-custom-git-repository"}

要添加一个自定义的 Git 仓库中的 Pod 库的依赖项, 请执行以下步骤:

1. 在 `pod()` 函数内指定 Pod 库名称.

   在配置代码段中, 指定 git 仓库路径: 在 `source` 参数中使用 `git()` 函数.

   此外, 还可以在 `git()` 之后的代码段中指定以下参数:
    * `commit` – 使用仓库中特定的 commit
    * `tag` – 使用仓库中特定的 tag
    * `branch` – 使用仓库中特定的 branch

   `git()` 函数的参数优先级顺序如下: `commit`, `tag`, `branch`.
   如果不指定参数, Kotlin plugin 使用 `master` branch 中的 `HEAD`.

   > 可以组合 `branch`, `commit`, 和 `tag` 参数来得到 Pod 库的特定版本.
   >
   {style="note"}

2. 指定 Pod 库的部署目标(deployment target)最小版本.

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            pod("SDWebImage") {
                source = git("https://github.com/SDWebImage/SDWebImage") {
                    tag = "5.20.0"
                }
            }

            pod("JSONModel") {
                source = git("https://github.com/jsonmodel/jsonmodel.git") {
                    branch = "key-mapper-class"
                }
            }

            pod("CocoaLumberjack") {
                source = git("https://github.com/CocoaLumberjack/CocoaLumberjack.git") {
                    commit = "3e7f595e3a459c39b917aacf9856cd2a48c4dbf3"
                }
            }
        }
    }
    ```

3. 在 IntelliJ IDEA 中, 运行 **Build** | **Reload All Gradle Projects**
   (如果是 Android Studio, 请运行 **File** | **Sync Project with Gradle Files**),
   重新导入项目.

要在 Kotlin 代码中使用这些依赖项, 需要导入 `cocoapods.<library-name>` 包:

```kotlin
import cocoapods.SDWebImage.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

## 使用自定义的 Podspec 仓库 {id="from-a-custom-podspec-repository"}

要添加自定义的 Podspec 仓库中的 Pod 库依赖项, 请执行以下步骤:

1. 在 `specRepos {}` 代码段之内, 调用 `url()` 函数, 指定自定义 Podspec 仓库的地址.
2. 在 `pod()` 函数内指定 Pod 库名称.
3. 指定 Pod 库的部署目标(deployment target)最小版本.

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            specRepos {
                url("https://github.com/Kotlin/kotlin-cocoapods-spec.git")
            }
            pod("example")
        }
    }
    ```

4. 在 IntelliJ IDEA 中, 运行 **Build** | **Reload All Gradle Projects**
   (如果是 Android Studio, 请运行 **File** | **Sync Project with Gradle Files**),
   重新导入项目.

> 要与 Xcode 协同工作, 请在你的 Podfile 文件的最开始指定 spec 的位置:
>
> ```ruby
> source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'
> ```
>
{style="note"}

要在 Kotlin 代码中使用这些依赖项, 需要导入 `cocoapods.<library-name>` 包:

```kotlin
import cocoapods.example.*
```

## 使用自定义的 cinterop 选项 {id="with-custom-cinterop-options"}

要使用自定义的 cinterop 选项添加 Pod 库依赖项, 请执行以下步骤:

1. 在 `pod()` 函数内指定 Pod 库名称.

2. 在配置代码段中, 添加以下选项:

   * `extraOpts` – 指定对 Pod 库的选项列表. 例如, `extraOpts = listOf("-compiler-option")`.

     > 如果你遇到与 clang 模块相关的问题, 请添加 `-fmodules` 选项.
     >
     {style="note"}

   * `packageName` – 通过 `import <packageName>`, 使用包名称直接导入这个库.

3. 指定 Pod 库的部署目标(deployment target)最小版本.

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            pod("FirebaseAuth") {
                packageName = "FirebaseAuthWrapper"
                version = "11.7.0"
                extraOpts += listOf("-compiler-option", "-fmodules")
            }
        }
    }
    ```

4. 在 IntelliJ IDEA 中, 运行 **Build** | **Reload All Gradle Projects**
   (如果是 Android Studio, 请运行 **File** | **Sync Project with Gradle Files**),
   重新导入项目.

要在 Kotlin 代码中使用这些依赖项, 需要导入 `cocoapods.<library-name>` 包:

```kotlin
import cocoapods.FirebaseAuth.*
```

如果使用了 `packageName` 参数, 那么可以使用包这个名称导入这个库 `import <packageName>`:

```kotlin
import FirebaseAuthWrapper.Auth
import FirebaseAuthWrapper.User
```

### 对带 @import 命令的 Objective-C 头文件的支持 {id="support-for-objective-c-headers-with-import-directives"}

> 这个功能是 [实验性功能](supported-platforms.md#general-kotlin-stability-levels).
> 它随时有可能变更或被删除. 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://kotl.in/issue) 提供你的反馈意见.
>
{style="warning"}

某些 Objective-C 库, 尤其是 Swift 库的封装库, 在它们的头文件中存在 `@import` 命令.
默认情况下, cinterop 不支持这些命令.

要启用对 `@import` 命令的支持, 请在 `pod()` 函数的配置代码段中指定 `-fmodules` 选项:

```kotlin
kotlin {
    iosArm64()

    cocoapods {
        version = "2.0"
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"
        ios.deploymentTarget = "16.0"

        pod("PodName") {
            version = "1.0.0"
            extraOpts = listOf("-compiler-option", "-fmodules")
        }
    }
}
```

### 在依赖的 Pod 之间共用 Kotlin cinterop {id="share-kotlin-cinterop-between-dependent-pods"}

如果你使用 `pod()` 函数添加了多个 Pod 库依赖项, 当你的 Pod 库的 API 之间存在依赖关系时, 你可能会遇到问题.

这种情况下, 为了让代码成功编译, 请使用 `useInteropBindingFrom()` 函数.
在为新的 Pod 构建绑定时, 这个函数会利用为另一个 Pod 生成的 cinterop 绑定.

你应该在设置依赖项之前声明依赖的 Pod 库:

```kotlin
// pod("WebImage") 的 cinterop:
fun loadImage(): WebImage

// pod("Info") 的 cinterop:
fun printImageInfo(image: WebImage)

// 你的代码:
printImageInfo(loadImage())
```

这样的情况下, 如果你没有正确配置 cinterop 之间的依赖关系,
这段代码会无效, 因为 `WebImage` 类型在不同的 cinterop 文件内, 因此, 它也属于不同的包.

## 下一步做什么 {id="what-s-next"}

* [设置 Kotlin 项目和 Xcode 项目之间的依赖项](multiplatform-cocoapods-xcode.md)
* [阅读完整的 CocoaPods Gradle plugin DSL 参考文档](multiplatform-cocoapods-dsl-reference.md)
