[//]: # (title: 使用 Kotlin 进行 Wasm 开发)

最终更新: %latestDocDate%

> Kotlin Wasm 目前处于 [Alpha 阶段](components-stability.md).
> 它随时有可能变更. 你可以将它用于正式产品之前的各种场景.
> 希望你能通过我们的 [问题追踪系统](https://kotl.in/issue) 提供你的反馈意见.
>
> [加入 Kotlin/Wasm 社区](https://slack-chats.kotlinlang.org/c/webassembly).
>
{style="note"}

Kotlin 能够构建应用程序, 并通过 Compose Multiplatform 和 Kotlin/Wasm, 将移动应用和桌面应用中的用户界面(UI) 重用在你的 Web 项目中.

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 是一个声明式框架, 
基于 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose),
通过它, 你可以一次性实现你的 UI, 然后在你的所有目标平台上共用 UI.
针对 Web 平台, Compose Multiplatform 使用 Kotlin/Wasm 作为编译目标.

[查看我们在线演示, 这是一个使用 Compose Multiplatform 和 Kotlin/Wasm 构建的应用程序](https://zal.im/wasm/jetsnack/)

![Kotlin/Wasm 演示](wasm-demo.png){width=700}

> 要在浏览器中运行 Kotlin/Wasm 构建的应用程序, 你需要使用支持新的垃圾收集和异常处理协议的浏览器版本.
> 关于各浏览器目前的支持状态, 请参见 [WebAssembly 路线图](https://webassembly.org/roadmap/).
>
{style="tip"}

[WebAssembly (Wasm)](https://webassembly.org/) 是一种二进制指令格式, 用于基于堆栈(stack-based)的虚拟机.
这种格式是平台独立的, 因为它运行在自己的虚拟机上.
Wasm 为 Kotlin 和其他编程语言提供了在 Web 上运行的编译目标.

Kotlin/Wasm 会将你的 Kotlin 代码编译为 Wasm 格式.
使用 Kotlin/Wasm, 你可以创建应用程序, 运行在不同的环境和设备上, 只要这些环境和设备支持 Wasm, 并满足 Kotlin 的要求.

你想自己尝试一下吗?

<a href="wasm-get-started.md"><img src="wasm-get-started-button.svg" width="700" alt="Kotlin/Wasm 入门"/></a>

## Kotlin/Wasm 的性能 {id="kotlin-wasm-performance"}

尽管 Kotlin/Wasm 还处于 Alpha 阶段，但在 Kotlin/Wasm 上运行的 Compose Multiplatform 已经表现出令人鼓舞的性能特性.
你可以看到, 它的执行速度超过了 JS, 接近于 JVM:

![Kotlin/Wasm 的性能](wasm-performance-compose.png){width=700}

我们会定期的在 Kotlin/Wasm 上运行基准测试(benchmark), 上面的结果来自我们在最新版本的 Google Chrome 上运行的测试结果.

## 对浏览器 API 的支持

Kotlin/Wasm 的标准库提供了浏览器 API 的声明 (包括 DOM API).
通过这些声明, 你可以直接使用 Kotlin API 来访问和使用浏览器的各种功能.
例如, 在你的 Kotlin/Wasm 应用程序中, 你可以操作 DOM 元素, 或使用 fetch API,
而不需要从头开始定义这些声明.
更多详情请参见我们的 [Kotlin/Wasm 浏览器示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/browser-example).

用于支持浏览器 API 的声明是通过 JavaScript [互操作能力](wasm-js-interop.md) 来定义的.
你可以使用同样的功能来定义你自己的声明.
此外, Kotlin/Wasm 与 JavaScript 互操作能力还允许你在 JavaScript 中使用 Kotlin 代码.
详情请参见 [在 JavaScript 中使用 Kotlin 代码](wasm-js-interop.md#use-kotlin-code-in-javascript).

## 留下你的意见反馈

### Kotlin/Wasm 意见反馈

* ![Slack](slack.svg){width=25}{type="joined"} Slack:
  在我们的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 频道, 直接向开发者提供你的意见反馈.
  [获得 Slack 邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).
* 在 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-56492) 中报告问题.

### Compose Multiplatform 意见反馈

* ![Slack](slack.svg){width=25}{type="joined"}
  Slack: 在 [#compose-web](https://slack-chats.kotlinlang.org/c/compose-web) 公开频道, 提供你的意见反馈.
* [在 GitHub 报告问题](https://github.com/JetBrains/compose-multiplatform/issues).

## 更多信息

* 在这个 [YouTube 播放列表](https://kotl.in/wasm-pl) 中, 学习 Kotlin/Wasm 的更多信息.
* 在我们的 GitHub 仓库中查看 [Kotlin/Wasm 示例](https://github.com/Kotlin/kotlin-wasm-examples).
