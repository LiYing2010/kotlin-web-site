[//]: # (title: 创建跨平台的库)

最终更新: %latestDocDate%

本节介绍如何创建跨平台的库. 也可以参阅 [完整的教程](../tutorials/mpp/multiplatform-library.html),
介绍如何创建跨平台的库, 测试它, 并发布到 Maven.

1. 在 IntelliJ IDEA 中, 选择菜单 **File** | **New** | **Project**.
2. 在左侧面板, 选择 **Kotlin**.
3. 输入项目名称, 然后在 **Multiplatform** 中选择 **Library** 作为项目模板.

    ![选择项目模板]({{ url_for('asset', path='docs/images/mpp/mpp-project-1.png') }})

4. 选择 Gradle DSL – Kotlin 或 Groovy.
5. 点击 **Next**.

    在下一个页面中, 可以点击 **Finish** 完成项目的创建, 如果有需要, 也可以进行更多配置:

6. 点击 **+** 图标, 添加目标平台和模块.

7. 对目标设定进行配置, 比如 JVM 编译目标版本, 以及测试框架.

    ![配置项目]({{ url_for('asset', path='docs/images/mpp/mpp-project-2.png') }})

8. 如果需要, 指定模块之间的依赖关系:
    *   跨平台与 Android 模块
    *   跨平台与 iOS 模块
    *   JVM 模块

    ![添加模块依赖项]({{ url_for('asset', path='docs/images/mpp/mpp-project-3.png') }})

9. 点击 **Finish**.

然后新创建的项目会打开.

## 下一步做什么?

* [理解跨平台项目的结构](mpp-discover-project.html).
* [教程 - 创建并发布跨平台的库](multiplatform-library.html).
* [教程 - 在 Android 和 iOS 上创建你的第一个 KMM 应用程序](../kmm/kmm-create-first-app.html).
* [实际动手(hands-on)教程 - 使用 Kotlin Multiplatform 创建一个全栈的 Web 应用程序](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/01_Introduction).
