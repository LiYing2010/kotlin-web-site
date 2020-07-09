---
type: doc
layout: reference
category: "Syntax"
title: "作用域函数(Scope Function)"
---

# 作用域函数(Scope Function)

Kotlin 标准库提供了一系列函数, 用来在某个指定的对象上下文中执行一段代码.
你可以对一个对象调用这些函数, 并提供一个 [Lambda 表达式](lambdas.html), 函数会创建一个临时的作用域(scope).
在这个作用域内, 你可以访问这个对象, 而不需要指定名称.
这样的函数称为 _作用域函数(Scope Function)_. 有 5 个这类函数: `let`, `run`, `with`, `apply`, 以及 `also`.

基本上, 这些函数所做的事情都是一样的: 在一个对象上执行一段代码.
它们之间的区别在于, 在代码段内如何访问这个对象, 以及整个表达式的最终结果值是什么.

下面是作用域函数的典型使用场景:

<div class="sample" markdown="1" theme="idea">

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

</div>

如果不使用 `let` 函数, 为了实现同样的功能, 你就不得不引入一个新的变量, 并在每次用到它的时候使用变量名来访问它.

<div class="sample" markdown="1" theme="idea">

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

</div>

作用域函数并没有引入技术上的新功能, 但它能让你的代码变得更简洁易读.

由于所有的作用域函数都很类似, 因此选择一个适合你需求的函数会稍微有点难度.
具体的选择取决于你的意图, 以及在你的项目内作用域函数的使用的一致性.
下面我们将会详细解释各个作用域函数之间的区别, 以及他们的使用惯例.

## 作用域函数之间的区别

由于所有的作用域函数都很类似, 因此理解它们之间的差别是很重要的. 它们之间主要存在两大差别:
* 访问上下文对象的方式
* 返回值.

### 访问上下文对象: 使用 `this` 或 使用 `it`

在作用域函数的 Lambda 表达式内部, 可以通过一个简短的引用来访问上下文对象, 而不需要使用它的变量名.
每个作用域函数都会使用两种方法之一来引用上下文对象:
作为 Lambda 表达式的 [接受者](lambdas.html#function-literals-with-receiver)(`this`)来访问,
或者作为 Lambda 表达式的参数(`it`)来访问.
两种方法的功能都是一样的, 因此我们分别介绍这两种方法在不同情况下的优点和缺点, 并提供一些使用建议.

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
    val str = "Hello"
    // 使用 this
    str.run {
        println("The receiver string length: $length")
        //println("The receiver string length: ${this.length}") // 这种写法的功能与上面一样
    }

    // 使用 it
    str.let {
        println("The receiver string's length is ${it.length}")
    }
}
```

</div>

#### 使用 `this`

`run`, `with`, 和 `apply` 函数将上下文函数作为 Lambda 表达式的接受者 - 通过 `this` 关键字来访问.
因此, 在这些函数的 Lambda 表达式内, 可以向通常的类函数一样访问到上下文对象.
大多数情况下, 访问接受者对象的成员时, 可以省略 `this` 关键字, 代码可以更简短.
另一方面, 如果省略了 `this`, 阅读代码时会很难区分哪些是接受者的成员, 哪些是外部对象和函数.
因此, 把上下文对象作为接受者(`this`)的方式, 建议用于那些主要对上下文对象成员进行操作的 Lambda 表达式: 调用上下文对象的函数, 或对其属性赋值.

<div class="sample" markdown="1" theme="idea">

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply {
        age = 20                       // 等价于 this.age = 20, 或者 adam.age = 20
        city = "London"
    }
    println(adam)
//sampleEnd
}
```

</div>

#### 使用 `it`

`let` 和 `also` 函数使用另一种方式, 它们将上下文对象作为 Lambda 表达式的参数.
如果参数名称不指定, 那么上下文对象使用隐含的默认参数名称 `it`.
`it` 比 `this` 更短, 而且带 `it` 的表达式通常也更容易阅读.
但是, 你就不能象省略 `this` 那样, 隐含地访问访问对象的函数和属性.
因此, 把上下文对象作为 `it` 的方式, 比较适合于对象主要被用作函数参数的情况.
如果你的代码段中存在多个变量, `it` 也是更好的选择.

<div class="sample" markdown="1" theme="idea">

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

</div>

另外, 如果把上下文对象作为参数传递, 你还可以在作用域内为它指定一个自定义的名称.

