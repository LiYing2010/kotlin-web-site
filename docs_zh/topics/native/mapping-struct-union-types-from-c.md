[//]: # (title: 教程 - 映射 C 语言的结构(Struct)和联合(Union)类型)

最终更新: %latestDocDate%

> C 库导入是 [实验性功能](components-stability.md#stability-levels-explained).
> `cinterop` 工具从 C 库生成的所有 Kotlin 声明都应该标注 `@ExperimentalForeignApi` 注解.
>
> Kotlin/Native 自带的原生平台库 (例如 Foundation, UIKit, 和 POSIX),
> 只对一部分 API 需要使用者明确同意(Opt-in). 对于这样的情况, 你会在 IDE 中看到警告信息.
>
{style="warning"}

这是本系列的第 2 篇教程.
第 1 篇教程是 [映射 C 语言的基本数据类型](mapping-primitive-data-types-from-c.md).
此外还有教程 [映射 C 语言的函数指针(Function Pointer)](mapping-function-pointers-from-c.md)
和教程 [映射 C 语言的字符串](mapping-strings-from-c.md).

本教程中, 你将学习:
- [如何映射结构(Struct)和联合(Union)类型](#mapping-struct-and-union-c-types)
- [如何在 Kotlin 中使用结构和联合类型](#use-struct-and-union-types-from-kotlin)

## 映射 C 的结构(Struct)和联合(Union)类型 {id="mapping-struct-and-union-c-types"}

要理解 Kotlin 和 C 之间的映射, 最好的方法是试验一段小示例程序. 
我们在 C 语言中声明一个结构和一个联合, 看看它们如何映射到 Kotlin.

Kotlin/Native 带有 `cinterop` 工具; 这个工具会生成 C 语言和 Kotlin 之间的绑定.
它使用一个 `.def` 文件来指定一个要导入的 C 库.
详情请参见教程 [与 C 库交互](native-c-interop.md).
 
在 [前面的教程](mapping-primitive-data-types-from-c.md) 中, 你创建了一个 `lib.h` 文件.
现在, 直接在 `interop.def` 文件中包含这些声明, 在专门的 `---` 分割行之后:

```c
---

typedef struct {
    int a;
    double b;
} MyStruct;

void struct_by_value(MyStruct s) {}
void struct_by_pointer(MyStruct* s) {}

typedef union {
    int a;
    MyStruct b;
    float c;
} MyUnion;

void union_by_value(MyUnion u) {}
void union_by_pointer(MyUnion* u) {}
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
看看 C 中的结构和联合类型声明在 Kotlin 会成为什么:

```kotlin
import interop.*

fun main() {
    println("Hello Kotlin/Native!")

    struct_by_value(/*fix me*/)
    struct_by_pointer(/*fix me*/)
    union_by_value(/*fix me*/)
    union_by_pointer(/*fix me*/)
}
```

现在你可以 [在 IntelliJ IDEA 中打开项目](native-get-started.md), 看看如何修正示例项目.
在这个过程中, 我们来看看 C 的结构和联合类型如何映射到 Kotlin/Native 声明.

## 结构和联合类型在 Kotlin 中的映射结果

通过 IntelliJ IDEA 的 __Go to | Declaration__ 的帮助,
或查看编译器错误, 你可以看到为 C 函数, `struct`, 和 `union` 生成的 API:

```kotlin
fun struct_by_value(s: CValue<MyStruct>)
fun struct_by_pointer(s: CValuesRef<MyStruct>?)

fun union_by_value(u: CValue<MyUnion>)
fun union_by_pointer(u: CValuesRef<MyUnion>?)

class MyStruct constructor(rawPtr: NativePtr /* = NativePtr */) : CStructVar {
    var a: Int
    var b: Double
    companion object : CStructVar.Type
}

class MyUnion constructor(rawPtr: NativePtr /* = NativePtr */) : CStructVar {
    var a: Int
    val b: MyStruct
    var c: Float
    companion object : CStructVar.Type
}
```

你可以看到 `cinterop` 为我们的 `struct` 和 `union` 类型生成的包装类型. 
对 C 中声明的 `MyStruct` 和 `MyUnion` 类型, 相应的生成了 Kotlin 类 `MyStruct` 和 `MyUnion`.
这些包装类型继承自基类 `CStructVar`, 并将所有的域声明为 Kotlin 属性.
它使用 `CValue<T>` 来表达一个传值(By-Value)的结构参数, 使用 `CValuesRef<T>?` 表达传递结构或联合的指针.

技术上, 在 Kotlin 中 `struct` 和 `union` 类型没有区别.
注意, Kotlin 中 `MyUnion` 类的 `a`, `b`, 和 `c` 属性使用相同的内存位置来读写它们的值, 和 C 语言中的 `union` 一样. 

关于更多细节以及高级使用场景, 请参见 [与 C 代码交互](native-c-interop.md) 文档.

## 在 Kotlin 中使用结构和联合类型 {id="use-struct-and-union-types-from-kotlin"}

在 Kotlin 中为 C 的 `struct` 和 `union` 类型生成的包装类很容易使用.
由于存在那些生成的属性, 在 Kotlin 代码中使用它们感觉很自然. 目前唯一的问题是, 如何为这些类创建一个新的实例.
如你所见, 在 `MyStruct` 的 `MyUnion` 声明中, 构造函数需要一个 `NativePtr` 参数.
当然, 你不希望手动处理指针. 相反, 你可以让 Kotlin API 来为我们初始化这些对象. 

我们来看一下生成的那些接受 `MyStruct` 和 `MyUnion` 参数的函数.
你可以看到, 传值的参数表达为 `kotlinx.cinterop.CValue<T>`. 对于类型指针参数则是 `kotlinx.cinterop.CValuesRef<T>`.
Kotlin 为我们提供了 API 方便的处理这两种类型, 我们来试一下.

### 创建一个 `CValue<T>`

`CValue<T>` 类型用来向 C 函数传递一个传值的参数.
使用 `cValue` 函数来创建 `CValue<T>` 对象实例. 函数要求一个
[带接受者的 Lambda 函数](lambdas.md#function-literals-with-receiver) 
来初始化底层的 C 类型. 函数声明如下:

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() -> Unit): CValue<T>
```

现在来看看如何使用 `cValue`, 并传递传值的参数:

```kotlin
fun callValue() {
    val cStruct = cValue<MyStruct> {
        a = 42
        b = 3.14
    }
    struct_by_value(cStruct)

    val cUnion = cValue<MyUnion> {
        b.a = 5
        b.b = 2.7182
    }

    union_by_value(cUnion)
}
```

### 使用 `CValuesRef<T>` 创建结构和联合 

在 Kotlin 中, `CValuesRef<T>` 类型用来传递 C 函数的有类型指针参数.
首先, 你需要 `MyStruct` 和 `MyUnion` 类的实例. 可以直接在 native 内存中创建它们. 
方法是对 `kotlinx.cinterop.NativePlacement` 类型使用扩展函数:

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T   
```

`NativePlacement` 表示 native 内存, 它有类似于 `malloc` 和 `free` 的函数.
`NativePlacement` 有几种实现.
全局实现通过 `kotlinx.cinterop.nativeHeap` 来调用, 在使用完毕后不要忘记调用 `nativeHeap.free(..)` 函数来释放内存.
 
另一个选择是使用函数:

```kotlin
fun <R> memScoped(block: kotlinx.cinterop.MemScope.() -> R): R    
```

它创建一个短期存在(Short-Lived)的内存分配范围(Allocation Scope),
所有分配的内存将会在 `block` 的末尾自动清除.

使用指针调用函数的代码大致如下:

```kotlin
fun callRef() {
    memScoped {
        val cStruct = alloc<MyStruct>()
        cStruct.a = 42
        cStruct.b = 3.14

        struct_by_pointer(cStruct.ptr)

        val cUnion = alloc<MyUnion>()
        cUnion.b.a = 5
        cUnion.b.b = 2.7182

        union_by_pointer(cUnion.ptr)
    }
}
```

注意, 这段代码使用来自 `memScoped` Lambda 接受者类型的扩展属性 `ptr`, 
来将 `MyStruct` 和 `MyUnion` 实例转换为 native 指针.

`MyStruct` 和 `MyUnion` 类内部保存指向 native 内存的指针.
内存会在 `memScoped` 函数结束时释放, 等于在是它的 `block` 的末尾.
请确保指针没有在 `memScoped` 调用范围之外被使用.
对于需要生存周期更长的指针, 或者缓存在 C 库内部的指针, 你可以使用 `Arena()` 或 `nativeHeap`.

### `CValue<T>` 和 `CValuesRef<T>` 之间的转换

当然, 有些使用场景中, 对一个函数调用你需要以值的方式传递一个结构,
然后对另一个函数调用需要以引用的方式传递同一个结构.
在 Kotlin/Native 中也是可以实现的.
这里需要用到 `NativePlacement`. 

首先我们来看看 `CValue<T>` 如何转换为指针:

```kotlin
fun callMix_ref() {
    val cStruct = cValue<MyStruct> {
        a = 42
        b = 3.14
    }

    memScoped {
        struct_by_pointer(cStruct.ptr)
    }
}
```

这段代码使用来自 `memScoped` Lambda 接受者类型的扩展属性 `ptr`, 
来将 `MyStruct` 和 `MyUnion` 实例转换为 native 指针.
这些指针只在 `memScoped` block 之内有效.

对于反过来的转换, 要将一个指针转换为一个传值的变量, 我们调用 `readValue()` 扩展函数:

```kotlin
fun callMix_value() {
    memScoped {
        val cStruct = alloc<MyStruct>()
        cStruct.a = 42
        cStruct.b = 3.14

        struct_by_value(cStruct.readValue())
    }
}
```

## 运行代码

现在你已经学习了如何在你的代码中使用 C 的声明, 你可以在真实的例子中尝试了.
我们来修正代码, 看看它如何运行, 方法是 [在 IDE 中](native-get-started.md) 调用 `runDebugExecutableNative` Gradle task,
或使用以下命令:

```bash
./gradlew runDebugExecutableNative
```

最终的 `hello.kt` 文件中的代码大致如下:
 
```kotlin
import interop.*
import kotlinx.cinterop.alloc
import kotlinx.cinterop.cValue
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.ptr
import kotlinx.cinterop.readValue

fun main() {
    println("Hello Kotlin/Native!")

    val cUnion = cValue<MyUnion> {
        b.a = 5
        b.b = 2.7182
    }

    memScoped {
        union_by_value(cUnion)
        union_by_pointer(cUnion.ptr)
    }

    memScoped {
        val cStruct = alloc<MyStruct> {
            a = 42
            b = 3.14
        }

        struct_by_value(cStruct.readValue())
        struct_by_pointer(cStruct.ptr)
    }
}
```

## 下一步

阅读以下教程, 继续探索更多 C 语言数据类型, 以及它们在 Kotlin/Native 中的表达:
- [映射 C 语言的基本数据类型](mapping-primitive-data-types-from-c.md)
- [映射 C 语言的函数指针(Function Pointer)](mapping-function-pointers-from-c.md)
- [映射 C 语言的字符串](mapping-strings-from-c.md)

[与 C 代码交互](native-c-interop.md) 文档还讲解了更多的高级使用场景.
