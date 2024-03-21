---
type: doc
layout: reference
title: "添加 Android 依赖项"
---

# 添加 Android 依赖项

最终更新: {{ site.data.releases.latestDocDate }}

向一个 Kotlin Multiplatform 模块添加 Android 专有依赖项的流程, 与纯 Android 项目是相同的:
在你的 Gradle 文件中声明依赖项, 然后导入项目.
然后在你的 Kotlin 代码中就可以使用这个依赖项了.

在 Kotlin Multiplatform 项目中声明 Android 依赖项时, 我们建议将它们添加到一个专门的 Android 源代码集.
为此, 请更新你的项目的 `shared` 目录中的 `build.gradle(.kts)` 文件:

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

将 Android 项目中的一个顶层依赖项, 移动到 Multiplatform 项目中的一个专门的源代码集,
如果这个顶层依赖项使用了 non-trivial 的配置名称, 可能会很困难.
比如, 要从 Android 项目的顶层, 移动 `debugImplementation` 依赖项, 你需要向源代码集添加一个 implementation 依赖项, 名为 `androidDebug`.
在迁移过程中, 为了减少解决这类问题需要做的工作, 你可以在 `android` 代码块中添加一个 `dependencies` 代码块:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
android {
    //...
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
    //...
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

## 下一步做什么?

查看跨平台项目中添加依赖项的其他资料, 并学习以下内容:

* [关于添加依赖项的 Android 官方文档](https://developer.android.com/studio/build/dependencies)
* [添加对跨平台库或其他跨平台项目的依赖项](../multiplatform/multiplatform-add-dependencies.html)
* [添加 iOS 依赖项](multiplatform-ios-dependencies.html)
