[//]: # (title: 发布跨平台的库)

你可以使用 [`maven-publish` Gradle plugin](https://docs.gradle.org/current/userguide/publishing_maven.html),
将跨平台的库发布到本地的 Maven 仓库.
只需要在 `shared/build.gradle.kts` 文件中, 指定库的 group, version, 以及需要发布到的
[仓库](https://docs.gradle.org/current/userguide/publishing_maven.html#publishing_maven:repositories).
plugin 会自动创建发布任务.

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

> 你也可以将跨平台的库发布到 GitHub 仓库. 详情请参见 GitHub 文档 [GitHub packages](https://docs.github.com/en/packages).
>
{style="tip"}

## 发布的结构

当与 `maven-publish` 一起使用时, Kotlin plugin 对在当前主机上能够构建的每个编译目标, 都会自动创建发布任务,
Android 编译目标除外, 因为它需要 [更多步骤来配置发布任务](#publish-an-android-library).

跨平台库的发布会包含一个额外的 _root_ 发布 `kotlinMultiplatform`, 这是用作整个库的发布,
如果将它添加为共通源代码集的依赖项, 它会自动解析为适当的平台相关 artifact.
详情请参见 [添加依赖项](multiplatform-add-dependencies.md).

这个 `kotlinMultiplatform` 发布包含元数据 artifact, 而且会引用其他发布作为它的变体(variant).

> 有些仓库, 比如 Maven Central, 要求 root 模块包含不带分类标识的 JAR artifact, 比如 `kotlinMultiplatform-1.0.jar`.
> Kotlin Multiplatform plugin 会自动产生需要的 artifact, 以及内嵌的元数据 artifact.
> 也就是说, 你不需要自定义你的构建脚本, 向你的库的 root 模块添加一个空的 artifact, 来满足仓库的要求.
>
{style="note"}

如果仓库要求, `kotlinMultiplatform` 发布还可能会需要源代码和文档的 artifact.
这种情况下, 请在 publication 内使用 [`artifact(...)`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-) 添加这些需要的 artifact.

## 对主机的要求

除 Apple 平台的编译目标之外, Kotlin/Native 支持交叉编译(cross-compilation), 可以在任何主机上生成需要的 artifact.

为了避免发布期间发生问题:
* 如果你的项目的编译目标包含 Apple 操作系统, 请只从 Apple 主机发布.
* 只从一个主机发布所有的 artifact, 以免在仓库中重复发布.

  例如, Maven Central, 明确禁止重复发布, 并会让发布过程失败. <!-- TBD: add the actual error -->

### 如果你使用 Kotlin 1.7.0 或更早版本 {initial-collapse-state="collapsed" collapsible="true"}

在 1.7.20 之前, Kotlin/Native 编译器不支持全部的交叉编译(cross-compilation)选项.
如果你使用更早的版本, 你可能需要从多个主机发布跨平台项目:
使用 Windows 主机编译 Windows 编译目标, 使用 Linux 主机编译 Linux 编译目标, 等等.
这可能会导致那些交叉编译的模块被重复发布.
要避免这个问题, 最直接的方法是, 升级到比较新的 Kotlin 版本, 如上文描述的那样, 从单个主机进行发布.

如果无法升级, 请在 `shared/build.gradle(.kts)` 文件中为每个编译目标指定一个 main host, 并检查这个标记:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

## 发布 Android 库 {id="publish-an-android-library"}

要发布一个 Android 库, 需要一些额外的配置.

默认情况下, 没有任何 Android 库的 artifact 会发布.
要发布一组
[Android 编译变体(variant)](https://developer.android.com/studio/build/build-variants)
生成的 artifact, 需要在 `shared/build.gradle.kts` 文件的 Android 编译目标代码段内指定编译变体名称:

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release", "debug")
    }
}
```

上面的示例适用于没有 [产品风格(Product Flavor)](https://developer.android.com/studio/build/build-variants#product-flavors) 的 Android 库.
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

## 禁用源代码的发布

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

## 禁用 JVM 环境属性的发布

从 Kotlin 2.0.0 开始, Gradle 属性 [`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes)
会自动随所有的 Kotlin 变体一起发布, 以便帮助区分 Kotlin Multiplatform 库的 JVM 和 Android 变体.
这个属性指明哪个库变体适用于哪个 JVM 环境, Gradle 使用这个信息在你的项目中进行依赖项解析.
目标环境可以是 "android", "standard-jvm", 或 "no-jvm".

你可以禁用这个属性的发布, 方法是向你的 `gradle.properties` 文件添加以下 Gradle 属性:

```none
kotlin.publishJvmEnvironmentAttribute=false
```
