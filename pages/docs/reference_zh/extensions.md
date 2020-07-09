---
type: doc
layout: reference
category: "Syntax"
title: "扩展"
---

# 扩展

Kotlin 提供了向一个类扩展新功能的能力,
而且不必从这个类继承, 也不必使用 Decorator 之类的设计模式.
这种功能是通过一种特殊的声明来实现的, Kotlin 中称为 _扩展(extension)_.
比如, 第三方库中的类是你无法修改的, 但你可以为它编写新的函数.
这些函数可以象原来的类的方法那样调用.
这种机制称为 _扩展函数(extension function)_.
此外还有 _扩展属性(extension property)_, 你可以用来向已有的类添加新的属性.

## 扩展函数(Extension Function)

要声明一个扩展函数, 我们需要在函数名之前添加前缀, 表示这个函数的 _接收者类型(receiver type)_, 也就是说, 表明我们希望扩展的对象类型.
以下示例将为 `MutableList<Int>` 类型添加一个 `swap` 函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' 指代 list 实例
    this[index1] = this[index2]
    this[index2] = tmp
}
```

</div>

在扩展函数内, *this*{: .keyword } 关键字指代接收者对象(receiver object)(也就是调用扩展函数时, 在点号之前指定的对象实例).
现在, 我们可以对任意一个 `MutableList<Int>` 对象调用这个扩展函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val list = mutableListOf(1, 2, 3)
list.swap(0, 2) // 'swap()' 函数内的 'this' 将指向 'list' 的值
```

</div>

显然, 这个函数可以适用与任意元素类型的 `MutableList<T>`, 因此我们可以使用泛型, 将它的元素类型泛化:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' 指代 list 实例
    this[index1] = this[index2]
    this[index2] = tmp
}
```

</div>

我们在函数名之前声明了泛型的类型参数, 然后在接收者类型表达式中就可以使用泛型了.
参见 [泛型函数](generics.html).

## 扩展函数是**静态**解析的

扩展函数并不会真正修改它所扩展的类. 定义扩展函数时, 其实并没有向类中插入新的成员方法, 而只是创建了一个新的函数,
并且可以通过点号标记法的形式, 对这个数据类型的变量调用这个新函数.

我们希望强调一下, 扩展函数的调用派发过程是**静态的**, 也就是说, 它并不是接收者类型的虚拟成员.
这就意味着, 调用扩展函数时, 具体被调用的函数是哪一个, 是通过调用函数的对象表达式的类型来决定的,
而不是在运行时刻表达式动态计算的最终结果类型决定的. 比如:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    open class Shape

    class Rectangle: Shape()

    fun Shape.getName() = "Shape"

    fun Rectangle.getName() = "Rectangle"

    fun printClassName(s: Shape) {
        println(s.getName())
    }    

    printClassName(Rectangle())
//sampleEnd
}
```
</div>

这段示例程序的打印结果将是 "_Shape_",
因为调用哪个函数, 仅仅是由参数 `s` 声明的类型决定, 这里参数 `s` 的类型为 `Shape` 类.

如果类中存在成员函数, 同时又在同一个类上定义了同名的扩展函数, 并且与调用时指定的参数匹配,
这种情况下 **总是会优先使用成员函数**.
比如:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Class method") }
    }

    fun Example.printFunctionType() { println("Extension function") }

    Example().printFunctionType()
//sampleEnd
}
```
</div>

这段代码的输出将是 "_Class method_".

但是, 我们完全可以使用同名称但不同参数的扩展函数, 来重载(overload)成员函数:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Class method") }
    }

    fun Example.printFunctionType(i: Int) { println("Extension function") }

    Example().printFunctionType(1)
//sampleEnd
}
```
</div>

## 可为空的接收者(Nullable Receiver)

注意, 对可以为空的接收者类型也可以定义扩展.
这样的扩展函数, 即使在对象变量值为 null 时也可以调用, 在扩展函数的实现体之内, 可以通过 `this == null` 来检查接收者是否为 null.
在 Kotlin 中允许你调用 toString() 函数, 而不必检查对象是否为 null, 就是通过这个原理实现的: 对象是否为 null 的检查发生在扩展函数内部, 因此调用者不必再做检查.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // 进行过 null 检查后, 'this' 会被自动转换为非 null 类型, 因此下面的 toString() 方法
    // 会被解析为 Any 类的成员函数
    return toString()
}
```

</div>

## 扩展属性(Extension Property)

与扩展函数类似, Kotlin 也支持扩展属性:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```

