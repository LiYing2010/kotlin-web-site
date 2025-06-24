[//]: # (title: 用于数据分析的 Kotlin 和 Java 库)

从数据采集到建模, Kotlin 提供了强大的库, 便利的完成在数据流程中的各种任务.

除了自己的库之外, Kotlin 还 100% 能够与 Java 互操作.
通过这种互操作能力, 可以利用经过实践验证的 Java 库的整个生态系统, 而且性能优异.
有了这些能力, 你可以在 [Kotlin 数据项目](data-analysis-overview.md) 中非常容易的使用 Kotlin 或 Java 库.

## Kotlin 库

<table>
  <tr>
    <td><strong>库</strong></td>
    <td><strong>用途</strong></td>
    <td><strong>功能特性</strong></td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/Kotlin/dataframe"><strong>Kotlin DataFrame</strong></a>
    </td>
    <td>
      <list>
        <li>数据采集</li>
        <li>数据清理和处理</li>
      </list>
    </td>
    <td>
      <list>
        <li>用于创建, 排序, 以及清理数据帧(Data Frame), 特征工程, 等等操作</li>
        <li>结构化数据处理</li>
        <li>支持 CSV, JSON, 以及其他输入格式</li>
        <li>从 SQL 数据库读取数据</li>
        <li>连接各种 APIs 来访问数据, 并增强类型安全性</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://kotlin.github.io/kandy/welcome.html"><strong>Kandy</strong></a>
    </td>
    <td>
      <list>
        <li>数据浏览和可视化</li>
      </list>
    </td>
    <td>
      <list>
        <li>强大, 易读, 并且类型安全的 DSL, 绘制各种类型的图表</li>
        <li>使用 Kotlin 编写, 运行于 JVM 平台的开源库</li>
        <li>支持 <a href="https://kotlin.github.io/kandy/kandy-in-kotlin-notebook.html">Kotlin Notebook</a>, <a href="https://kotlin.github.io/kandy/kandy-in-datalore.html">Datalore</a>, 以及 <a href="https://kotlin.github.io/kandy/kandy-in-jupyter-notebook.html">Jupyter Notebook</a></li>
        <li>与 <a href="https://kotlin.github.io/dataframe/overview.html">Kotlin DataFrame</a> 无缝集成</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/jetbrains/kotlindl"><strong>KotlinDL</strong></a>
    </td>
    <td>
      <list>
        <li>建模</li>
      </list>
    </td>
    <td>
      <list>
        <li>受 <a href="https://keras.io/">Keras</a> 启发, 使用 Kotlin 编写的深度学习 API</li>
        <li>从头开始训练深度学习模型, 或者导入既有的 Keras 和 ONNX 模型用于推理</li>
        <li>迁移学习(Transferring Learning), 根据你的任务定制既有的预先训练的模型</li>
        <li>支持 <a href="https://developer.android.com/about">Android 平台</a></li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/Kotlin/multik"><strong>Multik</strong></a>
    </td>
    <td>
      <list>
        <li>数据清理和处理</li>
        <li>建模</li>
      </list>
    </td>
    <td>
      <list>
        <li>对多维数组的数学运算 (线性代数, 统计, 算数, 以及其它计算)</li>
        <li>创建, 复制, 索引, 切片, 以及其它数组运算</li>
        <li>符合 Kotlin 习惯的库, 具有类型性, 维度安全性, 可交换的计算引擎, 等等优点, 可在 JVM 上运行, 或作为原生代码运行</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/JetBrains/kotlin-spark-api"><strong>Kotlin for Apache Spark</strong></a>
    </td>
    <td>
      <list>
        <li>数据采集</li>
        <li>数据清理和处理</li>
        <li>数据浏览和可视化</li>
        <li>建模</li>
      </list>
    </td>
    <td>
      <list>
        <li><a href="https://spark.apache.org/">Apache Spark</a> 和 Kotlin 之间的兼容层</li>
        <li>符合 Kotlin 习惯的代码编写的 Apache Spark 数据转换操作</li>
        <li>在大括号或方法引用中简单的使用 Kotlin 功能, 例如数据类, Lambda 表达式</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://lets-plot.org/kotlin/get-started.html"><strong>Lets-Plot</strong></a>
    </td>
    <td>
      <list>
        <li>数据浏览和可视化</li>
      </list>
    </td>
    <td>
      <list>
        <li>使用 Kotlin 语言绘制统计数据</li>
        <li>支持 <a href="https://plugins.jetbrains.com/plugin/16340-kotlin-notebook">Kotlin Notebook</a>, <a href="https://datalore.jetbrains.com/">Datalore</a>, 和 <a href="https://github.com/Kotlin/kotlin-jupyter#readme">Jupyter with Kotlin Kernel</a></li>
        <li>兼容 JVM, JS, 和 Python</li>
        <li>在 <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a> 应用程序中内嵌图表</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/mipt-npm/kmath"><strong>KMath</strong></a>
    </td>
    <td>
      <list>
        <li>数据清理和处理</li>
        <li>数据浏览和可视化</li>
        <li>建模</li>
      </list>
    </td>
    <td>
      <list>
        <li>在 <a href="https://www.jetbrains.com/kotlin-multiplatform/">Kotlin Multiplatform</a> (JVM, JS, Native, 和 Wasm) 中处理数学抽象的模块化库</li>
        <li>用于代数结构, 数学表达式, 直方图, 和流操作的 API</li>
        <li>可以既有的 Java 和 Kotlin 库互换的包装, 包括 <a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j">ND4J</a>, <a href="https://commons.apache.org/proper/commons-math/">Apache Commons Math</a>, 和 <a href="https://github.com/Kotlin/multik">Multik</a></li>
        <li>受 Python 的 <a href="https://numpy.org/">NumPy</a> 启发, 但添加了其它功能, 例如类型安全</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/holgerbrandl/kravis"><strong>kravis</strong></a>
    </td>
    <td>
      <list>
        <li>数据浏览和可视化</li>
      </list>
    </td>
    <td>
      <list>
        <li>表格数据的可视化</li>
        <li>受 R 的 <a href="https://ggplot2.tidyverse.org/">ggplot</a> 启发</li>
        <li>支持 <a href="https://github.com/Kotlin/kotlin-jupyter#readme">Jupyter with Kotlin Kernel</a></li>
      </list>
    </td>
  </tr>
</table>

## Java 库

由于 Kotlin 提供了与 Java 一流的互操作性, 你可以在你的 Kotlin 代码中使用 Java 的数据任务库.
下面是这些库的一些例子:

<table>
  <tr>
    <td><strong>库</strong></td>
    <td><strong>用途</strong></td>
    <td><strong>功能特性</strong></td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/jtablesaw/tablesaw"><strong>Tablesaw</strong></a>
    </td>
    <td>
      <list>
        <li>数据采集</li>
        <li>数据清理和处理</li>
        <li>数据浏览和可视化</li>
      </list>
    </td>
    <td>
      <list>
        <li>用于装载, 清理, 转换, 过滤, 以及汇总数据的工具</li>
        <li>受 <a href="https://plotly.com/">Plot.ly</a> 启发</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://stanfordnlp.github.io/CoreNLP/"><strong>CoreNLP</strong></a>
    </td>
    <td>
      <list>
        <li>数据清理和处理</li>
      </list>
    </td>
    <td>
      <list>
        <li>用于自然语言处理的工具包</li>
        <li>文本的语言注解, 例如情感和引用归属</li>
        <li>支持 8 种语言</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/haifengl/smile"><strong>Smile</strong></a>
    </td>
    <td>
      <list>
        <li>数据清理和处理</li>
        <li>数据浏览和可视化</li>
        <li>建模</li>
      </list>
    </td>
    <td>
      <list>
        <li>用于机器学习和自然语言处理的现成算法</li>
        <li>线性代数, 绘图, 插值, 以及可视化工具</li>
        <li>提供功能强大的 <a href="https://github.com/haifengl/smile/tree/master/kotlin">Kotlin API</a>, <a href="https://github.com/haifengl/smile/tree/master/scala">Scala API</a>, <a href="https://github.com/haifengl/smile/tree/master/clojure">Clojure API</a>, 等等</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/londogard/smile-nlp-kt"><strong>Smile-NLP-kt</strong></a>
    </td>
    <td>
      <list>
        <li>数据清理和处理</li>
      </list>
    </td>
    <td>
      <list>
        <li>使用 Kotlin 重写的, Smile 的自然语言处理部分的 <a href="https://www.scala-lang.org/api/current/">Scala</a> 隐式转换(implicit) </li>
        <li>运算使用 Kotlin 扩展函数和接口格式</li>
        <li>语句分解, 词干提取, 词袋分析, 以及其它任务</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j"><strong>ND4J</strong></a>
    </td>
    <td>
      <list>
        <li>数据清理和处理</li>
        <li>建模</li>
      </list>
    </td>
    <td>
      <list>
        <li>用于 JVM 平台的矩阵数学库</li>
        <li>超过 500 种数学, 线性代数, 以及深度学习运算</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://commons.apache.org/proper/commons-math/"><strong>Apache Commons Math</strong></a>
    </td>
    <td>
      <list>
        <li>数据清理和处理</li>
        <li>建模</li>
      </list>
    </td>
    <td>
      <list>
        <li>Java 的数学和统计运算</li>
        <li>相关性, 分布, 线性代数, 几何, 以及其它运算</li>
        <li>机器学习模型</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://nm.dev/"><strong>NM Dev</strong></a>
    </td>
    <td>
      <list>
        <li>数据清理和处理</li>
        <li>建模</li>
      </list>
    </td>
    <td>
      <list>
        <li>Java 的数值算法数学库</li>
        <li>面向对象的数值方法</li>
        <li>线性代数, 优化, 统计, 微积分, 以及其它运算</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://opennlp.apache.org/"><strong>Apache OpenNLP</strong></a>
    </td>
    <td>
      <list>
        <li>数据清理和处理</li>
        <li>建模</li>
      </list>
    </td>
    <td>
      <list>
        <li>基于机器学习的自然语言文本处理工具包</li>
        <li>标记化, 语句分割, 词性标注, 以及其它任务</li>
        <li>用于数据建模和模型验证的内建工具</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/HanSolo/charts"><strong>Charts</strong></a>
    </td>
    <td>
      <list>
        <li>数据浏览和可视化</li>
      </list>
    </td>
    <td>
      <list>
        <li>用于科学图表的 <a href="https://openjfx.io/">JavaFX</a> 库</li>
        <li>复杂图表，例如对数图, 热图, 以及力导向图(Force-Directed Graph)</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://deeplearning4j.konduit.ai"><strong>DeepLearning4J</strong></a>
    </td>
    <td>
      <list>
        <li>建模</li>
      </list>
    </td>
    <td>
      <list>
        <li>Java 的深度学习库</li>
        <li>导入并重新训练模型 (<a href="https://pytorch.org/">Pytorch</a>, <a href="https://www.tensorflow.org/">Tensorflow</a>, <a href="https://keras.io/">Keras</a>)</li>
        <li>在 JVM 微服务环境, 移动设备, IoT, 以及 <a href="https://spark.apache.org/">Apache Spark</a> 中部署</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/TimefoldAI/"><strong>Timefold</strong></a>
    </td>
    <td>
      <list>
        <li>建模</li>
      </list>
    </td>
    <td>
      <list>
        <li>最优规划问题的求解器实用程序</li>
        <li>兼容面向对象编程和函数式编程</li>
      </list>
    </td>
  </tr>
</table>
