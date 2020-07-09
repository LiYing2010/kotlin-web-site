---
type: doc
layout: reference
category: "Java Interop"
title: "在 Kotlin 中调用 Java"
---

# 在 Kotlin 中调用 Java 代码

Kotlin 的设计过程中就考虑到了与 Java 的互操作性.
在 Kotlin 中可以通过很自然的方式调用既有的 Java 代码, 反过来在 Java 中也可以很流畅地使用 Kotlin 代码.
本章中我们介绍在 Kotlin 中调用 Java 代码的一些细节问题.

大多数 Java 代码都可以直接使用, 没有任何问题:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import java.util.*

fun demo(source: List<Int>) {
    val list = ArrayList<Int>()
    // 对 Java 集合使用 'for' 循环:
    for (item in source) {
        list.add(item)
    }
    // 也可以对 Java 类使用 Kotlin 的操作符:
    for (i in 0..source.size - 1) {
        list[i] = source[i] // 这里会调用 get 和 set 方法
    }
}
```

</div>

## Get 和 Set 方法

符合 Java 的 Get 和 Set 方法规约的方法
(无参数, 名称以 `get` 开头, 或单个参数, 名称以 `set` 开头) 在 Kotlin 中会被识别为属性.
`Boolean` 类型的属性访问方法(Get 方法名称以 `is` 开头, Set 方法名称以 `set` 开头),
会被识别为属性, 其名称与 Get 方法相同.

比如:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import java.util.Calendar

fun calendarDemo() {
    val calendar = Calendar.getInstance()
    if (calendar.firstDayOfWeek == Calendar.SUNDAY) {  // 这里会调用 getFirstDayOfWeek()
        calendar.firstDayOfWeek = Calendar.MONDAY      // 这里会调用 setFirstDayOfWeek()
    }
    if (!calendar.isLenient) {                         // 这里会调用 isLenient()
        calendar.isLenient = true                      // 这里会调用 setLenient()
    }
}
```

</div>

注意, 如果 Java 类中只有 set 方法, 那么在 Kotlin 中不会被识别为属性, 因为 Kotlin 目前还不支持只写(set-only) 的属性.

## 返回值为 void 的方法

如果一个 Java 方法返回值为 void, 那么在 Kotlin 中调用时将返回 `Unit`.
如果, 在 Kotlin 中使用了返回值, 那么会由 Kotlin 编译器在调用处赋值,
因为返回值已经预先知道了(等于 `Unit`).

## 当 Java 标识符与 Kotlin 关键字重名时的转义处理

