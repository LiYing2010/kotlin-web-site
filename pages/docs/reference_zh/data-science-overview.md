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
[Jupyter Notebook](https://jupyter.org/),
[Datalore](http://jetbrains.com/datalore),
以及 [Apache Zeppelin](https://zeppelin.apache.org/),
提供了许多便利的工具, 用来可视化数据, 以及探索研究.
Kotlin 与这些工具集成, 可以帮助你研究数据, 将你的发现与同事共享, 逐渐提升你的数据科学和机器学习技能.

### Jupyter 的 Kotlin kernel

Jupyter Notebook 是一个开源的 Web 应用程序, 你可以用来创建和分享文档(也称为 "notebook"), 其中包含代码, 可视化的数据, 以及 Markdown 格式的文本.
[Kotlin-jupyter](https://github.com/Kotlin/kotlin-jupyter) 是一个开源项目, 可以在 Jupyter Notebook 中添加对 Kotlin 的支持.

<img src="/assets/docs/images/data-science/kotlin-jupyter-kernel.png" alt="Kotlin in Jupyter notebook" width="800"/>

关于 Kotlin kernel 的安装指南, 文档, 以及示例, 请查看它的 [GitHub 代码库](https://github.com/Kotlin/kotlin-jupyter).

### Datalore 的 Kotlin Notebooks 

通过 Datalore, 你可以直接 在浏览器中使用 Kotlin, 不需要额外安装.
你还可以通过 Kotlin notebooks 实时的协作, 编写代码时得到智能的代码辅助, 以及通过交互式报告或静态报告共享结果.
请参见 [示例报告](https://datalore.jetbrains.com/view/report/9YLrg20eesVX2cQu1FKLiZ).

<img src="/assets/docs/images/data-science/kotlin-datalore.png" alt="Kotlin in Datalore" width="800"/>

[注册免费的 Datalore 社区帐号来使用 Kotlin](https://datalore.jetbrains.com/).

### Zeppelin 的 Kotlin 解释器

Apache Zeppelin 是一个针对交互式的数据分析的, 非常流行的 Web 解决方案. 它对 Apache Spark 集群计算系统提供了很强的支持, 这个系统对数据工程尤其有用.
从 [0.9.0 版](https://zeppelin.apache.org/docs/0.9.0-preview1/) 开始, Apache Zeppelin 默认带有 Kotlin 解释器.

<img src="/assets/docs/images/data-science/kotlin-zeppelin-interpreter.png" alt="Kotlin in Zeppelin notebook" width="800"/>

## 库

Kotlin 社区开发了针对数据处理任务的各种库, 并在迅速扩大.
下面这些库可能会对你很有用:

### Kotlin 库

* [Multik](https://github.com/Kotlin/multik): Kotlin 编写的多维数组库.
  这个库提供符合 Kotlin 语言习惯的, 类型安全并且维度安全的 API, 可对多维数组进行数学操作.
  Multik 提供了基于 JVM 和基于原生代码的计算引擎, 可相互替换,
  以及两种引擎的组合, 用于性能优化.

* [KotlinDL](https://github.com/jetbrains/kotlindl) 是一个高级的深度学习 API, 用 Kotlin 编写, 受 Keras 启发.
  它提供了简单的 API, 可用于从头开始训练深度学习模型, 导入既有的 Keras 模型用于推断,
  以及利用迁移学习(transfer learning)调节既有的预先训练的模型, 供你的任务使用.

* [Kotlin DataFrame](https://github.com/Kotlin/dataframe) 是一个结构化数据处理的库.
  它既利用 Kotlin 语言的所有威力, 又利用 Jupyter notebook 和 REPL 中的间断性代码执行能力,
  以图调和 Kotlin 的静态类型和数据的动态性质之间的冲突.

* [Kotlin for Apache Spark](https://github.com/JetBrains/kotlin-spark-api) 补足了 Kotlin 和 Apache Spark 之间缺少的兼容层.
  它可以让 Kotlin 开发者使用熟悉的语言功能特性, 比如数据类, 以及在大括号或方法引用中将 Lambda 表达式用作简单表达式.

* [kotlin-statistics](https://github.com/thomasnield/kotlin-statistics), 对探索性的统计, 或真实生产环境的统计, 提供扩展函数.
  它支持基本数值的 list/sequence/array 的各种函数 (从 `sum` 到 `skewness`),
  切片操作符(slicing operator) (比如 `countBy`, `simpleRegressionBy`), 分仓操作(binning operation), 离散 PDF 采样,
  朴素贝叶斯分类器(naive bayes classifier), 聚类分析(clustering), 线性回归(linear regression), 等等.

* [kmath](https://github.com/mipt-npm/kmath) 是一个实验性的库, 最初受 [NumPy](https://numpy.org/) 的启发, 但它演化为更加灵活的抽象层次.
  它实现了 Kotlin 类型的代数结构组合的数学操作,
  为线性结构(linear structure), 表达式, 直方图(histogram), 流运算(streaming operation) 定义了 API,
  对既有的 Java 和 Kotlin 库提供了可互换的包装, 包括
  [ND4J](https://github.com/eclipse/deeplearning4j/tree/master/nd4j), 
  [Commons Math](https://commons.apache.org/proper/commons-math/),
  [Multik](https://github.com/Kotlin/multik), 以及其它库.

* [krangl](https://github.com/holgerbrandl/krangl) 是一个受 R 语言的 [dplyr](https://dplyr.tidyverse.org/)
  以及 Python 的 [pandas](https://pandas.pydata.org/) 启发产生的库.
  这个库通过函数式风格 API 提供数据操作功能; 它还包括各种函数, 用于数据过滤, 变换, 聚合(aggregate), 以及重塑表格数据(reshape tabular data).

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
  除 Java API 外, Smile 还提供非常便利的 [Kotlin API](https://haifengl.github.io/api/kotlin/smile-kotlin/index.html),
  以及 Scala 和 Clojure API.
   * [Smile-NLP-kt](https://github.com/londogard/smile-nlp-kt) - 针对 Smile 的自然语言处理部分的 Scala 实现, 提供 Kotlin 重写的扩展函数和接口.

* [Apache Commons Math](https://commons.apache.org/proper/commons-math/) - 一个通用的 Java 库, 包括数学, 统计, 以及机器学习

* [NM Dev](https://nm.dev/) - Java 数学库, 包含了所有的经典数学运算.

* [OptaPlanner](https://www.optaplanner.org/) - 针对最优规划问题(optimization planning problem)的工具库

* [Charts](https://github.com/HanSolo/charts) - 用于科学计算的 JavaFX 图表库, 正在开发中

* [Apache OpenNLP](https://opennlp.apache.org/) - 一个基于机器学习的工具库 , 用于自然语言处理

* [CoreNLP](https://stanfordnlp.github.io/CoreNLP/) - 一个自然语言处理工具库

* [Apache Mahout](https://mahout.apache.org/) - 一个用于回归(regression), 聚类(clustering) 和推荐(recommendation)的分布式框架

* [Weka](https://www.cs.waikato.ac.nz/ml/index.html) - 用于数据挖掘任务的一组机器学习算法

* [Tablesaw](https://github.com/jtablesaw/tablesaw) - 一个 Java 数据框架. 包含基于 Plot.ly 的可视化库.

如果这些库还不能满足你的需求, 建议你可以看看 Thomas Nield 整理的
**[Kotlin 机器学习(Machine Learning) 演示](https://github.com/thomasnield/kotlin-machine-learning-demos)** GitHub 代码库.
