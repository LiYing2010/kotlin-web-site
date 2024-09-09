---
type: doc
layout: reference
category: "Introduction"
title: "跨平台移动应用程序开发"
---

# 什么是跨平台移动开发?

最终更新: {{ site.data.releases.latestDocDate }}

[//]: # (description: Cross-platform mobile development helps you save a lot of time and effort. See why many developers have already switched to this cost-efficient technology.)

目前, 很多公司面临一种挑战, 需要为多个平台创建移动 App, 尤其是 Android 和 iOS.
这导致了跨平台移动开发解决方案成为最流行的软件开发趋势之一.

根据 Statista 的统计, 在 2022 年第 3 季度, Google Play Store 有 355 万移动 App, App Store 有 160 万 App,
Android 和 iOS 合计现在已经占有 [全世界移动操作系统市场的 99%](https://gs.statcounter.com/os-market-share/mobile/worldwide).

你如何才能创建一个移动 App, 得到 Android 和 iOS 用户?
在本文中, 你将会看到为什么越来越多的移动开发工程师选择跨平台的, 或者叫做多平台的, 移动开发方案.

## 跨平台移动开发: 定义与解决方案

多平台移动开发是这样一种方案, 它让你能够创建单个移动应用程序, 平滑的运行在多个操作系统上.
在跨平台 App 中, 一部分甚至全部的源代码都可以共用.
这就意味着, 开发者可以创建并部署移动应用程序, 同时在 Android 和 iOS 上工作, 不需要为各个平台重复编写代码.

### 移动 App 开发的各种不同策略

要为 Android 和 iOS 创建应用程序, 主要有 4 种方式.

#### 1. 为每个操作系统创建独立的原生 App

在创建原生 App 时, 开发者会为一个特定的操作系统构建应用程序, 并且依赖于为这个平台专门设计的工具和编程语言:
对 Android 是 Kotlin 或 Java, 对 iOS 是 Objective-C 或 Swift.

这些工具和语言让你能够访问某个 OS 的功能特性, 还能够创造出 UI 符合直觉、反应灵敏的 App.
但如果你想要同时得到 Android 和 iOS 用户, 你就不得不为这两个平台分别创建应用程序, 这会耗费很多时间和精力.

#### 2. 渐进式 Web App(Progressive Web App, PWA)

渐进式 Web App(Progressive Web App) 将移动 App 的功能与 Web 开发中使用的解决方案结合在一起.
粗略的说, 渐进式 Web App 提供了网站和移动应用程序的一种混合. 开发者使用 Web 技术来创建 PWA, 例如 JavaScript, HTML, CSS, 以及 WebAssembly.

Web 应用程序不需要分别打包和发布, 而且可以在线发布.
可以通过你的计算机, 智能手机, 以及平板上的浏览器来访问, 不需要通过 Google Play 或 App Store 来安装.

缺点是, 使用者在使用 App 时不能利用他们设备上的全部功能, 例如, 通讯录, 日历, 电话, 以及其他资源, 因此导致用户体验比较差.
从 App 性能来说, 原生 App 是最好的.

#### 3. 跨平台 App

前面提到过, 多平台 App 会在不同的移动平台上以相同的方式运行.
跨平台框架允许你为开发这类 App 编写可共用的代码.

这种方案有很多优点, 例如在时间和成本方面都有很高效率. 我们会早后面的章节详细介绍跨平台移动开发的优点和弱点.

#### 4. 混合 App

在浏览网站和论坛时, 你可能注意到有些人用 _"跨平台移动开发"_ 和 _"混合移动开发"_ 这样的词汇来代表相同的意思.
但实际上这样的看法并不完全正确.

对于跨平台 App, 移动开发工程师只需要编写一次代码, 然后可以在不同的平台重用这些代码.
混合 App 开发则不同, 它是一种结合了原生和 Web 技术的方案.
它要求你将 Web 开发语言编写的代码, 例如 HTML, CSS, 或 JavaScript, 嵌入到原生 App 之内.
你可以通过框架的帮助来实现, 例如 Ionic Capacitor 和 Apache Cordova, 并使用额外的 plugin 来使用原生平台的功能.

跨平台和混合 开发之间唯一相似的地方是代码共用. 从性能方面看, 混合应用程序不如原生 App.
因为混合 App 使用单一的代码库, 有些功能可能限定于特定的 OS, 在其他 OS 上无法正确运行.

### 应该选择原生还是跨平台 App 开发: 长久的争论

[关于原生开发和跨平台开发的争论](native-and-cross-platform.html) 在技术社区始终未能结局.
这两种技术都在不断演化, 而且都有各自的优点, 也有各自的局限.

有些专家仍然偏向于原生移动开发, 而不是多平台解决方案, 他们认为原生 App 更好的性能和更好的用户体验, 是它最重要的优点.

但是, 很多现代化的业务需要减少发布上市的时间, 以及每个平台开发的成本, 还要同时提供 Android 和 iOS 版本.
这就是 [Kotlin Multiplatform (KMP)](https://kotlinlang.org/lp/multiplatform/)
之类的跨平台开发技术能够帮助你的地方,
正如 Netflix 的资深软件工程师 David Henry 和 Mel Yahya, [注意到](https://netflixtechblog.com/netflix-android-and-ios-studio-apps-kotlin-multiplatform-d6d4d8d25d23):

> 由于网络连接质量不佳的可能性很高, 这就导致我们倾向于移动解决方案, 以便实现更健壮的客户端持久化存储和离线支持.
> 对于快速生产发布的需求, 导致我们尝试多平台架构.
> 现在我们正在更进一步, 使用 Kotlin Multiplatform, 用 Kotlin 来一次性编写平台无关的业务逻辑,
> 然后将其编译为 Kotlin 库, 供 Android 使用, 以及原生的 Universal 框架, 供 iOS 使用.
{:.tip}

> [Kotlin Multiplatform 入门](https://www.jetbrains.com/kotlin-multiplatform/)
{:.note}

## 跨平台移动开发是否适合你?

选择一种适合于你的移动开发方案取决于很多因素, 例如业务需求, 目标, 任务. 和其它任何解决方案一样, 跨平台移动开发也有它的优点和弱点.

### 跨平台开发的优点

选择这种方案而不是其它方案的理由有很多.

#### 1. 代码可重用

通过跨平台编程, 移动开发工程师不需要为每个操作系统编写新的代码. 使用单一的代码库让开发者可以减少在重复工作上耗费的时间,
例如 API 调用, 数据存储, 数据序列化, 以及分析实现.

Kotlin Multiplatform 这样的技术让你能够只需要一次实现你的应用程序的数据, 业务, 以及表现层.
或者, 你可以逐渐的采用 KMP: 选择一小块频繁变化, 经常会不同步的逻辑, 例如数据校验, 过滤, 或排序;
让它跨平台; 然后将它以微型库的形式连接到你的项目.

在 JetBrains, 我们定期进行 Kotlin Multiplatform 调查, 询问我们的社区成员, 他们在不同平台之间共用哪些部分的代码.

<img src="/assets/docs/images/survey-results-q1-q2-22.png" alt="Kotlin Multiplatform 用户能够在不同平台上共用的代码" width="700"/>

#### 2. 节省时间

由于能够重用代码, 跨平台应用程序需要编写的代码较少, 对于编码工作来说, 代码越少越好.
可以节省开发时间, 因为你不需要编写太多代码. 而且, 代码行数越少, 发生 bug 的可能性越低, 因此测试和维护你的代码所花费的时间也更少.

#### 3. 高效的资源管理

构建不同的应用程序的代价是很高的. 使用单一的代码库可以帮助你更加有效的管理你的资源.
你的 Android 和 iOS 开发组都可以学习如何编写和使用共通的代码.

#### 4. 对开发者更有吸引力的工作机会

很多移动开发工程师将现代化的跨平台技术看作产品的技术栈中有吸引力的元素.
开发者可能会对那些重复的日常任务感到厌烦, 例如 JSON 解析.
但是, 新的技术和任务能够给他们带来对工作任务的激情, 积极性, 以及乐趣.
通过这样的方式, 采用现代化的技术栈,
实际上能够让你更容易为你的移动开发团队配备人员, 并使他们更长时间的保持参与和热情.

#### 5. 获得更多用户的机会

你可以不必在不同的平台之间做选择.
由于你的 App 能够兼容于多个操作系统, 因此你能够同时满足 Android 和 iOS 用户的需求, 获得最多的用户.

#### 6. 更快的上市时间和定制化时间

由于你不需要为不同的平台创建不同的 App, 因此你可以更快的开发并发布你的产品.
此外, 如果你的应用程序需要定制或移植, 对程序员来说, 对你的代码库的某个部分进行小的修改会容易得多.
这也可以帮助你更迅速的根据用户的反馈意见进行改进.

### 跨平台开发策略的难点

所有的解决方案都有自己的局限性.
技术社区的有些人认为, 跨平台开发仍然面临性能方面的问题.
而且, 项目主管可能担心, 如果他们集中努力优化开发过程, 可能对应用程序的用户体验产生不利的影响.

但是, 随着底层技术的进步, 跨平台解决方案正在变得更加 [稳定](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/), 更加适用, 更加灵活.

这里是关于框架使用情况的两次 Kotlin Multiplatform 用户调查的结果, 这 2 次调查相隔 6 个月:

<img src="/assets/docs/images/kmp-survey-results-2023.png" alt="Kotlin Multiplatform 使用状况调查结果" width="700"/>

另一个普遍担心的问题是, 跨平台开发无法无缝支持平台的原生功能.
然而, 使用 Kotlin Multiplatform, 你可以使用 Kotlin 的
[预期声明与实际声明(Expected and Actual Declarations)](multiplatform/multiplatform-expect-actual.html),
让你的跨平台应用程序能够访问平台相关的 API
预期声明与实际声明允许你在共同代码中定义你 "预期" 在多个平台上能够调用的相同的函数, 并提供 "实际" 实现,
通过 Kotlin 与 Java 和 Objective-C/Swift 的交互能力, 这些实际实现可以利用任何平台相关的库.

由于现代化的跨平台框架一直在持续进步, 它们不断的增强能力, 让移动开发工程师能够创建出类似于原生 App 的使用体验.
如果一个应用程序编写得足够好, 使用者将不会注意到区别.
但是, 你的产品的质量会严重依赖于你选择的跨平台 App 开发工具.

## 最流行的跨平台解决方案

[最流行的跨平台框架](cross-platform-frameworks.html) 包括 Flutter, React Native, 以及 Kotlin Multiplatform.
这些框架的每一种都有它的长处. 取决于你使用的工具, 你的开发过程和成果会很不一样.

### Flutter

Flutter 由 Google 创建, 是一个跨平台开发框架, 使用 Dart 编程语言. Flutter 支持原生功能, 例如定位服务, 摄像头功能, 以及硬盘访问.
如果你需要创建某个 Flutter 不支持的 App 功能, 你可以使用
[Platform Channel 技术](https://brightmarbles.io/blog/platform-channel-in-flutter-benefits-and-limitations/),
编写平台相关的代码.

使用 Flutter 构建的 App 需要共用它们所有的 UX 和 UI 层, 因此它们可能并不会 100% 感觉象原生 App.
这个框架最好的功能之一, 是它的热加载(Hot Reload)功能, 可以让开发者修改代码, 并立即看到结果.

对于以下情况, 这个框架可能是最好的选择:

* 你想要在你的 App 之间共用 UI 组件, 但你希望你的应用程序看起来接近原生 App.
* App 工作时会产生很重的 CPU/GPU 负载, 而且需要性能优化.
* 你需要开发 MVP(Minimum Viable Product, 最简可行产品) 应用程序.

使用 Flutter 构建的最流行的 App 包括 Google Ads, Alibaba 公司的 Xianyu, eBay Motors, 以及 Hamilton.

### React Native

Facebook 于 2015 年将 React Native 发布为开源框架, 它用于帮助移动开发工程师构建原生/跨平台 混合 App.
它基于 ReactJS – 一个用于构建 UI 的 JavaScript 库.
换句话说, 它使用 JavaScript 来为 Android 和 iOS 系统构建移动 App.

React Native 能够访问几种第三方 UI 库, 其中包含可以立即使用的组件, 帮助移动开发工程师在开发过程中节约时间.
与 Flutter 类似, 它提供了 Fast Refresh 功能, 你修改过代码后, 可以立即看到的结果.

对于以下情况, 你应该考虑为你的 App 使用 React Native:

* 你的应用程序相对简单, 轻量.
* 开发团队熟悉 JavaScript 或 React.

使用 React Native 构建的 App 包括 Facebook, Instagram, Skype, 以及 Uber Eats.

### Kotlin Multiplatform

Kotlin Multiplatform 是由 JetBrains 提供的开源技术, 它允许开发者跨平台共用代码, 同时又保留原生编程的优点.
它的关键优点包括:

* 能够在 Android, iOS, Web, Desktop, 以及 Server 端重用代码, 同时, 如果需要, 也可以保持原生代码.
* 与既有项目平滑集成. 你可以使用平台相关的 API, 充分利用原生开发和跨平台开发.
* 完全的代码共用灵活性, 能够共用逻辑和 UI,
  这要归功于 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/), 由 JetBrains 创建的一个现代化的声明式跨平台 UI 框架.
* 如果你已经在 Android 开发中使用了 Kotlin, 那么不需要向你的代码库引入新的语言.
  你可以继续沿用你的 Kotlin 代码和技能, 因此与其他技术相比, 迁移到 Kotlin Multiplatform 的风险更低.

> [Kotlin Multiplatform 入门](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html).
{:.note}

McDonald's, Netflix, 9GAG, VMware, Cash App, Philips, 以及其他很多公司都已经在利用 Kotlin Multiplatform 的逐步集成能力, 以及它比较低的采用风险.
其中一些公司选择共用他们既有的 Kotlin 代码的关键部分, 来增强应用程序稳定性.
另一些公司的目标是, 在不影响应用程序质量的情况下最大化代码的重用,
并在移动, 桌面, Web, 以及 TV 平台, 共用所有的应用程序逻辑, 同时在每个平台保留原生 UI.
从采用了这种方案的公司的成功故事来看, 它的优势是很明显的.

> 查看所有的 [全球公司和初创企业使用 Kotlin Multiplatform 的案例](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)
{:.note}

## 结论

由于跨平台开发解决方案一直在持续进化, 与它们提供的好处相比, 它们的弱点已经开始变少了.
目前市场上有很多技术可供选择, 各种技术适用于不同的工作流程和需求.
对开发团队来说, 本文讨论的每一种工具都代表一些参考信息, 鼓励他们考虑试验一下跨平台开发方案.

根本上来说, 你需要仔细考虑你自己的业务需求, 目标, 以及任务, 想清楚你通过你的 App 想要达到什么目标, 这将会有助于找到对你来说最好的解决方案.
