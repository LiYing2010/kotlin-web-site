---
type: doc
layout: reference
title: "使用 Gradle"
---

# 使用 Gradle

要使用 Gradle 编译 Kotlin 代码, 你需要 [设置 *kotlin-gradle* plugin](#plugin-and-versions), 将它 [应用](#targeting-the-jvm) 到你的工程, 然后 [添加 *kotlin-stdlib* 依赖](#configuring-dependencies). 在 IntelliJ IDEA 中, 在 Project action 内选择 Tools \| Kotlin \| Configure Kotlin 也可以自动完成这些操作.

## Plugin 与版本

`kotlin-gradle-plugin` 可以用来编译 Kotlin 源代码和模块.

使用的 Kotlin 版本通常定义为 `kotlin_version` 属性:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
buildscript {
    ext.kotlin_version = '{{ site.data.releases.latest.version }}'

    repositories {
        mavenCentral()
    }

    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}
```

</div>

通过 [Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block), 或 [Gradle Kotlin DSL](https://github.com/gradle/kotlin-dsl), 使用 Kotlin Gradle plugin 1.1.1 及以上版本时, 不需要以上定义.

## 编译 Kotlin 多平台项目

关于使用 `kotlin-multiplatform` plugin 来编译 [跨平台项目](multiplatform.html) 的方法, 请参见 [使用 Gradle 编译跨平台项目](building-mpp-with-gradle.html).

## 编译到 JVM 平台

要编译到 JVM 平台, 需要应用(apply) Kotlin plugin:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
apply plugin: "kotlin"
```

</div>

从 Kotlin 1.1.1 版开始, 也可以通过 [Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block) 来使用 Kotlin plugin:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "{{ site.data.releases.latest.version }}"
}
```

</div>

在这段代码中, `version` 必须是写明的字面值, 不能通过其他编译脚本得到.

如果使用 Gradle Kotlin DSL, 可以这样使用 Kotlin plugin:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
plugins {
    kotlin("jvm") version "{{ site.data.releases.latest.version }}"
}
```

</div>

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

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

</div>

如果使用 Gradle Kotlin DSL, 请用 `java.sourceSets { ... }` 来设置源代码集.

## 编译到 JavaScript

编译到 JavaScript 时, 需要应用(apply)另一个 plugin:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
apply plugin: "kotlin2js"
```

</div>

这个 plugin 只能编译 Kotlin 源代码文件, 因此推荐将 Kotlin 和 Java 源代码文件放在不同的文件夹内(如果工程内包含 Java 文件的话). 与编译到 JVM 平台时一样, 如果不使用默认约定的文件夹结构, 我们需要使用 *sourceSets* 来指定文件夹目录:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
}
```

</div>

除了编译输出的 JavaScript 文件之外, plugin 默认还会创建一个带二进制描述符(binary descriptor)的 JS 文件.
如果你在编译一个被其他 Kotlin 模块依赖的可重用的库, 那么这个文件是必须的, 而且需要与编译结果一起发布.
这个文件的生成, 可以通过 `kotlinOptions.metaInfo` 选项来控制:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
compileKotlin2Js {
    kotlinOptions.metaInfo = true
}
```

</div>

## 编译到 Android

Android 的 Gradle 模型与通常的 Gradle 略有区别, 因此如果我们想要编译一个使用 Kotlin 语言开发的 Android 工程, 就需要使用 *kotlin-android* plugin 而不是 *kotlin* plugin:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
buildscript {
    ext.kotlin_version = '{{ site.data.releases.latest.version }}'

    ...

    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}
apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
```

</div>

