---
type: doc
layout: reference
category: "Gradle"
title: "对 Gradle plugin 变体的支持"
---

# 对 Gradle plugin 变体的支持

最终更新: {{ site.data.releases.latestDocDate }}

Gradle 7.0 为 Gradle plugin 开发者引入了一个新功能
— [带变体(variant)的 plugin](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants).
使用这个功能, 可以在 plugin 中支持最新的 Gradle 功能, 同时保持与旧版本 Gradle 的兼容性. 
详情请参见 [Gradle 中的变体选择](https://docs.gradle.org/current/userguide/variant_model.html).

使用 Gradle plugin 变体, Kotlin 开发组能够针对不同的 Gradle 版本发布不同的 Kotlin Gradle plugin (KGP) 变体. 
目标是在 `main` 变体中支持基本的 Kotlin 编译, 这个变体对应于支持的 Gradle 最低版本.
每个变体将会支持对应的 Gradle 版本的功能. 最新的变体将会支持最新的 Gradle 功能.
通过这种方式, 可以对旧的 Gradle 版本支持较少的功能, 对新的 Gradle 版本支持更多的功能.

目前, Kotlin Gradle plugin 有以下变体:

| 变体名        | 对应的 Gradle 版本 |
|------------|---------------|
| `main`     | 6.8.3–6.9.3   |
| `gradle70` | 7.0           |
| `gradle71` | 7.1-7.4       |
| `gradle75` | 7.5           |
| `gradle76` | 7.6           |
| `gradle80` | 8.0           |
| `gradle81` | 8.1.1 或更高版本   |

在未来的 Kotlin 发布版中, 还会增加更多的变体.

要检查你的构建使用的是哪个变体, 请启用
[`--info` log 级别](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level),
然后在日志输出中查找以 `Using Kotlin Gradle plugin` 开头的字符串, 例如, `Using Kotlin Gradle plugin main variant`.

## 问题与解决方案

> 关于 Gradle 中的变体选择功能, 下面是一些已知问题的变通方法:
> * [pluginManagement 中的 ResolutionStrategy, 对于存在多个变体的 plugin, 不能正常工作 ](https://github.com/gradle/gradle/issues/20545)
> * [当 Plugin 被添加为 `buildSrc` 的共通依赖项时, Plugin 变体会被忽略](https://github.com/gradle/gradle/issues/20847)
{:.note}

### 在自定义配置中, Gradle 无法选择 KGP 变体

这是一种预料中的状况, 在自定义配置中, Gradle 无法选择 KGP 变体.
如果你使用了自定义的 Gradle 配置:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
configurations.register("customConfiguration") {
    // ...
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
configurations.register("customConfiguration") {
    // ...
}
```

</div>
</div>

并且你想要添加一个 Kotlin Gradle plugin 的依赖项, 例如:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
dependencies {
    customConfiguration("org.jetbrains.kotlin:kotlin-gradle-plugin:{{ site.data.releases.latest.version }}")
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
dependencies {
    customConfiguration 'org.jetbrains.kotlin:kotlin-gradle-plugin:{{ site.data.releases.latest.version }}'
}
```

</div>
</div>

你需要向你的 `customConfiguration` 添加以下属性:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
configurations {
    customConfiguration {
        attributes {
            attribute(
                Usage.USAGE_ATTRIBUTE,
                project.objects.named(Usage.class, Usage.JAVA_RUNTIME)
            )
            attribute(
                Category.CATEGORY_ATTRIBUTE,
                project.objects.named(Category.class, Category.LIBRARY)
            )
            // 如果你想要使用某个特定的 KGP 变体的依赖:
            attribute(
                GradlePluginApiVersion.GRADLE_PLUGIN_API_VERSION_ATTRIBUTE,
                project.objects.named("7.0")
            )
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
configurations {
    customConfiguration {
        attributes {
            attribute(
                Usage.USAGE_ATTRIBUTE,
                project.objects.named(Usage, Usage.JAVA_RUNTIME)
            )
            attribute(
                Category.CATEGORY_ATTRIBUTE,
                project.objects.named(Category, Category.LIBRARY)
            )
            // 如果你想要使用某个特定的 KGP 变体的依赖:
            attribute(
                GradlePluginApiVersion.GRADLE_PLUGIN_API_VERSION_ATTRIBUTE,
                project.objects.named('7.0')
            )
        }
    }
}
```

</div>
</div>

否则, 你会看到这样的错误:

```none
 > Could not resolve all files for configuration ':customConfiguration'.
      > Could not resolve org.jetbrains.kotlin:kotlin-gradle-plugin:1.7.0.
        Required by:
            project :
         > Cannot choose between the following variants of org.jetbrains.kotlin:kotlin-gradle-plugin:1.7.0:
             - gradle70RuntimeElements
             - runtimeElements
           All of them match the consumer attributes:
             - Variant 'gradle70RuntimeElements' capability org.jetbrains.kotlin:kotlin-gradle-plugin:1.7.0:
                 - Unmatched attributes:
```

## 下一步做什么?

学习 [Gradle 基本概念与详细信息](https://docs.gradle.org/current/userguide/userguide.html).
