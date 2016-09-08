---
type: doc
layout: reference
category: "Basics"
title: "惯用法"
---

# 惯用法

本章介绍 Kotlin 中的一些常见的习惯用法. 如果你有自己的好的经验, 可以将它贡献给我们. 你可以将你的修正提交到 git, 并发起一个 Pull Request.

### 创建 DTO 类(或者叫 POJO/POCO 类)

``` kotlin
data class Customer(val name: String, val email: String)
```

以上代码将创建一个 `Customer` 类, 其中包含以下功能:

* 所有属性的 getter 函数(对于 *var*{: .keyword } 型属性还有 setter 函数)
* `equals()` 函数
* `hashCode()` 函数
* `toString()` 函数
* `copy()` 函数
* 所有属性的 `component1()`, `component2()`, ...  函数(参见 [数据类](data-classes.html))


### 对函数参数指定默认值

``` kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

### 过滤 List 中的元素

``` kotlin
val positives = list.filter { x -> x > 0 }
```

甚至还可以写得更短:

``` kotlin
val positives = list.filter { it > 0 }
```

### 在字符串内插入变量值

``` kotlin
println("Name $name")
```

### 类型实例检查

``` kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```

### 使用成对变量来遍历 Map, 这种语法也可以用来遍历 Pair 组成的 List

``` kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

上例中的 `k`, `v` 可以使用任何的变量名.

### 使用数值范围

``` kotlin
for (i in 1..100) { ... }  // 闭区间: 包括 100
for (i in 1 until 100) { ... } // 半开(half-open)区间: 不包括 100
for (x in 2..10 step 2) { ... }
for (x in 10 downTo 1) { ... }
if (x in 1..10) { ... }
```

### 只读 List

``` kotlin
val list = listOf("a", "b", "c")
```

### 只读 Map

``` kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

### 访问 Map

``` kotlin
println(map["key"])
map["key"] = value
```

### 延迟计算(Lazy)属性

``` kotlin
val p: String by lazy {
    // compute the string
}
```

### 扩展函数

``` kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```

### 创建单例(Singleton)

``` kotlin
object Resource {
    val name = "Name"
}
```

### If not null 的简写表达方式

``` kotlin
val files = File("Test").listFiles()

println(files?.size)
```

### If not null ... else 的简写表达方式

``` kotlin
val files = File("Test").listFiles()

println(files?.size ?: "empty")
```

### 当值为 null 时, 执行某个语句

``` kotlin
val data = ...
val email = data["email"] ?: throw IllegalStateException("Email is missing!")
```

### 当值不为 null 时, 执行某个语句

``` kotlin
val data = ...

data?.let {
    ... // 这个代码段将在 data 不为 null 时执行
}
```

### 在函数的 return 语句中使用 when 语句

``` kotlin
fun transform(color: String): Int {
    return when (color) {
        "Red" -> 0
        "Green" -> 1
        "Blue" -> 2
        else -> throw IllegalArgumentException("Invalid color param value")
    }
}
```

### 将 'try/catch' 用作一个表达式

``` kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }

    // 使用 result
}
```

### 将 'if' 用作一个表达式

``` kotlin
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

### 返回值为 `Unit` 类型的多个方法, 可以通过 Builder 风格的方式来串联调用

``` kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```


### 使用单个表达式来定义一个函数

``` kotlin
fun theAnswer() = 42
```

以上代码等价于:

``` kotlin
fun theAnswer(): Int {
    return 42
}
```

这种用法与其他惯用法有效地结合起来, 可以编写出更简短的代码. 比如. 可以与 *when*{: .keyword }-表达式结合起来:

``` kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```

### 在同一个对象实例上调用多个方法('with' 语句)

``` kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { // 描绘一个边长 100 像素的正方形
    penDown()
    for(i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```

### 类似 Java 7 中针对资源的 try 语句

``` kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader ->
    println(reader.readText())
}
```

### 对于需要泛型类型信息的函数, 可以使用这样的简便形式

``` kotlin
//  public final class Gson {
//     ...
//     public <T> T fromJson(JsonElement json, Class<T> classOfT) throws JsonSyntaxException {
//     ...

inline fun <reified T: Any> Gson.fromJson(json): T = this.fromJson(json, T::class.java)
```

### 使用可为 null 的布尔值

``` kotlin
val b: Boolean? = ...
if (b == true) {
    ...
} else {
    // `b` 为 false 或为 null
}
```
