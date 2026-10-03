[//]: # (title: Dokka 入门)

下面你可以看到一段简单的指南, 帮助你开始学习使用 Dokka.

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

> 这篇向导适用于 Dokka Gradle plugin (DGP) v2 模式. DGP v1 模式不再支持.
> 要从 v1 模式升级到 v2 模式, 请遵循 [迁移向导](dokka-migration.md).
>
{style="note"}

**应用 Gradle Dokka plugin**

在你的项目的根构建脚本中应用 Dokka Gradle plugin (DGP):

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

**对多项目(multi-project)构建生成文档**

如果要对
[多项目(multi-project)构建](https://docs.gradle.org/current/userguide/multi_project_builds.html)
生成文档, 你需要对想要生成文档的每个子项目应用 plugin.
通过以下任何一种方法, 在子项目之间共用 Dokka 配置:

* 使用 Convention plugin
* 如果你没有使用 Convention plugin, 在各个子项目中直接配置

关于在多项目构建中共用 Dokka 配置, 详情请参见 [多项目配置](dokka-gradle.md#multi-project-configuration).

**生成文档**

要生成文档, 需要运行以下 Gradle task:

```bash
./gradlew :dokkaGenerate
```

这个 task 可以用于单项目构建, 也可以用于多项目构建.

在聚合项目中运行 `dokkaGenerate` task 时, 请对 task 加上项目路径(`:`)前缀. 例如:

```bash
./gradlew :dokkaGenerate

// 或

./gradlew :aggregatingProject:dokkaGenerate
```

不要运行 `./gradlew dokkaGenerate`, 应该运行 `./gradlew :dokkaGenerate` 或 `./gradlew :aggregatingProject:dokkaGenerate`.
task 没有项目路径(`:`)前缀时, Gradle 会试图运行整个构建中所有的 `dokkaGenerate` task, 这样可能导致不必要的额外工作.

你可以使用不同的 task 来生成 [HTML 格式](dokka-html.md), [Javadoc 格式](dokka-javadoc.md) 的输出,
或同时生成 [HTML 和 Javadoc 格式](dokka-gradle.md#configure-documentation-output-format) 的输出.

> 关于如何在 Gradle 中使用 Dokka, 详情请参见 [Gradle](dokka-gradle.md).
{style="tip"}

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

> 这篇向导适用于 Dokka Gradle plugin (DGP) v2 模式. DGP v1 模式不再支持.
> 要从 v1 模式升级到 v2 模式, 请遵循 [迁移向导](dokka-migration.md).
>
{style="note"}

**应用 Gradle Dokka plugin**

在你的项目的根构建脚本中应用 Dokka Gradle plugin (DGP):

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

**对多项目(multi-project)构建生成文档**

如果要对
[多项目(multi-project)构建](https://docs.gradle.org/current/userguide/multi_project_builds.html)
生成文档, 你需要对想要生成文档的每个子项目应用 plugin.
通过以下任何一种方法, 在子项目之间共用 Dokka 配置:

* 使用 Convention plugin
* 如果你没有使用 Convention plugin, 在各个子项目中直接配置

关于在多项目构建中共用 Dokka 配置, 详情请参见 [多项目配置](dokka-gradle.md#multi-project-configuration).

**生成文档**

要生成文档, 需要运行以下 Gradle task:

```bash
./gradlew :dokkaGenerate
```

这个 task 可以用于单个项目的构建, 也可以用于多项目构建.

在聚合项目中运行 `dokkaGenerate` task 时, 请对 task 加上项目路径(`:`)前缀. 例如:

```bash
./gradlew :dokkaGenerate

// 或

./gradlew :aggregatingProject:dokkaGenerate
```

不要运行 `./gradlew dokkaGenerate`, 应该运行 `./gradlew :dokkaGenerate` 或 `./gradlew :aggregatingProject:dokkaGenerate`.
task 没有项目路径(`:`)前缀时, Gradle 会试图运行整个构建中所有的 `dokkaGenerate` task, 这样可能导致不必要的额外工作.

你可以使用不同的 task 来生成 [HTML 格式](dokka-html.md), [Javadoc 格式](dokka-javadoc.md) 的输出,
或同时生成 [HTML 和 Javadoc 格式](dokka-gradle.md#configure-documentation-output-format) 的输出.

> 关于如何在 Gradle 中使用 Dokka, 详情请参见 [Gradle](dokka-gradle.md).
{style="tip"}

</tab>
<tab title="Maven" group-key="mvn">

在你的 POM 文件的 `plugins` 小节添加 Maven plugin for Dokka:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.dokka</groupId>
            <artifactId>dokka-maven-plugin</artifactId>
            <version>%dokkaVersion%</version>
            <executions>
                <execution>
                    <phase>pre-site</phase>
                    <goals>
                        <goal>dokka</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

要生成文档, 需要运行 `dokka:dokka` goal.

输出目录默认设置为 `target/dokka`.

关于如何在 Maven 中使用 Dokka, 更多详情请参见 [Maven](dokka-maven.md).

</tab>
</tabs>
