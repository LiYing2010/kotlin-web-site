---
type: doc
layout: reference
category:
title: "Kotlin/Native 支持的目标平台"
---

# Kotlin/Native 支持的目标平台

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin/Native 编译器支持大量的编译目标, 但是, 很难对所有编译目标提供同等程度的支持.
本文档描述 Kotlin/Native 支持哪些编译目标, 并根据编译器支持程度的不同, 将它们分为几个层级.

> 未来我们可能会调整层级的数量, 支持的编译目标, 以及它们的功能特性.
{:.tip}

请注意层级列表中使用到的以下名词:

* **Gradle 编译目标名称** 是一个 [编译目标预设定(preset)](../multiplatform/multiplatform-set-up-targets.html),
  在 Kotlin Multiplatform Gradle plugin 中使用它来启用编译目标.
* **Target triple** 是一个符合 `<architecture>-<vendor>-<system>-<abi>` 格式的编译目标名称,
  通常由 [编译器](https://clang.llvm.org/docs/CrossCompilation.html#target-triple) 使用.
* **运行测试** 表示是否默认支持在 Gradle 和 IDE 中运行测试.

  对于特定的编译目标, 运行测试只在原生主机上有效. 例如, 你只能在 macOS x86-64 主机上运行 `macosX64` 和 `iosX64` 测试.

## 第 1 层

* 编译目标在 CI 环境进行过常规测试, 保证能够编译和运行.
* 我们尽最大努力来保证在编译器发布版之间提供源代码和 [二进制兼容性](https://youtrack.jetbrains.com/issue/KT-42293).

| Gradle 编译目标名称   | Target triple                 | 运行测试 | 备注                                  |
|---------------------|-------------------------------|---------------|-------------------------------------|
| `linuxX64`          | `x86_64-unknown-linux-gnu`    | ✅             | x86_64 平台上的 Linux                   |
| 仅限 Apple macOS 主机 |                               |               |                                     |
| `macosX64`          | `x86_64-apple-macos`          | ✅             | x86_64 平台上的 Apple macOS             |
| `macosArm64`        | `aarch64-apple-macos`         | ✅             | Apple Silicon 平台上的 Apple macOS      |
| `iosSimulatorArm64` | `aarch64-apple-ios-simulator` | ✅             | Apple Silicon 平台上的 Apple iOS 模拟器 |
| `iosX64`            | `x86_64-apple-ios-simulator`  | ✅             | x86-64 平台上的 Apple iOS 模拟器 |

## 第 2 层

* 编译目标在 CI 环境进行过常规测试, 保证能够编译, 但可能没有进行过自动测试, 保证能够运行.
* 我们尽最大努力来保证在编译器发布版之间提供源代码和 [二进制兼容性](https://youtrack.jetbrains.com/issue/KT-42293).

| Gradle 编译目标名称      | Target triple                     | 运行测试 | Description                          |
|-------------------------|-----------------------------------|---------------|--------------------------------------|
| `linuxArm64`            | `aarch64-unknown-linux-gnu`       |               | ARM64 平台上的 Linux                     |
| 仅限 Apple macOS 主机  |                                   |               |                                      |
| `watchosSimulatorArm64` | `aarch64-apple-watchos-simulator` | ✅             | Apple Silicon 平台上的 Apple watchOS 模拟器 |
| `watchosX64`            | `x86_64-apple-watchos-simulator`  | ✅             | x86_64 平台上的 Apple watchOS 64-bit 模拟器 |
| `watchosArm32`          | `armv7k-apple-watchos`            |               | ARM32 平台上的 Apple watchOS             |
| `watchosArm64`          | `arm64_32-apple-watchos`          |               | ARM64 平台上的 with ILP32 Apple watchOS  |
| `tvosSimulatorArm64`    | `aarch64-apple-tvos-simulator`    | ✅             | Apple Silicon 平台上的 Apple tvOS 模拟器 |
| `tvosX64`               | `x86_64-apple-tvos-simulator`     | ✅             | x86_64 平台上的 Apple tvOS 模拟器  |
| `tvosArm64`             | `aarch64-apple-tvos`              |               | ARM64 平台上的 Apple tvOS          |
| `iosArm64`              | `aarch64-apple-ios`               |               | ARM64 平台上的 Apple iOS 和 iPadOS |

> 我们正在尽最大努力将 `iosArm64` 移动到第 1 层, 因为它对于 [Kotlin Multiplatform Mobile](../multiplatform-mobile/multiplatform-mobile-getting-started.html) 是一个至关重要的编译目标.
> 为了达到这个目的, 我们首先需要创建一个专用的测试平台, 因为平台的限制使得在 Apple 设备上很难运行编译器测试.
> 
> 目前, 我们有时会在 iOS 设备上手动运行测试, 而且依赖于类似编译目标的测试, 例如 `iosSimulatorArm64`,
> 对大多数情况来说已经足够了.
{:.tip}

## 第 3 层

* 编译目标不保证能够在 CI 环境中测试.
* 我们不能在不同的编译器发布版之间保证源代码和二进制兼容性, 但是, 对这些编译目标的不兼容变更极少发生.

| Gradle 编译目标名称     | Target triple                   | 运行测试 | Description                                                         |
|------------------------|---------------------------------|---------------|-----------------------------------------------------------------|
| `androidNativeArm32`   | `arm-unknown-linux-androideabi` |               | ARM32 平台上的 [Android NDK](https://developer.android.com/ndk)  |
| `androidNativeArm64`   | `aarch64-unknown-linux-android` |               | ARM64 平台上的 [Android NDK](https://developer.android.com/ndk) |
| `androidNativeX86`     | `i686-unknown-linux-android`    |               | x86 平台上的 [Android NDK](https://developer.android.com/ndk)  |
| `androidNativeX64`     | `x86_64-unknown-linux-android`  |               | x86_64 平台上的 [Android NDK](https://developer.android.com/ndk) |
| `mingwX64`             | `x86_64-pc-windows-gnu`         | ✅             | Windows 7 和之后版本上的 64 位 [MinGW](https://www.mingw-w64.org) |
| 仅限 Apple macOS 主机 |                                 |               |                                                                     |
| `watchosDeviceArm64`   | `aarch64-apple-watchos`         |               | ARM64 平台上的 Apple watchOS              |

## 已废弃的编译目标

以下编译目标从 Kotlin 1.8.20 开始已被废弃, 将在 1.9.20 中删除:

* `iosArm32`
* `watchosX86`
* `wasm32`
* `mingwX86`
* `linuxArm32Hfp`
* `linuxMips32`
* `linuxMipsel32`

## 针对库的开发者

对于库的开发者, 我们不推荐测试比 Kotlin/Native 编译器更多的编译目标, 也不推荐支持比 Kotlin/Native 编译器更严格的兼容性保证.
在考虑支持原生编译目标时, 你可以使用以下方案:

* 支持第 1 层, 第 2 层, 第 3 层的全部编译目标.
* 第 1 层和第 2 层中的, 默认支持运行测试的常规测试编译目标.

Kotlin 开发组在 Kotlin 官方库的开发中也使用这个方案, 例如, [kotlinx.coroutines](../coroutines/coroutines-guide.html) 和 [kotlinx.serialization](../serialization.html).
