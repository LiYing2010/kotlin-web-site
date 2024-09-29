[//]: # (title: 教程 - 使用 IntelliJ IDEA 调试协程)

最终更新: %latestDocDate%

本教程演示如何创建 Kotlin 协程, 并使用 IntelliJ IDEA 调试这些协程.

本教程假定你已经了解了 [协程](coroutines-guide.md) 的基本概念.

## 创建协程

1. 在 IntelliJ IDEA 中打开一个 Kotlin 项目. 如果你没有项目, 请 [创建一个项目](jvm-get-started.md#create-an-application).

2. 要在 Gradle 项目中使用 `kotlinx.coroutines` 库, 请向 `build.gradle(.kts)` 添加以下依赖项:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
   }
   ```

   </tab>
   </tabs>

   对于其他构建系统, 请参见 [`kotlinx.coroutines` README](https://github.com/Kotlin/kotlinx.coroutines#using-in-your-projects) 中的说明.

3. 打开 `src/main/kotlin` 中的 `Main.kt` 文件.

    `src` 目录包含 Kotlin 源代码文件和资源文件. `Main.kt` 文件包含示例代码, 它会输出 `Hello World!`.

4. 修改中 `main()` 函数的代码:

    * 使用 [`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) 代码块来封装一一个协程.
    * 使用 [`async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 函数创建协程, 分别计算 `a` 和 `b` 的值.
    * 使用 [`await()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html) 函数等待计算结果.
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

5. 点击 **Build Project**, 构建代码.

    ![构建一个应用程序](flow-build-project.png)

## 调试协程

1. 在 `println()` 函数调用的行设置断点:

   ![构建一个控制台应用程序](coroutine-breakpoint.png)

2. 点击画面顶部运行配置旁边的 **Debug**, 在调试模式下运行代码.

   ![构建一个控制台应用程序](flow-debug-project.png)

    然后会出现 **Debug** 工具窗口:
    * **Frames** 页包含调用栈.
    * **Variables** 页包含当前上下文中的变量.
    * **Coroutines** 页包含正在运行的或挂起的协程信息. 它显示存在 3 个协程.
    第一个协程状态为 **RUNNING**, 其它两个状态为 **CREATED**.

    ![调试协程](coroutine-debug-1.png)

3. 点击 **Debug** 工具窗口中的 **Resume Program**, 恢复调试器 session:

    ![调试协程](coroutine-debug-2.png)

    现在 **Coroutines** 页显示如下:
    * 第 1 个协程状态为 **SUSPENDED** – 它在等待值, 以便执行乘法运算.
    * 第 2 个协程正在计算 `a` 的值 – 状态为 **RUNNING**.
    * 第 3 个协程状态为 **CREATED**, 还没有计算 `b` 的值.

4. 点击 **Debug** 工具窗口中的 **Resume Program**, 恢复调试器 session:

   ![构建一个控制台应用程序](coroutine-debug-3.png)

   现在 **Coroutines** 页显示如下:
    * 第 1 个协程状态为 **SUSPENDED** – 它在等待值, 以便执行乘法运算.
    * 第 2 个协程已经计算完毕, 并且消失了.
    * 第 3 个协程正在计算 `b` 的值 – 它的状态为 **RUNNING**.

使用 IntelliJ IDEA 调试器, 你可以深入挖掘各个协程的信息, 调试你的代码.

### 被优化的变量

如果你使用 `suspend` 函数, 那么在调试器中, 你可能会在变量名称旁边看到 "was optimized out" 文字:

![变量 "a" 被优化了](variable-optimised-out.png)

这段文字的意思是说, 变量的生存时间变短了, 而且变量已经不再存在了.
如果变量被优化, 调试代码会变得困难, 因为你看不到变量值.
你可以使用 `-Xdebug` 编译器选项禁止这种优化.

> __绝对不要在产品(Production)模式中使用这个选项__: `-Xdebug` 可能 [导致内存泄露](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0).
>
{style="warning"}
