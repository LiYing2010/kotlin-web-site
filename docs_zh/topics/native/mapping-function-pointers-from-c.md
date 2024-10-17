[//]: # (title: 教程 - 映射 C 语言的函数指针(Function Pointer))

> C 库导入是 [实验性功能](components-stability.md#stability-levels-explained).
> `cinterop` 工具从 C 库生成的所有 Kotlin 声明都应该标注 `@ExperimentalForeignApi` 注解.
>
> Kotlin/Native 自带的原生平台库 (例如 Foundation, UIKit, 和 POSIX),
> 只对一部分 API 需要使用者明确同意(Opt-in). 对于这样的情况, 你会在 IDE 中看到警告信息.
>
{style="warning"}

这是本系列的第 3 篇教程.
第 1 篇教程是 [映射 C 语言的基本数据类型](mapping-primitive-data-types-from-c.md).
此外还有教程 [映射 C 语言的结构(Struct)和联合(Union)类型](mapping-struct-union-types-from-c.md)
和教程 [映射 C 语言的字符串](mapping-strings-from-c.md).

本教程中, 我们将学习如何:
- [将 Kotlin 函数作为 C 函数指针传递](#pass-kotlin-function-as-c-function-pointer)
- [在 Kotlin 中使用 C 函数指针](#use-the-c-function-pointer-from-kotlin)

## 映射来自 C 的函数指针类型

要理解 Kotlin 和 C 之间的映射, 最好的方法是试验一段小示例程序.
声明一个函数, 它接受一个函数指针作为参数, 以及另一个函数, 它返回一个函数指针.

Kotlin/Native 带有 `cinterop` 工具; 这个工具会生成 C 语言和 Kotlin 之间的绑定.
它使用一个 `.def` 文件来指定一个要导入的 C 库.
详情请参见 [与 C 库交互](native-c-interop.md).

试验 C API 映射的最快方法是, 将所有 C 声明都写在 `interop.def` 文件中, 完全不需要创建任何 `.h` 或 `.c` 文件.
然后将 C 声明放在一个 `.def` 文件中, 在专门的 `---` 分割行之后:

```c
---

int myFun(int i) {
    return i+1;
}

typedef int (*MyFun)(int);

void accept_fun(MyFun f) {
    f(42);
}

MyFun supply_fun() {
    return myFun;
}
```

这个 `interop.def` 文件已经足以编译和运行应用程序, 或在 IDE 中打开它.
现在来创建项目文件, 在 [IntelliJ IDEA](https://jetbrains.com/idea)中打开项目, 并运行它.

## 查看为 C 库生成的 Kotlin API

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
    gradleVersion = '%gradleVersion%'
    distributionType = 'BIN'
}
```

</tab>
</tabs>

项目文件将 C interop 配置为构建的一个额外步骤.
下面将 `interop.def` 文件移动到 `src/nativeInterop/cinterop` 目录.
Gradle 推荐使用符合约定习惯的文件布局, 而不是使用额外的配置,
比如, 源代码文件应该放在 `src/nativeMain/kotlin` 文件夹中.
默认情况下, 来自 C 的所有符号会被导入到 `interop` 包,
你可能想要在我们的 `.kt` 文件中导入整个包.
请查看 [Multiplatform Gradle DSL 参考文档](multiplatform-dsl-reference.md),
学习它的各种配置方法.

创建一个 `src/nativeMain/kotlin/hello.kt` 桩(stub)文件, 内容如下,
看看 C 函数指针声明在 Kotlin 中会变成什么:

```kotlin
import interop.*

fun main() {
    println("Hello Kotlin/Native!")

    accept_fun(/*fix me*/)
    val useMe = supply_fun()
}
```

现在你可以 [在 IntelliJ IDEA 中打开项目](native-get-started.md), 看看如何修正示例项目.
在这个过程中, 我们来看看 C 函数如何映射为 Kotlin/Native 声明.

## C 函数指针在 Kotlin 中的映射结果

通过 IntelliJ IDEA 的 **Go To** | **Declaration or Usages** 的帮助,
或查看编译器错误, 你可以看到为 C 函数生成的 API:

```kotlin
fun accept_fun(f: MyFun? /* = CPointer<CFunction<(Int) -> Int>>? */)
fun supply_fun(): MyFun? /* = CPointer<CFunction<(Int) -> Int>>? */

fun myFun(i: kotlin.Int): kotlin.Int

typealias MyFun = kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>

typealias MyFunVar = kotlinx.cinterop.CPointerVarOf<lib.MyFun>
```

你可以看到, C 函数的 `typedef` 被转换为 Kotlin 的 `typealias`.
它使用 `CPointer<..>` 类型来表示指针参数, 使用 `CFunction<(Int)->Int>` 来表示函数签名.
对所有的 `CPointer<CFunction<..>` 类型, 有一个 `invoke` 操作符扩展函数,
因此可以象 Kotlin 中的任何其他函数一样调用它.

## 将 Kotlin 函数作为 C 函数指针传递 {id="pass-kotlin-function-as-c-function-pointer"}

下面来试验在 Kotlin 程序中使用 C 函数. 调用 `accept_fun` 函数,
并传递一个指向 Kotlin Lambda 表达式的 C 函数指针:

```kotlin
fun myFun() {
    accept_fun(staticCFunction<Int, Int> { it + 1 })
}
```

这个调用使用 Kotlin/Native 的 `staticCFunction{..}` 帮助函数, 将一个 Kotlin Lambda 表达式函数封装为一个 C 函数指针.
它只允许使用无绑定(unbound), 并且无捕获(non-capturing)的 Lambda 表达式函数.
比如, 函数内不能使用局部变量. 你只能使用全局可见的声明.
从 `staticCFunction{..}` 之内抛出异常将会导致不确定的副作用.
因此必须保证你的代码内部不会抛出任何异常.

## 在 Kotlin 中使用 C 函数指针 {id="use-the-c-function-pointer-from-kotlin"}

下一步是通过你从 `supply_fun()` 调用得到的指针, 调用一个 C 函数指针:

```kotlin
fun myFun2() {
    val functionFromC = supply_fun() ?: error("No function is returned")

    functionFromC(42)
}
```

Kotlin 将函数指针返回类型转换为一个可为 null 的 `CPointer<CFunction<..>` 对象.
调用函数指针之前不需要明确检查结果是否为 `null`.
上面的示例代码中使用 [Elvis 操作符](null-safety.md) 进行这种检查.
`cinterop` 工具帮助我们将一个 C 函数指针转换为一个 Kotlin 中方便调用的对象.
我们在最后一行做的就是这种调用.

## 修正代码

你已经看到了所有的定义, 现在我们来修正代码.
[在 IDE 中](native-get-started.md) 运行 `runDebugExecutableNative` Gradle task,
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

    val cFunctionPointer = staticCFunction<Int, Int> { it + 1 }
    accept_fun(cFunctionPointer)

    val funFromC = supply_fun() ?: error("No function is returned")
    funFromC(42)
}
```

## 下一步

阅读以下教程, 继续探索更多 C 语言数据类型, 以及它们在 Kotlin/Native 中的表达:
- [映射 C 语言的基本数据类型](mapping-primitive-data-types-from-c.md)
- [映射 C 语言的结构(Struct)和联合(Union)类型](mapping-struct-union-types-from-c.md)
- [映射 C 语言的字符串](mapping-strings-from-c.md)

[与 C 代码交互](native-c-interop.md) 文档还讲解了更多的高级使用场景.
