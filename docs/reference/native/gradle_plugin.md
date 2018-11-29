---
type: doc
layout: reference
category: "Native"
title: "Gradle 插件"
---


# Kotlin/Native Gradle 插件

### 注意

本章介绍的是实验性的 Kotlin/Native Gradle 插件, 不是 IDE 中支持的 Kotlin 插件, 也不是跨平台项目插件.
关于跨平台项目 Gradle 插件, 请参见 [相关文档](building-mpp-with-gradle.html).

### 概述

_Kotlin/Native_ 项目的编译需要使用 Gradle 插件.
在 Gradle 插件库中可以找到 [这个插件](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.platform.native),
因此你可以通过 Gradle plugin DSL 来应用这个插件:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.platform.native" version "1.3.0-rc-146"
}
```

</div>

也可以从二进制文件仓库中得到这个插件. 除了正式发布版之外, 仓库中还包含了这个插件的旧版本, 以及开发中的版本, 这些非正式发布版通过 Gradle 插件库是无法得到的.
要从二进制文件仓库中得到这个插件, 请在你的编译脚本中添加以下代码:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
buildscript {
   repositories {
       mavenCentral()
       maven {
           url "https://dl.bintray.com/jetbrains/kotlin-native-dependencies"
       }
   }

   dependencies {
       classpath "org.jetbrains.kotlin:kotlin-native-gradle-plugin:1.3.0-rc-146"
   }
}

apply plugin: 'org.jetbrains.kotlin.platform.native'
```

</div>

默认情况下, 插件第一次运行时会下载 Kotlin/Native 编译器. 如果你已经手动下载过编译器, 你可以使用项目属性 `konan.home` 来指定编译器根路径 (比如, 在 `gradle.properties` 文件中指定).

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
konan.home=/home/user/kotlin-native-0.8
```

</div>

这种情况下, 插件不会再去下载编译器.

### 源代码管理

`kotlin.platform.native` 插件的源代码管理方式与其他 Kotlin 插件是一致的, 都是按源代码集(source set)为单位进行管理.
一个源代码集就是一组 Kotlin/Native 源代码文件, 其中包含共通代码, 也包含平台相关代码.
插件提供一个顶层的编译脚本代码段 `sourceSets`, 可以用来配置源代码集.
插件还会插件默认的源代码集 `main` 和 `test` (分别用于生产代码和测试代码).

生产代码默认放在 `src/main/kotlin` 目录下, 测试代码默认放在 `src/test/kotlin` 目录下.

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
sourceSets {
    // 添加与编译目标平台无关的代码.
    main.kotlin.srcDirs += 'src/main/mySources'

    // 添加 Linux 平台独有的代码. 这些代码只会在 Linux 目标平台中编译.
    main.target('linux_x64').srcDirs += 'src/main/linux'
}
```

</div>

### 目标平台与输出类型

插件默认会为 main 和 test 源代码集创建组件.
要访问这些组件, 你使用通过 Gradle 的 `components` 容器, 也可以使用对应的源代码集的 `component` 属性:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
// main 组件.
components.main
sourceSets.main.component

// test 组件.
components.test
sourceSets.test.component
```

</div>

通过组件你可以指定:

* 目标平台 (比如 Linux/x64 或 iOS/arm64 等等)
* 输出类型 (比如 可执行文件, 库, 框架 等等)
* 依赖项目 (包括 interop 依赖项目)

可以通过对应的组件的属性来设置它的目标平台:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
components.main {
    // 针对 64-bit MacOS, Linux 和 Windows 平台编译这个组件.
    targets = ['macos_x64', 'linux_x64', 'mingw_x64']
}
```

</div>

插件使用与编译器相同的注解. test 组件默认使用与组件相同的目标平台.

