---
type: doc
layout: reference
title: "教程 - 创建你的第一个跨平台应用程序"
---

# 教程 - 创建你的第一个跨平台应用程序

本页面最终更新: 2022/04/29

在本教程中, 你将学习如何创建并运行你的第一个 KMM 应用程序.

1. 在适当的操作系统上安装必须的工具, [设置 KMM 开发环境](kmm-setup.html).

    > 你将会需要运行 macOS 操作系统的 Mac 计算机, 来完成本教程的某些步骤, 包括编写 iOS 专用的代码, 以及运行 iOS 应用程序.  
    > 这些步骤无法在其他操作系统上进行, 比如 Microsoft Windows. 这是 Apple 的要求.
    {:.note}

    你也可以观看由 Ekaterina Petrova 创建的本教程的视频, 他是 Kotlin 开发者 Advocate.

    <iframe width="560" height="360" src="https://www.youtube.com/embed/GcqFhoUuNNI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

2. 在 Android Studio 中, 选择 **File** \| **New** \| **New Project**.
3. 在项目模板列表中选择 **KMM Application**, 并点击 **Next**.

    ![跨平台移动项目模板]({{ url_for('asset', path='/docs/images/kmm/create-first-app/kmm-project-wizard-1.png') }})
 
4. 为你的第 1 个 应用程序指定名称, 并点击 **Next**.  

    ![跨平台移动项目 - 一般设置]({{ url_for('asset', path='/docs/images/kmm/create-first-app/kmm-project-wizard-2.png') }})

5. 在打开的窗口中, 执行以下步骤:
   * 对应用程序和共享文件夹使用默认名称.
   * 选择 checkbox, 为你的项目生成测试示例. 
   * 在 iOS framework distribution 选项列表中选择 **Regular framework**. 

   点击 **Finish**,创建新项目.

    ![跨平台移动项目 - 追加设置]({{ url_for('asset', path='/docs/images/kmm/create-first-app/kmm-project-wizard-3.png') }})
    
    > 如果你希望将 KMM 模块用作 CocoaPods 依赖项, 请选择 **CocoaPods dependency manager** 选项.
    > 关于 CocoaPods 依赖项, 详情请参见 [CocoaPods 集成](../native/native-cocoapods.html).
    {:.note}
    
现在, 等待你的项目设置完成. 第一次创建项目时, 可能需要一些时间来下载并设置需要的组件.
    
要查看你的跨平台移动项目的完整结构, 请从 **Android** 视图切换到 **Project** 视图.
你可以 [理解 KMM 项目 结构](kmm-understand-project-structure.html), 以及如何使用. 

<img src="/assets/docs/images/kmm/create-first-app/select-project-view.png" alt="选择项目视图" width="200"/>


## 运行你的应用程序

