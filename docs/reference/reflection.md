---
type: doc
layout: reference
category: "Syntax"
title: "反射"
---

# 反射

反射是语言与库中的一组功能, 可以在运行时刻获取程序本身的信息.
Kotlin 将函数和属性当作语言中的一等公民(first-class citizen), 而且, 通过反射获取它们的信息(也就是说, 在运行时刻得到一个函数或属性的名称和数据类型) 可以通过简单的函数式, 或交互式的编程方式实现.

> 在 Java 平台上, 使用反射功能所需要的运行时组件是作为一个单独的 JAR 文件发布的(`kotlin-reflect.jar`). 这是为了对那些不使用反射功能的应用程序, 减少其运行库的大小. 如果你需要使用反射, 请注意将这个 .jar 文件添加到你的项目的 classpath 中.
{:.note}

## 类引用(Class Reference)

最基本的反射功能就是获取一个 Kotlin 类的运行时引用. 要得到一个静态的已知的 Kotlin 类的引用, 可以使用 _类字面值(class literal)_ 语法:

``` kotlin
val c = MyClass::class
```

类引用是一个 [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html) 类型的值.

注意, Kotlin 的类引用不是一个 Java 的类引用. 要得到 Java 的类引用, 请使用 `KClass` 对象实例的 `.java` 属性.

## 与对象实例绑定的类引用语法 (从 Kotlin 1.1 开始支持)

`::class` 语法同样可以用于取得某个对象实例的类的引用:

``` kotlin
val widget: Widget = ...
assert(widget is GoodWidget) { "Bad widget: ${widget::class.qualifiedName}" }
```

在这个例子中, 尽管 widget 的类型为 `Widget`, 但你将会得到对象实例的确切的类的引用, 比如 `GoodWidget`, 或 `BadWidget`.

## 函数引用(Function Reference)

假设我们有一个有名称的函数, 声明如下:

``` kotlin
fun isOdd(x: Int) = x % 2 != 0
```

我们可以很容易地直接调用它(`isOdd(5)`), 但我们也可以将这个函数当作一个值来传递, 比如, 传给另一个函数作为参数.
为了实现这个功能, 我们使用 `::` 操作符:

``` kotlin
val numbers = listOf(1, 2, 3)
println(numbers.filter(::isOdd)) // 打印结果为: [1, 3]
```

这里的 `::isOdd` 是一个 `(Int) -> Boolean` 函数类型的值.

`::` 也可以用在重载函数上, 前提是必须能够推断出对应的函数参数类型.
比如:

``` kotlin
fun isOdd(x: Int) = x % 2 != 0
fun isOdd(s: String) = s == "brillig" || s == "slithy" || s == "tove"

val numbers = listOf(1, 2, 3)
println(numbers.filter(::isOdd)) // 指向 isOdd(x: Int) 函数
```

或者, 你也可以将方法引用保存到一个明确指定了类型的变量中, 通过这种方式来提供必要的函数参数类型信息:

``` kotlin
val predicate: (String) -> Boolean = ::isOdd   // 指向 isOdd(x: String) 函数
```

如果我们需要使用一个类的成员函数, 或者一个扩展函数, 就必须使用限定符.
比如, `String::toCharArray` 指向 `String` 上的一个扩展函数, 函数类型为: `String.() -> CharArray`.

### 示例: 函数组合

我们来看看下面的函数:

``` kotlin
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}
```

这个函数返回一个新的函数, 由它的两个参数代表的函数组合在一起构成: `compose(f, g) = f(g(*))`.
现在, 你可以使用可以执行的函数引用来调用这个函数:


``` kotlin
fun length(s: String) = s.length

val oddLength = compose(::isOdd, ::length)
val strings = listOf("a", "ab", "abc")

println(strings.filter(oddLength)) // 打印结果为: "[a, abc]"
```

## 属性引用(Property Reference)

在 Kotlin 中, 可以将属性作为一等对象来访问, 方法是使用 `::` 操作符:

``` kotlin
val x = 1

fun main(args: Array<String>) {
    println(::x.get()) // 打印结果为 "1"
    println(::x.name)  // 打印结果为 "x"
}
```

