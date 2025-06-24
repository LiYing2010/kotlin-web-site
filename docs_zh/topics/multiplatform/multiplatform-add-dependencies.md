[//]: # (title: 添加跨平台库依赖项)

每个应用程序都需要一组库才能正常工作.
一个 Kotlin Multiplatform 项目可以依赖于可以在所有平台工作的跨平台库, 平台相关的库, 还可以依赖于其他跨平台项目.

要在一个库中添加依赖项, 需要更新你的项目包含共用代码的目录中的 `build.gradle(.kts)` 文件.
在 [`dependencies {}`](multiplatform-dsl-reference.md#dependencies) 代码段内,
设置必要 [类型](gradle-configure-project.md#dependency-types) 的依赖项 (比如, `implementation`):

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0") // 对所有源代码集共用的库
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

或者, 你也可以 [在最顶层设置依赖项](gradle-configure-project.md#set-dependencies-at-top-level).

## 对 Kotlin 库的依赖项 {id="dependency-on-a-kotlin-library"}

### 标准库

对每个源代码集(Source Set), 会自动添加对标准库 (`stdlib`) 的依赖项.
标准库的版本与 `kotlin-multiplatform` 版本相同.

对于与平台相关的源代码集, 会使用针对这个平台的标准库, 同时, 对其他源代码集会添加共通的标准库.
Kotlin Gradle plugin 会根据你的 Gradle 构建脚本的
`compilerOptions.jvmTarget` [编译器选项](gradle-compiler-options.md) 设置,
选择适当的 JVM 标准库.

详情请参见 [如何改变默认设置](gradle-configure-project.md#dependency-on-the-standard-library).

### 测试库

对于跨平台的测试, 可以使用 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API.
当你创建跨平台项目时, 你可以在 `commonTest` 中使用一个依赖项, 对所有的源代码集添加测试依赖项:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // 会自动引入所有的平台依赖项
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // 会自动引入所有的平台依赖项
            }
        }
    }
}
```

</tab>
</tabs>

## kotlinx 库

如果使用跨平台的库, 并且需要 [依赖共用代码](#library-shared-for-all-source-sets), 只需要在共用源代码集中一次性设置依赖项.
请使用库的基本 artifact 名(base artifact name) – 比如 `kotlinx-coroutines-core`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

如果在 [平台相关的依赖项](#library-used-in-specific-source-sets) 中需要 kotlinx 库,
也可以在对应的平台源代码集中使用库的基本 artifact 名(base artifact name):

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        jvmMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

## 对 Kotlin 跨平台库的依赖项

对于使用了 Kotlin Multiplatform 技术的库, 比如 [SQLDelight](https://github.com/cashapp/sqldelight),
你可以将它添加为依赖项.
关于在你的项目中如何添加这些依赖项, 这些库的作者通常会提供指南.

> 请到 [JetBrains 的检索平台](https://klibs.io/) 查找 Kotlin Multiplatform 库.
>
{style="tip"}

### 对所有源代码集共用的库 {id="library-shared-for-all-source-sets"}

如果你想要在所有的源代码集中使用一个库, 你可以只在共通源代码集中添加它.
Kotlin Multiplatform Mobile plugin 会对所有其他源代码集自动添加对应的依赖项.

> 在共通源代码集中, 不可以设置对平台相关库的依赖项.
>
{style="warning"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("io.ktor:ktor-client-core:%ktorVersion%")
        }
        androidMain.dependencies {
            // 对 ktor-client 库的平台相关部分的依赖项, 会自动添加
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'io.ktor:ktor-client-core:%ktorVersion%'
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

</tab>
</tabs>

### 在特定源代码集中使用的库 {id="library-used-in-specific-source-sets"}

如果你只想对特定的源代码集使用一个跨平台库, 你可以只在这些源代码集中添加它的依赖项.
特定库中的声明, 将只能在这些源代码集中使用.

> 这种情况下请使用库的通用名称, 而不要使用平台相关的名称,
> 比如对下面示例中的 SQLDelight, 请使用 `native-driver`, 而不要使用 `native-driver-iosx64`.
> 请到库的文档中查找确切的名称.
>
{style="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            // kotlinx.coroutines 可以在所有源代码集中使用
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
        androidMain.dependencies {

        }
        iosMain.dependencies {
            // SQLDelight 只在 iOS 源代码集中可以使用, 但在 Android 源代码集或共通源代码集不可使用
            implementation("com.squareup.sqldelight:native-driver:%sqlDelightVersion%")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                // kotlinx.coroutines 可以在所有源代码集中使用
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        androidMain {
            dependencies {}
        }
        iosMain {
            dependencies {
                // SQLDelight 只在 iOS 源代码集中可以使用, 但在 Android 源代码集或共通源代码集不可使用
                implementation 'com.squareup.sqldelight:native-driver:%sqlDelightVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

## 对其他跨平台项目的依赖项

你可以将一个跨平台项目作为另一个项目的依赖项. 要实现这个目的, 只需要简单的向需要的源代码集添加一个项目依赖项.
如果你想要在所有源代码集中使用一个依赖项, 请将它添加到共通源代码集.
这种情况下, 其他源代码集将会自动得到对应的版本.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation(project(":some-other-multiplatform-module"))
        }
        androidMain.dependencies {
            // :some-other-multiplatform-module 的平台相关部分, 会自动添加
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

## 下一步做什么?

查看跨平台项目中添加依赖项的其他资料, 并学习以下内容:

* [添加 Android 依赖项](multiplatform-android-dependencies.md)
* [添加 iOS 依赖项](multiplatform-ios-dependencies.md)
