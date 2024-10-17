[//]: # (title: 对象表达式,对象声明,以及同伴对象)

有时你需要创建一个对象, 这个对象在某个类的基础上略做修改, 但又不希望仅仅为了这一点点修改就明确地声明一个新类.
Kotlin 对这种问题使用 _对象表达式(object expression)_ 和 _对象声明(object declaration)_ 来解决.

## 对象表达式(Object expression) {id="object-expressions"}

_对象表达式(object expression)_ 会为匿名类创建对象 , 匿名类就是指没有明确使用 `class` 声明的类.
这些类适合一次性使用. 你可以从头开始定义这种类, 也可以从既有的类继承, 或者实现接口.
匿名类的实例称为 _匿名对象_, 因为它们通过表达式来定义, 而不是通过名称.

### 从头创建匿名对象

对象表达式以 `object` 关键字起始.

如果你只是需要一个对象, 而不需要任何基类型, 可以将这个对象的成员写在 `object` 之后的大括号内:

```kotlin

fun main() {
//sampleStart
    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // 对象表达式继承 Any 类型, 因此对 `toString()` 函数需要 `override`
        override fun toString() = "$hello $world"
    }

    print(helloWorld)
//sampleEnd
}
```
{kotlin-runnable="true"}

### 从基类继承匿名对象

要创建一个继承自某个类(或多个类)的匿名类的对象, 需要在 `object` 关键字和冒号(`:`)之后指定基类.
然后实现或覆盖基类的成员, 就和你在 [继承](inheritance.md) 这个基类时一样:

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

如果匿名对象用作局部的, 或 [private](visibility-modifiers.md#packages) 但不 [inline](inline-functions.md)
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
    // 返回类型为 Any; x 不可访问
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

## 对象声明(Object declaration) {id="object-declarations-overview"}

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
>
{style="note"}

### 数据对象

如果在 Kotlin 中打印一个普通的 `object` 声明, 它的字符串表达包含对象的名称和 hash 值:

```kotlin
object MyObject

fun main() {
    println(MyObject) // 输出结果为: MyObject@1f32e575
}
```

和 [数据类](data-classes.md) 一样, 你可以使用 `data` 修饰符标记 `object` 声明.
这个修饰符会让编译器为你的对象生成一系列的函数:

* `toString()` 返回数据对象的名称
* `equals()`/`hashCode()` 函数对

  > 你不可以为 `data object` 的 `equals` 或 `hashCode` 函数提供自定义实现.
  >
  {style="note"}

数据对象的 `toString()` 函数会返回对象的名称:

```kotlin
data object MyDataObject {
    val x: Int = 3
}

fun main() {
    println(MyDataObject) // 输出结果为 MyDataObject
}
```

`data object` 的 `equals()` 函数会保证你的 `data object` 的所有对象都被看作相等.
大多数情况下, 你的数据对象在运行期只会存在单个实例 (毕竟, `data object` 声明的就是一个单子(singleton)).
但是, 在某些特殊情况下, 也可以在运行期生成相同类型的其他对象 (例如, 通过 `java.lang.reflect` 使用平台的反射功能, 或通过底层使用了这个 API 的 JVM 序列化库),
这个功能可以确保这些对象被当作相等.

> 请确保只对 `data objects` 进行结构化的相等比较 (使用 `==` 操作符), 而不要进行引用相等比较 (使用 `===` 操作符).
> 如果数据对象在运行期有一个以上的实例存在, 这样可以帮助你避免错误.
>
{style="warning"}

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) // 输出结果为 MySingleton
    println(evilTwin) // 输出结果为 MySingleton

    // 即使一个库强行创建了 MySingleton 的第二个实例, 它的 `equals` 方法也会返回 true:
    println(MySingleton == evilTwin) // 输出结果为 true

    // 不要使用 === 比较数据对象.
    println(MySingleton === evilTwin) // 输出结果为 false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin 的反射功能不允许创建数据对象的实例.
    // 这段代码 "强行" 创建新的 MySingleton 实例 (也就是通过 Java 平台的反射功能)
    // 在你的代码中一定不要这样做!
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

编译器生成的 `hashCode()` 函数的行为与 `equals()` 函数保持一致, 因此一个 `data object` 的所有运行期实例都拥有相同的 hash 值.

#### 数据对象与数据类的不同

尽管 `data object` 和 `data class` 声明经常一起使用, 而且很相似, 但对于 `data object` 有一些函数没有生成:

* 没有 `copy()` 函数.
  因为 `data object` 声明通常用作单子对象, 因此不会生成 `copy()` 函数.
  这种单子模式将一个类限定为只有单个实例, 如果允许创建实例的拷贝, 就破坏了只存在单个实例的原则.
* 没有 `componentN()` 函数.
  与 `data class` 不同, `data object` 没有任何数据属性.
  对这种没有数据属性的对象进行解构是没有意义的, 因此不会生成 `componentN()` 函数.

#### 在封闭层级结构(Sealed Hierarchy)中使用数据对象

数据对象声明非常适合在封闭层级结构(Sealed Hierarchy) 中使用, 例如 [封闭类或封闭接口](sealed-classes.md),
这样的方式允许你声明数据类和数据对象, 并保持对称性.
在这个示例中, 将 `EndOfFile` 声明为 `data object`, 而不是普通的 `object`,
代表它自动拥有 `toString()` 函数, 不需要手动的覆盖这个函数:

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) // 输出结果为 Number(number=7)
    println(EndOfFile) // 输出结果为 EndOfFile
}
```
{kotlin-runnable="true" id="data-objects-sealed-hierarchies"}

### 同伴对象(Companion Object) {id="companion-objects"}

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
详情请参见 [与 Java 的互操作性](java-to-kotlin-interop.md#static-fields).

### 对象表达式与对象声明在语义上的区别

对象表达式与对象声明在语义上存在一个重要的区别:

* 对象表达式则会在使用处 _立即_ 执行(并且初始化).
* 对象声明是 _延迟(lazily)_ 初始化的, 只会在首次访问时才会初始化.
* 同伴对象会在对应的类被装载(解析)时初始化, 语义上等价于 Java 的静态初始化代码块(static initializer).
