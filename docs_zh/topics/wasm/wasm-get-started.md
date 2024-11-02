[//]: # (title: 使用 IntelliJ IDEA 开发 Kotlin/Wasm 入门)

> Kotlin/Wasm 功能处于 [Alpha 阶段](components-stability.md).
> 它随时有可能变更.
>
> [请加入 Kotlin/Wasm 开发社区.](https://slack-chats.kotlinlang.org/c/webassembly)
>
{style="note"}

本教程演示在 IntelliJ IDEA 中如何使用 [Kotlin/Wasm](wasm-overview.md) 运行 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 应用程序,
以及如何生成 artifact, 并发布为 [GitHub pages](https://pages.github.com/) 上的网站.

## 开始之前的准备步骤

使用 Kotlin Multiplatform 向导创建项目:

1. 打开 [Kotlin Multiplatform 向导](https://kmp.jetbrains.com/#newProject).
2. 在 **New Project** 页, 将项目名称 和 ID 修改为你喜欢的值. 在本教程中, 我们将项目名称设置为 "WasmDemo", ID 设置为 "wasm.project.demo".

   > 这些值是项目目录的名称和 ID. 你也可以使用原来的值, 不做修改.
   >
   {style="tip"}

3. 选择 **Web** 选项. 请确认没有选择其他选项.
4. 点击 **Download** 按钮, 将生成的压缩包文件解包.

![Kotlin Multiplatform 向导](wasm-compose-wizard.png){width=600}

## 在 IntelliJ IDEA 中打开项目

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/).
2. 在 IntelliJ IDEA 的欢迎界面, 点击 **Open**, 或在菜单栏选择 **File | Open**.
3. 导航到解包后的 "WasmDemo" 文件夹, 点击 **Open**.

## 运行应用程序

1. 在 IntelliJ IDEA 中, 选择菜单 **View** | **Tool Windows** | **Gradle**, 打开 **Gradle** 工具窗口.

   > 你需要至少 Java 11 以上版本, 用作你的 Gradle JVM, 才能成功装载 task.
   >
   {style="note"}

2. 在 **composeApp** | **Tasks** | **kotlin browser** 中, 选中并运行 **wasmJsBrowserRun** 任务.

   ![运行 Gradle 任务](wasm-gradle-task-window.png){width=600}

   或者, 你可以在终端窗口, 在 `WasmDemo` 根目录下运行以下命令:

   ```bash
   ./gradlew wasmJsBrowserRun -t
   ```

3. 应用程序启动之后, 在你的浏览器中打开下面的 URL:

   ```bash
   http://localhost:8080/
   ```

   > 端口号可能会变化, 因为 8080 端口可能不能使用.
   > 你可以在 Gradle 构建任务的控制台看到打印输出的实际端口号.
   >
   {style="tip"}

   你会看到一个 "Click me!" 按钮. 请点击它:

   ![Click me](wasm-composeapp-browser-clickme.png){width=650}

   现在你会看到 Compose Multiplatform 的 Logo:

    ![浏览器中的 Compose 应用程序](wasm-composeapp-browser.png){width=650}

## 生成 artifact

在 **composeApp** | **Tasks** | **kotlin browser** 中, 选中并运行 **wasmJsBrowserDistribution** 任务.

![运行 Gradle 任务](wasm-gradle-task-window-compose.png){width=600}

或者, 你可以在终端窗口, 在 `WasmDemo` 根目录下运行以下命令:

```bash
./gradlew wasmJsBrowserDistribution
```

应用程序任务结束之后, 你可以在 `composeApp/build/dist/wasmJs/productionExecutable` 目录中找到生成的 artifact 文件:

![Artifact 文件目录](wasm-composeapp-directory.png){width=600}

## 发布到 GitHub pages

1. 将你的 `productionExecutable` 目录中的所有内容复制到你想要创建网站的代码仓库.
2. 执行 GitHub 的 [创建你的网站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site) 说明文档中的指令.

   > 在你将变更 push 到 GitHub 之后, 可能需要花费 10 分钟才能将这些变更发布到你的网站.
   >
   {style="note"}

3. 在浏览器中, 访问你的 GitHub pages 的域名.

   ![访问 GitHub pages](wasm-composeapp-github-clickme.png){width=650}

   恭喜! 你已经将你的 artifact 发布到了 GitHub pages.

## 下一步做什么?

加入 Kotlin Slack 中的 Kotlin/Wasm 开发社区:

<a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="700" alt="加入 Kotlin/Wasm 开发社区" style="block"/></a>

试试 `kotlin-wasm-examples` 代码仓库中的 Kotlin/Wasm 示例:

* [Compose 图像浏览器](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
* [Jetsnack 应用程序](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
* [Node.js 示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
* [WASI 示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
* [Compose 示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)
