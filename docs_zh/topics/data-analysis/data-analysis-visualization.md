[//]: # (title: 在 Kotlin Notebook 中使用 Kandy 进行数据可视化)

Kotlin 为强大而且灵活的数据可视化提供了一站式解决方案, 在深入研究复杂的模型之前, 提供一种直观的方式展现和浏览数据.

本教程演示如何在 IntelliJ IDEA 中使用 [Kotlin Notebook](kotlin-notebook-overview.md)
和 [Kandy](https://kotlin.github.io/kandy/welcome.html), [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html) 库创建各种图表.

## 开始前的准备工作 {id="before-you-start"}

Kotlin Notebook 需要使用 [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook),
IntelliJ IDEA 默认捆绑并启用了这个插件.

如果无法使用 Kotlin Notebook 功能, 请确认启用了 plugin.
详情请参见 [设置环境](kotlin-notebook-set-up-env.md).

创建一个新的 Kotlin Notebook:

1. 选择 **File** | **New** | **Kotlin Notebook**.
2. 在你的 Notebook 中, 运行以下命令, 导入 Kandy 和 Kotlin DataFrame 库:

    ```kotlin
    %use kandy
    %use dataframe
    ```

## 创建 DataFrame {id="create-the-dataframe"}

首先创建 DataFrame, 其中包含需要可视化的记录.
这个 DataFrame 存储 3 个城市月平均气温的模拟数字: 柏林, 马德里, 和加拉加斯.

使用 Kotlin DataFrame 库的 `dataFrameOf()` 函数生成 DataFrame.
请在 Kotlin Notebook 中运行下面的代码片段:

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

// df 变量保存一个 DataFrame, 包含 3 个列, 分别是月份, 气温, 城市的记录
val df = dataFrameOf(
    "Month" to months + months + months,
    "Temperature" to tempBerlin + tempMadrid + tempCaracas,
    "City" to List(12) { "Berlin" } + List(12) { "Madrid" } + List(12) { "Caracas" }
)
```

查看前 4 行, 浏览新创建的 DataFrame 的结构:

```kotlin
df.head(4)
```

你可以看到, DataFrame 有 3 个列: Month, Temperature, 和 City.
DataFrame 的前 4 行包含柏林从 1 月到 4 月的温度的记录:

![浏览 DataFrame](visualization-dataframe-temperature.png){width=600}

> 在一起使用 Kandy 和 Kotlin DataFrame 库时, 有很多选项来访问一个列的记录, 能够帮助你增加类型安全性.
> 详情请参见 [Access API](https://kotlin.github.io/dataframe/apilevels.html).
>
{style="tip"}

## 创建折线图(Line Chart) {id="create-a-line-chart"}

下面我们在 Kotlin Notebook 中, 使用前一节中的 `df` DataFrame, 创建一个折线图(Line Chart).

使用 Kandy 库的 `plot()` 函数. 在 `plot()` 函数中, 指定图表类型 (这个示例中是 `line`), 以及用于 X 轴和 Y 轴的值.
你可以定制颜色和大小:

```kotlin
df.plot {
    line {
        // 访问 DataFrame 的列, 用于 X 轴和 Y 轴
        x(Month)
        y(Temperature)
        // 访问 DataFrame 的列, 用于分组, 并为这些分组设置颜色
        color(City) {
            scale = categorical("Berlin" to Color.PURPLE, "Madrid" to Color.ORANGE, "Caracas" to Color.GREEN)
        }
        // 定制线条的大小
        width = 1.5
    }
    // 定制图表布局的大小
    layout.size = 1000 to 450
}
```

结果如下:

![折线图(Line Chart)](visualization-line-chart.svg){width=600}

## 创建点图(Point Chart) {id="create-a-points-chart"}

下面, 我们使用一个点图(Point Chart), (或者叫散点图 (Scatter Chart)) 对 `df` DataFrame 进行可视化.

在 `plot()` 函数中, 指定图表类型为 `points`. 从 `df` 的列添加 X 轴和 Y 轴的值, 以及分组值.
你也可以为图表添加标题:

```kotlin
df.plot {
    points {
        // 访问 DataFrame 的列, 用于 X 轴和 Y 轴
        x(Month) { axis.name = "Month" }
        y(Temperature) { axis.name = "Temperature" }
        // 定制点的大小
        size = 5.5
        // 访问 DataFrame 的列, 用于分组, 并为这些分组设置颜色
        color(City) {
            scale = categorical("Berlin" to Color.LIGHT_GREEN, "Madrid" to Color.BLACK, "Caracas" to Color.YELLOW)
        }
    }
    // 添加图表标题
    layout.title = "Temperature per month"
}
```

结果如下:

![点图(Point Chart)](visualization-points-chart.svg){width=600}

## 创建柱状图(Bar Chart) {id="create-a-bar-chart"}

最后, 我们创建一个柱状图(Bar Chart), 按照城市分组, 使用与前面的图表相同的数据.
对于颜色, 你也可以使用 16 进制代码:

```kotlin
// 按照城市分组
df.groupBy { City }.plot {
    // 添加图表标题
    layout.title = "Temperature per month"
    bars {
        // 访问 DataFrame 的列, 用于 X 轴和 Y 轴
        x(Month)
        y(Temperature)
        // 访问 DataFrame 的列, 用于分组, 并为这些分组设置颜色
        fillColor(City) {
            scale = categorical(
                "Berlin" to Color.hex("#6F4E37"),
                "Madrid" to Color.hex("#C2D4AB"),
                "Caracas" to Color.hex("#B5651D")
            )
        }
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
