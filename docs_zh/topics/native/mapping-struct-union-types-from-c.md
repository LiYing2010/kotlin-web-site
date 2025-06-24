[//]: # (title: 教程 - 映射 C 语言的结构(Struct)和联合(Union)类型)

<tldr>
    <p>这是 <strong>Kotlin 与 C 映射</strong> 教程系列的第 2 部分. 在继续阅读之前, 请确认你完成了之前的教程.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">映射 C 语言的基本数据类型</a><br/>
       <img src="icon-2.svg" width="20" alt="Second step"/> <strong>映射 C 语言的结构(Struct)和联合(Union)类型</strong><br/>
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

我们来看看在 Kotlin/Native 中可以访问 C 的哪些结构(Struct)和联合(Union)类型声明,
并研究 Kotlin/Native 和 [跨平台](gradle-configure-project.md#targeting-multiple-platforms)
Gradle 构建的与 C 互操作相关的高级使用场景.

在本教程中, 你将学习:

* [如何映射结构(Struct)和联合(Union)类型](#mapping-struct-and-union-c-types)
* [如何在 Kotlin 中使用结构和联合类型](#use-struct-and-union-types-from-kotlin)

## 映射 C 的结构(Struct)和联合(Union)类型 {id="mapping-struct-and-union-c-types"}

为了理解 Kotlin 如何映射结构(Struct)和联合(Union)类型,
我们在 C 中声明这些类型, 然后看看它们在 Kotlin 中如何表达.

在 [前面的教程](mapping-primitive-data-types-from-c.md) 中, 你已经创建了一个 C 库, 以及必要的文件.
在这个教程中, 更新 `interop.def` 文件中 `---` 分割行之后的声明:

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

这个 `interop.def` 文件提供了所有需要的内容, 可以用来编译, 运行, 或在 IDE 中打开应用程序.

## 查看为 C 库生成的 Kotlin API {id="inspect-generated-kotlin-apis-for-a-c-library"}

我们来看看 C 的结构(Struct)和联合(Union)类型如何映射到 Kotlin/Native 中, 并更新你的项目:

1. 在 `src/nativeMain/kotlin` 中, 将你在 [上一篇教程](mapping-primitive-data-types-from-c.md) 中创建的 `hello.kt` 文件,
   更新为以下内容:

   ```kotlin
   import interop.*
   import kotlinx.cinterop.ExperimentalForeignApi

   @OptIn(ExperimentalForeignApi::class)
   fun main() {
       println("Hello Kotlin/Native!")

       struct_by_value(/* fix me*/)
       struct_by_pointer(/* fix me*/)
       union_by_value(/* fix me*/)
       union_by_pointer(/* fix me*/)
   }
   ```

2. 为了避免编译错误, 请在构建过程中添加 interop.
   方法是, 更新你的 `build.gradle(.kts)` 构建文件, 内容如下:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        macosArm64("native") {    // 用于 Apple Silicon 的 macOS 环境
        // macosX64("native") {   // 用于 x86_64 平台的 macOS 环境
        // linuxArm64("native") { // 用于 ARM64 平台的 Linux 环境
        // linuxX64("native") {   // 用于 x86_64 平台的 Linux 环境
        // mingwX64("native") {   // 用于 Windows 环境
            val main by compilations.getting
            val interop by main.cinterops.creating {
                definitionFile.set(project.file("src/nativeInterop/cinterop/interop.def"))
            }

            binaries {
                executable()
            }
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        macosArm64("native") {    // 用于 Apple Silicon 的 macOS 环境
        // macosX64("native") {   // 用于 x86_64 平台的 macOS 环境
        // linuxArm64("native") { // 用于 ARM64 平台的 Linux 环境
        // linuxX64("native") {   // 用于 x86_64 平台的 Linux 环境
        // mingwX64("native") {   // 用于 Windows 环境
            compilations.main.cinterops {
                interop {
                    definitionFile = project.file('src/nativeInterop/cinterop/interop.def')
                }
            }
        
            binaries {
                executable()
            }
        }
    }
    ```

    </tab>
    </tabs>

3. 通过 IntelliJ IDEA 的 [Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)
   命令 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>),
   可以跳转到为 C 函数, struct 和 union 生成的 API:

   ```kotlin
   fun struct_by_value(s: kotlinx.cinterop.CValue<interop.MyStruct>)
   fun struct_by_pointer(s: kotlinx.cinterop.CValuesRef<interop.MyStruct>?)
   
   fun union_by_value(u: kotlinx.cinterop.CValue<interop.MyUnion>)
   fun union_by_pointer(u: kotlinx.cinterop.CValuesRef<interop.MyUnion>?)
   ```

技术上, 在 Kotlin 中 struct 和 union 类型没有区别.
cinterop 工具对 C 的 struct 和 union 声明都会生成 Kotlin 类型.

生成的 API 包含 `CValue<T>` 和 `CValuesRef<T>` 完全限定的包名称, 反映它们在 `kotlinx.cinterop` 中的位置.
`CValue<T>` 表示一个传值的结构参数, `CValuesRef<T>?` 则用来传递一个指向结构或联合的指针.

## 在 Kotlin 中使用结构和联合类型 {id="use-struct-and-union-types-from-kotlin"}

有了这些生成的 API 的帮助, 在 Kotlin 中使用 C 的结构和联合类型是很简单的.
唯一的问题是, 如何为这些类创建这些类型的新实例.

我们来看一下生成的那些接受 `MyStruct` 和 `MyUnion` 参数的函数.
传值的参数表达为 `kotlinx.cinterop.CValue<T>`, 指针类型参数则使用 `kotlinx.cinterop.CValuesRef<T>?`.

Kotlin 提供了一个方便的 API 来创建和使用这些类型, 我们来看看在实践中如何使用这个 API.

### 创建一个 CValue&lt;T&gt; {id="create-a-cvalue-t"}

`CValue<T>` 类型用来向 C 函数传递一个传值的参数.
使用 `cValue` 函数来创建一个 `CValue<T>` 实例. 函数要求一个
[带接受者的 Lambda 函数](lambdas.md#function-literals-with-receiver)
来初始化底层的 C 类型. 函数声明如下:

```kotlin
fun <reified T : CStructVar> cValue(initialize: T.() -> Unit): CValue<T>
```

使用 `cValue`, 并传递传值的参数的方法如下:

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.cValue

@OptIn(ExperimentalForeignApi::class)
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

### 使用 CValuesRef&lt;T&gt; 创建结构和联合 {id="create-struct-and-union-as-cvaluesref-t"}

在 Kotlin 中, `CValuesRef<T>` 类型用来传递 C 函数的指针类型参数.
要在 native 内存中创建 `MyStruct` 和 `MyUnion`,
请使用 `kotlinx.cinterop.NativePlacement` 类型的以下扩展函数:

```kotlin
fun <reified T : kotlinx.cinterop.CVariable> alloc(): T
```

`NativePlacement` 表示 native 内存, 它有类似于 `malloc` 和 `free` 的函数.
`NativePlacement` 有几种实现:

* 全局实现是 `kotlinx.cinterop.nativeHeap`, 但你必须在使用完毕后调用 `nativeHeap.free()` 函数来释放内存.
* 另一个更加安全的选择是 `memScoped()`, 它创建一个短期存在(Short-Lived)的内存范围(Scope),
  所有分配的内存将会在代码段的末尾自动释放.

  ```kotlin
  fun <R> memScoped(block: kotlinx.cinterop.MemScope.() -> R): R
  ```

使用 `memScoped()` 时, 使用指针调用函数的代码大致如下:

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.alloc
import kotlinx.cinterop.ptr

@OptIn(ExperimentalForeignApi::class)
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

这段代码使用来自 `memScoped {}` 代码段的扩展属性 `ptr`,
将 `MyStruct` 和 `MyUnion` 实例转换为 native 指针.

由于内存在 `memScoped {}` 代码段之内管理, 因此会在代码段的末尾自动释放.
请不要在这个范围之外使用指针, 以免访问到已释放的内存.
如果你需要生存周期更长的内存分配(例如, 在 C 库中使用缓存), 请考虑使用 `Arena()` 或 `nativeHeap`.

### CValue&lt;T&gt; 和 CValuesRef&lt;T&gt; 之间的转换 {id="conversion-between-cvalue-t-and-cvaluesref-t"}

有些时候, 你需要在一个函数调用中以值的方式传递一个结构,
然后对另一个函数调用需要以引用的方式传递同一个结构.

要实现这样的功能, 你需要使用 `NativePlacement`,
但在此之前, 我们先来看看 `CValue<T>` 如何转换为指针:

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.cValue
import kotlinx.cinterop.memScoped

@OptIn(ExperimentalForeignApi::class)
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

这里和前面一样, 使用来自 `memScoped {}` 代码段的扩展属性 `ptr`, 将 `MyStruct` 实例转换为 native 指针.
这些指针只在 `memScoped {}` 代码段之内有效.

要将一个指针反过来转换为一个传值的变量, 请调用 `.readValue()` 扩展函数:

```kotlin
import interop.*
import kotlinx.cinterop.alloc
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.readValue

@OptIn(ExperimentalForeignApi::class)
fun callMix_value() {
    memScoped {
        val cStruct = alloc<MyStruct>()
        cStruct.a = 42
        cStruct.b = 3.14

        struct_by_value(cStruct.readValue())
    }
}
```

## 更新 Kotlin 代码 {id="update-kotlin-code"}

现在你已经学习了如何在 Kotlin 代码中使用 C 的声明, 请在你的项目中试试吧.
`hello.kt` 文件中的最终代码大致如下:

```kotlin
import interop.*
import kotlinx.cinterop.alloc
import kotlinx.cinterop.cValue
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.ptr
import kotlinx.cinterop.readValue
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
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

为了验证是否一切正确, 请 [在你的 IDE 中](native-get-started.md#build-and-run-the-application) 运行 `runDebugExecutableNative` Gradle task,
或使用以下命令, 运行代码:

```bash
./gradlew runDebugExecutableNative
```

## 下一步 {id="next-step"}

在这个教程系列的下一部分, 你将学习在 Kotlin 和 C 之间如何映射函数指针(Function Pointer):

**[继续下一部分](mapping-function-pointers-from-c.md)**

### 参见 {id="see-also"}

更多详情请参见 [与 C 代码交互](native-c-interop.md) 文档, 其中包含更多高级场景.
