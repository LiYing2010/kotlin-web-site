---
type: doc
layout: reference
category: "Syntax"
title: "类与继承"
related:
    - 函数.md
    - 嵌套类.md
    - 接口.md
---

# 类与继承

## 类

Kotlin 中的类使用 *class*{: .keyword } 关键字定义:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Invoice { /*...*/ }
```

</div>

类的定义由以下几部分组成: 类名, 类头部(指定类的类型参数, 主构造器, 等等.),
以及由大括号括起的类主体部分.
类的头部和主体部分都是可选的; 如果类没有主体部分, 那么大括号也可以省略.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Empty
```

</div>

### 构造器

Kotlin 中的类可以有一个 **主构造器** (primary constructor), 以及一个或多个 **次构造器** (secondary constructor).
主构造器是类头部的一部分, 位于类名称(以及可选的类型参数)之后.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Person constructor(firstName: String) { /*...*/ }
```

</div>

如果主构造器没有任何注解(annotation), 也没有任何可见度修饰符, 那么 *constructor*{: .keyword } 关键字可以省略:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Person(firstName: String) { /*...*/ }
```

</div>

主构造器中不能包含任何代码. 初始化代码可以放在 **初始化代码段** (initializer block) 中,
初始化代码段使用 *init*{: .keyword } 关键字作为前缀.

在类的实例初始化过程中, 初始化代码段按照它们在类主体中出现的顺序执行,
初始化代码段之间还可以插入属性的初始化代码:

<div class="sample" markdown="1" theme="idea">

```kotlin
//sampleStart
class InitOrderDemo(name: String) {
    val firstProperty = "First property: $name".also(::println)

    init {
        println("First initializer block that prints ${name}")
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

</div>

注意, 主构造器的参数可以在初始化代码段中使用.
也可以在类主体定义的属性初始化代码中使用:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Customer(name: String) {
    val customerKey = name.toUpperCase()
}
```

</div>

实际上, Kotlin 有一种简洁语法, 可以通过主构造器来定义属性并初始化属性值:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Person(val firstName: String, val lastName: String, var age: Int) { /*...*/ }
```

</div>

声明类的属性时, 可以使用 [尾随逗号(trailing comma)](coding-conventions.html#trailing-commas):

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    var age: Int, // 尾随逗号(trailing comma)
) { /*...*/ }
```

</div>

与通常的属性一样, 主构造器中定义的属性可以是可变的(*var*{: .keyword }),
也可以是只读的(*val*{: .keyword }).

如果构造器有注解, 或者有可见度修饰符,
这时 *constructor*{: .keyword } 关键字是必须的, 注解和修饰符要放在它之前:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Customer public @Inject constructor(name: String) { /*...*/ }
```

</div>

详情请参见 [可见度修饰符](visibility-modifiers.html#constructors).

#### 次级构造器(secondary constructor)

类还可以声明 **次级构造器** (secondary constructor), 使用 *constructor*{: .keyword } 关键字作为前缀:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Person {
    var children: MutableList<Person> = mutableListOf()
    constructor(parent: Person) {
        parent.children.add(this)
    }
}
```

</div>

