---
type: doc
layout: reference
title: "使用 Gradle 构建跨平台工程"
---

# Kotlin 跨平台程序的 Gradle DSL 参考文档

> 跨平台工程是 Kotlin 1.2 和 1.3 中的实验性功能. 本章介绍的所有语言特性和工具特性, 在未来的 Kotlin 版本中都可能发生变化.
{:.note}

Kotlin 跨平台 Gradle 插件, 是一个用来创建 [Kotlin 跨平台](multiplatform.html) 工程的工具.
本章我们提供关于它的参考文档; 当你为 Kotlin 跨平台工程编写 Gradle 编译脚本时可以参考本文档.
关于 Kotlin 跨平台工程的基本概念, 以及如何使用插件编写编译脚本, 请参见 [使用 Gradle 编译跨平台工程](building-mpp-with-gradle.html).

## 目录
 
* [插件 Id 与版本](#id-and-version)
* [顶级代码块](#top-level-blocks)
* [编译目标](#targets)
    * [所有编译目标的共通配置](#common-target-configuration)
    * [JVM 编译目标](#jvm-targets)
    * [JavaScript 编译目标](#javascript-targets)
    * [Native 编译目标](#native-targets)
    * [Android 编译目标](#android-targets)
* [源代码集(Source set)](#source-sets)
    * [预定义的源代码集](#predefined-source-sets)
    * [自定义源代码集](#custom-source-sets)
    * [源代码集参数](#source-set-parameters)
* [编译任务](#compilations)
    * [预定义的编译任务](#predefined-compilations)
    * [自定义编译任务](#custom-compilations)
    * [编译任务参数](#compilation-parameters)
* [依赖项目](#dependencies)
* [语言设置](#language-settings)

## 插件 Id 与版本

Kotlin 跨平台 Gradle 插件的完整限定名称是 `org.jetbrains.kotlin.multiplatform`. 
如果使用 Kotlin Gradle DSL, 可以通过 `kotlin(“multiplatform”)` 语句应用这个插件.
插件的版本与 Kotlin 发布版本一致. 最新的版本是 {{ site.data.releases.latest.version }}.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins {
    kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

## 顶级代码块

Gradle 编译脚本中跨平台工程配置的顶级代码块是 `kotlin`.
在 `kotlin` 之内, 你可以使用以下代码块:

|**代码块**|**解释**|
| --- | --- |
| _\<targetName\>_ |为工程声明一个特定的编译目标. 可以选择的编译目标名称请参见 [编译目标](#targets) 小节.|
|`targets` |工程的所有编译目标.|
|`presets` |所有预定义的编译目标. 使用这个代码块可以一次性 [设置多个预定义的编译目标](building-mpp-with-gradle.html#setting-up-targets).|
|`sourceSets` |为工程设置预定义的源代码集, 并声明自定义 [源代码集](building-mpp-with-gradle.html#configuring-source-sets).|

## 编译目标

_编译目标(Target)_ 是指针对某个特定的 [支持的平台](building-mpp-with-gradle.html#supported-platforms) 的一系列编译功能,
 包括源代码编译, 测试, 打包.
跨平台工程的编译目标通过 `kotlin` 之内的相应代码块进行描述, 比如, `jvm`, `android`, `iosArm64`.
可选的编译目标如下:
 
|**名称**|**解释**| 
| --- | --- |
|`jvm`| Java 虚拟机(Virtual Machine)|
|`js`| JavaScript|
|`android`|Android (APK)|
|`androidNativeArm32`|ARM (ARM32) 平台的 [Android NDK](https://developer.android.com/ndk)|
|`androidNativeArm64`|ARM64 平台的 [Android NDK](https://developer.android.com/ndk)|
|`androidNativeX86`|x86 平台的 [Android NDK](https://developer.android.com/ndk)|
|`androidNativeX64`|x86_64 平台的 [Android NDK](https://developer.android.com/ndk)|
|`iosArm32`|ARM (ARM32) 平台的 Apple iOS (Apple iPhone 5 或之前版本)|
|`iosArm64`|ARM64 平台的 Apple iOS (Apple iPhone 5s 或之后版本)|
|`iosX64`|Apple iOS 64位 模拟器|
|`watchosArm32`|ARM (ARM32) 平台的 Apple watchOS (Apple Watch Series 3 或之前版本)|
|`watchosArm64`|ARM64_32 平台的 Apple watchOS (Apple Watch Series 4 或之后版本)|
|`watchosX86`|Apple watchOS 模拟器|
|`tvosArm64`|ARM64 平台的 Apple tvOS (Apple TV 第 4 代之后版本)|
|`tvosX64`|Apple tvOS 模拟器|
|`linuxArm64`|ARM64 平台的 Linux, 比如, Raspberry Pi|
|`linuxArm32Hfp`|硬浮点(hard-float) ARM (ARM32) 平台的 Linux|
|`linuxMips32`|MIPS 平台的 Linux|
|`linuxMipsel32`|小尾序(little endian) MIPS (mipsel) 平台的 Linux|
|`linuxX64`|x86_64 平台的 Linux |
|`macosX64`|Apple macOS|
|`mingwX64`|64 位 Microsoft Windows|
|`mingwX86`|32 位 Microsoft Windows|
|`wasm32`|WebAssembly|

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm()
    iosX64()
    macosX64()
    js().browser()
}
```

</div>

编译目标的配置包括以下两部分:

* 对所有编译目标有效的 [共通配置](#common-target-configuration).
* 特定编译目标独有的配置.

### 所有编译目标的共通配置

在任何一种编译目标代码块之内, 都可以使用以下声明:

|**名称**|**解释**| 
| --- | --- |
|`attributes`|针对单个平台 [对编译目标消除歧义](building-mpp-with-gradle.html#disambiguating-targets) 的属性设置.|
|`preset`|如果存在的话, 代表创建这个编译目标时使用的预定义设置.|
|`platformType`|指定这个编译目标的 Kotlin 平台. 允许的值是: `jvm`, `androidJvm`, `js`, `native`, `common`.|
|`artifactsTaskName`|负责编译这个编译目标的结果 artifact 的编译任务的名称.|
|`components`|用于设置 Gradle publication 的组件.|

### JVM 编译目标

除 [所有编译目标的共通配置](#common-target-configuration) 之外, jvm 编译目标还支持以下专有函数:

|**名称**|**解释**| 
| --- | --- |
|`withJava()`|在 JVM 编译目标的编译任务中包含 Java 源代码.|

对同时包含 Java 和 Kotlin 源代码文件的工程, 请使用这个函数.
注意 Java 源代码文件的默认目录与 Java 插件的默认设定不同. 相反, 这个默认设定继承自 Kotlin 源代码集.
比如, 如果 JVM 编译目标使用默认名称 `jvm`, 那么默认的 Java 源代码文件目录是 `src/jvmMain/java` (正式产品的 Java 源代码) 和 `src/jvmTest/java` (测试程序的 Java 源代码).
详情请参见 [在 JVM 编译目标中支持 Java](building-mpp-with-gradle.html#java-support-in-jvm-targets).

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    jvm {
        withJava()
    } 
}
```

</div>

### JavaScript 编译目标

`js` 代码块描述 JavaScript 编译目标的配置. 根据编译目标的执行环境不同, 它可以包含以下两个代码块之一:

|**名称**|**解释**| 
| --- | --- |
|`browser`| 浏览器编译目标的配置.|
|`nodejs`| Node.js 编译目标的配置.|

关于 Kotlin/JS 工程配置的详细信息, 请参见 [创建 Kotlin JavaScript 工程](js-project-setup.html).

#### 浏览器

`browser` 代码块包含以下配置代码块:

|**名称**|**解释**| 
| --- | --- |
|`testRuns`|测试运行任务的配置.|
|`runTask`|工程运行的配置.|
|`webpackTask`|使用 [Webpack](https://webpack.js.org/) 编译工程的配置.|
|`dceTask`|[死代码剔除(Dead Code Elimination)](javascript-dce.html) 的配置.|
|`distribution`|输出文件的路径.|

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    js().browser {
        webpackTask { /* ... */ }
        testRuns { /* ... */ }
        dceTask {
            keep("myKotlinJsApplication.org.example.keepFromDce")
        }
        distribution {
            directory = File("$projectDir/customdir/")
        }        
    }
}
```

</div>

#### Node.js

`nodejs` 代码块包含测试和运行任务的配置:

|**名称**|**解释**| 
| --- | --- |
|`testRuns`|测试任务的配置.|
|`runTask`|工程运行任务的配置.|

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    js().nodejs {
        runTask { /* ... */ }
        testRuns { /* ... */ }
    }
}
```

</div>

### 原生(Native)编译目标

对于原生(Native)编译目标, 可以使用以下代码块:

|**名称**|**解释**| 
| --- | --- |
|`binaries`|编译输出的 [二进制文件(binary)](#binaries) 的配置.|
|`cinterops`| [与 C 库文件交互](#cinterops) 的配置.|

#### 二进制文件(Binary)

有以下几种二进制文件(Binary)任务:

|**名称**|**解释**| 
| --- | --- |
|`executable`|正式产品的可执行文件.|
|`test`|测试程序的可执行文件.|
|`sharedLib`|共享的库文件(Shared library).|
|`staticLib`|静态库文件(Static library).|
|`framework`|Objective-C 框架.|

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    linuxX64 { // 请在这里使用你的编译目标.
        binaries {
            executable {
                // 针对这个二进制文件的配置.
            }
        }
    }
}
```

</div>

对于二进制文件的配置, 可以设置的参数包括:

|**名称**|**解释**| 
| --- | --- |
|`compilation`|用于构建二进制文件的编译任务. 默认情况下, `test` 二进制文件 由 `test` 编译任务构建, 其他 二进制文件由 `main` 编译任务构建.|
|`linkerOpts`|构建二进制文件时, 传递给操作系统链接程序(linker)的选项.|
|`baseName`|对输出文件自定义它的基本名称(base name). 最终的完整文件名会在这个基本名称之上加上相应系统的前缀和后缀.|
|`entryPoint`|可执行二进制文件的入口点(entry point) 函数. 默认情况下, 是顶层包中的 `main()` 函数.|
|`outputFile`|用于访问输出文件.|
|`linkTask`|用于访问链接任务.|
|`runTask`|用于访问可执行二进制文件的运行任务. 对于 `linuxX64`, `macosX64`, 或 `mingwX64` 之外的编译目标, 这个属性的值为 `null`.|
|`isStatic`|用于 Objective-C 框架. 包含静态库(static library), 而不是动态库(dynamic library).|

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
binaries {
    executable('my_executable', [RELEASE]) {
        // 以测试编译任务为基础, 构建一个二进制文件.
        compilation = compilations.test

        // 对连接器自定义命令行选项.
        linkerOpts = ['-L/lib/search/path', '-L/another/search/path', '-lmylib']

        // 指定输出文件的基本名称.
        baseName = 'foo'

        // 自定义入口点函数.
        entryPoint = 'org.example.main'

        // 访问输出文件.
        println("Executable path: ${outputFile.absolutePath}")

        // 访问链接任务.
        linkTask.dependsOn(additionalPreprocessingTask)

        // 访问运行任务.
        // 注意, 对于当前编译环境不支持的(non-host) 平台, runTask 将会是 null.
        runTask?.dependsOn(prepareForRun)
    }

    framework('my_framework' [RELEASE]) {
        // 在框架中包含静态库而不是动态库.
        isStatic = true
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
binaries {
    executable("my_executable", listOf(RELEASE)) {
        // 以测试编译任务为基础, 构建一个二进制文件.
        compilation = compilations["test"]

        // 对连接器自定义命令行选项.
        linkerOpts = mutableListOf("-L/lib/search/path", "-L/another/search/path", "-lmylib")

        // 指定输出文件的基本名称.
        baseName = "foo"

        // 自定义入口点函数.
        entryPoint = "org.example.main"

        // 访问输出文件.
        println("Executable path: ${outputFile.absolutePath}")

        // 访问链接任务.
        linkTask.dependsOn(additionalPreprocessingTask)

        // 访问运行任务.
        // 注意, 对于当前编译环境不支持的(non-host) 平台, runTask 将会是 null.
        runTask?.dependsOn(prepareForRun)
    }

    framework("my_framework" listOf(RELEASE)) {
        // 在框架中包含静态库而不是动态库.
        isStatic = true
    }
}
```

</div>
</div>

关于二进制文件配置的更多详情, 请参见 [编译最终的原生二进制文件](building-mpp-with-gradle.html#building-final-native-binaries).

#### CInterops

`cinterops` 用于描述与原生库的交互.
要与一个库交互, 请添加一个 `cinterops` 代码块, 并定义它的参数, 如下:

|**名称**|**解释**| 
| --- | --- |
|`defFile`|描述原生 API 的 `def` 文件.|
|`packageName`|生成 Kotlin API 时的包前缀.|
|`compilerOpts`|cinterop 工具传递给编译器的选项.|
|`includeDirs`|用于查找头文件的目录.|

关于 Kotlin 与 C 库文件的交互, 更多详情请参见 [对 CInterop 的支持](building-mpp-with-gradle.html#cinterop-support).

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    linuxX64 { // 这里请替换为你需要的编译目标.
        compilations.main {
            cinterops {
                myInterop {
                    // 描述原生 API 的 def 文件.
                    // 默认路径是 src/nativeInterop/cinterop/<interop-name>.def
                    defFile project.file("def-file.def")

                    // 生成的 Kotlin API 所在的包.
                    packageName 'org.sample'

                    // cinterop 工具传递给编译器的参数.
                    compilerOpts '-Ipath/to/headers'

                    // 用于查找头文件的目录 (等同于 -I<path> 编译选项).
                    includeDirs.allHeaders("path1", "path2")

                    // includeDirs.allHeaders 的缩写方式.
                    includeDirs("include/directory", "another/directory")
                }

                anotherInterop { /* ... */ }
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    linuxX64 {  // 这里请替换为你需要的编译目标.
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // 描述原生 API 的 def 文件.
                // 默认路径是 src/nativeInterop/cinterop/<interop-name>.def
                defFile(project.file("def-file.def"))

                // 生成的 Kotlin API 所在的包.
                packageName("org.sample")

                // cinterop 工具传递给编译器的参数.
                compilerOpts("-Ipath/to/headers")

                // 用于查找头文件的目录 (等同于 -I<path> 编译选项).
                includeDirs.allHeaders("path1", "path2")

                // includeDirs.allHeaders 的缩写方式.
                includeDirs("include/directory", "another/directory")
            }

            val anotherInterop by cinterops.creating { /* ... */ }
        }
    }
}

```

</div>
</div>

### Android 编译目标

Kotlin 跨平台 Gradle 插件针对 Android 编译目标提供了两个专有的函数.
这两个函数帮助你设置 [构建变体(build variants)](https://developer.android.com/studio/build/build-variants):

|**名称**|**解释**| 
| --- | --- |
|`publishLibraryVariants()`|指定用于发布的构建变体. 详细的使用方法, 请参见 [发布 Android 库](building-mpp-with-gradle.html#publishing-android-libraries).|
|`publishAllLibraryVariants()`|发布所有的构建变体.|

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    android {
        publishLibraryVariants("release", "debug")
    }
}
```

</div>

关于跨平台工程 Android 编译目标的配置, 详细信息请参见 [Android 支持](building-mpp-with-gradle.html#android-support).

>注意, `kotlin` 代码块之内的 `android` 配置, 不会替代任何 Android 工程的编译配置.
关于如何为 Android 工程编写编译脚本, 详情请参见 [Android 开发文档](https://developer.android.com/studio/build).
{:.note}

## 源代码集(Source set)

`sourceSets` 代码块描述工程的源代码集. 源代码集是指在某个编译任务中一起参与编译的 Kotlin 源代码文件, 相关的资源文件, 依赖项目, 以及语言设置.

跨平台工程的各个编译目标都包含 [预定义的源代码集](#predefined-source-sets);
开发者也可以根据需要创建 [自定义的源代码集](#custom-source-sets).
关于源代码集的创建和配置, 具体方法请参见 [配置源代码集](building-mpp-with-gradle.html#configuring-source-sets).

### 预定义的源代码集

创建会在跨平台工程时会自动设置预定义的源代码集.
可用的预定义源代码集如下:

|**名称**|**解释**| 
| --- | --- |
|`commonMain`| 所有平台共用的代码和资源. 对所有的跨平台工程都可用. 工程的所有 main 编译任务都会使用这个源代码集.|
|`commonTest`| 所有平台共用的测试代码和资源. 对所有的跨平台工程都可用. 工程的所有 test 编译任务都会使用这个源代码集.|
|_\<targetName\>\<compilationName\>_|各个编译目标专有的源代码集. 这里的 _\<targetName\>_ 是预定义编译目标的名称, _\<compilationName\>_ 是这个编译目标的编译任务名称. 比如: `jsTest`, `jvmMain`.|

使用 Kotlin Gradle DSL 时, 预定义源代码集的代码块需要标记为 `by getting`.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin { 
    sourceSets { 
        commonMain { /* ... */ } 
    }
}
``` 

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin { 
    sourceSets { 
        val commonMain by getting { /* ... */ } 
    }
}
```

</div>
</div>

关于预定义的源代码集, 更多详情请参见 [默认的工程结构](building-mpp-with-gradle.html#default-project-layout).

### 自定义源代码集

自定义源代码集由工程开发者手动创建.
要创建一个自定义源代码集, 需要在 `sourceSets` 之内, 使用自定义源代码集的名称, 添加一个代码块.
如果使用 Kotlin Gradle DSL, 需要将自定义源代码集标记为 `by creating`.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin { 
    sourceSets { 
        myMain { /* ... */ } // 创建或设置一个名称为 'myMain' 的源代码集  
    }
}
``` 

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin { 
    sourceSets { 
        val myMain by creating { /* ... */ } // 创建一个新的, 名为 'MyMain' 的源代码集 
    }
}
```

</div>
</div>

注意, 新创建的源代码集不会关联到其他源代码集. 如果要在工程的编译任务中使用这个源代码集,
需要将它关联到其他源代码集, 方法请参见 [源代码集之间的关联](building-mpp-with-gradle.html#connecting-source-sets).

### 源代码集的参数

源代码集的配置保存在相应的 `sourceSets` 代码块之内. 一个源代码集包含以下参数:

|**名称**|**解释**| 
| --- | --- |
|`kotlin.srcDir`|源代码集目录之内的 Kotlin 源代码文件位置.|
|`resources.srcDir`|源代码集目录之内的资源文件位置.|
|`dependsOn`|关联到另一个源代码集. 源代码集直接相互关联的具体方法, 请参见 [源代码集之间的关联](building-mpp-with-gradle.html#connecting-source-sets).|
|`dependencies`|源代码集的 [依赖项目](#dependencies) .|
|`languageSettings`|用于这个源代码集的 [语言设置](building-mpp-with-gradle.html#language-settings).|

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin { 
    sourceSets { 
        commonMain {
            kotlin.srcDir('src')
            resources.srcDir('res')
            
            dependencies {
                /* ... */
            }           
        } 
    }
}
``` 

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin { 
    sourceSets { 
        val commonMain by getting {
            kotlin.srcDir("src")
            resources.srcDir("res")
            
            dependencies {
                /* ... */
            } 
        } 
    }
}
```

</div>
</div>

## 编译任务

一个编译目标可以包含一个或多个编译任务, 比如, 用于正式产品的编译任务, 或用于测试代码的编译任务. 编译目标创建时会自动添加 [预定义的编译任务](#predefined-compilations). 开发者也可以另外创建 [自定义编译任务](#custom-compilations).

如果需要访问一个编译目标的所有编译任务, 或某个特定的编译任务, 请使用 `compilations` 对象集合.
通过 `compilations`, 你可以使用名称来访问一个编译任务.

### 预定义的编译任务

对工程的每个编译目标, 会自动创建预定义的编译任务, Android 编译目标除外.
可用的预定义编译任务如下:

|**名称**|**解释**| 
| --- | --- |
|`main`|用于正式产品源代码的编译任务.|
|`test`|用于测试代码的编译任务.|

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm {
        compilations.main.output // 得到 main 编译任务的输出
        compilations.test.runtimeDependencyFiles // 得到 test 编译任务的运行时 classpath
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            output // 得到 main 编译任务的输出
        }
        
        compilations["test"].runtimeDependencyFiles // 得到 test 编译任务的运行时 classpath
    }
}
```

</div>
</div>

### 自定义编译任务

除了预定义的编译任务之外, 开发者还可以创建自己的自定义编译任务.
要创建一个自定义编译任务, 请在 `compilations` 集合中添加一个新的项目.
如果使用 Kotlin Gradle DSL, 自定义编译任务需要标记为 `by creating`.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm() {
        compilations.create('integrationTest') {
            defaultSourceSet {
                dependencies {
                    /* ... */
                }
            }

            // 创建一个 test 任务, 用于运行这个编译任务产生的测试代码:
            tasks.create('jvmIntegrationTest', Test) {
                /* ... */
            }
        }
    }
}
```

</div> 
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    jvm() {
        compilations {
            val integrationTest by compilations.creating {
                defaultSourceSet {
                    dependencies {
                        /* ... */
                    }
                }

                // 创建一个 test 任务, 用于运行这个编译任务产生的测试代码:
                tasks.create<Test>("integrationTest") {
                    /* ... */
                }
            }
        }
    }
}
```

</div>
</div>

### 编译任务的参数

一个编译任务可以包含以下参数:

|**名称**|**解释**| 
| --- | --- |
|`defaultSourceSet`|编译任务的默认源代码集.|
|`kotlinSourceSets`|源代码集, 参与这个编译任务.|
|`allKotlinSourceSets`|源代码集, 参与这个编译任务, 以及通过 `dependsOn()` 关联的所有其他编译任务.|
|`kotlinOptions`|应用于这个编译任务的编译器选项. 关于所有可用的选项, 请参见 [编译选项](using-gradle.html#compiler-options).|
|`compileKotlinTask`|编译 Kotlin 源代码的 Gradle 任务.|
|`compileKotlinTaskName`|`compileKotlinTask` 的名称.|
|`compileAllTaskName`|编译这个编译任务中所有源代码的Gradle 任务的名称.|
|`output`|编译任务的输出.|
|`compileDependencyFiles`|这个编译任务的编译时刻依赖项目文件(classpath).|
|`runtimeDependencyFiles`|这个编译任务的运行时刻依赖项目文件(classpath).|

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm {
        compilations.main.kotlinOptions { 
            // 为 'main' 编译任务设置 Kotlin 编译器选项:
            jvmTarget = "1.8"
        }
        
        compilations.main.compileKotlinTask // 得到编译 Kotlin 源代码的 Gradle 任务 'compileKotlinJvm' 
        compilations.main.output // 得到 main 编译任务的输出
        compilations.test.runtimeDependencyFiles // 得到 test 编译任务的运行时刻 classpath
    }
    
    // 对所有编译目标的所有编译任务的设置:
    targets.all {
        compilations.all {
            kotlinOptions {
                allWarningsAsErrors = true
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            kotlinOptions { 
                // 为 'main' 编译任务设置 Kotlin 编译器选项:
                jvmTarget = "1.8"
            }
        
            compileKotlinTask // 得到编译 Kotlin 源代码的 Gradle 任务 'compileKotlinJvm' 
            output // 得到 main 编译任务的输出
        }
        
        compilations["test"].runtimeDependencyFiles // 得到 test 编译任务的运行时刻 classpath
    }
     
    // 对所有编译目标的所有编译任务的设置:
    targets.all {
        compilations.all {
            kotlinOptions {
                allWarningsAsErrors = true
            }
        }
    }
}
```

</div>
</div>

## 依赖项目

源代码集的 `dependencies` 代码块包含这个源代码集的依赖项目.
有 4 种依赖项目:

|**名称**|**解释**| 
| --- | --- |
|`api`|当前模块的 API 中使用的依赖项目.|
|`implementation`|当前模块中使用的依赖项目, 但不向外暴露.|
|`compileOnly`|只在当前模块的编译任务中使用的依赖项目.|
|`runtimeOnly`|运行时刻的依赖项目, 但在任何模块的编译任务中都不可见.|

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                api 'com.example:foo-metadata:1.0'
            }
        }
        jvm6Main {
            dependencies {
                implementation 'com.example:foo-jvm6:1.0'
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```groovy
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                api("com.example:foo-metadata:1.0")
            }
        }
        val jvm6Main by getting {
            dependencies {
                implementation("com.example:foo-jvm6:1.0")
            }
        }
    }
}
```

</div>
</div>

除此之外, 源代码集之间还可以相互依赖. 这种情况下, 应该使用 [dependsOn()](#source-set-parameters) 函数.
在编译脚本的最顶层 `dependencies` 代码块中, 也可以声明源代码集的依赖项目.
这种情况下, 依赖项目声明需要使用 `<sourceSetName><DependencyKind>` 格式, 比如, `commonMainApi`.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
dependencies {
    commonMainApi 'com.example:foo-common:1.0'
    jvm6MainApi 'com.example:foo-jvm6:1.0'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
dependencies {
    "commonMainApi"("com.example:foo-common:1.0")
    "jvm6MainApi"("com.example:foo-jvm6:1.0")
}
```

</div>
</div>

## 语言设置

源代码集的 `languageSettings` 代码块用来定义工程分析和构建的某些方面. 可选的语言设置如下:

|**名称**|**解释**| 
| --- | --- |
|`languageVersion`|与某个 Kotlin 版本保持源代码级的兼容性.|
|`apiVersion`|允许使用从指定的 Kotlin 版本的库才开始提供的 API 声明.|
|`enableLanguageFeature`|启用指定的语言特性. 这个参数可选的值, 对应于那些目前还处于试验状态的语言特性, 或还没有正式公布的语言特性.|
|`useExperimentalAnnotation`|允许使用指定的 [明确要求使用者同意(Opt-in) 注解](opt-in-requirements.html).|
|`progressiveMode`|启用 [渐进模式(progressive mode)](whatsnew13.html#progressive-mode).|

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    sourceSets {
        commonMain {
            languageSettings {
                languageVersion = '1.3' // 可选的值: '1.0', '1.1', '1.2', '1.3'
                apiVersion = '1.3' // 可选的值: '1.0', '1.1', '1.2', '1.3'
                enableLanguageFeature('InlineClasses') // 这里请使用语言特性的名称
                useExperimentalAnnotation('kotlin.ExperimentalUnsignedTypes') // 这里请使用注解的完全限定名称
                progressiveMode = true // 默认值为 false
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            languageSettings.apply {
                languageVersion = "1.3" // 可选的值: '1.0', '1.1', '1.2', '1.3'
                apiVersion = "1.3" // 可选的值: '1.0', '1.1', '1.2', '1.3'
                enableLanguageFeature("InlineClasses") // 这里请使用语言特性的名称
                useExperimentalAnnotation("kotlin.ExperimentalUnsignedTypes") // 这里请使用注解的完全限定名称
                progressiveMode = true // 默认值为 false
            }
        }
    }
}
```

</div>
</div>
