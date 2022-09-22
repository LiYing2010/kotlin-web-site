---
type: doc
layout: reference
category: "Syntax"
title: "动态类型"
---

# 动态类型(Dynamic Type)

最终更新: {{ site.data.releases.latestDocDate }}

> 当编译目标平台为 JVM 时, 不支持动态类型.
{:.note}

Kotlin 是一种静态类型的语言, 但它必须与无类型的或类型系统较为松散的语言交互, 比如 JavaScript 的环境.
为了方便这样的使用场景, Kotlin 语言 提供了 `dynamic` 类型:

```kotlin
val dyn: dynamic = ...
```

简单来说, `dynamic` 类型关闭了 Kotlin 的类型检查:

- 一个 `dynamic` 类型的值可以赋值给任何变量, 也可以作为参数传递给任何函数.
- 任何值都可以赋值给一个 `dynamic` 类型的变量, 或传递给函数的 `dynamic` 类型参数.
- 对 `dynamic` 类型的值不做 `null` 检查.

`dynamic` 最受欢迎的功能是, 对 `dynamic` 类型变量, 可以访问它的 **任何** 属性,
还可以使用任意参数访问它的任何函数:

```kotlin
dyn.whatever(1, "foo", dyn) // 没有在任何地方定义过 'whatever'
dyn.whatever(*arrayOf(1, 2, 3))
```

在 JavaScript 平台, 这些代码会被"原封不动"地编译:
Kotlin 代码中的 `dyn.whatever(1)`,
编译产生的 JavaScript 代码就是同样的 `dyn.whatever(1)`.

对 `dynamic` 类型的值调用 Kotlin 编写的函数时,
要注意, Kotlin 到 JavaScript 编译器会进行名称混淆.
你可能需要使用 [@JsName 注解](js-to-kotlin-interop.html#jsname-annotation)
来为你需要调用的函数指定一个明确的名称.

一个动态调用永远会返回一个 `dynamic` 的结果, 因此你可以将这些调用自由地串联起来:

```kotlin
dyn.foo().bar.baz()
```

当你向一个动态调用传递一个 Lambda 表达式作为参数时, Lambda 表达式的所有参数类型默认都是 `dynamic`:

```kotlin
dyn.foo {
    x -> x.bar() // x 是 dynamic 类型
}
```

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
