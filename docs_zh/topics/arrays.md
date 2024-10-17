[//]: # (title: 数组)

数组是一种数据结构, 其中包含固定数量的值, 所有的值为同一个类型, 或这个类型的子类型.
Kotlin 中最常见的数组类型是对象类型的数组, 使用 [`Array`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/) 类表达.

> 如果你在对象类型的数组中使用基本类型(Primitive Type), 会造成性能损失, 因为你的基本类型会被 [装箱](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html)
> 为对象. 要避免这种装箱造成的性能损失, 请使用 [基本类型数组](#primitive-type-arrays).
>
{style="note"}

## 什么时候使用数组

当你需要满足某些特殊的低层级要求时, 可以在 Kotlin 中使用数组.
例如, 如果你的性能需求超过了通常的应用程序的需求, 或者需要构建自定义数据结构的情况.
如果你没有这种类型的限制, 请使用 [集合(Collection)](collections-overview.md).

集合与数组相比, 有以下优点:
* 集合是只读的, 因此给了你更多的控制权, 使你能够编写意图清晰的, 更加健壮的代码.
* 更容易对集合添加或删除元素. 与此相反, 数组的大小是固定的.
  要对数组添加或删除元素, 只能每次创建新的数组, 这是非常效率低下的:

  ```kotlin
  fun main() {
  //sampleStart
      var riversArray = arrayOf("Nile", "Amazon", "Yangtze")

      // 使用 += 赋值操作创建新的 riversArray,
      // 复制原来的元素, 并添加 "Mississippi"
      riversArray += "Mississippi"
      println(riversArray.joinToString())
      // 输出结果为 Nile, Amazon, Yangtze, Mississippi
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-rivers-array-kotlin"}

* 你可以使用相等操作符(`==`) 来检查两个集合是否结构相等(Structurally Equal). 但不能对数组使用这个操作符.
  相反, 你需要使用特殊的函数, 详情请参见 [比较数组](#compare-arrays).

关于集合, 详情请参见 [集合概述](collections-overview.md).

## 创建数组

在 Kotlin 中要创建数组, 你可以使用:
* 函数, 例如 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html), [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int))
  或 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html).
* `Array` 构造器.

下面的示例使用 [`arrayOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of.html) 函数, 并将数组元素的值传递给它:

```kotlin
fun main() {
//sampleStart
    // 使用元素值 [1, 2, 3] 创建数组
    val simpleArray = arrayOf(1, 2, 3)
    println(simpleArray.joinToString())
    // 输出结果为 1, 2, 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-simple-array-kotlin"}

下面的示例使用 [`arrayOfNulls()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/array-of-nulls.html#kotlin$arrayOfNulls(kotlin.Int))
函数创建指定大小的数组, 并使用 `null` 元素填充数组:

```kotlin
fun main() {
//sampleStart
    // 使用元素值 [null, null, null] 创建数组
    val nullArray: Array<Int?> = arrayOfNulls(3)
    println(nullArray.joinToString())
    // 输出结果为 null, null, null
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-null-array-kotlin"}

下面的示例使用 [`emptyArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/empty-array.html) 函数创建空数组:

```kotlin
    var exampleArray = emptyArray<String>()
```

> 由于 Kotlin 的类型推断功能, 在赋值语句的左侧或右侧都可以指定空数组的类型.
>
> 例如:
> ```kotlin
> var exampleArray = emptyArray<String>()
>
> var exampleArray: Array<String> = emptyArray()
>```
>
{style="note"}

`Array` 构造器的参数是, 数组大小, 以及一个函数, 这个函数对指定的数组下标返回对应的元素值:

