[//]: # (title: 为 Kotlin 项目贡献代码)

最终更新: %latestDocDate%

Kotlin 是一个开源项目, 使用 [Apache 2.0 许可协议](https://github.com/JetBrains/kotlin/blob/master/license/LICENSE.txt).
源代码, 工具, 文档, 已经本网站, 都在 [GitHub](https://github.com/jetbrains/kotlin) 维护.
尽管 Kotlin 主要由 JetBrains 开发, 但 Kotlin 项目还有几百名外部贡献者, 而且我们始终希望更多的开发者帮助我们.

## 参加早期预览(Early Access Preview)项目

你可以 [参加 Kotlin 早期预览(Early Access Preview, EAP) 项目](eap.md), 并想我们提供宝贵的反馈意见, 帮助我们改进 Kotlin.
 
对每一个正式发布版, Kotlin 都会发布几个预览版, 你可以在最新功能正式发布之前进行试用. 你可以向我们的问题追踪系统 [YouTrack](https://kotl.in/issue) 报告你发现的 bug, 我们会尝试在最终发布之前修复这些 bug. 通过这种方式, 你报告的 bug 可以比通常的 Kotlin 发布周期更快修复.

## 向编译器和标准库贡献代码

如果你想要向 Kotlin 编译器和标准库贡献代码, 可以访问 [JetBrains/Kotlin GitHub](https://github.com/jetbrains/kotlin),
下载最新的 Kotlin 版本,
然后按照文档
[如何向项目贡献代码](https://github.com/JetBrains/kotlin/blob/master/docs/contributing.md)
中的步骤进行.

你可以帮助我们解决 [未完成的任务](https://youtrack.jetbrains.com/issues/KT?q=tag:%20%7BUp%20For%20Grabs%7D%20and%20State:%20Open). 
请和我们保持联系, 因为我们可能会有一些疑问, 并对你提交的修改留下评论. 否则, 我们不能将你贡献的代码合并到项目中.

## 向 Kotlin IDE plugin 贡献代码

Kotlin IDE plugin 是 [IntelliJ IDEA 代码仓库](https://github.com/JetBrains/intellij-community/tree/master/plugins/kotlin) 的一部分.

要向 Kotlin IDE plugin 贡献代码, 请 clone [IntelliJ IDEA 代码仓库](https://github.com/JetBrains/intellij-community/),
然后按照文档
[如何贡献代码](https://github.com/JetBrains/intellij-community/blob/master/plugins/kotlin/CONTRIBUTING.md)
中的步骤进行.

## 向其他 Kotlin 库和工具贡献代码

除提供核心功能的标准库之外, Kotlin 还有很多额外的 (kotlinx) 库, 提供更多扩展功能. 
每个 kotlinx 库都在单独的代码仓库中开发, 拥有自己的版本和发布周期.

如果你想要对某个 kotlinx 库
(比如 [kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines)
或 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization))
和工具贡献代码, 请访问 [Kotlin GitHub](https://github.com/Kotlin), 选择你感兴趣的代码仓库, 并 clone 它.

然后按照各个库和工具的文档中的步骤进行, 比如
[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization/blob/master/CONTRIBUTING.md),
[ktor](https://github.com/ktorio/ktor/blob/master/CONTRIBUTING.md)
等等.

如果你有一个库, 可能对其他开发者很有用, 请通过 <feedback@kotlinlang.org> 联系我们.

## 向文档贡献代码

如果你在 Kotlin 文档中发现了问题, 
请 check out [文档的 GitHub 代码仓库](https://github.com/JetBrains/kotlin-web-site/tree/master/docs/topics),
并向我们发送一个 pull request.
请遵守 [关于风格和格式的指南](https://docs.google.com/document/d/1mUuxK4xwzs3jtDGoJ5_zwYLaSEl13g_SuhODdFuh2Dc/edit?usp=sharing).

请和我们保持联系, 因为我们可能会有一些疑问, 并对你提交的修改留下评论.
否则, 我们不能将你贡献的代码合并到项目中.

## 创建教程或视频

如果你为 Kotlin 创建了教程或视频, 请通过 <feedback@kotlinlang.org> 分享给我们. 

## 将文档翻译为其他语言

欢迎你将 Kotlin 文档翻译为你自己的语言, 并发布到你的网站.
但是, 我们不能将你的翻译存放到主代码仓库, 并发布到 [kotlinlang.org](https://kotlinlang.org/).

这个网站是 Kotlin 语言的官方文档, 并且我们会确保这里的所有信息是正确的, 并且是最新的.
不幸的是, 我们不能审核其他语言的文档. 

## 举办活动和演讲

如果已经或者在计划举办关于 Kotlin 的活动和演讲, 请填写 [这个表格](https://surveys.jetbrains.com/s3/Submit-a-Kotlin-Talk).
我们会将你的活动添加到 [活动列表](https://kotlinlang.org/docs/events.html).
