[//]: # (title: 字符)

字符使用 `Char` 类型表达.
字符的字面值(literal)使用单引号表达: `'1'`.

> 在 JVM 平台, 字符保存为基本类型(Primitive Type): `char`, 表示一个 16 位的 Unicode 字符.
>
{style="note"}

特殊字符使用反斜线转义表达.
Kotlin 支持的转义字符包括:

* `\t` – 制表符(TAB)
* `\b` – 退格
* `\n` – 换行 (LF)
* `\r` – 回车 (CR)
* `\'` – 单引号
* `\"` – 双引号
* `\\` – 反斜线
* `\$` – 美元符号

其他任何字符, 都可以使用 Unicode 转义表达方式: `'\uFF00'`.

```kotlin
fun main() {
//sampleStart
    val aChar: Char = 'a'

    println(aChar)
    println('\n') // 打印一个额外的换行符
    println('\uFF00')
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果字符的值是数字, 可以使用 [`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html)
函数显式转换为 `Int` 值.

> 在 JVM 平台, 当需要一个可为 null 的字符引用时, 字符会被装箱(box)为 Java 类, 与 [数值类型](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine) 一样.
> 装箱操作不保持对象的同一性(identity).
>
{style="note"}
