[//]: # (title: 发布跨平台的库)

你可以设置你的跨平台库, 发布到不同的位置:

* [发布到本地 Maven 仓库](#publishing-to-a-local-maven-repository)
* 发布到 Maven Central 仓库.
  请参见 [我们的教程](multiplatform-publish-libraries-to-maven.md),
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

Kotlin Multiplatform 库的发布包括多个 Maven 发布, 每个对应于一个特定的目标平台.
此外, 还有一个包含全体的 _根(Root)_ 发布, `kotlinMultiplatform`, 代表发布的整个库.

在添加为共通源代码集的 [依赖项](multiplatform-add-dependencies.md) 时, 根发布会自动解析为正确的平台相关的 artifact.

### 目标平台相关的发布(Target-specific Publication)与根发布(Root Publication) {id="target-specific-and-root-publications"}

Kotlin Multiplatform Gradle plugin 会为每个编译目标配置单独的发布.
对于以下项目配置:

```kotlin
// projectName = "lib"
group = "test"
version = "1.0"

kotlin {
    jvm()
    iosArm64()
}
```

这个设置会生成以下 Maven 发布:

**目标平台相关的发布(Target-specific Publication)**

* 对于 `jvm` 目标:`test:lib-jvm:1.0`
* 对于 `iosArm64` 目标:`test:lib-iosarm64:1.0`

每个目标平台相关的发布都是独立的. 例如, 运行 `publishJvmPublicationTo<MavenRepositoryName>`
只会发布 JVM 模块, 不会发布其他模块.

**根发布(Root Publication)**

`kotlinMultiplatform` 根发布: `test:lib:1.0`.

根发布充当一个入口点, 引用所有的目标平台相关的发布.
它包含元数据 artifact, 并通过包含其他发布的引用来确保正确的依赖关系解析: 各个平台 artifact 预期的 URL 和座标(coordinate).

* 有些仓库, 比如 Maven Central, 要求 root 模块包含不带分类标识的 JAR artifact, 比如 `kotlinMultiplatform-1.0.jar`.
  Kotlin Multiplatform plugin 会自动产生需要的 artifact, 以及内嵌的元数据 artifact.
  也就是说, 你不需要向你的库的 root 模块添加一个空的 artifact, 来满足仓库的要求.

  > 关于生成 JAR artifact, 请参见 [Gradle](multiplatform-configure-compilations.md#compilation-for-jvm) 
  > 和 [Maven](maven.md#create-jar-file) 构建系统.
  >
  {style="tip"}

* 如果仓库要求, `kotlinMultiplatform` 发布还可能会需要源代码和文档的 artifact.
  这种情况下, 请在 publication 内使用 [`artifact()`](https://docs.gradle.org/current/javadoc/org/gradle/api/publish/maven/MavenPublication.html#artifact-java.lang.Object-).

### 发布一个完整的库 {id="publishing-a-complete-library"}

要一次性发布所有必须的 artifact, 请使用 `publishAllPublicationsTo<MavenRepositoryName>` 总体任务.
例如:

```bash
./gradlew publishAllPublicationsToGithubPackagesRepository
```

发布到 Maven Local 时, 你可以使用专用的 task:

```bash
./gradlew publishToMavenLocal
```

这些 task 会确保所有的目标平台相关的发布和根发布都在一起发布, 使得库在依赖解析时完整可用.

或者, 你也可以使用单独的发布 task. 首先运行根发布:

```bash
./gradlew publishKotlinMultiplatformPublicationToMavenLocal
````

这个 task 会发布一个 `*.module` 文件, 包含目标平台相关的发布的信息, 但目标平台本身还没有发布.
要完成发布过程, 请分布发布各个目标平台相关的发布:

```bash
./gradlew publish<TargetName>PublicationToMavenLocal
```

这样就可以确保所有 artifact 可用, 并且正确的引用.

## 对主机的要求 {id="host-requirements"}

Kotlin/Native 支持交叉编译(cross-compilation), 可以在任何主机上生成必要的 `.klib` artifact.
但是, 还是有一些限制你需要注意.

### 针对 Apple 目标平台的编译 {id="compilation-for-apple-targets"}

你可以使用任何主机对带有 Apple 目标平台的项目生成 artifact.
但是, 以下情况仍然需要使用 Mac 机器:

* 你的库或依赖的模块存在 [cinterop 依赖项](native-c-interop.md).
* 你的项目设置了 [CocoaPods 集成](multiplatform-cocoapods-overview.md).
* 你需要为 Apple 目标平台构建或测试 [最终二进制文件](multiplatform-build-native-binaries.md).

### 重复发布 {id="duplicating-publications"}

为了避免在仓库中重复发布, 应该只从一个主机发布所有的 artifact.
例如, Maven Central 明确禁止重复发布, 如果出现重复, 就会让发布过程失败.

## 发布 Android 库 {id="publish-an-android-library"}

要发布一个 Android 库, 需要一些额外的配置.
默认情况下, 没有任何 Android 库的 artifact 会发布.

> 本节假定你使用 Android Gradle Library Plugin.
> 关于如何设置这个 plugin, 或者如何从旧版的 `com.android.library` plugin 迁移,
> 请参见 Android 文档中的 [设置 Android Gradle Library Plugin](https://developer.android.com/kotlin/multiplatform/plugin#migrate) 页面.
>
{style="note"}

要发布 artifact, 请向 `shared/build.gradle.kts` 文件添加 `androidLibrary {}` 代码块,
并使用 KMP DSL 配置发布. 例如:

```kotlin
kotlin {
    androidLibrary {
        namespace = "org.example.library"
        compileSdk = libs.versions.android.compileSdk.get().toInt()
        minSdk = libs.versions.android.minSdk.get().toInt()

        // 启用 Java 编译支持.
        // 当不需要 Java 编译时, 这样可以提高构建速度
        withJava()

        compilations.configureEach {
            compilerOptions.configure {
                jvmTarget.set(
                    JvmTarget.JVM_11
                )
            }
        }
    }
}
```

注意, Android Gradle Library plugin 不支持产品风格(Product Flavor)和构建变体(Build Variant), 从而简化了配置.
因此, 你需要使用者同意(Opt-in)来创建测试源代码集和测试配置. 例如:

```kotlin
kotlin {
    androidLibrary {
        // ...

        // 使用者同意(Opt-in), 启用和配置宿主端(Host-side)测试(单元测试)
        withHostTestBuilder {}.configure {}

        // 使用者同意(Opt-in), 启用设备测试, 并指定源代码集名称
        withDeviceTestBuilder {
            sourceSetTreeName = "test"
        }

        // ...
    }
}
```

之前, 例如在 GitHub Action 中运行测试时, 需要分别指定 debug 和 release 变体:

```yaml
- target: testDebugUnitTest
  os: ubuntu-latest
- target: testReleaseUnitTest
  os: ubuntu-latest
```

使用 Android Gradle Library plugin 之后, 只需要指定带有源代码集名称的通用目标:

```yaml
- target: testAndroidHostTest
  os: ubuntu-latest
```

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

## 推广你的库 {id="promote-your-library"}

你的库可以在 [JetBrains 的跨平台库目录](https://klibs.io/) 上展示.
它的目标是为了让使用者便利的根据目标平台查找 Kotlin Multiplatform 库.

符合标准的库会被自动添加进来.
关于如何确保你的库出现在目录中, 详情请参见 [FAQ](https://klibs.io/faq).

## 下一步做什么 {id="what-s-next"}

* [学习如何将你的 Kotlin Multiplatform 库发布到 Maven Central 仓库](multiplatform-publish-libraries-to-maven.md)
* [阅读库开发者指南, 了解为 Kotlin Multiplatform 设计库的最佳实践和技巧](api-guidelines-build-for-multiplatform.md)
