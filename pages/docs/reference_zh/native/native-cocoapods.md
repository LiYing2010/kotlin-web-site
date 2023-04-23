---
type: doc
layout: reference
category: "Native"
title: "CocoaPods 概述与设置"
---

# CocoaPods 概述与设置

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin/Native 提供了与 [CocoaPods 依赖管理器](https://cocoapods.org/) 的集成功能.
你可以添加对 Pod 库的依赖项, 也可以使用跨平台项目的原生编译目标作为 CocoaPods 依赖项.

可以直接在 IntelliJ IDEA 中管理 Pod 依赖项, 并使用所有额外的功能特性, 比如代码高亮度和代码自动完成.
可以使用 Gradle 来构建整个 Kotlin 项目, 而不必切换到 Xcode.

只有在需要编写 Swift/Objective-C 代码, 或在模拟器或设备上运行应用程序时, 才需要使用 Xcode.
要与 Xcode 正确的协同工作, 你需要 [更新你的 Podfile](#update-podfile-for-xcode).

根据你的项目和目的不同, 可以添加 [Kotlin 项目对 Pod 库的依赖项](native-cocoapods-libraries.html),
以及 [Kotlin Gradle 项目对 Xcode 项目的依赖项](native-cocoapods-xcode.html).

## 设置 CocoaPods 环境

使用你选择的安装工具, 安装 [CocoaPods 依赖项管理器](https://cocoapods.org/):

### RVM

1. 如果你还没有, 请先安装 [RVM (Ruby 版本管理器)](https://rvm.io/rvm/install).
2. 安装 Ruby. 你可以选择特定的版本:

    ```bash
    rvm install ruby 3.0.0
    ```

3. 安装 CocoaPods:

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

### Rbenv

1. 如果你还没有, 请先从 GitHub 安装 [rbenv](https://github.com/rbenv/rbenv#installation).
2. 安装 Ruby. 你可以选择特定的版本:

    ```bash
    rbenv install 3.0.0
    ```
3. 对某个目录设置局部的 Ruby 版本, 或对整个机器设置全局的 Ruby 版本:

    ```bash
    rbenv global 3.0.0
    ```

4. 安装 CocoaPods:

    ```bash
    sudo gem install cocoapods
    ```

### 默认的 Ruby

> 这种安装方法不能用于使用 Apple M 芯片的设备. 请使用其他工具来设置 CocoaPods 工作环境.
{:.note}

你可以使用 macOS 上默认的 Ruby 来安装 CocoaPods 依赖管理器:

```bash
sudo gem install cocoapods
```

### Homebrew

> 使用 Homebrew 安装 CocoaPods 可能出现兼容性问题.
>
> 在安装 CocoaPods 时, Homebrew 也会安装与 Xcode 联合工作时所需要的 [Xcodeproj](https://github.com/CocoaPods/Xcodeproj) gem.
> 但是, 它不能通过 Homebrew 来更新, 而且, 如果安装的 Xcodeproj 还不支持最新的 Xcode 版本, 那么你会在安装 Pod 时出现错误.
> 如果发生这样的情况, 请试用其他工具来安装 CocoaPods.
{:.warning}

1. 如果你还没有, 请先安装 [Homebrew](https://brew.sh/).
2. 安装 Ruby. 你可以选择特定的版本:

    ```bash
    brew install ruby@3.0
    ```

3. 向 `.zshrc` 配置文件添加 `PATH` 的 export 命令:

   ```bash
   echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> /.zshrc
   ```

4. 从这个文件运行 export 命令:

    ```bash
    source .zshrc
    ```

5. 安装 CocoaPods:

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

### 如果你使用 Kotlin 1.7.0 以前的版本
如果你目前的 Kotlin 版本低于 1.7.0, 那么还需要安装 [`cocoapods-generate`](https://github.com/square/cocoapods-generate) 插件:

  ```bash
  sudo gem install -n /usr/local/bin cocoapods-generate
  ```

  > 请注意, `cocoapods-generate` 不能安装在 Ruby 3.0.0 或更高版本上.
  > 如果你使用的是 Ruby 3.0.0 或更高版本, 请降级 Ruby, 或将 Kotlin 升级到 1.7.0 或更高版本.
  {:.note}

如果你在安装过程中遇到问题, 请参见 [可能发生的问题与解决方案](#possible-issues-and-solutions) 小节.

## 添加并配置 Kotlin CocoaPods Gradle plugin

如果你的环境已经正确设置, 你可以 [创建一个新的 Kotlin Multiplatform 项目](../multiplatform-mobile/multiplatform-mobile-create-first-app.html),
并在 iOS framework distribution 选项中, 选择 **CocoaPods Dependency Manager**.
插件会为你自动生成项目.

如果想要手动配置你的项目:

1. 在你的项目的 `build.gradle(.kts)` 文件中, 应用 CocoaPods 插件和 Kotlin Multiplatform 插件:

    ```kotlin
    plugins {
        kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
        kotlin("native.cocoapods") version "{{ site.data.releases.latest.version }}"
    }
    ```

2. 在 `cocoapods` 代码段中, 配置 Podspec 文件的 `version`, `summary`, `homepage`, 和 `baseName`.

    ```kotlin
    plugins {
        kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
        kotlin("native.cocoapods") version "{{ site.data.releases.latest.version }}"
    }

    kotlin {
        cocoapods {
            // 必须属性
            // 在这里指定需要的 Pod 版本. 否则, 会使用 Gradle 项目的版本.
            version = "1.0"
            summary = "Some description for a Kotlin/Native module"
            homepage = "Link to a Kotlin/Native module homepage"

            // 可选属性
            // 在这里配置 Pod 名称, 而不是修改 Gradle 项目名称
            name = "MyCocoaPod"

            framework {
                // 必须属性              
                // 配置框架名称. 'frameworkName' 属性已废弃, 请改为使用这个属性
                baseName = "MyFramework"

                // 可选属性
                // 指定框架的链接类型. 默认为 dynamic. 
                isStatic = false
                // 导出依赖项
                export(project(":anotherKMMModule"))
                transitiveExport = false // 这是默认值.
                // 嵌入 bitcode
                embedBitcode(BITCODE)
            }

            // 将自定义的 Xcode 配置对应到 NativeBuildType
            xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
            xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
        }
    }
    ```

   > Kotlin DSL 的完整语法请参见 [Kotlin Gradle plugin 代码仓库](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt).
   {:.note}

3. 重新导入项目.

4. 生成 [Gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html), 以免在 Xcode 构建时发生兼容性问题.

应用 CocoaPods 插件后, 它会完成如下工作:

* 对所有的 macOS, iOS, tvOS, 和 watchOS 编译目标, 将 `debug` 和 `release` 框架添加为输出的二进制文件.
* 创建 `podspec` 任务, 它会为项目生成一个 [Podspec](https://guides.cocoapods.org/syntax/podspec.html) 文件.

`Podspec` 文件包含输出框架的路径, 以及一段脚本, 负责在 Xcode 项目的构建过程中, 自动构建这个框架.

## 为 Xcode 更新 Podfile 文件

如果要在一个 Xcode 项目中导入你的 Kotlin 项目, 需要修改你的 Podfile 文件:

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

## 可能发生的问题与解决方案

### CocoaPods 安装

#### Ruby 安装

CocoaPods 是基于 Ruby 开发的, 你可以使用 macOS 上默认可用的 Ruby 环境来安装它.
Ruby 1.9 或更高版本带有一个内建的 RubyGems 包管理框架, 可以帮助你安装
[CocoaPods 依赖管理器](https://guides.cocoapods.org/using/getting-started.html#installation).

如果你在安装或使用 CocoaPods 时遇到问题,
请参照 [这篇向导文档](https://www.ruby-lang.org/en/documentation/installation/) 来安装 Ruby,
或参照 [RubyGems 网站](https://rubygems.org/pages/download/) 来安装 RubyGems 框架.

#### 版本兼容性

我们推荐使用最新的 Kotlin 版本. 如果你目前的版本低于 1.7.0, 你还需要安装
[`cocoapods-generate`](https://github.com/square/cocoapods-generate#installation") 插件.

但是, `cocoapods-generate` 不兼容 Ruby 3.0.0 或更高版本.
这种情况下, 请降级 Ruby, 或升级 Kotlin 到 1.7.0 或更高版本.

### 找不到模块

你可能遇到 `module 'SomeSDK' not found` 错误, 这是 [与 C 代码交互](native-c-interop.html) 相关的问题.
请使用以下变通方法解决这个错误:

#### 指定框架名称

1. 在下载的 Pod 目录  `[shared_module_name]/build/cocoapods/synthetic/IOS/Pods/...` 中找到 `module.modulemap` 文件:

2. 检查模块内的框架名称, 比如 `AppsFlyerLib {}`. 如果框架名称与 Pod 名称不匹配, 请明确指定它:

    ```kotlin
    pod("AFNetworking") {
        moduleName = "AppsFlyerLib"
    }
    ```

#### 检查定义文件

如果在生成的 `.def` 文件中 Pod 没有包含 `.modulemap` 文件, 比如 `pod("NearbyMessages")`,
请将带头文件的模块替换为指定 main 头文件:

```kotlin
tasks.named<org.jetbrains.kotlin.gradle.tasks.DefFileTask>("generateDefNearbyMessages").configure {
    doLast {
        outputFile.writeText("""
            language = Objective-C
            headers = GNSMessages.h
        """.trimIndent())
    }
}
```

详情请参见 [CocoaPods 文档](https://guides.cocoapods.org/).
如果尝试过以上方法后, 仍然发生这个错误, 请到 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 报告问题.