表达式 `::x` 的计算结果是一个属性对象, 类型为 `KProperty<Int>`, 通过它 `get()` 方法可以得到属性值, 通过它的 `name` 属性可以得到属性名称. 详情请参见 [`KProperty` 类的 API 文档](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html).

对于值可变的属性, 比如, `var y = 1`, `::y` 返回的属性对象的类型为 [`KMutableProperty<Int>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-mutable-property/index.html),
它有一个 `set()` 方法:

``` kotlin
var y = 1

fun main(args: Array<String>) {
    ::y.set(2)
    println(y) // 打印结果为 "2"
}
```

属性引用可以用在所有使用无参函数的地方:

``` kotlin
val strs = listOf("a", "bc", "def")
println(strs.map(String::length)) // 打印结果为: [1, 2, 3]
```

要访问类的成员属性, 我们需要使用限定符:

``` kotlin
class A(val p: Int)

fun main(args: Array<String>) {
    val prop = A::p
    println(prop.get(A(1))) // 打印结果为: "1"
}
```

对于扩展属性:


``` kotlin
val String.lastChar: Char
    get() = this[length - 1]

fun main(args: Array<String>) {
    println(String::lastChar.get("abc")) // 打印结果为: "c"
}
```

### 与 Java 反射功能的互操作性

在 Java 平台上, Kotlin 的标准库包含了针对反射类的扩展函数, 这些反射类提供了与 Java 反射对象的相互转换功能(参见包 `kotlin.reflect.jvm`).
比如, 要查找一个 Kotlin 属性的后端域变量, 或者查找充当这个属性取值函数的 Java 方法, 你可以编写下面这样的代码:


``` kotlin
import kotlin.reflect.jvm.*

class A(val p: Int)

fun main(args: Array<String>) {
    println(A::p.javaGetter) // 打印结果为: "public final int A.getP()"
    println(A::p.javaField)  // 打印结果为: "private final int A.p"
}
```

要查找与一个 Java 类相对应的 Kotlin 类, 可以使用 `.kotlin` 扩展属性:

``` kotlin
fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin
```

## 构造器引用(Constructor Reference)

与方法和属性一样, 也可以引用构造器. 构造器引用可以用于使用函数类型对象的地方, 但这个函数类型接受的参数应该与构造器相同, 返回值应该是构造器所属类的对象实例.
引用构造器使用 `::` 操作符, 再加上类名称.
我们来看看下面的函数, 它接受的参数是一个函数, 这个函数参数本身没有参数, 并返回 `Foo` 类型:

``` kotlin
class Foo

fun function(factory: () -> Foo) {
    val x: Foo = factory()
}
```

使用 `::Foo`, 也就是 Foo 类的无参构造器的引用, 我们可以很简单地调用上面的函数:

``` kotlin
function(::Foo)
```

## 与对象实例绑定的函数和属性引用 (从 Kotlin 1.1 开始支持)

你可以引用某个具体的对象实例的方法:

``` kotlin
val numberRegex = "\\d+".toRegex()
println(numberRegex.matches("29")) // 打印结果为 "true"

val isNumber = numberRegex::matches
println(isNumber("29")) // 打印结果为 "true"
```

我们将 `matches` 方法保存在一个指向它的引用变量内, 而不是直接调用这个方法.
这样的引用会与方法的接受者绑定在一起.
这样的引用可以直接调用(就像上面的示例程序中那样), 也可以用在任何使用函数类型表达式的地方:

``` kotlin
val strings = listOf("abc", "124", "a70")
println(strings.filter(numberRegex::matches)) // 打印结果为 "[124]"
```

我们来比较一下绑定到对象实例的引用, 以及未绑定到实例的引用.
绑定到对象实例的引用与它的接受者对象实例结合在一起, 因此接受者的类型不再是它的一个参数:

``` kotlin
val isNumber: (CharSequence) -> Boolean = numberRegex::matches

val matches: (Regex, CharSequence) -> Boolean = Regex::matches
```

同样, 属性的引用也可以与对象实例绑定:

``` kotlin
val prop = "abc"::length
println(prop.get())   // 打印结果为 "3"
```

从 Kotlin 1.2 开始, 不再需要明确地指定 `this` 接收者: `this::foo` 可以简写为 `::foo`.
