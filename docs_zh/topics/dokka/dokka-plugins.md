[//]: # (title: Dokka Plugin)

> 这篇向导适用于 Dokka Gradle plugin (DGP) v2 模式. DGP v1 模式不再支持.
> 要从 v1 模式升级到 v2 模式, 请遵循 [迁移向导](dokka-migration.md).
>
{style="note"}

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
<tab title="Gradle Kotlin DSL" group-key="kotlin">

Gradle plugin for Dokka 会创建便利的依赖项配置, 你可以对全局应用 plugin, 或只对特定的输出格式应用 plugin.

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dependencies {
    dokkaPlugin("org.jetbrains.dokka:mathjax-plugin")
}
```

> * 内置的 plugin (例如 HTML 和 Javadoc) 总是会自动应用. 你只需要配置它们, 不需要声明对它们的依赖项.
>
> * 在对多模块项目(多项目构建)生成文档时, 你需要 [在子项目之间共用 Dokka 配置和 plugin](dokka-gradle.md#multi-project-configuration).
>
{style="note"}

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dependencies {
    dokkaPlugin 'org.jetbrains.dokka:mathjax-plugin'
}
```

> 在对 [多项目](dokka-gradle.md#multi-project-configuration) 构建生成文档时,
> 你需要 [在子项目之间共用 Dokka 配置和 plugin](dokka-gradle.md#multi-project-configuration).
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

我们来看看如何配置内置的 HTML plugin, 我们向 assets 添加自定义的图片(使用 `customAssets` 选项),
添加自定义的样式表 (使用 `customStyleSheets` 选项),
修改页脚文字 (使用 `footerMessage` 选项):

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

要通过类型安全的方式配置 Dokka plugins, 请使用 `dokka.pluginsConfiguration {}` 代码段:

```kotlin
dokka {
    pluginsConfiguration.html {
        customAssets.from("logo.png")
        customStyleSheets.from("styles.css")
        footerMessage.set("(c) Your Company")
    }
}
```

关于 Dokka plugin 配置的例子, 请参见
[Dokka 的 versioning plugin](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/versioning-multimodule-example).

Dokka 允许你通过 [配置自定义 plugin](https://github.com/Kotlin/dokka/blob/v2.2.0/examples/gradle-v2/custom-dokka-plugin-example/demo-library/build.gradle.kts)
来扩展它的功能, 并修改文档生成过程.

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
dokka {
    pluginsConfiguration {
        html {
            customAssets.from("logo.png")
            customStyleSheets.from("styles.css")
            footerMessage.set("(c) Your Company")
        }
    }
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
| [GFM plugin](https://github.com/Kotlin/dokka/tree/master/dokka-subprojects/plugin-gfm)                                             | 支持以 GitHub Flavoured Markdown 格式生成文档                                      |
| [Jekyll plugin](https://github.com/Kotlin/dokka/tree/master/dokka-subprojects/plugin-jekyll)                                       | 支持以 Jekyll Flavoured Markdown 格式生成文档                                      |

如果你是 Dokka plugin 的开发者, 希望将你的 plugin 添加到这个列表,
请通过 [Slack](dokka-introduction.md#community) 或 [GitHub](https://github.com/Kotlin/dokka/) 联系维护者.
