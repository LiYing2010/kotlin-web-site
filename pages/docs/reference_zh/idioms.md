---
type: doc
layout: reference
category: "Basics"
title: "惯用法"
---

# 惯用法

本章介绍 Kotlin 中的一些常见的习惯用法. 如果你有自己的好的经验, 可以将它贡献给我们. 你可以将你的修正提交到 git, 并创建一个 Pull Request.

### 创建 DTO 类(或者叫 POJO/POCO 类)

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
data class Customer(val name: String, val email: String)
```
</div>

以上代码将创建一个 `Customer` 类, 其中包含以下功能:

* 所有属性的 getter 函数(对于 *var*{: .keyword } 型属性还有 setter 函数)
* `equals()` 函数
* `hashCode()` 函数
* `toString()` 函数
* `copy()` 函数
* 所有属性的 `component1()`, `component2()`, ...  函数(参见 [数据类](data-classes.html))


### 对函数参数指定默认值

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```
</div>

### 过滤 List 中的元素

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val positives = list.filter { x -> x > 0 }
```
</div>

甚至还可以写得更短:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val positives = list.filter { it > 0 }
```
</div>

### 在集合中检查元素是否存在.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
if ("john@example.com" in emailsList) { ... }

if ("jane@example.com" !in emailsList) { ... }
```
</div>

### 在字符串内插入变量值

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
println("Name $name")
```
</div>

### 类型实例检查

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```
</div>

### 使用成对变量来遍历 Map, 这种语法也可以用来遍历 Pair 组成的 List

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```
</div>

上例中的 `k`, `v` 可以使用任何的变量名.

### 使用数值范围

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
for (i in 1..100) { ... }  // 闭区间: 包括 100
for (i in 1 until 100) { ... } // 半开(half-open)区间: 不包括 100
for (x in 2..10 step 2) { ... }
for (x in 10 downTo 1) { ... }
if (x in 1..10) { ... }
```
</div>

### 只读 List

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val list = listOf("a", "b", "c")
```
</div>

### 只读 Map

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```
</div>

### 访问 Map

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
println(map["key"])
map["key"] = value
```
</div>

### 延迟计算(Lazy)属性

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val p: String by lazy {
    // compute the string
}
```
</div>

### 扩展函数

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```
</div>

### 创建单例(Singleton)

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
object Resource {
    val name = "Name"
}
```
</div>

### If not null 的简写表达方式

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val files = File("Test").listFiles()

println(files?.size)
```
</div>

### If not null ... else 的简写表达方式

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val files = File("Test").listFiles()

println(files?.size ?: "empty")
```
</div>

### 当值为 null 时, 执行某个语句

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val values = ...
val email = values["email"] ?: throw IllegalStateException("Email is missing!")
```
</div>

### 从可能为空的集合中取得第一个元素

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val emails = ... // 可能为空
val mainEmail = emails.firstOrNull() ?: ""
```
</div>

### 当值不为 null 时, 执行某个语句

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val value = ...

value?.let {
    ... // 这个代码段将在 data 不为 null 时执行
}
```
</div>

### 当值不为 null 时, 进行映射变换

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val value = ...

val mapped = value?.let { transformValue(it) } ?: defaultValue
// 如果 value 为 null, 会 transform 处理结果为 null, 则返回 defaultValue
```
</div>

### 在函数的 return 语句中使用 when 语句

<div class="sample" markdown="1" theme="idea" data-highlight-only>
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
</div>

### 将 'try/catch' 用作一个表达式

<div class="sample" markdown="1" theme="idea" data-highlight-only>
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
</div>

### 将 'if' 用作一个表达式

<div class="sample" markdown="1" theme="idea" data-highlight-only>
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
</div>

### 返回值为 `Unit` 类型的多个方法, 可以通过 Builder 风格的方式来串联调用

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```
</div>


### 使用单个表达式来定义一个函数

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun theAnswer() = 42
```
</div>

以上代码等价于:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun theAnswer(): Int {
    return 42
}
```
</div>

这种用法与其他惯用法有效地结合起来, 可以编写出更简短的代码. 比如. 可以与 *when*{: .keyword }-表达式结合起来:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```
</div>

### 在同一个对象实例上调用多个方法(`with` 函数)

<div class="sample" markdown="1" theme="idea" data-highlight-only>
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
</div>

### 配置对象属性 (`apply` 函数)
<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val myRectangle = Rectangle().apply {
    length = 4
    breadth = 5
    color = 0xFAFAFA
}
```
</div>

这种方法可以非常方便地配置对象构造函数参数以外的那些属性.

### 类似 Java 7 中针对资源的 try 语句

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">
```kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader ->
    println(reader.readText())
}
```
</div>

### 对于需要泛型类型信息的函数, 可以使用这样的简便形式

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
//  public final class Gson {
//     ...
//     public <T> T fromJson(JsonElement json, Class<T> classOfT) throws JsonSyntaxException {
//     ...

inline fun <reified T: Any> Gson.fromJson(json: JsonElement): T = this.fromJson(json, T::class.java)
```
</div>

### 使用可为 null 的布尔值

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val b: Boolean? = ...
if (b == true) {
    ...
} else {
    // `b` 为 false 或为 null
}
```
</div>

### 交换两个变量的值

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
var a = 1
var b = 2
a = b.also { b = a }
```
</div>

### TODO(): 表示代码还未完成

Kotlin 标准库有一个 `TODO()` 函数, 它永远会抛出一个 `NotImplementedError`.
这个函数的返回值是 `Nothing`, 因此无论代码中需要的返回类型是什么, 都可以使用这个函数.
这个函数还有一个参数重载(overload)的版本, 接受一个参数, 用来解释具体的原因:

```kotlin
fun calcTaxes(): BigDecimal = TODO("Waiting for feedback from accounting")
```

IntelliJ IDEA 的 Kotlin 插件能够理解 `TODO()` 函数的意义, 并会在 TODO 窗口中自动添加一条 TODO 项.
