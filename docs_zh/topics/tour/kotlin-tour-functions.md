[//]: # (title: 函数)

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第 1 步" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="第 2 步" /> <a href="kotlin-tour-basic-types.md">基本类型</a><br />
        <img src="icon-3-done.svg" width="20" alt="第 3 步" /> <a href="kotlin-tour-collections.md">集合(Collection)</a><br />
        <img src="icon-4-done.svg" width="20" alt="第 4 步" /> <a href="kotlin-tour-control-flow.md">控制流</a><br />
        <img src="icon-5.svg" width="20" alt="第 5 步" /> <strong>函数</strong><br />
        <img src="icon-6-todo.svg" width="20" alt="第 6 步" /> <a href="kotlin-tour-classes.md">类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="第 7 步" /> <a href="kotlin-tour-null-safety.md">Null 值安全性</a></p>
</tldr>

在 Kotlin 中, 你可以使用 `fun` 关键字声明你自己的函数.

```kotlin
fun hello() {
    return println("Hello, world!")
}

fun main() {
    hello()
    // 输出结果为 Hello, world!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-function-demo"}

在 Kotlin 中:

* 函数参数写在小括号 `()` 之内.
* 每个参数必须指定类型, 多个参数必须用逗号 `,` 隔开.
* 返回值类型写在函数的小括号 `()` 之后, 用冒号 `:` 隔开.
* 函数的 body 部写在大括号 `{}` 之内.
* `return` 关键字用来退出函数, 或从函数返回某个值.

> 如果函数不返回任何有用的值, 那么可以省略返回值类型和 `return` 关键字.
> 关于这个问题, 详情请参见 [没有返回值的函数](#functions-without-return).
>
{style="note"}

在下面的示例中:

* `x` 和 `y` 是函数参数.
* `x` 和 `y` 类型为 `Int`.
* 函数的返回值类型为 `Int`.
* 函数被调用时返回 `x` 和 `y` 的和.

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 输出结果为 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function"}

> 在我们的 [编码规约](coding-conventions.md#function-names) 中,
> 我们建议函数名称以小写字母开头, 并使用驼峰式大小写(Camel case), 不使用下划线.
>
{style="note"}

## 命名参数 {id="named-arguments"}

为了让代码更简洁, 调用函数时, 你不必指定参数名称.
但是, 指定参数名称可以让你的代码更易于阅读.
这种方式称为 **命名参数(named argument)**.
如果你指定了参数名称, 那么可以用任意的顺序来写这些参数.

> 在下面的示例中, 使用了 [字符串模板](strings.md#string-templates) (`$`) 来访问参数值,
> 并将它们转换为 `String` 类型, 然后拼接到一个字符串中, 用于打印输出.
>
{style="tip"}

```kotlin
fun printMessageWithPrefix(message: String, prefix: String) {
    println("[$prefix] $message")
}

fun main() {
    // 使用命名参数, 交换了参数的顺序
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // 输出结果为 [Log] Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-named-arguments-function"}

## 默认的参数值 {id="default-parameter-values"}

你可以为函数参数定义默认值. 调用你的函数时, 有默认值的参数可以省略.
要声明默认值, 请在参数类型之后使用赋值操作符 `=`:

```kotlin
fun printMessageWithPrefix(message: String, prefix: String = "Info") {
    println("[$prefix] $message")
}

fun main() {
    // 使用两个参数调用函数
    printMessageWithPrefix("Hello", "Log")
    // 输出结果为 [Log] Hello

    // 只使用 message 参数调用函数
    printMessageWithPrefix("Hello")
    // 输出结果为 [Info] Hello

    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // 输出结果为 [Log] Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-default-param-function"}

> 你可以跳过某个有默认值的参数, 而不是省略所有参数.
> 但是, 在第一个跳过的参数之后, 你必须对后续的所有参数指定名称.
>
{style="note"}

## 没有返回值的函数 {id="functions-without-return"}

如果你的函数不返回任何有用的值, 那么它的返回值类型为 `Unit`.
`Unit` 类型只有唯一的一个值 – `Unit`.
你不必在你的函数 body 部明确的声明返回值为 `Unit`.
因此你不必使用 `return` 关键字, 也不必声明返回值类型:

```kotlin
fun printMessage(message: String) {
    println(message)
    // `return Unit` 或 `return` 都是可选的
}

fun main() {
    printMessage("Hello")
    // 输出结果为 Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-unit-function"}

## 单一表达式函数 {id="single-expression-functions"}

为了让代码更加简洁, 你可以使用单一表达式函数. 例如, `sum()` 函数可以写得更短一些:

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 输出结果为 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function-before"}

你可以删除大括号 `{}`, 使用赋值操作符 `=` 来声明函数的 body 部.
当你使用赋值操作符 `=` 时, Kotlin 会使用类型推断, 因此你也可以省略返回值类型.
这样, `sum()` 函数就变成只有 1 行:

```kotlin
fun sum(x: Int, y: Int) = x + y

fun main() {
    println(sum(1, 2))
    // 输出结果为 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function-after"}

但是, 如果你想让你的代码能够被其他开发者快速理解, 那么即使使用赋值操作符 `=`, 也还是明确定义返回值类型更好一些.

> 如果你使用大括号 `{}` 来声明函数的 body 部, 那么必须声明返回类型, 否则返回值类型将是 `Unit`.
>
{style="note"}

## 函数中的提前返回 (Early Return) {id="early-returns-in-functions"}

如果想要你的函数中的代码在某个点之后不再进行后续处理, 请使用 `return` 关键字.
这个示例使用 `if` 判断, 如果条件表达式为真, 就从一个函数中提前返回:

```kotlin
// 注册的用户名列表
val registeredUsernames = mutableListOf("john_doe", "jane_smith")

// 注册 EMail 列表
val registeredEmails = mutableListOf("john@example.com", "jane@example.com")

fun registerUser(username: String, email: String): String {
    // 如果用户名已被使用, 则提前返回
    if (username in registeredUsernames) {
        return "Username already taken. Please choose a different username."
    }

    // 如果 EMail 已被注册, 则提前返回
    if (email in registeredEmails) {
        return "Email already registered. Please use a different email."
    }

    // 如果用户名和 EMail 都没有被使用, 则进行注册处理
    registeredUsernames.add(username)
    registeredEmails.add(email)

    return "User registered successfully: $username"
}

fun main() {
    println(registerUser("john_doe", "newjohn@example.com"))
    // 输出结果为: Username already taken. Please choose a different username.
    println(registerUser("new_user", "newuser@example.com"))
    // 输出结果为: User registered successfully: new_user
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-function-early-return"}

## 函数的实际练习 {id="functions-practice"}

### 习题 1 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-1"}

写一个名为 `circleArea` 的函数, 接受一个整数参数, 表示圆的半径, 输出圆的面积大小.

> 在这个习题中, 你会导入一个包, 以便通过 `PI` 来访问 pi 值.
> 关于包的导入, 更多详情请参见 [包与导入](packages.md).
>
{style="tip"}

|---|---|
```kotlin
import kotlin.math.PI

// 在这里编写你的代码

fun main() {
    println(circleArea(2))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-1"}

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double {
    return PI * radius * radius
}

fun main() {
    println(circleArea(2)) // 输出结果为 12.566370614359172
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-functions-solution-1"}

### 习题 2 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-2"}

将前一个习题中的 `circleArea` 函数重写为单一表达式函数.

|---|---|
```kotlin
import kotlin.math.PI

// 在这里编写你的代码

fun main() {
    println(circleArea(2))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-2"}

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double = PI * radius * radius

fun main() {
    println(circleArea(2)) // 输出结果为 12.566370614359172
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-functions-solution-2"}

### 习题 3 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-3"}

你有一个函数, 它接受一个时/分/秒单位给定的时间间隔, 然后翻译为秒单位.
大多数情况下, 你只需要传递 1 个或 2 个参数, 而其它参数为 0.
改进这个函数以及调用它的代码, 使用默认参数值和命名参数, 让代码更加易于阅读.

|---|---|
```kotlin
fun intervalInSeconds(hours: Int, minutes: Int, seconds: Int) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(1, 20, 15))
    println(intervalInSeconds(0, 1, 25))
    println(intervalInSeconds(2, 0, 0))
    println(intervalInSeconds(0, 10, 0))
    println(intervalInSeconds(1, 0, 1))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-3"}

|---|---|
```kotlin
fun intervalInSeconds(hours: Int = 0, minutes: Int = 0, seconds: Int = 0) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(1, 20, 15))
    println(intervalInSeconds(minutes = 1, seconds = 25))
    println(intervalInSeconds(hours = 2))
    println(intervalInSeconds(minutes = 10))
    println(intervalInSeconds(hours = 1, seconds = 1))
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-functions-solution-3"}

## Lambda 表达式 {id="lambda-expressions"}

Kotlin 允许你使用 Lambda 表达式, 为函数编写更加简洁的代码.

例如, 下面的 `uppercaseString()` 函数:

```kotlin
fun uppercaseString(text: String): String {
    return text.uppercase()
}
fun main() {
    println(uppercaseString("hello"))
    // 输出结果为 HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-before"}

可以写成一个 Lambda 表达式:

```kotlin
fun main() {
    val upperCaseString = { text: String -> text.uppercase() }
    println(upperCaseString("hello"))
    // 输出结果为 HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-variable"}

Lambda 表达式初看起来可能难于理解, 所以我们将它分解成各个部分.
Lambda 表达式写在大括号 `{}` 之内.

在 Lambda 表达式之内, 你会写以下内容:

* 参数, 在 `->` 之前.
* 函数 body 部, 在 `->` 之后.

在上面的示例中:

* `text` 是函数参数.
* `text` 类型为 `String`.
* 函数返回对 `text` 调用 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 函数的结果.
* 整个 Lambda 表达式通过赋值操作符 `=` 赋值给变量 `upperCaseString`.
* 象函数一样使用 `upperCaseString` 变量, 字符串 `"hello"` 作为参数, 就会调用 Lambda 表达式.
* `println()` 函数打印输出结果.

> 如果你声明没有参数的 Lambda 表达式, 那么不必使用 `->`. 例如:
> ```kotlin
> { println("Log message") }
> ```
>
{style="note"}

可以用很多方式使用 Lambda 表达式. 你可以:

* [将 Lambda 表达式用作另一个函数的参数](#pass-to-another-function)
* [从一个函数返回 Lambda 表达式](#return-from-a-function)
* [单独调用一个 Lambda 表达式](#invoke-separately)

### 传递给另一个函数 {id="pass-to-another-function"}

将 Lambda 表达式传递给另一个函数, 这个功能是很有用的, 一个很好的例子是对集合(Collection)使用
[`.filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 函数:

```kotlin
fun main() {
    //sampleStart
    val numbers = listOf(1, -2, 3, -4, 5, -6)

    val positives = numbers.filter ({ x -> x > 0 })

    val isNegative = { x: Int -> x < 0 }
    val negatives = numbers.filter(isNegative)

    println(positives)
    // 输出结果为 [1, 3, 5]
    println(negatives)
    // 输出结果为 [-2, -4, -6]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-filter"}

`.filter()` 函数接受一个 Lambda 表达式, 作为判定条件:

* `{ x -> x > 0 }` 接受 List 中的每个元素, 只返回正数.
* `{ x -> x < 0 }` 接受 List 中的每个元素, 只返回负数.

这个示例演示了将 Lambda 表达式传递给函数的两种方式:

* 对于正数, 示例直接在 `.filter()` 函数中添加 Lambda 表达式.
* 对于负数, 示例将 Lambda 表达式赋值给 `isNegative` 变量.
  然后将 `isNegative` 变量用作 `.filter()` 函数的参数.
  这种情况下, 你必须在 Lambda 表达式中指定函数参数 (`x`) 的类型.

> 如果一个 Lambda 表达式是函数的唯一参数, 你可以去掉函数的小括号 `()`:
>
> ```kotlin
> val positives = numbers.filter { x -> x > 0 }
> ```
>
> 这是 [尾缀 Lambda 表达式(Trailing Lambda)](#trailing-lambdas) 的一个例子, 我们会在本章末尾详细介绍.
>
{style="note"}

另一个好的例子是, 使用 [`.map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html)
函数, 对集合中的元素进行变换:

```kotlin
fun main() {
    //sampleStart
    val numbers = listOf(1, -2, 3, -4, 5, -6)
    val doubled = numbers.map { x -> x * 2 }

    val isTripled = { x: Int -> x * 3 }
    val tripled = numbers.map(isTripled)

    println(doubled)
    // 输出结果为 [2, -4, 6, -8, 10, -12]
    println(tripled)
    // 输出结果为 [3, -6, 9, -12, 15, -18]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-map"}

`.map()` 函数接受一个 Lambda 表达式, 作为变换函数:

* `{ x -> x * 2 }` 接受 List 中的每个元素, 返回这个元素乘以 2 的结果.
* `{ x -> x * 3 }` 接受 List 中的每个元素, 返回这个元素乘以 3 的结果.

### 函数类型 {id="function-types"}

在从一个函数返回一个 Lambda 表达式之前, 你首先需要理解 **函数类型**.

你已经学习了基本类型, 但函数本身也有它的类型.
Kotlin 的类型推断功能能够通过参数类型推断一个函数的类型.
但有的时候你需要明确指定函数类型.
编译器需要函数类型, 然后才能知道对这个函数允许什么, 不允许什么.

函数类型的语法包括:

* 每个参数的类型, 写在小括号 `()` 之内, 以逗号 `,` 分隔.
* 返回值类型, 写在 `->` 之后.

例如: `(String) -> String`, 或 `(Int, Int) -> Int`.

如果为 `upperCaseString()` 定义一个函数类型, 那么 Lambda 表达式如下:

```kotlin
val upperCaseString: (String) -> String = { text -> text.uppercase() }

fun main() {
    println(upperCaseString("hello"))
    // 输出结果为 HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-type"}

如果你的 Lambda 表达式没有参数, 那么小括号 `()` 保留为空. 例如: `() -> Unit`

> 你必须声明参数类型和返回值类型, 要么写在 Lambda 表达式内, 要么声明为函数类型.
> 否则, 编译器无法知道你的 Lambda 表达式的类型.
>
> 例如, 下面的代码无法工作:
>
> `val upperCaseString = { str -> str.uppercase() }`
>
{style="note"}

### 从函数中返回 {id="return-from-a-function"}

可以从函数中返回 Lambda 表达式.
为了让编译器知道返回的 Lambda 表达式 的类型, 你必须声明一个函数类型.

在下面的示例中, `toSeconds()` 函数返回的函数类型是 `(Int) -> Int`, 因为它总是返回一个 Lambda 表达式,
这个 Lambda 表达式接受一个 `Int` 类型的参数, 并返回一个 `Int` 值.

这个示例使用 `when` 表达式, 来确定在调用 `toSeconds()` 时返回哪个 Lambda 表达式:

```kotlin
fun toSeconds(time: String): (Int) -> Int = when (time) {
    "hour" -> { value -> value * 60 * 60 }
    "minute" -> { value -> value * 60 }
    "second" -> { value -> value }
    else -> { value -> value }
}

fun main() {
    val timesInMinutes = listOf(2, 10, 15, 1)
    val min2sec = toSeconds("minute")
    val totalTimeInSeconds = timesInMinutes.map(min2sec).sum()
    println("Total time is $totalTimeInSeconds secs")
    // 输出结果为 Total time is 1680 secs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-return-from-function"}

### 单独调用 {id="invoke-separately"}

Lambda 表达式可以单独调用, 方法是在大括号 `{}` 之后添加小括号 `()`, 并在小括号中加上参数:

```kotlin
fun main() {
    //sampleStart
    println({ text: String -> text.uppercase() }("hello"))
    // 输出结果为 HELLO
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-standalone"}

### 尾缀 Lambda 表达式(Trailing Lambda) {id="trailing-lambdas"}

你已经看到, 如果一个 Lambda 表达式是函数的唯一参数, 你可以去掉函数的小括号 `()`.
如果一个 Lambda 表达式是函数的最后一个参数, 那么 Lambda 表达式可以写在函数的小括号 `()` 之外.
对这两种情况, 这样的语法称为 **尾缀 Lambda 表达式(Trailing Lambda)**.

例如, [`.fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/fold.html)
函数接受一个初始值, 以及一个操作:

```kotlin
fun main() {
    //sampleStart
    // 初始值为 0.
    // 操作是对初始值累加 List 中的每个元素.
    println(listOf(1, 2, 3).fold(0, { x, item -> x + item })) // 输出结果为 6

    // 或者, 也可以写成 尾缀 Lambda 表达式的形式
    println(listOf(1, 2, 3).fold(0) { x, item -> x + item })  // 输出结果为 6
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-trailing-lambda"}

关于 Lambda 表达式, 更多详情请参见 [Lambda 表达式与匿名函数(Anonymous Function)](lambdas.md#lambda-expressions-and-anonymous-functions).

本教程的下一章是学习 Kotlin 中的 [类](kotlin-tour-classes.md).

## Lambda 表达式的实际练习 {id="lambda-expressions-practice"}

### 习题 1 {initial-collapse-state="collapsed" collapsible="true" id="lambdas-exercise-1"}

你有一个 Web Service 支持的动作列表, 所有请求的一个共通前缀, 某个资源的一个 ID.
要对资源 ID 5 请求 `title` 动作, 你需要创建下面的 URL: `https://example.com/book-info/5/title`.
使用一个 Lambda 表达式, 从动作列表创建对应的 URL 列表.

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = // 在这里编写你的代码
    println(urls)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambdas-exercise-1"}

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = actions.map { action -> "$prefix/$id/$action" }
    println(urls)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-lambdas-solution-1"}

### 习题 2 {initial-collapse-state="collapsed" collapsible="true" id="lambdas-exercise-2"}

编写一个函数, 接受一个 `Int` 值和一个动作 (一个 `() -> Unit` 类型的函数), 然后重复执行这个动作指定的次数.
然后使用这个函数打印 “Hello” 5 次.

|---|---|
```kotlin
fun repeatN(n: Int, action: () -> Unit) {
    // 在这里编写你的代码
}

fun main() {
    // 在这里编写你的代码
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambdas-exercise-2"}

|---|---|
```kotlin
fun repeatN(n: Int, action: () -> Unit) {
    for (i in 1..n) {
        action()
    }
}

fun main() {
    repeatN(5) {
        println("Hello")
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-lambdas-solution-2"}

## 下一步 {id="next-step"}

[类](kotlin-tour-classes.md)
