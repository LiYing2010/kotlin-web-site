[//]: # (title: 可测试性)

除了 [测试你的库](api-guidelines-consistency.md#maintain-conventions-and-quality) 之外,
还要确保使用你的库的代码也能够进行测试.

## 避免使用全局状态和有状态的顶层函数

你的库不应该依赖于全局变量中保存的状态, 也不应该在公开 API 中提供有状态的顶层函数.
这样的变量和函数使用库的代码难以进行测试, 因为测试需要找到一种方法来控制这些全局的值.

例如, 一个库可能会定义一个可全局访问的函数, 用来获取当前时间:

```kotlin
val instant: Instant = Clock.now()
println(instant)
```

使用这个 API 的代码会难以进行测试, 因为对 `now()` 函数的调用总是会返回真正的当前时间, 而在测试中通常需要返回假的值.

为了保证可测试性, [`kotlinx-datetime`](https://github.com/Kotlin/kotlinx-datetime) 库有一个 API, 允许用户得到一个 `Clock` 实例, 然后使用这个实例得到当前时间:

```kotlin
val clock: Clock = Clock.System
val instant: Instant = clock.now()
println(instant)
```

因此库的使用者能够将一个 `Clock` 实例注入到他们自己的类中, 并在测试中使用假的实现来替换真正的实现.

## 下一步做什么

如果你还没有读过, 请阅读下面这些章节:

* 关于维护向后兼容性(Backward Compatibility), 请阅读 [向后兼容性(Backward Compatibility)](api-guidelines-backward-compatibility.md) 章节.
* 关于编写高效文档的实践, 请阅读 [信息丰富的文档](api-guidelines-informative-documentation.md) 章节.
