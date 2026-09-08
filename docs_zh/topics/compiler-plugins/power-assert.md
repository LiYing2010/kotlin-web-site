[//]: # (title: Power-assert 编译器插件)
<primary-label ref="experimental-opt-in"/>

Kotlin Power-assert 编译器插件通过提供带有上下文信息的详细失败消息,
改善调试的体验.
它通过在失败消息中自动生成中间值, 简化测试代码的编写过程.
它帮助你理解测试失败的原因, 而不需要使用复杂的断言库.

下面是插件提供的消息的示例:

```text
Incorrect length
assert(hello.length == world.substring(1, 4).length) { "Incorrect length" }
       |     |      |  |     |               |
       |     5      |  |     "orl"           3
       "Hello"      |  "world!"
                    false
```

Power-assert 插件的主要功能:

* **增强错误消息**:
  插件捕获并显示断言中的变量和子表达式的值, 清楚的识别失败的原因.
* **运行时库**: 这个库提供了 `@PowerAssert` 注解和 `CallExplanation` 类.
  它们直接与编译器插件转换集成, 使支持 Power-assert 的函数更易被发现且更易于配置.
* **简化测试**:
  自动生成信息丰富的失败消息, 减少使用复杂的断言库的必要.
* **支持多种函数**:
  默认情况下, 它会转换 `assert()` 函数调用, 但也能够转换其他函数,
  例如 `require()`, `check()`, 和 `assertTrue()`.

## 应用插件 {id="apply-the-plugin"}

### Gradle {id="gradle"}

要启用 Power-assert 插件, 请按如下方式配置你的 `build.gradle(.kts)` 文件:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
    kotlin("plugin.power-assert") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '%kotlinVersion%'
}
```

</tab>
</tabs>

Power-assert 插件提供了几种选项来定制它的行为:

* **`functions`**:
  一组完全限定的函数路径的列表. Power-assert 插件将会转换对这些函数的调用.
  如果没有指定这个选项, 默认只有对 `kotlin.assert()` 的调用会被转换.
* **`includedSourceSets`**:
  一组 Power-assert 插件将会转换的 Gradle 源代码集的列表.
  如果没有指定这个选项, 默认所有的 _测试源代码集_ 会被转换.

要定制 Power-assert 插件的行为, 请向你的构建脚本文件添加 `powerAssert {}` 代码块:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertTrue", "kotlin.test.assertEquals", "kotlin.test.assertNull")
    includedSourceSets = listOf("commonMain", "jvmMain", "jsMain", "nativeMain")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
powerAssert {
    functions = ["kotlin.assert", "kotlin.test.assertTrue", "kotlin.test.assertEquals", "kotlin.test.assertNull"]
    includedSourceSets = ["commonMain", "jvmMain", "jsMain", "nativeMain"]
}
```

</tab>
</tabs>

由于这个插件是 [实验性功能](components-stability.md#stability-levels-explained), 你会在每次构建你的应用程序时看到警告.
要排除这些警告, 请在声明 `powerAssert {}` 代码块之前添加 `@OptIn` 注解:

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    ...
}
```

### Maven {id="maven"}

要在 Maven 项目中启用 Power-assert 编译器插件, 请更新 `pom.xml` 文件中 `kotlin-maven-plugin` 的 `<plugin>` 部分:

```xml
<build>
    <plugins>
        <plugin>
            <artifactId>kotlin-maven-plugin</artifactId>
            <groupId>org.jetbrains.kotlin</groupId>
            <version>%kotlinVersion%</version>
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
            </configuration>

            <!-- 添加 Power-assert 插件的依赖项 -->
            <dependencies>
                <dependency>
                    <groupId>org.jetbrains.kotlin</groupId>
                    <artifactId>kotlin-maven-power-assert</artifactId>
                    <version>%kotlinVersion%</version>
                </dependency>
            </dependencies>
        </plugin>
    </plugins>
