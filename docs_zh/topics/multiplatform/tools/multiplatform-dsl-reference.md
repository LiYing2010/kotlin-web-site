[//]: # (title: 跨平台程序的 Gradle DSL 参考文档)

Kotlin Multiplatform Gradle plugin, 是一个用来创建 Kotlin Multiplatform 项目的工具.
本章我们提供关于它的参考文档; 当你为 Kotlin Multiplatform 项目编写 Gradle 编译脚本时可以参考本文档.
详情请参见 [关于 Kotlin Multiplatform 项目的基本概念, 如何创建和配置跨平台项目](multiplatform-discover-project.md).

## 插件 ID 与版本 {id="id-and-version"}

Kotlin 跨平台 Gradle 插件的完整限定名称是 `org.jetbrains.kotlin.multiplatform`.
如果使用 Kotlin Gradle DSL, 可以通过 `kotlin("multiplatform")` 语句应用这个插件.
插件的版本与 Kotlin 发布版本一致. 最新的版本是 %kotlinVersion%.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

## 顶级代码块 {id="top-level-blocks"}

Gradle 编译脚本中跨平台项目配置的顶级代码块是 `kotlin {}`.
在 `kotlin {}` 之内, 你可以使用以下代码块:

| **代码块**              | **解释**                                                                       |
|----------------------|------------------------------------------------------------------------------|
| _&lt;targetName&gt;_ | 为项目声明一个特定的编译目标. 可以选择的编译目标名称请参见 [编译目标](#targets) 小节.                          |
| `targets`            | 列出项目的所有编译目标.                                                                 |
| `sourceSets`         | 为项目设置预定义的源代码集, 并声明自定义 [源代码集](#source-sets).                                  |
| `compilerOptions`    | 指定共通的扩展级(Extension Level) [编译器选项](#compiler-options), 对所有的编译目标和共用的源代码集用作默认值. |

## 编译目标 {id="targets"}

_编译目标(Target)_ 是指针对某个特定的支持的平台的一系列编译功能, 包括源代码编译, 测试, 打包.
Kotlin 对每个平台提供了编译目标, 让你能够指示 Kotlin 对指定的编译目标编译代码.
学习如何 [设置编译目标](multiplatform-discover-project.md#targets).

每个编译目标可以包含一个或多个 [编译任务(compilation)](#compilations).
除了用于测试和产品的默认的编译任务之外, 你还可以 [创建自定义的编译任务](multiplatform-configure-compilations.md#create-a-custom-compilation).

跨平台项目的编译目标通过 `kotlin {}` 之内的相应代码块进行描述, 比如, `jvm`, `androidTarget`, `iosArm64`.
可选的编译目标如下:

<table>
    <tr>
        <th>目标平台</th>
        <th>编译目标</th>
        <th>注释</th>
    </tr>
    <tr>
        <td>Kotlin/JVM</td>
        <td><code>jvm</code></td>
        <td></td>
    </tr>
    <tr>
        <td rowspan="2">Kotlin/Wasm</td>
        <td><code>wasmJs</code></td>
        <td>如果要在 JavaScript 环境中运行你的项目, 请使用这个配置.</td>
    </tr>
    <tr>
        <td><code>wasmWasi</code></td>
        <td>如果要支持 <a href="https://github.com/WebAssembly/WASI">WASI</a> 系统接口, 请使用这个配置.</td>
    </tr>
    <tr>
        <td>Kotlin/JS</td>
        <td><code>js</code></td>
        <td>
            <p>选择执行环境:</p>
            <list>
                <li><code>browser {}</code> 用于运行在浏览器内的应用程序.</li>
                <li><code>nodejs {}</code> 运行在 Node.js 上的应用程序.</li>
            </list>
            <p>更多详情请参见 <a href="js-project-setup.md#execution-environments">创建 Kotlin JavaScript 项目</a>.</p>
        </td>
    </tr>
    <tr>
        <td>Kotlin/Native</td>
        <td></td>
        <td>
            <p>对 macOS, Linux, 和 Windows 主机, 目前支持的编译目标请参见 <a href="native-target-support.md">Kotlin/Native 支持的目标平台</a>.</p>
        </td>
    </tr>
    <tr>
        <td>Android 应用程序和库</td>
        <td><code>androidTarget</code></td>
        <td>
            <p>手动应用 Android Gradle plugin: <code>com.android.application</code> 或 <code>com.android.library</code>.</p>
            <p>对每个 Gradle 子项目, 只能创建一个 Android 编译目标.</p>
        </td>
    </tr>
</table>

> 构建中会忽略当前主机不支持的编译目标, 因此这些编译目标不会被发布.
>
{style="note"}

```groovy
kotlin {
    jvm()
    iosArm64()
    macosX64()
    js().browser()
}
```

编译目标的配置包括以下两部分:

* 对所有编译目标有效的 [共通配置](#common-target-configuration).
* 特定编译目标独有的配置.

每个编译目标可以有一个或多个 [编译任务(compilation)](#compilations).

### 所有编译目标的共通配置 {id="common-target-configuration"}

在任何一种编译目标代码块之内, 都可以使用以下声明:

| **名称**              | **解释**                                                                                                                            |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `platformType`      | 这个编译目标的 Kotlin 平台. 允许的值是: `jvm`, `androidJvm`, `js`, `wasm`, `native`, `common`.                                                  |
| `artifactsTaskName` | 负责编译这个编译目标的结果 artifact 的编译任务的名称.                                                                                                  |
| `components`        | 用于设置 Gradle publication 的组件.                                                                                                      |
| `compilerOptions`   | 用于这个编译目标的 [编译器选项](#compiler-options). 这个声明会覆盖在 [顶层](multiplatform-dsl-reference.md#top-level-blocks) 的任何 `compilerOptions {}` 配置. |

### Web 编译目标 {id="web-targets"}

`js {}` 代码块描述 Kotlin/JS 编译目标的配置, `wasmJs {}` 代码块描述与 JavaScript 交互的 Kotlin/Wasm 编译目标的配置.
根据编译目标的执行环境不同, 它们可以包含以下两个代码块之一:

| **名称**                | **解释**           |
|-----------------------|------------------|
| [`browser`](#browser) | 浏览器编译目标的配置.      |
| [`nodejs`](#node-js)  | Node.js 编译目标的配置. |

详情请参见 [配置 Kotlin/JS 项目](js-project-setup.md).

还有另一个 `wasmWasi {}` 代码块描述支持 WASI 系统接口的 Kotlin/Wasm 编译目标的配置.
这种情况下, 只支持 [`nodejs`](#node-js) 执行环境:

```kotlin
kotlin {
    wasmWasi {
        nodejs()
        binaries.executable()
    }
}
```

所有的 Web 编译目标, `js`, `wasmJs`, 以及 `wasmWasi`, 还支持 `binaries.executable()` 调用.
这个调用明确的指示 Kotlin 编译器生成可执行文件.
更多详情请参见 Kotlin/JS 文档中的 [执行环境](js-project-setup.md#execution-environments) 部分.

#### 浏览器 {id="browser"}

`browser {}` 代码块包含以下配置代码块:

| **名称**         | **解释**                                         |
|----------------|------------------------------------------------|
| `testRuns`     | 测试运行任务的配置.                                     |
| `runTask`      | 项目运行的配置.                                       |
| `webpackTask`  | 使用 [Webpack](https://webpack.js.org/) 编译项目的配置. |
| `distribution` | 输出文件的路径.                                       |

```kotlin
kotlin {
    js().browser {
        webpackTask { /* ... */ }
        testRuns { /* ... */ }
        distribution {
            directory = File("$projectDir/customdir/")
        }
    }
}
```

#### Node.js {id="node-js"}

`nodejs {}` 代码块包含测试和运行任务的配置:

| **名称**     | **解释**     |
|------------|------------|
| `testRuns` | 测试任务的配置.   |
| `runTask`  | 项目运行任务的配置. |

```kotlin
kotlin {
    js().nodejs {
        runTask { /* ... */ }
        testRuns { /* ... */ }
    }
}
```

### 原生(Native)编译目标 {id="native-targets"}

对于原生(Native)编译目标, 可以使用以下代码块:

| **名称**      | **解释**                                |
|-------------|---------------------------------------|
| `binaries`  | 编译输出的 [二进制文件(binary)](#binaries) 的配置. |
| `cinterops` | [与 C 库文件交互](#cinterops) 的配置.          |

#### 二进制文件(Binary) {id="binaries"}

有以下几种二进制文件(Binary)任务:

| **名称**       | **解释**                  |
|--------------|-------------------------|
| `executable` | 正式产品的可执行文件.             |
| `test`       | 测试程序的可执行文件.             |
| `sharedLib`  | 共享的库文件(Shared library). |
| `staticLib`  | 静态库文件(Static library).  |
| `framework`  | Objective-C 框架.         |

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

| **名称**        | **解释**                                                                              |
|---------------|-------------------------------------------------------------------------------------|
| `compilation` | 用于构建二进制文件的编译任务. 默认情况下, `test` 二进制文件 由 `test` 编译任务构建, 其他 二进制文件由 `main` 编译任务构建.       |
| `linkerOpts`  | 构建二进制文件时, 传递给操作系统链接程序(linker)的选项.                                                   |
| `baseName`    | 对输出文件自定义它的基本名称(base name). 最终的完整文件名会在这个基本名称之上加上相应系统的前缀和后缀.                          |
| `entryPoint`  | 可执行二进制文件的入口点(entry point) 函数. 默认情况下, 是顶层包中的 `main()` 函数.                            |
| `outputFile`  | 用于访问输出文件.                                                                           |
| `linkTask`    | 用于访问链接任务.                                                                           |
| `runTask`     | 用于访问可执行二进制文件的运行任务. 对于 `linuxX64`, `macosX64`, 或 `mingwX64` 之外的编译目标, 这个属性的值为 `null`. |
| `isStatic`    | 用于 Objective-C 框架. 包含静态库(static library), 而不是动态库(dynamic library).                  |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

详情请参见 [构建原生二进制文件](multiplatform-build-native-binaries.md).

#### Cinterops {id="cinterops"}

`cinterops` 用于描述与原生库的交互.
要与一个库交互, 请添加一个 `cinterops` 代码块, 并定义它的参数, 如下:

| **名称**           | **解释**                |
|------------------|-----------------------|
| `definitionFile` | 描述原生 API 的 `.def` 文件. |
| `packageName`    | 生成 Kotlin API 时的包前缀.  |
| `compilerOpts`   | cinterop 工具传递给编译器的选项. |
| `includeDirs`    | 用于查找头文件的目录.           |
| `header`         | 绑定中需要包含的头文件.          |
| `headers`        | 绑定中需要包含的头文件列表.        |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // 这里请替换为你需要的编译目标.
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // 描述原生 API 的定义文件.
                // 默认路径是 src/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))

                // 生成的 Kotlin API 所在的包.
                packageName("org.sample")

                // cinterop 工具传递给编译器的参数.
                compilerOpts("-Ipath/to/headers")

                // 用于查找头文件的目录 (等同于 -I<path> 编译选项).
                includeDirs.allHeaders("path1", "path2")

                // includeDirs.allHeaders 的缩写方式.
                includeDirs("include/directory", "another/directory")

                // 绑定中需要包含的头文件.
                header("path/to/header.h")
                headers("path/to/header1.h", "path/to/header2.h")
            }

            val anotherInterop by cinterops.creating { /* ... */ }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64 { // 这里请替换为你需要的编译目标.
        compilations.main {
            cinterops {
                myInterop {
                    // 描述原生 API 的定义文件.
                    // 默认路径是 src/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")

                    // 生成的 Kotlin API 所在的包.
                    packageName 'org.sample'

                    // cinterop 工具传递给编译器的参数.
                    compilerOpts '-Ipath/to/headers'

                    // 用于查找头文件的目录 (等同于 -I<path> 编译选项).
                    includeDirs.allHeaders("path1", "path2")

                    // includeDirs.allHeaders 的缩写方式.
                    includeDirs("include/directory", "another/directory")

                    // 绑定中需要包含的头文件.
                    header("path/to/header.h")
                    headers("path/to/header1.h", "path/to/header2.h")
                }

                anotherInterop { /* ... */ }
            }
        }
    }
}
```

</tab>
</tabs>

关于 cinterop 的属性, 更多详情请参见 [定义文件](native-definition-file.md#properties).

### Android 编译目标 {id="android-targets"}

Kotlin Multiplatform plugin 提供了一个专有的函数,
帮助你针为 Android 编译目标设置 [构建变体(build variants)](https://developer.android.com/build/build-variants):

| **名称**                     | **解释**                                                                                            |
|----------------------------|---------------------------------------------------------------------------------------------------|
| `publishLibraryVariants()` | 指定用于发布的构建变体. 详情请参见 [发布 Android 库](multiplatform-publish-lib-setup.md#publish-an-android-library). |

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

详情请参见 [针对 Android 的编译](multiplatform-configure-compilations.md#compilation-for-android).

> `kotlin {}` 代码块之内的 `androidTarget` 配置, 不会替代任何 Android 项目的编译配置.
> 关于如何为 Android 项目编写编译脚本, 详情请参见 [Android 开发文档](https://developer.android.com/studio/build).
>
{style="note"}

## 源代码集(Source set) {id="source-sets"}

`sourceSets {}` 代码块描述项目的源代码集.
源代码集是指在某个编译任务中一起参与编译的 Kotlin 源代码文件, 相关的资源文件, 以及依赖项目.

跨平台项目的各个编译目标都包含 [预定义的源代码集](#predefined-source-sets);
开发者也可以根据需要创建 [自定义的源代码集](#custom-source-sets).

### 预定义的源代码集 {id="predefined-source-sets"}

创建会在跨平台项目时会自动设置预定义的源代码集.
可用的预定义源代码集如下:

| **名称**                                      | **解释**                                                                                                                  |
|---------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `commonMain`                                | 所有平台共用的代码和资源. 对所有的跨平台项目都可用. 项目的所有 main [编译任务](#compilations)都会使用这个源代码集.                                                 |
| `commonTest`                                | 所有平台共用的测试代码和资源. 对所有的跨平台项目都可用. 项目的所有 test 编译任务都会使用这个源代码集.                                                                |
| _&lt;targetName&gt;&lt;compilationName&gt;_ | 各个编译目标专有的源代码集. 这里的 _&lt;targetName&gt;_ 是预定义编译目标的名称, _&lt;compilationName&gt;_ 是这个编译目标的编译任务名称. 比如: `jsTest`, `jvmMain`. |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    // ...
    sourceSets {
        commonMain { /* ... */ }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    // ...
    sourceSets {
        commonMain { /* ... */ }
    }
}
```

</tab>
</tabs>

详情请参见 [源代码集](multiplatform-discover-project.md#source-sets).

### 自定义源代码集 {id="custom-source-sets"}

自定义源代码集由项目开发者手动创建.
要创建一个自定义源代码集, 需要在 `sourceSets` 之内, 使用自定义源代码集的名称, 添加一个代码块.
如果使用 Kotlin Gradle DSL, 需要将自定义源代码集标记为 `by creating`.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    // ...
    sourceSets {
        val myMain by creating { /* ... */ } // 创建一个新的, 名为 'MyMain' 的源代码集
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    // ...
    sourceSets {
        myMain { /* ... */ } // 创建或设置一个名称为 'myMain' 的源代码集
    }
}
```

</tab>
</tabs>

注意, 新创建的源代码集不会关联到其他源代码集. 如果要在项目的编译任务中使用这个源代码集,
[请将它关联到其他源代码集](multiplatform-hierarchy.md#manual-configuration).

### 源代码集的参数 {id="source-set-parameters"}

源代码集的配置保存在相应的 `sourceSets {}` 代码块之内. 一个源代码集包含以下参数:

| **名称**             | **解释**                                                        |
|--------------------|---------------------------------------------------------------|
| `kotlin.srcDir`    | 源代码集目录之内的 Kotlin 源代码文件位置.                                     |
| `resources.srcDir` | 源代码集目录之内的资源文件位置.                                              |
| `dependsOn`        | [关联到另一个源代码集](multiplatform-hierarchy.md#manual-configuration) |
| `dependencies`     | 源代码集的 [依赖项目](#dependencies).                                  |
| `languageSettings` | 用于共用源代码集的 [语言设置](#language-settings).                         |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    // ...
    sourceSets {
        commonMain {
            kotlin.srcDir("src")
            resources.srcDir("res")

            dependencies {
                /* ... */
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    // ...
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

</tab>
</tabs>

## 编译任务 {id="compilations"}

一个编译目标可以包含一个或多个编译任务, 比如, 用于正式产品的编译任务, 或用于测试代码的编译任务. 编译目标创建时会自动添加 [预定义的编译任务](#predefined-compilations).
你也可以另外创建 [自定义编译任务](#custom-compilations).

如果需要访问一个编译目标的所有编译任务, 或某个特定的编译任务, 请使用 `compilations` 对象集合.
通过 `compilations`, 你可以使用名称来访问一个编译任务.

详情请参见 [配置编译任务](multiplatform-configure-compilations.md).

### 预定义的编译任务 {id="predefined-compilations"}

对项目的每个编译目标, 会自动创建预定义的编译任务, Android 编译目标除外.
可用的预定义编译任务如下:

| **名称** | **解释**          |
|--------|-----------------|
| `main` | 用于正式产品源代码的编译任务. |
| `test` | 用于测试代码的编译任务.    |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main.output // 得到 main 编译任务的输出
        compilations.test.runtimeDependencyFiles // 得到 test 编译任务的运行时 classpath
    }
}
```

</tab>
</tabs>

### 自定义编译任务 {id="custom-compilations"}

除了预定义的编译任务之外, 你也可以创建自己的自定义编译任务.
具体做法是, 在新的编译任务和 `main` 编译任务之间,
设置 [`associateWith`](https://kotlinlang.org/docs/gradle-configure-project.html#associate-compiler-tasks) 关系.
如果使用 Kotlin Gradle DSL, 请将自定义编译任务标记为 `by creating`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations {
            val main by getting
            val integrationTest by creating {
                // 导入 main 及其 classpath, 作为依赖项, 并设置 internal 可见度
                associateWith(main)
                defaultSourceSet {
                    dependencies {
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }

                // 创建一个 test 任务, 用于运行这个编译任务产生的测试代码
                testRuns.create("integration") {
                    // 配置 test 任务
                    setExecutionSourceFrom(integrationTest)
                }
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.create('integrationTest') {
            def main = compilations.main
            // 导入 main 及其 classpath, 作为依赖项, 并设置 internal 可见度
            associateWith(main)
            defaultSourceSet {
                dependencies {
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }

            // 创建一个 test 任务, 用于运行这个编译任务产生的测试代码:
            testRuns.create('integration') {
                // 配置 test 任务
                setExecutionSourceFrom(compilations.integrationTest)
            }
        }
    }
}
```

</tab>
</tabs>

通过关联编译任务, 你将 main 编译任务的输出添加为依赖项, 并建立了编译任务之间的 `internal` 可见度.

详情请参见, 创建 [自定义编译任务](multiplatform-configure-compilations.md#create-a-custom-compilation).

### 编译任务的参数 {id="compilation-parameters"}

一个编译任务可以包含以下参数:

| **名称**                   | **解释**                                                                    |
|--------------------------|---------------------------------------------------------------------------|
| `defaultSourceSet`       | 编译任务的默认源代码集.                                                              |
| `kotlinSourceSets`       | 源代码集, 参与这个编译任务.                                                           |
| `allKotlinSourceSets`    | 源代码集, 参与这个编译任务, 以及通过 `dependsOn()` 关联的所有其他编译任务.                           |
| `compilerOptions`        | 应用于这个编译任务的编译器选项. 关于所有可用的选项, 请参见 [编译选项](gradle-compiler-options.md).       |
| `compileKotlinTask`      | 编译 Kotlin 源代码的 Gradle 任务.                                                 |
| `compileKotlinTaskName`  | `compileKotlinTask` 的名称.                                                  |
| `compileAllTaskName`     | 编译这个编译任务中所有源代码的Gradle 任务的名称.                                              |
| `output`                 | 编译任务的输出.                                                                  |
| `compileDependencyFiles` | 这个编译任务的编译时刻依赖项目文件(classpath). 对所有的 Kotlin/Native 编译任务, 这个参数自动包含标准库和平台依赖项. |
| `runtimeDependencyFiles` | 这个编译任务的运行时刻依赖项目文件(classpath).                                             |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    // 为 'main' 编译任务设置 Kotlin 编译器选项:
                    jvmTarget.set(JvmTarget.JVM_1_8)
                }
            }

            compileKotlinTask // 得到编译 Kotlin 源代码的 Gradle 任务 'compileKotlinJvm'
            output // 得到 main 编译任务的输出
        }

        compilations["test"].runtimeDependencyFiles // 得到 test 编译任务的运行时刻 classpath
    }

    // 对所有编译目标的所有编译任务的设置:
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main {
            compileTaskProvider.configure {
                compilerOptions {
                    // 为 'main' 编译任务设置 Kotlin 编译器选项:
                    jvmTarget = JvmTarget.JVM_1_8
                }
            }
        }

        compilations.main.compileKotlinTask // 得到编译 Kotlin 源代码的 Gradle 任务 'compileKotlinJvm'
        compilations.main.output // 得到 main 编译任务的输出
        compilations.test.runtimeDependencyFiles // 得到 test 编译任务的运行时刻 classpath
    }

    // 对所有编译目标的所有编译任务的设置:
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

## 编译器选项 {id="compiler-options"}

在你的项目中, 你可以在 3 个不同的层级配置编译器选项:

* **扩展级(Extension Level)**, 在 `kotlin {}` 代码块内配置.
* **编译目标级(Target Level)**, 在一个编译目标代码块内配置.
* **编译单元级(Compilation Unit Level)**, 通常在指定的编译任务内配置.

![Kotlin 编译器选项层级](compiler-options-levels.svg){width=700}

较高层级中的设置, 会用作较低层级中的默认值:

* 扩展级中设置的编译器选项, 会作为编译目标级选项的默认值,
  包括共用的源代码集, 例如 `commonMain`, `nativeMain`, 和 `commonTest`.
* 编译目标级中设置的编译器选项, 会作为编译单元 (task) 级选项的默认值,
  例如 `compileKotlinJvm` 和 `compileTestKotlinJvm` task.

较低层级中的配置, 会覆盖较高层级中的类似设置:

* Task 级编译器选项, 会覆盖编译目标级或扩展级中的类似设置.
* 编译目标级编译器选项, 会覆盖扩展级中的类似设置.

关于可用的编译器选项, 详情请参见 [所有编译器选项](gradle-compiler-options.md#all-compiler-options).

### 扩展级(Extension Level) {id="extension-level"}

要对你的项目中的所有编译目标配置编译器选项, 请使用顶级代码块中的 `compilerOptions {}` 代码块:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    // 配置所有编译目标的所有编译任务
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    // 配置所有编译目标的所有编译任务
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

### 编译目标级(Target Level) {id="target-level"}

要对你的项目中指定的编译目标配置编译器选项, 请使用编译目标代码块之内的 `compilerOptions {}` 代码块:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        // 配置 JVM 编译目标的所有编译任务
        compilerOptions {
            allWarningsAsErrors.set(true)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        // 配置 JVM 编译目标的所有编译任务
        compilerOptions {
            allWarningsAsErrors = true
        }
    }
}
```

</tab>
</tabs>

### 编译单元级(Compilation Unit Level) {id="compilation-unit-level"}

要对指定的 task 配置编译器选项, 请使用 task 之内的 `compilerOptions {}` 代码块:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

要对指定的编译任务配置编译器选项, 请使用这个编译任务的 task provider 之内的 `compilerOptions {}` 代码块:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 配置 'main' 编译任务:
                compilerOptions {
                    allWarningsAsErrors.set(true)
                }
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 配置 'main' 编译任务:
                compilerOptions {
                    allWarningsAsErrors = true
                }
            }
        }
    }
}
```

</tab>
</tabs>

### 从 `kotlinOptions {}` 迁移到 `compilerOptions {}` {id="migrate-from-kotlinoptions-to-compileroptions" collapsible="true"}

在 Kotlin 2.2.0 之前, 你可以使用 `kotlinOptions {}` 代码块配置编译器选项.
由于在 Kotlin 2.2.0 中 `kotlinOptions {}` 代码块已被废弃, 你需要在构建脚本中改为使用 `compilerOptions {}` 代码块.
详情请参见 [从 `kotlinOptions{}` 迁移到 `compilerOptions{}`](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions).

## 依赖项目 {id="dependencies"}

源代码集的 `dependencies {}` 代码块包含这个源代码集的依赖项目.

详情请参见 [配置依赖项](gradle-configure-project.md).

有 4 种类型的依赖项目:

| **名称**           | **解释**                       |
|------------------|------------------------------|
| `api`            | 当前模块的 API 中使用的依赖项目.          |
| `implementation` | 当前模块中使用的依赖项目, 但不向外暴露.        |
| `compileOnly`    | 只在当前模块的编译任务中使用的依赖项目.         |
| `runtimeOnly`    | 运行时刻的依赖项目, 但在任何模块的编译任务中都不可见. |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    // ...
    sourceSets {
        commonMain {
            dependencies {
                api("com.example:foo-metadata:1.0")
            }
        }
        jvmMain {
            dependencies {
                implementation("com.example:foo-jvm:1.0")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    // ...
    sourceSets {
        commonMain {
            dependencies {
                api 'com.example:foo-metadata:1.0'
            }
        }
        jvmMain {
            dependencies {
                implementation 'com.example:foo-jvm:1.0'
            }
        }
    }
}
```

</tab>
</tabs>

除此之外, 源代码集之间还可以相互依赖, 形成一种层级结构. 这种情况下, 应该使用 [`dependsOn()`](#source-set-parameters) 关系.

在编译脚本的最顶层 `dependencies {}` 代码块中, 也可以声明源代码集的依赖项目.
这种情况下, 依赖项目声明需要使用 `<sourceSetName><DependencyKind>` 格式, 比如, `commonMainApi`.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    "commonMainApi"("com.example:foo-common:1.0")
    "jvm6MainApi"("com.example:foo-jvm6:1.0")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    commonMainApi 'com.example:foo-common:1.0'
    jvm6MainApi 'com.example:foo-jvm6:1.0'
}
```

</tab>
</tabs>

## 语言设置 {id="language-settings"}

源代码集中的 `languageSettings {}` 代码块用来定义项目分析和编译的某些方面.
请只使用 `languageSettings {}` 代码块来配置专用于共用源代码集的设置.
对于所有其他情况, 请使用 `compilerOptions {}` 代码块,
在扩展级(Extension Level)或编译目标级(Target Level) [配置编译器选项](#compiler-options).

可选的语言设置如下:

| **名称**                  | **解释**                                                       |
|-------------------------|--------------------------------------------------------------|
| `languageVersion`       | 与某个 Kotlin 版本保持源代码级的兼容性.                                     |
| `apiVersion`            | 允许使用从指定的 Kotlin 版本的库才开始提供的 API 声明.                           |
| `enableLanguageFeature` | 启用指定的语言特性. 这个参数可选的值, 对应于那些目前还处于试验状态的语言特性, 或还没有正式公布的语言特性.     |
| `optIn`                 | 允许使用指定的 [明确要求使用者同意(Opt-in) 注解](opt-in-requirements.md).      |
| `progressiveMode`       | 启用 [渐进模式(progressive mode)](whatsnew13.md#progressive-mode). |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "%languageVersion%" // 可选的值: "1.8", "1.9", "2.0", "2.1"
            apiVersion = "%apiVersion%" // 可选的值: "1.8", "1.9", "2.0", "2.1"
            enableLanguageFeature("InlineClasses") // 这里请使用语言特性的名称
            optIn("kotlin.ExperimentalUnsignedTypes") // 这里请使用注解的完全限定名称
            progressiveMode = true // 默认值为 false
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '%languageVersion%' // 可选的值: '1.8', '1.9', '2.0', '2.1'
            apiVersion = '%apiVersion%' // 可选的值: '1.8', '1.9', '2.0', '2.1'
            enableLanguageFeature('InlineClasses') // 这里请使用语言特性的名称
            optIn('kotlin.ExperimentalUnsignedTypes') // 这里请使用注解的完全限定名称
            progressiveMode = true // 默认值为 false
        }
    }
}
```

</tab>
</tabs>
