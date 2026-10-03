[//]: # (title: 共享你的 Kotlin Notebook)

> 从 IntelliJ IDEA 2026.2 开始, Kotlin Notebook 不再捆绑在 IDE 之内, JetBrains 也不再提供官方支持.
> 源代码继续通过 [GitHub](https://github.com/Kotlin/kotlin-notebook) 提供.
>
> 详情请参见 [blog](https://blog.jetbrains.com/idea/2026/06/kotlin-notebook-sunset/).
>
{style="note"}

要共享一个 [Kotlin Notebook](kotlin-notebook-overview.md), 你只需要将它上传到任何一个 Notebook Web 阅览器,
因为 Kotlin Notebook 遵循通用的 Jupyter 格式.

我们推荐使用以下平台来共享 Kotlin Notebook:

* **JetBrains Datalore:**
  这个平台不仅便于共享 Kotlin Notebook, 而且还能提高它们的可用性.
  [Datalore](https://datalore.jetbrains.com/) 允许你运行并编辑 Notebook, 并包含很多高级功能, 例如创建互动报表, 安排 Notebook 的运行时刻.
  关于它的实际应用, 请参见 [使用 DataFrame 的 Kotlin Datalore 示例](https://datalore.jetbrains.com/report/static/KQKedA4jDrKu63O53gEN0z/B5YeMMONSAR78FgKQ9yJyW).
  ![Datalore Notebook example](datalore-example.png){width=700}
* **GitHub**:
  GitHub 以原生方式渲染 Kotlin Notebook, 可以直接的共享和协作.
  例如, 请参见 [Kotlin DataFrame GitHub 代码仓库中的示例](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/titanic/Titanic.ipynb).
  ![GitHub Notebook example](github-notebook.png){width=700}

## 下一步做什么 {id="what-s-next"}

* 使用 [Kandy 库](data-analysis-visualization.md) 探索数据可视化
* 阅读 [使用数据源](data-analysis-work-with-data-sources.md) 章节, 学习从文件, Web 数据源, 或数据库获取数据
* 关于 Kotlin 中用于数据科学和数据分析的工具和资源, 更多介绍请参见 [用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries.md)
