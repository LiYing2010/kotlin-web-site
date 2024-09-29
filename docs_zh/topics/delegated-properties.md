[//]: # (title: 委托属性)

最终更新: %latestDocDate%

有许多非常具有共性的属性, 虽然你可以在每个需要这些属性的类中手工地实现它们,
但是, 如果能够只实现一次, 然后将它放在库中, 供所有需要者重复使用, 那将会很有帮助.
例如:

* _延迟加载(lazy)_ 属性: 属性值只在初次访问时才会计算.
* _可观察(observable)_ 属性: 属性发生变化时, 监听器会收到通知.
* 将多个属性保存在一个 _map_ 内, 而不是将每个属性保存在一个独立的域内.

为了解决这些问题(以及其它问题), Kotlin 允许 _委托属性(delegated property)_:

```kotlin
class Example {
    var p: String by Delegate()
}
```

委托属性的语法是: `val/var <property name>: <Type> by <expression>`.
其中 `by` 关键字之后的表达式就是 _委托_,
属性的 `get()` 方法(以及 `set()` 方法) 将被委托给这个对象的 `getValue()` 和 `setValue()` 方法.
属性委托不必实现接口, 但必须提供 `getValue()` 函数(对于 `var` 属性, 还需要 `setValue()` 函数).

示例:

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

如果属性 `p` 委托给一个 `Delegate` 的实例, 那么当你读取属性值时, 就会调用到 `Delegate` 的 `getValue()` 函数.
此时函数收到的第一个参数将是你访问的属性 `p` 所属的对象实例,
第二个参数将是 `p` 属性本身的描述信息(比如, 你可以从这里得到属性名称).


```kotlin
val e = Example()
println(e.p)
```

这段代码的打印结果将是:

```
Example@33a17727, thank you for delegating 'p' to me!
```

类似的, 当你向属性 `p` 赋值时, 将会调用到 `setValue()` 函数.
这个函数收到的前两个参数与 `getValue()` 函数相同, 第三个参数将是即将赋给属性的新值:

```kotlin
e.p = "NEW"
```

这段代码的打印结果将是:

```
NEW has been assigned to 'p' in Example@33a17727.
```

对属性委托对象的要求, 详细的说明请参见[下文](#property-delegate-requirements).

你可以在函数内, 或者一个代码段内定义委托属性, 委托属性不一定需要是类的成员.
参见 [示例](#local-delegated-properties).

## 标准委托

Kotlin 标准库中提供了一些工厂方法, 可以实现几种很有用的委托.

### 延迟加载(Lazy)属性

[`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html) 是一个函数, 接受一个 Lambda 表达式作为参数,
返回一个 `Lazy<T>` 类型的实例, 这个实例可以作为一个委托, 实现延迟加载(lazy)属性.
第一次调用 `get()` 时, 将会执行 `lazy()` 函数受到的 Lambda 表达式, 然后会记住这次执行的结果.
以后所有对 `get()` 的调用都只会简单地返回以前记住的结果.

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
{kotlin-runnable="true"}

默认情况下, 延迟加载(lazy)属性的计算是 *同步的(synchronized)*:
属性值只会在唯一一个线程内计算, 但所有线程都将得到同样的属性值.
如果委托的初始化计算不需要同步, 多个线程可以同时执行初始化计算, 那么可以向`lazy()` 函数传入一个 `LazyThreadSafetyMode.PUBLICATION` 参数.

如果你确信初期化计算只可能发生在你访问属性的相同线程之内, 那么可以使用 `LazyThreadSafetyMode.NONE` 模式.
这种模式不会保持线程同步, 因此不会带来这方面的性能损失.

### 可观察(Observable)属性

[`Delegates.observable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/observable.html) 函数接受两个参数:
第一个是初始化值, 第二个是属性值变化事件的响应器(handler).

每次你向属性赋值时, 响应器(handler)都会被调用(在属性赋值处理完成 *之后*).
响应器收到三个参数: 被赋值的属性, 赋值前的旧属性值, 以及赋值后的新属性值:

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
{kotlin-runnable="true"}

如果你希望拦截属性的赋值操作, 并且还能够 *否决* 赋值操作, 那么不要使用 `observable()` 函数,
而应该改用 [`vetoable()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.properties/-delegates/vetoable.html) 函数.
传递给 `vetoable` 函数的事件响应器, 会在属性赋值处理执行 *之前* 被调用.

## 委托给另一个属性

属性可以将它的 get 和 set 方法委托到另一个属性.
这种委托可以用于顶级属性和类属性 (包括成员属性和扩展属性).
委托属性可以是:
* 顶级属性
* 同一个类的成员属性, 或扩展属性
* 另一个类的成员属性, 或扩展属性

要将一个属性委托到另一个属性, 请在委托名称中使用 `::` 限定符,
比如, `this::delegate` 或 `MyClass::delegate`.

```kotlin
var topLevelInt: Int = 0
class ClassWithDelegate(val anotherClassInt: Int)

class MyClass(var memberInt: Int, val anotherClassInstance: ClassWithDelegate) {
    var delegatedToMember: Int by this::memberInt
    var delegatedToTopLevel: Int by ::topLevelInt

    val delegatedToAnotherClass: Int by anotherClassInstance::anotherClassInt
}
var MyClass.extDelegated: Int by ::topLevelInt
```

这种功能的用途是, 比如, 如果你希望修改属性名称, 同时又保持向后兼容:
这时可以引入一个新的属性, 将旧的属性标注 `@Deprecated` 注解, 然后将它的实现委托给新属性.

```kotlin
class MyClass {
   var newName: Int = 0
   @Deprecated("Use 'newName' instead", ReplaceWith("newName"))
   var oldName: Int by this::newName
}
fun main() {
   val myClass = MyClass()
   // 注意: 'oldName: Int' 已废弃.
   // 请改为使用 'newName'
   myClass.oldName = 42
   println(myClass.newName) // 42
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

## 将多个属性保存在一个 Map 内

有一种常见的使用场景是将多个属性的值保存在一个 map 之内.
在应用程序解析 JSON, 或者执行某些动态(dynamic)任务时, 经常会出现这样的需求.
这种情况下, 你可以使用 map 实例本身作为属性的委托.

```kotlin
class User(val map: Map<String, Any?>) {
    val name: String by map
    val age: Int     by map
}
```

上例中, 类的构造器接受一个 map 实例作为参数:

```kotlin
val user = User(mapOf(
    "name" to "John Doe",
    "age"  to 25
))
```

委托属性将从这个 map 中读取属性值, 使用属性名称字符串作为 key 值:

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
{kotlin-runnable="true"}

如果不用只读的 `Map`, 而改用值可变的 `MutableMap`, 那么也可以用作 `var` 属性的委托:

```kotlin
class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int     by map
}
```

## 局部的委托属性(Local Delegated Property) {id="local-delegated-properties"}

你可以将局部变量声明为委托属性.
比如, 你可以为局部变量添加延迟加载的能力:

```kotlin
fun example(computeFoo: () -> Foo) {
    val memoizedFoo by lazy(computeFoo)

    if (someCondition && memoizedFoo.isValid()) {
        memoizedFoo.doSomething()
    }
}
```

`memoizedFoo` 变量直到初次访问时才会被计算.
如果 `someCondition` 的判定结果为 false, 那么 `memoizedFoo` 变量完全不会被计算.

## 属性委托的前提条件 {id="property-delegate-requirements"}

对于一个 *只读* 属性 (`val` 属性), 它的委托应该提供 `getValue` 操作符函数, 参数如下:

* `thisRef` 参数, 类型必须与 *属性所属的类* 相同, 或者是它的基类
  (对于扩展属性, 参数类型必须与被扩展的类型相同, 或者是它的基类).
* `property` 参数, 类型必须是 `KProperty<*>`, 或者是它的基类.

`getValue()` 函数的返回值类型必须与属性类型相同(或者是它的子类型).

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

对于一个 *值可变(mutable)* 属性(`var` 属性), 除 `getValue` 函数之外, 它的委托还必须另外再提供一个 `setValue` 操作符函数,
参数如下:

* `thisRef` 参数, 类型必须与 *属性所属的类* 相同, 或者是它的基类
  (对于扩展属性, 参数类型必须与被扩展的类型相同, 或者是它的基类).
* `property` 参数, 类型必须是 `KProperty<*>`, 或者是它的基类.
* `value` 参数, 类型必须与属性类型相同(或者是它的基类).

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

`getValue()` 和 `setValue()` 函数可以是委托类的成员函数, 也可以是它的扩展函数.
如果你需要将属性委托给一个对象, 而这个对象本来没有提供这些函数, 这时使用扩展函数会更便利一些.
这两个函数都需要标记为 `operator`.

通过使用 Kotlin 标准库中的 `ReadOnlyProperty` 和 `ReadWriteProperty` 接口,
可以用匿名对象的方式创建委托, 而不必创建新类.
这些接口提供了需要的方法: `getValue()` 声明在 `ReadOnlyProperty` 接口中;
`ReadWriteProperty` 继承了这个接口, 然后增加了 `setValue()` 方法.
因此在需要 `ReadOnlyProperty` 的地方, 你也可以使用 `ReadWriteProperty`.

```kotlin
fun resourceDelegate(resource: Resource = Resource()): ReadWriteProperty<Any?, Resource> =
    object : ReadWriteProperty<Any?, Resource> {
        var curValue = resource
        override fun getValue(thisRef: Any?, property: KProperty<*>): Resource = curValue
        override fun setValue(thisRef: Any?, property: KProperty<*>, value: Resource) {
            curValue = value
        }
    }

val readOnlyResource: Resource by resourceDelegate()  // 此处 ReadWriteProperty 被转换为 val
var readWriteResource: Resource by resourceDelegate()
```

## 编译器对委托属性的翻译规则 {id="translation-rules-for-delegated-properties"}

委托属性的底层实现是, 对某些类型的委托属性, Kotlin 编译器会生成辅助属性, 并将目标属性的存取操作委托给这些辅助属性.

> 为了优化的目的, 编译器 [对有些情况 _不会_ 生成辅助属性](#optimized-cases-for-delegated-properties).
> 关于优化, 详情请参见 [委托到另一个属性](#translation-rules-when-delegating-to-another-property) 中的示例.
>
{style="note"}

比如, 对于属性 `prop`, 编译器会生成一个隐藏的 `prop$delegate` 属性, 然后属性 `prop` 的访问器代码会将存取操作委托给这个新增的属性:

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

Kotlin 编译器通过参数来提供关于 `prop` 属性的所有必须信息: 第一个参数 `this` 指向外层类 `C` 的实例,
第二个参数 `this::prop` 是一个反射对象, 类型为 `KProperty`, 它将描述 `prop` 属性本身.

### 对委托属性优化的场景 {id="optimized-cases-for-delegated-properties"}

如果委托属性是以下几种情况, 域成员 `$delegate` 会被省略:
* 属性的引用:

  ```kotlin
  class C<Type> {
      private var impl: Type = ...
      var prop: Type by ::impl
  }
  ```

* 命名对象

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }

  val s: String by NamedObject
  ```

* 同一模块内, 带有后端域和默认的 getter 的 final `val` 属性:

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...

  class A {
      val s: String by impl
  }
  ```

* 常数表达式, 枚举值(Enum Entry), `this`, `null`. 以下是 `this` 的例子:

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...

      val s by this
  }
  ```

### 委托到另一个属性时的翻译规则 {id="translation-rules-when-delegating-to-another-property"}

委托到另一个属性时, Kotlin 编译器生成的代码会直接访问被参照的属性.
也就是说, 编译器不会生成域变量 `prop$delegate`. 这样的代码优化可以节约内存.

示例:

```kotlin
class C<Type> {
    private var impl: Type = ...
    var prop: Type by ::impl
}
```

`prop` 变量的属性访问器直接调用 `impl` 变量, 跳过被代理属性的 `getValue` 和 `setValue` 操作,
因此也不需要 `KProperty` 引用对象.

对于上面的代码, 编译器生成以下代码:

```kotlin
class C<Type> {
    private var impl: Type = ...

    var prop: Type
        get() = impl
        set(value) {
            impl = value
        }

    fun getProp$delegate(): Type = impl // 需要这个方法, 只是为了反射功能
}
```

## 控制属性委托的创建逻辑

通过定义一个 `provideDelegate` 操作符, 你可以控制属性委托对象的创建逻辑.
如果在 `by` 右侧的对象中定义了名为 `provideDelegate` 的成员函数或扩展函数,
那么这个函数将被调用, 用来创建属性委托对象的实例.

`provideDelegate` 的一种可能的使用场景, 是在属性初始化时检查属性的一致性.

比如, 如果要在(属性与其委托对象)绑定之前检查属性名称, 你可以编写这样的代码:

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

`provideDelegate` 函数的参数与 `getValue` 相同:

* `thisRef` 参数, 类型必须与 _属性所属的类_ 相同, 或者是它的基类
  (对于扩展属性, 参数类型必须与被扩展的类型相同, 或者是它的基类);
* `property` 参数, 类型必须是 `KProperty<*>`, 或者是它的基类.

在 `MyUI` 的实例创建过程中, 将会对各个属性调用 `provideDelegate` 函数, 然后这个函数立即执行必要的验证.

如果不能对属性与其委托对象的绑定过程进行拦截, 要实现同样的功能, 你就必须在参数中明确地传递属性名称, 这就不太方便了:

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

在编译器生成的代码中, 会调用 `provideDelegate` 方法, 用来初始化辅助属性 `prop$delegate`.
请看属性声明 `val prop: Type by MyDelegate()` 对应的生成代码,
并和[上例](#translation-rules-for-delegated-properties)(没有 `provideDelegate` 方法的情况) 的代码对比以下:

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

注意, `provideDelegate` 函数只影响辅助属性的创建, 而不会影响编译产生的属性取值方法和设值方法代码.

使用标准库中的 `PropertyDelegateProvider` 接口, 可以创建委托提供者(provider), 而不必创建新的类.

```kotlin
val provider = PropertyDelegateProvider { thisRef: Any?, property ->
    ReadOnlyProperty<Any?, Int> {_, property -> 42 }
}
val delegate: Int by provider
```
