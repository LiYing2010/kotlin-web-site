[//]: # (title: Kotlin/Wasm 与 Compose Multiplatform 入门)

<primary-label ref="beta"/> 

本教程演示在 IntelliJ IDEA 中如何使用 [](wasm-overview.md) 运行
[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 应用程序, 并生成能够发布为网站的 artifact.

## 创建项目 {id="create-a-project"}

1. [为 Kotlin Multiplatform 开发设置你的环境](quickstart.md#set-up-the-environment).
2. 在 IntelliJ IDEA 中, 选择 **File | New | Project**.
3. 在项目模板列表中, 选择 **Kotlin Multiplatform**.

   > 如果你没有使用 Kotlin Multiplatform IDE plugin, 那么可以使用 [KMP Web 向导](https://kmp.jetbrains.com/?web=true&webui=compose&includeTests=true) 来生成相同的项目.
   >
   {style="tip"}

4. 在 **New Project** 窗口中, 填写以下项目:

   * **Name:** WasmDemo
   * **Project ID:** wasm.project.demo

   > 本教程使用 `wasm.project.demo` 作为 Project ID, 以保持一致性.
   > 但是, 我们建议你保留你通常使用的 group ID, 例如 `org.example`.
   > 你在这里输入的内容, 将在未来的项目中作为建议使用的默认值.
   >
   {style="note"}

5. 选择 **Web** 编译目标和 **Share UI** 选项. 请确认没有选择其他选项.
6. 点击 **Create**.

   ![Kotlin Multiplatform 向导](wasm-kmp-wizard.png){width=600}

## 运行应用程序 {id="run-the-application"}

1. 项目载入完成后, 在运行配置列表中选择 **webApp [wasmJs]**, 然后点击 **Run**.

    ![在 Web 上运行 Compose Multiplatform 应用程序](compose-run-web-light.png){width=300}
    
    Web 应用程序将在你的浏览器中自动打开.
    或者, 在构建完成后, 你也可以手动打开以下 URL:

    ```shell
       http://localhost:8080/
    ```

    如果 `8080` 端口已被占用, 端口号可能会有所不同.
    你可以在 Gradle 构建的输出中找到实际的端口号.

2. 点击 **Click me!** 按钮. 这将显示 Compose Multiplatform 的 Logo:
    
    ![浏览器中的 Compose 应用程序](wasm-composeapp-browser.png){width=600}

## 生成 artifact {id="generate-artifacts"}

生成项目的 artifact, 用于发布到网站:

1. 选择菜单 **View** | **Tool Windows** | **Gradle**, 打开 **Gradle** 工具窗口.
2. 在 **WasmDemo** | **Tasks** | **kotlin browser** 中, 选中并运行 **wasmJsBrowserDistribution** 任务.

   > 你需要至少 Java 11 以上版本, 用作你的 Gradle JVM, 才能成功装载 task.
   > 对于 Compose Multiplatform 项目, 我们通常建议使用 Java 17 或更高版本.
   >
   {style="note"}

   ![运行 Gradle 任务](wasm-gradle-task-window-compose.png){width=400}

   或者, 你可以在终端窗口, 在 `WasmDemo` 根目录下运行以下命令:

    ```bash
    ./gradlew wasmJsBrowserDistribution
    ```

任务完成之后, 你可以在 `webApp/build/dist/wasmJs/productionExecutable` 目录中找到生成的 artifact 文件:

![Artifact 文件目录](wasm-composeapp-directory.png){width=400}

## 发布应用程序 {id="publish-the-application"}

使用生成的 artifact 来部署你的 Kotlin/Wasm 应用程序.
选择你喜欢的发布方式, 并按照相应的说明操作:

* [GitHub pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#creating-your-site)
* [Cloudflare](https://developers.cloudflare.com/workers/)
* [Apache HTTP Server](https://httpd.apache.org/docs/2.4/getting-started.html)

网站创建完成后, 在浏览器中访问你的发布平台的页面域名.
例如, 对于 GitHub pages:

   ![访问 GitHub pages](wasm-composeapp-github-clickme.png){width=600}

   恭喜! 你已经成功的发布了你的 artifact.

## 下一步做什么? {id="what-s-next"}

* [学习如何使用 Compose Multiplatform 在 iOS 和 Android 之间共用 UI](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html)
* 试试其它更多 Kotlin/Wasm 示例:

  * [KotlinConf 应用程序](https://github.com/JetBrains/kotlinconf-app)
  * [Compose 图像浏览器](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  * [Node.js 示例](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  * [WASI 示例](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  * [Compose 示例](https://github.com/Kotlin/kotlin-wasm-compose-template)

* 加入 Kotlin Slack 中的 Kotlin/Wasm 开发社区:

  <a href="https://slack-chats.kotlinlang.org/c/webassembly"><img src="join-slack-channel.svg" width="500" alt="加入 Kotlin/Wasm 开发社区" style="block"/></a>
