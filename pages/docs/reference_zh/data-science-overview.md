---
type: doc
layout: reference
category: "概述"
title: "在数据科学(Data Science)中使用 Kotlin"
---

# 在数据科学(Data Science)中使用 Kotlin

最终更新: {{ site.data.releases.latestDocDate }}

无论是创建数据管道(data pipeline), 还是构建真实生产环境的机器学习模型(machine learning model), Kotlin 都可以是很好的数据处理工具:
* Kotlin 代码简洁, 易读, 而且易于学习.
* 静态类型系统, 以及 null 值安全性, 有助于创建可靠, 易于维护的代码, 而且易于追中错误.
* Kotlin 是基于 JVM 平台的编程语言, 因此提供了非常好的运行性能, 并且可以灵活运用整个 Java 生态环境, 包括所有那些经过长期广泛使用的 Java 库.

## 交互式编辑器

Notebook, 比如
[Kotlin Notebook](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook),
[Jupyter Notebook](https://jupyter.org/),
以及 [Datalore](http://jetbrains.com/datalore)
提供了许多便利的工具, 用来可视化数据, 以及探索研究.
Kotlin 与这些工具集成, 可以帮助你研究数据, 将你的发现与同事共享, 逐渐提升你的数据科学和机器学习技能.

### Kotlin Notebook

[Kotlin Notebook](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)
是一个 IntelliJ IDEA plugin, 可以使用 Kotlin 来创建 notebook.
它利用了 [Kotlin Kernel](#jupyter-kotlin-kernel) 来执行各个单元(cell),
并利用强大的 Kotlin IDE 支持, 实现实时的代码查看.
它现在是 Kotlin notebook 开发的推荐方式.
更多详情, 请阅读我们的 [Blog](https://blog.jetbrains.com/kotlin/2023/07/introducing-kotlin-notebook/).

<img src="/assets/docs/images/data-science/kotlin-notebook.png" alt="Kotlin Notebook" width="800"/>

### Datalore 的 Kotlin Notebooks

通过 Datalore, 你可以直接 在浏览器中使用 Kotlin, 不需要额外安装.
你还可以通过 Kotlin notebooks 实时的协作, 编写代码时得到智能的代码辅助, 以及通过交互式报告或静态报告共享结果.
请参见 [示例报告](https://datalore.jetbrains.com/view/report/9YLrg20eesVX2cQu1FKLiZ).

<img src="/assets/docs/images/data-science/kotlin-datalore.png" alt="Kotlin in Datalore" width="800"/>

[注册免费的 Datalore 社区帐号来使用 Kotlin](https://datalore.jetbrains.com/).

### Jupyter 的 Kotlin Kernel

Jupyter Notebook 是一个开源的 Web 应用程序, 你可以用来创建和分享文档(也称为 "notebook"), 其中包含代码, 可视化的数据, 以及 Markdown 格式的文本.
[Kotlin-jupyter](https://github.com/Kotlin/kotlin-jupyter) 是一个开源项目, 可以在 Jupyter Notebook 中添加对 Kotlin 的支持.

<img src="/assets/docs/images/data-science/kotlin-jupyter-kernel.png" alt="Kotlin in Jupyter notebook" width="800"/>

关于 Kotlin Kernel 的安装指南, 文档, 以及示例, 请查看它的 [GitHub 代码库](https://github.com/Kotlin/kotlin-jupyter).

## 库

Kotlin 社区开发了针对数据处理任务的各种库, 并在迅速扩大.
下面这些库可能会对你很有用:

### Kotlin 库

* [Kotlin DataFrame](https://github.com/Kotlin/dataframe) 是一个结构化数据处理的库.
  它既利用 Kotlin 语言的所有威力, 又利用 Jupyter notebook 和 REPL 中的间断性代码执行能力,
  以图调和 Kotlin 的静态类型和数据的动态性质之间的冲突.

* [Kandy](https://kotlin.github.io/kandy/welcome.html) 是一个使用 Kotlin 开发的开源的 JVM 绘图库.
  它提供了用于创建 Chart 的强大而且灵活的 DSL,
  以及与 [Kotlin Notebook](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook) 
  和 [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html) 的无缝集成.

* [Multik](https://github.com/Kotlin/multik): Kotlin 编写的多维数组库.
  这个库提供符合 Kotlin 语言习惯的, 类型安全并且维度安全的 API, 可对多维数组进行数学操作.
  Multik 提供了基于 JVM 和基于原生代码的计算引擎, 可相互替换,
  以及两种引擎的组合, 用于性能优化.

* [KotlinDL](https://github.com/jetbrains/kotlindl) 是一个高级的深度学习 API, 用 Kotlin 编写, 受 Keras 启发.
  它提供了简单的 API, 可用于从头开始训练深度学习模型, 导入既有的 Keras 模型用于推断,
  以及利用迁移学习(transfer learning)调节既有的预先训练的模型, 供你的任务使用.

* [Kotlin for Apache Spark](https://github.com/JetBrains/kotlin-spark-api) 补足了 Kotlin 和 Apache Spark 之间缺少的兼容层.
  它可以让 Kotlin 开发者使用熟悉的语言功能特性, 比如数据类, 以及在大括号或方法引用中将 Lambda 表达式用作简单表达式.

* [kmath](https://github.com/mipt-npm/kmath) 是一个实验性的库, 最初受 [NumPy](https://numpy.org/) 的启发, 但它演化为更加灵活的抽象层次.
  它实现了 Kotlin 类型的代数结构组合的数学操作,
  为线性结构(linear structure), 表达式, 直方图(histogram), 流运算(streaming operation) 定义了 API,
  对既有的 Java 和 Kotlin 库提供了可互换的包装, 包括
  [ND4J](https://github.com/eclipse/deeplearning4j/tree/master/nd4j), 
  [Commons Math](https://commons.apache.org/proper/commons-math/),
  [Multik](https://github.com/Kotlin/multik), 以及其它库.

* [lets-plot](https://github.com/JetBrains/lets-plot) 是一个 Kotlin 编写的的库, 用于统计数据绘图.
  Lets-Plot 是一个跨平台库, 不仅可用于 JVM 平台, 而且可用于 JS 和 Python 平台.

* [kravis](https://github.com/holgerbrandl/kravis) 是受 R 语言的 [ggplot](https://ggplot2.tidyverse.org/) 启发产生的库,
  用于表格数据(tabular data)的可视化.

* [londogard-nlp-toolkit](https://github.com/londogard/londogard-nlp-toolkit/) 是一个工具库,
  用于自然语言处理(Natural Language Processing), 比如 字(word)/子字(subword)/语句(sentence) 嵌入(embedding), 字频统计(word-frequency), 终止字(stopword), 词干(stemming), 等等.


### Java 库

由于 Kotlin 对与 Java 的交互功能提供了一级支持, 因此你也可以在你的 Kotlin 代码中使用 Java 库来进行数据处理.
以下是这些 Java 库的一些例子:

* [DeepLearning4J](https://deeplearning4j.konduit.ai) - 针对 Java 的深度学习(deep learning)库

* [ND4J](https://github.com/eclipse/deeplearning4j/tree/master/nd4j) - 用于 JVM 平台的高效率矩阵数学库

* [Dex](https://github.com/PatMartin/Dex) - 基于 Java 的数据可视化工具

* [Smile](https://github.com/haifengl/smile) - 一个非常全面的系统,
  包括机器学习, 自然语言处理, 线性代数, 图, 插值, 可视化.
  除 Java API 外, Smile 还提供非常便利的 [Kotlin API](https://haifengl.github.io/api/kotlin/index.html),
  以及 Scala 和 Clojure API.
   * [Smile-NLP-kt](https://github.com/londogard/smile-nlp-kt) - 针对 Smile 的自然语言处理部分的 Scala 实现, 提供 Kotlin 重写的扩展函数和接口.

* [Apache Commons Math](https://commons.apache.org/proper/commons-math/) - 一个通用的 Java 库, 包括数学, 统计, 以及机器学习

* [NM Dev](https://nm.dev/) - Java 数学库, 包含了所有的经典数学运算.

* [OptaPlanner](https://www.optaplanner.org/) - 针对最优规划问题(optimization planning problem)的工具库

* [Charts](https://github.com/HanSolo/charts) - 用于科学计算的 JavaFX 图表库, 正在开发中

* [Apache OpenNLP](https://opennlp.apache.org/) - 一个基于机器学习的工具库 , 用于自然语言处理

* [CoreNLP](https://stanfordnlp.github.io/CoreNLP/) - 一个自然语言处理工具库

* [Apache Mahout](https://mahout.apache.org/) - 一个用于回归(regression), 聚类(clustering), 以及推荐(recommendation)的分布式框架

* [Weka](https://www.cs.waikato.ac.nz/ml/index.html) - 用于数据挖掘任务的一组机器学习算法

* [Tablesaw](https://github.com/jtablesaw/tablesaw) - 一个 Java 数据框架. 包含基于 Plot.ly 的可视化库.
