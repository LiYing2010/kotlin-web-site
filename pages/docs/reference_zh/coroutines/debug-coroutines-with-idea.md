---
type: doc
layout: reference
category:
title: "教程 - 使用 IntelliJ IDEA 调试协程"
---

# 教程 - 使用 IntelliJ IDEA 调试协程

本页面最终更新: 2022/04/04

本教程演示如何创建 Kotlin 协程, 并使用 IntelliJ IDEA 调试这些协程.

本教程假定你已经了解了 [协程](coroutines-guide.html) 的基本概念.

> 调试需要 `kotlinx-coroutines-core` 1.3.8 或更高版本.
{:.note}

## 创建协程

1. 在 IntelliJ IDEA 中打开一个 Kotlin 项目. 如果你没有项目, 请 [创建一个项目](../jvm/jvm-get-started.html#create-an-application).

2. 打开 `src/main/kotlin` 中的 `main.kt` 文件.

    `src` 目录包含 Kotlin 源代码文件和资源文件. `main.kt` 文件包含示例代码, 它会输出 `Hello World!`.

3. 修改中 `main()` 函数的代码:

    * 使用 [`runBlocking()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) 代码块来封装一一个协程.
    * 使用 [`async()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 函数创建协程, 分别计算 `a` 和 `b` 的值.
    * 使用 [`await()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html) 函数等待计算结果.
    * 使用 [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 函数输出计算状态, 以及乘法运算的结果.

    ```kotlin
    import kotlinx.coroutines.*
    
    fun main() = runBlocking<Unit> {
        val a = async {
            println("I'm computing part of the answer")
            6
        }
        val b = async {
            println("I'm computing another part of the answer")
            7
        }
        println("The answer is ${a.await() * b.await()}")
    }
    ```

4. 点击 **Build Project**, 构建代码.

    ![构建一个应用程序]({{ url_for('asset', path='/docs/images/coroutines/flow-build-project.png') }})

## 调试协程

1. 在 `println()` 函数调用的行设置断点:

    ![构建一个控制台应用程序]({{ url_for('asset', path='/docs/images/coroutines/coroutine-breakpoint.png') }})

2. 点击画面顶部运行配置旁边的 **Debug**, 在调试模式下运行代码.

    ![构建一个控制台应用程序]({{ url_for('asset', path='/docs/images/coroutines/flow-debug-project.png') }})

    然后会出现 **Debug** 工具窗口: 
    * **Frames** 页包含调用栈.
    * **Variables** 页包含当前上下文中的变量.
    * **Coroutines** 页包含正在运行的或挂起的协程信息. 它显示存在 3 个协程.
    第一个协程状态为 **RUNNING**, 其它两个状态为 **CREATED**.

    ![调试协程]({{ url_for('asset', path='/docs/images/coroutines/coroutine-debug-1.png') }})

3. 点击 **Debug** 工具窗口中的 **Resume Program**, 恢复调试器 session:

    ![调试协程]({{ url_for('asset', path='/docs/images/coroutines/coroutine-debug-2.png') }})
    
    现在 **Coroutines** 页显示如下:
    * 第 1 个协程状态为 **SUSPENDED** – 它在等待值, 以便执行乘法运算.
    * 第 2 个协程正在计算 `a` 的值 – 状态为 **RUNNING**.
    * 第 3 个协程状态为 **CREATED**, 还没有计算 `b` 的值.

4. 点击 **Debug** 工具窗口中的 **Resume Program**, 恢复调试器 session:

    ![构建一个控制台应用程序]({{ url_for('asset', path='/docs/images/coroutines/coroutine-debug-3.png') }})

   现在 **Coroutines** 页显示如下:
    * 第 1 个协程状态为 **SUSPENDED** – 它在等待值, 以便执行乘法运算.
    * 第 2 个协程已经计算完毕, 并且消失了.
    * 第 3 个协程正在计算 `b` 的值 – 它的状态为 **RUNNING**.

使用 IntelliJ IDEA 调试器, 你可以深入挖掘各个协程的信息, 调试你的代码.
