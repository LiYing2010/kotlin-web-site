[//]: # (title: 函数)

在 Kotlin 中声明函数的方法如下:
* 使用 `fun` 关键字.
* 在括号 `()` 中指定参数.
* 如果需要, 包含 [返回值类型](#return-types).

例如:

```kotlin
//sampleStart
// 'double' 是函数名
// 'x' 是 Int 类型的参数
// 预期的返回值类型也是 Int
fun double(x: Int): Int {
    return 2 * x
}
//sampleEnd

fun main() {
    println(double(5))
    // 输出结果为: 10
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="kotlin-function-double"}

## 函数的使用 {id="function-usage"}

调用函数使用标准的方式:

```kotlin
val result = double(2)
```

要调用 [成员函数](classes.md) 或 [扩展函数](extensions.md#extension-functions), 请使用点号 `.`:

```kotlin
// 创建 Stream 类的实例, 然后调用 read()
Stream().read()
```

### 参数 {id="parameters"}

函数参数的定义使用 Pascal 标记法: `name: Type`.
多个参数之间必须使用逗号分隔, 而且每个参数都必须明确指定类型:

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

在函数体内部, 接收到的参数是只读的(隐式声明为 `val`):

```kotlin
fun powerOf(number: Int, exponent: Int): Int {
    number = 2 // 错误: 'val' 不能被重新赋值.
}
```

声明函数参数时, 可以使用 [尾随逗号(trailing comma)](coding-conventions.md#trailing-commas):

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // 尾随逗号(trailing comma)
) { /*...*/ }
```

尾随逗号有助于重构和代码维护:
在声明中移动参数时, 不必担心哪个参数将成为最后一个.

> Kotlin 函数可以接收其他函数作为参数, 也可以作为参数传递.
> 详情请参见 [](lambdas.md).
>
{style="note"}

### 带有默认值的参数 {id="parameters-with-default-values"}

你可以为函数参数指定一个默认值, 使参数变为可选参数.
当你在调用函数时不提供对应的参数值时, Kotlin 会使用默认值.
带有默认值的参数也称为 _可选参数(optional parameters)_.

可选参数减少了对多个重载函数的需求, 因为你不必为了允许跳过一个有合理默认值的参数, 而声明不同版本的函数.

在参数声明后追加 `=` 来设置默认值:

```kotlin
fun read(
    b: ByteArray,
    // 'off' 的默认值是 0
    off: Int = 0,
    // 'len' 的默认值由 'b' 数组的大小计算得到
    len: Int = b.size,
) { /*...*/ }
```

如果 **有** 默认值的参数声明在 **没有** 默认值的参数 **之前**,
那么只能通过 [命名参数](#named-arguments) 来使用默认值:

```kotlin
fun greeting(
    userId: Int = 0,
    message: String,
) { /*...*/ }

fun main() {
    // 对 'userId' 使用默认值 0
    greeting(message = "Hello!")

    // 错误: 没有为参数 'userId' 传递值
    greeting("Hello!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="default-before-ordinary"}

[尾随 Lambda 表达式](lambdas.md#passing-trailing-lambdas) 是这个规则的例外情况,
因为最后一个参数必须对应传入的函数:

```kotlin
fun main () {
//sampleStart
    fun greeting(
        userId: Int = 0,
        message: () -> Unit,
    ) {
        println(userId)
        message()
    }

    // 对 'userId' 使用默认值
    greeting() { println ("Hello!") }
    // 输出结果为:
    // 0
    // Hello!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="default-before-trailing-lambda"}

[覆盖方法](inheritance.md#overriding-methods) 总是使用基类方法的默认参数值.
覆盖一个有默认参数值的方法时, 必须在签名中省略默认参数值:

```kotlin
open class Shape {
    open fun draw(width: Int = 10, height: Int = 5) { /*...*/ }
}

class Rectangle : Shape() {
    // 这里不允许指定默认值
    // 但这个函数对 'width' 默认使用 10, 对 'height' 默认使用 5.
    override fun draw(width: Int, height: Int) { /*...*/ }
}
```

#### 使用非常量表达式作为默认值 {id="non-constant-expressions-as-default-values"}

你可以为参数赋予一个非常量的默认值.
例如, 默认值可以是一个函数调用的结果, 或者使用其他参数值进行计算的结果,
就像这个示例中的 `len` 参数:

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

参数如果引用其他参数的值, 必须在声明顺序上位于后面.
在这个示例中, `len` 必须声明在 `b` 之后.

一般来说, 你可以将任意表达式赋值给参数的默认值.
但是, 只有在调用函数时 **没有** 传入对应参数, 需要赋予默认值的情况下, 默认值才会被计算.
例如, 以下函数只有在调用时没有传入 `print` 参数的情况下, 才会打印输出一行:

```kotlin
fun main() {
//sampleStart
    fun read(
        b: Int,
        print: Unit? = println("No argument passed for 'print'")
    ) { println(b) }

    // 先打印 "No argument passed for 'print'", 然后打印 "1"
    read(1)
    // 只打印 "1"
    read(1, null)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="non-constant-default"}

如果函数声明中的最后一个参数是函数类型,
你可以将对应的 [Lambda 表达式](lambdas.md#lambda-expression-syntax) 参数以命名参数的方式传递,
也可以 [在括号之外传递](lambdas.md#passing-trailing-lambdas):

```kotlin
fun main() {
    //sampleStart
    fun log(
        level: Int = 0,
        code:  Int = 1,
        action: () -> Unit,
    ) { println (level)
        println (code)
        action() }

    // 对 'level' 传入 1, 对 'code' 使用默认值 1
    log(1) { println("Connection established") }

    // 对 'level' 和 'code' 都使用默认值, 分别为 0 和 1
    log(action = { println("Connection established") })

    // 与前一次调用等价, 使用两个默认值
    log { println("Connection established") }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="lambda-outside-parentheses"}

### 命名参数 {id="named-arguments"}

调用函数时, 你可以指定一个或多个参数名.
当函数调用存在很多参数时, 这个功能会非常有用.
这种情况下, 很难将参数值与参数对应起来, 尤其是如果参数值是 `null` 或布尔值.

在函数调用中使用命名参数时, 可以按任意顺序列出这些参数.

比如, `reformat()` 函数有 4 个带有默认值的参数:

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

调用这个函数时, 你可以对部分参数进行命名:

```kotlin
reformat(
    "String!",
    normalizeCase = false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

可以省略所有那些带有默认值的参数:

```kotlin
reformat("This is a long String!")
```

也可以只省略带默认值的参数中 _某些_ 参数, 而不是省略全部.
但是, 在第一个省略的参数之后, 必须对后续的所有参数指定命名:

```kotlin
reformat(
    "This is a short String!",
    upperCaseFirstLetter = false,
    wordSeparator = '_'
)
```

你可以通过命名对应的参数, 传递 [不定数量参数](#variable-number-of-arguments-varargs) (`vararg`).
在这个示例中, 参数是一个数组:

```kotlin
fun mergeStrings(vararg strings: String) { /*...*/ }

mergeStrings(strings = arrayOf("a", "b", "c"))
```

<!-- Rationale for named arguments interaction with varargs is here https://youtrack.jetbrains.com/issue/KT-52505#focus=Comments-27-6147916.0-0 -->

> 在 JVM 平台调用 Java 函数时, 不能使用命名参数语法,
> 因为 Java 字节码并不一定保留了函数参数的名称信息.
>
{style="note"}

### 返回值类型 {id="return-types"}

当你声明一个带有代码块体(将指令放在大括号 `{}` 内) 的函数时, 必须始终明确指定返回值类型.
唯一例外是函数返回 `Unit` 的情况, [这时指定返回值类型是可选的](#unit-returning-functions).

Kotlin 不会推断代码块体函数的返回值类型.
这类函数的控制流可能比较复杂, 使得返回值类型对读者来说不够清晰, 有时甚至对编译器来说也是如此.
但是, 对于 [单表达式函数](#single-expression-functions), Kotlin 可以在你不指定的情况下推断返回值类型.

### 单表达式函数(Single-expression function) {id="single-expression-functions"}

当函数体只包含单个表达式时, 可以省略大括号, 在 `=` 之后直接指定函数体:

```kotlin
fun double(x: Int): Int = x * 2
```

大多数情况下不必明确声明 [返回值类型](#return-types):

```kotlin
// 编译器推断这个函数的返回值类型为 Int
fun double(x: Int) = x * 2
```

编译器在从单个表达式推断返回值类型时, 有时会遇到问题.
在这种情况下, 你应该明确添加返回值类型.
例如, 递归或互相递归的函数(互相调用对方)以及类似 `fun empty() = null` 这样没有类型的表达式函数, 总是需要返回值类型.

当你使用推断的返回值类型时, 请确保检查实际结果, 因为编译器推断的类型可能对你来说不够理想.
在上面的示例中, 如果你希望 `double()` 函数返回 `Number` 而不是 `Int`, 必须明确声明这一点.

### 返回值为 Unit 的函数 {id="unit-returning-functions"}

如果一个函数有代码块体(大括号 `{}` 内的指令), 而且不返回有意义的值, 编译器会假设其返回值类型是 `Unit`.
`Unit` 是一种只有一个值的类型, 这个值也叫做 `Unit`.

除了函数类型参数之外, 你不必指定 `Unit` 作为返回值类型.
你永远不必显式地 return `Unit`.

例如, 你可以声明一个 `printHello()` 函数, 不必返回 `Unit`:

```kotlin
// 函数类型参数('action')的声明仍然需要明确的返回值类型
fun printHello(name: String?, action: () -> Unit) {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")

    action()
}

fun main() {
    printHello("Kodee") {
        println("This runs after the greeting.")
    }
    // 输出结果为:
    // Hello Kodee
    // This runs after the greeting.

    printHello(null) {
        println("No name provided, but action still runs.")
    }
    // 输出结果为: No name provided, but action still runs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="return-unit-implicit"}

这段代码与下面这段冗长的声明是等价的:

```kotlin
//sampleStart
fun printHello(name: String?, action: () -> Unit): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")

    action()
    return Unit
}
//sampleEnd
fun main() {
    printHello("Kodee") {
        println("This runs after the greeting.")
    }
    // 输出结果为:
    // Hello Kodee
    // This runs after the greeting.

    printHello(null) {
        println("No name provided, but action still runs.")
    }
    // 输出结果为: No name provided, but action still runs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="return-unit-explicit"}

如果函数的返回值类型已明确指定, 你可以在表达式体中使用 `return` 语句:

```kotlin
fun getDisplayNameOrDefault(userId: String?): String =
    getDisplayName(userId ?: return "default")
```

### 不定数量参数(varargs) {id="variable-number-of-arguments-varargs"}

要向函数传递不定数量的参数, 你可以对其中一个参数(通常是最后一个)标记 `vararg` 修饰符.
在函数内部, 你可以将类型为 `T` 的 `vararg` 参数用作 `T` 类型的数组:

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts 是一个 Array
        result.add(t)
    return result
}
```

然后你就可以向函数传递不定数量的参数:

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts 是一个 Array
        result.add(t)
    return result
}

fun main() {
    //sampleStart
    val list = asList(1, 2, 3)
    println(list)
    // 输出结果为: [1, 2, 3]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="varargs-aslist"}

只有一个参数可以标记为 `vararg`.
如果你在参数列表末尾以外的位置声明了 `vararg` 参数, 则必须使用命名参数对之后的参数传值.
如果参数是函数类型, 也可以在括号之外放置 Lambda 表达式来传递值.

调用 `vararg` 函数时, 可以逐个传递参数, 就像 `asList(1, 2, 3)` 的例子.
如果你已有一个数组, 希望将其内容作为 `vararg` 参数, 或这个参数的一部分, 传递给函数,
请使用 [展开(spread)操作符](arrays.md#pass-variable-number-of-arguments-to-a-function) (在数组名前加 `*` 前缀):

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts)
        result.add(t)
    return result
}

fun main() {
    //sampleStart
    val a = arrayOf(1, 2, 3)

    // 函数接收的数组是 [-1, 0, 1, 2, 3, 4]
    list = asList(-1, 0, *a, 4)

    println(list)
    // 输出结果为: [-1, 0, 1, 2, 3, 4]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="varargs-aslist-with-array"}

如果要向 `vararg` 参数传递 [基本类型的数组](arrays.md#primitive-type-arrays),
你需要使用
[`.toTypedArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/to-typed-array.html) 函数,
将它转换为一个通常的(有类型的)数组:

```kotlin
// 'a' 是 IntArray, 它是基本类型的数组
val a = intArrayOf(1, 2, 3)
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### 中缀标记法(Infix notation) {id="infix-notation"}

你可以使用 `infix` 关键字声明函数, 使其可以不用括号或点号调用.
这有助于使代码中简单的函数调用更易于阅读.

```kotlin
infix fun Int.shl(x: Int): Int { /*...*/ }

// 使用通常的标记法调用函数
1.shl(2)

// 使用中缀标记法调用函数
1 shl 2
```

中缀函数需要满足以下条件:

* 必须是类的成员函数, 或者是 [扩展函数](extensions.md).
* 必须只有单个参数.
* 参数不能是 [不定数量参数](#variable-number-of-arguments-varargs) (`vararg`),
  而且不能有 [默认值](#parameters-with-default-values).

> 中缀函数调用的优先级, 低于算数运算符, 类型转换, 以及 `rangeTo` 运算符.
> 以下表达式是等价的:
> * `1 shl 2 + 3` 等价于 `1 shl (2 + 3)`
> * `0 until n * 2` 等价于 `0 until (n * 2)`
> * `xs union ys as Set<*>` 等价于 `xs union (ys as Set<*>)`
>
> 另一方面, 中缀函数调用的优先级, 高于布尔值运算符 `&&` 和 `||`, `is` 和 `in` 检查, 以及其他运算符. 以下表达式是等价的:
> * `a && b xor c` 等价于 `a && (b xor c)`
> * `a xor b in c` 等价于 `(a xor b) in c`
>
{style="note"}

注意, 中缀函数的接受者和参数都需要明确指定.
使用中缀标记法调用当前接受者的方法时, 请明确使用 `this`.
这确保了语法解析不会出现歧义.

```kotlin
class MyStringCollection {
    val items = mutableListOf<String>()

    infix fun add(s: String) {
        println("Adding: $s")
        items += s
    }

    fun build() {
        add("first")      // 正确: 普通函数调用
        this add "second" // 正确: 带有明确接受者的中缀调用
        // add "third"    // 编译错误: 需要明确指定接受者
    }

    fun printAll() = println("Items = $items")
}

fun main() {
    val myStrings = MyStringCollection()
    // 向列表添加 "first" 和 "second"
    myStrings.build()

    myStrings.printAll()
    // 输出结果为:
    // Adding: first
    // Adding: second
    // Items = [first, second]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="infix-notation-example"}

## 函数的范围 {id="function-scope"}

你可以在文件的顶层声明 Kotlin 函数, 这意味着不需要创建类来容纳函数.
函数也可以在局部范围内, 声明为 _成员函数_ 或 _扩展函数_.

### 局部函数 {id="local-functions"}

Kotlin 支持局部函数, 也就是在其他函数内部声明的函数.
例如, 以下代码为给定的图实现了深度优先搜索算法.
外层 `dfs()` 函数内部的局部函数 `dfs()` 用于隐藏实现细节, 并处理递归调用:

```kotlin
class Person(val name: String) {
    val friends = mutableListOf<Person>()
}
class SocialGraph(val people: List<Person>)
//sampleStart
fun dfs(graph: SocialGraph) {
    fun dfs(current: Person, visited: MutableSet<Person>) {
        if (!visited.add(current)) return
        println("Visited ${current.name}")
        for (friend in current.friends)
            dfs(friend, visited)
    }
    dfs(graph.people[0], HashSet())
}
//sampleEnd
fun main() {
    val alice = Person("Alice")
    val bob = Person("Bob")
    val charlie = Person("Charlie")
    alice.friends += bob
    bob.friends += charlie
    charlie.friends += alice
    val network = SocialGraph(listOf(alice, bob, charlie))
    dfs(network)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="local-functions-dfs"}

局部函数可以访问外层函数中的局部变量(闭包).
在上面的例子中, `visited` 函数参数可以作为一个局部变量:

```kotlin
class Person(val name: String) {
    val friends = mutableListOf<Person>()
}
class SocialGraph(val people: List<Person>)
//sampleStart
fun dfs(graph: SocialGraph) {
    val visited = HashSet<Person>()
    fun dfs(current: Person) {
        if (!visited.add(current)) return
        println("Visited ${current.name}")
        for (friend in current.friends)
            dfs(friend)
    }
    dfs(graph.people[0])
}
//sampleEnd
fun main() {
    val alice = Person("Alice")
    val bob = Person("Bob")
    val charlie = Person("Charlie")
    alice.friends += bob
    bob.friends += charlie
    charlie.friends += alice
    val network = SocialGraph(listOf(alice, bob, charlie))
    dfs(network)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="local-functions-dfs-with-local-variable"}

### 成员函数 {id="member-functions"}

成员函数是指定义在类或对象之内的函数:

```kotlin
class Sample {
    fun foo() { print("Foo") }
}
```

要调用成员函数, 请写出实例或对象名, 然后添加 `.` 并写出函数名:

```kotlin
// 创建 Stream 类的实例, 然后调用 read()
Stream().read()
```

关于类, 以及成员覆盖, 详情请参见 [类](classes.md) 和 [继承](classes.md#inheritance).

## 泛型函数 {id="generic-functions"}

可以在函数名称之前使用尖括号 `<>` 为函数指定泛型参数:

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

关于泛型函数, 详情请参见 [泛型](generics.md).

## 尾递归(Tail Recursive)函数 {id="tail-recursive-functions"}

Kotlin 支持一种称为 [尾递归(Tail Recursion)](https://en.wikipedia.org/wiki/Tail_call) 的函数式编程方式.
对于某些算法, 本来需要使用循环来实现, 你可以改用递归函数, 但同时不会存在栈溢出(stack overflow)的风险.
当一个函数标记为 `tailrec`, 并且满足某些形式上的要求, 编译器就会对代码进行优化, 消除函数的递归调用, 产生一段基于循环实现的, 快速而且高效的代码:

```kotlin
import kotlin.math.cos
import kotlin.math.abs

// 任意设定的"足够好"的精度
val eps = 1E-10

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (abs(x - cos(x)) < eps) x else findFixPoint(cos(x))
```

上面的代码计算余弦函数的不动点(一个数学上的常数).
函数从 `1.0` 开始不断重复地调用 `cos()`, 直到计算结果不再变化为止,
对于示例中给定的 `eps` 精度值, 计算结果将是 `0.7390851332151611`.
上面的代码等价于下面这种传统方式编写的代码:

```kotlin
import kotlin.math.cos
import kotlin.math.abs

// 任意设定的"足够好"的精度
val eps = 1E-10

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = cos(x)
        if (abs(x - y) < eps) return x
        x = cos(x)
    }
}
```

只有当函数在其最终操作中调用自身时, 才可以对其应用 `tailrec` 修饰符.
如果在递归调用之后还存在其他代码, 那么不能使用尾递归,
在 [`try`/`catch`/`finally` 代码块](exceptions.md#handle-exceptions-using-try-catch-blocks) 内,
或当函数是 [open](inheritance.md) 的情况下, 也不能使用尾递归.

**参见**:
* [内联函数(Inline Function)](inline-functions.md)
* [扩展函数](extensions.md)
* [高阶函数(Higher-Order Function) 与 Lambda 表达式](lambdas.md)
