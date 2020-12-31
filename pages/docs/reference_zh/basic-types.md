---
type: doc
layout: reference
category: "Syntax"
title: "基本类型: 数值, 字符串, 数组"
---

# 基本类型

在 Kotlin 中, 一切都是对象, 这就意味着, 我们可以对任何变量访问它的成员函数和属性.
有些数据类型有着特殊的内部表现形式, 比如, 数值, 字符, 布尔值在运行时可以使用 Java 的基本类型(Primitive Type)来表达, 但对于使用者来说, 它们就和通常的类一样.
本章我们将介绍 Kotlin 中使用的基本类型: 数值, 字符, 布尔值, 数组, 以及字符串.

## 数值

Kotlin 提供了一组内建数据类型来表达数值.
对于整数数值, 有 4 种数据类型, 它们的大小不同, 因此表达的数值范围也不同.

|  类型   | 大小(bits)|    最小值 |  最大值    |
|--------|-----------|----------|--------- |
| Byte	 | 8         |-128      |127       |
| Short	 | 16        |-32768    |32767     |
| Int	 | 32        |-2,147,483,648 (-2<sup>31</sup>)| 2,147,483,647 (2<sup>31</sup> - 1)|
| Long	 | 64        |-9,223,372,036,854,775,808 (-2<sup>63</sup>)|9,223,372,036,854,775,807 (2<sup>63</sup> - 1)|

任何变量如果使用整数数值初始化, 并且数值不超过 `Int` 类型的最大范围, 那么这些变量将被推断为 `Int` 类型.
如果初始化数值超过了 `Int` 类型的最大范围, 那么类型将是 `Long`.
如果要明确指明一个数值是 `Long` 类型, 请在数值末尾添加 `L` 后缀.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val one = 1 // Int 类型
val threeBillion = 3000000000 // Long 类型
val oneLong = 1L // Long 类型
val oneByte: Byte = 1
```

</div>

对于浮点数值, Kotlin 提供 `Float` 和 `Double` 类型.
根据 [IEEE 754 标准](https://en.wikipedia.org/wiki/IEEE_754),
这两种浮点类型的区别在于他们的 _十进制位数_, 也就是说, 它们能够存储多少十进制数字.
`Float` 代表 IEEE 754 _单精度(single precision)浮点数_, 而 `Double` 代表 _双精度(double precision)浮点数_.


|  类型  | 大小(bits) |     有效位数     |   指数位数   |  十进制位数   |
|--------|-----------|--------------- |-------------|--------------|
| Float	 | 32        |24              |8            |6-7            |
| Double | 64        |53              |11           |15-16          |    

任何变量如果使用浮点数值初始化, 编译器推断的类型将是 `Double`.
如果要明确指明一个数值是 `Float` 类型, 请在数值末尾添加 `f` 或 `F` 后缀.
如果这个值包含 6-7 位以上的十进制数字, 这部分会被舍去.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val pi = 3.14 // Double 类型
val e = 2.7182818284 // Double 类型
val eFloat = 2.7182818284f // Float 类型, 实际的值将是 2.7182817
```

</div>

注意, 与其他一些语言不同, Kotlin 的数值类型没有隐式的拓宽变换.
比如, 如果函数使用 `Double` 参数, 那么只能使用 `Double` 值调用它, 而不能使用 `Float`, `Int`, 或其他数值类型的值.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
    fun printDouble(d: Double) { print(d) }

    val i = 1    
    val d = 1.1
    val f = 1.1f

    printDouble(d)
//    printDouble(i) // 错误: 类型不匹配
//    printDouble(f) // 错误: 类型不匹配
}
```
</div>

如果要将数值转换为不同的类型, 请使用 [显式类型转换](#explicit-conversions).

### 字面值常数(Literal Constant)

对于整数值, 有以下几种类型的字面值常数:

* 10进制数: `123`
  * Long 类型需要大写的 `L` 来标识: `123L`
* 16进制数: `0x0F`
* 2进制数: `0b00001011`

注意: 不支持8进制数的字面值.

Kotlin 还支持传统的浮点数值表达方式:

* 无标识时默认为 Double 值: `123.5`, `123.5e10`
* Float 值需要用 `f` 或 `F` 标识: `123.5f`

### 在数字字面值中使用下划线 (从 Kotlin 1.1 开始支持)

你可以在数字字面值中使用下划线, 提高可读性:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
```

</div>

### 内部表达

在 Java 平台中, 数值的物理存储使用 JVM 的基本类型来实现, 但当我们需要表达一个可为 null 的数值引用时(比如. `Int?`), 或者涉及到泛型时, 我们就不能使用基本类型了.
这种情况下数值会被装箱(box)为数值对象.

