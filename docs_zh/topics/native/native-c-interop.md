[//]: # (title: 与 C 代码交互)

> C 库的导入是 [实验性功能](components-stability.md#stability-levels-explained).
> cinterop 工具从 C 库生成的所有 Kotlin 声明都应该标注 `@ExperimentalForeignApi` 注解.
>
> Kotlin/Native 自带的原生平台库 (例如 Foundation, UIKit, 和 POSIX),
> 只对一部分 API 需要使用者明确同意(Opt-in).
>
{style="warning"}

这篇文档涵盖 Kotlin 与 C 互操作功能的一般方面.
Kotlin/Native 附带一个 cinterop 工具, 在与外部的 C 库交互时, 你可以使用它快速生成所需要的一切内容.

这个工具会分析 C 头文件, 并生成 C 的类型, 函数, 以及常数到 Kotlin 的直接映射.
之后可以将生成的桩代码(stub)导入到 IDE, 实现代码完成和导航功能.

> Kotlin 还提供了与 Objective-C 的互操作能力. Objective-C 库也通过 cinterop 工具导入.
> 详情请参见 [与 Swift/Objective-C 代码交互](native-objc-interop.md).
>
{style="tip"}

## 设置你的项目 {id="setting-up-your-project"}

在开发一个需要使用 C 库的项目时, 一般的工作流程如下:

1. 创建并配置一个 [定义文件](native-definition-file.md).
   它描述 cinterop 工具应该包含在 Kotlin [绑定](#bindings) 中的内容.
2. 配置你的 Gradle 构建文件, 在构建过程中包含 cinterop.
3. 编译并运行项目, 生成最终的可执行文件.

> 为了得到实践经验, 请完成 [使用 C interop 创建应用程序](native-app-with-c-and-libcurl.md) 教程.
>
{style="note"}

很多情况下, 不需要配置与 C 库的自定义的互操作性.
相反, 你可以使用平台上的标准化绑定中可用的 API, 称为 [平台库](native-platform-libs.md).
例如, 可以通过这样的方式使用 Linux/macOS 平台的 POSIX, Windows 平台的 Win32, 或 macOS/iOS 平台的 Apple 框架.

## 绑定 {id="bindings"}

### 基本的 interop 数据类型 {id="basic-interop-types"}

C 中支持的所有数据类型, 都有对应的 Kotlin 类型:

* 有符号整数, 无符号整数, 以及浮点类型, 会被映射为 Kotlin 中的同样类型, 并且长度相同.
* 指针和数组映射为 `CPointer<T>?` 类型.
* 枚举型映射为 Kotlin 的枚举型, 或整数型,
  由 heuristic 以及 [定义文件中设置](native-definition-file.md#configure-enums-generation) 决定.
* 结构体(Struct)和联合体(Union)映射为通过点号访问的域的形式,
  也就是 `someStructInstance.field1` 的形式.
* `typedef` 映射为 `typealias`.

此外, 任何 C 类型都有对应的 Kotlin 类型来表达这个类型的左值(lvalue),
也就是, 在内存中分配的那个值, 而不是简单的不可变的自包含值.
你可以想想 C++ 的引用, 与这个概念类似.
对于结构体(Struct) (以及指向结构体的 `typedef`) 左值类型就是它的主要表达形式,
而且使用与结构体本身相同的名字. 对于 Kotlin 枚举类型, 左值类型名称是 `${type}.Var`,
对于 `CPointer<T>`, 左值类型名称是 `CPointerVar<T>`,
对于大多数其他类型, 左值类型名称是 `${type}Var`.

对于兼有这两种表达形式的类型, 包含左值(lvalue)的那个类型,
带有一个可变的 `.value` 属性, 可以用来访问这个左值.

#### 指针类型 {id="pointer-types"}

`CPointer<T>` 的类型参数 `T` 必须是上面介绍的左值(lvalue)类型之一.
例如, C 类型 `struct S*` 会被映射为 `CPointer<S>`,
`int8_t*` 会被映射为 `CPointer<int_8tVar>`,
`char**` 会被映射为 `CPointer<CPointerVar<ByteVar>>`.

C 的空指针(null) 在 Kotlin 中表达为 `null`,
指针类型 `CPointer<T>` 是不可为空的, 而 `CPointer<T>?` 类型则是可为空的.
这种类型的值支持 Kotlin 的所有涉及 `null` 值处理的操作, 例如 `?:`, `?.`, `!!` 等等:

```kotlin
val path = getenv("PATH")?.toKString() ?: ""
```

由于数组也被映射为 `CPointer<T>`,
因此这个类型也支持 `[]` 操作, 可以使用下标来访问数组中的值:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
fun shift(ptr: CPointer<ByteVar>, length: Int) {
    for (index in 0 .. length - 2) {
        ptr[index] = ptr[index + 1]
    }
}
```

`CPointer<T>` 的 `.pointed` 属性返回这个指针指向的那个位置的类型 `T` 的左值.
相反的操作是 `.ptr`, 它接受一个左值, 返回一个指向它的指针.

`void*` 映射为 `COpaquePointer` – 这是一个特殊的指针类型, 它是任何其他指针类型的超类.
因此, 如果 C 函数接受 `void*` 类型参数, 绑定的 Kotlin 函数就可以接受任何 `CPointer` 类型参数.

可以使用 `.reinterpret<T>` 来对一个指针进行类型变换(包括 `COpaquePointer`), 例如:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val intPtr = bytePtr.reinterpret<IntVar>()
```

或者:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val intPtr: CPointer<IntVar> = bytePtr.reinterpret()
```

和 C 一样, 这样的 `.reinterpret` 类型变换是不安全的, 可能导致应用程序发生潜在的内存错误.

对于 `CPointer<T>?` 和 `Long` 也有不安全的类型变换方法,
由扩展函数 `.toLong()` 和 `.toCPointer<T>()` 实现:

```kotlin
val longValue = ptr.toLong()
val originalPtr = longValue.toCPointer<T>()
```

> 如果结果类型可以通过上下文确定, 那么可以省略类型参数, 因为可以使用类型推断.
>
{style="tip"}

### 内存分配 {id="memory-allocation"}

可以使用 `NativePlacement` 接口来分配原生内存, 例如:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val byteVar = placement.alloc<ByteVar>()
```

或者:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val bytePtr = placement.allocArray<ByteVar>(5)
```

内存最符合逻辑的位置就是在 `nativeHeap` 对象内.
这个操作就相当于使用 `malloc` 来分配原生内存,
另外还提供了 `.free()` 操作来释放已分配的内存:

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
fun main() {
    val size: Long = 0
    val buffer = nativeHeap.allocArray<ByteVar>(size)
    nativeHeap.free(buffer)
}
```

`nativeHeap` 需要手动释放内存.
然而, 分配的内存的生命周期通常会限定在一个指明的作用范围内.
但是, 我们经常需要分配内存, 将其生命周期限定在一个指明的作用范围内.
如果这些内存能够自动释放, 会非常有帮助.

为了实现这样的功能, 可以使用 `memScoped { }`.
在括号内部, 可以以隐含的接收者的形式访问到一个临时的内存分配位置,
因此可以使用 alloc 和 allocArray 来分配原生内存,
离开这个作用范围后, 已分配的这些内存会被自动释放.

例如, 如果一个 C 函数, 使用指针参数返回值, 可以用下面这种方式来使用这个函数:

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
val fileSize = memScoped {
    val statBuf = alloc<stat>()
    val error = stat("/", statBuf.ptr)
    statBuf.st_size
}
```

### 向绑定传递指针 {id="pass-pointers-to-bindings"}

尽管 C 指针被映射为 `CPointer<T>` 类型, 但 C 函数的指针型参数会被映射为 `CValuesRef<T>` 类型.
如果向这样的参数传递 `CPointer<T>` 类型的值, 那么会原样传递给 C 函数.
但是, 也可以直接传递值的序列, 而不是传递指针.
这种情况下, 序列会以值的形式传递(by value),
也就是说, C 函数收到一个指针, 指向这个值序列的一个临时拷贝, 这个临时拷贝只在函数返回之前存在.

`CValuesRef<T>` 形式表达的指针型参数是为了用来支持 C 数组字面值, 而不必明确地进行内存分配操作.
为了构造一个不可变的自包含的 C 的值的序列, 可以使用下面这些方法:

* `${type}Array.toCValues()`, 其中 `type` 是 Kotlin 的基本类型
* `Array<CPointer<T>?>.toCValues()`, `List<CPointer<T>?>.toCValues()`
* `cValuesOf(vararg elements: ${type})`, 其中 `type` 是基本类型, 或指针

例如:

```c
// C 代码:
void foo(int* elements, int count);
...
int elements[] = {1, 2, 3};
foo(elements, 3);
```

```kotlin
// Kotlin 代码:

foo(cValuesOf(1, 2, 3), 3)
```

### 字符串 {id="strings"}

与其它指针不同, `const char*` 类型参数会被表达为 Kotlin 的 `String` 类型.
因此对于 C 中期望字符串的绑定, 可以传递 Kotlin 的任何字符串值.

还有一些工具, 可以用来在 Kotlin 和 C 的字符串之间进行手工转换:

* `fun CPointer<ByteVar>.toKString(): String`
* `val String.cstr: CValuesRef<ByteVar>`.

要得到指针, `.cstr` 应该在原生内存中分配, 例如:

```kotlin
val cString = kotlinString.cstr.getPointer(nativeHeap)
```

在所有这些场合, C 字符串的编码都是 UTF-8.

要跳过字符串的自动转换, 并确保在绑定中使用原生的指针,
可以向 `.def` 文件添加 [`noStringConversion` 属性](native-definition-file.md#set-up-string-conversion):

```c
noStringConversion = LoadCursorA LoadCursorW
```

通过这种方式, 任何 `CPointer<ByteVar>` 类型的值都可以传递给 `const char*` 类型的参数.
如果需要传递 Kotlin 字符串, 可以使用这样的代码:

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    LoadCursorA(null, "cursor.bmp".cstr.ptr)  // 对这个函数的 ASCII 或 UTF-8 版
    LoadCursorW(null, "cursor.bmp".wcstr.ptr) // 对这个函数的 UTF-16 版
}
```

### 作用范围内的局部指针 {id="scope-local-pointers"}

`memScoped {}` 内有一个 `CValues<T>.ptr` 扩展属性,
使用它可以创建一个指向 `CValues<T>` 的 C 指针, 这个指针被限定在一个作用范围内.
通过它可以使用需要 C 指针的 API, 指针的生命周期限定在特定的 `MemScope` 内. 例如:

```kotlin
import kotlinx.cinterop.*

@OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)
memScoped {
    items = arrayOfNulls<CPointer<ITEM>?>(6)
    arrayOf("one", "two").forEachIndexed { index, value -> items[index] = value.cstr.ptr }
    menu = new_menu("Menu".cstr.ptr, items.toCValues().ptr)
    // ...
}
```

在这个示例程序中, 所有传递给 C API `new_menu()` 的值, 生命周期都被限定在它所属的最内层的 `memScope` 之内.
一旦程序的执行离开了 `memScoped` 作用范围, C 指针就不再存在了.

### 以值的方式传递和接收结构 {id="pass-and-receive-structs-by-value"}

如果一个 C 函数以传值的方式接受结构体(Struct)或联合体(Union) `T` 类型的参数,
或者以传值的方式返回结构体(Struct)或联合体(Union) `T` 类型的结果,
对应的参数类型或结果类型会被表达为 `CValue<T>`.

`CValue<T>` 是一个不透明(opaque)类型, 因此无法通过适当的 Kotlin 属性访问到 C 结构体的域.
如果 API 以不透明(opaque)句柄的形式使用结构体, 那么这样是没问题的.
但是如果确实需要访问结构体中的域, 那么可以使用以下转换方法:

* [`fun T.readValue(): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/read-value.html)
  将(左值) `T` 转换为一个 `CValue<T>`.
  因此, 如果要构造一个 `CValue<T>`, 可以先分配 `T`, 为其中的域赋值, 然后将它转换为 `CValue<T>`.
* [`CValue<T>.useContents(block: T.() -> R): R`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-contents.html)
  将 `CValue<T>` 临时保存在内存中, 然后使用放置在内存中的这个 `T` 值作为接收者, 来运行参数中指定的 Lambda 表达式.
  因此, 如果要读取结构体中一个单独的域, 可以使用以下代码:

  ```kotlin
  val fieldValue = structValue.useContents { field }
  ```

* [`fun cValue(initialize: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/c-value.html)
  使用提供的 `initialize` 函数, 在内存中分配 `T`, 并将结果转换为 `CValue<T>`.
* [`fun CValue<T>.copy(modify: T.() -> Unit): CValue<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/copy.html)
  对既有的 `CValue<T>` 创建一个修改后的副本.
  原来的值放置在内存中, 使用 `modify()` 函数进行修改, 然后转换为一个新的 `CValue<T>`.
* [`fun CValues<T>.placeTo(scope: AutofreeScope): CPointer<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/place-to.html)
  将 `CValues<T>` 放入一个 `AutofreeScope`, 返回一个指针, 指向分配的内存.
  当 `AutofreeScope` 销毁时, 分配的内存会自动被释放.

### 回调 {id="callbacks"}

如果要将一个 Kotlin 函数转换为一个指向 C 函数的指针, 可以使用 `staticCFunction(::kotlinFunction)`.
也可以使用 Lambda 表达式来代替函数引用.
这里的函数或 Lambda 表达式不能捕获任何值.

#### 向回调传递用户数据 {id="pass-user-data-to-callbacks"}

C API 经常允许向回调传递一些用户数据. 这些数据通常由用户在设置回调时提供.
数据使用例如 `void*` 的形式, 传递给某些 C 函数 (或写入到结构体内).
但是, Kotlin 对象的引用无法直接传递给 C.
因此需要在设置回调之前包装这些数据, 然后在回调函数内部将它们解开,
这样才能通过 C 函数来再两段 Kotlin 代码之间传递数据.
这种数据包装可以使用 `StableRef` 类实现.

要封装一个 Kotlin 对象的引用, 可以使用以下代码:

```kotlin
import kotlinx.cinterop.*

@OptIn(ExperimentalForeignApi::class)
val stableRef = StableRef.create(kotlinReference)
val voidPtr = stableRef.asCPointer()
```

这里的 `voidPtr` 是一个 `COpaquePointer` 类型, 因此可以传递给 C 函数.

要解开这个引用, 可以使用以下代码:

```kotlin
@OptIn(ExperimentalForeignApi::class)
val stableRef = voidPtr.asStableRef<KotlinClass>()
val kotlinReference = stableRef.get()
```

这里的 `kotlinReference` 就是封装之前的 Kotlin 对象引用.

创建 `StableRef` 后, 最终需要使用 `.dispose()` 方法手动释放, 以避免内存泄漏:

```kotlin
stableRef.dispose()
```

释放后, 它就变得不可用了, 因此 `voidPtr` 也不能再次解开.

### 宏 {id="macros"}

每个展开为常数的 C 语言宏, 都会表达为一个 Kotlin 属性.

当编译器能够推断类型时, 支持不带参数的宏:

```c
int foo(int);
#define FOO foo(42)
```

这种情况下, 在 Kotlin 中可以使用 `FOO`.

要支持其他的宏, 你可以将它们封装在支持的声明中, 这样就可以手动公开这些宏.
例如, 类似于函数的宏 `FOO` 可以映射为函数 `foo()`,
方法是向库 [添加自定义的声明](native-definition-file.md#add-custom-declarations):

```c
headers = library/base.h

---

static inline int foo(int arg) {
    return FOO(arg);
}
```

### 可移植性 {id="portability"}

有时, C 库中的函数参数, 或结构体的域使用了依赖于平台的数据类型, 例如 `long` 或 `size_t`.
Kotlin 本身没有提供隐含的整数类型转换, 也没有提供 C 风格的整数类型转换 (例如, `(size_t) intValue`),
因此, 在这种情况下, 为了让编写可以移植的代码变得容易一点, 提供了 `convert` 方法:

```kotlin
fun ${type1}.convert<${type2}>(): ${type2}
```

这里, `type1` 和 `type2` 都必须是整数类型, 可以是有符号整数, 可以可以是无符号整数.

`.convert<${type}>` 的含义等同于 `.toByte`, `.toShort`, `.toInt`, `.toLong`,
`.toUByte`, `.toUShort`, `.toUInt` 或 `.toULong` 方法,
具体等于哪个, 取决于 `type` 的具体类型.

使用 `convert` 的示例如下:

```kotlin
import kotlinx.cinterop.*
import platform.posix.*

@OptIn(ExperimentalForeignApi::class)
fun zeroMemory(buffer: COpaquePointer, size: Int) {
    memset(buffer, 0, size.convert<size_t>())
}
```

而且, 这个函数的类型参数可以自动推定得到, 因此很多情况下可以省略.

### 对象固定 {id="object-pinning"}

Kotlin 对象可以固定(pin), 也就是, 确保它们在内存中的位置不会变化, 直到解除固定(unpin)为止,
而且, 指向这些对象的内部数据的指针, 可以传递给 C 函数.

可以采用以下几种方案:

* 使用 [`usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 服务函数,
  它会先固定一个对象, 然后执行一个代码段, 最后无论是正常结束还是异常结束, 它都会将对象解除固定:

  ```kotlin
  import kotlinx.cinterop.*
  import platform.posix.*

  @OptIn(ExperimentalForeignApi::class)
  fun readData(fd: Int) {
      val buffer = ByteArray(1024)
      buffer.usePinned { pinned ->
          while (true) {
              val length = recv(fd, pinned.addressOf(0), buffer.size.convert(), 0).toInt()
              if (length <= 0) {
                  break
              }
              // 现在 `buffer` 中包含了从 `recv()` 函数调用得到的原生数据.
          }
      }
  }
  ```

  这里, `pinned` 是一个特殊类型 `Pinned<T>` 的对象.
  这个类型提供了一些有用的扩展, 例如 `addressOf`, 可以得到被固定的数组体的地址.

* 使用 [`refTo()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 函数,
  它的底层功能是类似的, 但是在某些情况下, 可以帮助你减少样板代码:

  ```kotlin
  import kotlinx.cinterop.*
  import platform.posix.*

  @OptIn(ExperimentalForeignApi::class)
  fun readData(fd: Int) { 
      val buffer = ByteArray(1024)
      while (true) {
          val length = recv(fd, buffer.refTo(0), buffer.size.convert(), 0).toInt()

          if (length <= 0) {
              break
          }
          // 现在 `buffer` 中包含了从 `recv()` 函数调用得到的原生数据.
      }
  }
  ```

  Here, `buffer.refTo(0)` has the `CValuesRef` type that pins the array before entering the `recv()` function,
  passes the address of its zeroth element to the function, and unpins the array after exiting.

### 提前声明(Forward Declaration) {id="forward-declarations"}

要导入提前声明(Forward Declaration), 请使用 `cnames` 包.
例如, 要导入一个 C 库 `library.package` 中声明的提前声明 `cstructName`,
要使用一个特殊的提前声明包: `import cnames.structs.cstructName`.

假设有两个 cinterop 库: 一个库包含一个结构的提前声明, 另一个库在另一个包中包含实际实现:

```C
// 第 1 个 C 库
#include <stdio.h>

struct ForwardDeclaredStruct;

void consumeStruct(struct ForwardDeclaredStruct* s) {
    printf("Struct consumed\n");
}
```

```C
// 第 2 个 C 库
// 头文件:
#include <stdlib.h>

struct ForwardDeclaredStruct {
    int data;
};

// 实现:
struct ForwardDeclaredStruct* produceStruct() {
    struct ForwardDeclaredStruct* s = malloc(sizeof(struct ForwardDeclaredStruct));
    s->data = 42;
    return s;
}
```

要在两个库之间转换对象, 请在你的 Kotlin 代码中使用明确的 `as` 转换:

```kotlin
// Kotlin 代码:
fun test() {
    consumeStruct(produceStruct() as CPointer<cnames.structs.ForwardDeclaredStruct>)
}
```

## 下一步做什么 {id="what-s-next"}

完成以下教程, 学习类型, 函数, 以及常数 如何在 Kotlin 和 C 之间映射:

* [映射 C 语言的基本数据类型](mapping-primitive-data-types-from-c.md)
* [映射 C 语言的结构(Struct)和联合(Union)类型](mapping-struct-union-types-from-c.md)
* [映射 C 语言的函数指针(Function Pointer)](mapping-function-pointers-from-c.md)
* [映射 C 语言的字符串](mapping-strings-from-c.md)
