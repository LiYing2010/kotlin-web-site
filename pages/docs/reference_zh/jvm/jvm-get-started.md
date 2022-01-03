---
type: doc
layout: reference
category:
title: "Kotlin/JVM 入门"
---

# Kotlin/JVM 入门

本页面最终更新: 2022/01/10

本教程演示如何使用 IntelliJ IDEA 创建一个控制台应用程序.

开始之前, 首先请下载并安装最新版的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).

## 创建应用程序

安装完 IntelliJ IDEA 之后, 让我们来创建你的第一个 Kotlin 应用程序.

1. 在 IntelliJ IDEA 中, 选择菜单 **File** \| **New** \| **Project**.
2. 在左侧面板中, 选择 **Kotlin**.
3. 输入项目名称, 选择 **Console Application** 作为项目模板, 然后按 **Next** 按钮.

   <img src="/assets/docs/images/get-started/jvm-new-project-1.png" alt="创建一个控制台应用程序" width="700"/>

   默认情况下, 你的项目将会使用 Gradle 构建系统, 构建脚本的语言是 Kotlin DSL.

4. 跳过后面的画面, 接受默认配置, 然后按 **Finish** 按钮.

   <img src="/assets/docs/images/get-started/jvm-new-project-2.png" alt="配置控制台应用程序" width="700"/>

   然后你的项目将会打开. 默认情况下, 你会看到文件 `build.gradle.kts`, 它是项目向导根据你的配置创建的构建脚本.
   其中包括 `kotlin("jvm")` plugin 以及你的控制台应用程序需要的依赖项目.

5. 打开 `src/main/kotlin` 中的 `main.kt` 文件.
   `src` 目录包含 Kotlin 源代码文件和资源文件. `main.kt` 文件包含示例代码, 它会输出 `Hello World!`.

   <img src="/assets/docs/images/get-started/jvm-main-kt-initial.png" alt="包括 main 函数的 main.kt 文件" width="700"/>

6. 修改代码, 让它询问你的名字, 然后只对你说 `Hello`, 而不是对整个世界:

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
  [Kotlin Koan 课程](https://www.jetbrains.com/help/education/learner-start-guide.html?section=Kotlin%20Koans)
  中的练习
