[//]: # (title: 跨平台项目结构的高级概念)

本文解释 Kotlin Multiplatform 项目结构的高级概念, 以及如何对应到 Gradle 实现.
如果你需要使用 Gradle 构建的低层抽象(配置, 任务, 发布, 等等), 或者正在为 Kotlin Multiplatform 构建创建 Gradle plugin,
那么这些信息会对你很有用.

如果你正在进行下面的工作, 本章会对你很有用:

* 需要在一组特定的编译目标之间共用代码, 但 Kotlin 默认不会为这些编译目标创建源代码集.
* 想要为 Kotlin Multiplatform 构建创建 Gradle plugin, 或者需要使用 Gradle 构建的低层抽象, 例如配置, 任务, 发布, 等等.

要理解跨平台项目中的依赖项管理, 很关键的一点是对 Gradle 风格项目或库的依赖项,
和  Kotlin 特有的源代码集之间的 `dependsOn` 关系之间的区别:

* `dependsOn` 是共通源代码集和平台相关源代码集之间的关系,
  一般来说, 这种关系可以组成 [源代码集层级关系](#dependson-and-source-set-hierarchies), 并在跨平台项目中共用代码.
  对于默认的源代码集, 会自动管理层级关系, 但在特定的情况下, 你也可能需要调整它.
* 对库和项目的依赖项一般来说按照通常的方式工作, 但要在跨平台项目中正确的管理它们,
  你需要理解 [Gradle 依赖项如何解析](#dependencies-on-other-libraries-or-projects)
  成为细粒度的、用于编译的 **源代码集 -> 源代码集** 依赖项.

> 在深入研究高级概念之前, 我们建议先学习 [跨平台项目结构的基础知识](multiplatform-discover-project.md).
>
{style="tip"}

## dependsOn 与源代码集层级关系 {id="dependson-and-source-set-hierarchies"}

通常, 你会使用 _依赖项_ 而不是 _`dependsOn`_ 关系.
但是, 为了理解 Kotlin Multiplatform 项目的底层工作方式, 研究 `dependsOn` 是至关重要的.

`dependsOn` 是 2 个 Kotlin 源代码集之间的, Kotlin 特有的关系.
它可以是共通源代码集与平台相关源代码集之间的连接, 例如, 可以表示 `jvmMain` 源代码集依赖于 `commonMain`,
`iosArm64Main` 依赖于 `iosMain`, 等等.

考虑一个一般的例子, 存在 Kotlin 源代码集 `A` 和 `B`.
表达式 `A.dependsOn(B)` 会指示 Kotlin:

1. `A` 可以看到来自 `B` 的 API, 包括内部声明.
2. `A` 可以为来自 `B` 的预期声明提供实际实现.
    这是一个必须而且充分的条件, 因为, 当而且仅当, 存在直接或间接的 `A.dependsOn(B)` 关系时, `A` 才可以为 `B` 提供 `actuals` 实现.
3. `B` 应该编译到 `A` 编译到的所有编译目标, 此外再加上它自己的编译目标.
4. `A` 继承 `B` 的所有的常规依赖项.

`dependsOn` 关系会创建一个树形结构, 也叫做源代码集层级.
下面是一个通常的移动开发项目的例子, 针对的目标平台是 `androidTarget`, `iosArm64` (iPhone 设备),
和 `iosSimulatorArm64` (Apple Silicon Mac 上的 iPhone 模拟器):

![DependsOn 关系树结构](dependson-tree-diagram.svg){width=700}

图中的箭头表示 `dependsOn` 关系.
在编译平台二进制文件时, 也会保持这些关系.
所以 Kotlin 能够理解, `iosMain` 应该能够看到来自 `commonMain` 的 API, 但不能看到来自 `iosArm64Main` 的 API:

![编译期间的 DependsOn 关系](dependson-relations-diagram.svg){width=700}

`dependsOn` 关系使用 `KotlinSourceSet.dependsOn(KotlinSourceSet)` 调用来配置, 例如:

```kotlin
kotlin {
    // 编译目标的声明
    sourceSets {
        // 配置 dependsOn 关系的示例
        iosArm64Main.dependsOn(commonMain)
    }
}
```

* 这个示例演示如何在构建脚本中定义 `dependsOn` 关系.
  但是, Kotlin Gradle plugin 会默认创建源代码集并设置它们的关系, 因此你不需要手动配置.
* 在构建脚本中, `dependsOn` 关系在 `dependencies {}` 代码块之外的地方声明.
  这是因为 `dependsOn` 不是一种通常的依赖项; 相反, 它是 Kotlin 源代码集之间的一种特别关系, 在不同的编译目标之间共用代码时需要这些依赖关系.

你不能使用 `dependsOn` 来声明对已发布的库或对另一个 Gradle 项目的通常的依赖项.
例如, 你不能设置 `commonMain` 依赖于 `kotlinx-coroutines-core` 库的 `commonMain`,
也不能调用 `commonTest.dependsOn(commonMain)`.

### 声明自定义的源代码集

有些情况下, 在你的项目中可能需要自定义的中间源代码集.
考虑一个项目, 编译到 JVM, JS, 和 Linux 平台, 你想要只在 JVM 和 JS 平台之间共用一些源代码.
这种情况下, 你应该为这组编译目标寻找一个特定的源代码集,
具体方法请参见 [跨平台项目结构的基础知识](multiplatform-discover-project.md).

Kotlin 不会自动创建这样的源代码集.
因此你应该使用 `by creating` 构造来手动创建它:

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        // 创建名为 "jvmAndJs" 的源代码集
        val jvmAndJsMain by creating {
            // ...
        }
    }
}
```

但是, Kotlin 仍然如何处理或者编译这个源代码集.
如果你画一个源代码集关系图, 这个源代码集将是孤立的, 没有添加任何编译目标的标签:

![dependsOn 关系缺失](missing-dependson-diagram.svg){width=700}

为了解决这个问题, 请添加几个 `dependsOn` 关系, 将 `jvmAndJsMain` 包含到层级结构中:

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        val jvmAndJsMain by creating {
            // 不要忘记添加对 commonMain 的 dependsOn
            dependsOn(commonMain.get())
        }

        jvmMain {
            dependsOn(jvmAndJsMain)
        }

        jsMain {
            dependsOn(jvmAndJsMain)
        }
    }
}
```

这里, `jvmMain.dependsOn(jvmAndJsMain)` 会对 `jvmAndJsMain` 添加 JVM 编译目标,
`jsMain.dependsOn(jvmAndJsMain)` 会对 `jvmAndJsMain` 添加 JS 编译目标.

最终的项目结构如下:

![最终的项目结构](final-structure-diagram.svg){width=700}

> 如果手动配置 `dependsOn` 关系, 会禁止自动使用默认的层级结构模板.
> 关于这样的情况, 以及处理方法, 详情请参见 [附加配置](multiplatform-hierarchy.md#additional-configuration).
>
{style="note"}

## 对其他库或项目的依赖 {id="dependencies-on-other-libraries-or-projects"}

在跨平台项目中, 你可以设置通常的依赖项, 可以依赖到已发布的库, 或依赖到另一个 Gradle 项目.

Kotlin Multiplatform 一般会通过通常的 Gradle 方式来声明依赖项. 与 Gradle 类似, 你应该:

* 在你的构建脚本中使用 `dependencies {}` 代码块.
* 为依赖项选择适当的范围(scope), 例如, `implementation` 或 `api`.
* 引用依赖项,
  如果它是已经发布到仓库中, 可以指定它的座标(coordinate), 例如 `"com.google.guava:guava:32.1.2-jre"`,
  如果它是同一个构建内的一个 Gradle 项目, 可以指定它的路径, 例如 `project(":utils:concurrency")`.

跨平台项目中的依赖项配置有一些特别的功能.
每个 Kotlin 源代码集有它独自的 `dependencies {}` 代码块.
因此你可以在平台相关的源代码集中声明平台相关的依赖项:

```kotlin
kotlin {
    // 编译目标的声明
    sourceSets {
        jvmMain.dependencies {
            // 这是 jvmMain 的依赖项, 因此可以添加 JVM 相关的依赖项
            implementation("com.google.guava:guava:32.1.2-jre")
        }
    }
}
```

共通的依赖项要复杂一些.
考虑一个跨平台项目, 声明了对一个跨平台库的依赖项, 例如, `kotlinx.coroutines`:

```kotlin
kotlin {
    androidTarget()     // Android
    iosArm64()          // iPhone 设备
    iosSimulatorArm64() // Apple Silicon Mac 上的 iPhone 模拟器

    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
        }
    }
}
```

在依赖解析中, 有 3 个重要概念:

1. 跨平台依赖项会沿着 `dependsOn` 结构向下传播.
   如果你对 `commonMain` 添加一个依赖项, 它会自动添加到声明了对 `commonMain` 直接或间接的 `dependsOn` 关系的所有源代码集.

   在这个例子中, 依赖项实际会被自动添加到所有的 `*Main` 源代码集: `iosMain`, `jvmMain`, `iosSimulatorArm64Main`, 和 `iosX64Main`.
   所有这些源代码集会从 `commonMain` 源代码集继承 `kotlin-coroutines-core` 依赖项,
   因此你不需要将依赖项手动的复制粘贴到这些源代码集中:

   ![跨平台依赖项的传播](dependency-propagation-diagram.svg){width=700}

   > 依赖项传播机制允许你通过选择特定的源代码集, 来指定接受到声明的依赖项的范围.
   > 例如, 如果你希望在 iOS 上使用 `kotlinx.coroutines`, 但不在 Android 上使用, 你可以只对 `iosMain` 添加这个依赖项.
   >
   {style="tip"}

2. _源代码集 -> 跨平台库_ 依赖项, 例如上面的 `commonMain` 对 `org.jetbrians.kotlinx:kotlinx-coroutines-core:1.7.3` 的依赖,
   表示依赖解析的中间状态. 解析的最终状态始终表示为 _源代码集 -> 源代码集_ 依赖项.

   > 最终的 _源代码集 -> 源代码集_ 依赖项不是指 `dependsOn` 关系.
   >
   {style="note"}

   为了推断细粒度的 _源代码集 -> 源代码集_ 依赖项, Kotlin 会读取和每个跨平台库一起发布的源代码集结构.
   完成这一步之后, 每个库的内部表达不是一个整体, 而是它的源代码集的集合.
   请看 `kotlinx-coroutines-core` 的例子:

   ![源代码集结构的序列化](structure-serialization-diagram.svg){width=700}

3. Kotlin 对每个依赖关系解析为依赖项中源代码集的集合.
   这个集合中的每个依赖项源代码集必须拥有 _兼容的编译目标_.
   依赖项源代码集拥有兼容的编译目标是指, 它至少编译到 _与使用它的源代码集相同的编译目标_.

   例如, 示例项目中的 `commonMain` 编译到 `androidTarget`, `iosX64`, 和 `iosSimulatorArm64`:

   * 首先, 它解析到一个对 `kotlinx-coroutines-core.commonMain` 的依赖项.
     因为 `kotlinx-coroutines-core` 编译到所有可能的 Kotlin 编译目标.
     因此, 它的 `commonMain` 会编译到所有可能的编译目标, 包括这里要求的 `androidTarget`, `iosX64`, 和 `iosSimulatorArm64`.
   * 其次, `commonMain` 依赖 `kotlinx-coroutines-core.concurrentMain`.
     因为 `kotlinx-coroutines-core` 中的 `concurrentMain` 编译到除 JS 之外的所有的编译目标,
     它匹配使用它的项目中的 `commonMain` 的编译目标.

   但是, coroutines 中的 `iosX64Main` 之类的源代码集, 不兼容于使用它的 `commonMain` 源代码集.
   即使 `iosX64Main` 编译到 `commonMain` 的编译目标之一, 也就是, `iosX64`, 但是它不编译到 `androidTarget` 或 `iosSimulatorArm64`.

   依赖解析的结果直接影响可以访问 `kotlinx-coroutines-core` 中的哪些代码:

   ![在共通代码中使用 JVM 专用 API 的错误](dependency-resolution-error.png){width=700}

### 对齐跨源代码集的共通依赖项的版本

在 Kotlin Multiplatform 项目中, 共通源代码集会被编译多次, 生成 klib,
并成为配置的每个 [编译](multiplatform-configure-compilations.md) 的一部分.
为了生成一致的二进制文件, 共通代码每次编译时, 应该使用跨平台依赖项的相同版本.
Kotlin Gradle plugin 会帮助我们对齐这些依赖项, 确保每个源代码集的有效依赖项版本都是相同的.

在上面的示例中, 想象一下, 如果你想要向 `androidMain` 源代码集添加 `androidx.navigation:navigation-compose:2.7.7` 依赖项.
你的项目为 `commonMain` 源代码集明确的声明了 `kotlinx-coroutines-core:1.7.3` 依赖项,
但 Compose Navigation 库的 2.7.7 版本需要 Kotlin coroutines 的 1.8.0 或更高版本.

由于 `commonMain` 和 `androidMain` 会一起编译, Kotlin Gradle plugin 会在 coroutines 库的两个版本之间进行选择,
并对 `commonMain` 源代码集使用 `kotlinx-coroutines-core:1.8.0`.
但为了让共通代码对配置的所有编译目标都一致的编译, iOS 源代码集也需要限定为相同的依赖项版本.
因此 Gradle 还会将 `kotlinx.coroutines-*:1.8.0` 依赖项传播给 `iosMain` 源代码集.

![在 *Main 源代码集之间对齐依赖项](multiplatform-source-set-dependency-alignment.svg){width=700}

对于 `*Main` 源代码集和 [`*Test` 源代码集](multiplatform-discover-project.md#integration-with-tests), 依赖项会分别对齐.
对 `*Test` 源代码集的 Gradle 配置包含 `*Main` 源代码集的所有依赖项, 但反过来不是如此.
因此你可以使用比较新的库版本来测试你的项目, 而不会影响你的主代码.

例如, 在你的 `*Main` 源代码集存在 Kotlin coroutines 1.7.3 的依赖项, 传播到项目中的每个源代码集.
但是, 在 `iosTest` 源代码集中, 你决定将版本更新到 1.8.0, 来测试这个库的新发布版.
根据相同的算法, 这个依赖项会通过 `*Test` 源代码集树传播,
因此每个 `*Test` 源代码集都会使用 `kotlinx.coroutines-*:1.8.0` 依赖项进行编译.

![Test 源代码集与 main 源代码集会分别解析依赖项](test-main-source-set-dependency-alignment.svg)

## 编译

与单一平台的项目不同, Kotlin Multiplatform 项目需要多次编译器运行来构建所有的 artifact.
每次编译器运行都是一个 _Kotlin 编译_.

例如, 在前面提到的 Kotlin 编译过程中, 用于 iPhone 设备的二进制文件的生成方式如下:

![针对 iOS 的 Kotlin 编译](ios-compilation-diagram.svg){width=700}

Kotlin 编译会在编译目标之下分组. 默认情况下, Kotlin 为每个编译目标创建 2 个编译, `main` 编译用于产品源代码, `test` 编译用于测试源代码.

在构建脚本中, 编译通过类似的方式访问.
你首先选择一个 Kotlin 编译目标, 然后访问其中的 `compilations` 容器, 最后通过名称选择你需要的编译:

```kotlin
kotlin {
    // 声明并配置 JVM 编译目标
    jvm {
        val mainCompilation: KotlinJvmCompilation = compilations.getByName("main")
    }
}
```
