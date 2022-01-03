---
type: doc
layout: reference
category: "Syntax"
title: "基本类型"
---

# 基本类型

本页面最终更新: 2021/10/25

在 Kotlin 中, 一切都是对象, 这就意味着, 我们可以对任何变量访问它的成员函数和属性.
有些数据类型有着特殊的内部表现形式, 比如, 数值, 字符, 布尔值在运行时可以使用 Java 的基本类型(Primitive Type)来表达,
但对于使用者来说, 它们就和通常的类一样.
本章我们将介绍 Kotlin 中使用的基本类型:
[数值](#numbers), [布尔值](#booleans), [字符](#characters), [字符串](#strings), 以及 [数组](#arrays).

## 数值

### 整数类型

Kotlin 提供了一组内建数据类型来表达数值.
对于整数数值, 有 4 种数据类型, 它们的大小不同, 因此表达的数值范围也不同.

|  类型   | 大小(bits)|    最小值 |  最大值    |
|--------|-----------|----------|--------- |
| `Byte`	 | 8         |-128      |127       |
| `Short`	 | 16        |-32768    |32767     |
| `Int`	 | 32        |-2,147,483,648 (-2<sup>31</sup>)| 2,147,483,647 (2<sup>31</sup> - 1)|
| `Long`	 | 64        |-9,223,372,036,854,775,808 (-2<sup>63</sup>)|9,223,372,036,854,775,807 (2<sup>63</sup> - 1)|

任何变量如果使用整数数值初始化, 并且数值不超过 `Int` 类型的最大范围, 那么这些变量将被推断为 `Int` 类型.
如果初始化数值超过了 `Int` 类型的最大范围, 那么类型将是 `Long`.
如果要明确指明一个数值是 `Long` 类型, 请在数值末尾添加 `L` 后缀.

```kotlin
val one = 1 // Int 类型
val threeBillion = 3000000000 // Long 类型
val oneLong = 1L // Long 类型
val oneByte: Byte = 1
```

### 浮点类型

对于实数数值, Kotlin 提供了浮点类型 `Float` 和 `Double`.
根据 [IEEE 754 标准](https://en.wikipedia.org/wiki/IEEE_754),
这两种浮点类型的区别在于他们的 _十进制位数_, 也就是说, 它们能够存储多少十进制数字.
`Float` 代表 IEEE 754 _单精度(single precision)浮点数_, 而 `Double` 代表 _双精度(double precision)浮点数_.

|  类型  | 大小(bits) |     有效位数     |   指数位数   |  十进制位数   |
|--------|-----------|--------------- |-------------|--------------|
| `Float`	 | 32        |24              |8            |6-7            |
| `Double` | 64        |53              |11           |15-16          |    

可以使用带小数部分的数值初始化 `Double` 和 `Float` 变量.
小数部分与整数部分用点号(`.`)分隔.
任何变量如果使用浮点数值初始化, 编译器推断的类型将是 `Double`.

```kotlin
val pi = 3.14 // Double 类型
// val one: Double = 1 // 编译错误: 类型不匹配
val oneDouble = 1.0 // Double 类型
```

如果要明确指明一个数值是 `Float` 类型, 请在数值末尾添加 `f` 或 `F` 后缀.
如果这个值包含 6-7 位以上的十进制数字, 这部分会被舍去.

```kotlin
val e = 2.7182818284 // Double 类型
val eFloat = 2.7182818284f // Float 类型, 实际的值将是 2.7182817
```

注意, 与其他一些语言不同, Kotlin 的数值类型没有隐式的拓宽变换.
比如, 如果函数使用 `Double` 参数, 那么只能使用 `Double` 值调用它, 而不能使用 `Float`, `Int`, 或其他数值类型的值.

```kotlin
fun main() {
    fun printDouble(d: Double) { print(d) }

    val i = 1    
    val d = 1.0
    val f = 1.0f

    printDouble(d)
//    printDouble(i) // 编译错误: 类型不匹配
//    printDouble(f) // 编译错误: 类型不匹配
}
```

如果要将数值转换为不同的类型, 请使用 [显式类型转换](#explicit-conversions).

### 字面值常数(Literal Constant)

对于整数值, 有以下几种类型的字面值常数:

* 10进制数: `123`
  * Long 类型需要大写的 `L` 来标识: `123L`
* 16进制数: `0x0F`
* 2进制数: `0b00001011`

> 不支持8进制数的字面值.
{:.note}

Kotlin 还支持传统的浮点数值表达方式:

* 无标识时默认为 Double 值: `123.5`, `123.5e10`
* Float 值需要用 `f` 或 `F` 标识: `123.5f`

你可以在数字字面值中使用下划线, 提高可读性:

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
```

### 数值类型在 JVM 平台的内部表达

在 JVM 平台中, 数值的存储使用基本类型: `int`, `double`, 等等.
除非你创建一个可为 null 的数值引用, 比如 `Int?`, 或使用泛型.
这种情况下数值会被装箱(box)为 Java 类 `Integer`, `Double`, 等等.

注意, 可为 null 的数值引用即使指向相同的数值, 也可能是不同的对象:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val a: Int = 100
    val boxedA: Int? = a
    val anotherBoxedA: Int? = a

    val b: Int = 10000
    val boxedB: Int? = b
    val anotherBoxedB: Int? = b

    println(boxedA === anotherBoxedA) // 结果为 true
    println(boxedB === anotherBoxedB) // 结果为 false
//sampleEnd
}
```

</div>

所有指向 `a` 的可为 null 的引用实际上都是同一个对象,
因为JVM 针对 `-128` 与 `127` 之间的 `Integer` 类型会进行内存优化.
但这种优化对 `b` 的引用无效, 因此这些引用是不同的对象.

但是, 对象仍然是相等的:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val b: Int = 10000
    println(b == b) // 打印结果为 'true'
    val boxedB: Int? = b
    val anotherBoxedB: Int? = b
    println(boxedB == anotherBoxedB) // 打印结果为 'true'
//sampleEnd
}
```

</div>

### 显式类型转换

由于数据类型内部表达方式的差异, 较小的数据类型 *不是较大数据类型的子类型(subtype)*.
如果小数据类型是大数据类型的子类型, 那么我们将会遇到以下问题:

```kotlin
// 以下为假想代码, 实际上是无法编译的:
val a: Int? = 1 // 装箱后的 Int (java.lang.Integer)
val b: Long? = a // 这里进行隐式类型转换, 产生一个装箱后的 Long (java.lang.Long)
print(b == a) // 结果与你期望的相反! 这句代码打印的结果将是 "false", 因为 Long 的 equals() 方法会检查比较对象, 要求对方也是一个 Long 对象
```

这样, 不仅不能保持同一性(identity), 而且还静悄悄地失去了内容相等性(equality).

由于存在以上问题, Kotlin 中较小的数据类型  _不会隐式地转换为_ 较大的数据类型.
也就是说, 要将一个 `Byte` 类型值赋给一个 `Int` 类型的变量需要进行显式类型转换.

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val b: Byte = 1 // 这是 OK 的, 因为编译器会对字面值进行静态检查
    // val i: Int = b // 编译错误
    val i1: Int = b.toInt()
//sampleEnd
}
```

</div>

所有的数值类型都可以转换为其他类型:

* `toByte(): Byte`
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`
* `toChar(): Char`

大多数情况下并不需要明确的的类型转换, 因为类型可以通过代码上下文自动推断得到,
而且数学运算符都进行了重载(overload), 可以适应各种数值类型的参数, 比如:

```kotlin
val l = 1L + 3 // Long 类型 + Int 类型, 结果为 Long 类型
```

### 运算符(Operation)

Kotlin 对数值类型支持标准的数学运算符(operation): `+`, `-`, `*`, `/`, `%`.
这些运算符定义为相应的数值类上的成员函数.

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    println(1 + 2)
    println(2_500_000_000L - 1L)
    println(3.14 * 2.71)
    println(10.0 / 3)
//sampleEnd
}
```

</div>

你也可以对自己的类覆盖这些运算符.
详情请参见 [操作符重载(Operator overloading)](operator-overloading.html).

#### 整数除法

整数值之间的除法返回的永远是整数值. 所有的小数部分都会被抛弃.

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2
    //println(x == 2.5) // 错误: 不能在 'Int' 和 'Double' 类型值之间使用 '==' 操作符
    println(x == 2)
//sampleEnd
}
```

</div>

对任何两种整数类型之间的除法都是如此.

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val x = 5L / 2
    println(x == 2L)
//sampleEnd
}
```

</div>

如果要返回浮点类型的结果, 需要将其中一个操作数显式转换为浮点类型.

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2.toDouble()
    println(x == 2.5)
//sampleEnd
}
```

</div>

#### 位运算符

Kotlin 对整数值提供了一组 _位运算符_. 这些运算符直接对数值的二进制表达的位(bit)进行操作.
位运算符表达为函数, 可以通过中缀表示法调用. 只能用于 `Int` 和 `Long`.

```kotlin
val x = (1 shl 2) and 0x000FF000
```

以下是位运算符的完整列表:

* `shl(bits)` – 带符号左移
* `shr(bits)` – 带符号右移
* `ushr(bits)` – 无符号右移
* `and(bits)` – 按位与(__and__)
* `or(bits)` – 按位或(__or__)
* `xor(bits)` – 按位异或(__xor__)
* `inv()` – 按位取反

### 浮点值的比较

本节我们讨论的浮点值操作包括:

* 相等判断: `a == b` 以及 `a != b`
* 比较操作符: `a < b`, `a > b`, `a <= b`, `a >= b`
* 浮点值范围(Range) 的创建, 以及范围检查: `a..b`, `x in a..b`, `x !in a..b`

如果操作数 `a` 和 `b` 的类型能够静态地判定为 `Float` 或 `Double`(或者可为 null 值的 `Float?` 或 `Double?`),
(比如, 类型明确声明为浮点值, 或者由编译器推断为浮点值, 或者通过[智能类型转换](typecasts.html#smart-casts)变为浮点值),
那么此时对这些数值, 或由这些数值构成的范围的操作, 将遵循 [IEEE 754 浮点数值运算标准](https://en.wikipedia.org/wiki/IEEE_754).

但是, 为了支持使用泛型的情况, 并且支持完整的排序功能, 如果操作数 **不能** 静态地判定为浮点值类型(比如. `Any`, `Comparable<...>`, 或者类型参数),
此时对这些浮点值的操作将使用 `Float` 和 `Double` 类中实现的 `equals` 和 `compareTo` 方法,
这些方法不符合 IEEE 754 浮点数值运算标准, 因此:

* `NaN` 会被判定为等于它自己
* `NaN` 会被判定为大于任何其他数值, 包括正无穷大(`POSITIVE_INFINITY`)
* `-0.0` 会被判定为小于 `0.0`


### 无符号整数

除 [整数类型](#integer-types) 外, Kotlin 还提供了以下无符号整数类型:

* `UByte`: 无符号的 8 位整数, 值范围是 0 到 255
* `UShort`: 无符号的 16 位整数, 值范围是 0 到 65535
* `UInt`: 无符号的 32 位整数, 值范围是 0 到 2^32 - 1
* `ULong`: 无符号的 64 位整数, 值范围是 0 到 2^64 - 1

无符号整数支持有符号整数的大多数运算符.

> 将无符号类型变为有符号类型 (或者反过来) 是一种 *二进制不兼容的* 变换.
{:.note}

### 无符号整数的数组和范围

> 无符号整数的数组以及对这些数组的操作目前处于 [Beta](components-stability.html) 状态.
> 随时可能发生不兼容的变化. 使用时需要明确同意(Opt-in)(详情请参见下文).
{:.note}

与基本类型相同, 每一种无符号整数类型都有一个对应的类来表示由它构成的数组:

* `UByteArray`: 无符号 byte 构成的数组
* `UShortArray`: 无符号 short 构成的数组
* `UIntArray`: 无符号 int 构成的数组
* `ULongArray`: 无符号 long 构成的数组

与有符号的整数数组类类似, 这些无符号整数的数组类提供了与 `Array` 类近似的 API, 并且不会产生数值对象装箱带来的性能损耗.

使用无符号整数数组时, 会出现编译警告, 表示这个功能还未达到稳定状态.
要消除这个警告, 请使用 `@ExperimentalUnsignedTypes` 注解, 表示你明确同意使用这个功能.
你的代码的使用者是否也需要明确同意使用你的 API, 这一点由你来决定,
但请注意, 无符号整数数组还不是稳定的功能, 因此由于语言本身的变化, 使用它们的 API 可能会出现错误.
详情请参见 [明确要求使用者同意的功能(Opt-in Requirement)](opt-in-requirements.html).

为了支持 `UInt` 和 `ULong` 类型的 [值范围与数列](ranges.html) 功能,
还提供了 `UIntRange`, `UIntProgression`, `ULongRange`, `ULongProgression` 类.


#### 无符号整数的字面值(literal)

为了无符号整数使用的便利, Kotlin 允许在整数字面值上添加后缀来表示特定的无符号类型
(与 `Float` 或 `Long` 的标记方式类似):

* `u` 和 `U` 用于标记无符号整数. 具体的无符号整数类型将根据程序此处期待的数据类型来决定.
如果未指定期待的数据类型, 编译器将根据整数值的大小来决定使用 `UInt` 或 `ULong`.

```kotlin
val b: UByte = 1u  // 字面值类型为 UByte, 因为程序指定了期待的数据类型
val s: UShort = 1u // 字面值类型为 UShort, 因为程序指定了期待的数据类型
val l: ULong = 1u  // 字面值类型为 ULong, 因为程序指定了期待的数据类型

