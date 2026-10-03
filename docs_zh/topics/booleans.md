[//]: # (title: 布尔(Boolean)类型)
[//]: # (description: 学习如何在 Kotlin 中使用布尔值, 包括声明, 逻辑运算符和条件表达式.)

[`Boolean`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-boolean/) 类型表示逻辑值: `true` 和 `false`.

`Boolean` 值可以用在需要回答是/否问题的函数中, 以及用在 `while`, `if`, 和 `when` 的条件表达式中.

## 声明 `Boolean` 变量 {id="declare-a-boolean-variable"}

要声明一个 `Boolean` 变量, 请将 `true` 或 `false` 赋值给它.

可以明确指定 `Boolean` 类型, 也可以让 Kotlin 从值中推断类型:

```kotlin
val isTrue: Boolean = true
val isFalse = false // Kotlin 推断类型为 Boolean
```

如果值可以为 `null`, 请使用 `Boolean?`:

```kotlin
val isEnabled: Boolean? = null
```

> 不能将整数值赋给 `Boolean` 变量.
> 在 Kotlin 中, `0` 和 `1` 不是 `Boolean` 值.
>
{style="note"}

## 生成 `Boolean` 值 {id="produce-boolean-values"}

可以使用比较表达式和函数来生成 `Boolean` 值:

```kotlin
fun main() {
//sampleStart
    val number = 10
    val isPositive = number > 0
    println(isPositive)
    // 输出结果为: true

    val language = "Kotlin"
    val isEmpty = language.isEmpty()
    println(isEmpty)
    // 输出结果为: false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

也可以在条件表达式和其他表达式中使用这些结果:

```kotlin
fun main() {
//sampleStart
    val number = 10
    val isPositive = number > 0 // 结果为 true

    if (isPositive) {
        println("The number is positive.")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## `Boolean` 运算 {id="boolean-operations"}

Kotlin 提供了运算符和中缀函数来处理 `Boolean` 值.
可以使用它们对 `Boolean` 值取反, 或将多个 `Boolean` 值合并为一个结果.

### 取反(NOT) {id="negation-not"}

NOT 运算符对 `Boolean` 值取反.

要使用 NOT, 请在 `Boolean` 值前面放置 `!` 运算符:

```kotlin
val isOn = true
val isOff = !isOn // isOff 为 false
```

### 逻辑与(AND) {id="logical-and"}

AND 运算符仅在两个操作数都为 `true` 时返回 `true`.

要使用逻辑与, 请在操作数之间放置 `&&` 运算符:

```kotlin
val a = false && false // 结果为 false
val b = false && true // 结果为 false
val c = true && false // 结果为 false
val d = true && true  // 结果为 true
```

> 如果第一个操作数为 `false`, `&&` 运算符会跳过第二个操作数.
> 要对两个操作数都求值, 请改用 `and` [中缀函数](functions.md#infix-notation).
>
{style="note"}

### 逻辑或(OR) {id="logical-or"}

OR 运算符在至少一个操作数为 `true` 时返回 `true`.

要使用逻辑或, 请在操作数之间放置 `||` 运算符:

```kotlin
val a = false || false // 结果为 false
val b = false || true  // 结果为 true
val c = true || false  // 结果为 true
val d = true || true   // 结果为 true
```

> 如果第一个操作数为 `true`, `||` 运算符会跳过第二个操作数.
> 要对两个操作数都求值, 请改用 `or` [中缀函数](functions.md#infix-notation).
>
{style="note"}

### 异或(XOR) {id="exclusive-or-xor"}

异或(XOR)运算在两个操作数值不相同时返回 `true`.

要使用 XOR, 请在操作数之间写 `xor`:

```kotlin
val a = false xor false // 结果为 false
val b = false xor true  // 结果为 true
val c = true xor false  // 结果为 true
val d = true xor true   // 结果为 false
```

> `xor` 是一个 [中缀函数](functions.md#infix-notation), 不是运算符.
>
> 关于 `Boolean` 函数, 详情请参见 [API 参考文档](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-boolean/).
>
{style="note"}

## 运算符优先级 {id="operator-precedence"}

如果一个表达式包含多个逻辑运算, 而且没有括号来指定求值顺序, Kotlin 会使用优先级规则.
优先级较高的运算会在优先级较低的运算之前求值.

对于本节描述的 `Boolean` 运算, 优先级顺序如下:

1. `!`
2. `xor` (以及其他中缀函数)
3. `&&`
4. `||`

在下面的示例中, 编译器先对 `&&` 求值, 再对 `||` 求值:

```kotlin
fun main() {
//sampleStart
    val result = true || false && false
    println(result)
    // 输出结果为: true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

要明确指定求值顺序, 请使用括号:

```kotlin
fun main() {
//sampleStart
    val result = (true || false) && false
    println(result)
    // 输出结果为: false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false"}

## 在条件表达式中使用 `Boolean` {id="boolean-in-conditions"}

[`if`](control-flow.md#if-expression),
[`when`](control-flow.md#when-expressions-and-statements),
和 [`while`](control-flow.md#while-loops)
通过对 `Boolean` 表达式求值来控制程序流程.

### `if` 表达式 {id="if-expressions"}

```kotlin
fun main() {
//sampleStart
    val number = 4
    val isEven = number % 2 == 0

    // 条件已经是 `Boolean` 类型
    // 不需要与 `true` 或 `false` 进行比较
    if (isEven) {
        println("The number is even.")
    } else {
        println("The number is odd.")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `when` 表达式 {id="when-expressions"}

```kotlin
fun main() {
//sampleStart
    val number = 3

    when {
        number > 0 -> println("The number is positive.")
        number < 0 -> println("The number is negative.")
        else -> println("The number is zero.")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### `while` 循环 {id="while-loops"}

```kotlin
fun main() {
//sampleStart
    var isCalculating = true

    while (isCalculating) {
        println("Calculating...")
        isCalculating = false
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