</build>
```

你可以使用 `function` 选项, 自定义 Power-assert 插件转换哪些函数.
例如, 你可以包含 `kotlin.test.assertTrue()`, `kotlin.test.assertEquals()`, 等等.
如果没有指定, 默认只有对 `kotlin.assert()` 的调用会被转换.

在 `kotlin-maven-plugin` 的 `<configuration>` 部分指定这个选项:

```xml
<configuration>
    <!-- 指定需要转换的函数 -->
    <pluginOptions>
        <option>power-assert:function=kotlin.assert</option>
        <option>power-assert:function=kotlin.test.assertTrue</option>
        <option>power-assert:function=kotlin.test.AssertEquals</option>
    </pluginOptions>
</configuration>
```

## 使用 Power-assert 插件 {id="use-the-power-assert-plugin"}

本节提供一些使用 Power-assert 编译器插件的示例.

下面是所有这些示例的构建脚本文件 `build.gradle.kts` 或 `pom.xml` 的完整代码:

<tabs group="build-script">
<tab title="Gradle (Kotlin)" group-key="kotlin">

```kotlin
// build.gradle.kts

import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
    kotlin("plugin.power-assert") version "%kotlinVersion%"
}

group = "com.example"
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

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertEquals", "kotlin.test.assertTrue", "kotlin.test.assertNull", "kotlin.require", "com.example.AssertScope.assert")
}
```
{initial-collapse-state="collapsed" collapsible="true"}

</tab>
<tab title="Gradle (Groovy)" group-key="groovy">

```groovy
// build.gradle
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '%kotlinVersion%'
}

group = 'com.example'
version = '1.0-SNAPSHOT'

repositories {
    mavenCentral()
}

dependencies {
    testImplementation 'org.jetbrains.kotlin:kotlin-test'
}

test {
    useJUnitPlatform()
}

powerAssert {
    functions = [
            'kotlin.assert',
            'kotlin.test.assertEquals',
            'kotlin.test.assertTrue',
            'kotlin.test.assertNull',
            'kotlin.require',
            'com.example.AssertScope.assert'
    ]
}
```
{initial-collapse-state="collapsed" collapsible="true"}

</tab>
<tab title="Maven" group-key="maven">

```xml
<!-- pom.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>maven-power-assert-plugin-demo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <kotlin.code.style>official</kotlin.code.style>
        <kotlin.compiler.jvmTarget>1.8</kotlin.compiler.jvmTarget>
    </properties>

    <repositories>
        <repository>
            <id>mavenCentral</id>
            <url>https://repo1.maven.org/maven2/</url>
        </repository>
    </repositories>

    <build>
        <sourceDirectory>src/main/kotlin</sourceDirectory>
        <testSourceDirectory>src/test/kotlin</testSourceDirectory>
        <plugins>
            <plugin>
                <groupId>org.jetbrains.kotlin</groupId>
                <artifactId>kotlin-maven-plugin</artifactId>
                <version>%kotlinVersion%</version>
                <executions>
                    <execution>
                        <id>compile</id>
                        <phase>compile</phase>
                        <goals>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>test-compile</id>
                        <phase>test-compile</phase>
                        <goals>
                            <goal>test-compile</goal>
                        </goals>
                    </execution>
                </executions>

                <configuration>
                    <compilerPlugins>
                        <plugin>power-assert</plugin>
                    </compilerPlugins>

                    <pluginOptions>
                        <option>power-assert:function=kotlin.assert</option>
                        <option>power-assert:function=kotlin.require</option>
                        <option>power-assert:function=kotlin.test.assertTrue</option>
                        <option>power-assert:function=kotlin.test.assertEquals</option>
                        <option>power-assert:function=kotlin.test.assertNull</option>
                        <option>power-assert:function=com.example.AssertScope.assert</option>
                    </pluginOptions>
                </configuration>

                <dependencies>
                    <dependency>
                        <groupId>org.jetbrains.kotlin</groupId>
                        <artifactId>kotlin-maven-power-assert</artifactId>
                        <version>%kotlinVersion%</version>
                    </dependency>
                </dependencies>

            </plugin>
            <plugin>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>2.22.2</version>
            </plugin>
            <plugin>
                <artifactId>maven-failsafe-plugin</artifactId>
                <version>2.22.2</version>
            </plugin>
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>1.6.0</version>
                <configuration>
                    <mainClass>MainKt</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-test-junit5</artifactId>
            <version>%kotlinVersion%</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.10.0</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-stdlib</artifactId>
            <version>%kotlinVersion%</version>
        </dependency>
    </dependencies>
