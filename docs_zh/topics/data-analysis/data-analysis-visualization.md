[//]: # (title: 使用 Kandy 进行数据可视化)
[//]: # (description: 学习如何使用 Kandy 和 Kotlin DataFrame 进行数据可视化, 创建折线图, 点图, 和柱状图.)

Kotlin 为强大而且灵活的数据可视化提供了一站式解决方案, 在深入研究复杂的模型之前, 提供一种直观的方式展现和浏览数据.

本教程演示如何在 IntelliJ IDEA 中使用 [Kotlin Notebook](kotlin-notebook-overview.md)
和 [Kandy](https://kotlin.github.io/kandy/welcome.html),
[Kotlin DataFrame](https://kotlin.github.io/dataframe/home.html) 库创建各种图表.

## 开始前的准备工作 {id="before-you-start"}

Kotlin Notebook 需要使用 [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook),
IntelliJ IDEA 默认捆绑并启用了这个插件.

如果无法使用 Kotlin Notebook 功能, 请确认启用了 plugin.
详情请参见 [设置环境](kotlin-notebook-set-up-env.md).

要遵循本教程进行操作, 需要执行以下步骤:

1. 创建一个 [新的 Kotlin Notebook](kotlin-notebook-create.md).
2. 在你的 Notebook 中, 导入 [Kandy](https://kotlin.github.io/kandy/welcome.html) 和 [Kotlin DataFrame](https://kotlin.github.io/dataframe/home.html):

   ```kotlin
   %use kandy
   %use dataframe
   ```

> 要在其他所有代码单元(Code Cell)之前, 运行包含 `%use dataframe` 的代码单元,
> 以确保 DataFrame 库及其 API 在 Notebook 中可以使用.
>
{style="note"}


## 创建 DataFrame {id="create-a-dataframe"}

首先, 我们来创建一个 DataFrame, 其中包含需要可视化的数据.
这个 DataFrame 存储柏林, 马德里, 和加拉加斯的月平均气温模拟数据:

```kotlin
// months 变量保存一年中 12 个月份的列表
val months = listOf(
    "January", "February",
    "March", "April", "May",
    "June", "July", "August",
    "September", "October", "November",
    "December"
)
// tempBerlin, tempMadrid, 和 tempCaracas 变量保存每个月的气温值的列表
val tempBerlin =
    listOf(-0.5, 0.0, 4.8, 9.0, 14.3, 17.5, 19.2, 18.9, 14.5, 9.7, 4.7, 1.0)
val tempMadrid =
    listOf(6.3, 7.9, 11.2, 12.9, 16.7, 21.1, 24.7, 24.2, 20.3, 15.4, 9.9, 6.6)
val tempCaracas =
    listOf(27.5, 28.9, 29.6, 30.9, 31.7, 35.1, 33.8, 32.2, 31.3, 29.4, 28.9, 27.6)
```

然后, 我们创建一个新变量 (`df`), 并使用
[`dataFrameOf()`](https://kotlin.github.io/dataframe/createdataframe.html#dataframeof) 函数
生成一个 DataFrame, 包含 3 列 (Month, Temperature, 和 City):

```kotlin
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
```

要预览数据, 使用 [`.head()`](https://kotlin.github.io/dataframe/head.html) 函数:

```kotlin
df.head(4) // 返回前 4 行
```

在我们的数据集中, 前 4 行存储的是柏林从 1 月到 4 月的气温:

![浏览 DataFrame](visualization-dataframe-temperature.png){width=600}

> 在一起使用 Kandy 和 Kotlin DataFrame 库时, 有很多选项来访问一个列的记录, 能够帮助你增加类型安全性.
> 详情请参见 [Access API](https://kotlin.github.io/dataframe/apilevels.html).
>
{style="tip"}

## 创建折线图(Line Chart) {id="create-a-line-chart"}

下面我们在 Kotlin Notebook 中, 使用前一节中的 `df` DataFrame, 创建一个折线图(Line Chart):

1. 调用 Kandy 库的 `.plot()` 函数.
2. 添加 `line()` 层.
3. 将 `Month` 和 `Temperature` 列分别映射到 `X` 和 `Y` 轴.
4. (可选) 定制颜色和大小.

```kotlin
df.plot {
   line {
      x(Month)
      y(Temperature)

      color(City) {
         scale = categorical(
            "Berlin" to Color.hex("#6F4E37"),
            "Madrid" to Color.hex("#C2D4AB"),
            "Caracas" to Color.hex("#B5651D")
         )
      }
      width = 1.5
   }
   layout {
      size = 1000 to 450
   }
}
```

结果如下:

![折线图(Line Chart)](visualization-line-chart.svg){width=600}

## 创建点图(Point Chart) {id="create-a-points-chart"}

下面, 我们使用一个点图(Point Chart) (或者叫散点图 (Scatter Chart)) 对 `df` DataFrame 进行可视化:

1. 调用 Kandy 库的 `.plot()` 函数.
2. 添加 `points()` 层.
3. 将 `Month` 和 `Temperature` 列分别映射到 `X` 和 `Y` 轴.
4. (可选) 定制颜色, 轴标签, 点的大小, 以及图表标题.

```kotlin
df.plot {
   points {
      x(Month) {
         axis.name = "Month"
      }
      y(Temperature) {
         axis.name = "Temperature"
      }

      color(City) {
         scale = categorical(
            "Berlin" to Color.hex("#6F4E37"),
            "Madrid" to Color.hex("#C2D4AB"),
            "Caracas" to Color.hex("#B5651D")
         )
      }
      size = 5.5
   }
   layout {
      title = "Temperature per month"
   }
}
```

结果如下:

![点图(Point Chart)](visualization-points-chart.svg){width=600}

## 创建柱状图(Bar Chart) {id="create-a-bar-chart"}

最后, 我们为每个城市创建一个柱状图(Bar Chart):

1. 使用 `.groupBy()` 函数, 按 `City` 列对 DataFrame 进行分组.
2. 调用 Kandy 库的 `plot()` 函数.
3. 添加 `bars()` 层.
4. (可选) 为图表添加标题, 定制颜色.

```kotlin
df.groupBy { City }.plot {
    bars {
        x(Month)
        y(Temperature)
        
        fillColor(City) {
            scale = categorical(
                "Berlin" to Color.hex("#6F4E37"),
                "Madrid" to Color.hex("#C2D4AB"),
                "Caracas" to Color.hex("#B5651D")
            )
        }
    }
    layout.title {
       title = "Temperature per month"
    }
}
```

结果如下:

![Bar chart](visualization-bar-chart.svg){width=600}

## 下一步做什么 {id="what-s-next"}

* 阅读 [Kandy 库文档](https://kotlin.github.io/kandy/examples.html), 查看更多图表示例
* 阅读 [Lets-Plot 库文档](lets-plot.md), 查看更多高级绘图选项
* 阅读 [Kotlin DataFrame 库文档](https://kotlin.github.io/dataframe/info.html), 了解创建, 浏览, 管理数据帧(Data Frame)的更多信息
* 观看 [YouTube 视频]( https://www.youtube.com/watch?v=m4Cqz2_P9rI&t=4s), 了解 Kotlin Notebook 中的数据可视化的更多信息
