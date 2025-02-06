[//]: # (title: Compose 编译器迁移指南)

Compose 编译器通过一个 Gradle plugin 来补充, 它会简化设置, 并提供更简单的访问编译器选项的能力.
在与 Android Gradle plugin (AGP) 一起使用时, 这个 Compose 编译器 plugin 会覆盖由 AGP 自动提供的 Compose 编译器的座标.

从 Kotlin 2.0.0 开始, Compose 编译器已经合并到了 Kotlin 代码仓库.
这有助于将你的项目平滑的迁移到 Kotlin 2.0.0 或更高版本, 因为 Compose 编译器与 Kotlin 同时发布,
并且始终与相同版本的 Kotlin 保持兼容.

要在你的项目中使用新的 Compose 编译器 plugin, 请对使用 Compose 的每个模块应用这个 plugin.
请阅读如何 [迁移 Jetpack Compose 项目](#migrating-a-jetpack-compose-project) 的详细信息.
对 Compose Multiplatform 项目,
请参见 [跨平台迁移指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html#migrating-a-compose-multiplatform-project).

## 迁移 Jetpack Compose 项目 {id="migrating-a-jetpack-compose-project"}

从 Kotlin 1.9 迁移到 Kotlin 2.0.0 或更高版本时, 你应该根据使用 Compose 编译器的方式来调整你的项目配置.
我们推荐使用 Kotlin Gradle plugin 和 Compose 编译器 Gradle plugin, 自动进行配置管理.

### 使用 Gradle plugin 管理 Compose 编译器 {id="managing-the-compose-compiler-with-gradle-plugins"}

对于 Android 模块:

1. 将 Compose 编译器 Gradle plugin 添加到 [Gradle 版本目录](https://docs.gradle.org/current/userguide/platforms.html#sub:conventional-dependencies-toml):

   ```
   [versions]
   # ...
   kotlin = "%kotlinVersion%"

   [plugins]
   # ...
   org-jetbrains-kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
   compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
   ```

2. 将 Gradle plugin 添加到根 `build.gradle.kts` 文件:

   ```kotlin
   plugins {
       // ...
       alias(libs.plugins.compose.compiler) apply false
   }
   ```

3. 向使用 Jetpack Compose 的每个模块适用 plugin:

   ```kotlin
   plugins {
       // ...
       alias(libs.plugins.compose.compiler)
   }
   ```

4. 如果你使用针对 Jetpack Compose 编译器的编译器选项, 请在 `composeCompiler {}` 代码块中设置这些选项.
   关于编译器选项, 请参见 [编译器选项列表](compose-compiler-options.md).

5. 如果你直接引用 Compose 编译器的 artifact, 你可以删除这些引用, 让 Gradle plugin 来处理.

### 不使用 Gradle plugin, 直接使用 Compose 编译器 {id="using-compose-compiler-without-gradle-plugins"}

如果你没有使用 Gradle plugin 来管理 Compose 编译器, 请在你的项目中更新对旧 Maven artifact 的所有直接引用:

* 将 `androidx.compose.compiler:compiler` 修改 `org.jetbrains.kotlin:kotlin-compose-compiler-plugin-embeddable`
* 将 `androidx.compose.compiler:compiler-hosted` 修改 `org.jetbrains.kotlin:kotlin-compose-compiler-plugin`

## 下一步做什么 {id="what-s-next"}

* 请参见关于 Compose 编译器移动到 Kotlin 代码仓库的
  [Google 公告](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html).
* 如果你使用 Jetpack Compose 来构建 Android App, 请阅读 [我们的关于如何让它成为跨平台 App 的指南](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html).
