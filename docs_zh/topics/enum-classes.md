[//]: # (title: 枚举类)

枚举类最基本的使用场景, 就是实现类型安全的枚举值:

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```

每个枚举常数都是一个对象. 枚举常数之间用逗号分隔.

由于每个枚举值都是枚举类的一个实例, 因此枚举值可以这样初始化:

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## 匿名类

枚举常数可以定义它自己的匿名类, 这些匿名类可以拥有各自的方法, 也可以覆盖基类的方法:

```kotlin
enum class ProtocolState {
    WAITING {
        override fun signal() = TALKING
    },

    TALKING {
        override fun signal() = WAITING
    };

    abstract fun signal(): ProtocolState
}
```

如果枚举类中定义了任何成员, 需要用分号将枚举常数的定义与枚举类的成员定义分隔开.

## 在枚举类中实现接口

枚举类也可以实现接口 (但不能继承其他类), 对于接口的成员函数,
可以为所有的枚举常数提供一个共同的实现, 也可以在不同的枚举常数的匿名类中提供不同的实现.
枚举类实现接口时, 只需要在枚举类的声明中加入希望实现的接口名, 示例如下:

```kotlin
import java.util.function.BinaryOperator
import java.util.function.IntBinaryOperator

//sampleStart
enum class IntArithmetics : BinaryOperator<Int>, IntBinaryOperator {
    PLUS {
        override fun apply(t: Int, u: Int): Int = t + u
    },
    TIMES {
        override fun apply(t: Int, u: Int): Int = t * u
    };

    override fun applyAsInt(t: Int, u: Int) = apply(t, u)
}
//sampleEnd

fun main() {
    val a = 13
    val b = 31
    for (f in IntArithmetics.entries) {
        println("$f($a, $b) = ${f.apply(a, b)}")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9"}

所有的枚举类都默认实现了 [Comparable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 接口.
枚举常数值的大小顺序, 等于它在枚举类中的定义顺序.
详情请参见 [排序(Ordering)](collection-ordering.md).

## 使用枚举常数

Kotlin 中的枚举类拥有编译器添加的合成的(synthetic)属性和方法, 可以列出枚举类中定义的所有枚举常数值, 可以通过枚举常数值的名称字符串得到对应的枚举常数值.
这些方法的签名如下(这里假设枚举类名称为 `EnumClass`):

```kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.entries: EnumEntries<EnumClass> // 专门的 List<EnumClass>
```

下面是这些属性和方法的使用示例:

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.entries) println(color.toString()) // 输出结果为 RED, GREEN, BLUE
    println("The first color is: ${RGB.valueOf("RED")}") // 输出结果为 "The first color is: RED"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9" id="rgb-enums-kotlin"}

如果给定的名称不能匹配枚举类中定义的任何一个枚举常数值, `valueOf()` 方法会抛出 `IllegalArgumentException` 异常.

在 Kotlin 1.9.0 引入 `entries` 之前, 是使用 `values()` 函数来取得枚举常数的数组.

每个枚举常数值也拥有属性:
[`name`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/name.html)
和
[`ordinal`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/ordinal.html),
可以取得它的名称, 以及在枚举类中声明的顺序(从 0 开始):

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    //sampleStart
    println(RGB.RED.name)    // 输出结果为 RED
    println(RGB.RED.ordinal) // 输出结果为 0
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="rgb-enums-properties-kotlin"}

你可以通过
[`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html)
和
[`enumValueOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-value-of.html)
函数, 以泛型方式取得枚举类中的常数.
在 Kotlin 2.0.0 中, 引入了 [`enumEntries<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.enums/enum-entries.html)
函数, 作为
[`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html)
函数的替代.
`enumEntries<T>()` 函数会对指定的枚举类型 `T` 返回一个 List, 包含所有的枚举值.

Kotlin 仍然支持 `enumValues<T>()` 函数, 但我们推荐你改为使用 `enumEntries<T>()` 函数, 因为它的性能损失较少.
每次调用 `enumValues<T>()` 都会创建一个新的数组, 而每次调用 `enumEntries<T>()` 都会返回相同的 List, 这样要高效得多.

例如:

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    println(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>()
// 输出结果为 RED, GREEN, BLUE
```

> 关于内联函数(inline function)和实体化的类型参数(Reified type parameter), 详情请参见 [内联函数](inline-functions.md).
>
{style="tip"}
