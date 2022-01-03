---
type: doc
layout: reference
category: "Native"
title: "与 C 代码交互"
---

# 与 C 代码交互

本页面最终更新: 2021/08/25

Kotlin/Native 遵循 Kotlin 的传统, 提供与既有的平台软件的优秀的互操作性.
对于原生程序来说, 最重要的互操作性对象就是与 C 语言库.
因此 Kotlin/Native 附带了 `cinterop` 工具,
可以用来快速生成与既有的外部库交互时所需要的一切.

与原生库交互时的工作流程如下:
1. 创建一个 `.def` 文件, 描述需要绑定(binding)的内容.
2. 使用 `cinterop` 工具生成绑定.
3. 运行 Kotlin/Native 编译器, 编译应用程序, 产生最终的可执行文件.

互操作性工具会分析 C 语言头文件, 并产生一个 "自然的" 映射,
将数据类型, 函数, 常数, 引入到 Kotlin 语言的世界.
工具生成的桩代码(stub)可以导入 IDE, 用来帮助代码自动生成, 以及代码跳转.

此外还提供了与 Swift/Objective-C 语言的互操作功能,
详情请参见 [与 Swift/Objective-C 的交互](native-objc-interop.html).

## 平台库

注意, 很多情况下不要用到自定义的互操作库创建机制(我们后文将会介绍),
因为对于平台上的标准绑定中的那些 API, 可以使用 [平台库](native-platform-libs.html).
比如, Linux/macOS 平台上的 POSIX, Windows 平台上的 Win32, macOS/iOS 平台上的以及 Apple 框架, 都可以通过这种方式来使用.

## 一个简单的示例

首先我们安装 libgit2, 并为 git 库准备桩代码:

```bash

cd samples/gitchurn
../../dist/bin/cinterop -def src/nativeInterop/cinterop/libgit2.def \
 -compiler-option -I/usr/local/include -o libgit2
```

编译客户端代码:

```bash
../../dist/bin/kotlinc src/gitChurnMain/kotlin \
 -library libgit2 -o GitChurn
```

运行客户端代码:

```bash
./GitChurn.kexe ../..
```

## 为一个新库创建绑定

要对一个新的库创建绑定, 首先要创建一个 `.def` 文件.
它的结构只是一个简单的 property 文件, 大致是这个样子:

```c
headers = png.h
headerFilter = png.h
package = png
```

然后运行 `cinterop` 文件, 参数大致如下
(注意, 对于主机上没有被包含到 sysroot 查找路径的那些库, 可能需要指定头文件):

```bash
cinterop -def png.def -compiler-option -I/usr/local/include -o png
```

这个命令将会生成一个编译后的库, 名为 `png.klib`,
以及 `png-build/kotlin` 目录, 其中包含这个库的 Kotlin 源代码.

如果需要修改针对某个平台的参数, 你可以使用 `compilerOpts.osx` 或 `compilerOpts.linux` 这样的格式,
来指定这个平台专用的命令行选项.

注意, 生成的绑定通常是平台专有的,
因此如果你需要针对多个平台进行开发, 那么需要重新生成这些绑定.

生成绑定后, IDE 可以使用其中的信息来查看原生库.

对于一个典型的带配置脚本的 Unix 库, 使用 `--cflags` 参数运行配置脚本的输出结果,
通常可以用做 `compilerOpts`, (但可能不使用完全相同的路径).

使用 `--libs` 参数运行配置脚本的输出结果,
编译时可以用作 `kotlinc` 的 `-linkedArgs` 参数值(带引号括起).

### 选择库的头文件

使用 `#include` 指令将库的头文件导入 C 程序时, 这些头文件包含的所有其他头文件也会一起被导入.
因此, 在生成的 stub 代码内, 也会带有所有依赖到的其他头文件.

这种方式通常是正确的, 但对于某些类来说可能非常不方便.
因此可以在 `.def` 文件内指定需要导入哪些头文件.
如果直接依赖某个头文件的话, 也可以对它单独声明.

#### 使用 glob 过滤头文件

也可以使用 glob 过滤头文件. `.def` 文件内的 `headerFilter` 属性值会被看作一个空格分隔的 glob 列表.
如果包含的头文件与任何一个 glob 匹配, 那么这个头文件中的声明就会被包含在绑定内容中.

