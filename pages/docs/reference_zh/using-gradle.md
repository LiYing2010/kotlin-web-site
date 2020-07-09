---
type: doc
layout: reference
title: "使用 Gradle"
---

# 使用 Gradle

要使用 Gradle 编译一个 Kotlin 项目, 你需要 [设置 *kotlin-gradle* plugin](#plugin-and-versions),
将它 [应用](#targeting-the-jvm) 到你的工程, 然后 [添加 *kotlin-stdlib* 依赖](#configuring-dependencies).
在 IntelliJ IDEA 中, 在 __Project__ 内选择 __Tools \| Kotlin \| Configure Kotlin__ 也可以自动完成这些操作.

## Plugin 与版本

要应用 Kotlin Gradle 插件, 可以使用 [Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block),
Kotlin Gradle 插件 {{ site.data.releases.latest.version }} 适用于 Gradle 4.9 或更高版本.

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

应用 Kotlin plugin 的另一种方法是, 在编译脚本的 classpath 中添加 `kotlin-gradle-plugin` 的依赖项目:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea">

``` groovy
buildscript {
    repositories {
        mavenCentral()
    }

    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:{{ site.data.releases.latest.version }}"
    }
}

plugins {
    id "org.jetbrains.kotlin.<...>" version "{{ site.data.releases.latest.version }}"
}
```
</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>


```kotlin
buildscript {
    repositories {
        mavenCentral()
    }

    dependencies {
        classpath(kotlin("gradle-plugin", version = "{{ site.data.releases.latest.version }}"))
    }
}
plugins {
    kotlin("<...>")
}
```
</div>
</div>

通过 [Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block),
或 [Gradle Kotlin DSL](https://github.com/gradle/kotlin-dsl), 使用 Kotlin Gradle plugin 1.1.1 及以上版本时, 不需要以上定义.

## 编译 Kotlin 多平台项目

关于使用 `kotlin-multiplatform` plugin 来编译 [跨平台项目](multiplatform.html) 的方法,
请参见 [使用 Gradle 编译跨平台项目](building-mpp-with-gradle.html).

## 编译到 JVM 平台

要编译到 JVM 平台, 需要应用(apply) Kotlin JVM plugin.
从 Kotlin 1.1.1 版开始, 可以使用 [Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)
来应用这个 plugin:

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
详情请参见 [下文](#using-gradle-kotlin-dsl).

Kotlin 源代码可以与 Java 源代码共存在同一个文件夹下, 也可以放在不同的文件夹下. 默认的约定是使用不同的文件夹:

<div class="sample" markdown="1" mode="groovy" theme="idea" auto-indent="false">

```groovy
project
    - src
        - main (root)
            - kotlin
            - java
```

</div>

如果不使用默认约定的文件夹结构, 那么需要修改相应的 *sourceSets* 属性:

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

编译到 JavaScript 时, 需要应用(apply)另一个 plugin:

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

这个 plugin 只能编译 Kotlin 源代码文件, 因此推荐将 Kotlin 和 Java 源代码文件放在不同的文件夹内(如果工程内包含 Java 文件的话).
与编译到 JVM 平台时一样, 如果不使用默认约定的文件夹结构, 你应该使用 *sourceSets* 来指定文件夹目录:

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


## 编译到 Android

Android 的 Gradle 模型与通常的 Gradle 略有区别, 因此如果我们想要编译一个使用 Kotlin 语言开发的 Android 工程,
就需要使用 *kotlin-android* plugin 而不是 *kotlin* plugin:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
buildscript {
    ext.kotlin_version = '{{ site.data.releases.latest.version }}'

    ...

    dependencies {
        classpath 'com.android.tools.build:gradle:3.2.1'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

plugins {
    id 'com.android.application'
    id 'kotlin-android'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
buildscript {
    dependencies {
        classpath("com.android.tools.build:gradle:3.2.1")
        classpath(kotlin("gradle-plugin", version = "{{ site.data.releases.latest.version }}"))
    }
}
plugins {
    id("com.android.application")
    kotlin("android")
}
```

</div>
</div>

Kotlin Gradle 插件 {{ site.data.releases.latest.version }} 适用于 Android Gradle Plugin 3.0 或更高版本.

此外不要忘记配置 [对标准库的依赖](#configuring-dependencies).

### Android Studio

如果使用 Android Studio, 需要在 android 之下添加以下内容:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
android {
  ...

  sourceSets {
    main.java.srcDirs += 'src/main/kotlin'
  }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
android {
  ...

    sourceSets["main"].java.srcDir("src/main/kotlin")
}
```

</div>
</div>

这些设置告诉 Android Studio, kotlin 目录是一个源代码根目录, 因此当工程模型装载进入 IDE 时, 就可以正确地识别这个目录.
或者, 你也可以将 Kotlin 类放在 Java 源代码目录内, 通常是 `src/main/java`.


## 配置依赖项目

除了上文讲到的 `kotlin-gradle-plugin` 依赖之外, 你还需要添加 Kotlin 标准库的依赖项目:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
repositories {
    mavenCentral()
}

dependencies {
    implementation "org.jetbrains.kotlin:kotlin-stdlib"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
}
```

</div>
</div>

Kotlin 标准库 `kotlin-stdlib` 的编译目标是 Java 6 及以上版本.
此外还有标准库的扩展版本, 其中添加了对 JDK 7 和 JDK 8 的一些特性的支持.
要使用这些版本, 请添加以下依赖之一, 而不要使用标准的 `kotlin-stdlib`:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk7"
implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk8"
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
implementation(kotlin("stdlib-jdk7"))
implementation(kotlin("stdlib-jdk8"))
```

</div>
</div>

在 Kotlin 1.1.x 版本中, 请使用 `kotlin-stdlib-jre7` 和 `kotlin-stdlib-jre8`.

如果你的编译目标平台是 JavaScript, 请使用 `stdlib-js` 依赖项.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
implementation "org.jetbrains.kotlin:kotlin-stdlib-js"
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
implementation(kotlin("stdlib-js"))
```

</div>
</div>

如果你的项目使用了 [Kotlin 反射功能](/api/latest/jvm/stdlib/kotlin.reflect.full/index.html), 或测试功能, 那么还需要添加相应的依赖:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
implementation "org.jetbrains.kotlin:kotlin-reflect"
testImplementation "org.jetbrains.kotlin:kotlin-test"
testImplementation "org.jetbrains.kotlin:kotlin-test-junit"
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
implementation(kotlin("reflect"))
testImplementation(kotlin("test"))
testImplementation(kotlin("test-junit"))
```

</div>
</div>

从 Kotlin 1.1.2 版开始, `org.jetbrains.kotlin` 组之下的依赖项, 默认会使用从 Kotlin plugin 得到的版本号.
你也可以使用以下的依赖项完整语法, 手动指定版本号:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

 ```groovy
implementation "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
 ```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

 ```kotlin
 implementation(kotlin("stdlib", kotlinVersion))
 ```

</div>
</div>

## 处理注解

Kotlin 通过 _Kotlin 注解处理工具_(`kapt`) 支持注解的处理.
kapt 在 Gradle 中的使用方法请参见 [kapt 章节](kapt.html).

## 增量编译(Incremental compilation)

Kotlin Gradle plugin 支持增量编译模式.
增量编译模式会监视源代码文件在两次编译之间的变更, 因此只会编译那些变更过的文件.

增量编译模式支持 Kotlin/JVM 和 Kotlin/JS 工程.
从 Kotlin 1.1.1 版开始, 对 Kotlin/JVM 工程默认开启, 从 1.3.20 开始, 对 Kotlin/JS 工程默认开启.

有以下几种方式可以覆盖默认的设定:

* 修改 Gradle 配置文件: 在 `gradle.properties` 或 `local.properties` 文件中,
  对于 Kotlin/JVM 工程, 添加 `kotlin.incremental=<value>`, 对 Kotlin/JS 工程, 添加 `kotlin.incremental.js=<value>`.
  `<value>` 是 boolean 值, 指定是否使用增量编译模式.

* 修改 Gradle 命令行参数: 添加参数 `-Pkotlin.incremental` 或 `-Pkotlin.incremental.js`,
  参数值为 boolean 值, 指定是否使用增量编译模式.
  注意, 这种情况下应该向所有后续的编译命令都添加这个参数, 任何一次编译, 如果关闭了增量编译模式, 都会导致增量编译的缓存失效.

注意, 上述两种方式, 初次编译都不会是增量编译.


## 对 Gradle 编译缓存的支持 (从 1.2.20 版开始支持)

Kotlin 插件支持 [Gradle 编译缓存](https://guides.gradle.org/using-build-cache/)
(需要 Gradle 4.3 或更高版本; 对于 4.3 以下版本, 编译缓存会被禁用).

如果想要对所有的 Kotlin 编译任务禁用缓存, 可以将系统属性 `kotlin.caching.enabled` 设置为 `false`
(也就是使用参数 `-Dkotlin.caching.enabled=false` 来执行编译).

如果你使用 [kapt](kapt.html), 请注意, 注解处理任务默认不会缓存. 但你可以手动启用缓存功能.
详情请参见 [kapt 章节](kapt.html#gradle-build-cache-support-since-1220).

## 编译选项

如果需要指定额外的编译选项, 请使用 Kotlin 编译任务的 `kotlinOptions` 属性.

当编译的目标平台为 JVM 时, 编译产品代码的编译任务名为 `compileKotlin`, 编译测试代码的编译任务名为 `compileTestKotlin`.
针对自定义源代码集的编译任务名, 是与源代码集名称对应的 `compile<Name>Kotlin`.

Android 项目的编译任务名称, 包含 [构建变体(build variant)](https://developer.android.com/studio/build/build-variants.html) 的名称,
完整名称是 `compile<BuildVariant>Kotlin`, 比如, `compileDebugKotlin`, `compileReleaseUnitTestKotlin`.

当编译的目标平台为 JavaScript 时, 编译任务名分别是 `compileKotlin2Js` 和 `compileTestKotlin2Js`,
针对自定义源代码集的编译任务名, 是 `compile<Name>Kotlin2Js`.

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
    kotlinOptions { ... }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

tasks.withType<KotlinCompile>().configureEach {
    kotlinOptions.suppressWarnings = true
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
| `apiVersion` | 只允许使用指定的版本的运行库中的 API | "1.0", "1.1", "1.2", "1.3", "1.4 (实验性功能)" |  |
| `languageVersion` | 指定源代码所兼容的 Kotlin 版本 | "1.0", "1.1", "1.2", "1.3", "1.4 (实验性功能)" |  |

### JVM 任务独有的属性

| 属性名称 | 描述 | 可以选择的值 |默认值 |
|------|-------------|-----------------|--------------|
| `javaParameters` | 为 Java 1.8 的方法参数反射功能生成 metadata |  | false |
| `jdkHome` | 将指定路径中的 JDK 添加到 classpath 内, 不使用默认的 JAVA_HOME |  |  |
| `jvmTarget` | 指定编译输出的 JVM 字节码的版本 (1.6, 1.8, 9, 10, 11, 12 或 13), 默认为 1.6 | "1.6", "1.8", "9", "10", "11", "12", "13"| "1.6" |
| `noJdk` | 不要自动将 Java 运行库包含到 classpath 内 |  | false |
| `noReflect` | 不要自动将 Kotlin 反射功能库包含到 classpath 内 |  | true |
| `noStdlib` | 不要自动将 Kotlin/JVM 标准库和 Kotlin 反射功能库包含到 classpath 内 |  | true |

### JS 任务独有的属性

| 属性名称 | 描述 | 可以选择的值 |默认值 |
|------|-------------|-----------------|--------------|
| `friendModulesDisabled` | 指定是否关闭内部声明的输出 |  | false |
| `main` | 指定执行时是否调用 main 函数 | "call", "noCall" | "call" |
| `metaInfo` | 指定是否生成带有 metadata 的 .meta.js 和 .kjsm 文件. 用于创建库 |  | true |
| `moduleKind` | 指定编译器生成的 JS 模块类型 | "plain", "amd", "commonjs", "umd" | "plain" |
| `noStdlib` | 不要自动将 Kotlin/JS 标准库 添加到编译依赖项中 |  | true |
| `outputFile` | 指定编译结果输出的 *.js 文件 |  |  |
| `sourceMap` | 指定是否生成源代码映射文件(source map) |  | false |
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

## 示例

以下示例演示了 Gradle plugin 的一些可能的配置:

* [Kotlin](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/hello-world)
* [Java 代码与 Kotlin 代码的混合](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/mixed-java-kotlin-hello-world)
* [Android](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/android-mixed-java-kotlin-project)
* [JavaScript](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/kotlin2JsProject)
