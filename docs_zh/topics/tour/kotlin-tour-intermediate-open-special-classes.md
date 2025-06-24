[//]: # (title: 中级教程: 开放类与特殊类)

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接受者的 Lambda 表达式</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类与接口</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6.svg" width="20" alt="Fourth step" /> <strong>开放类与特殊类</strong><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null 值安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库与 API</a></p>
</tldr>

在这一章中, 你将学习开放类, 它们如何与接口一起工作, 以及 Kotlin 中其他特殊类型的类.

## 开放类 {id="open-classes"}

如果你不能使用接口或抽象类, 你可以将一个类声明为 **open**, 明确的让它能够被继承.
方法是, 在你的类声明之前使用 `open` 关键字:

```kotlin
open class Vehicle
```

要创建一个从另一个类继承的类, 请在你的类头部之后添加一个冒号, 然后调用你想要继承的父类的构造器:

```kotlin
class Car : Vehicle
```
{validate="false"}

这个示例中, `Car` 类继承 `Vehicle` 类:

```kotlin
open class Vehicle(val make: String, val model: String)

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model)

fun main() {
    // 创建 Car 类的一个实例
    val car = Car("Toyota", "Corolla", 4)

    // 打印输出汽车的详细信息
    println("Car Info: Make - ${car.make}, Model - ${car.model}, Number of doors - ${car.numberOfDoors}")
    // 输出结果为: Car Info: Make - Toyota, Model - Corolla, Number of doors - 4
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-open-class"}

和创建普通类的实例一样, 如果你的类继承一个父类, 那么它必须初始化父类头部中定义的所有参数.
因此在这个示例中, `Car` 类的 `car` 实例初始化父类参数: `make` 和 `model`.

### 覆盖继承的行为 {id="overriding-inherited-behavior"}

如果你想要从一个类继承, 但改变某些行为, 你可以覆盖继承的行为.

默认情况下, 不能覆盖父类的成员函数或属性. 与抽象类一样, 你需要添加特殊的关键字.

#### 成员函数 {id="member-functions"}

要让父类中的函数能够被覆盖, 请在父类中它的声明之前使用 `open` 关键字:

```kotlin
open fun displayInfo() {}
```
{validate="false"}

要覆盖一个继承的成员函数, 请在子类中函数声明之前使用 `override` 关键字:

```kotlin
override fun displayInfo() {}
```
{validate="false"}

例如:

```kotlin
open class Vehicle(val make: String, val model: String) {
    open fun displayInfo() {
        println("Vehicle Info: Make - $make, Model - $model")
    }
}

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model) {
    override fun displayInfo() {
        println("Car Info: Make - $make, Model - $model, Number of Doors - $numberOfDoors")
    }
}

fun main() {
    val car1 = Car("Toyota", "Corolla", 4)
    val car2 = Car("Honda", "Civic", 2)

    // 使用覆盖的 displayInfo() 函数
    car1.displayInfo()
    // 输出结果为: Car Info: Make - Toyota, Model - Corolla, Number of Doors - 4
    car2.displayInfo()
    // 输出结果为: Car Info: Make - Honda, Model - Civic, Number of Doors - 2
}
```
{kotlin-runnable="true" id="kotlin-tour-class-override-function"}

在这个示例中:

* `Car` 类继承自 `Vehicle` 类, 创建 `Car` 类的 2 个实例: `car1` 和 `car2`.
* 在 `Car` 类中, 覆盖 `displayInfo()` 函数, 也打印输出车门数量.
* 对 `car1` 和 `car2` 实例调用覆盖的 `displayInfo()` 函数.

#### 属性 {id="properties"}

在 Kotlin 中, 使用 `open` 关键字让一个属性能够继承, 并在之后覆盖它, 这样的方法不是常见的做法.
大多数情况下, 使用抽象类或接口, 其中的属性默认能够继承.

开放类中的属性能够被子类访问. 一般来说, 最好直接访问属性, 而不要用新的属性覆盖它们.

例如, 假设你有一个属性 `transmissionType`, 你想要之后覆盖它.
覆盖属性的语法与覆盖成员函数完全一样. 你可以这样做:

```kotlin
open class Vehicle(val make: String, val model: String) {
    open val transmissionType: String = "Manual"
}

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model) {
    override val transmissionType: String = "Automatic"
}
```

但是, 这不是好的做法. 相反, 你可以将属性添加到可继承的类的构造中, 并在创建 `Car` 子类时声明它的值:

```kotlin
open class Vehicle(val make: String, val model: String, val transmissionType: String = "Manual")

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model, "Automatic")
```

直接访问属性, 而不是覆盖, 可以让代码更加简单, 更加易读.
只在父类中声明属性一次, 然后通过构造器传递属性值, 就不再需要在子类中进行覆盖.

关于类的继承, 以及覆盖类的行为, 详情请参见 [继承](inheritance.md).

### 开放类与接口 {id="open-classes-and-interfaces"}

你可以创建一个类, 它继承一个类 **并且** 实现多个接口.
这种情况下, 你必须在冒号之后先声明父类, 然后列出接口:

```kotlin
// 定义接口
interface EcoFriendly {
    val emissionLevel: String
}

