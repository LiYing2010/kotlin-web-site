[//]: # (title: 集合写入操作)

最终更新: %latestDocDate%

[可变集合](collections-overview.md#collection-types) 允许执行改变集合内容的操作, 比如, 可以添加或删除元素.
本节中, 我们会介绍所有 `MutableCollection` 都支持的共通的写入操作.
`List` 和 `Map` 的专有的写入操作, 请分别参见 [List 相关操作](list-operations.md) 和 [Map 相关操作](map-operations.md).

## 添加元素

要向 list 或 set 添加单个元素, 可以使用
[`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html)
函数. 指定的对象会被添加到集合末尾.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html)
会将参数对象中的所有元素全部添加到 list 或 set.
参数可以是 `Iterable`, `Sequence`, 或 `Array`.
这个函数的接受者类型以及参数类型可以不同, 比如, 你可以将 `Set` 中的所有元素添加到 `List`.

如果在 list 上调用 `addAll()` 函数, 那么它将新元素添加到 list 的顺序, 会与元素在参数对象中的顺序相同.
调用 `addAll()` 函数时也可以增加一个额外的参数, 用来指定新元素添加的位置.
参数对象中的第一个元素会被添加到这个位置上, 所有其他元素会被添加在它之后, 将函数接受者对象集合中原有的元素移动到后面的位置.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 5, 6)
    numbers.addAll(arrayOf(7, 8))
    println(numbers)
    numbers.addAll(2, setOf(3, 4))
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

也可以使用 in-place 版本的 [`加(plus)` 操作符](collection-plus-minus.md) -
[`加然后赋值(plusAssign)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html)
(`+=`) 来添加元素.
当对可变集合使用 `+=` 操作符时, 会将第二个操作数 (可以是单个元素, 或另一个集合) 添加到集合的末尾.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two")
    numbers += "three"
    println(numbers)
    numbers += listOf("four", "five")    
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 删除元素

要从可变集合中删除元素, 可以使用
[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html)
函数. `remove()` 的参数是元素值, 它会从集合中删除与这个值相等的一个元素.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.remove(3)                    // 删除第一个 `3`
    println(numbers)
    numbers.remove(5)                    // 不会删除任何元素
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果要一次性删除多个元素, 可以使用以下函数:

* [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html)
  函数, 删除参数集合中出现的所有元素.
  或者, 你也用一个判定条件(predicate)为参数来调用这个函数; 这种情况下, 会删除所有使得判定条件计算结果为 `true` 的元素.
* [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html)
  函数, 与 `removeAll()` 相反: 它删除参数集合中出现的元素以外的所有元素.
  如果使用判定条件(predicate)为参数, 会保留满足判定条件的元素, 删除其他元素.
* [`clear()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/clear.html)
  函数, 从 list 中删除所有元素, 使它变成一个空 list.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers)
    numbers.retainAll { it >= 3 }
    println(numbers)
    numbers.clear()
    println(numbers)

    val numbersSet = mutableSetOf("one", "two", "three", "four")
    numbersSet.removeAll(setOf("one", "two"))
    println(numbersSet)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

从集合中删除元素的另一种方法是使用
[`减然后赋值(minusAssign)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html)
(`-=`) 操作符 – 也就是 in-place 版的 [`减(minus)`](collection-plus-minus.md) 操作符.
第二个操作数可以是单个元素, 也可以是另一个集合.
如果第二个操作数是单个元素, `-=` 只从集合中删除 _第一个_ 与它相等的元素.
相应的, 如果第二个操作数是集合, 那么这个集合中的 _所有_ 元素都会被删除.
比如, 如果 list 包含重复的元素, 那么这些重复元素会被全部删除.
第二个操作数可以包含集合中不存在的元素. 这样的元素不会影响操作结果.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "three", "four")
    numbers -= "three"
    println(numbers)
    numbers -= listOf("four", "five")    
    //numbers -= listOf("four")    // 与上面的结果是相同的
    println(numbers)    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 更新元素

list 和 map 还提供了更新元素的操作.
具体的介绍请参见 [List 相关操作](list-operations.md) 和 [Map 相关操作](map-operations.md).
对于 set, 更新操作是无意义的, 因为它实际上等于删除一个旧元素, 然后添加一个新元素.
