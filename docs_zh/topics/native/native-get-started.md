[//]: # (title: Kotlin/Native 开发入门)

在这篇教程中, 你将学习如何创建 Kotlin/Native 应用程序.
请选择最适合你的工具, 并创建你的应用程序:

* **[使用 IDE](#in-ide)**.
  这里, 你可以从一个版本控制系统克隆项目模板, 在 IntelliJ IDEA 中并使用它.
* **[使用 Gradle 构建系统](#using-gradle)**.
  为了更好的理解底层的工作原理, 请为你的项目手动创建构建文件.
* **[使用命令行工具](#using-the-command-line-compiler)**.
  你可以使用 Kotlin/Native 编译器, 它随 Kotlin 的标准发布版一起提供, 并直接在命令行工具中创建应用程序.

  在控制台中编译 看起来似乎简单而且直接, 但这种方法不适合于包含几百个文件和库的大项目.
  对这样的项目, 我们推荐使用 IDE 或构建系统.

使用 Kotlin/Native, 你可以针对 [不同的目标平台](native-target-support.md) 进行编译, 包括 Linux, macOS, 和 Windows.
尽管可以进行跨平台编译, 也就是说可以在一个平台上对另一个不同的平台进行编译,
但在这篇教程中, 你只会针对你正在使用的平台进行编译.

> 如果你使用 Mac 机器, 并希望创建和运行针对 macOS 或其他 Apple 目标平台的应用程序,
> 那么你还需要安装 [Xcode Command Line Tools](https://developer.apple.com/download/),
> 请先启动它, 并接受许可条款.
>
{style="note"}

## 使用 IDE {id="in-ide"}

在本节中, 你将学习如何使用 IntelliJ IDEA 创建一个 Kotlin/Native 应用程序.
你可以使用 Community 版和 Ultimate 版.

### 创建项目 {id="create-the-project"}

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/).
2. 在 IntelliJ IDEA 中选择菜单 **File** | **New** | **Project from Version Control**,
   使用这个 URL 克隆 [项目模板](https://github.com/Kotlin/kmp-native-wizard):

   ```none
   https://github.com/Kotlin/kmp-native-wizard
   ```

3. 打开 `gradle/libs.versions.toml` 文件, 这是项目依赖项的版本目录(Version Catalog).
   要创建 Kotlin/Native 应用程序, 你需要使用与 Kotlin 相同版本的 Kotlin Multiplatform Gradle plugin.
   请确认使用了 Kotlin 的最新版本:

   ```none
   [versions]
   kotlin = "%kotlinVersion%"
   ```

4. 遵循下图中的建议, 重新载入 Gradle 文件:

   ![载入 Gradle 变更按钮](load-gradle-changes.png){width=295}

关于这些设定, 详情请参见 [跨平台程序的 Gradle DSL 参考文档](multiplatform-dsl-reference.md).

### 构建并运行应用程序 {id="build-and-run-the-application"}

打开 `src/nativeMain/kotlin/` 目录中的 `Main.kt` 文件:

* `src` 目录包含 Kotlin 源代码文件.
* `Main.kt` 文件包含代码,
  它使用 [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 函数, 打印输出 "Hello, Kotlin/Native!".

按下侧栏中的绿色图标, 运行代码:

![运行应用程序](native-run-gutter.png){width=478}

IntelliJ IDEA 会使用 Gradle 任务运行代码, 并在 **Run** Tab 中输出运行结果:

![应用程序的输出](native-output-gutter-1.png){width=331}

初次运行之后, IDE 会在顶栏中创建对应的运行配置:

![Gradle 运行配置](native-run-config.png){width=503}

> IntelliJ IDEA Ultimate 用户可以安装
> [Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support) plugin,
> 这个 plugin 可以调试编译后的原生可执行文件, 还可以为导入的 Kotlin/Native 项目自动创建运行配置.
>
{style="tip"}

你可以 [配置 IntelliJ IDEA](https://www.jetbrains.com/help/idea/compiling-applications.html#auto-build),
让它自动构建你的项目:

1. 打开菜单 **Settings | Build, Execution, Deployment | Compiler**.
2. 在 **Compiler** 页, 选择 **Build project automatically**.
3. 保存变更.

现在, 当你在类文件中进行变更, 或者保存文件 (<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>)时,
IntelliJ IDEA 会自动对项目执行增量构建(Incremental Build).

### 更新应用程序 {id="update-the-application"}

我们来向你的应用程序添加一个功能, 让它能够计算你的名字中的字母数量:

1. 在 `Main.kt` 文件中, 添加代码读取输入.
   使用 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函数读取输入值, 并赋值给 `name` 变量:

   ```kotlin
   fun main() {
       // 读取输入值.
       println("Hello, enter your name:")
       val name = readln()
   }
   ```

2. 要使用 Gradle 运行这个应用程序, 请在 `build.gradle.kts` 文件中指定 `System.in` 作为运行项目时的输入, 并重新载入 Gradle:

   ```kotlin
   kotlin {
       // ...
       nativeTarget.apply {
           binaries {
               executable {
                   entryPoint = "main"
                   runTask?.standardInput = System.`in`
               }
           }
       }
       // ...
   }
   ```
   {initial-collapse-state="collapsed" collapsible="true" collapsed-title="runTask?.standardInput = System.`in`"}

3. 删除空白字符, 计算字母数量:

   * 使用 [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) 函数, 删除名字中的空白字符.
   * 使用作用域函数(Scope Function) [`let`](scope-functions.md#let) 在对象上下文之内运行函数.
   * 使用一个 [字符串模板](strings.md#string-templates) 来向一个字符串插入你的名字长度,
     方法是添加一个 `$` 符号, 并将表达式放在大括号内 – `${it.length}`.
     `it` 是 [lambda 表达式参数](coding-conventions.md#lambda-parameters) 的默认名称.

   ```kotlin
   fun main() {
       // 读取输入值.
       println("Hello, enter your name:")
       val name = readln()
       // 计算名字中的字母数量.
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
       }
   }
   ```

4. 运行应用程序.
5. 输入你的名字, 查看结果:

   ![应用程序的输出](native-output-gutter-2.png){width=422}

下面我们来计算你的名字中不重复的字母数量:

1. 在 `Main.kt` 文件中, 为 `String` 声明新的 [扩展函数](extensions.md#extension-functions) `.countDistinctCharacters()`:

   * 使用 [`.lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 函数, 将名字转换为小写.
   * 使用 [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 函数, 将输入的字符转换为一个字符列表.
   * 使用 [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) 函数, 选择你的名字中的不重复的字符.
   * 使用 [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函数, 计算不重复的字符.

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

2. 使用 `.countDistinctCharacters()` 函数, 计算你的名字中不重复字符的数量:

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()

   fun main() {
       // 读取输入值.
       println("Hello, enter your name:")
       val name = readln()
       // 计算名字中的字母数量.
       name.replace(" ", "").let {
           println("Your name contains ${it.length} letters")
           // 打印不重复字符的数量.
           println("Your name contains ${it.countDistinctCharacters()} unique letters")
       }
   }
   ```

3. 运行应用程序.
4. 输入你的名字, 查看结果:

   ![应用程序的输出](native-output-gutter-3.png){width=422}

## 使用 Gradle {id="using-gradle"}

在本节中, 你将学习如何使用 [Gradle](https://gradle.org), 手动创建 Kotlin/Native 应用程序.
它是 Kotlin/Native 和 Kotlin Multiplatform 项目的默认构建系统, 也普遍使用于 Java, Android, 和其它生态系统.

### 创建项目文件 {id="create-project-files"}

1. 首先, 安装一个兼容版本的 [Gradle](https://gradle.org/install/).
   关于 Kotlin Gradle plugin (KGP) 与 Gradle 版本之间的兼容性,
   请参见 [版本兼容一览表](gradle-configure-project.md#apply-the-plugin).
2. 创建一个空的项目目录. 在这个目录中, 创建一个 `build.gradle(.kts)` 文件, 包含以下内容:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   // build.gradle.kts
   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       macosArm64("native") {  // 用于 macOS
       // linuxArm64("native") // 用于 Linux
       // mingwX64("native")   // 用于 Windows
           binaries {
               executable()
           }
       }
   }

   tasks.withType<Wrapper> {
       gradleVersion = "%gradleVersion%"
       distributionType = Wrapper.DistributionType.BIN
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   // build.gradle
   plugins {
       id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       macosArm64('native') {  // 用于 macOS
       // linuxArm64('native') // 用于 Linux
       // mingwX64('native')   // 用于 Windows
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

   你可以使用各种 [编译目标名称](native-target-support.md), 例如 `macosArm64`, `iosArm64` `linuxArm64`,
   和 `mingwX64`, 来定义编译你的代码所针对的目标平台.
   这些编译目标名称接受一个可选的参数, 表示平台名称, 在这个例子中是 `native`.
   平台名称用来生成项目中的源代码路径和 task 名.

3. 在项目目录中创建一个空的 `settings.gradle(.kts)` 文件.
4. 创建一个 `src/nativeMain/kotlin` 目录, 将 `hello.kt` 文件放在这个目录中, 内容如下:

   ```kotlin
   fun main() {
       println("Hello, Kotlin/Native!")
   }
   ```

根据一般约定, 所有的源代码放在 `src/<target name>[Main|Test]/kotlin` 目录中, 其中 `Main` 放置产品代码, `Test` 放置测试代码.
`<target name>` 对应于构建文件中指定的目标平台 (在这个示例中是, `native`).

### 构建并运行项目 {id="build-and-run-the-project"}

1. 在项目的根目录中, 运行构建命令:

   ```bash
   ./gradlew nativeBinaries
   ```

   这个命令会创建 `build/bin/native` 目录, 其中包含 2 个子目录: `debugExecutable` 和 `releaseExecutable`.
   分别包含对应的二进制文件.

   默认情况下, 二进制文件的名称与项目目录相同.

2. 要运行项目, 请执行以下命令:

   ```bash
   build/bin/native/debugExecutable/<project_name>.kexe
   ```

终端会打印输出 "Hello, Kotlin/Native!".

### 在 IDE 中打开项目 {id="open-the-project-in-ide"}

现在, 你可以在支持 Gradle 的任何 IDE 中打开你的项目. 如果你使用 IntelliJ IDEA:

1. 选择 **File** | **Open**.
2. 选择项目目录, 并点击 **Open**.
   IntelliJ IDEA 会自动检测到这是一个 Kotlin/Native 项目.

如果你的项目发生任何问题, IntelliJ IDEA 会在 **Build** Tab 中显示错误信息.

## 使用命令行编译器 {id="using-the-command-line-compiler"}

在本节中, 你将学习如何在命令行工具中使用 Kotlin 编译器创建 Kotlin/Native 应用程序.

### 下载并安装编译器 {id="download-and-install-the-compiler"}

要安装编译器:

1. 访问 Kotlin 的 [GitHub 发布页面](%kotlinLatestUrl%).
2. 寻找名称中包含 `kotlin-native` 的文件, 下载适合你的操作系统的文件,
   例如 `kotlin-native-prebuilt-linux-x86_64-2.0.21.tar.gz`.
3. 在你选择的目录解开它的压缩包.
4. 打开你的 shell 的 profile 文件, 并将编译器的 `/bin` 目录路径添加到 `PATH` 环境变量中:

   ```bash
   export PATH="/<path to the compiler>/kotlin-native/bin:$PATH"
   ```

> 尽管编译器的输出对依赖项或虚拟机没有要求,
> 但编译器自身要求 Java 1.8 或更高版本的运行环境.
> 可以使用 [JDK 8 (JAVA SE 8) 或更高版本](https://www.oracle.com/java/technologies/downloads/).
>
{style="note"}

### 创建程序 {id="create-the-program"}

选择一个工作目录, 创建一个名为 `hello.kt` 的文件. 将它更新为以下代码:

```kotlin
fun main() {
    println("Hello, Kotlin/Native!")
}
```

### 在控制台编译代码 {id="compile-the-code-from-the-console"}

要编译应用程序, 请使用下载的编译器, 执行以下命令:

```bash
kotlinc-native hello.kt -o hello
```

`-o` 选项的值指定编译输出文件的名称, 因此这个命令会生成二进制文件,
在 Linux 和 macOS 平台名为 `hello.kexe` (在 Windows 平台名为 `hello.exe`).

关于可用选项的完整列表, 请参见 [Kotlin 编译器选项](compiler-reference.md).

### 运行程序 {id="run-the-program"}

要运行程序, 请在你的命令行工具中, 进入二进制文件所在的目录, 并运行以下命令:

<tabs>
<tab title="macOS and Linux">

```none
./hello.kexe
```

</tab>
<tab title="Windows">

```none
./hello.exe
```

</tab>
</tabs>

应用程序会在标准输出中打印输出 "Hello, Kotlin/Native".

## 下一步做什么? {id="what-s-next"}

* 完成 [使用 C Interop 和 libcurl 创建应用程序](native-app-with-c-and-libcurl.md) 教程,
  这个教程演示如何创建一个 native HTTP 客户端, 以及如何与 C 代码库交互.
* 学习如何 [为真实的 Kotlin/Native 项目编写 Gradle 构建脚本](multiplatform-dsl-reference.md).
* 关于 Gradle 构建系统的更多详情, 请参见 [文档](gradle.md).
