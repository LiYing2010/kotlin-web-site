[//]: # (title: 连接数据库并获取数据)

[Kotlin Notebook](kotlin-notebook-overview.md) 提供了连接各种类型的 SQL 数据库并获取数据的能力, 例如 MariaDB, PostgreSQL, MySQL, 以及 SQLite.
使用 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html), Kotlin Notebook 可以连接到数据库, 执行 SQL 查询, 并导入查询结果, 用于后续操作.

详细的示例, 请参见 [KotlinDataFrame SQL 示例 GitHub 代码仓库中的 Notebook](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb).

## 开始前的准备工作 {id="before-you-start"}

Kotlin Notebook 需要使用 [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook),
IntelliJ IDEA 默认捆绑并启用了这个插件.

如果无法使用 Kotlin Notebook 功能, 请确认启用了 plugin.
详情请参见 [设置环境](kotlin-notebook-set-up-env.md).

创建一个新的 Kotlin Notebook:

1. 选择 **File** | **New** | **Kotlin Notebook**.
2. 确保你能够访问一个 SQL 数据库, 例如 MariaDB 或 MySQL.


## 连接到数据库 {id="connect-to-database"}

你可以使用 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html) 中特定的函数, 连接到 SQL 数据库, 并与它交互.
你可以使用 `DatabaseConfiguration` 来对你的数据库建立连接, 使用 `getSchemaForAllSqlTables()` 来获取数据库中所有表的 schema.

我们来看一个示例:

1. 打开你的 Kotlin Notebook 文件 (`.ipynb`).
2. 添加一个 JDBC (Java Database Connectivity) 驱动程序的依赖项, 并指定 JDBC 驱动程序的版本.
   这个示例使用 MariaDB:

   ```kotlin
   USE {
       dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
   }
   ```

3. 导入 Kotlin DataFrame 库, 数据处理任务需要使用它, 以及 SQL 连接和工具函数所需要的 Java 库:

   ```kotlin
   %use dataframe
   import java.sql.DriverManager
   import java.util.*
   ```

4. 使用 `DatabaseConfiguration` 类, 定义你的数据库的连接参数, 包括 URL, username, password:

   ```kotlin
   val URL = "YOUR_URL"
   val USER_NAME = "YOUR_USERNAME"
   val PASSWORD = "YOUR_PASSWORD"
   
   val dbConfig = DatabaseConfiguration(URL, USER_NAME, PASSWORD)
   ```

