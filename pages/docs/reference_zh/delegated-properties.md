---
type: doc
layout: reference
category: "Syntax"
title: "委托属性"
---

# 委托属性(Delegated Property)

有许多非常具有共性的属性, 虽然我们可以在每个需要这些属性的类中手工地实现它们,
但是, 如果能够只实现一次, 然后将它放在库中, 供所有需要的类使用, 那将会好很多. 这样的例子包括:

* 延迟加载属性(lazy property): 属性值只在初次访问时才会计算;
* 可观察属性(observable property): 属性发生变化时, 可以向监听器发送通知;
* 将多个属性保存在一个 map 内, 而不是将每个属性保存在一个独立的域内.

为了解决这些问题(以及其它问题), Kotlin 允许 _委托属性(delegated property)_:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Example {
    var p: String by Delegate()
}
```

</div>

委托属性的语法是: `val/var <property name>: <Type> by <expression>`. 其中 *by*{:.keyword} 关键字之后的表达式就是 _委托_,
属性的 `get()` 方法(以及 `set()` 方法) 将被委托给这个对象的 `getValue()` 和 `setValue()` 方法.
属性委托不必实现任何接口, 但必须提供 `getValue()` 函数(对于 *var*{:.keyword} 属性, 还需要 `setValue()` 函数).
示例:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import kotlin.reflect.KProperty

class Delegate {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        return "$thisRef, thank you for delegating '${property.name}' to me!"
    }

    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
        println("$value has been assigned to '${property.name}' in $thisRef.")
    }
}
```

</div>

如果属性 `p` 委托给一个 `Delegate` 的实例, 那么当我们读取属性值时, 就会调用到 `Delegate` 的 `getValue()` 函数,
此时函数收到的第一个参数将是我们访问的属性 `p` 所属的对象实例, 第二个参数将是 `p` 属性本身的描述信息(比如, 你可以从这里得到属性名称).
示例:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val e = Example()
println(e.p)
```

</div>

这段代码的打印结果将是:

```
Example@33a17727, thank you for delegating ‘p’ to me!
```

类似的, 当我们向属性 `p` 赋值时, 将会调用到 `setValue()` 函数. 这个函数收到的前两个参数与 `getValue()` 函数相同, 第三个参数将是即将赋给属性的新值:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
e.p = "NEW"
```

</div>

这段代码的打印结果将是:

```
NEW has been assigned to ‘p’ in Example@33a17727.
```

