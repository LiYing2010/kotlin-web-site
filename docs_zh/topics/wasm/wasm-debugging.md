[//]: # (title: 调试 Kotlin/Wasm 代码)

<primary-label ref="beta"/> 

本教程演示如何使用 IntelliJ IDEA 和浏览器, 调试使用 Kotlin/Wasm 构建的 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 应用程序.

## 开始之前的准备步骤 {id="before-you-start"}

1. [为 Kotlin Multiplatform 开发设置你的环境](quickstart.md#set-up-the-environment).
2. 按照说明 [创建一个以 Kotlin/Wasm 为目标平台的 Kotlin Multiplatform 项目](wasm-get-started.md#create-a-project).

> * 从 IntelliJ IDEA 2025.3 版本开始, 可以在 IntelliJ IDEA 中调试 Kotlin/Wasm 代码,
> 目前处于 [早期访问计划 (EAP)](https://www.jetbrains.com/resources/eap/) 阶段, 并正在逐渐稳定.
> 如果你在其他版本的 IntelliJ IDEA 中创建了 `WasmDemo` 项目, 请切换到 2025.3 版本, 并在这个版本中打开项目, 以继续本教程.
> * 要在 IntelliJ IDEA 中调试 Kotlin/Wasm 代码, 你必须安装 JavaScript Debugger plugin.
> [查看关于这个 plugin 的详情, 以及如何安装.](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html#ws_js_debugging_chrome_before_you_start)
>
{style="note"}

## 在 IntelliJ IDEA 中调试 {id="debug-in-intellij-idea"}

你创建的 Kotlin Multiplatform 项目, 包含一个基于 Kotlin/Wasm 的 Compose Multiplatform 应用程序.
你可以在 IntelliJ IDEA 中直接调试这个应用程序, 不需要额外的配置.

1. 在 IntelliJ IDEA 中, 打开需要调试的 Kotlin 文件.
   在本教程中, 我们将使用 `Greeting.kt` 文件, 它位于 Kotlin Multiplatform 项目的以下目录中:

   `WasmDemo/composeApp/src/wasmJsMain/kotlin/wasm.project.demo.wasmdemo`

2. 点击行号, 在你想要检查的代码上设置断点.

   ![设置断点](wasm-breakpoints-intellij.png){width=650}

3. 在运行配置列表中选择 **composeApp[wasmJs]**.
4. 点击屏幕顶部的调试图标, 以调试模式运行代码.

   ![以调试模式运行](wasm-debug-run-configurations.png){width=600}

   应用程序启动后, 会在新的浏览器窗口中打开.

   ![浏览器中的 Compose 应用程序](wasm-composeapp-browser.png){width=600}

   同时, IntelliJ IDEA 中会自动打开 **Debug** 面板.

   ![Compose 应用程序调试器](wasm-debug-pane.png){width=600}

### 检查你的应用程序 {id="inspect-your-application"}

> 如果你在 [浏览器中调试](#debug-in-your-browser), 你可以按照相同的步骤来检查你的应用程序.
>
{style="note"}

1. 在应用程序的浏览器窗口中, 点击 **Click me!** 按钮, 与应用程序交互.
   这个动作会触发代码的执行, 当执行到断点位置时, 调试器会暂停.

2. 在调试面板中, 使用调试控制按钮, 检查断点处的变量和代码运行状况:
    * ![Step over](wasm-debug-step-over.png){width=30}{type="joined"} Step over: 执行当前的代码行, 并在下一行暂停.
    * ![Step into](wasm-debug-step-into.png){width=30}{type="joined"} Step into: 进入函数内部, 更加深入地调查函数.
    * ![Step out](wasm-debug-step-out.png){width=30}{type="joined"} Step out: 执行代码, 直到从当前函数退出.

3. 查看 **Threads & Variables** 面板. 它能够帮助你追踪函数的调用栈, 找到错误发生的位置.

   ![查看 Threads & Variables](wasm-debug-panes-intellij.png){width=700}

4. 修改你的代码, 再次运行应用程序, 检验它是否按照预期运行.
5. 调试完成后, 点击有断点的行号, 删除断点.

## 在你的浏览器中调试 {id="debug-in-your-browser"}

也可以在你的浏览器中直接调试这个 Compose Multiplatform 应用程序, 不需要额外的配置.

当你运行开发 Gradle task (`*DevRun`) 时, Kotlin 会自动将源文件提供给浏览器,
让你能够设置断点, 检查变量, 以及单步执行 Kotlin 代码.

为浏览器提供 Kotlin/Wasm 项目源文件的配置现在已经包含在 Kotlin Gradle plugin 中.
如果你之前在 `build.gradle.kts` 文件中添加了这个配置, 你应该删除这些配置, 以避免冲突.

> 本教程使用 Chrome 浏览器, 但你应该可以对其它浏览器进行这些步骤.
> 详情请参见 [浏览器版本](wasm-configuration.md#browser-versions).
>
{style="tip"}

1. 按照说明 [运行 Compose Multiplatform 应用程序](wasm-get-started.md#run-the-application).

2. 在应用程序的浏览器窗口中, 点击鼠标右键, 并选择 **Inspect**, 打开开发者工具.
   或者, 你也可以使用快捷键 **F12**, 或选择菜单 **View** | **Developer** | **Developer Tools**.

3. 切换到 **Sources** 页, 并选择要调试的 Kotlin 文件. 在本教程中, 我们使用 `Greeting.kt` 文件.

4. 点击行号, 在你想要检查的代码上设置断点. 只有行号数字较暗的行才可以设置断点 — 在这个示例中, 是第 4, 7, 8 和 9 行.

   ![设置断点](wasm-breakpoints-browser.png){width=700}

5. 检查你的应用程序, 方法与 [在 IntelliJ IDEA 中调试](#inspect-your-application) 类似.

    在浏览器中调试时, 用于追踪函数调用栈和找到错误位置的面板是 **Scope** 和 **Call Stack**.

   ![查看调用栈](wasm-debug-scope.png){width=450}

### 使用自定义格式 {id="use-custom-formatters"}

在浏览器中调试 Kotlin/Wasm 代码时, 自定义格式能够以更加用户友好和易于理解的方式显示和定位变量值.

自定义格式在 Kotlin/Wasm 开发构建中默认启用, 但你仍然需要确认在浏览器的开发者工具中启用了自定义格式:

* 在 Chrome DevTools 中, 请在 **Settings | Preferences | Console** 中找到 **Custom formatters** 选择框:

  ![在 Chrome 中启用自定义格式](wasm-custom-formatters-chrome.png){width=400}

* 在 Firefox DevTools 中, 请在 **Settings | Advanced settings** 中找到 **Enable custom formatters** 选择框:

  ![在 Firefox 中启用自定义格式](wasm-custom-formatters-firefox.png){width=400}

这个功能使用了 [自定义格式化 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html),
Firefox 和基于 Chromium 的浏览器都支持这个功能.

由于自定义格式只对 Kotlin/Wasm 的开发构建默认启用, 如果你想在生产构建中使用它们, 需要调整你的 Gradle 配置.
请向 `wasmJs {}` 代码块添加以下编译器选项:

```kotlin
// build.gradle.kts
kotlin {
    wasmJs {
        // ...

        compilerOptions {
            freeCompilerArgs.add("-Xwasm-debugger-custom-formatters")
        }
    }
}
```

## 留下你的反馈意见 {id="leave-feedback"}

如果你能对你的调试体验提供反馈意见, 我们将会非常感谢!

* ![Slack](slack.svg){width=25}{type="joined"} Slack:
  [获得 Slack 邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up), 并在我们的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) channel, 直接向开发者提供你的反馈意见.
* 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供你的反馈意见.

## 下一步做什么? {id="what-s-next"}

* 观看这个 [YouTube 视频](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s), 学习 Kotlin/Wasm 调试的实践.
* 试试其它更多 Kotlin/Wasm 示例:
  * [KotlinConf 应用程序](https://github.com/JetBrains/kotlinconf-app)
  * [Compose 图像浏览器](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)
  * [Node.js 示例](https://github.com/Kotlin/kotlin-wasm-nodejs-template)
  * [WASI 示例](https://github.com/Kotlin/kotlin-wasm-wasi-template)
  * [Compose 示例](https://github.com/Kotlin/kotlin-wasm-compose-template)
