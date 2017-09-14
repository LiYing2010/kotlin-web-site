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

``` kotlin
class Invoice {
}
```

类的定义由以下几部分组成: 类名, 类头部(指定类的类型参数, 主构造器, 等等.), 以及由大括号括起的类主体部分. 类的头部和主体部分都是可选的; 如果类没有主体部分, 那么大括号也可以省略.

``` kotlin
class Empty
```


### 构造器

Kotlin 中的类可以有一个 **主构造器** (primary constructor), 以及一个或多个 **次构造器** (secondary constructor). 主构造器是类头部的一部分, 位于类名称(以及可选的类型参数)之后.

``` kotlin
class Person constructor(firstName: String) {
}
```

如果主构造器没有任何注解(annotation), 也没有任何可见度修饰符, 那么 *constructor*{: .keyword } 关键字可以省略:

``` kotlin
class Person(firstName: String) {
}
```

主构造器中不能包含任何代码. 初始化代码可以放在 **初始化代码段** (initializer block) 中, 初始化代码段使用 *init*{: .keyword } 关键字作为前缀:

``` kotlin
class Customer(name: String) {
    init {
        logger.info("Customer initialized with value ${name}")
    }
}
```

注意, 主构造器的参数可以在初始化代码段中使用. 也可以在类主体定义的属性初始化代码中使用:

``` kotlin
class Customer(name: String) {
    val customerKey = name.toUpperCase()
}
```

实际上, Kotlin 有一种简洁语法, 可以通过主构造器来定义属性并初始化属性值:


``` kotlin
class Person(val firstName: String, val lastName: String, var age: Int) {
    // ...
}
```

与通常的属性一样, 主构造器中定义的属性可以是可变的(*var*{: .keyword }), 也可以是只读的(*val*{: .keyword }).

如果构造器有注解, 或者有可见度修饰符, 这时 *constructor*{: .keyword } 关键字是必须的, 注解和修饰符要放在它之前:

``` kotlin
class Customer public @Inject constructor(name: String) { ... }
```

