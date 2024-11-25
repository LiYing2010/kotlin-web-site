[//]: # (title: Kotlin Notebook)

[Kotlin Notebook](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook) 是 IntelliJ IDEA 中的一个动态 plugin,
它提供一个交互式环境, 用于创建和编辑 notebook, 能够充分发挥 Kotlin 的全部能力.

你可以得到无缝的编码体验, 可以使用 Kotlin 代码进行开发和试验, 立即得到输出结果,
并在 IntelliJ IDEA 生态系统中将代码, 视图, 和文本集成在一起.

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

Kotlin Notebook plugin 包含 [很多功能特性](https://www.jetbrains.com/help/idea/kotlin-notebook.html), 增强你的开发过程,
例如:

* 在 cell 内访问 API
* 只需要几次点击即可导入和导出文件
* 使用 REPL 命令快速浏览项目
* 使用丰富的输出格式
* 使用注解或类似 Gradle 的语法, 以符合直觉的方式管理依赖项
* 使用一行代码导入各种库, 甚至可以向你的项目添加新的库
* 通过错误消息和异常追溯, 获得用于调试的信息

Kotlin Notebook 基于我们的 [用于 Jupyter Notebook 的 Kotlin Kernel](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#kotlin-kernel-for-ipythonjupyter),
因此它很容易和我们的 [Kotlin notebook 解决方案](https://kotlinlang.org/docs/data-analysis-overview.html#notebooks) 集成.
你可以很容易的在 Kotlin Notebook [Datalore](https://datalore.jetbrains.com/), 和 [Kotlin-Jupyter Notebook](https://github.com/Kotlin/kotlin-jupyter), 之间共用你的工作, 没有兼容性问题.

通过这些能力, 你可以完成各种任务, 从简单的代码试验, 到复杂的数据项目.

请深入阅读下面的章节, 了解使用 Kotlin Notebook 能够实现哪些功能!

## 数据分析与可视化

无论你在进行初级的数据探索, 还是在完成一个端到端的数据分析项目, Kotlin Notebook 都有适合你的工具.

使用 Kotlin Notebook, 你可以通过符合直觉的方式集成 [库](data-analysis-libraries.md), 用来获取, 转换, 绘制, 并建模你的数据,
同时还能立即得到你的操作的输出.

对于分析相关的任务, [Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 库提供了强大的解决方案.
这个库能够便利的装载, 创建, 过滤, 以及清理结构化的数据.

Kotlin DataFrame 还支持无缝的连接 SQL 数据库, 以及直接在 IDE 中从各种文件格式读取数据, 包括 CSV, JSON, 和 TXT.

[Kandy](https://kotlin.github.io/kandy/welcome.html), 一个开源的 Kotlin 库, 能够各种类型的创建图表.
Kandy 的 符合惯用法, 易读, 并且类型安全的功能, 能够帮助你高效的可视化数据, 并获取有价值的信息.

![数据分析与可视化](data-analysis-kandy-example.png){width=700}

## 原型设计

Kotlin Notebook 提供了一个交互式环境, 可以运行一小段代码, 并实时看到结果.
这种实践性的方案, 能够在原型设计阶段进行快速的试验和迭代.

通过 Kotlin Notebook 的帮助, 你可以在构思阶段尽早的测试解决方案的各种概念.
此外, Kotlin Notebook 支持合作性的和可重复的工作, 因此能够产生和评估新的想法.

![Kotlin Notebook 原型设计](kotlin-notebook-prototyping.png){width=700}

## 后端开发

Kotlin Notebook 提供了在 cell 内调用 API, 以及使用 OpenAPI 之类的协议的能力.
它拥有与外部服务和 API 交互的能力, 因此适合于某些后端开发场景,
例如, 在你的 Notebook 环境内直接读取信息, 并读取 JSON 文件.

![Kotlin Notebook 后端开发](kotlin-notebook-backend-development.png){width=700}

## 代码文档

在 Kotlin Notebook 中, 你可以在代码单元(code cell)中包含内嵌的注释和文本注解,
提供与代码片段相关的更多上下文信息, 解释, 以及说明.

你还可以在 Markdown cell 中书写文本, 这种 cell 支持丰富的格式选项, 例如标题, 列表, 链接, 图像, 等等.
要渲染一个 Markdown cell, 查看格式化后的文本, 只需要简单的运行它, 和运行代码单元一样.

![Kotlin Notebook 文档](kotlin-notebook-documentation.png){width=700}

## 共享代码和输出

由于 Kotlin Notebook 的符合通用的 Jupyter 格式, 因此可以在不同的 Notebook 中共享你的代码和输出.
你可以使用任何的 Jupyter 客户端, 例如 [Jupyter Notebook](https://jupyter.org/) 或 [Jupyter Lab](https://jupyterlab.readthedocs.io/en/latest/), 打开, 编辑, 并运行你的 Kotlin Notebook.

你也可以使用任何 Notebook Web 阅读器, 共享 `.ipynb` Notebook 文件, 这样来发布你的工作.
一种选择是 [GitHub](https://github.com/), 它会以原生的方式渲染这个格式.
另一种选择是 [JetBrain's Datalore](https://datalore.jetbrains.com/) 平台,
它能够便利的共享, 运行, 以及编辑 Notebook, 并包含很多高级功能, 例如安排 Notebook 的运行时刻.

![通过 Datalore 共享 Kotlin Notebook](kotlin-notebook-sharing-datalore.png){width=700}

## 下一步做什么

* [学习 Kotlin Notebook 的使用方法和关键功能.](https://www.jetbrains.com/help/idea/kotlin-notebook.html)
* [试用 Kotlin Notebook.](get-started-with-kotlin-notebooks.md)
* [深入了解使用 Kotlin 进行数据分析.](data-analysis-overview.md)
