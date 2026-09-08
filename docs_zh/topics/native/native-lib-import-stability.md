[//]: # (title: C, Objective-C 和 Swift 库的导入)

Kotlin/Native 提供了 [导入 C](native-c-interop.md) 和 [Objective-C](native-objc-interop.md) 库的能力.
你也可以通过变通方式, 将纯 [Swift 库](#swift-library-import) 导入到你的 Kotlin/Native 项目中.

## C 和 Objective-C 库导入功能的稳定性 {id="stability-of-c-and-objective-c-library-import"}
<primary-label ref="beta"/>

C 和 Objective-C 库的导入功能目前 [处于 Beta 阶段](components-stability.md#kotlin-native).

Beta 状态的主要原因之一是, 使用 C 和 Objective-C 库可能会影响你的代码与不同版本的 Kotlin, 依赖项和 Xcode 的兼容性.
这篇指南列出了实践中经常发生的兼容性问题, 仅在某些情况下才会出现的问题, 以及理论上的潜在问题.

为简单起见, 我们将 C 和 Objective-C 库, 或这里称为 _原生库_, 分为以下种类:

* [平台库](#platform-libraries), 是 Kotlin 默认提供的, 用于访问每个平台上的"系统"原生库.
* [第三方库](#third-party-libraries), 所有其他原生库, 需要额外配置才能供 Kotlin 使用.

这两种原生库具有不同的兼容性特性.

### 平台库 {id="platform-libraries"}

[_平台库_](native-platform-libs.md) 随 Kotlin/Native 编译器一起发布.
因此, 在项目中使用不同版本的 Kotlin, 会导致得到不同版本的平台库.
对于 Apple 目标平台 (例如 iOS), 平台库是根据特定的编译器版本支持的 Xcode 版本生成的.

随 Xcode SDK 发布的原生库 API 会随各个 Xcode 版本变化.
尽管在原生语言中, 这些变化是源代码兼容和二进制兼容的,
但由于互操作性的具体实现, 它们对 Kotlin 来说也可能变成破坏性变更.

因此, 更新项目中的 Kotlin 版本, 可能会带来平台库中的破坏性变更.
这个问题对两种情况很重要:

* 平台库中存在源代码破坏性变更, 影响了你项目中源代码的编译. 通常这很容易修复.
* 平台库中存在二进制破坏性变更, 影响了你的某些依赖项.
  通常没有简单的变通方法, 你需要等待库的开发者在他们那边修复这个问题,
  例如通过更新 Kotlin 版本.

  > 这种二进制不兼容性表现为链接警告和运行期异常.
  > 如果你希望在编译期检测到它们, 请使用
  > [`-Xpartial-linkage-loglevel=ERROR`](whatsnew19.md#library-linkage-in-kotlin-native) 编译器选项,
  > 将警告提升为错误.
  >
  {style="note"}

当 JetBrains 团队更新用于生成平台库的 Xcode 版本时, 会做出合理的努力, 避免平台库中的破坏性变更.
每当可能发生破坏性变更时, 团队会进行影响分析, 可能会决定忽略某个特定的变更 (因为受影响的 API 没有被大量使用),
或者进行临时性修复.

平台库发生破坏性变更的另一个潜在原因是, 将原生 API 转换为 Kotlin 的算法发生了变化.
JetBrains 团队也会做出合理的努力, 避免这种情况下的破坏性变更.

#### 使用平台库中新的 Objective-C 类 {id="using-new-objective-c-classes-from-platform-libraries"}

Kotlin 编译器不会禁止你使用在你的部署目标上不可用的 Objective-C 类.

例如, 如果你的部署目标是 iOS 17.0, 并且你使用了只在 iOS 18.0 中才出现的类, 编译器不会发出警告,
而你的应用程序在运行 iOS 17.0 的设备上启动时可能会崩溃.
此外, 即使代码的执行没有到达这些类的使用点, 这种崩溃也会发生, 因此使用版本检查来保护它们是不够的.

详情请参见 [强链接](native-objc-interop.md#strong-linking).

### 第三方库 {id="third-party-libraries"}

除了系统平台库之外, Kotlin/Native 还允许导入第三方原生库.
例如, 你可以使用 [CocoaPods 集成](multiplatform-cocoapods-overview.md),
或设置 [cinterops 配置](multiplatform-dsl-reference.md#cinterops).

#### 导入与 Xcode 版本不匹配的库 {id="importing-libraries-with-mismatched-xcode-version"}

导入第三方原生库可能会导致与不同 Xcode 版本的兼容性问题.

在处理原生库时, 编译器通常会使用本地安装的 Xcode 中的头文件,
因为几乎所有原生库的头文件都会导入来自 Xcode 的"标准"头文件 (例如 `stdint.h`).

因此 Xcode 的版本会影响原生库到 Kotlin 的导入.
这也是在使用第三方原生库时仍然不可能 [从非 Mac 主机交叉编译 Apple 目标平台](multiplatform-publish-lib-setup.md#compilation-for-apple-targets)
的原因之一.

每个 Kotlin 版本与单个 Xcode 版本兼容性最好. 这是推荐版本, 针对对应的 Kotlin 版本进行了最充分的测试.
请在 [兼容性一览表](multiplatform-compatibility-guide.md#version-compatibility) 中查看与特定 Xcode 版本的兼容性.

使用更新或更旧的 Xcode 版本通常是可行的, 但可能会导致问题, 通常会影响第三方原生库的导入.

##### Xcode 版本比推荐版本新 {id="xcode-version-is-newer-than-recommended"}

使用比推荐版本更新的 Xcode 版本可能会破坏 Kotlin 的某些功能.
导入第三方原生库受此影响最大. 使用不支持的 Xcode 版本时, 这个功能经常会完全无法正常工作.

##### Xcode 版本比推荐版本旧 {id="xcode-version-is-older-than-recommended"}

通常, Kotlin 与旧版 Xcode 配合良好. 偶尔可能会出现一些问题, 最常见的结果是:

* Kotlin API 引用了一个不存在的类型, 例如 [KT-71694](https://youtrack.jetbrains.com/issue/KT-71694) 的情况.
* 来自系统库的类型被包含在原生库的 Kotlin API 中.
  在这种情况下, 项目能够编译成功, 但系统原生类型会被添加到你的原生库包中.
  例如, 你可能会在 IDE 自动补全中意外的看到这个类型.

如果你的 Kotlin 库使用旧版 Xcode 成功编译, 那么发布它是安全的,
除非你 [在 Kotlin 库 API 中使用了第三方库的类型](#using-native-types-in-library-api).

#### 使用传递性的第三方原生依赖项 {id="using-a-transitive-third-party-native-dependency"}

如果你项目中的一个 Kotlin 库, 导入第三方原生库, 用作它的实现的一部分,
那么你的项目也能访问这个原生库.
这是因为 Kotlin/Native 不区分 `api` 和 `implementation` 依赖项类型,
所以原生库最终总是成为 `api` 依赖项.

使用这样的传递性原生依赖项更容易发生兼容性问题.
例如, Kotlin 库开发者所做的变更, 可能会使原生库的 Kotlin 表达变得不兼容,
从而在你更新 Kotlin 库时导致兼容性问题.

因此, 不要依赖传递性的依赖项, 而应该直接配置与同一个原生库的互操作性.
为了这个目的, 请为原生库使用另一个包名, 类似于 [使用自定义包名](#use-custom-package-name),
以防止兼容性问题.

#### 在库 API 中使用原生类型 {id="using-native-types-in-library-api"}

如果你发布一个 Kotlin 库, 请注意库 API 中的原生类型.
这类用法预计在未来会被修改, 以修复兼容性问题和其他问题, 这将影响你的库用户.

在某些情况下, 在库 API 中使用原生类型是必要的, 因为库的用途需要这样,
例如, 当 Kotlin 库基本上是提供对原生库的扩展时.
如果你的情况不是这样, 在库 API 中, 请不要使用, 或尽可能少的使用原生类型.

这个建议只适用于在库 API 中使用原生类型的情况, 与应用程序代码无关.
也不适用于库的实现, 例如:

```kotlin
// 特别注意! 库 API 中使用了原生类型:
public fun createUIView(): UIView
public fun handleThirdPartyNativeType(c: ThirdPartyNativeType)

// 照常注意; 库 API 中没有使用原生类型:
internal fun createUIViewController(): UIViewController
public fun getDate(): String = NSDate().toString()
```

#### 发布使用了第三方库的库 {id="publishing-a-library-that-uses-third-party-library"}

如果你发布一个使用了第三方原生库的 Kotlin 库, 可以采取一些措施来避免兼容性问题.

##### 使用自定义的包名 {id="use-custom-package-name"}

为第三方原生库使用自定义的包名, 有助于防止兼容性问题.

原生库导入 Kotlin 时, 它会获得一个 Kotlin 包名. 如果包名不唯一, 库的使用者可能会遇到冲突.
例如, 如果原生库在用户项目的其他地方, 或其他依赖项中, 使用相同的包名导入, 这两处使用就会发生冲突.

在这种情况下, 编译可能会失败, 错误是 `Linking globals named '...': symbol multiply defined!`.
但也可能出现其他错误, 甚至编译成功.

为第三方原生库使用自定义的名称, 方法是:

* 通过 CocoaPods 集成导入原生库时,
  请在 Gradle 构建脚本的 `pod {}` 代码块中, 使用 [`packageName`](multiplatform-cocoapods-dsl-reference.md#pod-function) 属性.
* 使用 `cinterops` 配置导入原生库时, 
  请在配置代码块中, 使用 [`packageName`](multiplatform-dsl-reference.md#cinterops) 属性.

##### 检查与旧版本 Kotlin 的兼容性 {id="check-compatibility-with-older-kotlin-versions"}

发布 Kotlin 库时, 使用第三方原生库可能会影响库与其他 Kotlin 版本的兼容性, 具体来说:

* Kotlin Multiplatform 库不保证向前兼容性
  (向前兼容性是指, 旧版本编译器可以使用新版本编译器编译的库).

  在实际运用中, 某些情况下可以工作; 但是, 使用原生库可能会进一步限制向前兼容性.

* Kotlin Multiplatform 库提供向后兼容性
  (向后兼容性是指, 新版本编译器可以使用旧版本编译器编译的库).

  在 Kotlin 库中使用原生库, 通常不应影响它的向后兼容性.
  但这会提高影响兼容性的编译器 Bug 的可能性.

##### 避免嵌入静态库 {id="avoid-embedding-static-libraries"}

导入原生库时, 可以使用 `-staticLibrary` 编译器选项, 或 `.def` 文件中的 `staticLibraries` 属性,
包含关联的 [静态库](native-definition-file.md#include-a-static-library)(`.a` 文件).
这样, 你的库的使用者就不需要处理原生依赖项和链接器选项.

但是, 对所包含的静态库的使用, 无法以任何方式配置: 既不能排除, 也不能替换(替代)它. 
因此, 如果其他 Kotlin 库也包含相同的静态库, 就会存在潜在的冲突, 使用者将无法解决这种冲突, 也不能调整库的版本.

### 原生库支持的演进 {id="evolution-of-native-library-support"}

目前, 在 Kotlin 项目中使用 C 和 Objective-C 可能导致兼容性问题; 其中一些在这篇指南中已列出.
为了修复这些问题, 未来可能需要一些破坏性变更, 这本身也会带来兼容性问题.

## Swift 库导入 {id="swift-library-import"}

Kotlin/Native 不支持直接导入纯 Swift 库. 但是, 有几种变通方案.

一种方案是, 使用手动的 Objective-C 桥接.
使用这种方案时, 你需要编写自定义的 Objective-C 包装器和 `.def` 文件, 并通过 cinterop 使用这些包装器.

但在大多数情况下, 我们建议使用 _反向导入_ 方案:
你在 Kotlin 端定义期望的行为, 在 Swift 端实现实际的功能, 并将其传回 Kotlin.

你可以通过两种方式之一来定义期望的部分:

* 创建接口.
  基于接口的方案对于多个函数和可测试性有更好的扩展性.
* 使用 Swift 闭包.
  这个方案非常适合快速原型, 但有它的局限性 — 例如, 它不能保持状态.

请看下面的示例, 它将 Swift 库 [CryptoKit](https://developer.apple.com/documentation/cryptokit/)
反向导入 Kotlin 项目:

<tabs>
<tab title="接口方案">

1. 在 Kotlin 端, 创建一个接口, 描述 Kotlin 期望 Swift 的行为:

   ```kotlin
   // CryptoProvider.kt
   interface CryptoProvider {
       fun hashMD5(input: String): String
   }
   ```

2. 在 Kotlin 端, 从 `MainViewController` 传递平台特定的实现, 然后在 `App` composable 中作为参数接收它, 并在需要的地方使用:

    ```kotlin
    // App.kt
    @Composable
    fun App(cryptoProvider: CryptoProvider) {
        // UI 中的使用示例
        val hashed = cryptoProvider.hashMD5("Hello, world!")
        androidx.compose.material3.Text("Compose: $hashed")
    }
    ```

    ```kotlin
    // MainViewController.kt
    fun MainViewController(cryptoProvider: CryptoProvider) = ComposeUIViewController {
        App(cryptoProvider)
    }
    ```

3. 在 Swift 端, 使用纯 Swift 库 CryptoKit 实现 MD5 哈希功能:

    ```swift
    // iosApp/ContentView.swift
    import CryptoKit

    class IosCryptoProvider: CryptoProvider {
        func hashMD5(input: String) -> String {
            guard let data = input.data(using: .utf8) else { return "failed" }
            return Insecure.MD5.hash(data: data).description
        }
    }
    ```

4. 将 Swift 实现传递给 Kotlin 组件:

   ```swift
   // iosApp/ContentView.swift
   struct ComposeView: UIViewControllerRepresentable {
       func makeUIViewController(context: Context) -> UIViewController {
           // 将 Swift 实现注入到 Kotlin UI 入口点
           MainViewControllerKt.MainViewController(cryptoProvider: IosCryptoProvider())
       }

       func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
   }
   ```

</tab>
<tab title="Swift 闭包方案">

1. 在 Kotlin 端, 声明一个函数参数, 并在需要的地方使用它:

    ```kotlin
    // App.kt
    @Composable
    fun App(md5Hasher: (String) -> String) {
        // UI 中的使用示例
        val hashed = md5Hasher("Hello, world!")
        androidx.compose.material3.Text("Compose: $hashed")
    }
    ```

    ```kotlin
    // MainViewController.kt
    fun MainViewController(md5Hasher: (String) -> String) = ComposeUIViewController {
        App(md5Hasher)
    }
    ```

2. 在 Swift 端, 使用 CryptoKit 库构建 MD5 哈希器, 并将它作为闭包传递:

    ```swift
    // iosApp/ContentView.swift
    import CryptoKit
    import SwiftUI

    struct ComposeView: UIViewControllerRepresentable {
        func makeUIViewController(context: Context) -> UIViewController {
            MainViewControllerKt.MainViewController(md5Hasher: { input in
                guard let data = input.data(using: .utf8) else { return "failed" }
                return Insecure.MD5.hash(data: data).description
            })
        }

        func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
    }
    ```

</tab>
</tabs>

在更复杂的项目中, 使用依赖注入, 将 Swift 实现传回 Kotlin 更为方便.
详情请参见 [依赖注入框架](multiplatform-connect-to-apis.md#dependency-injection-framework),
或查看 [Koin 框架](https://insert-koin.io/docs/reference/koin-mp/kmp/) 文档.
