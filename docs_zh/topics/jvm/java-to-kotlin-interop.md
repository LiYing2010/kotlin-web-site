[//]: # (title: 在 Java 中调用 Kotlin 代码)

在 Java 中可以很容易地调用 Kotlin 代码.
比如, 在 Java 方法中可以非常自然的创建 Kotlin 类的实例, 并操作这些实例.
但是 Java 和 Kotlin 之间还是存在一些差异, 在 Java 中集成 Kotlin 代码时, 需要注意这些问题.
本章中, 我们将会介绍在 Java 代码中如何调用 Kotlin 代码.

## 属性 {id="properties"}

Kotlin 的属性会被编译为以下 Java 元素:

 * 一个取值方法, 方法名由属性名加上 `get` 前缀得到.
 * 一个设值方法, 方法名由属性名加上 `set` 前缀得到 (只会为 `var` 属性生成设值方法).
 * 一个私有的域变量, 名称与属性名相同 (只会为拥有后端域变量的属性生成域变量).

比如, `var firstName: String` 编译后的结果等于以下 Java 声明:

```java
private String firstName;

public String getFirstName() {
    return firstName;
}

public void setFirstName(String firstName) {
    this.firstName = firstName;
}
```

如果属性名以 `is` 开头, 会使用另一种映射规则:
取值方法名称会与属性名相同, 设值方法名称等于将属性名中的 `is` 替换为 `set`.
比如, 对于 `isOpen` 属性, 取值方法名称是 `isOpen()`, 设值方法名称是 `setOpen()`.
这个规则适用于任何数据类型的属性, 而不仅限于 `Boolean` 类型.

## 包级函数 {id="package-level-functions"}

在源代码文件 `app.kt` 的 `org.example` 包内声明的所有函数和属性, 包括扩展函数,
都被会编译成为 Java 类 `org.example.AppKt` 的静态方法.

```kotlin
// 源代码文件: app.kt
package org.example

class Util

fun getTime() { /*...*/ }

```

```java
// Java 代码
new org.example.Util();
org.example.AppKt.getTime();
```

要改变编译生成的 Java 类的名称, 可以使用 `@JvmName` 注解:

```kotlin
@file:JvmName("DemoUtils")

package org.example

class Util

fun getTime() { /*...*/ }

```

```java
// Java 代码
new org.example.Util();
org.example.DemoUtils.getTime();
```

如果多个源代码文件生成的 Java 类名相同(由于文件名和包名都相同,
或由于使用了相同的 [`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 注解)
这样的情况通常会被认为是错误.
但是, 编译器能够使用指定的名称生成单个 Java Facade 类, 其中包含所有源代码文件的所有内容.
要生成这样的 Facade 类, 可以在多个源代码文件中使用
[`@JvmMultifileClass`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-multifile-class/index.html) 注解.

```kotlin
// 源代码文件: oldutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package org.example

fun getTime() { /*...*/ }
```

```kotlin
// 源代码文件: newutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package org.example

fun getDate() { /*...*/ }
```

```java
// Java 代码
org.example.Utils.getTime();
org.example.Utils.getDate();
```

## 实例的域 {id="instance-fields"}

如果希望将一个 Kotlin 属性公开为 Java 中的一个域,
需要对它添加 [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 注解.
生成的域的可见度与属性可见度一样.
要对属性使用 `@JvmField` 注解, 属性需要满足以下条件:
* 拥有后端域变量(backing field)
* 不是 private 属性
* 没有 `open`, `override` 或 `const` 修饰符
* 不是委托属性(delegated property)

```kotlin
class User(id: String) {
    @JvmField val ID = id
}
```

```java
// Java 代码
class JavaClient {
    public String getID(User user) {
        return user.ID;
    }
}
```

[延迟初始化属性](properties.md#late-initialized-properties-and-variables) 也会公开为 Java 中的域.
域的可见度与属性的 `lateinit` 的设值方法可见度一样.

## 静态域(Static Fields) {id="static-fields"}

声明在命名对象(named object)或同伴对象(companion object)之内的 Kotlin 属性, 会存在静态的后端域变量(backing field),
对于命名对象, 静态后端域变量存在于命名对象内, 对于同伴对象, 静态后端域变量存在包含同伴对象的类之内.

通常这些静态的后端域变量是 private 的, 但可以使用以下方法来公开它:

 - 使用 [`@JvmField`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 注解
 - 使用 `lateinit` 修饰符
 - 使用 `const` 修饰符

如果对这样的属性添加 `@JvmField` 注解, 那么它的静态后端域变量可见度将会与属性本身的可见度一样.

```kotlin
class Key(val value: Int) {
    companion object {
        @JvmField
        val COMPARATOR: Comparator<Key> = compareBy<Key> { it.value }
    }
}
```

```java
// Java 代码
Key.COMPARATOR.compare(key1, key2);
// 这里访问的是 Key 类中的 public static final 域
```

命名对象或同伴对象中的[延迟初始化属性](properties.md#late-initialized-properties-and-variables) 对应的静态的后端域变量,
其可见度将与属性的设值方法可见度一样.

```kotlin
object Singleton {
    lateinit var provider: Provider
}
```

```java
// Java 代码
Singleton.provider = new Provider();
// 这里访问的是 Singleton 类中的 public static 非 final 域
```

声明为 `const` 的属性(无论定义在类中, 还是在顶级范围内(top level)) 会被转换为 Java 中的静态域:

```kotlin
// 源代码文件: example.kt

object Obj {
    const val CONST = 1
}

class C {
    companion object {
        const val VERSION = 9
    }
}

const val MAX = 239
```

在 Java 中:

```java
int constant = Obj.CONST;
int max = ExampleKt.MAX;
int version = C.VERSION;
```

## 静态方法(Static Method) {id="static-methods"}

上文中提到, Kotlin 会将包级函数编译为静态方法.
此外, 如果你对函数添加 [`@JvmStatic`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/index.html) 注解,
Kotlin 也可以为命名对象或同伴对象中定义的函数生成静态方法.
如果使用这个注解, 编译器既会在对象所属的类中生成静态方法, 同时也会在对象中生成实例方法.
比如:

```kotlin
class C {
    companion object {
        @JvmStatic fun callStatic() {}
        fun callNonStatic() {}
    }
}
```

现在, `callStatic()` 在 Java 中是一个静态方法, 而 `callNonStatic()` 不是:

```java
C.callStatic(); // 正确
C.callNonStatic(); // 错误: 不是静态方法
C.Companion.callStatic(); // 实例上的方法仍然存在
C.Companion.callNonStatic(); // 这个方法只能通过实例来调用
```

与此类似, 对于命名对象:

```kotlin
object Obj {
    @JvmStatic fun callStatic() {}
    fun callNonStatic() {}
}
```

在 Java 中:

```java
Obj.callStatic(); // 正确
Obj.callNonStatic(); // 错误
Obj.INSTANCE.callNonStatic(); // 正确, 这是对单体实例的一个方法调用
Obj.INSTANCE.callStatic(); // 也正确
```

从 Kotlin 1.3 开始, 接口的同伴对象中定义的函数也可以使用 `@JvmStatic` 注解.
这类函数会被编译为接口中的静态方法. 注意, 从 Java 1.8 才开始支持接口中的静态方法,
因此注意编译时需要选择正确的 JVM 目标平台.

```kotlin
interface ChatBot {
    companion object {
        @JvmStatic fun greet(username: String) {
            println("Hello, $username")
        }
    }
}
```

你也可以将 `@JvmStatic` 注解用于命名对象或同伴对象的属性, 可以使得属性的取值方法和设值方法变成静态方法,
对于命名对象, 这些静态方法在命名对象之内, 对于同伴对象, 这些静态方法在包含同伴对象的类之内.

## 接口中的默认方法(Default Method) {id="default-methods-in-interfaces"}

在使用 JVM 平台时, Kotlin 会将接口中声明的函数编译为 [默认方法(Default Method)](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html) unless [configured otherwise](#compatibility-modes-for-default-methods).
这些方法是接口中的实体方法, Java 类可以直接继承得到, 不需要重新实现.

下面是一个有默认方法的 Kotlin 接口的示例:

```kotlin
interface Robot {
    fun move() { println("~walking~") }  // 在 Java 接口中, 这个方法将成为默认方法
    fun speak(): Unit
}
```

对于实现这个接口的 Java 类来说, 这个方法已经存在一个默认实现.

```java
// Java 实现类
public class C3PO implements Robot {
    // Robot 接口中隐含存在 move() 方法的实现
    @Override
    public void speak() {
        System.out.println("I beg your pardon, sir");
    }
}
```

```java
C3PO c3po = new C3PO();
c3po.move(); // 这里会调用 Robot 接口中的默认实现
c3po.speak();
```

接口的实现类也可以覆盖默认方法.

```java
// Java 代码
public class BB8 implements Robot {
    // 通过自己的实现覆盖默认方法
    @Override
    public void move() {
        System.out.println("~rolling~");
    }

    @Override
    public void speak() {
        System.out.println("Beep-beep");
    }
}
```

### 默认方法的兼容模式 {id="compatibility-modes-for-default-methods"}

Kotlin 提供了 3 种模式来控制接口中的函数如何编译为 JVM 默认方法.
这些模式决定编译器是否生成兼容性桥接函数(Compatibility Bridge)和 `DefaultImpls` 类中的静态方法.

你可以使用 `-jvm-default` 编译选项来控制这个行为:

> `-jvm-default` 编译选项替代了已废弃的 `-Xjvm-default` 选项.
>
{style="note"}

兼容模式的详细说明如下:

#### enable 模式 {id="enable" initial-collapse-state="collapsed" collapsible="true"}

这是默认的模式.
生成接口中的默认实现, 并包含兼容性桥接函数(Compatibility Bridge)和 `DefaultImpls` 类.
这个模式会维持与旧版本编译的 Kotlin 代码的兼容性.

#### no-compatibility 模式 {id="no-compatibility" initial-collapse-state="collapsed" collapsible="true"}

只生成接口中的默认实现.
略过兼容性桥接函数和 `DefaultImpls` 类.
对新的代码库, 而且不与依赖于 `DefaultImpls` 类的代码交互, 可以使用这个模式.
这个模式会破坏与旧的 Kotlin 代码的二进制兼容性.

> 如果使用了接口委托, 所有的接口方法都会被委托.
>
{style="note"}

#### disable 模式 {id="disable" initial-collapse-state="collapsed" collapsible="true"}

禁用接口中的默认实现.
只生成兼容性桥接函数和 `DefaultImpls` 类.

## 可见度 {id="visibility"}

Kotlin 中的可见度修饰符与 Java 的对应规则如下:

* `private` 成员会被编译为 Java 中的 `private` 成员.
* `private` 顶级声明会被编译为 Java 中的 `private` 顶级声明.
   如果从类的内部访问, 那么还会包含包的 `private` 访问器(Package-private accessor).
* `protected` 成员在 Java 中仍然是 `protected` 不变.
   (注意, Java 允许从同一个包内的其他类访问 protected 成员, 但 Kotlin 不允许, 因此 Java 类中将拥有更大的访问权限.)
* `internal` 声明会被编译为 Java 中的 `public`.
  `internal` 类的成员名称会被混淆, 以降低在 Java 代码中意外访问到这些成员的可能性,
   并以此来实现那些根据 Kotlin 的规则相互不可见, 但是其签名完全相同的函数重载.
* `public` 在 Java 中仍然是 `public` 不变.

## KClass {id="kclass"}

调用 Kotlin 中的方法时, 有时你可能会需要使用 `KClass` 类型的参数.
Java 的 `Class` 不会自动转换为 Kotlin 的 `KClass`, 因此你必须手动进行转换,
方法是使用 `Class<T>.kotlin` 扩展属性, 这个扩展属性对应的方法是:

```kotlin
kotlin.jvm.JvmClassMappingKt.getKotlinClass(MainView.class)
```

## 使用 @JvmName 注解处理签名冲突 {id="handling-signature-clashes-with-jvmname"}

有时候我们在 Kotlin 中声明了一个函数, 但在 JVM 字节码中却需要一个不同的名称.
最显著的例子就是 *类型消除(type erasure)* 时的情况:

```kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```

这两个函数无法同时定义, 因为它们产生的 JVM 代码的签名是完全相同的:
`filterValid(Ljava/util/List;)Ljava/util/List;`.
如果我们确实需要在 Kotlin 中给这两个函数定义相同的名称,
那么可以对其中一个(或两个)使用 [`@JvmName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 注解,
通过这个注解的参数来指定一个不同的名称:

```kotlin
fun List<String>.filterValid(): List<String>

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```

在 Kotlin 中, 可以使用相同的名称 `filterValid` 来访问这两个函数,
但在 Java 中函数名是 `filterValid` 和 `filterValidInt`.

如果我们需要定义一个属性 `x`, 同时又定义一个函数 `getX()`, 这时也可以使用同样的技巧:

```kotlin
val x: Int
    @JvmName("getX_prop")
    get() = 15

fun getX() = 10
```

如果想要改变编译生成的属性访问方法的名称, 又不希望明确地实现属性的取值和设值方法,
你可以使用 `@get:JvmName` 和 `@set:JvmName`:

```kotlin
@get:JvmName("x")
@set:JvmName("changeX")
var x: Int = 23
```

## 重载函数(Overload)的生成 {id="overloads-generation"}

通常, 如果在 Kotlin 中定义一个函数, 并指定了参数默认值, 这个方法在 Java 中只会存在带所有参数的版本.
如果你希望 Java 端的使用者看到不同参数的多个重载方法,
那么可以使用 [`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/index.html) 注解.

这个注解也可以用于构造器, 静态方法, 等等.
但不能用于抽象方法, 包括定义在接口内的方法.

```kotlin
class Circle @JvmOverloads constructor(centerX: Int, centerY: Int, radius: Double = 1.0) {
    @JvmOverloads fun draw(label: String, lineWidth: Int = 1, color: String = "red") { /*...*/ }
}
```

对于每个带有默认值的参数, 都会生成一个新的重载方法, 这个重载方法的签名将会删除这个参数, 以及右侧的所有参数.
上面的示例程序生成的结果如下:

```java
// 构造器:
Circle(int centerX, int centerY, double radius)
Circle(int centerX, int centerY)

// 方法
void draw(String label, int lineWidth, String color) { }
void draw(String label, int lineWidth) { }
void draw(String label) { }
```

注意, 在 [次级构造器](classes.md#secondary-constructors) 中介绍过,
如果一个类的构造器方法参数全部都指定了默认值, 那么会对这个类生成一个 public 的无参数构造器.
这个特性即使在没有使用 `@JvmOverloads` 注解时也是有效的.

## 受控异常(Checked Exception) {id="checked-exceptions"}

Kotlin 中不存在受控异常.
因此, Kotlin 函数在 Java 中的签名通常不会声明它抛出的异常.
因此, 假如你有一个这样的 Kotlin 函数:

```kotlin
// 源代码文件: example.kt
package demo

fun writeToFile() {
    /*...*/
    throw IOException()
}
```

然后你希望在 Java 中调用它, 并捕获异常:

```java
// Java 代码
try {
    demo.Example.writeToFile();
} catch (IOException e) {
    // 错误: writeToFile() 没有声明抛出 IOException 异常
    // ...
}
```

这时 Java 编译器会报告错误, 因为 `writeToFile()` 没有声明抛出 `IOException` 异常.
为了解决这个问题, 可以在 Kotlin 中使用 [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/index.html) 注解:

```kotlin
@Throws(IOException::class)
fun writeToFile() {
    /*...*/
    throw IOException()
}
```

## Null 值安全性 {id="null-safety"}

在 Java 中调用 Kotlin 函数时, 没有任何机制阻止我们向一个非 null 参数传递一个 `null` 值.
所以, Kotlin 编译时, 会对所有接受非 null 值参数的 public 方法产生一些运行时刻检查代码.
由于这些检查代码的存在, Java 端代码会立刻得到一个 `NullPointerException` 异常.

## 泛型的类型变异(Variant) {id="variant-generics"}

如果 Kotlin 类使用了 [声明处的类型变异(declaration-site variance)](generics.md#declaration-site-variance),
那么这些类在 Java 代码中看到的形式存在两种可能. 比如, 你有下面这样的类, 以及两个使用这个类的函数:

```kotlin
class Box<out T>(val value: T)

interface Base
class Derived : Base

fun boxDerived(value: Derived): Box<Derived> = Box(value)
fun unboxBase(box: Box<Base>): Base = box.value
```

如果用最简单的方式转换为 Java 代码, 结果将是:

```java
Box<Derived> boxDerived(Derived value) { ... }
Base unboxBase(Box<Base> box) { ... }
```

问题在于, 在 Kotlin 中你可以这样: `unboxBase(boxDerived(Derived()))`,
但在 Java 中却不可以, 因为在 Java 中, `Box` 的类型参数 `T` 是 *不可变的(invariant)* ,
因此 `Box<Derived>` 不是 `Box<Base>` 的子类型.
为了解决 Java 端的问题, 你需要将 `unboxBase` 函数定义成这样:

```java
Base unboxBase(Box<? extends Base> box) { ... }
```

这个声明使用了 Java 的 *通配符类型(wildcards type)* (`? extends Base`),
通过使用处类型变异(use-site variance)来模仿声明处的类型变异(declaration-site variance), 因为 Java 中只有使用处类型变异.

为了让 Kotlin 的 API 可以在 Java 中正常使用, 如果一个类*被用作函数参数*,
那么对于定义了类型参数协变的 `Box` 类, 编译器会将 `Box<Super>` 生成为 Java 的 `Box<? extends Super>`
(对于定义了类型参数反向协变的 `Foo` 类, 会生成为 Java 的 `Foo<? super Bar>`).
当类被用作返回值时, 编译器不会生成类型通配符,
否则 Java 端的使用者就不得不处理这些类型通配符(而且这是违反通常的 Java 编程风格的).
因此, 我们上面例子中的函数真正的输出结果是这样的:

```java
// 返回值 - 没有类型通配符
Box<Derived> boxDerived(Derived value) { ... }

// 参数 - 有类型通配符
Base unboxBase(Box<? extends Base> box) { ... }
```

> 如果类型参数是 final 的, 那么生成类型通配符一般来说就没有意义了,
> 因此 `Box<String>` 永远是 `Box<String>`, 无论它出现在什么位置.
>
{style="note"}

如果你需要类型通配符, 但默认没有生成, 可以使用 `@JvmWildcard` 注解:

```kotlin
fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// 将被翻译为
// Box<? extends Derived> boxDerived(Derived value) { ... }
```

反过来, 如果默认生成了类型通配符, 但你不需要它, 可以使用 `@JvmSuppressWildcards` 注解:

```kotlin
fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// 将被翻译为
// Base unboxBase(Box<Base> box) { ... }
```

> `@JvmSuppressWildcards` 不仅可以用于单个的类型参数, 也可以用于整个函数声明或类声明,
> 这时它会使得这个函数或类之内的所有类型通配符都不产生.
>
{style="note"}

### Nothing 类型的翻译 {id="translation-of-type-nothing"}

[`Nothing`](exceptions.md#the-nothing-type) 类型是很特殊的, 因为它在 Java 中没有对应的概念.
所有的 Java 引用类型, 包括`java.lang.Void`, 都可以接受 `null` 作为它的值,
而 `Nothing` 甚至连 `null` 值都不能接受. 因此, 在 Java 的世界里无法准确地表达这个类型.
因此, Kotlin 会在使用 `Nothing` 类型参数的地方生成一个原生类型(raw type):

```kotlin
fun emptyList(): List<Nothing> = listOf()
// 将被翻译为
// List emptyList() { ... }
```

### 内联的值类(Inline Value Class) {id="inline-value-classes"}

<primary-label ref="experimental-general"/>

如果希望 Java 代码能够与 Kotlin 的 [内联的值类(Inline Value Class)](inline-classes.md) 顺利协作,
可以使用 [`@JvmExposeBoxed`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/-jvm-expose-boxed/) 注解,
或 `-Xjvm-expose-boxed` 编译器选项.
这些方法可以确保 Kotlin 为与 Java 的互操作生成必要的装箱表达形式(Boxed Representation).

默认情况下, Kotlin 会将内联的值类编译为使用 **未装箱的表达形式(Unboxed Representation)**, 在 Java 中通常无法使用.
例如, 无法在 Java 中调用 `MyInt` 类的构造器:

```kotlin
@JvmInline
value class MyInt(val value: Int)
```

因此下面的 Java 代码会失败:

```java
MyInt input = new MyInt(5);
```

可以使用 `@JvmExposeBoxed` 注解, 让 Kotlin 生成可在 Java 中直接调用的 public 构造器.
可以将注解应用于以下层级, 确保对 Java 公开的内容进行粒度控制:

* 类
* 构造器
* 函数

在你的代码中使用 `@JvmExposeBoxed` 注解之前, 必须使用 `@OptIn(ExperimentalStdlibApi::class)`, 以表示使用者同意(Opt-in).
例如:

```kotlin
@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

@OptIn(ExperimentalStdlibApi::class)
@JvmExposeBoxed
fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

有了这些注解, Kotlin 会为 `MyInt` 类生成 Java 能够访问的构造器,
**并且** 为扩展函数生成一个变体, 它使用值类的装箱形式.
因此下面的 Java 代码能够成功运行:

```java
MyInt input = new MyInt(5);
MyInt output = ExampleKt.timesTwoBoxed(input);
```

要将这个行为应用于模块中所有的内联值类, 以及所有使用它们的函数, 请使用 `-Xjvm-expose-boxed` 选项编译这个模块.
使用这个选项进行编译, 效果等于模块中所有的声明都带有 `@JvmExposeBoxed` 注解.
