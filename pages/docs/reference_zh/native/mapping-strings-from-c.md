---
type: doc
layout: reference
category:
title: "教程 - 映射 C 语言的字符串"
---

# 教程 - 映射 C 语言的字符串

本页面最终更新: 2022/02/16

这是本系列的最后 1 篇教程.
第 1 篇教程是 [映射 C 语言的基本数据类型](mapping-primitive-data-types-from-c.html).
此外还有教程 [映射 C 语言的结构(Struct)和联合(Union)类型](mapping-struct-union-types-from-c.html)
和教程 [映射 C 语言的函数指针(Function Pointer)](mapping-function-pointers-from-c.html).

本教程中, 你会看到在 Kotlin/Native 中如何处理 C 字符串.
你将学习如何:
- [将 Kotlin 字符串传递到 C](#pass-kotlin-string-to-c)
- [在 Kotlin 中读取 C 字符串](#read-c-strings-in-kotlin)
- [将 C 字符串的字节接收到 Kotlin 字符串中](#receive-c-string-bytes-from-kotlin)

## 使用 C 字符串

C 语言中没有专门的字符串类型. 开发者需要根据方法签名或者文档来判断一个 `char *` 是不是一个 C 字符串.
C 语言中的字符串使用 null 作为终止符, 末尾 0 字符 `\0` 添加到字节序列之后, 表示字符串结束.
通常, 使用 [UTF-8 编码的字符串](https://en.wikipedia.org/wiki/UTF-8).
UTF-8 编码使用变宽字符, 而且向后兼容 [ASCII](https://en.wikipedia.org/wiki/ASCII) 编码.
Kotlin/Native 默认使用 UTF-8 字符编码.

要理解 Kotlin 和 C 之间的映射, 最好的方法是试验一段小示例程序.
为此我们创建一个小的库头文件.
首先, 创建 一个 `lib.h` 文件, 包含以下使用 C 字符串的函数声明:

```c
#ifndef LIB2_H_INCLUDED
#define LIB2_H_INCLUDED

void pass_string(char* str);
char* return_string();
int copy_string(char* str, int size);

#endif
```  

在这个示例中, 你可以看到 C 语言中传递或接收一个字符串的最常见方式. 
注意 `return_string` 的返回值. 通常, 最好确保你使用了正确的 `free(..)` 函数调用来释放返回的 `char*`.

Kotlin/Native 带有 `cinterop` 工具; 这个工具会生成 C 语言和 Kotlin 之间的绑定.
它使用一个 `.def` 文件来指定一个要导入的 C 库.
详情请参见教程 [与 C 库交互](native-c-interop.html).
试验 C API 映射的最快方法是, 将所有 C 声明都写在 `interop.def` 文件中, 完全不需要创建任何 `.h` 或 `.c` 文件.
然后将 C 声明放在一个 `interop.def` 文件中, 在专门的 `---` 分割行之后:

```c 
headers = lib.h
---

void pass_string(char* str) {
}

char* return_string() {
  return "C stirng";
}

int copy_string(char* str, int size) {
  *str++ = 'C';
  *str++ = ' ';
  *str++ = 'K';
  *str++ = '/';
  *str++ = 'N';
  *str++ = 0;
  return 0;
}

``` 

这个 `interop.def` 文件已经足以编译和运行应用程序, 或在 IDE 中打开它.
现在来创建项目文件, 在 [IntelliJ IDEA](https://jetbrains.com/idea)中打开项目, 并运行它.

## 查看为 C 库生成的 Kotlin API

尽管可以直接使用命令行, 或者通过脚本文件(比如 `.sh` 或 `.bat` 文件), 但这种方法不适合于包含几百个文件和库的大项目.
更好的方法是使用带有构建系统的 Kotlin/Native 编译器,
因为它会帮助你下载并缓存 Kotlin/Native 编译器二进制文件, 传递依赖的库, 并运行编译器和测试.
Kotlin/Native 能够通过 [kotlin-multiplatform](../mpp/mpp-discover-project.html#multiplatform-plugin) plugin
使用 [Gradle](https://gradle.org) 构建系统.

关于如何使用 Gradle 设置 IDE 兼容的项目, 请参见教程 [一个基本的 Kotlin/Native 应用程序](native-gradle.html).
如果你想要寻找具体的步骤指南, 来开始一个新的 Kotlin/Native 项目并在 IntelliJ IDEA 中打开它, 请先阅读这篇教程.
在本教程中, 我们关注更高级的 C 交互功能, 包括使用 Kotlin/Native,
以及使用 Gradle 的 [跨平台](../mpp/mpp-discover-project.html#multiplatform-plugin) 构建.

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
请查看 [kotlin-multiplatform](../mpp/mpp-discover-project.html#multiplatform-plugin) plugin 文档,
学习配置它的各种方法.

创建一个 `src/nativeMain/kotlin/hello.kt` 桩(stub)文件, 内容如下,
看看 C 字符串声明在 Kotlin 中会成为什么:

```kotlin
import interop.*

fun main() {
  println("Hello Kotlin/Native!")
  
  pass_string(/*fix me*/)
  val useMe = return_string()
  val useMe2 = copy_string(/*fix me*/)
}
```

现在你可以 [在 IntelliJ IDEA 中打开项目](native-get-started.html), 看看如何修正示例项目.
在这个过程中, 我们来看看 C 字符串如何映射为 Kotlin/Native 声明.

## 字符串在 Kotlin 中的映射结果

通过 IntelliJ IDEA 的 __Go to | Declaration__ 的帮助,
或查看编译器错误, 你可以看到为 C 函数生成的 API:

```kotlin
fun pass_string(str: CValuesRef<ByteVar /* = ByteVarOf<Byte> */>?)
fun return_string(): CPointer<ByteVar /* = ByteVarOf<Byte> */>?
fun copy_string(str: CValuesRef<ByteVar /* = ByteVarOf<Byte> */>?, size: Int): Int
```

这些声明看起来很清楚. 所有的 `char *` 指针类型, 对于参数会转换为 `str: CValuesRef<ByteVar>?`,
对于返回类型会转换为 `CPointer<ByteVar>?`.
Kotlin 将 `char` 类型转换为 `kotlin.Byte` 类型, 因为它通常是 8 bit 有符号值.

在生成的 Kotlin 声明中, 你可以看到 `str` 表达为 `CValuesRef<ByteVar/>?`.
这个类型是可为 null 的, 你可以直接传递 Kotlin 的 `null` 作为参数值. 

## 将 Kotlin 字符串传递到 C

下面来试验在 Kotlin 程序中使用 API. 首先调用 `pass_string`:

```kotlin
fun passStringToC() {
  val str = "this is a Kotlin String"
  pass_string(str.cstr)
}
```

向 C 传递一个 Kotlin 字符串是很简单的, 感谢 Kotlin 的
`String.cstr` [扩展属性](../extensions.html#extension-properties) 的帮助.
此外还有 `String.wcstr`, 需要 UTF-16 宽字符的情况可以使用.

## 在 Kotlin 中读取 C 字符串

下面来接收从 `return_string` 函数返回的一个 `char *`, 并将它转换为一个 Kotlin 字符串.
在 Kotlin 中需要编写以下代码:

```kotlin
fun passStringToC() {
  val stringFromC = return_string()?.toKString()
  
  println("Returned from C: $stringFromC")
}
``` 

上面这段代码使用 `toKString()` 扩展函数. 请不要与 `toString()` 函数混淆.
Kotlin 中 `toKString()` 有 2 个重载版本扩展函数:

```kotlin
fun CPointer<ByteVar>.toKString(): String
fun CPointer<ShortVar>.toKString(): String
```

第 1 个扩展函数接收一个 `char *`, 将它作为 UTF-8 字符串, 转换为 Kotlin 字符串.
第 2 个扩展函数对 UTF-16 宽字符串执行同样的操作.

## 在 Kotlin 接收 C 字符串的字节

下面我们要求一个 C 函数向一个指定的缓冲区写入一个 C 字符串.
函数名为 `copy_string`. 它接受一个指针参数, 表示字符写入的位置, 以及允许的缓冲区大小参数.
函数返回某个值表示它成功还是失败.
我们假设 `0` 表示它成功, 并且假设提供的缓冲区足够大:

```kotlin
fun sendString() {
  val buf = ByteArray(255)
  buf.usePinned { pinned ->
    if (copy_string(pinned.addressOf(0), buf.size - 1) != 0) {
      throw Error("Failed to read string from C")
    }
  }

  val copiedStringFromC = buf.stringFromUtf8()
  println("Message from C: $copiedStringFromC")
}

``` 

首先, 你需要有一个 native 指针传递给 C 函数. 使用 `usePinned` 扩展函数, 临时固定住字节数组的 native 内存地址.
C 函数向这个字节数组填充数据.
使用另一个扩展函数 `ByteArray.stringFromUtf8()`, 将字节数组转换为一个 Kotlin `String`, 假设使用 UTF-8 编码. 

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
import kotlinx.cinterop.*

fun main() {
  println("Hello Kotlin/Native!")

  val str = "this is a Kotlin String"
  pass_string(str.cstr)

  val useMe = return_string()?.toKString() ?: error("null pointer returned")
  println(useMe)

  val copyFromC = ByteArray(255).usePinned { pinned ->

    val useMe2 = copy_string(pinned.addressOf(0), pinned.get().size - 1)
    if (useMe2 != 0) throw Error("Failed to read string from C")
    pinned.get().stringFromUtf8()
  }

  println(copyFromC)
}
```

## 下一步

阅读以下教程, 继续探索更多 C 语言数据类型, 以及它们在 Kotlin/Native 中的表达:
- [映射 C 语言的基本数据类型](mapping-primitive-data-types-from-c.html)
- [映射 C 语言的结构(Struct)和联合(Union)类型](mapping-struct-union-types-from-c.html)
- [映射 C 语言的函数指针(Function Pointer)](mapping-function-pointers-from-c.html)

[与 C 代码交互](native-c-interop.html) 文档还讲解了更多的高级使用场景.
