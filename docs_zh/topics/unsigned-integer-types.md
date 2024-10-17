[//]: # (title: 无符号整数(Unsigned Integer)类型)

除 [整数类型](numbers.md#integer-types) 外, Kotlin 还提供了以下无符号整数类型:

| 类型       | 大小 (位) | 最小值 | 最大值                                       |
|----------|-----------|-----------|-------------------------------------------------|
| `UByte`  | 8 位        | 0         | 255                                             |
| `UShort` | 16 位       | 0         | 65,535                                          |
| `UInt`   | 32 位       | 0         | 4,294,967,295 (2<sup>32</sup> - 1)              |
| `ULong`  | 64 位       | 0         | 18,446,744,073,709,551,615 (2<sup>64</sup> - 1) |


无符号整数支持有符号整数的大多数运算符.

> 无符号数值以 [内联类](inline-classes.md) 的方式实现, 内部存储属性包含对应的同等宽度的有符号数值类型.
> 如果你想要在无符号和有符号的整数类型之间转换, 请确认更新了你的代码, 让所有的函数调用和操作都支持新的类型.
>
{style="note"}

## 无符号整数的数组和值范围

> 无符号整数的数组以及对这些数组的操作目前处于 [Beta](components-stability.md) 状态.
> 随时可能发生不兼容的变化. 使用时需要明确同意(Opt-in)(详情请参见下文).
>
{style="note"}

与基本类型相同, 每一种无符号整数类型都有一个对应的类来表示由它构成的数组:

* `UByteArray`: 无符号 byte 构成的数组.
* `UShortArray`: 无符号 short 构成的数组.
* `UIntArray`: 无符号 int 构成的数组.
* `ULongArray`: 无符号 long 构成的数组.

与有符号的整数数组类类似, 这些无符号整数的数组类提供了与 `Array` 类相似的 API, 并且不会产生数值对象装箱带来的性能损耗.

使用无符号整数数组时, 会出现编译警告, 表示这个功能还未达到稳定状态.
要消除这个警告, 请使用 `@ExperimentalUnsignedTypes` 注解, 标注使用者同意(Opt-in).
你的代码的使用者是否也需要明确同意使用你的 API, 这一点由你来决定,
但请注意, 无符号整数数组还不是稳定的功能, 因此由于语言本身的变化, 使用它们的 API 可能会出现错误.
详情请参见 [明确要求使用者同意的功能(Opt-in Requirement)](opt-in-requirements.md).

为了支持 `UInt` 和 `ULong` 类型的 [值范围与数列](ranges.md) 功能,
还提供了 `UIntRange`, `UIntProgression`, `ULongRange`, `ULongProgression` 类.

## 无符号整数的字面值(literal)

为了无符号整数使用的便利, Kotlin 允许在整数字面值上添加后缀来表示特定的无符号类型
(与 `Float` 或 `Long` 的标记方式类似):

* `u` 和 `U` 用于标记无符号整数. 具体的无符号整数类型将根据程序此处期待的数据类型来决定.
  如果未指定期待的数据类型, 编译器将根据整数值的大小来决定使用 `UInt` 或 `ULong`:

  ```kotlin
  val b: UByte = 1u  // 字面值类型为 UByte, 因为程序指定了期待的数据类型
  val s: UShort = 1u // 字面值类型为 UShort, 因为程序指定了期待的数据类型
  val l: ULong = 1u  // 字面值类型为 ULong, 因为程序指定了期待的数据类型

  val a1 = 42u // 字面值类型为 UInt: 因为程序未指定期待的数据类型, 而且整数值可以存入 UInt 内
  val a2 = 0xFFFF_FFFF_FFFFu // 字面值类型为 ULong: 因为程序未指定期待的数据类型, 而且整数值无法存入 UInt 内
  ```

* `uL` 和 `UL` 将字面值明确标记为无符号的 long:

  ```kotlin
  val a = 1UL // 字面值类型为 ULong, 即使这里未指定期待的数据类型, 而且整数值可以存入 UInt 内
  ```

## 使用场景

无符号数值的主要使用场景, 是利用整数的完整的二进制范围来表达正的数值.
比如, 要表达一个无法在有符号类型范围内表达的 16 进制常数, 例如 32 位 `AARRGGBB` 格式的颜色值:

```kotlin
data class Color(val representation: UInt)

val yellow = Color(0xFFCC00CCu)
```

你可以使用无符号数值来初始化字节数组, 而不需要明确的 `toByte()` 字面值转换:

```kotlin
val byteOrderMarkUtf8 = ubyteArrayOf(0xEFu, 0xBBu, 0xBFu)
```

另一种使用场景是与原生 API 交互. Kotlin 允许表达在方法签名中包含无符号类型的原生声明.
方法映射不会用有符号整数代替无符号整数, 保持语义无变化.

### 不适合的场景

尽管无符号整数只能表达正的数值或 0, 但在应用程序的业务逻辑中要求非负整数的情况下, 并不适合使用无符号整数.
例如, 用作集合大小或集合下标值的数据类型.

原因如下:

* 使用有符号的整数有助于发现数值溢出的异常情况, 以及标记错误条件, 比如
  [`List.lastIndex`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index.html)
  对空的 List 返回结果是 -1.
* 无符号整数不能用作有符号整数的限定范围版本, 因为它们的值范围不是有符号整数值范围的子集.
  有符号整数, 和无符号整数, 相互之间都不是子类型.
