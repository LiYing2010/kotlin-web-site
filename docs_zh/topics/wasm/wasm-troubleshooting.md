[//]: # (title: 问题分析)

最终更新: %latestDocDate%

Kotlin/Wasm 依赖于新的 [WebAssembly 提案](https://webassembly.org/roadmap/),
例如垃圾收集和异常处理, 这些提案会为 WebAssembly 带来改进和新功能.

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

<p>&nbsp;</p>

> 要学习如何设置项目, 使用依赖项, 以及其他任务,
> 请参见我们的 [Kotlin/Wasm 示例](https://github.com/Kotlin/kotlin-wasm-examples#readme).
>
{style="tip"}
