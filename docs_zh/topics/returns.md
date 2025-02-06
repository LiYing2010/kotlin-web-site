[//]: # (title: 返回与跳转: break 与 continue)

Kotlin 中存在 3 种跳出程序流程的表达式:

* `return` 的默认行为是, 从最内层的函数或 [匿名函数](lambdas.md#anonymous-functions) 中返回.
* `break` 结束最内层的循环.
* `continue` 在最内层的循环中, 跳转到下一次循环.

所有这些表达式都可以用作更大的表达式的一部分:

```kotlin
val s = person.name ?: return
```

这些表达式的类型都是 [Nothing 类型](exceptions.md#the-nothing-type).

## Break 和 Continue 的位置标签 {id="break-and-continue-labels"}

Kotlin 中的任何表达式都可以用 _label_ 标签来标记.
标签由标识符后面加一个 `@` 符号构成, 比如 `abc@`, `fooBar@`.
要给一个表达式标记标签, 只需要将标签放在它之前.

```kotlin
loop@ for (i in 1..100) {
    // ...
}
```

然后, 你就可以使用标签来限定 `break` 或 `continue` 的跳转对象:

```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```

通过标签限定后, `break` 语句, 将会跳转到这个标签标记的循环语句之后.
`continue` 语句则会跳转到循环语句的下一次循环.

> 某些情况下, 你可以 *非局部的(non-locally)* 使用 `break` 和 `continue`, 但不必明确定义标签.
> 这种非局部的使用方法, 在内层的 [内联函数](inline-functions.md#break-and-continue)
> 所使用的 Lambda 表达式中有效.
>
{style="note"}

## 使用标签控制 return 的目标 {id="return-to-labels"}

在 Kotlin 中, 通过使用字面值函数(function literal), 局部函数(local function), 以及对象表达式(object expression), 可以实现函数的嵌套.
通过标签限定的 `return` 语句, 可以从一个外层函数中返回.

最重要的使用场景是从 Lambda 表达式中返回.
如果需要从 Lambda 表达式返回, 可以对它标记一个标签, 然后使用这个标签来指明 `return` 的目标:

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // 局部的返回(local return), 返回到 Lambda 表达式的调用者: 返回到 forEach 循环
        print(it)
    }
    print(" done with explicit label")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

这样, `return` 语句就只从 Lambda 表达式中返回.
通常, 使用 _隐含标签_ 会更方便一些, 因为隐含标签的名称与 Lambda 表达式被传递去的函数名称相同.

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // 局部的返回(local return), 返回到 Lambda 表达式的调用者: 返回到 forEach 循环
        print(it)
    }
    print(" done with implicit label")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

另一种方法是, 你也可以使用 [匿名函数](lambdas.md#anonymous-functions) 来替代 Lambda 表达式.
匿名函数内的 `return` 语句会从匿名函数内返回.

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach(fun(value: Int) {
        if (value == 3) return  // 局部的返回(local return), 返回到匿名函数的调用者: 返回到 forEach 循环
        print(value)
    })
    print(" done with anonymous function")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

注意, 上面三个例子中局部返回的使用, 都与通常的循环中的 `continue` 关键字的使用很类似.

不存在与 `break` 直接等价的语法, 但可以模拟出来, 方法是增加一个嵌套的 Lambda 表达式, 然后在它内部使用非局部的返回:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

当 return 语句指定了返回值时, 源代码解析器会将这样的语句优先识别为使用标签限定的 return 语句:

```kotlin
return@a 1
```

这里的含义是 "返回到标签 `@a` 处, 返回值为 `1`", 而不是 "返回一个带标签的表达式 `(@a 1)`".

> 某些情况下, 你可以从 Lambda 表达式中返回, 但不必使用标签.
> 这种 *非局部的(non-local)* 返回存在于 Lambda 表达式中,
> 但退出包含 Lambda 表达式的 [内联函数](inline-functions.md#returns).
>
{style="note"}
