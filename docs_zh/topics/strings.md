[//]: # (title: 字符串)

最终更新: %latestDocDate%

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
    // 输出结果为 ABCD
   
    // 原字符串保持原来的值不变
    println(str) 
    // 输出结果为 abcd
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
    // 输出结果为 abc1def
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 大多数情况下, 字符串拼接处理应该使用 [字符串模板](#string-templates) 或 [多行字符串(Multiline String)](#multiline-strings).
>
{style="note"}

## 字符串的字面值(literal)

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
模板表达式以 `$` 符号开始, `$` 符号之后可以是一个变量名:

```kotlin
fun main() {
//sampleStart
    val i = 10
    println("i = $i")
    // 输出结果为 i = 10
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
    // 输出结果为 abc.length is 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

在多行字符串(Multiline String)和转义字符串(Escaped String)中都可以使用模板.
由于多行字符串不能使用反斜线转义表达方式, 如果要在字符串中的任何符号之前插入美元符号 `$` 本身
(`$` 可以用作 [标识符](https://kotlinlang.org/docs/reference/grammar.html#identifiers) 的开始字符),
可以使用以下语法:

```kotlin
val price = """
${'$'}_9.99
"""
```

## 字符串格式化

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
    // 输出结果为 0031416

    // 格式化 1 个浮点数, 显示正负号, 保留 4 位小数
    val floatNumber = String.format("%+.4f", 3.141592)
    println(floatNumber)
    // 输出结果为 +3.1416

    // 格式化 2 个字符串, 显示为大写文字, 每个字符串使用一个占位符
    val helloString = String.format("%S %S", "hello", "world")
    println(helloString)
    // 输出结果为 HELLO WORLD

    // 格式化 1 个负数, 包含在括号中, 然后使用 `argument_index$`, 以不同的格式输出同一个数字 (没有括号).
    val negativeNumberInParentheses = String.format("%(d means %1\$d", -31416)
    println(negativeNumberInParentheses)
    //输出结果为 (31416) means -31416
//sampleEnd
}
```
{interpolate-variables="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`String.format()` 函数提供了与字符串模板类似的功能.
但是, `String.format()` 函数的功能要更多一些, 因为可以使用更多的格式选项.

此外, 可以通过变量来指定格式字符串. 当格式字符串本身可变时, 这是很有用的功能
例如, 在根据用户的语言设定进行本地化翻译时.

使用 `String.format()` 函数时要小心, 因为在参数与对应的占位符之间, 很容易写错它们的个数或位置.
