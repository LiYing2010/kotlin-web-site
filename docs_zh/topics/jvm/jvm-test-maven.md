[//]: # (title: 使用 Maven 测试 Kotlin 项目)

Kotlin 能够与 Maven 生态系统无缝集成, 让你使用业界标准的工具来验证你的后端应用程序.
这篇指南介绍如何使用 JUnit 创建测试, 以及使用 Maven plugin 运行单元测试和集成测试.

> 关于设置 Maven 项目并使用 Kotlin 和 Java 的详细指南, 请参见 [](mixing-java-kotlin-intellij.md#project-configuration).
>
{style="tip"}

## 使用 JUnit 创建测试 {id="create-tests-with-junit"}

[JUnit](https://junit.org/) 是 Kotlin 后端开发的标准测试框架.
Kotlin 支持多个 JUnit 版本, 但大多数现代项目应该使用 JUnit 6.

要使用 JUnit 在 Kotlin 中创建测试, 请使用来自 `kotlin.test` 或 JUnit 包的 `@Test` 注解.

### 添加依赖项 {id="add-dependency"}

最简单的方式是使用 `kotlin-test` 库. 它提供一套通用的断言函数, 并自动引入需要的 JUnit artifact.

#### JUnit 5 及更高版本 {id="junit-5-and-later"}

对于所有新项目, 请使用 `kotlin-test-junit5` artifact.
它提供对 JUnit 的完整支持, 包括嵌套测试和并行执行等功能. Kotlin/JVM 支持 JUnit 的最新稳定版本, JUnit 6.

按如下方式更新你的 `pom.xml` 文件:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-test-junit5</artifactId>
        <version>%kotlinVersion%</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

> 尽管名称是 junit5, 但 `kotlin-test-junit5` 支持所有最新的 JUnit 版本, 包括 JUnit 6.
>
{style="note"}

#### JUnit 4 {id="junit-4"}

如果你希望使用旧版本的 JUnit, 例如用于旧的项目, 请使用基于 JUnit 4 的 `kotlin-test-junit` artifact:

```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-test-junit</artifactId>
        <version>%kotlinVersion%</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

> 关于使用 JUnit 进行测试的详细指南和示例项目, 请参见 [使用 Kotlin 测试 Java 代码](jvm-test-using-junit.md) 教程.
>
{style="tip"}

### 编写单元测试(Unit Test) {id="write-unit-tests"}

单元测试(Unit Test)用于验证代码中独立的部分, 例如单独的函数或类.
按照惯例, 单元测试的命名使用 `*Test` 后缀. 例如:

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class OrderServiceTest {
    @Test
    fun `calculate total should sum item prices`() {
        val service = OrderService()
        val result = service.calculateTotal(listOf(10.0, 25.0))
        assertEquals(35.0, result)
    }
}
```

### 编写集成测试(Integration Test) {id="write-integration-tests"}

集成测试(Integration Test)用于验证组件之间的交互, 例如服务与数据库之间的交互.
按照惯例, 集成测试的命名使用 `*IT` 后缀. 例如:

```kotlin
import kotlin.test.Test
import kotlin.test.assertNotNull

class UserRepositoryIT {
    @Test
    fun saveFindUser() {
        // 示例: 与数据库或服务集成
        val repository = UserRepository()
        repository.save(User("KotlinUser"))

        val user = repository.findByName("KotlinUser")
        assertNotNull(user)
    }
}
```

## 运行测试 {id="run-tests"}

在 Maven 项目中, 测试执行通常由两个 plugin 共同负责: Surefire 和 Failsafe, 以确保构建生命周期清晰有序.

### 使用 Surefire plugin {id="with-surefire-plugin"}

[Surefire plugin](https://maven.apache.org/surefire/maven-surefire-plugin/) 负责处理 _单元测试(Unit Test)_.
它运行所有符合 `*Test` 命名规范的 Kotlin 和 Java 测试.

默认情况下, 它在构建生命周期的 `test` 阶段执行, 如果测试失败则立即中止构建.

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.5.5</version>
</plugin>
```

要只运行单元测试, 请使用以下命令:

```bash
mvn test
```

### 使用 Failsafe plugin {id="with-failsafe-plugin"}

[Failsafe plugin](https://maven.apache.org/surefire/maven-failsafe-plugin/) 负责处理 _集成测试(Integration Test)_.
它运行所有符合 `*IT` 命名规范的 Kotlin 和 Java 测试.

与 Surefire 不同, Failsafe 允许构建在 `integration-test` 阶段的测试失败后继续执行,
使得 `post-integration-test` 阶段的任务(例如停止 Docker 容器)能够运行.
如果存在测试失败, 构建最终会在 `verify` 阶段报告失败.

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-failsafe-plugin</artifactId>
    <version>3.5.5</version>
    <executions>
        <execution>
            <goals>
                <goal>integration-test</goal>
                <goal>verify</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

要同时运行单元测试和集成测试, 请使用以下命令:

```bash
mvn verify
```

## 获取详细的失败信息 {id="get-detailed-failure-messages"}

Kotlin [Power-assert 编译器插件](power-assert.md) 会生成详细的失败信息,
显示你的断言中的中间值, 在控制台输出中展现完整的图示.

1. 要启用 Power-assert, 请向你的项目的 `pom.xml` 添加以下配置:

    ```xml
    <properties>
        <kotlin.version>%kotlinVersion%</kotlin.version>
        <kotlin.compiler.jdkRelease>17</kotlin.compiler.jdkRelease>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-test-junit5</artifactId>
            <version>${kotlin.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.jetbrains.kotlin</groupId>
                <artifactId>kotlin-maven-plugin</artifactId>
                <version>${kotlin.version}</version>
                <extensions>true</extensions>
                <executions>
                    <execution>
                        <id>compile</id>
                        <phase>process-sources</phase>
                        <goals>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>test-compile</id>
                        <phase>process-test-sources</phase>
                        <goals>
                            <goal>test-compile</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <!-- 指定 Power-assert 插件 -->
                    <compilerPlugins>
                        <plugin>power-assert</plugin>
                    </compilerPlugins>
                    <!-- 指定要转换的函数 -->
                    <pluginOptions>
                        <option>power-assert:function=kotlin.test.assertEquals</option>
                        <option>power-assert:function=kotlin.test.assertTrue</option>
                    </pluginOptions>
                </configuration>
                <!-- 添加 Power-assert 插件依赖项 -->
                <dependencies>
                    <dependency>
                        <groupId>org.jetbrains.kotlin</groupId>
                        <artifactId>kotlin-maven-power-assert</artifactId>
                        <version>${kotlin.version}</version>
                    </dependency>
                </dependencies>
            </plugin>
        </plugins>
    </build>
    ```
   {initial-collapse-state="collapsed" collapsible="true" ignore-vars="false" collapsed-title="kotlin-maven-power-assert 配置"}

    * 在 `<properties>` 节中, 设置 Kotlin 版本, 以及编译目标的 JDK 发布版本, 例如, JDK 17.
    * 在 `<dependencies>` 节中, 添加 `kotlin-test-junit5`, 用于运行测试.
    * 在 `<build><plugins>` 节中, 配置 `kotlin-maven-plugin`, 使用 `power-assert` 编译器插件.
      在 `<pluginOptions>` 之下列出你想要转换的断言函数, 并添加 Power-assert 插件依赖项.

2. 在 `src/test/kotlin` 目录中, 创建一个测试文件, `UserProfileBackendTest.kt`:

    ```kotlin
    import kotlin.test.Test
    import kotlin.test.assertEquals

    class UserProfileBackendTest {
        data class UserProfile(val id: Long, val email: String)

        @Test
        fun `verify backend entity mapping matches`() {
            // 定义期望的对象状态
            val expectedRecord = UserProfile(id = 451L, email = "admin-dev@company.internal")

            // 模拟一个不正确的后端应答
            val actualRecord = UserProfile(id = 451L, email = "admin-prod@company.com")

            // 使用标准的 kotlin.test 断言
            assertEquals(expectedRecord, actualRecord, "Profile configurations out of sync")
        }
    }
    ```

3. 运行测试, 验证输出:

    ```bash
    mvn test
    ```

控制台会显示完整的 Power-assert 图示, 其中会展示表达式中每个位置上的期望值与实际值之间的差别:

```text
Profile configurations out of sync
assertEquals(expectedRecord, actualRecord, "Profile configurations out of sync")
             |               |
             |               UserProfile(id=451, email=admin-prod@company.com)
             UserProfile(id=451, email=admin-dev@company.internal)
```

## 探索其他测试框架 {id="explore-other-testing-frameworks"}

除了 JUnit 之外, 还可以使用其他流行的框架, 让 Kotlin 测试代码更加符合惯用法, 更加易读:

| 库                                                          | 说明                                                                  |
|-------------------------------------------------------------|-----------------------------------------------------------------------|
| [AssertJ](https://github.com/assertj/assertj)               | 支持链式调用的流式断言库.                                             |
| [Mockito-Kotlin](https://github.com/mockito/mockito-kotlin) | Mockito 的 Kotlin 封装库, 提供辅助函数, 与 Kotlin 类型系统更好地集成. |
| [MockK](https://github.com/mockk/mockk)                     | 原生的 Kotlin mock 库, 支持 Kotlin 的特有功能, 包括协程和扩展函数.    |
| [Kotest](https://github.com/kotest/kotest)                  | 面向 Kotlin 的断言库, 提供多种断言风格和丰富的匹配器支持.             |
| [Strikt](https://github.com/robfletcher/strikt)             | 面向 Kotlin 的断言库, 提供类型安全的断言以及对数据类的支持.           |

## 下一步做什么? {id="what-s-next"}

* 探索 [`kotlin.test` 库](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/) 的功能.
* 深入了解 [Power-assert 编译器插件](power-assert.md).
