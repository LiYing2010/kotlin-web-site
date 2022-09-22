---
type: doc
layout: reference
category:
title: "Kotlin/JVM 入门"
---

# Kotlin/JVM 入门

最终更新: {{ site.data.releases.latestDocDate }}

本教程演示如何使用 IntelliJ IDEA 创建一个控制台应用程序.

开始之前, 首先请下载并安装最新版的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).

## 创建项目

1. 在 IntelliJ IDEA 中, 选择菜单 **File** \| **New** \| **Project**.
2. 在左侧面板中, 选择 **New Project**.
3. 输入项目名称, 如果需要的话, 修改它的保存位置.

   > 选择 **Create Git repository**, 可以将新项目存入版本控制系统. 这个操作也可以在之后的任何时候进行.
   {:.tip}

4. 在 **Language** 列表中, 选择 **Kotlin**.

   <img src="/assets/docs/images/get-started/jvm-new-project.png" alt="创建一个控制台应用程序" width="700"/>

5. 选择 **IntelliJ** 构建系统. 这是原生的构建器, 不需要下载任何额外的 artifact.

   如果你希望创建更加复杂的项目, 需要更多配置, 请选择 Maven 或 Gradle.
   对于 Gradle,请选择构建脚本的语言: Kotlin 或 Groovy.
6. 在 **JDK list** 中, 选择希望在项目中使用的 [JDK](https://www.oracle.com/java/technologies/downloads/).
    * 如果在你的计算机上已经安装了 JDK, 但在 IDE 中没有定义, 请选择 **Add JDK**, 并指定 JDK home 目录的路径.
    * 如果在你的计算机上还没有需要的 JDK, 请选择 **Download JDK**.

7. 启用 **Add sample code** 选项, 创建文件, 其中包含 `"Hello World!"` 示例程序.
8. 点击 **Create**.

## 创建应用程序

1. 如果你选择了 Gradle 构建系统, 那么在你的项目中会有 `build.gradle(.kts)` 构建脚本文件.
   其中包含 `kotlin("jvm")` 插件, 以及你的控制台应用程序需要的依赖项目. 请确认使用了插件的最新版本:

   ```kotlin
   plugins {
       kotlin("jvm") version "{{ site.data.releases.latest.version }}"
       application
   }
   ```

2. 打开 `src/main/kotlin` 中的 `main.kt` 文件.
   `src` 目录包含 Kotlin 源代码文件和资源文件. `main.kt` 文件包含示例代码, 它会输出 `Hello World!`.

   <img src="/assets/docs/images/get-started/jvm-main-kt-initial.png" alt="包括 main 函数的 main.kt 文件" width="700"/>

3. 修改代码, 让它询问你的名字, 然后只对你说 `Hello`, 而不是对整个世界:

   * 使用关键字 `val` 引入一个局部变量 `name`. 它会得到你输入的名字 –
     [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html).

     > readln() 函数从 [Kotlin 1.6.0](../whatsnew16.html#new-readline-functions) 开始可用.
     > 请确保你安装了最新版的 [Kotlin plugin](../releases.html).
     {:.note}

   * 使用字符串模板, 直接在输出的文本内, 在变量名之前添加一个 `$` 符号 – `$name`.

   ```kotlin
   fun main() {
       println("What's your name?")
       val name = readln()
       println("Hello, $name!")
   }
   ```

   <img src="/assets/docs/images/get-started/jvm-main-kt-updated.png" alt="修改 main 函数" width="350"/>

## 运行应用程序

现在应用程序已经可以运行了. 最简单的方法是, 在源代码编辑器侧栏中按绿色的 **Run** 图标, 然后选择 **Run 'MainKt'**.

<img src="/assets/docs/images/get-started/jvm-run-app.png" alt="运行控制台应用程序" width="350"/>

你可以在 **Run** 工具窗口中看到运行结果.

<img src="/assets/docs/images/get-started/jvm-output-1.png" alt="Kotlin 的运行输出" width="600"/>

输入你的名字, 然后可以看到你的应用程序向你问候!

<img src="/assets/docs/images/get-started/jvm-output-2.png" alt="Kotlin 的运行输出" width="600"/>

恭喜你! 你已经运行了你的第一个 Kotlin 应用程序.

## 下一步做什么?

创建了这个应用程序之后, 你可以开始更加深入的学习 Kotlin 语法:

* 从 [Kotlin 示例程序](https://play.kotlinlang.org/byExample/overview) 添加示例代码
* 在 IDEA 中安装 [EduTools plugin](https://plugins.jetbrains.com/plugin/10081-edutools),
  并完成
  [Kotlin Koan 课程](https://plugins.jetbrains.com/plugin/10081-edutools/docs/learner-start-guide.html?section=Kotlin%20Koans)
  中的练习
