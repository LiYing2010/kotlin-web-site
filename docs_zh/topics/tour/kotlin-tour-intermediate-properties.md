[//]: # (title: 中级教程: 属性)

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接受者的 Lambda 表达式</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类与接口</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">开放类与特殊类</a><br />
        <img src="icon-7.svg" width="20" alt="Seventh step" /> <strong>属性</strong><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null 值安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库与 API</a></p>
</tldr>

在初学者教程中, 你已经学习了如何使用属性来声明类实例的特征, 以及如何访问属性.
在这一章中, 我们进一步深入介绍 Kotlin 中的属性如何工作, 并探索在代码中使用属性的其它方式.

## 后端域变量(Backing Field) {id="backing-fields"}

在 Kotlin 中, 属性拥有默认的 `get()` 和 `set()` 函数, 称为属性访问器, 负责获取和修改属性值.
这些默认函数在代码中并不明确的可见, 编译器自动生成这些函数, 在后台管理属性的访问.
这些访问器使用一个 **后端域变量(Backing Field)** 来存储实际的属性值.

如果以下条件中的任何一个成立, 后端域变量就会存在:

* 你对属性使用默认的 `get()` 或 `set()` 函数.
* 你在代码中使用 `field` 关键字访问属性值.

> `get()` 和 `set()` 函数也叫做取值函数(getter)和设值函数(setter).
>
{style="tip"}

例如, 这段代码有一个 `category` 属性, 它没有自定义的 `get()` 或 `set()` 函数, 因此使用默认的实现:

```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

在底层实现中, 这段代码等价于下面的伪代码:

```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
        get() = field
        set(value) {
            field = value
        }
}
```
{validate="false"}

在这个示例中:

* `get()` 函数从域变量获取属性值: `""`.
* `set()` 函数接受参数 `value`, 并将它赋值给域变量, 其中 `value` 为 `""`.

当你想要在你的 `get()` 或 `set()` 函数中添加额外的逻辑, 又不引起无限的循环, 访问后端域变量会很有用.
例如, 你有一个 `Person` 类, 它有一个 `name` 属性:


```kotlin
class Person {
    var name: String = ""
}
```

你想要确保 `name` 属性的首字母为大写, 因此创建了一个自定义 `set()` 函数, 它使用 [`.replaceFirstChar()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace-first-char.html) 
和 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase-char.html) extension 函数.
但是, 如果在你的 `set()` 函数中直接引用属性, 就会导致无限循环, 并在运行期发生 `StackOverflowError` 错误:

```kotlin
class Person {
    var name: String = ""
        set(value) {
            // 这里会导致运行期错误
            name = value.replaceFirstChar { firstChar -> firstChar.uppercase() }
        }
}

fun main() {
    val person = Person()
    person.name = "kodee"
    println(person.name)
    // 这里会发生错误: Exception in thread "main" java.lang.StackOverflowError
}
```
{validate ="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-stackoverflow"}

要解决这个问题, 可以在你的 `set()` 函数中改为通过 `field` 关键字引用后端域变量:

```kotlin
class Person {
    var name: String = ""
        set(value) {
            field = value.replaceFirstChar { firstChar -> firstChar.uppercase() }
        }
}

fun main() {
    val person = Person()
    person.name = "kodee"
    println(person.name)
    // 输出结果为: Kodee
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-backingfield"}

当你想要添加日志, 在属性值变更时发送通知, 或者使用附加逻辑比较属性的旧值和新值时, 后端域变量也很有用.

详情请参见 [后端域变量](properties.md#backing-fields).

## 扩展属性 {id="extension-properties"}

和扩展函数一样, 也有扩展属性. 扩展属性让你能够向既有的类添加新的属性, 而不必修改它们的源代码.
但是, Kotlin 中的扩展属性 **没有** 后端域变量. 这就意味着你需要自己编写 `get()` 和 `set()` 函数.
此外, 没有后端域变量也意味着扩展属性不能保存任何状态.

要声明一个扩展属性, 请在你想要扩展的类的名称之后加上 `.`, 再加上属性的名称.
和通常的类属性一样, 你需要为你的属性声明接受者类型.
例如:

```kotlin
val String.lastChar: Char
```
{validate="false"}

当你想要属性包含计算得到的值, 而不使用继承时, 扩展属性是很有用的.
你可以将扩展属性想象为一个函数, 只有一个参数: 接受者对象.

例如, 假设你有一个数据类 `Person`, 它有 2 个属性: `firstName` 和 `lastName`.

```kotlin
data class Person(val firstName: String, val lastName: String)
```

你想要得到人的全名, 但不要修改 `Person` data 类, 也不要继承它.
你可以创建一个带有自定义 `get()` 函数的扩展属性来实现这一点:

```kotlin
data class Person(val firstName: String, val lastName: String)

