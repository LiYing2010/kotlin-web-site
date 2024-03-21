---
type: doc
layout: reference
category: dokka
title: "模块文档"
---

# 模块文档

最终更新: {{ site.data.releases.latestDocDate }}

针对模块整体的文档, 以及针对模块内包的文档, 可以通过单独的 Markdown 文件的形式提供.

## 文件格式

在 Markdown 文件内, 针对模块整体的文档, 以及针对各个包的文档, 分别使用各自的顶级标题来指定.
对于模块, 标题文字 **必须** 是 **Module `<module name>`**,
对于包, 标题文字 **必须** 是 **Package `<package qualified name>`**.

文件不一定需要同时包含模块和包的文档. 你可以让文件只包含包或模块的文档.
也可以为每个模块或包分别生成 Markdown 文件.

使用 [Markdown 语法](https://www.markdownguide.org/basic-syntax/), 你可以添加:
* 最多 6 层的标题
* 粗体或斜体格式的强调内容
* 链接
* 内嵌代码
* 代码块
* 引用块

下面是一个示例文件, 同时包含模块和包的文档:

```text
# Module kotlin-demo

这段内容出现在你的模块名称之下.

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

使用 Gradle 的示例项目, 可以参见 [Dokka Gradle 示例](https://github.com/Kotlin/dokka/tree/{{ site.data.releases.dokkaVersion }}/examples/gradle/dokka-gradle-example).

## 向 Dokka 传递文件

要将文件传递给 Dokka, 你需要对 Gradle, Maven, 或 CLI, 使用相关的 **includes** 选项:

<div class="multi-language-sample" data-lang="gradle">

<p></p>
<p>
在
<a href="runners/dokka-gradle.html#source-set-configuration">源代码集配置</a>
中使用
<a href="runners/dokka-gradle.html#includes">includes</a>
选项.
</p>

</div>

<div class="multi-language-sample" data-lang="maven">

<p></p>
<p>
在
<a href="runners/dokka-maven.html#general-configuration">一般配置</a>
中使用
<a href="runners/dokka-maven.html#includes">includes</a>
选项.
</p>

</div>

<div class="multi-language-sample" data-lang="cli">

<p></p>
<p>
如果你使用命令行配置, 请在
<a href="runners/dokka-cli.html#source-set-options">源代码集选项</a>
中使用
<a href="runners/dokka-cli.html#includes-cli">includes</a>
选项.
</p>

<p>
如果你使用 JSON 配置, 请在
<a href="runners/dokka-cli.html#general-configuration">一般配置</a>
中使用
<a href="runners/dokka-cli.html#includes-json">includes</a>
选项.
</p>

</div>
