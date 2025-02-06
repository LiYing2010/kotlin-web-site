[//]: # (title: 问题分析)

> Kotlin/Wasm 还处于 [Alpha 阶段](components-stability.md).
> 它随时有可能变更.
> 请不要将它用于实际产品中.
> 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 提供你的反馈意见.
>
{style="note"}

Kotlin/Wasm 依赖于新的 [WebAssembly 提案](https://webassembly.org/roadmap/),
例如 [垃圾收集](#garbage-collection-proposal) 和 [异常处理](#exception-handling-proposal),
这些提案会为 WebAssembly 带来改进和新功能.

但是, 要确保这些功能能够正常工作, 你需要一个支持这些新提案的环境.
有些情况下, 你可能需要设置环境, 使它与这些新提案兼容.

## 浏览器版本 {id="browser-versions"}

要在浏览器中运行使用 Kotlin/Wasm 构建的应用程序,
你需要支持新的 [WebAssembly 垃圾收集 (WasmGC) 功能](https://github.com/WebAssembly/gc) 的浏览器版本.
请检查浏览器版本是否默认支持新的 WasmGC, 或者需要你对环境进行更改.

### Chrome {id="chrome"}

* **对于 119 或更高版本:**

  默认能够工作.

* **对于旧版本:**

  > 要在旧版本的浏览器中运行应用程序, 需要 Kotlin 1.9.20 以前的版本.
  >
  {style="note"}

  1. 在你的浏览器中, 进入 `chrome://flags/#enable-webassembly-garbage-collection`.
  2. 启用 **WebAssembly Garbage Collection**.
  3. 重新启动你的浏览器.

### 基于 Chromium 的浏览器 {id="chromium-based"}

包括基于 Chromium 的浏览器, 例如 Edge, Brave, Opera, 或 Samsung Internet.

* **对于 119 或更高版本:**

  默认能够工作.

* **对于旧版本:**

  > 要在旧版本的浏览器中运行应用程序, 需要 Kotlin 1.9.20 以前的版本.
  >
  {style="note"}

  使用 `--js-flags=--experimental-wasm-gc` 命令行参数运行应用程序.

### Firefox {id="firefox"}

* **对于 120 或更高版本:**

  默认能够工作.

* **对于 119 版本:**

  1. 在你的浏览器中, 进入 `about:config`.
  2. 启用 `javascript.options.wasm_gc` 选项.
  3. 刷新页面.

### Safari/WebKit {id="safari-webkit"}

* **对于 18.2 或更高版本:**

  默认能够工作.

* **对于旧版本:**

  不支持.

> Safari 18.2 在 iOS 18.2, iPadOS 18.2, visionOS 2.2, macOS 15.2, macOS Sonoma, 和 macOS Ventura 上可以使用.
> 在 iOS 和 iPadOS 上, Safari 18.2 与操作系统捆绑在一起.
> 要得到这个版本, 请将你的设备更新到 18.2 或更高版本.
>
> 详情请参见 [Safari 发布公告](https://developer.apple.com/documentation/safari-release-notes/safari-18_2-release-notes#Overview).
>
{style="note"}

## 对 Wasm 提案的支持 {id="wasm-proposals-support"}

Kotlin/Wasm 的改进是基于 [WebAssembly 提案](https://webassembly.org/roadmap/).
下面介绍关于对 WebAssembly 的垃圾收集和(旧的)异常处理提案的支持情况.

### 垃圾收集提案 {id="garbage-collection-proposal"}

从 Kotlin 1.9.20 开始, Kotlin 工具链使用最新版本的 [Wasm 垃圾收集](https://github.com/WebAssembly/gc) (WasmGC) 提案.

由于这个原因, 我们强烈建议你将 Wasm 项目更新到最新版的 Kotlin.
我们还建议 你使用带有 Wasm 环境的最新版浏览器.

### 异常处理提案 {id="exception-handling-proposal"}

Kotlin 工具链默认使用 [旧的异常处理提案](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md),
这个提案允许在更广泛的环境中运行生成的 Wasm 二进制文件.

从 Kotlin 2.0.0 开始, 我们在 Kotlin/Wasm 中引入了新版本 Wasm
[异常处理提案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)
的支持.

这个更新能够确保新的异常处理提案符合 Kotlin 的要求, 使得 Kotlin/Wasm 可以在只支持这个提案最新版本的虚拟机上使用.

新的异常处理提案需要使用 `-Xwasm-use-new-exception-proposal` 编译器选项来启用.
它默认是关闭的.

<p>&nbsp;</p>

> 要学习如何设置项目, 使用依赖项, 以及其他任务,
> 请参见我们的 [Kotlin/Wasm 示例](https://github.com/Kotlin/kotlin-wasm-examples#readme).
>
{style="tip"}

## 使用默认导入 {id="use-default-import"}

[将 Kotlin/Wasm 代码导入到 Javascript](wasm-js-interop.md) 功能已经切换到了命名导出(named export), 不再使用默认导出(default export).

如果你仍然想使用默认导入, 请生成一个新的 JavaScript 包装模块.
创建一个 `.mjs` 文件, 包括以下代码:

```Javascript
// 指定主 .mjs 文件的路径
import * as moduleExports from "./wasm-test.mjs";

export { moduleExports as default };
```

你可以将你的新 `.mjs` 文件放在资源文件夹, 在构建过程中, 它会自动放在主 `.mjs` 文件的旁边.

也可以将你的 `.mjs` 文件放在自定义的位置.
这种情况下, 你需要手动的将它移动到主 `.mjs` 文件旁边, 或者调整 import 语句中的路径, 以符合它的位置.

## Kotlin/Wasm 编译速度缓慢的问题 {id="slow-kotlin-wasm-compilation"}

在开发 Kotlin/Wasm 项目时, 你可能遇到编译速度缓慢的问题.
这是因为每次你进行修改时, Kotlin/Wasm 工具链都会重新编译整个代码库.

为了缓解这个问题, Kotlin/Wasm 编译目标支持增量编译, 允许编译器只重编译那些前次编译之后发生过修改的文件.

使用增量编译可以减少编译时间.
目前, 它能够将开发速度提高一倍, 在未来的发布版中, 还计划继续改进.

在目前的设置中, 默认禁用对 Wasm 编译目标的增量编译.
要启用它, 请向你的项目的 `local.properties` 或 `gradle.properties` 文件添加以下内容:

```text
kotlin.incremental.wasm=true
```

> 请试用 Kotlin/Wasm 增量编译, 并 [报告你的反馈意见](https://youtrack.jetbrains.com/issue/KT-72158/Kotlin-Wasm-incremental-compilation-feedback).
> 你的见解能够帮助这个功能尽快进入稳定版, 并默认启用.
>
{style="note"}
