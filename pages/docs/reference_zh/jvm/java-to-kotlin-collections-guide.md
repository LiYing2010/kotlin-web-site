---
type: doc
layout: reference
category:
title: "Java 和 Kotlin 中的集合(Collection)"
---

# Java 和 Kotlin 中的集合(Collection)

本页面最终更新: 2022/04/29

[//]: # (学习如何将 Java 的集合迁移到 Kotlin 集合. 这篇向导讨论 Kotlin 和 Java 中的这类数据结构, 包括 List, ArrayList, Map, Set, 等等)

_集合_ 是一组可变数量(可以为 0)的元素, 解决问题时起到重要作用, 而且经常被用到.
本文解释并比较 Java 和 Kotlin 中集合的概念以及操作方式.
本文将帮助你从 Java 迁移到 Kotlin, 并以真正 Kotlin 的方式编写你的代码.

本文第 1 部分包括在 Java 和 Kotlin 中对同一个集合进行操作的快速介绍. 
分为 [共同的操作](#operations-that-are-the-same-in-java-and-kotlin) 
和 [只存在于 Kotlin 中的操作](#operations-that-don-t-exist-in-java-s-standard-library).
本文第 2 部分, 从 [可变性(Mutability)](#mutability) 开始, 通过例子来解释一些区别.

关于集合的介绍, 请参见 [集合概述(collections-overview.html),
或观看 Sebastian Aigner 讲解的这个 [视频](https://www.youtube.com/watch?v=F8jj7e-_jFA), 他是 Kotlin 开发者 Advocate.

> 下文中的所有示例都只使用 Java 和 Kotlin 标准库 API.
{:.note}

## 在 Java 和 Kotlin 中相同的操作

在 Kotlin 中, 有很多集合操作与在 Java 中的对应操作完全相同.

### 对 List, Set, Queue, 和 Deque 的操作

| 描述               | 共通操作                          | Kotlin 中的更多选择                                                                                                                              |
|------------------|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| 添加一个或多个元素        | `add()`, `addAll()`           | 使用 [`加然后赋值(plusAssign)`(`+=`) 操作符](../collection-plus-minus.html): `collection += element`, `collection += anotherCollection`.             |
| 检查集合是否包含一个或多个元素  | `contains()`, `containsAll()` | 使用 [`in` 关键字](../collection-elements.html#check-element-existence) 以操作符的形式调用 `contains()` 函数: `element in collection`.                     |
| 检查集合是否为空         | `isEmpty()`                   | 使用 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) 检查集合是否为非空.                          |
| 指定条件删除           | `removeIf()`                  |                                                                                                                                            |
| 只保留指定的元素         | `retainAll()`                 |                                                                                                                                            |
| 从集合删除所有元素        | `clear()`                     |                                                                                                                                            |
| 从集合得到一个 Stream   | `stream()`                    | Kotlin 有自己的方式来处理 Stream: [序列(Sequence)](#sequences), 以及方法, 比如 [`map()`](../collection-filtering.html) 和 [`filter()`](#filter-elements). |
| 从集合得到一个 Iterator | `iterator()`                  |                                                                                                                                            |

### 对 Map 的操作

| 描述                 | 共通操作                                    | Kotlin 中的更多选择                                                                                                                                                                          |
|--------------------|-----------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 添加一个或多个元素          | `put()`, `putAll()`, `putIfAbsent()`    | 在 Kotlin 中, 赋值操作 `map[key] = value` 的效果与 `put(key, value)` 相同. 你还可以使用 [`加然后赋值(plusAssign)`(`+=`) 操作符](../collection-plus-minus.html): `map += Pair(key, value)` 或 `map += anotherMap`. |
| 替换一个或多个元素          | `put()`, `replace()`, `replaceAll()`    | 使用下标访问操作符 `map[key] = value`, 而不是 `put()` 和 `replace()`.                                                                                                                               |
| 得到元素               | `get()`                                 | 使用下标访问操作符得到元素: `map[index]`.                                                                                                                                                           |
| 检查 Map 是否包含一个或多个元素 | `containsKey()`, `containsValue()`      | 使用 [`in` 关键字](../collection-elements.html#check-element-existence) 以操作符形式调用 `contains()` 函数: `element in map`.                                                                         |
| 检查 Map 是否为空        | `isEmpty()`                             | 使用 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) 检查 Map 是否为非空.                                                                   |
| 删除元素               | `remove(key)`, `remove(key, value)`     | 使用 [`减然后赋值(minusAssign)`(`-=`) 操作符](../collection-plus-minus.html): `map -= key`.                                                                                                      |
| 从 Map 删除所有元素       | `clear()`                               |                                                                                                                                                                                        |
| 从 Map 得到一个 Stream  | entries, keys, 或 values 的 `stream()` 函数 |                                                                                                                                                                                        |

### 只对 List 有效的操作

| 描述                       |共通操作 | Kotlin 中的更多选择                                               |
|--------------------------|-----------|-------------------------------------------------------------|
| 得到元素下标                   | `indexOf()` |                                                             |
| 得到元素的最后下标                | `lastIndexOf()` |                                                             |
| 得到元素                     | `get()` | 使用下标访问操作符得到元素: `list[index]`.                               |
| 获取一个子 List | `subList()` |                                                             |
| 替换一个或多个元素               | `set()`,  `replaceAll()` | 使用下标访问操作符, 而不是 `set()`: `list[index] = value`. |

## 略有不同的操作

### 对任何集合类型都有效的操作

| 描述                        | Java                                                                                                               | Kotlin |
|---------------------------|--------------------------------------------------------------------------------------------------------------------|--------|
| 得到集合的大小                   | `size()`                                                                                                           | `count()`, `size` |
| 平展访问(Flat Access) 嵌套的集合元素 | `collectionOfCollections.forEach(flatCollection::addAll)` 或 `collectionOfCollections.stream().flatMap().collect()` | [`flatten()`](../collection-transformations.html#flatten) 或 [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) |
| 对每个元素使用指定的函数              | `stream().map().collect()`                                                                                         | [`map()`](../collection-filtering.html) |
| 对集合元素顺序的使用指定的操作, 并返回累积的结果 | `stream().reduce()`                                                                                                | [`reduce()`, `fold()`](../collection-aggregate.html#fold-and-reduce) |
| 通过一个分类器对元素分组, 并统计         | `stream().collect(Collectors.groupingBy(classifier, counting()))`                                                  | [`eachCount()`](../collection-grouping.html) |
| 根据条件过滤                    | `stream().filter().collect()`                                                                                      | [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) |
| 检查集合元素是否满足条件              | `stream().noneMatch()`, `stream().anyMatch()`, `stream().allMatch()`                                               | [`none()`, `any()`, `all()`](../collection-filtering.html) |
| 对元素排序                     | `stream().sorted().collect()`                                                                                      | [`sorted()`](../collection-ordering.html#natural-order) |
| 获取前 N 个元素                 | `stream().limit(N).collect()`                                                                                      | [`take(N)`](../collection-parts.html#take-and-drop) |
| 指定条件获取元素                  | `stream().takeWhile().collect()`                                                                                   | [`takeWhile()`](../collection-parts.html#take-and-drop) |
| 跳过前 N 个元素                 | `stream().skip(N).collect()`                                                                                       | [`drop(N)`](../collection-parts.html#take-and-drop) |
| 指定条件跳过元素                  | `stream().dropWhile().collect()`                                                                                   | [`dropWhile()`](../collection-parts.html#take-and-drop) |
| 构建从集合元素到关联值的 Map         | `stream().collect(toMap(keyMapper, valueMapper))`                                                                  | [`associate()`](../collection-transformations.html#associate) |

要对 Map 执行上述所有操作, 你首先需要得到 Map 的 `entrySet` .

### 对 List 的操作

| 描述                      | Java | Kotlin |
|-------------------------|------|--------|
| 按照自然顺序排序 List           | `sort(null)` | `sort()` |
| 按照逆序排序 List             | `sort(comparator)` | `sortDescending()` |
| 从 List 删除元素             | `remove(index)`, `remove(element)`| `removeAt(index)`, `remove(element)` 或 [`collection -= element`](../collection-plus-minus.html) |
| 将 List 的所有元素填充为指定的值     | `Collections.fill()` | [`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) |
| 从 List 得到不重复的元素 | `stream().distinct().toList()` | [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) |

## 在 Java 标准库中不存在的操作

* [`zip()`, `unzip()`](../collection-transformations.html) – 变换集合.
* [`aggregate()`](../collection-grouping.html) – 根据条件分组.
* [`takeLast()`, `takeLastWhile()`, `dropLast()`, `dropLastWhile()`](../collection-parts.html#take-and-drop) – 根据条件获取或删除元素.
* [`slice()`, `chunked()`, `windowed()`](../collection-parts.html) – 获取集合的一部分.
* [Plus (`+`) and minus (`-`) 操作符](../collection-plus-minus.html) – 添加或删除元素.

如果你想要深入了解 `zip()`, `chunked()`, `windowed()`, 以及其他一些操作, 请观看 Sebastian Aigner 讲解的这个视频,
关于Kotlin 中集合的高级操作:

<iframe width="560" height="360" src="https://www.youtube.com/embed/N4CpLxGJlq0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 可变性

在 Java 中, 有可变的集合:

```java
// Java
// 这个 List 是可变的!
public List<Customer> getCustomers() { … }
```

也有部分可变的集合:

```java
// Java
List<String> numbers = Arrays.asList("one", "two", "three", "four");
numbers.add("five"); // 在运行时刻会发生 `UnsupportedOperationException` 错误
```

还有不可变的集合:

```java
// Java
List<String> numbers = new LinkedList<>();
// 这个 List 是 不可变的!
List<String> immutableCollection = Collections.unmodifiableList(numbers);
immutableCollection.add("five"); // 在运行时刻会发生 `UnsupportedOperationException` 错误
```

如果你在 IntelliJ IDEA 中编写后面两段代码, IDE 会提出警告, 告诉你正在修改不可变的对象. 
这段代码能够编译, 并在运行时刻发生 `UnsupportedOperationException` 错误.
你不能通过集合的类型判断它是否可变.

与 Java 不同, 在 Kotlin 中, 你会根据需要明确声明可变的或只读的集合.
如果你试图修改只读集合, 代码将会无法编译:

```kotlin
// Kotlin
val numbers = mutableListOf("one", "two", "three", "four")
numbers.add("five")            // 这是正确的
val immutableNumbers = listOf("one", "two")
//immutableNumbers.add("five") // 编译错误 - 无法解析的引用: add
```

关于可变性, 详情请参见 [Kotlin 编码规约](../coding-conventions.html#immutability).

## 协变(Covariance)

在 Java 中, 如果函数的参数是祖先类型元素的集合, 那么你不能传递一个后代类型元素的集合. 
比如, 如果 `Rectangle` 继承 `Shape`, 对于参数是 `Shape` 元素集合的函数, 你不能传递 `Rectangle` 元素类型的集合. 
要让代码能够编译, 需要使用 `? extends Shape` 类型, 才能让函数接受从 `Shape` 继承的后代类型元素的集合:

```java
// Java
class Shape {}

class Rectangle extends Shape {}

public void doSthWithShapes(List<? extends Shape> shapes) {
/* 如果只使用 List<Shape>, 那么如下面的例子那样, 使用 List<Rectangle> 作为参数调用
   这个函数时, 代码将无法编译 */
}

public void main() {
    var rectangles = List.of(new Rectangle(), new Rectangle());
    doSthWithShapes(rectangles);
}
```

在 Kotlin 中, 只读集合类型是 [协变的(Covariant)](../generics.html#variance).
因此, 如果 `Rectangle` 类继承自 `Shape` 类, 那么在要求 `List<Shape>` 类型的地方, 你可以使用 `List<Rectangle>` 类型.
也就是说, 集合类型之间的子类型关系与元素类型之间相同. Map 根据 value 类型协变, 而不是根据 key 类型.
可变的集合不是协变的 – 否则会导致运行时错误.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
// Kotlin
open class Shape(val name: String)

class Rectangle(private val rectangleName: String) : Shape(rectangleName)

fun doSthWithShapes(shapes: List<Shape>) {
    println("The shapes are: ${shapes.joinToString { it.name }}")
}

fun main() {
    val rectangles = listOf(Rectangle("rhombus"), Rectangle("parallelepiped"))
    doSthWithShapes(rectangles)
}
```

</div>

详情请参见 [集合类型](../collections-overview.html#collection-types).

## 值范围(Range)与数列(Progression)

在 Kotlin 中, 你可以使用 [值范围(Range)](../ranges.html#range) 创建数值范围.
比如, `Version(1, 11)..Version(1, 30)` 包括从 `1.11` 到 `1.30` 的所有版本.
你可以使用 `in` 操作符检查你的版本是否在范围中: `Version(0, 9) in versionRange`.

在 Java 中, 你需要手动检查一个 `Version` 是否在边界条件之内:

```java
// Java
class Version implements Comparable<Version> {

    int major;
    int minor;

    Version(int major, int minor) {
        this.major = major;
        this.minor = minor;
    }

    @Override
    public int compareTo(Version o) {
        if (this.major != o.major) {
            return this.major - o.major;
        }
        return this.minor - o.minor;
    }
}

public void compareVersions() {
    var minVersion = new Version(1, 11);
    var maxVersion = new Version(1, 31);

   System.out.println(
           versionIsInRange(new Version(0, 9), minVersion, maxVersion));
   System.out.println(
           versionIsInRange(new Version(1, 20), minVersion, maxVersion));
}

public Boolean versionIsInRange(Version versionToCheck, Version minVersion, 
                                Version maxVersion) {
    return versionToCheck.compareTo(minVersion) >= 0 
            && versionToCheck.compareTo(maxVersion) <= 0;
}
```

在 Kotlin 中, 你可以将值范围当作整个对象来操作. 你不需要创建两个变量, 并分别与 `Version` 进行比较:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
// Kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int {
        if (this.major != other.major) {
            return this.major - other.major
        }
        return this.minor - other.minor
    }
}

fun main() {
    val versionRange = Version(1, 11)..Version(1, 30)

    println(Version(0, 9) in versionRange)
    println(Version(1, 20) in versionRange)
}
```

</div>

如果你需要排除边界值, 比如检查一个版本是否大于或等于 (`>=`) 最小版本, 并且小于 (`<`) 最大版本, 那么这种包含边界值的值范围无法适用.

## 根据多个条件比较

在 Java 中, 要根据多个条件比较对象, 你可以使用
[`Comparator`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html)
接口的 [`comparing()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#comparing-java.util.function.Function-) 
和 [`thenComparingX()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#thenComparing-java.util.Comparator-)
函数 .
比如, 要按照姓名和年龄比较人:

```java
class Person implements Comparable<Person> {
    String name;
    int age;

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return this.name + " " + age;
    }
}

public void comparePersons() {
    var persons = List.of(new Person("Jack", 35), new Person("David", 30), 
            new Person("Jack", 25));
    System.out.println(persons.stream().sorted(Comparator
            .comparing(Person::getName)
            .thenComparingInt(Person::getAge)).collect(toList()));
}
```

在 Kotlin 中, 你只需要列举你希望比较的属性:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
data class Person(
    val name: String,
    val age: Int
)

fun main() {
    val persons = listOf(Person("Jack", 35), Person("David", 30), 
        Person("Jack", 25))
    println(persons.sortedWith(compareBy(Person::name, Person::age)))
}
```

</div>

## 序列(Sequence)

在 Java 中, 你可以这样生成一个数值序列(Sequence):

```java
// Java
int sum = IntStream.iterate(1, e -> e + 3)
    .limit(10).sum();
System.out.println(sum); // 输出结果为 145
```

在 Kotlin 中, 请使用 _[序列(Sequence)](../sequences.html)_.
对序列的多个步骤处理会尽可能延迟执行 – 只有在需要整个处理串的结果时, 实际的计算才会发生.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val sum = generateSequence(1) {
        it + 3
    }.take(10).sum()
    println(sum) // 输出结果为 145
//sampleEnd
}
```

</div>

对于一些过滤操作, 序列可能会减少需要执行的步骤.
详情请参见 [序列的处理示例](../sequences.html#sequence-processing-example), 这篇文档会演示 `Iterable` 和 `Sequence` 的区别.

## 从 List 删除元素

在 Java 中,
[`remove()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html#remove(int))
函数接受需要删除的元素下标.

要删除整数元素时, 使用 `Integer.valueOf()` 函数作为 `remove()` 函数的参数:

```java
// Java
public void remove() {
    var numbers = new ArrayList<>();
    numbers.add(1);
    numbers.add(2);
    numbers.add(3);
    numbers.add(1);
    numbers.remove(1); // 这里根据下标删除元素
    System.out.println(numbers); // [1, 3, 1]
    numbers.remove(Integer.valueOf(1));
    System.out.println(numbers); // [3, 1]
}
```

在 Kotlin 中, 有 2 种类型的元素删除函数: 
根据下标删除 [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html),
以及根据值删除 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove.html).

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = mutableListOf(1, 2, 3, 1)
    numbers.removeAt(0)
    println(numbers) // [2, 3, 1]
    numbers.remove(1)
    println(numbers) // [2, 3]
//sampleEnd
}
```

</div>

## 遍历 Map

在 Java 中, 你可以通过 [`forEach`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Map.html#forEach(java.util.function.BiConsumer)) 来遍历 Map:

```java
// Java
numbers.forEach((k,v) -> System.out.println("Key = " + k + ", Value = " + v));
```

在 Kotlin 中, 请使用 `for` 或 `forEach` 循环, 类似于 Java 的 `forEach`, 来遍历 Map:

```kotlin
// Kotlin
for ((k, v) in numbers) {
    println("Key = $k, Value = $v")
}
// 或
numbers.forEach { (k, v) -> println("Key = $k, Value = $v") }
```

## 从可能为空的集合得到第 1 个和最后 1 个元素

在 Java 中, 你可以检查集合大小, 并使用下标安全的得到第 1 个和最后 1 个 元素:

```java
// Java
var list = new ArrayList<>();
//...
if (list.size() > 0) {
    System.out.println(list.get(0));
    System.out.println(list.get(list.size() - 1));
}
```

对 [`Deque`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html)
和它的后代类, 你还可以使用
[`getFirst()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getFirst()) 
和
[`getLast()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getLast())
函数:

```java
// Java
var deque = new ArrayDeque<>();
//...
if (deque.size() > 0) {
    System.out.println(deque.getFirst());
    System.out.println(deque.getLast());
}
```

在 Kotlin 中, 有专门的函数
[`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)
和
[`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html). 
使用 [`Elvis 操作符`](../null-safety.html#elvis-operator), 你可以根据函数结果执行更多操作.
比如, `firstOrNull()`:

```kotlin
// Kotlin
val emails = listOf<String>() // 可能为空
val theOldestEmail = emails.firstOrNull() ?: ""
val theFreshestEmail = emails.lastOrNull() ?: ""
```

## 从 List 创建 Set 

在 Java 中, 要从
[`List`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html)
创建
[`Set`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html),
你可以使用
[`Set.copyOf`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html#copyOf(java.util.Collection))
函数:

```java
// Java
public void listToSet() {
    var sourceList = List.of(1, 2, 3, 1);
    var copySet = Set.copyOf(sourceList);
    System.out.println(copySet);
}
```

在 Kotlin 中, 使用函数 `toSet()`:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val sourceList = listOf(1, 2, 3, 1)
    val copySet = sourceList.toSet()
    println(copySet)
//sampleEnd
}
```
</div>

## 对元素分组

在 Java 中, 你可以使用
[Collectors](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Collectors.html)
函数 `groupingBy()`, 对元素分组:

```java
// Java
public void analyzeLogs() {
    var requests = List.of(
        new Request("https://kotlinlang.org/docs/home.html", 200),
        new Request("https://kotlinlang.org/docs/home.html", 400),
        new Request("https://kotlinlang.org/docs/comparison-to-java.html", 200)
    );
    var urlsAndRequests = requests.stream().collect(
            Collectors.groupingBy(Request::getUrl));
    System.out.println(urlsAndRequests);
}
```

在 Kotlin 中, 使用函数 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html):

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
class Request(
    val url: String,
    val responseCode: Int
)

fun main() {
//sampleStart
    // Kotlin
    val requests = listOf(
        Request("https://kotlinlang.org/docs/home.html", 200),
        Request("https://kotlinlang.org/docs/home.html", 400),
        Request("https://kotlinlang.org/docs/comparison-to-java.html", 200)
    )
    println(requests.groupBy(Request::url))
//sampleEnd
}
```

</div>

## 过滤元素

在 Java 中, 要过滤集合的元素, 你需要使用
[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html). 
Stream API 包括 `中间(Intermediate)` 和 `终止(Terminal)` 操作. `filter()` 是一个中间操作, 返回一个 Stream. 
要得到输出的集合, 你需要使用终止操作, 比如 `collect()`.
比如, 要只保留 key 以 `1` 结尾并且 value 大于 `10` 的对:

```java
// Java
public void filterEndsWith() {
    var numbers = Map.of("key1", 1, "key2", 2, "key3", 3, "key11", 11);
    var filteredNumbers = numbers.entrySet().stream()
        .filter(entry -> entry.getKey().endsWith("1") && entry.getValue() > 10)
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    System.out.println(filteredNumbers);
}
```

在 Kotlin 中, 过滤是集合内建的操作, `filter()` 返回与过滤之前相同的集合类型. 
因此, 你需要编写的代码只是 `filter()` 以及它的过滤条件:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredNumbers = numbers.filter { (key, value) -> key.endsWith("1") && value > 10 }
    println(filteredNumbers)
//sampleEnd
}
```

</div>

详情请参见 [过滤 Map](../map-operations.html#filter).

### 根据类型过滤元素 

在 Java 中, 要根据类型过滤元素, 并对其执行操作, 你需要使用 
[`instanceof`](https://docs.oracle.com/en/java/javase/17/language/pattern-matching-instanceof-operator.html)
操作符检查元素类型, 然后进行类型转换:

```java
// Java
public void objectIsInstance() {
    var numbers = new ArrayList<>();
    numbers.add(null);
    numbers.add(1);
    numbers.add("two");
    numbers.add(3.0);
    numbers.add("four");
    System.out.println("All String elements in upper case:");
    numbers.stream().filter(it -> it instanceof String)
        .forEach( it -> System.out.println(((String) it).toUpperCase()));
}
```

在 Kotlin 中, 你可以直接对集合调用
[`filterIsInstance<NEEDED_TYPE>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html), 
类型转换会由 [智能类型转换](../typecasts.html#smart-casts) 完成:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
// Kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = listOf(null, 1, "two", 3.0, "four")
    println("All String elements in upper case:")
    numbers.filterIsInstance<String>().forEach {
        println(it.uppercase())
    }
//sampleEnd
}
```

</div>

### 验证判定条件

一些任务要求你检查是否所有元素, 不存在元素, 或存在某些元素符合某个条件.
在 Java 中, 你可以通过
[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)
函数
[`allMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#allMatch(java.util.function.Predicate)), 
[`noneMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#noneMatch(java.util.function.Predicate)),
和 
[`anyMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#anyMatch(java.util.function.Predicate))
执行所有这些检查:

```java
// Java
public void testPredicates() {
    var numbers = List.of("one", "two", "three", "four");
    System.out.println(numbers.stream().noneMatch(it -> it.endsWith("e"))); // false
    System.out.println(numbers.stream().anyMatch(it -> it.endsWith("e"))); // true
    System.out.println(numbers.stream().allMatch(it -> it.endsWith("e"))); // false
}
```

在 Kotlin 中, 对所有的
[Iterable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/#kotlin.collections.Iterable)
对象, 可以使用 [扩展函数](../extensions.html) `none()`, `any()`, and `all()`:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
fun main() {
//sampleStart
// Kotlin
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.none { it.endsWith("e") })
    println(numbers.any { it.endsWith("e") })
    println(numbers.all { it.endsWith("e") })
//sampleEnd
}
```

</div>

详情请参见 [验证判定条件](../collection-filtering.html#test-predicates).

## 集合变换操作

### 合并(Zip)元素

在 Java 中, 你可以同时遍历两个集合, 将同一位置的两个元素变换为 pair :

```java
// Java
public void zip() {
    var colors = List.of("red", "brown");
    var animals = List.of("fox", "bear", "wolf");

    for (int i = 0; i < Math.min(colors.size(), animals.size()); i++) {
        String animal = animals.get(i);
        System.out.println("The " + animal.substring(0, 1).toUpperCase()
               + animal.substring(1) + " is " + colors.get(i));
   }
}
```

如果你希望做某些更加复杂的操作, 而不仅仅是将元素 pair 打印输出,
你可以使用 [Record](https://blogs.oracle.com/javamagazine/post/records-come-to-java).
在上面的示例中, Record 是 `record AnimalDescription(String animal, String color) {}`.

在 Kotlin 中, 使用 [`zip()`](../collection-transformations.html#zip) 函数可以完成相同的功能:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val colors = listOf("red", "brown")
    val animals = listOf("fox", "bear", "wolf")

    println(colors.zip(animals) { color, animal -> 
        "The ${animal.replaceFirstChar { it.uppercase() }} is $color" })
//sampleEnd
}
```
</div>

`zip()` 返回 [Pair](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) 对象组成的 List.

> 如果集合大小不同, `zip()` 的结果将是较小的那个集合大小. 结果中不包括较大那个集合的后面部分元素.
{:.note}

### 关联(Associate)元素

在 Java 中, 你可以使用
[Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html) 
将元素与某个特性关联在一起:

```java
// Java
public void associate() {
    var numbers = List.of("one", "two", "three", "four");
    var wordAndLength = numbers.stream()
        .collect(toMap(number -> number, String::length));
    System.out.println(wordAndLength);
}
```

在 Kotlin 中, 使用 [`associate()`](../collection-transformations.html#associate) 函数:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```

</div>

## 下一步做什么?

* 访问 [Kotlin Koans](../koans.html) – 完成练习, 学习 Kotlin 语法. 每个练习从一个失败的 unit test 开始, 你的任务是让测试通过.
* 阅读其他的 [Kotlin 惯用法](../idioms.html).
* 学习如何使用 [Java 到 Kotlin 转换器](mixing-java-kotlin-intellij.html#converting-an-existing-java-file-to-kotlin-with-j2k),
  将既有的 Java 代码转换为 Kotlin .
* 学习 [Kotlin 中的集合](../collections-overview.html).

如果你有喜欢的惯用法, 欢迎你发送一个 pull request, 分享给我们.
