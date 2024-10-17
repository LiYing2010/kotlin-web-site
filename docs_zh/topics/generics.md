[//]: # (title: 泛型(Generic): in, out, where)

Kotlin 中的类也可以有类型参数, 与 Java 一样:

```kotlin
class Box<T>(t: T) {
    var value = t
}
```

要创建这样一个类的实例, 只需要指定类型参数:

```kotlin
val box: Box<Int> = Box<Int>(1)
```

但是, 如果类型参数可以通过推断得到, 比如, 通过构造器参数类型推断得到,
你可以省略类型参数:

```kotlin
val box = Box(1) // 1 的类型为 Int, 因此编译器知道类型为 Box<Int>
```

## 类型变异(Variance)

Java 的类型系统中, 最微妙最难于理解和使用的部分之一, 就是它的通配符类型(wildcard type) (参见 [Java 泛型 FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)).
Kotlin 中不存在这样的通配符类型. 而是使用声明处类型变异(declaration-site variance), 以及类型投射(type projection).

### Java 中的类型变异(Variance)和通配符(Wildcard)

让我们思考一下为什么 Java 需要这些神秘的通配符类型.
首先, Java 中的泛型类型是 _不可变的(invariant)_, 也就是说 `List<String>` _不是_ `List<Object>` 的子类型.
因为, 如果 `List` 不是 _不可变的(invariant)_, 那么下面的代码将可以通过编译, 但会在运行时导致一个异常,
那么 List 就并没有任何优于 Java 数组的地方了:

```java
// Java
List<String> strs = new ArrayList<String>();

// 在编译期, Java 会在这里报告类型不匹配的错误.
List<Object> objs = strs;

// 如果不报告这个错误会怎么样 ?
// 那么我们就能够向 String 组成的 List 添加一个 Integer 类型的元素.
objs.add(1);

// 然后在运行期, Java 会抛出 ClassCastException 异常: Integer cannot be cast to String
String s = strs.get(0);
```

Java 禁止上面示例中的做法, 以保证运行期的类型安全. 但这个原则背后存在一些隐含的影响.
比如, 我们来看看 `Collection` 接口的 `addAll()` 方法.
这个方法的签名应该是什么样的? 你可能会根据第一直觉, 将它定义为:

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<E> items);
}
```

但是这样的话, 你将无法进行下面这种操作(尽管它是绝对安全的):

```java
// Java

// 如果 addAll 方法使用前面那种简单的定义, 下面的代码无法编译:
// Collection<String> is not a subtype of Collection<Object>
void copyAll(Collection<Object> to, Collection<String> from) {
    to.addAll(from);
}
```

因此 `addAll()` 的签名定义实际上是这样的:

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<? extends E> items);
}
```

这里的 _通配符类型参数(wildcard type argument)_ `? extends E` 表示, 该方法接受的参数是一个集合,
集合元素的类型是 `E` _或 `E` 的子类型_, 而不限于 `E` 本身.
这就意味着, 你可以安全地从集合元素中 _读取_ `E` (因为集合的元素是 `E` 的某个子类型的实例),
但 _不能写入_ 到集合中去, 因为你不知道什么样的对象实例才能与这个 `E` 的未知子类型匹配.
尽管有这样的限制, 作为回报, 你得到了希望的功能: `Collection<String>` _是_ `Collection<? extends Object>` 的子类型.
也就是说, 指定了 _extends_ 边界 (_上_ 边界)的通配符类型, 使得我们的类型成为一种 _协变(covariant)_ 类型.

要理解这种模式的工作原理十分简单: 如果你只能从一个集合 _取得_ 元素, 那么就可以使用一个 `String` 组成的集合, 并从中读取 `Object` 实例.
反过来, 如果你只能向集合 _放入_ 元素, 那么就可以使用一个 `Object` 组成的集合, 并向其中放入 `String`:
在 Java 中有 `List<? super String>`, 它可以接受 `String`, 或 `String` 的任何父类型.

