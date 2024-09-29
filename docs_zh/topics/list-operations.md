[//]: # (title: List 相关操作)

最终更新: %latestDocDate%

[`List`](collections-overview.md#list) 是 Kotlin 内建集合中最常用的类型.
基于下标的元素访问, 为 list 提供了很多功能强大的操作.

## 使用下标获取元素 {id="retrieve-elements-by-index"}

List 支持所有集合共通的元素获取操作: `elementAt()`, `first()`, `last()`,
以及在 [获取集合的单个元素](collection-elements.md) 中介绍的其他操作.
List 独有的功能是使用下标访问元素, 因此读取一个元素的最简单方法是使用下标来访问它.
这个功能通过
[`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)
函数实现, 参数是元素下标, 或者也可以使用更简短的 `[index]` 语法.

如果 list 大小小于指定的下标, 会抛出一个异常.
另外两个其他函数, 可以避免这类异常:

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html)
  允许指定一个函数, 如果下标在集合中不存在, 可以通过这个函数来计算一个默认值.
* [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html)
  返回 `null` 作为下标不存在时的默认值.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.get(0))
    println(numbers[0])
    //numbers.get(5)                         // 发生异常!
    println(numbers.getOrNull(5))             // 返回 null
    println(numbers.getOrElse(5, {it}))        // 返回 5
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 获取 list 的一部分

除了 [获取集合的一部分](collection-parts.md) 中介绍过的共通操作之外, list 还提供了一个
[`subList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/sub-list.html)
函数, 它返回 list 中某个指定的下标范围中的元素构成的视图(view).
因此, 如果原集合中的元素发生变化, 那么在之前创建的子列表中它也会变化, 反过来也是如此.

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.subList(3, 6))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 查找元素位置

### 线性查找(Linear search)

对任何 list, 你可以使用
[`indexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of.html)
和
[`lastIndexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index-of.html)
函数查找一个元素的位置.
这些函数返回 list 中第一个和最后一个与参数相等的元素的位置.
如果不存在匹配的元素, 这两个函数都返回 `-1`.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4, 2, 5)
    println(numbers.indexOf(2))
    println(numbers.lastIndexOf(2))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

还有另一组函数, 接收的参数是一个判定条件, 并查找满足判定条件的元素:

* [`indexOfFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-first.html)
  返回满足判定条件的 *第一个元素的下标*, 如果不存在匹配的元素, 则返回 `-1`.
* [`indexOfLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-last.html)
  返回满足判定条件的 *最后一个元素的下标*, 如果不存在匹配的元素, 则返回 `-1`.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers.indexOfFirst { it > 2})
    println(numbers.indexOfLast { it % 2 == 1})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 在排序的 list 中折半查找(Binary search)

