[//]: # (title: 迭代器(Iterator))

为了遍历集合中的元素, Kotlin 标准库支持常用的 _迭代器(Iterator)_ 机制 –
迭代器可以用来按顺序访问集合元素, 而不必暴露集合的底层细节.
迭代器适用于逐个处理集合中的所有元素, 比如, 打印所有元素的值, 或者对所有元素进行类似的修改.

对于
[`Iterable<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html)
接口的后代接口, 包括 `Set` 和 `List`, 调用
[`iterator()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/iterator.html)
函数即可得到迭代器.

得到迭代器之后, 它指向集合中的第一个元素; 调用
[`next()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterator/next.html)
函数会返回当前元素, 然后, 如果下一个元素存在的话, 会将迭代器的位置指向下一个元素.

迭代器经过最后一个元素之后, 它就不能再用来获取元素了; 也不能再移动到以前的位置.
如果要再次遍历集合, 必须创建新的迭代器.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val numbersIterator = numbers.iterator()
    while (numbersIterator.hasNext()) {
        println(numbersIterator.next())
        // 输出结果为:
        // one
        // two
        // three
        // four
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

遍历一个 `Iterable` 集合的另一种方法是使用大家都熟悉的 `for` 循环语句.
当在集合上使用 `for` 循环时, 会隐含地得到迭代器.
因此, 下面的示例代码与前面的例子是等价的:

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    for (item in numbers) {
        println(item)
        // 输出结果为
        // one
        // two
        // three
        // four
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

最后, 还有一个方便的 `forEach()` 函数, 可以用来遍历集合, 并对每个元素执行一段指定的代码.
因此, 前面的示例可以写成这样:

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    numbers.forEach {
        println(it)
        // 输出结果为
        // one
        // two
        // three
        // four
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## List 迭代器 {id="list-iterators"}

对于 list, 有一个特别的迭代器实现类:
[`ListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/index.html).
这个迭代器支持在 list 上双方向的遍历: 向前, 以及向后.

反向遍历通过
[`hasPrevious()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/has-previous.html)
和
[`previous()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous.html)
函数实现.
此外, `ListIterator` 还可以通过
[`nextIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/next-index.html)
和
[`previousIndex()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list-iterator/previous-index.html)
函数得到遍历中元素的下标位置.

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val listIterator = numbers.listIterator()
    while (listIterator.hasNext()) listIterator.next()
    println("Iterating backwards:")
    // 反向遍历:
    while (listIterator.hasPrevious()) {
        print("Index: ${listIterator.previousIndex()}")
        println(", value: ${listIterator.previous()}")
        // 输出结果为
        // Index: 3, value: four
        // Index: 2, value: three
        // Index: 1, value: two
        // Index: 0, value: one
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

由于拥有双方向的遍历能力, 因此 `ListIterator` 在到达最后元素之后, 仍然可以继续使用.

## 可变的迭代器 {id="mutable-iterators"}

要在可变的集合上进行遍历, 可以使用
[`MutableIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/index.html),
这个接口继承自 `Iterator`, 添加了元素删除函数
[`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-iterator/remove.html).
因此, 你可以在遍历集合的过程中删除元素.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    val mutableIterator = numbers.iterator()

    mutableIterator.next()
    mutableIterator.remove()
    println("After removal: $numbers")
    // 输出结果为
    // After removal: [two, three, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

对于可变的 list, 可以使用
[`MutableListIterator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/index.html).
除了删除元素之外, 这个迭代器还可以在遍历 list 的过程中,
使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/add.html)
和 [`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list-iterator/set.html) 函数,
添加或替换元素.

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "four", "four")
    val mutableListIterator = numbers.listIterator()

    mutableListIterator.next()
    mutableListIterator.add("two")
    println(numbers)
    // 输出结果为 [one, two, four, four]
    mutableListIterator.next()
    mutableListIterator.set("three")
    println(numbers)
    // 输出结果为 [one, two, three, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
