---
type: doc
layout: reference
category: "Interop"
title: "在 Java 中调用 Kotlin"
---

# 在 Java 中调用 Kotlin

在 Java 中可以很容易地调用 Kotlin 代码.

## 属性

Property 的取值方法(getter)会被转换为 *get* 方法, 设值方法(setter)会被转换为 *set* 方法.

## 包级函数

在源代码文件 `example.kt` 的 `org.foo.bar` 包内声明的所有函数和属性, 都被会放在名为 `org.foo.bar.ExampleKt` 的 Java 类之内.

``` kotlin
// example.kt
package demo

class Foo

fun bar() {
}

```

``` java
// Java
new demo.Foo();
demo.ExampleKt.bar();
```

编译生成的 Java 类的名称, 可以通过 `@JvmName` 注解来改变:

``` kotlin
@file:JvmName("DemoUtils")

package demo

class Foo

fun bar() {
}

```

``` java
// Java
new demo.Foo();
demo.DemoUtils.bar();
```

如果多个源代码文件生成的 Java 类名相同(由于文件名和包名都相同, 或由于使用了相同的 @JvmName 注解) 这样的情况通常会被认为是错误. 但是, 编译器可以使用指定的名称生成单个 Java Facade 类, 其中包含所有源代码文件的所有内容.
要生成这样的 Facade 类, 可以在多个源代码文件中使用 @JvmMultifileClass 注解.

``` kotlin
// oldutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package demo

fun foo() {
}
```

``` kotlin
// newutils.kt
@file:JvmName("Utils")
@file:JvmMultifileClass

package demo

fun bar() {
}
```

``` java
// Java
demo.Utils.foo();
demo.Utils.bar();
```

## 实例的域

如果希望将一个 Kotlin 属性公开为 Java 中的一个域, 你需要对它添加 `@JvmField` 注解.
生成的域的可见度将与属性可见度一样. 要对属性使用 `@JvmField` 注解, 需要满足以下条件: 属性应该拥有后端域变量(backing field), 不是 private 属性, 没有 `open`, `override` 或 `const` 修饰符, 并且不是委托属性(delegated property).

``` kotlin
class C(id: String) {
    @JvmField val ID = id
}
```

``` java
// Java
class JavaClient {
    public String getID(C c) {
        return c.ID;
    }
}
```