<div class="sample" markdown="1" theme="idea">

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
//sampleEnd
}
```

</div>

### 返回值

各种作用域函数的区别还包括它们的返回值:
* `apply` 和 `also` 函数返回作用域对象.
* `let`, `run`, 和 `with` 函数返回 Lambda 表达式的结果值.

这两种方式, 允许你根据你的代码下面需要做什么, 来选择适当的作用域函数.

#### 返回上下文对象

`apply` 和 `also` 的返回值是作用域对象本身.
因此它们可以作为 _旁路(side step)_ 成为链式调用的一部分: 你可以在这些函数之后对同一个对象继续调用其他函数.

<div class="sample" markdown="1" theme="idea">

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

</div>

还可以用在函数的 return 语句中, 将上下文对象作为函数的返回值.

<div class="sample" markdown="1" theme="idea">

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

</div>

#### 返回 Lambda 表达式的结果值

`let`, `run`, 和 `with` 函数返回 Lambda 表达式的结果值.
因此, 如果需要将 Lambda 表达式结果赋值给一个变量, 或者对 Lambda 表达式结果进行链式操作, 等等, 你可以使用这些函数.

<div class="sample" markdown="1" theme="idea">

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

</div>

此外, 你也可以忽略返回值, 只使用作用域函数来为变量创建一个临时的作用域.

<div class="sample" markdown="1" theme="idea">

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

</div>

## 函数

为了帮助你选择适当的作用域函数, 下面我们对各个函数进行详细介绍, 并提供一些使用建议.
技术上来讲, 很多情况下各个函数是可以互换的, 因此这里的示例只演示常见的使用风格.

### `let` 函数

**上下文对象** 通过参数 (`it`) 访问. **返回值** 是 Lambda 表达式的结果值.

`let` 函数可以用来在链式调用的结果值上调用一个或多个函数.
比如, 下面的代码对一个集合执行两次操作, 然后打印结果:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    val resultList = numbers.map { it.length }.filter { it > 3 }
    println(resultList)    
//sampleEnd
}
```

</div>

使用 `let` 函数, 这段代码可以改写为:

<div class="sample" markdown="1" theme="idea">

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

</div>

如果 Lambda 表达式的代码段只包含唯一的一个函数调用, 而且使用 `it` 作为这个函数的参数, 那么可以使用方法引用 (`::`) 来代替 Lambda 表达式:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)
//sampleEnd
}
```

</div>

`let` 经常用来对非 null 值执行一段代码.
如果要对可为 null 的对象进行操作, 请使用 null 值安全的调用操作符 `?.`, 然后再通过 `let` 函数, 在 Lambda 表达式内执行这段操作.

<div class="sample" markdown="1" theme="idea">

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

</div>

`let` 函数的另一个使用场景是, 在一个比较小的作用域内引入局部变量, 以便提高代码的可读性.
为了对上下文对象定义一个新的变量, 请将变量名作为 Lambda 表达式的参数, 然后就可以在 Lambda 表达式使用这个参数名, 而不是默认名称 `it`.

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val modifiedFirstItem = numbers.first().let { firstItem ->
        println("The first item of the list is '$firstItem'")
        if (firstItem.length >= 5) firstItem else "!" + firstItem + "!"
    }.toUpperCase()
    println("First item after modifications: '$modifiedFirstItem'")
//sampleEnd
}
```

</div>

### `with` 函数

这是一个非扩展函数: **上下文对象** 作为参数传递, 但在 Lambda 表达式内部, 它是一个接受者 (`this`). **返回值** 是 Lambda 表达式的结果值.

我们推荐使用 `with` 函数, 用来在上下文对象上调用函数, 而不返回 Lambda 表达式结果值.
在源代码中, `with` 可以被理解为 “_使用这个对象, 进行以下操作._”

<div class="sample" markdown="1" theme="idea">

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

</div>

`with` 函数的另一种使用场景是, 引入一个辅助对象, 使用它的属性或函数来计算得到一个结果值.

<div class="sample" markdown="1" theme="idea">

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

</div>

### `run` 函数

**上下文对象** 是接受者 (`this`). **返回值** 是 Lambda 表达式的结果值.

`run` 的功能与 `with` 一样, 但调用它的方式与 `let` 一样 - 作为上下文对象的扩展函数来调用.

如果你的 Lambda 表达式既包含对象的初始化处理, 也包含结果值的计算处理, 那么就很适合使用 `run` 函数.

<div class="sample" markdown="1" theme="idea">

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

</div>

除了对接受者对象调用 `run` 函数之外, 也可以把它作为非扩展函数来使用.
通过使用非扩展函数方式的 `run` 函数, 你可以在需要表达式的地方执行多条语句的代码段.

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val hexNumberRegex = run {
        val digits = "0-9"
        val hexDigits = "A-Fa-f"
        val sign = "+-"

        Regex("[$sign]?[$digits$hexDigits]+")
    }

    for (match in hexNumberRegex.findAll("+1234 -FFFF not-a-number")) {
        println(match.value)
    }
