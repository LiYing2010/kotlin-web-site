[//]: # (title: 类型概述)

在 Kotlin 中, 一切都是对象, 这就意味着, 你可以对任何变量访问它的成员函数和属性.
有些数据类型使用优化过的内部表现形式, 在运行时使用 Java 的基本类型(Primitive Value)来表达, (比如, 数值, 字符, 以及布尔值),
但对于使用者来说, 它们就和通常的类一样.

本章介绍 Kotlin 中使用的基本类型:

* [数值](numbers.md) 以及对应的 [无符号数值](unsigned-integer-types.md)
* [布尔值](booleans.md)
* [字符](characters.md)
* [字符串](strings.md)
* [数组](arrays.md)

关于 Kotlin 的其他类型, 比如 `Nothing`, `Any`, 和 `Unit`, 请阅读 Kotlin API 参考文档:

* [`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/)
* [`Nothing`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)
* [`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/)

Kotlin 还有 "不可明确表示的类型" (Non-denotable Type). 这些类型不能在 Kotlin 代码中直接书写.
相反, 编译器在内部使用它们, 例如, 用于与其它语言交互.
Kotlin 创建这些类型, 是为了表达比 Kotlin 源代码语法允许的更加精确的类型信息.

尽管你自己不能声明不可明确表示的类型, 但在编译器诊断信息, IDE 工具提示, 或推断类型的显示中, 可能会遇到这些类型.
关于不可明确表示的类型, 详情请参见:

* [平台类型](java-interop.md#null-safety-and-platform-types)
* [](typecasts.md#intersection-types)
* [](numbers.md#integer-literal-types)
* [](generics.md#captured-types)
* [Kotlin 语言规范: 类型系统](https://kotlinlang.org/spec/type-system.html)

> 参见 [在 Kotlin 中如何进行类型检查和类型转换](typecasts.md).
>
{style="tip"}
