[//]: # (title: 教程 - 映射 C 语言的基本数据类型)

<tldr>
    <p>这是 <strong>Kotlin 与 C 映射</strong> 教程系列的第 1 部分.</p>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>映射 C 语言的基本数据类型</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c.md">映射 C 语言的结构(Struct)和联合(Union)类型</a><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">映射 C 语言的函数指针(Function Pointer)</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">映射 C 语言的字符串</a><br/>
    </p>
</tldr>

> C 库导入是 [实验性功能](components-stability.md#stability-levels-explained).
> cinterop 工具从 C 库生成的所有 Kotlin 声明都应该标注 `@ExperimentalForeignApi` 注解.
>
> Kotlin/Native 自带的原生平台库 (例如 Foundation, UIKit, 和 POSIX),
> 只对一部分 API 需要使用者明确同意(Opt-in).
>
{style="warning"}

我们来看看在 Kotlin/Native 中可以访问 C 的哪些数据类型, 以及反过来,
并研究 Kotlin/Native 和 [跨平台](gradle-configure-project.md#targeting-multiple-platforms)
Gradle 构建的与 C 互操作相关的高级使用场景.

在本教程中, 你将会:

* [学习 C 语言中的数据类型](#types-in-c-language)
* [创建一个 C 库, 在库的导出(export)中使用这些类型](#create-a-c-library)
* [查看为 C 库生成的 Kotlin API](#inspect-generated-kotlin-apis-for-a-c-library)

你可以通过命令行生成 Kotlin 库, 可以直接使用命令行, 也可以使用脚本文件(比如 `.sh` 或 `.bat` 文件).
但是, 这种方法不适合于包含几百个文件和库的大项目.
使用构建系统可以简化构建过程, 它能够下载并缓存 Kotlin/Native 编译器二进制文件, 传递依赖的库, 并运行编译器和测试.
Kotlin/Native 能够通过 [Kotlin Multiplatform plugin](gradle-configure-project.md#targeting-multiple-platforms)
使用 [Gradle](https://gradle.org) 构建系统.

## C 语言中的数据类型 {id="types-in-c-language"}

C 程序语言中有以下 [数据类型](https://en.wikipedia.org/wiki/C_data_types):

* 基本类型: `char, int, float, double`, 以及修饰符 `signed, unsigned, short, long`
* 结构(Structure), 联合(Union), 数组(Array)
* 指针(Pointer)
* 函数指针(Function Pointer)

还有更加具体的类型:

* Boolean 类型 (由 [C99](https://en.wikipedia.org/wiki/C99) 定义)
* `size_t` 和 `ptrdiff_t` (以及 `ssize_t`)
* 定宽整数类型, 比如 `int32_t` 或 `uint64_t` (由 [C99](https://en.wikipedia.org/wiki/C99) 定义)

C 语言中还有以下类型修饰符: `const`, `volatile`, `restrict`, `atomic`.

我们来看看在 Kotlin 中可以使用哪些 C 数据类型.

## 创建一个 C 库 {id="create-a-c-library"}

在这个教程中, 你不会创建 `lib.c` 源代码文件, 只有在你想要编译和运行你的 C 库时才需要创建这个文件.
对于我们的教程, 你只需要 `.h` 头文件, 运行 [cinterop 工具](native-c-interop.md) 会需要它.

cinterop 工具为每组 `.h` 文件生成一个 Kotlin/Native 库 (一个 `.klib` 文件).
生成的库会帮助将 Kotlin/Native 中的调用桥接到 C.
它包含与 `.h` 文件中的定义对应的 Kotlin 声明.

要创建一个 C 库, 请执行以下步骤:

1. 为你未来的项目创建一个空文件夹.
2. 在文件夹中, 创建一个 `lib.h` 文件, 内容如下, 看看 C 函数如何映射到 Kotlin:

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED

   void ints(char c, short d, int e, long f);
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f);
   void doubles(float a, double b);

   #endif
   ```

   这个文件没有 `extern "C"` 代码段, 这个示例不需要这部分, 但如果你使用 C++ 和重载(overloaded)函数, 那么可能会需要.
   更多详情请参见这个 [Stackoverflow 讨论](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c).

3. 创建 `lib.def` [定义文件](native-definition-file.md), 内容如下:

   ```c
   headers = lib.h
   ```

4. 如果在 cinterop 工具生成的代码中包含宏或其他 C 定义, 这样可以很有用.
   通过这种方式, 方法体也会被编译并完全包含在二进制文件中.
   使用这个功能, 你可以创建一个可运行的示例, 而不需要使用 C 编译器.

   要实现这一点, 请为来自 `lib.h` 文件的 C 函数添加实现, 并将这些函数放在一个新的 `interop.def` 文件的 `---` 分隔符之后:

   ```c

   ---

   void ints(char c, short d, int e, long f) { }
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f) { }
   void doubles(float a, double b) { }
   ```

这个 `interop.def` 文件提供了所有需要的内容, 可以用来编译, 运行, 或在 IDE 中打开应用程序.

## 创建 Kotlin/Native 项目 {id="create-a-kotlin-native-project"}

> 关于如何创建一个新的 Kotlin/Native 项目, 并在 IntelliJ IDEA 中打开项目,
> 详细的步骤和指示, 请参见 [Get started with Kotlin/Native](native-get-started.md#using-gradle) 教程.
>
{style="tip"}

要创建项目文件, 请执行以下步骤:

1. 在你的项目文件夹中, 创建一个 `build.gradle(.kts)` Gradle 构建文件, 内容如下:

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
        macosArm64("native") {    // 用于 Apple Silicon 的 macOS 环境
        // macosX64("native") {   // 用于 x86_64 平台的 macOS 环境
        // linuxArm64("native") { // 用于 ARM64 平台的 Linux 环境
        // linuxX64("native") {   // 用于 x86_64 平台的 Linux 环境
        // mingwX64("native") {   // 用于 Windows 环境
            val main by compilations.getting
            val interop by main.cinterops.creating

            binaries {
                executable()
            }
        }
    }

    tasks.wrapper {
        gradleVersion = "%gradleVersion%"
        distributionType = Wrapper.DistributionType.BIN
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
        macosArm64("native") {    // 用于 Apple Silicon 的 macOS 环境
        // macosX64("native") {   // 用于 x86_64 平台的 macOS 环境
        // linuxArm64("native") { // 用于 ARM64 平台的 Linux 环境
        // linuxX64("native") {   // 用于 x86_64 平台的 Linux 环境
        // mingwX64("native") {   // 用于 Windows 环境
            compilations.main.cinterops {
                interop
            }

            binaries {
                executable()
            }
        }
    }

    wrapper {
        gradleVersion = '%gradleVersion%'
        distributionType = 'BIN'
    }
    ```

    </tab>
    </tabs>

   项目文件将 C interop 配置为一个额外的构建步骤.
   请查看 [Multiplatform Gradle DSL 参考文档](multiplatform-dsl-reference.md), 学习它的各种配置方法.

2. 将你的 `interop.def`, `lib.h`, 和 `lib.def` 文件移动到 `src/nativeInterop/cinterop` 目录.
3. 创建一个 `src/nativeMain/kotlin` 目录.
   所有的源代码文件应该放在这里, 遵循 Gradle 的建议, 使用默认约定而不是明确配置.

   默认情况下, 来自 C 的所有符号将被导入到 `interop` 包中.

4. 在 `src/nativeMain/kotlin` 目录中, 创建一个 `hello.kt` 桩(stub)文件, 内容如下:

    ```kotlin
    import interop.*
    import kotlinx.cinterop.ExperimentalForeignApi

    @OptIn(ExperimentalForeignApi::class)
    fun main() {
        println("Hello Kotlin/Native!")
      
        ints(/* fix me*/)
        uints(/* fix me*/)
        doubles(/* fix me*/)
    }
    ```

在你了解 C 的基本类型声明在 Kotlin 中会变成什么样之后, 再来完成这些代码.

## 查看为 C 库生成的 Kotlin API {id="inspect-generated-kotlin-apis-for-a-c-library"}

我们来看看 C 的基本类型如何映射到 Kotlin/Native 中, 并相应的更新示例项目.

通过 IntelliJ IDEA 的 [Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)
命令 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>),
可以跳转到为 C 函数生成的 API:

```kotlin
fun ints(c: kotlin.Byte, d: kotlin.Short, e: kotlin.Int, f: kotlin.Long)
fun uints(c: kotlin.UByte, d: kotlin.UShort, e: kotlin.UInt, f: kotlin.ULong)
fun doubles(a: kotlin.Float, b: kotlin.Double)
```

C 类型直接映射为 Kotlin 类型, `char` 类型例外, 它映射为 `kotlin.Byte`, 因为它通常是 8 bit 有符号值:

| C  类型              | Kotlin 类型     |
|--------------------|---------------|
| char               | kotlin.Byte   |
| unsigned char      | kotlin.UByte  |
| short              | kotlin.Short  |
| unsigned short     | kotlin.UShort |
| int                | kotlin.Int    |
| unsigned int       | kotlin.UInt   |
| long long          | kotlin.Long   |
| unsigned long long | kotlin.ULong  |
| float              | kotlin.Float  |
| double             | kotlin.Double |

## 更新 Kotlin 代码 {id="update-kotlin-code"}

现在你已经看到了 C 定义, 你可以更新你的 Kotlin 代码.
`hello.kt` 文件中的最终代码大致如下:

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")

    ints(1, 2, 3, 4)
    uints(5u, 6u, 7u, 8u)
    doubles(9.0f, 10.0)
}
```

为了验证是否一切正确, 请 [在你的 IDE 中](native-get-started.md#build-and-run-the-application) 运行 `runDebugExecutableNative` Gradle task,
或使用以下命令, 运行代码:

```bash
./gradlew runDebugExecutableNative
```

## 下一步 {id="next-step"}

在这个教程系列的下一部分, 你将学习在 Kotlin 和 C 之间如何映射结构(Struct)和联合(Union)类型:

**[继续下一部分](mapping-struct-union-types-from-c.md)**

### 参见 {id="see-also"}

更多详情请参见 [与 C 代码交互](native-c-interop.md) 文档, 其中包含更多高级场景.
