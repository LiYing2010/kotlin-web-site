[//]: # (title: 值范围(Range)与数列(Progression))

最终更新: %latestDocDate%

Kotlin 允许你非常便利的创建值范围, 方法是使用 `kotlin.ranges` 包中的
[`.rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html)
和 [`.rangeUntil()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-until.html)
函数.

如果要创建:
* 终端封闭(closed-ended)的值范围, 请使用 `..` 操作符, 调用 `.rangeTo()` 函数.
* 终端开放(open-ended)的值范围, 请使用 `..<` 操作符, 调用 `.rangeUntil()` 函数.

例如:

```kotlin
fun main() {
//sampleStart
    // 终端封闭的值范围
    println(4 in 1..4)
    // true

    // 终端开放的值范围
    println(4 in 1..<4)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-rangeto-rangeuntil"}

值范围非常适合用在 `for` 循环中遍历:

```kotlin
fun main() {
//sampleStart
    for (i in 1..4) print(i)
    // 输出结果为 1234
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-for-loop"}

如果需要按反序遍历整数, 请使用标准库中的
[`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html)
函数代替 `..`.

```kotlin
fun main() {
//sampleStart
    for (i in 4 downTo 1) print(i)
    // 输出结果为 4321
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-downto"}

还可以使用任意步长(不一定是 1)来遍历整数.
可以通过
[`step`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html)
函数实现.

```kotlin
fun main() {
//sampleStart
    for (i in 0..8 step 2) print(i)
    println()
    // 输出结果为 02468
    for (i in 0..<8 step 2) print(i)
    println()
    // 输出结果为 0246
    for (i in 8 downTo 0 step 2) print(i)
    // 输出结果为 86420
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-step"}

## 数列(Progression)

整数类型, 比如 `Int`, `Long`, 和 `Char`, 的值范围,
可以被当作 [算数数列(Arithmetic Progression)](https://en.wikipedia.org/wiki/Arithmetic_progression).
在 Kotlin 中, 这些数列由相应的类型来定义:
[`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html),
[`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html),
以及 [`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html).

数列有 3 个基本属性: `first` 元素, `last` 元素, 以及一个非 0 的 `step`.
数列的第一个元素就是 `first`, 后续的所有元素等于前一个元素加上 `step`.
在 step 为正数的数列上的遍历, 等价于 Java/JavaScript 中基于下标的 `for` 循环:

```java
for (int i = first; i <= last; i += step) {
    // ...
}
```

当你在值范围上遍历时会隐含地创建一个数列,
这个数列的 `first` 和 `last` 元素就是值范围的边界值, `step` 为 1.

```kotlin
fun main() {
//sampleStart
    for (i in 1..10) print(i)
    // 输出结果为 12345678910
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions"}

如果要自定义数列的步长, 可以在值范围上使用 `step` 函数.

```kotlin
fun main() {
//sampleStart
    for (i in 1..8 step 2) print(i)
    // 输出结果为 1357
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-step"}

数列的 `last` 元素计算方法如下:
* 如果步长为正: 小于或等于值范围结束值的最大值, 并且满足 `(last - first) % step == 0`.
* 如果步长为负: 大于或等于值范围结束值的最小值, 并且满足 `(last - first) % step == 0`.

因此, `last` 元素并不一定等同于值范围中指定的结束值.

```kotlin
fun main() {
//sampleStart
    for (i in 1..9 step 3) print(i) // last 元素是 7
    // 输出结果为 147
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-last"}

数列实现了 `Iterable<N>` 接口, 这里的 `N` 分别是 `Int`, `Long`, 或 `Char`,
因此数列可以用于很多 [集合函数](collection-operations.md), 比如 `map`, `filter`, 等等.

```kotlin
fun main() {
//sampleStart
    println((1..10).filter { it % 2 == 0 })
    // 输出结果为 [2, 4, 6, 8, 10]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-filter"}
