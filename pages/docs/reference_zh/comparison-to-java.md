---
type: doc
layout: reference
category: FAQ
title: "与 Java 比较"
---

# 与 Java 语言的比较

## Kotlin 中得到解决的一些 Java 问题

Java 中长期困扰的一系列问题, 在 Kotlin 得到了解决:

* Null 引用 [由类型系统管理](null-safety.html).
* [没有原生类型(raw type)](java-interop.html)
* Kotlin 中的数组是 [类型不可变的](basic-types.html#arrays)
* 与 Java 中的 SAM 变换方案相反, Kotlin 中存在专门的 [函数类型(function type)](lambdas.html#function-types)
* 不使用通配符的 [使用处类型变异(Use-site variance)](generics.html#use-site-variance-type-projections)
* Kotlin 中不存在受控 [异常](exceptions.html)

## Java 中有, 而 Kotlin 中没有的东西

* [受控异常](exceptions.html)
* 不是类的 [基本数据类型](basic-types.html)
* [静态成员](classes.html)
* [非私有的域(Non-private field)](properties.html)
* [通配符类型(Wildcard-type)](generics.html)
* [条件(三元)运算符 `a ? b : c`](control-flow.html#if-expression)

## Kotlin 中有, 而 Java 中没有的东西

* [Lambda 表达式](lambdas.html) + [内联函数](inline-functions.html) = 实现自定义的控制结构
* [扩展函数](extensions.html)
* [Null 值安全性](null-safety.html)
* [类型智能转换](typecasts.html)
* [字符串模板](basic-types.html#strings)
* [属性](properties.html)
* [主构造器](classes.html)
* [委托(First-class delegation)](delegation.html)
* [变量和属性的类型推断](basic-types.html)
* [单例(Singleton)](object-declarations.html)
* [声明处类型变异(Declaration-site variance) 和类型投射(Type projection)](generics.html)
* [值范围表达式](ranges.html)
* [操作符重载](operator-overloading.html)
* [同伴对象(Companion object)](classes.html#companion-objects)
* [数据类](data-classes.html)
* [集合的接口定义区分为只读集合与可变集合](collections-overview.html)
* [协程](coroutines.html)
