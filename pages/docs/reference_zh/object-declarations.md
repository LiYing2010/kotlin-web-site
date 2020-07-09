---
type: doc
layout: reference
category: "Syntax"
title: "对象表达式,对象声明,以及伴随对象"
---

# 对象表达式(Object Expression)与对象声明(Object Declaration)

有时我们需要创建一个对象, 这个对象在某个类的基础上略做修改, 但又不希望仅仅为了这一点点修改就明确地声明一个新类.
Kotlin 使用 *对象表达式(object expression)* 和 *对象声明(object declaration)* 来解决这种问题.

## 对象表达式(Object expression)

要创建一个继承自某个类(或多个类)的匿名类的对象, 我们需要写这样的代码:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```
</div>

如果某个基类有构造器, 那么必须向构造器传递适当的参数.
通过冒号之后的逗号分隔的类型列表, 可以指定多个基类:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class A(x: Int) {
    public open val y: Int = x
}

interface B { /*...*/ }

val ab: A = object : A(1), B {
    override val y = 15
}
```
</div>

如果, 我们 "只需要对象", 而不需要继承任何有价值的基类, 我们可以简单地写:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun foo() {
    val adHoc = object {
        var x: Int = 0
        var y: Int = 0
    }
    print(adHoc.x + adHoc.y)
}
```
</div>

注意, 只有在局部并且私有的声明范围内, 匿名对象才可以被用作类型.
如果你将匿名对象用作公开函数的返回类型, 或者用作公开属性的类型, 那么这个函数或属性的真实类型会被声明为这个匿名对象的超类,
如果匿名对象没有超类, 则是 `Any`. 在匿名对象中添加的成员将无法访问.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class C {
    // 私有函数, 因此它的返回类型为匿名对象类型
    private fun foo() = object {
        val x: String = "x"
    }

    // 公开函数, 因此它的返回类型为 Any
    fun publicFoo() = object {
        val x: String = "x"
    }

    fun bar() {
        val x1 = foo().x        // 正确
        val x2 = publicFoo().x  // 错误: 无法找到 'x'
    }
}
```
</div>

对象表达式内的代码可以访问创建这个对象的代码范围内的变量.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
</div>

## 对象声明(Object declaration)

[单例模式](http://en.wikipedia.org/wiki/Singleton_pattern) 在有些情况下可能是很有用的,
Kotlin (继 Scala 之后) 可以非常便利地声明一个单例:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
object DataProviderManager {
    fun registerDataProvider(provider: DataProvider) {
        // ...
    }

    val allDataProviders: Collection<DataProvider>
        get() = // ...
}
```
</div>

这样的代码称为一个 *对象声明(object declaration)*, 在 *object*{: .keyword } 关键字之后必须指定对象名称.
与变量声明类似, 对象声明不是一个表达式, 因此不能用在赋值语句的右侧.

对象声明中的初始化处理是线程安全的(thread-safe), 而且会在对象初次访问时完成初始化处理.

要引用这个对象, 我们直接使用它的名称:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
DataProviderManager.registerDataProvider(...)
```
</div>

这样的对象也可以指定基类:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
}
```
</div>

**注意**: 对象声明不可以是局部的(也就是说, 不可以直接嵌套在函数之内), 但可以嵌套在另一个对象声明之内, 或者嵌套在另一个非内部类(non-inner class)之内.


### 同伴对象(Companion Object)

一个类内部的对象声明, 可以使用 *companion*{: .keyword } 关键字标记为同伴对象:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```
</div>

我们可以直接使用类名称作为限定符来访问同伴对象的成员:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val instance = MyClass.create()
```
</div>

同伴对象的名称可以省略, 如果省略, 则会使用默认名称 `Companion`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class MyClass {
    companion object { }
}

val x = MyClass.Companion
```
</div>

直接使用一个类的名称时 (而不是将它用作另一个名称前面的限定符) 会被看作是这个类的同伴对象的引用 (无论同伴对象有没有名称):

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
</div>

注意, 虽然同伴对象的成员看起来很像其他语言中的类的静态成员(static member), 但在运行时期,
这些成员仍然是真实对象的实例的成员, 它们与静态成员是不同的, 举例来说, 它还可以实现接口:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
</div>

但是, 如果使用 `@JvmStatic` 注解, 你可以让同伴对象的成员在 JVM 上被编译为真正的静态方法(static method)和静态域(static field).
详情请参见 [与 Java 的互操作性](java-to-kotlin-interop.html#static-fields).


### 对象表达式与对象声明在语义上的区别

对象表达式与对象声明在语义上存在一个重要的区别:

* 对象表达式则会在使用处 **立即** 执行(并且初始化);
* 对象声明是 **延迟(lazily)** 初始化的, 只会在首次访问时才会初始化;
* 同伴对象会在对应的类被装载(解析)时初始化, 语义上等价于 Java 的静态初始化代码块(static initializer).
