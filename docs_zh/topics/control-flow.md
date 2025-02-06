[//]: # (title: 条件与循环)

## if 表达式 {id="if-expression"}

在 Kotlin 中, `if` 是一个表达式: 它有返回值.
因此, Kotlin 中没有三元运算符(`条件 ? then 分支返回值 : else 分支返回值`),
因为简单的 `if` 表达式完全可以实现同样的任务.

```kotlin
fun main() {
    val a = 2
    val b = 3

    //sampleStart
    var max = a
    if (a < b) max = b

    // 使用 else 分支的方式
    if (a > b) {
        max = a
    } else {
        max = b
    }

    // if 作为表达式使用
    max = if (a > b) a else b

    // 在表达式中也可以使用 `else if`:
    val maxLimit = 1
    val maxOrLimit = if (maxLimit > a) maxLimit else if (a > b) a else b

    println("max is $max")
    // 输出结果为: max is 3
    println("maxOrLimit is $maxOrLimit")
    // 输出结果为: maxOrLimit is 3
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="if-else-if-kotlin"}

`if` 表达式的分支可以是多条语句组成的代码段, 这种情况下, 代码段内最后一个表达式的值将成为整个代码段的返回值:

```kotlin
val max = if (a > b) {
    print("Choose a")
    a
} else {
    print("Choose b")
    b
}
```

如果你将 `if` 作为表达式来使用, 比如, 将它的值作为函数的返回值, 或将它的值赋值给一个变量,
这种情况下必须存在 `else` 分支.

## when 表达式和 when 语句 {id="when-expressions-and-statements"}

`when` 是一个条件表达式, 根据多个可能的值或条件来运行代码.
它类似于 Java, C, 和类似语言中的 `switch` 语句. 例如:

```kotlin
fun main() {
    //sampleStart
    val x = 2
    when (x) {
        1 -> print("x == 1")
        2 -> print("x == 2")
        else -> print("x is neither 1 nor 2")
    }
    // 输出结果为: x == 2
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-conditions-when-statement"}

`when` 语句会将它的参数与各个分支逐个匹配, 直到找到某个分支的条件成立.

`when` 有几种不同的使用方式.
首先, 你可以将 `when` 用作 **表达式** 或 **语句**.
作为表达式, `when` 返回一个值, 供后面的代码使用.
作为语句, `when` 完成一个动作, 不返回任何后续使用的值:

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
// 不返回任何值, 只是触发一个 print 语句
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> print("x is neither 1 nor 2")
}
```

</td>
</tr>
</table>

其次, 使用 `when` 时可以带主语(Subject), 也可以不带.
无论你在 `when` 中是否使用主语, 你的表达式或语句的行为都是一样的.
我们推荐使用 `when` 时尽可能带上主语, 因为这样可以清楚的表示你检查的内容, 让你的代码更加易于阅读和维护.

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

根据你使用 `when` 的方式不同, 对于是否需要在分支中覆盖所有可能的情况, 存在不同的要求.

如果你将 `when` 用作一个语句, 你不需要覆盖所有可能的情况.
在下面的示例中, 有些情况没有覆盖, 因此不会发生任何动作. 但是, 也不会发生错误:

```kotlin
fun main() {
    //sampleStart
    val x = 3
    when (x) {
        // 没有覆盖所有的情况
        1 -> print("x == 1")
        2 -> print("x == 2")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-statement"}

在 `when` 语句中, 各个分支的值会被忽略.
和使用 `if` 时一样, 每个分支都可以是一个代码块, 而且它的值是代码块中最后一个表达式的值.

如果你将 `when` 用作一个表达式, 你必须覆盖所有的情况.
也就是说, 它必须是 _穷尽(exhaustive)_ 的.
第一个匹配的分支的值会成为整个表达式的值. 如果你没有覆盖所有的情况, 编译器会报告错误.

如果你的 `when` 表达式带有主语, 你可以使用 `else` 分支来确保覆盖所有可能的情况, 但 `else` 分支并不是必须的.
例如, 如果你的主语是 `Boolean`, [`enum` 类](enum-classes.md), [`sealed` 类](sealed-classes.md),
或这些类型的可为 null 的版本, 你就可以覆盖所有的情况, 而不必使用 `else` 分支:

```kotlin
enum class Bit {
    ZERO, ONE
}

val numericValue = when (getRandomBit()) {
    // 不需要 else 分支, 因为已经覆盖了所有的情况
    Bit.ZERO -> 0
    Bit.ONE -> 1
}
```

如果你的 `when` 表达式 **不** 带有主语, 你 **必须** 使用 `else` 分支, 否则编译器会报告错误.
当所有的其他分支条件都不满足时, 就会计算 `else` 分支:

```kotlin
when {
    a > b -> "a is greater than b"
    a < b -> "a is less than b"
    else -> "a is equal to b"
}
```

`when` 表达式和 `when` 语句提供了不同的方式来简化你的代码, 处理多个条件, 以及执行类型检查.

可以指定多个条件, 用逗号分隔, 对多种条件进行相同的处理:

```kotlin
when (x) {
    0, 1 -> print("x == 0 or x == 1")
    else -> print("otherwise")
}
```

在分支条件中, 你可以使用任意的表达式(而不仅仅是常数值):

```kotlin
when (x) {
    s.toInt() -> print("s encodes x")
    else -> print("s does not encode x")
}
```

你还可以使用 `in` 或 `!in` 关键字, 检查一个值是否属于一个 [范围](ranges.md), 或者是否属于一个集合:

```kotlin
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}
```

此外, 你还可以使用 `is` 或 `!is` 关键字, 检查一个值是不是某个特定的类型.
注意, 由于 Kotlin 的 [智能类型转换](typecasts.md#smart-casts) 功能,
进行过类型判断之后, 你就可以直接访问这个类型的成员函数和属性, 而不必再进行类型检查.

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}
```

你可以使用 `when` 替代 `if`-`else` `if` 串.
如果没有使用主语, 那么所有的分支条件都应该是单纯的布尔表达式.
条件计算结果为 `true` 的第一个分支会被执行:

```kotlin
when {
    x.isOdd() -> print("x is odd")
    y.isEven() -> print("y is even")
    else -> print("x+y is odd")
}
```

你可以使用以下语法, 将主语保存到一个变量中:

```kotlin
fun Request.getBody() =
    when (val response = executeRequest()) {
        is Success -> response.body
        is HttpError -> throw HttpException(response.status)
    }
```

作为主语引入的这个变量, 它的有效范围仅限于这个 `when` 表达式或语句的 body 部之内.

### when 表达式中的保护条件(Guard Condition) {id="guard-conditions-in-when-expressions"}

> 保护条件(Guard Condition) 是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更.
> 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-71140/Guard-conditions-in-when-expressions-feedback) 提供你的反馈意见.
>
{style="warning"}

保护条件(Guard Condition) 允许你在 `when` 表达式的分支中包含一个以上的条件, 让复杂的控制流变得更加明确和简洁.
你可以在带有主语的 `when` 表达式语句中使用保护条件.

要在一个分支中包含保护条件, 请将它放在主条件之后, 用 `if` 分隔:

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal
    data class Dog(val breed: String) : Animal
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // 只带有主条件的分支. 当 `animal` 是 `Dog` 时, 调用 `feedDog()`
        is Animal.Dog -> feedDog()
        // 带有主条件和保护条件的分支. 当 `animal` 是 `Cat`, 并且不是 `mouseHunter` 时, 调用 `feedCat()`
        is Animal.Cat if !animal.mouseHunter -> feedCat()
        // 如果上面的条件都不成立, 打印输出 "Unknown animal"
        else -> println("Unknown animal")
    }
}
```

在单个 `when` 表达式中, 你可以组合使用带有保护条件和不带保护条件的分支.
带有保护条件的分支中的代码, 只有在主条件和保护条件的计算结果都为 true 时才会运行.
如果主条件不成立, 那么保护条件不会被计算.

如果你在没有 `else` 分支的 `when` 语句中使用保护条件, 而且所有的条件都不成立, 那么所有的分支都不会执行.

相反, 如果你在没有 `else` 分支的 `when` 表达式中使用保护条件, 编译器会要求你声明所有的可能情况, 以免发生运行期错误.

此外, 保护条件支持 `else if`:

```kotlin
when (animal) {
    // 检查 `animal` 是不是 `Dog`
    is Animal.Dog -> feedDog()
    // 保护条件, 检查 `animal` 是 `Cat`, 并且不是 `mouseHunter`
    is Animal.Cat if !animal.mouseHunter -> feedCat()
    // 如果以上条件都不成立, 而且 animal.eatsPlants 为 true, 调用 giveLettuce()
    else if animal.eatsPlants -> giveLettuce()
    // 如果以上条件都不成立, 打印输出 "Unknown animal"
    else -> println("Unknown animal")
}
```

在单个分支中, 可以使用布尔操作符 `&&` (与) 或 `||` (或), 组合多个保护条件.
请在布尔表达式之外使用括号, 以 [避免混乱](coding-conventions.md#guard-conditions-in-when-expression):

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) -> feedCat()
}
```

你可以在任何带有主语的 `when` 表达式或语句中使用保护条件, 但使用逗号分隔的多个条件例外.
例如, `0, 1 -> print("x == 0 or x == 1")`.

> 要在 CLI 中启用保护条件, 请运行以下命令:
>
> `kotlinc -Xwhen-guards main.kt`
>
> 要在 Gradle 中启用保护条件, 请向 `build.gradle.kts` 文件添加以下内容:
>
> `kotlin.compilerOptions.freeCompilerArgs.add("-Xwhen-guards")`
>
{style="note"}

## for 循环 {id="for-loops"}

任何值, 只要能够产生一个迭代器(iterator), 就可以使用 `for` 循环进行遍历.
相当于 C# 等语言中的 `foreach` 循环. `for` 循环的语法如下:

```kotlin
for (item in collection) print(item)
```

`for` 循环体可以是多条语句组成的代码段.

```kotlin
for (item: Int in ints) {
    // ...
}
```

前面提到过, 凡是能够产生迭代器(iterator)的值, 都可以使用 `for` 进行遍历.
也就是说, 遍历对象需要满足以下条件:

* 存在一个成员函数或扩展函数 `iterator()`, 它的返回类型应该是 `Iterator<>` 类型,
  并且这个 `Iterator<>` 类型应该:
  * 存在一个成员函数或扩展函数 `next()`
  * 存在一个成员函数或扩展函数 `hasNext()`, 它的返回类型为 `Boolean` 类型.

上述三个函数都需要标记为 `operator`.

要遍历一个数值范围, 可以使用 [值范围表达式](ranges.md):

```kotlin
fun main() {
//sampleStart
    for (i in 1..3) {
        print(i)
    }
    for (i in 6 downTo 0 step 2) {
        print(i)
    }
    // 输出结果为: 1236420
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

使用 `for` 循环来遍历数组或值范围(Range)时, 会被编译为基于数组下标的循环, 不会产生迭代器(iterator)对象.

如果你希望使用下标变量来遍历数组或 List, 可以这样做:

```kotlin
fun main() {
    val array = arrayOf("a", "b", "c")
//sampleStart
    for (i in array.indices) {
        print(array[i])
    }
    // 输出结果为: abc
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

或者, 你也可以使用 `withIndex` 库函数:

```kotlin
fun main() {
    val array = arrayOf("a", "b", "c")
//sampleStart
    for ((index, value) in array.withIndex()) {
        println("the element at $index is $value")
    }
    // 输出结果为:
    // the element at 0 is a
    // the element at 1 is b
    // the element at 2 is c
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## while 循环 {id="while-loops"}

`while` 和 `do-while` 循环会在满足条件时反复处理它们的循环体.
但它们检查循环条件的时刻不同:
* `while` 先检查条件, 并在条件满足时, 处理循环体, 然后再次跳回到条件检查.
* `do-while` 先处理循环体, 然后再检查条件. 如果条件满足, 就会继续循环.
  因此 `do-while` 的循环体至少会运行一次, 无论条件是否成立.

```kotlin
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // 在这里可以访问 y!
```

## 循环的中断(break)与继续(continue) {id="break-and-continue-in-loops"}

Kotlin 的循环支持传统的 `break` 和 `continue` 操作符.
详情请参见 [返回与跳转](returns.md).
