[//]: # (title: 发布跨平台的库)

你可以设置你的跨平台库, 发布到不同的位置:

* [发布到本地 Maven 仓库](#publishing-to-a-local-maven-repository)
* 发布到 Maven Central 仓库.
  请参见 [我们的教程 tutorial](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html),
  学习如何设置帐号凭据, 自定义库的 metadata, 以及配置发布 plugin.
* 发布到 GitHub 仓库.
  详情请参见, GitHub 的 [GitHub packages](https://docs.github.com/en/packages) 文档.

## 发布到本地 Maven 仓库 {id="publishing-to-a-local-maven-repository"}

你可以使用 `maven-publish` Gradle plugin, 将跨平台的库发布到本地的 Maven 仓库:

1. 在 `shared/build.gradle.kts` 文件中, 添加 [`maven-publish` Gradle plugin](https://docs.gradle.org/current/userguide/publishing_maven.html).
2. 指定库的 group 和 version, 以及需要发布到的
   [仓库](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories):

    ```kotlin
    plugins {
        // ...
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

当与 `maven-publish` 一起使用时, Kotlin plugin 对在当前主机上能够构建的每个编译目标, 都会自动创建发布任务,
Android 编译目标除外, 因为它需要 [更多步骤来配置发布任务](#publish-an-android-library).

## 发布的结构 {id="structure-of-publications"}

跨平台库的发布会包含一个额外的 _root_ 发布 `kotlinMultiplatform`, 这是用作整个库的发布,
如果将它添加为共通源代码集的依赖项, 它会自动解析为适当的平台相关 artifact.
详情请参见 [添加依赖项](multiplatform-add-dependencies.md).

这个 `kotlinMultiplatform` 发布包含元数据 artifact, 而且会引用其他发布作为它的变体(variant).

有些仓库, 比如 Maven Central, 要求 root 模块包含不带分类标识的 JAR artifact, 比如 `kotlinMultiplatform-1.0.jar`.
Kotlin Multiplatform plugin 会自动产生需要的 artifact, 以及内嵌的元数据 artifact.
也就是说, 你不需要向你的库的 root 模块添加一个空的 artifact, 来满足仓库的要求.

> 关于生成 JAR artifact, 请参见 [Gradle](multiplatform-configure-compilations.md#compilation-for-jvm) 
> 和 [Maven](maven.md#create-jar-file) 构建系统.
>
{style="tip"}

如果仓库要求, `kotlinMultiplatform` 发布还可能会需要源代码和文档的 artifact.
这种情况下, 请在 publication 内使用 [`artifact(...)`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-) 添加这些需要的 artifact.

## 对主机的要求 {id="host-requirements"}

Kotlin/Native 支持交叉编译(cross-compilation), 可以在任何主机上生成必要的 `.klib` artifact.
但是, 还是有一些细节问题你需要注意.

### 针对 Apple 目标平台的编译 {id="compilation-for-apple-targets"}
<primary-label ref="experimental-opt-in"/>

要对 Apple 目标平台的项目生成 artifact, 你通常需要 Apple 机器.
但是, 如果你希望使用其它主机, 请在你的 `gradle.properties` 文件中设置这个选项:

```none
kotlin.native.enableKlibsCrossCompilation=true
```

交叉编译(cross-compilation) 目前是实验性功能, 存在一些限制.
对于以下情况, 你仍然需要使用 Mac 机器:

* 你的库存在 [cinterop 依赖项](native-c-interop.md).
* 你的项目设置了 [CocoaPods 集成](native-cocoapods.md).
* 你需要为 Apple 目标平台构建或测试 [最终二进制文件](multiplatform-build-native-binaries.md).

### 重复发布 {id="duplicating-publications"}

为了避免发布期间发生问题, 应该只从一个主机发布所有的 artifact, 以免在仓库中重复发布.
例如, Maven Central, 明确禁止重复发布, 并会让发布过程失败.
<!-- TBD: add the actual error -->

## 发布 Android 库 {id="publish-an-android-library"}

要发布一个 Android 库, 需要一些额外的配置.

默认情况下, 没有任何 Android 库的 artifact 会发布.
要发布一组 Android [构建变体(variant)](https://developer.android.com/build/build-variants)
生成的 artifact, 需要在 `shared/build.gradle.kts` 文件的 Android 编译目标代码段内指定编译变体名称:

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

上面的示例适用于没有 [产品风格(Product Flavor)](https://developer.android.com/build/build-variants#product-flavors) 的 Android 库.
对于存在产品风格(Product Flavor)的库, 编译变体名称还需要包含产品风格名称, 比如 `fooBarDebug` 或 `fooBarRelease`.

默认的发布设置如下:
* 如果发布的编译变体是相同的构建类型 (比如, 都是 `release` 或 `debug`),
  那么它们将兼容任意的使用者构建类型.
* 如果发布的编译变体是不同的构建类型, 那么只有 release 变体兼容于与发布的编译变体不同的使用者构建类型.
  所有的其他编译变体 (比如 `debug`) 只会与使用者的相同构建类型匹配,
  除非使用者项目指定了
  [匹配回退(Matching Fallback)](https://developer.android.com/reference/tools/gradle-api/4.2/com/android/build/api/dsl/BuildType).

如果你希望让所有发布的 Android 变体都只兼容于库的使用者的相同构建类型,
请设置 Gradle 属性: `kotlin.android.buildTypeAttribute.keep=true`.

也可以将各个编译变体以产品风格为单位分组发布, 使得不同的编译类型的输出文件可以放在同一个模块内,
编译类型成为 artifact 中的一个分类符 (release 编译类型的结果发布时仍然不带分类符).
这种发布模式默认是关闭的, 如果要启用, 请在 `shared/build.gradle.kts` 文件中使用以下设置:

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariantsGroupedByFlavor = true
    }
}
```

> 如果不同的编译变体存在不同的依赖项, 那么不推荐以产品风格为单位分组发布编译变体,
> 因为它们的依赖项会组合在一起, 成为一个庞大的依赖项列表.
>
{style="note"}

## 禁用源代码的发布 {id="disable-sources-publication"}

Kotlin Multiplatform Gradle plugin 默认会对所有指定的编译目标发布源代码.
但是, 你可以在 `shared/build.gradle.kts` 文件中使用 `withSourcesJar()` API 配置并禁用源代码发布:

* 对所有的编译目标禁用源代码发布:

  ```kotlin
  kotlin {
      withSourcesJar(publish = false)

      jvm()
      linuxX64()
  }
  ```

* 只对指定的编译目标禁用源代码发布:

  ```kotlin
  kotlin {
       // 只对 JVM 禁用源代码发布:
      jvm {
          withSourcesJar(publish = false)
      }
      linuxX64()
  }
  ```

* 对指定的编译目标之外的所有编译目标禁用源代码发布:

  ```kotlin
  kotlin {
      // 对 JVM 之外的所有编译目标禁用源代码发布:
      withSourcesJar(publish = false)

      jvm {
          withSourcesJar(publish = true)
      }
      linuxX64()
  }
  ```

## 禁用 JVM 环境属性的发布 {id="disable-jvm-environment-attribute-publication"}

从 Kotlin 2.0.0 开始, Gradle 属性 [`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes)
会自动随所有的 Kotlin 变体一起发布, 以便帮助区分 Kotlin Multiplatform 库的 JVM 和 Android 变体.
这个属性指明哪个库变体适用于哪个 JVM 环境, Gradle 使用这个信息在你的项目中进行依赖项解析.
目标环境可以是 "android", "standard-jvm", 或 "no-jvm".

你可以禁用这个属性的发布, 方法是向你的 `gradle.properties` 文件添加以下 Gradle 属性:

```none
kotlin.publishJvmEnvironmentAttribute=false
```

## 推广你的库 {id="promote-your-library"}

你的库可以在 [JetBrains 的检索平台](https://klibs.io/) 上展示.
它的目标是为了让使用者便利的根据目标平台查找 Kotlin Multiplatform 库.

符合标准的库会被自动添加进来.
关于如何添加你的库, 详情请参见 [FAQ](https://klibs.io/faq).

## 下一步做什么 {id="what-s-next"}

* [学习如何将你的 Kotlin Multiplatform 库发布到 Maven Central 仓库](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-libraries.html)
* [阅读库开发者指南, 了解为 Kotlin Multiplatform 设计库的最佳实践和技巧](api-guidelines-build-for-multiplatform.md)
