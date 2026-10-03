[//]: # (title: 字符串)
[//]: # (description: 学习如何在 Kotlin 中使用字符串, 包括字符串字面值, 字符串模板, 多行字符串, 以及常见的文本操作.)

[`String`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/) 类型表示一系列 [字符](characters.md).
你可以使用它表达文本值, 例如单词, 句子, 消息, 或结构化文本.

`String` 类型是不可变的. 创建 `String` 对象之后, 它的内容在整个生命周期内都保持不变.
所有看起来好像修改字符串的操作, 实际上都会创建新的字符串.

## 声明字符串 {id="declare-strings"}

要声明 `String` 字面值, 请将值用双引号 (`""`) 括起.
可以明确的指定 `String` 类型, 也可以让 Kotlin 根据值推断类型:

```kotlin
val name: String = "Kotlin"
val message = "Hello, world!" // Kotlin 会将类型推断为 String
```

双引号的字符串字面值支持 [转义序列](characters.md#escape-sequences), 例如`\n` 或 `\t`:

```kotlin
val message = "Hello,\nworld!"
val quote = "Kotlin says, \"Hi\"."
```

### 多行字符串 {id="multiline-strings"}

要存储包含多行的文本, 或包含不想转义的引号的文本, 请使用三重引号 (`""" """`) 括起的多行字符串:

```kotlin
val text = """
Hello,
Kotlin
"""

val quote = """Kotlin says, "Hi"."""
```

> 多行字符串不支持转义序列. Kotlin 会将这些字符看作普通文本.
>
{style="note"}

多行字符串会保留源代码中书写的换行和缩进.
如果希望运行时的值与源代码文件中的文本布局一致, 这个特性很有用.

在下面的示例中, 每行前面的空格是结果字符串的一部分:

```kotlin
val text = """
    Hello,
    Kotlin
"""
```

要删除共通的前导缩进, 请使用
[`trimIndent()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/trim-indent.html) 函数.
它会检测非的空行中共通的最小缩进, 并将其删除:

```kotlin
fun main() {
//sampleStart
    val text = """
        Hello,
        Kotlin
    """.trimIndent()

    println(text)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要更明确地控制缩进的删除方式, 请使用
[`trimMargin()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/trim-margin.html) 函数.
它会删除每行的边界前缀和之前的所有内容:

```kotlin
fun main() {
//sampleStart
    val text = """
        |Hello,
        |Kotlin
    """.trimMargin()

    println(text)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

默认情况下, `trimMargin()` 使用竖线符号 (`|`) 作为边界前缀, 但也可以通过参数指定其他字符.
例如: `trimMargin(">")`.

> 使用 `trimIndent()` 或 `trimMargin()` 等函数处理字符串后, 无论在哪个平台, 结果字符串都只使用换行符 (`\n`) 作为行分隔符.
>
{style="note"}

## 字符串模板 {id="string-templates"}

通过字符串模板, 可以将变量和表达式直接嵌入到 `String` 字面值之内.
这个过程称为 _插值_. 对普通字符串和多行字符串, 都可以使用字符串模板.

要将变量插入字符串, 请使用 `$` 符号:

```kotlin
fun main() {
//sampleStart
    val name = "Kotlin"
    println("Hello, $name")
    // 输出结果为: Hello, Kotlin
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要将表达式插入字符串, 或者让变量与其他文本直接相邻, 请使用 `${}`:

```kotlin
fun main() {
//sampleStart
    val text = "abc"
    println("The length of $text is ${text.length}")
    // 输出结果为: The length of abc is 3

    val language = "Kotlin"
    println("${language}Lang")
    // 输出结果为: KotlinLang
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 也可以使用 `+` 操作符拼接字符串. 但是, 字符串模板通常更易读, 也更符合 Kotlin 的惯用法.
>
{style="tip"}

模板表达式中还可以直接包含双引号括起的字符串, 不需要转义:

```kotlin
// 双引号括起的字符串
val test = "${"test".uppercase()}"

// 多行字符串
val result = """
Result: ${"OK".lowercase()}
"""
```

### 字符串模板中可为 null 的值 {id="nullable-values-in-string-templates"}

如果插值的表达式或变量的值为 `null`, Kotlin 编译器会将文本 `null` 插入结果字符串.
要用其他值替代 `null`, 请使用 [Elvis 操作符](null-safety.md#elvis-operator) (`?:`):

```kotlin
fun main() {
//sampleStart
    val text: String? = null

    println("Hello, $text")
    // 输出结果为: Hello, null

    println("Hello, ${text ?: "Kotlin"}")
    // 输出结果为: Hello, Kotlin
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 多 `$` 符号字符串插值 {id="multi-dollar-string-interpolation"}

在普通字符串模板中, 单个美元符号 (`$`) 表示插值的开始.
如果需要在字符串中包含 `$` 符号的字面值, 请使用 **多 `$` 符号字符串插值**.

多 `$` 符号字符串插值允许指定需要多少个连续的 `$` 符号才能触发插值.
少于这个数量的 `$` 符号会被当作字符字面值.

例如, 在字符串字面值之前使用 `$$` 时, 只有两个连续的 `$` 符号才会开始插值:

```kotlin
val KClass<*>.jsonSchema : String
    get() = $$"""
    {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://example.com/product.schema.json",
        "$dynamicAnchor": "meta",
        "title": "$${simpleName ?: qualifiedName ?: "unknown"}",
        "type": "object"
    }
    """
```

> 多 `$` 符号字符串插值不会影响使用单 `$` 符号插值的代码.
> 你可以继续使用单个 `$`, 只在需要时使用多个 `$` 符号.
>
{style="tip"}

## 基本的字符串操作 {id="basic-string-operations"}

Kotlin 提供了处理字符串的各种操作. 本节介绍其中一些最常用的操作.

> 关于所有可用的函数, 详情请参见 [API 参考文档](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/).
>
{style="tip"}

### 获取字符串长度 {id="get-string-length"}

要获取字符串中的字符数量, 请使用 [`length`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/length.html) 属性:

```kotlin
fun main() {
//sampleStart
    val language = "Kotlin"
    println(language.length)
    // 输出结果为: 6
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 访问字符 {id="access-characters"}

可以使用索引操作符 (`[]`) 访问字符串中的单个字符:

```kotlin
fun main() {
//sampleStart
    val language = "Kotlin"

    println(language[0])
    // 输出结果为: K
    println(language[5])
    // 输出结果为: n
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 字符串的索引从 0 开始.、
> 如果试图访问有效范围之外的索引, Kotlin 会抛出异常.
>
{style="tip"}

也可以遍历字符串中的字符:

```kotlin
fun main() {
//sampleStart
    for (char in "Kotlin") {
        println(char)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 提取字符串的一部分 {id="extract-parts-of-a-string"}

要提取字符串的一部分, 请使用以下函数之一:

* [`substring()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/substring.html)
  返回一个新字符串, 包含原文本中选择的部分.
* [`subSequence()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/sub-sequence.html)
  返回一个 `CharSequence`, 包含原文本中选择的部分.

例如:

```kotlin
fun main() {
//sampleStart
    val text = "Kotlin"
    println(text.substring(1))
    // 输出结果为: otlin
    println(text.substring(1, 5))
    // 输出结果为: otli
    println(text.subSequence(1, 5))
    // 输出结果为: otli
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

由于 `String` 类型是不可变的, 这些函数不会修改原来的字符串.

### 比较字符串 {id="compare-strings"}

可以使用 `==` 操作符检查两个字符串的内容是否相同:

```kotlin
fun main() {
//sampleStart
    println("kotlin" == "kotlin")
    // 输出结果为: true

    println("kotlin" == "Kotlin")
    // 输出结果为: false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

也可以使用
[`compareTo()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/compare-to.html)
函数按字典顺序, 逐个字符的比较字符串.
它会扫描两个字符串, 直到找到第 1 对不同的字符, 返回值为:

* 字符串相等时, 返回 `0`.
* 接受者小于参数时, 返回小于 `0` 的值.
* 接受者大于参数时, 返回大于 `0` 的值.

```kotlin
fun main() {
//sampleStart
    println("abc".compareTo("abd") < 0)
    // 输出结果为: true

    println("abc".compareTo("ABC") > 0)
    // 输出结果为: true

    // 传入 true, 忽略大小写差异
    println("abc".compareTo("ABC", ignoreCase = true) == 0)
    // 输出结果为: true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 处理字符串内容 {id="work-with-string-content"}

如果要更改字符串内容, 可以使用
[`.trim()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/trim.html),
[`.replace()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/replace.html),
[`.uppercase()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/uppercase.html),
和 [`.lowercase()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/lowercase.html)
等函数, 创建修改后的副本:

```kotlin
fun main() {
//sampleStart
    val text = "  Hello, Kotlin  "

    println(text.trim())
    // 输出结果为: "Hello, Kotlin"

    println(text.replace("Kotlin", "world"))
    // 输出结果为: "  Hello, world  "

    println(text.uppercase())
    // 输出结果为: "  HELLO, KOTLIN  "

    println(text.lowercase())
    // 输出结果为: "  hello, kotlin  "
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

还可以使用
[`contains()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/contains.html),
[`startsWith()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/starts-with.html)
和 [`endsWith()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/ends-with.html)
函数, 检查字符串内容:

```kotlin
fun main() {
//sampleStart
    val domain = "kotlinlang.org"

    // 检查字符串是否包含 "."
    println(domain.contains("."))
    // 输出结果为: true

    // 检查字符串是否以 "kotlin" 开始
    println(domain.startsWith("kotlin"))
    // 输出结果为: true

    // 检查字符串是否以 ".org" 结尾
    println(domain.endsWith(".org"))
    // 输出结果为: true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 拆分字符串 {id="split-strings"}

可以使用
[`split()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/split.html)
函数, 按照分隔符将字符串拆分为多个部分:

```kotlin
fun main() {
//sampleStart
    val numbers = "one, two, three"
    println(numbers.split(", "))
    // 输出结果为: [one, two, three]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果要将字符串拆分为单独的行, 请使用
[`lines()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/lines.html)
函数:

```kotlin
fun main() {
//sampleStart
    val numbers = "one\ntwo\nthree"
    println(numbers.lines())
    // 输出结果为: [one, two, three]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 构建和格式化字符串 {id="build-and-format-strings"}

> 对于 Kotlin 中大多数格式化任务, 请使用 [字符串模板](#string-templates).
>
{style="tip"}

使用 `+` 操作符拼接字符串时, Kotlin 会为每次操作创建新的 `String` 对象.
在循环中, 或者在需要拼接很多片段时, 这种方式可能不合适.
要避免这类问题, 可以使用 `buildString()` 函数或 `StringBuilder`.
它们会将所有片段收集到同一个可变的缓冲区中, 只在最后生成一个字符串.

如果决定要添加什么内容的判断逻辑比较复杂, 请使用
[`buildString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/build-string.html) 函数.
例如, 有多个条件, 分别产生不同的文本片段时. 使用 `buildString()` 时, 不必直接管理缓冲区.
这个函数会在内部创建 `StringBuilder`, 执行你的代码块, 然后返回结果字符串.

```kotlin
fun main() {
//sampleStart
    val hasErrors = true
    val hasWarnings = true
    val isComplete = false

    // buildString 创建空的缓冲区
    val status = buildString {
        // 将 "Errors found" 添加到缓冲区
        if (hasErrors) append("Errors found")
        if (hasWarnings) {
            // 缓冲区不为空时, 添加 "; "
            if (isNotEmpty()) append("; ")
            // 添加 "Warnings found"
            append("Warnings found")
        }
        // isComplete = false, 不需要添加文字
        if (isComplete) {
            if (isNotEmpty()) append("; ")
            append("Completed")
        }
        // 缓冲区不为空时, 跳过 fallback 文字
        if (isEmpty()) append("OK")
    }

    println(status)
    // 输出结果为: Errors found; Warnings found
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果需要将缓冲区作为明确的值使用, 请使用
[`StringBuilder`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-string-builder/).
例如, 要修改已有文本:

```kotlin
fun main() {
//sampleStart
    val text = "Hello, Kotlin"
    val builder = StringBuilder(text)

    builder.replace(7, 13, "world")
    println(builder.toString())
    // 输出结果为: Hello, world
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

在 JVM 上, 还可以使用
[`String.format()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/format.html)
函数格式化字符串:

```kotlin
val text = String.format("Hello, %s", "Kotlin")
```

> 只有在 JVM 上, 确实需要格式说明符时, 才应该使用 `String.format()`.
> 关于格式说明符, 详情请参见 [Java Formatter 类的文档](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#summary).
>
{style="note"}

## 字符串转换 {id="string-conversion"}

字符串常被用来表示其他类型的值, 例如数字, `Boolean` 值, 或者输入得到的标识符.
Kotlin 提供了将值转换为字符串, 以及将字符串解析为其他类型的函数.

要得到值的字符串表达, 请使用
[`toString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/to-string.html)
函数:

```kotlin
val number = 10
val text = number.toString()
```

在字符串模板和字符串拼接中, Kotlin 会自动将值转换为字符串.

要将字符串转换为其他类型, 请使用相应的解析函数:

* 对于整数值: [`toByte()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-byte.html), [`toShort()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-short.html), [`toInt()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-int.html), [`toLong()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-long.html)
* 对于浮点值: [`toDouble()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-double.html), [`toFloat()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-float.html)
* 对于布尔值: [`toBoolean()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-boolean.html), [`toBooleanStrict()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/to-boolean-strict.html)

如果字符串格式有效, 这些函数会返回要求的类型的值.
如果输入有可能无效, 请使用名称以 `OrNull` 结尾的函数变体.
这些函数会返回 `null`, 而不是抛出异常, 因此适合于处理用户输入的数据, 或者你无法完全控制的数据:

```kotlin
val toInt = "10".toInt() // 值为: 10

// 1000000000000 超过了 Int 的最大值
val toIntInvalid = "1000000000000".toIntOrNull()

val toBoolean = "true".toBooleanStrict() // 值为: true
val toBooleanInvalid = "yes".toBooleanStrictOrNull() // 值为: null
```