注意, 数值对象的装箱(box)并不一定会保持对象的同一性(identity):

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

但是, 装箱(box)会保持对象内容相等(equality):

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val a: Int = 10000
    println(a == a) // 打印结果为 'true'
    val boxedA: Int? = a
    val anotherBoxedA: Int? = a
    println(boxedA == anotherBoxedA) // 打印结果为 'true'
//sampleEnd
}
```

</div>

### 显式类型转换

由于数据类型内部表达方式的差异, 较小的数据类型不会被看作较大数据类型的子类型(subtype).
如果小数据类型是大数据类型的子类型, 那么我们将会遇到以下问题:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 以下为假想代码, 实际上是无法编译的:
val a: Int? = 1 // 装箱后的 Int (java.lang.Integer)
val b: Long? = a // 这里进行隐式类型转换, 产生一个装箱后的 Long (java.lang.Long)
print(b == a) // 结果与你期望的相反! 这句代码打印的结果将是 "false", 因为 Long 的 equals() 方法会检查比较对象, 要求对方也是一个 Long 对象
```

</div>

这样, 不仅不能保持同一性(identity), 而且还在所有发生隐式类型转换的地方, 保持内容相等(equality)的能力也静悄悄地消失了.

由于存在以上问题, Kotlin 不会将较小的数据类型隐式地转换为较大的数据类型.
也就是说, 如果不进行显式类型转换, 我们就不能将一个 `Byte` 类型值赋给一个 `Int` 类型的变量.

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val b: Byte = 1 // 这是 OK 的, 因为编译器会对字面值进行静态检查
    val i: Int = b // 这是错误的
//sampleEnd
}
```

</div>

我们可以使用显式类型转换, 来将数值变为更大的类型

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
    val b: Byte = 1
//sampleStart
    val i: Int = b.toInt() // 这是 OK 的: 我们明确地扩大了数值的类型
    print(i)
//sampleEnd
}
```

</div>

所有的数值类型都支持以下类型转换方法:

* `toByte(): Byte`
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`
* `toChar(): Char`

Kotlin 语言中缺少了隐式类型转换的能力, 这个问题其实很少会引起使用者的注意, 因为类型可以通过代码上下文自动推断出来, 而且数学运算符都进行了重载(overload), 可以适应各种数值类型的参数, 比如

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val l = 1L + 3 // Long 类型 + Int 类型, 结果为 Long 类型
```

</div>

### 运算符(Operation)

Kotlin 对数值类型支持标准的数学运算符(operation), 这些运算符都被定义为相应的数值类上的成员函数(但编译器会把对类成员函数的调用优化为对应的运算指令).
参见 [运算符重载](operator-overloading.html).

#### 整数除法

注意, 整数之间的除法返回的永远是整数. 所有的小数部分都会被抛弃. 比如:

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

对于位运算符, 没有使用特别的字符来表示, 而只是有名称的普通函数, 但调用这些函数时, 可以将函数名放在运算数的中间(即中缀表示法), 比如:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val x = (1 shl 2) and 0x000FF000
```

</div>

以下是位运算符的完整列表(只适用于 `Int` 类型和 `Long` 类型):

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
那么此时对这些数值, 或由这些数值构成的范围的操作, 将遵循 IEEE 754 浮点数值运算标准.

但是, 为了支持使用泛型的情况, 并且支持完整的排序功能, 如果操作数 **不能** 静态地判定为浮点值类型(比如. `Any`, `Comparable<...>`, 或者类型参数),
此时对这些浮点值的操作将使用 `Float` 和 `Double` 类中实现的 `equals` 和 `compareTo` 方法,
这些方法不符合 IEEE 754 浮点数值运算标准, 因此:

* `NaN` 会被判定为等于它自己
* `NaN` 会被判定为大于任何其他数值, 包括正无穷大(`POSITIVE_INFINITY`)
* `-0.0` 会被判定为小于 `0.0`

## 字符

字符使用 `Char` 类型表达. 字符不能直接当作数值使用

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun check(c: Char) {
    if (c == 1) { // 错误: 类型不兼容
        // ...
    }
}
```

</div>

字符的字面值(literal)使用单引号表达: `'1'`.
特殊字符使用反斜线转义表达.
Kotlin 支持的转义字符包括: `\t`, `\b`, `\n`, `\r`, `\'`, `\"`, `\\` 以及 `\$`.
其他任何字符, 都可以使用 Unicode 转义表达方式: `'\uFF00'`.