</project>
```
{initial-collapse-state="collapsed" collapsible="true"}

</tab>
</tabs>

### 使用 `@PowerAssert` 注解的函数 {id="powerassert-annotated-functions"}

如果一个函数标注了 `@PowerAssert` 注解, Power-assert 插件会自动转换对它的调用.
你不需要在构建配置中注册这个函数.

你可以在自己声明断言函数时, 添加 `@PowerAssert` 注解, 或者使用 [支持 Power-assert 的库](#add-support-for-power-assert-to-your-library)
中提供的已注解函数.

要获得详细的失败消息, 请在项目中启用 Power-assert 插件, 然后调用该函数:

```kotlin
import kotlin.test.Test

data class Mascot(val name: String)

class SampleTest {

    @Test
    fun testAnnotatedFunction() {
        val subject: Any? = Mascot(name = "Unknown")
        // 如果库中的 assertThat() 标注了 @PowerAssert 注解,
        // 插件会自动转换这个调用
        assertThat(subject) {
            require(subject is Mascot)
            check(subject.name == "Kodee")
        }
    }
}
```

插件提供详细的失败消息, 包含中间表达式值:

```text
check(subject.name == "Kodee")
      |       |    |
      |       |    false
      |       "Unknown"
      Mascot(name=Unknown)
```

### Assert 函数 {id="assert-function"}

我们来看看下面的测试, 使用 `assert()` 函数:

```kotlin
import kotlin.test.Test

class SampleTest {
    @Test
    fun testFunction() {
        val hello = "Hello"
        val world = "world!"
        assert(hello.length == world.substring(1, 4).length) { "Incorrect length" }
    }
}
```

如果你启用 Power-assert 插件来运行 `testFunction()` 测试, 你会得到明确的失败消息:

```text
Incorrect length
assert(hello.length == world.substring(1, 4).length) { "Incorrect length" }
       |     |      |  |     |               |
       |     5      |  |     "orl"           3
       "Hello"      |  "world!"
                    false
```

要获得更加完整的错误消息, 一定要将变量内联到测试函数的参数中.
我们来看看下面的测试函数:

```kotlin
class ComplexExampleTest {
    data class Person(val name: String, val age: Int)

    @Test
    fun testComplexAssertion() {
        val person = Person("Alice", 10)
        val isValidName = person.name.startsWith("A") && person.name.length > 3
        val isValidAge = person.age in 21..28
        assert(isValidName && isValidAge)
    }
}
```

执行代码的输出不能提供足够的信息找出问题的原因:

```text
assert(isValidName && isValidAge)
       |              |
       true           false
```

将变量内联到 `assert()` 函数中:

```kotlin
class ComplexExampleTest {
    data class Person(val name: String, val age: Int)

    @Test
    fun testComplexAssertion() {
        val person = Person("Alice", 10)
        assert(person.name.startsWith("A") && person.name.length > 3 && person.age > 20 && person.age < 29)
    }
}
```

执行后, 你会得到关于错误的更加明确的信息:

```text
assert(person.name.startsWith("A") && person.name.length > 3 && person.age > 20 && person.age < 29)
       |      |    |                  |      |    |      |      |      |   |
       |      |    true               |      |    5      true   |      10  false
       |      "Alice"                 |      "Alice"            Person(name=Alice, age=10)
       Person(name=Alice, age=10)     Person(name=Alice, age=10)
