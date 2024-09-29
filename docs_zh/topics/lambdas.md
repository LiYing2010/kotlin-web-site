[//]: # (title: 高阶函数与 Lambda 表达式)

最终更新: %latestDocDate%

在 Kotlin 中函数是 [一级公民](https://en.wikipedia.org/wiki/First-class_function),
也就是说, 函数可以保存在变量和数据结构中, 也可以作为参数来传递给 [高阶函数](#higher-order-functions),
也可以作为 [高阶函数](#higher-order-functions) 的返回值.
你可以就象对函数之外的其他数据类型值一样, 对函数执行任意的操作.

为了实现这些功能, Kotlin 作为一种静态类型语言, 使用了一组 [函数类型](#function-types) 来表达函数,
并提供了一组专门的语言结构, 比如 [lambda 表达式](#lambda-expressions-and-anonymous-functions).

## 高阶函数(Higher-Order Function) {id="higher-order-functions"}

高阶函数(higher-order function)是一种特殊的函数, 它接受函数作为参数, 或者返回一个函数.

高阶函数的一个很好的例子就是
[函数式编程(functional programming) 中对集合的 `折叠(fold)`](https://en.wikipedia.org/wiki/Fold_(higher-order_function)),
这个折叠函数的参数是一个初始的累计值, 以及一个结合函数,
然后将累计值与集合中的各个元素逐个结合, 最终得到结果值:

```kotlin
fun <T, R> Collection<T>.fold(
    initial: R,
    combine: (acc: R, nextElement: T) -> R
): R {
    var accumulator: R = initial
    for (element: T in this) {
        accumulator = combine(accumulator, element)
    }
    return accumulator
}
```

上面的示例代码中, `combine` 参数是 [函数类型](#function-types) `(R, T) -> R`,
所以这个参数接受一个函数, 函数又接受两个参数, 类型为 `R` 和 `T`, 返回值类型为 `R`.
这个函数在 `for` 循环内被 [调用](#invoking-a-function-type-instance),
函数的返回值被赋值给 `accumulator`.

要调用上面的 `fold` 函数, 你需要向它传递一个 [函数类型的实例](#instantiating-a-function-type) 作为参数,
在调用高阶函数时, 我们经常使用 Lambda 表达式作为这种参数
(详细介绍请参见 [后面的章节](#lambda-expressions-and-anonymous-functions)):

```kotlin
fun main() {
    //sampleStart
    val items = listOf(1, 2, 3, 4, 5)

    // Lambda 表达式是大括号括起的那部分代码.
    items.fold(0, {
        // 如果 Lambda 表达式有参数, 首先声明这些参数, 后面是 '->' 符
        acc: Int, i: Int ->
        print("acc = $acc, i = $i, ")
        val result = acc + i
        println("result = $result")
        // Lambda 表达式内的最后一个表达式会被看作返回值:
        result
    })

    // Lambda 表达式的参数类型如果可以推断得到, 那么参数类型的声明可以省略:
    val joinedToString = items.fold("Elements:", { acc, i -> acc + " " + i })

    // 在高阶函数调用中也可以使用函数引用:
    val product = items.fold(1, Int::times)
    //sampleEnd
    println("joinedToString = $joinedToString")
    println("product = $product")
}
```
{kotlin-runnable="true"}

## 函数类型(Function Type) {id="function-types"}

为了在类型和参数声明中处理函数, 比如: `val onClick: () -> Unit = ...` ,
Kotlin 使用函数类型(Function Type), 比如 `(Int) -> String` .

这种函数类型使用一种特殊的表示方法, 用于表示函数的签名部分 - 也就是表示函数的参数和返回值:

* 所有的函数类型都带有参数类型列表, 用括号括起, 以及返回值类型: `(A, B) -> C` 表示一个函数类型,
  它接受两个参数, 类型为 `A` 和 `B`, 返回值类型为 `C`.
  参数类型列表可以为空, 比如 `() -> A`. [`Unit` 类型的返回值](functions.md#unit-returning-functions) 不能省略.

* 函数类型也可以带一个额外的 *接受者* 类型, 以点号标记, 放在函数类型声明的前部:
  `A.(B) -> C` 表示一个可以对类型为 `A` 的接受者调用的函数, 参数类型为`B`, 返回值类型为 `C`.
  对这种函数类型, 我们经常使用 [带接受者的函数字面值](#function-literals-with-receiver).

* [挂起函数(Suspending function)](coroutines-basics.md#extract-function-refactoring) 是一种特殊类型的函数,
  它的声明带有一个特殊的 *suspend* 修饰符, 比如: `suspend () -> Unit`, 或者: `suspend A.(B) -> C`.

函数类型的声明也可以指定函数参数的名称: `(x: Int, y: Int) -> Point`.
参数名称可以用来更好地说明参数含义.

为了表示函数类型是 [可以为 null 的](null-safety.md#nullable-types-and-non-nullable-types), 可以使用括号:
`((Int, Int) -> Int)?`.

函数类型也可以使用括号组合在一起: `(Int) -> ((Int) -> Unit)`

> 箭头符号的结合顺序是右侧优先, `(Int) -> (Int) -> Unit` 的含义与上面的例子一样, 而不同于: `((Int) -> (Int)) -> Unit`.
>
{style="note"}

你也可以使用 [类型别名](type-aliases.md) 来给函数类型指定一个名称:

```kotlin
typealias ClickHandler = (Button, ClickEvent) -> Unit
```

### 创建函数类型的实例 {id="instantiating-a-function-type"}

有几种不同的方法可以创建函数类型的实例:

* 使用函数字面值, 采用以下形式之一:
    * [Lambda 表达式](#lambda-expressions-and-anonymous-functions): `{ a, b -> a + b }`,
    * [匿名函数(Anonymous Function)](#anonymous-functions): `fun(s: String): Int { return s.toIntOrNull() ?: 0 }`

  [带接受者的函数字面值](#function-literals-with-receiver) 可以用作带接受者的函数类型的实例.

* 使用已声明的元素的可调用的引用:
    * 顶级[函数](reflection.md#function-references), 局部[函数](reflection.md#function-references), 成员[函数](reflection.md#function-references), 或扩展[函数](reflection.md#function-references), 比如: `::isOdd`, `String::toInt`,
    * 顶级[属性](reflection.md#property-references), 成员[属性](reflection.md#property-references), 或扩展[属性](reflection.md#property-references), 比如: `List<Int>::size`,
    * [构造器](reflection.md#constructor-references), 比如: `::Regex`

  以上几种形式都包括 [绑定到实例的可调用的引用](reflection.md#bound-function-and-property-references), 也就是指向具体实例的成员的引用: `foo::toString`.

* 使用自定义类, 以接口的方式实现函数类型:

```kotlin
class IntTransformer: (Int) -> Int {
    override operator fun invoke(x: Int): Int = TODO()
}

val intFunction: (Int) -> Int = IntTransformer()
```

如果有足够的信息, 编译器可以推断出变量的函数类型:

```kotlin
val a = { i: Int -> i + 1 } // 编译器自动推断得到的类型为 (Int) -> Int
```

带接受者和不带接受者的函数类型的 *非字面* 值是可以互换的,
也就是说, 接受者可以代替第一个参数, 反过来第一个参数也可以代替接受者.
比如, 如果参数类型或变量类型为 `A.(B) -> C`, 那么可以使用 `(A, B) -> C` 函数类型的值,
反过来也是如此:

```kotlin
fun main() {
    //sampleStart
    val repeatFun: String.(Int) -> String = { times -> this.repeat(times) }
    val twoParameters: (String, Int) -> String = repeatFun // OK

    fun runTransformation(f: (String, Int) -> String): String {
        return f("hello", 3)
    }
    val result = runTransformation(repeatFun) // OK
    //sampleEnd
    println("result = $result")
}
```
{kotlin-runnable="true"}

> 注意, 自动推断的结果默认是不带接受者的函数类型, 即使给变量初始化赋值为一个扩展函数的引用, 也是如此.
> 要改变这种结果, 你需要明确指定变量类型.
>
{style="note"}

### 调用一个函数类型的实例 {id="invoking-a-function-type-instance"}

要调用一个函数类型的值, 可以使用它的 [`invoke(...)` 操作符](operator-overloading.md#invoke-operator):
`f.invoke(x)`, 或者直接写 `f(x)`.

如果函数类型值有接受者, 那么接受者对象实例应该作为第一个参数传递进去.
调用有接受者的函数类型值的另一种方式是, 将接受者写作函数调用的前缀,
就像调用 [扩展函数](extensions.md) 一样: `1.foo(2)`.

示例:

```kotlin
fun main() {
    //sampleStart
    val stringPlus: (String, String) -> String = String::plus
    val intPlus: Int.(Int) -> Int = Int::plus

    println(stringPlus.invoke("<-", "->"))
    println(stringPlus("Hello, ", "world!"))

    println(intPlus.invoke(1, 1))
    println(intPlus(1, 2))
    println(2.intPlus(3)) // 与扩展函数类似的调用方式
    //sampleEnd
}
```
{kotlin-runnable="true"}

### 内联函数(Inline Function)

有些时候, 使用 [内联函数](inline-functions.md) 可以为高阶函数实现更加灵活的控制流程.

## Lambda 表达式与匿名函数(Anonymous Function) {id="lambda-expressions-and-anonymous-functions"}

Lambda 表达式和匿名函数, 都是 *函数字面值(function literal)*,
函数字面值没有象普通函数那样声明, 而是立即作为表达式传递出去.
看看下面的示例:

```kotlin
max(strings, { a, b -> a.length < b.length })
```

函数 `max` 是一个高阶函数, 因为它接受一个函数值作为第二个参数.
第二个参数是一个表达式, 本身又是另一个函数, 称为函数字面值.
这个函数字面值等价于下面这个有名称的函数:

```kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

### Lambda 表达式的语法 {id="lambda-expression-syntax"}

Lambda 表达式的完整语法形式如下:

```kotlin
val sum: (Int, Int) -> Int = { x: Int, y: Int -> x + y }
```

* Lambda 表达式包含在大括号之内.
* 在完整语法形式中, 参数声明在大括号之内, 参数类型的声明是可选的.
* 函数体在 `->` 符号之后.
* 如果 Lambda 表达式自动推断的返回值类型不是 `Unit`,
那么 Lambda 表达式函数体中, 最后一条(或者就是唯一一条)表达式的值, 会被当作整个 Lambda 表达式的返回值.

如果把所有可选的内容都去掉, 那么剩余的部分如下:

```kotlin
val sum = { x: Int, y: Int -> x + y }
```

### 函数调用时使用尾缀 Lambda 表达式 {id="passing-trailing-lambdas"}

根据 Kotlin 的编码规约, 如果函数的最后一个参数是一个函数, 那么如果使用 Lambda 表达式作为这个参数的值,
可以将 Lambda 表达式写在函数调用的括号之外:

```kotlin
val product = items.fold(1) { acc, e -> acc * e }
```

这种语法又称为 *尾缀 Lambda 表达式(Trailing Lambda)*.

如果 Lambda 表达式是函数调用时的唯一一个参数, 括号可以完全省略:

```kotlin
run { println("...") }
```

### `it`: 单一参数的隐含名称 {id="it-implicit-name-of-a-single-parameter"}

很多情况下 Lambda 表达式只有唯一一个参数.

如果编译器能够识别出 Lambda 表达式没有参数定义, 那么可以不必声明参数, 并省略 `->` 符号.
这个参数会隐含地声明, 参数名为 `it`:

```kotlin
ints.filter { it > 0 } // 这个函数字面值的类型是 '(it: Int) -> Boolean'
```

### 从 Lambda 表达式中返回结果值 {id="returning-a-value-from-a-lambda-expression"}

如果使用 [带标签限定的 return](returns.md#return-to-labels) 语法, 你可以在 Lambda 表达式内明确地返回一个结果值.
否则, 会隐含地返回 Lambda 表达式内最后一条表达式的值.

因此, 下面两段代码是等价的:

```kotlin
ints.filter {
    val shouldFilter = it > 0
    shouldFilter
}

ints.filter {
    val shouldFilter = it > 0
    return@filter shouldFilter
}
```

使用这个规约, 再加上 [在括号之外传递 Lambda 表达式作为函数调用的参数](#passing-trailing-lambdas),
我们可以编写 [LINQ 风格](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/) 的程序:

```kotlin
strings.filter { it.length == 5 }.sortedBy { it }.map { it.uppercase() }
```

### 使用下划线代替未使用的参数 {id="underscore-for-unused-variables"}

如果 Lambda 表达式的某个参数未被使用, 你可以用下划线来代替参数名:

```kotlin
map.forEach { (_, value) -> println("$value!") }
```

### 在 Lambda 表达式中使用解构声明

关于在 Lambda 表达式中使用解构声明,
请参见 [解构声明(destructuring declaration)](destructuring-declarations.md#destructuring-in-lambdas).

### 匿名函数(Anonymous Function) {id="anonymous-functions"}

上面讲到的 Lambda 表达式语法, 还缺少了一种功能, 就是如何指定函数的返回值类型.
大多数情况下, 不需要指定返回值类型, 因为可以自动推断得到.
但是, 如果的确需要明确指定返回值类型, 你可以可以选择另一种语法: *匿名函数(anonymous function)*.

```kotlin
fun(x: Int, y: Int): Int = x + y
```

匿名函数看起来与通常的函数声明很类似, 区别在于省略了函数名.
函数体可以是一个表达式(如上例), 也可以是多条语句组成的代码段:

```kotlin
fun(x: Int, y: Int): Int {
    return x + y
}
```

参数和返回值类型的声明与通常的函数一样, 但如果参数类型可以通过上下文推断得到, 那么类型声明可以省略:

```kotlin
ints.filter(fun(item) = item > 0)
```

对于匿名函数, 返回值类型的自动推断方式与通常的函数一样:
如果函数体是一个表达式, 那么返回值类型可以自动推断得到,
但如果函数体是多条语句组成的代码段, 则返回值类型必须明确指定(否则被认为是 `Unit`).

> 匿名函数当作参数传递时, 一定要放在函数调用的圆括号内.
> 允许将函数类型参数写在圆括号之外的语法, 仅对 Lambda 表达式有效.
>
{style="note"}

Lambda 表达式与匿名函数之间的另一个区别是,
它们的 [非局部返回(non-local return)](inline-functions.md#non-local-returns) 的行为不同.
不使用标签的 `return` 语句总是从 `fun` 关键字定义的函数中返回.
也就是说, Lambda 表达式内的 `return` 将会从包含这个 Lambda 表达式的函数中返回,
而匿名函数内的 `return` 只会从匿名函数本身返回.

### 闭包(Closure)

Lambda 表达式, 匿名函数 (此外还有 [局部函数](functions.md#local-functions), [对象表达式](object-declarations.md#object-expressions)) 可以访问它的 _闭包_,
也就是, 定义在外层范围中的变量. 闭包中捕获的变量在 Lambda 表达式内是可以修改的:

```kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
    sum += it
}
print(sum)
```

### 带有接受者的函数字面值 {id="function-literals-with-receiver"}

带接受者的 [函数类型](#function-types), 比如 `A.(B) -> C`,
可以通过一种特殊形式的函数字面值来创建它的实例, 也就是带接受者的函数字面值.

上文讲到, Kotlin 提供了一种能力, 可以指定一个 *接收者对象(receiver object)*,
来 [调用带接受者的函数类型的实例](#invoking-a-function-type-instance).

在这个函数字面值的函数体内部, 传递给这个函数调用的接受者对象会成为一个 *隐含的* `this`,
因此你可以访问接收者对象的成员, 而不必指定任何限定符, 也可以使用 [`this` 表达式](this-expressions.md) 来访问接受者对象.

这种行为很类似于 [扩展函数](extensions.md), 在扩展函数的函数体中, 你也可以访问接收者对象的成员.

下面的例子演示一个带接受者的函数字面值, 以及这个函数字面值的类型,
在函数体内部, 调用了接受者对象的 `plus` 方法:

```kotlin
val sum: Int.(Int) -> Int = { other -> plus(other) }
```

匿名函数语法允许你直接指定函数字面值的接受者类型.
如果你需要声明一个带接受者的函数类型变量, 然后在将来的某个地方使用它, 那么这种功能就很有用.

```kotlin
val sum = fun Int.(other: Int): Int = this + other
```

如果接受者类型可以通过上下文自动推断得到, 那么 Lambda 表达式也可以用做带接受者的函数字面值.
这种用法的一个重要例子就是 [类型安全的构建器(Type-Safe Builder)](type-safe-builders.md):

```kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()  // 创建接受者对象
    html.init()        // 将接受者对象传递给 Lambda 表达式
    return html
}

html {       // 带接受者的 Lambda 表达式从这里开始
    body()   // 调用接受者对象上的一个方法
}
```
