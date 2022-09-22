---
type: doc
layout: reference
category:
title: "开发服务器(Development server)与持续编译(Continuous Compilation)"
---

# 开发服务器(Development server)与持续编译(Continuous Compilation)

最终更新: {{ site.data.releases.latestDocDate }}

你可以使用 _持续编译(Continuous Compilation)_ 模式, 这样就不必每次想要查看修改结果时手动编译和执行 Kotlin/JS 项目. 
使用 _持续(Continuous)_ 模式调用 Gradle wrapper, 而不是不是使用通常的 `run` 命令:

```bash
./gradlew run --continuous
```

如果你使用 IntelliJ IDEA, 那么可以通过 _运行配置(Run Configuration)_ 传递相同的选项.
从 IDE 中初次运行 Gradle `run` task 后, IntelliJ IDEA 会自动生成运行配置, 然后你可以修改这个配置:

<img src="/assets/docs/images/reference/dev-server-continuous-compilation/edit-configurations.png" alt="在 IntelliJ IDEA 中修改运行配置" width="700"/>

在 **Run/Debug Configurations** 对话框中开启 持续(Continuous)模式, 只需要在运行配置的参数中添加 `--continuous` 选项:

<img src="/assets/docs/images/reference/dev-server-continuous-compilation/run-debug-configurations.png" alt="在 IntelliJ IDEA 中向运行配置添加 continuous 选项" width="700"/>

执行这个运行配置时, 你可以注意到 Gradle 进程会持续监视项目文件的变更:

<img src="/assets/docs/images/reference/dev-server-continuous-compilation/waiting-for-changes.png" alt="Gradle 等待文件变更" width="700"/>

一旦检测到文件变更, 你的程序会被自动重新编译. 如果你在浏览器中打开了页面, 开发服务器会触发页面自动更新, 然后你的变更会反应到页面中.
这是由 Kotlin/JS Gradle plugin 管理的 `webpack-dev-server` 提供的功能.