//sampleEnd
}
```

</div>

### `apply` 函数

**上下文对象** 是接受者(`this`). **返回值** 是对象本身.

如果代码段没有返回值, 并且主要操作接受者对象的成员, 那么适合使用 `apply` 函数.
`apply` 函数的常见使用场景是对象配置. 这样的代码调用可以理解为 “_将以下赋值操作应用于这个对象._”

<div class="sample" markdown="1" theme="idea">

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

</div>

由于返回值是接受者, 因此你可以很容易地将 `apply` 函数用作链式调用的一部分, 用来实现复杂的处理.

### `also` 函数

**上下文对象** 是 Lambda 表达式的参数 (`it`). **返回值** 是对象本身.

`also` 函数适合于执行一些将上下文对象作为参数的操作.
如果需要执行一些操作, 其中需要引用对象本身, 而不是它的属性或函数,
或者如果你不希望覆盖更外层作用域(scope)中的 `this` 引用, 那么就可以使用 `also` 函数.

如果在代码中看到 `also` 函数, 可以理解为 “_对这个对象还执行以下操作_”.

<div class="sample" markdown="1" theme="idea">

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

</div>

## 选择作用域函数

为了帮助你选择适合需要的作用域函数, 我们整理了这些函数之间关键区别的比较表格.

|函数|上下文对象的引用方式|返回值|是否扩展函数|
|---|---|---|---|
|`let`|`it`|Lambda 表达式的结果值|是|
|`run`|`this`|Lambda 表达式的结果值|是|
|`run`|-|Lambda 表达式的结果值|不是: 不使用上下文对象来调用|
|`with`|`this`|Lambda 表达式的结果值|不是: 上下文对象作为参数传递.|
|`apply`|`this`|上下文对象本身|是|
|`also`|`it`|上下文对象本身|是|

下面是根据你的需求来选择作用域函数的简短指南:

* 在非 null 对象上执行 Lambda 表达式: `let`
* 在一个局部作用域内引入变量: `let`
* 对一个对象的属性进行设置: `apply`
* 对一个对象的属性进行设置, 并计算结果值: `run`
* 在需要表达式的地方执行多条语句: 非扩展函数形式的 `run`
* 对一个对象进行一些附加处理: `also`
* 对一个对象进行一组函数调用: `with`

不同的函数的使用场景是有重叠的, 因此你可以根据你的项目或你的开发组所使用的编码规约来进行选择.

尽管作用域函数可以使得代码变得更简洁, 但也要注意不要过度使用: 可能会降低你的代码的可读性, 造成错误.
不要在作用域函数内部再嵌套作用域函数, 对作用域函数的链式调用要特别小心: 很容易导致开发者错误理解当前的上下文对象, 以及 `this` 或 `it` 的值.

## `takeIf` 函数和 `takeUnless` 函数

除作用域函数外, 标准库还提供了 `takeIf` 函数和 `takeUnless` 函数.
这些函数允许你在链式调用中加入对象的状态检查.

如果对一个对象调用 `takeIf` 函数, 并给定一个检查条件, 这个函数会在对象满足检查条件时返回这个对象, 否则返回 `null`.
因此, `takeIf` 函数可以作为单个对象的过滤函数.
类似的, `takeUnless` 函数会在对象不满足检查条件时返回这个对象, 满足条件时返回 `null`.
在 Lambda 表达式内部, 可以通过参数 (`it`) 访问到对象.

<div class="sample" markdown="1" theme="idea">

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

</div>

如果在 `takeIf` 函数和 `takeUnless` 函数之后链式调用其他函数,
别忘了进行 null 值检查, 或者使用 null 值安全的成员调用(`?.`), 因为它们的返回值是可以为 null 的.

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val str = "Hello"
    val caps = str.takeIf { it.isNotEmpty() }?.toUpperCase()
   //val caps = str.takeIf { it.isNotEmpty() }.toUpperCase() // 这里会出现编译错误
    println(caps)
//sampleEnd
}
```

</div>

`takeIf` 函数和 `takeUnless` 函数在与作用域函数组合使用时特别有用.
一个很好的例子就是, 将这些函数与 `let` 函数组合起来, 可以对满足某个条件的对象运行一段代码.
为了实现这个目的, 可以先对这个对象调用 `takeIf` 函数, 然后使用 null 值安全方式(`?.`)来调用 `let` 函数.
对于不满足检查条件的对象, `takeIf` 函数会返回 `null`, 然后 `let` 函数不会被调用.

<div class="sample" markdown="1" theme="idea">

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

</div>

如果没有这些标准库函数的帮助, 上面的代码会变成这样:

<div class="sample" markdown="1" theme="idea">

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

</div>
