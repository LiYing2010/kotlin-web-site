---
type: doc
layout: reference
title: "使用 Gradle 编译跨平台项目"
---

# 使用 Gradle 编译跨平台项目

> 跨平台项目是 Kotlin 1.2 和 1.3 版中的实验性特性. 本文档描述的所有语言特性和工具特性, 在未来的 Kotlin 版本中都有可能发生变更.
{:.note}

本文档介绍如何使用 Gradle 来配置和编译 [Kotlin 跨平台项目](multiplatform.html).
只能使用 Gradle 4.7 以上版本, 不支持旧版本的 Gradle.

对于跨平台项目, Gradle Kotlin DSL 的支持暂时还未实现, 在将来的版本更新中会加入这个功能.
请在编译脚本中使用 Groovy DSL.

## 设置跨平台项目

你可以在 IDE 中创建一个跨平台项目, 方法是在 New Project 对话框中选择 "Kotlin" 中的某个跨平台项目模板.

比如, 如果你选择 "Kotlin (Multiplatform Library)", 会创建一个 Library 项目, 其中包含 3 个 [编译目标](#setting-up-targets), 一个是 JVM, 一个是 JS, 另一个是你当前正在使用的本地平台.
这些设置保存在 `build.gradle` 脚本中, 如下:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}

repositories {
    mavenCentral()
}

kotlin {
    targets {
        fromPreset(presets.jvm, 'jvm')
        fromPreset(presets.js, 'js')
        fromPreset(presets.mingwX64, 'mingw')
    }

    sourceSets { /* ... */ }
}
```

</div>

这 3 个编译目标是使用预定义的 [默认配置](#default-project-layout) 来创建的, 对于每个 [支持的平台](#supported-platforms) 都提供了这种预定义的默认配置.

[源代码集](#configuring-source-sets) 以及它们的 [依赖项目](#adding-dependencies) 配置如下:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins { /* ... */ }

kotlin {
    targets { /* ... */ }

    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlin:kotlin-stdlib-common'
            }
        }
        commonTest {
            dependencies {
                implementation 'org.jetbrains.kotlin:kotlin-test-common'
                implementation 'org.jetbrains.kotlin:kotlin-test-annotations-common'
            }
        }
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlin:kotlin-stdlib-jdk8'
            }
        }
        jvmTest {
            dependencies {
                implementation 'org.jetbrains.kotlin:kotlin-test'
                implementation 'org.jetbrains.kotlin:kotlin-test-junit'
            }
        }
        jsMain { /* ... */ }
        jsTest { /* ... */ }
        mingwMain { /* ... */ }
        mingwTest { /* ... */ }
    }
}
```

</div>

在上面配置的编译目标中, 对产品源代码和测试源代码都有 [默认的源代码集名称](#default-project-layout).
对于所有的编译目标, 源代码集 `commonMain` 和 `commonTest` 分别包含在产品编译和测试编译之中.
注意, 共通源代码集 `commonMain` 和 `commonTest` 只依赖共通库, 特定平台相关的库由这个平台相关的源代码依赖.

关于项目结构以及编译脚本 DSL 的更多细节, 请看后续章节.

## Gradle Plugin

如果想要重头开始设置一个跨平台项目, 首先, 请在你的项目中使用 `kotlin-multiplatform` plugin, 方法是在 `build.gradle` 文件中添加以下代码:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}
```

</div>

这样会在最顶层添加一个 `kotlin` 扩展. 然后你可以在编译脚本中引用它, 以便:

* 对跨平台项目 [设置编译目标](#setting-up-targets) (因为默认不会创建编译目标);
* [设置源代码集](#configuring-source-sets) 以及以及它们的 [依赖项目](#adding-dependencies);

## 设置编译目标

编译目标(target) 是指针对某个特定的 [支持的平台](#supported-platforms) 的一系列编译功能, 包括源代码编译, 测试, 打包.

由于平台是不同的, 因此编译目标不过不同的方式编译, 而且各自带有平台专有的一些设定信息.
Gradle plugin 对支持的平台带有很多预定义的设置.
要在一个编译目标中使用预定义设置, 我们只需要指定它的名称就可以了:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    targets {
        fromPreset(presets.jvm, 'jvm6') // 使用预定义的名称 'jvm6' 来创建一个 JVM 编译目标

        fromPreset(presets.linuxX64, 'linux') {
            /* 你可以在这里对 'linux' 编译目标指定更多的设定项目 */
        }
    }
}
```
</div>

