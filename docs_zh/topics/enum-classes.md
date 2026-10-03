[//]: # (title: 枚举类)

枚举类表示一组固定的可能值. 当一个值只能是预先定义的几个选项之一时, 例如可用的状态, 或模式, 这种情况下请使用枚举类.

枚举类中的每个值称为 _枚举常数_.
枚举常数的行为类似于枚举类类型的 [单例对象(Singleton)](object-declarations.md), 因此可以拥有属性, 函数, 以及自定义的行为.

如果所有可能的值都事先已知, 并且具有相同的结构, 枚举类最为适合.
如果需要对各种情况保存不同的数据, 或采用不同的结构, 请使用 [封闭类(Sealed Class)与封闭接口(Sealed Interface)](sealed-classes.md).

## 声明枚举类 {id="declare-enum-classes"}

要创建枚举类, 请使用 `enum` 关键字, 然后按通常的类语法, 在花括号中定义类体.
在类的 Body 部之内, 列出枚举常数, 使用逗号分隔:

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```

在这个示例中, `Direction` 是枚举类, `NORTH`, `SOUTH`, `WEST` 和 `EAST` 是枚举常数.

按照惯例, 枚举常数通常使用大写字母, 因为它们表示常数值.

要访问枚举常数, 可以使用枚举类名称加上常数名称:

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}

fun main() {
    // `Direction.NORTH` 是 `Direction` 类型的枚举常数
    val direction: Direction = Direction.NORTH

    println(direction)
    // 输出结果为: NORTH
}
```
{kotlin-runnable="true" id="create-enum-class-kotlin"}

Kotlin 中的所有枚举类都继承自基类 [`Enum<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-enum/), 其中 `T` 是枚举类自身.
例如, `Direction` 枚举类继承自 `Enum<Direction>`.
因此, 枚举常数具有内建的属性, 例如 [`name` 和 `ordinal`](#access-enum-constants-and-their-properties).

## 使用枚举常数 {id="working-with-enum-constants"}

枚举常数是值, 因此可以将它们赋值给变量, 打印输出, 传递给函数, 比较, 也可以在 `when` 表达式中使用.

### 声明枚举常数 {id="declare-enum-constants"}

要声明枚举常数, 先在枚举类的构造器中定义属性, 然后在每个枚举常数后的括号内传入属性值.
与某些其他语言不同, Kotlin 不使用赋值语法, 例如 `RED = "#FF0000"`.

枚举常数可以关联任何类型的值. 常见的情况是字符串和数字, 也可以使用其它类型, 例如 `Boolean`,
另一个枚举类, 或自定义的类.

例如, `Color` 枚举类为每种颜色保存 16 进制的颜色代码:

```kotlin
enum class Color(val hex: String) {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF")
}
```

传递给每个枚举常数的值必须与构造器参数的类型匹配.
这里, `hex` 是 `Color` 枚举类的字符串属性. 每个枚举常数都为这个属性传入自己的字符串值.

也可以为枚举常数关联数值. 例如, 在构造器中声明 `Int` 类型, 并为每个枚举常数提供 `Int` 值:

```kotlin
enum class Priority(val level: Int) {
    LOW(0),
    MEDIUM(1),
    HIGH(2)
}
```

### 访问枚举常数和它的属性 {id="access-enum-constants-and-their-properties"}

可以通过枚举类的名称来访问枚举常数.
要访问与枚举常数关联的属性, 请使用点号表示法, 例如 `color.hex` 或 `Color.GREEN.hex`:

```kotlin
enum class Color(val hex: String) {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF")
}

fun main() {
    val color: Color = Color.RED

    println(color)
    // 输出结果为: RED
    println(color.hex)
    // 输出结果为: #FF0000
    println(Color.GREEN.hex)
    // 输出结果为: #00FF00
}
```
{kotlin-runnable="true" id="access-enum-properties-kotlin"}

这里, `Color.RED` 是 `Color` 类型的枚举常数. `color` 变量保存这个枚举常数.

除了你自己定义的属性, 每个枚举常数还有内建的 `name` 和 `ordinal` 属性, 用于获取它在枚举类声明中的名称和位置(位置从 `0` 开始):

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    println(RGB.RED.name)
    // 输出结果为: RED
    println(RGB.RED.ordinal)
    // 输出结果为: 0
}
```
{kotlin-runnable="true" id="rgb-enums-properties-kotlin"}

### 将枚举常数传递给函数 {id="pass-enum-constants-to-functions"}

枚举常数是值, 因此可以传递给函数.
通过这种方式, 函数能够只接受枚举类中定义的固定的选项, 保证代码的类型安全:

```kotlin
enum class Color(val hex: String) {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF")
}

//sampleStart
fun printColor(color: Color) {
    println("Color: $color")
    println("Hex code: ${color.hex}")
}

fun main() {
    printColor(Color.BLUE)
    // 输出结果为:
    // Color: BLUE
    // Hex code: #0000FF
}
//sampleEnd
```
{kotlin-runnable="true" id="pass-enum-to-function-kotlin"}

这里, `printColor()` 函数接收 `Color` 类型的值, 因此可以传入任何 `Color` 枚举常数.

虽然枚举常数的行为类似于单例对象, 但编译器将它们视为枚举类类型的值.
可以将枚举类的名称用作类型, 但不能将枚举常数用作枚举类型:

```kotlin
enum class Color {
    RED, GREEN, BLUE
}

fun printColor(color: Color) {
    println(color)
}

fun printRed(color: Color.RED) {
    println(color)
    // 错误: 枚举条目不能用作类型
}
```

### 在 `when` 表达式中使用枚举常数 {id="use-enum-constants-in-when-expressions"}

如果需要分别处理每个枚举常数, 枚举类很适合与 `when` 表达式配合使用:

```kotlin
enum class Color(val hex: String) {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF")
}

//sampleStart
fun describeColor(color: Color): String {
    return when (color) {
        Color.RED -> "Red is a warm color"
        Color.GREEN -> "Green is a natural color"
        Color.BLUE -> "Blue is a cool color"
    }
}

fun main() {
    println(describeColor(Color.RED))
    // 输出结果为: Red is a warm color
}
//sampleEnd
```
{kotlin-runnable="true" id="enum-when-expression-kotlin"}

当 `when` 表达式涵盖了所有的枚举常数时, 不需要 `else` 分支.

> 为了减少使用枚举条目时的重复代码, 可以试用上下文敏感的解析功能 (目前为预览版).
> 如果预期的类型已经知道, 例如在 `when` 表达式中, 或赋值给有类型的变量时, 这个功能允许省略枚举类名称.
>
> 详情请参见 [上下文敏感解析(预览版)](whatsnew22.md#preview-of-context-sensitive-resolution),
> 或相关的 [KEEP 提案](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md).
>
{style="tip"}

### 查找枚举常数 {id="find-enum-constants"}

有时需要根据字符串, 索引, 或关联的值来查找枚举常数.
Kotlin 提供了内建的 API, 可以根据名称, 位置, 或自定义值查找常数.

例如, 假设枚举类为每种颜色关联了 RGB 值. 要根据名称查找枚举常数, 请使用 `valueOf()` 函数:

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

fun main() {
    val color = Color.valueOf("RED")

    println(color)
    // 输出结果为: RED
}
```
{kotlin-runnable="true" id="find-enum-valueof-kotlin"}

传给 `valueOf()` 的名称必须与枚举常数名称完全一致. 如果不存在指定名称的枚举常数, `valueOf()` 会抛出 `IllegalArgumentException` 异常.

要根据枚举声明中的位置查找枚举常数, 请在枚举类的 `entries` 属性上使用 [`getOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/get-or-null.html) 函数:

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

//sampleStart
fun main() {
    val color = Color.entries.getOrNull(0)

    println(color)
    // 输出结果为: RED
}
//sampleEnd
```
{kotlin-runnable="true" id="find-enum-getornull-kotlin"}

枚举常数的位置从 `0` 开始. 在这个示例中, `RED` 的位置是 `0`, `GREEN` 是 `1`, `BLUE` 是 `2`.

当一个整数表示枚举常数的位置时, 例如来自文件, 或用户的输入, 这种方式会很有用.
与某些其他语言不同, Kotlin 不允许将 `Int` 直接转换为枚举常数.
请将整数作为下标, 使用 `entries.getOrNull(index)` 查找常数.

如果这个整数表达的值, 即使在你重新排列枚举常数的顺序之后, 也应该保持稳定, 请定义明确的数值属性,
例如 `rgb` 或 `code`, 然后查找具有匹配的属性值的常数.

`entries` 是一种专门的 `List`, 因此可以对它使用标准的集合 API.
例如, 要根据关联的值查找枚举常数, 可以在枚举条目中使用 [`first()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first.html)
进行搜索:

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

//sampleStart
fun main() {
    val color = Color.entries.first { it.rgb == 0xFF0000 }

    println(color)
    // 输出结果为: RED
}
//sampleEnd
```
{kotlin-runnable="true" id="find-enum-first-kotlin"}

如果找不到匹配的常数, `first()` 会抛出 `NoSuchElementException` 异常.
如果希望得到 `null`, 请使用 [`firstOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first-or-null.html).