某些 Kotlin 关键字在 Java 中是合法的标识符: *in*{: .keyword }, *object*{: .keyword }, *is*{: .keyword }, 等等.
如果 Java 类库中使用 Kotlin 的关键字作为方法名, 你仍然可以调用这个方法,
只要使用反引号(`)对方法名转义即可:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
foo.`is`(bar)
```

</div>

## Null 值安全性与平台数据类型

Java 中的所有引用都可以为 *null*{: .keyword } 值, 因此对于来自 Java 的对象, Kotlin 的严格的 null 值安全性要求就变得毫无意义了.
Java 中定义的类型在 Kotlin 中会被特别处理, 被称为 *平台数据类型(platform type)*.
对于这些类型, Null 值检查会被放松, 因此对它们来说, 只提供与 Java 中相同的 null 值安全保证(详情参见[下文](#mapped-types)).

我们来看看下面的例子:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val list = ArrayList<String>() // 非 null 值 (因为是构造器方法的返回结果)
list.add("Item")
val size = list.size // 非 null 值 (因为是基本类型 int)
val item = list[0] // 类型自动推断结果为平台类型 (通常的 Java 对象)
```

</div>

对于平台数据类型的变量, 当我们调用它的方法时, Kotlin 不会在编译时刻报告可能为 null 的错误,
但这个调用在运行时可能失败, 原因可能是发生 null 指针异常,
也可能是 Kotlin 编译时为防止 null 值错误而产生的断言, 在运行时导致失败:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
item.substring(1) // 编译时允许这样的调用, 但在运行时如果 item == null 则可能抛出异常
```

</div>

平台数据类型是 *无法指示的(non-denotable)*, 也就是说不能在语言中明确指出这样的类型.
当平台数据类型的值赋值给 Kotlin 变量时, 我们可以依靠类型推断(这时变量的类型会被自动推断为平台数据类型,
比如上面示例程序中的变量 `item` 就是如此), 或者我们也可以选择我们期望的数据类型(可为 null 的类型和非 null 类型都允许):

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val nullable: String? = item // 允许, 永远不会发生错误
val notNull: String = item // 允许, 但在运行时刻可能失败
```

</div>

如果我们选择使用非 null 类型, 那么编译器会在赋值处理之前输出一个断言(assertion).
它负责防止 Kotlin 中的非 null 变量指向一个 null 值.
当我们将平台数据类型的值传递给 Kotlin 函数的非 null 值参数时, 也会输出断言.
总之, 编译器会尽可能地防止 null 值错误在程序中扩散(然而, 有些时候由于泛型的存在, 不可能完全消除这种错误).

### 对平台数据类型的注解

上文中我们提到, 平台数据类型无法在程序中明确指出, 因此在 Kotlin 语言中没有专门的语法来表示这种类型.
然而, 有时编译器和 IDE 仍然需要表示这些类型(比如在错误消息中, 在参数信息中, 等等),
因此, 我们有一种助记用的注解:

* `T!` 代表 "`T` 或者 `T?`",
* `(Mutable)Collection<T>!` 代表 "元素类型为 `T` 的Java 集合, 内容可能可变, 也可能不可变, 值可能允许为 null, 也可能不允许为 null",
* `Array<(out) T>!` 代表 "元素类型为 `T` (或 `T` 的子类型)的 Java 数组, 值可能允许为 null, 也可能不允许为 null"

### 可否为 null(Nullability) 注解

带有可否为 null(Nullability) 注解的 Java 类型在 Kotlin 中不会被当作平台数据类型, 而会被识别为可为 null 的, 或非 null 的 Kotlin 类型.
编译器支持几种不同风格的可否为 null 注解, 包括:

  * [JetBrain](https://www.jetbrains.com/idea/help/nullable-and-notnull-annotations.html)
(`org.jetbrains.annotations` 包中定义的 `@Nullable` 和 `@NotNull` 注解)
  * Android (`com.android.annotations` 和 `android.support.annotations`)
  * JSR-305 (`javax.annotation`, 详情请参见下文)
  * FindBugs (`edu.umd.cs.findbugs.annotations`)
  * Eclipse (`org.eclipse.jdt.annotation`)
  * Lombok (`lombok.NonNull`).

完整的列表请参见 [Kotlin 编译器源代码](https://github.com/JetBrains/kotlin/blob/master/core/descriptors.jvm/src/org/jetbrains/kotlin/load/java/JvmAnnotationNames.kt).

### 对类型参数添加注解

也可以对泛型的类型参数添加注解, 标记它是否可以为 null. 比如, 我们先来看看在 Java 中如何添加这些注解:

<div class="sample" markdown="1" theme="idea" mode="java">

```java
@NotNull
Set<@NotNull String> toSet(@NotNull Collection<@NotNull String> elements) { ... }
```

</div>

这段 Java 程序在 Kotlin 中看到的函数签名如下:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun toSet(elements: (Mutable)Collection<String>) : (Mutable)Set<String> { ... }
```

</div>

请注意在类型参数 `String` 上的 `@NotNull` 注解. 如果没有这些注解, 我们得到的类型参数就只能是平台数据类型:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun toSet(elements: (Mutable)Collection<String!>) : (Mutable)Set<String!> { ... }
```

</div>

对类型参数的注解需要 Java 8 或更高版本的编译环境, 还要求可否为 null(Nullability) 注解支持 `TYPE_USE`
(从版本 15 开始, `org.jetbrains.annotations` 支持 `TYPE_USE`).

> 注意: 由于目前的技术限制, 对于那些通过依赖项引入的已编译过的 Java 库, IDE 不能正确识别这种类型参数上的注解.
{:.note}

### 对 JSR-305 规范的支持

[JSR-305 规范](https://jcp.org/en/jsr/detail?id=305) 中定义了 [`@Nonnull`](https://aalmiray.github.io/jsr-305/apidocs/javax/annotation/Nonnull.html) 注解.
Kotlin 支持使用这个注解来标识 Java 类型可否为 null.

如果 `@Nonnull(when = ...)` 的值为 `When.ALWAYS`, 那么被注解的类型会被当作不可为 null 的;
`When.MAYBE` 和 `When.NEVER` 对应于可为 null 的类型;
`When.UNKNOWN` 则会被认为是 [平台数据类型](#null-safety-and-platform-types).

库编译时可以用到 JSR-305 规范的注解, 但对于库的使用者来说, 编译时不必依赖这些注解的 jar 文件(比如 `jsr305.jar`).
Kotlin 编译器可以从库中读取 JSR-305 规范的注解, 而不需要这些注解存在于类路径中.

从 Kotlin 1.1.50 开始, 还支持 [自定义可空限定符 (KEEP-79)](https://github.com/Kotlin/KEEP/blob/41091f1cc7045142181d8c89645059f4a15cc91a/proposals/jsr-305-custom-nullability-qualifiers.md)
(详情请见下文).

#### 类型限定符别名(Type qualifier nickname) (从 Kotlin 1.1.50 开始支持)

如果一个注解, 同时标注了
[`@TypeQualifierNickname`](https://aalmiray.github.io/jsr-305/apidocs/javax/annotation/meta/TypeQualifierNickname.html)
注解 和 JSR-305 规范的 `@Nonnull` 注解(或者它的另一个别名, 比如 `@CheckForNull`),
那么这个注解可以用来标注类型是否可以为 null, 其含义与 JSR-305 规范的 `@Nonnull` 注解完全相同:

<div class="sample" markdown="1" theme="idea" mode="java">

```java
@TypeQualifierNickname
@Nonnull(when = When.ALWAYS)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNonnull {
}

@TypeQualifierNickname
@CheckForNull // 另一个 TypeQualifierNickname 的别名
@Retention(RetentionPolicy.RUNTIME)
public @interface MyNullable {
}

interface A {
    @MyNullable String foo(@MyNonnull String x);
    // Kotlin (strict 模式) 中会被看作: `fun foo(x: String): String?`

    String bar(List<@MyNonnull String> x);
    // Kotlin (strict 模式) 中会被看作: `fun bar(x: List<String>!): String!`
}
```

</div>

#### 类型限定符默认值(Type qualifier default) (从 Kotlin 1.1.50 开始支持)

[`@TypeQualifierDefault`](https://aalmiray.github.io/jsr-305/apidocs/javax/annotation/meta/TypeQualifierDefault.html)
用来定义一个注解, 当使用这个注解时, 可以在被标注的元素的范围内, 定义默认的可否为 null 设定.

这种注解本身应该标注 `@Nonnull` 注解(或者使用它的别名), 并使用一个或多个 `ElementType` 值标注 `@TypeQualifierDefault(...)` 注解:
* `ElementType.METHOD` 表示注解对象为方法的返回值;
* `ElementType.PARAMETER` 表示注解对象为参数值;
* `ElementType.FIELD` 表示注解对象为类的成员域变量;
* `ElementType.TYPE_USE` (从 1.1.60 版开始支持) 表示注解对象为任何类型, 包含类型参数(type argument), 类型参数上界(upper bound), 以及通配符类型(wildcard type).


当一个类型没有标注可否为 null 注解时, 会使用默认的可否为 null 设定,
Kotlin 会查找对象类型所属的最内层的元素, 要求这个元素使用了类型限定符默认值注解, 而且 `ElementType` 值与对象类型相匹配,
然后通过类型限定符默认值注解, 得到这个默认的可否为 null 设定.

<div class="sample" markdown="1" theme="idea" mode="java">

```java
@Nonnull
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER})
public @interface NonNullApi {
}

@Nonnull(when = When.MAYBE)
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER, ElementType.TYPE_USE})
public @interface NullableApi {
}

