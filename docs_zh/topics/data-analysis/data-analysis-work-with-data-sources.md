[//]: # (title: 从文件获取数据)
[//]: # (description: 学习如何使用 Kotlin DataFrame 从文件装载数据, 包括 CSV, JSON, SQL, Excel 以及 Apache Arrow 文件.)

[Kotlin Notebook](kotlin-notebook-overview.md), 结合 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/home.html),
让你能够处理非结构化数据和结构化数据.
这样的组合提供了一种灵活性, 能够将非结构化数据, 例如来自 TXT 文件的数据, 转换为结构化数据集.

对于数据转换, 你可以使用各种方法, 例如
[`.add()`](https://kotlin.github.io/dataframe/adddf.html),
[`.split()`](https://kotlin.github.io/dataframe/split.html),
[`.convert()`](https://kotlin.github.io/dataframe/convert.html),
和 [`.parse()`](https://kotlin.github.io/dataframe/parse.html).
此外, 这个工具集还能够获取和操作来自各种结构化文件格式的数据, 包括 CSV, JSON, XLS, Parquet, 和 Apache Arrow.
关于所有支持的格式, 请参见 [DataFrame 文档](https://kotlin.github.io/dataframe/data-sources.html).

在这篇向导中, 你会通过多个示例, 学习如何获取, 优化(Refine), 并处理数据.

## 开始前的准备工作 {id="before-you-start"}

Kotlin Notebook 需要使用 [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook),
IntelliJ IDEA 默认捆绑并启用了这个插件.

如果无法使用 Kotlin Notebook 功能, 请确认启用了 plugin.
详情请参见 [设置环境](kotlin-notebook-set-up-env.md).

要遵循本教程进行操作, 需要执行以下步骤:

1. 创建一个 [新的 Kotlin Notebook](kotlin-notebook-create.md).
2. 导入 Kotlin DataFrame:

   ```kotlin
   %use dataframe
   ```

> 要在其他所有代码单元(Code Cell)之前, 运行包含 `%use dataframe` 的代码单元,
> 以确保 DataFrame 库及其 API 在 Notebook 中可以使用.
>
{style="note"}

## 获取数据 {id="retrieve-data"}

要在 Kotlin Notebook 中从文件获取数据, 请使用 `DataFrame.read()` 函数:

```kotlin
val movies = DataFrame.read("movies.csv")
```

`DataFrame.read()` 函数会根据文件扩展名和内容自动检测输入格式.

你也可以传入其他参数, 来控制 DataFrame 库读取输入数据的方式.
例如, 下面的代码为 CSV 文件指定自定义分隔符(`;`):

```kotlin
val movies = DataFrame.read("movies.csv", delimiter = ';')
```

> 关于其它文件格式以及各种读取函数的全面概述, 请参见
> [Kotlin DataFrame 库文档](https://kotlin.github.io/dataframe/read.html).
> 
{style="tip"}

## 显示数据 {id="display-data"}

在你的 Notebook 中得到了数据之后, 你可以显示它.
最简单的方法是将数据保存在变量中, 然后返回它:

```kotlin
val jsonDf = DataFrame.read("jsonFile.json")
jsonDf
```

这段代码将你的文件中的数据显示为一个交互式表格:

![显示数据](display-data.png){width=700}

你可以使用这个视图来检查值, 查看列名, 并很容易的了解数据集状态.

## 检查数据结构 {id="inspect-data-structure"}

要深入了解你的数据的结构或模式, 请对你的 DataFrame 变量使用
[`.schema()`](https://kotlin.github.io/dataframe/schema.html) 函数.

例如, 运行 `jsonDf.schema()`, 会列出你的 JSON 数据集中每个列的类型:

![Schema 示例](schema-data-analysis.png){width=700}

在 Kotlin Notebook 中, 你也可以使用自动完成功能. 通过这个功能, 你能够快速访问和操作你的 DataFrame 的属性.
载入你的数据之后, 只需要输入 DataFrame 变量, 后面跟一个点号(`.`), 就可以看到可以访问的列以及它们的类型的列表.

![可以访问的属性](auto-completion-data-analysis.png){width=700}

## 优化数据(Refine Data) {id="refine-data"}

Kotlin DataFrame 提供了各种操作来优化你的数据集.
例如, [分组](https://kotlin.github.io/dataframe/group.html),
[过滤](https://kotlin.github.io/dataframe/filter.html),
[更新](https://kotlin.github.io/dataframe/update.html),
或者 [添加新的列](https://kotlin.github.io/dataframe/add.html).
这些函数对于数据分析非常重要, 让你能够高效的组织, 清理, 并转换你的数据.

例如, 我们来看看 `movies.csv` 数据集. 它在同一个单元格中存储了电影名称和发布年份.
我们的目的是要优化这个数据集, 以便于分析:

1. **装载数据**

   使用 `.read()` 函数将文件装载到 `DataFrame` 中:

   ```kotlin
   val movies = DataFrame.read("movies.csv")
   ```

2. **添加列**

   从 `title` 列中抽取发布年份, 添加一个新的 `year` 列:

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
   
   moviesWithYear
   ```

3. **更新值**

   从电影标题中删除发布年份, 更新 `title` 列:

   ```kotlin
   val moviesTitle = moviesWithYear
       .update("title") {
           "\\s*\\(\\d{4}\\)\\s*$".toRegex().replace(title, "") 
   }
   
   moviesTitle
   ```

   以上代码将电影标题保留在一个列中, 并将发布年份移到另一个列.

4. **过滤行**

   要只关注特定的数据, 请使用 `.filter()` 函数. 例如, 要只保留 1986 年之后发布的电影, 请运行以下代码:

   ```kotlin
   val newMovies = moviesTitle.filter { 
       year >= 1996
   }

   newMovies
   ```

5. **删除列**

   要删除不需要的列, 请使用 `.remove()` 函数:

   ```kotlin
   val refinedMovies = newMovies.remove { 
       movieID 
   }

   refinedMovies
   ```

我们来比较一下, 下面是优化之前的数据集:

![原始数据集](original-dataset.png){width=700}

下面是优化后的数据集:

![数据优化的结果](refined-data.png){width=700}

> 更多使用场景和详细示例, 请参见 [Kotlin Dataframe 示例](https://github.com/Kotlin/dataframe/tree/master/examples).
> 
{style="tip"}

## 导出数据 {id="export-data"}

在 Kotlin Notebook 中优化数据之后, 你可以轻松的导出处理后的数据.

你可以使用各种 [`.write()`](https://kotlin.github.io/dataframe/write.html) 函数来实现这个目的.
它支持保存为各种格式, 包括 CSV, JSON, XLS, XLSX, Apache Arrow, 甚至还有 HTML 表格.
关于所有支持的格式, 请参见 [DataFrame 文档](https://kotlin.github.io/dataframe/data-sources.html) .
在共享你的发现, 创建报表, 或者将你的数据用于进一步分析时, 这会非常有用.

例如, 我们将结果保存为以下几种文件:

* 保存为 JSON 文件,
  使用 [`.writeJson()`](https://kotlin.github.io/dataframe/write.html#writing-to-json) 函数:

  ```kotlin
  refinedMovies.writeJson("movies.json")
  ```
* 保存为 CSV 文件,
  使用 [`.writeCsv()`](https://kotlin.github.io/dataframe/write.html#writing-to-csv) 函数:

  ```kotlin
  refinedMovies.writeCsv("movies.csv")
  ```
* 保存为 [Apache Arrow 文件](https://kotlin.github.io/dataframe/write.html#writing-to-apache-arrow-formats),
  使用 `.writeArrowIPC()` 和 `.writeArrowFeather()` 函数:

  ```kotlin
  refinedMovies.writeArrowIPC("movies.arrow")
  refinedMovies.writeArrowFeather("movies.feather")
  ```

你也可以使用 [`.toStandaloneHTML()`](https://kotlin.github.io/dataframe/tohtml.html) 函数, 在浏览器中打开一个独立的 HTML 表格:

```kotlin
refinedMoviesDf
    .toStandaloneHTML(DisplayConfiguration(rowsLimit = null))
    .openInBrowser()
```

## 下一步做什么 {id="what-s-next"}

* 学习使用 [Kandy 库](https://kotlin.github.io/kandy/examples.html) 进行数据可视化
* 阅读 [在 Kotlin Notebook 中使用 Kandy 进行数据可视化](data-analysis-visualization.md), 学习数据可视化的更多知识
* 关于 Kotlin 中用于数据科学和分析的工具和资源的广泛的概述, 请参见 [用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries.md)
