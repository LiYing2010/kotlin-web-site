---
type: doc
layout: reference
category: "Other"
title: "与平台相关的声明"
---

## 与平台相关的声明

> 跨平台项目是 Kotlin 1.2 和 1.3 版中的实验性特性.
本文档描述的所有语言特性和工具特性, 在未来的 Kotlin 版本中都有可能发生变更.
{:.note}

Kotlin 跨平台代码的关键特性之一就是, 允许共通代码依赖到与平台相关的声明.
在其他语言中, 要实现这一点, 通常是在共通代码中创建一系列的接口, 然后在与平台相关的代码中实现这些接口.
但是, 如果你已经有一个库在某个平台上实现了你需要的功能, 而你希望不通过额外的包装直接使用这个库的 API, 这种方式就并不理想了.
而且, 这种方式要求共通声明必须以接口的形式来表达, 而这并不能满足所有可能的使用场景.

作为一种替代的方案, Kotlin 提供了 _预期声明与实际声明(expected and actual declaration)_ 机制.
通过这种机制, _common_ 模块可以定义 _预期声明(expected declaration)_, 而 _platform_ 模块则提供与预期声明相对应的 _实际声明(actual declaration)_.
为了理解这种机制的工作原理, 我们先来看一个示例程序. 这段代码是一个 _common_ 模块的一部分:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
package org.jetbrains.foo

expect class Foo(bar: String) {
    fun frob()
}

fun main() {
    Foo("Hello").frob()
}
```
</div>

下面是对应的 JVM 模块:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
package org.jetbrains.foo

actual class Foo actual constructor(val bar: String) {
    actual fun frob() {
        println("Frobbing the $bar")
    }
}
```
</div>

上面的示例演示了几个要点:

  * _common_ 模块中的预期声明, 以及与它对应的实际声明, 总是拥有完全相同的完整限定名(fully qualified name).
  * 预期声明使用 `expect` 关键字进行标记; 实际声明使用 `actual` 关键字进行标记.
  * 与预期声明中的任何一个部分对应的实际声明, 都必须标记为 `actual`.
  * 预期声明绝不包含任何实现代码.

注意, 预期声明并不局限于接口和接口的成员.
在上面的示例中, 预期类有一个构造函数, 而且在共通代码中可以直接创建这个类的实例.
你也可以将 `expect` 标记符用在其他声明上, 包括顶层声明, 以及注解:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// Common
expect fun formatString(source: String, vararg args: Any): String

expect annotation class Test

// JVM
actual fun formatString(source: String, vararg args: Any) =
    String.format(source, *args)

actual typealias Test = org.junit.Test
```
</div>

编译器会保证 _common_ 模块中的每一个预期声明, 在所有实现这个 _common_ 模块的 _platform_ 模块中, 都存在对应的实际声明,
如果缺少实际声明, 则会报告错误.
IDE 提供了工具, 可以帮助你创建缺少的实际声明.

如果你已经有了一个依赖于平台的库, 希望在共通代码中使用, 同时对其他平台则提供你自己的实现,
这时你可以为已存在的类定义一个类型别名, 以此作为实际声明:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
expect class AtomicRef<V>(value: V) {
  fun get(): V
  fun set(value: V)
  fun getAndSet(value: V): V
  fun compareAndSet(expect: V, update: V): Boolean
}

actual typealias AtomicRef<V> = java.util.concurrent.atomic.AtomicReference<V>
```
</div>
