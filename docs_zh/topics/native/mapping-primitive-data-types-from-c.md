---
type: doc
layout: reference
category:
title: "教程 - 映射 C 语言的基本数据类型"
---

# 教程 - 映射 C 语言的基本数据类型

最终更新: {{ site.data.releases.latestDocDate }}

> C 库导入是 [实验性功能](../components-stability.html#stability-levels-explained).
> `cinterop` 工具从 C 库生成的所有 Kotlin 声明都应该标注 `@ExperimentalForeignApi` 注解.
>
> Kotlin/Native 自带的原生平台库 (例如 Foundation, UIKit, 和 POSIX),
> 只对一部分 API 需要使用者明确同意(Opt-in). 对于这样的情况, 你会在 IDE 中看到警告信息.
{:.warning}

通过本教程, 你将学习 C 数据类型在 Kotlin/Native 中会变成什么类型, 以及反过来. 你将会: 
- 学习 [C 语言中有什么数据类型](#types-in-c-language).
- 创建一个 [小小的 C 库](#example-c-library), 在库的导出(export)中使用这些类型.
- [查看为 C 库生成的 Kotlin API](#inspect-generated-kotlin-apis-for-a-c-library).
- 学习 [Kotlin 中的基本类型](#primitive-types-in-kotlin) 如何映射到 C.

## C 语言中的数据类型

在 C 语言中有些什么数据类型?
我们来看看 Wiki 词条 [C 数据类型](https://en.wikipedia.org/wiki/C_data_types).
C 程序语言中有以下数据类型:
- 基本类型 `char, int, float, double`, 以及修饰符 `signed, unsigned, short, long`
- 结构(Structure), 联合(Union), 数组(Array)
- 指针(Pointer)
- 函数指针(Function Pointer)

还有更加具体的类型:
- boolean 类型 (由 [C99](https://en.wikipedia.org/wiki/C99) 定义)
- `size_t` 和 `ptrdiff_t` (以及 `ssize_t`)
- 定宽整数类型, 比如 `int32_t` 或 `uint64_t` (由 [C99](https://en.wikipedia.org/wiki/C99) 定义)

C 语言中还有以下类型修饰符: `const`, `volatile`, `restruct`, `atomic`.

要了解 C 数据类型在 Kotlin 中会变成什么, 最好的办法是实践一下.

## C 库示例

创建一个 `lib.h` 文件, 看看 C 函数如何映射到 Kotlin:

```c
#ifndef LIB2_H_INCLUDED
#define LIB2_H_INCLUDED

void ints(char c, short d, int e, long f);
void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f);
void doubles(float a, double b);

#endif
```

这个文件缺少了 `extern "C"` 代码段, 这个示例不需要这部分, 但如果你使用 C++ 和重载(overloaded)函数, 那么可能会需要.
Stackoverflow 上的 [C++ 兼容性](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c)
一文介绍了关于这个问题的更多细节.

对每一组 `.h` 文件, 你将使用 Kotlin/Native 的 [`cinterop` 工具](native-c-interop.html) 来生成一个 Kotlin/Native 库, 也就是 `.klib` 文件. 
生成的库会将来自 Kotlin/Native 的调用桥接给 C 代码.
它包含 `.h` 文件中的定义对应的 Kotlin 声明.
只需要一个 `.h` 文件来运行 `cinterop` 工具. 而且你不需要创建一个 `lib.c` 文件, 除非你想要编译并运行这个示例.
更多详情请参见 [与 C 代码交互](native-c-interop.html).
对本教程来说, 创建以下内容的 `lib.def` 文件就够了:

```c
headers = lib.h
```

你可以在 `.def` 文件中直接包含所有的声明, 放在一个 `---` 分隔之后.
要在 `cinterop` 工具生成的代码中包含宏或其他 C 定义, 这种方法可以很有用.
方法体会被编译并完全包含在二进制文件中.
使用这个功能可以产生一个可运行的示例, 而不需要使用 C 编译器.
要实现这一点, 你需要为来自 `lib.h` 文件的  C 函数添加实现, 并将这些函数放在一个 `.def` 文件内.
最后你的 `interop.def` 如下:

```c

---

void ints(char c, short d, int e, long f) { }
void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f) { }
void doubles(float a, double b) { }
```

这个 `interop.def` 文件已经足以编译并运行应用程序, 或在 IDE 中打开它.
现在我们来创建 项目 文件, 在 [IntelliJ IDEA](https://jetbrains.com/idea) 中打开项目, 并运行它. 

## 查看为 C 库生成的 Kotlin API

尽管可以直接使用命令行, 或者通过脚本文件(比如 `.sh` 或 `.bat` 文件)调用命令行,
但这种方法不适合于包含几百个文件和库的大项目.
更好的方法是使用带有构建系统的 Kotlin/Native 编译器,
因为它会帮助你下载并缓存 Kotlin/Native 编译器二进制文件, 传递依赖的库, 并运行编译器和测试.
Kotlin/Native 能够通过
[kotlin-multiplatform](../gradle/gradle-configure-project.html#targeting-multiple-platforms) plugin
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
  linuxX64("native") { // 用于 Linux 环境
  // macosX64("native") { // 用于 x86_64 macOS 环境
  // macosArm64("native") { // 用于 Apple Silicon macOS 环境
  // mingwX64("native") { // 用于 Windows 环境
    val main by compilations.getting
    val interop by main.cinterops.creating
    
    binaries {
      executable()
    }
  }
}

tasks.wrapper {
  gradleVersion = "{{ site.data.releases.gradleVersion }}"
  distributionType = Wrapper.DistributionType.BIN
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
  linuxX64('native') { // 用于 Linux 环境
  // macosX64("native") { // 用于 x86_64 macOS 环境
  // macosArm64("native") { // 用于 Apple Silicon macOS 环境
  // mingwX64('native') { // 用于 Windows 环境
    compilations.main.cinterops {
      interop 
    }
    
    binaries {
      executable()
    }
  }
}

wrapper {
  gradleVersion = '{{ site.data.releases.gradleVersion }}'
  distributionType = 'BIN'
}
```

</div>
</div>

项目文件将 C interop 配置为构建的一个额外步骤.
下面将 `interop.def` 文件移动到 `src/nativeInterop/cinterop` 目录.
Gradle 推荐使用符合约定习惯的文件布局, 而不是使用额外的配置,
比如, 源代码文件应该放在 `src/nativeMain/kotlin` 文件夹中.
默认情况下, 来自 C 的所有符号会被导入到 `interop` 包,
你可能想要在我们的 `.kt` 文件中导入整个包.
请查看 [Multiplatform Gradle DSL 参考文档](../multiplatform/multiplatform-dsl-reference.html),
学习它的各种配置方法.

创建一个 `src/nativeMain/kotlin/hello.kt` 桩(stub)文件, 内容如下,
看看 C 基本数据类型声明在 Kotlin 中会变成什么:

```kotlin
import interop.*

fun main() {
  println("Hello Kotlin/Native!")
  
  ints(/* fix me*/)
  uints(/* fix me*/)
  doubles(/* fix me*/)
}
```

现在你可以 [在 IntelliJ IDEA 中打开项目](native-get-started.html), 看看如何修正示例项目.
在这个过程中, 我们来看看 C 基本数据类型如何映射到 Kotlin/Native.

## 基本数据类型在 Kotlin 中的映射结果

通过 IntelliJ IDEA 的 __Go to | Declaration__ 的帮助,
或查看编译器错误, 你可以看到为 C 函数生成的 API:

```kotlin
fun ints(c: Byte, d: Short, e: Int, f: Long)
fun uints(c: UByte, d: UShort, e: UInt, f: ULong)
fun doubles(a: Float, b: Double)
```

C 类型按照我们期望的方式映射成了 Kotlin 类型, 注意 `char` 类型映射为 `kotlin.Byte`, 
因为它通常是 8 bit 有符号值.

| C  类型              | Kotlin 类型|
|--------------------|--------|
| char               |  kotlin.Byte |
| unsigned char      |  kotlin.UByte |
| short              |  kotlin.Short |
| unsigned short     |  kotlin.UShort |
| int                |  kotlin.Int |
| unsigned int       |  kotlin.UInt |
| long long          |  kotlin.Long |
| unsigned long long |  kotlin.ULong |
| float              |  kotlin.Float |
| double             | kotlin.Double |

## 修正代码

你已经看到了所有的定义, 现在我们来修正代码.
[在 IDE 中](native-get-started.html) 运行 `runDebugExecutableNative` Gradle task,
或使用以下命令来运行代码:

```bash
./gradlew runDebugExecutableNative
```

最终的 `hello.kt` 文件中的代码大致如下:
 
```kotlin
import interop.*

fun main() {
  println("Hello Kotlin/Native!")
  
  ints(1, 2, 3, 4)
  uints(5, 6, 7, 8)
  doubles(9.0f, 10.0)
}
```

## 下一步

阅读以下教程, 继续探索更多复杂的 C 语言数据类型, 以及它们在 Kotlin/Native 中的表达:
- [映射 C 语言的结构(Struct)和联合(Union)类型](mapping-struct-union-types-from-c.html)
- [映射 C 语言的函数指针(Function Pointer)](mapping-function-pointers-from-c.html)
- [映射 C 语言的字符串](mapping-strings-from-c.html)

[与 C 代码交互](native-c-interop.html) 文档还讲解了更多的高级使用场景.
