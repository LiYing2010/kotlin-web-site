[//]: # (title: 属性(Property))

在 Kotlin 中, 属性可以用来存储和管理数据, 而不需要编写用于访问或修改数据的函数.
你可以在 [类](classes.md), [接口](interfaces.md), [对象](object-declarations.md), [同伴对象](object-declarations.md#companion-objects) 中使用属性,
甚至可以在这些结构之外, 以顶级属性的形式使用.

每个属性都有一个名称, 一个类型, 以及自动生成的 `get()` 函数, 称为 getter.
你可以使用 getter 来读取属性的值.
如果属性是可变的, 它还有一个 `set()` 函数, 称为 setter, 可以修改属性的值.

> getter 和 setter 统称为 _访问器(accessor)_.
>
{style="tip"}

## 声明属性 {id="declaring-properties"}

属性可以是可变属性(`var`), 或只读属性(`val`).
你可以在 `.kt` 文件中将它们声明为顶级属性. 顶级属性可以看作一个属于包的全局变量:

```kotlin
// 文件: Constants.kt
package my.app

val pi = 3.14159
var counter = 0
```

也可以在类, 接口或对象内声明属性:

```kotlin
// 包含属性的类
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
}

// 包含属性的接口
interface ContactInfo {
    val email: String
}

// 包含属性的对象
object Company {
    var name: String = "Detective Inc."
    val country: String = "UK"
}

// 实现接口的类
class PersonContact : ContactInfo {
    override val email: String = "sherlock@example.com"
}
```

使用属性时, 只需通过属性名来引用它:

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
}

interface ContactInfo {
    val email: String
}

object Company {
    var name: String = "Detective Inc."
    val country: String = "UK"
}

class PersonContact : ContactInfo {
    override val email: String = "sherlock@example.com"
}

//sampleStart
fun copyAddress(address: Address): Address {
    val result = Address()
    // 访问 result 实例的属性
    result.name = address.name
    result.street = address.street
    result.city = address.city
    return result
}

fun main() {
    val sherlockAddress = Address()
    val copy = copyAddress(sherlockAddress)
    // 访问 copy 实例的属性
    println("Copied address: ${copy.name}, ${copy.street}, ${copy.city}")
    // 输出结果为: Copied address: Holmes, Sherlock, Baker, London

    // 访问 Company 对象的属性
    println("Company: ${Company.name} in ${Company.country}")
    // 输出结果为: Company: Detective Inc. in UK

    val contact = PersonContact()
    // 访问 contact 实例的属性
    println("Email: ${contact.email}")
    // 输出结果为: Email: sherlock@email.com
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-access-properties"}

在 Kotlin 中, 我们推荐在声明属性的同时进行初始化, 以保证代码的安全性和可读性.
但是, 在某些特殊情况下, 可以 [延迟初始化](#late-initialized-properties-and-variables).

如果编译器能够从初始化代码或 getter 的返回类型推断出属性的类型, 那么可以省略属性类型的声明:

```kotlin
var initialized = 1 // 推断类型为 Int
var allByDefault    // 错误: 属性必须初始化.
```
{validate="false"}

## 自定义 getter 与 setter {id="custom-getters-and-setters"}

默认情况下, Kotlin 会自动生成 getter 和 setter.
如果你需要额外的逻辑, 例如校验, 格式化, 或根据其他属性进行计算, 可以定义自定义访问器.

自定义 getter 在每次访问属性时执行:

```kotlin
//sampleStart
class Rectangle(val width: Int, val height: Int) {
    val area: Int
        get() = this.width * this.height
}
//sampleEnd
fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, area=${rectangle.area}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-custom-getter"}

如果编译器能够从 getter 推断出属性类型, 则可以省略类型:

```kotlin
val area get() = this.width * this.height
```

自定义 setter 在每次向属性赋值时执行, 初始化时除外.
按照惯例, setter 的参数名称为 `value`, 但你也可以选择不同的名称:

```kotlin
class Point(var x: Int, var y: Int) {
    var coordinates: String
        get() = "$x,$y"
        set(value) {
            val parts = value.split(",")
            x = parts[0].toInt()
            y = parts[1].toInt()
        }
}

fun main() {
    val location = Point(1, 2)
    println(location.coordinates)
    // 输出结果为: 1,2

    location.coordinates = "10,20"
    println("${location.x}, ${location.y}")
    // 输出结果为: 10, 20
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-custom-setter"}

### 修改可见度或添加注解 {id="changing-visibility-or-adding-annotations"}

在 Kotlin 中, 你可以修改访问器的可见度, 或者添加 [注解](annotations.md), 而不需要替换默认实现.
这些修改不必在方法 body 部 `{}` 内进行.

要修改访问器的可见度, 请在 `get` 或 `set` 关键字之前使用可见度修饰符:

```kotlin
class BankAccount(initialBalance: Int) {
    var balance: Int = initialBalance
        // 只有类自身能够修改 balance
        private set

    fun deposit(amount: Int) {
        if (amount > 0) balance += amount
    }

    fun withdraw(amount: Int) {
        if (amount > 0 && amount <= balance) balance -= amount
    }
}

fun main() {
    val account = BankAccount(100)
    println("Initial balance: ${account.balance}")
    // 输出结果为: 100

    account.deposit(50)
    println("After deposit: ${account.balance}")
    // 输出结果为: 150

    account.withdraw(70)
    println("After withdrawal: ${account.balance}")
    // 输出结果为: 80

    // account.balance = 1000
    // 错误: 无法赋值, 因为 setter 的可见度是 private
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-private-setter"}

要对访问器添加注解, 请在 `get` 或 `set` 关键字之前使用注解:

```kotlin
// 定义一个可应用于 getter 的注解
@Target(AnnotationTarget.PROPERTY_GETTER)
annotation class Inject

class Service {
    var dependency: String = "Default Service"
        // 对 getter 添加注解
        @Inject get
}

fun main() {
    val service = Service()
    println(service.dependency)
    // 输出结果为: Default service
    println(service::dependency.getter.annotations)
    // 输出结果为: [@Inject()]
    println(service::dependency.setter.annotations)
    // 输出结果为: []
}
```
{validate="false"}

这个示例使用 [反射](reflection.md) 来显示 getter 和 setter 上存在的注解.

## 后端域变量(Backing Field) {id="backing-fields"}

如果属性的值需要存储在内存中, 编译器会自动为属性生成后端域变量(Backing Field).

例如, 当你使用默认的 `get()` 和 `set()` 函数时, 编译器会创建后端域变量, 因为它们需要读写存储的值:

```kotlin
var count = 0
```

在 [自定义 `get()` 或 `set()` 函数](#custom-getters-and-setters) 中, 可以使用 `field` 关键字来访问后端域变量.
例如, 可以向 getter 或 setter 中添加额外的逻辑, 或者在属性发生变化时触发额外的操作.

在下面的示例中, `score` 属性在 `set()` 函数中使用后端域变量, 使得更新值时同时触发一个日志事件:

```kotlin
class Scoreboard {
    var score: Int = 0
        set(value) {
            field = value
            // 更新值时添加日志
            println("Score updated to $field")
        }
}

fun main() {
    val board = Scoreboard()
    board.score = 10
    // 输出结果为: Score updated to 10
    board.score = 20
    // 输出结果为: Score updated to 20
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-field"}

并不是所有属性都会默认创建后端域变量, 因为有些属性可能不需要.
例如, `isEmpty` 属性没有后端域变量, 因为每次访问时, 它的值都会从 `size` 属性计算得到:

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### 明确的后端域变量(Explicit Backing Field) {id="explicit-backing-fields"}

有时你可能需要更多的灵活性. 例如, 如果你有一个 API, 希望能够在内部修改属性, 但不允许外部修改.
这种情况下, 可以使用 _明确的后端域变量(Explicit Backing Field)_.

在下面的示例中, `ShoppingCart` 类有一个 `items` 属性, 代表购物车中的所有商品.
这个类将 `items` 属性公开为只读的字符串列表, 但在内部通过明确的后端域变量, 将数据存储在一个可变的列表中:

```kotlin
class ShoppingCart {
    // 使用明确的后端域变量的公开只读视图
    val items: List<String>
        field = mutableListOf()

    fun addItem(item: String) {
        items.add(item)
    }

    fun removeItem(item: String) {
        items.remove(item)
    }
}

fun main() {
    val cart = ShoppingCart()
    cart.addItem("Apple")
    cart.addItem("Banana")

    println(cart.items)
    // 输出结果为: [Apple, Banana]

    cart.removeItem("Apple")
    println(cart.items)
    // 输出结果为: [Banana]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4" id="kotlin-explicit-backing-field"}

在这个示例中, 编译器从 `mutableListOf()` 调用推断后端域变量的类型: `MutableList<String>`.
你也可以明确的声明后端域变量的类型:

```kotlin
val items: List<String>
    // 具有明确类型的明确后端域变量
    field: MutableList<String> = mutableListOf()
```
{validate="false"}

在 `ShoppingCart` 类的示例中, 编译器将 `items` 属性智能转换(smart cast)为 `MutableList<String>` 类型,
因此类可以通过 `add()` 和 `remove()` 函数向购物车中添加和删除商品.
在类的外部, 编译器使用公开的属性类型 `List<String>`, 因此 API 使用者只能读取 `items` 列表中的内容.

#### 限制 {id="limitations"}

使用明确的后端域变量时, 属性和后端域变量本身必须遵循一定的规则.
属性要使用明确的后端域变量, 必须满足以下条件:

* 没有自定义 getter.
* 是只读属性(`val`).
* 不是 `open` 的.
* 不是 [委托属性](delegated-properties.md).
* 不是 [编译期常数值](#compile-time-constants).

此外, 后端域变量的类型必须是属性类型的子类型, 且必须具有 [`private` 可见度](visibility-modifiers.md).

要绕过这些限制, 可以改为使用后端属性.

### 后端属性(Backing Property) {id="backing-properties"}

如果明确的后端域变量不适合你的使用场景, 你可以尝试使用一种名为 _后端属性(Backing Property)_ 的编程模式.

例如, 如果你的属性需要自定义 getter:

```kotlin
class UserDirectory {
    private val _users = mutableListOf(
        "sarah",
        "mike",
        "emma"
    )

    val users: List<String>
        get() = _users.sorted()

    fun addUser(username: String) {
        _users.add(username)
    }
}

fun main() {
    val directory = UserDirectory()

    directory.addUser("alex")
    println(directory.users)
    // 输出结果为: [alex, emma, mike, sarah]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-property-custom-getter"}

> 命名后端属性时, 请使用下划线前缀, 以符合 Kotlin [编码规约](coding-conventions.md#names-for-backing-properties).
>
{style="tip"}

在这个示例中, `UserDirectory` 类有一个只读属性 `users`, 列出目录中的所有用户.
`_users` 变量是 private 的后端属性, 包含真实的列表.
public 属性 `users` 的 getter 先对列表进行排序, 然后返回结果.

## 编译期常数值 {id="compile-time-constants"}

如果只读属性的值在编译期间就能确定, 请使用 `const` 修饰符, 将它标记为 _编译期常数值(Compile-Time Constant)_.
编译期常数值会在编译时内联(inline), 因此每处引用都会被替换为实际的值. 由于不会调用 getter, 因此访问效率更高:

```kotlin
// 文件: AppConfig.kt
package com.example

// 编译期常数值
const val MAX_LOGIN_ATTEMPTS = 3
```

编译期常数值必须满足以下所有条件:

* 必须是顶级属性, 或者是 [`object` 声明](object-declarations.md#object-declarations-overview) 的成员, 或者是 [同伴对象](object-declarations.md#companion-objects) 的成员.
* 值必须初始化为 `String` 类型或 [基本类型](types-overview.md).
* 不能有自定义 getter.

编译期常数值仍然有后端域变量, 因此你可以使用 [反射](reflection.md) 与它进行交互.

这类属性也可以在注解内使用:

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun processLegacyOrders() { ... }
```

## 延迟初始化的(Late-Initialized)属性和变量 {id="late-initialized-properties-and-variables"}

通常, 属性必须在构造器中进行初始化. 但是, 并不总是方便这样做.
例如, 你可能通过依赖注入来初始化属性, 或者在单元测试的 setup 方法中初始化属性.

要处理这些情况, 请为属性添加 `lateinit` 修饰符:

```kotlin
public class OrderServiceTest {
    lateinit var orderService: OrderService

    @SetUp fun setup() {
        orderService = OrderService()
    }

    @Test fun processesOrderSuccessfully() {
        // 直接调用 orderService, 无需检查 null, 或初始化状态
        orderService.processOrder()
    }
}
```

你可以对以下声明为 `var` 的属性使用 `lateinit` 修饰符:

* 顶级属性.
* 局部变量.
* 类 body 部之内的属性.

对于类属性:

* 不能在主构造器中声明.
* 不能有自定义 getter 或 setter.

在所有情况下, 属性或变量的类型必须是非 null 的, 而且不能是 [基本类型](types-overview.md).

如果在初始化之前访问 `lateinit` 属性, Kotlin 会抛出一个特定的异常, 指明被访问的属性未初始化:

```kotlin
class ReportGenerator {
    lateinit var report: String

    fun printReport() {
        // 在初始化之前访问, 会抛出异常
        println(report)
    }
}

fun main() {
    val generator = ReportGenerator()
    generator.printReport()
    // 发生错误: Exception in thread "main" kotlin.UninitializedPropertyAccessException: lateinit property report has not been initialized
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-lateinit-property" validate="false"}

要检查 `lateinit var` 是否已完成初始化, 请对 [属性的引用](reflection.md#property-references) 使用
[`isInitialized`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/is-initialized.html) 属性:

```kotlin
class WeatherStation {
    lateinit var latestReading: String

    fun printReading() {
        // 检查属性是否已初始化
        if (this::latestReading.isInitialized) {
            println("Latest reading: $latestReading")
        } else {
            println("No reading available")
        }
    }
}

fun main() {
    val station = WeatherStation()

    station.printReading()
    // 输出结果为: No reading available
    station.latestReading = "22°C, sunny"
    station.printReading()
    // 输出结果为: Latest reading: 22°C, sunny
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-lateinit-property-check-initialization"}

只有在代码中已经可以访问某个属性时, 才能对这个属性使用 `isInitialized`.
该属性必须声明在同一个类中, 在外部类中, 或者是同一文件中的顶级属性.

## 属性的覆盖 {id="overriding-properties"}

参见 [属性的覆盖](inheritance.md#overriding-properties).

## 委托属性(Delegated Property) {id="delegated-properties"}

为了重用逻辑并减少代码重复, 你可以将获取和设置属性的任务委托给另一个单独的对象.

将访问器的行为委托出去, 能使属性的访问器逻辑集中化, 更易于重用.
这种方案在实现以下行为时很有用:

* 延迟计算属性值.
* 通过指定的键值从 map 中读取数据.
* 访问数据库.
* 在属性被访问时通知监听器.

你可以自己在库中实现这些常见行为, 也可以使用外部库提供的现有委托.
详情请参见 [委托属性](delegated-properties.md).
