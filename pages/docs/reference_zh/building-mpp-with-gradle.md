---
type: doc
layout: reference
title: "使用 Gradle 编译跨平台项目"
---

# 使用 Gradle 编译跨平台项目

> 跨平台项目是 Kotlin 1.2 和 1.3 版中的实验性特性.
  本文档描述的所有语言特性和工具特性, 在未来的 Kotlin 版本中都有可能发生变更.
{:.note}

本文档介绍 [Kotlin 跨平台项目](multiplatform.html) 的结构,
并解释如何使用 Gradle 来配置和编译跨平台项目.

## 目录

* [项目结构](#project-structure)
* [设置跨平台项目](#setting-up-a-multiplatform-project)
* [Gradle Plugin](#gradle-plugin)
* [设置编译目标](#setting-up-targets)
    * [支持的平台](#supported-platforms)
    * [配置编译任务](#configuring-compilations)
* [配置源代码集](#configuring-source-sets)
    * [源代码集之间的关联](#connecting-source-sets)
    * [添加依赖项目](#adding-dependencies)
    * [语言设置](#language-settings)
* [默认的项目结构](#default-project-layout)
* [运行测试程序](#running-tests)
* [发布跨平台的库](#publishing-a-multiplatform-library)
    * [元数据发布(metadata publishing)](#metadata-publishing)
    * [对编译目标消除歧义](#disambiguating-targets)
* [JVM 编译目标中的 Java 支持](#java-support-in-jvm-targets)
* [Android 支持](#android-support)
    * [发布 Android 库](#publishing-android-libraries)
* [使用 Kotlin/Native 编译目标](#using-kotlinnative-targets)
    * [编译目标的快捷方式](#target-shortcuts)
    * [编译最终的原生二进制文件](#building-final-native-binaries)

## 项目结构

Kotlin 跨平台项目由以下几个编译模块组成:

* [编译目标](#setting-up-targets) 是整个编译的一部分,
它负责在某个特定的目标平台上编译, 测试, 并打包整个软件.
因此, 一个跨平台项目通常会包括多个编译目标.

* 对每个编译目标的编译会包括对 Kotlin 源代码进行一次或多次编译.
也就是说, 一个编译目标可以包含一个或多个 [编译任务](#configuring-compilations).
比如, 一个针对产品源代码的编译任务, 以及一个针对测试源代码的编译任务.

* Kotlin 源代码通过 [源代码集](#configuring-source-sets) 进行组织.
除 Kotlin 源代码文件和资源文件外, 每个源代码集还包含它自己的依赖项.
多个源代码集之间相互存在 *"依赖(depends on)"* 关系, 构成一个层级结构.
源代码集本身是平台无关的, 但如果它只针对单一的平台进行编译, 那么其中可以包含平台相关的代码和依赖项.

每个编译任务都有自己的默认源代码集, 也就是这个编译任务所使用的源代码和依赖项.
默认源代码集还可以通过"依赖" 关系, 将其他源代码集引入到编译任务中.

下图是一个针对 JVM 和 JS 平台的项目结构:

![项目结构]({{ url_for('asset', path='images/reference/building-mpp-with-gradle/mpp-structure-default-jvm-js.png') }})

这个项目中存在两个编译目标, `jvm` 和 `js`, 每个编译目标都会编译产品源代码和测试源代码, 其中有部分源代码是共用的.
为了实现这样的结果, 我们只需要创建这两个编译目标即可, 并不需要额外地配置编译任务和源代码集,
编译任务和源代码集都是针对各个编译目标 [默认创建](#default-project-layout) 的.

在上面的示例中, JVM 编译目标的产品源代码集由它的 `main` 编译任务来编译,
因此包含了`jvmMain` 和 `commonMain` 源代码集中的源代码和依赖项 (因为这两个源代码集之间存在 *依赖* 关系):

![源代码集与编译]({{ url_for('asset', path='images/reference/building-mpp-with-gradle/mpp-one-compilation.png') }})

在这个例子中, `commonMain` 源代码集的共用源代码定义了一些 API,
而 `jvmMain` 源代码集则为这些 API 提供了 [平台相关的实现](platform-specific-declarations.html).
这是一种灵活的方式, 我们可以在不同的平台之间共用一部分代码, 并在需要的时候为不同的平台提供各自的实现代码.

在后面的章节中, 会更详细地介绍这些概念, 并解释如何使用 DSL 来对它们进行配置.

## 设置跨平台项目

你可以在 IDE 中创建一个跨平台项目,
方法是在 New Project 对话框中选择 "Kotlin" 中的某个跨平台项目模板.

比如, 如果你选择 "Kotlin (Multiplatform Library)", 会创建一个 Library 项目,
其中包含 3 个 [编译目标](#setting-up-targets),
一个是 JVM, 一个是 JS, 另一个是你当前正在使用的本地平台.
这些设置保存在 `build.gradle` 脚本中, 如下:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}

repositories {
    mavenCentral()
}

kotlin {
    jvm() // 创建 JVM 编译平台, 使用默认名称 'jvm'
    js()  // 创建 JS 编译平台, 使用默认名称 'js'
    mingwX64("mingw") // 创建 Windows (MinGW X64) 编译平台, 名称指定为 'mingw'

    sourceSets { /* ... */ }
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

repositories {
    mavenCentral()
}

kotlin {
    jvm() // 创建 JVM 编译平台, 使用默认名称 'jvm'
    js()  // 创建 JS 编译平台, 使用默认名称 'js'
    mingwX64("mingw") // 创建 Windows (MinGW X64) 编译平台, 名称指定为 'mingw'

    sourceSets { /* ... */ }
}
```

</div>
</div>

这 3 个编译目标是使用预定义函数 `jvm()`, `js()`, 和 `mingwX64()` 来创建的,
这些函数都提供了 [默认配置](#default-project-layout), 对于每个 [支持的平台](#supported-platforms) 都提供了这种预定义的默认配置.

[源代码集](#configuring-source-sets) 以及它们的 [依赖项目](#adding-dependencies) 配置如下:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins { /* ... */ }

kotlin {
    /* 编译目标的相关配置, 略 */

    sourceSets {
        commonMain {
            dependencies {
                implementation kotlin('stdlib-common')
            }
        }
        commonTest {
            dependencies {
                implementation kotlin('test-common')
                implementation kotlin('test-annotations-common')
            }
        }

        // 针对 JVM 平台相关代码的默认源代码集, 以及依赖项.
        // 这里也可以使用 jvmMain { ... }:
        jvm().compilations.main.defaultSourceSet {
            dependencies {
                implementation kotlin('stdlib-jdk8')
            }
        }
        // JVM 平台相关的测试代码, 以及依赖项:
        jvm().compilations.test.defaultSourceSet {
            dependencies {
                implementation kotlin('test-junit')
            }
        }

        js().compilations.main.defaultSourceSet  { /* ... */ }
        js().compilations.test.defaultSourceSet { /* ... */ }

        mingwX64('mingw').compilations.main.defaultSourceSet { /* ... */ }
        mingwX64('mingw').compilations.test.defaultSourceSet { /* ... */ }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins { /* ... */ }

kotlin {
    /* 编译目标的相关配置, 略 */

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(kotlin("stdlib-common"))
            }
        }
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test-common"))
                implementation(kotlin("test-annotations-common"))
            }
        }

        // 针对 JVM 平台相关代码的默认源代码集, 以及依赖项:
        jvm().compilations["main"].defaultSourceSet {
            dependencies {
                implementation(kotlin("stdlib-jdk8"))
            }
        }
        // JVM 平台相关的测试代码, 以及依赖项:
        jvm().compilations["test"].defaultSourceSet {
            dependencies {
                implementation(kotlin("test-junit"))
            }
        }

        js().compilations["main"].defaultSourceSet  { /* ... */ }
        js().compilations["test"].defaultSourceSet { /* ... */ }

        mingwX64("mingw").compilations["main"].defaultSourceSet { /* ... */ }
        mingwX64("mingw").compilations["test"].defaultSourceSet { /* ... */ }
    }
}
```

</div>
</div>

在上面配置的编译目标中, 对产品源代码和测试源代码都有 [默认的源代码集名称](#default-project-layout).
对于所有的编译目标, 源代码集 `commonMain` 和 `commonTest` 分别包含在产品编译和测试编译之中.
注意, 共通源代码集 `commonMain` 和 `commonTest` 只依赖共通库, 特定平台相关的库由这个平台相关的源代码依赖.

## Gradle Plugin

Kotlin 跨平台项目需要使用 Gradle 4.7 以上版本, 不支持旧的 Gradle 版本.

如果想要从 Gradle 项目从头开始设置一个跨平台项目,
首先, 请在你的项目中使用 `kotlin-multiplatform` plugin,
方法是在 `build.gradle` 文件的最头部中添加以下代码:

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

这样会在最顶层添加一个 `kotlin` 扩展. 然后你可以在编译脚本中引用它, 以便:

* 对跨平台项目 [设置编译目标](#setting-up-targets) (因为默认不会创建编译目标);
* [设置源代码集](#configuring-source-sets) 以及以及它们的 [依赖项目](#adding-dependencies);

## 设置编译目标

编译目标(target) 是指针对某个特定的 [支持的平台](#supported-platforms) 的一系列编译功能,
包括源代码编译, 测试, 打包.

各个编译目标可以共用一部分源代码, 也可以包含平台相关的代码.

由于平台是不同的, 因此编译目标不过不同的方式编译, 而且各自带有平台专有的一些设定信息.
Gradle plugin 对支持的平台带有很多预定义的设置.

要创建一个编译目标, 我们只需要使用某个预定义的函数, 函数名称对应于编译的目标平台,
另外还可以通过参数指定编译目标的名称, 并指定配置代码:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

``` groovy
kotlin {
    jvm() // 创建一个 JVM 编译目标, 使用默认名称 'jvm'
    js("nodeJs") // 创建一个 JS 编译目标, 指定编译名称为 'nodeJs'

    linuxX64("linux") {
        /* 可以在这里对 'linux' 编译目标指定更多的设定项目 */
    }
}
```
</div>

如果编译目标已经存在, 那么函数直接返回已存在的编译目标. 因此可以利用这个特性来对已经存在的编译目标进行配置:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    /* ... */

    // 设置 'jvm6' 编译目标的属性:
    jvm("jvm6").attributes { /* ... */ }
}
```

</div>

注意, 调用这些函数时, 目标平台和编译目标的名称都必须指定正确:
如果使用 `jvm('jvm6')` 创建了一个编译目标, 那么调用 `jvm()` 会创建另一个编译目标 (使用默认名称 `jvm`).
如果使用目标平台A对应的函数创建了一个编译目标, 然后再使用另一个目标平台B对应的函数来创建相同名称的编译目标, 那么会发生错误.

使用默认配置创建的编译目标会被加入到 `kotlin.targets` 集合中,
可以使用名称在这个集合内查找编译目标, 也可以使用这个集合对所有的编译目标进行配置:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm()
    js("nodeJs")

    println(targets.names) // 输出结果为: [jvm, metadata, nodeJs]

    // 对所有的编译目标进行配置, 包括将来添加的编译目标:
    targets.all {
        compilations["main"].defaultSourceSet { /* ... */ }
    }
}
```

</div>

要使用多个预定义配置动态地创建编译目标, 或者访问编译目标, 可以使用 `targetFromPreset` 函数,
它接受的参数是一个预定义配置(包含在 `kotlin.presets` 集合中),
另外还可以接受可选的参数, 编译目标名称, 以及配置代码段.

比如, 要对 Kotlin/Native 支持的所有目标平台(参见后文)分别创建编译目标, 可以使用这样的代码:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    presets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTargetPreset).each {
        targetFromPreset(it) {
            /* 对创建的某个编译目标进行配置 */
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTargetPreset

/* ... */

kotlin {
    presets.withType<KotlinNativeTargetPreset>().forEach {
        targetFromPreset(it) { 
            /* 对创建的每个编译目标进行配置 */
        }
    }
}
```

</div>
</div>


### 支持的平台

Kotlin 支持以下目标平台, 针对每个目标平台, 都分别提供了预定义配置,
可以通过上面的例子那样使用:

* `jvm` 用于 Kotlin/JVM 平台;
* `js` 用于 Kotlin/JS 平台;
* `android` 用于 Android 应用程序和库.
   注意, 在创建编译目标之前, 需要应用 Android Gradle plugin;

*  Kotlin/Native 平台的预定义编译目标 (详情请参见后面的 [注意](#using-kotlinnative-targets)):

    * `androidNativeArm32` 和 `androidNativeArm64` 用于 Android NDK 平台;
    * `iosArm32`, `iosArm64`, `iosX64` 用于 iOS 平台;
    * `watchosArm32`, `watchosArm64`, `watchosX86` 用于 watchOS 平台;
    * `tvosArm64`, `tvosX64` 用于 tvOS 平台;
    * `linuxArm64`, `linuxArm32Hfp`, `linuxMips32`, `linuxMipsel32`, `linuxX64` 用于 Linux 平台;
    * `macosX64` 用于 MacOS 平台;
    * `mingwX64` 和 `mingwX86` 用于 Windows 平台;
    * `wasm32` 用于 WebAssembly 平台.

    注意, Kotlin/Native 的一部分编译目标需要针对一个 [适当的目标机器](#using-kotlinnative-targets) 来编译.

某些目标平台可能需要额外的配置.
比如 Android 和 iOS 平台, 请参见教程 [跨平台项目: iOS 与 Android](/docs/tutorials/native/mpp-ios-android.html).

### 配置编译任务

编译目标的编译需要进行一次或多次 Kotlin 编译任务.
每次 Kotlin 编译任务可能是为了不同的目的(比如, 编译产品代码, 或测试代码), 也可能处理不同的 [源代码集](#configuring-source-sets).
可以在 DSL 内访问编译目标中的各个 Kotlin 编译任务,
比如, 可以得到编译任务, 配置 [Kotlin 编译器选项](using-gradle.html#compiler-options), 得到依赖项目文件名, 以及编译输出路径:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm {
        compilations.main.kotlinOptions {
            // 对 'main' 编译任务设置 Kotlin 编译器选项:
            jvmTarget = "1.8"
        }

        compilations.main.compileKotlinTask // 得到 Kotlin 编译任务 'compileKotlinJvm'
        compilations.main.output // 得到 main 编译任务的输出路径
        compilations.test.runtimeDependencyFiles // 得到 test 编译任务的运行时 classpath
    }

    // 对所有编译目标的所有编译任务进行配置:
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
                // 对 'main' 编译任务设置 Kotlin 编译器选项:
                jvmTarget = "1.8"
            }

            compileKotlinTask // 得到 Kotlin 编译任务 'compileKotlinJvm'
            output // 得到 main 编译任务的输出路径
        }

        compilations["test"].runtimeDependencyFiles // 得到 test 编译任务的运行时 classpath
    }

    // 对所有编译目标的所有编译任务进行配置:
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

每个编译任务都存在一个默认 [源代码集](#configuring-source-sets), 用来保存这个编译任务独有的源代码文件和依赖项.
对于编译目标 `bar` 的编译任务 `foo`, 默认源代码集的名称为 `barFoo`.
也可以通过编译任务的 `defaultSourceSet` 属性访问默认源代码集:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm() // 创建 JVM 编译目标, 使用默认名称 'jvm'

    sourceSets {
        // 'jvm' 编译目标的 'main` 编译任务的默认源代码集:
        jvmMain {
            /* ... */
        }
    }

    // 或者, 也可以使用编译目标的编译任务来访问对应的默认源代码集:
    jvm().compilations.main.defaultSourceSet {
        /* ... */
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    jvm() // 创建 JVM 编译目标, 使用默认名称 'jvm'

    sourceSets {
        // 'jvm' 编译目标的 'main` 编译任务的默认源代码集:
        val jvmMain by getting {
            /* ... */
        }
    }

    // 或者, 也可以使用编译目标的编译任务来访问对应的默认源代码集:
    jvm().compilations["main"].defaultSourceSet {
        /* ... */
    }
}
```

</div>
</div>

要得到一个编译任务的所有源代码集, 包括那些通过依赖关系添加的源代码集,
我们可以使用 `allKotlinSourceSets` 属性.

对于某些特殊的场景, 可能需要创建自定义的编译任务.
可以使用编译目标的 `compilations` 集合来实现.
注意, 对于所有的自定义编译任务, 依赖项需要手动设置, 而且自定义编译任务的输出文件的使用要由编译脚本的编写者自行实现.
比如, 假定我们要为 `jvm()` 编译目标的集成测试(Integration Test)创建自定义编译任务:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm() {
        compilations.create('integrationTest') {
            defaultSourceSet {
                dependencies {
                    def main = compilations.main
                    // 使用 main 编译任务的编译时 classpath , 以及它的编译输出:
                    implementation(main.compileDependencyFiles + main.output.classesDirs)
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }

            // 创建测试任务, 运行这个编译任务编译产生的测试类:
            tasks.create('jvmIntegrationTest', Test) {
                // 运行测试程序, 使用的 classpath 包括: 编译期依赖项(含 'main'),
                // 运行期依赖项, 以及当前编译任务的输出:
                classpath = compileDependencyFiles + runtimeDependencyFiles + output.allOutputs

                // 只在当前编译任务的输出中寻找需要运行的测试类:
                testClassesDirs = output.classesDirs
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
            val main by getting

            val integrationTest by compilations.creating {
                defaultSourceSet {
                    dependencies {
                        // 使用 main 编译任务的编译时 classpath , 以及它的编译输出:
                        implementation(main.compileDependencyFiles + main.output.classesDirs)
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }

                // 创建测试任务, 运行这个编译任务编译产生的测试类:
                tasks.create<Test>("integrationTest") {
                    // 运行测试程序, 使用的 classpath 包括: 编译期依赖项(含 'main'),
                    // 运行期依赖项, 以及当前编译任务的输出:
                    classpath = compileDependencyFiles + runtimeDependencyFiles + output.allOutputs

                    // 只在当前编译任务的输出中寻找需要运行的测试类:
                    testClassesDirs = output.classesDirs
                }
            }
        }
    }
}
```

</div>
</div>

还需要注意, 默认情况下, 自定义编译任务的默认源代码集不会依赖于 `commonMain` 和 `commonTest`.

## 配置源代码集

Kotlin 源代码集是指一组 Kotlin 源代码, 相关的资源文件, 依赖项目, 以及语言设定,
在一个或多个 [编译目标](#setting-up-targets) 的 Kotlin 编译中, 将会使用到这些源代码集.

源代码集并不一定是平台相关的, 也并不一定是多平台共用代码; 源代码集能够包含什么样的内容由它的使用方法来决定:
源代码集如果被加入到多个编译任务, 那么它只能使用这些编译任务共通支持的语言特性和依赖项,
而只被单个编译目标使用的源代码集, 则可以使用平台相关的依赖项,
其中的源代码也可以使用编译目标对应的目标平台上独有的语言特性.

有些源代码集是默认创建并配置好的: `commonMain`, `commonTest`, 以及各个编译任务默认的源代码集.
详情请参见 [默认的项目布局](#default-project-layout).

源代码集在 `kotlin { ... }` 扩展的 `sourceSets { ... }` 代码段中进行设置:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    sourceSets {
        foo { /* ... */ } // 使用名称 'foo' 创建或配置一个源代码集
        bar { /* ... */ }
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
        val foo by creating { /* ... */ } // 使用名称 'foo' 创建一个新的源代码集
        val bar by getting { /* ... */ } // 配置一个已存在的源代码集 'bar'
    }
}
```

</div>
</div>

> 注意: 创建一个源代码集不会将它关联到任何的编译目标. 有些源代码集 [预定义的](#default-project-layout), 因此默认会编译它.
  但是, 自定义的源代码集合需要明确地指定它属于哪些编译任务.
  详情请参见: [源代码集之间的关联](#connecting-source-sets).
{:.note}

源代码集的名称是大小写敏感的. 使用名称来引用一个默认的源代码集时, 一定要注意源代码集的名称前缀要与编译目标的名称一致,
比如, 编译目标 `iosX64` 的主源代码集名称是 `iosX64Main`.

源代码集本身是与平台无关的, 但是如果它只编译到单个平台, 我们可以认为它是与这个平台相关的.
因此, 源代码集可以包括各个平台之间共用的共通代码, 也可以包含平台相关的代码.

每个源代码集都有一个默认的源代码目录, 用于存放 Kotlin 源代码文件: `src/<source set name>/kotlin`.
要向源代码集添加 Kotlin 源代码目录和资源,
请使用它的 `kotlin`, `resources` `SourceDirectorySet` 属性:

默认情况下, 源代码集的文件保存在以下目录中:

* 源代码文件: `src/<source set name>/kotlin`
* 资源文件: `src/<source set name>/resources`

你需要手工创建这些目录.

如果要向一个源代码集添加自定义的 Kotlin 源代码目录和资源目录,
请使用源代码集的 `kotlin` 和 `resources` 的 `SourceDirectorySet`:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    sourceSets {
        commonMain {
            kotlin.srcDir('src')
            resources.srcDir('res')
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
        }
    }
}
```

</div>
</div>

### 源代码集之间的关联

Kotlin 源代码集可以通过 *'依赖'* 关系发生连接,
如果源代码集 `foo` 依赖于另一个源代码集 `bar`, 那么:

* 如果针对某个编译目标需要编译 `foo`, 那么 `bar` 也会被编译, 并且输出为同样的编译目标形式,
比如 JVM 平台的 class 文件, 或者 JS 代码;

* `foo` 中的源代码可以 '看见' `bar` 中的声明, 包括 `internal` 声明,
  也可以 '看见' `bar` 中的 [依赖项目](#adding-dependencies),
  即使是标记为 `implementation` 的依赖项目也可以看见;

* 对于 `bar` 中的预期声明, `foo` 可以包含对应的 [平台相关的实现代码](platform-specific-declarations.html);

* `bar` 中的资源会与 `foo` 中的资源一起处理, 复制;

* `foo` 与 `bar` 的 [语言设定](#language-settings) 应该保持一致;

源代码集之间的循环依赖是禁止的.

源代码集之间的这些关联关系可以使用源代码集的 DSL 来定义:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    sourceSets {
        commonMain { /* ... */ }
        allJvm {
            dependsOn commonMain
            /* ... */
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
        val commonMain by getting { /* ... */ }
        val allJvm by creating {
            dependsOn(commonMain)
            /* ... */
        }
    }
}
```

</div>
</div>

除[默认的源代码集](#default-project-layout)之外,
自定义创建的源代码集需要明确地加入到依赖关系中, 然后才可以在其他源代码中使用它,
而且更重要的, 比如加入到依赖关系中, 然后它才会被编译.
通常来说, 可以使用 `dependsOn(commonMain)` 或 `dependsOn(commonTest)` 语句,
某些默认的平台相关源代码集需要直接或者间接地依赖到自定义源代码集:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    mingwX64()
    linuxX64()

    sourceSets {
        // 自定义源代码集, 包括针对这两个编译目标的测试程序
        desktopTest {
            dependsOn commonTest
            /* ... */
        }
        // 让 'windows' 的默认测试源代码集依赖于 'desktopTest'
        mingwX64().compilations.test.defaultSourceSet {
            dependsOn desktopTest
            /* ... */
        }
        // 对其他编译目标也做同样的设定:
        linuxX64().compilations.test.defaultSourceSet {
            dependsOn desktopTest
            /* ... */
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
    mingwX64()
    linuxX64()

    sourceSets {
        // 自定义源代码集, 包括针对这两个编译目标的测试程序
        val desktopTest by creating {
            dependsOn(getByName("commonTest"))
            /* ... */
        }
        // 让 'windows' 的默认测试源代码集依赖于 'desktopTest'
        mingwX64().compilations["test"].defaultSourceSet {
            dependsOn(desktopTest)
            /* ... */
        }
        // 对其他编译目标也做同样的设定:
        linuxX64().compilations["test"].defaultSourceSet {
            dependsOn(desktopTest)
            /* ... */
        }
    }
}
```

</div>
</div>

### 添加依赖项目

要对源代码集添加依赖项目, 请使用源代码集 DSL 的 `dependencies { ... }` 语句段.
支持 4 种类型的依赖:

* `api` 依赖, 同时用于编译期和运行期, 而且会被导出给你的库的使用者.
  如果在当前模块的 Public API 中使用了从依赖库得到的任何类型, 那么这个类型所属的库必须是 `api` 类型的依赖项目;

* `implementation` 依赖, 同时用于编译期和运行期, 但只供当前模块使用, 而不会暴露给依赖于本模块的其他模块.
  当前模块的内部实现逻辑所需要的依赖项目, 应该使用 `implementation` 类型依赖.
  如果一个模块是一个最终应用程序, 本身不对外公布 API,
  那么它应该使用 `implementation` 依赖, 而不是 `api` 依赖.

* `compileOnly` 依赖, 只用于当前模块的编译期,
  除此之外, 对于当前模块的运行期, 以及依赖本模块的其他模块的编译期, 这些依赖都不可使用.
  对于运行期使用第三方实现的 API, 应该使用这种这种依赖.

* `runtimeOnly` 依赖, 只在运行期可用, 对任何模块的编译期, 这些依赖都不可使用.

依赖项目以源代码集为单位分别指定, 如下:

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
                api 'com.example:foo-jvm6:1.0'
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
                api("com.example:foo-jvm6:1.0")
            }
        }
    }
}
```

</div>
</div>

注意, 为了使 IDE 能够正确解析共通代码的依赖项目,
除了在平台相关源代码集中指定平台相关的依赖项目之外, 共通代码的源代码集还需要指定对应的 Kotlin metadata 依赖项.
通常, 使用公开发布的库时, 需要使用带 `-common` 后缀(比如 `kotlin-stdlib-common`) 或 `-metadata` 后缀的依赖项
(除非它发布时带有 Gradle metadata, 详情请参见下文).

然而, 使用 `project('...')` 依赖到另一个跨平台项目时, 就可以自动解析到正确的依赖项目.
因此, 只需要在一个源代码集的依赖项中使用一个 `project('...')` 依赖就可以了,
只要这个被依赖的项目中包含了兼容的编译目标,
那么包含这个源代码集的编译都会依赖到这个项目中正确的平台相关依赖项:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                // 所有包含源代码集 'commonMain' 的编译任务,
                // 如果存在这个依赖项, 都会被解析为正确的平台相关依赖项:
                api project(':foo-lib')
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
            dependencies {
                // 所有包含源代码集 'commonMain' 的编译任务,
                // 如果存在这个依赖项, 都会被解析为正确的平台相关依赖项:
                api(project(":foo-lib"))
            }
        }
    }
}
```

</div>
</div>

同样的, 如果一个跨平台库 [使用 Gradle metadata 发布](#metadata-publishing),
那么只需要对共通源代码集指定一次依赖项就足够了.
否则, 对每一个平台相关的源代码集, 除了需要依赖到共通模块之外, 还需要依赖库中对应平台的模块, 就象上面的示例那样.

另外一种方式是, 在最顶层使用 Gradle 内建的 DSL,
通过 `<sourceSetName><DependencyKind>` 格式的配置名称来指定依赖项目:

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

Gradle 的一些内建依赖项, 比如 `gradleApi()`, `localGroovy()`, 以及 `gradleTestKit()`, 在源代码集的依赖项 DSL 内是不可用的.
但是, 你可以在最顶层的依赖项配置代码段中添加它们, 方法和上面的例子一样.

对 Kotlin 模块(比如 `kotlin-stdlib` 或 `kotlin-reflect`)的依赖项, 可以使用 `kotlin("stdlib")` 来添加,
这是 `"org.jetbrains.kotlin:kotlin-stdlib"` 的简写.

### 语言设置

源代码集的语言设置可以通过以下方式指定:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    sourceSets {
        commonMain {
            languageSettings {
                languageVersion = '1.3' // 可指定值是: '1.0', '1.1', '1.2', '1.3'
                apiVersion = '1.3' // 可指定值是: '1.0', '1.1', '1.2', '1.3'
                enableLanguageFeature('InlineClasses') // 语言特性名称
                useExperimentalAnnotation('kotlin.ExperimentalUnsignedTypes') // 注解的完整限定名
                progressiveMode = true // 默认为 false
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
                languageVersion = "1.3" // 可指定值是: '1.0', '1.1', '1.2', '1.3'
                apiVersion = "1.3" // 可指定值是: '1.0', '1.1', '1.2', '1.3'
                enableLanguageFeature("InlineClasses") // 语言特性名称
                useExperimentalAnnotation("kotlin.ExperimentalUnsignedTypes") // 注解的完整限定名
                progressiveMode = true // 默认为 false
            }
        }
    }
}
```

</div>
</div>


也可以一次性指定所有源代码集的语言设置:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin.sourceSets.all {
    languageSettings.progressiveMode = true
}
```

</div>


源代码集的语言设置会影响到 IDE 解析源代码的方式.
由于目前的限制, 在 Gradle 编译中,
只有编译任务的默认源代码集的语言设置会被使用, 并被应用于这个编译任务相关的所有源代码.

在存在依赖关系的源代码集之间, 会检查语言设置的一致性. 举例来说, 如果源代码集 `foo` 依赖于 `bar`:

* `foo` 的 `languageVersion` 设置要高于或等于 `bar`;
* 如果 `bar` 启用了不稳定的语言特征, 那么所有这些语言特征在 `foo` 中也应该启用 (但对 bug 修正的语言特征没有这种限制);
* 如果 `bar` 使用了实验性的注解, 那么所有这些注解在 `foo` 中也应该使用;
* `apiVersion`, bug 修正的语言特性, 以及 `progressiveMode` 可以任意设置;

## 默认的项目结构

默认情况下, 每个项目包含两个源代码集, `commonMain` 和 `commonTest`, 你可以将所有目标平台共用的共通代码放在这两个源代码集中.
这两个源代码集将会被分别添加到所有的产品编译和测试编译中.

然后, 只要添加一个编译目标, 默认就会为它创建以下编译任务:

* `main` 和 `test` 编译任务, 针对 JVM, JS, 以及 Native 目标;
* 对每个 Android 编译目标中的每个 [Android 编译变体](https://developer.android.com/studio/build/build-variants), 创建一个编译任务;

对于每个编译任务, 都有一个默认的源代码集, 名称是 `<targetName><CompilationName>`.
这个默认的源代码集会参与编译, 因此应该使用它来编写平台相关的代码, 以及指定平台相关的依赖项,
还可以通过它来添加源代码集之间的'依赖', 来将其他源代码集加入到编译任务中.
比如, 如果一个项目包含 `jvm6` (JVM) 和 `nodeJs` (JS) 编译目标, 那么将包括以下源代码集:
`commonMain`, `commonTest`, `jvm6Main`, `jvm6Test`, `nodeJsMain`, `nodeJsTest`.

大多数使用场景只需要通过默认的源代码集就可以解决了, 不必使用自定义的源代码集.

每个源代码集的默认设置是, Kotlin 源代码放在 `src/<sourceSetName>/kotlin` 文件夹下, 资源文件放在 `src/<sourceSetName>/resources` 文件夹下.

在 Android 项目中, 还会对每个 [Android 源代码集](https://developer.android.com/studio/build/#sourcesets) 创建 Kotlin 源代码集.
如果 Android 编译目标的名称是 `foo`, 那么 Android 源代码集 `bar` 会产生一个对应的 Kotlin 源代码集, 名为 `fooBar`.
但是 Kotlin 编译任务可以从所有的 `src/bar/java`, `src/bar/kotlin`, 和 `src/fooBar/kotlin` 目录中得到 Kotlin 源代码.
而 Java 源代码只会从 `src/bar/java` 目录得到.

## 运行测试程序

目前在 JVM, Android, Linux, Windows 和 macOS 平台上, 默认支持在 Gradle 编译脚本中运行测试程序;
对于 JS 以及其他 Kotlin/Native 编译目标, 需要手工配置,
以便使用适当的环境运行来测试程序, 比如使用模拟器, 或者测试框架.

对每个可以进行测试的编译目标, 都会生成测试任务, 名称是 `<targetName>Test`.
执行 `check` 任务, 可以对所有的编译目标运行测试程序.

由于 `commonTest` 任务的 [默认源代码集](#default-project-layout) 被添加到了所有的测试任务中,
因此可以在这里添加那些需要在所有的目标平台上运行的测试程序和测试工具.

跨平台测试可以使用 [`kotlin.test` API](/api/latest/kotlin.test/index.html).
对 `commonTest` 添加 `kotlin-test-common` 和 `kotlin-test-annotations-common` 依赖项,
就可以在共通的测试代码中使用断言函数, 比如 `kotlin.test.assertTrue(...)`,
以及 `@Test`/`@Ignore`/`@BeforeTest`/`@AfterTest` 注解.

对于 JVM 编译目标, 应该添加 `kotlin-test-junit` 或 `kotlin-test-testng` 依赖项,
来使用对应的断言函数和注解.

对于 Kotlin/JS 编译目标, 应该添加 `kotlin-test-js` 作为测试依赖项.
目前来说, 会创建 Kotlin/JS 的测试任务, 但默认不会运行;
需要手工配置这些测试任务, 以便使用适当的 JavaScript 测试框架来运行来测试程序.

Kotlin/Native 编译目标不需要添加额外的测试依赖项, `kotlin.test` API 的实现是默认附带的.

## 发布跨平台的库

> 跨平台库的作者可以定义一组目标平台, 这些目标平台都应该提供这个库所需要的所有平台相关实现.
> 作为库的使用者, 不允许对一个跨平台的库添加新的目标平台.
{:.note}

通过跨平台项目编译得到的库, 可以使用
[`maven-publish` Gradle plugin](https://docs.gradle.org/current/userguide/publishing_maven.html)
发布到 Maven 仓库, 这个 plugin 可以通过以下方法引入:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    /* ... */
    id("maven-publish")
}
```

</div>

跨平台库还需要对当前项目设置 `group` 和 `version` 属性:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins { /* ... */ }

group = "com.example.my.library"
version = "0.0.1"
 ```

</div>

与发布一个纯粹的 Kotlin/JVM 项目或 Java 项目不同, 不需要使用 `publishing { ... }` DSL 手动创建发布任务.
对于当前机器上所有能够编译的编译目标, 插件会自动创建发布任务,
Android 编译目标例外, 它需要额外的步骤来配置发布任务, 详情请参见 [发布 Android 库](#publishing-android-libraries).

通过 `publishing { ... }` DSL 中的 `repositories` 代码段, 可以指定库文件发布的目标仓库(Repository),
详情请参见 [Maven Publish 插件. 仓库(Repository)](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories).

默认的库文件 ID 使用的命名方式是 `<projectName>-<targetNameToLowerCase>`,
比如对 `sample-lib` 项目的 `nodeJs` 编译目标, 发布的库文件名为 `sample-lib-nodejs`.

默认情况下, 对每个发布任务, 除库文件之外, 还会包含源代码 JAR 文件.
源代码 JAR 文件包含编译目标的 `main` 编译任务中用到的源代码文件.
如果你还需要发布文档库文件 (比如一个 Javadoc JAR), 你需要手动配置它的编译脚本,并把它作为一个库文件添加到相关的发布任务中,
详情请参见下文.

此外还会默认创建一个额外的发布任务, 名为 "metadata",
其中包含序列化后的 Kotlin 声明信息, 将被 IDE 用来分析跨平台库.
"metadata" 发布任务的默认库文件 ID 命名方式是 `<projectName>-metadata`.

可以修改 Maven 仓库中的发布位置, 也可以对发布任务添加新的库文件,
方法是在 `targets { ... }` 代码段中, 或 `publishing { ... }` DSL 中, 进行如下设置:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm('jvm6') {
        mavenPublication { // 对 'jvm6' 编译目标设置发布任务
            // 默认的库文件 ID 是 'foo-jvm6', 我们需要修改它:
            artifactId = 'foo-jvm'
            // 添加一个文档 JAR 库文件 (它应该是一个自定义编译任务):
            artifact(jvmDocsJar)
        }
    }
}

// 或者也可以使用 `publishing { ... }` DSL 来配置发布任务:
publishing {
    publications {
        jvm6 { /* 对 'jvm6' 编译目标设置发布任务 */ }
        metadata { /* 对 Kotlin metadata 设置发布任务 */ }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    jvm("jvm6") {
        mavenPublication { // 对 'jvm6' 编译目标设置发布任务
            // 默认的库文件 ID 是 'foo-jvm6', 我们需要修改它:
            artifactId = "foo-jvm"
            // 添加一个文档 JAR 库文件 (它应该是一个自定义编译任务):
            artifact(jvmDocsJar)
        }
    }
}

// 或者也可以使用 `publishing { ... }` DSL 来配置发布任务:
publishing {
    publications.withType<MavenPublication>().apply {
        val jvm6 by getting { /* 对 'jvm6' 编译目标设置发布任务 */ }
        val metadata by getting { /* 对 Kotlin metadata 设置发布任务 */ }
    }
}
```

</div>
</div>

Kotlin/Native 库文件的组装需要在多个目标平台上分别进行编译,
因此, 如果一个跨平台库包含 Kotlin/Native 编译目标, 那么它的发布任务就同样需要在多台主机上运行.
有些模块可能会在多个平台上编译多次(比如 JVM, JS, Kotlin metadata, WebAssembly),
为了避免重复发布这样的模块, 这些模块的发布任务可以配置为有条件执行.

下面是一个简化的示例, 它确保只有在构建任务通过命令行参数收到 `-PisLinux=true` 参数时,
才会上传 JVM, JS, 以及 Kotlin metadata 的发布任务:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm()
    js()
    mingwX64()
    linuxX64()

    // 注意, 这里也包含了 Kotlin metadata 编译目标.
    // mingwx64() 编译目标会被自动跳过, 因为与 Linux 平台的编译任务不兼容.
    configure([targets["metadata"], jvm(), js()]) {
        mavenPublication { targetPublication ->
            tasks.withType(AbstractPublishToMaven)
                .matching { it.publication == targetPublication }
                .all { onlyIf { findProperty("isLinux") == "true" } }            
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
    jvm()
    js()
    mingwX64()
    linuxX64()

    // 注意, 这里也包含了 Kotlin metadata 编译目标.
    // mingwx64() 编译目标会被自动跳过, 因为与 Linux 平台的编译任务不兼容.
    configure(listOf(metadata(), jvm(), js())) {
        mavenPublication {
            val targetPublication = this@mavenPublication
            tasks.withType<AbstractPublishToMaven>()
                .matching { it.publication == targetPublication }
                .all { onlyIf { findProperty("isLinux") == "true" } }            
        }
    }
}
```

</div>
</div>

<a name="experimental-metadata-publishing-mode">

### 元数据发布(Metadata Publishing)

Gradle 模块 metadata 提供了丰富的发布与依赖项解析功能,
对构建脚本的作者来说, 在 Kotlin 跨平台项目中使用这些功能, 可以大大简化依赖项的配置.
具体来说, 一个跨平台库发布时包含一个特殊的 'root' 模块, 代表整个库,
并且如果将它加入到依赖项, 它会自动解析为适当的平台相关库文件, 详情请见下文.

在 Gradle 6.0 及更高版本中, 在依赖项解析时始终会使用模块的 metadata, 在发布时也始终会附带模块的 metadata.

在比较早的 Gradle 版本中 (5.3 版以后), 在依赖项解析时会使用模块的 metadata, 但发布时默认不会附带任何 metadata.
要启用模块 metadata 的发布功能,
需要对 root 项目的 `settings.gradle` 文件添加 `enableFeaturePreview("GRADLE_METADATA")`.

当发布中附带模块 metadata 时, 会对项目添加一个额外的 'root' 发布, 名为 `kotlinMultiplatform`.
这个发布的默认 artifact ID 与项目名称一致, 没有任何额外的后缀.
要配置这个发布, 可以通过 `maven-publish` 插件的 `publishing { ... }` DSL 访问它:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin { /* ... */ }

publishing {
    publications {
        kotlinMultiplatform {
            artifactId = "foo"        
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin { /* ... */ }

publishing {
    publications {
        val kotlinMultiplatform by getting {
            artifactId = "foo"        
        }
    }
}
```

</div>
</div>

这个发布不带有任何 artifact, 而且只会以变体的形式引用其他发布.
但是, 如果仓库要求的话吗, 它可能会需要源代码和文档的 artifact.
这种情况下, 需要在这个发布的作用域内, 使用
[`artifact(...)`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-)
来添加这些 artifact, 具体方法请参见上面的示例.

如果一个库存在一个 'root' 发布, 使用者可以在共通源代码集中, 对这个库指定单个依赖项目,
然后, 对每个包含这个依赖项的编译任务, 如果相应的平台相关变体存在的话, 会自动选择正确的平台相关变体.
比如, 针对 JVM 和 JS 平台编译了 `sample-lib` 库, 而且发布时包含 'root' 发布:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    jvm('jvm6')
    js('nodeJs')

    sourceSets {
        commonMain {
            dependencies {
                // 这个单独的依赖项会解析为适当的目标模块,
                // 比如, 对 JVM 平台会解析为 `sample-lib-jvm6`, 对 JS 平台会解析为 `sample-lib-js`:
                api 'com.example:sample-lib:1.0'
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
    jvm("jvm6")
    js("nodeJs")

    sourceSets {
        val commonMain by getting {
            dependencies {
                // 这个单独的依赖项会解析为适当的目标模块,
                // 比如, 对 JVM 平台会解析为 `sample-lib-jvm6`, 对 JS 平台会解析为 `sample-lib-js`:
                api("com.example:sample-lib:1.0")
            }
        }
    }
}
```

</div>
</div>

### 对编译目标消除歧义

在跨平台的库中, 对单个目标平台有可能存在多个编译目标.
比如, 这些编译目标可能提供相同的 API, 但在运行期使用不同的库来实现, 比如可以选择不同的测试框架, 或日志输出框架.

但是, 对这样的跨平台的库的依赖可能会发生歧义, 会导致解析失败,
因为没有足够的信息决定应该选择哪个编译目标.

解决方法是, 对编译目标标记一个自定义属性, Gradle 在解析依赖项的过程中会使用这个属性.
但是, 必须在库的作者和使用者双方都进行同样的标记, 而且库的作者需要负责维护这个属性的名称和可选的值,
并将这些信息公布给使用者;

需要在库本身的项目和使用库的项目中都加入相同的自定义属性.
比如, 假设一个测试库, 它的两个编译目标分别支持 JUnit 和 TestNG.
库的作者需要向这两个编译目标都添加属性, 如下:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
def testFrameworkAttribute = Attribute.of('com.example.testFramework', String)

kotlin {
    jvm('junit') {
        attributes.attribute(testFrameworkAttribute, 'junit')
    }
    jvm('testng') {
        attributes.attribute(testFrameworkAttribute, 'testng')
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
val testFrameworkAttribute = Attribute.of("com.example.testFramework", String::class.java)

kotlin {
    jvm("junit") {
        attributes.attribute(testFrameworkAttribute, "junit")
    }
    jvm("testng") {
        attributes.attribute(testFrameworkAttribute, "testng")
    }
}
```

</div>
</div>

库的使用者可以只向发生依赖项歧义的编译目标添加相同的属性.

如果同样的依赖项歧义发生在自定义编译配置, 而不是 plugin 创建的编译配置,
你可以通过同样的方式向编译配置添加属性:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
def testFrameworkAttribute = Attribute.of('com.example.testFramework', String)

configurations {
    myConfiguration {
        attributes.attribute(testFrameworkAttribute, 'junit')
    }
}  
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
val testFrameworkAttribute = Attribute.of("com.example.testFramework", String::class.java)

configurations {
    val myConfiguration by creating {
        attributes.attribute(testFrameworkAttribute, "junit")
    }
}  
```

</div>
</div>

## JVM 编译目标中的 Java 支持

这个功能从 Kotlin 1.3.40 版本开始有效.

默认情况下, JVM 编译目标会忽略 Java 源代码, 只编译 Kotlin 源代码文件.
要把 Java 源代码添加到 JVM 编译目标的编译任务中, 或使用一个依赖 `java` 插件的 Gradle 插件,
你需要对编译目标明确启用 Java 支持:

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    jvm {
        withJava()
    }
}
```

</div>

这样的代码将会使用 Gradle `java` 插件, 并且对编译目标进行配置, 以配合 `java` 插件工作.
注意, 仅仅只是使用 Java 插件, 而在 JVM 编译目标中不指定 `withJava()`,
那么对编译目标不会发生作用.

Java 源代码的文件位置与 `java` 插件的默认设置不同.
Java 源代码需要放在 Kotlin 源代码文件根目录并列的目录下.
比如, 如果 JVM 编译目标使用默认名称 `jvm`, 那么文件路径将是:

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```
src
├── jvmMain
│   ├── java // 产品版 Java 源代码
│   ├── kotlin
│   └── resources
├── jvmTest
│   ├── java // 测试程序 Java 源代码
│   ├── kotlin
…   └── resources
```

</div>

共通源代码集不能包含 Java 源代码.

由于目前的限制, Java 插件配置的某些任务会被禁用, 改为使用 Kotlin 插件添加的对应的任务:

* `jar` 会被禁用, 改为使用当前编译目标的 JAR 任务 (比如 `jvmJar`)
* `test` 会被禁用, 改为使用当前编译目标的 test 任务 (比如 `jvmTest`)
* `*ProcessResources` 任务会被禁用, 编译任务中的相应任务会处理资源文件

当前编译目标的发布, 由 Kotlin 插件处理, 并且不需要进行 Java 插件的相关设置,
比如, 手动创建发布任务, 并使用 `from(components.java)` 进行配置.

## Android 支持

Kotlin 跨平台项目提供了预定义的 `android` 编译目标, 支持 Android 平台.
创建 Android 编译目标需要在项目中手动适用某个 Android Gradle plugin,
比如 `com.android.application` 或 `com.android.library`.
对于每个 Gradle 子项目, 只能创建一个 Android 编译目标:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.multiplatform").version("{{ site.data.releases.latest.version }}")
}

android { /* ... */ }

kotlin {
    android { // 创建 Android 编译目标
        // 如果需要, 在这里指定额外的配置信息
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins {
    id("com.android.library")
    kotlin("multiplatform").version("{{ site.data.releases.latest.version }}")
}

android { /* ... */ }

kotlin {
    android { // 创建 Android 编译目标
        // 如果需要, 在这里指定额外的配置信息
    }
}
```

</div>
</div>

Android 编译目标会默认创建编译任务, 并绑定到 [Android 编译变体](https://developer.android.com/studio/build/build-variants):
对每个编译变体, 都会创建一个与它相同名称的编译任务.

然后, 对于编译变体编译的每个 [Android 源代码集](https://developer.android.com/studio/build/build-variants#sourcesets),
都会创建一个 Kotlin 源代码集, 名称是 Android 源代码集名前面加上编译目标名,
比如, 对于 Kotlin 编译目标 `android`, 以及 Android 源代码集 `debug`, 对应的 Kotlin 源代码集名为 `androidDebug`.
这些 Kotlin 源代码集会被添加到对应的变体编译任务中.

默认的源代码集 `commonMain` 会被添加到所有的产品编译变体(无论是应用程序还是库) 的编译任务中.
类似的, 源代码集 `commonTest`, 会被添加到单元测试(Unit Test)和设备测试(Instrumented Test)的编译变体中.

也支持使用 [kapt](kapt.html) 的注解处理,
但是由于目前的限制, 要求在配置 `kapt` 依赖项之前创建 Android 编译目标,
因此需要使用顶级的 `dependencies { ... }` 代码段, 而不是使用 Kotlin 源代码集的依赖项配置语法.

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
// ...

kotlin {
    android { /* ... */ }
}

dependencies {
    kapt("com.my.annotation:processor:1.0.0")
}
```

</div>

### 发布 Android 库

如果要在发布跨平台项目时包含 Android 库, 你需要 [设置库的发布任务](#publishing-a-multiplatform-library),
并为 Android 库编译目标指定额外的配置信息.

Android 库文件默认不会发布. 如果要发布各个
[Android 编译变体](https://developer.android.com/studio/build/build-variants) 产生的库文件,
请在 Android 编译目标的脚本中指定需要发布的编译变体名称, 如下:

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    android {
        publishLibraryVariants("release", "debug")
    }
}
```

</div>

上面的示例适用于没有产品风格(Product Flavor)的 Android 库.
对于有产品风格(Product Flavor)的库, 变体名称中还需要包含产品风格名称,
比如 `fooBarDebug` 或 `fooBazRelease`.

注意, 如果库的使用者定义了某个编译变体, 但在库中不存在这个变体,
那么需要为编译变体指定 [匹配回退(Matching Fallback)](https://developer.android.com/studio/build/dependencies#resolve_matching_errors).
比如, 如果一个库不包含, 或者没有发布, 名为 `staging` 的编译变体, 那么对于库的使用者, 如果使用了这个编译变体,
就需要提供一个匹配回退机制, 指定库发布的一个以上的编译变体, 作为后备选项:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
android {
    buildTypes {
        staging {
            // ...
            matchingFallbacks = ['release', 'debug']
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
android {
    buildTypes {
        val staging by creating {
            // ...
            matchingFallbacks = listOf("release", "debug")
        }
    }
}
```

</div>
</div>

类似的, 如果库的使用者使用了自定义的产品风格(Product Flavor),
而在库中不存在这个产品风格(Product Flavor), 那么库的使用者同样需要提供匹配回退.

有一个选项, 可以将各个编译变体以产品风格为单位分组发布, 使得不同的编译变体的输出文件可以放在同一个模块内,
编译变体成为库文件 ID 中的一个分类符 (release 编译的结果发布时仍然不带分类符).
这种发布模式默认是关闭的, 如果要启用, 请使用以下设置:

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```groovy
kotlin {
    android {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

</div>

如果不同的编译变体存在不同的依赖项, 那么不推荐使用这种模式,
因为它们的依赖项会组合在一起, 成为一个庞大的依赖项列表.

## 使用 Kotlin/Native 编译目标

注意, 某些 [Kotlin/Native 编译目标](#supported-platforms) 可能只能在适当的机器上编译:

* Linux MIPS 编译目标 (`linuxMips32` 和 `linuxMipsel32`) 需要 Linux 主机. 其他 Linux 编译目标可以在任何支持的主机上编译;
* Windows 编译目标需要 Windows 主机;
* macOS 和 iOS 编译目标只能在 macOS 主机上编译;
* 64位 Android Native 编译目标需要 Linux 或 macOS 主机.
  32位 Android Native 编译目标可以在任何支持的主机上编译.

在编译时, 当前主机不能支持的编译目标会被忽略, 因此也不会发布.
库的作者可能希望根据库的目标平台的需要来设置编译脚本, 并通过不同的主机来发布.

### 编译目标的快捷方式

某些原生编译目标经常会同时创建, 并且使用相同的源代码.
比如, 针对 iOS 设备的编译, 以及针对模拟器环境的编译, 是不同的编译目标(分别是 `iosArm64` 和 `iosX64`), 但它们的源代码通常是相同的.
为了在跨平台项目中表达这种代码共享关系, 正规的做法是创建一个中间源代码集 (`iosMain`),
并设置目标平台的源代码集与它的依赖关系:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
sourceSets{
    iosMain {
        dependsOn(commonMain)
        iosDeviceMain.dependsOn(it)
        iosSimulatorMain.dependsOn(it)
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
val commonMain by sourceSets.getting
val iosDeviceMain by sourceSets.getting
val iosSimulatorMain by sourceSets.getting

val iosMain by sourceSets.creating {
    dependsOn(commonMain)
    iosDeviceMain.dependsOn(this)
    iosSimulatorMain.dependsOn(this)
}
```

</div>
</div>

从 1.3.60 版开始, `kotlin-multiplaform` 创建提供快捷方式, 可以自动完成这些配置:
可以通过一个 DSL 方法创建一组编译目标, 并对它们使用相同的源代码集.

可用的快捷方式如下:

 * `ios` 为 `iosArm64` 和 `iosX64` 创建编译目标.
 * `watchos` 为 `watchosArm32`, `watchosArm64`, `watchosX86` 创建编译目标.
 * `tvos` 为 `tvosArm64` 和 `tvosX64` 创建编译目标.

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
// 对 iOS 创建 2 个编译目标.
// 创建共通的源代码集: iosMain 和 iosTest.
ios {
    // 配置编译目标.
    // 注意: 会对每个编译目标调用这个 Lambda 表达式.
}

// 也可以对创建的编译目标指定名称前缀.
// 共通源代码集也会添加这个前缀:
// anotherIosMain 和 anotherIosTest.
ios("anotherIos")
```

</div>

### 编译最终的原生二进制文件

Kotlin/Native 编译目标默认会被编译输出为 `*.klib` 库文件, 这种库文件可以被 Kotlin/Native 用作依赖项, 但它不能执行, 也不能被用作一个原生的库.
如果要编译为最终的原生二进制文件, 比如可执行文件, 或共享库, 可以使用 Native 编译目标的 `binaries` 属性.
这个属性值是二进制文件类型的列表, 表示除默认的 `*.klib` 库文件之外, 这个编译目标还需要编译为哪些类型,
这个属性还提供了一组方法, 用来声明和配置这些二进制文件类型.

注意, `kotlin-multiplaform` plugin 默认不会创建任何产品版(production)的二进制文件.
默认情况下, 只会产生一个调试版(debug)的可执行文件, 你可以通过 `test` 编译任务来运行这个可执行文件内的测试程序.

#### 二进制编译输出的声明

有一组工厂方法可以用来声明 `binaries` 中的元素. 这些方法允许开发者指定输出什么类型的二进制文件, 并对其进行配置.
支持的二进制文件类型如下(注意, 并不是所有的原生平台都支持所有的二进制类型):

|** 工厂方法 **|**  二进制文件类型 **| **           支持的原生平台             **|
| ----------- | ---------------- | --------------------------------------- |
|`executable` | 产品版的可执行文件  | 所有的原生平台                             |
|`test`       | 测试程序的可执行文件 | 所有的原生平台                             |
|`sharedLib`  | 共享的原生库文件    | 所有的原生平台, `wasm32` 除外                |
|`staticLib`  | 静态的原生库文件    | 所有的原生平台, `wasm32` 除外                |
|`framework`  | Objective-C 框架  | 只支持 macOS, iOS, watchOS, 和 tvOS 编译目标|

每个工厂方法都存在几个版本. 这里我们以 `executable` 为例进行说明.
对于其他工厂方法也存在完全相同的其他版本.

最简单的版本不需要任何额外参数, 并对每一个编译类型创建一个二进制文件.
现在我们有 2 个编译类型: `DEBUG` (产生一个未经优化的, 带调试信息的二进制文件), 和 `RELEASE` (产生优化过的, 无调试信息的二进制文件).
因此, 下面的代码会创建 2 个可执行的二进制文件: debug 和 release.

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {
    linuxX64 { // 这里请改为你的编译目标.
        binaries {
            executable {
                // 这里指定二进制文件的配置信息.
            }
        }
    }
}
```

</div>

上例中的 `executable` 方法接受一个 Lambda 表达式参数, 这个 Lambda 表达式会对每个二进制文件执行,
因此开发者可以在这里对二进制文件进行配置(参见 [配置二进制文件](#configuring-binaries)).
注意, 如果不需要额外的配置信息, 那么这个 Lambda 表达式可以省略:

<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
binaries {
    executable()
}
```

</div>

还可以指定使用哪些编译类型来创建二进制文件, 以及忽略哪些编译类型.
下面的示例只创建 debug 版的二进制文件.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
binaries {
    executable([DEBUG]) {
        // 这里指定二进制文件的配置信息.
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
binaries {
    executable(listOf(DEBUG)) {
        // 这里指定二进制文件的配置信息.
    }
}
```

</div>
</div>

工厂方法的最后一个版本, 可以定制二进制文件的名称.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
binaries {
    executable('foo', [DEBUG]) {
        // 这里指定二进制文件的配置信息.
    }

    // 可以省略编译类型 (这时会使用所有的编译类型).
    executable('bar') {
        // 这里指定二进制文件的配置信息.
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
binaries {
    executable("foo", listOf(DEBUG)) {
        // 这里指定二进制文件的配置信息.
    }

    // 可以省略编译类型 (这时会使用所有的编译类型).
    executable("bar") {
        // 这里指定二进制文件的配置信息.
    }
}
```

</div>
</div>

这个示例中的第一个参数允许我们对被创建的二进制文件指定一个名称前缀,
在编译脚本中可以使用这个名称来访问二进制文件 (参见 ["访问二进制文件"](#accessing-binaries) 小节).
而且这个前缀还被用于二进制文件的默认文件名.
比如, 在 Windows 平台, 上例的会输出两个文件 `foo.exe` 和 `bar.exe`.

#### 访问二进制文件

二进制文件配置的 DSL 不仅可以用来创建二进制文件, 还可以访问已创建的二进制文件, 对其进行配置, 或者获取其属性(比如, 输出文件的路径).
`binaries` 集合实现了 [`DomainObjectSet`](https://docs.gradle.org/current/javadoc/org/gradle/api/DomainObjectSet.html) 接口,
提供了 `all` , `matching` 之类的方法, 可以用来对一组元素进行配置.

此外还可以从这个集合中获取特定的元素. 有两种方法.
第一种方法是, 使用二进制文件的唯一名称.
这个名称由名称前缀(如果有指定的话), 编译类型, 以及二进制文件类型组成, 使用以下命名方式:
`<optional-name-prefix><build-type><binary-kind>`, 比如, `releaseFramework` 或 `testDebugExecutable`.

> 注意: 静态库和共享库分别带有 `static` 和 `shared` 后缀, 比如, `fooDebugStatic` 或 `barReleaseShared`

通过这个名称, 我们可以访问二进制文件:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
// 如果二进制文件不存在, 这个函数会失败.
binaries['fooDebugExecutable']
binaries.fooDebugExecutable
binaries.getByName('fooDebugExecutable')

// 如果二进制文件不存在, 这个函数会返回 null.
binaries.findByName('fooDebugExecutable')
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
// 如果二进制文件不存在, 这个函数会失败.
binaries["fooDebugExecutable"]
binaries.getByName("fooDebugExecutable")

// 如果二进制文件不存在, 这个函数会返回 null.
binaries.findByName("fooDebugExecutable")
```

</div>
</div>

第二种方法是使用有类型的 get 方法. 通过这些 get 方法, 我们可以使用名称前缀和编译类型访问某个特定类型的二进制文件.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
// 如果二进制文件不存在, 这个函数会失败.
binaries.getExecutable('foo', DEBUG)
binaries.getExecutable(DEBUG)          // 如果没有设置名称前缀, 可以省略第一个参数.
binaries.getExecutable('bar', 'DEBUG') // 对于编译类型, 也可以使用字符串.

// 对其他二进制文件类型, 可以使用类似的 get 方法:
// getFramework, getStaticLib 以及 getSharedLib.

// 如果二进制文件不存在, 这个函数会返回 null.
binaries.findExecutable('foo', DEBUG)

// 对其他二进制文件类型, 可以使用类似的 get 方法:
// findFramework, findStaticLib 以及 findSharedLib.
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
// 如果二进制文件不存在, 这个函数会失败.
binaries.getExecutable("foo", DEBUG)
binaries.getExecutable(DEBUG)          // 如果没有设置名称前缀, 可以省略第一个参数.
binaries.getExecutable("bar", "DEBUG") // 对于编译类型, 也可以使用字符串.

// 对其他二进制文件类型, 可以使用类似的 get 方法:
// getFramework, getStaticLib 以及 getSharedLib.

// 如果二进制文件不存在, 这个函数会返回 null.
binaries.findExecutable("foo", DEBUG)

// 对其他二进制文件类型, 可以使用类似的 get 方法:
// findFramework, findStaticLib 以及 findSharedLib.
```

</div>
</div>

> 在 1.3.40 版之前, 测试程序和产品版的可执行文件, 都使用相同的二进制类型来表示.
  因此, 要访问插件创建的默认的测试二进制文件, 需要使用以下代码:
> ```
> binaries.getExecutable("test", "DEBUG")
> ```
> 从 1.3.40 版开始, 测试程序的可执行文件使用一种独立的二进制类型来表示, 并且有它专用的取得方法.
  要访问默认的测试二进制文件, 可以使用以下代码:
> ```
> binaries.getTest("DEBUG")
> ```
{:.note}


#### 配置二进制文件

二进制文件有一组属性, 可以对其进行配置. 目前支持的属性如下:

 - **编译任务.** 每个二进制文件都是基于同一个编译目标中的一组编译任务构建的.
   这个参数的默认值由二进制类型决定: `Test` 二进制类型使用 `test` 编译任务, 其他二进制类型使用 `main` 编译任务.
 - **链接参数.** 二进制文件编译时 传递给操作系统链接程序(system linker)的命令行参数. 你可以使用这个设置, 来将你的二进制文件链接到某些原生库.
 - **输出文件名.** 默认情况下, 编译输出文件名由二进制文件的名称前缀决定, 如果没有指定名称前缀, 则由项目名称决定.
但也可以使用 `baseName` 属性来独立配置输出文件名. 注意, 最终输出的文件名会在 `baseName` 之上添加前缀和后缀, 前缀和后缀的具体内容与操作系统相关.
比如, 对于 Linux 共享库, `baseName` 设置为 `foo` 时, 最终输出文件名会是 `libfoo.so`.
 - **入口点(Entry Point)** (只对可执行二进制文件有效). 默认情况下, Kotlin/Native 可执行程序的入口点是位于最顶层包中的 `main` 函数.
使用这个设置, 我们可以改变这个默认设置, 使用一个自定义的函数作为可执行程序的入口点.
比如, 可以用来将 `main` 函数从最顶层包移动到其他包.
 - **访问输出文件.**
 - **访问链接任务.**
 - **访问运行任务** (只对可执行二进制文件有效). `kotlin-multiplatform` 会对当前编译主机(Windows, Linux 和 macOS)上所有的可执行二进制文件创建运行任务.
这些运行任务的名称由二进制文件名称决定, 比如, `runReleaseExecutable<target-name>` 或 `runFooDebugExecutable<target-name>`.
对于可执行的二进制文件, 可以使用 `runTask` 属性来访问它的运行任务.
 - **框架类型** (只对 Objective-C 框架有效). 默认情况下, Kotlin/Native 构建的框架包含一个动态库. 但也可以替换为静态库.

下面的例子演示如何使用这些设定.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
binaries {
    executable('my_executable', [RELEASE]) {
        // 使用 test 编译任务创建一个二进制文件.
        compilation = compilations.test

        // 设置传递给链接程序的命令行选项.
        linkerOpts = ['-L/lib/search/path', '-L/another/search/path', '-lmylib']

        // 定义最终输出文件的 base name.
        baseName = 'foo'

        // 设置入口函数.
        entryPoint = 'org.example.main'

        // 访问最终输出文件.
        println("Executable path: ${outputFile.absolutePath}")

        // 访问链接任务.
        linkTask.dependsOn(additionalPreprocessingTask)

        // 访问运行任务.
        // 注意, 在不支持这些二进制文件运行的编译平台上, runTask 会为 null.
        runTask?.dependsOn(prepareForRun)
    }

    framework('my_framework' [RELEASE]) {
        // 在框架中包含静态库, 而不是动态库.
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
        // 使用 test 编译任务创建一个二进制文件.
        compilation = compilations["test"]

        // 设置传递给链接程序的命令行选项.
        linkerOpts = mutableListOf("-L/lib/search/path", "-L/another/search/path", "-lmylib")

        // 定义最终输出文件的 base name.
        baseName = "foo"

        // 设置入口函数.
        entryPoint = "org.example.main"

        // 访问最终输出文件.
        println("Executable path: ${outputFile.absolutePath}")

        // 访问链接任务.
        linkTask.dependsOn(additionalPreprocessingTask)

        // 访问运行任务.
        // 注意, 在不支持这些二进制文件运行的编译平台上, runTask 会为 null.
        runTask?.dependsOn(prepareForRun)
    }

    framework("my_framework" listOf(RELEASE)) {
        // 在框架中包含静态库, 而不是动态库.
        isStatic = true
    }
}
```

</div>
</div>

#### 将依赖项目导出到二进制文件

编译 Objective-C 框架, 或原生库(共享库或静态库)时, 经常会出现一种需要, 不仅要打包当前项目的类文件, 同时还要打包当前项目依赖的其他类.
二进制文件配置的 DSL 提供了 `export` 方法, 我们可以用来指定需要导出哪些依赖项到我们的二进制文件中.
注意, 只能导出对应的源代码集的 API 依赖项.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    sourceSets {
        macosMain.dependencies {
            // 这些依赖项会被导出.
            api project(':dependency')
            api 'org.example:exported-library:1.0'

            // 这个依赖项不会被导出.
            api 'org.example:not-exported-library:1.0'
        }
    }

    macosX64("macos").binaries {
        framework {
            export project(':dependency')
            export 'org.example:exported-library:1.0'
        }

        sharedLib {
            // 可以对不同的二进制文件导出不同的依赖项目.
            export project(':dependency')
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
        macosMain.dependencies {
            // 这些依赖项会被导出.
            api(project(":dependency"))
            api("org.example:exported-library:1.0")

            // 这个依赖项不会被导出.
            api("org.example:not-exported-library:1.0")
        }
    }

    macosX64("macos").binaries {
        framework {
            export(project(":dependency"))
            export("org.example:exported-library:1.0")
        }

        sharedLib {
            // 可以对不同的二进制文件导出不同的依赖项目.
            export(project(':dependency'))
        }
    }
}
```

</div>
</div>

> 如上面的例子所示, maven 依赖项也可以导出. 但由于 Gradle metadata 目前的限制,
  这样的依赖项必须是一个平台相关的文件
  (比如, 应该是 `kotlinx-coroutines-core-native_debug_macos_x64`, 而不是 `kotlinx-coroutines-core-native`),
  否则的话, 必须是传递性(transitively)导出(详情请参见下文).

默认情况下, 导出是非传递性的(non-transitively).
如果被导出的库 `foo` 依赖于库 `bar`, 只有 `foo` 中的方法会被添加到输出的框架中.
这种行为可以通过 `transitiveExport` 标记来修改.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
binaries {
    framework {
        export project(':dependency')
        // 使用传递性导出.
        transitiveExport = true
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
binaries {
    framework {
        export(project(":dependency"))
        // 使用传递性导出.
        transitiveExport = true
    }
}
```

</div>
</div>

#### 构建通用框架(Universal Framework)

默认情况下, Kotlin/Native 编译产生的 Objective-C 框架 只支持单个平台.
但是, 使用 `lipo` 工具程序, 可以将针对多个平台的多个框架合并为单个通用的(fat) 二进制文件.
具体来说, 这种操作对 32 位和 64 位 iOS 框架是很合理的.
这种情况下, 最终产生的通用框架可以同时运行在 32 位和 64 位设备上.

对 iOS 编译目标, 除创建通常的框架之外, Gradle 插件还提供单独的任务来创建通用框架.
下面的示例演示如何使用这个编译任务. 注意, fat 框架必须使用与原框架相同的基本名称(base name).

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 创建并配置编译目标.
    targets {
        iosArm32("ios32")
        iosArm64("ios64")

        configure([ios32, ios64]) {
            binaries.framework {
                baseName = "my_framework"
            }
        }
    }

    // 创建 fat 框架的构建任务.
    task debugFatFramework(type: FatFrameworkTask) {
        // fat 框架必须使用与原框架相同的基本名称(base name).
        baseName = "my_framework"

        // 默认的输出目录是 '<build directory>/fat-framework'.
        destinationDir = file("$buildDir/fat-framework/debug")

        // 指定需要合并的框架.
        from(
            targets.ios32.binaries.getFramework("DEBUG"),
            targets.ios64.binaries.getFramework("DEBUG")
        )
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 创建并配置编译目标.
    val ios32 = iosArm32("ios32")
    val ios64 = iosArm64("ios64")

    configure(listOf(ios32, ios64)) {
        binaries.framework {
            baseName = "my_framework"
        }
    }

    // 创建 fat 框架的构建任务.
    tasks.create("debugFatFramework", FatFrameworkTask::class) {
        // fat 框架必须使用与原框架相同的基本名称(base name).
        baseName = "my_framework"

        // 默认的输出目录是 '<build directory>/fat-framework'.
        destinationDir = buildDir.resolve("fat-framework/debug")

        // 指定需要合并的框架.
        from(
            ios32.binaries.getFramework("DEBUG"),
            ios64.binaries.getFramework("DEBUG")
        )
    }
}
```

</div>
</div>

### 对 CInterop 的支持

由于 Kotlin/Native 提供了 [与原生语言的交互能力](native/c_interop.html),
因此编译脚本中也提供了一种 DSL 用来为编译任务配置这个功能.

编译任务可以与几种不同的原生语言交互. 在编译任务的 `cinterops` 代码段中可以配置与每种语言的交互能力:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    linuxX64 { // 这里请修改为你需要的编译目标.
        compilations.main {
            cinterops {
                myInterop {
                    // 描述原生 API 的 def 文件.
                    // 默认路径是 src/nativeInterop/cinterop/<interop-name>.def
                    defFile project.file("def-file.def")

                    // 用来放置生成的 Kotlin API 的包.
                    packageName 'org.sample'

                    // 通过 cinterop 工具传递给编译器的参数.
                    compilerOpts '-Ipath/to/headers'

                    // 用来查找头文件的目录 (等价于编译器的 -I<path> 参数).
                    includeDirs.allHeaders("path1", "path2")

                    // 用来查找 def 文件的 'headerFilter' 参数中指定的头文件时使用的额外的目录.
                    // 等价于 -headerFilterAdditionalSearchPrefix 命令行参数.
                    includeDirs.headerFilterOnly("path1", "path2")

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
    linuxX64 {  // 这里请修改为你需要的编译目标.
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // 描述原生 API 的 def 文件.
                // 默认路径是 src/nativeInterop/cinterop/<interop-name>.def
                defFile(project.file("def-file.def"))

                // 用来放置生成的 Kotlin API 的包.
                packageName("org.sample")

                // 通过 cinterop 工具传递给编译器的参数.
                compilerOpts("-Ipath/to/headers")

                // 用来查找头文件的目录.
                includeDirs.apply {
                    // 用来查找头文件的目录 (等价于编译器的 -I<path> 参数).
                    allHeaders("path1", "path2")

                    // 用来查找 def 文件的 'headerFilter' 参数中指定的头文件时使用的额外的目录.
                    // 等价于 -headerFilterAdditionalSearchPrefix 命令行参数.
                    headerFilterOnly("path1", "path2")
                }
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

对于使用到原生库的二进制输出文件, 经常会需要指定编译目标特定的链接参数.
可以使用二进制文件的 `linkerOpts` 属性来实现. 详情请参见 [配置二进制文件](#configuring-binaries) 小节.
