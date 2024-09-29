[//]: # (title: Gradle)

最终更新: %latestDocDate%

要为基于 Gradle 的项目要生成文档, 你可以使用
[Gradle plugin for Dokka](https://plugins.gradle.org/plugin/org.jetbrains.dokka).

它对你的项目进行了基本的自动配置, 带有方便的 [Gradle task](#generate-documentation) 用于生成文档,
还提供了大量的 [配置选项](#configuration-options) 用来定制输出.

你可以访问我们的
[Gradle 示例项目](https://github.com/Kotlin/dokka/tree/{{ site.data.releases.dokkaVersion }}/examples/gradle).
实际接触一下 Dokka, 看看它如何对各种项目进行配置.

## 应用 Dokka {id="apply-dokka"}

应用 Gradle plugin for Dokka 时, 推荐的方式是使用
[plugin DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block):

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

</tab>
</tabs>

要对 [多项目](#multi-project-builds) 构建生成文档, 你还需要对子项目应用 Gradle plugin for Dokka.
你可以使用 Gradle 配置 `allprojects {}` 或 `subprojects {}` 来做到这一点:

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
subprojects {
    apply(plugin = "org.jetbrains.dokka")
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
subprojects {
    apply plugin: 'org.jetbrains.dokka'
}
```

</tab>
</tabs>

如果你不确定在哪里应用 Dokka, 请参见 [配置示例](#configuration-examples).

> Dokka 内部会使用 [Kotlin Gradle plugin](gradle-configure-project.md#apply-the-plugin)
> 来对需要生成文档的 [源代码集](multiplatform-discover-project.md#source-sets) 进行自动配置.
> 请确认应用了 Kotlin Gradle Plugin, 或手动的 [配置了源代码集](#source-set-configuration).
>
{style="note"}

> 如果你在
> [预编译的脚本 plugin](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:precompiled_plugins)
> 中使用 Dokka, 你需要将
> [Kotlin Gradle plugin](gradle-configure-project.md#apply-the-plugin)
> 添加为它的依赖项, 才能让它正常工作.
>
{style="note"}

如果你因为某种原因无法使用 plugin DSL, 你可以使用
[旧的方式](https://docs.gradle.org/current/userguide/plugins.html#sec:old_plugin_application)
来应用 plugin.

## 生成文档 {id="generate-documentation"}

Gradle plugin for Dokka 默认带有
[HTML](dokka-html.md), [Markdown](dokka-markdown.md) 和 [Javadoc](dokka-javadoc.md)
输出格式.
对 [单项目](#single-project-builds)构建和 [多项目](#multi-project-builds) 构建,
它都添加了很多 task 用于生成文档.

### 单项目构建 {id="single-project-builds"}

对简单的单项目应用程序和库, 请使用以下 task 来构建文档:

| **Task**    | **描述**                           |
|-------------|----------------------------------|
| `dokkaHtml` | 使用 [HTML](dokka-html.md) 格式生成文档. |

#### 实验性的格式 {id="experimental-formats"}

| **Task**       | **描述**                                                     |
|----------------|------------------------------------------------------------|
| `dokkaGfm`     | 使用 [GitHub 风格的 Markdown](dokka-markdown.md#gfm) 格式生成文档.    |
| `dokkaJavadoc` | 使用 [Javadoc](dokka-javadoc.md) 格式生成文档.                     |
| `dokkaJekyll`  | 使用 [Jekyll 兼容的 Markdown](dokka-markdown.md#jekyll) 格式生成文档. |

默认情况下, 生成的文档会输出到你的项目的 `build/dokka/{format}` 目录中.
输出位置, 以及其他很多设置, 都可以进行 [配置](#configuration-examples).

### 多项目构建 {id="multi-project-builds"}

要对 [多项目构建](https://docs.gradle.org/current/userguide/multi_project_builds.html) 生成文档,
请确认, 不仅对父项目, 也对你想要生成文档的子项目 [应用了 Gradle plugin for Dokka](#apply-dokka).

#### MultiModule task {id="multimodule-tasks"}

`MultiModule` task 通过 [`Partial`](#partial-tasks) task 对每个子项目分别生成文档,
收集并处理所有的输出, 然后使用共同的目录和解析后的跨项目引用, 处理完整的文档.

Dokka 对 **父** 项目 自动创建以下 task:

| **Task**               | **描述**                                |
|------------------------|---------------------------------------|
| `dokkaHtmlMultiModule` | 使用 [HTML](dokka-html.md) 输出格式生成多模块文档. |

#### 实验性的格式 (MultiModule) {id="experimental-formats-multi-module"}

| **Task**                 | **描述**                                                          |
|--------------------------|-----------------------------------------------------------------|
| `dokkaGfmMultiModule`    | 使用 [GitHub 风格的 Markdown](dokka-markdown.md#gfm) 输出格式生成多模块文档.    |
| `dokkaJekyllMultiModule` | 使用 [Jekyll 兼容的 Markdown](dokka-markdown.md#jekyll) 输出格式生成多模块文档. |

> [Javadoc](dokka-javadoc.md) 输出格式没有 `MultiModule` task, 但可以改为使用 [`Collector`](#collector-tasks) task.
>
{style="note"}

默认情况下, 你可以在 `{parentProject}/build/dokka/{format}MultiModule` 目录中找到直接可用的文档.

#### MultiModule task 的输出结果 {id="multimodule-results"}

假设一个项目的结构如下:

```text
parentProject
    └── childProjectA
        ├── demo
            ├── ChildProjectAClass
    └── childProjectB
        ├── demo
            ├── ChildProjectBClass
```

运行 `dokkaHtmlMultiModule` 后生成的文档如下:

![dokkaHtmlMultiModule task 的输出画面截图](dokkaHtmlMultiModule-example.png){width=600}

更多详情, 请参见我们的 [多模块项目示例](https://github.com/Kotlin/dokka/tree/{{ site.data.releases.dokkaVersion }}/examples/gradle/dokka-multimodule-example).

#### Collector task {id="collector-tasks"}

与 `MultiModule` task 类似, 对各个父项目创建了 `Collector` task:
`dokkaHtmlCollector`, `dokkaGfmCollector`, `dokkaJavadocCollector` 以及 `dokkaJekyllCollector`.

`Collector` task 会对每个子项目执行对应的 [单项目 task](#single-project-builds)
(例如, `dokkaHtml`), 并将所有的输出合并到一个单独的虚拟项目.

最终生成的结果文档, 看起来就好象一个单项目构建, 其中包含来自子项目的所有声明.

> 如果你需要为你的多项目构建创建 Javadoc 文档, 请使用 `dokkaJavadocCollector` task.
>
{style="tip"}

#### Collector task 的输出结果 {id="collector-results"}

假设一个项目的结构如下:

```text
parentProject
    └── childProjectA
        ├── demo
            ├── ChildProjectAClass
    └── childProjectB
        ├── demo
            ├── ChildProjectBClass
```

运行 `dokkaHtmlCollector` 之后会生成这样的页面:

![dokkaHtmlCollector task 的输出画面截图](dokkaHtmlCollector-example.png){width=706}

更多详情, 请参见我们的 [多模块项目示例](https://github.com/Kotlin/dokka/tree/{{ site.data.releases.dokkaVersion }}/examples/gradle/dokka-multimodule-example).

#### Partial task {id="partial-tasks"}

对每个子项目都创建了 `Partial` task: `dokkaHtmlPartial`,`dokkaGfmPartial`, 和 `dokkaJekyllPartial`.

这些 task 并不用来单独运行, 它们会被父项目的 [MultiModule](#multimodule-tasks) task 调用.

但是, 你可以 [配置](#subproject-configuration) `Partial` task, 为你的子项目定制 Dokka.

> `Partial` task 生成的输出包含未解析的 HTML 模板和引用,
> 因此在父项目的 [`MultiModule`](#multimodule-tasks) task 进行后续处理之前,
> 这些文档还不能直接使用.
>
{style="warning"}

> 如果你只想对单个子项目生成文档, 请使用 [单项目 task](#single-project-builds).
> 例如, `:subprojectName:dokkaHtml`.
>
{style="note"}

## 构建 javadoc.jar {id="build-javadoc-jar"}

如果你想要将你的库发布到仓库, 你可能需要提供一个 `javadoc.jar` 文件, 其中包含你的库的 API 参考文档.

例如, 如果你想要发布到
[Maven Central](https://central.sonatype.org/),
你 [必须](https://central.sonatype.org/publish/requirements/)
和你的项目一起提供一个 `javadoc.jar`.
但是, 并不是所有的仓库都有这样的规则.

Gradle plugin for Dokka 没有提供任何方式来直接完成这个任务, 但可以通过自定义的 Gradle task 实现.
下面的示例中, 一个 task 使用 [HTML](dokka-html.md) 格式生成文档, 另一个使用 [Javadoc](dokka-javadoc.md) 格式:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.register<Jar>("dokkaHtmlJar") {
    dependsOn(tasks.dokkaHtml)
    from(tasks.dokkaHtml.flatMap { it.outputDirectory })
    archiveClassifier.set("html-docs")
}

tasks.register<Jar>("dokkaJavadocJar") {
    dependsOn(tasks.dokkaJavadoc)
    from(tasks.dokkaJavadoc.flatMap { it.outputDirectory })
    archiveClassifier.set("javadoc")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.register('dokkaHtmlJar', Jar.class) {
    dependsOn(dokkaHtml)
    from(dokkaHtml)
    archiveClassifier.set("html-docs")
}

tasks.register('dokkaJavadocJar', Jar.class) {
    dependsOn(dokkaJavadoc)
    from(dokkaJavadoc)
    archiveClassifier.set("javadoc")
}
```

</tab>
</tabs>

> 如果你将你的库发布到 Maven Central, 你可以使用 [javadoc.io](https://javadoc.io/) 之类的服务,
> 免费托管你的库的 API 文档, 而且不需要任何设置. 它直接从 `javadoc.jar` 得到文档页面.
> 它可以很好的显示 HTML 格式文档, 参见 [这个示例](https://javadoc.io/doc/com.trib3/server/latest/index.html).
>
{style="tip"}

## 配置示例 {id="configuration-examples"}

根据你的项目类型不同, 你应用和配置 Dokka 的方式也略有不同.
但是, [配置选项](#configuration-options) 本身是相同的, 无论你的项目类型如何.

对于简单的项目, 在项目的根目录下包含单个 `build.gradle.kts` 或 `build.gradle` 文件,
请参见 [单项目配置](#single-project-configuration).

对更加复杂的构建, 包含子项目, 以及多个下级的 `build.gradle.kts` 或 `build.gradle` 文件,
请参见 [多项目 配置](#multi-project-configuration).

### 单项目配置 {id="single-project-configuration"}

单项目构建, 通常只在项目的根目录下存在单个 `build.gradle.kts` 或 `build.gradle` 文件,
其结构通常如下:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

单平台项目:

```text
.
├── build.gradle.kts
└── src
    └── main
        └── kotlin
            └── HelloWorld.kt
```

跨平台项目:

```text
.
├── build.gradle.kts
└── src
    └── commonMain
        └── kotlin
            └── Common.kt
    └── jvmMain
        └── kotlin
            └── JvmUtils.kt
    └── nativeMain
        └── kotlin
            └── NativeUtils.kt
```

</tab>
<tab title="Groovy" group-key="groovy">

单平台项目:

```text
.
├── build.gradle
└── src
    └── main
        └── kotlin
            └── HelloWorld.kt
```

跨平台项目:

```text
.
├── build.gradle
└── src
    └── commonMain
        └── kotlin
            └── Common.kt
    └── jvmMain
        └── kotlin
            └── JvmUtils.kt
    └── nativeMain
        └── kotlin
            └── NativeUtils.kt
```

</tab>
</tabs>

在这样的项目中, 你需要在根目录的 `build.gradle.kts` 或 `build.gradle` 文件中应用 Dokka 及其配置.

你可以单独配置 task 和输出格式:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

在 `./build.gradle.kts` 中:

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

tasks.dokkaHtml {
    outputDirectory.set(layout.buildDirectory.dir("documentation/html"))
}

tasks.dokkaGfm {
    outputDirectory.set(layout.buildDirectory.dir("documentation/markdown"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

在 `./build.gradle` 中:

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokkaHtml {
    outputDirectory.set(file("build/documentation/html"))
}

dokkaGfm {
    outputDirectory.set(file("build/documentation/markdown"))
}
```

</tab>
</tabs>

或者你也可以同时配置所有的 task 和输出格式:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

在 `./build.gradle.kts` 中:

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.gradle.DokkaTaskPartial
import org.jetbrains.dokka.DokkaConfiguration.Visibility

plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

// 同时配置所有的单项目 Dokka task,
// 例如 dokkaHtml, dokkaJavadoc 和 dokkaGfm.
tasks.withType<DokkaTask>().configureEach {
    dokkaSourceSets.configureEach {
        documentedVisibilities.set(
            setOf(
                Visibility.PUBLIC,
                Visibility.PROTECTED,
            )
        )

        perPackageOption {
            matchingRegex.set(".*internal.*")
            suppress.set(true)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

在 `./build.gradle` 中:

```groovy
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.gradle.DokkaTaskPartial
import org.jetbrains.dokka.DokkaConfiguration.Visibility

plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

// 同时配置所有的单项目 Dokka task,
// 例如 dokkaHtml, dokkaJavadoc 和 dokkaGfm.
tasks.withType(DokkaTask.class) {
    dokkaSourceSets.configureEach {
        documentedVisibilities.set([
                Visibility.PUBLIC,
                Visibility.PROTECTED
        ])

        perPackageOption {
            matchingRegex.set(".*internal.*")
            suppress.set(true)
        }
    }
}
```

</tab>
</tabs>

### 多项目配置 {id="multi-project-configuration"}

Gradle 的 [多项目构建](https://docs.gradle.org/current/userguide/multi_project_builds.html) 的结构和配置都更加复杂.
这样的项目通常包含多个下级的 `build.gradle.kts` 或 `build.gradle` 文件,
其结构通常如下:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```text
.
├── build.gradle.kts
├── settings.gradle.kts
├── subproject-A
    └── build.gradle.kts
    └── src
        └── main
            └── kotlin
                └── HelloFromA.kt
├── subproject-B
    └── build.gradle.kts
    └── src
        └── main
            └── kotlin
                └── HelloFromB.kt
```

</tab>
<tab title="Groovy" group-key="groovy">

```text
.
├── build.gradle
├── settings.gradle
├── subproject-A
    └── build.gradle
    └── src
        └── main
            └── kotlin
                └── HelloFromA.kt
├── subproject-B
    └── build.gradle
    └── src
        └── main
            └── kotlin
                └── HelloFromB.kt
```

</tab>
</tabs>

对于这样的项目, 有很多种方式来应用和配置 Dokka.

#### 子项目配置 {id="subproject-configuration"}

要在多项目构建中配置子项目, 你需要配置 [`Partial`](#partial-tasks) task.

你可以在根目录的 `build.gradle.kts` 或 `build.gradle` 文件中,
使用 Gradle 的 `allprojects {}` 或 `subprojects {}` 配置代码块, 同时配置所有的子项目:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

在根目录的 `./build.gradle.kts` 中:

```kotlin
import org.jetbrains.dokka.gradle.DokkaTaskPartial

plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

subprojects {
    apply(plugin = "org.jetbrains.dokka")

    // 只配置 HTML task
    tasks.dokkaHtmlPartial {
        outputDirectory.set(layout.buildDirectory.dir("docs/partial"))
    }

    // 配置所有格式
    tasks.withType<DokkaTaskPartial>().configureEach {
        dokkaSourceSets.configureEach {
            includes.from("README.md")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

在根目录的 `./build.gradle` 中:

```groovy
import org.jetbrains.dokka.gradle.DokkaTaskPartial

plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

subprojects {
    apply plugin: 'org.jetbrains.dokka'

    // 只配置 HTML task
    dokkaHtmlPartial {
        outputDirectory.set(file("build/docs/partial"))
    }

    // 配置所有格式
    tasks.withType(DokkaTaskPartial.class) {
        dokkaSourceSets.configureEach {
            includes.from("README.md")
        }
    }
}
```

</tab>
</tabs>

另一种方法是, 你可以对各个子项目分别应用和配置 Dokka.

例如, 为了只对 `subproject-A` 子项目进行特定的设置,
你需要在 `./subproject-A/build.gradle.kts` 中使用以下代码:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

在 `./subproject-A/build.gradle.kts` 中:

```kotlin
apply(plugin = "org.jetbrains.dokka")

// 只配置 subproject-A.
tasks.dokkaHtmlPartial {
    outputDirectory.set(layout.buildDirectory.dir("docs/partial"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

在 `./subproject-A/build.gradle` 中:

```groovy
apply plugin: 'org.jetbrains.dokka'

// 只配置 subproject-A.
dokkaHtmlPartial {
    outputDirectory.set(file("build/docs/partial"))
}
```

</tab>
</tabs>

#### 父项目配置 {id="parent-project-configuration"}

如果你想要配置跨越所有文档的某个设定, 而且它不属于子项目 - 也就是说, 它是父项目的某个属性 -
那么你需要配置 [`MultiModule`](#multimodule-tasks) task.

例如, 如果你想要修改 HTML 文档标题中的项目名称,
你需要在根目录的 `build.gradle.kts` 或 `build.gradle` 文件中使用以下代码:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

在根目录的 `./build.gradle.kts` 文件中:

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

tasks.dokkaHtmlMultiModule {
    moduleName.set("在标题中使用的项目名称")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

在根目录的 `./build.gradle` 文件中:

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokkaHtmlMultiModule {
    moduleName.set("在标题中使用的项目名称")
}
```

</tab>
</tabs>

## 配置选项 {id="configuration-options"}

Dokka 有很多配置选项, 可以用来定制你和你的读者的体验.

下面是对每个配置小节的一些示例和详细解释.
在本章的最后, 你还可以看到一个示例, 它使用了 [所有的配置选项](#complete-configuration).

关于应该在哪里使用配置代码块, 以及如何使用, 请参见 [配置示例](#configuration-examples).

### 一般配置 {id="general-configuration"}

下面是所有 Dokka task 的一般配置的示例, 无论是对源代码集还是包:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask

// 注意: 要配置多项目构建, 你需要配置子项目的 Partial task.
//      参见本文档的 "配置示例" 小节.
tasks.withType<DokkaTask>().configureEach {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(layout.buildDirectory.dir("dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    // ...
    // 参见本文档的 "源代码集配置" 小节
    // ...
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask

// 注意: 要配置多项目构建, 你需要配置子项目的 Partial task.
//      参见本文档的 "配置示例" 小节.
tasks.withType(DokkaTask.class) {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(file("build/dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    // ...
    // 参见本文档的 "源代码集配置" 小节
    // ...
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="moduleName">
        <p>
            用来引用模块的显示名称. 这个名称会用于目录, 导航, 日志, 等等.
        </p>
        <p>
            如果对单项目构建或 <code>MultiModule</code> task 设置这个选项, 它会被用作项目名称.
        </p>
        <p>
            默认值: Gradle 项目名称
        </p>
    </def>
    <def title="moduleVersion">
        <p>
            模块版本. 如果对单项目构建或 <code>MultiModule</code> task 设置这个选项, 它会被用作项目版本.
        </p>
        <p>
            默认值: Gradle 项目版本
        </p>
    </def>
    <def title="outputDirectory">
        <p>
            文档生成的目录, 无论哪种格式. 这个选项可以对每个 task 进行设置.
        </p>
        <p>
            默认值是 <code>{project}/{buildDir}/{format}</code>, 其中 <code>{format}</code> 是 task 名称, 删去了 "dokka" 前缀.
            例如, 对于 <code>dokkaHtmlMultiModule</code> task, 输出目录是 <code>project/buildDir/htmlMultiModule</code>.
        </p>
    </def>
    <def title="failOnWarning">
        <p>
            如果 Dokka 输出警告或错误, 是否让文档生成任务失败.
            进程首先会等待所有的错误和警告输出完毕.
        </p>
        <p>
            这个设置可以与 <code>reportUndocumented</code> 选项配合工作.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="suppressObviousFunctions">
        <p>
            是否禁止输出那些显而易见的函数.
        </p>
        <p>
            满足以下条件的函数, 会被认为是显而易见的函数:
            <list>
                <li>
                    继承自 <code>kotlin.Any</code>, <code>Kotlin.Enum</code>, <code>java.lang.Object</code> 或 <code>java.lang.Enum</code>,
                    例如 <code>equals</code>, <code>hashCode</code>, <code>toString</code>.
                </li>
                <li>
                    合成(由编译器生成的)函数, 而且没有任何文档,
                    例如 <code>dataClass.componentN</code> 或 <code>dataClass.copy</code>.
                </li>
            </list>
        </p>
        <p>
            默认值: <code>true</code>
        </p>
    </def>
    <def title="suppressInheritedMembers">
        <p>
            是否禁止输出在指定的类中继承得到的而且没有显式覆盖的成员.
        </p>
        <p>
            注意: 这个选项可以禁止输出 <code>equals</code> / <code>hashCode</code> / <code>toString</code> 之类的函数,
            但不能禁止输出 <code>dataClass.componentN</code> 和 <code>dataClass.copy</code> 之类的合成函数.
            对合成函数, 请使用 <code>suppressObviousFunctions</code> 选项.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="offlineMode">
        <p>
            是否通过你的网络来解析远程的文件/链接.
        </p>
        <p>
            包括用来生成外部文档链接的包列表.
            例如, 可以让来自标准库的类成为文档中可以点击的链接.
        </p>
        <p>
            将这个选项设置为 <code>true</code>, 某些情况下可以显著提高构建速度, 但也会降低文档质量和用户体验.
            例如, 可以不解析来自你的依赖项的类/成员的链接, 包括标准库.
        </p>
        <p>
            注意: 你可以将已取得的文件缓存到本地, 并通过本地路径提供给 Dokka.
            参见 <code>externalDocumentationLinks</code> 小节.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
</deflist>

### 源代码集配置 {id="source-set-configuration"}

Dokka 对
[Kotlin 源代码集](multiplatform-discover-project.md#source-sets)
允许配置一些选项:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 注意: 要配置多项目构建, 你需要配置子项目的 Partial task.
//      参见本文档的 "配置示例" 小节.
tasks.withType<DokkaTask>().configureEach {
    // ...
    // 参见本文档的 "一般配置" 小节
    // ...

    dokkaSourceSets {
        // 专属于 'linux' 源代码集的配置
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(Visibility.PUBLIC))
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                // 参见本文档的 "源代码链接配置" 小节
            }
            externalDocumentationLink {
                // 参见本文档的 "外部文档链接配置" 小节
            }
            perPackageOption {
                // 参见本文档的 "包选项" 小节
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 注意: 要配置多项目构建, 你需要配置子项目的 Partial task.
//      参见本文档的 "配置示例" 小节.
tasks.withType(DokkaTask.class) {
    // ...
    // 参见本文档的 "一般配置" 小节
    // ...

    dokkaSourceSets {
        // 专属于 'linux' 源代码集的配置
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([Visibility.PUBLIC])
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                // 参见本文档的 "源代码链接配置" 小节
            }
            externalDocumentationLink {
                // 参见本文档的 "外部文档链接配置" 小节
            }
            perPackageOption {
                // 参见本文档的 "包选项" 小节
            }
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="suppress">
        <p>
            在生成文档时, 是否应该跳过这个源代码集.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="displayName">
        <p>
            用来引用这个源代码集的显示名称.
        </p>
        <p>
            这个名称在外部用途使用(例如, 源代码集名称会显示给文档读者),
            也在内部使用(例如, 用于 <code>reportUndocumented</code> 的日志信息).
        </p>
        <p>
            默认情况下, 这个值会从 Kotlin Gradle plugin 提供的信息推断得到.
        </p>
    </def>
    <def title="documentedVisibilities">
        <p>
            这个选项设置需要生成文档的可见度修饰符
        </p>
        <p>
            如果你想要对 <code>protected</code>/<code>internal</code>/<code>private</code> 声明生成文档,
            以及如果你想要排除 <code>public</code> 声明, 只为 internal API 生成文档,
            这个选项会很有用.
        </p>
        <p>
            可以对每个包为单位进行配置.
        </p>
        <p>
            默认值: <code>DokkaConfiguration.Visibility.PUBLIC</code>
        </p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否对可见的、无文档的声明输出警告,
            这是指经过 <code>documentedVisibilities</code> 和其他过滤器过滤之后, 需要输出文档, 但没有 KDocs 的声明.
        </p>
        <p>
            这个设置可以与 <code>failOnWarning</code> 选项配合工作.
        </p>
        <p>
            可以对每个包为单位进行配置.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            是否跳过经各种过滤器过滤之后不包含可见声明的包.
        </p>
        <p>
            例如, 如果 <code>skipDeprecated</code> 设置为 <code>true</code>,
            而且你的包中只包含已废弃的声明, 那么这个包会被认为是空的.
        </p>
        <p>
            默认值: <code>true</code>
        </p>
    </def>
    <def title="skipDeprecated">
        <p>
            是否对标注了 <code>@Deprecated</code> 注解的声明生成文档.
        </p>
        <p>
            可以对每个包为单位进行配置.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="suppressGeneratedFiles">
        <p>
            是否对生成的文件生成文档/进行分析.
        </p>
        <p>
            生成的文件(generated file), 是指出现在 <code>{project}/{buildDir}/generated</code> 目录下的那些文件.
        </p>
        <p>
            如果设置为 <code>true</code>, 它的效果等于将这个目录下的所有文件添加到 <code>suppressedFiles</code> 选项,
            因此你可以手动配置它.
        </p>
        <p>
            默认值: <code>true</code>
        </p>
    </def>
    <def title="jdkVersion">
        <p>
            在为 Java 类型生成外部文档链接时使用的 JDK 版本.
        </p>
        <p>
            例如, 如果你在某些 public 声明的签名中使用了 <code>java.util.UUID</code>,
            而且这个选项设置为 <code>8</code>, Dokka 会为它生成一个指向
            <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadocs</a>
            的外部文档链接.
        </p>
        <p>
            默认值: JDK 8
        </p>
    </def>
    <def title="languageVersion">
        <p>
            设置代码分析和
            <a href="kotlin-doc.md#sample-identifier">@sample</a>
            环境时使用的 <a href="compatibility-modes.md">Kotlin 语言版本</a>.
        </p>
        <p>
            默认情况下, 会使用 Dokka 的内嵌编译器所能够使用的最新的语言版本.
        </p>
    </def>
    <def title="apiVersion">
        <p>
            设置代码分析和
            <a href="kotlin-doc.md#sample-identifier">@sample</a>
            环境时使用的 <a href="compatibility-modes.md">Kotlin API 版本</a>.
        </p>
        <p>
            默认情况下, 从 <code>languageVersion</code> 推断得到.
        </p>
    </def>
    <def title="noStdlibLink">
        <p>
            是否生成指向 Kotlin 标准库的 API 参考文档的外部文档链接.
        </p>
        <p>
            注意: 当 <code>noStdLibLink</code> 设置为 <code>false</code> 时, <b>会</b> 生成链接.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="noJdkLink">
        <p>
            是否生成指向 JDK 的 Javadoc 的外部文档链接.
        </p>
        <p>
            JDK Javadoc 版本会通过 <code>jdkVersion</code> 选项决定.
        </p>
        <p>
            注意: 当 <code>noJdkLink</code> 设置为 <code>false</code> 时, <b>会</b> 生成链接.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="noAndroidSdkLink">
        <p>
            是否生成指向 Android SDK API 参考文档的外部文档链接.
        </p>
        <p>
            这个选项只用于 Android 项目, 其它情况会被忽略.
        </p>
        <p>
            注意: 当 <code>noAndroidSdkLink</code> 设置为 <code>false</code> 时, <b>会</b> 生成链接.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="includes" id="includes">
        <p>
            包含 <a href="dokka-module-and-package-docs.md">模块和包文档</a> 的 Markdown 文件列表.
        </p>
        <p>
            指定的文件的内容会被解析, 并嵌入到文档内, 作为模块和包的描述文档.
        </p>
        <p>
            关于这个选项的使用方法, 请参见
            <a href="https://github.com/Kotlin/dokka/tree/master/examples/gradle/dokka-gradle-example">Dokka Gradle 示例</a>
        </p>
    </def>
    <def title="platform">
        <p>
            设置代码分析和 <a href="kotlin-doc.md#sample-identifier">@sample</a> 环境时使用的平台.
        </p>
        <p>
            默认值通从 Kotlin Gradle plugin 提供的信息推断得到.
        </p>
    </def>
    <def title="sourceRoots">
        <p>
            需要分析并生成文档的源代码根目录.
            允许的输入是目录和单独的 <code>.kt</code> / <code>.java</code> 文件.
        </p>
        <p>
            默认情况下, 源代码根目录从 Kotlin Gradle plugin 提供的信息推断得到.
        </p>
    </def>
    <def title="classpath">
        <p>
            用于代码分析和交互式示例的类路径.
        </p>
        <p>
            如果来自依赖项的某些类型无法自动的解析/查找, 这个选项会很有用.
        </p>
        <p>
            这个选项可以接受 <code>.jar</code> 和 <code>.klib</code> 文件.
        </p>
        <p>
            默认情况下, 类路径从 Kotlin Gradle plugin 提供的信息推断得到.
        </p>
    </def>
    <def title="samples">
        <p>
            目录或文件的列表, 其中包含通过 <a href="kotlin-doc.md#sample-identifier">@sample</a> KDoc tag 引用的示例函数.
        </p>
    </def>
</deflist>

### 源代码链接配置 {id="source-link-configuration"}

`sourceLinks` 配置块可以用来为每个签名添加 `source` 链接, 链接地址是带有特定代码行的 `remoteUrl`.
(代码行可以通过 `remoteLineSuffix` 进行配置).

这样可以帮助读者找到每个声明的源代码.

例如, 请参见 `kotlinx.coroutines` 中
[`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html)
函数的文档.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 注意: 要配置多项目构建, 你需要配置子项目的 Partial task.
//      参见本文档的 "配置示例" 小节.
tasks.withType<DokkaTask>().configureEach {
    // ...
    // 参见本文档的 "一般配置" 小节
    // ...

    dokkaSourceSets.configureEach {
        // ...
        // 参见本文档的 "源代码集配置" 小节
        // ...

        sourceLink {
            localDirectory.set(projectDir.resolve("src"))
            remoteUrl.set(URL("https://github.com/kotlin/dokka/tree/master/src"))
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 注意: 要配置多项目构建, 你需要配置子项目的 Partial task.
//      参见本文档的 "配置示例" 小节.
tasks.withType(DokkaTask.class) {
    // ...
    // 参见本文档的 "一般配置" 小节
    // ...

    dokkaSourceSets.configureEach {
        // ...
        // 参见本文档的 "源代码集配置" 小节
        // ...

        sourceLink {
            localDirectory.set(file("src"))
            remoteUrl.set(new URL("https://github.com/kotlin/dokka/tree/master/src"))
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="localDirectory">
        <p>
            本地源代码目录的路径. 必须是从当前项目根目录开始的相对路径.
        </p>
    </def>
    <def title="remoteUrl">
        <p>
            可以由文档读者访问的源代码托管服务 URL, 例如 GitHub, GitLab, Bitbucket, 等等.
            这个 URL 用来生成声明的源代码链接.
        </p>
    </def>
    <def title="remoteLineSuffix">
        <p>
            向 URL 添加的源代码行数后缀.
            这样可以帮助读者, 不仅能够导航到文件, 而且是声明所在的确定的行数.
        </p>
        <p>
            行数本身会添加到后缀之后. 例如, 如果这个选项设置为 <code>#L</code>, 行数是 10,
            那么最后的 URL 后缀会是 <code>#L10</code>.
        </p>
        <p>
            各种常用的源代码托管服务的行数后缀是:
            <list>
                <li>GitHub: <code>#L</code></li>
                <li>GitLab: <code>#L</code></li>
                <li>Bitbucket: <code>#lines-</code></li>
            </list>
        </p>
        <p>
            默认值: <code>#L</code>
        </p>
    </def>
</deflist>

### 包选项 {id="package-options"}

`perPackageOption` 配置块可以对指定的包设置一些选项, 包通过 `matchingRegex` 来匹配.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask

// 注意: 要配置多项目构建, 你需要配置子项目的 Partial task.
//      参见本文档的 "配置示例" 小节.
tasks.withType<DokkaTask>().configureEach {
    // ...
    // 参见本文档的 "一般配置" 小节
    // ...

    dokkaSourceSets.configureEach {
        // ...
        // 参见本文档的 "源代码集配置" 小节
        // ...

        perPackageOption {
            matchingRegex.set(".*api.*")
            suppress.set(false)
            skipDeprecated.set(false)
            reportUndocumented.set(false)
            documentedVisibilities.set(setOf(Visibility.PUBLIC))
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask

// 注意: 要配置多项目构建, 你需要配置子项目的 Partial task.
//      参见本文档的 "配置示例" 小节.
tasks.withType(DokkaTask.class) {
    // ...
    // 参见本文档的 "一般配置" 小节
    // ...

    dokkaSourceSets.configureEach {
        // ...
        // 参见本文档的 "源代码集配置" 小节
        // ...

        perPackageOption {
            matchingRegex.set(".*api.*")
            suppress.set(false)
            skipDeprecated.set(false)
            reportUndocumented.set(false)
            documentedVisibilities.set([Visibility.PUBLIC])
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="matchingRegex">
        <p>
            用来匹配包的正规表达式.
        </p>
        <p>
            默认值: <code>.*</code>
        </p>
    </def>
    <def title="suppress">
        <p>
            在生成文档时, 是否应该跳过这个包.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="skipDeprecated">
        <p>
            是否对标注了 <code>@Deprecated</code> 注解的声明生成文档.
        </p>
        <p>
            这个选项可以在源代码集级配置.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否对可见的、无文档的声明输出警告,
            这是指经过 <code>documentedVisibilities</code> 和其他过滤器过滤之后, 需要输出文档, 但没有 KDocs 的声明.
        </p>
        <p>
            这个设置可以与 <code>failOnWarning</code> 选项配合工作.
        </p>
        <p>
            这个选项可以在源代码集级配置.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="documentedVisibilities">
        <p>
            应该生成文档的可见度标识符集合.
        </p>
        <p>
            如果你想要对这个包内的 <code>protected</code>/<code>internal</code>/<code>private</code> 声明生成文档,
            以及如果你想要排除 <code>public</code> 声明, 只为 internal API 生成文档,
            这个选项可以很有用.
        </p>
        <p>
            这个选项可以在源代码集级配置.
        </p>
        <p>
            默认值: <code>DokkaConfiguration.Visibility.PUBLIC</code>
        </p>
    </def>
</deflist>

### 外部文档链接配置 {id="external-documentation-links-configuration"}

`externalDocumentationLink` 配置块可以创建链接, 指向你的依赖项的外部文档.

例如, 如果你使用来自 `kotlinx.serialization` 的类型, 默认情况下,
在你的文档中这些类型不是可点击的链接, 因为无法解析这些类型.
但是, 由于 `kotlinx.serialization` 的 API 参考文档是使用 Dokka 构建的,
而且 [发布到了 kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/),
因此你可以对它配置外部文档链接.
然后就可以让 Dokka 对来自这个库的类型生成链接, 让它们成功的解析, 并在文档中成为可点击的链接.

默认情况下, 已经配置了对 Kotlin 标准库, JDK, Android SDK 和 AndroidX 的外部文档链接.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 注意: 要配置多项目构建, 你需要配置子项目的 Partial task.
//      参见本文档的 "配置示例" 小节.
tasks.withType<DokkaTask>().configureEach {
    // ...
    // 参见本文档的 "一般配置" 小节
    // ...

    dokkaSourceSets.configureEach {
        // ...
        // 参见本文档的 "源代码集配置" 小节
        // ...

        externalDocumentationLink {
            url.set(URL("https://kotlinlang.org/api/kotlinx.serialization/"))
            packageListUrl.set(
                rootProject.projectDir.resolve("serialization.package.list").toURL()
            )
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 注意: 要配置多项目构建, 你需要配置子项目的 Partial task.
//      参见本文档的 "配置示例" 小节.
tasks.withType(DokkaTask.class) {
    // ...
    // 参见本文档的 "一般配置" 小节
    // ...

    dokkaSourceSets.configureEach {
        // ...
        // 参见本文档的 "源代码集配置" 小节
        // ...

        externalDocumentationLink {
            url.set(new URL("https://kotlinlang.org/api/kotlinx.serialization/"))
            packageListUrl.set(
                file("serialization.package.list").toURL()
            )
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="url">
        <p>
            链接到的文档的根 URL. 最末尾 <b>必须</b> 包含斜线.
        </p>
        <p>
            Dokka 会尽量对给定的 URL 自动寻找 <code>package-list</code>, 并将声明链接到一起.
        </p>
        <p>
            如果自动解析失败, 或者如果你想要使用本地缓存的文件, 请考虑设置 <code>packageListUrl</code> 选项.
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code> 的确切位置.
            这是对 Dokka 自动解析的一个替代手段.
        </p>
        <p>
            包列表包含关于文档和项目自身的信息, 例如模块和包的名称.
        </p>
        <p>
            也可以使用本地缓存的文件, 以避免发生网络访问.
        </p>
    </def>
</deflist>

### 完整的配置 {id="complete-configuration"}

下面的例子中, 你可以看到同时使用了所有的配置选项.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 注意: 要配置多项目构建, 你需要配置子项目的 Partial task.
//      参见本文档的 "配置示例" 小节.
tasks.withType<DokkaTask>().configureEach {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(layout.buildDirectory.dir("dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    dokkaSourceSets {
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(Visibility.PUBLIC))
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                localDirectory.set(projectDir.resolve("src"))
                remoteUrl.set(URL("https://github.com/kotlin/dokka/tree/master/src"))
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLink {
                url.set(URL("https://kotlinlang.org/api/latest/jvm/stdlib/"))
                packageListUrl.set(
                    rootProject.projectDir.resolve("stdlib.package.list").toURL()
                )
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set(
                    setOf(
                        Visibility.PUBLIC,
                        Visibility.PRIVATE,
                        Visibility.PROTECTED,
                        Visibility.INTERNAL,
                        Visibility.PACKAGE
                    )
                )
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 注意: 要配置多项目构建, 你需要配置子项目的 Partial task.
//      参见本文档的 "配置示例" 小节.
tasks.withType(DokkaTask.class) {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(file("build/dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    dokkaSourceSets {
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([Visibility.PUBLIC])
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                localDirectory.set(file("src"))
                remoteUrl.set(new URL("https://github.com/kotlin/dokka/tree/master/src"))
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLink {
                url.set(new URL("https://kotlinlang.org/api/latest/jvm/stdlib/"))
                packageListUrl.set(
                        file("stdlib.package.list").toURL()
                )
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set([Visibility.PUBLIC])
            }
        }
    }
}
```

</tab>
</tabs>