interface ElectricVehicle {
    val batteryCapacity: Double
}

// 父类
open class Vehicle(val make: String, val model: String)

// 子类
open class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model)

// 新的类, 继承 Car, 并实现 2 个接口
class ElectricCar(
    make: String,
    model: String,
    numberOfDoors: Int,
    val capacity: Double,
    val emission: String
) : Car(make, model, numberOfDoors), EcoFriendly, ElectricVehicle {
    override val batteryCapacity: Double = capacity
    override val emissionLevel: String = emission
}
```

## 特殊类 {id="special-classes"}

除抽象类, 开放类, 数据类之外, Kotlin 还有一些特殊类型的类, 是为各种目的设计的,
例如限制特定的行为, 或减少创建小对象时的性能损失.

### 封闭类(Sealed Class) {id="sealed-classes"}

有些时候你可能会想要限制继承. 你可以使用封闭类(Sealed Class)来实现.
封闭类是一个特殊类型的 [抽象类](kotlin-tour-intermediate-classes-interfaces.md#abstract-classes).
一旦将一个类声明为封闭, 就只能在同一个包之内创建它的子类.
在这个范围之外, 不能继承封闭类.

> 包是一组相关的类和函数的代码的集合, 通常放在一个目录中.
> 关于 Kotlin 中的包, 详情请参见 [包与导入](packages.md).
> 
{style="tip"}

要创建一个封闭类, 请使用 `sealed` 关键字:

```kotlin
sealed class Mammal
```

封闭类在与 `when` 表达式一起使用时特别有用.
使用 `when` 表达式, 你可以对所有可能的子类定义行为. 例如:

```kotlin
sealed class Mammal(val name: String)

class Cat(val catName: String) : Mammal(catName)
class Human(val humanName: String, val job: String) : Mammal(humanName)

fun greetMammal(mammal: Mammal): String {
    when (mammal) {
        is Human -> return "Hello ${mammal.name}; You're working as a ${mammal.job}"
        is Cat -> return "Hello ${mammal.name}"
    }
}

