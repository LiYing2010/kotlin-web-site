[//]: # (title: Compose 编译器选项 DSL)

Compose 编译器 Gradle plugin 提供了一个 DSL, 用于配置各种编译器选项.
对于适用了 Compose 编译器 Gradle plugin 的模块, 可以在`build.gradle.kts` 文件的 `composeCompiler {}` 代码块中, 使用这个 DSL 来配置编译器.

你可以指定 2 种类型的选项:

* 一般编译器设置, 可以在任何项目中根据需要禁用或启用.
* 功能特性 flag, 启用或禁用新的功能特性和实验性功能特性, 这些功能特性将来会成为默认功能的一部分.

你可以在 Compose 编译器 Gradle plugin 的 API 参考文档中, 找到
[可用的一般设置列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-compiler-gradle-plugin-extension/)
和 [支持的功能特性 flag 列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/).

下面是一个配置示例:

```kotlin
composeCompiler {
    includeSourceInformation = true

    featureFlags = setOf(
        ComposeFeatureFlag.StrongSkipping.disabled(),
        ComposeFeatureFlag.OptimizeNonSkippingGroups
    )
}
```

> Gradle plugin 对一些 Compose 编译器选项提供了默认值, 在 Kotlin 2.0 以前的版本只能手动指定.
> 如果你使用 `freeCompilerArgs` 设置了这些选项, 例如, Gradle 会报告重复选项的错误.
>
{style="warning"}

## 功能特性 flag 的目的与使用方法 {id="purpose-and-use-of-feature-flags"}

功能特性 flag 组织为单独的一组选项, 以便尽量减少对顶级属性的变更, 因为新的 flag 会持续不断的推出和废弃.

要启用一个默认禁用的功能特性, 请在 set 中指定它, 例如:

```kotlin
featureFlags = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups)
```

要禁用一个默认启用的功能特性, 请对它调用 `disabled()` 函数, 例如:

```kotlin
featureFlags = setOf(ComposeFeatureFlag.StrongSkipping.disabled())
```

如果你直接配置 Compose 编译器, 请使用以下语法, 向它传递功能特性 flag:

```none
-P plugin:androidx.compose.compiler.plugins.kotlin:featureFlag=<flag name>
```

详情请参见 Compose 编译器 Gradle plugin 的 API 参考文档中的
[支持的功能特性 flag 列表](https://kotlinlang.org/api/kotlin-gradle-plugin/compose-compiler-gradle-plugin/org.jetbrains.kotlin.compose.compiler.gradle/-compose-feature-flag/-companion/).
