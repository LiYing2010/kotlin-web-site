[//]: # (title: Kotlin/Wasm 与 WASI 入门)

> Kotlin/Wasm 目前处于 [Alpha ](components-stability.md) 版.
> 它随时有可能变更.
>
> [加入 Kotlin/Wasm 开发社区.](https://slack-chats.kotlinlang.org/c/webassembly)
>
{style="note"}

本教程演示如何在各种 WebAssembly 虚拟机中,
运行一个使用 [WebAssembly System Interface (WASI)](https://wasi.dev/) 的简单的 [Kotlin/Wasm](wasm-overview.md) 应用程序.

你会看到一个在 [Node.js](https://nodejs.org/en), [Deno](https://deno.com/), 和 [WasmEdge](https://wasmedge.org/) 虚拟机上运行的应用程序示例.
完成本教程后, 会得到一个简单的应用程序, 它使用标准的 WASI API.

目前, Kotlin/Wasm 支持 WASI 0.1, 也叫 Preview 1.
[我们计划在未来的发布版中支持 WASI 0.2](https://youtrack.jetbrains.com/issue/KT-64568).

> Kotlin/Wasm 工具链提供了可以直接使用的 Node.js tasks (`wasmWasiNode*`).
> 项目中的其他 task 变体, 例如使用 Deno 或 WasmEdge 的 task, 作为自定义的 task 提供.
>
{style="tip"}

## 开始前的准备工作 {id="before-you-start"}

1. 下载并安装最新版的 [IntelliJ IDEA](https://www.jetbrains.com/idea/).

2. 在 IntelliJ IDEA 中选择 **File | New | Project from Version Control**,
   clone [Kotlin/Wasm WASI 模板代码仓库](https://github.com/Kotlin/kotlin-wasm-wasi-template).

   你也可以通过命令行 clone 这个代码仓库:

   ```bash
   git clone git@github.com:Kotlin/kotlin-wasm-wasi-template.git
   ```

## 运行应用程序 {id="run-the-application"}

1. 选择 **View** | **Tool Windows** | **Gradle**, 打开 **Gradle** 工具窗口.

   项目装载完成后, 在 **Gradle** 工具窗口中, 你可以在 **kotlin-wasm-wasi-example** 之下看到 Gradle task.

   > 你需要至少 Java 11 以上版本, 用作你的 Gradle JVM, 才能成功装载 task.
   >
   {style="note"}

2. 在 **kotlin-wasm-wasi-example** | **Tasks** | **kotlin node** 之下, 选择并运行以下 Gradle task 中的一个:

   * **wasmWasiNodeRun** 在 Node.js 中运行应用程序.
   * **wasmWasiDenoRun** 在 Deno 中运行应用程序.
   * **wasmWasiWasmEdgeRun** 在 WasmEdge 中运行应用程序.

     > 在 Windows 平台上使用 Deno 时, 请确认安装了 `deno.exe`.
     > 详情请参见 [Deno 的安装文档](https://docs.deno.com/runtime/manual/getting_started/installation).
     >
     {style="tip"}

   ![Kotlin/Wasm 和 WASI task](wasm-wasi-gradle-task.png){width=600}

或者, 也可以在终端中, 在 ` kotlin-wasm-wasi-template` 的根目录下, 运行以下命令中的一个:

* 在 Node.js 中运行应用程序:

  ```bash
  ./gradlew wasmWasiNodeRun
  ```

* 在 Deno 中运行应用程序:

  ```bash
  ./gradlew wasmWasiDenoRun
  ```

* 在 WasmEdge 中运行应用程序:

  ```bash
  ./gradlew wasmWasiWasmEdgeRun
  ```

你的应用程序成功构建后, 终端会显示一条信息:

![Kotlin/Wasm and WASI app](wasm-wasi-app-terminal.png){width=600}

## 测试应用程序 {id="test-the-application"}

你也可以在不同的虚拟机中测试 Kotlin/Wasm 应用程序是否正确工作.

在 Gradle 工具窗口中, 在 **kotlin-wasm-wasi-example** | **Tasks** | **verification** 之下, 运行以下 Gradle task 中的一个:

* **wasmWasiNodeTest** 在 Node.js 中测试应用程序.
* **wasmWasiDenoTest** 在 Deno 中测试应用程序.
* **wasmWasiWasmEdgeTest** 在 WasmEdge 中测试应用程序.

![Kotlin/Wasm 和 WASI 测试 task](wasm-wasi-testing-task.png){width=600}

或者, 也可以在终端中, 在 ` kotlin-wasm-wasi-template` 的根目录下, 运行以下命令中的一个:

* 在 Node.js 中测试应用程序:

  ```bash
  ./gradlew wasmWasiNodeTest
  ```

* 在 Deno 中测试应用程序:
   
  ```bash
  ./gradlew wasmWasiDenoTest
  ```

* 在 WasmEdge 中测试应用程序:

  ```bash
  ./gradlew wasmWasiWasmEdgeTest
  ```

终端会显示测试结果:

![Kotlin/Wasm 和 WASI 测试](wasm-wasi-tests-results.png){width=600}

## 下一步做什么? {id="what-s-next"}

加入 Kotlin Slack 的 Kotlin/Wasm 开发社区:

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="Join the Kotlin/Wasm community" style="block"/></a>

尝试更多 Kotlin/Wasm 示例:

* [Compose image viewer](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
* [Jetsnack 应用程序](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/jetsnack)
* [Node.js 示例](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
* [Compose 示例](https://github.com/Kotlin/kotlin-wasm-compose-template)
