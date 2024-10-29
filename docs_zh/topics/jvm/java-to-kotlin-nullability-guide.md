[//]: # (title: Java 和 Kotlin 中的可空性(Nullability))
[//]: # (description: 学习如何将 Java 的可空结构迁移到 Kotlin. 这篇向导讨论 Kotlin 中对可空类型的支持, Kotlin 如何处理来自 Java 的可空注解, 等等.)

_可空性(Nullability)_ 是指一个变量能否为 `null` 值的能力.
当变量值为 `null`, 使用这个变量指向的对象将会导致 `NullPointerException` 异常.
有很多种方法来编写代码, 来尽量减少发生指针异常的可能.

这篇向导会介绍在 Java 和在 Kotlin 中, 处理可为 null 值的变量的方案之间的区别.
这可以帮助你从 Java 迁移到 Kotlin, 并按照纯正的 Kotlin 风格来编写你的代码.

这篇向导的第一部分介绍最重要的差别 – Kotlin 对可为 null 类型的支持, 以及 Kotlin 如何处理 [来自 Java 代码的类型](#platform-types).
第二部分, 从 [检查函数调用的结果](#checking-the-result-of-a-function-call) 开始,
通过几种具体的情况, 解释二者的差异.

参见 [Kotlin 中的 null 值安全性](null-safety.md).

## 对可为 null 类型的支持 {id="support-for-nullable-types"}

Kotlin 和 Java 的类型系统最重要的区别是, Kotlin 明确支持 [可为 null 的类型](null-safety.md).
通过这种方式, 指定哪个变量可能包含 `null` 值.
如果一个变量可以为 `null`, 那么对这个变量调用方法是不安全的, 因为可能导致 `NullPointerException` 异常.
Kotlin 在编译期禁止这样的调用, 因此防止很多潜在的异常.
在运行期, 可为 null 类型的对象与不可为 null 类型的对象的处理方式是一样的:
可为 null 的类型 并不是不可为 null 类型的一个包装.
所有的检查都在编译期进行.
这就意味着, 在 Kotlin 中使用可为 null 类型, 几乎不存在运行期负担.

> 我们说 "几乎", 是因为, 尽管 _确实_ 生成了 [内在的](https://en.wikipedia.org/wiki/Intrinsic_function) 检查代码,
但它们在运行期的负担是非常非常小的.
>
{style="note"}

在 Java 中, 如果你不编写 null 检查代码, 那么方法可能会抛出 `NullPointerException` 异常:

```java
// Java
int stringLength(String a) {
    return a.length();
}

void main() {
    stringLength(null); // 这里会抛出 `NullPointerException` 异常
}
```
{id="get-length-of-null-java"}

这个调用会产生下面的输出:

```java
java.lang.NullPointerException: Cannot invoke "String.length()" because "a" is null
    at test.java.Nullability.stringLength(Nullability.java:8)
    at test.java.Nullability.main(Nullability.java:12)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
    at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
```

在 Kotlin 中, 所有的通常类型默认都是不可为 null 的, 除非你将它们明确的标记为可为 null.
如果你不期望 `a` 可以为 `null`, 可以将 `stringLength()` 函数声明如下:

```kotlin
// Kotlin
fun stringLength(a: String) = a.length
```
{id="get-length-kotlin"}

参数 `a` 类型为 `String` 类型, 在 Kotlin 中代表它永远包含一个 `String` 实例, 而且不能为 `null`.
Kotlin 中可为 null 的类型使用问号 `?` 来标记, 例如, `String?`.
如果 `a` 是 `String` 类型, 那么运行期出现 `NullPointerException` 是不可能的,
因为编译器会强制要求所有传递给 `stringLength()` 的参数不能为 `null`.

试图向 `stringLength(a: String)` 函数传递 `null` 值参数, 会导致编译期错误,
"Null can not be a value of a non-null type String":

![向不可为 null 的函数传递 null 值参数时的错误](passing-null-to-function.png){width=700}

如果你想要向这个函数传递任意值的参数, 包括 `null` 值, 请在参数类型之后添加一个问号 `String?`,
并在函数体内部进行检查, 以确保参数值不是 `null`:

```kotlin
// Kotlin
fun stringLength(a: String?): Int = if (a != null) a.length else 0
```
{id="get-length-of-null-kotlin"}

在检查通过之后, 在编译器执行检查的范围内, 编译器会将这个变量当作是不可为 null 的类型 `String`.

你不进行这样的检查, 代码会编译失败, 错误信息如下:
"Only [safe (?.)](null-safety.md#safe-call-operator) or [non-nullable asserted (!!.) calls](null-safety.md#not-null-assertion-operator) are allowed
on a [nullable receiver](extensions.md#nullable-receiver) of type String?".

这段代码还可以写得更简短一些 – 使用 [安全调用操作符 ?. (If-not-null 的简写表达)](idioms.md#if-not-null-shorthand),
可以将 null 检查和方法调用结合为一个操作符:

```kotlin
// Kotlin
fun stringLength(a: String?): Int = a?.length ?: 0
```
{id="get-length-of-null-shorter-kotlin"}

## 平台类型(Platform types)

在 Java 中, 你可以使用注解来表示一个变量是否可以为 `null`.
这些注解不是标准库的一部分, 但你可以分别添加这些注解.
例如, 你可以使用 JetBrains 注解 `@Nullable` 和 `@NotNull` (来自 `org.jetbrains.annotations` 包),
或 Eclipse 的注解(`org.eclipse.jdt.annotation` 包).
当你 [从 Kotlin 代码调用 Java 代码](java-interop.md#nullability-annotations) 时,
Kotlin 能够识别这些注解, 并根据注解来处理这些类型.

如果你的 Java 代码没有这样的注解, Kotlin 会将 Java 类型当作 _平台类型(Platform types)_.
但由于 Kotlin 没有这些类型的可空性信息, 它的编译器会允许对这些类型进行操作.
需要由你来决定是否执行 null 检查, 因为:

* 和 Java 中一样, 如果你试图在 `null` 值上执行操作, 那么会发生 `NullPointerException` 异常.
* 编译器不会对多余的 null 检查进行高亮度显示, 如果你对一个不可为 null 类型的值,执行 null 值安全的操作, 通常会高亮度显示.

更多详情请参见 [从 Kotlin 调用 Java 代码时, 如何处理 null 值安全性与平台类型](java-interop.md#null-safety-and-platform-types).

## 对确定不为 null (definitely non-nullable) 类型的支持

在 Kotlin 中, 如果要覆盖一个包含 `@NotNull` 参数的 Java 方法, 你需要 Kotlin 的确定不为 null (definitely non-nullable) 类型.

例如, 对于 Java 中的这个 `load()` 方法:

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
  public T save(T x) {}
  @NotNull
  public T load(@NotNull T x) {}
}
```

要在 Kotlin 中成功的覆盖 `load()` 方法, 你需要将 `T1` 声明为确定不为 null (`T1 & Any`):

```kotlin
interface ArcadeGame<T1> : Game<T1> {
  override fun save(x: T1): T1
  // T1 声明为确定不为 null
  override fun load(x: T1 & Any): T1 & Any
}
```

关于泛型中的确定不为 null 类型, 详情请参见 [确定不为 null 类型](generics.md#definitely-non-nullable-types).

## 检查函数调用的结果 {id="checking-the-result-of-a-function-call"}

需要进行 `null` 值检查的一种常见的情况是, 通过函数调用得到结果.

在下面的示例中, 有 2 个 类, `Order` 和 `Customer`. `Order` 包含一个指向 `Customer` 实例的引用.
`findOrder()` 函数返回 `Order` 类的一个实例, 如果它无法找到订单, 则返回 `null` 值.
目标要是处理得到的订单的客户实例.

下面是 Java 中的类:

```java
//Java
record Order (Customer customer) {}

record Customer (String name) {}
```

在 Java 中, 调用函数, 并对结果进行 if-not-null 检查, 然后取得需要的属性值:

```java
// Java
Order order = findOrder();

if (order != null) {
    processCustomer(order.getCustomer());
}
```
{id="process-customer-if-not-null-java"}

如果将上面的 Java 代码直接转换为 Kotlin 代码, 结果是:

```kotlin
// Kotlin
data class Order(val customer: Customer)

data class Customer(val name: String)

val order = findOrder()

// 直接转换
if (order != null){
    processCustomer(order.customer)
}
```
{id="process-customer-if-not-null-kotlin"}

这里可以使用 [安全调用操作符 `?.` (If-not-null 的简写表达)](idioms.md#if-not-null-shorthand),
结合标准库中的任何 [作用域函数](scope-functions.md).
通常可以使用 `let` 函数:

```kotlin
// Kotlin
val order = findOrder()

order?.let {
    processCustomer(it.customer)
}
```
{id="process-customer-with-let-kotlin"}

下面是更加简短的版本:

```kotlin
// Kotlin
findOrder()?.customer?.let(::processCustomer)
```
{id="process-customer-with-let-short-kotlin"}

## 使用默认值代替 null {id="default-values-instead-of-null"}

`null` 值检查通常用于对值为 `null` 的情况 [设置默认值](functions.md#default-arguments).

带有 null 检查的 Java 代码:

```java
// Java
Order order = findOrder();
if (order == null) {
    order = new Order(new Customer("Antonio"))
}
```
{id="default-value-instead-of-null-java"}

要在 Kotlin 中表达同样的功能, 请使用 [Elvis 操作符 (If-not-null-else 的简写表达)](null-safety.md#elvis-operator):

```kotlin
// Kotlin
val order = findOrder() ?: Order(Customer("Antonio"))
```
{id="default-value-instead-of-null-kotlin"}

## 返回一个值或返回 null 的函数

在 Java 中, 操作列表元素时你需要很小心.
你必须检查某个下标位置对应的元素是否存在, 然后才能使用这个元素:

```java
// Java
var numbers = new ArrayList<Integer>();
numbers.add(1);
numbers.add(2);

System.out.println(numbers.get(0));
//numbers.get(5) // 这里会发生异常!
```
{id="functions-returning-null-java"}

Kotlin 标准库通常会提供一些函数, 其名称表示它们可能会返回 `null` 值.
在集合 API 中, 这样的函数尤其普遍:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    // 和 Java 中一样的代码:
    val numbers = listOf(1, 2)

    println(numbers[0])  // 如果集合为空, 会抛出 IndexOutOfBoundsException 异常
    //numbers.get(5)     // 这里会发生异常!

    // 更加智能的代码:
    println(numbers.firstOrNull())
    println(numbers.getOrNull(5)) // 这里会返回 null 值
//sampleEnd
}
```
{kotlin-runnable="true" id="functions-returning-null-kotlin"}

## 聚合(Aggregate)操作

你需要得到最大元素, 或者如果不存在元素则得到 `null` 值, 在 Java 中你可以使用
[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html):

```java
// Java
var numbers = new ArrayList<Integer>();
var max = numbers.stream().max(Comparator.naturalOrder()).orElse(null);
System.out.println("Max: " + max);
```
{id="aggregate-functions-java"}

在 Kotlin 中, 可以使用 [聚合操作](collection-aggregate.md):

```kotlin
// Kotlin
val numbers = listOf<Int>()
println("Max: ${numbers.maxOrNull()}")
```
{id="aggregate-functions-kotlin"}

更多详情请参见 [Java 和 Kotlin 中的集合](java-to-kotlin-collections-guide.md).

## 安全的类型转换

如果你需要安全的转换一个类型, 在 Java 中你会使用 `instanceof` 操作符, 然后检查它是否成功:

```java
// Java
int getStringLength(Object y) {
    return y instanceof String x ? x.length() : -1;
}

void main() {
    System.out.println(getStringLength(1)); // 输出结果为 `-1`
}
```
{id="casting-types-java"}

在 Kotlin 中为了避免异常, 可以使用 [安全的转换操作符](typecasts.md#safe-nullable-cast-operator) `as?`, 它会在转换失败时返回 `null`:

```kotlin
// Kotlin
fun main() {
    println(getStringLength(1)) // 输出结果为 `-1`
}

fun getStringLength(y: Any): Int {
    val x: String? = y as? String // 结果为 null
    return x?.length ?: -1 // 返回 -1, 因为 `x` 为 null
}
```
{kotlin-runnable="true" id="casting-types-kotlin"}

> 在上面的 Java 示例中, `getStringLength()` 函数返回的结果是基本类型 `int`.
> 如果要让它返回 `null`, 你可以使用 [_装箱(boxed)_ 类型](https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html) `Integer`.
> 但是, 让这样的函数返回一个负值, 然后检查结果值, 在资源方面效率更高 –
> 如论如何你都需要进行检查, 但这种方式不会发生额外的装箱操作.
>
{style="note"}

## 下一步做什么?

* 阅读其他的 [Kotlin 惯用法](idioms.md).
* 学习如何使用 [Java-to-Kotlin (J2K) 转换器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k),
  将既有的 Java 代码转换为 Kotlin.
* 阅读其他的迁移向导:
  * [Java 和 Kotlin 中的字符串](java-to-kotlin-idioms-strings.md)
  * [Java 和 Kotlin 中的集合(Collection)](java-to-kotlin-collections-guide.md)

如果你有喜欢的惯用法, 欢迎你发送一个 pull request, 分享给我们!