如果类有主构造器, 那么每个次级构造器都必须委托给主构造器,
要么直接委托, 要么通过其他次级构造器间接委托.
委托到同一个类的另一个构造器时, 使用 *this*{: .keyword } 关键字实现:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Person(val name: String) {
    var children: MutableList<Person> = mutableListOf()
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

</div>

注意, 初始化代码段中的代码实际上会成为主构造器的一部分.
对主构造器的委托调用, 会作为次级构造器的第一条语句来执行,
因此所有初始化代码段中的代码, 以及属性初始化代码, 都会在次级构造器的函数体之前执行.
即使类没有定义主构造器, 也会隐含地委托调用主构造器, 因此初始化代码段仍然会被执行:

<div class="sample" markdown="1" theme="idea">

```kotlin
//sampleStart
class Constructors {
    init {
        println("Init block")
    }

    constructor(i: Int) {
        println("Constructor")
    }
}
//sampleEnd

fun main() {
    Constructors(1)
}
```

</div>

如果一个非抽象类没有声明任何主构造器和次级构造器, 它将带有一个自动生成的, 无参数的主构造器.
这个构造器的可见度为 public.
如果不希望你的类带有 public 的构造器, 你需要声明一个空的构造器, 并明确设置其可见度:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class DontCreateMe private constructor () { /*...*/ }
```

</div>

> **注意**: 在 JVM 中, 如果主构造器的所有参数都指定了默认值,
>编译器将会产生一个额外的无参数构造器, 这个无参数构造器会使用默认参数值来调用既有的构造器.
>有些库(比如 Jackson 或 JPA) 会使用无参数构造器来创建对象实例, 这个特性将使得 Kotlin 比较容易与这种库协同工作.

><div class="sample" markdown="1" theme="idea" data-highlight-only>
>
>```kotlin
>class Customer(val customerName: String = "")
>```
>
></div>

{:.info}

### 创建类的实例

要创建一个类的实例, 我们需要调用类的构造器, 调用方式与使用通常的函数一样:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

</div>

注意, Kotlin 没有 *new*{: .keyword } 关键字.

关于嵌套类, 内部类, 以及匿名内部类的实例创建, 请参见[嵌套类(Nested Class)](nested-classes.html).

### 类成员

类中可以包含以下内容:

* [构造器和初始化代码块](classes.html#constructors)
* [函数](functions.html)
* [属性](properties.html)
* [嵌套类和内部类](nested-classes.html)
* [对象声明](object-declarations.html)


## 继承

Kotlin 中所有的类都有一个共同的超类 `Any`, 如果类声明时没有指定超类, 则默认为 `Any`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Example // 隐含地继承自 Any
```

</div>

`Any` 拥有三个函数: `equals()`, `hashCode()` 和 `toString()`. 因此, Kotlin 的所有类都继承了这些函数.

默认情况下, Kotlin 的类是 final 的: 不能再被继承.
如果要允许一个类被继承, 需要使用 `open` 关键字标记这个类.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class Base // 这个类现在是 open 的, 可以被继承

```

</div>



要明确声明类的超类, 要在类的头部添加一个冒号, 冒号之后指定超类:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

</div>

如果子类有主构造器, 那么可以(而且必须)在主构造器中使用主构造器的参数来初始化基类.

如果子类没有主构造器, 那么所有的次级构造器都必须使用 *super*{: .keyword } 关键字来初始化基类,
或者委托到另一个构造器, 由被委托的构造器来初始化基类.
注意, 这种情况下, 不同的次级构造器可以调用基类中不同的构造器:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

</div>

### 方法的覆盖

我们在前面提到过, 我们很注意让 Kotlin 中的一切都明白无误.
因此, Kotlin 要求使用明确的修饰符来标识允许被子类覆盖的成员(我们称之为 *open*), 而且也要求使用明确的修饰符来标识对超类成员的覆盖:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

</div>

对于 `Circle.draw()` 必须添加 *override*{: .keyword } 修饰符. 如果遗漏了这个修饰符, 编译器将会报告错误.
如果一个函数没有标注 *open*{: .keyword } 修饰符, 比如上例中的 `Shape.fill()`, 那么在子类中声明一个同名同参的方法将是非法的,
无论是否添加 *override*{: .keyword } 修饰符, 都不可以.
在一个 final 类(也就是, 没有添加 *open*{: .keyword } 修饰符的类)的成员上添加 *open*{: .keyword } 修饰符, 不会发生任何效果.

当一个子类成员标记了 *override*{: .keyword } 修饰符来覆盖父类成员时, 覆盖后的子类成员本身也将是 open 的,
也就是说, 子类成员可以被自己的子类再次覆盖.
如果你希望禁止这种再次覆盖, 可以使用 *final*{: .keyword } 关键字:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

</div>

### 属性的覆盖

属性的覆盖方式与方法覆盖类似; 超类中声明的属性在后代类中再次声明时, 必须使用 *override*{: .keyword } 关键字来标记,
而且覆盖后的属性数据类型必须与超类中的属性数据类型兼容.
超类中声明的属性, 在后代类中可以使用带初始化器的属性来覆盖, 也可以使用带 `get` 方法的属性来覆盖.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

</div>

你也可以使用一个 `var` 属性覆盖一个 `val` 属性, 但不可以反过来使用一个 `val` 属性覆盖一个 `var` 属性.
允许这种覆盖的原因是, `val` 属性本质上只是定义了一个 `get` 方法,
使用 `var` 属性来覆盖它, 只是向后代类中添加了一个 `set` 方法.

注意, 你可以在主构造器的属性声明中使用 *override*{: .keyword } 关键字:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // 长方形总是拥有 4 个顶点

class Polygon : Shape {
    override var vertexCount: Int = 0  // 多边形的顶点数目不定, 可以变更为任何数字
}
```

</div>

### 子类的初始化顺序

子类新实例构造的过程中, 首先完成的第一步是要初始化基类 (顺序上仅次于计算传递给基类构造器的参数值),
因此要在子类的初始化逻辑之前执行.

<div class="sample" markdown="1" theme="idea">

```kotlin
//sampleStart
open class Base(val name: String) {

    init { println("Initializing Base") }

    open val size: Int =
        name.length.also { println("Initializing size in Base: $it") }
}

class Derived(
    name: String,
    val lastName: String,
) : Base(name.capitalize().also { println("Argument for Base: $it") }) {

    init { println("Initializing Derived") }

    override val size: Int =
        (super.size + lastName.length).also { println("Initializing size in Derived: $it") }
}
//sampleEnd

fun main() {
    println("Constructing Derived(\"hello\", \"world\")")
    val d = Derived("hello", "world")
}
```

</div>

也就是说, 基类构造器执行时, 在子类中定义或覆盖的属性还没有被初始化.
如果在基类初始化逻辑中使用到这些属性 (无论是直接使用, 还是通过另一个被覆盖的 *open*{: .keyword } 成员间接使用), 可能会导致不正确的行为, 甚至导致运行时错误.
因此, 设计基类时, 在构造器, 属性初始化器, 以及 *init*{: .keyword } 代码段中, 你应该避免使用 *open*{: .keyword } 成员.

### 调用超类中的实现

后代类中的代码, 可以使用 *super*{: .keyword } 关键字来调用超类中的函数和属性访问器的实现:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class Rectangle {
    open fun draw() { println("Drawing a rectangle") }
    val borderColor: String get() = "black"
}

class FilledRectangle : Rectangle() {
    override fun draw() {
        super.draw()
        println("Filling the rectangle")
    }

    val fillColor: String get() = super.borderColor
}
```

</div>

在内部类(inner class)的代码中, 可以使用 *super*{: .keyword } 关键字加上外部类名称限定符: `super@Outer` 来访问外部类(outer class)的超类:

<div class="sample" markdown="1" theme="idea">

```kotlin
open class Rectangle {
    open fun draw() { println("Drawing a rectangle") }
    val borderColor: String get() = "black"
}

//sampleStart
class FilledRectangle: Rectangle() {
    override fun draw() {
    	val filler = Filler()
        filler.drawAndFill()
    }

    inner class Filler {
        fun fill() { println("Filling") }
        fun drawAndFill() {
            super@FilledRectangle.draw() // 调用 Rectangle 的 draw() 函数实现
            fill()
            println("Drawn a filled rectangle with color ${super@FilledRectangle.borderColor}") // 使用 Rectangle 的 borderColor 属性的 get() 函数
        }
    }
}
//sampleEnd

fun main() {
    val fr = FilledRectangle()
        fr.draw()
}
```

</div>

### 覆盖的规则

在 Kotlin 中, 类继承中的方法实现问题, 遵守以下规则: 如果一个类从它的直接超类中继承了同一个成员的多个实现,
那么这个子类必须覆盖这个成员, 并提供一个自己的实现(可以使用继承得到的多个实现中的某一个).
为了表示使用的方法是从哪个超类继承得到的, 我们使用 *super*{: .keyword } 关键字, 将超类名称放在尖括号类, 比如, `super<Base>`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } // 接口的成员默认是 'open' 的
}

class Square() : Rectangle(), Polygon {
    // 编译器要求 draw() 方法必须覆盖:
    override fun draw() {
        super<Rectangle>.draw() // 调用 Rectangle.draw()
        super<Polygon>.draw() // 调用 Polygon.draw()
    }
}
```

</div>

同时继承 `Rectangle` 和 `Polygon` 是合法的,
但他们都实现了函数 `draw()` 的继承就发生了问题, 因此在 `Square` 类中我们必须覆盖函数 `draw()`,
并提供我们自己的实现, 这样才能消除歧义.

## 抽象类

类本身, 或类中的部分成员, 都可以声明为 *abstract*{: .keyword } 的.
抽象成员在类中不存在具体的实现.
注意, 我们不必对抽象类或抽象成员标注 open 修饰符 – 因为它显然必须是 open 的.

我们可以使用抽象成员来覆盖一个非抽象的 open 成员:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class Polygon {
    open fun draw() {}
}

abstract class Rectangle : Polygon() {
    abstract override fun draw()
}
```

</div>

## 同伴对象(Companion Object)

如果你需要写一个函数, 希望使用者不必通过类的实例来调用它,
但又需要访问类的内部信息(比如, 一个工厂方法), 你可以将这个函数写为这个类之内的一个 [对象声明](object-declarations.html) 的成员,
而不是类本身的成员.

具体来说, 如果你在类中声明一个 [同伴对象](object-declarations.html#companion-objects),
那么只需要使用类名作为限定符就可以访问同伴对象的成员了.
