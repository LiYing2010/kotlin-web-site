---
type: doc
layout: reference
category:
title: "Kotlin/Native 开发入门 - 使用 IntelliJ IDEA"
---

# Kotlin/Native 开发入门 - 使用 IntelliJ IDEA

本页面最终更新: 2022/04/19

本教程演示如何使用 IntelliJ IDEA 创建一个 Kotlin/Native 应用程序.

开始之前, 首先请安装 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) 的最新版.
本教程适用于 IntelliJ IDEA Community 版和 Ultimate 版.

## 在 IntelliJ IDEA 中创建一个新的 Kotlin/Native 项目

1. 在 IntelliJ IDEA 中, 选择 **File** \| **New** \| **Project**.
2. 在左侧面板中, 选择 **Kotlin**.
3. 收入项目名称, 选择 **Native Application** 作为项目模板, 并点击 **Next**.

   ![创建 native 应用程序]({{ url_for('asset', path='/docs/images/get-started/native-new-project-intellij-1.png') }})

   你的项目默认会使用 Gradle 和 Kotlin DSL 作为构建系统.
   > Kotlin/Native 不支持 Maven 和 IntelliJ IDEA native 构建器.
   {:.note}

4. 接受下一个画面中的默认配置, 并点击 **Finish**.

   ![配置 native 应用程序]({{ url_for('asset', path='/docs/images/get-started/native-new-project-intellij-2.png') }})

你的项目会打开. 默认情况下, 向导会创建必要的 `main.kt` 文件， 其中的代码是向标准输出打印 "Hello, Kotlin/Native!".

`build.gradle.kts` 文件包含项目设置. 要创建 Kotlin/Native 应用程序, 你需要安装 Kotlin Multiplatform Gradle plugin.
请确认使用了 plugin 的最新版本:

```kotlin
plugins {
    kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}
```
   
> * 关于这些设置, 详情请参见 [跨平台程序的 Gradle DSL 参考文档](../mpp/mpp-dsl-reference.html).
> * 关于 Gradle 构建系统, 详情请参见 [Gradle 文档](../gradle.html). 
{:.tip}

## 构建并运行应用程序

1. 点击屏幕顶部运行配置旁边的 **Build Project**:

   <img src="/assets/docs/images/get-started/native-run-app.png" alt="构建应用程序" width="600"/>

2. 在 **Terminal** 页, 运行以下命令:

   ```bash
   build/bin/native/debugExecutable/<your_app_name>.kexe
   ```

   IntelliJ IDEA 会输出 "Hello, Kotlin/Native!".

你可以 [配置 IntelliJ IDEA](https://www.jetbrains.com/help/idea/compiling-applications.html#auto-build),
让它自动构建你的项目:

1. 打开菜单 **Settings/Preferences \| Build, Execution, Deployment \| Compiler**.
2. 在 **Compiler** 页, 选择 **Build project automatically**.
3. 保存变更.

现在, 当你在类文件中进行变更, 或者保存文件 (**Ctrl + S**/**Cmd + S**)时,
IntelliJ IDEA 会自动对项目执行增量构建(Incremental Build).

## 更新应用程序

### 计算你的名字中的字母数量

1. 打开 `src/nativeMain/kotlin` 中的 `main.kt` 文件.

   `src` 目录包含 Kotlin 源代码文件和资源. `main.kt` 文件包含示例代码, 它使用
   [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 函数
   打印 "Hello, Kotlin/Native!".

2. 添加代码读取输入. 使用
   [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函数
   读取输入值, 并赋值给 `name` 变量:

   > readln() 函数从 [Kotlin 1.6.0](../whatsnew16.html#new-readline-functions) 开始可用.  
   > 请确认你安装了 [Kotlin plugin](../releases.html) 的最新版.
   {:.note}

   ```kotlin
   fun main() {
       // 读取输入值.
       println("Hello, enter your name:")
       val name = readln()
   }
   ```

3. 删除空白字符, 计算字母数量:
   * 使用
     [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) 函数
     删除名字中的空白字符 .
   * 使用作用域函数(Scope Function)
     [`let`](../scope-functions.html#let)
     在对象上下文之内运行函数. 
   * 使用一个 [字符串模板](../basic-types.html#string-templates) 来向一个字符串插入你的名字长度,
     方法是添加一个 `$` 符号, 并将表达式放在大括号内 – `${it.length}`.
     `it` 是 [lambda 表达式参数](../coding-conventions.html#lambda-parameters) 的默认名称.

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

4. 保存变更, 运行构建命令:

   ```bash
   build/bin/native/debugExecutable/<your_app_name>.kexe
   ```

5. 输入你的名字, 查看结果:

   ![应用程序输出]({{ url_for('asset', path='/docs/images/get-started/native-output-2.png') }})

### 计算你的名字中的不重复的字母数量

1. 打开 `src/nativeMain/kotlin` 中的 `main.kt` 文件.

2. 为 `String` 声明新的 [扩展函数](../extensions.html#extension-functions) `countDistinctCharacters()`:

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

4. 保存变更, 运行构建命令:

   ```bash
   build/bin/native/debugExecutable/<your_app_name>.kexe
   ```

5. 输入你的名字, 查看结果:

   ![应用程序输出]({{ url_for('asset', path='/docs/images/get-started/native-output-3.png') }})

## 下一步做什么?

创建过你的第一个应用程序之后, 你可以到 Kotlin 动手实验室(Hands-on lab), 完成比较长的 Kotlin/Native 教程. 

对于 Kotlin/Native, 动手实验室目前包括以下教程:

* [学习 Kotlin/Native 中的并发模型](https://play.kotlinlang.org/hands-on/Kotlin%20Native%20Concurrency/00_Introduction):
  演示如何构建一个命令行应用程序, 在多线程环境中使用有状态的数据.
* [使用 C Interop 和 libcurl 创建应用程序](native-app-with-c-and-libcurl.html):
  演示如何创建一个 native HTTP 客户端, 以及如何与 C 代码库交互.
