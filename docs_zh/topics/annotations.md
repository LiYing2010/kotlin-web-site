[//]: # (title: 注解)

注解是用来为代码添加元数据(metadata)的一种手段.
要声明一个注解, 需要在类之前添加 `annotation` 修饰符:

```kotlin
annotation class Fancy
```

注解的其他属性, 可以通过向注解类添加元注解(meta-annotation)的方法来指定:

  * [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html)
    指定这个注解可被用于哪些元素(比如类, 函数, 属性, 表达式);
  * [`@Retention`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/index.html)
    指定这个注解的信息是否被保存到编译后的 class 文件中, 以及在运行时是否可以通过反射访问到它
    (默认情况下, 这两个设定都是 true);
  * [`@Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/index.html)
    允许在单个元素上多次使用同一个注解;
  * [`@MustBeDocumented`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-must-be-documented/index.html)
    表示这个注解是公开 API 的一部分, 在自动产生的 API 文档的类或者函数签名中,
    应该包含这个注解的信息.

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION,
        AnnotationTarget.TYPE_PARAMETER, AnnotationTarget.VALUE_PARAMETER,
        AnnotationTarget.EXPRESSION)
@Retention(AnnotationRetention.SOURCE)
@MustBeDocumented
annotation class Fancy
```

## 注解的使用 {id="usage"}

```kotlin
@Fancy class Foo {
    @Fancy fun baz(@Fancy foo: Int): Int {
        return (@Fancy 1)
    }
}
```

如果你需要对一个类的主构造器添加注解, 那么必须在构造器声明中添加 `constructor` 关键字,
然后在这个关键字之前添加注解:

```kotlin
class Foo @Inject constructor(dependency: MyDependency) { ... }
```

也可以对属性的访问器函数添加注解:

```kotlin
class Foo {
    var x: MyDependency? = null
        @Inject set
}
```

## 构造器 {id="constructors"}

注解可以拥有带参数的构造器.

```kotlin
annotation class Special(val why: String)

@Special("example") class Foo {}
```

允许使用的参数类型包括:

 * 与 Java 基本类型对应的数据类型(Int, Long, 等等.)
 * 字符串
 * 类 (`Foo::class`)
 * 枚举
 * 其他注解
 * 由以上数据类型构成的数组

注解的参数不能是可为 null 的类型,
因为 JVM 不支持在注解的属性中保存 `null` 值.

如果一个注解被用作另一个注解的参数, 那么在它的名字之前不使用 `@` 前缀:

```kotlin
annotation class ReplaceWith(val expression: String)

annotation class Deprecated(
        val message: String,
        val replaceWith: ReplaceWith = ReplaceWith(""))

@Deprecated("This function is deprecated, use === instead", ReplaceWith("this === other"))
```

如果你需要指定一个类作为注解的参数, 请使用 Kotlin 类
(参见 [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html)).
Kotlin 编译器会将它自动转换为 Java 类,
因此 Java 代码可以正常访问这个注解和它的参数.

```kotlin
import kotlin.reflect.KClass

annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any>)

@Ann(String::class, Int::class) class MyClass
```

## 创建注解类的实例 {id="instantiation"}

在 Java 中, 注解类型是一种形式的接口, 因此你不能实现一个注解类, 并使用它的实例.
Kotlin 使用不同的机制, 允许你在任意代码中调用注解类的构造器, 然后使用得到的实例.

```kotlin
annotation class InfoMarker(val info: String)

fun processInfo(marker: InfoMarker): Unit = TODO()

fun main(args: Array<String>) {
    if (args.isNotEmpty())
        processInfo(getAnnotationReflective(args))
    else
        processInfo(InfoMarker("default"))
}
```

关于创建注解类的实例, 更多详情请参见
[这篇 KEEP 文档](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md).

## Lambda 表达式 {id="lambdas"}

注解也可以用在 Lambda 上. 此时, Lambda 表达式的函数体内容将会生成一个`invoke()` 方法, 注解将被添加到这个方法上.
这个功能对于 [Quasar](https://docs.paralleluniverse.co/quasar/) 这样的框架非常有用,
因为这个框架使用注解来进行并发控制.

```kotlin
annotation class Suspendable

val f = @Suspendable { Fiber.sleep(10) }
```

## 注解的使用目标(Use-site Target) {id="annotation-use-site-targets"}

当你对一个属性或一个主构造器的参数添加注解时, 从一个 Kotlin 元素会产生出多个 Java 元素,
因此在编译产生的 Java 字节码中, 你的注解存在多个可能的适用目标.
为了明确指定注解应该使用在哪个元素上, 可以使用以下语法:

```kotlin
class Example(@field:Ann val foo,    // 只对 Java 域变量添加注解
              @get:Ann val bar,      // 只对属性的 Java get 方法添加注解
              @param:Ann val quux)   // 只对 Java 构造器参数添加注解
```

同样的语法也可以用来对整个源代码文件添加注解. 你可以添加一个目标为 `file` 的注解, 放在源代码文件的最顶端, package 指令之前,
如果这个源代码属于默认的包, 没有 package 指令, 则放在所有的 import 语句之前:

```kotlin
@file:JvmName("Foo")

package org.jetbrains.demo
```

如果你有目标相同的多个注解, 那么可以目标之后添加方括号, 然后将所有的注解放在方括号之内,
这样就可以避免重复指定相同的目标(`all` 目标除外):

```kotlin
class Example {
     @set:[Inject VisibleForTesting]
     var collaborator: Collaborator
}
```

Kotlin 支持的所有注解使用目标如下:

  * `file`
  * `field`
  * `property` (使用这个目标的注解, 在 Java 中无法访问)
  * `get` (属性的 get 方法)
  * `set` (属性的 set 方法)
  * `all` (实验性功能, 用于属性的目标, 关于它的目的和使用方法, 请参见 [下文](#all-meta-target))
  * `receiver` (扩展函数或扩展属性的接受者参数)

    要对扩展函数的接受者参数添加注解, 请使用以下语法:

    ```kotlin
    fun @receiver:Fancy String.myExtension() { ... }
    ```

  * `param` (构造器的参数)
  * `setparam` (属性 set 方法的参数)
  * `delegate` (保存代理属性的代理对象实例的域变量)

### 没有指定使用目标时的默认值 {id="defaults-when-no-use-site-targets-are-specified"}

如果不指定注解的使用目标, 那么将会根据这个注解的 `@Target` 注解来自动选定使用目标.
如果存在多个可用的目标, 将会使用以下列表中的第一个:

* `param`
* `property`
* `field`

我们来使用 [Jakarta Bean Validation 中的 `@Email` 注解](https://jakarta.ee/specifications/bean-validation/3.0/apidocs/jakarta/validation/constraints/email):

```java
@Target(value={METHOD,FIELD,ANNOTATION_TYPE,CONSTRUCTOR,PARAMETER,TYPE_USE})
public @interface Email { }
```

关于这个注解的使用, 请考虑下面的示例:

```kotlin
data class User(val username: String,
                // 这里的 @Email 等于 @param:Email
                @Email val email: String) {
    // 这里的 @Email 等于 @field:Email
    @Email val secondaryEmail: String? = null
}
```

Kotlin 2.2.0 引入了实验性的默认规则, 使向参数, 域变量, 以及属性传播注解更加可预测.

根据新的规则, 如果存在多个可用的目标, 会按照下面的方式选择一个或多个:

* 如果构造器参数目标 (`param`)可以使用, 则使用它.
* 如果属性目标 (`property`)可以使用, 则使用它.
* 如果域变量目标 (`field`)可以使用, 而 `property` 不可以使用, 则使用 `field`.

对于同一个示例:

```kotlin
data class User(val username: String,
                // 这里的 @Email 现在会等于 @param:Email @field:Email
                @Email val email: String) {
    // 这里的 @Email 继续等于 @field:Email
    @Email val secondaryEmail: String? = null
}
```

如果存在多个目标, 并且 `param`, `property`, 或 `field` 都不可使用, 那么注解无效.

要启用新的默认规则, 请在你的 Gradle 配置中使用以下设置:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}
```

如果想要使用旧的行为, 你可以:

* 在特定的情况下, 明确指定需要的目标, 例如, 使用 `@param:Annotation`, 而不是 `@Annotation`.
* 对整个项目, 在你的 Gradle 构建文件中使用以下设置:

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.add("-Xannotation-default-target=first-only")
        }
    }
    ```

### `all` meta-target {id="all-meta-target"}

<primary-label ref="experimental-opt-in"/>

`all` 目标可以更容易的将同一个注解不仅应用于参数和属性或域变量, 而且应用于对应的 get 方法和 set 方法.

具体来说, 如果可用, 那么标注了 `all` 的注解会:

* 如果属性在主构造器中定义, 传播到构造器参数 (`param`).
* 传播到属性本身 (`property`).
* 如果属性拥有后端域变量(Backing Field), 传播到后端域变量 (`field`).
* 传播到 get 方法 (`get`).
* 如果属性定义为 `var`, 传播到 set 方法参数 (`setparam`).
* 如果类存在 `@JvmRecord` 注解, 传播到 Java 专用的目标 `RECORD_COMPONENT`.

我们来使用 [Jakarta Bean Validation 中的 `@Email` 注解](https://jakarta.ee/specifications/bean-validation/3.0/apidocs/jakarta/validation/constraints/email),
它的定义如下:

```java
@Target(value={METHOD,FIELD,ANNOTATION_TYPE,CONSTRUCTOR,PARAMETER,TYPE_USE})
public @interface Email { }
```

在下面的示例中, 这个 `@Email` 注解被应用于所有相关的目标:

```kotlin
data class User(
    val username: String,
    // 将 `@Email` 应用到 `param`, `field` 和 `get`
    @all:Email val email: String,
    // 将 `@Email` 应用到 `param`, `field`, `get`, 和 `setparam`
    @all:Email var name: String,
) {
    // 将 `@Email` 应用到 `field` 和 `getter` (不应用于 `param`, 因为这个属性声明不在构造器中)
    @all:Email val secondaryEmail: String? = null
}
```

你可以对任何属性使用 `all` 目标, 无论是在主构造器之内还是之外.

#### 限制 {id="limitations"}

`all` 目标存在一些限制:

* 它不会将注解传播到类型, 潜在的扩展接受者, 或上下文接受者或参数.
* 它不能与多个注解一起使用:
    ```kotlin
    @all:[A B] // 禁止这种用法, 请使用 `@all:A @all:B`
    val x: Int = 5
    ```
* 它不能用于 [委托属性](delegated-properties.md).

#### 如何启用 {id="how-to-enable"}

要在你的项目中启用 `all` 目标, 请在命令行中使用以下编译器选项:

```Bash
-Xannotation-target-all
```

或者, 添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码段:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-target-all")
    }
}
```

## Java 注解 {id="java-annotations"}

Kotlin 100% 兼容 Java 注解:

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

由于 Java 注解中没有定义参数的顺序, 因此不可以使用通常的函数调用语法来给注解传递参数.
相反, 你需要使用命名参数语法:

```java
// Java
public @interface Ann {
    int intValue();
    String stringValue();
}
```

```kotlin
// Kotlin
@Ann(intValue = 1, stringValue = "abc") class C
```

与 Java 一样, 有一个特殊情况就是 `value` 参数; 这个参数的值可以不使用明确的参数名来指定:

```java
// Java
public @interface AnnWithValue {
    String value();
}
```

```kotlin
// Kotlin
@AnnWithValue("abc") class C
```

### 使用数组作为注解参数 {id="arrays-as-annotation-parameters"}

如果 Java 注解的 `value` 参数是数组类型, 那么在 Kotlin 中会变为 `vararg` 类型:

```java
// Java
public @interface AnnWithArrayValue {
    String[] value();
}
```

```kotlin
// Kotlin
@AnnWithArrayValue("abc", "foo", "bar") class C
```

对于其他数组类型的参数, 为其赋值时你需要使用数组字面值, 或使用 `arrayOf` 函数:

```java
// Java
public @interface AnnWithArrayMethod {
    String[] names();
}
```

```kotlin
@AnnWithArrayMethod(names = ["abc", "foo", "bar"])
class C
```

### 访问注解实例的属性值 {id="accessing-properties-of-an-annotation-instance"}

Java 注解实例的值, 在 Kotlin 代码中可以通过属性的形式访问:

```java
// Java
public @interface Ann {
    int value();
}
```

```kotlin
// Kotlin
fun foo(ann: Ann) {
    val i = ann.value
}
```

### 不生成 JVM 1.8+ 注解目标(Target)的能力 {id="ability-to-not-generate-jvm-1-8-annotation-targets"}

如果一个 Kotlin 注解的 Kotlin 注解目标(Target)中包含 `TYPE`,
那么映射的 Java 注解目标会包含 `java.lang.annotation.ElementType.TYPE_USE`.
同样的, Kotlin 注解目标 `TYPE_PARAMETER` 会映射为 Java 注解目标 `java.lang.annotation.ElementType.TYPE_PARAMETER`.
对于 API 级别低于 26 的 Android 用户来说, 这会造成问题, 因为在 API 中不存在这些注解目标.

要避免生成 `TYPE_USE` 和 `TYPE_PARAMETER` 注解目标, 请使用新的编译器参数 `-Xno-new-java-annotation-targets`.

## 可重复注解 {id="repeatable-annotations"}

就象 [在 Java 中](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html) 一样, Kotlin 也有可重复注解,
它可以对同个代码元素使用多次.
要让你的注解成为可重复注解, 请在它的声明中使用 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 元注解(meta-annotation).
这样会使得这个注解在 Kotlin 和 Java 中都成为可重复注解. 在 Kotlin 中, 也支持 Java 中定义的可重复注解.

与 Java 中使用的方法的主要区别在于, 不存在 _容器注解(containing annotation)_,
Kotlin 编译器会使用预定义的名称自动生成容器注解.
对于下面示例中的注解, 会生成名为 `@Tag.Container` 的容器注解:

```kotlin
@Repeatable
annotation class Tag(val name: String)

// 编译器生成名为 @Tag.Container 的容器注解
```

你可以对容器注解设置自定义的名称, 方法是使用 [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 元注解(meta-annotation),
指定一个明确声明的容器注解类作为参数:

```kotlin
@JvmRepeatable(Tags::class)
annotation class Tag(val name: String)

annotation class Tags(val value: Array<Tag>)
```

要通过反射取得 Kotlin 或 Java 的可重复注解,
请使用 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 函数.

关于 Kotlin 的可重复注解, 更多详情请参见 [这篇 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md).
