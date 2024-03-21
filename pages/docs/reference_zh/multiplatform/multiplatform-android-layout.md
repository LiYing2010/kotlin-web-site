---
type: doc
layout: reference
category:
title: "Android 源代码集布局"
---

# Android 源代码集布局

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin 1.8.0 引入了 Android 源代码集布局, 并在 1.9.0 中成为默认布局.
请阅读这篇向导, 理解的已废弃的旧布局与新布局之间的主要区别, 以及如何迁移你的项目.

> 你不一定要实现这篇向导中的全部建议, 只需要实现那些适合于你的项目的部分.
{:.tip}

## 检查兼容性

新的布局需要 Android Gradle plugin 7.0 或更高版本, 而且需要使用 Android Studio 2022.3 或更高版本.
请检查你的 Android Gradle plugin 版本, 如果需要的话, 请更新到新的版本.

## 重命名 Kotlin 源代码集

如果需要, 请重命名你的项目中的源代码集, 遵循下面的模式:

| 以前的源代码集布局                             | 新的源代码集布局          |
|----------------------------------------|-------------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` 与 `{KotlinSourceSet.name}` 的对应关系如下:

|             | 以前的源代码集布局 | 新的源代码集布局          |
|-------------|----------------------------|--------------------------------|
| main        | androidMain                | androidMain                    |
| test        | androidTest                | android<b>Unit</b>Test         |
| androidTest | android<b>Android</b>Test  | android<b>Instrumented</b>Test |

## 移动源代码文件

如果需要, 请将你的源代码文件移动到新的目录, 遵循下面的模式:

| 以前的源代码集布局                           | 新的源代码集布局               |
|-------------------------------------|-------------------------------------|
| 包含额外的 `/kotlin` 源代码目录的布局 | `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` 与 `{SourceDirectories included}` 的对应关系如下:

|             | 以前的源代码集布局                                    | 新的源代码集布局                                                                             |
|-------------|---------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java  | src/androidMain/kotlin<br/>src/main/kotlin<br/>src/main/java                                      |
| test        | src/androidTest/kotlin<br/>src/test/kotlin<br/>src/test/java  | src/android<b>Unit</b>Test/kotlin<br/>src/test/kotlin<br/>src/test/java                           |
| androidTest | src/android<b>Android</b>Test/kotlin<br/>src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin<br/>src/androidTest/java, <b>src/androidTest/kotlin</b> |

## 移动 AndroidManifest.xml 文件

如果你的项目中有 `AndroidManifest.xml` 文件, 请移动到新的目录, 遵循下面的模式:

| 以前的源代码集布局                             | 新的源代码集布局                                 |
|--------------------------------------------------------|-------------------------------------------------------|
| src/{<b>Android</b>SourceSet.name}/AndroidManifest.xml | src/{<b>Kotlin</b>SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}` 与 `{AndroidManifest.xml location}` 的对应关系如下:

|       | 以前的源代码集布局    | 新的源代码集布局                       |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/<b>android</b>Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

## 检查 Android 测试和 common 测试之间的关系

新的 Android 源代码集布局改变了 Android 设备测试(Instrumented Test) (在新的布局中改名为 `androidInstrumentedTest`)
与 common 测试之间的关系.

以前, `androidAndroidTest` 与 `commonTest` 之间默认存在 `dependsOn` 关系.
这意味着:

* `commonTest` 中的代码可以在 `androidAndroidTest` 中访问.
* `commonTest` 中的 `expect` 声明, 在 `androidAndroidTest` 中必须有对应的 `actual` 实现.
* 在 `commonTest` 中声明的测试 也会作为 Android 设备测试(Instrumented Test)运行.

在新的 Android 源代码集布局中, 不会默认添加这个 `dependsOn` 关系.
如果你希望使用以前的行为, 请在你的 `build.gradle.kts` 文件中手动声明下面的关系:

```kotlin
kotlin {
// ...
    sourceSets {
        val commonTest by getting
        val androidInstrumentedTest by getting {
            dependsOn(commonTest)
        }
    }
}
```

## 调整 Android flavor 的实现

在以前的版本中, Kotlin Gradle plugin 会在很早的阶段创建对应于 `debug` 和 `release` 构建类型的 Android 源代码集,
或对应于自定义 flavor 的 Android 源代码集, 例如 `demo` 和 `full`.
因此这些源代码集可以通过 `val androidDebug by getting { ... }` 这样的表达式来访问.

新的 Android 源代码集布局, 使用 Android 的 [`onVariants`](https://developer.android.com/reference/tools/gradle-api/8.0/com/android/build/api/variant/AndroidComponentsExtension#onVariants(com.android.build.api.variant.VariantSelector,kotlin.Function1))
来创建源代码集.
因此上面的表达式不再有效, 会导致错误：
`org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found`.

为了解决这样的错误, 请在你的 `build.gradle.kts` 文件中使用新的 `invokeWhenCreated()` API:

```kotlin
kotlin {
// ...
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    sourceSets.invokeWhenCreated("androidFreeDebug") {
// ...
    }
}
```
