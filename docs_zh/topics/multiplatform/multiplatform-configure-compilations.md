[//]: # (title: 配置编译任务)

Kotlin 跨平台项目使用编译任务来生成 artifact.
每个编译目标可以有一个或多个编译任务, 比如, 用于产品和测试的编译任务.

对每个编译目标, 默认的编译任务包括:

* 对于 JVM, JS, 和 Native 编译目标: `main` 和 `test` 编译任务.
* 对于 Android 编译目标: 每个 [Android 构建变体(build variant)](https://developer.android.com/studio/build/build-variants) 一个 [编译任务](#compilation-for-android).

![编译任务](compilations.svg)

如果需要编译除产品代码与单元测试之外的其他代码, 比如, 集成测试, 或性能测试,
你可以 [创建自定义编译任务](#create-a-custom-compilation).

你可以在以下范围配置如何产生 artifact:

* [对所有编译任务](#configure-all-compilations): 可以在你的项目中一次性设置.
* [对单个编译目标的编译任务](#configure-compilations-for-one-target): 因为一个编译目标可以有多个编译任务.
* [对一个指定的编译任务](#configure-one-compilation).

请参见对所有编译目标或特定编译目标可用的
[编译任务参数列表](multiplatform-dsl-reference.md#compilation-parameters)
和 [编译器选项](gradle-compiler-options.md).

## 配置所有编译任务 {id="configure-all-compilations"}

下面的示例对所有的编译目标配置一个共用的编译器选项:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

## 配置单个编译目标的编译任务 {id="configure-compilations-for-one-target"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_1_8)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilerOptions {
            jvmTarget = JvmTarget.JVM_1_8
        }
    }
}
```

</tab>
</tabs>

## 配置一个编译任务 {id="configure-one-compilation"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compilerOptions.configure {
                jvmTarget.set(JvmTarget.JVM_1_8)
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
        compilations.main {
            compilerOptions.configure {
                jvmTarget = JvmTarget.JVM_1_8
            }
        }
    }
}
```

</tab>
</tabs>

## 创建自定义编译任务 {id="create-a-custom-compilation"}

如果需要编译除产品代码与单元测试之外的其他代码, 比如, 集成测试, 或性能测试, 请创建自定义编译任务.

比如, 要对 `jvm()` 编译目标的集成测试创建自定义编译任务, 请向 `compilations` 集合内添加新的元素.

> 对于自定义编译任务, 需要手动设置所有的依赖项.
> 自定义编译任务的默认源代码集不会依赖 `commonMain` 和 `commonTest` 源代码集.
>
{style="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm() {
        compilations {
            val main by getting

            val integrationTest by compilations.creating {
                defaultSourceSet {
                    dependencies {
                        // 使用 main 编译任务的编译期类路径和输出进行编译:
                        implementation(main.compileDependencyFiles + main.output.classesDirs)
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }

                // 创建 test 任务来运行这个编译任务产生的测试:
                tasks.create<Test>("integrationTest") {
                    // 运行测试使用的类路径包含:
                    // 编译期依赖项(包括 'main'), 运行时依赖项, 以及这个编译任务的输出:
                    classpath = compileDependencyFiles + runtimeDependencyFiles + output.allOutputs

                    // 只运行这个编译任务的输出中包含的测试:
                    testClassesDirs = output.classesDirs
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
    jvm() {
        compilations.create('integrationTest') {
            defaultSourceSet {
                dependencies {
                    def main = compilations.main
                    // 使用 main 编译任务的编译期类路径和输出进行编译:
                    implementation(main.compileDependencyFiles + main.output.classesDirs)
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }

            // 创建 test 任务来运行这个编译任务产生的测试:
            tasks.create('jvmIntegrationTest', Test) {
                // 运行测试使用的类路径包含:
                // 编译期依赖项(包括 'main'), 运行时依赖项, 以及这个编译任务的输出:
                classpath = compileDependencyFiles + runtimeDependencyFiles + output.allOutputs

                // 只运行这个编译任务的输出中包含的测试:
                testClassesDirs = output.classesDirs
            }
        }
    }
}
```

</tab>
</tabs>

对于其他情况也需要创建自定义编译任务, 比如, 如果希望在你的最终 artifact 中对不同的 JVM 版本组合编译任务,
或者已经在 Gradle 中设置过源代码集, 希望迁移到跨平台项目.

## 在 JVM 编译任务中使用 Java 源代码 {id="use-java-sources-in-jvm-compilations"}

使用 [项目向导](https://kmp.jetbrains.com/) 创建项目时, Java 源代码会包含在 JVM 编译任务内.

在构建脚本中, 以下代码会应用 Gradle `java` plugin, 并配置编译目标, 使其与 `java` plugin 协作:

```kotlin
kotlin {
    jvm {
        withJava()
    }
}
```

Java 源代码文件 放在 Kotlin 源代码根路径的子目录之内. 比如, 路径是:

![Java 源代码文件](java-source-paths.png){width=200}

共通源代码集不可以包含 Java 源代码.

由于目前的限制, Kotlin plugin 会替换 Java plugin 配置的某些任务:

* 使用编译目标的 JAR 任务, 而不是 `jar` 任务 (比如, `jvmJar`).
* 使用编译目标的 test 任务, 而不是 `test` 任务 (比如, `jvmTest`).
* 资源由编译任务中的同等任务处理, 而不是 `*ProcessResources` 任务.

这个编译目标的发布由 Kotlin plugin 处理, 而且不需要 Java plugin 的具体步骤.

## 配置与原生语言的交互 {id="configure-interop-with-native-languages"}

Kotlin 提供 [与原生语言的交互能力](native-c-interop.md), 以及对编译任务进行相关配置的 DSL.

| 原生语言                   | 支持的平台                                | 备注                                   |
|------------------------|--------------------------------------|--------------------------------------|
| C                      | 所有平台, WebAssembly 除外                 |                                      |
| Objective-C            | Apple 平台 (macOS, iOS, watchOS, tvOS) |                                      |
| 经由 Objective-C 的 Swift | Apple 平台 (macOS, iOS, watchOS, tvOS) | Kotlin 只能使用 `@objc` 属性标注过的 Swift 声明. |

编译任务可以与几个原生库交互. 
可以使用 [定义文件](native-definition-file.md) 中的属性,
或者你的构建文件的 [`cinterops` 代码段](multiplatform-dsl-reference.md#cinterops) 中的属性,
来配置交互能力:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // 请替换为你需要的编译目标.
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // 描述原生 API 的 def 文件.
                // 默认路径是 src/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))

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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64 { // 请替换为你需要的编译目标.
        compilations.main {
            cinterops {
                myInterop {
                    // 描述原生 API 的 def 文件.
                    // 默认路径是 src/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")

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

</tab>
</tabs>

## Android 编译任务 {id="compilation-for-android"}

对 Android 编译目标默认创建的编译任务会与 [Android 构建变体(build variant)](https://developer.android.com/studio/build/build-variants) 绑定:
对每个构建变体, 会创建一个相同名称的 Kotlin 编译任务.

然后, 对每个构建变体编译的每个 [Android 源代码集](https://developer.android.com/studio/build/build-variants#sourcesets),
会创建 Kotlin 源代码集, 名称是 Android 源代码集名前面加上编译目标名,
比如, 对于 Kotlin 编译目标 `androidTarget`, 以及 Android 源代码集 `debug`, 对应的 Kotlin 源代码集名为 `androidDebug`.
这些 Kotlin 源代码集会被添加到对应的构建变体的编译任务中.

默认的源代码集 `commonMain` 会被添加到所有的产品构建变体(无论是应用程序还是库) 的编译任务中.
类似的, 源代码集 `commonTest`, 会被添加到单元测试(Unit Test)和设备测试(Instrumented Test)的构建变体中.

也支持使用 [kapt](kapt.md) 的注解处理,
但是由于目前的限制, 要求在配置 `kapt` 依赖项之前创建 Android 编译目标,
因此需要使用顶级的 `dependencies {}` 代码段, 而不是使用 Kotlin 源代码集的依赖项配置语法.

```kotlin
kotlin {
    androidTarget { /* ... */ }
}

dependencies {
    kapt("com.my.annotation:processor:1.0.0")
}
```

## 源代码集层级结构的编译任务 {id="compilation-of-the-source-set-hierarchy"}

Kotlin 可以使用 `dependsOn` 关系来创建 [源代码集层级结构](multiplatform-share-on-platforms.md#share-code-on-similar-platforms).

![源代码集层级结构](jvm-js-main.svg)

如果源代码集 `jvmMain` 依赖源代码集 `commonMain`, 那么:

* 对某个编译目标, 当 `jvmMain` 被编译时, `commonMain` 也会参与这个编译任务,
而且也会被编译称为同一个编译目标的二进制形式, 比如 JVM class 文件.
* `jvmMain` 的源代码可以 '看见' `commonMain` 的声明, 包括内部声明,
也能看见 `commonMain` 的 [依赖项](multiplatform-add-dependencies.md), 即使是标记为 `implementation` 的依赖项.
* `jvmMain` 可以包含 `commonMain` 的 [预期声明(expected declaration)](multiplatform-expect-actual.md) 的平台相关的实现.
* `commonMain` 的资源会与 `jvmMain` 的资源一起处理, 复制.
* `jvmMain` 和 `commonMain` 的 [语言设置](multiplatform-dsl-reference.md#language-settings) 应该保持一致.

语言设置的一致性检查规则是:
* `jvmMain` 的 `languageVersion` 设置应该高于或等于 `commonMain` 的设置.
* `commonMain` 启用的所有非稳定的语言特性, `jvmMain` 都应该启用 (对于 bugfix 特性没有这个要求).
* `commonMain` 使用的所有实验性注解, `jvmMain` 都应该使用.
* `apiVersion`, bugfix 语言特性, 以及 `progressiveMode` 可以任意设定.

## 配置 Gradle 中的隔离项目(Isolated Project)功能  {id="configure-isolated-projects-feature-in-gradle"}

> 这个功能是 [实验性功能](components-stability.md#stability-levels-explained), 目前在 Gradle 中处于 Alpha 之前的状态.
> 请注意, 只能在 Gradle 或更高版本中使用, 并且只为评估目的来使用这个功能.
> 它随时有可能变更或被删除.
> 希望你能通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 提供你的反馈意见.
> 需要使用者同意(Opt-in) (详情见下文).
>
{style="warning"}

Gradle 提供了 [隔离项目(Isolated Project)](https://docs.gradle.org/current/userguide/isolated_projects.html) 功能,
能够通过 "隔离(isolate)" 各个项目类提高构建性能.
这个功能分离各个项目的构建脚本和插件, 让它们能够安全的并行运行.

要启用这个功能, 请按照 Gradle 的指示 [设置系统属性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it).

在 Gradle 中启用隔离项目之前, 如果你想要检查兼容性, 你可以使用新的 Kotlin Gradle plugin 模型测试你的项目.
请向你的 `gradle.properties` 文件添加以下 Gradle 属性:

```none
kotlin.kmp.isolated-projects.support=enable
```

如果你决定以后再启用隔离项目功能, 请记得删除这个 Gradle 属性.
Kotlin Gradle plugin 会直接适用和管理这个 Gradle 属性.

关于隔离项目功能, 详情请参见 [Gradle 的文档](https://docs.gradle.org/current/userguide/isolated_projects.html).
