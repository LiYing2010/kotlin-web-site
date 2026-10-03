[//]: # (title: 模块文档)

针对子项目整体的文档, 以及针对子项目内包的文档, 可以通过单独的 Markdown 文件的形式提供.

## 文件格式 {id="file-format"}

在 Markdown 文件内, 针对子项目整体的文档, 以及针对各个包的文档, 分别使用各自的顶级标题来指定.
对于子项目, 标题文字 **必须** 是 **Module `<module name>`**,
对于包, 标题文字 **必须** 是 **Package `<package qualified name>`**.

文件不一定需要同时包含子项目和包的文档. 你可以让文件只包含包或子项目的文档.
也可以为每个子项目或包分别生成 Markdown 文件.

使用 [Markdown 语法](https://www.markdownguide.org/basic-syntax/), 你可以添加:
* 最多 6 层的标题
* 粗体或斜体格式的强调内容
* 链接
* 内嵌代码
* 代码块
* 引用块

下面是一个示例文件, 同时包含子项目和包的文档:

```text
# Module kotlin-demo

这段内容出现在你的子项目名称之下.

# Package org.jetbrains.kotlin.demo

这段内容出现在包列表中的你的包名称之下.
也出现在你的包的页面的顶级标题之下.

## 包 org.jetbrains.kotlin.demo 的二级标题

这个标题之后的内容也是 `org.jetbrains.kotlin.demo` 的文档的一部分

# Package org.jetbrains.kotlin.demo2

这段内容出现在包列表中的你的包名称之下.
也出现在你的包的页面的顶级标题之下.

## 包 org.jetbrains.kotlin.demo2 的二级标题

这个标题之后的内容也是 `org.jetbrains.kotlin.demo2` 的文档的一部分
```

使用 Gradle 的示例项目, 可以参见 [Dokka Gradle 示例](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-gradle-example).

## 向 Dokka 传递文件 {id="pass-files-to-dokka"}

要将文件传递给 Dokka, 你需要对 Gradle, Maven, 或 CLI, 使用相关的 **includes** 选项:

<tabs group="build-script">
<tab title="Gradle" group-key="gradle">

在 [一般配置](dokka-gradle-configuration-options.md) 中使用 `includes` 选项.

</tab>

<tab title="Maven" group-key="mvn">

在 [一般配置](dokka-maven.md#general-configuration) 中使用 `includes` 选项.

</tab>

<tab title="CLI" group-key="cli">

如果你使用命令行配置, 请在 [源代码集选项](dokka-cli.md#source-set-options) 中使用 `includes` 选项.

如果你使用 JSON 配置, 请在 [一般配置](dokka-cli.md#general-configuration) 中使用 `includes` 选项.

</tab>
</tabs>
