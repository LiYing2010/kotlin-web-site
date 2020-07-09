---
type: doc
layout: reference
category: "Native"
title: "不变性"
---


# Kotlin/Native 中的不变性(Immutability)

Kotlin/Native 实现了严格的可变性检查, 以确保重要的不变性(invariant)机制,
也就是, 对象在任何时刻, 要么是不可变的,
要么只能从单个线程访问 (`要么是不共享的可变对象, 要么是共享的不可变对象`).

在 Kotlin/Native 中, 不变性是一种运行期特性,
可以通过 `kotlin.native.concurrent.freeze` 函数应用在任意的对象子图上.
它会使得从某个给定的对象开始, 所能访问到的全部对象都成为不可变的对象,
这样的转换是一种单向转换 (也就是说, 冻结后的对象以后不能解冻).
有些天然的不可变对象, 比如 `kotlin.String`, `kotlin.Int`,
以及其他基本类型, 以及 `AtomicInt` 和 `AtomicReference` 默认就是冻结的.
如果对一个冻结后的对象执行一个变更其值的操作, 会抛出一个 `InvalidMutabilityException` 异常.

为了实现 `要么是不共享的可变对象, 要么是共享的不可变对象` 机制,
所有的全局可见状态值 (目前包括, `object` 单子, 以及枚举值) 会自动冻结.
如果不希望冻结某个对象, 可以使用 `kotlin.native.ThreadLocal` 注解,
它会对象变成线程局部变量(thread local),
而且是可变的(但它的值的变化对其他线程是不可见的).

非基本类型的顶层或全局变量,
默认只能在主线程中访问(也就是, _Kotlin/Native_ 平台最早初始化的那个线程).
如果其他线程访问了这样的变量, 会抛出 `IncorrectDereferenceException` 异常.
如果想让这些变量可以在其他线程中访问, 你可以使用 `@ThreadLocal` 注解,
将它变成线程局部变量, 或者使用 `@SharedImmutable` 注解, 让对象冻结, 并允许从其他线程访问.

`AtomicReference` 类可以用来将变更后的冻结状态值公布给其他线程, 因此可以构建共享缓存这样的模式.
