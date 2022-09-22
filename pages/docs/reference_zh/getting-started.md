---
type: doc
layout: reference
category:
title: "Kotlin 入门"
---

# Kotlin 入门

最终更新: {{ site.data.releases.latestDocDate }}

[Kotlin](https://kotlinlang.org) 是一门现代而成熟的编程语言, 目标是让开发者更加快乐.
它简洁, 安全, 能够与 Java 及其他语言交互, 并提供了很多方法在多个目标平台之间重用代码, 以提高开发效率.

让我们从构建一个强大的应用程序开始学习 Kotlin 吧!

## 学习 Kotlin 的基本知识

* 如果你已经熟悉一种或多种编程语言, 并且想要学习 Kotlin, 请从 [Kotlin 学习资料](learning-materials-overview.html) 开始阅读.
* 如果 Kotlin 是你学习的第一种编程语言, 我们建议从书籍 [Atomic Kotlin](https://www.atomickotlin.com/atomickotlin/) 开始阅读,
  或在 JetBrains 学院参加免费的 [Kotlin 基础课程](https://hyperskill.org/join/fromdocstoJetSalesStat?redirect=true&next=/tracks/18).

## 安装 Kotlin

Kotlin 包含在 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/studio) 每个发行版之内.  
下载并安装这些 IDE 中的一个, 就可以开始使用 Kotlin 了.

## 使用 Kotlin 来创建强大的应用程序

<div markdown="1" class="tabs">
  <ul>
    <li><a href="#backend">后端应用程序</a></li>
    <li><a href="#cross-platform-mobile">跨平台移动应用程序</a></li>
    <li><a href="#frontend">前端 Web 应用程序</a></li>
    <li><a href="#android">Android 应用程序</a></li>
    <li><a href="#multiplatform-library">跨平台库</a></li>
  </ul>


<div markdown="1" id="backend">

下面是开发 Kotlin 服务端应用程序的开始步骤.

1. **创建你的第一个后端应用程序:**

   * 要从零开始创建, 可以 [使用 IntelliJ IDEA 项目向导创建基本的 JVM 应用程序](jvm/jvm-get-started.html).
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
   <ul>
      <li><a href="jvm/jvm-spring-boot-restful.html">使用 Spring Boot 创建 RESTful Web 服务</a></li>
      <li><a href="https://spring.io/guides/tutorials/spring-boot-kotlin/">使用 Spring Boot 和 Kotlin 创建 Web 应用程序</a></li>
      <li><a href="https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/">使用 Spring Boot, Kotlin 协程(Coroutine) 和 RSocket</a></li>
   </ul>
   </td>
   <td width="50%">
      一个轻量的框架, 面向那些希望自由进行架构决策的开发者.
   <ul>
      <li><a href="https://ktor.io/docs/creating-http-apis.html">使用 Ktor 创建 HTTP API</a></li>
      <li><a href="https://ktor.io/docs/creating-web-socket-chat.html">使用 Ktor 创建 WebSocket 聊天程序</a></li>
      <li><a href="https://ktor.io/docs/creating-interactive-website.html">使用 Ktor 创建交互式网站</a></li>
      <li><a href="https://ktor.io/docs/heroku.html">发布 Kotlin 服务端应用程序: 在 Heroku 上使用 Ktor</a></li>
   </ul>

   </td>
   </tr>
   </table>

2. **在你的应用程序中使用 Kotlin 和第三方库**. 详情请参见 [向你的项目添加库和工具依赖项](gradle.html#configuring-dependencies).
   * [Kotlin 标准库](https://kotlinlang.org/api/latest/jvm/stdlib/) 提供了大量有用的功能, 比如 [集合(Collection)](collections-overview.html) 和 [协程(Coroutine)](coroutines/coroutines-guide.html).
   * 请参见 [用于 Kotlin 的第三方框架, 库, 和工具](https://blog.jetbrains.com/kotlin/2020/11/server-side-development-with-kotlin-frameworks-and-libraries/).

3. **关于服务器端开发的更多资料:**
   * [如何编写你的第一个 unit test](jvm/jvm-test-using-junit.html).
   * [如何在你的应用程序中混合使用 Kotlin 和 Java 代码](jvm/mixing-java-kotlin-intellij.html).

4. **加入 Kotlin 服务器端开发社区:**
   * <img src="{{ url_for('asset', path='docs/images/social/slack.svg') }}" alt="Slack" width="25" style="display:inline" />
   Slack: 首先 [得到邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up),
   然后加入 [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA),
   [#server](https://kotlinlang.slack.com/archives/C0B8RC352),
   [#spring](https://kotlinlang.slack.com/archives/C0B8ZTWE4),
   或 [#ktor](https://kotlinlang.slack.com/archives/C0A974TJ9) 频道.
   * <img src="{{ url_for('asset', path='docs/images/social/stackoverflow.svg') }}" alt="StackOverflow" width="25" style="display:inline" />
   StackOverflow: 订阅 ["kotlin"](https://stackoverflow.com/questions/tagged/kotlin),
   ["spring-kotlin"](https://stackoverflow.com/questions/tagged/spring-kotlin),
   和 ["ktor"](https://stackoverflow.com/questions/tagged/ktor) 标签.

5. **订阅 Kotlin 官方帐号**:
    <img src="{{ url_for('asset', path='docs/images/social/twitter.svg') }}" alt="Twitter" width="25" style="display:inline" /> [Twitter](https://twitter.com/kotlin),
    <img src="{{ url_for('asset', path='docs/images/social/reddit.svg') }}" alt="Reddit" width="25" style="display:inline" /> [Reddit](https://www.reddit.com/r/Kotlin/),
    和 <img src="{{ url_for('asset', path='docs/images/social/youtube.svg') }}" alt="YouTube" width="25" style="display:inline" /> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw),
    不要错过重要的生态系统更新信息.

如果遇到任何困难和问题, 请向我们的 [YouTrack Bug 追踪系统](https://youtrack.jetbrains.com/issues/KT) 提交报告.

</div>


<div markdown="1" id="cross-platform-mobile">

在这里你将会学习如何使用 [Kotlin 跨平台移动应用程序](https://kotlinlang.org/lp/mobile/) 来开发并改进你的跨平台移动应用程序 .

1. **[为跨平台移动应用程序开发设置环境](multiplatform-mobile/multiplatform-mobile-setup.html).**

2. **创建你的第一个 iOS 和 Android 应用程序:**

   * 要从零开始创建, 可以 [使用 IntelliJ IDEA 的项目向导创建一个基本的跨平台移动应用程序](multiplatform-mobile/multiplatform-mobile-create-first-app.html).
   * 如果你有已经存在的 Android 应用程序, 并且希望将它变为跨平台应用程序, 请阅读教程 [让你的 Android 应用程序在 iOS 上运行](multiplatform-mobile/multiplatform-mobile-integrate-in-existing-app.html).
   * 如果你想看看比较真实的示例程序, 请 clone 并查看既有的项目,
   比如 [实际动手(hands-on)教程](https://play.kotlinlang.org/hands-on/Networking%20and%20Data%20Storage%20with%20Kotlin%20Multiplatfrom%20Mobile/01_Introduction) 中的网络和数据存储项目,
   或者 [示例项目](multiplatform-mobile/multiplatform-mobile-samples.html) 中的示例.

3. **使用大量的跨平台库** 在共用模块中实现需要的业务逻辑. 详情请参见 [添加依赖项](multiplatform/multiplatform-add-dependencies.html).

   | 库              |详情|
----------------|-------|-------|
   | Ktor           |  [文档](https://ktor.io/docs/client.html).|
   | 序列化            |  [文档](serialization.html) 与 [示例](https://play.kotlinlang.org/hands-on/Networking%20and%20Data%20Storage%20with%20Kotlin%20Multiplatfrom%20Mobile/04_Creating_a_data_model).|
   | 协程(Coroutine)  | [文档](multiplatform-mobile/multiplatform-mobile-concurrency-overview.html) 与 [示例](multiplatform-mobile/multiplatform-mobile-concurrency-and-coroutines.html).|
   | 日期与时间          | [文档](https://github.com/Kotlin/kotlinx-datetime#readme).|
   | SQLDelight     | 第三方库. [文档](https://cashapp.github.io/sqldelight/).|

   > 在 [社区开发的库列表](https://libs.kmp.icerock.dev/) 中还能找到其他跨平台库.
   >
   {:.note}

4. **关于 Kotlin Multiplatform Mobile 的更多资料:**
   * 关于 [Kotlin 跨平台开发](multiplatform/multiplatform-get-started.html).
   * 阅读 [GitHub 上的示例程序](multiplatform-mobile/multiplatform-mobile-samples.html).
   * [创建并发布跨平台的库](multiplatform/multiplatform-library.html).
   * 使用 Kotlin Multiplatform 的真实案例:
   [Netflix](https://netflixtechblog.com/netflix-android-and-ios-studio-apps-kotlin-multiplatform-d6d4d8d25d23),
   [VMware](https://kotlinlang.org/lp/mobile/case-studies/vmware/),
   [Yandex](https://kotlinlang.org/lp/mobile/case-studies/yandex/),
   以及 [其他很多公司](https://kotlinlang.org/lp/mobile/case-studies/).

5. **加入 Kotlin 跨平台开发社区:**
   * <img src="{{ url_for('asset', path='docs/images/social/slack.svg') }}" alt="Slack" width="25" style="display:inline" />
    Slack: 首先[得到邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up),
    然后加入 [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA)
    和 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道.
   * <img src="{{ url_for('asset', path='docs/images/social/stackoverflow.svg') }}" alt="StackOverflow" width="25" style="display:inline" />
   StackOverflow: 订阅 ["kotlin-multiplatform"](https://stackoverflow.com/questions/tagged/kotlin-multiplatform) 标签.

6. **订阅 Kotlin 官方帐号**:
  <img src="{{ url_for('asset', path='docs/images/social/twitter.svg') }}" alt="Twitter" width="25" style="display:inline" /> [Twitter](https://twitter.com/kotlin),
  <img src="{{ url_for('asset', path='docs/images/social/reddit.svg') }}" alt="Reddit" width="25" style="display:inline" /> [Reddit](https://www.reddit.com/r/Kotlin/),
  和 <img src="{{ url_for('asset', path='docs/images/social/youtube.svg') }}" alt="YouTube" width="25" style="display:inline" /> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw),
  不要错过重要的生态系统更新信息.

如果遇到任何困难和问题, 请向我们的 [YouTrack Bug 追踪系统](https://youtrack.jetbrains.com/issues/KT) 提交报告.

</div>


<div markdown="1" id="frontend">

Kotlin 提供了一种功能, 可以将你的 Kotlin 代码, Kotlin 标准库, 以及任何兼容的依赖项, 转换为 JavaScript.

这里你将学习如何使用 [Kotlin/JS](js/js-overview.html) 开发并改进你的前端 Web 应用程序.

1. **创建你的第一个前端 Web 应用程序:**

   * 要从零开始创建, 可以 [使用 IntelliJ IDEA 的项目向导创建一个基本的浏览器应用程序](js/js-project-setup.html).
   * 如果想要阅读更加复杂的示例, 请阅读动手教程 [使用 React 和 Kotlin/JS 创建 Web 应用程序](js/js-react.html).
   这个教程包含了一个示例项目, 它可以当作一个很好的起点来开发你自己的项目, 其中还包含了很多有用的代码片段和模板.
   * 关于如何使用 Kotlin/JS 的更多信息请参见 [Kotlin/JS 示例](js/js-samples.html).

2. **在你的应用程序中使用.** 详情请参加 [添加依赖项](js/js-project-setup.html#dependencies).

   |库 | 详情 |
   |--------|---------|
   |[stdlib](https://kotlinlang.org/api/latest/jvm/stdlib/) | 所有项目包含默认的 Kotlin 标准库. |
   |[kotlinx.browser](js/browser-api-dom.html)| Kotlin 库, 用于访问浏览器相关功能, 包括典型的顶层对象, 比如 document 和 window. |
   |[kotlinx.html](js/typesafe-html-dsl.html) | Kotlin 库, 使用静态类型的 HTML 构建器生成 DOM 元素.|
   |[Ktor](https://ktor.io/) | Kotlin 跨平台库, 用于网络访问. |
   |[KVision](https://kvision.io/) | 第三方的 Kotlin/JS 面向对象 Web 框架.|
   |[fritz2](https://www.fritz2.dev/)| 第三方的轻量, 高性能, 独立的库, 用于使用 Kotlin 构建 reactive Web 应用程序, 大量依赖于协程(Coroutine)和数据流(Flow).|
   |[Doodle](https://nacular.github.io/doodle/) | 第三方的基于向量的(vector-based) UI 框架, 使用浏览器的功能来绘制用户界面.|
   |Compose for Web, [Compose Multiplatform](https://www.jetbrains.com/lp/compose-mpp/) 的一部分 | JetBrains 的框架, 可在浏览器端使用 [Google 的 Jetpack Compose UI toolkit](https://developer.android.com/jetpack/compose). |
   |[kotlin-wrappers](https://github.com/JetBrains/kotlin-wrappers) | 对最流行的 JavaScript 框架提供便利的抽象和深度集成. Kotlin wrappers 还支持很多相关技术, 比如 `react-redux`, `react-router`, 和 `styled-components`. |

3. **关于 Kotlin 前端 Web 开发的更多资料:**

   * [新的 Kotlin/JS IR 编译器](js/js-ir-compiler.html) (目前的稳定性是 [Beta](components-stability.html) 阶段).
   * [使用 npm 中的依赖项](js/using-packages-from-npm.html).
   * [在 JavaScript 中使用 Kotlin 代码](js/js-to-kotlin-interop.html).

4. **加入 Kotlin 前端 Web 开发社区:**
   * <img src="{{ url_for('asset', path='docs/images/social/slack.svg') }}" alt="Slack" width="25" style="display:inline" />
    Slack: 首先[得到邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up),
    然后加入 [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA)
    和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道.
   * <img src="{{ url_for('asset', path='docs/images/social/stackoverflow.svg') }}" alt="StackOverflow" width="25" style="display:inline" />
    StackOverflow: 订阅 ["kotlin-js"](https://stackoverflow.com/questions/tagged/kotlin-js) 标签.

5. **订阅 Kotlin 官方帐号**:
  <img src="{{ url_for('asset', path='docs/images/social/twitter.svg') }}" alt="Twitter" width="25" style="display:inline" /> [Twitter](https://twitter.com/kotlin),
  <img src="{{ url_for('asset', path='docs/images/social/reddit.svg') }}" alt="Reddit" width="25" style="display:inline" /> [Reddit](https://www.reddit.com/r/Kotlin/),
  和 <img src="{{ url_for('asset', path='docs/images/social/youtube.svg') }}" alt="YouTube" width="25" style="display:inline" /> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw),
  不要错过重要的生态系统更新信息.

如果遇到任何困难和问题, 请向我们的 [YouTrack Bug 追踪系统](https://youtrack.jetbrains.com/issues/KT) 提交报告.

</div>


<div markdown="1" id="android">

* 如果希望使用 Kotlin 进行 Android 开发, 请阅读 [Google 的 Kotlin Android 开发入门教程](https://developer.android.com/kotlin/get-started).

* 如果你是 Android 新手, 希望学习如何使用 Kotlin 创建应用程序, 请阅读 [这个 Udacity 课程](https://www.udacity.com/course/developing-android-apps-with-kotlin--ud9012).

订阅 Kotlin 官方帐号:
  <img src="{{ url_for('asset', path='docs/images/social/twitter.svg') }}" alt="Twitter" width="25" style="display:inline" /> [Twitter](https://twitter.com/kotlin),
  <img src="{{ url_for('asset', path='docs/images/social/reddit.svg') }}" alt="Reddit" width="25" style="display:inline" /> [Reddit](https://www.reddit.com/r/Kotlin/),
  和 <img src="{{ url_for('asset', path='docs/images/social/youtube.svg') }}" alt="YouTube" width="25" style="display:inline" /> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw),
  不要错过重要的生态系统更新信息.


</div>

<div markdown="1" id="multiplatform-library">

支持跨平台程序开发是 Kotlin 的重要益处之一. 它可以减少对不同的平台编写和维护重复代码所耗费的时间, 同时又保持了原生程序开发的灵活性和其他益处.

这里你将学习如何开发并发布跨平台的库:

1. **创建跨平台库:**

   * 请阅读教程 [创建并发布跨平台的库](multiplatform/multiplatform-library.html).
    这个教程介绍如何创建跨平台的库, 用于 JVM, JS, 和原生(Native)平台, 如何测试, 以及如何发布到本地的 Maven 仓库.
   * 通过 [这篇教程](multiplatform/multiplatform-full-stack-app.html),
    学习如何创建完整的 Web 应用程序.

2. **在你的应用程序中使用库.** 详情请参见 [添加库的依赖项](multiplatform/multiplatform-add-dependencies.html).

   |库| 详情                                                                                                     |
   |--------------------------------------------------------------------------------------------------------|-------|
   | Ktor | [文档](https://ktor.io/docs/) 与 [示例](multiplatform/multiplatform-full-stack-app.html#build-the-backend). |
   | 序列化 | [文档](serialization.html) 与 [示例](multiplatform/multiplatform-full-stack-app.html).                      |
   | 协程(Coroutine) | [文档](coroutines-overview.html).                                                                        |
   | 日期与时间	 | [文档](https://github.com/Kotlin/kotlinx-datetime#readme).                                               |

   > 在 [社区开发的库列表](https://libs.kmp.icerock.dev/) 中还能找到其他跨平台库.
   {:.note}

3. **关于 Kotlin 跨平台开发的更多资料:**

   * [Kotlin 跨平台程序开发](multiplatform/multiplatform-get-started.html).
   * [Kotlin 跨平台程序支持的平台](multiplatform/multiplatform-dsl-reference.html#target).
   * [Kotlin 跨平台程序开发的益处](multiplatform/multiplatform.html).

4. **加入 Kotlin 跨平台开发社区:**

   * <img src="{{ url_for('asset', path='docs/images/social/slack.svg') }}" alt="Slack" width="25" style="display:inline" />
   Slack: 首先[得到邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up),
   然后加入 [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA)
   和 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道.
   * <img src="{{ url_for('asset', path='docs/images/social/stackoverflow.svg') }}" alt="StackOverflow" width="25" style="display:inline" />
   StackOverflow: 订阅 ["kotlin-multiplatform"](https://stackoverflow.com/questions/tagged/kotlin-multiplatform) 标签.

5. **订阅 Kotlin 官方帐号**:
  <img src="{{ url_for('asset', path='docs/images/social/twitter.svg') }}" alt="Twitter" width="25" style="display:inline" /> [Twitter](https://twitter.com/kotlin),
  <img src="{{ url_for('asset', path='docs/images/social/reddit.svg') }}" alt="Reddit" width="25" style="display:inline" /> [Reddit](https://www.reddit.com/r/Kotlin/),
  和 <img src="{{ url_for('asset', path='docs/images/social/youtube.svg') }}" alt="YouTube" width="25" style="display:inline" /> [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw),
  不要错过重要的生态系统更新信息.

如果遇到任何困难和问题, 请向我们的 [YouTrack Bug 追踪系统](https://youtrack.jetbrains.com/issues/KT) 提交报告.

</div>

</div>



## 没有找到需要的资料吗?

如果你没有找到需要的资料, 或对本页面内容感到疑惑, 请向我们 [反馈你的意见](https://surveys.hotjar.com/d82e82b0-00d9-44a7-b793-0611bf6189df).
