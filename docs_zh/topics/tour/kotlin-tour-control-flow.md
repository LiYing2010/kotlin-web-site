[//]: # (title: 控制流)

最终更新: %latestDocDate%

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第 1 步" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="第 2 步" /> <a href="kotlin-tour-basic-types.md">基本类型</a><br />
        <img src="icon-3-done.svg" width="20" alt="第 3 步" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4.svg" width="20" alt="第 4 步" /> <strong>控制流</strong><br />
        <img src="icon-5-todo.svg" width="20" alt="第 5 步" /> <a href="kotlin-tour-functions.md">函数</a><br />
        <img src="icon-6-todo.svg" width="20" alt="第 6 步" /> <a href="kotlin-tour-classes.md">类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="第 7 步" /> <a href="kotlin-tour-null-safety.md">Null 值安全性</a></p>
</tldr>

和其他的编程语言一样, Kotlin 能够根据一个代码片段的计算结果是否为 true 来做出决策.
这样的代码片段称为 **条件表达式**.
Kotlin 还能够创建循环, 并在循环上迭代.

## 条件表达式

Kotlin 提供了 `if` 和 `when` 来检测条件表达式.

> 如果你必须在 `if` 和 `when` 之间做选择, 我们推荐使用 `when`, 因为它可以创建更加健壮和安全的程序.
>
{style="note"}

### If

要使用 `if`, 请将条件表达式放在小括号 `()` 之内, 当调节表达式的结果为 true 时要做的操作放在大括号 `{}` 之内:

```kotlin
fun main() {
//sampleStart
    val d: Int
    val check = true

    if (check) {
        d = 1
    } else {
        d = 2
    }

    println(d)
    // 输出结果为 1
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-if"}

在 Kotlin 中没有三元操作符 `condition ? then : else`.
`if` 可以用作表达式, 替代三元操作符的功能.
把 `if` 用作表达式时, 不要使用大括号 `{}`:

```kotlin
fun main() {
//sampleStart
    val a = 1
    val b = 2

    println(if (a > b) a else b) // 返回值: 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-if-expression"}

### When

如果你的条件表达式存在多个分支, 请使用 `when`.
`when` 可以用作语句, 也可以用作表达式.

下面是将 `when` 用作语句的例子:
* 将条件表达式放在小括号 `()` 之内, 将各个条件分支需要进行的操作放在大括号 `{}` 之内.
* 在每个分支中, 使用 `->` 分隔分支条件与对应的操作.

```kotlin
fun main() {
//sampleStart
    val obj = "Hello"

    when (obj) {
        // 检查 obj 是否等于 "1"
        "1" -> println("One")
        // 检查 obj 是否等于 "Hello"
        "Hello" -> println("Greeting")
        // 默认语句
        else -> println("Unknown")
    }
    // 输出结果为 Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-statement"}

> 注意, 会按顺序检查所有的分支条件, 直到遇到一个条件被满足.
> 因此只有第一个满足条件的分支会被执行.
>
{style="note"}

下面是将 `when` 用作表达式的例子.
`when` 表达式的结果会被立即赋值给一个变量:

```kotlin
fun main() {
//sampleStart
    val obj = "Hello"

    val result = when (obj) {
        // 如果 obj 等于 "1", 将 result 设置为 "one"
        "1" -> "One"
        // 如果 obj 等于 "Hello", 将 result 设置为 "Greeting"
        "Hello" -> "Greeting"
        // 如果前面的条件都不满足, 将 result 设置为 "Unknown"
        else -> "Unknown"
    }
    println(result)
    // 输出结果为 Greeting
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression"}

如果 `when` 被用作表达式, 必须存在 else 分支, 除非编译器能够检测出分支条件覆盖了所有的可能情况.

上面的例子演示了, `when` 可以用于对变量进行匹配.
`when` 还可以用于对一组 Boolean 表达式进行检查:

```kotlin
fun main() {
//sampleStart
    val temp = 18

    val description = when {
        // 如果 temp < 0 为 true, 将 description 设置为 "very cold"
        temp < 0 -> "very cold"
        // 如果 temp < 10 为 true, 将 description 设置为 "a bit cold"
        temp < 10 -> "a bit cold"
        // 如果 temp < 20 为 true, 将 description 设置为 "warm"
        temp < 20 -> "warm"
        // 如果前面的条件都不满足, 将  description 设置为 "hot"
        else -> "hot"
    }
    println(description)
    // 输出结果为 warm
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-when-expression-boolean"}

## 值范围

在讨论循环之前, 有必要了解如何构造一个作为循环迭代对象的值范围.

在 Kotlin 中, 创建值范围最常见的办法是使用 `..` 操作符.
例如, `1..4` 相当于 `1, 2, 3, 4`.

要声明一个值范围, 不包含它的终端值, 请使用 `..<` 操作符.
例如, `1..<4` 相当于 `1, 2, 3`.

要声明一个相反顺序的值范围, 请使用 `downTo.`
例如, `4 downTo 1` 相当于 `4, 3, 2, 1`.

要声明一个值范围, 递增步长不为 1, 请使用 `step` 指定你希望的递增步长值.
例如, `1..5 step 2` 相当于 `1, 3, 5`.

你也可以对 `Char` 的值范围进行相同的操作:
* `'a'..'d'` 相当于 `'a', 'b', 'c', 'd'`
* `'z' downTo 's' step 2` 相当于 `'z', 'x', 'v', 't'`

## 循环

在编程中两种最常见的循环结构是 `for` 和 `while`.
使用 `for` 可以对一个值范围进行遍历, 并执行某个操作.
使用 `while` 可以反复执行某个操作, 直到满足某个条件为止.

### for

使用关于值范围的新知识, 你可以创建一个 `for` 循环, 对数字 1 到 5 进行遍历, 并打印每个数字.

请将迭代器(iterator)和值范围放在小括号 `()` 之内, 并使用关键字 `in`.
将你想要执行的操作放在大括号 `{}` 之内:

```kotlin
fun main() {
//sampleStart
    for (number in 1..5) {
        // number 是迭代器(iterator), 1..5 是值范围
        print(number)
    }
    // 输出结果为 12345
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-for-loop"}

`for` 循环也可以对集合(Collection)进行遍历:

```kotlin
fun main() {
//sampleStart
    val cakes = listOf("carrot", "cheese", "chocolate")

    for (cake in cakes) {
        println("Yummy, it's a $cake cake!")
    }
    // 输出结果为 Yummy, it's a carrot cake!
    // 输出结果为 Yummy, it's a cheese cake!
    // 输出结果为 Yummy, it's a chocolate cake!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-for-collection-loop"}

### while

`while` 有两种使用方式:
  * 当一个条件表达式为 true 时, 执行一个代码段. (`while`)
  * 先执行一个代码段, 然后再检查条件表达式. (`do-while`)

在第一种使用场景 (`while`) 中:
* 在小括号 `()` 中声明条件表达式, 当满足这个条件表达式时, 循环会继续.
* 在大括号 `{}` 中, 添加你想要执行的操作.

> 下面的示例使用 [递增操作符](operator-overloading.md#increments-and-decrements) `++`
> 来增加 `cakesEaten` 变量的值.
>
{style="note"}

```kotlin
fun main() {
//sampleStart
    var cakesEaten = 0
    while (cakesEaten < 3) {
        println("Eat a cake")
        cakesEaten++
    }
    // 输出结果为 Eat a cake
    // 输出结果为 Eat a cake
    // 输出结果为 Eat a cake
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-while-loop"}

在第二种使用场景 (`do-while`) 中:
* 在小括号 `()` 中声明条件表达式, 当满足这个条件表达式时, 循环会继续.
* 在大括号 `{}` 中, 添加你想要执行的操作, 并添加关键字 `do`.

```kotlin
fun main() {
//sampleStart
    var cakesEaten = 0
    var cakesBaked = 0
    while (cakesEaten < 3) {
        println("Eat a cake")
        cakesEaten++
    }
    do {
        println("Bake a cake")
        cakesBaked++
    } while (cakesBaked < cakesEaten)
    // 输出结果为 Eat a cake
    // 输出结果为 Eat a cake
    // 输出结果为 Eat a cake
    // 输出结果为 Bake a cake
    // 输出结果为 Bake a cake
    // 输出结果为 Bake a cake
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-while-do-loop"}

关于条件表达式与循环的更多示例, 请参见 [条件与循环](control-flow.md).

现在你已经直到了 Kotlin 控制流的基本知识, 下面我们来学习如何编写你自己的 [函数](kotlin-tour-functions.md).

## 实际练习

### 习题 1 {collapsible="true"}

使用 `when` 表达式, 更新下面的程序, 当你输入 GameBoy 按钮的名称时, 打印对应的动作.

| **按钮** | **动作**                  |
|--------|-------------------------|
| A      | Yes                     |
| B      | No                      |
| X      | Menu                    |
| Y      | Nothing                 |
| 其他     | There is no such button |

|---|---|
```kotlin
fun main() {
    val button = "A"

    println(
        // 在这里编写你的代码
    )
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-exercise-1"}

|---|---|
```kotlin
fun main() {
    val button = "A"

    println(
        when (button) {
            "A" -> "Yes"
            "B" -> "No"
            "X" -> "Menu"
            "Y" -> "Nothing"
            else -> "There is no such button"
        }
    )
}
```
{collapsible="true" collapsed-title="参考答案" id="kotlin-tour-control-flow-solution-1"}

### 习题 2 {collapsible="true"}

你有一个程序, 计算批萨的片数, 直到有了 8 片, 组成一整个批萨.
请用两种方式重构这个程序:
* 使用 `while` 循环.
* 使用 `do-while` 循环.

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    // 要重构的代码从这里开始
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    println("There's only $pizzaSlices slice/s of pizza :(")
    pizzaSlices++
    // 要重构的代码到这里结束
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-exercise-2"}

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    while ( pizzaSlices < 7 ) {
        pizzaSlices++
        println("There's only $pizzaSlices slice/s of pizza :(")
    }
    pizzaSlices++
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}
```
{collapsible="true" collapsed-title="参考答案 1" id="kotlin-tour-control-flow-exercise-2-solution-1"}

|---|---|
```kotlin
fun main() {
    var pizzaSlices = 0
    pizzaSlices++
    do {
        println("There's only $pizzaSlices slice/s of pizza :(")
        pizzaSlices++
    } while ( pizzaSlices < 8 )
    println("There are $pizzaSlices slices of pizza. Hooray! We have a whole pizza! :D")
}

```
{collapsible="true" collapsed-title="参考答案 2" id="kotlin-tour-control-flow-exercise-2-solution-2"}

### 习题 3 {collapsible="true"}

编写一个程序, 模拟 [Fizz buzz](https://en.wikipedia.org/wiki/Fizz_buzz) 游戏.
你的任务是打印从 1 到 100 的数字, 如果数字能被 3 整除, 则将它替换为 "fizz", 能被 5 整除, 则将它替换为 "buzz".
同时能被 3 和 5 整除, 则将它替换为 "fizzbuzz".

<deflist collapsible="true">
    <def title="提示">
        使用 <code>for</code> 循环来计数, 使用 <code>when</code> 表达式来决定每一步打印什么内容.
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    // 在这里编写你的代码
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-exercise-3"}

|---|---|
```kotlin
fun main() {
    for (number in 1..100) {
        println(
            when {
                number % 15 == 0 -> "fizzbuzz"
                number % 3 == 0 -> "fizz"
                number % 5 == 0 -> "buzz"
                else -> number.toString()
            }
        )
    }
}
```
{collapsible="true" collapsed-title="参考答案" id="kotlin-tour-control-flow-solution-3"}

### 习题 4 {collapsible="true"}

你有一个单词列表. 使用 `for` 和 `if` 来打印以 `l` 字母开头的单词.

<deflist collapsible="true">
    <def title="提示">
        使用 <code>String</code> 类型的 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/starts-with.html"> <code>.startsWith()</code>
        </a> 函数.
    </def>
</deflist>

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    // 在这里编写你的代码
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-control-flow-exercise-4"}

|---|---|
```kotlin
fun main() {
    val words = listOf("dinosaur", "limousine", "magazine", "language")
    for (w in words) {
        if (w.startsWith("l"))
            println(w)
    }
}
```
{collapsible="true" collapsed-title="参考答案" id="kotlin-tour-control-flow-solution-4"}

## 下一步

[函数](kotlin-tour-functions.md)
