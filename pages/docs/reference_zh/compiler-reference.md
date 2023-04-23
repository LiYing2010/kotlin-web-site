---
type: doc
layout: reference
title: "Kotlin 编译器选项"
---

# Kotlin 编译器选项

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin 的各个发布版都带有针对各种编译目标的编译器:
JVM, JavaScript, 以及
[所支持的各种平台](native-overview.html#target-platforms)
的原生二进制可执行文件(native binary).

这些编译器会在以下情况下使用:
* 当你对你的 Kotlin 工程按下 __Compile__ 或 __Run__ 按钮时, 由 IDE 使用.
* 当你在控制台或在 IDE 内调用 `gradle build` 命令时, 由 Gradle 使用.
* 当你在控制台或在 IDE 内调用 `mvn compile` 或 `mvn test-compile`, 由 Maven 使用.

你也可以从命令行手动运行 Kotlin 编译器, 详情请参见教程 [使用命令行编译器](command-line.html).

## 编译器选项

Kotlin 编译器带有很多选项, 用于控制编译过程.
本章会列出针对各种编译目标的编译器选项, 并分别进行介绍.

有几种方式来设置各个编译器选项, 以及相应的值(即 _编译参数(compiler argument)_):
* 在 IntelliJ IDEA 中, 可以在
  **Settings/Preferences** | **Build, Execution, Deployment** | **Compiler** | **Kotlin Compiler**
  设定窗口的
  **Additional command line parameters**
  文本框中输入编译器参数
* 如果使用 Gradle, 可以在 Kotlin 编译任务的 `compilerOptions` 属性中指定编译参数.
  详情请参见 [Gradle 编译器选项](gradle/gradle-compiler-options.html#how-to-define-options).
* 如果使用 Maven, 可以在 Maven 插件的 `<configuration>` 元素中指定编译参数 .
  详情请参见 [Maven](using-maven.html#specifying-compiler-options).
* 如果在命令行运行编译器, 可以在调用编译器时直接添加编译参数, 或者将编译参数写在 [参数文件](#argfile) 内.

例如:

```bash
$ kotlinc hello.kt -include-runtime -d hello.jar
```

>在 Windows 上, 如果传递的编译器参数中包含分隔字符(空格, `=`, `;`, `,`),
> 请将这些参数值使用双引号(`"`)括起.
>```
>$ kotlinc.bat hello.kt -include-runtime -d "My Folder\hello.jar"
>```
{:.note}

## 各平台共通选项

下面是所有 Kotlin 编译器的共通选项.

### -version

显示编译器版本.

### -nowarn

进制编译器在编译过程中显示警告信息.

### -Werror

将警告信息变为编译错误.

### -verbose

允许输出最详细的 log, 其中包括编译过程的各种细节信息.

### -script

运行 Kotlin 脚本文件. 使用这个选项调用编译器时, 编译器会运行参数中指定的第一个 Kotlin 脚本文件(`*.kts`).

### -help (-h)

显示编译器使用方法的帮助信息, 然后退出. 帮助信息中只会显示标准的编译选项.
如果需要显示更多的高级编译选项, 请使用 `-X` 参数.

### -X

显示编译器高级选项的帮助信息, 然后退出. 这些选项目前还不稳定:
选项的名称和行为都有可能变更, 并且不会有相关公告.

### -kotlin-home _path_

对 Kotlin 编译器指定一个自定义的路径, 用来查找运行时期的库文件.

### -P plugin:_pluginId_:_optionName_=_value_

向 Kotlin 编译器插件传递一个选项.
相关的编译器插件, 以及它们的选项, 请参见本文档的 **工具 > 编译器插件** 章节.

### -language-version _version_

与指定的 Kotlin 版本保持源代码级兼容.

### -api-version _version_

允许使用从指定的 Kotlin 版本的库才开始提供的 API 声明.

### -progressive

允许编译器使用 [渐进模式(progressive mode)](whatsnew13.html#progressive-mode).

在渐进模式下, 对不稳定代码中功能废弃和 bug 修正, 会立即生效, 而不会等待完整的版本迁移周期完成.
渐进模式下编写的代码可以向后兼容(backwards compatible); 但是, 非渐进模式下编写的代码, 在渐进模式下编译时, 可能导致编译错误.

### @_argfile_

从指定的文件中读取编译器选项. 这样的文件可以包含编译器选项, 相应的值, 以及源代码文件的路径.
选项和文件路径使用空格分隔. 比如:

```bash
-include-runtime -d hello.jar
hello.kt
```

如果想要传递的参数值本身包含空格, 请使用单引号 (**'**) 或双引号 (**"**) 将参数值括起.
如果参数值本身包含引号, 请使用反斜线 (**\\**) 转义符表示.

```bash
-include-runtime -d 'My folder'
```

也可以传递多个参数文件, 比如, 如果想要将编译器选项和源代码文件分开的情况.

```bash
$ kotlinc @compiler.options @classes
```

如果文件位置不在当前目录下, 请使用相对路径.

```bash
$ kotlinc @options/compiler.options hello.kt
```

### -opt-in _annotation_

指定注解的全限定名称, 通过这个注解启用 [明确要求使用者同意(opt-in)](opt-in-requirements.html) API.

## Kotlin/JVM 编译器选项

针对 JVM 平台的 Kotlin 编译器将 Kotlin 源代码文件编译为 Java class 文件.
将 Kotlin 文件编译到 JVM 平台的命令行工具是 `kotlinc` 和 `kotlinc-jvm`.
也可以使用它们来运行 Kotlin 脚本文件.

除 [共通选项](#common-options) 之外, Kotlin/JVM 编译器还支持以下选项.

### -classpath _path_ (-cp _path_)

在指定的路径中查找 class 文件.
如果 classpath 中存在多个路径, 请使用操作系统的路径分隔符来分隔(对 Windows 系统是 **;** , 对 macOS/Linux 系统是 **:**).
classpath 可以包含文件路径, 目录路径, ZIP 文件, 或 JAR 文件.

### -d _path_

将生成的 class 文件输出到指定的位置. 输出位置可以是一个目录, 一个 ZIP 文件, 或一个 JAR 文件.

### -include-runtime

将 Kotlin 运行时库文件包含在最终输出的结果 JAR 文件中.
这样将使得最终输出的包可以在任何安装了 Java 环境中运行.

### -jdk-home _path_

如果自定义的 JDK home 目录与默认的 `JAVA_HOME` 不用, 这个选项会将它添加到 classpath 中.

### -Xjdk-release=version

指定生成的 JVM 字节码的目标版本. 将类路径中的 JDK API 限制为指定的 Java 版本.
自动设置 [`-jvm-target version`](#jvm-target-version).
可以指定的值是 `1.8`, `9`, `10`, ..., `19`.
默认值是 `{{ site.data.releases.defaultJvmTargetVersion }}`.

> 这个选项 [不保证](https://youtrack.jetbrains.com/issue/KT-29974) 对所有的 JDK 发布版都有效.
{:.note}

### -jvm-target _version_

指定编译产生的 JVM 字节码(bytecode)版本.
可以指定的值是 `1.8`, `9`, `10`, ..., `19`.
默认值是 `{{ site.data.releases.defaultJvmTargetVersion }}`.

### -java-parameters

针对 Java 1.8 的方法参数反射(reflection on method parameter)生成元信息(metadata).
译者注: 等于 Java 1.8 编译参数 `-parameters`, 参见 [javac 命令行编译器](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/javac.html)

### -module-name _name_ (JVM)

对编译产生的 `.kotlin_module` 指定一个自定义的名称.

### -no-jdk (JVM)

不要自动将 Java 运行时期库文件添加到 classpath 中.

### -no-reflect

不要自动将 Kotlin 反射库文件(`kotlin-reflect.jar`) 添加到 classpath 中.

### -no-stdlib

不要自动将 Kotlin/JVM 标准库文件(`kotlin-stdlib.jar`) 和 Kotlin 反射库文件(`kotlin-reflect.jar`) 添加到 classpath 中.

### -script-templates _classnames[,]_

脚本定义的模板类. 请使用类的完全限定名称, 如果有多个, 请使用逗号(**,**) 分隔.

## Kotlin/JS 编译器 选项

针对 JS 平台的 Kotlin 编译器将 Kotlin 源代码文件编译为 JavaScript 代码.
将 Kotlin 文件编译到 JS 平台的命令行工具是 `kotlinc-js`.

除 [共通选项](#common-options) 之外, Kotlin/JS 编译器还支持以下选项.

### -libraries _path_

包含 `.meta.js` 和 `.kjsm` 文件的 Kotlin 库路径, 如果有多个路径, 请使用操作系统的路径分隔符分隔.

### -main _{call|noCall}_

指定执行时是否要调用 `main` 函数.

### -meta-info

生成 `.meta.js` 和 `.kjsm` 文件时附带元信息(metadata).
开发 JS 库时, 请使用这个选项 .

### -module-kind {umd|commonjs|amd|plain}

指定编译器生成的 JS 模块类型:

- `umd` - [统一模块定义(Universal Module Definition)](https://github.com/umdjs/umd) 模块
- `commonjs` - [CommonJS](http://www.commonjs.org/) 模块
- `amd` - [异步模块定义(Asynchronous Module Definition)](https://en.wikipedia.org/wiki/Asynchronous_module_definition) 模块
- `plain` - 普通 JS 模块

关于各种 JS 模块类型, 以及它们之间的差别, 请参见 [这篇文章](https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/).

### -no-stdlib (JS)

不要自动将默认的 Kotlin/JS 标准库添加到编译依赖中.

### -output _filepath_

指定编译结果的输出目标文件. 参数值必须是一个 `.js` 文件路径, 包含文件名.

### -output-postfix _filepath_

将指定文件的内容添加到编译输出文件的末尾部分.

### -output-prefix _filepath_

将指定文件的内容添加到编译输出文件的先头部分.

### -source-map

生成源代码映射文件(source map).

### -source-map-base-dirs _path_

使用指定的路径作为起始目录(base directory). 起始目录用来计算源代码映射文件(source map)中的相对路径.

### -source-map-embed-sources _{always|never|inlining}_

是否将源代码文件嵌入到源代码映射文件(source map)中.

### -source-map-prefix

向源代码映射文件(source map)中的路径添加指定的前缀.

## Kotlin/Native 编译器选项

Kotlin/Native 编译器将 Kotlin 源代码文件编译为
[所支持的各种平台](native-overview.html#target-platforms)
的二进制可执行文件(native binary).
Kotlin/Native 编译的命令行工具是 `kotlinc-native`.

除 [共通选项](#common-options) 之外, Kotlin/Native 编译器还支持以下选项.

### -enable-assertions (-ea)

在生成的代码中允许运行时断言(runtime assertion).

### -g

允许编译产生 debug 信息.

### -generate-test-runner (-tr)

生成一个应用程序, 用于在工程中运行单元测试.

### -generate-worker-test-runner (-trw)

生成一个应用程序, 用于在
[工作线程(worker thread)](native/native-immutability.html#concurrency-in-kotlin-native)
中运行单元测试 .

### -generate-no-exit-test-runner (-trn)

生成一个应用程序, 用于运行单元测试, 但不会有明确的进程结束信息(explicit process exit).

### -include-binary _path_ (-ib _path_)

将外部的二进制文件打包到编译产生的 klib 文件内.

### -library _path_ (-l _path_)

链接指定的库文件. 关于在 Kotlin/native 工程中如何使用库,
请参见 [Kotlin/Native 库](native/native-libraries.html).

### -library-version _version_ (-lv _version_)

指定库的版本.

### -list-targets

列出可用的硬件目标平台(hardware target).

### -manifest _path_

指定一个 manifest 补充文件.

### -module-name _name_ (Native)

为编译产生的模块指定名称.
这个选项也可以用来对导出给 Objective-C 的声明指定名称前缀:
[我要怎样为我的 Kotlin 框架指定自定义的 Objective-C 前缀?](native/native-faq.html#how-do-i-specify-a-custom-objective-c-prefix-name-for-my-kotlin-framework)

### -native-library _path_ (-nl _path_)

包含原生的 bitcode 库文件.

### -no-default-libs

不要将用户代码与编译器附带的 [默认的平台库文件](native/native-platform-libs.html) 链接.

### -nomain

假定外部的库文件会提供应用程序启动时的 `main` 入口点(entry point).

### -nopack

不要将库文件打包进入 klib 文件.

### -linker-option

在二进制文件构建过程中, 向链接程序传递一个参数. 这个选项可以用来链接到某些原生库文件.

### -linker-options _args_

在二进制文件构建过程中, 向链接程序传递多个参数. 参数之间用空格分隔.

### -nostdlib

不要链接到标准库.

### -opt

允许编译优化(compilation optimization).

### -output _name_ (-o _name_)

指定编译输出文件的名称.

### -entry _name_ (-e _name_)

指定入口点的限定名称(qualified entry point name).

### -produce _output_ (-p _output_)

指定编译输出文件的类型:

- `program`
- `static`
- `dynamic`
- `framework`
- `library`
- `bitcode`

### -repo _path_ (-r _path_)

库文件的搜索路径. 详情请参见, [库的查找顺序](native/native-libraries.html#library-search-sequence).

### -target _target_

指定编译的硬件目标平台(hardware target). 要查看可选择的硬件目标平台, 请使用 [`-list-targets`](#list-targets) 选项.
