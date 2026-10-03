[//]: # (title: CocoaPods 概述与设置)

<tldr>
   这是一种本地集成方法. 适用于以下情况:<br/>

* 你有一个单一的代码仓库, 包含使用 CocoaPods 的 iOS 项目.
* 你的 Kotlin Multiplatform 项目存在 CocoaPods 依赖项.<br/>

[选择最适合你的集成方法](multiplatform-ios-integration-overview.md)
</tldr>

Kotlin/Native 提供了与 [CocoaPods 依赖管理器](https://cocoapods.org/) 的集成功能.
你可以添加对 Pod 库的依赖项, 也可以使用 Kotlin 项目作为 CocoaPods 依赖项.

> CocoaPods 集成方案,
> 不能与 [直接集成](multiplatform-direct-integration.md) 所使用的 `embedAndSignAppleFrameworkForXcode` 机制共同使用.
>
{style="warning"}

可以直接在 IntelliJ IDEA 或 Android Studio 中管理 Pod 依赖项, 并使用所有额外的功能特性, 比如代码高亮度和代码自动完成.
可以使用 Gradle 来构建整个 Kotlin 项目, 而不必切换到 Xcode.

只有在你想要修改 Swift/Objective-C 代码, 或在 Apple 模拟器或设备上运行应用程序时, 才需要使用 Xcode.
要与 Xcode 协同工作, 首先请 [更新你的 Podfile](#update-podfile-for-xcode).

## 设置 CocoaPods 环境 {id="set-up-an-environment-to-work-with-cocoapods"}

使用你选择的安装工具, 安装 [CocoaPods 依赖项管理器](https://cocoapods.org/):

<tabs>
<tab title="RVM">

1. 如果你还没有, 请先安装 [RVM (Ruby 版本管理器)](https://rvm.io/rvm/install).
2. 安装 Ruby. 你可以选择特定的版本:

    ```bash
    rvm install ruby %rubyVersion%
    ```

3. 安装 CocoaPods:

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</tab>
<tab title="Rbenv">

1. 如果你还没有, 请先从 GitHub 安装 [rbenv](https://github.com/rbenv/rbenv#installation).
2. 安装 Ruby. 你可以选择特定的版本:

    ```bash
    rbenv install %rubyVersion%
    ```

3. 对某个目录设置局部的 Ruby 版本, 或对整个机器设置全局的 Ruby 版本:

    ```bash
    rbenv global %rubyVersion%
    ```

4. 安装 CocoaPods:

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</tab>
<tab title="默认的 Ruby">

> 这种安装方法不能用于使用 Apple M 芯片的设备. 请使用其他工具来设置 CocoaPods 工作环境.
>
{style="note"}

你可以使用 macOS 上默认的 Ruby 来安装 CocoaPods 依赖管理器:

```bash
sudo gem install cocoapods
```

</tab>
<tab title="Homebrew">

> 使用 Homebrew 安装 CocoaPods 可能出现兼容性问题.
>
> 在安装 CocoaPods 时, Homebrew 也会安装与 Xcode 联合工作时所需要的 [Xcodeproj](https://github.com/CocoaPods/Xcodeproj) gem.
> 但是, 它不能通过 Homebrew 来更新, 而且, 如果安装的 Xcodeproj 还不支持最新的 Xcode 版本, 那么你会在安装 Pod 时出现错误.
> 如果发生这样的情况, 请试用其他工具来安装 CocoaPods.
>
{style="warning"}

1. 如果你还没有, 请先安装 [Homebrew](https://brew.sh/).
2. 安装 CocoaPods:

    ```bash
    brew install cocoapods
    ```

</tab>
</tabs>

如果你在安装过程中遇到问题, 请参见 [可能发生的问题与解决方案](#possible-issues-and-solutions) 小节.

## 创建项目 {id="create-a-project"}

CocoaPods 环境设置完成后, 你可以配置你的 Kotlin Multiplatform 项目来使用 Pod.
以下步骤演示如何在一个新生成的项目中进行配置:

1. 使用 [Kotlin Multiplatform IDE plugin](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)
   或 [Kotlin Multiplatform Web 向导](https://kmp.jetbrains.com), 为 Android 和 iOS 生成一个新项目.
   如果使用 Web 向导, 请解开下载的压缩包, 并在你的 IDE 中导入项目.
2. 将 Kotlin CocoaPods Gradle plugin 添加到版本目录(Version Catalog)
   (`gradle/libs.versions.toml` 文件):

   ```toml
   [plugins]
   kotlinCocoapods = { id = "org.jetbrains.kotlin.native.cocoapods", version.ref = "kotlin" }
   ```

3. 找到你的项目根目录中的 `build.gradle.kts` 文件, 向 `plugins {}` 代码块添加以下别名:

   ```kotlin
   alias(libs.plugins.kotlinCocoapods) apply false
   ```

4. 打开你想要集成 CocoaPods 的模块, 例如 `sharedLogic` 模块, 向 `build.gradle.kts` 文件的 `plugins {}` 代码块添加以下别名:

   ```kotlin
   alias(libs.plugins.kotlinCocoapods)
   ```

现在你就可以 [在你的 Kotlin Multiplatform 项目中配置 CocoaPods](#configure-the-project).

## 配置项目 {id="configure-the-project"}

要在你的跨平台项目中配置 Kotlin CocoaPods Gradle plugin, 请执行以下步骤:

1. 在你的项目的共用模块的 `build.gradle(.kts)` 文件中, 应用 CocoaPods 插件和 Kotlin Multiplatform 插件.

   > 如果你的项目是 [使用 IDE plugin 或 Web 向导](#create-a-project) 创建的, 那么请跳过这一步.
   >
   {style="note"}

    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
    ```

2. 在 `cocoapods` 代码段中, 配置 Podspec 文件的 `version`, `summary`, `homepage`, 和 `baseName`.

    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }

    kotlin {
        cocoapods {
            // 必须属性
            // 在这里指定需要的 Pod 版本
            // 否则, 会使用 Gradle 项目的版本
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
                // 对下面这行取消注释, 并指定另一个项目模块(如果有):
                // export(project(":<你的其它 KMP 模块>"))
                transitiveExport = false // 这是默认值.
            }

            // 将自定义的 Xcode 配置对应到 NativeBuildType
            xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
            xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
        }
    }
    ```

    > Kotlin DSL 的完整语法请参见 [Kotlin Gradle plugin 代码仓库](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt).
    >
    {style="note"}

3. 在 IntelliJ IDEA 中, 运行 **Build** | **Reload All Gradle Projects**
   (如果是 Android Studio, 请运行 **File** | **Sync Project with Gradle Files**),
   重新导入项目.

4. 生成 [Gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html), 以免在 Xcode 构建时发生兼容性问题.

应用 CocoaPods 插件后, 它会完成如下工作:

* 对所有的 macOS, iOS, tvOS, 和 watchOS 编译目标, 将 `debug` 和 `release` 框架添加为输出的二进制文件.
* 创建 `podspec` 任务, 它会为项目生成一个 [Podspec](https://guides.cocoapods.org/syntax/podspec.html) 文件.

`Podspec` 文件包含输出框架的路径, 以及一段脚本, 负责在 Xcode 项目的构建过程中, 自动构建这个框架.

## 为 Xcode 更新 Podfile 文件 {id="update-podfile-for-xcode"}

如果要将你的 Kotlin 项目导入到一个 Xcode 项目中, 请执行以下步骤:

1. 在你的 Kotlin 项目的 iOS 部分, 修改 Podfile:

   * 如果你的项目存在任何 Git, HTTP, 或 自定义 Podspec 仓库的依赖项, 需要在 Podfile 中指定 Podspec 的路径.

     例如, 如果添加了 `podspecWithFilesExample` 的依赖, 需要在 Podfile 文件中声明 Podspec 路径:

     ```ruby
     target 'ios-app' do
         # ... 其他依赖项 ...
         pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample'
     end
     ```

     `:path` 应该包含 Pod 的文件路径.

   * 如果添加一个来自自定义 Podspec 仓库的库, 需要在 Podfile 文件的最开始指定 spec 的 [位置](https://guides.cocoapods.org/syntax/podfile.html#source):

     ```ruby
     source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

     target 'kotlin-cocoapods-xcproj' do
         # ... 其他依赖项 ...
         pod 'example'
     end
     ```

2. 在你的项目目录中运行 `pod install`.

   当你第一次运行 `pod install` 时, 它会创建 `.xcworkspace` 文件.
   这个文件包含你原来的 `.xcodeproj` 和 CocoaPods 项目.
3. 关闭你的 `.xcodeproj`, 改为打开新的 `.xcworkspace` 文件. 这样可以避免项目依赖项的问题.
4. 在 IntelliJ IDEA 中, 运行 **Build** | **Reload All Gradle Projects**
   (如果是 Android Studio, 请运行 **File** | **Sync Project with Gradle Files**),
   重新导入项目.

如果不在 Podfile 文件中进行这些修改, `podInstall` 任务将会失败, CocoaPods plugin 会在 log 中显示错误消息.

## 可能发生的问题与解决方案 {id="possible-issues-and-solutions"}

### CocoaPods 安装 {id="cocoapods-installation" initial-collapse-state="collapsed" collapsible="true"}

#### Ruby 安装 {id="ruby-installation"}

CocoaPods 是基于 Ruby 开发的, 你可以使用 macOS 上默认可用的 Ruby 环境来安装它.
Ruby 1.9 或更高版本带有一个内建的 RubyGems 包管理框架, 可以帮助你安装
[CocoaPods 依赖管理器](https://guides.cocoapods.org/using/getting-started.html#installation).

如果你在安装或使用 CocoaPods 时遇到问题,
请参照 [这篇向导文档](https://www.ruby-lang.org/en/documentation/installation/) 来安装 Ruby,
或参照 [RubyGems 网站](https://rubygems.org/pages/download/) 来安装 RubyGems 框架.

#### 版本兼容性 {id="version-compatibility"}

我们推荐使用最新的 Kotlin 版本.
这个 CocoaPods 设置所需要的最低版本为 1.7.0.

### 使用 Xcode 时的构建错误 {id="build-errors-when-using-xcode" initial-collapse-state="collapsed" collapsible="true"}

CocoaPods 的某些安装变体可能在 Xcode 中导致构建错误.
一般来说, Kotlin Gradle plugin 会在 `PATH` 中寻找 `pod` 可执行文件, 但由于你的环境设置不同, 可能会出现问题.

要明确设置 CocoaPods 的安装路径, 你可以将它手动添加到你的项目的 `local.properties` 文件,
或者执行一个 shell 命令:

* 如果你使用代码编辑器, 请向 `local.properties` 文件添加以下内容:

    ```properties
    kotlin.apple.cocoapods.bin=/Users/Jane.Doe/.rbenv/shims/pod
    ```

* 如果你使用终端, 请运行以下命令:

    ```shell
    echo -e "kotlin.apple.cocoapods.bin=$(which pod)" >> local.properties
    ```

### 找不到模块或框架 {id="module-or-framework-not-found" initial-collapse-state="collapsed" collapsible="true"}

在安装 Pod 时, 你可能会遇到 `module 'SomeSDK' not found` 或 `framework 'SomeFramework' not found`
错误, 这是 [与 C 代码交互](native-c-interop.md) 相关的问题.
要解决这个错误, 请使用以下方法:

#### 更新包 {id="update-packages"}

更新你的安装工具, 和已安装的包(gem):

<tabs>
<tab title="RVM">

1. 更新 RVM:

   ```bash
   rvm get stable
   ```

2. 更新 Ruby 的包管理器, RubyGems:

    ```bash
    gem update --system
    ```

3. 将所有已安装的 gem 升级到最新版本:

    ```bash
    gem update
    ```

</tab>
<tab title="Rbenv">

1. 更新 Rbenv:

    ```bash
    cd ~/.rbenv
    git pull
    ```

2. 更新 Ruby 的包管理器, RubyGems:

    ```bash
    gem update --system
    ```

3. 将所有已安装的 gem 升级到最新版本:

    ```bash
    gem update
    ```

</tab>
<tab title="Homebrew">

1. 更新 Homebrew 包管理器:

   ```bash
   brew update
   ```

2. 将所有已安装的包升级到最新版本:

   ```bash
   brew upgrade
   ````

</tab>
</tabs>

#### 指定框架名称 {id="specify-the-framework-name"}

1. 在下载的 Pod 目录 `[shared_module_name]/build/cocoapods/synthetic/IOS/Pods/...` 中找到 `module.modulemap` 文件:

2. 检查模块内的框架名称, 比如 `SDWebImageMapKit {}`.
   如果框架名称与 Pod 名称不匹配, 请明确指定它:

    ```kotlin
    pod("SDWebImage/MapKit") {
        moduleName = "SDWebImageMapKit"
    }
    ```

#### 指定头文件 {id="specify-headers"}

如果在生成的 `.def` 文件中 Pod 没有包含 `.modulemap` 文件, 比如 `pod("NearbyMessages")`,
请明确的指定 main 头文件:

```kotlin
pod("NearbyMessages") {
    version = "1.1.1"
    headers = "GNSMessages.h"
}
```

详情请参见 [CocoaPods 文档](https://guides.cocoapods.org/).
如果尝试过以上方法后, 仍然发生这个错误, 请到 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 报告问题.

### 应用程序 bundle 中资源丢失 {id="missing-resources-in-the-app-bundle" initial-collapse-state="collapsed" collapsible="true"}

如果你的 iOS App 构建成功, 但在启动时崩溃, 或者最终的 `.ipa` 包中丢失了自定义字体和图片等资源,
这可能是 Pod 与你的项目的集成方式存在问题.

**如何防止问题发生**: 不要直接运行 `pod install` 命令,
改为使用 Kotlin CocoaPods Gradle plugin 提供的 Gradle `podInstall` task.
这个 task 会为你创建需要的目录, 并完成所有配置:

```bash
./gradlew podInstall
open iosApp/iosApp.xcworkspace
```

**问题发生的原因**: 当你在一个全新的项目上运行原生的 `pod install` 命令时
(例如, 在克隆代码仓库之后, 或在 CI/CD 管道中工作时),
资源目录还没有创建.
Compose Multiplatform Gradle plugin 在生成的 `.podspec` 文件中指定了资源的位置:
`spec.resources = ['build/compose/cocoapods/compose-resources']`,
但这个路径只有在构建之后才会存在.
因此, CocoaPods 会忽略不存在的目录, 并在没有这些资源的情况下配置 Xcode 项目.
当项目构建完成并生成资源时, Xcode 不会将它们复制到最终的 bundle 中.

### 同步错误 {id="rsync-error" initial-collapse-state="collapsed" collapsible="true"}

你可能会遇到 `rsync error: some files could not be transferred` 错误.
这是一个 [已知的问题](https://github.com/CocoaPods/CocoaPods/issues/11946),
如果 Xcode 中的应用程序编译目标启用了用户脚本的沙箱功能(sandboxing), 就会发生这个错误.

要解决这个问题:

1. 在应用程序目标设定中禁用用户脚本的沙箱功能:

   ![禁用 CocoaPods 沙箱功能](disable-sandboxing-cocoapods.png){width=700}

2. 停止可能已经启用了沙箱功能的 Gradle daemon 进程:

    ```shell
    ./gradlew --stop
    ```

## 下一步做什么 {id="what-s-next"}

* [在你的 Kotlin 项目中添加 Pod 库的依赖项](multiplatform-cocoapods-libraries.md)
* [设置 Kotlin 项目和 Xcode 项目之间的依赖项](multiplatform-cocoapods-xcode.md)
* [阅读完整的 CocoaPods Gradle plugin DSL 参考文档](multiplatform-cocoapods-dsl-reference.md)
