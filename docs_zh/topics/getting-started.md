[//]: # (title: Kotlin 入门)

<tldr>
<p>Kotlin 的最新发布版本:<b> <a href="%kotlinLatestWhatsnew%">%kotlinVersion%</a></b></p>
</tldr>

Kotlin 是一门现代而成熟的编程语言, 设计目标是让开发者更加快乐.
它简洁, 安全, 能够与 Java 及其他语言交互, 并提供了很多方法在多个目标平台之间重用代码, 以提高开发效率.

作为入门学习, 请参加我们的 Kotlin 之旅.
这个教程包含 Kotlin 编程语言的基础知识, 并且全部可以在你的浏览器内完成.

<a href="kotlin-tour-welcome.md"><img src="start-kotlin-tour.svg" width="700" alt="开始 Kotlin 之旅" style="block"/></a>

## 安装 Kotlin {id="install-kotlin"}

Kotlin 包含在 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/studio) 每个发行版之内.
下载并安装这些 IDE 中的一个, 就可以开始使用 Kotlin 了.

## 选择你的 Kotlin 使用场景 {id="choose-your-kotlin-use-case"}

<tabs>

<tab id="console" title="控制台">

在这里你将会学习如何使用 Kotlin 开发一个控制台应用程序, 并创建单元测试.

1. **[使用 IntelliJ IDEA 项目向导创建一个基本的 JVM 应用程序](jvm-get-started.md).**

2. **[编写你的第一个单元测试](jvm-test-using-junit.md).**

</tab>

<tab id="backend" title="后端">

在这里你将会学习如何使用 Kotlin 服务端技术开发后端应用程序.

1. **创建你的第一个后端应用程序:**

   * [使用 Spring Boot 创建一个 RESTful Web 服务](jvm-get-started-spring-boot.md)
   * [使用 Ktor 创建 HTTP API](https://ktor.io/docs/creating-http-apis.html)

2. **[学习如何在你的应用程序中混合使用 Kotlin 和 Java 代码](mixing-java-kotlin-intellij.md).**

</tab>

<tab id="cross-platform-mobile" title="跨平台">

在这里你将会学习如何使用 [Kotlin Multiplatform](multiplatform-intro.md) 来开发一个跨平台应用程序.

1. **[为跨平台开发设置环境](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-setup.html).**

2. **创建你的第一个 iOS 和 Android 应用程序:**

   * 从零开始创建一个跨平台应用程序, 并且:
      * [共用业务逻辑, 同时使用原生 UI](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
      * [共用业务逻辑和 UI](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-create-first-app.html)
   * [让你的既有的 Android 应用程序在 iOS 上运行](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html)
   * [使用 Ktor 和 SQLDelight 创建跨平台应用程序](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html)

3. **查看 [示例项目](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-samples.html)**.

</tab>

<tab id="android" title="Android">

要使用 Kotlin 进行 Android 开发, 请阅读 [Google 的 Kotlin Android 开发入门教程](https://developer.android.com/kotlin/get-started).

</tab>

<tab id="data-analysis" title="数据分析">

从创建数据管道(Data Pipeline), 到真实生产环境的机器学习模型, Kotlin 都是用于处理数据并充分利用数据的很好的选择.

1. **在 IDE 中无缝的创建并编辑 Notebook:**

    * [Kotlin Notebook 入门](get-started-with-kotlin-notebooks.md)

2. **浏览和实验你的数据:**

    * [DataFrame](https://kotlin.github.io/dataframe/overview.html) – 一个用于数据分析和操作的库.
    * [Kandy](https://kotlin.github.io/kandy/welcome.html) – 一个用于数据可视化的绘图工具.

3. **关注 Kotlin for Data Analysis 的 Twitter 官方帐号:** [KotlinForData](http://twitter.com/KotlinForData).

</tab>

</tabs>

## 加入 Kotlin 开发社区 {id="join-the-kotlin-community"}

随时了解 Kotlin 生态系统的最新更新, 并分享你的经验.

* 请加入我们的开发社区:
    * ![Slack](slack.svg){width=25}{type="joined"} Slack: [获得邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).
    * ![StackOverflow](stackoverflow.svg){width=25}{type="joined"} StackOverflow: 订阅 ["kotlin"](https://stackoverflow.com/questions/tagged/kotlin) 标签.
* 订阅 Kotlin 官方帐号:
  ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw),
  ![Twitter](twitter.svg){width=18}{type="joined"} [Twitter](https://twitter.com/kotlin),
  ![Bluesky](bsky.svg){width=18}{type="joined"} [Bluesky](https://bsky.app/profile/kotlinlang.org),
  以及 ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/).
* 订阅 [Kotlin 新闻](https://info.jetbrains.com/kotlin-communication-center.html).

如果你遇到任何困难和问题, 请到我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提交报告.

## 没有找到需要的资料吗? {id="is-anything-missing"}

如果你没有找到需要的资料, 或对本页面内容感到疑惑, 请向我们 [反馈你的意见](https://surveys.hotjar.com/d82e82b0-00d9-44a7-b793-0611bf6189df).
