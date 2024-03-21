---
type: doc
layout: reference
category: dokka
title: "Gradle"
---

# Gradle

最终更新: {{ site.data.releases.latestDocDate }}

要为基于 Gradle 的项目要生成文档, 你可以使用 
[Gradle plugin for Dokka](https://plugins.gradle.org/plugin/org.jetbrains.dokka).

它对你的项目进行了基本的自动配置, 带有方便的 [Gradle task](#generate-documentation) 用于生成文档,
还提供了大量的 [配置选项](#configuration-options) 用来定制输出.

你可以访问我们的
[Gradle 示例项目](https://github.com/Kotlin/dokka/tree/{{ site.data.releases.dokkaVersion }}/examples/gradle).
实际接触一下 Dokka, 看看它如何对各种项目进行配置.

## 应用 Dokka

应用 Gradle plugin for Dokka 时, 推荐的方式是使用 
[plugin DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block):

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    id("org.jetbrains.dokka") version "{{ site.data.releases.dokkaVersion }}"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '{{ site.data.releases.dokkaVersion }}'
}
```

</div>
</div>

要对 [多项目](#multi-project-builds) 构建生成文档, 你还需要对子项目应用 Gradle plugin for Dokka.
你可以使用 Gradle 配置 `allprojects {}` 或 `subprojects {}` 来做到这一点:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
subprojects {
    apply(plugin = "org.jetbrains.dokka")
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
subprojects {
    apply plugin: 'org.jetbrains.dokka'
}
```

</div>
</div>

如果你不确定在哪里应用 Dokka, 请参见 [配置示例](#configuration-examples).

> Dokka 内部会使用 [Kotlin Gradle plugin](../../gradle/gradle-configure-project.html#apply-the-plugin)
> 来对需要生成文档的 [源代码集](../../multiplatform/multiplatform-discover-project.html#source-sets) 进行自动配置.
> 请确认应用了 Kotlin Gradle Plugin, 或手动的 [配置了源代码集](#source-set-configuration).
{:.note}

> 如果你在 
> [预编译的脚本 plugin](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:precompiled_plugins)
> 中使用 Dokka, 你需要将
> [Kotlin Gradle plugin](../../gradle/gradle-configure-project.html#apply-the-plugin)
> 添加为它的依赖项, 才能让它正常工作.
{:.note}

如果你因为某种原因无法使用 plugin DSL, 你可以使用
[旧的方式](https://docs.gradle.org/current/userguide/plugins.html#sec:old_plugin_application)
来应用 plugin.

## 生成文档

Gradle plugin for Dokka 默认带有
[HTML](../formats/dokka-html.html), [Markdown](../formats/dokka-markdown.html) 和 [Javadoc](../formats/dokka-javadoc.html)
输出格式.
对 [单项目](#single-project-builds)构建和 [多项目](#multi-project-builds) 构建,
它都添加了很多 task 用于生成文档.

### 单项目构建

对简单的单项目应用程序和库, 请使用以下 task 来构建文档:

| **Task**    | **描述**                                        |
|-------------|-----------------------------------------------|
| `dokkaHtml` | 使用 [HTML](../formats/dokka-html.html) 格式生成文档. |

#### 实验性的格式

| **Task**       | **描述**                                                                  |
|----------------|-------------------------------------------------------------------------|
| `dokkaGfm`     | 使用 [GitHub 风格的 Markdown](../formats/dokka-markdown.html#gfm) 格式生成文档.    |
| `dokkaJavadoc` | 使用 [Javadoc](../formats/dokka-javadoc.html) 格式生成文档.                     |
| `dokkaJekyll`  | 使用 [Jekyll 兼容的 Markdown](../formats/dokka-markdown.html#jekyll) 格式生成文档. |

默认情况下, 生成的文档会输出到你的项目的 `build/dokka/{format}` 目录中.
输出位置, 以及其他很多设置, 都可以进行 [配置](#configuration-examples).

### 多项目构建

要对 [多项目构建](https://docs.gradle.org/current/userguide/multi_project_builds.html) 生成文档,
请确认, 不仅对父项目, 也对你想要生成文档的子项目 [应用了 Gradle plugin for Dokka](#apply-dokka).

#### MultiModule task

`MultiModule` task 通过 [`Partial`](#partial-tasks) task 对每个子项目分别生成文档,
收集并处理所有的输出, 然后使用共同的目录和解析后的跨项目引用, 处理完整的文档.

Dokka 对 **父** 项目 自动创建以下 task:

| **Task**               | **描述**                                             |
|------------------------|----------------------------------------------------|
| `dokkaHtmlMultiModule` | 使用 [HTML](../formats/dokka-html.html) 输出格式生成多模块文档. |

#### 实验性的格式 (MultiModule)

| **Task**                 | **描述**                                                                       |
|--------------------------|------------------------------------------------------------------------------|
| `dokkaGfmMultiModule`    | 使用 [GitHub 风格的 Markdown](../formats/dokka-markdown.html#gfm) 输出格式生成多模块文档.    |
| `dokkaJekyllMultiModule` | 使用 [Jekyll 兼容的 Markdown](../formats/dokka-markdown.html#jekyll) 输出格式生成多模块文档. |

> [Javadoc](../formats/dokka-javadoc.html) 输出格式没有 `MultiModule` task, 但可以改为使用 [`Collector`](#collector-tasks) task.
{:.note}

默认情况下, 你可以在 `{parentProject}/build/dokka/{format}MultiModule` 目录中找到直接可用的文档.

#### MultiModule task 的输出结果

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

<img src="/assets/docs/images/dokka/dokkaHtmlMultiModule-example.png" alt="dokkaHtmlMultiModule task 的输出画面截图" width="600"/>

更多详情, 请参见我们的 [多模块项目示例](https://github.com/Kotlin/dokka/tree/{{ site.data.releases.dokkaVersion }}/examples/gradle/dokka-multimodule-example).

#### Collector task

与 `MultiModule` task 类似, 对各个父项目创建了 `Collector` task:
`dokkaHtmlCollector`, `dokkaGfmCollector`, `dokkaJavadocCollector` 以及 `dokkaJekyllCollector`.

`Collector` task 会对每个子项目执行对应的 [单项目 task](#single-project-builds)
(例如, `dokkaHtml`), 并将所有的输出合并到一个单独的虚拟项目.

最终生成的结果文档, 看起来就好象一个单项目构建, 其中包含来自子项目的所有声明.

> 如果你需要为你的多项目构建创建 Javadoc 文档, 请使用 `dokkaJavadocCollector` task.
{:.tip}

#### Collector task 的输出结果

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

<img src="/assets/docs/images/dokka/dokkaHtmlCollector-example.png" alt="dokkaHtmlCollector task 的输出画面截图" width="706"/>

更多详情, 请参见我们的 [多模块项目示例](https://github.com/Kotlin/dokka/tree/{{ site.data.releases.dokkaVersion }}/examples/gradle/dokka-multimodule-example).

#### Partial task

对每个子项目都创建了 `Partial` task: `dokkaHtmlPartial`,`dokkaGfmPartial`, 和 `dokkaJekyllPartial`.

这些 task 并不用来单独运行, 它们会被父项目的 [MultiModule](#multimodule-tasks) task 调用.

但是, 你可以 [配置](#subproject-configuration) `Partial` task, 为你的子项目定制 Dokka.

> `Partial` task 生成的输出包含未解析的 HTML 模板和引用, 
> 因此在父项目的 [`MultiModule`](#multimodule-tasks) task 进行后续处理之前,
> 这些文档还不能直接使用.
{:.warning}

> 如果你只想对单个子项目生成文档, 请使用 [单项目 task](#single-project-builds).
> 例如, `:subprojectName:dokkaHtml`.
{:.note}

## 构建 javadoc.jar

如果你想要将你的库发布到仓库, 你可能需要提供一个 `javadoc.jar` 文件, 其中包含你的库的 API 参考文档.

例如, 如果你想要发布到
[Maven Central](https://central.sonatype.org/),
你 [必须](https://central.sonatype.org/publish/requirements/)
和你的项目一起提供一个 `javadoc.jar`.
但是, 并不是所有的仓库都有这样的规则.

Gradle plugin for Dokka 没有提供任何方式来直接完成这个任务, 但可以通过自定义的 Gradle task 实现.
下面的示例中, 一个 task 使用 [HTML](../formats/dokka-html.html) 格式生成文档, 另一个使用 [Javadoc](../formats/dokka-javadoc.html) 格式:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

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

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

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

</div>
</div>

> 如果你将你的库发布到 Maven Central, 你可以使用 [javadoc.io](https://javadoc.io/) 之类的服务,
> 免费托管你的库的 API 文档, 而且不需要任何设置. 它直接从 `javadoc.jar` 得到文档页面.
> 它可以很好的显示 HTML 格式文档, 参见 [这个示例](https://javadoc.io/doc/com.trib3/server/latest/index.html).
{:.tip}

## 配置示例

根据你的项目类型不同, 你应用和配置 Dokka 的方式也略有不同.
但是, [配置选项](#configuration-options) 本身是相同的, 无论你的项目类型如何.

对于简单的项目, 在项目的根目录下包含单个 `build.gradle.kts` 或 `build.gradle` 文件,
请参见 [单项目配置](#single-project-configuration).

对更加复杂的构建, 包含子项目, 以及多个下级的 `build.gradle.kts` 或 `build.gradle` 文件,
请参见 [多项目 配置](#multi-project-configuration).

### 单项目配置

单项目构建, 通常只在项目的根目录下存在单个 `build.gradle.kts` 或 `build.gradle` 文件,
其结构通常如下:

<div class="multi-language-sample" data-lang="kotlin">

<p></p>
<p>单平台项目:</p>

<div class="sample" markdown="1" mode="text" theme="idea" data-lang="text" data-highlight-only>

```text
.
├── build.gradle.kts
└── src
    └── main
        └── kotlin
            └── HelloWorld.kt
```

</div>

<p>跨平台项目:</p>

<div class="sample" markdown="1" mode="text" theme="idea" data-lang="text" data-highlight-only>

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
</div>

</div>

<div class="multi-language-sample" data-lang="groovy">

<p></p>
<p>单平台项目:</p>

<div class="sample" markdown="1" mode="text" theme="idea" data-lang="text" data-highlight-only>

```text
.
├── build.gradle
└── src
    └── main
        └── kotlin
            └── HelloWorld.kt
```

</div>

<p>跨平台项目:</p>

<div class="sample" markdown="1" mode="text" theme="idea" data-lang="text" data-highlight-only>

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

</div>

</div>

在这样的项目中, 你需要在根目录的 `build.gradle.kts` 或 `build.gradle` 文件中应用 Dokka 及其配置.

你可以单独配置 task 和输出格式:

<div class="multi-language-sample" data-lang="kotlin">

<p></p>
<p>在 <code>./build.gradle.kts</code> 中:</p>

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    id("org.jetbrains.dokka") version "{{ site.data.releases.dokkaVersion }}"
}

tasks.dokkaHtml {
    outputDirectory.set(layout.buildDirectory.dir("documentation/html"))
}

tasks.dokkaGfm {
    outputDirectory.set(layout.buildDirectory.dir("documentation/markdown"))
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">

<p></p>
<p>在 <code>./build.gradle</code> 中:</p>

<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '{{ site.data.releases.dokkaVersion }}'
}

dokkaHtml {
    outputDirectory.set(file("build/documentation/html"))
}

dokkaGfm {
    outputDirectory.set(file("build/documentation/markdown"))
}
```

</div>
</div>

或者你也可以同时配置所有的 task 和输出格式: 

<div class="multi-language-sample" data-lang="kotlin">

<p></p>
<p>在 <code>./build.gradle.kts</code> 中:</p>

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.gradle.DokkaTaskPartial
import org.jetbrains.dokka.DokkaConfiguration.Visibility

plugins {
    id("org.jetbrains.dokka") version "{{ site.data.releases.dokkaVersion }}"
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

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">

<p></p>
<p>在 <code>./build.gradle</code> 中:</p>

<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.gradle.DokkaTaskPartial
import org.jetbrains.dokka.DokkaConfiguration.Visibility

plugins {
    id 'org.jetbrains.dokka' version '{{ site.data.releases.dokkaVersion }}'
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

</div>
</div>

### 多项目配置

Gradle 的 [多项目构建](https://docs.gradle.org/current/userguide/multi_project_builds.html) 的结构和配置都更加复杂.
这样的项目通常包含多个下级的 `build.gradle.kts` 或 `build.gradle` 文件,
其结构通常如下:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="text" theme="idea" data-lang="text" data-highlight-only>

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

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="text" theme="idea" data-lang="text" data-highlight-only>

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

</div>
</div>

对于这样的项目, 有很多种方式来应用和配置 Dokka.

#### 子项目配置

要在多项目构建中配置子项目, 你需要配置 [`Partial`](#partial-tasks) task.

你可以在根目录的 `build.gradle.kts` 或 `build.gradle` 文件中,
使用 Gradle 的 `allprojects {}` 或 `subprojects {}` 配置代码块, 同时配置所有的子项目:

<div class="multi-language-sample" data-lang="kotlin">

<p></p>
<p>在根目录的 <code>./build.gradle.kts</code> 中:</p>

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
import org.jetbrains.dokka.gradle.DokkaTaskPartial

plugins {
    id("org.jetbrains.dokka") version "{{ site.data.releases.dokkaVersion }}"
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

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">

<p></p>
<p>在根目录的 <code>./build.gradle</code> 中:</p>

<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTaskPartial

plugins {
    id 'org.jetbrains.dokka' version '{{ site.data.releases.dokkaVersion }}'
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

</div>
</div>

另一种方法是, 你可以对各个子项目分别应用和配置 Dokka.

例如, 为了只对 `subproject-A` 子项目进行特定的设置,
你需要在 `./subproject-A/build.gradle.kts` 中使用以下代码:

<div class="multi-language-sample" data-lang="kotlin">

<p></p>
<p>在 <code>./subproject-A/build.gradle.kts</code> 中:</p>

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
apply(plugin = "org.jetbrains.dokka")

// 只配置 subproject-A.
tasks.dokkaHtmlPartial {
    outputDirectory.set(layout.buildDirectory.dir("docs/partial"))
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">

<p></p>
<p>在 <code>./subproject-A/build.gradle</code> 中:</p>

<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
apply plugin: 'org.jetbrains.dokka'

// 只配置 subproject-A.
dokkaHtmlPartial {
    outputDirectory.set(file("build/docs/partial"))
}
```

</div>
</div>

#### 父项目配置

如果你想要配置跨越所有文档的某个设定, 而且它不属于子项目 - 也就是说, 它是父项目的某个属性 -
那么你需要配置 [`MultiModule`](#multimodule-tasks) task.

例如, 如果你想要修改 HTML 文档标题中的项目名称,
你需要在根目录的 `build.gradle.kts` 或 `build.gradle` 文件中使用以下代码:

<div class="multi-language-sample" data-lang="kotlin">

<p></p>
<p>在根目录的 <code>./build.gradle.kts</code> 文件中:</p>

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    id("org.jetbrains.dokka") version "{{ site.data.releases.dokkaVersion }}"
}

tasks.dokkaHtmlMultiModule {
    moduleName.set("在标题中使用的项目名称")
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">

<p></p>
<p>在根目录的 <code>./build.gradle</code> 文件中:</p>

<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '{{ site.data.releases.dokkaVersion }}'
}

dokkaHtmlMultiModule {
    moduleName.set("在标题中使用的项目名称")
}
```

</div>
</div>

## 配置选项

Dokka 有很多配置选项, 可以用来定制你和你的读者的体验.

下面是对每个配置小节的一些示例和详细解释.
在本章的最后, 你还可以看到一个示例, 它使用了 [所有的配置选项](#complete-configuration).

关于应该在哪里使用配置代码块, 以及如何使用, 请参见 [配置示例](#configuration-examples).

### 一般配置

下面是所有 Dokka task 的一般配置的示例, 无论是对源代码集还是包:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

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

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

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

</div>
</div>

#### moduleName

用来引用模块的显示名称. 这个名称会用于目录, 导航, 日志, 等等.

如果对单项目构建或 `MultiModule` task 设置这个选项, 它会被用作项目名称.

默认值: Gradle 项目名称

#### moduleVersion

模块版本. 如果对单项目构建或 `MultiModule` task 设置这个选项, 它会被用作项目版本.

默认值: Gradle 项目版本

#### outputDirectory

文档生成的目录, 无论哪种格式. 这个选项可以对每个 task 进行设置.

默认值是 `{project}/{buildDir}/{format}`, 其中 `{format}` 是 task 名称, 删去了 "dokka" 前缀.
例如, 对于 `dokkaHtmlMultiModule` task, 输出目录是 `project/buildDir/htmlMultiModule`.

#### failOnWarning

如果 Dokka 输出警告或错误, 是否让文档生成任务失败.
进程首先会等待所有的错误和警告输出完毕.

这个设置可以与 `reportUndocumented` 选项配合工作.

默认值: `false`

#### suppressObviousFunctions

是否禁止输出那些显而易见的函数.

满足以下条件的函数, 会被认为是显而易见的函数:
- 继承自 `kotlin.Any`, `Kotlin.Enum`, `java.lang.Object` 或 `java.lang.Enum`, 例如 `equals`, `hashCode`, `toString`.
- 合成(由编译器生成的)函数, 而且没有任何文档, 例如 `dataClass.componentN` 或 `dataClass.copy`.

默认值: `true`

#### suppressInheritedMembers

是否禁止输出在指定的类中继承得到的而且没有显式覆盖的成员.

注意: 这个选项可以禁止输出 `equals` / `hashCode` / `toString` 之类的函数,
但不能禁止输出 `dataClass.componentN` 和 `dataClass.copy` 之类的合成函数.
对合成函数, 请使用 `suppressObviousFunctions` 选项.

默认值: `false`

#### offlineMode

是否通过你的网络来解析远程的文件/链接.

包括用来生成外部文档链接的包列表. 
例如, 可以让来自标准库的类成为文档中可以点击的链接.

将这个选项设置为 `true`, 某些情况下可以显著提高构建速度, 但也会降低文档质量和用户体验.
例如, 可以不解析来自你的依赖项的类/成员的链接, 包括标准库.

注意: 你可以将已取得的文件缓存到本地, 并通过本地路径提供给 Dokka.
参见 `externalDocumentationLinks` 小节.

默认值: `false`

### 源代码集配置

Dokka 对
[Kotlin 源代码集](../../multiplatform/multiplatform-discover-project.html#source-sets)
允许配置一些选项 :

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

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

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

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

</div>
</div>

#### suppress

在生成文档时, 是否应该跳过这个源代码集.

默认值: `false`

#### displayName

用来引用这个源代码集的显示名称.

这个名称在外部用途使用(例如, 源代码集名称会显示给文档读者),
也在内部使用(例如, 用于 `reportUndocumented` 的日志信息).

默认情况下, 这个值会从 Kotlin Gradle plugin 提供的信息推断得到.

#### documentedVisibilities

这个选项设置需要生成文档的可见度修饰符.

如果你想要对 `protected`/`internal`/`private` 声明生成文档,
以及如果你想要排除 `public` 声明, 只为 internal API 生成文档,
这个选项会很有用.

可以对每个包为单位进行配置.

默认值: `DokkaConfiguration.Visibility.PUBLIC`

#### reportUndocumented

是否对可见的、无文档的声明输出警告,
这是指经过 `documentedVisibilities` 和其他过滤器过滤之后, 需要输出文档, 但没有 KDocs 的声明.

这个设置可以与 `failOnWarning` 选项配合工作.

可以对每个包为单位进行配置.

默认值: `false`

#### skipEmptyPackages

是否跳过经各种过滤器过滤之后不包含可见声明的包.

例如, 如果 `skipDeprecated` 设置为 `true`,
而且你的包中只包含已废弃的声明, 那么这个包会被认为是空的.

默认值: `true`

#### skipDeprecated

是否对标注了 `@Deprecated` 注解的声明生成文档.

可以对每个包为单位进行配置.

默认值: `false`

#### suppressGeneratedFiles

是否对生成的文件生成文档/进行分析.

生成的文件(generated file), 是指出现在 `{project}/{buildDir}/generated` 目录下的那些文件.

如果设置为 `true`, 它的效果等于将这个目录下的所有文件添加到 `suppressedFiles` 选项,
因此你可以手动配置它.

默认值: `true`

#### jdkVersion

在为 Java 类型生成外部文档链接时使用的 JDK 版本.

例如, 如果你在某些 public 声明的签名中使用了 `java.util.UUID`,
而且这个选项设置为 `8`, Dokka 会为它生成一个指向
[JDK 8 Javadoc](https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html)
的外部文档链接.

默认值: JDK 8

#### languageVersion

设置代码分析和
[@sample](../../kotlin-doc.html#sample-identifier)
环境时使用的 [Kotlin 语言版本](../../compatibility-modes.html).

默认情况下, 会使用 Dokka 的内嵌编译器所能够使用的最新的语言版本.

#### apiVersion

设置代码分析和
[@sample](../../kotlin-doc.html#sample-identifier)
环境时使用的 [Kotlin API 版本](../../compatibility-modes.html).

默认情况下, 从 `languageVersion` 推断得到.

#### noStdlibLink

是否生成指向 Kotlin 标准库的 API 参考文档的外部文档链接.

注意: 当 `noStdLibLink` 设置为 `false` 时, **会** 生成链接.

默认值: `false`

#### noJdkLink

是否生成指向 JDK 的 Javadoc 的外部文档链接.

JDK Javadoc 版本会通过 `jdkVersion` 选项决定.

注意: 当 `noJdkLink` 设置为 `false` 时, **会** 生成链接.

默认值: `false`

#### noAndroidSdkLink

是否生成指向 Android SDK API 参考文档的外部文档链接.

这个选项只用于 Android 项目, 其它情况会被忽略.

注意: 当 `noAndroidSdkLink` 设置为 `false` 时, **会** 生成链接.

默认值: `false`

#### includes
<anchor name="includes"/>

包含 [模块和包文档](../dokka-module-and-package-docs.html) 的 Markdown 文件列表.

指定的文件的内容会被解析, 并嵌入到文档内, 作为模块和包的描述文档.

关于这个选项的使用方法, 请参见 
[Dokka Gradle 示例](https://github.com/Kotlin/dokka/tree/master/examples/gradle/dokka-gradle-example).

#### platform

设置代码分析和 [@sample](../../kotlin-doc.html#sample-identifier) 环境时使用的平台.

The default value is deduced from 信息 provided by the Kotlin Gradle plugin.

#### sourceRoots

需要分析并生成文档的源代码根目录.
允许的输入是目录和单独的 `.kt` / `.java` 文件.

默认情况下, 源代码根目录从 Kotlin Gradle plugin 提供的信息推断得到.

#### classpath

用于代码分析和交互式示例的类路径.

如果来自依赖项的某些类型无法自动的解析/查找, 这个选项会很有用.

这个选项可以接受 `.jar` 和 `.klib` 文件.

默认情况下, 类路径从 Kotlin Gradle plugin 提供的信息推断得到.

#### samples

目录或文件的列表, 其中包含通过 [@sample](../../kotlin-doc.html#sample-identifier) KDoc tag 引用的示例函数.


### 源代码链接配置

`sourceLinks` 配置块可以用来为每个签名添加 `source` 链接, 链接地址是带有特定代码行的 `remoteUrl`.
(代码行可以通过 `remoteLineSuffix` 进行配置).

这样可以帮助读者找到每个声明的源代码.

例如, 请参见 `kotlinx.coroutines` 中
[`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html)
函数的文档.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

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

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

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

</div>
</div>

#### localDirectory

本地源代码目录的路径. 必须是从当前项目根目录开始的相对路径.

#### remoteUrl

可以由文档读者访问的源代码托管服务 URL, 例如 GitHub, GitLab, Bitbucket, 等等.
这个 URL 用来生成声明的源代码链接.

#### remoteLineSuffix

向 URL 添加的源代码行数后缀.
这样可以帮助读者, 不仅能够导航到文件, 而且是声明所在的确定的行数.

行数本身会添加到后缀之后. 例如, 如果这个选项设置为 `#L`, 行数是 10, 那么最后的 URL 后缀会是 `#L10`.

各种常用的源代码托管服务的行数后缀是:
- GitHub: `#L`
- GitLab: `#L`
- Bitbucket: `#lines-`

默认值: `#L`


### 包选项

`perPackageOption` 配置块可以对指定的包设置一些选项, 包通过 `matchingRegex` 来匹配.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

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

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

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

</div>
</div>

#### matchingRegex

用来匹配包的正规表达式.

默认值: `.*`

#### suppress

在生成文档时, 是否应该跳过这个包.

默认值: `false`

#### skipDeprecated

是否对标注了 `@Deprecated` 注解的声明生成文档.

这个选项可以在源代码集级配置.

默认值: `false`

#### reportUndocumented

是否对可见的、无文档的声明输出警告,
这是指经过 `documentedVisibilities` 和其他过滤器过滤之后, 需要输出文档, 但没有 KDocs 的声明.

这个设置可以与 `failOnWarning` 选项配合工作.

这个选项可以在源代码集级配置.

默认值: `false`

#### documentedVisibilities

应该生成文档的可见度标识符集合.

如果你想要对这个包内的 `protected`/`internal`/`private` 声明生成文档,
以及如果你想要排除 `public` 声明, 只为 internal API 生成文档,
这个选项可以很有用.

这个选项可以在源代码集级配置.

默认值: `DokkaConfiguration.Visibility.PUBLIC`

### 外部文档链接配置

`externalDocumentationLink` 配置块可以创建链接, 指向你的依赖项的外部文档. 

例如, 如果你使用来自 `kotlinx.serialization` 的类型, 默认情况下,
在你的文档中这些类型不是可点击的链接, 因为无法解析这些类型.
但是, 由于 `kotlinx.serialization` 的 API 参考文档是使用 Dokka 构建的,
而且 [发布到了 kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/),
因此你可以对它配置外部文档链接.
然后就可以让 Dokka 对来自这个库的类型生成链接, 让它们成功的解析, 并在文档中成为可点击的链接.

默认情况下, 已经配置了对 Kotlin 标准库, JDK, Android SDK 和 AndroidX 的外部文档链接.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

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

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

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

</div>
</div>

#### url

链接到的文档的根 URL. 最末尾 **必须** 包含斜线.

Dokka 会尽量对给定的 URL 自动寻找 `package-list`, 并将声明链接到一起.

如果自动解析失败, 或者如果你想要使用本地缓存的文件, 请考虑设置 `packageListUrl` 选项.

#### packageListUrl

`package-list` 的确切位置. 这是对 Dokka 自动解析的一个替代手段.

包列表包含关于文档和项目自身的信息, 例如模块和包的名称.

也可以使用本地缓存的文件, 以避免发生网络访问.

### 完整的配置

下面的例子中, 你可以看到同时使用了所有的配置选项.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

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

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

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

</div>
</div>
