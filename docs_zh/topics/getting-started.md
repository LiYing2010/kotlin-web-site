[//]: # (title: Kotlin 入门)

<tldr>
<p>Kotlin 的最新发布版本:<b> <a href="%kotlinLatestWhatsnew%">%kotlinVersion%</a></b></p>
</tldr>

Kotlin 是一门现代编程语言, 它简洁, 跨平台, 而且能够与 Java 及其他语言交互.

你是刚刚开始学习 Kotlin 吗? 请参加我们的 Kotlin 之旅, 直接在浏览器内学习它的基础知识.

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

* **将 Kotlin 引入你的 Java 项目:**

    * [配置 Java 项目, 引入 Kotlin](mixing-java-kotlin-intellij.md)
    * [向你的 Java Maven 项目添加 Kotlin 测试](jvm-test-using-junit.md)

* **使用 Kotlin, 从头创建一个后端应用程序 :**

   * [使用 Spring Boot 创建一个 RESTful Web 服务](jvm-get-started-spring-boot.md)
   * [使用 Ktor 创建 HTTP API](https://ktor.io/docs/creating-http-apis.html)

</tab>

<tab id="cross-platform-mobile" title="跨平台">

在这里你将会学习如何使用 [Kotlin Multiplatform](get-started.topic) 来开发一个跨平台应用程序.

1. **[为跨平台开发设置环境](quickstart.md).**

2. **创建你的第一个 iOS 和 Android 应用程序:**

   * 从零开始创建一个跨平台应用程序, 并且:
      * [共用业务逻辑, 同时使用原生 UI](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html)
      * [共用业务逻辑和 UI](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html)
   * [让你的既有的 Android 应用程序在 iOS 上运行](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html)
   * [使用 Ktor 和 SQLDelight 创建跨平台应用程序](https://kotlinlang.org/docs/multiplatform/multiplatform-ktor-sqldelight.html)

3. **查看 [示例项目](https://kotlinlang.org/docs/multiplatform/multiplatform-samples.html)**.

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

## 获取支持 {id="get-support"}

如果你遇到任何困难和问题,
可以到 ![Slack](slack.svg){width=25}{type="joined"} Slack 寻求帮助: [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up),
或者到我们的 [问题追踪系统](https://youtrack.jetbrains.com/issues/KT) 提交报告.

## 没有找到需要的资料吗? {id="is-anything-missing"}

如果你没有找到需要的资料, 或对本页面内容感到疑惑, 请向我们 [反馈你的意见](https://surveys.hotjar.com/d82e82b0-00d9-44a7-b793-0611bf6189df).