你可以在 [Android](#run-your-application-on-android) 或 [iOS](#run-your-application-on-ios) 上运行你的跨平台应用程序.

### 在 Android 上运行你的应用程序

* 在运行配置列表中, 选择 **androidApp**, 然后点击 **Run**.  

    <img src="/assets/docs/images/kmm/create-first-app/run-android.png" alt="在 Android 上运行跨平台 App" width="400"/>

    <img src="/assets/docs/images/kmm/create-first-app/first-kmm-on-android-1.png" alt="在 Android 上的第 1 个 移动跨平台 App" width="300"/>


#### 在不同的 Android 模拟设备上运行

学习如何 [配置 Android Emulator, 并在不同的模拟设备上运行你的应用程序](https://developer.android.com/studio/run/emulator#runningapp).
    
#### 运行 在 上 a 真实的 Android 设备

学习如何 [配置 and connect a hardware 设备 and 运行 你的 应用程序 在 上 it](https://developer.android.com/studio/run/device).

### 在 iOS 上运行你的应用程序

* 在运行配置列表中, 选择 **iosApp**, 然后点击 **Run**.  

    <img src="/assets/docs/images/kmm/create-first-app/run-ios.png" alt="在 iOS 上运行跨平台 App" width="450"/>

    <img src="/assets/docs/images/kmm/create-first-app/first-kmm-on-ios-1.png" alt="在 iOS 上的第 1 个 移动跨平台 App" width="300"/>

#### 在不同的 iPhone 模拟设备上运行

如果你想要在另一个模拟设备上运行你的应用程序, 你可以添加新的运行配置.

1. 在运行配置列表中, 点击 **Edit Configurations**.

    <img src="/assets/docs/images/kmm/create-first-app/ios-edit-configurations.png" alt="编辑运行配置" width="450"/>


2. 点击配置列表上方的 **+** 按钮, 然后选择 **iOS Application**.

    ![为 iOS 应用程序添加新的运行配置]({{ url_for('asset', path='/docs/images/kmm/create-first-app/ios-new-configuration.png') }})

4. 为你的运行配置命名.

5. 在 **Execution target** 列表中选择一个模拟设备, 然后点击 **OK**.

    ![使用 iOS 模拟器的新的运行配置]({{ url_for('asset', path='/docs/images/kmm/create-first-app/ios-new-simulator.png') }})
    
6. 点击 **Run**, 在新的模拟设备上运行你的应用程序.
    
#### 在一个真实的 iPhone 设备上运行

1. [将一个真实的 iPhone 设备连接到 Xcode](https://developer.apple.com/documentation/xcode/running_your_app_in_the_simulator_or_on_a_device).
2. 在 **Execution target** 列表中选择 iPhone, [创建一个运行配置](#run-on-a-different-iphone-simulated-device).
3. 点击 **Run**, 在 iPhone 设备上运行你的应用程序.

> 如果你的构建失败, 请使用 [这个 issue](https://youtrack.jetbrains.com/issue/KT-40907) 中的变通方法.
{:.note}

## 运行测试

你可以在两个平台上运行测试, 来检查共用代码是否正确工作. 当然, 你也可以编写并运行测试, 检查各平台专用的代码.

### 在 iOS 上运行测试
 
1. 打开 `shared/src/iosTest/kotlin/com.example.kmmapplication.shared` 中的 `iosTest.kt` 文件.
    名称中带有 `Test` 的目录, 包含测试代码.  
    这个文件包含一个 iOS 的测试示例.  
    
    ![iOS 测试 Kotlin 文件]({{ url_for('asset', path='/docs/images/kmm/create-first-app/ios-test-kt.png') }})
   
2. 点击测试代码旁边侧栏中的 **Run** 图标.

测试会在没有 UI 的模拟器上运行. 恭喜! 测试通过了 – 在控制台可以看到测试结果.

<img src="/assets/docs/images/kmm/create-first-app/ios-test-result.png" alt="iOS 测试结果" width="300"/>

### 在 Android 上运行测试

对于 Android, 运行测试的步骤与 iOS 非常类似.

1. 打开 `shared/src/androidTest/kotlin/com.example.kmmapplication.shared` 中的 `androidTest.kt` 文件.

2. 点击测试代码旁边侧栏中的 **Run** 图标.

## 更新你的应用程序

1. 打开 `shared/src/commonMain/kotlin/com.example.kmmapplication.shared` 中的 `Greeting.kt` 文件.  
   这个目录存储两个平台共用的代码 – Android 和 iOS. 如果你修改了共用代码, 你将在两个平台的应用程序中都看到变化.

    ![共用的 Kotlin 文件]({{ url_for('asset', path='/docs/images/kmm/create-first-app/common-kotlin-file.png') }})
    
2. 更新共用代码 – 使用在所有平台上都能工作的 Kotlin 标准库函数, 翻转字符串: `reversed()`.

    ```kotlin
    class Greeting {
        fun greeting(): String {
            return "Guess what it is! > ${Platform().platform.reversed()}!"
        }
    }
    ```

3. 在 Android 上运行更新后的应用程序.

    <img src="/assets/docs/images/kmm/create-first-app/first-kmm-on-android-2.png" alt="在 Android 上运行更新后的跨平台移动 App" width="300"/>

4. 在 iOS 上运行更新后的应用程序.  

    <img src="/assets/docs/images/kmm/create-first-app/first-kmm-on-ios-2.png" alt="在 iOS 上运行更新后的跨平台移动 App" width="300"/>
    
5. 在 Android 和 iOS 上运行测试.  
    你可以看到, 测试失败了. 请你更新测试, 让它通过. 你知道怎样做, 对吗? ;)
    
    ![iOS 测试失败]({{ url_for('asset', path='/docs/images/kmm/create-first-app/ios-test-failed.png') }})
    
## 下一步做什么?

完成你的第 1 个 KMM 应用程序之后, 你可以:

* [理解 KMM 项目结构](kmm-understand-project-structure.html)
* [完成一个教程, 让你的 Android 应用程序在 iOS 上运行](kmm-integrate-in-existing-app.html)
