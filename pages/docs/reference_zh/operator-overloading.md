---
type: doc
layout: reference
title: "操作符重载"
category: "Syntax"
---

# 操作符重载(Operator overloading)

Kotlin 允许我们对数据类型的一组预定义的操作符提供实现函数. 这些操作符的表达符号是固定的(比如 `+` 或 `*`), [优先顺序](grammar.html#expressions)也是固定的.
要实现这些操作符, 我们需要对相应的数据类型实现一个固定名称的 [成员函数](functions.html#member-functions) 或 [扩展函数](extensions.html),
这里所谓"相应的数据类型", 对于二元操作符, 是指左侧操作数的类型, 对于一元操作符, 是指唯一一个操作数的类型.
用于实现操作符重载的函数应该使用 `operator` 修饰符进行标记.

下面我们介绍与各种操作符的重载相关的约定.

## 一元操作符

### 一元前缀操作符

|    表达式   |     翻译为     |
|------------|---------------|
| `+a` | `a.unaryPlus()` |
| `-a` | `a.unaryMinus()` |
| `!a` | `a.not()` |

上表告诉我们说, 当编译器处理一元操作符时, 比如表达式 `+a`, 它将执行以下步骤:

* 确定 `a` 的类型, 假设为 `T`;
* 查找带有 `operator` 修饰符, 无参数的 `unaryPlus()` 函数, 而且函数的接受者类型为 `T`, 也就是说, `T` 类型的成员函数或扩展函数;
* 如果这个函数不存在, 或者找到多个, 则认为是编译错误;
* 如果这个函数存在, 并且返回值类型为 `R`, 则表达式 `+a` 的类型为 `R`;

*注意*, 这些操作符, 以其其它所有操作符, 都对 [基本类型](basic-types.html) 进行了优化, 因此不会发生函数调用, 并由此产生性能损耗.

举例来说, 我们可以这样来重载负号操作符:

<div class="sample" markdown="1" theme="idea">
```kotlin
data class Point(val x: Int, val y: Int)

operator fun Point.unaryMinus() = Point(-x, -y)

val point = Point(10, 20)

fun main() {
   println(-point)  // 打印结果为 "Point(x=-10, y=-20)"
}

```
</div>

### 递增与递减操作符

|    表达式   |     翻译为     |
|------------|---------------|
| `a++` | `a.inc()` (参见下文) |
| `a--` | `a.dec()` (参见下文) |

`inc()` 和 `dec()` 函数必须返回一个值, 这个返回值将会赋值给使用 `++` 或 `--` 操作符的对象变量.
这两个函数不应该改变调用 `inc` 或 `dec` 函数的对象的内容.

对于 *后缀* 形式操作符, 比如 `a++`, 编译器解析时将执行以下步骤:

* 确定 `a` 的类型, 假设为 `T`;
* 查找带有 `operator` 修饰符, 无参数的 `inc()` 函数, 而且函数的接受者类型为 `T`;
* 检查函数的返回值类型是不是`T` 的子类型.

计算这个表达式所造成的影响是:

* 将 `a` 的初始值保存到临时变量 `a0` 中;
* 将 `a.inc()` 的结果赋值给 `a`;
* 返回 `a0`, 作为表达式的计算结果值.

对于 `a--`, 计算步骤完全类似.

对于 *前缀* 形式的操作符 `++a` 和 `--a`, 解析过程是一样的, 计算表达式所造成的影响是:

* 将 `a.inc()` 的结果赋值给 `a`;
* 返回 `a` 的新值, 作为表达式的计算结果值.

## 二元操作符

{:#arithmetic}

### 算数操作符

|    表达式   |     翻译为     |
| -----------|-------------- |
| `a + b` | `a.plus(b)` |
| `a - b` | `a.minus(b)` |
| `a * b` | `a.times(b)` |
| `a / b` | `a.div(b)` |
| `a % b` | `a.rem(b)`, `a.mod(b)` (已废弃) |
| `a..b ` | `a.rangeTo(b)` |

对于上表中的操作符, 编译器只是简单地解析 *翻译为* 列中的表达式.

注意, `rem` 操作符函数从 Kotlin 1.1 版开始支持.
Kotlin 1.0 版使用的是 `mod` 操作符函数, 在 Kotlin 1.1 版中已经废弃了.


#### 示例

下面是一个 Counter 类的例子, 它从一个给定的值开始计数, 可以通过 `+` 操作符递增:

```kotlin
data class Counter(val dayIndex: Int) {
    operator fun plus(increment: Int): Counter {
        return Counter(dayIndex + increment)
    }
}
```

{:#in}

### 'In' 操作符


|    表达式   |     翻译为     |
| -----------|-------------- |
| `a in b` | `b.contains(a)` |
| `a !in b` | `!b.contains(a)` |

对于 `in` 和 `!in` 操作符, 解析过程也是一样的, 但参数顺序被反转了.

{:#indexed}

### 下标访问操作符

|  表达式 |    翻译为      |
| -------|-------------- |
| `a[i]`  | `a.get(i)` |
| `a[i, j]`  | `a.get(i, j)` |
| `a[i_1, ...,  i_n]`  | `a.get(i_1, ...,  i_n)` |
| `a[i] = b` | `a.set(i, b)` |
| `a[i, j] = b` | `a.set(i, j, b)` |
| `a[i_1, ...,  i_n] = b` | `a.set(i_1, ..., i_n, b)` |

方括号被翻译为, 使用适当个数的参数, 对 `get` 和 `set` 函数的调用.

{:#invoke}

### 函数调用操作符

|  表达式 |    翻译为      |
|--------|---------------|
| `a()`  | `a.invoke()` |
| `a(i)`  | `a.invoke(i)` |
| `a(i, j)`  | `a.invoke(i, j)` |
| `a(i_1, ...,  i_n)`  | `a.invoke(i_1, ...,  i_n)` |

圆括号被翻译为, 使用适当个数的参数, 调用 `invoke` 函数.

{:#assignments}

### 计算并赋值

|    表达式   |     翻译为     |
|------------|---------------|
| `a += b` | `a.plusAssign(b)` |
| `a -= b` | `a.minusAssign(b)` |
| `a *= b` | `a.timesAssign(b)` |
| `a /= b` | `a.divAssign(b)` |
| `a %= b` | `a.remAssign(b)`, `a.modAssign(b)` (已废弃) |

对于赋值操作符, 比如 `a += b`, 编译器执行以下步骤:

* 如果上表中右列的函数可用
  * 如果对应的二元操作函数(也就是说, 对于 `plusAssign()` 来说, `plus()` 函数) 也可用, 报告错误(歧义),
  * 确认函数的返回值类型为 `Unit`, 否则报告错误,
  * 生成 `a.plusAssign(b)` 的代码;
* 否则, 尝试生成 `a = a + b` 的代码(这里包括类型检查: `a + b` 的类型必须是 `a` 的子类型).

*注意*: 在 Kotlin 中, 赋值操作 *不是* 表达式.

{:#equals}

### 相等和不等比较操作符

|    表达式   |     翻译为     |
|------------|---------------|
| `a == b` | `a?.equals(b) ?: (b === null)` |
| `a != b` | `!(a?.equals(b) ?: (b === null))` |

这些操作符是通过 [`equals(other: Any?): Boolean`](/api/latest/jvm/stdlib/kotlin/-any/equals.html) 函数来实现的,
可以重载这个函数, 来实现自定义的相等判断. 同名但不同参数的任何其他函数 (比如 `equals(other: Foo)`) 都不会被调用.

*注意*: `===` 和 `!==` (同一性检查) 操作符不允许重载, 因此对这两个操作符不存在约定.

`==` 操作符是特殊的: 它被翻译为一个复杂的表达式, 其中包括对 `null` 值的处理.
`null == null` 的判断结果永远为 `true`, 对于非 null 的 `x`, `x == null` 永远为 `false`, 并且不会调用 `x.equals()`.

{:#comparison}

### 比较操作符

|  表达式 |    翻译为      |
|--------|---------------|
| `a > b`  | `a.compareTo(b) > 0` |
| `a < b`  | `a.compareTo(b) < 0` |
| `a >= b` | `a.compareTo(b) >= 0` |
| `a <= b` | `a.compareTo(b) <= 0` |

所有的比较操作符都被翻译为对 `compareTo` 函数的调用, 这个函数的返回值必须是 `Int` 类型.

### 属性委托操作符
关于 `provideDelegate`, `getValue` 和 `setValue` 操作符函数, 请参见 [委托属性](delegated-properties.html).

## 对命名函数的中缀式调用

使用 [中缀式函数调用](functions.html#infix-notation), 我们可以模拟自定义的中缀操作符.
