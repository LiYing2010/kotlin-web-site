---
type: doc
layout: reference
category: "Syntax"
title: "扩展"
---

# 扩展

与 C# 和 Gosu 类似, Kotlin 提供了向一个类扩展新功能的能力, 而且不必从这个类继承, 也不必使用任何设计模式, 比如 Decorator 模式之类.
这种功能是通过一种特殊的声明来实现的, Kotlin 中称为 _扩展(extension)_. Kotlin 支持 _扩展函数(extension function)_ 和 _扩展属性(extension property)_.

## 扩展函数(Extension Function)

要声明一个扩展函数, 我们需要在函数名之前添加前缀, 表示这个函数的 _接收者类型(receiver type)_, 也就是说, 表明我们希望扩展的对象类型.
以下示例将为 `MutableList<Int>` 类型添加一个 `swap` 函数:

``` kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' 指代 list 实例
    this[index1] = this[index2]
    this[index2] = tmp
}
```

在扩展函数内, *this*{: .keyword } 关键字指代接收者对象(receiver object)(也就是调用扩展函数时, 在点号之前指定的对象实例).
现在, 我们可以对任意一个 `MutableList<Int>` 对象调用这个扩展函数:

``` kotlin
val l = mutableListOf(1, 2, 3)
l.swap(0, 2) // 'swap()' 函数内的 'this' 将指向 'l' 的值
```

显然, 这个函数可以适用与任意元素类型的 `MutableList<T>`, 因此我们可以使用泛型, 将它的元素类型泛化:

``` kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' 指代 list 实例
    this[index1] = this[index2]
    this[index2] = tmp
}
```

我们在函数名之前声明了泛型的类型参数, 然后在接收者类型表达式中就可以使用泛型了.
参见 [泛型函数](generics.html).

## 扩展函数是**静态**解析的

扩展函数并不会真正修改它所扩展的类. 定义扩展函数时, 其实并没有向类中插入新的成员方法, 而只是创建了一个新的函数, 并且可以通过点号标记法的形式, 对这个数据类型的变量调用这个新函数.

我们希望强调一下, 扩展函数的调用派发过程是**静态的**, 也就是说, 它并不是接收者类型的虚拟成员.
这就意味着, 调用扩展函数时, 具体被调用的函数是哪一个, 是通过调用函数的对象表达式的类型来决定的, 而不是在运行时刻表达式动态计算的最终结果类型决定的. 比如:

``` kotlin
open class C

class D: C()

fun C.foo() = "c"

fun D.foo() = "d"

fun printFoo(c: C) {
    println(c.foo())
}

printFoo(D())
```

这段示例程序的打印结果将是 "c", 因为调用哪个函数, 仅仅是由参数 `c` 声明的类型决定, 这里参数 `c` 的类型为 `C` 类.

如果类中存在成员函数, 同时又在同一个类上定义了同名的扩展函数, 并且与调用时指定的参数匹配, 这种情况下 **总是会优先使用成员函数**.
比如:

``` kotlin
class C {
    fun foo() { println("member") }
}

fun C.foo() { println("extension") }
```

如果我们对 `C` 类型的任意变量 `c` 调用`c.foo()`, 结果会打印 "member", 而不是 "extension".

但是, 我们完全可以使用同名称但不同参数的扩展函数, 来重载(overload)成员函数:

``` kotlin
class C {
    fun foo() { println("member") }
}

fun C.foo(i: Int) { println("extension") }
```

调用 `C().foo(1)` 的打印结果将是 "extension".


## 可为空的接收者(Nullable Receiver)

注意, 对可以为空的接收者类型也可以定义扩展. 这样的扩展函数, 即使在对象变量值为 null 时也可以调用, 在扩展函数的实现体之内, 可以通过 `this == null` 来检查接收者是否为 null. 在 Kotlin 中允许你调用 toString() 函数, 而不必检查对象是否为 null, 就是通过这个原理实现的: 对象是否为 null 的检查发生在扩展函数内部, 因此调用者不必再做检查.

``` kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // 进行过 null 检查后, 'this' 会被自动转换为非 null 类型, 因此下面的 toString() 方法
    // 会被解析为 Any 类的成员函数
    return toString()
}
```

## 扩展属性(Extension Property)

与扩展函数类似, Kotlin 也支持扩展属性:

``` kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```

