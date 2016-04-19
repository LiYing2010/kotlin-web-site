---
type: doc
layout: reference
category: "Syntax"
title: "高阶函数与 Lambda 表达式"
---

# 高阶函数与 Lambda 表达式

## 高阶函数(Higher-Order Function)

高阶函数(higher-order function)是一种特殊的函数, 它接受函数作为参数, 或者返回一个函数.
这种函数的一个很好的例子就是 `lock()` 函数, 它的参数是一个锁对象(lock object), 以及另一个函数, 它首先获取锁, 运行对象函数, 然后再释放锁:

``` kotlin
fun <T> lock(lock: Lock, body: () -> T): T {
  lock.lock()
  try {
    return body()
  }
  finally {
    lock.unlock()
  }
}
```

我们来分析一下上面的代码: `body` 参数是一个 [函数类型](#function-types): `() -> T`, 因此它应该是一个函数, 没有参数, 返回一个 `T` 类型的值.
`body` 函数在 *try*{: .keyword } 块内被调用, 被 `lock` 锁保护住, 它的执行结果被 `lock()` 函数当作自己的结果返回.

如果我们要调用 `lock()` 函数, 我们需要将另一个函数传递给它作为参数(参见 [函数引用](reflection.html#function-references)):

``` kotlin
fun toBeSynchronized() = sharedResource.operation()

val result = lock(lock, ::toBeSynchronized)
```

另一种更常用的便捷方式是传递一个 [Lambda 表达式](#lambda-expressions-and-anonymous-functions) 作为参数:

``` kotlin
val result = lock(lock, { sharedResource.operation() })
```

Lambda 表达式的详细介绍请参见 [后面的章节](#lambda-expressions-and-anonymous-functions), 但为了继续本章的内容, 我们在这里做一点简单的介绍:

* Lambda 表达式用大括号括起,
* 它的参数(如果存在的话)定义在 `->` 之前 (参数类型可以省略),
* (如果存在 `->` 的话)函数体定义在 `->` 之后.

在 Kotlin 中有一种约定, 如果调用一个函数时, 最后一个参数是另一个函数, 那么这个参数可以写在括号之外:

``` kotlin
lock (lock) {
  sharedResource.operation()
}
```

高阶函数的另一个例子是 `map()`:

``` kotlin
fun <T, R> List<T>.map(transform: (T) -> R): List<R> {
  val result = arrayListOf<R>()
  for (item in this)
    result.add(transform(item))
  return result
}
```

这个函数可以象这样调用:

``` kotlin
val doubled = ints.map { it -> it * 2 }
```

注意, 调用函数时, 如果 Lambda 表达式是唯一的一个参数, 那么整个括号都可以省略.

另一个有用的约定是, 如果一个函数字面值(function literal)只有唯一一个参数, 那么这个参数的声明可以省略(`->` 也可以一起省略), 参数声明省略后, 将使用默认名称 `it`:

``` kotlin
ints.map { it * 2 }
```

有了这样的约定, 我们就可以写出 [LINQ 风格](http://msdn.microsoft.com/en-us/library/bb308959.aspx) 的代码:

``` kotlin
strings.filter { it.length == 5 }.sortBy { it }.map { it.toUpperCase() }
```

## 内联函数(Inline Function)

有些时候, 使用 [内联函数](inline-functions.html) 可以提高高阶函数的性能.

## Lambda 表达式与匿名函数(Anonymous Function)

Lambda 表达式, 或者匿名函数, 是一种"函数字面值(function literal)", 也就是, 一个没有声明的函数, 但是立即作为表达式传递出去. 我们来看看下面的代码:

``` kotlin
max(strings, { a, b -> a.length() < b.length() })
```

函数 `max` 是一个高阶函数, 也就是说, 它接受一个函数值作为第二个参数. 第二个参数是一个表达式, 本身又是另一个函数, 也就是说, 它是一个函数字面量. 作为函数, 它等价于:

``` kotlin
fun compare(a: String, b: String): Boolean = a.length() < b.length()
```

### 函数类型(Function Type)

对于接受另一个函数作为自己参数的函数, 我们必须针对这个参数指定一个函数类型.
比如, 前面提到的 `max` 函数, 它的定义如下:

``` kotlin
fun <T> max(collection: Collection<T>, less: (T, T) -> Boolean): T? {
  var max: T? = null
  for (it in collection)
    if (max == null || less(max, it))
      max = it
  return max
}
```

参数 `less` 的类型是 `(T, T) -> Boolean`, 也就是, 它是一个函数, 接受两个 `T` 类型参数, 并且返回一个 `Boolean` 类型结果: 如果第一个参数小于第二个参数, 则返回 true, 否则返回 false.

在函数体, 第 4 行, `less` 被作为一个函数来使用: 这里调用了它, 传递给它两个 `T` 类型的参数.

函数类型的定义可以写作上面例子中那样, 如果你希望为各个参数编写文档, 解释其含义, 那么也可以指定参数名称.

``` kotlin
val compare: (x: T, y: T) -> Int = ...
```

### Lambda 表达式的语法

Lambda 表达式的完整语法形式, 也就是, 函数类型的字面值, 如下:

``` kotlin
val sum = { x: Int, y: Int -> x + y }
```

Lambda 表达式包含在大括号之内, 在完整语法形式中, 参数声明在圆括号之内, 参数类型的声明可选, 函数体在 `->` 符号之后.
如果我们把所有可选的内容都去掉, 那么剩余的部分如下:

``` kotlin
val sum: (Int, Int) -> Int = { x, y -> x + y }
```

很多情况下 Lambda 表达式只有唯一一个参数.
如果 Kotlin 能够自行判断出 Lambda 表达式的参数定义, 那么它将允许我们省略唯一一个参数的定义, 并且会为我们隐含地定义这个参数, 使用的参数名为 `it`:

``` kotlin
ints.filter { it > 0 } // 这个函数字面值的类型是 '(it: Int) -> Boolean'
```

注意, 如果一个函数接受另一个函数作为它的最后一个参数, 那么 Lambda 表达式作为参数时, 可以写在圆括号之外.
详细的语法请参见 [后缀调用](grammar.html#call-suffix).

### 匿名函数(Anonymous Function)

上面讲到的 Lambda 表达式语法, 还遗漏了一点, 就是可以指定函数的返回值类型. 大多数情况下, 不需要指定函数类型, 因为可以自动推断得到. 但是, 如果的确需要明确指定返回值类型, 你可以可以选择另一种语法: _匿名函数(anonymous function)_.

``` kotlin
fun(x: Int, y: Int): Int = x + y
```

匿名函数看起来与通常的函数声明很类似, 区别在于省略了函数名. 函数体可以是一个表达式(如上例), 也可以是多条语句组成的代码段:

``` kotlin
fun(x: Int, y: Int): Int {
  return x + y
}
```

参数和返回值类型的声明与通常的函数一样, 但如果参数类型可以通过上下文推断得到, 那么类型声明可以省略:

``` kotlin
ints.filter(fun(item) = item > 0)
```

对于匿名函数, 返回值类型的自动推断方式与通常的函数一样: 如果函数体是一个表达式, 那么返回值类型可以自动推断得到, 如果函数体是多条语句组成的代码段, 则返回值类型必须明确指定(否则被认为是 `Unit`).

注意, 匿名函数参数一定要在圆括号内传递. 允许将函数类型参数写在圆括号之外语法, 仅对 Lambda 表达式有效.

Lambda 表达式与匿名函数之间的另一个区别是, 它们的 [非局部返回(non-local return)](inline-functions.html#non-local-returns) 的行为不同. 不使用标签的 *return*{: .keyword } 语句总是从 *fun*{: .keyword } 关键字定义的函数中返回. 也就是说, Lambda 表达式内的 *return*{: .keyword } 将会从包含这个 Lambda 表达式的函数中返回, 而匿名函数内的 *return*{: .keyword } 只会从匿名函数本身返回.

### 闭包(Closure)

Lambda 表达式, 匿名函数 (此外还有 [局部函数](functions.html#local-functions), [对象表达式](object-declarations.html#object-expressions)) 可以访问它的 _闭包_, 也就是, 定义在外层范围中的变量. 与 Java 不同, 闭包中捕获的变量是可以修改的(译注: Java 中必须为 final 变量):

``` kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
  sum += it
}
print(sum)
```


### 带有接受者的函数字面值

Kotlin 提供了一种能力, 调用一个函数字面值时, 可以指定一个 _接收者对象(receiver object)_.
在这个函数字面值的函数体内部, 你可以调用接收者对象的方法, 而不必指定任何限定符.
这种能力与扩展函数很类似, 在扩展函数的函数体中, 你也可以访问接收者对象的成员.
这种功能最重要的例子之一就是 [类型安全的 Groovy 风格的生成器(builder)](type-safe-builders.html).

这样的函数字面值, 它的类型是带接受者的函数类型:

``` kotlin
sum : Int.(other: Int) -> Int
```

这样的函数字面值, 可以象接受者对象上的方法一样调用:

``` kotlin
1.sum(2)
```

匿名函数语法允许你直接指定函数字面值的接受者类型.
如果你需要声明一个带接受者的函数类型变量, 然后再将来的某个地方使用它, 那么这种功能就很有用.

``` kotlin
val sum = fun Int.(other: Int): Int = this + other
```

如果接受者类型可以通过上下文自动推断得到, 那么 Lambda 表达式也可以用做带接受者的函数字面值.

``` kotlin
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
