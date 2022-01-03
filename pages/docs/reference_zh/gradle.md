---
type: doc
layout: reference
title: "Gradle"
---

# Gradle

本页面最终更新: 2022/02/25

要使用 Gradle 编译一个 Kotlin 项目, 你需要 [在你的项目中应用 Kotlin Gradle plugin](#plugin-and-versions),
然后 [配置依赖项](#configuring-dependencies).

## Plugin 与版本

要应用 Kotlin Gradle 插件, 可以使用
[Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block),

Kotlin Gradle 插件 和 `kotlin-multiplatform` 插件 {{ site.data.releases.latest.version }} 版
需要 Gradle {{ site.data.releases.minGradleVersion }} 或更高版本.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins {
  kotlin("<...>") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
  id 'org.jetbrains.kotlin.<...>' version '{{ site.data.releases.latest.version }}'
}
```

</div>
</div>

占位符 `<...>` 需要替换为某个 plugin 名称, 详情请参见本章的后续小节.

## 编译到多个目标平台

编译到 [多个目标平台](mpp-supported-platforms.html) 的项目, 称为 [跨平台项目](mpp-intro.html),
需要使用 `kotlin-multiplatform` 插件.
详情请阅读 [关于 `kotlin-multiplatform` 插件](mpp-discover-project.html#multiplatform-plugin).

> `kotlin-multiplatform` 插件要求 Gradle {{ site.data.releases.minGradleVersion }} 或更高版本.
{:.note}

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
plugins {
  kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
plugins {
  id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}
```

</div>
</div>

## 编译到 JVM 平台

要编译到 JVM 平台, 需要应用(apply) Kotlin JVM plugin.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    kotlin("jvm") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only>

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

在这段代码中, `version` 必须是写明的字面值, 不能通过其他编译脚本得到.

另一种方法是, 也可以使用旧的 `apply plugin` 模式:

```groovy
apply plugin: 'kotlin'
```

在 Kotlin Gradle DSL 中, 不推荐使用 `apply` 来应用 Kotlin plugin.
[原因请参见这里](#using-the-gradle-kotlin-dsl).

### Kotlin 源代码与 Java 源代码

Kotlin 源代码与 Java 源代码可以保存在相同的文件夹下, 也可以放在不同的文件夹下.
默认的约定是使用不同的文件夹:

```groovy
project
    - src
        - main (root)
            - kotlin
            - java
```

如果不使用默认约定的文件夹结构, 那么需要修改相应的 `sourceSets` 属性:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
sourceSets.main {
    java.srcDirs("src/main/myJava", "src/main/myKotlin")
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

</div>
</div>

### 对相关联的编译任务检查 JVM 编译目标的兼容性

在构建模块中, 你可能会有多个相互关联的编译任务, 比如:
* `compileKotlin` 和 `compileJava`
* `compileTestKotlin` 和 `compileTestJava`

> `main` 和 `test` 源代码集的编译任务之间没有关联.
{:.note}

对于这种相互关联的编译任务, Kotlin Gradle plugin 会检查 JVM 编译目标的兼容性.
`kotlin` 扩展中的 `jvmTarget` 和 `java` 扩展中的 [`targetCompatibility`](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension) 如果设置为不同的值, 会导致不兼容.
比如:
`compileKotlin` 任务设置为 `jvmTarget=1.8`,
而 `compileJava` 任务设置为 (或 [继承得到](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)) `targetCompatibility=15`.

要对这个兼容性检查进行配置, 可以在 `build.gradle` 文件中设置 `kotlin.jvm.target.validation.mode` 属性为以下几个值:
* `warning` – 默认值; Kotlin Gradle plugin 会输出警告信息.
* `error` – plugin 会认为构建失败.
* `ignore` – plugin 会跳过检查, 不输出任何警告信息.

### 设置自定义的 JDK home 路径

Kotlin 编译任务默认使用当前 Gradle 的 JDK.
如果出于某些原因需要更换 JDK, 你可以设置 JDK home:
* 对于 Gradle 6.7 或更高版本 – 可以使用 [Java 工具链](#gradle-java-toolchains-support) 或 [Task DSL](#setting-jdk-version-with-the-task-dsl) 设置本地 JDK.
* 对于没有 Java 工具链的更早版本 Gradle (6.6 或以下) – 可以使用 [`UsesKotlinJavaToolchain` 接口和 Task DSL](#setting-jdk-version-with-the-task-dsl).

> 从 Kotlin 1.5.30 开始, `jdkHome` 编译器选项已被废弃.
{:.warning}

请注意, 使用自定义 JDK 时 [kapt 任务执行器](kapt.html#running-kapt-tasks-in-parallel)
只会使用 [进程隔离模式](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode),
会忽略 `kapt.workers.isolation` 属性.

### Gradle Java 工具链支持

Gradle 6.7 引入了 [Java 工具链支持](https://docs.gradle.org/current/userguide/toolchains.html).
通过这个功能, 你能够:
* 使用与 Gradle 不同的 JDK 和 JRE 来运行编译, 测试, 以及可执行程序.
* 使用还未发布的语言版本编译和测试代码.

通过工具链支持, Gradle 能够自动查找本地的 JDK, 还能安装 Gradle 运行构建时需要的 JDK.
目前 Gradle 自身能够在任何 JDK 上运行, 而且还对依赖于主要 JDK 版本的任务重用 [远程构建缓存功能](#gradle-build-cache-support).

Kotlin Gradle plugin 对 Kotlin/JVM 编译任务支持 Java 工具链. JS 和 Native 任务则不会使用工具链.
Kotlin 编译器永远会使用运行 Gradle daemon 的 JDK.
Java 工具链会:
* 对 JVM 编译目标设置 [`jdkHome` 选项](#attributes-specific-to-jvm).
* 如果用户没有明确设置 `jvmTarget` 选项,
  则将 [`kotlinOptions.jvmTarget`](#attributes-specific-to-jvm) 设置为工具链的 JDK 版本.
  如果用户没有配置工具链, 那么 `jvmTarget` 会使用默认值.
  详情请参见 [JVM 编译目标兼容性](#check-for-jvm-target-compatibility-of-related-compile-tasks).
* 影响 [`kapt` 任务执行器](kapt.html#running-kapt-tasks-in-parallel) 使用哪个 JDK.

可以使用以下代码来设置工具链. 请将占位符 `<MAJOR_JDK_VERSION>` 替换为你想要使用的 JDK 版本:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    jvmToolchain {
        (this as JavaToolchainSpec).languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

</div>
</div>

注意, 使用 `kotlin` 扩展设置工具链也会改变 Java 编译任务的工具链.

也可以通过 `java` 扩展设置工具链, Kotlin 编译任务也会使用它:

```kotlin
java {
    toolchain {
      languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
    }
}
```

要对特定的任务设置任何 JDK (即使是本地的), 请使用 Task DSL.

### 使用 Task DSL 设置 JDK 版本

如果使用 Gradle 6.7 以前的版本, 那么就没有 [Java 工具链支持](#gradle-java-toolchains-support) 功能.
你可以使用 Task DSL, 对任何实现了 `UsesKotlinJavaToolchain` 接口的任务, 设置任意的 JDK 版本.
目前, 这些任务只有 `KotlinCompile` 和 `KaptTask`.
如果希望 Gradle 搜索主要的 JDK 版本, 请在你的构建脚本中替换 `<MAJOR_JDK_VERSION>` 占位符:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
val service = project.extensions.getByType<JavaToolchainService>()
val customLauncher = service.launcherFor {
    it.languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
}
project.tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
JavaToolchainService service = project.getExtensions().getByType(JavaToolchainService.class)
Provider<JavaLauncher> customLauncher = service.launcherFor {
    it.languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) // "8"
}
tasks.withType(UsesKotlinJavaToolchain::class).configureEach { task ->
    task.kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</div>
</div>

或者你特也可以指定你的本地 JDK 路径, 然后使用这个 JDK 版本替换 `<LOCAL_JDK_VERSION>` 占位符:

```kotlin
tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.jdk.use(
        "/path/to/local/jdk", // 这里设置你的 JDK 路径
        JavaVersion.<LOCAL_JDK_VERSION> // 比如, JavaVersion.17
    )
}
```

## 编译到 JavaScript

如果编译的目标平台只有 JavaScript, 请使用 `kotlin-js` 插件.
详情请阅读 [相关文档](js-project-setup.html):

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    kotlin("js") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only>

```groovy
plugins {
    id 'org.jetbrains.kotlin.js' version '{{ site.data.releases.latest.version }}'
}
```

</div>
</div>

### JavaScript 项目的 Kotlin 源代码与 Java 源代码

这个 plugin 只能编译 Kotlin 源代码文件, 因此推荐将 Kotlin 和 Java 源代码文件放在不同的文件夹内(如果工程内包含 Java 文件的话).
如果不将源代码分开存放, 请在 `sourceSets` 代码段中指定源代码文件夹 block:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets["main"].apply {    
        kotlin.srcDir("src/main/myKotlin")
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'src/main/myKotlin'
    }
}
```

</div>
</div>

## 编译到 Android 平台

建议使用 Android Studio 来创建 Android 应用程序.
详情请阅读 [如何使用 Android Gradle plugin](https://developer.android.com/studio/releases/gradle-plugin).

## 配置依赖项

如果要添加一个库的依赖, 需要在 source set DSL 中的 `dependencies` 代码段内,
设置必要 [类型](#dependency-types) 的依赖项 (比如, `implementation`).

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("com.example:my-library:1.0")
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'com.example:my-library:1.0'
            }
        }
    }
}
```

</div>
</div>

或者, 你也可以 [在最顶层设置依赖项](#set-dependencies-at-the-top-level).

### 依赖项的类型

请根据你的需要选择依赖项的类型.

<table>
    <tr>
        <th>类型</th>
        <th>解释</th>
        <th>使用场景</th>
    </tr>
    <tr>
        <td><code>api</code></td>
        <td>编译期和运行期都会使用, 并导出给库的使用者.</td>
        <td>如果在当前模块的公开 API 中使用了一个依赖项中的任何类型, 请使用 <code>api</code> 依赖项.
        </td>
    </tr>
    <tr>
        <td><code>implementation</code></td>
        <td>对当前模块的编译期和运行期都会使用, 如果其他模块使用 `implementation` 依赖本模块,
            那么对于其他模块的编译, 这个依赖项不会导出</td>
        <td>
            <p>对于模块的内部逻辑所需要的依赖项, 请使用这种类型.</p>
            <p>如果一个模块是一个终端应用程序(endpoint application), 而且不对外公布(publish),
              那么请使用 <code>implementation</code> 依赖项而不是 <code>api</code> 依赖项.</p>
        </td>
    </tr>
    <tr>
        <td><code>compileOnly</code></td>
        <td>只用来编译当前模块, 在运行期不可用, 在编译其他模块时也不可用.</td>
        <td>如果 API 在运行时存在第三方的实现, 那么可以使用这种依赖项.</td>
    </tr>
    <tr>
        <td><code>runtimeOnly</code></td>
        <td>运行时可用, 但在任何模块的编译期都不可用.</td>
        <td></td>
    </tr>
</table>


### 对标准库的依赖项

对每个源代码集(Source Set), 会自动添加对标准库 (`stdlib`) 的依赖项.
使用的标准库版本与 Kotlin Gradle plugin 版本相同.

对于与平台相关的源代码集, 会使用针对这个平台的标准库, 同时, 对其他源代码集会添加共通的标准库.
Kotlin Gradle plugin 会根据你的 Gradle 构建脚本的 `kotlinOptions.jvmTarget` [编译器选项](#compiler-options) 设置,
选择适当的 JVM 标准库.

如果明确的声明一个标准库依赖项(比如, 如果你需要使用不同的版本), Kotlin Gradle plugin 不会覆盖你的设置, 也不会添加第二个标准库.

如果你完全不需要标准库, 那么可以在 `gradle.properties` 文件中添加选项来关闭它:

```kotlin
kotlin.stdlib.default.dependency=false
```

### 设置对测试库的依赖项

对于支持的所有平台, Kotlin 项目的测试可以使用
[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API.

对 `commonTest` 源代码集添加 `kotlin-test` 依赖项,
然后 Gradle 插件会为每个测试源代码集推断出对应的测试库依赖项:

* 对共通源代码集, 会添加 `kotlin-test-common` 和 `kotlin-test-annotations-common` 依赖项
* 对 JVM 源代码集, 会添加 `kotlin-test-junit` 依赖项
* 对 Kotlin/JS 源代码集, 会添加 `kotlin-test-js` 依赖项

Kotlin/Native 编译目标已经内建了 `kotlin.test` API 的实现, 不需要额外的测试依赖项.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test")) // 这个设置会自动引入对应平台的所有依赖项
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // 这个设置会自动引入对应平台的所有依赖项
            }
        }
    }
}
```

</div>
</div>

> 对 Kotlin 模块的依赖项, 可以使用简写, 比如, 对 "org.jetbrains.kotlin:kotlin-test" 的依赖项可以简写为 kotlin("test").
{:.note}

你也可以在任何共通的或平台相关的源代码集中使用 `kotlin-test` 依赖项.

对于 Kotlin/JVM, Gradle 默认使用 JUnit 4. 因此, `kotlin("test")` 依赖项会解析为 JUnit 4 的变体,
名为 `kotlin-test-junit`.

也可以选择使用 JUnit 5 或 TestNG, 方法是在构建脚本的测试任务中调用
[`useJUnitPlatform()`]( https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)
或
[`useTestNG()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useTestNG).
下面是一个跨平台(MPP) 项目的示例:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    jvm {
        testRuns["test"].executionTask.configure {
            useJUnitPlatform()
        }
    }
    sourceSets {
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test"))
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm {
        testRuns["test"].executionTask.configure {
            useJUnitPlatform()
        }
    }
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test")
            }
        }
    }
}
```

</div>
</div>

下面是一个 JVM 项目的示例:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
dependencies {
    testImplementation(kotlin("test"))
}

tasks {
    test {
        useTestNG()
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
dependencies {
    testImplementation 'org.jetbrains.kotlin:kotlin-test'
}

test {
    useTestNG()
}
```

</div>
</div>

[学习在 JVM 平台上如何使用 JUnit 测试代码](jvm-test-using-junit.html).

如果需要使用不同的 JVM 测试框架, 可以关闭测试框架的自动选择,
方法是在项目的 `gradle.properties` 文件添加 `kotlin.test.infer.jvm.variant=false`.
然后, 再将需要的测试框架添加为 Gradle 依赖项.

如果在你的构建脚本中明确使用了 `kotlin("test")` 的变体, 而且项目的构建脚本出现兼容性冲突问题, 不再正常工作,
请参见 [兼容性指南中的这个问题](compatibility-guide-15.html#do-not-mix-several-jvm-variants-of-kotlin-test-in-a-single-project).

### 设置对 kotlinx 库的依赖项

如果使用 kotlinx 库, 并且需要与平台相关的依赖项, 那么可以通过 `-jvm` 或 `-js` 之类的后缀,
来指定与平台相关的库版本, 比如, `kotlinx-coroutines-core-jvm`.
也可以使用库的基本 artifact 名(base artifact name) – `kotlinx-coroutines-core`.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:{{ site.data.releases.latest.coroutines.version }}")
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin {
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:{{ site.data.releases.latest.coroutines.version }}'
            }
        }
    }
}
```

</div>
</div>

如果使用跨平台的库, 并且需要依赖共用代码, 那么只需要在共用源代码集中一次性设置依赖项.
请使用库的基本 artifact 名(base artifact name), 比如 `kotlinx-coroutines-core` 或 `ktor-client-core`.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}")
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}'
            }
        }
    }
}
```

</div>
</div>

### 在最顶层设置依赖项

另一种做法是, 可以在最顶层指定依赖项, 方法是使用格式的配置名称 `<sourceSetName><DependencyType>`.
对于某些 Gradle 内建的依赖项, 比如 `gradleApi()`, `localGroovy()`, 或 `gradleTestKit()`, 这种方法会很有用,
这些依赖项在 Source Set 依赖项 DSL 中是不能使用的.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
dependencies {
    "commonMainImplementation"("com.example:my-library:1.0")
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
dependencies {
    commonMainImplementation 'com.example:my-library:1.0'
}
```

</div>
</div>


## 注解处理

Kotlin 通过 Kotlin 注解处理工具 [`kapt`](kapt.html) 来支持注解处理.
kapt 在 Gradle 中的使用方法请参见 [kapt 章节](kapt.html).

## 增量编译(Incremental compilation)

Kotlin Gradle plugin 支持增量编译模式.
增量编译模式会监视源代码文件在两次编译之间的变更, 因此只会编译那些变更过的文件.

增量编译模式支持 Kotlin/JVM 和 Kotlin/JS 工程, 并且默认开启.

有以下几种方式可以关闭增量编译设定:

* 对 Kotlin/JVM 项目: `kotlin.incremental=false` .
* 对 Kotlin/JS 项目: `kotlin.incremental.js=false` .
* 在命令行参数中, 添加 `-Pkotlin.incremental=false` 或 `-Pkotlin.incremental.js=false` .

需要向所有后续的编译命令都添加这个参数,
而且任何一次编译如果关闭了增量编译模式, 都会导致增量编译的缓存失效.

初次编译不会是增量编译.

## 对 Gradle 编译缓存的支持

Kotlin 插件支持 [Gradle 编译缓存](https://docs.gradle.org/current/userguide/build_cache.html),
这个功能会保存编译的输出, 并在未来的编译中重复使用.

如果想要对所有的 Kotlin 编译任务禁用缓存, 可以将系统属性 `kotlin.caching.enabled` 设置为 `false`
(也就是使用参数 `-Dkotlin.caching.enabled=false` 来执行编译).

如果使用 [kapt](kapt.html), 请注意, 注解处理任务默认不会缓存.
但你可以 [手动启用缓存功能](kapt.html#gradle-build-cache-support).

## Gradle 配置缓存支持

> 配置缓存功能是一个实验性功能, 从 Gradle 6.5 或更高版本开始支持.
> 请到 [Gradle 发布页面](https://gradle.org/releases/) 查看这个功能是否被提升到稳定状态.
{:.note}

Kotlin plugin 使用 [Gradle 配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html),
通过重用配置阶段的结果来增加构建处理的速度.

关于如何启用配置缓存, 请参见
[Gradle 文档](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage).
启用这个功能之后, Kotlin Gradle plugin 会自动开始使用它.

## 编译选项

可以使用 Kotlin 编译任务的 `kotlinOptions` 属性来指定定额外的编译选项.

当编译的目标平台为 JVM 时, 编译产品代码的编译任务名为 `compileKotlin`,
编译测试代码的编译任务名为 `compileTestKotlin`.
针对自定义源代码集的编译任务名, 是与源代码集名称对应的 `compile<Name>Kotlin`.

Android 项目的编译任务名称, 包含
[构建变体(build variant)](https://developer.android.com/studio/build/build-variants.html)
的名称, 完整名称是 `compile<BuildVariant>Kotlin`,
比如, `compileDebugKotlin`, `compileReleaseUnitTestKotlin`.

当编译的目标平台为 JavaScript 时, 产品代码的编译任务名是 `compileKotlinJs`,
测试代码的编译任务名是 `compileTestKotlinJs`,
针对自定义源代码集的编译任务名, 是 `compile<Name>KotlinJs`.

要对单个编译任务进行配置, 请使用它的名称. 示例如下:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
// ...

val compileKotlin: KotlinCompile by tasks

compileKotlin.kotlinOptions.suppressWarnings = true
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
compileKotlin {
    kotlinOptions.suppressWarnings = true
}

//或者

compileKotlin {
    kotlinOptions {
        suppressWarnings = true
    }
}
```

</div>
</div>

注意, 使用 Gradle Kotlin DSL 时, 你应该先从编译工程的 `tasks` 属性得到编译任务.

编译 JavaScript 和 Common 时, 请使用相应的 `Kotlin2JsCompile` 和 `KotlinCompileCommon` 类型.

也可以对项目中的所有 Kotlin 编译任务进行配置:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    kotlinOptions { /*...*/ }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
    kotlinOptions { /*...*/ }
}
```
</div>
</div>

Gradle 任务所支持的选项完整列表如下:

### JVM, JS, 和 JS DCE 任务支持的共通属性

| 属性名称 | 描述 | 可以选择的值 |默认值 |
|------|-------------|-----------------|--------------|
| `allWarningsAsErrors` | 把警告作为错误来处理 |  | false |
| `suppressWarnings` | 不产生警告信息 |  | false |
| `verbose` | 输出详细的 log 信息. 只在 [Gradle debug log 级别启用](https://docs.gradle.org/current/userguide/logging.html) 时有效 |  | false |
| `freeCompilerArgs` | 指定额外的编译参数, 可以是多个 |  | [] |

### JVM 和 JS 任务支持的共通属性

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `apiVersion` | 只允许使用指定的版本的运行库中的 API | "1.3" (已废弃 DEPRECATED), "1.4" (已废弃 DEPRECATED), "1.5", "1.6", "1.7" (实验性功能) |  |
| `languageVersion` | 指定源代码所兼容的 Kotlin 版本 | "1.4" (已废弃 DEPRECATED), "1.5", "1.6", "1.7" (实验性功能) |  |

### JVM 任务独有的属性

| 属性名称 | 描述 | 可以选择的值 |默认值 |
|------|-------------|-----------------|--------------|
| `javaParameters` | 为 Java 1.8 的方法参数反射功能生成 metadata |  | false |
| `jdkHome` | 将指定路径中的 JDK 添加到 classpath 内, 不使用默认的 JAVA_HOME. 从 1.5.30 开始, 这个选项的直接使用已被废弃, 请使用 [其他方法设置这个选项](#set-custom-jdk-home).  |  |  |
| `jvmTarget` | 指定编译输出的 JVM 字节码的版本 | "1.6" (已废弃 DEPRECATED), "1.8", "9", "10", "11", "12", "13", "14", "15", "16", "17" | "{{ site.data.releases.defaultJvmTargetVersion }}" |
| `noJdk` | 不要自动将 Java 运行库包含到 classpath 内 |  | false |
| `useOldBackend` | 使用 [旧的 JVM 后端](whatsnew15.html#stable-jvm-ir-backend) |  | false |

### JS 任务独有的属性

| 属性名称 | 描述 | 可以选择的值 |默认值 |
|------|-------------|-----------------|--------------|
| `friendModulesDisabled` | 指定是否关闭内部声明的输出 |  | false |
| `main` | 指定执行时是否调用 main 函数 | "call", "noCall" | "call" |
| `metaInfo` | 指定是否生成带有 metadata 的 .meta.js 和 .kjsm 文件. 用于创建库 |  | true |
| `moduleKind` | 指定编译器生成的 JS 模块类型 | "umd", "commonjs", "amd", "plain"  | "umd" |
| `noStdlib` | 不要自动将 Kotlin/JS 标准库添加到编译依赖项中 |  | true |
| `outputFile` | 指定编译结果输出的 *.js 文件 |  | "\<buildDir>/js/packages/\<project.name>/kotlin/\<project.name>.js" |
| `sourceMap` | 指定是否生成源代码映射文件(source map) |  | true |
| `sourceMapEmbedSources` | 指定是否将源代码文件嵌入到源代码映射文件中 | "never", "always", "inlining" |  |
| `sourceMapPrefix` | 对源代码映射文件中的路径添加一个指定的前缀 |  |  |
| `target` | 指定生成的 JS 文件 的 ECMA 版本 | "v5" | "v5" |
| `typedArrays` | 将基本类型数组转换为 JS 的有类型数组 arrays |  | true |

## 生成文档

要对 Kotlin 项目生成文档, 请使用 [Dokka](https://github.com/Kotlin/dokka);
相关的配置方法, 请参见 [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-gradle-plugin).
Dokka 支持混合语言的项目, 可以将文档输出为多种格式, 包括标准的 JavaDoc 格式.

## OSGi

关于对 OSGi 的支持, 请参见 [Kotlin 与 OSGi](kotlin-osgi.html).

## 使用 Gradle Kotlin DSL

使用 [Gradle Kotlin DSL](https://github.com/gradle/kotlin-dsl) 时, 请使用 `plugins { ... }` 来添加 Kotlin 插件.
如果你使用 `apply { plugin(...) }` 来添加插件, 可能会发生错误, 无法解析那些由 Gradle Kotlin DSL 生成的扩展.
为了解决这个问题, 可以将出错的代码注释掉, 执行 Gradle 的 `kotlinDslAccessorsSnapshot` 任务,
再将代码添加回来, 然后重新编译, 或者重新将工程导入到 IDE.

## Kotlin daemon 及其在 Gradle 中的使用

Kotlin daemon 会:
* 与 Gradle daemon 共同运行来编译项目.
* 当你使用 IntelliJ IDEA 内建的构建系统来编译项目时, 它会单独运行.

在 Gradle 的 [执行阶段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:build_phases),
当一个 Kotlin 编译任务开始编译源代码时, Kotlin daemon 就会启动.
Kotlin daemon 会和 Gradle daemon 一起停止, 或在没有 Kotlin 编译任务执行, 空闲 2 个小时之后停止.

Kotlin daemon 使用与 Gradle daemon 相同的 JDK.

### 设置 Kotlin daemon 的 JVM 参数

以下列表中的每个选项都会覆盖它之前的选项:
* 如果不做任何设定, Kotlin daemon 会从 Gradle daemon 继承 JVM 参数.
  比如, 在 `gradle.properties` 文件中:

 ```properties
  org.gradle.jvmargs=-Xmx1500m -Xms=500m
  ```

* 如果 Gradle daemon 的 JVM 参数包含 `kotlin.daemon.jvm.options` 系统属性 – 请在 `gradle.properties` 文件中指定:

 ```properties
  org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=-Xmx1500m -Xms=500m
  ```

* 你可以在 `gradle.properties` 文件中添加 `kotlin.daemon.jvmargs` 属性:

 ```properties
  kotlin.daemon.jvmargs=-Xmx1500m -Xms=500m
  ```

* 你可以在 `kotlin` 扩展中指定参数:

  <div class="multi-language-sample" data-lang="kotlin">
  <div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

  ```kotlin
  kotlin {
      kotlinDaemonJvmArgs = listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC")
  }
  ```

  </div>
  </div>

  <div class="multi-language-sample" data-lang="groovy">
  <div class="sample" markdown="1" theme="idea" mode='groovy'>

  ```groovy
  kotlin {
      kotlinDaemonJvmArgs = ["-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"]
  }
  ```

  </div>
  </div>

* 你可以对特定的任务指定参数:

  <div class="multi-language-sample" data-lang="kotlin">
  <div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

  ```kotlin
  tasks.withType<CompileUsingKotlinDaemon>().configureEach {
      kotlinDaemonJvmArguments.set(listOf("-Xmx486m", "-Xms256m", "-XX:+UseParallelGC"))
      }
  ```

  </div>
  </div>

  <div class="multi-language-sample" data-lang="groovy">
  <div class="sample" markdown="1" theme="idea" mode='groovy'>

  ```groovy
  tasks.withType(CompileUsingKotlinDaemon::class).configureEach { task ->
      task.kotlinDaemonJvmArguments.set(["-Xmx1g", "-Xms512m"])
      }
  ```

  </div>
  </div>

  > 这种情况下, 会在任务执行时启动一个新的 Kotlin daemon 实例. 更多详情请参见 [指定 JVM 参数时 Kotlin daemon 的行为](#kotlin-daemon-s-behavior-with-jvm-arguments).
  {:.note}

#### 指定 JVM 参数时 Kotlin daemon 的行为

配置 Kotlin daemon 的 JVM 参数时, 请注意:

* 如果不同的子项目或任务设置了不同的 JVM 参数, 那么会存在多个 Kotlin daemon 实例同时运行.
* 只有当 Gradle 运行相关的编译任务, 而且现存的 Kotlin daemon 实例没有使用相同的 JVM 参数时,
  才会启动新的 Kotlin daemon 实例.
  假设你的项目包含很多子项目. 大部分子项目对 Kotlin daemon 需要某种 heap memory 设定,
  但有一个模块需要很大的heap memory 设定 (尽管这个模块很少被编译).
  这种情况下, 你应该对这个模块设定不同的 JVM 参数,
  这样就只有在开发者编译这个特定模块时, 才会使用很大的 heap memory 启动一个 Kotlin daemon.
  > 如果已有某个 Kotlin daemon 在运行中, 并且它的 heap memory 尺寸足够满足编译的需求,
  > 那么即使另一个任务要求的 JVM 参数不同, 也仍会重用这个 daemon, 而不是启动一个新的实例.
  {:.note}
* 如果 `Xmx` 参数未指定, Kotlin daemon 会从 Gradle daemon 继承.
