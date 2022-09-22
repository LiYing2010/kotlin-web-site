---
type: doc
layout: reference
category: "Syntax"
title: "接口"
---

# 接口

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin 中的接口可以包含抽象方法的声明, 也可以包含方法的实现.
接口与抽象类的区别在于, 接口不能存储状态数据.
接口可以有属性, 但这些属性必须是抽象的, 或者必须提供访问器的自定义实现.

接口使用 `interface` 关键字来定义:

```kotlin
interface MyInterface {
    fun bar()
    fun foo() {
      // 方法体是可选的
    }
}
```

## 实现接口

类或者对象可以实现一个或多个接口

```kotlin
class Child : MyInterface {
    override fun bar() {
        // 方法体
    }
}
```

## 接口中的属性

你可以在接口中定义属性. 接口中声明的属性要么是抽象的, 要么提供访问器的自定义实现.
接口中声明的属性不能拥有后端域变量(backing field),
因此, 在接口中定义的属性访问器也不能访问属性的后端域变量:

```kotlin
interface MyInterface {
    val prop: Int // 抽象属性

    val propertyWithImplementation: String
        get() = "foo"

    fun foo() {
        print(prop)
    }
}

class Child : MyInterface {
    override val prop: Int = 29
}
```

## 接口的继承

接口也可以继承其他接口, 因此它可以对父接口中的成员提供实现, 同时又声明新的函数和属性.
很自然的, 类在实现这样的接口时, 只需要实现缺少的函数和属性:

```kotlin
interface Named {
    val name: String
}

interface Person : Named {
    val firstName: String
    val lastName: String

    override val name: String get() = "$firstName $lastName"
}

data class Employee(
    // 不需要实现 'name' 属性
    override val firstName: String,
    override val lastName: String,
    val position: Position
) : Person
```

## 解决覆盖冲突(overriding conflict)

如果你为一个类指定了多个超类, 可能会导致对同一个方法继承得到了多个实现:

```kotlin
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

    override fun bar() {
        super<B>.bar()
    }
}
```

接口 *A* 和 *B* 都定义了函数 *foo()* 和 *bar()*. 它们也都实现了 *foo()*,
但只有 *B* 实现了 *bar()*
(在 *A* 中 *bar()* 没有标记为 abstract, 因为在接口中, 如果没有定义函数体, 则函数默认为 abstract).
现在, 如果你从 *A* 派生一个实体类 *C*, 那么必须覆盖函数 *bar()*, 并提供一个实现.

然而, 如果你从 *A* 和 *B* 派生出 *D*, 对于从多个接口中继承得到的所有方法我们都需要实现,
并且指明 *D* 具体应该如何实现各个方法.
对于只继承得到了单个实现的方法(如上例中的 *bar()* 方法),
以及继承得到了多个实现的方法(如上例中的 *foo()* 方法), 都存在这个限制.
