---
type: doc
layout: reference
category: "Syntax"
title: "注解"
---

# 注解(Annotation)

## 注解的声明
注解是用来为代码添加元数据(metadata)的一种手段. 要声明一个注解, 需要在类之前添加 *annotation*{: .keyword } 修饰符:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
annotation class Fancy
```
</div>

注解的其他属性, 可以通过向注解类添加元注解(meta-annotation)的方法来指定:

  * [`@Target`](/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html)
    指定这个注解可被用于哪些元素(类, 函数, 属性, 表达式, 等等.);
  * [`@Retention`](/api/latest/jvm/stdlib/kotlin.annotation/-retention/index.html)
    指定这个注解的信息是否被保存到编译后的 class 文件中, 以及在运行时是否可以通过反射访问到它
    (默认情况下, 这两个设定都是 true);
  * [`@Repeatable`](/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/index.html)
    允许在单个元素上多次使用同一个注解;
  * [`@MustBeDocumented`](/api/latest/jvm/stdlib/kotlin.annotation/-must-be-documented/index.html)
    表示这个注解是公开 API 的一部分, 在自动产生的 API 文档的类或者函数签名中,
    应该包含这个注解的信息.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION,
        AnnotationTarget.VALUE_PARAMETER, AnnotationTarget.EXPRESSION)
@Retention(AnnotationRetention.SOURCE)
@MustBeDocumented
annotation class Fancy
```
</div>

### 注解的使用

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@Fancy class Foo {
    @Fancy fun baz(@Fancy foo: Int): Int {
        return (@Fancy 1)
    }
}
```
</div>

如果你需要对一个类的主构造器添加注解, 那么必须在构造器声明中添加 *constructor*{: .keyword} 关键字,
然后在这个关键字之前添加注解:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Foo @Inject constructor(dependency: MyDependency) { ... }
```
</div>

也可以对属性的访问器函数添加注解:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
class Foo {
    var x: MyDependency? = null
        @Inject set
}
```
</div>

### 构造器

注解可以拥有带参数的构造器.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
annotation class Special(val why: String)

@Special("example") class Foo {}
```
</div>

允许使用的参数类型包括:

 * 与 Java 基本类型对应的数据类型(Int, Long, 等等.);
 * 字符串;
 * 类 (`Foo::class`);
 * 枚举;
 * 其他注解;
 * 由以上数据类型构成的数组.

注解的参数不能是可为 null 的类型,
因为 JVM 不支持在注解的属性中保存 `null` 值.

如果一个注解被用作另一个注解的参数, 那么在它的名字之前不使用 @ 前缀:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
annotation class ReplaceWith(val expression: String)

annotation class Deprecated(
        val message: String,
        val replaceWith: ReplaceWith = ReplaceWith(""))

@Deprecated("This function is deprecated, use === instead", ReplaceWith("this === other"))
```
</div>

如果你需要指定一个类作为注解的参数, 请使用 Kotlin 类
(参见 [KClass](/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html)).
Kotlin 编译器会将它自动转换为 Java 类,
因此 Java 代码可以正常访问这个注解和它的参数.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin

import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any>)

@Ann(String::class, Int::class) class MyClass
```
</div>

### Lambda 表达式

