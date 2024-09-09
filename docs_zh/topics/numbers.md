---
type: doc
layout: reference
category:
title: "数值类型"
---

# 数值类型

最终更新: {{ site.data.releases.latestDocDate }}

## 整数类型

Kotlin 提供了一组内建数据类型来表达数值.
对于整数数值, 有 4 种数据类型, 它们的大小不同, 因此表达的数值范围也不同:

|  类型   | 大小(bits)|    最小值 |  最大值    |
|--------|-----------|----------|--------- |
| `Byte`	 | 8         |-128      |127       |
| `Short`	 | 16        |-32768    |32767     |
| `Int`	 | 32        |-2,147,483,648 (-2<sup>31</sup>)| 2,147,483,647 (2<sup>31</sup> - 1)|
| `Long`	 | 64        |-9,223,372,036,854,775,808 (-2<sup>63</sup>)|9,223,372,036,854,775,807 (2<sup>63</sup> - 1)|

如果你初始化一个变量, 不明确指定类型, 编译器会自动推断类型, 使用从 `Int` 开始、足够表达这个值的最小的整数范围.
如果值没有超过 `Int` 类型的最大范围, 那么类型会推断为 `Int`. 如果超过, 那么类型将是 `Long`.
如果要明确指明一个数值是 `Long` 类型, 请在数值末尾添加 `L` 后缀.
如果明确指定类型, 编译器会检查值有没有超过指定类型的最大范围.

```kotlin
val one = 1 // Int 类型
val threeBillion = 3000000000 // Long 类型
val oneLong = 1L // Long 类型
val oneByte: Byte = 1
```

> 除整数类型外, Kotlin 还提供了无符号整数类型. 详情请参见 [无符号整数类型](unsigned-integer-types.html).
{:.tip}

## 浮点类型

