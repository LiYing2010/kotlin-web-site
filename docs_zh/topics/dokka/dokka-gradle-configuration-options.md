[//]: # (title: Dokka Gradle 配置选项)

Dokka 有很多配置选项, 可以自定义你和读者的体验.

下面是每个配置部分的详细说明, 以及一些示例.
你也可以找到一个使用了 [所有配置选项](#complete-configuration) 的示例.

关于在单项目和多项目构建中应用配置代码块,
详情请参见 [配置示例](dokka-gradle.md#configuration-examples).

### 一般配置 {id="general-configuration"}

下面是 Dokka Gradle plugin 一般配置的示例:

* 使用顶层的 `dokka {}` DSL 配置.
* 在 DGP 中, 可以在 `dokkaPublications{}` 代码块中声明 Dokka 的发布配置.
* 默认发布格式为 [`html`](dokka-html.md) 和 [`javadoc`](dokka-javadoc.md).

* `build.gradle.kts` 文件的语法与通常的 `.kt` 文件 (例如用于 Kotlin 自定义 plugin 的文件) 不同,
  因为 Gradle 的 Kotlin DSL 使用类型安全的访问器.

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    dokkaPublications.html {
        moduleName.set(project.name)
        moduleVersion.set(project.version.toString())
        // HTML 文档的标准输出目录
        outputDirectory.set(layout.buildDirectory.dir("dokka/html"))
        failOnWarning.set(false)
        suppressInheritedMembers.set(false)
        suppressObviousFunctions.set(true)
        offlineMode.set(false)
        includes.from("packages.md", "extra.md")

        // 附加文件的输出目录
        // 当你想要修改输出目录, 并包含附加文件时,
        // 请使用这个代码块替代标准的配置
        outputDirectory.set(rootDir.resolve("docs/api/0.x"))

        // 使用 fileTree 添加多个文件
        includes.from(
            fileTree("docs") {
                include("**/*.md")
            }
        )
    }
}
```

关于处理文件, 详情请参见 [Gradle 文档](https://docs.gradle.org/current/userguide/working_with_files.html#sec:file_trees).

</tab>
<tab title="Kotlin custom plugin" group-key="kotlin custom">

```kotlin
// CustomPlugin.kt

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.jetbrains.dokka.gradle.DokkaExtension

abstract class CustomPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.plugins.apply("org.jetbrains.dokka")

        project.extensions.configure(DokkaExtension::class.java) { dokka ->

            dokka.moduleName.set(project.name)
            dokka.moduleVersion.set(project.version.toString())

            dokka.dokkaPublications.named("html") { publication ->
                // HTML 文档的标准输出目录
                publication.outputDirectory.set(project.layout.buildDirectory.dir("dokka/html"))
                publication.failOnWarning.set(true)
                publication.suppressInheritedMembers.set(true)
                publication.offlineMode.set(false)
                publication.suppressObviousFunctions.set(true)
                publication.includes.from("packages.md", "extra.md")

                // 附加文件的输出目录
                // 当你想要修改输出目录, 并包含附加文件时,
                // 请使用这个代码块替代标准的配置
                html.outputDirectory.set(project.rootDir.resolve("docs/api/0.x"))
            }
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokka {
    dokkaPublications {
        html {
            // 设置模块的一般信息
            moduleName.set(project.name)
            moduleVersion.set(project.version.toString())

            // HTML 文档的标准输出目录
            outputDirectory.set(layout.buildDirectory.dir("dokka/html"))

            // Dokka 核心选项
            failOnWarning.set(false)
            suppressInheritedMembers.set(false)
            suppressObviousFunctions.set(true)
            offlineMode.set(false)
            includes.from(files("packages.md", "extra.md"))

            // 附加文件的输出目录
            // 当你想要修改输出目录, 并包含附加文件时,
            // 请使用这个代码块替代标准的配置
            outputDirectory.set(file("$rootDir/docs/api/0.x"))
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="moduleName">
        <p>
           项目文档的显示名称. 这个名称会用于目录, 导航, 标题和日志消息中.
           在多项目构建中, 每个子项目的 <code>moduleName</code>
           在聚合文档中用作其章节标题.
        </p>
        <p>默认值: Gradle 项目名称</p>
    </def>
    <def title="moduleVersion">
        <p>
            在生成的文档中显示的子项目版本.
            在单项目构建中, 它用作项目版本.
            在多项目构建中, 聚合文档时会使用每个子项目的 <code>moduleVersion</code>.
        </p>
        <p>默认值: Gradle 项目版本</p>
    </def>
    <def title="outputDirectory">
        <p>生成文档的存储目录.</p>
        <p>这个设置适用于 <code>dokkaGenerate</code> task 生成的所有文档格式 (HTML, Javadoc 等等).</p>
        <p>默认值: <code>build/dokka/html</code></p>
        <p><b>附加文件的输出目录</b></p>
        <p>你可以为单项目构建和多项目构建指定输出目录, 并包含附加文件.
           对于多项目构建, 请在根项目的配置中设置输出目录, 并包含附加文件.
        </p>
    </def>
    <def title="failOnWarning">
        <p>
            决定 Dokka 在文档生成过程中出现警告时, 是否应该使构建失败.
            进程首先会等待所有的错误和警告输出完毕.
        </p>
        <p>这个设置可以与 <code>reportUndocumented</code> 选项配合工作.</p>
        <p>默认值: <code>false</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>是否禁止输出在指定的类中继承得到的而且没有显式覆盖的成员.</p>
        <p>
            注意:
            这个选项可以禁止输出 <code>equals</code>, <code>hashCode</code>, <code>toString</code> 之类的函数,
            但不能禁止输出 <code>dataClass.componentN</code> 和 <code>dataClass.copy</code> 之类合成函数.
            对于合成函数, 请使用 <code>suppressObviousFunctions</code> 选项.
        </p>
        <p>默认值: <code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>是否禁止输出那些显而易见的函数.</p>
        <p>
            满足以下条件的函数, 会被认为是显而易见的函数:</p>
            <list>
                <li>
                    继承自 <code>kotlin.Any</code>, <code>Kotlin.Enum</code>, <code>java.lang.Object</code> 或
                    <code>java.lang.Enum</code>, 例如 <code>equals</code>, <code>hashCode</code>, <code>toString</code>.
                </li>
                <li>
                    合成(由编译器生成的)函数, 而且没有任何文档, 例如
                    <code>dataClass.componentN</code> 或 <code>dataClass.copy</code>.
                </li>
            </list>
        <p>默认值: <code>true</code></p>
    </def>
    <def title="offlineMode">
        <p>是否通过你的网络来解析远程的文件和链接.</p>
        <p>
            包括用来生成外部文档链接的包列表.
            例如, 可以让来自标准库的类成为文档中可以点击的链接.
        </p>
        <p>
            将这个设置为 <code>true</code>, 某些情况下可以显著提高构建速度, 但也会降低用户体验. 
            例如, 可能无法解析来自你的依赖项的类和成员的链接, 包括标准库.
        </p>
        <p>注意: 你可以将已取得的文件缓存到本地, 并通过本地路径提供给 Dokka.
           请参见 <code><a href="#external-documentation-links-configuration">externalDocumentationLinks</a></code> 部分.</p>
        <p>默认值: <code>false</code></p>
    </def>
     <def title="includes">
        <p>
            包含
            <a href="dokka-module-and-package-docs.md">子项目和包文档</a> 的 Markdown 文件列表.
            这些 Markdown 文件必须符合 <a href="dokka-module-and-package-docs.md#file-format"> 需要的格式</a>.
        </p>
        <p>指定的文件的内容会被解析, 并嵌入到文档内, 作为子项目和包的描述文档.</p>
        <p>
            请参见 <a href="https://github.com/Kotlin/dokka/blob/master/examples/gradle-v2/basic-gradle-example/build.gradle.kts">Dokka Gradle 示例</a>,
            了解它的样子以及使用方法.
        </p>
    </def>
</deflist>

### 源代码集配置 {id="source-set-configuration"}

Dokka 可以为
[Kotlin 源代码集](multiplatform-discover-project.md#source-sets) 配置一些选项:

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    // ...
    // 一般配置部分
    // ...

    // 源代码集配置
    dokkaSourceSets {
        // 示例: 专用于 'linux' 源代码集的配置
        named("linux") {
            dependentSourceSets{named("native")}
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(VisibilityModifier.Public)) // 或者 documentedVisibilities(VisibilityModifier.Public)
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            sourceRoots.from(file("src"))
            classpath.from(file("libs/dependency.jar"))
            samples.from("samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                // 源代码链接部分
            }
            perPackageOption {
                // 包选项部分
            }
            externalDocumentationLinks {
                // 外部文档链接部分
            }
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    // ...
    // 一般配置部分
    // ...

    // 源代码集配置
    dokkaSourceSets {
        // 示例: 专用于 'linux' 源代码集的配置
        named("linux") {
            dependentSourceSets { named("native") }
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([VisibilityModifier.Public] as Set) // 或者 documentedVisibilities(VisibilityModifier.Public)
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            sourceRoots.from(file("src"))
            classpath.from(file("libs/dependency.jar"))
            samples.from("samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                // 源代码链接部分
            }
            perPackageOption {
                // 包选项部分
            }
            externalDocumentationLinks {
                // 外部文档链接部分
            }
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="suppress">
        <p>生成文档时, 是否应该跳过这个源代码集.</p>
        <p>默认值: <code>false</code></p>
    </def>
    <def title="displayName">
        <p>用来引用这个源代码集的显示名称.</p>
        <p>
            这个名称在外部用途使用(例如, 源代码集名称会显示给文档读者),
            也在内部使用(例如, 用于 <code>reportUndocumented</code> 的日志信息).
        </p>
        <p>默认情况下, 这个值根据 Kotlin Gradle plugin 提供的信息推断得到.</p>
    </def>
    <def title="documentedVisibilities">
        <p>定义 Dokka 应该在生成的文档中包含哪些可见度修饰符.</p>
        <p>
            如果你想要对 <code>protected</code>, <code>internal</code> 和 <code>private</code> 声明生成文档,
            以及如果你想要排除 <code>public</code> 声明, 只为 internal API 生成文档, 请使用这个选项.
        </p>
        <p>
            此外, 你还可以使用 Dokka 的
            <a href="https://github.com/Kotlin/dokka/blob/v2.2.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt"><code>documentedVisibilities()</code> 函数</a>
            来添加需要生成文档的可见度.
        </p>
        <p>这个选项可以为每个单独的包配置.</p>
        <p>默认值: <code>VisibilityModifier.Public</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否对可见的, 无文档的声明输出警告,
            这是指经过 <code>documentedVisibilities</code> 和其他过滤器过滤之后, 需要输出文档, 但没有 KDocs 的声明.
        </p>
        <p>这个设置可以与 <code>failOnWarning</code> 选项配合工作.</p>
        <p>这个选项可以为每个单独的包配置.</p>
        <p>默认值: <code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            是否跳过经各种过滤器过滤之后不包含可见声明的包.
        </p>
        <p>
            例如, 如果 <code>skipDeprecated</code> 设置为 <code>true</code>,
            而且你的包中只包含已废弃的声明, 那么这个包会被认为是空的.
        </p>
        <p>默认值: <code>true</code></p>
    </def>
    <def title="skipDeprecated">
        <p>是否对标注了 <code>@Deprecated</code> 注解的声明生成文档.</p>
        <p>这个选项可以为每个单独的包配置.</p>
        <p>默认值: <code>false</code></p>
    </def>
    <def title="suppressGeneratedFiles">
        <p>是否对生成的文件生成文档.</p>
        <p>
            生成的文件预期存在于 <code>{project}/{buildDir}/generated</code> 目录下.
        </p>
        <p>
            如果设置为 <code>true</code>, 效果等于将这个目录中的所有文件添加到
            <code>suppressedFiles</code> 选项中, 然后你可以手动配置它.
        </p>
        <p>默认值: <code>true</code></p>
    </def>
    <def title="suppressAnnotatedWith">
        <p>注解的完全限定名称 (Fully Qualified Name, FQN) 列表, 用来压制带有这些注解的声明.</p>
        <p>
            对于带有这些注解之一的任何声明, 都不会生成文档.
        </p>
    </def>
    <def title="jdkVersion">
        <p>在为 Java 类型生成外部文档链接时使用的 JDK 版本.</p>
        <p>
            例如, 如果你在某些 public 声明的签名中使用了 <code>java.util.UUID</code>,
            而且这个选项设置为 <code>8</code>, Dokka 会为它生成一个指向
            <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadocs</a> 的外部文档链接.
        </p>
        <p>默认值: `8`</p>
    </def>
    <def title="languageVersion">
        <p>
            设置代码分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            环境时使用的 <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin 语言版本</a>.
        </p>
        <p>默认情况下, 会使用 Dokka 的内嵌编译器所能够使用的最新的语言版本.</p>
    </def>
    <def title="apiVersion">
        <p>
            设置代码分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            环境时使用的 <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin API 版本</a>.
        </p>
        <p>默认情况下, 从 <code>languageVersion</code> 推断得到.</p>
    </def>
    <def title="sourceRoots">
        <p>
            需要分析并生成文档的源代码根目录.
            允许的输入是目录和单独的 <code>.kt</code> 和 <code>.java</code> 文件.
        </p>
        <p>默认情况下, 源代码根目录根据 Kotlin Gradle plugin 提供的信息推断得到.</p>
    </def>
    <def title="classpath">
        <p>用于代码分析和交互式示例的类路径.</p>
        <p>如果来自依赖项的某些类型无法自动的解析/查找, 这个选项会很有用.</p>
        <p>这个选项可以接受 <code>.jar</code> 和 <code>.klib</code> 文件.</p>
        <p>默认情况下, 类路径根据 Kotlin Gradle plugin 提供的信息推断得到.</p>
    </def>
    <def title="samples">
        <p>
            目录或文件的列表, 其中包含通过
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> KDoc 标签引用的示例函数.
        </p>
    </def>
</deflist>

### 源代码链接配置 {id="source-link-configuration"}

配置源代码链接, 帮助读者在远程仓库中找到每个声明的源代码.
请使用 `dokkaSourceSets.main {}` 代码块进行这个配置.

`sourceLinks {}` 配置代码块可以为每个签名添加一个 `source` 链接, 指向带有特定行号的 `remoteUrl`.
行号可以通过设置 `remoteLineSuffix` 来配置.

相关的示例请参见 `kotlinx.coroutines` 中
[`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html)
函数的文档.

`build.gradle.kts` 文件的语法与通常的 `.kt` 文件 (例如用于自定义 Gradle plugin 的文件) 不同,
因为 Gradle 的 Kotlin DSL 使用类型安全的访问器:

<tabs group="dokka-configuration">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
// build.gradle.kts

dokka {
    dokkaSourceSets.main {
        sourceLink {
            localDirectory.set(file("src/main/kotlin"))
            remoteUrl("https://github.com/your-repo")
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
<tab title="Kotlin custom plugin" group-key="kotlin custom">

```kotlin
// CustomPlugin.kt

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.jetbrains.dokka.gradle.DokkaExtension

abstract class CustomPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.plugins.apply("org.jetbrains.dokka")
        project.extensions.configure(DokkaExtension::class.java) { dokka ->
            dokka.dokkaSourceSets.named("main") { dss ->
                dss.includes.from("README.md")
                dss.sourceLink {
                    it.localDirectory.set(project.file("src/main/kotlin"))
                    it.remoteUrl("https://example.com/src")
                    it.remoteLineSuffix.set("#L")
                }
            }
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
dokka {
    dokkaSourceSets {
        main {
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

<deflist collapsible="true">
    <def title="localDirectory">
        <p>
            本地源代码目录的路径. 必须是从当前项目根目录开始的相对路径.
        </p>
    </def>
    <def title="remoteUrl">
        <p>
            可以由文档读者访问的源代码托管服务 URL,
            例如 GitHub, GitLab, Bitbucket, 或任何为源文件提供稳定 URL 的托管服务.
            这个 URL 用来生成声明的源代码链接.
        </p>
    </def>
    <def title="remoteLineSuffix">
        <p>
            向 URL 添加的源代码行数后缀. 这样可以帮助读者, 不仅能够导航到文件, 而且是声明所在的确定的行数.
        </p>
        <p>
            行数本身会添加到后缀之后. 例如,
            如果这个选项设置为 <code>#L</code>, 行数是 10, 那么最后的的 URL 后缀会是<code>#L10</code>.
        </p>
        <p>
            各种常用的源代码托管服务的行数后缀是:</p>
            <list>
                <li>GitHub: <code>#L</code></li>
                <li>GitLab: <code>#L</code></li>
                <li>Bitbucket: <code>#lines-</code></li>
            </list>
        <p>默认值: <code>#L</code></p>
    </def>
</deflist>

### 包选项 {id="package-options"}

`perPackageOption` 配置代码块, 可以对指定的包设置一些选项, 包通过 `matchingRegex` 来匹配:

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    dokkaPublications.html {
        dokkaSourceSets.configureEach {
            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set(setOf(VisibilityModifier.Public)) // 或者 documentedVisibilities(VisibilityModifier.Public)
            }
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    dokkaPublications {
        html {
            dokkaSourceSets.configureEach {
                perPackageOption {
                    matchingRegex.set(".*api.*")
                    suppress.set(false)
                    skipDeprecated.set(false)
                    reportUndocumented.set(false)
                    documentedVisibilities.set([VisibilityModifier.Public] as Set)
                }
            }
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="matchingRegex">
        <p>用来匹配包的正规表达式.</p>
        <p>默认值: <code>.*</code></p>
    </def>
    <def title="suppress">
        <p>在生成文档时, 是否应该跳过这个包.</p>
        <p>默认值: <code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p>是否对标注了 <code>@Deprecated</code> 注解的声明生成文档.</p>
        <p>这个选项可以在源代码集级配置.</p>
        <p>默认值: <code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否对可见的, 无文档的声明输出警告, 这是指经过 <code>documentedVisibilities</code> 和其他过滤器过滤之后,
            需要输出文档, 但没有 KDocs 的声明.
        </p>
        <p>这个设置与 <code>failOnWarning</code> 选项配合工作.</p>
        <p>这个选项可以在源代码集级配置.</p>
        <p>默认值: <code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>定义 Dokka 应该在生成的文档中包含哪些可见度修饰符.</p>
        <p>
            如果你想要对这个包内的 <code>protected</code>, <code>internal</code> 和 <code>private</code>
            声明生成文档, 以及如果你想要排除 <code>public</code> 声明, 只为 internal API 生成文档, 请使用这个选项.
        </p>
        <p>
            此外, 你还可以使用 Dokka 的
            <a href="https://github.com/Kotlin/dokka/blob/v2.0.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt#L14-L16"><code>documentedVisibilities()</code> 函数</a>
            来添加需要生成文档的可见度.
        </p>
        <p>这个选项可以在源代码集级配置.</p>
        <p>默认值: <code>VisibilityModifier.Public</code></p>
    </def>
</deflist>

### 外部文档链接配置 {id="external-documentation-links-configuration"}

`externalDocumentationLinks {}` 代码块可以创建链接, 指向你的依赖项的外部文档.

例如, 如果你使用来自 `kotlinx.serialization` 的类型, 默认情况下它们在你的文档中是不可点击的, 就像未解析的一样.
但是, 由于 `kotlinx.serialization` 的 API 参考文档是由 Dokka 构建的,
并且 [发布在 kotlinlang.org 上](https://kotlinlang.org/api/kotlinx.serialization/),
因此你可以为它配置外部文档链接. 这样, Dokka 可以为来自这个库的类型生成链接, 使它们能够成功解析, 并且可以点击.

默认情况下, 已配置了对 Kotlin 标准库, JDK, Android SDK, 以及 AndroidX 的外部文档链接.

请使用 `register()` 方法, 注册外部文档链接, 来定义每个链接.
`externalDocumentationLinks` API 使用这个方法, 与 Gradle DSL 规范保持一致:

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
dokka {
    dokkaSourceSets.configureEach {
        externalDocumentationLinks.register("example-docs") {
            url("https://example.com/docs/")
            packageListUrl("https://example.com/docs/package-list")
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
dokka {
    dokkaSourceSets.configureEach {
        externalDocumentationLinks.register("example-docs") {
            url.set(new URI("https://example.com/docs/"))
            packageListUrl.set(new URI("https://example.com/docs/package-list"))
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="url">
        <p>链接到的文档的根 URL. 末尾 <b>必须</b> 包含斜线.</p>
        <p>
            Dokka 会尽量对给定的 URL 自动寻找 <code>package-list</code>, 并将声明链接到一起.
        </p>
        <p>
            如果自动解析失败, 或者如果你想要使用本地缓存的文件,
            请考虑设置 <code>packageListUrl</code> 选项.
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code> 的确切位置. 这是对 Dokka 自动解析的一个替代手段.
        </p>
        <p>
            包列表包含关于文档和项目自身的信息, 例如子项目和包的名称.
        </p>
        <p>也可以使用本地缓存的文件, 以避免发生网络访问.</p>
    </def>
</deflist>

### 完整的配置 {id="complete-configuration"}

下面是同时使用了所有配置选项的示例:

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    dokkaPublications.html {
        moduleName.set(project.name)
        moduleVersion.set(project.version.toString())
        outputDirectory.set(layout.buildDirectory.dir("dokka/html"))
        failOnWarning.set(false)
        suppressInheritedMembers.set(false)
        suppressObviousFunctions.set(true)
        offlineMode.set(false)
        includes.from("packages.md", "extra.md")
   }

    dokkaSourceSets {
        // 示例: 专用于 'linux' 源代码集的配置
        named("linux") {
            dependentSourceSets{named("native")}
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(VisibilityModifier.Public)) // 或者 documentedVisibilities(VisibilityModifier.Public)
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            sourceRoots.from(file("src"))
            classpath.from(file("libs/dependency.jar"))
            samples.from("samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl("https://example.com/src")
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLinks {
                url = URL("https://example.com/docs/")
                packageListUrl = File("/path/to/package-list").toURI().toURL()
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set(
                    setOf(
                        VisibilityModifier.Public,
                        VisibilityModifier.Private,
                        VisibilityModifier.Protected,
                        VisibilityModifier.Internal,
                        VisibilityModifier.Package
                    )
                )
            }
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokka {
    dokkaPublications {
        html {
            moduleName.set(project.name)
            moduleVersion.set(project.version.toString())
            outputDirectory.set(layout.buildDirectory.dir("dokka/html"))
            failOnWarning.set(false)
            suppressInheritedMembers.set(false)
            suppressObviousFunctions.set(true)
            offlineMode.set(false)
            includes.from("packages.md", "extra.md")
        }
    }

    dokkaSourceSets {
        // 示例: 专用于 'linux' 源代码集的配置
        named("linux") {
            dependentSourceSets { named("native") }
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([VisibilityModifier.Public] as Set)
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            sourceRoots.from(file("src"))
            classpath.from(file("libs/dependency.jar"))
            samples.from("samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl.set(new URI("https://example.com/src"))
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLinks {
                url.set(new URI("https://example.com/docs/"))
                packageListUrl.set(new File("/path/to/package-list").toURI().toURL())
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set([
                        VisibilityModifier.Public,
                        VisibilityModifier.Private,
                        VisibilityModifier.Protected,
                        VisibilityModifier.Internal,
                        VisibilityModifier.Package
                ] as Set)
            }
        }
    }
}
```

</tab>
</tabs>
