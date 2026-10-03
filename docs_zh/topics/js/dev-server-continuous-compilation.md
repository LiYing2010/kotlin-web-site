[//]: # (title: 开发服务器(Development server)与持续编译(Continuous Compilation))

你可以使用 _持续编译(Continuous Compilation)_ 模式, 这样就不必每次想要查看修改结果时手动编译和运行你的 Kotlin/JS 项目.
请不要使用通常的 `jsBrowserDevelopmentRun` (用于 `browser` 项目) 和 `jsNodeDevelopmentRun` (用于 `nodejs` 项目) 命令,
而是使用持续(Continuous)模式调用 Gradle Wrapper:

```bash
 # 对 `browser` 项目
./gradlew jsBrowserDevelopmentRun --continuous

 # 对 `nodejs` 项目
./gradlew jsNodeDevelopmentRun --continuous
```

如果你使用 IntelliJ IDEA, 那么可以通过运行配置(Run Configuration)传递这个选项.
从 IDE 中初次运行 `jsBrowserDevelopmentRun` Gradle task 之后, IntelliJ IDEA 会自动生成运行配置,
然后你就可以在画面顶端的工具栏中修改这个配置:

![在 IntelliJ IDEA 中修改运行配置](edit-configurations.png){width=700}

在 **Run/Debug Configurations** 对话框中, 对运行配置的参数添加 `--continuous` 选项, 即可开启持续(Continuous)模式:

![在 IntelliJ IDEA 中向运行配置添加 continuous 选项](run-debug-configurations.png){width=700}

执行这个运行配置时, 你可以注意到 Gradle 进程会持续监视项目文件的变更:

![Gradle 等待文件变更](waiting-for-changes.png){width=700}

一旦检测到文件变更, 你的程序会被自动重新编译.
如果你在浏览器中打开了 Web 页面, 开发服务器会触发页面自动更新, 然后你的变更会反应到页面中.
这是由 [Kotlin Multiplatform Gradle plugin](multiplatform-dsl-reference.md) 管理的
[`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/) 提供的功能.
