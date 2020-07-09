---
type: doc
layout: reference
category: "基础"
title: "基本语法"
---

# 基本语法

{:#defining-packages}

## 包的定义与导入

包的定义应该在源代码文件的最上方:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
package my.demo

import kotlin.text.*

// ...
```

</div>

源代码所在的目录结构不必与包结构保持一致: 源代码文件可以放置在文件系统的任意位置.

参见 [包](packages.html).

## 程序入口点(entry point)

Kotlin 应用程序的入口点是 `main` 函数.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
    println("Hello world!")
}
```

</div>

{:#defining-functions}

## 函数

以下函数接受两个 `Int` 类型参数, 并返回 `Int` 类型结果:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun sum(a: Int, b: Int): Int {
    return a + b
}
//sampleEnd

fun main() {
    print("sum of 3 and 5 is ")
    println(sum(3, 5))
}
```

</div>

以下函数使用表达式语句作为函数体, 返回类型由自动推断决定:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun sum(a: Int, b: Int) = a + b
//sampleEnd

fun main() {
    println("sum of 19 and 23 is ${sum(19, 23)}")
}
```

</div>

以下函数不返回有意义的结果:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun printSum(a: Int, b: Int): Unit {
    println("sum of $a and $b is ${a + b}")
}
//sampleEnd

fun main() {
    printSum(-1, 8)
}
```

</div>

返回值为 `Unit` 类型时, 可以省略:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun printSum(a: Int, b: Int) {
    println("sum of $a and $b is ${a + b}")
}
//sampleEnd

fun main() {
    printSum(-1, 8)
}
```

</div>

参见 [函数](functions.html).

{:#defining-variables}

## 变量

只读的局部变量使用关键字 `val` 来定义, 它们只能赋值一次:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val a: Int = 1  // 立即赋值
    val b = 2   // 变量类型自动推断为 `Int` 类型
    val c: Int  // 没有初始化语句时, 必须明确指定类型
    c = 3       // 延迟赋值
//sampleEnd
    println("a = $a, b = $b, c = $c")
}
```

</div>

可以多次赋值的变量使用关键字 `var` 来定义:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    var x = 5 // 变量类型自动推断为 `Int` 类型
    x += 1
//sampleEnd
    println("x = $x")
}
```

</div>

顶级(top level) 变量:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
val PI = 3.14
var x = 0

fun incrementX() {
    x += 1
}
//sampleEnd

fun main() {
    println("x = $x; PI = $PI")
    incrementX()
    println("incrementX()")
    println("x = $x; PI = $PI")
}
```

</div>

参见 [属性(Property)与域(Field)](properties.html).


## 注释

与大多数现代编程语言一样, Kotlin 支持单行(或者叫做 _行尾_)注释, 也支持多行 (或者叫做 _块_) 注释.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 这是一条行尾注释

/* 这是一条块注释
   可以包含多行内容. */
```

</div>

Kotlin 的块注释允许嵌套.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
/* 注释从这里开始
/* 包含一个嵌套的注释 */     
到这里结束. */
```

</div>

关于文档注释的语法, 详情请参见 [Kotlin 代码中的文档](kotlin-doc.html).

{:#using-string-templates}

## 字符串模板

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    var a = 1
    // 在字符串模板内使用简单的变量名称
    val s1 = "a is $a"

    a = 2
    // 在字符串模板内使用任意的表达式:
    val s2 = "${s1.replace("is", "was")}, but now is $a"
//sampleEnd
    println(s2)
}
```

</div>

详情请参见 [字符串模板](basic-types.html#string-templates).

{:#using-conditional-expressions}

## 条件表达式

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun maxOf(a: Int, b: Int): Int {
    if (a > b) {
        return a
    } else {
        return b
    }
}
//sampleEnd

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```

</div>


在 Kotlin 中, *if*{: .keyword } 也可以用作表达式:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun maxOf(a: Int, b: Int) = if (a > b) a else b
//sampleEnd

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```

</div>

参见 [*if*{: .keyword } 表达式](control-flow.html#if-expression).

{:#using-nullable-values-and-checking-for-null}

## 可为 null 的值, *null*{: .keyword } 检查

当一个引用可能为 *null*{: .keyword } 值时, 对应的类型声明必须明确地标记为可为 null.

当 `str` 中的字符串内容不是一个整数时, 返回 *null*{: .keyword }:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun parseInt(str: String): Int? {
    // ...
}
```

</div>

以下示例演示如何使用一个返回值可为 null 的函数:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

//sampleStart
fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

    // 直接使用 `x * y` 会导致错误, 因为它们可能为 null.
    if (x != null && y != null) {
        // 在进行过 null 值检查之后, x 和 y 的类型会被自动转换为非 null 变量
        println(x * y)
    }
    else {
        println("'$arg1' or '$arg2' is not a number")
    }    
}
//sampleEnd


fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("a", "b")
}
```

</div>

或者


<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun parseInt(str: String): Int? {
    return str.toIntOrNull()
}

fun printProduct(arg1: String, arg2: String) {
    val x = parseInt(arg1)
    val y = parseInt(arg2)

//sampleStart
    // ...
    if (x == null) {
        println("Wrong number format in arg1: '$arg1'")
        return
    }
    if (y == null) {
        println("Wrong number format in arg2: '$arg2'")
        return
    }

    // 在进行过 null 值检查之后, x 和 y 的类型会被自动转换为非 null 变量
    println(x * y)
//sampleEnd
}

fun main() {
    printProduct("6", "7")
    printProduct("a", "7")
    printProduct("99", "b")
}
```

</div>

参见 [Null 值安全](null-safety.html).

{:#using-type-checks-and-automatic-casts}

## 类型检查与自动类型转换

*is*{: .keyword } 运算符可以检查一个表达式的值是不是某个类型的实例.
如果对一个不可变的局部变量或属性进行过类型检查, 那么之后的代码就不必再对它进行显式地类型转换, 而可以直接将它当作需要的类型来使用:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj is String) {
        // 在这个分支中, `obj` 的类型会被自动转换为 `String`
        return obj.length
    }

    // 在类型检查所影响的分支之外, `obj` 的类型仍然是 `Any`
    return null
}
//sampleEnd


fun main() {
    fun printLength(obj: Any) {
        println("'$obj' string length is ${getStringLength(obj) ?: "... err, not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```

</div>

或者

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    if (obj !is String) return null

    // 在这个分支中, `obj` 的类型会被自动转换为 `String`
    return obj.length
}
//sampleEnd


fun main() {
    fun printLength(obj: Any) {
        println("'$obj' string length is ${getStringLength(obj) ?: "... err, not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```

</div>

甚至还可以

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun getStringLength(obj: Any): Int? {
    // 在 `&&` 运算符的右侧, `obj` 的类型会被自动转换为 `String`
    if (obj is String && obj.length > 0) {
        return obj.length
    }

    return null
}
//sampleEnd


fun main() {
    fun printLength(obj: Any) {
        println("'$obj' string length is ${getStringLength(obj) ?: "... err, is empty or not a string at all"} ")
    }
    printLength("Incomprehensibilities")
    printLength("")
    printLength(1000)
}
```

</div>

参见 [类](classes.html) 和 [类型转换](typecasts.html).

{:#using-a-for-loop}

## `for` 循环

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    for (item in items) {
        println(item)
    }
//sampleEnd
}
```

</div>

或者

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    for (index in items.indices) {
        println("item at $index is ${items[index]}")
    }
//sampleEnd
}
```

</div>

参见 [for 循环](control-flow.html#for-loops).

{:#using-a-while-loop}

## `while` 循环

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val items = listOf("apple", "banana", "kiwifruit")
    var index = 0
    while (index < items.size) {
        println("item at $index is ${items[index]}")
        index++
    }
//sampleEnd
}
```

</div>

参见 [while 循环](control-flow.html#while-loops).

{:#using-when-expression}

## `when` 表达式

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
//sampleStart
fun describe(obj: Any): String =
    when (obj) {
        1          -> "One"
        "Hello"    -> "Greeting"
        is Long    -> "Long"
        !is String -> "Not a string"
        else       -> "Unknown"
    }
//sampleEnd

fun main() {
    println(describe(1))
    println(describe("Hello"))
    println(describe(1000L))
    println(describe(2))
    println(describe("other"))
}
```

</div>

参见 [when expression](control-flow.html#when-expression).

{:#using-ranges}

## 值范围(Range)

使用 *in*{: .keyword } 运算符检查一个数值是否在某个值范围(Range)之内:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val x = 10
    val y = 9
    if (x in 1..y+1) {
        println("fits in range")
    }
//sampleEnd
}
```

</div>

检查一个数值是否在某个值范围之外:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val list = listOf("a", "b", "c")

    if (-1 !in 0..list.lastIndex) {
        println("-1 is out of range")
    }
    if (list.size !in list.indices) {
        println("list size is out of valid list indices range, too")
    }
//sampleEnd
}
```

</div>

在一个值范围内进行遍历迭代:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    for (x in 1..5) {
        print(x)
    }
//sampleEnd
}
```

</div>

在一个数列(progression)上进行遍历迭代:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    for (x in 1..10 step 2) {
        print(x)
    }
    println()
    for (x in 9 downTo 0 step 3) {
        print(x)
    }
//sampleEnd
}
```

</div>

参见 [值范围](ranges.html).

{:#using-collections}

## 集合(Collection)

在一个集合上进行遍历迭代:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
    val items = listOf("apple", "banana", "kiwifruit")
//sampleStart
    for (item in items) {
        println(item)
    }
//sampleEnd
}
```

</div>

使用 *in*{: .keyword } 运算符检查一个集合是否包含某个对象:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
    val items = setOf("apple", "banana", "kiwifruit")
//sampleStart
    when {
        "orange" in items -> println("juicy")
        "apple" in items -> println("apple is fine too")
    }
//sampleEnd
}
```

</div>

使用 Lambda 表达式, 对集合元素进行过滤和变换:

<div class="sample" markdown="1" theme="idea" auto-indent="false" indent="2">

```kotlin
fun main() {
//sampleStart
    val fruits = listOf("banana", "avocado", "apple", "kiwifruit")
    fruits
      .filter { it.startsWith("a") }
      .sortedBy { it }
      .map { it.toUpperCase() }
      .forEach { println(it) }
//sampleEnd
}
```

</div>

参见 [集合(Collection)概述](collections-overview.html).

## 创建基本的类, 及其实例:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    val rectangle = Rectangle(5.0, 2.0)
    val triangle = Triangle(3.0, 4.0, 5.0)
//sampleEnd
    println("Area of rectangle is ${rectangle.calculateArea()}, its perimeter is ${rectangle.perimeter}")
    println("Area of triangle is ${triangle.calculateArea()}, its perimeter is ${triangle.perimeter}")
}

abstract class Shape(val sides: List<Double>) {
    val perimeter: Double get() = sides.sum()
    abstract fun calculateArea(): Double
}

interface RectangleProperties {
    val isSquare: Boolean
}

class Rectangle(
    var height: Double,
    var length: Double
) : Shape(listOf(height, length, height, length)), RectangleProperties {
    override val isSquare: Boolean get() = length == height
    override fun calculateArea(): Double = height * length
}

class Triangle(
    var sideA: Double,
    var sideB: Double,
    var sideC: Double
) : Shape(listOf(sideA, sideB, sideC)) {
    override fun calculateArea(): Double {
        val s = perimeter / 2
        return Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC))
    }
}
```

</div>

详情请参见 [类](classes.html) 以及 [对象和实例](object-declarations.html).
