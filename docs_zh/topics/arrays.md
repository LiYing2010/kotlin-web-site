[//]: # (title: 数组)
[//]: # (description: 学习在 Kotlin 中如何创建, 访问, 修改, 比较数组, 以及将数组转换为集合.)

数组是一种数据结构, 包含固定数量的值, 值都是相同类型, 或者是它的子类型.
数组元素按顺序排列, 通过下标访问.

Kotlin 提供了 [`Array<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/) 类, 和 [基本类型数组](#primitive-type-arrays).

## 什么时候使用数组 {id="when-to-use-arrays"}

当你需要与 Java API 互操作, 或满足底层需求时, 请使用数组.
例如, 当性能要求超出普通应用程序的需要时, 或者需要构建自定义数据结构时.

对于大多数使用场景, 请优先使用 [集合](collections-overview.md).

| 功能                       | 数组                                                                                                                                      | 集合                                       |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| 大小                       | 固定                                                                                                                                      | 取决于类型                                 |
| 只读形式                   | 没有, 始终可修改                                                                                                                          | 有 (`List` 和 `Set`)                       |
| 添加和删除元素             | 不直接支持.<br/>需要分配并复制到新数组                                                                                                    | 支持 (可变集合)                            |
| 使用 `==` 进行结构相等判断 | 不支持, 只比较引用.<br/>请使用 [`.contentEquals()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/content-equals.html) | 支持                                       |
| 基本类型值                 | 基本类型数组可以存储值, 不装箱                                                                                                            | 通常会装箱                                 |
| Java 互操作性              | 映射为 `T[]`                                                                                                                              | 映射为 `java.util.List` 和 `java.util.Set` |
| 函数式过滤和变换操作       | 支持的操作有限                                                                                                                            | 支持的操作丰富                             |

了解如何 [将数组转换为集合](#convert-to-collections).

## 创建数组 {id="create-arrays"}

要创建数组, 可以选择使用:

* [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html),
  [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)),
  或 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html) 函数.
* `Array` 构造器.

> 将数组声明为 `val`, 只能防止变量被重新赋值, 不会让数组内容变为只读.
> 无论用 `val` 还是 `var` 声明, 数组元素都是可修改的. 两者的区别只影响数组引用, 不影响内容.
> 如果需要只读视图, 请改为使用 [集合](collections-overview.md).
>
{style="note"}

### 创建包含元素值的数组 {id="array-with-values"}

要使用一组已知的值创建指定类型的数组, 请使用 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html) 函数.
Kotlin 会自动推断类型:

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3) // 类型为 Array<Int>
    println(simpleArray.joinToString())
    // 输出结果为: 1, 2, 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-simple-array-kotlin"}

### 创建空数组 {id="empty-array"}

要创建没有元素的数组, 请使用 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html) 函数.
可以在赋值语句的左侧或右侧指定元素类型:

```kotlin
val emptyArrayRight = emptyArray<String>()
val emptyArrayLeft: Array<String> = emptyArray()
```

了解如何 [向数组添加元素](#add-and-remove-elements).

### 创建 null 值的数组 {id="array-with-nulls"}

要创建指定大小且由 `null` 元素填充的数组, 请使用 [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int)) 函数:

```kotlin
fun main() {
//sampleStart
    val nullArray: Array<Int?> = arrayOfNulls(3)
    println(nullArray.joinToString())
    // 输出结果为: null, null, null
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-null-array-kotlin"}

### 使用 Array 构造器 {id="array-constructor"}

`Array` 构造器接收的参数是, 数组大小, 以及一个函数, 这个函数返回数组元素值:

```kotlin
fun main() {
//sampleStart
    val zeroes = Array<Int>(3) { 0 }
    println(zeroes.joinToString())
    // 输出结果为: 0, 0, 0

    val squares = Array(5) { i -> i * i }
    println(squares.joinToString())
    // 输出结果为: 0, 1, 4, 9, 16
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-array-constructor-kotlin"}

### 创建嵌套数组 {id="nested-arrays"}

要创建嵌套数组, 或者叫多维数组, 请使用数组的数组.
嵌套数组不需要具有相同的类型, 或相同的大小.

```kotlin
fun main() {
//sampleStart
    // 创建一个 2 维数组
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }
    println(twoDArray.contentDeepToString())
    // 输出结果为: [[0, 0], [0, 0]]

    // 创建一个 3 维数组
    val threeDArray = Array(3) { Array(3) { Array<Int>(3) { 0 } } }
    println(threeDArray.contentDeepToString())
    // 输出结果为: [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-multidimensional-array-kotlin"}

### 创建基本类型数组 {id="primitive-type-arrays"}

如果使用 `Array` 类存储基本类型的值, 编译器会将这些值装箱为对象.
为了避免装箱的开销, 可以使用专门的基本类型数组.
它们不是 [`Array<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/) 类的子类, 但提供类似的函数和属性.

