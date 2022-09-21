---
type: doc
layout: reference
category:
title: "字符串"
---

# 字符串

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin 中的字符串由 `String` 类型表示.
一般来说, 字符串值是一系列字符, 用双引号(`"`)括起:

```kotlin
val str = "abcd 123"
```

字符串中的元素是字符, 你可以通过下标操作符来访问: `s[i]`.
你可以使用 `for` 循环来遍历这些字符:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
val str = "abcd"
//sampleStart
for (c in str) {
    println(c)
}
//sampleEnd
}
```

</div>

字符串是不可变的. 一旦初始化之后, 将不能改变它的值, 也不能为它赋予一个新的值.
所有改变字符串内容的操作, 返回值都是新的 `String` 对象, 而操作对象的原字符串不会改变:

```kotlin
fun main() {
//sampleStart
    val str = "abcd"
    println(str.uppercase()) // 创建一个新的 String 对象, 并打印
    println(str) // 原字符串保持原来的值不变
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}


要拼接字符串, 可以使用 `+` 操作符. 这个操作符也可以将字符串与其他数据类型的值拼接起来, 只要表达式中的第一个元素是字符串类型:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
val s = "abc" + 1
println(s + "def")
//sampleEnd
}
```

</div>

> 大多数情况下, 字符串拼接处理应该使用 [字符串模板](#string-templates) 或 [原生字符串(raw string)](#raw-strings).
{:.note}


## 字符串的字面值(literal)

Kotlin 中存在两种字符串字面值:

* [转义(Escaped)字符串](#escaped-strings)
* [原生(Raw)字符串](#raw-strings)

### 转义(Escaped)字符串

_转义(Escaped)字符串_ 可以包含转义字符.
转义字符串的示例如下:

```kotlin
val s = "Hello, world!\n"
```

转义字符使用通常的反斜线(`\`)方式表示.
关于 Kotlin 支持的转义字符, 请参见 [字符](characters.html).

### 原生(Raw)字符串

_原生(Raw)字符串_ 可以包含换行符和任意文本.
由三重引号表示(`"""`), 其内容不转义, 可以包含换行符和任意字符:

```kotlin
val text = """
    for (c in "foo")
        print(c)
"""
```

要删除字符串的前导空白(leading whitespace), 可以使用 [`trimMargin()`](/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

</div>

默认情况下, 会使用管道符号 `|` 作为前导空白的标记前缀, 但你可以通过参数指定使用其它字符, 比如 `trimMargin(">")`.

## 字符串模板

字符串字面值内可以包含 _模板表达式_, 它是一小段代码, 会被执行, 其计算结果将被拼接为字符串内容的一部分.
模板表达式以 `$` 符号开始, `$` 符号之后可以是一个变量名:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val i = 10
    println("i = $i") // 打印结果为 "i = 10"
//sampleEnd
}
```

</div>

`$` 符号之后也可以是表达式, 由大括号括起:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val s = "abc"
    println("$s.length is ${s.length}") // 打印结果为 "abc.length is 3"
//sampleEnd
}
```

</div>

在原生字符串(raw string)和转义字符串(escaped string)中都可以使用模板.
由于原生字符串不能使用反斜线转义表达方式, 如果要在字符串中的任何符号之前插入美元符号 `$` 本身
(`$` 可以用作 [标识符](https://kotlinlang.org/docs/reference/grammar.html#identifiers) 的开始字符),
可以使用以下语法:

```kotlin
val price = """
${'$'}_9.99
"""
```
