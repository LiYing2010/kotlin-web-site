[//]: # (title: Kotlin 命令行编译器)

每个 Kotlin 发布版都带有独立版本的编译器.
你可以手动下载最新版本, 也可以使用包管理器下载.

> 要使用 Kotlin, 安装命令行编译器并不是必须的.
> 编写 Kotlin 应用程序的通常方式是使用带有官方 Kotlin 支持的 IDE 或代码编辑器,
> 例如 [IntelliJ IDEA](https://www.jetbrains.com/idea/), [JetBrains Fleet](https://www.jetbrains.com/fleet/),
> 或 [Android Studio](https://developer.android.com/studio).
> 它们已经提供了完全的 Kotlin 支持, 不需要添加其它组件.
>
> 更多详情请参见 [在 IDE 中使用 Kotlin](getting-started.md).
>
{style="note"}

## 安装编译器

### 手动安装 {id="manual-install"}

手动安装 Kotlin 编译器的步骤:

1. 从 [GitHub Release 页面](%kotlinLatestUrl%) 下载最新版 (`kotlin-compiler-%kotlinVersion%.zip`).
2. 将独立版本的编译器解包到一个目录, 并将 `bin` 目录添加到系统的 path 设定中(可选).
   `bin` 目录包含在 Windows, macOS, 和 Linux 上编译和运行 Kotlin 所需要的脚本.

> 如果你想要在 Windows 上使用 Kotlin 命令行编译器, 我们推荐手动安装.
>
{style="note"}

### 使用 SDKMAN! 安装 {id="sdkman"}

在基于 UNIX 的系统中, 比如 macOS, Linux, Cygwin, FreeBSD, 以及 Solaris, 安装 Kotlin 的更简单的方法是 [SDKMAN!](https://sdkman.io).
它也能用于 Bash 和 ZSH shell. 参见 [如何安装 SDKMAN!](https://sdkman.io/install).

要通过 SDKMAN! 安装 Kotlin 编译器, 请在终端中运行以下命令:

```bash
sdk install kotlin
```

### 使用 Homebrew 安装 {id="homebrew"}

另一种方法是, 在 macOS 上你可以通过 [Homebrew](https://brew.sh/) 来安装编译器:

```bash
brew update
brew install kotlin
```

### 使用 Snap 包安装 {id="snap-package"}

如果你在 Ubuntu 16.04 或更高版本上使用 [Snap](https://snapcraft.io/), 你可以通过命令行安装编译器:

```bash
sudo snap install --classic kotlin
```

## 创建并运行应用程序

1. 使用 Kotlin 创建一个简单的控制台 JVM 应用程序, 它输出 `"Hello, World!"`.
   在代码编辑器中, 创建一个名为 `hello.kt` 的新文件, 包含以下代码:

   ```kotlin
   fun main() {
       println("Hello, World!")
   }
   ```

2. 使用 Kotlin 编译器编译应用程序:

   ```bash
   kotlinc hello.kt -include-runtime -d hello.jar
   ```

   * `-d` 选项指定生成的类文件的输出路径, 可以是一个目录或一个 **.jar** 文件.
   * `-include-runtime` 选项让生成的 **.jar** 文件成为自包含文件, 其中包含了 Kotlin 运行期库, 因此可以独立运行.

   要查看所有可用的选项, 请运行:

   ```bash
   kotlinc -help
   ```

3. 运行应用程序:

   ```bash
   java -jar hello.jar
   ```

## 编译一个库

如果你在开发库, 供其他 Kotlin 应用程序使用, 那么构建 **.jar** 文件时可以不包含 Kotlin 运行库:

```bash
kotlinc hello.kt -d hello.jar
```

由于这种方式编译的二进制文件依赖于 Kotlin 运行库, 当你编译的库被使用时, 你需要确保 Kotlin 运行库存在于类路径中.

你也可以使用 `kotlin` 脚本来运行 Kotlin 编译器生成的二进制文件:

```bash
kotlin -classpath hello.jar HelloKt
```

`HelloKt` 是 Kotlin 编译器为 `hello.kt` 文件生成的 main 类名.

## 运行 REPL

你可以不带任何参数来运行编译器, 启动一个交互环境. 在这个环境中, 你可以输入任何有效的 Kotlin 代码, 并看到结果.

<img src="kotlin-shell.png" alt="Shell" width="500"/>

## 运行脚本

你也可以将 Kotlin 用作脚本语言.
一个 Kotlin 脚本就是一个 Kotlin 源代码文件 (`.kts`), 其中包含顶级(Top-Level)可执行代码.

```kotlin
import java.io.File

// 得到参数传入的路径, 也就是 "-d some/path", 或使用当前路径.
val path = if (args.contains("-d")) args[1 + args.indexOf("-d")]
           else "."

val folders = File(path).listFiles { file -> file.isDirectory() }
folders?.forEach { folder -> println(folder) }
```

要运行一个脚本, 请向编译器传递 `-script` 选项, 加上对应的脚本文件:

```bash
kotlinc -script list_folders.kts -- -d <path_to_folder_to_inspect>
```

Kotlin 支持脚本的自定义功能(实验性功能), 例如添加外部属性, 提供静态或动态依赖项, 等等.
自定义通过所谓的 _脚本定义(Script Definition)_ 来定义 - 它是带注解的 Kotlin 类, 带有适当的支持代码.
通过脚本文件名称扩展来选择适当的定义.
详情请参见 [Kotlin 自定义脚本](custom-script-deps-tutorial.md).

在编译类路径中包含了正确的 jar 文件时, 会自动检测并使用适当准备的脚本定义.
或者, 你也可以向编译器传递 `-script-templates` 选项, 手动指定脚本定义:

```bash
kotlinc -script-templates org.example.CustomScriptDefinition -script custom.script1.kts
```

更多详情请参见 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md).
