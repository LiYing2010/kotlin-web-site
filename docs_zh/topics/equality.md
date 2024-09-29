[//]: # (title: 相等判断)

最终更新: %latestDocDate%

在 Kotlin 中, 存在两种相等判断:

* _结构相等_ (`==`) - 使用 `equals()` 函数判断
* _引用相等_ (`===`) - 判断两个引用指向同一个对象

## 结构相等 {id="structural-equality"}

结构相等检查两个对象是否拥有相同的内容和结构.
结构相等使用 `==` 操作, 以及它的相反操作 `!=`, 来判断.
按照约定, `a == b` 这样的表达式将被转换为:

```kotlin
a?.equals(b) ?: (b === null)
```

如果 `a` 不为 `null`, 将会调用 `equals(Any?)` 函数.
否则(如果 `a` 为 `null`), 将会检查 `b` 是否指向 `null`:

```kotlin
fun main() {
    var a = "hello"
    var b = "hello"
    var c = null
    var d = null
    var e = d

    println(a == b)
    // 输出结果为 true
    println(a == c)
    // 输出结果为 false
    println(c == e)
    // 输出结果为 true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

注意, 当明确地与 `null` 进行比较时, 没有必要优化代码:
`a == null` 将会自动转换为 `a === null`.

在 Kotlin 中, 从 `Any` 开始的所有的类都会继承 `equals()` 函数.
默认情况下, `equals()` 函数实现 [引用相等判断](#referential-equality).
但是, Kotlin 中的类可以覆盖 `equals()` 函数, 实现一个自定义的相等判断逻辑, 并且通过这种方式, 实现结构相等判断.

值类(Value Class)和数据类(Data Class) 是两种特定的 Kotlin 类型, 它们会自动覆盖 `equals()` 函数.
因此它们默认会实现结构相等判断.

但是, 对于数据类的情况, 如果 `equals()` 函数在父类中被标记为 `final`, 那么它的行为会保持不变.

很明显, 非数据类 (没有使用 `data` 修饰符声明的类) 默认不会覆盖 `equals()` 函数.
相反, 非数据类实现引用相等判断, 继承自 `Any` 类.
实现结构相等判断, 非数据类需要用一个自定义的相等判断逻辑来覆盖 `equals()` 函数.

如果需要实现自定义的相等判断,
请覆盖 [`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 函数:

```kotlin
class Point(val x: Int, val y: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Point) return false

        // 比较属性值, 实现结构相等判断
        return this.x == other.x && this.y == other.y
    }
}
```
> 在覆盖 equals() 函数时, 你还应该覆盖 [hashCode() 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/hash-code.html),
> 以保持相等判断和 hash 值的一致性, 确保这些函数的行为正确.
>
{style="note"}

同名但参数不同的其他函数 (比如 `equals(other: Foo)`) 不会影响到使用操作符 `==` 和 `!=` 进行的相等判断.

结构相等与 `Comparable<...>` 接口定义的比较操作没有关系,
因此, 只有 `equals(Any?)` 函数的自定义实现才会影响相等操作符的结果.

## 引用相等 {id="referential-equality"}

引用相等检查两个对象的内存地址, 判断它们是不是相同的实例.

引用相等使用 `===` 操作, 以及它的相反操作 `!==`, 来判断.
当, 且仅当, `a` 与`b` 指向同一个对象时, `a === b` 结果为 `true`:

```kotlin
fun main() {
    var a = "Hello"
    var b = a
    var c = "world"
    var d = "world"

    println(a === b)
    // 输出结果为 true
    println(a === c)
    // 输出结果为 false
    println(c === d)
    // 输出结果为 true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

对于运行时期表达为基本类型的那些值(比如, `Int`), `===` 判断等价于 `==` 判断.

> 在 Kotlin/JS 中, 引用相等的实现方式是不同的. 关于相等判断, 更多详情请参见 [Kotlin/JS](js-interop.md#equality) 文档.
>
{style="tip"}

## 浮点数值的相等比较

如果相等比较的操作数类型可以静态地判定为 `Float` 或 `Double` (无论可否为 null),
那么相等判断将使用 [IEEE 754 浮点数运算标准](https://en.wikipedia.org/wiki/IEEE_754).

对于不是浮点值静态类型的操作数, 行为会不同. 对这样的情况, 将会使用结构相等判定.
因此, 对于不是浮点值静态类型的操作数, 判定不遵循 IEEE 标准.
在这种情况下:

* `NaN` 等于它自己
* `NaN` 认为大于任何其他元素 (包括 `POSITIVE_INFINITY`)
* `-0.0` 不等于 `0.0`

详情请参见: [浮点值的比较](numbers.md#floating-point-numbers-comparison).

## 数组的相等比较

要比较两个数组是否包含相同顺序的相同元素, 请使用 [`contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html).

详情请参见, [数组的比较](arrays.md#compare-arrays).
