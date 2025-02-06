[//]: # (title: 教程 - 使用 Kotlin/Native 开发动态库)

你可以创建动态库, 在既有的程序中使用 Kotlin 代码.
这样就可以在多种平台和语言之间共用代码, 包括 JVM, Python, Android, 等等.

> 对于 iOS 和其他 Apple 目标平台, 我们建议生成 Framework.
> 请参见 [使用 Kotlin/Native 开发 Apple Framework](apple-framework.md) 教程.
>
{style="tip"}

你可以在既有的原生应用程序或库中使用 Kotlin/Native 代码.
要达到这个目的, 你需要将 Kotlin 代码编译为动态库, 格式为 `.so`, `.dylib`, 或 `.dll`.

在本教程中, 你将会:

* [将 Kotlin 代码编译为一个动态库](#create-a-kotlin-library)
* [检查生成的 C 头文件](#generated-header-file)
* [在 C 中使用 Kotlin 动态库](#use-generated-headers-from-c)
* [编译并运行项目](#compile-and-run-the-project)

你可以直接使用命令行来生成 Kotlin 库, 或者通过脚本文件(比如 `.sh` 或 `.bat` 文件).
但是, 这种方法不适合于包含几百个文件和库的大项目.
使用带有构建系统的 Kotlin/Native 编译器可以帮助你下载并缓存 Kotlin/Native 编译器二进制文件, 传递依赖的库,
并运行编译器和测试, 简化构建过程,
Kotlin/Native 能够通过 [Kotlin Multiplatform plugin](gradle-configure-project.md#targeting-multiple-platforms)
使用 [Gradle](https://gradle.org) 构建系统.

下面我们来研究 Kotlin/Native 和 [Kotlin Multiplatform](gradle-configure-project.md#targeting-multiple-platforms)
使用 Gradle 构建时, 与 C 互操作相关的高级用法.

> 如果你使用 Mac 机器, 并希望创建和运行针对 macOS 或其他 Apple 目标平台的应用程序,
> 那么你还需要安装 [Xcode Command Line Tools](https://developer.apple.com/download/),
> 请先启动它, 并接受许可条款.
>
{style="note"}

## 创建一个 Kotlin 库 {id="create-a-kotlin-library"}

Kotlin/Native 编译器能够从 Kotlin 代码生成一个动态库.
一个动态库通常带有一个 `.h` 头文件, 你在 C 语言中使用它来调用编译后的代码.

我们来创建一个 Kotlin 库, 然后在一个 C 程序中使用它.

> 关于如何创建一个新的 Kotlin/Native 项目, 并在 IntelliJ IDEA 中打开它,
> 详细的步骤和指南请参见 [Kotlin/Native 开发入门](native-get-started.md#using-gradle) 教程.
>
{style="tip"}

1. 进入 `src/nativeMain/kotlin` 目录, 并创建 `lib.kt` 文件, 包含以下库内容:

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
       macosArm64("native") {    // Apple Silicon 平台的 macOS
       // macosX64("native") {   // x86_64 平台的 macOS
       // linuxArm64("native") { // ARM64 平台的 Linux
       // linuxX64("native") {   // x86_64 平台的 Linux
       // mingwX64("native") {   // Windows
           binaries {
               sharedLib {
                   baseName = "native"       // macOS 和 Linux
                   // baseName = "libnative" // Windows
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
       macosArm64("native") {    // Apple Silicon 平台的 macOS
       // macosX64("native") {   // x86_64 平台的 macOS
       // linuxArm64("native") { // ARM64 平台的 Linux
       // linuxX64("native") {   // x86_64 平台的 Linux
       // mingwX64("native") {   // Windows
           binaries {
               sharedLib {
                   baseName = "native"       // macOS 和 Linux
                   // baseName = "libnative" // Windows
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

   * `binaries {}` 代码块配置项目, 生成一个动态库或共用库.
   * `libnative` 用作库名称, 以及生成的头文件名称前缀. 它还是头文件中所有声明的前缀.

3. 在 IDE 中运行 `linkDebugSharedNative` Gradle task, 或在你的终端中使用以下控制台命令, 来构建库:

   ```bash
   ./gradlew linkDebugSharedNative
   ```

构建会在 `build/bin/native/debugShared` 目录中生成库, 包含以下文件:

* macOS: `libnative_api.h` 和 `libnative.dylib`
* Linux: `libnative_api.h` 和 `libnative.so`
* Windows: `libnative_api.h`, `libnative.def`, 和 `libnative.dll`

> 你也可以使用 `linkNative` Gradle task, 同时生成库的 `debug` 和 `release` 变体.
>
{style="tip"}

Kotlin/Native 编译器对所有平台生成 `.h` 文件时, 使用相同的规则.
我们来看看 Kotlin 库的 C API.

## 生成的头文件 {id="generated-header-file"}

我们来看看 Kotlin/Native 声明如何映射为 C 函数.

在 `build/bin/native/debugShared` 目录中, 打开 `libnative_api.h` 头文件.
第一部分包含标准的 C/C++ 代码头部和尾部:

```c
#ifndef KONAN_LIBNATIVE_H
#define KONAN_LIBNATIVE_H
#ifdef __cplusplus
extern "C" {
#endif

/// 生成的代码的其它部分

#ifdef __cplusplus
}  /* extern "C" */
#endif
#endif  /* KONAN_LIBNATIVE_H */
```

在以上内容之后, `libnative_api.h` 一个代码块, 其中是共通的类型定义:

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
typedef float __attribute__ ((__vector_size__ (16))) libnative_KVector128;
typedef void*              libnative_KNativePtr;
```

在创建的 `libnative_api.h` 文件中, Kotlin 对所有的声明使用 `libnative_` 前缀.
下面是类型映射的完整列表:

| Kotlin 定义              | C 类型                                          |
|------------------------|-----------------------------------------------|
| `libnative_KBoolean`   | `bool` 或 `_Bool`                              |
| `libnative_KChar`      | `unsigned short`                              |
| `libnative_KByte`      | `signed char`                                 |
| `libnative_KShort`     | `short`                                       |
| `libnative_KInt`       | `int`                                         |
| `libnative_KLong`      | `long long`                                   |
| `libnative_KUByte`     | `unsigned char`                               |
| `libnative_KUShort`    | `unsigned short`                              |
| `libnative_KUInt`      | `unsigned int`                                |
| `libnative_KULong`     | `unsigned long long`                          |
| `libnative_KFloat`     | `float`                                       |
| `libnative_KDouble`    | `double`                                      |
| `libnative_KVector128` | `float __attribute__ ((__vector_size__ (16))` |
| `libnative_KNativePtr` | `void*`                                       |

`libnative_api.h` 文件的定义部分, 显示了 Kotlin 基本类型如何映射为 C 基本类型.
Kotlin/Native 编译器会为每个库自动生成这些条目.
反过来的对应关系请参见 [映射 C 语言的基本数据类型](mapping-primitive-data-types-from-c.md) 教程.

在自动生成的类型定义之后, 你会看到你的库中使用的单独的类型定义:

```c
struct libnative_KType;
typedef struct libnative_KType libnative_KType;

/// 自动生成的类型定义

typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Object;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Clazz;
```

在 C 语言中, `typedef struct { ... } TYPE_NAME` 语法会声明一个结构(structure).

> 关于这个模式的详细解释, 请参见 [Stackoverflow 的这个讨论串](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions).
>
{style="tip"}

从这些定义你可以看到, Kotlin 类型使用相同的模式进行映射:
`Object` 映射为 `libnative_kref_example_Object`, `Clazz` 映射为 `libnative_kref_example_Clazz`.
所有的结构都仅仅包含一个指针类型的 `pinned` 域变量.
域变量类型 `libnative_KNativePtr` 在头文件的前面部分中定义为 `void*`.

由于 C 不支持命名空间(namespace), 因此 Kotlin/Native 编译器生成很长的名称, 以免与既有的原生项目中的其它符号发生名称冲突.

### 服务的运行期函数 {id="service-runtime-functions"}

`libnative_ExportedSymbols` 结构定义 Kotlin/Native 和你的库提供的所有函数.
它大量使用嵌套的匿名结构, 来模仿包.
`libnative_` 前缀来自库名称.

`libnative_ExportedSymbols` 在头文件中包含几个辅助函数:

```c
typedef struct {
  /* 服务函数. */
  void (*DisposeStablePointer)(libnative_KNativePtr ptr);
  void (*DisposeString)(const char* string);
```

这些函数处理 Kotlin/Native 对象.
可以调用 `DisposeStablePointer` 来释放 Kotlin 对象的引用,
调用 `DisposeString` 来释放 Kotlin 字符串, C 中的类型为 `char*`.

`libnative_api.h` 文件的下一部分包含运行期函数的结构声明:

```c
libnative_KBoolean (*IsInstance)(libnative_KNativePtr ref, const libnative_KType* type);
libnative_KBoolean (*IsInstance)(libnative_KNativePtr ref, const libnative_KType* type);
libnative_kref_kotlin_Byte (*createNullableByte)(libnative_KByte);
libnative_KByte (*getNonNullValueOfByte)(libnative_kref_kotlin_Byte);
libnative_kref_kotlin_Short (*createNullableShort)(libnative_KShort);
libnative_KShort (*getNonNullValueOfShort)(libnative_kref_kotlin_Short);
libnative_kref_kotlin_Int (*createNullableInt)(libnative_KInt);
libnative_KInt (*getNonNullValueOfInt)(libnative_kref_kotlin_Int);
libnative_kref_kotlin_Long (*createNullableLong)(libnative_KLong);
libnative_KLong (*getNonNullValueOfLong)(libnative_kref_kotlin_Long);
libnative_kref_kotlin_Float (*createNullableFloat)(libnative_KFloat);
libnative_KFloat (*getNonNullValueOfFloat)(libnative_kref_kotlin_Float);
libnative_kref_kotlin_Double (*createNullableDouble)(libnative_KDouble);
libnative_KDouble (*getNonNullValueOfDouble)(libnative_kref_kotlin_Double);
libnative_kref_kotlin_Char (*createNullableChar)(libnative_KChar);
libnative_KChar (*getNonNullValueOfChar)(libnative_kref_kotlin_Char);
libnative_kref_kotlin_Boolean (*createNullableBoolean)(libnative_KBoolean);
libnative_KBoolean (*getNonNullValueOfBoolean)(libnative_kref_kotlin_Boolean);
libnative_kref_kotlin_Unit (*createNullableUnit)(void);
libnative_kref_kotlin_UByte (*createNullableUByte)(libnative_KUByte);
libnative_KUByte (*getNonNullValueOfUByte)(libnative_kref_kotlin_UByte);
libnative_kref_kotlin_UShort (*createNullableUShort)(libnative_KUShort);
libnative_KUShort (*getNonNullValueOfUShort)(libnative_kref_kotlin_UShort);
libnative_kref_kotlin_UInt (*createNullableUInt)(libnative_KUInt);
libnative_KUInt (*getNonNullValueOfUInt)(libnative_kref_kotlin_UInt);
libnative_kref_kotlin_ULong (*createNullableULong)(libnative_KULong);
libnative_KULong (*getNonNullValueOfULong)(libnative_kref_kotlin_ULong);
```

你可以使用 `IsInstance` 函数来检查一个 Kotlin 对象 (通过它的 `.pinned` 指针来引用) 是不是一个类型的实例.
实际上生成哪些操作, 依赖于具体的使用场景.

> Kotlin/Native 有它自己的垃圾收集器, 但它不管理从 C 访问的 Kotlin 对象.
> 但是, Kotlin/Native 提供了 [与 Swift/Objective-C 代码的交互能力](native-objc-interop.md),
> 而且垃圾收集器 [与 Swift/Objective-C ARC 集成](native-arc-integration.md).
>
{style="tip"}

### 你的库函数 {id="your-library-functions"}

Let's take a look at the separate structure declarations used in your library. The `libnative_kref_example` field mimics
the package structure of your Kotlin code with a `libnative_kref.` prefix:

```c
typedef struct {
  /* 使用者函数. */
  struct {
    struct {
      struct {
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
        const char* (*get_globalString)();
        void (*forFloats)(libnative_KFloat f, libnative_KDouble d);
        void (*forIntegers)(libnative_KByte b, libnative_KShort s, libnative_KUInt i, libnative_KLong l);
        const char* (*strings)(const char* str);
      } example;
    } root;
  } kotlin;
} libnative_ExportedSymbols;
```

这段代码使用匿名的结构声明. 其中, `struct { .. } foo` 在这个匿名结构类型(它没有名称)的外层结构中声明一个域变量.

由于 C 不支持对象, 因此使用函数指针来模仿对象语义.
函数指针声明为 `RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`.

`libnative_kref_example_Clazz` 域表达 Kotlin 中的 `Clazz`.
通过 `memberFunction` 域可以访问 `libnative_KULong`.
唯一的区别是 `memberFunction` 的第一个参数接受一个 `thiz` 引用.
由于 C 不支持对象, 所以要明确的传递一个 `thiz` 指针.

在 `Clazz` 域中存在一个构造器 (也就是 `libnative_kref_example_Clazz_Clazz`),
它充当构造器函数, 用来创建 `Clazz` 的实例.

Kotlin `object Object` 可以通过 `libnative_kref_example_Object` 访问.
`_instance` 函数可以获取对象的唯一实例.

属性被翻译为函数. `get_` 和 `set_` 前缀分别用来命名 getter 和 setter 函数.
例如, Kotlin 中的只读属性 `globalString` 在 C 中被转换为一个 `get_globalString` 函数.

全局函数 `forFloats`, `forIntegers`, 和 `strings` 被转换为 `libnative_kref_example` 匿名结构中的函数指针.

### 入口点 {id="entry-point"}

现在你知道了 API 是如何创建的, 首先需要初始化 `libnative_ExportedSymbols` 结构.
我们下面来看看 `libnative_api.h` 的最后部分:

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

通过函数 `libnative_symbols` 你可以打开从原生代码访问 Kotlin/Native 库的道路.
这就是访问库的入口点. 库名称被用作函数名称的前缀.

> 可能需要对每个线程分别保存返回的 `libnative_ExportedSymbols*` 指针.
>
{style="note"}

## 在 C 中使用生成的头文件 {id="use-generated-headers-from-c"}

在 C 中的使用生成的头文件非常直接.
在库目录中, 创建 `main.c` 文件, 包含以下代码:

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

## 编译并运行项目 {id="compile-and-run-the-project"}

### 在 macOS 平台 {id="on-macos"}

要编译 C 代码, 并链接到动态库, 请进入库目录, 并运行以下命令:

```bash
clang main.c libnative.dylib
```

编译器会生成可执行文件, 名为 `a.out`. 运行它, 就可以执行 C 库中的 Kotlin 代码.

### 在 Linux 平台 {id="on-linux"}

要编译 C 代码, 并链接到动态库, 请进入库目录, 并运行以下命令:

```bash
gcc main.c libnative.so
```

编译器会生成一个可执行文件, 名为 `a.out`. 运行它, 就可以执行 C 库中的 Kotlin 代码.
在 Linux 上, 你需要将 `.` 包含到 `LD_LIBRARY_PATH`, 使应用程序能够从当前文件夹加载 `libnative.so` 库.

### 在 Windows 平台 {id="on-windows"}

首先, 你需要安装支持 x64_64 目标平台的 Microsoft Visual C++ 编译器.

最简单的方法是, 在 Windows 机器上安装一份 Microsoft Visual Studio.
安装过程中, 请选择开发 C++ 所需要的组件, 例如, **Desktop development with C++**.

在 Windows 上, 要装载动态库, 你可以生成的静态的库包装器,
也可以通过 [LoadLibrary](https://learn.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya)
或类似的 Win32API 函数来手动装载.

我们使用第一种方法, 为 `libnative.dll` 生成静态的库包装器:

1. 调用工具链中的 `lib.exe` 来生成静态的库包装器 `libnative.lib`, 它负责在代码中自动装载 DLL:

   ```bash
   lib /def:libnative.def /out:libnative.lib
   ```

2. 将你的 `main.c` 编译为可执行文件. 在构建命令中包含生成的 `libnative.lib`, 然后开始编译:

   ```bash
   cl.exe main.c libnative.lib
   ```

   这个命令会输出 `main.exe` 文件, 这就是你可以运行的文件.

## 下一步做什么 {id="what-s-next"}

* 学习 [与 Swift/Objective-C 的互操作性](native-objc-interop.md)
* 阅读 [使用 Kotlin/Native 开发 Apple Framework 教程](apple-framework.md)
