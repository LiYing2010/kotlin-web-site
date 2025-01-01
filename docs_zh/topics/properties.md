[//]: # (title: 属性(Property))

## 声明属性

Kotlin 类的属性可以使用 `var` 关键字声明为可变(mutable)属性, 也可以使用 `val` 关键字声明为只读属性.

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
    var state: String? = null
    var zip: String = "123456"
}
```

使用属性时, 只需要简单地通过属性名来参照它:

```kotlin
fun copyAddress(address: Address): Address {
    val result = Address() // Kotlin 中没有 'new' 关键字
    result.name = address.name // 将会调用属性的访问器方法
    result.street = address.street
    // ...
    return result
}
```

## 取值方法(Getter)与设值方法(Setter) {id="getters-and-setters"}

声明属性的完整语法是:

```kotlin
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
```

其中的初始化器(initializer), 取值方法(getter), 以及设值方法(setter)都是可选的.
如果属性类型可以通过初始化器自动推断得到, 或者可以通过取值方法的返回值类型推断得到, 则属性类型的声明也可以省略,
示例如下:

```kotlin
var initialized = 1 // 属性类型为 Int, 使用默认的取值方法和设值方法
// var allByDefault: Int? // 错误: 需要明确指定初始化器, 此处会隐含地使用默认的取值方法和设值方法
```

只读属性声明的完整语法与可变属性有两点不同: 由 `val` 开头, 而不是 `var`, 并且不允许指定设值方法:

```kotlin
val simple: Int? // 属性类型为 Int, 使用默认的取值方法, 属性值必须在构造器中初始化
val inferredType = 1 // 属性类型为 Int, 使用默认的取值方法
```

你可以为属性定义自定义的访问方法.
如果定义一个自定义取值方法(Getter), 那么每次读取属性值时都会调用这个方法
(因此你可以用这种方式实现一个计算得到的属性).
下面是一个自定义取值方法的示例:

```kotlin
//sampleStart
class Rectangle(val width: Int, val height: Int) {
    val area: Int // 属性类型是可选的, 因为可以从取值方法的返回类型推断得到
        get() = this.width * this.height
}
//sampleEnd
fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, area=${rectangle.area}")
}
```
{kotlin-runnable="true"}

如果能够从取值方法(Getter)推断得到属性类型, 那么可以省略:

```kotlin
val area get() = this.width * this.height
```

如果你定义一个自定义设值方法(Setter), 那么每次向属性赋值时都会调用这个方法, 属性初始化时除外.
自定义设值方法的示例如下:

```kotlin
var stringRepresentation: String
    get() = this.toString()
    set(value) {
        setDataFromString(value) // 解析字符串内容, 并将解析得到的值赋给对应的其他属性
    }
```

Kotlin 的编程惯例是, 设值方法的参数名称为 `value`, 但如果你喜欢, 也可以选择使用不同的名称.

如果你需要对属性访问方法添加注解, 或者需要改变其可见度, 但又不想修改它的默认实现,
你可以定义这个方法, 但不定义它的实现体:

```kotlin
var setterVisibility: String = "abc"
    private set // 设值方法的可见度为 private, 并使用默认实现

var setterWithAnnotation: Any? = null
    @Inject set // 对设值方法添加 Inject 注解
```

### 属性的后端域变量(Backing Field) {id="backing-fields"}

在 Kotlin 中, 只有需要将域变量(field)作为属性的一部分, 在内存中保存属性值的时候, 才会使用域变量(field).
域变量不能直接声明. 但是, 如果属性需要一个后端域变量(Backing Field), Kotlin 会自动提供.
在属性的取值方法或设值方法中, 使用 `field` 标识符可以引用这个后端域变量:

```kotlin
var counter = 0 // 这里的初始化代码直接赋值给后端域变量
    set(value) {
        if (value >= 0)
            field = value
            // counter = value // 此处会发生栈溢出错误: 使用属性名称 'counter' 会导致设值方法(setter)无限递归调用
    }
