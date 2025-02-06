[//]: # (title: Kotlin Notebook 支持的输出格式)

[Kotlin Notebook](kotlin-notebook-overview.md) 支持很多种输出类型, 包括文本, HTML, 和图片.
通过使用外部库, 你可以选择更多的输出类型, 并使用图表, 电子表格, 等等形式, 可视化你的数据.

每个输出都是一个 JSON 对象,
将 [Jupiter MIME 类型](https://jupyterlab.readthedocs.io/en/latest/user/file_formats.html) 对应到一些数据.
通过这个对应 map, Kotlin Notebook 从支持的 MIME 类型中选择最高优先级的类型, 并通过以下方式展现它:

* [Text](#texts) 使用 `text/plain` MIME 类型.
* [BufferedImage 类](#buffered-images) 使用 `image/png` MIME 类型, 对应到一个 Base64 字符串.
* [Image 类](#loaded-images), 以及 [LaTeX 格式](#math-formulas-and-equations), 使用 `text/html` MIME
  类型, 内部包含一个 `img` 标签.
* [Kotlin DataFrame 表格](#data-frames) 和 [Kandy 绘图](#charts) 使用它们自己的内部 MIME 类型, 通过静态的 HTML 或图片实现.
  通过这种方式, 你可以在 GitHub 上显示它们.

你可以手动设置这个对应关系, 例如, 要使用 Markdown 作为 cell 的输出:

```kotlin
MimeTypedResult(
    mapOf(
        "text/plain" to "123",
        "text/markdown" to "# HEADER",
        // 其它 mime:value 对
    )
)
```

要显示任何类型的输出, 请使用 `DISPLAY()` 函数.
它还能够使用多种输出的组合:

```kotlin
DISPLAY(HTML("<h2>Gaussian distribution</h2>"))
DISPLAY(LATEX("f(x) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\cdot e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}"))

val experimentX = experimentData.map { it.key }
val experimentY = experimentData.map { it.value }

DISPLAY(plot {
    bars {
        x(experimentX)
        y(experimentY)
    }
})
```

![高斯分布的不同输出](gaussian-distribution-output.png){width=700}

## 文本 {id="texts"}

### 纯文本(Plain Text) {id="plain-text"}

最简单的输出类型是纯文本. 它可以用于打印输出文字, 变量值, 或者你的代码中的任何文本输出:

```kotlin
val a1: Int = 1
val a2: Int = 2
var a3: Int? = a1 + a2

"My answer is $a3"
```

![纯文本代码输出](plain-text-output.png){width=300}

* 如果一个 cell 的结果无法 [展现](https://github.com/Kotlin/kotlin-jupyter?tab=readme-ov-file#rendering)
  并显示为任何一种输出类型, 那么它会被使用 `toString()` 函数打印输出为纯文本.
* 如果你的代码包含错误, Kotlin Notebook 会显示一个错误信息, 和一个错误追溯(traceback), 提供调试信息.

### 富文本(Rich Text) {id="rich-text"}

请选择 Markdown 类型的 cell 来使用 富文本.
通过这种方式, 你可以使用 Markdown 和 HTML 标记格式化内容, 使用列表, 表格, 字体, 代码块, 等等.
HTML 可以包含 CSS 样式 和 JavaScript.

```none
## Line magics

| Spell                              | Description                                                                                                      | Example                                                                               |
|------------------------------------|------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| <code>%use</code>                  | Injects code for supported libraries: artifact resolution, default imports, initialization code, type renderers. | <code>%use klaxon(5.5), lets-plot</code>                                              |                                         
| <code>%trackClasspath</code>       | Logs any changes of current classpath. Useful for debugging artifact resolution failures.                        | <code>%trackClasspath [on |off]</code>                                                |
| <code>%trackExecution</code>       | Logs pieces of code that are going to be executed. Useful for debugging of libraries support.                    | <code>%trackExecution [all|generated|off]</code>                                      |          
| <code>%useLatestDescriptors</code> | Use latest versions of library descriptors available. By default, bundled descriptors are used.                  | <code>%useLatestDescriptors [on|off]</code>                                           |
| <code>%output</code>               | Output capturing settings.                                                                                       | <code>%output --max-cell-size=1000 --no-stdout --max-time=100 --max-buffer=400</code> |
| <code>%logLevel</code>             | Set logging level.                                                                                               | <code>%logLevel [off|error|warn|info|debug]</code>                                    |

<ul><li><a href="https://github.com/Kotlin/kotlin-jupyter/blob/master/docs/magics.md">Learn more detailes about line magics</a>.</li>
<li><a href="https://github.com/Kotlin/kotlin-jupyter/blob/master/docs/magics.md">See the full list of supported libraries</a>.</li></ul>
```

![Markdown cell 中的富文本](markdown-cells-output.png){width=700}

## HTML {id="html"}

Kotlin Notebook 能够直接展现 HTML, 执行脚本, 甚至还能嵌入 Web 站点:

```none
HTML("""
<p>Counter: <span id="ctr">0</span> <button onclick="inc()">Increment</button></p>
<script>
    function inc() {
        let counter = document.getElementById("ctr")
        counter.innerHTML = parseInt(counter.innerHTML) + 1;
}
</script>
""")
```

![使用 HTML 脚本](direct-html-output.png){width=300}


> 请在文件的最上部将你的 Notebook 标记为 **Trusted**, 这样才能执行脚本.
>
{style="note"}

## 图片 {id="images"}

使用 Kotlin Notebook, 你可以显示图片, 图片可以来自文件, 生成的图形, 或者任何其他视觉媒体.
可以显示各种格式的静态图片, 例如 `.png`, `jpeg`, 和 `.svg`.

### 缓冲的图片 {id="buffered-images"}

默认情况下, 你可以使用 `BufferedImage` 类显示图片:

```kotlin
import java.awt.Color
import java.awt.image.BufferedImage

val width = 300
val height = width

val image = BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB)

val graphics = image.createGraphics()
graphics.background = Color.BLACK
graphics.clearRect(0, 0, width, height)
graphics.setRenderingHint(
    java.awt.RenderingHints.KEY_ANTIALIASING,
    java.awt.RenderingHints.VALUE_ANTIALIAS_ON
)
graphics.color = Color.WHITE
graphics.fillRect(width / 10, height * 8 / 10, width * 10 / 20, height / 10)
graphics.dispose()
```

![使用默认的 BufferedImage 显示图片](bufferedimage-output.png){width=400}

### 从外部加载的图片 {id="loaded-images"}

通过使用 `lib-ext` 库, 你可以扩展标准的 Jupyter 的功能, 显示从网络加载的图片:

```none
%use lib-ext(0.11.0-398)
```

```kotlin
Image("https://kotlinlang.org/docs/images/kotlin-logo.png", embed = false).withWidth(300)
```

![使用外部图片链接](external-images-output.png){width=400}

### 内嵌的图片 {id="embedded-images"}

从网络加载图片的一个缺点是, 如果链接错误, 或者失去网络连接, 图片就会消失.
要解决这个问题, 请使用内嵌的图片, 例如:

```kotlin
val kotlinMascot = Image("https://blog.jetbrains.com/wp-content/uploads/2023/04/DSGN-16174-Blog-post-banner-and-promo-materials-for-post-about-Kotlin-mascot_3.png", embed = true).withWidth(400)
kotlinMascot
```

![使用内嵌的图片](embedded-images-output.png){width=400}

## 数学公式和方程式 {id="math-formulas-and-equations"}

你可以使用 LaTeX 格式展现数学公式和方程式, 这是一种在学术界广泛使用的排版系统:

1. 添加 `lib-ext` 库, 它会向你的 Notebook 扩展 Jupyter Kernel 的功能:

   ```none
   %use lib-ext(0.11.0-398)
   ```

2. 在新的 cell 中, 运行你的公式:

   ```none
   LATEX("c^2 = a^2 + b^2 - 2 a b \\cos\\alpha")
   ```

   ![使用 LaTeX 展现数学公式](latex-output.png){width=300}

## 数据帧(Data Frame) {id="data-frames"}

使用 Kotlin Notebook, 你可以通过数据帧可视化结构化的数据:

1. 向你的 Notebook 添加 [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html) 库:

   ```none
   %use dataframe
   ```

2. 在新的 cell 中, 创建数据帧, 并运行它:

   ```kotlin
   val months = listOf(
       "January", "February",
       "March", "April", "May",
       "June", "July", "August",
       "September", "October", "November",
       "December"
   )

   // 各种产品/各个月份的销售数据:
   val salesLaptop = listOf(120, 130, 150, 180, 200, 220, 240, 230, 210, 190, 160, 140)
   val salesSmartphone = listOf(90, 100, 110, 130, 150, 170, 190, 180, 160, 140, 120, 100)
   val salesTablet = listOf(60, 70, 80, 90, 100, 110, 120, 110, 100, 90, 80, 70)
    
   // 一个数据帧, 包含 Month, Sales, 和 Product 的列
   val dfSales = dataFrameOf(
       "Month" to months + months + months,
       "Sales" to salesLaptop + salesSmartphone + salesTablet,
       "Product" to List(12) { "Laptop" } + List(12) { "Smartphone" } + List(12) { "Tablet" },
   )
   ```

   这个数据帧使用 `dataFrameOf()` 函数, 包含几种产品 (笔记本电脑, 手机, 以及平板电脑) 在 12 个月内的销售数量.

3. 浏览你的数据帧中的数据, 例如, 查找销售数量最高的产品和月份:

   ```none
   dfSales.maxBy("Sales")
   ```

   ![使用 DataFrame 来可视化数据](dataframe-output.png){width=500}

4. 你也可以将你的数据帧导出为 CSV 文件:

   ```kotlin
   // 将你的数据导出为 CSV 格式
   dfSales.writeCSV("sales-stats.csv")
   ```

## 图表 {id="charts"}

你可以在你的 Kotlin Notebook 中直接创建各种图表, 来可视化你的数据:

1. 向你的 Notebook添加 [Kandy](https://kotlin.github.io/kandy/welcome.html) 绘图库:

   ```none
   %use kandy
   ```

2. 在新的 cell 中使用同一个数据帧, 运行 `plot()` 函数:
 
   ```kotlin
   val salesPlot = dfSales.groupBy { Product }.plot {
       bars {
           // 访问数据帧的列, 用于 X 轴和 Y 轴
           x(Month)
           y(Sales)
           // 访问数据帧的列, 用于分组, 并为这些分组设置颜色
           fillColor(Product) {
               scale = categorical(
                   "Laptop" to Color.PURPLE,
                   "Smartphone" to Color.ORANGE,
                   "Tablet" to Color.GREEN
               )
               legend.name = "Product types"
           }
       }
       // 定制图表的外观
       layout.size = 1000 to 450
       layout.title = "Yearly Gadget Sales Results"
   }

   salesPlot
   ```

   ![使用 Kandy 展现可视化数据](kandy-output.png){width=700}

3. 你也可以将你的图表导出为 `.png`, `jpeg`, `.html`, 或 `.svg` 格式:

   ```kotlin
   // 为图表文件指定输出格式:
   salesPlot.save("sales-chart.svg")
   ```

## 下一步做什么 {id="what-s-next"}

* [使用 DataFrame 和 Kandy 库进行数据可视化](data-analysis-visualization.md)
* [详细了解在 Kotlin Notebook 中渲染和显示富格式输出(rich output)](https://www.jetbrains.com/help/idea/kotlin-notebook.html#render-rich-output)
* [从 CSV 和 JSON 文件获取数据](data-analysis-work-with-data-sources.md)
* [查看推荐的库](data-analysis-libraries.md)
