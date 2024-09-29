[//]: # (title: 使用 Kotlin 进行 JavaScript 开发)

最终更新: %latestDocDate%

Kotlin/JS 能够将你的 Kotlin 代码, Kotlin 标准库, 以及所有兼容的依赖项转换为 JavaScript.
Kotlin/JS 目前的实现针对 [ES5](https://www.ecma-international.org/ecma-262/5.1/) 标准.

推荐的方式是通过 `kotlin.multiplatform` Gradle 插件来使用 Kotlin/JS.
这个插件可以帮助你便利的集中配置和控制针对 JavaScript 的 Kotlin 项目.
其中包含了很多必要的功能, 比如控制你的应用程序的打包(Bundling), 通过 npm 直接添加 JavaScript 依赖项, 等等.
关于具体的选项, 详情请参见 [设置 Kotlin/JS 项目](js-project-setup.md).

## Kotlin/JS IR 编译器

[Kotlin/JS IR 编译器](js-ir-compiler.md) 与旧的默认编译器相比, 带来了许多改进.
比如, 它通过死代码消除, 改善了生成的可执行文件的尺寸,
而且与 JavaScript 生态系统的交互变得更加顺畅.

> 从 Kotlin 1.8.0 开始, 旧的编译器已被废弃.
> 
{style="note"}

通过从 Kotlin 代码生成 TypeScript 声明文件 (`d.ts`), IR 编译器使得 "混合(hybrid)" 应用程序的开发更加容易,
这种应用程序可以混合 TypeScript 和 Kotlin 代码, 也可以使用 Kotlin 跨平台项目来共用代码.

关于 Kotlin/JS IR 编译器的功能, 以及如何在项目中使用,
更多详情请参见 [Kotlin/JS IR 编译器文档](js-ir-compiler.md) 以及 [迁移向导](js-ir-migration.md).

## Kotlin/JS 框架 {id="kotlin-js-frameworks"}

现代的 Web 开发通过使用各种框架得到很大的益处, 框架可以简化 Web 应用程序的创建.
下面是可用于 Kotlin/JS 的一些流行的 Web 框架的例子:

### KVision

_KVision_ 是一个面向对象的 Web 框架, 可以使用 Kotlin/JS 编写应用程序, 可以通过各种现成的组件来组合成你的用户界面.
你可以使用响应式(reactive)或命令式(imperative)编程模式来创建你的前端,
然后使用 connector for Ktor, Spring Boot, 以及其他框架, 与你的服务端应用程序连接,
并使用 [Kotlin 跨平台程序](multiplatform.md) 来共用代码.

请 [访问 KVision 网站](https://kvision.io), 查看 KVision 的文档, 教程, 和示例.

关于框架的更新和讨论, 请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 的
[#kvision](https://kotlinlang.slack.com/messages/kvision)
和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道.

### fritz2

_fritz2_ 是一个独立的框架, 用于构建响应式(reactive) Web 用户界面.
它提供了自己的类型安全的 DSL 来构建和渲染 HTML 元素, 它使用 Kotlin 的协程(Coroutine)和数据流(Flow)来表达 UI 组件及其数据绑定.
它提供了状态管理, 校验, 路由, 以及很多其他功能, 并与 Kotlin 跨平台项目集成.

请 [访问 fritz2 网站](https://www.fritz2.dev), 查看 fritz2 的文档, 教程, 和示例.

关于框架的更新和讨论, 请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 的
[#fritz2](https://kotlinlang.slack.com/messages/fritz2)
和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道.

### Doodle

_Doodle_ 是一个用于 Kotlin/JS 的基于矢量的(vector-based) UI 框架.
Doodle 应用程序使用浏览器的图形功能来描绘用户界面, 而不是依赖于 DOM, CSS, 和 Javascript.
使用这种方法, Doodle 使你能够精确描绘任何 UI 元素, 矢量图形, 梯度(gradient), 以及定制的可视化图形.

请 [访问 Doodle 网站](https://nacular.github.io/doodle/), 查看 Doodle 的文档, 教程, 和示例.

关于框架的更新和讨论, 请加入 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 的
[#doodle](https://kotlinlang.slack.com/messages/doodle)
和 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道.

## 加入 Kotlin/JS 开发者社区

你可以加入官方 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
的 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道, 与开发者社区和开发团队交谈.