```

### 除 assert 之外的其他函数 {id="beyond-assert-function"}

Power-assert 插件默认转换 `assert`, 但也能够转换各种其他函数.
例如 `require()`, `check()`, `assertTrue()`, `assertEqual()` 以及其他函数, 都可以转换,
只要这些函数存在一种形式, 允许接受一个 `String` 或 `() -> String` 值, 作为最后一个参数.

在测试中使用新函数之前, 请在你的构建文件中添加这个函数.
例如, 对 `require()` 函数:

<tabs group="build-script">
<tab title="Gradle (Kotlin)" group-key="kotlin">

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.require")
}
```

</tab>
<tab title="Gradle (Groovy)" group-key="groovy">

```groovy
powerAssert {
    functions = [
            'kotlin.assert',
            'kotlin.require'
    ]
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<!-- pom.xml -->
<configuration>
    <pluginOptions>
        <option>power-assert:function=kotlin.assert</option>
        <option>power-assert:function=kotlin.require</option>
    </pluginOptions>
</configuration>
```
</tab>
</tabs>

添加这个函数之后, 你可以在你的测试中使用它:

```kotlin
class RequireExampleTest {
    @Test
    fun testRequireFunction() {
        val value = ""
        require(value.isNotEmpty()) { "Value should not be empty" }
    }
}
```

这个示例的输出使用 Power-assert 插件, 为失败的测试提供详细的信息:

```text
Value should not be empty
require(value.isNotEmpty()) { "Value should not be empty" }
        |     |
        ""    false
```

这段消息显示导致失败的中间值, 使得调试更加容易.

<!-- ### Function call tracing

The plugin supports function call tracing, which is similar to Rust's `dbg!` macro.
Use it to trace and print function calls and their results:

```kotlin
class FunctionTrailingExampleTest {

    fun exampleFunction(x: Int, y: Int): Int {
        return x + y
    }

    @Test
    fun testFunctionCallTracing() {
        assert(exampleFunction(2, 3) + exampleFunction(1, 2) == 9)
    }
}
```

The output shows the intermediate results of functions calls:

```text
assert(exampleFunction(2, 3) + exampleFunction(1, 2) == 9)
       |                     | |                     |
       5                     8 3                     false
```
-->

### 软断言(Soft Assertion) {id="soft-assertions"}

Power-assert 插件支持软断言(Soft Assertion), 软断言不会让测试立即失败, 而是收集失败的断言, 并在测试运行结束时报告错误.
如果你想要通过一次运行看到所有失败的断言, 而不要在第一个失败的地方停止运行, 那么这个功能会很有用.

要启用软断言, 请实现收集错误消息的方法:

```kotlin
fun <R> assertSoftly(block: AssertScope.() -> R): R {
    val scope = AssertScopeImpl()
    val result = scope.block()
    if (scope.errors.isNotEmpty()) {
        throw AssertionError(scope.errors.joinToString("\n"))
    }
    return result
}

interface AssertScope {
    fun assert(assertion: Boolean, message: (() -> String)? = null)
}

class AssertScopeImpl : AssertScope {
    val errors = mutableListOf<String>()
    override fun assert(assertion: Boolean, message: (() -> String)?) {
        if (!assertion) {
            errors.add(message?.invoke() ?: "Assertion failed")
        }
    }
}
```

将这些函数添加到你的构建文件, 让 Power-assert 插件能够使用它们:

