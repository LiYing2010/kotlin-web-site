[//]: # (title: 在数据分析(Data Analysis)中使用 Kotlin)

浏览和分析数据可能不是你每天都要做的工作, 但它是你作为软件开发者需要掌握的一种重要技能.

我们来思考一下数据分析处于关键地位的软件开发职责: 在调试时分析集合中实际存在的内容,
对内存转储(memory dump)或数据库进行深入研究, 或者使用 REST API 时接收包含大量数据的 JSON 文件, 等等.

使用 Kotlin 的 Exploratory Data Analysis (EDA) 工具,
例如 [Kotlin Notebook](#notebooks), [Kotlin DataFrame](#kotlin-dataframe), 以及 [Kandy](#kandy),
你就有了丰富的能力来提升你的分析技能, 并在各种场景对你提供支持:

* **装载, 转换, 并可视化各种格式的数据:**
  使用我们的 Kotlin EDA 工具, 你可以完成各种任务, 例如过滤, 排序, 汇总数据.
  我们的工具能够直接在 IDE 内从各种文件格式无缝的读取数据, 包括 CSV, JSON, 以及 TXT.

  使用 Kandy, 我们的绘图工具, 你可以创建各种类型的图表来可视化数据, 并从数据集获取信息.

* **高效的分析存储在关系型数据库中的数据:**
  Kotlin DataFrame 与数据库无缝的集成, 提供类似 SQL 查询的能力.
  你可以直接从各种数据库获取, 操作, 并可视化数据.

* **从 Web API 获取并分析实时的动态数据集:**
  EDA 工具的灵活性能够通过 OpenAPI 之类的协议与外部 API 集成.
  使用这个功能, 你可以从 Web API获取数据, 然后根据你的需要清理并转换数据.

你想不想试试我们的 Kotlin 数据分析工具?

<a href="get-started-with-kotlin-notebooks.md"><img src="kotlin-notebooks-button.svg" width="600" alt="Get started with Kotlin Notebook" style="block"/></a>

我们的 Kotlin 数据分析工具 让你能够从头到尾顺利的处理你的数据.
在我们的 Kotlin Notebook 中使用简单的拖放功能, 就能轻松的获取你的数据.
清理, 转换, 以及可视化, 都只需要几行代码.
此外, 也只需要点击几下就能导出你的输出图表.

![Kotlin Notebook](data-analysis-notebook.gif){width=700}

## Notebook {id="notebooks"}

_Notebook_ 是一种交互式编辑器, 在单一环境中集成了代码, 图片, 和文本.
使用 notebook 时, 你可以运行代码单元(code cell), 并立即看到输出.

Kotlin 提供了各种 Notebook 解决方案, 例如 [Kotlin Notebook](#kotlin-notebook), [Datalore](#kotlin-notebooks-in-datalore),
以及 [Kotlin-Jupyter Notebook](#jupyter-notebook-with-kotlin-kernel),
提供便利的功能, 用于数据的获取, 转换, 浏览, 建模, 等等.
这些 Kotlin Notebook 解决方案都基于我们的 [Kotlin Kernel](https://github.com/Kotlin/kotlin-jupyter).

你可以在 Kotlin Notebook, Datalore, 和 Kotlin-Jupyter Notebook 之间无缝的共享你的代码.
使用我们的 Kotlin Notebook 中的一种创建一个项目, 就可以在其他 Notebook 中继续工作, 不会有兼容性问题.

收益于我们的 Kotlin Notebook 的强大功能, 以及使用 Kotlin 编码的优势.
Kotlin 集成了这些 Notebook, 帮助你管理数据, 与同事共享你的发现, 同时建立你的数据科学和机器学习方面的技能.

请浏览我们的各种 Kotlin Notebook 解决方案的功能, 并选择其中最适合你的项目需求的那种.

![Kotlin Notebook](kotlin-notebook.png){width=700}

### Kotlin Notebook {id="kotlin-notebook"}

[Kotlin Notebook](kotlin-notebook-overview.md) 是一个 IntelliJ IDEA plugin, 可以使用 Kotlin 来创建 Notebook.
它提供的 IDE 体验包括所有常见的 IDE 功能, 包括实时的代码查看和项目集成.

### Datalore 中的 Kotlin Notebook {id="kotlin-notebooks-in-datalore"}

通过 [Datalore](https://datalore.jetbrains.com/), 你可以直接在浏览器中使用 Kotlin, 不需要额外安装.
你还可以共享你的 Notebook 并远程运行, 与其它 Kotlin Notebook 实时的协作,
编写代码时获得智能代码辅助, 以及通过交互式报告或静态报告导出结果.

### 使用 Kotlin Kernel 的 Jupyter Notebook {id="jupyter-notebook-with-kotlin-kernel"}

[Jupyter Notebook](https://jupyter.org/) 是一个开源的 Web 应用程序, 你可以用来创建和分享文档,
其中包含代码, 可视化的数据, 以及 Markdown 格式的文本.
[Kotlin-Jupyter](https://github.com/Kotlin/kotlin-jupyter) 是一个开源项目, 可以在 Jupyter Notebook 中添加对 Kotlin 的支持,
在 Jupyter 环境中利用 Kotlin 的能力.

## Kotlin DataFrame

使用 [Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 库, 你可以在 Kotlin 项目中处理结构化数据.
从数据创建和清理, 到深度分析和特征工程(Feature Engineering), 这个库都能满足你的需求.

使用 Kotlin DataFrame 库, 你可以处理不同的文件格式, 包括 CSV, JSON, XLS, 和 XLSX.
这个库还具有连接 SQL 数据库或 API 的能力, 使数据检索过程更加便利.

![Kotlin DataFrame](data-analysis-dataframe-example.png){width=700}

## Kandy

[Kandy](https://kotlin.github.io/kandy/welcome.html) 是一个开源的 Kotlin 库, 提供了强大而且灵活的 DSL, 用于绘制各种类型的图表.
这个库是一个简单, 符合惯用法, 易读, 类型安全的数据可视化工具.

Kandy 能够与 Kotlin Notebook, Datalore, Kotlin-Jupyter Notebook 无缝集成.
你也可以很容易的将 Kandy 和 Kotlin DataFrame 库组合在一起, 完成数据相关的各种任务.

![Kandy](data-analysis-kandy-example.png){width=700}

## 下一步做什么

* [Kotlin Notebook 入门](get-started-with-kotlin-notebooks.md)
* [使用 Kotlin DataFrame 库获取并转换数据](data-analysis-work-with-data-sources.md)
* [使用 Kandy 库可视化数据](data-analysis-visualization.md)
* [关于用于数据分析的 Kotlin 和 Java 库的更多详情](data-analysis-libraries.md)
