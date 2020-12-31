---
type: doc
layout: reference
title: "Kotlin 1.3 的新增特性"
---

# Kotlin 1.3 的新增特性

## 协程功能正式发布

经过长期广泛的实战测试之后, 协程功能终于正式发布了! 也就是说, 从 Kotlin 1.3 开始, 协程功能的语言级支持, 以及 API 都进入 [完全稳定](evolution/components-stability.html) 状态.
请参见新的 [协程概述](coroutines-overview.html) 文档.

Kotlin 1.3 引入了挂起函数的可调用的引用, 并在反射 API 中支持协程.

## Kotlin/Native

Kotlin 1.3 继续改进对原生程序开发的. 详情请参见 [Kotlin/Native 概述](native-overview.html).

## 跨平台项目

在 1.3 中, 我们完成了对跨平台项目模式的重构工作, 改进了表达能力和灵活性, 使得共用代码变得更加容易.
而且, Kotlin/Native 现在也是我们支持的目标平台之一了!

与旧模式的主要不同在于:

  * 在旧模式中, 共通代码和平台相关代码需要放在不同的模块中, 然后使用 `expectedBy` 依赖项导入.
    现在, 共通代码和平台相关代码放在同一模块的不同源代码路径中, 项目配置变得更加容易.
  * 对于支持的各种目标平台, 现在有了大量的 [预定义平台配置](mpp-supported-platforms.html).
  * 依赖项配置有了变化; 现在以各个源代码路径为单位分别指定依赖项.
  * 源代码集现在可以在任意一部分平台之间共用(比如, 在编译目标平台为 JS, Android 和 iOS 的模块中,
    你可以让某个源代码集只在 Android 和 iOS 平台中共用).
  * 现在支持 [发布跨平台的库](mpp-publish-lib.html).

更多详细信息, 请参见 [跨平台程序开发文档](multiplatform.html).

## 契约(Contract)

Kotlin 编译器会进行大量的静态分析, 产生警告信息, 并减少样板代码.
其中最值得注意的功能之一就是智能类型转换 — 根据已有的类型检查代码, 可以自动进行类型转换:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // 编译器自动将 's' 转换为 'String' 类型
}
```

</div>

但是, 一旦将这些类型检查抽取到一个独立的函数中, 这些智能类型转换就消失了:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // 这类没有智能类型转换 :(
}
```

</div>

为了改进这种情况下的编译器能力, Kotlin 1.3 引入了一个实验性的机制, 名为 *契约* (contract).

*契约* 允许一个函数以编译器能够理解的方式明确地描述它的行为. 目前, 支持两打大类使用场景:

* 声明一个函数调用的入口参数与输出结果之间的关系, 来改进编译器的智能类型转换分析能力:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun require(condition: Boolean) {
    // 这是一个语法形式, 告诉编译器:
    // "如果这个函数成功地返回, 那么传入到这个函数内的 'condition' 为 true"
    contract { returns() implies condition }
    if (!condition) throw IllegalArgumentException(...)
}

fun foo(s: String?) {
    require(s is String)
    // 这里 's' 会被智能转换为 'String', 因为, 如果它不是 'String',
    // 'require' 应该抛出异常
}
```

</div>

* 出现高阶函数时, 改进编译器的变量初始化分析能力:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun synchronize(lock: Any?, block: () -> Unit) {
    // 这段代码告诉编译器:
    // "这个函数会立即调用 'block', 而且只调用一次"
    contract { callsInPlace(block, EXACTLY_ONCE) }
}

fun foo() {
    val x: Int
    synchronize(lock) {
        x = 42 // 编译器知道传递给 'synchronize' 的 lambda 表达式会被刚好调用一次
               // 因此不会报告 'x' 被多次赋值的错误
    }
    println(x) // 编译器知道 lambda 表达式一定会被调用一次, 并执行对 'x' 的初始化
               // 因此在这里会认为 'x' 已被初始化
}
```

