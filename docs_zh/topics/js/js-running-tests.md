---
type: doc
layout: reference
category:
title: "在 Kotlin/JS 平台进行测试"
---

# 在 Kotlin/JS 平台进行测试

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin Multiplatform Gradle plugin 允许你使用多种不同的测试运行器来运行测试, 测试运行器可以通过 Gradle 配置来指定.

当你创建跨平台项目时, 你可以在 `commonTest` 中使用一个依赖项, 对所有的源代码集添加测试依赖项, 包括 JavaScript 编译目标:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
// build.gradle.kts

kotlin {
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // 添加这个设置, 可以在 JS 中使用测试相关的注解和功能
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
// build.gradle

kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // 添加这个设置, 可以在 JS 中使用测试相关的注解和功能
            }
        }
    }
}
```

</div>
</div>

你可以在 Gradle 构建脚本中修改 `testTask` 代码段内的设定, 对 Kotlin/JS 中如何执行测试进行调节.
比如, 要使用 Karma 测试运行器, 和 headless 的 Chrome 浏览器, 和一个 Firefox 浏览器, 设置如下:

```kotlin
kotlin {
    js {
        browser {
            testTask {
                useKarma {
                    useChromeHeadless()
                    useFirefox()
                }
            }
        }
    }
}
```

关于具体功能的详细说明, 请参见 Kotlin/JS 文档的 [配置测试任务](js-project-setup.html#test-task) 小节. 

请注意, plugin 默认没有绑定浏览器. 也就是说, 你需要确保在目标系统中存在需要的浏览器.

要检查测试是否正确执行, 请添加一个 `src/jsTest/kotlin/AppTest.kt` 文件, 内容如下:

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class AppTest {
    @Test
    fun thingsShouldWork() {
        assertEquals(listOf(1,2,3).reversed(), listOf(3,2,1))
    }

    @Test
    fun thingsShouldBreak() {
        assertEquals(listOf(1,2,3).reversed(), listOf(1,2,3))
    }
}
```

要在浏览器中运行测试, 请通过 IntelliJ IDEA 执行 `jsBrowserTest` 任务, 或使用源代码编辑器侧栏中的图标来执行全部测试, 或单独的某个测试:

<img src="/assets/docs/images/reference/js-running-tests/browsertest-task.png" alt="Gradle 的 browserTest 任务" width="700"/>

或者, 如果你想要通过命令行运行测试, 请使用 Gradle wrapper:

```bash
./gradlew jsBrowserTest
```

从 IntelliJ IDEA 运行测试之后, **Run** 工具窗口会显示测试结果.
你可以点击失败的测试, 查看它们的栈追踪(Stacktrace), 也可以双击测试结果, 查看对应的测试实现代码.

<img src="/assets/docs/images/reference/js-running-tests/test-stacktrace-ide.png" alt="IntelliJ IDEA 中的测试结果" width="700"/>

每次测试运行之后, 无论你通过什么方式运行测试, 你都可以找到 Gradle 生成的适当格式化的测试报告,
位置是`build/reports/tests/jsBrowserTest/index.html`.
可以在浏览器打开这个文件, 查看测试结果报告:

<img src="/assets/docs/images/reference/js-running-tests/test-summary.png" alt="Gradle 测试报告" width="700"/>

如果你使用上述示例代码中的那组测试, 一个测试会通过, 另一个测试会失败,
因此测试全体 50% 成功. 要查看各个测试用例的详细信息, 你可以通过页面内的链接进行浏览:

<img src="/assets/docs/images/reference/js-running-tests/failed-test.png" alt="测试报告中失败的测试的栈追踪(Stacktrace)" width="700"/>
