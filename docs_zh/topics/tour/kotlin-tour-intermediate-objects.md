[//]: # (title: 对象)

在这一章中, 你将探索对象声明, 扩展对类的理解.
这些知识将帮助你高效的管理整个项目的行为.

## 对象声明 {id="object-declarations"}

在 Kotlin 中, 你可以使用 **对象 声明** 来声明一个只有唯一实例的类.
从某种意义上说, 你在声明类的 _同时_ 也就创建了唯一的实例.
当你想要创建一个类, 并以你的程序中的唯一引用点的方式使用它, 或者想要协调它在整个系统中的行为, 对象声明会非常有用.

> 只有唯一一个易于访问的实例的类, 称为 **单例(singleton)**.
>
{style="tip"}

Kotlin 中的对象是 **延迟加载(lazy)** 的, 意思就是说, 它们只在被访问的时候才创建.
Kotlin 还会确保所有的对象以线程安全的方式创建, 因此你不必手动检查.

要创建一个对象声明, 请使用 `object` 关键字:

```kotlin
object DoAuth {}
```

之后是你的 `object` 的名称, 并在大括号 `{}` 表示的对象 body 部中添加属性或成员函数.

> 对象不能拥有构造器, 因此它们没有像类那样的头部.
>
{style="note"}

例如, 假设你想要创建一个对象, 名为 `DoAuth`, 负责身份验证:

```kotlin
object DoAuth {
    fun takeParams(username: String, password: String) {
        println("input Auth parameters = $username:$password")
    }
}

fun main(){
    // 当 takeParams() 函数被调用时, 对象被创建
    DoAuth.takeParams("coding_ninja", "N1njaC0ding!")
    // 输出结果为: input Auth parameters = coding_ninja:N1njaC0ding!
}
```
{kotlin-runnable="true" id="kotlin-tour-object-declarations"}

这个对象有一个成员函数, 名为 `takeParams`, 参数是 `username` 和 `password` 变量, 并打印一个字符串到控制台.
只有在函数初次被调用时, `DoAuth` 对象才会被创建.

> 对象可以从类和接口继承. 例如:
> 
> ```kotlin
> interface Auth {
>     fun takeParams(username: String, password: String)
> }
>
> object DoAuth : Auth {
>     override fun takeParams(username: String, password: String) {
>         println("input Auth parameters = $username:$password")
>     }
> }
> ```
>
{style="note"}

#### 数据对象(Data Object) {id="data-objects"}

为了更容易的打印输出对象声明的内容, Kotlin 提供了 **数据(Data)** 对象.
与你在初学者教程中学过的数据类类似, 数据对象自动带有额外的成员函数: `toString()` 和 `equals()`.

> 与数据类不同, 数据对象没有自动带有 `copy()` 成员函数, 因为它们只有唯一的实例, 不能复制.
>
{type ="note"}

要创建一个数据对象, 请使用与对象声明相同的语法, 但前面加上 `data` 关键字:

```kotlin
data object AppConfig {}
```

例如:

```kotlin
data object AppConfig {
    var appName: String = "My Application"
    var version: String = "1.0.0"
}

fun main() {
    println(AppConfig)
    // 输出结果为: AppConfig
    
    println(AppConfig.appName)
    // 输出结果为: My Application
}
```
{kotlin-runnable="true" id="kotlin-tour-data-objects"}

关于数据对象, 详情请参见 [](object-declarations.md#data-objects).

#### 同伴对象(Companion Object) {id="companion-objects"}

在 Kotlin 中, 一个类可以带有一个对象: 一个 **同伴(Companion)** 对象. 对每个类, 你只能有 **一个** 同伴对象.
只有在类初次被引用时, 同伴对象才会被创建.

在同伴对象之内声明的任何属性或函数, 都在类的所有实例之间共享.

要在一个类之内创建一个同伴对象, 请使用与对象声明相同的语法, 但前面加上 `companion` 关键字:

```kotlin
companion object Bonger {}
```

> 同伴对象不一定需要名称. 如果你没有定义名称, 则默认名称为 `Companion`.
> 
{style="note"}

要访问同伴对象的任何属性或函数, 请通过类名称来引用它. 例如:

```kotlin
class BigBen {
    companion object Bonger {
        fun getBongs(nTimes: Int) {
            repeat(nTimes) { print("BONG ") }
            }
        }
    }

fun main() {
    // 当类初次被引用时, 同伴对象被创建.
    BigBen.getBongs(12)
    // 输出结果为: BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-companion-object"}

这个示例创建了一个类, 名为 `BigBen`, 它包含一个同伴对象, 名为 `Bonger`.
同伴对象有一个成员函数, 名为 `getBongs()`, 接受一个整数参数, 并打印 `"BONG"` 到控制台, 打印次数与整数参数相同.

在 `main()` 函数 中, 通过类的名称调用了 `getBongs()` 函数.
同伴对象会在这个时候被创建. 调用 `getBongs()` 函数的参数是 `12`.

详情请参见 [](object-declarations.md#companion-objects).

## 实际练习 {completion-point="true" id="practice"}

### 习题 1 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-1"}

你运营着一个咖啡店, 并有一个系统来追踪客户订单.
请参考下面的代码, 并完成第 2 个数据对象的声明, 让 `main()` 函数中的以下代码成功运行:

|---|---|

```kotlin
interface Order {
    val orderId: String
    val customerName: String
    val orderTotal: Double
}

data object OrderOne: Order {
    override val orderId = "001"
    override val customerName = "Alice"
    override val orderTotal = 15.50
}

data object // 请在这里编写你的代码

fun main() {
    // 打印输出每个数据对象的名称
    println("Order name: $OrderOne")
    // 输出结果为: Order name: OrderOne
    println("Order name: $OrderTwo")
    // 输出结果为: Order name: OrderTwo

    // 检查订单是否相同
    println("Are the two orders identical? ${OrderOne == OrderTwo}")
    // 输出结果为: Are the two orders identical? false

    if (OrderOne == OrderTwo) {
        println("The orders are identical.")
    } else {
        println("The orders are unique.")
        // 输出结果为: The orders are unique.
    }

    println("Do the orders have the same customer name? ${OrderOne.customerName == OrderTwo.customerName}")
    // 输出结果为: Do the orders have the same customer name? false
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-1"}

|---|---|
```kotlin
interface Order {
    val orderId: String
    val customerName: String
    val orderTotal: Double
}

data object OrderOne: Order {
    override val orderId = "001"
    override val customerName = "Alice"
    override val orderTotal = 15.50
}

data object OrderTwo: Order {
    override val orderId = "002"
    override val customerName = "Bob"
    override val orderTotal = 12.75
}

fun main() {
    // 打印输出每个数据对象的名称
    println("Order name: $OrderOne")
    // 输出结果为: Order name: OrderOne
    println("Order name: $OrderTwo")
    // 输出结果为: Order name: OrderTwo

    // 检查订单是否相同
    println("Are the two orders identical? ${OrderOne == OrderTwo}")
    // 输出结果为: Are the two orders identical? false

    if (OrderOne == OrderTwo) {
        println("The orders are identical.")
    } else {
        println("The orders are unique.")
        // 输出结果为: The orders are unique.
    }

    println("Do the orders have the same customer name? ${OrderOne.customerName == OrderTwo.customerName}")
    // 输出结果为: Do the orders have the same customer name? false
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-objects-solution-1"}

### 习题 2 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-2"}

创建一个对象声明, 继承自 `Vehicle` 接口, 以创建一个唯一的车辆类型: `FlyingSkateboard`.
实现你的对象中的 `name` 属性和 `move()` 函数, 让 `main()` 函数中的以下代码成功运行:

|---|---|

```kotlin
interface Vehicle {
    val name: String
    fun move(): String
}

object // 请在这里编写你的代码

fun main() {
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.move()}")
    // 输出结果为: Flying Skateboard: Glides through the air with a hover engine
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.fly()}")
    // 输出结果为: Flying Skateboard: Woooooooo
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-2"}

|---|---|
```kotlin
interface Vehicle {
    val name: String
    fun move(): String
}

object FlyingSkateboard : Vehicle {
    override val name = "Flying Skateboard"
    override fun move() = "Glides through the air with a hover engine"

   fun fly(): String = "Woooooooo"
}

fun main() {
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.move()}")
    // 输出结果为: Flying Skateboard: Glides through the air with a hover engine
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.fly()}")
    // 输出结果为: Flying Skateboard: Woooooooo
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-objects-solution-2"}

### 习题 3 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-3"}

你在为一个 App 构建用户注册模块. 你想要将 EMail 验证逻辑与 `User` 类关联起来,
但如果 EMail 地址无效, 不想创建不必要的 `User` 实例.

在这个习题中, 如果 EMail 地址同时包含 `@` 和 `.`, 则认为有效.
请完成数据类, 让 `main()` 函数中的以下代码成功运行:

<deflist collapsible="true">
    <def title="提示">
        在 `User` 类的同伴对象中添加 EMail 验证函数, 这样就可以直接在 `User` 类上调用函数.
    </def>
</deflist>

|---|---|
```kotlin
data class User(val name: String, val email: String) {
    // 请在这里编写你的代码
}

fun main() {
    val candidates = listOf(
        Pair("Alice", "alice@example.com"),
        Pair("Bob", "bob2example-com")
    )

    for ((name, email) in candidates) {
        if (User.isValidEmail(email)) {
            val user = User(name, email)
            println("Registered: ${user.name}, ${user.email}")
            // 输出结果为: Registered: Alice, alice@example.com
        } else {
            println("Error: '${email}' is not valid. The email should contain '@' and '.'")
            // 输出结果为: Error: 'bob2example-com' is not valid. The email should contain '@' and '.'
        }
    }
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-3"}

|---|---|
```kotlin
data class User(val name: String, val email: String) {
    companion object {
        fun isValidEmail(email: String): Boolean =
            email.contains('@') && email.contains('.')
    }
}

fun main() {
    val candidates = listOf(
        Pair("Alice", "alice@example.com"),
        Pair("Bob", "bob2example-com")
    )

    for ((name, email) in candidates) {
        if (User.isValidEmail(email)) {
            val user = User(name, email)
            println("Registered: ${user.name}, ${user.email}")
            // 输出结果为: Registered: Alice, alice@example.com
        } else {
            println("Error: '${email}' is not valid. The email should contain '@' and '.'")
            // 输出结果为: Error: 'bob2example-com' is not valid. The email should contain '@' and '.'
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-objects-solution-3"}

> 作为这个习题的延伸, 请尝试使用同伴对象中的函数, 作为工厂方法来构造类的实例.
> 关于这种模式的示例和更多详情, 请参见 [](object-declarations.md#companion-objects).
>
{style="tip"}

## 下一步 {id="next-step"}

[中级教程: 开放类与特殊类](kotlin-tour-intermediate-open-special-classes.md)
