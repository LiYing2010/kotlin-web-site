---
type: doc
layout: reference
title: "发布跨平台的库"
---

# 发布跨平台的库

你可以使用 [`maven-publish` Gradle plugin](https://docs.gradle.org/current/userguide/publishing_maven.html), 将跨平台的库发布到 Maven 仓库.
只需要指定库的 group, version, 以及需要发布到的 [仓库](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories).
plugin 会自动创建发布任务.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
plugins {
    //...
    id("maven-publish")
}

group = "com.example"
version = "1.0"

publishing {
    repositories {
        maven {
            //...
        }
    }
}
```

</div>

也可以使用 [`gradle-bintray-plugin`](https://github.com/bintray/gradle-bintray-plugin) 来发布跨平台的库.
但是, 这个 plugin 不支持发布 [层级项目结构](mpp-share-on-platforms.html#share-code-on-similar-platforms) 所需要的 Gradle 模块元数据(module metadata).
请使用 [这个变通方法](https://github.com/bintray/gradle-bintray-plugin/issues/229#issuecomment-473123891) 来支持元数据的发布,
或者迁移到 [`maven-publish` plugin](https://docs.gradle.org/current/userguide/publishing_maven.html).

## 发布的结构

当与 `maven-publish` 一起使用时, Kotlin plugin 对在当前主机上能够构建的每个编译目标, 都会自动创建发布任务,
Android 编译目标除外, 因为它需要 [更多步骤来配置发布任务](#publish-an-android-library).

跨平台库的发布会包含一个额外的 _root_ 发布 `kotlinMultiplatform`, 这是用作整个库的发布,
如果将它添加为共通源代码集的依赖项, 它会自动解析为适当的平台相关 artifact.
详情请参见 [添加依赖项](mpp-add-dependencies.html).

这个 `kotlinMultiplatform` 发布包含元数据 artifact, 而且会引用其他发布作为它的变体(variant).

> 有些仓库, 比如 Maven Central, 要求 root 模块包含不带分类标识的 JAR artifact, 比如 `kotlinMultiplatform-1.0.jar`.  
> Kotlin Multiplatform plugin 会自动产生需要的 artifact, 以及内嵌的元数据 artifact.
> 也就是说, 你不需要自定义你的构建脚本, 向你的库的 root 模块添加一个空的 artifact, 来满足仓库的要求.
{:.note}

如果仓库要求, `kotlinMultiplatform` 发布还可能会需要源代码和文档的 artifact.
这种情况下, 请在 publication 内使用 [`artifact(...)`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-) 添加这些需要的 artifact.

## 避免重复发布

为了避免重复发布那些可以在多个平台上编译的模块(比如 JVM 和 JS),
对这些模块, 请将发布任务配置为有条件执行.

你可以在构建脚本中检测平台, 引入一个标记, 比如 `isMainHost`, 并对主编译目标平台将这个标记设置为 `true`.
或者, 也可以从外部代码中传入这个标记, 比如, 从 CI 配置中传入.

下面是一个简化的示例, 它确保只有收到 `isMainHost=true` 时才会将发布的库上传到仓库.
也就是说, 对于能够从多个平台发布的库, 实际上只会发布一次 – 从 main host.


<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin {
    jvm()
    js()
    mingwX64()
    linuxX64()
    def publicationsFromMainHost =
        [jvm(), js()].collect { it.name } + "kotlinMultiplatform"
    publishing {
        publications {
            matching { it.name in publicationsFromMainHost }.all { targetPublication ->
                tasks.withType(AbstractPublishToMaven)
                        .matching { it.publication == targetPublication }
                        .configureEach { onlyIf { findProperty("isMainHost") == "true" } }
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
    jvm()
    js()
    mingwX64()
    linuxX64()
    val publicationsFromMainHost =
        listOf(jvm(), js()).map { it.name } + "kotlinMultiplatform"
    publishing {
        publications {
            matching { it.name in publicationsFromMainHost }.all {
                val targetPublication = this@all
                tasks.withType<AbstractPublishToMaven>()
                        .matching { it.publication == targetPublication }
                        .configureEach { onlyIf { findProperty("isMainHost") == "true" } }
            }
        }
    }
}
```

</div>
</div>

默认情况下, 每个发布都包含一个源代码 JAR, 其中包括这个编译目标的 main 编译任务使用到的源代码.

## 发布 Android 库

要发布一个 Android 库, 需要一些额外的配置.

默认情况下, 没有任何 Android 库的 artifact 会发布.
要发布一组 [Android 编译变体(variant)](https://developer.android.com/studio/build/build-variants) 生成的 artifact,
需要在 Android 编译目标的代码段内指定编译变体名称:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
kotlin {
    android {
        publishLibraryVariants("release", "debug")
    }
}

```

</div>

上面的示例适用于没有 [产品风格(Product Flavor)](https://developer.android.com/studio/build/build-variants#product-flavors) 的 Android 库.
对于存在产品风格(Product Flavor)的库, 编译变体名称还需要包含产品风格名称, 比如 `fooBarDebug` 或 `fooBazRelease`.

> 如果一个库的使用者定义了一个自己的编译变体, 而在库中不存在这个编译变体, 那么使用者需要提供匹配回退(Matching Fallback).
> 比如, 如果一个库不存在或者没有发布名为 staging 的编译类型, 那么对于存在这个编译类型的使用者, 需要提供一个回退机制,
> 指定库发布的一个以上的编译类型, 作为后备选项:
>
> <div class="multi-language-sample" data-lang="groovy">
> <div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>
>
> ```groovy
> android {
>     buildTypes {
>         staging {
>             // ...
>             matchingFallbacks = ['release', 'debug']
>         }
>     }
> }
> ```
>
> </div>
> </div>
>
> <div class="multi-language-sample" data-lang="kotlin">
> <div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>
>
> ```kotlin
> android {
>     buildTypes {
>         val staging by creating {
>             // ...
>             matchingFallbacks = listOf("release", "debug")
>         }
>     }
> }
> ```
>
> </div>
> </div>
{:.note}

类似的, 如果库的使用者使用了自定义的产品风格(Product Flavor), 而在库的发布中不存在这个产品风格,
那么库的使用者同样需要提供匹配回退.

也可以将各个编译变体以产品风格为单位分组发布, 使得不同的编译类型的输出文件可以放在同一个模块内,
编译类型成为 artifact 中的一个分类符 (release 编译类型的结果发布时仍然不带分类符).
这种发布模式默认是关闭的, 如果要启用, 请使用以下设置:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
kotlin {
    android {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

</div>

> 如果不同的编译变体存在不同的依赖项, 那么不推荐以产品风格为单位分组发布编译变体,
> 因为它们的依赖项会组合在一起, 成为一个庞大的依赖项列表.
{:.note}
