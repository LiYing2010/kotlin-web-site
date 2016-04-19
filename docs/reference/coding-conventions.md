---
type: doc
layout: reference
category: Basics
title: 编码规约
---

# 编码规约

本章介绍 Kotlin 语言目前的编码风格.

## 命名风格
如果对某种规约存在疑问, 请默认使用 Java 编码规约, 比如:

* 在名称中使用驼峰式大小写(并且不要在名称中使用下划线)
* 类型首字母大写
* 方法和属性名称首字母小写
* 语句缩进使用 4 个空格
* public 函数应该编写文档, 这些文档将出现在 Kotlin Doc 中

## 冒号

当冒号用来分隔类型和父类型时, 冒号之前要有空格, 当冒号用来分隔类型和实例时, 冒号之前不加空格:

``` kotlin
interface Foo<out T : Any> : Bar {
    fun foo(a: Int): T
}
```

## Lambda 表达式

在 Lambda 表达式中, 大括号前后应该加空格, 分隔参数与函数体的箭头符号前后也应该加空格. 如果有可能, 将 Lambda 表达式作为参数传递时, 应该尽量放在圆括号之外.

``` kotlin
list.filter { it > 10 }.map { element -> element * 2 }
```

在简短, 并且无嵌套的 Lambda 表达式中, 推荐使用惯用约定的 `it` 作为参数名, 而不要明确地声明参数. 在有参数, 并且嵌套的 Lambda 表达式中, 应该明确地声明参数.

## Unit

如果函数的返回值为 Unit 类型, 那么返回值的类型声明应当省略:

``` kotlin
fun foo() { // 此处省略了 ": Unit" 

}
```
