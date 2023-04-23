---
type: doc
layout: reference
title: "添加跨平台库依赖项"
---

# 添加跨平台库依赖项

最终更新: {{ site.data.releases.latestDocDate }}

每个应用程序都需要一组库才能正常工作.
一个 Kotlin Multiplatform 项目可以依赖于可以在所有平台工作的跨平台库, 平台相关的库, 还可以依赖于其他跨平台项目.

要在一个库中添加依赖项, 需要更新你的项目的 `shared` 目录中的 `build.gradle(.kts)` 文件.
在 [`dependencies`](multiplatform-dsl-reference.html#dependencies) 代码段内,
设置必要 [类型](../gradle/gradle-configure-project.html#dependency-types) 的依赖项 (比如, `implementation`):

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("com.example:my-library:1.0") // 对所有源代码集共用的库
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'com.example:my-library:1.0'
            }
        }
    }
}
```

</div>
</div>

或者, 你也可以 [在最顶层设置依赖项](../gradle/gradle-configure-project.html#set-dependencies-at-the-top-level).

## 对 Kotlin 库的依赖项

### 标准库

对每个源代码集(Source Set), 会自动添加对标准库 (`stdlib`) 的依赖项.
标准库的版本与 `kotlin-multiplatform` 版本相同.

对于与平台相关的源代码集, 会使用针对这个平台的标准库, 同时, 对其他源代码集会添加共通的标准库.
Kotlin Gradle plugin 会根据你的 Gradle 构建脚本的
`compilerOptions.jvmTarget` [编译器选项](../gradle/gradle-compiler-options.html) 设置,
选择适当的 JVM 标准库.

详情请参见 [如何改变默认设置](../gradle/gradle-configure-project.html#dependency-on-the-standard-library).

### 测试库

跨平台的测试程序可以使用 [`kotlin.test` API](https://kotlinlang.org/api/latest/kotlin.test/).
当你 [创建跨平台项目](multiplatform-library.html) 时, 对共通源代码集和平台相关的源代码集, 项目创建向导会自动添加测试库依赖项.

如果创建项目时没有使用项目创建向导, 你也可以 [手动添加依赖项](../gradle/gradle-configure-project.html#set-dependencies-on-test-libraries).

## kotlinx 库

如果使用跨平台的库, 并且需要 [依赖共用代码](#library-shared-for-all-source-sets), 只需要在共用源代码集中一次性设置依赖项.
请使用库的基本 artifact 名(base artifact name) – 比如 `kotlinx-coroutines-core`.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}")
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">
```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}'
            }
        }
    }
}
```

</div>
</div>

如果使用 kotlinx 库, 并且需要 [与平台相关的依赖项](#library-used-in-specific-source-sets), 那么可以通过 `-jvm` 或 `-js` 之类的后缀,
来指定与平台相关的库版本, 比如, `kotlinx-coroutines-core-jvm`.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:{{ site.data.releases.latest.coroutines.version }}")
            }
        }
    }
}

```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin {
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:{{ site.data.releases.latest.coroutines.version }}'
            }
        }
    }
}
```

</div>
</div>

## 对 Kotlin 跨平台库的依赖项

对于使用了 Kotlin Multiplatform 技术的库, 比如 [SQLDelight](https://github.com/cashapp/sqldelight),
你可以将它添加为依赖项.
关于在你的项目中如何添加这些依赖项, 这些库的作者通常会提供指南.

参见 [由社区维护的 Kotlin Multiplatform 库列表](https://libs.kmp.icerock.dev/).

### 对所有源代码集共用的库

如果你想要在所有的源代码集中使用一个库, 你可以只在共通源代码集中添加它.
Kotlin Multiplatform Mobile plugin 会对所有其他源代码集自动添加对应的依赖项.

> 在共通源代码集中, 不可以设置对平台相关库的依赖项.
{:.warning}

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("io.ktor:ktor-client-core:{{ site.data.releases.ktorVersion }}")
            }
        }
        val androidMain by getting {
            dependencies {
                // 对 ktor-client 库的平台相关部分的依赖项, 会自动添加
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'io.ktor:ktor-client-core:{{ site.data.releases.ktorVersion }}'
            }
        }
        androidMain {
            dependencies {
                // 对 ktor-client 库的平台相关部分的依赖项, 会自动添加
            }
        }
    }
}
```

</div>
</div>

### 在特定源代码集中使用的库

如果你只想对特定的源代码集使用一个跨平台库, 你可以只在这些源代码集中添加它的依赖项.
特定库中的声明, 将只能在这些源代码集中使用.

> 这种情况下不要使用平台相关的名称, 比如下面示例中的 SQLDelight `native-driver`. 请到库的文档中查找确切的名称.
{:.note}

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                // kotlinx.coroutines 可以在所有源代码集中使用
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}")
            }
        }
        val androidMain by getting {
            dependencies {}
        }
        val iosMain by getting {
            dependencies {
                // SQLDelight 只在 iOS 源代码集中可以使用, 但在 Android 源代码集或共通源代码集不可使用
                implementation("com.squareup.sqldelight:native-driver:{{ site.data.releases.sqlDelightVersion }}")
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                // kotlinx.coroutines 可以在所有源代码集中使用
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}'
            }
        }
        androidMain {
            dependencies {}
        }
        iosMain {
            dependencies {
                // SQLDelight 只在 iOS 源代码集中可以使用, 但在 Android 源代码集或共通源代码集不可使用
                implementation 'com.squareup.sqldelight:native-driver:{{ site.data.releases.sqlDelightVersion }}'
            }
        }
    }
}
```

</div>
</div>

> 如果在一个支持层级结构的跨平台项目中, 使用一个不支持 [层级结构](multiplatform-share-on-platforms.html#share-code-on-similar-platforms) 的跨平台库,
> 那么对于共用的 iOS 源代码集, 你将不能使用某些 IDE 功能, 比如代码完成与高亮度显示.
>
> 这是一个 [已知的问题](https://youtrack.jetbrains.com/issue/KT-40975), 我们正在解决.
> 目前, 你可以使用 [这个变通办法](../multiplatform-mobile/multiplatform-mobile-ios-dependencies.html#workaround-to-enable-ide-support-for-the-shared-ios-source-set).
{:.note}

## 对其他跨平台项目的依赖项

你可以将一个跨平台项目作为另一个项目的依赖项. 要实现这个目的, 只需要简单的向需要的源代码集添加一个项目依赖项.
如果你想要在所有源代码集中使用一个依赖项, 请将它添加到共通源代码集.
这种情况下, 其他源代码集将会自动得到对应的版本.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(project(":some-other-multiplatform-module"))
            }
        }
        val androidMain by getting {
            dependencies {
                // :some-other-multiplatform-module 的平台相关部分, 会自动添加
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation project(':some-other-multiplatform-module')
            }
        }
        androidMain {
            dependencies {
                // :some-other-multiplatform-module 的平台相关部分, 会自动添加
            }
        }
    }
}
```

</div>
</div>

## 下一步做什么?

查看跨平台项目中添加依赖项的其他资料, 并学习以下内容:

* [添加 Android 依赖项](../multiplatform-mobile/multiplatform-mobile-android-dependencies.html)
* [添加 iOS 依赖项](../multiplatform-mobile/multiplatform-mobile-ios-dependencies.html)