```kotlin
fun main() {
//sampleStart
    // 创建一个 Array<Int>, 初始化为 0 值: [0, 0, 0]
    val initArray = Array<Int>(3) { 0 }
    println(initArray.joinToString())
    // 输出结果为 0, 0, 0

    // 创建一个 Array<String>, 初始化为 ["0", "1", "4", "9", "16"]
    val asc = Array(5) { i -> (i * i).toString() }
    asc.forEach { print(it) }
    // 输出结果为 014916
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-array-constructor-kotlin"}

> 与大多数编程语言一样, 在 Kotlin 中, 数组下标从 0 开始.
>
{style="note"}

### 嵌套的数组

数组可以相互嵌套, 创建多维数组:

```kotlin
fun main() {
//sampleStart
    // 创建一个 2 维数组
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }
    println(twoDArray.contentDeepToString())
    // 输出结果为 [[0, 0], [0, 0]]

    // 创建一个 3 维数组
    val threeDArray = Array(3) { Array(3) { Array<Int>(3) { 0 } } }
    println(threeDArray.contentDeepToString())
    // 输出结果为 [[[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 0, 0], [0, 0, 0]]]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-multidimensional-array-kotlin"}

> 嵌套的数组不需要类型相同, 也不需要大小相同.
>
{style="note"}

## 访问和修改元素

数组永远是可以修改的. 要访问和修改数组中的元素, 请使用 [下标访问操作符](operator-overloading.md#indexed-access-operator)`[]`:

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)
    val twoDArray = Array(2) { Array<Int>(2) { 0 } }

    // 访问并修改元素
    simpleArray[0] = 10
    twoDArray[0][0] = 2

    // 输出修改后的元素
    println(simpleArray[0].toString()) // 输出结果为 10
    println(twoDArray[0][0].toString()) // 输出结果为 2
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-access-array-kotlin"}

Kotlin 中的数组是 _不可变的(invariant)_. 这意味着 Kotlin 不允许你将一个 `Array<String>` 赋值给一个 `Array<Any>`, 以防止发生运行时错误.
相反, 你可以使用 `Array<out Any>`. 更多详情请参见, [类型投射](generics.md#type-projections).

## 使用数组

在 Kotlin 中, 你可以使用数组, 向一个函数传递不定数量的参数, 或对数组元素本身执行操作.
例如, 比较数组, 变换数组内容, 或转换为集合.

### 向一个函数传递不定数量的参数

在 Kotlin 中, 你可以通过 [`vararg`](functions.md#variable-number-of-arguments-varargs) 参数, 向一个函数传递不定数量的参数.
如果你不能预先知道参数的数量, 这个功能是很有用的, 例如格式化消息, 或者创建 SQL 查询的情况.

要向一个函数传递一个数组, 其中包含不定数量的参数, 请使用 _展开(spread)_ 操作符 (`*`).
展开操作符会将数组的每个元素作为独立的参数传递给指定的函数:

```kotlin
fun main() {
    val lettersArray = arrayOf("c", "d")
    printAllStrings("a", "b", *lettersArray)
    // 输出结果为 abcd
}

fun printAllStrings(vararg strings: String) {
    for (string in strings) {
        print(string)
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-vararg-array-kotlin"}

更多详情请参见 [不定数量参数(varargs)](functions.md#variable-number-of-arguments-varargs).

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
    // 输出结果为 true

    // 使用中缀标记法(Infix notation), 在一个元素发生变化之后, 再次比较数组内容
    simpleArray[0] = 10
    println(simpleArray contentEquals anotherArray)
    // 输出结果为 false
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

### 变换数组

Kotlin 有很多有用的函数, 可以对数组进行变换.
这篇文档重点介绍少数几个函数, 但并不是完整的功能列表.
关于所有函数的完整列表, 请参见我们的 [API 参考文档](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/).

#### 求和

要得到一个数组中所有元素的和, 请使用 [`.sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html)
函数:

```kotlin
fun main() {
//sampleStart
    val sumArray = arrayOf(1, 2, 3)

    // 对数组元素求和
    println(sumArray.sum())
    // 输出结果为 6
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-sum-array-kotlin"}

> `.sum()` 函数只能用于 [数值类型](numbers.md) 的数组, 例如 `Int`.
>
{style="note"}

#### 随机打乱

要随机打乱数组中的元素, 请使用 [`.shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html)
函数:

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf(1, 2, 3)

    // 随机打乱元素 [3, 2, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())

    // 再次随机打乱元素 [2, 3, 1]
    simpleArray.shuffle()
    println(simpleArray.joinToString())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-shuffle-array-kotlin"}