</div>

### 标准库中的契约

`stdlib` 已经使用了契约, 用来改进上文介绍的编译器分析能力.
这部分契约是 **稳定** 的, 也就是说你不必添加额外的编译选项, 也能得到编译器分析能力的提高:

<div class="sample" data-min-compiler-version="1.3" markdown="1" theme="idea">

```kotlin
//sampleStart
fun bar(x: String?) {
    if (!x.isNullOrEmpty()) {
        println("length of '$x' is ${x.length}") // 哇~~~, 可以智能转换为非空类型!
    }
}
//sampleEnd
fun main() {
    bar(null)
    bar("42")
}
```

</div>

### 自定义的契约

也可以为你自己的函数声明契约, 但这个功能还是 **实验性** 的, 因为契约目前的语法还处于早期原型阶段, 将来很可能会改变.
而且请注意, 目前 Kotlin 编译器不会去验证契约的内容, 因此程序员需要自己负责编写正确而且完整的契约.

通过调用标注库的 `contract` 函数, 就可以声明自定义的契约, 这个函数会产生一个 DSL 作用域:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun String?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }
    return this == null || isEmpty()
}
```

</div>

关于契约的语法, 以及兼容性问题, 详情请参见 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/kotlin-contracts.md).

## 将 `when` 语句的判定对象保存到变量中

在 Kotlin 1.3 中, 可以将 `when` 语句的判定对象保存到变量中:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success -> response.body
            is HttpError -> throw HttpException(response.status)
        }
```

</div>

