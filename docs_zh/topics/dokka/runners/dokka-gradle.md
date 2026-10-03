[//]: # (title: Gradle)

> 这篇向导适用于 Dokka Gradle plugin (DGP) v2 模式. DGP v1 模式不再支持.
> 要从 v1 模式升级到 v2 模式, 请遵循 [迁移向导](dokka-migration.md).
>
{style="note"}

要为基于 Gradle 的项目生成文档, 你可以使用
[Gradle plugin for Dokka](https://plugins.gradle.org/plugin/org.jetbrains.dokka).

Dokka Gradle plugin (DGP) 对你的项目进行了基本的自动配置,
包含用于生成文档的 [Gradle task](#generate-documentation),
并提供 [配置选项](dokka-gradle-configuration-options.md) 用来定制输出.

你可以访问我们的
[Gradle 示例项目](https://github.com/Kotlin/dokka/tree/2.0.0/examples/gradle-v2),
实际接触一下 Dokka, 学习如何对各种项目进行配置.

## 支持的版本 {id="supported-versions"}

请确认你的项目满足最低版本要求:

| **工具**                                                                             | **版本**    |
|------------------------------------------------------------------------------------|-----------|
| [Gradle](https://docs.gradle.org/current/userguide/upgrading_version_8.html)       | 7.6 或更高版本 |
| [Android Gradle plugin](https://developer.android.com/build/agp-upgrade-assistant) | 7.0 或更高版本 |
| [Kotlin Gradle plugin](gradle-configure-project.md)                                | 1.9 或更高版本 |

## 应用 Dokka {id="apply-dokka"}

应用 Gradle plugin for Dokka 时, 推荐的方式是使用
[plugins 代码块](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block).
请在你的项目的 `build.gradle.kts` 文件的 `plugins {}` 代码块中添加:

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

</tab>
</tabs>

在对多项目构建生成文档时, 你需要对想要生成文档的每个子项目明确的应用这个 plugin.
可以直接在每个子项目中配置 Dokka, 或者使用约定(convention) plugin 在子项目间共用 Dokka 配置.
详情请参见如何配置 [单项目](#single-project-configuration) 和 [多项目](#multi-project-configuration) 构建.

> * 在内部, Dokka 使用 [Kotlin Gradle plugin](gradle-configure-project.md#apply-the-plugin)
> 来自动配置需要生成文档的 [源代码集](multiplatform-discover-project.md#source-sets).
> 请确认应用了 Kotlin Gradle Plugin, 或者手动的 [配置源代码集](dokka-gradle-configuration-options.md#source-set-configuration).
>
> * 如果你在 [预编译的脚本 plugin](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:precompiled_plugins)
> 中使用 Dokka,
> 请将 [Kotlin Gradle plugin](gradle-configure-project.md#apply-the-plugin)
> 添加为依赖项, 以确保它能够正常工作.
>
{style="tip"}

## 启用构建缓存和配置缓存 {id="enable-build-cache-and-configuration-cache"}

DGP 支持 Gradle 构建缓存和配置缓存, 可以改善构建性能.

* 要启用构建缓存, 请遵循 [Gradle 构建缓存文档](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_enable) 中的说明.
* 要启用配置缓存, 请遵循 [Gradle 配置缓存文档](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage:enable) 中的说明.

## 生成文档 {id="generate-documentation"}

Dokka Gradle plugin 内置了 [HTML](dokka-html.md) 和 [Javadoc](dokka-javadoc.md) 输出格式.

使用以下 Gradle task 来生成文档:

```shell
./gradlew :dokkaGenerate
```

`dokkaGenerate` Gradle task 的关键行为是:

* 这个 task 能够对 [单项目](#single-project-configuration) 和 [多项目](#multi-project-configuration) 构建生成文档.
* 默认情况下, 文档输出格式为 HTML.
  你也可以 [添加适当的 plugin](#configure-documentation-output-format), 生成 Javadoc 格式, 或同时生成 HTML 和 Javadoc 格式.
* 对单项目和多项目构建, 生成的文档都会自动放置在 `build/dokka/html` 目录中.
  你可以 [修改位置 (`outputDirectory`)](dokka-gradle-configuration-options.md#general-configuration).

### 配置文档输出格式 {id="configure-documentation-output-format"}

> Javadoc 输出格式处于 [Alpha 版](components-stability.md#stability-levels-explained).
> 使用时你可能会遇到 bug 和迁移问题.
> 也不能保证与接受 Javadoc 作为输入的工具成功集成.
> 请自行承担使用风险.
>
{style="warning"}

你可以选择生成 API 文档时使用 HTML 格式, Javadoc 格式, 或同时使用两种格式:

1. 在你的项目的 `build.gradle.kts` 文件的 `plugins {}` 代码块中, 放置对应的 plugin `id`:

   ```kotlin
   plugins {
       // 生成 HTML 文档
       id("org.jetbrains.dokka") version "%dokkaVersion%"

       // 生成 Javadoc 文档
       id("org.jetbrains.dokka-javadoc") version "%dokkaVersion%"

       // 同时保留两个 plugin id 会生成两种格式
   }
   ```

2. 运行对应的 Gradle task.

   以下是每种格式对应的 plugin `id` 和 Gradle task 列表:

   |             | **HTML**                                  | **Javadoc**                                  | **两者都生成**                   |
   |-------------|-------------------------------------------|----------------------------------------------|---------------------------------|
   | Plugin `id` | `id("org.jetbrains.dokka")`               | `id("org.jetbrains.dokka-javadoc")`          | 同时使用 HTML 和 Javadoc plugin   |
   | Gradle task | `./gradlew :dokkaGeneratePublicationHtml` | `./gradlew :dokkaGeneratePublicationJavadoc` | `./gradlew :dokkaGenerate`      |

    > * `dokkaGenerate` task 会根据已应用的 plugin, 生成所有可用格式的文档.
    > 如果同时应用了 HTML 和 Javadoc plugin,
    > 你可以选择运行 `dokkaGeneratePublicationHtml` task, 只生成 HTML,
    > 或运行 `dokkaGeneratePublicationJavadoc` task, 只生成 Javadoc.
    >
    {style="tip"}

如果你使用 IntelliJ IDEA, 可能会看到 `dokkaGenerateHtml` Gradle task.
这个 task 只是 `dokkaGeneratePublicationHtml` 的别名. 两个 task 执行完全相同的操作.

### 在多项目构建中聚合文档输出 {id="aggregate-documentation-output-in-multi-project-builds"}

Dokka 可以将来自多个子项目的文档聚合到单个输出或发布中.

在聚合文档之前, 你必须对需要生成文档的所有子项目
[应用 Dokka plugin](#apply-the-convention-plugin-to-your-subprojects).

要从多个子项目聚合文档, 请在根项目的 `build.gradle.kts` 文件中添加 `dependencies {}` 代码块:

```kotlin
dependencies {
    dokka(project(":childProjectA:"))
    dokka(project(":childProjectB:"))
}
```

假设项目结构如下:

```text
.
└── parentProject/
    ├── childProjectA/
    │   └── demo/
    │       └── ChildProjectAClass.kt
    └── childProjectB/
        └── demo/
            └── ChildProjectBClass.kt
```

生成的文档将聚合如下:

![dokkaHtmlMultiModule task 的输出截图](dokkaHtmlMultiModule-example.png){width=600}

详情请参见我们的 [多项目示例](https://github.com/Kotlin/dokka/tree/2.0.0/examples/gradle-v2/multimodule-example).

#### 聚合文档的目录 {id="directory-of-aggregated-documentation"}

当 DGP 聚合子项目时, 每个子项目在聚合文档中都有自己的子目录.
DGP 保留完整的项目结构, 确保每个子项目有唯一的目录.

例如, 一个项目在 `:turbo-lib` 中进行聚合, 并且有内嵌的子项目 `:turbo-lib:maths`,
生成的文档放置在:

```text
turbo-lib/build/dokka/html/turbo-lib/maths/
```

你可以手动指定子项目目录, 取消这个行为.
请在每个子项目的 `build.gradle.kts` 文件中添加以下配置:

```kotlin
// /turbo-lib/maths/build.gradle.kts

plugins {
    id("org.jetbrains.dokka")
}

dokka {
    // 覆盖子项目目录
    modulePath.set("maths")
}
```

这个配置会将 `:turbo-lib:maths` 模块的生成文档, 改为输出到 `turbo-lib/build/dokka/html/maths/`.

## 构建 javadoc.jar {id="build-javadoc-jar"}

如果你想要将你的库发布到仓库, 你可能需要提供一个 `javadoc.jar` 文件, 其中包含你的库的 API 参考文档.

例如, 如果你想要发布到
[Maven Central](https://central.sonatype.org/),
你 [必须](https://central.sonatype.org/publish/requirements/)
和你的项目一起提供一个 `javadoc.jar`. 但是, 并不是所有的仓库都有这样的规则.

Gradle plugin for Dokka 没有提供任何方式来直接完成这个任务, 但可以通过自定义的 Gradle task 实现.
下面的示例中, 一个 task 使用 [HTML](dokka-html.md) 格式生成文档, 另一个使用 [Javadoc](dokka-javadoc.md) 格式:

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
// 生成 HTML 格式文档
val dokkaHtmlJar by tasks.registering(Jar::class) {
    description = "A HTML Documentation JAR containing Dokka HTML"
    from(tasks.dokkaGeneratePublicationHtml.flatMap { it.outputDirectory })
    archiveClassifier.set("html-doc")
}

// 生成 Javadoc 格式文档
val dokkaJavadocJar by tasks.registering(Jar::class) {
    description = "A Javadoc JAR containing Dokka Javadoc"
    from(tasks.dokkaGeneratePublicationJavadoc.flatMap { it.outputDirectory })
    archiveClassifier.set("javadoc")
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
// 生成 HTML 格式文档
tasks.register('dokkaHtmlJar', Jar) {
    description = 'A HTML Documentation JAR containing Dokka HTML'
    from(tasks.named('dokkaGeneratePublicationHtml').flatMap { it.outputDirectory })
    archiveClassifier.set('html-doc')
}

// 生成 Javadoc 格式文档
tasks.register('dokkaJavadocJar', Jar) {
    description = 'A Javadoc JAR containing Dokka Javadoc'
    from(tasks.named('dokkaGeneratePublicationJavadoc').flatMap { it.outputDirectory })
    archiveClassifier.set('javadoc')
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
但是, [配置选项](dokka-gradle-configuration-options.md) 本身是相同的, 无论你的项目类型如何.

对于简单的项目, 在项目的根目录下包含单个 `build.gradle.kts` 或 `build.gradle` 文件,
请参见 [单项目配置](#single-project-configuration).

对更加复杂的构建, 包含子项目, 以及多个下级的 `build.gradle.kts` 或 `build.gradle` 文件,
请参见 [多项目配置](#multi-project-configuration).

### 单项目配置 {id="single-project-configuration"}

单项目构建通常只有在项目的根目录下的一个 `build.gradle.kts` 或 `build.gradle` 文件.
它们可以是单平台或跨平台, 通常具有以下结构:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

单平台项目:

```text
.
├── build.gradle.kts
└── src/
    └── main/
        └── kotlin/
            └── HelloWorld.kt
```

跨平台项目:

```text
.
├── build.gradle.kts
└── src/
    ├── commonMain/
    │   └── kotlin/
    │       └── Common.kt
    ├── jvmMain/
    │   └── kotlin/
    │       └── JvmUtils.kt
    └── nativeMain/
        └── kotlin/
            └── NativeUtils.kt
```

</tab>
<tab title="Groovy" group-key="groovy">

单平台项目:

```text
.
├── build.gradle
└── src/
    └── main/
        └── kotlin/
            └── HelloWorld.kt
```

跨平台项目:

```text
.
├── build.gradle
└── src/
    ├── commonMain/
    │   └── kotlin/
    │       └── Common.kt
    ├── jvmMain/
    │   └── kotlin/
    │       └── JvmUtils.kt
    └── nativeMain/
        └── kotlin/
            └── NativeUtils.kt
```

</tab>
</tabs>

在你的根目录 `build.gradle.kts` 文件中, 应用 Dokka Gradle plugin, 并使用顶层 `dokka {}` DSL 配置它:

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    dokkaPublications.html {
        moduleName.set("MyProject")
        outputDirectory.set(layout.buildDirectory.dir("documentation/html"))
        includes.from("README.md")
   }

    dokkaSourceSets.main {
        sourceLink {
            localDirectory.set(file("src/main/kotlin"))
            remoteUrl.set(URI("https://github.com/your-repo"))
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

在 `./build.gradle` 中:

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokka {
    dokkaPublications {
        html {
            moduleName.set("MyProject")
            outputDirectory.set(layout.buildDirectory.dir("documentation/html"))
            includes.from("README.md")
        }
    }

    dokkaSourceSets {
        named("main") {
            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl.set(new URI("https://github.com/your-repo"))
                remoteLineSuffix.set("#L")
            }
        }
    }
}
```

</tab>
</tabs>

这个配置将 Dokka 应用到你的项目, 设置文档输出目录, 并定义 main 源代码集.
你可以进一步扩展, 方法是在同一个 `dokka {}` 代码块中添加自定义资源, 可见度过滤器, 或 plugin 配置.
详情请参见 [配置选项](dokka-gradle-configuration-options.md).

### 多项目配置 {id="multi-project-configuration"}

[多项目构建](https://docs.gradle.org/current/userguide/multi_project_builds.html)
通常包含多个内嵌的 `build.gradle.kts` 文件, 结构类似于:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```text
.
├── build.gradle.kts
├── settings.gradle.kts
├── subproject-A/
│   ├── build.gradle.kts
│   └── src/
│       └── main/
│           └── kotlin/
│               └── HelloFromA.kt
└── subproject-B/
    ├── build.gradle.kts
    └── src/
        └── main/
            └── kotlin/
                └── HelloFromB.kt
```

</tab>
<tab title="Groovy" group-key="groovy">

```text
.
├── build.gradle
├── settings.gradle
├── subproject-A/
│   ├── build.gradle
│   └── src/
│       └── main/
│           └── kotlin/
│               └── HelloFromA.kt
└── subproject-B/
    ├── build.gradle
    └── src/
        └── main/
            └── kotlin/
                └── HelloFromB.kt
```

</tab>
</tabs>

单项目和多项目文档共用相同的
[使用顶层 `dokka {}` DSL 的配置模型](#single-project-configuration).

在多项目构建中配置 Dokka 有两种方式:

* **[通过约定(convention) plugin 共用配置](#shared-configuration-via-a-convention-plugin) (推荐方式)**:
  定义约定 plugin, 并将其应用到所有子项目.
  这样可以集中管理你的 Dokka 配置.

* **[手动配置](#manual-configuration)**:
  在每个子项目中应用 Dokka plugin, 并重复编写相同的 `dokka {}` 代码块.
  不需要约定 plugin.

配置子项目之后, 你可以将来自多个子项目的文档聚合到单个输出中.
详情请参见 [在多项目构建中聚合文档输出](#aggregate-documentation-output-in-multi-project-builds).

> 关于多项目示例, 请参见 [Dokka GitHub 代码仓库](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/multimodule-example).
>
{style="tip"}

#### 通过约定(convention) plugin 共用配置 {id="shared-configuration-via-a-convention-plugin"}

按照以下步骤设置约定 plugin, 并将其应用到你的子项目.

##### 设置 buildSrc 目录 {id="set-up-the-buildsrc-directory"}

1. 在你的项目根目录中, 创建一个 `buildSrc` 目录, 其中包含两个文件:

    * `settings.gradle.kts`
    * `build.gradle.kts`

2. 在 `buildSrc/settings.gradle.kts` 文件中, 添加以下代码:

   ```kotlin
   rootProject.name = "buildSrc"
   ```

3. 在 `buildSrc/build.gradle.kts` 文件中, 添加以下代码:

    ```kotlin
    plugins {
        `kotlin-dsl`
    }

    repositories {
        mavenCentral()
        gradlePluginPortal()
    }

    dependencies {
        implementation("org.jetbrains.dokka:dokka-gradle-plugin:%dokkaVersion%")
    }
    ```

##### 设置 Dokka 约定 plugin {id="set-up-the-dokka-convention-plugin"}

设置 `buildSrc` 目录后, 请设置 Dokka 约定 plugin:

1. 创建 `buildSrc/src/main/kotlin/dokka-convention.gradle.kts` 文件,
   托管 [约定 plugin](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins).
2. 在 `dokka-convention.gradle.kts` 文件中, 添加以下代码:

    ```kotlin
    plugins {
        id("org.jetbrains.dokka")
    }

    dokka {
        // 共用配置放在这里
    }
    ```

   你需要在 `dokka {}` 代码块中, 添加所有子项目共用的 Dokka [配置](dokka-gradle-configuration-options.md).
   另外, 不需要指定 Dokka 版本.
   版本已经在 `buildSrc/build.gradle.kts` 文件中设置.

##### 对你的子项目应用约定 plugin {id="apply-the-convention-plugin-to-your-subprojects"}

将 Dokka 约定 plugin 应用到你的子项目, 方法是将它添加到每个子项目的 `build.gradle.kts` 文件:

```kotlin
plugins {
    id("dokka-convention")
}
```

#### 手动配置 {id="manual-configuration"}

如果你的项目不使用约定 plugin, 也可以重用相同的 Dokka 配置模式, 方法是手动将相同的 `dokka {}` 代码块复制到每个子项目中:

1. 在每个子项目的 `build.gradle.kts` 文件中应用 Dokka plugin:

   ```kotlin
   plugins {
       id("org.jetbrains.dokka") version "%dokkaVersion%"
   }
   ```

2. 在每个子项目的 `dokka {}` 代码块中声明共用的配置.
   由于没有约定 plugin 集中管理配置, 你需要在各个子项目中复制任何你想要共用的配置.
   详情请参见 [配置选项](dokka-gradle-configuration-options.md).

#### 父项目配置 {id="parent-project-configuration"}

在多项目构建中, 你可以在根项目中配置适用于整个文档的设置.
包括定义输出格式, 输出目录, 文档子项目名称,
从所有子项目聚合文档, 以及其他 [配置选项](dokka-gradle-configuration-options.md):

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    // 为整个项目设置属性
    dokkaPublications.html {
        moduleName.set("My Project")
        outputDirectory.set(layout.buildDirectory.dir("docs/html"))
        includes.from("README.md")
    }

    dokkaSourceSets.configureEach {
        documentedVisibilities.set(setOf(VisibilityModifier.Public)) // 或 documentedVisibilities(VisibilityModifier.Public)
    }
}

// 聚合子项目文档
dependencies {
    dokka(project(":childProjectA"))
    dokka(project(":childProjectB"))
}
```

此外, 每个子项目如果需要自定义配置, 可以有自己的 `dokka {}` 代码块.
在以下示例中, 子项目应用了 Dokka plugin, 设置自定义子项目名称,
并包含了额外的文档(来自它的 `README.md` 文件):

```kotlin
// subproject/build.gradle.kts
plugins {
    id("org.jetbrains.dokka")
}

dokka {
    dokkaPublications.html {
        moduleName.set("Child Project A")
        includes.from("README.md")
    }
}
```
