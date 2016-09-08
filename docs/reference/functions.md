---
type: doc
layout: reference
category: "Syntax"
title: "函数"
---

# 函数

## 函数声明

Kotlin 中使用 *fun*{: .keyword } 关键字定义函数:

``` kotlin
fun double(x: Int): Int {
}
```

## 函数使用

函数的调用使用传统的方式:

``` kotlin
val result = double(2)
```


调用类的成员函数时, 使用点号标记法(dot notation):

``` kotlin
Sample().foo() // 创建一个 Sample 类的实例, 然后调用这个实例的 foo 函数
```

### 中缀标记法(Infix notation)

也可以使用中缀标记法(infix notation)来调用函数, 但需要满足以下条件:

* 是成员函数, 或者是[扩展函数](extensions.html)
* 只有单个参数
* 使用 `infix` 关键字标记

``` kotlin
// 为 Int 类型定义扩展函数
infix fun Int.shl(x: Int): Int {
...
}

// 使用中缀标记法调用扩展函数

1 shl 2

// 上面的语句等价于

1.shl(2)
```

### 参数

函数参数的定义使用 Pascal 标记法, 也就是, *name*: *type* 的格式. 多个参数之间使用逗号分隔. 每个参数都必须明确指定类型.

``` kotlin
fun powerOf(number: Int, exponent: Int) {
...
}
```

### 默认参数

函数参数可以指定默认值, 当参数省略时, 就会使用默认值. 与其他语言相比, 这种功能使得我们可以减少大量的 重载(overload)函数定义.

``` kotlin
fun read(b: Array<Byte>, off: Int = 0, len: Int = b.size()) {
...
}
```

参数默认值的定义方法是, 在参数类型之后, 添加 **=** 和默认值.

子类中覆盖的方法, 总是会使用与基类中方法相同的默认参数值.
如果要覆盖一个有默认参数值的方法, 那么必须在方法签名中省略默认参数值:

``` kotlin
open class A {
    open fun foo(i: Int = 10) { ... }
}

class B : A() {
    override fun foo(i: Int) { ... }  // 这里不允许指定默认参数值
}
```

### 命名参数

调用函数时, 可以通过参数名来指定参数. 当函数参数很多, 或者存在默认参数时, 指定参数名是一种非常便利的功能.

比如, 对于下面这个函数:

``` kotlin
fun reformat(str: String,
             normalizeCase: Boolean = true,
             upperCaseFirstLetter: Boolean = true,
             divideByCamelHumps: Boolean = false,
             wordSeparator: Char = ' ') {
...
}
```

我们可以使用默认参数来调用它:

``` kotlin
reformat(str)
```

但是, 如果需要使用非默认的参数值调用它, 那么代码会成为这样:

``` kotlin
reformat(str, true, true, false, '_')
```

如果使用命名参数, 我们的代码可读性可以变得更高:

``` kotlin
reformat(str,
    normalizeCase = true,
    upperCaseFirstLetter = true,
    divideByCamelHumps = false,
    wordSeparator = '_'
  )
```

而且, 如果我们不需要指定所有的参数, 那么可以这样:

``` kotlin
reformat(str, wordSeparator = '_')
```

注意, 调用 Java 函数时, 不能使用这种命名参数语法, 因为 Java 字节码并不一定保留了函数参数的名称信息.


### 返回值为 Unit 的函数

如果一个函数不返回任何有意义的结果值, 那么它的返回类型为 `Unit`. `Unit` 类型只有唯一的一个值 - `Unit`. 在函数中, 不需要明确地返回这个值:

``` kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello ${name}")
    else
        println("Hi there!")
    // 这里可以写 `return Unit` 或者 `return`, 都是可选的
}
```

返回类型 `Unit` 的声明本身也是可选的. 上例中的代码等价于:

``` kotlin
fun printHello(name: String?) {
    ...
}
```

### 单表达式函数(Single-Expression function)

如果一个函数返回单个表达式, 那么大括号可以省略, 函数体可以直接写在 **=** 之后:

``` kotlin
fun double(x: Int): Int = x * 2
```