虽然我们可以在 `when` 语句之前抽取这个变量, 但 `when` 语句中的 `val` 变量的作用范围会被限定在 `when` 的语句体之内, 因此可以防止它扩散到更广的范围.
关于 `when` 语句的完整文档, 请参见 [这里](control-flow.html#when-expression).

## 对接口的同伴对象使用 @JvmStatic 和 @JvmField 注解

在 Kotlin 1.3 中, 可以对接口的 `companion` 对象的成员标记 `@JvmStatic` 和 `@JvmField` 注解.
在编译产生的类文件中, 这些成员会被提升到对应的接口内, 并变为 `static` 成员.

比如, 以下 Kotlin 代码:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
interface Foo {
    companion object {
        @JvmField
        val answer: Int = 42

        @JvmStatic
        fun sayHello() {
            println("Hello, world!")
        }
    }
}
```

</div>

等价于以下 Java 代码:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```java
interface Foo {
    public static int answer = 42;
    public static void sayHello() {
        // ...
    }
}
```

</div>

## 注解类中的嵌套声明

在 Kotlin 1.3 中, 注解可以拥有嵌套的类, 接口, 对象, 以及同伴对象:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
annotation class Foo {
    enum class Direction { UP, DOWN, LEFT, RIGHT }

    annotation class Bar

    companion object {
        fun foo(): Int = 42
        val bar: Int = 42
    }
}
```

</div>

## 无参数的 `main` 函数

按照习惯, Kotlin 程序的入口是一个签名类似 `main(args: Array<String>)` 的函数, 其中 `args` 表示传递给这个程序的命令行参数.
但是, 并不是每个程序都支持命令行参数, 因此这个参数在程序中经常没有被使用.

Kotlin 1.3 引入了一个更简单的 `main` 函数形式, 它可以没有任何参数.
“Hello, World” 程序在 Kotlin 代码中可以减少 19 个字符了!

<div class="sample" data-min-compiler-version="1.3" markdown="1" theme="idea">

```kotlin
fun main() {
    println("Hello, world!")
}
```

</div>

## 带巨量参数的函数

在 Kotlin 中, 函数类型被表达为一个泛型, 接受不同数量的参数: `Function0<R>`, `Function1<P0, R>`, `Function2<P0, P1, R>`, ...
这种方案存在的一个问题就是, 参数个数是有限的, 目前只支持到 `Function22`.

Kotlin 1.3 放宽了这个限制, 支持更多参数的函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun trueEnterpriseComesToKotlin(block: (Any, Any, ... /* 另外还有 42 个 */, Any) -> Any) {
    block(Any(), Any(), ..., Any())
}
```

</div>

## 渐进模式

Kotlin 非常关注稳定性, 以及源代码的向后兼容: Kotlin 的兼容性政策是: "破坏性变更" (也就是, 某些变更会造成过去能够成功编译的代码无法编译) 只能出现在主版本中 (1.2, 1.3, 等等.).

我们相信, 很多用户会使用更快速的升级, 对于严重的编译器 bug 可以立即得到修正, 使得代码更加安全, 更加正确.
因此, Kotlin 1.3 引入了 *渐进式* 编译模式, 可以向编译器添加 `-progressive` 参数来启用这个模式.

在渐进模式下, 会立即启用某些语法层面的修正. 这些修正包含两个重要的特性:

* 这些修正保证源代码在旧版本编译器上的向后兼容性, 也就是说, 凡是渐进模式下能够编译的代码, 在非渐进模式下也能正确编译.
* 这些修正只会让代码 *更正确* — 比如, 有些不适当的智能类型转换会被禁止, 编译产生的代码的行为可能会被修改, 变得更可预测, 更加稳定, 等等.

启用渐进模式可能会要求你重写某些代码, 但不会太多 — 渐进模式下启用的修正都经过仔细挑选, 检查, 并且提供了代码迁移的辅助工具.
对于那些活跃开发中, 快速更新语言版本的代码库, 我们期望渐进模式能够成为一个好的选择.

## 内联类

> 内联类从 Kotlin 1.3 开始可用, 目前还处于 [Alpha 阶段](evolution/components-stability.html).
  详情请参见 [参考文档](inline-classes.html#alpha-status-of-inline-classes).
{:.note}

Kotlin 1.3 引入了一种新的类型声明 — `inline class`. 内联类可以看作一种功能受到限制的类, 具体来说, 内联类只能有一个属性, 不能更多, 也不能更少:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
inline class Name(val s: String)
```

</div>

Kotlin 编译器会使用这个限制, 尽力优化内联类的运行期表达, 用内联类底层属性的值来代替内联类的实例, 因此可以去除构造器调用, 减少 GC 压力, 而且可以进行进一步的代码优化:

<div class="sample" data-min-compiler-version="1.3" markdown="1" theme="idea">

```kotlin
inline class Name(val s: String)
//sampleStart
fun main() {
    // 下一行代码不会发生构造器调用, 而且在运行期 'name' 中只会包含字符串 "Kotlin"
    val name = Name("Kotlin")
    println(name.s)
}
//sampleEnd
```

</div>

关于内联类的详情, 请参见 [参考文档](inline-classes.html).

## 无符号整数

> 无符号整数从 Kotlin 1.3 开始可用, 目前还处于 [Beta 阶段](evolution/components-stability.html).
  详情请参见 [参考文档](basic-types.html#beta-status-of-unsigned-integers).
{:.note}

Kotlin 1.3 引入了无符号整数类型:

* `kotlin.UByte`: 无符号的 8 位整数, 值范围是 0 到 255
* `kotlin.UShort`: 无符号的 16 位整数, 值范围是 0 到 65535
* `kotlin.UInt`: 无符号的 32 位整数, 值范围是 0 到 2^32 - 1
* `kotlin.ULong`: 无符号的 64 位整数, 值范围是 0 到 2^64 - 1

有符号整数所支持的大多数功能, 对无符号整数也适用:

<div class="sample" data-min-compiler-version="1.3" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
// 可以使用字面值后缀来定义无符号整数
val uint = 42u
val ulong = 42uL
val ubyte: UByte = 255u

// 使用标准库中的扩展函数, 可以将有符号类型转换为无符号类型, 或者反过来:
val int = uint.toInt()
val byte = ubyte.toByte()
val ulong2 = byte.toULong()

// 无符号整数支持类似的运算符:
val x = 20u + 22u
val y = 1u shl 8
val z = "128".toUByte()
val range = 1u..5u
//sampleEnd
println("ubyte: $ubyte, byte: $byte, ulong2: $ulong2")
println("x: $x, y: $y, z: $z, range: $range")
}
```

</div>

详情请参见 [参考文档](basic-types.html#unsigned-integers) for details.

## @JvmDefault 注解

> `@JvmDefault` 从 Kotlin 1.3 开始可用, 目前还处于 *实验性* 阶段. 详情请参见 [参考文档](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html).
{:.note}


Kotlin 支持许多 Java 版本, 包括 Java 6 和 Java 7, 在这些版本上还不支持接口的默认方法.
为了你编程的方便, Kotlin 编译器绕过了这个限制, 但是这个解决方法无法与 Java 8 中的 `default` 方法兼容.

这可能会造成与 Java 互操作时的问题, 因此 Kotlin 1.3 引入了 `@JvmDefault` 注解.
使用了这个注解的方法, 在 JVM 平台上会被编译为 `default` 方法:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
interface Foo {
    // 会被编译为 'default' 方法
    @JvmDefault
    fun foo(): Int = 42
}
```

</div>

> 警告! 使用 `@JvmDefault` 注解来标注你的 API 会对二进制兼容性造成严重的影响. 在你的产品代码中使用 `@JvmDefault` 之前, 请一定要认真阅读 [参考文档](/api/latest/jvm/stdlib/kotlin.jvm/-jvm-default/index.html).
{:.note}

# 标准库

## 跨平台的 `Random` 类

在 Kotlin 1.3 之前, 没有统一的方法在所有的平台上生成随机数 — 我们必须使用各种平台独自的解决方案, 比如在 JVM 上使用 `java.util.Random`.
Kotlin 1.3 版引入 `kotlin.random.Random` 类, 解决了这个问题, 这个类可以在所有的平台上使用:

<div class="sample" data-min-compiler-version="1.3" markdown="1" theme="idea">

```kotlin
import kotlin.random.Random

fun main() {
//sampleStart
    val number = Random.nextInt(42)  // 得到的随机数范围是 [0, limit)
    println(number)
//sampleEnd
}
```

</div>

## isNullOrEmpty/orEmpty 扩展函数

标准库提供了对某些数据类型的 `isNullOrEmpty` 和 `orEmpty` 扩展函数.
如果接受者是 `null`, 或内容为空, 那么 `isNullOrEmpty` 函数返回 `true`,
如果接受者是 `null`, 那么 `orEmpty` 函数返回一个不为 `null`, 但内容为空的实例.
Kotlin 1.3 对集合(Collection), Map, 以及对象数组, 都提供了类似的扩展函数.

## 在两个既有的数组之间复制元素

对既有的数组类型, 包括无符号整数数组, 提供了 `array.copyInto(targetArray, targetOffset, startIndex, endIndex)` 扩展函数,
可以使用纯 Kotlin 代码, 更简单地实现基于数组的容器.

<div class="sample" data-min-compiler-version="1.3" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val sourceArr = arrayOf("k", "o", "t", "l", "i", "n")
    val targetArr = sourceArr.copyInto(arrayOfNulls<String>(6), 3, startIndex = 3, endIndex = 6)
    println(targetArr.contentToString())

    sourceArr.copyInto(targetArr, startIndex = 0, endIndex = 3)
    println(targetArr.contentToString())
//sampleEnd
}
```

</div>

## associateWith 函数

已有一组 key 值, 希望将每一个 Key 与某个值关联起来, 创建一个 Map, 这是很常见的情况.
以前, 使用 `associate { it to getValue(it) }` 函数, 也是可以做到的,
但是现在我们引入了一个更加高效, 而且更加易用的新函数: `keys.associateWith { getValue(it) }`.

<div class="sample" data-min-compiler-version="1.3" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val keys = 'a'..'f'
    val map = keys.associateWith { it.toString().repeat(5).capitalize() }
    map.forEach { println(it) }
//sampleEnd
}
```

