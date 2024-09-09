---
type: doc
layout: reference
category: "Native"
title: "平台库"
---

# 平台库

最终更新: {{ site.data.releases.latestDocDate }}

为了实现对使用者的原生操作系统服务的访问能力, Kotlin/Native 发布版包含了一组针对各个平台预先编译好的库.
我们称之为 **平台库**.

### POSIX 绑定

对于所有基于 Unix 或 Windows 的平台 (包括 Android 和 iOS 编译平台) 我们提供了 POSIX 平台库.
其中包含对 [`POSIX` 标准](https://en.wikipedia.org/wiki/POSIX) 在各平台实现的绑定.

要使用这个库, 只需要导入它:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import platform.posix.*
```

</div>

唯一不能使用这个库的平台是 [WebAssembly](https://en.wikipedia.org/wiki/WebAssembly).

注意, `platform.posix` 的内容在各个平台是不同的, 因为各个平台的 POSIX 具体实现也是略微不同的.

### 流行的原生库

对于本机编译平台或交叉编译(cross-compilation)平台, 有很多可用的平台库.
Kotlin/Native 发布版, 在可用的平台上提供了对 OpenGL, zlib 以及其他流行的原生库的访问能力.

在 Apple 平台, 提供了 `objc` 库, 用于与 [Objective-C](https://en.wikipedia.org/wiki/Objective-C) 交互.

详情请参见 `Kotlin/Native` 发布版的 `dist/klib/platform/$target` 目录内容.

## 默认可用性

平台库中的包默认是可用的. 使用它们时, 不需要指定特别的链接参数.
Kotlin/Native 编译器会自动检测访问了哪些平台库, 并自动链接需要的库文件.

另一方面, `Kotlin/Native` 发布版中的平台库仅仅只是包装并绑定到原生的库文件.
因此原生库文件本身 (`.so`, `.a`, `.dylib`, `.dll` 等等)必须安装在机器上.