fun main() {
    println(greetMammal(Cat("Snowy")))
    // 输出结果为: Hello Snowy
}
```
{kotlin-runnable="true" id="kotlin-tour-sealed-classes"}

在这个示例中:

* 有一个封闭类 `Mammal`, 构造器参数为 `name`.
* `Cat` 类继承 `Mammal` 封闭类, 并使用来自 `Mammal` 类的 `name` 参数, 作为它自己的构造器中的 `catName` 参数.
* `Human` 类继承 `Mammal` 封闭类, 并使用来自 `Mammal` 类的 `name` 参数, 作为它自己的构造器中的 `humanName` 参数.
  它的构造器中还有 `job` 参数.
* `greetMammal()` 函数接受 `Mammal` 类型的参数, 并返回一个字符串.
* 在 `greetMammal()` 的函数 body 部, 有一个 `when` 表达式, 使用 [`is` 操作符](typecasts.md#is-and-is-operators) 检查 `mammal` 的类型, 决定执行哪个动作.
* `main()` 函数调用 `greetMammal()` 函数, 使用 `Cat` 类的一个实例, `name` 参数为 `Snowy`.

> 这个教程系列关于 `is` 操作符的详细讨论, 请参见 [Null 值安全性](kotlin-tour-intermediate-null-safety.md).
> 
{style ="tip"}

关于封闭类, 以及推荐的使用场景, 详情请参见 [封闭类与封闭接口](sealed-classes.md).

### 枚举类(Enum Class) {id="enum-classes"}

当你想用一个类表达一组有限的, 不同的值, 适合使用枚举类(Enum Class).
一个枚举类包含一些枚举常数, 枚举常数自身又是枚举类的实例.

要创建枚举类, 请使用 `enum` 关键字:

```kotlin
enum class State
```

假设你想要创建一个枚举类, 包含一个进程的不同状态. 各个枚举常数必须使用逗号 `,` 分隔:

```kotlin
enum class State {
    IDLE, RUNNING, FINISHED
}
```

`State` 枚举类包含枚举常数: `IDLE`, `RUNNING`, 和 `FINISHED`.
要访问一个枚举常数, 请使用类名称, 加上 `.`, 再加上枚举常数的名称:

```kotlin
val state = State.RUNNING
```

你可以在 `when` 表达式中使用这个枚举类, 根据枚举常数的值定义要执行的动作:

```kotlin
enum class State {
    IDLE, RUNNING, FINISHED
}

fun main() {
    val state = State.RUNNING
    val message = when (state) {
        State.IDLE -> "It's idle"
        State.RUNNING -> "It's running"
        State.FINISHED -> "It's finished"
    }
    println(message)
    // 输出结果为: It's running
}
```
{kotlin-runnable="true" id="kotlin-tour-enum-classes"}

和通常的类一样, 枚举类可以拥有属性和成员函数.

例如, 假设你在使用 HTML, 想要创建一个枚举类, 包含一些颜色.
你想要每个颜色拥有一个属性, 假设叫做 `rgb`, 其中包含它们的 16 进制 RGB 值.
在创建枚举常数时, 你必须使用这个属性来初始化它:

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF),
    YELLOW(0xFFFF00)
}
```

> Kotlin 将 16 进制数保存为整数, 因此 `rgb` 属性使用 `Int` 类型, 而不是 `String` 类型.
>
{style="note"}

要添加对这个类一个成员函数, 将函数与枚举常数用分号 `;` 分隔:

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF),
    YELLOW(0xFFFF00);

    fun containsRed() = (this.rgb and 0xFF0000 != 0)
}