| Kotlin 类型                                                                           | 等同的 Java 类型 |
|---------------------------------------------------------------------------------------|------------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`      |
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)       | `byte[]`         |
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/)       | `char[]`         |
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/)   | `double[]`       |
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/)     | `float[]`        |
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/)         | `int[]`          |
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/)       | `long[]`         |
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/)     | `short[]`        |

> Kotlin 没有专门的 `StringArray` 类型.
> `String` 不是基本类型, 因此请使用 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html)
> 或 `arrayOf<String>()` 函数, 并让编译器推断类型.
>
{style="note"}

要创建基本类型数组, 可以选择使用以下方式之一:

* 构造函数:

  ```kotlin
  fun main() {
  //sampleStart
      // 创建大小为 5 的 Int 数组, 元素初始值为 0
      val primitiveTypeArray = IntArray(5)
      println(primitiveTypeArray.joinToString())
      // 输出结果为: 0, 0, 0, 0, 0

      // 创建 Int 数组, 并提供初始化函数
      val squares = IntArray(5) { i -> i * i }
      println(squares.joinToString())
      // 输出结果为: 0, 1, 4, 9, 16
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-primitive-type-array-kotlin"}

* 工厂函数:

  ```kotlin
  fun main() {
  //sampleStart
      // 创建包含 5 个元素的 Int 数组
      val numbers = intArrayOf(1, 2, 3, 4, 5)
      println(numbers.joinToString())
      // 输出结果为: 1, 2, 3, 4, 5

      // 创建包含 3 个元素的 Char 数组
      val characters = charArrayOf('K', 't', 'l')
      println(characters.joinToString())
      // 输出结果为: K, t, l

      // 创建包含 3 个元素的 Double 数组
      val doubles = doubleArrayOf(0.22, 4.16, 0.5)
      println(doubles.joinToString())
      // 输出结果为: 0.22, 4.16, 0.5
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 要将基本类型数组转换为对象类型数组, 请使用 [`.toTypedArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-typed-array.html) 函数.
>
> 要将对象类型数组转换为基本类型数组, 请使用 [`.toBooleanArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-boolean-array.html),
> [`.toByteArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-byte-array.html),
> [`.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-char-array.html), 等函数.
>
{style="note"}

## 使用数组 {id="work-with-arrays"}

数组支持很多与集合相同的操作, 包括遍历, 搜索, 排序, 以及变换.
在 Kotlin 中, 你可以使用数组向函数传递不定数量的参数, 或对数组本身执行操作.
下表列出了最常用的属性和函数:

| 成员                                                                                                                                                                                                  | 返回值                                   |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------|
| [`size`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-array/size.html)                                                                                                                       | 元素数量                                 |
| [`indices`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/indices.html)                                                                                                            | 有效的下标范围                           |
| [`lastIndex`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/last-index.html)                                                                                                       | 最后一个有效下标                         |
| [`first()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first.html) 和 [`last()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/last.html)                    | 第一个和最后一个元素                     |
| [`isEmpty()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/is-empty.html) 和 [`isNotEmpty()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/is-not-empty.html) | 数组为空返回 `true`, 或非空时返回 `true` |
| [`contains()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/contains.html)                                                                                                        | 数组包含该元素时返回 `true`              |

> 关于数组的属性和函数, 详情请参见 [API 参考文档](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-array/).
>
{style="tip"}

本节介绍一些最常用的操作.

### 访问和修改元素 {id="access-and-modify-elements"}

要访问和修改数组中的元素, 请使用 [下标访问操作符](operator-overloading.md#indexed-access-operator) (`[]`):

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }

    // 访问并修改元素
    simpleArray[0] = 10
    twoDArray[0][0] = 2

    // 输出修改后的元素
    println(simpleArray[0])
    // 输出结果为: 10
    println(twoDArray[0][0])
    // 输出结果为: 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-access-array-kotlin"}