[延迟初始化属性](properties.html#late-initialized-properties) 也会公开为 Java 中的域. 
域的可见度将与属性的 `lateinit` 的设值方法可见度一样.

## 静态域

声明在命名对象(named object)或同伴对象(companion object)之内的 Kotlin 属性, 将会存在静态的后端域变量(backing field), 对于命名对象, 静态后端域变量存在于命名对象内, 对于同伴对象, 静态后端域变量存在包含同伴对象的类之内.

通常这些静态的后端域变量是 private 的, 但可以使用以下方法来公开它:

 - 使用 `@JvmField` 注解;
 - 使用 `lateinit` 修饰符;
 - 使用 `const` 修饰符.
 
如果对这样的属性添加 `@JvmField` 注解, 那么它的静态后端域变量可见度将会与属性本身的可见度一样.

``` kotlin
class Key(val value: Int) {
    companion object {
        @JvmField
        val COMPARATOR: Comparator<Key> = compareBy<Key> { it.value }
    }
}
```

``` java
// Java
Key.COMPARATOR.compare(key1, key2);
// 这里访问的是 Key 类中的 public static final 域
```

命名对象或同伴对象中的[延迟初始化属性](properties.html#late-initialized-properties) 对应的静态的后端域变量, 其可见度将与属性的设值方法可见度一样.

``` kotlin
object Singleton {
    lateinit var provider: Provider
}
```

``` java
// Java
Singleton.provider = new Provider();
// 这里访问的是 Singleton 类中的 public static 非 final 域
```

使用 `const` 修饰符的属性(无论定义在类中, 还是在顶级范围内(top level)) 会被转换为 Java 中的静态域:

``` kotlin
// file example.kt

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

``` java
int c = Obj.CONST;
int d = ExampleKt.MAX;
int v = C.VERSION;
```

## 静态方法

上文中我们提到, Kotlin 会为包级函数生成静态方法.
此外, 如果你对函数添加 `@JvmStatic` 注解, Kotlin 也可以为命名对象或同伴对象中定义的函数生成静态方法.
比如:

``` kotlin
class C {
  companion object {
    @JvmStatic fun foo() {}
    fun bar() {}
  }
}
```

现在, `foo()` 在 Java 中是一个静态方法, 而 `bar()` 不是:

``` java
C.foo(); // 正确
C.bar(); // 错误: 不是静态方法
```

对命名对象也一样:

``` kotlin
object Obj {
    @JvmStatic fun foo() {}
    fun bar() {}
}
```

在 Java 中:

``` java
Obj.foo(); // 正确
Obj.bar(); // 错误
Obj.INSTANCE.bar(); // 正确, 这是对单体实例的一个方法调用
Obj.INSTANCE.foo(); // 也正确
```

`@JvmStatic` 注解也可以用于命名对象或同伴对象的属性, 可以使得属性的取值方法和设值方法变成静态方法, 对于命名对象, 这些静态方法在命名对象之内, 对于同伴对象, 这些静态方法在包含同伴对象的类之内.


## 使用 @JvmName 注解处理签名冲突

有时候我们在 Kotlin 中声明了一个函数, 但在 JVM 字节码中却需要一个不同的名称.
最显著的例子就是 *类型消除(type erasure)* 时的情况:

``` kotlin
fun List<String>.filterValid(): List<String>
fun List<Int>.filterValid(): List<Int>
```

这两个函数是无法同时定义的, 因为它们产生的 JVM 代码的签名是完全相同的: `filterValid(Ljava/util/List;)Ljava/util/List;`.
如果我们确实需要在 Kotlin 中给这两个函数定义相同的名称, 那么可以对其中一个(或两个)使用 `@JvmName` 注解, 通过这个注解的参数来指定一个不同的名称:

``` kotlin
fun List<String>.filterValid(): List<String>

@JvmName("filterValidInt")
fun List<Int>.filterValid(): List<Int>
```

在 Kotlin 中, 可以使用相同的名称 `filterValid` 来访问这两个函数, 但在 Java 中函数名将是 `filterValid` 和 `filterValidInt`.

如果我们需要定义一个属性 `x`, 同时又定义一个函数 `getX()`, 这时也可以使用同样的技巧:

``` kotlin
val x: Int
  @JvmName("getX_prop")
  get() = 15

fun getX() = 10
```


## 重载函数的生成

通常, 如果在 Kotlin 中定义一个方法, 并指定了参数默认值, 这个方法在 Java 中只会存在带所有参数的版本. 如果你希望 Java 端的使用者看到不同参数的多个重载方法, 那么可以使用 @JvmOverloads 注解.

``` kotlin
@JvmOverloads fun f(a: String, b: Int = 0, c: String = "abc") {
    ...
}
```

对于每个带有默认值的参数, 都会生成一个新的重载方法, 这个重载方法的签名将会删除这个参数, 以及右侧的所有参数. 上面的示例程序生成的 Java 方法如下:

``` java
// Java
void f(String a, int b, String c) { }
void f(String a, int b) { }
void f(String a) { }
```

这个注解也可以用于构造器, 静态方法, 等等. 但不能用于抽象方法, 包括定义在接口内的方法.

注意, 在 [次级构造器](classes.html#secondary-constructors) 中介绍过, 如果一个类的构造器方法参数全部都指定了默认值, 那么会对这个类生成一个 public 的无参数构造器. 这个特性即使在没有使用 @JvmOverloads 注解时也是有效的.


## 受控异常(Checked Exception)

我们在上文中提到过, Kotlin 中不存在受控异常.
因此, Kotlin 函数在 Java 中的签名通常不会声明它抛出的异常.
因此, 假如我们有一个这样的 Kotlin 函数:

``` kotlin
// example.kt
package demo

fun foo() {
  throw IOException()
}
```

然后我们希望在 Java 中调用它, 并捕获异常:

``` java
// Java
try {
  demo.Example.foo();
}
catch (IOException e) { // 错误: foo() 没有声明抛出 IOException 异常
  // ...
}
```

这时 Java 编译器会报告错误, 因为 `foo()` 没有声明抛出 `IOException` 异常.
为了解决这个问题, 我们可以在 Kotlin 中使用 `@Throws` 注解:

``` kotlin
@Throws(IOException::class)
fun foo() {
    throw IOException()
}
```

## Null值安全性

在 Java 中调用 Kotlin 函数时, 没有任何机制阻止我们向一个非 null 参数传递一个 *null*{: .keyword } 值.
所以, Kotlin 编译时, 会对所有接受非 null 值参数的 public 方法产生一些运行时刻检查代码.
由于这些检查代码的存在, Java 端代码会立刻得到一个 `NullPointerException` 异常.

## 泛型的类型变异(Variant)

如果 Kotlin 类使用了 [声明处的类型变异(declaration-site variance)](generics.html#declaration-site-variance), 那么这些类在 Java 代码中看到的形式存在两种可能. 假设我们有下面这样的类, 以及两个使用这个类的函数:

``` kotlin
class Box<out T>(val value: T)

interface Base
class Derived : Base

fun boxDerived(value: Derived): Box<Derived> = Box(value)
fun unboxBase(box: Box<Base>): Base = box.value
```

如果用最简单的方式转换为 Java 代码, 结果将是:
 
``` java
Box<Derived> boxDerived(Derived value) { ... }
Base unboxBase(Box<Base> box) { ... }
``` 

问题在于, 在 Kotlin 中我们可以这样: `unboxBase(boxDerived("s"))`, 但在 Java 中却不可以, 因为在 Java 中, `Box` 的类型参数 `T` 是 *不可变的(invariant)* , 因此 `Box<Derived>` 不是 `Box<Base>` 的子类型. 
为了解决 Java 端的问题, 我们必须将 `unboxBase` 函数定义成这样:
  
``` java
Base unboxBase(Box<? extends Base> box) { ... }  
```  

这里我们使用了 Java 的 *通配符类型(wildcards type)* (`? extends Base`), 通过使用处类型变异(use-site variance)来模仿声明处的类型变异(declaration-site variance), 因为 Java 中只有使用处类型变异.

为了让 Kotlin 的 API 可以在 Java 中正常使用, 如果一个类*被用作函数参数*, 那么对于定义了类型参数协变的 `Box` 类, `Box<Super>` 会生成为 Java 的 `Box<? extends Super>`(对于定义了类型参数反向协变的 `Foo` 类, 会生成为 Java 的 `Foo<? super Bar>`). 当类被用作返回值时, 编译产生的结果不会使用类型通配符, 否则 Java 端的使用者就不得不处理这些类型通配符(而且这是违反通常的 Java 编程风格的). 因此, 我们上面例子中的函数真正的输出结果是这样的:
  
``` java
// 返回值 - 没有类型通配符
Box<Derived> boxDerived(Derived value) { ... }
 
// 参数 - 有类型通配符 
Base unboxBase(Box<? extends Base> box) { ... }
```

注意: 如果类型参数是 final 的, 那么生成类型通配符一般来说就没有意义了, 因此 `Box<String>` 永远是 `Box<String>`, 无论它出现在什么位置.

如果我们需要类型通配符, 但默认没有生成, 那么可以使用 `@JvmWildcard` 注解:

``` kotlin
fun boxDerived(value: Derived): Box<@JvmWildcard Derived> = Box(value)
// 将被翻译为 
// Box<? extends Derived> boxDerived(Derived value) { ... }
```

反过来, 如果默认生成了类型通配符, 但我们不需要它, 那么可以使用 `@JvmSuppressWildcards` 注解:

``` kotlin
fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base = box.value
// 将被翻译为
// Base unboxBase(Box<Base> box) { ... }
```

注意: `@JvmSuppressWildcards` 不仅可以用于单个的类型参数, 也可以用于整个函数声明或类声明, 这时它会使得这个函数或类之内的所有类型通配符都不产生.

### Nothing 类型的翻译
 
`Nothing` 类型是很特殊的, 因为它在 Java 中没有对应的概念. 所有的 Java 引用类型, 包括`java.lang.Void`, 都可以接受 `null` 作为它的值, 而 `Nothing` 甚至连 `null` 值都不能接受. 因此, 在 Java 的世界里无法准确地表达这个类型. 因此, Kotlin 会在使用 `Nothing` 类型参数的地方生成一个原生类型(raw type):

``` kotlin
fun emptyList(): List<Nothing> = listOf()
// 将被翻译为
// List emptyList() { ... }
```
