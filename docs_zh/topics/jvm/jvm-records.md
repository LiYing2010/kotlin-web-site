[//]: # (title: 在 Kotlin 中使用 Java 记录类(Record))

在 Java 中 _记录类(Record)_ 是用于存储不可变数据的 [类](https://openjdk.java.net/jeps/395).
记录类携带一组固定的值 – _记录组件(Records Components)_.
在 Java 中记录类的语法很简洁, 可以为你省去编写样板代码的时间:

```java
// Java
public record Person (String name, int age) {}
```

编译器会自动生成一个 final 类, 继承自 [`java.lang.Record`](https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Record.html),
并包含以下成员:
* 对每个记录组件, 有一个 private final 域
* 一个 public 构造器, 参数是所有的域
* 一组方法, 实现结构化的相等比较: `equals()`, `hashCode()`, `toString()`
* 为读取每个记录组件, 有一个 public 方法

记录类非常类似于 Kotlin [数据类](data-classes.md).

## 在 Kotlin 代码中使用 Java 记录类 {id="using-java-records-from-kotlin-code"}

在 Kotlin 中, 你可以通过使用类和属性相同的方式来使用 Java 中声明的记录类及其组件.
要访问记录组件, 可以和使用 [Kotlin 属性](properties.md) 一样, 直接使用它的名称:

```kotlin
val newPerson = Person("Kotlin", 10)
val firstName = newPerson.name
```

## 在 Kotlin 中声明记录类 {id="declare-records-in-kotlin"}

Kotlin 只支持对数据类声明记录类, 而且数据类必须符合 [要求](#requirements).

要在 Kotlin 中声明一个数据类, 请使用 `@JvmRecord` 注解:

> 向一个已存在的类添加 `@JvmRecord`, 这样的变化会导致二进制不兼容. 会改变类属性访问器的命名规约.
>
{style="note"}

```kotlin
@JvmRecord
data class Person(val name: String, val age: Int)
```

这个 JVM 专用的注解会导致生成以下内容:

* 在 class 文件中, 生成与类属性对应的记录组件
* 符合 Java 记录类命名规约的类属性访问器方法名

数据类会提供 `equals()`, `hashCode()`, 和 `toString()` 方法的实现.

### 要求 {id="requirements"}

要使用 `@JvmRecord` 注解来声明数据类, 它必须符合以下要求:

* 类所在模块的编译目标必须是 JVM 16 字节码 (或者 JVM 15, 并开启 `-Xjvm-enable-preview` 编译器选项).
* 类不能明确继承任何其他类 (包括 `Any`), 因为所有的 JVM 记录类都要隐含的继承 `java.lang.Record`.
  但是, 类可以实现接口.
* 类不能声明任何带有后端域(Backing Field)的属性 – 通过主构造器参数初始化的对应属性除外.
* 类不能声明任何带有后端域(Backing Field)的可变属性.
* 不能是局部(local)类.
* 类的主构造器的可见度必须与类本身相同.

### 允许使用 JVM 记录类 {id="enable-jvm-records"}

对生成的 JVM 字节码, JVM 记录类要求的编译目标为 `16` 或更高版本.

要明确指定字节码版本, 请在 [Gradle](gradle-compiler-options.md#attributes-specific-to-jvm)
或 [Maven](maven.md#attributes-specific-to-jvm)中, 使用 `jvmTarget` 编译器选项.

## 在 Kotlin 中标注记录组件 {id="annotate-record-components-in-kotlin"}

<primary-label ref="experimental-general"/>

在 Java 中, 记录组件上的 [注解](annotations.md) 会自动传递到后端域变量(Backing Field), 取值方法(Getter), 设值方法(Setter), 以及构造器参数.
在 Kotlin 中， 你可以通过 [`all`](annotations.md#all-meta-target) 使用目标(Use-site Target)来复制这个动作.

> 要使用 `all` 使用目标, 你需要标注使用者同意.
> 可以使用 `-Xannotation-target-all` 编译器选项,
> 或者向你的 `build.gradle.kts` 文件添加以下内容:
>
> ```kotlin
> kotlin {
>     compilerOptions {
>         freeCompilerArgs.add("-Xannotation-target-all")
>     }
> }
> ```
>
{style="warning"}

例如:

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

当你将 `@JvmRecord` 和 `@all:` 一起使用时, Kotlin 会:

* 将注解传递到属性, 后端域变量(Backing Field), 构造器参数, 取值方法(Getter)和设值方法(Setter).
* 如果注解支持 Java 的 `RECORD_COMPONENT`, 还会将注解应用到记录组件.

## 让注解与记录组件协同工作 {id="make-annotations-work-with-record-components"}

要让一个 [注解](annotations.md) 能够同时用于 Kotlin 属性 **和** Java 记录组件,
请向你的注解声明添加以下元注解:

* 对 Kotlin: [`@Target`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/index.html)
* 对 Java 记录组件: [`@java.lang.annotation.Target`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Target.html)

例如:

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class ExampleClass
```

现在 `@ExampleClass` 可以用于 Kotlin 类和属性, 也可以用于 Java 类和记录组件.

## 更多讨论 {id="further-discussion"}

关于更多技术细节和讨论, 请参见 [对 JVM 记录类的语言规格建议](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md).