fun main() {
    val red = Color.RED
    
    // 对枚举常数调用 containsRed() 函数
    println(red.containsRed())
    // 输出结果为: true

    // 使用类名称, 对枚举常数调用 containsRed() 函数
    println(Color.BLUE.containsRed())
    // 输出结果为: false
  
    println(Color.YELLOW.containsRed())
    // 输出结果为: true
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-enum-classes-members"}

在这个示例中, `containsRed()` 成员函数使用 `this` 关键字访问枚举常数的 `rgb` 属性的值,
并检查 16 进制值的最先头的位是否包含 `FF`, 并返回一个 boolean 值.

详情请参见 [枚举类](enum-classes.md).

### 内联的值类(Inline Value Class) {id="inline-value-classes"}

有时候在你的代码中, 你可能想要创建小的类对象, 而且只是短暂的使用它们. 这种方法可能造成性能损失.
内联的值类(Inline Value Class) 是一种特殊类型的类, 可以避免这样的性能损失.
但是, 它们只能包含值.

要创建一个内联的值类, 请使用 `value` 关键字, 以及 `@JvmInline` 注解:

```kotlin
@JvmInline
value class Email
```

> `@JvmInline` 注解 指示 Kotlin 在编译代码时进行优化.
> 详情请参见 [注解](annotations.md).
> 
{style="tip"}

内联的值类 **必须** 拥有单个属性, 在类的 header 部初始化.

假设你想要创建一个类, 收集 EMail 地址:

```kotlin
// address 属性在类的 header 部初始化.
@JvmInline
value class Email(val address: String)

fun sendEmail(email: Email) {
    println("Sending email to ${email.address}")
}

fun main() {
    val myEmail = Email("example@example.com")
    sendEmail(myEmail)
    // 输出结果为: Sending email to example@example.com
}
```
{kotlin-runnable="true" id="kotlin-tour-inline-value-class"}

在这个示例中:

* `Email` 是一个内联的值类, 在类的 header 部有一个属性: `address`.
* `sendEmail()` 函数接受 `Email` 类型的对象作为参数, 并向标准输出打印一个字符串.
* `main()` 函数:
    * 创建 `Email` 类的一个实例 `email`.
    * 对 `email` 对象调用 `sendEmail()` 函数.

通过使用内联的值类, 你让你的类成为内联的, 可以在代码中直接使用它, 而不必创建对象.
这样可以显著的减少内存使用量, 并改善你的代码的运行时性能.

关于内联的值类, 详情请参见 [内联的值类](inline-classes.md).

## 实际练习 {id="practice"}

### 习题 1 {initial-collapse-state="collapsed" collapsible="true" id="special-classes-exercise-1"}

你管理着一家快递公司, 需要一种方法来追踪包裹的状态.
请创建一个封闭类 `DeliveryStatus`, 包含数据类, 表示以下状态: `Pending`, `InTransit`, `Delivered`, `Canceled`.
请完成 `DeliveryStatus` 类的声明, 让 `main()` 函数中的代码运行成功:

|---|---|

```kotlin
sealed class // 请在这里编写你的代码

fun printDeliveryStatus(status: DeliveryStatus) {
    when (status) {
        is DeliveryStatus.Pending -> {
            println("The package is pending pickup from ${status.sender}.")
        }
        is DeliveryStatus.InTransit -> {
            println("The package is in transit and expected to arrive by ${status.estimatedDeliveryDate}.")
        }
        is DeliveryStatus.Delivered -> {
            println("The package was delivered to ${status.recipient} on ${status.deliveryDate}.")
        }
        is DeliveryStatus.Canceled -> {
            println("The delivery was canceled due to: ${status.reason}.")
        }
    }
}

fun main() {
    val status1: DeliveryStatus = DeliveryStatus.Pending("Alice")
    val status2: DeliveryStatus = DeliveryStatus.InTransit("2024-11-20")
    val status3: DeliveryStatus = DeliveryStatus.Delivered("2024-11-18", "Bob")
    val status4: DeliveryStatus = DeliveryStatus.Canceled("Address not found")

    printDeliveryStatus(status1)
    // 输出结果为: The package is pending pickup from Alice.
    printDeliveryStatus(status2)
    // 输出结果为: The package is in transit and expected to arrive by 2024-11-20.
    printDeliveryStatus(status3)
    // 输出结果为: The package was delivered to Bob on 2024-11-18.
    printDeliveryStatus(status4)
    // 输出结果为: The delivery was canceled due to: Address not found.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-special-classes-exercise-1"}

|---|---|
```kotlin
sealed class DeliveryStatus {
    data class Pending(val sender: String) : DeliveryStatus()
    data class InTransit(val estimatedDeliveryDate: String) : DeliveryStatus()
    data class Delivered(val deliveryDate: String, val recipient: String) : DeliveryStatus()
    data class Canceled(val reason: String) : DeliveryStatus()
}

fun printDeliveryStatus(status: DeliveryStatus) {
    when (status) {
        is DeliveryStatus.Pending -> {
            println("The package is pending pickup from ${status.sender}.")
        }
        is DeliveryStatus.InTransit -> {
            println("The package is in transit and expected to arrive by ${status.estimatedDeliveryDate}.")
        }
        is DeliveryStatus.Delivered -> {
            println("The package was delivered to ${status.recipient} on ${status.deliveryDate}.")
        }
        is DeliveryStatus.Canceled -> {
            println("The delivery was canceled due to: ${status.reason}.")
        }
    }
}

fun main() {
    val status1: DeliveryStatus = DeliveryStatus.Pending("Alice")
    val status2: DeliveryStatus = DeliveryStatus.InTransit("2024-11-20")
    val status3: DeliveryStatus = DeliveryStatus.Delivered("2024-11-18", "Bob")
    val status4: DeliveryStatus = DeliveryStatus.Canceled("Address not found")

    printDeliveryStatus(status1)
    // 输出结果为: The package is pending pickup from Alice.
    printDeliveryStatus(status2)
    // 输出结果为: The package is in transit and expected to arrive by 2024-11-20.
    printDeliveryStatus(status3)
    // 输出结果为: The package was delivered to Bob on 2024-11-18.
    printDeliveryStatus(status4)
    // 输出结果为: The delivery was canceled due to: Address not found.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-special-classes-solution-1"}

### 习题 2 {initial-collapse-state="collapsed" collapsible="true" id="special-classes-exercise-2"}

在你的程序中, 需要处理不同状态和类型的错误.
你有一个封闭类, 捕捉数据类或对象中声明的各种状态.
请完成下面的代码, 创建枚举类 `Problem`, 表示不同的问题类型: `NETWORK`, `TIMEOUT`, and `UNKNOWN`.

|---|---|

```kotlin
sealed class Status {
    data object Loading : Status()
    data class Error(val problem: Problem) : Status() {
        // 请在这里编写你的代码
    }

    data class OK(val data: List<String>) : Status()
}

fun handleStatus(status: Status) {
    when (status) {
        is Status.Loading -> println("Loading...")
        is Status.OK -> println("Data received: ${status.data}")
        is Status.Error -> when (status.problem) {
            Status.Error.Problem.NETWORK -> println("Network issue")
            Status.Error.Problem.TIMEOUT -> println("Request timed out")
            Status.Error.Problem.UNKNOWN -> println("Unknown error occurred")
        }
    }
}

fun main() {
    val status1: Status = Status.Error(Status.Error.Problem.NETWORK)
    val status2: Status = Status.OK(listOf("Data1", "Data2"))

    handleStatus(status1)
    // 输出结果为: Network issue
    handleStatus(status2)
    // 输出结果为: Data received: [Data1, Data2]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-special-classes-exercise-2"}

|---|---|
```kotlin
sealed class Status {
    data object Loading : Status()
    data class Error(val problem: Problem) : Status() {
        enum class Problem {
            NETWORK,
            TIMEOUT,
            UNKNOWN
        }
    }

    data class OK(val data: List<String>) : Status()
}

fun handleStatus(status: Status) {
    when (status) {
        is Status.Loading -> println("Loading...")
        is Status.OK -> println("Data received: ${status.data}")
        is Status.Error -> when (status.problem) {
            Status.Error.Problem.NETWORK -> println("Network issue")
            Status.Error.Problem.TIMEOUT -> println("Request timed out")
            Status.Error.Problem.UNKNOWN -> println("Unknown error occurred")
        }
    }
}

fun main() {
    val status1: Status = Status.Error(Status.Error.Problem.NETWORK)
    val status2: Status = Status.OK(listOf("Data1", "Data2"))

    handleStatus(status1)
    // 输出结果为: Network issue
    handleStatus(status2)
    // 输出结果为: Data received: [Data1, Data2]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-special-classes-solution-2"}

## 下一步 {id="next-step"}

[中级教程: 属性](kotlin-tour-intermediate-properties.md)
