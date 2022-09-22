---
type: doc
layout: reference
title: "跨平台程序的 Gradle DSL 参考文档"
---

# 跨平台程序的 Gradle DSL 参考文档

最终更新: {{ site.data.releases.latestDocDate }}

> 跨平台项目还处于 [Alpha](../components-stability.html) 阶段.
它的语言特性和工具在未来的 Kotlin 版本中可能发生变化.
{:.note}

Kotlin 跨平台 Gradle 插件, 是一个用来创建 [Kotlin Multiplatform](multiplatform.html) 项目的工具.
本章我们提供关于它的参考文档; 当你为 Kotlin Multiplatform 项目编写 Gradle 编译脚本时可以参考本文档.
详情请参见 [关于 Kotlin Multiplatform 项目的基本概念, 如何创建和配置跨平台项目](multiplatform-get-started.html).

## 插件 Id 与版本

Kotlin 跨平台 Gradle 插件的完整限定名称是 `org.jetbrains.kotlin.multiplatform`.
如果使用 Kotlin Gradle DSL, 可以通过 `kotlin("multiplatform")` 语句应用这个插件.
插件的版本与 Kotlin 发布版本一致. 最新的版本是 {{ site.data.releases.latest.version }}.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins {
    kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}
```

</div>
</div>

## 顶级代码块

Gradle 编译脚本中跨平台项目配置的顶级代码块是 `kotlin`.
在 `kotlin` 之内, 你可以使用以下代码块:

| **代码块**          | **解释**                                              |
|------------------|-----------------------------------------------------|
| _\<targetName\>_ | 为项目声明一个特定的编译目标. 可以选择的编译目标名称请参见 [编译目标](#targets) 小节. |
| `targets`        | 项目的所有编译目标.                                          |
| `presets`        | 所有预定义的编译目标. 使用这个代码块可以一次性 [设置多个预定义的编译目标](#targets).  |
| `sourceSets`     | 为项目设置预定义的源代码集, 并声明自定义 [源代码集](#source-sets).         |

## 编译目标

_编译目标(Target)_ 是指针对某个特定的支持的平台的一系列编译功能, 包括源代码编译, 测试, 打包.
Kotlin 对每个平台提供了预设置的编译目标(Target Preset). 参见 [如何使用预设置的编译目标(Target Preset)](multiplatform-set-up-targets.html).

每个编译目标可以包含一个或多个 [编译任务(compilation)](#compilations).
除了用于测试和产品的默认的编译任务之外, 你还可以 [创建自定义的编译任务](mpp-configure-compilations.html#create-a-custom-compilation).

跨平台项目的编译目标通过 `kotlin` 之内的相应代码块进行描述, 比如, `jvm`, `android`, `iosArm64`.
可选的编译目标如下:

<table>
    <tr>
        <th>目标平台</th>
        <th>编译目标的预定义配置</th>
        <th>注释</th>
    </tr>
    <tr>
        <td>Kotlin/JVM</td>
        <td><code>jvm</code></td>
        <td></td>
    </tr>
    <tr>
        <td>Kotlin/JS</td>
        <td><code>js</code></td>
        <td>
            <p>选择执行环境:</p>
            <ul>
                <li><code>browser {}</code> 用于运行在浏览器内的应用程序.</li>
                <li><code>nodejs {}</code> 运行在 Node.js 上的应用程序.</li>
            </ul>
            <p>更多详情请参见 <a href="../js/js-project-setup.html#execution-environments">创建 Kotlin JavaScript 项目</a>.</p>
        </td>
    </tr>
    <tr>
        <td>Android 应用程序和库</td>
        <td><code>android</code></td>
        <td>
            <p>手动应用 Android Gradle plugin  – <code>com.android.application</code> 或 <code>com.android.library</code>.</p>
            <p>对每个 Gradle 子项目, 只能创建一个 Android 编译目标.</p>
        </td>
    </tr>
    <tr>
        <td>Android NDK</td>
        <td>
           <ul>
               <li><code>androidNativeArm32</code> — ARM (ARM32) 平台上的 <a href="https://developer.android.com/ndk" target="_blank">Android NDK</a></li>
               <li><code>androidNativeArm64</code> — ARM64 平台上的 <a href="https://developer.android.com/ndk" target="_blank">Android NDK</a></li>
               <li><code>androidNativeX86</code> — x86 平台上的 <a href="https://developer.android.com/ndk" target="_blank">Android NDK</a></li>
               <li><code>androidNativeX64</code> — x86_64 平台上的 <a href="https://developer.android.com/ndk" target="_blank">Android NDK</a></li>
           </ul>
        </td>
        <td>
            <p>64 位编译目标需要在 Linux 或 macOS 主机上构建.</p>
            <p>32 位编译目标可以在任何支持的主机上构建.</p>
        </td>
    </tr>
    <tr>
        <td>iOS</td>
        <td>
            <ul>
               <li><code>iosArm32</code> — ARM (ARM32) 平台上的 Apple iOS (Apple iPhone 5 及之前版本)</li>
               <li><code>iosArm64</code> — ARM64 平台上的 Apple iOS (Apple iPhone 5s 及之后版本)</li>
               <li><code>iosX64</code> — x86_64 平台上的 Apple iOS 模拟器</li>
               <li><code>iosSimulatorArm64</code> — Apple Silicon 平台上的 Apple iOS 模拟器</li>
            </ul>
        </td>
        <td>需要在安装了 <a href="https://apps.apple.com/us/app/xcode/id497799835">Xcode</a> 及其命令行工具的 macOS 主机上构建.</td>
    </tr>
    <tr>
        <td>watchOS</td>
        <td>
            <ul>
               <li><code>watchosArm32</code> — ARM (ARM32) 平台上的 Apple watchOS (Apple Watch Series 3 及之前版本)</li>
               <li><code>watchosArm64</code> — ARM64_32 平台上的 Apple watchOS (Apple Watch Series 4 及之后版本)</li>
               <li><code>watchosX86</code> — x86_64 平台上的 Apple watchOS 32-bit 模拟器 (watchOS 6.3 及之前版本)</li>
               <li><code>watchosX64</code> — x86_64 平台上的 Apple watchOS 64-bit 模拟器 (watchOS 7.0 及之后版本)</li>
               <li><code>watchosSimulatorArm64</code> — Apple Silicon 平台上的 Apple watchOS 模拟器</li>
            </ul>
        </td>
        <td>需要在安装了 <a href="https://apps.apple.com/us/app/xcode/id497799835">Xcode</a> 及其命令行工具的 macOS 主机上构建.</td>
    </tr>
    <tr>
        <td>tvOS</td>
        <td>
            <ul>
               <li><code>tvosArm64</code> — ARM64 平台上的 Apple tvOS (Apple TV 第 4 代及之后版本)</li>
               <li><code>tvosX64</code> — x86_64 平台上的 Apple tvOS 模拟器</li>
               <li><code>tvosSimulatorArm64</code> — Apple Silicon 平台上的 Apple tvOS 模拟器</li>
            </ul>
        </td>
        <td>需要在安装了 <a href="https://apps.apple.com/us/app/xcode/id497799835">Xcode</a> 及其命令行工具的 macOS 主机上构建.</td>
    </tr>
    <tr>
        <td>macOS</td>
        <td>
            <ul>
               <li><code>macosX64</code> — x86_64 平台上的 Apple macOS</li>
               <li><code>macosArm64</code> — Apple Silicon 平台上的 Apple macOS</li>
            </ul>
        </td>
        <td>需要在安装了 <a href="https://apps.apple.com/us/app/xcode/id497799835">Xcode</a> 及其命令行工具的 macOS 主机上构建.</td>
    </tr>
    <tr>
        <td>Linux</td>
        <td>
            <ul>
               <li><code>linuxArm64</code> — ARM64 平台上的 Linux, 例如, Raspberry Pi</li>
               <li><code>linuxArm32Hfp</code> — 硬浮点(Hard-Float) ARM (ARM32) 平台上的 Linux</li>
               <li><code>linuxMips32</code> — MIPS 平台上的 Linux</li>
               <li><code>linuxMipsel32</code> — 小端序(Little-Endian) MIPS (mipsel) 平台上的 Linux</li>
               <li><code>linuxX64</code> — x86_64 平台上的 Linux</li>
            </ul>
        </td>
        <td>
            <p>Linux MIPS 编译目标 (<code>linuxMips32</code> 和 <code>linuxMipsel32</code>) 需要在 Linux 主机上构建.</p>
            <p>其他 Linux 编译目标可以在任何支持的主机上构建.</p>
        </td>
    </tr>
    <tr>
        <td>Windows</td>
        <td>
            <ul>
               <li><code>mingwX64</code> — 64 位 Microsoft Windows</li>
               <li><code>mingwX86</code> — 32 位 Microsoft Windows</li>
            </ul>
        </td>
        <td></td>
    </tr>
    <tr>
        <td>WebAssembly</td>
        <td><code>wasm32</code></td>
        <td></td>
    </tr>
</table>

> 构建中会忽略当前主机不支持的编译目标, 因此这些编译目标不会被发布.
{:.note}

```groovy
kotlin {
    jvm()
    iosX64()
    macosX64()
    js().browser()
}
```

编译目标的配置包括以下两部分:

* 对所有编译目标有效的 [共通配置](#common-target-configuration).
* 特定编译目标独有的配置.

每个编译目标可以有一个或多个 [编译任务(compilation)](#compilations).

### 所有编译目标的共通配置

在任何一种编译目标代码块之内, 都可以使用以下声明:

| **名称**              | **解释**                                                                                          |
|---------------------|-------------------------------------------------------------------------------------------------|
| `attributes`        | 针对单个平台 [对编译目标消除歧义](multiplatform-set-up-targets.html#distinguish-several-targets-for-one-platform) 的属性设置. |
| `preset`            | 如果存在的话, 代表创建这个编译目标时使用的预定义设置.                                                                    |
| `platformType`      | 指定这个编译目标的 Kotlin 平台. 允许的值是: `jvm`, `androidJvm`, `js`, `native`, `common`.                      |
| `artifactsTaskName` | 负责编译这个编译目标的结果 artifact 的编译任务的名称.                                                                |
| `components`        | 用于设置 Gradle publication 的组件.                                                                    |

### JVM 编译目标

除 [所有编译目标的共通配置](#common-target-configuration) 之外, `jvm` 编译目标还支持以下专有函数:

|**名称**|**解释**|
| --- | --- |
|`withJava()`|在 JVM 编译目标的编译任务中包含 Java 源代码.|

对同时包含 Java 和 Kotlin 源代码文件的项目, 请使用这个函数.
注意 Java 源代码文件的默认目录与 Java 插件的默认设定不同. 相反, 这个默认设定继承自 Kotlin 源代码集.
比如, 如果 JVM 编译目标使用默认名称 `jvm`, 那么默认的 Java 源代码文件目录是 `src/jvmMain/java` (正式产品的 Java 源代码) 和 `src/jvmTest/java` (测试程序的 Java 源代码).
详情请参见 [在 JVM 编译任务中使用 Java 源代码](multiplatform-configure-compilations.html#use-java-sources-in-jvm-compilations).

```kotlin
kotlin {
    jvm {
        withJava()
    }
}
```

### JavaScript 编译目标

`js` 代码块描述 JavaScript 编译目标的配置. 根据编译目标的执行环境不同, 它可以包含以下两个代码块之一:

|**名称**|**解释**|
| --- | --- |
|`browser`| 浏览器编译目标的配置.|
|`nodejs`| Node.js 编译目标的配置.|

详情请参见 [配置 Kotlin/JS 项目](../js/js-project-setup.html).

#### 浏览器

`browser` 代码块包含以下配置代码块:

|**名称**|**解释**|
| --- | --- |
|`testRuns`|测试运行任务的配置.|
|`runTask`|项目运行的配置.|
|`webpackTask`|使用 [Webpack](https://webpack.js.org/) 编译项目的配置.|
|`dceTask`|[死代码剔除(Dead Code Elimination)](../js/javascript-dce.html) 的配置.|
|`distribution`|输出文件的路径.|

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

#### Node.js

`nodejs` 代码块包含测试和运行任务的配置:

|**名称**|**解释**|
| --- | --- |
|`testRuns`|测试任务的配置.|
|`runTask`|项目运行任务的配置.|

```kotlin
kotlin {
    js().nodejs {
        runTask { /* ... */ }
        testRuns { /* ... */ }
    }
}
```

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

详情请参见 [构建原生二进制文件](multiplatform-build-native-binaries.html).

#### CInterops

`cinterops` 用于描述与原生库的交互.
要与一个库交互, 请添加一个 `cinterops` 代码块, 并定义它的参数, 如下:

|**名称**|**解释**|
| --- | --- |
|`defFile`|描述原生 API 的 `def` 文件.|
|`packageName`|生成 Kotlin API 时的包前缀.|
|`compilerOpts`|cinterop 工具传递给编译器的选项.|
|`includeDirs`|用于查找头文件的目录.|

详情请参见 [如何配置与原生语言的交互](multiplatform-configure-compilations.html#configure-interop-with-native-languages).

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    linuxX64 { // 这里请替换为你需要的编译目标.
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

### Android 编译目标

Kotlin Multiplatform plugin 针对 Android 编译目标提供了两个专有的函数.
这两个函数帮助你设置 [构建变体(build variants)](https://developer.android.com/studio/build/build-variants):

| **名称**                        | **解释**                                                                                        |
|-------------------------------|-----------------------------------------------------------------------------------------------|
| `publishLibraryVariants()`    | 指定用于发布的构建变体. 详情请参见 [发布 Android 库](multiplatform-publish-lib.html#publish-an-android-library). |
| `publishAllLibraryVariants()` | 发布所有的构建变体.                                                                                    |

```kotlin
kotlin {
    android {
        publishLibraryVariants("release", "debug")
    }
}
```

详情请参见 [针对 Android 的编译](multiplatform-configure-compilations.html#compilation-for-android).

>`kotlin` 代码块之内的 `android` 配置, 不会替代任何 Android 项目的编译配置.
关于如何为 Android 项目编写编译脚本, 详情请参见 [Android 开发文档](https://developer.android.com/studio/build).
{:.note}

## 源代码集(Source set)

`sourceSets` 代码块描述项目的源代码集. 源代码集是指在某个编译任务中一起参与编译的 Kotlin 源代码文件, 相关的资源文件, 依赖项目, 以及语言设置.

跨平台项目的各个编译目标都包含 [预定义的源代码集](#predefined-source-sets);
开发者也可以根据需要创建 [自定义的源代码集](#custom-source-sets).

### 预定义的源代码集

创建会在跨平台项目时会自动设置预定义的源代码集.
可用的预定义源代码集如下:

|**名称**|**解释**|
| --- | --- |
|`commonMain`| 所有平台共用的代码和资源. 对所有的跨平台项目都可用. 项目的所有 main [编译任务](#compilations)都会使用这个源代码集.|
|`commonTest`| 所有平台共用的测试代码和资源. 对所有的跨平台项目都可用. 项目的所有 test 编译任务都会使用这个源代码集.|
|_\<targetName\>\<compilationName\>_|各个编译目标专有的源代码集. 这里的 _\<targetName\>_ 是预定义编译目标的名称, _\<compilationName\>_ 是这个编译目标的编译任务名称. 比如: `jsTest`, `jvmMain`.|

使用 Kotlin Gradle DSL 时, 预定义源代码集的代码块需要标记为 `by getting`.

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

详情请参见 [源代码集](multiplatform-discover-project.html#source-sets).

### 自定义源代码集

自定义源代码集由项目开发者手动创建.
要创建一个自定义源代码集, 需要在 `sourceSets` 之内, 使用自定义源代码集的名称, 添加一个代码块.
如果使用 Kotlin Gradle DSL, 需要将自定义源代码集标记为 `by creating`.

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

注意, 新创建的源代码集不会关联到其他源代码集. 如果要在项目的编译任务中使用这个源代码集,
[请将它关联到其他源代码集](multiplatform-share-on-platforms.html#configure-the-hierarchical-structure-manually).

### 源代码集的参数

源代码集的配置保存在相应的 `sourceSets` 代码块之内. 一个源代码集包含以下参数:

| **名称**             | **解释**                                                                                  |
|--------------------|-----------------------------------------------------------------------------------------|
| `kotlin.srcDir`    | 源代码集目录之内的 Kotlin 源代码文件位置.                                                               |
| `resources.srcDir` | 源代码集目录之内的资源文件位置.                                                                        |
| `dependsOn`        | [关联到另一个源代码集](multiplatform-share-on-platforms.html#configure-the-hierarchical-structure-manually) |
| `dependencies`     | 源代码集的 [依赖项目](#dependencies) .                                                           |
| `languageSettings` | 用于这个源代码集的 [语言设置](#language-settings).                             |

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

## 编译任务

一个编译目标可以包含一个或多个编译任务, 比如, 用于正式产品的编译任务, 或用于测试代码的编译任务. 编译目标创建时会自动添加 [预定义的编译任务](#predefined-compilations).
你也可以另外创建 [自定义编译任务](#custom-compilations).

如果需要访问一个编译目标的所有编译任务, 或某个特定的编译任务, 请使用 `compilations` 对象集合.
通过 `compilations`, 你可以使用名称来访问一个编译任务.

详情请参见 [配置编译任务](multiplatform-configure-compilations.html).

### 预定义的编译任务

对项目的每个编译目标, 会自动创建预定义的编译任务, Android 编译目标除外.
可用的预定义编译任务如下:

|**名称**|**解释**|
| --- | --- |
|`main`|用于正式产品源代码的编译任务.|
|`test`|用于测试代码的编译任务.|

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

### 自定义编译任务

除了预定义的编译任务之外, 你也可以创建自己的自定义编译任务.
要创建一个自定义编译任务, 请在 `compilations` 集合中添加一个新的项目.
如果使用 Kotlin Gradle DSL, 自定义编译任务需要标记为 `by creating`.

详情请参见 [创建自定义编译任务](multiplatform-configure-compilations.html#create-a-custom-compilation).

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
                tasks.register<Test>("integrationTest") {
                    /* ... */
                }
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
    jvm() {
        compilations.create('integrationTest') {
            defaultSourceSet {
                dependencies {
                    /* ... */
                }
            }

            // 创建一个 test 任务, 用于运行这个编译任务产生的测试代码:
            tasks.register('jvmIntegrationTest', Test) {
                /* ... */
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
|`kotlinOptions`|应用于这个编译任务的编译器选项. 关于所有可用的选项, 请参见 [编译选项](../gradle.html#compiler-options).|
|`compileKotlinTask`|编译 Kotlin 源代码的 Gradle 任务.|
|`compileKotlinTaskName`|`compileKotlinTask` 的名称.|
|`compileAllTaskName`|编译这个编译任务中所有源代码的Gradle 任务的名称.|
|`output`|编译任务的输出.|
|`compileDependencyFiles`|这个编译任务的编译时刻依赖项目文件(classpath).|
|`runtimeDependencyFiles`|这个编译任务的运行时刻依赖项目文件(classpath).|

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

## 依赖项目

源代码集的 `dependencies` 代码块包含这个源代码集的依赖项目.

详情请参见 [配置依赖项](../gradle.html#configuring-dependencies).

有 4 种类型的依赖项目:

|**名称**|**解释**|
| --- | --- |
|`api`|当前模块的 API 中使用的依赖项目.|
|`implementation`|当前模块中使用的依赖项目, 但不向外暴露.|
|`compileOnly`|只在当前模块的编译任务中使用的依赖项目.|
|`runtimeOnly`|运行时刻的依赖项目, 但在任何模块的编译任务中都不可见.|

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

除此之外, 源代码集之间还可以相互依赖, 形成一种层级结构. 这种情况下, 应该使用 [dependsOn()](#source-set-parameters) 关系.

在编译脚本的最顶层 `dependencies` 代码块中, 也可以声明源代码集的依赖项目.
这种情况下, 依赖项目声明需要使用 `<sourceSetName><DependencyKind>` 格式, 比如, `commonMainApi`.

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

## 语言设置

源代码集的 `languageSettings` 代码块用来定义项目分析和构建的某些方面. 可选的语言设置如下:

|**名称**|**解释**|
| --- | --- |
|`languageVersion`|与某个 Kotlin 版本保持源代码级的兼容性.|
|`apiVersion`|允许使用从指定的 Kotlin 版本的库才开始提供的 API 声明.|
|`enableLanguageFeature`|启用指定的语言特性. 这个参数可选的值, 对应于那些目前还处于试验状态的语言特性, 或还没有正式公布的语言特性.|
|`optIn`|允许使用指定的 [明确要求使用者同意(Opt-in) 注解](../opt-in-requirements.html).|
|`progressiveMode`|启用 [渐进模式(progressive mode)](../whatsnew13.html#progressive-mode).|

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "1.7" // 可选的值: "1.4", "1.5", "1.6", "1.7"
            apiVersion = "1.7" // 可选的值: "1.3", "1.4", "1.5", "1.6", "1.7"
            enableLanguageFeature("InlineClasses") // 这里请使用语言特性的名称
            optIn("kotlin.ExperimentalUnsignedTypes") // 这里请使用注解的完全限定名称
            progressiveMode = true // 默认值为 false
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
    sourceSets.all {
        languageSettings {
            languageVersion = '1.7' // 可选的值: '1.4', '1.5', '1.6', '1.7'
            apiVersion = '1.7' // 可选的值: '1.3', '1.4', '1.5', '1.6', '1.7'
            enableLanguageFeature('InlineClasses') // 这里请使用语言特性的名称
            optIn('kotlin.ExperimentalUnsignedTypes') // 这里请使用注解的完全限定名称
            progressiveMode = true // 默认值为 false
        }
    }
}
```

</div>
</div>
