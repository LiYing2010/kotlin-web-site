---
type: doc
layout: reference
title: "运行测试"
---

# 运行测试

我们默认支持对 JVM, JS, Android, Linux, Windows, macOS 以及 iOS, watchOS, 和 tvOS 模拟器运行测试程序.
要对其他 Kotlin/Native 编译目标运行测试程序, 你需要在适当的环境, 模拟器, 或测试框架中手动进行配置.

要对所有编译目标运行测试程序, 请运行 `check` 任务.

要对某个适合测试的编译目标运行测试程序, 请运行 `<targetName>Test` 测试任务.

跨平台测试程序可以使用 [`kotlin.test` API](../../api/latest/kotlin.test/index.html).
当你 [创建跨平台项目](mpp-create-lib.html) 时, 对共通源代码集和平台相关的源代码集, 项目创建向导会自动添加测试库依赖项.
如果创建项目时没有使用项目创建向导, 你也可以 [手动添加依赖项](using-gradle.html#set-dependencies-on-test-libraries).

要测试共用的代码, 你可以在测试程序中使用 [实际声明(actual declaration)](mpp-connect-to-apis.html).

比如, 要测试 `commonMain` 中的共用代码:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
expect object Platform {
    val name: String
}

fun hello(): String = "Hello from ${Platform.name}"

class Proxy {
    fun proxyHello() = hello()
}
```

</div>

可以在 `commonTest` 中使用以下测试 :

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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

</div>

在 `iosTest` 则使用以下测试:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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

</div>

关于如何创建并运行跨平台测试程序, 更多详情请参见 [这篇教程](../tutorials/mpp/multiplatform-library.html#testing).
