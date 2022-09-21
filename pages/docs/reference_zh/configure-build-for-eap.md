---
type: doc
layout: reference
category:
title: "针对 EAP 进行构建配置"
---

# 针对 EAP 进行构建配置

最终更新: {{ site.data.releases.latestDocDate }}

如果你使用 Kotlin 的 EAP 版创建新的项目, 你不需要进行任何额外的设置.
[Kotlin Plugin](install-eap-plugin.html) 会为你配置好一切!

你只需要为既有的项目手动配置你的构建 — 在安装 EAP 版之前创建的那些项目.

要配置你的构建, 使它使用 Kotlin 的 EAP 版, 你需要: 

* 指定 Kotlin 的 EAP 版. 详情请参见 [可用的 EAP 版](eap.html#build-details).
* 将依赖项版本修改为 EAP 版.
  Kotlin 的 EAP 版可能无法与前一个正式发布版的库共同工作. 

下文解释如何在 Gradle 和 Maven 中配置你的构建:

* [在 Gradle 中配置](#configure-in-gradle)
* [在 Maven 中配置](#configure-in-maven)

## 在 Gradle 中配置

本节介绍如何:

* [调整 Kotlin 版本](#adjust-the-kotlin-version)
* [调整依赖项中的版本](#adjust-versions-in-dependencies)

### 调整 Kotlin 版本

在 `build.gradle(.kts)` 的 `plugins` 部分, 将 `KOTLIN-EAP-VERSION` 修改为实际的 EAP 版本, 比如 `{{ site.data.releases.kotlinEapVersion }}`.
详情请参见 [可用的 EAP 版本](eap.html#build-details).

或者, 你也可以在 `settings.gradle(.kts)` 的 `pluginManagement` 部分指定 EAP 版本
– 详情请参见 [Gradle 文档](https://docs.gradle.org/current/userguide/plugins.html#sec:plugin_version_management).

下面是 Multiplatform 项目的示例.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    java
    kotlin("multiplatform") version "KOTLIN-EAP-VERSION"
}

repositories {
    mavenCentral()
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
plugins {
    id 'java'
    id 'org.jetbrains.kotlin.multiplatform' version 'KOTLIN-EAP-VERSION'
}

repositories {
    mavenCentral()
}
```

</div>
</div>

### 调整依赖项中的版本

如果在你的项目中使用 kotlinx 库, 你的库版本可能与 Kotlin 的 EAP 版不兼容.

要解决这个问题, 你需要在依赖项中指定兼容的库版本. 兼容的库一览表, 请参见 [EAP 版本详细列表](eap.html#build-details). 

> 大多数情况下, 我们只为某个发布版的第一个 EAP 版创建库, 这些库兼容这个发布版的后续 EAP 版.
> 如果在后面的 EAP 版中发生了不兼容的变更, 我们会发布新版本的库.
{:.note}

下面是示例.

对于 **kotlinx.coroutines** 库, 请添加版本号 – `{{ site.data.releases.coroutinesEapVersion }}`
– 这个版本兼容于 Kotlin 的 EAP 版 `{{ site.data.releases.kotlinEapVersion }}`. 

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.coroutinesEapVersion }}")
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
dependencies {
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.coroutinesEapVersion }}"
}
```

</div>
</div>

## 在 Maven 中配置

在下面的 Maven 项目定义示例中, 请将 `KOTLIN-EAP-VERSION` 替换为实际的版本, 比如 `{{ site.data.releases.kotlinEapVersion }}`.
详情请参见 [可用的 EAP 版本](eap.html#build-details).

```xml
<project ...>
    <properties>
        <kotlin.version>KOTLIN-EAP-VERSION</kotlin.version>
    </properties>

    <repositories>
        <repository>
           <id>mavenCentral</id>
           <url>https://repo1.maven.org/maven2/</url>
        </repository>
    </repositories>

    <pluginRepositories>
       <pluginRepository>
          <id>mavenCentral</id>
          <url>https://repo1.maven.org/maven2/</url>
       </pluginRepository>
    </pluginRepositories>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-stdlib</artifactId>
            <version>{{ site.data.releases.latest.version }}</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.jetbrains.kotlin</groupId>
                <artifactId>kotlin-maven-plugin</artifactId>
                <version>{{ site.data.releases.latest.version }}</version>
                ...
            </plugin>
        </plugins>
    </build>
</project>
```
