[//]: # (title: Kotlin 1.1 版中的新功能)

最终更新: %latestDocDate%

_发布日期: 2016/02/15_

## 目录

* [协程(coroutine)](#coroutines-experimental)
* [语言层的其他特性](#other-language-features)
* [标准库](#standard-library)
* [JVM 环境(JVM Backend)](#jvm-backend)
* [JavaScript 环境(JavaScript Backend)](#javascript-backend)

## JavaScript

从 Kotlin 1.1 开始, JavaScript 编译环境不再是实验性的功能了. 目前已支持 Kotlin 语言的所有功能,
而且有了很多新的工具, 可以实现与前端开发环境的集成. 关于这部分变化的详情, 请阅读[下文](#javascript-backend).

## 协程(coroutine) (实验性功能) {id="coroutines-experimental"}

Kotlin 1.1 中关键性的新特性就是 *协程(coroutine)*, 这个特性可以支持 `async`/`await`, `yield` 等等类似的编程模式. Kotlin 的设计特性是, 协程的运行由库来实现, 而不是语言的一部分, 因此你不会被局限到某个特定的编程模式, 或者某个特定的并发库.

一个协程实际上是一个轻量级的线程, 它可以被暂停, 然后在以后的某个时刻恢复运行.
协程的支持依赖于 _[挂起函数(suspending function)](coroutines-basics.md#extract-function-refactoring)_:
对函数的调用有可能导致一个协程挂起(suspend), 要启动一个新的协程我们通常使用匿名的挂起函数 (也就是. 挂起 lambda 表达式).

我们来看一看 `async`/`await` 函数, 它们实现在一个外部库中, [kotlinx.coroutines](https://github.com/kotlin/kotlinx.coroutines):

```kotlin
// 在后台线程池中执行代码
fun asyncOverlay() = async(CommonPool) {
    // 启动 2 个异步操作
    val original = asyncLoadImage("original")
    val overlay = asyncLoadImage("overlay")
    // 然后将这 2 个操作取得的图片进行叠加
    applyOverlay(original.await(), overlay.await())
}

// 在 UI 上下文(context)中启动新的协程
launch(UI) {
    // 等待异步的图片叠加操作完成
    val image = asyncOverlay().await()
    // 然后在 UI 中显示结果
    showImage(image)
}
```

在这个例子中, `async { ... }` 启动一个协程, 然后, 当我们调用 `await()` 时, 当协程等待的操作还在执行时, 协程的执行将被挂起, 然后, 当协程等待的操作执行完毕时, 协程将会恢复执行(可能会在一个不同的线程内).

`yield` 和 `yieldAll` 函数可以产生 *延迟生成的序列(lazily generated sequences)*, 标准库使用协程来支持这种功能.
在这类序列中, 当每个元素被取得之后， 产生序列元素的代码段会被暂停, 当请求下一个元素时, 代码的执行又会回复. 示例如下:

```kotlin
import kotlin.coroutines.experimental.*

fun main(args: Array<String>) {
  val seq = buildSequence {
    for (i in 1..5) {
        // 产生 i 的平方值
        yield(i * i)
    }
    // 产生一个整数值范围(Range)
    yieldAll(26..28)
  }

  // 打印值序列
  println(seq.toList())
}
```

你可以运行上面的代码, 并查看结果. 你可以修改代码, 然后再次运行, 看看结果如何!

关于这个功能的详情, 请参见 [参考文档](coroutines-overview.md)
以及 [教程](coroutines-and-channels.md).

注意, 协程目前还是 **实验性功能**, 也就是说, 1.1 正式发布后, Kotlin 开发组不保证这个特性的向后兼容性(backwards compatibility).

## 语言层的其他特性 {id="other-language-features"}

### 类型别名(Type alias)

类型别名(type alias)功能允许你为已经存在的数据类型定义一个不同的名称.
这个功能对于泛型类型非常有用, 比如集合, 对于函数类型也很有用.
下面是示例:

```kotlin
//sampleStart
typealias OscarWinners = Map<String, String>

fun countLaLaLand(oscarWinners: OscarWinners) =
        oscarWinners.count { it.value.contains("La La Land") }

// 注意类型名称 (初始名称 和 类型别名) 是可以互换的:
fun checkLaLaLandIsTheBestMovie(oscarWinners: Map<String, String>) =
        oscarWinners["Best picture"] == "La La Land"
//sampleEnd

fun oscarWinners(): OscarWinners {
    return mapOf(
            "Best song" to "City of Stars (La La Land)",
            "Best actress" to "Emma Stone (La La Land)",
            "Best picture" to "Moonlight" /* ... */)
}

fun main(args: Array<String>) {
    val oscarWinners = oscarWinners()

    val laLaLandAwards = countLaLaLand(oscarWinners)
    println("LaLaLandAwards = $laLaLandAwards (in our small example), but actually it's 6.")

    val laLaLandIsTheBestMovie = checkLaLaLandIsTheBestMovie(oscarWinners)
    println("LaLaLandIsTheBestMovie = $laLaLandIsTheBestMovie")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

关于这个功能的详情, 请参见 [类型别名相关文档](type-aliases.md) 以及 [KEEP 文档](https://github.com/Kotlin/KEEP/blob/master/proposals/type-aliases.md).

### 与对象实例绑定的可调用的引用

现在你可以使用 `::` 操作符来得到一个 [成员的引用](reflection.md#function-references), 指向一个具体的对象实例的方法或属性.
从前这样的功能只能通过 lambda 表达式来实现.
下面是示例:

```kotlin
//sampleStart
val numberRegex = "\\d+".toRegex()
val numbers = listOf("abc", "123", "456").filter(numberRegex::matches)
//sampleEnd

fun main(args: Array<String>) {
    println("Result is $numbers")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

关于这个功能的详情, 请参见 [参考文档](reflection.md) 以及 [KEEP 文档](https://github.com/Kotlin/KEEP/blob/master/proposals/bound-callable-references.md).

### 封闭类(sealed class)与数据类(data class)

Kotlin 1.1 中删除了 Kotlin 1.0 中对封闭类(sealed class)与数据类(data class)的一些限制.
过去, 封闭类的子类只能声明为封闭类的内嵌类(nested class), 现在这一限制已经删除, 你可以在同一个源代码文件的顶级(top level)位置定义顶级封闭类(top-level sealed class)的子类.
数据类现在可以继承自其它类.
这些功能可以用来更好、更清晰地定义表达式类的层次结构:

```kotlin
//sampleStart
sealed class Expr

data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()

fun eval(expr: Expr): Double = when (expr) {
    is Const -> expr.number
    is Sum -> eval(expr.e1) + eval(expr.e2)
    NotANumber -> Double.NaN
}
val e = eval(Sum(Const(1.0), Const(2.0)))
//sampleEnd

fun main(args: Array<String>) {
    println("e is $e") // 3.0
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

关于这个功能的详情, 请参见 [封闭类相关文档](sealed-classes.md),
或参见 [封闭类(sealed class)](https://github.com/Kotlin/KEEP/blob/master/proposals/sealed-class-inheritance.md)
以及 [数据类(data class)](https://github.com/Kotlin/KEEP/blob/master/proposals/data-class-inheritance.md) 的 KEEP 文档.

### 在 lambda 表达式中使用解构声明

现在你可以使用 [解构声明](destructuring-declarations.md) 语法, 将对象解构为多个值, 然后作为参数传递给 lambda 表达式.
示例代码如下:

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val map = mapOf(1 to "one", 2 to "two")
    // 以前的编码方式:
    println(map.mapValues { entry ->
      val (key, value) = entry
      "$key -> $value!"
    })
    // 现在的编码方式:
    println(map.mapValues { (key, value) -> "$key -> $value!" })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

关于这个功能的详情, 请参见 [解构声明相关文档](destructuring-declarations.md)
以及 [KEEP 文档](https://github.com/Kotlin/KEEP/blob/master/proposals/destructuring-in-parameters.md).

### 使用下划线代替未使用的参数

对于接受多个参数的 lambda 表达式, 你可以使用 `_` 来代替你不使用的参数:

```kotlin
fun main(args: Array<String>) {
    val map = mapOf(1 to "one", 2 to "two")

//sampleStart
    map.forEach { _, value -> println("$value!") }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

这个功能对于 [解构声明](destructuring-declarations.md) 同样有效:

```kotlin
data class Result(val value: Any, val status: String)

fun getResult() = Result(42, "ok").also { println("getResult() returns $it") }

fun main(args: Array<String>) {
//sampleStart
    val (_, status) = getResult()
//sampleEnd
    println("status is '$status'")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

关于这个功能的详情, 请参见 [KEEP 文档](https://github.com/Kotlin/KEEP/blob/master/proposals/underscore-for-unused-parameters.md).

### 在数字字面值中使用下划线

与 Java 8 一样, Kotlin 现在也允许在数字字面值中使用下划线, 将数字分隔为多个部分, 以便阅读:

```kotlin
//sampleStart
val oneMillion = 1_000_000
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
//sampleEnd

fun main(args: Array<String>) {
    println(oneMillion)
    println(hexBytes.toString(16))
    println(bytes.toString(2))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

关于这个功能的详情, 请参见 [KEEP 文档](https://github.com/Kotlin/KEEP/blob/master/proposals/underscores-in-numeric-literals.md).

### 更加简短的属性语法

如果一个属性的取值方法的函数体是一个表达式, 属性类型现在可以省略:

```kotlin
//sampleStart
    data class Person(val name: String, val age: Int) {
        val isAdult get() = age >= 20 // 属性类型自动推断为 'Boolean'
    }
//sampleEnd
fun main(args: Array<String>) {
    val akari = Person("Akari", 26)
    println("$akari.isAdult = ${akari.isAdult}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 内联的属性访问函数

如果属性不存在后端域变量(backing field), 那么你可以使用 `inline` 修饰符来标记属性的访问器方法.
这样的访问器方法将会以 [内联函数](inline-functions.md) 相同的方式来编译.

```kotlin
//sampleStart
public val <T> List<T>.lastIndex: Int
    inline get() = this.size - 1
//sampleEnd

fun main(args: Array<String>) {
    val list = listOf('a', 'b')
    // 取值方法将被内联
    println("Last index of $list is ${list.lastIndex}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你也可以将整个属性标记为 `inline` - 这时 `inline` 修饰符将被同时应用于取值方法和设值方法.

关于这个功能的详情, 请参见 [内联函数相关文档](inline-functions.md#inline-properties)
以及 [KEEP 文档](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-properties.md).

### 局部的委托属性

你现在可以对局部变量使用 [委托属性](delegated-properties.md) 语法.
这个功能可以用来定义一个延迟计算的局部变量:

```kotlin
import java.util.Random

fun needAnswer() = Random().nextBoolean()

fun main(args: Array<String>) {
//sampleStart
    val answer by lazy {
        println("Calculating the answer...")
        42
    }
    if (needAnswer()) {                     // 返回随机的布尔值
        println("The answer is $answer.")   // 答案将在这里计算
    }
    else {
        println("Sometimes no answer is the answer...")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

关于这个功能的详情, 请参见 [KEEP 文档](https://github.com/Kotlin/KEEP/blob/master/proposals/local-delegated-properties.md).

### 委托属性绑定的拦截

对于 [委托属性](delegated-properties.md), 现在可以使用 `provideDelegate` 操作符来拦截委托到属性的绑定.
比如, 如果我们希望在绑定之前检查属性名称, 我们可以编写以下代码:

```kotlin
class ResourceLoader<T>(id: ResourceID<T>) {
    operator fun provideDelegate(thisRef: MyUI, prop: KProperty<*>): ReadOnlyProperty<MyUI, T> {
        checkProperty(thisRef, prop.name)
        ... // 属性创建
    }

    private fun checkProperty(thisRef: MyUI, name: String) { ... }
}

fun <T> bindResource(id: ResourceID<T>): ResourceLoader<T> { ... }

class MyUI {
    val image by bindResource(ResourceID.image_id)
    val text by bindResource(ResourceID.text_id)
}
```

在 `MyUI` 实例的创建过程中, 对每一个属性都会调用 `provideDelegate` 方法, 因此这个方法可以在此时进行必要的验证处理.

关于这个功能的详情, 请参见 [参考文档](delegated-properties.md).

### 枚举值访问的通用方式

现在可以使用泛型方式来列举一个枚举类(enum class)的所有值.

```kotlin
//sampleStart
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumValues<T>().joinToString { it.name })
}
//sampleEnd

fun main(args: Array<String>) {
    printAllValues<RGB>() // 打印结果为 RED, GREEN, BLUE
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 对 DSL 中的隐含接受者, 控制其范围

[`@DslMarker`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-dsl-marker/index.html) 注解
可以限制从 DSL 上下文的外部范围(outer scope)来访问接受者.
比如, 考虑一下我们经典的 [HTML 构建器的例子](type-safe-builders.md):

```kotlin
table {
    tr {
        td { + "Text" }
    }
}
```

在 Kotlin 1.0 中, 传递给 `td` 的那个 lambda 表达式中的代码, 可以访问 3 个隐含的接受者:
分别是 `table` 的接受者, `tr` 的接受者, 以及 `td` 的接受者.
这就导致你可以访问在当前上下文中毫无意义的方法 - 比如可以在 `td` 之内调用 `tr`, 因此可以在 `<td>` 之内再放置一个 `<tr>` 标记.

在 Kotlin 1.1 中, 你可以限制对这些接收者的访问, 因此, 在传递给 `td` 的那个 lambda 表达式中, 只有定义在 `td` 的隐含接收者中的方法才可以被调用.
要实现这一点, 你可以定义一个注解, 并用元注解(meta-annotation) `@DslMarker` 标注这个注解, 然后将你的注解标记到 HTML tag 类的基类上.

关于这个功能的详情, 请参见 [类型安全的构建器相关文档](type-safe-builders.md)
以及 [KEEP 文档](https://github.com/Kotlin/KEEP/blob/master/proposals/scope-control-for-implicit-receivers.md).

### rem 操作符

`mod` 操作符现在已被废弃, 改为使用 `rem` 操作符. 关于这个变更的原因, 请参见 [这个问题](https://youtrack.jetbrains.com/issue/KT-14650).

## 标准库 {id="standard-library"}

### 字符串到数值的转换

对于 String 类, 新增了许多扩展函数, 用来将字符串转换为数值, 并且对不正确的数值不会抛出异常:
`String.toIntOrNull(): Int?`, `String.toDoubleOrNull(): Double?` 等等.

```kotlin
val port = System.getenv("PORT")?.toIntOrNull() ?: 80
```

同样也增加了整数的转换函数, 比如 `Int.toString()`, `String.toInt()`, `String.toIntOrNull()`,
这些函数都有带 `radix` 参数的重载版本, 这个参数可用来指定转换时使用的底数(base)(允许使用的底数为 2 到 36 之间).

### onEach()

对于集合和序列来说, `onEach` 是一个小的, 但非常有用的扩展函数, 这个函数可以对集合或序列中的所有元素来执行相同的操作,
这个操作可能会带有副作用(side effect). 这个函数能够以操作链(chain of operation)的形式来使用.
对于 iterable, 这个函数类似 `forEach`, 但它最后会返回这个 iterable 实例.
对于 sequence, 这个函数会返回一个包装过的 sequence, 这个包装过的 sequence 会延迟地对每个元素执行你给定的操作.

```kotlin
inputDir.walk()
        .filter { it.isFile && it.name.endsWith(".txt") }
        .onEach { println("Moving $it to $outputDir") }
        .forEach { moveFile(it, File(outputDir, it.toRelativeString(inputDir))) }
```

### also(), takeIf() 和 takeUnless()

新增了3个多用途的扩展函数, 可以用于任意类型的接受者.

`also` 函数类似于 `apply`: 它得到一个接受者, 对它执行某种操作, 然后返回这个接受者.
区别在于, 在 `apply` 的代码段内部, 接受者可以通过 `this` 得到,
而在 `also` 的代码段内部, 接受者是 `it` (而且如果你愿意, 也可以指定其他名称).
如果你不希望其他范围内的 `this` 被屏蔽掉, 那么这个功能就很方便了:

```kotlin
class Block {
    lateinit var content: String
}

//sampleStart
fun Block.copy() = Block().also {
    it.content = this.content
}
//sampleEnd

// 改为使用 'apply'
fun Block.copy1() = Block().apply {
    this.content = this@copy1.content
}

fun main(args: Array<String>) {
    val block = Block().apply { content = "content" }
    val copy = block.copy()
    println("Testing the content was copied:")
    println(block.content == copy.content)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeIf` 函数类似于 `filter`, 但适用于单个值. 这个函数首先检查接受者是否符合某些条件, 如果满足条件则返回接受者, 否则返回 `null`.
将这个函数与 Elvis 操作符, 以及快速返回(early return)组合起来, 可以编写下面这样的代码:

```kotlin
val outDirFile = File(outputDir.path).takeIf { it.exists() } ?: return false
// 对于已经存在的 outDirFile 进行某些处理
```

```kotlin
fun main(args: Array<String>) {
    val input = "Kotlin"
    val keyword = "in"

//sampleStart
    val index = input.indexOf(keyword).takeIf { it >= 0 } ?: error("keyword not found")
    // 在 input 字符串中查找 keyword 子串, 如果找到, 对 keyword 在 input 内的 index 位置进行某些处理
//sampleEnd

    println("'$keyword' was found in '$input'")
    println(input)
    println(" ".repeat(index) + "^")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeUnless` 与 `takeIf` 类似, 但它使用相反的判断条件.
如果 _不_ 满足条件则返回接受者, 否则返回 `null`. 因此上面的示例可以使用 `takeUnless` 改写, 如下:

```kotlin
val index = input.indexOf(keyword).takeUnless { it < 0 } ?: error("keyword not found")
```

对于可执行的方法引用而不是 lambda 表达式, 这个函数也是非常便利的:

```kotlin
private fun testTakeUnless(string: String) {
//sampleStart
    val result = string.takeUnless(String::isEmpty)
//sampleEnd

    println("string = \"$string\"; result = \"$result\"")
}

fun main(args: Array<String>) {
    testTakeUnless("")
    testTakeUnless("abc")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### groupingBy()

这个 API 可以用来对一个集合按照某个 key 进行分组, 并同时合并所有的组. 比如, 可以用来计算一段文字中以各个字母开头的单词数量:

```kotlin
fun main(args: Array<String>) {
    val words = "one two three four five six seven eight nine ten".split(' ')
//sampleStart
    val frequencies = words.groupingBy { it.first() }.eachCount()
//sampleEnd
    println("Counting first letters: $frequencies.")

    // 另一种方式是使用 'groupBy' 和 'mapValues' 来创建一个中间 map,
    // 而 'groupingBy' 方式则是直接进行计数.
    val groupBy = words.groupBy { it.first() }.mapValues { (_, list) -> list.size }
    println("Comparing the result with using 'groupBy': ${groupBy == frequencies}.")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Map.toMap() 和 Map.toMutableMap()

这两个函数可以用来简化 Map 的复制处理:

```kotlin
class ImmutablePropertyBag(map: Map<String, Any>) {
    private val mapCopy = map.toMap()
}
```

### Map.minus(key)

`plus` 操作符提供了一个方法, 可以将键-值对(key-value pair)添加到一个只读的 map, 构造出一个新的 map,
但是没有简单的办法进行相反的操作: 为了从 map 中删除一个 key, 你必须使用不那么直观的办法,
比如使用 `Map.filter()` 或 `Map.filterKeys()`.
现在, `minus` 操作符解决了这个问题.
这个操作符有 4 个重载版本: 删除单个 key, 删除 key 的集合, 删除 key 的序列, 以及删除 key 的数组.

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val map = mapOf("key" to 42)
    val emptyMap = map - "key"
//sampleEnd

    println("map: $map")
    println("emptyMap: $emptyMap")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### minOf() 和 maxOf()

这些函数可用于在2个或3个给定的值中查找最小值和最大值, 查找对象必须是原始类型的数值, 或者是 `Comparable` 对象.
这些函数还有一个重载版本, 可以接受一个额外的 `Comparator` 实例作为参数,
如果你希望比较的对象值不是 `Comparable` 对象, 可以使用这个参数来指定如何比较.

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val list1 = listOf("a", "b")
    val list2 = listOf("x", "y", "z")
    val minSize = minOf(list1.size, list2.size)
    val longestList = maxOf(list1, list2, compareBy { it.size })
//sampleEnd

    println("minSize = $minSize")
    println("longestList = $longestList")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 类似数组风格的 List 创建函数

与 `Array` 的参见函数类似, 现在新增了用来创建 `List` 和 `MutableList` 实例的函数, 并且会通过调用 lambda 表达式来初始化列表中的元素:

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val squares = List(10) { index -> index * index }
    val mutable = MutableList(10) { 0 }
//sampleEnd

    println("squares: $squares")
    println("mutable: $mutable")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Map.getValue()

`Map` 的这个扩展函数会接受一个 key 作为参数, 如果这个 key 对应的值已经存在, 则返回这个值, 否则抛出一个异常, 表示没有找到这个 key.
如果 Map 在创建时使用了 `withDefault`, 那么对于未找到的 key, 这个函数将会返回默认值, 而不会抛出异常.

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val map = mapOf("key" to 42)
    // 返回不可为 null 的 Int 值 42
    val value: Int = map.getValue("key")

    val mapWithDefault = map.withDefault { k -> k.length }
    // 返回 4
    val value2 = mapWithDefault.getValue("key2")

    // map.getValue("anotherKey") // <- 这个调用将抛出 NoSuchElementException 异常
//sampleEnd

    println("value is $value")
    println("value2 is $value2")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 抽象的集合类

实现 Kotlin 集合类时, 可以使用这些抽象类作为基类.
为了实现只读集合, 可以使用的基类有 `AbstractCollection`, `AbstractList`, `AbstractSet` 以及 `AbstractMap`,
对于可变的集合, 可以使用的基类有 `AbstractMutableCollection`, `AbstractMutableList`, `AbstractMutableSet` 以及 `AbstractMutableMap`.
在 JVM 环境中, 这些可变集合的抽象类的大多数功能, 通过继承 JDK 的集合抽象类得到.

### 数组处理函数

标准库现在提供了一系列函数, 用于逐个元素的数组操作: 比较函数
(`contentEquals` 和 `contentDeepEquals`), hash code 计算函数 (`contentHashCode` 和 `contentDeepHashCode`),
以及字符串转换函数 (`contentToString` 和 `contentDeepToString`). 这些函数都支持 JVM (这时这些函数对应于 `java.util.Arrays` 中的各个函数), 也支持 JavaScript (由 Kotlin 提供实现).

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val array = arrayOf("a", "b", "c")
    println(array.toString())  // 这里会输出JVM 的实现: 数组类型名称, 加 hash code
    println(array.contentToString())  // 这里会输出格式化良好的数组内容列表
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## JVM 环境(JVM Backend) {id="jvm-backend"}

### 对 Java 8 字节码的支持 {id="java-8-bytecode-support"}

Kotlin 现在增加了编译选项, 可以编译产生 Java 8 字节码(使用命令行选项 `-jvm-target 1.8`, 或 Ant/Maven/Gradle 中的对应选项).
这个选项目前不会改变字节码的语义(具体来说, 接口内的默认方法以及 lambda 表达式的编译输出方式会与 Kotlin 1.0 中完全相同),
但我们将来计划对这个选项做更多的改进.

### 对 Java 8 标准库的支持 {id="java-8-standard-library-support"}

Kotlin 的标准库目前存在不同的版本, 分别支持 Java 7 和 8 中新增的 JDK API.
如果你需要使用新的 API, 请不要使用标准的 Maven artifact `kotlin-stdlib`, 改用 `kotlin-stdlib-jre7` 和 `kotlin-stdlib-jre8`.
这些 artifact 在 `kotlin-stdlib` 之上进行了微小的扩展, 而且会将 `kotlin-stdlib` 以传递依赖的方式引入到你的项目中.

### 字节码中的参数名称

Kotlin 现在支持在字节码中保存参数名称. 可以使用命令行参数 `-java-parameters` 打开这个功能.

### 常数内联(Constant inlining)

编译器现在可以将 `const val` 属性的值内联到这些属性被使用的地方.

### 可变的闭包变量(Mutable closure variable)

用于捕获 lambda 中的可变的闭包变量的封装类(box class) 不再拥有可变的域变量.
这个变化改进了性能, 但在某些罕见的使用场景下, 可能会导致新的竞争条件(race condition).
如果你受到这个问题的影响, 那么你在访问这些变量时, 需要自行实现同步控制.

### 对 javax.script 的支持

Kotlin 目前集成了 [javax.script API](https://docs.oracle.com/javase/8/docs/api/javax/script/package-summary.html) (JSR-223).
这个 API 可以在运行期执行代码片段:

```kotlin
val engine = ScriptEngineManager().getEngineByExtension("kts")!!
engine.eval("val x = 3")
println(engine.eval("x + 2"))  // 输出结果为: 5
```

[这里](https://github.com/JetBrains/kotlin/tree/master/libraries/examples/kotlin-jsr223-local-example) 是使用这个 API 的一个更详细的示例工程.

### kotlin.reflect.full

作为 [支持 Java 9 的准备工作](https://blog.jetbrains.com/kotlin/2017/01/kotlin-1-1-whats-coming-in-the-standard-library/),
`kotlin-reflect.jar` 库中的扩展函数和扩属性已被移动到 `kotlin.reflect.full` 包内.
旧包 (`kotlin.reflect`) 内的名称已被标记为废弃, 并且将在 Kotlin 1.2 中删除.
注意, 反射功能的核心接口(比如 `KClass`) 是 Kotlin 标准库的一部分, 而不是 `kotlin-reflect` 的一部分, 因此不受此次包移动的影响.

## JavaScript 环境(JavaScript Backend) {id="javascript-backend"}

### 统一的标准库

编译为 JavaScript 的 Kotlin 代码, 现在可以访问 Kotlin 标准库中更多的部分了.
具体来说, 许多关键性的类, 比如集合(`ArrayList`, `HashMap` 等等.),
异常(`IllegalArgumentException` 等等.) 以及其他一些类(`StringBuilder`, `Comparator`) 现在被定义在 `kotlin` 包之下.
在 JVM 环境中, 这些名称是指向对应的 JDK 类的类型别名, 在 JS 环境中, 这些类在 Kotlin 标准库中实现.

### 更好的代码生成能力

JavaScript 环境生成的代码现在更容易进行静态检查了, 因此对于 JS 的代码处理工具更加友好, 比如代码压缩器(minifier), 优化器(optimiser), 校验检查器(linter), 等等.

### `external` 修饰符

如果你需要在 Kotlin 中以类型安全的方式来访问一个 JavaScript 中实现的类, 你可以使用 `external` 修饰符编写一个 Kotlin 声明. (在 Kotlin 1.0 中, 使用的是 `@native` 注解.)
与 JVM 编译对象不同, JS 编译对象允许对类和属性使用 `external` 修饰符.
比如, 你可以这样声明 DOM 的 `Node` 类:

```kotlin
external class Node {
    val firstChild: Node

    fun appendChild(child: Node): Node

    fun removeChild(child: Node): Node

    // 等等
}
```

### import 处理的改进

现在你可以更加精确地指定需要从 JavaScript 模块中导入哪些声明.
如果你将 `@JsModule("<module-name>")` 注解添加到一个外部声明上, 那么在编译过程中它就会被正确地导入模块系统中(无论是 CommonJS 还是 AMD).
比如, 在 CommonJS 中, 这个声明将会通过 `require(...)` 函数导入.
此外, 如果你希望导入一个声明, 无论是作为一个模块还是作为一个全局 JavaScript 对象, 你都可以使用 `@JsNonModule` 注解.

比如, 你可以这样将 JQuery 导入到 Kotlin 模块中:

```kotlin
external interface JQuery {
    fun toggle(duration: Int = definedExternally): JQuery
    fun click(handler: (Event) -> Unit): JQuery
}

@JsModule("jquery")
@JsNonModule
@JsName("$")
external fun jquery(selector: String): JQuery
```

在这段示例代码中, JQuery 将会导入为一个模块, 模块名称是 `jquery`. 或者, 也可以作为一个 $-对象来使用, 具体如何, 取决于 Kotlin 编译器被设置为使用哪种模块系统.

在你的应用程序中, 你可以这样使用这些声明:

```kotlin
fun main(args: Array<String>) {
    jquery(".toggle-button").click {
        jquery(".toggle-panel").toggle(300)
    }
}
```
