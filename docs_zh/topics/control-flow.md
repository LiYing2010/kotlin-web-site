[//]: # (title: 条件与循环)

Kotlin 提供了灵活的工具来控制程序的流程.
使用 `if`, `when` 以及循环, 为你的条件定义清晰, 富有表达力的逻辑.

## if 表达式 {id="if-expression"}

在 Kotlin 中使用 `if`, 请在括号 `()` 内添加要检查的条件, 并在大括号 `{}` 内添加条件为 true 时要执行的操作.
你可以使用 `else` 和 `else if` 来添加更多的分支和检查.

也可以将 `if` 写成表达式, 这样可以将返回值直接赋值给一个变量.
在这种形式下, 必须有 `else` 分支.
`if` 表达式的作用与其他语言中的三元运算符 (`条件 ? then 分支 : else 分支`) 一样.

例如:

```kotlin
fun main() {
    val heightAlice = 160
    val heightBob = 175

    //sampleStart
    var taller = heightAlice
    if (heightAlice < heightBob) taller = heightBob

    // 使用 else 分支
    if (heightAlice > heightBob) {
        taller = heightAlice
    } else {
        taller = heightBob
    }

    // 将 if 作为表达式使用
    taller = if (heightAlice > heightBob) heightAlice else heightBob

    // 将 else if 作为表达式使用:
    val heightLimit = 150
    val heightOrLimit = if (heightLimit > heightAlice) heightLimit else if (heightAlice > heightBob) heightAlice else heightBob

    println("Taller height is $taller")
    // 输出结果为: Taller height is 175
    println("Height or limit is $heightOrLimit")
    // 输出结果为: Height or limit is 175
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="if-else-if-kotlin"}

`if` 表达式的每个分支都可以是一个代码块, 代码块中最后一个表达式的值将成为整个代码块的返回值:

```kotlin
fun main() {
    //sampleStart
    val heightAlice = 160
    val heightBob = 175

    val taller = if (heightAlice > heightBob) {
        print("Choose Alice\n")
        heightAlice
    } else {
        print("Choose Bob\n")
        heightBob
    }

    println("Taller height is $taller")
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="if-else-blocks-kotlin"}

## when 表达式和 when 语句 {id="when-expressions-and-statements"}

`when` 是一个条件表达式, 根据多个可能的值或条件来运行代码.
它类似于 Java, C, 和其他语言中的 `switch` 语句.
`when` 对它的参数求值, 然后将结果与各个分支逐一比较, 直到某个分支条件成立.
例如:

```kotlin
fun main() {
    //sampleStart
    val userRole = "Editor"
    when (userRole) {
        "Viewer" -> print("User has read-only access")
        "Editor" -> print("User can edit content")
        else -> print("User role is not recognized")
    }
    // 输出结果为: User can edit content
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-conditions-when-statement"}

你可以将 `when` 用作 **表达式** 或 **语句**.
作为表达式, `when` 返回一个值, 供后面的代码使用.
作为语句, `when` 完成一个动作, 不返回结果:

<table>
   <tr>
       <td>表达式</td>
       <td>语句</td>
   </tr>
   <tr>
<td>

```kotlin
// 返回一个字符串值, 赋值给变量 text
val text = when (x) {
    1 -> "x == 1"
    2 -> "x == 2"
    else -> "x is neither 1 nor 2"
}
```

</td>
<td>

```kotlin
// 不返回结果, 只是触发一个 print 语句
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> print("x is neither 1 nor 2")
}
```

</td>
</tr>
</table>

其次, 你可以使用 `when` 时带主语(subject), 也可以不带. 无论是否带主语, 行为都是相同的.
使用主语通常可以让你的代码更易于阅读和维护, 因为它清楚地表明了你在检查什么.

<table>
   <tr>
       <td>带有主语 <code>x</code></td>
       <td>不带主语</td>
   </tr>
   <tr>
<td>

```kotlin
when(x) { ... }
```

</td>
<td>

```kotlin
when { ... }
```

</td>
</tr>
</table>

你使用 `when` 的方式决定了是否需要在分支中覆盖所有可能的情况.
覆盖所有可能情况称为 _穷尽(exhaustive)_.

### 用作语句 {id="statements"}

如果你将 `when` 用作语句, 不需要覆盖所有可能的情况.
在下面的示例中, 有些情况没有覆盖, 因此不会触发任何分支. 但是, 不会发生错误:

```kotlin
fun main() {
    //sampleStart
    val deliveryStatus = "OutForDelivery"
    when (deliveryStatus) {
        // 没有覆盖所有的情况
        "Pending" -> print("Your order is being prepared")
        "Shipped" -> print("Your order is on the way")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-statement"}

和使用 `if` 一样, 每个分支都可以是一个代码块, 而且它的值是代码块中最后一个表达式的值.

### 用作表达式 {id="expressions"}

如果你将 `when` 用作表达式, **必须** 覆盖所有可能的情况.
第一个匹配的分支的值将成为整个表达式的值. 如果没有覆盖所有的情况, 编译器会报告错误.

如果你的 `when` 表达式带有主语, 可以使用 `else` 分支来确保覆盖所有可能的情况, 但 `else` 分支并不是必须的.
例如, 如果你的主语是 `Boolean`, [`enum` 类](enum-classes.md), [`sealed` 类](sealed-classes.md),
或这些类型的可为 null 的版本, 就可以覆盖所有情况而不必使用 `else` 分支:

```kotlin
import kotlin.random.Random
//sampleStart
enum class Bit {
    ZERO, ONE
}

fun getRandomBit(): Bit {
    return if (Random.nextBoolean()) Bit.ONE else Bit.ZERO
}

fun main() {
    val numericValue = when (getRandomBit()) {
        // 不需要 else 分支, 因为已经覆盖了所有的情况
        Bit.ZERO -> 0
        Bit.ONE -> 1
    }

    println("Random bit as number: $numericValue")
    // 输出结果为: Random bit as number: 0
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-expression-subject"}

> 为了简化 `when` 表达式, 并减少重复代码, 请试用上下文敏感的解析(Context-Sensitive Resolution)功能 (目前是预览版).
> 在 `when` 表达式中使用枚举值或封闭类成员时, 如果预期的类型已知, 这个功能允许省略类型名称.
>
> 详情请参见 [预览版功能: 上下文敏感的解析(Context-Sensitive Resolution)](whatsnew22.md#preview-of-context-sensitive-resolution),
> 或相关的 [KEEP 提案](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md).
>
{style="tip"}

如果你的 `when` 表达式 **不** 带有主语, 那么 **必须** 使用 `else` 分支, 否则编译器会报告错误.
当所有的其他分支条件都不满足时, 就会计算 `else` 分支:

```kotlin
fun main() {
    //sampleStart
    val localFileSize = 1200
    val remoteFileSize = 1200

    val message = when {
        localFileSize > remoteFileSize -> "Local file is larger than remote file"
        localFileSize < remoteFileSize -> "Local file is smaller than remote file"
        else -> "Local and remote files are the same size"
    }

    println(message)
    // 输出结果为: Local and remote files are the same size
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-no-subject"}

### when 的其他使用方式 {id="other-ways-to-use-when"}

`when` 表达式和语句提供了不同的方式来简化你的代码, 处理多个条件, 以及执行类型检查.

使用逗号, 将多个条件合并到一个分支中:

```kotlin
fun main() {
    val ticketPriority = "High"
    //sampleStart
    when (ticketPriority) {
        "Low", "Medium" -> print("Standard response time")
        else -> print("High-priority handling")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-multiple-cases"}

使用能够计算结果为 `true` 或 `false` 的表达式, 作为分支条件:

```kotlin
fun main() {
    val storedPin = "1234"
    val enteredPin = 1234

    //sampleStart
    when (enteredPin) {
        // 表达式
        storedPin.toInt() -> print("PIN is correct")
        else -> print("Incorrect PIN")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-branch-expression"}

使用 `in` 或 `!in` 关键字, 检查一个值是否属于一个 [范围](ranges.md) 或集合:

```kotlin
fun main() {
    val x = 7
    val validNumbers = setOf(15, 16, 17)

    //sampleStart
    when (x) {
        in 1..10 -> print("x is in the range")
        in validNumbers -> print("x is valid")
        !in 10..20 -> print("x is outside the range")
        else -> print("none of the above")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-ranges"}

使用 `is` 或 `!is` 关键字检查值的类型.
由于 [智能类型转换](typecasts.md#smart-casts) 功能, 你可以直接访问该类型的成员函数和属性:

```kotlin
fun hasPrefix(input: Any): Boolean = when (input) {
    is String -> input.startsWith("ID-")
    else -> false
}

fun main() {
    val testInput = "ID-98345"
    println(hasPrefix(testInput))
    // 输出结果为: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-type-checks"}

使用 `when` 替代传统的 `if`-`else` `if` 串.
不带主语时, 分支条件就是简单的布尔表达式. 条件为 `true` 的第一个分支会执行:

```kotlin
fun Int.isOdd() = this % 2 != 0
fun Int.isEven() = this % 2 == 0

fun main() {
    //sampleStart
    val x = 5
    val y = 8

    when {
        x.isOdd() -> print("x is odd")
        y.isEven() -> print("y is even")
        else -> print("x+y is odd")
    }
    // 输出结果为: x is odd
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-replace-if"}

最后, 使用以下语法, 将主语保存到一个变量中:

```kotlin
fun main() {
    val message = when (val input = "yes") {
        "yes" -> "You said yes"
        "no" -> "You said no"
        else -> "Unrecognized input: $input"
    }

    println(message)
    // 输出结果为: You said yes
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-capture-subject"}

作为主语引入的这个变量, 它的有效范围仅限于这个 `when` 表达式或语句的 body 部之内.

### 保护条件(Guard Condition) {id="guard-conditions-in-when-expressions"}

保护条件(Guard Condition)允许在 `when` 表达式或语句的分支中包含一个以上的条件, 让复杂的控制流变得更加明确和简洁.
只要 `when` 带有主语, 就可以使用保护条件.

在同一个分支中, 将保护条件放在主条件之后, 用 `if` 分隔:

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal
    data class Dog(val breed: String) : Animal
}

fun feedDog() = println("Feeding a dog")
fun feedCat() = println("Feeding a cat")

//sampleStart
fun feedAnimal(animal: Animal) {
    when (animal) {
        // 只带有主条件的分支
        // 当 animal 是 Dog 时, 调用 feedDog()
        is Animal.Dog -> feedDog()
        // 带有主条件和保护条件的分支
        // 当 animal 是 Cat, 并且不是 mouseHunter 时, 调用 feedCat()
        is Animal.Cat if !animal.mouseHunter -> feedCat()
        // 如果以上条件都不成立, 打印 "Unknown animal"
        else -> println("Unknown animal")
    }
}

fun main() {
    val animals = listOf(
        Animal.Dog("Beagle"),
        Animal.Cat(mouseHunter = false),
        Animal.Cat(mouseHunter = true)
    )

    animals.forEach { feedAnimal(it) }
    // 输出结果为:
    // Feeding a dog
    // Feeding a cat
    // Unknown animal
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.2" id="kotlin-when-guard-conditions"}

当你有多个用逗号分隔的条件时, 不能使用保护条件. 例如:

```kotlin
0, 1 -> print("x == 0 or x == 1")
```

在单个 `when` 表达式或语句中, 可以组合使用带有保护条件和不带保护条件的分支.
带有保护条件的分支中的代码, 只有在主条件和保护条件的计算结果都为 `true` 时才会运行.
如果主条件不成立, 那么保护条件不会被计算.

由于 `when` 语句不需要覆盖所有情况, 在没有 `else` 分支的 `when` 语句中使用保护条件,
意味着如果所有条件都不成立, 则不会运行任何代码.

与语句不同, `when` 表达式必须覆盖所有情况. 如果在没有 `else` 分支的 `when` 表达式中使用保护条件,
编译器要求你处理所有可能的情况, 以避免运行期错误.

在单个分支中, 可以使用布尔操作符 `&&` (与) 或 `||` (或), 组合多个保护条件.
请在布尔表达式之外使用括号, 以 [避免混乱](coding-conventions.md#guard-conditions-in-when-expression):

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) -> feedCat()
}
```

保护条件也支持 `else if`:

```kotlin
when (animal) {
    // 检查 `animal` 是不是 `Dog`
    is Animal.Dog -> feedDog()
    // 保护条件, 检查 `animal` 是 `Cat`, 并且不是 `mouseHunter`
    is Animal.Cat if !animal.mouseHunter -> feedCat()
    // 如果以上条件都不成立, 而且 animal.eatsPlants 为 true, 调用 giveLettuce()
    else if animal.eatsPlants -> giveLettuce()
    // 如果以上条件都不成立, 打印 "Unknown animal"
    else -> println("Unknown animal")
}
```

## for 循环 {id="for-loops"}

使用 `for` 循环, 遍历 [集合(collection)](collections-overview.md), [数组(array)](arrays.md), 或 [范围(range)](ranges.md):

```kotlin
for (item in collection) print(item)
```

`for` 循环体可以是用大括号 `{}` 括起来的代码块.

```kotlin
fun main() {
    val shoppingList = listOf("Milk", "Bananas", "Bread")
    //sampleStart
    println("Things to buy:")
    for (item in shoppingList) {
        println("- $item")
    }
    // 输出结果为:
    // Things to buy:
    // - Milk
    // - Bananas
    // - Bread
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop"}

### 遍历数值范围 {id="ranges"}

要遍历一个数值范围, 请使用 `..` 和 `..<` 运算符构造的 [范围表达式](ranges.md):

```kotlin
fun main() {
//sampleStart
    println("Closed-ended range:")
    for (i in 1..6) {
        print(i)
    }
    // 输出结果为: 
    // Closed-ended range:
    // 123456

    println("\nOpen-ended range:")
    for (i in 1..<6) {
        print(i)
    }
    // 输出结果为: 
    // Open-ended range:
    // 12345

    println("\nReverse order in steps of 2:")
    for (i in 6 downTo 0 step 2) {
        print(i)
    }
    // 输出结果为: 
    // Reverse order in steps of 2:
    // 6420
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-range"}

### 遍历数组 {id="arrays"}

如果希望使用下标变量来遍历数组或 list, 可以使用 `indices` 属性:

```kotlin
fun main() {
    val routineSteps = arrayOf("Wake up", "Brush teeth", "Make coffee")
    //sampleStart
    for (i in routineSteps.indices) {
        println(routineSteps[i])
    }
    // 输出结果为: 
    // Wake up
    // Brush teeth
    // Make coffee
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-array"}

或者, 也可以使用标准库中的 [`.withIndex()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/with-index.html) 函数:

```kotlin
fun main() {
    val routineSteps = arrayOf("Wake up", "Brush teeth", "Make coffee")
    //sampleStart
    for ((index, value) in routineSteps.withIndex()) {
        println("The step at $index is \"$value\"")
    }
    // 输出结果为: 
    // The step at 0 is "Wake up"
    // The step at 1 is "Brush teeth"
    // The step at 2 is "Make coffee"
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-array-index"}

### 使用迭代器 {id="iterators"}

`for` 循环可以遍历任何提供了 [迭代器](iterators.md) 的值.
集合默认提供迭代器, 而范围和数组会被编译为基于下标的循环.

你可以创建自己的迭代器, 方法是提供一个名为 `iterator()` 的成员函数或扩展函数, 这个函数要返回 `Iterator<>`.
`iterator()` 函数必须有一个 `next()` 函数和一个返回 `Boolean` 的 `hasNext()` 函数.

要为类创建自己迭代器, 最简单的方式是继承 [`Iterable<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-iterable/) 接口,
并覆盖其中已有的 `iterator()`, `next()`, 和 `hasNext()` 函数. 例如:

```kotlin
class Booklet(val totalPages: Int) : Iterable<Int> {
    override fun iterator(): Iterator<Int> {
        return object : Iterator<Int> {
            var current = 1
            override fun hasNext() = current <= totalPages
            override fun next() = current++
        }
    }
}

fun main() {
    val booklet = Booklet(3)
    for (page in booklet) {
        println("Reading page $page")
    }
    // 输出结果为: 
    // Reading page 1
    // Reading page 2
    // Reading page 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-inherit-iterator"}

> 更多详情请参见 [接口](interfaces.md) 和 [继承](inheritance.md).
>
{style="tip"}

或者, 也可以从头创建这些函数. 在这种情况下, 请在函数上添加 `operator` 关键字:

```kotlin
//sampleStart
class Booklet(val totalPages: Int) {
    operator fun iterator(): Iterator<Int> {
        return object {
            var current = 1

            operator fun hasNext() = current <= totalPages
            operator fun next() = current++
        }.let {
            object : Iterator<Int> {
                override fun hasNext() = it.hasNext()
                override fun next() = it.next()
            }
        }
    }
}
//sampleEnd

fun main() {
    val booklet = Booklet(3)
    for (page in booklet) {
        println("Reading page $page")
    }
    // 输出结果为: 
    // Reading page 1
    // Reading page 2
    // Reading page 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-iterator-from-scratch"}

## while 循环 {id="while-loops"}

`while` 和 `do-while` 循环, 在满足条件时持续运行它们循环体中的代码.
它们之间的区别是, 检查循环条件的时刻不同:

* `while` 先检查条件, 如果条件满足, 则运行循环体中的代码, 然后再次回到条件检查.
* `do-while` 先运行循环体中的代码, 然后再检查条件. 如果条件满足, 就会继续循环.
  因此 `do-while` 的循环体至少会运行一次, 无论条件是否成立.

对于 `while` 循环, 先将要检查的条件放在括号 `()` 内, 然后是循环体, 放在大括号 `{}` 内:

```kotlin
fun main() {
    var carsInGarage = 0
    val maxCapacity = 3
//sampleStart
    while (carsInGarage < maxCapacity) {
        println("Car entered. Cars now in garage: ${++carsInGarage}")
    }
    // 输出结果为: 
    // Car entered. Cars now in garage: 1
    // Car entered. Cars now in garage: 2
    // Car entered. Cars now in garage: 3

    println("Garage is full!")
    // 输出结果为: Garage is full!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-while-loop"}

对于 `do-while` 循环, 先将循环体放在大括号 `{}` 内, 然后是要检查的条件, 放在括号 `()` 内:

```kotlin
import kotlin.random.Random

fun main() {
    var roll: Int
//sampleStart
    do {
        roll = Random.nextInt(1, 7)
        println("Rolled a $roll")
    } while (roll != 6)
    // 输出结果为: 
    // Rolled a 2
    // Rolled a 6

    println("Got a 6! Game over.")
    // 输出结果为: Got a 6! Game over.
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-do-while-loop"}

## 循环的中断(break)与继续(continue) {id="break-and-continue-in-loops"}

Kotlin 支持循环内传统的 `break` 和 `continue` 操作符.
详情请参见 [返回与跳转](returns.md).
