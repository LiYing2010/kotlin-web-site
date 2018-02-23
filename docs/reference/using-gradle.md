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

``` groovy
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

通过 [Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block) 使用 Kotlin Gradle plugin 1.1.1 及以上版本时, 不需要以上定义.

## 编译到 JVM 平台

要编译到 JVM 平台, 需要应用(apply) Kotlin plugin:

``` groovy
apply plugin: "kotlin"
```

从 Kotlin 1.1.1 版开始, 也可以通过 [Gradle plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block) 来使用 Kotlin plugin:

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "{{ site.data.releases.latest.version }}"
}
```

在这段代码中, `version` 必须是写明的字面值, 不能通过其他编译脚本得到.

Kotlin 源代码可以与 Java 源代码共存在同一个文件夹下, 也可以放在不同的文件夹下. 默认的约定是使用不同的文件夹:

``` groovy
project
    - src
        - main (root)
            - kotlin
            - java
```

如果不使用默认约定的文件夹结构, 那么需要修改相应的 *sourceSets* 属性:

``` groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

## 编译到 JavaScript

编译到 JavaScript 时, 需要应用(apply)另一个 plugin:

``` groovy
apply plugin: "kotlin2js"
```

这个 plugin 只能编译 Kotlin 源代码文件, 因此推荐将 Kotlin 和 Java 源代码文件放在不同的文件夹内(如果工程内包含 Java 文件的话). 与编译到 JVM 平台时一样, 如果不使用默认约定的文件夹结构, 我们需要使用 *sourceSets* 来指定文件夹目录:

``` groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
}
```

除了编译输出的 JavaScript 文件之外, plugin 默认还会创建一个带二进制描述符(binary descriptor)的 JS 文件.
如果你在编译一个被其他 Kotlin 模块依赖的可重用的库, 那么这个文件是必须的, 而且需要与编译结果一起发布.
这个文件的生成, 可以通过 `kotlinOptions.metaInfo` 选项来控制:

``` groovy
compileKotlin2Js {
	kotlinOptions.metaInfo = true
}
```

## 编译到 Android

Android 的 Gradle 模型与通常的 Gradle 略有区别, 因此如果我们想要编译一个使用 Kotlin 语言开发的 Android 工程, 就需要使用 *kotlin-android* plugin 而不是 *kotlin* plugin:

``` groovy
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

