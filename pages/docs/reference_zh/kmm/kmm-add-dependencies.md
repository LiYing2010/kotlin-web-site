---
type: doc
layout: reference
title: "向 KMM 模块添加依赖项"
---

# 向 KMM 模块添加依赖项

本页面最终更新: 2022/05/27

每个应用程序都需要一组库才能正常工作.
一个 KMM 应用程序可以依赖于同时工作于 iOS 和 Android 的跨平台库, 还可以依赖于 iOS 和 Android 平台相关的库. 

通过本文档, 你可以学习如何添加:
* [跨平台依赖项](#multiplatform-libraries)
* [iOS 依赖项](#ios-dependencies)
* [Android 依赖项](#android-dependencies)

## 跨平台库

对于使用 Kotlin 跨平台技术的库, 你可以添加它们的依赖项, 比如 
[kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines)
和 [SQLDelight](https://github.com/cashapp/sqldelight).
关于如何向你的项目添加这些库的依赖项, 库的作者通常会提供文档.

> 如果将一个不支持 [层级结构](../mpp/mpp-share-on-platforms.html#share-code-on-similar-platforms) 的跨平台库, 添加到一个支持层级结构的跨平台项目, 
> 那么对于那些共用的 iOS 源代码集, 你将无法使用 IDE 功能, 比如代码完成和高亮显示. 
> 
> 这是一个 [已知的问题](https://youtrack.jetbrains.com/issue/KT-40975), 我们正在解决. 目前, 你可以使用 [这个变通办法](#workaround-to-enable-ide-support-for-the-shared-ios-source-set). 
{:.note}

本节介绍基本的依赖项使用场景:

* [对 Kotlin 标准库的依赖项](#dependency-on-the-kotlin-standard-library)
* [由所有源代码集共用的库的依赖项](#dependency-on-a-library-shared-for-all-source-sets)
* [由特定源代码集使用的库的依赖项](#dependency-on-a-library-used-in-specific-source-sets)
* [对另一个跨平台项目的依赖项](#dependency-on-another-multiplatform-project)

详情请参见 [配置依赖项](../gradle.html#configuring-dependencies).

还可以参考这个 [由社区维护的 Kotlin 跨平台库列表](https://libs.kmp.icerock.dev/).

### 对 Kotlin 标准库的依赖项

Kotlin 标准库会自动添加到所有的跨平台项目, 你不需要手动做任何工作.

### 由所有源代码集共用的库的依赖项

如果你想要在所有的源代码集中使用一个库, 你可以只在共通源代码集中添加它. 
Kotlin Multiplatform Mobile plugin 会向所有的其他源代码集自动添加对应的部分.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets["commonMain"].dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}")
    }
    sourceSets["androidMain"].dependencies {
        //  会自动添加对于 kotlinx.coroutines 库的平台相关部分的依赖项
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
        androidMain {
            dependencies {
                // 会自动添加对于 kotlinx.coroutines 库的平台相关部分的依赖项
            }
        }
    }
}
```

</div>
</div>

### 由特定源代码集使用的库的依赖项

如果你想要只对特定的源代码集使用一个跨平台库, 你可以对这些源代码集明确的添加它. 
指定的库的声明 将只能在这些源代码集中使用.  
   
> 这种情况下不要使用平台相关的名称, 比如下面例子中的 SQLDelight `native-driver`. 请到库的文档中查找确切的名称.
{:.note}

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets["commonMain"].dependencies {
        // kotlinx.coroutines 可以在所有的源代码集中使用
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}")
    }
    sourceSets["androidMain"].dependencies {
    }
    sourceSets["iosX64Main"].dependencies {
        // SQLDelight 只在 iOS 源代码集中可以使用, 但在 Android 或共通源代码集中不可使用
        implementation("com.squareup.sqldelight:native-driver:{{ site.data.releases.sqlDelightVersion }})
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
            // kotlinx.coroutines 可以在所有的源代码集中使用
            implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}'
            }
        }
        androidMain {
            dependencies { }
        }
        iosMain {
            dependencies {
            // SQLDelight 只在 iOS 源代码集中可以使用, 但在 Android 或共通源代码集中不可使用
            implementation 'com.squareup.sqldelight:native-driver:{{ site.data.releases.sqlDelightVersion }}'
            }
        }
    }
}
```

</div>
</div>

### 对另一个跨平台项目的依赖项

你可以将一个跨平台项目用作另一个项目的依赖项. 要实现这个目的, 只需要简单的向需要的源代码集添加项目依赖项.
如果你想要在所有的源代码集中使用一个依赖项, 请向共通源代码集添加它. 这种情况下, 其他源代码集将会自动得到它们的版本.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets["commonMain"].dependencies {
        implementation(project(":some-other-multiplatform-module"))
    }
    sourceSets["androidMain"].dependencies {
        // 将会自动添加 :some-other-multiplatform-module 的平台相关部分  
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
                // 将会自动添加 :some-other-multiplatform-module 的平台相关部分
            }
        }
    }
}
```

</div>
</div>

## iOS 依赖项

在 Kotlin Multiplatform Mobile 项目中, Apple SDK 依赖项(比如 Foundation 或 Core Bluetooth) 可以作为一组预构建的库来使用. 
不需要额外的配置.

你也可以在你的 iOS 源代码集中重用 iOS 生态系统中的其它库和框架. 
Kotlin 支持与 Objective-C 依赖项交互, 也支持 Swift 依赖项, 但要求它们的 API 使用 `@objc` 属性导出到 Objective-C. 
纯 Swift 的依赖项目前还不支持.

也支持与 CocoaPods 依赖项管理器的集成, 但有相同的限制 – 你不能使用纯 Swift 的 pod.

我们推荐在 Kotlin Multiplatform Mobile (KMM) 项目中 [使用 CocoaPods](#with-cocoapods) 来管理 iOS 依赖项.
如果你想要精密调节交互过程细节, 或者有某些很重要的原因, 只有这些情况才需要 [手动管理依赖项](#without-cocoapods).

> 在支持 [层级结构](../mpp/mpp-share-on-platforms.html#share-code-on-similar-platforms) 的跨平台项目中,
> 比如使用了 `ios()` [编译目标简写](../mpp/mpp-share-on-platforms.html#use-target-shortcuts), 如果使用第三方 iOS 库,
> 那么对于那些共用的 iOS 源代码集, 你将无法使用 IDE 功能, 比如代码完成和高亮显示. 
> 
> 这是一个 [已知的问题](https://youtrack.jetbrains.com/issue/KT-40975), 我们正在解决. 目前, 你可以使用 [这个变通办法](#workaround-to-enable-ide-support-for-the-shared-ios-source-set). 
>
> 对于系统默认支持的 [平台库](../native/native-platform-libs.html), 不存在这个问题.
{:.note}

### 使用 CocoaPods

1. 执行 [CocoaPods 集成的初始设置](../native/native-cocoapods.html#install-the-cocoapods-dependency-manager-and-plugin)

2. 在你的项目的构建脚本中加入 `pod()`, 添加 CocoaPods 仓库中的你想要使用的 Pod 库的依赖项.

   <div class="multi-language-sample" data-lang="kotlin">
   <div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

    ```kotlin
    kotlin {
        cocoapods {
            // ..
            pod("AFNetworking") {
                version = "~> 4.0.1"
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
       cocoapods {
          // ..
          pod('AFNetworking') {
             version = '~> 4.0.1'
          }
       }
    }
    ```
   
   </div>
   </div>

3. 重新导入项目.

要在你的 Kotlin 代码中使用依赖项, 请导入包 `cocoapods.<library-name>`. 在上面的示例中中, 应该是:
```kotlin
import cocoapods.AFNetworking.*
```

详情请参见 [CocoaPods 集成](../native/native-cocoapods.html).

### 不使用 CocoaPods

如果你不想使用 CocoaPods, 你可以使用 cinterop 工具来为 Objective-C 或 Swift 声明创建 Kotlin 绑定.
然后就可以从 Kotlin 代码调用它们. 具体步骤是:
1. 下载你的依赖项.
2. 构建它, 得到它的二进制文件.
3. 创建一个专用的 `.def` 文件, 为 cinterop 描述这个依赖项.
4. 调节你的构建脚本, 在构建过程中生成绑定.

对于 [库](#add-a-library-without-cocoapods) 和 [框架](#add-a-framework-without-cocoapods),
上述步骤略微不同, 但大致思想是一样的.

#### 不使用 CocoaPods, 手动添加一个库  

1. 下载库的源代码, 放在从你的项目可以引用的某个地方. 

2. 构建库 (库作者通常会提供文档说明具体方法), 得到二进制文件路径.

3. 在你的项目中, 创建一个 `.def` 文件, 比如 `DateTools.def`.

4. 向这个文件添加第 1 行内容: `language = Objective-C`. 如果你想要使用一个纯 C 的依赖项, 请省略 language 属性.
   
5. 为这 2 个必须属性指定值:
    * `headers` 描述哪些头文件要由 cinterop 处理.
    * `package` 设置这些声明应该放置的包名称.

   比如:
    ```properties
    headers = DateTools.h
    package = DateTools
    ```

6. 向构建脚本添加与这个库交互的信息:
    * 传递 `.def` 文件的路径. 如果你的 `.def` 文件与 cinterop 名称相同, 并放置在 `src/nativeInterop/cinterop/` 目录中, 那么这个路径可以省略.
    * 使用 `includeDirs` 选项, 告诉 cinterop 到哪里寻找头文件.
    * 配置如何链接到库的二进制文件.
   <div class="multi-language-sample" data-lang="kotlin">
   <div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

    ```kotlin
    kotlin {
        iosX64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // .def 文件路径
                    defFile("src/nativeInterop/cinterop/DateTools.def")

                    // 头文件查找目录 (类似于 -I<path> 编译器选项)
                    includeDirs("include/this/directory", "path/to/another/directory")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // 链接到库需要的链接器选项.
                linkerOpts("-L/path/to/library/binaries", "-lbinaryname")
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
        iosX64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // .def 文件路径
                        defFile("src/nativeInterop/cinterop/DateTools.def")
                   
                        // 头文件查找目录 (类似于 -I<path> 编译器选项)
                        includeDirs("include/this/directory", "path/to/another/directory")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // 链接到库需要的链接器选项.
                linkerOpts "-L/path/to/library/binaries", "-lbinaryname"
            }
        }
    }
    ```
   
   </div>
   </div>

7. 构建项目.

现在你可以在你的 Kotlin 代码中使用这个依赖项了. 方法是, 导入你在 `.def` 文件的 `package` 属性中设置的那个包.
对于上面的示例, 应该是:
```kotlin
import DateTools.*
```

#### 不使用 CocoaPods, 手动添加一个框架

1. 下载框架源代码, 放在从你的项目可以引用的某个地方.

2. 构建框架 (框架作者通常会提供文档说明具体方法), 得到二进制文件路径.

3. 在你的项目中, 创建一个 `.def` 文件, 比如 `MyFramework.def`.

4. 向这个文件添加第 1 行内容: `language = Objective-C`. 如果你想要使用一个纯 C 的依赖项, 请省略 language 属性.

5. 为这 2 个必须属性指定值:
    * `modules` – 需要由 cinterop 处理的框架名称.
    * `package` – 这些声明应该放置的包名称.
      比如:
    ```properties
    modules = MyFramework
    package = MyFramework
    ```

6. 向构建脚本添加与这个框架交互的信息:
    * 传递 .def 文件路径. 如果你的 `.def` 文件与 cinterop 名称相同, 并放置在 `src/nativeInterop/cinterop/` 目录中, 那么这个路径可以省略.
    * 使用 `-framework` 选项, 向编译器和链接器传递框架名称.
      使用 `-F` 选项, 向编译器和链接器传递框架源代码和二进制文件的路径.

   <div class="multi-language-sample" data-lang="kotlin">
   <div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

    ```kotlin
    kotlin {
        iosX64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // .def 文件路径
                    defFile("src/nativeInterop/cinterop/DateTools.def")

                   compilerOpts("-framework", "MyFramework", "-F/path/to/framework/"
               }
               val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // 告诉链接器框架的位置.
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
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
        iosX64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // .def 文件路径
                        defFile("src/nativeInterop/cinterop/MyFramework.def")
                   
                        compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // 告诉链接器框架的位置.
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
        }
    }
    ```
   
   </div>
   </div>

7. 构建项目.

现在你可以在你的 Kotlin 代码中使用这个依赖项了. 方法是, 导入你在 .def 文件的 package 属性中设置的那个包. 对于上面的示例, 应该是:

```kotlin
import MyFramework.*
```

详情请参见 [与 Objective-C 和 Swift 交互](../native/native-objc-interop.html) 以及 
[在 Gradle 中配置 cinterop](../mpp/mpp-dsl-reference.html#cinterops).

### 对共用的 iOS 源代码集启用 IDE 支持的变通方法

由于一个 [已知的问题](https://youtrack.jetbrains.com/issue/KT-40975), 
在一个支持 [层级结构](../mpp/mpp-share-on-platforms.html#share-code-on-similar-platforms)的跨平台项目中, 如果你的项目依赖于以下库,
那么对于共用的 iOS 源代码集, 你将无法使用 IDE 功能, 比如代码完成和高亮显示:

* 不支持层级结构的跨平台库.
* 除默认支持的[平台库](../native/native-platform-libs.html)之外的第三方 iOS 库.

这个问题只影响共用的 iOS 源代码集. IDE 仍然能够正确支持其它代码.

> 通过 KMM Project Wizard 创建的所有项目都支持层级结构, 因此不受这个问题影响.
{:.note}

在这些情况中, 要启用 IDE 支持, 你可以使用变通办法, 向你的项目的 `shared` 目录中的 `build.gradle.(kts)` 文件添加以下代码:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
val iosTarget: (String, KotlinNativeTarget.() -> Unit) -> KotlinNativeTarget =
    if (System.getenv("SDK_NAME")?.startsWith("iphoneos") == true)
        ::iosArm64
    else
        ::iosX64

iosTarget("ios")
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
def iosTarget
if (System.getenv("SDK_NAME")?.startsWith("iphoneos")) {
    iosTarget = kotlin.&iosArm64
} else {
    iosTarget = kotlin.&iosX64
}
```

</div>
</div>

在这个代码示例中, iOS 编译目标的配置依赖于环境变量 `SDK_NAME`, 它由 Xcode 管理. 
对于每个构建, 你只有唯一的 iOS 编译目标, 名为 `ios`, 使用 `iosMain` 源代码集. 
将不会存在 `iosMain`, `iosArm64`, 和 `iosX64` 源代码集之间的层级结构.

> 这是一个临时的变通方法. 如果你是库的作者, 我们建议你尽快 [迁移到层级结构](../mpp/migrating-multiplatform-project-to-14.html#migrate-to-the-hierarchical-project-structure). 
>
> 通过变通方法, Kotlin 跨平台工具只对当前构建中唯一一个活跃的原生编译目标来分析你的代码. 
> 在对所有编译目标的完全构建中, 这可能会导致各种错误, 而且如果你的项目除 iOS 之外还包含其他原生编译目标, 那么更可能发生错误.
{:.note}

## Android 依赖项

向一个 KMM 模块添加 Android 专有依赖项的流程, 与纯 Android 项目是相同的:
向你的 Gradle 构建脚本添加一行, 声明你需要的依赖项, 然后导入项目. 然后在你的 Kotlin 代码中就可以使用这个依赖项了.

我们建议向 KMM 项目添加 Android 依赖项时, 将它们添加到一个专门的 Android 源代码集:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
sourceSets["androidMain"].dependencies {
    implementation("com.example.android:app-magic:12.3")
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
sourceSets {
    androidMain {
        dependencies {
            implementation 'com.example.android:app-magic:12.3'
        }
    }
}
```

</div>
</div>

将 Android 项目中的一个顶层依赖项, 移动到 KMM 项目中的一个专门的源代码集,
如果这个顶层依赖项使用了 non-trivial 的配置名称, 可能会很困难.
比如, 要从 Android 项目的顶层, 移动 `debugImplementation` 依赖项, 你需要向源代码集添加一个 implementation 依赖项, 名为 `androidDebug`.
在迁移过程中, 为了减少解决这类问题需要做的工作, 你可以在 `android` 代码块中添加一个 `dependencies` 代码块:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
android {
    ...

    dependencies {   
        implementation("com.example.android:app-magic:12.3")
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
android {
    ...

    dependencies {
        implementation 'com.example.android:app-magic:12.3'
    }
}
```

</div>
</div>

这里声明的依赖项将会与顶层代码块中的依赖项完全相同的处理, 但用这种方式声明可以在你的构建脚本中明确的分离 Android 依赖项, 使代码更容易理解.

将依赖项放在构建脚本末尾的一个单独的 `dependencies` 代码块之内, 这种方式是 Android 项目的习惯写法, 这样的写法也是支持的.
然而, 我们强烈 **不推荐** 这样的做法, 因为构建脚本在顶层代码块中配置 Android 依赖项, 又在各个源代码集中配置其他编译目标依赖项,
这样的写法很容易让人难以理解.

详情请参见 [Android 官方文档: 添加依赖项](https://developer.android.com/studio/build/dependencies).
