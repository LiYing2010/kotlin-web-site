---
type: doc
layout: reference
title: "创建你的第一个跨平台应用程序"
---

# 创建你的第一个跨平台应用程序

最终更新: {{ site.data.releases.latestDocDate }}

<table style="border-style: solid; border-color: 252528">
    <tr style="border: none">
        <td>
            这是 <strong>Kotlin Multiplatform Mobile 入门</strong> 教程的第 2 部分.
            阅读本章之前, 请确认你是否完成了前面的章节.
        </td>
    </tr>
    <tr>
        <td>
        <div style="display: block">
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-1-done.svg" alt="第 1 步" width="20"/> &nbsp;
                <a href="multiplatform-mobile-setup.html">设置开发环境</a>
            </div>
            <br/>
    
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-2.svg" alt="第 2 步" width="20"/> &nbsp;
                <strong>创建你的第一个跨平台应用程序</strong>
            </div>
            <br/>
    
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-3-todo.svg" alt="第 3 步" width="20"/> &nbsp;
                添加依赖项
            </div>
            <br/>
    
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-4-todo.svg" alt="第 4 步" width="20"/> &nbsp;
                升级你的应用程序
            </div>
            <br/>
    
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-5-todo.svg" alt="第 5 步" width="20"/> &nbsp;
                完成你的项目
            </div>
        </div>
        </td>
    </tr>
</table>

在本章中, 你将学习如何使用 Android Studio 创建并运行你的第一个 Kotlin Multiplatform Mobile 应用程序.

## 从模板创建项目

