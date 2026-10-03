[//]: # (title: 支持的版本与配置)

<primary-label ref="beta"/>

本章介绍 [WebAssembly 提案](https://webassembly.org/roadmap/),
支持的浏览器, 以及使用 Kotlin/Wasm 进行高效开发的配置建议.

## 浏览器版本 {id="browser-versions"}

Kotlin/Wasm 依赖于最新的 WebAssembly 提案, 例如 [垃圾收集 (WasmGC)](#garbage-collection-proposal) 和
[异常处理](#exception-handling-proposal), 以便引入 WebAssembly 中的改进和新功能.

要确保这些功能能够正常工作, 请提供支持最新提案的环境.
请检查你的浏览器版本是否默认支持新的 WasmGC, 或者需要对环境进行更改.

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

由于这个原因, 我们强烈建议你将 Wasm 项目更新到最新版本的 Kotlin.
我们还建议你使用带有 Wasm 环境的最新版本浏览器.

### 异常处理提案 {id="exception-handling-proposal"}

Kotlin 工具链同时支持
[旧版本](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)
和 [新版本](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)
的异常处理提案. 这使得 Kotlin 生成的 Wasm 二进制文件能够在更广泛的环境中运行.

[`wasmJs` 目标平台](wasm-overview.md#kotlin-wasm-and-compose-multiplatform) 默认使用旧版本的异常处理提案.
要为 `wasmJs` 目标平台启用新版本的异常处理提案, 请使用 `-Xwasm-use-new-exception-proposal` 编译器选项.

不同的是, [`wasmWasi` 目标平台](wasm-overview.md#kotlin-wasm-and-wasi) 默认使用新版本的提案,
以确保更好的兼容现代 WebAssembly 运行环境.
要切换回旧版本的提案, 请使用 `-Xwasm-use-new-exception-proposal=false` 编译器选项.

对于 `wasmWasi` 目标平台, 采用新版本的异常处理提案是安全的.
针对这个环境的应用程序, 通常运行在较少差别的运行环境中(通常运行在单个特定的 VM 上),
运行环境通常由用户控制, 从而降低了兼容性问题的风险.

> 要学习如何设置项目, 使用依赖项, 以及其他任务,
> 请参见我们的 [Kotlin/Wasm 示例](https://github.com/Kotlin/kotlin-wasm-examples#readme).
>
{style="tip"}

## 使用默认导入 {id="use-default-import"}

[将 Kotlin/Wasm 代码导入到 Javascript](wasm-js-interop.md) 功能已经切换为命名导出(named export), 不再使用默认导出(default export).

如果你仍然想使用默认导入, 请生成一个新的 JavaScript 包装模块.
创建一个 `.mjs` 文件, 包含以下代码:

```Javascript
// 指定主 .mjs 文件的路径
import * as moduleExports from "./wasm-test.mjs";

export { moduleExports as default };
```

你可以将你的新 `.mjs` 文件放在资源文件夹中, 在构建过程中, 它会自动放在主 `.mjs` 文件的旁边.

也可以将你的 `.mjs` 文件放在自定义的位置.
这种情况下, 你需要手动将它移动到主 `.mjs` 文件旁边, 或者调整 import 语句中的路径, 以符合它的位置.

## Kotlin/Wasm 增量编译 {id="kotlin-wasm-incremental-compilation"}

Kotlin/Wasm 目标平台支持增量编译, 这个功能允许编译器只重编译最近的修改影响到的文件.
可以有助于减少编译时间.

Wasm 目标平台的增量编译默认启用.
要禁用它, 请向你的项目的 `local.properties` 或 `gradle.properties` 文件添加以下内容:

```properties
kotlin.incremental.wasm=false
```

## 完全限定类名的诊断 {id="diagnostics-in-fully-qualified-class-names"}

在 Kotlin/Wasm 上, 编译器默认不会在生成的二进制文件中存储类的完全限定名称(Fully Qualified Name, FQN),
以避免增大应用程序的大小.

由于这个原因, 在 Kotlin/Wasm 项目中调用 `KClass::qualifiedName` 属性时, 编译器会报告一个错误,
除非你明确的启用完全限定名称功能.

这个诊断默认启用, 错误会自动报告. 要禁用这个诊断, 并允许在 Kotlin/Wasm 中使用 `qualifiedName`,
请指示编译器为所有类存储完全限定名称, 方法是向你的 `build.gradle.kts` 文件添加以下选项:

```kotlin
// build.gradle.kts
kotlin {
    wasmJs {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-kclass-fqn")
        }
    }
}
```

请注意, 启用这个选项会增大应用程序的大小.

### 完全限定名称 {id="fully-qualified-names"}

在 Kotlin/Wasm 目标平台上, 完全限定名称(Fully Qualified Name, FQN) 在运行时可以使用, 不需要任何额外配置.
这意味着 `KClass.qualifiedName` 属性默认启用.

使用 FQN 可以提高代码从 JVM 到 Wasm 目标平台的可移植性,
并通过显示完全限定名称, 使运行时错误信息更加丰富.

## 数组越界访问与陷阱(trap) {id="array-out-of-bounds-access-and-traps"}

在 Kotlin/Wasm 中, 使用超出边界的索引访问数组, 会触发 WebAssembly 陷阱(trap), 而不是通常的 Kotlin 异常.
陷阱会立即停止当前的执行堆栈.

在 JavaScript 环境中运行时, 这些陷阱会表现为 `WebAssembly.RuntimeError`, 可以在 JavaScript 端捕获.

在 Kotlin/Wasm 环境中, 可以在链接可执行文件时, 使用以下命令行编译器选项, 避免这类陷阱:

```
-Xwasm-enable-array-range-checks
```

或者将其添加到 Gradle 构建文件的 `compilerOptions {}` 代码块中:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwasm-enable-array-range-checks")
    }
}
```

启用这个编译器选项后, 会抛出 `IndexOutOfBoundsException` 而, 不是陷阱.

更多详情和意见反馈, 请参见这个 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-73452/K-Wasm-turning-on-range-checks-by-default).

## 实验性注解 {id="experimental-annotations"}

Kotlin/Wasm 提供了几个实验性的注解, 用于一般的 WebAssembly 互操作性.

[`@WasmImport`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.wasm/-wasm-import/)
和 [`@WasmExport`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.wasm/-wasm-export/),
分别用于调用在 Kotlin/Wasm 模块外部定义的函数, 以及向宿主或其他 Wasm 模块公开 Kotlin 函数.

由于这些机制仍在演进中, 所有注解都被标记为实验性的.
你必须明确的表明 [使用者同意(opt in)](opt-in-requirements.md),
它们的设计或行为在未来的 Kotlin 版本中可能发生变化.

## 调试期间的重新加载 {id="reloads-during-debugging"}

在 [现代浏览器](#browser-versions) 中能够直接 [调试](wasm-debugging.md) 你的应用程序.
当你运行开发用的 Gradle task (`*DevRun`) 时, Kotlin 会自动向浏览器提供源代码文件.

但是, 默认提供源代码文件可能导致
[在 Kotlin 编译和打包完成之前, 在浏览器中反复重新加载应用程序](https://youtrack.jetbrains.com/issue/KT-80582/Multiple-reloads-when-using-webpack-dev-server-after-2.2.20-Beta2#focus=Comments-27-12596427.0-0).
作为变通方法, 请调整你的 webpack 配置, 忽略 Kotlin 源代码文件, 并禁用对提供的静态文件的监视.
在你的项目根目录下的 `webpack.config.d` 目录中, 添加一个 `.js` 文件, 包含以下内容:

```javascript
config.watchOptions = config.watchOptions || {
    ignored: ["**/*.kt", "**/node_modules"]
}

if (config.devServer) {
    config.devServer.static = config.devServer.static.map(file => {
        if (typeof file === "string") {
            return {
                directory: file,
                watch: false,
            }
        } else {
            return file
        }
    })
}
```
