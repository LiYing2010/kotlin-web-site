---
type: doc
layout: reference
category: "Syntax"
title: "返回与跳转: break 与 continue"
---

# 返回与跳转

Kotlin 中存在 3 种跳出程序流程的表达式:

* *return*{: .keyword }. 默认行为是, 从最内层的函数或 [匿名函数](lambdas.html#anonymous-functions) 中返回.
* *break*{: .keyword }. 结束最内层的循环.
* *continue*{: .keyword }. 在最内层的循环中, 跳转到下一次循环.

所有这些表达式都可以用作更大的表达式的一部分:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val s = person.name ?: return
```
</div>

这些表达式的类型都是 [Nothing 类型](exceptions.html#the-nothing-type).

## Break 和 Continue 的位置标签

Kotlin 中的任何表达式都可以用 *label*{: .keyword } 标签来标记.
标签由标识符后面加一个 `@` 符号构成, 比如: `abc@`, `fooBar@` 都是合法的标签(参见 [标签语法](grammar.html#label)).
要给一个表达式标记标签, 我们只需要将标签放在它之前:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
loop@ for (i in 1..100) {
    // ...
}
```
</div>

然后, 我们就可以使用标签来限定 *break*{: .keyword } 或 *continue*{: .keyword } 的跳转对象:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```
</div>

通过标签限定后, *break*{: .keyword } 语句, 将会跳转到这个标签标记的循环语句之后.
*continue*{: .keyword } 语句则会跳转到循环语句的下一次循环.


## 使用标签控制 return 的目标

在 Kotlin 中, 通过使用字面值函数(function literal), 局部函数(local function), 以及对象表达式(object expression), 允许实现函数的嵌套.
通过标签限定的 *return*{: .keyword } 语句, 可以从一个外层函数中返回.
最重要的使用场景是从 Lambda 表达式中返回. 回忆一下我们曾经写过以下代码:

<div class="sample" markdown="1" theme="idea">

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return // 非局部的返回(non-local return), 直接返回到 foo() 函数的调用者
        print(it)
    }
    println("this point is unreachable")
}
//sampleEnd

fun main() {
    foo()
}
```
</div>

这里的 *return*{: .keyword } 会从最内层的函数中返回, 也就是, 从 `foo` 函数返回.
(注意, 这种非局部的返回(non-local return), 仅对传递给 [内联函数(inline function)](inline-functions.html) 的 Lambda 表达式有效.)
如果需要从 Lambda 表达式返回, 我们必须对它标记一个标签, 然后使用这个标签来指明 *return*{: .keyword } 的目标:

<div class="sample" markdown="1" theme="idea">

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // 局部的返回(local return), 返回到 Lambda 表达式的调用者, 也就是, 返回到 forEach 循环
        print(it)
    }
    print(" done with explicit label")
}
//sampleEnd

fun main() {
    foo()
}
```
</div>

这样, *return*{: .keyword } 语句就只从 Lambda 表达式中返回.
通常, 使用隐含标签会更方便一些, 隐含标签的名称与 Lambda 表达式被传递去的函数名称相同.

<div class="sample" markdown="1" theme="idea">

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // 局部的返回(local return), 返回到 Lambda 表达式的调用者, 也就是, 返回到 forEach 循环
        print(it)
    }
    print(" done with implicit label")
}
//sampleEnd

fun main() {
    foo()
}
```
</div>

或者, 我们也可以使用 [匿名函数](lambdas.html#anonymous-functions) 来替代 Lambda 表达式.
匿名函数内的 *return*{: .keyword } 语句会从匿名函数内返回.

<div class="sample" markdown="1" theme="idea">

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach(fun(value: Int) {
        if (value == 3) return  // 局部的返回(local return), 返回到匿名函数的调用者, 也就是, 返回到 forEach 循环
        print(value)
    })
    print(" done with anonymous function")
}
//sampleEnd

fun main() {
    foo()
}
```
</div>

注意, 上面三个例子中局部返回的使用, 都与通常的循环中的 *continue*{: .keyword } 关键字的使用很类似.
不存在与 *break*{: .keyword } 直接等价的语法, 但可以模拟出来, 方法是增加一个嵌套的 Lambda 表达式, 然后在它内部使用非局部的返回:

<div class="sample" markdown="1" theme="idea">

```kotlin
//sampleStart
fun foo() {
    run loop@{
        listOf(1, 2, 3, 4, 5).forEach {
            if (it == 3) return@loop // 非局部的返回(non-local return), 从传递给 run 函数的 Lambda 表达式中返回
            print(it)
        }
    }
    print(" done with nested loop")
}
//sampleEnd

fun main() {
    foo()
}
```
</div>

当 return 语句指定了返回值时, 源代码解析器会将这样的语句优先识别为使用标签限定的 return 语句, 也就是说:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
return@a 1
```
</div>

含义是 "返回到标签 `@a` 处, 返回值为 `1`", 而不是 "返回一个带标签的表达式 `(@a 1)`".