要获取枚举常数的数量, 请使用 [`size`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-list/size.html) 属性.
例如:

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    println(RGB.entries)
    // 输出结果为: [RED, GREEN, BLUE]
    println(RGB.entries.size)
    // 输出结果为: 3
    println("The first color is: ${RGB.valueOf("RED")}")
    // 输出结果为: The first color is: RED
}
```
{kotlin-runnable="true" id="rgb-enums-entries-kotlin"}

如果经常需要根据名称, 位置, 或关联的值查找枚举常数, 可以在 [同伴对象](object-declarations.md#companion-objects) 中添加帮助函数:

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF);

    companion object {
        fun fromName(name: String): Color? =
            entries.find { it.name == name }

        fun fromPosition(position: Int): Color? =
            entries.getOrNull(position)

        fun fromRgb(rgb: Int): Color? =
            entries.find { it.rgb == rgb }
    }
}

fun main() {
    println(Color.fromName("RED"))
    // 输出结果为: RED
    println(Color.fromPosition(1))
    // 输出结果为: GREEN
    println(Color.fromRgb(0x0000FF))
    // 输出结果为: BLUE
    println(Color.fromRgb(0xABCDEF))
    // 输出结果为: null
}
```
{kotlin-runnable="true" id="find-enum-companion-object-kotlin"}

