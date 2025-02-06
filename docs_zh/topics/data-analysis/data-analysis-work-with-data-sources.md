[//]: # (title: 从文件获取数据)

[Kotlin Notebook](kotlin-notebook-overview.md), 结合 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html),
让你能够处理非结构化数据和结构化数据.
这样的组合提供了一种灵活性, 能够将非结构化数据, 例如来自 TXT 文件的数据, 转换为结构化数据集.

对于数据转换, 你可以使用各种方法, 例如 [`add`](https://kotlin.github.io/dataframe/adddf.html), [`split`](https://kotlin.github.io/dataframe/split.html), [`convert`](https://kotlin.github.io/dataframe/convert.html), 和 [`parse`](https://kotlin.github.io/dataframe/parse.html).
此外, 这个工具集还能够获取和操作来自各种结构化文件格式的数据, 包括 CSV, JSON, XLS, XLSX, 和 Apache Arrow.

在这篇向导中, 你会通过多个示例, 学习如何获取, 优化(Refine), 并处理数据.

## 开始前的准备工作 {id="before-you-start"}

1. 下载并安装最新版的 [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/?section=mac).
2. 在 IntelliJ IDEA 中安装 [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook).

   > 或者, 也可以在 IntelliJ IDEA 中, 通过菜单 **Settings** | **Plugins** | **Marketplace**, 找到 Kotlin Notebook plugin.
   >
   {style="tip"}

3. 选择 **File** | **New** | **Kotlin Notebook**, 创建一个新的 Kotlin Notebook.
4. 在 Kotlin Notebook 中, 运行以下命令, 导入 Kotlin DataFrame 库:

   ```kotlin
   %use dataframe
   ```

## 从文件获取数据 {id="retrieve-data-from-a-file"}

在 Kotlin Notebook 中, 要从文件获取数据, 请执行以下操作:

1. 打开你的 Kotlin Notebook 文件 (`.ipynb`).
2. 在你的 Notebook 开头的代码单元(code cell)中, 添加 `%use dataframe`, 导入 Kotlin DataFrame 库.
   > 在运行依赖于 Kotlin DataFrame 库的任何其它代码单元之前, 要确保运行了带有 `%use dataframe` 的代码单元.
   >
   {style="note"}

3. 使用 Kotlin DataFrame 库的 [`.read()`](https://kotlin.github.io/dataframe/read.html) 函数获取数据.
   例如, 要读取一个 CSV 文件, 请使用: `DataFrame.read("example.csv")`.

`.read()` 函数会根据文件扩展名和内容自动检测输入格式.
你也可以添加其它参数来定制这个函数, 例如, 使用 `delimiter = ';'` 指定分隔符.

> 关于其它文件格式以及各种读取函数的全面概述, 请参见
> [Kotlin DataFrame 库文档](https://kotlin.github.io/dataframe/read.html).
> 
{style="tip"}

## 显示数据 {id="display-data"}

[在你的 Notebook 中得到了数据](#retrieve-data-from-a-file) 之后,
你可以很容易的将数据保存在变量中, 并在代码单元中运行以下代码访问它:

```kotlin
val dfJson = DataFrame.read("jsonFile.json")
dfJson
```

这段代码显示从你选择的文件得到的数据, 例如 CSV, JSON, XLS, XLSX, 或 Apache Arrow.

![显示数据](display-data.png){width=700}

要深入了解你的数据的结构或模式, 请对你的 DataFrame 变量使用 `.schema()` 函数.
例如, `dfJson.schema()` 会列出你的 JSON 数据集中每个列的类型.

![Schema 示例](schema-data-analysis.png){width=700}

在 Kotlin Notebook 中, 你也可以使用自动完成功能, 快速的访问和操作你的 DataFrame 的属性.
载入你的数据之后, 只需要输入 DataFrame 变量, 和一个点号, 就可以看到可以访问的列, 以及它们的类型的列表.

![可以访问的属性](auto-completion-data-analysis.png){width=700}

## 优化数据(Refine Data) {id="refine-data"}

Kotlin DataFrame 库中有很多种操作能够优化你的数据集, 重要的例子包括
[分组](https://kotlin.github.io/dataframe/group.html), [过滤](https://kotlin.github.io/dataframe/filter.html), [更新](https://kotlin.github.io/dataframe/update.html),
以及 [添加新的列](https://kotlin.github.io/dataframe/add.html).
这些函数对于数据分析非常重要, 让你能够高效的组织, 清理, 并转换你的数据.

我们来看一个示例, 这个示例中的数据在同一个单元格中包含电影名称以及对应的发布年份.
我们的目的是要优化这个数据集, 以便于分析:

1. 使用 `.read()` 函数将你的数据装载到 Notebook 中.
   这个示例会从名为 `movies.csv` 的CSV 文件读取数据, 并创建一个 DataFrame, 名为 `movies`:

   ```kotlin
   val movies = DataFrame.read("movies.csv")
   ```

2. 使用正规表达式, 从电影标题中抽取发布年份, 并添加为一个新的列:

   ```kotlin
   val moviesWithYear = movies
       .add("year") { 
           "\\d{4}".toRegex()
               .findAll(title)
               .lastOrNull()
               ?.value
               ?.toInt()
               ?: -1
       }
   ```

3. 修改电影标题, 从每个标题中删除发布年份.
   这一步能够清理标题, 保持一致性:

   ```kotlin
   val moviesTitle = moviesWithYear
       .update("title") {
           "\\s*\\(\\d{4}\\)\\s*$".toRegex().replace(title, "")
       }
   ```

4. 使用 `filter` 方法, 只关注特定的数据.
   在这个示例中, 我们过滤数据集, 只关注 1996 年之后发布的电影:

   ```kotlin
   val moviesNew = moviesWithYear.filter { year >= 1996 }
   moviesNew
   ```

我们来比较一下, 下面是优化之前的数据集:

![原始数据集](original-dataset.png){width=700}

下面是优化后的数据集:

![数据优化的结果](refined-data.png){width=700}

这是一个实际演示, 展示如何使用 Kotlin DataFrame 库的方法, 例如 `add`, `update`, 以及 `filter`,
在 Kotlin 中高效的优化和分析数据.

> 更多使用场景和详细示例, 请参见 [Kotlin Dataframe 示例](https://github.com/Kotlin/dataframe/tree/master/examples).
> 
{style="tip"}

## 保存 DataFrame {id="save-dataframe"}

使用 Kotlin DataFrame 库 [在 Kotlin Notebook 中优化数据](#refine-data) 之后, 你可以轻松的导出处理后的数据.
你可以使用各种 [`.write()`](https://kotlin.github.io/dataframe/write.html) 函数来实现这个目的, 它支持保存为各种格式,
包括 CSV, JSON, XLS, XLSX, Apache Arrow, 甚至还有 HTML 表格.
在共享你的发现, 创建报表, 或者将你的数据用于进一步分析时, 这会非常有用.

下面是如何过滤 DataFrame, 删除一个列, 将优化后的数据保存到 JSON 文件, 并在你的浏览器中打开一个 HTML 表格:

1. 在 Kotlin Notebook 中, 使用 `.read()` 函数, 将 `movies.csv` 文件装载到一个 DataFrame, 名为 `moviesDf`:

   ```kotlin
   val moviesDf = DataFrame.read("movies.csv")
   ```

2. 使用 `.filter` 方法过滤 DataFrame, 只包含属于 "Action" 体裁的电影:

   ```kotlin
   val actionMoviesDf = moviesDf.filter { genres.equals("Action") }
   ```

3. 使用 `.remove`, 从 DataFrame 删除 `movieId` 列:

   ```kotlin
   val refinedMoviesDf = actionMoviesDf.remove { movieId }
   refinedMoviesDf
   ```

4. Kotlin DataFrame 库提供了多种 write 函数, 可以将数据保存为不同的格式.
   在这个示例中, 使用 [`.writeJson()`](https://kotlin.github.io/dataframe/write.html#writing-to-json) 函数, 将修改过的 `movies.csv` 保存到一个 JSON 文件:

   ```kotlin
   refinedMoviesDf.writeJson("movies.json")
   ```

5. 使用 `.toStandaloneHTML()` 函数, 将 DataFrame 转换为独立的 HTML 表格, 并在你的默认 Web 浏览器中打开它:

   ```kotlin
   refinedMoviesDf.toStandaloneHTML(DisplayConfiguration(rowsLimit = null)).openInBrowser()
   ```

## 下一步做什么 {id="what-s-next"}

* 学习使用 [Kandy 库](https://kotlin.github.io/kandy/examples.html) 进行数据可视化
* 阅读 [在 Kotlin Notebook 中使用 Kandy 进行数据可视化](data-analysis-visualization.md), 学习数据可视化的更多知识
* 关于 Kotlin 中用于数据科学和分析的工具和资源的广泛的概述, 请参见 [用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries.md)
