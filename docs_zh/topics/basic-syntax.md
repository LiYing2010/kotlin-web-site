[//]: # (title: 基本语法)

最终更新: %latestDocDate%

本章会通过示例程序向你介绍 Kotlin 的一系列基本语法元素.
在各节的末尾, 你可以找到各个专题详细信息的页面链接.

你也可以通过 JetBrains Academy 的免费
[Kotlin 核心课程](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)
学习 Kotlin 的全部基本知识.

## 包的定义与导入

包的定义应该在源代码文件的最上方.

```kotlin
package my.demo

import kotlin.text.*

// ...
```

源代码所在的目录结构不必与包结构保持一致: 源代码文件可以放置在文件系统的任意位置.

参见 [包](packages.md).

## 程序入口点(entry point) {id="program-entry-point"}

Kotlin 应用程序的入口点是 `main` 函数.

```kotlin
fun main() {
    println("Hello world!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-hello-world"}

`main` 函数的另一种形式可以接受数量不定的 `String` 参数.

```kotlin
fun main(args: Array<String>) {
    println(args.contentToString())
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 向标准输出(Standard Output)打印信息

`print` 函数会将传递给它的参数打印到标准输出(Standard Output).

```kotlin
fun main() {
//sampleStart
    print("Hello ")
    print("world!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-print"}

`println` 函数会打印它的参数, 并在末尾加上换行(Line Break), 因此之后的打印信息会出现在下一行.

```kotlin
fun main() {
//sampleStart
    println("Hello world!")
    println(42)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-println"}

## 函数

以下函数接受两个 `Int` 类型参数, 并返回 `Int` 类型结果.

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-return-int"}

以下函数使用表达式语句作为函数体, 返回类型由自动推断决定.

```kotlin
//sampleStart
fun sum(a: Int, b: Int) = a + b
//sampleEnd

fun main() {
    println("sum of 19 and 23 is ${sum(19, 23)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-expression"}

以下函数不返回有意义的结果.

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-return-unit"}

返回值为 `Unit` 类型时, 可以省略.

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-omit-unit"}

参见 [函数](functions.md).

## 变量 {id="variables"}

只读的局部变量使用关键字 `val` 来定义, 它们只能赋值一次.

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-val"}

可以多次赋值的变量使用关键字 `var` 来定义.

```kotlin
fun main() {
//sampleStart
    var x = 5 // 变量类型自动推断为 `Int` 类型
    x += 1
//sampleEnd
    println("x = $x")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-var"}

也可以将变量声明在顶级(top level).

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-variable-top-level"}

参见 [属性(Property)](properties.md).

## 创建类与实例

要定义类, 请使用 `class` 关键字.

```kotlin
class Shape
```

类的属性(Property)可以在类声明部分或类主体部分中列出.

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2
}
```

会自动生成一个默认构造器, 参数是在类声明部分中定义的那些属性.

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2
}
fun main() {
//sampleStart
    val rectangle = Rectangle(5.0, 2.0)
    println("The perimeter is ${rectangle.perimeter}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-class-constructor"}

类之间的继承关系使用冒号(`:`)表示. 类默认为 final; 要允许一个类被后代继承, 请将它标记为 `open`.

```kotlin
open class Shape

class Rectangle(val height: Double, val length: Double): Shape() {
    val perimeter = (height + length) * 2
}
```

参见 [类](classes.md) 和 [对象与实例](object-declarations.md).

## 注释

与大多数现代编程语言一样, Kotlin 支持单行(或者叫做 _行尾_)注释, 也支持多行 (或者叫做 _块_) 注释.

```kotlin
// 这是一条行尾注释

/* 这是一条块注释
   可以包含多行内容. */
```

Kotlin 的块注释允许嵌套.

```kotlin
/* 注释从这里开始
/* 包含一个嵌套的注释 */
到这里结束. */
```

关于文档注释的语法, 详情请参见 [Kotlin 代码中的文档](kotlin-doc.md).

## 字符串模板

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-string-templates"}

详情请参见 [字符串模板](strings.md#string-templates).

## 条件表达式

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-conditional-expressions"}

在 Kotlin 中, `if` 也可以用作表达式.

```kotlin
//sampleStart
fun maxOf(a: Int, b: Int) = if (a > b) a else b
//sampleEnd

fun main() {
    println("max of 0 and 42 is ${maxOf(0, 42)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-if-expression"}

参见 [`if` 表达式](control-flow.md#if-expression).

## for 循环

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-for-loop"}

或者

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-for-loop-indices"}

参见 [for 循环](control-flow.md#for-loops).

## while 循环

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-while-loop"}

参见 [while 循环](control-flow.md#while-loops).

## when 表达式

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-when-expression"}

参见 [when 表达式](control-flow.md#when-expression).

## 值范围(Range)

使用 `in` 操作符检查一个数值是否在某个值范围(Range)之内:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-range-in"}

检查一个数值是否在某个值范围之外.

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-out-of-range"}

在一个值范围内进行遍历迭代.

```kotlin
fun main() {
//sampleStart
    for (x in 1..5) {
        print(x)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-iterate-range"}

在一个数列(progression)上进行遍历迭代.

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-iterate-progression"}

参见 [值范围(Range)与数列(Progression)](ranges.md).

## 集合(Collection)

在一个集合上进行遍历迭代.

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-iterate-collection"}

使用 `in` 运算符检查一个集合是否包含某个对象.

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-collection-in"}

使用 [Lambda 表达式](lambdas.md) 对集合元素进行过滤和变换:

```kotlin
fun main() {
//sampleStart
    val fruits = listOf("banana", "avocado", "apple", "kiwifruit")
    fruits
      .filter { it.startsWith("a") }
      .sortedBy { it }
      .map { it.uppercase() }
      .forEach { println(it) }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-collection-filter-map"}

参见 [集合(Collection)概述](collections-overview.md).

## 可为 null 的值 与 null 值检查

当一个引用可能为 `null` 值时, 对应的类型声明必须明确地标记为可为 null.
类型名称末尾带 `?` 符号表示可为 null 值.

当 `str` 中的字符串内容不是一个整数时, 返回 `null`:

```kotlin
fun parseInt(str: String): Int? {
    // ...
}
```

以下示例演示如何使用一个返回值可为 null 的函数:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-nullable-value"}

或者

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-function-null-check"}

参见 [Null 值安全](null-safety.md).

## 类型检查与自动类型转换

`is` 运算符可以检查一个表达式的值是不是某个类型的实例.
如果对一个不可变的局部变量或属性进行过类型检查, 那么之后的代码就不必再对它进行显式地类型转换, 而可以直接将它当作需要的类型来使用:

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
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-is-operator"}

或者

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
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength(1000)
    printLength(listOf(Any()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-is-operator-expression"}

甚至还可以

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
        println("Getting the length of '$obj'. Result: ${getStringLength(obj) ?: "Error: The object is not a string"} ")
    }
    printLength("Incomprehensibilities")
    printLength("")
    printLength(1000)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-basic-syntax-is-operator-logic"}

参见 [类](classes.md) 和 [类型转换](typecasts.md).