</div>

## ifEmpty 和 ifBlank 函数

对于集合(Collection), Map, 对象数组, 字符序列, 以及值序列(equence), 现在有了 `ifEmpty` 函数,
对于接受者对象内容为空的情况, 可以指定一个替代值:

<div class="sample" data-min-compiler-version="1.3" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    fun printAllUppercase(data: List<String>) {
        val result = data
        .filter { it.all { c -> c.isUpperCase() } }
            .ifEmpty { listOf("<no uppercase>") }
        result.forEach { println(it) }
    }

    printAllUppercase(listOf("foo", "Bar"))
    printAllUppercase(listOf("FOO", "BAR"))
//sampleEnd
}
```

</div>

除此之外, 字符序列和字符串还有一个 `ifBlank` 扩展函数, 它和 `ifEmpty` 函数一样, 也会使用指定的替代值, 但它检查的条件是字符串内容是否全部是空白字符.

<div class="sample" data-min-compiler-version="1.3" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    val s = "    \n"
    println(s.ifBlank { "<blank>" })
    println(s.ifBlank { null })
//sampleEnd
}
```

</div>

## 在反射中使用密封类

我们对 `kotlin-reflect` 添加了一个新的 API, 名为 `KClass.sealedSubclasses`, 可以用来得到 `sealed` 类的所有直接子类型.

