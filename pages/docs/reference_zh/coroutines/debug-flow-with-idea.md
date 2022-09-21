---
type: doc
layout: reference
category:
title: "教程 - 使用 IntelliJ IDEA 调试 Kotlin 数据流(Flow)"
---

# 教程 - 使用 IntelliJ IDEA 调试 Kotlin 数据流(Flow)

最终更新: {{ site.data.releases.latestCoroutinesDocDate }}

本教程演示如何创建 Kotlin 数据流(Flow), 并使用 IntelliJ IDEA 调试它.

本教程假定你已经具备了 [协程](coroutines-guide.html) 和 [Kotlin 数据流(Flow)](flow.html#flows) 的相关知识.

## 创建 Kotlin 数据流

创建一个 Kotlin
[数据流(Flow)](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow.html),
其中包括一个慢速的发射者(emitter)和一个慢速的收取者(collector):

1. 在 IntelliJ IDEA 中打开一个 Kotlin 项目. 如果你没有项目, 请 [创建项目](../jvm/jvm-get-started.html#create-an-application).

2. 要在 Gradle 项目中使用 `kotlinx.coroutines` 库, 请向 `build.gradle(.kts)` 添加以下依赖项:

   <div class="multi-language-sample" data-lang="kotlin">
   <div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}")
   }
   ```
   
   </div>
   </div>
   
   <div class="multi-language-sample" data-lang="groovy">
   <div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}'
   }
   ```
   
   </div>
   </div>

   对于其他构建系统, 请参见 [`kotlinx.coroutines` README](https://github.com/Kotlin/kotlinx.coroutines#using-in-your-projects) 中的说明.

3. 打开 `src/main/kotlin` 中的 `Main.kt` 文件 .

    `src` 目录包含 Kotlin 源代码文件和资源. `Main.kt` 文件包含一段输出 `Hello World!` 的示例代码.

4. 创建 `simple()` 函数, 它返回一个数据流, 其中包含 3 个数字:

    * 使用
      [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html)
      函数来模拟一段大量消耗 CPU 的阻塞代码. 这个函数会挂起协程 100 ms, 不会阻塞线程.
    * 在 `for` 循环内使用
      [`emit()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow-collector/emit.html)
      函数产生值.

    ```kotlin
    import kotlinx.coroutines.*
    import kotlinx.coroutines.flow.*
    import kotlin.system.*
 
    fun simple(): Flow<Int> = flow {
        for (i in 1..3) {
            delay(100)
            emit(i)
        }
    }
    ```

5. 修改 `main()` 函数中的代码:

    * 使用
      [`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html)
      代码块封装一个协程.
    * 使用
      [`collect()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/collect.html)
      函数收取发射的值.
    * 使用
      [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html)
      函数来模拟一段大量消耗 CPU 的阻塞代码. 这个函数会挂起协程 300 ms, 不会阻塞线程.
    * 使用
      [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html)
      函数打印从数据流收取的值.

    ```kotlin
    fun main() = runBlocking {
        simple()
            .collect { value ->
                delay(300)
                println(value)
            }
    }
    ```

6. 点击 **Build Project** 构建代码.

    ![构建应用程序]({{ url_for('asset', path='docs/images/coroutines/flow-build-project.png') }})

## 调试协程

1. 在调用 `emit()` 函数的代码行设置一个断点:

    ![构建一个控制台应用程序]({{ url_for('asset', path='docs/images/coroutines/flow-breakpoint.png') }})

2. 点击屏幕顶部运行配置旁边的 **Debug**, 使用调试模式运行代码.

    ![构建一个控制台应用程序]({{ url_for('asset', path='docs/images/coroutines/flow-debug-project.png') }})

    这时会出现 **Debug** 工具窗口: 
    * **Frames** 页包含调用栈信息.
    * **Variables** 页包含当前上下文环境中的变量. 它告诉我们数据流正在发射第 1 个值.
    * **Coroutines** 页包含正在运行中的或者被挂起的协程信息.

    ![调试协程]({{ url_for('asset', path='docs/images/coroutines/flow-debug-1.png') }})

3. 点击 **Debug** 工具窗口中的 **Resume Program**, 回复调试器运行. 程序会在同一个断点再次暂停.

    ![调试协程]({{ url_for('asset', path='docs/images/coroutines/flow-resume-debug.png') }})

    现在数据流发射第 2 个值.

    ![调试协程]({{ url_for('asset', path='docs/images/coroutines/flow-debug-2.png') }})

## 添加一个并发运行的协程

1. 打开 `src/main/kotlin` 中的 `main.kt` 文件.

2. 修改代码, 让发射者和收取者并发运行:

    * 推荐一个
      [`buffer()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/buffer.html)
      函数调用, 并发运行发射者和收取者. `buffer()` 存储已发射的值, 并在一个独立的协程中运行数据流收取者. 
 
    ```kotlin
    fun main() = runBlocking<Unit> {
        simple()
            .buffer()
            .collect { value ->
                delay(300)
                println(value)
            }
    }
    ```

3. 点击 **Build Project**, 构建代码.

## 调试有 2 个协程的 Kotlin 数据流 

1. 在 `println(value)` 处设置一个新断点.

2. 点击屏幕顶部运行配置旁边的 **Debug**, 使用调试模式运行代码.

    ![构建一个控制台应用程序]({{ url_for('asset', path='docs/images/coroutines/flow-debug-3.png') }})

    这时会出现 **Debug** 工具窗口.

    在 **Coroutines** 页中, 你可以看到存在 2 个协程并发运行. 由于调用了 `buffer()` 函数, 数据流收取者和发射者运行在独立的协程中.
    `buffer()` 函数会缓存数据流中发射的值.
    发射者协程状态为 **RUNNING**, 而收取者协程状态为 **SUSPENDED**.

3. 点击 **Debug** 工具窗口中的 **Resume Program**, 回复调试器运行.

    ![调试协程]({{ url_for('asset', path='docs/images/coroutines/flow-debug-4.png') }})

    现在收取者协程状态为 **RUNNING**, 而发射者协程状态为 **SUSPENDED**.

    你可以深入挖掘各个协程的信息, 来调试你的代码.
