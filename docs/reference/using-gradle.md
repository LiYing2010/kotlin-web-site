---
type: doc
layout: reference
title: "使用 Gradle"
---

# 使用 Gradle

要使用 Gradle 编译 Kotlin 代码, 你需要 [设置 *kotlin-gradle* plugin](#plugin-and-versions), 将它 [应用](#targeting-the-jvm) 到你的工程, 然后 [添加 *kotlin-stdlib* 依赖](#configuring-dependencies). 在 IntelliJ IDEA 中, 在 Project action 内选择 Tools \| Kotlin \| Configure Kotlin 也可以自动完成这些操作.

你还可以打开 [增量编译(incremental compilation)](#incremental-compilation) 功能, 来提高编译速度. 

## Plugin 与版本

*kotlin-gradle-plugin* 可以用来编译 Kotlin 源代码和模块.

使用的 Kotlin 版本通常定义为 *kotlin_version* 属性:

``` groovy
buildscript {
   ext.kotlin_version = '<version to use>'

   repositories {
     mavenCentral()
   }

   dependencies {
     classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
   }
}
```

## 编译到 JVM 平台

要编译到 JVM 平台, 需要应用(apply) Kotlin plugin:

``` groovy
apply plugin: "kotlin"
```

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

如果希望创建一个可重复使用的 JavaScript 库, 请使用 `kotlinOptions.metaInfo` 生成一个带二进制描述符(binary descriptor)的 JS 文件.
这个文件需要与与编译结果一起发布.

``` groovy
compileKotlin2Js {
	kotlinOptions.metaInfo = true
}
```


## 编译到 Android

Android 的 Gradle 模型与通常的 Gradle 略有区别, 因此如果我们想要编译一个使用 Kotlin 语言开发的 Android 工程, 就需要使用 *kotlin-android* plugin 而不是 *kotlin* plugin:

``` groovy
buildscript {
    ...
}
apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
```

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

除了上文讲到的 kotlin-gradle-plugin 依赖之外, 你还需要添加 Kotlin 标准库的依赖:

``` groovy
buildscript {
   ext.kotlin_version = '<version to use>'
  repositories {
    mavenCentral()
  }
  dependencies {
    classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
  }
}

apply plugin: "kotlin" // 编译到 JavaScript 时, 应该是 apply plugin: "kotlin2js" 

repositories {
  mavenCentral()
}

dependencies {
  compile "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
}
```

如果你的工程使用 Kotlin 的反射功能或测试功能, 那么还需要添加相应的依赖:

``` groovy
compile "org.jetbrains.kotlin:kotlin-reflect:$kotlin_version"
testCompile "org.jetbrains.kotlin:kotlin-test:$kotlin_version"
testCompile "org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version"
```

## 处理注解

Kotlin plugin 支持 _Dagger_ 或 _DBFlow_ 之类的注解处理器. 为了让这些注解处理器与正确处理 Kotlin 类, 需要在你的 `dependencies` 块中使用 `kapt` 设置来添加对应的依赖:

``` groovy
dependencies {
  kapt 'groupId:artifactId:version'
}
```

如果你以前使用过 [android-apt](https://bitbucket.org/hvisser/android-apt) plugin, 请将它从你的 `build.gradle` 文件中删除, 然后将使用 `apt` 设置的地方替换为 `kapt`. 如果你的工程中包含 Java 类, `kapt` 也会正确地处理这些 Java 类. 如果你需要对 `androidTest` 或 `test` 源代码使用注解处理器, 那么与 `kapt` 配置相对应的名称应该是 `kaptAndroidTest` 和 `kaptTest`.

有些注解处理库要求你在源代码中使用自动生成的类. 为了实现这一点, 你需要在 build 文件中添加一些额外的标记, 来打开 _桩(stub)代码生成_ 功能:

``` groovy
kapt {
    generateStubs = true
}
```

注意, 生成桩代码(stub)会使你的编译工程略微变慢, 因此这个功能默认是关闭的. 如果生成的代码只在你的代码中很少的地方使用, 你可以选择替代方案, 用 Java 写一些辅助类(helper class), 然后在你的 Kotlin 中可以 [毫无障碍地调用这些辅助类](java-interop.html).

关于 `kapt` 的更多信息, 请参见 [官方 Blog](http://blog.jetbrains.com/kotlin/2015/06/better-annotation-processing-supporting-stubs-in-kapt/).

## 增量编译(Incremental compilation)

Kotlin 1.0.2 引入了新的 Gradle 中的增量编译模式, 但这个功能目前还是实验性的. 
增量编译功能会监视源代码文件在两次编译之间的变更, 因此只会编译那些变更过的文件.

打开增量编译功能的方式有以下几种:

  1. 向 `gradle.properties` 或 `local.properties` 文件添加 `kotlin.incremental=true`;

  2. 向 Gradle 命令行参数添加 `-Pkotlin.incremental=true`. 注意, 这种情况下应该向所有后续的编译命令都添加这个参数(任何一次编译, 如果不带这个参数, 都会导致增量编译的缓存失效).

增量编译功能打开之后, 你将会在编译 log 中看到以下警告信息:
```
Using experimental kotlin incremental compilation
```

注意, 初次编译不会是增量编译.

## 编译选项

如果需要指定额外的编译选项, 请使用 Kotlin 编译任务的 `kotlinOptions` 属性. 示例如下:

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


Gradle 任务所支持的编译选项完整列表如下:

### 'kotlin' 和 'kotlin2js' 任务支持的共通属性 

| 属性名称 | 描述 | 可以选择的值 |默认值 |
|------|-------------|-----------------|--------------|
| `apiVersion` | 只允许使用指定的版本的运行库中的 API | "1.0" | "1.0" |
| `languageVersion` | 指定源代码所兼容的 Kotlin 语言版本 | "1.0" | "1.0" |
| `suppressWarnings` | 不产生警告信息 |  | false |
| `verbose` | 输出详细的 log 信息 |  | false |
| `freeCompilerArgs` | 指定额外的编译参数, 可以是多个 |  | [] |

### 'kotlin' 任务独有的属性

| 属性名称 | 描述 | 可以选择的值 |默认值 |
|------|-------------|-----------------|--------------|
| `includeRuntime` | 将 Kotlin 运行库包含到编译结果的 .jar 文件内 |  | false |
| `jdkHome` | 如果 JDK home 目录路径与默认的 JAVA_HOME 值不一致, 这个参数可以指定 JDK home 目录路径, 这个路径将被添加到 classpath 内 |  |  |
| `jvmTarget` | 指定编译输出的 JVM 字节码的版本, 只支持 1.6 | "1.6" | "1.6" |
| `noJdk` | 不要将 Java 运行库包含到 classpath 内 |  | false |
| `noReflect` | 不要将 Kotlin 的反射功能实现库包含到 classpath 内 |  | true |
| `noStdlib` | 不要将 Kotlin 的运行库包含到 classpath 内 |  | true |

### 'kotlin2js' 任务独有的属性

| 属性名称 | 描述 | 可以选择的值 |默认值 |
|------|-------------|-----------------|--------------|
| `kjsm` | 生成 kjsm 文件 (用于创建 JavaScript 库) |  | true |
| `main` | 指定是否调用 main 函数 | "call", "noCall" | "call" |
| `metaInfo` | 指定是否生成 metadata |  | true |
| `moduleKind` | 指定编译器生成的模块类型 | "plain", "amd", "commonjs", "umd" | "plain" |
| `noStdlib` | 不使用默认附带的 Kotlin 标准库(stdlib) |  | true |
| `outputFile` | 指定输出文件的路径 |  |  |
| `sourceMap` | 是否生成源代码映射文件(source map) |  | false |
| `target` | 指定生成的 JS 文件 的 ECMA 版本 | "v5" | "v5" |


## OSGi

关于对 OSGi 的支持, 请参见 [Kotlin 与 OSGi](kotlin-osgi.html).

## 示例

[Kotlin 代码仓库](https://github.com/jetbrains/kotlin) 中包含以下示例:

* [Kotlin](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/hello-world)
* [Java 代码与 Kotlin 代码的混合](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/mixed-java-kotlin-hello-world)
* [Android](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/android-mixed-java-kotlin-project)
* [JavaScript](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/kotlin2JsProject)
