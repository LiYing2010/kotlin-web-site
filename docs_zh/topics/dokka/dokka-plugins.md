[//]: # (title: Dokka Plugin)

最终更新: %latestDocDate%

Dokka 的设计思想是易于扩展, 而且高度可定制化,
因此对于 Dokka 缺少的, 或者没有默认提供的细节功能, 社区开发者可以实现 plugin.

Dokka plugin 的范围很广, 包括支持其他编程语言的源代码, 到支持各种输出格式.
你可以对你自己的 KDoc tag 或注解添加支持, 教会 Dokka 如何输出 KDoc 描述中出现的各种的 DSL,
对 Dokka 页面的外观重新设计, 使其无缝的集成到你的公司的网站,
将 Dokka 与其他工具集成, 等等等等.

如果你想要学习如何 创建 Dokka plugin, 请参见
[开发者指南](https://kotlin.github.io/dokka/%dokkaVersion%/developer_guide/introduction/).

## 应用 Dokka plugin {id="apply-dokka-plugins"}

Dokka plugin 作为单独的 artifact 发布, 因此要应用一个 Dokka plugin, 你只需要将它添加为依赖项.
之后, plugin 会自行扩展 Dokka - 不需要你再进行更多工作.

> 使用相同扩展点的 plugin, 或者以类似方式工作的 plugin, 可能会互相影响.
> 因此可能会导致文档外观上的 bug, 不确定的行为, 甚至构建失败.
> 但是, 应该不会导致一致性问题, 因为 Dokka 没有公开任何可变的数据结构和对象.
>
> 如果你发现这类问题, 建议检查应用了哪些 plugin, 以及这些 plugin 的行为.
>
{style="note"}

我们来看看在你的项目中如何应用 [mathjax plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax):

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

Gradle plugin for Dokka 会创建便利的依赖项配置, 你可以对全局应用 plugin, 或只对特定的输出格式应用 plugin.

```kotlin
dependencies {
    // 对全局应用
    dokkaPlugin("org.jetbrains.dokka:mathjax-plugin:%dokkaVersion%")

    // 只对单模块的 dokkaHtml task 应用
    dokkaHtmlPlugin("org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%")

    // 对多项目构建中的 HTML 格式应用
    dokkaHtmlPartialPlugin("org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%")
}
```

> 在对 [多项目](dokka-gradle.md#multi-project-builds) 构建生成文档时,
> 你需要同时对子项目和它们的父项目应用 Dokka plugin.
>
{style="note"}

</tab>
<tab title="Groovy" group-key="groovy">

Gradle plugin for Dokka 会创建便利的依赖项配置, 你可以对全局应用 plugin, 或只对特定的输出格式应用 plugin.

```groovy
dependencies {
    // 对全局应用
    dokkaPlugin 'org.jetbrains.dokka:mathjax-plugin:%dokkaVersion%'

    // 只对单模块的 dokkaHtml task 应用
    dokkaHtmlPlugin 'org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%'

    // 对多项目构建中的 HTML 格式应用
    dokkaHtmlPartialPlugin 'org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%'
}
```

> 在对 [多项目](dokka-gradle.md#multi-project-builds) 构建生成文档时,
> 你需要同时对子项目和它们的父项目应用 Dokka plugin.
>
{style="note"}

</tab>

<tab title="Maven" group-key="mvn">

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>mathjax-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

</tab>

<tab title="CLI" group-key="cli">

如果你使用 [CLI](dokka-cli.md) 运行器的 [命令行选项](dokka-cli.md#run-with-command-line-options) 模式,
Dokka plugin 应该以 `.jar` 文件的方式传递给 `-pluginsClasspath`:

```Shell
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./mathjax-plugin-%dokkaVersion%.jar" \
     ...
```

如果你使用 [JSON 配置](dokka-cli.md#run-with-json-configuration) 模式,
Dokka plugin 应该在 `pluginsClasspath` 之下指定.

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./mathjax-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

</tab>
</tabs>

## 配置 Dokka plugin {id="configure-dokka-plugins"}

Dokka plugin 也可以带有它们自己的配置选项.
要查看有哪些选项可以使用, 请参考你使用的 plugin 的文档.

我们来看看如何配置 `DokkaBase` plugin, 它负责生成 [HTML](dokka-html.md) 文档.
我们向 assets 添加自定义的图片(使用 `customAssets` 选项),
添加自定义的样式表 (使用 `customStyleSheets` 选项),
修改页脚文字 (使用 `footerMessage` 选项):

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

Gradle 的 Kotlin DSL 可以使用类型安全的 plugin 配置.
做法是, 在 `buildscript` 代码段, 向 classpath 依赖项添加 plugin 的 artifact,
然后导入 plugin 和配置的类:

```kotlin
import org.jetbrains.dokka.base.DokkaBase
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.base.DokkaBaseConfiguration

buildscript {
    dependencies {
        classpath("org.jetbrains.dokka:dokka-base:%dokkaVersion%")
    }
}

tasks.withType<DokkaTask>().configureEach {
    pluginConfiguration<DokkaBase, DokkaBaseConfiguration> {
        customAssets = listOf(file("my-image.png"))
        customStyleSheets = listOf(file("my-styles.css"))
        footerMessage = "(c) 2022 MyOrg"
    }
}
```

另一种方法是, plugin 可以通过 JSON 进行配置. 通过这种方法, 不需要添加额外的依赖项.

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask

tasks.withType<DokkaTask>().configureEach {
    val dokkaBaseConfiguration = """
    {
      "customAssets": ["${file("assets/my-image.png")}"],
      "customStyleSheets": ["${file("assets/my-styles.css")}"],
      "footerMessage": "(c) 2022 MyOrg"
    }
    """
    pluginsMapConfiguration.set(
        mapOf(
            // plugin 的完整限定名称, to, json 配置
            "org.jetbrains.dokka.base.DokkaBase" to dokkaBaseConfiguration
        )
    )
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask

tasks.withType(DokkaTask.class) {
    String dokkaBaseConfiguration = """
    {
      "customAssets": ["${file("assets/my-image.png")}"],
      "customStyleSheets": ["${file("assets/my-styles.css")}"],
      "footerMessage": "(c) 2022 MyOrg"
    }
    """
    pluginsMapConfiguration.set(
        // plugin 的完整限定名称, :, json 配置
        ["org.jetbrains.dokka.base.DokkaBase": dokkaBaseConfiguration]
    )
}
```

</tab>
<tab title="Maven" group-key="mvn">

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <pluginsConfiguration>
            <!-- plugin 的完整限定名称 -->
            <org.jetbrains.dokka.base.DokkaBase>
                <!-- 选项名称 -->
                <customAssets>
                    <asset>${project.basedir}/my-image.png</asset>
                </customAssets>
                <customStyleSheets>
                    <stylesheet>${project.basedir}/my-styles.css</stylesheet>
                </customStyleSheets>
                <footerMessage>(c) MyOrg 2022 Maven</footerMessage>
            </org.jetbrains.dokka.base.DokkaBase>
        </pluginsConfiguration>
    </configuration>
</plugin>
```

</tab>
<tab title="CLI" group-key="cli">

如果你使用 [CLI](dokka-cli.md) 运行器的 [命令行选项](dokka-cli.md#run-with-command-line-options) 模式,
请使用 `-pluginsConfiguration` 选项来接受 JSON 配置, 选项值的格式是 `fullyQualifiedPluginName=json`.

如果你需要配置多个 plugin, 你可以传递多个值, 以 `^^` 分隔.

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     ...
     -pluginsConfiguration "org.jetbrains.dokka.base.DokkaBase={\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg CLI\"}"
```

如果你使用 [JSON 配置](dokka-cli.md#run-with-json-configuration),
也有类似的 `pluginsConfiguration` 数组, 在它的 `values` 中接受 JSON 配置.

```json
{
  "moduleName": "Dokka Example",
  "pluginsConfiguration": [
    {
      "fqPluginName": "org.jetbrains.dokka.base.DokkaBase",
      "serializationFormat": "JSON",
      "values": "{\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg\"}"
    }
  ]
}
```

</tab>
</tabs>

## 重要的 plugin {id="notable-plugins"}

下面是一些重要的 Dokka plugin, 可能对你有用:

| **名称**                                                                                                                             | **描述**                                                                    |
|------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| [Android documentation plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-android-documentation) | 改善 Android 上的文档体验                                                         |
| [Versioning plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning)                       | 添加版本选择器, 帮助组织你的应用程序/库的多个不同版本的文档                                           |
| [MermaidJS HTML plugin](https://github.com/glureau/dokka-mermaid)                                                                  | 输出 KDocs 中出现的 [MermaidJS](https://mermaid-js.github.io/mermaid/#/) 图和视觉效果 |
| [Mathjax HTML plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)                        | 美化输出 KDocs 中出现的数学公式                                                       |
| [Kotlin as Java plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)               | 以 Java 视角输出 Kotlin 签名                                                     |

如果你是 Dokka plugin 的开发者, 希望将你的 plugin 添加到这个列表,
请通过 [Slack](dokka-introduction.md#community) 或 [GitHub](https://github.com/Kotlin/dokka/) 联系维护者.
