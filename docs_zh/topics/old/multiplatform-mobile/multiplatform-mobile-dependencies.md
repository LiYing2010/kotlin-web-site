[//]: # (title: 向你的项目添加依赖项)

最终更新: %latestDocDate%

<table style="border-style: solid; border-color: 252528">
    <tr style="border: none">
        <td>
            这是 <strong>Kotlin Multiplatform Mobile 入门</strong> 教程的第 3 部分.
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
                <img src="/assets/docs/images/icons/icon-3.svg" alt="第 3 步" width="20"/> &nbsp;
                <strong>添加依赖项</strong>
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

你已经创建了你的第一个跨平台 Kotlin Multiplatform Mobile 项目!
现在我们来学习如何添加第三方库的依赖项, 构建一个成功的跨平台应用程序必须用到这些库.

## 依赖项类型

在 Multiplatform Mobile 项目中你可以使用 2 种类型的依赖项:

* _跨平台依赖项_.
  这种依赖项是跨平台的库, 支持多个编译目标, 可以在共用代码的源代码集 `commonMain` 中使用.

  很多现代的 Android 库以及有了跨平台支持, 比如 [Koin](https://insert-koin.io/),
  [Apollo](https://www.apollographql.com/), 和 [Okio](https://square.github.io/okio/).
* _原生依赖项_.
  这种依赖项是通常的库, 来自有关的生态系统.
  你通常会在原生的 iOS 项目中, 通过 CocoaPods 或其它依赖管理器来使用这些库, 以及在 Android 项目项目中, 通过 Gradle 来使用这些库.

如果你使用共用模块, 你也可以依赖于原生依赖项, 并在原生源代码集 `androidMain` 和 `iosMain` 中使用这些依赖项.
通常, 当你想要使用平台 API 时, 会需要这些依赖项, 比如安全的存储, 并且存在共通逻辑.

对这 2 种依赖项, 你可以都使用本地的或外部的仓库.

## 添加一个跨平台依赖项

> 如果你有 Android 应用程序的开发经验, 添加一个跨平台依赖项类似于在通常的 Android 项目中添加一个 Gradle 依赖项.
> 唯一的区别是, 你需要指定源代码集.
>
{style="tip"}

我们现在回到应用程序, 让问候信息更多一点节日气息.
除了设备信息之外, 添加函数来显示距离新年的天数.
`kotlinx-datetime` 库, 带有完全的跨平台支持, 是在你的共用代码中处理日期的最便利的方法.

1. 在 `shared` 目录找到 `build.gradle.kts` 文件.
2. 向 `commonMain` 源代码集添加以下依赖项:

   ```kotlin
   kotlin {
       sourceSets {
           val commonMain by getting {
               dependencies {
                   implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.4.0")
               }
           } 
       }
   }
   ```

3. 在通知信息中点击 **Sync Now**, 同步 Gradle 文件.

   ![同步 Gradle 文件]({{ url_for('asset', path='docs/images/multiplatform-mobile/integrate-in-existing-app/gradle-sync.png') }})

4. 在 `shared/src/commonMain/kotlin` 目录中, 创建新的 `NewYear.kt` 文件,
   在其中添加一个函数, 使用 `date-time` 库提供的日期运算, 计算从今天到新年的天数:
   
   ```kotlin
   import kotlinx.datetime.*
   
   fun daysUntilNewYear(): Int {
       val today = Clock.System.todayIn(TimeZone.currentSystemDefault())
       val closestNewYear = LocalDate(today.year + 1, 1, 1)
       return today.daysUntil(closestNewYear)
   }
   ```

5. 在 `Greeting.kt` 文件中, 更新 `greeting()` 函数, 查看结果:

    ```kotlin
    class Greeting {
        private val platform: Platform = getPlatform()

        fun greeting(): String {
            return "Guess what it is! > ${platform.name.reversed()}!" +
            "\nThere are only ${daysUntilNewYear()} days left until New Year! 🎆"
        }
    }
    ```

6. 要查看结果, 请在 Android Studio 中再次运行你的 **androidApp** 和 **iosApp** 配置:

<img src="/assets/docs/images/multiplatform-mobile/create-first-app/first-multiplatform-project-3.png" alt="使用外部依赖项, 更新后的跨平台移动应用程序" width="500"/>

## 下一步

在本教程的下一部分, 你将会向你的项目添加更多的依赖项和更多的复杂逻辑.

**[进入下一部分](multiplatform-mobile-upgrade-app.html)**

### 参考资料

* 学习如何使用所有类型的跨平台依赖项:
  [Kotlin 库, Kotlin 跨平台库, 以及其它跨平台项目](../multiplatform/multiplatform-add-dependencies.html).
* 学习如何 [添加 Android 依赖项](multiplatform-mobile-android-dependencies.html)
  和 [使用或不使用 CocoaPods 添加 iOS 依赖项](multiplatform-mobile-ios-dependencies.html)
  以便在平台相关的源代码集中使用.
* 在示例项目中, 查看 [如何使用 Android 和 iOS 库](multiplatform-mobile-samples.html) 的示例 
  (注意确认 "平台 API" 列).

## 获取帮助

* **Kotlin Slack**.
  首先得到 [邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up),
  然后加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道.
* **Kotlin issue tracker**.
  [报告新的问题](https://youtrack.jetbrains.com/newIssue?project=KT).