val a1 = 42u // 字面值类型为 UInt: 因为程序未指定期待的数据类型, 而且整数值可以存入 UInt 内
val a2 = 0xFFFF_FFFF_FFFFu // 字面值类型为 ULong: 因为程序未指定期待的数据类型, 而且整数值无法存入 UInt 内
```

* `uL` 和 `UL` 将字面值明确标记为无符号的 long.

```kotlin
val a = 1UL // 字面值类型为 ULong, 即使这里未指定期待的数据类型, 而且整数值可以存入 UInt 内
```

#### 更深入地讨论

关于更多技术细节和更深入的讨论, 请参见[关于 Kotlin 语言支持无符号数据类型的建议](https://github.com/Kotlin/KEEP/blob/master/proposals/unsigned-types.md).

## 布尔值

`Boolean` 类型用来表示布尔型对象, 有两个可能的值: `true` 和 `false`.
对应的 `Boolean?` 类型还可以为 `null` 值.

布尔值的内建运算符有:

* `||` – 或运算 (逻辑 _或_)
* `&&` – 与运算 (逻辑 _与_)
* `!` - 非运算 (逻辑 _非_)

`||` 和 `&&` 会进行短路计算.


<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val myTrue: Boolean = true
    val myFalse: Boolean = false
    val boolNull: Boolean? = null

    println(myTrue || myFalse)
    println(myTrue && myFalse)
    println(!myTrue)
//sampleEnd
}
```

