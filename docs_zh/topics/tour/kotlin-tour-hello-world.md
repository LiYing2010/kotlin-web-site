---
type: doc
layout: reference
category:
title: "Hello world"
---

# Hello world

最终更新: {{ site.data.releases.latestDocDate }}

<table style="border-style: solid; border-color: #D1D1D2">
    <tr>
        <td>
        <div style="display: block">
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-1.svg" alt="第 1 步" width="20"/> &nbsp;
                <strong>Hello world</strong>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-2-todo.svg" alt="第 2 步" width="20"/> &nbsp;
                <a href="kotlin-tour-basic-types.html">基本类型</a>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-3-todo.svg" alt="第 3 步" width="20"/> &nbsp;
                <a href="kotlin-tour-collections.html">集合(Collection)</a>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-4-todo.svg" alt="第 4 步" width="20"/> &nbsp;
                <a href="kotlin-tour-control-flow.html">控制流</a>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-5-todo.svg" alt="第 5 步" width="20"/> &nbsp;
                <a href="kotlin-tour-functions.html">函数</a>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-6-todo.svg" alt="第 6 步" width="20"/> &nbsp;
                <a href="kotlin-tour-classes.html">类</a>
            </div>
            <br/>
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-7-todo.svg" alt="第 7 步" width="20"/> &nbsp;
                <a href="kotlin-tour-null-safety.html">Null 值安全性</a>
            </div>
        </div>
        </td>
    </tr>
</table>

下面是一个简单的程序, 输出 "Hello, world!":

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="hello-world-kotlin">

```kotlin
fun main() {
    println("Hello, world!")
    // 输出结果为 Hello, world!
}
```
</div>

在 Kotlin 中:
* `fun` 用来声明一个函数
* `main()` 函数是你的程序开始的位置
* 函数体写在大括号 `{}` 之内
* [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 和 [`print()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/print.html) 函数将它们的参数打印到标准输出

> 函数会在后面的各章中详细介绍. 在此之前, 所有的示例程序都使用 `main()` 函数.
{:.note}

## 变量

所有的程序都需要存储数据, 变量可以帮助你实现这个目的. 在 Kotlin 中, 你可以:
* 使用 `val`, 声明只读的变量
* 使用 `var`, 声明可变的变量

要为变量赋值, 请使用赋值操作符 `=`.

例如:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-variables">

```kotlin
fun main() { 
//sampleStart
    val popcorn = 5    // 有 5 盒爆米花
    val hotdog = 7     // 有 7 个热狗
    var customers = 10 // 队列中有 10 个客户
    
    // 有些客户离开了队列
    customers = 8
    println(customers)
    // 输出结果为 8
//sampleEnd
}
```

</div>

> 变量可以声明在 `main()` 函数之外, 在你的程序开始的地方.
> 使用这种方式声明的变量, 我们称之为声明在 **顶级(top level)** 范围中.
{:.tip}

由于 `customers` 是可变的变量, 可以在变量声明之后对它重新赋值.

> 我们建议你默认将所有变量都声明为只读(`val`)变量.
> 只有在需要的时候才声明可变的(`var`)变量.
{:.note}

## 字符串模板

确定的知道变量内容如何打印到标准输出将会很有用处. 你可以使用 **字符串模板** 做到这一点. 
你可以使用模板表达式来访问存储在变量和其它对象中的数据, 并将它们转换为字符串.
字符串值是包含在双引号 `"` 中的一串字符. 模板表达式总是以美元符号 `$` 作为起始.

要在模板表达式中计算一段代码的值, 请在美元符号 `$` 之后放置一对大括号 `{}`, 然后将代码放在大括号之内.

例如:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-string-templates">

```kotlin
fun main() { 
//sampleStart
    val customers = 10
    println("There are $customers customers")
    // 输出结果为 There are 10 customers
    
    println("There are ${customers + 1} customers")
    // 输出结果为 There are 11 customers
//sampleEnd
}
```

</div>

更多详情请参见 [字符串模板](../strings.html).

你会注意到, 上面的示例中没有为变量声明类型. Kotlin 自己会推断它的类型: `Int`.
这个教程会在 [下一章](kotlin-tour-basic-types.html) 中解释 Kotlin 各种不同的基本类型, 以及如何声明这些类型.

## 实际练习

### 习题

完成以下代码, 让程序打印 `"Mary is 20 years old"` 到标准输出:

<div class="sample" markdown="1" theme="idea" kotlin-min-compiler-version="1.3" id="kotlin-tour-hello-world-exercise">

```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    // 在这里编写你的代码
}
```

</div>

#### 参考答案

<div class="sample" markdown="1" theme="idea" data-highlight-only id="kotlin-tour-hello-world-solution">

```kotlin
fun main() {
    val name = "Mary"
    val age = 20
    println("$name is $age years old")
}
```

</div>

## 下一步

[基本类型](kotlin-tour-basic-types.html)
