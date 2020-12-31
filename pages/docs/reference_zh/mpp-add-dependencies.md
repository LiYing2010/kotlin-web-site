---
type: doc
layout: reference
title: "添加依赖项"
---

# 添加依赖项

要在一个库中添加依赖项, 需要在 source set DSL 中的 `dependencies` 代码段内,
设置必要 [类型](using-gradle.html#dependency-types) 的依赖项 (比如, `implementation`).

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

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("com.example:my-library:1.0")
            }
        }
    }
}
```

</div>
</div>

或者, 你也可以 [在最顶层设置依赖项](using-gradle.html#set-dependencies-at-the-top-level).

## 对标准库的依赖项

对每个源代码集(Source Set), 会自动添加对标准库 (`stdlib`) 的依赖项.
标准库的版本与 `kotlin-multiplatform` 版本相同.

对于与平台相关的源代码集, 会使用针对这个平台的标准库, 同时, 对其他源代码集会添加共通的标准库.
Kotlin Gradle plugin 会根据你的 Gradle 构建脚本的
`kotlinOptions.jvmTarget` [编译器选项](using-gradle.html#compiler-options) 设置, 选择适当的 JVM 标准库.

详情请查看 [如何改变默认设置](using-gradle.html#dependency-on-the-standard-library).

## 设置对测试库的依赖项

跨平台的测试程序可以使用 [`kotlin.test` API](../../api/latest/kotlin.test/index.html).
当你 [创建跨平台项目](mpp-create-lib.html) 时, 对共通源代码集和平台相关的源代码集, 项目创建向导会自动添加测试库依赖项.

如果创建项目时没有使用项目创建向导, 你也可以 [手动添加依赖项](using-gradle.html#set-dependencies-on-test-libraries).

## 设置对 kotlinx 库的依赖项

如果使用 kotlinx 库, 并且需要与平台相关的依赖项, 那么可以通过 `-jvm` 或 `-js` 之类的后缀,
来指定与平台相关的库版本, 比如, `kotlinx-coroutines-core-jvm`.
也可以使用库的基本 artifact 名(base artifact name) – `kotlinx-coroutines-core`.

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

如果使用跨平台的库, 并且需要依赖共用代码,  那么只需要在共用源代码集中一次性设置依赖项.
请使用库的基本 artifact 名(base artifact name), 比如 `kotlinx-coroutines-core` 或 `ktor-client-core`.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

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

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

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