@NullableApi
interface A {
    String foo(String x); // 在 Kotlin 中会被看作: fun foo(x: String?): String?

    @NotNullApi // 这个注解将会覆盖接口上的可否为 null 默认设定
    String bar(String x, @Nullable String y); // 在 Kotlin 中会被看作: fun bar(x: String, y: String?): String

    // List<String> 的类型参数会被看作可为 null,
    // 因为 `@NullableApi` 中包括了 `TYPE_USE` ElementType:
    String baz(List<String> x); // 在 Kotlin 中会被看作: fun baz(List<String?>?): String?

    // 参数 `x` 的类型为平台类型, 因为它的可否为 null 注解明确标注为 UNKNOWN:
    String qux(@Nonnull(when = When.UNKNOWN) String x); // 在 Kotlin 中会被看作: fun baz(x: String!): String?
}
```

</div>

> 注意: 上面示例程序中的类型只在 strict 编译模式下才有效, 否则, Kotlin 会将它们识别为平台类型.
详情请参见本章的 [`@UnderMigration` 注解](#undermigration-annotation-since-1160)小节 以及 [编译器配置](#compiler-configuration)小节.

另外还支持包级别的可否为 null 默认设定:

<div class="sample" markdown="1" theme="idea" mode="java">

```java
// FILE: test/package-info.java
@NonNullApi // 'test' 包内的所有声明, 默认都是非 null
package test;
```

</div>

#### `@UnderMigration` 注解 (从 1.1.60 版开始有效)

库的维护者可以使用 `@UnderMigration` 注解 (由独立的库文件 `kotlin-annotations-jvm` 提供),
来定义可否为空(nullability)类型标识符的迁移状态.

如果不正确地使用了被注解的类型(比如, 把一个标注了 `@MyNullable` 的类型值当作非空类型来使用),
`@UnderMigration(status = ...)` 注解中的 status 值指定编译器应当如何处理:

* `MigrationStatus.STRICT` 让注解象任何通常的可否为空(nullability)注解那样工作, 也就是,
对不正确的使用报告错误, 并且影响 Kotlin 对被注解类型的识别;

* 使用 `MigrationStatus.WARN`, 不正确的使用在编译时会被报告为警告, 而不是错误,
但被注解的声明中的类型, 在 Kotlin 中会被识别为平台类型;

* 此外还有 `MigrationStatus.IGNORE`, 会让编译器完全忽略可否为空(nullability)注解.

库的维护者可以对类型限定符别名(Type qualifier nickname), 以及类型限定符默认值(Type qualifier default), 指定 `@UnderMigration` 的 status 值:

<div class="sample" markdown="1" theme="idea" mode="java">

```java
@Nonnull(when = When.ALWAYS)
@TypeQualifierDefault({ElementType.METHOD, ElementType.PARAMETER})
@UnderMigration(status = MigrationStatus.WARN)
public @interface NonNullApi {
}

