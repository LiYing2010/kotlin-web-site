[//]: # (title: Kotlin 入门)

Kotlin 是一门现代而成熟的编程语言, 设计目标是让开发者更加快乐.
它简洁, 安全, 能够与 Java 及其他语言交互, 并提供了很多方法在多个目标平台之间重用代码, 以提高开发效率.

作为入门学习, 请参加我们的 Kotlin 之旅. 这个教程包含 Kotlin 编程语言的基础知识, 并且全部可以在你的浏览器内完成.

<a href="kotlin-tour-welcome.md"><img src="start-kotlin-tour.svg" width="700" alt="开始 Kotlin 之旅" style="block"/></a>

## 安装 Kotlin {id="install-kotlin"}

Kotlin 包含在 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/studio) 每个发行版之内.
下载并安装这些 IDE 中的一个, 就可以开始使用 Kotlin 了.

## 选择你的 Kotlin 使用场景

<tabs>

<tab id="console" title="控制台">

在这里你将会学习如何使用 Kotlin 开发一个控制台应用程序, 并创建单元测试.

1. **[使用 IntelliJ IDEA 项目向导创建一个基本的 JVM 应用程序](jvm-get-started.md).**

2. **[编写你的第一个单元测试](jvm-test-using-junit.md).**

3. **加入 Kotlin 开发社区:**

   * ![Slack](slack.svg){width=25}{type="joined"} Slack: [得到邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).
   * ![StackOverflow](stackoverflow.svg){width=25}{type="joined"} StackOverflow: 订阅 ["kotlin"](https://stackoverflow.com/questions/tagged/kotlin) 标签.

4. **订阅 Kotlin 官方帐号**:

   * ![Twitter](twitter.svg){width=18}{type="joined"} [Twitter](https://twitter.com/kotlin)
   * ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/)
   * ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)

