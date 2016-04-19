---
type: doc
layout: reference
category: "Syntax"
title: "嵌套类"
---

# 嵌套类(Nested Class)

类可以嵌套在另一个类之内:

``` kotlin
class Outer {
  private val bar: Int = 1
  class Nested {
    fun foo() = 2
  }
}

val demo = Outer.Nested().foo() // == 2
```

## 内部类(Inner class)

类可以使用 *inner*{: .keyword } 关键字来标记, 然后就可以访问外部类(outer class)的成员. 内部类会保存一个引用, 指向外部类的对象实例:

``` kotlin
class Outer {
  private val bar: Int = 1
  inner class Inner {
    fun foo() = bar
  }
}

val demo = Outer().Inner().foo() // == 1
```

在内部类中使用 *this*{: .keyword } 关键字会产生歧义, 关于如何消除这种歧义, 请参见 [带限定符的 *this*{: .keyword } 表达式](this-expressions.html).

