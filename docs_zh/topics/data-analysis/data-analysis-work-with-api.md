[//]: # (title: 从 Web 数据源和 API 获取数据)

[Kotlin Notebook](kotlin-notebook-overview.md) 提供了强大的平台, 能够从各种 Web 数据源和 API 访问和操作数据.
它提供了一个交互环境, 在这个环境中每个步骤都能够可视化, 清晰可见, 因此简化了数据抽取和分析任务.
这样的功能使得它非常适合于探索那些你不熟悉的 API.

Kotlin Notebook 在与 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html) 结合使用时,
不仅能让你连接到 API, 从 API 获取 JSON 数据, 还能帮助你重塑这些数据, 用于全面的分析和可视化.

> 关于 Kotlin Notebook 的示例, 请参见 [GitHub 上的 DataFrame 示例](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/youtube/Youtube.ipynb).
> 
{style="tip"}

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

## 从 API 获取数据 {id="fetch-data-from-an-api"}

使用 Kotlin Notebook 和 Kotlin DataFrame 库从 API 获取数据,  是通过 [`.read()`](https://kotlin.github.io/dataframe/read.html) 
函数完成的, 类似于 [从文件获取数据](data-analysis-work-with-data-sources.md#retrieve-data-from-a-file), 例如 CSV 或 JSON.
但是, 在使用基于 Web 的数据源时, 你可能需要额外的格式化处理, 来将原始的 API 数据转换为结构化的格式.

我们来看一个从 [YouTube 数据 API](https://console.cloud.google.com/apis/library/youtube.googleapis.com) 获取数据的示例:

1. 打开你的 Kotlin Notebook 文件 (`.ipynb`).

2. 导入 Kotlin DataFrame 库, 数据处理任务需要使用它.
   在一个代码单元(Code Cell)中运行以下命令:

   ```kotlin
   %use dataframe
   ```

3. 在一个新的代码单元中安全的添加你的 API Key, 这个 Key 用来对 YouTube 数据 API 请求进行认证.
   你可以从 [credentials 页面](https://console.cloud.google.com/apis/credentials) 得到你的 API Key:

   ```kotlin
   val apiKey = "YOUR-API_KEY"
   ```

4. 创建一个 load 函数, 参数是一个表示 path 的字符串, 并使用 DataFrame 的 `.read()` 函数, 从 YouTube 数据 API 获取数据:

   ```kotlin
   fun load(path: String): AnyRow = DataRow.read("https://www.googleapis.com/youtube/v3/$path&key=$apiKey")
   ```

5. 将获取的数据组织为行, 并通过 `nextPageToken` 处理 YouTube API 的分页.
   这可以保证你能够得到跨越多页的数据:

   ```kotlin
   fun load(path: String, maxPages: Int): AnyFrame {
       // 初始化一个可变的 List, 保存数据的行.
       val rows = mutableListOf<AnyRow>()

       // 设置初始页的 path, 用于载入数据.
       var pagePath = path
       do {
           // 从当前页的 path 载入数据.
           val row = load(pagePath)
           // 将载入的数据作为行, 添加到 List.
           rows.add(row)
          
           // 如果存在, 获得下一页的 token.
           val next = row.getValueOrNull<String>("nextPageToken")
           // 更新页的 path, 用于取得下一页, 其中包含新的 token.
           pagePath = path + "&pageToken=" + next

           // 继续装载, 直到不存在下一页.
       } while (next != null && rows.size < maxPages)

       // 拼接已装载的所有行, 并作为 DataFrame 返回.
       return rows.concat() 
   }
   ```

6. 在一个新的代码单元中, 使用前面定义的 `load()` 函数, 获取数据并创建一个 DataFrame.
   这个示例会获取数据, 这里是关于 Kotlin 的视频, 每页最大 50 条结果, 最大 5 页.
   结果保存在 `df` 变量中:

   ```kotlin
   val df = load("search?q=kotlin&maxResults=50&part=snippet", 5)
   df
   ```

7. 最后, 从 DataFrame 抽取元素, 并拼接在一起:

   ```kotlin
   val items = df.items.concat()
   items
   ```

## 清理和优化(Refine)数据 {id="clean-and-refine-data"}

准备你的数据集用于分析时, 清理和优化(Refine)数据是关键步骤.
[Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html) 为这些任务提供了强大的功能.
[`move`](https://kotlin.github.io/dataframe/move.html), 
[`concat`](https://kotlin.github.io/dataframe/concatdf.html), [`select`](https://kotlin.github.io/dataframe/select.html), 
[`parse`](https://kotlin.github.io/dataframe/parse.html), 和 [`join`](https://kotlin.github.io/dataframe/join.html) 
等方法, 对于组织和转换你的数据至关重要.

我们来看一个示例, 其中的数据已经 [使用 YouTube 的数据 API 获取](#fetch-data-from-an-api) 了.
目标是清理并重构数据集, 以便进行深入分析:

1. 你可以首先重整并清理你的数据.
   包括将某些列移动到新标题下, 以及删除不需要的列, 以提高清晰度:

   ```kotlin
   val videos = items.dropNulls { id.videoId }
       .select { id.videoId named "id" and snippet }
       .distinct()
   videos
   ```

2. 从清理后的数据获取分块 ID (Chunk ID), 并装载对应的视频统计数据.
   包括将数据分为较小的批次, 并获取更多详细信息:

   ```kotlin
   val statPages = clean.id.chunked(50).map {
       val ids = it.joinToString("%2C")
       load("videos?part=statistics&id=$ids")
   }
   statPages
   ```

3. 将获取的统计数据拼接起来, 并选择相关的列:

   ```kotlin
   val stats = statPages.items.concat().select { id and statistics.all() }.parse()
   stats
   ```

4. 将已有的清理后的数据, 与新获取统计数据结合起来.
   这一步会将 2 组数据合并为一个综合的 DataFrame:

   ```kotlin
   val joined = clean.join(stats)
   joined
   ```

这个示例演示了如何使用 Kotlin DataFrame 的各种函数清理, 重组织, 并增强你的数据集.
每个步骤都是为了优化数据, 使得它更适合于 [深入分析](#analyze-data-in-kotlin-notebook).

## 在 Kotlin Notebook 中分析数据 {id="analyze-data-in-kotlin-notebook"}

在你成功的使用 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html) 的函数
[获取](#fetch-data-from-an-api) 并 [清理和优化你的数据](#clean-and-refine-data) 之后,
下一步是分析这个准备好的数据集, 抽取有意义的信息.

有很多有用的方法, 例如 [`groupBy`](https://kotlin.github.io/dataframe/groupby.html) 用于数据分组,
[`sum`](https://kotlin.github.io/dataframe/sum.html) 和 [`maxBy`](https://kotlin.github.io/dataframe/maxby.html) 
用于 [汇总统计](https://kotlin.github.io/dataframe/summarystatistics.html),
以及 [`sortBy`](https://kotlin.github.io/dataframe/sortby.html) 用于数据排序.
通过这些工具, 你可以高效的执行复杂的数据分析任务.

我们来看一个示例, 使用 `groupBy` 对视频按照 channel 进行分组, 使用 `sum` 计算每个分组的总计观看次数,
使用 `maxBy` 查找每个组中最新的或最多观看次数的视频:

1. 设置引用, 简化对特定列的访问:

   ```kotlin
   val view by column<Int>()
   ```

2. 使用 `groupBy` 方法, 根据 `channel` 列分组数据, 并排序.

   ```kotlin
   val channels = joined.groupBy { channel }.sortByCount()
   ```

   在结果表中, 你可以交互式的浏览数据.
   每行对应一个 channel, 点击一行的 `group` 字段, 会展开这个行, 显示这个 channel 的视频的更多细节.

   ![展开一行, 显示更多细节](results-of-expanding-group-data-analysis.png){width=700}

   你可以点击左下方的表格图标, 返回分组的数据集.

   ![点击左下方的表格图标返回](return-to-grouped-dataset.png){width=700}

3. 使用 `aggregate`, `sum`, `maxBy`, 和 `flatten`, 创建一个 DataFrame,
   汇总每个 channel 的总计观看次数, 以及它的最新或最多观看次数的视频的详细信息:

   ```kotlin
   val aggregated = channels.aggregate {
       viewCount.sum() into view

       val last = maxBy { publishedAt }
       last.title into "last title"
       last.publishedAt into "time"
       last.viewCount into "viewCount"
       // 对 DataFrame 根据观看次数逆序排序, 并转换为扁平结构.
   }.sortByDesc(view).flatten()
   aggregated
   ```

分析结果如下:

![分析结果](kotlin-analysis.png){width=700}

关于更多高级技术, 请参见 [Kotlin DataFrame 文档](https://kotlin.github.io/dataframe/gettingstarted.html).

## 下一步做什么 {id="what-s-next"}

* 学习使用 [Kandy 库](https://kotlin.github.io/kandy/examples.html) 进行数据可视化
* 阅读 [在 Kotlin Notebook 中使用 Kandy 进行数据可视化](data-analysis-visualization.md), 学习数据可视化的更多知识
* 关于 Kotlin 中用于数据科学和分析的工具和资源的广泛的概述, 请参见 [用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries.md)