详情请参见 [可见度修饰符](visibility-modifiers.html#constructors).


#### 次级构造器(secondary constructor)

类还可以声明 **次级构造器** (secondary constructor), 使用 *constructor*{: .keyword } 关键字作为前缀:

``` kotlin
class Person {
    constructor(parent: Person) {
        parent.children.add(this)
    }
}
```

如果类有主构造器, 那么每个次级构造器都必须委托给主构造器, 要么直接委托, 要么通过其他次级构造器间接委托. 委托到同一个类的另一个构造器时, 使用 *this*{: .keyword } 关键字实现:

``` kotlin
class Person(val name: String) {
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

如果一个非抽象类没有声明任何主构造器和次级构造器, 它将带有一个自动生成的, 无参数的主构造器. 这个构造器的可见度为 public. 如果不希望你的类带有 public 的构造器, 你需要声明一个空的构造器, 并明确设置其可见度:

``` kotlin
class DontCreateMe private constructor () {
}
```

> **注意**: 在 JVM 中, 如果主构造器的所有参数都指定了默认值, 编译器将会产生一个额外的无参数构造器, 这个无参数构造器会使用默认参数值来调用既有的构造器. 有些库(比如 Jackson 或 JPA) 会使用无参数构造器来创建对象实例, 这个特性将使得 Kotlin 比较容易与这种库协同工作.
>
> ``` kotlin
> class Customer(val customerName: String = "")
> ```
{:.info}

### 创建类的实例

要创建一个类的实例, 我们需要调用类的构造器, 调用方式与使用通常的函数一样:

``` kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

注意, Kotlin 没有 *new*{: .keyword } 关键字.

关于嵌套类, 内部类, 以及匿名内部类的实例创建, 请参见[嵌套类(Nested Class)](nested-classes.html).

### 类成员

类中可以包含以下内容:

* 构造器和初始化代码块
* [函数](functions.html)
* [属性](properties.html)
* [嵌套类和内部类](nested-classes.html)
* [对象声明](object-declarations.html)


## 继承

Kotlin 中所有的类都有一个共同的超类 `Any`, 如果类声明时没有指定超类, 则默认为 `Any`:

``` kotlin
class Example // 隐含地继承自 Any
```

`Any` 不是 `java.lang.Object`; 尤其要注意, 除 `equals()`, `hashCode()` 和 `toString()` 之外, 它没有任何成员. 详情请参见 [与 Java 的互操作性](java-interop.html#object-methods).

要明确声明类的超类, 我们在类的头部添加一个冒号, 冒号之后指定超类:

``` kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

如果类有主构造器, 那么可以(而且必须)在主构造器中使用主构造器的参数来初始化基类.

如果类没有主构造器, 那么所有的次级构造器都必须使用 *super*{: .keyword } 关键字来初始化基类, 或者委托到另一个构造器, 由被委托的构造器来初始化基类.
注意, 这种情况下, 不同的次级构造器可以调用基类中不同的构造器:

``` kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
}
```

类上的 *open*{: .keyword } 注解(annotation) 与 Java 的 *final*{: .keyword } 正好相反: 这个注解表示允许从这个类继承出其他子类. 默认情况下, Kotlin 中所有的类都是 final 的, 这种设计符合 [Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html),
一书中的第 17 条原则: *允许继承的地方, 应该明确设计, 并通过文档注明, 否则应该禁止继承*.

### 方法的覆盖

我们在前面提到过, 我们很注意让 Kotlin 中的一切都明白无误. 而且与 Java 不同, Kotlin 要求明确地注解来标识允许被子类覆盖的成员(我们称之为 *open*), 而且也要求明确地注解来标识对超类成员的覆盖:

``` kotlin
open class Base {
    open fun v() {}
    fun nv() {}
}
class Derived() : Base() {
    override fun v() {}
}
```

对于 `Derived.v()` 必须添加 *override*{: .keyword } 注解. 如果遗漏了这个注解, 编译器将会报告错误. 如果一个函数没有标注 *open*{: .keyword } 注解, 比如上例中的 `Base.nv()`, 那么在子类中声明一个同名同参的方法将是非法的, 无论是否添加 *override*{: .keyword } 注解, 都不可以. 在一个 final 类(比如, 一个没有添加 *open*{: .keyword } 注解的类)中, 声明 open 成员是禁止的.

当一个子类成员标记了 *override*{: .keyword } 注解来覆盖父类成员时, 覆盖后的子类成员本身也将是 open 的, 也就是说, 子类成员可以被自己的子类再次覆盖. 如果你希望禁止这种再次覆盖, 可以使用 *final*{: .keyword } 关键字:

``` kotlin
open class AnotherDerived() : Base() {
    final override fun v() {}
}
```

### 属性的覆盖

属性的覆盖方式与方法覆盖类似; 超类中声明的属性在后代类中再次声明时, 必须使用 *override*{: .keyword } 关键字来标记, 而且覆盖后的属性数据类型必须与超类中的属性数据类型兼容. 可以使用带初始化器的属性来覆盖超类属性, 也可以使用带取值方法(getter)的属性来覆盖.

``` kotlin
open class Foo {
    open val x: Int get() { ... }
}

class Bar1 : Foo() {
    override val x: Int = ...
}
```

你也可以使用一个 `var` 属性覆盖一个 `val` 属性, 但不可以反过来使用一个 `val` 属性覆盖一个 `var` 属性. 允许这种覆盖的原因是, `val` 属性本质上只是定义了一个 get 方法, 使用 `var` 属性来覆盖它, 只是向后代类中添加了一个 set 方法.

注意, 你可以在主构造器的属性声明中使用 *override*{: .keyword } 关键字:

``` kotlin
interface Foo {
    val count: Int
}

class Bar1(override val count: Int) : Foo

class Bar2 : Foo {
    override var count: Int = 0
}
```

### 调用超类中的实现

后代类中的代码, 可以使用 *super*{: .keyword } 关键字来调用超类中的函数和属性访问器的实现:

```kotlin
open class Foo {
    open fun f() { println("Foo.f()") }
    open val x: Int get() = 1
}

class Bar : Foo() {
    override fun f() {
        super.f()
        println("Bar.f()")
    }

    override val x: Int get() = super.x + 1
}
```

在内部类(inner class)的代码中, 可以使用 *super*{: .keyword } 关键字加上外部类名称限定符: `super@Outer` 来访问外部类(outer class)的超类:

```kotlin
class Bar : Foo() {
    override fun f() { /* ... */ }
    override val x: Int get() = 0

    inner class Baz {
        fun g() {
            super@Bar.f() // 调用 Foo 类中的 f() 函数实现
            println(super@Bar.x) // 使用 Foo 类中的 x 属性取值方法实现
        }
    }
}
```

### 覆盖的规则

在 Kotlin 中, 类继承中的方法实现问题, 遵守以下规则: 如果一个类从它的直接超类中继承了同一个成员的多个实现, 那么这个子类必须覆盖这个成员, 并提供一个自己的实现(可以使用继承得到的多个实现中的某一个).
为了表示使用的方法是从哪个超类继承得到的, 我们使用 *super*{: .keyword } 关键字, 将超类名称放在尖括号类, 比如, `super<Base>`:

``` kotlin
open class A {
    open fun f() { print("A") }
    fun a() { print("a") }
}

interface B {
    fun f() { print("B") } // 接口的成员默认是 'open' 的
    fun b() { print("b") }
}

class C() : A(), B {
    // 编译器要求 f() 方法必须覆盖:
    override fun f() {
        super<A>.f() // 调用 A.f()
        super<B>.f() // 调用 B.f()
    }
}
```

同时继承 `A` 和 `B` 是合法的, 而且函数 `a()` 和 `b()` 的继承也不存在问题, 因为对于这两个函数, `C` 类都只继承得到了唯一的一个实现. 但对函数 `f()` 的继承就发生了问题, 因为 `C` 类从超类中继承得到了两个实现, 因此在 `C` 类中我们必须覆盖函数 `f()`, 并提供我们自己的实现, 这样才能消除歧义.

## 抽象类

类本身, 或类中的部分成员, 都可以声明为 *abstract*{: .keyword } 的. 抽象成员在类中不存在具体的实现. 注意, 我们不必对抽象类或抽象成员标注 open 注解 – 因为它显然必须是 open 的.

我们可以使用抽象成员来覆盖一个非抽象的 open 成员:

``` kotlin
open class Base {
    open fun f() {}
}

abstract class Derived : Base() {
    override abstract fun f()
}
```

## 同伴对象(Companion Object)

与 Java 或 C# 不同, Kotlin 的类没有静态方法(static method). 大多数情况下, 建议使用包级函数(package-level function)替代静态方法.

如果你需要写一个函数, 希望使用者不必通过类的实例来调用它, 但又需要访问类的内部信息(比如, 一个工厂方法), 你可以将这个函数写为这个类之内的一个 [对象声明](object-declarations.html) 的成员, 而不是类本身的成员.

具体来说, 如果你在类中声明一个 [同伴对象](object-declarations.html#companion-objects), 那么只需要使用类名作为限定符就可以调用同伴对象的成员了, 语法与 Java/C# 中调用类的静态方法一样.


## 封闭类(Sealed Class)

封闭类(Sealed class)用来表示对类阶层的限制, 可以限定一个值只允许是某些指定的类型之一, 而不允许是其他类型. 感觉上, 封闭类是枚举类(enum class)的一种扩展: 枚举类的值也是有限的, 但每一个枚举值常数都只存在唯一的一个实例, 封闭类则不同, 它允许的子类类型是有限的, 但子类可以有多个实例, 每个实例都可以包含它自己的状态数据.

要声明一个封闭类, 需要将 `sealed` 修饰符放在类名之前. 封闭类可以有子类, 但所有的子类声明都必须嵌套在封闭类的声明部分之内.

``` kotlin
sealed class Expr {
    class Const(val number: Double) : Expr()
    class Sum(val e1: Expr, val e2: Expr) : Expr()
    object NotANumber : Expr()
}
```

注意, 从封闭类的子类再继承的子类(间接继承者)可以放在任何地方, 不必在封闭类的声明部分之内.

使用封闭类的主要好处在于, 当使用 [`when` expression](control-flow.html#when-expression) 时, 可以验证分支语句覆盖了所有的可能情况, 因此就不必通过 `else` 分支来处理例外情况.

``` kotlin
fun eval(expr: Expr): Double = when(expr) {
    is Expr.Const -> expr.number
    is Expr.Sum -> eval(expr.e1) + eval(expr.e2)
    Expr.NotANumber -> Double.NaN
    // 不需要 `else` 分支, 因为我们已经覆盖了所有的可能情况
}
```