我们可以将字符显式地转换为 `Int` 型数值:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun decimalDigitValue(c: Char): Int {
    if (c !in '0'..'9')
        throw IllegalArgumentException("Out of range")
    return c.toInt() - '0'.toInt() // 显式转换为数值
}
```

</div>

与数值型一样, 当需要一个可为 null 的字符引用时, 字符会被装箱(box)为对象. 装箱操作不保持对象的同一性(identity).

## 布尔值

`Boolean` 类型用来表示布尔值, 有两个可能的值: *true*{: .keyword } 和 *false*{: .keyword }.

当需要一个可为 null 的布尔值引用时, 布尔值也会被装箱(box).

布尔值的内建运算符有

* `||` – 或运算(会进行短路计算)
* `&&` – 与运算(会进行短路计算)
* `!` - 非运算

## 数组

Kotlin 中的数组通过 `Array` 类表达, 这个类拥有 `get` 和 `set` 函数(这些函数通过运算符重载转换为 `[]` 运算符), 此外还有 `size` 属性, 以及其他一些有用的成员函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Array<T> private constructor() {
    val size: Int
    operator fun get(index: Int): T
    operator fun set(index: Int, value: T): Unit

    operator fun iterator(): Iterator<T>
    // ...
}
```

</div>

要创建一个数组, 我们可以使用库函数 `arrayOf()`, 并向这个函数传递一些参数来指定数组元素的值, 所以 `arrayOf(1, 2, 3)` 将创建一个数组, 其中的元素为 `[1, 2, 3]`.
或者, 也可以使用库函数 `arrayOfNulls()` 来创建一个指定长度的数组, 其中的元素全部为 null 值.

另一种方案是使用 `Array` 构造函数, 第一个参数为数组大小, 第二个参数是另一个函数, 这个函数接受数组元素下标作为自己的输入参数, 然后返回这个下标对应的数组元素的初始值:

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

