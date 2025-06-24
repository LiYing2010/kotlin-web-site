[//]: # (title: 平台库)

为了实现对操作系统原生服务的访问能力, Kotlin/Native 发布版包含了一组针对各个平台预先编译好的库.
这些库称为 _平台库_.

平台库中的包默认是可用的. 使用它们时, 不需要指定额外的链接选项.
Kotlin/Native 编译器会自动检测访问了哪些平台库, 并链接需要的库.

但是, 编译器发布版中的平台库仅仅只是包装并绑定到原生的库文件.
因此你必须在你的机器上安装原生库文件本身 (`.so`, `.a`, `.dylib`, `.dll`, 等等).

## POSIX 绑定 {id="posix-bindings"}

Kotlin 对所有基于 UNIX 和 Windows 的平台, 包括 Android 和 iOS, 提供了 POSIX 平台库.
这些平台库包含了与平台实现的绑定, 遵循 [`POSIX` 标准](https://en.wikipedia.org/wiki/POSIX).

要使用这个库, 请将它导入你的项目:

```kotlin
import platform.posix.*
```

> `platform.posix` 的内容在各个平台是不同的, 因为各个平台的 POSIX 具体实现也是略微不同的.
>
{style="note"}

你可以查看支持的各个平台的 `posix.def` 文件的内容:

* [iOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/ios/posix.def)
* [macOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/osx/posix.def)
* [tvOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/tvos/posix.def)
* [watchOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/watchos/posix.def)
* [Linux](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/linux/posix.def)
* [Windows (MinGW)](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/mingw/posix.def)
* [Android](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/android/posix.def)

对于 [WebAssembly](wasm-overview.md) 平台, 不能使用 POSIX 平台库.

## 流行的原生库 {id="popular-native-libraries"}

Kotlin/Native 提供了在不同的平台上广泛使用的各种流行的原生库的绑定, 例如 OpenGL, zlib, 和 Foundation.

在 Apple 平台, 包含了 `objc` 库, 以实现 [与 Objective-C API 的交互](native-objc-interop.md).

你可以在你的编译器发布版中查看适用于 Kotlin/Native 编译目标的原生库,
查看方法根据你的设定而不同:

* 如果你 [安装了独立的 Kotlin/Native 编译器](native-get-started.md#download-and-install-the-compiler):

    1. 进入编译器发布版解包后的目录, 例如, `kotlin-native-prebuilt-macos-aarch64-2.1.0`.
    2. 进入 `klib/platform` 目录.
    3. 选择目标平台对应的文件夹.

* 如果你在 IDE 中使用 Kotlin plugin (捆绑在 IntelliJ IDEA 和 Android Studio 中):

    1. 在你的命令行工具中, 运行以下命令, 进入 `.konan` 文件夹:

       <tabs>
       <tab title="macOS and Linux">

       ```none
       ~/.konan/
       ```

       </tab>
       <tab title="Windows">

       ```none
       %\USERPROFILE%\.konan
       ```

       </tab>
       </tabs>

    2. 打开 Kotlin/Native 编译器发布版, 例如, `kotlin-native-prebuilt-macos-aarch64-2.1.0`.
    3. 进入 `klib/platform` 目录.
    4. 选择目标平台对应的文件夹.

> 如果你想要查看每个支持的平台库的定义文件: 在编译器发布版文件夹中, 进入 `konan/platformDef` 目录, 选择需要的目标平台.
>
{style="tip"}

## 下一步做什么

[学习与 Swift/Objective-C 代码交互](native-objc-interop.md)
