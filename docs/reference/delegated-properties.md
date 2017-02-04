---
type: doc
layout: reference
category: "Syntax"
title: "委托属性"
---

# 委托属性(Delegated Property)

有许多非常具有共性的属性, 虽然我们可以在每个需要这些属性的类中手工地实现它们, 但是, 如果能够只实现一次, 然后将它放在库中, 供所有需要的类使用, 那将会好很多. 这样的例子包括:

* 延迟加载属性(lazy property): 属性值只在初次访问时才会计算,
* 可观察属性(observable property): 属性发生变化时, 可以向监听器发送通知,
* 将多个属性保存在一个 map 内, 而不是保存在多个独立的域内.

为了解决这些问题(以及其它问题), Kotlin 允许 _委托属性(delegated property)_:

``` kotlin
class Example {
    var p: String by Delegate()
}
```

委托属性的语法是: `val/var <property name>: <Type> by <expression>`. 其中 *by*{:.keyword} 关键字之后的表达式就是 _委托_, 属性的 `get()` 方法(以及 `set()` 方法) 将被委托给这个对象的 `getValue()` 和 `setValue()` 方法.
属性委托不必实现任何接口, 但必须提供 `getValue()` 函数(对于 *var*{:.keyword} 属性, 还需要 `setValue()` 函数).
示例:

``` kotlin
class Delegate {
    operator fun getValue(thisRef: Any?, property: KProperty<*>): String {
        return "$thisRef, thank you for delegating '${property.name}' to me!"
    }
 
    operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {
        println("$value has been assigned to '${property.name} in $thisRef.'")
    }
}
```

如果属性 `p` 委托给一个 `Delegate` 的实例, 那么当我们读取属性值时, 就会调用到 `Delegate` 的 `getValue()` 函数, 此时函数收到的第一个参数将是我们访问的属性 `p` 所属的对象实例, 第二个参数将是 `p` 属性本身的描述信息(比如, 你可以从这里得到属性名称). For example:

``` kotlin
val e = Example()
println(e.p)
```

这段代码的打印结果将是:

```
Example@33a17727, thank you for delegating ‘p’ to me!
```

类似的, 当我们向属性 `p` 赋值时, 将会调用到 `setValue()` 函数. 这个函数收到的前两个参数与 `getValue()` 函数相同, 第三个参数将是即将赋给属性的新值:

``` kotlin
e.p = "NEW"
```

这段代码的打印结果将是:

```
NEW has been assigned to ‘p’ in Example@33a17727.
```

## 属性委托的前提条件

下面我们总结一下对属性委托对象的要求.

对于一个 **只读** 属性 (也就是说, *val*{:.keyword} 属性), 它的委托必须提供一个名为 `getValue` 的函数, 这个函数接受以下参数:

* receiver --- 这个参数的类型必须与 _属性所属的类_ 相同, 或者是它的基类(对于扩展属性 --- 这个参数的类型必须与被扩展的类型相同, 或者是它的基类),
* metadata --- 这个参数的类型必须是 `KProperty<*>`, 或者是它的基类,

这个函数的返回值类型必须与属性类型相同(或者是它的子类型).

对于一个 **值可变(mutable)** 属性(也就是说, *var*{:.keyword} 属性), 除  `getValue` 函数之外, 它的委托还必须 _另外再_ 提供一个名为 `setValue` 的函数, 这个函数接受以下参数:

* receiver --- 与 `getValue()` 函数的参数相同,
* metadata --- 与 `getValue()` 函数的参数相同,
* new value --- 这个参数的类型必须与属性类型相同, 或者是它的基类.

`getValue()` 和 `setValue()` 函数可以是委托类的成员函数, 也可以是它的扩展函数.
如果你需要将属性委托给一个对象, 而这个对象本来没有提供这些函数, 这时使用扩展函数会更便利一些.
这两个函数都需要标记为 `operator`.


## 标准委托

Kotlin 标准库中提供了一些工厂方法, 可以实现几种很有用的委托.

### 延迟加载(Lazy)

`lazy()` 是一个函数, 接受一个 Lambda 表达式作为参数, 返回一个 `Lazy<T>` 类型的实例, 这个实例可以作为一个委托, 实现延迟加载属性(lazy property):
第一次调用 `get()` 时, 将会执行 `lazy()` 函数受到的 Lambda 表达式, 然后会记住这次执行的结果,
以后所有对 `get()` 的调用都只会简单地返回以前记住的结果.


``` kotlin
val lazyValue: String by lazy {
    println("computed!")
    "Hello"
}

fun main(args: Array<String>) {
    println(lazyValue)
    println(lazyValue)
}
```

上面的示例代码打印的结果将是:

```
computed!
Hello
Hello
```

默认情况下, 延迟加载属性(lazy property)的计算是 **同步的(synchronized)**: 属性值只会在唯一一个线程内计算, 然后所有线程都将得到同样的属性值. 如果委托的初始化计算不需要同步, 多个线程可以同时执行初始化计算, 那么可以向`lazy()` 函数传入一个 `LazyThreadSafetyMode.PUBLICATION` 参数.
相反, 如果你确信初期化计算只可能发生在一个线程内, 那么可以使用 `LazyThreadSafetyMode.NONE` 模式,
这种模式不会保持线程同步, 因此不会带来这方面的性能损失.


### 可观察属性(Observable)

`Delegates.observable()` 函数接受两个参数: 第一个是初始化值, 第二个是属性值变化事件的响应器(handler).
每次我们向属性赋值时, 响应器(handler)都会被调用(在属性赋值处理完成 _之后_). 响应器收到三个参数: 被赋值的属性, 赋值前的旧属性值, 以及赋值后的新属性值:

``` kotlin
import kotlin.properties.Delegates

class User {
    var name: String by Delegates.observable("<no name>") {
        prop, old, new ->
        println("$old -> $new")
    }
}

fun main(args: Array<String>) {
    val user = User()
    user.name = "first"
    user.name = "second"
}
```

上面的示例代码打印的结果将是:

```
<no name> -> first
first -> second
```

如果你希望能够拦截属性的赋值操作, 并且还能够 "否决" 赋值操作, 那么不要使用 `observable()` 函数, 而应该改用 `vetoable()` 函数.
传递给 `vetoable` 函数的事件响应器, 会在属性赋值处理执行 _之前_ 被调用.

## 将多个属性保存在一个 map 内

有一种常见的使用场景是将多个属性的值保存在一个 map 之内.
在应用程序解析 JSON, 或者执行某些 “动态(dynamic)” 任务时, 经常会出现这样的需求.
这种情况下, 你可以使用 map 实例本身作为属性的委托.

``` kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```

上例中, 类的构造器接受一个 map 实例作为参数:

``` kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

委托属性将从这个 map 中读取属性值(使用属性名称字符串作为 key 值):


``` kotlin
println(user.name) // 打印结果为: "John Doe"
println(user.age)  // 打印结果为: 25
```

如果不用只读的 `Map`, 而改用值可变的 `MutableMap`, 那么也可以用作 *var*{:.keyword} 属性的委托:

``` kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```
