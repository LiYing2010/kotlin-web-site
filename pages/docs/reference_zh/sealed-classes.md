---
type: doc
layout: reference
category: "Classes and Objects"
title: "Sealed Classes"
---

## 封闭类(Sealed Class)

封闭类(Sealed class)用来表示对类阶层的限制, 可以限定一个值只允许是某些指定的类型之一, 而不允许是其他类型.
感觉上, 封闭类是枚举类(enum class)的一种扩展: 枚举类的值也是有限的, 但每一个枚举值常数都只存在唯一的一个实例,
封闭类则不同, 它允许的子类类型是有限的, 但子类可以有多个实例, 每个实例都可以包含它自己的状态数据.

要声明一个封闭类, 需要将 `sealed` 修饰符放在类名之前.
封闭类可以有子类, 但所有的子类声明都必须定义在封闭类所在的同一个源代码文件内.
(在 Kotlin 1.1 之前, 规则更加严格: 所有的子类声明都必须嵌套在封闭类的声明部分之内).

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
sealed class Expr
data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()
```
</div>

(上面的示例使用了 Kotlin 1.1 的新增特性: 允许数据类继承其他类, 包括继承封闭类.)

封闭类本身是 [抽象(abstract)类](classes.html#abstract-classes), 不允许直接创建实例, 而且封闭类可以拥有 *abstract*{: .keyword } 成员.

封闭类不允许拥有非 *private*{: .keyword } 的构造器(封闭类的构造器默认都是 *private*{: .keyword } 的).

注意, 从封闭类的子类再继承的子类(间接继承者)可以放在任何地方, 不必在封闭类所在的同一个源代码文件内.

使用封闭类的主要好处在于, 当使用 [`when` expression](control-flow.html#when-expression) 时, 可以验证分支语句覆盖了所有的可能情况, 因此就不必通过 `else` 分支来处理例外情况.
但是, 这种用法只适用于将 `when` 用作表达式(使用它的返回值)的情况, 而不能用于将 `when` 用作语句的情况.

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun eval(expr: Expr): Double = when(expr) {
    is Const -> expr.number
    is Sum -> eval(expr.e1) + eval(expr.e2)
    NotANumber -> Double.NaN
    // 不需要 `else` 分支, 因为我们已经覆盖了所有的可能情况
}
```
</div>
