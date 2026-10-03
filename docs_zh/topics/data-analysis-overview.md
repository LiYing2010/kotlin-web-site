[//]: # (title: 在数据分析(Data Analysis)中使用 Kotlin)
[//]: # (description: 学习如何使用 Kotlin 进行数据分析, 使用 Kotlin DataFrame 和 Kandy 获取, 变换, 分析, 并可视化数据.)

浏览和分析数据可能不是你每天都要做的工作, 但它是你作为软件开发者需要掌握的一种重要技能.

我们来思考一下数据分析处于关键地位的软件开发职责: 在调试时分析集合中实际存在的内容,
对内存转储(memory dump)或数据库进行深入研究, 或者使用 REST API 时接收包含大量数据的 JSON 文件, 等等.

使用 Kotlin 的 Exploratory Data Analysis (EDA) 工具,
例如 [Kotlin DataFrame](#kotlin-dataframe) 和 [Kandy](#kandy),
你就有了丰富的能力来提升你的分析技能, 并在各种场景对你提供支持:

* **装载, 转换, 并可视化各种格式的数据:**
  使用我们的 Kotlin EDA 工具, 你可以完成各种任务, 例如过滤, 排序, 汇总数据.
  我们的工具能够直接在 IDE 内从各种数据源无缝的读取数据, 例如 CSV, JSON, SQL 数据库, 或 Parquet 文件.
  关于所有支持的格式, 详情请参见 [DataFrame 文档](https://kotlin.github.io/dataframe/data-sources.html).

  使用 Kandy, 我们的绘图工具, 你可以创建各种类型的图表来可视化数据, 并从数据集获取信息.

* **高效的分析存储在关系型数据库中的数据:**
  Kotlin DataFrame 与数据库无缝的集成, 提供类似 SQL 查询的能力.
  你可以直接从各种数据库获取, 操作, 并可视化数据.

* **从 Web API 获取并分析实时的动态数据集:**
  EDA 工具的灵活性能够通过 OpenAPI 之类的协议与外部 API 集成.
  使用这个功能, 你可以从 Web API获取数据, 然后根据你的需要清理并转换数据.

## Kotlin DataFrame {id="kotlin-dataframe"}

使用 [Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) 库, 你可以在 Kotlin 项目中处理结构化数据.
从数据创建和清理, 到深度分析和特征工程(Feature Engineering), 这个库都能满足你的需求.

使用 Kotlin DataFrame 库, 你可以处理不同的文件格式, 包括 CSV, JSON, XLS, 和 XLSX.
这个库还具有连接 SQL 数据库或 API 的能力, 使数据检索过程更加便利.
关于所有支持的格式, 详情请参见 [DataFrame 文档](https://kotlin.github.io/dataframe/data-sources.html).

![Kotlin DataFrame](data-analysis-dataframe-example.png){width=700}

## Kandy {id="kandy"}

[Kandy](https://kotlin.github.io/kandy/welcome.html) 是一个开源的 Kotlin 库, 提供了强大而且灵活的 DSL, 用于绘制各种类型的图表.
这个库是一个简单, 符合惯用法, 易读, 类型安全的数据可视化工具.
你也可以很容易的将 Kandy 和 Kotlin DataFrame 组合在一起, 完成数据相关的各种任务.

![Kandy](data-analysis-kandy-example.png){width=700}

## 下一步做什么 {id="whats-next"}

* [使用 Kotlin DataFrame 库获取并转换数据](data-analysis-work-with-data-sources.md)
* [使用 Kandy 库可视化数据](data-analysis-visualization.md)
* [关于用于数据分析的 Kotlin 和 Java 库的更多详情](data-analysis-libraries.md)
