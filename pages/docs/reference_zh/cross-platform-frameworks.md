---
type: doc
layout: reference
category:
title: "跨平台应用程序开发最流行的 6 种框架"
---

# 跨平台 App 开发最流行的 6 种框架
[//]: # (description:The six best cross-platform app development frameworks and explains some important things to consider when choosing a cross-platform tool for your project.)

最终更新: {{ site.data.releases.latestDocDate }}

过去几年, 跨平台 App 开发已经成为创建移动应用程序的最流行方式.
一个跨平台方案, 或者叫多平台方案, 能够帮助开发者创建 App, 在不同的移动平台上以类似的方式运行.

Google 搜索趋势图显示, 自从 2010 以来, 开发者对跨平台方案的兴趣一直在稳定增长:

<img src="/assets/docs/images/google-trends-crossplatform.png" alt="关于跨平台 App 开发的 Google 搜索趋势图" width="700"/>

快速进步的
[跨平台移动开发](https://kotlinlang.org/docs/cross-platform-mobile-development.html#kotlin-multiplatform-mobile)
技术的流行度增长, 导致市场上出现了更多的新工具.
面对这样多的选择, 要选择最适合你的一种可能会很困难.
为了帮助你找到正确的工具, 我们整理了一份列表, 包括 6 个最好的跨平台 App 开发框架, 以及它们各自的优秀功能.
在本文的最后, 你将看到为你的业务选择多平台开发框架时值得注意的几个关键因素.

## 什么是跨平台 App 开发框架?

移动开发工程师使用跨平台移动开发框架, 为多个平台(例如 Android 和 iOS)构建外观类似原生程序的应用程序, 只需要单个代码库.
与原生 App 开发相比, 代码共用是这种方案的关键优势之一.
只需要单个代码库意味着移动开发工程师不必为每个操作系统编写代码, 因此可以节省时间, 加快开发速度.

对移动 App 开发的跨平台解决方案的需求正在增长, 因此市场上的工具数量也在增加.
在下面的章节中, 我们会简要介绍那些为 iOS, Android, 和其他平台创建跨平台移动 App 的最广泛使用的框架.
我们的总结包括这些框架使用的编程语言, 以及它们的主要功能和优点.

## 流行的跨平台 App 开发框架

这里列出的并不包括所有的工具; 现在市场上还有很多其他选择.
值得注意的是, 不存在完美的万能工具能够适合所有人. 对框架的选择 很大程度上取决于你的具体项目, 你的目标, 以及其他因素, 我们会在本文末尾进行介绍.

总之, 我们尽力列举出跨平台移动开发的一部分最好的框架, 作为你进行决策的参考.

### Flutter

2017 年由 Google 发布, Flutter 是一个流行的框架, 可以使用单一代码库来构建移动 App, Web App, 以及桌面 App.
要使用 Flutter 构建应用程序, 你需要使用 Google 的编程语言 Dart.

**编程语言:** Dart.

**移动 App:** eBay, Alibaba, Google Pay, ByteDance App.

**主要功能特性:**

* Flutter 的热加载(Hot Reload) 功能可以让你在修改代码后立即看到应用程序如何变化, 你不需要重新编译它.
* Flutter 支持 Google 的 Material Design, 这是一个设计系统, 帮助开发者构建数字化的用户体验.
  在构建你的 App 时, 你可以使用很多可视化元件(Visual Widget)和行为元件(Behavioral Widget).
* Flutter 不依赖于 Web 浏览器技术. 相反, 它使用自己的渲染引擎来描绘元件.

Flutter 拥有遍及全世界、相对活跃的用户社区. 它被很多开发者广泛使用.
根据 [Stack Overflow 2021 年开发者调查](https://insights.stackoverflow.com/survey/2021#technology-most-loved-dreaded-and-wanted),
Flutter 是第 2 受欢迎的框架.

### React Native

一个开源 UI 软件框架, React Native 2015 年 (比 Flutter 稍早) 由 Meta Platforms 开发, 以前叫做 Facebook.
它基于 Facebook 的 JavaScript 库 React, 允许开发者构建原生渲染的跨平台移动 App.

**编程语言:** JavaScript.

**移动 App:** Skype, Bloomberg, Shopify, [Facebook 和 Instagram](https://itcraftapps.com/blog/7-react-native-myths-vs-reality/#facebook-instagram-in-react-native) 中的很多小模块.

**主要功能特性:**

* 由于拥有 Fast Refresh 功能, 开发者可以立即看到他们在他们的 React 组件中的变更.
* React Native 优势之一是集中于 UI. React primitives 会渲染为原生平台 UI 组件, 因此你可以构建自定义的、响应式的用户界面.
* 在 0.62 及以上版本, 默认启用了 React Native 和移动 App 调试器 Flipper 之间的集成.
  Flipper 用来调试 Android, iOS, 和 React native App, 它提供了很多工具, 例如日志查看器, 交互式布局查看器 , 以及网络监控器.

React Native 是最流行的跨平台 App 开发框架之一, 它拥有强大的开发者社区, 分享他们的技术知识.
感谢这些社区的存在, 你在使用这个框架构建移动 App 时可以得到你需要的支持.

### Kotlin Multiplatform Mobile

Kotlin Multiplatform Mobile 是由 JetBrains 开发的一个 SDK, 用来创建 Android 和 iOS App.
它可以让你在两个平台之间共用共通代码, 也可以在需要的时候编写平台专有的代码,
例如, 如果你需要构建原生 UI 组件, 或者需要使用平台专有 API 的情况.

**编程语言:** Kotlin.

**移动 App:** Philips, Baidu, Netflix, Leroy Merlin.

**主要功能特性:**

* 你可以很容易的在既有的项目中使用 Kotlin Multiplatform Mobile.
* Kotlin Multiplatform Mobile 允许你完全控制用户界面. 你可以利用最新的 UI 框架, 例如 SwiftUI 和 Jetpack Compose.
* 开发者可以很容易的访问 Android 和 iOS SDK, 没有任何限制.

即使这个跨平台移动开发框架是我们的列表中最新的一个, 但它已经有了成熟的开发者社区. 这个框架正在快速成长, 已经给今天的市场留下了深刻的印象.
由于它持续更新的文档和社区支持, 你遇到问题时总是能够找到答案.
此外, 很多
[全球公司和初创企业已经在使用 Kotlin Multiplatform Mobile](https://kotlinlang.org/lp/mobile/case-studies/)
来开发带有近似原生程序用户体验的多平台 App.

> 使用 [Kotlin Multiplatform Mobile](multiplatform-mobile/multiplatform-mobile-getting-started.html) 创建你的第一个跨平台移动 App.
{:.note}

### Ionic

Ionic 是一个开源 UI 工具库, 于 2013 发布.
它帮助开发者创建混合的移动 App 和桌面 App, 它使用一种原生技术和 Web 技术的组合, 例如 HTML, CSS, 以及 JavaScript, 与 Angular, React, 以及 Vue 框架集成.

**编程语言:** JavaScript.

**移动 App:** T-Mobile, BBC (儿童与教育 App), EA Games.

**主要功能特性:**

* Ionic 基于一个 SaaS UI 框架, 专门针对移动 OS 设计, 提供了用于创建应用程序的很多 UI 组件.
* Ionic 框架 使用 Cordova 和 Capacitor plugin 来访问设备的内建功能, 比如摄像头, 手电筒, GPS, 以及录音机.
* Ionic 拥有自己的 IDE, 称为 Ionic Studio, 用于构建 App 和创建 App 原型, 只需要极少的编码.

Ionic 拥有持续活跃的论坛, 社区成员在这里交流知识, 相互帮助, 解决他们在开发中遇到的问题.

### Xamarin

Xamarin 于 2011 年启动, 现在属于 Microsoft. 它是一个开源的跨平台 App 开发框架, 使用 C# 语言和 .Net 框架来为 Android, iOS, 和 Windows 开发 App.

**编程语言:** С#.

**移动 App:** UPS, Alaska Airlines, Academy Members (美国电影艺术与科学学院).

**主要功能特性:**

* Xamarin 应用程序使用 Base Class Library, 简称 .NET BCL, 一个巨大的类库, 包含大量复杂的功能特性, 例如 XML, 数据库, IO, 以及网络支持, 等等.
  既有的 C# 代码可以编译后在你的 App 中使用, 因此你可以使用很多库, 添加 BCL 之外的功能.
* 通过 Xamarin.Forms, 开发者可以利用平台专有的 UI 元素, 在不同的操作系统上为他们的 App 实现统一的外观.
* Xamarin.Forms 中的编译的绑定(Compiled Binding) 可以提升数据绑定的性能. 使用这些绑定可以对所有的绑定表达式实现编译期间的校验.
  使用这个功能, 移动开发工程师可以减少运行期间的错误.

Xamarin 由遍及全世界的贡献者们提供支持, 在创建移动 App 的 C, C++, 和 C# 开发者中间尤其流行.

### NativeScript

这个开源的移动应用程序开发框架初次发布于 2014 年.
NativeScript 可以帮助你构建 Android 和 iOS 移动 App, 使用的语言是 JavaScript, 或能够翻译到 JavaScript 的其他语言, 例如 TypeScript,
使用的框架是 Angular 和 Vue.js.

**编程语言:** JavaScript, TypeScript.

**移动 App:** Daily Nanny, Strudel, Breethe.

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
例如, Kotlin Multiplatform Mobile 允许你完全控制 UI, 而且可以使用最新的 UI 框架, 例如 SwiftUI 和 Jetpack Compose.

#### 4. 框架成熟度

要了解某个框架的 Public API 和工具的更新频度. 例如, 对原生操作系统组件的某些变更会破坏内部的跨平台行为.
使用移动 App 开发框架时, 最好了解你可能遇到的问题.
你也可以查看 GitHub, 看看这个框架目前还有多少 bug, 以及维护者如何处理这些 bug.

#### 5. 框架的能力

每个框架都有它自己的能力和缺陷. 了解框架提供了什么样的功能特性和工具, 对于寻找最好的解决方案是至关重要的.
它是否拥有代码分析和单元测试框架? 你在构建, 调试, 以及测试你的 App 时, 有多快, 有多容易?

#### 6. 在不同平台上的一致性

在多个平台上实现一致性可能会很困难, 取决于象 Android 和 iOS 这样的平台有多少显著的差异, 尤其是在开发经验的角度.
例如, 在这些操作系统上的工具和库是不一样的, 因此可能业务逻辑会有很多差别.
某些技术, 例如 Kotlin Multiplatform Mobile, 可以让你编写 App 的业务逻辑, 并在 Android 和 iOS 平台上共用.

#### 7. 安全性

在为商业创建重要的移动 App 时, 安全性和隐私是非常重要的, 例如, 包含支付系统的银行和电子商务 App.
根据 [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/),
移动 App 的最严重安全风险包括不安全的数据存储, 身份认证(Authentication), 以及用户授权(Authorization).

你需要确认你选择的多平台移动开发框架提供了必要的安全等级.
一种方法是, 如果框架拥有可供公共查看的问题追踪系统, 那么可以去查看其中的安全性问题.

#### 8. 教学资料

关于一个框架的学习资源的数量和质量, 也可以帮助你理解在使用这个框架时的体验会如何.
复杂的官方 [文档](https://kotlinlang.org/docs/home.html), 线上和线下的回忆, 以及教学课程是很好的迹象,
表示在你需要的时候, 你能够找到关于这个产品的足够的必要信息.

## 结束语

不考虑这些因素, 选择最适合你的特定需求的跨平台移动开发框架, 那将会很困难.
应该仔细考察你的应用程序的需求, 并以此为根据来评估各个框架的能力.
这样, 你就可以找到能够帮助你开发出高质量 App 的正确的跨平台解决方案.
