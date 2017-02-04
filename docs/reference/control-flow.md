---
type: doc
layout: reference
category: "Syntax"
title: "控制流"
---

# 控制流

## if 表达式

在 Kotlin 中, *if*{: .keyword } 是一个表达式, 也就是说, 它有返回值.
因此, Kotlin 中没有三元运算符(条件 ? then 分支返回值 : else 分支返回值), 因为简单的 *if*{: .keyword } 表达式完全可以实现同样的任务.

``` kotlin
// if 的传统用法
var max = a 
if (a < b) max = b 
 
// 使用 else 分支的方式 
var max: Int
if (a > b) {
    max = a
} else {
    max = b
}
 
// if 作为表达式使用
val max = if (a > b) a else b
```

*if*{: .keyword } 的分支可以是多条语句组成的代码段, 代码段内最后一个表达式的值将成为整个代码段的返回值:

``` kotlin
val max = if (a > b) {
    print("Choose a")
    a
} else {
    print("Choose b")
    b
}
```

如果你将 *if*{: .keyword } 作为表达式来使用(比如, 将它的值作为函数的返回值, 或将它的值赋值给一个变量), 而不是用作普通的流程控制语句, 这种情况下 *if*{: .keyword } 表达式必须有 `else` 分支.

参见 [*if*{: .keyword } 语法](grammar.html#if).

## when 表达式

*when*{: .keyword } 替代了各种 C 风格语言中的 switch 操作符. 最简单的形式如下例:

``` kotlin
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> { // 注意, 这里是代码段
        print("x is neither 1 nor 2")
    }
}
```

*when*{: .keyword } 语句会将它的参数与各个分支逐个匹配, 直到找到某个分支的条件成立.
*when*{: .keyword } 可以用作表达式, 也可以用作流程控制语句. 如果用作表达式, 满足条件的分支的返回值将成为整个表达式的值. 如果用作流程控制语句, 各个分支的返回值将被忽略. (与 *if*{: .keyword } 类似, 各个分支可以是多条语句组成的代码段, 代码段内最后一个表达式的值将成为整个代码段的值.)

如果其他所有分支的条件都不成立, 则会执行 *else*{: .keyword } 分支.
如果 *when*{: .keyword } 被用作表达式, 则必须有 *else*{: .keyword } 分支, 除非编译器能够证明其他分支的条件已经覆盖了所有可能的情况.

如果对多种条件需要进行相同的处理, 那么可以对一个分支指定多个条件, 用逗号分隔:

``` kotlin
when (x) {
    0, 1 -> print("x == 0 or x == 1")
    else -> print("otherwise")
}
```

在分支条件中, 我们可以使用任意的表达式(而不仅仅是常数值)

``` kotlin
when (x) {
    parseInt(s) -> print("s encodes x")
    else -> print("s does not encode x")
}
```

我们还可以使用 *in*{: .keyword } 或 *!in*{: .keyword } 来检查一个值是否属于一个 [范围](ranges.html), 或者检查是否属于一个集合:

``` kotlin
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}
```

还可以使用 *is*{: .keyword } 或 *!is*{: .keyword } 来检查一个值是不是某个类型. 注意, 由于 Kotlin 的 [智能类型转换](typecasts.html#smart-casts) 功能, 进行过类型判断之后, 你就可以直接访问这个类型的方法和属性, 而不必再进行显式的类型检查.

```kotlin
val hasPrefix = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}
```

*when*{: .keyword } 也可以用来替代 *if*{: .keyword }-*else*{: .keyword } *if*{: .keyword } 串.
如果没有指定参数, 那么所有的分支条件都应该是单纯的布尔表达式, 当条件的布尔表达式值为 true 时, 就会执行对应的分支:

``` kotlin
when {
    x.isOdd() -> print("x is odd")
    x.isEven() -> print("x is even")
    else -> print("x is funny")
}
```

参见 [*when*{: .keyword } 语法](grammar.html#when).


## for 循环

任何值, 只要能够产生一个迭代器(iterator), 就可以使用 *for*{: .keyword } 循环进行遍历. 语法如下:

``` kotlin
for (item in collection) print(item)
```

循环体可以是多条语句组成的代码段.

``` kotlin
for (item: Int in ints) {
    // ...
}
```

前面提到过, 凡是能够产生迭代器(iterator)的值, 都可以使用 *for*{: .keyword } 进行遍历, 也就是说, 遍历对象需要满足以下条件:

* 存在一个成员函数- 或扩展函数 `iterator()`, 它的返回类型应该:
  * 存在一个成员函数- 或扩展函数 `next()`, 并且
  * 存在一个成员函数- 或扩展函数 `hasNext()`, 它的返回类型为 `Boolean` 类型.

上述三个函数都需要标记为 `operator`.

`for` 循环遍历数组时, 会被编译为基于数组下标的循环, 不会产生迭代器(iterator)对象.

如果你希望使用下标变量来遍历数组或 List, 可以这样做:

``` kotlin
for (i in array.indices) {
    print(array[i])
}
```

注意, 上例中的 "在数值范围内的遍历" 会在编译期间进行优化, 运行时不会产生额外的对象实例.

或者, 你也可以使用 `withIndex` 库函数:

``` kotlin
for ((index, value) in array.withIndex()) {
    println("the element at $index is $value")
}
```

参见 [*for*{: .keyword } 语法](grammar.html#for).

## while 循环

*while*{: .keyword } 和 *do*{: .keyword }..*while*{: .keyword } 的功能与其他语言一样:

``` kotlin
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // y is visible here!
```

参见 [*while*{: .keyword } 语法](grammar.html#while).

## 循环的中断(break)与继续(continue)

Kotlin 的循环支持传统的 *break*{: .keyword } 和 *continue*{: .keyword } 操作符. 参见 [返回与跳转](returns.html).
