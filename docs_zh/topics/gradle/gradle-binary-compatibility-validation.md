[//]: # (title: Kotlin Gradle plugin 中的二进制兼容性验证)

<primary-label ref="experimental-general"/>

二进制兼容性验证可以帮助库的开发者确保使用者在升级到新的版本时不会破坏他们的代码.
这不仅有助于提供顺畅的升级体验, 而且有助于与使用者建立长期的信任, 并鼓励他们继续采用这个库.

> 二进制兼容性是指库的两个版本的编译后的字节码能够互换运行, 不需要重新编译.
> 
{style="tip"}

从 2.2.0 版开始, Kotlin Gradle plugin 支持二进制兼容性验证.
启用这个功能之后, 它会根据当前代码生成应用程序二进制接口(Application Binary Interface, ABI) dump, 并与之前的 dump 比较, 以便突出显示差异.
你可以审核这些变更, 找出任何潜在的二进制不兼容的修改, 并采取进一步措施解决这些问题.

## 如何启用 {id="how-to-enable"}

要启用二进制兼容性验证, 请在你的 `build.gradle.kts` 文件中添加以下 `kotlin{}` 代码段:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // 使用 set() 函数, 确保与旧的 Gradle 版本兼容
        enabled.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
kotlin {
    abiValidation {
        enabled = true
    }
}
```

</tab>
</tabs>

如果你的项目存在多个模块, 想要检查二进制兼容性, 请对每个模块单独配置.

## 检查二进制兼容性问题 {id="check-for-binary-compatibility-issues"}

在修改你的代码之后, 要检查潜在的二进制不兼容问题, 请在 IntelliJ IDEA 中运行 `checkLegacyAbi` Gradle 任务,
或在你的项目目录中使用以下命令:

```bash
./gradlew checkLegacyAbi
```

这个 Gradle 任务会比较 ABI dump, 并将检测到的差异作为错误打印输出.
请仔细查看输出, 检查是否需要修改代码来保持二进制兼容性.

## 更新参考 ABI dump {id="update-reference-abi-dump"}

Gradle 检查你的最新变更时会使用参考 ABI dump, 如果要更新它, 请在 IntelliJ IDEA 中运行 `updateLegacyAbi` 任务,
或在你的项目目录中使用以下命令:

```bash
./gradlew updateLegacyAbi
```

只有在你确信你的变更保持了与之前版本的二进制兼容性时, 才更新参考 dump.

## 配置过滤器 {id="configure-filters"}

你可以定义过滤器, 来控制 ABI dump 中包含哪些类, 属性, 和函数.
请使用 `filters {}` 代码段, 在其中使用 `excluded {}` 和 `included {}` 代码段来添加排除规则和包含规则.

只有在一个声明不匹配任何排除规则时, Gradle 才会在 ABI dump 中包含这个声明.
在定义包含规则时, 声明必须匹配一个包含规则, 或者存在至少一个成员匹配包含规则.

规则可以基于以下形式:

* 一个类, 属性, 或函数的完全限定名称 (`byNames`).
* 具有 BINARY 或 RUNTIME [retention](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.annotation/-retention/) 的注解名称 (`annotatedWith`).

> 在你的规则中, 可以对名称使用通配符 `**`, `*`, 和 `?`:
> * `**` 匹配 0 个或多个字符, 包含点号.
> * `*` 匹配 0 个或多个字符, 不包含点号. 请使用这个通配符来指定单个类名称.
> * `?` 匹配 1 个字符.
> 
{style = "tip"}

例如:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        filters {
            excluded {
                byNames.add("**.InternalUtils")
                annotatedWith.add("com.example.annotations.InternalApi")
            }

            included {
                byNames.add("com.example.api.**")
                annotatedWith.add("com.example.annotations.PublicApi")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
kotlin {
    abiValidation {
        filters {
            excluded {
                byNames.add("**.InternalUtils")
                annotatedWith.add("com.example.annotations.InternalApi")
            }

            included {
                byNames.add("com.example.api.**")
                annotatedWith.add("com.example.annotations.PublicApi")
            }
        }
    }
}
```

</tab>
</tabs>

在这个示例中:

* 排除了:
  * `InternalUtils` 类.
  * 标注了 `@InternalApi` 注解的声明.
* 包含了:
  * `com.example.api` 包中的所有内容.
  * 标注了 `@PublicApi` 注解的声明.

关于过滤, 详情请参见 [Kotlin Gradle plugin API 参考文档](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/-abi-filters-spec/).

## 防止对不支持的目标的推断变更 {id="prevent-inferred-changes-for-unsupported-targets"}

在跨平台项目中, 如果你的主机系统不能编译所有的目标平台, Kotlin Gradle plugin 会尝试根据可用的目标平台推断 ABI 变更.
这可以有助于避免在你之后切换到支持更多目标平台的主机时发生误报的失败.

要禁用这个行为, 请向你的 `build.gradle.kts` 文件添加以下设置:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        klib {
            keepUnsupportedTargets.set(false)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
kotlin {
    abiValidation {
        klib {
            keepUnsupportedTargets = false
        }
    }
}
```

</tab>
</tabs>

如果一个目标平台不被支持, 而且推断功能已被禁用, `checkLegacyAbi` task 会失败, 因为它不能生成一个完整的 ABI dump.
如果你倾向于让任务失败, 而不是冒遗漏一个二进制不兼容的修改的风险, 那么这个行为可能是有用的.
