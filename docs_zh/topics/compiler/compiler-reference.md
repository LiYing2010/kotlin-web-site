[//]: # (title: Kotlin 编译器选项)

Kotlin 的各个发布版都带有针对各种编译目标的编译器:
JVM, JavaScript, 以及
[所支持的各种平台](native-overview.md#target-platforms)
的原生二进制可执行文件(native binary).

这些编译器会在以下情况下使用:
* 当你对你的 Kotlin 工程按下 __Compile__ 或 __Run__ 按钮时, 由 IDE 使用.
* 当你在控制台或在 IDE 内调用 `gradle build` 命令时, 由 Gradle 使用.
* 当你在控制台或在 IDE 内调用 `mvn compile` 或 `mvn test-compile`, 由 Maven 使用.

你也可以从命令行手动运行 Kotlin 编译器, 详情请参见教程 [使用命令行编译器](command-line.md).

## 编译器选项 {id="compiler-options"}

Kotlin 编译器带有很多选项, 用于控制编译过程.
本章会列出针对各种编译目标的编译器选项, 并分别进行介绍.

有几种方式来设置各个编译器选项, 以及相应的值(即 _编译参数(compiler argument)_):
* 在 IntelliJ IDEA 中, 可以在
  **Settings/Preferences** | **Build, Execution, Deployment** | **Compiler** | **Kotlin Compiler**
  设定窗口的
  **Additional command line parameters**
  文本框中输入编译器参数
* 如果使用 Gradle, 可以在 Kotlin 编译任务的 `compilerOptions` 属性中指定编译参数.
  详情请参见 [Gradle 编译器选项](gradle-compiler-options.md#how-to-define-options).
* 如果使用 Maven, 可以在 Maven 插件的 `<configuration>` 元素中指定编译参数 .
  详情请参见 [Maven](maven-kotlin-compiler.md#specify-compiler-options).
* 如果在命令行运行编译器, 可以在调用编译器时直接添加编译参数, 或者将编译参数写在 [参数文件](#argfile) 内.

  例如:

  ```bash
  $ kotlinc hello.kt -include-runtime -d hello.jar
  ```

  > 在 Windows 上, 如果传递的编译器参数中包含分隔字符(空格, `=`, `;`, `,`),
  > 请将这些参数值使用双引号(`"`)括起.
  >```bash
  >$ kotlinc.bat hello.kt -include-runtime -d "My Folder\hello.jar"
  >```
  >
  {style="note"}

## 编译器选项 Schema {id="schema-for-compiler-options"}

所有编译器选项的共通 Schema 以 JAR artifact 的形式发布于
[`org.jetbrains.kotlin:kotlin-compiler-arguments-description`](https://central.sonatype.com/artifact/org.jetbrains.kotlin/kotlin-compiler-arguments-description).
这个 artifact 包括所有编译器选项描述的代码形式, 以及 JSON 等价形式(供非 Kotlin 使用者使用),
以及元数据, 例如每个选项被引入的版本, 或进入稳定的版本.

## 各平台共通选项 {id="common-options"}

下面是所有 Kotlin 编译器的共通选项.

### -api-version _version_

只允许使用 Kotlin 库从指定的版本开始提供的 API 声明.

### -help (-h)

显示编译器使用方法的帮助信息, 然后退出. 帮助信息中只会显示标准的编译选项.
如果需要显示更多的高级编译选项, 请使用 `-X` 参数.

### -kotlin-home _path_

对 Kotlin 编译器指定一个自定义的路径, 用来查找运行时期的库文件.

### -language-version _version_

这个选项根据指定的语言版本, 设置支持的语法和语义.
例如, Kotlin 编译器 2.4.0 版本如果指定 `-language-version=2.2` 选项, 只允许你使用 2.2 或更早版本的语言特性和标准库 API.
这有助于逐步迁移到更新的 Kotlin 版本.

### -opt-in _annotation_

指定注解的完全限定名称, 通过这个注解启用 [明确要求使用者同意(opt-in)](opt-in-requirements.md) API.

### -P plugin:pluginId:optionName=value

向 Kotlin 编译器插件传递一个选项.
核心编译器插件, 以及它们的选项, 请参见本文档的 [核心编译器插件](components-stability.md#core-compiler-plugins) 章节.

### -progressive

允许编译器使用 [渐进模式(progressive mode)](whatsnew13.md#progressive-mode).

在渐进模式下, 对不稳定代码中功能废弃和 bug 修正, 会立即生效, 而不会等待完整的版本迁移周期完成.
渐进模式下编写的代码可以向后兼容(backwards compatible); 但是, 非渐进模式下编写的代码, 在渐进模式下编译时, 可能导致编译错误.

### -script

运行 Kotlin 脚本文件. 使用这个选项时, 编译器会运行参数中指定的第一个 Kotlin 脚本文件(`*.kts`).

### -verbose

允许输出最详细的 log, 包含编译过程的各种细节信息.

### -version

显示编译器版本.

### -X

<primary-label ref="experimental-general"/>

显示编译器高级选项的帮助信息, 然后退出.
这些选项目前还不稳定: 选项的名称和行为都有可能变更, 并且不会有相关公告.

### Kotlin 契约选项 {id="kotlin-contract-options"}
<primary-label ref="experimental-general"/>

以下选项启用实验性的 Kotlin 契约(contract)功能.

#### -Xallow-contracts-on-more-functions

在更多的声明中启用契约, 包括属性访问器, 特定的操作符函数,
以及对泛型类型的类型断言.

#### -Xallow-condition-implies-returns-contracts

允许在契约中使用 `returnsNotNull()` 函数, 对指定的条件假定返回值非 null.

#### -Xallow-holdsin-contract

允许在契约中使用 `holdsIn` 关键字, 假定在 Lambda 表达式内部某个布尔条件为 `true`.

#### -Xallow-returns-result-of

允许使用 `returnsResultOf()` 契约, 使未使用返回值检查器能够区分可以忽略的结果, 和高阶函数的有意义的结果.

### -Xallow-reified-type-in-catch {id="xallow-reified-type-in-catch"}
<primary-label ref="experimental-general"/>

在 `inline` 函数的 `catch` 子句中启用对实体化(reified) 的 `Throwable` 类型参数的支持.

### -Xcollection-literals {id="xcollection-literals"}
<primary-label ref="experimental-general"/>

启用对 [集合字面值(collection literal)](whatsnew24.md#support-for-collection-literals) 括号语法 `[]` 的支持.

### -Xcompiler-plugin-order={plugin.before>plugin.after} {id="xcompiler-plugin-order"}
<primary-label ref="experimental-general"/>

配置编译器 plugin 的运行顺序. 编译器先运行 `plugin.before`, 然后运行 `plugin.after`:

可以为 3 个或更多插件定义多条顺序规则. 例如:

```bash
kotlinc -Xcompiler-plugin-order=plugin.first>plugin.middle
kotlinc -Xcompiler-plugin-order=plugin.middle>plugin.last
```

这个设置表示以下运行顺序:

1. `plugin.first`
2. `plugin.middle`
3. `plugin.last`

如果某个编译器 plugin 不存在, 对应的规则会被忽略.

可以通过以下 ID 配置对应的 plugin:

| 编译器 plugin                  | plugin ID                                  |
|-----------------------------|--------------------------------------------|
| `all-open`, `kotlin-spring` | `org.jetbrains.kotlin.allopen`             |
| AtomicFU                    | `org.jetbrains.kotlinx.atomicfu`           |
| Compose                     | `androidx.compose.compiler.plugins.kotlin` |
| `js-plain-objects`          | `org.jetbrains.kotlinx.jspo`               |
| `jvm-abi-gen`               | `org.jetbrains.kotlin.jvm.abi`             |
| kapt                        | `org.jetbrains.kotlin.kapt3`               |
| Lombok                      | `org.jetbrains.kotlin.lombok`              |
| `no-arg`, `kotlin-jpa`      | `org.jetbrains.kotlin.noarg`               |
| Parcelize                   | `org.jetbrains.kotlin.parcelize`           |
| Power-assert                | `org.jetbrains.kotlin.powerassert`         |
| SAM with receiver           | `org.jetbrains.kotlin.samWithReceiver`     |
| Serialization               | `org.jetbrains.kotlinx.serialization`      |

这个运行顺序只控制编译器插件的后端, 不控制前端.

### -Xdata-flow-based-exhaustiveness {id="xdata-flow-based-exhaustiveness"}
<primary-label ref="experimental-general"/>

为 `when` 表达式启用基于数据流的穷尽检查(Exhaustiveness Check).

### -Xexplicit-context-arguments {id="xexplicit-context-arguments"}
<primary-label ref="experimental-general"/>

为上下文参数(context parameter)启用明确的 [上下文参数传递](context-parameters.md#pass-context-arguments-explicitly).

这可以通过在调用点传递上下文参数, 解决重载歧义.

### -Xklib-ir-inliner {id="xklib-ir-inliner"}
<primary-label ref="experimental-general"/>

配置是否为 Kotlin/Native, Kotlin/JS 和 Kotlin/Wasm 启用
[模块内内联(intra-module inlining)](whatsnew24.md#consistent-intra-module-function-inlining-during-klib-compilation).
这个功能默认启用.

这个选项支持以下模式:

* `disabled`: 为 Kotlin/Native, Kotlin/JS 和 Kotlin/Wasm, 禁用模块内内联.
* `full`: 启用跨模块内联.

### -Xintrinsic-const-evaluation {id="xintrinsic-const-evaluation"}
<primary-label ref="experimental-general"/>

启用 [改进的编译期常量(improved compile-time constants)](whatsnew24.md#improved-compile-time-constants).

### -Xname-based-destructuring {id="xname-based-destructuring"}
<primary-label ref="experimental-opt-in"/>

配置编译器如何根据属性名称解析 [基于名称的解构声明(destructuring declarations)](destructuring-declarations.md#name-based-destructuring).

这个选项支持以下模式:

* `only-syntax`: 启用基于名称的解构的明确调用形式, 不改变既有的解构声明的行为.
* `name-mismatch`: 当对数据类使用基于位置的解构时, 如果使用的变量名称与属性名称不匹配, 报告警告.
* `complete`: 启用基于名称的解构的圆括号简写形式, 并且通过方括号语法, 继续支持基于位置的解构.

### -Xphases-to-dump-before {id="xphases-to-dump-before"}
<primary-label ref="experimental-general"/>

设置为 `ExternalPackageParentPatcherLowering`, 在 IR 降级编译阶段之后创建一个 dump 文件.
通过 [`-Xdump-directory`](#xdump-directory) 编译器选项, 配置 Kotlin/JVM 的输出目录.

### -Xrepl {id="xrepl"}
<primary-label ref="experimental-general"/>

启动 Kotlin REPL.

```bash
kotlinc -Xrepl
```

### -Xreturn-value-checker {id="xreturn-value-checker"}
<primary-label ref="experimental-general"/>

配置编译器如何 [报告被忽略的结果](unused-return-value-checker.md):

* `disable`: 禁用未使用返回值检查器(默认值).
* `check`: 启用检查器, 对来自已标注函数的被忽略的结果, 报告警告.
* `full`: 启用检查器, 将项目中所有函数视为已标注, 并对被忽略的结果报告警告.

### 警告管理 {id="warning-management"}

#### -nowarn

在编译过程中禁止所有的警告信息.

#### -Werror

将所有的警告作为编译错误处理.

#### -Wextra

启用 [声明, 表达式, 和类型的额外编译器检查](whatsnew21.md#extra-compiler-checks),
如果检查结果为 true, 会产生警告.

#### -Xrender-internal-diagnostic-names {id="xrender-internal-diagnostic-names"}
<primary-label ref="experimental-general"/>

在警告中打印内部诊断名称. 这对于识别为 `-Xwarning-level` 选项配置的 `DIAGNOSTIC_NAME` 很有用.

#### -Xwarning-level {id="xwarning-level"}
<primary-label ref="experimental-general"/>

对特定的编译器警告配置严重性级别:

```bash
kotlinc -Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

* `error`: 只将特定的警告提升为错误.
* `warning`: 针对特定的诊断发出警告, 这个选项默认启用.
* `disabled`: 只对特定的警告在整个模块范围内禁止警告.

可以在项目中结合使用模块范围的规则和特定的规则, 调整警告报告:

| 命令                                                 | 说明                   |
|----------------------------------------------------|----------------------|
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning`  | 禁止所有的警告, 特定的警告除外.    |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning`  | 将所有警告提升为错误, 特定的警告除外. |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 启用所有的额外检查, 特定的警告除外.  |

如果需要从一般规则中排除多个警告, 可以使用 [`@argfile`](#argfile), 在单独的文件中列出这些警告.

可以使用 [`-Xrender-internal-diagnostic-names`](#xrender-internal-diagnostic-names) 来查找 `DIAGNOSTIC_NAME`.

### @argfile {id="argfile"}

从指定的文件中读取编译器选项. 这样的文件可以包含编译器选项, 对应的值, 以及源代码文件的路径.
选项和文件路径使用空格分隔. 比如:

```
-include-runtime -d hello.jar hello.kt
```

要传递包含空格的值, 请使用单引号 (**'**) 或双引号 (**"**) 括起.
如果值本身包含引号, 请使用反斜线 (**\\**) 转义符表示.

```
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

## Kotlin/JVM 编译器选项 {id="kotlin-jvm-compiler-options"}

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

### -Xjdk-release=version {id="xjdk-release-version"}

<primary-label ref="experimental-general"/>

指定生成的 JVM 字节码的目标版本. 将类路径中的 JDK API 限制为指定的 Java 版本.
自动设置 [`-jvm-target version`](#jvm-target-version).
可以指定的值是 `1.8`, `9`, `10`, ..., `26`.

> 这个选项 [不保证](https://youtrack.jetbrains.com/issue/KT-29974) 对所有的 JDK 发布版都有效.
>
{style="note"}

### -jvm-default _mode_ {id="jvm-default-mode"}

控制接口中声明的函数如何编译为 JVM 上的默认方法.

| 模式                 | 说明                                                                 |
|--------------------|--------------------------------------------------------------------|
| `enable`           | 生成接口中的默认实现, 并包含子类中的桥接函数(Bridge Function)和 `DefaultImpls` 类. (默认选项) |
| `no-compatibility` | 只生成接口中的默认实现, 略过兼容性桥接函数和 `DefaultImpls` 类.                          |
| `disable`          | 只生成兼容性桥接函数和 `DefaultImpls` 类, 略过默认方法.                              |

### -jvm-target _version_ {id="jvm-target-version"}

指定编译产生的 JVM 字节码(bytecode)版本.
可以指定的值是 `1.8`, `9`, `10`, ..., `26`.
默认值是 `%defaultJvmTargetVersion%`.

### -java-parameters

针对 Java 1.8 的方法参数反射(reflection on method parameter)生成元信息(metadata).
译者注: 等于 Java 1.8 编译参数 `-parameters`, 参见 [javac 命令行编译器](https://docs.oracle.com/javase/8/docs/technotes/tools/windows/javac.html)

### -module-name _name_ (JVM)

对编译产生的 `.kotlin_module` 指定一个自定义的名称.

### -no-jdk

不要自动将 Java 运行时期库文件添加到 classpath 中.

### -no-reflect

不要自动将 Kotlin 反射库文件(`kotlin-reflect.jar`) 添加到 classpath 中.

### -no-stdlib (JVM)

不要自动将 Kotlin/JVM 标准库文件(`kotlin-stdlib.jar`) 和 Kotlin 反射库文件(`kotlin-reflect.jar`) 添加到 classpath 中.

### -script-templates _classnames[,]_

脚本定义的模板类. 请使用类的完全限定名称, 如果有多个, 请使用逗号(**,**) 分隔.

### -Xdump-directory {id="xdump-directory"}
<primary-label ref="experimental-general"/>

为 [`-Xphases-to-dump-before`](#xphases-to-dump-before) 编译器选项配置 dump 文件目录.

### -Xjvm-expose-boxed {id="xjvm-expose-boxed"}

<primary-label ref="experimental-general"/>

对模块中的所有的内联值类(Inline Value Class)生成装箱版本(Boxed), 并对使用它们的函数生成装箱的变体,
以供 Java 访问.
详情请参见 [在 Java 中调用 Kotlin 代码 指南: 内联值类(Inline Value Class) 小节](java-to-kotlin-interop.md#inline-value-classes).

### -Xnullability-annotations {id="xnullability-annotations"}
<primary-label ref="experimental-general"/>

配置 Kotlin 编译器如何解析来自指定的 Java 包的可否为 null 注解.

关于支持的注解和配置选项的完整列表, 请参见 [可否为 null 注解](java-interop.md#nullability-annotations).

## Kotlin/JS 编译器选项 {id="kotlin-js-compiler-options"}

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

### -source-map-names-policy _{simple-names|fully-qualified-names|no}_

将你在 Kotlin 代码中声明的变量和函数名称添加到源代码映射文件(source map)中.

| 设置                      | 说明                    | 输出示例                              |
|-------------------------|-----------------------|-----------------------------------|
| `simple-names`          | 添加变量名称和函数的简单名称. (默认值) | `main`                            |
| `fully-qualified-names` | 添加变量名称和函数完全限定名称.      | `com.example.kjs.playground.main` |
| `no`                    | 不添加变量名称和函数名称.         | 无                                 |

### -source-map-prefix

向源代码映射文件(source map)中的路径添加指定的前缀.

### -target {es5|es2015}

针对指定的 ECMA 版本生成 JS 文件.

### -Xenable-implementing-interfaces-from-typescript {id="xenable-implementing-interfaces-from-typescript"}
<primary-label ref="experimental-general"/>

允许从 JavaScript/TypeScript
[实现由 `@JsExport` 注解导出的 Kotlin 接口](whatsnew2320.md#implementing-kotlin-interfaces-from-javascript-typescript).

### -Xes-long-as-bigint {id="xes-long-as-bigint"}
<primary-label ref="experimental-general"/>

编译为现代 JavaScript (ES2020) 时, 启用对 JavaScript `BigInt` 类型的支持, 用来表示 Kotlin 的 `Long` 值.

## Kotlin/Native 编译器选项 {id="kotlin-native-compiler-options"}

Kotlin/Native 编译器将 Kotlin 源代码文件编译为
[所支持的各种平台](native-overview.md#target-platforms)
的二进制可执行文件(native binary).
Kotlin/Native 编译的命令行工具是 `kotlinc-native`.

除 [共通选项](#common-options) 之外, Kotlin/Native 编译器还支持以下选项.

### -enable-assertions (-ea)

在生成的代码中允许运行时断言(runtime assertion).

### -entry _name_ (-e _name_)

指定入口点的限定名称(qualified entry point name).

### -g

允许编译产生 debug 信息.
这个选项会降低代码优化的级别, 并且不应该与 [`-opt`](#opt) 选项组合使用.

### -generate-test-runner (-tr)

生成一个应用程序, 用于在工程中运行单元测试.

### -generate-no-exit-test-runner (-trn)

生成一个应用程序, 用于运行单元测试, 但不会有明确的进程结束信息(explicit process exit).

### -include-binary _path_ (-ib _path_)

将外部的二进制文件打包到编译产生的 klib 文件内.

### -library _path_ (-l _path_)

链接指定的库文件. 关于在 Kotlin/native 工程中如何使用库,
请参见 [Kotlin/Native 库](native-libraries.md).

### -library-version _version_ (-lv _version_)

指定库的版本.

### -linker-option

在二进制文件构建过程中, 向链接程序传递一个参数. 这个选项可以用来链接到某些原生库文件.

### -linker-options _args_

在二进制文件构建过程中, 向链接程序传递多个参数. 参数之间用空格分隔.

### -list-targets

列出可用的硬件目标平台(hardware target).

### -manifest _path_

指定一个 manifest 补充文件.

### -module-name _name_ (Native)

为编译产生的模块指定名称.
这个选项也可以用来对导出给 Objective-C 的声明指定名称前缀:
[怎样为 Kotlin 框架指定自定义的 Objective-C 前缀?](native-faq.md#how-do-i-specify-a-custom-objective-c-prefix-name-for-my-kotlin-framework)

### -native-library _path_ (-nl _path_)

包含原生的 bitcode 库文件.

### -no-default-libs

不要将用户代码与编译器附带的预先构建的 [平台库文件](native-platform-libs.md) 链接.

### -nomain

假定外部的库文件会提供应用程序启动时的 `main` 入口点(entry point).

### -nopack

不要将库文件打包进入 klib 文件.

### -nostdlib

不要链接到标准库.

### -opt {id="opt"}

允许编译优化(compilation optimization), 产生运行期性能更好的二进制文件.
不推荐将与 [`-g`](#g) 选项组合使用, `-g` 选项会降低优化级别.

### -output _name_ (-o _name_)

指定编译输出文件的名称.

### -produce _output_ (-p _output_)

指定编译输出文件的类型:

- `program`
- `static`
- `dynamic`
- `framework`
- `library`
- `bitcode`

### -repo _path_ (-r _path_)

库文件的搜索路径. 详情请参见, [库的查找顺序](native-libraries.md#library-search-sequence).

### -target _target_

指定编译的硬件目标平台(hardware target). 要查看可选择的硬件目标平台, 请使用 [`-list-targets`](#list-targets) 选项.

### -Xccall-mode {id="xccall-mode"}
<primary-label ref="experimental-general"/>

为通过 cinterop 导入的 C 或 Objective-C 库, 启用 [新的互操作模式](whatsnew2320.md#new-interoperability-mode-for-c-or-objective-c-libraries).

### -Xoverride-konan-properties=min.version.* {id="xoverride-konan-properties"}
<primary-label ref="experimental-general"/>

配置比 Kotlin 默认值更低的 Apple 目标平台最低支持版本. 例如:

```bash
kotlinc -Xoverride-konan-properties=minVersion.ios=14.0
kotlinc -Xoverride-konan-properties=minVersion.macos=11.0
kotlinc -Xoverride-konan-properties=minVersion.tvos=14.0
kotlinc -Xoverride-konan-properties=minVersion.watchos=7.0
```
