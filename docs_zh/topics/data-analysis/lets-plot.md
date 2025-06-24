[//]: # (title: 使用 Lets-Plot for Kotlin 进行数据可视化)

[Lets-Plot for Kotlin (LPK)](https://lets-plot.org/kotlin/get-started.html) 是一个跨平台的绘图库,
它将 [R 的 ggplot2 库](https://ggplot2.tidyverse.org/) 移植到 Kotlin.
LPK 将功能丰富的 ggplot2 API 带入 Kotlin 生态系统, 适合于需要复杂的数据可视化功能的科学家和统计学家.

LPK 可用于各种平台, 包括 [Kotlin Notebooks](data-analysis-overview.md#notebooks), [Kotlin/JS](js-overview.md), [JVM 的 Swing](https://docs.oracle.com/javase/8/docs/technotes/guides/swing/), [JavaFX](https://openjfx.io/), 以及 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/).
此外, LPK 还能与 [IntelliJ](https://www.jetbrains.com/idea/), [DataGrip](https://www.jetbrains.com/datagrip/), [DataSpell](https://www.jetbrains.com/dataspell/), 和 [PyCharm](https://www.jetbrains.com/pycharm/) 无缝集成.

![Lets-Plot](lets-plot-overview.png){width=700}

本教程演示如何在 IntelliJ IDEA 中, 通过 Kotlin Notebook,
使用 LPK 和 [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html) 库创建各种类型的绘图.

## 开始前的准备工作 {id="before-you-start"}

Kotlin Notebook 需要使用 [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook),
IntelliJ IDEA 默认捆绑并启用了这个插件.

如果无法使用 Kotlin Notebook 功能, 请确认启用了 plugin.
详情请参见 [设置环境](kotlin-notebook-set-up-env.md).

创建一个新的 Kotlin Notebook, 来使用 Lets-Plot:

1. 选择 **File** | **New** | **Kotlin Notebook**.
2. 在你的 Notebook 中, 运行以下命令, LPK 和 Kotlin DataFrame 库:

    ```kotlin
    %use lets-plot
    %use dataframe
    ```

## 准备数据 {id="prepare-the-data"}

我们来创建一个 DataFrame, 存储 3 个城市月平均气温的模拟数字: 柏林, 马德里, 和加拉加斯.

使用 Kotlin DataFrame 库的 [`dataFrameOf()`](https://kotlin.github.io/dataframe/createdataframe.html#dataframeof) 函数生成 DataFrame.
在你的 Kotlin Notebook中, 粘贴并运行下面的代码片段:

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
df.head(4)
```

你可以看到, DataFrame 有 3 个列: Month, Temperature, 和 City.
DataFrame 的前 4 行包含柏林从 1 月到 4 月的温度的记录:

![浏览 DataFrame](visualization-dataframe-temperature.png){width=600}

要使用 LPK 库创建一个绘图, 你需要将你的 data (`df`) 转换为 `Map` 类型, 以键-值对的形式保存数据.
你可以使用 [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html) 函数, 很容易的将 DataFrame 转换为 `Map`:

```kotlin
val data = df.toMap()
```

## 创建散点图(Scatter Plot) {id="create-a-scatter-plot"}

我们在 Kotlin Notebook 中使用 LPK 库创建一个散点图.

有了 `Map` 格式的数据之后, 请使用 LPK 库的 [`geomPoint()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.geom/geom-point/index.html) 函数生成散点图.
你可以为 X 轴和 Y 轴指定值, 并定义分组, 以及分组的颜色.
此外, 你还可以 [定制](https://lets-plot.org/kotlin/aesthetics.html#point-shapes)
绘图的大小, 点的形状, 以符合你的需要:

```kotlin
// 指定X 轴和 Y 轴, 分组和分组的颜色, 绘图大小, 以及绘图类型
val scatterPlot =
    letsPlot(data) { x = "Month"; y = "Temperature"; color = "City" } + ggsize(600, 500) + geomPoint(shape = 15)
scatterPlot
```

结果如下:

![散点图](lets-plot-scatter.svg){width=600}

## 创建箱形图(Box Plot) {id="create-a-box-plot"}

我们来使用箱形图对 [数据](#prepare-the-data) 进行可视化.
请使用 LPK 库的 [`geomBoxplot()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.geom/geom-boxplot.html) 函数来生成绘图,
并使用 [`scaleFillManual()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.scale/scale-fill-manual.html) 函数 [定制](https://lets-plot.org/kotlin/aesthetics.html#point-shapes) 颜色:

```kotlin
// 指定X 轴和 Y 轴, 分组, 绘图大小, 以及绘图类型
val boxPlot = ggplot(data) { x = "City"; y = "Temperature" } + ggsize(700, 500) + geomBoxplot { fill = "City" } +
    // 定制颜色
    scaleFillManual(values = listOf("light_yellow", "light_magenta", "light_green"))
boxPlot
```

结果如下:

![箱形图](box-plot.svg){width=600}

## 创建 2D 密度图(Density Plot) {id="create-a-2d-density-plot"}

现在, 我们来创建一个 2D 密度图, 对一些随机数据的分布和集中度进行可视化.

### 为 2D 密度图准备数据 {id="prepare-the-data-for-the-2d-density-plot"}

1. 导入处理数据和生成绘图所需要的依赖项:

   ```kotlin
   %use lets-plot

   @file:DependsOn("org.apache.commons:commons-math3:3.6.1")
   import org.apache.commons.math3.distribution.MultivariateNormalDistribution
   ```

   > 关于对 Kotlin Notebook 导入依赖项, 详情请参见 [Kotlin Notebook 文档](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies).
   > {style="tip"}

2. 在你的 Kotlin Notebook 中, 粘贴并运行下面的代码片段, 创建一组 2D 数据点:

   ```kotlin
   // 为三个分布定义协方差矩阵
   val cov0: Array<DoubleArray> = arrayOf(
       doubleArrayOf(1.0, -.8),
       doubleArrayOf(-.8, 1.0)
   )

   val cov1: Array<DoubleArray> = arrayOf(
       doubleArrayOf(1.0, .8),
       doubleArrayOf(.8, 1.0)
   )

   val cov2: Array<DoubleArray> = arrayOf(
       doubleArrayOf(10.0, .1),
       doubleArrayOf(.1, .1)
   )

   // 定义样本数量
   val n = 400

   // 为三个分布定义均值
   val means0: DoubleArray = doubleArrayOf(-2.0, 0.0)
   val means1: DoubleArray = doubleArrayOf(2.0, 0.0)
   val means2: DoubleArray = doubleArrayOf(0.0, 1.0)

   // 从三个多元正态分布中生成随机样本
   val xy0 = MultivariateNormalDistribution(means0, cov0).sample(n)
   val xy1 = MultivariateNormalDistribution(means1, cov1).sample(n)
   val xy2 = MultivariateNormalDistribution(means2, cov2).sample(n)
   ```

   在上面的代码中, `xy0`, `xy1`, 和 `xy2` 变量存储了包含 2D (`x, y`) 数据点的数组.

3. 将你的数据转换为 `Map` 类型:

   ```kotlin
   val data = mapOf(
       "x" to (xy0.map { it[0] } + xy1.map { it[0] } + xy2.map { it[0] }).toList(),
       "y" to (xy0.map { it[1] } + xy1.map { it[1] } + xy2.map { it[1] }).toList()
   )
   ```

### 生成 2D 密度图 {id="generate-the-2d-density-plot"}

使用前面步骤中得到的 `Map`, 创建一个 2D 密度图 (`geomDensity2D`),
以散点图 (`geomPoint`) 作为背景, 这样可以更好的可视化数据点和异常值.
你可以使用 [`scaleColorGradient()`](https://lets-plot.org/kotlin/api-reference/-lets--plot--kotlin/org.jetbrains.letsPlot.scale/scale-color-gradient.html) 函数来定制颜色的梯度比例:

```kotlin
val densityPlot = letsPlot(data) { x = "x"; y = "y" } + ggsize(600, 300) + geomPoint(
    color = "black",
    alpha = .1
) + geomDensity2D { color = "..level.." } +
        scaleColorGradient(low = "dark_green", high = "yellow", guide = guideColorbar(barHeight = 10, barWidth = 300)) +
        theme().legendPositionBottom()
densityPlot
```

结果如下:

![2D 密度图](2d-density-plot.svg){width=600}

## 下一步做什么 {id="what-s-next"}

* 查看 [Lets-Plot for Kotlin 的文档](https://lets-plot.org/kotlin/charts.html) 中的更多绘图示例.
* 阅读 Lets-Plot for Kotlin 的 [API 参考文档](https://lets-plot.org/kotlin/api-reference/).
* 阅读 [Kotlin DataFrame](https://kotlin.github.io/dataframe/info.html) 和 [Kandy](https://kotlin.github.io/kandy/welcome.html) 库的文档, 学习如何使用 Kotlin 进行数据转换和可视化.
* 阅读 [Kotlin Notebook 的使用方法和主要功能](https://www.jetbrains.com/help/idea/kotlin-notebook.html) 的更多信息.