注解也可以用在 Lambda 上. 此时, Lambda 表达式的函数体内容将会生成一个`invoke()` 方法, 注解将被添加到这个方法上.
这个功能对于 [Quasar](https://docs.paralleluniverse.co/quasar/) 这样的框架非常有用,
因为这个框架使用注解来进行并发控制.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```
</div>

## 注解的使用目标(Use-site Target)

当你对一个属性或一个主构造器的参数添加注解时, 从一个 Kotlin 元素会产生出多个 Java 元素,
因此在编译产生的 Java 字节码中, 你的注解存在多个可能的适用目标.
为了明确指定注解应该使用在哪个元素上, 可以使用以下语法:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Example(@field:Ann val foo,    // 对 Java 域变量添加注解
              @get:Ann val bar,      // 对属性的 Java get 方法添加注解
              @param:Ann val quux)   // 对 Java 构造器参数添加注解
```
</div>

同样的语法也可以用来对整个源代码文件添加注解. 你可以添加一个目标为 `file` 的注解, 放在源代码文件的最顶端, package 指令之前,
如果这个源代码属于默认的包, 没有 package 指令, 则放在所有的 import 语句之前:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@file:JvmName("Foo")

package org.jetbrains.demo
```
</div>

如果你有目标相同的多个注解, 那么可以目标之后添加方括号, 然后将所有的注解放在方括号之内,
这样就可以避免重复指定相同的目标:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Example {
     @set:[Inject VisibleForTesting]
     var collaborator: Collaborator
}
```
</div>

Kotlin 支持的所有注解使用目标如下:

  * `file`;
  * `property` (使用这个目标的注解, 在 Java 中无法访问);
  * `field`;
  * `get` (属性的 get 方法);
  * `set` (属性的 set 方法);
  * `receiver` (扩展函数或扩展属性的接受者参数);
  * `param` (构造器的参数);
  * `setparam` (属性 set 方法的参数);
  * `delegate` (保存代理属性的代理对象实例的域变量).

要对扩展函数的接受者参数添加注解, 请使用以下语法:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun @receiver:Fancy String.myExtension() { ... }
```
</div>

如果不指定注解的使用目标, 那么将会根据这个注解的 `@Target` 注解来自动选定使用目标.
如果存在多个可用的目标, 将会使用以下列表中的第一个:

  * `param`;
  * `property`;
  * `field`.

## Java 注解

Kotlin 100% 兼容 Java 注解:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import org.junit.Test
import org.junit.Assert.*
import org.junit.Rule
import org.junit.rules.*

class Tests {
    // 对属性的 get 方法使用 @Rule 注解
    @get:Rule val tempFolder = TemporaryFolder()

    @Test fun simple() {
        val f = tempFolder.newFile()
        assertEquals(42, getTheAnswer())
    }
}
```
</div>

由于 Java 注解中没有定义参数的顺序, 因此不可以使用通常的函数调用语法来给注解传递参数.
相反, 你需要使用命名参数语法:

<div class="sample" markdown="1" mode="java" theme="idea">

``` java
// Java
public @interface Ann {
    int intValue();
    String stringValue();
}
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// Kotlin
@Ann(intValue = 1, stringValue = "abc") class C
```
</div>

与 Java 一样, 有一个特殊情况就是 `value` 参数; 这个参数的值可以不使用明确的参数名来指定:

<div class="sample" markdown="1" theme="idea" mode="java">

``` java
// Java
public @interface AnnWithValue {
    String value();
}
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// Kotlin
@AnnWithValue("abc") class C
```
</div>

### 使用数组作为注解参数

如果 Java 注解的 `value` 参数是数组类型, 那么在 Kotlin 中会变为 `vararg` 类型:

<div class="sample" markdown="1" theme="idea" mode="java">

``` java
// Java
public @interface AnnWithArrayValue {
    String[] value();
}
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// Kotlin
@AnnWithArrayValue("abc", "foo", "bar") class C
```
</div>

对于其他数组类型的参数, 为其赋值时你需要使用数组字面值(从 Kotlin 1.2 开始支持),
或使用 `arrayOf` 函数:

<div class="sample" markdown="1" theme="idea" mode="java">

``` java
// Java
public @interface AnnWithArrayMethod {
    String[] names();
}
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// Kotlin 1.2+ 版本:
@AnnWithArrayMethod(names = ["abc", "foo", "bar"])
class C

// Kotlin 旧版本:
@AnnWithArrayMethod(names = arrayOf("abc", "foo", "bar"))
class D
```
</div>

### 访问注解实例的属性值

Java 注解实例的值, 在 Kotlin 代码中可以通过属性的形式访问:

<div class="sample" markdown="1" theme="idea" mode="java">

``` java
// Java
public @interface Ann {
    int value();
}
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// Kotlin
fun foo(ann: Ann) {
    val i = ann.value
}
```
</div>
