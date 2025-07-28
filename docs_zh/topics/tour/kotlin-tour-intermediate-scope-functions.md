[//]: # (title: 中级教程: 作用域函数(Scope Function))

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2.svg" width="20" alt="Second step" /> <strong>作用域函数</strong><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接受者的 Lambda 表达式</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类与接口</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">开放类与特殊类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null 值安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库与 API</a></p>
</tldr>

在这一章中, 你在对扩展函数的理解的基础之上, 学习如何使用作用域函数来编写更加符合 Kotlin 惯用法的代码.

## 作用域函数(Scope Function) {id="scope-functions"}

在编程中, 作用域(scope) 是指一个能够识别变量或对象的区域.
最常见的作用域是全局作用域和局部作用域:

* **全局作用域(Global Scope)** – 能够从程序任何位置访问的变量或对象.
* **局部作用域(Local Scope)** – 只能在定义它的代码块或函数之内访问的变量或对象.

在 Kotlin 中, 还有作用域函数(Scope Function), 能够围绕一个对象创建临时作用域, 并执行一些代码.

作用域函数能够让你的代码更加简洁, 因为在临时作用域内, 你不必引用你的对象的名称.
根据作用域函数不同, 你可以通过关键字 `this` 来引用对象, 或者通过关键字 `it`, 将它作为一个参数来访问.

Kotlin 共有 5 个作用域函数: `let`, `apply`, `run`, `also`, 和 `with`.

每个作用域函数接受一个 Lambda 表达式参数, 并返回对象, 或返回 Lambda 表达式的结构.
在这篇教程, 我们会解释每个作用域函数, 以及如何使用.

> 你也可以观看视频 [回到标准库: 充分利用 Kotlin 的标准库](https://youtu.be/DdvgvSHrN9g?feature=shared&t=1511),
> 由 Sebastian Aigner(Kotlin 开发者 Advocate)讲解作用域函数.
> 
{style="tip"}

### let {id="let"}

当你想要在代码中执行 null 值检查, 然后对返回的对象执行进一步操作, 可以使用 `let` 作用域函数.

看看这个示例:

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() {
    val address: String? = getNextAddress()
    sendNotification(address)
}
```
{validate = "false"}

这个示例有 2 个函数:
* `sendNotification()`, 有一个函数参数 `recipientAddress`, 返回一个字符串.
* `getNextAddress()`, 没有函数参数, 返回一个字符串.

这个示例创建一个变量 `address`, 类型是可为 null 的 `String`.
但当你调用 `sendNotification()` 函数时这会成为问题, 因为这个函数要求 `address` 不能是 `null` 值.
结果是编译器会报告错误:

```text
Argument type mismatch: actual type is 'String?', but 'String' was expected.
```

在初学者教程中, 你已经知道了可以使用 if 条件, 或使用 [Elvis 操作符 `?:`](kotlin-tour-null-safety.md#use-elvis-operator), 执行 null 值检查.
但如果你想要在之后的代码中使用返回的对象, 应该怎么办?
你可以使用 if 条件 **和** 一个 else 分支来实现:

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() {
    //sampleStart
    val address: String? = getNextAddress()
    val confirm = if(address != null) {
        sendNotification(address)
    } else { null }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-let-non-null-if"}

但是, 更加简洁的方法是使用 `let` 作用域函数:

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() {
    //sampleStart
    val address: String? = getNextAddress()
    val confirm = address?.let {
        sendNotification(it)
    }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-let-non-null"}

这个示例中:
* 创建一个变量, 名为 `address`.
* 在 `address` 变量上, 对 `let` 作用域函数使用一个安全调用.
* 在 `let` 作用域函数之内, 创建一个临时作用域.
* 将 `sendNotification()` 函数作为一个 Lambda 表达式, 传递给 `let` 作用域函数.
* 使用临时作用域, 通过 `it` 引用 `address` 变量.
* 将结果赋值给 `confirm` 变量.

通过这种方式, 你的代码能够处理 `address` 变量可能为 `null` 值的情况, 而且你能够在之后的代码中使用
`confirm` 变量.

### apply {id="apply"}

使用 `apply` 作用域函数, 能够在创建时而不是在之后的代码中初始化对象, 例如一个类实例.
这种方法能够让你的代码更加易于阅读和管理.

看看这个示例:

```kotlin
class Client() {
    var token: String? = null
    fun connect() = println("connected!")
    fun authenticate() = println("authenticated!")
    fun getData(): String = "Mock data"
}

val client = Client()

fun main() {
    client.token = "asdf"
    client.connect()
    // 输出结果为: connected!
    client.authenticate()
    // 输出结果为: authenticated!
    client.getData()
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-apply-before"}

这个示例有一个 `Client` 类, 包含一个属性, 名为 `token`,
以及 3 个成员函数: `connect()`, `authenticate()`, 和 `getData()`.

这个示例创建 `Client` 类的实例 `client`,
之后在 `main()` 函数中初始化它的 `token` 属性, 并调用它的成员函数.

尽管这个示例很小, 但在实际应用中, 在你创建一个类实例之后, 可能要经过一段时间才能配置和使用它(以及它的成员函数).
但是, 如果你使用 `apply` 作用域函数, 你就可以在代码的同一处, 创建, 配置, 并对你的类实例使用成员函数:

```kotlin
class Client() {
    var token: String? = null
    fun connect() = println("connected!")
    fun authenticate() = println("authenticated!")
    fun getData(): String = "Mock data"
}
//sampleStart
val client = Client().apply {
    token = "asdf"
    connect()
    authenticate()
}

fun main() {
    client.getData()
    // 输出结果为: connected!
    // 输出结果为: authenticated!
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-apply-after"}

这个示例中:

* 创建 `Client` 类的实例 `client`.
* 对 `client` 实例使用 `apply` 作用域函数.
* 在 `apply` 作用域函数之内创建一个临时作用域, 因此在访问它的属性或函数时, 你不必明确的引用 `client` 实例.
* 向 `apply` 作用域函数传递一个 Lambda 表达式, 它更新 `token` 属性, 并调用 `connect()` 和 `authenticate()` 函数.
* 在 `main()` 函数中, 对 `client` 实例调用 `getData()` 成员函数.

你可以看到, 当你处理大段代码时, 这种方法会很方便.

### run {id="run"}

与 `apply` 类似, 你可以使用 `run` 作用域函数来初始化一个对象,
但 `run` 最好的使用场景是, 在代码的某个特定时刻初始化一个对象, **并且** 立即计算一个结果.

我们继续前面的 `apply` 函数示例, 但这一次你想要将 `connect()` 和 `authenticate()` 函数组合在一起,
使它们对每一个请求都会被调用.

例如:

```kotlin
class Client() {
    var token: String? = null
    fun connect() = println("connected!")
    fun authenticate() = println("authenticated!")
    fun getData(): String = "Mock data"
}

//sampleStart
val client: Client = Client().apply {
    token = "asdf"
}

fun main() {
    val result: String = client.run {
        connect()
        // 输出结果为: connected!
        authenticate()
        // 输出结果为: authenticated!
        getData()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-run"}

这个示例中:

* 创建 `Client` 类的实例 `client`.
* 对 `client` 实例使用 `apply` 作用域函数.
* 在 `apply` 作用域函数之内创建一个临时作用域, 因此在访问它的属性或函数时, 你不必明确的引用 `client` 实例.
* 向 `apply` 作用域函数传递一个 Lambda 表达式, 它更新 `token` 属性.

`main()` 函数中:

* 创建一个 `result` 变量, 类型为 `String`.
* 对 `client` 实例使用 `run` 作用域函数.
* 在 `run` 作用域函数之内创建一个临时作用域, 因此在访问它的属性或函数时, 你不必明确的引用 `client` 实例.
* 向 `run` 作用域函数传递一个 Lambda 表达式, 它调用 `connect()`, `authenticate()`, 和 `getData()` 函数.
* 将结果赋值给 `result` 变量.

现在你可以在后续代码中使用返回的结果了.

### also {id="also"}

使用 `also` 作用域函数, 对一个对象完成一个额外的动作, 然后返回对象在代码中继续使用, 例如输出一个 log.

看看这个示例:

```kotlin
fun main() {
    val medals: List<String> = listOf("Gold", "Silver", "Bronze")
    val reversedLongUppercaseMedals: List<String> =
        medals
            .map { it.uppercase() }
            .filter { it.length > 4 }
            .reversed()
    println(reversedLongUppercaseMedals)
    // 输出结果为: [BRONZE, SILVER]
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-also-before"}

这个示例中:

* 创建 `medals` 变量, 包含一个字符串 List.
* 创建 `reversedLongUpperCaseMedals` 变量, 类型为 `List<String>`.
* 对 `medals` 变量使用 `.map()` 扩展函数.
* 向 `.map()` 函数传递一个 Lambda 表达式, 它通过 `it` 关键字引用 `medals`, 并对它调用 `.uppercase()` 扩展函数.
* 对 `medals` 变量使用 `.filter()` 扩展函数.
* 向 `.filter()` 函数传递一个 Lambda 表达式, 作为判定条件, 它通过 `it` 关键字引用 `medals`, 并检查 `medals` 变量中包含的字符串长度是否超过 4 个字符.
* 对 `medals` 变量使用 `.reversed()` 扩展函数.
* 将结果赋值给 `reversedLongUpperCaseMedals` 变量.
* 打印输出 `reversedLongUpperCaseMedals` 变量中包含的列表.

如果能在函数调用之间添加一些 log 会非常有用, 这样就可以看到 `medals` 变量发生了什么变化.
`also` 函数能够帮助我们实现这一点:

```kotlin
fun main() {
    val medals: List<String> = listOf("Gold", "Silver", "Bronze")
    val reversedLongUppercaseMedals: List<String> =
        medals
            .map { it.uppercase() }
            .also { println(it) }
            // 输出结果为: [GOLD, SILVER, BRONZE]
            .filter { it.length > 4 }
            .also { println(it) }
            // 输出结果为: [SILVER, BRONZE]
            .reversed()
    println(reversedLongUppercaseMedals)
    // 输出结果为: [BRONZE, SILVER]
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-also-after"}

现在, 在这个示例中:

* 对 `medals` 变量使用 `also` 作用域函数.
* 在 `also` 作用域函数之内创建一个临时作用域, 因此在将它用作函数参数时, 你不必明确的引用 `medals` 变量.
* 向 `also` 作用域函数传递一个 Lambda 表达式, 它调用 `println()` 函数, 通过 `it` 关键字, 使用 `medals` 变量作为函数参数.

由于 `also` 函数返回对象, 它不仅能够用于 log 输出, 还适合于调试, 链接多个操作, 以及执行其它不影响代码主体流程的副作用操作.

### with {id="with"}

与其它作用域函数不同, `with` 不是扩展函数, 因此语法不同.
你需要向 `with` 传递接受者对象作为参数.

当你想要对一个对象调用多个函数时, 可以使用 `with` 作用域函数.

看看这个示例:

```kotlin
class Canvas {
    fun rect(x: Int, y: Int, w: Int, h: Int): Unit = println("$x, $y, $w, $h")
    fun circ(x: Int, y: Int, rad: Int): Unit = println("$x, $y, $rad")
    fun text(x: Int, y: Int, str: String): Unit = println("$x, $y, $str")
}

fun main() {
    val mainMonitorPrimaryBufferBackedCanvas = Canvas()

    mainMonitorPrimaryBufferBackedCanvas.text(10, 10, "Foo")
    mainMonitorPrimaryBufferBackedCanvas.rect(20, 30, 100, 50)
    mainMonitorPrimaryBufferBackedCanvas.circ(40, 60, 25)
    mainMonitorPrimaryBufferBackedCanvas.text(15, 45, "Hello")
    mainMonitorPrimaryBufferBackedCanvas.rect(70, 80, 150, 100)
    mainMonitorPrimaryBufferBackedCanvas.circ(90, 110, 40)
    mainMonitorPrimaryBufferBackedCanvas.text(35, 55, "World")
    mainMonitorPrimaryBufferBackedCanvas.rect(120, 140, 200, 75)
    mainMonitorPrimaryBufferBackedCanvas.circ(160, 180, 55)
    mainMonitorPrimaryBufferBackedCanvas.text(50, 70, "Kotlin")
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-with-before"}

这个示例创建一个 `Canvas` 类, 有 3 个成员函数: `rect()`, `circ()`, 和 `text()`.
每个成员函数打印输出由你提供的函数参数构建的一个句子.

这个示例创建 `Canvas` 类的实例 `mainMonitorPrimaryBufferBackedCanvas`,
然后对这个实例, 使用不同的函数参数调用一系列的成员函数.

你可以看到, 这段代码很难阅读. 如果你使用 `with` 函数, 代码会变得非常精简:

```kotlin
class Canvas {
    fun rect(x: Int, y: Int, w: Int, h: Int): Unit = println("$x, $y, $w, $h")
    fun circ(x: Int, y: Int, rad: Int): Unit = println("$x, $y, $rad")
    fun text(x: Int, y: Int, str: String): Unit = println("$x, $y, $str")
}

fun main() {
    //sampleStart
    val mainMonitorSecondaryBufferBackedCanvas = Canvas()
    with(mainMonitorSecondaryBufferBackedCanvas) {
        text(10, 10, "Foo")
        rect(20, 30, 100, 50)
        circ(40, 60, 25)
        text(15, 45, "Hello")
        rect(70, 80, 150, 100)
        circ(90, 110, 40)
        text(35, 55, "World")
        rect(120, 140, 200, 75)
        circ(160, 180, 55)
        text(50, 70, "Kotlin")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-with-after"}

这个示例中:
* 使用 `with` 作用域函数, 将 `mainMonitorSecondaryBufferBackedCanvas` 实例作为接受者对象.
* 在 `with` 作用域函数之内创建一个临时作用域, 因此在调用它的成员函数, 你不必明确的引用 `mainMonitorSecondaryBufferBackedCanvas` 实例.
* 向 `with` 作用域函数传递一个 Lambda 表达式, 使用不同的函数参数调用一系列的成员函数.

现在这段代码变得更加容易阅读了, 犯错误的可能性也更低了.

## 使用场景概述 {id="use-case-overview"}

本节介绍 Kotlin 中的各种作用域函数, 以及它们的主要使用场景, 目的是让你的代码更加符合 Kotlin 惯用法.
你可以将这个表作为一个快速参考.
需要注意的是, 要在你的代码中使用这些函数, 你并不需要完全理解它们如何工作.

| 函数      | 访问 `x` 的方式 | 返回值           | 使用场景                               |
|---------|------------|---------------|------------------------------------|
| `let`   | `it`       | Lambda 表达式的结果 | 在你的代码中执行 null 值检查, 然后对返回的对象执行后续操作. |
| `apply` | `this`     | `x`           | 在创建时初始化对象.                         |
| `run`   | `this`     | Lambda 表达式的结果 | 在创建时初始化对象, **并** 计算一个结果.           |
| `also`  | `it`       | `x`           | 在返回对象之前进行额外的操作 .                   |
| `with`  | `this`     | Lambda 表达式的结果 | 在一个对象上调用多个函数 .                     |

关于作用域函数, 详情请参见 [作用域函数](scope-functions.md).

## 实际练习 {id="practice"}

### 习题 1 {initial-collapse-state="collapsed" collapsible="true" id="scope-functions-exercise-1"}

将 `.getPriceInEuros()` 函数重写为一个单一表达式函数, 它使用安全调用操作符 `?.` 和 `let` 作用域函数.

<deflist collapsible="true">
    <def title="提示">
        使用安全调用操作符 <code>?.</code> 以便安全的访问 <code>getProductInfo()</code> 函数的 <code>priceInDollars</code> 属性. 
        然后, 使用 <code>let</code> 作用域函数, 将 <code>priceInDollars</code> 的值转换为欧元.
    </def>
</deflist>

|---|---|
```kotlin
data class ProductInfo(val priceInDollars: Double?)

class Product {
    fun getProductInfo(): ProductInfo? {
        return ProductInfo(100.0)
    }
}

// 请重写这个函数
fun Product.getPriceInEuros(): Double? {
    val info = getProductInfo()
    if (info == null) return null
    val price = info.priceInDollars
    if (price == null) return null
    return convertToEuros(price)
}

fun convertToEuros(dollars: Double): Double {
    return dollars * 0.85
}

fun main() {
    val product = Product()
    val priceInEuros = product.getPriceInEuros()

    if (priceInEuros != null) {
        println("Price in Euros: €$priceInEuros")
        // 输出结果为: Price in Euros: €85.0
    } else {
        println("Price information is not available.")
    }
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-scope-functions-exercise-1"}

|---|---|
```kotlin
data class ProductInfo(val priceInDollars: Double?)

class Product {
    fun getProductInfo(): ProductInfo? {
        return ProductInfo(100.0)
    }
}

fun Product.getPriceInEuros() = getProductInfo()?.priceInDollars?.let { convertToEuros(it) }

fun convertToEuros(dollars: Double): Double {
    return dollars * 0.85
}

fun main() {
    val product = Product()
    val priceInEuros = product.getPriceInEuros()

    if (priceInEuros != null) {
        println("Price in Euros: €$priceInEuros")
        // 输出结果为: Price in Euros: €85.0
    } else {
        println("Price information is not available.")
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-scope-functions-solution-1"}

### 习题 2 {initial-collapse-state="collapsed" collapsible="true" id="scope-functions-exercise-2"}

你有一个 `updateEmail()` 函数, 它更新一个用户的 EMail 地址.
使用 `apply` 作用域函数来更新 EMail 地址, 然后使用 `also` 作用域函数打印输出一个 log 消息: `Updating email for user with ID: ${it.id}`.

|---|---|
```kotlin
data class User(val id: Int, var email: String)

fun updateEmail(user: User, newEmail: String): User = // 请在这里编写你的代码

fun main() {
    val user = User(1, "old_email@example.com")
    val updatedUser = updateEmail(user, "new_email@example.com")
    // 输出结果为: Updating email for user with ID: 1

    println("Updated User: $updatedUser")
    // 输出结果为: Updated User: User(id=1, email=new_email@example.com)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-scope-functions-exercise-2"}

|---|---|
```kotlin
data class User(val id: Int, var email: String)

fun updateEmail(user: User, newEmail: String): User = user.apply {
    this.email = newEmail
}.also { println("Updating email for user with ID: ${it.id}") }

fun main() {
    val user = User(1, "old_email@example.com")
    val updatedUser = updateEmail(user, "new_email@example.com")
    // 输出结果为: Updating email for user with ID: 1

    println("Updated User: $updatedUser")
    // 输出结果为: Updated User: User(id=1, email=new_email@example.com)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-scope-functions-solution-2"}

## 下一步 {id="next-step"}

[中级教程: 带接受者的 Lambda 表达式](kotlin-tour-intermediate-lambdas-receiver.md)
