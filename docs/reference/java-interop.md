---
type: doc
layout: reference
category: "Interop"
title: "在 Kotlin 中调用 Java"
---

# 在 Kotlin 中调用 Java 代码

Kotlin 的设计过程中就考虑到了与 Java 的互操作性. 在 Kotlin 中可以通过很自然的方式调用既有的 Java 代码, 反过来在 Java 中也可以很流畅地使用 Kotlin 代码. 本章中我们介绍在 Kotlin 中调用 Java 代码的一些细节问题.

大多数 Java 代码都可以直接使用, 没有任何问题:

``` kotlin
import java.util.*

fun demo(source: List<Int>) {
  val list = ArrayList<Int>()
  // 对 Java 集合使用 'for' 循环:
  for (item in source)
    list.add(item)
  // 也可以对 Java 类使用 Kotlin 操作符:
  for (i in 0..source.size() - 1)
    list[i] = source[i] // 这里会调用 get 和 set 方法
}
```

## Get 和 Set 方法

符合 Java 的 Get 和 Set 方法规约的方法(无参数, 名称以 `get` 开头, 或单个参数, 名称以 `set`开头) 在 Kotlin 中会被识别为属性. 比如:

``` kotlin
import java.util.Calendar

fun calendarDemo() {
    val calendar = Calendar.getInstance()
    if (calendar.firstDayOfWeek == Calendar.SUNDAY) {  // 这里会调用 getFirstDayOfWeek()
        calendar.firstDayOfWeek = Calendar.MONDAY       // 这里会调用 setFirstDayOfWeek()
    }
}
```

注意, 如果 Java 类中只有 set 方法, 那么在 Kotlin 中不会被识别为属性, 因为 Kotlin 目前还不支持只写(set-only) 的属性.

## 返回值为 void 的方法

如果一个 Java 方法返回值为 void, 那么在 Kotlin 中调用时将返回 `Unit`.
如果, 在 Kotlin 中使用了返回值, 那么会由 Kotlin 编译器在调用处赋值, 因为返回值已经预先知道了(等于 `Unit`).

## 当 Java 标识符与 Kotlin 关键字重名时的转义处理

