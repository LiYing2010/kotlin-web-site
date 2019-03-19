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

默认情况下, 插件第一次运行时会下载 Kotlin/Native 编译器. 如果你已经手动下载过编译器, 你可以使用项目属性 `org.jetbrains.kotlin.native.home` 来指定编译器根路径 (比如, 在 `gradle.properties` 文件中指定).

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
org.jetbrains.kotlin.native.home=/home/user/kotlin-native-0.8
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

关于目标平台的名称, 编译插件使用与编译器相同的表达方式. test 组件默认使用与 main 组件相同的目标平台.

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

另外还创建了基本的编译环节任务, 比如 `assemble`, `build`, 以及 `clean`.

### 运行测试程序

编译插件会对 `test` 组件的所有目标平台编译产生测试用的可执行文件.
如果当前机器的平台也是 `test` 组件的目标平台之一, 那么还会创建测试的运行任务.
要运行测试, 你可以执行标准的编译环节 `check` 任务:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
./gradlew check
```

</div>

### 依赖项目

编译插件允许你使用传统的 Gradle 配置机制, 声明针对其他文件或项目的依赖.
编译插件支持 Kotlin 跨平台项目, 允许你声明 `expectedBy` 依赖项:

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

我们可以依赖于已经发布到 maven 仓库的 Kotlin/Native 库.
编译插件需要使用 Gradle 的 [metadata](https://github.com/gradle/gradle/blob/master/subprojects/docs/src/docs/design/gradle-module-metadata-specification.md) 功能, 因此这个功能需要启用.
请将下面的设置添加到你的 `settings.gradle` 文件中:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
enableFeaturePreview('GRADLE_METADATA')
```

</div>


然后, 你可以使用传统的 `group:artifact:version` 表达方式, 声明对 Kotlin/Native 库的依赖:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
dependencies {
    implementation 'org.sample.test:mylibrary:1.0'
    testImplementation 'org.sample.test:testlibrary:1.0'
}
```

</div>

依赖声明也可以定义在组件的代码段内:

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


### 使用 cinterop 工具

可以对组件声明一个 cinterop 依赖:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
components.main {
    dependencies {
        cinterop('mystdio') {
            // 会使用 src/main/c_interop/mystdio.def 作为 def 文件.

            // 设置编译器参数
            compilerOpts '-I/my/include/path'

            // 可以对不同的编译目标平台设置不同的编译参数
            target('linux') {
                compilerOpts '-I/linux/include/path'
            }
        }
    }
}
```

</div>

这样, 就会编译一个 interop 库, 然后将它添加为组件的依赖项.

对于使用 interop 的 Kotlin/Native 库, 我们经常会需要指定一些与平台相关的链接参数.
可以使用 `target` 代码段来实现:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
components.main {
    target('linux') {
        linkerOpts '-L/path/to/linux/libs'
    }
}
```

</div>

`allTargets` 代码段也可以这样使用.

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
components.main {
    // 对所有目标平台进行配置.
    allTargets {
        linkerOpts '-L/path/to/libs'
    }
}
```

</div>


### 发布

当 `maven-publish` 插件存在时, 对所有二进制文件的编译任务都会创建相应的发布任务.
这个插件使用 Gradle 的 metadata 来发布文件, 因此这个功能需要启用 (详情请参见 [依赖项目](#dependencies) 小节).

然后你就可以使用标准的 Gradle `publish` 任务来发布二进制文件了:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
./gradlew publish
```

</div>

目前只会发布 `EXECUTABLE` 和 `KLIBRARY` 类型的二进制文件.

发布插件允许你使用 `pom` 代码段, 自定义发布时生成的 pom 文件, 这个代码段可以在所有的组件内使用:

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

### 序列化插件

这个插件随 `kotlinx.serialization` 插件的一个定制版本一起发布.
要使用这个插件, 你不需要添加新的编译脚本依赖项, 只需要应用这个插件, 并添加对序列化库的依赖项:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
apply plugin: 'org.jetbrains.kotlin.platform.native'
apply plugin: 'kotlinx-serialization-native'

dependencies {
    implementation 'org.jetbrains.kotlinx:kotlinx-serialization-runtime-native'
}
```

</div>

详情请参见 [示例项目](https://github.com/ilmat192/kotlin-native-serialization-sample).

### DSL 示例

本节我们展示一个带详细注释的 DSL.
也请参考使用这个插件的示例工程, 比如, [Kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines),
[MPP http client](https://github.com/e5l/http-client-common/tree/master/samples/ios-test-application)

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.platform.native" version "1.3.0-rc-146"
}

sourceSets.main {
    // 插件使用的 Gradle 源代码目录在这里设置,
    // 因此这里可以调用 SourceDirectorySet 内所有可用的 DSL 方法.
    // 独立于平台的源代码.
    kotlin.srcDirs += 'src/main/customDir'

    // Linux 平台专有的源代码
    target('linux').srcDirs += 'src/main/linux'
}

components.main {

    // 设置编译的目标平台
    targets = ['linux_x64', 'macos_x64', 'mingw_x64']

    // 设置编译输出类型
    outputKinds = [EXECUTABLE, KLIBRARY, FRAMEWORK, DYNAMIC, STATIC]

    // 对可执行文件指定自定义的执行入口点
    entryPoint = "org.test.myMain"

    // 目标平台相关的选项
    target('linux_x64') {
        linkerOpts '-L/linux/lib/path'
    }

    // 与平台无关的选项
    allTargets {
        linkerOpts '-L/common/lib/path'
    }

    dependencies {

        // 依赖一个已发布的 Kotlin/Native 库.
        implementation 'org.test:mylib:1.0'

        // 依赖一个项目
        implementation project('library')

        // Cinterop 依赖
        cinterop('interop-name') {
            // 描述原生 API 的 def 文件.
            // 默认路径是 src/main/c_interop/<interop-name>.def
            defFile project.file("deffile.def")

            // 存放生产的 Kotlin API 的包
            packageName 'org.sample'

            // cinterop 工具传递给编译器和链接器的选项.
            compilerOpts 'Options for native stubs compilation'
            linkerOpts 'Options for native stubs'

            // 需要解析的其他头文件.
            headers project.files('header1.h', 'header2.h')

            // 头文件的查找路径.
            includeDirs {
                // Project.file 方法所能够接受的所有对象, 都可以用于这两个设置项.

                // 头文件的查找路径 (类似于编译器的 -I<path> 选项).
                allHeaders 'path1', 'path2'

                // def 文件的 'headerFilter' 设置项中列出的头文件的查找路径.
                // 类似于编译器的 -headerFilterAdditionalSearchPrefix 选项.
                headerFilterOnly 'path1', 'path2'
            }
            // includeDirs.allHeaders 设置项的一个缩写.
            includeDirs "include/directory" "another/directory"

            // 传递给 cinterop 工具的其他命令行选项.
            extraOpts '-verbose'

            // 对 Linux 平台的其他配置.
            target('linux') {
                compilerOpts 'Linux-specific options'
            }
        }
    }

    // 二进制文件发布时的其他 pom 设置.
    pom {
        withXml {
            def root = asNode()
            root.appendNode('name', 'My library')
            root.appendNode('description', 'A Kotlin/Native library')
        }
    }

    // 传递给编译器的其他选项.
    extraOpts '--time'
}
```

</div>
