[//]: # (title: FAQ)

### 什么是 Kotlin? {id="what-is-kotlin"}

Kotlin 是一种开源的, 静态类型的编程语言, 针对的目标平台是 JVM, Android, JavaScript, Wasm, 以及 Native 应用.
Kotlin 由 [JetBrains 公司](https://www.jetbrains.com) 开发.
Kotlin 项目开始于 2010 年, 并在很早的阶段开源. 第一次正式发布的 1.0 版是在 2016 年 2 月.

### Kotlin 的当前版本是多少? {id="what-is-the-current-version-of-kotlin"}

当前发布的版本是 %kotlinVersion%, 发布日期是 %kotlinReleaseDate%.
更多详情请参见 [GitHub](https://github.com/jetbrains/kotlin).

### Kotlin 是免费的吗? {id="is-kotlin-free"}

是的. Kotlin 是免费的, 现在是免费的, 以后也会继续免费.
它使用 Apache 2.0 许可协议, 源代码托管在 [GitHub](https://github.com/jetbrains/kotlin) 上.

### Kotlin 是面向对象式语言, 还是函数式语言? {id="is-kotlin-an-object-oriented-language-or-a-functional-one"}

Kotlin 既有面向对象的部分, 也有函数式的部分. 你可以以面向对象的方式使用它,
也可以以函数式的方式使用它, 或者也可以混合使用.
由于它对高阶函数, 函数类型, lambda 表达式等等特性的一级支持,
如果你在进行函数式编程, 或者正在学习的话, Kotlin 是一个很好的选择.

### Kotlin 能够向我提供哪些超出 Java 语言的功能? {id="what-advantages-does-kotlin-give-me-over-the-java-programming-language"}

Kotlin 更简洁. 粗略的估算显示, 代码行数可以减少大约 40%.
Kotlin 在类型安全方面也更强, 比如, 它支持 非 null 类型, 可以减少应用程序的空指针异常.
其他特性包括, 智能类型转换, 高阶函数, 扩展函数, 以及带接受者的 lambda 表达式,
可以编写出表达能力更高的代码, 此外还有创建 DSL 的能力.

### Kotlin 与 Java 语言兼容吗? {id="is-kotlin-compatible-with-the-java-programming-language"}

是的. Kotlin 100% 可以与 Java 语言交互, 而且重点保证你的既有代码可以与 Kotlin 正确交互.
你可以很容易地[在 Java 中调用 Kotlin 代码](java-to-kotlin-interop.md), 也可以反过来[在 Kotlin 中调用 Java 代码](java-interop.md).
这个能力使得采用 Kotlin 变得更容易, 更低风险.
另外还有
[IDE 中内置的 Java 到 Kotlin 源代码自动转换器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k),
可以大大简化既有代码的迁移工作.

### 我可以用 Kotlin 来做什么? {id="what-can-i-use-kotlin-for"}

Kotlin 可以用来做任何类型的开发, 可以用在 Web 服务器端, Web 客户端, 以及 Android 环境.
通过 Kotlin/Native 功能(目前正在开发的), 未来还将支持其他平台,
比如嵌入式系统, macOS 以及 iOS.
目前已有开发者使用 Kotlin 开发移动应用程序, 服务端应用程序,
JavaScript 或 JavaFX 的客户端应用程序, 以及数据科学, 这只是少部分例子.

### 我可以使用 Kotlin 进行 Android 开发吗? {id="can-i-use-kotlin-for-android-development"}

是的. Kotlin 在 Android 中已受到一级支持. Android 环境中已经有几百中应用程序使用 Kotlin 开发,
比如 Basecamp, Pinterest, 等等.
详情请参照 [Android 开发的相关资源](android-overview.md).

### 我可以使用 Kotlin 进行服务器端开发吗? {id="can-i-use-kotlin-for-server-side-development"}

是的. Kotlin 与 JVM 100% 兼容, 因此你可以使用任何既有的框架, 比如 Spring Boot, vert.x 或 JSF.
此外, 还有使用 Kotlin 编写的框架, 比如 [Ktor](https://github.com/kotlin/ktor).
详情请参见 [服务端端开发的相关资源](server-overview.md).

### 我可以使用 Kotlin 进行 Web 开发吗? {id="can-i-use-kotlin-for-web-development"}

是的. 除了用于 Web 后端开发之外, 你还可以使用 Kotlin/Wasm 来开发 Web 客户端.
参见 [Kotlin/Wasm 入门](wasm-get-started.md).

### 我可以使用 Kotlin 进行桌面开发吗? {id="can-i-use-kotlin-for-desktop-development"}

是的. 你可以使用任何 Java UI 框架, 比如 JavaFx, Swing, 或者其他框架.
此外, 还有专门的 Kotlin 框架, 比如 [TornadoFX](https://github.com/edvin/tornadofx).

### 我可以使用 Kotlin 进行原生(Native)程序开发吗? {id="can-i-use-kotlin-for-native-development"}

是的. Kotlin 项目包括了 Kotlin/Native. 它可以将 Kotlin 代码编译为原生代码, 运行时无需 VM.
你可以试用它, 用于流行的桌面和移动设备平台, 甚至还可以用于一部分 IoT 设备.
详情请参见 [Kotlin/Native 文档](native-overview.md).

### 有哪些 IDE 支持 Kotlin? {id="what-ides-support-kotlin"}

通过 JetBrains 开发的官方 Kotlin plugin, Kotlin 完全支持
[IntelliJ IDEA](https://www.jetbrains.com/idea/download/),
[Android Studio](https://developer.android.com/kotlin/get-started),
以及 [JetBrains Fleet](https://www.jetbrains.com/help/fleet/getting-started-with-kotlin-in-fleet.html).

其他 IDE 和源代码编辑器, 比如 Eclipse, Visual Studio Code, 和 Atom, 也有 Kotlin 社区支持的 plugin.

你也可以试用 [Kotlin Playground](https://play.kotlinlang.org), 在你的浏览器中编写, 运行, 并共享 Kotlin 代码.

此外, 还有一个 [命令行编译器](command-line.md), 可以编译并运行应用程序.

### 有哪些编译工具支持 Kotlin? {id="what-build-tools-support-kotlin"}

在 JVM 平台, 主流编译工具都支持 Kotlin,
包括 [Gradle](gradle.md), [Maven](maven.md), [Ant](ant.md),
以及 [Kobalt](https://beust.com/kobalt/home/index.html).
此外还有一些针对 JavaScript 平台的编译工具.

### Kotlin 编译输出的是什么? {id="what-does-kotlin-compile-down-to"}

在 JVM 平台, Kotlin 产生与 Java 兼容的字节码.

在 JavaScript 平台, Kotlin 产生 ES5.1 代码, 生成的代码兼容于 JavaScript 模块系统, 包括 AMD 和 CommonJS.

在 Native 平台, Kotlin 将(通过 LLVM)产生目标平台特有的代码.

### Kotlin 支持 JVM 的哪些版本? {id="which-versions-of-jvm-does-kotlin-target"}

Kotlin 允许你选择运行时的 JVM 版本. 默认情况下, Kotlin/JVM 编译器产生与 Java 8 兼容的字节码.
如果你希望利用更高版本 Java 中的优化功能, 你可以明确指定编译目标的 Java 版本, 可选的版本是从 9 到 21.
注意, 这时编译产生的字节码在低版本的 Java 环境可能无法运行.
从 [Kotlin 1.5](whatsnew15.md#new-default-jvm-target-1-8) 开始, 编译器不再产生与低于 Java 8 的版本兼容的字节码.

### Kotlin 难吗? {id="is-kotlin-hard"}

Kotlin 受到各种既有语言的启发, 比如 Java, C#, JavaScript, Scala 以及 Groovy.
我们努力确保 Kotlin 易于学习, 帮助开发者更容易转向 Kotlin, 可以在几天时间之内便能够读懂, 能够编写 Kotlin 代码.
学习 Kotlin 的惯用法, 使用某些高级特性可能会花费稍微长一点的时间, 但总的来说, Kotlin 不是一种复杂的语言.
详情请参见 [我们的学习资料](learning-materials-overview.md).

### 哪些公司在使用 Kotlin? {id="what-companies-are-using-kotlin"}

使用 Kotlin 的公司非常多, 难以全部列举, 但有些大公司已经通过 blog, 通过 GitHub 库, 或通过演讲, 公开宣布使用 Kotlin,
包括 [Square](https://medium.com/square-corner-blog/square-open-source-loves-kotlin-c57c21710a17),
[Pinterest](https://www.youtube.com/watch?v=mDpnc45WwlI),
[Basecamp](https://m.signalvnoise.com/how-we-made-basecamp-3s-android-app-100-kotlin-35e4e1c0ef12)
以及 [Corda](https://docs.corda.net/releases/release-M9.2/further-notes-on-kotlin.html).

### Kotlin 的开发者是谁? {id="who-develops-kotlin"}

Kotlin 主要是由 [JetBrains](https://www.jetbrains.com/) 公司的一个工程师团队(目前 100+ 人)开发的.
语言设计的领导者是 Michail Zarečenskij.
除了这个核心团队之外, 在 GitHub 上还有超过 250 人的外部贡献者.

### 在哪里可以得到 Kotlin 的更多信息? {id="where-can-i-learn-more-about-kotlin"}

最好从 [我们的网站](https://kotlinlang.org) 开始.
在这里, 你可以[下载编译器](command-line.md), [在线试运行代码](https://play.kotlinlang.org), 并访问各种资源.

### 是否有关于 Kotlin 的书籍? {id="are-there-any-books-on-kotlin"}

关于 Kotlin 有很多书籍. 其中一些经过我们的审核, 并推荐大家从这些书籍开始学习.
这些书籍已经列在 [Kotlin 书籍](books.md) 页面.
其他更多书籍, 请参见由社区维护的书籍列表, 位于 [kotlin.link](https://kotlin.link/) 网站.

### 是否有关于 Kotlin 的在线课程? {id="are-any-online-courses-available-for-kotlin"}

你可以通过 JetBrains Academy 的 [Kotlin 核心教程](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23) 来学习创建应用程序所需要的全部 Kotlin 基础知识.

你还可以学习这些课程:
* Kevin Jones 著: [Pluralsight 课程: Kotlin 入门](https://www.pluralsight.com/courses/kotlin-getting-started)
* Hadi Hariri 著: [O'Reilly 课程: Kotlin 编程介绍](https://www.oreilly.com/library/view/introduction-to-kotlin/9781491964125/)
* Peter Sommerhoff 著: [Udemy 课程: 面向初学者的 10 个 Kotlin 教程](https://petersommerhoff.com/dev/kotlin/kotlin-beginner-tutorial/)

也可以通过我们的 [YouTube 频道](https://www.youtube.com/c/Kotlin) 查看其他教程和内容.

### 有 Kotlin 开发者社区吗? {id="does-kotlin-have-a-community"}

是的! Kotlin 有一个很活跃的社区. Kotlin 开发者聚集在 [Kotlin 论坛](https://discuss.kotlinlang.org),
[StackOverflow](https://stackoverflow.com/questions/tagged/kotlin),
以及更活跃的 [Kotlin Slack](https://slack.kotlinlang.org) (到 2020 年 4 月, 成员接近 30000 人).

### 有 Kotlin 开发者活动吗? {id="are-there-kotlin-events"}

是的! 有很多专注于 Kotlin 的用户组, 以及聚会活动. 你可以
[在这个网站](https://kotlinlang.org/user-groups/user-group-list.html)
找到这类活动的列表.
此外, 还有 Kotlin 开发者社区在世界各地组织的
[Kotlin 之夜](https://kotlinlang.org/community/events.html)
活动.

### 有 Kotlin 开发者大会吗? {id="is-there-a-kotlin-conference"}

是的! [Kotlin 开发者大会](https://kotlinconf.com/) 由 JetBrains 公司每年举办一次,
这个大会聚集了来自全世界的开发者, 爱好者, 以及专家, 分享他们关于 Kotlin 的知识和经验.

除技术演讲和研讨之外, Kotlin 开发者大会还提供了的机会让大家建立关系网络, 组织社区活动, 以及社会活动,
参加者可以与其他 Kotlin 爱好者保持联系, 并交换思想.
Kotlin 开发者大会是培养和促进 Kotlin 生态系统内协作, 以及社区建设的平台.

在世界各地的各种开发者大会中也会涉及到 Kotlin.
你可以
[在这个网站](https://kotlinlang.org/community/talks.html?time=upcoming)
找到即将举行的演讲列表.

### Kotlin 是否有社交媒体帐号? {id="is-kotlin-on-social-media"}

是的.
请订阅 [Kotlin YouTube 频道](https://www.youtube.com/c/Kotlin), 并追随 Kotlin 的 [Twitter 帐号](https://twitter.com/kotlin).

### 是否有关于 Kotlin 的其他在线资源? {id="any-other-online-kotlin-resources"}

在各种网站上有很多 [在线资源](https://kotlinlang.org/community/), 包括社区成员编写的 [Kotlin Digests](https://kotlin.link),
一份 [通讯](http://kotlinweekly.net), 一个 [博客](https://talkingkotlin.com), 等等.

### 在哪里可以得到高分辨率的 Kotlin Logo? {id="where-can-i-get-an-hd-kotlin-logo"}

可以在 [这个地址](https://resources.jetbrains.com/storage/products/kotlin/docs/kotlin_logos.zip) 下载 Logo.
使用 Logo 时请注意遵守使用规则, 具体请参见压缩包中的 `guidelines.pdf` 文件包含的简单规则,
以及 [Kotlin 商标使用指南](https://kotlinfoundation.org/guidelines/).

详情请参见 [Kotlin 品牌资产](kotlin-brand-assets.md).
