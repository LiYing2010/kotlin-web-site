---
type: doc
layout: reference
category:
title: "升级你的应用程序"
---

# 升级你的应用程序

最终更新: {{ site.data.releases.latestDocDate }}

<table style="border-style: solid; border-color: 252528">
    <tr style="border: none">
        <td>
            这是 <strong>Kotlin Multiplatform Mobile 入门</strong> 教程的第 4 部分.
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
                <img src="/assets/docs/images/icons/icon-2-done.svg" alt="第 2 步" width="20"/> &nbsp;
                <a href="multiplatform-mobile-create-first-app.html">创建你的第一个跨平台应用程序</a>
            </div>
            <br/>
    
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-3-done.svg" alt="第 3 步" width="20"/> &nbsp;
                <a href="multiplatform-mobile-dependencies.html">添加依赖项</a>
            </div>
            <br/>
    
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-4-todo.svg" alt="第 4 步" width="20"/> &nbsp;
                <strong>升级你的应用程序</strong>
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

你已经使用外部依赖项实现了共通逻辑. 现在你可以添加更加复杂的逻辑.
网络请求和数据序列化是在 Kotlin Multiplatform 项目中 [最常见的情况](https://kotlinlang.org/lp/mobile/).
在你的第一个应用程序中学习如何实现这些功能, 然后在完成这个系列教程之后, 你就可以在未来的项目中使用这些功能了.

更新后的应用程序将会通过互联网, 从一个
[SpaceX API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs)
接收数据, 并显示 SpaceX 火箭的最后一次成功发射日期.

## 添加更多依赖项

在你的项目中将需要以下跨平台库:

* [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines),
  用来使用协程编写异步代码, 实现并发操作.
* [`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization),
  用来将 JSON 应答反序列化为处理网络操作的实体类对象.
* [Ktor](https://ktor.io/),
  一个框架, 作为 HTTP 客户端, 通过互联网获取数据.

### kotlinx.coroutines

要向你的项目添加 `kotlinx.coroutines`, 请在共通源代码集中指定一个依赖项.
具体做法是, 向共用模块的 `build.gradle.kts` 文件添加以下内容:

```kotlin
sourceSets {
    val commonMain by getting {
        dependencies {
            // ...
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}")
        }
    }
}
```

Multiplatform Gradle plugin 会自动将 `kotlinx.coroutines` 的平台相关 (iOS 和 Android) 库添加为一个依赖项.

#### 如果你在使用 Kotlin 1.7.20 以前的版本

如果你在使用 Kotlin 1.7.20 或更高版本, 那么你已经拥有了新的 Kotlin/Native 内存管理器, 它会默认启用.
否则, 请在 `build.gradle.kts` 文件的最后添加以下内容:

```kotlin
kotlin.targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget::class.java) {
    binaries.all {
        binaryOptions["memoryModel"] = "experimental"
    }
}
```

### kotlinx.serialization

对于 `kotlinx.serialization`, 你需要构建系统要求的 plugin.
Kotlin serialization plugin 随 Kotlin 编译器一起发布, IntelliJ IDEA plugin 捆绑在 Kotlin plugin 之内.

你可以使用 Gradle plugin DSL, 和 Kotlin plugin 一起设置 serialization plugin,
方法是在共用模块内的 `build.gradle.kts` 文件的最开头, 向现有的 `plugins` 代码段添加以下内容:

```kotlin
plugins {
    //
    kotlin("plugin.serialization") version "{{ site.data.releases.latest.version }}"
}
```

### Ktor

你可以使用添加 `kotlinx.coroutines` 库相同的方式来添加 Ktor.
除了在共通源代码集中指定 core 依赖项 (`ktor-client-core`) 之外, 你还需要:

* 添加 ContentNegotiation 功能 (`ktor-client-content-negotiation`),
  负责使用指定的格式来序列化/反序列化内容.
* 添加 `ktor-serialization-kotlinx-json` 依赖项,
  指示 Ktor 使用 JSON 格式, 并使用 `kotlinx.serialization` 作为序列化库.
  Ktor 在接收应答时, 将会期待 JSON 数据, 并将应答反序列化为一个数据类.
* 在平台源代码集(`ktor-client-android`, `ktor-client-darwin`) 中, 通过添加对应的 artifact 的依赖项, 提供平台引擎.

```kotlin
val ktorVersion = "{{ site.data.releases.ktorVersion }}"

