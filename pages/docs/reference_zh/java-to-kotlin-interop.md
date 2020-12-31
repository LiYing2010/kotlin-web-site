---
type: doc
layout: reference
category: "Java Interop"
title: "在 Java 中调用 Kotlin"
---

# 在 Java 中调用 Kotlin

在 Java 中可以很容易地调用 Kotlin 代码.
比如, 在 Java 方法中可以非常自然的创建 Kotlin 类的实例, 并操作这些实例.
但是 Java 和 Kotlin 之间还是存在一些差异, 在 Java 中集成 Kotlin 代码时, 需要注意这些问题.
本章中, 我们将会介绍在 Java 代码中如何调用 Kotlin 代码.


## 属性

Kotlin 的属性会被编译为以下 Java 元素:

 * 一个取值方法, 方法名由属性名加上 `get` 前缀得到;
 * 一个设值方法, 方法名由属性名加上 `set` 前缀得到 (只会为 `var` 属性生成设值方法);
 * 一个私有的域变量, 名称与属性名相同 (只会为拥有后端域变量的属性生成域变量).

比如, `var firstName: String` 编译后的结果等于以下 Java 声明:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
private String firstName;

public String getFirstName() {
    return firstName;
}

public void setFirstName(String firstName) {
    this.firstName = firstName;
}
```
</div>

如果属性名以 `is` 开头, 会使用另一种映射规则:
取值方法名称会与属性名相同, 设值方法名称等于将属性名中的 `is` 替换为 `set`.
比如, 对于 `isOpen` 属性, 取值方法名称将会是 `isOpen()`, 设值方法名称将会是 `setOpen()`.
这个规则适用于任何数据类型的属性, 而不仅限于 `Boolean` 类型.

## 包级函数

在源代码文件 `app.kt` 的 `org.example` 包内声明的所有函数和属性, 包括扩展函数,
都被会编译成为 Java 类 `org.example.AppKt` 的静态方法.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 源代码文件: app.kt
package org.example

class Util

fun getTime() { /*...*/ }

```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// Java 代码
new org.example.Util();
org.example.AppKt.getTime();
```
</div>

编译生成的 Java 类的名称, 可以通过 `@JvmName` 注解来改变:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@file:JvmName("DemoUtils")

package org.example

class Util

fun getTime() { /*...*/ }

```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// Java 代码
new org.example.Util();
org.example.DemoUtils.getTime();
```
</div>

如果多个源代码文件生成的 Java 类名相同
(由于文件名和包名都相同, 或由于使用了相同的 [`@JvmName`](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 注解)
这样的情况通常会被认为是错误. 但是, 编译器可以使用指定的名称生成单个 Java Facade 类, 其中包含所有源代码文件的所有内容.
要生成这样的 Facade 类, 可以在多个源代码文件中使用 [`@JvmMultifileClass`](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-multifile-class/index.html) 注解.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 源代码文件: oldutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package org.example

fun getTime() { /*...*/ }
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 源代码文件: newutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package org.example

fun getDate() { /*...*/ }
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// Java 代码
org.example.Utils.getTime();
org.example.Utils.getDate();
```
</div>

## 实例的域

