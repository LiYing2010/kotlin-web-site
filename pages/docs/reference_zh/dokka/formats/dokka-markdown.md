---
type: doc
layout: reference
category: dokka
title: "Markdown"
---

# Markdown

最终更新: {{ site.data.releases.latestDocDate }}

> Markdown 输出格式还处于 Alpha 状态, 因此你在使用时可能遇到 bug, 或迁移问题.
> **使用这个功能时, 请自行承担风险.**
{:.warning}

Dokka 能够生成 [GitHub 风格](#gfm) 和 [Jekyll](#jekyll) 兼容的 Markdown 格式文档.

使用这些格式, 你可以更加自由的将文档发布到网站, 因为输出可以嵌入到你的文档页面之内.
例如, 象 [OkHttp's API 参考文档](https://square.github.io/okhttp/4.x/okhttp/okhttp3/) 页面.

Markdown 输出格式作为 [Dokka plugins](../dokka-plugins.html) 来实现, 由 Dokka 开发组维护, 并且是开源的.

## GFM

GFM 输出格式会生成 [GitHub 风格的 Markdown](https://github.github.com/gfm/) 格式的文档.

<div class="multi-language-sample" data-lang="gradle">

<p></p>
<p>
<a href="../runners/dokka-gradle.html">Gradle plugin for Dokka</a> 包含了 GFM 输出格式.
你可以通过以下 task 使用它:
</p>

<table>
    <tr>
        <th>
            <b>Task</b>
        </th>
        <th>
            <b>描述</b>
        </th>
    </tr>
    <tr>
        <td>
            <p><code>dokkaGfm</code></p>
        </td>
        <td>
            为单个项目生成生成 GFM 文档.
        </td>
    </tr>
    <tr>
        <td>
            <p><code>dokkaGfmMultiModule</code></p>
        </td>
        <td>
            <p>只为多项目构建中的父项目创建的 <a href="../runners/dokka-gradle.html#multi-project-builds"><code>MultiModule</code></a> task.
            它会为子项目生成文档, 并将所有的输出合并到单个位置, 使用共同的内容目录.</p>
        </td>
    </tr>
    <tr>
        <td>
            <p><code>dokkaGfmCollector</code></p>
        </td>
        <td>
            <p>只为多项目构建中的父项目创建的 <a href="../runners/dokka-gradle.html#collector-tasks"><code>Collector</code></a> task.
            它会为每个子项目调用 <code>dokkaGfm</code>, 并将所有的输出合并到一个单独的虚拟项目.</p>
        </td>
    </tr>
</table>

</div>

<div class="multi-language-sample" data-lang="Maven">

<p></p>
<p>
由于 GFM 格式是以 <a href="../dokka-plugins.html#apply-dokka-plugins">Dokka plugin</a> 方式实现的,
因此你需要以 plugin 依赖项的方式使用它:
</p>

<div class="sample" markdown="1" mode="xml" theme="idea" data-lang="xml" data-highlight-only>

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
                <version>{{ site.data.releases.dokkaVersion }}</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

</div>

<p>
完成上面的配置之后, 请运行 <code>dokka:dokka</code> goal 来生成 GFM 格式文档.
</p>

<p>
更多详情, 请参见 Maven plugin 文档中的 <a href="../runners/dokka-maven.html#other-output-formats">其它输出格式</a>.
</p>

</div>

<div class="multi-language-sample" data-lang="CLI">

<p></p>
<p>
由于 GFM 格式是以 <a href="../dokka-plugins.html#apply-dokka-plugins">Dokka plugin</a> 方式实现的,
因此你需要
<a href="https://repo1.maven.org/maven2/org/jetbrains/dokka/gfm-plugin/{{ site.data.releases.dokkaVersion }}/gfm-plugin-{{ site.data.releases.dokkaVersion }}.jar">下载 JAR 文件</a>,
并将它传递给 <code>pluginsClasspath</code>.
</p>

<p>
通过 <a href="../runners/dokka-cli.html#run-with-command-line-options">命令行选项</a> 方式:
</p>

<div class="sample" markdown="1" mode="bash" theme="idea" data-lang="bash" data-highlight-only>

```Bash
java -jar dokka-cli-{{ site.data.releases.dokkaVersion }}.jar \
     -pluginsClasspath "./dokka-base-{{ site.data.releases.dokkaVersion }}.jar;...;./gfm-plugin-{{ site.data.releases.dokkaVersion }}.jar" \
     ...
```

</div>

<p>
通过 <a href="../runners/dokka-cli.html#run-with-json-configuration">JSON 配置</a> 方式:
</p>

<div class="sample" markdown="1" mode="json" theme="idea" data-lang="json" data-highlight-only>

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
</div>

<p>
更多详情, 请参见 CLI 运行器文档中的 <a href="../runners/dokka-cli.html#other-output-formats">其它输出格式</a>.
</p>

</div>

源代码请参见 <a href="https://github.com/Kotlin/dokka/tree/{{ site.data.releases.dokkaVersion }}/dokka-subprojects/plugin-gfm">GitHub</a>.

## Jekyll

Jekyll 输出格式生成 [Jekyll](https://jekyllrb.com/) 兼容的 Markdown 格式文档.

<div class="multi-language-sample" data-lang="Gradle">

<p></p>
<p>
<a href="../runners/dokka-gradle.html">Gradle plugin for Dokka</a> 包含了 Jekyll 输出格式.
你可以通过以下 task 使用它:
</p>

<table>
    <tr>
        <th>
            <b>Task</b>
        </th>
        <th>
            <b>描述</b>
        </th>
    </tr>
    <tr>
        <td>
            <p><code>dokkaJekyll</code></p>
        </td>
        <td>
            为单个项目生成生成 Jekyll 文档.
        </td>
    </tr>
    <tr>
        <td>
            <p><code>dokkaJekyllMultiModule</code></p>
        </td>
        <td>
            <p>只为多项目构建中的父项目创建的 <a href="../runners/dokka-gradle.html#multi-project-builds"><code>MultiModule</code></a> task.
            它会为子项目生成文档, 并将所有的输出合并到单个位置, 使用共同的内容目录.</p>
        </td>
    </tr>
    <tr>
        <td>
            <p><code>dokkaJekyllCollector</code></p>
        </td>
        <td>
            <p>只为多项目构建中的父项目创建的 <a href="../runners/dokka-gradle.html#collector-tasks"><code>Collector</code></a> task.
            它会为每个子项目调用 <code>dokkaJekyll</code>,  并将所有的输出合并到一个单独的虚拟项目.</p>
        </td>
    </tr>
</table>

</div>

<div class="multi-language-sample" data-lang="Maven">

<p></p>
<p>
由于 Jekyll 格式是以 <a href="../dokka-plugins.html#apply-dokka-plugins">Dokka plugin</a> 方式实现的,
因此你需要以 plugin 依赖项的方式使用它:
</p>

<div class="sample" markdown="1" mode="xml" theme="idea" data-lang="xml" data-highlight-only>

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
                <version>{{ site.data.releases.dokkaVersion }}</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

</div>

<p>
完成上面的配置之后, 请运行 <code>dokka:dokka</code> goal 来生成 GFM 格式文档.
</p>

<p>
更多详情, 请参见 Maven plugin 文档中的 <a href="../runners/dokka-maven.html#other-output-formats">其它输出格式</a>.
</p>

</div>

<div class="multi-language-sample" data-lang="CLI">

<p></p>
<p>
由于 Jekyll 格式是以 <a href="../dokka-plugins.html#apply-dokka-plugins">Dokka plugin</a> 方式实现的,
因此你需要
<a href="https://repo1.maven.org/maven2/org/jetbrains/dokka/jekyll-plugin/{{ site.data.releases.dokkaVersion }}/jekyll-plugin-{{ site.data.releases.dokkaVersion }}.jar">下载 JAR 文件</a>.
这个格式也是基于 <a href="#gfm">GFM</a> 格式, 因此你还需要提供 GFM 格式的依赖项.
两个 JAR 文件都需要传递给 <code>pluginsClasspath</code>:
</p>

<p>
通过 <a href="../runners/dokka-cli.html#run-with-command-line-options">命令行选项</a> 方式:
</p>

<div class="sample" markdown="1" mode="bash" theme="idea" data-lang="bash" data-highlight-only>

```Bash
java -jar dokka-cli-{{ site.data.releases.dokkaVersion }}.jar \
     -pluginsClasspath "./dokka-base-{{ site.data.releases.dokkaVersion }}.jar;...;./gfm-plugin-{{ site.data.releases.dokkaVersion }}.jar;./jekyll-plugin-{{ site.data.releases.dokkaVersion }}.jar" \
     ...
```

</div>

<p>
通过 <a href="../runners/dokka-cli.html#run-with-json-configuration">JSON 配置</a> 方式:
</p>

<div class="sample" markdown="1" mode="json" theme="idea" data-lang="json" data-highlight-only>

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-{{ site.data.releases.dokkaVersion }}.jar",
    "...",
    "./gfm-plugin-{{ site.data.releases.dokkaVersion }}.jar",
    "./jekyll-plugin-{{ site.data.releases.dokkaVersion }}.jar"
  ],
  ...
}
```
</div>

<p>
更多详情, 请参见 CLI 运行器文档中的 <a href="../runners/dokka-cli.html#other-output-formats">其它输出格式</a>.
</p>

</div>

源代码请参见 <a href="https://github.com/Kotlin/dokka/tree/{{ site.data.releases.dokkaVersion }}/dokka-subprojects/plugin-jekyll">GitHub</a>.
