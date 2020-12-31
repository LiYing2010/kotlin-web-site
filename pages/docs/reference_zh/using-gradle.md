---
type: doc
layout: reference
title: "使用 Gradle"
---

# 使用 Gradle

要使用 Gradle 编译一个 Kotlin 项目, 你需要 [在你的项目中应用 Kotlin Gradle plugin](#plugin-and-versions),
然后 [配置依赖项](#configuring-dependencies).

## Plugin 与版本

要应用 Kotlin Gradle 插件, 可以使用 [Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block),

Kotlin Gradle 插件 {{ site.data.releases.latest.version }} 适用于 Gradle 5.4 或更高版本.
`kotlin-multiplatform` 创建需要 Gradle 6.0 或更高版本.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.<...>' version '{{ site.data.releases.latest.version }}'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins {
    kotlin("<...>") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

占位符 `<...>` 需要替换为某个 plugin 名称, 具体的 plugin 名称请参照本章的后续小节.

## 编译到多个目标平台

编译到 [多个目标平台](mpp-supported-platforms.html) 的项目, 称为 [跨平台项目](mpp-intro.html),
需要使用 `kotlin-multiplatform` 插件.
详情请阅读 [关于 `kotlin-multiplatform` 插件](mpp-discover-project.html#multiplatform-plugin).

> `kotlin-multiplatform` 创建要求 Gradle 6.0 或更高版本.
{:.note}

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
plugins {
    kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>


## 编译到 JVM 平台

要编译到 JVM 平台, 需要应用(apply) Kotlin JVM plugin.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only>

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    kotlin("jvm") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

在这段代码中, `version` 必须是写明的字面值, 不能通过其他编译脚本得到.

另一种方法是, 也可以使用旧的 `apply plugin` 模式:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
apply plugin: 'kotlin'
```

</div>

在 Gradle Kotlin DSL 中, 不推荐使用 `apply` 来应用 Kotlin plugin.
[原因请参见这里](#using-gradle-kotlin-dsl).

### Kotlin 源代码与 Java 源代码

Kotlin 源代码可以与 Java 源代码保存在相同的文件夹下, 也可以放在不同的文件夹下.
默认的约定是使用不同的文件夹:

<div class="sample" markdown="1" mode="groovy" theme="idea" auto-indent="false">

```groovy
project
    - src
        - main (root)
            - kotlin
            - java
```

</div>

如果不使用默认约定的文件夹结构, 那么需要修改相应的 `sourceSets` 属性:

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

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
sourceSets.main {
    java.srcDirs("src/main/myJava", "src/main/myKotlin")
}
```

</div>
</div>

## 编译到 JavaScript

如果编译的目标平台只有 JavaScript, 请使用 `kotlin-js` 插件.
详情请阅读 [相关文档](js-project-setup.html):

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-highlight-only>

``` groovy
plugins {
    id 'org.jetbrains.kotlin.js' version '{{ site.data.releases.latest.version }}'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    kotlin("js") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

### Kotlin 源代码与 Java 源代码

这个 plugin 只能编译 Kotlin 源代码文件, 因此推荐将 Kotlin 和 Java 源代码文件放在不同的文件夹内(如果工程内包含 Java 文件的话).
如果不将源代码分开存放, 请在 `sourceSets` 代码段中指定源代码文件夹 block:

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

## 编译到 Android 平台

建议使用 Android Studio 来创建 Android 应用程序.
详情请阅读 [如何使用 Android Gradle plugin](https://developer.android.com/studio/releases/gradle-plugin).

## 配置依赖项

如果要添加一个库的依赖, 需要在 source set DSL 中的 `dependencies` 代码段内,
设置必要 [类型](#dependency-types) 的依赖项 (比如, `implementation`).

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
标准库的版本与 Kotlin Gradle plugin 版本相同.

对于与平台相关的源代码集, 会使用针对这个平台的标准库, 同时, 对其他源代码集会添加共通的标准库.
Kotlin Gradle plugin 会根据你的 Gradle 构建脚本的 `kotlinOptions.jvmTarget` [编译器选项](#compiler-options) 设置,
选择适当的 JVM 标准库.

如果明确的声明一个标准库依赖项(比如, 如果你需要使用不同的版本), Kotlin Gradle plugin 不会覆盖你的设置, 也不会添加第二个标准库.

如果你完全不需要标准库, 那么可以在 `gradle.properties` 文件中添加选项来关闭它:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
kotlin.stdlib.default.dependency=false
```

</div>

### 设置对测试库的依赖项

对各种 Kotlin 项目的测试可以使用 [`kotlin.test` API](../../api/latest/kotlin.test/index.html).

需要添加对应的测试库依赖项:

* 对于 `commonTest`, 需要添加 `kotlin-test-common` 和 `kotlin-test-annotations-common` 依赖项.
* 对于 JVM 编译目标, 请使用 `kotlin-test-junit` 或 `kotlin-test-testng`, 可以选择相应的 asserter 实现和注解映射.
* 对于 Kotlin/JS 编译目标, 请将 `kotlin-test-js` 添加为测试依赖项.

Kotlin/Native 编译目标已经内建了 `kotlin.test` API 的实现, 不需要额外的测试依赖项.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin{
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin('test-common')
                implementation kotlin('test-annotations-common')
            }
        }
        jvmTest {
            dependencies {
                implementation kotlin('test-junit')
            }
        }
        jsTest {
            dependencies {
                implementation kotlin('test-js')
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin{
    sourceSets {
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test-common"))
                implementation(kotlin("test-annotations-common"))
            }
        }
        val jvmTest by getting {
            dependencies {
                implementation(kotlin("test-junit"))
            }
        }
        val jsTest by getting {
            dependencies {
                implementation(kotlin("test-js"))
            }
        }
    }
}
```

</div>
</div>

> 对 Kotlin 模块的依赖项, 可以使用简写, 比如, 对 "org.jetbrains.kotlin:kotlin-test" 的依赖项可以简写为 kotlin("test").
{:.note}

## 设置对 kotlinx 库的依赖项

如果使用 kotlinx 库, 并且需要与平台相关的依赖项, 那么可以通过 `-jvm` 或 `-js` 之类的后缀,
来指定与平台相关的库版本, 比如, `kotlinx-coroutines-core-jvm`.
也可以使用库的基本 artifact 名(base artifact name) – `kotlinx-coroutines-core`.

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

如果使用跨平台的库, 并且需要依赖共用代码, 那么只需要在共用源代码集中一次性设置依赖项.
请使用库的基本 artifact 名(base artifact name), 比如 `kotlinx-coroutines-core` 或 `ktor-client-core`.

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

### 在最顶层设置依赖项

另一种做法是, 可以通过 `<sourceSetName><DependencyType>` 格式的配置名称, 在最顶层指定依赖项.
对于某些 Gradle 内建的依赖项, 比如 `gradleApi()`, `localGroovy()`, 或 `gradleTestKit()`, 这种方法会很有用,
这些依赖项在 Source Set 依赖项 DSL 中是不能使用的.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
dependencies {
    commonMainImplementation 'com.example:my-library:1.0'
}

```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
dependencies {
    "commonMainImplementation"("com.example:my-library:1.0")
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

增量编译模式支持 Kotlin/JVM 和 Kotlin/JS 工程.
从 Kotlin 1.1.1 版开始默认开启.

有以下几种方式可以关闭增量编译设定:

* 在 `gradle.properties` 或 `local.properties` 文件中添加以下内容:
    * 对 Kotlin/JVM 项目: `kotlin.incremental=false`
    * 对 Kotlin/JS 项目: `kotlin.incremental.js=false`

* 在命令行参数中, 添加 `-Pkotlin.incremental=false` 或 `-Pkotlin.incremental.js=false`.

  注意, 这种情况下应该向所有后续的编译命令都添加这个参数, 任何一次编译, 如果关闭了增量编译模式, 都会导致增量编译的缓存失效.

注意, 上述两种方式, 初次编译都不会是增量编译.

## 对 Gradle 编译缓存的支持

Kotlin 插件支持 [Gradle 编译缓存](https://guides.gradle.org/using-build-cache/)

如果想要对所有的 Kotlin 编译任务禁用缓存, 可以将系统属性 `kotlin.caching.enabled` 设置为 `false`
(也就是使用参数 `-Dkotlin.caching.enabled=false` 来执行编译).

如果你使用 [kapt](kapt.html), 请注意, 注解处理任务默认不会缓存.
但你可以 [手动启用缓存功能](kapt.html#gradle-build-cache-support-since-1220).

## 编译选项

如果需要指定额外的编译选项, 请使用 Kotlin 编译任务的 `kotlinOptions` 属性.

当编译的目标平台为 JVM 时, 编译产品代码的编译任务名为 `compileKotlin`, 编译测试代码的编译任务名为 `compileTestKotlin`.
针对自定义源代码集的编译任务名, 是与源代码集名称对应的 `compile<Name>Kotlin`.

Android 项目的编译任务名称, 包含 [构建变体(build variant)](https://developer.android.com/studio/build/build-variants.html) 的名称,
完整名称是 `compile<BuildVariant>Kotlin`, 比如, `compileDebugKotlin`, `compileReleaseUnitTestKotlin`.

当编译的目标平台为 JavaScript 时, 编译任务名分别是 `compileKotlinJs` 和 `compileTestKotlinJs`,
针对自定义源代码集的编译任务名, 是 `compile<Name>KotlinJs`.

要对单个编译任务进行配置, 请使用它的名称. 示例如下:

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

注意, 使用 Gradle Kotlin DSL 时, 你应该先从编译工程的 `tasks` 属性得到编译任务.

编译 JavaScript 和 Common 时, 请使用相应的 `Kotlin2JsCompile` 和 `KotlinCompileCommon` 类型.

也可以对项目中的所有 Kotlin 编译任务进行配置:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
    kotlinOptions { /*...*/ }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    kotlinOptions { /*...*/ }
}
```

</div>
</div>

Gradle 任务所支持的编译选项完整列表如下:

### JVM, JS, 和 JS DCE 任务支持的共通属性

| 属性名称 | 描述 | 可以选择的值 |默认值 |
|------|-------------|-----------------|--------------|
| `allWarningsAsErrors` | 把警告作为错误来处理 |  | false |
| `suppressWarnings` | 不产生警告信息 |  | false |
| `verbose` | 输出详细的 log 信息 |  | false |
| `freeCompilerArgs` | 指定额外的编译参数, 可以是多个 |  | [] |

### JVM 和 JS 任务支持的共通属性

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `apiVersion` | 只允许使用指定的版本的运行库中的 API | "1.2" (已废弃), "1.3", "1.4", "1.5" (实验性功能) |  |
| `languageVersion` | 指定源代码所兼容的 Kotlin 版本 | "1.2" (已废弃), "1.3", "1.4", "1.5" (实验性功能) |  |

### JVM 任务独有的属性

| 属性名称 | 描述 | 可以选择的值 |默认值 |
|------|-------------|-----------------|--------------|
| `javaParameters` | 为 Java 1.8 的方法参数反射功能生成 metadata |  | false |
| `jdkHome` | 将指定路径中的 JDK 添加到 classpath 内, 不使用默认的 JAVA_HOME |  |  |
| `jvmTarget` | 指定编译输出的 JVM 字节码的版本 | "1.6", "1.8", "9", "10", "11", "12", "13", "14", "15" | "1.6" |
| `noJdk` | 不要自动将 Java 运行库包含到 classpath 内 |  | false |
| `noReflect` | 不要自动将 Kotlin 反射功能库包含到 classpath 内 |  | true |
| `noStdlib` | 不要自动将 Kotlin/JVM 标准库和 Kotlin 反射功能库包含到 classpath 内 |  | true |
| `useIR` | 使用 IR 编译器后端 |  | false |

### JS 任务独有的属性

| 属性名称 | 描述 | 可以选择的值 |默认值 |
|------|-------------|-----------------|--------------|
| `friendModulesDisabled` | 指定是否关闭内部声明的输出 |  | false |
| `main` | 指定执行时是否调用 main 函数 | "call", "noCall" | "call" |
| `metaInfo` | 指定是否生成带有 metadata 的 .meta.js 和 .kjsm 文件. 用于创建库 |  | true |
| `moduleKind` | 指定编译器生成的 JS 模块类型 | "umd", "commonjs", "amd", "plain"  | "umd" |
| `noStdlib` | 不要自动将 Kotlin/JS 标准库 添加到编译依赖项中 |  | true |
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