上面的后一种情况称为 _反向类型变异(contravariance)_,
对于 `List<? super String>`, 你只能调用那些接受 `String` 类型参数的方法
(比如, 可以调用 `add(String)`, 或 `set(int, String)`),
如果你对 `List<T>` 调用返回类型为 `T` 的方法时, 你得到的返回值将不会是 `String` 类型, 而是 `Object` 类型.

Joshua Bloch 在他的 [Effective Java, 第 3 版](http://www.oracle.com/technetwork/java/effectivejava-136174.html) 详细解释了这个问题,
(第 31 条: "为增加 API 的灵活性, 应该使用限定范围的通配符类型(bounded wildcard)").
他将那些只能 _读取_ 的对象称为 _生产者(Producer)_, 将那些只能 _写入_ 的对象称为 _消费者(Consumer)_.
他建议:

> "为尽量保证灵活性, 应该对代表生产者和消费者的输入参数使用通配符类型."

他还提出了下面的记忆口诀: _PECS_, 表示 _生产者(Producer)对应 Extends, 消费者(Consumer) 对应 Super_.

> 如果你使用一个生产者对象, 比如, `List<? extends Foo>`, 你将无法对这个对象调用 `add()` 或 `set()` 方法,
> 但这并不代表这个对象是 _值不变的(immutable)_:
> 比如, 你完全可以调用 `clear()` 方法来删除 List 内的所有元素, 因为 `clear()` 方法不需要任何参数.
>
> 通配符类型(或者其他任何的类型变异)唯一能够确保的仅仅是 _类型安全_.
> 对象值的不变性(Immutability)是与此完全不同的另一个问题.
>
{style="note"}

### 声明处的类型变异(Declaration-site variance)

假设有一个泛型接口 `Source<T>`, 其中不存在任何接受 `T` 作为参数的方法, 仅有返回值为 `T` 的方法:

```java
// Java
interface Source<T> {
    T nextT();
}
```

那么, 完全可以在 `Source<Object>` 类型的变量中保存一个 `Source<String>` 类型的实例 - 因为不存在对消费者方法的调用.
但 Java 不能理解这一点, 因此仍然禁止以下代码:

```java
// Java
void demo(Source<String> strs) {
    Source<Object> objects = strs; // !!! 在 Java 中禁止这样的操作
    // ...
}
```

为了解决这个问题, 你需要将对象类型声明为 `Source<? extends Object>`, 这样其实是毫无意义的,
因为在这样修改之后, 你所能调用的方法与修改之前其实是完全一样的, 因此, 使用这样复杂的类型声明并未带来什么好处.
但编译器并不理解这一点.

在 Kotlin 中, 我们有办法将这种情况告诉编译器. 这种技术称为 _声明处的类型变异(declaration site variance)_:
你可以对 `Source` 的 _类型参数_ `T` 添加注解, 来确保 `Source<T>` 的成员函数只会 _返回_ (生产) `T` 类型,
而绝不会消费 `T` 类型.
为了实现这个目的, 可以对 `T` 使用 _out_ 修饰符:

```kotlin
interface Source<out T> {
    fun nextT(): T
}

fun demo(strs: Source<String>) {
    val objects: Source<Any> = strs // 这是 OK 的, 因为 T 是一个 out 类型参数
    // ...
}
```

一般规则是: 当 `C` 类的类型参数 `T` 声明为 `out` 时, 那么在 `C` 的成员函数中, `T` 类型只允许出现在 _输出_ 位置,
这样的限制带来的回报就是, `C<Base>` 可以安全地用作 `C<Derived>` 的父类型.

也就是说, 你可以将 `C` 类称为, 在类型参数 `T` 上 _协变的(covariant)_, 或者说 `T` 是一个 _协变的(covariant)_ 类型参数.
你可以将 `C` 类看作 `T` 类型对象的 _生产者_, 而不是 `T` 类型对象的 _消费者_.

_out_ 修饰符称为 _协变注解(variance annotation)_, 而且, 由于这个注解出现在类型参数的声明处,
它提供了 _声明处的类型变异(declaration-site variance)_.
这种方案与 Java 中的 _使用处类型变异(use-site variance)_ 刚好相反, 在 Java 中, 是类型使用处的通配符产生了类型的协变.

除了 `out` 之外, Kotlin 还提供了另一种类型变异注解: `in`.
这个注解导致类型参数 `反向类型变异(contravariant)`: 也就是说这个类型将只能被消费, 而不能被生产.
反向类型变异的一个很好的例子是 `Comparable`:

```kotlin
interface Comparable<in T> {
    operator fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
    x.compareTo(1.0) // 1.0 类型为 Double, 是 Number 的子类型
    // 因此, 你可以将 x 赋值给 Comparable<Double> 类型的变量
    val y: Comparable<Double> = x // OK!
}
```

_in_ 和 _out_ 关键字的意义看来是十分直观的(同样的关键字已经在 C# 中使用很长时间了),
因此, 前面提到的记忆口诀也没有必要了, 我们可以将它改写为更高的抽象层次:

**[存在主义](https://en.wikipedia.org/wiki/Existentialism) 变形法则: 消费者进, 生产者出!** :-)

**译注: 上面两句翻译得不够好, 待校**

## 类型投射(Type projection) {id="type-projections"}

### 使用处的类型变异(Use-site variance): 类型投射(Type projection) {id="use-site-variance-type-projections"}

将声明类型参数 T 声明为 `out`, 就可以免去使用时子类化的麻烦, 这是十分方便的.
但是有些类 _不能_ 限定为仅仅只返回 `T` 类型值!
关于这个问题, 一个很好的例子是 `Array` 类:

```kotlin
class Array<T>(val size: Int) {
    operator fun get(index: Int): T { ... }
    operator fun set(index: Int, value: T) { ... }
}
```

这个类对于类型参数 `T` 既不能协变, 也不能反向协变. 这就带来很大的不便. 我们来看看下面的函数:

```kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
    assert(from.size == to.size)
    for (i in from.indices)
        to[i] = from[i]
}
```

这个函数应该将元素从一个 Array 复制到另一个 Array. 我们来试试使用一下这个函数:

```kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3) { "" }
copy(ints, any)
//   ^ 这里发生编译错误, 期待的参数类型是 Array<Any>, 但实际类型是 Array<Int>
```

在这里, 你又遇到了熟悉的老问题: `Array<T>` 对于类型参数 `T` 是 _不可变的_,
因此 `Array<Int>` 和 `Array<Any>` 谁也不是谁的子类型.
为什么不是? 原因与以前一样, 因为 `copy` 函数内可能发生预想外的行为,
比如, 它可能会试图向 `from` 数组中写入一个 `String`,
这时如果你传入的实际参数是一个 `Int` 的数组, 就会导致一个 `ClassCastException`.

为了禁止 `copy()` 函数向 `from` 数组 _写入_ 数据, 你可以这样:

```kotlin
fun copy(from: Array<out Any>, to: Array<Any>) { ... }
```

这种声明称为 _类型投射(type projection)_: 其含义是, `from` 不是一个单纯的数组, 而是一个被限制(_投射_)的数组.
你只能对这个数组调用那些返回值为类型参数 `T` 的方法, 在这个例子中, 只能调用 `get()` 方法.
这就是 _使用处的类型变异(use-site variance)_ 的实现方案, 对应 Java 的 `Array<? extends Object>`, 但略为简单一些.

你也可以使用 `in` 关键字来投射一个类型:

```kotlin
fun fill(dest: Array<in String>, value: String) { ... }
```

`Array<in String>` 与 Java 的 `Array<? super String>` 相同.
也就是说, 你可以使用 `CharSequence` 数组, 或者 `Object` 数组作为  `fill()` 函数的参数.

### 星号投射(Star-projection)

有些时候, 你可能想表示你并不知道类型参数的任何信息, 但是仍然希望能够安全地使用它.
这里所谓"安全地使用"是指, 对泛型类型定义一个类型投射, 要求这个泛型类型的所有的实体实例, 都是这个投射的子类型.

对于这个问题, Kotlin 提供了一种语法, 称为 _星号投射(star-projection)_:

- 假如类型定义为 `Foo<out T : TUpper>`, 其中 `T` 是一个协变的类型参数, 上界(Upper Bound)为 `TUpper`, `Foo<*>` 等价于 `Foo<out TUpper>`.
  它表示, 当 `T` 未知时, 你可以安全地从 `Foo<*>` 中 _读取_ `TUpper` 类型的值.
- 假如类型定义为 `Foo<in T>`, 其中 `T` 是一个反向协变的类型参数, `Foo<*>` 等价于 `Foo<in Nothing>`.
  它表示, 当 `T` 未知时, 你不能安全地向 `Foo<*>` _写入_ 任何东西.
- 假如类型定义为 `Foo<T : TUpper>`, 其中 `T` 是一个协变的类型参数, 上界(Upper Bound)为 `TUpper`,
  对于读取值的场合, `Foo<*>` 等价于 `Foo<out TUpper>`, 对于写入值的场合, 等价于 `Foo<in Nothing>`.

如果一个泛型类型中存在多个类型参数, 那么每个类型参数都可以单独的投射.
比如, 如果类型定义为 `interface Function<in T, out U>`, 你可以使用以下几种星号投射:

* `Function<*, String>`, 代表 `Function<in Nothing, String>`.
* `Function<Int, *>`, 代表 `Function<Int, out Any?>`.
* `Function<*, *>`, 代表 `Function<in Nothing, out Any?>`.

> 星号投射与 Java 的原生类型(raw type)非常类似, 但可以安全使用.
>
{style="note"}

## 泛型函数

不仅类可以有类型参数. 函数一样可以有类型参数. 类型参数放在函数名称 _之前_:

```kotlin
fun <T> singletonList(item: T): List<T> {
    // ...
}

fun <T> T.basicToString(): String { // 扩展函数
    // ...
}
```

调用泛型函数时, 应该在函数名称 _之后_ 指定调用端类型参数:

```kotlin
val l = singletonList<Int>(1)
```

如果可以通过程序上下文推断得到, 类型参数可以省略, 因此下面的例子也可以正确运行:

```kotlin
val l = singletonList(1)
```

## 泛型约束(Generic constraint)

对于一个给定的类型参数, 所允许使用的类型, 可以通过 _泛型约束(generic constraint)_ 来限制.

### 上界(Upper Bound) {id="upper-bounds"}

最常见的约束是 _上界(Upper Bound)_, 对应于 Java 中的 _extends_ 关键字:

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) {  ... }
```

冒号之后指定的类型就是类型参数的 _上界(Upper Bound)_:
表示对类型参数 `T`, 只允许使用 `Comparable<T>` 的子类型. 比如:

```kotlin
sort(listOf(1, 2, 3)) // 正确: Int 是 Comparable<Int> 的子类型
sort(listOf(HashMap<Int, String>())) // 错误: HashMap<Int, String> 不是 Comparable<HashMap<Int, String>> 的子类型
```

如果没有指定, 则默认使用的上界是 `Any?`. 在定义类型参数的尖括号内, 只允许定义唯一一个上界.
如果同一个类型参数需要指定多个上界, 这时需要使用单独的 _where_ 子句:

```kotlin
fun <T> copyWhenGreater(list: List<T>, threshold: T): List<String>
    where T : CharSequence,
          T : Comparable<T> {
    return list.filter { it > threshold }.map { it.toString() }
}
```

传入的类型必须同时满足 `where` 子句中的所有条件.
在上面的示例中, `T` 类型必须 _同时_ 实现 `CharSequence` 和 `Comparable` 接口.

## 确定不为 null 的类型 {id="definitely-non-nullable-types"}

为了让与 Java 的泛型类和接口的互操作更加便利, Kotlin 允许将泛型类型参数为声明 **确定不为 null**.

要将泛型类型 `T` 声明为确定不为 null, 请使用 `& Any` 来声明这个类型. 例如: `T & Any`.

确定不为 null 的类型的 [上界(Upper Bound)](#upper-bounds) 必须是可以为 null 的类型.

确定不为 null 的类型的最常见的使用场景是, 你想要覆盖 override 一个包含 `@NotNull` 参数的 Java 方法.
例如, 考虑下面的 `load()` 方法:

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
    public T save(T x) {}
    @NotNull
    public T load(@NotNull T x) {}
}
```

要在 Kotlin 中成功的覆盖 `load()` 方法, 你需要将 `T1` 声明为确定不为 null:

```kotlin
interface ArcadeGame<T1> : Game<T1> {
    override fun save(x: T1): T1
    // T1 确定不为 null
    override fun load(x: T1 & Any): T1 & Any
}
```

如果只使用 Kotlin, 那么你不太可能需要明确的声明确定不为 null 的类型,
因为 Kotlin 的类型推断功能会帮你解决这个问题.

## 类型擦除

对使用泛型声明的代码, Kotlin 在编译期进行类型安全性检查.
在运行期, 泛型类型的实例不保存关于其类型参数的任何信息.
我们称之为, 类型信息 _被擦除_ 了. 比如, `Foo<Bar>` 和 `Foo<Baz?>` 的实例, 其类型信息会被擦除, 只剩下 `Foo<*>`.

### 泛型的类型检查与类型转换 {id="generics-type-checks-and-casts"}

由于存在类型擦除的问题, 因此不存在一种通用的办法, 可以在运行期检查一个泛型类的实例是通过什么样的类型参数来创建的,
并且编译器禁止这样的 `is` 检查, 例如 `ints is List<Int>` 或 `list is T` (T 是类型参数).
但是, 你可以检查实例是否属于星号投射类型:

```kotlin
if (something is List<*>) {
    something.forEach { println(it) } // List 中元素的类型都被识别为 `Any?`
}
```

类似的, 如果(在编译期间)已经对一个实例的类型参数进行了静态检查,
你可以对泛型之外的部分进行 `is` 检查, 或类型转换.
注意, 下面的示例中省略了尖括号:

```kotlin
fun handleStrings(list: MutableList<String>) {
    if (list is ArrayList) {
        // `list` 会被智能转换为 `ArrayList<String>`
    }
}
```

对于不涉及类型参数的类型转换, 可以使用的相同语法, 但省略类型参数: `list as ArrayList`.

泛型函数调用的类型参数也只在编译期进行检查. 在函数内部, 类型参数不能用来进行类型检查, 而且向类型参数的类型转换 (`foo as T`) 也不做检查.
唯一的例外是使用 [实体化的类型参数(Reified type parameter)](inline-functions.md#reified-type-parameters) 的内联函数,
会将它们的实际类型参数内联到每一个调用处. 因此可以对类型参数使用类型检查和转换.
但是, 在类型检查或转换内部使用的泛型类型实例, 仍然存在上述限制.
例如, 在类型检查 `arg is T` 中, 如果 `arg` 自身是一个泛型类型的实例, 它的类型参数仍然会被擦除.

```kotlin
//sampleStart
inline fun <reified A, reified B> Pair<*, *>.asPairOf(): Pair<A, B>? {
    if (first !is A || second !is B) return null
    return first as A to second as B
}

val somePair: Pair<Any?, Any?> = "items" to listOf(1, 2, 3)

val stringToSomething = somePair.asPairOf<String, Any>()
val stringToInt = somePair.asPairOf<String, Int>()
val stringToList = somePair.asPairOf<String, List<*>>()
val stringToStringList = somePair.asPairOf<String, List<String>>() // 这段代码能够编译, 但破坏了类型安全型!
// 请展开示例代码查看详情

//sampleEnd

fun main() {
    println("stringToSomething = " + stringToSomething)
    println("stringToInt = " + stringToInt)
    println("stringToList = " + stringToList)
    println("stringToStringList = " + stringToStringList)
    //println(stringToStringList?.second?.forEach() {it.length}) // 这里会抛出 ClassCastException 异常, 因为 list 中的元素不是字符串
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 未检查的类型转换

将类型转换为带有实际类型参数的泛型类型, 例如 `foo as List<String>`, 在运行期也无法进行检查.
如果不能由编译器直接推断得到类型安全, 但通过高层的程序逻辑能够保证, 那么可以使用这种未检查的类型转换.
请看下面的示例.

```kotlin
fun readDictionary(file: File): Map<String, *> = file.inputStream().use {
    TODO("Read a mapping of strings to arbitrary elements.")
}

// 我们把值为 `Int` 的 map 保存到了这个文件
val intsFile = File("ints.dictionary")

// 此处会出现编译警告: Unchecked cast: `Map<String, *>` to `Map<String, Int>`
val intsDictionary: Map<String, Int> = readDictionary(intsFile) as Map<String, Int>
```

最后一行中的类型转换会出现编译警告.
编译器无法对这个类型转换在运行期进行完整地检查, 因此不能保证 map 中的值是 `Int`.

为了避免这种未检查的类型转换, 你可以重新设计你的程序结构.
在上例中, 你可以声明 `DictionaryReader<T>` 和 `DictionaryWriter<T>` 接口,
然后对不同的数据类型提供类型安全的实现类.
你可以引入合理的抽象层次, 将未检查的类型转换, 从对接口的调用代码中, 移动到具体的实现类中.
正确使用 [泛型类型变异(generic variance)](#variance) 也可能有助于解决这类问题.

对于泛型函数, 使用 [实体化的类型参数(Reified type parameter)](inline-functions.md#reified-type-parameters)
可以使得 `arg as T` 之类的类型转换变成可被检查的类型转换,
除非 `arg` 的类型带有 *它自己的* 类型参数, 并且在运行期间被擦除了.

对类型转换语句, 或这个语句所属的声明, 添加 `@Suppress("UNCHECKED_CAST")` [注解](annotations.md),
可以屏蔽未检查的类型转换导致的编译警告:

```kotlin
inline fun <reified T> List<*>.asListOfType(): List<T>? =
    if (all { it is T })
        @Suppress("UNCHECKED_CAST")
        this as List<T> else
        null
```

> **在 JVM 平台**: [数组类型](arrays.md) (`Array<Foo>`) 保持了被擦除的数组元素类型信息,
> 将某个类型向数组类型进行的转换, 可以进行部分地检查: 数组元素可否为空, 以及数组元素本身的类型参数仍然会被擦除.
> 比如, 只要 `foo` 是一个数组, 并且元素类型是任意一种 `List<*>`, 无论元素可否为 null,
> 那么 `foo as Array<List<String>?>` 转换就会成功.
>
{style="note"}

## 对类型参数的下划线操作符

可以对类型参数使用下划线操作符 `_`. 当其他类型已经明确指定时, 使用下划线操作符可以自动推断一个参数的类型:

```kotlin
abstract class SomeClass<T> {
    abstract fun execute() : T
}

class SomeImplementation : SomeClass<String>() {
    override fun execute(): String = "Test"
}

class OtherImplementation : SomeClass<Int>() {
    override fun execute(): Int = 42
}

object Runner {
    inline fun <reified S: SomeClass<T>, T> run() : T {
        return S::class.java.getDeclaredConstructor().newInstance().execute()
    }
}

fun main() {
    // T 被推断为 String, 因为 SomeImplementation 继承自 SomeClass<String>
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // T 被推断为 Int, 因为 OtherImplementation 继承自 SomeClass<Int>
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```