> 你也可以观看由 Kotlin 产品市场经理 Ekaterina Petrova 创建的 [本教程的视频版本](https://www.youtube.com/watch?v=GcqFhoUuNNI).
{:.tip}

1. 在 Android Studio 中, 选择 **File \| New \| New Project**.
2. 在项目模板列表中选择 **Kotlin Multiplatform App**, 并点击 **Next**.

    <img src="/assets/docs/images/multiplatform-mobile/create-first-app/multiplatform-mobile-project-wizard-1.png" alt="跨平台移动项目模板" width="700"/>

3. 为你的第 1 个 应用程序指定名称, 并点击 **Next**.  

    <img src="/assets/docs/images/multiplatform-mobile/create-first-app/multiplatform-mobile-project-wizard-2.png" alt="跨平台移动项目 - 一般设置" width="700"/>

4. 在 **iOS framework distribution** 列表中, 选择 **Regular framework** 选项.

    <img src="/assets/docs/images/multiplatform-mobile/create-first-app/multiplatform-mobile-project-wizard-3.png" alt="跨平台移动项目 - 追加设置" width="700"/>

   > 我们推荐对你的第一个项目使用 Regular framework, 因为这个选项不要求第三方工具, 并且安装过程中的问题较少.
   >
   > 对于更加复杂的项目, 你可能需要 CocoaPods 依赖项管理器, 来帮助处理库的依赖项.
   > 关于 CocoaPods 及其环境设置, 详情请参见 [CocoaPods 概述与设置](../native/native-cocoapods.html).
   {:.tip}

5. 对应用程序和共用目录的名称使用默认设置. 点击 **Finish**.

然后项目会自动完成设置. 第一次创建项目时, 可能需要一些时间来下载并设置需要的组件.

## 查看项目结构

要查看你的跨平台移动项目的完整结构, 请从 **Android** 视图切换到 **Project** 视图. 

<img src="/assets/docs/images/multiplatform-mobile/create-first-app/select-project-view.png" alt="选择项目视图" width="200"/>

每个 Kotlin Multiplatform Mobile 项目包含 3 个模块:

* _共用模块_ 是一个 Kotlin 模块, 包含 Android 和 iOS 应用程序共通的逻辑 – 你在不同平台间共用的代码.
  它使用 [Gradle](../gradle.html) 作为构建系统, 帮助你自动化你的构建过程.
  _共用模块_ 构建输出为一个 Android 库和一个 iOS 框架.
* _androidApp_ 是一个 Kotlin 模块, 构建输出为一个 Android 应用程序. 它使用 Gradle 作为构建系统.
  _androidApp_ 模块依赖于共用模块, 并且将它作为通常的 Android 库来使用.
* _iOSApp_ 是一个 Xcode 项目, 构建输出为一个 iOS 应用程序. 它依赖于共用模块, 并且将它作为 iOS 框架来使用.
  根据你在前面的步骤中对 **iOS framework distribution** 如何选择,
  共用模块可以用作通常的框架, 或者用作 [CocoaPods 依赖项](../native/native-cocoapods.html).
  在本教程中, 它是一个通常的框架依赖项.

<img src="/assets/docs/images/multiplatform-mobile/basic-project-structure.png" alt="基本的 Kotlin Multiplatform Mobile 项目结构" width="500"/>

共用模块包含 3 个源代码集: `androidMain`, `commonMain`, and `iosMain`.
_源代码集_ 是一个 Gradle 概念, 它表示逻辑上组合在一起的一组文件, 每组文件都有自己的依赖项.
在 Kotlin Multiplatform 中, 在一个共用模块中的不同的源代码集可以针对不同的平台.

<img src="/assets/docs/images/multiplatform-mobile/basic-project-structure-2.png" alt="源代码集与模块结构" width="200"/>

> 这是你在 IntelliJ IDEA 或 Android Studio 中, 使用项目向导创建的一个 Multiplatform Mobile 项目的示例结构. 
> 真实的项目可能包含更加复杂的结构.
{:.note}

## 运行你的应用程序

你可以在 [Android](#run-your-application-on-android) 或 [iOS](#run-your-application-on-ios) 上运行你的跨平台应用程序.

### 在 Android 上运行你的应用程序

1. 创建一个 [Android 虚拟设备](https://developer.android.com/studio/run/managing-avds#createavd).
2. 在运行配置列表中, 选择 **androidApp**.
3. 选择你的 Android 虚拟设备, 然后点击 **Run**.

    <img src="/assets/docs/images/multiplatform-mobile/create-first-app/run-android.png" alt="在 Android 上运行跨平台 App" width="400"/>

    <img src="/assets/docs/images/multiplatform-mobile/create-first-app/first-multiplatform-project-on-android-1.png" alt="在 Android 上的第 1 个 移动跨平台 App" width="300"/>


#### 在不同的 Android 模拟设备上运行

学习如何 [配置 Android Emulator, 并在不同的模拟设备上运行你的应用程序](https://developer.android.com/studio/run/emulator#runningapp).
    
#### 在真实的 Android 上设备运行

学习如何 [配置并连接到一个硬件设备, 并在这个设备上并运行你的应用程序](https://developer.android.com/studio/run/device).

### 在 iOS 上运行你的应用程序

1. 在另一个窗口中启动 Xcode. 初次启动时, 你可能还需要接受它的许可协议, 并允许它执行一些必要的初始化工作.
2. 在 Android Studio 中, 在运行配置列表中选择 **iosApp**, 然后点击 **Run**.

   如果你的运行配置列表中还没有 iOS 配置, 请添加一个 [新的 iOS 模拟设备](#run-on-a-new-ios-simulated-device).

    <img src="/assets/docs/images/multiplatform-mobile/create-first-app/run-ios.png" alt="在 iOS 上运行跨平台 App" width="450"/>

    <img src="/assets/docs/images/multiplatform-mobile/create-first-app/first-multiplatform-project-on-ios-1.png" alt="在 iOS 上的第 1 个 移动跨平台 App" width="300"/>

#### 在新的 iOS 模拟设备上运行

如果你想要在一个模拟设备上运行你的应用程序, 你可以添加新的运行配置.

1. 在运行配置列表中, 点击 **Edit Configurations**.

    <img src="/assets/docs/images/multiplatform-mobile/create-first-app/ios-edit-configurations.png" alt="编辑运行配置" width="450"/>

2. 点击配置列表上方的 **+** 按钮, 然后选择 **iOS Application**.

    ![为 iOS 应用程序添加新的运行配置]({{ url_for('asset', path='docs/images/multiplatform-mobile/create-first-app/ios-new-configuration.png') }})

3. 为你的运行配置命名.

4. 选中 **Xcode 项目文件**. 具体做法是, 导航到你的项目, 比如 **KotlinMultiplatformSandbox**,
   打开 `iosApp` 文件夹, 并选中 `.xcodeproj` 文件.

5. 在 **Execution target** 列表中, 选择一个模拟设备, 然后点击 **OK**.

    ![使用 iOS 模拟器的新的运行配置]({{ url_for('asset', path='docs/images/multiplatform-mobile/create-first-app/ios-new-simulator.png') }})
    
6. 点击 **Run**, 在新的模拟设备上运行你的应用程序.
    
#### 在一个真实的 iOS 设备上运行

1. 将一个真实的 iPhone 设备连接到 Xcode.
2. 对你的 App 进行代码签名(Code Sign). 详情请参见 [Apple 官方文档](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/).
3. 在 **Execution target** 列表中选择 iPhone, [创建一个运行配置](#run-on-a-new-ios-simulated-device).
4. 点击 **Run**, 在 iPhone 设备上运行你的应用程序.

> 如果你的构建失败, 请使用 [这个 issue](https://youtrack.jetbrains.com/issue/KT-40907) 中的变通方法.
{:.note}

## 更新你的应用程序

1. 打开 `shared/src/commonMain/kotlin` 中的 `Greeting.kt` 文件.  
   这个目录存储 Android 和 iOS 两个平台共用的代码. 如果你修改了共用代码, 你会看到这些修改反应到两个平台的应用程序中.

   ![共用的 Kotlin 文件]({{ url_for('asset', path='docs/images/multiplatform-mobile/create-first-app/common-kotlin-file.png') }})
    
2. 更新共用代码, 使用在所有平台上都能工作的 Kotlin 翻转字符串标准库函数
   [`reversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html):

    ```kotlin
    class Greeting {
        private val platform: Platform = getPlatform()

        fun greeting(): String {
            return "Guess what it is! > ${platform.name.reversed()}!"
        }
    }
    ```

3. 再次运行 **androidApp** 配置, 在 Android 虚拟设备上查看更新后的应用程序.

    <img src="/assets/docs/images/multiplatform-mobile/create-first-app/first-multiplatform-project-on-android-2.png" alt="在 Android 上运行更新后的跨平台移动 App" width="300"/>

4. 在 Android Studio 中, 切换到 **iosApp**, 再次运行它, 在 iOS 虚拟设备上查看更新后的应用程序.  

    <img src="/assets/docs/images/multiplatform-mobile/create-first-app/first-multiplatform-project-on-ios-2.png" alt="在 iOS 上运行更新后的跨平台移动 App" width="300"/>
    
## 下一步

在本教程的下一部分, 你将会学习依赖项, 并向你的项目添加一个第三方库, 来扩展它的功能.

**[进入下一部分](multiplatform-mobile-dependencies.html)**

### 参见

* 如何 [创建并运行跨平台的测试](../multiplatform/multiplatform-run-tests.html) 来检查代码是否正确工作.
* 学习 [项目结构](multiplatform-mobile-understand-project-structure.html), 共用模块的 artifact, 以及 Android 和 iOS 应用程序如何生成.

## 获取帮助

* **Kotlin Slack**.
  首先得到 [邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up),
  然后加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道.
* **Kotlin issue tracker**. [报告新的问题](https://youtrack.jetbrains.com/newIssue?project=KT).
