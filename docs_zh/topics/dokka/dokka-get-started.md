---
type: doc
layout: reference
category: dokka
title: "Dokka 入门"
---

# Dokka 入门

最终更新: {{ site.data.releases.latestDocDate }}

下面你可以看到一段简单的指南, 帮助你开始学习使用 Dokka.

<div class="multi-language-sample" data-lang="kotlin">

<p></p>

<p>
在你的项目的根构建脚本中应用 Gradle plugin for Dokka:
</p>

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    id("org.jetbrains.dokka") version "{{ site.data.releases.dokkaVersion }}"
}
```

</div>

<p>
如果要对
<a href="https://docs.gradle.org/current/userguide/multi_project_builds.html">多项目(multi-project)</a>
构建生成文档, 你还需要对各个子项目应用 Gradle plugin:
</p>

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
subprojects {
    apply(plugin = "org.jetbrains.dokka")
}
```

</div>

<p>
要生成文档, 需要运行以下 Gradle task:
<list>
    <li> <code>dokkaHtml</code>: 用于单项目构建 </li>
    <li> <code>dokkaHtmlMultiModule</code>: 用于多项目构建 </li>
</list>
</p>

<p>
输出目录默认设置为 <code>/build/dokka/html</code> 和 <code>/build/dokka/htmlMultiModule</code>.
</p>

<p>
关于如何在 Gradle 中使用 Dokka, 更多详情请参见 <a href="runners/dokka-gradle.html">Gradle</a>.
</p>

</div>

<div class="multi-language-sample" data-lang="groovy">

<p></p>
<p>
在你的项目的根构建脚本中应用 Gradle plugin for Dokka:
</p>

<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy" data-highlight-only>

```groovy
plugins {
    id 'org.jetbrains.dokka' version '{{ site.data.releases.dokkaVersion }}'
}
```

</div>

<p>
如果要对
<a href="https://docs.gradle.org/current/userguide/multi_project_builds.html">多项目(multi-project)</a>
构建生成文档, 你还需要对各个子项目应用 Gradle plugin:
</p>

<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy" data-highlight-only>

```groovy
subprojects {
    apply plugin: 'org.jetbrains.dokka'
}
```

</div>

<p>
要生成文档, 需要运行以下 Gradle task:
<list>
    <li> <code>dokkaHtml</code>: 用于单项目构建 </li>
    <li> <code>dokkaHtmlMultiModule</code>: 用于多项目构建 </li>
</list>
</p>

<p>
输出目录默认设置为 <code>/build/dokka/html</code> 和 <code>/build/dokka/htmlMultiModule</code>.
</p>

<p>
关于如何在 Gradle 中使用 Dokka, 更多详情请参见 <a href="runners/dokka-gradle.html">Gradle</a>.
</p>

</div>

<div class="multi-language-sample" data-lang="maven">

<p></p>
<p>
在你的 POM 文件的 <code>plugins</code> 小节添加 Maven plugin for Dokka:
</p>

<div class="sample" markdown="1" mode="xml" theme="idea" data-lang="xml" data-highlight-only>

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.dokka</groupId>
            <artifactId>dokka-maven-plugin</artifactId>
            <version>{{ site.data.releases.dokkaVersion }}</version>
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

</div>

<p>
要生成文档, 需要运行 <code>dokka:dokka</code> goal.
</p>

<p>
输出目录默认设置为 <code>target/dokka</code>.
</p>

<p>
关于如何在 Maven 中使用 Dokka, 更多详情请参见 <a href="runners/dokka-maven.html">Maven</a>.
</p>

</div>
