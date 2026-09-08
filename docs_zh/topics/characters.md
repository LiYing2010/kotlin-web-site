[//]: # (title: 字符)
[//]: # (description: 学习在 Kotlin 中如何使用 Char 类型, 包括语法, Unicode 支持, 转义序列, 以及常见的字符操作.)

[`Char`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-char/) 类型使用 1 个 UTF-16 码元(Code Unit), 表示单个字符.

`Char` 用于表示单个字符值, 例如字母, 数字, 标点符号, 或空白字符.
对于字符序列, 请使用 [`String`](strings.md).

> `Char` 不是数值类型, 但每个字符都有一个数值型的 Unicode 值, 可以读取这个值.
> 详情请参见 [](#character-conversion).
>
{style="tip"}

## 语法 {id="syntax"}

要声明一个字符, 请将值用单引号 (`' '`) 括起.
可以显式指定 `Char` 类型, 也可以让 Kotlin 从值中推断类型:

```kotlin
val letter: Char = 'a'

// Kotlin 推断类型为 Char, 因为值用单引号表达
val digit = '1'
val symbol = '!'
val space = ' '
val separator = ':'
```

字符字面值(literal)必须包含恰好一个字符. 否则 Kotlin 编译器会报告错误:

```kotlin
val invalid = 'AB' // 错误
val invalidEmpty = '' // 错误
```
{validate="false"}

### 可为 null 的值 {id="nullable-values"}

要存储可为 null 的值, 请使用 `Char?`:

```kotlin
val maybeAbsent: Char? = null
```

> 在 JVM 平台, 可为 null 的 `Char` 值会在需要的时候被装箱(box).
> 与 [数值类型](numbers.md#boxing-and-caching-numbers-on-the-jvm) 相同.
>
{style="note"}

## Unicode 支持 {id="unicode-support"}

Kotlin 将 `Char` 值表示为 UTF-16 码元(Code Unit).
也就是说, 单个 `Char` 存储 1 个 UTF-16 码元(Code Unit), 不一定是一个完整的 Unicode 字符.

### 基本多语言平面(Basic Multilingual Plane) {id="basic-multilingual-plane"}

单个 `Char` 能够存储从 `\u0000` 到 `\uFFFF` 范围内的值.
这个范围覆盖了基本多语言平面(Basic Multilingual Plane, BMP),
包括几乎所有现代语言的字符, 以及大量的符号.

要通过 Unicode 值指定字符, 请使用 `\u`, 加上来自
[Unicode 表](https://www.unicode.org/charts/) 的 4 位 16 进制值:

```kotlin
val unicodeNumber = '\u0031' // 等于 '1'
```

### 补充字符 {id="supplementary-characters"}

基本多语言平面(Basic Multilingual Plane) 范围之外的 Unicode 字符, 例如表情符号和一些历史文字, 无法用单个 `Char` 表示.
在 UTF-16 中, 它们被编码为 _代理对(Surrogate Pair)_,
也就是在 `String` 中, 使用 2 个 `Char` 值, 共同表示 1 个 Unicode 字符:

```kotlin
fun main() {
//sampleStart
    val emoji = "🥦"

    println(emoji.length)
    // 输出结果为: 2
    println(emoji[0])
    // 输出结果为: 第 1 个代理字符
    println(emoji[1])
    // 输出结果为: 第 2 个代理字符
//sampleEnd
}
```

> 要单独处理 32 位符号, 请使用存储为 `Int` 值的 Unicode 码位(Code Point).
>
{style="tip"}

## 转义序列 {id="escape-sequences"}

对于难以直接在源代码中写出, 或具有特殊含义的特殊字符, 请使用转义序列.

每个转义序列以反斜线 (`\`) 开头.

| **支持的转义序列** | **描述**                  |
|-------------|-------------------------|
| `\t`        | 制表符(Tab)                |
| `\b`        | 退格(Backspace)           |
| `\n`        | 换行(New Line, LF)        |
| `\r`        | 回车(Carriage Return, CR) |
| `\'`        | 单引号(`'`)                |
| `\"`        | 双引号(`"`)                |
| `\\`        | 反斜线(`\`)                |
| `\$`        | 美元符号(`$`)               |

例如:

```kotlin
val newLine = '\n'
val dollar = '\$'
val backslash = '\\'
```

## 操作 {id="operations"}

`Char` 支持比较, 检查, 大小写转换, 以及显式数值转换.

### 字符比较 {id="character-comparison"}

要比较 `Char` 值, 请使用标准的 [比较运算符](keyword-reference.md#operators-and-special-symbols),
例如 `==`, `!=`, `<`, `>`, `<=` 和 `>=`.

Kotlin 按照字符的数值型 Unicode 值进行比较, 并返回 `Boolean` 值:

```kotlin
val before = 'a' < 'b' // 结果为: true
val after = 'c' > 'd' // 结果为: false
val different = 'A' == 'a' // 结果为: false
val equal = 'A' == 'A' // 结果为: true
```

### 字符处理 {id="character-processing"}

Kotlin 提供了用于字符值检查和大小写转换的函数. 例如:

```kotlin
fun main() {
//sampleStart
    val myChar = 'A'
    // 检查字符是否表示数字
    println(myChar.isDigit())
    // 输出结果为: false
    // 检查字符是否表示大写字母
    println(myChar.isUpperCase())
    // 输出结果为: true
    // 返回小写版本
    println(myChar.lowercaseChar())
    // 输出结果为: 'a'
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 更多可用的函数, 请参见
> [API 参考文档](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-char/).
>
{style="note"}

### 字符的算术运算 {id="character-arithmetic"}

可以对字符加减一个整数值, 来得到另一个字符值:

```kotlin
fun main() {
//sampleStart
    val a = 'a'

    println(a + 1)
    // 输出结果为: b
    println(a + 2)
    // 输出结果为: c
    println(a - 32)
    // 输出结果为: A
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 这些操作遵循 Unicode 值, 而非特定语言的字母规则.
>
{style="note"}

对可变变量, 也可以使用递增 (`++`) 和递减 (`--`) 运算符的前缀和后缀形式:

```kotlin
fun main() {
//sampleStart
    var a = 'A'

    a += 10
    println(a)
    // 输出结果为: 'K'

    println(++a)
    // 输出结果为: 'L'  前缀递增
    println(a++)
    // 输出结果为: 'L'  后缀递增
    println(a)
    // 输出结果为: 'M'

    println(--a)
    // 输出结果为: 'L'  前缀递减
    println(a--)
    // 输出结果为: 'L'  后缀递减
    println(a)
    // 输出结果为: 'K'
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 字符转换 {id="character-conversion"}

要将 `Char` 转换为数值类型, 请使用显式转换:

* 使用 `.code` 得到字符的数值型 Unicode 值:

  ```kotlin
  fun main() {
  //sampleStart
      val letter = 'A'
      println(letter.code)
      // 输出结果为: 65
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

* 如果字符表示 10 进制数字, 请使用 `digitToInt()`:
  ```kotlin
  fun main() {
  //sampleStart
      val digit = '7'
      println(digit.digitToInt())
      // 输出结果为: 7
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

  > 如果字符有可能不是有效的数字, 请使用 `digitToIntOrNull()`.
  >
  {style="tip"}
