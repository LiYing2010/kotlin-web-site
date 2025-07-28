[//]: # (title: 定义文件)

Kotlin/Native 允许你使用 C 和 Objective-C 库, 你可以在 Kotlin 中使用这些库的功能.
一个称作 cinterop 的专门工具, 会从一个 C 或 Objective-C 库生成对应的 Kotlin 绑定(binding),
然后在你的 Kotlin 代码中就可以象通常那样使用库的方法.

要生成这些绑定, 每个库需要一个定义文件, 通常使用与库相同的名称.
这是一个属性文件, 详细描述库应该如何使用.
参见完整的 [可用属性列表](#properties).

下面是项目中的一般工作流程:

1. 创建一个 `.def` 文件, 描述需要绑定(binding)的内容.
2. 在你的 Kotlin 代码中使用生成的绑定.
3. 运行 Kotlin/Native 编译器, 生成最终的可执行文件.

## 创建并配置定义文件 {id="create-and-configure-a-definition-file"}

我们来为一个 C 库创建定义文件, 并生成绑定:

1. 在你的 IDE 中, 选择 `src` 文件夹, 通过 **File | New | Directory**, 创建一个新目录.
2. 将新目录命名为 `nativeInterop/cinterop`.

   这是 `.def` 文件的默认约定位置, 但如果你使用不同的位置, 也可以在 `build.gradle.kts` 文件中修改设置.
3. 选择新文件夹, 通过 **File | New | File**, 创建一个 `png.def` 文件.
4. 添加必要的属性:

   ```none
   headers = png.h
   headerFilter = png.h
   package = png

   compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
   linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/png/lib -lpng
   linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lpng
   ```

   * `headers` 是需要生成 Kotlin 桩代码(stub)的头文件列表.
     你可以在这个设置项中添加多个文件, 以空格分隔. 在这个示例中, 只设置了 `png.h`.
     引用的文件需要存在于指定的路径中 (在这个示例中, 路径是 `/usr/include/png`).
   * `headerFilter` 指定需要保护的具体内容.
     在 C 中, 当一个文件使用 `#include` 指令引用另一个文件时, 会包含所有的头文件.
     有时不需要包含这些头文件, 你可以 [使用全局模式](https://en.wikipedia.org/wiki/Glob_(programming)) 添加这个参数, 进行调整.

     如果你不想将外部依赖项(例如系统的 `stdint.h` 头文件)提取到互操作库中, 你可以使用 `headerFilter`.
     而且, 它还有助于库大小的优化, 以及解决系统与提供的 Kotlin/Native 编译环境之间潜在的冲突.

   * 如果需要修改某个特定平台上的行为, 你可以使用类似于 `compilerOpts.osx` 或 `compilerOpts.linux` 的格式, 对选项指定平台专用的值.
     在这个示例中, 相关的平台是 macOS (后缀为 `.osx`) 和 Linux (后缀为 `.linux`).
     也可以使用没有后缀的参数(例如, `linkerOpts=`), 会被应用于所有平台.

5. 要生成绑定, 请在通知栏中点击 **Sync Now**, 同步 Gradle 文件.

   ![同步 Gradle 文件](gradle-sync.png)

绑定生成之后, IDE 可以将它用做原生库的代理视图.

> 你也可以在命令行中使用 [cinterop 工具](#generate-bindings-using-command-line), 配置绑定的生成.
> 
{style="tip"}

## 属性 {id="properties"}

下面是你可以在定义文件中使用的属性的完整列表, 你可以通过这些属性来调整生成的二进制文件的内容.
更多详情, 请参见下面的小节.

| **属性**                                                                              | **描述**                                                                                                            |
|-------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| [`headers`](#import-headers)                                                        | 绑定中将会包含的库的头文件列表.                                                                                                  |
| [`modules`](#import-modules)                                                        | 绑定中将会包含的 Objective-C 库的 Clang 模块列表.                                                                               |
| `language`                                                                          | 指定语言. 默认使用 C; 如果需要, 请修改为 `Objective-C`.                                                                           |
| [`compilerOpts`](#pass-compiler-and-linker-options)                                 | cinterop 工具传递给 C 编译器的编译器选项.                                                                                       |
| [`linkerOpts`](#pass-compiler-and-linker-options)                                   | cinterop 工具传递给链接器的链接器选项.                                                                                          |
| [`excludedFunctions`](#ignore-specific-functions)                                   | 需要忽略的函数名称列表, 使用空格分隔.                                                                                              |                                              
| [`staticLibraries`](#include-a-static-library)                                      | [实验性功能](components-stability.md#stability-levels-explained). 将静态库包含到 `.klib` 中.                                   |
| [`libraryPaths`](#include-a-static-library)                                         | [实验性功能](components-stability.md#stability-levels-explained). 目录列表, 使用空格分隔, cinterop 工具会在这些目录中搜索需要包含到 `.klib` 中的库. |
| `packageName`                                                                       | 生成的 Kotlin API 的包名称前缀.                                                                                            |
| [`headerFilter`](#filter-headers-by-globs)                                          | 使用 glob 过滤头文件, 在导入一个库时只包含这些头文件.                                                                                   |
| [`excludeFilter`](#exclude-headers)                                                 | 在导入一个库时排除指定的头文件, 优先度高于 `headerFilter`.                                                                            |
| [`strictEnums`](#configure-enums-generation)                                        | 需要生成为 [Kotlin 枚举](enum-classes.md)的枚举值列表, 使用空格分隔.                                                                 |
| [`nonStrictEnums`](#configure-enums-generation)                                     | 需要生成为整数的枚举值列表, 使用空格分隔.                                                                                            |
| [`noStringConversion`](#set-up-string-conversion)                                   | 函数列表, 使用空格分隔, 这些函数的 `const char*` 参数不要自动转换为 Kotlin 的 `String`.                                                    |
| `allowedOverloadsForCFunctions`                                                     | 默认情况下, 会假定 C 函数具有唯一的名称. 如果有一些函数使用了相同的名称, 那么只会选择其中一个. 但是, 你可以在 `allowedOverloadsForCFunctions` 中指定这些函数, 修改这个动作.    |
| [`disableDesignatedInitializerChecks`](#allow-calling-a-non-designated-initializer) | 禁用不允许将非指定的 Objective-C 初始化器作为 `super()` 构造器调用的编译器检查.                                                              |
| [`foreignExceptionMode`](#handle-objective-c-exceptions)                            | 将 Objective-C 代码中的异常封装为 `ForeignException` 类型的 Kotlin 异常.                                                         |
| [`userSetupHint`](#help-resolve-linker-errors)                                      | 添加一个自定义消息, 例如, 帮助使用者解决链接器错误.                                                                                      |

<!-- | `excludedMacros`                                                                    |                                                                                                                                                                                                                          |
| `objcClassesIncludingCategories`                                                    |                                                                                                                                                                                                                          | -->

除这些属性之外, 你还可以在你的定义文件中包含 [自定义声明](#add-custom-declarations).

### 导入头文件 {id="import-headers"}

如果一个 C 库 没有 Clang 模块, 而是由一组头文件组成, 请使用 `headers` 属性来指定需要导入的头文件:

```none
headers = curl/curl.h
```

#### 使用 glob 过滤头文件 {id="filter-headers-by-globs"}

你可以使用 `.def` 文件内的过滤属性作为 glob 来过滤头文件.
要包含头文件中的声明, 请使用 `headerFilter` 属性.
如果头文件与任何一个 glob 匹配, 那么头文件的声明就会被包含在绑定中.

glob 应用于相对于恰当的包含路径元素的头文件路径, 例如, `time.h` 或 `curl/curl.h`.
因此, 如果通常使用 `#include <SomeLibrary/Header.h>` 指令来包含某个库,
你可以使用下面的过滤设置来过滤头文件:

```none
headerFilter = SomeLibrary/**
```

如果没有指定 `headerFilter`, 那么会包含所有的头文件.
但是, 我们鼓励使用 `headerFilter`, 并尽量精确的指定 glob. 这种情况下, 生成的库只包含必须的声明.
在你的开发环境中升级 Kotlin 或工具时, 可以避免很多问题的发生.

#### 排除头文件 {id="exclude-headers"}

要排除某个头文件, 请使用 `excludeFilter` 属性.
这样可以删除多余的或有问题的头文件, 并优化编译过程,
因为指定的头文件中的声明不会被包含在绑定内容中:

```none
excludeFilter = SomeLibrary/time.h
```

> 如果同一个头文件由 `headerFilter` 指定为包含, 同时又由 `excludeFilter` 指定为排除,
> 那么指定的头文件不会被包含在绑定内容中.
>
{style="note"}

### 导入模块 {id="import-modules"}

如果一个 Objective-C 库有 Clang 模块, 请使用 `modules` 属性指定需要导入的模块:

```none
modules = UIKit
```

### 传递编译器和链接器选项 {id="pass-compiler-and-linker-options"}

请使用 `compilerOpts` 属性向 C 编译器传递选项, 底层会使用 C 编译器分析头文件.
要向链接器传递选项, 请使用 `linkerOpts`, 链接器用来链接最终的可执行代码.
例如:

```none
compilerOpts = -DFOO=bar
linkerOpts = -lpng
```

你也可以指定某个目标平台独有的参数, 这些参数只会被用于指定的目标平台:

```none
compilerOpts = -DBAR=bar
compilerOpts.linux_x64 = -DFOO=foo1
compilerOpts.macos_x64 = -DFOO=foo2
```

通过这样的配置, 头文件在 Linux 上的会使用 `-DBAR=bar -DFOO=foo1` 参数进行分析,
在 macOS 上则会使用 `-DBAR=bar -DFOO=foo2` 参数进行分析.
注意, 定义文件的任何参数, 都可以包含共通的, 以及平台独有的两部分.

### 忽略指定的函数 {id="ignore-specific-functions"}

使用 `excludedFunctions` 属性来指定需要忽略的函数名称列表.
如果头文件声明中的一个函数, 并不保证一定可以调用, 而且常常很难, 甚至不可能自动判断, 那么这个功能会非常有用.
你也可以使用这个属性 来绕过 interop 工具本身的 bug.

### 包含一个静态库 {id="include-a-static-library"}

> 这个功能是 [实验性功能](components-stability.md#stability-levels-explained).
> 它随时有可能变更或被删除.
> 请注意, 只为评估目的来使用这个功能.
>
{style="warning"}

有些时候, 发布你的程序时附带上所需要的静态库, 而不是假定它在用户的环境中已经存在了, 这样会更便利一些.
如果需要在 `.klib` 中包含静态库, 请使用 `staticLibrary` 和 `libraryPaths` 属性:

```none
headers = foo.h
staticLibraries = libfoo.a
libraryPaths = /opt/local/lib /usr/local/opt/curl/lib
```

如果指定了以上设置, cinterop 工具会在 `/opt/local/lib` 和 `/usr/local/opt/curl/lib` 目录中搜索 `libfoo.a` 文件,
如果找到, 就会把这个库的二进制文件包含到 `klib` 内.

在你的程序中使用这样的 `klib`, 库会被自动链接到你的程序内.

### 配置枚举的生成方式 {id="configure-enums-generation"}

使用 `strictEnums` 属性, 将枚举生成为 Kotlin 的枚举类型,
或使用 `nonStrictEnums` 属性, 生成为整数值.
如果一个枚举型在这两个属性列表中都没有包括, 那么就根据启发式方法(heuristic)来生成.

### 设置字符串的转换 {id="set-up-string-conversion"}

使用 `noStringConversion` 属性来禁用 `const char*` 函数参数到 Kotlin `String` 的自动转换.

### 允许调用非指定的初始化器(non-designated initializer) {id="allow-calling-a-non-designated-initializer"}

默认情况下, Kotlin/Native 编译器不允许将非指定的 Objective-C 初始化器作为 `super()` 构造器调用.
如果非指定的 Objective-C 初始化器在库中没有正确的标记, 那么这个行为可能会不太方便.
要禁止这个编译器检查, 请使用 `disableDesignatedInitializerChecks` 属性.

### 处理 Objective-C 的异常 {id="handle-objective-c-exceptions"}

默认情况下, 如果 Objective-C 的异常到达了 Objective-C 到 Kotlin 的互操作边界, 并进入到 Kotlin 代码中, 那么程序会崩溃.

要让 Objective-C 异常传播到 Kotlin 中, 请使用 `foreignExceptionMode = objc-wrap` 属性, 允许异常的封装.
这种情况下, Objective-C 异常会被翻译为 Kotlin 异常, 类型为 `ForeignException`.

### 帮助解决链接器错误 {id="help-resolve-linker-errors"}

当一个 Kotlin 库依赖于一个 C 或 Objective-C 库时, 可能会发生链接器错误,
例如, 使用 [CocoaPods 集成](multiplatform-cocoapods-overview.md) 的情况.
如果依赖的库在当前机器上没有安装, 在项目的构建脚本中也没有明确的配置, 就会发生 "Framework not found" 错误.

如果你是库的作者, 你可以通过自定义消息来帮助你的使用者解决链接器错误.
方法是, 在你的 `.def` 文件中添加 `userSetupHint=message` 属性, 或者向 `cinterop` 传递 `-Xuser-setup-hint` 编译器选项.

### 添加自定义声明 {id="add-custom-declarations"}

在生成绑定之前, 有时会需要向库添加自定义的 C 声明(比如, 对 [宏](native-c-interop.md#macros)).
你不需要为这些声明创建一个额外的头文件, 可以将它们直接包含在 `.def` 文件尾部, 放在一个分隔行 `---` 之后:

```none
headers = errno.h
---

static inline int getErrno() {
    return errno;
}
```

注意, `.def` 文件的这部分内容会被当做头文件的一部分, 因此, 带函数体的函数应该声明为 `static` 函数.
这些声明的内容, 会在 `headers` 列表中的文件被引入之后, 再被解析.

## 使用命令行生成绑定 {id="generate-bindings-using-command-line"}

除了定义文件之外, 你还可以将对应的属性用作 `cinterop` 命令的选项, 指定在绑定中包含哪些内容.

下面是一个示例, 这个命令将会生成一个编译后的库, 名为 `png.klib`:

```bash
cinterop -def png.def -compiler-option -I/usr/local/include -o png
```

注意, 生成的绑定通常是平台专有的, 因此如果你需要针对多个平台进行开发, 那么需要重新生成这些绑定.

* 没有包含在 sysroot 搜索路径中的对于主机库(Host Library), 可能需要头文件.
* 对于一个典型的带配置脚本的 UNIX 库, 使用 `--cflags` 选项运行配置脚本的输出结果,
  通常可以用于 `compilerOpts`, (但可能不使用完全相同的路径).
* 使用 `--libs` 参数运行配置脚本的输出结果, 可以用于 `linkerOpts` 属性.

## 下一步做什么 {id="what-s-next"}

* [与 C 代码交互中的绑定](native-c-interop.md#bindings)
* [与 Swift/Objective-C 代码交互](native-objc-interop.md)
