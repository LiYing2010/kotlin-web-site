[//]: # (title: Kotlin/Wasm)

> Kotlin/Wasm 目前处于 [Alpha 阶段](components-stability.md).
> 它随时有可能变更. 你可以将它用于正式产品之前的各种场景.
> 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 提供你的反馈意见.
>
> [加入 Kotlin/Wasm 社区](https://slack-chats.kotlinlang.org/c/webassembly).
>
{style="note"}

Kotlin/Wasm 能够将你的 Kotlin 代码编译为 [WebAssembly (Wasm)](https://webassembly.org/) 格式.
使用 Kotlin/Wasm, 你可以创建应用程序, 运行在不同的环境和设备上, 这些环境和设备要支持 Wasm, 并符合 Kotlin 的要求.

Wasm 是一种二进制指令格式, 用于基于堆栈(stack-based)的虚拟机.
这种格式是平台独立的, 因为它运行在自己的虚拟机上.
Wasm 为 Kotlin 和其他编程语言提供了编译目标.

你可以在不同的目标环境中使用 Kotlin/Wasm,
例如浏览器环境, 用于开发使用 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 构建的 Web 应用程序,
或浏览器之外的, 独立运行的 Wasm 虚拟机.
对于浏览器之外的情况, [WebAssembly System Interface (WASI)](https://wasi.dev/) 提供了对平台 API 的访问能力, 可以供你使用.

## Kotlin/Wasm 与 Compose Multiplatform {id="kotlin-wasm-and-compose-multiplatform"}

使用 Kotlin, 你能够构建应用程序, 并通过 Compose Multiplatform 和 Kotlin/Wasm,
将移动应用和桌面应用中的用户界面(UI) 在你的 Web 项目中重用.

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 是一个声明式框架,
基于 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose),
通过它, 你可以一次性实现你的 UI, 然后在你的所有目标平台上共用 UI.

针对 Web 平台, Compose Multiplatform 使用 Kotlin/Wasm 作为编译目标.
使用 Kotlin/Wasm 和 Compose Multiplatform 构建的应用程序使用 `wasm-js` 编译目标, 运行在浏览器内.

[查看我们在线演示, 这是一个使用 Compose Multiplatform 和 Kotlin/Wasm 构建的应用程序](https://zal.im/wasm/jetsnack/)

![Kotlin/Wasm 演示](wasm-demo.png){width=700}

> 要在浏览器中运行 Kotlin/Wasm 构建的应用程序, 你需要使用支持新的垃圾收集和旧的异常处理协议的浏览器版本.
> 关于各浏览器目前的支持状态, 请参见 [WebAssembly 路线图](https://webassembly.org/roadmap/).
>
{style="tip"}

另外, 在 Kotlin/Wasm 中你还可以直接使用最流行的 Kotlin 库.
和在其他的 Kotlin 和 Multiplatform 项目一样, 你可以在构建脚本中包含依赖项声明.
详情请参见 [添加跨平台库依赖项](multiplatform-add-dependencies.md).

你想自己尝试一下吗?

<a href="wasm-get-started.md"><img src="wasm-get-started-button.svg" width="600" alt="Kotlin/Wasm 入门" style="block"/></a>

## Kotlin/Wasm 与 WASI {id="kotlin-wasm-and-wasi"}

Kotlin/Wasm 使用 [WebAssembly System Interface (WASI)](https://wasi.dev/) 来开发服务器端应用程序.
使用 Kotlin/Wasm 和 WASI 构建的应用程序使用 Wasm-WASI 编译目标, 允许你调用 WASI API, 并在浏览器环境之外运行应用程序.

Kotlin/Wasm 利用 WASI 来抽象与平台相关的细节, 允许相同的 Kotlin 代码在各种不同的平台上运行.
这将 Kotlin/Wasm 扩展到 Web 应用程序之外, 而不必为每个运行环境进行自定义的处理.

WASI 提供了一个安全的标准接口, 可以在不同的环境中运行编译为 WebAssembly 的 Kotlin 应用程序.

> 关于 Kotlin/Wasm 和 WASI 的实际运用, 请参见 [Kotlin/Wasm 和 WASI 入门教程](wasm-wasi.md).
>
{style="tip"}

## Kotlin/Wasm 的性能 {id="kotlin-wasm-performance"}

尽管 Kotlin/Wasm 还处于 Alpha 阶段，但在 Kotlin/Wasm 上运行的 Compose Multiplatform 已经表现出令人鼓舞的性能特性.
你可以看到, 它的执行速度超过了 JS, 接近于 JVM:

![Kotlin/Wasm 的性能](wasm-performance-compose.png){width=700}

我们会定期的在 Kotlin/Wasm 上运行基准测试(benchmark), 上面的结果来自我们在最新版本的 Google Chrome 上运行的测试结果.

## 对浏览器 API 的支持 {id="browser-api-support"}

Kotlin/Wasm 的标准库提供了浏览器 API 的声明, 包括 DOM API.
通过这些声明, 你可以直接使用 Kotlin API 来访问和使用浏览器的各种功能.
例如, 在你的 Kotlin/Wasm 应用程序中, 你可以操作 DOM 元素, 访问 API, 而不需要从头开始定义这些声明.
更多详情请参见我们的 [Kotlin/Wasm 浏览器示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/browser-example).

用于支持浏览器 API 的声明是通过 JavaScript [互操作能力](wasm-js-interop.md) 来定义的.
你可以使用同样的功能来定义你自己的声明.
此外, Kotlin/Wasm 与 JavaScript 的互操作能力还允许你在 JavaScript 中使用 Kotlin 代码.
详情请参见 [在 JavaScript 中使用 Kotlin 代码](wasm-js-interop.md#use-kotlin-code-in-javascript).

## 留下你的意见反馈 {id="leave-feedback"}

### Kotlin/Wasm 意见反馈 {id="kotlin-wasm-feedback"}

* ![Slack](slack.svg){width=25}{type="joined"} Slack:
  [获得 Slack 邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up),
  然后在我们的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) 频道, 直接向开发者提供你的意见反馈.
  [获得 Slack 邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).
* 在 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-56492) 中报告问题.

### Compose Multiplatform 意见反馈 {id="compose-multiplatform-feedback"}

* ![Slack](slack.svg){width=25}{type="joined"}
  Slack: 在 [#compose-web](https://slack-chats.kotlinlang.org/c/compose-web) 公开频道, 提供你的意见反馈.
* [在 GitHub 报告问题](https://github.com/JetBrains/compose-multiplatform/issues).

## 更多信息 {id="learn-more"}

* 在这个 [YouTube 播放列表](https://kotl.in/wasm-pl) 中, 学习 Kotlin/Wasm 的更多信息.
* 在我们的 GitHub 仓库中查看 [Kotlin/Wasm 示例](https://github.com/Kotlin/kotlin-wasm-examples).
