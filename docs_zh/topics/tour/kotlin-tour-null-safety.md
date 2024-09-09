---
type: doc
layout: reference
category:
title: "Null 值安全性"
---

# Null 值安全性

最终更新: {{ site.data.releases.latestDocDate }}

<table style="border-style: solid; border-color: #D1D1D2">
    <tr>
        <td>
        <div style="display: block">
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-1-done.svg" alt="第 1 步" width="20"/> &nbsp;
                <a href="kotlin-tour-hello-world.html">Hello world</a>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-2-done.svg" alt="第 2 步" width="20"/> &nbsp;
                <a href="kotlin-tour-basic-types.html">基本类型</a>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-3-done.svg" alt="第 3 步" width="20"/> &nbsp;
                <a href="kotlin-tour-collections.html">集合(Collection)</a>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-4-done.svg" alt="第 4 步" width="20"/> &nbsp;
                <a href="kotlin-tour-control-flow.html">控制流</a>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-5-done.svg" alt="第 5 步" width="20"/> &nbsp;
                <a href="kotlin-tour-functions.html">函数</a>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-6-done.svg" alt="第 6 步" width="20"/> &nbsp;
                <a href="kotlin-tour-classes.html">类</a>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-7-todo.svg" alt="第 7 步" width="20"/> &nbsp;
                <strong>Null 值安全性</strong>
            </div>
        </div>
        </td>
    </tr>
</table>

在 Kotlin 中, 可以使用 `null` 值. 为了帮助在程序中防止 `null` 值相关的问题, Kotlin 提供了 null 值安全性功能.
null 值安全性功能会在编译期检测 `null` 值潜在的问题, 而不是在运行期.

Null 安全性是多种功能的组合, 使得你能够:
* 如果你的程序允许 `null` 值, 可以明确声明.
* 检查 `null` 值.
* 对可能包含 `null` 值的属性或函数, 使用安全调用.
* 如果检测到 `null` 值时, 声明如何处理.

## 可为 null 的类型

Kotlin 支持可为 null 的类型, 这样的类型允许存在 `null` 值.
默认情况下, 一个类型 **不能** 接受 `null` 值.
声明可为 null 的类型的方法是, 在类型声明之后明确添加 `?`.

例如:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-nullable-type">

```kotlin
fun main() {
    // neverNull 的类型为: String
    var neverNull: String = "This can't be null"

    // 这里会出现编译器错误
    neverNull = null

    // nullable 的类型为: 可以为 null 的 String
    var nullable: String? = "You can keep a null here"

    // 这是可以的
    nullable = null

    // 默认情况下, 不能接受 null 值
    var inferredNonNull = "The compiler assumes non-nullable"

    // 这里会出现编译器错误
    inferredNonNull = null

    // notNull 不能接受 null 值
    fun strLength(notNull: String): Int {
        return notNull.length
    }

    println(strLength(neverNull)) // 输出结果为 18
    println(strLength(nullable))  // 这里会出现编译器错误
}
```

</div>

> `length` 是 [String](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 类的属性,
> 它表示字符串中字符的数量.
{:.tip}

## 检查 null 值

你可以在条件表达式中检查 `null` 值.
在下面的示例中, `describeString()` 函数包含一个 `if` 语句,
它检查 `maybeString` 是不是 **非** `null` 值, 并且它的 `length` 是否大于 0:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-check-nulls">

```kotlin
fun describeString(maybeString: String?): String {
    if (maybeString != null && maybeString.length > 0) {
        return "String of length ${maybeString.length}"
    } else {
        return "Empty or null string"
    }
}

fun main() {
    var nullString: String? = null
    println(describeString(nullString))
    // 输出结果为 Empty or null string
}
```

</div>

## 使用安全调用

对于可能包含 `null` 值的对象, 要安全的访问它的属性, 请使用安全调用操作符 `?.`.
如果对象为 `null`, 安全调用操作符会返回 `null`.
如果你想要在你的代码中避免 `null` 值造成的错误, 这个功能会很有用.

在下面的示例中, `lengthString()` 函数使用安全调用, 返回字符串的长度, 或返回 `null` 值:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-safe-call-property">

```kotlin
fun lengthString(maybeString: String?): Int? = maybeString?.length

fun main() { 
    var nullString: String? = null
    println(lengthString(nullString))
    // null
}
```

</div>

> 可以对安全调用使用链式调用, 如果一个对象的任何属性保护 `null` 值, 则会返回 `null`, 而不会抛出错误.
> 例如:
> ```kotlin
>   person.company?.address?.country
> ```
{:.note}

安全调用操作符也可以用来对扩展函数或成员函数进行安全调用.
这种情况下, 会在调用函数之前进行 null 值检查.
如果检测到 `null` 值, 那么会跳过函数调用, 返回 `null`.

在下面的示例中, `nullString` 是 `null` 值, 因此对 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html)
的调用会被跳过, 并返回 `null`:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-safe-call-function">

```kotlin
fun main() {
    var nullString: String? = null
    println(nullString?.uppercase())
    // 输出结果为 null
}
```

</div>

## 使用 Elvis 操作符

你可以使用 **Elvis 操作符** `?:`, 指定检测到 `null` 值时的默认返回值.

Elvis 操作符的左侧, 是需要检测 `null` 值的表达式.
Elvis 操作符的右侧, 是检测到 `null` 值时应该返回的默认值.

在下面的示例中, `nullString` 是 `null` 值, 因此访问 `length` 属性的安全调用返回 `null` 值.
因此 Elvis 操作符的结果是, 返回 `0`:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-elvis-operator">

```kotlin
fun main() {
    var nullString: String? = null
    println(nullString?.length ?: 0)
    // 输出结果为 0
}
```

</div>

关于 Kotlin 中的 Null 值安全性, 更多详情请参见 [Null 值安全性](../null-safety.html).

## 实际练习

### 习题

你有一个 `employeeById` 函数, 可以用来访问一个公司的员工数据库.
但是, 这个函数返回 `Employee?` 类型的值, 因此结果可能为 `null`.
你的目标是编写一个函数, 如果给定了员工 `id`, 则返回员工的工资, 如果在数据库中没有找到这个员工, 则返回 `0`.

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise">

```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 -> Employee("Mary", 20)
    2 -> null
    3 -> Employee("John", 21)
    4 -> Employee("Ann", 23)
    else -> null
}

fun salaryById(id: Int) = // 在这里编写你的代码
    
fun main() { 
    println((1..5).sumOf { id -> salaryById(id) })
}
```

</div>

#### 参考答案

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" data-highlight-only id="kotlin-tour-null-safety-solution">

```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 -> Employee("Mary", 20)
    2 -> null
    3 -> Employee("John", 21)
    4 -> Employee("Ann", 23)
    else -> null
}

fun salaryById(id: Int) = employeeById(id)?.salary ?: 0

fun main() {
    println((1..5).sumOf { id -> salaryById(id) })
}
```

</div>

## 下一步做什么?

恭喜! 现在你已经完成了我们的 Kotlin 观光之旅, 下面请阅读我们的教程, 看看如何开发流行的 Kotlin 应用程序:
* [创建后端应用程序](../jvm/jvm-create-project-with-spring-boot.html)
* [为 Android 和 iOS 创建跨平台的应用程序](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html)
