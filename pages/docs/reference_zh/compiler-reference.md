---
type: doc
layout: reference
title: "Kotlin 编译器选项"
---

# Kotlin 编译器选项

Kotlin 的各个发布版都带有针对各种编译目标的编译器:
JVM, JavaScript, 以及 [所支持的各种平台](native-overview.html#target-platforms) 的原生二进制可执行文件(native binary).

当你对你的 Kotlin 工程按下 __Compile__ 或 __Run__ 按钮时, IDE 会使用这些编译器.  

你也可以从命令行手动运行 Kotlin 编译器, 详情请参见教程 [使用命令行编译器](/docs/tutorials/command-line.html).

## 编译器选项

Kotlin 编译器带有很多选项, 用于控制编译过程.
本章会列出针对各种编译目标的编译器选项, 并分别进行介绍.

有几种方式来设置各个编译器选项, 以及相应的值(即 _编译参数(compiler argument)_):
- 在 IntelliJ IDEA 中, 可以在
  __Settings | Build, Execution, Deployment | Compilers | Kotlin Compiler__
  设定窗口的
  __Additional command-line parameters__
  文本框中输入编译器参数
- 如果使用 Gradle, 可以在 Kotlin 编译任务的 `kotlinOptions` 属性中指定编译参数.
详情请参见 [使用 Gradle](using-gradle.html#compiler-options).
- 如果使用 Maven, 可以在 Maven 插件的 `<configuration>` 元素中指定编译参数 .
详情请参见 [使用 Maven](using-maven.html#specifying-compiler-options).
- 如果在命令行运行编译器, 可以在调用编译器时直接添加编译参数, 或者将编译参数写在 [参数文件](#argfile) 内.
  例如:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
$ kotlinc hello.kt -include-runtime -d hello.jar
```

</div>

>**Note**: 在 Windows 上, 如果传递的编译器参数中包含分隔字符(空格, `=`, `;`, `,`),
> 请将这些参数值使用双引号(`"`)括起.
>```
>$ kotlinc.bat hello.kt -include-runtime -d "My Folder\hello.jar"
>```
{:.note}


## 各平台共通选项

下面是所有 Kotlin 编译器的共通选项.

### `-version`

显示编译器版本.
{:.details-group}

### `-nowarn`

进制编译器在编译过程中显示警告信息.
{:.details-group}

### `-Werror`

将警告信息变为编译错误.
{:.details-group}

### `-verbose`

允许输出最详细的 log, 其中包括编译过程的各种细节信息.
{:.details-group}

### `-script`

运行 Kotlin 脚本文件. 使用这个选项调用编译器时, 编译器会运行参数中指定的第一个 Kotlin 脚本文件(`*.kts`).
{:.details-group}

### `-help` (`-h`)

显示编译器使用方法的帮助信息, 然后退出. 帮助信息中只会显示标准的编译选项.
如果需要显示更多的高级编译选项, 请使用 `-X` 参数.
{:.details-group}

### `-X`

显示编译器高级选项的帮助信息, 然后退出. 这些选项目前还不稳定:
选项的名称和行为都有可能变更, 并且不会有相关公告.
{:.details-group}

### `-kotlin-home <path>`

对 Kotlin 编译器指定一个自定义的路径, 用来查找运行时期的库文件.
{:.details-group}

### `-P plugin:<pluginId>:<optionName>=<value>`

向 Kotlin 编译器插件传递一个选项.
相关的编译器插件, 以及它们的选项, 请参见 [编译器插件(plugin)](compiler-plugins.html).
{:.details-group}

### `-language-version <version>`

与指定的 Kotlin 版本保持源代码级兼容.
{:.details-group}

### `-api-version <version>`

允许使用从指定的 Kotlin 版本的库才开始提供的 API 声明.
{:.details-group}

### `-progressive`

允许编译器使用 [渐进模式(progressive mode)](whatsnew13.html#progressive-mode).
{:.details-group}
在渐进模式下, 对不稳定代码中功能废弃和 bug 修正, 会立即生效, 而不会等待完整的版本迁移周期完成.
渐进模式下编写的代码可以向后兼容(backwards compatible); 但是, 非渐进模式下编写的代码, 在渐进模式下编译时, 可能导致编译错误.
{:.details-group}

{:#argfile}

### `@<argfile>`

从指定的文件中读取编译器选项 . 这样的文件可以包含编译器选项, 相应的值, 以及源代码文件的路径.
选项和文件路径使用空格分隔. 比如:
{:.details-group}

<div class="sample" markdown="1" mode="shell" theme="idea">

```
-include-runtime -d hello.jar
hello.kt
```

</div>

如果想要传递的参数值本身包含空格, 请使用单引号 (**'**) 或双引号 (**"**) 将参数值括起.
如果参数值本身包含引号, 请使用反斜线 (**\\**) 转义符表示.
{:.details-group}

<div class="sample" markdown="1" mode="shell" theme="idea">

```
-include-runtime -d 'My folder'
```

</div>

也可以传递多个参数文件, 比如, 如果想要将编译器选项和源代码文件分开的情况.
{:.details-group}

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
$ kotlinc @compiler.options @classes
```

</div>

如果文件位置不在当前目录下, 请使用相对路径.
{:.details-group}

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
$ kotlinc @options/compiler.options hello.kt
```

</div>

## Kotlin/JVM 编译器选项

针对 JVM 平台的 Kotlin 编译器将 Kotlin 源代码文件编译为 Java class 文件.
将 Kotlin 文件编译到 JVM 平台的命令行工具是 `kotlinc` 和 `kotlinc-jvm`.
也可以使用它们来运行 Kotlin 脚本文件.

除 [共通选项](#common-options) 之外, Kotlin/JVM 编译器还支持以下选项.

### `-classpath <path>` (`-cp <path>`)

在指定的路径中查找 class 文件.
如果 classpath 中存在多个路径, 请使用操作系统的路径分隔符来分隔(对 Windows 系统是 **;** , 对 macOS/Linux 系统是 **:**).
classpath 可以包含文件路径, 目录路径, ZIP 文件, 或 JAR 文件.
{:.details-group}

### `-d <path>`

将生成的 class 文件输出到指定的位置. 输出位置可以是一个目录, 一个 ZIP 文件, 或一个 JAR 文件.
{:.details-group}

### `-include-runtime`

将 Kotlin 运行时库文件包含在最终输出的结果 JAR 文件中.
这样将使得最终输出的包可以在任何安装了 Java 环境中运行.
{:.details-group}

### `-jdk-home <path>`

如果自定义的 JDK home 目录与默认的 `JAVA_HOME` 不用, 这个选项会将它添加到 classpath 中.
{:.details-group}

### `-jvm-target <version>`

指定编译产生的 JVM 字节码(bytecode)版本. 可以指定的值是 `1.6`, `1.8`, `9`, `10`, `11`, `12`, `13`, `14` 以及 `15`.
默认值是 `1.6`.
{:.details-group}

### `-java-parameters`

针对 Java 1.8 的方法参数反射(reflection on method parameter)生成元信息(metadata).
译者注: 等于 Java 1.8 编译参数 `-parameters`, 参见 [javac 命令行编译器](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/javac.html)
{:.details-group}

### `-module-name <name>`

对编译产生的 `.kotlin_module` 指定一个自定义的名称.
{:.details-group}

### `-no-jdk`

不要自动将 Java 运行时期库文件添加到 classpath 中.
{:.details-group}

### `-no-reflect`

不要自动将 Kotlin 反射库文件(`kotlin-reflect.jar`) 添加到 classpath 中.
{:.details-group}

### `-no-stdlib`

不要自动将 Kotlin/JVM 标准库文件(`kotlin-stdlib.jar`) 和 Kotlin 反射库文件(`kotlin-reflect.jar`) 添加到 classpath 中.
{:.details-group}

### `-script-templates <classnames[,]>`

脚本定义的模板类. 请使用类的完全限定名称, 如果有多个, 请使用逗号(**,**) 分隔.
{:.details-group}


## Kotlin/JS 编译器 选项

针对 JS 平台的 Kotlin 编译器将 Kotlin 源代码文件编译为 JavaScript 代码.
将 Kotlin 文件编译到 JS 平台的命令行工具是 `kotlinc-js`.

除 [共通选项](#common-options) 之外, Kotlin/JS 编译器还支持以下选项.

### `-libraries <path>`

包含 `.meta.js` 和 `.kjsm` 文件的 Kotlin 库路径, 如果有多个路径, 请使用操作系统的路径分隔符分隔.
{:.details-group}

### `-main {call|noCall}`

指定执行时是否要调用 `main` 函数.
{:.details-group}

### `-meta-info`

生成 `.meta.js` 和 `.kjsm` 文件时附带元信息(metadata).
开发 JS 库时, 请使用这个选项 .
{:.details-group}

### `-module-kind {umd|commonjs|amd|plain}`

指定编译器生成的 JS 模块类型:
{:.details-group}
- `umd` - [统一模块定义(Universal Module Definition)](https://github.com/umdjs/umd) 模块
- `commonjs` - [CommonJS](http://www.commonjs.org/) 模块
- `amd` - [异步模块定义(Asynchronous Module Definition)](https://en.wikipedia.org/wiki/Asynchronous_module_definition) 模块
- `plain` - 普通 JS 模块

关于各种 JS 模块类型, 以及它们之间的差别, 请参见 [这篇文章](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/).
{:.details-group}

### `-no-stdlib`

不要自动将默认的 Kotlin/JS 标准库添加到编译依赖中.
{:.details-group}

### `-output <filepath>`

指定编译结果的输出目标文件. 参数值必须是一个 `.js` 文件路径, 包含文件名.
{:.details-group}

### `-output-postfix <filepath>`

将指定文件的内容添加到编译输出文件的末尾部分.
{:.details-group}

### `-output-prefix <filepath>`

将指定文件的内容添加到编译输出文件的先头部分.
{:.details-group}

### `-source-map`

生成源代码映射文件(source map).
{:.details-group}

### `-source-map-base-dirs <path>`

使用指定的路径作为起始目录(base directory). 起始目录用来计算源代码映射文件(source map)中的相对路径.
{:.details-group}

### `-source-map-embed-sources {always|never|inlining}`

是否将源代码文件嵌入到源代码映射文件(source map)中.
{:.details-group}

### `-source-map-prefix`

向源代码映射文件(source map)中的路径添加指定的前缀.
{:.details-group}


## Kotlin/Native 编译器选项

Kotlin/Native 编译器将 Kotlin 源代码文件编译为 [所支持的各种平台](native-overview.html#target-platforms) 的二进制可执行文件(native binary).
Kotlin/Native 编译的命令行工具是 `kotlinc-native`.

除 [共通选项](#common-options) 之外, Kotlin/Native 编译器还支持以下选项.


### `-enable-assertions` (`-ea`)

在生成的代码中允许运行时断言(runtime assertion).
{:.details-group}

### `-g`

允许编译产生 debug 信息.
{:.details-group}

### `-generate-test-runner` (`-tr`)

生成一个应用程序, 用于在工程中运行单元测试.
{:.details-group}    
### `-generate-worker-test-runner` (`-trw`)

生成一个应用程序, 用于在 [工作线程(worker thread)](native/concurrency.html#workers) 中运行单元测试 .
{:.details-group}

### `-generate-no-exit-test-runner` (`-trn`)

生成一个应用程序, 用于运行单元测试, 但不会有明确的进程结束信息(explicit process exit).
{:.details-group}

### `-include-binary <path>` (`-ib <path>`)

将外部的二进制文件打包到编译产生的 klib 文件内.
{:.details-group}

### `-library <path>` (`-l <path>`)

链接指定的库文件. 关于在 Kotlin/native 工程中如何使用库, 请参见 [Kotlin/Native 库](native/libraries.html).
{:.details-group}

### `-library-version <version>` (`-lv`)

指定库的版本.
{:.details-group}

### `-list-targets`

列出可用的硬件目标平台(hardware target).
{:.details-group}

### `-manifest <path>`

指定一个 manifest 补充文件.
{:.details-group}

### `-module-name <name>`

为编译产生的模块指定名称.
这个选项也可以用来对导出给 Objective-C 的声明指定名称前缀:
[我要怎样为我的 Kotlin 框架指定自定义的 Objective-C 前缀?](native/faq.html#q-how-do-i-specify-a-custom-objective-c-prefixname-for-my-kotlin-framework)
{:.details-group}

### `-native-library <path>`(`-nl <path>`)

包含原生的 bitcode 库文件.
{:.details-group}

### `-no-default-libs`

不要将用户代码与编译器附带的 [默认的平台库文件](native/platform_libs.html) 链接.
{:.details-group}

### `-nomain`

假定外部的库文件会提供应用程序启动时的 `main` 入口点(entry point).
{:.details-group}

### `-nopack`

不要将库文件打包进入 klib 文件.
{:.details-group}

### `-linker-option`

在二进制文件构建过程中, 向链接程序传递一个参数. 这个选项可以用来链接到某些原生库文件.
{:.details-group}

### `-linker-options <args>`

在二进制文件构建过程中, 向链接程序传递多个参数. 参数之间用空格分隔.
{:.details-group}

### `-nostdlib`

不要链接到标准库.
{:.details-group}

### `-opt`

允许编译优化(compilation optimization).
{:.details-group}

### `-output <name>` (`-o <name>`)

指定编译输出文件的名称.
{:.details-group}

### `-entry <name>` (`-e <name>`)

指定入口点的限定名称(qualified entry point name).
{:.details-group}

### `-produce <output>` (`-p`)

指定编译输出文件的类型:
{:.details-group}
- `program`
- `static`
- `dynamic`
- `framework`
- `library`
- `bitcode`

### `-repo <path>` (`-r <path>`)

库文件的搜索路径. 详情请参见, [库的查找顺序](native/libraries.html#library-search-sequence).
{:.details-group}

### `-target <target>`

指定编译的硬件目标平台(hardware target). 要查看可选择的硬件目标平台, 请使用 [`-list-targets`](#-list-targets) 选项.
{:.details-group}
