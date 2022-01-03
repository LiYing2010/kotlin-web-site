---
type: doc
layout: reference
title: "理解 KMM 项目结构"
---

# 理解 KMM 项目结构

Kotlin Multiplatform Mobile (_KMM_) 技术的目标是, 对 Android 和 iOS 平台使用共通的逻辑, 统一应用程序的开发过程.
为实现这个目标, KMM 使用一种移动应用程序专有结构的 [Kotlin 跨平台](../mpp/multiplatform.html) 项目.
本文描述基本的 KMM 项目的结构. 注意, 组织 KMM 项目不仅仅只有这种结构; 但是, 我们推荐使用这种结构作为起点.

一个基本的 Kotlin Mobile Multiplatform (KMM) 项目包含 3 个部分:

* _共用模块_ – 一个 Kotlin 模块, 包含对 Android 和 iOS 应用程序共通的逻辑.
  构建为一个 Android 库 和一个 iOS 框架(Framework). 使用 Gradle 作为构建系统.
* _Android 应用程序_ – 一个 Kotlin 模块, 构建为 Android 应用程序.
  使用 Gradle 作为构建系统.
* _iOS 应用程序_ – 一个 Xcode 项目, 构建为 iOS 应用程序.

<img src="/assets/docs/images/kmm/basic-project-structure.png" alt="基本 KMM 项目的结构" width="700"/>

这是你在 IntelliJ IDEA 或 Android Studio 中使用项目向导创建的 KMM 项目的结构.
真实的项目可能包含更加复杂的结构; 本文中我们对 KMM 项目只考虑这 3 个基本部分.

下面我们深入看一看基本项目和它的组成部分.

## 根项目

根项目是一个 Gradle 项目, 它的子项目包含共用模块, 以及 Android 应用程序.
它们通过 [Gradle 多项目机制](https://docs.gradle.org/current/userguide/multi_project_builds.html) 链接在一起. 

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
// settings.gradle.kts
include(":shared")
include(":androidApp")
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
// settings.gradle
include ':shared'
include ':androidApp'
```

</div>
</div>

iOS 应用程序从一个 Xcode 项目产生. 它保存在根项目下的一个单独目录中.
Xcode 使用它自己的构建系统; 因此, iOS 应用程序项目没有通过 Gradle 与 KMM 项目的其他部分连接在一起.
它将共用模块用作外部 artifact – 框架(Framework). 关于共用模块与 iOS 应用程序之间的集成, 详情请参见 [iOS 应用程序](#ios-application).

这是一个KMM 项目的基本结构:

<img src="/assets/docs/images/kmm/basic-project-dirs.png" alt="基本 KMM 项目的目录" width="400"/>

根项目不包含源代码. 你可以在它的 `build.gradle(.kts)` 或 `gradle.properties` 中存储全局配置,
比如, 添加仓库或定义全局配置变量.

对于更复杂的项目, 你可以向根项目添加更多模块, 方法是在 IDE 中创建模块, 并在 Gradle 设置中通过 `include` 声明连接到这些模块.

## 共用模块

共用模块包含在两个平台中都使用到的应用程序核心逻辑: 类, 函数, 等等.
这是一个 [Kotlin 跨平台](../mpp/mpp-intro.html) 模块, 编译为一个 Android 库和 一个 iOS 框架(Framework).
它使用 Gradle 和 Kotlin Multiplatform plugin, 它的编译目标是 Android 和 iOS.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
    // ..
}

kotlin {
    android()
    ios()
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    //..
}

kotlin {
    android()
    ios()
}
```

</div>
</div>

### 源代码集(Source Set)

共用模块包含 Android 和 iOS 应用程序的共通代码.
但是, 要在 Android 和 iOS 上实现相同的逻辑, 有时你会需要对两个平台编写各自专有的代码. 
为了解决这样的需求, Kotlin 提供了 [expect/actual](kmm-connect-to-platform-specific-apis.html) 机制.
共用模块的源代码相应的组织为 3 个源代码集(Source Set):

* `commonMain` 保存在两个平台都能运行的代码, 包括 `expect` 声明
* `androidMain` 保存 Android 专有的部分, 包括 `actual` 实现
* `iosMain` 保存 iOS 专有的部分, 包括 `actual` 实现

每个源代码集都有自己的依赖项. Kotlin 标准库会自动添加到所有的源代码集, 你不需要在构建脚本中声明它.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting
        val androidMain by getting {
            dependencies {
                implementation("androidx.core:core-ktx:1.2.0")
            }
        }
        val iosMain by getting 
        // ...
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
        }
        androidMain {
            dependencies {
                implementation 'androidx.core:core-ktx:1.2.0'
            }
        }
        iosMain {
        }

        // ...
    }
}
```

</div>
</div>

编写你的代码时, 请向对应的源代码集添加你需要的依赖项.
详情请参见 [跨平台开发文档 - 添加依赖项](../mpp/mpp-add-dependencies.html).

除 `*Main` 源代码集之外, 还有 3 个对应的测试源代码集:

* `commonTest`
* `androidTest`
* `iosTest`

请使用它们为共通和平台专有的源代码集保存对应的单元测试.
默认情况下, 它们已有 Kotlin 测试库的依赖项, 为你提供 Kotlin 单元测试相关的各种工具:
注解, 断言(Assert)函数, 等等. 你可以为你需要的其他测试库添加依赖项.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        // ...
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test-common"))
                implementation(kotlin("test-annotations-common"))
            }
        }
        val androidTest by getting
        val iosTest by getting
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
        //...

        commonTest {
            dependencies {
                implementation kotlin('test-common')
                implementation kotlin('test-annotations-common')
            }
        }
        androidTest {

        }
        iosTest {

        }
    }
}
```

