[//]: # (title: 向你的 Kotlin Notebook 添加依赖项)

<tldr>
   <p>本章是 <strong>Kotlin Notebook 入门</strong> 教程的第 3 部分. 阅读本章之前, 请确认你已完成了之前的章节.</p>
   <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env.md">设置环境</a><br/>
      <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="kotlin-notebook-create.md">创建 Kotlin Notebook</a><br/>
      <img src="icon-3.svg" width="20" alt="Third step"/> <strong>向 Kotlin Notebook 添加依赖项</strong><br/>
  </p>
</tldr>

你已经创建了你的第一个 [Kotlin Notebook](kotlin-notebook-overview.md)! 现在我们来学习如何添加库的依赖项, 在使用高级功能时必须用到这些库.

> Kotlin 标准库直接可以使用, 因此你不必导入这些库.
> 
{style="note"}

在任何代码单元中, 你可以使用 Gradle 风格的语法, 指定库的座标(coordinate), 载入 Maven 仓库中的任何库.
但是, Kotlin Notebook 有一个简化的方法,
可以使用 [`%use` 语句](https://www.jetbrains.com/help/idea/kotlin-notebook.html#import-libraries) 载入常用的库:

```kotlin
// 请将 libraryName 替换为你想要添加的库依赖项
%use libraryName
```

你也可以在 Kotlin Notebook 中使用自动完成功能, 快速找到可用的库:

![Kotlin Notebook 中的自动完成功能](autocompletion-feature-notebook.png){width=700}

## 向你的 Kotlin Notebook 添加 Kotlin DataFrame 和 Kandy 库 {id="add-kotlin-dataframe-and-kandy-libraries-to-your-kotlin-notebook"}

我们来向你的 Kotlin Notebook 添加两个常用的 Kotlin 库依赖项:
* [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html) 让你能够在你的 Kotlin 项目中操纵数据.
  你可以使用它 从 [API](data-analysis-work-with-api.md), [SQL 数据库](data-analysis-connect-to-db.md), 以及 [各种文件格式](data-analysis-work-with-data-sources.md)(例如 CSV 或 JSON) 获取数据.
* [Kandy 库](https://kotlin.github.io/kandy/welcome.html) 为 [创建图表](data-analysis-visualization.md) 提供了一种强大而且灵活的 DSL.

要添加库, 请执行以下步骤:

1. 点击 **Add Code Cell**, 创建一个新的代码单元.
2. 在代码单元中输入以下代码:

    ```kotlin
    // 确保使用库的最新版本
    %useLatestDescriptors
    
    // 导入 Kotlin DataFrame 库
    %use dataframe
    
    // 导入 Kotlin Kandy 库
    %use kandy
    ```

3. 运行这个代码单元.

    在 `%use` 语句执行时, 它会下载库依赖项, 并向你的 Notebook 添加默认的 import.

    > 在你运行任何依赖于库的代码单元之前, 要确保运行了带有 `%use libraryName` 行的那个代码单元.
    >
    {style="note"}

4. 要使用 Kotlin DataFrame 库从 CSV 文件导入数据, 请在一个新的代码单元中使用 `.read()` 函数:

    ```kotlin
    // 从 "netflix_titles.csv" 文件导入数据, 创建一个 DataFrame.
    val rawDf = DataFrame.read("netflix_titles.csv")
    
    // 显示 DataFrame 的原始数据
    rawDf
    ```

    > 你可以从 [Kotlin DataFrame 示例的 GitHub 仓库](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/netflix/netflix_titles.csv) 下载这个示例 CSV.
    > 将它添加到你的项目目录中.
    > 
    {style="tip"}

    ![使用 DataFrame 显示数据](add-dataframe-dependency.png){width=700}

5. 在一个新的代码单元中, 使用 `.plot` 方法, 可视化显示你的 DataFrame 中的电视剧和电影的分布状况:

    ```kotlin
    rawDf
        // 计算名为 "type" 的列中出现的各个值的个数
        .valueCounts(sort = false) { type }
        // 使用指定颜色的条状图(Bar Chart) 可视化显示数据
        .plot {
            bars {
                x(type)
                y("count")
                fillColor(type) {
                    scale = categorical(range = listOf(Color.hex("#00BCD4"), Color.hex("#009688")))
                }
            }
    
            // 配置图表的布局, 并设置标题
            layout {
                title = "Count of TV Shows and Movies"
                size = 900 to 550
            }
        }
    ```

运行结果产生的图表如下:

![使用 Kandy 库可视化显示数据](kandy-library.png){width=700}

恭喜你, 你已经在你的 Kotlin Notebook 中添加并使用了这些库!
这只是你使用 Kotlin Notebook 和它 [支持的库](data-analysis-libraries.md) 所能实现的功能的一个非常简单的介绍.

## 下一步做什么 {id="what-s-next"}

* 学习如何 [共享你的 Kotlin Notebook](kotlin-notebook-share.md)
* 进一步深入了解 [向你的 Kotlin Notebook 添加依赖项](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies)
* 关于 Kotlin DataFrame 库的使用, 更加详细的介绍请参见 [从文件获取数据](data-analysis-work-with-data-sources.md)
* 关于 Kotlin 中用于数据科学和数据分析的工具和资源, 更多介绍请参见 [用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries.md)
