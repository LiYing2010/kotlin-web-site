[//]: # (title: Dokka 入门)

下面你可以看到一段简单的指南, 帮助你开始学习使用 Dokka.

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

在你的项目的根构建脚本中应用 Gradle plugin for Dokka:

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

如果要对
[多项目(multi-project)](https://docs.gradle.org/current/userguide/multi_project_builds.html)
构建生成文档, 你还需要对各个子项目应用 Gradle plugin:

```kotlin
subprojects {
    apply(plugin = "org.jetbrains.dokka")
}
```

要生成文档, 需要运行以下 Gradle task:

* `dokkaHtml`: 用于单项目构建
* `dokkaHtmlMultiModule`: 用于多项目构建

输出目录默认设置为 `/build/dokka/html` 和 `/build/dokka/htmlMultiModule`.

关于如何在 Gradle 中使用 Dokka, 更多详情请参见 [Gradle](dokka-gradle.md).

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

在你的项目的根构建脚本中应用 Gradle plugin for Dokka:

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

如果要对
[多项目(multi-project)](https://docs.gradle.org/current/userguide/multi_project_builds.html)
构建生成文档, 你还需要对各个子项目应用 Gradle plugin:

```groovy
subprojects {
    apply plugin: 'org.jetbrains.dokka'
}
```

要生成文档, 需要运行以下 Gradle task:

* `dokkaHtml`: 用于单项目构建
* `dokkaHtmlMultiModule`: 用于多项目构建

输出目录默认设置为 `/build/dokka/html` 和 `/build/dokka/htmlMultiModule`.

关于如何在 Gradle 中使用 Dokka, 更多详情请参见 [Gradle](dokka-gradle.md).

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
