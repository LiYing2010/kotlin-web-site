[//]: # (title: 基本类型)

在 Kotlin 中, 每个变量和数据结构都有一个类型.
类型很重要, 因为它告诉编译器你可以对这个变量或数据结构做什么样的操作.
也就是说, 这个变量或数据结构有什么函数和属性.

在上一章中, Kotlin 能够知道上一个示例程序中的 `customers` 的类型是 [`Int`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/).
Kotlin **推断** 类型的能力称为 **类型推断**.
`customers` 被赋值了一个整数值. 根据这一点, Kotlin 推断 `customers` 拥有数值类型 `Int`.
结果是, 编译器知道你可以对 `customers` 执行算数操作:

```kotlin
fun main() {
//sampleStart
    var customers = 10

    // 有些客户离开了队列
    customers = 8

    customers = customers + 3 // 加法示例, 结果为: 11
    customers += 7            // 加法示例, 结果为: 18
    customers -= 3            // 减法示例, 结果为: 15
    customers *= 2            // 乘法示例, 结果为: 30
    customers /= 3            // 除法示例, 结果为: 10

    println(customers) // 输出结果为 10
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-arithmetic"}

> `+=`, `-=`, `*=`, `/=`, 和 `%=` 是计算并赋值操作符(Augmented Assignment Operator).
> 详情请参见 [计算并赋值](operator-overloading.md#augmented-assignments).
>
{style="tip"}

总的来说, Kotlin 有以下数据类型:

| **类别**                                  | **基本类型**                       | **示例代码**                                                      |
|-------------------------------------------|------------------------------------|-------------------------------------------------------------------|
| [整数](numbers.md#integer-types)          | `Byte`, `Short`, `Int`, `Long`     | `val year: Int = 2020`<br/> `val amount: Long = 350_000_000`      |
| [无符号整数](unsigned-integer-types.md)   | `UByte`, `UShort`, `UInt`, `ULong` | `val score: UInt = 100u`                                          |
| [浮点数](numbers.md#floating-point-types) | `Float`, `Double`                  | `val currentTemp: Float = 24.5f`<br/> `val price: Double = 19.99` |
| [布尔值](booleans.md)                     | `Boolean`                          | `val isEnabled: Boolean = true`                                   |
| [字符](characters.md)                     | `Char`                             | `val separator: Char = ','`                                       |
| 字符串                                    | `String`                           | `val message: String = "Hello, world!"`                           |

关于基本类型和它们的属性, 详情请参见 [类型概述](types-overview.md).

有了这些知识之后, 你可以声明变量, 并初始化这些变量.
只要变量在第一次读取之前初始化, Kotlin 就能够正确处理这些变量.

要声明一个变量但不初始化, 请使用 `:` 来指定它的类型.
例如:

```kotlin
fun main() {
//sampleStart
    // 声明变量, 但不初始化
    val d: Int
    // 变量被初始化
    d = 3

    // 明确指定了变量类型, 而且初始化
    val e: String = "hello"

    // 可以读取变量, 因为已经它们初始化了
    println(d) // 输出结果为 3
    println(e) // 输出结果为 hello
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-initialization"}

如果一个变量在读取之前没有初始化, 会发生错误:

```kotlin
fun main() {
//sampleStart
    // 声明变量, 但没有初始化
    val d: Int
    
    // 这里会发生错误
    println(d)
    // 错误: Variable 'd' must be initialized
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-no-initialization" validate="false"}

现在你已经知道了如何声明基本类型, 下面我们来学习 [集合(Collection)](kotlin-tour-collections.md).

## 实际练习 {completion-point="true" id="practice"}

### 习题 {id="exercise" initial-collapse-state="collapsed" collapsible="true"}

为每个变量明确声明正确的类型:

|---|---|
```kotlin
fun main() {
    val a: Int = 1000
    val b = "log message"
    val c = 3.14
    val d = 100_000_000_000_000
    val e = false
    val f = '\n'
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-basic-types-exercise"}

|---|---|
```kotlin
fun main() {
    val a: Int = 1000
    val b: String = "log message"
    val c: Double = 3.14
    val d: Long = 100_000_000_000_000
    val e: Boolean = false
    val f: Char = '\n'
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-basic-types-solution"}

<seealso></seealso>

<list columns="2" id="tour-nav">
  <li>
    <a as="button" href="kotlin-tour-hello-world.md" mode="outline" icon="arrow-left" icon-position="left">上一步</a>
  </li>
  <li>
    <a as="button" href="kotlin-tour-collections.md" mode="classic" icon="arrow-right" icon-position="right">下一步</a>
  </li>
</list>
