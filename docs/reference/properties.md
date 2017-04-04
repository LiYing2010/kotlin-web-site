---
type: doc
layout: reference
category: "Syntax"
title: "属性(Property)与字段(Field)"
---

# 属性(Property)与字段(Field)

## 声明属性

Kotlin 中的类可以拥有属性. 可以使用 *var*{: .keyword } 关键字声明为可变(mutable)属性, 也可以使用 *val*{: .keyword } 关键字声明为只读属性.

``` kotlin
public class Address { 
    public var name: String = ...
    public var street: String = ...
    public var city: String = ...
    public var state: String? = ...
    public var zip: String = ...
}
```

使用属性时, 只需要简单地通过属性名来参照它, 和使用 Java 中的字段变量(field)一样:

``` kotlin
fun copyAddress(address: Address): Address {
    val result = Address() // Kotlin 中没有 'new' 关键字
    result.name = address.name // 将会调用属性的访问器方法
    result.street = address.street
    // ...
    return result
}
```

## Getter 和 Setter

声明属性的完整语法是:

``` kotlin
var <propertyName>: <PropertyType> [= <property_initializer>]
    [<getter>]
    [<setter>]
```

其中的initializer, getter, 以及 setter 都是可选的. 如果属性的类型可以通过 initializer 自动推断得到, 或者可以通过这个属性覆盖的基类成员属性推断得到, 则属性的类型声明也可以省略.

示例:

``` kotlin
var allByDefault: Int? // 错误: 需要明确指定 initializer, 此处会隐含地使用默认的 getter 和 setter
var initialized = 1 // 属性类型为 Int, 使用默认的 getter 和 setter
```

只读属性（常量）声明的完整语法与可变属性有两点不同: 由 `val` 开头, 而不是 `var`, 并且不允许指定 setter :

``` kotlin
val simple: Int? // 属性类型为 Int, 使用默认的 getter, 属性值必须在构造器中初始化
val inferredType = 1 // 属性类型为 Int, 使用默认的 getter
```

我们可以编写自定义的访问方法, 与普通的函数很类似, 访问方法的位置就在属性定义体之内. 下面是一个自定义 getter 的示例:

``` kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

自定义 setter 的示例如下:

``` kotlin
var stringRepresentation: String
    get() = this.toString()
    set(value) {
        setDataFromString(value) // 解析字符串内容, 并将解析得到的值赋给对应的其他属性
    }
```

Kotlin 的编程惯例是,  setter 的参数名称为 `value`, 但如果你喜欢, 也可以选择使用不同的名称.

如果你需要改变属性访问方法的可见度, 或者需要对其添加注解, 但又不需要修改它的默认实现, 你可以定义这个方法, 但不定义它的实现体:

``` kotlin
var setterVisibility: String = "abc"
    private set //  setter 的可见度为 private, 并使用默认实现

var setterWithAnnotation: Any? = null
    @Inject set // 对 setter 添加 Inject 注解
```

### 属性的备份字段(Backing Field)

Kotlin 的类不能拥有字段. 但是, 使用属性的自定义访问器时, 有时会需要备份字段(backing field).
为了这种目的, Kotlin 提供了一种自动生成的备份字段, 可以通过 `field` 标识符来访问:

``` kotlin
var counter = 0 // 初始化给定的值将直接写入备份字段中
    set(value) {
        if (value >= 0) field = value
    }
  }
```

`field` 标识符只允许在属性的访问器函数内使用.

如果属性 get/set 方法中的任何一个使用了默认实现, 或者在 get/set 方法的自定义实现中通过 `field` 标识符访问属性, 那么编译器就会为属性自动生成备份字段.

比如, 下面的情况不会存在备份字段:

``` kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### 备份属性(Backing Property)

如果你希望实现的功能无法通过这种 "隐含的备份字段" 方案来解决, 你可以使用 *备份属性(backing property)* 作为替代方案:

``` kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
    get() {
        if (_table == null) {
            _table = HashMap() // 类型参数可以自动推断得到, 不必指定
        }
        return _table ?: throw AssertionError("Set to null by another thread")
    }
```

不管从哪方面看, 这种方案都与 Java 中完全相同, 因为私有的备份属性的 getter 与 setter 都使用默认实现,
我们对这个属性的访问将被编译器优化, 变为直接读写备份字段, 因此不会发生不必要的函数调用, 导致性能损失.


## 编译期常量

如果属性值在编译期间就能确定, 则可以使用 `const` 修饰符, 将属性标记为_编译期常量(compile time constants)_.
这类属性必须满足以下所有条件:

  * 必须是顶级属性（即直接写在文件里面的）, 或者是一个 `object` 的成员
  * 值被初始化为 `String` 类型, 或值类型(primitive type)
  * 不存在自定义的 getter

这类属性可以用在注解内:

``` kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```


## 延迟初始化属性(Late-Initialized Property)

通常, 如果属性声明为非 null 数据类型, 那么属性值必须在构造器内初始化. 但是, 这种限制很多时候会带来一些不便.
比如, 属性值可以通过依赖注入来进行初始化, 或者在单元测试代码的 setup 方法中初始化. 这种情况下, 你就无法在构造器中为属性编写一段非 null 值的初始化代码, 但你仍然希望在类内参照这个属性时能够避免 null 值检查.

要解决这个问题, 你可以为属性添加一个 `lateinit` 修饰符:

``` kotlin
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

这个修饰符只能用于 `var` 属性, 而且只能是声明在类主体部分之内的属性(不可以是主构造器中声明的属性), 而且属性不能有自定义的 getter和 setter. 属性类型必须是非 null 的, 而且不能是值类型.

在一个 `lateinit` 属性被初始化之前访问它, 会抛出一个特别的异常, 这个异常将会指明被访问的属性, 以及它没有被初始化这一错误.

## 属性的覆盖

参见 [属性的覆盖](classes.html#overriding-properties)

## 委托属性(Delegated Property)
  
最常见的属性只是简单地读取(也有可能会写入)一个备份字段. 但是, 通过使用自定义的 getter 和 setter, 我们可以实现属性任意复杂的行为.
在这两种极端情况之间, 还存在一些非常常见的属性工作模式. 比如: 属性值的惰性求值, 通过指定的键值(key)从 map 中读取数据, 访问数据库, 属性被访问时通知监听器, 等等.

这些常见行为可以使用[_委托属性(delegated property)_](delegated-properties.html), 以库的形式实现.
