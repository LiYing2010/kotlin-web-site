[//]: # (title: 介绍)

Dokka 是一个用于 Kotlin 的 API 文档引擎.

和 Kotlin 本身一样, Dokka 支持混合语言的项目.
它能够理解 Kotlin 的
[KDoc 注释](kotlin-doc.md#kdoc-syntax)
和 Java 的
[Javadoc 注释](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html).

Dokka 能够使用很多种格式生成文档, 包括它自己的现代化 [HTML 格式](dokka-html.md),
多种风格的 [Markdown 格式](dokka-markdown.md), 以及 Java 的 [Javadoc HTML 格式](dokka-javadoc.md).

下面是一些库, 它们使用 Dokka 来生成 API 参考文档:

* [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/)
* [Bitmovin](https://cdn.bitmovin.com/player/android/3/docs/index.html)
* [Hexagon](https://hexagontk.com/stable/api/)
* [Ktor](https://api.ktor.io/)
* [OkHttp](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)

要运行 Dokka, 你可以使用 [Gradle](dokka-gradle.md), [Maven](dokka-maven.md) 或者 [命令行](dokka-cli.md).
它也是 [高度插件化的](dokka-plugins.md).

要开始使用 Dokka, 首先请参见 [Dokka 入门](dokka-get-started.md) 文档.

## 社区 {id="community"}

在 [Kotlin Community Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中有专门的 `#dokka` 频道,
你可以在这里讨论 Dokka 相关的问题, 包括它的 plugin, 如何开发, 也可以与维护者保持接触.