<tabs group="build-script">
<tab title="Gradle (Kotlin)" group-key="kotlin">

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assert", "com.example.AssertScope.assert")
}
```

</tab>
<tab title="Gradle (Groovy)" group-key="groovy">

```groovy
powerAssert {
    functions = [
            'kotlin.assert',
            'kotlin.test.assert',
            'com.example.AssertScope.assert'
    ]
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<!-- pom.xml -->
<configuration>
    <pluginOptions>
        <option>power-assert:function=kotlin.assert</option>
        <option>power-assert:function=kotlin.require</option>
        <option>power-assert:function=com.example.AssertScope.assert</option>
    </pluginOptions>
</configuration>
```
</tab>
</tabs>

> 你应该指定声明 `AssertScope.assert()` 函数的包的完整名称.
>
{style="tip"}

然后, 你可以在你的测试代码中使用它:

```kotlin
// 导入 assertSoftly() 函数
import com.example.assertSoftly

class SoftAssertExampleTest1 {
    data class Employee(val name: String, val age: Int, val salary: Int)

    @Test
    fun `test employees data`() {
        val employees = listOf(
            Employee("Alice", 30, 60000),
            Employee("Bob", 45, 80000),
            Employee("Charlie", 55, 40000),
            Employee("Dave", 150, 70000)
        )

        assertSoftly {
            for (employee in employees) {
                assert(employee.age < 100) { "${employee.name} has an invalid age: ${employee.age}" }
                assert(employee.salary > 50000) { "${employee.name} has an invalid salary: ${employee.salary}" }
            }
        }
    }
}
```

在输出中, 所有的 `assert()` 函数错误消息将会逐个打印输出:

```text
Charlie has an invalid salary: 40000
assert(employee.salary > 50000) { "${employee.name} has an invalid salary: ${employee.salary}" }
       |        |      |
       |        40000  false
       Employee(name=Charlie, age=55, salary=40000)

Dave has an invalid age: 150
assert(employee.age < 100) { "${employee.name} has an invalid age: ${employee.age}" }
       |        |   |
       |        150 false
       Employee(name=Dave, age=150, salary=70000)
```

## 向你的库添加 Power-assert 支持 {id="add-support-for-power-assert-to-your-library"}

如果你是库的开发者, 可以使用 Power-assert 运行时库中的 `@PowerAssert` 注解和 `CallExplanation` 类,
为你的库添加开箱即用的 Power-assert 支持.

### `@PowerAssert` 注解 {id="the-powerassert-annotation"}

[`@PowerAssert` 注解](https://github.com/JetBrains/kotlin/blob/master/plugins/power-assert/power-assert-runtime/src/commonMain/kotlin/kotlin/powerassert/PowerAssert.kt)
将一个函数标记为支持 Power-assert 的函数.
如果你的库的使用者在他们的项目中使用了 Power-assert 编译器插件, 并调用了你的已注解的函数,
这些调用将被自动转换, 不需要额外的构建配置.

向你的库添加 Power-assert 支持, 方法如下:

1. 在你的构建文件中, [应用 Power-assert 插件](#apply-the-plugin).
2. 对于 Maven, 将 Power-assert 运行时库添加为依赖项:

   ```xml
   <!-- pom.xml -->
   <dependencies>
       <dependency>
           <groupId>org.jetbrains.kotlin</groupId>
           <artifactId>kotlin-power-assert-runtime</artifactId>
           <version>%kotlinVersion%</version>
       </dependency>
   </dependencies>
   ```

   对于 Gradle, 这个依赖项会随 Power-assert 编译器插件自动添加.

3. 使用 `@PowerAssert` 注解, 标注你的断言函数:

   ```kotlin
   import kotlin.powerassert.PowerAssert
   import kotlin.powerassert.toDefaultMessage
   import kotlin.contracts.ExperimentalContracts
   import kotlin.contracts.contract

   @OptIn(ExperimentalContracts::class)
   @PowerAssert
   fun powerAssert(condition: Boolean, @PowerAssert.Ignore message: String? = null) {
       contract { returns() implies condition }
       if (!condition) {
           val explanation = PowerAssert.explanation
               ?: fail(message)

           val equalityErrors = buildList {
               for (expression in explanation.expressions) {
                   if (expression is EqualityExpression && expression.value == false) {
                       add(expression)
                   }
               }
           }

           val failureMessage = buildString {
               if (message?.isNotBlank() == true) appendLine(message)
               append(explanation.toDefaultMessage())
           }

           fail(failureMessage, equalityErrors)
       }
   }
   ```

    * `PowerAssert.explanation` 属性, 可以用来访问包含调用点信息的 `CallExplanation` 对象.
    * `toDefaultMessage()` 函数, 输出标准的 Power-assert 失败消息.
    * `message` 参数上的 `@PowerAssert.Ignore` 注解, 将参数从失败消息中排除.

编译器插件检测到 `@PowerAssert` 注解, 并在编译期间转换对这个函数的调用.

> 完整的示例, 请参见 [`kotlin-test-power-assert`](https://github.com/bnorm/power-assert-examples/tree/main/kotlin-test-power-assert) 项目.
>
{style="tip"}

### `CallExplanation` 类 {id="the-callexplanation-class"}

[`CallExplanation`](https://github.com/JetBrains/kotlin/blob/master/plugins/power-assert/power-assert-runtime/src/commonMain/kotlin/kotlin/powerassert/CallExplanation.kt)
类提供了关于调用点的详细信息, 包括中间表达式值.
这使得断言失败时能够动态输出消息, 并与外部工具更好的集成.

当你的库中的函数标注了 `@PowerAssert` 注解, 并且编译器插件已应用时, 转换会在每个调用点自动执行.
`PowerAssert.explanation` 属性可以在函数体内访问 `CallExplanation` 对象.

> 如果已注解的函数从 Java 调用, 从未应用 Power-assert 插件的项目调用, 或通过 [反射](reflection.md) 调用,
> `PowerAssert.explanation` 属性可能返回 `null`.
>
{style="note"}

下面的示例, 演示如何在 `@PowerAssert` 注解函数内, 使用 `CallExplanation` 提取源代码信息, 并构建自定义的失败消息:

```kotlin
package kotlinx.test.fluent

import kotlin.powerassert.PowerAssert
import kotlin.contracts.ExperimentalContracts
import kotlin.contracts.contract

@PowerAssert
fun AssertScope<*>.check(condition: Boolean) {
    if (!condition) {
        val explanation = PowerAssert.explanation
        val message = if (explanation == null) null else {
            val conditionArg = explanation.arguments.last()!!
            val source = explanation.source.substring(conditionArg.startOffset, conditionArg.endOffset)
            "Condition failed: $source"
        }
        collect(message, explanation)
    }
}

@OptIn(ExperimentalContracts::class)
@PowerAssert
fun AssertScope<*>.require(condition: Boolean) {
    contract { returns() implies condition }
    if (!condition) {
        val explanation = PowerAssert.explanation
        val message = if (explanation == null) null else {
            val conditionArg = explanation.arguments.last()!!
            val source = explanation.source.substring(conditionArg.startOffset, conditionArg.endOffset)
            "Condition failed: $source"
        }
        fail(message, explanation)
    }
}
```

在这个示例中, `check()` 函数收集失败用于之后的报告, `require()` 函数会立即失败.
两个函数都使用 `CallExplanation` 提取失败条件的源代码, 并将它包含在失败消息中.

> 完整的示例, 请参见 [`fluent-assert`](https://github.com/bnorm/power-assert-examples/tree/main/fluent-assert) 项目.
>
{style="tip"}

## 下一步做什么 {id="whats-next"}

浏览我们的示例项目:

* [一个简单项目, 启用了 Power-assert 插件](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSourceSets)
* [一个更复杂的项目, 有多个源代码集](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSimple)
* [示例集合, 用于尝试运行时库的功能特性](https://github.com/bnorm/power-assert-examples#power-assert-examples)
