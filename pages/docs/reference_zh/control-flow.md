---
type: doc
layout: reference
category: "Syntax"
title: "条件与循环"
---

# 条件与循环

最终更新: {{ site.data.releases.latestDocDate }}

## if 表达式

在 Kotlin 中, `if` 是一个表达式: 它有返回值.
因此, Kotlin 中没有三元运算符(`条件 ? then 分支返回值 : else 分支返回值`),
因为简单的 `if` 表达式完全可以实现同样的任务.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

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

    //sampleEnd
    println("max is $max")
    println("maxOrLimit is $maxOrLimit")
}
```

</div>

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

## when 表达式

`when` 表示一个条件表达式, 带有多个分支. 类似于各种 C 风格语言中的 `switch` 语句.
它的最简单形式如下.

```kotlin
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> {
        print("x is neither 1 nor 2")
    }
}
```

`when` 语句会将它的参数与各个分支逐个匹配, 直到找到某个分支的条件成立.

`when` 可以用作表达式, 也可以用作流程控制语句.
如果用作表达式, 第一个匹配成功的分支的返回值将成为整个表达式的值.
如果用作流程控制语句, 各个分支的返回值将被忽略.
与 `if` 类似, 各个分支可以是多条语句组成的代码段, 代码段内最后一个表达式的值将成为整个代码段的值.

如果其他所有分支的条件都不成立, 则会执行 `else` 分支.

如果 `when` 被用作 _表达式_, 则必须存在 `else` 分支,
除非编译器能够证明其他分支的条件已经覆盖了所有可能的情况,
比如, 使用 [枚举(`enum`)类](enum-classes.html) 的常数 或 [封闭(`sealed`)类](sealed-classes.html) 的子类型.

```kotlin
enum class Bit {
  ZERO, ONE
}

val numericValue = when (getRandomBit()) {
    Bit.ZERO -> 0
    Bit.ONE -> 1
    // 不需要 'else' 分支, 因为已经覆盖了所有可能的情况
}
```

在 `when` _语句_ 中, 对于以下情况, `else` 分支是必须的:
* `when` 的判断对象是 `Boolean`, [枚举(`enum`)类](enum-classes.html), 或 [封闭(`sealed`)类](sealed-classes.html) 类型,
 或它们的 nullable 类型.
* `when` 的分支没有覆盖所有可能的情况.

```kotlin
enum class Color {
  RED, GREEN, BLUE
}

when (getColor()) {  
    Color.RED -> println("red")
    Color.GREEN -> println("green")   
    Color.BLUE -> println("blue")
    // 不需要 'else' 分支, 因为已经覆盖了所有可能的情况
}

when (getColor()) {
  Color.RED -> println("red") // 没有针对 GREEN 和 BLUE 的分支
  else -> println("not red") // 需要 'else' 分支
}
```

如果对多种条件需要进行相同的处理, 那么可以指定多个条件, 用逗号分隔:

```kotlin
when (x) {
    0, 1 -> print("x == 0 or x == 1")
    else -> print("otherwise")
}
```

在分支条件中, 你可以使用任意的表达式(而不仅仅是常数值)

```kotlin
when (x) {
    s.toInt() -> print("s encodes x")
    else -> print("s does not encode x")
}
```

你还可以使用 `in` 或 ``!in` 来检查一个值是否属于一个 [范围](ranges.html), 或者检查是否属于一个集合:

```kotlin
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}
```

还可以使用 `is` 或 `!is` 来检查一个值是不是某个类型.
注意, 由于 Kotlin 的 [智能类型转换](typecasts.html#smart-casts) 功能,
进行过类型判断之后, 你就可以直接访问这个类型的方法和属性, 而不必再进行显式的类型检查.

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}
```

`when` 也可以用来替代 `if`-`else` `if` 串.
如果没有指定参数, 那么所有的分支条件都应该是单纯的布尔表达式, 当条件的布尔表达式值为 true 时, 就会执行对应的分支:

```kotlin
when {
    x.isOdd() -> print("x is odd")
    y.isEven() -> print("y is even")
    else -> print("x+y is odd")
}
```

你可以使用下面这种语法, 将 `when` 语句的判断对象保存到一个变量中:

```kotlin
fun Request.getBody() =
    when (val response = executeRequest()) {
        is Success -> response.body
        is HttpError -> throw HttpException(response.status)
    }
```

由 `when` 引入的这个变量, 它的有效范围仅限于 `when` 语句之内.


## for 循环

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

要遍历一个数值范围, 可以使用 [值范围表达式](ranges.html):

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    for (i in 1..3) {
        println(i)
    }
    for (i in 6 downTo 0 step 2) {
        println(i)
    }
//sampleEnd
}
```

</div>

使用 `for` 循环来遍历数组或值范围(Range)时, 会被编译为基于数组下标的循环, 不会产生迭代器(iterator)对象.

如果你希望使用下标变量来遍历数组或 List, 可以这样做:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
    val array = arrayOf("a", "b", "c")
//sampleStart
    for (i in array.indices) {
        println(array[i])
    }
//sampleEnd
}
```

</div>

或者, 你也可以使用 `withIndex` 库函数:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
    val array = arrayOf("a", "b", "c")
//sampleStart
    for ((index, value) in array.withIndex()) {
        println("the element at $index is $value")
    }
//sampleEnd
}
```

</div>

## while 循环

`while` 和 `do-while` 循环会在满足条件时反复执行它们的循环体.
但它们检查循环条件的时刻不同:
* `while` 先检查条件, 并在条件满足时, 执行循环体, 然后再次跳回到条件检查.
* `do-while` 先执行循环体, 然后再检查条件. 如果条件满足, 就会继续循环.
  因此 `do-while` 的循环体至少会执行一次, 无论条件是否成立.

```kotlin
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // y is visible here!
```

## 循环的中断(break)与继续(continue)

Kotlin 的循环支持传统的 `break` 和 `continue` 操作符.
详情请参见 [返回与跳转](returns.html).
