---
type: doc
layout: reference
category: FAQ
title: "与 Scala 比较"
---

# 与 Scala 比较

Kotlin 的主要目标是创建一种实用的、高生产性的编程语言, 而不是验证编程语言理论研究的新结果.
从这一点考虑, 如果你喜欢 Scala, 那么你很可能就不需要 Kotlin.

## Scala 中有, 而 Kotlin 中没有的东西

* 隐式转换, 参数, 等等
    * 在 Scala 中, 有时不使用调试器简直很难搞清楚你的代码中究竟发生了什么, 因为在程序中出现了太多的隐含处理
    * 要对你的类型添加新的功能, 在 Kotlin 中请使用 [扩展函数](extensions.html).
* 可覆盖的类型成员(Overridable type member)
* 路径依赖类型(Path-dependent type)
* 宏
* 存在类型(Existential type)
    * [类型投射(Type projection)](generics.html#type-projections) 是一种很特殊的情况
* 特征(trait)初始化中的复杂逻辑
    * 参见 [类与继承](classes.html)
* 自定义的符号化操作(symbolic operation)
    * 参见 [操作符重载](operator-overloading.html)
* 结构化类型(Structural type)
* 值类型(Value type)
    * 当 [Valhalla 项目](http://openjdk.java.net/projects/valhalla/) 作为 JDK 的一部分发布时, 我们计划支持这个项目
* Yield 操作符
* Actor
    * Kotlin 支持 [Quasar](http://www.paralleluniverse.co/quasar/), 一个第三方框架, 可以在 JVM 上支持 actor
* 平行集合(Parallel collection)
    * Kotlin 支持 Java 8 的 stream, 它可以提供类似的功能

## Kotlin 中有, 而 Scala 中没有的东西

* [无任何额外耗费的 Null 值安全性](null-safety.html)
    * Scala 中有 Option, 它是一种语法上的和运行时的封装
* [类型智能转换](typecasts.html)
* [Kotli 的内联函数可以帮助实现非局部的跳转(Nonlocal jump)](inline-functions.html#inline-functions)
* [委托(First-class delegation)](delegation.html). 可以使用第三方 plugin 实现: Autoproxy
