---
type: doc
layout: reference
category: "Native"
title: "与 CocoaPods 集成"
---


# 与 CocoaPods 集成

Kotlin/Native 提供了与 [CocoaPods 依赖管理器](https://cocoapods.org/) 的集成功能.
你可以添加对 Pod 库的依赖项, 这些 Pod 库可以保存在 CocoaPods 仓库中, 也可以在本地仓库中,
也可以使用跨平台项目的原生编译目标作为 CocoaPods 依赖项(Kotlin Pod).

可以直接在 IntelliJ IDEA 中管理 Pod 依赖项, 并使用所有额外的功能特性, 比如代码高亮度和代码自动完成.
可以使用 Gradle 来构建整个 Kotlin 项目, 而不必切换到 Xcode.
只有在需要编写 Swift/Objective-C 代码, 或在模拟器或设备上运行应用程序时, 才需要使用 Xcode.

根据你的项目和目的不同, 可以添加以下依赖项目:
* [Kotlin 项目对 CocoaPods 仓库中的 Pod 库的依赖](#add-a-dependency-on-a-pod-library-from-the-cocoapods-repository)
* [Kotlin 项目对保存在本地的 Pod 库的依赖](#add-a-dependency-on-a-pod-library-stored-locally)
* [Kotlin Pod 与单个编译目标的 Xcode 项目之间的依赖](#add-a-dependency-between-a-kotlin-pod-and-xcode-project-with-one-target)
或 [Kotlin Pod 与多个编译目标的 Xcode 项目之间的依赖](#add-a-dependency-between-a-kotlin-pod-with-an-xcode-project-with-several-targets)

> 也可以添加 Kotlin Pod 对多个 Xcode 项目的依赖.
  但是这种情况下需要对每个 Xcode 项目手动调用 `pod install` 来添加依赖项.
  其他情况下是会自动调用的.
{:.note}

## 安装 CocoaPods 依赖项管理器和插件

1. 安装 [CocoaPods 依赖项管理器](https://cocoapods.org/).

    <div class="sample" markdown="1" theme="idea" mode="ruby" data-highlight-only>

    ```ruby
    $ sudo gem install cocoapods
    ```

    </div>

2. 安装 [`cocoapods-generate`](https://github.com/square/cocoapods-generate) 插件.

    <div class="sample" markdown="1" theme="idea" mode="ruby" data-highlight-only>

    ```ruby
    $ sudo gem install cocoapods-generate
    ```

    </div>

3. 在 IDEA 项目的 `build.gradle.kts` (或 `build.gradle`) 文件中, 应用 CocoaPods 插件和 Kotlin Multiplatform 插件.

    <div class="sample" markdown="1" theme="idea" data-highlight-only>

    ```kotlin
    plugins {
       kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
       kotlin("native.cocoapods") version "{{ site.data.releases.latest.version }}"
    }
    ```

    </div>

4. 在 `cocoapods` 代码段中, 配置 `Podspec` 文件的 `summary`, `homepage`, 和 `frameworkName`.
   这里的 `version` 是 Gradle 项目的版本.

    <div class="sample" markdown="1" theme="idea" data-highlight-only>

    ```kotlin
    plugins {
        kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
        kotlin("native.cocoapods") version "{{ site.data.releases.latest.version }}"
    }

    // CocoaPods 需要对 podspec 指定版本.
    version = "1.0"

    kotlin {
        cocoapods {
            // 配置 CocoaPods 需要的项目.
            summary = "Some description for a Kotlin/Native module"
            homepage = "Link to a Kotlin/Native module homepage"

            // 可以修改输出的框架名称.
            // 默认名称是 Gradle 项目名称.
            frameworkName = "my_framework"
        }
    }
    ```

    </div>

5. 重新导入项目.

应用 CocoaPods 插件后, 它会完成如下工作:

* 对所有的 macOS, iOS, tvOS, 和 watchOS 编译目标, 将 `debug` 和 `release` 框架添加为输出的二进制文件.
* 创建 `podspec` 任务, 它会为项目生成一个 [Podspec](https://guides.cocoapods.org/syntax/podspec.html) 文件.

`Podspec` 文件包含输出框架的路径, 以及一段脚本, 负责在 Xcode 项目的构建过程中, 自动构建这个框架.

## 添加 Pod 库的依赖项

可以添加 Kotlin 项目对 Pod 库的依赖项,
Pod 库可以 [保存在 CocoaPods 仓库中](#add-a-dependency-on-a-pod-library-from-the-cocoapods-repository),
也可以 [保存在本地](#add-a-dependency-on-a-pod-library-stored-locally).

[完成初始配置](#install-the-cocoapods-dependency-manager-and-plugin),
然后, 在添加新的依赖项之后, 在 IntelliJ IDEA 并重新导入项目;
新的依赖项会被自动添加进来. 不需要更多步骤.

### 添加 CocoaPods 仓库中的 Pod 库的依赖项

1. 在你的项目的 `build.gradle.kts`(`build.gradle`) 文件中,
   可以使用 `pod()` 来添加 CocoaPods 仓库中的 Pod 库的依赖项.
    > 也可以添加对 subspecs 的依赖项.
    {:.note}                                                                                                                                       

    <div class="sample" markdown="1" theme="idea" data-highlight-only>

    ```kotlin
    kotlin {
        ios()

        cocoapods {
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            pod("AFNetworking", "~> 4.0.0")

            pod("SDWebImage/MapKit")
        }
    }
    ```

    </div>

2. 重新导入项目.

要在 Kotlin 代码中使用这些依赖项, 需要导入 `cocoapods.<library-name>` 包.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import cocoapods.AFNetworking.*
import cocoapods.SDWebImage.*
```

</div>

示例项目参见 [这里](https://github.com/Kotlin/kotlin-with-cocoapods-sample).

### 添加保存在本地的 Pod 库的依赖项

1. 在你的项目的 `build.gradle.kts`(`build.gradle`) 文件中,
可以使用 `pod()` 来添加保存在本地的 Pod 库的依赖项.
通过第 3 个参数, 可以使用 `project.file(..)`, 指定本地 Pod 库的 `Podspec` 的路径.
    > 也可以添加本地 subspecs 的依赖项.
    > `cocoapods` 代码段, 可以同时包含保存在本地的 Pod 库的依赖项, 以及 CocoaPods 仓库的 Pod 库的依赖项.
    {:.note}

    <div class="sample" markdown="1" theme="idea" data-highlight-only>

    ```kotlin
    kotlin {
        ios()

        cocoapods {
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            pod("pod_dependency", "1.0", project.file("../pod_dependency/pod_dependency.podspec"))
            pod("subspec_dependency/Core", "1.0", project.file("../subspec_dependency/subspec_dependency.podspec"))

            pod("AFNetworking", "~> 4.0.0")
            pod("SDWebImage/MapKit")
        }
    }
    ```

    </div>

2. 重新导入项目.

如果要在 Kotlin 代码中使用保存在本地的 Pod 库依赖项, 需要导入相应的包.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
```

</div>

示例项目参见 [这里](https://github.com/Kotlin/kotlin-with-cocoapods-sample).

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
3. 指定 Pod 库的编译目标最小版本.
    > 如果不指定编译目标最小版本, 而依赖项中的 Pod 需要的发布目标版本更高, 你可能会遇到错误.
    {:.note}

    <div class="sample" markdown="1" theme="idea" data-highlight-only>

    ```kotlin
    kotlin {
        ios()

        cocoapods {
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "13.5"
            pod("AFNetworking", "~> 4.0.0")
            podfile = project.file("../ios-app/Podfile")
        }
    }
    ```

    </div>

4. 将 Xcode 项目中想要包含的 Kotlin Pod 的名称和路径, 添加到 `Podfile`中.

    <div class="sample" markdown="1" theme="idea" mode="ruby" data-highlight-only>

    ```ruby
    use_frameworks!

    platform :ios, '9.0'

    target 'ios-app' do
            pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

    </div>

5. 重新导入项目.

### 添加 Kotlin Pod 与多个编译目标的 Xcode 项目之间的依赖项

1. 如果还没有, 首先请创建带 `Podfile` 的 Xcode 项目.
2. 在 Kotlin 项目的 `build.gradle.kts` (`build.gradle`) 脚本中, 使用 `podfile = project.file(..)`,
   添加 Xcode 项目 `Podfile` 的路径.
   有了这个设置, 可以通过对你的 `Podfile` 调用 `pod install` 来同步 Xcode 项目和Kotlin Pod 依赖项.
3. 使用 `pod()`, 添加你的项目中想要使用的 Pod 库依赖项.
4. 对每个编译目标, 指定 Pod 库的编译目标最小版本.

    <div class="sample" markdown="1" theme="idea" data-highlight-only>

    ```kotlin
    kotlin {
        ios()
        tvos()

        cocoapods {
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "13.5"
            tvos.deploymentTarget = "13.4"

            pod("AFNetworking", "~> 4.0.0")
            podfile = project.file("../severalTargetsXcodeProject/Podfile") // 指定 Podfile 路径
        }
    }
    ```

    </div>

5. 将 Xcode 项目中想要包含的 Kotlin Pod 的名称和路径, 添加到 `Podfile`中.

    <div class="sample" markdown="1" theme="idea" mode="ruby" data-highlight-only>

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

    </div>

6. 重新导入项目.

示例项目参见 [这里](https://github.com/Kotlin/multitarget-xcode-with-kotlin-cocoapods-sample).