sourceSets {
    val commonMain by getting {
        dependencies {
            // ...
            implementation("io.ktor:ktor-client-core:$ktorVersion")
            implementation("io.ktor:ktor-client-content-negotiation:$ktorVersion")
            implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")
        }
    }
    val androidMain by getting {
        dependencies {
            implementation("io.ktor:ktor-client-android:$ktorVersion")
        }
    }
    val iosMain by creating {
        // ...
        dependencies {
            implementation("io.ktor:ktor-client-darwin:$ktorVersion")
        }
    }
}
```

在通知信息中点击 **Sync Now**, 同步 Gradle 文件.

## 创建 API 请求

你需要使用
[SpaceX API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs)
来取得数据, 还需要单个方法, 从 **v4/launches** Endpoint 得到所有发射数据的列表.

### 添加数据模型

在 `shared/src/commonMain/kotlin` 目录中, 创建一个新的 `RocketLaunch.kt` 文件,
并添加一个数据类, 保存来自 SpaceX API 的数据:

```kotlin
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class RocketLaunch (
    @SerialName("flight_number")
    val flightNumber: Int,
    @SerialName("name")
    val missionName: String,
    @SerialName("date_utc")
    val launchDateUTC: String,
    @SerialName("success")
    val launchSuccess: Boolean?,
)
```

* `RocketLaunch` 类标注了 `@Serializable` 注解, 因此 `kotlinx.serialization` plugin 可以为它自动生成一个默认的序列化器.
* `@SerialName` 注解允许你重新定义域名称, 因此在数据类中可以使用更易读的名称来声明属性.

### 连接到 HTTP Client

1. 在 `Greeting.kt` 中, 创建一个 Ktor `HTTPClient` 实例, 来执行网络请求, 并解析结果 JSON:

    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.plugins.contentnegotiation.*
    import io.ktor.serialization.kotlinx.json.*
    import kotlinx.serialization.json.Json
    
    class Greeting {
        private val platform: Platform = getPlatform()

        private val httpClient = HttpClient {
            install(ContentNegotiation) {
                json(Json {
                    prettyPrint = true
                    isLenient = true
                    ignoreUnknownKeys = true
                })
            }
        }
    }
    ```

   要反序列化 GET 请求的结果,
   会使用 [ContentNegotiation Ktor plugin](https://ktor.io/docs/serialization-client.html#register_json) 和 JSON 序列化器.

2. 在 `greeting()` 函数中, 调用 `httpClient.get()` 方法, 获取关于火箭发射的信息, 并找到最后一次发射:

    ```kotlin
    import io.ktor.client.call.*
    import io.ktor.client.request.*

    class Greeting {
        // ...
        @Throws(Exception::class)
        suspend fun greeting(): String {
            val rockets: List<RocketLaunch> =
                httpClient.get("https://api.spacexdata.com/v4/launches").body()
            val lastSuccessLaunch = rockets.last { it.launchSuccess == true }
            return "Guess what it is! > ${platform.name.reversed()}!" +
                    "\nThere are only ${daysUntilNewYear()} left until New Year! 🎆" +
                    "\nThe last successful launch was ${lastSuccessLaunch.launchDateUTC} 🚀"
        }
    }
    ```

   `greeting()` 函数中的 `suspend` 修饰符是必须的, 因为它现在包含对 `get()` 的调用.
   这是一个关起函数, 包括异步操作来通过互联网获取数据, 只可以在一个协程内, 或另一个挂起函数内调用.
   网络请求将会在 HTTP Client 的线程池中执行.

### 添加互联网访问权限

要访问互联网, Android 应用程序需要适当的权限. 由于所有的网络请求都由共用模块发起,
因此可以在共用模块的 Manifest 中添加互联网访问权限.

更新你的 `androidApp/src/main/AndroidManifest.xml` 文件, 如下:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          package="com.jetbrains.simplelogin.kotlinmultiplatformsandbox" >
    <uses-permission android:name="android.permission.INTERNET"/>
</manifest>
```

## 更新 Android 和 iOS 应用程序

你已经更新了共用模块的 API, 向 `greeting()` 函数添加了 `suspend` 修饰符.
现在你需要更新项目的原生 (iOS, Android) 部分, 让它们可以正确处理调用 `greeting()` 函数得到的结果.

### Android 应用程序

由于共用模块和 Android 应用程序都使用 Kotlin 编写, 因此在 Android 中使用共用代码非常简单:

1. 向 Android 应用程序添加 `kotlinx.coroutines` 库, 方法是在 `androidApp` 文件夹的 `build.gradle.kts` 中添加一行:

    ```kotlin
    dependencies {
        // ..
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:{{ site.data.releases.latest.coroutines.version }}")
    }
    ```

2. 在通知信息中点击 **Sync Now**, 同步 Gradle 文件.
3. 在 `androidApp/src/main/java` 目录中, 找到 `MainActivity.kt` 文件, 更新下面的类, 替换以前的实现:

   ```kotlin
   import androidx.compose.runtime.*
   import kotlinx.coroutines.launch
   
   class MainActivity : ComponentActivity() {
       override fun onCreate(savedInstanceState: Bundle?) {
           super.onCreate(savedInstanceState)
           setContent {
               MyApplicationTheme {
                   Surface(
                       modifier = Modifier.fillMaxSize(),
                       color = MaterialTheme.colors.background
                   ) {
                       val scope = rememberCoroutineScope()
                       var text by remember { mutableStateOf("Loading") }
                       LaunchedEffect(true) {
                           scope.launch {
                               text = try {
                                   Greeting().greeting()
                               } catch (e: Exception) {
                                   e.localizedMessage ?: "error"
                               }
                           }
                       }
                       GreetingView(text)
                   }
               }
           }
       }
   }
   ```

   `greeting()` 函数现在会在 `LaunchedEffect` 之内的一个协程内调用, 以免每次状态变化时都调用它.

### iOS 应用程序

对于项目的 iOS 部分, 你将会使用 [SwiftUI](https://developer.apple.com/xcode/swiftui/) 来构建用户界面,
并使用 [Model–view–viewmodel](https://en.wikipedia.org/wiki/Model–view–viewmodel) 模式来连接 UI 与共用模块,
共用模块中包含了所有的业务逻辑.

共用模块已经连接到了 iOS 项目 — Android Studio plugin 向导已经完成了所有的配置.
共用模块已经导入, 并在 `ContentView.swift` 中通过 `import shared` 来使用.

> 如果你看到错误提示说无法找到共用模块, 请运行应用程序.
{:.tip}

1. 启动你的 Xcode 应用程序, 并选择 **Open a project or file**.
2. 找到你的项目, 例如 **KotlinMultiplatformSandbox**, 并选择 `iosApp` 文件夹. 点击 **Open**.
3. 在 `iosApp/iOSApp.swift` 中, 为你的应用程序更新入口点:
   
   ```swift
   @main
   struct iOSApp: App {
       var body: some Scene {
           WindowGroup {
               ContentView(viewModel: ContentView.ViewModel())
           }
       }
   }
   ```

4. 在 `iosApp/ContentView.swift` 中, 为 `ContentView` 创建一个 `ViewModel` 类, 为它准备和管理数据:

    ```swift
    import SwiftUI
    import shared
    
    struct ContentView: View {
        @ObservedObject private(set) var viewModel: ViewModel
    
        var body: some View {
            Text(viewModel.text)
        }
    }
     
    extension ContentView {
        class ViewModel: ObservableObject {
            @Published var text = "Loading..."
            init() {
                // 数据将会在这里装载
            }
        }
    }
    ```

   * `ViewModel` 声明为 `ContentView` 的扩展, 因为它们紧密相关联.
   * [Combine 框架](https://developer.apple.com/documentation/combine) 会将视图模型 (`ContentView.ViewModel`)
   与视图 (`ContentView`) 连接起来.
   * `ContentView.ViewModel` 声明为一个 `ObservableObject`.
   * 对 `text` 属性使用了 `@Published` 包装器.
   * `@ObservedObject` 属性包装器用来订阅(subscribe) 视图模型.

   现在视图模型会在属性发生变更时发射信号.

5. 调用 `greeting()` 函数, 它现在会从 SpaceX API 装载数据, 并将结果保存到 `text` 属性中:

    ```swift
    class ViewModel: ObservableObject {
        @Published var text = "Loading..."
        init() {
            Greeting().greeting { greeting, error in
                DispatchQueue.main.async {
                    if let greeting = greeting {
                        self.text = greeting
                    } else {
                        self.text = error?.localizedDescription ?? "error"
                    }
                }
            }
        }
    }
    ```

   * Kotlin/Native [提供了与 Objective-C 的双向交互功能](../native/native-objc-interop.html#mappings),
     因此 Kotlin 的概念, 包括 `suspend` 函数, 都会映射为 Swift/Objective-C 中对应的概念, 反过来也是如此.
     当你将一个 Kotlin 模块编译为一个 Apple 框架, 挂起函数在框架中会成为带回调(`completionHandler`)的函数.
   * `greeting()` 函数标记了 `@Throws(Exception::class)` 注解.
     因此任何异常, 只要是 `Exception` 类或其子类的实例, 都会被转换为 `NSError`, 因此你可以在 `completionHandler` 中处理这些异常.
   * 在 Swift 代码中调用 Kotlin `suspend` 函数时, completion handler 可能会在主线程之外的线程中调用 –
     参见 Kotlin/Native 内存管理器中的 [iOS 集成](../native/native-ios-integration.html#completion-handlers).
     所以需要使用 `DispatchQueue.main.async` 来更新 `text` 属性.

6. 在 Android Studio 中再次运行 **androidApp** 和 **iosApp** 配置, 确认你的应用程序的逻辑保持了同步:

   <img src="/assets/docs/images/multiplatform-mobile/create-first-app/multiplatform-mobile-upgrade.png" alt="最终结果" width="500"/>


## 下一步

在本教程的最后部分, 你将完成你的项目, 然后看看下一步学习什么.

**[进入下一部分](multiplatform-mobile-wrap-up.html)**

### 参考资料

* 查看 [组合挂起函数](../coroutines/composing-suspending-functions.html) 的各种不同方式.
* 学习 [与 Objective-C 框架和库的交互能力](../native/native-objc-interop.html).
* 完成教程 [网络与数据存储](multiplatform-mobile-ktor-sqldelight.html).

## 获取帮助

* **Kotlin Slack**.
  首先得到 [邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up),
  然后加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道.
* **Kotlin issue tracker**.
  [报告新的问题](https://youtrack.jetbrains.com/newIssue?project=KT).
