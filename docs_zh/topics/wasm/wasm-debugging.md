[//]: # (title: 调试 Kotlin/Wasm 代码)

> Kotlin/Wasm 还处于 [Alpha 阶段](components-stability.md).
> 它随时有可能变更.
>
{style="note"}

本教程演示如何使用你的浏览器调试使用 Kotlin/Wasm 构建的 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 应用程序.

## 开始之前的准备步骤 {id="before-you-start"}

使用 Kotlin Multiplatform 向导创建一个项目:

1. 打开 [Kotlin Multiplatform 向导](https://kmp.jetbrains.com/#newProject).
2. 在 **New Project** 页, 将项目名称 和 ID 修改为你喜欢的值.
   在本教程中, 我们将项目名称设置为 "WasmDemo", ID 设置为 "wasm.project.demo".

   > 这些值是项目目录的名称和 ID. 你也可以使用原来的值, 不做修改.
   >
   {style="tip"}

3. 选择 **Web** 选项. 请确认没有选择其他选项.
4. 点击 **Download** 按钮, 将生成的压缩包文件解包.

![Kotlin Multiplatform 向导](wasm-compose-web-wizard.png){width=400}

## 在 IntelliJ IDEA 中打开项目 {id="open-the-project-in-intellij-idea"}

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/).
2. 在 IntelliJ IDEA 的欢迎界面, 点击 **Open**, 或在菜单栏选择 **File | Open**.
3. 导航到解包后的 "WasmDemo" 文件夹, 点击 **Open**.

## 运行应用程序 {id="run-the-application"}

1. 在 IntelliJ IDEA 中, 选择菜单 **View** | **Tool Windows** | **Gradle**, 打开 **Gradle** 工具窗口.

   > 你需要至少 Java 11 以上版本, 用作你的 Gradle JVM, 才能成功装载 task.
   >
   {style="note"}

2. 在 **composeApp** | **Tasks** | **kotlin browser** 中, 选中并运行 **wasmJsBrowserDevelopmentRun** 任务.

   ![运行 Gradle 任务](wasm-gradle-task-window.png){width=550}

   或者, 你可以在终端窗口, 在 `WasmDemo` 根目录下运行以下命令:

   ```bash
   ./gradlew wasmJsBrowserDevelopmentRun
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

   ![Click me](wasm-composeapp-browser-clickme.png){width=550}

   现在你会看到 Compose Multiplatform 的 Logo:

   ![浏览器中的 Compose 应用程序](wasm-composeapp-browser.png){width=550}

## 在你的浏览器中进行调试 {id="debug-in-your-browser"}

> 目前, 只能在你的浏览器中进行调试.
> 将来, 你将能够在 [IntelliJ IDEA](https://youtrack.jetbrains.com/issue/KT-64683/Kotlin-Wasm-debugging-in-IntelliJ-IDEA)
> 中调试你的代码.
>
{style="note"}

你可以在你的浏览器中直接调试这个 Compose Multiplatform 应用程序, 不需要额外的配置.

但是, 对于其它项目, 你可能需要在你的 Gradle build 文件中配置一些设置.
关于如何配置你的浏览器进行调试, 请展开下面的小节.

### 配置你的浏览器进行调试 {id="configure-your-browser-for-debugging" initial-collapse-state="collapsed" collapsible="true"}

#### 允许访问项目的源代码 {id="enable-access-to-project-s-sources"}

默认情况下, 浏览器不能访问某些调试所需要的项目源代码.
要允许访问, 你可以配置 Webpack DevServer 来提供这些源代码.
在 `ComposeApp` 目录中, 向你的 `build.gradle.kts` 文件添加以下代码片段.

将这个 import 添加为顶级声明:

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.webpack.KotlinWebpackConfig
```

在 `kotlin{}` 之内的 `wasmJs{}` 编译目标 DSL 内的 `browser{}` 平台 DSL 中,
找到 `commonWebpackConfig{}` 代码块, 添加这个代码片段:

```kotlin
devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
    static = (static ?: mutableListOf()).apply {
        // 提供源代码, 以便在浏览器内进行调试
        add(project.rootDir.path)
        add(project.projectDir.path)
    }
}
```

最后的代码块大致如下:

```kotlin
kotlin {
    @OptIn(ExperimentalWasmDsl::class)
    wasmJs {
        moduleName = "composeApp"
        browser {
            commonWebpackConfig {
                outputFileName = "composeApp.js"
                devServer = (devServer ?: KotlinWebpackConfig.DevServer()).apply {
                    static = (static ?: mutableListOf()).apply { 
                        // 提供源代码, 以便在浏览器内进行调试
                        add(project.rootDir.path)
                        add(project.projectDir.path)
                    }
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"}

> 目前, 你不能调试库的源代码.
> [我们将来会支持这个功能](https://youtrack.jetbrains.com/issue/KT-64685).
>
{style="note"}

#### 使用自定义格式 {id="use-custom-formatters"}

在调试 Kotlin/Wasm 代码时, 自定义格式能够以更加用户友好和易于理解的方式显示和定位变量值.

在开发构建中会默认启用自定义格式, 因此你不需要添加额外的 Gradle 配置.

由于使用了 [自定义格式化 API](https://firefox-source-docs.mozilla.org/devtools-user/custom_formatters/index.html),
因此Firefox 和基于 Chromium 的浏览器都支持这个功能.

要使用这个功能, 请在你的浏览器的开发者工具中确认启用了自定义格式:

* 在 Chrome DevTools 中, 请在 **Settings | Preferences | Console** 中找到 Custom formatters 选择框:

  ![在 Chrome 中启用自定义格式](wasm-custom-formatters-chrome.png){width=400}

* 在 Firefox DevTools 中, 请在 **Settings | Advanced settings** 中找到 Custom formatters 选择框:

  ![在 Firefox 中启用自定义格式](wasm-custom-formatters-firefox.png){width=400}

自定义格式适用于 Kotlin/Wasm 的开发构建. 如果你对生产构建有特定的要求, 那么需要相应的调整你的 Gradle 配置.
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

启用自定义格式之后, 你就可以继续调试教程了.

### 调试你的 Kotlin/Wasm 应用程序 {id="debug-your-kotlin-wasm-application"}

> 本教程使用 Chrome 浏览器, 但你应该可以对其它浏览器进行这些步骤.
> 详情请参见 [浏览器版本](wasm-troubleshooting.md#browser-versions).
> 
{style="tip"}

1. 在应用程序的浏览器窗口中, 点击鼠标右键, 并选择 **Inspect**, 打开开发者工具.
   或者, 你也可以使用快捷键 **F12**, 或选择菜单 **View** | **Developer** | **Developer Tools**.

2. 切换到 **Sources** 页, 并选择要调试的 Kotlin 文件.
   在本教程中, 我们使用 `Greeting.kt` 文件.

3. 点击行号, 在你想要检查的代码上设置断点.
   只有行号数字较暗的行才可以设置断点.

   ![设置断点](wasm-breakpoints.png){width=600}

4. 点击 **Click me!** 按钮, 与应用程序交互.
   这个动作会触发代码的执行, 当执行到断点位置时, 调试器会暂停.

5. 在调试面板中, 使用调试控制按钮, 检查断点处的变量和代码运行状况:
   * ![Step into](wasm-step-into.png){width=30}{type="joined"} Step into: 更加深入的调查一个函数.
   * ![Step over](wasm-step-over.png){width=30}{type="joined"} Step over: 执行当前的代码行, 并在下一行暂停.
   * ![Step out](wasm-step-out.png){width=30}{type="joined"} Step out: 执行代码, 直到从当前函数退出.

   ![调试控制按钮](wasm-debug-controls.png){width=600}

6. 查看 **Call stack** 和 **Scope** 面板, 追踪函数的调用序列, 找到错误发生的位置.

   ![查看调用栈](wasm-debug-scope.png){width=550}

   为了更好的可视化显示变量值, 请参见 [配置你的浏览器进行调试](#configure-your-browser-for-debugging) 小节中的 _使用自定义格式_.

7. 修改你的代码, 并再次 [运行应用程序](#run-the-application), 检验它是否按照预期运行.
8. 点击有断点的行号, 删除断点.

## 留下你的反馈意见 {id="leave-feedback"}

如果你能对你的调试体验提供反馈意见, 我们将会非常感谢!

* ![Slack](slack.svg){width=25}{type="joined"} Slack:
  [获得 Slack 邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up), 并在我们的 [#webassembly](https://kotlinlang.slack.com/archives/CDFP59223) channel, 直接向开发者提供你的反馈意见.
* 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492) 中提供你的反馈意见.

## 下一步做什么? {id="what-s-next"}

* 观看这个 [YouTube 视频](https://www.youtube.com/watch?v=t3FUWfJWrjU&t=2703s), 学习 Kotlin/Wasm 调试的实践.
* 尝试我们的 `kotlin-wasm-examples` 代码仓库中的 Kotlin/Wasm 示例:
   * [Compose 图片查看器](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-imageviewer)
   * [Jetsnack 应用程序](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-jetsnack)
   * [Node.js 示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/nodejs-example)
   * [WASI 示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/wasi-example)
   * [Compose 示例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/compose-example)