编译目标的编译需要进行一次或多次 Kotlin 编译. 每次 Kotlin 编译可能是为了不同的目的(比如, 编译产品代码, 或测试代码), 也可能处理不同的 [源代码集](#configuring-source-sets).
可以在 DSL 内访问编译目标中的各个 Kotlin 编译, 比如, 可以得到编译任务名称, 依赖项目文件名, 以及编译输出路径:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    targets {
        fromPreset(presets.jvm, 'jvm6') {
            def mainKotlinTaskName = compilations.main.compileKotlinTaskName
            def mainOutputs = compilations.main.output
            def testRuntimeClasspath = compilations.test.runtimeDependencyFiles            
        }
    }
}
```

</div>

如果要对一个编译任务修改它的 [Kotlin 编译器选项](using-gradle.html#compiler-options), 可以通过名称找到这个编译任务:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    targets {
        fromPreset(presets.jvm, 'jvm8') {
            // 配置一个编译目标的编译任务 (main 和 test)
            compilations.all {
                tasks[compileKotlinTaskName].kotlinOptions {
                    jvmTarget = '1.8'
                }
            }
        }

        /* ... */

        // 配置所有编译目标的所有编译任务:
        all {
            compilations.all {
                tasks[compileKotlinTaskName].kotlinOptions {
                    allWarningsAsErrors = true
                }
            }
        }
    }
}
```

</div>

