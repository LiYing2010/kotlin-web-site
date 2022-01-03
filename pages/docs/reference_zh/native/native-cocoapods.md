---
type: doc
layout: reference
category: "Native"
title: "与 CocoaPods 集成"
---

# 与 CocoaPods 集成

本页面最终更新: 2021/03/16

Kotlin/Native 提供了与 [CocoaPods 依赖管理器](https://cocoapods.org/) 的集成功能.
你可以添加对 Pod 库的依赖项, 也可以使用跨平台项目的原生编译目标作为 CocoaPods 依赖项(Kotlin Pod).

可以直接在 IntelliJ IDEA 中管理 Pod 依赖项, 并使用所有额外的功能特性, 比如代码高亮度和代码自动完成.
可以使用 Gradle 来构建整个 Kotlin 项目, 而不必切换到 Xcode.

只有在需要编写 Swift/Objective-C 代码, 或在模拟器或设备上运行应用程序时, 才需要使用 Xcode.
要与 Xcode 正确的协同工作, 你需要 [更新你的 Podfile](#update-podfile-for-xcode).

根据你的项目和目的不同, 可以添加
[Kotlin 项目对 Pod 库的依赖项](#add-dependencies-on-pod-libraries), 以及 [Kotlin Pod 对 Xcode 项目的依赖项](#use-a-kotlin-gradle-project-as-a-cocoapods-dependency) 之间的依赖项目.

> 也可以添加 Kotlin Pod 对多个 Xcode 项目的依赖.
> 但是这种情况下需要对每个 Xcode 项目手动调用 `pod install` 来添加依赖项.
> 其他情况下是会自动调用的.
{:.note}

## 安装 CocoaPods 依赖项管理器和插件

1. 安装 [CocoaPods 依赖项管理器](https://cocoapods.org/).

    ```ruby
    $ sudo gem install cocoapods
    ```

2. 安装 [`cocoapods-generate`](https://github.com/square/cocoapods-generate) 插件.

    ```ruby
    $ sudo gem install cocoapods-generate
    ```

3. 在 IDEA 项目的 `build.gradle.kts` (或 `build.gradle`) 文件中, 应用 CocoaPods 插件和 Kotlin Multiplatform 插件.

    ```kotlin
    plugins {
       kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
       kotlin("native.cocoapods") version "{{ site.data.releases.latest.version }}"
    }
    ```

4. 在 `cocoapods` 代码段中, 配置 `Podspec` 文件的 `summary`, `homepage`, 和 `frameworkName`.
   这里的 `version` 是 Gradle 项目的版本.

    ```kotlin
    plugins {
        kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
        kotlin("native.cocoapods") version "{{ site.data.releases.latest.version }}"
    }

    // CocoaPods 需要对 podspec 指定版本.
    version = "1.0"

    kotlin {
        cocoapods {

            framework {
                // 配置 CocoaPods 需要的项目.
                summary = "Some description for a Kotlin/Native module"
                homepage = "Link to a Kotlin/Native module homepage"
                // 配置框架名称. 'frameworkName' 属性已废弃, 请改为使用这个属性
                baseName = "MyFramework"
                // (可选) 是否支持动态框架
                isStatic = false
                // (可选) 导出依赖项
                export(project(":anotherKMMModule"))
                transitiveExport = true
                // (可选) 嵌入 bitcode
                embedBitcode(BITCODE)
            }

            // 将自定义的 Xcode 配置对应到 NativeBuildType
            xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
            xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
        }
    }
    ```

5. 重新导入项目.

6. 生成 [Gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html), 以免在 Xcode 构建时发生兼容性问题.

应用 CocoaPods 插件后, 它会完成如下工作:

* 对所有的 macOS, iOS, tvOS, 和 watchOS 编译目标, 将 `debug` 和 `release` 框架添加为输出的二进制文件.
* 创建 `podspec` 任务, 它会为项目生成一个 [Podspec](https://guides.cocoapods.org/syntax/podspec.html) 文件.

`Podspec` 文件包含输出框架的路径, 以及一段脚本, 负责在 Xcode 项目的构建过程中, 自动构建这个框架.

## 添加 Pod 库的依赖项

要添加 Kotlin 项目对 Pod 库的依赖项, 首先应该 [完成初始配置](#install-the-cocoapods-dependency-manager-and-plugin).
然后, 可以添加以下类型 Pod 库的依赖项:
 * [来自 CocoaPods 仓库的 Pod 库](#add-a-dependency-on-a-pod-library-from-the-cocoapods-repository)
 * [保存在本地的 Pod 库](#add-a-dependency-on-a-pod-library-stored-locally)
 * [来自 Git 仓库的 Pod 库](#add-a-dependency-on-a-pod-library-from-the-git-repository)
 * [来自 archive 文件的 Pod 库](#add-a-dependency-on-a-pod-library-from-an-archive)
 * [来自自定义 Podspec 仓库的 Pod 库](#add-a-dependency-on-a-pod-library-from-a-custom-podspec-repository)
 * [使用自定义 cinterop 选项的 Pod 库](#add-a-dependency-on-a-pod-library-with-custom-cinterop-options)
 * [静态 Pod 库](#add-a-dependency-on-a-static-pod-library)

Kotlin 项目需要在 `build.gradle.kts` (`build.gradle`) 中调用 `pod()` 函数来添加 Pod 依赖项.
每个依赖项都需要单独调用这个函数.
可以在函数的配置代码中指定依赖项的参数.

在添加新的依赖项之后, 在 IntelliJ IDEA 并重新导入项目, 新的依赖项会被自动添加进来.
不需要其他步骤.

要让你的 Kotlin 项目与 Xcode 协同工作, 应该 [修改项目的 Podfile 文件](#update-podfile-for-xcode).

### 添加 CocoaPods 仓库中的 Pod 库的依赖项

可以在你的项目的 `build.gradle.kts`(`build.gradle`) 文件中,
使用 `pod()`来添加 CocoaPods 仓库中的 Pod 库的依赖项:

1. 在 `pod()` 函数内指定 Pod 库名称.
在配置代码段中, 可以使用 `version` 参数指定库的版本.
要使用库的最新版本, 可以完全省略这个参数.

    > 可以添加对 subspecs 的依赖项.
    {:.note}                                                                                                                                       

2. 指定 Pod 库的部署目标(deployment target)最小版本.

    > 如果不指定部署目标最小版本, 而依赖的 Pod 需要更高的部署目标, 那么会发生错误.
    {:.note}

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

示例项目参见 [这里](https://github.com/Kotlin/kmm-with-cocoapods-sample).

### 添加保存在本地的 Pod 库的依赖项

在你的项目的 `build.gradle.kts`(`build.gradle`) 文件中,
可以使用 `pod()` 来添加保存在本地的 Pod 库的依赖项:

1. 在 `pod()` 函数内指定 Pod 库名称.
在配置代码段中, 指定本地 Pod 库的路径: 在 `source` 参数值中使用 `path()` 函数.

    > 也可以添加本地 subspecs 的依赖项.
    > `cocoapods` 代码段可以同时包含保存在本地的 Pod 库的依赖项, 以及 CocoaPods 仓库的 Pod 库的依赖项.
    {:.note}

2. 指定 Pod 库的部署目标(deployment target)最小版本.

    > 如果不指定部署目标最小版本, 而依赖的 Pod 需要更高的部署目标, 那么会发生错误.
    {:.note}

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

示例项目参见 [这里](https://github.com/Kotlin/kmm-with-cocoapods-sample).

### 添加来自 Git 仓库的 Pod 库的依赖项

在你的项目的 `build.gradle.kts`(`build.gradle`) 文件中,
可以使用 `pod()` 来添加来自自定义 Git 仓库的 Pod 库的依赖项:

1. 在 `pod()` 函数内指定 Pod 库名称.
在配置代码段中, 指定 git 仓库路径: 在 `source` 参数中使用 `git()` 函数.

    此外, 还可以在 `git()` 之后的代码段中指定以下参数:
    * `commit` – 使用仓库中特定的 commit
    * `tag` – 使用仓库中特定的 tag
    * `branch` – 使用仓库中特定的 branch

    `git()` 函数的参数优先级顺序如下: `commit`, `tag`, `branch`.
    如果不指定参数, Kotlin plugin 使用 `master` branch 中的 `HEAD`.

    > 可以组合 `branch`, `commit`, 和 `tag` 参数来指定 Pod 库的特定版本.
    {:.note}

2. 指定 Pod 库的部署目标(deployment target)最小版本.

    > 如果不指定部署目标最小版本, 而依赖的 Pod 需要更高的部署目标, 那么会发生错误.
    {:.note}

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
>     # ... other pod depedencies ...
>    pod 'JSONModel', :path => '../cocoapods/kotlin-with-cocoapods-sample/kotlin-library/build/cocoapods/externalSources/git/JSONModel'
> end
> ```
>
{:.note}

要在 Kotlin 代码中使用这些依赖项, 需要导入 `cocoapods.<library-name>` 包.

```kotlin
import cocoapods.AFNetworking.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

示例项目参见 [这里](https://github.com/Kotlin/kmm-with-cocoapods-sample).

### 添加来自 archive 文件的 Pod 库的依赖项

在你的项目的 `build.gradle.kts`(`build.gradle`) 文件中,
可以使用 `pod()` 来添加来自 `zip`, `tar`, 或 `jar` archive 文件的 Pod 库的依赖项:

1. 在 `pod()` 函数内指定 Pod 库名称.
在配置代码段中, 指定文件路径: 在 `source` 参数中, 使用 `url()` 函数, 参数是任意 HTTP 地址.

    此外, 你还可以指定布尔值的 `flatten` 参数, 作为 `url()` 函数的第二个参数.
    这个参数表示所有 Pod 文件是否存在于 archive 文件的根目录中.

2. 指定 Pod 库的部署目标(deployment target)最小版本.

    > 如果不指定部署目标最小版本, 而依赖的 Pod 需要更高的部署目标, 那么会发生错误.
    {:.note}

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
>     # ... other pod depedencies ...
>    pod 'podspecWithFilesExample', :path => '../cocoapods/kmm-with-cocoapods-sample/pod_dependency'
> end
> ```
>
{:.note}

要在 Kotlin 代码中使用这些依赖项, 需要导入 `cocoapods.<library-name>` 包.

```kotlin
import cocoapods.pod_dependency.*
```

示例项目参见 [这里](https://github.com/Kotlin/kmm-with-cocoapods-sample).

### 添加来自自定义 Podspec 仓库的 Pod 库的依赖项

在你的项目的 `build.gradle.kts`(`build.gradle`) 文件中,
可以使用 `pod()` 和 `specRepos` 来添加来自自定义 Podspec 仓库的 Pod 库的依赖项:

1. 在 `specRepos` 代码段之内, 使用 `url()` 函数, 指定自定义 Podspec 仓库的 HTTP 地址.

2. 在 `pod()` 函数内指定 Pod 库名称.

3. 指定 Pod 库的部署目标(deployment target)最小版本.

    > 如果不指定部署目标最小版本, 而依赖的 Pod 需要更高的部署目标, 那么会发生错误.
    {:.note}

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
>
> ```ruby
> source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'`
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
>
{:.note}

要在 Kotlin 代码中使用这些依赖项, 需要导入 `cocoapods.<library-name>` 包.

```kotlin
import cocoapods.example.*
```

示例项目参见 [这里](https://github.com/Kotlin/kmm-with-cocoapods-sample).

### 添加使用自定义 cinterop 选项的 Pod 库的依赖项

在你的项目的 `build.gradle.kts`(`build.gradle`) 文件中,
可以使用 `pod()` 来添加使用自定义 cinterop 选项的 Pod 库的依赖项:

1. 在 `pod()` 函数内指定 Pod 库名称.
在配置代码段中, 指定 cinterop 选项:

    * `extraOpts` – 指定对 Pod 库的选项列表. 例如, 指定 flag: `extraOpts = listOf("-compiler-option")`
    * `packageName` – 指定包名称. 如果有指定, 可以使用这个包名称导入这个库: `import <packageName>`.

2. 指定 Pod 库的部署目标(deployment target)最小版本.

    > 如果不指定部署目标最小版本, 而依赖的 Pod 需要更高的部署目标, 那么会发生错误.
    {:.note}

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

### 添加静态 Pod 库的依赖项

在你的项目的 `build.gradle.kts`(`build.gradle`) 文件中,
可以使用 `pod()` 和 `useLibraries()` 来添加静态 Pod 库的依赖项:

1. 使用 `pod()` 函数指定 Pod 库名称.

2. 调用 `useLibraries()` 函数 - 这个函数会对静态库开启一个特殊的 flag.

3. 指定 Pod 库的部署目标(deployment target)最小版本.

    > 如果不指定部署目标最小版本, 而依赖的 Pod 需要更高的部署目标, 那么会发生错误.
    {:.note}

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

### 为 Xcode 更新 Podfile 文件

如果要在一个 Xcode 项目中导入你的 Kotlin 项目, 需要修改你的 Podfile 文件, 才能正确工作:

* 如果你的项目存在任何 Git, HTTP, 或 自定义 Podspec 仓库的依赖项, 那么还需要在 Podfile 中指定 Podspec 的路径.

    例如, 如果添加了 `podspecWithFilesExample` 的依赖, 需要在 Podfile 文件中声明 Podspec 路径:

    ```ruby
    target 'ios-app' do
        # ... 其他依赖项 ...
        pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample'
    end
    ```

    `:path` 应该包含 Pod 的文件路径.

* 如果添加一个来自自定义 Podspec 仓库的库, 那么还需要在 Podfile 文件的最开始指定 spec 的[位置](https://guides.cocoapods.org/syntax/podfile.html#source):

    ```ruby
    source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

    target 'kotlin-cocoapods-xcproj' do
        # ... 其他依赖项 ...
        pod 'example'
    end
    ```

> 对 Podfile 文件进行这些修改后, 需要重新导入项目.
{:.note}

如果不对 Podfile 文件进行这些修改, `podInstall` 任务将会失败, CocoaPods plugin 会在 log 中显示错误消息.

请参见 [示例项目](https://github.com/Kotlin/kmm-with-cocoapods-sample) 的 `withXcproject` branch,
其中包含如何与 Xcode 集成的示例, 它使用一个既有的 Xcode 项目, 名为 `kotlin-cocoapods-xcproj`.

## 使用 Kotlin Gradle 项目作为 CocoaPods 依赖项

可以使用带有原生编译目标的 Kotlin 跨平台项目作为 CocoaPods 依赖项 (Kotlin Pod).
可以在 Xcode 项目的 Podfile 文件中包含这样的依赖项, 使用它的名称, 以及包含生成的 Podspec 文件的项目路径.
这个依赖项会跟随这个项目一起自动构建(以及重构建).
这样的方式简化了导入 Xcode 的工作, 因为不再需要编写相应的 Gradle 任务, 也不需要 Xcode 中的手动构建步骤.

可以添加以下依赖项:
* [Kotlin Pod 与单个编译目标的 Xcode 项目之间的依赖](#add-a-dependency-between-a-kotlin-pod-and-xcode-project-with-one-target)
* [Kotlin Pod 与多个编译目标的 Xcode 项目之间的依赖](#add-a-dependency-between-a-kotlin-pod-with-an-xcode-project-with-several-targets)

> 为了将依赖项正确的导入到 Kotlin/Native 模块, `Podfile` 必须包含
  [`use_modular_headers!`](https://guides.cocoapods.org/syntax/podfile.html#use_modular_headers_bang)
  或 [`use_frameworks!`](https://guides.cocoapods.org/syntax/podfile.html#use_frameworks_bang)
  指令.
{:.note}

### 添加 Kotlin Pod 与单个编译目标的 Xcode 项目之间的依赖项

1. 如果还没有, 首先请创建带 `Podfile` 的 Xcode 项目.
2. 在 Kotlin 项目的 `build.gradle.kts` (`build.gradle`) 脚本中, 使用 `podfile = project.file(..)`,
   添加 Xcode 项目 `Podfile` 的路径.
   有了这个设置, 可以通过对你的 `Podfile` 调用 `pod install` 来同步 Xcode 项目和Kotlin Pod 依赖项.
3. 指定 Pod 库的部署目标(deployment target)最小版本.
    > 如果不指定部署目标最小版本, 而依赖的 Pod 需要更高的部署目标, 那么会发生错误.
    {:.note}

    ```kotlin
    kotlin {
        ios()

        cocoapods {
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "13.5"
            pod("AFNetworking") {
                version = "~> 4.0.0"
            }
            podfile = project.file("../ios-app/Podfile")
        }
    }
    ```

4. 将 Xcode 项目中想要包含的 Kotlin Pod 的名称和路径, 添加到 `Podfile`中.

    ```ruby
    use_frameworks!

    platform :ios, '13.5'

    target 'ios-app' do
        pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

5. 重新导入项目.

### 添加 Kotlin Pod 与多个编译目标的 Xcode 项目之间的依赖项

1. 如果还没有, 首先请创建带 `Podfile` 的 Xcode 项目.
2. 在 Kotlin 项目的 `build.gradle.kts` (`build.gradle`) 脚本中, 使用 `podfile = project.file(..)`,
   添加 Xcode 项目 `Podfile` 的路径.
   有了这个设置, 可以通过对你的 `Podfile` 调用 `pod install` 来同步 Xcode 项目和Kotlin Pod 依赖项.
3. 使用 `pod()`, 添加你的项目中想要使用的 Pod 库依赖项.
4. 对每个编译目标, 指定 Pod 库的部署目标(deployment target)最小版本.
    > 如果不指定部署目标最小版本, 而依赖的 Pod 需要更高的部署目标, 那么会发生错误.
    {:.note}

    ```kotlin
    kotlin {
        ios()
        tvos()

        cocoapods {
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "13.5"
            tvos.deploymentTarget = "13.4"

            pod("AFNetworking") {
                version = "~> 4.0.0"
            }
            podfile = project.file("../severalTargetsXcodeProject/Podfile") // 指定 Podfile 路径
        }
    }
    ```

5. 将 Xcode 项目中想要包含的 Kotlin Pod 的名称和路径, 添加到 `Podfile`中.

    ```ruby
    target 'iosApp' do
      use_frameworks!
      platform :ios, '13.5'
      # Pods for iosApp
      pod 'kotlin_library', :path => '../kotlin-library'
    end

    target 'TVosApp' do
      use_frameworks!
      platform :tvos, '13.4'

      # Pods for TVosApp
      pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

6. 重新导入项目.

示例项目参见 [这里](https://github.com/Kotlin/kmm-with-cocoapods-multitarget-xcode-sample).
