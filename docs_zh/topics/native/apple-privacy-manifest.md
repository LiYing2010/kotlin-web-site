[//]: # (title: iOS App 的隐私清单(Privacy Manifest))

如果你的 App 想要发布到 Apple App Store, 并使用了 [需要声明使用原因的 API(required reasons API)](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api),
App Store Connect 可能会发出警告, 指出 App 没有正确的隐私清单(Privacy Manifest):

![Required reasons 警告](app-store-required-reasons-warning.png){width="700"}

这个问题会影响所有 Apple 生态系统的 App, 无论是原生的还是跨平台的.
你的 App 可能通过第三方库, 或通过 SDK, 使用了需要声明使用原因的 API, 这种关系可能并不明显.
Kotlin Multiplatform 可能是使用这些 API 的框架之一, 而你可能不会注意到这一点.

在本章中, 你会看到关于这个问题的详细介绍, 以及如何处理这个问题的建议.

> 本章反应的是 Kotlin 开发组目前对这个问题的理解.
> 如果我们对已接受的方法和变通方案有了更多数据和了解, 我们会更新本章, 以反应最新的信息.
>
{style="tip"}

## 有什么问题 {id="what-s-the-issue"}

Apple 对于 App Store 提交的要求 [在 2024 年春季发生了变化](https://developer.apple.com/news/?id=r1henawx).
如果 App 使用了那些需要声明使用原因的 API, 但没有在隐私清单中说明原因, 那么 [App Store Connect](https://appstoreconnect.apple.com) 不会接受这样的 App.

这是一种自动检查, 不是手动审核: 你的 App 的代码会被分析, 然后你会通过 EMmail 收到一份问题列表.
这封 EMail 会提到 "ITMS-91053: Missing API declaration" 问题,
列出 App 使用的, 被分类为 [需要声明使用原因](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)
类别的所有 API.

理想情况下, 你的 app 使用的所有 SDK 都会提供他们自己的隐私清单, 而且你不需要担心这一点.
但是如果你的某些依赖项没有提供隐私清单, 你的 App Store 提交可能会被标记为不正确.

## 如何解决这个问题 {id="how-to-resolve"}

在你尝试提交你的 App, 并从 App Store 收到详细的问题列表之后, 你可以遵照 Apple 文档构建你的清单:

* [隐私清单文件概述](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files)
* [在隐私清单中描述对数据的使用](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_data_use_in_privacy_manifests)
* [描述对需要声明使用原因的 API 的使用](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/describing_use_of_required_reason_api)

构建完成的清单文件是一组字典. 对每个使用的 API 类型, 要从给定的列表中选择一个或多个原因使用它的原因.
Xcode 会提供一个可视化的布局, 并为对每个栏目提供包含有效值的下拉列表, 帮助你编辑 `.xcprivacy` 文件.

你可以使用一个 [专门的工具](#find-usages-of-required-reason-apis), 在你的 Kotlin Framework 的依赖项中查找使用了哪些需要声明使用原因的 API,
还可以使用一个 [单独的 plugin](#place-the-xcprivacy-file-in-your-kotlin-artifacts)
来将 `.xcprivacy` 文件和你的 Kotlin 的 artifact 捆绑在一起.

如果一个新的隐私清单不能满足 App Store 的要求, 或者你不知道如何完成这些步骤,
请联系我们, 并在 [这个 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-67603) 中分享你的案例.

## 查找使用了哪些需要声明使用原因的 API {id="find-usages-of-required-reason-apis"}

你的 App 中的 Kotlin 代码, 或某个依赖项中的代码, 可能会访问来自库(比如 `platform.posix`)的需要声明使用原因的 API,
例如, `fstat`:

```kotlin
import platform.posix.fstat

fun useRequiredReasonAPI() {
    fstat(...)
}
```

某些情况下, 可能很难确定是哪个依赖项使用了需要声明使用原因的 API.
为了帮助你找到它, 我们创建了一个简单的工具.

要使用这个工具, 请在你的项目中 Kotlin Framework 声明目录中, 运行以下命令:

```shell
/usr/bin/python3 -c "$(curl -fsSL https://github.com/JetBrains/kotlin/raw/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py)"
```

你也可以单独 [下载这个脚本](https://github.com/JetBrains/kotlin/blob/rrf_v0.0.1/libraries/tools/required-reason-finder/required_reason_finder.py), 查看脚本内容, 然后使用 `python3` 运行它.

## 将 .xcprivacy 文件放入你的 Kotlin artifact 中 {id="place-the-xcprivacy-file-in-your-kotlin-artifacts"}

如果你需要将 `PrivacyInfo.xcprivacy` 文件和你的 Kotlin artifact 捆绑在一起, 请使用 `apple-privacy-manifests` plugin:

```kotlin
plugins {
    kotlin("multiplatform")
    kotlin("apple-privacy-manifests") version "1.0.0"
}

kotlin {
    privacyManifest {
        embed(
            privacyManifest = layout.projectDirectory.file("PrivacyInfo.xcprivacy").asFile,
        )
    }
}
```

plugin 会将隐私清单文件复制到 [对应的输出位置](https://developer.apple.com/documentation/bundleresources/privacy_manifest_files/adding_a_privacy_manifest_to_your_app_or_third-party_sdk?language=objc).

## 已知使用的 API {id="known-usages"}

### Compose Multiplatform {id="compose-multiplatform"}

使用 Compose Multiplatform 可能导致在你的二进制文件中使用 API `fstat`, `stat` 和 `mach_absolute_time`.
尽管这些函数不会用于追踪或指纹识别, 并且不会从设备发送数据, 但 Apple 还是可能会将它们标记为没有声明使用原因的 API.

如果你必须说明 `stat` 和 `fstat` 的使用原因, 请使用 `0A2A.1`.
对于 `mach_absolute_time` 的使用原因, 请使用 `35F9.1`.

关于 Compose Multiplatform 中使用的需要声明使用原因的 API, 进一步更新请参见 [这个 issue](https://github.com/JetBrains/compose-multiplatform/issues/4738).

### 1.9.10 或更早版本中的 Kotlin/Native 运行期库 {id="kotlin-native-runtime-in-versions-1-9-10-or-earlier"}

Kotlin/Native 运行期库中的 `mimalloc` 内存分配器, 使用了 `mach_absolute_time` API.
在 Kotlin 1.9.10 和更早版本中, 这是默认的内存分配器.

我们推荐更新到 Kotlin 1.9.20 或更高版本. 如果无法更新, 请变更内存分配器.
具体做法是, 在你的 Gradle 构建脚本中, 设置 `-Xallocator=custom` 编译选项, 使用目前的 Kotlin 内存分配器,
或设置 `-Xallocator=std` 编译选项, 使用系统的内存分配器.

详情请参见 [Kotlin/Native 内存管理](native-memory-manager.md).
