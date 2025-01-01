[//]: # (title: Kotlin/Native 开发入门 - 使用 IntelliJ IDEA)

本教程演示如何使用 IntelliJ IDEA 创建一个 Kotlin/Native 应用程序.

开始之前, 首先请安装 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) 的最新版.
本教程适用于 IntelliJ IDEA Community 版和 Ultimate 版.

> 如果你使用的是 macOS 操作系统的 Mac 机, 想要创建并运行 iOS 应用程序或桌面应用程序,
> 你还需要 [安装 Xcode 命令行工具](https://developer.apple.com/download/).
> 详情请参见 [设置开发环境](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-setup.html).
>
{style="note"}

## 开始前的准备工作

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/) 和 [Kotlin plugin](releases.md).
2. 在 IntelliJ IDEA 中选择菜单 **File** | **New** | **Project from Version Control**,
   克隆 [项目模板](https://github.com/Kotlin/kmp-native-wizard).
3. 打开 `build.gradle.kts` 文件, 这是构建脚本, 其中包含项目设置.
   要创建 Kotlin/Native 应用程序, 你需要安装 Kotlin Multiplatform Gradle plugin.
   请确认使用了 plugin 的最新版本:

   ```kotlin
   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }
   ```

4. 遵循下图中的建议, 重新载入 Gradle 文件:

   ![载入 Gradle 变更按钮](load-gradle-changes.png){width=295}

> * 关于这些设置, 详情请参见 [跨平台程序的 Gradle DSL 参考文档](multiplatform-dsl-reference.md).
> * 关于 Gradle 构建系统, 详情请参见 [Gradle 文档](gradle.md).
>
{style="tip"}

## 构建并运行应用程序

打开 `src/nativeMain/kotlin/` 目录中的 `Main.kt` 文件, 然后按下侧栏中的绿色图标, 运行代码:

![运行应用程序](native-run-gutter.png){width=478}

IntelliJ IDEA 会使用 Gradle 任务运行代码. 你会在 **Run** Tab 中看到运行结果:

![应用程序的输出](native-output-gutter-1.png){width=331}

初次运行之后, 你会在 IDE 的顶栏中看到对应的运行配置:

![Gradle 运行配置](native-run-config.png){width=503}

> IntelliJ IDEA Ultimate 用户可以安装 [Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support) plugin,
> 这个 plugin 可以调试编译后的原生可执行文件, 还可以为导入的 Kotlin/Native 项目自动创建运行配置.
>
{style="tip"}

你可以 [配置 IntelliJ IDEA](https://www.jetbrains.com/help/idea/compiling-applications.html#auto-build),
让它自动构建你的项目:

1. 打开菜单 **Settings/Preferences | Build, Execution, Deployment | Compiler**.
2. 在 **Compiler** 页, 选择 **Build project automatically**.
3. 保存变更.

现在, 当你在类文件中进行变更, 或者保存文件 (**Ctrl + S**/**Cmd + S**)时,
IntelliJ IDEA 会自动对项目执行增量构建(Incremental Build).

## 更新应用程序

### 计算你的名字中的字母数量

1. 打开 `src/nativeMain/kotlin` 中的 `Main.kt` 文件.

   `src` 目录包含 Kotlin 源代码文件. `Main.kt` 文件包含代码,
   使用 [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 函数打印 "Hello, Kotlin/Native!".

2. 添加代码读取输入. 使用
   [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函数
   读取输入值, 并赋值给 `name` 变量:

   ```kotlin
   fun main() {
       // 读取输入值.
       println("Hello, enter your name:")
       val name = readln()
   }
   ```

3. 要使用 Gradle 运行这个应用程序, 请在 `build.gradle.kts` 文件中指定 `System.in` 作为运行项目时的输入, 并重新载入 Gradle:

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

4. 删除空白字符, 计算字母数量:
   * 使用
     [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) 函数
     删除名字中的空白字符 .
   * 使用作用域函数(Scope Function)
     [`let`](scope-functions.md#let)
     在对象上下文之内运行函数.
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

5. 运行应用程序.
6. 输入你的名字, 查看结果:

   ![应用程序的输出](native-output-gutter-2.png){width=422}

### 计算你的名字中的不重复的字母数量

1. 打开 `src/nativeMain/kotlin` 中的 `Main.kt` 文件.
2. 为 `String` 声明新的 [扩展函数](extensions.md#extension-functions) `countDistinctCharacters()`:

   * 使用
     [`lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 函数,
     将名字转换为小写.
   * 使用
     [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 函数,
     将输入的字符转换为一个字符列表.
   * 使用
     [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) 函数,
     选择你的名字中的不重复的字符.
   * 使用
     [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函数,
     计算不重复的字符.

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

3. 使用 `countDistinctCharacters()` 函数, 计算你的名字中不重复字符的数量:

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

4. 运行应用程序.
5. 输入你的名字, 查看结果:

   ![应用程序的输出](native-output-gutter-3.png){width=422}

## 下一步做什么?

创建过你的第一个应用程序之后, 你可以完成我们的 Kotlin/Native 长教程,
[使用 C Interop 和 libcurl 创建应用程序](native-app-with-c-and-libcurl.md),
这个教程将会演示如何创建一个 native HTTP 客户端, 以及如何与 C 代码库交互.
