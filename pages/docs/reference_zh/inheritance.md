---
type: doc
layout: reference
category:
title: "继承"
---

# 继承

本页面最终更新: 2021/07/08

Kotlin 中所有的类都有一个共同的超类 `Any`, 如果类声明时没有指定超类, 则默认为 `Any`:

```kotlin
class Example // 隐含地继承自 Any
```

`Any` 拥有三个函数: `equals()`, `hashCode()` 和 `toString()`. 因此, Kotlin 的所有类都拥有这些函数.

默认情况下, Kotlin 的类是 final 的 - 不能再被继承.
如果要允许一个类被继承, 需要使用 `open` 关键字标记这个类:

```kotlin
open class Base // 这个类现在是 open 的, 可以被继承

```

要明确声明类的超类, 要在类的头部添加一个冒号, 冒号之后指定超类:

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

如果子类有主构造器, 那么可以(而且必须)在主构造器中使用主构造器的参数来初始化基类.

如果子类没有主构造器, 那么所有的次级构造器都必须使用 `super` 关键字来初始化基类,
或者委托到另一个构造器, 由被委托的构造器来初始化基类.
注意, 这种情况下, 不同的次级构造器可以调用基类中不同的构造器:

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## 方法的覆盖

Kotlin 要求使用明确的修饰符来标识允许被子类覆盖的成员, 也要求使用明确的修饰符来标识对超类成员的覆盖:

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

对于 `Circle.draw()` 必须添加 `override` 修饰符. 如果遗漏了这个修饰符, 编译器将会报告错误.
如果一个函数没有标注 `open` 修饰符, 比如上例中的 `Shape.fill()`, 那么不允许在子类中声明一个同名同参的方法,
无论是否添加 `override` 修饰符, 都不可以.
在一个 final 类(也就是, 没有添加 `open` 修饰符的类)的成员上添加 `open` 修饰符, 不会发生任何效果.

当一个子类成员标记了 `override` 修饰符来覆盖父类成员时, 覆盖后的子类成员本身也将是 open 的,
因此子类成员可以被自己的子类再次覆盖.
如果你希望禁止这种再次覆盖, 可以使用 `final` 关键字:

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## 属性的覆盖

属性的覆盖方式与方法覆盖相同; 超类中声明的属性在后代类中再次声明时, 必须使用 `override` 关键字来标记,
而且覆盖后的属性数据类型必须与超类中的属性数据类型兼容.
超类中声明的属性, 在后代类中可以使用带初始化器的属性来覆盖, 也可以使用带 `get` 方法的属性来覆盖:

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

你也可以使用一个 `var` 属性覆盖一个 `val` 属性, 但不可以反过来使用一个 `val` 属性覆盖一个 `var` 属性.
允许这种覆盖的原因是, `val` 属性本质上只是定义了一个 `get` 方法,
使用 `var` 属性来覆盖它, 只是向后代类中添加了一个 `set` 方法.

注意, 你可以在主构造器的属性声明中使用 `override` 关键字:

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // 长方形总是拥有 4 个顶点

class Polygon : Shape {
    override var vertexCount: Int = 0  // 多边形的顶点数目不定, 可以变更为任何数字
}
```

## 子类的初始化顺序

子类新实例构造的过程中, 首先完成的第一步是要初始化基类 (顺序上仅次于计算传递给基类构造器的参数值),
因此要在子类的初始化逻辑之前执行.

<div class="sample" markdown="1" theme="idea">

```kotlin
//sampleStart
open class Base(val name: String) {

    init { println("Initializing a base class") }

    open val size: Int =
        name.length.also { println("Initializing size in the base class: $it") }
}

class Derived(
    name: String,
    val lastName: String,
) : Base(name.replaceFirstChar { it.uppercase() }.also { println("Argument for the base class: $it") }) {

    init { println("Initializing a derived class") }

    override val size: Int =
        (super.size + lastName.length).also { println("Initializing size in the derived class: $it") }
}
//sampleEnd

fun main() {
    println("Constructing the derived class(\"hello\", \"world\")")
    Derived("hello", "world")
}
```

</div>

也就是说, 基类构造器执行时, 在子类中定义或覆盖的属性还没有被初始化.
如果在基类初始化逻辑中使用到这些属性
(无论是直接使用, 还是通过另一个被覆盖的 `open` 成员间接使用),
可能会导致不正确的行为, 甚至导致运行时错误.
因此, 设计基类时, 在构造器, 属性初始化器, 以及 `init` 代码段中, 你应该避免使用 `open` 成员.

## 调用超类中的实现

后代类中的代码, 可以使用 `super` 关键字来调用超类中的函数和属性访问器的实现:

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

在内部类(inner class)的代码中, 可以使用 `super` 关键字加上外部类名称限定符: `super@Outer`
来访问外部类(outer class)的超类:

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

## 覆盖的规则

在 Kotlin 中, 类继承中的方法实现问题, 遵守以下规则: 如果一个类从它的直接超类中继承了同一个成员的多个实现,
那么这个子类必须覆盖这个成员, 并提供一个自己的实现(可以使用继承得到的多个实现中的某一个).
为了表示使用的方法是从哪个超类继承得到的, 可以使用 `super` 关键字, 将超类名称放在尖括号类, 比如, `super<Base>`:

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

同时继承 `Rectangle` 和 `Polygon` 是合法的,
但他们都实现了函数 `draw()` 的继承就发生了问题, 因此你需要在 `Square` 类中覆盖函数 `draw()`,
并提供单独的实现, 这样才能消除歧义.
