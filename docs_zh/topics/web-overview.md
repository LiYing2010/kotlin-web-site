[//]: # (title: 概述)

Kotlin 通过 Kotlin Multiplatform 提供了两种 Web 开发方案:

* [基于 JavaScript (使用 Kotlin/JS 编译器)](#kotlin-js)
* [基于 WebAssembly (使用 Kotlin/Wasm 编译器)](#kotlin-wasm)

两种方案都允许你在 Web 应用中共用代码, 但它们支持不同的使用场景.
它们在技术层面上也有所不同, 例如目标浏览器的支持情况.

## Kotlin/JS {id="kotlin-js"}

[Kotlin/JS](js-overview.md) 通过将你的代码, 标准库, 以及所有支持的依赖项转译为 JS,
使 Kotlin 应用程序能够在 JavaScript (JS) 环境中运行.

使用 Kotlin/JS 进行开发时, 你可以在浏览器或 Node.js 环境中运行你的应用程序.

> 关于配置 Kotlin/JS 目标平台, 请参见 [配置 Gradle 项目](gradle-configure-project.md#targeting-javascript) 向导.
>
{style="tip"}

### Kotlin/JS 的使用场景 {id="kotlin-js-use-cases"}

Kotlin/JS 非常适合以下情况:

* [与 JavaScript/TypeScript 代码库共用业务逻辑](#share-business-logic-with-a-javascript-typescript-codebase).
* [使用 Kotlin 构建不需要共用代码的 Web 应用程序](#build-web-apps-with-kotlin-without-sharing-the-code).

#### 与 JavaScript/TypeScript 代码库共用业务逻辑 {id="share-business-logic-with-a-javascript-typescript-codebase"}

如果你需要将 Kotlin 代码(例如领域逻辑或数据逻辑)与原生的 JavaScript/TypeScript 应用程序共用,
Kotlin/JS 目标平台提供以下功能:

* 与 JavaScript/TypeScript 的直接互操作性.
* 最小的互操作开销(例如, 避免不必要的数据复制).
  这使得共用代码能够平滑的集成到基于 JS 的工作流程中.

#### 使用 Kotlin 构建 Web 应用程序, 不共用代码 {id="build-web-apps-with-kotlin-without-sharing-the-code"}

对于 Web 应用程序完全由 Kotlin 实现, 而不需要与其他平台(iOS, Android 或 Desktop)共用代码的项目,
基于 HTML 的解决方案提供了更好的控制能力.

基于 HTML 的解决方案改善了 SEO 和可访问性.
它们还提供了更好的浏览器集成, 包括页面内搜索和页面翻译等功能.

对于基于 HTML 的解决方案, Kotlin/JS 支持多种方案:

* 使用基于 Compose 的 HTML 框架, 例如
  [Kobweb](https://kobweb.varabyte.com/) 或 [Kilua](https://kilua.dev/),
  以 Compose 风格的架构构建 UI.
* 使用带有 Kotlin 包装器的基于 React 的解决方案,
  实现 [Kotlin 中的 React 组件](js-react.md).

## Kotlin/Wasm {id="kotlin-wasm"}
<primary-label ref="beta"/>

[](wasm-overview.md) 将 Kotlin 代码编译为 WebAssembly (Wasm),
使应用程序能够在支持 Wasm 并且满足 Kotlin 要求的环境和设备上运行.

在浏览器中, Kotlin/Wasm 让你能够使用 [Compose Multiplatform](https://kotlinlang.org/compose-multiplatform/)
构建 Web 应用程序.
在浏览器之外, 它在独立的 Wasm 虚拟机中运行,
使用 [WebAssembly System Interface (WASI)](https://wasi.dev/) 来访问平台 API.

使用 Kotlin/Wasm 进行开发时, 你可以使用以下目标平台:

* **`wasmJs`**: 用于在浏览器或 Node.js 中运行.
* **`wasmWasi`**: 用于在支持 WASI 的 Wasm 环境中运行, 例如 Wasmtime, WasmEdge 等.

> 关于配置 Kotlin/Wasm 目标平台, 请参见 [配置 Gradle 项目](gradle-configure-project.md#targeting-webassembly) 向导.
>
{style="tip"}

### Kotlin/Wasm 的使用场景 {id="kotlin-wasm-use-cases"}

如果你希望在多个平台之间共用逻辑和 UI, 请使用 Kotlin/Wasm.

#### 使用 Compose Multiplatform 构建跨平台应用程序 {id="build-cross-platform-apps-with-compose-multiplatform"}

如果你希望在多个平台(包括 Web)之间共用逻辑和 UI,
Kotlin/Wasm 配合 [Compose Multiplatform](https://kotlinlang.org/compose-multiplatform/) 提供了共用的 UI 层:

* 确保所有平台的 UI 实现保持一致.
* 使用 Wasm 提升渲染性能, 实现更流畅的 UI 更新, 例如响应式动画.
* 支持最新版本的
  [WebAssembly Garbage Collection (WasmGC)](https://developer.chrome.com/blog/wasmgc) 提案,
  使 Kotlin/Wasm 能够在所有主流现代浏览器上运行.

## 选择你的 Web 方案 {id="choose-your-web-approach"}

根据你的使用场景, 下表总结了推荐的目标平台:

| 使用场景                  | 推荐的目标平台     | 说明                                                                                                                                      |
|-----------------------|-------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| 共用业务逻辑, 但使用 Web 原生 UI | Kotlin/JS   | 提供与 JS 的直接互操作性, 以及最小的开销.                                                                                                                |
| 同时共用 UI 和业务逻辑         | Kotlin/Wasm | 使用 [Compose Multiplatform](https://kotlinlang.org/compose-multiplatform/) 提供更好的渲染性能.                                                    |
| 不需要共用的 UI             | Kotlin/JS   | 允许使用基于 HTML 的框架(如 [Kobweb](https://kobweb.varabyte.com/), [Kilua](https://kilua.dev/), 或 [React](js-react.md)) 构建 UI, 使用现有的 JS 生态系统和工具. |

> 如果你需要关于选择合适目标平台的指导,
> 请加入我们的 [Slack 社区](https://slack-chats.kotlinlang.org/c/multiplatform).
> 你可以在这里提问关于平台之间的差别, 性能考量, 以及特定使用场景的推荐实践.
>
{style="note"}

## Web 目标平台的兼容模式 {id="compatibility-mode-for-web-targets"}

你可以为 Web 应用程序启用兼容模式, 以确保它能够在所有浏览器上直接使用.
在这种模式下, 你可以对现代浏览器使用 Wasm 构建 UI, 对较旧的浏览器则回退到 JS.

兼容模式通过对 `js` 和 `wasmJs` 两个目标平台进行交叉编译来实现.
[查看关于 Web 兼容模式及其启用方法的更多信息](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html#compatibility-mode-for-web-targets).
