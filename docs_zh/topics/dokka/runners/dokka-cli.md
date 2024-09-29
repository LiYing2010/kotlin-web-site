[//]: # (title: CLI)

最终更新: %latestDocDate%

如果你由于某些原因无法使用 [Gradle](dokka-gradle.md) 或 [Maven](dokka-maven.md) 构建工具,
Dokka 有一个命令行(CLI)运行器用来生成文档.

与 Gradle plugin for Dokka 相比, 它拥有相同甚至更多的能力.
但它更加难于设置, 因为没有自动配置, 尤其是对于跨平台和多模块环境.

## 入门 {id="get-started"}

CLI 运行器作为单独的可执行 artifact 发布到 Maven Central.

你可以在
[Maven Central](https://central.sonatype.com/artifact/org.jetbrains.dokka/dokka-cli) 找到它,
或者
[直接下载它](https://repo1.maven.org/maven2/org/jetbrains/dokka/dokka-cli/%dokkaVersion%/dokka-cli-%dokkaVersion%.jar).

将 `dokka-cli-%dokkaVersion%.jar` 文件保存到你的计算机,
使用 `-help` 选项运行它, 可以看到所有的配置选项, 以及这些选项的描述:

```bash
java -jar dokka-cli-%dokkaVersion%.jar -help
```

也可以查看一些嵌套的选项, 例如 `-sourceSet`:

```bash
java -jar dokka-cli-%dokkaVersion%.jar -sourceSet -help
```

## 生成文档 {id="generate-documentation"}

### 前提条件 {id="prerequisites"}

由于没有构建工具来管理依赖项, 你必须自己提供依赖项 `.jar` 文件.

对于所有的输出格式, 你所需要的依赖项如下:

| **Group**             | **Artifact**                  | **版本**         | **链接**                                                                                                                                             |
|-----------------------|-------------------------------|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| `org.jetbrains.dokka` | `dokka-base`                  | %dokkaVersion% | [下载](https://repo1.maven.org/maven2/org/jetbrains/dokka/dokka-base/%dokkaVersion%/dokka-base-%dokkaVersion%.jar)                                   |
| `org.jetbrains.dokka` | `analysis-kotlin-descriptors` | %dokkaVersion% | [下载](https://repo1.maven.org/maven2/org/jetbrains/dokka/analysis-kotlin-descriptors/%dokkaVersion%/analysis-kotlin-descriptors-%dokkaVersion%.jar) |

对于 [HTML](dokka-html.md) 输出格式, 你需要的额外的依赖项如下:

| **Group**               | **Artifact**       | **版本** | **链接**                                                                                                       |
|-------------------------|--------------------|--------|--------------------------------------------------------------------------------------------------------------|
| `org.jetbrains.kotlinx` | `kotlinx-html-jvm` | 0.8.0  | [下载](https://repo1.maven.org/maven2/org/jetbrains/kotlinx/kotlinx-html-jvm/0.8.0/kotlinx-html-jvm-0.8.0.jar) |
| `org.freemarker`        | `freemarker`       | 2.3.31 | [下载](https://repo1.maven.org/maven2/org/freemarker/freemarker/2.3.31/freemarker-2.3.31.jar)                  |


### 使用命令行选项运行 {id="run-with-command-line-options"}

你可以传递命令行选项来配置 CLI 运行器. 

你至少需要提供以下选项:

* `-pluginsClasspath` - 指向已下载的依赖项的绝对/相对路径列表, 使用分号 `;` 分隔
* `-sourceSet` - 要生成文档的源代码的绝对路径
* `-outputDir` - 文档输出目录的绝对/相对路径 

```bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;./analysis-kotlin-descriptors-%dokkaVersion%.jar;./kotlinx-html-jvm-0.8.0.jar;./freemarker-2.3.31.jar" \
     -sourceSet "-src /home/myCoolProject/src/main/kotlin" \
     -outputDir "./dokka/html"
```

执行上面示例中的命令, 会使用 [HTML](dokka-html.md) 输出格式生成文档.

关于配置的更多详细信息, 请参见 [命令行选项](#command-line-options).

### 使用 JSON 配置运行 {id="run-with-json-configuration"}

可以使用 JSON 来配置 CLI 运行器. 这种情况下, 你需要提供指向 JSON 配置文件的绝对/相对路径, 作为第一个也是唯一一个参数. 
所有其它的配置选项都从 JSON 配置文件解析得到.

```bash
java -jar dokka-cli-%dokkaVersion%.jar dokka-configuration.json
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
    "./dokka-base-%dokkaVersion%.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./analysis-kotlin-descriptors-%dokkaVersion%.jar",
    "./freemarker-2.3.31.jar"
  ]
}
```

更多详情请参见 [JSON 配置选项](#json-configuration).

### 其它输出格式 {id="other-output-formats"}

默认情况下, `dokka-base` artifact 只包含 [HTML](dokka-html.md) 输出格式.

其他所有输出格式都以 [Dokka plugin](dokka-plugins.md) 的形式实现.
要使用这些格式, 你需要将它们添加到 plugin classpath.

例如, 如果你想要使用试验性的 [GFM](dokka-markdown.md#gfm) 输出格式生成文档,
你需要下载 gfm-plugin 的 JAR 文件 ([下载](https://repo1.maven.org/maven2/org/jetbrains/dokka/gfm-plugin/%dokkaVersion%/gfm-plugin-%dokkaVersion%.jar)),
并将它传递给 `pluginsClasspath` 配置选项.

通过命令行选项传递:

```shell
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar" \
     ...
```

通过 JSON 配置传递:

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./gfm-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

通过传递给 `pluginsClasspath` 的 GFM plugin, CLI 运行器会使用 GFM 输出格式生成文档.

更多详情, 请参见 [Markdown](dokka-markdown.md) 和 [Javadoc](dokka-javadoc.md#generate-javadoc-documentation) 章节.

## 命令行选项 {id="command-line-options"}

要查看所有可用的命令行选项列表, 以及它们的详细描述, 请运行:

```bash
java -jar dokka-cli-%dokkaVersion%.jar -help
```

简单的总结如下:

| 选项                           | 描述                                                                                                                            |
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
| `loggingLevel`               | 日志级别, 可以设置的值: `DEBUG, PROGRESS, INFO, WARN, ERROR`.                                                                           |
| `help, h`                    | 关于使用方法的帮助信息.                                                                                                                  |

### 源代码集选项 {id="source-set-options"}

要查看嵌套的 `-sourceSet` 配置的命令行选项列表, 请运行:

```bash
java -jar dokka-cli-%dokkaVersion%.jar -sourceSet -help
```

简单的总结如下:

| 选项                           | 描述                                                                                                       |
|------------------------------|----------------------------------------------------------------------------------------------------------|
| `sourceSetName`              | 源代码集名称.                                                                                                  |
| `displayName`                | 源代码集的显示名称, 这个名称会在内部和外部使用.                                                                                |
| `classpath`                  | 对示例进行分析和交互时的类路径. 可以接受多个路径, 以分号分隔.                                                                        |
| `src`                        | 需要分析并生成文档的源代码根目录. 可以接受多个路径, 以分号分隔.                                                                       |
| `dependentSourceSets`        | 依赖的源代码集名称, 格式为 `moduleName/sourceSetName`. 可以接受多个值, 以分号分隔.                                               |
| `samples`                    | 包含示例函数的目录或文件的列表. 可以接受多个路径, 以分号分隔.                                                                        |
| `includes`                   | <p id="includes-cli">包含 [模块和包文档](dokka-module-and-package-docs.md) 的 Markdown 文件. 可以接受多个路径, 以分号分隔.</p>   |
| `documentedVisibilities`     | 需要生成文档的成员可见度. 可以接受多个值, 以分号分隔. 可以设置的值: `PUBLIC`, `PRIVATE`, `PROTECTED`, `INTERNAL`, `PACKAGE`.           |
| `reportUndocumented`         | 是否对无文档的声明输出警告.                                                                                           | 
| `noSkipEmptyPackages`        | 是否对空的包创建页面.                                                                                              | 
| `skipDeprecated`             | 是否跳过废弃的声明.                                                                                               | 
| `jdkVersion`                 | 生成 JDK Javadoc 链接时使用的 JDK 版本.                                                                            |
| `languageVersion`            | 设置代码分析和示例环境时使用的 Kotlin 语言版本.                                                                             |
| `apiVersion`                 | 设置代码分析和示例环境时使用的 Kotlin API 版本.                                                                           |
| `noStdlibLink`               | 是否生成指向 Kotlin 标准库的链接.                                                                                    | 
| `noJdkLink`                  | 是否生成指向 JDK Javadoc 的链接.                                                                                  | 
| `suppressedFiles`            | 需要禁止输出的文件路径. 可以接受多个路径, 以分号分隔.                                                                            |
| `analysisPlatform`           | 设置代码分析环境时使用的平台.                                                                                          |
| `perPackageOptions`          | 包源代码集配置列表, 格式为 `matchingRegexp,-deprecated,-privateApi,+warnUndocumented,+suppress;...`. 可以接受多个值, 以分号分隔. |
| `externalDocumentationLinks` | 外部文档链接, 格式为 `{url}^{packageListUrl}`. 可以接受多个值, 以 `^^` 分隔.                                                |
| `srcLink`                    | 源代码目录与用于浏览源代码的 Web Service 之间的对应. 可以接受多个路径, 以分号分隔.                                                       |

## JSON 配置 {id="json-configuration"}

下面是对每个配置小节的一些示例和详细解释.
在本章的最后, 你还可以看到一个示例, 它使用了 [所有的配置选项](#complete-configuration).

### 一般配置 {id="general-configuration"}

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
    "./dokka-base-%dokkaVersion%.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./analysis-kotlin-descriptors-%dokkaVersion%.jar",
    "./freemarker-2.3.31.jar"
  ]
}
```

<deflist collapsible="true">
    <def title="moduleName">
        <p>
            用来引用模块的显示名称. 这个名称会用于目录, 导航, 日志, 等等.
        </p>
        <p>
            默认值: <code>root</code>
        </p>
    </def>
    <def title="moduleVersion">
        <p>
            模块版本.
        </p>
        <p>
            默认值: 空
        </p>
    </def>
    <def title="outputDirectory">
        <p>
            文档生成的目录, 无论哪种格式.
        </p>
        <p>
            默认值: <code>./dokka</code>
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
            对合成函数, 请使用 <code>suppressObviousFunctions</code>.
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
            包括用来生成外部文档链接的包列表. 例如, 可以让来自标准库的类成为文档中可以点击的链接. 
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
    <def title="includes" id="includes-json">
        <p>
            包含 <a href="dokka-module-and-package-docs.md">模块和包文档</a> 的 Markdown 文件列表.
        </p>
        <p>
            指定的文件的内容会被解析, 并嵌入到文档内, 作为模块和包的描述文档.
        </p>
        <p>
            这个选项可以对每个包为单位进行配置.
        </p>
    </def>
    <def title="sourceSets">
        <p>
            对 Kotlin <a href="multiplatform-discover-project.md#source-sets">源代码集</a> 的额外配置.
        </p>
        <p>
            关于它的所有选项的列表, 请参见 <a href="#source-set-configuration">源代码集配置</a>.
        </p>
    </def>
    <def title="sourceLinks">
        <p>
            源代码链接的全局配置, 应用于所有的源代码集.
        </p>
        <p>
            关于它的所有选项的列表, 请参见 <a href="#source-link-configuration">源代码链接配置</a>.
        </p>
    </def>
    <def title="perPackageOptions">
        <p>
            对匹配的包的全局配置, 不论它们属于哪个源代码集.
        </p>
        <p>
            关于它的所有选项的列表, 请参见 <a href="#per-package-configuration">包配置</a>.
        </p>
    </def>
    <def title="externalDocumentationLinks">
        <p>
            外部文档链接的全局配置, 不论它们属于哪个源代码集.
        </p>
        <p>
            关于它的所有选项的列表, 请参见 <a href="#external-documentation-links-configuration">外部文档链接配置</a>.
        </p>
    </def>
    <def title="pluginsClasspath">
        <p>
            Dokka plugin 以及它们的依赖项的 JAR 文件列表.
        </p>
    </def>
</deflist>

### 源代码集配置 {id="source-set-configuration"}

如何配置 Kotlin
[源代码集](multiplatform-discover-project.md#source-sets):

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
        "libs/kotlin-stdlib-%kotlinVersion%.jar",
        "libs/kotlin-stdlib-common-%kotlinVersion%.jar"
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

<deflist collapsible="true">
    <def title="displayName">
        <p>
            用来引用这个源代码集的显示名称.
        </p>
        <p>
            这个名称在外部用途使用(例如, 源代码集名称会显示给文档读者),
            也在内部使用(例如, 用于 <code>reportUndocumented</code> 的日志信息).
        </p>
        <p>
            如果你没有更好的选择, 可以使用平台名称.
        </p>
    </def>
    <def title="sourceSetID">
        <p>
            源代码集的技术性 ID
        </p>
    </def>
    <def title="documentedVisibilities">
        <p>
            需要生成文档的可见度修饰符集合.
        </p>
        <p>
            如果你想要对 <code>protected</code>/<code>internal</code>/<code>private</code> 声明声明生成文档,
            以及如果你想要排除 <code>public</code> 声明, 只为 internal API 生成文档,
            这个选项会很有用.
        </p>
        <p>
            这个选项可以对每个包为单位进行配置.
        </p>
        <p>
            可以设置的值:
            <list>
                <li><code>PUBLIC</code></li>
                <li><code>PRIVATE</code></li>
                <li><code>PROTECTED</code></li>
                <li><code>INTERNAL</code></li>
                <li><code>PACKAGE</code></li>
            </list>
        </p>
        <p>
            默认值: <code>PUBLIC</code>
        </p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否对可见的、无文档的声明输出警告, 这是指经过 <code>documentedVisibilities</code> 和其他过滤器过滤之后, 需要输出文档, 但没有 KDocs 的声明.
        </p>
        <p>
            这个设置可以与 <code>failOnWarning</code> 选项配合工作.
        </p>
        <p>
            这个选项可以对每个包为单位进行配置.
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
            例如, 如果 <code>skipDeprecated</code> 设置为 <code>true</code>, 而且你的包中只包含已废弃的声明, 那么这个包会被认为是空的.
        </p>
        <p>
            对 CLI 运行器的默认值为 <code>false</code>.
        </p>
    </def>
    <def title="skipDeprecated">
        <p>
            是否对标注了 <code>@Deprecated</code> 注解的声明生成文档.
        </p>
        <p>
            这个选项可以对每个包为单位进行配置.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="jdkVersion">
        <p>
            在为 Java 类型生成外部文档链接时使用的 JDK 版本.
        </p>
        <p>
            例如, 如果你在某些 public 声明的签名中使用了 <code>java.util.UUID</code>, 而且这个选项设置为 <code>8</code>,
            Dokka 会为它生成一个指向
            <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadocs</a>
            的外部文档链接.
        </p>
    </def>
    <def title="languageVersion">
        <p>
            设置代码分析和 <a href="kotlin-doc.md#sample-identifier">@sample</a> 环境时使用的
            <a href="compatibility-modes.md">Kotlin 语言版本</a>.
        </p>
    </def>
    <def title="apiVersion">
        <p>
            设置代码分析和 <a href="kotlin-doc.md#sample-identifier">@sample</a> 环境时使用的
            <a href="compatibility-modes.md">Kotlin API 版本</a>.
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
    <def title="includes">
        <p>
            包含 <a href="dokka-module-and-package-docs.md">模块和包文档</a> 的 Markdown 文件列表.
        </p>
        <p>
            指定的文件的内容会被解析, 并嵌入到文档内, 作为模块和包的描述文档.
        </p>
    </def>
    <def title="analysisPlatform">
        <p>
            设置代码分析和 <a href="kotlin-doc.md#sample-identifier">@sample</a> 环境时使用的平台.
        </p>
        <p>
            可以设置的值:
            <list>
                <li><code>jvm</code></li>
                <li><code>common</code></li>
                <li><code>js</code></li>
                <li><code>native</code></li>
            </list>
        </p>
    </def>
    <def title="sourceRoots">
        <p>
            需要分析并生成文档的源代码根目录.
            允许的输入是目录和单独的 <code>.kt</code> / <code>.java</code> 文件.
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
    </def>
    <def title="samples">
        <p>
            目录或文件的列表, 其中包含通过 <a href="kotlin-doc.md#sample-identifier">@sample</a> KDoc tag 引用的示例函数.
        </p>
    </def>
    <def title="suppressedFiles">
        <p>
            需要禁止生成文档的文件.
        </p>
    </def>
    <def title="sourceLinks">
        <p>
            源代码链接的一组参数, 只应用于这个源代码集.
        </p>
        <p>
            关于它的所有选项的列表, 请参见 <a href="#source-link-configuration">源代码链接配置</a>.
        </p>
    </def>
    <def title="perPackageOptions">
        <p>
            一组参数, 应用于这个源代码集之内匹配的包.
        </p>
        <p>
            关于它的所有选项的列表, 请参见 <a href="#per-package-configuration">各包配置</a>.
        </p>
    </def>
    <def title="externalDocumentationLinks">
        <p>
            外部文档链接的一组参数, 只应用于这个源代码集.
        </p>
        <p>
            关于它的所有选项的列表, 请参见 <a href="#external-documentation-links-configuration">外部文档链接配置</a>.
        </p>
    </def>
</deflist>

### 源代码链接配置 {id="source-link-configuration"}

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

<deflist collapsible="true">
    <def title="localDirectory">
        <p>
            本地源代码目录的路径.
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
            向 URL 添加的源代码行数后缀. 这样可以帮助读者, 不仅能够导航到文件, 而且是声明所在的确定的行数.
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
            默认值: 空 (没有后缀)
        </p>
    </def>
</deflist>

### 各包配置 {id="per-package-configuration"}

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

<deflist collapsible="true">
    <def title="matchingRegex">
        <p>
            用来匹配包的正规表达式.
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
            这个选项可以在项目/模块级设置.
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
            这个选项可以在源代码集级设置.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="documentedVisibilities">
        <p>
            这个选项设置需要生成文档的可见度修饰符.
        </p>
        <p>
            如果你想要对这个包内的 <code>protected</code>/<code>internal</code>/<code>private</code> 声明生成文档,
            以及如果你想要排除 <code>public</code> 声明, 只为 internal API 生成文档,
            这个选项会很有用.
        </p>
        <p>
            这个选项可以在源代码集级设置.
        </p>
        <p>
            默认值: <code>PUBLIC</code>
        </p>
    </def>
</deflist>

### 外部文档链接配置 {id="external-documentation-links-configuration"}

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
            <code>package-list</code> 的确切位置. 这是对 Dokka 自动解析的一个替代手段.
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
        "libs/kotlin-stdlib-%kotlinVersion%.jar",
        "libs/kotlin-stdlib-common-%kotlinVersion%.jar"
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
    "./dokka-base-%dokkaVersion%.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./analysis-kotlin-descriptors-%dokkaVersion%.jar",
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
