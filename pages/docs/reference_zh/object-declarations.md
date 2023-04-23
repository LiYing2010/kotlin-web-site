---
type: doc
layout: reference
category: "Syntax"
title: "对象表达式,对象声明,以及同伴对象"
---

# 对象表达式(Object Expression)与对象声明(Object Declaration)

最终更新: {{ site.data.releases.latestDocDate }}

有时你需要创建一个对象, 这个对象在某个类的基础上略做修改, 但又不希望仅仅为了这一点点修改就明确地声明一个新类.
Kotlin 对这种问题使用 _对象表达式(object expression)_ 和 _对象声明(object declaration)_ 来解决.

## 对象表达式(Object expression)

_对象表达式(object expression)_ 会为匿名类创建对象 , 匿名类就是指没有明确使用 `class` 声明的类.
这些类适合一次性使用. 你可以从头开始定义这种类, 也可以从既有的类继承, 或者实现接口.
匿名类的实例称为 _匿名对象_, 因为它们通过表达式来定义, 而不是通过名称.

### 从头创建匿名对象

对象表达式以 `object` 关键字起始.

如果你只是需要一个对象, 而不需要任何基类型, 可以将这个对象的成员写在 `object` 之后的大括号内:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">
```kotlin

fun main() {
//sampleStart
    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // 对象表达式扩展 Any 类型, 因此对 `toString()` 函数需要 `override`
        override fun toString() = "$hello $world"
    }
//sampleEnd
    print(helloWorld)
}
```
</div>

### 从基类继承匿名对象

要创建一个继承自某个类(或多个类)的匿名类的对象, 需要在 `object` 关键字和冒号(`:`)之后指定基类.
然后实现或覆盖基类的成员, 就和你在 [继承](inheritance.html) 这个基类时一样:

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

如果某个基类有构造器, 那么必须向构造器传递适当的参数.
通过冒号之后的逗号分隔的类型列表, 可以指定多个基类:

```kotlin
open class A(x: Int) {
    public open val y: Int = x
}

interface B { /*...*/ }

val ab: A = object : A(1), B {
    override val y = 15
}
```

### 将匿名对象用作返回类型或值类型

