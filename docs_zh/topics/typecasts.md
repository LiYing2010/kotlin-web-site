[//]: # (title: 类型检查与类型转换)

在 Kotlin 中, 你可以在运行时对类型进行两种操作: 检查对象是否为特定类型, 或将对象转换为另一种类型.
类型 **检查** 帮助你确认正在处理的对象的种类, 而类型 *转换** 则尝试将对象转换为另一种类型.

> 关于 **泛型** 的类型检查和转换, 例如 `List<T>`, `Map<K,V>`,
> 请参见 [泛型的类型检查和转换](generics.md#generics-type-checks-and-casts).
>
{style="tip"}

## 使用 `is` 与 `!is` 操作符进行类型检查 {id="is-and-is-operators"}

使用 `is` 操作符(或相反的 `!is` 操作符), 在运行时检查对象是否匹配某个类型:

```kotlin
fun main() {
    val input: Any = "Hello, Kotlin"

    if (input is String) {
        println("Message length: ${input.length}")
        // 输出结果为: Message length: 13
    }

    if (input !is String) { // 等价于 !(input is String)
        println("Input is not a valid message")
    } else {
        println("Processing message: ${input.length} characters")
        // 输出结果为: Processing message: 13 characters
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-is-operator"}

也可以使用 `is` 和 `!is` 操作符, 检查对象是否匹配某个子类型:

```kotlin
interface Animal {
    val name: String
    fun speak()
}

class Dog(override val name: String) : Animal {
    override fun speak() = println("$name says: Woof!")
}

class Cat(override val name: String) : Animal {
    override fun speak() = println("$name says: Meow!")
}
//sampleStart
fun handleAnimal(animal: Animal) {
    println("Handling animal: ${animal.name}")
    animal.speak()

    // 使用 is 操作符检查子类型
    if (animal is Dog) {
        println("Special care instructions: This is a dog.")
    } else if (animal is Cat) {
        println("Special care instructions: This is a cat.")
    }
}
//sampleEnd
fun main() {
    val pets: List<Animal> = listOf(
        Dog("Buddy"),
        Cat("Whiskers"),
        Dog("Rex")
    )

    for (pet in pets) {
        handleAnimal(pet)
        println("---")
    }
    // 输出结果为:
    // Handling animal: Buddy
    // Buddy says: Woof!
    // Special care instructions: This is a dog.
    // ---
    // Handling animal: Whiskers
    // Whiskers says: Meow!
    // Special care instructions: This is a cat.
    // ---
    // Handling animal: Rex
    // Rex says: Woof!
    // Special care instructions: This is a dog.
    // ---
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-is-operator-subtype"}

这个示例使用 `is` 操作符检查, `Animal` 类实例是否为子类型 `Dog` 或 `Cat`, 来打印相关的护理说明.

你可以检查一个对象是否是其声明类型的超类型, 但这其实没有意义, 因为答案永远为 true.
每个类实例本来就已经是其超类型的实例.

> 要在运行时识别对象的类型, 请参见 [反射(Reflection)](reflection.md).
>
{type="tip"}

## 类型转换 {id="type-casts"}

在 Kotlin 中, 将对象的类型转换为另一种类型, 这称为 **类型转换**.

在某些情况下, 编译器会自动为你进行类型转换. 这称为智能类型转换.

如果需要显式的转换类型, 请使用 `as?` 或 `as` [类型转换操作符](#unsafe-cast-operator).

## 智能类型转换 {id="smart-casts"}

对不可变值, 编译器会追踪它的类型检查和 [显式的类型转换](#unsafe-cast-operator),
然后自动插入隐式的(安全的)类型转换:

```kotlin
fun logMessage(data: Any) {
    // data 被自动转换为 String 类型
    if (data is String) {
        println("Received text: ${data.length} characters")
    }
}

fun main() {
    logMessage("Server started")
    // 输出结果为: Received text: 14 characters
    logMessage(404)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-smartcast"}

如果一个相反的类型检查导致了 return, 此时编译器足够智能, 能够判断出转换处理是安全的:

```kotlin
fun logMessage(data: Any) {
    // data 被自动转换为 String 类型
    if (data !is String) return

    println("Received text: ${data.length} characters")
}

fun main() {
    logMessage("User signed in")
    // 输出结果为: Received text: 14 characters
    logMessage(true)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-smartcast-negative"}

### 控制流 {id="control-flow"}

智能类型转换不仅能够用于 `if` 条件表达式, 还能用于 [`when` 表达式](control-flow.md#when-expressions-and-statements):

```kotlin
fun processInput(data: Any) {
    when (data) {
        // data 被自动转换为 Int 类型
        is Int -> println("Log: Assigned new ID ${data + 1}")
        // data 被自动转换为 String 类型
        is String -> println("Log: Received message \"$data\"")
        // data 被自动转换为 IntArray 类型
        is IntArray -> println("Log: Processed scores, total = ${data.sum()}")
    }
}

fun main() {
    processInput(1001)
    // 输出结果为: Log: Assigned new ID 1002
    processInput("System rebooted")
    // 输出结果为: Log: Received message "System rebooted"
    processInput(intArrayOf(10, 20, 30))
    // 输出结果为: Log: Processed scores, total = 60
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-smartcast-when"}

以及 [`while` 循环](control-flow.md#while-loops):

```kotlin
sealed interface Status
data class Ok(val currentRoom: String) : Status
data object Error : Status

class RobotVacuum(val rooms: List<String>) {
    var index = 0

    fun status(): Status =
        if (index < rooms.size) Ok(rooms[index])
        else Error

    fun clean(): Status {
        println("Finished cleaning ${rooms[index]}")
        index++
        return status()
    }
}

fun main() {
    //sampleStart
    val robo = RobotVacuum(listOf("Living Room", "Kitchen", "Hallway"))

    var status: Status = robo.status()
    while (status is Ok) {
        // 编译器将 status 智能类型转换为 OK 类型,
        // 因此可以访问 currentRoom 属性.
        println("Cleaning ${status.currentRoom}...")
        status = robo.clean()
    }
    // 输出结果为:
    // Cleaning Living Room...
    // Finished cleaning Living Room
    // Cleaning Kitchen...
    // Finished cleaning Kitchen
    // Cleaning Hallway...
    // Finished cleaning Hallway
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-typecasts-smartcast-while"}

在这个示例中, 封闭接口 `Status` 有两个实现: 数据类 `Ok` 和数据对象 `Error`.
只有数据类 `Ok` 才有 `currentRoom` 属性.
当 `while` 循环条件计算结果为 true 时, 编译器将 `status` 变量智能类型转换为 `Ok` 类型, 使得循环体内可以访问 `currentRoom` 属性.

如果你声明一个 `Boolean` 类型的变量, 然后在你的 `if`, `when`, 或 `while` 条件中使用它,
那么编译器收集的关于这个变量的所有信息, 在对应的代码块中都可以用于智能类型转换.

当你想要将布尔条件抽取到变量中时, 这个功能会很有用.
之后, 你可以给变量一个有意义的名字, 这样可以提高你的代码的可读性, 并可以在之后的代码中重用这个变量.
例如:

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}
//sampleStart
fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // 编译器能够得到关于 isCat 的信息,
        // 因此它知道 animal 已经被智能转换为 Cat 类型.
        // 所以, 可以调用 purr() 函数.
        animal.purr()
    }
}

fun main(){
    val kitty = Cat()
    petAnimal(kitty)
    // 输出结果为: Purr purr
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-local-variables" validate="false"}

### 逻辑操作符 {id="logical-operators"}

对于 `&&` 和 `||` 操作符, 如果在操作符左侧进行了(通常的或相反的)类型检查, 那么编译器能够在右侧进行智能类型转换:

```kotlin
// 在 `||` 的右侧, x 被自动转换为 String 类型
if (x !is String || x.length == 0) return

// 在 `&&` 的右侧, x 被自动转换为 String 类型
if (x is String && x.length > 0) {
    print(x.length) // x 被自动转换为 String 类型
}
```

如果你将对象的多个类型检查用 `or` 操作符 (`||`) 组合起来, 智能类型转换的结果会是这些类型最接近的共通超类型:

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus 被智能类型转换为共通超类型 Status
        signalStatus.signal()
    }
}
```

> 共通超类型是 [联合类型(Union Type)](https://en.wikipedia.org/wiki/Union_type) 的一种 **近似**.
> 联合类型 [在 Kotlin 中目前不支持](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types).
>
{style="note"}

### 内联函数 {id="inline-functions"}

对传递给 [内联函数](inline-functions.md) 的 Lambda 函数中捕获的变量, 编译器能够进行智能类型转换.

内联函数会被当作具有隐含的 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html)
契约(Contract).
这就意味着, 传递给内联函数的任何 Lambda 函数都会被原地调用(call in place).
由于 Lambda 函数被原地调用, 因此编译器知道 Lambda 函数不会泄露它的函数体中所包含的任何变量的引用.

编译器使用这些信息, 以及其它分析, 决定对捕获的变量能否安全的进行智能类型转换.
例如:

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // 编译器知道 processor 是一个局部变量, inlineAction() 是一个内联函数,
        // 因此对 processor 的引用不会泄露.
        // 所以, 对 processor 可以安全的进行智能类型转换.

        // 如果 processor 不为 null, processor 会被智能类型转换
        if (processor != null) {
            // 编译器知道 processor 不为 null, 因此不需要安全调用
            processor.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

### 异常处理 {id="exception-handling"}

智能类型转换信息会被传递给 `catch` 和 `finally` 代码块.
这能够让你的代码更加安全, 因为编译器会追踪你的对象是不是可为 null 的类型.
例如:

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput 被智能类型转换为 String 类型
    stringInput = ""
    try {
        // 编译器知道 stringInput 不为 null
        println(stringInput.length)
        // 输出结果为: 0

        // 编译器丢弃 stringInput 之前的智能类型转换信息.
        // 现在 stringInput 类型为 String?.
        stringInput = null

        // 触发异常
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // 编译器知道 stringInput 可以为 null
        // 因此 stringInput 继续保持可为 null 的类型.
        println(stringInput?.length)
        // 输出结果为: null
    }
}
//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-exception-handling"}

### 智能类型转换的前提条件 {id="smart-cast-prerequisites"}

只在编译器能够确保变量在检查和使用之间不会改变的情况下, 智能类型转换才有效.
在以下条件下可以使用智能类型转换:

<table style="none">
    <tr>
        <td>
            <code>val</code> 局部变量
        </td>
        <td>
            永远有效, 但 <a href="delegated-properties.md">局部的委托属性</a> 例外.
        </td>
    </tr>
    <tr>
        <td>
            <code>val</code> 属性
        </td>
        <td>
            如果属性是 <code>private</code> 的, 或 <code>internal</code> 的, 或者类型检查处理与属性定义出现在同一个
            <a href="visibility-modifiers.md#modules">模块(module)</a> 内, 那么智能类型转换是有效的.
            对于 <code>open</code> 属性, 或存在自定义 get 方法的属性, 智能类型转换是无效的.
        </td>
    </tr>
    <tr>
        <td>
           <code>var</code> 局部变量
        </td>
        <td>
            如果在类型检查语句与变量使用语句之间, 变量没有被改变, 而且它没有被 Lambda 表达式捕获并在 Lambda 表达式内修改它,
            并且它不是一个局部的委托属性, 那么智能类型转换是有效的.
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 属性
        </td>
        <td>
            永远无效, 因为其他代码随时可能改变变量值.
        </td>
    </tr>
</table>

## `as` 与 `as?` 类型转换操作符 {id="unsafe-cast-operator"}

Kotlin 有两个类型转换操作符: `as` 和 `as?`. 两者都可以用于类型转换, 但行为不同.

如果使用 `as` 操作符进行转换, 失败时会在运行期抛出 `ClassCastException`. 因此它也被称为 **不安全** 操作符.
你可以在转换为非 null 类型时使用 `as`:

```kotlin
fun main() {
    val rawInput: Any = "user-1234"

    // 成功转换为 String 类型
    val userId = rawInput as String
    println("Logging in user with ID: $userId")
    // 输出结果为: Logging in user with ID: user-1234

    // 触发 ClassCastException
    val wrongCast = rawInput as Int
    println("wrongCast contains: $wrongCast")
    // Exception in thread "main" java.lang.ClassCastException
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-unsafe-cast-operator" validate="false"}

如果改用 `as?` 操作符, 当转换失败时, 操作符会返回 `null`. 因此它也被称为 **安全** 操作符:

```kotlin
fun main() {
    val rawInput: Any = "user-1234"

    // 成功转换为 String 类型
    val userId = rawInput as? String
    println("Logging in user with ID: $userId")
    // 输出结果为: Logging in user with ID: user-1234

    // 将 null 值赋给 wrongCast
    val wrongCast = rawInput as? Int
    println("wrongCast contains: $wrongCast")
    // 输出结果为: wrongCast contains: null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-safe-cast-operator"}

要安全地转换可为 null 的类型, 请使用 `as?` 操作符, 以防止转换失败时触发 `ClassCastException`.

你 _可以_ 将 `as` 与可为 null 的类型一起使用. 这样的操作允许结果为 `null`, 但如果转换不成功, 仍然会抛出 `ClassCastException`.
因此, `as?` 是更安全的选择:

```kotlin
fun main() {
    val config: Map<String, Any?> = mapOf(
        "username" to "kodee",
        "alias" to null,
        "loginAttempts" to 3
    )

    // 不安全地转换为可为 null 的 String
    val username: String? = config["username"] as String?
    println("Username: $username")
    // 输出结果为: Username: kodee

    // 不安全地将 null 值转换为可为 null 的 String
    val alias: String? = config["alias"] as String?
    println("Alias: $alias")
    // 输出结果为: Alias: null

    // 转换为可为 null 的 String 失败, 抛出 ClassCastException
    // val unsafeAttempts: String? = config["loginAttempts"] as String?
    // println("Login attempts (unsafe): $unsafeAttempts")
    // Exception in thread "main" java.lang.ClassCastException

    // 转换为可为 null 的 String 失败, 返回 null
    val safeAttempts: String? = config["loginAttempts"] as? String
    println("Login attempts (safe): $safeAttempts")
    // 输出结果为: Login attempts (safe): null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-cast-nullable-types"}

### 向上转换和向下转换 {id="up-and-downcasting"}

在 Kotlin 中, 你可以将对象转换为超类型或子类型.

将对象转换为其超类实例的操作称为 **向上转换(upcasting)**. 向上转换不需要任何特殊的语法或转换操作符.
例如:

```kotlin
interface Animal {
    fun makeSound()
}

class Dog : Animal {
    // 实现 makeSound() 的行为
    override fun makeSound() {
        println("Dog says woof!")
    }
}

fun printAnimalInfo(animal: Animal) {
    animal.makeSound()
}

fun main() {
    val dog = Dog()
    // 将 Dog 实例向上转换为 Animal
    printAnimalInfo(dog)
    // 输出结果为: Dog says woof!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-upcast"}

在这个示例中, 当对 `Dog` 实例调用 `printAnimalInfo()` 函数时, 编译器将其向上转换为 `Animal`, 因为这是预期的参数类型.
由于实际对象仍然是 `Dog` 实例, 编译器动态地从 `Dog` 类中解析 `makeSound()` 函数,
打印 `"Dog says woof!"`.

在依赖抽象类型行为的 Kotlin API 中, 你经常会看到显式的向上转换.
在 Jetpack Compose 和 UI 工具包中也很常见, 这些工具包通常将所有 UI 元素视为超类型, 然后对特定子类进行操作:

```kotlin
    val textView = TextView(this)
    textView.text = "Hello, View!"

    // 从 TextView 向上转换为 View
    val view: View = textView

    // 使用 View 的函数
    view.setPadding(20, 20, 20, 20)
    // Activity 期望 View 类型
    setContentView(view)
```

将对象转换为其子类实例的操作称为 **向下转换(downcasting)**. 由于向下转换可能不安全, 你需要使用显式的转换操作符.
为了避免转换失败时抛出异常, 我们推荐使用安全转换操作符 `as?`, 当转换失败时返回 `null`:

```kotlin
interface Animal {
    fun makeSound()
}

class Dog : Animal {
    override fun makeSound() {
        println("Dog says woof!")
    }

    fun bark() {
        println("BARK!")
    }
}

fun main() {
    // 使用 Dog 实例创建 animal 变量, 类型为 Animal 
    val animal: Animal = Dog()

    // 将 animal 安全的向下转换为 Dog 类型
    val dog: Dog? = animal as? Dog

    // 使用安全调用, 当 dog 不为 null 时调用 bark()
    dog?.bark()
    // 输出结果为: "BARK!"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-downcast"}

在这个示例中, `animal` 被声明为 `Animal` 类型, 但它保存一个 `Dog` 实例.
代码将 `animal` 安全的转换为 `Dog` 类型, 并使用 [安全调用](null-safety.md#safe-call-operator) (`?.`) 来访问 `bark()` 函数.

在序列化处理中, 如果要将基类反序列化为特定的子类型, 会用到向下转换.
在使用 Java 库时, 如果返回类型为超类型的对象, 而你需要在 Kotlin 中转换为子类型, 那么也经常用到向下转换.