### 将数组转换为集合

如果你同时使用不同的 API, 其中一些使用数组, 另一些使用集合, 那么你可以将数组转换为 [集合](collections-overview.md),
也可以反过来将集合转换为数组.

#### 转换为 List 或 Set

要将数组转换为 `List` 或 `Set`, 请使用 [`.toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html)
和 [`.toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 函数.

```kotlin
fun main() {
//sampleStart
    val simpleArray = arrayOf("a", "b", "c", "c")

    // 转换为 Set
    println(simpleArray.toSet())
    // 输出结果为 [a, b, c]

    // 转换为 List
    println(simpleArray.toList())
    // 输出结果为 [a, b, c, c]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-convert-list-set-kotlin"}

#### 转换为 Map

要将数组转换为 `Map`, 请使用 [`.toMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-map.html)
函数.

只有元素类型为 [`Pair<K,V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) 的数组能够转换为 `Map`.
`Pair` 实例的第 1 个值成为键(key), 第 2 个值成为值(value).
下面的示例使用 [中缀标记法(Infix notation)](functions.md#infix-notation)
来调用 [`to`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to.html) 函数, 创建 `Pair` 的元祖:

```kotlin
fun main() {
//sampleStart
    val pairArray = arrayOf("apple" to 120, "banana" to 150, "cherry" to 90, "apple" to 140)

    // 转换为 Map
    // 键(key)是水果, 值(value)是它们的卡路里数量
    // 注意, 键必须是唯一的, 因此最后一个 "apple" 的值会覆盖第一个的值
    println(pairArray.toMap())
    // 输出结果为 {apple=140, banana=150, cherry=90}

//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-convert-map-kotlin"}

## 基本类型(Primitive Type)数组 {id="primitive-type-arrays"}

如果你使用 `Array` 类来存储基本类型(Primitive Type), 这些元素值会被装箱为对象.
另一种选择是, 你可以使用基本类型数组, 它可以让你在数组中存储基本类型, 而不会发生装箱操作导致的性能损失副作用:

| 基本类型数组                                                                                | 相当于 Java 中的类型 |
|---------------------------------------------------------------------------------------|---------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`   |
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)       | `byte[]`      |
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/)       | `char[]`      |
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/)   | `double[]`    |
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/)     | `float[]`     |
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/)         | `int[]`       |
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/)       | `long[]`      |
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/)     | `short[]`     |

这些类与 `Array` 类没有继承关系, 但它们有相同的一组函数和属性.

下面的示例创建一个 `IntArray` 类的实例:

```kotlin
fun main() {
//sampleStart
    // 创建一个数组, 元素类型为 Int, 大小为 5, 元素值为 0
    val exampleArray = IntArray(5)
    println(exampleArray.joinToString())
    // 输出结果为 0, 0, 0, 0, 0
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="arrays-primitive-type-array-kotlin"}


> 要将基本类型数组转换为对象类型数组, 请使用 [`.toTypedArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-typed-array.html)
> 函数.
>
> 要将对象类型数组转换为基本类型数组, 请使用 [`.toBooleanArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-boolean-array.html),
> [`.toByteArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-byte-array.html), [`.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-char-array.html),
> 等等函数.
>
{style="note"}

## 下一步做什么?

* 为什么对大多数使用场景我们推荐使用集合, 请阅读我们的 [集合概述](collections-overview.md).
* 学习其他 [基本类型](basic-types.md).
* 如果你是 Java 开发者, 请阅读我们的 Java 到 Kotlin 迁移向导, 关于 [集合](java-to-kotlin-collections-guide.md) 的部分.