输出类型也可以通过专门的属性来执行:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
components.main {
    // 将这个组件编译为可执行文件, 以及 Kotlin/Native 库.
    outputKinds = [EXECUTABLE, KLIBRARY]
}
```

</div>

这里用到的所有的常数, 都可以用在组件的配置脚本代码段中.
编译插件支持输出以下类型的二进制文件:

* `EXECUTABLE` - 可执行文件;
* `KLIBRARY` - Kotlin/Native 库 (*.klib);
* `FRAMEWORK` - Objective-C 框架;
* `DYNAMIC` - 原生的共享库;
* `STATIC` - 原生的静态库.

每个原生二进制文件又被编译为两个版本 (编译类型): `debug` 版(可调试, 无代码优化) 和 `release` 版(不可调试, 有代码优化).
注意, Kotlin/Native 库只有 `debug` 版, 因为只在编译最终二进制文件(可执行文件, 静态库, 等等)时才会进行代码优化, 并且会对最终二进制文件所需要用到的全部库文件进行代码优化.

### 编译任务

编译插件会对所有目标平台, 输出类型, 以及编译类型的组合, 分别创建编译任务. 这些编译任务的命名规约如下:

    compile<ComponentName><BuildType><OutputKind><Target>KotlinNative

比如 `compileDebugKlibraryMacos_x64KotlinNative`, `compileTestDebugKotlinNative`.

编译任务名称包含以下组成部分 (其中某些部分可能为空):

* `<ComponentName>` - 组件名称. 对 main 组件来说, 组件名称为空.
* `<BuildType>` - `Debug` 或 `Release`.
* `<OutputKind>` - 输出类型名称, 比如 `Executabe` 或 `Dynamic`. 如果组件只有一种输出类型, 则输出类型名称为空.
* `<Target>` - 组件的编译目标平台名称, 比如 `Macos_x64` 或 `Wasm32`. 如果组件只对一种目标平台编译, 则目标平台名称为空.

编译插件还会创建一些复合任务, 可以用来对某个编译类型编译所有相关的二进制文件 (比如, `assembleAllDebug`),
或者对某个目标平台编译所有的二进制文件 (比如, `assembleAllWasm32`).

另外还创建了基本的编译周期任务, 比如 `assemble`, `build`, 以及 `clean`.

### 运行测试程序

The plugin builds a test executable for all the targets specified for the `test` component. If the current host platform is
included in this list the test running tasks are also created. To run tests, execute the standard lifecycle `check` task:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
./gradlew check
```

</div>

### Dependencies

The plugin allows you to declare dependencies on files and other projects using traditional Gradle's mechanism of
configurations. The plugin supports Kotlin multiplatform projects allowing you to declare the `expectedBy` dependencies

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
dependencies {
    implementation files('path/to/file/dependencies')
    implementation project('library')
    testImplementation project('testLibrary')
    expectedBy project('common')
}
```

</div>

It's possible to depend on a Kotlin/Native library published earlier in a maven repo. The plugin relies on Gradle's
[metadata](https://github.com/gradle/gradle/blob/master/subprojects/docs/src/docs/design/gradle-module-metadata-specification.md)
support so the corresponding feature must be enabled. Add the following line in your `settings.gradle`:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
enableFeaturePreview('GRADLE_METADATA')
```

</div>


Now you can declare a dependency on a Kotlin/Native library in the traditional `group:artifact:version` notation:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
dependencies {
    implementation 'org.sample.test:mylibrary:1.0'
    testImplementation 'org.sample.test:testlibrary:1.0'
}
```

</div>

Dependency declaraion is also possible in the component block:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
components.main {
    dependencies {
        implementation 'org.sample.test:mylibrary:1.0'
    }
}

components.test {
    dependencies {
        implementation 'org.sample.test:testlibrary:1.0'
    }
}
```

</div>


### Using cinterop

It's possible to declare a cinterop dependency for a component:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
components.main {
    dependencies {
        cinterop('mystdio') {
            // src/main/c_interop/mystdio.def is used as a def file.

            // Set up compiler options
            compilerOpts '-I/my/include/path'

            // It's possible to set up different options for different targets
            target('linux') {
                compilerOpts '-I/linux/include/path'
            }
        }
    }
}
```

</div>

Here an interop library will be built and added in the component dependencies.

Often it's necessary to specify target-specific linker options for a Kotlin/Native binary using an interop. It can be
done using the `target` script block:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
components.main {
    target('linux') {
        linkerOpts '-L/path/to/linux/libs'
    }
}
```

</div>