glob 应用于 相对于恰当的包含路径元素的头文件路径, 比如, `time.h` 或 `curl/curl.h`.
因此, 如果通常使用 `#include <SomeLibrary/Header.h>` 指令来包含某个库, 那么应该使用下面的代码来过滤头文件:

```c
headerFilter = SomeLibrary/**
```

如果没有指定 `headerFilter`, 那么所有的头文件都会被引入.

#### 使用模块映射过滤头文件

有些库在它的头文件中带有 `module.modulemap` 或 `module.map` 文件.
比如, macOS 和 iOS 系统库和框架就是这样.
[模块映射文件(module map file)](https://clang.llvm.org/docs/Modules.html#module-map-language)
描述头文件与模块之间的对应关系.
如果存在模块映射, 那么可以使用 `.def` 文件的实验性的 `excludeDependentModules` 选项,
将模块中没有直接使用的头文件过滤掉:

```c
headers = OpenGL/gl.h OpenGL/glu.h GLUT/glut.h
compilerOpts = -framework OpenGL -framework GLUT
excludeDependentModules = true
```

如果同时使用 `excludeDependentModules` 和 `headerFilter`, 那么最终起作用的将是二者的交集.

### C 编译器与链接器选项

可以在定义文件中使用 `compilerOpts` 和 `linkerOpts` 来分别指定
传递给 C 编译器 (用于分析头文件, 比如预处理定义信息)
和链接器 (用于链接最终的可执行代码) 的参数.
比如:

```c
compilerOpts = -DFOO=bar
linkerOpts = -lpng
```

也可以指定某个目标平台独有的参数, 比如:


 ```c
 compilerOpts = -DBAR=bar
 compilerOpts.linux_x64 = -DFOO=foo1
 compilerOpts.mac_x64 = -DFOO=foo2
 ```

通过这样的配置, C 头文件在 Linux 上的会使用 `-DBAR=bar -DFOO=foo1` 参数进行分析,
macOS 上则会使用 `-DBAR=bar -DFOO=foo2` 参数进行分析.
注意, 定义文件的任何参数, 都可以包含共用的, 以及平台独有的两部分.

### 添加自定义声明

在生成绑定之前, 有时会需要向库添加自定义的 C 声明(比如, 对 [宏](#macros)).
你可以将它们直接包含在 `.def` 文件尾部,
放在一个分隔行 `---` 之后, 而不需要为他们创建一个额外的头文件:

```c
headers = errno.h

---

static inline int getErrno() {
    return errno;
}
```

注意, `.def` 文件的这部分内容会被当做头文件的一部分, 因此, 带函数体的函数应该声明为 `static` 函数.
这些声明的内容, 会在 `headers` 列表中的文件被引入之后, 再被解析.

### 将静态库包含到你的 klib 库中

有些时候, 发布你的程序时附带上所需要的静态库, 而不是假定它在用户的环境中已经存在了, 这样会更便利一些.
如果需要在 `.klib` 中包含静态库, 可以使用 `staticLibrary` 和 `libraryPaths` 语句.
比如:

```c
headers = foo.h
staticLibraries = libfoo.a
libraryPaths = /opt/local/lib /usr/local/opt/curl/lib
```

如果指定了以上内容, 那么 `cinterop` 工具将会在
`/opt/local/lib` 和 `/usr/local/opt/curl/lib` 目录中搜索 `libfoo.a` 文件,
如果找到这个文件, 就会把这个库包含到 `klib` 内.

使用这样的 `klib`, 库文件会就被自动链接到你的程序内.

## 绑定

### 基本的 interop 数据类型

C 中支持的所有数据类型, 都有对应的 Kotlin 类型:

*   有符号整数, 无符号整数, 以及浮点类型, 会被映射为 Kotlin 中的同样类型, 并且长度相同.
*   指针和数组映射为 `CPointer<T>?` 类型.
*   枚举型映射为 Kotlin 的枚举型, 或整数型,
    由 heuristic 以及 [定义文件中的提示](#definition-file-hints) 决定.
*   结构体(Struct)和联合体(Union)映射为通过点号访问的域的形式,
    也就是 `someStructInstance.field1` 的形式.
*   `typedef` 映射为 `typealias`.

此外, 任何 C 类型都有对应的 Kotlin 类型来表达这个类型的左值(lvalue),
也就是, 在内存中分配的那个值, 而不是简单的不可变的自包含值.
你可以想想 C++ 的引用, 与这个概念类似.
对于结构体(Struct) (以及指向结构体的 `typedef`) 左值类型就是它的主要表达形式,
而且使用与结构体本身相同的名字, 对于 Kotlin 枚举类型, 左值类型名称是 `${type}Var`,
对于 `CPointer<T>`, 左值类型名称是 `CPointerVar<T>`,
对于大多数其他类型, 左值类型名称是 `${type}Var`.

对于兼有这两种表达形式的类型, 包含 "左值(lvalue)" 的那个类型,
带有一个可变的 `.value` 属性, 可以用来访问这个左值.

#### 指针类型

`CPointer<T>` 的类型参数 `T` 必须是上面介绍的 "左值(lvalue)" 类型之一,
比如, C 类型 `struct S*` 会被映射为 `CPointer<S>`,
`int8_t*` 会被映射为 `CPointer<int_8tVar>`,
`char**` 会被映射为 `CPointer<CPointerVar<ByteVar>>`.

C 的空指针(null) 在 Kotlin 中表达为 `null`,
指针类型 `CPointer<T>` 是不可为空的, 而 `CPointer<T>?` 类型则是可为空的.
这种类型的值支持 Kotlin 的所有涉及 `null` 值处理的操作, 比如 `?:`, `?.`, `!!` 等等:

```kotlin
val path = getenv("PATH")?.toKString() ?: ""
```

由于数组也被映射为 `CPointer<T>`,
因此这个类型也支持 `[]` 操作, 可以使用下标来访问数组中的值:

```kotlin
fun shift(ptr: CPointer<BytePtr>, length: Int) {
    for (index in 0 .. length - 2) {
        ptr[index] = ptr[index + 1]
    }
}
```

`CPointer<T>` 的 `.pointed` 属性返回这个指针指向的那个位置的类型 `T` 的左值.
相反的操作是 `.ptr`: 它接受一个左值, 返回一个指向它的指针.

`void*` 映射为 `COpaquePointer` – 这是一个特殊的指针类型, 它是任何其他指针类型的超类.
因此, 如果 C 函数接受 `void*` 类型参数, 那么绑定的 Kotlin 函数就可以接受任何 `CPointer` 类型参数.

可以使用 `.reinterpret<T>` 来对一个指针进行类型变换(包括 `COpaquePointer`), 例如:

```kotlin
val intPtr = bytePtr.reinterpret<IntVar>()
```

或者

```kotlin
val intPtr: CPointer<IntVar> = bytePtr.reinterpret()
```

和 C 一样, 这样的类型变换是不安全的, 可能导致应用程序发生潜在的内存错误.

对于 `CPointer<T>?` 和 `Long` 也有不安全的类型变换方法,
由扩展函数 `.toLong()` 和 `.toCPointer<T>()` 实现:

```kotlin
val longValue = ptr.toLong()
val originalPtr = longValue.toCPointer<T>()
```

注意, 如果结果类型可以通过上下文确定, 那么类型参数可以省略, 就象 Kotlin 中通常的类型系统一样.

### 内存分配

可以使用 `NativePlacement` 接口来分配原生内存, 比如:

```kotlin
val byteVar = placement.alloc<ByteVar>()
```

或者

```kotlin
val bytePtr = placement.allocArray<ByteVar>(5)
```

内存最 "自然" 的位置就是在 `nativeHeap` 对象内.
这个操作就相当于使用 `malloc` 来分配原生内存,
另外还提供了 `.free()` 操作来释放已分配的内存:

```kotlin
val buffer = nativeHeap.allocArray<ByteVar>(size)
<使用 buffer>
nativeHeap.free(buffer)
```

然而, 分配的内存的生命周期通常会限定在一个指明的作用范围内.
可以使用 `memScoped { ... }` 来定义这样的作用范围.
在括号内部, 可以以隐含的接收者的形式访问到一个临时的内存分配位置,
因此可以使用 `alloc` 和 `allocArray` 来分配原生内存,
离开这个作用范围后, 已分配的这些内存会被自动释放.

比如, 如果一个 C 函数, 使用指针参数返回值, 可以用下面这种方式来使用这个函数:

```kotlin
val fileSize = memScoped {
    val statBuf = alloc<stat>()
    val error = stat("/", statBuf.ptr)
    statBuf.st_size
}
```

### 向绑定传递指针

尽管 C 指针被映射为 `CPointer<T>` 类型, 但 C 函数的指针型参数会被映射为 `CValuesRef<T>` 类型.
如果向这样的参数传递 `CPointer<T>` 类型的值, 那么会原样传递给 C 函数.
但是, 也可以直接传递值的序列, 而不是传递指针.
这种情况下, 序列会以值的形式传递(by value),
也就是说, C 函数收到一个指针, 指向这个值序列的一个临时拷贝, 这个临时拷贝只在函数返回之前存在.

`CValuesRef<T>` 形式表达的指针型参数是为了用来支持 C 数组字面值, 而不必明确地进行内存分配操作.
为了构造一个不可变的自包含的 C 的值的序列, 可以使用下面这些方法:

*   `${type}Array.toCValues()`, 其中 `type` 是 Kotlin 的基本类型
*   `Array<CPointer<T>?>.toCValues()`, `List<CPointer<T>?>.toCValues()`
*   `cValuesOf(vararg elements: ${type})`, 其中 `type` 是基本类型, 或指针

比如:

C 代码:

```c
void foo(int* elements, int count);
...
int elements[] = {1, 2, 3};
foo(elements, 3);
```

Kotlin 代码:

```kotlin
foo(cValuesOf(1, 2, 3), 3)
```

### 字符串

与其它指针不同, `const char*` 类型参数会被表达为 Kotlin 的 `String` 类型.
因此对于 C 中期望字符串的绑定, 可以传递 Kotlin 的任何字符串值.

还有一些工具, 可以用来在 Kotlin 和 C 的字符串之间进行手工转换:

*   `fun CPointer<ByteVar>.toKString(): String`
*   `val String.cstr: CValuesRef<ByteVar>`.

要得到指针, `.cstr` 应该在原生内存中分配, 比如:

```
val cString = kotlinString.cstr.getPointer(nativeHeap)
```

在所有这些场合, C 字符串的编码都是 UTF-8.

要跳过字符串的自动转换, 并确保在绑定中使用原生的指针,
可以在 `.def` 文件中使用 `noStringConversion` 语句, 也就是:

```c
noStringConversion = LoadCursorA LoadCursorW
```

通过这种方式, 任何 `CPointer<ByteVar>` 类型的值都可以传递给 `const char*` 类型的参数.
如果需要传递 Kotlin 字符串, 可以使用这样的代码:

```kotlin
memScoped {
    LoadCursorA(null, "cursor.bmp".cstr.ptr)   // 对这个函数的 ASCII 版
    LoadCursorW(null, "cursor.bmp".wcstr.ptr)  // 对这个函数的 Unicode 版
}
```

### 作用范围内的局部指针

`memScoped { ... }` 内有一个 `CValues<T>.ptr` 扩展属性,
使用它可以创建一个指向 `CValues<T>` 的 C 指针, 这个指针被限定在一个作用范围内.
通过它可以使用需要 C 指针的 API, 指针的生命周期限定在特定的 `MemScope` 内. 比如:

```kotlin
memScoped {
    items = arrayOfNulls<CPointer<ITEM>?>(6)
    arrayOf("one", "two").forEachIndexed { index, value -> items[index] = value.cstr.ptr }
    menu = new_menu("Menu".cstr.ptr, items.toCValues().ptr)
    ...
}
```

在这个示例程序中, 所有传递给 C API `new_menu()` 的值, 生命周期都被限定在它所属的最内层的 `memScope` 之内.
一旦程序的执行离开了 `memScoped` 作用范围, C 指针就不再存在了.

### 以值的方式传递和接收结构

如果一个 C 函数以传值的方式接受结构体(Struct)或联合体(Union) `T` 类型的参数,
或者以传值的方式返回结构体(Struct)或联合体(Union) `T` 类型的结果,
对应的参数类型或结果类型会被表达为 `CValue<T>`.

`CValue<T>` 是一个不透明(opaque)类型, 因此无法通过适当的 Kotlin 属性访问到 C 结构体的域.
如果 API 以句柄的形式使用结构体, 那么这样是可行的,
但是如果确实需要访问结构体中的域, 那么可以使用以下转换方法:

*   `fun T.readValue(): CValue<T>`. 将(左值) `T` 转换为一个 `CValue<T>`.
    因此, 如果要构造一个 `CValue<T>`, 可以先分配 `T`, 为其中的域赋值, 然后将它转换为 `CValue<T>`.

*   `CValue<T>.useContents(block: T.() -> R): R`.
    将 `CValue<T>` 临时放到内存中, 然后使用放置在内存中的这个 `T` 值作为接收者, 来运行参数中指定的 Lambda 表达式.
    因此, 如果要读取结构体中一个单独的域, 可以使用下面的代码:

    ```kotlin
    val fieldValue = structValue.useContents { field }
    ```

### 回调

如果要将一个 Kotlin 函数转换为一个指向 C 函数的指针, 可以使用 `staticCFunction(::kotlinFunction)`.
也可以使用 Lambda 表达式来代替函数引用.
这里的函数或 Lambda 表达式不能捕获任何值.

#### 向回调传递用户数据

C API 经常允许向回调传递一些用户数据. 这些数据通常由用户在设置回调时提供.
数据使用比如 `void*` 的形式, 传递给某些 C 函数 (或写入到结构体内).
但是, Kotlin 对象的引用无法直接传递给 C.
因此需要在设置回调之前包装这些数据, 然后在回调函数内部将它们解开,
这样才能通过 C 函数来再两段 Kotlin 代码之间传递数据.
这种数据包装可以使用 `StableRef` 类实现.

要封装一个 Kotlin 对象的引用, 可以使用以下代码:

```kotlin
val stableRef = StableRef.create(kotlinReference)
val voidPtr = stableRef.asCPointer()
```

这里的 `voidPtr` 是一个 `COpaquePointer` 类型, 因此可以传递给 C 函数.

要解开这个引用, 可以使用以下代码:

```kotlin
val stableRef = voidPtr.asStableRef<KotlinClass>()
val kotlinReference = stableRef.get()
```

这里的 `kotlinReference` 就是封装之前的 Kotlin 对象引用.

创建 `StableRef` 后, 最终需要使用 `.dispose()` 方法手动释放, 以避免内存泄漏:

```kotlin
stableRef.dispose()
```

释放后, 它就变得不可用了, 因此 `voidPtr` 也不能再次解开.

更多详情请参见 `samples/libcurl`.

### 宏

每个展开为常数的 C 语言宏, 都会表达为一个 Kotlin 属性.
其他的宏都不支持. 但是, 可以将它们封装在支持的声明中, 这样就可以手动映射这些宏.
比如, 类似于函数的宏 `FOO` 可以映射为函数 `foo`,
方法是向库 [添加自定义的声明](#add-custom-declarations):

```c
headers = library/base.h

---

static inline int foo(int arg) {
    return FOO(arg);
}
```

### 定义文件提示

`.def` 支持几种选项, 用来调整最终生成的绑定.

*   `excludedFunctions` 属性值是一个空格分隔的列表, 表示哪些函数应该忽略.
    有时会需要这个功能, 因为 C 头文件中的一个函数声明, 并不保证它一定可以调用,
    而且常常很难, 甚至不可能自动判断.
    这个选项也可以用来绕过 interop 工具本身的 bug.

*   `strictEnums` 和 `nonStrictEnums` 属性值是空格分隔的列表,
    分别表示哪些枚举类型需要生成为 Kotlin 枚举类型, 哪些需要生成为整数值.
    如果一个枚举型在这两个属性中都没有包括, 那么就根据 heuristic 来生成.

*    `noStringConversion` 属性值是一个空格分隔的列表,
    表示哪些函数的 `const char*` 参数应该不被自动转换为 Kotlin 的字符串类型.

### 可移植性

有时, C 库中的函数参数, 或结构体的域使用了依赖于平台的数据类型, 比如 `long` 或 `size_t`.
Kotlin 本身没有提供隐含的整数类型转换, 也没有提供 C 风格的整数类型转换 (比如, `(size_t) intValue`),
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
fun zeroMemory(buffer: COpaquePointer, size: Int) {
    memset(buffer, 0, size.convert<size_t>())
}
```

而且, 这个函数的类型参数可以自动推定得到, 因此很多情况下可以省略.

### 对象固定

Kotlin 对象可以固定(pin), 也就是, 确保它们在内存中的位置不会变化, 直到解除固定(unpin)为止,
而且, 指向这些对象的内部数据的指针, 可以传递给 C 函数. 比如:

```kotlin
fun readData(fd: Int): String {
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

这里我们使用了服务函数 `usePinned`, 它会先固定一个对象, 然后执行一段代码,
最后无论是正常结束还是异常结束, 它都会将对象解除固定.
