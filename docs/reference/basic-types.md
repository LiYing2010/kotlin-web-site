---
type: doc
layout: reference
category: "Syntax"
title: "基本类型"
---

# 基本类型

在 Kotlin 中, 一切都是对象, 这就意味着, 我们可以对任何变量访问它的成员函数和属性. 有些数据类型是内建的(built-in), 因为对它们的实现进行了优化, 但对于使用者来说内建类型与普通类没有区别. 本节我们将介绍大部分内建类型: 数值, 字符, 布尔值, 以及数组.

## 数值

Kotlin 处理数值的方式与 Java 类似, 但并不完全相同. 比如, 对数值不会隐式地扩大其值范围, 而且在某些情况下, 数值型的字面值(literal)也与 Java 存在轻微的不同.

Kotlin 提供了以下内建类型来表达数值(与 Java 类似):

| 类型	 | 位宽度    |
|--------|----------|
| Double | 64       |
| Float	 | 32       |
| Long	 | 64       |
| Int	 | 32       |
| Short	 | 16       |
| Byte	 | 8        |

注意, 字符在 Kotlin 中不是数值类型.

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

### 内部表达

在 Java 平台中, 数值的物理存储使用 JVM 的基本类型来实现, 但当我们需要表达一个可为 null 的数值引用时(比如. `Int?`), 或者涉及到泛型时, 我们就不能使用基本类型了. 
这种情况下数值会被装箱(box)为数值对象.

注意, 数值对象的装箱(box)并不保持对象的同一性(identity):

``` kotlin
val a: Int = 10000
print(a === a) // 打印结果为 'true'
val boxedA: Int? = a
val anotherBoxedA: Int? = a
print(boxedA === anotherBoxedA) // !!!打印结果为 'false'!!!
```

但是, 装箱(box)会保持对象内容相等(equality):

``` kotlin
val a: Int = 10000
print(a == a) // 打印结果为 'true'
val boxedA: Int? = a
val anotherBoxedA: Int? = a
print(boxedA == anotherBoxedA) // 打印结果为 'true'
```

### 显式类型转换

由于数据类型内部表达方式的差异, 较小的数据类型不会被看作较大数据类型的子类型(subtype).
如果小数据类型是大数据类型的子类型, 那么我们将会遇到以下问题:

``` kotlin
// 以下为假想代码, 实际上是无法编译的:
val a: Int? = 1 // 装箱后的 Int (java.lang.Integer)
val b: Long? = a // 这里进行隐式类型转换, 产生一个装箱后的 Long (java.lang.Long)
print(a == b) // 结果与你期望的相反! 这句代码打印的结果将是 "false", 因为 Long 的 equals() 方法会检查比较对象, 要求对方也是一个 Long 对象
```

这样, 不仅不能保持同一性(identity), 而且还在所有发生隐式类型转换的地方, 保持内容相等(equality)的能力也静悄悄地消失了.

由于存在以上问题, Kotlin 不会将较小的数据类型隐式地转换为较大的数据类型.
也就是说, 如果不进行显式类型转换, 我们就不能将一个 `Byte` 类型值赋给一个 `Int` 类型的变量.

``` kotlin
val b: Byte = 1 // 这是 OK 的, 因为编译器会对字面值进行静态检查
val i: Int = b // 这是错误的
```

我们可以使用显式类型转换, 来将数值变为更大的类型

``` kotlin
val i: Int = b.toInt() // 这是 OK 的: 我们明确地扩大了数值的类型
```

所有的数值类型都支持以下类型转换方法:

* `toByte(): Byte`
* `toShort(): Short`
* `toInt(): Int`
* `toLong(): Long`
* `toFloat(): Float`
* `toDouble(): Double`
* `toChar(): Char`

Kotlin 语言中缺少了隐式类型转换的能力, 这个问题其实很少会引起使用者的注意, 因为类型可以通过代码上下文自动推断出来, 而且数学运算符都进行了重载(overload), 可以适应各种数值类型的参数, 比如

``` kotlin
val l = 1L + 3 // Long 类型 + Int 类型, 结果为 Long 类型
```

### 运算符(Operation)

Kotlin 对数值类型支持标准的数学运算符(operation), 这些运算符都被定义为相应的数值类上的成员函数(但编译器会把对类成员函数的调用优化为对应的运算指令).
参见 [运算符重载](operator-overloading.html).

对于位运算符, 没有使用特别的字符来表示, 而只是有名称的普通函数, 但调用这些函数时, 可以将函数名放在运算数的中间(即中缀表示法), 比如:

``` kotlin
val x = (1 shl 2) and 0x000FF000
```

以下是位运算符的完整列表(只适用于 `Int` 类型和 `Long` 类型):

* `shl(bits)` – 带符号左移 (等于 Java 的`<<`)
* `shr(bits)` – 带符号右移 (等于 Java 的 `>>`)
* `ushr(bits)` – 无符号右移 (等于 Java 的 `>>>`)
* `and(bits)` – 按位与(and)
* `or(bits)` – 按位或(or)
* `xor(bits)` – 按位异或(xor)
* `inv()` – 按位取反

