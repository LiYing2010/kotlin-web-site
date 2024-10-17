[//]: # (title: 教程 - 在 JVM 平台使用 JUnit 进行代码测试)

本教程将向你演示如何编写简单的单元测试, 并使用 Gradle 构建工具来运行测试.

教程中的示例程序使用了 [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/index.html) 库, 并使用 JUnit 运行测试.

开始之前, 首先请下载并安装最新版的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).

## 添加依赖项

1. 在 IntelliJ IDEA 中打开一个 Kotlin 项目. 如果你还没有项目, 请 [创建一个新项目](jvm-get-started.md#create-an-application).

   > 创建项目时请选择 **JUnit 5** 作为测试框架.
   >
   {style="note"}

2. 打开 `build.gradle(.kts)` 文件, 并向 Gradle 配置添加以下依赖项. 通过这个依赖项, 你将可以使用 `kotlin.test` 和 `JUnit`:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       // 其他依赖项.
       testImplementation(kotlin("test"))
   }
   ```

    </tab>
    <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       // 其他依赖项.
       testImplementation 'org.jetbrains.kotlin:kotlin-test'
   }
   ```

   </tab>
   </tabs>

3. 向 `build.gradle(.kts)` 文件添加 `test` 任务:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   tasks.test {
       useJUnitPlatform()
   }
   ```

    </tab>
    <tab title="Groovy" group-key="groovy">

   ```groovy
   test {
       useJUnitPlatform()
   }
   ```

   </tab>
   </tabs>

   > 如果你使用 **New Project** 向导创建项目, 会自动添加这个任务.
   >
   {style="note"}

## 添加需要测试的代码

1. 打开 `src/main/kotlin` 中的 `main.kt` 文件.

   `src` 目录包含 Kotlin 源代码文件和资源文件. `main.kt` 文件包含示例代码, 它将打印输出 `Hello, World!`.

2. 创建 `Sample` 类, 包含 `sum()` 函数, 它会将两个整数加在一起:

   ```kotlin
   class Sample() {

       fun sum(a: Int, b: Int): Int {
           return a + b
       }
   }
   ```

## 创建测试

1. 在 IntelliJ IDEA 中, 对 `Sample` 类选择 **Code** | **Generate** | **Test...**.

   ![创建测试](create-test.png)

2. 输入测试类的名称. 比如, `SampleTest`.

   IntelliJ IDEA 会在 `test` 目录中创建 `SampleTest.kt` 文件. 这个目录包含 Kotlin 测试源代码文件和资源文件.

   > 你也可以在 `src/test/kotlin` 目录中为测试代码手动创建一个 `*.kt` 文件.
   >
   {style="note"}

3. 在 `SampleTest.kt` 中为 `sum()` 函数添加测试代码:

   * 使用 [@Test 注解](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-test/index.html), 定义测试函数 `testSum()`.
   * 使用 [assertEquals()](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-equals.html) 函数, 检查 `sum()` 函数是否返回了期待的值.

   ```kotlin
   import kotlin.test.Test
   import kotlin.test.assertEquals

   internal class SampleTest {

       private val testSample: Sample = Sample()

       @Test
       fun testSum() {
           val expected = 42
           assertEquals(expected, testSample.sum(40, 2))
       }
   }
   ```

## 运行测试

1. 使用源代码编辑器侧栏中的图标运行测试.

   ![运行测试](run-test.png)

   > 你也可以在命令行执行命令 `./gradlew check`, 运行整个项目的所有测试.
   >
   {style="note"}

2. 在 **Run** 工具窗口检查测试结果:

   ![检查测试结果. 测试成功通过](check-the-result.png)

   测试函数执行成功了.

3. 将 `expected` 变量值修改为 43, 确认测试正确工作:

   ```kotlin
   @Test
   fun testSum() {
       val expected = 43
       assertEquals(expected, classForTesting.sum(40, 2))
   }
   ```

4. 再次运行测试, 并检查结果:

   ![检查测试结果. 测试失败](check-the-result-2.png)

   测试执行失败.

## 下一步做什么?

完成你的第一个测试之后, 你可以:

* 尝试使用 [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/) 的其他函数, 编写其他测试.
  比如, 你可以使用 [`assertNotEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-not-equals.html) 函数.
* 使用 Kotlin 和 Spring Boot [创建你的第一个应用程序](jvm-get-started-spring-boot.md).
* 在 YouTube 上观看 [这些视频教程](https://www.youtube.com/playlist?list=PL6gx4Cwl9DGDPsneZWaOFg0H2wsundyGr),
  这些教程将演示如何与 Kotlin 和 JUnit 5 一起配合使用 Spring Boot.