对属性委托对象的要求, 详细的说明请参见[下文](delegated-properties.html#property-delegate-requirements).

注意, 从 Kotlin 1.1 开始, 你可以在函数内, 或者一个代码段内定义委托属性, 委托属性不需要一定是类的成员.
参见 [示例](delegated-properties.html#local-delegated-properties-since-11).

## 标准委托

Kotlin 标准库中提供了一些工厂方法, 可以实现几种很有用的委托.

### 延迟加载(Lazy)

[`lazy()`](/api/latest/jvm/stdlib/kotlin/lazy.html) 是一个函数, 接受一个 Lambda 表达式作为参数, 返回一个 `Lazy<T>` 类型的实例, 这个实例可以作为一个委托, 实现延迟加载属性(lazy property):
第一次调用 `get()` 时, 将会执行 `lazy()` 函数受到的 Lambda 表达式, 然后会记住这次执行的结果,
以后所有对 `get()` 的调用都只会简单地返回以前记住的结果.

<div class="sample" markdown="1" theme="idea">

```kotlin
val lazyValue: String by lazy {
    println("computed!")
    "Hello"
}

fun main() {
    println(lazyValue)
    println(lazyValue)
}
```

</div>

默认情况下, 延迟加载属性(lazy property)的计算是 **同步的(synchronized)**: 属性值只会在唯一一个线程内计算, 然后所有线程都将得到同样的属性值.
如果委托的初始化计算不需要同步, 多个线程可以同时执行初始化计算, 那么可以向`lazy()` 函数传入一个 `LazyThreadSafetyMode.PUBLICATION` 参数.
相反, 如果你确信初期化计算只可能发生在你访问属性的相同线程之内,
那么可以使用 `LazyThreadSafetyMode.NONE` 模式,
这种模式不会保持线程同步, 因此不会带来这方面的性能损失.


### 可观察属性(Observable)

[`Delegates.observable()`](/api/latest/jvm/stdlib/kotlin.properties/-delegates/observable.html) 函数接受两个参数:
第一个是初始化值, 第二个是属性值变化事件的响应器(handler).
每次我们向属性赋值时, 响应器(handler)都会被调用(在属性赋值处理完成 _之后_).
响应器收到三个参数: 被赋值的属性, 赋值前的旧属性值, 以及赋值后的新属性值:

<div class="sample" markdown="1" theme="idea">

```kotlin
import kotlin.properties.Delegates

class User {
    var name: String by Delegates.observable("<no name>") {
        prop, old, new ->
        println("$old -> $new")
    }
}

fun main() {
    val user = User()
    user.name = "first"
    user.name = "second"
}
```

</div>

如果你希望拦截属性的赋值操作, 并且还能够 "否决" 赋值操作, 那么不要使用 `observable()` 函数, 而应该改用 [`vetoable()`](/api/latest/jvm/stdlib/kotlin.properties/-delegates/vetoable.html) 函数.
传递给 `vetoable` 函数的事件响应器, 会在属性赋值处理执行 _之前_ 被调用.

## 将多个属性保存在一个 map 内

有一种常见的使用场景是将多个属性的值保存在一个 map 之内.
在应用程序解析 JSON, 或者执行某些 “动态(dynamic)” 任务时, 经常会出现这样的需求.
这种情况下, 你可以使用 map 实例本身作为属性的委托.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```

</div>

上例中, 类的构造器接受一个 map 实例作为参数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

</div>

委托属性将从这个 map 中读取属性值(使用属性名称字符串作为 key 值):

<div class="sample" markdown="1" theme="idea">

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}

fun main() {
    val user = User(mapOf(
        "name" to "John Doe",
        "age"  to 25
    ))
//sampleStart
    println(user.name) // 打印结果为: "John Doe"
    println(user.age)  // 打印结果为: 25
//sampleEnd
}
```

</div>

如果不用只读的 `Map`, 而改用值可变的 `MutableMap`, 那么也可以用作 *var*{:.keyword} 属性的委托:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```

</div>

## 局部的委托属性(Local Delegated Property) (从 Kotlin 1.1 开始支持)

你可以将局部变量声明为委托属性.
比如, 你可以为局部变量添加延迟加载的能力:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun example(computeFoo: () -> Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()
    }
}
```

</div>

`memoizedFoo` 变量直到初次访问时才会被计算.
如果 `someCondition` 的判定结果为 false, 那么 `memoizedFoo` 变量完全不会被计算.

## 属性委托的前提条件

下面我们总结一下对属性委托对象的要求.

对于一个 **只读** 属性 (*val*{:.keyword} 属性), 它的委托必须提供 `getValue` 操作符函数, 参数如下:

* `thisRef` --- 这个参数的类型必须与 _属性所属的类_ 相同, 或者是它的基类(对于扩展属性 --- 这个参数的类型必须与被扩展的类型相同, 或者是它的基类).
* `property` --- 这个参数的类型必须是 `KProperty<*>`, 或者是它的基类.

`getValue()` 函数的返回值类型必须与属性类型相同(或者是它的子类型).

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Resource

class Owner {
    val valResource: Resource by ResourceDelegate()
}

class ResourceDelegate {
    operator fun getValue(thisRef: Owner, property: KProperty<*>): Resource {
        return Resource()
    }
}
```

</div>

对于一个 **值可变(mutable)** 属性(*var*{:.keyword} 属性), 除 `getValue` 函数之外, 它的委托还必须另外再提供一个 `setValue` 操作符函数,
参数如下:

* `thisRef` --- 这个参数的类型必须与 _属性所属的类_ 相同, 或者是它的基类(对于扩展属性 --- 这个参数的类型必须与被扩展的类型相同, 或者是它的基类).
* `property` --- 这个参数的类型必须是 `KProperty<*>`, 或者是它的基类.
* `value` --- 这个参数的类型必须与属性类型相同(或者是它的基类).

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Resource

class Owner {
    var varResource: Resource by ResourceDelegate()
}

class ResourceDelegate(private var resource: Resource = Resource()) {
    operator fun getValue(thisRef: Owner, property: KProperty<*>): Resource {
        return resource
    }
    operator fun setValue(thisRef: Owner, property: KProperty<*>, value: Any?) {
        if (value is Resource) {
            resource = value
        }
    }
}
```

</div>

`getValue()` 和 `setValue()` 函数可以是委托类的成员函数, 也可以是它的扩展函数.
如果你需要将属性委托给一个对象, 而这个对象本来没有提供这些函数, 这时使用扩展函数会更便利一些.
这两个函数都需要标记为 `operator`.

委托类可以选择实现 `ReadOnlyProperty` 接口或 `ReadWriteProperty` 接口, 其中包含了需要的 `operator` 方法.
这些接口定义在 Kotlin 标准库内:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
interface ReadOnlyProperty<in R, out T> {
    operator fun getValue(thisRef: R, property: KProperty<*>): T
}

interface ReadWriteProperty<in R, T> {
    operator fun getValue(thisRef: R, property: KProperty<*>): T
    operator fun setValue(thisRef: R, property: KProperty<*>, value: T)
}
```

</div>

### 编译器对委托属性的翻译规则

委托属性的底层实现是, 对每个委托属性, Kotlin 编译器会生成一个辅助属性, 并将目标属性的存取操作委托给它.
比如, 对于属性 `prop`, 会生成一个隐藏的 `prop$delegate` 属性, 然后属性 `prop` 的访问器代码会将存取操作委托给这个新增的属性:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// 编译器实际生成的代码如下:
class C {
    private val prop$delegate = MyDelegate()
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

</div>

Kotlin 编译器通过参数来提供关于 `prop` 属性的所有必须信息: 第一个参数 `this` 指向外层类 `C` 的实例, 第二个参数 `this::prop` 是一个反射对象, 类型为 `KProperty`, 它将描述 `prop` 属性本身.

注意, `this::prop` 语法是一种 [与对象实例绑定的可调用的引用](reflection.html#bound-function-and-property-references-since-11), 这种语法从 Kotlin 1.1 开始支持.  

### 控制属性委托的创建逻辑 (从 Kotlin 1.1 开始支持)

通过定义一个 `provideDelegate` 操作符, 你可以控制属性委托对象的创建逻辑.
如果在 `by` 右侧的对象中定义了名为 `provideDelegate` 的成员函数或扩展函数,
那么这个函数将被调用, 用来创建属性委托对象的实例.

`provideDelegate` 的一种可能的使用场景, 是在属性创建时检查属性的一致性, 而不仅仅是在属性的取值函数或设值函数中检查.

比如, 如果你希望在(属性与其委托对象)绑定之前检查属性名称, 你可以编写这样的代码:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class ResourceDelegate<T> : ReadOnlyProperty<MyUI, T> {
    override fun getValue(thisRef: MyUI, property: KProperty<*>): T { ... }
}

class ResourceLoader<T>(id: ResourceID<T>) {
    operator fun provideDelegate(
            thisRef: MyUI,
            prop: KProperty<*>
    ): ReadOnlyProperty<MyUI, T> {
        checkProperty(thisRef, prop.name)
        // 创建委托
        return ResourceDelegate()
    }

    private fun checkProperty(thisRef: MyUI, name: String) { ... }
}

class MyUI {
    fun <T> bindResource(id: ResourceID<T>): ResourceLoader<T> { ... }

    val image by bindResource(ResourceID.image_id)
    val text by bindResource(ResourceID.text_id)
}
```

</div>

`provideDelegate` 函数的参数与 `getValue` 相同:

* `thisRef` --- 这个参数的类型必须与 _属性所属的类_ 相同, 或者是它的基类(对于扩展属性 --- 这个参数的类型必须与被扩展的类型相同, 或者是它的基类);
* `property` --- 这个参数的类型必须是 `KProperty<*>`, 或者是它的基类.

在 `MyUI` 的实例创建过程中, 将会对各个属性调用 `provideDelegate` 函数, 然后这个函数立即执行必要的验证.

如果不能对属性与其委托对象的绑定过程进行拦截, 要实现同样的功能, 你就必须在参数中明确地传递属性名称, 这就不太方便了:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 如果没有 "provideDelegate" 功能, 我们需要这样来检查属性名称
class MyUI {
    val image by bindResource(ResourceID.image_id, "image")
    val text by bindResource(ResourceID.text_id, "text")
}

fun <T> MyUI.bindResource(
        id: ResourceID<T>,
        propertyName: String
): ReadOnlyProperty<MyUI, T> {
   checkProperty(this, propertyName)
   // 创建委托
}
```

</div>

在编译器生成的代码中, 会调用 `provideDelegate` 方法, 用来初始化辅助属性 `prop$delegate`.
请看属性声明 `val prop: Type by MyDelegate()` 对应的生成代码,
并和[上例](delegated-properties.html#translation-rules)(没有 `provideDelegate` 方法的情况) 的代码对比以下:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
class C {
    var prop: Type by MyDelegate()
}

// 当 'provideDelegate' 函数存在时
// 编译器生成以下代码:
class C {
    // 调用 "provideDelegate" 来创建 "delegate" 辅助属性
    private val prop$delegate = MyDelegate().provideDelegate(this, this::prop)
    var prop: Type
        get() = prop$delegate.getValue(this, this::prop)
        set(value: Type) = prop$delegate.setValue(this, this::prop, value)
}
```

</div>

注意, `provideDelegate` 函数只影响辅助属性的创建, 而不会影响编译产生的属性取值方法和设值方法代码.