如果遇到任何困难和问题, 请向我们的 [YouTrack Bug 追踪系统](https://youtrack.jetbrains.com/issues/KT) 提交报告.

</tab>

<tab id="backend" title="后端">

在这里你将会学习如何使用 Kotlin 服务端技术开发后端应用程序.

1. **创建你的第一个后端应用程序:**

   * [使用 Spring Boot 创建一个 RESTful Web 服务](jvm-get-started-spring-boot.md).
   * [使用 Ktor 创建 HTTP API](https://ktor.io/docs/creating-http-apis.html).

2. **[学习如何在你的应用程序中混合使用 Kotlin 和 Java 代码](mixing-java-kotlin-intellij.md).**

3. **加入 Kotlin 服务器端开发社区:**

   * ![Slack](slack.svg){width=25}{type="joined"} Slack: [得到邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).
   * ![StackOverflow](stackoverflow.svg){width=25}{type="joined"} StackOverflow: 订阅 ["kotlin"](https://stackoverflow.com/questions/tagged/kotlin) 标签.

4. **订阅 Kotlin 官方帐号**:

   * ![Twitter](twitter.svg){width=18}{type="joined"} [Twitter](https://twitter.com/kotlin)
   * ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/)
   * ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)

如果遇到任何困难和问题, 请向我们的 [YouTrack Bug 追踪系统](https://youtrack.jetbrains.com/issues/KT) 提交报告.

</tab>

<tab id="cross-platform-mobile" title="跨平台">

在这里你将会学习如何使用 [Kotlin Multiplatform](https://kotlinlang.org/lp/multiplatform/) 来开发并改进你的跨平台应用程序.

1. **[为跨平台开发设置环境](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-setup.html).**

2. **创建你的第一个 iOS 和 Android 应用程序:**

   * 要从零开始创建, 可以 [使用 IntelliJ IDEA 的项目向导创建一个基本的跨平台应用程序](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html).
   * 如果你有已经存在的 Android 应用程序, 并且希望将它变为跨平台应用程序, 请阅读教程 [让你的 Android 应用程序在 iOS 上运行](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html).
   * 如果你想看看比较真实的示例程序, 请 clone 并查看既有的项目,
   比如 [使用 Ktor 和 SQLDelight 创建跨平台应用程序](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html) 教程
   或者 [示例项目](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-samples.html) 中的网络和数据存储项目.

3. **使用大量的跨平台库** 在共用模块中实现需要的业务逻辑. 详情请参见 [添加依赖项](multiplatform-add-dependencies.md).

   | 库 | 详情 |
   |----------------|-------|-----|
   | Ktor | [文档](https://ktor.io/docs/client.html) |
   | 序列化 | [文档](serialization.md) 与 [示例](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html#create-an-application-data-model) |
   | 协程(Coroutine) | [文档](coroutines-guide.md) 与 [示例](coroutines-and-channels.md) |
   | 日期与时间 | [文档](https://github.com/Kotlin/kotlinx-datetime#readme) |
   | SQLDelight | 第三方库. [文档](https://cashapp.github.io/sqldelight/) |

   > 在 [社区开发的库列表](https://libs.kmp.icerock.dev/) 中还能找到其他跨平台库.
   >
   {style="tip"}

4. **关于 Kotlin Multiplatform 的更多资料:**
   * 关于 [Kotlin 跨平台开发](multiplatform-intro.md).
   * 阅读 [示例项目](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-samples.html).
   * [发布跨平台的库](multiplatform-publish-lib.md).
   * 使用 Kotlin Multiplatform 的真实案例:
   [Netflix](https://netflixtechblog.com/netflix-android-and-ios-studio-apps-kotlin-multiplatform-d6d4d8d25d23),
   [VMware](https://kotlinlang.org/lp/multiplatform/case-studies/vmware/),
   [Yandex](https://kotlinlang.org/lp/multiplatform/case-studies/yandex/),
   以及 [其他很多公司](https://kotlinlang.org/lp/multiplatform/case-studies/).

5. **加入 Kotlin 跨平台开发社区:**
   * ![Slack](slack.svg){width=25}{type="joined"} Slack: 首先[得到邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up),
    然后加入 [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA)
    和 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道.
   * ![StackOverflow](stackoverflow.svg){width=25}{type="joined"} StackOverflow: 订阅 ["kotlin-multiplatform"](https://stackoverflow.com/questions/tagged/kotlin-multiplatform) 标签.

6. **订阅 Kotlin 官方帐号**:

   * ![Twitter](twitter.svg){width=18}{type="joined"} [Twitter](https://twitter.com/kotlin)
   * ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/)
   * ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)

如果遇到任何困难和问题, 请向我们的 [YouTrack Bug 追踪系统](https://youtrack.jetbrains.com/issues/KT) 提交报告.

</tab>

<tab id="android" title="Android">

要使用 Kotlin 进行 Android 开发, 请阅读 [Google 的 Kotlin Android 开发入门教程](https://developer.android.com/kotlin/get-started).

订阅 Kotlin 官方帐号:

   * ![Twitter](twitter.svg){width=18}{type="joined"} [Twitter](https://twitter.com/kotlin)
   * ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/)
   * ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)

</tab>

<tab id="data-analysis" title="数据分析">

从创建数据管道(Data Pipeline), 到真实生产环境的机器学习模型, Kotlin 都是用于处理数据并充分利用数据的很好的选择.

1. **在 IDE 中无缝的创建并编辑 Notebook:**

    * [Kotlin Notebook 入门](get-started-with-kotlin-notebooks.md).

2. **浏览和实验你的数据:**

    * [DataFrame](https://kotlin.github.io/dataframe/overview.html) – 一个用于数据分析和操作的库.
    * [Kandy](https://kotlin.github.io/kandy/welcome.html) – 一个用于数据可视化的绘图工具.

3. **随时获得 Kotlin for Data Analysis 的最新信息:**

    * ![Slack](slack.svg){width=25}{type="joined"} Slack: [得到邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up),
      并加入 [#datascience](https://kotlinlang.slack.com/archives/C4W52CFEZ) 频道.
    * ![Twitter](twitter.svg){width=18}{type="joined"} Twitter: 订阅 [KotlinForData](http://twitter.com/KotlinForData) 帐号.

4. **订阅 Kotlin 官方帐号**:
    * ![Twitter](twitter.svg){width=18}{type="joined"} [Twitter](https://twitter.com/kotlin)
    * ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/)
    * ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)

</tab>

</tabs>

## 没有找到需要的资料吗?

如果你没有找到需要的资料, 或对本页面内容感到疑惑, 请向我们 [反馈你的意见](https://surveys.hotjar.com/d82e82b0-00d9-44a7-b793-0611bf6189df).
