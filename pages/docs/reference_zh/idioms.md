---
type: doc
layout: reference
category: "Basics"
title: "惯用法"
---

# 惯用法

本页面最终更新: 2021/11/30

本章介绍 Kotlin 中的一些常见的习惯用法. 如果你有自己的好的经验, 可以将它贡献给我们. 你可以将你的修正提交到 git, 并创建一个 Pull Request.

## 创建 DTO 类(或者叫 POJO/POCO 类)

```kotlin
data class Customer(val name: String, val email: String)
```

以上代码将创建一个 `Customer` 类, 其中包含以下功能:

* 所有属性的 getter 函数(对于 `var` 型属性还有 setter 函数)
* `equals()` 函数
* `hashCode()` 函数
* `toString()` 函数
* `copy()` 函数
* 所有属性的 `component1()`, `component2()`, ...  函数(参见 [数据类](data-classes.html))


## 对函数参数指定默认值

```kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

## 过滤 List 中的元素

```kotlin
val positives = list.filter { x -> x > 0 }
```

甚至还可以写得更短:

```kotlin
val positives = list.filter { it > 0 }
```

详情请参见 [Java 与 Kotlin 过滤处理的区别](jvm/java-to-kotlin-idioms-strings.html#create-a-string-from-collection-items).


## 在集合中检查元素是否存在

```kotlin
if ("john@example.com" in emailsList) { ... }

if ("jane@example.com" !in emailsList) { ... }
```

## 在字符串内插入变量值

```kotlin
println("Name $name")
```

详情请参见 [Java 与 Kotlin 字符串拼接处理的区别](jvm/java-to-kotlin-idioms-strings.html#concatenate-strings).

## 类型实例检查

```kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```

## 只读 List

```kotlin
val list = listOf("a", "b", "c")
```

## 只读 Map

```kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

## 访问 Map 中的条目

```kotlin
println(map["key"])
map["key"] = value
```

## 使用成对变量来遍历 Map, 或遍历 Pair 组成的 List

```kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

上例中的 `k`, `v` 可以使用任何方便的变量名, 比如 `name` 和 `age`.

## 在数值范围中遍历

```kotlin
for (i in 1..100) { ... }  // 闭区间: 包括 100
for (i in 1 until 100) { ... } // 半开(half-open)区间: 不包括 100
for (x in 2..10 step 2) { ... }
for (x in 10 downTo 1) { ... }
(1..10).forEach { ... }
```

## 延迟计算(Lazy)属性

```kotlin
val p: String by lazy {
    // 在这里计算字符串值
}
```

## 扩展函数

```kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```

## 创建单例(Singleton)

```kotlin
object Resource {
    val name = "Name"
}
```


## 为抽象类(Abstract Class)创建实例

```kotlin
abstract class MyAbstractClass {
    abstract fun doSomething()
    abstract fun sleep()
}

fun main() {
    val myObject = object : MyAbstractClass() {
        override fun doSomething() {
            // ...
        }

        override fun sleep() { // ...
        }
    }
    myObject.doSomething()
}
```

## If not null 的简写表达方式

```kotlin
val files = File("Test").listFiles()

println(files?.size) // 如果 files 不为 null, 这里会打印 size 值
```

## If-not-null-else 的简写表达方式

```kotlin
val files = File("Test").listFiles()

println(files?.size ?: "empty") // 如果 files 为 null, 这里会打印 "empty"
```

## 当值为 null 时, 执行某个语句

```kotlin
val values = ...
val email = values["email"] ?: throw IllegalStateException("Email is missing!")
```

## 从可能为空的集合中取得第一个元素

```kotlin
val emails = ... // 可能为空
val mainEmail = emails.firstOrNull() ?: ""
```

详情请参见 [Java 与 Kotlin 集合第一个元素的获取方法的区别](jvm/java-to-kotlin-collections-guide.html#get-the-first-and-the-last-items-of-a-possibly-empty-collection).

## 当值不为 null 时, 执行某个语句

```kotlin
val value = ...

value?.let {
    ... // 这个代码段将在 data 不为 null 时执行
}
```

## 当值不为 null 时, 进行映射变换

```kotlin
val value = ...

val mapped = value?.let { transformValue(it) } ?: defaultValue
// 如果 value 为 null, 会 transform 处理结果为 null, 则返回 defaultValue
```

## 在函数的 return 语句中使用 when 语句

```kotlin
fun transform(color: String): Int {
    return when (color) {
        "Red" -> 0
        "Green" -> 1
        "Blue" -> 2
        else -> throw IllegalArgumentException("Invalid color param value")
    }
}
```

## 将 try-catch 用作一个表达式

```kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }

    // 使用 result
}
```

## 将 if 用作一个表达式

```kotlin
fun foo(param: Int) {
    val result = if (param == 1) {
        "one"
    } else if (param == 2) {
        "two"
    } else {
        "three"
    }
}
```

## 返回值为 Unit 类型的多个方法, 可以通过 Builder 风格的方式来串联调用

```kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```


## 使用单个表达式来定义一个函数

```kotlin
fun theAnswer() = 42
```

以上代码等价于:

```kotlin
fun theAnswer(): Int {
    return 42
}
```

这种用法与其他惯用法有效地结合起来, 可以编写出更简短的代码. 比如. 可以与 `when` 表达式结合起来:

```kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```

## 在同一个对象实例上调用多个方法(with 函数)

```kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { // 描绘一个边长 100 像素的正方形
    penDown()
    for (i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```

## 配置对象属性 (apply 函数)

```kotlin
val myRectangle = Rectangle().apply {
    length = 4
    breadth = 5
    color = 0xFAFAFA
}
```

这种方法可以非常方便地配置对象构造函数参数以外的那些属性.

## 类似 Java 7 中针对资源的 try 语句

```kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader ->
    println(reader.readText())
}
```

## 需要泛型类型信息的泛型函数

```kotlin
//  public final class Gson {
//     ...
//     public <T> T fromJson(JsonElement json, Class<T> classOfT) throws JsonSyntaxException {
//     ...

inline fun <reified T: Any> Gson.fromJson(json: JsonElement): T = this.fromJson(json, T::class.java)
```

## 可为 null 的布尔值

```kotlin
val b: Boolean? = ...
if (b == true) {
    ...
} else {
    // `b` 为 false 或为 null
}
```

## 交换两个变量的值

```kotlin
var a = 1
var b = 2
a = b.also { b = a }
```

## 将代码标记为未完成 (TODO)

Kotlin 标准库有一个 `TODO()` 函数, 它永远会抛出一个 `NotImplementedError`.
这个函数的返回值是 `Nothing`, 因此无论代码中需要的返回类型是什么, 都可以使用这个函数.
这个函数还有一个参数重载(overload)的版本, 接受一个参数, 用来解释具体的原因:

```kotlin
fun calcTaxes(): BigDecimal = TODO("Waiting for feedback from accounting")
```

IntelliJ IDEA 的 Kotlin 插件能够理解 `TODO()` 函数的意义, 并会在 TODO 工具窗口中自动添加一条 TODO 项.

## 下一步做什么

* 使用 Kotlin 的编程风格来解决 [Advent of Code 谜题](advent-of-code.html)
* 学习如何执行 [Java 与 Kotlin 中的常见字符串处理任务](jvm/java-to-kotlin-idioms-strings.html)