> 如果试图访问数组范围之外的下标, Kotlin 会在运行时抛出 `ArrayIndexOutOfBoundsException`.
>
{style="note"}

还可以使用 [`fill(element, fromIndex, toIndex)`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/fill.html) 函数,
就地替换指定范围内的元素. `fromIndex` 包含在范围内, `toIndex` 不包含在范围内:

```kotlin
fun main() {
//sampleStart
    val arr = IntArray(3)
    println(arr.joinToString())
    // 输出结果为: 0, 0, 0

    arr.fill(1)
    println(arr.joinToString())
    // 输出结果为: 1, 1, 1

    arr.fill(0, 0, 2)
    println(arr.joinToString())
    // 输出结果为: 0, 0, 1
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

在 Kotlin 中, 数组是 _类型不可变的(Invariant)_.
也就是说, `Array<String>` 不是 `Array<Any>` 的子类型. 这种机制可以防止潜在的运行时类型错误.
要表示协变(Covariance), 请使用 `Array<out Any>` [类型投影](generics.md#type-projections):

```kotlin
fun main() {
//sampleStart
    fun printArr(arr: Array<out Any>) {
        for (item in arr) print("$item, ")
    }

    printArr(arrayOf("k", "t", "n"))
    // 输出结果为: k, t, n,
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 添加和删除元素 {id="add-and-remove-elements"}

由于数组大小是固定的, 因此不支持 `.add()` 和 `.remove()` 函数. 要进行这样的操作, 需要创建新数组.
可以选择使用以下方式之一:

* 使用 [`.copyOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/copy-of.html) 函数:

  ```kotlin
  fun main() {
  //sampleStart
      var arr = intArrayOf(0, 1, 2)

      arr = arr.copyOf(arr.size + 1)
      println(arr.joinToString())
      // 输出结果为: 0, 1, 2, 0

      arr[arr.lastIndex] = 3
      println(arr.joinToString())
      // 输出结果为: 0, 1, 2, 3
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

* 使用 `+` 或 `+=` 操作符:

  ```kotlin
  fun main() {
  //sampleStart
      var arr = intArrayOf(0, 1, 2)

      arr += 3
      println(arr.joinToString())
      // 输出结果为: 0, 1, 2, 3

      arr = arr + intArrayOf(4, 5)
      println(arr.joinToString())
      // 输出结果为: 0, 1, 2, 3, 4, 5
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 如果需要频繁的添加或删除元素, 请改为使用 [可变集合](collections-overview.md#collection-types).
>
{style="tip"}

### 比较数组 {id="compare-arrays"}

要比较两个数组是否包含相同的元素, 并且顺序也相同, 请使用 [`.contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html)
和 [`.contentDeepEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-deep-equals.html)
函数:

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)
    val anotherArray = arrayOf(1, 2, 3)

    // 比较数组内容
    println(simpleArray.contentEquals(anotherArray))
    // 输出结果为: true

    // 使用中缀标记法, 在元素发生变化后再次比较数组内容
    simpleArray[0] = 10
    println(simpleArray contentEquals anotherArray)
    // 输出结果为: false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-compare-array-kotlin"}

> 不要使用相等 (`==`) 和不等 (`!=`) [操作符](equality.md#structural-equality) 来比较数组内容.
> 这些操作符会检查赋值的变量是否指向相同的对象.
>
> 关于 Kotlin 中数组的行为为什么会如此, 详情请参见 [这篇 blog](https://blog.jetbrains.com/kotlin/2015/09/feedback-request-limitations-on-data-classes/#Appendix.Comparingarrays).
>
{style="warning"}

### 变换数组 {id="transform-arrays"}

Kotlin 有很多有用的函数, 可以对数组进行变换. 本节重点介绍其中几个函数.
关于所有函数的完整列表, 请参见我们的 [API 参考文档](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/).

#### 求和 {id="sum"}

要得到一个数组中所有元素的和, 请使用 [`.sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html)
函数:

```kotlin
fun main() {
//sampleStart
    val sumArray = arrayOf(1, 2, 3)
    println(sumArray.sum())
    // 输出结果为: 6
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-sum-array-kotlin"}

> `.sum()` 函数只能用于 [数值类型](numbers.md) 的数组, 例如 `Int`.
>
{style="note"}

#### 排序和随机打乱 {id="sort-and-shuffle"}

可以使用 [`.sort()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sort.html) 函数, 对数组元素按自然顺序排序,
或使用 [`.shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) 函数, 随机打乱元素:

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)

    // 随机打乱元素
    simpleArray.shuffle()
    println(simpleArray.joinToString())

    // 排序元素
    simpleArray.sort()
    println(simpleArray.joinToString())
    // 输出结果为: 1, 2, 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-shuffle-array-kotlin"}

要在不修改原始数组的情况下获得排序后的新数组, 请改用 [`.sortedArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sorted-array.html) 函数.

### 向函数传递不定数量的参数 {id="pass-variable-number-of-arguments-to-a-function"}

在 Kotlin 中, 可以通过 [`vararg`](functions.md#variable-number-of-arguments-varargs) 参数, 向函数传递不定数量的参数.
当你无法预先确定参数数量时, 例如格式化消息时, 或创建 SQL 查询时, 这个功能很有用.

要将包含不定数量参数的数组传递给函数, 请使用 _展开操作符_ (`*`).
展开操作符将数组中的每个元素作为单独的参数传给函数:

```kotlin
fun main() {
    val lettersArray = arrayOf("c", "d")
    printAllStrings("a", "b", *lettersArray)
    // 输出结果为: abcd
}

fun printAllStrings(vararg strings: String) {
    for (string in strings) {
        print(string)
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-vararg-array-kotlin"}

详情请参见 [不定数量参数(varargs)](functions.md#variable-number-of-arguments-varargs).

## 转换为集合 {id="convert-to-collections"}

如果需要使用不同的 API, 其中一些使用数组, 另一些使用集合, 可以在数组和集合之间转换.
要进行转换, 请使用 [`.toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html),
[`.toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html),
以及 [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html) 函数.
这些函数会将数组内容复制到独立的集合中. 数组的后续变化不会反映到集合中.

### 转换为 List 或 Set {id="convert-to-list-or-set"}

要将数组转换为 `List` 或 `Set`, 请使用 [`.toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html)
和 [`.toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 函数:

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf("a", "b", "c", "c")

    // 转换为 Set
    println(simpleArray.toSet())
    // 输出结果为: [a, b, c]

    // 转换为 List
    println(simpleArray.toList())
    // 输出结果为: [a, b, c, c]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-convert-list-set-kotlin"}

除非完全确定原始数组不会被修改, 也不会在其他地方共用,
否则不要使用 [`.asList()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/as-list.html) 和相关的 `as*` 函数.
这些函数会包装原始数组, 而不是复制数组. 因此, 数组的变化会反映到列表中, 反过来也是如此.

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf("a", "b", "c")

    val list = simpleArray.asList()
    simpleArray[0] = "d"
    println(list)
    // 输出结果为: [d, b, c]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 转换为 Map {id="convert-to-map"}

要将数组转换为 `Map`, 请使用 [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html) 函数.

只有元素类型为 [`Pair<K,V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) 的数组, 才能转换为 `Map`.
`Pair` 实例的第 1 个值成为键, 第 2 个值成为值.
如果同一个键出现多次, 将使用最后一个值.

下面的示例使用 [中缀标记法](functions.md#infix-notation) 调用 [`.to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html) 函数,
创建 `Pair`:

```kotlin
fun main() {
//sampleStart
    val pairArray = arrayOf("apple" to 120, "banana" to 150, "cherry" to 90, "apple" to 140)

    // 转换为 Map
    // 水果是键, 卡路里数值是值
    // 最后一个 "apple" 的值会覆盖第一个
    println(pairArray.toMap())
    // 输出结果为: {apple=140, banana=150, cherry=90}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-convert-map-kotlin"}

## 下一步做什么? {id="what-s-next"}

* 为什么对大多数使用场景我们推荐使用集合, 请阅读我们的 [集合概述](collections-overview.md).
* 学习其他 [基本类型](types-overview.md).
* 如果你是 Java 开发者, 请阅读我们的 [Java 到 Kotlin 迁移向导, 关于集合的部分](java-to-kotlin-collections-guide.md).
