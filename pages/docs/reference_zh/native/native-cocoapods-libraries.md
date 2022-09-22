---
type: doc
layout: reference
category: "Native"
title: "添加 Pod 库依赖项"
---

# 添加 Pod 库依赖项

最终更新: {{ site.data.releases.latestDocDate }}

要添加 Kotlin 项目对 Pod 库的依赖项, 首先应该 [完成初始配置](native-cocoapods.html#set-up-the-environment-to-work-with-cocoapods).
然后就可以添加各种类型的 Pod 库依赖项.

添加新的依赖项, 并在 IntelliJ IDEA 并重新导入项目之后, 新的依赖项会被自动添加进来.
不需要其他步骤.

要让你的 Kotlin 项目与 Xcode 协同工作, 应该 [修改项目的 Podfile 文件](native-cocoapods.html#update-podfile-for-xcode).

Kotlin 项目需要在 `build.gradle.kts` (`build.gradle`) 中调用 `pod()` 函数来添加 Pod 依赖项.
每个依赖项都需要单独调用这个函数.
可以在函数的配置代码中对依赖项指定参数.

> 如果你不指定部署目标(deployment target)最小版本, 而且依赖项 Pod 需要更高的部署目标版本, 那么会发生错误.
{:.note}

示例项目参见 [这里](https://github.com/Kotlin/kmm-with-cocoapods-sample).

## 从 CocoaPods 仓库添加 Pod 库依赖项

1. 在 `pod()` 函数内指定 Pod 库名称.

   在配置代码段中, 可以使用 `version` 参数指定库的版本.
   要使用库的最新版本, 可以完全省略这个参数.

   > 可以添加对 subspecs 的依赖项.
   {:.note}

2. 指定 Pod 库的部署目标(deployment target)最小版本.

    ```kotlin
    kotlin {
        ios()

        cocoapods {
            ios.deploymentTarget = "13.5"

            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            pod("AFNetworking") {
                version = "~> 4.0.1"
            }
        }
    }
    ```

3. 重新导入项目.

要在 Kotlin 代码中使用这些依赖项, 需要导入 `cocoapods.<library-name>` 包.

```kotlin
import cocoapods.AFNetworking.*
```

## 使用保存在本地的 Pod 库添加依赖项

1. 在 `pod()` 函数内指定 Pod 库名称.

   在配置代码段中, 指定本地 Pod 库的路径: 在 `source` 参数值中使用 `path()` 函数.

   > 也可以添加本地 subspecs 的依赖项.
   > `cocoapods` 代码段可以同时包含保存在本地的 Pod 库的依赖项, 以及 CocoaPods 仓库的 Pod 库的依赖项.
   {:.note}

2. 指定 Pod 库的部署目标(deployment target)最小版本.

    ```kotlin
    kotlin {
        ios()

        cocoapods {
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            ios.deploymentTarget = "13.5"

            pod("pod_dependency") {
                version = "1.0"
                source = path(project.file("../pod_dependency"))
            }
            pod("subspec_dependency/Core") {
                version = "1.0"
                source = path(project.file("../subspec_dependency"))
            }
            pod("AFNetworking") {
                version = "~> 4.0.1"
            }
        }
    }
    ```

   > 也可以在配置代码段中使用 `version` 参数指定库的版本.
   > 要使用库的最新版本, 可以省略这个参数.
   {:.note}

3. 重新导入项目.

要在 Kotlin 代码中使用这些依赖项, 需要导入 `cocoapods.<library-name>` 包.

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
import cocoapods.AFNetworking.*
```

## 从 Git 仓库添加 Pod 库依赖项

1. 在 `pod()` 函数内指定 Pod 库名称.

   在配置代码段中, 指定 git 仓库路径: 在 `source` 参数中使用 `git()` 函数.

   此外, 还可以在 `git()` 之后的代码段中指定以下参数:
    * `commit` – 使用仓库中特定的 commit
    * `tag` – 使用仓库中特定的 tag
    * `branch` – 使用仓库中特定的 branch

   `git()` 函数的参数优先级顺序如下: `commit`, `tag`, `branch`.
   如果不指定参数, Kotlin plugin 使用 `master` branch 中的 `HEAD`.

   > 可以组合 `branch`, `commit`, 和 `tag` 参数来得到 Pod 库的特定版本.
   {:.note}

2. 指定 Pod 库的部署目标(deployment target)最小版本.

    ```kotlin
    kotlin {
        ios()

        cocoapods {
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            ios.deploymentTarget = "13.5"

            pod("AFNetworking") {
                source = git("https://github.com/AFNetworking/AFNetworking") {
                    tag = "4.0.0"
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

3. 重新导入项目.

> 要与 Xcode 正确的协同工作, 需要在你的 Podfile 文件中指定 Podspec 路径.
> 例如:
>
> ```ruby
> target 'ios-app' do
>     # ... 其他 pod 依赖项 ...
>    pod 'JSONModel', :path => '../cocoapods/kmm-with-cocoapods-sample/kotlin-library/build/cocoapods/externalSources/git/JSONModel'
> end
> ```
{:.note}

要在 Kotlin 代码中使用这些依赖项, 需要导入 `cocoapods.<library-name>` 包.

```kotlin
import cocoapods.AFNetworking.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

## 从 zip, tar, 或 jar archive 文件添加 Pod 库依赖项

1. 在 `pod()` 函数内指定 Pod 库名称.

   在配置代码段中, 指定文件路径: 在 `source` 参数中, 使用 `url()` 函数, 参数是任意 HTTP 地址.

   此外, 你还可以指定布尔值的 `flatten` 参数, 作为 `url()` 函数的第二个参数.
   这个参数表示所有 Pod 文件是否存在于 archive 文件的根目录中.

2. 指定 Pod 库的部署目标(deployment target)最小版本.

    ```kotlin
    kotlin {
        ios()

        cocoapods {
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            ios.deploymentTarget = "13.5"

            pod("pod_dependency") {
                source = url("https://github.com/Kotlin/kmm-with-cocoapods-sample/raw/cocoapods-zip/cocoapodSourcesZip.zip", flatten = true)
            }
        }
    }
    ```

3. 重新导入项目.

> 要与 Xcode 正确的协同工作, 需要在你的 Podfile 文件中指定 Podspec 路径.
> 例如:
>
> ```ruby
> target 'ios-app' do
>     # ... 其他 pod 依赖项 ...
>    pod 'podspecWithFilesExample', :path => '../cocoapods/kmm-with-cocoapods-sample/pod_dependency'
> end
> ```
{:.note}

要在 Kotlin 代码中使用这些依赖项, 需要导入 `cocoapods.<library-name>` 包.

```kotlin
import cocoapods.pod_dependency.*
```

## 从自定义 Podspec 仓库添加 Pod 库依赖项

1. 在 `specRepos` 代码段之内, 使用 `url()` 函数, 指定自定义 Podspec 仓库的 HTTP 地址.

2. 在 `pod()` 函数内指定 Pod 库名称.

3. 指定 Pod 库的部署目标(deployment target)最小版本.

    ```kotlin
    kotlin {
        ios()

        cocoapods {
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            ios.deploymentTarget = "13.5"

            specRepos {
                url("https://github.com/Kotlin/kotlin-cocoapods-spec.git")
            }
            pod("example")
        }
    }
    ```

4. 重新导入项目.

> 要与 Xcode 正确的协同工作, 需要在你的 Podfile 文件的最开始指定 spec 的位置.
> 例如:
> ```ruby
> source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'
> ```
>
> 还需要在 Podfile 文件中指定 Podspec 的路径.
> 例如:
>
> ```ruby
> target 'ios-app' do
>     # ... 其他 pod 依赖项 ...
>    pod 'podspecWithFilesExample', :path => '../cocoapods/kmm-with-cocoapods-sample/pod_dependency'
> end
> ```
{:.note}

要在 Kotlin 代码中使用这些依赖项, 需要导入 `cocoapods.<library-name>` 包.

```kotlin
import cocoapods.example.*
```

## 使用自定义 cinterop 选项添加 Pod 库依赖项

1. 在 `pod()` 函数内指定 Pod 库名称.

   在配置代码段中, 指定 cinterop 选项:
    * `extraOpts` – 指定对 Pod 库的选项列表. 例如, 指定 flag: `extraOpts = listOf("-compiler-option")`.
    * `packageName` – 指定包名称. 如果有指定, 可以使用这个包名称导入这个库: `import <packageName>`.

2. 指定 Pod 库的部署目标(deployment target)最小版本.

    ```kotlin
    kotlin {
        ios()

        cocoapods {
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            ios.deploymentTarget = "13.5"

            useLibraries()

            pod("YandexMapKit") {
                packageName = "YandexMK"
            }
        }
    }
    ```

3. 重新导入项目.

要在 Kotlin 代码中使用这些依赖项, 需要导入 `cocoapods.<library-name>` 包.

```kotlin
import cocoapods.YandexMapKit.*
```

如果使用了 `packageName` 参数, 那么可以使用包这个名称导入这个库 `import <packageName>`:

```kotlin
import YandexMK.YMKPoint
import YandexMK.YMKDistance
```

## 使用静态 Pod 库添加依赖项

1. 使用 `pod()` 函数指定 Pod 库名称.

2. 调用 `useLibraries()` 函数 - 这个函数会对静态库开启一个特殊的 flag.

3. 指定 Pod 库的部署目标(deployment target)最小版本.

    ```kotlin
    kotlin {
        ios()

        cocoapods {
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            ios.deploymentTarget = "13.5"

            pod("YandexMapKit") {
                version = "~> 3.2"
            }
            useLibraries()
        }
    }
    ```

4. 重新导入项目.

要在 Kotlin 代码中使用这些依赖项, 需要导入 `cocoapods.<library-name>` 包.

```kotlin
import cocoapods.YandexMapKit.*
```
