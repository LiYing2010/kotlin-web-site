---
type: doc
layout: reference
category: FAQ
title: "与 Java 比较"
---

# 与 Java 比较

最终更新: {{ site.data.releases.latestDocDate }}

## Kotlin 中得到解决的一些 Java 问题

Java 中长期困扰的一系列问题, 在 Kotlin 得到了解决:

* Null 引用 [由类型系统管理](../null-safety.html).
* [没有原生类型(raw type)](java-interop.html#java-generics-in-kotlin)
* Kotlin 中的数组是 [类型不可变的](../arrays.html#)
* 与 Java 中的 SAM 变换方案相反, Kotlin 中存在专门的 [函数类型(function type)](../lambdas.html#function-types)
* 不使用通配符的 [使用处类型变异(Use-site variance)](../generics.html#use-site-variance-type-projections)
* Kotlin 中不存在受控 [异常](../exceptions.html)

## Java 中有, 而 Kotlin 中没有的功能

* [受控异常](../exceptions.html)
* 不是类的 [基本数据类型](../basic-types.html).
  Kotlin 编译产生的字节码会尽可能使用基本数据类型, 但在 Kotlin 源代码中并不能明确的使用基本数据类型.
* [静态成员](../classes.html)
  在 Kotlin 中由以下功能代替:
  [同伴对象(Companion Object)](../object-declarations.html#companion-objects),
  [顶级(top-level) 函数](../functions.html),
  [扩展(extension) 函数](../extensions.html#extension-functions),
  以及 [@JvmStatic 注解](java-to-kotlin-interop.html#static-methods).
* [通配符类型(Wildcard-type)](../generics.html)
  在 Kotlin 中由以下功能代替:
  [声明处类型变异(declaration-site variance)](../generics.html#declaration-site-variance)
  以及 [类型投射(type projection)](../generics.html#type-projections).
* [条件(三元)运算符 `a ? b : c`](../control-flow.html#if-expression)
  在 Kotlin 中由以下功能代替: [if 表达式](../control-flow.html#if-expression).


## Kotlin 中有, 而 Java 中没有的功能

* [Lambda 表达式](../lambdas.html) + [内联函数](../inline-functions.html) = 实现自定义的控制结构
* [扩展函数](../extensions.html)
* [Null 值安全性](../null-safety.html)
* [类型智能转换](../typecasts.html)
* [字符串模板](../strings.html)
* [属性](../properties.html)
* [主构造器](../classes.html)
* [委托(First-class delegation)](../delegation.html)
* [变量和属性的类型推断](../basic-types.html)
* [单例(Singleton)](../object-declarations.html)
* [声明处类型变异(Declaration-site variance) 和类型投射(Type projection)](../generics.html)
* [值范围表达式](../ranges.html)
* [操作符重载](../operator-overloading.html)
* [同伴对象(Companion object)](../classes.html#companion-objects)
* [数据类](../data-classes.html)
* [集合的接口定义区分为只读集合与可变集合](../collections-overview.html)
* [协程](../coroutines-overview.html)


## 下一步做什么?

学习:
* 如何执行 [Java 与 Kotlin 中常见的字符串处理任务](java-to-kotlin-idioms-strings.html).
* 如何执行 [Java 与 Kotlin 中常见的集合(Collection)处理任务](java-to-kotlin-collections-guide.html).
* 如何 [在 Java 与 Kotlin 中处理可空性(Nullability)](java-to-kotlin-nullability-guide.html).
