---
type: doc
layout: reference
title: "函数式接口 (SAM Interface)"
---

# 函数式接口 (SAM Interface)

只有一个抽象方法的接口称为 _函数式接口 (Functional Interface)_, 或者叫做 _单抽象方法(SAM, Single Abstract Method) 接口_.
函数式接口可以拥有多个非抽象的成员, 但只能拥有一个抽象成员.

在 Kotlin 中声明函数式接口时, 请使用 `fun` 修饰符.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun interface KRunnable {
   fun invoke()
}
```

</div>

## SAM 转换功能

对于函数式接口, 可以通过 SAM 转换功能,
使用 [Lambda 表达式](lambdas.html#lambda-expressions-and-anonymous-functions), 让你的代码更加简洁易读.

你可以使用 Lambda 表达式, 而不必手动的创建一个类, 实现函数式接口.
只要 Lambda 表达式的签名与接口的唯一方法的签名相匹配, Kotlin 可以通过 SAM 转换功能, 将任意的 Lambda 表达式转换为实现接口的类的实例.

比如, 对于下面的 Kotlin 函数式接口:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}
```

</div>

如果不使用 SAM 转换功能, 那么就需要编写这样的代码:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 创建类的实例
val isEven = object : IntPredicate {
   override fun accept(i: Int): Boolean {
       return i % 2 == 0
   }
}
```

</div>

使用 Kotlin 的 SAM 转换功能, 就可以编写下面的代码, 效果相同:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 使用 Lambda 表达式创建实例 
val isEven = IntPredicate { it % 2 == 0 }
```

</div>

这样, 就通过更加简短的 Lambda 表达式代替了所有其他不必要的代码.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4-M1">

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() {
   println("Is 7 even? - ${isEven.accept(7)}")
}
```

</div>

也可以使用 [对 Java 接口的 SAM 转换功能](java-interop.html#sam-conversions).

## 函数式接口 与 类型别名(Type Alias)

函数式接口 与 [类型别名(Type Alias)](type-aliases.html) 服务于不同的目的.
类型别名只是对已有的类型提供一个新的名称 – 它不会创建新的类型, 而函数式接口会.

类型别名只能拥有一个成员, 而函数式接口可以拥有多个非抽象的成员和一个抽象成员.
函数式接口也可以实现或继承其他接口.

因此, 与类型别名相比, 函数式接口更加灵活, 也提供了更多功能.