// 这个类中的类型将是非空的, 但编译时只会报告警告
// 因为对 `@NonNullApi` 添加了 `@UnderMigration(status = MigrationStatus.WARN)` 注解
@NonNullApi
public class Test {}
```

</div>

注意: 一个可否为空(nullability)注解的 MigrationStatus 值, 不会被它的类型限定符别名继承,
但在使用时类型限定符默认值会有效.

如果一个类型限定符默认值使用了一个类型限定符别名, 而且他们都添加了 `@UnderMigration` 注解,
这时会优先使用类型限定符默认值中的 MigrationStatus.

#### 编译器配置

可以添加 `-Xjsr305` 编译器选项来配置 JSR-305 规范检查, 这个编译器选项可以使用以下设置之一(或者多个设置的组合):

* `-Xjsr305={strict|warn|ignore}` 用来设置非 `@UnderMigration` 注解的行为.
自定义的可否为空注解, 尤其是 `@TypeQualifierDefault`, 已经大量出现在很多知名的库中,
当使用者升级到支持 JSR-305 Kotlin 版本时, 可能会需要平滑地迁移这些库.
从 Kotlin 1.1.60 开始, 这个设置值影响 非 `@UnderMigration` 的注解.

* `-Xjsr305=under-migration:{strict|warn|ignore}` (从 1.1.60 开始支持) 用来覆盖 `@UnderMigration` 注解的行为.
对于库的迁移状态, 库的使用者可能会存在不用的看法:
当库的作者发布的官方迁移状态为 `WARN` 时, 库的使用者却可能希望报告编译错误, 或者反过来,
他们也可能希望对于某些代码暂时不要报告编译错误, 直到他们完成迁移.

* `-Xjsr305=@<fq.name>:{strict|warn|ignore}` (从 1.1.60 开始支持) 用来覆盖单个注解的行为,
这里的 `<fq.name>` 是注解的完整限定类名(fully qualified class name).
对于不同的注解, 可以多次指定这个编译选项. 对于管理某个特定库的迁移状态, 这个编译选项非常有用.

这里的 `strict`, `warn` 以及 `ignore` 值, 与 `MigrationStatus` 中对应值的意义完全相同,
而且只有 `strict` 模式会影响 Kotlin 对被注解的声明中的类型的识别.

> 注意: 无论 `-Xjsr305` 编译器选项的设置如何,
JSR-305 内置的注解 [`@Nonnull`](https://aalmiray.github.io/jsr-305/apidocs/javax/annotation/Nonnull.html),
[`@Nullable`](https://aalmiray.github.io/jsr-305/apidocs/javax/annotation/Nullable.html)
以及 [`@CheckForNull`](https://aalmiray.github.io/jsr-305/apidocs/javax/annotation/CheckForNull.html)
始终是有效的, 并且会影响 Kotlin 对被注解声明中的类型的识别.

比如, 如果在编译器参数中添加 `-Xjsr305=ignore -Xjsr305=under-migration:ignore -Xjsr305=@org.library.MyNullable:warn`,
对于被 `@org.library.MyNullable` 注解的类型, 如果存在不正确的使用, 此时编译器会报告警告,
但对于 JSR-305 的所有注解, 则会忽略这种不正确的使用.

对于 Kotlin 1.1.50+/1.2 版, 编译器的默认行为与 `-Xjsr305=warn` 一样.
目前 `strict` 设定还是实验性的 (未来可能会增加更多的检查).

## 数据类型映射

Kotlin 会对某些 Java 类型进行特殊处理. 这些类型会被从 Java 中原封不动地装载进来, 但被 _映射_ 为对应的 Kotlin 类型.
映射过程只会在编译时发生, 运行时的数据表达不会发生变化.
Java 的基本数据类型会被映射为对应的 Kotlin 类型(但请注意 [平台数据类型](#null-safety-and-platform-types) 问题):

| **Java 类型** | **Kotlin 类型**  |
|---------------|------------------|
| `byte`        | `kotlin.Byte`    |
| `short`       | `kotlin.Short`   |
| `int`         | `kotlin.Int`     |
| `long`        | `kotlin.Long`    |
| `char`        | `kotlin.Char`    |
| `float`       | `kotlin.Float`   |
| `double`      | `kotlin.Double`  |
| `boolean`     | `kotlin.Boolean` |
{:.zebra}

有些内建类虽然不是基本类型, 也会被映射为对应的 Kotlin 类型:

| **Java 类型** | **Kotlin 类型**  |
|---------------|------------------|
| `java.lang.Object`       | `kotlin.Any!`    |
| `java.lang.Cloneable`    | `kotlin.Cloneable!`    |
| `java.lang.Comparable`   | `kotlin.Comparable!`    |
| `java.lang.Enum`         | `kotlin.Enum!`    |
| `java.lang.Annotation`   | `kotlin.Annotation!`    |
| `java.lang.CharSequence` | `kotlin.CharSequence!`   |
| `java.lang.String`       | `kotlin.String!`   |
| `java.lang.Number`       | `kotlin.Number!`     |
| `java.lang.Throwable`    | `kotlin.Throwable!`    |
{:.zebra}

Java 中的装箱的基本类型(boxed primitive type), 会被映射为 Kotlin 的可为 null 类型:

| **Java 类型**           | **Kotlin 类型**  |
|-------------------------|------------------|
| `java.lang.Byte`        | `kotlin.Byte?`   |
| `java.lang.Short`       | `kotlin.Short?`  |
| `java.lang.Integer`     | `kotlin.Int?`    |
| `java.lang.Long`        | `kotlin.Long?`   |
| `java.lang.Character`   | `kotlin.Char?`   |
| `java.lang.Float`       | `kotlin.Float?`  |
| `java.lang.Double`      | `kotlin.Double?`  |
| `java.lang.Boolean`     | `kotlin.Boolean?` |
{:.zebra}

注意, 装箱的基本类型用作类型参数时, 会被映射为平台类型:
比如, `List<java.lang.Integer>` 在 Kotlin 中会变为 `List<Int!>`.

集合类型在 Kotlin 中可能是只读的, 也可能是内容可变的,
因此 Java 的集合会被映射为以下类型(下表中所有的 Kotlin 类型都属于 `kotlin.collections` 包):

| **Java 类型** | **Kotlin 只读类型**  | **Kotlin 内容可变类型** | **被装载的平台数据类型** |
|---------------|------------------|----|----|
| `Iterator<T>`        | `Iterator<T>`        | `MutableIterator<T>`            | `(Mutable)Iterator<T>!`            |
| `Iterable<T>`        | `Iterable<T>`        | `MutableIterable<T>`            | `(Mutable)Iterable<T>!`            |
| `Collection<T>`      | `Collection<T>`      | `MutableCollection<T>`          | `(Mutable)Collection<T>!`          |
| `Set<T>`             | `Set<T>`             | `MutableSet<T>`                 | `(Mutable)Set<T>!`                 |
| `List<T>`            | `List<T>`            | `MutableList<T>`                | `(Mutable)List<T>!`                |
| `ListIterator<T>`    | `ListIterator<T>`    | `MutableListIterator<T>`        | `(Mutable)ListIterator<T>!`        |
| `Map<K, V>`          | `Map<K, V>`          | `MutableMap<K, V>`              | `(Mutable)Map<K, V>!`              |
| `Map.Entry<K, V>`    | `Map.Entry<K, V>`    | `MutableMap.MutableEntry<K,V>` | `(Mutable)Map.(Mutable)Entry<K, V>!` |
{:.zebra}

Java 数据的映射如下, 详情参见 [下文](java-interop.html#java-arrays):

| **Java 类型** | **Kotlin 类型**  |
|---------------|------------------|
| `int[]`       | `kotlin.IntArray!` |
| `String[]`    | `kotlin.Array<(out) String>!` |
{:.zebra}

注意: 这些 Java 类型的静态成员, 无法通过 Kotlin 类型的[同伴对象](object-declarations.html#companion-objects)直接访问.
要访问这些静态成员, 需要使用 Java 类型的完整限定名称, 比如 `java.lang.Integer.toHexString(foo)`.

## 在 Kotlin 中使用 Java 的泛型

Kotlin 的泛型 与 Java 的泛型略有差异 (参见 [泛型](generics.html)). 将 Java 类型导入 Kotlin 时, 我们进行以下变换:

* Java 的通配符会被变换为 Kotlin 的类型投射,
  * `Foo<? extends Bar>` 变换为 `Foo<out Bar!>!`,
  * `Foo<? super Bar>` 变换为 `Foo<in Bar!>!`;

* Java 的原生类型(raw type) 转换为 Kotlin 的星号投射(star projection),
  * `List` 变换为 `List<*>!`, 也就是 `List<out Any?>!`.

与 Java 一样, Kotlin 的泛型信息在运行时不会保留, 也就是说, 创建对象时传递给构造器的类型参数信息, 在对象中不会保留下来,
所以, `ArrayList<Integer>()` 与 `ArrayList<Character>()` 在运行时刻是无法区分的.
这就导致无法进行带有泛型信息的 *is*{: .keyword } 判断.
Kotlin 只允许对星号投射(star projection)的泛型类型进行 *is*{: .keyword } 判断:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
if (a is List<Int>) // 错误: 无法判断它是不是 Int 构成的 List
// 但是
if (a is List<*>) // OK: 这里的判断不保证 List 内容的数据类型
```

