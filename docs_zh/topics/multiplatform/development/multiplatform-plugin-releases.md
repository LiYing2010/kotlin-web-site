[//]: # (title: Kotlin Multiplatform IDE Plugin 的发布版本)

[Kotlin Multiplatform IDE plugin](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)
能够帮助你开发针对 Android, iOS, Desktop, 和 Web 的跨平台应用程序.
请确认你安装了这个 plugin 最新发布版本, 以便使用 Kotlin Multiplatform 项目.

> IDE plugin 目前只能用于 macOS, 未来会支持 Windows 和 Linux.
>
{style="note"}

这个 plugin 兼容 IntelliJ IDEA (2025.1.1.1 之后版本) 和 Android Studio ( Narwhal 2025.1.1 之后版本).

> 关于 Kotlin Multiplatform Gradle plugin, 更多详情请参见它的 [DSL 参考文档](multiplatform-dsl-reference.md)
> 和 [兼容性指南](multiplatform-compatibility-guide.md).
>
{style="tip"}

## 更新到最新发布版 {id="update-to-the-latest-release"}

如果出现了新的 Kotlin Multiplatform plugin 发布版, IDE 会建议你更新.
如果你接受建议, plugin 会更新到最新版本.
要完成 plugin 的安装, 请重新启动你的 IDE.

你可以通过菜单 **Settings** | **Plugins**, 查看 plugin 的版本, 并手动更新它.

为了让 plugin 正确工作, 你需要一个兼容的 Kotlin 版本. 你可以在 [发布版本详情](#release-details) 中找到对应的兼容版本.
要查看和更新你的 Kotlin 版本, 请选择菜单 **Settings** | **Plugins**,
或 **Tools** | **Kotlin** | **Configure Kotlin in Project**.

> 如果你没有安装兼容的 Kotlin 版本, Kotlin Multiplatform plugin 将会被禁用.
> 请更新你的 Kotlin, 然后通过菜单 **Settings** | **Plugins**, 再次启用 plugin.
>
{style="note"}

## 发布版本详情 {id="release-details"}

下表列出了 Kotlin Multiplatform IDE plugin 发布版信息:

<table>
<tr>
<th>
发布版
</th>
<th>
主要功能
</th>
<th>
兼容的 Kotlin 版本
</th>
</tr>
<tr id="0.9">
<td>

**0.9**

发布日期: 2025/05/19

</td>
<td>

Kotlin Multiplatform plugin 已经彻底重建:

* 对支持的 IDE 集成了 **New Project** 向导.
* 预先检查环境, 有助于发现和解决设置问题, 包括 Java, Android, Xcode, 和 Gradle.
* 对所有支持的平台自动生成运行配置, 并带有用于 iOS 和 Android 的设备选择器.
* 跨语言支持: 针对 Swift 和 Kotlin 的跨语言导航和调试, 以及 Swift 语法高亮和快速文档.
* Compose Multiplatform 支持: Kotlin Multiplatform plugin 现在支持 Compose Multiplatform 资源,
  自动完成, 以及共通代码的 UI 预览
  (可以安全的删除 [以前的 Compose Multiplatform plugin](https://plugins.jetbrains.com/plugin/16541-compose-multiplatform-ide-support)).
* Compose 热重载(Hot Reload): 不需要重启 App, 即可立即查看 UI 的变更 (使用 Desktop JVM 目标平台).
  详情请参见 [Hot Reload 文档](compose-hot-reload.md).

已知的问题:

* 在 Android Studio 中, Compose 调试器目前不支持 Kotlin 2.1.20 和 2.1.21.
  这个问题将在 Kotlin 2.2.0-RC2 中修正.

</td>
<td>

plugin 支持 [任何 Kotlin 版本](releases.md#release-details),
但它的大部分功能依赖于 Kotlin 2.1.21.
请更新到 Kotlin 的最新稳定版本, 以确保获得最好的体验.

这个版本还需要 K2 模式, 请确认启用了 K2 模式:
在 **Settings** | **Languages & Frameworks** | **Kotlin**, 选择 **Enable K2 mode**.

</td>
</tr>
<tr>
<td>

**0.8.4**

发布日期: 2024/12/06

</td>
<td>

* 支持 Kotlin 的 [K2 模式](k2-compiler-migration-guide.md#support-in-ides), 改进了稳定性和代码分析.

</td>
<td>

[Kotlin plugin 的任何版本](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.8.3**

发布日期: 2024/07/23

</td>
<td>

* 修正了对 Xcode 的兼容性问题.

</td>
<td>

[Kotlin plugin 的任何版本](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.8.2**

发布日期: 2024/05/16

</td>
<td>

* 支持 Android Studio Jellyfish, 以及新的 Canary 版, Koala.
* 在共用模块中添加 `sourceCompatibility` 和 `targetCompatibility` 声明.
</td>
<td>

[Kotlin plugin 的任何版本](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.8.1**

发布日期: 2023/11/09

</td>
<td>

* Kotlin 更新到 1.9.20.
* Jetpack Compose 更新到 1.5.4.
* 默认启用 Gradle 构建和配置的缓存.
* 对新的 Kotlin 版本重构了构建配置.
* iOS framework 默认为静态模式.
* 修正了 iOS 设备上使用 Xcode 15 时的一个问题.

</td>
<td>

[Kotlin Plugin 的任何版本](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.8.0**

发布日期: 2023/10/05

</td>
<td>

* [KT-60169](https://youtrack.jetbrains.com/issue/KT-60169) 迁移到 Gradle 版本目录.
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) `android` 重命名为 `androidTarget`.
* [KT-59269](https://youtrack.jetbrains.com/issue/KT-59269) 更新了 Kotlin 和其他依赖项的版本.
* [KTIJ-26773](https://youtrack.jetbrains.com/issue/KTIJ-26773) 重构, 使用 `-destination` 参数, 代替 `-sdk` 和 `-arch`.
* [KTIJ-25839](https://youtrack.jetbrains.com/issue/KTIJ-25839) 重构了生成的文件名.
* [KTIJ-27058](https://youtrack.jetbrains.com/issue/KTIJ-27058) 添加了 JVM 构建目标配置.
* [KTIJ-27160](https://youtrack.jetbrains.com/issue/KTIJ-27160) 支持 Xcode 15.0.
* [KTIJ-27158](https://youtrack.jetbrains.com/issue/KTIJ-27158) 将新的模块向导移动到实验状态.

</td>
<td>

[Kotlin Plugin 的任何版本](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.6.0**

发布日期: 2023/05/24

</td>
<td>

* 支持新的 Canary Android Studio Hedgehog.
* 更新 Kotlin, Gradle, 以及 Multiplatform 项目中库的版本.
* 在 Multiplatform 项目中使用了新的 [`targetHierarchy.default()`](whatsnew1820.md#new-approach-to-source-set-hierarchy).
* 在 Multiplatform 项目中, 对平台特定的文件使用源代码集名称后缀.

</td>
<td>

[Kotlin Plugin 的任何版本](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.5.3**

发布日期: 2023/04/12

</td>
<td>

* 更新了 Kotlin 和 Compose 的版本.
* 修正了 Xcode 项目 scheme 解析的一个问题.
* 添加了 scheme 的 product 类型检查.
* 如果 `iosApp` scheme 存在, 默认选中.

</td>
<td>

[Kotlin Plugin 的任何版本](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.5.2**

发布日期: 2023/01/30

</td>
<td>

* [修正了 Kotlin/Native 调试器的一个问题 (Spotlight 索引缓慢)](https://youtrack.jetbrains.com/issue/KT-55988).
* [修正了多模块项目中的 Kotlin/Native 调试器](https://youtrack.jetbrains.com/issue/KT-24450).
* [针对 Android Studio Giraffe 2022.3.1 Canary 的新构建版本](https://youtrack.jetbrains.com/issue/KT-55274).
* [对 iOS App 构建添加了 provisioning 标记](https://youtrack.jetbrains.com/issue/KT-55204).
* [在生成的 iOS 项目中, 对 **Framework Search Paths** 选项添加了继承的路径](https://youtrack.jetbrains.com/issue/KT-55402).

</td>
<td>

[Kotlin Plugin 的任何版本](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.5.1**

发布日期: 2022/11/30

</td>
<td>

* [新项目生成时的修正: 删除不需要的 "app" 目录](https://youtrack.jetbrains.com/issue/KTIJ-23790).

</td>
<td>

[Kotlin 1.7.0—*](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.5.0**

发布日期: 2022/11/22

</td>
<td>

* [修改 iOS framework distribution 的默认选项: 现在是 **Regular framework**](https://youtrack.jetbrains.com/issue/KT-54086).
* [在生成的 Android 项目中, 将 `MyApplicationTheme` 移动到单独的文件](https://youtrack.jetbrains.com/issue/KT-53991).
* [修改了生成的 Android 项目](https://youtrack.jetbrains.com/issue/KT-54658).
* [修正了新建项目的目录被意外删除的问题](https://youtrack.jetbrains.com/issue/KTIJ-23707).

</td>
<td>

[Kotlin 1.7.0—*](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.3.4**

发布日期: 2022/09/12

</td>
<td>

* [将 Android 应用程序迁移到 Jetpack Compose](https://youtrack.jetbrains.com/issue/KT-53162).
* [删除旧的 HMPP flag](https://youtrack.jetbrains.com/issue/KT-52248).
* [在 Android manifest 中删除包名称](https://youtrack.jetbrains.com/issue/KTIJ-22633).
* [对 Xcode 项目更新 `.gitignore`](https://youtrack.jetbrains.com/issue/KT-53703).
* [更新向导项目, 更好的演示 expect/actual 功能](https://youtrack.jetbrains.com/issue/KT-53928).
* [更新与 Android Studio Canary 版的兼容性](https://youtrack.jetbrains.com/issue/KTIJ-22063).
* [对 Android 应用程序, 最小 Android SDK 版本更新为 21](https://youtrack.jetbrains.com/issue/KTIJ-22505).
* [修正安装之后初次启动时的问题](https://youtrack.jetbrains.com/issue/KTIJ-22645).
* [修正 M1 上的 Apple 运行配置的问题](https://youtrack.jetbrains.com/issue/KTIJ-21781).
* [修正 Windows OS 上 `local.properties` 的问题](https://youtrack.jetbrains.com/issue/KTIJ-22037).
* [修正 Android Studio Canary 版中 Kotlin/Native 调试器的问题](https://youtrack.jetbrains.com/issue/KT-53976).

</td>
<td>

[Kotlin 1.7.0—1.7.*](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.3.3**

发布日期: 2022/06/09

</td>
<td>

* 依赖项更新为 Kotlin IDE plugin 1.7.0.

</td>
<td>

[Kotlin 1.7.0—1.7.*](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.3.2**

发布日期: 2022/04/04

</td>
<td>

* 修正在 Android Studio 2021.2 和 2021.3 上的 iOS 应用程序调试性能问题.

</td>
<td>

[Kotlin 1.5.0—1.6.*](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.3.1**

发布日期: 2022/02/15

</td>
<td>

* [在 Kotlin Multiplatform Mobile 向导中启用 M1 iOS 模拟器](https://youtrack.jetbrains.com/issue/KT-51105).
* 对 XcProject 创建索引时的性能改善: [KT-49777](https://youtrack.jetbrains.com/issue/KT-49777), [KT-50779](https://youtrack.jetbrains.com/issue/KT-50779).
* 清理构建脚本: 使用 `kotlin("test")`, 代替 `kotlin("test-common")` 和 `kotlin("test-annotations-common")`.
* 增加与 [Kotlin plugin 版本](https://youtrack.jetbrains.com/issue/KTIJ-20167) 的兼容范围.
* [修正在 Windows 主机上的 JVM 调试问题](https://youtrack.jetbrains.com/issue/KT-50699).
* [修正禁用 plugin 后的版本错误问题](https://youtrack.jetbrains.com/issue/KT-50699).

</td>
<td>

[Kotlin 1.5.0—1.6.*](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.3.0**

发布日期: 2021/11/16

</td>
<td>

* [新的 Kotlin Multiplatform Library 向导](https://youtrack.jetbrains.com/issue/KTIJ-19367).
* 支持 Kotlin 跨平台库的新发布类型: [XCFramework](multiplatform-build-native-binaries.md#build-xcframeworks).
* 对新跨平台移动项目启用 [层级项目结构](multiplatform-hierarchy.md#manual-configuration).
* 支持 [iOS 编译目标的明确声明](https://youtrack.jetbrains.com/issue/KT-46861).
* [在非 Mac 机器上启用 Kotlin Multiplatform Mobile plugin 向导](https://youtrack.jetbrains.com/issue/KT-48614).
* [在 Kotlin Multiplatform 模块向导中支持子文件夹](https://youtrack.jetbrains.com/issue/KT-47923).
* [支持 Xcode `Assets.xcassets` 文件](https://youtrack.jetbrains.com/issue/KT-49571).
* [修正了 plugin 的类装载器异常](https://youtrack.jetbrains.com/issue/KT-48103).
* 更新了 CocoaPods Gradle Plugin 模板.
* 改进了 Kotlin/Native 调试器的类型计算.
* 修正了使用 Xcode 13 的 iOS 设备启动功能.

</td>
<td>

[Kotlin 1.6.0](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.2.7**

发布日期: 2021/08/02

</td>
<td>

* [为 AppleRunConfiguration 添加了 Xcode 配置选项](https://youtrack.jetbrains.com/issue/KTIJ-19054).
* [添加了 Apple M1 模拟器支持](https://youtrack.jetbrains.com/issue/KT-47618).
* [在项目向导中添加了关于 Xcode 集成选项的信息](https://youtrack.jetbrains.com/issue/KT-47466).
* [当一个使用 CocoaPods 的项目生成后, 但 CocoaPods gem 没有安装时, 添加了错误通知](https://youtrack.jetbrains.com/issue/KT-47329).
* [在使用 Kotlin 1.5.30 生成的共用模块中, 添加了 Apple M1 模拟器编译目标支持](https://youtrack.jetbrains.com/issue/KT-47631).
* [清除使用 Kotlin 1.5.20 生成的 Xcode 项目](https://youtrack.jetbrains.com/issue/KT-47465).
* 修正了真实 iOS 设备上启动 Xcode 的发布配置.
* 修正了使用 Xcode 12.5 启动模拟器的功能.

</td>
<td>

[Kotlin 1.5.10](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.2.6**

发布日期: 2021/06/10

</td>
<td>

* 兼容 Android Studio Bumblebee Canary 1.
* 支持 [Kotlin 1.5.20](whatsnew1520.md): 在项目向导中为 Kotlin/Native 使用新的框架打包任务.

</td>
<td>

[Kotlin 1.5.10](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.2.5**

发布日期: 2021/05/25

</td>
<td>

* [修正了与 Android Studio Arctic Fox 2020.3.1 Beta 1 及更高版本的兼容问题](https://youtrack.jetbrains.com/issue/KT-46834).

</td>
<td>

[Kotlin 1.5.10](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.2.4**

发布日期: 2021/05/05

</td>
<td>

对 Android Studio 4.2 或 Android Studio 2020.3.1 Canary 8 或 更高版本, 请使用这个 plugin 版本.
* 兼容 [Kotlin 1.5.0](whatsnew15.md).
* [在新的 Kotlin Multiplatform 模块中能够使用 CocoaPods 依赖项管理器, 用于 iOS 集成](https://youtrack.jetbrains.com/issue/KT-45946).

</td>
<td>

[Kotlin 1.5.0](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.2.3**

发布日期: 2021/04/05

</td>
<td>

* [项目向导: 命名模块的改进](https://youtrack.jetbrains.com/issues?q=issue%20id:%20KT-43449,%20KT-44060,%20KT-41520,%20KT-45282).
* [在项目向导中能够使用 CocoaPods 依赖项管理器, 用于 iOS 集成](https://youtrack.jetbrains.com/issue/KT-45478).
* [新项目中 `gradle.properties` 文件更好的可读性](https://youtrack.jetbrains.com/issue/KT-42908).
* [如果不选中 "Add sample tests for Shared Module", 则不再生成示例测试](https://youtrack.jetbrains.com/issue/KT-43441).
* [Bug 修正和其它改进](https://youtrack.jetbrains.com/issues?q=Subsystems:%20%7BKMM%20Plugin%7D%20Type:%20Feature,%20Bug%20State:%20-Obsolete,%20-%7BAs%20designed%7D,%20-Answered,%20-Incomplete%20resolved%20date:%202021-03-10%20..%202021-03-25).

</td>
<td>

[Kotlin 1.4.30](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.2.2**

发布日期: 2021/03/03

</td>
<td>

* [能够在 Xcode 中打开 Xcode 相关文件](https://youtrack.jetbrains.com/issue/KT-44970).
* [能够在 iOS 运行配置中为 Xcode 项目文件设置位置](https://youtrack.jetbrains.com/issue/KT-44968).
* [支持 Android Studio 2020.3.1 Canary 8](https://youtrack.jetbrains.com/issue/KT-45162).
* [Bug 修正和其它改进](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.2%20).

</td>
<td>

[Kotlin 1.4.30](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.2.1**

发布日期: 2021/02/15

</td>
<td>

对 Android Studio 4.2, 请使用这个 plugin 版本.
* 基础组件改进.
* [Bug 修正和其它改进](https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.1%20).

</td>
<td>

[Kotlin 1.4.30](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.2.0**

发布日期: 2020/11/23

</td>
<td>

* [支持 iPad 设备](https://youtrack.jetbrains.com/issue/KT-41932).
* [支持 Xcode 中配置的自定义 scheme 名称](https://youtrack.jetbrains.com/issue/KT-41677).
* [能够为 iOS 运行配置添加自定义构建步骤](https://youtrack.jetbrains.com/issue/KT-41678).
* [能够调试一个自定义 Kotlin/Native 二进制文件](https://youtrack.jetbrains.com/issue/KT-40954).
* [简化了 Kotlin Multiplatform Mobile 向导生成的代码](https://youtrack.jetbrains.com/issue/KT-41712).
* [删除了对 Kotlin Android Extensions plugin 的支持](https://youtrack.jetbrains.com/issue/KT-42121), 这个功能在 Kotlin 1.4.20 中已废弃.
* [修正了从主机断开连接之后保存物理设备配置的功能](https://youtrack.jetbrains.com/issue/KT-42390).
* Bug 修正和其它改进.

</td>
<td>

[Kotlin 1.4.20](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.1.3**

发布日期: 2020/10/02

</td>
<td>

* 添加了对 iOS 14 和 Xcode 12 的兼容性.
* 修正了 Kotlin Multiplatform Mobile 向导创建的平台测试中的名称.

</td>
<td>

* [Kotlin 1.4.10](releases.md#release-details)
* [Kotlin 1.4.20](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.1.2**

发布日期: 2020/09/29

</td>
<td>

 * 修正了对 [Kotlin 1.4.20-M1](eap.md#build-details) 的兼容性.
 * 默认启用向 JetBrains 发送错误报告.

</td>
<td>

* [Kotlin 1.4.10](releases.md#release-details)
* [Kotlin 1.4.20](releases.md#release-details)

</td>
</tr>

<tr>
<td>

**0.1.1**

发布日期: 2020/09/10

</td>
<td>

* 修正了对 Android Studio Canary 8 和更高版本的兼容性.

</td>
<td>

* [Kotlin 1.4.10](releases.md#release-details)
* [Kotlin 1.4.20](releases.md#release-details)

</td>
</tr>
<tr>
<td>

**0.1.0**

发布日期: 2020/08/31

</td>
<td>

* 这是 Kotlin Multiplatform Mobile plugin 的第 1 个版本. 详情请参见这篇 [Blog](https://blog.jetbrains.com/kotlin/2020/08/kotlin-multiplatform-mobile-goes-alpha/).

</td>
<td>

* [Kotlin 1.4.0](releases.md#release-details)
* [Kotlin 1.4.10](releases.md#release-details)

</td>
</tr>

</table>
