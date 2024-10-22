[//]: # (title: Markdown)

> Markdown 输出格式还处于 Alpha 状态, 因此你在使用时可能遇到 bug, 或迁移问题.
> **使用这个功能时, 请自行承担风险.**
>
{style="warning"}

Dokka 能够生成 [GitHub 风格](#gfm) 和 [Jekyll](#jekyll) 兼容的 Markdown 格式文档.

使用这些格式, 你可以更加自由的将文档发布到网站, 因为输出可以嵌入到你的文档页面之内.
例如, 象 [OkHttp 的 API 参考文档](https://square.github.io/okhttp/5.x/okhttp/okhttp3/) 页面.

Markdown 输出格式作为 [Dokka plugins](dokka-plugins.md) 来实现, 由 Dokka 开发组维护, 并且是开源的.

## GFM {id="gfm"}

GFM 输出格式会生成 [GitHub 风格的 Markdown](https://github.github.com/gfm/) 格式的文档.

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Gradle plugin for Dokka](dokka-gradle.md) 包含了 GFM 输出格式.
你可以通过以下 task 使用它:

| **Task**              | **描述**                                                                                                             |
|-----------------------|--------------------------------------------------------------------------------------------------------------------|
| `dokkaGfm`            | 为单个项目生成生成 GFM 文档.                                                                                                  |
| `dokkaGfmMultiModule` | 只为多项目构建中的父项目创建的 [`MultiModule`](dokka-gradle.md#multi-project-builds) task. 它会为子项目生成文档, 并将所有的输出合并到单个位置, 使用共同的内容目录. |
| `dokkaGfmCollector`   | 只为多项目构建中的父项目创建的 [`Collector`](dokka-gradle.md#collector-tasks) task. 它会为每个子项目调用 `dokkaGfm`, 并将所有的输出合并到一个单独的虚拟项目.   |

</tab>

<tab title="Maven" group-key="Maven">

由于 GFM 格式是以 [Dokka plugin](dokka-plugins.md#apply-dokka-plugins) 方式实现的,
因此你需要以 plugin 依赖项的方式使用它:

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>gfm-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

完成上面的配置之后, 请运行 `dokka:dokka` goal 来生成 GFM 格式文档.

更多详情, 请参见 Maven plugin 文档中的 [其它输出格式](dokka-maven.md#other-output-formats).

</tab>

<tab title="CLI" group-key="cli">

由于 GFM 格式是以 [Dokka plugin](dokka-plugins.md#apply-dokka-plugins) 方式实现的,
因此你需要
[下载 JAR 文件](https://repo1.maven.org/maven2/org/jetbrains/dokka/gfm-plugin/%dokkaVersion%/gfm-plugin-%dokkaVersion%.jar)
并将它传递给 `pluginsClasspath`.

通过 [命令行选项](dokka-cli.md#run-with-command-line-options) 方式:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar" \
     ...
```

通过 [JSON 配置](dokka-cli.md#run-with-json-configuration) 方式:

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

更多详情, 请参见 CLI 运行器文档中的 [其它输出格式](dokka-cli.md#other-output-formats).

</tab>
</tabs>

源代码请参见 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-gfm).

## Jekyll {id="jekyll"}

Jekyll 输出格式生成 [Jekyll](https://jekyllrb.com/) 兼容的 Markdown 格式文档.

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Gradle plugin for Dokka](dokka-gradle.md) 包含了 Jekyll 输出格式.
你可以通过以下 task 使用它:

| **Task**                 | **描述**                                                                                                              |
|--------------------------|---------------------------------------------------------------------------------------------------------------------|
| `dokkaJekyll`            | 为单个项目生成生成 Jekyll 文档.                                                                                                |
| `dokkaJekyllMultiModule` | 只为多项目构建中的父项目创建的 [`MultiModule`](dokka-gradle.md#multi-project-builds) task. 它会为子项目生成文档, 并将所有的输出合并到单个位置, 使用共同的内容目录.  |
| `dokkaJekyllCollector`   | 只为多项目构建中的父项目创建的 [`Collector`](dokka-gradle.md#collector-tasks) task. 它会为每个子项目调用 `dokkaJekyll`, 并将所有的输出合并到一个单独的虚拟项目. |


</tab>

<tab title="Maven" group-key="Maven">

由于 Jekyll 格式是以 [Dokka plugin](dokka-plugins.md#apply-dokka-plugins) 方式实现的,
因此你需要以 plugin 依赖项的方式使用它:

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>jekyll-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

完成上面的配置之后, 请运行 `dokka:dokka` goal 来生成 GFM 格式文档.

更多详情, 请参见 Maven plugin 文档中的 [其它输出格式](dokka-maven.md#other-output-formats).

</tab>

<tab title="CLI" group-key="cli">

由于 Jekyll 格式是以 [Dokka plugin](dokka-plugins.md#apply-dokka-plugins) 方式实现的,
因此你需要
[下载 JAR 文件](https://repo1.maven.org/maven2/org/jetbrains/dokka/jekyll-plugin/%dokkaVersion%/jekyll-plugin-%dokkaVersion%.jar).
这个格式也是基于 [GFM](#gfm) 格式, 因此你还需要提供 GFM 格式的依赖项.
两个 JAR 文件都需要传递给 `pluginsClasspath`:

通过 [命令行选项](dokka-cli.md#run-with-command-line-options) 方式:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar;./jekyll-plugin-%dokkaVersion%.jar" \
     ...
```

通过 [JSON 配置](dokka-cli.md#run-with-json-configuration) 方式:

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./gfm-plugin-%dokkaVersion%.jar",
    "./jekyll-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

更多详情, 请参见 CLI 运行器文档中的 [其它输出格式](dokka-cli.md#other-output-formats).

</tab>
</tabs>

源代码请参见 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-jekyll).
