[//]: # (title: 对象声明与对象表达式)

在 Kotlin 中, 你可以使用对象, 只需一步就能定义一个类并创建它的一个实例.
当你需要重用一个单例(singleton instance), 或者一个一次性的对象时, 这个功能会非常有用.
为了处理这样的场景, Kotlin 提供了两种方案:
_对象声明_ 用于创建单例, 以及 _对象表达式_ 用于创建匿名的, 一次性对象.

> 单例可以确保一个类只有一个实例, 并为这个实例提供一个全局的访问点.
>
{style="tip"}

对象声明和对象表达式 最适合于下面的场景:

* **对共用的资源使用单例:**
  你需要确保一个类在整个应用程序中只存在一个实例.
  例如, 管理一个数据库连接池.
* **创建工厂方法:**
  你需要一种便利的方法来有效率的创建实例.
  你可以使用 [同伴对象](#companion-objects) 来定义类级的函数和属性, 绑定到一个类, 简化类实例的创建和管理.
* **临时修改既有的类的行为:**
  你想要一个既有的类的行为, 但不创建新的子类.
  例如, 对一个对象添加临时的功能, 执行特定的操作.
* **需要类型安全的设计:**
  你需要使用对象表达式作为接口或 [抽象类](classes.md#abstract-classes) 的一次性的实现.
  例如, 对于按钮的点击事件处理程序之类的场景, 这个功能会非常有用.

## 对象声明(Object declaration) {id="object-declarations-overview"}

在 Kotlin 中, 你可以使用对象声明创建对象的单个实例, 对象声明由 `object` 关键字加上对象名称构成.
只需一步就能定义一个类并创建它的一个实例, 非常便于实现单例:

```kotlin
//sampleStart
// 声明一个单例对象, 用来管理 DataProvider
object DataProviderManager {
    private val providers = mutableListOf<DataProvider>()

    // 注册一个新的 DataProvider
    fun registerDataProvider(provider: DataProvider) {
        providers.add(provider)
    }

    // 获取所有注册的 DataProvider
    val allDataProviders: Collection<DataProvider> 
        get() = providers
}
//sampleEnd

// 示例 DataProvider 的接口
interface DataProvider {
    fun provideData(): String
}

// 示例 DataProvider 的实现
class ExampleDataProvider : DataProvider {
    override fun provideData(): String {
        return "Example data"
    }
}

fun main() {
    // 创建 ExampleDataProvider 的一个实例
    val exampleProvider = ExampleDataProvider()

    // 要引用 `object`, 直接使用它的名称
    DataProviderManager.registerDataProvider(exampleProvider)

    // 获取所有注册的 DataProvider, 并打印输出
    println(DataProviderManager.allDataProviders.map { it.provideData() })
    // 输出结果为: [Example data]
}
```
{kotlin-runnable="true" id="object-declaration-register-provider"}

> 对象声明中的初始化处理是线程安全的(thread-safe), 而且会在对象初次访问时完成初始化处理.
>
{style="tip"}

要引用这个 `object`, 请直接使用它的名称:

```kotlin
DataProviderManager.registerDataProvider(exampleProvider)
```

对象声明也可以指定基类,
与 [匿名对象从既有的类继承, 或实现接口](#inherit-anonymous-objects-from-supertypes) 的方式类似:

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
}
```

与变量声明一样, 对象声明不是表达式, 因此不能用在赋值语句的右侧:

```kotlin
// 语法错误: 对象表达式不能指定名称.
val myObject = object MySingleton {
    val name = "Singleton"
}
```

对象声明不可以是局部的, 也就是说, 不可以直接嵌套在函数之内.
但是, 可以嵌套在另一个对象声明之内, 或者嵌套在另一个非内部类(non-inner class)之内.

### 数据对象 {id="data-objects"}

如果在 Kotlin 中打印一个普通的对象声明, 它的字符串表达包含对象的名称和 hash 值:

```kotlin
object MyObject

fun main() {
    println(MyObject) 
    // 输出结果为: MyObject@hashcode
}
```
{kotlin-runnable="true" id="object-declaration-plain"}

但是, 如果使用 `data` 修饰符标记对象表达式,
你可以让编译器在调用 `toString()` 时返回对象真正的名称, 与 [数据类](data-classes.md) 的工作方式一样:

```kotlin
data object MyDataObject {
    val number: Int = 3
}

fun main() {
    println(MyDataObject)
    // 输出结果为: MyDataObject
}
```
{kotlin-runnable="true" id="object-declaration-dataobject"}

此外, 编译器还会为你的 `data object` 生成一些函数:

* `toString()` 返回数据对象的名称
* `equals()`/`hashCode()` 可以用于相等检查, 以及基于 hash 值的集合

  > 你不能为 `data object` 的 `equals` 或 `hashCode` 函数提供自定义实现.
  >
  {style="note"}

`data object` 的 `equals()` 函数会保证你的 `data object` 的所有对象都被看作相等.
大多数情况下, 你的 `data object` 在运行期只会存在单个实例, 因为 `data object` 声明的就是一个单例(singleton).
但是, 在某些特殊情况下, 也可以在运行期生成相同类型的其他对象 (例如, 通过 `java.lang.reflect` 使用平台的反射功能, 或通过底层使用了这个 API 的 JVM 序列化库),
这个功能可以确保这些对象被当作相等.

> 请确保只对 `data objects` 进行结构化的相等比较 (使用 `==` 操作符), 而不要进行引用相等比较 (使用 `===` 操作符).
> 如果数据对象在运行期有一个以上的实例存在, 这样可以帮助你避免错误.
>
{style="warning"}

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton)
    // 输出结果为: MySingleton
  
    println(evilTwin)
    // 输出结果为: MySingleton

    // 即使一个库强行创建了 MySingleton 的第二个实例,
    // 它的 equals() 函数也会返回 true:
    println(MySingleton == evilTwin)
    // 输出结果为: true

    // 不要使用 === 比较数据对象
    println(MySingleton === evilTwin)
    // 输出结果为: false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin 的反射功能不允许创建数据对象的实例.
    // 这段代码 "强行" 创建新的 MySingleton 实例 (使用 Java 平台的反射功能)
    // 在你的代码中一定不要这样做!
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

编译器生成的 `hashCode()` 函数的行为与 `equals()` 函数保持一致, 因此一个 `data object` 的所有运行期实例都拥有相同的 hash 值.

#### 数据对象与数据类的区别 {id="differences-between-data-objects-and-data-classes"}

尽管 `data object` 和 `data class` 声明经常一起使用, 而且很相似, 但对于 `data object` 有一些函数没有生成:

* 没有 `copy()` 函数.
  因为 `data object` 声明通常用作单例, 因此不会生成 `copy()` 函数.
  单例限制一个类只有单个实例, 如果允许创建实例的拷贝, 就破坏了只存在单个实例的原则.
* 没有 `componentN()` 函数.
  与 `data class` 不同, `data object` 没有任何数据属性.
  对这种没有数据属性的对象进行解构是没有意义的, 因此不会生成 `componentN()` 函数.

#### 在封闭层级结构(Sealed Hierarchy)中使用数据对象 {id="use-data-objects-with-sealed-hierarchies"}

数据对象声明非常适合在封闭层级结构(Sealed Hierarchy) 中使用, 例如 [封闭类或封闭接口](sealed-classes.md).
这样的方式允许你声明数据类和数据对象, 并保持对称性.

在这个示例中, 将 `EndOfFile` 声明为 `data object`, 而不是普通的 `object`,
代表它自动拥有 `toString()` 函数, 不需要手动的覆盖这个函数:

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7))
    // 输出结果为: Number(number=7)
    println(EndOfFile)
    // 输出结果为: EndOfFile
}
```
{kotlin-runnable="true" id="data-objects-sealed-hierarchies"}

### 同伴对象(Companion Object) {id="companion-objects"}

_同伴对象(Companion Object)_ 可以用来定义类级的函数和属性.
因此可以很容易的创建工厂方法, 声明常数, 访问共用的工具函数.

一个类内部的对象声明, 可以使用 `companion` 关键字标记为同伴对象:

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```

访问 `companion object` 的成员时, 可以直接使用类名称作为限定符:

```kotlin
class User(val name: String) {
    // 定义一个同伴对象, 作为创建 User 实例的工厂
    companion object Factory {
        fun create(name: String): User = User(name)
    }
}

fun main(){
    // 使用类名称作为限定符, 调用同伴对象的工厂方法.
    // 创建一个新的 User 实例
    val userInstance = User.create("John Doe")
    println(userInstance.name)
    // 输出结果为: John Doe
}
```
{kotlin-runnable="true" id="object-expression-companion-object"}

`companion object` 的名称可以省略, 如果省略, 会使用默认名称 `Companion`:

```kotlin
class User(val name: String) {
    // 定义一个同伴对象, 不指定名称
    companion object { }
}

// 访问同伴对象
val companionUser = User.Companion
```

类的成员可以访问对应的 `companion object` 的 `private` 成员:

```kotlin
class User(val name: String) {
    companion object {
        private val defaultGreeting = "Hello"
    }

    fun sayHi() {
        println(defaultGreeting)
    }
}
User("Nick").sayHi()
// 输出结果为: Hello
```

直接使用一个类的名称时, 表示对这个类的同伴对象的引用, 无论同伴对象有没有名称:

```kotlin
//sampleStart
class User1 {
    // 定义一个同伴对象, 有名称
    companion object Named {
        fun show(): String = "User1's Named Companion Object"
    }
}

// 使用类名称引用 User1 的同伴对象
val reference1 = User1

class User2 {
    // 定义一个同伴对象, 没有名称
    companion object {
        fun show(): String = "User2's Companion Object"
    }
}

// 使用类名称引用 User2 的同伴对象
val reference2 = User2
//sampleEnd

fun main() {
    // 对 User1 的同伴对象调用 show() 函数
    println(reference1.show()) 
    // 输出结果为: User1's Named Companion Object

    // 对 User2 的同伴对象调用 show() 函数
    println(reference2.show()) 
    // 输出结果为: User2's Companion Object
}
```
{kotlin-runnable="true" id="object-expression-companion-object-names"}

尽管 Kotlin 中的同伴对象的成员看起来很像其他语言中的类的静态成员(static member),
但它们实际上是同伴对象的实例成员, 也就是说它们属于对象自身,
因此同伴对象可以实现接口:

```kotlin
interface Factory<T> {
    fun create(name: String): T
}

class User(val name: String) {
    // 定义一个同伴对象, 实现 Factory 接口
    companion object : Factory<User> {
        override fun create(name: String): User = User(name)
    }
}

fun main() {
    // 将同伴对象作为 Factory 使用
    val userFactory: Factory<User> = User
    val newUser = userFactory.create("Example User")
    println(newUser.name)
    // 输出结果为: Example User
}
```
{kotlin-runnable="true" id="object-expression-factory"}

但是, 在 JVM 上, 如果使用 `@JvmStatic` 注解, 你可以让同伴对象的成员被编译为真正的静态方法(static method)和静态域(static field).
详情请参见 [与 Java 的互操作性](java-to-kotlin-interop.md#static-fields).


## 对象表达式(Object expression) {id="object-expressions"}

对象表达式(object expression) 会声明一个类, 并为这个类创建一个实例, 但类和实例都没有名称.
这些类适合一次性使用. 这种类可以从头开始创建, 也可以从既有的类继承, 或者实现接口.
这些类的实例称为 _匿名对象_, 因为它们通过表达式来定义, 而不是通过名称.

### 从头创建匿名对象 {id="create-anonymous-objects-from-scratch"}

对象表达式以 `object` 关键字起始.

如果对象不继承任何类也不实现任何接口, 你可以直接在  `object` 关键字之后的大括号内定义对象的成员:

```kotlin
fun main() {
//sampleStart
    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // 对象表达式继承 Any 类型, 已经有了 toString() 函数,
        // 因此必须覆盖这个函数
        override fun toString() = "$hello $world"
    }

    print(helloWorld)
    // 输出结果为: Hello World
//sampleEnd
}
```
{kotlin-runnable="true" id="object-expression-object"}

### 从基类继承匿名对象 {id="inherit-anonymous-objects-from-supertypes"}

要创建一个继承自某个类(或多个类)的匿名对象, 需要在 `object` 关键字和冒号 `:` 之后指定基类.
然后实现或覆盖基类的成员, 就和你在 [继承](inheritance.md) 这个基类时一样:

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

如果某个基类有构造器, 那么必须向构造器传递适当的参数.
要指定多个基类, 可以用逗号分隔, 放在冒号之后:

```kotlin
//sampleStart
// 创建一个 open 类 BankAccount, 包含 balance 属性
open class BankAccount(initialBalance: Int) {
    open val balance: Int = initialBalance
}

// 定义一个接口 Transaction, 包含 execute() 函数
interface Transaction {
    fun execute()
}

// 这个函数对一个 BankAccount 执行特殊交易
fun specialTransaction(account: BankAccount) {
    // 创建一个匿名对象, 继承 BankAccount 类, 并实现 Transaction 接口
    // 指定的 account 的 balance 被传递给 BankAccount 超类的构造器
    val temporaryAccount = object : BankAccount(account.balance), Transaction {
        override val balance = account.balance + 500  // 临时的奖金

        // 实现 Transaction 接口的 execute() 函数
        override fun execute() {
            println("Executing special transaction. New balance is $balance.")
        }
    }
    // 执行交易
    temporaryAccount.execute()
}
//sampleEnd
fun main() {
    // 创建一个 BankAccount, 初始的 balance 值为 1000
    val myAccount = BankAccount(1000)
    // 对创建的 account 执行特殊交易
    specialTransaction(myAccount)
    // 输出结果为: Executing special transaction. New balance is 1500.
}
```
{kotlin-runnable="true" id="object-expression-anonymous-object"}

### 将匿名对象用作返回类型或值类型 {id="use-anonymous-objects-as-return-and-value-types"}

当你从一个局部的, 或 [`private`](visibility-modifiers.md#packages) 的函数或属性,
返回一个匿名对象, 那么通过这个函数或属性可以访问匿名对象的所有成员:

```kotlin
//sampleStart
class UserPreferences {
    private fun getPreferences() = object {
        val theme: String = "Dark"
        val fontSize: Int = 14
    }

    fun printPreferences() {
        val preferences = getPreferences()
        println("Theme: ${preferences.theme}, Font Size: ${preferences.fontSize}")
    }
}
//sampleEnd

fun main() {
    val userPreferences = UserPreferences()
    userPreferences.printPreferences()
    // 输出结果为: Theme: Dark, Font Size: 14
}
```
{kotlin-runnable="true" id="object-expression-object-return"}

因此你可以返回一个包含特定属性的匿名对象, 提供一种简单的方式来封装数据或行为, 而不必创建一个单独的类.

如果返回匿名对象的函数或属性的可见度为 `public`, `protected`, 或 `internal`, 那么它的真实类型为:

* 如果匿名对象没有声明基类型, 则类型为 `Any`.
* 如果匿名对象声明了唯一一个基类型, 则类型为这个基类型.
* 如果匿名对象声明了多个基类型, 则需要为这个函数或属性明确声明类型.

在这些情况中, 通过这个函数或属性的返回值, 对于匿名对象新添加的成员, 不可访问.
对于匿名对象覆盖的成员, 如果定义在这个函数或属性的真实类型中, 则可以访问. 例如:

```kotlin
//sampleStart
interface Notification {
    // 在 Notification 接口中声明 notifyUser()
    fun notifyUser()
}

interface DetailedNotification

class NotificationManager {
    // 返回类型为 Any. 不能访问 message 属性.
    // 当返回类型为 Any 时, 只能访问 Any 类的成员.
    fun getNotification() = object {
        val message: String = "General notification"
    }

    // 返回类型为 Notification, 因为匿名对象只实现一个接口
    // 可以访问 notifyUser() 函数, 因为它是 Notification 接口的一部分
    // 不能访问 message 属性, 因为它没有在 Notification 接口中声明
    fun getEmailNotification() = object : Notification {
        override fun notifyUser() {
            println("Sending email notification")
        }
        val message: String = "You've got mail!"
    }

    // 返回类型为 DetailedNotification. 不能访问 notifyUser() 函数和 message 属性
    // 只能访问 DetailedNotification 接口中声明的成员
    fun getDetailedNotification(): DetailedNotification = object : Notification, DetailedNotification {
        override fun notifyUser() {
            println("Sending detailed notification")
        }
        val message: String = "Detailed message content"
    }
}
//sampleEnd
fun main() {
    // 这里不会产生输出
    val notificationManager = NotificationManager()

    // 这里不能访问 message 属性, 因为返回类型为 Any
    // 这里不会产生输出
    val notification = notificationManager.getNotification()

    // 可以访问 notifyUser() 函数
    // 这里不能访问 message 属性, 因为返回类型为 Notification
    val emailNotification = notificationManager.getEmailNotification()
    emailNotification.notifyUser()
    // 输出结果为: Sending email notification

    // 这里不能访问 notifyUser() 函数和 message 属性, 因为返回类型为 DetailedNotification
    // 这里不会产生输出
    val detailedNotification = notificationManager.getDetailedNotification()
}
```
{kotlin-runnable="true" id="object-expression-object-override"}

### 通过匿名对象访问变量 {id="access-variables-from-anonymous-objects"}

对象表达式 body 部之内的代码, 可以访问创建这个对象的代码范围内的变量:

```kotlin
import java.awt.event.MouseAdapter
import java.awt.event.MouseEvent

fun countClicks(window: JComponent) {
    var clickCount = 0
    var enterCount = 0

    // MouseAdapter provides default implementations for mouse event functions
    // Simulates MouseAdapter handling mouse events
    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent) {
            clickCount++
        }

        override fun mouseEntered(e: MouseEvent) {
            enterCount++
        }
    })
    // 在对象表达式内部, 可以访问 clickCount 和 enterCount 变量
}
```

## 对象声明与对象表达式在行为上的区别 {id="behavior-difference-between-object-declarations-and-expressions"}

对象声明与对象表达式在初始化上存在一些区别:

* 对象表达式则会在使用处 _立即_ 执行(并且初始化).
* 对象声明是 _延迟(lazily)_ 初始化的, 只会在首次访问时才会初始化.
* 同伴对象会在对应的类被装载(解析)时初始化, 语义上等价于 Java 的静态初始化代码块(static initializer).
