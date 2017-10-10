---
type: doc
layout: reference
category: Other
title: "集合: List, Set, Map"
---

# 集合(Collection): List, Set, Map

与很多其他语言不同, Kotlin 明确地区分可变的和不可变的集合(list, set, map, 等等). 明确地控制集合什么时候可变什么时候不可变, 对于消除 bug 是很有帮助的, 也有助于设计出良好的 API.

理解可变集合的只读 _视图(view)_ 与一个不可变的集合之间的差别, 是很重要的. 这两者都可以很容易地创建, 但类型系统无法区分这二者的差别, 因此记住哪个集合可变哪个不可变, 这是你自己的责任.

Kotlin 的 `List<out T>` 类型是一个只读的接口, 它提供的操作包括 `size`, `get` 等等. 与 Java 一样, 这个接口继承自 `Collection<T>`,  `Collection<T>` 又继承自 `Iterable<T>`. 能够修改 List 内容的方法是由 `MutableList<T>` 接口添加的. 对于 `Set<out T>/MutableSet<T>` 以及 `Map<K, out V>/MutableMap<K, V>` 也是同样的模式.

通过下面的例子, 我们可以看看 list 和 set 类型的基本用法:

``` kotlin
val numbers: MutableList<Int> = mutableListOf(1, 2, 3)
val readOnlyView: List<Int> = numbers
println(numbers)        // 打印结果为: "[1, 2, 3]"
numbers.add(4)
println(readOnlyView)   // 打印结果为: "[1, 2, 3, 4]"
readOnlyView.clear()    // -> 无法编译

val strings = hashSetOf("a", "b", "c", "c")
assert(strings.size == 3)
```

Kotlin 没有专门的语法用来创建 list 和 set. 你可以使用标准库中的方法, 比如 `listOf()`, `mutableListOf()`, `setOf()`, `mutableSetOf()`.
在并不极端关注性能的情况下, 创建 map 可以使用一个简单的 [惯用法](idioms.html#read-only-map): `mapOf(a to b, c to d)`.

注意, `readOnlyView` 变量指向的其实是同一个 list 实例, 因此它的内容会随着后端 list 一同变化. 如果指向 list 的只有唯一一个引用,  而且这个引用是只读的, 那么我们可以这个集合完全是不可变的. 创建一个这样的集合的简单办法如下:

``` kotlin
val items = listOf(1, 2, 3)
```

目前, `listOf` 方法是使用 array list 实现的, 但在将来, 这个方法会返回一个内存效率更高的, 完全不可变的集合类型, 以便尽量利用集合内容不可变这个前提.

注意, 只读集合类型是 [协变的(covariant)](generics.html#variance). 也就是说, 假设 Rectangle 继承自 Shape, 你可以将一个 `List<Rectangle>` 类型的值赋给一个 `List<Shape>` 类型变量. 但这对于可变的集合类型是不允许的, 因为可能导致运行时错误.

有时候, 你希望向调用者返回集合在某个时刻的一个快照, 而且这个快照保证不会变化:

``` kotlin
class Controller {
    private val _items = mutableListOf<String>()
    val items: List<String> get() = _items.toList()
}
```

`toList` 扩展方法只是单纯地复制 list 内的元素, 因此, 返回的 list 内容可以确保不会变化.

list 和 set 还有一些有用的扩展方法, 值得我们熟悉一下:

``` kotlin
val items = listOf(1, 2, 3, 4)
items.first() == 1
items.last() == 4
items.filter { it % 2 == 0 }   // 返回值为: [2, 4]

val rwList = mutableListOf(1, 2, 3)
rwList.requireNoNulls()        // 返回值为: [1, 2, 3]
if (rwList.none { it > 6 }) println("No items above 6")  // 打印结果为: "No items above 6"
val item = rwList.firstOrNull()
```

... 此外还有你所期望的各种工具方法, 比如 sort, zip, fold, reduce 等等.

Map 也遵循相同的模式. 可以很容易地创建和访问, 比如:

``` kotlin
val readWriteMap = hashMapOf("foo" to 1, "bar" to 2)
println(readWriteMap["foo"])  // 打印结果为: "1"
val snapshot: Map<String, Int> = HashMap(readWriteMap)
```