某些 Kotlin 关键字在 Java 中是合法的标识符: *in*{: .keyword }, *object*{: .keyword }, *is*{: .keyword }, 等等.
如果 Java 类库中使用 Kotlin 的关键字作为方法名, 你仍然可以调用这个方法, 只要使用反引号(`)对方法名转义即可:

``` kotlin
foo.`is`(bar)
```

## Null 值安全性与平台数据类型

Java 中的所有引用都可以为 *null*{: .keyword } 值, 因此对于来自 Java 的对象, Kotlin 的严格的 null 值安全性要求就变得毫无意义了.
Java 中定义的类型在 Kotlin 中会被特别处理, 被称为 *平台数据类型(platform type)*. 对于这些类型, Null 值检查会被放松, 因此对它们来说, 只提供与 Java 中相同的 null 值安全保证(详情参见[下文](#mapped-types)).

我们来看看下面的例子:

``` kotlin
val list = ArrayList<String>() // 非 null 值 (因为是构造器方法的返回结果)
list.add("Item")
val size = list.size() // 非 null 值 (因为是基本类型 int)
val item = list[0] // 类型自动推断结果为平台类型 (通常的 Java 对象)
```

对于平台数据类型的变量, 当我们调用它的方法时, Kotlin 不会在编译时刻报告可能为 null 的错误, 但这个调用在运行时可能失败, 原因可能是发生 null 指针异常, 也可能是 Kotlin 编译时为防止 null 值错误而产生的断言, 在运行时导致失败:

``` kotlin
item.substring(1) // 编译时允许这样的调用, 但在运行时如果 item == null 则可能抛出异常
```

平台数据类型是 *无法指示的(non-denotable)*, 也就是说不能在语言中明确指出这样的类型.
当平台数据类型的值赋值给 Kotlin 变量时, 我们可以依靠类型推断(这时变量的类型会被自动推断为平台数据类型, 比如上面示例程序中的变量 `item` 就是如此), 或者我们也可以选择我们期望的数据类型(可为 null 的类型和非 null 类型都允许):

``` kotlin
val nullable: String? = item // 允许, 永远不会发生错误
val notNull: String = item // 允许, 但在运行时刻可能失败
```

如果我们选择使用非 null 类型, 那么编译器会在赋值处理之前输出一个断言(assertion). 它负责防止 Kotlin 中的非 null 变量指向一个 null 值. 当我们将平台数据类型的值传递给 Kotlin 函数的非 null 值参数时, 也会输出断言.
总之, 编译器会尽可能地防止 null 值错误在程序中扩散(然而, 有些时候由于泛型的存在, 不可能完全消除这种错误).

### 对平台数据类型的注解

上文中我们提到, 平台数据类型无法在程序中明确指出, 因此在 Kotlin 语言中没有专门的语法来表示这种类型.
然而, 有时编译器和 IDE 仍然需要表示这些类型(比如在错误消息中, 在参数信息中, 等等), 因此, 我们有一种助记用的注解:

* `T!` 代表 "`T` 或者 `T?`",
* `(Mutable)Collection<T>!` 代表 "元素类型为 `T` 的Java 集合, 内容可能可变, 也可能不可变, 值可能允许为 null, 也可能不允许为 null",
* `Array<(out) T>!` 代表 "元素类型为 `T` (或 `T` 的子类型)的 Java 数组, 值可能允许为 null, 也可能不允许为 null"

### 可否为 null(Nullability) 注解

带有可否为 null(Nullability) 注解的 Java 类型在 Kotlin 中不会被当作平台数据类型, 而会被识别为可为 null 的, 或非 null 的 Kotlin 类型. 编译器支持几种不同风格的可否为 null 注解, 包括:

  * [JetBrain](https://www.jetbrains.com/idea/help/nullable-and-notnull-annotations.html)
(`org.jetbrains.annotations` 包中定义的 `@Nullable` 和 `@NotNull` 注解)
  * Android (`com.android.annotations` 和 `android.support.annotations`)
  * JSR-305 (`javax.annotation`)
  * FindBugs (`edu.umd.cs.findbugs.annotations`)
  * Eclipse (`org.eclipse.jdt.annotation`)
  * Lombok (`lombok.NonNull`).

完整的列表请参见 [Kotlin 编译器源代码](https://github.com/JetBrains/kotlin/blob/master/core/descriptor.loader.java/src/org/jetbrains/kotlin/load/java/JvmAnnotationNames.kt).

## 数据类型映射

Kotlin 会对某些 Java 类型进行特殊处理. 这些类型会被从 Java 中原封不动地装载进来, 但被 _映射_ 为对应的 Kotlin 类型. 映射过程只会在编译时发生, 运行时的数据表达不会发生变化.
Java 的基本数据类型会被映射为对应的 Kotlin 类型(但请注意 [平台数据类型](#platform-types) 问题):

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
| `java.lang.Deprecated`   | `kotlin.Deprecated!`    |
| `java.lang.Void`         | `kotlin.Nothing!`    |
| `java.lang.CharSequence` | `kotlin.CharSequence!`   |
| `java.lang.String`       | `kotlin.String!`   |
| `java.lang.Number`       | `kotlin.Number!`     |
| `java.lang.Throwable`    | `kotlin.Throwable!`    |
{:.zebra}

集合类型在 Kotlin 中可能是只读的, 也可能是内容可变的, 因此 Java 的集合会被映射为以下类型(下表中所有的 Kotlin 类型都属于 `kotlin` 包):

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

## 在 Kotlin 中使用 Java 的泛型

Kotlin 的泛型 与 Java 的泛型略有差异 (参见 [泛型](generics.html)). 将 Java 类型导入 Kotlin 时, 我们进行以下变换:

* Java 的通配符会被变换为 Kotlin 的类型投射
  * `Foo<? extends Bar>` 变换为 `Foo<out Bar!>!`
  * `Foo<? super Bar>` 变换为 `Foo<in Bar!>!`

* Java 的原生类型(raw type) 转换为 Kotlin 的星号投射(star projection)
  * `List` 变换为 `List<*>!`, 也就是 `List<out Any?>!`

与 Java 一样, Kotlin 的泛型信息在运行时不会保留, 也就是说, 创建对象时传递给构造器的类型参数信息, 在对象中不会保留下来, 所以, `ArrayList<Integer>()` 与 `ArrayList<Character>()` 在运行时刻是无法区分的.
这就导致无法进行带有泛型信息的 *is*{: .keyword } 判断.
Kotlin 只允许对星号投射(star projection)的泛型类型进行 *is*{: .keyword } 判断:

``` kotlin
if (a is List<Int>) // 错误: 无法判断它是不是 Int 构成的 List
// 但是
if (a is List<*>) // OK: 这里的判断不保证 List 内容的数据类型
```

## Java 数组

与 Java 不同, Kotlin 中的数组是不可变的(invariant). 这就意味着, Kotlin 不允许我们将 `Array<String>` 赋值给 `Array<Any>`, 这样就可以避免发生运行时错误.
在调用 Kotlin 方法时, 如果参数声明为父类型的数组, 那么将子类型的数组传递给这个参数, 也是禁止的, 但对于 Java 的方法, 这是允许(通过使用 `Array<(out) String>!` 形式的[平台数据类型](#platform-types)).

在 Java 平台上, 会使用基本类型构成的数组, 以避免装箱(boxing)/拆箱(unboxing)操作带来的性能损失.
由于 Kotlin 会隐藏这些实现细节, 因此与 Java 代码交互时需要使用一个替代办法.
对于每种基本类型, 都存在一个专门的类(`IntArray`, `DoubleArray`, `CharArray`, 等等) 来解决这种问题.
这些类与 `Array` 类没有关系, 而且会被编译为 Java 的基本类型数组, 以便达到最好的性能.

假设有一个 Java 方法, 接受一个名为 indices 的参数, 类型是 int 数组:

``` java
public class JavaArrayExample {

    public void removeIndices(int[] indices) {
        // 方法代码在这里...
    }
}
```

为了向这个方法传递一个基本类型值构成的数组, 在 Kotlin 中你可以编写下面的代码:

``` kotlin
val javaObj = JavaArrayExample()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndices(array)  // 向方法传递 int[] 参数
```

编译输出 JVM 字节码时, 编译器会对数组的访问处理进行优化, 因此不会产生性能损失:

``` kotlin
val array = arrayOf(1, 2, 3, 4)
array[x] = array[x] * 2 // 编译器不会产生对 get() 和 set() 方法的调用
for (x in array) // 不会创建迭代器(iterator)
  print(x)
```

即使我们使用下标来遍历数组, 也不会产生任何性能损失:

``` kotlin
for (i in array.indices) // 不会创建迭代器(iterator)
  array[i] += 2
```

最后, *in*{: .keyword } 判断也不会产生性能损失:

``` kotlin
if (i in array.indices) { // 等价于 (i >= 0 && i < array.size)
  print(array[i])
}
```

## Java 的可变长参数(Varargs)

Java 类的方法声明有时会对 indices 使用可变长的参数定义(varargs).

``` java
public class JavaArrayExample {

    public void removeIndices(int... indices) {
        // 方法代码在这里...
    }
}
```

这种情况下, 为了将 `IntArray` 传递给这个参数, 需要使用展开(spread) `*` 操作符:

``` kotlin
val javaObj = JavaArray()
val array = intArrayOf(0, 1, 2, 3)
javaObj.removeIndicesVarArg(*array)
```

对于使用可变长参数的 Java 方法, 目前无法向它传递 *null*{: .keyword } 参数.

## 操作符

由于 Java 中无法将方法标记为操作符重载方法, Kotlin 允许我们使用任何的 Java 方法, 只要方法名称和签名定义满足操作符重载的要求, 或者满足其他规约(`invoke()` 等等.)
使用中缀调用语法来调用 Java 方法是不允许的.


## 受控异常(Checked Exception)

在 Kotlin 中, 所有的异常都是不受控的(unchecked), 也就是说编译器不会强制要求你捕获任何异常.
因此, 当调用 Java 方法时, 如果这个方法声明了受控异常, Kotlin 不会要求你做任何处理:

``` kotlin
fun render(list: List<*>, to: Appendable) {
  for (item in list)
    to.append(item.toString()) // Java 会要求我们在这里捕获 IOException
}
```

## Object 类的方法

当 Java 类型导入 Kotlin 时, 所有 `java.lang.Object` 类型的引用都会被转换为 `Any` 类型.
由于 `Any` 类与具体的实现平台无关, 因此它声明的成员方法只有 `toString()`, `hashCode()` 和 `equals()`,
所以, 为了补足 `java.lang.Object` 中的其他方法, Kotlin 使用了 [扩展函数](extensions.html).

### wait()/notify()

[Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html) 第 69 条建议使用并发控制用的功能函数库, 而不要使用 `wait()` 和 `notify()` 方法.
因此, 对 `Any` 类型的引用不能使用这些方法.
如果你确实需要调用这些方法, 那么可以先将它变换为 `java.lang.Object` 类型:

```kotlin
(foo as java.lang.Object).wait()
```

### getClass()

要得到一个对象的类型信息, 我们可以使用 javaClass 扩展属性.

``` kotlin
val fooClass = foo.javaClass
```

对于类, 应该使用 Foo::class.java, 而不是 Java 中的 `Foo.class`.


``` kotlin
val fooClass = Foo::class.java
```

### clone()

要覆盖 `clone()` 方法, 你的类需要实现 `kotlin.Cloneable` 接口:

```kotlin

class Example : Cloneable {
  override fun clone(): Any { ... }
}
```

别忘了 [Effective Java](http://www.oracle.com/technetwork/java/effectivejava-136174.html), 第 11 条: *要正确地覆盖 clone 方法*.

### finalize()

要覆盖 `finalize()` 方法, 你只需要声明它既可, 不必使用 *override*{:.keyword} 关键字:

```kotlin
class C {
  protected fun finalize() {
    // finalization logic
  }
}
```

按照 Java 的规则, `finalize()` 不能是 *private*{: .keyword } 方法.

## 继承 Java 的类

Kotlin 类的超类中, 最多只能指定一个 Java 类(Java 接口的数量没有限制).

## 访问静态成员(static member)

Java 类的静态成员(static member)构成这些类的"同伴对象(companion object)". 我们不能将这样的"同伴对象" 当作值来传递, 但可以明确地访问它的成员, 比如:

``` kotlin
if (Character.isLetter(a)) {
  // ...
}
```

## Java 的反射

Java 的反射在 Kotlin 类中也可以使用, 反过来也是如此. 我们在上文中讲到, 你可以使用 `instance.javaClass` 或 
`ClassName::class.java` 得到 `java.lang.Class`, 然后通过它就可以使用 Java 的反射功能.
 
此外还支持其他反射功能, 比如可以得到 Kotlin 属性对应的 Java get/set 方法或后端成员, 可以得到 Java 成员变量对应的 `KProperty`, 得到 `KFunction` 对应的 Java 方法或构造器, 或者反过来得到 Java 方法或构造器对应的 `KFunction`.

## SAM 转换

与 Java 8 一样, Kotlin 支持 SAM(Single Abstract Method) 转换. 也就是说如果一个 Java 接口中仅有一个方法, 并且没有默认实现, 那么只要 Java 接口方法与 Kotlin 函数参数类型一致, Kotlin 的函数字面值就可以自动转换为这个接口的实现者.

你可以使用这个功能来创建 SAM 接口的实例:

``` kotlin
val runnable = Runnable { println("This runs in a runnable") }
```

...也可以用在方法调用中:

``` kotlin
val executor = ThreadPoolExecutor()
// Java 方法签名: void execute(Runnable command)
executor.execute { println("This runs in a thread pool") }
```

如果 Java 类中有多个同名的方法, 而且方法参数都可以接受函数式接口, 那么你可以使用一个适配器函数(adapter function), 将 Lambda 表达式转换为某个具体的 SAM 类型, 然后就可以选择需要调用的方法. 编译器也会在需要的时候生成这些适配器函数.

``` kotlin
executor.execute(Runnable { println("This runs in a thread pool") })
```

注意, SAM 转换只对接口有效, 不能用于抽象类, 即使抽象类中仅有唯一一个抽象方法.

还应当注意, 这个功能只在 Kotlin 与 Java 互操作时有效; 由于 Kotlin 本身已经有了专门的函数类型, 因此没有必要将函数自动转换为 Kotlin 接口的实现者, Kotlin 也不支持这样的转换.

## 在 Kotlin 中使用 JNI(Java Native Interface) 

要声明一个由本地代码(C 或者 C++)实现的函数, 你需要使用 `external` 修饰符标记这个函数:

``` kotlin
external fun foo(x: Int): Double
```

剩下的工作与 Java 中完全相同.
