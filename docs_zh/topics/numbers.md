[//]: # (title: 数值类型)

## 整数类型 {id="integer-types"}

Kotlin 提供了一组内建数据类型来表达数值.
对于整数数值, 有 4 种数据类型, 它们有着不同的大小和数值范围:

| 类型      | 大小(bits) | 最小值                                          | 最大值                                            |
|---------|----------|----------------------------------------------|------------------------------------------------|
| `Byte`  | 8        | -128                                         | 127                                            |
| `Short` | 16       | -32768                                       | 32767                                          |
| `Int`   | 32       | -2,147,483,648 (-2<sup>31</sup>)             | 2,147,483,647 (2<sup>31</sup> - 1)             |
| `Long`  | 64       | -9,223,372,036,854,775,808 (-2<sup>63</sup>) | 9,223,372,036,854,775,807 (2<sup>63</sup> - 1) |

> 除有符号的整数类型外, Kotlin 还提供了无符号整数类型.
> 由于无符号整数类型针对的是不同的使用场景, 因此在单独的章节中介绍.
> 详情请参见 [](unsigned-integer-types.md).
>
{style="tip"}

如果你初始化一个变量, 不明确指定类型, 编译器会自动推断类型, 使用从 `Int` 开始、足够表达这个值的最小的整数范围.
如果值没有超过 `Int` 类型的最大范围, 那么类型会推断为 `Int`. 如果超过, 那么类型将是 `Long`.
如果要明确指明一个数值是 `Long` 类型, 请在数值末尾添加 `L` 后缀.
要使用 `Byte` 或 `Short` 类型, 请在声明中明确指定.
如果明确指定类型, 编译器会检查值有没有超过指定类型的最大范围.

```kotlin
val one = 1 // Int 类型
val threeBillion = 3000000000 // Long 类型
val oneLong = 1L // Long 类型
val oneByte: Byte = 1
```

## 浮点类型 {id="floating-point-types"}

对于实数数值, Kotlin 提供了符合 [IEEE 754 标准](https://en.wikipedia.org/wiki/IEEE_754) 的浮点类型 `Float` 和 `Double`.
`Float` 代表 IEEE 754 _单精度(single precision)浮点数_, 而 `Double` 代表 _双精度(double precision)浮点数_.

这两种类型的区别在于它们大小, 以及能够存储的浮点数值精度:

| 类型       | 大小(bits) | 有效位数 | 指数位数 | 十进制位数 |
|----------|----------|------|------|-------|
| `Float`  | 32       | 24   | 8    | 6-7   |
| `Double` | 64       | 53   | 11   | 15-16 |

只能使用带小数部分的数值初始化 `Double` 和 `Float` 变量.
小数部分与整数部分用点号(`.`)分隔.

任何变量如果使用浮点数值初始化, 编译器推断的类型将是 `Double`:

```kotlin
val pi = 3.14          // Double 类型

val one: Double = 1    // 推断类型为 Int
// 初始化代码类型不匹配

val oneDouble = 1.0    // Double 类型
```
{validate="false"}

如果要明确指明一个数值是 `Float` 类型, 请在数值末尾添加 `f` 或 `F` 后缀.
如果用这种方式提供的值包含 7 位以上的十进制数字, 这部分会被舍去:

```kotlin
val e = 2.7182818284          // Double 类型
val eFloat = 2.7182818284f    // Float 类型, 实际的值将是 2.7182817
```

与其他一些语言不同, Kotlin 的数值类型没有隐式的拓宽变换.
比如, 如果函数使用 `Double` 参数, 那么只能使用 `Double` 值调用它,
而不能使用 `Float`, `Int`, 或其他数值类型的值:

```kotlin
fun main() {
    //sampleStart
    fun printDouble(x: Double) { print(x) }

    val x = 1.0
    val xInt = 1
    val xFloat = 1.0f

    printDouble(x)

    printDouble(xInt)
    // 参数类型不匹配

    printDouble(xFloat)
    // 参数类型不匹配
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

如果要将数值转换为不同的类型, 请使用 [显式类型转换](#explicit-number-conversions).

## 数值的字面值常数(Literal Constant) {id="literal-constants-for-numbers"}

对于整数值, 有几种类型的字面值常数:

* 10 进制数: `123`
* Long 类型数, 以大写的 `L` 结尾: `123L`
* 16 进制数: `0x0F`
* 2 进制数: `0b00001011`

> Kotlin 不支持8进制数的字面值.
>
{style="note"}

Kotlin 还支持传统的浮点数值表达方式:

* Double 值 (当小数部分没有以字母结尾时的默认类型): `123.5`, `123.5e10`
* Float 值, 以 `f` 或 `F` 结尾: `123.5f`

你可以在数字字面值中使用下划线, 提高可读性:

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
val bigFractional = 1_234_567.7182818284
```

> 除此之外, 对无符号整数类型的字面值还有特殊的后缀.
> 详情请参见 [无符号整数类型的字面值](unsigned-integer-types.md).
>
{style="tip"}

## JVM (Java Virtual Machine) 上数值的装箱(Box)和缓存 {id="boxing-and-caching-numbers-on-the-java-virtual-machine"}

JVM 存储数值的方式可能会让你的代码行为违反直觉, 因为默认会对小的(字节大小)数值进行缓存.

JVM 将数值存储为基本类型: `int`, `double`, 等等.
当你使用 [泛型](generics.md) , 或创建一个可为 null 的数值引用, 比如 `Int?` 时.
数值会被装箱(Box)为 Java 类, 例如 `Integer` 或 `Double`.

对 `Integer` 和表示从 `−128` 到 `127` 之间的数值的其它对象,
JVM 会使用一种 [内存优化技术](https://docs.oracle.com/javase/specs/jls/se22/html/jls-5.html#jls-5.1.7).
对于这样的对象的所有可为 null 的引用, 都会引用到相同的缓存对象.
例如, 以下代码中的可为 null 的对象是 [引用相等的](equality.md#referential-equality):

```kotlin
fun main() {
//sampleStart
    val a: Int = 100
    val boxedA: Int? = a
    val anotherBoxedA: Int? = a

    println(boxedA === anotherBoxedA) // 输出结果为: true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

对于超过这个范围的数值, 可为 null 的对象是不同的, 但是 [结构相等的](equality.md#structural-equality):

```kotlin
fun main() {
//sampleStart
    val b: Int = 10000
    val boxedB: Int? = b
    val anotherBoxedB: Int? = b

    println(boxedB === anotherBoxedB) // 输出结果为: false
    println(boxedB == anotherBoxedB) // 输出结果为: true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

由于这个原因, 对可装箱的数值和字面值使用引用相等判断时, Kotlin 会提示警告:
`"Identity equality for arguments of types ... and ... is prohibited."`
在比较 `Int`, `Short`, `Long`, 和 `Byte` 类型 (以及 `Char` 和 `Boolean`) 时, 请使用结构相等检查, 以保证得到一致的结果.

## 显式数值类型转换 {id="explicit-number-conversions"}

由于数据类型内部表达方式的差异, 数值类型互相之间 _不是子类型(subtype)_.
由于存在以上问题, Kotlin 中较小的数据类型  _不会_ 隐式地转换为较大的数据类型, 反过来也是如此.
例如, 要将一个 `Byte` 类型值赋给一个 `Int` 类型的变量需要进行显式类型转换:

```kotlin
fun main() {
//sampleStart
    val byte: Byte = 1
    // 这是 OK 的, 因为会对字面值进行静态检查

    val intAssignedByte: Int = byte
    // 初始化代码类型不匹配

    val intConvertedByte: Int = byte.toInt()

    println(intConvertedByte)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

所有的数值类型都可以转换为其他类型:

* `toByte(): Byte` (对 [Float](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-float/to-byte.html) 和 [Double](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-double/to-byte.html) 类型已废弃)
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`

大多数情况下并不需要明确的的类型转换, 因为类型可以通过代码上下文自动推断得到,
而且数学运算符都进行了重载(overload), 以便自动进行转换.
例如:

```kotlin
fun main() {
//sampleStart
    val l = 1L + 3       // Long 类型 + Int 类型, 结果为 Long 类型
    println(l is Long)   // 输出结果为: true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### 不进行隐式类型转换的理由 {id="reasoning-against-implicit-conversions"}

Kotlin 不支持隐式类型转换, 因为可能导致意外的行为.

如果在不同类型的数值之间进行隐式类型转换, 有时我们可能会毫无察觉的失去内容相等性(equality)和同一性(identity).
例如, 如果 `Int` 是 `Long` 的子类型:

```kotlin
// 以下为假想代码, 实际上是无法编译的:
val a: Int? = 1    // 装箱后的 Int (java.lang.Integer)
val b: Long? = a   // 这里进行隐式类型转换, 产生一个装箱后的 Long (java.lang.Long)
print(b == a)      // 输出结果为: "false", 因为 Long.equals() 不仅检查值是否相等, 而且还检查另一个数值是不是 Long 类型
```

## 数值类型的运算(Operation) {id="operations-on-numbers"}

Kotlin 对数值类型支持标准的数学运算(operation): `+`, `-`, `*`, `/`, `%`.
这些运算定义为相应的数值类上的成员函数:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你可以在自定义的数值类中覆盖这些运算符.
详情请参见 [操作符重载(Operator overloading)](operator-overloading.md).

### 整数除法 {id="division-of-integers"}

整数值之间的除法返回的永远是整数值. 所有的小数部分都会被抛弃.

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2
    println(x == 2.5)
    // 不能在 'Int' 和 'Double' 类型值之间使用 '==' 操作符

    println(x == 2)
    // 输出结果为: true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

对任何两种整数类型之间的除法都是如此:

```kotlin
fun main() {
//sampleStart
    val x = 5L / 2
    println (x == 2)
    // 错误, 因为 Long (x) 不能与 Int (2) 比较

    println(x == 2L)
    // 输出结果为: true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

如果要返回带小数部分的除法结果, 需要将其中一个操作数显式转换为浮点类型:

```kotlin
fun main() {
//sampleStart
    val x = 5 / 2.toDouble()
    println(x == 2.5)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 位运算 {id="bitwise-operations"}

Kotlin 对整数值提供了一组 _位运算_. 这些运算直接对数值的二进制表达的位(bit)进行操作.
位运算表达为函数, 可以通过中缀表示法调用. 只能用于 `Int` 和 `Long`:

```kotlin
fun main() {
//sampleStart
    val x = 1
    val xShiftedLeft = (x shl 2)
    println(xShiftedLeft)
    // 输出结果为: 4

    val xAnd = x and 0x000FF000
    println(xAnd)
    // 输出结果为: 0
//sampleEnd
}
```

位运算的完整列表如下:

* `shl(bits)` – 带符号左移
* `shr(bits)` – 带符号右移
* `ushr(bits)` – 无符号右移
* `and(bits)` – 按位与(**AND**)
* `or(bits)` – 按位或(**OR**)
* `xor(bits)` – 按位异或(**XOR**)
* `inv()` – 按位取反

### 浮点值的比较 {id="floating-point-numbers-comparison"}

本节我们讨论的浮点值操作包括:

* 相等判断: `a == b` 以及 `a != b`
* 比较操作符: `a < b`, `a > b`, `a <= b`, `a >= b`
* 浮点值范围(Range) 的创建, 以及范围检查: `a..b`, `x in a..b`, `x !in a..b`

如果操作数 `a` 和 `b` 的类型能够静态地判定为 `Float` 或 `Double`, 或者可为 null 值的 `Float?` 或 `Double?`,
(比如, 类型明确声明为浮点值, 或者由编译器推断为浮点值, 或者通过[智能类型转换](typecasts.md#smart-casts)变为浮点值),
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

```kotlin
fun main() {
    //sampleStart
    // 操作数静态地判定为浮点值类型
    println(Double.NaN == Double.NaN)                 // 输出结果为: false

    // 操作数 不能 静态地判定为浮点值类型
    // 因此 NaN 等于它自己
    println(listOf(Double.NaN) == listOf(Double.NaN)) // 输出结果为: true

    // 操作数静态地判定为浮点值类型
    println(0.0 == -0.0)                              // 输出结果为: true

    // 操作数 不能 静态地判定为浮点值类型
    // 因此 -0.0 小于 0.0
    println(listOf(0.0) == listOf(-0.0))              // 输出结果为: false

    println(listOf(Double.NaN, Double.POSITIVE_INFINITY, 0.0, -0.0).sorted())
    // 输出结果为: [-0.0, 0.0, Infinity, NaN]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-numbers-floating-comp"}