</div>

## Java 数组

与 Java 不同, Kotlin 中的数组是不可变的(invariant).
这就意味着, Kotlin 不允许我们将 `Array<String>` 赋值给 `Array<Any>`,这样就可以避免发生运行时错误.
在调用 Kotlin 方法时, 如果参数声明为父类型的数组, 那么将子类型的数组传递给这个参数, 也是禁止的,
但对于 Java 的方法, 这是允许(通过使用 `Array<(out) String>!` 形式的[平台数据类型](##null-safety-and-platform-types)).

在 Java 平台上, 会使用基本类型构成的数组, 以避免装箱(boxing)/拆箱(unboxing)操作带来的性能损失.
由于 Kotlin 会隐藏这些实现细节, 因此与 Java 代码交互时需要使用一个替代办法.
对于每种基本类型, 都存在一个专门的类(`IntArray`, `DoubleArray`, `CharArray`, 等等) 来解决这种问题.
这些类与 `Array` 类没有关系, 而且会被编译为 Java 的基本类型数组, 以便达到最好的性能.

假设有一个 Java 方法, 接受一个名为 indices 的参数, 类型是 int 数组:

<div class="sample" markdown="1" theme="idea" mode="java">
``` java
public class JavaArrayExample {

    public void removeIndices(int[] indices) {
        // 方法代码在这里...
    }
}
```

</div>

为了向这个方法传递一个基本类型值构成的数组, 在 Kotlin 中你可以编写下面的代码:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndices(array)  // 向方法传递 int[] 参数
```

</div>

编译输出 JVM 字节码时, 编译器会对数组的访问处理进行优化, 因此不会产生性能损失:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val array = arrayOf(1, 2, 3, 4)
array[1] = array[1] * 2 // 编译器不会产生对 get() 和 set() 方法的调用
for (x in array) { // 不会创建迭代器(iterator)
    print(x)
}
```

</div>

即使我们使用下标来访问数组元素, 也不会产生任何性能损失:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
for (i in array.indices) { // 不会创建迭代器(iterator)
    array[i] += 2
}
```

</div>

最后, *in*{: .keyword } 判断也不会产生性能损失:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
if (i in array.indices) { // 等价于 (i >= 0 && i < array.size)
    print(array[i])
}
```

</div>

## Java 的可变长参数(Varargs)

Java 类的方法声明有时会对 indices 使用可变长的参数定义(varargs):

<div class="sample" markdown="1" theme="idea" mode="java">

``` java
public class JavaArrayExample {

    public void removeIndicesVarArg(int... indices) {
        // 方法代码在这里...
    }
}
```

</div>

这种情况下, 为了将 `IntArray` 传递给这个参数, 需要使用展开(spread) `*` 操作符:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndicesVarArg(*array)
```

</div>

对于使用可变长参数的 Java 方法, 目前无法向它传递 *null*{: .keyword } 参数.

## 操作符

由于 Java 中无法将方法标记为操作符重载方法, Kotlin 允许我们使用任何的 Java 方法,
只要方法名称和签名定义满足操作符重载的要求, 或者满足其他规约(`invoke()` 等等.)
使用中缀调用语法来调用 Java 方法是不允许的.


## 受控异常(Checked Exception)

在 Kotlin 中, 所有的异常都是不受控的(unchecked), 也就是说编译器不会强制要求你捕获任何异常.
因此, 当调用 Java 方法时, 如果这个方法声明了受控异常, Kotlin 不会要求你做任何处理:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun render(list: List<*>, to: Appendable) {
    for (item in list) {
        to.append(item.toString()) // Java 会要求我们在这里捕获 IOException
    }
}
```

</div>

## Object 类的方法

当 Java 类型导入 Kotlin 时, 所有 `java.lang.Object` 类型的引用都会被转换为 `Any` 类型.
由于 `Any` 类与具体的实现平台无关, 因此它声明的成员方法只有 `toString()`, `hashCode()` 和 `equals()`,
所以, 为了补足 `java.lang.Object` 中的其他方法, Kotlin 使用了 [扩展函数](extensions.html).

### wait()/notify()

对 `Any` 类型的引用不能使用 `wait()` 和 `notify()` 方法,
通常也不建议使用这些方法, 而应该改用 `java.util.concurrent` 中的功能来替代.
如果你确实需要调用这些方法, 那么可以先将它变换为 `java.lang.Object` 类型:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
(foo as java.lang.Object).wait()
```

</div>

### getClass()

要得到一个对象的 Java Class 信息, 可以使用 [类引用](reflection.html#class-references) 的 `java` 扩展属性:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val fooClass = foo::class.java
```

</div>

上面的示例程序中, 使用了一个 [与对象实例绑定的类引用](reflection.html#bound-class-references-since-11),
这个功能从 Kotlin 1.1 开始支持.
你也可以使用 `javaClass` 扩展属性:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val fooClass = foo.javaClass
```

</div>

### clone()

要覆盖 `clone()` 方法, 你的类需要实现 `kotlin.Cloneable` 接口:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Example : Cloneable {
    override fun clone(): Any { ... }
}
```

</div>

别忘了 [Effective Java, 第 3 版](http://www.oracle.com/technetwork/java/effectivejava-136174.html),
第 13 条: *要正确地覆盖 clone 方法*.

### finalize()

要覆盖 `finalize()` 方法, 你只需要声明它既可, 不必使用 *override*{:.keyword} 关键字:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class C {
    protected fun finalize() {
        // finalization 处理逻辑
    }
}
```

</div>

按照 Java 的规则, `finalize()` 不能是 *private*{: .keyword } 方法.

## 继承 Java 的类

Kotlin 类的超类中, 最多只能指定一个 Java 类(Java 接口的数量没有限制).

## 访问静态成员(static member)

Java 类的静态成员(static member)构成这些类的"同伴对象(companion object)".
我们不能将这样的"同伴对象" 当作值来传递, 但可以明确地访问它的成员, 比如:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
if (Character.isLetter(a)) { ... }
```

</div>

当一个 Java 类型[映射](#mapped-types)为一个 Kotlin 类型时,
如果要访问其中的静态成员, 需要使用 Java 类型的完整限定名: `java.lang.Integer.bitCount(foo)`.

## Java 的反射

Java 的反射在 Kotlin 类中也可以使用, 反过来也是如此.
我们在上文中讲到, 你可以使用 `instance::class.java`, `ClassName::class.java`, 或者 `instance.javaClass`,
得到 `java.lang.Class`, 然后通过它就可以使用 Java 的反射功能.

此外还支持其他反射功能, 比如可以得到 Kotlin 属性对应的 Java get/set 方法或后端成员,
可以得到 Java 成员变量对应的 `KProperty`, 得到 `KFunction` 对应的 Java 方法或构造器,
或者反过来得到 Java 方法或构造器对应的 `KFunction`.

## SAM 转换

与 Java 8 一样, Kotlin 支持 SAM(Single Abstract Method) 转换.
也就是说如果一个 Java 接口中仅有一个方法, 并且没有默认实现, 那么只要 Java 接口方法与 Kotlin 函数参数类型一致,
Kotlin 的函数字面值就可以自动转换为这个接口的实现者.

你可以使用这个功能来创建 SAM 接口的实例:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val runnable = Runnable { println("This runs in a runnable") }
```

</div>

...也可以用在方法调用中:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val executor = ThreadPoolExecutor()
// Java 方法签名: void execute(Runnable command)
executor.execute { println("This runs in a thread pool") }
```

</div>

如果 Java 类中有多个同名的方法, 而且方法参数都可以接受函数式接口,
那么你可以使用一个适配器函数(adapter function), 将 Lambda 表达式转换为某个具体的 SAM 类型,
然后就可以选择需要调用的方法. 编译器也会在需要的时候生成这些适配器函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
executor.execute(Runnable { println("This runs in a thread pool") })
```

</div>

注意, SAM 转换只对接口有效, 不能用于抽象类, 即使抽象类中仅有唯一一个抽象方法.

还应当注意, 这个功能只在 Kotlin 与 Java 互操作时有效;
由于 Kotlin 本身已经有了专门的函数类型, 因此没有必要将函数自动转换为 Kotlin 接口的实现者, Kotlin 也不支持这样的转换.

## 在 Kotlin 中使用 JNI(Java Native Interface)

要声明一个由本地代码(C 或者 C++)实现的函数, 你需要使用 `external` 修饰符标记这个函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
external fun foo(x: Int): Double
```

</div>

剩下的工作与 Java 中完全相同.
