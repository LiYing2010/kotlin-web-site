---
type: doc
layout: reference
category: "Lincheck"
title: "Lincheck 指南"
---

# Lincheck 指南

最终更新: {{ site.data.releases.latestDocDate }}

Lincheck 是一个实用的而且用户友好的框架, 用于在 JVM 平台上测试并发算法.
它提供了一个简单的, 声明式的方式, 来编写并发测试.

使用 Lincheck 框架, 不需要描述如何执行测试, 你可以通过声明所有需要验证的操作, 以及要求的正确性属性, 来指定 _测试什么_.
这样做的结果是, 一个通常的并发 Lincheck 测试只包含大约 15 行代码.

给定一个操作列表, Lincheck 会自动完成以下工作:

* 生成一组随机并发场景.
* 使用压力测试, 或绑定模型检查, 来验证这些场景.
* 验证每个调用的结果满足要求的正确性属性(默认设置是线性一致).

## 将 Lincheck 添加到你的项目

要使用 Lincheck, 需要在 Gradle 配置中包含对应的仓库和依赖项.
请在你的 `build.gradle(.kts)` 文件中, 添加以下代码:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
repositories {
    mavenCentral()
}

dependencies {
    testImplementation("org.jetbrains.kotlinx:lincheck:%lincheckVersion%")
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
repositories {
    mavenCentral()
}

dependencies {
    testImplementation "org.jetbrains.kotlinx:lincheck:%lincheckVersion%"
}
```

</div>
</div>

## 探索 Lincheck 的功能

本向导将会帮助你熟悉 Lincheck 框架, 并通过示例程序学习使用最有用的功能特性.
请按照以下步骤学习 Lincheck 的功能特性:

1. [使用 Lincheck 编写你的第一个测试](introduction.html)
2. [选择你的测试策略](testing-strategies.html)
3. [配置操作参数](operation-arguments.html)
4. [在模型检查中使用模块化测试](modular-testing.html) 
5. [考虑常见的算法约束](constraints.html)
6. [检查算法的非阻塞进度保证(non-blocking progress guarantee)](progress-guarantees.html)
7. [定义算法的顺序规格(sequential specification)](sequential-specification.html)

## 其他参考资料

* Workshop. Lincheck: JVM 平台的并发程序测试: [第 1 部分](https://www.youtube.com/watch?v=YNtUK9GK4pA),
  Hydra 2021, EN
* Workshop. Lincheck: JVM 平台的并发程序测试: [第 2 部分](https://www.youtube.com/watch?v=EW7mkAOErWw),
  Hydra 2021, EN
* [Lincheck. 在 Java 中测试并发数据结构](https://www.youtube.com/watch?v=YAb7YoEd6mM), Heisenbug 2019,
  RU
* [使用 Lincheck 测试并发算法](https://www.youtube.com/watch?v=9cB36asOjPo), Joker 2019, RU
* [Lincheck: 在 Java 中测试并发数据结构](https://www.youtube.com/watch?v=hwbpUEGHvvY), Hydra 2019, RU
* [无锁的算法测试](https://www.youtube.com/watch?v=_0_HOnTSS0E), Joker 2017, RU
