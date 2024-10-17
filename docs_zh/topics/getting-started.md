[//]: # (title: Kotlin 入门)

Kotlin 是一门现代而成熟的编程语言, 设计目标是让开发者更加快乐.
它简洁, 安全, 能够与 Java 及其他语言交互, 并提供了很多方法在多个目标平台之间重用代码, 以提高开发效率.

作为入门学习, 请参加我们的 Kotlin 之旅. 这个教程包含 Kotlin 编程语言的基础知识.

<a href="kotlin-tour-welcome.md"><img src="start-kotlin-tour.svg" width="700" alt="开始 Kotlin 之旅"/></a>

## 安装 Kotlin {id="install-kotlin"}

Kotlin 包含在 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/studio) 每个发行版之内.
下载并安装这些 IDE 中的一个, 就可以开始使用 Kotlin 了.

## 使用 Kotlin 来创建强大的应用程序

<tabs>

<tab id="backend" title="后端应用程序">

下面是开发 Kotlin 服务端应用程序的开始步骤.

1. **创建你的第一个后端应用程序:**

   * 要从零开始创建, 可以 [使用 IntelliJ IDEA 项目向导创建基本的 JVM 应用程序](jvm-get-started.md).
   * 如果想要阅读更加复杂的示例, 请选择下面的框架来创建项目:

   <table width="100%" >
   <tr>
      <th>Spring</th>
      <th>Ktor</th>
   </tr>
   <tr>
   <td width="50%">
     一个成熟的框架群, 包含复杂的生态系统, 全世界数百万开发者广泛使用.
   <br/>
   <list>
      <li><a href="jvm-get-started-spring-boot.md">使用 Spring Boot 创建 RESTful Web 服务</a></li>
      <li><a href="https://spring.io/guides/tutorials/spring-boot-kotlin/">使用 Spring Boot 和 Kotlin 创建 Web 应用程序</a></li>
      <li><a href="https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/">使用 Spring Boot, Kotlin 协程(Coroutine) 和 RSocket</a></li>
   </list>
   </td>
   <td width="50%">
      一个轻量的框架, 面向那些希望自由进行架构决策的开发者.
   <list>
      <li><a href="https://ktor.io/docs/creating-http-apis.html">使用 Ktor 创建 HTTP API</a></li>
      <li><a href="https://ktor.io/docs/creating-web-socket-chat.html">使用 Ktor 创建 WebSocket 聊天程序</a></li>
      <li><a href="https://ktor.io/docs/creating-interactive-website.html">使用 Ktor 创建交互式网站</a></li>
      <li><a href="https://ktor.io/docs/heroku.html">发布 Kotlin 服务端应用程序: 在 Heroku 上使用 Ktor</a></li>
   </list>

   </td>
   </tr>
   </table>

2. **在你的应用程序中使用 Kotlin 和第三方库**. 详情请参见 [向你的项目添加库和工具依赖项](gradle-configure-project.md#configure-dependencies).
   * [Kotlin 标准库](https://kotlinlang.org/api/latest/jvm/stdlib/) 提供了大量有用的功能, 比如 [集合(Collection)](collections-overview.md) 和 [协程(Coroutine)](coroutines-guide.md).
   * 请参见 [用于 Kotlin 的第三方框架, 库, 和工具](https://blog.jetbrains.com/kotlin/2020/11/server-side-development-with-kotlin-frameworks-and-libraries/).

3. **关于服务器端开发的更多资料:**
   * [如何编写你的第一个 unit test](jvm-test-using-junit.md).
   * [如何在你的应用程序中混合使用 Kotlin 和 Java 代码](mixing-java-kotlin-intellij.md).

4. **加入 Kotlin 服务器端开发社区:**
   * ![Slack](slack.svg){width=25}{type="joined"} Slack: 首先 [得到邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up),
   然后加入 [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA),
   [#server](https://kotlinlang.slack.com/archives/C0B8RC352),
   [#spring](https://kotlinlang.slack.com/archives/C0B8ZTWE4),
   或 [#ktor](https://kotlinlang.slack.com/archives/C0A974TJ9) 频道.
   * ![StackOverflow](stackoverflow.svg){width=25}{type="joined"} StackOverflow: 订阅 ["kotlin"](https://stackoverflow.com/questions/tagged/kotlin),
   ["spring-kotlin"](https://stackoverflow.com/questions/tagged/spring-kotlin),
   和 ["ktor"](https://stackoverflow.com/questions/tagged/ktor) 标签.

5. **订阅 Kotlin 官方帐号**:
    ![Twitter](twitter.svg){width=18}{type="joined"} [Twitter](https://twitter.com/kotlin),
    ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/),
    和 ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw),
    不要错过重要的生态系统更新信息.

如果遇到任何困难和问题, 请向我们的 [YouTrack Bug 追踪系统](https://youtrack.jetbrains.com/issues/KT) 提交报告.

</tab>

<tab id="cross-platform-mobile" title="跨平台应用程序">

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
   * 关于 [Kotlin 跨平台开发](multiplatform-get-started.md).
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
  ![Twitter](twitter.svg){width=18}{type="joined"} [Twitter](https://twitter.com/kotlin),
  ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/),
  和 ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw),
  不要错过重要的生态系统更新信息.

如果遇到任何困难和问题, 请向我们的 [YouTrack Bug 追踪系统](https://youtrack.jetbrains.com/issues/KT) 提交报告.

</tab>

<tab id="android" title="Android 应用程序">

* 如果希望使用 Kotlin 进行 Android 开发, 请阅读 [Google 的 Kotlin Android 开发入门教程](https://developer.android.com/kotlin/get-started).

* 如果你是 Android 新手, 希望学习如何使用 Kotlin 创建应用程序, 请阅读 [这个 Udacity 课程](https://www.udacity.com/course/developing-android-apps-with-kotlin--ud9012).

订阅 Kotlin 官方帐号:
  ![Twitter](twitter.svg){width=18}{type="joined"} [Twitter](https://twitter.com/kotlin),
  ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/),
  和 ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw),
  不要错过重要的生态系统更新信息.

</tab>

</tabs>

## 没有找到需要的资料吗?

如果你没有找到需要的资料, 或对本页面内容感到疑惑, 请向我们 [反馈你的意见](https://surveys.hotjar.com/d82e82b0-00d9-44a7-b793-0611bf6189df).
