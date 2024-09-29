[//]: # (title: 调试 Kotlin/JS 代码)

最终更新: %latestDocDate%

JavaScript 代码映射(Source Map), 提供了由打包器(bundler)或极简化器(minifier)产生的极简化代码与开发者编写的真实代码之间的对应关系.
通过这种方式, 代码映射可以支持代码执行时的调试.

Kotlin Multiplatform Gradle plugin 会为它构建的项目自动生成代码映射, 不需要任何额外的配置.

## 在浏览器中调试

大多数现代浏览器提供了工具, 可以查看页面内容, 调试页面中执行代码.
详情请参见你的浏览器的文档.

要在浏览器中调试 Kotlin/JS, 请执行以下步骤:

1. 执行 Gradle 的某个 _run_ 任务来运行项目, 比如, 跨平台项目内的 `browserDevelopmentRun` 或 `jsBrowserDevelopmentRun`.
   详情请参见 [运行 Kotlin/JS](running-kotlin-js.md#run-the-browser-target).
2. 在浏览器中访问页面, 并启动浏览器的开发者工具(比如, 点击鼠标右键, 选择 **Inspect** 菜单项).
   详情请参见在流行的浏览器中 [如何找到开发者工具](https://balsamiq.com/support/faqs/browserconsole/).
3. 如果你的程序向控制台输出 log, 请打开 **Console** 页, 查看其中的输出.
   根据你使用的浏览器不同, 这些 log 可能会参照到输出 log 的 Kotlin 源代码文件和行号:

   ![Chrome 的 DevTools 控制台](devtools-console.png){width="600"}

4. 点击右侧的文件参照, 即可浏览源代码中对应的行.
   或者, 你也可以手动切换到 **Sources** 页, 在文件树中找到你需要的文件. 浏览
   Kotlin 文件, 会显示通常的 Kotlin 代码 (而不是极简化之后的 JavaScript 代码):

   ![在 Chrome 的 DevTools 中调试](devtools-sources.png){width="600"}

现在你可以开始调试程序了. 点击代码的行号可以设置一个断点.
开发者工具甚至还支持在一条语句内设置断点. 和通常的 JavaScript 代码一样, 在页面重新加载之后, 设置的任何断点都会继续存在.
因此可以调试 Kotlin 的 `main()` 方法, 这个方法会在脚本初次装载时执行.

## 在 IDE 中调试

[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/) 提供了强大的工具用于开发时调试代码.

要在 IntelliJ IDEA 中调试 Kotlin/JS, 你需要一个 **JavaScript Debug** 配置.
要添加一个这样的调试配置, 请执行以下步骤:

1. 选择菜单 **Run | Edit Configurations**.
2. 点击 **+**, 选择 **JavaScript Debug**.
3. 指定配置的 **Name**, 并提供项目运行时的 **URL** (默认是 `http://localhost:8080`).

   ![JavaScript 调试配置](debug-config.png){width=700}

4. 保存配置.

详情请参见 [设置 JavaScript 调试配置](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html).

现在你可以调试你的项目了!

1. 执行 Gradle 的某个 _run_ 任务来运行项目, 比如, 跨平台项目的 `browserDevelopmentRun` 或 `jsBrowserDevelopmentRun`.
   详情请参见 [运行 Kotlin/JS](running-kotlin-js.md#run-the-browser-target).
2. 运行你前面创建的 JavaScript 调试配置, 启动调试会话:

   ![JavaScript 调试配置](debug-config-run.png){width=700}

3. 在 IntelliJ IDEA 的**Debug** 窗口中, 你可以看到你的程序的控制台输出. 输出项目会参照到输出 log 的 Kotlin 源代码文件和行号:

   ![在 IDE 中的 JavaScript 调试输出](ide-console-output.png){width=700}

4. 点击右侧的文件参照, 即可浏览源代码中对应的行.

现在你可以使用 IDE 提供的全套工具调试程序了: 断点, 单步运行, 表达式计算, 等等.
详情请参见 [在 IntelliJ IDEA 中进行调试](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html).

> 由于 IntelliJ IDEA 中的 JavaScript 调试器目前的限制, 你可能会需要重新运行 JavaScript 调试, 才能让程序在断点处暂停.
>
{style="note"}

## 在 Node.js 中调试

如果你的项目编译目标是 Node.js, 你可以在运行时调试它.

要调试一个编译目标为 Node.js 的 Kotlin/JS 应用程序, 请执行以下步骤:

1. 运行 Gradle 的 `build` 任务, 构建项目.
2. 在你的项目目录下的 `build/js/packages/your-module/kotlin/` 目录中, 找到针对 Node.js 输出的 `.js` 文件.
3. 参照
[Node.js 调试指南](https://nodejs.org/en/docs/guides/debugging-getting-started/#jetbrains-webstorm-2017-1-and-other-jetbrains-ides)
中的方法, 在 Node.js 中调试这个文件.

## 下一步做什么?

现在你了解了如何调试你的 Kotlin/JS 项目, 请阅读以下资料, 学习如何高效使用调试工具:

* 学习如何 [在 Google Chrome 中调试 JavaScript](https://developer.chrome.com/docs/devtools/javascript/)
* 熟悉 [IntelliJ IDEA JavaScript 调试器](https://www.jetbrains.com/help/idea/debugging-javascript-in-chrome.html)
* 学习如何 [在 Node.js 中调试](https://nodejs.org/en/docs/guides/debugging-getting-started/).

## 如果你遇到问题

如果你遇到任何与调试 Kotlin/JS 相关的问题, 请到我们的问题追踪系统 [YouTrack](https://kotl.in/issue) 提交报告.
