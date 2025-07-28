[//]: # (title: 在本地 Swift 包中使用 Kotlin)

<tldr>
   这是一种本地集成方法. 适用于以下情况:<br/>

   * 你有一个 iOS App, 它使用本地 SPM 模块.
   * 你已经设置了一个 Kotlin Multiplatform 项目, 编译目标是你的本地机器上的 iOS.
   * 你的既有的 iOS 项目使用静态链接类型.<br/>

   [选择最适合你的集成方法](multiplatform-ios-integration-overview.md)
</tldr>

在本教程中, 你将学习如何使用 Swift 包管理器(Swift Package Manager, SPM),
将一个来自 Kotlin Multiplatform 项目的 Kotlin Framework 集成到一个本地包中.

![直接集成图](direct-integration-scheme.svg){width=700}

要设置集成, 你需要添加一段特定的脚本, 将 `embedAndSignAppleFrameworkForXcode` Gradle Task 设置为你的项目的构建设置中的预先操作.
要让共通代码中的修改反应到你的 Xcode 项目中, 你只需要重新构建 Kotlin Multiplatform 项目.

通常的直接集成方法需要向构建阶段添加脚本, 并且要求重新构建 Kotlin Multiplatform 和 iOS 项目,
才能看到共通代码中的修改,
与通常的直接集成方法相比, 通过这种本地集成方式, 你可以很容易的在本地 Swift 包中使用 Kotlin 代码.

> 如果你不熟悉 Kotlin Multiplatform, 请先学习如何 [设置环境](https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html)
> 和 [从头创建一个跨平台应用程序](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html).
>
{style="tip"}

## 设置项目

这个功能从 Kotlin 2.0.0 开始可用.

> 要查看 Kotlin 的版本, 请打开你的 Kotlin Multiplatform 项目根目录中的 `build.gradle(.kts)` 文件.
> 你可以在文件最上方的 `plugins {}` 代码块中看到当前版本.
> 
> 或者, 查看 `gradle/libs.versions.toml` 文件中的版本目录(Version Catalog).
> 
{style="tip"}

本教程假定你的项目在项目构建阶段使用 `embedAndSignAppleFrameworkForXcode` Task 的
[直接集成](multiplatform-direct-integration.md) 方式.
如果你通过 CocoaPods Plugin 或通过使用 `binaryTarget` 的 Swift 包连接到 Kotlin Framework, 请先进行迁移.

### 从 SPM binaryTarget 集成迁移 {initial-collapse-state="collapsed" collapsible="true"}

要从使用 `binaryTarget` 的 SPM 集成迁移:

1. 在 Xcode 中, 使用菜单 **Product** | **Clean Build Folder**,
   或使用快捷键 <shortcut>Cmd + Shift + K</shortcut>, 清空构建目录.
2. 在每个 `Package.swift` 文件中, 删除包含 Kotlin Framework 包的依赖项, 以及对产品的目标依赖项.

### 从 CocoaPods plugin 迁移 {initial-collapse-state="collapsed" collapsible="true"}

> 如果在 `cocoapods {}` 代码块中有对其他 Pod 的依赖项, 你必须采用 CocoaPods 集成方案.
> 目前, 在多模块的 SPM 项目中, 不能同时存在对 Pod 的依赖项和对 Kotlin Framework 的依赖项.
>
{style="warning"}

要从 CocoaPods plugin 迁移:

1. 在 Xcode 中, 使用菜单 **Product** | **Clean Build Folder**,
   或使用快捷键 <shortcut>Cmd + Shift + K</shortcut>, 清空构建目录.
2. 在 Podfile 所在的目录, 运行以下命令:

    ```none
   pod deintegrate
   ```

3. 从你的 `build.gradle(.kts)` 文件删除 `cocoapods {}` 代码块.
4. 删除 `.podspec` 文件和 Podfile.

## 将框架连接到你的项目

> 目前不支持集成到 `swift build`.
>
{style="note"}

要在本地 Swift 包中使用 Kotlin 代码 , 需要将从跨平台项目生成的 Kotlin Framework 连接到你的 Xcode 项目:

1. 在 Xcode 中, 选择 **Product** | **Scheme** | **Edit scheme**,
   或点击上方工具栏中的 scheme 图标, 并选择 **Edit scheme**:

   ![编辑 scheme](xcode-edit-schemes.png){width=700}

2. 选择 **Build** | **Pre-actions**, 然后点击 **+** | **New Run Script Action**:

   ![New run script action](xcode-new-run-script-action.png){width=700}

3. 修改下面的脚本, 并添加为一个 action:

   ```bash
   cd "<跨平台项目的根目录路径>"
   ./gradlew :<共用的模块名称>:embedAndSignAppleFrameworkForXcode
   ```

   * 在 `cd` 命令中, 指定你的 Kotlin Multiplatform 项目的根目录路径, 例如, `$SRCROOT/..`.
   * 在 `./gradlew` 命令中, 指定共用的模块名称, 例如, `:shared` or `:composeApp`.
  
4. 在 **Provide build settings from** 中选择你的 App 的 target:

   ![填写 run script action](xcode-filled-run-script-action.png){width=700}

5. 现在, 你可以将共用的模块导入到你的本地 Swift 包, 并使用 Kotlin 代码.

   在 Xcode 中找到你的本地 Swift 包, 定义一个函数, 包含模块的导入, 例如:

   ```Swift
   import Shared

   public func greetingsFromSpmLocalPackage() -> String {
       return Greeting.greet()
   }
   ```

   ![SPM 使用方法](xcode-spm-usage.png){width=700}

6. 在你的 iOS 项目的 `ContentView.swift` 文件中, 现在你可以到入本地包, 使用这个函数:

   ```Swift
   import SwiftUI
   import SpmLocalPackage

   struct ContentView: View {
       var body: some View {
           Vstack {
               Image(systemName: "globe")
                   .imageScale(.large)
                   .foregroundStyle(.tint)
               Text(greetingsFromSpmLocalPackage())
           }
           .padding()
       }
   }

   #Preview {
       ContentView()
   }
   ```

7. 在 Xcode 中构建项目. 如果一切设置正确, 项目将会构建成功.

还有一些问题需要考虑:

* 如果你使用了与默认的 `Debug` 或 `Release` 不同的自定义构建配置, 请在 **Build Settings** 页,
  在 **User-Defined** 之下添加 `KOTLIN_FRAMEWORK_BUILD_TYPE` 设置, 并将它设置为 `Debug` 或 `Release`.
* 如果你遇到与 script sandboxing 相关的错误, 请双击项目名称, 打开 iOS 项目设置,
  然后在 **Build Settings** 页, 禁用 **Build Options** 之下的 **User Script Sandboxing**.

## 下一步做什么

* [选择你的集成方法](multiplatform-ios-integration-overview.md)
* [学习如何设置 Swift 包导出](multiplatform-spm-export.md)