</div>

>**在 JVM 平台**: 可为 null 的布尔对象引用会被装箱(box), 与 [数值类型](#numbers-representation-on-the-jvm) 类似.
{:.note}

## 字符

字符使用 `Char` 类型表达.
字符的字面值(literal)使用单引号表达: `'1'`.

特殊字符使用反斜线转义表达.
Kotlin 支持的转义字符包括: `\t`, `\b`, `\n`, `\r`, `\'`, `\"`, `\\` 以及 `\$`.

其他任何字符, 都可以使用 Unicode 转义表达方式: `'\uFF00'`.

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val aChar: Char = 'a'

    println(aChar)
    println('\n') //prints an extra newline character
    println('\uFF00')
//sampleEnd
}
```

</div>


如果字符的值是数字, 可以使用 [`digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html)
函数显式转换为 `Int` 值.

>**在 JVM 平台**: 与 [数值类型](#numbers-representation-on-the-jvm) 一样, 当需要一个可为 null 的字符引用时, 字符会被装箱(box)为对象.
>装箱操作不保持对象的同一性(identity).
{:.note}

## 字符串

Kotlin 中的字符串由 `String` 类型表示.
一般来说, 字符串值是一系列字符, 用双引号(`"`)括起.

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
所有改变字符串内容的操作, 返回值都是新的 `String` 对象, 而操作对象的原字符串不会改变.

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

注意, 大多数情况下, 字符串的拼接处理应该使用 [字符串模板](#string-templates) 或 原生字符串(raw string).

### 字符串的字面值(literal)

Kotlin 中存在两种字符串字面值:
* _转义(escaped)_ 字符串, 可以包含转义字符
* _原生(raw)_ 字符串, 可以包含换行符和任意文本

转义字符串的示例如下:

```kotlin
val s = "Hello, world!\n"
```

转义字符使用通常的反斜线(`\`)方式表示. 关于 Kotlin 支持的转义字符, 请参见上文的 [字符](#characters) 小节.

原生字符串(raw string)由三重引号表示(`"""`), 其内容不转义, 可以包含换行符和任意字符:

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

默认情况下, 会使用 `|` 作为前导空白的标记前缀, 但你可以通过参数指定使用其它字符, 比如 `trimMargin(">")`.

### 字符串模板

字符串字面值内可以包含 _模板_ 表达式, 模板是一小段代码, 它会被执行, 其计算结果将被拼接为字符串内容的一部分.
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
由于原生字符串不能使用反斜线转义表达方式, 如果要在字符串中的任何符号之前插入 `$` 字符本身
(`$` 可以用作 [标识符](https://kotlinlang.org/docs/reference/grammar.html#identifiers) 的开始字符),
可以使用以下语法:

```kotlin
val price = """
${'$'}_9.99
"""
```


## 数组

Kotlin 中的数组通过 `Array` 类表达.
这个类拥有 `get` 和 `set` 函数, 这些函数通过运算符重载转换为 `[]` 运算符,
此外还有 `size` 属性, 以及其他一些有用的成员函数:

```kotlin
class Array<T> private constructor() {
    val size: Int
    operator fun get(index: Int): T
    operator fun set(index: Int, value: T): Unit

    operator fun iterator(): Iterator<T>
    // ...
}
```

要创建一个数组, 可以使用 `arrayOf()` 函数, 并向这个函数传递一些参数来指定数组元素的值,
所以 `arrayOf(1, 2, 3)` 将创建一个数组, 其中的元素为 `[1, 2, 3]`.
或者, 也可以使用 `arrayOfNulls()` 函数来创建一个指定长度的数组, 其中的元素全部为 `null` 值.

另一种方案是使用 `Array` 构造函数, 第一个参数为数组大小, 第二个参数是另一个函数,
这个函数接受数组元素下标作为自己的输入参数, 然后返回这个下标对应的数组元素值:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    // 创建一个 Array<String>, 其中的元素为 ["0", "1", "4", "9", "16"]
    val asc = Array(5) { i -> (i * i).toString() }
    asc.forEach { println(it) }
//sampleEnd
}
```

</div>

我们在前面提到过, `[]` 运算符可以用来调用数组的成员函数 `get()` 和 `set()`.

Kotlin 中数组的类型是 _不可变的_ .
所以 Kotlin 不允许将一个 `Array<String>` 赋值给一个 `Array<Any>`,
否则可能会导致运行时错误(但你可以使用 `Array<out Any>`,
参见 [类型投射](generics.html#type-projections)).

### 基本数据类型的数组

Kotlin 中也有类来表达基本数据类型的数组: `ByteArray`, `ShortArray`, `IntArray` 等等,
这些数组可以避免数值对象装箱带来的性能损耗.
这些类与 `Array` 类之间不存在继承关系, 但它们的方法和属性是一致的.
各个基本数据类型的数组类都有对应的工厂函数:

```kotlin
val x: IntArray = intArrayOf(1, 2, 3)
x[0] = x[1] + x[2]
```

```kotlin
// 长度为 5 的 int 数组, 元素值为 [0, 0, 0, 0, 0]
val arr = IntArray(5)

// 示例, 使用常数初始化数组元素值
// 长度为 5 的 int 数组, 元素值为 [42, 42, 42, 42, 42]
val arr = IntArray(5) { 42 }

// 示例. 使用 lambda 函数初始化数组元素值
// 长度为 5 的 int 数组, 元素值为 [0, 1, 2, 3, 4] (元素值使用其下标值)
var arr = IntArray(5) { it * 1 }
```
