[//]: # (title: Kotlin/Native 开发入门 - 使用命令行编译器)

## 下载并安装编译器

Kotlin/Native 编译器可以运行于 macOS, Linux, 以及 Windows 环境.
它是一个命令行工具, 作为 Kotlin 的一部分发布,
你可以在我们的 [GitHub 发布页面](%kotlinLatestUrl%) 下载它.

编译器支持不同的编译目标, 包括 Linux, macOS, iOS, 等等.
参见 [所有支持的编译目标完整列表](native-target-support.md).
尽管跨平台编译是可能的, 也就是说可以在某个平台上针对另一个平台进行编译,
但你应该只在相同的平台上进行编译.

> 尽管编译器的输出不包含任何依赖项, 也不要求任何虚拟机, 但编译器本身需要 Java 1.8 或更高版本的运行环境.
> 可以使用 [JDK 8 (JAVA SE 8) 更高版本](https://www.oracle.com/java/technologies/downloads/).
>
{style="note"}

要安装编译器, 请在某个目录解开它的压缩包, 然后将它的 `/bin` 目录路径添加到 `PATH` 环境变量中.

## 编写 "Hello Kotlin/Native" 程序

这个应用程序将会向标准输出打印 "Hello Kotlin/Native". 在你选择的工作目录, 创建一个文件, 名为 `hello.kt`,
并输入以下内容:

```kotlin
fun main() {
    println("Hello, Kotlin/Native!")
}
```

## 在控制台编译代码

要编译应用程序, 请使用从 [这里](https://github.com/JetBrains/kotlin/releases) 下载的编译器, 执行以下命令:

```bash
kotlinc-native hello.kt -o hello
```

`-o` 选项的值指定编译输出文件的名称, 因此这个命令会生成二进制文件,
名为 `hello.kexe` (在 Linux 和 macOS 平台) 或 `hello.exe` (在 Windows 平台).
关于可用选项的完整列表, 请参见 [Kotlin 编译器选项](compiler-reference.md).

在控制台编译似乎很简单清楚, 但不适合于包含数百个文件和库的大项目.
对于真正的项目, 推荐使用 [构建系统](native-gradle.md) 和 [IDE](native-get-started.md).

## 运行程序

要运行程序, 请在你的命令行工具中, 进入 `hello.kexe` (或 `hello.exe`) 文件所在的目录,
并运行 `./hello.kexe` (或 `./hello.exe`) 命令.
应用程序会在标准输出中打印输出 "Hello, Kotlin/Native".