Kotlin 中数组的类型是 _不可变的_ . 所以 Kotlin 不允许将一个 `Array<String>` 赋值给一个 `Array<Any>`, 否则可能会导致运行时错误(但你可以使用 `Array<out Any>`,
参见 [类型投射](generics.html#type-projections)).

### 基本数据类型的数组

Kotlin 中也有专门的类来表达基本数据类型的数组: `ByteArray`,
`ShortArray`, `IntArray` 等等, 这些数组可以避免数值对象装箱带来的性能损耗. 这些类与 `Array` 类之间不存在继承关系, 但它们的方法和属性是一致的. 各个基本数据类型的数组类都有对应的工厂函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val x: IntArray = intArrayOf(1, 2, 3)
x[0] = x[1] + x[2]
```

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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

</div>


## 无符号整数

> 无符号类型只在 Kotlin 1.3 以上版本有效, 目前还处于 [Beta 阶段](evolution/components-stability.html).
  详情请参见 [下文](#beta-status-of-unsigned-integers)
{:.note}

针对无符号整数, Kotlin 引入了以下数据类型:

* `kotlin.UByte`: 无符号的 8 位整数, 值范围是 0 到 255
* `kotlin.UShort`: 无符号的 16 位整数, 值范围是 0 到 65535
* `kotlin.UInt`: 无符号的 32 位整数, 值范围是 0 到 2^32 - 1
* `kotlin.ULong`: 无符号的 64 位整数, 值范围是 0 到 2^64 - 1

无符号整数支持有符号整数的大多数运算符.

> 注意, 将无符号类型变为有符号类型 (或者反过来) 是一种 *二进制不兼容的* 变换
{:.note}

无符号整数的实现使用到了另一种未稳定发布的功能, 名为 [内嵌类](inline-classes.html).

### 为无符号整数服务的专用类

与基本类型相同, 每一种无符号整数类型都有一个对应的类来表示由它构成的数组, 特定的数组类专用于表达特定的无符号整数类型:

* `kotlin.UByteArray`: 无符号 byte 构成的数组
* `kotlin.UShortArray`: 无符号 short 构成的数组
* `kotlin.UIntArray`: 无符号 int 构成的数组
* `kotlin.ULongArray`: 无符号 long 构成的数组

与有符号的整数数组类一样, 这些无符号整数的数组类提供了与 `Array` 类近似的 API, 并且不会产生数值对象装箱带来的性能损耗.

此外, 还提供了 `kotlin.ranges.UIntRange`, `kotlin.ranges.UIntProgression`, `kotlin.ranges.ULongRange`, `kotlin.ranges.ULongProgression` 类, 来支持 `UInt` 和 `ULong` 类型的 [值范围与数列](ranges.html) 功能.

### 无符号整数的字面值(literal)

为了便利无符号整数的使用, Kotlin 允许在整数字面值上添加后缀来表示特定的无符号类型 (与 Float/Long 的标记方式类似):
* `u` 和 `U` 后缀将一个字面值标记为无符号整数. 具体的无符号整数类型将根据程序此处期待的数据类型来决定. 如果未指定期待的数据类型, 那么将根据整数值的大小来选择使用 `UInt` 或 `ULong`.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val b: UByte = 1u  // 字面值类型为 UByte, 因为程序指定了期待的数据类型
val s: UShort = 1u // 字面值类型为 UShort, 因为程序指定了期待的数据类型
val l: ULong = 1u  // 字面值类型为 ULong, 因为程序指定了期待的数据类型

val a1 = 42u // 字面值类型为 UInt: 因为程序未指定期待的数据类型, 而且整数值可以存入 UInt 内
val a2 = 0xFFFF_FFFF_FFFFu // 字面值类型为 ULong: 因为程序未指定期待的数据类型, 而且整数值无法存入 UInt 内
```

</div>

* `uL` 和 `UL` 后缀将字面值明确标记为无符号的 long.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val a = 1UL // 字面值类型为 ULong, 即使这里未指定期待的数据类型, 而且整数值可以存入 UInt 内
```

</div>

### 无符号整数功能目前处于 Beta 阶段

无符号整数类型功能的设计还处于 [Beta 阶段](evolution/components-stability.html), 也就是说, 关于这个功能的兼容性, 我们会尽量努力, 但不提供保证.
在 Kotlin 1.3 以上版本中使用无符号整数运算时, 编译器会提示警告信息, 表示这项功能还没有稳定发布.
如果要去掉这些警告, 你需要明确地表示自己确定要使用无符号整数功能.

具体的做法有两种方式: 一种是在你的 API 中也要求使用者同意, 另一种不会如此.

- 如果愿意把你的 API 也变成需要使用者同意, 可以对使用无符号整数的 API 声明添加 `@ExperimentalUnsignedTypes` 注解.
- 如果不愿意把你的 API 变成需要使用者同意, 可以对你的 API 声明使用 `@OptIn(ExperimentalUnsignedTypes::class)` 注解,
  或者对编译器添加 `-Xopt-in=kotlin.ExperimentalUnsignedTypes` 选项

你的 API 使用者是否需要明确地表示自己确定要使用你的实验性 API, 这个选择由你来决定.
但是请时刻记得, 无符号整数目前还是未稳定发布的功能, 因此由于 Kotlin 语言未来版本的变化, 使用无符号整数的 API 可能会出现错误.

关于更多技术细节, 请参见要求使用者同意 API 的 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/experimental.md).

### 更深入地讨论

关于更多技术细节和更深入的讨论, 请参见[关于 Kotlin 语言支持无符号数据类型的建议](https://github.com/Kotlin/KEEP/blob/master/proposals/unsigned-types.md).

## 字符串

字符串由 `String` 类型表示. 字符串的内容是不可变的.
字符串中的元素是字符, 可以通过下标操作符来访问: `s[i]`.
可以使用 *for*{: .keyword } 循环来遍历字符串:

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

你可以使用 `+` 操作符来拼接字符串. 这个操作符也可以将字符串与其他数据类型的值拼接起来, 只要表达式中的第一个元素是字符串类型:

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

Kotlin 中存在两种字符串字面值: 一种称为转义字符串(escaped string), 其中可以包含转义字符, 另一种成为原生字符串(raw string), 其内容可以包含换行符和任意文本.
转义字符串(escaped string)的示例如下:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val s = "Hello, world!\n"
```

</div>

转义字符使用通常的反斜线方式表示. 关于 Kotlin 支持的转义字符, 请参见上文的 [字符](#characters) 小节.

原生字符串(raw string)由三重引号表示(`"""`), 其内容不转义, 可以包含换行符和任意字符:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val text = """
    for (c in "foo")
        print(c)
"""
```

</div>

你可以使用 [`trimMargin()`](/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 函数来删除字符串的前导空白(leading whitespace):

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

字符串字面值内可以包含模板表达式, 也就是说, 可以包含一小段代码, 这段代码会被执行, 其计算结果将被拼接为字符串内容的一部分.
模板表达式以 $ 符号开始, $ 符号之后可以是一个简单的变量名:

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

$ 符号之后也可以是任意的表达式, 由大括号括起:

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

原生字符串(raw string)和转义字符串(escaped string)内都支持模板.
由于原生字符串无法使用反斜线转义表达方式, 如果你想在字符串内表示 `$` 字符本身, 可以使用以下语法:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val price = """
${'$'}9.99
"""
```

</div>
