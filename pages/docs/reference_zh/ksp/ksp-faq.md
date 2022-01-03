---
type: doc
layout: reference
category:
title: "FAQ"
---

# FAQ

本页面最终更新: 2022/04/14

### 为什么需要使用 KSP?

KSP 相比 [kapt](kapt.html) 具有很多优点:
* 更快.
* 对于 Kotlin 使用者来说 API 更加流畅.
* 对生成的 Kotlin 源代码支持 [多轮(Multiple Round)处理](ksp-multi-round.html).
* 设计时考虑了跨平台兼容性.

### 为什么 KSP 比 kapt 更快?

kapt 必须分析并解析所有的类型引用, 才能生成 Java 桩代码(stub), 而 KSP 只在需要的时候才解析类型引用.
将一些处理代理到 javac 也需要消耗时间.

此外, 与仅仅隔离和聚集相比, KSP 的 [增量处理(Incremental Processing)模型](ksp-incremental.html) 拥有更细的粒度.
可以有更多的机会避免重新处理所有信息. 而且, 由于 KSP 动态追踪符号的解析, 一个源代码文件的变更不太容易影响到其他文件, 因此需要处理的源代码文件比较少.
这是 kapt 无法做到的, 因为它将处理代理给 javac.

### KSP 是 Kotlin 专有的吗?

KSP 也能处理 Java 源代码. API 是统一的, 也就是说, 当你解析 Java 类和 Kotlin 类时, 在 KSP 中会得到统一的数据结构.
