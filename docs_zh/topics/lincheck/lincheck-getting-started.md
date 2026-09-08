[//]: # (title: Lincheck 入门)
[//]: # (description: 这篇快速入门向导将引导你, 完成 Lincheck 的设置, 编写你的第一个 Lincheck 测试, 并解读测试报告.)

这篇快速入门向导将引导你, 完成 Lincheck 的设置, 编写你的第一个 Lincheck 测试, 并解读测试报告.

你将会:
* 创建一个新的 IntelliJ IDEA 项目, 并安装 Lincheck.
* 编写你的第一个并发测试, 并使用 Lincheck 运行它.
* 创建一个并发数据结构, 并使用两种测试策略, 通过 Lincheck 进行测试.~~

## 创建项目 {id="create-a-project"}

在 IntelliJ IDEA 中打开一个既有的 Kotlin 项目, 或者 [创建一个新项目](jvm-get-started.md).

## 添加依赖项 {id="add-dependencies"}

要在项目中使用 Lincheck, 请在你的构建配置中添加相应的依赖项:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
repositories {
    mavenCentral()
}

dependencies {
    testImplementation("org.jetbrains.lincheck:lincheck:%lincheckVersion%")
    testImplementation(kotlin("test"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
repositories {
    mavenCentral()
}

dependencies {
    testImplementation "org.jetbrains.lincheck:lincheck:%lincheckVersion%"
    testImplementation "org.jetbrains.kotlin:kotlin-test"
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<!-- pom.xml -->
<project>
    <dependencies>
         <dependency>
             <groupId>org.jetbrains.lincheck</groupId>
             <artifactId>lincheck</artifactId>
             <version>%lincheckVersion%</version>
             <scope>test</scope>
         </dependency>
         <dependency>
             <groupId>org.jetbrains.kotlin</groupId>
             <artifactId>kotlin-test</artifactId>
             <scope>test</scope>
         </dependency>
    </dependencies>
    ...
</project>
```

</tab>
</tabs>

## 编写你的第一个测试 {id="write-your-first-test"}

对于一个基本的并发测试, 创建一个测试函数, 描述每个线程中应该执行的操作以及预期的断言.
Lincheck 使用 [模型检查(Model Checking)](testing-strategies.md#model-checking) 探索程序可能的线程交叉执行,
并在出现错误行为时提供错误报告.

1. 在 `src/test` 目录中, 创建 `CounterTest.kt` 文件.
2. 导入 `org.jetbrains.lincheck`, `kotlinx.concurrent`, 和 `kotlin.test` 库:

    ```kotlin
    import org.jetbrains.lincheck.*
    import kotlin.concurrent.*
    import kotlin.test.*
    ```

3. 编写一个测试, 创建一个变量, 以及操作该变量的两个线程:

    ```kotlin
    class CounterTest {
        @Test // 声明测试函数
        fun test() = Lincheck.runConcurrentTest {
            var counter = 0

            // 并发的递增 counter
            val t1 = thread { counter++ }
            val t2 = thread { counter++ }

            // 等待线程结束
            t1.join()
            t2.join()

            // 检查两次递增操作是否都已生效
            assertEquals(2, counter)
        }
    }
    ```

4. 运行测试. Lincheck 会生成一个报告, 其中包含导致错误行为的线程交叉执行:

    > 请安装 [Lincheck plugin](https://plugins.jetbrains.com/plugin/24171-lincheck),
    > 可视化查看错误追踪.
    >
    {style="note"}

    ```text
    | ------------------------------------------------------------------------------- |
    |                   Main Thread                   |   Thread 1    |   Thread 2    |
    | ------------------------------------------------------------------------------- |
    | thread(block = Lambda#2): Thread#1              |               |               |
    | thread(block = Lambda#3): Thread#2              |               |               |
    | switch (reason: waiting for Thread 1 to finish) |               |               |
    |                                                 |               | run()         |
    |                                                 |               |   counter ➜ 0 |
    |                                                 |               |   switch      |
    |                                                 | run()         |               |
    |                                                 |   counter ➜ 0 |               |
    |                                                 |   counter = 1 |               |
    |                                                 |               |   counter = 1 |
    | Thread#1.join()                                 |               |               |
    | Thread#2.join()                                 |               |               |
    | counter.element ➜ 1                             |               |               |
    | assertEquals(2, 1): threw AssertionFailedError  |               |               |
    | ------------------------------------------------------------------------------- |
    ```

    Lincheck 找到了一个线程交叉执行, 其中一个 `inc()` 操作覆盖了 `counter` 的值.
    <deflist collapsible="true">
        <def title="逐步解读报告" default-state="collapsed">
        <list type="decimal">
            <li> 在 Thread 2 中, JVM 读取了初始的 <code>counter</code> 值.</li>
            <li> 执行从 Thread 2 切换到 Thread 1.</li>
            <li> 在 Thread 1 中, JVM 递增了计数器. <code>inc()</code> 操作的所有步骤都不中断地执行完毕:
                 从变量读取值, 递增值, 并将值写回变量.</li>
            <li> 执行切换回 Thread 2.</li>
            <li> 在 Thread 2 中, JVM 将步骤 1 中获取的值加 1, 并将结果写入
                 <code>counter</code> 变量.</li>
            </list>
            </def>
    </deflist>

## 为数据结构编写测试 {id="write-a-test-for-a-data-structure"}

除了基本的并发测试之外, Lincheck 还支持以声明式方案测试并发数据结构.

要在 Lincheck 中测试数据结构, 你只需要声明数据结构的并发方法, 以及一个测试函数.
Lincheck 会生成随机的并发场景, 使用指定的测试策略执行这些场景, 并提供错误报告.

本节中, 你将测试一个简单的计数器:

1. 在 `src/test` 目录中, 创建 `CounterStructureTest.kt` 文件.
2. 导入 `lincheck.datastructures` 和 `kotlin.test` 库:

    ```kotlin
    import org.jetbrains.lincheck.datastructures.*
    import kotlin.test.*
    ```

3. 创建一个 `Counter` 数据结构:

    ```kotlin
    class Counter {
        @Volatile
        private var value = 0

        fun inc(): Int = ++value
        fun get() = value
    }
    ```

4. 创建 `CounterStructureTest` 类. 设置数据结构的初始状态, 并使用 `@Operation` 注解标记数据结构的并发操作:

    ```kotlin
    class CounterStructureTest {
        // 初始状态
        private val c = Counter()

        // 并发操作
        @Operation
        fun inc() = c.inc()

        @Operation
        fun get() = c.get()
    }
    ```

5. 在 `CounterTest` 类中, 使用 `ModelCheckingOptions()` 声明一个测试函数:

    ```kotlin
    @Test
    fun stressTest() = ModelCheckingOptions().check(this::class)
    ```

    > 关于模型检查的工作原理, 请参见 [测试策略](testing-strategies.md#model-checking).
    >
    {style="tip"}

6. 运行测试. Lincheck 会生成一个错误报告, 其中包含并发场景, 以及导致错误行为的具体线程交叉执行情况:

    ```text
    | ------------------- |
    | Thread 1 | Thread 2 |
    | ------------------- |
    | inc(): 1 | inc(): 1 |
    | ------------------- |
    ```

    ```text
    | ------------------------ |
    | Thread 1 |   Thread 2    |
    | ------------------------ |
    |          | inc(): 1      |
    |          |   c.inc(): 1  |
    |          |     value ➜ 0 |
    |          |     switch    |
    | inc(): 1 |               |
    |          |     value = 1 |
    |          |     value ➜ 1 |
    |          |   result: 1   |
    | ------------------------ |
    ```

## 下一步 {id="whats-next"}

阅读 [测试策略](testing-strategies.md) 章节, 进一步了解数据结构测试的声明式方案, 以及支持的测试策略.