## 小变更

* `Boolean` 类型现在带有同伴对象.
* `Any?.hashCode()` 扩展函数, 对 `null` 值返回 0.
* `Char` 现在带有 `MIN_VALUE`/`MAX_VALUE` 常数.
* 基本类型的同伴对象中增加了 `SIZE_BYTES` 和 `SIZE_BITS` 常数.

# 工具

## 在 IDE 中支持代码风格

Kotlin 1.3 开始在 IDE 中支持 [推荐的代码风格](coding-conventions.html).
关于代码迁移的方法, 请参见 [参考文档](code-style-migration-guide.html).

## kotlinx.serialization

[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 是一个库, 在 Kotlin 中跨平台支持对象的序列化和反序列化.
以前它曾是一个独立的项目, 但从 Kotlin 1.3 起, 它和其他编译器 plugin 一样, 随 Kotlin 编译器一起发布.
主要的区别是, 你不需要手工维护 IDE 的序列化 Plugin 与你使用的 Kotlin IDE Plugin 之间的版本兼容问题: 因为现在 Kotlin IDE Plugin 已经包含了序列化功能!

详情请参见 [参考文档](https://github.com/Kotlin/kotlinx.serialization#current-project-status).

> 注意, 虽然现在 kotlinx.serialization 与 Kotlin 编译器一起发布, 但在 Kotlin 1.3 中它仍然是一个实验性功能.
{:.note}

## 脚本 API 升级

> 注意, 脚本是一个实验性功能, 也就是说, 目前提供的 API 不保证任何兼容性.
{:.note}

Kotlin 1.3 仍在持续改进脚本 API, 引入了一些实验性的功能, 支持脚本的定制, 包括添加外部属性, 提供静态或动态的依赖项, 等等.

详情请参见, [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md).

## 支持草稿文件(Scratch File)

Kotlin 1.3 开始支持可运行的 Kotlin *草稿文件(Scratch File)*. *草稿文件* 是一个扩展名为 .kts 的 Kotlin 脚本文件, 你可以直接在编辑器中运行这个文件, 并得到执行结果.

详情请参见 [草稿文件参考文档](https://www.jetbrains.com/help/idea/scratches.html).
