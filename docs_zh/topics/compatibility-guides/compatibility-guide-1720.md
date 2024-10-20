[//]: # (title: Kotlin 1.7.20 兼容性指南)

_[保证语言的现代化](kotlin-evolution.md)_ and _[语言版本升级平滑便利](kotlin-evolution.md)_
是 Kotlin 语言设计时的基本原则之一.
第一条原则认为, 阻碍语言演进的那些元素应该删除,
后一条原则则认为, 这些删除必须事先与使用者良好沟通, 以便让源代码的迁移尽量平滑.

不兼容的变更通常只出现在功能发布版中, 但这一次, 我们不得不在一个增量发布版中引入了 2 个这样的变更,
以便尽早解决由 Kotlin 1.7 的变更造成的一些问题.

本文档概述这些问题, 提供关于 Kotlin 1.7.0 和 1.7.10 向 Kotlin 1.7.20 迁移的参考.

## 基本术语

在本文档中, 我们介绍几种类型的兼容性:

- _源代码级兼容性_: 源代码级别的不兼容会导致过去能够正确编译(没有错误和警告)的代码变得不再能够编译
- _二进制级兼容性_: 如果交换两个二进制库文件, 不会导致程序的装载错误, 或链接错误, 那么我们称这两个文件为二进制兼容
- _行为级兼容性_: 如果在某个变更发生之前和之后, 程序表现出不同的行为, 那么这个变更称为行为不兼容

请记住, 这些兼容性定义只针对纯 Kotlin 程序.
从其他语言(比如, Java)的观点来看 Kotlin 代码的兼容性如何, 本文档不予讨论.

## 语言

<!--
### Title

> **Issue**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**:
>
> **Deprecation cycle**:
>
> - 1.5.20: warning
> - 1.7.0: report an error
-->

### 回滚了对约束处理的修正

> **Issue**: [KT-53813](https://youtrack.jetbrains.com/issue/KT-53813)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 过去曾经尝试修正 1.7.0 版在类型推断约束处理中出现的问题,
> 本次发布实现了 [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668) 描述的变更, 回滚了这个修正.
> 在 1.7.10 中进行了这个修正, 但导致了新的问题.
>
> **废弃周期**:
>
> - 1.7.20: 回滚到 1.7.0 版的行为


### 禁止某些构建器推断情况, 以避免与多个 Lambda 表达式和解析之间的有问题的互动

> **Issue**: [KT-53797](https://youtrack.jetbrains.com/issue/KT-53797)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: Kotlin 1.7 引入了一个功能特性, 称为无限制的构建器推断,
> 使得即使传递给参数的 Lambda 表达式没有标注 `@BuilderInference` 注解, 也可以利用构建器推断功能.
> 但是, 如果在函数调用中出现多个这样的 Lambda 表达式, 可能导致几种问题.
>
> 如果多个 Lambda 函数对应的参数没有标注 `@BuilderInference` 注解,
> 而且在 Lambda 表达式内要求使用构建器推断来完成类型推断, Kotlin 1.7.20 会对这样的情况报告编译错误.
>
> **废弃周期**:
>
> - 1.7.20: 对这样的Lambda 函数报告编译错误,
> 可以使用 `-XXLanguage:+NoBuilderInferenceWithoutAnnotationRestriction` 来临时退回到 1.7.20 以前的行为.
