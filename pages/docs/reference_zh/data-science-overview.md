---
type: doc
layout: reference
category: "概述"
title: "在数据科学(Data Science)中使用 Kotlin"
---

# 在数据科学(Data Science)中使用 Kotlin

无论是创建数据管道(data pipeline), 还是构建真实生产环境的机器学习模型(machine learning model), Kotlin 都可以是很好的数据处理工具:
* Kotlin 代码简洁, 易读, 而且易于学习.
* 静态类型系统, 以及 null 值安全性, 有助于创建可靠, 易于维护的代码, 而且易于追中错误. 
* Kotlin 是基于 JVM 平台的编程语言, 因此提供了非常好的运行性能, 并且可以灵活运用整个 Java 生态环境, 包括所有那些经过长期广泛使用的 Java 库.

## 交互式编辑器

Notebook, 比如 [Jupyter Notebook](https://jupyter.org/) 和 [Apache Zeppelin](https://zeppelin.apache.org/), 提供了许多便利的工具, 用来可视化数据, 以及探索研究.
Kotlin 与这些工具集成, 可以帮助你研究数据, 将你的发现与同事共享, 逐渐提升你的数据科学和机器学习技能.

### Jupyter 的 Kotlin kernel

Jupyter Notebook 是一个开源的 Web 应用程序, 你可以用来创建和分享文档(也称为 "notebook"), 其中包含代码, 可视化的数据, 以及 Markdown 格式的文本. 
[Kotlin-jupyter](https://github.com/Kotlin/kotlin-jupyter) 是一个开源项目, 可以在 Jupyter Notebook 中添加对 Kotlin 的支持. 

![Kotlin in Jupyter notebook]({{ url_for('asset', path='images/landing/data-science/kotlin-jupyter-kernel.png')}})

关于 Kotlin kernel 的安装指南, 文档, 以及示例, 请查看它的 [GitHub 代码库](https://github.com/Kotlin/kotlin-jupyter).

### Zeppelin 的 Kotlin 解释器

Apache Zeppelin 是一个针对交互式的数据分析的, 非常流行的 Web 解决方案. 它对 Apache Spark 集群计算系统提供了很强的支持, 这个系统对数据工程尤其有用. 
从 [0.9.0 版](https://zeppelin.apache.org/docs/0.9.0-preview1/) 开始, Apache Zeppelin 默认带有 Kotlin 解释器. 

![Kotlin in Zeppelin notebook]({{ url_for('asset', path='images/landing/data-science/kotlin-zeppelin-interpreter.png')}})

## 库

Kotlin 社区开发了针对数据处理任务的各种库, 并在迅速扩大.
下面这些库可能会对你很有用:

### Kotlin 库
* [kotlin-statistics](https://github.com/thomasnield/kotlin-statistics), 对探索性的统计, 或真实生产环境的统计, 提供扩展函数.
它支持基本数值的 list/sequence/array 的各种函数 (从 `sum` 到 `skewness`),
切片操作符(slicing operator) (比如 `countBy`, `simpleRegressionBy`), 分仓操作(binning operation), 离散 PDF 采样,
朴素贝叶斯分类器(naive bayes classifier), 聚类分析(clustering), 线性回归(linear regression), 等等.

* [kmath](https://github.com/mipt-npm/kmath) 是一个受 [NumPy](https://numpy.org/) 启发产生的库.
这个库支持 代数结构及其操作, 类数组(array-like)结构, 数学表达式, 直方图(histogram), 
流运算(streaming operation), [commons-math](http://commons.apache.org/proper/commons-math/) 和 [koma](https://github.com/kyonifer/koma) 的包装, 等等.

* [krangl](https://github.com/holgerbrandl/krangl) 是一个受 R 语言的 [dplyr](https://dplyr.tidyverse.org/) 以及 Python 的 [pandas](https://pandas.pydata.org/) 启发产生的库.
这个库通过函数式风格 API 提供数据操作功能; 它还包括各种函数, 用于数据过滤, 变换, 聚合(aggregate), 以及重塑表格数据(reshape tabular data).

* [lets-plot](https://github.com/JetBrains/lets-plot) 是一个 Kotlin 编写的的库, 用于统计数据绘图.
Lets-Plot 是一个跨平台库, 不仅可用于 JVM 平台, 而且可用于 JS 和 Python 平台. 

* [kravis](https://github.com/holgerbrandl/kravis) 是受 Python 的 [ggplot](https://ggplot2.tidyverse.org/) 启发产生的库,
用于表格数据(tabular data)的可视化.

### Java 库

由于 Kotlin 对与 Java 的交互功能提供了一级支持, 因此你也可以在你的 Kotlin 代码中使用 Java 库来进行数据处理.
以下是这些 Java 库的一些例子:

* [DeepLearning4J](https://deeplearning4j.org/) - 针对 Java 的深度学习(deep learning)库

* [ND4J](http://nd4j.org/) - 用于 JVM 平台的高效率矩阵数学库 

* [Dex](https://github.com/PatMartin/Dex) - 基于 Java 的数据可视化工具

* [Smile](https://github.com/haifengl/smile) - 一个非常全面的系统, 包括机器学习, 自然语言处理, 线性代数, 图, 插值, 可视化.
除 Java API 外, Smile 还提供非常便利的 [Kotlin API](http://haifengl.github.io/api/kotlin/smile-kotlin/index.html), 以及 Scala 和 Clojure API.
   * [Smile-NLP-kt](https://github.com/londogard/smile-nlp-kt) - 针对 Smile 的自然语言处理部分的 Scala 实现, 提供 Kotlin 重写的扩展函数和接口.

* [Apache Commons Math](http://commons.apache.org/proper/commons-math/) - 一个通用的 Java 库, 包括数学, 统计, 以及机器学习

* [OptaPlanner](https://www.optaplanner.org/) - 针对最优规划问题(optimization planning problem)的工具库

* [Charts](https://github.com/HanSolo/charts) - 用于科学计算的 JavaFX 图表库, 正在开发中

* [CoreNLP](https://stanfordnlp.github.io/CoreNLP/) - 一个自然语言处理工具库

* [Apache Mahout](https://mahout.apache.org/) - 一个用于回归(regression), 聚类(clustering) 和推荐(recommendation)的分布式框架

* [Weka](https://www.cs.waikato.ac.nz/ml/index.html) - 用于数据挖掘任务的一组机器学习算法

如果这些库还不能满足你的需求, 建议你可以看看 Thomas Nield 整理的 [**数据科学相关的 Kotlin 资源**](https://github.com/thomasnield/kotlin-data-science-resources).
