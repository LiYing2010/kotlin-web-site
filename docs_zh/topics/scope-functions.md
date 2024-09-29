[//]: # (title: 作用域函数(Scope Function))

最终更新: %latestDocDate%

Kotlin 标准库提供了一系列函数, 用来在某个指定的对象上下文中执行一段代码.
你可以对一个对象调用这些函数, 并提供一个 [Lambda 表达式](lambdas.md), 函数会创建一个临时的作用域(scope).
在这个作用域内, 你可以访问这个对象, 而不需要指定名称.
这样的函数称为 _作用域函数(Scope Function)_.
有 5 个这类函数:
[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html),
[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html),
[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html),
[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html),
以及 [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html).

基本上, 这些函数都执行同样的操作: 在一个对象上执行一段代码.
它们之间的区别在于, 在代码段内如何访问这个对象, 以及整个表达式的最终结果值是什么.

下面是使用作用域函数的典型例子:

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {
//sampleStart
    Person("Alice", 20, "Amsterdam").let {
        println(it)
        it.moveTo("London")
        it.incrementAge()
        println(it)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果不使用 `let` 函数, 为了实现同样的功能, 你就不得不引入一个新的变量, 并在每次用到它的时候使用变量名来访问它.

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {
//sampleStart
    val alice = Person("Alice", 20, "Amsterdam")
    println(alice)
    alice.moveTo("London")
    alice.incrementAge()
    println(alice)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

作用域函数并没有引入技术上的新功能, 但它能让你的代码变得更简洁易读.

由于作用域函数都很类似, 因此选择一个适合你使用场景的函数会稍微有点难度.
具体的选择取决于你的意图, 以及在你的项目内作用域函数的使用的一致性.
下面我们详细解释各个作用域函数之间的区别, 以及他们的使用惯例.

## 选择作用域函数

为了帮助你选择适合需要的作用域函数, 我们整理了这张表, 总结这些函数之间的关键区别.

| 函数                                                                       | 上下文对象的引用方式 | 返回值    | 是否扩展函数              |
|---------------------------------------------------------------------------|--------|---------------------|--------------------------|
| [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)     | `it`   | Lambda 表达式的结果值 | 是                        |
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)     | `this` | Lambda 表达式的结果值 | 是                        |
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)     | -      | Lambda 表达式的结果值 | 不是: 不使用上下文对象来调用. |
| [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)   | `this` | Lambda 表达式的结果值 | 不是: 上下文对象作为参数传递. |
| [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) | `this` | 上下文对象本身        | 是                        |
| [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)   | `it`   | 上下文对象本身        | 是                        |

这些函数的详情会在本章的后续小节中专门介绍.

下面是根据你的需求来选择作用域函数的简短指南:

* 在非 null 对象上执行 Lambda 表达式: `let`
* 在一个局部作用域内引入变量: `let`
* 对一个对象的属性进行设置: `apply`
* 对一个对象的属性进行设置, 并计算结果值: `run`
* 在需要表达式的地方执行多条语句: 非扩展函数形式的 `run`
* 对一个对象进行一些附加处理: `also`
* 对一个对象进行一组函数调用: `with`

不同的作用域函数的使用场景存在重叠, 因此你可以根据你的项目或你的开发组所使用的编码规约来进行选择.

尽管作用域函数可以使得你的代码变得更简洁, 但也要注意不要过度使用:
可能会是你的代码难以阅读, 造成错误.
我们也建议不要嵌套使用作用域函数, 对作用域函数的链式调用要特别小心,
因为很容易导致开发者错误理解当前的上下文对象, 以及 `this` 或 `it` 的值.

## 作用域函数之间的区别

由于作用域函数很类似, 因此理解它们之间的差别是很重要的.
它们之间主要存在两大差别:
* 它们访问上下文对象的方式.
* 它们的返回值.

### 访问上下文对象: 使用 this 或 使用 it

在传递给作用域函数的 Lambda 表达式内部, 可以通过一个简短的引用来访问上下文对象, 而不需要使用它的变量名.
每个作用域函数都会使用两种方法之一来引用上下文对象:
作为 Lambda 表达式的 [接受者](lambdas.md#function-literals-with-receiver)(`this`)来访问,
或者作为 Lambda 表达式的参数(`it`)来访问.
两种方法的功能都是一样的, 因此我们分别介绍这两种方法在不同使用场景下的优点和缺点, 并提供一些使用建议.

```kotlin
fun main() {
    val str = "Hello"
    // 使用 this
    str.run {
        println("The string's length: $length")
        //println("The string's length: ${this.length}") // 这种写法的功能与上面一样
    }

    // 使用 it
    str.let {
        println("The string's length is ${it.length}")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### 使用 `this`

`run`, `with`, 和 `apply` 函数将上下文对象作为 Lambda 表达式的
[接受者](lambdas.md#function-literals-with-receiver) - 通过 `this` 关键字来访问.
因此, 在这些函数的 Lambda 表达式内, 可以象通常的类函数一样访问到上下文对象.

大多数情况下, 访问接受者对象的成员时, 可以省略 `this` 关键字, 代码可以更简短.
另一方面, 如果省略了 `this`, 阅读代码时会很难区分哪些是接受者的成员, 哪些是外部对象和函数.
因此, 把上下文对象作为接受者(`this`)的方式,
建议用于那些主要对上下文对象成员进行操作的 Lambda 表达式: 调用上下文对象的函数, 或对其属性赋值.

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply {
        age = 20                       // 等价于 this.age = 20
        city = "London"
    }
    println(adam)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### 使用 `it`

`let` 和 `also` 函数使用另一种方式, 它们将上下文对象作为 Lambda 表达式的 [参数](lambdas.md#lambda-expression-syntax) 来访问.
如果参数名称不指定, 那么上下文对象使用隐含的默认参数名称 `it`.
`it` 比 `this` 更短, 而且带 `it` 的表达式通常也更容易阅读.

但是, 你就不能象省略 `this` 那样, 隐含地访问访问对象的函数和属性.
因此, 通过 `it` 访问上下文对象的方式, 比较适合于对象主要被用作函数参数的情况.
如果你的代码段中存在多个变量, `it` 也是更好的选择.

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }

    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

下面的示例通过有名称的 Lambda 参数 `value` 来访问上下文对象.

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also { value ->
            writeToLog("getRandomInt() generated value $value")
        }
    }

    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 返回值

作用域函数的区别还包括它们的返回值:
* `apply` 和 `also` 函数返回作用域对象.
* `let`, `run`, 和 `with` 函数返回 Lambda 表达式的结果值.

你需要根据你的代码之后需要做什么, 来仔细考虑需要什么样的返回值.
这可以帮助你选择最适当的作用域函数.

#### 返回上下文对象

`apply` 和 `also` 的返回值是作用域对象本身.
因此它们可以作为 _旁路(side step)_ 成为链式调用的一部分:
你可以在这些函数之后对同一个对象继续调用其他函数.

```kotlin
fun main() {
//sampleStart
    val numberList = mutableListOf<Double>()
    numberList.also { println("Populating the list") }
        .apply {
            add(2.71)
            add(3.14)
            add(1.0)
        }
        .also { println("Sorting the list") }
        .sort()
//sampleEnd
    println(numberList)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

还可以用在函数的 return 语句中, 将上下文对象作为函数的返回值.

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }

    val i = getRandomInt()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### 返回 Lambda 表达式的结果值

`let`, `run`, 和 `with` 函数返回 Lambda 表达式的结果值.
因此, 如果需要将 Lambda 表达式结果赋值给一个变量,
或者对 Lambda 表达式结果进行链式操作, 等等, 你可以使用这些函数.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val countEndsWithE = numbers.run {
        add("four")
        add("five")
        count { it.endsWith("e") }
    }
    println("There are $countEndsWithE elements that end with e.")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此外, 你也可以忽略返回值, 只使用作用域函数来为局部变量创建一个临时的作用域.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        val firstItem = first()
        val lastItem = last()
        println("First item: $firstItem, last item: $lastItem")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 函数

为了帮助你选择适当的作用域函数, 我们对各个函数进行详细介绍, 并提供一些使用建议.
技术上来讲, 很多情况下各个作用域函数是可以互换的, 因此这里的示例只演示常见的使用惯例.

### let 函数

- **上下文对象** 通过参数 (`it`) 访问.
- **返回值** 是 Lambda 表达式的结果值.

[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)
函数可以用来在链式调用的结果值上调用一个或多个函数.
比如, 下面的代码对一个集合执行两次操作, 然后打印结果:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    val resultList = numbers.map { it.length }.filter { it > 3 }
    println(resultList)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

使用 `let` 函数, 可以改写上面的示例, 使得不必将 List 操作的结果赋值给一个变量:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let {
        println(it)
        // 如果需要, 还可以调用更多函数
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果传递给 `let` 的 Lambda 表达式的代码段只包含唯一的一个函数调用, 而且使用 `it` 作为这个函数的参数,
那么可以使用方法引用 (`::`) 来代替 Lambda 表达式:

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let` 经常用来对非 null 值执行一段代码.
如果要对可为 null 的对象进行操作, 请使用 [null 值安全的调用操作符 `?.`](null-safety.md#safe-calls),
然后再通过 `let` 函数, 在 Lambda 表达式内执行这段操作.

```kotlin
fun processNonNullString(str: String) {}

fun main() {
//sampleStart
    val str: String? = "Hello"
    //processNonNullString(str)       // 编译错误: str 可能为 null
    val length = str?.let {
        println("let() called on $it")
        processNonNullString(it)      // OK: 在 '?.let { }' 之内可以保证 'it' 不为 null
        it.length
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你也可以使用 `let` 函数, 在一个比较小的作用域内引入局部变量, 让你的代码更加易读.
为了对上下文对象定义一个新的变量, 请将变量名作为 Lambda 表达式的参数,
然后就可以在 Lambda 表达式使用这个参数名, 而不是默认名称 `it`.

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val modifiedFirstItem = numbers.first().let { firstItem ->
        println("The first item of the list is '$firstItem'")
        if (firstItem.length >= 5) firstItem else "!" + firstItem + "!"
    }.uppercase()
    println("First item after modifications: '$modifiedFirstItem'")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### with 函数

- **上下文对象** 通过接受者 (`this`) 访问.
- **返回值** 是 Lambda 表达式的结果值.

由于 [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)
不是一个扩展函数: 上下文对象通过参数传递, 但在 Lambda 表达式内部, 可以作为接受者 (`this`) 访问.

我们推荐使用 `with` 函数的情况是, 你可以用它在上下文对象上调用函数, 但不需要使用返回值.
在代码中, `with` 可以被理解为 "_使用这个对象, 进行以下操作._"

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        println("'with' is called with argument $this")
        println("It contains $size elements")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你也可以使用 `with` 函数, 引入一个辅助对象, 使用它的属性或函数来计算得到一个结果值.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val firstAndLast = with(numbers) {
        "The first element is ${first()}," +
        " the last element is ${last()}"
    }
    println(firstAndLast)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### run 函数

- **上下文对象** 是接受者 (`this`).
- **返回值** 是 Lambda 表达式的结果值.

[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)
的功能与 `with` 一样, 但它作为扩展函数来实现.
因此和 `let` 一样, 你可以对上下文对象使用点号来调用它.

如果你的 Lambda 表达式既初始化对象, 也计算结果值, 那么就很适合使用 `run` 函数.

```kotlin
class MultiportService(var url: String, var port: Int) {
    fun prepareRequest(): String = "Default request"
    fun query(request: String): String = "Result for query '$request'"
}

fun main() {
//sampleStart
    val service = MultiportService("https://example.kotlinlang.org", 80)

    val result = service.run {
        port = 8080
        query(prepareRequest() + " to port $port")
    }

    // 使用 let() 函数的实现方法是:
    val letResult = service.let {
        it.port = 8080
        it.query(it.prepareRequest() + " to port ${it.port}")
    }
//sampleEnd
    println(result)
    println(letResult)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你也可以把 `run` 作为非扩展函数来使用.
非扩展函数版本的 `run` 函数没有上下文对象, 但它仍然返回 Lambda 表达式的结果.
通过使用非扩展函数方式的 `run` 函数, 你可以在需要表达式的地方执行多条语句的代码段.
在代码中, 非扩展函数方式的 `run` 函数可以看作是 "_执行这个代码段, 并计算结果_".

```kotlin
fun main() {
//sampleStart
    val hexNumberRegex = run {
        val digits = "0-9"
        val hexDigits = "A-Fa-f"
        val sign = "+-"

        Regex("[$sign]?[$digits$hexDigits]+")
    }

    for (match in hexNumberRegex.findAll("+123 -FFFF !%*& 88 XYZ")) {
        println(match.value)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### apply 函数

- **上下文对象** 是接受者(`this`).
- **返回值** 是对象本身.

由于
[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html)
会返回上下文对象本身, 因此我们推荐的使用场景是, 代码段没有返回值, 并且主要对接受者对象的成员进行操作.
`apply` 函数最常见的使用场景是对象配置.
这样的代码调用可以理解为 "_将以下赋值操作应用于这个对象._"

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply {
        age = 32
        city = "London"
    }
    println(adam)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`apply` 的另一种使用场景是, 将 `apply` 函数用作链式调用的一部分, 用来实现复杂的处理.

### also 函数

- **上下文对象** 是 Lambda 表达式的参数 (`it`).
- **返回值** 是对象本身.

[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)
函数适合于执行一些将上下文对象作为参数的操作.
如果需要执行一些操作, 其中需要引用对象本身, 而不是它的属性或函数,
或者如果你不希望覆盖更外层作用域(scope)中的 `this` 引用, 那么就可以使用 `also` 函数.

如果在代码中看到 `also` 函数, 可以理解为 "_对这个对象还执行以下操作_".

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    numbers
        .also { println("The list elements before adding new one: $it") }
        .add("four")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## takeIf 函数和 takeUnless 函数

除作用域函数外, 标准库还提供了
[`takeIf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-if.html) 函数和
[`takeUnless`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-unless.html) 函数.
这些函数允许你在链式调用中加入对象的状态检查.

如果对一个对象使用一个检查条件调用 `takeIf` 函数, 在对象满足检查条件时 `takeIf` 会返回这个对象, 否则返回 `null`.
因此, `takeIf` 函数可以作为单个对象的过滤函数.

`takeUnless` 的逻辑与 `takeIf` 相反.
如果对一个对象使用一个检查条件调用 `takeUnless` 函数, 在对象满足检查条件时 `takeUnless` 会返回 `null`, 否则返回这个对象.

使用 `takeIf` 或 `takeUnless` 时, 在 Lambda 表达式内部, 可以通过参数 (`it`) 访问到对象.

```kotlin
import kotlin.random.*

fun main() {
//sampleStart
    val number = Random.nextInt(100)

    val evenOrNull = number.takeIf { it % 2 == 0 }
    val oddOrNull = number.takeUnless { it % 2 == 0 }
    println("even: $evenOrNull, odd: $oddOrNull")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 如果在 `takeIf` 函数和 `takeUnless` 函数之后链式调用其他函数,
> 别忘了进行 null 值检查, 或者使用 null 值安全的成员调用(`?.`), 因为它们的返回值是可以为 null 的.
>
{style="tip"}

```kotlin
fun main() {
//sampleStart
    val str = "Hello"
    val caps = str.takeIf { it.isNotEmpty() }?.uppercase()
   //val caps = str.takeIf { it.isNotEmpty() }.uppercase() // 这里会出现编译错误
    println(caps)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeIf` 函数和 `takeUnless` 函数在与作用域函数组合使用时特别有用.
例如, 你可以将 `takeIf` 和 `takeUnless` 函数与 `let` 函数组合起来, 可以对满足某个条件的对象运行一段代码.
为了实现这个目的, 可以先对这个对象调用 `takeIf` 函数, 然后使用 null 值安全方式(`?.`)来调用 `let` 函数.
对于不满足检查条件的对象, `takeIf` 函数会返回 `null`, 然后 `let` 函数不会被调用.

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        input.indexOf(sub).takeIf { it >= 0 }?.let {
            println("The substring $sub is found in $input.")
            println("Its start position is $it.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果不使用 `takeIf` 和作用域函数, 同样的功能会写成下面这样, 你可以比较一下两种方式的差别:

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        val index = input.indexOf(sub)
        if (index >= 0) {
            println("The substring $sub is found in $input.")
            println("Its start position is $index.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
