[//]: # (title: 扩展)

Kotlin _扩展(extension)_ 能够向一个类或接口扩展新的功能, 而不必使用继承, 或 _装饰器(Decorator)_ 之类设计模式.
在处理无法直接修改的第三方库时, 扩展非常有用.
扩展创建后, 可以像调用原来的类或接口的成员一样调用它.

最常见的扩展形式是 [_扩展函数(extension function)_](#extension-functions) 和 [_扩展属性(extension property)_](#extension-properties).

重要的是, 扩展并不会修改它所扩展的类或接口.
在定义扩展时, 并不会添加新的成员. 只是能够使用相同的语法, 调用的新函数, 访问新的属性.

## 接收者(Receiver) {id="receivers"}

扩展总是在一个接收者上调用. 接收者必须具有与被扩展的类或接口相同的类型.
要使用扩展, 请在接收者前加上前缀, 然后是 `.` 和函数或属性名.

例如, 标准库中的 [`.appendLine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/append-line.html)
扩展函数扩展了 `StringBuilder` 类.
因此这里的接收者是一个 `StringBuilder` 实例, _接收者类型_ 是 `StringBuilder`:

```kotlin
fun main() {
//sampleStart
    // builder 是 StringBuilder 的一个实例
    val builder = StringBuilder()
        // 在 builder 上调用 .appendLine() 扩展函数
        .appendLine("Hello")
        .appendLine()
        .appendLine("World")
    println(builder.toString())
    // 输出结果为:
    // Hello
    //
    // World
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-stringbuilder"}

## 扩展函数 {id="extension-functions"}

在创建自己的扩展函数之前, 请先查看 Kotlin [标准库](https://kotlinlang.org/api/core/kotlin-stdlib/)中是否已经有了你需要的功能.
标准库提供了许多有用的扩展函数, 用于:

* 操作集合: [`.map()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/map.html), [`.filter()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter.html), [`.reduce()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce.html), [`.fold()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/fold.html), [`.groupBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/group-by.html).
* 转换为字符串: [`.joinToString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/join-to-string.html).
* 处理 null 值: [`.filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html).

要创建自己的扩展函数, 请在函数名称之前加上接收者类型和 `.`.
在以下示例中, `.truncate()` 函数扩展了 `String` 类, 因此接收者类型是 `String`:

```kotlin
fun String.truncate(maxLength: Int): String {
    return if (this.length <= maxLength) this else take(maxLength - 3) + "..."
}

fun main() {
    val shortUsername = "KotlinFan42"
    val longUsername = "JetBrainsLoverForever"

    println("Short username: ${shortUsername.truncate(15)}")
    // 输出结果为: KotlinFan42
    println("Long username:  ${longUsername.truncate(15)}")
    // 输出结果为: JetBrainsLov...
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-truncate"}

`.truncate()` 函数根据 `maxLength` 参数截断被调用的字符串, 并添加省略号 `...`.
如果字符串比 `maxLength` 短, 函数返回原始字符串.

在这个示例中, `.displayInfo()` 函数扩展了 `User` 接口:

```kotlin
interface User {
    val name: String
    val email: String
}

fun User.displayInfo(): String = "User(name=$name, email=$email)"

// 继承并实现 User 接口的属性
class RegularUser(override val name: String, override val email: String) : User

fun main() {
    val user = RegularUser("Alice", "alice@example.com")
    println(user.displayInfo())
    // 输出结果为: User(name=Alice, email=alice@example.com)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-interface"}

`.displayInfo()` 函数返回一个字符串, 其中包含 `RegularUser` 实例的 `name` 和 `email`.
在你需要一次性向实现接口的所有类型添加功能时, 在接口上定义这样的扩展会非常有用.

在这个示例中, `.mostVoted()` 函数扩展了 `Map<String, Int>` 类:

```kotlin
fun Map<String, Int>.mostVoted(): String? {
    return maxByOrNull { (key, value) -> value }?.key
}

fun main() {
    val poll = mapOf(
        "Cats" to 37,
        "Dogs" to 58,
        "Birds" to 22
    )

    println("Top choice: ${poll.mostVoted()}")
    // 输出结果为: Top choice: Dogs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-mostvoted"}

`.mostVoted()` 函数遍历它被调用的 map 的键值对,
并使用
[`maxByOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-by-or-null.html)
函数, 返回包含最大值的键值对的键.
如果 map 为空, `maxByOrNull()` 函数返回 `null`.
`mostVoted()` 函数使用安全调用 `?.`, 只在 `maxByOrNull()` 函数返回非 null 值时才访问 `key` 属性.

### 泛型扩展函数 {id="generic-extension-functions"}

要创建泛型扩展函数, 请在函数名称之前声明泛型类型参数, 使其在接收者类型表达式中可以使用.
在这个示例中, `.endpoints()` 函数扩展了 `List<T>`, 其中 `T` 可以是任意类型:

```kotlin
fun <T> List<T>.endpoints(): Pair<T, T> {
    return first() to last()
}

fun main() {
    val cities = listOf("Paris", "London", "Berlin", "Prague")
    val temperatures = listOf(21.0, 19.5, 22.3)

    val cityEndpoints = cities.endpoints()
    val tempEndpoints = temperatures.endpoints()

    println("First and last cities: $cityEndpoints")
    // 输出结果为: (Paris, Prague)
    println("First and last temperatures: $tempEndpoints")
    // 输出结果为: (21.0, 22.3)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-endpoints"}

`.endpoints()` 函数返回一个 pair, 其中包含它被调用的列表的第一个和最后一个元素.
在函数体内, 它调用 `first()` 和 `last()` 函数, 并使用 `to` 中缀函数, 将返回值合并为一个 `Pair`.

关于泛型, 详情请参见 [泛型函数](generics.md).

### 可为 null 的接收者(Nullable Receiver) {id="nullable-receivers"}

你可以定义接收者类型可为 null 的扩展函数, 这样即使变量的值为 null 也可以调用它.
当接收者为 `null` 时, `this` 也是 `null`. 请确保在函数内正确处理可空性.
例如, 在函数体内使用 `this == null` 检查, [安全调用 `?.`](null-safety.md#safe-call-operator),
或 [Elvis 操作符 `?:`](null-safety.md#elvis-operator).

在这个示例中, 你可以调用 `.toString()` 函数, 无需检查 `null`, 因为检查已经在扩展函数内部完成了:

```kotlin
fun main() {
    //sampleStart
    // 对可为 null 的 Any 的扩展函数
    fun Any?.toString(): String {
        if (this == null) return "null"
        // null 检查之后, `this` 被智能类型转换为不可为 null 的 Any
        // 所以这里调用的是通常的 toString() 函数
        return toString()
    }

    val number: Int? = 42
    val nothing: Any? = null

    println(number.toString())
    // 输出结果为: 42
    println(nothing.toString())
    // 输出结果为: null
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-nullable-receiver"}

### 调用扩展函数还是成员函数? {id="extension-or-member-functions"}

由于扩展函数和成员函数的调用方式相同, 编译器如何知道该调用哪一个?
扩展函数是 _静态_ 派发的, 也就是说, 编译器会在编译期间根据接收者类型决定调用哪个函数. 例如:

```kotlin
fun main() {
//sampleStart
    open class Shape
    class Rectangle: Shape()

    fun Shape.getName() = "Shape"
    fun Rectangle.getName() = "Rectangle"

    fun printClassName(shape: Shape) {
        println(shape.getName())
    }

    printClassName(Rectangle())
    // 输出结果为: Shape
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-shape"}

在这个示例中, 编译器调用 `Shape.getName()` 扩展函数, 因为参数 `shape` 声明为 `Shape` 类型.
由于扩展函数是静态解析的, 编译器根据声明类型而非实际实例来选择函数.

所以即使示例传入了一个 `Rectangle` 实例, `.getName()` 函数也会解析为 `Shape.getName()`,
因为变量声明为 `Shape` 类型.

如果一个类有成员函数, 同时又有相同接收者类型, 相同名称而且参数兼容的扩展函数, 成员函数优先. 例如:

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Member function") }
    }

    fun Example.printFunctionType() { println("Extension function") }

    Example().printFunctionType()
    // 输出结果为: Member function
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-member-function"}

但是, 扩展函数可以重载(overload)名称相同但签名 _不同_ 的成员函数:

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Member function") }
    }

    // 名称相同, 但签名不同
    fun Example.printFunctionType(index: Int) { println("Extension function #$index") }

    Example().printFunctionType(1)
    // 输出结果为: Extension function #1
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-member-function-overload"}

在这个示例中, 由于向 `.printFunctionType()` 函数传入了一个 `Int`, 编译器选择了匹配该签名的扩展函数.
编译器忽略了不接受参数的成员函数.

### 匿名扩展函数 {id="anonymous-extension-functions"}

你可以定义扩展函数, 但不指定函数名称.
如果你想避免污染全局命名空间, 或需要将某些扩展行为作为参数传递时, 这很有用.

例如, 假设你想扩展一个数据类, 添加一次性的函数来计算运费, 而不给它命名:

```kotlin
fun main() {
    //sampleStart
    data class Order(val weight: Double)
    val calculateShipping = fun Order.(rate: Double): Double = this.weight * rate

    val order = Order(2.5)
    val cost = order.calculateShipping(3.0)
    println("Shipping cost: $cost")
    // 输出结果为: Shipping cost: 7.5
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-anonymous"}

要将扩展行为作为参数传递, 请使用带有类型注解的 [Lambda 表达式](lambdas.md#lambda-expression-syntax).
例如, 假设你想检查一个数字是否在某个范围内, 而不定义一个命名函数:

```kotlin
fun main() {
    val isInRange: Int.(min: Int, max: Int) -> Boolean = { min, max -> this in min..max }

    println(5.isInRange(1, 10))
    // 输出结果为: true
    println(20.isInRange(1, 10))
    // 输出结果为: false
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-anonymous-lambda"}

在这个示例中, `isInRange` 变量持有一个函数, 类型为 `Int.(min: Int, max: Int) -> Boolean`.
这个类型是对 `Int` 类的扩展函数, 接受 `min` 和 `max` 参数并返回 `Boolean`.

Lambda 表达式的函数体 `{ min, max -> this in min..max }` 检查调用该函数的 `Int` 值是否在 `min` 和 `max` 参数之间的范围内.
如果检查成功, Lambda 表达式 返回 `true`.

更多信息, 请参见 [Lambda 表达式和匿名函数](lambdas.md).

## 扩展属性 {id="extension-properties"}

Kotlin 支持扩展属性, 对于执行数据转换, 或创建 UI 显示辅助功能非常有用, 同时不会使你操作的类变得混乱.

要创建扩展属性, 请写下你想扩展的类名, 后跟 `.` 和你的属性名称.

例如, 假设你有一个表示用户名字和姓氏的数据类, 你想创建一个属性, 在访问时返回邮件风格的用户名.
代码可能如下所示:

```kotlin
data class User(val firstName: String, val lastName: String)

// 扩展属性, 获取用于邮件地址的用户名
val User.emailUsername: String
    get() = "${firstName.lowercase()}.${lastName.lowercase()}"

fun main() {
    val user = User("Mickey", "Mouse")
    // 调用扩展属性
    println("Generated email username: ${user.emailUsername}")
    // 输出结果为: Generated email username: mickey.mouse
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property"}

由于扩展实际上不会向类添加新成员, 扩展属性没有有效的方式拥有 [后端域变量(backing field)](properties.md#backing-fields).
这就是为什么扩展属性不允许使用初始化器.
你只能通过明确提供 getter 和 setter 来定义它们的行为. 例如:

```kotlin
data class House(val streetName: String)

// 无法编译, 因为没有 getter 和 setter
// var House.number = 1
// Error: Initializers are not allowed for extension properties

// 成功编译
val houseNumbers = mutableMapOf<House, Int>()
var House.number: Int
    get() = houseNumbers[this] ?: 1
    set(value) {
        println("Setting house number for ${this.streetName} to $value")
        houseNumbers[this] = value
    }

fun main() {
    val house = House("Maple Street")

    // 显示默认值
    println("Default number: ${house.number} ${house.streetName}")
    // 输出结果为: Default number: 1 Maple Street

    house.number = 99
    // 输出结果为: Setting house number for Maple Street to 99

    // 显示更新后的号码
    println("Updated number: ${house.number} ${house.streetName}")
    // 输出结果为: Updated number: 99 Maple Street
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property-error"}

在这个示例中, getter 使用 [Elvis 操作符](null-safety.md#elvis-operator), 返回 `houseNumbers` map 中存在的门牌号码,
如果不存在则返回 `1`.
关于如何编写 getter 和 setter, 请参见 [自定义 getter 和 setter](properties.md#custom-getters-and-setters).

## 对同伴对象(Companion Object)的扩展 {id="companion-object-extensions"}

如果一个类定义了 [同伴对象](object-declarations.md#companion-objects), 你也可以为同伴对象定义扩展函数和扩展属性.
与同伴对象的普通成员一样, 你可以只使用类名作为限定符来调用它们.
编译器默认将同伴对象命名为 `Companion`:

```kotlin
class Logger {
    companion object { }
}

fun Logger.Companion.logStartupMessage() {
    println("Application started.")
}

fun main() {
    Logger.logStartupMessage()
    // 输出结果为: Application started.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-companion-object"}

## 将扩展定义为成员 {id="declaring-extensions-as-members"}

你可以在一个类的内部为另一个类声明扩展. 这样的扩展有多个 _隐含接受者(implicit receiver)_.
隐含接受者是指, 可以不使用 [`this`](this-expressions.md#qualified-this) 限定符就能访问其成员的对象:

* 扩展声明所在的类, 是 _派发接受者(dispatch receiver)_.
* 扩展函数的接收者类型, 是 _扩展接受者(extension receiver)_.

考虑这个示例, 其中 `Connection` 类有一个为 `Host` 类定义的扩展函数, 名为 `printConnectionString()`:

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    // Host 是扩展接受者
    fun Host.printConnectionString() {
        // 调用 Host.printHostname()
        printHostname()
        print(":")
        // 调用 Connection.printPort()
        // Connection 是派发接受者
        printPort()
    }

    fun connect() {
        /*...*/
        // 调用扩展函数
        host.printConnectionString()
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    // 输出结果为: kotl.in:443

    // 触发错误, 因为扩展函数在 Connection 之外不可用
    // Host("kotl.in").printConnectionString()
    // Unresolved reference 'printConnectionString'.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-members"}

这个示例在 `Connection` 类内部声明了 `printConnectionString()` 函数, 因此 `Connection` 类是派发接受者.
扩展函数的接收者类型是 `Host` 类, 因此 `Host` 类是扩展接受者.

如果派发接受者和扩展接受者存在相同名称的成员, 扩展接受者的成员优先.
要明确的访问派发接受者, 请使用 [带限定符的 `this` 语法](this-expressions.md#qualified-this):

```kotlin
class Connection {
    fun Host.getConnectionString() {
        // 调用 Host.toString()
        toString()
        // 调用 Connection.toString()
        this@Connection.toString()
    }
}
```

### 覆盖成员扩展 {id="overriding-member-extensions"}

你可以将成员扩展声明为 `open`, 并在子类中覆盖它, 这在你想为每个子类自定义扩展行为时非常有用.
编译器对每种接收者类型的处理方式不同:

| 接收者类型 | 解析时机 | 派发类型 |
|-------|------|------|
| 派发接受者 | 运行时期 | 虚拟派发 |
| 扩展接受者 | 编译时期 | 静态派发 |

考虑这个示例, 其中 `User` 类是 `open` 的, `Admin` 类继承自它.
`NotificationSender` 类为 `User` 和 `Admin` 类定义了 `sendNotification()` 扩展函数,
而 `SpecialNotificationSender` 类覆盖了这些函数:

```kotlin
open class User

class Admin : User()

open class NotificationSender {
    open fun User.sendNotification() {
        println("Sending user notification from normal sender")
    }

    open fun Admin.sendNotification() {
        println("Sending admin notification from normal sender")
    }

    fun notify(user: User) {
        user.sendNotification()
    }
}

class SpecialNotificationSender : NotificationSender() {
    override fun User.sendNotification() {
        println("Sending user notification from special sender")
    }

    override fun Admin.sendNotification() {
        println("Sending admin notification from special sender")
    }
}

fun main() {
    // 派发接受者是 NotificationSender
    // 扩展接受者是 User
    // 解析为 NotificationSender 中的 User.sendNotification()
    NotificationSender().notify(User())
    // 输出结果为: Sending user notification from normal sender

    // 派发接受者是 SpecialNotificationSender
    // 扩展接受者是 User
    // 解析为 SpecialNotificationSender 中的 User.sendNotification()
    SpecialNotificationSender().notify(User())
    // 输出结果为: Sending user notification from special sender

    // 派发接受者是 SpecialNotificationSender
    // 扩展接受者是 User, 不是 Admin
    // notify() 函数将 user 声明为 User 类型
    // 静态解析为 SpecialNotificationSender 中的 User.sendNotification()
    SpecialNotificationSender().notify(Admin())
    // 输出结果为: Sending user notification from special sender
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-open"}

派发接受者使用虚拟派发, 在运行时期解析, 这使得 `main()` 函数中的行为更容易理解.
可能令你惊讶的是, 当你对一个 `Admin` 实例调用 `notify()` 函数时,
编译器根据声明类型 `user: User` 选择扩展, 因为它静态的解析扩展接受者.

## 扩展与可见度修饰符 {id="extensions-and-visibility-modifiers"}

扩展使用的 [可见度修饰符](visibility-modifiers.md), 与在同一范围内声明的通常函数相同,
包括作为其他类成员声明的扩展.

例如, 在文件顶级声明的扩展可以访问同一文件中其他 `private` 顶级声明:

```kotlin
// 文件: StringUtils.kt

private fun removeWhitespace(input: String): String {
    return input.replace("\\s".toRegex(), "")
}

fun String.cleaned(): String {
    return removeWhitespace(this)
}

fun main() {
    val rawEmail = "  user @example. com  "
    val cleaned = rawEmail.cleaned()
    println("Raw:     '$rawEmail'")
    // 输出结果为: Raw:     '  user @example. com  '
    println("Cleaned: '$cleaned'")
    // 输出结果为: Cleaned: 'user@example.com'
    println("Looks like an email: ${cleaned.contains("@") && cleaned.contains(".")}")
    // 输出结果为: Looks like an email: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-visibility-top-level"}

如果扩展声明在其接收者类型之外, 它无法访问接收者的 `private` 或 `protected` 成员:

```kotlin
class User(private val password: String) {
    fun isLoggedIn(): Boolean = true
    fun passwordLength(): Int = password.length
}

// 在类外部声明的扩展
fun User.isSecure(): Boolean {
    // 无法访问 password, 因为它是 private 的:
    // return password.length >= 8

    // 应改为依赖 public 成员:
    return passwordLength() >= 8 && isLoggedIn()
}

fun main() {
    val user = User("supersecret")
    println("Is user secure: ${user.isSecure()}")
    // 输出结果为: Is user secure: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-visibility-outside-receiver"}

如果扩展被标记为 `internal`, 它只在其 [模块](visibility-modifiers.md#modules) 内可访问:

```kotlin
// Networking 模块
// JsonParser.kt
internal fun String.parseJson(): Map<String, Any> {
    return mapOf("fakeKey" to "fakeValue")
}
```

## 扩展的范围 {id="scope-of-extensions"}

大多数情况下, 你可以直接位于包之下的顶级位置定义扩展:

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
```

要在这个包之外使用扩展, 需要在调用处导入这个扩展:

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

详情请参见 [导入](packages.md#imports).
