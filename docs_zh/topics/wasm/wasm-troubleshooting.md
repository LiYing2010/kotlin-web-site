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

## 浏览器版本

要在浏览器中运行使用 Kotlin/Wasm 构建的应用程序,
你需要支持新的 [WebAssembly 垃圾收集 (WasmGC) 功能](https://github.com/WebAssembly/gc) 的浏览器版本.
请检查浏览器版本是否默认支持新的 WasmGC, 或者需要你对环境进行更改.

### Chrome

* **对于 119 或以上版本:**

  默认能够工作.

* **对于旧版本:**

  > 要在旧版本的浏览器中运行应用程序, 需要 Kotlin 1.9.20 以前的版本.
  >
  {style="note"}

  1. 在你的浏览器中, 进入 `chrome://flags/#enable-webassembly-garbage-collection`.
  2. 启用 **WebAssembly Garbage Collection**.
  3. 重新启动你的浏览器.

### 基于 Chromium 的浏览器

包括基于 Chromium 的浏览器, 例如 Edge, Brave, Opera, 或 Samsung Internet.

* **对于 119 或以上版本:**

  默认能够工作.

* **对于旧版本:**

  > 要在旧版本的浏览器中运行应用程序, 需要 Kotlin 1.9.20 以前的版本.
  >
  {style="note"}

  使用 `--js-flags=--experimental-wasm-gc` 命令行参数运行应用程序.

### Firefox

* **对于 120 或以上版本:**

  默认能够工作.

* **对于 119 版本:**

  1. 在你的浏览器中, 进入 `about:config`.
  2. 启用 `javascript.options.wasm_gc` 选项.
  3. 刷新页面.

### Safari/WebKit

WebAssembly 垃圾收集功能的支持目前正在 [积极开发中](https://bugs.webkit.org/show_bug.cgi?id=247394).

## 对 Wasm 提案的支持

Kotlin/Wasm 的改进是基于 [WebAssembly 提案](https://webassembly.org/roadmap/).
下面介绍关于对 WebAssembly 的垃圾收集和异常处理提案的支持情况.

### 垃圾收集提案 {id="garbage-collection-proposal"}

从 Kotlin 1.9.20 开始, Kotlin 工具链使用最新版本的 [Wasm 垃圾收集](https://github.com/WebAssembly/gc) (WasmGC) 提案.

由于这个原因, 我们强烈建议你将 Wasm 项目更新到最新版的 Kotlin.
我们还建议 你使用带有 Wasm 环境的最新版浏览器.

### 异常处理提案 {id="exception-handling-proposal"}

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

## 使用默认导入

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
