[//]: # (title: 简单性)

你的使用者需要理解的概念越少, 传达得越清晰, 这些概念的认知模型就越简单.
这可以通过限制 API 中的操作和抽象的数量来实现.

要确保你的库中的声明设置了适当的 [可见度](visibility-modifiers.md), 以保证内部的实现细节与公开的 API 相分离.
只有明确设计, 并编写了文档, 用于公开使用的那些 API, 才应该能够被使用者访问.

In the next part of the guide, we'll discuss some guidelines for promoting simplicity.

## 使用明确 API 模式(Explicit API Mode) {id="use-explicit-api-mode"}

我们推荐使用 Kotlin 编译器的 [明确 API 模式(Explicit API Mode)](whatsnew14.md#explicit-api-mode-for-library-authors) 功能,
它会强迫你在为你的库设计 API 时明确的说明你的意图.

使用明确 API 模式, 你必须:

* 对你的声明添加可见度修饰符, 让它成为 public, 而不是依赖于默认的 public 可见度.
  这可以确保你考虑清楚, 要把哪些部分暴露成为 public API 的一部分.
* 为你的所有 public 函数和属性定义类型, 以防止使用推断的类型造成无意中改变你的 API.

## 重用已有的概念

要限制你的 API 的大小, 有一种方法是重用已有的类型. 例如, 不要创建一个新的类型来表达持续的时间, 你可以使用 [`kotlin.time.Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/).
这种方法不仅提高开发效率, 还能改进与其他库的交互能力.

如果依赖于来自第三方库的类型, 或平台相关的类型, 那么要小心, 因为这些类型会造成你的库与这些元素高度捆绑.
这种情况下, 代价可能超过你得到的好处.

重用共通的类型, 例如 `String`, `Long`, `Pair`, 和 `Triple`, 可能会比较高效,
但如果能够更好的封装业务领域的逻辑, 你还是应该开发抽象的数据类型.

## 在核心 API 基础上定义并构建

提高简单性的另一条路径是, 围绕一组有限的核心操作, 定义一个小的概念模型.
只要这些操作的行为有了清晰的文档, 你就可以直接基于这些核心函数, 或组合这些核心函数, 开发新的操作, 扩展 API.

例如:

* 在 [Kotlin Flow API](flow.md) 中, 共通操作, 例如 [`filter`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/filter.html) 和 [`map`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/map.html), 是以 [`transform`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/transform.html) 操作为基础构建的.
* 在 [Kotlin Time API](time-measurement.md) 中, [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) 函数使用了 [`TimeSource.Monotonic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/-monotonic/).

对这些核心组件添加操作通常是有益的, 但并不总是必要的.
你可能会发现机会引入优化的变体, 或平台相关的变体, 能够扩展功能, 或更广泛的适应不同的输入.

如果使用者能够使用核心操作解决重要的问题, 能够通过增加的操作重构他们的解决方案, 而不改变任何行为,
那么就保证了概念模型的简单性.

## 下一步

本向导的下一部分中, 你将学习可读性.

[进入下一部分](api-guidelines-readability.md)
