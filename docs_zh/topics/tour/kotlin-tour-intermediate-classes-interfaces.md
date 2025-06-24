[//]: # (title: 中级教程: 类与接口)

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接受者的 Lambda 表达式</a><br /> 
        <img src="icon-4.svg" width="20" alt="Fourth step" /> <strong>类与接口</strong><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">开放类与特殊类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null 值安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库与 API</a></p>
</tldr>

在初学者教程中, 你已经学习了如何使用类和数据类来保存数据, 以及维护一组能够在代码中共用的特性.
最终, 你会想要创建一个层级结构, 在你的项目中高效的共用代码.
本章介绍 Kotlin 为共用代码提供了哪些选择, 以及这些方案如何让你的代码更加安全, 更加易于维护.

## 类继承 {id="class-inheritance"}

在前一章, 我们介绍了如何使用扩展函数来扩展类, 而不必修改原来的源代码.
但如果你在处理一些复杂的任务, 需要在类 **之间** 共用代码, 那么应该怎么办?
对于这样的情况, 你可以使用类继承.

Kotlin 中的类默认不能继承. Kotlin 这样设计是为了防止意外的继承, 让你的类更易于维护.

Kotlin 类只支持 **单继承**, 意思是说 **一次只能从一个类** 继承.
被继承的这个类称为 **父类**.

一个类的父类又继承另一个类 (祖类), 构成一个层级结构.
Kotlin 的类层级结构的最顶端是共通的父类: `Any`. 所有的类都最终继承 `Any` 类:

![包含 Any 类型的类层级结构示例](any-type-class.png){width="200"}

`Any` 类自动提供了 `toString()` 函数, 作为它的成员函数.
因此, 你可以在任何类中使用这个继承得到的函数. 例如:

```kotlin
class Car(val make: String, val model: String, val numberOfDoors: Int)

fun main() {
    //sampleStart
    val car1 = Car("Toyota", "Corolla", 4)

    // 通过字符串模板使用 .toString() 函数, 打印输出类的属性
    println("Car1: make=${car1.make}, model=${car1.model}, numberOfDoors=${car1.numberOfDoors}")
    // 输出结果为: Car1: make=Toyota, model=Corolla, numberOfDoors=4
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-any-class"}

如果你想要使用继承在类之间共用某些代码, 首先请考虑使用抽象类.

### 抽象类 {id="abstract-classes"}

抽象类默认可以继承. 抽象类的目的是提供成员, 供其它类继承或实现.
因此, 它们有构造器, 但不能创建抽象类的实例.
在子类中, 使用 `override` 关键字来定义父类的属性和函数的行为.
通过这种方式, 可以说子类 "覆盖(override)" 了父类的成员.

> 当你定义继承的函数或属性的行为时, 我们称之为一个 **实现**.
> 
{style="tip"}

抽象类可以包含 **带有** 实现的函数和属性, 也可以包含 **没有** 实现的函数和属性, 称为抽象函数和属性.

要创建一个抽象类, 请使用 `abstract` 关键字:

```kotlin
abstract class Animal
```

要声明一个 **没有** 实现的函数或属性, 也使用 `abstract` 关键字:

```kotlin
abstract fun makeSound()
abstract val sound: String
```

例如, 假设你想要创建一个抽象类 `Product`, 并从它创建子类来定义不同的产品类别:

```kotlin
abstract class Product(val name: String, var price: Double) {
    // 抽象属性, 表示产品类别
    abstract val category: String

    // 一个函数, 可以由所有产品共用
    fun productInfo(): String {
        return "Product: $name, Category: $category, Price: $price"
    }
}
```

在这个抽象类中:

* 构造器有 2 个参数, 表示产品的 `name` 和 `price`.
* 有一个抽象属性, 包含产品类别, 类型是字符串.
* 有一个函数, 打印输出关于产品的信息.

我们来为电子产品创建一个子类.
在子类中为 `category` 属性定义实现之前, 你必须使用 `override` 关键字:

```kotlin
class Electronic(name: String, price: Double, val warranty: Int) : Product(name, price) {
    override val category = "Electronic"
}
```

`Electronic` 类:

* 继承 `Product` 抽象类.
* 构造器有一个额外的参数: `warranty`, 这是电子产品独有的.
* 覆盖了 `category` 属性, 包含字符串 `"Electronic"`.

现在, 你可以这样使用这些类:

```kotlin
abstract class Product(val name: String, var price: Double) {
    // 抽象属性, 表示产品类别
    abstract val category: String

    // 一个函数, 可以由所有产品共用
    fun productInfo(): String {
        return "Product: $name, Category: $category, Price: $price"
    }
}

class Electronic(name: String, price: Double, val warranty: Int) : Product(name, price) {
    override val category = "Electronic"
}

//sampleStart
fun main() {
    // 创建 Electronic 类的一个实例
    val laptop = Electronic(name = "Laptop", price = 1000.0, warranty = 2)

    println(laptop.productInfo())
    // 输出结果为: Product: Laptop, Category: Electronic, Price: 1000.0
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-abstract-class"}

尽管抽象类非常适合以这种方式共用代码, 但它们仍然存在限制, 因为 Kotlin 中的类只支持单继承.
如果你需要从多个来源继承, 请考虑使用接口.

## 接口 {id="interfaces"}

接口与类类似, 但有一些不同:

* 你不能创建接口的实例. 接口没有构造器或头部.
* 接口的函数和属性默认隐式的可以继承. 在 Kotlin 中, 我们称之为 "open".
* 如果你不为接口的函数提供实现, 不需要将函数标记为 `abstract`.

与抽象类类似, 可以使用接口来定义一组函数和属性, 之后供类继承和实现.
这种方式帮助你专注于由接口描述的抽象功能, 而不是具体的实现细节.
使用接口能够让你的代码:

* 更加模块化, 因为它隔离了不同的部分, 允许它们独自演化.
* 更易于理解, 因为它将相关的函数组合到一个内聚的功能集合中.
* 更易于测试, 因为你可以在测试中快速的使用 mock 替换真实的实现.

要声明一个接口, 请使用 `interface` 关键字:

```kotlin
interface PaymentMethod
```

### 接口实现 {id="interface-implementation"}

接口支持多继承, 因此类可以一次实现多个接口.
首先, 我们来看看类实现 **单个** 接口的场景.

要创建实现单个接口的类, 请在你的类头部之后添加冒号, 之后是想要实现的接口名称.
不要在接口名称之后使用括号 `()`, 因为接口没有构造器:

```kotlin
class CreditCardPayment : PaymentMethod
```

例如:

```kotlin
interface PaymentMethod {
    // 函数默认可以继承
    fun initiatePayment(amount: Double): String
}

class CreditCardPayment(val cardNumber: String, val cardHolderName: String, val expiryDate: String) : PaymentMethod {
    override fun initiatePayment(amount: Double): String {
        // 模拟使用信用卡处理支付
        return "Payment of $$amount initiated using Credit Card ending in ${cardNumber.takeLast(4)}."
    }
}

fun main() {
    val paymentMethod = CreditCardPayment("1234 5678 9012 3456", "John Doe", "12/25")
    println(paymentMethod.initiatePayment(100.0))
    // 输出结果为: Payment of $100.0 initiated using Credit Card ending in 3456.
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-inheritance"}

在这个示例中:

* `PaymentMethod` 是一个接口, 有一个 `initiatePayment()` 函数, 没有实现.
* `CreditCardPayment` 是一个类, 实现 `PaymentMethod` 接口.
* `CreditCardPayment` 类覆盖继承的 `initiatePayment()` 函数.
* `paymentMethod` 是 `CreditCardPayment` 类的一个实例.
* 在 `paymentMethod` 实例上, 调用覆盖的 `initiatePayment()` 函数, 使用参数 `100.0`.

要创建一个实现 **多个** 接口的类, 请在你的类头部之后添加冒号, 之后是想要实现的接口名称, 以逗号分隔:

```kotlin
class CreditCardPayment : PaymentMethod, PaymentType
```

例如:

```kotlin
interface PaymentMethod {
    fun initiatePayment(amount: Double): String
}

interface PaymentType {
    val paymentType: String
}

class CreditCardPayment(val cardNumber: String, val cardHolderName: String, val expiryDate: String) : PaymentMethod,
    PaymentType {
    override fun initiatePayment(amount: Double): String {
        // 模拟使用信用卡处理支付
        return "Payment of $$amount initiated using Credit Card ending in ${cardNumber.takeLast(4)}."
    }

    override val paymentType: String = "Credit Card"
}

fun main() {
    val paymentMethod = CreditCardPayment("1234 5678 9012 3456", "John Doe", "12/25")
    println(paymentMethod.initiatePayment(100.0))
    // 输出结果为: Payment of $100.0 initiated using Credit Card ending in 3456.

    println("Payment is by ${paymentMethod.paymentType}")
    // 输出结果为: Payment is by Credit Card
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-multiple-inheritance"}

在这个示例中:

* `PaymentMethod` 是一个接口, 有一个 `initiatePayment()` 函数, 没有实现.
* `PaymentType` 是一个接口, 有 `paymentType` 属性, 没有初始化.
* `CreditCardPayment` 是一个类, 实现 `PaymentMethod` 和 `PaymentType` 接口.
* `CreditCardPayment` 类覆盖继承的 `initiatePayment()` 函数和 `paymentType` 属性.
* `paymentMethod` 是 `CreditCardPayment` 类的一个实例.
* 在 `paymentMethod` 实例上, 调用覆盖的 `initiatePayment()` 函数, 使用参数 `100.0`.
* 在 `paymentMethod` 实例上, 访问覆盖的 `paymentType` 属性.

关于接口和接口继承, 详情请参见 [接口](interfaces.md).

## 委托 {id="delegation"}

接口是很有用的, 但如果你的接口包含很多函数, 子类可能会出现大量的样板代码.
当你只想覆盖父类的一小部分行为时, 你就需要大量的重复代码.

> 样板代码是指一块代码在软件项目的多个部分中重复使用, 只有很少的修改, 或根本没有修改.
> 
{style="tip"}

例如, 假设你有一个接口 `Drawable`, 包含很多函数和一个属性 `color`:

```kotlin
interface Drawable {
    fun draw()
    fun resize()
    val color: String?
}
```

你创建了一个类 `Circle`, 实现 `Drawable` 接口, 为它的所有成员函数提供实现:

```kotlin
class Circle : Drawable {
    override fun draw() {
        TODO("An example implementation")
    }
    
    override fun resize() {
        TODO("An example implementation")
    }
}
```

如果你想要创建 `Circle` 类的子类, 具有相同的行为, **唯一的例外** 是 `color` 属性的值不同,
你仍然需要为 `Circle` 类的每个成员函数添加实现:

```kotlin
class RedCircle(val circle: Circle) : Circle {
    // 样板代码开始
    override fun draw() {
        circle.draw()
    }

    override fun resize() {
        circle.resize()
    }

    // 样板代码结束
    override val color = "red"
}
```

你会看出, 如果在 `Drawable` 接口中有大量的成员函数, `RedCircle` 类中的样板代码数量会变得非常巨大.
但是, 还有另一种选择.

在 Kotlin 中, 可以使用委托, 将接口实现委托给一个类的实例.
例如, 你可以创建 `Circle` 类的一个实例, 并将 `Circle` 类的成员函数的实现委托给这个实例.
要实现这一点, 请使用 `by` 关键字. 例如:

```kotlin
class RedCircle(param: Circle) : Circle by param
```

其中, `param` 是 `Circle` 类实例的名称, 成员函数的实现委托给它.

现在你不必为 `RedCircle` 类中的成员函数添加实现了.
编译器会自动通过 `Circle` 类为你完成这些. 这样可以为你避免编写大量样板代码的麻烦.
你只需要对子类中想要修改的行为添加代码即可.

例如, 如果你想要修改 `color` 属性的值:

```kotlin
class RedCircle(param : Circle) : Circle by param {
    // 没有样板代码!
    override val color = "red"
}
```

如果你想要, 你也可以在 `RedCircle` 类中覆盖继承的成员函数的行为,
但现在你不必为每个继承的成员函数添加新代码.

详情请参见 [委托](delegation.md).

## 实际练习 {id="practice"}

### 习题 1 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-1"}

想象你正在开发一个智能家居系统. 智能家居通常包含不同类型的设备, 它们都具备一些基本功能, 但也有一些独特的行为.
请在下面的示例代码中, 完成 `abstract` 类 `SmartDevice`, 让子类 `SmartLight` 能够成功编译.

然后, 创建另一个子类 `SmartThermostat`, 继承 `SmartDevice` 类, 并实现 `turnOn()` 和 `turnOff()` 函数,
这两个函数包含打印语句, 描述哪个加热器正在加热, 或已经关闭.
最后, 添加另一个函数, 名为 `adjustTemperature()`, 接受一个温度值参数, 并打印输出:
`$name thermostat set to $temperature°C.`

<deflist collapsible="true">
    <def title="提示">
        在 <code>SmartDevice</code> 类中, 添加 <code>turnOn()</code> 和 <code>turnOff()</code> 函数, 
        然后你可以在 <code>SmartThermostat</code> 类中覆盖这两个函数的行为.
    </def>
</deflist>

|--|--|

```kotlin
abstract class // 请在这里编写你的代码

class SmartLight(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name is now ON.")
    }

    override fun turnOff() {
        println("$name is now OFF.")
    }

   fun adjustBrightness(level: Int) {
        println("Adjusting $name brightness to $level%.")
    }
}

class SmartThermostat // 请在这里编写你的代码

fun main() {
    val livingRoomLight = SmartLight("Living Room Light")
    val bedroomThermostat = SmartThermostat("Bedroom Thermostat")
    
    livingRoomLight.turnOn()
    // 输出结果为: Living Room Light is now ON.
    livingRoomLight.adjustBrightness(10)
    // 输出结果为: Adjusting Living Room Light brightness to 10%.
    livingRoomLight.turnOff()
    // 输出结果为: Living Room Light is now OFF.

    bedroomThermostat.turnOn()
    // 输出结果为: Bedroom Thermostat thermostat is now heating.
    bedroomThermostat.adjustTemperature(5)
    // 输出结果为: Bedroom Thermostat thermostat set to 5°C.
    bedroomThermostat.turnOff()
    // 输出结果为: Bedroom Thermostat thermostat is now off.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-1"}

|---|---|
```kotlin
abstract class SmartDevice(val name: String) {
    abstract fun turnOn()
    abstract fun turnOff()
}

class SmartLight(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name is now ON.")
    }

    override fun turnOff() {
        println("$name is now OFF.")
    }

   fun adjustBrightness(level: Int) {
        println("Adjusting $name brightness to $level%.")
    }
}

class SmartThermostat(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name thermostat is now heating.")
    }

    override fun turnOff() {
        println("$name thermostat is now off.")
    }

   fun adjustTemperature(temperature: Int) {
        println("$name thermostat set to $temperature°C.")
    }
}


fun main() {
    val livingRoomLight = SmartLight("Living Room Light")
    val bedroomThermostat = SmartThermostat("Bedroom Thermostat")
    
    livingRoomLight.turnOn()
    // 输出结果为: Living Room Light is now ON.
    livingRoomLight.adjustBrightness(10)
    // 输出结果为: Adjusting Living Room Light brightness to 10%.
    livingRoomLight.turnOff()
    // 输出结果为: Living Room Light is now OFF.

    bedroomThermostat.turnOn()
    // 输出结果为: Bedroom Thermostat thermostat is now heating.
    bedroomThermostat.adjustTemperature(5)
    // 输出结果为: Bedroom Thermostat thermostat set to 5°C.
    bedroomThermostat.turnOff()
    // 输出结果为: Bedroom Thermostat thermostat is now off.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-classes-interfaces-solution-1"}

### 习题 2 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-2"}

创建一个接口 `Media`, 用来实现特定的媒体类, 例如 `Audio`, `Video`, 或 `Podcast`.
你的接口必须包含:

* 一个属性 `title`, 表示媒体的标题.
* 一个函数 `play()`, 播放媒体.

然后, 创建一个类 `Audio`, 实现 `Media` 接口.
`Audio` 类必须在构造器中使用 `title` 属性, 而且必须有一个额外的属性 `composer`, 类型 为`String`.
在这个类中, 实现 `play()` 函数, 打印输出: `"Playing audio: $title, composed by $composer"`.

<deflist collapsible="true">
    <def title="提示">
        你可以在类的头部使用 <code>override</code> 关键字, 在构造器中实现来自接口的属性.
    </def>
</deflist>

|---|---|
```kotlin
interface // 请在这里编写你的代码

class // 请在这里编写你的代码

fun main() {
    val audio = Audio("Symphony No. 5", "Beethoven")
    audio.play()
   // 输出结果为: Playing audio: Symphony No. 5, composed by Beethoven
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-2"}

|---|---|
```kotlin
interface Media {
    val title: String
    fun play()
}

class Audio(override val title: String, val composer: String) : Media {
    override fun play() {
        println("Playing audio: $title, composed by $composer")
    }
}

fun main() {
    val audio = Audio("Symphony No. 5", "Beethoven")
    audio.play()
   // 输出结果为: Playing audio: Symphony No. 5, composed by Beethoven
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-classes-interfaces-solution-2"}

### 习题 3 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-3"}

你正在为一个电子商务应用程序构建支付处理系统.
每一种支付方法需要能够对支付进行授权, 并处理一笔交易.
有些支付还需要能够处理退款.

1. 在 `Refundable` 接口中, 添加一个 `refund()` 函数, 处理退款.

2. 在 `PaymentMethod` 抽象类中:
   * 添加一个 `authorize()` 函数, 接受金额参数, 并打印输出一条包含金额的消息.
   * 添加一个 `processPayment()` 抽象函数, 也接受金额参数.

3. 创建一个 `CreditCard` 类, 实现 `Refundable` 接口和 `PaymentMethod` 抽象类.
在这个类中, 添加 `refund()` 和 `processPayment()` 函数的实现, 让它们打印以下语句:
   * `"Refunding $amount to the credit card."`
   * `"Processing credit card payment of $amount."`

|---|---|
```kotlin
interface Refundable {
    // 请在这里编写你的代码
}

abstract class PaymentMethod(val name: String) {
    // 请在这里编写你的代码
}

class CreditCard // 请在这里编写你的代码

fun main() {
    val visa = CreditCard("Visa")
    
    visa.authorize(100.0)
    // 输出结果为: Authorizing payment of $100.0.
    visa.processPayment(100.0)
    // 输出结果为: Processing credit card payment of $100.0.
    visa.refund(50.0)
    // 输出结果为: Refunding $50.0 to the credit card.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-3"}

|---|---|
```kotlin
interface Refundable {
    fun refund(amount: Double)
}

abstract class PaymentMethod(val name: String) {
    fun authorize(amount: Double) {
        println("Authorizing payment of $$amount.")
    }

    abstract fun processPayment(amount: Double)
}

class CreditCard(name: String) : PaymentMethod(name), Refundable {
    override fun processPayment(amount: Double) {
        println("Processing credit card payment of $$amount.")
    }

    override fun refund(amount: Double) {
        println("Refunding $$amount to the credit card.")
    }
}

fun main() {
    val visa = CreditCard("Visa")
    
    visa.authorize(100.0)
    // 输出结果为: Authorizing payment of $100.0.
    visa.processPayment(100.0)
    // 输出结果为: Processing credit card payment of $100.0.
    visa.refund(50.0)
    // 输出结果为: Refunding $50.0 to the credit card.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-classes-interfaces-solution-3"}

### 习题 4 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-4"}

你有一个简单的消息应用程序, 包含一些基本功能, 但你想要添加一些功能来处理 _智能_ 消息,
但不想大量重复代码.

在下面的代码中, 定义一个 `SmartMessenger` 类, 继承 `BasicMessenger` 类,
但将实现委托给一个 `BasicMessenger` 类的实例.

在 `SmartMessenger` 类中, 覆盖 `sendMessage()` 函数, 发送智能消息.
这个函数必须接受一个 `message` 参数, 并包含一个打印输出语句: `"Sending a smart message: $message"`.
此外还要调用来自 `BasicMessenger` 类的 `sendMessage()` 函数, 并给消息加上 `[smart]` 前缀.

> 你不需要重写 `SmartMessenger` 类中的 `receiveMessage()` 函数.
> 
{style="note"}

|--|--|

```kotlin
interface Messenger {
    fun sendMessage(message: String)
    fun receiveMessage(): String
}

class BasicMessenger : Messenger {
    override fun sendMessage(message: String) {
        println("Sending message: $message")
    }

    override fun receiveMessage(): String {
        return "You've got a new message!"
    }
}

class SmartMessenger // 请在这里编写你的代码

fun main() {
    val basicMessenger = BasicMessenger()
    val smartMessenger = SmartMessenger(basicMessenger)
    
    basicMessenger.sendMessage("Hello!")
    // 输出结果为: Sending message: Hello!
    println(smartMessenger.receiveMessage())
    // 输出结果为: You've got a new message!
    smartMessenger.sendMessage("Hello from SmartMessenger!")
    // 输出结果为: Sending a smart message: Hello from SmartMessenger!
    // 输出结果为: Sending message: [smart] Hello from SmartMessenger!
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-4"}

|---|---|
```kotlin
interface Messenger {
    fun sendMessage(message: String)
    fun receiveMessage(): String
}

class BasicMessenger : Messenger {
    override fun sendMessage(message: String) {
        println("Sending message: $message")
    }

    override fun receiveMessage(): String {
        return "You've got a new message!"
    }
}

class SmartMessenger(private val basicMessenger: BasicMessenger) : Messenger by basicMessenger {
    override fun sendMessage(message: String) {
        println("Sending a smart message: $message")
        basicMessenger.sendMessage("[smart] $message")
    }
}

fun main() {
    val basicMessenger = BasicMessenger()
    val smartMessenger = SmartMessenger(basicMessenger)
    
    basicMessenger.sendMessage("Hello!")
    // 输出结果为: Sending message: Hello!
    println(smartMessenger.receiveMessage())
    // 输出结果为: You've got a new message!
    smartMessenger.sendMessage("Hello from SmartMessenger!")
    // 输出结果为: Sending a smart message: Hello from SmartMessenger!
    // 输出结果为: Sending message: [smart] Hello from SmartMessenger!
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-classes-interfaces-solution-4"}

## 下一步 {id="next-step"}

[中级教程: 对象](kotlin-tour-intermediate-objects.md)
