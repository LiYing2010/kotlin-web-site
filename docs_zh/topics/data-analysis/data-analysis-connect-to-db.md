[//]: # (title: 连接数据库并获取数据)
[//]: # (description: 学习如何使用 Kotlin DataFrame 连接到 SQL 数据库, 查看表 schema, 以及获取数据.)

[Kotlin Notebook](kotlin-notebook-overview.md) 支持最常见的 SQL 数据库:

* [DuckDB](https://kotlin.github.io/dataframe/duckdb.html)
* [H2](https://kotlin.github.io/dataframe/h2.html)
* [MariaDB](https://kotlin.github.io/dataframe/mariadb.html)
* [Microsoft SQL Server](https://kotlin.github.io/dataframe/microsoft-sql-server.html)
* [MySQL](https://kotlin.github.io/dataframe/mysql.html)
* [PostgreSQL](https://kotlin.github.io/dataframe/postgresql.html)
* [SQLite](https://kotlin.github.io/dataframe/sqlite.html)

通过 [Kotlin DataFrame 库](https://kotlin.github.io/dataframe/home.html),
Kotlin Notebook 可以连接到数据库, 执行 SQL 查询, 并导入查询结果, 用于后续操作.

> 详细的示例, 请浏览 [KotlinDataFrame SQL 示例 GitHub 代码仓库](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb) 中的 Notebook.
>
{style="tip"}

## 开始前的准备工作 {id="before-you-start"}

Kotlin Notebook 需要使用 [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook),
IntelliJ IDEA 默认捆绑并启用了这个插件.

如果无法使用 Kotlin Notebook 功能, 请确认启用了 plugin.
详情请参见 [设置环境](kotlin-notebook-set-up-env.md).

要遵循本教程进行操作, 需要执行以下步骤:
1. 创建一个 [新的 Kotlin Notebook](kotlin-notebook-create.md).
2. 在 Notebook 的第一个单元中, 为你的数据库添加 Java Database Connectivity (JDBC) 驱动程序依赖项.

   例如, 要连接到 MariaDB 数据库, 请添加:

   ```kotlin
   USE {
      dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
   }
   ```
3. 导入 Kotlin DataFrame:

   ```kotlin
   %use dataframe
   ```

> 要在其他所有代码单元(Code Cell)之前, 运行包含 `%use dataframe` 的代码单元,
> 以确保 DataFrame 库及其 API 在 Notebook 中可以使用.
>
{style="note"}

## 连接到数据库 {id="connect-to-a-database"}

要连接到数据库, 请使用 `DbConnectionConfig()` 函数创建一个连接配置:

1. 导入以下功能:

   ```kotlin
   import org.jetbrains.kotlinx.dataframe.io.DbConnectionConfig
   import org.jetbrains.kotlinx.dataframe.schema.DataFrameSchema
   ```

2. 使用 `DbConnectionConfig()` 函数, 定义连接参数(URL, username, password):

   ```kotlin
   val URL = "YOUR_URL"
   val USER_NAME = "YOUR_USERNAME"
   val PASSWORD = "YOUR_PASSWORD"
   
   val dbConfig = DbConnectionConfig(URL, USER_NAME, PASSWORD)
   ```

> 关于连接 SQL 数据库, 详情请参见 [Kotlin DataFrame 文档: 从 SQL 数据库读取数据](https://kotlin.github.io/dataframe/readsqldatabases.html).
>
{style="tip"}

## 检查数据库 schema {id="inspect-database-schema"}

在装载数据之前, 先检查数据库 schema, 了解你有哪些表, 它们包含哪些列.
你可以根据 schema 来决定将哪个表装载到 DataFrame 中.

要获取数据库中所有用户创建的表的 schema, 请使用 `DataFrameSchema.readAllSqlTables()` 函数:

```kotlin
val dataSchemas = DataFrameSchema.readAllSqlTables(dbConfig)

dataSchemas.forEach { (tableName, schema) ->
    println("---Schema for table: $tableName---")
    println(schema)
    println()
}
```

## 装载数据 {id="load-data"}

在你检查了数据库 schema 并选择好数据之后, 将数据装载到 DataFrame 中.

Kotlin DataFrame 提供了两种方式从数据库装载数据:

* 直接从表装载数据.
* 装载自定义 SQL 查询的结果.

两种方式都返回一个 DataFrame, 你可以在 Kotlin Notebook 中对它进行检查, 变换, 和分析.

### 从表装载数据 {id="load-data-from-a-table"}

要从表装载数据, 请使用 [`DataFrame.readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables) 函数.

下面的示例从 `movies` 表装载最前面的 100 行:

```kotlin
val moviesDf = DataFrame.readSqlTable(
    dbConfig = dbConfig,
    tableName = "movies",
    limit = 100
)

moviesDf
```

### 使用 SQL 查询装载数据 {id="load-data-with-an-sql-query"}

要在你的数据库上执行特定的 SQL 查询, 请使用 [`DataFrame.readSqlQuery()`](https://kotlin.github.io/dataframe/readsqldatabases.html#executing-sql-queries) 函数.
当你需要在数据库中装载特定的列, 结合多个表, 过滤行, 或聚合数据时, 这种方式非常有用.

我们来获取由 Quentin Tarantino 导演的电影的数据集.
这个查询对每部电影选取电影的详细信息, 以及相关的体裁:

```kotlin
val TARANTINO_FILMS_SQL_QUERY = """
    SELECT name, year, rank, GROUP_CONCAT(genre) as "genres"
    FROM movies JOIN movies_directors ON movie_id = movies.id
    JOIN directors ON directors.id=director_id LEFT JOIN movies_genres ON movies.id = movies_genres.movie_id
    WHERE directors.first_name = "Quentin" AND directors.last_name = "Tarantino"
    GROUP BY name, year, rank
    ORDER BY year
    """

val tarantinoMoviesDf = DataFrame.readSqlQuery(dbConfig, TARANTINO_FILMS_SQL_QUERY)

tarantinoMoviesDf
```

## 处理数据 {id="process-data"}

将数据库中的数据装载到 DataFrame 之后, 你可以使用 DataFrame 的操作来处理获取的数据.

例如, 我们来操作上一节中的数据. 下面的代码执行以下操作:
1. 替换 `year` 列中缺失的值,
   使用 [`.fillNA()`](https://kotlin.github.io/dataframe/fill.html#fillna) 函数.
2. 将该列转换为 `Int`,
   使用 [`.convert()`](https://kotlin.github.io/dataframe/convert.html) 函数.
3. 只保留 2000 年之后发布的影片
   使用 [`.filter()`](https://kotlin.github.io/dataframe/filter.html) 函数.

```kotlin
val filteredTarantinoMovies = tarantinoMoviesDf
    .fillNA { year }.with { 0 }
    .convert { year }.toInt()
    .filter { year > 2000 }

filteredTarantinoMovies
```

## 分析数据 {id="analyze-data"}

使用 [Kotlin Notebook](kotlin-notebook-overview.md) 和 [DataFrame 库](https://kotlin.github.io/dataframe/home.html),
对数据进行分组, 排序, 以及聚合, 帮助你发现和理解数据中的模式.

例如, 我们来从 `actors` 表读取演员数据, 找出前 20 个最常见的名字:

```kotlin
// 从 actors 表获取数据
val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
val top20ActorNames = actorDf
   // 根据 first_name 列分组数据
   .groupBy { first_name }

   // 计算每个名字出现的次数
   .count()

   // 对计数结果逆向排序
   .sortByDesc("count")

   // 选择前 20 个最常见的名字, 用于分析
   .take(20)
```

## 下一步做什么 {id="what-s-next"}

* 学习使用 [Kandy 库](https://kotlin.github.io/kandy/examples.html) 进行数据可视化
* 阅读 [在 Kotlin Notebook 中使用 Kandy 进行数据可视化](data-analysis-visualization.md), 学习数据可视化的更多知识
* 关于 Kotlin 中用于数据科学和分析的工具和资源的广泛的概述, 请参见 [用于数据分析的 Kotlin 和 Java 库](data-analysis-libraries.md)