所有的编译目标可能会共用一部分源代码, 也可能在各自的编译任务中处理自己平台独有的源代码.
详情请参见 [配置源代码集](#configuring-source-sets).

有些编译目标可能会需要额外的配置. 以 Android 和 iOS 为例, 请参见教程 [跨平台项目: iOS 和 Android](https://kotlinlang.org/docs/tutorials/native/mpp-ios-android.html).

### 支持的平台

Kotlin 支持以下目标平台, 针对每个目标平台, 都分别预定义了一些编译目标, 可以通过其名称来使用: `fromPreset(presets.<presetName>, '<targetName>')`:

* `jvm` 用于 Kotlin/JVM 平台. 注意: `jvm` 编译目标不会编译 Java 源代码;
* `js` 用于 Kotlin/JS 平台;
* `android` 用于 Android 应用程序和库. 注意, 需要同时使用  Android Gradle plugin;

*  Kotlin/Native 平台的预定义编译目标 (详情请参见后面的 [注意](#using-kotlinnative-targets)):

    * `androidNativeArm32` 和 `androidNativeArm64` 用于 Android NDK 平台;
    * `iosArm32`, `iosArm64`, `iosX64` 用于 iOS 平台;
    * `linuxArm32Hfp`, `linuxMips32`, `linuxMipsel32`, `linuxX64` 用于 Linux 平台;
    * `macosX64` 用于 MacOS 平台;
    * `mingwX64` 用于 Windows 平台;
    * `wasm32` 用于 WebAssembly 平台.

    注意, Kotlin/Native 的一部分编译目标需要针对一个 [适当的目标机器](#using-kotlinnative-targets) 来编译.


## 设置源代码集

Kotlin 源代码集是指一组 Kotlin 源代码, 相关的资源文件, 依赖项目, 以及语言设定,
在一个或多个 [编译目标](#setting-up-targets) 的 Kotlin 编译中, 将会使用到这些源代码集.

如果你使用预定义的编译目标, 那么会默认地创建并配置一些源代码集.
详情请参见 [默认的项目结构](#default-project-layout).

源代码集在 `kotlin { ... }` 扩展的 `sourceSets { ... }` 代码段中进行设置:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    targets { /* ... */ }

    sourceSets {
        foo { /* ... */ } // 创建或设置一个名为 'foo' 的源代码集
        bar { /* ... */ }
    }
}
```
</div>

> 注意: 创建一个源代码集不会将它关联到任何的编译目标. 有些源代码集 [预定义的](#default-project-layout), 因此默认会编译它.
但是, 自定义的源代码集合需要明确地指定它属于哪些编译任务. 详情请参见: [源代码集之间的关联](#connecting-source-sets).
{:.note}

源代码集的名称是大小写敏感的. 引用一个默认的源代码集时, 一定要注意应用的源代码集名称, 前缀要与编译目标的名称一致,
比如, 编译目标 `iosX64` 的主源代码集名称是 `iosX64Main`.

源代码集本身是与平台无关的, 但是如果它只编译到单个平台, 我们可以认为它是与这个平台相关的.
因此, 源代码集可以包括各个平台之间共用的共通代码, 也可以包含平台相关的代码.

要向源代码集添加 Kotlin 源代码目录和资源, 请使用它的 `kotlin`, `resources` `SourceDirectorySet` 属性:

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

### 源代码集之间的关联

Kotlin 源代码集可以通过'依赖' 关系发生连接, 如果源代码集 `foo` 依赖于另一个源代码集 `bar`, 那么:

* 如果针对某个编译目标需要编译 `foo`, 那么 `bar` 也会被编译, 并且输出为同样的编译目标形式, 比如 JVM 平台的 class 文件, 或者 JS 代码;

* `bar` 中的资源会与 `foo` 中的资源一起处理, 复制;

* `foo` 中的源代码可以 '看见' `bar` 中的声明, 包括 `internal` 声明, 也可以 '看见' `bar` 中的 [依赖项目](#adding-dependencies),
  即使是标记为 `implementation` 的依赖项目也可以看见;

* 对于 `bar` 中的预期声明, `foo` 可以包含对应的 [平台相关的实现代码](platform-specific-declarations.html);

* `foo` 与 `bar` 的 [语言设定](#language-settings) 应该保持一致;

源代码集之间的循环依赖是禁止的.

源代码集之间的这些关联关系可以使用源代码集的 DSL 来定义:

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

除[默认的源代码集](#default-project-layout)之外, 自定义创建的源代码集需要明确地加入到依赖关系中, 然后才可以在其他源代码中使用它,
而且更重要的, 比如加入到依赖关系中, 然后它才会被编译.
通常来说, 可以使用 `dependsOn commonMain` 或 `dependsOn commonTest` 语句, 某些默认的平台相关源代码集需要直接或者间接地依赖到自定义源代码集:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    targets {
        fromPreset(presets.mingwX64, 'windows')
        fromPreset(presets.linuxX64, 'linux')
        /* ... */
    }
    sourceSets {
        desktopTest { // 自定义源代码集, 包括针对这两个编译目标的测试程序
            dependsOn commonTest
            /* ... */
        }
        windowsTest { // 默认的测试代码集, 用于编译目标 'windows'
            dependsOn desktopTest
            /* ... */
        }
        linuxTest { // 默认的测试代码集, 用于编译目标 'linux'
            dependsOn desktopTest
        }
        /* ... */
    }
}
```

</div>

### 添加依赖项目

要对源代码集添加依赖项目, 请使用源代码集 DSL 的 `dependencies { ... }` 语句段. 支持 4 种类型的依赖:

* `api` 依赖, 同时用于编译期和运行期, 而且会被导出给你的库的使用者.
  如果在当前模块的 Public API 中使用了从依赖库得到的任何类型, 那么这个类型所属的库必须是 `api` 类型的依赖项目;

* `implementation` 依赖, 同时用于编译期和运行期, 但只供当前模块使用, 而不会暴露给依赖于本模块的其他模块.
  当前模块的内部实现逻辑所需要的依赖项目, 应该使用 `implementation` 类型依赖.
  如果一个模块是一个最终应用程序, 本身不对外公布 API, 那么它应该使用 `implementation` 依赖, 而不是 `api` 依赖.

* `compileOnly` 依赖, 只用于当前模块的编译期, 除此之外, 对于当前模块的运行期, 以及依赖本模块的其他模块的编译期, 这些依赖都不可使用.
  对于运行期使用第三方实现的 API, 应该使用这种这种依赖.

* `runtimeOnly` 依赖, 只在运行期可用, 对任何模块的编译期, 这些依赖都不可使用.

依赖项目以源代码集为单位分别指定, 如下:

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

注意, 为了使 IDE 能够正确解析共通代码的依赖项目, 除了在平台相关源代码集中指定平台相关的依赖项目之外, 共通代码的源代码集还需要指定对应的 Kotlin metadata 依赖项.
通常, 使用公开发布的库时, 需要使用带 `-common` 后缀(比如 `kotlin-stdlib-common`) 或 `-metadata` 后缀的依赖项 (除非它发布时带有 Gradle metadata, 详情请参见下文).

然而, 使用 `project('...')` 依赖到另一个跨平台项目时, 就可以自动解析到正确的依赖项目.
因此, 只需要在一个源代码集的依赖项中使用一个 `project('...')` 依赖就可以了, 只要这个被依赖的项目中包含了兼容的编译目标, 那么包含这个源代码集的编译都会依赖到这个项目中正确的平台相关依赖项.

同样的, 如果使用实验性的 [Gradle metadata 发布模式](#experimental-metadata-publishing-mode) 发布一个跨平台库, 并且使用这个库的项目也设置为使用 metadata,
那么只需要对共通源代码集指定一次依赖项就足够了.
否则, 对每一个平台相关的源代码集, 除了需要依赖到共通模块之外, 还需要依赖库中对应平台的模块, 就象上面的示例那样.

另外一种方式是, 在最顶层使用 Gradle 内建的 DSL, 通过 `<sourceSetName><DependencyKind>` 格式的配置名称来指定依赖项目:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
dependencies {
    commonMainApi 'com.example:foo-common:1.0'
    jvm6MainApi 'com.example:foo-jvm6:1.0'
}
```

</div>

### 语言设置

源代码集的语言设置可以通过以下方式指定:

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

也可以一次性指定所有源代码集的语言设置:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin.sourceSets.all {
    languageSettings {
        progressiveMode = true
    }
}
```

</div>


源代码集的语言设置会影响到 IDE 解析源代码的方式. 由于目前的限制, 在 Gradle 编译中, 只会使用编译任务的默认源代码集的语言设置.

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
* 对每个 Android 编译目标中的每个 Android 变体, 创建一个编译任务;

对于每个编译任务, 都有一个默认的源代码集, 名称是 `<targetName><CompilationName>`.
这个默认的源代码集会参与编译, 因此应该使用它来编写平台相关的代码, 以及指定平台相关的依赖项, 还可以通过它来添加源代码集之间的'依赖', 来将其他源代码集加入到编译任务中.
比如, 如果一个项目包含 `jvm6` (JVM) 和 `nodeJs` (JS) 编译目标, 那么将包括以下源代码集: `commonMain`, `commonTest`, `jvm6Main`, `jvm6Test`, `nodeJsMain`, `nodeJsTest`.

大多数使用场景只需要通过默认的源代码集就可以解决了, 不必使用自定义的源代码集.

每个源代码集的默认设置是, Kotlin 源代码放在 `src/<sourceSetName>/kotlin` 文件夹下, 资源文件放在 `src/<sourceSetName>/resources` 文件夹下.

在 Android 项目中, 还会对每个 Android 源代码集创建 Kotlin 源代码集. 如果 Android 编译目标的名称是 `foo`, 那么 Android 源代码集 `bar` 会产生一个对应的 Kotlin 源代码集, 名为 `fooBar`. 但是 Kotlin 编译任务可以从所有的 `src/bar/java`, `src/bar/kotlin`, 和 `src/fooBar/kotlin` 目录中得到 Kotlin 源代码. 而 Java 源代码只会从 `src/bar/java` 目录得到.

## 运行测试程序

目前在 JVM, Android, Linux, Windows 和 macOS 平台上, 默认支持在 Gradle 编译脚本中运行测试程序;
对于 JS 以及其他 Kotlin/Native 编译目标, 需要手工配置, 以便使用适当的环境运行来测试程序, 比如使用模拟器, 或者测试框架.

对每个可以进行测试的编译目标, 都会生成测试任务, 名称是 `<targetName>Test`. 执行 `check` 任务, 可以对所有的编译目标运行测试程序.

由于 `commonTest` 任务的 [默认源代码集](#default-project-layout) 被添加到了所有的测试任务中, 因此可以在这里添加那些需要在所有的目标平台上运行的测试程序和测试工具.

跨平台测试可以使用 [`kotlin.test` API](https://kotlinlang.org/api/latest/kotlin.test/index.html). 对 `commonTest` 添加 `kotlin-test-common` 和 `kotlin-test-annotations-common` 依赖项, 就可以在共通的测试代码中使用 `DefaultAsserter` 和 `@Test`/`@Ignore`/`@BeforeTest`/`@AfterTest` 注解.

对于 JVM 编译目标, 应该添加 `kotlin-test-junit` 或 `kotlin-test-testng` 依赖项, 来使用对应的断言函数和注解.

对于 Kotlin/JS 编译目标, 应该添加 `kotlin-test-js` 作为测试依赖项. 目前来说, 会创建 Kotlin/JS 的测试任务, 但默认不会运行; 需要手工配置这些测试任务, 以便使用适当的 JavaScript 测试框架来运行来测试程序.

Kotlin/Native 编译目标不需要添加额外的测试依赖项, `kotlin.test` API 的实现是默认附带的.

## 发布跨平台的库

> 跨平台库的作者可以定义一组目标平台, 这些目标平台都应该提供这个库所需要的所有平台相关实现.
> 作为库的使用者, 不允许对一个跨平台的库添加新的目标平台.
{:.note}

通过跨平台项目编译得到的库, 可以使用 `maven-publish` plugin 发布到 Maven 仓库, 这个 plugin 可以通过以下方法引入:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    /* ... */
    id 'maven-publish'
}
```

</div>

引入这个 plugin 之后, 会对所有能够在当前机器上编译的目标平台创建默认的发布任务. 但是需要对当前项目设置 `group` 和 `version` 属性.
库文件 ID 使用的命名方式是 `<projectName>-<targetNameToLowerCase>`, 比如对 `sample-lib` 项目的 `nodeJs` 编译目标, 发布的库文件名为 `sample-lib-nodejs`.

此外还会默认创建一个额外的发布任务, 其中包含序列化后的 Kotlin 声明信息, 将被 IDE 用来分析跨平台库.

默认情况下, 对每个发布任务, 除库文件之外, 还会包含源代码 JAR 文件. 源代码 JAR 文件包含编译目标的 `main` 编译任务中用到的源代码文件.

可以修改 Maven 仓库中的发布位置, 也可以对发布任务添加新的库文件, 方法是在 `targets { ... }` 代码段中进行如下设置:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    targets {
        fromPreset(presets.jvm, 'jvm6') {
            /* ... */
            mavenPublication {
                artifactId = 'sample-lib-jvm'
                artifact(jvmJavadocJar)
            }
        }
    }
}
```

</div>

### 元数据发布模式(metadata publishing mode) (实验性功能)

在根项目的 `settings.gradle` 文件中添加 `enableFeaturePreview('GRADLE_METADATA')` 设置项, 可以对库的发布和依赖计算启用 Gradle metadata 模式, 这个功能目前还是实验性的.
使用 Gradle metadata 模式时, 会添加一个新的发布任务, 这个任务会引用所有的编译目标的发布任务作为它的变体. 这个发布任务的库文件名与项目名相同.

> Gradle metadata 发布模式是 Gradle 的一个实验性功能, 不保证向后兼容性.
如果一个库使用当前版本的 Gradle metadata 模式发布, 那么 Gradle 的未来版本可能会无法解析对这个库的依赖.
在这个功能稳定之前, 建议库的作者只使用这个模式来发布库的实验性的版本, 同时使用稳定的发布机制来发布库的正式版本.
{:.note}

如果一个库使用 Gradle metadata 模式发布, 并且库的使用这也启用了这个模式, 那么库的使用者可以在一个共通源代码集中只指定一次对这个库的依赖, 然后它的各平台的编译目标都可以自动选择到这个库在对应的平台上的依赖项目.
比如, 一个 `sample-lib` 库针对 JVM 和 JS 进行编译, 并使用 Gradle metadata 模式发布.
那么使用者只需要添加 `enableFeaturePreview('GRADLE_METADATA)` 设定项, 然后添加一次依赖项:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    targets {
        fromPreset(presets.jvm, 'jvm6')
        fromPreset(presets.js, 'nodeJs')
    }
    sourceSets {
        commonMain {
            dependencies {
                api 'com.example:sample-lib:1.0'
                // 对 JVM 平台的编译目标, 这个依赖项会解析为 `sample-lib-jvm`, 对 JS 平台, 会解析为 `sample-lib-js`
            }
        }
    }
}
```

</div>    

### 对编译目标消除歧义

在跨平台的库中, 对单个目标平台有可能存在多个编译目标.
比如, 这些编译目标可能提供相同的 API, 但在运行期使用不同的库来实现, 比如可以选择不同的测试框架, 或日志输出框架.

但是, 对这样的跨平台的库的依赖可能会发生歧义, 因此在某些条件下会导致解析失败:

* 如果对跨平台库使用了 `project('...')` 依赖. 请改用 `project(path: '...', configuration: '...')` 依赖.
  这里需要使用适当的编译目标的运行期元素配置, 比如 `jvm6RuntimeElements`.
  由于目前存在的限制, 这个依赖项需要放在顶层的 `dependencies { ... }` 代码段内部, 而不能放在一个源代码集的依赖项设定中.

* 如果依赖了一个已发布的库. 如果库使用实验性的 Gradle metadata 模式发布, 你仍然把对这个库的单一依赖项替换为具体的某个目标模块的依赖, 就像这个库没有使用 Gradle metadata 那样.

* 对以上两种情况, 都可以使用另外一个解决方法, 就是对编译目标标记一个自定义属性. 但是, 必须在库的作者和使用者双方都进行同样的标记, 而且库的作者需要负责维护这个属性值, 并公布给使用者;

     请在库本身的项目和使用库的项目中都加入以下内容, 然后库的使用者就可以通过这个属性来指定它使用的那个编译目标:

     <div class="sample" markdown="1" theme="idea" mode='groovy'>

     ```groovy
     def testFrameworkAttribute = Attribute.of('com.example.testFramework', String)

     kotlin {
         targets {
             fromPreset(presets.jvm, 'junit') {
                 attributes.attribute(testingFrameworkAttribute, 'junit')
             }
             fromPreset(presets.jvm, 'testng') {
                 attributes.attribute(testingFrameworkAttribute, 'testng')
             }
         }
     }
     ```

     </div>

## 使用 Kotlin/Native 编译目标

注意, 某些 [Kotlin/Native 编译目标](#supported-platforms) 可能只能在适当的机器上编译:

* Linux 编译目标可能只能在 Linux 主机上编译;
* Windows 编译目标需要 Windows 主机;
* macOS 和 iOS 编译目标只能在 macOS 主机上编译;
* Android Native 编译目标需要 Linux 或 macOS 主机;

在编译时, 当前主机不能支持的编译目标会被忽略, 因此也不会发布. 库的作者可能希望根据库的目标平台的需要来设置编译脚本, 并通过不同的主机来发布.

### Kotlin/Native 的输出类型

Kotlin/Native 编译目标默认会被编译输出为 `*.klib` 库文件, 这种库文件可以被 Kotlin/Native 用作依赖项, 但它不能运行, 也不能被用作一个原生的库.

除 Kotlin/Native 库文件之外, 如果还想链接输出其它二进制文件, 请添加一个或多个 `outputKinds`, 允许的值包括:

* `executable`, 用于输出可执行程序;
* `dynamic`, 用于输出动态链接库;
* `static`, 用于输出静态库;
* `framework`, 用于输出 Objective-C 框架 (只对 macOS 和 iOS 编译目标支持这种输出)

输出类型的添加方法如下:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {
    targets {
        fromPreset(presets.linuxX64, 'linux') {
            compilations.main.outputKinds 'executable' // 这里可以选择 'static', 'dynamic'
        }
    }
}
```

</div>

这段代码会创建新的链接任务, 包括 debug 版和 release 版的二进制文件. 这些链接任务可以在项目的编译任务中访问, 比如, `getLinkTask('executable', 'release')` 或者 `getLinkTaskName('static', 'debug')`.
要得到二进制文件, 可以使用 `getBinary`, 比如, `getBinary('executable', 'release')` 或者 `getBinary('static', 'debug')`.

### 对 CInterop 的支持

由于 Kotlin/Native 提供了 [与原生语言的交互能力](native/c_interop.html), 因此编译脚本中也提供了一种 DSL 用来为编译任务配置这个功能.

编译任务可以与几种不同的原生语言交互. 在编译任务的 `cinterops` 代码段中可以配置与每种语言的交互能力:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
// 在 Kotlin/Native 编译目标的编译任务内:
cinterops {
    myInterop {
        // 指定描述原生 API 的 def 文件.
        // 默认路径是 src/nativeInterop/cinterop/<interop-name>.def
        defFile project.file("def-file.def")

        // 指定用来放置生成的 Kotlin API 的包.
        packageName 'org.sample'

        // 指定通过 cinterop 工具传递给编译器的参数.
        compilerOpts '-Ipath/to/headers'

        // 指定用来查找头文件的目录.
        includeDirs {
            // 指定用来查找头文件的目录 (等价于编译器的 -I<path> 参数).
            allHeaders 'path1', 'path2'

            // 用来查找 def 文件的 'headerFilter' 参数中指定的头文件时使用的额外的目录.
            // 等价于 -headerFilterAdditionalSearchPrefix 命令行参数.
            headerFilterOnly 'path1', 'path2'
        }
        // includeDirs.allHeaders 的缩写方式.
        includeDirs "include/directory", "another/directory"
    }

    anotherInterop { /* ... */ }
}
```
</div>

对于使用到原生库的二进制输出文件, 经常会需要指定编译目标特定的链接参数.
可以使用 Kotlin/Native 编译任务的 `linkerOpts` DSL 方法来实现:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
compilations.main {
    linkerOpts '-L/lib/search/path -L/another/search/path -lmylib'
}
```
</div>
