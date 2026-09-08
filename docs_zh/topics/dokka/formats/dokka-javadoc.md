[//]: # (title: Javadoc)
<primary-label ref="alpha"/>

> 这篇向导适用于 Dokka Gradle plugin (DGP) v2 模式. DGP v1 模式不再支持.
> 要从 v1 模式升级到 v2 模式, 请遵循 [迁移向导](dokka-migration.md).
>
{style="note"}

Dokka 的 Javadoc 输出格式与 Java 的
[Javadoc HTML 格式](https://docs.oracle.com/en/java/javase/19/docs/api/index.html)
类似.

它试图在视觉效果上模仿由 Javadoc 工具生成的 HTML 页面, 但它不是 Javadoc 的直接实现, 也不是完全一样的复制.

![Javadoc 输出格式](javadoc-format-example.png){width=706}

所有的 Kotlin 代码和签名都会以 Java 的视角来显示.
这是通过我们的
[Kotlin as Java Dokka plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)
来实现的, 这个 plugin 是 Dokka 默认附带的, 而且对这个格式会默认使用.

Javadoc 输出格式作为一个 [Dokka plugin](dokka-plugins.md) 来实现, 由 Dokka 开发组维护.
它是开源的, 源代码请参见 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-javadoc).

## 生成 Javadoc 文档 {id="generate-javadoc-documentation"}

> 对多项目构建和 Kotlin 跨平台项目, Dokka 不支持 Javadoc 格式 .
>
{style="tip"}


<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

[Gradle plugin for Dokka](dokka-gradle.md) 包含了 Javadoc 输出格式.
你需要在你的项目的 `build.gradle.kts` 文件的 `plugins {}` 代码段中, 适用相应的 plugin ID:

```kotlin
plugins {
    id("org.jetbrains.dokka-javadoc") version "%dokkaVersion%"
}
```

适用 plugin 之后, 你可以运行以下 task:

* `dokkaGenerate`, 根据适用的 plugin, 使用所有 [可用的格式](dokka-gradle.md#configure-documentation-output-format) 生成文档.
* `dokkaGeneratePublicationJavadoc`, 只使用 Javadoc 格式生成文档.

`javadoc.jar` 文件可以单独生成.
详情请参见, [构建 `javadoc.jar`](dokka-gradle.md#build-javadoc-jar).

</tab>
<tab title="Maven" group-key="mvn">

[Maven plugin for Dokka](dokka-maven.md) 包含了 Javadoc 输出格式.
你可以使用以下 goal 生成文档:

| **Goal**           | **描述**                                                              |
|--------------------|------------------------------------------------------------------------------|
| `dokka:javadoc`    | 生成 Javadoc 格式文档                                     |
| `dokka:javadocJar` | 生成 `javadoc.jar` 文件, 其中包含 Javadoc 格式文档 |


</tab>
<tab title="CLI" group-key="cli">

由于 Javadoc 输出格式是一个 [Dokka plugin](dokka-plugins.md#apply-dokka-plugins),
因此你需要
[下载 plugin 的 JAR 文件](https://repo1.maven.org/maven2/org/jetbrains/dokka/javadoc-plugin/%dokkaVersion%/javadoc-plugin-%dokkaVersion%.jar).

Javadoc 输出格式有 2 个依赖项, 你需要通过额外的 JAR 文件的方式提供:

* [kotlin-as-java plugin](https://repo1.maven.org/maven2/org/jetbrains/dokka/kotlin-as-java-plugin/%dokkaVersion%/kotlin-as-java-plugin-%dokkaVersion%.jar)
* [korte-jvm](https://repo1.maven.org/maven2/com/soywiz/korlibs/korte/korte-jvm/3.3.0/korte-jvm-3.3.0.jar)

通过 [命令行选项](dokka-cli.md#run-with-command-line-options) 方式:

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./javadoc-plugin-%dokkaVersion%.jar" \
     ...
```

通过 [JSON 配置](dokka-cli.md#run-with-json-configuration) 方式:

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./kotlin-as-java-plugin-%dokkaVersion%.jar",
    "./korte-jvm-3.3.0.jar",
    "./javadoc-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

更多详情, 请参见 CLI 运行器文档中的 [其他输出格式](dokka-cli.md#other-output-formats).

</tab>
</tabs>
