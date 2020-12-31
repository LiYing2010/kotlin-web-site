---
type: doc
layout: reference
title: "构建最终的原生二进制文件"
---

# 构建最终的原生二进制文件

Kotlin/Native 编译目标默认会被编译输出为 `*.klib` 库文件,
这种库文件可以被 Kotlin/Native 用作依赖项, 但它不能执行, 也不能被用作一个原生的库.

如果要编译为最终的原生二进制文件, 比如可执行文件, 或共享库, 可以使用原生编译目标的 `binaries` 属性.
这个属性值是原生二进制文件的列表, 表示除默认的 `*.klib` 库文件之外, 这个编译目标还需要编译为哪些类型,
这个属性还提供了一组方法, 用来声明和配置这些原生二进制文件.

> `kotlin-multiplatform` plugin 默认不会创建任何产品版(production)的二进制文件.
> 默认情况下, 只会产生一个调试版(debug)的测试可执行文件, 你可以通过 `test` 编译任务来运行这个可执行文件内的单元测试.
{:.note}

## 声明二进制文件

请使用以下工厂方法来声明 `binaries` 列表中的元素.

| 工厂方法 | 二进制文件类型 | 可用于 |
|----------------|-------------|---------------|
| `executable` | 产品版的可执行文件 | 所有的原生编译目标 |
| `test` | 测试程序的可执行文件 | 所有的原生编译目标 |
| `sharedLib` | Shared 原生库 | 所有的原生编译目标, `WebAssembly` 除外 |
| `staticLib` | Static 原生库 | 所有的原生编译目标, `WebAssembly` 除外 |
| `framework` | Objective-C 框架 | 仅限于 macOS, iOS, watchOS, 和 tvOS 编译目标 |

最简单的版本不需要任何额外参数, 并对每一个构建类型创建一个二进制文件.
现在我们有 2 种构建类型:

* `DEBUG` – 产生一个未经优化的, 带调试信息的二进制文件
* `RELEASE` – 产生优化过的, 无调试信息的二进制文件

下面的代码会创建 2 个可执行的二进制文件: debug 和 release.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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

</div>

如果不需要[额外的配置](mpp-dsl-reference.html#native-targets), 那么可以省略这个 Lambda 表达式:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
binaries {
    executable()
}

```

</div>

还可以指定对哪些构建类型创建二进制文件.
下面的示例只创建 `debug` 版的二进制文件.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
binaries {
    executable([DEBUG]) {
        // 这里指定二进制文件的配置信息.
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
binaries {
    executable(listOf(DEBUG)) {
        // 这里指定二进制文件的配置信息.
    }
}
```

</div>
</div>

还可以使用自定义的名称来声明二进制文件.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
binaries {
    executable('foo', [DEBUG]) {
        // 这里指定二进制文件的配置信息.
    }

    // 可以省略构建类型 (这时会使用所有可用的构建类型).
    executable('bar') {
        // 这里指定二进制文件的配置信息.
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
binaries {
    executable("foo", listOf(DEBUG)) {
        // 这里指定二进制文件的配置信息.
    }

    // 可以省略构建类型 (这时会使用所有可用的构建类型).
    executable("bar") {
        // 这里指定二进制文件的配置信息.
    }
}
```

</div>
</div>

这个示例中的第一个参数指定一个名称前缀, 它会是二进制文件的默认名称.
比如, 在 Windows 平台, 这个示例会输出 `foo.exe` 和 `bar.exe`.
还可以使用这个名称前缀 [在构建脚本中访问二进制文件](#access-binaries).

## 访问二进制文件

可以访问二进制文件来 [对其进行配置](mpp-dsl-reference.html#native-targets),
或者得到它们的属性 (比如, 得到输出文件的路径).

可以通过二进制文件的唯一名称来得到它.
这个名称由名称前缀(如果有指定), 构建类型, 以及二进制文件类型组成, 使用以下命名方式:
`<optional-name-prefix><build-type><binary-kind>`,
比如, `releaseFramework` 或 `testDebugExecutable`.

> 静态库和共享库分别带有 static 和 shared 后缀, 比如, `fooDebugStatic` 或 `barReleaseShared`.
{:.note}

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
// 如果二进制文件不存在, 这个函数会失败.
binaries['fooDebugExecutable']
binaries.fooDebugExecutable
binaries.getByName('fooDebugExecutable')

// 如果二进制文件不存在, 这个函数会返回 null.
binaries.findByName('fooDebugExecutable')
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
// 如果二进制文件不存在, 这个函数会失败.
binaries["fooDebugExecutable"]
binaries.getByName("fooDebugExecutable")

// 如果二进制文件不存在, 这个函数会返回 null.
binaries.findByName("fooDebugExecutable")

```

</div>
</div>

另一种方法是, 可以使用名称前缀和构建类型, 通过有类型的 get 方法访问二进制文件.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

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

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

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

</div>
</div>

## 将依赖项目导出到二进制文件

编译 Objective-C 框架, 或原生库(共享库或静态库)时, 经常会出现一种需要, 不仅要打包当前项目的类文件, 同时还要打包它的依赖项的类.
我们可以用 `export` 方法, 指定需要导出哪些依赖项到二进制文件中.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

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

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

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

</div>
</div>

> 只能导出对应的源代码集的 [`api` 依赖项](using-gradle.html#dependency-types).
> 可以导出 maven 依赖项, 但由于 Gradle metadata 目前的限制, 这样的依赖项必须是一个平台相关的文件
> (比如, 应该是 `kotlinx-coroutines-core-native_debug_macos_x64` 而不是 `kotlinx-coroutines-core-native`),
> 否则的话, 必须是传递性(transitively)导出.
{:.note}

默认情况下, 导出是非传递性的(non-transitively).
也就是说, 如果你导出的库 `foo` 依赖于库 `bar`, 只有 `foo` 中的方法会被添加到输出的框架中.

这种行为可以通过 `transitiveExport` 标记来修改.
如果设置为 `true`, 库 `bar` 中的声明也会被导出.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
binaries {
   framework {
       export project(':dependency')
       // 传递性导出.
       transitiveExport = true
   }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
binaries {
    framework {
        export(project(":dependency"))
        // 传递性导出.
        transitiveExport = true
    }
}
```

</div>
</div>

比如, 假设你用 Kotlin 编写了几个模块, 然后想要在 Swift 中访问这些模块.
由于在一个 Swift 应用程序中无法使用多个 Kotlin/Native 框架, 因此你可以创建单个 umbrella 框架,
把所有这些模块都导出到这个框架.

## 构建通用框架(Universal Framework)

默认情况下, Kotlin/Native 编译产生的 Objective-C 框架只支持单个平台.
但是, 使用 [`lipo` 工具程序](https://llvm.org/docs/CommandGuide/llvm-lipo.html),
可以将多个框架合并为单个通用的(fat) 二进制文件.
对 32 位和 64 位 iOS 框架来说, 这种操作尤其合理.
这种情况下, 最终产生的通用框架可以同时运行在 32 位和 64 位设备上.

> fat 框架必须使用与原框架相同的基本名称(base name).
{:.note}

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 创建并配置编译目标.
    targets {
        iosArm32("ios32")
        iosArm64("ios64")
        configure([ios32, ios64]) {
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

</div>
</div>
<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 创建并配置编译目标.
    val ios32 = iosArm32("ios32")
    val ios64 = iosArm64("ios64")
    configure(listOf(ios32, ios64)) {
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

</div>
</div>
