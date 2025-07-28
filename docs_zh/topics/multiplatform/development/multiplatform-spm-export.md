[//]: # (title: Swift 包导出的设置)

<tldr>
   这是一种远程集成方法. 适用于以下情况:<br/>

* 你想要将你的最终应用程序代码库和共通代码库分离.
* 你已经在本地机器上设置了 Kotlin Multiplatform 项目, 目标平台是 iOS.
* 你在 iOS 项目中使用 Swift 包管理器处理依赖项.<br/>

[选择最适合你的集成方法](multiplatform-ios-integration-overview.md)
</tldr>

你可以将 Kotlin/Native 对 Apple 编译目标的输出, 设置为可以作为 Swift 包管理器 (Swift Package Manager, SPM) 依赖项来使用.

例如, 有一个 Kotlin Multiplatform 项目, 带有 iOS 编译目标.
你可能想要让这个 iOS 二进制文件, 可以在 iOS 开发者的原生 Swift 项目中作为依赖项使用.
使用 Kotlin Multiplatform 工具, 你可以提供一个 artifact, 能够与他们的 Xcode 项目无缝的集成.

本教程演示如何使用 Kotlin Gradle plugin 构建 [XCFrameworks](multiplatform-build-native-binaries.md#build-xcframeworks) 来实现这样的功能.

## 设置远程集成

要让你的框架可供别人使用, 你需要上传 2 个文件:

* 一个包含 XCFramework 的 ZIP 包. 你需要将它上传到一个能够直接访问的便利的文件存储器(例如,
  创建一个 GitHub 发布, 包含这个 archive, 使用 Amazon S3 或 Maven).
  请选择最容易与你的工作流程集成的方案.
* 描述包的 `Package.swift` 文件. 你需要将它推送到一个单独的 Git 仓库.

#### 项目配置选项 {initial-collapse-state="collapsed" collapsible="true"}

在本教程中, 你会将你的 XCFramework 作为一个二进制文件, 存储到你的喜欢的文件存储器中,
并将 `Package.swift` 文件存储到一个单独的 Git 仓库中.

但是, 你可以以不同的方式配置你的项目. 请考虑以下几种 Git 仓库组织方案:

* 将 `Package.swift` 文件和需要打包进入 XCFramework 的代码保存到不同的 Git 仓库中.
  这样可以对 Swift manifest 和文件描述的项目使用不同的版本控制.
  这是我们推荐的方案: 它能够扩展, 而且通常更易于维护.
* 将 `Package.swift` 文件和你的 Kotlin Multiplatform 代码放在一起.
  这是更加直接的方案, 但请注意, 在这种情况下, Swift 包和代码将使用相同的版本.
  SPM 使用 Git tag 来确定包的版本, 可以与你的项目使用的 tag 发生冲突.
* 将 `Package.swift` 文件放在消费者项目的仓库中.
  这种方法有助于避免版本控制和维护方面的问题.
  但是, 这种方法可能导致消费者项目中与多仓库 SPM 设置的问题, 以及进一步自动化的问题:

  * 在一个包含多个包的项目中, 只有一个消费者包可以依赖外部模块 (以避免项目内的依赖项冲突).
    因此, 依赖于你的 Kotlin Multiplatform 模块的全部逻辑 都应该封装在一个特定的消费者包中.
  * 如果你使用自动化的 CI 过程来发布 Kotlin Multiplatform 项目, 这个 CI 过程需要包括将更新后的 `Package.swift` 文件发布到消费者仓库.
    这可能导致发生消费者仓库更新冲突, 因此 CI 中的这个阶段可能会难以维护.

### 配置你的跨平台项目

在下面的示例中, Kotlin Multiplatform 项目中的共用的代码保存在本地的 `shared` 模块中.
如果你的项目结构不同, 请将示例代码中的 "shared" 和示例路径替换为你的模块的名称.

要设置 XCFramework 的发布, 请执行下面的步骤:

1. 更新你的 `shared/build.gradle.kts` 配置文件, 在 iOS 编译目标列表中添加 `XCFramework` 调用:

   ```kotlin
   import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework
   
   kotlin {
       // 其他 Kotlin Multiplatform 编译目标
       // ...
       // 要在消费者项目中导入的模块名称
       val xcframeworkName = "Shared"
       val xcf = XCFramework(xcframeworkName)

       listOf(
           iosX64(),
           iosArm64(),
           iosSimulatorArm64(),
       ).forEach { 
           it.binaries.framework {
               baseName = xcframeworkName

               // 指定 CFBundleIdentifier, 为框架指定唯一标识
               binaryOption("bundleId", "org.example.${xcframeworkName}")
               xcf.add(this)
               isStatic = true
           }
       }
       //...
   }
   ```
   
2. 运行 Gradle task, 创建框架:

   ```shell
   ./gradlew :shared:assembleSharedXCFramework
   ```

   产生的框架将被创建为你的项目目录中的 `shared/build/XCFrameworks/release/Shared.xcframework` 文件夹.

   > 如果你使用 Compose Multiplatform 项目, 请使用下面的 Gradle task:
   >
   > ```shell
   > ./gradlew :composeApp:assembleSharedXCFramework
   > ```
   >
   > 你可以在 `composeApp/build/XCFrameworks/release/Shared.xcframework` 文件夹中找到产生的框架.
   >
   {style="tip"}

### 准备 XCFramework 和 Swift 包 manifest {id="prepare-the-xcframework-and-the-swift-package-manifest"}

1. 将 `Shared.xcframework` 文件夹压缩为一个 ZIP 文件, 并计算 ZIP 包的校验和, 例如:

   `swift package compute-checksum Shared.xcframework.zip`

2. 将 ZIP 文件 上传到你选择的文件存储器. 文件应该能够通过一个直接链接访问.
   例如, 你可以在 GitHub 中使用 releases 这样做:
   
   <deflist collapsible="true">
       <def title="上传到一个 GitHub release">
           <list type="decimal">
               <li>进入 <a href="https://github.com">GitHub</a>, 并登录到你的帐号.</li>
               <li>进入你想要创建 release 的仓库.</li>
               <li>在页面右侧的 <b>Releases</b> 节, 点击 <b>Create a new release</b> 链接.</li>
               <li>填写 release 信息, 添加或者创建一个新的 tag, 指定 release 标题, 并输入一段描述.</li>
               <li>
                   <p>通过页面下方的 <b>Attach binaries by dropping them here or selecting them</b> 栏目, 上传包含 XCFramework 的 ZIP 文件:</p>
                   <img src="github-release-description.png" alt="Fill in the release information" width="700"/>
               </li>
               <li>点击 <b>Publish release</b>.</li>
               <li>
                   <p>在 release 的 <b>Assets</b> 节之下 , 在 ZIP 文件上点击鼠标右键, 并在你的浏览器中选择 <b>Copy link address</b> 或类似的选项:</p>
                   <img src="github-release-link.png" alt="Copy the link to the uploaded 文件" width="500"/>
               </li>
         </list>
       </def>
   </deflist>

3. [推荐] 检查链接正确工作, 文件可以下载. 在终端窗口, 运行以下命令:

    ```none
    curl <上传的 XCFramework ZIP 文件的下载链接>
    ```

4. 选择任何目录, 并在本地创建一个 `Package.swift` 文件, 包含以下代码:

   ```Swift
   // swift-tools-version:5.3
   import PackageDescription

   let package = Package(
      name: "Shared",
      platforms: [
        .iOS(.v14),
      ],
      products: [
         .library(name: "Shared", targets: ["Shared"])
      ],
      targets: [
         .binaryTarget(
            name: "Shared",
            url: "<上传的 XCFramework ZIP 文件的链接>",
            checksum:"<对 ZIP 文件计算的校验和>")
      ]
   )
   ```
   
5. 在 `url` 栏中, 指定你的包含 XCFramework 的 ZIP 包的链接.
6. [推荐] 要验证生成的 manifest, 你可以在 `Package.swift` 文件所在目录运行以下 shell 命令:

    ```shell
    swift package reset && swift package show-dependencies --format json
    ```

    如果 manifest 是正确的, 那么输出信息会显示下载成功, 以及解析结果, 否则会描述发现的错误.

7. 将 `Package.swift` 文件推送到你的远程仓库. 要确保创建并推送一个表示包的语义版本的 Git tag.

### 添加包依赖项

现在这两个文件都可以访问了, 你可以将你创建的包作为依赖项添加到既有的客户端 iOS 项目, 也可以创建新的项目.
要添加包的依赖项, 请执行以下步骤:

1. 在 Xcode 中, 选择 **File | Add Package Dependencies**.
2. 在 search 栏, 输入包含 `Package.swift` 文件的 Git 仓库的 URL:

   ![指定包含包文件的仓库](multiplatform-spm-url.png)

3. 按下 **Add package** 按钮, 然后为包选择产品和对应的编译目标.

   > 如果你在创建 Swift 包, 对话框会和上面不同. 这种情况下, 请按下 **Copy package** 按钮.
   > 这样会将 `.package` 复制到你的剪贴板. 请将这行内容粘贴到你的自己的 `Package.swift` 文件的
   > [Package.Dependency](https://developer.apple.com/documentation/packagedescription/package/dependency) 代码块中,
   > 并向适当的 `Target.Dependency` 代码块添加必要的产品.
   >
   {style="tip"}

### 检查你的设置

要检查设置是否正确, 请在 Xcode 中测试导入:

1. 在你的项目中, 找到你的 UI View 文件, 例如, `ContentView.swift`.
2. 将代码替换为下面的片段:

    ```Swift
    import SwiftUI
    import Shared

    struct ContentView: View {
        var body: some View {
            VStack {
                Image(systemName: "globe")
                    .imageScale(.large)
                    .foregroundStyle(.tint)
                Text("Hello, world! \(Shared.Platform_iosKt.getPlatform().name)")
            }
            .padding()
        }
    }

    #Preview {
        ContentView()
    }
    ```

    这里, 你导入了 `Shared` XCFramework, 然后使用它得到平台名称, 结果放在 `Text` 栏中.

3. 确认预览被更新为新的文本.

## 将多个模块导出为一个 XCFramework

要让多个 Kotlin Multiplatform 模块的代码能够作为一个 iOS 二进制文件使用, 请将这些模块结合为一个总体模块(Umbrella Module).
然后, 构建并导出这个总体模块(Umbrella Module)的 XCFramework.

例如, 你有一个 `network` 模块和一个 `database` 模块, 你将它们结合到一个 `together` 模块:

1. 在 `together/build.gradle.kts` 文件中, 指定依赖项和框架配置:

    ```kotlin
    kotlin {
        val frameworkName = "together"
        val xcf = XCFramework(frameworkName)

        listOf(
            iosX64(),
            iosArm64(),
            iosSimulatorArm64()
        ).forEach { iosTarget ->
            // 这里的设置和上面的示例一样,
            // 增加了对依赖项的 export 调用
            iosTarget.binaries.framework {
                export(projects.network)
                export(projects.database)

                baseName = frameworkName
                xcf.add(this)
            }
        }
    
        // 依赖项设置为 "api" (而不是 "implementation"), 以导出底层模块
        sourceSets {
            commonMain.dependencies {
                api(projects.network)
                api(projects.database)
            }
        }
    }
    ```

2. 应该对每个被包含的模块配置 iOS 编译目标, 例如:

    ```kotlin
    kotlin {
        androidTarget {
            // ...
        }

        iosX64()
        iosArm64()
        iosSimulatorArm64()

        // ...
    }
    ```

3. 在 `together` 文件夹中创建一个空的 Kotlin 文件, 例如, `together/src/commonMain/kotlin/Together.kt`.
   如果导出的模块不包含任何源代码, Gradle 脚本目前不能组装框架, 因此需要这个空文件来绕过这个问题.

4. 运行组装框架的 Gradle Task:

    ```shell
    ./gradlew :together:assembleTogetherReleaseXCFramework
    ```

5. 按照前面的 [小节](#prepare-the-xcframework-and-the-swift-package-manifest) 中的步骤准备好 `together.xcframework`:
   打包, 计算校验和, 将打包的 XCFramework 上传到文件存储, 创建并推送一个 `Package.swift` 文件.

现在, 你可以将依赖项导入到 Xcode 项目.
在添加 `import together` 指令之后, 你就可以在 Swift 代码中导入来自 `network`块和 `database` 模块类了.
