[//]: # (title: 使用 Swift export 与 Swift 互操作)

<primary-label ref="alpha"/>

Kotlin 能够通过 Swift export 与 Swift 互操作, 这个功能目前处于 Alpha 阶段.
Swift export 能够直接导出 Kotlin 源代码, 并以符合 Swift 习惯的方式, 从 Swift 调用 Kotlin 代码, 因此不需要 Objective-C 头文件.

Swift export 使针对 Apple 目标平台的跨平台开发更加流畅.
例如, 如果你有一个包含顶层函数的 Kotlin 模块, Swift export 可以实现简洁的, 特定于模块的导入, 消除令人困惑的 Objective-C
下划线和混淆的名称.

Swift export 当前的功能包括:

* **多模块支持**.
  每个 Kotlin 模块作为独立的 Swift 模块导出, 简化了函数调用.
* **包支持**.
  在导出期间明确的保留 Kotlin 包, 避免在生成的 Swift 代码中发生命名冲突.
* **类型别名**.
  Kotlin 类型别名在导出时会保留在 Swift 中, 提高可读性.
* **对于基本类型, 增强可空性**.
  与 Objective-C 的互操作, 需要将 `Int?` 等类型装箱为 `KotlinInt` 之类的包装类, 来保留可空性,
  与此不同, Swift export 能够直接转换可空性信息.
* **重载**.
  你可以在 Swift 中调用 Kotlin 的重载函数, 不会发生歧义.
* **扁平化的包结构**.
  你可以将 Kotlin 包转换为 Swift 枚举, 在生成的 Swift 代码中删除包前缀.
* **自定义模块名称**.
  你可以在 Kotlin 项目的 Gradle 配置中, 自定义生成的 Swift 模块名称.
* **并发支持**.
  你可以从 Swift 无缝的调用 Kotlin 的挂起代码, 并直接将 `kotlinx.coroutines` 流(Flow)导出为 Swift 的 `AsyncSequence`.

## 启用 Swift export {id="enable-swift-export"}

Swift export 目前处于 [Alpha](components-stability.md#stability-levels-explained) 阶段, 还不完整, 因此预计会有破坏性变更.
要试用这个功能, 请在你的 Kotlin 项目中 [配置构建文件](#configure-kotlin-project), 并 [设置 Xcode](#configure-xcode-project)
集成 Swift export.

### 配置 Kotlin 项目 {id="configure-kotlin-project"}

你可以在项目中使用以下构建文件, 作为设置 Swift export 的起点:

```kotlin
// build.gradle.kts
kotlin {

    iosArm64()
    iosSimulatorArm64()

    swiftExport {
        // 设置根模块名称
        moduleName = "Shared"

        // 设置折叠规则
        // 在生成的 Swift 代码中删除包前缀
        flattenPackage = "com.example.sandbox"

        // 配置外部模块的导出
        export(project(":subproject")) {
            // 设置导出的模块名称
            moduleName = "Subproject"
            // 对导出的依赖项, 设置折叠规则
            flattenPackage = "com.subproject.library"
        }

        // 为链接任务提供编译器参数
        configure {
            freeCompilerArgs.add("-Xexpect-actual-classes")
        }
    }
}
```

Kotlin 编译器会自动生成所有需要的文件 (包括 `swiftmodule` 文件, `.a` 静态库, 头文件, 以及 `modulemap` 文件),
并将它们复制到应用程序的构建目录中, 你可以从 Xcode 访问这些文件.

> 你也可以克隆我们的 [公开示例](https://github.com/Kotlin/swift-export-sample), 其中已经设置好了 Swift export.
>
{style="tip"}

### 配置 Xcode 项目 {id="configure-xcode-project"}

配置 Xcode, 将 Swift export 集成到你的项目中, 方法如下:

1. 在 Xcode 中, 打开项目设置.
2. 在 **Build Phases** 页面, 找到包含 `embedAndSignAppleFrameworkForXcode` 任务的 **Run Script** 阶段.
3. 在 Run Script 阶段中, 将脚本替换为 `embedSwiftExportForXcode` 任务:

   ```bash
   ./gradlew :<Shared module name>:embedSwiftExportForXcode
   ```

   ![添加 Swift export 脚本](xcode-swift-export-run-script-phase.png){width=700}

4. 构建项目. 构建会在输出目录中生成 Swift 模块.

## 当前的限制 {id="current-limitations"}

Swift export 目前只能用于使用
[直接集成](multiplatform-direct-integration.md)
将 iOS 框架连接到 Xcode 项目的项目.
这是通过 IntelliJ IDEA 中的 Kotlin Multiplatform plugin 创建的, 或通过 [Web 向导](https://kmp.jetbrains.com/)
创建的 Kotlin Multiplatform 项目的标准配置.

其他已知的问题包括:

* 继承自 `List`, `Set` 或 `Map` 的类型, 在导出时会被忽略 ([KT-80416](https://youtrack.jetbrains.com/issue/KT-80416)).
* `List`, `Set` 或 `Map` 的继承者, 在 Swift 端无法实例化 ([KT-80417](https://youtrack.jetbrains.com/issue/KT-80417)).
* 导出到 Swift 时, Kotlin 泛型类型参数会被类型擦除, 变成它的上界类型.
* 不支持跨语言继承, 因此 Swift 类不能直接继承 Kotlin 导出的类或接口.
* 没有可用的 IDE 迁移提示或自动化工具.
* 使用需要使用者同意(Opt-in)的声明时, 你必须在 Gradle 构建文件的 _模块级别_ 添加明确的 `optIn` 编译器选项.
  例如, 对于 `kotlinx.datetime` 库:

  ```kotlin
  swiftExport {
      moduleName = "Shared"

      export("org.jetbrains.kotlinx:kotlinx-datetime:%dateTimeVersion%") {
          moduleName = "KotlinDateTime"
          flattenPackage = "kotlinx.datetime"
      }
  }

  // 在模块级别添加单独的 opt-in 代码块
  compilerOptions {
      optIn.add("kotlin.time.ExperimentalTime")
  }
  ```

## 映射关系 {id="mappings"}

下表说明 Kotlin 的概念如何映射到 Swift.

| Kotlin                                  | Swift                      |
|-----------------------------------------|----------------------------|
| [`class`](#classes)                     | `class`                    |
| [`object`](#objects)                    | 带 `shared` 属性的 `class` |
| [`enum class`](#enums)                  | `enum`                     |
| [`typealias`](#type-aliases)            | `typealias`                |
| [函数](#functions)                      | Function                   |
| [`suspend fun`](#suspending-functions)  | `async`                    |
| [`kotlinx.coroutines` 流(Flow)](#flows) | `AsyncSequence`            |
| [属性](#properties)                     | Property                   |
| [构造函数](#constructors)               | Initializer                |
| [包](#packages)                         | Nested enum                |
| `Boolean`                               | `Bool`                     |
| `Char`                                  | `Unicode.UTF16.CodeUnit`   |
| `Byte`                                  | `Int8`                     |
| `Short`                                 | `Int16`                    |
| `Int`                                   | `Int32`                    |
| `Long`                                  | `Int64`                    |
| `UByte`                                 | `UInt8`                    |
| `UShort`                                | `UInt16`                   |
| `UInt`                                  | `UInt32`                   |
| `ULong`                                 | `UInt64`                   |
| `Float`                                 | `Float`                    |
| `Double`                                | `Double`                   |
| `Any`                                   | `KotlinBase` 类            |
| `Unit`                                  | `Void`                     |
| [`Nothing`](#kotlin-nothing)            | `Never`                    |

### 声明 {id="declarations"}

#### 类 {id="classes"}

Swift export 只支持直接继承自 `Any` 的 final 类, 例如 `class Foo()`.
它们会被转换为继承自特殊的 `KotlinBase` 类的 Swift 类:

```kotlin
// Kotlin
class MyClass {
    val property: Int = 0

    fun method() {}
}
```

```swift
// Swift
public class MyClass : KotlinRuntime.KotlinBase {
    public var property: Swift.Int32 {
        get {
            // ...
        }
    }
    public override init() {
        // ...
    }
    public func method() -> Swift.Void {
        // ...
    }
}
```

#### 对象 {id="objects"}

对象会被转换为带有 private `init` 和 static `shared` 访问器的 Swift 类:

```kotlin
// Kotlin
object O
```

```swift
// Swift
public class O : KotlinRuntime.KotlinBase {
    public static var shared: O {
        get {
            // ...
        }
    }
    private override init() {
        // ...
    }
}
```

#### 类型别名 {id="type-aliases"}

Kotlin 类型别名会原样导出:

```kotlin
// Kotlin
typealias MyInt = Int
```

```swift
// Swift
public typealias MyInt = Swift.Int32
```

#### 枚举 {id="enums"}

Kotlin `enum class` 声明会导出为通常的原生 Swift `enum` 类型:

```kotlin
// Kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

val color = Color.RED
```

```swift
// Swift
public enum Color: Swift.CaseIterable, Swift.LosslessStringConvertible, Swift.RawRepresentable {
    case RED, GREEN, BLUE

    public var rgb: Swift.Int32 { get }
}
```

#### 函数 {id="functions"}

Swift export 支持简单的顶层函数和方法:

```kotlin
// Kotlin
fun foo(a: Short, b: Bar) {}

fun baz(): Long = 0
```

```swift
// Swift
public func foo(a: Swift.Int16, b: Bar) -> Swift.Void {
    // ...
}

public func baz() -> Swift.Int64 {
    // ...
}
```

对于 Kotlin 的扩展函数, 接收者参数会成为 Swift 中位于第一个的普通参数:

```kotlin
// Kotlin
fun Int.foo(): Unit = TODO()
```

```swift
// Swift
func foo(_ receiver: Int32) {}
```

Kotlin 带有 [`vararg`](functions.md#variable-number-of-arguments-varargs) 的函数, 会映射到 Swift 的可变参数函数:

```kotlin
// Kotlin
fun log(vararg messages: String)
```

```swift
// Swift
public func log(messages: Swift.String...)
```

> * 对带有 [`operator` 修饰符](operator-overloading.md) 的函数, 目前支持有限.
> * 泛型类型通常不支持.
>
{style="note"}

#### 属性 {id="properties"}

Kotlin 属性会被转换为 Swift 属性:

```kotlin
// Kotlin
val a: Int = 0

var b: Short = 15

const val c: Int = 0
```

```swift
// Swift
public var a: Swift.Int32 {
    get {
        // ...
    }
}
public var b: Swift.Int16 {
    get {
        // ...
    }
    set {
        // ...
    }
}
public var c: Swift.Int32 {
    get {
        // ...
    }
}
```

#### 构造函数 {id="constructors"}

构造函数会被转换为 Swift 初始化器:

```kotlin
// Kotlin
class Foo(val prop: Int)
```

```swift
// Swift
public class Foo : KotlinRuntime.KotlinBase {
    public init(
        prop: Swift.Int32
    ) {
        // ...
    }
}
```

### 类型 {id="types"}

#### kotlin.Nothing {id="kotlin-nothing"}

Kotlin 的 `Nothing` 类型会被转换为 `Never` 类型:

```kotlin
// Kotlin
fun foo(): Nothing = TODO()

fun baz(input: Nothing) {}
```

```swift
// Swift
public func foo() -> Swift.Never {
    // ...
}

public func baz(input: Swift.Never) -> Void {
    // ...
}
```

#### 分类器类型(Classifier Type) {id="classifier-types"}

Swift export 目前只支持直接继承自 `Any` 的 final 类.

### 包 {id="packages"}

Kotlin 包会被转换为嵌套的 Swift 枚举, 以避免命名冲突:

```kotlin
// Kotlin
// foo.bar 包中的 bar.kt 文件
fun callMeMaybe() {}
```

```kotlin
// Kotlin
// foo.baz 包中的 baz.kt 文件
fun callMeMaybe() {}
```

```swift
// Swift
public extension foo.bar {
    public func callMeMaybe() {}
}

public extension foo.baz {
    public func callMeMaybe() {}
}

public enum foo {
    public enum bar {}

    public enum baz {}
}
```

### 并发 {id="concurrency"}

#### 挂起函数 {id="suspending-functions"}

你可以从 Swift 调用 Kotlin 的挂起代码.
Kotlin [挂起函数](coroutines-basics.md#suspending-functions) 和挂起函数类型, 会被导出为 Swift 的 `async` 函数和函数类型:

```kotlin
// Kotlin
suspend fun hello(): String {
    delay(1000)
    return "Hello Swift! This is Kotlin."
}
```

```swift
// Swift
let msg = try await hello()
```

#### 流(Flow) {id="flows"}

你还可以将 `kotlinx.coroutines` 流(Flow)导出为 Swift 的 [`AsyncSequence`](https://developer.apple.com/documentation/Swift/AsyncSequence):

```kotlin
// Kotlin
// 导出 Flow, 保留 String 类型
fun flowOfStrings(): Flow<String> = flowOf("hello", "any", "world")
```

```swift
// Swift
var actual: [String] = []

// 从 Kotlin 推断 String 类型
for try await element in flowOfStrings().asAsyncSequence() {
    actual.append(element)
}
```

#### 协程派发器(Coroutine Dispatcher) {id="coroutine-dispatchers"}

默认情况下, 当你从 Swift 调用 Kotlin 挂起函数， 或使用 `asAsyncSequence` 函数时,
Kotlin 会创建一个协程上下文(Coroutine Context), 它使用 [`Dispatchers.Default`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-default.html)
派发器, 并在这个协程上下文中执行导出的代码.

要在 [不同的派发器](coroutines-basics.md#coroutine-dispatchers) 上运行导出的代码,
请在 Kotlin 中使用 `withContext()` 函数切换协程上下文. 例如:

```kotlin
suspend fun runOnMain(): Int = withContext(Dispatchers.Main) {
    delay(10L)
    42
}
```

## Swift export 的演进 {id="evolution-of-swift-export"}

我们计划在未来的 Kotlin 版本中扩展 Swift export 的功能, 并逐步稳定, 改善 Kotlin 和 Swift 之间的互操作性.
你可以在以下地方留下你的反馈意见:

* 在 Kotlin Slack 中 - [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw),
  并加入 [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) 频道.
* 在 [YouTrack](https://kotl.in/issue) 中报告问题.