此外不要忘记配置 [对标准库的依赖](#configuring-dependencies).

### Android Studio

如果使用 Android Studio, 需要在 android 之下添加以下内容:

``` groovy
android {
  ...

  sourceSets {
    main.java.srcDirs += 'src/main/kotlin'
  }
}
```

这些设置告诉 Android Studio, kotlin 目录是一个源代码根目录, 因此当工程模型装载进入 IDE 时, 就可以正确地识别这个目录. 或者, 你也可以将 Kotlin 类放在 Java 源代码目录内, 通常是 `src/main/java`.

## 配置依赖

除了上文讲到的 `kotlin-gradle-plugin` 依赖之外, 你还需要添加 Kotlin 标准库的依赖:

``` groovy
repositories {
    mavenCentral()
}

dependencies {
    compile "org.jetbrains.kotlin:kotlin-stdlib"
}
```

如果你的编译目标平台是 JavaScript, 请改用 `compile "org.jetbrains.kotlin:kotlin-stdlib-js"`.

如果你的编译目标平台是 JDK 7 或 JDK 8, 你可以使用 Kotlin 标准库的扩展版本, 其中包含了针对 JDK 新版本中新增 API 的额外的扩展函数.
请使用以下依赖, 而不是通常的 `kotlin-stdlib`:

``` groovy
compile "org.jetbrains.kotlin:kotlin-stdlib-jdk7"
compile "org.jetbrains.kotlin:kotlin-stdlib-jdk8"
```

在 Kotlin 1.1.x 版本中, 请使用 `kotlin-stdlib-jre7` 和 `kotlin-stdlib-jre8`.

如果你的项目使用了 [Kotlin 反射功能](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/index.html), 或测试功能, 那么还需要添加相应的依赖:

``` groovy
compile "org.jetbrains.kotlin:kotlin-reflect"
testCompile "org.jetbrains.kotlin:kotlin-test"
testCompile "org.jetbrains.kotlin:kotlin-test-junit"
```

从 Kotlin 1.1.2 版开始, `org.jetbrains.kotlin` 组之下的依赖项, 默认会使用从 Kotlin plugin 得到的版本号.
你也可以使用完整的依赖项目语法, 手动指定版本号, 比如:
`compile "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"`.

## 处理注解

详情请参见 [Kotlin 注解处理工具](kapt.html) (`kapt`).

## 增量编译(Incremental compilation)

Kotlin 支持 Gradle 中的增量编译模式, 但这个功能目前还是实验性的.
增量编译功能会监视源代码文件在两次编译之间的变更, 因此只会编译那些变更过的文件.

从 Kotlin 1.1.1 版开始, 增量编译模式默认是开启的.

有以下几种方式可以覆盖默认的设定:

  1. 在 `gradle.properties` 或 `local.properties` 文件中, 添加 `kotlin.incremental=true` 或 `kotlin.incremental=false`;

  2. 向 Gradle 命令行参数添加 `-Pkotlin.incremental=true` 或 `-Pkotlin.incremental=false`. 注意, 这种情况下应该向所有后续的编译命令都添加这个参数, 任何一次编译, 如果关闭了增量编译模式, 都会导致增量编译的缓存失效.

增量编译功能打开时, 你将会在编译 log 中看到以下警告信息:
```
Using kotlin incremental compilation
```

注意, 初次编译不会是增量编译.

## 对协程的支持

对 [协程](coroutines.html) 的支持是从 Kotlin 1.2 开始新增的一个实验性功能, 因此如果你在项目中使用了协程, Kotlin 编译器会报告一个警告信息.
在你的 `build.gradle` 文件中添加以下代码, 可以关闭这个警告:

``` groovy
kotlin {
    experimental {
        coroutines 'enable'
    }
}
```

## 模块名称

编译产生的 Kotlin 模块名称, 会根据项目的 `archivesBaseName` 属性来决定.
如果项目的名称很宽泛, 比如 `lib` 或 `jvm`, 这样的名称在子项目中很常见, 该模块的 Kotlin 编译输出的文件(`*.kotlin_module`) 可能会与第三方的同名模块中发生名称冲突.
如果要把一个项目打包为单个的文件(比如打包为 APK 文件), 模块的重名就会造成问题.

为了避免这种问题, 请手动设定一个唯一的 `archivesBaseName`:

``` groovy
archivesBaseName = 'myExampleProject_lib'
```

## 编译选项

如果需要指定额外的编译选项, 请使用 Kotlin 编译任务的 `kotlinOptions` 属性.

当编译的目标平台为 JVM 时, 编译产品代码的编译任务名为 `compileKotlin`, 编译测试代码的编译任务名为 `compileTestKotlin`.
针对自定义源代码集的编译任务名, 是与源代码集名称对应的 `compile<Name>Kotlin`.

Android 项目的编译任务名称, 包含 [构建变体(build variant)](https://developer.android.com/studio/build/build-variants.html) 的名称,
完整名称是 `compile<BuildVariant>Kotlin`, 比如, `compileDebugKotlin`, `compileReleaseUnitTestKotlin`.

当编译的目标平台为 JavaScript 时, 编译任务名分别是 `compileKotlin2Js` 和 `compileTestKotlin2Js`, 针对自定义源代码集的编译任务名, 是 `compile<Name>Kotlin2Js`.

要对单个编译任务进行配置, 请使用它的名称. 示例如下:

``` groovy
compileKotlin {
    kotlinOptions.suppressWarnings = true
}

compileKotlin {
    kotlinOptions {
        suppressWarnings = true
    }
}
```

也可以对项目中的所有 Kotlin 编译任务进行配置:

``` groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).all {
    kotlinOptions {
        // ...
    }
}
```

Gradle 任务所支持的编译选项完整列表如下:

### JVM 和 JS 任务支持的共通属性

| 属性名称 | 描述 | 可以选择的值 |默认值 |
|------|-------------|-----------------|--------------|
| `apiVersion` | 只允许使用指定的版本的运行库中的 API | "1.0", "1.1" | "1.1" |
| `languageVersion` | 指定源代码所兼容的 Kotlin 语言版本 | "1.0", "1.1" | "1.1" |
| `suppressWarnings` | 不产生警告信息 |  | false |
| `verbose` | 输出详细的 log 信息 |  | false |
| `freeCompilerArgs` | 指定额外的编译参数, 可以是多个 |  | [] |

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
| `sourceMapEmbedSources` | 指定是否将源代码文件嵌入到源代码映射文件中 | "never", "always", "inlining" | "inlining" |
| `sourceMapPrefix` | 指定源代码映射文件中的路径前缀 |  |  |
| `target` | 指定生成的 JS 文件 的 ECMA 版本 | "v5" | "v5" |
| `typedArrays` | 将基本类型数组转换为 JS 的有类型数组 arrays |  | false |


## 生成文档

要对 Kotlin 项目生成文档, 请使用 [Dokka](https://github.com/Kotlin/dokka);
相关的配置方法, 请参见 [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-gradle-plugin).
Dokka 支持混合语言的项目, 可以将文档输出为多种格式, 包括标准的 JavaDoc 格式.

## OSGi

关于对 OSGi 的支持, 请参见 [Kotlin 与 OSGi](kotlin-osgi.html).

## 示例

以下示例演示了 Gradle plugin 的一些可能的配置:

* [Kotlin](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/hello-world)
* [Java 代码与 Kotlin 代码的混合](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/mixed-java-kotlin-hello-world)
* [Android](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/android-mixed-java-kotlin-project)
* [JavaScript](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/kotlin2JsProject)
