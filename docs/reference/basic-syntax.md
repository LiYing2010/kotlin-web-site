---
type: doc
layout: reference
category: "基础"
title: "基本语法"
---

# 基本语法

## 定义包

包的定义应该在源代码文件的最上方:

``` kotlin
package my.demo

import java.util.*

// ...
```

源代码所在的目录结构不必与包结构保持一致: 源代码文件可以放置在文件系统的任意位置.

参见 [包](packages.html).

## 定义函数

以下函数接受两个 `Int` 类型参数, 并返回 `Int` 类型结果:

``` kotlin
fun sum(a: Int, b: Int): Int {
  return a + b
}
```

以下函数使用表达式语句作为函数体, 返回类型由自动推断决定:

``` kotlin
fun sum(a: Int, b: Int) = a + b
```

以下函数不返回有意义的结果:

``` kotlin
fun printSum(a: Int, b: Int): Unit {
  print(a + b)
}
```

返回值为 `Unit` 类型时, 可以省略:

``` kotlin
fun printSum(a: Int, b: Int) {
  print(a + b)
}
```

参见 [函数](functions.html).

## 定义局部变量

一次性赋值 (只读) 的局部变量:

``` kotlin
val a: Int = 1
val b = 1   // 变量类型自动推断为 `Int` 类型
val c: Int  // 没有初始化语句时, 必须明确指定类型
c = 1       // 明确赋值
```

值可变的变量:

``` kotlin
var x = 5 // 变量类型自动推断为 `Int` 类型
x += 1
```

参见 [属性(Property)与域(Field)](properties.html).


## 注释

与 Java 和 JavaScript 一样, Kotlin 支持行末注释, 也支持块注释.

``` kotlin
// 这是一条行末注释

/* 这是一条块注释
   可以包含多行内容. */
```

与 Java 不同, Kotlin 中的块注释允许嵌套.

关于文档注释的语法, 详情请参见 [Kotlin 代码中的文档](kotlin-doc.html).

## 使用字符串模板

``` kotlin
fun main(args: Array<String>) {
  if (args.size == 0) return

  print("First argument: ${args[0]}")
}
```

参见 [字符串模板](basic-types.html#string-templates).

## 使用条件表达式

``` kotlin
fun max(a: Int, b: Int): Int {
  if (a > b)
    return a
  else
    return b
}
```

以表达式的形式使用 *if*{: .keyword }:

``` kotlin
fun max(a: Int, b: Int) = if (a > b) a else b
```

参见 [*if*{: .keyword } 表达式](control-flow.html#if-expression).

## 使用可为 null 的值, 以及检查 *null*{: .keyword }

当一个引用可能为 *null*{: .keyword } 值时, 对应的类型声明必须明确地标记为可为 null.

当 `str` 中的字符串内容不是一个整数时, 返回 *null*{: .keyword }:

``` kotlin
fun parseInt(str: String): Int? {
  // ...
}
```

以下示例演示如何使用一个返回值可为 null 的函数:

``` kotlin
fun main(args: Array<String>) {
  if (args.size < 2) {
    print("Two integers expected")
    return
  }

  val x = parseInt(args[0])
  val y = parseInt(args[1])

  // 直接使用 `x * y` 会导致错误, 因为它们可能为 null.
  if (x != null && y != null) {
    // 在进行过 null 值检查之后, x 和 y 的类型会被自动转换为非 null 变量
    print(x * y)
  }
}
```

或者

``` kotlin
  // ...
  if (x == null) {
    print("Wrong number format in '${args[0]}'")
    return
  }
  if (y == null) {
    print("Wrong number format in '${args[1]}'")
    return
  }

  // 在进行过 null 值检查之后, x 和 y 的类型会被自动转换为非 null 变量
  print(x * y)
```

参见 [Null 值安全](null-safety.html).

## 使用类型检查和自动类型转换

*is*{: .keyword } 运算符可以检查一个表达式的值是不是某个类型的实例.
如果对一个不可变的局部变量或属性进行过类型检查, 那么之后的代码就不必再对它进行显式地类型转换, 而可以直接将它当作需要的类型来使用:

``` kotlin
fun getStringLength(obj: Any): Int? {
  if (obj is String) {
    // 在这个分支中, `obj` 的类型会被自动转换为 `String`
    return obj.length
  }

  // 在类型检查所影响的分支之外, `obj` 的类型仍然是 `Any`
  return null
}
```

或者

``` kotlin
fun getStringLength(obj: Any): Int? {
  if (obj !is String)
    return null

  // 在这个分支中, `obj` 的类型会被自动转换为 `String`
  return obj.length
}
```

甚至还可以

``` kotlin
fun getStringLength(obj: Any): Int? {
  // 在 `&&` 运算符的右侧, `obj` 的类型会被自动转换为 `String`
  if (obj is String && obj.length > 0)
    return obj.length

  return null
}
```

参见 [类](classes.html) 和 [类型转换](typecasts.html).

## 使用 `for` 循环

``` kotlin
fun main(args: Array<String>) {
  for (arg in args)
    print(arg)
}
```

或者

``` kotlin
for (i in args.indices)
  print(args[i])
```

参见 [for 循环](control-flow.html#for-loops).

## 使用 `while` 循环

``` kotlin
fun main(args: Array<String>) {
  var i = 0
  while (i < args.size)
    print(args[i++])
}
```

参见 [while 循环](control-flow.html#while-loops).

## 使用 `when` 表达式

``` kotlin
fun cases(obj: Any) {
  when (obj) {
    1          -> print("One")
    "Hello"    -> print("Greeting")
    is Long    -> print("Long")
    !is String -> print("Not a string")
    else       -> print("Unknown")
  }
}
```

参见 [when expression](control-flow.html#when-expression).

## 使用范围值

使用 *in*{: .keyword } 运算符检查一个数值是否在某个范围之内:

``` kotlin
if (x in 1..y-1)
  print("OK")
```

检查一个数值是否在某个范围之外:

``` kotlin
if (x !in 0..array.lastIndex)
  print("Out")
```

在一个值范围内进行遍历迭代:

``` kotlin
for (x in 1..5)
  print(x)
```

参见 [范围](ranges.html).

## 使用集合(Collection)

在一个集合上进行遍历迭代:

``` kotlin
for (name in names)
  println(name)
```

使用 *in*{: .keyword } 运算符检查一个集合是否包含某个对象:

``` kotlin
if (text in names) // 将会调用 names.contains(text) 方法
  print("Yes")
```

使用 Lambda 表达式, 对集合元素进行过滤和变换:

``` kotlin
names
    .filter { it.startsWith("A") }
    .sortedBy { it }
    .map { it.toUpperCase() }
    .forEach { print(it) }
```

参见 [高阶函数与 Lambda 表达式](lambdas.html).

