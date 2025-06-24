[//]: # (title: 中级教程: Null 值安全性)

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接受者的 Lambda 表达式</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类与接口</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">开放类与特殊类</a><br />
        <img src="icon-7-done.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8.svg" width="20" alt="Eighth step" /> <strong>Null 值安全性</strong><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库与 API</a></p>
</tldr>

在初学者教程中, 你已经学习了如何在代码中处理 `null` 值.
这一章介绍 Null 值安全性功能的常见使用场景, 以及如何充分利用这些功能.

## 智能类型转换(Smart Cast) 与安全类型转换(Safe Cast) {id="smart-casts-and-safe-casts"}

Kotlin 有些时候能够推断类型, 不需要明确的声明.
如果你告诉 Kotlin 将一个变量或对象当作某个特定的类型处理, 这个过程叫做 **类型转换**.
如果类型能够自动转换时, 例如能够推断得到, 称为 **智能类型转换(Smart Cast)**.

### is 和 !is 操作符 {id="is-and-is-operators"}

在探索类型转换的工作原理之前, 我们来看看如何检查一个对象是不是某个类型.
为了实现这样的检查, 你可以使用 `is` 和 `!is` 操作符, 与 `when` 或 `if` 条件表达式:

* `is` 检查对象是否属于这个类型, 并返回 boolean 值.
* `!is` 检查对象是否 **不属于** 这个类型, 并返回 boolean 值.

例如:

```kotlin
fun printObjectType(obj: Any) {
    when (obj) {
        is Int -> println("It's an Integer with value $obj")
        !is Double -> println("It's NOT a Double")
        else -> println("Unknown type")
    }
}

fun main() {
    val myInt = 42
    val myDouble = 3.14
    val myList = listOf(1, 2, 3)
  
    // 类型为 Int
    printObjectType(myInt)
    // 输出结果为: It's an Integer with value 42

    // 类型为 List, 因此它不是 Double.
    printObjectType(myList)
    // 输出结果为: It's NOT a Double

    // 类型为 Double, 因此会执行 else 分支.
    printObjectType(myDouble)
    // 输出结果为: Unknown type
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-casts"}

> 在 [开放类与特殊类](kotlin-tour-intermediate-open-special-classes.md#sealed-classes) 章节中,
> 你已经看到了如何使用 `when` 调节表达式以及 `is` 和 `!is` 操作符的示例.
> 
{style="tip"}

### as 和 as? 操作符 {id="as-and-as-operators"}

要明确的将一个对象 _转换_ 为另一个类型, 请使用 `as` 操作符. 包括从可为 Null 的类型转换为不可为 Null 类型的情况.
如果无法转换, 程序会在 **运行期** 崩溃. 所以 `as` 被称为 **不安全的** 类型转换操作符.

```kotlin
fun main() {
//sampleStart
    val a: String? = null
    val b = a as String

    // 这里会发生运行期错误
    print(b)
//sampleEnd
}
```
{kotlin-runnable="true" validate="false" id="kotlin-tour-null-safety-as-operator"}

要明确的将一个对象转换为不可为 Null 的类型, 但在转换失败时返回 `null` 而不是抛出异常, 请使用 `as?` 操作符.
由于 `as?` 操作符在失败时不会发生错误, 因此称为 **安全的** 类型转换操作符.

```kotlin
fun main() {
//sampleStart
    val a: String? = null
    val b = a as? String

    // 返回 null 值
    print(b)
    // null
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-safe-operator"}

你可以将 `as?` 操作符与 Elvis 操作符 `?:` 结合起来, 将多行代码精简为一行.
例如, 下面的 `calculateTotalStringLength()` 函数计算一个混合 List 中提供的所有字符串的总长度:

```kotlin
fun calculateTotalStringLength(items: List<Any>): Int {
    var totalLength = 0

    for (item in items) {
        totalLength += if (item is String) {
            item.length
        } else {
            0  // 对于不是字符串的元素, 加 0
        }
    }

    return totalLength
}
```

在这个示例中:

* 使用 `totalLength` 变量作为计数器.
* 使用 `for` 循环, 遍历 List 中的每个元素.
* 使用 `if` 和 `is` 操作符, 检查当前元素是不是字符串:
  * 如果是, 将字符串长度加到计数器.
  * 如果不是, 计数器不会增加.
* 返回 `totalLength` 变量最终的值.

这段代码可以精简为:

```kotlin
fun calculateTotalStringLength(items: List<Any>): Int {
    return items.sumOf { (it as? String)?.length ?: 0 }
}
```

这个示例使用 [`.sumOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sum-of.html) 扩展函数, 并对这个函数提供一个 Lambda 表达式:

* 对 List 中的每个元素, 使用 `as?`, 执行安全的类型转换, 转换为 `String`.
* 使用安全调用 `?.`, 如果前面的调用没有返回 `null` 值, 则访问 `length` 属性.
* 使用 Elvis 操作符 `?:`, 如果安全调用返回 `null` 值, 返回 `0`.

## Null 值与集合 {id="null-values-and-collections"}

在 Kotlin 中, 使用集合经常需要处理 `null` 值, 并过滤掉不需要的元素.
Kotlin 有很多有用的函数, 在处理 List, Set, Map, 和其他类型的集合时, 你可以用它们编写出简洁, 高效, 而且 Null 值安全的代码.

从一个 List 过滤掉 `null` 值, 请使用 [`filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html) 函数:

```kotlin
fun main() {
//sampleStart
    val emails: List<String?> = listOf("alice@example.com", null, "bob@example.com", null, "carol@example.com")

    val validEmails = emails.filterNotNull()

    println(validEmails)
    // 输出结果为: [alice@example.com, bob@example.com, carol@example.com]
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-filternotnull"}

如果你想要在创建 List 时直接过滤 `null` 值, 请使用 [`listOfNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/list-of-not-null.html) 函数:

```kotlin
fun main() {
//sampleStart
    val serverConfig = mapOf(
        "appConfig.json" to "App Configuration",
        "dbConfig.json" to "Database Configuration"
    )

    val requestedFile = "appConfig.json"
    val configFiles = listOfNotNull(serverConfig[requestedFile])

    println(configFiles)
    // 输出结果为: [App Configuration]
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-listofnotnull"}

在这两个示例中, 如果所有元素都是 `null` 值, 会返回空的 List.

Kotlin 还提供了一些函数, 可以在集合中查找值. 如果值没有找到, 这些函数会返回 `null` 值, 而不是发生错误:

* [`singleOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/single-or-null.html) 根据确定的值, 只查找一个元素. 如果值不存在, 或者相同的值存在多个元素, 返回 `null` 值.
* [`maxOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-or-null.html) 查找最大值. 如果不存在, 返回 `null` 值.
* [`minOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/min-or-null.html) 查找最小值. 如果不存在, 返回 `null` 值.

