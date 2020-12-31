---
type: doc
layout: reference
category: "Syntax"
title: "嵌套类与内部类"
---

# 嵌套类(Nested Class)与内部类(Inner Class)

类可以嵌套在另一个类之内:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Outer {
    private val bar: Int = 1
    class Nested {
        fun foo() = 2
    }
}

val demo = Outer.Nested().foo() // == 2
```

</div>

你也可以对接口进行嵌套. 类和接口的所有组合都是允许的: 可以在类中嵌套接口, 在接口中嵌套类, 以及在接口中嵌套接口.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
interface OuterInterface {
    class InnerClass
    interface InnerInterface
}

class OuterClass {
    class InnerClass
    interface InnerInterface
}
```

</div>

## 内部类(Inner class)

嵌套类可以使用 *inner*{: .keyword } 关键字来标记, 然后就可以访问它的外部类(outer class)的成员. 内部类会保存一个引用, 指向外部类的对象实例:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Outer {
    private val bar: Int = 1
    inner class Inner {
        fun foo() = bar
    }
}

val demo = Outer().Inner().foo() // == 1
```

</div>

在内部类中使用 *this*{: .keyword } 关键字会产生歧义, 关于如何消除这种歧义, 请参见 [带限定符的 *this*{: .keyword } 表达式](this-expressions.html).

## 匿名内部类(Anonymous inner class)

匿名内部类的实例使用 [对象表达式(object expression)](object-declarations.html#object-expressions) 来创建:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
window.addMouseListener(object : MouseAdapter() {

    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
})
```

</div>

_注意_: 对于 JVM 平台, 如果这个对象是一个 Java 函数式接口的实例(也就是, 只包含唯一一个抽象方法的 Java 接口),
那么你可以使用带接口类型前缀的 Lambda 表达式来创建这个对象:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val listener = ActionListener { println("clicked") }
```

</div>
