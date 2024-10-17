[//]: # (title: 预期声明与实际声明)

预期声明(Expected Declaration)与实际声明(Actual Declaration), 让你能够在 Kotlin Multiplatform 模块中访问平台相关的 API.
你可以在共通代码中提供平台无关的 API.

> 本文描述预期声明与实际声明的语言机制.
> 关于使用平台相关 API 的各种方法的一般性建议, 请参见 [使用平台相关的 API](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html).
>
{style="tip"}

## 预期声明与实际声明的规则

要定义预期声明与实际声明, 请遵循这些规则:

1. 在共通源代码集中, 声明一个标准的 Kotlin 结构. 可以是一个函数, 属性, 类, 接口, 枚举, 或注解.
2. 使用 `expect` 关键字标注这个结构. 这就是你的 _预期声明(Expected Declaration)_.
   这些声明可以在共通代码中使用, 但不能包含任何实现. 相反, 应该由平台相关的代码来提供实现.
3. 在每个平台相关的源代码集中, 在相同的包中声明相同的结构, 并用 `actual` 关键字标注它.
   这就是你的 _实际声明(Actual Declaration)_, 它通常包含一个实现, 使用平台相关的库.

在对特定的编译目标进行编译时, 编译器尝试将它找到的每个 _实际_ 声明与共通代码中对应的 _预期_ 声明进行匹配.
编译器会保证以下几点:

* 共通源代码集中的每个预期声明, 在每个平台相关的源代码中都存在匹配的实际声明.
* 预期声明不包含任何实现.
* 每个实际声明与对应的预期声明使用相同的包, 例如 `org.mygroup.myapp.MyType`.

在为不同的平台生成结果代码时, Kotlin 编译器会合并相互对应的预期声明和实际声明.
它会为每个平台生成一个声明以及它的实际实现.
共通代码中对预期声明的每次使用, 在最终生成的平台代码中, 都会调用正确的实际声明.

当你使用中间源代码集, 在不同的目标平台之间共用时, 你可以声明实际声明.
例如, `iosMain` 作为中间源代码集, 在平台源代码集 `iosX64Main`, `iosArm64Main`, 和 `iosSimulatorArm64Main` 之间共用.
那么通常只有 `iosMain` 包含实际声明, 而不是那些平台源代码集.
Kotlin 编译器会使用这些实际声明 来为对应的平台产生结果代码.

IDE 可以帮助解决常见的问题, 包括:

* 缺少声明
* 预期声明包含实现
* 声明的签名不匹配
* 声明处于不同的包内

你还可以使用 IDE, 在预期声明和实际声明之间导航.
请选择侧栏图标(gutter icon)来查看实际声明, 或者使用 [快捷键](https://www.jetbrains.com/help/idea/navigating-through-the-source-code.html#go_to_implementation).

![IDE 中从预期声明到实际声明之间的导航](expect-actual-gutter.png){width=500}

## 使用预期声明与实际声明的各种方案

下面我们来探索各种不同的方案, 使用 expect/actual 机制来解决访问平台 API 的问题, 同时仍然提供一种方法, 使得可以在公共代码中使用这些 API.

考虑一个 Kotlin Multiplatform 项目, 你需要实现 `Identity` 类型, 其中包含用户的登录名和当前进程 ID.
这个项目具有 `commonMain`, `jvmMain` 和 `nativeMain` 源代码集, 让应用程序可以在 JVM 运行, 也可以在 iOS 等原生环境中运行.

### 预期函数与实际函数

你可以定义一个 `Identity` 类型, 和一个工厂函数 `buildIdentity()`, 这个函数在共通源代码集中声明, 并在平台源代码集中以不同的方式实现:

1. 在 `commonMain` 中, 声明一个简单的类型, 以及预期的工厂函数:

   ```kotlin
   package identity

   class Identity(val userName: String, val processID: Long)

   expect fun buildIdentity(): Identity
   ```

2. 在 `jvmMain` 源代码集中, 使用 Java 标准库实现:

   ```kotlin
   package identity

   import java.lang.System
   import java.lang.ProcessHandle

   actual fun buildIdentity() = Identity(
       System.getProperty("user.name") ?: "None",
       ProcessHandle.current().pid()
   )
   ```

3. 在 `nativeMain` 源代码集中, 使用原生依赖项, 通过 [POSIX](https://en.wikipedia.org/wiki/POSIX) 实现:

   ```kotlin
   package identity

   import kotlinx.cinterop.toKString
   import platform.posix.getlogin
   import platform.posix.getpid

   actual fun buildIdentity() = Identity(
       getlogin()?.toKString() ?: "None",
       getpid().toLong()
   )
   ```

  这里, 平台函数返回平台相关的 `Identity` 实例.

> 从 Kotlin 1.9.0 开始, 使用 `getlogin()` 和 `getpid()` 函数需要标注 `@OptIn` 注解.
>
{style="note"}

### 接口加上预期函数与实际函数

如果工厂函数变得太大, 可以考虑使用共通的 `Identity` 接口, 并在不同平台上以不同方式实现它.

`buildIdentity()` 工厂函数应该返回 `Identity`, 但这次它是一个实现共通接口的对象:

1. 在 `commonMain` 中, 定义 `Identity` 接口和 `buildIdentity()` 工厂函数:

   ```kotlin
   // 在 commonMain 源代码集中:
   expect fun buildIdentity(): Identity

   interface Identity {
       val userName: String
       val processID: Long
   }
   ```

2. 创建平台相关的接口实现, 这里不需要额外的使用预期声明和实际声明:

   ```kotlin
   // 在 jvmMain 源代码集中:
   actual fun buildIdentity(): Identity = JVMIdentity()

   class JVMIdentity(
       override val userName: String = System.getProperty("user.name") ?: "none",
       override val processID: Long = ProcessHandle.current().pid()
   ) : Identity
   ```

   ```kotlin
   // 在 nativeMain 源代码集中:
   actual fun buildIdentity(): Identity = NativeIdentity()

   class NativeIdentity(
       override val userName: String = getlogin()?.toKString() ?: "None",
       override val processID: Long = getpid().toLong()
   ) : Identity
   ```

这些平台函数返回平台相关的 `Identity` 实例, 这些实例通过 `JVMIdentity` 和 `NativeIdentity` 平台类型来实现.

#### 预期属性与实际属性

你可以修改上面的示例, 使用一个预期的 `val` 属性来存储 `Identity`.

将这个属性标注为 `expect val`, 然后在平台源代码集中提供实际属性:

```kotlin
// 在 commonMain 源代码集中:
expect val identity: Identity

interface Identity {
    val userName: String
    val processID: Long
}
```

```kotlin
// 在 jvmMain 源代码集中:
actual val identity: Identity = JVMIdentity()

class JVMIdentity(
    override val userName: String = System.getProperty("user.name") ?: "none",
    override val processID: Long = ProcessHandle.current().pid()
) : Identity
```

```kotlin
// 在 nativeMain 源代码集中:
actual val identity: Identity = NativeIdentity()

class NativeIdentity(
    override val userName: String = getlogin()?.toKString() ?: "None",
    override val processID: Long = getpid().toLong()
) : Identity
```

#### 预期对象与实际对象

如果 `IdentityBuilder` 预期在每个平台上都是单子(singleton),
你可以将它定义为一个预期对象, 然后让每个平台实现它的实际对象:

```kotlin
// 在 commonMain 源代码集中:
expect object IdentityBuilder {
    fun build(): Identity
}

class Identity(
    val userName: String,
    val processID: Long
)
```

```kotlin
// 在 jvmMain 源代码集中:
actual object IdentityBuilder {
    actual fun build() = Identity(
        System.getProperty("user.name") ?: "none",
        ProcessHandle.current().pid()
    )
}
```

```kotlin
// 在 nativeMain 源代码集中:
actual object IdentityBuilder {
    actual fun build() = Identity(
        getlogin()?.toKString() ?: "None",
        getpid().toLong()
    )
}
```

#### 关于依赖注入的建议

为了创建一种松散耦合的架构, 许多 Kotlin 项目都采用了依赖注入(DI, Dependency Injection)框架.
DI 框架可以根据当前的环境将依赖注入到组件中.

例如, 你可能会在测试环境和生产环境中注入不同的依赖, 或者, 在部署到云端时与在本地托管时注入不同的依赖.
只要依赖通过接口来表达, 无论是在编译时期还是在运行时期, 都可以注入任意数量的不同实现.

当依赖与平台相关时, 也适用同样的原则.
在共通代码中, 一个组件可以使用通常的 [Kotlin 接口](interfaces.md) 表达它的依赖.
然后可以配置 DI 框架, 来注入平台相关的实现, 例如, 来自 JVM 的实现, 或来自 iOS 模块的实现.

因此, 预期声明和实际声明只在 DI 框架的配置中需要用到.
具体的示例请参见 [使用平台相关的 API](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html#dependency-injection-framework).

使用这样的方案, 你只需要使用接口和工厂函数, 就可以便利的使用 Kotlin Multiplatform.
如果你已经使用了 DI 框架来管理你的项目中的依赖, 我们推荐使用同样的方案来管理平台相关的依赖.

### 预期类与实际类

> 预期类与实际类功能处于 [Beta 版](components-stability.md).
> 这个功能已经基本稳定, 但将来可能需要进行一些手动的源代码迁移工作.
> 我们会尽力减少你需要进行的代码变更.
>
{style="warning"}

你可以使用预期类与实际类来实现相同的解决方案:

```kotlin
// 在 commonMain 源代码集中:
expect class Identity() {
    val userName: String
    val processID: Int
}
```

```kotlin
// 在 jvmMain 源代码集中:
actual class Identity {
    actual val userName: String = System.getProperty("user.name") ?: "None"
    actual val processID: Long = ProcessHandle.current().pid()
}
```

```kotlin
// 在 nativeMain 源代码集中:
actual class Identity {
    actual val userName: String = getlogin()?.toKString() ?: "None"
    actual val processID: Long = getpid().toLong()
}
```

你可能已经在演示材料中看到过这样方案.
但是, 对于简单的情况, 例如使用接口已经足够的情况, _不推荐_ 使用类.

使用接口, 你的设计不会限制为每个目标平台一个实现.
而且, 在测试中替换一个假的实现要简单得多, 在单个平台上提供多个实现也很容易.

作为一般性原则, 应该尽可能依赖标准的语言结构, 而不要使用预期声明和实际声明.

如果你决定使用预期类和实际类, Kotlin 编译器会示警告你, 这个功能处于 Beta 状态.
要压制这个警告, 请在你的 Gradle 构建文件中添加以下编译器选项:

```kotlin
kotlin {
    compilerOptions {
        // 共通的编译器选项, 应用于所有的 Kotlin 源代码集
        freeCompilerArgs.add("-Xexpect-actual-classes")
    }
}
```

#### 从平台类继承

有几种特殊情况, 对类使用 `expect` 关键字可能是最好的方案.
假设 `Identity` 类型在 JVM 中已经存在了:

```kotlin
open class Identity {
    val login: String = System.getProperty("user.name") ?: "none"
    val pid: Long = ProcessHandle.current().pid()
}
```

为了适合既有的代码库和框架, 你的 `Identity` 类型的实现可以从这个类型继承, 并重用它的功能:

1. 为了解决这个问题, 可以在 `commonMain` 中使用 `expect` 关键字声明一个类:

   ```kotlin
   expect class CommonIdentity() {
       val userName: String
       val processID: Long
   }
   ```

2. 在 `nativeMain` 中, 提供一个实际声明, 实现功能:

   ```kotlin
   actual class CommonIdentity {
       actual val userName = getlogin()?.toKString() ?: "None"
       actual val processID = getpid().toLong()
   }
   ```

3. 在 `jvmMain` 中, 提供一个实际声明, 从平台相关的基类继承:

   ```kotlin
   actual class CommonIdentity : Identity() {
       actual val userName = login
       actual val processID = pid
   }
   ```

这里, `CommonIdentity` 类型与你自己的设计相兼容, 同时又利用了 JVM 上既有类型的便利.

#### 框架中的应用程序

作为框架的作者, 你也会发现预期声明和实际声明对你的框架非常有用.

假设上面的示例是一个框架的一部分, 使用者必须从 `CommonIdentity` 继承一个类型, 来提供一个显示名称.

这种情况下, 预期声明是抽象的, 并声明一个抽象方法:

```kotlin
// 在框架代码库的 commonMain 中:
expect abstract class CommonIdentity() {
    val userName: String
    val processID: Long
    abstract val displayName: String
}
```

类似的, 实际实现是抽象的, 声明 `displayName` 方法:

```kotlin
// 在框架代码库的 nativeMain 中:
actual abstract class CommonIdentity {
    actual val userName = getlogin()?.toKString() ?: "None"
    actual val processID = getpid().toLong()
    actual abstract val displayName: String
}
```

```kotlin
// 在框架代码库的 jvmMain 中:
actual abstract class CommonIdentity : Identity() {
    actual val userName = login
    actual val processID = pid
    actual abstract val displayName: String
}
```

框架的使用者需要编写共通代码, 从预期声明继承, 自行实现缺少的方法:

```kotlin
// 在使用者代码库的 commonMain 中:
class MyCommonIdentity : CommonIdentity() {
    override val displayName = "Admin"
}
```

<!-- A similar scheme works in any library that provides a common `ViewModel` for Android or iOS development. Such a library
typically provides an expected `CommonViewModel` class whose actual Android counterpart extends the `ViewModel` class
from the Android framework. See [Use platform-specific APIs](multiplatform-connect-to-apis.md#adapting-to-an-existing-hierarchy-using-expected-actual-classes)
for a detailed description of this example. -->

## 高级使用场景

关于预期声明和实际声明, 存在一些特殊情况.

### 使用类型别名(type alias) 实现实际声明

实际声明的实现不一定需要从头编写.
它可以是一个既有的类型, 例如由第三方库提供的一个类.

你可以使用这个类型, 只要它满足与预期声明相关的所有要求.
例如, 考虑下面两个预期声明:

```kotlin
expect enum class Month {
    JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY,
    AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER
}

expect class MyDate {
    fun getYear(): Int
    fun getMonth(): Month
    fun getDayOfMonth(): Int
}
```

在 JVM 模块中, `java.time.Month` 枚举可以用来实现第一个预期声明, `java.time.LocalDate` 类可以实现第二个.
但是, 无法直接向这些类型添加 `actual` 关键字.

相反, 你可以使用 [类型别名](type-aliases.md) 来连接预期声明和平台相关的类型:

```kotlin
actual typealias Month = java.time.Month
actual typealias MyDate = java.time.LocalDate
```

这种情况下, 请在与预期声明相同的包中定义 `typealias` 声明, 而在其它地方创建被引用的类.

> 由于 `LocalDate` 类型使用了 `Month` 枚举, 你需要在共通代码中将它们都声明为预期类.
>
{style="note"}

<!-- See [Using platform-specific APIs](multiplatform-connect-to-apis.md#actualizing-an-interface-or-a-class-with-an-existing-platform-class-using-typealiases)
for an Android-specific example of this pattern. -->

### 在实际声明中扩大可见度

你可以让实际实现的可见度超过对应的预期声明.
如果你不想将你的 API 公开给一般用户, 这个功能会非常有用.

目前, Kotlin 对于可见度改变的情况会提示错误.
你可以压制这个错误, 方法是向实际类型的别名声明标注 `@Suppress("ACTUAL_WITHOUT_EXPECT")` 注解.
从 Kotlin 2.0 开始, 不会再有这个限制.

例如, 如果你在共通源代码集中声明下面的预期声明:

```kotlin
internal expect class Messenger {
    fun sendMessage(message: String)
}
```

你也可以在平台相关的源代码集中使用下面的实际实现:

```kotlin
@Suppress("ACTUAL_WITHOUT_EXPECT")
public actual typealias Messenger = MyMessenger
```

这里, 预期类的可见度为 internal, 通过类型别名, 它的实际实现是既有的 `MyMessenger` 类, 可见度为 public.

### 在实际声明中增加枚举值

如果在共通源代码集中使用 `expect` 声明了一个枚举类, 每个平台模块都应该有一个对应的 `actual` 声明.
这些声明必须包含相同的枚举值常数, 但也可以包含额外的枚举值常数.

如果你使用既有的平台枚举类来实现预期的枚举类时, 这个功能会非常有用.
例如, 考虑共通源代码集中的以下枚举类:

```kotlin
// 在 commonMain 源代码集中:
expect enum class Department { IT, HR, Sales }
```

当你在平台源代码集中为 `Department` 提供实际声明时, 你可以添加额外的枚举值常数:

```kotlin
// 在 jvmMain 源代码集中:
actual enum class Department { IT, HR, Sales, Legal }
```

```kotlin
// 在 nativeMain 源代码集中:
actual enum class Department { IT, HR, Sales, Marketing }
```

但是, 对于这样的情况, 平台源代码集中的这些额外的枚举值常数与共通代码中的枚举值常数不能匹配.
因此, 编译器要求你处理所有的其他情况.

实现 `Department` 上的 `when` 构造的函数, 需要 `else` 分支:

```kotlin
// 需要 else 分支:
fun matchOnDepartment(dept: Department) {
    when (dept) {
        Department.IT -> println("The IT Department")
        Department.HR -> println("The HR Department")
        Department.Sales -> println("The Sales Department")
        else -> println("Some other department")
    }
}
```

<!-- If you'd like to forbid adding new constants in the actual enum, please vote for this issue [TODO]. -->

### 预期注解类

预期声明和实际声明可以与注解一起使用.
例如, 你可以声明一个 `@XmlSerializable` 注解, 它在每个平台源代码集中需要存在对应的实际声明:

```kotlin
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
expect annotation class XmlSerializable()

@XmlSerializable
class Person(val name: String, val age: Int)
```

对于重用特定平台上的既有类型, 这个功能可能很有用.
例如, 在 JVM 上, 你可以使用 [JAXB 标准](https://javaee.github.io/jaxb-v2/) 中的既有类型来定义你的注解:

```kotlin
import javax.xml.bind.annotation.XmlRootElement

actual typealias XmlSerializable = XmlRootElement
```

将 `expect` 与注解类一起使用时, 还有一个额外的因素需要考虑.
注解用来向代码添加元数据, 并且它不会成为签名中的类型.
在没有使用这个注解的平台上, 预期注解不一定需要拥有实际类.

你只需要在使用注解的平台上提供 `actual` 声明.
这个行为默认不启用, 而且它要求对类型标注 [`OptionalExpectation`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-optional-expectation/) 注解.

对上面声明的 `@XmlSerializable` 注解, 添加 `OptionalExpectation`:

```kotlin
@OptIn(ExperimentalMultiplatform::class)
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@OptionalExpectation
expect annotation class XmlSerializable()
```

在没有使用这个注解的平台上, 如果缺少实际声明, 编译器不会产生错误.

## 下一步做什么?

关于使用平台相关 API 的各种方法的一般性建议, 请参见 [使用平台相关的 API](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html).
