[//]: # (title: 构建最终的原生二进制文件)

Kotlin/Native 编译目标默认会被编译输出为 `*.klib` 库文件,
这种库文件可以被 Kotlin/Native 用作依赖项, 但它不能执行, 也不能被用作一个原生的库.

如果要编译为最终的原生二进制文件, 比如可执行文件, 或共享库, 可以使用原生编译目标的 `binaries` 属性.
这个属性值是原生二进制文件的列表, 表示除默认的 `*.klib` 库文件之外, 这个编译目标还需要编译为哪些类型,
这个属性还提供了一组方法, 用来声明和配置这些原生二进制文件.

> `kotlin-multiplatform` plugin 默认不会创建任何产品版(production)的二进制文件.
> 默认情况下, 只会产生一个调试版(debug)的测试可执行文件, 你可以通过 `test` 编译任务来运行这个可执行文件内的单元测试.
>
{style="note"}

Kotlin/Native 编译器生成的二进制文件可能包含第三方代码, 数据, 或衍生作品.
也就是说, 如果你发布 Kotlin/Native 编译的最终二进制文件,
那么你始终需要在你的二进制分发版中包含必要的 [许可证文件](native-binary-licenses.md).

## 声明二进制文件 {id="declare-binaries"}

请使用以下工厂方法来声明 `binaries` 列表中的元素.

| 工厂方法         | 二进制文件类型        | 可用于                                  |
|--------------|----------------|--------------------------------------|
| `executable` | 产品版的可执行文件      | 所有的原生编译目标                            |
| `test`       | 测试程序的可执行文件     | 所有的原生编译目标                            |
| `sharedLib`  | Shared 原生库     | 所有的原生编译目标, `WebAssembly` 除外          |
| `staticLib`  | Static 原生库     | 所有的原生编译目标, `WebAssembly` 除外          |
| `framework`  | Objective-C 框架 | 仅限于 macOS, iOS, watchOS, 和 tvOS 编译目标 |

最简单的版本不需要任何额外参数, 并对每一个构建类型创建一个二进制文件.
现在有 2 种构建类型:

* `DEBUG` – 产生一个未经优化的, 带调试信息的二进制文件
* `RELEASE` – 产生优化过的, 无调试信息的二进制文件

下面的代码会创建 2 个可执行的二进制文件, debug 和 release:

```kotlin
kotlin {
    linuxX64 { // 这里请改为你的编译目标.
        binaries {
            executable {
                // 这里指定二进制文件的配置信息.
            }
        }
    }
}
```

如果不需要[额外的配置](multiplatform-dsl-reference.md#native-targets), 那么可以省略这个 Lambda 表达式:

```kotlin
binaries {
    executable()
}
```

还可以指定对哪些构建类型创建二进制文件.
下面的示例只创建 `debug` 版的二进制文件:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable(listOf(DEBUG)) {
        // 这里指定二进制文件的配置信息.
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    executable([DEBUG]) {
        // 这里指定二进制文件的配置信息.
    }
}
```

</tab>
</tabs>

还可以使用自定义的名称来声明二进制文件:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable("foo", listOf(DEBUG)) {
        // 这里指定二进制文件的配置信息.
    }

    // 可以省略构建类型
    // (这时会使用所有可用的构建类型).
    executable("bar") {
        // 这里指定二进制文件的配置信息.
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    executable('foo', [DEBUG]) {
        // 这里指定二进制文件的配置信息.
    }

    // 可以省略构建类型
    // (这时会使用所有可用的构建类型).
    executable('bar') {
        // 这里指定二进制文件的配置信息.
    }
}
```

</tab>
</tabs>

这个示例中的第一个参数指定一个名称前缀, 它会是二进制文件的默认名称.
比如, 在 Windows 平台, 这个示例会输出 `foo.exe` 和 `bar.exe`.
还可以使用这个名称前缀 [在构建脚本中访问二进制文件](#access-binaries).

## 访问二进制文件 {id="access-binaries"}

可以访问二进制文件来 [对其进行配置](multiplatform-dsl-reference.md#native-targets),
或者得到它们的属性 (比如, 得到输出文件的路径).

可以通过二进制文件的唯一名称来得到它.
这个名称由名称前缀(如果有指定), 构建类型, 以及二进制文件类型组成, 使用以下命名方式:
`<optional-name-prefix><build-type><binary-kind>`,
比如, `releaseFramework` 或 `testDebugExecutable`.

> 静态库和共享库分别带有 static 和 shared 后缀, 比如, `fooDebugStatic` 或 `barReleaseShared`.
>
{style="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// 如果二进制文件不存在, 这个函数会失败.
binaries["fooDebugExecutable"]
binaries.getByName("fooDebugExecutable")

// 如果二进制文件不存在, 这个函数会返回 null.
binaries.findByName("fooDebugExecutable")
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// 如果二进制文件不存在, 这个函数会失败.
binaries['fooDebugExecutable']
binaries.fooDebugExecutable
binaries.getByName('fooDebugExecutable')

// 如果二进制文件不存在, 这个函数会返回 null.
binaries.findByName('fooDebugExecutable')
```

</tab>
</tabs>

另一种方法是, 可以使用名称前缀和构建类型, 通过有类型的 get 方法访问二进制文件.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// 如果二进制文件不存在, 这个函数会失败.
binaries.getExecutable("foo", DEBUG)
binaries.getExecutable(DEBUG)          // 如果没有设置名称前缀, 可以省略第一个参数.
binaries.getExecutable("bar", "DEBUG") // 对于构建类型, 也可以使用字符串.

// 对其他二进制文件类型, 可以使用类似的 get 方法:
// getFramework, getStaticLib 以及 getSharedLib.

// 如果二进制文件不存在, 这个函数会返回 null.
binaries.findExecutable("foo", DEBUG)

// 对其他二进制文件类型, 可以使用类似的 get 方法:
// findFramework, findStaticLib 以及 findSharedLib.
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// 如果二进制文件不存在, 这个函数会失败.
binaries.getExecutable('foo', DEBUG)
binaries.getExecutable(DEBUG)          // 如果没有设置名称前缀, 可以省略第一个参数.
binaries.getExecutable('bar', 'DEBUG') // 对于构建类型, 也可以使用字符串.

// 对其他二进制文件类型, 可以使用类似的 get 方法:
// getFramework, getStaticLib 以及 getSharedLib.

// 如果二进制文件不存在, 这个函数会返回 null.
binaries.findExecutable('foo', DEBUG)

// 对其他二进制文件类型, 可以使用类似的 get 方法:
// findFramework, findStaticLib 以及 findSharedLib.
```

</tab>
</tabs>

## 将依赖项目导出到二进制文件 {id="export-dependencies-to-binaries"}

编译 Objective-C 框架, 或原生库(共享库或静态库)时, 经常会出现一种需要, 不仅要打包当前项目的类文件, 同时还要打包它的依赖项的类.
我们可以用 `export` 方法, 指定需要导出哪些依赖项到二进制文件中.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        macosMain.dependencies {
            // 这些依赖项会被导出.
            api(project(":dependency"))
            api("org.example:exported-library:1.0")
            // 这个依赖项不会被导出.
            api("org.example:not-exported-library:1.0")
        }
    }
    macosX64("macos").binaries {
        framework {
            export(project(":dependency"))
            export("org.example:exported-library:1.0")
        }
        sharedLib {
            // 可以对不同的二进制文件导出不同的依赖项目.
            export(project(':dependency'))
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        macosMain.dependencies {
            // 这些依赖项会被导出.
            api project(':dependency')
            api 'org.example:exported-library:1.0'
            // 这个依赖项不会被导出.
            api 'org.example:not-exported-library:1.0'
        }
    }
    macosX64("macos").binaries {
        framework {
            export project(':dependency')
            export 'org.example:exported-library:1.0'
        }
        sharedLib {
            // 可以对不同的二进制文件导出不同的依赖项目.
            export project(':dependency')
        }
    }
}
```

</tab>
</tabs>

比如, 你用 Kotlin 实现了几个模块, 并且想要在 Swift 中访问这些模块.
在一个 Swift 应用程序中无法使用多个 Kotlin/Native 框架, 但你可以创建一个 umbrella 框架, 把所有这些模块都导出到这个框架.

> 只能导出对应的源代码集的 [`api` 依赖项](gradle-configure-project.md#dependency-types).
>
{style="note"}

当你导出一个依赖项, 它的所有 API 到会包含框架 API 中.
编译器会向框架添加这个依赖项的代码, 即使你只使用了它的一小部分.
这就使得对导出的依赖项 (以及某种程度上对它的依赖项) 死代码消除功能不再有效.

默认情况下, 导出是非传递性的(non-transitively).
也就是说, 如果你导出的库 `foo` 依赖于库 `bar`, 只有 `foo` 中的方法会被添加到输出的框架中.

这种行为可以通过 `transitiveExport` 选项来修改.
如果设置为 `true`, 库 `bar` 中的声明也会被导出.

> 不推荐使用 `transitiveExport`: 它会将导出的依赖项的所有传递依赖项添加到框架.
> 这会增加编译时间, 并增大输出的二进制文件大小.
>
> 大多数情况下, 你不需要将所有这些依赖项添加到 framework API.
> 应该只对你需要在 Swift 或 Objective-C 代码中直接访问的依赖项, 明确使用 `export`.
>
{style="warning"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    framework {
        export(project(":dependency"))
        // 传递性导出.
        transitiveExport = true
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    framework {
        export project(':dependency')
        // 传递性导出.
        transitiveExport = true
    }
}
```

</tab>
</tabs>

## 构建通用框架(Universal Framework) {id="build-universal-frameworks"}

默认情况下, Kotlin/Native 编译产生的 Objective-C 框架只支持单个平台.
但是, 使用 [`lipo` 工具程序](https://llvm.org/docs/CommandGuide/llvm-lipo.html),
可以将多个框架合并为单个通用的(fat) 二进制文件.
对 32 位和 64 位 iOS 框架来说, 这种操作尤其合理.
这种情况下, 最终产生的通用框架可以同时运行在 32 位和 64 位设备上.

> fat 框架必须使用与原框架相同的基本名称(base name). 否则会发生错误.
>
{style="warning"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 创建并配置编译目标.
    val ios32 = watchosArm32("watchos32")
    val ios64 = watchosArm64("watchos64")
    configure(listOf(watchos32, watchos64)) {
        binaries.framework {
            baseName = "my_framework"
        }
    }
    // 创建 fat 框架的构建任务.
    tasks.register<FatFrameworkTask>("debugFatFramework") {
        // fat 框架必须使用与原框架相同的基本名称(base name).
        baseName = "my_framework"
        // 默认的输出目录是 "<build directory>/fat-framework".
        destinationDir = buildDir.resolve("fat-framework/debug")
        // 指定需要合并的框架.
        from(
            ios32.binaries.getFramework("DEBUG"),
            ios64.binaries.getFramework("DEBUG")
        )
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 创建并配置编译目标.
    targets {
        watchosArm32("watchos32")
        watchosArm64("watchos64")
        configure([watchos32, watchos64]) {
            binaries.framework {
                baseName = "my_framework"
            }
        }
    }
    // 创建 fat 框架的构建任务.
    tasks.register("debugFatFramework", FatFrameworkTask) {
        // fat 框架必须使用与原框架相同的基本名称(base name).
        baseName = "my_framework"
        // 默认的输出目录是 "<build directory>/fat-framework".
        destinationDir = file("$buildDir/fat-framework/debug")
        // 指定需要合并的框架.
        from(
            targets.ios32.binaries.getFramework("DEBUG"),
            targets.ios64.binaries.getFramework("DEBUG")
        )
    }
}
```

</tab>
</tabs>

## 构建 XCFramework {id="build-xcframeworks"}

所有的 Kotlin 跨平台项目都可以使用 XCFramework 作为输出, 将用于所有目标平台和架构的逻辑收集在单个 bundle 之内.
与 [单个通用的(fat)框架](#build-universal-frameworks) 不同,
在将应用程序发布到 App Store 之前, 你不需要删除所有不必要的架构.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework

plugins {
    kotlin("multiplatform")
}

kotlin {
    val xcf = XCFramework()
    val iosTargets = listOf(iosX64(), iosArm64(), iosSimulatorArm64())

    iosTargets.forEach {
        it.binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFrameworkConfig

plugins {
    id 'org.jetbrains.kotlin.multiplatform'
}

kotlin {
    def xcf = new XCFrameworkConfig(project)
    def iosTargets = [iosX64(), iosArm64(), iosSimulatorArm64()]

    iosTargets.forEach {
        it.binaries.framework {
            baseName = 'shared'
            xcf.add(it)
        }
    }
}
```

</tab>
</tabs>

在你声明 XCFramework 时, Kotlin Gradle plugin 会注册 3 个 Gradle task:
* `assembleXCFramework`
* `assembleDebugXCFramework` (额外的 debug artifact, 其中包含 [dSYMs](native-ios-symbolication.md))
* `assembleReleaseXCFramework`

如果在你的项目中使用 [CocoaPods 集成](native-cocoapods.md), 那么可以使用 Kotlin CocoaPods Gradle plugin 构建 XCFramework.
它包含以下 task, 使用所有已注册的编译目标构建 XCFramework, 并生成 podspec 文件:
* `podPublishReleaseXCFramework`, 生成 release 版 XCFramework 以及一个 podspec 文件.
* `podPublishDebugXCFramework`, 生成 debug 版 XCFramework 以及一个 podspec 文件.
* `podPublishXCFramework`, 生成 debug 版和 release 版 XCFramework 以及一个 podspec 文件.

通过这些 task, 可以帮助你将你的项目的共用部分从移动应用程序中分离出来, 单独通过 CocoaPod 发布.
你也可以使用 XCFramework 来发布到私有的或公共的 podspec 仓库.

> 如果 Kotlin 框架使用不同的 Kotlin 版本构建, 那么不推荐发布这些框架到公共仓库.
> 这样做可能导致在最终使用者的项目中发生冲突.
>
{style="warning"}

## 定制 Info.plist 文件

输出框架时, Kotlin/Native 编译器会生成信息属性列表文件, `Info.plist`.
你可以使用相应的二进制选项来定制其中的属性:

| 属性                           | 二进制                     |
|------------------------------|----------------------------|
| `CFBundleIdentifier`         | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`            |

要启用这个功能, 请对指定的框架使用 `-Xbinary=$option=$value` 编译器选项,
或通过 Gradle DSL 设置 `binaryOption("option", "value")`:

```kotlin
binaries {
    framework {
        binaryOption("bundleId", "com.example.app")
        binaryOption("bundleVersion", "2")
    }
}
```
