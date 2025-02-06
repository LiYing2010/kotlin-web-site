[//]: # (title: 教程 - 在 JVM 平台使用 JUnit 进行代码测试)

本教程向你演示如何编写简单的单元测试, 并使用 Gradle 构建工具来运行测试.

教程中的示例程序使用了 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/index.html) 库, 并使用 JUnit 运行测试.

开始之前, 首先请下载并安装最新版的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).

## 添加依赖项 {id="add-dependencies"}

1. 在 IntelliJ IDEA 中打开一个 Kotlin 项目.
   如果你还没有项目, 请 [创建一个新项目](https://www.jetbrains.com/help/idea/create-your-first-kotlin-app.html#create-project).

2. 打开 `build.gradle(.kts)` 文件, 检查是否有 `testImplementation` 依赖项.
   通过这个依赖项, 你将可以使用 `kotlin.test` 和 `JUnit`:

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

   > 如果你在构建脚本中使用了 `useJUnitPlatform()` 函数, `kotlin-test` 库会自动包含 JUnit 5 依赖项.
   > 在 JVM 项目中, 以及 Kotlin Multiplatform (KMP) 项目的 JVM 测试代码中,
   > 这个设置让你可以使用所有的 JUnit 5 API, 以及 `kotlin-test` API.
   >
   {style="note"}

下面是 `build.gradle.kts` 的完整代码:

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}
```
{initial-collapse-state="collapsed" collapsible="true"}

## 添加需要测试的代码 {id="add-the-code-to-test-it"}

1. 打开 `src/main/kotlin` 中的 `Main.kt` 文件.

   `src` 目录包含 Kotlin 源代码文件和资源文件.
   `Main.kt` 文件包含示例代码, 它会打印输出 `Hello, World!`.

2. 创建 `Sample` 类, 包含 `sum()` 函数, 它会将两个整数加在一起:

   ```kotlin
   class Sample() {
       fun sum(a: Int, b: Int): Int {
           return a + b
       }
   }
   ```

## 创建测试 {id="create-a-test"}

1. 在 IntelliJ IDEA 中, 对 `Sample` 类选择 **Code** | **Generate** | **Test...** :

   ![生成测试](generate-test.png)

2. 输入测试类的名称. 比如, `SampleTest`.

   IntelliJ IDEA 会在 `test` 目录中创建 `SampleTest.kt` 文件.
   这个目录包含 Kotlin 测试源代码文件和资源文件.

   > 你也可以在 `src/test/kotlin` 目录中为测试代码手动创建一个 `*.kt` 文件.
   >
   {style="note"}

3. 在 `SampleTest.kt` 中为 `sum()` 函数添加测试代码:

   * 使用 [`@Test` 注解](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-test/index.html), 定义测试函数 `testSum()`.
   * 使用 [`assertEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-equals.html) 函数, 检查 `sum()` 函数是否返回了期待的值.

   ```kotlin
   import org.example.Sample
   import org.junit.jupiter.api.Assertions.*
   import kotlin.test.Test

   class SampleTest {
       private val testSample: Sample = Sample()

       @Test
       fun testSum() {
           val expected = 42
           assertEquals(expected, testSample.sum(40, 2))
       }
   }
   ```

## 运行测试 {id="run-a-test"}

1. 使用源代码编辑器侧栏中的图标运行测试:

   ![运行测试](run-test.png)

   > 你也可以在命令行执行命令 `./gradlew check`, 运行整个项目的所有测试.
   >
   {style="note"}

2. 在 **Run** 工具窗口检查测试结果:

   ![检查测试结果. 测试成功通过](test-successful.png)

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

   ![检查测试结果. 测试失败](test-failed.png)

   测试执行失败.

## 下一步做什么? {id="what-s-next"}

完成你的第一个测试之后, 你可以:

* 使用 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/) 的其他函数, 编写更多测试.
  比如, 使用 [`assertNotEquals()`](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/assert-not-equals.html) 函数.
* 使用 [Kotlin Power-assert 编译器 plugin](power-assert.md) 改进你的测试输出.
  这个 plugin 使用上下文信息, 让测试输出更加详细丰富.
* 使用 Kotlin 和 Spring Boot [创建你的第一个服务器端应用程序](jvm-get-started-spring-boot.md).
