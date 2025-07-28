[//]: # (title: 教程 - 映射 C 语言的字符串)

<tldr>
    <p>这是 <strong>Kotlin 与 C 映射</strong> 教程系列的最后部分. 在继续阅读之前, 请确认你完成了之前的教程.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">映射 C 语言的基本数据类型</a><br/>
        <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c.md">映射 C 语言的结构(Struct)和联合(Union)类型</a><br/>
      <img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">映射 C 语言的函数指针(Function Pointer)</a><br/>
      <img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>映射 C 语言的字符串</strong><br/>
    </p>
</tldr>

> C 库导入是 [实验性功能](components-stability.md#stability-levels-explained).
> cinterop 工具从 C 库生成的所有 Kotlin 声明都应该标注 `@ExperimentalForeignApi` 注解.
>
> Kotlin/Native 自带的原生平台库 (例如 Foundation, UIKit, 和 POSIX),
> 只对一部分 API 需要使用者明确同意(Opt-in).
>
{style="warning"}

在这个教程系列的最后部分, 我们来看看在 Kotlin/Native 中如何处理 C 字符串.

在本教程中, 你将学习如何:

- [将 Kotlin 字符串传递到 C](#pass-kotlin-strings-to-c)
- [在 Kotlin 中读取 C 字符串](#read-c-strings-in-kotlin)
- [将 C 字符串的字节接收到 Kotlin 字符串中](#receive-c-string-bytes-from-kotlin)

## 使用 C 字符串 {id="working-with-c-strings"}

C 语言没有专门的字符串类型. 方法签名或者文档可以帮助你识别, 特定场景中的一个 `char *` 是否表示一个 C 字符串.

C 语言中的字符串使用 null 作为终止符, 因此有一个末尾 0 字符 `\0` 添加到字节序列之后, 表示字符串结束.
通常, 使用 [UTF-8 编码的字符串](https://en.wikipedia.org/wiki/UTF-8).
UTF-8 编码使用变宽字符, 而且向后兼容 [ASCII](https://en.wikipedia.org/wiki/ASCII) 编码.
Kotlin/Native 默认使用 UTF-8 字符编码.

为了理解字符串在 Kotlin 和 C 之间的映射, 首先创建库的头文件.
在 [这个教程系列的第 1 部分](mapping-primitive-data-types-from-c.md) 中, 你已经创建了一个 C 库, 以及必要的文件.
在这个教程中:

1. 更新你的 `lib.h` 文件, 包含以下使用 C 字符串的函数声明:

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED

   void pass_string(char* str);
   char* return_string();
   int copy_string(char* str, int size);

   #endif
   ```

   这个示例演示了 C 语言中传递或接收一个字符串的常见方式.
   要小心处理 `return_string()` 函数的返回值. 要确保你使用了正确的 `free()` 函数来释放返回的 `char*`.

2. 更新 `interop.def` 文件中 `---` 分割行之后的声明:

   ```c
   ---

   void pass_string(char* str) {
   }

   char* return_string() {
     return "C string";
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

这个 `interop.def` 文件提供了所有需要的内容, 可以用来编译, 运行, 或在 IDE 中打开应用程序.

## 查看为 C 库生成的 Kotlin API {id="inspect-generated-kotlin-apis-for-a-c-library"}

我们来看看 C 字符串声明在 Kotlin/Native 中如何映射:

1. 在 `src/nativeMain/kotlin` 中, 将你在 [上一篇教程](mapping-function-pointers-from-c.md) 中创建的 `hello.kt` 文件,
   更新为以下内容:

   ```kotlin
   import interop.*
   import kotlinx.cinterop.ExperimentalForeignApi

   @OptIn(ExperimentalForeignApi::class)
   fun main() {
       println("Hello Kotlin/Native!")

       pass_string(/*fix me*/)
       val useMe = return_string()
       val useMe2 = copy_string(/*fix me*/)
   }
   ```

2. 通过 IntelliJ IDEA 的 [Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)
   命令 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>) 可以跳转到为 C 函数生成的 API:

   ```kotlin
   fun pass_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?)
   fun return_string(): kotlinx.cinterop.CPointer<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?
   fun copy_string(str: kotlinx.cinterop.CValuesRef<kotlinx.cinterop.ByteVarOf<kotlin.Byte> /* from: kotlinx.cinterop.ByteVar */>?, size: kotlin.Int): kotlin.Int
   ```

这些声明非常直观. 在 Kotlin 中, C 的 `char *` 指针类型, 对于参数会映射为 `str: CValuesRef<ByteVarOf>?`,
对于返回类型会映射为 `CPointer<ByteVarOf>?`.
Kotlin 将 `char` 类型表示为 `kotlin.Byte`, 因为它通常是 8 bit 有符号值.

在生成的 Kotlin 声明中, `str` 被定义为 `CValuesRef<ByteVarOf<Byte>>?`.
由于这个类型是可为 null 的, 你可以传递 `null` 作为参数值.

## 将 Kotlin 字符串传递到 C {id="pass-kotlin-strings-to-c"}

下面来试验在 Kotlin 程序中使用 API. 首先调用 `pass_string()` 函数:

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.cstr

@OptIn(ExperimentalForeignApi::class)
fun passStringToC() {
    val str = "This is a Kotlin string"
    pass_string(str.cstr)
}
```

有了 `String.cstr` [扩展属性](extensions.md#extension-properties) 的帮助, 向 C 传递一个 Kotlin 字符串是很简单的.
此外还有 `String.wcstr` 属性, 用于处理 UTF-16 字符的情况.

## 在 Kotlin 中读取 C 字符串 {id="read-c-strings-in-kotlin"}

现在来接收从 `return_string()` 函数返回的一个 `char *`, 并将它转换为一个 Kotlin 字符串:

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.toKString

@OptIn(ExperimentalForeignApi::class)
fun passStringToC() {
    val stringFromC = return_string()?.toKString()

    println("Returned from C: $stringFromC")
}
```

这段代码中, [`.toKString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/to-k-string.html)
扩展函数将 `return_string()` 函数返回的 C 字符串转换为 Kotlin 字符串.

Kotlin 提供了几个扩展函数, 用于将 C 的 `char *` 字符串转换为 Kotlin 字符串, 使用不同的编码:

```kotlin
fun CPointer<ByteVarOf<Byte>>.toKString(): String // 标准函数, 处理 UTF-8 字符串
fun CPointer<ByteVarOf<Byte>>.toKStringFromUtf8(): String // 明确转换 UTF-8 字符串
fun CPointer<ShortVarOf<Short>>.toKStringFromUtf16(): String // 转换 UTF-16 编码的字符串
fun CPointer<IntVarOf<Int>>.toKStringFromUtf32(): String // 转换 UTF-32 编码的字符串
```

## 在 Kotlin 接收 C 字符串的字节 {id="receive-c-string-bytes-from-kotlin"}

下面我们使用 C 函数 `copy_string()` 向一个指定的缓冲区写入一个 C 字符串.
它接受2 个参数: 一个指针, 表示字符串需要写入的内存位置, 以及允许的缓冲区大小.

函数还应该返回某个值, 表示它成功还是失败.
我们假设 `0` 表示它成功, 并且假设提供的缓冲区足够大:

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.addressOf
import kotlinx.cinterop.usePinned

@OptIn(ExperimentalForeignApi::class)
fun sendString() {
    val buf = ByteArray(255)
    buf.usePinned { pinned ->
        if (copy_string(pinned.addressOf(0), buf.size - 1) != 0) {
            throw Error("Failed to read string from C")
        }
    }

    val copiedStringFromC = buf.decodeToString()
    println("Message from C: $copiedStringFromC")
}
```

这段代码中, 一个 native 指针先被传递给 C 函数.
[`.usePinned()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html)
扩展函数临时的固定住字节数组的 native 内存地址. C 函数向这个字节数组填充数据.
另一个扩展函数 `ByteArray.decodeToString()` 将字节数组转换为一个 Kotlin 字符串, 假设使用 UTF-8 编码.

## 更新 Kotlin 代码 {id="update-kotlin-code"}

现在你已经学习了如何在 Kotlin 代码中使用 C 的声明, 请在你的项目中试试吧.
`hello.kt` 文件中的最终代码大致如下:

```kotlin
import interop.*
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")

    val str = "This is a Kotlin string"
    pass_string(str.cstr)

    val useMe = return_string()?.toKString() ?: error("null pointer returned")
    println(useMe)

    val copyFromC = ByteArray(255).usePinned { pinned ->
        val useMe2 = copy_string(pinned.addressOf(0), pinned.get().size - 1)
        if (useMe2 != 0) throw Error("Failed to read a string from C")
        pinned.get().decodeToString()
    }

    println(copyFromC)
}
```

为了验证是否一切正确, 请 [在你的 IDE 中](native-get-started.md) 运行 `runDebugExecutableNative` Gradle task,
或使用以下命令, 运行代码:

```bash
./gradlew runDebugExecutableNative
```

## 下一步 {id="what-s-next"}

更多详情请参见 [与 C 代码交互](native-c-interop.md) 文档, 其中包含更多高级场景.
