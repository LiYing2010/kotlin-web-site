---
type: doc
layout: reference
category: dokka
title: "Javadoc"
---

# Javadoc

最终更新: {{ site.data.releases.latestDocDate }}

> Javadoc 输出格式还处于 Alpha 状态, 因此你在使用时可能遇到 bug, 或迁移问题. 
> 我们不保证能够与那些接受 Java 的 Javadoc HTML 格式作为输入的工具成功的集成.
> **使用这个功能时, 请自行承担风险.**
{:.warning}

Dokka 的 Javadoc 输出格式与 Java 的
[Javadoc HTML 格式](https://docs.oracle.com/en/java/javase/19/docs/api/index.html)
类似. 

它试图在视觉效果上模仿由 Javadoc 工具生成的 HTML 页面, 但它不是 Javadoc 的直接实现, 也不是完全一样的复制.

<img src="/assets/docs/images/dokka/javadoc-format-example.png" alt="javadoc 输出格式" width="706"/>

所有的 Kotlin 代码和签名都会以 Java 的视角来显示.
这是通过我们的
[Kotlin as Java Dokka plugin](https://github.com/Kotlin/dokka/tree/master/plugins/kotlin-as-java)
来实现的, 这个 plugin 是 Dokka 默认附带的, 而且对这个格式会默认使用.

Javadoc 输出格式作为一个 [Dokka plugin](../dokka-plugins.html) 来实现, 由 Dokka 开发组维护.
它是开源的, 源代码请参见 [GitHub](https://github.com/Kotlin/dokka/tree/master/plugins/javadoc).

## 生成 Javadoc 文档

> Javadoc 格式不支持跨平台项目.
{:.warning}

<div class="multi-language-sample" data-lang="gradle">

<p></p>
<p>
<a href="../runners/dokka-gradle.html">Gradle plugin for Dokka</a> 包含了 Javadoc 输出格式.
你可以使用以下 task:
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
            <p><code>dokkaJavadoc</code></p>
        </td>
        <td>
            为单个项目生成 Javadoc 文档.
        </td>
    </tr>
    <tr>
        <td>
            <p><code>dokkaJavadocCollector</code></p>
        </td>
        <td>
            <p>只为多项目构建中的父项目创建的 <a href="../runners/dokka-gradle.html#collector-tasks"><code>Collector</code></a> task.
            它会为每个子项目调用 <code>dokkaJavadoc</code>, 并将所有的输出合并到一个单独的虚拟项目.</p>
        </td>
    </tr>
</table>

<p>
    <code>javadoc.jar</code> 文件可以单数生成. 详情请参见, <a href="../runners/dokka-gradle.html#build-javadoc-jar">构建 <code>javadoc.jar</code></a>.
</p>

</div>

<div class="multi-language-sample" data-lang="maven">

<p></p>
<p>
<a href="../runners/dokka-maven.html">Maven plugin for Dokka</a> 包含了 Javadoc 输出格式.
你可以使用以下 goal 生成文档:
</p>

<table>
    <tr>
        <th>
            <b>Goal</b>
        </th>
        <th>
            <b>描述</b>
        </th>
    </tr>
    <tr>
        <td>
            <p><code>dokka:javadoc</code></p>
        </td>
        <td>
            生成 Javadoc 格式文档 
        </td>
    </tr>
    <tr>
        <td>
            <p><code>dokka:javadocJar</code></p>
        </td>
        <td>
            <p>生成 <code>javadoc.jar</code> 文件, 其中包含 Javadoc 格式文档</p>
        </td>
    </tr>
</table>

</div>

<div class="multi-language-sample" data-lang="cli">

<p></p>
<p>
由于 Javadoc 输出格式是一个 <a href="../dokka-plugins.html#apply-dokka-plugins">Dokka plugin</a>,
因此你需要下载 plugin 的
<a href="https://mvnrepository.com/artifact/org.jetbrains.dokka/javadoc-plugin/{{ site.data.releases.dokkaVersion }}">JAR 文件</a>.
</p>

<p>
Javadoc 输出格式有 2 个依赖项, 你需要通过额外的 JAR 文件的方式提供:
</p>

<p>
<list>
<li> <a href="https://mvnrepository.com/artifact/org.jetbrains.dokka/kotlin-as-java-plugin/{{ site.data.releases.dokkaVersion }}">kotlin-as-java plugin</a> </li>
<li> <a href="https://mvnrepository.com/artifact/com.soywiz.korlibs.korte/korte-jvm/3.3.0">korte-jvm</a> </li>
</list>
</p>

<p>
通过 <a href="../runners/dokka-cli.html#run-with-command-line-options">命令行选项</a> 方式:
</p>

<div class="sample" markdown="1" mode="bash" theme="idea" data-lang="bash" data-highlight-only>

```Bash
java -jar dokka-cli-{{ site.data.releases.dokkaVersion }}.jar \
     -pluginsClasspath "./dokka-base-{{ site.data.releases.dokkaVersion }}.jar;...;./javadoc-plugin-{{ site.data.releases.dokkaVersion }}.jar" \
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
    "./kotlin-as-java-plugin-{{ site.data.releases.dokkaVersion }}.jar",
    "./korte-jvm-3.3.0.jar",
    "./javadoc-plugin-{{ site.data.releases.dokkaVersion }}.jar"
  ],
  ...
}
```

</div>

<p>
更多详情, 请参见 CLI 运行器文档中的 <a href="../runners/dokka-cli.html#other-output-formats">其他输出格式</a>.
</p>

</div>