例如:

```kotlin
fun main() {
//sampleStart
    // 一周的温度记录
    val temperatures = listOf(15, 18, 21, 21, 19, 17, 16)

    // 检查是否存在某一天的温度为 30 度
    val singleHotDay = temperatures.singleOrNull()
    println("Single hot day with 30 degrees: ${singleHotDay ?: "None"}")
    // 输出结果为: Single hot day with 30 degrees: None

    // 查找一周中的最高温度
    val maxTemperature = temperatures.maxOrNull()
    println("Highest temperature recorded: ${maxTemperature ?: "No data"}")
    // 输出结果为: Highest temperature recorded: 21

    // 查找一周中的最低温度
    val minTemperature = temperatures.minOrNull()
    println("Lowest temperature recorded: ${minTemperature ?: "No data"}")
    // 输出结果为: Lowest temperature recorded: 15
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-collections"}

这个示例中, 如果函数返回 `null` 值, 则使用 Elvis 操作符 `?:` 返回打印输出语句.

> `singleOrNull()`, `maxOrNull()`, 和 `minOrNull()` 函数只能用于 **不** 包含 `null` 值的集合.
> 否则, 你就无法区分: 函数找不到需要的值? 还是它找到了 `null` 值?
>
{style="note"}

有些函数使用 Lambda 表达式来转换集合, 如果无法实现目的, 则返回 `null` 值.

例如, 要使用 Lambda 表达式转换集合, 并返回第一个值非 `null` 的值, 请使用 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first-not-null-of-or-null.html) 函数.
如果不存在这样的值, 函数返回 `null` 值:

```kotlin
fun main() {
//sampleStart
    data class User(val name: String?, val age: Int?)

    val users = listOf(
        User(null, 25),
        User("Alice", null),
        User("Bob", 30)
    )

    val firstNonNullName = users.firstNotNullOfOrNull { it.name }
    println(firstNonNullName)
    // 输出结果为: Alice
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-firstnotnullofornull"}

要使用 Lambda 函数顺序的处理每个集合元素, 并创建一个累计的值 (或者如果集合为空, 返回 `null` 值),
请使用 [`reduceOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce-or-null.html) 函数:

```kotlin
fun main() {
//sampleStart
    // 购物车中商品的价格
    val itemPrices = listOf(20, 35, 15, 40, 10)

    // 使用 reduceOrNull() 函数计算总价格
    val totalPrice = itemPrices.reduceOrNull { runningTotal, price -> runningTotal + price }
    println("Total price of items in the cart: ${totalPrice ?: "No items"}")
    // 输出结果为: Total price of items in the cart: 120

    val emptyCart = listOf<Int>()
    val emptyTotalPrice = emptyCart.reduceOrNull { runningTotal, price -> runningTotal + price }
    println("Total price of items in the empty cart: ${emptyTotalPrice ?: "No items"}")
    // 输出结果为: Total price of items in the empty cart: No items
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-reduceornull"}

这个示例中, 如果函数返回 `null` 值, 也使用 Elvis 操作符 `?:` 返回打印输出语句.

> `reduceOrNull()` 函数只能用于 **不** 包含 `null` 值的集合.
>
{style="note"}

请参见 Kotlin 的 [标准库](https://kotlinlang.org/api/core/kotlin-stdlib/), 其中还有很多函数, 你可以使用它们来提高代码安全性.

## 提前返回(Early Return) 与 Elvis 操作符 {id="early-returns-and-the-elvis-operator"}

在初学者教程中, 你已经学习了如何使用 [提前返回(Early Return)](kotlin-tour-functions.md#early-returns-in-functions), 让你的函数在某个阶段之后停止进一步的处理.
你可以使用 Elvis 操作符 `?:` 和提前返回, 在函数中检查先决条件.
使用这种方式, 能够很好的保持代码简洁, 因为你不需要使用嵌套的检查.
代码复杂度降低也让它更加易于维护. 例如:

```kotlin
data class User(
    val id: Int,
    val name: String,
    // 朋友 user 的 ID List
    val friends: List<Int>
)

// 得到一个用户的朋友数量的函数
fun getNumberOfFriends(users: Map<Int, User>, userId: Int): Int {
    // 获取用户, 如果没有找到, 返回 -1
    val user = users[userId] ?: return -1
    // 返回朋友数量
    return user.friends.size
}

fun main() {
    // 创建一些示例用户
    val user1 = User(1, "Alice", listOf(2, 3))
    val user2 = User(2, "Bob", listOf(1))
    val user3 = User(3, "Charlie", listOf(1))

    // 创建用户 Map
    val users = mapOf(1 to user1, 2 to user2, 3 to user3)

    println(getNumberOfFriends(users, 1))
    // 输出结果为: 2
    println(getNumberOfFriends(users, 2))
    // 输出结果为: 1
    println(getNumberOfFriends(users, 4))
    // 输出结果为: -1
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-early-return"}

在这个示例中:

* 有一个 `User` 数据类, 属性表示用户的 `id`, `name`, 以及朋友列表.
* `getNumberOfFriends()` 函数:
  * 它的参数是一个 `User` 实例的 Map, 以及一个整数类型的用户 ID.
  * 使用给定的 用户 ID, 找到  `User` 实例 Map 的值.
  * 如果 Map 值是 `null` 值, 使用 Elvis 操作符提前返回, 返回值为 `-1`.
  * 将从 Map 找到的值, 赋值给 `user` 变量.
  * 使用 `size` 属性, 返回用户的朋友列表中的朋友数量.
* `main()` 函数:
  * 创建 3 个 `User` 实例.
  * 创建这些 `User` 实例的 Map, 并赋值给 `users` 变量.
  * 对 `users` 变量, 使用值 `1` 和 `2` 调用 `getNumberOfFriends()` 函数, 对 `"Alice"` 返回 2 个朋友, 对 `"Bob"` 返回 1 个朋友.
  * 对 `users` 变量, 使用值 `4` 调用 `getNumberOfFriends()` 函数, 会发生提前返回, 返回值为 `-1`.

你可能会注意到, 如果没有提前返回, 代码可以更加简洁.
但是, 这种方法需要很多次安全调用, 因为 `users[userId]` 可能返回 `null` 值, 造成代码变得有点难以阅读:

```kotlin
fun getNumberOfFriends(users: Map<Int, User>, userId: Int): Int {
    // 获取用户, 如果没有找到, 返回 -1
    return users[userId]?.friends?.size ?: -1
}
```
{validate="false"}

这个示例中, 尽管只使用 Elvis 操作符检查了一个条件, 但你可以添加多个检查来覆盖任何重要的错误路径.
使用 Elvis 操作符提前返回能够防止你的程序执行不必要的工作,
并在检测到 `null` 值或不正确的情况时立即停止执行, 让代码更加安全.

关于如何在代码中使用 `return`, 详情请参见 [返回与跳转](returns.md).

## 实际练习 {id="practice"}

### 习题 1 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-1"}

你在为一个 App 开发通知系统, 使用者能够启用或禁用不同类型的通知.
请完成 `getNotificationPreferences()` 函数, 目标是:

1. `validUser` 变量使用 `as?` 操作符, 检查 `user` 是不是 `User` 类的实例. 如果不是, 返回空的 List.
2. `userName` 变量使用 Elvis `?:` 操作符, 当使用者为 `null` 时, 让名字的默认值为 `"Guest"`.
3. 最后的返回语句使用 `.takeIf()` 函数, 只对 EMail 和 SMS 启用的情况, 包含它们的通知选项.
4. `main()` 函数成功返回, 并打印输出期望的输出结果.

> [`takeIf()` 函数](scope-functions.md#takeif-and-takeunless) 只有在给定的条件为 true 时返回原来的值,
> 否则返回 `null`. 例如:
>
> ```kotlin
> fun main() {
>     // 使用者已经登录
>     val userIsLoggedIn = true
>     // 使用者有一个活跃的会话
>     val hasSession = true
> 
>     // 如果使用者已经登录, 并且有活跃的会话, 则允许访问 Dashboard
>     val canAccessDashboard = userIsLoggedIn.takeIf { hasSession }
> 
>     println(canAccessDashboard ?: "Access denied")
>     // 输出结果为: true
> }
> ```
>
{style = "tip"}

|--|--|

```kotlin
data class User(val name: String?)

fun getNotificationPreferences(user: Any, emailEnabled: Boolean, smsEnabled: Boolean): List<String> {
    val validUser = // 请在这里编写你的代码
    val userName = // 请在这里编写你的代码

    return listOfNotNull( /* 请在这里编写你的代码 */)
}

fun main() {
    val user1 = User("Alice")
    val user2 = User(null)
    val invalidUser = "NotAUser"

    println(getNotificationPreferences(user1, emailEnabled = true, smsEnabled = false))
    // 输出结果为: [Email Notifications enabled for Alice]
    println(getNotificationPreferences(user2, emailEnabled = false, smsEnabled = true))
    // 输出结果为: [SMS Notifications enabled for Guest]
    println(getNotificationPreferences(invalidUser, emailEnabled = true, smsEnabled = true))
    // 输出结果为: []
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-1"}

|--|--|

```kotlin
data class User(val name: String?)

fun getNotificationPreferences(user: Any, emailEnabled: Boolean, smsEnabled: Boolean): List<String> {
    val validUser = user as? User ?: return emptyList()
    val userName = validUser.name ?: "Guest"

    return listOfNotNull(
        "Email Notifications enabled for $userName".takeIf { emailEnabled },
        "SMS Notifications enabled for $userName".takeIf { smsEnabled }
    )
}

fun main() {
    val user1 = User("Alice")
    val user2 = User(null)
    val invalidUser = "NotAUser"

    println(getNotificationPreferences(user1, emailEnabled = true, smsEnabled = false))
    // 输出结果为: [Email Notifications enabled for Alice]
    println(getNotificationPreferences(user2, emailEnabled = false, smsEnabled = true))
    // 输出结果为: [SMS Notifications enabled for Guest]
    println(getNotificationPreferences(invalidUser, emailEnabled = true, smsEnabled = true))
    // 输出结果为: []
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-null-safety-solution-1"}

### 习题 2 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-2"}

你在开发一个基于订阅的流媒体服务, 使用者可以拥有多个订阅, 但 **一次只能有一个处于活跃状态**.
请完成 `getActiveSubscription()` 函数, 使用 `singleOrNull()` 函数,
指定的判断条件是, 如果存在多个活跃的订阅则返回 `null` 值:

|--|--|

```kotlin
data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? // 请在这里编写你的代码

fun main() {
    val userWithPremiumPlan = listOf(
        Subscription("Basic Plan", false),
        Subscription("Premium Plan", true)
    )

    val userWithConflictingPlans = listOf(
        Subscription("Basic Plan", true),
        Subscription("Premium Plan", true)
    )

    println(getActiveSubscription(userWithPremiumPlan))
    // 输出结果为: Subscription(name=Premium Plan, isActive=true)

    println(getActiveSubscription(userWithConflictingPlans))
    // 输出结果为: null
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-2"}

|--|--|

```kotlin
data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? {
    return subscriptions.singleOrNull { subscription -> subscription.isActive }
}

fun main() {
    val userWithPremiumPlan = listOf(
        Subscription("Basic Plan", false),
        Subscription("Premium Plan", true)
    )

    val userWithConflictingPlans = listOf(
        Subscription("Basic Plan", true),
        Subscription("Premium Plan", true)
    )

    println(getActiveSubscription(userWithPremiumPlan))
    // 输出结果为: Subscription(name=Premium Plan, isActive=true)

    println(getActiveSubscription(userWithConflictingPlans))
    // 输出结果为: null
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案 1" id="kotlin-tour-null-safety-solution-2-1"}

|--|--|

```kotlin
data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? =
    subscriptions.singleOrNull { it.isActive }

fun main() {
    val userWithPremiumPlan = listOf(
        Subscription("Basic Plan", false),
        Subscription("Premium Plan", true)
    )

    val userWithConflictingPlans = listOf(
        Subscription("Basic Plan", true),
        Subscription("Premium Plan", true)
    )

    println(getActiveSubscription(userWithPremiumPlan))
    // 输出结果为: Subscription(name=Premium Plan, isActive=true)

    println(getActiveSubscription(userWithConflictingPlans))
    // 输出结果为: null
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案 2" id="kotlin-tour-null-safety-solution-2-2"}

### 习题 3 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-3"}

你在开发一个社交媒体平台, 使用者有用户名称和帐号状态. 你想要看到目前活跃的用户名称列表.
请完成 `getActiveUsernames()` 函数, 让 [`mapNotNull()` 函数](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/map-not-null.html)
的判断条件在用户状态为活跃时返回用户名称, 否则返回 `null` 值:

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> {
    return users.mapNotNull { /* 请在这里编写你的代码 */ }
}

fun main() {
    val allUsers = listOf(
        User("alice123", true),
        User("bob_the_builder", false),
        User("charlie99", true)
    )

    println(getActiveUsernames(allUsers))
    // 输出结果为: [alice123, charlie99]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-3"}

|--|--|

> 和习题 1 一样, 检查用户是否活跃时, 可以使用 [`takeIf()` 函数](scope-functions.md#takeif-and-takeunless).
>
{ style = "tip" }

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> {
    return users.mapNotNull { user ->
        if (user.isActive) user.username else null
    }
}

fun main() {
    val allUsers = listOf(
        User("alice123", true),
        User("bob_the_builder", false),
        User("charlie99", true)
    )

    println(getActiveUsernames(allUsers))
    // 输出结果为: [alice123, charlie99]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案 1" id="kotlin-tour-null-safety-solution-3-1"}

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> = users.mapNotNull { user -> user.username.takeIf { user.isActive } }

fun main() {
    val allUsers = listOf(
        User("alice123", true),
        User("bob_the_builder", false),
        User("charlie99", true)
    )

    println(getActiveUsernames(allUsers))
    // 输出结果为: [alice123, charlie99]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案 2" id="kotlin-tour-null-safety-solution-3-2"}

### 习题 4 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-4"}

你正在为一个电子商务平台开发库存管理系统.
在处理一次销售之前, 你需要根据可用的库存数量检查要求的产品数量是否正确.

请完成 `validateStock()` 函数, 使用提前返回和 Elvis 操作符 (如果可能的话) 进行检查:

* `requested` 变量是否为 `null`.
* `available` 变量是否为 `null`.
* `requested` 变量是否为负值.
* `requested` 变量的值是否高于 `available` 变量.

对以上所有情况, 函数必须提前返回 `-1`.

|--|--|

```kotlin
fun validateStock(requested: Int?, available: Int?): Int {
    // 请在这里编写你的代码
}

fun main() {
    println(validateStock(5,10))
    // 输出结果为: 5
    println(validateStock(null,10))
    // 输出结果为: -1
    println(validateStock(-2,10))
    // 输出结果为: -1
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-4"}

|--|--|

```kotlin
fun validateStock(requested: Int?, available: Int?): Int {
    val validRequested = requested ?: return -1
    val validAvailable = available ?: return -1

    if (validRequested < 0) return -1
    if (validRequested > validAvailable) return -1

    return validRequested
}

fun main() {
    println(validateStock(5,10))
    // 输出结果为: 5
    println(validateStock(null,10))
    // 输出结果为: -1
    println(validateStock(-2,10))
    // 输出结果为: -1
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-null-safety-solution-4"}

## 下一步 {id="next-step"}

[中级教程: 库与 API](kotlin-tour-intermediate-libraries-and-apis.md)
