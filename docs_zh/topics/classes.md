[//]: # (title: 类)

最终更新: %latestDocDate%

Kotlin 中的类使用 `class` 关键字定义:

```kotlin
class Person { /*...*/ }
```

类的定义由以下几部分组成: 类名, 类头部(指定类的类型参数, 主构造器, 以及其他内容),
以及由大括号括起的类主体部分.
类的头部和主体部分都是可选的; 如果类没有主体部分, 那么大括号也可以省略.

```kotlin
class Empty
```

## 构造器 {id="constructors"}

Kotlin 中的类有一个 _主构造器(primary constructor)_, 此外还可以有一个或多个 _次构造器(secondary constructor)_.
主构造器在类头部中声明, 位于类名称以及可选的类型参数之后.

```kotlin
class Person constructor(firstName: String) { /*...*/ }
```

如果主构造器没有任何注解(annotation), 也没有任何可见度修饰符, 那么 `constructor` 关键字可以省略:

```kotlin
class Person(firstName: String) { /*...*/ }
```

主构造器初始化类的实例, 以及它在类头部中的属性. 类头部不能包含任何可执行的代码.
如果你想要在对象创建时运行某些代码, 可以使用类 body 中的 _初始化代码段(initializer block)_.
初始化代码段使用 `init` 关键字来定义, 之后是大括号. 请将你想要运行的代码放在大括号之内.

在类的实例初始化过程中, 初始化代码段按照它们在类主体中出现的顺序执行,
初始化代码段之间还可以插入属性的初始化代码:

```kotlin
//sampleStart
class InitOrderDemo(name: String) {
    val firstProperty = "First property: $name".also(::println)

    init {
        println("First initializer block that prints $name")
    }

    val secondProperty = "Second property: ${name.length}".also(::println)

    init {
        println("Second initializer block that prints ${name.length}")
    }
}
//sampleEnd

fun main() {
    InitOrderDemo("hello")
}
```
{kotlin-runnable="true"}

主构造器的参数可以在初始化代码段中使用.
也可以在类主体定义的属性初始化代码中使用:

```kotlin
class Customer(name: String) {
    val customerKey = name.uppercase()
}
```

Kotlin 有一种简洁语法, 可以通过主构造器来定义属性并初始化属性值:

```kotlin
class Person(val firstName: String, val lastName: String, var age: Int)
```

这种声明还可以包含类属性的默认值:

```kotlin
class Person(val firstName: String, val lastName: String, var isEmployed: Boolean = true)
```

声明类的属性时, 可以使用 [尾随逗号(trailing comma)](coding-conventions.md#trailing-commas):

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    var age: Int, // 尾随逗号(trailing comma)
) { /*...*/ }
```

与通常的属性一样, 主构造器中定义的属性可以是可变的(`var`), 也可以是只读的(`val`).

如果构造器有注解, 或者有可见度修饰符,
这时 `constructor` 关键字是必须的, 注解和修饰符要放在它之前:

```kotlin
class Customer public @Inject constructor(name: String) { /*...*/ }
```

详情请参见 [可见度修饰符](visibility-modifiers.md#constructors).

### 次级构造器(secondary constructor) {id="secondary-constructors"}

类还可以声明 _次级构造器(secondary constructor)_, 使用 `constructor` 关键字作为前缀:

```kotlin
class Person(val pets: MutableList<Pet> = mutableListOf())

class Pet {
    constructor(owner: Person) {
        owner.pets.add(this) // 将这个 pet 实例添加到它的主人的 pet 列表
    }
}
```

如果类有主构造器, 那么每个次级构造器都必须委托给主构造器,
要么直接委托, 要么通过其他次级构造器间接委托.
委托到同一个类的另一个构造器时, 使用 `this` 关键字实现:

```kotlin
class Person(val name: String) {
    val children: MutableList<Person> = mutableListOf()
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

初始化代码段中的代码实际上会成为主构造器的一部分.
在访问次级构造器的第一条语句时, 会执行对主构造器的委托调用,
因此所有初始化代码段中的代码, 以及属性初始化代码, 都会在次级构造器的函数体之前执行.

即使类没有定义主构造器, 也会隐含地委托调用主构造器, 因此初始化代码段仍然会被执行:

```kotlin
//sampleStart
class Constructors {
    init {
        println("Init block")
    }

    constructor(i: Int) {
        println("Constructor $i")
    }
}
//sampleEnd

fun main() {
    Constructors(1)
}
```
{kotlin-runnable="true"}

如果一个非抽象类没有声明任何主构造器和次级构造器, 它将带有一个自动生成的, 无参数的主构造器.
这个构造器的可见度为 public.

如果不希望你的类带有 public 的构造器, 可以声明一个空的构造器, 并明确设置其可见度:

```kotlin
class DontCreateMe private constructor() { /*...*/ }
```

> 在 JVM 中, 如果主构造器的所有参数都指定了默认值,
> 编译器将会产生一个额外的无参数构造器, 这个无参数构造器会使用默认参数值来调用既有的构造器.
> 有些库(比如 Jackson 或 JPA) 会使用无参数构造器来创建对象实例, 这个特性将使得 Kotlin 比较容易与这种库协同工作.
>
> ```kotlin
> class Customer(val customerName: String = "")
> ```
>
{style="note"}

## 创建类的实例

要创建一个类的实例, 需要调用类的构造器, 调用方式与使用通常的函数一样:

```kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

> Kotlin 没有 `new` 关键字.
>
{style="note"}

关于嵌套类, 内部类, 以及匿名内部类的实例创建过程, 请参见[嵌套类(Nested Class)](nested-classes.md).

## 类成员 {id="class-members"}

类中可以包含以下内容:

* [构造器和初始化代码块](#constructors)
* [函数](functions.md)
* [属性](properties.md)
* [嵌套类和内部类](nested-classes.md)
* [对象声明](object-declarations.md)

## 继承 {id="inheritance"}

类可以相互继承, 构成类的继承层级结构.
详情请参加 [Kotlin 中的继承](inheritance.md).

## 抽象类 {id="abstract-classes"}

类本身, 或类中的部分成员, 都可以声明为 `abstract` 的.
抽象成员在类中不存在具体的实现.
你不必对抽象类或抽象成员标注 open 修饰符.

```kotlin
abstract class Polygon {
    abstract fun draw()
}

class Rectangle : Polygon() {
    override fun draw() {
        // 描绘长方形
    }
}
```

你可以使用抽象成员来覆盖一个非抽象的 `open` 成员:

```kotlin
open class Polygon {
    open fun draw() {
        // 某种默认的多边形描绘方法
    }
}

abstract class WildShape : Polygon() {
    // 从 WildShape 继承的类需要实现自己的 draw 方法,
    // 而不是使用 Polygon 中的默认方法
    abstract override fun draw()
}
```

## 同伴对象(Companion Object) {id="companion-objects"}

如果你需要写一个函数, 希望使用者不必通过类的实例来调用它,
但又需要访问类的内部信息(比如, 一个工厂方法), 你可以将这个函数写为这个类之内的一个 [对象声明](object-declarations.md) 的成员,
而不是类本身的成员.

具体来说, 如果你在类中声明一个 [同伴对象](object-declarations.md#companion-objects),
那么只需要使用类名作为限定符就可以访问同伴对象的成员了.
