---
type: doc
layout: reference
category: "Syntax"
title: "控制流: if, when, for, while"
---

# 控制流: if, when, for, while

## if 表达式

在 Kotlin 中, *if*{: .keyword } 是一个表达式, 也就是说, 它有返回值.
因此, Kotlin 中没有三元运算符(条件 ? then 分支返回值 : else 分支返回值), 因为简单的 *if*{: .keyword } 表达式完全可以实现同样的任务.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
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

</div>

*if*{: .keyword } 的分支可以是多条语句组成的代码段, 代码段内最后一个表达式的值将成为整个代码段的返回值:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val max = if (a > b) {
    print("Choose a")
    a
} else {
    print("Choose b")
    b
}
```

</div>

如果你将 *if*{: .keyword } 作为表达式来使用(比如, 将它的值作为函数的返回值, 或将它的值赋值给一个变量), 而不是用作普通的流程控制语句, 这种情况下 *if*{: .keyword } 表达式必须有 `else` 分支.

参见 [*if*{: .keyword } 语法](grammar.html#ifExpression).

## when 表达式

*when*{: .keyword } 替代了各种 C 风格语言中的 switch 操作符. 最简单的形式如下例:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> { // 注意, 这里是代码段
        print("x is neither 1 nor 2")
    }
}
```

</div>

*when*{: .keyword } 语句会将它的参数与各个分支逐个匹配, 直到找到某个分支的条件成立.
*when*{: .keyword } 可以用作表达式, 也可以用作流程控制语句.
如果用作表达式, 满足条件的分支的返回值将成为整个表达式的值.
如果用作流程控制语句, 各个分支的返回值将被忽略.
(与 *if*{: .keyword } 类似, 各个分支可以是多条语句组成的代码段, 代码段内最后一个表达式的值将成为整个代码段的值.)

如果其他所有分支的条件都不成立, 则会执行 *else*{: .keyword } 分支.
如果 *when*{: .keyword } 被用作表达式, 则必须有 *else*{: .keyword } 分支, 除非编译器能够证明其他分支的条件已经覆盖了所有可能的情况
(比如, 使用 [枚举类](enum-classes.html) 的常数 或 [封闭类](sealed-classes.html) 的子类型).

如果对多种条件需要进行相同的处理, 那么可以对一个分支指定多个条件, 用逗号分隔:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
when (x) {
    0, 1 -> print("x == 0 or x == 1")
    else -> print("otherwise")
}
```

</div>

在分支条件中, 我们可以使用任意的表达式(而不仅仅是常数值)

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
when (x) {
    parseInt(s) -> print("s encodes x")
    else -> print("s does not encode x")
}
```

</div>

我们还可以使用 *in*{: .keyword } 或 *!in*{: .keyword } 来检查一个值是否属于一个 [范围](ranges.html), 或者检查是否属于一个集合:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}
```

</div>

还可以使用 *is*{: .keyword } 或 *!is*{: .keyword } 来检查一个值是不是某个类型.
注意, 由于 Kotlin 的 [智能类型转换](typecasts.html#smart-casts) 功能,
进行过类型判断之后, 你就可以直接访问这个类型的方法和属性, 而不必再进行显式的类型检查.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}
```

</div>

*when*{: .keyword } 也可以用来替代 *if*{: .keyword }-*else*{: .keyword } *if*{: .keyword } 串.
如果没有指定参数, 那么所有的分支条件都应该是单纯的布尔表达式, 当条件的布尔表达式值为 true 时, 就会执行对应的分支:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
when {
    x.isOdd() -> print("x is odd")
    y.isEven() -> print("y is even")
    else -> print("x+y is even.")
}
```

</div>

从 Kotlin 1.3 开始, 可以使用下面这种语法, 将 *when*{: .keyword} 语句的判断对象保存到一个变量中:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success -> response.body
            is HttpError -> throw HttpException(response.status)
        }
```

</div>

由 *when*{: .keyword} 引入的这个变量, 它的有效范围仅限于 *when*{: .keyword} 语句之内.

参见 [*when*{: .keyword } 语法](grammar.html#whenExpression).


## for 循环

任何值, 只要能够产生一个迭代器(iterator), 就可以使用 *for*{: .keyword } 循环进行遍历.
相当于 C# 等语言中的 `foreach` 循环. 语法如下:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
for (item in collection) print(item)
```

</div>

循环体可以是多条语句组成的代码段.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
for (item: Int in ints) {
    // ...
}
```

</div>

前面提到过, 凡是能够产生迭代器(iterator)的值, 都可以使用 *for*{: .keyword } 进行遍历, 也就是说, 遍历对象需要满足以下条件:

* 存在一个成员函数- 或扩展函数 `iterator()`, 它的返回类型应该:
  * 存在一个成员函数- 或扩展函数 `next()`, 并且
  * 存在一个成员函数- 或扩展函数 `hasNext()`, 它的返回类型为 `Boolean` 类型.

上述三个函数都需要标记为 `operator`.

要遍历一个数值范围, 可以使用 [值范围表达式](ranges.html):

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    for (i in 1..3) {
        println(i)
    }
    for (i in 6 downTo 0 step 2) {
        println(i)
    }
//sampleEnd
}
```

</div>

使用 `for` 循环来遍历数组或值范围(Range)时, 会被编译为基于数组下标的循环, 不会产生迭代器(iterator)对象.

如果你希望使用下标变量来遍历数组或 List, 可以这样做:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
    val array = arrayOf("a", "b", "c")
//sampleStart
    for (i in array.indices) {
        println(array[i])
    }
//sampleEnd
}
```

</div>

或者, 你也可以使用 `withIndex` 库函数:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
    val array = arrayOf("a", "b", "c")
//sampleStart
    for ((index, value) in array.withIndex()) {
        println("the element at $index is $value")
    }
//sampleEnd
}
```

</div>

参见 [*for*{: .keyword } 语法](grammar.html#forStatement).

## while 循环

*while*{: .keyword } 和 *do*{: .keyword }..*while*{: .keyword } 的功能与其他语言一样:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // y is visible here!
```

</div>

参见 [*while*{: .keyword } 语法](grammar.html#whileStatement).

## 循环的中断(break)与继续(continue)

Kotlin 的循环支持传统的 *break*{: .keyword } 和 *continue*{: .keyword } 操作符. 参见 [返回与跳转](returns.html).
