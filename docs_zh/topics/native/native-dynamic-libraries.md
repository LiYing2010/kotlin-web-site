[//]: # (title: 教程 - 使用 Kotlin/Native 开发动态库)

通过本教程, 你将学习如何在既有的原生应用程序或库中使用 Kotlin/Native 代码.
为了这个目的, 你需要将 Kotlin 代码编译为一个动态库, `.so`, `.dylib`, 和 `.dll`.

Kotlin/Native 还与 Apple 技术高度集成.
[使用 Kotlin/Native 开发 Apple Framework](apple-framework.md)
教程介绍如何将 Kotlin 代码编译为一个框架, 供 Swift 和 Objective-C 使用.

在本教程中, 你将会:
 - [将 Kotlin 代码编译为一个动态库](#create-a-kotlin-library)
 - [检查生成的 C 头文件](#generated-headers-file)
 - [在 C 中使用 Kotlin 动态库](#use-generated-headers-from-c)
 - 在 [Linux 和 Mac](#compile-and-run-the-example-on-linux-and-macos)
   以及 [Windows](#compile-and-run-the-example-on-windows) 上编译并运行示例程序

## 创建一个 Kotlin 库 {id="create-a-kotlin-library"}

Kotlin/Native 编译器能够从 Kotlin 代码生成一个动态库.
一个动态库通常带有一个头文件, 也就是一个 `.h` 文件, 你在 C 语言中使用它来调用编译后的代码.

理解这些技术的最好方法就是来试用一下它们.
首先我们创建一个小小的 Kotlin 库, 然后在一个 C 程序中使用它.

首先在 Kotlin 中创建一个库文件, 保存为 `hello.kt`:

```kotlin
package example

object Object {
    val field = "A"
}

class Clazz {
    fun memberFunction(p: Int): ULong = 42UL
}

fun forIntegers(b: Byte, s: Short, i: UInt, l: Long) { }
fun forFloats(f: Float, d: Double) { }

fun strings(str: String) : String? {
    return "That is '$str' from C"
}

val globalString = "A global String"
```

尽管可以直接使用命令行, 或者通过脚本文件(比如 `.sh` 或 `.bat` 文件), 但这种方法不适合于包含几百个文件和库的大项目.
更好的方法是使用带有构建系统的 Kotlin/Native 编译器,
因为它会帮助你下载并缓存 Kotlin/Native 编译器二进制文件, 传递依赖的库, 并运行编译器和测试.
Kotlin/Native 能够通过 [kotlin-multiplatform](gradle-configure-project.md#targeting-multiple-platforms) plugin
使用 [Gradle](https://gradle.org) 构建系统.

关于如何使用 Gradle 设置 IDE 兼容的项目, 请参见教程 [一个基本的 Kotlin/Native 应用程序](native-gradle.md).
如果你想要寻找具体的步骤指南, 来开始一个新的 Kotlin/Native 项目并在 IntelliJ IDEA 中打开它, 请先阅读这篇教程.
在本教程中, 我们关注更高级的 C 交互功能, 包括使用 Kotlin/Native,
以及使用 Gradle 的 [跨平台](gradle-configure-project.md#targeting-multiple-platforms) 构建.

首先, 创建一个项目文件夹. 本教程中的所有路径都是基于这个文件夹的相对路径.
有时在添加任何新文件之前, 会需要创建缺少的目录.

使用以下 `build.gradle(.kts)` Gradle 构建文件:

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
    linuxX64("native") { // 用于 Linux 环境
    // macosX64("native") { // 用于 x86_64 macOS 环境
    // macosArm64("native") { // 用于 Apple Silicon macOS 环境
    // mingwX64("native") { // 用于 Windows 环境
        binaries {
            sharedLib {
                baseName = "native" // 用于 Linux 和 macOS 环境
                // baseName = "libnative" // 用于 Windows 环境
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
    linuxX64("native") { // 用于 Linux 环境
    // macosX64("native") { // 用于 x86_64 macOS 环境
    // macosArm64("native") { // 用于 Apple Silicon macOS 环境
    // mingwX64("native") { // 用于 Windows 环境
        binaries {
            sharedLib {
                baseName = "native" // 用于 Linux 和 macOS 环境
                // baseName = "libnative" // 用于 Windows 环境
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

将源代码文件移动到项目的 `src/nativeMain/kotlin` 文件夹中.
这是使用 [kotlin-multiplatform](gradle-configure-project.md#targeting-multiple-platforms) plugin 时的默认源代码路径.
使用以下代码块来配置项目, 生成一个动态库或共用库:

```kotlin
binaries {
    sharedLib {
        baseName = "native" // 用于 Linux 和 macOS 环境
        // baseName = "libnative" // 用于 Windows 环境
    }
}
```

`libnative` 用作库名称, 以及生成的头文件名称前缀. 它还是头文件中所有声明的前缀.

现在你可以 [在 IntelliJ IDEA 中打开项目](native-get-started.md), 并查看如何修改示例项目.
在这个过程中, 我们会看看 C 函数如何映射为 Kotlin/Native 声明.

可以在 IDE 中运行 `linkNative` Gradle task 来构建库, 或执行以下控制台命令:

```bash
./gradlew linkNative
```

根据主机的 OS 不同, 构建会在 `build/bin/native/debugShared` 文件夹下生成以下文件:
- macOS: `libnative_api.h` 和 `libnative.dylib`
- Linux: `libnative_api.h` 和 `libnative.so`
- Windows: `libnative_api.h`, `libnative_symbols.def` 和 `libnative.dll`

Kotlin/Native 编译器对所有平台生成 `.h` 文件时, 使用相同的规则.
我们来看看我们的 Kotlin 库的 C API.

## 生成的头文件 {id="generated-headers-file"}

在 `libnative_api.h` 中, 你将看到以下代码.
我们把代码分成各个部分来讨论, 这样比较容易理解.

> Kotlin/Native 导出符号的方式可能会发生变化, 不另行通知.
>
{style="note"}

第一部分包含标准的 C/C++ 代码头部和尾部:

```c
#ifndef KONAN_DEMO_H
#define KONAN_DEMO_H
#ifdef __cplusplus
extern "C" {
#endif

/// 这里是生成的代码的其它部分

#ifdef __cplusplus
}  /* extern "C" */
#endif
#endif  /* KONAN_DEMO_H */
```

在 `libnative_api.h` 中, 在上述惯例部分之外, 有一个代码块, 包含共通的类型定义:

```c
#ifdef __cplusplus
typedef bool            libnative_KBoolean;
#else
typedef _Bool           libnative_KBoolean;
#endif
typedef unsigned short     libnative_KChar;
typedef signed char        libnative_KByte;
typedef short              libnative_KShort;
typedef int                libnative_KInt;
typedef long long          libnative_KLong;
typedef unsigned char      libnative_KUByte;
typedef unsigned short     libnative_KUShort;
typedef unsigned int       libnative_KUInt;
typedef unsigned long long libnative_KULong;
typedef float              libnative_KFloat;
typedef double             libnative_KDouble;
typedef void*              libnative_KNativePtr;
```

在创建的 `libnative_api.h` 文件中, Kotlin 对所有的声明使用 `libnative_` 前缀.
我们把类型的对应关系整理为下面的对应表, 这样更容易阅读:

| Kotlin 定义              | C 类型                 |
|------------------------|----------------------|
| `libnative_KBoolean`   | `bool` 或 `_Bool`     |
| `libnative_KChar`      | `unsigned short`     |
| `libnative_KByte`      | `signed char`        |
| `libnative_KShort`     | `short`              |
| `libnative_KInt`       | `int`                |
| `libnative_KLong`      | `long long`          |
| `libnative_KUByte`     | `unsigned char`      |
| `libnative_KUShort`    | `unsigned short`     |
| `libnative_KUInt`      | `unsigned int`       |
| `libnative_KULong`     | `unsigned long long` |
| `libnative_KFloat`     | `float`              |
| `libnative_KDouble`    | `double`             |
| `libnative_KNativePtr` | `void*`              |

定义部分显示 Kotlin 基本类型如何映射为 C 基本类型.
反过来的对应关系请参见 [映射 C 语言的基本数据类型](mapping-primitive-data-types-from-c.md) 教程.

`libnative_api.h` 文件的下一部分包含库中使用的类型的定义:

```c
struct libnative_KType;
typedef struct libnative_KType libnative_KType;

typedef struct {
    libnative_KNativePtr pinned;
} libnative_kref_example_Object;

typedef struct {
    libnative_KNativePtr pinned;
} libnative_kref_example_Clazz;
```

C 语言中使用 `typedef struct { .. } TYPE_NAME` 语法来声明一个结构(structure).
Stackoverflow 上的 [这个讨论串](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions)
对这种模式有更详细的解释.

从这些定义你可以看到, Kotlin 对象 `Object` 映射为 `libnative_kref_example_Object`, `Clazz` 映射为 `libnative_kref_example_Clazz`.
两个结构都仅仅包含一个指针类型的 `pinned` 域变量, 域变量类型 `libnative_KNativePtr` 在上面定义为 `void*`.

C 中不支持命名空间(namespace), 因此 Kotlin/Native 编译器生成很长的名称, 以免与既有的原生项目中的其它符号发生名称冲突.

定义一个重要的部分也在 `libnative_api.h` 文件中.
它包含我们的 Kotlin/Native 库的定义:

```c
typedef struct {
    /* 服务函数. */
    void (*DisposeStablePointer)(libnative_KNativePtr ptr);
    void (*DisposeString)(const char* string);
    libnative_KBoolean (*IsInstance)(libnative_KNativePtr ref, const libnative_KType* type);

    /* 使用者函数. */
    struct {
        struct {
            struct {
                void (*forIntegers)(libnative_KByte b, libnative_KShort s, libnative_KUInt i, libnative_KLong l);
                void (*forFloats)(libnative_KFloat f, libnative_KDouble d);
                const char* (*strings)(const char* str);
                const char* (*get_globalString)();
                struct {
                    libnative_KType* (*_type)(void);
                    libnative_kref_example_Object (*_instance)();
                    const char* (*get_field)(libnative_kref_example_Object thiz);
                } Object;
                struct {
                    libnative_KType* (*_type)(void);
                    libnative_kref_example_Clazz (*Clazz)();
                    libnative_KULong (*memberFunction)(libnative_kref_example_Clazz thiz, libnative_KInt p);
                } Clazz;
            } example;
        } root;
    } kotlin;
} libnative_ExportedSymbols;
```

这段代码使用匿名的结构声明. 代码 `struct { .. } foo`
在这个匿名结构类型(这个类型没有名称)的外层结构中声明一个域变量.

C 也不支持对象. 人们使用函数指针来模仿对象语义. 函数指针声明为 `RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`.
这样的代码很难阅读, 但在上面的结构中我们可以看到函数指针类型的域变量.

### 运行时函数

上面的代码含义如下. 你有一个 `libnative_ExportedSymbols` 结构, 它定义 Kotlin/Native 和我们的库提供的所有函数.
它大量使用嵌套的匿名结构, 来模拟包. `libnative_` 前缀来自库的名称.

`libnative_ExportedSymbols` 结构包含一些帮助函数:

```c
void (*DisposeStablePointer)(libnative_KNativePtr ptr);
void (*DisposeString)(const char* string);
libnative_KBoolean (*IsInstance)(libnative_KNativePtr ref, const libnative_KType* type);
```

这些函数处理 Kotlin/Native 对象. 调用 `DisposeStablePointer` 可以释放一个 Kotlin 对象,
调用 `DisposeString` 可以释放一个 Kotlin 字符串, 字符串在 C 中对应为 `char*` 类型.
可以使用 `IsInstance` 函数来检查一个 Kotlin 类型或一个 `libnative_KNativePtr` 是不是另一个类型的实例.
实际上生成哪些操作, 依赖于具体的使用场景.

Kotlin/Native 有垃圾收集功能, 但它不能帮助我们在 C 语言中处理 Kotlin 对象.
Kotlin/Native 拥有与 Objective-C 和 Swift 交互的能力, 并与它们的引用计数集成.
[与 Objective-C 代码交互](native-objc-interop.md) 文档中包含这些问题的更多详细信息.
此外还可以参考教程 [使用 Kotlin/Native 开发 Apple Framework](apple-framework.md).

### 你的库函数

我们来看一下 `kotlin.root.example` 域, 它通过一个 `kotlin.root.` 前缀来模拟我们 Kotlin 代码的包结构.

有一个 `kotlin.root.example.Clazz` 域表达 Kotlin 中的 `Clazz`.
通过 `memberFunction` 域可以访问 `Clazz#memberFunction`.
唯一的区别是 `memberFunction` 的第一个参数接受一个 `this` 引用.
C 语言不支持对象, 所以需要明确的传递一个 `this` 指针.

在 `Clazz` 域中存在一个构造器 (也就是 `kotlin.root.example.Clazz.Clazz`),
它是构造器函数, 用来创建 `Clazz` 的实例.

Kotlin `object Object` 可以通过 `kotlin.root.example.Object` 访问.
有一个 `_instance` 函数可以得到对象的唯一实例.

属性被翻译为函数. `get_` 和 `set_` 前缀分别用来命名 getter 和 setter 函数.
比如, Kotlin 中的只读属性 `globalString` 在 C 中被转换为一个 `get_globalString` 函数.

全局函数 `forInts`, `forFloats`, 或 `strings` 被转换为 `kotlin.root.example` 匿名结构中的函数指针.

### 入口点

你可以看到 API 是如何创建的. 首先, 你需要初始化 `libnative_ExportedSymbols` 结构.
关于这一点, 我们来看看 `libnative_api.h` 的最后部分:

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

通过函数 `libnative_symbols` 你可以打开从原生代码访问 Kotlin/Native 库的道路.
这就是你将要使用的入口点. 库名称被用作函数名称的前缀.

> Kotlin/Native 对象引用不支持多线程访问.
> 可能需要对每个线程分别保存返回的 `libnative_ExportedSymbols*` 指针.
>
{style="note"}

## 在 C 中使用生成的头文件 {id="use-generated-headers-from-c"}

在 C 中的使用非常直接, 并没有任何复杂之处. 创建一个 `main.c` 文件, 包含以下代码:

```c
#include "libnative_api.h"
#include "stdio.h"

int main(int argc, char** argv) {
    // 获得引用, 用来调用 Kotlin/Native 函数
    libnative_ExportedSymbols* lib = libnative_symbols();

    lib->kotlin.root.example.forIntegers(1, 2, 3, 4);
    lib->kotlin.root.example.forFloats(1.0f, 2.0);

    // 使用 C 和 Kotlin/Native 字符串
    const char* str = "Hello from Native!";
    const char* response = lib->kotlin.root.example.strings(str);
    printf("in: %s\nout:%s\n", str, response);
    lib->DisposeString(response);

    // 创建 Kotlin 对象实例
    libnative_kref_example_Clazz newInstance = lib->kotlin.root.example.Clazz.Clazz();
    long x = lib->kotlin.root.example.Clazz.memberFunction(newInstance, 42);
    lib->DisposeStablePointer(newInstance.pinned);

    printf("DemoClazz returned %ld\n", x);

    return 0;
}
```

## 在 Linux 和 macOS 上编译并运行示例程序 {id="compile-and-run-the-example-on-linux-and-macos"}

在 macOS 10.13 的 Xcode 中, 使用以下命令, 编译 C 代码, 并链接到动态库:

```bash
clang main.c libnative.dylib
```

在 Linux 上可以使用类似的命令:
```bash
gcc main.c libnative.so
```

编译器会生成一个可执行文件, 名为 `a.out`. 运行它, 看看从 C 库执行 Kotlin 代码实际效果.
在 Linux 上, 你将需要将 `.` 包含到 `LD_LIBRARY_PATH`, 使应用程序能够从当前文件夹加载 `libnative.so` 库.

## 在 Windows 上编译并运行示例程序 {id="compile-and-run-the-example-on-windows"}

首先, 你需要安装 Microsoft Visual C++ 编译器, 要支持 x64_64 编译目标.
最简单的方法是, 在 Windows 机器上安装一份 Microsoft Visual Studio.

在这个示例中, 你将使用 `x64 Native Tools Command Prompt <VERSION>` 控制台.
在开始菜单中你会看到打开控制台的快捷方式. 它是随 Microsoft Visual Studio 一起安装的.

在 Windows 上, 要装载动态库, 可以通过生成的静态的库包装器, 或者通过手动代码来装载,
后一种方法使用 [LoadLibrary](https://docs.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya)
或类似的 Win32API 函数.
我们使用第一种方法, 为 `libnative.dll` 生成静态的库包装器, 具体方法如下.

调用工具链中的 `lib.exe` 来生成静态的库包装器 `libnative.lib`, 它负责在代码中自动装载 DLL:
```bash
lib /def:libnative_symbols.def /out:libnative.lib
```

现在你可以将我们的 `main.c` 编译为可执行文件. 在构建命令中包含生成的 `libnative.lib`, 然后开始编译:
```bash
cl.exe main.c libnative.lib
```

这个命令会输出 `main.exe` 文件, 这就是你最终可以运行的文件.

## 下一步做什么?

动态库是从既有程序中使用 Kotlin 代码的主要方式.
使用动态库, 你可以在很多平台和语言上共用你的代码,
包括 JVM, Python, iOS, Android, 等等.

Kotlin/Native 还与 Objective-C 和 Swift 紧密集成.
详情请参见 [使用 Kotlin/Native 开发 Apple Framework](apple-framework.md) 教程.