</div>

注意, 由于扩展属性实际上不会向类添加新的成员, 因此无法让一个扩展属性拥有一个 [后端域变量](properties.html#backing-fields).
所以, **对于扩展属性不允许存在初始化器**.
扩展属性的行为只能通过明确给定的取值方法与设值方法来定义.

示例:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val House.number = 1 // 错误: 扩展属性不允许存在初始化器
```
</div>


## 对同伴对象(Companion Object)的扩展

如果一个类定义了[同伴对象](object-declarations.html#companion-objects),
你可以对这个同伴对象定义扩展函数和扩展属性.
与同伴对象的常规成员一样, 可以只使用类名限定符来调用这些扩展函数和扩展属性:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
class MyClass {
    companion object { }  // 通过 "Companion" 来引用这个同伴对象
}

fun MyClass.Companion.printCompanion() { println("companion") }

fun main() {
    MyClass.printCompanion()
}
```

</div>


## 扩展的范围

大多数时候我们会在顶级位置定义扩展, 也就是直接定义在包之下:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
```
</div>

要在扩展定义所在的包之外使用扩展, 我们需要在调用处 import 这个包:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```
</div>

详情请参见 [导入](packages.html#imports).

## 将扩展定义为成员

在类的内部, 你可以为另一个类定义扩展. 在这类扩展中, 存在多个 _隐含接受者(implicit receiver)_ -
这些隐含接收者的成员可以不使用限定符直接访问.
扩展方法的定义所在的类的实例, 称为_派发接受者(dispatch receiver)_, 扩展方法的目标类型的实例, 称为 _扩展接受者(extension receiver)_.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
     fun printPort() { print(port) }

     fun Host.printConnectionString() {
         printHostname()   // 这里会调用 Host.printHostname()
         print(":")
         printPort()   // 这里会调用 Connection.printPort()
     }

     fun connect() {
         /*...*/
         host.printConnectionString()   // 这里会调用扩展函数
     }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    //Host("kotl.in").printConnectionString(443)  // 错误, 在 Connection 之外无法访问扩展函数
}
```

</div>

当派发接受者与扩展接受者的成员名称发生冲突时, 扩展接受者的成员将会被优先使用.
如果想要使用派发接受者的成员, 请参见 [带限定符的 `this` 语法](this-expressions.html#qualified).

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Connection {
    fun Host.getConnectionString() {
        toString()         // 这里会调用 Host.toString()
        this@Connection.toString()  // 这里会调用 Connection.toString()
    }
}
```
</div>

以成员的形式定义的扩展函数, 可以声明为 `open`, 而且可以在子类中覆盖.
也就是说, 在这类扩展函数的派发过程中, 针对派发接受者是虚拟的(virtual), 但针对扩展接受者仍然是静态的(static).

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
open class Base { }

class Derived : Base() { }

open class BaseCaller {
    open fun Base.printFunctionInfo() {
        println("Base extension function in BaseCaller")
    }

    open fun Derived.printFunctionInfo() {
        println("Derived extension function in BaseCaller")
    }

    fun call(b: Base) {
        b.printFunctionInfo()   // 这里会调用扩展函数
    }
}

class DerivedCaller: BaseCaller() {
    override fun Base.printFunctionInfo() {
        println("Base extension function in DerivedCaller")
    }

    override fun Derived.printFunctionInfo() {
        println("Derived extension function in DerivedCaller")
    }
}

fun main() {
    BaseCaller().call(Base())   // 输出结果为 "Base extension function in BaseCaller"
    DerivedCaller().call(Base())  // 输出结果为 "Base extension function in DerivedCaller" - 派发接受者的解析过程是虚拟的
    DerivedCaller().call(Derived())  // 输出结果为 "Base extension function in DerivedCaller" - 扩展接受者的解析过程是静态的
}
```
</div>

## 关于可见度的注意事项

扩展函数或扩展属性 [对其他元素的可见度](visibility-modifiers.html) 规则, 与定义在同一范围内的普通函数相同. 比如:

* 定义在源代码文件顶级(top-level)范围内的扩展, 可以访问同一源代码文件内的其他顶级 `private` 元素;
* 如果扩展定义在它的接受者类型的外部, 那么这样的扩展不能访问接受者的 `private` 成员.