如果希望将一个 Kotlin 属性公开为 Java 中的一个域,
需要对它添加 [`@JvmField`](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 注解.
生成的域的可见度将与属性可见度一样. 要对属性使用 `@JvmField` 注解, 需要满足以下条件:
属性应该拥有后端域变量(backing field), 不是 private 属性, 没有 `open`, `override` 或 `const` 修饰符, 并且不是委托属性(delegated property).

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class User(id: String) {
    @JvmField val ID = id
}
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// Java 代码
class JavaClient {
    public String getID(User user) {
        return user.ID;
    }
}
```
</div>

[延迟初始化属性](properties.html#late-initialized-properties-and-variables) 也会公开为 Java 中的域.
域的可见度将与属性的 `lateinit` 的设值方法可见度一样.

## 静态域

声明在命名对象(named object)或同伴对象(companion object)之内的 Kotlin 属性, 将会存在静态的后端域变量(backing field),
对于命名对象, 静态后端域变量存在于命名对象内, 对于同伴对象, 静态后端域变量存在包含同伴对象的类之内.

通常这些静态的后端域变量是 private 的, 但可以使用以下方法来公开它:

 - 使用 [`@JvmField`](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-field/index.html) 注解;
 - 使用 `lateinit` 修饰符;
 - 使用 `const` 修饰符.

如果对这样的属性添加 `@JvmField` 注解, 那么它的静态后端域变量可见度将会与属性本身的可见度一样.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Key(val value: Int) {
    companion object {
        @JvmField
        val COMPARATOR: Comparator<Key> = compareBy<Key> { it.value }
    }
}
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// Java 代码
Key.COMPARATOR.compare(key1, key2);
// 这里访问的是 Key 类中的 public static final 域
```
</div>

命名对象或同伴对象中的[延迟初始化属性](properties.html#late-initialized-properties-and-variables) 对应的静态的后端域变量,
其可见度将与属性的设值方法可见度一样.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
object Singleton {
    lateinit var provider: Provider
}
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// Java 代码
Singleton.provider = new Provider();
// 这里访问的是 Singleton 类中的 public static 非 final 域
```
</div>

声明为 `const` 的属性(无论定义在类中, 还是在顶级范围内(top level)) 会被转换为 Java 中的静态域:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
</div>

在 Java 中:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
int const = Obj.CONST;
int max = ExampleKt.MAX;
int version = C.VERSION;
```
</div>

## 静态方法

上文中我们提到, Kotlin 会将包级函数编译为静态方法.
此外, 如果你对函数添加 [`@JvmStatic`](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-static/index.html) 注解,
Kotlin 也可以为命名对象或同伴对象中定义的函数生成静态方法.
如果使用这个注解, 编译器既会在对象所属的类中生成静态方法, 同时也会在对象中生成实例方法.
比如:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class C {
    companion object {
        @JvmStatic fun callStatic() {}
        fun callNonStatic() {}
    }
}
```
</div>

现在, `callStatic()` 在 Java 中是一个静态方法, 而 `callNonStatic()` 不是:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
C.callStatic(); // 正确
C.callNonStatic(); // 错误: 不是静态方法
C.Companion.callStatic(); // 实例上的方法仍然存在
C.Companion.callNonStatic(); // 这个方法只能通过实例来调用
```
</div>

对命名对象也一样:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
object Obj {
    @JvmStatic fun callStatic() {}
    fun callNonStatic() {}
}
```
</div>

在 Java 中:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
Obj.callStatic(); // 正确
Obj.callNonStatic(); // 错误
Obj.INSTANCE.callNonStatic(); // 正确, 这是对单体实例的一个方法调用
Obj.INSTANCE.callStatic(); // 也正确
```
</div>

从 Kotlin 1.3 开始, 接口的同伴对象中定义的函数也可以使用 `@JvmStatic` 注解.
这类函数会被编译为接口中的静态方法. 注意, 从 Java 1.8 才开始支持接口中的静态方法,
因此注意编译时需要选择正确的 JVM 目标平台.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
interface ChatBot {
    companion object {
        @JvmStatic fun greet(username: String) {
            println("Hello, $username")
        }
    }
}
```
</div>

`@JvmStatic` 注解也可以用于命名对象或同伴对象的属性, 可以使得属性的取值方法和设值方法变成静态方法,
对于命名对象, 这些静态方法在命名对象之内, 对于同伴对象, 这些静态方法在包含同伴对象的类之内.

## 接口中的默认方法(Default Method)

> 只有 JVM 1.8 或更高版本的编译目标平台才支持默认方法.
{:.note}

从 JDK 1.8 开始, Java 中的接口可以包含 [默认方法(Default Method)](https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html).
如果要把 Kotlin 接口的所有非抽象成员变为实现这些接口的 Java 类的默认方法,
请使用编译器选项 `-Xjvm-default=all` 来编译 Kotlin 代码.

下面是一个有默认方法的 Kotlin 接口的示例:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 使用编译器选项 -Xjvm-default=all 编译

interface Robot {
    fun move() { println("~walking~") }  // 在 Java 接口中, 这个方法将成为默认方法
    fun speak(): Unit
}
```
</div>

对于实现这个接口的 Java 类来说, 这个方法已经存在一个默认实现.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```java
C3PO c3po = new C3PO();
c3po.move(); // 这里会调用 Robot 接口中的默认实现
c3po.speak();
```
</div>

接口的实现类也可以覆盖默认方法.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
</div>

>**Note**: 在 Kotlin 1.4 之前, 要生成默认方法, 可以在方法上使用 `@JvmDefault` 注解.
> 在 1.4 中使用编译选项 `-Xjvm-default=all` 进行编译, 结果通常等于将接口的所有的非抽象方法添加 `@JvmDefault`注解,
> 然后再使用编译选项 `-Xjvm-default=enable` 进行编译. 但是, 有些情况下这两种办法的结果会有区别.
> 关于 Kotlin 1.4 中默认方法生成过程的具体变化, 请参见 Kotlin blog 中的 [这篇文章](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/).

### 默认方法的兼容模式

如果你的 Kotlin 接口在过去编译时没有使用新的编译选项 `-Xjvm-default=all`, 并且有客户代码正在使用这些接口,
那么, 在你的 Kotlin 接口代码使用这个编译选项再次编译之后, 可能导致客户代码不能与新代码兼容.

为了避免对这种客户代码的兼容性造成破坏, 请使用 _兼容模式_ 编译你的 Kotlin 代码, 方法是添加编译选项 `-Xjvm-default=all-compatibility`.
这种情况下, 所有使用前一个版本的代码都能够继续与新版本兼容. 但是, 兼容模式会造成编译输出的字节码增大.

对于新的接口不必考虑兼容性, 因为在此之前并没有客户代码使用它.
因此可以将这些接口从兼容模式中排除, 以减少兼容模式造成的字节码开销.
具体方法是, 对这些方法标注 `@JvmDefaultWithoutCompatibility` 注解.
这些接口的编译方法与使用编译选项 `-Xjvm-default=all` 时相同.

此外, 对于那些没有在公开 API 中公布的接口, 它们也没有被任何客户代码使用,
因此在 `all-compatibility` 模式下, 你也可以使用 `@JvmDefaultWithoutCompatibility` 来标注所有这些接口.

## 可见度

Kotlin 中的可见度修饰符与 Java 的对应规则如下:

* `private` 成员会被编译为 Java 中的 `private` 成员;
* `private` 顶级声明会被编译为 Java 中的 包内局部声明(package-local declaration);
* `protected` 成员在 Java 中仍然是 `protected` 不变
   (注意, Java 允许从同一个包内的其他类访问 protected 成员, 但 Kotlin 不允许, 因此 Java 类中将拥有更大的访问权限);
* `internal` 声明会被编译为 Java 中的 `public`.
  `internal` 类的成员名称会被混淆, 以降低在 Java 代码中意外访问到这些成员的可能性,
   并以此来实现那些根据 Kotlin 的规则相互不可见, 但是其签名完全相同的函数重载;
* `public` 在 Java 中仍然是 `public` 不变.

## KClass

调用 Kotlin 中的方法时, 有时你可能会需要使用 `KClass` 类型的参数.
Java 的 `Class` 不会自动转换为 Kotlin 的 `KClass`, 因此你必须手动进行转换,
方法是使用 `Class<T>.kotlin` 扩展属性, 这个扩展属性对应的方法是:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
kotlin.jvm.JvmClassMappingKt.getKotlinClass(MainView.class)
```
</div>

## 使用 `@JvmName` 注解处理签名冲突

有时候我们在 Kotlin 中声明了一个函数, 但在 JVM 字节码中却需要一个不同的名称.
最显著的例子就是 *类型消除(type erasure)* 时的情况:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```
</div>

这两个函数是无法同时定义的, 因为它们产生的 JVM 代码的签名是完全相同的:
`filterValid(Ljava/util/List;)Ljava/util/List;`.
如果我们确实需要在 Kotlin 中给这两个函数定义相同的名称,
那么可以对其中一个(或两个)使用 [`@JvmName`](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-name/index.html) 注解,
通过这个注解的参数来指定一个不同的名称:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun List<String>.filterValid(): List<String>

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```
</div>

在 Kotlin 中, 可以使用相同的名称 `filterValid` 来访问这两个函数,
但在 Java 中函数名将是 `filterValid` 和 `filterValidInt`.

如果我们需要定义一个属性 `x`, 同时又定义一个函数 `getX()`, 这时也可以使用同样的技巧:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
val x: Int
    @JvmName("getX_prop")
    get() = 15

fun getX() = 10
```
</div>

如果想要改变编译生成的属性访问方法的名称, 又不希望明确地实现属性的取值和设值方法,
你可以使用 `@get:JvmName` 和 `@set:JvmName`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@get:JvmName("x")
@set:JvmName("changeX")
var x: Int = 23
```
</div>

## 重载函数(Overload)的生成

通常, 如果在 Kotlin 中定义一个函数, 并指定了参数默认值, 这个方法在 Java 中只会存在带所有参数的版本.
如果你希望 Java 端的使用者看到不同参数的多个重载方法,
那么可以使用 [`@JvmOverloads`](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/index.html) 注解.

这个注解也可以用于构造器, 静态方法, 等等.
但不能用于抽象方法, 包括定义在接口内的方法.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Circle @JvmOverloads constructor(centerX: Int, centerY: Int, radius: Double = 1.0) {
    @JvmOverloads fun draw(label: String, lineWidth: Int = 1, color: String = "red") { /*...*/ }
}
```
</div>

对于每个带有默认值的参数, 都会生成一个新的重载方法, 这个重载方法的签名将会删除这个参数, 以及右侧的所有参数.
上面的示例程序生成的结果如下:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// 构造器:
Circle(int centerX, int centerY, double radius)
Circle(int centerX, int centerY)

// 方法
void draw(String label, int lineWidth, String color) { }
void draw(String label, int lineWidth) { }
void draw(String label) { }
```
</div>

注意, 在 [次级构造器](classes.html#secondary-constructors) 中介绍过,
如果一个类的构造器方法参数全部都指定了默认值, 那么会对这个类生成一个 public 的无参数构造器.
这个特性即使在没有使用 `@JvmOverloads` 注解时也是有效的.


## 受控异常(Checked Exception)

我们在上文中提到过, Kotlin 中不存在受控异常.
因此, Kotlin 函数在 Java 中的签名通常不会声明它抛出的异常.
因此, 假如我们有一个这样的 Kotlin 函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 源代码文件: example.kt
package demo

fun writeToFile() {
    /*...*/
    throw IOException()
}
```
</div>

然后我们希望在 Java 中调用它, 并捕获异常:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// Java 代码
try {
  demo.Example.writeToFile();
}
catch (IOException e) { // 错误: writeToFile() 没有声明抛出 IOException 异常
  // ...
}
```
</div>

这时 Java 编译器会报告错误, 因为 `writeToFile()` 没有声明抛出 `IOException` 异常.
为了解决这个问题, 我们可以在 Kotlin 中使用 [`@Throws`](/api/latest/jvm/stdlib/kotlin/-throws/index.html) 注解:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@Throws(IOException::class)
fun writeToFile() {
    /*...*/
    throw IOException()
}
```
</div>

## Null值安全性

在 Java 中调用 Kotlin 函数时, 没有任何机制阻止我们向一个非 null 参数传递一个 *null*{: .keyword } 值.
所以, Kotlin 编译时, 会对所有接受非 null 值参数的 public 方法产生一些运行时刻检查代码.
由于这些检查代码的存在, Java 端代码会立刻得到一个 `NullPointerException` 异常.

## 泛型的类型变异(Variant)

如果 Kotlin 类使用了 [声明处的类型变异(declaration-site variance)](generics.html#declaration-site-variance),
那么这些类在 Java 代码中看到的形式存在两种可能. 假设我们有下面这样的类, 以及两个使用这个类的函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Box<out T>(val value: T)

interface Base
class Derived : Base

fun boxDerived(value: Derived): Box<Derived> = Box(value)
fun unboxBase(box: Box<Base>): Base = box.value
```
</div>

如果用最简单的方式转换为 Java 代码, 结果将是:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
Box<Derived> boxDerived(Derived value) { ... }
Base unboxBase(Box<Base> box) { ... }
```
</div>

问题在于, 在 Kotlin 中我们可以这样: `unboxBase(boxDerived("s"))`,
但在 Java 中却不可以, 因为在 Java 中, `Box` 的类型参数 `T` 是 *不可变的(invariant)* ,
因此 `Box<Derived>` 不是 `Box<Base>` 的子类型.
为了解决 Java 端的问题, 我们必须将 `unboxBase` 函数定义成这样:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
Base unboxBase(Box<? extends Base> box) { ... }  
```
</div>

这里我们使用了 Java 的 *通配符类型(wildcards type)* (`? extends Base`),
通过使用处类型变异(use-site variance)来模仿声明处的类型变异(declaration-site variance), 因为 Java 中只有使用处类型变异.

为了让 Kotlin 的 API 可以在 Java 中正常使用, 如果一个类*被用作函数参数*,
那么对于定义了类型参数协变的 `Box` 类, `Box<Super>` 会生成为 Java 的 `Box<? extends Super>`
(对于定义了类型参数反向协变的 `Foo` 类, 会生成为 Java 的 `Foo<? super Bar>`).
当类被用作返回值时, 编译产生的结果不会使用类型通配符,
否则 Java 端的使用者就不得不处理这些类型通配符(而且这是违反通常的 Java 编程风格的).
因此, 我们上面例子中的函数真正的输出结果是这样的:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` java
// 返回值 - 没有类型通配符
Box<Derived> boxDerived(Derived value) { ... }

// 参数 - 有类型通配符
Base unboxBase(Box<? extends Base> box) { ... }
```
</div>

> 如果类型参数是 final 的, 那么生成类型通配符一般来说就没有意义了,
  因此 `Box<String>` 永远是 `Box<String>`, 无论它出现在什么位置.
{:.note}

如果我们需要类型通配符, 但默认没有生成, 那么可以使用 `@JvmWildcard` 注解:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// 将被翻译为
// Box<? extends Derived> boxDerived(Derived value) { ... }
```
</div>

反过来, 如果默认生成了类型通配符, 但我们不需要它, 那么可以使用 `@JvmSuppressWildcards` 注解:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// 将被翻译为
// Base unboxBase(Box<Base> box) { ... }
```
</div>

> `@JvmSuppressWildcards` 不仅可以用于单个的类型参数, 也可以用于整个函数声明或类声明,
  这时它会使得这个函数或类之内的所有类型通配符都不产生.
{:.note}

### `Nothing` 类型的翻译

[`Nothing`](exceptions.html#the-nothing-type) 类型是很特殊的, 因为它在 Java 中没有对应的概念.
所有的 Java 引用类型, 包括`java.lang.Void`, 都可以接受 `null` 作为它的值,
而 `Nothing` 甚至连 `null` 值都不能接受. 因此, 在 Java 的世界里无法准确地表达这个类型.
因此, Kotlin 会在使用 `Nothing` 类型参数的地方生成一个原生类型(raw type):

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun emptyList(): List<Nothing> = listOf()
// 将被翻译为
// List emptyList() { ... }
```
</div>
