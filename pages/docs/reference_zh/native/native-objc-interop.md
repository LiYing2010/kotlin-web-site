---
type: doc
layout: reference
category: "Native"
title: "与 Swift/Objective-C 代码交互"
---

# 与 Swift/Objective-C 的交互能力

最终更新: {{ site.data.releases.latestDocDate }}

本章介绍 Kotlin/Native 与 Swift/Objective-C 的交互能力的一些细节.

## 使用方法

Kotlin/Native 提供了与 Objective-C 的双向交互能力.
Objective-C 框架和库可以在 Kotlin 代码中使用, 只需要正确地导入到编译环境中 (系统框架已经默认导入了).
参见 [编译配置](../multiplatform/multiplatform-configure-compilations.html#configure-interop-with-native-languages).
Swift 库也可以在 Kotlin 代码中使用, 只需要将它的 API 用 `@objc` 导出为 Objective-C.
纯 Swift 模块目前还不支持.

Kotlin 模块可以在 Swift/Objective-C 代码中使用, 只需要编译成一个框架
(参见 [如何声明二进制文件](../multiplatform/multiplatform-build-native-binaries.html#declare-binaries)).
我们提供了一个例子,
请参见 [Kotlin Multiplatform Mobile 示例程序](https://github.com/Kotlin/kmm-basic-sample).

## 映射

下表展示了 Kotlin 中的各种概念与 Swift/Objective-C 的对应关系.

"->" 和 "<-" 代表单方向的对应关系.

| Kotlin                 | Swift                         | Objective-C               | 注意事项                                                                               |
|------------------------|-------------------------------|---------------------------|------------------------------------------------------------------------------------|
| `class`                | `class`                       | `@interface`              | [名称翻译](#name-translation)                                                          |
| `interface`            | `protocol`                    | `@protocol`               |                                                                                    |
| `constructor`/`create` | Initializer                   | Initializer               | [初始化器](#initializers)                                                              |
| Property               | Property                      | Property                  | [顶层函数和属性](#top-level-functions-and-properties) [设值方法(Setter)](#setters)            |
| Method                 | Method                        | Method                    | [顶层函数和属性](#top-level-functions-and-properties) [方法名称翻译](#method-names-translation) |
| `suspend` ->           | `completionHandler:`/ `async` | `completionHandler:`      | [错误与异常](#errors-and-exceptions) [挂起函数](#suspending-functions)                      |
| `@Throws fun`          | `throws`                      | `error:(NSError**)error`  | [错误与异常](#errors-and-exceptions)                                                    |
| Extension              | Extension                     | Category 成员               | [扩展与 Category 成员](#extensions-and-category-members)                                |
| `companion` 成员 <-      | Class 方法或属性                   | Class 方法或属性               |                                                                                    |
| `null`                 | `nil`                         | `nil`                     |                                                                                    |
| `Singleton`            | `shared` 或 `companion` 属性     | `shared` 或 `companion` 属性 | [Kotlin 单子(singleton)](#kotlin-singletons)                                         |
| 基本类型                   | 基本类型 / `NSNumber`             |                           | [NSNumber](#nsnumber)                                                              |
| `Unit` 类型返回值           | `Void`                        | `void`                    |                                                                                    |
| `String`               | `String`                      | `NSString`                |                                                                                    |
| `String`               | `NSMutableString`             | `NSMutableString`         | [NSMutableString](#nsmutablestring)                                                |
| `List`                 | `Array`                       | `NSArray`                 |                                                                                    |
| `MutableList`          | `NSMutableArray`              | `NSMutableArray`          |                                                                                    |
| `Set`                  | `Set`                         | `NSSet`                   |                                                                                    |
| `MutableSet`           | `NSMutableSet`                | `NSMutableSet`            | [集合](#collections)                                                                 |
| `Map`                  | `Dictionary`                  | `NSDictionary`            |                                                                                    |
| `MutableMap`           | `NSMutableDictionary`         | `NSMutableDictionary`     | [集合](#collections)                                                                 |
| Function 类型            | Function 类型                   | Block pointer 类型          | [Function 类型](#function-types)                                                     |
| 内联类(Inline class)      | 不支持                           | 不支持                       | [不支持的特性](#unsupported)                                                             |

### 名称翻译

Objective-C 类导入 Kotlin 时使用它们原来的名称.
Protocol 导入 Kotlin 后会变成接口, 并使用 `Protocol` 作为名称后缀,
也就是说 `@protocol Foo` 会被导入为 `interface FooProtocol`.
这些类和接口会放在一个 [在编译配置中指定](#usage) 的包之内
(预定义的系统框架导入到 `platform.*` 包内).

Kotlin 类和接口导入 Objective-C 时会加上名称前缀.
前缀由框架名称决定.

Objective-C 不支持框架内的包. 因此如果同一个框架内的不同包下存在同名的 Kotlin 类, Kotlin 编译器会对类重命名.
这个算法还未稳定, 在不同的 Kotlin 发布版中可能发生变化.
作为替代手段, 你可以将框架内发生名称冲突的 Kotlin 类重命名.

### 初始化器(initializer)

Swift/Objective-C 初始化器导入 Kotlin 时会成为构造器.
对于 Objective-C category 中声明的初始化器, 或声明为 Swift extension 的初始化器,
导入 Kotlin 时会成为名为 `create` 的工厂方法, 因为 Kotlin 没有扩展构造器的概念.

Kotlin 构造器导入 Swift/Objective-C 时会成为初始化器.

### 设值方法(Setter)

Objective-C 中可写的属性如果覆盖超类中的只读属性, 对于 `foo` 属性会表示为 `setFoo()` 方法.
对于一个协议(protocol)的只读属性, 如果实现为可变的属性, 那么也是同样的规则.

### 顶层函数和属性

Kotlin 的顶层函数和属性, 可以通过某个特殊类的成员来访问.
每个 Kotlin 源代码文件都会被翻译为一个这样的类. 比如:

```kotlin
// MyLibraryUtils.kt
package my.library

fun foo() {}
```

在 Swift 中可以这样调用:

```swift
MyLibraryUtilsKt.foo()
```

### 方法名称翻译

通常来说, Swift 的参数标签和 Objective-C 的 selector 会被映射为 Kotlin 的参数名称.
但这两种概念还是存在一些语义上的区别的, 因此有时 Swift/Objective-C 方法导入时可能导致 Kotlin 中的签名冲突.
这时, 发生冲突的方法可以在 Kotlin 使用命名参数来调用, 比如:

```swift
[player moveTo:LEFT byMeters:17]
[player moveTo:UP byInches:42]
```

在 Kotlin 中应该这样调用:

```kotlin
player.moveTo(LEFT, byMeters = 17)
player.moveTo(UP, byInches = 42)
```

`kotlin.Any` 的方法 (`equals()`, `hashCode()` 和 `toString()`),
在 Objective-C 中被映射为方法 `isEquals:`, `hash` 和 `description`,
在 Swift 被映射为方法 `isEquals(_:)` 和属性 `hash`, `description`.

### 错误与异常

Kotlin 中不存在受控异常(Checked Exception)的概念, 所有的 Kotlin 异常都是不受控的.
Swift 则只有受控错误. 因此如果 Swift 或 Objective-C 的代码调用一个 Kotlin 方法,
这个方法抛出一个需要被处理的异常, 那么 Kotlin 方法应该使用 `@Throws` 注解， 指明一组 "期待的" 异常类.

编译为 Objective-C/Swift 框架时, 非-`suspend` 的函数如果拥有或继承了 `@Throws` 注解,
在 Objective-C 中会被表示为产生 `NSError*` 的方法,
在 Swift 中会被表示为 `throws` 方法.
`suspend` 函数的表达中, 在它的 completion handler 中一定会有 `NSError*`/`Error` 参数.

如果从 Swift/Objective-C 代码调用的 Kotlin 函数中抛出异常,
而且这个异常是 `@Throws` 注解指定的异常类(或其子类)的实例,
那么这个异常会被转换为 `NSError`.
其他 Kotlin 异常到达 Swift/Objective-C 代码后, 会被认为是未处理的错误, 并导致程序终止.

没有 `@Throws` 注解的 `suspend` 函数, 只会把 `CancellationException` 异常变换为 `NSError`.
没有 `@Throws` 注解的非-`suspend` 函数, 则完全不会传播 Kotlin 的异常.

注意, 反过来的翻译目前还未实现:
Swift/Objective-C 中抛出 error 的方法, 导入 Kotlin 时不会成为抛出异常的方法.

### 挂起函数

> 从 Swift 代码中 以 `async` 方式调用 `suspend`函数是 [实验性功能](../components-stability.html).
> 它随时有可能变更或被删除. 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-47610) 提供你的反馈意见.
{:.warning}

Kotlin 的 [挂起函数](../coroutines/coroutines-basics.html) (`suspend`) 在生成的 Objective-C 头文件中表达为带有回调的函数,
或用 Swift/Objective-C 术语称为 [completion handlers](https://developer.apple.com/documentation/swift/calling_objective-c_apis_asynchronously).

从 Swift 5.5 开始, Kotlin 的 `suspend` 函数也可以从 Swift 代码中以 `async` 函数的方式调用,
而不需要使用 completion handler.
目前, 这个功能还处于非常初始的实验阶段, 存在很多限制.
详情请参见 [这个 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-47610).

更多详情请参见 [Swift 中的 `async`/`await` 机制](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html).

### 扩展与 Category 成员

Objective-C Category 的成员, 以及 Swift extension 的成员, 导入 Kotlin 时会变成扩展函数.
因此这些声明在 Kotlin 中不能被覆盖.
另外, extension 初始化器 在 Kotlin 中不会成为类的构造器.

对 "通常的" Kotlin 类的 Kotlin 扩展, 导入 Swift 和 Objective-C 后, 分别会成为扩展和 category 成员.
对其他类型的 Kotlin 扩展, 会被当作 [顶层声明](#top-level-functions-and-properties) 处理, 带有额外的接受者参数.
这些类型包括:

* Kotlin `String` 类型
* Kotlin 集合类型, 及其子类型
* Kotlin `interface` 类型
* Kotlin 基本类型(primitive type)
* Kotlin `inline` 类
* Kotlin `Any` 类型
* Kotlin 函数类型, 及其子类型
* Objective-C 类和协议(protocol)

### Kotlin 单子(singleton)

Kotlin 单子(singleton) (通过 `object` 声明产生, 包括 `companion object`) 导入 Swift/Objective-C 会成为一个类,
但它只有唯一一个实例.

这个实例可以通过 `shared` 和 `companion` 属性来访问.

对于下面的 Kotlin 代码:

```kotlin
object MyObject {
    val x = "Some value"
}

class MyClass {
    companion object {
        val x = "Some value"
    }
}
```

可以通过以下方式访问这些对象:

```swift
MyObject.shared
MyObject.shared.x
MyClass.companion
MyClass.Companion.shared
```

> 通过 Objective-C 的 `[MySingleton mySingleton]` 和 Swift 的 `MySingleton()` 访问对象, 这个功能已被废弃.
{:.note}

### NSNumber

Kotlin 基本类型的装箱类会被映射为 Swift/Objective-C 中的特殊类.
比如, `kotlin.Int` 装箱类在 Swift 中会被表达为 `KotlinInt` 类的实例
(或 Objective-C 中的 `${prefix}Int` 类的实例, 其中 `prefix` 是框架名称前缀).
这些类都继承自 `NSNumber`, 因此它们的实例都是 `NSNumber`, 也支持 `NSNumber` 上的所有的操作.

`NSNumber` 类型用做 Swift/Objective-C 的参数类型或返回值类型时, 不会自动翻译为 Kotlin 的基本类型.
原因是, `NSNumber` 类型没有提供足够的信息, 指明它内部包装的基本值类型是什么,
也就是说, 通过 `NSNumber` 我们无法知道它究竟是 `Byte`, `Boolean`, 还是 `Double`.
因此 Kotlin 基本类型与 `NSNumber` 类型的相互转换必须手工进行
(详情请参见 [下文](#casting-between-mapped-types)).

### NSMutableString

Objective-C 的 `NSMutableString` 类在 Kotlin 中无法使用.
`NSMutableString` 所有实例在传递给 Konlin 之前都会被复制一次.

### 集合

Kotlin 集合会被转换为 Swift/Objective-C 的集合类型, 对应关系请参见上表.
Swift/Objective-C 的集合也会以同样的方式映射为 Kotlin 的集合类型, 但 `NSMutableSet` 和 `NSMutableDictionary` 除外.
`NSMutableSet` 不会转换为 Kotlin 的 `MutableSet`.
要创建一个 Kotlin `MutableSet` 类型的对象, 你可以明确地创建这个 Kotlin 集合类型的实例,
要么在 Kotlin 中创建, 比如使用 `mutableSetOf()` 方法,
或者在 Swift 中使用 `KotlinMutableSet` 类创建
(或者在 Objective-C 中使用 `${prefix}MutableSet` 类, 其中 `prefix` 是框架名称前缀).
对于 `MutableMap` 类型也是如此.

### Function 类型

Kotlin 的函数类型对象 (比如 Lambda 表达式) 会被转换为 Swift 函数 或 Objective-C 代码段(block).
但是在翻译函数和函数类型时, 对于参数类型和返回值类型的映射方法存在区别.
对于函数类型, 基本类型映射为它们的装箱类.
Kotlin 的 `Unit` 返回值类型在 Swift/Objective-C 中会被表达为对应的 `Unit` 单子.
这个单子的值可以象其他任何 Kotlin `object` 一样, 通过相同的方式得到(参见上表中的单子).
综合起来的结果就是:

```kotlin
fun foo(block: (Int) -> Unit) { ... }
```

在 Swift 中会成为:

```swift
func foo(block: (KotlinInt) -> KotlinUnit)
```

调用方法是:

```kotlin
foo {
    bar($0 as! Int32)
    return KotlinUnit()
}
```

### 泛型

Objective-C 支持类上定义的 "轻量的泛型", 支持的功能相对有限.
Swift 可以导入类上定义的泛型, 向编译器提供额外的类型信息.

Objective-C 和 Swift 对泛型功能的支持与 Kotlin 不同, 因此翻译过程不可避免的将会丢失部分信息,
但支持的那部分功能还能保留有意义的信息.

#### 功能限制

Objective-C 泛型不支持 Kotlin 或 Swift 的全部特性, 因此在翻译过程中会有一些信息丢失.

泛型只能定义在类上, 而不能用于接口 (也就是 Objective-C 和 Swift 中的协议(protocol)), 也不能用于函数.

#### 可空性(Nullability)

Kotlin 和 Swift 都把可空性(Nullability)的定义作为类型信息的一部分,
而 Objective-C 则在一个类型的方法或属性上定义可空性.
因此, 下面的代码:

```kotlin
class Sample<T>() {
  fun myVal(): T
}
```

(逻辑上)将会变成这样:

```swift
class Sample<T>() {
  fun myVal(): T?
}
```

为了支持可以为 null 的类型, Objective-C 头文件需要将 `myVal` 的返回值定义为可为 null.

为了减轻这个问题, 定义你的泛型类时, 如果泛型类型 *绝对不会* 为 null,
需要提供一个非-null 的类型约束(type constraint):

```kotlin
class Sample<T : Any>() {
  fun myVal(): T
}
```

这样将会强制要求 Objective-C 头文件将 `myVal` 标记为非-null.

#### 类型变异(Variance)

Objective-C 允许泛型声明为协变(covariant), 或反向类型变异(contravariant).
Swift 不支持类型变异(Variance).
如果需要, 对来自 Objective-C 的泛型类, 可以进行强制类型转换.

```kotlin
data class SomeData(val num: Int = 42) : BaseData()
class GenVarOut<out T : Any>(val arg: T)
```

```swift
let variOut = GenVarOut<SomeData>(arg: sd)
let variOutAny : GenVarOut<BaseData> = variOut as! GenVarOut<BaseData>
```

#### 类型约束

在 Kotlin 中, 你可以对泛型类型指定上界(upper bound).
Objective-C 也支持这种功能, 但不能用于更复杂的情况,
而且在 Kotlin - Objective-C 交互中, 目前也不支持.
例外是, 上界(upper bound)指定为非-null, 会使得 Objective-C 方法/属性变为非-null.

#### 关闭泛型功能

如要想要框架头文件不使用泛型, 需要在编译器配置中添加以下参数:

```kotlin
binaries.framework {
     freeCompilerArgs += "-Xno-objc-generics"
}
```

## 在映射的类型之间进行变换

编写 Kotlin 代码时, 对象可能需要从 Kotlin 类型转换为等价的 Swift/Objective-C 类型 (或者反过来).
这种情况下可以直接使用传统的 Kotlin 类型转换, 比如:

```kotlin
val nsArray = listOf(1, 2, 3) as NSArray
val string = nsString as String
val nsNumber = 42 as NSNumber
```

## 类继承

### 在 Swift/Objective-C 中继承 Kotlin 类和接口

Swift/Objective-C 类和 protocol 可以继承 Kotlin 类和接口.

### 在 Kotlin 中继承 Swift/Objective-C 类和接口

Kotlin 的 `final` class 可以继承 Swift/Objective-C 类和 protocol.
目前还不支持非 `final` 的 Kotlin 类继承 Swift/Objective-C 类型,
因此不可能声明一个复杂的类层级, 同时又继承 Swift/Objective-C 类型.

可以使用 Kotlin 的 `override` 关键字来覆盖通常的方法.
这种情况下, 子类方法的参数名称, 必须与被覆盖的方法相同.

有时我们会需要覆盖初始化器, 比如, 继承 `UIViewController` 时.
初始化器会被导入成为 Kotlin 中的构造器, 它可以被 Kotlin 中使用了 `@OverrideInit` 注解的构造器覆盖:

```swift
class ViewController : UIViewController {
    @OverrideInit constructor(coder: NSCoder) : super(coder)

    ...
}
```

子类构造器的参数名称和类型, 必须与被覆盖的构造器相同.

如果多个方法在 Kotlin 中发生了签名冲突, 要覆盖这些方法,
你可以在类上添加 `@Suppress("CONFLICTING_OVERLOADS")` 注解.

Kotlin/Native 默认不会允许通过 `super(...)` 构造器来调用 Objective-C 的非指定(non-designated)初始化器.
如果在 Objective-C 库中没有正确地标注出指定的(designated)初始化器, 那么这种限制可能会造成我们的不便.
可以在这个库的 `.def` 文件中添加一个 `disableDesignatedInitializerChecks = true` 设定, 来关闭编译器的这个检查.

## C 语言功能

请参见 [与 C 代码交互](native-c-interop.html), 其中有一些示例程序,
其中的库使用了某些 C 语言功能, 比如, 不安全的指针, 结构(struct), 等等.

## 将 KDoc 注释导出到生成的 Objective-C 头文件

> KDoc 注释导出到生成的 Objective-C 头文件是 [实验性功能](../components-stability.html).
> 它随时有可能变更或被删除.
> 需要使用者同意(Opt-in) (详情见下文), 而且你应该只为评估目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-38600) 提供你的反馈意见.
{:.warning}

默认情况下, 在生成 Objective-C 头文件时, [KDocs](../kotlin-doc.html) 文档注释不会被翻译为头文件中对应的注释.  
例如, 以下带 KDoc 文档的 Kotlin 代码:

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

会生成 Objective-C 声明, 没有任何注释:

```objc
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

要启用 KDoc 注释导出功能, 请在你的 `build.gradle(.kts)` 添加以下编译器选项:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        compilations.get("main").kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        compilations.get("main").kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
    }
}
```

</div>
</div>

这样设置之后, Objective-C 头文件将包含对应的注释:

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

已知的限制:
* 依赖项的文档不会导出, 除非它本身也使用 `-Xexport-kdoc` 选项来编译.
  这个功能还是实验性功能, 因此使用这个选项编译的库可能与其他编译器版本不兼容.
* 绝大多数 KDoc 注释会 "保持原状" 导出, 很多 KDoc 功能(例如, `@property`)不支持.

## 不支持的特性

Kotlin 编程语言的一些特性目前还没有映射为 Objective-C 或 Swift 中对应的特性.
目前, 在生成的框架头文件中, 以下特性还不能正确地导出:
   * 内联类(inline class) (参数会被映射为底层的基本类型, 或 `id`)
   * 实现标准的 Kotlin 集合接口 (`List`, `Map`, `Set`) 的自定义类, 以及其他特殊的类
   * Objective-C 类的 Kotlin 子类