注意, 由于扩展属性实际上不会向类添加新的成员, 因此无法让一个扩展属性拥有一个 [后端域变量](properties.html#backing-fields). 所以, **对于扩展属性不允许存在初始化器**. 扩展属性的行为只能通过明确给定的取值方法与设值方法来定义.

示例:

``` kotlin
val Foo.bar = 1 // 错误: 扩展属性不允许存在初始化器
```


## 对同伴对象(Companion Object)的扩展

如果一个类定义了[同伴对象](object-declarations.html#companion-objects), 你可以对这个同伴对象定义扩展函数和扩展属性:

``` kotlin
class MyClass {
    companion object { }  // 通过 "Companion" 来引用这个同伴对象
}

fun MyClass.Companion.foo() {
    // ...
}
```

与同伴对象的常规成员一样, 可以只使用类名限定符来调用这些扩展函数和扩展属性:

``` kotlin
MyClass.foo()
```


## 扩展的范围

大多数时候我们会在顶级位置定义扩展, 也就是说, 直接定义在包之下:

``` kotlin
package foo.bar

fun Baz.goo() { ... }
```

要在扩展定义所在的包之外使用扩展, 我们需要在调用处 import 这个包:

``` kotlin
package com.example.usage

import foo.bar.goo // 通过名称 "goo" 来导入扩展
                   // 或者
import foo.bar.*   // 导入 "foo.bar" 包之下的全部内容

fun usage(baz: Baz) {
    baz.goo()
)

```

详情请参见 [导入](packages.html#imports).

## 将扩展定义为成员

在类的内部, 你可以为另一个类定义扩展. 在这类扩展中, 存在多个 _隐含接受者(implicit receiver)_ -
这些隐含接收者的成员可以不使用限定符直接访问. 扩展方法的定义所在的类的实例, 称为_派发接受者(dispatch receiver)_, 扩展方法的目标类型的实例, 称为 _扩展接受者(extension receiver)_.

``` kotlin
class D {
    fun bar() { ... }
}

class C {
    fun baz() { ... }

    fun D.foo() {
        bar()   // 这里将会调用 D.bar
        baz()   // 这里将会调用 C.baz
    }

    fun caller(d: D) {
        d.foo()   // 这里将会调用扩展函数
    }
}
```

当派发接受者与扩展接受者的成员名称发生冲突时, 扩展接受者的成员将会被优先使用. 如果想要使用派发接受者的成员, 请参见 [带限定符的 `this` 语法](this-expressions.html#qualified).

``` kotlin
class C {
    fun D.foo() {
        toString()         // 这里将会调用 D.toString()
        this@C.toString()  // 这里将会调用 C.toString()
    }
```

以成员的形式定义的扩展函数, 可以声明为 `open`, 而且可以在子类中覆盖. 也就是说, 在这类扩展函数的派发过程中, 针对派发接受者是虚拟的(virtual), 但针对扩展接受者仍然是静态的(static).

``` kotlin
open class D {
}

class D1 : D() {
}

open class C {
    open fun D.foo() {
        println("D.foo in C")
    }

    open fun D1.foo() {
        println("D1.foo in C")
    }

    fun caller(d: D) {
        d.foo()   // 调用扩展函数
    }
}

class C1 : C() {
    override fun D.foo() {
        println("D.foo in C1")
    }

    override fun D1.foo() {
        println("D1.foo in C1")
    }
}

C().caller(D())   // 打印结果为 "D.foo in C"
C1().caller(D())  // 打印结果为 "D.foo in C1" - 派发接受者的解析过程是虚拟的
C().caller(D1())  // 打印结果为 "D.foo in C" - 扩展接受者的解析过程是静态的
```


## 使用扩展的动机

在 Java 中, 我们通常会使用各种名为 "\*Utils" 的工具类: `FileUtils`, `StringUtils` 等等. 著名的 `java.util.Collections` 也属于这种工具类.
这种工具类模式令人很不愉快的地方在于, 使用时代码会写成这种样子:

``` java
// Java
Collections.swap(list, Collections.binarySearch(list, Collections.max(otherList)), Collections.max(list))
```

代码中反复出现的工具类类名非常烦人. 我们也可以使用静态导入(tatic import), 然后代码会变成这样:

``` java
// Java
swap(list, binarySearch(list, max(otherList)), max(list))
```

这样略好了一点点, 但是没有了类名做前缀, 就导致我们无法利用 IDE 强大的代码自动补完功能. 如果我们能写下面这样的代码, 那不是很好吗:

``` java
// Java
list.swap(list.binarySearch(otherList.max()), list.max())
```

但是我们又不希望将一切可能出现的方法在 `List` 类之内全部都实现出来, 对不对? 这恰恰就是 Kotlin 的扩展机制可以帮助我们解决的问题.
