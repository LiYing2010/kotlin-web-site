[//]: # (title: 教程 - 使用 Kotlin/Native 开发 Apple Framework)

> Objective-C 库导入 [实验性功能](components-stability.md#stability-levels-explained).
> cinterop 工具从 Objective-C 库生成的所有 Kotlin 声明都应该标注 `@ExperimentalForeignApi` 注解.
>
> Kotlin/Native 自带的原生平台库 (例如 Foundation, UIKit, 和 POSIX),
> 只对一部分 API 需要使用者明确同意(Opt-in). 对于这样的情况, 你会在 IDE 中看到警告信息.
>
{style="warning"}

Kotlin/Native 提供了与 Swift/Objective-C 的双向交互能力.
你可以在 Kotlin 代码中使用 Objective-C Framework 和库, 也可以在 Swift/Objective-C 代码中使用 Kotlin 模块.

Kotlin/Native 带有一组预先导入的系统 Framework; 也可以导入既有的 Framework 并在 Kotlin 中使用.
在本教程中, 你将会学习如何创建你自己的 Framework, 以及如何在 macOS 和 iOS 的 Swift/Objective-C 应用程序中使用 Kotlin/Native 代码.

在本教程中, 你将会:

* [创建一个 Kotlin 库, 并将它编译为 Framework](#create-a-kotlin-library)
* [查看生成的 Swift/Objective-C API 代码](#generated-framework-headers)
* [在 Objective-C 中使用 Framework](#use-code-from-objective-c)
* [在 Swift 中使用 Framework](#use-code-from-swift)

你可以直接使用命令行来生成 Kotlin Framework, 或者通过脚本文件 (例如 `.sh` 或 `.bat` 文件).
但是, 这种方法不适合于包含几百个文件和库的大项目.
使用构建系统可以帮助你下载并缓存 Kotlin/Native 编译器二进制文件, 传递依赖的库,
并运行编译器和测试, 简化构建过程,
Kotlin/Native 能够通过 [Kotlin Multiplatform plugin](gradle-configure-project.md#targeting-multiple-platforms)
使用 [Gradle](https://gradle.org) 构建系统.

> 如果你使用 Mac 机器, 并希望创建和运行针对 macOS 或其他 Apple 目标平台的应用程序,
> 那么你还需要安装 [Xcode Command Line Tools](https://developer.apple.com/download/),
> 请先启动它, 并接受许可条款.
>
{style="note"}

## 创建一个 Kotlin 库 {id="create-a-kotlin-library"}

> 关于如何创建一个新的 Kotlin/Native 项目, 并在 IntelliJ IDEA 中打开它,
> 详细的步骤和指南请参见 [Kotlin/Native 开发入门](native-get-started.md#using-gradle) 教程.
>
{style="tip"}

Kotlin/Native 编译器可以从 Kotlin 代码生成 macOS 和 iOS 的 Framework.
创建的 Framework 包含在 Swift/Objective-C 中使用它所需要的所有声明和二进制文件.

我们首先来创建一个 Kotlin 库:

1. 在 `src/nativeMain/kotlin` 目录中, 创建 `lib.kt` 文件, 包含以下库内容:

   ```kotlin
   package example

   object Object {
       val field = "A"
   }

   interface Interface {
       fun iMember() {}
   }

   class Clazz : Interface {
       fun member(p: Int): ULong? = 42UL
   }

   fun forIntegers(b: Byte, s: UShort, i: Int, l: ULong?) { }
   fun forFloats(f: Float, d: Double?) { }

   fun strings(str: String?) : String {
       return "That is '$str' from C"
   }

   fun acceptFun(f: (String) -> String?) = f("Kotlin/Native rocks!")
   fun supplyFun() : (String) -> String? = { "$it is cool!" }
   ```

2. 将你的 `build.gradle(.kts)` Gradle 构建文件更新为以下内容:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       iosArm64("native") {
           binaries {
               framework {
                   baseName = "Demo"
               }
           }
       }
   }

   tasks.wrapper {
       gradleVersion = "%gradleVersion%"
       distributionType = Wrapper.DistributionType.ALL
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   plugins {
       id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       iosArm64("native") {
           binaries {
               framework {
                   baseName = "Demo"
               }
           }
       }
   }

   wrapper {
       gradleVersion = "%gradleVersion%"
       distributionType = "ALL"
   }
   ```

   </tab>
   </tabs>

   `binaries {}` 代码块配置项目, 生成一个动态库或共用库.

   Kotlin/Native 对 iOS 支持 `iosArm64`, `iosX64`, 和 `iosSimulatorArm64` 编译目标, 对 macOS 支持 `macosX64` 和 `macosArm64` 编译目标.
   因此, 你可以将 `iosArm64()` 替换为针对你的目标平台的对应的 Gradle 函数:

   | 编译目标平台/设备         | Gradle 函数             |
   |------------------------|-----------------------|
   | macOS x86_64           | `macosX64()`          |
   | macOS ARM64           | `macosArm64()`        |
   | iOS ARM64             | `iosArm64()`          |
   | iOS Simulator (x86_64) | `iosX64()`            |
   | iOS Simulator (ARM64)  | `iosSimulatorArm64()` |

   关于支持的其他 Apple 目标平台, 请参见 [Kotlin/Native 支持的目标平台](native-target-support.md).

3. 在 IDE 中运行 `linkDebugFrameworkNative` Gradle task, 或在你的终端中使用以下控制台命令, 来构建 Framework:

   ```bash
   ./gradlew linkDebugFrameworkNative
   ```

构建会在 `build/bin/native/debugFramework` 目录中生成 Framework.

> 你也可以使用 `linkNative` Gradle task, 同时生成 Framework 的 `debug` 和 `release` 变体.
>
{style="tip"}

## 生成的 Framework 头文件 {id="generated-framework-headers"}

每个 Framework 变体包含一个头文件. 头文件不依赖于编译目标平台.
头文件包含你的 Kotlin 代码的定义, 以及少量 Kotlin 全局声明.
我们来看看其中的内容.

### Kotlin/Native 运行期声明 {id="kotlin-native-runtime-declarations"}

在 `build/bin/native/debugFramework/Demo.framework/Headers` 目录中, 打开 `Demo.h` 头文件.
我们来看看 Kotlin 运行期声明:

```objc
NS_ASSUME_NONNULL_BEGIN
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-warning-option"
#pragma clang diagnostic ignored "-Wincompatible-property-type"
#pragma clang diagnostic ignored "-Wnullability"

#pragma push_macro("_Nullable_result")
#if !__has_feature(nullability_nullable_result)
#undef _Nullable_result
#define _Nullable_result _Nullable
#endif

__attribute__((swift_name("KotlinBase")))
@interface DemoBase : NSObject
- (instancetype)init __attribute__((unavailable));
+ (instancetype)new __attribute__((unavailable));
+ (void)initialize __attribute__((objc_requires_super));
@end

@interface DemoBase (DemoBaseCopying) <NSCopying>
@end

__attribute__((swift_name("KotlinMutableSet")))
@interface DemoMutableSet<ObjectType> : NSMutableSet<ObjectType>
@end

__attribute__((swift_name("KotlinMutableDictionary")))
@interface DemoMutableDictionary<KeyType, ObjectType> : NSMutableDictionary<KeyType, ObjectType>
@end

@interface NSError (NSErrorDemoKotlinException)
@property (readonly) id _Nullable kotlinException;
@end
```

Kotlin 类在 Swift/Objective-C 中的基类是 `KotlinBase`, 它继承 `NSObject` 类.
还有一些对集合和异常的封装.
大多数集合类型映射为 Swift/Objective-C 中类似的集合类型:

| Kotlin      | Swift               | Objective-C         |
|-------------|---------------------|---------------------|
| List        | Array               | NSArray             |
| MutableList | NSMutableArray      | NSMutableArray      |
| Set         | Set                 | NSSet               |
| MutableSet  | NSMutableSet        | NSMutableSet        |
| Map         | Dictionary          | NSDictionary        |
| MutableMap  | NSMutableDictionary | NSMutableDictionary |

### Kotlin 数值类型与 NSNumber {id="kotlin-numbers-and-nsnumber"}

`Demo.h` 文件的下一部分包含 Kotlin/Native 数值类型与 `NSNumber` 之间的映射.
在 Objective-C 中基类名为 `DemoNumber`, 在 Swift 中是 `KotlinNumber`. 它继承 `NSNumber`.

对每个 Kotlin 数值类型, 存在对应的预定义的子类:

| Kotlin    | Swift           | Objective-C        | 简单类型                 |
|-----------|-----------------|--------------------|----------------------|
| `-`       | `KotlinNumber`  | `<Package>Number`  | `-`                  |
| `Byte`    | `KotlinByte`    | `<Package>Byte`    | `char`               |
| `UByte`   | `KotlinUByte`   | `<Package>UByte`   | `unsigned char`      |
| `Short`   | `KotlinShort`   | `<Package>Short`   | `short`              |
| `UShort`  | `KotlinUShort`  | `<Package>UShort`  | `unsigned short`     |
| `Int`     | `KotlinInt`     | `<Package>Int`     | `int`                |
| `UInt`    | `KotlinUInt`    | `<Package>UInt`    | `unsigned int`       |
| `Long`    | `KotlinLong`    | `<Package>Long`    | `long long`          |
| `ULong`   | `KotlinULong`   | `<Package>ULong`   | `unsigned long long` |
| `Float`   | `KotlinFloat`   | `<Package>Float`   | `float`              |
| `Double`  | `KotlinDouble`  | `<Package>Double`  | `double`             |
| `Boolean` | `KotlinBoolean` | `<Package>Boolean` | `BOOL/Bool`          |

每个数值类型有一个类方法, 可以从对应的简单类型创建一个新实例.
还有一个实例方法, 反过来抽取一个简单类型的值.
所有这些声明大致如下:

```objc
__attribute__((swift_name("Kotlin__TYPE__")))
@interface Demo__TYPE__ : DemoNumber
- (instancetype)initWith__TYPE__:(__CTYPE__)value;
+ (instancetype)numberWith__TYPE__:(__CTYPE__)value;
@end;
```

其中, `__TYPE__` 是简单类型名称之一, `__CTYPE__` 是对应的 Objective-C 类型, 例如, `initWithChar(char)`.

这些类型用来将装箱的(boxed) Kotlin 数值类型映射到 Swift/Objective-C.
在 Swift 中, 你可以调用构造器来创建一个实例, 例如, `KotlinLong(value: 42)`.

### Kotlin 的类和对象 {id="classes-and-objects-from-kotlin"}

我们来看到 `class` 和 `object` 如何映射到 Swift/Objective-C.
生成的 `Demo.h` 文件包含 `Class`, `Interface`, 和 `Object` 的明确定义:

```objc
__attribute__((swift_name("Interface")))
@protocol DemoInterface
@required
- (void)iMember __attribute__((swift_name("iMember()")));
@end

__attribute__((objc_subclassing_restricted))
__attribute__((swift_name("Clazz")))
@interface DemoClazz : DemoBase <DemoInterface>
- (instancetype)init __attribute__((swift_name("init()"))) __attribute__((objc_designated_initializer));
+ (instancetype)new __attribute__((availability(swift, unavailable, message="use object initializers instead")));
- (DemoULong * _Nullable)memberP:(int32_t)p __attribute__((swift_name("member(p:)")));
@end

__attribute__((objc_subclassing_restricted))
__attribute__((swift_name("Object")))
@interface DemoObject : DemoBase
+ (instancetype)alloc __attribute__((unavailable));
+ (instancetype)allocWithZone:(struct _NSZone *)zone __attribute__((unavailable));
+ (instancetype)object __attribute__((swift_name("init()")));
@property (class, readonly, getter=shared) DemoObject *shared __attribute__((swift_name("shared")));
@property (readonly) NSString *field __attribute__((swift_name("field")));
@end
```

这段代码中的 Objective-C 的属性(attribute)会帮助你在 Swift 和 Objective-C 中使用 Framework.
`DemoInterface`, `DemoClazz`, 和 `DemoObject` 分别对应于 `Interface`, `Clazz`, 和 `Object`.

`Interface` 被转换为 `@protocol`, 一个 `class` 和 一个 `object` 都表示为 `@interface`.
`Demo` 前缀来自 Framework 名称.
可为 null 的返回类型 `ULong?` 在 Objective-C 中转换为 `DemoULong`.

### Kotlin 的全局声明 {id="global-declarations-from-kotlin"}

Kotlin 的所有全局函数, 在 Objective-C 中转换为 `DemoLibKt`, 在 Swift 中转换为 `LibKt`,
这里 `Demo` 是由 `kotlinc-native` 的 `-output` 参数指定的 Framework 名称:

```objc
__attribute__((objc_subclassing_restricted))
__attribute__((swift_name("LibKt")))
@interface DemoLibKt : DemoBase
+ (NSString * _Nullable)acceptFunF:(NSString * _Nullable (^)(NSString *))f __attribute__((swift_name("acceptFun(f:)")));
+ (void)forFloatsF:(float)f d:(DemoDouble * _Nullable)d __attribute__((swift_name("forFloats(f:d:)")));
+ (void)forIntegersB:(int8_t)b s:(uint16_t)s i:(int32_t)i l:(DemoULong * _Nullable)l __attribute__((swift_name("forIntegers(b:s:i:l:)")));
+ (NSString *)stringsStr:(NSString * _Nullable)str __attribute__((swift_name("strings(str:)")));
+ (NSString * _Nullable (^)(NSString *))supplyFun __attribute__((swift_name("supplyFun()")));
@end
```

Kotlin `String` 直接映射为 Objective-C `NSString*`.
类似的, Kotlin 的`Unit` 类型映射为 `void`.
基本类型会直接映射. 不可为 null 的基本类型直接相互映射.
可为 null 的基本类型映射为 `Kotlin<TYPE>*` 类型, 如 [前面的对应表](#kotlin-numbers-and-nsnumber) 所述.
高阶函数 `acceptFunF` 和 `supplyFun` 都被包含了, 并接受 Objective-C 代码块.

关于类型映射, 详情请参见 [与 Swift/Objective-C 代码交互](native-objc-interop.md#mappings).

## 垃圾收集与引用计数 {id="garbage-collection-and-reference-counting"}

Swift 和 Objective-C 使用自动引用计数(Automatic Reference Counting, ARC).
Kotlin/Native 有自己的 [垃圾收集器](native-memory-manager.md#garbage-collector),
它也会 [与 Swift/Objective-C ARC 集成](native-arc-integration.md).

不被使用的 Kotlin 对象会自动被删除.
在 Swift 或 Objective-C 中, 你不需要进行额外的操作来控制 Kotlin/Native 实例的生命周期.

## 在 Objective-C 中使用代码 {id="use-code-from-objective-c"}

我们来在 Objective-C 中调用 Framework.
在 Framework 目录中, 创建 `main.m` 文件, 包含以下代码:

```objc
#import <Foundation/Foundation.h>
#import <Demo/Demo.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        [DemoObject.shared field];

        DemoClazz* clazz = [[ DemoClazz alloc] init];
        [clazz memberP:42];

        [DemoLibKt forIntegersB:1 s:1 i:3 l:[DemoULong numberWithUnsignedLongLong:4]];
        [DemoLibKt forIntegersB:1 s:1 i:3 l:nil];

        [DemoLibKt forFloatsF:2.71 d:[DemoDouble numberWithDouble:2.71]];
        [DemoLibKt forFloatsF:2.71 d:nil];

        NSString* ret = [DemoLibKt acceptFunF:^NSString * _Nullable(NSString * it) {
            return [it stringByAppendingString:@" Kotlin is fun"];
        }];

        NSLog(@"%@", ret);
        return 0;
    }
}
```

这里, 你在 Objective-C 代码中直接调用 Kotlin 类.
一个 Kotlin 对象使用 `<object name>.shared` 类属性,
你可以用它来得到对象的唯一实例, 并对它调用对象方法.

widespread 模式用来创建 `Clazz` 类的一个实例. 在 Objective-C 中你调用 `[[ DemoClazz alloc] init]`.
对于没有参数的构造器, 你也可以使用 `[DemoClazz new]`.

在 Objective-C 中, Kotlin 源代码的全局声明封装在 `DemoLibKt` 类内.
所有的 Kotlin 函数会转换为这个类中的类方法.

`strings` 函数转换为 Objective-C 中的 `DemoLibKt.stringsStr` 函数, 因此你可以直接传递 `NSString` 参数.
返回值类型也是 `NSString`.

## 在 Swift 中使用代码 {id="use-code-from-swift"}

你生成的 Framework 有一些帮助属性(attribute), 以方便在 Swift 中使用.
我们来将 [前面的 Objective-C 示例](#use-code-from-objective-c) 转换为 Swift.

在 Framework 目录中, 创建 `main.swift` 文件, 包含以下代码:

```swift
import Foundation
import Demo

let kotlinObject = Object.shared

let field = Object.shared.field

let clazz = Clazz()
clazz.member(p: 42)

LibKt.forIntegers(b: 1, s: 2, i: 3, l: 4)
LibKt.forFloats(f: 2.71, d: nil)

let ret = LibKt.acceptFun { "\($0) Kotlin is fun" }
if (ret != nil) {
    print(ret!)
}
```

在原始的 Kotlin 代码和对应的 Swift 代码之间存在一些小的区别.
在 Kotlin 中, 所有的对象声明都只有一个实例.
`Object.shared` 语法用来访问这个单个实例.

Kotlin 函数和属性转换为相同的名称. Kotlin 的 `String` 也转换为 Swift 的 `String`.
Swift 也隐藏 `NSNumber*` 的装箱(boxing).
你可以向 Kotlin 传递一个 Swift 的闭包(closure), 也可以在 Swift 中调用一个 Kotlin 的 Lambda 函数.

关于类型映射, 更多详情请参见 [与 Swift/Objective-C 代码交互](native-objc-interop.md#mappings).

## 将 Framework 连接到你的 iOS 项目 {id="connect-the-framework-to-your-ios-project"}

现在你可以将生成的 Framework 作为依赖项, 连接到你的 iOS 项目.
有多种方式进行设置, 并自动完成这个过程, 请选择最适合你的方法:

<a href="multiplatform-ios-integration-overview.md"><img src="choose-ios-integration.svg" width="700" alt="Choose iOS integration method" style="block"/></a>

## 下一步做什么 {id="what-s-next"}

* [学习与 Objective-C 交互](native-objc-interop.md)
* [查看在 Kotlin 中如何实现与 C 的交互](native-c-interop.md)
* [查看使用 Kotlin/Native 开发动态库教程](native-dynamic-libraries.md)
