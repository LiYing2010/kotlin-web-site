[//]: # (title: 字符串)

Kotlin 中的字符串由 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 类型表达.

> 在 JVM 平台, 使用 UTF-16 编码的 `String` 类型的对象, 大约使用每字符 2 个字节.
>
{style="note"}

一般来说, 字符串值是一系列字符, 用双引号(`"`)括起:

```kotlin
val str = "abcd 123"
```

字符串中的元素是字符, 你可以通过下标操作符来访问: `s[i]`.
你可以使用 `for` 循环来遍历这些字符:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

字符串是不可变的. 一旦初始化之后, 将不能改变它的值, 也不能为它赋予一个新的值.
所有改变字符串内容的操作, 返回值都是新的 `String` 对象, 而操作对象的原字符串不会改变:

```kotlin
fun main() {
//sampleStart
    val str = "abcd"

    // 创建一个新的 String 对象, 并打印
    println(str.uppercase())
    // 输出结果为: ABCD

    // 原字符串保持原来的值不变
    println(str)
    // 输出结果为: abcd
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要拼接字符串, 可以使用 `+` 操作符. 这个操作符也可以将字符串与其他数据类型的值拼接起来, 只要表达式中的第一个元素是字符串类型:

```kotlin
fun main() {
//sampleStart
    val s = "abc" + 1
    println(s + "def")
    // 输出结果为: abc1def
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 大多数情况下, 字符串拼接处理应该使用 [字符串模板](#string-templates) 或 [多行字符串(Multiline String)](#multiline-strings).
>
{style="note"}

## 字符串的字面值(literal) {id="string-literals"}

Kotlin 中存在两种字符串字面值:

* [转义(Escaped)字符串](#escaped-strings)
* [多行(Multiline)字符串](#multiline-strings)

### 转义(Escaped)字符串 {id="escaped-strings"}

_转义(Escaped)字符串_ 可以包含转义字符.
转义字符串的示例如下:

```kotlin
val s = "Hello, world!\n"
```

转义字符使用通常的反斜线(`\`)方式表示.
关于 Kotlin 支持的转义字符, 请参见 [字符](characters.md).

### 多行(Multiline)字符串 {id="multiline-strings"}

_多行(Multiline)字符串_ 可以包含换行符和任意文本.
由三重引号表示(`"""`), 其内容不转义, 可以包含换行符和任意字符:

```kotlin
val text = """
    for (c in "foo")
        print(c)
    """
```

要删除多行字符串的前导空白(leading whitespace), 可以使用 [`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 函数:

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

默认情况下, 会使用管道符号 `|` 作为前导空白的标记前缀, 但你可以通过参数指定使用其它字符, 比如 `trimMargin(">")`.

## 字符串模板 {id="string-templates"}

字符串字面值内可以包含 _模板表达式_, 它是一小段代码, 会被执行, 其计算结果将被拼接为字符串内容的一部分.
在处理模板中的表达式时, Kotlin 会自动对表达式的计算结果调用 `.toString()` 函数, 将它转换为字符串.
模板表达式以 `$` 符号开始, `$` 符号之后可以是一个变量名:

```kotlin
fun main() {
//sampleStart
    val i = 10
    println("i = $i")
    // 输出结果为: i = 10

    val letters = listOf("a","b","c","d","e")
    println("Letters: $letters")
    // 输出结果为: Letters: [a, b, c, d, e]

//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`$` 符号之后也可以是表达式, 由大括号括起:

```kotlin
fun main() {
//sampleStart
    val s = "abc"
    println("$s.length is ${s.length}")
    // 输出结果为: abc.length is 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

在多行字符串(Multiline String)和转义字符串(Escaped String)中都可以使用模板.
但是, 多行字符串不支持反斜线转义表达方式.
如果要在多行字符串中的任何可以用作 [标识符](https://kotlinlang.org/docs/reference/grammar.html#identifiers) 开始字符的符号之前插入美元符号 `$` 本身, 请使用以下语法:

```kotlin
val price = """
${'$'}_9.99
"""
```

> 要在字符串中避免使用 `${'$'}` 这样的序列, 你可以使用实验性的 [多 $ 符号字符串插值功能](#multi-dollar-string-interpolation).
>
{style="note"}

### 多 `$` 符号字符串插值(Interpolation) {id="multi-dollar-string-interpolation"}

> 多 `$` 符号字符串插值是 [实验性功能](components-stability.md#stability-levels-explained),
> 需要使用者同意(Opt-in) (详情见下文).
>
> 它随时有可能变更.
> 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-2425) 提供你的反馈意见.
>
{style="warning"}

通过多 `$` 符号字符串插值, 你可以指定需要多少个连续的 `$` 符号才会触发插值(Interpolation).
插值是指将变量或表达式直接嵌入到字符串中的过程.

尽管对单行字符串你可以使用 [转义字符串字面值](#escaped-strings),
但 Kotlin 中的多行字符串不支持反斜线转义表达方式.
要将美元符号 (`$`) 用作字面值, 你必须使用 `${'$'}` 结构来防止发生字符串插值.
这个方法会让代码难以阅读, 尤其是字符串包含多个 `$` 符号的情况.

多 `$` 符号字符串插值功能会简化这个问题,
它允许你在单行和多行字符串中将 `$` 符号用作字面值.
例如:

```kotlin
val KClass<*>.jsonSchema : String
    get() = $$"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta"
      "title": "$${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

这里, `$$` 前缀规定需要 2 个连续的 `$` 符号才会触发字符串插值.
单个 `$` 符号会作为字面值.

你可以调整使用多少个 `$` 符号来触发插值.
例如, 使用 3 个连续的 `$` 符号 (`$$$`) 可以让 `$` 和 `$$` 都作为字面值,
使用 `$$$` 来启用插值:

```kotlin
val productName = "carrot"
val requestedData =
    $$$"""{
      "currency": "$",
      "enteredAmount": "42.45 $$",
      "$$serviceField": "none",
      "product": "$$$productName"
    }
    """

println(requestedData)
// 输出结果为:
//{
//    "currency": "$",
//    "enteredAmount": "42.45 $$",
//    "$$serviceField": "none",
//    "product": "carrot"
//}
```

这里, `$$$` 前缀允许字符串中包含 `$` 和 `$$`, 而不需要使用 `${'$'}` 结构进行转义.

要启用这个功能, 请在命令行中使用以下编译器选项:

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

或者, 更新你的 Gradle 构建文件中的 `compilerOptions {}` 代码块:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

这个功能不会影响既有的, 使用单个 `$` 符号字符串插值的代码.
你可以继续和以前一样使用单个 `$`, 然后在需要在字符串中处理 `$` 符号字面值时, 使用多个 `$` 符号.

## 字符串格式化 {id="string-formatting"}

> 使用 `String.format()` 函数进行字符串格式化, 只能用于 Kotlin/JVM 平台.
>
{style="note"}

如果要按照你的需求来格式化一个字符串, 可以使用
[`String.format()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/format.html)
函数.

`String.format()` 函数接受一个格式字符串, 以及一个或多个参数.
格式字符串对每个参数包含一个占位符(通过 `%` 表达), 之后是格式说明符.
格式说明符是针对对应参数的格式指令, 由符号, 宽度, 精度以及转换类型组成.
总的来说, 格式说明符决定了输出的格式.
通用的格式说明符包括: `%d` 用于整数, `%f` 用于浮点数, 以及 `%s` 用于字符串.
你还可以使用 `argument_index$` 语法, 在格式字符串中, 使用不同的格式多次引用同一个参数.

> 关于格式字符串的详细解释, 以及它的完整列表, 请参见 [Java Formatter 类的文档](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#summary).
>
{style="note"}

我们来看一个示例程序:

```kotlin
fun main() {
//sampleStart
    // 格式化 1 个整数, 添加前导的 0, 使结果长度为 7 个字符
    val integerNumber = String.format("%07d", 31416)
    println(integerNumber)
    // 输出结果为: 0031416

    // 格式化 1 个浮点数, 显示正负号, 保留 4 位小数
    val floatNumber = String.format("%+.4f", 3.141592)
    println(floatNumber)
    // 输出结果为: +3.1416

    // 格式化 2 个字符串, 显示为大写文字, 每个字符串使用一个占位符
    val helloString = String.format("%S %S", "hello", "world")
    println(helloString)
    // 输出结果为: HELLO WORLD

    // 格式化 1 个负数, 包含在括号中, 然后使用 `argument_index$`, 以不同的格式输出同一个数字 (没有括号).
    val negativeNumberInParentheses = String.format("%(d means %1\$d", -31416)
    println(negativeNumberInParentheses)
    //输出结果为: (31416) means -31416
//sampleEnd
}
```
{interpolate-variables="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`String.format()` 函数提供了与字符串模板类似的功能.
但是, `String.format()` 函数的功能要更多一些, 因为可以使用更多的格式选项.

此外, 可以通过变量来指定格式字符串. 当格式字符串本身可变时, 这是很有用的功能
例如, 在根据用户的语言设定进行本地化翻译时.

使用 `String.format()` 函数时要小心, 因为在参数与对应的占位符之间, 很容易写错它们的个数或位置.