5. 连接完成后, 使用 `getSchemaForAllSqlTables()` 函数, 对数据库中的每个表获取并显示 schema 信息:

   ```kotlin
   val dataschemas = DataFrame.getSchemaForAllSqlTables(dbConfig)

   dataschemas.forEach { 
       println("---Yet another table schema---")
       println(it)
       println()
   }
   ```

   > 关于连接 SQL 数据库, 详情请参见 [Kotlin DataFrame 文档: 从 SQL 数据库读取数据](https://kotlin.github.io/dataframe/readsqldatabases.html).
   > 
   {style="tip"}

## 获取和操作数据 {id="retrieve-and-manipulate-data"}

在 [建立到 SQL 数据库的连接](#connect-to-database) 之后, 你就可以在 Kotlin Notebook 中, 使用 Kotlin DataFrame 库获取和操作数据.
你可以使用 `readSqlTable()` 函数来获取数据.
要操作数据, 可以使用各种方法, 例如 [`filter`](https://kotlin.github.io/dataframe/filter.html), [`groupBy`](https://kotlin.github.io/dataframe/groupby.html), 和 [`convert`](https://kotlin.github.io/dataframe/convert.html).

我们来看一个示例, 它会连接到一个 IMDB 数据库, 获取由 Quentin Tarantino 导演的电影数据:

1. 使用 `readSqlTable()` 函数, 从 "movies" 表获取数据,
   为了提高效率, 设置 `limit`, 来限制只查询最前面的 100 条记录:

   ```kotlin
   val dfs = DataFrame.readSqlTable(dbConfig, tableName = "movies", limit = 100)
   ```

2. 使用一个 SQL 查询来获取由 Quentin Tarantino 导演的电影的数据集.
   这个查询对每部电影选取电影的详细信息, 以及相关的体裁:

   ```kotlin
   val props = Properties()
   props.setProperty("user", USER_NAME)
   props.setProperty("password", PASSWORD)
   
   val TARANTINO_FILMS_SQL_QUERY = """
       SELECT name, year, rank, GROUP_CONCAT(genre) as "genres"
       FROM movies JOIN movies_directors ON movie_id = movies.id
       JOIN directors ON directors.id=director_id LEFT JOIN movies_genres ON movies.id = movies_genres.movie_id
       WHERE directors.first_name = "Quentin" AND directors.last_name = "Tarantino"
       GROUP BY name, year, rank
       ORDER BY year
       """
   
   // 获取 Quentin Tarantino 的电影的列表, 包括它们的名称, 年份, 等级, 以及所有体裁组成的字符串.
   // 查询结果按照名称, 年份, 等级分组, 并安装年份排序.
   
   var dfTarantinoMovies: DataFrame<*>
   
   DriverManager.getConnection(URL, props).use { connection ->
       connection.createStatement().use { st ->
           st.executeQuery(TARANTINO_FILMS_SQL_QUERY).use { rs ->
               val dfTarantinoFilmsSchema = DataFrame.getSchemaForResultSet(rs, connection)
               dfTarantinoFilmsSchema.print()

               dfTarantinoMovies = DataFrame.readResultSet(rs, connection)
               dfTarantinoMovies
         }
      }
   }
   ```

3. 在获取 Tarantino 的电影的数据集之后, 你可以进行进一步的操作, 过滤数据.

   ```kotlin
   val df = dfTarantinoMovies
       // 将 'year' 列中缺失的值全部替换为 0.
       .fillNA { year }.with { 0 }
       
       // 将 'year' 列转换为整数.
       .convert { year }.toInt()
   
       // 过滤数据, 只包含 2000 之后发布的电影.
       .filter { year > 2000 }
   df
   ```

输出结果是一个 DataFrame, 其中, year 列缺失的值使用 [`fillNA`](https://kotlin.github.io/dataframe/fill.html#fillna) 方法替换为 0.
year 列使用 [`convert`](https://kotlin.github.io/dataframe/convert.html) 方法转换为整数值,
数据使用 [`filter`](https://kotlin.github.io/dataframe/filter.html) 方法过滤, 只包含 2000 年之后的行.

## 在 Kotlin Notebook 中分析数据 {id="analyze-data-in-kotlin-notebook"}

在 [建立到 SQL 数据库的连接](#connect-to-database) 之后, 你可以使用 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/gettingstarted.html),
在 Kotlin Notebook 中进行深度的数据分析.
其中包含用于分组, 排序, 以及聚合数据的函数, 帮助你发现和理解数据中的模式.

我们来深入一个示例, 它会分析一个电影数据库中的演员数据, 重点关注最常出现的演员名字:

1. 使用 [`readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables) 函数,
   从 "actors" 表获取数据:

   ```kotlin
   val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
   ```

2. 处理获取的数据, 找出前 20 个最常见的演员名字. 这个分析使用几个 DataFrame 方法:

   ```kotlin
   val top20ActorNames = actorDf
       // 根据 first_name 列分组数据, 安装演员的名字组织数据.
      .groupBy { first_name }
   
       // 计算每个名字出现的次数, 产生一个分布频率.
      .count()
   
       // 对计数结果逆向排序, 找出最常见的名字.
      .sortByDesc("count")
   
       // 选择前 20 个最常见的名字, 进行分析.
      .take(20)
   top20ActorNames
   ```

## 下一步做什么 {id="what-s-next"}

* 学习使用 [Kandy 库](https://kotlin.github.io/kandy/examples.html) 进行数据可视化
* 阅读 [在 Kotlin Notebook 中使用 Kandy 进行数据可视化](data-analysis-visualization.md), 学习数据可视化的更多知识
* 关于 Kotlin 中用于数据科学和分析的工具和资源的广泛的概述, 请参见 [用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries.md)
