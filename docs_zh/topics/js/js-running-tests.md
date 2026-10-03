[//]: # (title: 在 Kotlin/JS 中运行测试)

Kotlin Multiplatform Gradle plugin 允许你使用多种不同的测试运行器来运行测试, 测试运行器可以通过 Gradle 配置来指定.

在 Kotlin/JS 中运行测试的一般工作流程是: 添加测试依赖项, 在构建文件中配置测试任务, 添加测试, 然后运行测试.

对于浏览器测试, 你可以选择使用:

* [Karma](https://karma-runner.github.io/) 测试运行器.
* 新的浏览器测试 DSL.

> Karma 项目已经 [废弃](https://github.com/karma-runner/karma#karma). 预计不会再提供新功能或 bug 修复.
> 作为替代方案, 请尝试使用新的 Kotlin 浏览器测试 DSL .
>
> 新的浏览器测试 DSL 当前处于 [实验性](components-stability.md#stability-levels-explained) 阶段. 随时可能变更.
> 需要使用 `@OptIn(ExperimentalJsTestDsl::class)` 注解, 表示使用者同意(Opt-in).
>
{style="warning"}

## 添加测试依赖项 {id="add-test-dependencies"}

当你创建跨平台项目时, 你可以在 `commonTest` 中使用一个依赖项, 对所有的源代码集添加测试依赖项, 包括 JavaScript 编译目标:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
kotlin {
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // 在 JS 中启用测试注解和功能
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // 在 JS 中启用测试注解和功能
            }
        }
    }
}
```

</tab>
</tabs>

## 配置浏览器 {id="configure-browsers"}

你可以在 Kotlin/JS 中针对特定浏览器运行测试.
请调整 Gradle 构建文件中 `browser {}` 配置代码段内的设置.

默认情况下, 插件使用 [Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md) 运行浏览器测试.
Kotlin Multiplatform Gradle 插件默认不捆绑浏览器.
要启用其他浏览器, 对 Karma 请使用 `testTask {}` 代码段, 对新的浏览器测试 DSL 请使用 `test {}` 代码段.
下面是所有可用的选项:

<tabs group="js-test-dsl">
<tab title="Karma" group-key="karma">

```kotlin
kotlin {
    js {
        browser {
            testTask {
                useKarma {
                    useIe()
                    useSafari()
                    useFirefox()
                    useChrome()
                    useChromeCanary()
                    useChromeHeadless()
                    usePhantomJS()
                    useOpera()
                }
            }
        }
    }
}
```

使用 Karma 时, 需要在目标系统上安装所有必须的浏览器(无论是在本地环境还是 CI 环境).

关于 Karma 的功能, 详情请参见 [设置 Kotlin/JS 项目](js-project-setup.md#karma).

</tab>
<tab title="浏览器测试 DSL" group-key="Browser-test-dsl">

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalJsTestDsl

kotlin {
    js {
        browser {
            @OptIn(ExperimentalJsTestDsl::class)
            test {
                chromium()
                firefox()
                webkit() // Safari 浏览器
            }
        }
    }
}
```

使用新的浏览器测试 DSL 时, 初次运行时, Kotlin Multiplatform Gradle 插件会通过 [`playwright install`](https://playwright.dev/docs/browsers#install-browsers) 命令, 安装需要的浏览器.
然后, Playwright 会管理这些浏览器的位置, 不使用本地已安装的浏览器.

关于新的浏览器测试 DSL 中其他可用的设置, 详情请参见 [高级配置](#advanced-configuration).

</tab>
</tabs>

## 添加测试 {id="add-a-test"}

要检查测试是否正确执行, 请创建 `src/jsTest/kotlin/AppTest.kt` 文件, 内容如下:

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

@Test
fun thingsShouldWork() {
    assertEquals(listOf(3,2,1), listOf(1,2,3).reversed())
}

@Test
fun thingsShouldBreak() {
    assertEquals(listOf(1,2,3), listOf(1,2,3).reversed())
}
```

## 运行测试 {id="run-tests"}

要在浏览器中运行测试, 请在 IntelliJ IDEA 中执行 `jsBrowserTest` 任务, 或使用源代码编辑器侧栏中的图标, 执行全部测试, 或单独的某个测试:

![Gradle 的 browserTest 任务](browsertest-task.png){width=700}

或者, 如果你想在命令行中运行测试, 请使用 Gradle wrapper:

```bash
./gradlew jsBrowserTest
```

在 IntelliJ IDEA 中运行测试后, **Run** 工具窗口会显示测试结果.
你可以点击失败的测试, 查看它们的栈追踪(Stacktrace), 也可以双击测试结果, 查看对应的测试实现代码.

![IntelliJ IDEA 中的测试结果](test-stacktrace-ide.png){width=700}

每次测试运行之后, 无论你通过什么方式运行测试, 你都可以找到 Gradle 生成的适当格式化的测试报告,
位置是`build/reports/tests/jsBrowserTest/index.html`.
可以在浏览器打开这个文件, 查看测试结果报告:

![Gradle 测试报告](test-summary.png){width=700}

如果你使用上述示例代码中的那组测试, 一个测试会通过, 另一个测试会失败, 因此测试成功率为 50%.
要查看各个测试用例的详细信息, 请使用提供的链接:

![Gradle 摘要中失败的测试的栈追踪(Stacktrace)](failed-test.png){width=700}

## 高级配置 {id="advanced-configuration"}
<primary-label ref="experimental-opt-in"/>

> 本节只适用于新的实验性浏览器测试 DSL.
>
{style="note"}

新的浏览器测试 DSL 的设计主旨是简洁的风格, 而且不依赖于特定的工具.
当前的实现包括:

* [Playwright](https://playwright.dev/) 作为浏览器驱动程序和发布管理器, 支持 Chromium, Firefox 和 WebKit (Safari) 浏览器引擎.
* [Mocha](https://mochajs.org/) 作为测试运行器.
* [webpack](https://webpack.js.org/) 作为打包器 (将在 [未来版本](https://youtrack.jetbrains.com/issue/KT-48308/) 中替换为 [Vite](https://vite.dev/)).

DSL 将超时, 无头模式和各个运行器的选项以 Gradle 属性的方式公开, 因此可以在各个运行器之间共用默认设置,
为特定浏览器覆盖默认值, 并使用 providers 延迟计算设定值:

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalJsTestDsl
import kotlin.time.Duration.Companion.seconds

kotlin {
    js {
        browser {
            @OptIn(ExperimentalJsTestDsl::class)
            test {
                // 使用 kotlin.Duration 配置所有运行器的默认超时设定
                timeout = 30.seconds

                // 使用 Gradle providers 配置无头模式
                headless = providers
                    .environmentVariable("IS_IN_CI")
                    .map { it.toBoolean() }
                    .orElse(false)

                // 启用并使用自定义名称配置 Chromium 运行器
                chromium("chromium-no-webgl2") {
                    // 为这个运行器覆盖默认的超时设定
                    timeout = 10.seconds

                    // Chromium 专用的额外启动参数
                    launchArgs.add("--disable-webgl2")
                }

                // 启用 Firefox 运行器
                firefox()

                // 启用并配置 WebKit 运行器
                webkit("safari") {
                    timeout = 35.seconds
                }
            }
        }
    }
}
```

你可以在 `test {}` 代码段中直接为所有测试运行器设置选项.
如果要为特定的运行器覆盖这些共通选项, 请为它使用自定义名称, 并在运行器代码段内提供不同的值.
在这个示例中, Chromium 和 WebKit (Safari) 浏览器分别使用 10 秒和 35 秒的超时设定,
而 Firefox 使用 30 秒的共通超时设定.

每个运行器都在自己的名称之下注册, 因此测试报告会显示某个结果来自哪个浏览器.

## 面向插件开发者的配置 {id="configuration-for-plugin-authors"}
<primary-label ref="experimental-opt-in"/>

> 本节只适用于新的实验性浏览器测试 DSL.
>
{style="note"}

如果你在 Kotlin Multiplatform Gradle 插件之上编写 Gradle 插件, 新的浏览器测试 DSL 还允许你访问浏览器运行器,
以及生成的测试 bundle 的位置.

Kotlin 使用默认的 [测试运行器页面](https://github.com/Kotlin/kotlin-web-helpers/blob/main/static/test.html) 生成测试 bundle, 用于运行浏览器测试.
你可以将 `testsLocation` 属性指向其他位置, 来替换它:

```kotlin
kotlin {
    js {
        browser {
            @OptIn(ExperimentalJsTestDsl::class)
            test {
                // 实现 customJsTestsLocation, 来修改或替换默认 JS 测试 bundle
                @OptIn(DelicateKotlinGradlePluginApi::class)
                testsLocation = customJsTestsLocation(extendFrom = defaultTestsLocationProvider)

                chromium()
            }
        }
    }
}
```

你的自定义测试打包器可以包含自己的开发服务器, 打包器, 或测试运行器.
`defaultTestsLocationProvider` 属性允许你访问默认位置, 因此可以在其基础上构建, 而不需要从头实现所有内容.

每个测试位置都通过 `KotlinJsTestsLocation` 接口, 公开生成的测试 bundle 的目录 (`bundleLocation`),
测试页面的名称 (`testHtmlFileName`), 以及浏览器打开的 URL (`url`).

通过访问这些 API, 你可以:

* 自定义浏览器打开的 URL.
  每个浏览器运行器都有自己的测试位置, 因此可以在 `test {}` 代码段中为所有运行器覆盖它, 也可以为特定运行器覆盖它.
* 覆盖 bundle 位置本身, 例如, 为 bundle 添加额外的文件.
* 对生成的测试 bundle 进行后期处理.
  注册自己的任务, 并在浏览器打开文件前修改其中的文件, 例如, 将自定义配置注入 `test.html`.

使用这些 API 构建插件时, 请注意以下限制:

* 配置 `subtarget.test` 会启用新的测试管道, 并禁用 Karma.
  目前没有可靠的方法检测用户选择了哪个测试管道.
* 没有可靠的方法以延迟配置特定的浏览器运行器, 因此配置必须在 `afterEvaluate` 中进行.
  可以考虑要求用户明确设置测试位置, 或公开修饰函数, 例如 `myPluginChromium()`.

## 提供反馈意见 {id="leave-feedback"}

新的浏览器测试 DSL 正在积极开发中. 在未来的 Kotlin 发布版本中计划添加新的功能, 例如调试功能.

欢迎通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66897)
或 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) Slack 频道提供你的反馈意见.