Also the `allTargets` block is available.

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
components.main {
    // Configure all targets.
    allTargets {
        linkerOpts '-L/path/to/libs'
    }
}
```

</div>


### Publishing

In the presence of `maven-publish` plugin the publications for all the binaries built are created. The plugin uses Gradle
metadata to publish the artifacts so this feature must be enabled (see the [dependencies](#dependencies) section).

Now you can publish the artifacts with the standard Gradle `publish` task:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
./gradlew publish
```

</div>

Only `EXECUTABLE` and `KLIBRARY` binaries are published currently.

The plugin allows you to customize the pom generated for the publication with the `pom` code block available for every component:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
components.main {
    pom {
        withXml {
            def root = asNode()
            root.appendNode('name', 'My library')
            root.appendNode('description', 'A Kotlin/Native library')
        }
    }
}
```

</div>

### Serialization plugin

The plugin is shipped with a customized version of the `kotlinx.serialization` plugin. To use it you don't have to
add new buildscript dependencies, just apply the plugins and add a dependency on the serialization library:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
apply plugin: 'org.jetbrains.kotlin.platform.native'
apply plugin: 'kotlinx-serialization-native'

dependencies {
    implementation 'org.jetbrains.kotlinx:kotlinx-serialization-runtime-native'
}
```

</div>

The the [example project](https://github.com/ilmat192/kotlin-native-serialization-sample) for details.

### DSL example

In this section a commented DSL is shown.
See also the example projects that use this plugin, e.g.
[Kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines),
[MPP http client](https://github.com/e5l/http-client-common/tree/master/samples/ios-test-application)

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.platform.native" version "1.3.0-rc-146"
}

sourceSets.main {
    // Plugin uses Gradle's source directory sets here,
    // so all the DSL methods available in SourceDirectorySet can be called here.
    // Platform independent sources.
    kotlin.srcDirs += 'src/main/customDir'

    // Linux-specific sources
    target('linux').srcDirs += 'src/main/linux'
}

components.main {

    // Set up targets
    targets = ['linux_x64', 'macos_x64', 'mingw_x64']

    // Set up output kinds
    outputKinds = [EXECUTABLE, KLIBRARY, FRAMEWORK, DYNAMIC, STATIC]

    // Specify custom entry point for executables
    entryPoint = "org.test.myMain"

    // Target-specific options
    target('linux_x64') {
        linkerOpts '-L/linux/lib/path'
    }

    // Targets independent options
    allTargets {
        linkerOpts '-L/common/lib/path'
    }

    dependencies {

        // Dependency on a published Kotlin/Native library.
        implementation 'org.test:mylib:1.0'

        // Dependency on a project
        implementation project('library')

        // Cinterop dependency
        cinterop('interop-name') {
            // Def-file describing the native API.
            // The default path is src/main/c_interop/<interop-name>.def
            defFile project.file("deffile.def")

            // Package to place the Kotlin API generated.
            packageName 'org.sample'

            // Options to be passed to compiler and linker by cinterop tool.
            compilerOpts 'Options for native stubs compilation'
            linkerOpts 'Options for native stubs'

            // Additional headers to parse.
            headers project.files('header1.h', 'header2.h')

            // Directories to look for headers.
            includeDirs {
                // All objects accepted by the Project.file method may be used with both options.

                // Directories for header search (an analogue of the -I<path> compiler option).
                allHeaders 'path1', 'path2'

                // Additional directories to search headers listed in the 'headerFilter' def-file option.
                // -headerFilterAdditionalSearchPrefix command line option analogue.
                headerFilterOnly 'path1', 'path2'
            }
            // A shortcut for includeDirs.allHeaders.
            includeDirs "include/directory" "another/directory"

            // Pass additional command line options to the cinterop tool.
            extraOpts '-shims', 'true'

            // Additional configuration for Linux.
            target('linux') {
                compilerOpts 'Linux-specific options'
            }
        }
    }

    // Additional pom settings for publication.
    pom {
        withXml {
            def root = asNode()
            root.appendNode('name', 'My library')
            root.appendNode('description', 'A Kotlin/Native library')
        }
    }

    // Additional options passed to the compiler.
    extraOpts '--time'
}
```

</div>
