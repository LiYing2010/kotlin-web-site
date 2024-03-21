---
type: doc
layout: reference
category: "Other"
title: "层级项目结构"
---

# 层级项目结构

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin Multiplatform 项目支持层级的源代码集结构.
也就是说, 你可以安排中间源代码集的层级结构, 用于在部分的, 但不是全部的 [支持的编译目标](multiplatform-dsl-reference.html#targets),
之间共用共通的代码.
使用中间源代码集可以帮助你:

* 针对一部分编译目标, 提供特定的 API.
  例如, 一个库可以在一个中间源代码集中添加原生代码相关的 API, 用于 Kotlin/Native 编译目标, 但不用于 Kotlin/JVM 编译目标.
* 针对一部分编译目标, 使用特定的 API.
  例如, 你可以利用  Kotlin Multiplatform 库为某些编译目标提供的丰富的 API, 这些编译目标组成一个中间源代码集.
* 在你的项目中使用依赖于平台的库.
  例如, 你可以通过 iOS 中间源代码集访问 iOS 相关的依赖项.

Kotlin 工具链会确保, 每个源代码集只能访问这个源代码集编译到的所有编译目标都可以使用的 API.
这样可以防止一些错误情况, 例如使用了 Windows 专用的 API, 然后将其编译到 macOS,
这样的情况会在运行期导致链接错误或未定义的行为.

要设置源代码集层级结构, 推荐的方法是使用 [默认的层级结构模板](#default-hierarchy-template).
模板会覆盖最常见的情况.
如果你有更加复杂的项目, 你可以 [手动配置](#manual-configuration).
这是一种更加底层的方案: 它更加灵活, 但需要更多的努力和更多的知识.

## 默认层级结构模板

从 Kotlin 1.9.20 开始, Kotlin Gradle plugin 包含内建的默认 [层级结构模板](#see-the-full-hierarchy-template).
对于一些常见的情况, 模板包含了预定义的中间源代码集.
Plugin 会根据你项目中指定的编译目标, 自动设置这些源代码集.

考虑下面的示例:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</div>
</div>

当你在你的代码中声明编译目标 `androidTarget`, `iosArm64`, 和 `iosSimulatorArm64` 时,
Kotlin Gradle plugin 会从模板中找到合适的共享源代码集, 并为你创建这些源代码集.
最后产生的层级结构类似下图:

![使用默认的层级结构模板的示例]({{ url_for('asset', path='docs/images/multiplatform/default-hierarchy-example.svg') }})

绿色的源代码集会自动创建并包含到项目中, 同时, 默认模板中的灰色的源代码集会被忽略.
Kotlin Gradle plugin 没有创建一些源代码集, 例如 `watchos`, 因为项目中没有 watchOS 编译目标.

如果你添加一个 watchOS 编译目标, 例如 `watchosArm64`, `watchos` 源代码集就会被创建,
来自 `apple`, `native`, 和 `common` 源代码集的代码也会被编译到 `watchosArm64`.

Kotlin Gradle plugin 会为来自默认层级结构模板的所有源代码集创建类型安全的访问器,
因此, 与 [手动配置](#manual-configuration) 相比, 你可以引用这些源代码集, 不需要使用 `by getting` 或 `by creating` 构建器:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</div>
</div>

> 在这个示例中, `apple` 和 `native` 源代码集只编译到 `iosArm64` 和 `iosSimulatorArm64` 编译目标.
> 因此, 尽管它们的名字不是 ios, 它们可以访问完整的 iOS API.
> 对于 `native` 这样的源代码集, 这可能会违反直觉, 因为你可能会期望在这个源代码集中, 只能访问那些所有原生编译目标都能够使用的 API.
> 这个行为未来可能会变更.
{:.note}

### 附加配置

你可能会需要对默认层级结构模板进行一些调整.
如果你曾经使用 `dependsOn` 调用, [手动](#manual-configuration) 引入了中间源代码集,
这样会取消默认层级结构模板的使用, 导致下面的警告:

```none
The Default Kotlin Hierarchy Template was not applied to '<project-name>':
Explicit .dependsOn() edges were configured for the following source sets:
[<... names of the source sets with manually configured dependsOn-edges...>]

Consider removing dependsOn-calls or disabling the default template by adding
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
to your gradle.properties

Learn more about hierarchy templates: https://kotl.in/hierarchy-template
```

要解决这个问题, 请通过以下任何一种方式来配置你的项目:

* [用默认层级结构模板替换你的手动配置](#replacing-a-manual-configuration)
* [在默认层级结构模板中创建额外的源代码集](#creating-additional-source-sets)
* [修改默认层级结构模板创建的源代码集](#modifying-source-sets)

#### 替换手动配置

**问题场景**. 你所有的中间源代码集都被默认层级结构模板覆盖.

**解决方案**. 删除所有的手动 `dependsOn()` 调用和使用 `by creating` 构建器的源代码集.
关于所有默认源代码集的列表, 请参见 [完整的层级结构模板](#see-the-full-hierarchy-template).

#### 创建额外的源代码集

**问题场景**. 你想要添加默认层级结构模板没有提供的源代码集, 例如, macOS 和 JVM 编译目标之间的一个中间源代码集.

**解决方案**:

1. 明确调用 `applyDefaultHierarchyTemplate()`, 重新适用模板.
2. 使用 `dependsOn()`, [手动](#manual-configuration) 配置额外的源代码集:

    <div class="multi-language-sample" data-lang="kotlin">
    <div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>
    
    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // 再次适用默认层级结构. 它会创建源代码集, 例如 iosMain:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // 创建额外的 jvmAndMacos 源代码集:
            val jvmAndMacos by creating {
                dependsOn(commonMain.get())
            }
    
            macosArm64Main.get().dependsOn(jvmAndMacos)
            jvmMain.get().dependsOn(jvmAndMacos)
        }
    }
    ```
    
    </div>
    </div>
    
    <div class="multi-language-sample" data-lang="groovy">
    <div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">
    
    ```groovy
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // 再次适用默认层级结构. 它会创建源代码集, 例如 iosMain:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // 创建额外的 jvmAndMacos 源代码集:
            jvmAndMacos {
                dependsOn(commonMain.get())
            }
            macosArm64Main {
                dependsOn(jvmAndMacos.get())
            }
            jvmMain {
                dependsOn(jvmAndMacos.get())
            }
        } 
    }
    ```
    
    </div>
    </div>


#### 修改源代码集

**问题场景**. 你已经有了源代码集, 名字与模板生成的源代码集完全相同, 但在你的项目中的一些不同的编译目标之间共用.
例如, 一个 `nativeMain` 源代码集, 只在桌面专用的编译目标之间共用: `linuxX64`, `mingwX64`, 和 `macosX64`.

**解决方案**. 目前没有办法修改模板的源代码集之间的默认的 `dependsOn` 关系.
同样重要的是, 源代码集的实现和含义, 例如, `nativeMain`, 在所有的项目中应该保持一致.

但是, 你还是可以执行下面的任何一种操作:

* 找到适合你的目的的另一个源代码集, 无论是默认层级结构模板中的, 还是手动创建的.
* 向你的 `gradle.properties` 文件添加 `kotlin.mpp.applyDefaultHierarchyTemplate=false`, 完全的选择性禁用(opt out)模板,
  并手动配置所有的源代码集.

> 我们正在开发一个 API, 用来创建你自己的层级结构模板.
> 对于层级结构配置与默认模板非常不同的项目, 这个功能会非常有用.
>
> 这个 API 还未完成, 但如果你迫切希望试用它,
> 可以查看 `applyHierarchyTemplate {}` 代码块, 以及 `KotlinHierarchyTemplate.default` 的声明作为示例.
> 请记住, 这个 API 还在开发中.
> 它没有经过足够的测试, 在未来的发布版中可能发生变更.
{:.tip}

#### 查看完整的层级结构模板

当你声明你的项目的编译目标时, plugin 会根据指定的编译目标, 从模板中选择共用的源代码集, 并在你的项目中创建这些源代码集.

![Default hierarchy template]({{ url_for('asset', path='docs/images/multiplatform/full-template-hierarchy.svg') }})

> 这个示例只显示了项目的 production 部分, 省略了 `Main` 后缀 (例如, 使用 `common` 而不是 `commonMain`).
> 但是, 还有完全相同的一组 `*Test` 源代码集.
{:.tip}

## 手动配置

你可以在源代码集结构中手动的引入中间源代码集. 它包含多个编译目标之间的共用代码.

例如, 如果你想要在 Linux 原生环境, Windows, 和 macOS 编译目标 (`linuxX64`, `mingwX64`, 和 `macosX64`) 之间共用代码,
你可以这样做:

1. 添加中间源代码集 `desktopMain`, 包含用于这些编译目标的共用逻辑.
2. 使用 `dependsOn` 关系, 指定源代码集的层级结构.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    linuxX64()
    mingwX64()
    macosX64()

    sourceSets {
        val desktopMain by creating {
            dependsOn(commonMain.get())
        }

        linuxX64Main.get().dependsOn(desktopMain)
        mingwX64Main.get().dependsOn(desktopMain)
        macosX64Main.get().dependsOn(desktopMain)
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    linuxX64()
    mingwX64()
    macosX64()

    sourceSets {
        desktopMain {
            dependsOn(commonMain.get())
        }
        linuxX64Main {
            dependsOn(desktopMain)
        }
        mingwX64Main {
            dependsOn(desktopMain)
        }
        macosX64Main {
            dependsOn(desktopMain)
        }
    }
}
```

</div>
</div>

最后产生的层级结构类似下图:

![手动配置的层级结构]({{ url_for('asset', path='docs/images/multiplatform/manual-hierarchical-structure.png') }})

对以下编译目标组合, 可以共用源代码集:

* JVM 或 Android + JS + Native
* JVM 或 Android + Native
* JS + Native
* JVM 或 Android + JS
* Native

对以下编译目标组合, Kotlin 目前不支持共用源代码集:

* 多个 JVM 编译目标
* JVM + Android 编译目标
* 多个 JS 编译目标

如果你需要在共用的原生源代码集中访问平台相关的 API, IntelliJ IDEA 可以帮助你查找在共用的原生代码中可以使用的共通声明.
其他情况下, 请使用 Kotlin 的 [预期声明与实际声明](multiplatform-expect-actual.md) 机制.
