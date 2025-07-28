[//]: # (title: 将 Kotlin Gradle 项目用作 CocoaPods 依赖项)

<tldr>

* 在添加 Pod 依赖项之前, 请 [完成初始配置](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods).
* 示例项目请参见我们的 [GitHub 代码仓库](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample).

</tldr>

你可以使用整个 Kotlin 项目作为一个 Pod 依赖项.
要做到这一点, 你需要在你的项目的 Podfile 中, 指定它的名称和生成的 Podspec 文件的目录路径, 来包含这样的依赖项.

依赖项将会与项目一起自动构建(以及重构建).
这样的方案可以简化 Kotlin Multiplatform 项目到 Xcode 的导入工作, 因为不再需要编写对应的 Gradle task 和 Xcode 构建步骤.

你可以在 Kotlin 项目和带有一个或多个编译目标的 Xcode 项目之间添加依赖.
也可以在 Kotlin 项目和多个 Xcode 项目之间添加依赖.
但是, 这种情况下, 你需要对每个 Xcode 项目手动调用 `pod install`.
对于单个的 Xcode 项目, 这个调用可以自动完成.

> * 要将依赖项正确导入到 Kotlin/Native 模块, Podfile 必须包含:
>   [`use_modular_headers!`](https://guides.cocoapods.org/syntax/podfile.html#use_modular_headers_bang)
>   或
>   [`use_frameworks!`](https://guides.cocoapods.org/syntax/podfile.html#use_frameworks_bang) 指令.
> * 如果你不指定部署目标(deployment target)最小版本, 而且依赖项 Pod 需要更高的部署目标版本, 那么会发生错误.
>
{style="note"}

## 单个编译目标的 Xcode 项目 {id="xcode-project-with-one-target"}

要在单个编译目标的 Xcode 项目中使用 Kotlin 项目作为 Pod 依赖项, 请执行以下步骤:

1. 如果你还没有 Xcode 项目, 请创建一个.
2. 在 Xcode 中, 请确认在应用程序 Target 中禁用了 **Build Options** 之下的 **User Script Sandboxing**:

   ![禁用 sandboxing CocoaPods](disable-sandboxing-cocoapods.png)

3. 在你的 Kotlin 项目的 iOS 部分, 创建一个 Podfile.
4. 在共用模块的 `build.gradle(.kts)` 文件中, 使用 `podfile = project.file()`, 添加你的项目的 Podfile 的路径.

   这个步骤可以通过对你的 Podfile 调用 `pod install`, 帮助你的 Xcode 项目与 Kotlin 项目依赖项保持同步.
5. 指定 Pod 库的部署目标(deployment target)最小版本:
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
            podfile = project.file("../ios-app/Podfile")
        }
    }
    ```

6. 在 Podfile 中, 对你在 Xcode 项目中想要包含的 Kotlin 项目, 添加它的名称和路径:

    ```ruby
    target 'ios-app' do
        use_frameworks!
        platform :ios, '16.0'
    
        # Pods for iosApp
        pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

7. 在你的项目目录中运行 `pod install`.

   在你第一次运行 `pod install` 时, 它会创建 `.xcworkspace` 文件.
   这个文件包含你原来的 `.xcodeproj` 和 CocoaPods 项目.
8. 关闭你的 `.xcodeproj`, 改为打开新的 `.xcworkspace` 文件. 这样你就可以避免项目依赖的问题.
9. 在 IntelliJ IDEA 中, 运行 **Build** | **Reload All Gradle Projects**
   (如果是 Android Studio, 请运行 **File** | **Sync Project with Gradle Files**),
   重新导入项目.

## 多个编译目标的 Xcode 项目 {id="xcode-project-with-several-targets"}

要在多个编译目标的 Xcode 项目中使用 Kotlin 项目作为 Pod 依赖项, 请执行以下步骤:

1. 如果你还没有 Xcode 项目, 请创建一个.
2. 在你的 Kotlin 项目的 iOS 部分, 创建一个 Podfile.
3. 在共用模块的 `build.gradle(.kts)` 文件中, 使用 `podfile = project.file()`, 添加你的项目的 Podfile 的路径.

   这个步骤可以通过对你的 Podfile 调用 `pod install`, 帮助你的 Xcode 项目与 Kotlin 项目依赖项保持同步.
4. 对于你的项目中希望使用的 Pod 库, 使用`pod()` 添加依赖项.
5. 对每个目标, 指定 Pod 库的部署目标(deployment target)最小版本:

    ```kotlin
    kotlin {
        iosArm64()
        tvosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"
            tvos.deploymentTarget = "16.0"

            pod("SDWebImage") {
                version = "5.20.0"
            }
            // 指定 Podfile 路径
            podfile = project.file("../severalTargetsXcodeProject/Podfile")
        }
    }
    ```

6. 在 Podfile 中, 对你在 Xcode 项目中想要包含的 Kotlin 项目, 添加它的名称和路径:

    ```ruby
    target 'iosApp' do
        use_frameworks!
        platform :ios, '16.0'

        # Pods for iosApp
        pod 'kotlin_library', :path => '../kotlin-library'
    end

    target 'TVosApp' do
        use_frameworks!
        platform :tvos, '16.0'

        # Pods for TVosApp
        pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

7. 在你的项目目录中运行 `pod install`.

   在你第一次运行 `pod install` 时, 它会创建 `.xcworkspace` 文件.
   这个文件包含你原来的 `.xcodeproj` 和 CocoaPods 项目.
8. 关闭你的 `.xcodeproj`, 改为打开新的 `.xcworkspace` 文件. 这样你就可以避免项目依赖的问题.
9. 在 IntelliJ IDEA 中, 运行 **Build** | **Reload All Gradle Projects**
   (如果是 Android Studio, 请运行 **File** | **Sync Project with Gradle Files**),
   重新导入项目.

## 下一步做什么 {id="what-s-next"}

* [在你的 Kotlin 项目中添加 Pod 库的依赖项](multiplatform-cocoapods-libraries.md)
* [阅读如何将框架连接到你的 iOS 项目](multiplatform-direct-integration.md)
* [阅读完整的 CocoaPods Gradle plugin DSL 参考文档](multiplatform-cocoapods-dsl-reference.md)
