---
type: doc
layout: reference
category: "Syntax"
title: "动态类型"
---

# 动态类型(Dynamic Type)

> 当编译目标平台为 JVM 时, 不支持动态类型.
{:.note}

Kotlin 是一种静态类型的语言, 因此它与动态类型的 JavaScript 很不相同.
为了方便与 JavaScript 代码之间的交互, Kotlin/JS 提供了 `dynamic` 类型:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val dyn: dynamic = ...
```
</div>

简单来说, `dynamic` 类型关闭了 Kotlin 的类型检查:

  - 一个 `dynamic` 类型的值可以赋值给任意类型的变量, 也可以作为参数传递给任何函数.
  - 一个 `dynamic` 类型的变量可以赋值为任何类型的值.
  - 函数的 `dynamic` 类型参数, 可以接受任何类型的参数值.
  - 对这些值不做 `null` 检查.

对一个 `dynamic` 类型变量, 可以访问它的 **任何** 属性,
还可以使用任意参数访问它的 **任何** 函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
dyn.whatever(1, "foo", dyn) // 没有在任何地方定义过 'whatever'
dyn.whatever(*arrayOf(1, 2, 3))
```
</div>

这些代码会被"原封不动"地编译: Kotlin 代码中的 `dyn.whatever(1)`,
编译产生的 JavaScript 代码就是同样的 `dyn.whatever(1)`.

对 `dynamic` 类型的值调用 Kotlin 编写的函数时,
要注意, Kotlin 到 JavaScript 编译器会进行名称混淆.
你可能需要使用 [@JsName 注解](js-to-kotlin-interop.html#jsname-annotation)
或 [@JsExport 注解](js-to-kotlin-interop.html#jsexport-annotation)
来为你想要调用的函数指定一个明确的名称.

一个动态调用永远会返回一个 `dynamic` 的结果, 因此这些调用可以自由地串联起来:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
dyn.foo().bar.baz()
```
</div>

当我们向一个动态调用传递一个 Lambda 表达式作为参数时, Lambda 表达式的所有参数类型默认都是 `dynamic`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
dyn.foo {
    x -> x.bar() // x 是 dynamic 类型
}
```
</div>

使用 `dynamic` 类型值的表达式, 会被"原封不动"地翻译为 JavaScript, 请注意不要使用 Kotlin 的运算符规约.
以下运算符是支持的:

* 二元运算符: `+`, `-`, `*`, `/`, `%`, `>`, `<` `>=`, `<=`, `==`, `!=`, `===`, `!==`, `&&`, `||`
* 一元运算符
    * 前缀运算符: `-`, `+`, `!`
    * 可以用作前缀运算符, 也可以用作后缀运算符: `++`, `--`
* 计算并赋值运算符: `+=`, `-=`, `*=`, `/=`, `%=`
* 下标访问运算符:
    * 读操作: `d[a]`, 参数多于一个会报错
    * 写操作: `d[a1] = a2`, `[]` 内的参数多于一个会报错

对 `dynamic` 类型的值使用 `in`, `!in` 和 `..` 操作是禁止的.

关于更加深入的技术性介绍, 请参见 [规格文档](https://github.com/JetBrains/kotlin/blob/master/spec-docs/dynamic-types.md).
