---
type: doc
layout: reference
title: "Kotlin 1.2 的新增特性"
---

# Kotlin 1.2 的新增特性

## 目录

* [跨平台项目(Multiplatform project)](#multiplatform-projects-experimental)
* [语言层的其他特性](#other-language-features)
* [标准库](#standard-library)
* [JVM 环境(JVM Backend)](#jvm-backend)
* [JavaScript 环境(JavaScript Backend)](#javascript-backend)

## 跨平台项目(Multiplatform Project) (实验性功能)

跨平台项目(Multiplatform Project)是 Kotlin 1.2 的一个 **实验性的** 新功能, 它允许你在 Kotlin 支持的多种编译目标平台之间共用代码 – JVM, JavaScript 以及 (将来的) 原生代码.
一个跨平台项目, 由以下 3 种模块构成:

* *common* 模块, 其中包含不依赖于任何平台的代码, 也可以包含与平台相关的 API 声明, 但不包括其实现.
* *platform* 模块, 其中包含 *common* 模块中声明的依赖于平台的 API 在具体平台上的实现代码, 以及其他依赖于平台的代码.
* 通常的模块, 这种模块针对特定的平台, 它可以被 *platform* 模块依赖, 也可以依赖于 *platform* 模块.

当针对某个特定的平台编译跨平台项目时, 共通部分的代码, 以及针对特定平台的代码, 都会被编译生成.

跨平台项目的一个关键性功能就是, 能够通过 **预期声明与实际声明(expected and actual declarations)** 来表达共通代码对依赖于平台的代码的依赖关系.
预期声明(expected declaration) 负责定义一个 API (类, 接口, 注解, 顶级声明, 等等等等.).
实际声明(actual declaration) 可以是这个 API 的依赖于平台的实现, 也可以是类型别名, 引用这个 API 在外部库中的实现.
示例如下:

在 common 代码中:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 与平台相关的 API 的预期声明:
expect fun hello(world: String): String

fun greet() {
    // 通过预期声明定义的 API 可以这样使用:
    val greeting = hello("multi-platform world")
    println(greeting)
}

expect class URL(spec: String) {
    open fun getHost(): String
    open fun getPath(): String
}
```

</div>

在 JVM 平台的代码中:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
actual fun hello(world: String): String =
    "Hello, $world, on the JVM platform!"

// 使用特定平台中已存在的实现:
actual typealias URL = java.net.URL
```

</div>

关于创建跨平台项目的详细步骤, 请参见 [相关文档](multiplatform.html).

## 语言层的其他特性

### 在注解中使用数组字面值

从 Kotlin 1.2 开始, 注解中的数组类型参数, 可以通过新的字面值语法来指定, 而不必使用 `arrayOf` 函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@CacheConfig(cacheNames = ["books", "default"])
public class BookRepositoryImpl {
    // ...
}
```

</div>

数组的字面值语法只能用于注解的参数.

### 顶级的属性和局部变量的延迟初始化(Lateinit)

`lateinit` 修饰符现在可以用于顶级属性和局部变量.
比如, 当某个对象的构造器参数是一个 lambda 表达式, 而这个 lambda 表达式又引用到了另一个之后才能定义的对象, 这时就可以使用延迟初始化的局部变量:

<div class="sample" markdown="1" data-min-compiler-version="1.2" theme="idea">

```kotlin
class Node<T>(val value: T, val next: () -> Node<T>)

fun main(args: Array<String>) {
    // 3 个节点组成的环:
    lateinit var third: Node<Int>

    val second = Node(2, next = { third })
    val first = Node(1, next = { second })

    third = Node(3, next = { first })

    val nodes = generateSequence(first) { it.next() }
    println("Values in the cycle: ${nodes.take(7).joinToString { it.value.toString() }}, ...")
}
```

</div>

### 检查一个延迟初始化的变量是否已被初始化

现在你可以在属性引用上使用 `isInitialized`, 检查一个延迟初始化的变量是否已被初始化, :

<div class="sample" markdown="1" data-min-compiler-version="1.2" theme="idea">

```kotlin
class Foo {
    lateinit var lateinitVar: String

    fun initializationLogic() {
//sampleStart
        println("isInitialized before assignment: " + this::lateinitVar.isInitialized)
        lateinitVar = "value"
        println("isInitialized after assignment: " + this::lateinitVar.isInitialized)
//sampleEnd
    }
}

fun main(args: Array<String>) {
	Foo().initializationLogic()
}
```

</div>

### 内联函数(Inline function) 的函数性参数的默认值

内联函数的函数性参数, 现在允许使用默认值:

<div class="sample" markdown="1" data-min-compiler-version="1.2" theme="idea" auto-indent="false">

```kotlin
//sampleStart
inline fun <E> Iterable<E>.strings(transform: (E) -> String = { it.toString() }) =
    map { transform(it) }

val defaultStrings = listOf(1, 2, 3).strings()
val customStrings = listOf(1, 2, 3).strings { "($it)" }
//sampleEnd

fun main(args: Array<String>) {
    println("defaultStrings = $defaultStrings")
    println("customStrings = $customStrings")
}
```

</div>

### 显式类型转换的相关信息可被用于类型推断

Kotlin 编译器现在可以将类型转换的相关信息用于类型推断.
如果你调用了一个泛型方法, 返回值为类型参数 `T`, 然后将其转换为确切的类型 `Foo`, 编译器能够正确地判定, 这个方法调用的类型参数 `T` 应该绑定为 `Foo` 类型.

这个功能对于 Android 开发者尤其重要, 因为编译器能够正确地分析 Android API level 26 的泛型方法 `findViewById` 调用:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val button = findViewById(R.id.button) as Button
```

</div>

### 智能类型转换的功能改进

如果将一个安全的方法调用(safe call)表达式赋值给一个变量, 然后对这个变量进行 null 值检查,
这时安全方法调用的接受者对象也会被智能类型转换:

<div class="sample" markdown="1" data-min-compiler-version="1.2" theme="idea" auto-indent="false" indent="2">

```kotlin
fun countFirst(s: Any): Int {
//sampleStart
    val firstChar = (s as? CharSequence)?.firstOrNull()
    if (firstChar != null)
      return s.count { it == firstChar } // s: Any 类型被智能转换为 CharSequence 类型

    val firstItem = (s as? Iterable<*>)?.firstOrNull()
    if (firstItem != null)
      return s.count { it == firstItem } // s: Any 类型被智能转换为 Iterable<*> 类型
//sampleEnd
    return -1
}

fun main(args: Array<String>) {
  val string = "abacaba"
  val countInString = countFirst(string)
  println("called on \"$string\": $countInString")

  val list = listOf(1, 2, 3, 1, 2)
  val countInList = countFirst(list)
  println("called on $list: $countInList")
}
```

</div>

此外, 如果局部变量值的修改只发生在一个 lambda 表达式之前, 那么在这个 lambda 表达式之内, 这个局部变量也可以被智能类型转换:

<div class="sample" markdown="1" data-min-compiler-version="1.2" theme="idea">

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val flag = args.size == 0
    var x: String? = null
    if (flag) x = "Yahoo!"

    run {
        if (x != null) {
            println(x.length) // x 被智能转换为 String 类型
        }
    }
//sampleEnd
}
```

</div>

### 允许将 this::foo 简写为 ::foo

绑定到 `this` 的成员上的可调用的引用, 可以不用明确地指定接受者, 也就是说, `this::foo` 可以简写为 `::foo`.
在 lambda 表达式中, 如果你引用外层接受者的成员, 这种简化语法也使得可调用的引用更加便于使用.

### 破坏性变更: 对 try 代码段之后的智能类型转换进行警告

在以前的版本, Kotlin 使用 `try` 代码段之内的赋值语句来控制 `try` 代码段之后的智能类型转换, 这样的规则可能会破坏类型安全性和 null 值安全性, 并导致运行期的错误.
Kotlin 1.2 修正了这个问题, 对智能类型转换的限制变得更加严格, 但会导致依赖这种智能类型转换的代码无法运行.

如果想要继续使用旧版本的智能类型转换, 请对编译器指定 `-Xlegacy-smart-cast-after-try` 参数. 这个参数将在 Kotlin 1.3 版本中废弃.

### 已废弃的功能: 覆盖 copy 函数的数据类

当数据类的超类中已经存在相同签名的 `copy` 函数, 数据类中自动生成的 `copy` 函数实现将会使用超类中的默认实现, 这就会导致数据类的行为不符合我们通常的直觉,
而且, 如果超类中没有默认参数, 还会在运行期发生错误.

这种导致 `copy` 函数冲突的类继承关系, 在 Kotlin 1.2 中已被废弃, 会产生编译警告, 在 Kotlin 1.3 中将会变为编译错误.

### 已废弃的功能: 在枚举值内的嵌套类型

在枚举值内, 定义一个不是 `内部类(inner class)` 的嵌套类型, 这个功能已被废弃了. 因为会导致初始化逻辑中的错误.
在 Kotlin 1.2 中会产生编译警告, 在 Kotlin 1.3 中将会变为编译错误.

### 已废弃的功能: 以命名参数的方式对 vararg 参数传递单个值

我们已经支持了注解中的数组参数字面值, 为了保持统一, 以命名参数的方式对 vararg 参数传递单个值 (`foo(items = i)`) 的功能已被废弃了.
请使用展开(spread)操作符和创建数组的工厂函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
foo(items = *intArrayOf(1))
```

</div>

此时编译器会优化代码, 删除多余的数组创建过程, 因此不会发生性能损失.
单个值形式的参数传递方式, 在 Kotlin 1.2 中会产生编译警告, 在 Kotlin 1.3 中将会不再支持.

### 已废弃的功能: 泛型类的内部类继承 Throwable

泛型类的内部类如果继承自 `Throwable`, 在 throw-catch 语句中可能会破坏类型安全性, 因此这个功能已被废弃,
在 Kotlin 1.2 中会产生编译警告, 在 Kotlin 1.3 中将会变为编译错误.

### 已废弃的功能: 改变只读属性的后端域变量的值

在自定义的取值方法中使用 `field = ...` 赋值语句, 改变只读属性的后端域变量的值, 这个功能已被废弃,
在 Kotlin 1.2 中会产生编译警告, 在 Kotlin 1.3 中将会变为编译错误.

## 标准库

### Kotlin 标准库的 artifact 变更, 以及包分割问题

Kotlin 标准库现在开始完全兼容 Java 9 的模块系统(module system), Java 9 的模块系统禁止分割包(多个 jar 文件将类声明在同一个包之下).
为了支持这个功能, 引入了新的 artifact `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8`, 代替旧的 `kotlin-stdlib-jre7` 和 `kotlin-stdlib-jre8`.

新 artifact 中的声明, 从 Kotlin 的角度看位于相同的包之下, 但对于 Java 则在不同的包之下.
因此, 切换到新的 artifact 不需要对你的源代码做任何修改.

为兼容 Java 9 的模块系统还做了另一个变更, 就是删除了 `kotlin-reflect` 库中 `kotlin.reflect` 包下的废弃的声明.
如果你在使用这些声明, 你需要改为使用 `kotlin.reflect.full` 包下的声明, 这个包从 Kotlin 1.1 开始支持.

### windowed, chunked, zipWithNext

对 `Iterable<T>`, `Sequence<T>`, 和 `CharSequence` 增加了新的扩展函数,
用来应对以下几种使用场景: 缓冲(buffering)或批处理(batch processing) (`chunked`),
滑动窗口(sliding window)和滑动平均值(sliding average)的计算 (`windowed`),
以及对子序列项目对的处理(`zipWithNext`):

<div class="sample" markdown="1" data-min-compiler-version="1.2" theme="idea">

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val items = (1..9).map { it * it }

    val chunkedIntoLists = items.chunked(4)
    val points3d = items.chunked(3) { (x, y, z) -> Triple(x, y, z) }
    val windowed = items.windowed(4)
    val slidingAverage = items.windowed(4) { it.average() }
    val pairwiseDifferences = items.zipWithNext { a, b -> b - a }
//sampleEnd

    println("items: $items\n")

    println("chunked into lists: $chunkedIntoLists")
    println("3D points: $points3d")
    println("windowed by 4: $windowed")
    println("sliding average by 4: $slidingAverage")
    println("pairwise differences: $pairwiseDifferences")
}
```

</div>

### fill, replaceAll, shuffle/shuffled

新增了一组扩展函数, 用于处理列表: 对 `MutableList` 增加了 `fill`, `replaceAll` 和 `shuffle`,
对只读的 `List` 增加了 `shuffled`:

<div class="sample" markdown="1" data-min-compiler-version="1.2" theme="idea">

```kotlin
fun main(args: Array<String>) {
//sampleStart
    val items = (1..5).toMutableList()

    items.shuffle()
    println("Shuffled items: $items")

    items.replaceAll { it * 2 }
    println("Items doubled: $items")

    items.fill(5)
    println("Items filled with 5: $items")
//sampleEnd
}
```

</div>

### kotlin-stdlib 中的数学运算

为了满足开发者长期以来的需求, Kotlin 1.2 增加了 `kotlin.math` API 用于数学运算, 这组 API 对于 JVM 环境和 JS 环境是共通的, 包含以下内容:

* 常数: `PI` 和 `E`;
* 三角函数: `cos`, `sin`, `tan` 以及它们的反函数: `acos`, `asin`, `atan`, `atan2`;
* 双曲函数: `cosh`, `sinh`, `tanh` 以及它们的反函数: `acosh`, `asinh`, `atanh`
* 指数函数: `pow` (这是一个扩展函数), `sqrt`, `hypot`, `exp`, `expm1`;
* 对数函数: `log`, `log2`, `log10`, `ln`, `ln1p`;
* 舍入处理(Rounding):
    * `ceil`, `floor`, `truncate`, `round` (向最接近数字方向舍入模式(half to even)) 函数;
    * `roundToInt`, `roundToLong` (half to integer 模式) 扩展函数;
* 符号与绝对值:
    * `abs` 和 `sign` 函数;
    * `absoluteValue` 和 `sign` 扩展属性;
    * `withSign` 扩展函数;
* 对两个数值的 `max` 和 `min` 操作;
* 二进制表达:
    * `ulp` 扩展属性;
    * `nextUp`, `nextDown`, `nextTowards` 扩展函数;
    * `toBits`, `toRawBits`, `Double.fromBits` (这些函数在 `kotlin` 包之下).

对于 `Float` 类型参数, 也提供了完全相同的一组函数(但没有常数).

### BigInteger 和 BigDecimal 类型的操作符和转换

Kotlin 1.2 增加了一组函数, 用于 `BigInteger` 和 `BigDecimal` 类型的操作, 以及通过其它数值类型来创建这两种类型.
这些函数是:

* `Int` 和 `Long` 类型的 `toBigInteger` 函数;
* `Int`, `Long`, `Float`, `Double`, 和 `BigInteger` 类型的 `toBigDecimal`;
* 算数运算函数和位运算函数:
    * 二元运算符 `+`, `-`, `*`, `/`, `%`, 以及中缀函数(infix function) `and`, `or`, `xor`, `shl`, `shr`;
    * 一元运算符 `-`, `++`, `--`, 以及 `inv` 函数.

### 浮点数到位(bit)的转换

增加了新的函数, 用于在 `Double` 和 `Float` 类型与它们的位表达(bit representation)之间进行相互转换:

* `toBits` 和 `toRawBits` 函数, 对 `Double` 返回 `Long` 类型, 对 `Float` 返回 `Int` 类型;
* `Double.fromBits` 和 `Float.fromBits` 函数使用位表达来创建浮点数值.

### 正规表达式(Regex)变成了可序列化的对象(serializable)

`kotlin.text.Regex` 类现在成为了 `Serializable`, 因此可以在对象序列化层级(serializable hierarchy)中使用正规表达式.

### 如果可能的话, Closeable.use 会调用 Throwable.addSuppressed

如果在某个异常发生之后, 在关闭资源时再次发生了异常, `Closeable.use` 函数会调用 `Throwable.addSuppressed`.

为了使这个功能有效, 你需要在依赖库中包含 `kotlin-stdlib-jdk7`.

## JVM 环境(JVM Backend)

### 构造函数调用的正规化

从 1.0 版开始, Kotlin 就支持包含复杂控制流的表达式, 比如 try-catch 表达式, 以及内联函数调用.
按照 Java 虚拟机的规格定义, 这类代码是合法的.
不幸的是, 当调用构造函数时, 如果在参数中包含这类表达式, 某些字节码处理工具对这类代码的处理不够好.

对于这类字节码处理工具的使用者, 为了减轻这个问题, 我们新增了一个命令行选项(`-Xnormalize-constructor-calls=MODE`),
用来告诉编译器, 使编译器对这类构造函数调用代码生成更加类似 Java 风格的字节码.
这里的 `MODE` 可以是以下几种选项之一:

* `disable` (默认值) – 使用与 Kotlin 1.0 和 1.1 相同的方式生成字节码;
* `enable` – 对构造函数调用代码, 生成 Java 风格的字节码. 这个选项可以改变类加载和初始化的顺序;
* `preserve-class-initialization` – 对构造函数调用代码, 生成 Java 风格的字节码, 保证类的初始化顺序是正确的.
这个选项可能会影响你的应用程序的整体性能;
如果你在多个类之间共享了复杂的状态信息, 并且在类的初始化过程中更新这些状态信息, 只有在这种情况下, 你才需要使用这个编译选项.

另一种“手工”的变通办法是, 把带有控制流的子表达式的值保存到变量中, 然后使用这些变量, 而不是在构造函数调用的参数中直接计算这些表达式.
这种做法的效果类似于 `-Xnormalize-constructor-calls=enable` 选项.

### Java 默认方法(default method)调用

在 Kotlin 1.2 之前, 当编译目标为 JVM 1.6 时, 如果接口的成员函数覆盖 Java 默认方法(default method),
那么在调用超类方法时, 会产生一个警告: `Super calls to Java default methods are deprecated in JVM target 1.6. Recompile with '-jvm-target 1.8'`.
在 Kotlin 1.2 中, 这个警告变成了 **错误**, 因此这类代码必须在 JVM 1.8 上编译.

### 破坏性变更: 对于平台数据类型的 x.equals(null) 行为一致性

对一个平台数据类型(platform type), 如果它映射为 Java 基本类型(`Int!`, `Boolean!`, `Short`!, `Long!`, `Float!`, `Double!`, `Char!`),
对它调用 `x.equals(null)` 时, 如果 `x` 为 null, 会返回一个不正确的结果 `true`.

从 Kotlin 1.2 开始, 对一个值为 null 的平台数据类型调用 `x.equals(...)` 会 **抛出 NPE 异常**
(但 `x == ...` 不会抛出异常).

如果想要回到 1.2 版以前的结果, 可以对编译器指定参数 `-Xno-exception-on-explicit-equals-for-boxed-null`.

### 破坏性变更: fix for platform null escaping through an inlined extension receiver

对一个值为 null 的平台数据类型, 调用一个内联的扩展函数, 假如内联函数没有检查接受者是否为 null, 这时可能会导致 null 值被变换为其他代码.
Kotlin 1.2 在调用端强制执行 null 值检查, 如果接受者为 null, 会抛出异常.

如果想要回到 1.2 版以前的结果, 可以对编译器指定一个回退参数 `-Xno-receiver-assertions`.

## JavaScript 环境(JavaScript Backend)

### 默认支持 TypedArray

对 Java Script 有类型数组的支持, 可以将 Kotlin 基本类型数组, 比如 `IntArray`, `DoubleArray`, 翻译为 [JavaScript 有类型数组](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays),
这个功能以前需要通过选项打开, 现在已经默认开启了.

## 工具

### 把警告作为错误来处理

编译器现在提供了一个选项, 可以将所有的警告当作错误来处理.
方法是, 在命令行使用 `-Werror` 参数, 或者在 Gradle 编译脚本中添加以下代码:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
compileKotlin {
    kotlinOptions.allWarningsAsErrors = true
}
```

</div>