如果匿名对象用作局部的, 或 [private](visibility-modifiers.html#packages) 但不 [inline](inline-functions.html)
声明 (函数或属性) 的类型,
那么通过这个函数或属性的返回值, 可以访问匿名对象的成员:

```kotlin
class C {
    private fun getObject() = object {
        val x: String = "x"
    }

    fun printX() {
        println(getObject().x)
    }
}
```

如果这个函数或属性是 public 的, 或 private 并且 inline 的, 那么它的真实类型为:
* 如果匿名对象没有声明基类型, 则类型为 `Any`
* 如果匿名对象声明了唯一一个基类型, 则类型为这个基类型
* 如果匿名对象声明了多个基类型, 则需要为这个函数或属性明确声明类型

在这些情况中, 通过这个函数或属性的返回值, 对于匿名对象新添加的成员, 不可访问.
对于匿名对象覆盖的成员, 如果定义在这个函数或属性的真实类型中, 则可以访问:

```kotlin
interface A {
    fun funFromA() {}
}
interface B

class C {
    // 返回类型为 Any. x 不可访问
    fun getObject() = object {
        val x: String = "x"
    }

    // 返回类型为 A; x 不可访问
    fun getObjectA() = object: A {
        override fun funFromA() {}
        val x: String = "x"
    }

    // 返回类型为 B; funFromA() 和 x 都不可访问
    fun getObjectB(): B = object: A, B { // 这里需要明确声明返回类型
        override fun funFromA() {}
        val x: String = "x"
    }
}
```

### 通过匿名对象访问变量

对象表达式内的代码可以访问创建这个对象的代码范围内的变量:

```kotlin
fun countClicks(window: JComponent) {
    var clickCount = 0
    var enterCount = 0

    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent) {
            clickCount++
        }

        override fun mouseEntered(e: MouseEvent) {
            enterCount++
        }
    })
    // ...
}
```


{:#object-declarations-overview}
## 对象声明(Object declaration)

[单例模式](http://en.wikipedia.org/wiki/Singleton_pattern) 在有些情况下可能是很有用的,
Kotlin 可以非常便利地声明一个单例:

```kotlin
object DataProviderManager {
    fun registerDataProvider(provider: DataProvider) {
        // ...
    }

    val allDataProviders: Collection<DataProvider>
        get() = // ...
}
```

这样的代码称为一个 _对象声明(object declaration)_, 在 `object` 关键字之后必须指定对象名称.
与变量声明类似, 对象声明不是一个表达式, 因此不能用在赋值语句的右侧.

对象声明中的初始化处理是线程安全的(thread-safe), 而且会在对象初次访问时完成初始化处理.

要引用这个对象, 直接使用它的名称:

```kotlin
DataProviderManager.registerDataProvider(...)
```

这样的对象也可以指定基类:

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
}
```

> 对象声明不可以是局部的(也就是说, 不可以直接嵌套在函数之内),
> 但可以嵌套在另一个对象声明之内, 或者嵌套在另一个非内部类(non-inner class)之内.
{:.note}

### 数据对象

> 数据对象声明是一个 [实验性功能](components-stability.html).
> 它随时有可能变更或被删除.
> 需要通过 [编译器选项](gradle/gradle-compiler-options.html) `compilerOptions.languageVersion.set(KotlinVersion.KOTLIN_1_9)` 进行使用者同意(Opt-in).
{:.note}

如果在 Kotlin 中打印一个普通的 `object` 声明, 你会注意到它的字符串表达包含对象的名称和 hash 值:

```kotlin
object MyObject

fun main() {
    println(MyObject) // 输出结果为: MyObject@1f32e575
}
```

和 [数据类](data-classes.html) 一样, 你可以使用 `data` 修饰符标记你的 `object` 声明,
得到更好格式化的字符串表达, 而不必手动编写它的 `toString` 函数实现:

```kotlin
data object MyObject

fun main() {
    println(MyObject) // 输出结果为: MyObject
}
```

[封闭类(Sealed Class)层级结构](sealed-classes.html) 很适合使用 `data object` 声明,
你可以维持对象与其他数据类的一致性:

```kotlin
sealed class ReadResult {
    data class Number(val value: Int): ReadResult()
    data class Text(val value: String): ReadResult()
    data object EndOfFile: ReadResult()
}

fun main() {
    println(ReadResult.Number(1)) // 输出结果为: Number(value=1)
    println(ReadResult.Text("Foo")) // 输出结果为: Text(value=Foo)
    println(ReadResult.EndOfFile) // 输出结果为: EndOfFile
}
```

### 同伴对象(Companion Object)

一个类内部的对象声明, 可以使用 `companion` 关键字标记为同伴对象:

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```

我们可以直接使用类名称作为限定符来访问同伴对象的成员:

```kotlin
val instance = MyClass.create()
```

同伴对象的名称可以省略, 如果省略, 则会使用默认名称 `Companion`:

```kotlin
class MyClass {
    companion object { }
}

val x = MyClass.Companion
```

类的成员可以访问对应的同伴对象的私有成员.

直接使用一个类的名称时 (而不是将它用作另一个名称前面的限定符) 会被看作是这个类的同伴对象的引用 (无论同伴对象有没有名称):

```kotlin
class MyClass1 {
    companion object Named { }
}

val x = MyClass1

class MyClass2 {
    companion object { }
}

val y = MyClass2
```

注意, 虽然同伴对象的成员看起来很像其他语言中的类的静态成员(static member), 但在运行时期,
这些成员仍然是真实对象的实例的成员, 它们与静态成员是不同的, 举例来说, 它还可以实现接口:

```kotlin
interface Factory<T> {
    fun create(): T
}

class MyClass {
    companion object : Factory<MyClass> {
        override fun create(): MyClass = MyClass()
    }
}

val f: Factory<MyClass> = MyClass
```

但是, 如果使用 `@JvmStatic` 注解, 你可以让同伴对象的成员在 JVM 上被编译为真正的静态方法(static method)和静态域(static field).
详情请参见 [与 Java 的互操作性](jvm/java-to-kotlin-interop.html#static-fields).


### 对象表达式与对象声明在语义上的区别

对象表达式与对象声明在语义上存在一个重要的区别:

* 对象表达式则会在使用处 _立即_ 执行(并且初始化).
* 对象声明是 _延迟(lazily)_ 初始化的, 只会在首次访问时才会初始化.
* 同伴对象会在对应的类被装载(解析)时初始化, 语义上等价于 Java 的静态初始化代码块(static initializer).
