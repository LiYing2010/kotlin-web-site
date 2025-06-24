[//]: # (title: 中级教程: 对象)

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接受者的 Lambda 表达式</a><br /> 
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类与接口</a><br /> 
        <img src="icon-5.svg" width="20" alt="Fourth step" /> <strong>对象</strong><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">开放类与特殊类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null 值安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库与 API</a></p>
</tldr>

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

> 对象不能拥有构造器, 因此它们没有象类那样的头部.
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

## 实际练习 {id="practice"}

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

你有一个 App, 你想要用它记录温度. 类本身使用摄氏单位保存信息, 但你想要提供一个简单方法, 创建华氏单位的实例.
请完成数据类, 让 `main()` 函数中的以下代码成功运行:

<deflist collapsible="true">
    <def title="提示">
        使用同伴对象.
    </def>
</deflist>

|---|---|
```kotlin
data class Temperature(val celsius: Double) {
    val fahrenheit: Double = celsius * 9 / 5 + 32

    // 请在这里编写你的代码
}

fun main() {
    val fahrenheit = 90.0
    val temp = Temperature.fromFahrenheit(fahrenheit)
    println("${temp.celsius}°C is $fahrenheit °F")
    // 输出结果为: 32.22222222222222°C is 90.0 °F
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-3"}

|---|---|
```kotlin
data class Temperature(val celsius: Double) {
    val fahrenheit: Double = celsius * 9 / 5 + 32

    companion object {
        fun fromFahrenheit(fahrenheit: Double): Temperature = Temperature((fahrenheit - 32) * 5 / 9)
    }
}

fun main() {
    val fahrenheit = 90.0
    val temp = Temperature.fromFahrenheit(fahrenheit)
    println("${temp.celsius}°C is $fahrenheit °F")
    // 输出结果为: 32.22222222222222°C is 90.0 °F
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-objects-solution-3"}

## 下一步 {id="next-step"}

[中级教程: 开放类与特殊类](kotlin-tour-intermediate-open-special-classes.md)