如果希望安全查找, 并在找不到时返回 `null`, 而不是抛出异常, 同伴对象中的辅助函数会很有用.

上述 `entries` 和 `valueOf()` 等查找 API 是 _合成(synthetic)_ 成员的范例.
在这里, 合成表示 Kotlin 会自动提供这些成员, 即使你没有自己声明它们.
因此, 每个枚举类都能通过 `entries` 属性列出它的常数, 并通过 `valueOf()` 函数按名称查找常数, 不需要编写额外的代码.

也可以使用泛型帮助函数访问枚举类的常数, 例如
[`enumEntries<T>()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.enums/enum-entries.html)
和 [`enumValueOf<T>()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/enum-value-of.html).
这些函数使用 [实体化的类型参数(Reified Type Parameter)](inline-functions.md#reified-type-parameters).
这种参数使实际的枚举类型在泛型内联函数中仍然可用, 因此帮助函数可以直接使用枚举类型 `T`:

| 函数                                                                                               | 说明                                                                             |
|----------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| [`enumEntries<T>()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.enums/enum-entries.html) | (推荐使用) 返回枚举类型 `T` 的所有条目. 每次调用都返回同一个 List.               |
| [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html)          | 返回包含枚举类型 `T` 所有条目的数组. 每次调用 `enumValues<T>()` 会创建新的数组.  |
| [`enumValueOf<T>()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/enum-value-of.html)      | 根据名称返回一个枚举条目. 如果没有匹配的条目, 会抛出 `IllegalArgumentException`. |

例如:

```kotlin
import kotlin.enums.enumEntries

enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    println(enumEntries<T>().joinToString { it.name })
}

inline fun <reified T : Enum<T>> findByName(name: String): T = enumValueOf<T>(name)

fun main() {
    printAllValues<RGB>()
    // 输出结果为: RED, GREEN, BLUE
    println(findByName<RGB>("GREEN"))
    // 输出结果为: GREEN
}
```
{kotlin-runnable="true" id="enum-reified-type-parameters-kotlin"}

关于内联函数和实体化的类型参数, 详情请参见 [内联函数](inline-functions.md).

### 枚举常数的比较和排序 {id="compare-and-sort-enum-constants"}

请使用 `==` [结构相等](equality.md#structural-equality) 操作符, 比较枚举常数:

```kotlin
enum class Color(val hex: String) {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF")
}

//sampleStart
fun main() {
    val color = Color.RED

    println(color == Color.RED)
    // 输出结果为: true
    println(color == Color.BLUE)
    // 输出结果为: false
}
//sampleEnd
```
{kotlin-runnable="true" id="compare-enum-constants-kotlin"}

每个枚举常数的行为类似于单例对象, 因此比较枚举常数会检查两个值是否指向同一个常数.

所有枚举类默认实现 [`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html)
接口, 因此可以比较和排序枚举常数.
常数的顺序由它们在枚举声明中的位置 (`ordinal` 值) 决定, 因此, 最先声明的常数被视为最小:

```kotlin
enum class Priority {
    LOW, MEDIUM, HIGH
}

fun main() {
    println(Priority.LOW < Priority.HIGH)
    // 输出结果为: true
    println(Priority.HIGH > Priority.MEDIUM)
    // 输出结果为: true
}
```
{kotlin-runnable="true" id="compare-enum-comparable-kotlin"}

排序会遵循声明的相同顺序. 例如, 无论常数的名称是什么, `entries.sorted()` 都按声明的顺序返回常数:

```kotlin
enum class Priority {
    HIGH, LOW, MEDIUM
}

fun main() {
    println(Priority.entries.sorted())
    // 输出结果为: [HIGH, LOW, MEDIUM]
}
```
{kotlin-runnable="true" id="sort-enum-declaration-order-kotlin"}

`Enum<T>` 类提供了 `compareTo()`, `equals()` 和 `hashCode()` 函数,
你不能像在普通类中那样, 通过覆盖这些函数来自定义行为. 比较始终遵循声明顺序.

如果需要其他的顺序, 请不要依赖声明顺序. 应该定义明确的属性, 并按这个属性排序.
例如, 按亮度对颜色排序:

```kotlin
enum class Color(val brightness: Int) {
    RED(1),
    GREEN(3),
    BLUE(2)
}

fun main() {
    println(Color.entries.sortedBy { it.brightness })
    // 输出结果为: [RED, BLUE, GREEN]
}
```
{kotlin-runnable="true" id="sort-enum-brightness-kotlin"}

详情请参见 [排序](collection-ordering.md).

## 向枚举类添加函数 {id="add-functions-to-enum-classes"}

和拥有属性一样, 枚举类也可以拥有函数. 你可以添加所有枚举常数共通的函数, 将函数与属性结合, 或者定义操作符函数.

### 添加所有常数共通的函数 {id="add-functions-shared-by-all-constants"}

要添加所有枚举常数共通的行为, 请在枚举类的 Body 部中定义函数.
如果枚举类定义了成员, 在常数定义和成员定义之间请使用分号分隔:

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST;

    fun isVertical(): Boolean = this == NORTH || this == SOUTH
}

fun main() {
    println(Direction.NORTH.isVertical())
    // 输出结果为: true
    println(Direction.EAST.isVertical())
    // 输出结果为: false
}
```
{kotlin-runnable="true" id="enum-shared-function-kotlin"}

每个枚举常数都可以调用这个共通函数. 在函数内部, `this` 指向调用这个函数的枚举常数.

可以将构造器属性与函数结合, 为每个常数关联数据, 添加使用这些数据的行为:

```kotlin
enum class Color(val hex: String) {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF");

    fun describe(): String = "$name has hex code $hex"
}

fun main() {
    println(Color.RED.describe())
    // 输出结果为: RED has hex code #FF0000
}
```
{kotlin-runnable="true" id="enum-properties-functions-kotlin"}

这里, 每个常数都保存它自己的 `hex` 值, 共通的 `describe()` 函数同时使用了内建的 `name` 属性和 `hex` 属性.

### 添加操作符函数 {id="add-operator-functions"}

枚举类还可以定义 [操作符函数](operator-overloading.md), 然后你就可以对枚举常数使用操作符.
例如, 定义 `not()` 操作符函数, 通过 `!` 操作符返回相反的方向:

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST;

    operator fun not(): Direction = when (this) {
        NORTH -> SOUTH
        SOUTH -> NORTH
        WEST -> EAST
        EAST -> WEST
    }
}

fun main() {
    println(!Direction.NORTH)
    // 输出结果为: SOUTH
}
```
{kotlin-runnable="true" id="enum-operator-function-kotlin"}

## 使用匿名类 {id="use-anonymous-classes"}

枚举常数可以声明自己的匿名类, 提供相应的函数, 也可以覆盖基类函数.
使用匿名类时, 在枚举常数名称后直接书写类的 Body 部, Kotlin 会将枚举类推断为它的超类型.

如果在枚举类中声明抽象函数, 并且要求每个常数提供自己的实现时, 这个功能会很有用.
每个常数都在自己的匿名类中覆盖这个抽象函数:

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

fun main() {
    var state = ProtocolState.WAITING

    println(state)
    // 输出结果为: WAITING
    state = state.signal()
    println(state)
    // 输出结果为: TALKING
}
```
{kotlin-runnable="true" id="enum-abstract-function-kotlin"}

在这里, 每个常数对抽象函数 `signal()` 的实现都不同, 因此调用 `signal()` 时, 返回的下一个状态是什么, 取决于当前常数.

虽然枚举常数的行为类似于单例对象, 但枚举常数的类型是枚举类本身, 而不是它自己的匿名类.
因此, 不能访问匿名类 Body 部中声明的成员:

```kotlin
enum class ProtocolState {
    WAITING {
        val waitingMessage = "Waiting for a signal"
        override fun signal() = TALKING
    },

    TALKING {
        override fun signal() = WAITING
    };

    abstract fun signal(): ProtocolState
}

fun main() {
    println(ProtocolState.WAITING.waitingMessage)
    // 错误: unresolved reference 'waitingMessage'
}
```

要为每个常数公开数据或行为, 请在枚举类的 Body 部中声明, 如果每个常数都需要自己的实现, 请使用抽象成员.

## 在枚举类中实现接口 {id="implement-interfaces-in-enum-classes"}

枚举类可以实现接口, 但不能从其他类继承.
你可以为所有的枚举常数提供接口成员的共通实现, 也可以让每个常数在匿名类中提供自己的实现.

要实现接口, 请在枚举类的声明中添加接口:

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
{kotlin-runnable="true" id="implement-interfaces-enum-kotlin"}

在这个示例中, `IntArithmetics` 枚举类在声明中实现了 `BinaryOperator<Int>` 和 `IntBinaryOperator` 两个接口.
`PLUS` 和 `TIMES` 都在自己的匿名类 Body 部中覆盖了接口的 `apply()` 成员, 而 `applyAsInt()` 为所有常数提供了共通的实现.
