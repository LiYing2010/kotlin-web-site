---
type: doc
layout: reference
title: "教程 - 让你的 Android 应用程序在 iOS 上运行"
---

# 教程 - 让你的 Android 应用程序在 iOS 上运行

最终更新: {{ site.data.releases.latestDocDate }}

本教程将介绍如何让你的既有的 Android 应用程序变成跨平台程序, 可以同时在 Android 和 iOS 上运行.
你将学会编写代码, 并一次性的对 Android 和 iOS 测试你的代码.

本教程使用一个 [示例 Android 应用程序](https://github.com/Kotlin/kmm-integration-sample),
它包含单个画面, 用来输入一个用户名和密码.
认证信息验证并保存到一个内存数据库中.

如果你不熟悉 Kotlin Multiplatform Mobile, 你可以先学习如何 [从头创建并配置一个跨平台移动应用程序](multiplatform-mobile-create-first-app.html).

## 准备开发环境

1. 安装 Android Studio 4.2 或 Android Studio 2020.3.1 Canary 8 或更高版本, 以及 macOS 上的 [其他跨平台移动开发工具](multiplatform-mobile-setup.html).

   > 你需要一台运行 macOS 的 Mac 机器来完成本教程中的某些步骤, 包括编写 iOS 相关代码, 以及运行 iOS 应用程序.  
   > 这些步骤不能在其他操作系统上进行, 比如 Microsoft Windows. 这是由于 Apple 的要求.
   {:.note}

2. 在 Android Studio 中, 从代码仓库创建一个新项目:

   ```text
   https://github.com/Kotlin/kmm-integration-sample
   ```

   `master` 分支包含项目的初始状态 — 一个简单的 Android 应用程序.
   要查看包含 iOS 应用程序和共用模块的最终状态, 请切换到 `final` 分支.

3. 切换到 **Project** 视图.

   <img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/project-view-for-integrate.png" alt="Project 视图" width="200"/>

## 让你的代码能够跨平台运行

要让一个你的应用程序能够在 iOS 上运行, 首先需要让你的代码能够跨平台运行, 然后在一个新的 iOS 应用程序中重用你的跨平台代码.

要让你的代码跨平台运行:

1. [决定哪些代码需要跨平台运行](#decide-what-code-to-make-cross-platform).

2. [为跨平台代码创建一个共用模块](#create-a-shared-module-for-cross-platform-code).

3. [向你的 Android 应用程序添加对共用模块的依赖项](#add-a-dependency-on-the-shared-module-to-your-android-application).

4. [让业务逻辑跨平台运行](#make-the-business-logic-cross-platform).

5. [在 Android 上运行你的跨平台应用程序](#run-your-cross-platform-application-on-android).

### 决定哪些代码需要跨平台运行

决定你的 Android 应用程序中的哪些代码应该与 iOS 共用, 哪些应该继续保留为本地代码.
一条简单的规则是: 尽量多的共用那些你希望重用的代码.
对 Android 和 iOS, 业务逻辑通常是相同的, 因此它非常适合重用.

在你的示例 Android 应用程序中, 业务逻辑保存在包 `com.jetbrains.simplelogin.androidapp.data` 中.
你未来的 iOS 应用程序将会使用相同的逻辑, 因此你应该让这些代码跨平台运行.

<img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/business-logic-to-share.png" alt="需要共用的业务逻辑" width="350"/>

### 为跨平台代码创建一个共用模块

被 iOS 和 Android 共用的跨平台代码 _保存_ 在共用模块中.
Kotlin Multiplatform Mobile plugin 提供了一个专门的向导来创建这样的模块.

在你的 Android 项目中, 为你的跨平台代码创建一个 Kotlin Multiplatform 共用模块.
之后你将会将这个模块连接到你的既有的 Android 应用程序和你未来的 iOS 应用程序.

1. 在 Android Studio 中, 点击 **File** \| **New** \| **New Module**.

2. 在模板列表中, 选择 **Kotlin Multiplatform Shared Module**, 输入模块名称 `shared`,
并在 iOS 框架发布选项列表中选择 **Regular framework**.
将共用模块连接到 iOS 应用程序需要这一步.

   ![Kotlin Multiplatform 共用模块]({{ url_for('asset', path='docs/images/multiplatform-mobile/integrate-in-existing-app/multiplatform-mobile-module-wizard.png') }})


3. 点击 **Finish**.

向导将会创建 Kotlin Multiplatform 共用模块, 更新配置文件, 并创建类文件, 演示 Kotlin Multiplatform 的功能.
详情请参见 [项目结构](multiplatform-mobile-understand-project-structure.html).

### 向你的 Android 应用程序添加对共用模块的依赖项

要在你的 Android 应用程序中使用跨平台代码, 需要将共用模块连接到你的应用程序, 将业务逻辑代码移动到共用模块, 并让这些代码能够跨平台运行.

1. 在 `shared` 模块的 `build.gradle.kts` 文件中, 确认 `compileSdk` 和 `minSdk` 与 `app` 模块中你的 Android 应用程序的 `build.gradle` 的设置相同.

   如果设置不同, 请更改共用模块的 `build.gradle.kts` 中的设置. 否则, 你将会遇到编译错误.

2. 向你的 Android 应用程序的 `build.gradle` 添加对共用模块的依赖项.

    ```kotlin
    dependencies {
        implementation project(':shared')
    }
    ```

3. 在警告信息中点击 **Sync Now**, 同步 Gradle 文件.

   ![同步 Gradle 文件]({{ url_for('asset', path='docs/images/multiplatform-mobile/integrate-in-existing-app/gradle-sync.png') }})

4. 在 `app/src/main/java/` 目录中, 打开 `com.jetbrains.simplelogin.androidapp.ui.login` 包中的 `LoginActivity` 类.

5. 为了确认共用模块成功连接到了你的应用程序, 更新 `onCreate()` 方法, 将 `greeting()` 函数的结果输出到 log.

    ```kotlin
    override fun onCreate(savedInstanceState: Bundle?) {
       super.onCreate(savedInstanceState)

       Log.i("Login Activity", "Hello from shared module: " + (Greeting().greeting()))
   
    }
    ```

6. 遵循 Android Studio 的建议, 导入缺少的类.

7. 调试 `app`. 打开 **Logcat** 页面, 在 log 中搜索 `Hello`, 你将会找到共用模块输出的信息.

   ![共用模块输出的信息]({{ url_for('asset', path='docs/images/multiplatform-mobile/integrate-in-existing-app/shared-module-greeting.png') }})

### 让业务逻辑跨平台运行

现在你可以将业务逻辑代码抽取到 Kotlin Multiplatform 共用模块, 并让这些代码平台独立.
为了在 Android 和 iOS 上重用代码, 这一步是必须的.

1. 将业务逻辑代码 `com.jetbrains.simplelogin.androidapp.data` 从 `app` 目录移动到 `shared/src/commonMain` 目录中的 `com.jetbrains.simplelogin.shared` 包.
   你可以拖放这个包, 也可以将所有文件从一个目录移动到另一个目录来重构它.

   <img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/moving-business-logic.png" alt="拖放业务逻辑代码的包" width="350"/>

2. Android Studio 会询问你想做什么, 选择移动包, 然后同意代码重构.

   <img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/refactor-business-logic-package.png" alt="重构业务逻辑包" width="500"/>

3. 忽略关于平台相关代码的所有警告, 点击 **Continue**.

   <img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/warnings-android-specific-code.png" alt="关于平台相关代码的警告" width="450"/>

4. 删除 Android 相关代码, 替换为跨平台的 Kotlin 代码, 或使用 [`expect` 和 `actual` 声明](../multiplatform/multiplatform-connect-to-apis.html), 连接到 Android 专有 API.

   详情请参见下文:

#### 将 Android 相关代码替换为跨平台代码

要让你的代码在 Android 和 iOS  上都能运行, 在移动后的 `data` 目录中, 要尽量将所有的 JVM 依赖项替换为 Kotlin 依赖项.

1.  在 `LoginDataSource` 类中, 将 `login()` 函数中的 `IOException` 替换为 `RuntimeException`, `IOException` 在 Kotlin 中是不可用的.

    ```kotlin
    // 修改前
    return Result.Error(IOException("Error logging in", e))
    ```

    ```kotlin
    // 修改后
    return Result.Error(RuntimeException("Error logging in", e))
    ```

2. 在 `LoginDataValidator` 类中, 将用于 email 验证的 `android.utils` 包的 `Patterns` 类, 替换为 Kotlin 的正规表达式匹配模式:

    ```kotlin
    // 修改前
    private fun isEmailValid(email: String) = Patterns.EMAIL_ADDRESS.matcher(email).matches()
    ```

    ```kotlin
    // 修改后
    private fun isEmailValid(email: String) = emailRegex.matches(email)
    
    companion object {
       private val emailRegex = 
           ("[a-zA-Z0-9\\+\\.\\_\\%\\-\\+]{1,256}" +
                "\\@" +
                "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,64}" +
                "(" +
                "\\." +
                "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,25}" +
                ")+").toRegex()
    }
    ```

#### 将跨平台代码连接到平台相关 API 

在 `LoginDataSource` 类中, `fakeUser` 的全局唯一标识符(UUID)是使用 `java.util.UUID` 类生成的, 但这个类在 iOS 平台不可用.

```kotlin
val fakeUser = LoggedInUser(java.util.UUID.randomUUID().toString(), "Jane Doe")
```

由于 Kotlin 标准库没有提供生成 UUID 的功能, 对这种情况你需要使用各平台独自的功能.

需要为共享代码中的 `randomUUID()` 函数提供 `expect` 声明, 然后在相应的源代码集中, 为各个平台 – Android 和 iOS, 提供它的 `actual` 实现.
详情请参见 [连接到平台相关 API](../multiplatform/multiplatform-connect-to-apis.html).

1. 从共通代码中删除 `java.util.UUID` 类:

    ```kotlin
   val fakeUser = LoggedInUser(randomUUID(), "Jane Doe") 
   ```

2. 在 `shared/src/commonMain` 目录的 `com.jetbrains.simplelogin.shared` 包内创建 `Utils.kt` 文件, 并提供 `expect` 声明:

    ```kotlin
    package com.jetbrains.simplelogin.shared
    
    expect fun randomUUID(): String
    ```

3. 在 `shared/src/androidMain` 目录的 `com.jetbrains.simplelogin.shared` 包内创建 `Utils.kt` 文件, 并为 `randomUUID()` 提供 Android 中的 `actual` 实现:

    ```kotlin
    package com.jetbrains.simplelogin.shared
    
    import java.util.*

    actual fun randomUUID() = UUID.randomUUID().toString()
    ```

4. 在 `shared/src/iosMain` 目录的 `com.jetbrains.simplelogin.shared` 包内创建 `Utils.kt` 文件, 并为 `randomUUID()` 提供 iOS 中的 `actual` 实现:

    ```kotlin
    package com.jetbrains.simplelogin.shared
    
    import platform.Foundation.NSUUID

    actual fun randomUUID(): String = NSUUID().UUIDString()
    ```

对于 Android 和 iOS, Kotlin 将会使用不同的平台相关实现.

### 在 Android 上运行你的跨平台应用程序

在 Android 上运行你的跨平台应用程序, 确认它能够正确工作.

<img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/android-login.png" alt="Android Login 应用程序" width="300"/>

## 让你的跨平台应用程序能够在 iOS 上运行

当你的 Android 应用程序能够跨平台运行之后, 你可以创建一个 iOS 应用程序, 在这个 iOS 应用程序中重用共通的业务逻辑.

1. [在 Xcode 中创建一个 iOS 项目](#create-an-ios-project-in-xcode).

2. [将框架连接到你的 iOS 项目](#connect-the-framework-to-your-ios-project).

3. [在 Swift 中使用共用模块](#use-the-shared-module-from-swift).

### 在 Xcode 中创建一个 iOS 项目

1. 在 中 Xcode, 点击 **File** \| **New** \| **Project**.

2. 为 iOS App 选择一个模板, 并点击 **Next**.

   <img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/ios-project-wizard-1.png" alt="iOS 项目模板" width="700"/>


3. 在产品名称中输入 **simpleLoginIOS**, 并点击 **Next**.

   <img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/ios-project-wizard-2.png" alt="iOS 项目设置" width="700"/>


4. 选择保存你的跨平台应用程序的目录, 比如, `kmm-integration-sample`.

在 Android Studio 中, 你将会看到以下结构:

<img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/ios-project-in-as.png" alt="在 Android Studio 中的 iOS 项目" width="194"/>

你可以将 `simpleLoginIOS` 目录重命名为 `iosApp`, 与你的跨平台项目中的其他顶级目录保持一致.

<img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/ios-directory-renamed-in-as.png" alt="在 Android Studio 中重命名 iOS 项目目录" width="194"/>

### 将框架连接到你的 iOS 项目

有了框架之后, 你可以手动将它连接到你的 iOS 项目.

> 另一种替代选择是 [配置通过 CocoaPods 的集成](../native/native-cocoapods.html), 但这样的集成不在本教程的讨论范围内.
{:.note}

将你的框架手动连接到 iOS 项目:

1. 在 Xcode 中, 双击项目名称, 打开 iOS 项目设置.

2. 在项目设置的 **Build Phases** 页面上, 点击 **+**, 添加 **New Run Script Phase**.

   <img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/xcode-run-script-phase-1.png" alt="添加运行脚本 phase" width="700"/>

3. 添加以下脚本:
    ```text
    cd "$SRCROOT/.."
    ./gradlew :shared:embedAndSignAppleFrameworkForXcode
    ```
   
   <img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/xcode-add-run-phase-2.png" alt="添加脚本" width="700"/>

4. 将 **Run Script** phase 移动到 **Compile Sources** phase 之前.

   <img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/xcode-run-script-phase-3.png" alt="移动运行脚本 phase" width="700"/>

5. 在 **Build Settings** 页面上, 切换到 **All** 构建设定, 指定 **Search Paths** 中的 **Framework Search Path**:

   ```text
   $(SRCROOT)/../shared/build/xcode-frameworks/$(CONFIGURATION)/$(SDK_NAME)
   ```

   <img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/xcode-add-framework-search-path.png" alt="框架搜索路径" width="700"/>

6. 在 **Build Settings** 页面上, 指定 **Linking** 中的 **Other Linker flags**:

   ```text
   $(inherited) -framework shared
   ```

   <img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/xcode-add-flag.png" alt="链接器选项" width="700"/>

7. 在 Xcode 中构建项目. 如果一切设置正确, 项目将会构建成功.

> 如果你要使用与默认的 `Debug` 或 `Release` 不同的自定义构建配置, 请在 **Build Settings** 页面,
> 在 **User-Defined** 之下添加 `KOTLIN_FRAMEWORK_BUILD_TYPE` 设置, 将它设置为 `Debug` 或 `Release`.
{:.note}

### 在 Swift 中使用共用模块

1. 在 Xcode 中, 打开 `ContentView.swift` 文件, 并导入 `shared` 模块.

   ```swift
   import shared
   ```

2. 为了验证连接是否正确, 使用你的跨平台应用程序的共用模块的 `greeting()` 函数:

   ```swift
   import SwiftUI
   import shared
    
   struct ContentView: View {
       var body: some View {
           Text(Greeting().greeting())
           .padding()
       }
   }
   ```

   <img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/xcode-iphone-hello.png" alt="共用模块的输出信息" width="300"/>

3. 在 `ContentView.swift` 中, 编写代码使用来自共用模块的数据, 并描绘应用程序 UI:

   [代码参见这里](https://github.com/JetBrains/kotlin-web-site/blob/master/docs/snippets/android-ios-tutorial/ContentView.swift)

4. 在 `simpleLoginIOSApp.swift` 中, 导入 `shared` 模块, 并为 `ContentView()` 函数指定参数:

    ```swift
    import SwiftUI
    import shared
    
    @main
    struct SimpleLoginIOSApp: App {
        var body: some Scene {
            WindowGroup {
                ContentView(viewModel: .init(loginRepository: LoginRepository(dataSource: LoginDataSource()), loginValidator: LoginDataValidator()))
            }
        }
    }
   ```

<img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/xcode-iphone-login.png" alt="简单的 Login 应用程序" width="300"/>

## 享受结果 – 只需要在一处更新逻辑

现在你的应用程序可以跨平台运行了. 你可以只在一处更新业务逻辑, 然后在 Android 和 iOS 上都能看到结果.

1. 在 Android Studio 中, 修改 `LoginDataValidator` 类的 `checkPassword()` 函数中的用户密码的验证逻辑:

   ```kotlin
   package com.jetbrains.simplelogin.shared.data

   class LoginDataValidator {
   //...
      fun checkPassword(password: String): Result {
          return when {
              password.length < 5 -> Result.Error("Password must be >5 characters")
              password.lowercase() == "password" -> Result.Error("Password shouldn't be \"password\"")
              else -> Result.Success
          }
      }
   //...
   }
   ```

2. 更新 `gradle.properties` , 将你的 iOS 应用程序连接到 Android Studio, 以便能直接从 Android Studio 中, 在模拟的或真实的设备上运行 iOS 应用程序:

    ```text
    xcodeproj=iosApp/SimpleLoginIOS.xcodeproj
    ```

3. 在警告中点击 **Sync Now**, 同步 Gradle 文件.

   ![同步 Gradle 文件]({{ url_for('asset', path='docs/images/multiplatform-mobile/integrate-in-existing-app/gradle-sync.png') }})

你将会看到新的运行配置 **simpleLoginIOS**, 它可以直接从 Android Studio 运行你的 iOS 应用程序.

<img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/ios-run-configuration-simplelogin.png" alt="iOS 运行配置" width="200"/>

<img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/iphone-password-error.png" alt="iOS 应用程序密码错误" width="300"/>

<img src="/assets/docs/images/multiplatform-mobile/integrate-in-existing-app/android-password-error.png" alt="Android 应用程序密码错误" width="300"/>

你可以在这里查看 [本教程的最终代码](https://github.com/Kotlin/kmm-integration-sample/tree/final).

## 还可以共用什么?

你已经共用了你的应用程序的业务逻辑, 但你还可以共用你的应用程序的其他层.
比如, `ViewModel` 类代码在
[Android 应用程序](https://github.com/Kotlin/kmm-integration-sample/blob/final/app/src/main/java/com/jetbrains/simplelogin/androidapp/ui/login/LoginViewModel.kt)
和 [iOS 应用程序](https://github.com/Kotlin/kmm-integration-sample/blob/final/iosApp/SimpleLoginIOS/ContentView.swift#L91)
中几乎是相同的,
因此如果你的移动应用程序使用相同的表现层, 你可以共用它.

## 下一步做什么?

将你的 Android 应用程序变成跨平台应用程序之后, 你可以继续学习以下内容:

* [添加跨平台库的依赖项](../multiplatform/multiplatform-add-dependencies.html)
* [添加 Android 依赖项](multiplatform-mobile-android-dependencies.html)
* [添加 iOS 依赖项](multiplatform-mobile-ios-dependencies.html)
* [学习并发](multiplatform-mobile-concurrency-overview.html)

也可以学习以下社区资源:

* [视频: 让你的 Kotlin JVM 代码可以在 Kotlin Multiplatform Mobile 中使用的 3 种方法](https://www.youtube.com/watch?v=X6ckI1JWjqo)
