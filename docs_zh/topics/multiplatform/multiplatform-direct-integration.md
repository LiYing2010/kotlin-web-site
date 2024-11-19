[//]: # (title: 直接集成)

如果你想要通过共用代码来同时开发你的 Kotlin Multiplatform 项目和 iOS 项目,
你可以使用一段特别的脚本来设置直接集成.

这段脚本会自动化在 Xcode 中将 Kotlin 框架连接到 iOS 项目的过程:

![直接集成](direct-integration-scheme.svg){width="700"}

这段脚本使用专门为 Xcode 环境设计的 Gradle 任务 `embedAndSignAppleFrameworkForXcode`.
在设置过程中红, 你要将它添加到 iOS App 构建的运行脚本阶段(Run Script Phase).
然后, 在运行 iOS App 构建之前, Kotlin artifact 会构建, 并包含在派生数据中.

一般来说, 这段脚本会:

* 将编译后的 Kotlin 框架复制到 iOS 项目结构的正确目录中.
* 处理内嵌框架的代码签名(code signing)过程.
* 确保 Kotlin 框架中发生变更的代码 Xcode 中的反应到 iOS App 中.

## 如何设置

如果你目前在使用 CocoaPods plugin 来连接你的 Kotlin 框架, 首先请进行迁移.

### 从 CocoaPods plugin 迁移到直接集成 {initial-collapse-state="collapsed" collapsible="true"}

要从 CocoaPods plugin 迁移, 请进行以下步骤:

1. 在 Xcode 中, 使用 **Product** | **Clean Build Folder**,
   或使用 <shortcut>Cmd + Shift + K</shortcut> 快捷键, 清除构建目录.
2. 在 `Podfile` 文件所在的目录中, 运行以下命令:

   ```none
   pod deintegrate
   ```

3. 从你的 `build.gradle(.kts)` 文件中删除 `cocoapods {}` 代码块.
4. 删除 `.podspec` 和 `Podfile` 文件.

### 将框架连接到你的项目

要将从跨平台项目生成的 Kotlin 框架连接到你的 Xcode 项目, 请进行以下步骤:

1. 只有声明过 `binaries.framework` 配置选项, 才会注册 `embedAndSignAppleFrameworkForXcode` task.
   在你的 Kotlin Multiplatform 项目中, 在 `build.gradle.kts` 文件中选择 iOS 编译目标声明.
2. 在 Xcode 中, 双击项目名称, 打开 iOS 项目设置.
3. 在项目设置的 **Build Phases** 页, 点击 **+**, 并选择 **New Run Script Phase**.

   ![添加运行脚本阶段](xcode-run-script-phase-1.png){width=700}

4. 调整下面的脚本, 并复制到运行脚本阶段(Run Script Phase):

   ```bash
   cd "<跨平台项目的根目录路径>"
   ./gradlew :<共用的模块名称>:embedAndSignAppleFrameworkForXcode
   ```

   * 在 `cd` 命令中, 指定你的 Kotlin Multiplatform 项目的根目录路径, 例如, `$SRCROOT/..`.
   * 在 `./gradlew` 命令中, 指定共用的模块名称, 例如, `:shared` 或 `:composeApp`.

   ![Add the script](xcode-run-script-phase-2.png){width=700}

5. 将 **Run Script** 阶段拖动到 **Compile Sources** 阶段之前.

   ![拖动 Run Script 阶段](xcode-run-script-phase-3.png){width=700}

6. 在 **Build Settings** 页, 禁用 **Build Options** 之下的 **User Script Sandboxing** 选项:

   ![User Script Sandboxing](disable-sandboxing-in-xcode-project-settings.png){width=700}

   > 如果你没有先禁用 sandboxing 就构建了 iOS 项目, 这一步可能会要求重新启动你的 Gradle daemon.
   > 请停止可能已经被沙箱化的 Gradle daemon 进程:
   > ```shell
   > ./gradlew --stop
   > ```
   >
   > {style="tip"}

7. 在 Xcode 中构建项目. 如果一切设置正确, 项目将会构建成功.

> 如果你使用了与默认的 `Debug` 或 `Release` 不同的自定义构建配置, 请在 **Build Settings** 页,
> 在 **User-Defined** 之下添加 `KOTLIN_FRAMEWORK_BUILD_TYPE` 设置, 并将它设置为 `Debug` 或 `Release`.
>
{style="note"}

## 下一步做什么?

使用 Swift 包管理器时, 你也可以使用本地集成.
[学习如何在本地包中添加 Kotlin 框架的依赖项](multiplatform-spm-local-integration.md).
