[//]: # (title: 数值类型)
[//]: # (description: 学习如何在 Kotlin 中使用数值, 包括数值类型, 字面值, 类型转换, 算术运算, 溢出, 以及 JVM 相关的行为.)

Kotlin 的数值类型表示:
* 整数值 ([Byte](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-byte/),
  [Short](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-short/),
  [Int](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-int/),
  以及 [Long](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-long/))
* 浮点值 ([Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/)
  以及 [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/))

使用数值类型来存储和处理数值数据, 例如算术运算, 计数器, 测量值, 以及其他计算.

## 选择数值类型 {id="choose-a-number-type"}

在大多数情况下, 可以参考以下规则, 为你的任务确定正确的数值类型:

* 对整数使用 `Int`.
* 对超出 `Int` 范围的整数使用 `Long`.
* 对小数使用 `Double`.
* 当可以接受或需要较低精度时使用 `Float`.
* 当 API 或数据格式要求时使用 `Byte` 和 `Short`.

> Kotlin 还提供了 Beta 功能的 [无符号整数类型](unsigned-integer-types.md).
>
{style="tip"}

## 整数类型 {id="integer-types"}

Kotlin 提供了 4 种整数类型, 有着不同的大小和数值范围:

| 类型      | 大小(bits) | 最小值                                          | 最大值                                            |
|---------|----------|----------------------------------------------|------------------------------------------------|
| `Byte`  | 8        | -128                                         | 127                                            |
| `Short` | 16       | -32768                                       | 32767                                          |
| `Int`   | 32       | -2,147,483,648 (-2<sup>31</sup>)             | 2,147,483,647 (2<sup>31</sup> - 1)             |
| `Long`  | 64       | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |

### 声明整数值 {id="declare-integer-values"}

Kotlin 对整数值支持以下字面值(literal)形式:

* 10 进制数: `123`
* 16 进制数: `0x0F`
* 2 进制数: `0b00001011`

> Kotlin 不支持 8 进制数的字面值.
>
{style="note"}

要声明一个数值, 请明确指定类型:

```kotlin
val one: Int = 1

// 使用下划线提高可读性
val oneBillion: Long = 1_000_000_000
val hexBytes: Int = 0x7F_EC_DE_5E
val bytes: Int = 0b01010010_01101001_10010100_10010010

val oneByte: Byte = 1
val oneShort: Short = 1
```

也可以添加 `L` 后缀, 声明一个 `Long` 类型的值:

```kotlin
val oneLong = 1L
```

当你明确声明数值类型时, 编译器会检查值是否在该类型的范围内:

```kotlin
// 值在 Byte 范围内
val oneByte: Byte = 1

// 错误: 值不在 Byte 范围内
val tooBig: Byte = 128
```

当你没有指定数值类型时, 如果值在 `Int` 范围内, Kotlin 推断类型为 `Int`. 否则推断类型为 `Long`:

```kotlin
val million = 1_000_000 // Int 类型
val threeBillion = 3_000_000_000 // Long 类型
```

如果值可以为空, 请使用可为 null 的类型:

```kotlin
val maybeAbsent: Int? = null
```

## 浮点类型 {id="floating-point-types"}

对于带小数部分的数值, Kotlin 提供了 `Float` 和 `Double` 类型.

浮点类型遵循 [IEEE 754 标准](https://en.wikipedia.org/wiki/IEEE_754).
`Float` 代表 _单精度(Single Precision)_. `Double` 代表 _双精度(Double Precision)_.

浮点类型的大小和精度有所不同:

| 类型       | 大小(bits) | 有效位数 | 指数位数 | 十进制位数 |
|----------|----------|------|------|-------|
| `Float`  | 32       | 24   | 8    | 6-7   |
| `Double` | 64       | 53   | 11   | 15-16 |

### 声明浮点值 {id="declare-floating-point-values"}

要声明浮点数字面值, 请包含小数点 (`.`), 或使用指数表示法:

```kotlin
val pi = 3.14
val avogadro = 6.02214076e23
```

默认情况下, Kotlin 将浮点数字面值推断为 `Double`.
要声明 `Float`, 请添加 `f` 或 `F` 后缀:

```kotlin
val pi = 3.14 // Double 类型
val eFloat = 2.7182817f // Float 类型
```

> 如果 `Float` 字面值包含的精度超过 `Float` 所能存储的范围, Kotlin 会对其进行舍入.
>
{style="note"}

如果值可以为空, 请使用可为 null 的类型:

```kotlin
val maybeAbsent: Double? = null
```

## 算术运算 {id="arithmetic-operations"}

Kotlin 对数值支持标准的算术运算: `+`, `-`, `*`, `/`, 以及 `%`.

使用这些运算符来进行常见的计算:

```kotlin
fun main() {
//sampleStart
    println(1 + 2)
    // 输出结果为: 3
    println(2_500_000_000L - 1L)
    // 输出结果为: 2499999999
    println(3.14 * 2.71)
    // 输出结果为: 8.5094
    println(10.0 / 3)
    // 输出结果为: 3.3333333333333335
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

结果类型取决于操作数的类型. 详情请参见 [](#mixed-numeric-expressions).

> 你可以在自定义数值类中重载这些运算符.
> 详情请参见 [运算符重载(Operator overloading)](operator-overloading.md).
>
{style="tip"}

### 整数除法 {id="integer-division"}

整数值之间的除法返回的永远是整数结果. 编译器会舍弃小数部分:

```kotlin
fun main() {
//sampleStart
    val intValue = 5 / 2
    println(intValue)
    // 输出结果为: 2

    val longValue = 5L / 2
    println(longValue)
    // 输出结果为: 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要返回浮点结果, 请将至少一个操作数转换为 `Float` 或 `Double`:

```kotlin
fun main() {
//sampleStart
    val a = 5 / 2.0
    println(a)
    // 输出结果为: 2.5

    val b = 5 / 2.toDouble()
    println(b)
    // 输出结果为: 2.5
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 类型转换 {id="type-conversion"}

数值类型互相之间不是子类型(subtype).
Kotlin 要求明确的转换, 以免在不知情的情况下丢失数据, 或发生预想之外的行为.

例如, 期望 `Double` 类型的函数, 如果不进行转换, 不能接受 `Int` 或 `Float` 值:

```kotlin
fun main() {
//sampleStart
    fun printDouble(x: Double) {
        print(x)
    }

    val x = 1.0
    val xInt = 1
    val xFloat = 1.0f
    val one: Double = 1 // 错误: 初始值类型不匹配

    printDouble(x) // OK
    printDouble(xInt) // 错误: 参数类型不匹配
    printDouble(xFloat) // 错误: 参数类型不匹配
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

所有的数值类型都支持转换为其他数值类型.
要将数值转换为其他类型, 请使用明确转换的函数:

* `toByte()`
* `toShort()`
* `toInt()`
* `toLong()`
* `toFloat()`
* `toDouble()`

例如, 以下代码将 `Int` 值转换为 `Double`:

```kotlin
fun main() {
//sampleStart
    val intValue: Int = 1
    val doubleValue = intValue.toDouble()

    println(doubleValue)
    // 输出结果为: 1.0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

将浮点值转换为整数类型时, 编译器会舍弃小数部分:

```kotlin
fun main() {
//sampleStart
    val d: Double = 1.5
    val l: Long = d.toLong()

    println(l)
    // 输出结果为: 1
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 混合数值表达式 {id="mixed-numeric-expressions"}

Kotlin 不支持对赋值语句或函数参数进行隐式类型转换.
但是, 你可以在算术表达式中组合不同的数值类型.
在这种情况下, Kotlin 根据操作数类型确定结果类型, 算术运算符会自动处理转换:

```kotlin
val intNumber: Int = 1
val longNumber: Long = 1000
val result = intNumber + longNumber // 结果为: 1001, Long 类型
```

如果你尝试将结果赋给较小的类型, 编译器会报告错误:

```kotlin
val intNumber: Int = 1
val longNumber: Long = 1000
val result: Int = intNumber + longNumber
// 错误: 初始值类型不匹配
```

## 数据溢出 {id="data-overflow"}

数值类型只能表示其定义范围内的值.

如果运算结果超出该范围, 就会发生溢出.
如果将值转换为较小的数值类型, 转换后的值可能无法保留原来的数值.

即使编译器允许这样的代码, 这种行为也可能影响你的代码的运行结果.

### 运算中的溢出 {id="overflow-in-operations"}

每种整数类型只能存储其定义范围内的值.
当算术运算的结果超过该范围时, 就会发生_数据溢出_:

```kotlin
fun main(){
//sampleStart
    val intNumber: Int = 2147483647
    // Int 的最大值是 2147483647
    println(intNumber + 1)
    // 输出结果为: -2147483648
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

这里, 结果发生了回绕(wrap around), 因为值超过了 `Int` 的表达范围.

> 当发生整数溢出时, 编译器不会自动产生错误.
>
{style="note"}

### 取反中的溢出 {id="overflow-in-negation"}

取反操作也可能发生溢出.
例如, `Int.MIN_VALUE` 的正数对应值, 无法用 `Int` 表示.

```kotlin
fun main(){
//sampleStart
    val min = Int.MIN_VALUE
    println(-min)
    // 输出结果为: -2147483648
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 窄化转换 {id="narrowing-conversions"}

当你将值转换为较小的整数类型时, 结果可能无法保留原来的数值:

```kotlin
fun main() {
//sampleStart
    val large: Int = 130
    val narrowed: Byte = large.toByte()

    println(narrowed)
    // 输出结果为: -126
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

但是, 由于浮点类型遵循 [IEEE 754 标准](https://en.wikipedia.org/wiki/IEEE_754),
非常大的结果可能变为 `Infinity`:

```kotlin
fun main() {
//sampleStart
    println(Double.MAX_VALUE * 2)
    // 输出结果为: Infinity
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 位运算 {id="bitwise-operations"}

Kotlin 为 `Int` 和 `Long` 提供了 _位运算_.
这些运算由一组 [中缀函数](functions.md#infix-notation) 和 `inv()` 表示.

```kotlin
fun main() {
//sampleStart
    val x = 1

    println(x shl 2)
    // 输出结果为: 4
    println(x and 0x000FF000)
    // 输出结果为: 0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

位运算包括:

* `shl()` – 带符号左移
* `shr()` – 带符号右移
* `ushr()` – 无符号右移
* `and()` – 按位与(AND)
* `or()` – 按位或(OR)
* `xor()` – 按位异或(XOR)
* `inv()` – 按位取反

## 浮点值的比较 {id="floating-point-number-comparison"}

在 Kotlin 中, 浮点数的比较取决于操作数的静态类型.

当操作数静态的判定为 `Float` 或 `Double` 类型时,
对这些数值的操作以及由它们构成的范围, 将遵循 [IEEE 754 浮点数值运算标准](https://en.wikipedia.org/wiki/IEEE_754).

但是, 在使用泛型的情况下 (例如 `Any`, `Comparable<...>`, 或 `Collection<T>`),
对于没有静态的判定为浮点值类型的操作数, 行为有所不同.
在这种情况下, Kotlin 使用 `Float` 和 `Double` 的 `equals()` 和 `compareTo()` 实现.

因此判定结果是:

* `NaN` 会被判定为等于它自己
* `NaN` 会被判定为大于任何其他数值, 包括正无穷大(`POSITIVE_INFINITY`)
* `-0.0` 会被判定为小于 `0.0`

以下示例演示静态的判定为浮点值类型的操作数, 与通过泛型类型使用的操作数之间的差别:

```kotlin
//sampleStart
fun generalizedEquals(a: Any, b: Any): Boolean {
    return a == b
}

fun main() {
    // 操作数静态的判定为浮点值类型
    println(Double.NaN == Double.NaN)
    // 输出结果为: false
    println(0.0 == -0.0)
    // 输出结果为: true

    // 操作数通过非浮点静态类型使用
    println(generalizedEquals(Double.NaN, Double.NaN))
    // 输出结果为: true
    println(generalizedEquals(0.0, -0.0))
    // 输出结果为: false
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-numbers-floating-comp"}

## JVM 上数值的装箱(Box)和缓存 {id="boxing-and-caching-numbers-on-the-jvm"}

在 JVM 平台, 非 null 的数值通常使用基本类型存储, 例如 `int`, `long`, 或 `double`.
但是, 当你使用 [泛型](generics.md), 或可为 null 的数值类型(例如 `Int?`) 时,
值会被装箱(box), 并以对象的形式表示.

JVM 通过缓存小数值的装箱表示, 使用一种 [内存优化技术](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7).
因此, 具有相同值的装箱数值, 可以是 [引用相等的](equality.md#referential-equality).

例如, JVM 缓存了 `-128` 到 `127` 范围内的装箱 `Integer` 值.
因此, 以下代码返回 `true`:

```kotlin
fun main() {
//sampleStart
    val score: Int = 100
    val savedScore: Int? = score
    val displayedScore: Int? = score

    println(savedScore === displayedScore)
    // 输出结果为: true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

对于缓存范围之外的值, 装箱值是不同的对象.
在这种情况下, 即使它们的值 [结构相等](equality.md#structural-equality), 它们也不是引用相等的.
因此, 请使用 `==` 来比较数值:

```kotlin
fun main() {
//sampleStart
    val score: Int = 10000
    val savedScore: Int? = score
    val displayedScore: Int? = score

    println(savedScore === displayedScore)
    // 输出结果为: false
    println(savedScore == displayedScore)
    // 输出结果为: true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}
