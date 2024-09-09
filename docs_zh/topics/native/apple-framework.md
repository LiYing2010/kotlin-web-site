---
type: doc
layout: reference
category:
title: "教程 - 使用 Kotlin/Native 开发 Apple Framework"
---

# 教程 - 使用 Kotlin/Native 开发 Apple Framework

最终更新: {{ site.data.releases.latestDocDate }}

> Objective-C 库导入 [实验性功能](../components-stability.html#stability-levels-explained).
> `cinterop` 工具从 Objective-C 库生成的所有 Kotlin 声明都应该标注 `@ExperimentalForeignApi` 注解.
>
> Kotlin/Native 自带的原生平台库 (例如 Foundation, UIKit, 和 POSIX),
> 只对一部分 API 需要使用者明确同意(Opt-in). 对于这样的情况, 你会在 IDE 中看到警告信息.
{:.warning}

Kotlin/Native 提供了与 Objective-C/Swift 的双向交互能力. 
Objective-C Framework 和库可以在 Kotlin 代码中使用.
Kotlin 模块也可以在 Swift/Objective-C 代码中使用.
此外, Kotlin/Native 还有 [与 C 代码交互](native-c-interop.html) 功能.
还可以参考教程 [使用 Kotlin/Native 开发动态库](native-dynamic-libraries.html).

在本教程中, 你将会看到在 macOS 和 iOS 的 Objective-C 和 Swift 应用程序中如何使用 Kotlin/Native 代码.

在本教程中, 你将会: 
- [创建一个 Kotlin 库](#create-a-kotlin-library) 并将它编译为一个 Framework
- 查看生成的 [Objective-C 和 Swift API](#generated-framework-headers) 代码
- 在 [Objective-C](#use-the-code-from-objective-c) 和 [Swift](#use-the-code-from-swift) 中使用 Framework
- [配置 Xcode](#xcode-and-framework-dependencies) 在 [macOS](#xcode-for-macos-target) 和 [iOS](#xcode-for-ios-targets) 上使用 Framework
   
## 创建 一个 Kotlin 库

Kotlin/Native 编译器可以从 Kotlin 代码生成 macOS 和 iOS 的 Framework.
创建的 Framework 包含在 Objective-C 和 Swift 中使用它所需要的所有声明和二进制文件.
理解这些技术的最好方法就是来试用一下它们.
首先我们创建一个小小的 Kotlin 库, 然后在一个 Objective-C 程序中使用它.

创建 `hello.kt` 文件, 包含库的内容:

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

尽管可以直接使用命令行, 或者通过脚本文件(比如 `.sh` 或 `.bat` 文件), 但这种方法不适合于包含几百个文件和库的大项目.
更好的方法是使用带有构建系统的 Kotlin/Native 编译器,
因为它会帮助你下载并缓存 Kotlin/Native 编译器二进制文件, 传递依赖的库, 并运行编译器和测试.
Kotlin/Native 能够通过 [kotlin-multiplatform](../gradle/gradle-configure-project.html#targeting-multiple-platforms) plugin
使用 [Gradle](https://gradle.org) 构建系统.

关于如何使用 Gradle 设置 IDE 兼容的项目, 请参见教程 [一个基本的 Kotlin/Native 应用程序](native-gradle.html).
如果你想要寻找具体的步骤指南, 来开始一个新的 Kotlin/Native 项目并在 IntelliJ IDEA 中打开它, 请先阅读这篇教程.
在本教程中, 我们关注更高级的 C 交互功能, 包括使用 Kotlin/Native,
以及使用 Gradle 的 [跨平台](../gradle/gradle-configure-project.html#targeting-multiple-platforms) 构建.

首先, 创建一个项目文件夹. 本教程中的所有路径都是基于这个文件夹的相对路径.
有时在添加任何新文件之前, 会需要创建缺少的目录.

使用以下 `build.gradle(.kts)` Gradle 构建文件:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}

repositories {
    mavenCentral()
}

kotlin {
  macosX64("native") {
    binaries {
      framework {
        baseName = "Demo"
      }
    }
  }
}

tasks.wrapper {
  gradleVersion = "{{ site.data.releases.gradleVersion }}"
  distributionType = Wrapper.DistributionType.ALL
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}

repositories {
    mavenCentral()
}

kotlin {
  macosX64("native") {
    binaries {
      framework {
        baseName = "Demo"
      }
    }
  }
}

wrapper {
  gradleVersion = "{{ site.data.releases.gradleVersion }}"
  distributionType = "ALL"
}
```

</div>
</div>

将源代码文件移动到项目的 `src/nativeMain/kotlin` 文件夹内.
这是使用 [kotlin-multiplatform](../gradle/gradle-configure-project.html#targeting-multiple-platforms) plugin 时的默认源代码路径.
使用以下代码块来配置项目, 生成一个动态库或共用库:

```kotlin
binaries {
  framework {
    baseName = "Demo"
  }  
}
```

除 macOS `X64` 之外, Kotlin/Native 还支持 macos `arm64` 和 iOS `arm32`, `arm64` 以及 `X64` 编译目标.
你可以将 `macosX64` 替换为下表中对应的函数:

| 编译目标平台/设备         | Gradle 函数          |
|------------------------|----------------------|
| macOS x86_64           | `macosX64()`         | 
| macOS ARM 64           | `macosArm64()`       | 
| iOS ARM 64             | `iosArm64()`         | 
| iOS Simulator (x86_64) | `iosX64()`           |
| iOS Simulator (arm64)  | `iosSimulatorArm64`  |

可以 [在 IDE 中](native-get-started.html) 运行 `linkNative` Gradle task 来构建库, 或执行以下控制台命令:

```bash
./gradlew linkNative
```

根据构建变体不同, 构建会
在
`build/bin/native/debugFramework`
和
`build/bin/native/releaseFramework`
文件夹生成 Framework.
我们来看到其中的内容.

## 生成的 Framework 头文件

创建的每个 Framework 在 `<Framework>/Headers/Demo.h` 中包含头文件.
头文件不依赖于编译目标平台 (至少 Kotlin/Native v.0.9.2 如此).
它包含我们的 Kotlin 代码的定义, 以及少量 Kotlin 全局声明.

> Kotlin/Native 导出符号的方式可能会发生变化, 不另行通知.
{:.note}

### Kotlin/Native 运行期声明

我们来看看 Kotlin 运行期声明:

```objc
NS_ASSUME_NONNULL_BEGIN

@interface KotlinBase : NSObject
- (instancetype)init __attribute__((unavailable));
+ (instancetype)new __attribute__((unavailable));
+ (void)initialize __attribute__((objc_requires_super));
@end;

@interface KotlinBase (KotlinBaseCopying) <NSCopying>
@end;

__attribute__((objc_runtime_name("KotlinMutableSet")))
__attribute__((swift_name("KotlinMutableSet")))
@interface DemoMutableSet<ObjectType> : NSMutableSet<ObjectType>
@end;

__attribute__((objc_runtime_name("KotlinMutableDictionary")))
__attribute__((swift_name("KotlinMutableDictionary")))
@interface DemoMutableDictionary<KeyType, ObjectType> : NSMutableDictionary<KeyType, ObjectType>
@end;

@interface NSError (NSErrorKotlinException)
@property (readonly) id _Nullable kotlinException;
@end;
```

Kotlin 类在 Objective-C 中的基类是 `KotlinBase`, 这个类继承 `NSObject` 类.
还有一些对集合和异常的封装. 
大多数集合类型映射为 Objective-C/Swift 中类似的集合类型:

|Kotlin|Swift|Objective-C|
-------|-----|-----------|
|List|Array|NSArray|
|MutableList|NSMutableArray|NSMutableArray|
|Set|Set|NSSet|
|Map|Dictionary|NSDictionary|
|MutableMap|NSMutableDictionary|NSMutableDictionary|

### Kotlin 数值类型与 NSNumber

`<Framework>/Headers/Demo.h` 的下一部分包含 Kotlin/Native 数值类型与 `NSNumber` 之间的映射.
在 Objective-C 中有一个名为 `DemoNumber` 的基类, 在 Swift 中是 `KotlinNumber`. 它继承 `NSNumber`.
对每个 Kotlin 数值类型也有各自的子类:

|Kotlin|Swift|Objective-C| 简单类型 |
-------|-----|-----------|
|`-`      |`KotlinNumber` |`<Package>Number` | `-` |
|`Byte`   |`KotlinByte`   |`<Package>Byte`   | `char` |
|`UByte`  |`KotlinUByte`  |`<Package>UByte`  | `unsigned char` |
|`Short`  |`KotlinShort`  |`<Package>Short`  | `short` |
|`UShort` |`KotlinUShort` |`<Package>UShort` | `unsigned short` |
|`Int`    |`KotlinInt`    |`<Package>Int`    | `int` |
|`UInt`   |`KotlinUInt`   |`<Package>UInt`   | `unsigned int` |
|`Long`   |`KotlinLong`   |`<Package>Long`   | `long long` |
|`ULong`  |`KotlinULong`  |`<Package>ULong`  | `unsigned long long` |
|`Float`  |`KotlinFloat`  |`<Package>Float`  | `float` |
|`Double` |`KotlinDouble` |`<Package>Double` | `double` |
|`Boolean`|`KotlinBoolean`|`<Package>Boolean`| `BOOL/Bool` |

每个数值类型有一个类方法, 可以从相关的简单类型创建一个新实例.
还有一个实例方法, 反过来抽取一个简单类型的值.
声明大致如下:

```objc
__attribute__((objc_runtime_name("Kotlin__TYPE__")))
__attribute__((swift_name("Kotlin__TYPE__")))
@interface Demo__TYPE__ : DemoNumber
- (instancetype)initWith__TYPE__:(__CTYPE__)value;
+ (instancetype)numberWith__TYPE__:(__CTYPE__)value;
@end;
```

其中 `__TYPE__` 是简单类型名称之一, `__CTYPE__` 是相关的 Objective-C 类型, 比如, `initWithChar(char)`.

这些类型用来将装箱的(boxed) Kotlin 数值类型映射到 Objective-C 和 Swift.
在 Swift 中, 你可以简单的调用构造器来创建一个实例, 比如, `KotlinLong(value: 42)`.

### Kotlin 的类和对象

我们来看到 `class` 和 `object` 如何映射到 Objective-C 和 Swift. 
生成的 `<Framework>/Headers/Demo.h` 文件包含 `Class`, `Interface`, 和 `Object` 的明确定义:

```objc
NS_ASSUME_NONNULL_BEGIN

__attribute__((objc_subclassing_restricted))
__attribute__((swift_name("Object")))
@interface DemoObject : KotlinBase
+ (instancetype)alloc __attribute__((unavailable));
+ (instancetype)allocWithZone:(struct _NSZone *)zone __attribute__((unavailable));
+ (instancetype)object __attribute__((swift_name("init()")));
@property (readonly) NSString *field;
@end;

__attribute__((swift_name("Interface")))
@protocol DemoInterface
@required
- (void)iMember __attribute__((swift_name("iMember()")));
@end;

__attribute__((objc_subclassing_restricted))
__attribute__((swift_name("Clazz")))
@interface DemoClazz : KotlinBase <DemoInterface>
- (instancetype)init __attribute__((swift_name("init()"))) __attribute__((objc_designated_initializer));
+ (instancetype)new __attribute__((availability(swift, unavailable, message="use object initializers instead")));
- (DemoLong * _Nullable)memberP:(int32_t)p __attribute__((swift_name("member(p:)")));
@end;
```

代码充满了 Objective-C 的属性(attribute), 目的是帮助你在 Objective-C 和 Swift 两种语言中使用 Framework.
`DemoClazz`, `DemoInterface`, 和 `DemoObject` 分别对应于 `Clazz`, `Interface`, 和 `Object`.
`Interface` 被转换为 `@protocol`, 一个 `class` 和 一个 `object` 都表示为 `@interface`.
`Demo` 前缀来自 `kotlinc-native` 编译器的 `-output` 参数, 以及 Framework 名称.
你可以看到可为 null 的返回 类型 `ULong?` 在 Objective-C 中转换为 `DemoLong*`.

### Kotlin 的全局声明 

Kotlin 的所有全局函数, 在 Objective-C 中转换为 `DemoLibKt`, 在 Swift 中转换为 `LibKt`,
这里 `Demo` 是 Framework 名称, 由 `kotlinc-native` 的 `-output` 参数指定.

```objc
NS_ASSUME_NONNULL_BEGIN

__attribute__((objc_subclassing_restricted))
__attribute__((swift_name("LibKt")))
@interface DemoLibKt : KotlinBase
+ (void)forIntegersB:(int8_t)b s:(int16_t)s i:(int32_t)i l:(DemoLong * _Nullable)l __attribute__((swift_name("forIntegers(b:s:i:l:)")));
+ (void)forFloatsF:(float)f d:(DemoDouble * _Nullable)d __attribute__((swift_name("forFloats(f:d:)")));
+ (NSString *)stringsStr:(NSString * _Nullable)str __attribute__((swift_name("strings(str:)")));
+ (NSString * _Nullable)acceptFunF:(NSString * _Nullable (^)(NSString *))f __attribute__((swift_name("acceptFun(f:)")));
+ (NSString * _Nullable (^)(NSString *))supplyFun __attribute__((swift_name("supplyFun()")));
@end;
```

你可以看到 Kotlin `String` 直接映射为 Objective-C `NSString*`.
类似的, Kotlin 的`Unit` 类型映射为 `void`.
我们看到基本类型会直接映射. 不可为 null 的基本类型直接相互映射.
可为 null 的基本类型映射为 `Kotlin<TYPE>*` 类型, 如 [上表](#kotlin-numbers-and-nsnumber) 所述. 
高阶函数 `acceptFunF` 和 `supplyFun` 都被包含了, 并接受 Objective-C 代码块.

关于所有其它类型的映射, 详情请参见文档 [与 Swift/Objective-C 代码交互](native-objc-interop.html).

## 垃圾收集与引用计数

Objective-C 和 Swift 使用引用计数. Kotlin/Native 也有自己的垃圾收集功能.
Kotlin/Native 垃圾收集 会与 Objective-C/Swift 的引用计数集成.
在 Swift 或 Objective-C 中, 你不需要执行任何特殊操作来控制 Kotlin/Native 实例的生命周期.

## 在 Objective-C 中使用代码

我们来在 Objective-C 中调用 Framework. 要实现这个目的, 创建 `main.m` 文件, 内容如下:

```objc 
#import <Foundation/Foundation.h>
#import <Demo/Demo.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        [[DemoObject object] field];
        
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

这里你在 Objective-C 代码中直接调用 Kotlin 类.
Kotlin `object` 有类方法函数 `object`, 我们可以用它来得到唯一对象的实例, 并对它调用 `Object` 方法. 
widespread 模式用来创建 `Clazz` 类的一个实例. 在 Objective-C 中你调用 `[[ DemoClazz alloc] init]`.
对于没有参数的构造器, 你也可以使用 `[DemoClazz new]`.
在 Objective-C 中, Kotlin 源代码的全局声明封装在 `DemoLibKt` 类内.
所有方法转换为这个类中的类方法.
`strings` 函数转换为 Objective-C 中的 `DemoLibKt.stringsStr` 函数, 你可以直接传递 `NSString` 参数. 
返回值类型也是 `NSString`.

## 在 Swift 中使用代码

你使用 Kotlin/Native 编译的 Framework 有一些帮助属性(attribute), 以方便在 Swift 中使用.
我们将前面的 Objective-C 示例转换为 Swift. 结果你将在 `main.swift` 中得到以下代码:

```swift
import Foundation
import Demo

let kotlinObject = Object()
assert(kotlinObject === Object(), "Kotlin object has only one instance")

let field = Object().field

let clazz = Clazz()
clazz.member(p: 42)

LibKt.forIntegers(b: 1, s: 2, i: 3, l: 4)
LibKt.forFloats(f: 2.71, d: nil)

let ret = LibKt.acceptFun { "\($0) Kotlin is fun" }
if (ret != nil) {
  print(ret!)
}
``` 

Kotlin 代码在 Swift 中转换为非常类似的代码. 但存在很少的区别.
在 Kotlin 中, 所有的 `object` 都只有一个 实例.
Kotlin 的 `object Object` 在 Swift 中则有了一个构造器, 而且我们使用 `Object()` 语法来访问它的唯一实例.
在 Swift 中这个实例永远是同一个, 因此 `Object() === Object()` 为 true.
方法和属性转换为相同的名称. Kotlin 的 `String` 也转换为 Swift 的 `String`.
Swift 也对我们隐藏 `NSNumber*` 的装箱(boxing).
我们可以向 Kotlin 传递一个 Swift 的闭包(closure), 也可以在 Swift 中调用一个 Kotlin 的 Lambda 函数. 

关于类型映射, 更多详情请参见文档 [与 Swift/Objective-C 代码交互](native-objc-interop.html).

## Xcode 与 Framework 依赖项

你需要配置 Xcode 项目来使用我们的 Framework.
具体的配置依赖于编译目标平台. 

### 针对 macOS 编译目标的 Xcode 配置

首先, 在 **target** 配置的 **General** 页中, 在 **Linked Frameworks and Libraries** 节中, 你需要包含我们的 Framework.
这个设置将会让 Xcode 查找我们的 Framework, 并对 Objective-C 和 Swift 解析 import.

第 2 步是配置输出的二进制文件的 Framework 查找路径. 也称为 `rpath` 或 [运行时查找路径](https://en.wikipedia.org/wiki/Rpath).
二进制文件使用这个路径来查找需要的 Framework. 如果没有必要, 我们不推荐在 OS 上安装额外的 Framework.
你应该知道你未来的应用程序的文件构成, 比如, 你可能在应用程序 bundle 中有 `Frameworks` 文件夹, 包含你使用的所有 Framework.
在 Xcode 中可以配置 `@rpath` 参数. 你需要打开 **project** 配置, 找到 **Runpath Search Paths** 节.
在这里你可以指定编译后的 Framework 的相对路径.

### 针对 iOS 编译目标的 Xcode 配置

首先, 你需要在 Xcode 项目中包含编译后的 Framework.
方法是, 在 **target** 配置页的 **General** 页的 **Frameworks, Libraries, and Embedded Content** 节, 添加 Framework. 

第 2 步是, 在 **target** 配置页的 **Build Settings** 页 的 **Framework Search Paths** 节, 包含 Framework 路径.
可以使用宏 `$(PROJECT_DIR)` 来简化设置.
 
iOS 模拟器要求 Framework 编译到 `ios_x64` 编译目标, 在我们的例子中是 `iOS_sim` 文件夹.

[这个 Stackoverflow 讨论串](https://stackoverflow.com/questions/30963294/creating-ios-osx-frameworks-is-it-necessary-to-codesign-them-before-distributin)
包含其他一些建议.
此外 [CocoaPods](https://cocoapods.org/) 包管理器也可以帮助你自动化这个依赖配置过程.

# 下一步做什么?

Kotlin/Native 支持与 Objective-C 和 Swift 语言的双向交互. 
Kotlin 对象与 Objective-C/Swift 的引用计数集成.
未使用的 Kotlin 对象会被自动删除. 
文档 [与 Swift/Objective-C 代码交互](native-objc-interop.html) 介绍了交互的更多实现细节.
当然, 可以导入一个既有的 Framework 并在 Kotlin 中使用它.
Kotlin/Native 带有很多预导入的系统 Framework.

Kotlin/Native 还支持与 C 语言交互.
详情请参见教程 [使用 Kotlin/Native 开发动态库](native-dynamic-libraries.html).
