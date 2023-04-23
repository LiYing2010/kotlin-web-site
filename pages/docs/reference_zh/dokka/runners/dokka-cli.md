---
type: doc
layout: reference
category: dokka
title: "CLI"
---

# CLI

最终更新: {{ site.data.releases.latestDocDate }}

如果你由于某些原因无法使用 [Gradle](dokka-gradle.html) 或 [Maven](dokka-maven.html) 构建工具,
Dokka 有一个命令行(CLI)运行器用来生成文档.

与 Gradle plugin for Dokka 相比, 它拥有相同甚至更多的能力.
但它更加难于设置, 因为没有自动配置, 尤其是对于跨平台和多模块环境.

## 入门

CLI 运行器作为单独的可执行 artifact 发布到 Maven Central.

你可以在
[mvn 仓库](https://mvnrepository.com/artifact/org.jetbrains.dokka/dokka-cli/{{ site.data.releases.dokkaVersion }}) 找到它,
或者直接浏览
[maven central 仓库目录](https://repo1.maven.org/maven2/org/jetbrains/dokka/dokka-cli/{{ site.data.releases.dokkaVersion }}).

将 `dokka-cli-{{ site.data.releases.dokkaVersion }}.jar` 文件保存到你的计算机,
使用 `-help` 选项运行它, 可以看到所有的配置选项, 以及这些选项的描述:

```bash
java -jar dokka-cli-{{ site.data.releases.dokkaVersion }}.jar -help
```

也可以查看一些嵌套的选项, 例如 `-sourceSet`:

```bash
java -jar dokka-cli-{{ site.data.releases.dokkaVersion }}.jar -sourceSet -help
```

## 生成文档

### 前提条件

由于没有构建工具来管理依赖项, 你必须自己提供依赖项 `.jar` 文件.

对于所有的输出格式, 你所需要的依赖项如下:

| **Group**             | **Artifact**               | **版本**                                | **链接**                                                                                                                                  |
|-----------------------|----------------------------|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `org.jetbrains.dokka` | `dokka-base`               | {{ site.data.releases.dokkaVersion }} | [mvn 仓库](https://mvnrepository.com/artifact/org.jetbrains.dokka/dokka-base/{{ site.data.releases.dokkaVersion }})                       |
| `org.jetbrains.dokka` | `dokka-analysis`           | {{ site.data.releases.dokkaVersion }} | [mvn 仓库](https://mvnrepository.com/artifact/org.jetbrains.dokka/dokka-analysis/{{ site.data.releases.dokkaVersion }})           |
| `org.jetbrains.dokka` | `kotlin-analysis-compiler` | {{ site.data.releases.dokkaVersion }} | [mvn 仓库](https://mvnrepository.com/artifact/org.jetbrains.dokka/kotlin-analysis-compiler/{{ site.data.releases.dokkaVersion }}) |
| `org.jetbrains.dokka` | `kotlin-analysis-intellij` | {{ site.data.releases.dokkaVersion }} | [mvn 仓库](https://mvnrepository.com/artifact/org.jetbrains.dokka/kotlin-analysis-intellij/{{ site.data.releases.dokkaVersion }}) |

对于 [HTML](../formats/dokka-html.html) 输出格式, 你需要的额外的依赖项如下:

| **Group**               | **Artifact**       | **版本** | **链接**                                                                                            |
|-------------------------|--------------------|-------------|---------------------------------------------------------------------------------------------------|
| `org.jetbrains.kotlinx` | `kotlinx-html-jvm` | 0.8.0       | [mvn 仓库](https://mvnrepository.com/artifact/org.jetbrains.kotlinx/kotlinx-html-jvm/0.8.0) |
| `org.freemarker`        | `freemarker`       | 2.3.31      | [mvn 仓库](https://mvnrepository.com/artifact/org.freemarker/freemarker/2.3.31)             |


### 使用命令行选项运行

你可以传递命令行选项来配置 CLI 运行器. 

你至少需要提供以下选项:

* `-pluginsClasspath` - 指向已下载的依赖项的绝对/相对路径列表, 使用分号 `;` 分隔
* `-sourceSet` - 要生成文档的源代码的绝对路径
* `-outputDir` - 文档输出目录的绝对/相对路径 

```bash
java -jar dokka-cli-{{ site.data.releases.dokkaVersion }}.jar \
     -pluginsClasspath "./dokka-base-{{ site.data.releases.dokkaVersion }}.jar;./dokka-analysis-{{ site.data.releases.dokkaVersion }}.jar;./kotlin-analysis-intellij-{{ site.data.releases.dokkaVersion }}.jar;./kotlin-analysis-compiler-{{ site.data.releases.dokkaVersion }}.jar;./kotlinx-html-jvm-0.8.0.jar;./freemarker-2.3.31.jar" \
     -sourceSet "-src /home/myCoolProject/src/main/kotlin" \
     -outputDir "./dokka/html"
```

> 由于存在一个内部的类冲突, 请首先传递 `kotlin-analysis-intellij`, 然后再传递 `kotlin-analysis-compiler`.
> 否则可能出现奇怪的异常, 例如 `NoSuchFieldError`.
{:.note}

执行上面示例中的命令, 会使用 [HTML](../formats/dokka-html.html) 输出格式生成文档.

关于配置的更多详细信息, 请参见 [命令行选项](#command-line-options).

### 使用 JSON 配置运行

可以使用 JSON 来配置 CLI 运行器. 这种情况下, 你需要提供指向 JSON 配置文件的绝对/相对路径, 作为第一个也是唯一一个参数. 
所有其它的配置选项都从 JSON 配置文件解析得到.

```bash
java -jar dokka-cli-{{ site.data.releases.dokkaVersion }}.jar dokka-configuration.json
```

你至少需要以下 JSON 配置文件:

```json
{
  "outputDir": "./dokka/html",
  "sourceSets": [
    {
      "sourceSetID": {
        "scopeId": "moduleName",
        "sourceSetName": "main"
      },
      "sourceRoots": [
        "/home/myCoolProject/src/main/kotlin"
      ]
    }
  ],
  "pluginsClasspath": [
    "./dokka-base-{{ site.data.releases.dokkaVersion }}.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./dokka-analysis-{{ site.data.releases.dokkaVersion }}.jar",
    "./kotlin-analysis-intellij-{{ site.data.releases.dokkaVersion }}.jar",
    "./kotlin-analysis-compiler-{{ site.data.releases.dokkaVersion }}.jar",
    "./freemarker-2.3.31.jar"
  ]
}
```

> 由于存在一个内部的类冲突, 请首先传递 `kotlin-analysis-intellij`, 然后再传递 `kotlin-analysis-compiler`.
> 否则可能出现奇怪的异常, 例如 `NoSuchFieldError`.
{:.note}

更多详情请参见 [JSON 配置选项](#json-configuration).

### 其它输出格式

默认情况下, `dokka-base` artifact 只包含 [HTML](../formats/dokka-html.html) 输出格式.

其他所有输出格式都以 [Dokka plugin](../dokka-plugins.html) 的形式实现.
要使用这些格式, 你需要将它们添加到 plugin classpath.

例如, 如果你想要使用试验性的 [GFM](../formats/dokka-markdown.html#gfm) 输出格式生成文档,
你需要下载 
[gfm-plugin 的 JAR 文件](https://mvnrepository.com/artifact/org.jetbrains.dokka/gfm-plugin/{{ site.data.releases.dokkaVersion }}),
并将它传递给 `pluginsClasspath` 配置选项.

通过命令行选项传递:

```shell
java -jar dokka-cli-{{ site.data.releases.dokkaVersion }}.jar \
     -pluginsClasspath "./dokka-base-{{ site.data.releases.dokkaVersion }}.jar;...;./gfm-plugin-{{ site.data.releases.dokkaVersion }}.jar" \
     ...
```

通过 JSON 配置传递:

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-{{ site.data.releases.dokkaVersion }}.jar",
    "...",
    "./gfm-plugin-{{ site.data.releases.dokkaVersion }}.jar"
  ],
  ...
}
```

通过传递给 `pluginsClasspath` 的 GFM plugin, CLI 运行器会使用 GFM 输出格式生成文档.

更多详情, 请参见 [Markdown](../formats/dokka-markdown.html) 和 [Javadoc](../formats/dokka-javadoc.html#generate-javadoc-documentation) 章节.

## 命令行选项

要查看所有可用的命令行选项列表, 以及它们的详细描述, 请运行:

```bash
java -jar dokka-cli-{{ site.data.releases.dokkaVersion }}.jar -help
```

简单的总结如下:

| 选项                       | 描述                                                                                                                            |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `moduleName`                 | 项目/模块名称.                                                                                                                      |
| `moduleVersion`              | 需要生成文档的版本.                                                                                                                    |
| `outputDir`                  | 输出目录路径, 默认值为 `./dokka`.                                                                                                       |
| `sourceSet`                  | 对 Dokka 源代码集的配置. 包含嵌套的配置选项.                                                                                                   |
| `pluginsConfiguration`       | 对 Dokka plugin 的配置.                                                                                                           |
| `pluginsClasspath`           | Dokka plugin 以及它们的依赖项的 jar 文件列表. 可以接受多个路径, 以分号分隔.                                                                             |
| `offlineMode`                | 是否通过网络来解析远程的文件/链接.                                                                                                            |
| `failOnWarning`              | 如果 Dokka 输出警告或错误, 是否让文档生成任务失败.                                                                                                |
| `delayTemplateSubstitution`  | 是否延迟替换某些元素. 用于多模块项目的增量构建.                                                                                                     |
| `noSuppressObviousFunctions` | 是否禁止输出那些显而易见的函数, 例如继承自 `kotlin.Any` 和 `java.lang.Object` 的函数.                                                                 |
| `includes`                   | 包含模块和包的文档的 Markdown 文件. 可以接受多个值, 以分号分隔.                                                                                       |
| `suppressInheritedMembers`   | 是否禁止输出在指定的类中继承得到的而且没有显式覆盖的成员.                                                                                                 |
| `globalPackageOptions`       | 全局的包配置选项列表, 格式为 `"matchingRegex,-deprecated,-privateApi,+warnUndocumented,+suppress;+visibility:PUBLIC;..."`. 可以接受多个值, 以分号分隔. |
| `globalLinks`                | 全局的外部文档链接, 格式为 `{url}^{packageListUrl}`. 可以接受多个值, 以 `^^` 分隔.                                                                  |
| `globalSrcLink`              | 源代码目录与用于浏览源代码的 Web Service 之间的全局的对应. 可以接受多个路径, 以分号分隔.                                                                         |
| `helpSourceSet`              | 对嵌套的 `-sourceSet` 配置输出帮助信息.                                                                                                   |
| `loggingLevel`               | 日志级别, 可以设置的值: `DEBUG, PROGRESS, INFO, WARN, ERROR`.                                                                          |
| `help, h`                    | 关于使用方法的帮助信息.                                                                                                                  |

### 源代码集选项

要查看嵌套的 `-sourceSet` 配置的命令行选项列表, 请运行:

```bash
java -jar dokka-cli-{{ site.data.releases.dokkaVersion }}.jar -sourceSet -help
```

简单的总结如下:

| 选项                       | 描述                                                                                                                     |
|------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `sourceSetName`              | 源代码集名称.                                                                                                                |
| `displayName`                | 源代码集的显示名称, 这个名称会在内部和外部使用.                                                                                              |
| `classpath`                  | 对示例进行分析和交互时的类路径. 可以接受多个路径, 以分号分隔.                                                                                      |
| `src`                        | 需要分析并生成文档的源代码根目录. 可以接受多个路径, 以分号分隔.                                                                                     |
| `dependentSourceSets`        | 依赖的源代码集名称, 格式为 `moduleName/sourceSetName`. 可以接受多个路径, 以分号分隔.                                                            |
| `samples`                    | 包含示例函数的目录或文件的列表. 可以接受多个路径, 以分号分隔. <anchor name="includes-cli"/>                                                        |
| `includes`                   | 包含 [模块和包文档](../dokka-module-and-package-docs.html) 的 Markdown 文件. 可以接受多个路径, 以分号分隔.                                     |
| `documentedVisibilities`     | 需要生成文档的成员可见度. 可以接受多个值, 以分号分隔. 可以设置的值: `PUBLIC`, `PRIVATE`, `PROTECTED`, `INTERNAL`, `PACKAGE`.                         |
| `reportUndocumented`         | 是否对无文档的声明输出警告.                                                                                                         | 
| `noSkipEmptyPackages`        | 是否对空的包创建页面.                                                                                                            | 
| `skipDeprecated`             | 是否跳过废弃的声明.                                                                                                             | 
| `jdkVersion`                 | 生成 JDK Javadoc 链接时使用的 JDK 版本.                                                                                          |
| `languageVersion`            | 设置代码分析和示例环境时使用的 Kotlin 语言版本.                                                                                             |
| `apiVersion`                 | 设置代码分析和示例环境时使用的 Kotlin API 版本.                                                                                           |
| `noStdlibLink`               | 是否生成指向 Kotlin 标准库的链接.                                                                                                  | 
| `noJdkLink`                  | 是否生成指向 JDK Javadoc 的链接.                                                                                                | 
| `suppressedFiles`            | 需要禁止输出的文件路径. 可以接受多个路径, 以分号分隔.                                                                                          |
| `analysisPlatform`           | 设置代码分析环境时使用的平台.                                                                                                          |
| `perPackageOptions`          | 包源代码集配置列表, 格式为 `matchingRegexp,-deprecated,-privateApi,+warnUndocumented,+suppress;...`. 可以接受多个值, 以分号分隔.               |
| `externalDocumentationLinks` | 外部文档链接, 格式为 `{url}^{packageListUrl}`. 可以接受多个值, 以 `^^` 分隔.                                                              |
| `srcLink`                    | 源代码目录与用于浏览源代码的 Web Service 之间的对应. 可以接受多个路径, 以分号分隔. |

## JSON 配置

下面是对每个配置小节的一些示例和详细解释.
在本章的最后, 你还可以看到一个示例, 它使用了 [所有的配置选项](#complete-configuration).

### 一般配置

```json
{
  "moduleName": "Dokka Example",
  "moduleVersion": null,
  "outputDir": "./build/dokka/html",
  "failOnWarning": false,
  "suppressObviousFunctions": true,
  "suppressInheritedMembers": false,
  "offlineMode": false,
  "includes": [
    "module.md"
  ],
  "sourceLinks":  [
    { "_comment": "参见其它章节" }
  ],
  "perPackageOptions": [
    { "_comment": "参见其它章节" }
  ],
  "externalDocumentationLinks":  [
    { "_comment": "参见其它章节" }
  ],
  "sourceSets": [
    { "_comment": "参见其它章节" }
  ],
  "pluginsClasspath": [
    "./dokka-base-{{ site.data.releases.dokkaVersion }}.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./dokka-analysis-{{ site.data.releases.dokkaVersion }}.jar",
    "./kotlin-analysis-intellij-{{ site.data.releases.dokkaVersion }}.jar",
    "./kotlin-analysis-compiler-{{ site.data.releases.dokkaVersion }}.jar",
    "./freemarker-2.3.31.jar"
  ]
}
```

#### moduleName
用来引用模块的显示名称. 这个名称会用于目录, 导航, 日志, 等等.

默认值: `root`

#### moduleVersion
模块版本.

默认值: 空

#### outputDirectory
文档生成的目录, 无论哪种格式.

默认值: `./dokka`

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
对合成函数, 请使用 `suppressObviousFunctions`.

默认值: `false`

#### offlineMode
是否通过你的网络来解析远程的文件/链接.

包括用来生成外部文档链接的包列表. 例如, 可以让来自标准库的类成为文档中可以点击的链接.

将这个选项设置为 `true`, 某些情况下可以显著提高构建速度, 但也会降低文档质量和用户体验.
例如, 可以不解析来自你的依赖项的类/成员的链接, 包括标准库.

注意: 你可以将已取得的文件缓存到本地, 并通过本地路径提供给 Dokka.
参见 `externalDocumentationLinks` 小节.

默认值: `false`

#### includes
<anchor name="includes-json"/>

包含 [模块和包文档](../dokka-module-and-package-docs.html) 的 Markdown 文件列表.

指定的文件的内容会被解析, 并嵌入到文档内, 作为模块和包的描述文档.

这个选项可以对每个包为单位进行配置.

#### sourceSets
  
对 Kotlin [源代码集](../../multiplatform/multiplatform-discover-project.html#source-sets) 的额外配置.

关于它的所有选项的列表, 请参见 [源代码集配置](#source-set-configuration).

#### sourceLinks

源代码链接的全局配置, 应用于所有的源代码集.

关于它的所有选项的列表, 请参见 [源代码链接配置](#source-link-configuration).

#### perPackageOptions

对匹配的包的全局配置, 不论它们属于哪个源代码集.

关于它的所有选项的列表, 请参见 [包配置](#per-package-configuration).

#### externalDocumentationLinks

外部文档链接的全局配置, 不论它们属于哪个源代码集.

关于它的所有选项的列表, 请参见 [外部文档配置](#external-documentation-configuration).

#### pluginsClasspath

Dokka plugin 以及它们的依赖项的 JAR 文件列表.


### 源代码集配置

如何配置 Kotlin
[源代码集](../../multiplatform/multiplatform-discover-project.html#source-sets):

```json
{
  "sourceSets": [
    {
      "displayName": "jvm",
      "sourceSetID": {
        "scopeId": "moduleName",
        "sourceSetName": "main"
      },
      "dependentSourceSets": [
        {
          "scopeId": "dependentSourceSetScopeId",
          "sourceSetName": "dependentSourceSetName"
        }
      ],
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"],
      "reportUndocumented": false,
      "skipEmptyPackages": true,
      "skipDeprecated": false,
      "jdkVersion": 8,
      "languageVersion": "1.7",
      "apiVersion": "1.7",
      "noStdlibLink": false,
      "noJdkLink": false,
      "includes": [
        "module.md"
      ],
      "analysisPlatform": "jvm",
      "sourceRoots": [
        "/home/ignat/IdeaProjects/dokka-debug-mvn/src/main/kotlin"
      ],
      "classpath": [
        "libs/kotlin-stdlib-{{ site.data.releases.latest.version }}.jar",
        "libs/kotlin-stdlib-common-{{ site.data.releases.latest.version }}.jar"
      ],
      "samples": [
        "samples/basic.kt"
      ],
      "suppressedFiles": [
        "src/main/kotlin/org/jetbrains/dokka/Suppressed.kt"
      ],
      "sourceLinks":  [
        { "_comment": "参见其它章节" }
      ],
      "perPackageOptions": [
        { "_comment": "参见其它章节" }
      ],
      "externalDocumentationLinks":  [
        { "_comment": "参见其它章节" }
      ]
    }
  ]
}
```

#### displayName

用来引用这个源代码集的显示名称.

这个名称在外部用途使用(例如, 源代码集名称会显示给文档读者), 也在内部使用(例如, 用于 `reportUndocumented` 的日志信息).

如果你没有更好的选择, 可以使用平台名称.

#### sourceSetID

源代码集的技术性 ID 

#### documentedVisibilities

需要生成文档的可见度修饰符集合.

如果你想要对 `protected`/`internal`/`private` 声明声明生成文档,
以及如果你想要排除 `public` 声明, 只为 internal API 生成文档,
这个选项会很有用.

这个选项可以对每个包为单位进行配置.

可以设置的值:
- `PUBLIC`
- `PRIVATE`
- `PROTECTED`
- `INTERNAL`
- `PACKAGE`

默认值: `PUBLIC`

#### reportUndocumented

是否对可见的、无文档的声明输出警告, 这是指经过 `documentedVisibilities` 和其他过滤器过滤之后, 需要输出文档, 但没有 KDocs 的声明.

这个设置可以与 `failOnWarning` 选项配合工作.

这个选项可以对每个包为单位进行配置.

默认值: `false`

#### skipEmptyPackages

是否跳过经各种过滤器过滤之后不包含可见声明的包.

例如, 如果 `skipDeprecated` 设置为 `true`, 而且你的包中只包含已废弃的声明, 那么这个包会被认为是空的.

对 CLI 运行器的默认值为 `false`.

#### skipDeprecated

是否对标注了 `@Deprecated` 注解的声明生成文档.

这个选项可以对每个包为单位进行配置.

默认值: `false`

#### jdkVersion

在为 Java 类型生成外部文档链接时使用的 JDK 版本.

例如, 如果你在某些 public 声明的签名中使用了 `java.util.UUID`, 而且这个选项设置为 `8`, Dokka 会为它生成一个指向
[JDK 8 Javadoc](https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html)
的外部文档链接.

#### languageVersion

设置代码分析和 [@sample](../../kotlin-doc.html#sample-identifier) 环境时使用的
[Kotlin 语言版本](../../compatibility-modes.html).

#### apiVersion

设置代码分析和 [@sample](../../kotlin-doc.html#sample-identifier) 环境时使用的
[Kotlin API 版本](../../compatibility-modes.html).

#### noStdlibLink

是否生成指向 Kotlin 标准库的 API 参考文档的外部文档链接.

注意: 当 `noStdLibLink` 设置为 `false` 时, **会** 生成链接.

默认值: `false`

#### noJdkLink

是否生成指向 JDK 的 Javadoc 的外部文档链接.

JDK Javadoc 版本会通过 `jdkVersion` 选项决定.

注意: 当 `noJdkLink` 设置为 `false` 时, **会** 生成链接.

默认值: `false`

#### includes

包含 [模块和包文档](../dokka-module-and-package-docs.html) 的 Markdown 文件列表.

指定的文件的内容会被解析, 并嵌入到文档内, 作为模块和包的描述文档.

#### analysisPlatform

设置代码分析和 [@sample](../../kotlin-doc.html#sample-identifier) 环境时使用的平台.

可以设置的值:
- `jvm`
- `common`
- `js`
- `native`

#### sourceRoots

需要分析并生成文档的源代码根目录.
允许的输入是目录和单独的 `.kt` / `.java` 文件.

#### classpath

用于代码分析和交互式示例的类路径.

如果来自依赖项的某些类型无法自动的解析/查找, 这个选项会很有用.

这个选项可以接受 `.jar` 和 `.klib` 文件.

#### samples

目录或文件的列表, 其中包含通过 [@sample](../../kotlin-doc.html#sample-identifier) KDoc tag 引用的示例函数.

#### suppressedFiles

需要禁止生成文档的文件.

#### sourceLinks

源代码链接的一组参数, 只应用于这个源代码集.

关于它的所有选项的列表, 请参见 [源代码链接配置](#source-link-configuration).

#### perPackageOptions

一组参数, 应用于这个源代码集之内匹配的包.

关于它的所有选项的列表, 请参见 [各包配置](#per-package-configuration).

#### externalDocumentationLinks

外部文档链接的一组参数, 只应用于这个源代码集.

关于它的所有选项的列表, 请参见 [外部文档配置](#external-documentation-configuration).


### 源代码链接配置

`sourceLinks` 配置块可以用来为每个签名添加 `source` 链接, 链接地址是带有特定代码行的 `remoteUrl`.
(代码行可以通过 `remoteLineSuffix` 进行配置).

这样可以帮助读者找到每个声明的源代码.

例如, 请参见 `kotlinx.coroutines` 中
[`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html)
函数的文档 .

你可以对所有的源代码集一起配置源代码链接, 也可以 [分别配置](#source-set-configuration):

```json
{
  "sourceLinks": [
    {
      "localDirectory": "src/main/kotlin",
      "remoteUrl": "https://github.com/Kotlin/dokka/tree/master/src/main/kotlin",
      "remoteLineSuffix": "#L"
    }
  ]
}
```

#### localDirectory

本地源代码目录的路径.

#### remoteUrl

可以由文档读者访问的源代码托管服务 URL, 例如 GitHub, GitLab, Bitbucket, 等等.
这个 URL 用来生成声明的源代码链接.

#### remoteLineSuffix

向 URL 添加的源代码行数后缀. 这样可以帮助读者, 不仅能够导航到文件, 而且是声明所在的确定的行数.

行数本身会添加到后缀之后. 例如, 如果这个选项设置为 `#L`, 行数是 10, 那么最后的 URL 后缀会是 `#L10`.

各种常用的源代码托管服务的行数后缀是:
- GitHub: `#L`
- GitLab: `#L`
- Bitbucket: `#lines-`

默认值: 空 (没有后缀)

### 各包配置

`perPackageOptions` 配置块可以对指定的包设置一些选项, 包通过 `matchingRegex` 来匹配.

你可以对所有的源代码集一起添加包配置, 也可以 [分别配置](#source-set-configuration):

```json
{
  "perPackageOptions": [
    {
      "matchingRegex": ".*internal.*",
      "suppress": false,
      "skipDeprecated": false,
      "reportUndocumented": false,
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"]
    }
  ]
}
```

#### matchingRegex

用来匹配包的正规表达式.

#### suppress

在生成文档时, 是否应该跳过这个包.

默认值: `false`

#### skipDeprecated

是否对标注了 `@Deprecated` 注解的声明生成文档.

这个选项可以在项目/模块级设置.

默认值: `false`

#### reportUndocumented

是否对可见的、无文档的声明输出警告, 这是指经过 `documentedVisibilities` 和其他过滤器过滤之后, 需要输出文档, 但没有 KDocs 的声明.

这个设置可以与 `failOnWarning` 选项配合工作.

这个选项可以在源代码集级设置.

默认值: `false`

#### documentedVisibilities

这个选项设置需要生成文档的可见度修饰符.

如果你想要对这个包内的 `protected`/`internal`/`private` 声明生成文档,
以及如果你想要排除 `public` 声明, 只为 internal API 生成文档,
这个选项会很有用.

这个选项可以在源代码集级设置.

默认值: `PUBLIC`


### 外部文档配置

`externalDocumentationLinks` 配置块可以创建链接, 指向你的依赖项的外部文档.

例如, 如果你使用来自 `kotlinx.serialization` 的类型, 默认情况下, 在你的文档中这些类型不是可点击的链接, 因为无法解析这些类型.
但是, 由于 `kotlinx.serialization` 的 API 参考文档是使用 Dokka 构建的, 而且
[发布到了 kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/),
因此你可以对它配置外部文档链接.
然后就可以让 Dokka 对来自这个库的类型生成链接, 让它们成功的解析, 并在文档中成为可点击的链接.

你可以对所有的源代码集一起配置外部文档链接, 也可以 [分别配置](#source-set-configuration):

```json
{
  "externalDocumentationLinks": [
    {
      "url": "https://kotlinlang.org/api/kotlinx.serialization/",
      "packageListUrl": "https://kotlinlang.org/api/kotlinx.serialization/package-list"
    }
  ]
}
```

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

```json
{
  "moduleName": "Dokka Example",
  "moduleVersion": null,
  "outputDir": "./build/dokka/html",
  "failOnWarning": false,
  "suppressObviousFunctions": true,
  "suppressInheritedMembers": false,
  "offlineMode": false,
  "sourceLinks": [
    {
      "localDirectory": "src/main/kotlin",
      "remoteUrl": "https://github.com/Kotlin/dokka/tree/master/src/main/kotlin",
      "remoteLineSuffix": "#L"
    }
  ],
  "externalDocumentationLinks": [
    {
      "url": "https://docs.oracle.com/javase/8/docs/api/",
      "packageListUrl": "https://docs.oracle.com/javase/8/docs/api/package-list"
    },
    {
      "url": "https://kotlinlang.org/api/latest/jvm/stdlib/",
      "packageListUrl": "https://kotlinlang.org/api/latest/jvm/stdlib/package-list"
    }
  ],
  "perPackageOptions": [
    {
      "matchingRegex": ".*internal.*",
      "suppress": false,
      "reportUndocumented": false,
      "skipDeprecated": false,
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"]
    }
  ],
  "sourceSets": [
    {
      "displayName": "jvm",
      "sourceSetID": {
        "scopeId": "moduleName",
        "sourceSetName": "main"
      },
      "dependentSourceSets": [
        {
          "scopeId": "dependentSourceSetScopeId",
          "sourceSetName": "dependentSourceSetName"
        }
      ],
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"],
      "reportUndocumented": false,
      "skipEmptyPackages": true,
      "skipDeprecated": false,
      "jdkVersion": 8,
      "languageVersion": "1.7",
      "apiVersion": "1.7",
      "noStdlibLink": false,
      "noJdkLink": false,
      "includes": [
        "module.md"
      ],
      "analysisPlatform": "jvm",
      "sourceRoots": [
        "/home/ignat/IdeaProjects/dokka-debug-mvn/src/main/kotlin"
      ],
      "classpath": [
        "libs/kotlin-stdlib-{{ site.data.releases.latest.version }}.jar",
        "libs/kotlin-stdlib-common-{{ site.data.releases.latest.version }}.jar"
      ],
      "samples": [
        "samples/basic.kt"
      ],
      "suppressedFiles": [
        "src/main/kotlin/org/jetbrains/dokka/Suppressed.kt"
      ],
      "sourceLinks": [
        {
          "localDirectory": "src/main/kotlin",
          "remoteUrl": "https://github.com/Kotlin/dokka/tree/master/src/main/kotlin",
          "remoteLineSuffix": "#L"
        }
      ],
      "externalDocumentationLinks": [
        {
          "url": "https://docs.oracle.com/javase/8/docs/api/",
          "packageListUrl": "https://docs.oracle.com/javase/8/docs/api/package-list"
        },
        {
          "url": "https://kotlinlang.org/api/latest/jvm/stdlib/",
          "packageListUrl": "https://kotlinlang.org/api/latest/jvm/stdlib/package-list"
        }
      ],
      "perPackageOptions": [
        {
          "matchingRegex": ".*internal.*",
          "suppress": false,
          "reportUndocumented": false,
          "skipDeprecated": false,
          "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"]
        }
      ]
    }
  ],
  "pluginsClasspath": [
    "./dokka-base-{{ site.data.releases.dokkaVersion }}.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./dokka-analysis-{{ site.data.releases.dokkaVersion }}.jar",
    "./kotlin-analysis-intellij-{{ site.data.releases.dokkaVersion }}.jar",
    "./kotlin-analysis-compiler-{{ site.data.releases.dokkaVersion }}.jar",
    "./freemarker-2.3.31.jar"
  ],
  "pluginsConfiguration": [
    {
      "fqPluginName": "org.jetbrains.dokka.base.DokkaBase",
      "serializationFormat": "JSON",
      "values": "{\"separateInheritedMembers\":false,\"footerMessage\":\"© 2021 pretty good Copyright\"}"
    }
  ],
  "includes": [
    "module.md"
  ]
}
```
