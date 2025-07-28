[//]: # (title: 教程 - 使用 C interop 和 libcurl 创建应用程序)

本教程演示如何使用 IntelliJ IDEA 创建一个命令行应用程序.
你将学习如何创建一个简单的 HTTP 客户端程序, 它使用 Kotlin/Native 和 libcurl 库, 可以作为原生程序运行在指定的平台上.

输出将是一个可执行的命令行应用程序, 你可以在 macOS 和 Linux 上运行, 发送简单的 HTTP GET 请求.

你可以通过命令行生成 Kotlin 库, 可以直接使用命令行, 也可以使用脚本文件(比如 `.sh` 或 `.bat` 文件).
但是, 这种方法不适合于包含几百个文件和库的大项目.
使用构建系统可以简化构建过程, 它能够下载并缓存 Kotlin/Native 编译器二进制文件, 传递依赖的库, 并运行编译器和测试.
Kotlin/Native 能够通过 [Kotlin Multiplatform plugin](gradle-configure-project.md#targeting-multiple-platforms)
使用 [Gradle](https://gradle.org) 构建系统.

## 开始前的准备工作 {id="before-you-start"}

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/).
2. 在 IntelliJ IDEA 中选择菜单 **File** | **New** | **Project from Version Control**,
   使用这个 URL, 克隆 [项目模板](https://github.com/Kotlin/kmp-native-wizard):

   ```none
   https://github.com/Kotlin/kmp-native-wizard
   ```

3. 查看项目结构:

   ![Native 应用程序项目结构](native-project-structure.png){width=700}

   模板创建的项目带有你开始工作时所需要的文件和文件夹. 请注意, 如果代码中不包含与特定平台相关的需求,
   那么使用 Kotlin/Native 编写的应用程序可以编译到不同的平台.
   你的代码放在 `nativeMain` 目录中, 此外还有对应的 `nativeTest` 目录.
   在这个教程中, 请不要修改这些文件夹结构.

4. 打开构建脚本文件 `build.gradle.kts`, 其中包含项目的设定.
   请特别注意构建脚本文件中的以下内容:

    ```kotlin
    kotlin {
        val hostOs = System.getProperty("os.name")
        val isArm64 = System.getProperty("os.arch") == "aarch64"
        val isMingwX64 = hostOs.startsWith("Windows")
        val nativeTarget = when {
            hostOs == "Mac OS X" && isArm64 -> macosArm64("native")
            hostOs == "Mac OS X" && !isArm64 -> macosX64("native")
            hostOs == "Linux" && isArm64 -> linuxArm64("native")
            hostOs == "Linux" && !isArm64 -> linuxX64("native")
            isMingwX64 -> mingwX64("native")
            else -> throw GradleException("Host OS is not supported in Kotlin/Native.")
        }

        nativeTarget.apply {
            binaries {
                executable {
                    entryPoint = "main"
                }
            }
        }
    }
    ```

   * 针对 macOS, Linux, 和 Windows 的编译目标分别通过 `macosArm64`, `macosX64`, `linuxArm64`, `linuxX64`, 和 `mingwX64` 定义.
     关于所有支持的平台, 请参见 [支持的平台](native-target-support.md).
   * `binaries {}` 代码块定义二进制文件如何生成, 以及应用程序的入口点. 这些可以使用默认值.
   * 与 C 的交互使用构建中的一个额外步骤来配置. 默认情况下, 来自 C 的所有符号会被导入到 `interop` 包.
     你可能想要在 `.kt` 文件中导入整个包.
     详情请参见 [如何配置](gradle-configure-project.md#targeting-multiple-platforms).

## 创建一个定义文件 {id="create-a-definition-file"}

编写原生应用程序时, 你经常需要访问没有包含在 [Kotlin 标准库](https://kotlinlang.org/api/latest/jvm/stdlib/) 中的某些功能,
比如发起 HTTP 请求, 读写磁盘, 等等.

Kotlin/Native 帮助你使用 C 的标准库, 使你可以利用 C 的整个生态系统, 其中的功能几乎包含你需要的任何东西.
Kotlin/Native 带有一组预构建的 [平台库](native-platform-libs.md), 提供了标准库之外的一些通用功能.

与 C 交互的理想场景是, 象调用 Kotlin 函数一样调用 C 函数, 使用相同的函数签名和规约.
这就是 cinterop 工具可以帮助你的地方. 它输入一个 C 库, 并生成对应的 Kotlin 绑定, 使得库可以象 Kotlin 代码那样使用.

要生成这些绑定, 每个库需要一个定义文件, 通常使用与库相同的名称.
定义文件是一个属性文件, 它描述库具体应该如何使用.

在这个应用程序中, 你需要 libcurl 库来发起 HTTP 调用.
创建它的定义文件的步骤如下:

1. 选择 `src` 文件夹, 使用 **File | New | Directory** 创建一个新目录.
2. 将新目录命名为 **nativeInterop/cinterop**. 这是头文件位置的默认约定,
   如果你使用不同的位置, 也可以在 `build.gradle.kts` 文件中修改这个设置.
3. 选择新建的子文件夹, 使用 **File | New | File** 创建一个新的 `libcurl.def` 文件.
4. 将你的文件内容更新为以下代码:

    ```c
    headers = curl/curl.h
    headerFilter = curl/*

    compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
    linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/curl/lib -lcurl
    linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lcurl
    ```

   * `headers` 是需要生成 Kotlin 桩(stub)代码的头文件列表. 你可以在这里添加多个文件, 使用空格分隔.
     在这个示例中, 只有 `curl.h`. 引用的文件路径需要存在于指定的路径中(在这个示例中, 是 `/usr/include/curl`).
   * `headerFilter` 指定具体包含什么. 在 C 中, 当一个文件使用 `#include` 指令引用另一个文件时, 所有的头文件都会被包含.
     有时这些文件是不必要的, 你可以添加这个参数, [使用全局模式](https://en.wikipedia.org/wiki/Glob_(programming)) 进行调整.

     如果你不希望获取外部的依赖项 (比如系统的 `stdint.h` 头文件) 到你使用的库中, 可以使用 `headerFilter`.
     此外, 这个参数还可以用于库大小的优化, 修正系统与 Kotlin/Native 编译环境之间的潜在的冲突.

   * 如果针对特定平台的行为需要调整, 你可以使用 `compilerOpts.osx` 或 `compilerOpts.linux` 这样的格式,
     指定平台相关的选项值.
     在这个示例中, 是针对 macOS (`.osx` 后缀) 和 Linux (`.linux` 后缀) 环境的参数.
     也可以使用没有后缀的参数(比如, `linkerOpts=`), 会应用到所有的平台.

   关于可用的选项的完整列表, 请参见 [定义文件](native-definition-file.md#properties).

> 在你的系统需要存在 `curl` 库二进制文件, 才能让示例程序正确工作. 在 macOS 和 Linux 上, 通常会包含这个库.
> 在 Windows 上, 你可以从 [源代码](https://curl.se/download.html) 构建它 (你需要 Microsoft Visual Studio 或 Windows SDK 命令行工具).
> 详情请参见 [相关的 blog](https://jonnyzzz.com/blog/2018/10/29/kn-libcurl-windows/).
> 或者, 你也可以考虑使用一个 [MinGW/MSYS2](https://www.msys2.org/) 的 `curl` 二进制文件.
>
{style="note"}

## 向构建过程添加与 C 的交互 {id="add-interoperability-to-the-build-process"}

要使用头文件, 需要确保在构建过程中生成了它们.
要做到这一点, 请向 `build.gradle.kts` 文件添加下面的 `compilations {}` 代码块:

```kotlin
nativeTarget.apply {
    compilations.getByName("main") {
        cinterops {
            val libcurl by creating
        }
    }
    binaries {
        executable {
            entryPoint = "main"
        }
    }
}
```

首先, 添加了 `cinterops`, 然后为每个定义文件添加对应行.
默认情况下, 使用定义文件的名称. 你可以使用额外的参数来修改设定:

```kotlin
cinterops {
    val libcurl by creating {
        definitionFile.set(project.file("src/nativeInterop/cinterop/libcurl.def"))
        packageName("com.jetbrains.handson.http")
        compilerOpts("-I/path")
        includeDirs.allHeaders("path")
    }
}
```

## 编写应用程序代码 {id="write-the-application-code"}

现在你有了库, 以及对应的 Kotlin 桩代码(stub), 可以在你的应用程序中使用它们了.
本教程将 [simple.c](https://curl.se/libcurl/c/simple.html) 示例代码改写为 Kotlin.

在 `src/nativeMain/kotlin/` 文件夹中, 将你的 `Main.kt` 文件更新为以下代码:

```kotlin
import kotlinx.cinterop.*
import libcurl.*

@OptIn(ExperimentalForeignApi::class)
fun main(args: Array<String>) {
    val curl = curl_easy_init()
    if (curl != null) {
        curl_easy_setopt(curl, CURLOPT_URL, "https://example.com")
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L)
        val res = curl_easy_perform(curl)
        if (res != CURLE_OK) {
            println("curl_easy_perform() failed ${curl_easy_strerror(res)?.toKString()}")
        }
        curl_easy_cleanup(curl)
    }
}
```

你可以看到, 在 Kotlin 版本中删除了明确的变量声明, 但其他一切都和 C 版本一样.
在对应的 Kotlin 代码中, 可以使用 libcurl 库中所有的调用.

> 这段代码只是逐行的翻译. 你也可以以更加符合 Kotlin 风格的方式编写代码.
>
{style="tip"}

## 编译并运行应用程序 {id="compile-and-run-the-application"}

1. 编译应用程序. 方法是, 在 task 列表中运行 Gradle task `runDebugExecutableNative`, 或者在终端运行以下命令:

    ```bash
    ./gradlew runDebugExecutableNative
    ```

   这里, 由 cinterop 生成的部分, 会隐含的包含在构建中.

2. 如果编译过程中没有错误, 点击`main()` 函数旁边侧栏中的绿色的 **Run** 图标,
   或使用 <shortcut>Shift + Cmd + R</shortcut>/<shortcut>Shift + F10</shortcut> 快捷键.

   IntelliJ IDEA 会打开 **Run** 页面, 并显示输出 — [example.com](https://example.com/) 的内容:

   ![应用程序输出的 HTML 代码](native-output.png){width=700}

你可以看到实际的输出, 因为调用 `curl_easy_perform` 会将结果打印到标准输出.
你可以使用 `curl_easy_setopt` 隐藏这些信息.

> 你可以在我们的 [GitHub 代码仓库](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native) 得到完整的项目代码.
>
{style="note"}

## 下一步做什么

学习 [Kotlin 与 C 代码交互的功能](native-c-interop.md).
