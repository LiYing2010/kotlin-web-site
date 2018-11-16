---
type: doc
layout: reference
category: "Other"
title: "类型别名 (从 Kotlin 1.1 开始支持)"
---

## 类型别名 (从 Kotlin 1.1 开始支持)

类型别名可以为已有的类型提供替代的名称.
如果类型名称太长, 你可以指定一个更短的名称, 然后使用新的名称.

这个功能有助于缩短那些很长的泛型类型名称.
比如, 缩短集合类型的名称通常是很吸引人的:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
typealias NodeSet = Set<Network.Node>

typealias FileTable<K> = MutableMap<K, MutableList<File>>
```
</div>

你也可以为函数类型指定不同的别名:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
typealias MyHandler = (Int, String, Any) -> Unit

typealias Predicate<T> = (T) -> Boolean
```
</div>

你也可以为内部类和嵌套类指定新的名称:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
class A {
    inner class Inner
}
class B {
    inner class Inner
}

typealias AInner = A.Inner
typealias BInner = B.Inner
```
</div>

类型别名不会引入新的类型.
类型别名与它对应的真实类型完全等同.
如果你添加一个别名 `typealias Predicate<T>`, 然后在你的代码中使用 `Predicate<Int>`, Kotlin 编译器会把你的代码扩展为 `(Int) -> Boolean`.
因此, 在需要通常的函数类型的地方, 可以使用你定义的类型别名的变量, 反过来也是如此:

<div class="sample" markdown="1" theme="idea">
```kotlin
typealias Predicate<T> = (T) -> Boolean

fun foo(p: Predicate<Int>) = p(42)

fun main() {
    val f: (Int) -> Boolean = { it > 0 }
    println(foo(f)) // 打印结果为 "true"

    val p: Predicate<Int> = { it > 0 }
    println(listOf(1, -2).filter(p)) // 打印结果为 "[1]"
}
```
</div>
