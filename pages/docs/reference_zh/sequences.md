---
type: doc
layout: reference
category: "集合"
title: "序列(Sequence)"
---

# 序列(Sequence)

最终更新: {{ site.data.releases.latestDocDate }}

除集合之外, Kotlin 还提供了另一种容器类型 – _序列(sequence)_
([`Sequence<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence/index.html)).
序列提供的函数和
[`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html)
一样, 但对多步骤的集合处理提供另一种实现方式.

当对 `Iterable` 的处理包含多个步骤时, 会以及早计算(eager)模式执行:
每个处理步骤都会执行完毕, 并返回它的结果 – 也就是一个中间集合.
然后再对这个中间集合执行下一个步骤.
与此不同, 对序列的多步骤处理会尽量以延迟计算(lazy)模式执行:
只有在整个处理链的结果真正被使用到时, 才会执行相应的计算处理.

操作的执行顺序也不同: `Sequence` 对每个元素执行所有的处理步骤.
而 `Iterable` 会对整个集合执行单个处理步骤, 然后再对结果集合执行下一个处理步骤.

通过这种方式, 序列可以避免生成各个处理步骤的中间结果, 因此能够提高集合多步骤处理的整体性能.
然而, 序列的延迟计算(lazy)模式会增加一些开销, 在处理小集合, 或进行简单计算时, 这些开销可能会比较显著.
因此, 应该同时考虑使用 `Sequence` 和 `Iterable`, 根据你的具体情况决定哪一个比较好.

## 创建序列

### 通过指定的元素创建

要创建序列, 可以使用
[`sequenceOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence-of.html)
函数, 通过函数参数指定序列中的元素.

```kotlin
val numbersSequence = sequenceOf("four", "three", "two", "one")
```

### 通过 Iterable 创建

如果你已经有了一个 `Iterable` 对象 (比如 `List` 或 `Set`), 你可以调用它的
[`asSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-sequence.html).
函数来创建序列.

```kotlin
val numbers = listOf("one", "two", "three", "four")
val numbersSequence = numbers.asSequence()

```

### 通过函数创建

创建序列的另一种方式是, 通过一个函数来计算序列中的元素.
调用
[`generateSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/generate-sequence.html)
函数, 把序列元素的计算函数作为它的参数, 这样就可以通过函数来创建序列.
这个函数有一个可选的参数, 你可以明确指定第一个元素的值, 也可以指定一个函数来计算第一个元素的值.
当序列元素的计算函数返回 `null` 时, 序列的生成过程会停止.
所以, 下面示例中的序列是无限的.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val oddNumbers = generateSequence(1) { it + 2 } // `it` 是前一个元素
    println(oddNumbers.take(5).toList())
    //println(oddNumbers.count())     // 这里会发生运行时错误: 序列是无限的
//sampleEnd
}
```
</div>

如果想要使用 `generateSequence()` 函数创建有限的序列, 那么你的序列元素的计算函数应该在生成最后一个元素之后返回 `null`.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val oddNumbersLessThan10 = generateSequence(1) { if (it < 8) it + 2 else null }
    println(oddNumbersLessThan10.count())
//sampleEnd
}
```
</div>

### 通过数据块(chunk)创建

最后, 还有
[`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html)
函数, 可以逐个生成序列元素, 或者通过任意大小的数据块来生成元素.
这个函数的参数是一个 lambda 表达式, 其中包括对
[`yield()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield.html)
函数和
[`yieldAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield-all.html)
函数的调用.
这些函数会将元素返回给序列的使用者, 然后暂停 `sequence()` 函数的执行, 直到序列使用者请求下一个元素.
`yield()` 的参数是单个元素; `yieldAll()` 的参数可以是一个 `Iterable` 对象, 或一个 `Iterator`, 或另一个 `Sequence`. `yieldAll()` 函数的 `Sequence` 参数可以是无限的.
但是, 这样的调用必须出现在序列的最末尾: 否则, 在这之后的所有序列元素都不会被执行到.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val oddNumbers = sequence {
        yield(1)
        yieldAll(listOf(3, 5))
        yieldAll(generateSequence(7) { it + 2 })
    }
    println(oddNumbers.take(5).toList())
//sampleEnd
}
```
</div>

## 序列的操作

根据对数据状态的要求不同, 序列的操作可以分为以下两类:

* _无状态(Stateless)_ 操作, 不需要保存状态信息, 对每个元素的处理都是独立的,
  比如, [`map()`](collection-transformations.html#map) 或 [`filter()`](collection-filtering.html).
  无状态操作本身可以使用固定数量的少量状态数据来处理一个元素,
  比如, [`take()` 或 `drop()`](collection-parts.html).
* _有状态(Stateful)_ 操作, 需要大量的状态信息, 通常正比于序列内的元素数量.

如果序列的一个操作返回另一个序列, 结果序列的内容是延迟计算的, 我们称这个操作为 _中间(intermediate)_ 操作.
相反, 如果一个操作不返回新的序列, 那么称为 _终止(terminal)_ 操作.
终止操作的例子, 比如 [`toList()`](constructing-collections.html#copy) 或 [`sum()`](collection-aggregate.html).
只有执行终止操作后, 才能取得序列中的元素.

序列元素可以多次遍历; 序列的某些实现类可能造成限制, 使得它只能遍历一次. 这样的限制会在这些序列的文档中明确说明.

## 序列处理的例子

下面我们通过一个例子来看看 `Iterable` 和 `Sequence` 区别.

### 使用 `Iterable`

假设你有很多单词. 下面的代码会过滤长度超过 3 个字母的单词, 然后打印前 4 个这种单词的长度.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {    
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    val lengthsList = words.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars:")
    println(lengthsList)
//sampleEnd
}
```
</div>

运行这段代码时, 你可以看到 `filter()` 和 `map()` 函数的执行顺序与它们在代码中出现的顺序相同.
首先, 你会看到对所有元素输出 `filter:`, 然后对过滤之后剩余的元素输出 `length:`, 然后是最后两行代码的输出.

下图是 list 各处理步骤的具体执行过程:

![List processing]({{ url_for('asset', path='docs/images/reference/sequences/list-processing.png') }})

### 使用序列

下面我们用序列来实现同样的处理:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin

fun main() {
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    // 将 List 转换为序列
    val wordsSequence = words.asSequence()

    val lengthsSequence = wordsSequence.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars")
    // 终止操作: 以 List 形式获取结果
    println(lengthsSequence.toList())
//sampleEnd
}
```
</div>

这段代码的输出显示, `filter()` 和 `map()` 函数在创建最终的结果 list 时才被执行.
因此, 你首先看到的输出是 `"Lengths of.."`, 然后序列的处理才会开始.
注意, 对于过滤之后剩余的元素, 会在过滤下一个元素之前执行 map 操作.
当结果的元素数量到达 4 时, 处理将会停止, 因为这是 `take(4)` 能够返回的最大元素数量.

序列的处理过程如下:

![Sequences processing]({{ url_for('asset', path='docs/images/reference/sequences/sequence-processing.png') }})

在这个示例中, 序列处理执行了 18 步, 而使用 list 时则需要 23 步.