// 扩展属性, 用于得到全名
val Person.fullName: String
    get() = "$firstName $lastName"

fun main() {
    val person = Person(firstName = "John", lastName = "Doe")

    // 使用扩展属性
    println(person.fullName)
    // 输出结果为: John Doe
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-extension"}

> 扩展属性不能覆盖既有的类属性.
> 
{style="note"}

与扩展函数一样, Kotlin 标准库大量使用了扩展属性.
例如, 请参见 `CharSequence` 的 [`lastIndex` 属性](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/last-index.html).

## 委托属性(Delegated Property) {id="delegated-properties"}

在 [类与接口](kotlin-tour-intermediate-classes-interfaces.md#delegation) 章节中, 你已经学习了委托.
你也可以对属性使用委托, 将它们的属性访问器委托给另一个对象.
当你的需求比存储属性更加复杂, 简单的后端域变量无法处理时, 委托属性会很有用, 例如需要将值存储到数据表中, 浏览器会话中, 或 Map 中.
使用委托属性(Delegated Property) 也可以减少样板代码, 因为取得和设置你的属性的逻辑只存在于你委托的对象中.

委托属性的语法与类的委托类似, 但操作层级不同.
请声明你的属性, 后面加上 `by` 关键字, 再加上你想要委托的对象. 例如:

```kotlin
val displayName: String by Delegate
```

这里, 委托属性 `displayName` 使用 `Delegate` 对象作为它的属性访问器.

你委托的每个对象 **必须** 有一个 `getValue()` 操作符函数, Kotlin 使用它来获取委托属性的值.
如果属性是可变的, 还必须有一个 `setValue()` 操作符函数, Kotlin 使用它来设置委托属性的值.

默认情况下, `getValue()` 和 `setValue()` 函数的结构如下:

```kotlin
operator fun getValue(thisRef: Any?, property: KProperty<*>): String {}

operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {}
```
{validate="false"}

在这些函数中:

* `operator` 关键字将这些函数标记为操作符函数, 允许它们覆盖 `get()` 和 `set()` 函数.
* `thisRef` 参数表示 **包含** 委托属性的对象. 默认情况下, 类型设置为 `Any?`, 但你可能需要声明更具体的类型.
* `property` 参数表示值正在被访问或被修改的那个属性. 你可以使用这个参数来获取属性信息, 例如属性的名称或类型.
  默认情况下, 类型设置为 `KProperty<*>`. 在你的代码中, 不必进行修改.

`getValue()` 函数的返回类型默认为 `String`, 但如果你需要, 可以调整这个类型.

`setValue()` 函数有一个额外的参数 `value`, 用来保存正在赋值给属性的新值.

那么, 在实际运用中是什么样的呢? 假设你想要一个计算得到的属性, 例如用户的显示名称, 它只计算一次,
因为这个操作性能开销较大, 而你的应用程序对性能比较敏感.
你可以使用一个委托属性来缓存显示名称, 让它只计算一次, 但可以随时读取, 而不带来性能损失.

首先, 你需要创建负责委托的对象. 在这个示例中, 对象将是 `CachedStringDelegate` 类的一个实例:

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null
}
```

`cachedValue` 属性包含缓存的值. 在 `CachedStringDelegate` 类中,
将你在委托属性的 `get()` 函数中想要的行为, 添加到 `getValue()` 操作符函数的 body 部:

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null

    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        if (cachedValue == null) {
            cachedValue = "Default Value"
            println("Computed and cached: $cachedValue")
        } else {
            println("Accessed from cache: $cachedValue")
        }
        return cachedValue ?: "Unknown"
    }
}
```

`getValue()` 函数检查 `cachedValue` 属性是否为 `null`. 如果是, 函数将它赋值为 `"Default value"`, 并打印输出一个字符串, 作为日志.
如果 `cachedValue` 属性已经有了计算的值, 那么属性不为 `null`. 这种情况下, 并打印输出另一个字符串, 作为日志.
最后, 函数使用 Elvis 操作符, 返回缓存的值, 或者如果值为 `null`, 则返回 `"Unknown"`.

现在你可以将想要缓存的属性(`val displayName`)委托给 `CachedStringDelegate` 类的实例:

```kotlin
import kotlin.reflect.KProperty

class CachedStringDelegate {
    var cachedValue: String? = null

    operator fun getValue(thisRef: User, property: KProperty<*>): String {
        if (cachedValue == null) {
            cachedValue = "${thisRef.firstName} ${thisRef.lastName}"
            println("Computed and cached: $cachedValue")
        } else {
            println("Accessed from cache: $cachedValue")
        }
        return cachedValue ?: "Unknown"
    }
}

class User(val firstName: String, val lastName: String) {
    val displayName: String by CachedStringDelegate()
}

fun main() {
    val user = User("John", "Doe")

    // 第 1 次访问属性时, 计算值, 并缓存
    println(user.displayName)
    // 输出结果为: Computed and cached: John Doe
    // 输出结果为: John Doe

    // 后续访问属性时, 会从缓存获取值
    println(user.displayName)
    // 输出结果为: Accessed from cache: John Doe
    // 输出结果为: John Doe
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-delegated"}

在这个示例中:

* 创建一个 `User` 类, 它的 header 部有 2 个属性, `firstName`, 和 `lastName`, body 部有 1 个 属性, `displayName`.
* 将 `displayName` 属性委托给 `CachedStringDelegate` 类的实例.
* 创建 `User` 类的一个实例 `user`.
* 打印输出对 `user` 实例访问 `displayName` 属性的结果.

请注意, 在 `getValue()` 函数中, `thisRef` 参数的类型从 `Any?` 类型缩小到了对象类型: `User`.
这是为了让编译器能够访问 `User` 类的 `firstName` 和 `lastName` 属性.

### 标准委托 {id="standard-delegates"}

Kotlin 标准库提供了一些有用的委托, 让你不必总是从头创建.
如果你使用这些委托, 你不需要定义 `getValue()` 和 `setValue()` 函数, 因为标准库会自动提供.

#### 延迟加载(Lazy)属性 {id="lazy-properties"}

为了只在初次访问时才初始化一个属性, 请使用延迟加载(Lazy)属性. 标准库为委托提供了 `Lazy` 接口.

要创建 `Lazy` 接口的实例, 请使用 `lazy()` 函数, 给它提供一个 Lambda 表达式, `get()` 函数第一次被调用时会执行这个 Lambda 表达式.
之后对 `get()` 函数的任何调用都会返回与第一次调用时提供的相同结果.
延迟加载属性使用 [尾缀 Lambda 表达式(Trailing Lambda)](kotlin-tour-functions.md#trailing-lambdas) 语法来传递 Lambda 表达式.

例如:

```kotlin
class Database {
    fun connect() {
        println("Connecting to the database...")
    }

    fun query(sql: String): List<String> {
        return listOf("Data1", "Data2", "Data3")
    }
}

val databaseConnection: Database by lazy {
    val db = Database()
    db.connect()
    db
}

fun fetchData() {
    val data = databaseConnection.query("SELECT * FROM data")
    println("Data: $data")
}

fun main() {
    // 第 1 次访问 databaseConnection
    fetchData()
    // 输出结果为: Connecting to the database...
    // 输出结果为: Data: [Data1, Data2, Data3]

    // 后续访问, 会使用已有的连接
    fetchData()
    // 输出结果为: Data: [Data1, Data2, Data3]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-lazy"}

在这个示例中:

* 有一个 `Database` 类,它有 `connect()` 和 `query()` 成员函数.
* `connect()` 函数向控制台打印输出一个字符串, `query()` 函数接受一个 SQL 查询, 返回一个 List.
* 有一个 `databaseConnection` 属性, 它是延迟加载属性.
* 向 `lazy()` 函数提供的 Lambda 表达式:
  * 创建一个 `Database` 类实例.
  * 对这个实例(`db`)调用 `connect()` 成员函数.
  * 返回这个实例.
* 有一个 `fetchData()` 函数:
  * 对 `databaseConnection` 属性调用 `query()` 函数, 创建一个 SQL 查询.
  * 将 SQL 查询赋值给 `data` 变量.
  * 将 `data` 变量打印输出到控制台.
* `main()` 函数调用 the `fetchData()` 函数. 第 1 次被调用时, 延迟加载属性会被初始化.
第 2 次被调用时, 会返回与第 1 次调用相同的结果.

延迟加载属性不仅对资源密集型的初始化有用, 而且对于你的代码中可能不会用到的属性也很有用.
此外, 延迟加载属性默认是线程安全的, 这一点对于并发环境尤其有用.

详情请参见 [延迟加载属性](delegated-properties.md#lazy-properties).

#### 可观察(Observable)属性 {id="observable-properties"}

要监测属性值的变更, 请使用可观察(Observable)属性.
可观察属性 is useful when
如果你想要监测属性值的变更, 并利用这个信息来触发某种反应, 可观察属性会很有用.
标准库提供了 `Delegates` 对象可以用作委托.

要创建一个可观察属性, 你首先要导入 `kotlin.properties.Delegates.observable`.
然后, 使用 `observable()` 函数, 并为这个函数提供一个 Lambda 表达式, 当属性发生变更时会执行这个 Lambda 表达式.
与延迟加载属性一样, 可观察属性使用 [尾缀 Lambda 表达式(Trailing Lambda)](kotlin-tour-functions.md#trailing-lambdas) 语法来传递 Lambda 表达式.

例如:

```kotlin
import kotlin.properties.Delegates.observable

class Thermostat {
    var temperature: Double by observable(20.0) { _, old, new ->
        if (new > 25) {
            println("Warning: Temperature is too high! ($old°C -> $new°C)")
        } else {
            println("Temperature updated: $old°C -> $new°C")
        }
    }
}

fun main() {
    val thermostat = Thermostat()
    thermostat.temperature = 22.5
    // 输出结果为: Temperature updated: 20.0°C -> 22.5°C

    thermostat.temperature = 27.0
    // 输出结果为: Warning: Temperature is too high! (22.5°C -> 27.0°C)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-observable"}

在这个示例中:

* 有一个 `Thermostat` 类, 包含一个可观察属性: `temperature`.
* `observable()` 函数接受参数 `20.0`, 并将使用它来初始化属性.
* 提供给 `observable()` 函数的 Lambda 表达式:
  * 有 3 个参数:
    * `_`, 表示属性本身.
    * `old`, 表示属性的旧值.
    * `new`, 表示属性的新值.
  * 检查 `new` 参数是否大于 `25`, 根据检查结果, 向控制台打印输出一个字符串.
* `main()` 函数:
  * 创建 `Thermostat` 类的一个实例 `thermostat`.
  * 将实例的 `temperature` 属性值更新到 `22.5`, 这时会触发温度更新信息的打印输出语句.
  * 将实例的 `temperature` 属性值更新到 `27.0`, 这时会触发警告信息的打印输出语句.

可观察属性不仅可用于日志输出和调试目的. 还可以用于其它使用场景, 例如UI 更新, 或执行额外检查, 例如验证数据有效性.

详情请参见 [可观察属性](delegated-properties.md#observable-properties).

## 实际练习 {id="practice"}

### 习题 1 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-1"}

你管理着一家书店的库存系统. 库存信息保存在一个 List 中, 其中的每个元素表示某种书的数量.
例如, `listOf(3, 0, 7, 12)` 表示书店中第 1 种书有 3 份, 第 2 种书有 0 份, 第 3 种书有 7 份, 第 4 种书有 12 份.

请编写一个函数 `findOutOfStockBooks()`, 返回一个 List, 其中包含所有缺货书籍的索引.

<deflist collapsible="true">
    <def title="提示 1">
        使用标准库中的 <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/indices.html"><code>indices</code></a> 扩展属性.
    </def>
</deflist>

<deflist collapsible="true">
    <def title="提示 2">
        你可以使用 <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/build-list.html"><code>buildList()</code></a> 函数来创建和管理 List, 而不是手动的创建并返回一个可变的 List. <code>buildList()</code> 函数使用一个带接受者的 Lambda 表达式, 你在前面的章节中已经学过.
    </def>
</deflist>

|--|--|

```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> {
    // 请在这里编写你的代码
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // 输出结果为: [1, 3]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-1"}

|---|---|
```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> {
    val outOfStockIndices = mutableListOf<Int>()
    for (index in inventory.indices) {
        if (inventory[index] == 0) {
            outOfStockIndices.add(index)
        }
    }
    return outOfStockIndices
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // 输出结果为: [1, 3]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案 1" id="kotlin-tour-properties-solution-1-1"}

|---|---|
```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> = buildList {
    for (index in inventory.indices) {
        if (inventory[index] == 0) {
            add(index)
        }
    }
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // 输出结果为: [1, 3]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案 2" id="kotlin-tour-properties-solution-1-2"}

### 习题 2 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-2"}

你有一个旅行 App, 需要以公里和英里为单位显示距离.
请为 `Double` 类型创建一个扩展属性 `asMiles`, 将距离从公里转换为英里:

> 从公里转换为英里的公式是 `miles = kilometers * 0.621371`.
>
{style="note"}

<deflist collapsible="true">
    <def title="提示">
        请记住, 扩展属性需要自定义的 <code>get()</code> 函数.
    </def>
</deflist>

|---|---|

```kotlin
val // 请在这里编写你的代码

fun main() {
    val distanceKm = 5.0
    println("$distanceKm km is ${distanceKm.asMiles} miles")
    // 输出结果为: 5.0 km is 3.106855 miles

    val marathonDistance = 42.195
    println("$marathonDistance km is ${marathonDistance.asMiles} miles")
    // 输出结果为: 42.195 km is 26.218757 miles
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-2"}

|---|---|
```kotlin
val Double.asMiles: Double
    get() = this * 0.621371

fun main() {
    val distanceKm = 5.0
    println("$distanceKm km is ${distanceKm.asMiles} miles")
    // 输出结果为: 5.0 km is 3.106855 miles

    val marathonDistance = 42.195
    println("$marathonDistance km is ${marathonDistance.asMiles} miles")
    // 输出结果为: 42.195 km is 26.218757 miles
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-properties-solution-2"}

### 习题 3 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-3"}

你有一个系统健康状况检查器, 能够检查云系统的状态.
它有 2 个函数用来执行健康状况检查, 但是这 2 个函数会消耗大量性能.
请使用延迟加载属性来初始化这些检查, 让这些性能消耗巨大的函数只在需要是运行:

|---|---|

```kotlin
fun checkAppServer(): Boolean {
    println("Performing application server health check...")
    return true
}

fun checkDatabase(): Boolean {
    println("Performing database health check...")
    return false
}

fun main() {
    // 请在这里编写你的代码

    when {
        isAppServerHealthy -> println("Application server is online and healthy")
        isDatabaseHealthy -> println("Database is healthy")
        else -> println("System is offline")
    }
    // 输出结果为: Performing application server health check...
    // 输出结果为: Application server is online and healthy
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-3"}

|---|---|
```kotlin
fun checkAppServer(): Boolean {
    println("Performing application server health check...")
    return true
}

fun checkDatabase(): Boolean {
    println("Performing database health check...")
    return false
}

fun main() {
    val isAppServerHealthy by lazy { checkAppServer() }
    val isDatabaseHealthy by lazy { checkDatabase() }

    when {
        isAppServerHealthy -> println("Application server is online and healthy")
        isDatabaseHealthy -> println("Database is healthy")
        else -> println("System is offline")
    }
   // 输出结果为: Performing application server health check...
   // 输出结果为: Application server is online and healthy
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-properties-solution-3"}

### 习题 4 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-4"}

你正在构建一个简单的预算追踪 App. App 需要监测用户预算余额的变化, 并在余额低于某个阈值时通知用户.
你有一个 `Budget` 类, 使用 `totalBudget` 属性初始化, 这个属性包含预算初始金额.
请在这个类中创建一个可观察属性 `remainingBudget`, 它需要:

* 当余额低于预算初始金额的 20% 时, 打印输出一个警告信息.
* 当预算高于前一个值时, 打印输出一个鼓励信息.

|---|---|

```kotlin
import kotlin.properties.Delegates.observable

class Budget(val totalBudget: Int) {
    var remainingBudget: Int // 请在这里编写你的代码
}

fun main() {
    val myBudget = Budget(totalBudget = 1000)
    myBudget.remainingBudget = 800
    myBudget.remainingBudget = 150
    // 输出结果为: Warning: Your remaining budget (150) is below 20% of your total budget.
    myBudget.remainingBudget = 50
    // 输出结果为: Warning: Your remaining budget (50) is below 20% of your total budget.
    myBudget.remainingBudget = 300
    // 输出结果为: Good news: Your remaining budget increased to 300.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-4"}

|---|---|
```kotlin
import kotlin.properties.Delegates.observable

class Budget(val totalBudget: Int) {
    var remainingBudget: Int by observable(totalBudget) { _, oldValue, newValue ->
        if (newValue < totalBudget * 0.2) {
            println("Warning: Your remaining budget ($newValue) is below 20% of your total budget.")
        } else if (newValue > oldValue) {
            println("Good news: Your remaining budget increased to $newValue.")
        }
    }
}

fun main() {
    val myBudget = Budget(totalBudget = 1000)
    myBudget.remainingBudget = 800
    myBudget.remainingBudget = 150
    // 输出结果为: Warning: Your remaining budget (150) is below 20% of your total budget.
    myBudget.remainingBudget = 50
    // 输出结果为: Warning: Your remaining budget (50) is below 20% of your total budget.
    myBudget.remainingBudget = 300
    // 输出结果为: Good news: Your remaining budget increased to 300.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-properties-solution-4"}

## 下一步 {id="next-step"}

[中级教程: Null 值安全性](kotlin-tour-intermediate-null-safety.md)
