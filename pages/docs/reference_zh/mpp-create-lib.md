---
type: doc
layout: reference
title: "创建跨平台的库"
---

# 创建跨平台的库

本节介绍如何创建跨平台的库. 也可以参阅 [完整的教程](../tutorials/mpp/multiplatform-library.html),
介绍如何创建跨平台的库, 测试它, 并发布到 Maven.

1. 在 IntelliJ IDEA 中, 选择 **File** \| **New** \| **Project**.
2. 在左侧面板, 选择 **Kotlin**.
3. 输入项目名称, 并选择 **Multiplatform** 之下的 **Library** 作为项目模板.

    ![Select a project template]({{ url_for('asset', path='images/reference/mpp/mpp-project-1.png') }})

4. 选择 Gradle DSL – Kotlin 或 Groovy.
5. 点击 **Next**.

在下一个页面中, 可以点击 **Finish** 完成项目的创建, 如果有需要, 也可以进行更多配置:

{:start="6"}
6. 点击 + 图标, 添加目标平台和模块.
7. 对目标设定进行配置, 比如编译目标的模板, JVM 编译目标的版本, 以及测试框架.

    ![Configure the project]({{ url_for('asset', path='images/reference/mpp/mpp-project-2.png') }})

8. 如果需要, 指定模块之间的依赖关系:
    *   跨平台与 Android 模块
    *   跨平台与 iOS 模块
    *   JVM 模块

    ![Add module dependencies]({{ url_for('asset', path='images/reference/mpp/mpp-project-3.png') }})

9. 点击 **Finish**.

然后新创建的项目会打开. 你可以 [查看项目中的内容](mpp-discover-project.html).
