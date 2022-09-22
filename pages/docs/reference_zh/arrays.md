---
type: doc
layout: reference
category:
title: "数组"
---

# 数组

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin 中的数组通过 `Array` 类表达.
这个类拥有 `get()` 和 `set()` 函数, 这些函数通过运算符重载转换为 `[]` 运算符,
此外还有 `size` 属性, 以及其他一些有用的成员函数:

```kotlin
class Array<T> private constructor() {
    val size: Int
    operator fun get(index: Int): T
    operator fun set(index: Int, value: T): Unit

    operator fun iterator(): Iterator<T>
    // ...
}
```

要创建一个数组, 可以使用 `arrayOf()` 函数, 并向这个函数传递一些参数来指定数组元素的值,
所以 `arrayOf(1, 2, 3)` 将创建一个数组, 其中的元素为 `[1, 2, 3]`.
或者, 也可以使用 `arrayOfNulls()` 函数来创建一个指定长度的数组, 其中的元素全部为 `null` 值.

另一种方案是使用 `Array` 构造函数, 第一个参数为数组大小, 第二个参数是另一个函数,
这个函数接受数组元素下标作为自己的输入参数, 然后返回这个下标对应的数组元素值:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    // 创建一个 Array<String>, 其中的元素为 ["0", "1", "4", "9", "16"]
    val asc = Array(5) { i -> (i * i).toString() }
    asc.forEach { println(it) }
//sampleEnd
}
```

</div>

`[]` 运算符可以用来调用数组的成员函数 `get()` 和 `set()`.

Kotlin 中数组的类型是 _不可变的_ .
所以 Kotlin 不允许将一个 `Array<String>` 赋值给一个 `Array<Any>`,
否则可能会导致运行时错误(但你可以使用 `Array<out Any>`,
参见 [类型投射](generics.html#type-projections)).

## 基本数据类型的数组

Kotlin 中也有类来表达基本数据类型的数组: `ByteArray`, `ShortArray`, `IntArray` 等等,
这些数组可以避免数值对象装箱带来的性能损耗.
这些类与 `Array` 类之间不存在继承关系, 但它们的方法和属性是一致的.
各个基本数据类型的数组类都有对应的工厂函数:

```kotlin
val x: IntArray = intArrayOf(1, 2, 3)
x[0] = x[1] + x[2]
```

```kotlin
// 长度为 5 的 int 数组, 元素值为 [0, 0, 0, 0, 0]
val arr = IntArray(5)

// 示例: 使用常数初始化数组元素值
// 长度为 5 的 int 数组, 元素值为 [42, 42, 42, 42, 42]
val arr = IntArray(5) { 42 }

// 示例: 使用 lambda 函数初始化数组元素值
// 长度为 5 的 int 数组, 元素值为 [0, 1, 2, 3, 4] (元素值使用其下标值)
var arr = IntArray(5) { it * 1 }
```