此外不要忘记配置 [对标准库的依赖](#configuring-dependencies).

### Android Studio

如果使用 Android Studio, 需要在 android 之下添加以下内容:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
android {
  ...

  sourceSets {
    main.java.srcDirs += 'src/main/kotlin'
  }
}
```

</div>

这些设置告诉 Android Studio, kotlin 目录是一个源代码根目录, 因此当工程模型装载进入 IDE 时, 就可以正确地识别这个目录. 或者, 你也可以将 Kotlin 类放在 Java 源代码目录内, 通常是 `src/main/java`.

## 配置依赖

除了上文讲到的 `kotlin-gradle-plugin` 依赖之外, 你还需要添加 Kotlin 标准库的依赖:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
repositories {
    mavenCentral()
}

dependencies {
    compile "org.jetbrains.kotlin:kotlin-stdlib"
}
```

</div>

如果你的编译目标平台是 JavaScript, 请改用 `compile "org.jetbrains.kotlin:kotlin-stdlib-js"`.

如果你的编译目标平台是 JDK 7 或 JDK 8, 你可以使用 Kotlin 标准库的扩展版本, 其中包含了针对 JDK 新版本中新增 API 的额外的扩展函数.
请使用以下依赖, 而不是通常的 `kotlin-stdlib`:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
compile "org.jetbrains.kotlin:kotlin-stdlib-jdk7"
compile "org.jetbrains.kotlin:kotlin-stdlib-jdk8"
```

</div>

使用 Gradle Kotlin DSL 时, 相应的依赖设定如下:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
dependencies {
    compile(kotlin("stdlib"))
    // 或者使用以下两个设置之一:
    compile(kotlin("stdlib-jdk7"))
    compile(kotlin("stdlib-jdk8"))
}
```

</div>

在 Kotlin 1.1.x 版本中, 请使用 `kotlin-stdlib-jre7` 和 `kotlin-stdlib-jre8`.

如果你的项目使用了 [Kotlin 反射功能](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/index.html), 或测试功能, 那么还需要添加相应的依赖:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
compile "org.jetbrains.kotlin:kotlin-reflect"
testCompile "org.jetbrains.kotlin:kotlin-test"
testCompile "org.jetbrains.kotlin:kotlin-test-junit"
```

</div>

如果使用 Gradle Kotlin DSL, 相应的依赖设定如下:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
compile(kotlin("reflect"))
testCompile(kotlin("test"))
testCompile(kotlin("test-junit"))
```

</div>

从 Kotlin 1.1.2 版开始, `org.jetbrains.kotlin` 组之下的依赖项, 默认会使用从 Kotlin plugin 得到的版本号.
你也可以使用完整的依赖项目语法, 手动指定版本号, 比如: `compile "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"`,
如果 Gradle Kotlin DSL 相应的设置是: `kotlin("stdlib", kotlinVersion)`.

## 处理注解

详情请参见 [Kotlin 注解处理工具](kapt.html) (`kapt`).

## 增量编译(Incremental compilation)

Kotlin 支持 Gradle 中的增量编译模式, 但这个功能目前还是实验性的.
增量编译功能会监视源代码文件在两次编译之间的变更, 因此只会编译那些变更过的文件.

从 Kotlin 1.1.1 版开始, 增量编译模式默认是开启的.

有以下几种方式可以覆盖默认的设定:

  1. 在 `gradle.properties` 或 `local.properties` 文件中, 添加 `kotlin.incremental=true` 或 `kotlin.incremental=false`;

  2. 向 Gradle 命令行参数添加 `-Pkotlin.incremental=true` 或 `-Pkotlin.incremental=false`. 注意, 这种情况下应该向所有后续的编译命令都添加这个参数, 任何一次编译, 如果关闭了增量编译模式, 都会导致增量编译的缓存失效.

注意, 初次编译不会是增量编译.

## 对 Gradle 编译缓存的支持 (从 1.2.20 版开始支持)

Kotlin 插件支持 [Gradle 编译缓存](https://guides.gradle.org/using-build-cache/) (需要 Gradle 4.3 或更高版本; 对于 4.3 以下版本, 编译缓存会被禁用).

kapt 注解处理任务默认不会缓存, 因为注解处理器可以运行任何代码, 这些代码可能并不一定会把编译任务的输入文件转换为输出文件, 可能会访问并修改没有被 Gradle 追踪的那些文件, 等等等等.
如果一定要对 kapt 启用缓存功能, 可以在编译脚本中添加以下内容:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kapt {
    useBuildCache = true
}
```

</div>

如果想要对所有的 Kotlin 编译任务禁用缓存, 可以将系统属性 `kotlin.caching.enabled` 设置为 `false` (也就是使用参数 `-Dkotlin.caching.enabled=false` 来执行编译).

## 编译选项

如果需要指定额外的编译选项, 请使用 Kotlin 编译任务的 `kotlinOptions` 属性.

当编译的目标平台为 JVM 时, 编译产品代码的编译任务名为 `compileKotlin`, 编译测试代码的编译任务名为 `compileTestKotlin`.
针对自定义源代码集的编译任务名, 是与源代码集名称对应的 `compile<Name>Kotlin`.

Android 项目的编译任务名称, 包含 [构建变体(build variant)](https://developer.android.com/studio/build/build-variants.html) 的名称,
完整名称是 `compile<BuildVariant>Kotlin`, 比如, `compileDebugKotlin`, `compileReleaseUnitTestKotlin`.

当编译的目标平台为 JavaScript 时, 编译任务名分别是 `compileKotlin2Js` 和 `compileTestKotlin2Js`, 针对自定义源代码集的编译任务名, 是 `compile<Name>Kotlin2Js`.

要对单个编译任务进行配置, 请使用它的名称. 示例如下:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
compileKotlin {
    kotlinOptions.suppressWarnings = true
}

compileKotlin {
    kotlinOptions {
        suppressWarnings = true
    }
}
```

</div>

如果使用 Gradle Kotlin DSL, 首先要从工程的 `tasks` 得到编译任务:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
// ...

val compileKotlin: KotlinCompile by tasks

compileKotlin.kotlinOptions.suppressWarnings = true
```

</div>

编译 JavaScript 和 Common 时, 请使用相应的 `Kotlin2JsCompile` 和 `KotlinCompileCommon` 类型.

也可以对项目中的所有 Kotlin 编译任务进行配置:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).all {
    kotlinOptions { ... }
}
```

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
| `languageVersion` | 指定源代码所兼容的 Kotlin 语言版本 | "1.0", "1.1", "1.2", "1.3", "1.4 (实验性功能)" |  |

### JVM 任务独有的属性

| 属性名称 | 描述 | 可以选择的值 |默认值 |
|------|-------------|-----------------|--------------|
| `javaParameters` | 为 Java 1.8 的方法参数反射功能生成 metadata |  | false |
| `jdkHome` | 如果 JDK home 目录路径与默认的 JAVA_HOME 值不一致, 这个参数可以指定 JDK home 目录路径, 这个路径将被添加到 classpath 内 |  |  |
| `jvmTarget` | 指定编译输出的 JVM 字节码的版本 (1.6 或 1.8), 默认为 1.6 | "1.6", "1.8" | "1.6" |
| `noJdk` | 不要将 Java 运行库包含到 classpath 内 |  | false |
| `noReflect` | 不要将 Kotlin 的反射功能实现库包含到 classpath 内 |  | true |
| `noStdlib` | 不要将 Kotlin 的运行库包含到 classpath 内 |  | true |

### JS 任务独有的属性

| 属性名称 | 描述 | 可以选择的值 |默认值 |
|------|-------------|-----------------|--------------|
| `friendModulesDisabled` | 指定是否关闭内部声明的输出 |  | false |
| `main` | 指定是否调用 main 函数 | "call", "noCall" | "call" |
| `metaInfo` | 指定是否生成带有 metadata 的 .meta.js 和 .kjsm 文件. 用于创建库 |  | true |
| `moduleKind` | 指定编译器生成的模块类型 | "plain", "amd", "commonjs", "umd" | "plain" |
| `noStdlib` | 不使用默认附带的 Kotlin 标准库(stdlib) |  | true |
| `outputFile` | 指定输出文件的路径 |  |  |
| `sourceMap` | 指定是否生成源代码映射文件(source map) |  | false |
| `sourceMapEmbedSources` | 指定是否将源代码文件嵌入到源代码映射文件中 | "never", "always", "inlining" |  |
| `sourceMapPrefix` | 指定源代码映射文件中的路径前缀 |  |  |
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
为了解决这个问题, 可以将出错的代码注释掉, 执行 Gradle 的 `kotlinDslAccessorsSnapshot` 任务, 再将代码添加回来, 然后重新编译, 或者重新将工程导入到 IDE.

## 示例

以下示例演示了 Gradle plugin 的一些可能的配置:

* [Kotlin](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/hello-world)
* [Java 代码与 Kotlin 代码的混合](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/mixed-java-kotlin-hello-world)
* [Android](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/android-mixed-java-kotlin-project)
* [JavaScript](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/kotlin2JsProject)
