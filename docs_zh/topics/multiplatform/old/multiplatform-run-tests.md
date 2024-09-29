[//]: # (title: 为 Kotlin Multiplatform 运行测试)

最终更新: %latestDocDate%

Kotlin 默认支持对 JVM, JS, Android, Linux, Windows, macOS 以及 iOS, watchOS, 和 tvOS 模拟器运行测试程序.
要对其他 Kotlin/Native 编译目标运行测试程序, 你需要在适当的环境, 模拟器, 或测试框架中手动进行配置.

## 需要的依赖项

跨平台测试程序可以使用 [`kotlin.test` API](https://kotlinlang.org/api/latest/kotlin.test/).
当你 [创建跨平台项目](multiplatform-library.html) 时, 对共通源代码集和平台相关的源代码集, 项目创建向导会自动添加测试库依赖项.

如果创建项目时没有使用项目创建向导, 你也可以 [手动添加依赖项](../gradle/gradle-configure-project.html#set-dependencies-on-test-libraries).

## 对一个或多个编译目标运行测试

要对所有编译目标运行测试程序, 请运行 `check` 任务.

要对某个适合测试的编译目标运行测试程序, 请运行 `<targetName>Test` 测试任务.

## 测试共用的代码

要测试共用的代码, 你可以在测试程序中使用 [实际声明(actual declaration)](multiplatform-connect-to-apis.html).

比如, 要测试 `commonMain` 中的共用代码:

```kotlin
expect object Platform {
    val name: String
}

fun hello(): String = "Hello from ${Platform.name}"

class Proxy {
    fun proxyHello() = hello()
}
```

可以在 `commonTest` 中使用以下测试 :

```kotlin
import kotlin.test.Test
import kotlin.test.assertTrue

class SampleTests {
    @Test
    fun testProxy() {
        assertTrue(Proxy().proxyHello().isNotEmpty())
    }
}
```

在 `iosTest` 则使用以下测试:

```kotlin
import kotlin.test.Test
import kotlin.test.assertTrue

class SampleTestsIOS {
    @Test
    fun testHello() {
        assertTrue("iOS" in hello())
    }
}
```

关于如何创建并运行跨平台测试程序, 更多详情请参见
[教程 - 创建并发布跨平台的库](multiplatform-library.html#test-your-library).
