---
type: doc
layout: reference
category:
title: "跨平台应用程序开发最流行的 6 种框架"
---

# 跨平台 App 开发最流行的 6 种框架
[//]: # (description:This article identifies the six most popular cross-platform app development frameworks and explains key things to consider when choosing a cross-platform tool for your project.)

最终更新: {{ site.data.releases.latestDocDate }}

过去几年, 跨平台 App 开发已经成为创建移动应用程序的最流行方式.
一个跨平台方案, 或者叫多平台方案, 能够帮助开发者创建 App, 在不同的移动平台上以类似的方式运行.

Google 搜索趋势图显示, 自从 2010 以来, 开发者对跨平台方案的兴趣一直在稳定增长:

<img src="/assets/docs/images/google-trends-cross-platform.png" alt="关于跨平台 App 开发的 Google 搜索趋势图" width="700"/>

快速进步的
[跨平台移动开发](cross-platform-mobile-development.html#kotlin-multiplatform)
技术的流行度增长, 导致市场上出现了更多的新工具.
面对这样多的选择, 要选择最适合你的一种可能会很困难.
为了帮助你找到正确的工具, 我们整理了一份列表, 包括 6 个最好的跨平台 App 开发框架, 以及它们各自的优秀功能.
在本文的最后, 你将看到为你的业务选择多平台开发框架时值得注意的几个关键因素.

## 什么是跨平台 App 开发框架?

移动开发工程师使用跨平台移动开发框架, 为多个平台(例如 Android 和 iOS)构建外观类似原生程序的应用程序, 只需要单个代码库.
与原生 App 开发相比, 代码共用是这种方案的关键优势之一.
只需要单个代码库意味着移动开发工程师不必为每个操作系统编写代码, 因此可以节省时间, 加快开发速度.

## 流行的跨平台 App 开发框架

这里列出的并不包括所有的框架; 现在市场上还有很多其他选择.
值得注意的是, 不存在完美的万能工具能够适合所有人. 对框架的选择 很大程度上取决于你的具体项目, 你的目标, 以及其他因素, 我们会在本文末尾进行介绍.

总之, 我们尽力列举出跨平台移动开发的一部分最好的框架, 作为你进行决策的参考.

### Flutter

2017 年由 Google 发布, Flutter 是一个流行的框架, 可以使用单一代码库来构建移动 App, Web App, 以及桌面 App.
要使用 Flutter 构建应用程序, 你需要使用 Google 的编程语言 Dart.

**编程语言:** Dart.

**移动应用程序示例:** eBay, Alibaba, Google Pay, ByteDance App.

**主要功能特性:**

* Flutter 的热加载(Hot Reload) 功能可以让你在修改代码后立即看到应用程序如何变化, 你不需要重新编译它.
* Flutter 支持 Google 的 Material Design, 这是一个设计系统, 帮助开发者构建数字化的用户体验.
  在构建你的 App 时, 你可以使用很多可视化元件(Visual Widget)和行为元件(Behavioral Widget).
* Flutter 不依赖于 Web 浏览器技术. 相反, 它使用自己的渲染引擎来描绘元件.

Flutter 拥有遍及全世界、相对活跃的用户社区, 并被很多开发者广泛使用.
根据 [Stack Overflow Trends](https://insights.stackoverflow.com/trends?tags=flutter%2Creact-native),
由于相应的 tag 的使用量不断增加, 可以看出 Flutter 的使用随着时间的推移呈增加趋势.

### React Native

一个开源 UI 软件框架, React Native 2015 年 (比 Flutter 稍早) 由 Meta Platforms 开发, 以前叫做 Facebook.
它基于 Facebook 的 JavaScript 库 React, 允许开发者构建原生渲染的跨平台移动 App.

**编程语言:** JavaScript.

**移动应用程序示例:** React Native 被应用于 Microsoft 公司的 Office, Skype, 以及 Xbox Game Pass; Meta 公司的 Facebook, Desktop Messenger, 以及 Oculus.
更多案例请参见 [React Native 案例展示](https://reactnative.dev/showcase).

**主要功能特性:**

* 由于拥有 Fast Refresh 功能, 开发者可以立即看到他们在他们的 React 组件中的变更.
* React Native 优势之一是集中于 UI. React primitives 会渲染为原生平台 UI 组件, 因此你可以构建自定义的、响应式的用户界面.
* 在 0.62 及之后版本, 默认启用了 React Native 和移动 App 调试器 Flipper 之间的集成.
  Flipper 用来调试 Android, iOS, 和 React native App, 它提供了很多工具, 例如日志查看器, 交互式布局查看器 , 以及网络监控器.

React Native 是最流行的跨平台 App 开发框架之一, 它拥有强大的开发者社区, 分享他们的技术知识.
感谢这些社区的存在, 你在使用这个框架构建移动 App 时可以得到你需要的支持.

### Kotlin Multiplatform

Kotlin Multiplatform (KMP) 是由 JetBrains 提供的开源技术, 它允许跨平台共用代码, 同时又保留原生编程的优点.
它允许开发者尽可能多的重用代码, 如果需要也可以编写原生代码, 并能够将共用的 Kotlin 代码无缝的集成到任何项目中.

**编程语言:** Kotlin.

**移动应用程序示例:** McDonald's, Netflix, Forbes, 9GAG, Cash App, Philips. [参见 Koltlin Multiplatform 使用案例](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html).

**主要功能特性:**

* 开发者能够在 Android, iOS, Web, Desktop, 以及 Server 端重用代码, 同时, 如果需要, 也可以保持原生代码.
* Kotlin Multiplatform 能够与任何项目无缝集成. 开发者可以使用平台相关的 API, 充分利用原生开发和跨平台开发.
* 感谢 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/), 由 JetBrains 创建的一个现代化的声明式跨平台 UI 框架,
  开发者拥有完全的代码共用灵活性, 能够共用逻辑和 UI.
* 如果你已经在 Android 开发中使用了 Kotlin, 那么不需要向你的代码库引入新的语言.
  你可以继续沿用你的 Kotlin 代码和技能, 因此与其他技术相比, 迁移到 Kotlin Multiplatform 的风险更低.

即使这个跨平台移动开发框架是我们的列表中最新的框架之一, 但它已经有了成熟的开发者社区.
2023年11月, JetBrains 将它提升到了 [稳定版](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/).
这个框架正在快速成长, 已经给今天的市场留下了深刻的印象.
由于它持续更新的 [文档](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 和社区支持, 你遇到问题时总是能够找到答案.
此外, 很多
[全球公司和初创企业已经在使用 Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)
来开发带有近似原生程序用户体验的多平台 App.

> 使用 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html) 创建你的第一个跨平台移动 App.
{:.note}

### Ionic

Ionic 是一个开源的移动 UI 工具库, 于 2013 发布.
它帮助开发者通过单一代码库创建跨平台移动应用程序, 它使用 Web 技术,
例如 HTML, CSS, 以及 JavaScript, 与 Angular, React, 以及 Vue 框架集成.

**编程语言:** JavaScript.

**移动应用程序示例:** T-Mobile, BBC (儿童与教育 App), EA Games.

**主要功能特性:**

* Ionic 基于一个 SaaS UI 框架, 专门针对移动 OS 设计, 提供了用于创建应用程序的很多 UI 组件.
* Ionic 框架 使用 Cordova 和 Capacitor plugin 来访问设备的内建功能, 比如摄像头, 手电筒, GPS, 以及录音机.
* Ionic 拥有自己的命令行, Ionic CLI, 它是构建 Ionic 应用程序的首选工具.

拥有持续活跃的 Ionic Framework 论坛, 社区成员在这里交流知识, 相互帮助, 解决他们在开发中遇到的问题.

### .NET MAUI

.NET Multi-platform App UI (.NET MAUI) 是一个跨平台框架, 2022年5月发布, 由 Microsoft 拥有.
它允许开发者使用 C# 和 XAML 创建原生的移动应用程序和桌面应用程序.
.NET MAUI 是 Xamarin.Forms 的后续, Xamarin.Forms 是 Xamarin 的功能之一, 它为 Xamarin 支持的平台提供原生控件.

**编程语言:** C#, XAML.

**移动应用程序示例:** NBC Sports Next, Escola Agil, Irth Solutions.

**主要功能特性:**

* .NET MAUI 提供跨平台 API 用于访问原生设备功能, 例如 GPS, 加速度计, 以及电池和网络状态.
* 有一个单一的项目系统, 可以使用多编译目标, 针对 Android, iOS, macOS, 以及 Windows 进行开发.
* 通过对 .NET 热重载(hot reload)的支持, 开发人员可以在应用程序正在运行时修改托管源代码(managed source code).

尽管 .NET MAUI 仍然是一个相对比较新的框架,
它已经得到了开发人员的关注, 并在 Stack Overflow 和 Microsoft Q&A 拥有活跃的社区.

### NativeScript

这个开源的移动应用程序开发框架初次发布于 2014 年.
NativeScript 可以帮助你构建 Android 和 iOS 移动 App, 使用的语言是 JavaScript, 或能够翻译到 JavaScript 的其他语言, 例如 TypeScript,
使用的框架是 Angular 和 Vue.js.

**编程语言:** JavaScript, TypeScript.

**移动应用程序示例:** Daily Nanny, Strudel, Breethe.

**主要功能特性:**

* NativeScript 允许开发者容易的访问 Android 和 iOS 原生 API.
* 这个框架渲染为平台原生的 UI. 使用 NativeScript 构建的 App 直接运行在原生设备上, 不需要依赖于 WebView,
  WebView 是 Android OS 的一个系统组件, 供 Android 应用程序在 App 内显示 Web 内容.
* NativeScript 提供了很多 plugin 和预构建的 App 模板, 因此不需要第三方解决方案.

NativeScript 基于广泛流行的 Web 技术, 例如 JavaScript 和 Angular, 这是很多开发者选择这个框架的原因.
然而, 它通常由小公司或初创企业采用.

## 你应该如何为你的项目选择正确的跨平台 App 开发框架?

除了上面列举的之外, 还有其它跨平台框架, 而且新的工具还会不断出现.
有了这么多的选择, 你怎么样才能为你的下一个项目找到正确的方案? 第一步是要理解你的项目的需求和目标, 清楚的理解你希望你的 App 是怎么样的.
然后, 你需要考虑下面这些重要因素, 然后你就可以决定哪个方案最适合于你的业务.

#### 1. 你的开发团队的专长

不同的跨平台移动开发框架基于不同的编程语言. 在采用一个框架之前, 首先要确认它要求的技能, 确认你的移动开发工程师团队具备了足够的知识和经验开使用这个框架.

例如, 如果你的开发团队拥有高度技能的 JavaScript 开发者, 而且你没有足够的资源来采用新的技术,
那么可能应该选择使用这个语言的框架, 例如 React Native.

#### 2. 开发商的可靠程度和支持程度

要确认框架的维护者未来还会长期支持它, 这是很重要的问题.
对于你正在考虑的框架, 应该了解开发和支持它的公司, 还要调查一下使用这些框架创建的移动 App 有哪些.

#### 3. UI 定制

根据 UI 对于你的 App 的重要性不同, 你可能需要了解使用某个框架时定制 UI 的难易程度.
例如, 通过 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/), 由 JetBrains 创建的一个现代化的声明式跨平台 UI 框架,
Kotlin Multiplatform 提供了完全的代码共用灵活性.
它允许开发者在 Android, iOS, Web, 以及 Desktop (通过 JVM) 平台之间共用 UI, 它基于 Kotlin 和 Jetpack Compose 开发.

> [Compose Multiplatform 入门](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-getting-started.html)
{:.note}

#### 4. 框架成熟度

要了解某个框架的 Public API 和工具的更新频度.
例如, 对原生操作系统组件的某些变更会破坏内部的跨平台行为.
使用移动 App 开发框架时, 最好了解你可能遇到的问题.
你也可以查看 GitHub, 看看这个框架目前还有多少 bug, 以及维护者如何处理这些 bug.

#### 5. 框架的能力

每个框架都有它自己的能力和缺陷. 了解框架提供了什么样的功能特性和工具, 对于寻找最好的解决方案是至关重要的.
它是否拥有代码分析和单元测试框架? 你在构建, 调试, 以及测试你的 App 时, 有多快, 有多容易?

#### 6. 安全性

在为商业创建重要的移动 App 时, 安全性和隐私是非常重要的, 例如, 包含支付系统的银行和电子商务 App.
根据 [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/),
移动 App 的最严重安全风险包括不安全的数据存储, 以及身份认证(Authentication)/用户授权(Authorization).

你需要确认你选择的多平台移动开发框架提供了必要的安全等级.
一种方法是, 如果框架拥有可供公共查看的问题追踪系统, 那么可以去查看其中的安全性问题.

#### 7. 教学资料

关于一个框架的学习资源的数量和质量, 也可以帮助你理解在使用这个框架时的体验会如何.
复杂的官方 [文档](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html),
线上和线下的会议, 以及教学课程是很好的迹象,
表示在你需要的时候, 你能够找到关于这个产品的足够的必要信息.

## 结束语

不考虑这些因素, 选择最适合你的特定需求的跨平台移动开发框架, 那将会很困难.
应该仔细考察你的应用程序的需求, 并以此为根据来评估各个框架的能力.
这样, 你就可以找到能够帮助你开发出高质量 App 的正确的跨平台解决方案.