在 list 中查找元素还有另一种方式 –
[折半查找(binary search)](https://en.wikipedia.org/wiki/Binary_search_algorithm).
这种方法的速度要比其他内建函数快很多, 但它 *要求 list 按照升序 [排序](collection-ordering.md)*,
排序方法可以是: 自然顺序, 或通过函数参数指定的其它顺序.
否则, 这个函数的查找结果是不确定的.

要在排序的 list 中查找一个元素, 请使用
[`binarySearch()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/binary-search.html)
函数, 要查找的元素作为参数.
如果这个元素存在, 这个函数返回它的下标;
否则, 它返回 `(-insertionPoint - 1)`,
其中的 `insertionPoint` 是为了保持 list 正确排序, 这个元素应该插入的下标.
如果存在多个元素等于指定的值, 查找结果可能返回其中任何一个的下标.

也可以指定查找的下标范围: 这种情况下, 这个函数只在指定的两个下标之间进行查找.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.sort()
    println(numbers)
    println(numbers.binarySearch("two"))  // 结果是 3
    println(numbers.binarySearch("z")) // 结果是 -5
    println(numbers.binarySearch("two", 0, 2))  // 结果是 -3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### 使用比较器(Comparator)进行折半查找(Binary search)

如果 list 元素不是 `Comparable` 对象, 那么在进行折半查找(Binary search)时, 需要提供一个
[`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator.html).
list 中的元素必须按这个 `Comparator` 比较的结果升序排列. 下面我们来看看示例程序:

```kotlin

data class Product(val name: String, val price: Double)

fun main() {
//sampleStart
    val productList = listOf(
        Product("WebStorm", 49.0),
        Product("AppCode", 99.0),
        Product("DotTrace", 129.0),
        Product("ReSharper", 149.0))

    println(productList.binarySearch(Product("AppCode", 99.0), compareBy<Product> { it.price }.thenBy { it.name }))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

这里我们有一个 `Product` 的 list, 其中的 `Product` 对象不是 `Comparable`,
然后我们通过一个 `Comparator` 定义了它们的排序方式:
如果 `p1` 的价格低于 `p2`, 则产品 `p1` 排在 `p2` 之前.
因此, 首先让 list 按照这个规则升序排列, 然后我们使用 `binarySearch()` 来查找指定的 `Product` 的下标.

如果 list 中的元素是 `Comparable` 对象, 但不使用其自然顺序,
比如, 对 `String` 不区分大小写排序的情况, 这时自定义的比较器也是很方便的.

```kotlin

fun main() {
//sampleStart
    val colors = listOf("Blue", "green", "ORANGE", "Red", "yellow")
    println(colors.binarySearch("RED", String.CASE_INSENSITIVE_ORDER)) // 结果是 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### 使用比较(Comparison)函数进行折半查找(Binary search)

进行折半查找(Binary search)时, 使用 _比较(Comparison)_ 函数, 不必指定确切的查找值即可查找元素.
这种查找方法不需要具体的元素值, 而是接受一个比较函数, 比较函数负责将元素变换为 `Int` 值, 然后查找变换结果为 0 的元素.
list 必须按照比较函数规定的升序排序; 也就是说, list 中各个元素传递给比较函数之后的返回值必须是递增的.

```kotlin

import kotlin.math.sign
//sampleStart
data class Product(val name: String, val price: Double)

fun priceComparison(product: Product, price: Double) = sign(product.price - price).toInt()

fun main() {
    val productList = listOf(
        Product("WebStorm", 49.0),
        Product("AppCode", 99.0),
        Product("DotTrace", 129.0),
        Product("ReSharper", 149.0))

    println(productList.binarySearch { priceComparison(it, 99.0) })
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

使用比较器(Comparator)和比较(Comparison)函数的折半查找, 也同样可以针对 list 的下标范围进行查找.

## List 的写入操作 {id="list-write-operations"}

除了 [集合写入操作](collection-write.md) 中介绍的集合共通的写操作之外,
[可变(mutable)](collections-overview.md#collection-types) list 还支持 list 独有的写操作.
这类操作使用下标访问元素的方式进行, 增加了 list 的修改能力.

### 添加元素

要将元素添加到 list 的指定位置, 可以使用
[`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html)
和
[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html)
函数, 通过参数指定元素插入的位置.
这个位置之后的所有既有元素, 都会向右移动.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "five", "six")
    numbers.add(1, "two")
    numbers.addAll(2, listOf("three", "four"))
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 更新元素

List 还提供了函数, 可以替换指定位置的元素 -
[`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/set.html)
函数, 以及相应的操作符 `[]`. `set()` 函数不会改变其他任何元素的下标.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "five", "three")
    numbers[1] =  "two"
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html)
函数会将集合的所有元素简单地替换为指定的值.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.fill(3)
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 删除元素

要从 list 的指定位置删除元素, 可以使用
[`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html)
函数, 参数是元素位置.
在这个被删除元素之后的所有其他既有元素, 下标会减少 1.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.removeAt(1)
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 排序(Sorting) {id="sort"}

在 [集合排序(Ordering)](collection-ordering.md) 中, 我们介绍了按照指定顺序获取集合元素的操作.
对于可变的 list, 标准库提供了类似的扩展函数, 对 list 原地(in place)执行相同的操作.
如果对一个 list 执行这类操作, 它会改变这个 list 实例中的元素顺序.

原地(in place)排序函数的名称与只读 list 的排序函数类似, 但没有 `ed/d` 后缀:

* 所有排序函数中的 `sorted*` 变为 `sort*`:
  [`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html),
  [`sortDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-descending.html),
  [`sortBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-by.html),
  等等.
* `shuffled()` 变为
  [`shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html).
* `reversed()` 变为
  [`reverse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reverse.html).

对可变 list 调用
[`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html)
会返回另一个可变 list, 它是原 list 的一个反序视图(reversed view). 在这个视图中的变更会反映到原 list 中.
下面是可变 list 排序函数的示例:

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")

    numbers.sort()
    println("Sort into ascending: $numbers")
    numbers.sortDescending()
    println("Sort into descending: $numbers")

    numbers.sortBy { it.length }
    println("Sort into ascending by length: $numbers")
    numbers.sortByDescending { it.last() }
    println("Sort into descending by the last letter: $numbers")

    numbers.sortWith(compareBy<String> { it.length }.thenBy { it })
    println("Sort by Comparator: $numbers")

    numbers.shuffle()
    println("Shuffle: $numbers")

    numbers.reverse()
    println("Reverse: $numbers")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
