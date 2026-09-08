[//]: # (title: Kotlin/Native 支持的编译目标与主机)

本文档描述 Kotlin/Native 编译器支持哪些编译目标与主机.

> 未来我们可能会调整支持的编译目标与主机, 层级的数量, 以及它们的功能特性.
>
{style="tip"}

## 编译目标层级 {id="target-tiers"}

Kotlin/Native 编译器支持大量的编译目标, 但是对于不同的编译目标, 支持程度各不相同.
为了更清楚地说明这些支持程度, 我们根据编译器对编译目标的支持程度, 将它们分为几个层级.

层级列表包含以下几列:

* **Gradle 编译目标名称** 是一个 [编译目标名称](multiplatform-dsl-reference.md#targets),
  在 Kotlin Multiplatform Gradle plugin 中使用它来启用编译目标.
* **Target triple** 是一个符合 `<architecture>-<vendor>-<system>-<abi>` 格式的编译目标名称,
  [编译器通常使用这种格式](https://clang.llvm.org/docs/CrossCompilation.html#target-triple).
* **运行测试** 表示该编译目标是否允许用户在 Gradle 和 IDE 中开箱即用地运行测试
  (不要与针对编译目标本身运行的 CI 测试混淆).

  对于特定的编译目标, 运行测试只在原生主机上有效.
  例如, 你只能在 macOS ARM64 主机上运行 `macosArm64` 和 `iosArm64` 测试.

### 第 1 层 {id="tier-1"}

* 编译目标在 CI 环境进行过常规测试, 保证能够编译和运行.
* 我们在编译器发布版之间提供源代码和 [二进制兼容性](https://youtrack.jetbrains.com/issue/KT-42293).

| Gradle 编译目标名称         | Target triple                 | 运行测试 | 描述                                          |
|-----------------------|-------------------------------|------|---------------------------------------------|
| 以下仅限于 Apple macOS 主机: |                               |      |                                             |
| `macosArm64`          | `aarch64-apple-macos`         | ✅    | Apple Silicon 平台上的 Apple macOS 12.0 或更高版本   |
| `iosSimulatorArm64`   | `aarch64-apple-ios-simulator` | ✅    | Apple Silicon 平台上的 Apple iOS 模拟器 15.0 或更高版本 |
| `iosArm64`            | `aarch64-apple-ios`           |      | ARM64 平台上的 Apple iOS 和 iPadOS 15.0 或更高版本    |

### 第 2 层 {id="tier-2"}

* 编译目标在 CI 环境进行过常规测试, 保证能够编译, 但可能没有进行过自动测试, 保证能够运行.
* 我们尽最大努力来保证在编译器发布版之间提供源代码和 [二进制兼容性](https://youtrack.jetbrains.com/issue/KT-42293).

| Gradle 编译目标名称           | Target triple                     | 运行测试 | 描述                                             |
|-------------------------|-----------------------------------|------|------------------------------------------------|
| `linuxX64`              | `x86_64-unknown-linux-gnu`        | ✅    | x86_64 平台上的 Linux                              |
| `linuxArm64`            | `aarch64-unknown-linux-gnu`       |      | ARM64 平台上的 Linux                               |
| 以下仅限于 Apple macOS 主机:   |                                   |      |                                                |
| `watchosSimulatorArm64` | `aarch64-apple-watchos-simulator` | ✅    | Apple Silicon 平台上的 Apple watchOS 模拟器 8.0 或更高版本 |
| `watchosArm32`          | `armv7k-apple-watchos`            |      | ARM32 平台上的 Apple watchOS 8.0 或更高版本             |
| `watchosArm64`          | `arm64_32-apple-watchos`          |      | 使用 ILP32 的 ARM64 平台上的 Apple watchOS 8.0 或更高版本  |
| `tvosSimulatorArm64`    | `aarch64-apple-tvos-simulator`    | ✅    | Apple Silicon 平台上的 Apple tvOS 模拟器 15.0 或更高版本   |
| `tvosArm64`             | `aarch64-apple-tvos`              |      | ARM64 平台上的 Apple tvOS 15.0 或更高版本               |

### 第 3 层 {id="tier-3"}

* 编译目标不保证能够在 CI 环境中测试.
* 我们不能在不同的编译器发布版之间保证源代码和二进制兼容性, 但是, 对这些编译目标的不兼容变更极少发生.

> 第 3 层编译目标没有处于积极开发中, 可能存在严重问题.
> 请谨慎使用.
>
{style="warning"}

| Gradle 编译目标名称         | Target triple                   | 运行测试 | 描述                                                                |
|-----------------------|---------------------------------|------|-------------------------------------------------------------------|
| `androidNativeArm32`  | `arm-unknown-linux-androideabi` |      | ARM32 平台上的 [Android NDK](https://developer.android.com/ndk)       |
| `androidNativeArm64`  | `aarch64-unknown-linux-android` |      | ARM64 平台上的 [Android NDK](https://developer.android.com/ndk)       |
| `androidNativeX86`    | `i686-unknown-linux-android`    |      | x86 平台上的 [Android NDK](https://developer.android.com/ndk)         |
| `androidNativeX64`    | `x86_64-unknown-linux-android`  |      | x86_64 平台上的 [Android NDK](https://developer.android.com/ndk)      |
| `mingwX64`            | `x86_64-pc-windows-gnu`         | ✅    | 64 位 Windows 10 和之后版本 (使用 [MinGW](https://www.mingw-w64.org) 兼容层) |
| 以下仅限于 Apple macOS 主机: |                                 |      |                                                                   |
| `watchosDeviceArm64`  | `aarch64-apple-watchos`         |      | ARM64 平台上的 Apple watchOS 8.0 或更高版本                                |
| `iosX64`              | `x86_64-apple-ios-simulator`    | ✅    | x86-64 平台上的 Apple iOS 模拟器 15.0 或更高版本                              |

> `linuxArm32Hfp` 编译目标已被废弃, 将在未来的发布版中删除.
>
{style="note"}

### 已废弃的编译目标 {id="deprecated-targets"}

从 Kotlin 2.3.20 开始, 以下编译目标已被废弃:

* `macosX64` (x86_64 平台上的 Apple macOS)
* `watchosX64` (x86_64 平台上的 Apple watchOS 64-bit 模拟器)
* `tvosX64` (x86_64 平台上的 Apple tvOS 模拟器)

### 支持更低版本的 Apple 编译目标 {id="supporting-lower-apple-target-versions"}

目前, Apple 编译目标默认支持的最低版本为:

* iOS 和 tvOS: 15.0.
* macOS: 12.0.
* watchOS: 8.0.

如果你的项目需要支持比默认版本更低的版本, 请在你的构建文件中使用 `freeCompilerArgs` 选项:

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget>().configureEach {
        binaries.configureEach {
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.ios=14.0"
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.macos=11.0"
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.tvos=14.0"
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.watchos=7.0"
        }
    }
}
```

### 针对库的开发者 {id="for-library-authors"}

对于库的开发者, 我们不推荐测试比 Kotlin/Native 编译器更多的编译目标, 也不推荐支持比 Kotlin/Native 编译器更严格的兼容性保证.
在考虑支持原生编译目标时, 你可以使用以下方案:

* 支持第 1 层, 第 2 层, 第 3 层的全部编译目标.
* 定期测试第 1 层和第 2 层中默认支持运行测试的编译目标.

Kotlin 开发组在 Kotlin 官方库的开发中也使用这个方案,
例如, [kotlinx.coroutines](coroutines-guide.md) 和 [kotlinx.serialization](serialization.md).

## 主机 {id="hosts"}

Kotlin/Native 编译器支持以下主机:

| 主机操作系统                         | 构建最终二进制文件             | 生成 `.klib` artifact                      |
|--------------------------------|-----------------------|------------------------------------------|
| Apple Silicon (ARM64) 上的 macOS | 任何支持的编译目标             | 任何支持的编译目标                                |
| Intel 芯片 (x86_64) 上的 macOS     | 任何支持的编译目标             | 任何支持的编译目标                                |
| x86_64 架构的 Linux               | 任何支持的编译目标, Apple 目标除外 | 任何支持的编译目标, Apple 目标仅限于没有 cinterop 依赖项的情况 |
| x86_64 架构的 Windows (MinGW 工具链) | 任何支持的编译目标, Apple 目标除外 | 任何支持的编译目标, Apple 目标仅限于没有 cinterop 依赖项的情况 |

### 构建最终二进制文件 {id="building-final-binaries"}

要生成最终二进制文件, 你只能在 _支持的主机_ 上对 [支持的编译目标](#target-tiers) 进行编译.
例如, 你不能在 FreeBSD 主机上, 或在运行 ARM64 架构的 Linux 主机上, 生成最终二进制文件.

在 Linux 主机和 Windows 主机上, 为 Apple 编译目标构建最终二进制文件也是不可能的.

### 生成 `.klib` artifact {id="producing-klib-artifacts"}

通常, Kotlin/Native 允许任何 _支持的主机_ 为支持的编译目标生成 `.klib` artifact.

但是, 在 Linux 主机和 Windows 主机上, 为 Apple 编译目标生成 artifact 仍然存在一些限制.
如果你的项目使用了 [cinterop 依赖项](native-c-interop.md)
(包括 [CocoaPods](multiplatform-cocoapods-overview.md)),
你必须使用 macOS 主机.

例如, 你可以在 x86_64 架构的 Windows 机器上, 为 `macosArm64` 编译目标生成 `.klib`,
但前提是没有 cinterop 依赖项.

## 下一步做什么? {id="what-s-next"}

* [构建最终的原生二进制文件](multiplatform-build-native-binaries.md)
* [针对 Apple 目标平台的编译](multiplatform-publish-lib-setup.md#compilation-for-apple-targets)
