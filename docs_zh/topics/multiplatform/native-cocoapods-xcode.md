[//]: # (title: 将 Kotlin Gradle 项目用作 CocoaPods 依赖项)

要将带有 native 编译目标的 Kotlin Multiplatform 项目用作 CocoaPods 的依赖项,
需要 [完成初始配置](native-cocoapods.md#set-up-an-environment-to-work-with-cocoapods).
你可以在 Xcode 项目的 Podfile 中, 通过它的名称和生成的 Podspec 文件的目录路径来包含这样的依赖项.

依赖项将会与项目一起自动构建(以及重构建).
这样的方案可以简化 Kotlin Multiplatform 项目到 Xcode 的导入工作, 因为不再需要编写对应的 Gradle task 和 Xcode 构建步骤.

你可以在 Kotlin Gradle 项目和带有一个或多个编译目标的 Xcode 项目之间添加依赖.
也可以在 Gradle 项目和多个 Xcode 项目之间添加依赖.
但是, 这种情况下, 你需要通过对每个 Xcode 项目调用手动 `pod install` 来添加依赖.
其他情况下, 这个调用可以自动完成.

> * 要将依赖项正确导入到 Kotlin/Native 模块, `Podfile` 必须包含:
>   [`use_modular_headers!`](https://guides.cocoapods.org/syntax/podfile.html#use_modular_headers_bang)
>   或
>   [`use_frameworks!`](https://guides.cocoapods.org/syntax/podfile.html#use_frameworks_bang) 指令.
> * 如果你不指定部署目标(deployment target)最小版本, 而且依赖项 Pod 需要更高的部署目标版本, 那么会发生错误.
>
{style="note"}

## 单个编译目标的 Xcode 项目 {id="xcode-project-with-one-target"}

1. 如果你还没有 Xcode 项目, 请使用 `Podfile` 创建一个.
2. 在应用程序 Target 中, 请确认禁用了 **Build Options** 之下的 **User Script Sandboxing**:

   ![禁用 sandboxing CocoaPods](disable-sandboxing-cocoapods.png)

3. 使用 `podfile = project.file(..)` 向你的 Xcode 项目 `Podfile` 添加路径,
   其中的文件路径是你的 Kotlin 项目的 `build.gradle.kts` (`build.gradle`) 文件路径.
   这个步骤可以通过对你的 `Podfile` 调用 `pod install`, 帮助你的 Xcode 项目与 Gradle 项目依赖项保持同步.
4. 指定 Pod 库的部署目标(deployment target)最小版本.
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

5. 对你在 Xcode 项目中想要包含的 Gradle 项目, 将它的名称和路径添加到 `Podfile`.

    ```ruby
    use_frameworks!

    platform :ios, '16.0'

    target 'ios-app' do
        pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

6. 在你的项目目录中运行 `pod install`.

   在你第一次运行 `pod install` 时, 它会创建 `.xcworkspace` 文件.
   这个文件包含你原来的 `.xcodeproj` 和 CocoaPods 项目.
7. 关闭你的 `.xcodeproj`, 改为打开新的 `.xcworkspace` 文件. 这样你就可以避免项目依赖的问题.
8. 在 IntelliJ IDEA 中, 运行 **Reload All Gradle Projects** (如果是 Android Studio, 请运行 **Sync Project with Gradle Files**),
   重新导入项目.

## 多个编译目标的 Xcode 项目 {id="xcode-project-with-several-targets"}

1. 如果你还没有 Xcode 项目, 请使用 `Podfile` 创建一个.
2. 使用 `podfile = project.file(..)` 向你的 Xcode 项目 `Podfile` 添加路径,
   其中的文件路径是你的 Kotlin 项目的 `build.gradle(.kts)`.
   这个步骤可以通过对你的 `Podfile` 调用 `pod install`, 帮助你的 Xcode 项目与 Gradle 项目依赖项保持同步.
3. 对于你的项目中希望使用的 Pod 库, 使用`pod()` 添加依赖项.
4. 对每个目标, 指定 Pod 库的部署目标(deployment target)最小版本.

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
            podfile = project.file("../severalTargetsXcodeProject/Podfile") // 指定 Podfile 路径
        }
    }
    ```

5. 对你在 Xcode 项目中想要包含的 Gradle 项目, 将它的名称和路径添加到 `Podfile`.

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

6. 在你的项目目录中运行 `pod install`.

   在你第一次运行 `pod install` 时, 它会创建 `.xcworkspace` 文件.
   这个文件包含你原来的 `.xcodeproj` 和 CocoaPods 项目.
7. 关闭你的 `.xcodeproj`, 改为打开新的 `.xcworkspace` 文件. 这样你就可以避免项目依赖的问题.
8. 在 IntelliJ IDEA 中, 运行 **Reload All Gradle Projects** (如果是 Android Studio, 请运行 **Sync Project with Gradle Files**),
   重新导入项目.

参见 [示例项目](https://github.com/Kotlin/kmm-with-cocoapods-multitarget-xcode-sample).

## 下一步做什么?

阅读 [将框架连接到你的 iOS 项目](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html#connect-the-framework-to-your-ios-project),
学习如何在 Xcode 项目中向构建阶段(build phase)添加自定义的构建脚本.
