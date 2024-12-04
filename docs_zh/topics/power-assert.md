[//]: # (title: Power-assert 编译器插件)

> Power-assert 编译器插件是 [实验性功能](components-stability.md).
> 它随时有可能变更.
> 请注意, 只为评估目的来使用这个功能.
> 希望你能通过 [YouTrack](https://kotl.in/issue) 提供你的反馈意见.
>
{style="warning"}

Kotlin Power-assert 编译器插件通过提供带有上下文信息的详细失败消息,
改善调试的体验.
它通过在失败消息中自动生成中间值, 简化测试代码的编写过程.
它帮助你理解测试失败的原因, 而不需要使用复杂的断言库.

下面是插件提供的消息的示例:

```text
Incorrect length
assert(hello.length == world.substring(1, 4).length) { "Incorrect length" }
       |     |      |  |     |               |
       |     |      |  |     |               3
       |     |      |  |     orl
       |     |      |  world!
       |     |      false
       |     5
       Hello
```

Power-assert 插件的主要功能:

* **增强错误消息**:
  插件捕获并显示断言中的变量和子表达式的值, 清楚的识别失败的原因.
* **简化测试**:
  自动生成信息丰富的失败消息, 减少使用复杂的断言库的必要.
* **支持多种函数**:
  默认情况下, 它会转换 `assert()` 函数调用, 但也能够转换其它函数, 例如 `require()`, `check()`, 和 `assertTrue()`.

## 适用插件

要启用 Power-assert 插件, 请配置你的 `build.gradle(.kts)` 文件, 如下:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
plugins {
    kotlin("multiplatform") version "2.0.0"
    kotlin("plugin.power-assert") version "2.0.0"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.0.0'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '2.0.0'
}
```

</tab>
</tabs>

## 配置插件

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

由于这个插件是实验性功能, 你会在每次构建你的 App 时看到警告.
要排除这些警告, 请在声明 `powerAssert {}` 代码块之前添加 `@OptIn` 注解:

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    ...
}
```

## 使用插件

本节提供一些使用 Power-assert 编译器插件的示例.

下面是所有这些示例的构建脚本文件 `build.gradle.kts` 的完整代码:

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins {
    kotlin("jvm") version "%kotlinVersion%"
    kotlin("plugin.power-assert") version "%kotlinVersion%"
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

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertEquals", "kotlin.test.assertTrue", "kotlin.test.assertNull", "kotlin.require", "org.example.AssertScope.assert")
}
```
{initial-collapse-state="collapsed" collapsible="true"}

### Assert 函数

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
       |     |      |  |     |               3
       |     |      |  |     orl
       |     |      |  world!
       |     |      false
       |     5
       Hello
```

要得到更加完整的错误消息, 一定要将变量内联到测试函数的参数中.
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
Assertion failed
assert(isValidName && isValidAge)
       |              |
       |              false
       true
```

下面将变量内联到 `assert()` 函数中:

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
Assertion failed
assert(person.name.startsWith("A") && person.name.length > 3 && person.age > 20 && person.age < 29)
       |      |    |                  |      |    |      |      |      |   |
       |      |    |                  |      |    |      |      |      |   false
       |      |    |                  |      |    |      |      |      10
       |      |    |                  |      |    |      |      Person(name=Alice, age=10)
       |      |    |                  |      |    |      true
       |      |    |                  |      |    5
       |      |    |                  |      Alice
       |      |    |                  Person(name=Alice, age=10)
       |      |    true
       |      Alice
       Person(name=Alice, age=10)
```

### 除 assert 之外的其它函数

Power-assert 插件 默认转换 `assert`, 但也能够转换各种其它函数.
例如 `require()`, `check()`, `assertTrue()`, `assertEqual()` 以及其它函数, 都可以转换,
只要这些函数存在一种形式, 允许接受一个 `String` 或 `() -> String` 值, 作为最后一个参数.

在测试中使用新的函数之前, 要在你的构建脚本文件的 `powerAssert {}` 代码块中指定这个函数.
例如, 对 `require()` 函数:

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.require")
}
```

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
        |     false
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

The output shows the intermediate results of 函数 calls:

```text
Assertion failed
assert(exampleFunction(2, 3) + exampleFunction(1, 2) == 9)
       |                     | |                     |
       |                     | |                     false
       |                     | 3
       |                     | FunctionTrailingExampleTest@533bda92
       |                     8
       5
       FunctionTrailingExampleTest@533bda92
```
-->

### 软断言(Soft Assertion)

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

添加这些函数到 `powerAssert {}` 代码块, 让 Power-assert 插件能够使用它们:

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assert", "org.example.AssertScope.assert")
}
```

> 你应该指定声明 `AssertScope.assert()` 函数的包的完整名称.
>
{style="tip"}

然后, 你可以在你的测试代码中使用它:

```kotlin
// 导入 assertSoftly() 函数
import org.example.assertSoftly

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
       |        |      false
       |        40000
       Employee(name=Charlie, age=55, salary=40000)
Dave has an invalid age: 150
assert(employee.age < 100) { "${employee.name} has an invalid age: ${employee.age}" }
       |        |   |
       |        |   false
       |        150
       Employee(name=Dave, age=150, salary=70000)
```

## 下一步做什么

* 查看一个 [启用了这个插件的简单项目](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSourceSets),
   以及更多 [有多个源代码集的复杂项目](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSimple).
