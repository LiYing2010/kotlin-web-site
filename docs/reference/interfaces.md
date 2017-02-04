---
type: doc
layout: reference
category: "Syntax"
title: "接口"
---

# 接口

Kotlin 中的接口与 Java 8 非常类似. 接口中可以包含抽象方法的声明, 也可以包含方法的实现. 接口与抽象类的区别在于, 接口不能存储状态数据. 接口可以有属性, 但这些属性必须是抽象的, 或者必须提供访问器的自定义实现.

接口使用 *interface*{: .keyword } 关键字来定义:

``` kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // 方法体是可选的
    }
}
```

## 实现接口

类或者对象可以实现一个或多个接口:

``` kotlin
class Child : MyInterface {
    override fun bar() {
        // 方法体
    }
}
```

## 接口中的属性

你可以在接口中定义属性. 接口中声明的属性要么是抽象的, 要么提供访问器的自定义实现. 接口中声明的属性不能拥有后端域变量(backing field), 因此, 在接口中定义的属性访问器也不能访问属性的后端域变量.

``` kotlin
interface MyInterface {
    val property: Int // 抽象属性

    val propertyWithImplementation: String
        get() = "foo"

    fun foo() {
        print(property)
    }
}

class Child : MyInterface {
    override val property: Int = 29
}
```

## 解决覆盖冲突(overriding conflict)

当我们为一个类指定了多个超类, 可能会导致我们对同一个方法继承得到了多个实现. 比如:

``` kotlin
interface A {
    fun foo() { print("A") }
    fun bar()
}

interface B {
    fun foo() { print("B") }
    fun bar() { print("bar") }
}

class C : A {
    override fun bar() { print("bar") }
}

class D : A, B {
    override fun foo() {
        super<A>.foo()
        super<B>.foo()
    }
}
```

接口 *A* 和 *B* 都定义了函数 *foo()* 和 *bar()*. 它们也都实现了 *foo()*, 但只有 *B* 实现了 *bar()* (在 *A* 中 *bar()* 没有标记为 abstract, 因为在接口中, 如果没有定义函数体, 则函数默认为 abstract). 现在, 如果我们从 *A* 派生一个实体类 *C*, 显然, 我们必须覆盖函数 *bar()*, 并提供一个实现. 如果我们从 *A* 和 *B* 派生出 *D*, 我们就不必覆盖函数 *bar()*, 因为我们从超类中继承得到了它的唯一一个实现. 但是对于函数 *foo()*, 我们继承得到了两个实现, 因此编译器不知道应该选择使用哪个实现, 因此编译器强制要求我们覆盖函数 *foo()*, 明确地告诉编译器, 我们究竟希望做什么.