对于实数数值, Kotlin 提供了符合 [IEEE 754 标准](https://en.wikipedia.org/wiki/IEEE_754) 的浮点类型 `Float` 和 `Double`.
`Float` 代表 IEEE 754 _单精度(single precision)浮点数_, 而 `Double` 代表 _双精度(double precision)浮点数_.

这两种类型的区别在于它们大小, 以及能够存储的浮点数值精度:

|  类型  | 大小(bits) |     有效位数     |   指数位数   |  十进制位数   |
|--------|-----------|--------------- |-------------|--------------|
| `Float`	 | 32        |24              |8            |6-7            |
| `Double` | 64        |53              |11           |15-16          |    

可以使用带小数部分的数值初始化 `Double` 和 `Float` 变量.
小数部分与整数部分用点号(`.`)分隔.
任何变量如果使用浮点数值初始化, 编译器推断的类型将是 `Double`:

```kotlin
val pi = 3.14 // Double 类型
// val one: Double = 1 // 编译错误: 类型不匹配
val oneDouble = 1.0 // Double 类型
```

如果要明确指明一个数值是 `Float` 类型, 请在数值末尾添加 `f` 或 `F` 后缀.
如果这个值包含 6-7 位以上的十进制数字, 这部分会被舍去:

```kotlin
val e = 2.7182818284 // Double 类型
val eFloat = 2.7182818284f // Float 类型, 实际的值将是 2.7182817
```

与其他一些语言不同, Kotlin 的数值类型没有隐式的拓宽变换.
比如, 如果函数使用 `Double` 参数, 那么只能使用 `Double` 值调用它,
而不能使用 `Float`, `Int`, 或其他数值类型的值:

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

如果要将数值转换为不同的类型, 请使用 [显式类型转换](#explicit-number-conversions).

## 数值的字面值常数(Literal Constant)

对于整数值, 有以下几种类型的字面值常数:

* 10进制数: `123`
* Long 类型需要大写的 `L` 来标识: `123L`
* 16进制数: `0x0F`
* 2进制数: `0b00001011`

> Kotlin 不支持8进制数的字面值.
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

> 除此之外, 对无符号整数类型的字面值还有特殊的标识.  
> 详情请参见 [无符号整数类型的字面值](unsigned-integer-types.html).
{:.tip}

## 数值类型在 JVM 平台的内部表达

在 JVM 平台中, 数值的存储使用基本类型: `int`, `double`, 等等.
除非你创建一个可为 null 的数值引用, 比如 `Int?`, 或使用泛型.
这种情况下数值会被装箱(box)为 Java 类 `Integer`, `Double`, 等等.

可为 null 的数值引用即使指向相同的数值, 也可能指向不同的对象:

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

## 显式数值类型转换

由于数据类型内部表达方式的差异, 较小的数据类型 _不是较大数据类型的子类型(subtype)_.
如果小数据类型是大数据类型的子类型, 那么我们将会遇到以下问题:

```kotlin
// 以下为假想代码, 实际上是无法编译的:
val a: Int? = 1 // 装箱后的 Int (java.lang.Integer)
val b: Long? = a // 这里进行隐式类型转换, 产生一个装箱后的 Long (java.lang.Long)
print(b == a) // 结果与你期望的相反! 这句代码打印的结果将是 "false", 因为 Long 的 equals() 方法会检查比较对象, 要求对方也是一个 Long 对象
```

这样, 不仅不能保持同一性(identity), 而且还静悄悄地失去了内容相等性(equality).

由于存在以上问题, Kotlin 中较小的数据类型  _不会隐式地转换为_ 较大的数据类型.
也就是说, 要将一个 `Byte` 类型值赋给一个 `Int` 类型的变量需要进行显式类型转换:

```kotlin
val b: Byte = 1 // 这是 OK 的, 因为编译器会对字面值进行静态检查
// val i: Int = b // 编译错误
val i1: Int = b.toInt()
```

所有的数值类型都可以转换为其他类型:

* `toByte(): Byte`
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`

大多数情况下并不需要明确的的类型转换, 因为类型可以通过代码上下文自动推断得到,
而且数学运算符都进行了重载(overload), 可以适应各种数值类型的参数, 比如:

```kotlin
val l = 1L + 3 // Long 类型 + Int 类型, 结果为 Long 类型
```

## 数值类型的运算符(Operation)

Kotlin 对数值类型支持标准的数学运算符(operation): `+`, `-`, `*`, `/`, `%`.
这些运算符定义为相应的数值类上的成员函数:

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

### 整数除法

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

对任何两种整数类型之间的除法都是如此:

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

如果要返回浮点类型的结果, 需要将其中一个操作数显式转换为浮点类型:

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

### 位运算符

Kotlin 对整数值提供了一组 _位运算符_. 这些运算符直接对数值的二进制表达的位(bit)进行操作.
位运算符表达为函数, 可以通过中缀表示法调用. 只能用于 `Int` 和 `Long`:

```kotlin
val x = (1 shl 2) and 0x000FF000
```

以下是位运算符的完整列表:

* `shl(bits)` – 带符号左移
* `shr(bits)` – 带符号右移
* `ushr(bits)` – 无符号右移
* `and(bits)` – 按位与(**AND**)
* `or(bits)` – 按位或(**OR**)
* `xor(bits)` – 按位异或(**XOR**)
* `inv()` – 按位取反

### 浮点值的比较

本节我们讨论的浮点值操作包括:

* 相等判断: `a == b` 以及 `a != b`
* 比较操作符: `a < b`, `a > b`, `a <= b`, `a >= b`
* 浮点值范围(Range) 的创建, 以及范围检查: `a..b`, `x in a..b`, `x !in a..b`

如果操作数 `a` 和 `b` 的类型能够静态地判定为 `Float` 或 `Double`(或者可为 null 值的 `Float?` 或 `Double?`),
(比如, 类型明确声明为浮点值, 或者由编译器推断为浮点值, 或者通过[智能类型转换](typecasts.html#smart-casts)变为浮点值),
那么此时对这些数值, 或由这些数值构成的范围的操作, 将遵循 [IEEE 754 浮点数值运算标准](https://en.wikipedia.org/wiki/IEEE_754).

但是, 为了支持使用泛型的情况, 并且支持完整的排序功能, 如果操作数 **不能** 静态地判定为浮点值类型, 那么判定结果会不同.
例如, `Any`, `Comparable<...>`, 或 `Collection<T>` 类型.
对于这样的情况, 对这些浮点值的操作将使用 `Float` 和 `Double` 类中实现的 `equals` 和 `compareTo` 方法.
因此判定结果是:

* `NaN` 会被判定为等于它自己
* `NaN` 会被判定为大于任何其他数值, 包括正无穷大(`POSITIVE_INFINITY`)
* `-0.0` 会被判定为小于 `0.0`

下面是一段的示例程序, 演示静态地判定为浮点值类型的操作数(`Double.NaN`)
与 **不能** 静态地判定为浮点值类型的操作数 (`listOf(T)`) 之间的动作差别.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
    //sampleStart
    // 操作数静态地判定为浮点值类型
    println(Double.NaN == Double.NaN)                 // 输出结果为 false
    // 操作数 不能 静态地判定为浮点值类型
    // 因此 NaN 等于它自己
    println(listOf(Double.NaN) == listOf(Double.NaN)) // 输出结果为 true

    // 操作数静态地判定为浮点值类型
    println(0.0 == -0.0)                              // 输出结果为 true
    // 操作数 不能 静态地判定为浮点值类型
    // 因此 -0.0 小于 0.0
    println(listOf(0.0) == listOf(-0.0))              // 输出结果为 false

    println(listOf(Double.NaN, Double.POSITIVE_INFINITY, 0.0, -0.0).sorted())
    // 输出结果为 [-0.0, 0.0, Infinity, NaN]
    //sampleEnd
}
```

</div>