</div>
</div>

上述 main 和 test 源代码集是默认配置. Kotlin Multiplatform plugin 会在编译目标创建时自动生成它们.
在你的项目中, 你可以为了某种目的添加更多源代码集.
详情请参见 [跨平台程序的 Gradle DSL 参考文档](../mpp/mpp-dsl-reference.html#custom-source-sets).

### Android 库

从共用模块生成的 Android 库的配置, 是 Android 项目的通常配置.
关于 Android 库的创建, 详情请参见 Android 开发值文档: [创建一个 Android 库](https://developer.android.com/studio/projects/android-library).

要生成 Android 库, 还需要使用另外 2 个 Gradle plugin:

* Android library
* Kotlin Android extensions

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    // ...
    id("com.android.library")
    id("kotlin-android-extensions")
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
plugins {
    // ...
    id 'com.android.library'
    id 'kotlin-android-extensions'
}
```

</div>
</div>

Android 库的配置保存在共用模块的构建脚本的 `android {}` 顶层代码段中:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
android {
    compileSdkVersion(29)
    defaultConfig {
        minSdkVersion(24)
        targetSdkVersion(29)
        versionCode = 1
        versionName = "1.0"
    }
    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
android {
    compileSdkVersion 29
    defaultConfig {
        minSdkVersion 24
        targetSdkVersion 29
        versionCode 1
        versionName '1.0'
    }
    buildTypes {
        release {
            minifyEnabled false
        }
    }
}
```

</div>
</div>

这是任何 Android 项目的通常配置. 你可以修改它, 适用于你的需要.
详情请参见 [Android 开发者文档](https://developer.android.com/studio/build#module-level).

### iOS 框架(Framework)

为了在 iOS 应用程序中使用, 共用模块要编译为一个框架(Framework) – 一种层级目录, 带有在 Apple 平台上使用的共通资源.
这个框架连接到构建为 iOS 应用程序的 Xcode 项目.

框架通过 [Kotlin/Native](native-overview.html) 编译器生成.
框架配置保存在构建脚本的 `kotlin {}` 内的 `ios {}` 代码段中.
它定义输出类型 `framework`, 以及字符串标识符 `baseName`, 用来组成输出的 artifact 的名称. 默认值是 Gradle 模块名称. 
对于真是的项目, 对于框架的生成, 很可能你需要更加复杂的配置.
详情请参见 [跨平台开发文档](../mpp/mpp-build-native-binaries.html).

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    // ...
    ios {
        binaries {
            framework {
                baseName = "shared"
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
    // ...
    ios {
        binaries {
            framework {
                baseName = 'shared'
            }
        }
    }
}
```

</div>
</div>

除此之外, 还有一个 Gradle task `embedAndSignAppleFrameworkForXcode`, 将框架导出给构建 iOS 应用程序的 Xcode 项目.
它使用 iOS 应用程序项目的配置来定义构建模式 (`debug` 或 `release`), 并对具体的位置提供适当的框架版本.

这个 task 由 multiplatform plugin 提供. 对 Xcode 项目的每个构建都会执行这个 task, 为 iOS 应用程序提供框架的最新版本.
详情请参见 [iOS 应用程序](#ios-application).

## Android 应用程序

一个 KMM 项目的 Android 应用程序部分是一个通常的 Android 应用程序, 由 Kotlin 编写.
在一个基本的 KMM 项目中, 它使用 3 个 Gradle plugin: 

* Kotlin Android
* Android Application
* Kotlin Android Extensions

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    id("com.android.application")
    kotlin("android")
    id("kotlin-android-extensions")
} 
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
    id 'kotlin-android-extensions'
}
```

</div>
</div>

为了访问共用模块的代码, Android 应用程序将它用作一个项目依赖项.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
dependencies {
    implementation(project(":shared"))
    //..
} 
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
dependencies {
    implementation project(':shared')
    //..
}
```

</div>
</div>

除了这些依赖项之外, Android 应用程序还使用 Kotlin 标准库(自动添加), 以及一些共通的 Android 依赖项:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
dependencies {
    //..
    implementation("androidx.core:core-ktx:1.2.0")
    implementation("androidx.appcompat:appcompat:1.1.0")
    implementation("androidx.constraintlayout:constraintlayout:1.1.3")
} 
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
dependencies {
    //..
    implementation 'androidx.core:core-ktx:1.2.0'
    implementation 'androidx.appcompat:appcompat:1.1.0'
    implementation 'androidx.constraintlayout:constraintlayout:1.1.3'
}
```

</div>
</div>

请在这个代码段中添加你的项目的 Android 专有依赖项.
Android 应用程序的构建配置, 放在构建脚本的 `android {}` 顶层代码段中:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
android {
    compileSdkVersion(29)
    defaultConfig {
        applicationId = "org.example.androidApp"
        minSdkVersion(24)
        targetSdkVersion(29)
        versionCode = 1
        versionName = "1.0"
    }
    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
android {
    compileSdkVersion 29
    defaultConfig {
        applicationId 'org.example.androidApp'
        minSdkVersion 24
        targetSdkVersion 29
        versionCode 1
        versionName '1.0'
    }
    buildTypes {
        'release' {
            minifyEnabled false
        }
    }
}
```

</div>
</div>

这是任何 Android 项目的通常配置. 你可以修改它, 适用于你的需要.
详情请参见 [Android 开发者文档](https://developer.android.com/studio/build#module-level).

## iOS 应用程序

iOS 应用程序从一个 Xcode 项目生成, 项目向导会自动生成这个 Xcode 项目.
它保存在 KMM 根项目内的一个单独的目录中. 

<img src="/assets/docs/images/kmm/basic-xcode-project.png" alt="基本的 KMM Xcode 项目" width="400"/>


对于 iOS 应用程序的每次构建, 项目都会获取框架的最新版本.
为了实现这一点, 它使用一个 **Run Script** build phase, 执行共用模块中的 `embedAndSignAppleFrameworkForXcode` Gradle task.
这个 task 会根据 Xcode 的环境设置, 使用需要的配置来生成 `.framework`, 并将 artifact 放在 Xcode 目录 `DerivedData` 中.

<img src="/assets/docs/images/kmm/packforxcode-in-project-settings.png" alt="在 Xcode 项目 设置中执行 `embedAndSignAppleFrameworkForXcode`" width="700"/>

要将框架嵌入到应用程序中, 并在 iOS 应用程序的源代码中使用来自共用模块的声明, 以下需要正确配置构建设置:

1. **Linking** 之下的 **Other Linker flags**: `$(inherited) -framework shared`

    <img src="/assets/docs/images/kmm/other-linker-flags-in-xcode-project-settings.png" alt="在 Xcode 项目设置中配置 **Other linker flags**" width="700"/>

2. **Search Paths** 之下的 **Framework Search Paths**: `$(SRCROOT)/../shared/build/xcode-frameworks/$(CONFIGURATION)/$(SDK_NAME)`.

    <img src="/assets/docs/images/kmm/framework-search-path-in-xcode-project-settings.png" alt="在 Xcode 项目设置中配置 **Framework Search Paths**" width="700"/>

从其他角度看, 一个 KMM 项目的 Xcode 部分是一个通常的 iOS 应用程序项目.
关于如何创建 iOS 应用程序, 详情请参见 [Xcode 文档](https://developer.apple.com/documentation/xcode#topics).