## 字符

字符使用 `Char` 类型表达. 字符不能直接当作数值使用

``` kotlin
fun check(c: Char) {
  if (c == 1) { // 错误: 类型不兼容
    // ...
  }
}
```

字符的字面值(literal)使用单引号表达: `'1'`.
特殊字符使用反斜线转义表达.
Kotlin 支持的转义字符包括: `\t`, `\b`, `\n`, `\r`, `\'`, `\"`, `\\` 以及 `\$`.
其他任何字符, 都可以使用 Unicode 转义表达方式: `'\uFF00'`.

我们可以将字符显式地转换为 `Int` 型数值:

``` kotlin
fun decimalDigitValue(c: Char): Int {
  if (c !in '0'..'9')
    throw IllegalArgumentException("Out of range")
  return c.toInt() - '0'.toInt() // 显式转换为数值
}
```

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

``` kotlin
class Array<T> private constructor() {
  val size: Int
  fun get(index: Int): T
  fun set(index: Int, value: T): Unit

  fun iterator(): Iterator<T>
  // ...
}
```

要创建一个数组, 我们可以使用库函数 `arrayOf()`, 并向这个函数传递一些参数来指定数组元素的值, 所以 `arrayOf(1, 2, 3)` 将创建一个数组, 其中的元素为 [1, 2, 3].
或者, 也可以使用库函数 `arrayOfNulls()` 来创建一个指定长度的数组, 其中的元素全部为 null 值.

另一种方案是使用一个工厂函数, 第一个参数为数组大小, 第二个参数是另一个函数, 这个函数接受数组元素下标作为自己的输入参数, 然后返回这个下标对应的数组元素的初始值:

``` kotlin
// 创建一个 Array<String>, 其中的元素为 ["0", "1", "4", "9", "16"]
val asc = Array(5, { i -> (i * i).toString() })
```

我们在前面提到过, `[]` 运算符可以用来调用数组的成员函数 `get()` 和 `set()`.

注意: 与 Java 不同, Kotlin 中数组的类型是不可变的. 所以 Kotlin 不允许将一个 `Array<String>` 赋值给一个 `Array<Any>`, 否则可能会导致运行时错误(但你可以使用 `Array<out Any>`, 
参见 [类型投射](generics.html#type-projections)).

Kotlin 中也有专门的类来表达基本数据类型的数组: `ByteArray`,
`ShortArray`, `IntArray` 等等, 这些数组可以避免数值对象装箱带来的性能损耗. 这些类与 `Array` 类之间不存在继承关系, 但它们的方法和属性是一致的. 各个基本数据类型的数组类都有对应的工厂函数:

``` kotlin
val x: IntArray = intArrayOf(1, 2, 3)
x[0] = x[1] + x[2]
```

## 字符串

字符串由 `String` 类型表示. 字符串的内容是不可变的.
字符串中的元素是字符, 可以通过下标操作符来访问: `s[i]`.
可以使用 *for*{: .keyword } 循环来遍历字符串:

``` kotlin
for (c in str) {
  println(c)
}
```

### 字符串的字面值(literal)

Kotlin 中存在两种字符串字面值: 一种称为转义字符串(escaped string), 其中可以包含转义字符, 另一种成为原生字符串(raw string), 其内容可以包含换行符和任意文本. 转义字符串(escaped string) 与 Java 的字符串非常类似:

``` kotlin
val s = "Hello, world!\n"
```

转义字符使用通常的反斜线方式表示. 关于 Kotlin 支持的转义字符, 请参见上文的 [字符](#characters) 小节.

原生字符串(raw string)由三重引号表示(`"""`), 其内容不转义, 可以包含换行符和任意字符:

``` kotlin
val text = """
  for (c in "foo")
    print(c)
"""
```

你可以使用 [`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 函数来删除字符串的前导空白(leading whitespace):

``` kotlin
val text = """
    |Tell me and I forget. 
    |Teach me and I remember. 
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

默认情况下, 会使用 `|` 作为前导空白的标记前缀, 但你可以通过参数指定使用其它字符, 比如 `trimMargin(">")`.

### 字符串模板

字符串内可以包含模板表达式, 也就是说, 可以包含一小段代码, 这段代码会被执行, 其计算结果将被拼接为字符串内容的一部分.
模板表达式以 $ 符号开始, $ 符号之后可以是一个简单的变量名:

``` kotlin
val i = 10
val s = "i = $i" // 计算结果为 "i = 10"
```

$ 符号之后也可以是任意的表达式, 由大括号括起:

``` kotlin
val s = "abc"
val str = "$s.length is ${s.length}" // 计算结果为 "abc.length is 3"
```

原生字符串(raw string)和转义字符串(escaped string)内都支持模板.
由于原生字符串无法使用反斜线转义表达方式, 如果你想在字符串内表示 `$` 字符本身, 可以使用以下语法:

``` kotlin
val price = """
${'$'}9.99
"""
```
