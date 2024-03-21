---
type: doc
layout: reference
category: "Classes and Objects"
title: "内联的值类(Inline value class)"
---

# 内联的值类(Inline value class)

最终更新: {{ site.data.releases.latestDocDate }}

如果将值封装到类中, 创建一些特定领域的类型, 有时候会非常有用. 但是, 这就会产生堆上的内存分配, 带来运行时的性能损失.
更坏的情况下, 如果被包装的类是基本类型, 那么性能损失会非常严重, 因为在运行时对基本类型本来可以进行极大地性能优化, 而它的包装类却不能享受这种好处.

为了解决这类问题, Kotlin 引入了一种特别的类, 称为 _内联类(inline class)_,
内联类是 [基于值的类(value-based class)](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md)的一个子集.
这种类没有标识符, 只用于包含值.

声明内联类时, 在类名称之前添加 `value` 修饰符:

```kotlin
value class Password(private val s: String)
```

要在 JVM 后端上声明内联类, 需要在类的定义之前使用 `value` 修饰符和 `@JvmInline` 注解:

```kotlin
// 针对 JVM 后端
@JvmInline
value class Password(private val s: String)
```

内联类必须拥有唯一的一个属性, 并在主构造器中初始化这个属性.
在运行期, 会使用这个唯一的属性来表达内联类的实例(关于运行期的内部表达, 请参见 [下文](#representation)):

```kotlin
// 'Password' 类的实例不会真实存在
// 在运行期, 'securePassword' 只包含 'String'
val securePassword = Password("Don't try this in production")
```

这就是内联类的主要功能, 受 *内联* 这个名称的启发而来: 类中的数据被 *内联* 到使用它的地方
(类似于 [内联函数](inline-functions.html) 的内容被内联到调用它的地方).

## 成员

内联类支持与通常的类相同的功能.
具体来说, 内联类可以声明属性和函数, 也可以有 `init` 代码段和 [次级构造器(secondary constructor)](classes.html#secondary-constructors):

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.9">

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    init {
        require(fullName.isNotEmpty()) {
            "Full name shouldn't be empty"
        }
    }

    constructor(firstName: String, lastName: String) : this("$firstName $lastName") {
        require(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }

    val length: Int
        get() = fullName.length

    fun greet() {
        println("Hello, $fullName")
    }
}

fun main() {
    val name1 = Person("Kotlin", "Mascot")
    val name2 = Person("Kodee")
    name1.greet() // `greet()` 函数会作为静态方法来调用
    println(name2.length) // 属性的取值函数会作为静态方法来调用
}
```

</div>

内联类的属性不能拥有 [后端域变量](properties.html#backing-fields).
只能拥有简单的计算属性 (不能拥有 `lateinit` 属性或委托属性)


## 继承

内联类允许继承接口:

```kotlin
interface Printable {
    fun prettyPrint(): String
}

@JvmInline
value class Name(val s: String) : Printable {
    override fun prettyPrint(): String = "Let's $s!"
}

fun main() {
    val name = Name("Kotlin")
    println(name.prettyPrint()) // 仍然是调用静态方法
}
```

禁止内联类参与类继承. 也就是说, 内联类不能继承其他类, 而且它永远是 `final` 类, 不能被其他类继承.

## 内部表达

在通常的代码中, Kotlin 编译器会对每个内联类保留一个 *包装*.
内联类的实例在运行期可以表达为这个包装, 也可以表达为它的底层类型.
类似于 `Int` 可以 [表达](numbers.html#numbers-representation-on-the-jvm) 为基本类型 `int`,
也可以表达为包装类 `Integer`.

Kotlin 编译器会优先使用底层类型而不是包装类, 这样可以产生最优化的代码, 运行时的性能也会最好.
但是, 有些时候会需要保留包装类. 一般来说, 当内联类被用作其他类型时, 它会被装箱(box).

```kotlin
interface I

@JvmInline
value class Foo(val i: Int) : I

fun asInline(f: Foo) {}
fun <T> asGeneric(x: T) {}
fun asInterface(i: I) {}
fun asNullable(i: Foo?) {}

fun <T> id(x: T): T = x

fun main() {
    val f = Foo(42)

    asInline(f)    // 拆箱: 用作 Foo 本身
    asGeneric(f)   // 被装箱: 被用作泛型类型 T
    asInterface(f) // 被装箱: 被用作类型 I
    asNullable(f)  // 被装箱: 被用作 Foo?, 这个类型与 Foo 不同

    // 下面的例子中, 'f' 首先被装箱(传递给 'id' 函数), 然后被拆箱 (从 'id' 函数返回)
    // 最终, 'c' 中包含拆箱后的表达(也就是 '42'), 与 'f' 一样
    val c = id(f)  
}
```

由于内联类可以表达为底层类型和包装类两种方式, [引用相等性](equality.html#referential-equality) 对于内联类是毫无意义的,
因此禁止对内联类进行引用相等性判断操作.

内联类也可以使用泛型类型参数作为底层类型. 这种情况下, 编译器将它映射为 `Any?`,
或者更一般的说, 映射为类型参数的上界(Upper Bound).

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // 编译器生成的代码是 fun compute-<hashcode>(s: Any?)
```

### 函数名称混淆

由于内联类被编译为它的底层类型, 因此可能会导致一些令人难以理解的错误, 比如, 意料不到的平台签名冲突:

```kotlin
@JvmInline
value class UInt(val x: Int)

// 在 JVM 平台上表达为 'public final void compute(int x)'
fun compute(x: Int) { }

// 在 JVM 平台上也表达为 'public final void compute(int x)'!
fun compute(x: UInt) { }
```

为了解决这种问题, 使用内联类的函数会被进行名称 _混淆_, 方法是对函数名添加一些稳定的哈希值.
因此, `fun compute(x: UInt)` 会表达为 `public final void compute-<hashcode>(int x)`,
然后就解决了函数名称的冲突问题.

### 在 Java 代码中调用

你可以在 Java 代码中调用接受内联类为参数的函数. 为了实现这一点, 你需要手动禁止函数名称混淆:
在函数声明之前添加 `@JvmName` 注解:

```kotlin
@JvmInline
value class UInt(val x: Int)

fun compute(x: Int) { }

@JvmName("computeUInt")
fun compute(x: UInt) { }
```

## 内联类与类型别名

初看起来, 内联类似乎非常象 [类型别名](type-aliases.html). 确实, 它们都声明了一个新的类型, 并且在运行期都表达为各自的底层类型.

但是, 主要的差别在于, 类型别名与它的底层类型是 *赋值兼容* 的 (与同一个底层类型的另一个类型别名, 也是兼容的), 而内联类不是如此.

也就是说, 内联类会生成一个真正的 _新_ 类型,
相反, 类型别名只是给既有的类型定义了一个新的名字(也就是别名):

```kotlin
typealias NameTypeAlias = String

@JvmInline
value class NameInlineClass(val s: String)

fun acceptString(s: String) {}
fun acceptNameTypeAlias(n: NameTypeAlias) {}
fun acceptNameInlineClass(p: NameInlineClass) {}

fun main() {
    val nameAlias: NameTypeAlias = ""
    val nameInlineClass: NameInlineClass = NameInlineClass("")
    val string: String = ""

    acceptString(nameAlias) // 正确: 需要底层类型的地方, 可以传入类型别名
    acceptString(nameInlineClass) // 错误: 需要底层类型的地方, 不能传入内联类

    // 反过来:
    acceptNameTypeAlias(string) // 正确: 需要类型别名的地方, 可以传入底层类型
    acceptNameInlineClass(string) // 错误: 需要内联类的地方, 不能传入底层类型
}
```

## 内联类与代理

对于接口, 允许将它的实现代理给内联类的内联值:

```kotlin
interface MyInterface {
    fun bar()
    fun foo() = "foo"
}

@JvmInline
value class MyInterfaceWrapper(val myInterface: MyInterface) : MyInterface by myInterface

fun main() {
    val my = MyInterfaceWrapper(object : MyInterface {
        override fun bar() {
            // 函数体
        }
    })
    println(my.foo()) // 输出为 "foo"
}
```