```

`field` 标识符只允许在属性的访问器函数内使用.

如果属性 get/set 方法中的任何一个使用了默认实现, 或者在 get/set 方法的自定义实现中通过 `field` 标识符访问属性, 那么编译器就会为属性自动生成后端域变量.

比如, 下面的示例代码中不会存在后端域变量:

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### 后端属性(Backing Property)

如果你希望实现的功能无法通过这种 _隐含的后端域变量_ 方案来解决, 你可以使用 _后端属性(backing property)_ 作为替代方案:

```kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
    get() {
        if (_table == null) {
            _table = HashMap() // 类型参数可以自动推断得到, 不必指定
        }
        return _table ?: throw AssertionError("Set to null by another thread")
    }
```

> 对于 JVM 平台: 如果私有属性的取值方法与设值方法都使用默认实现, 那么对这个属性的访问将被编译器优化,
> 变为直接读写后端域变量, 以避免不必要的函数调用造成性能损失.
>
{style="note"}

## 编译期常数值 {id="compile-time-constants"}

如果只读属性的值在编译期间就能确定, 请使用 `const` 修饰符, 将它标记为 _编译期常数值(compile time constant)_.
这类属性必须满足以下所有条件:

* 必须是顶级属性(Top-level Property), 或者是一个 [`object` 声明](object-declarations.md#object-declarations-overview) 的成员,
  或者是一个 _[同伴对象(Companion object)](object-declarations.md#companion-objects) 的成员.
* 值必须初始化为 `String` 类型, 或基本类型(primitive type)
* 不存在自定义的取值方法

编译器会对常数的使用进行内联(inline), 将对常数的引用替换为常数的实际值. 但是, 常数对应的域变量不会被删除, 因此可以通过使用 [反射](reflection.md) 与它进行交互.

这类属性也可以用在注解内:

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```

## 延迟初始化的(Late-Initialized)属性和变量 {id="late-initialized-properties-and-variables"}

通常, 如果属性声明为非 null 数据类型, 那么属性值必须在构造器内初始化.
但是, 这种限制很多时候会带来一些不便.
比如, 属性值可以通过依赖注入来进行初始化, 或者在单元测试代码的 setup 方法中初始化.
这种情况下, 你就无法在构造器中为属性编写一段非 null 值的初始化代码,
但你仍然希望在类内参照这个属性时能够避免 null 值检查.

要解决这个问题, 你可以为属性添加一个 `lateinit` 修饰符:

```kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp fun setup() {
        subject = TestSubject()
    }

    @Test fun test() {
        subject.method()  // 直接访问属性
    }
}
```

这个修饰符可以用于类主体部分之内声明的 `var` 属性,
(不是主构造器中声明的属性, 而且属性没有自定义的取值方法和设值方法).
也可以用于顶级(top-level)属性和局部变量.
属性或变量的类型必须是非 null 的, 而且不能是基本类型.

在一个 `lateinit` 属性被初始化之前访问它, 会抛出一个特别的异常, 这个异常将会指明被访问的属性, 以及它没有被初始化这一错误.

### 检查 lateinit var 是否已完成初始化

为了检查一个 `lateinit var` 是否已经初始化完成,
可以对 [属性的引用](reflection.md#property-references) 调用 `.isInitialized`:

```kotlin
if (foo::bar.isInitialized) {
    println(foo.bar)
}
```

这种检查只能用于当前代码可以访问到的属性, 因此属性必须定义在当前代码的同一个类中,
或当前代码的外部类中, 或者是同一个源代码文件中的顶级属性.

## 属性的覆盖

参见 [属性的覆盖](inheritance.md#overriding-properties)

## 委托属性(Delegated Property)

最常见的属性只是简单地读取(也有可能会写入)一个后端域变量.
但是, 通过使用自定义的取值方法和设值方法也可以访问属性, 因此可以实现属性的任意复杂的行为.
在第一种极简单的情况与第二种极复杂的情况之间, 还存在一些常见的属性工作模式.
比如: 属性值的延迟加载, 通过指定的键值(key)从 map 中读取数据, 访问数据库, 属性被访问时通知监听器.

这些常见行为可以使用[_委托属性(delegated property)_](delegated-properties.md), 以库的形式实现.
