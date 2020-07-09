---
type: doc
layout: reference
category: "Other"
title: "相等判断"
---

# 相等判断

在 Kotlin 中存在两种相等判断:

* 结构相等 (`equals()` 判断);
* 引用相等 (两个引用指向同一个对象).

## 结构相等

结构相等使用 `==` 操作 (以及它的相反操作 `!=`) 来判断. 按照约定, `a == b` 这样的表达式将被转换为:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
a?.equals(b) ?: (b === null)
```
</div>

也就是说, 如果 `a` 不为 `null`, 将会调用 `equals(Any?)` 函数, 否则(也就是如果 `a` 为 `null`) 将会检查 `b` 是否指向 `null`.

注意, 当明确地与 `null` 进行比较时, 没有必要优化代码: `a == null` 将会自动转换为 `a === null`.

如果需要实现自定义的相等判断, 请覆盖 [`equals(other: Any?): Boolean`](/api/latest/jvm/stdlib/kotlin/-any/equals.html) 函数.
同名但参数不同的其他函数, 比如 `equals(other: Foo)`, 不会影响到使用操作符 `==` 和 `!=` 进行的相等判断.

结构相等与 `Comparable<...>` 接口定义的比较操作没有关系, 因此, 只有 `equals(Any?)` 函数的自定义实现才会影响比较操作符的结果.

## 浮点数值的相等比较

如果相等比较的对象值类型可以静态地判定为 `Float` 或 `Double` (无论可否为 null), 那么相等判断将使用 IEEE 754 浮点数运算标准.

否则, 将会使用结构相等判定, 这种判定不遵循 IEEE 754 浮点数运算标准, 因此 `NaN` 不等于它自己, 而且 `-0.0` 不等于 `0.0`.

详情请参见: [浮点值的比较](basic-types.html#floating-point-numbers-comparison).

## 引用相等

引用相等使用 `===` 操作 (以及它的相反操作 `!==`) 来判断. 当, 且仅当, `a` 与`b` 指向同一个对象时, `a === b` 结果为 true.
对于运行时期表达为基本类型的那些值(比如, `Int`), `===` 判断等价于 `==` 判断.
