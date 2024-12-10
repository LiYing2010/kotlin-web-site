[//]: # (title: 针对库开发者的向后兼容性(Backward Compatibility) 指南)

创建一个库的最常见的动机, 是向一个更广大的社区公开一些功能.
这个社区可能是一个小组, 一家公司, 一个特定的行业, 或者一个技术平台.
对每一种情况, 向后兼容性(Backward Compatibility) 都是需要考虑的重要因素.
社区越大, 向后兼容性就越重要, 因为你会更少了解你的使用者是谁, 以及他们在什么样的约束条件下工作.

向后兼容性不是一个单一的词汇, 而是通过二进制层面, 源代码层面, 以及行为层面进行定义.
本章会详细讨论这些类型的向后兼容性.

注意:

* 在不破坏源代码兼容性的情况下, 也有可能破坏二进制兼容性, 反过来也是如此.
* 保证源代码兼容性是最好的, 但很困难.
  作为库的开发者, 你必须考虑到库的使用者调用函数或实例化类型的所有的可能方式.
  源代码兼容性通常是一种理想, 而不是一种保证.

本章其余的部分描述你能够采用那些手段, 使用哪些工具, 来帮助确保各种类型的兼容性.

## 兼容性类型 {id="compatibility-types" initial-collapse-state="collapsed" collapsible="true"}

**二进制兼容性** 是指, 库的新版本能够替换这个库以前编译的版本.
使用这个库的以前版本编译的任何软件, 都应该能够继续正确工作.

> 关于二进制兼容性, 详情请参见 [二进制兼容性验证器的 README](https://github.com/Kotlin/binary-compatibility-validator?tab=readme-ov-file#what-makes-an-incompatible-change-to-the-public-binary-api),
> 或 [基于 Java 的 API 的演进方式](https://github.com/eclipse-platform/eclipse.platform/blob/master/docs/Evolving-Java-based-APIs-2.md) 文档.
>
{style="tip"}

**源代码兼容性** 是指, 库的新版本能够替换之前的版本, 而不需要修改使用这个库的任何源代码.
但是, 编译这些客户端代码产生的输出, 可能不再兼容于库编译的输出,
因此客户端代码必须使用库的新版本重新构建, 以保证兼容性.

**行为兼容性** 是指, 库的新版本不会修改原有的功能, Bug 修正除外.
功能特性是相同的, 语义也是相同的.

## 使用二进制兼容性验证器 {id="use-the-binary-compatibility-validator"}

JetBrains 提供了一个 [二进制兼容性验证器](https://github.com/Kotlin/binary-compatibility-validator) 工具,
它可以用来确保你的 API 的不同版本之间的二进制兼容性.

这个工具是一个 Gradle plugin, 它会向你的构建添加 2 个 task:

* `apiDump` task 创建一个适合人类阅读的 `.api` 文件, 描述你的 API.
* `apiCheck` task 对之前保存的 API 描述, 与当前构建中编译产生的类进行比较.

在构建期间, `apiCheck` task 会被标准的 Gradle `check` task 调用.
如果兼容性被破坏, 构建会失败.
这个时候, 你应该手动运行 `apiDump` task, 并比较旧版本与新版本的不同之处.
如果你认为变更是正确的, 你可以更新保存在你的 VCS 中的, 原有的 `.api` 文件.

这个验证器 [实验性的支持验证跨平台库产生的 KLib](https://github.com/Kotlin/binary-compatibility-validator?tab=readme-ov-file#experimental-klib-abi-validation-support).

## 明确指定返回类型 {id="specify-return-types-explicitly"}

在 [Kotlin 编码规约](coding-conventions.md#coding-conventions-for-libraries) 中讨论过,
你应该总是明确的指定 API 中函数的返回类型和属性类型.
也请参见 [明确 API 模式](api-guidelines-simplicity.md#use-explicit-api-mode) 章节.

我们来看看下面的示例, 库的开发者创建了一个 `JsonDeserializer`, 而且为了方便, 使用一个扩展函数将它与 `Int` 类型关联起来:

```kotlin
class JsonDeserializer<T>(private val fromJson: (String) -> T) {
    fun deserialize(input: String): T {
        ...
    }
}

fun Int.defaultDeserializer() = JsonDeserializer { ... }
```

假定库的开发者将这个实现替换为 `JsonOrXmlDeserializer`:

```kotlin
class JsonOrXmlDeserializer<T>(
    private val fromJson: (String) -> T,
    private val fromXML: (String) -> T
) {
    fun deserialize(input: String): T {
        ...
    }
}

fun Int.defaultDeserializer() = JsonOrXmlDeserializer({ ... }, { ... })
```

原有的功能可以继续工作, 并增加了序列化到 XML 的能力.
但是, 这样的变更破坏了二进制兼容性.

## 不要向既有的 API 函数添加参数 {id="avoid-adding-arguments-to-existing-api-functions"}

向 public API 添加非默认的参数会同时破坏二进制兼容性和源代码兼容性, 因为使用者需要对一个函数调用提供比以前更多的信息.
但是, 即使是添加 [默认参数](functions.md#default-arguments) 也可能破坏兼容性.

例如, 假设你在 `lib.kt` 中有下面的函数:

```kotlin
fun fib() = ... // 返回 0
```

在 `client.kt` 中有下面的函数:

```kotlin
fun main() {
    println(fib()) // 输出结果为 0
}
```
在 JVM 上编译这 2 个文件会输出 `LibKt.class` 和 `ClientKt.class`.

假设你重新实现并编译了 `fib` 函数, 实现了 Fibonacci 数列, 例如 `fib(3)` 返回 2, `fib(4)` 返回 3, 等等.
你添加了一个参数, 但为它指定了默认值 0, 以保持原来的行为不变:

```kotlin
fun fib(input: Int = 0) = ... // 返回 Fibonacci 数列中的元素
```

现在你需要重新编译 `lib.kt` 文件. 你可能期望 `client.kt` 文件 不需要重新编译, 相应的 class 文件可以这样调用:

```shell
$ kotlin ClientKt.class
```

但如果你这样做, 会发生 `NoSuchMethodError` 错误:

```text
Exception in thread "main" java.lang.NoSuchMethodError: 'int LibKt.fib()'
       at LibKt.main(fib.kt:2)
       at LibKt.main(fib.kt)
       ...
```

这是因为在 Kotlin/JVM 编译器生成的字节码中, 方法的签名已经改变了, 破坏了二进制兼容性.

但是, 保持了源代码兼容性. 如果你重新编译两个文件, 程序就能够象以前一样运行.

### 使用重载(overload)保持兼容性 {id="use-overloads-to-preserve-compatibility" initial-collapse-state="collapsed" collapsible="true"}

在针对 JVM 编写 Kotlin 代码时, 你可以对带有默认参数的函数使用 [`@JvmOverloads`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvm-overloads/) 注解.
这样会产生这个函数的重载(overload), 对于每个带有默认值, 能够从参数列表最末尾省略的的参数, 都会生成一个对应的重载方法.
通过这些分别生成的函数, 在参数列表的末尾添加一个新参数能够保持二进制兼容性, 因为它不会改变编译输出中任何原有的函数, 只是添加一个新的函数.

例如, 上面的函数可以这样添加注解:

```kotlin
@JvmOverloads
fun fib(input: Int = 0) = ...
```

这样, 在输出的字节码中会生成 2 个方法, 一个没有参数, 另一个有一个 `Int` 参数:

```kotlin
public final static fib()I
public final static fib(I)I
```

对于所有的 Kotlin 编译目标, 你可以选择为你的函数手动创建多个重载, 而不是接受默认参数的单个函数, 以保持二进制兼容性.
在上面的示例中, 这就代表对希望接受 `Int` 参数的情况, 创建单独的 `fib` 函数:

```kotlin
fun fib() = ...
fun fib(input: Int) = ...
```

## 不要扩大或缩小返回类型的范围 {id="avoid-widening-or-narrowing-return-types"}

在 API 的演化过程中, 经常会希望扩大或缩小一个函数的返回类型的范围.
例如, 在你的 API 的下一个版本中, 你可能希望将一个返回类型从 `List` 修改为 `Collection`, 或者从 `Collection` 修改为 `List`.

你可能想要将类型缩小为 `List`, 以满足使用者的要求, 支持按索引访问.
相反, 你可能想要将类型扩大为 `Collection`, 因为你发现你处理的数据没有自然的顺序.

很容易看出, 扩大返回类型会破坏兼容性.
例如, 从 `List` 转换到 `Collection` 会破坏所有使用索引的代码.

你可能认为缩小返回 类型, 例如从 `Collection` 变为 `List`, 能够保持兼容性.
不幸的是, 能够保持源代码兼容性, 但会破坏二进制兼容性.

假设你在 `Library.kt` 文件中有一个 demo 函数:

```kotlin
public fun demo(): Number = 3
```

在 `Client.kt` 有使用这个函数的客户端代码:

```kotlin
fun main() {
    println(demo()) // 输出结果为 3
}
```

我们想象一种场景, 你修改了 demo 的返回类型, 并且只重编译 `Library.kt`:

```kotlin
fun demo(): Int = 3
```

当你重新运行客户端, (在 JVM 上)会发生下面的错误:

```text
Exception in thread "main" java.lang.NoSuchMethodError: 'java.lang.Number Library.demo()'
        at ClientKt.main(call.kt:2)
        at ClientKt.main(call.kt)
        ...
```

发生这个错误, 是由于 `main` 方法生成的字节码中的以下指令:

```text
0: invokestatic  #12 // Method Library.demo:()Ljava/lang/Number;
```

JVM 尝试调用一个名为 demo, 返回 `Number` 的静态方法.
但是, 由于这个方法不再存在, 你就破坏了二进制兼容性.

## 不要在你的 API 中使用数据类 {id="avoid-using-data-classes-in-your-api"}

在通常的开发中, 数据类的力量在于, 会为你生成额外的函数.
在 API 设计中, 这个优点会变成缺点.

例如, 假如你在你的 API 中使用下面的数据类:

```kotlin
data class User(
    val name: String,
    val email: String
)
```

之后, 你可能想要添加一个属性, 名为 `active`:

```kotlin
data class User(
    val name: String,
    val email: String,
    val active: Boolean = true
)
```

这会从两方面破坏二进制兼容性.
首先, 生成的构造器会带有不同的签名.
此外, 生成的 `copy` 方法的签名也会改变.

(在 Kotlin/JVM 上) 原来的签名是:

```text
public final User copy(java.lang.String, java.lang.String)
```

添加 `active` 属性之后, 签名变为:

```text
public final User copy(java.lang.String, java.lang.String, boolean)
```

和构造函数一样, 这也会破坏二进制兼容性.

通过手动编写次级构造器, 并覆盖 `copy` 方法, 可以绕过这些问题.
但是, 这样造成的负担就抵消了使用数据类代理的便利.

数据类的另一个问题是, 改变构造器参数的顺序会影响生成的 `componentX` 方法, 解构时会用到这些方法.
即使如果不破坏二进制兼容性, 改变顺序也一定会破坏行为兼容性.

## 使用 PublishedApi 注解时的注意事项 {id="considerations-for-using-the-publishedapi-annotation"}

Kotlin 允许内联函数成为你的库的 API 的一部分.
对这些函数的调用将被内联到你的使用者编写的客户端代码内部.
这可能带来兼容性问题, 因此这些函数不允许调用非 public API 的声明.

如果你需要在一个内联的 public 函数中调用你的库的一个 internal API, 你可以对 internal API 添加 [`@PublishedApi`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-published-api/) 注解来实现.
这样可以让 internal 声明事实上变成 public, 因为对它的引用最终会进入编译后的客户端代码中.
因此, 在对它进行修改时, 必须和 public 声明一样对待, 因为这些修改可能影响二进制兼容性.

## 务实的演进 API {id="evolve-apis-pragmatically"}

在某些情况下, 随着时间的推移, 你会需要对你的库 API 进行破坏性的变更, 删除或修改原有的声明.
这一节, 我们讨论如何务实的处理这样的情况.

当使用者升级到你的库的新版本时, 在他们的项目源代码中, 不应该出现对你的库的 API 的无法解析的引用.
不要立即从你的库的 public API 中删除某些内容, 你应该遵循一个废弃周期.
通过这种方式, 你可以给你的使用者时间, 迁移到替代方案.

应该对旧的声明使用 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/) 注解, 表示它正在被替代.
这个注解的参数提供了关于废弃的重要细节信息:

* `message` 应该解释发生了什么变更, 以及变更的理由.
* 如果有可能, 应该使用 `replaceWith` 参数, 提供到新 API 的自动迁移.
* 应该使用废弃的级别, 逐步的废弃 API. 详情请参见 [Kotlin 文档关于 Deprecated 的页面](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/).

一般来说, 废弃应该首先产生警告信息, 然后升级到错误, 之后隐藏声明.
这个过程应该在几个小的发布版本中进行, 给使用者时间, 在他们的项目中进行必要的修改.
破坏性的变更, 例如删除 API, 应该只在大的发布版本中发生.
一个库可能会采用不同的版本策略和废弃策略, 但必须与使用者沟通, 让使用者产生正确的期望.

更多详情请参见 [Kotlin 的演化原则文档](kotlin-evolution-principles.md#libraries),
以及 Leonid Startsev 在 KotlinConf 2023 上的演讲, [针对客户端不造成负担的演进你的 Kotlin API](https://www.youtube.com/watch?v=cCgXtpVPO-o&t=1468s).

## 使用 RequiresOptIn 机制 {id="use-the-requiresoptin-mechanism"}

Kotlin 标准库 [提供了 opt-in 机制](opt-in-requirements.md), 要求使用者在使用你的 API 的某个部分之前, 明确的表示同意.
这是通过创建标记注解来实现的, 这些注解本身需要标注 [`@RequiresOptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/) 注解.
你应该使用这个机制, 来管理使用者对源代码兼容性和行为兼容性的期望, 尤其是向你的库引入新的 API 的情况.

如果你选择使用这个机制, 我们推荐下面这些最佳实践:

* 使用 opt-in 机制, 对 API 的不同部分提供不同的保证. 例如, 你可以将功能标记为 _Preview_, _Experimental_, 以及 _Delicate_.
  每个类别应该在你的文档和 [KDoc 注释](kotlin-doc.md) 中清楚的解释, 并带有适当的警告信息.
* 如果你的库使用一个实验性的 API, 要将 [注解传播](opt-in-requirements.md#propagating-opt-in) 给你自己的使用者.
  这样可以保证你的使用者认识到, 你依赖于某些正在演化中的功能.
* 不要使用 opt-in 机制来废弃你的库中已经存在的声明.
  要使用 `@Deprecated`, 如 [务实的演进 API](#evolve-apis-pragmatically) 小节所述.

## 下一步做什么 {id="what-s-next"}

如果你还没有阅读过, 请阅读这些章节:

* 阅读 [减少认知复杂度 (Mental Complexity)](api-guidelines-minimizing-mental-complexity.md), 学习减少认知复杂度的各种策略.
* 关于有效的文档的实践, 请参见 [信息丰富的文档](api-guidelines-informative-documentation.md).
