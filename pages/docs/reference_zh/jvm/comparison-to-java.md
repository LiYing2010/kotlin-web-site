---
type: doc
layout: reference
category: FAQ
title: "与 Java 比较"
---

# 与 Java 比较

本页面最终更新: 2021/06/23

## Kotlin 中得到解决的一些 Java 问题

Java 中长期困扰的一系列问题, 在 Kotlin 得到了解决:

* Null 引用 [由类型系统管理](/docs/reference_zh/null-safety.html).
* [没有原生类型(raw type)](java-interop.html#java-generics-in-kotlin)
* Kotlin 中的数组是 [类型不可变的](/docs/reference_zh/basic-types.html#arrays)
* 与 Java 中的 SAM 变换方案相反, Kotlin 中存在专门的 [函数类型(function type)](/docs/reference_zh/lambdas.html#function-types)
* 不使用通配符的 [使用处类型变异(Use-site variance)](/docs/reference_zh/generics.html#use-site-variance-type-projections)
* Kotlin 中不存在受控 [异常](/docs/reference_zh/exceptions.html)

## Java 中有, 而 Kotlin 中没有的功能

* [受控异常](/docs/reference_zh/exceptions.html)
* 不是类的 [基本数据类型](/docs/reference_zh/basic-types.html).
  Kotlin 编译产生的字节码会尽可能使用基本数据类型, 但在 Kotlin 源代码中并不能明确的使用基本数据类型.
* [静态成员](/docs/reference_zh/classes.html)
  在 Kotlin 中由以下功能代替:
  [同伴对象(Companion Object)](/docs/reference_zh/object-declarations.html#companion-objects),
  [顶级(top-level) 函数](/docs/reference_zh/functions.html),
  [扩展(extension) 函数](/docs/reference_zh/extensions.html#extension-functions),
  以及 [@JvmStatic 注解](java-to-kotlin-interop.html#static-methods).
* [通配符类型(Wildcard-type)](/docs/reference_zh/generics.html)
  在 Kotlin 中由以下功能代替:
  [声明处类型变异(declaration-site variance)](/docs/reference_zh/generics.html#declaration-site-variance)
  以及 [类型投射(type projection)](/docs/reference_zh/generics.html#type-projections).
* [条件(三元)运算符 `a ? b : c`](/docs/reference_zh/control-flow.html#if-expression)
  在 Kotlin 中由以下功能代替: [if 表达式](/docs/reference_zh/control-flow.html#if-expression).


## Kotlin 中有, 而 Java 中没有的功能

* [Lambda 表达式](/docs/reference_zh/lambdas.html) + [内联函数](/docs/reference_zh/inline-functions.html) = 实现自定义的控制结构
* [扩展函数](/docs/reference_zh/extensions.html)
* [Null 值安全性](/docs/reference_zh/null-safety.html)
* [类型智能转换](/docs/reference_zh/typecasts.html)
* [字符串模板](/docs/reference_zh/basic-types.html#strings)
* [属性](/docs/reference_zh/properties.html)
* [主构造器](/docs/reference_zh/classes.html)
* [委托(First-class delegation)](/docs/reference_zh/delegation.html)
* [变量和属性的类型推断](/docs/reference_zh/basic-types.html)
* [单例(Singleton)](/docs/reference_zh/object-declarations.html)
* [声明处类型变异(Declaration-site variance) 和类型投射(Type projection)](/docs/reference_zh/generics.html)
* [值范围表达式](/docs/reference_zh/ranges.html)
* [操作符重载](/docs/reference_zh/operator-overloading.html)
* [同伴对象(Companion object)](/docs/reference_zh/classes.html#companion-objects)
* [数据类](/docs/reference_zh/data-classes.html)
* [集合的接口定义区分为只读集合与可变集合](/docs/reference_zh/collections-overview.html)
* [协程](/docs/reference_zh/coroutines-overview.html)


## 下一步做什么

学习如何处理 [在 Java 和 Kotlin 使用字符串的常见情况](java-to-kotlin-idioms-strings.html).
