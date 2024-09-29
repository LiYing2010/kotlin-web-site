[//]: # (title: [实验性 DSL] 构建最终的原生二进制文件)

最终更新: %latestDocDate%

> 本章介绍的新 DSL 是 [实验性功能](../components-stability.html). 它随时有可能变更.
> 我们建议你只为评估和试验目的来使用这个功能.
>
> 如果你无法使用新 DSL, 请参见构建原生二进制文件的 [前一种方案](multiplatform-build-native-binaries.html).
>
{style="warning"}

[Kotlin/Native 编译目标](multiplatform-dsl-reference.html#native-targets) 会被编译为 `*.klib` 库的 Artifact,
这些库 Artifact 可以被 Kotlin/Native 本身用作依赖项, 但不能用作原生库.

要声明最终的原生二进制文件, 请通过 `kotlinArtifacts` DSL, 使用新的二进制文件格式.
它代表为这个编译目标构建的原生二进制文件的集合, 以及默认的 `*.klib` Artifact,
它还提供了一组方法, 用来声明和配置这些文件.

> `kotlin-multiplatform` plugin 默认不会创建任何生产环境(production)版的二进制文件.
> 默认生成的二进制文件只有 debug 版的测试用可执行文件, 供你通过 `test` 编译任务来运行单元测试.
>
{style="note"}

Kotlin Artifact DSL 可以帮助你解决一个常见问题: 你需要从你的 App 访问多个 Kotlin 模块.
由于不能使用多个 Kotlin/Native Artifact, 你可以使用新 DSL, 将多个 Kotlin 模块导出到单个 Artifact.

## 声明二进制文件

`kotlinArtifacts` 元素是 Gradle 构建脚本中用于 Artifact 配置的顶层代码块.
请使用以下二进制文件类型来声明 `kotlinArtifacts` DSL 的元素:

| 工厂方法           | 二进制文件类型                                                                                | 可用于                                     |
|----------------|----------------------------------------------------------------------------------------|-----------------------------------------|
| `sharedLib`    | [共享的原生库](../native/native-faq.html#how-do-i-create-a-shared-library)                   | 所有的原生编译目标, `WebAssembly` 除外             |
| `staticLib`    | [静态的原生库](../native/native-faq.html#how-do-i-create-a-static-library-or-an-object-file) | 所有的原生编译目标, `WebAssembly` 除外             |
| `framework`    | Objective-C 框架                                                                         | 只能用于 macOS, iOS, watchOS, 和 tvOS 编译目标   |
| `fatFramework` | Universal fat 框架                                                                | 只能用于 macOS, iOS, watchOS, 和 tvOS 编译目标 |
| `XCFramework`  | XCFramework 框架                                                                  | 只能用于 macOS, iOS, watchOS, 和 tvOS 编译目标 |

在 `kotlinArtifacts` 元素内, 你可以编写以下代码块:

* [Native.Library](#library)
* [Native.Framework](#framework)
* [Native.FatFramework](#fat-frameworks)
* [Native.XCFramework](#xcframeworks)

最简单的版本需要对选择的构建类型指定 `target` (或 `targets`) 参数.
目前, 可以使用 2 个构建类型:

* `DEBUG` – 生成一个无优化的二进制文件, 包含调试信息
* `RELEASE` – 生成优化的二进制文件, 不包含调试信息

在 `modes` 参数中, 你可以指定你想要为哪个构建类型创建二进制文件.
默认值包括 `DEBUG` 和 `RELEASE` 的可执行二进制文件:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlinArtifacts {
    Native.Library {
        target = iosX64 // 请改为定义你的编译目标
        modes(DEBUG, RELEASE)
        // 二进制文件配置
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlinArtifacts {
    it.native.Library {
        target = iosX64 // 请改为定义你的编译目标
        modes(DEBUG, RELEASE)
        // 二进制文件配置
    }
}
```

</div>
</div>

你也可以使用自定义的名称来声明二进制文件 :

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlinArtifacts {
    Native.Library("mylib") {
        // 二进制文件配置
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlinArtifacts {
    it.native.Library("mylib") {
        // 二进制文件配置
    }
}
```

</div>
</div>

这里的参数是名称前缀, 用作二进制文件的默认名称.
例如, 对于 Windows, 上面的代码会 `mylib.dll` 文件.

## 配置二进制文件

对于二进制文件配置, 可以使用以下共通参数:

| **名称**          | **说明**                                                                   |
|-----------------|--------------------------------------------------------------------------|
| `isStatic`      | 可选项, 定义库类型的链接类型. 默认值为 `false`, 库为动态库.                                    |
| `modes`         | 可选项, 构建类型, 可指定的值是 `DEBUG` 和 `RELEASE`.                                   |
| `kotlinOptions` | 可选项, 编译时使用的编译器选项. 参见可用的 [编译器选项](../gradle/gradle-compiler-options.html). |
| `addModule`     | 除当前模块外, 你还可以向输出的 Artifact 添加其他模块.                                        |
| `setModules`    | 你可以覆盖添加到输出的 Artifact 的模块列表. |

### 库和框架

构建 Objective-C 框架或(共享的或静态的)原生库时, 你可能不仅当前项目中的类,
而且还需要将其他跨平台模块中的类也打包到单个库中, 并且将所有的模块都导出到这个库.

#### 库

对于库的配置, 除共通参数外, 还可以使用 `target` 参数:

| **名称**        | **说明**                                                                          |
|-----------------|---------------------------------------------------------------------------------|
| `target`        | 指定项目的一个特定的编译目标. 可用的编译目标名称请参见 [编译目标](multiplatform-dsl-reference.html#targets) 小节. |

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlinArtifacts {
    Native.Library("myslib") {
        target = linuxX64
        isStatic = false
        modes(DEBUG)
        addModule(project(":lib"))
        kotlinOptions {
            verbose = false
            freeCompilerArgs += "-Xmen=pool"
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlinArtifacts {
    it.native.Library("myslib") {
        target = linuxX64
        it.static = false
        modes(DEBUG)
        addModule(project(":lib"))
        kotlinOptions {
            verbose = false
            freeCompilerArgs += "-Xmen=pool"
        }
    }
}
```

</div>
</div>

以上代码注册的 Gradle 任务是 `assembleMyslibSharedLibrary`, 它会将所有已注册的 "myslib" 类型汇集到一个动态库.

#### 框架

对于框架的配置, 除共通参数外, 还可以使用以下参数:

| **名称**         | **说明**                                                                                        |
|----------------|-----------------------------------------------------------------------------------------------|
| `target`       | 指定项目的一个特定的编译目标. 可用的编译目标名称请参见 [编译目标](multiplatform-dsl-reference.html#targets) 小节.             |
| `embedBitcode` | 指定字节码的内嵌模式. 可以指定 `MARKER` 来内嵌字节码标记(用于 debug 构建), 或指定 `DISABLE` 来关闭字节码内嵌. 对于 Xcode 14 或更高版本, 不需要字节码内嵌. |

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlinArtifacts {
    Native.Framework("myframe") {
        modes(DEBUG, RELEASE)
        target = iosArm64
        isStatic = false
        embedBitcode = EmbedBitcodeMode.MARKER
        kotlinOptions {
            verbose = false
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlinArtifacts {
    it.native.Framework("myframe") {
        modes(DEBUG, RELEASE)
        target = iosArm64
        it.static = false
        embedBitcode = EmbedBitcodeMode.MARKER
        kotlinOptions {
            verbose = false
        }
    }
}
```

</div>
</div>

以上代码注册的 Gradle 任务是 `assembleMyframeFramework`, 它会汇集所有已注册的 "myframe" 框架类型.

> 如果你因为某些原因无法使用新 DSL, 请试用 [前一种方案](multiplatform-build-native-binaries.html#export-dependencies-to-binaries)
> 来将依赖项导出到二进制文件.
>
{style="tip"}

### Fat 框架

默认情况下, 由 Kotlin/Native 生成的 Objective-C 框架只支持一个平台.
但是, 你可以将这样的框架合并为单个通用(fat)二进制文件.
这种做法对 32 位和 64 位 iOS 框架尤其有意义.
对于这样的情况, 生成的通用框架可以同时在 32 位和 64 位设备上使用.

对于 fat 框架的配置, 除共通参数外, 还可以使用以下参数:

| **名称**       | **说明**                                                                                                                                              |
|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| `targets`      | 指定项目的所有编译目标.                                                                                                                                        |
| `embedBitcode` | 指定字节码的内嵌模式. 可以指定 `MARKER` 来内嵌字节码标记(用于 debug 构建), 或指定 `DISABLE` 来关闭字节码内嵌. 对于 Xcode 14 或更高版本, 不需要字节码内嵌. |

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlinArtifacts {
    Native.FatFramework("myfatframe") {
        targets(iosX32, iosX64)
        embedBitcode = EmbedBitcodeMode.DISABLE
        kotlinOptions {
            suppressWarnings = false
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlinArtifacts {
    it.native.FatFramework("myfatframe") {
        targets(iosX32, iosX64)
        embedBitcode = EmbedBitcodeMode.DISABLE
        kotlinOptions {
            suppressWarnings = false
        }
    }
}
```

</div>
</div>

以上代码注册的 Gradle 任务是 `assembleMyfatframeFatFramework`, 它会汇集所有已注册的 "myfatframe" fat 框架类型.

> 如果你因为某些原因无法使用新 DSL, 请试用 [前一种方案](multiplatform-build-native-binaries.html#build-universal-frameworks)
> 来构建 fat 框架.
>
{style="tip"}

### XCFramework

所有的 Kotlin Multiplatform 项目都可以使用 XCFramework 作为输出, 将所有目标平台和架构的逻辑集合到单个 bundle 中.
与 [通用(fat)框架](#fat-frameworks) 不同, 在将应用程序发布到 App Store 之前, 你不需要删除所有不需要的架构.

对于 XCFramework 的配置, 除共通参数外, 还可以使用以下参数:

| **名称**         | **说明**                                                                                                                                                                                            |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `targets`      | 指定项目的所有编译目标.                                                                                                                                                                 |
| `embedBitcode` | 指定字节码的内嵌模式. 可以指定 `MARKER` 来内嵌字节码标记 (用于 debug 构建), 或指定 `DISABLE` 来关闭字节码内嵌. 对于 Xcode 14 或更高版本, 不需要字节码内嵌. |

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlinArtifacts {
    Native.XCFramework("sdk") {
        targets(iosX64, iosArm64, iosSimulatorArm64)
        setModules(
            project(":shared"),
            project(":lib")
        )
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlinArtifacts {
    it.native.XCFramework("sdk") {
        targets(iosX64, iosArm64, iosSimulatorArm64)
        setModules(
            project(":shared"),
            project(":lib")
        )
    }
}
```

</div>
</div>

以上代码注册的 Gradle 任务是 `assembleSdkXCFramework`, 它会汇集所有已注册的 "sdk" XCFramework 类型.

> 如果你因为某些原因无法使用新 DSL, 请试用 [前一种方案](multiplatform-build-native-binaries.html#build-xcframeworks)
> 来构建 XCFramework.
>
{style="tip"}