如果编译器可以推断出函数的返回值类型, 那么返回值的类型定义是 [可选的](#explicit-return-types):

``` kotlin
fun double(x: Int) = x * 2
```

### 明确指定返回值类型

如果函数体为多行语句组成的代码段, 那么就必须明确指定返回值类型, 除非这个函数打算返回 `Unit`, [这时返回类型的声明可以省略](#unit-returning-functions).
对于多行语句组成的函数, Kotlin 不会推断其返回值类型, 因为这样的函数内部可能存在复杂的控制流, 而且返回值类型对于代码的阅读者来说并不是那么一目了然(有些时候, 甚至对于编译器来说也很难判定返回值类型). 


### 不定数量参数(Varargs)

一个函数的一个参数 (通常是参数中的最后一个) 可以标记为 `vararg`:

``` kotlin
fun <T> asList(vararg ts: T): List<T> {
  val result = ArrayList<T>()
  for (t in ts) // ts 是一个 Array
    result.add(t)
  return result
}
```

调用时, 可以向这个函数传递不定数量的参数:

```kotlin
  val list = asList(1, 2, 3)
```

在函数内部, 类型为 `T` 的 `vararg` 参数会被看作一个 `T` 类型的数组, 也就是说, 上例中的 `ts` 变量的类型为 `Array<out T>`.

只有一个参数可以标记为 `vararg`. 如果 `vararg` 参数不是函数的最后一个参数, 那么对于 `vararg` 参数之后的其他参数, 可以使用命名参数语法来传递参数值, 或者, 如果参数类型是函数, 可以在括号之外传递一个 Lambda 表达式.

调用一个存在 `vararg` 参数的函数时, 我们可以逐个传递参数值, 比如, `asList(1, 2, 3)`, 或者, 如果我们已经有了一个数组, 希望将它的内容传递给函数, 我们可以使用 **展开(spread)** 操作符(在数组之前加一个 `*`):

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

## 函数的范围

在 Kotlin 中函数可以定义在源代码的顶级范围内(top level), 这就意味着, 你不必象在 Java, C# 或 Scala 等等语言中那样, 创建一个类来容纳这个函数, 除顶级函数之外, Kotlin 中的函数也可以定义为局部函数, 成员函数, 以及扩展函数.

### 局部函数

Kotlin 支持局部函数, 也就是, 嵌套在另一个函数内的函数:

``` kotlin
fun dfs(graph: Graph) {
  fun dfs(current: Vertex, visited: Set<Vertex>) {
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v, visited)
  }

  dfs(graph.vertices[0], HashSet())
}
```

局部函数可以访问外部函数中的局部变量(也就是, 闭包), 因此, 在上面的例子中, *visited* 可以定义为一个局部变量:

``` kotlin
fun dfs(graph: Graph) {
  val visited = HashSet<Vertex>()
  fun dfs(current: Vertex) {
    if (!visited.add(current)) return
    for (v in current.neighbors)
      dfs(v)
  }

  dfs(graph.vertices[0])
}
```

### 成员函数

成员函数是指定义在类或对象之内的函数:

``` kotlin
class Sample() {
  fun foo() { print("Foo") }
}
```

对成员函数的调用使用点号标记法

``` kotlin
Sample().foo() // 创建 Sample 类的实例, 并调用 foo 函数
```

关于类, 以及成员覆盖, 详情请参见 [类](classes.html) 和 [继承](classes.html#inheritance)

## 泛型函数

函数可以带有泛型参数, 泛型参数通过函数名之前的尖括号来指定:

``` kotlin
fun <T> singletonList(item: T): List<T> {
  // ...
}
```

关于泛型函数, 详情请参见 [泛型](generics.html)

## 内联函数(Inline Function)

内联函数的详细解释在 [这里](inline-functions.html)

## 扩展函数

扩展函数的详细解释在 [单独的章节](extensions.html)

## 高阶函数(Higher-Order Function) 与 Lambda 表达式

高阶函数(Higher-Order Function) 与 Lambda 表达式的详细解释在 [单独的章节](lambdas.html)

## 尾递归函数(Tail recursive function)

Kotlin 支持一种称为 [尾递归(tail recursion)](https://en.wikipedia.org/wiki/Tail_call) 的函数式编程方式.
这种方式使得某些本来需要使用循环来实现的算法, 可以改用递归函数来实现, 但同时不会存在栈溢出(stack overflow)的风险.
当一个函数标记为 `tailrec`, 并且满足要求的形式, 编译器就会对代码进行优化, 消除函数的递归调用, 产生一段基于循环实现的, 快速而且高效的代码.

``` kotlin
tailrec fun findFixPoint(x: Double = 1.0): Double
        = if (x == Math.cos(x)) x else findFixPoint(Math.cos(x))
```

上面的代码计算余弦函数的不动点(fixpoint), 结果应该是一个数学上的常数. 这个函数只是简单地从 1.0 开始不断重复地调用 Math.cos 函数, 直到计算结果不再变化为止, 计算结果将是 0.7390851332151607. 编译器优化产生的代码等价于下面这种传统方式编写的代码:

``` kotlin
private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = Math.cos(x)
        if (x == y) return y
        x = y
    }
}
```

要符合 `tailrec` 修饰符的要求, 函数必须在它执行的所有操作的最后一步, 递归调用它自身. 如果在这个递归调用之后还存在其他代码, 那么你不能使用尾递归, 而且你不能将尾递归用在 try/catch/finally 结构内. 尾递归目前只能用在 JVM 环境内.

