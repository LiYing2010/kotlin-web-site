---
type: doc
layout: reference
title: "Kotlin Multiplatform Mobile Plugin 的发布版本"
---

# Kotlin Multiplatform Mobile Plugin 的发布版本

最终更新: {{ site.data.releases.latestDocDate }}

我们正在努力开发 [Kotlin Multiplatform Mobile plugin for Android Studio](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile)
的稳定版, 我们会不断发布新的版本, 包含新的功能, 改进, 和 bug 修正. 

请确认你安装了最新版的 Kotlin Multiplatform Mobile plugin!

## 更新到新的发布版

如果出现了新的 Kotlin Multiplatform Mobile plugin 发布版, Android Studio 会建议你更新.
如果你接受建议, 它会自动更新 plugin 到最新版本. 
你将会需要重新启动 Android Studio 来完成 plugin 的安装.

你可以通过菜单 **Settings/Preferences** \| **Plugins**, 查看 plugin 的版本, 并手动更新它.

为了让 plugin 正确工作, 你需要一个兼容的 Kotlin 版本. 你可以在 [发布版本细节](#release-details) 中找到对应的兼容版本.
你可以通过菜单 **Settings/Preferences** \| **Plugins**, 或 **Tools** \| **Kotlin** \| **Configure Kotlin Plugin Updates**,
查看你的 Kotlin 版本, 并更新它.

> 如果你没有安装兼容的 Kotlin 版本, Kotlin Multiplatform Mobile plugin 将会被禁用. 你需要更新你的 Kotlin,
> 然后通过菜单 **Settings/Preferences** \| **Plugins**, 启用 plugin.
{:.note}

## 发布版本详情

下表列出了 Kotlin Multiplatform Mobile plugin 最新发布版的详细信息: 

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
<tr>
    <td>
        <b> 0.8.2 </b> <br/>
        发布日期: 2024/01/25
    </td>
    <td>
        <li>
            支持新的 Canary 版 Android Studio Jellyfish.
        </li>
        <li>
            在共用模块中添加 <code>sourceCompatibility</code> 和 <code>targetCompatibility</code> 声明.
        </li>
    </td>
    <td>
        <li>
            <a href="../releases.html#release-details">Kotlin plugin 的任何版本</a>
        </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.8.1 </b> <br/>
        发布日期: 2023/11/09
    </td>
    <td>
        <li>
            Kotlin 更新到 1.9.20.
        </li>
        <li>
            Jetpack Compose 更新到 1.5.4.
        </li>
        <li>
            默认启用 Gradle 构建和配置的缓存.
        </li>
        <li>
            对新的 Kotlin 版本重构了构建配置.
        </li>
        <li>
            iOS framework 默认为静态模式.
        </li>
        <li>
            修正了 iOS 设备上使用 Xcode 15 时的一个问题.
        </li>
    </td>
    <td>
        <li>
            <a href="../releases.html#release-details">Kotlin Plugin 的任何版本</a>
        </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.8.0 </b> <br/>
        发布日期: 2023/10/05
    </td>
    <td>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-60169">KT-60169</a> 迁移到 Gradle 版本目录.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-59269">KT-59269</a> <code>android</code> 重命名为 <code>androidTarget</code>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-59269">KT-59269</a> 更新了 Kotlin 和其他依赖项的版本.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KTIJ-26773">KTIJ-26773</a> 重构, 使用 <code>-destination</code> 参数, 代替 <code>-sdk</code> 和 <code>-arch</code>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KTIJ-25839">KTIJ-25839</a> 重构了生成的文件名.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KTIJ-27058">KTIJ-27058</a> 添加了 JVM 构建目标配置.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KTIJ-27160">KTIJ-27160</a> 支持 Xcode 15.0.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KTIJ-27158">KTIJ-27158</a> 将新的模块向导移动到实验状态.
        </li>
    </td>
    <td>
        <li>
            <a href="../releases.html#release-details">Kotlin Plugin 的任何版本</a>
        </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.6.0 </b> <br/>
        发布日期: 2023/05/24
    </td>
    <td>
        <li>
            支持新的 Canary Android Studio Hedgehog.
        </li>
        <li>
            更新 Kotlin, Gradle, 以及 Multiplatform 项目中库的版本.
        </li>
        <li>
            在 Multiplatform 项目中使用了新的 <a href="../whatsnew1820.html#new-approach-to-source-set-hierarchy"><code>targetHierarchy.default()</code></a>.
        </li>
        <li>
            在 Multiplatform 项目中, 对平台特定的文件使用源代码集名称后缀.
        </li>
    </td>
    <td>
        <li>
            <a href="../releases.html#release-details">Kotlin Plugin 的任何版本</a>
        </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.5.3 </b> <br/>
        发布日期: 2023/04/12
    </td>
    <td>
        <li>
            更新了 Kotlin 和 Compose 的版本.
        </li>
        <li>
            修正了 Xcode 项目 scheme 解析的一个问题.
        </li>
        <li>
            添加了 scheme 的 product 类型检查.
        </li>
        <li>
            如果 <code>iosApp</code> scheme 存在, 默认选中.
        </li>
    </td>
    <td>
        <li>
            <a href="../releases.html#release-details">Kotlin Plugin 的任何版本</a>
        </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.5.2 </b> <br/>
        发布日期: 2023/01/30
    </td>
    <td>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-55988">修正了 Kotlin/Native 调试器的一个问题 (Spotlight 索引缓慢)</a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-24450">修正了多模块项目中的 Kotlin/Native 调试器</a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-55274">针对 Android Studio Giraffe 2022.3.1 Canary 的新构建版本</a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-55204">对 iOS App 构建添加了 provisioning 标记</a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-55402">在生成的 iOS 项目中, 对 **Framework Search Paths** 选项添加了继承的路径</a>.
        </li>
    </td>
    <td>
        <li>
            <a href="../releases.html#release-details">Kotlin Plugin 的任何版本</a>.
        </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.5.1 </b> <br/>
        发布日期: 2022/11/30
    </td>
    <td>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KTIJ-23790">新项目生成时的修正: 删除不需要的 "app" 目录</a>.
        </li>
    </td>
    <td>
        <li>
            <a href="../releases.html#release-details">Kotlin 1.7.0—*</a>
        </li>
    </td>
</tr>

<tr>
    <td>
        <b> 0.5.0 </b> <br/>
        发布日期: 2022/11/22
    </td>
    <td>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-54086">修改 iOS framework distribution 的默认选项: 现在是 <strong>Regular framework</strong></a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-53991">在生成的 Android 项目中, 将 <code>MyApplicationTheme</code> 移动到单独的文件</a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-54658">修改了生成的 Android 项目</a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KTIJ-23707">修正了新建项目的目录被意外删除的问题</a>.
        </li>
    </td>
    <td>
        <li>
            <a href="../releases.html#release-details">Kotlin 1.7.0—*</a>
        </li>
    </td>
</tr>

<tr>
    <td>
        <b> 0.3.4 </b> <br/>
        发布日期: 2022/09/12
    </td>
    <td>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-53162">将 Android 应用程序迁移到 Jetpack Compose</a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-52248">删除旧的 HMPP flag</a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KTIJ-22633">在 Android manifest 中删除包名称</a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-53703">对 Xcode 项目更新 <code>.gitignore</code></a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-53928">更新向导项目, 更好的演示 expect/actual 功能</a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KTIJ-22063">更新与 Android Studio Canary 版的兼容性</a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KTIJ-22505">对 Android 应用程序, 最小 Android SDK 版本更新为 21</a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KTIJ-22645">修正安装之后初次启动时的问题</a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KTIJ-21781">修正 M1 上的 Apple 运行配置的问题</a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KTIJ-22037">修正 Windows OS 上 <code>local.properties</code> 的问题</a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-53976">修正 Android Studio Canary 版中 Kotlin/Native 调试器的问题</a>.
        </li>
    </td>
    <td>
        <li>
            <a href="../releases.html#release-details">Kotlin 1.7.0—1.7.*</a>
        </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.3.3 </b> <br/>
        发布日期: 2022/06/09
    </td>
    <td>
        <li>
            依赖项更新为 Kotlin IDE plugin 1.7.0.
        </li>
    </td>
    <td>
        <li>
            <a href="../releases.html#release-details">Kotlin 1.7.0—1.7.*</a>
        </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.3.2 </b> <br/>
        发布日期: 2022/04/04
    </td>
    <td>
        <li>
            修正在 Android Studio 2021.2 和 2021.3 上的 iOS 应用程序调试性能问题.
        </li>
    </td>
    <td>
        <li>
            <a href="../releases.html#release-details">Kotlin 1.5.0—1.6.*</a>
        </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.3.1 </b> <br/>
        发布日期: 2022/02/15
    </td>
    <td>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-51105">在 Kotlin Multiplatform Mobile 向导中启用 M1 iOS 模拟器</a>.
        </li>
        <li>
            对 XcProject 创建索引时的性能改善:
            <a href="https://youtrack.jetbrains.com/issue/KT-49777">KT-49777</a>,
            <a href="https://youtrack.jetbrains.com/issue/KT-50779">KT-50779</a>.
        </li>
        <li>
            清理构建脚本: 使用 <code>kotlin("test")</code>, 代替 <code>kotlin("test-common")</code> 和 <code>kotlin("test-annotations-common")</code>.
        </li>
        <li>
            增加与 <a href="https://youtrack.jetbrains.com/issue/KTIJ-20167">Kotlin plugin 版本</a> 的兼容范围.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-50699">修正在 Windows 主机上的 JVM 调试问题</a>.
        </li>
        <li>
            <a href="https://youtrack.jetbrains.com/issue/KT-50966">修正禁用 plugin 后的版本错误问题</a>.
        </li>
    </td>
    <td>
        <li> <a href="../releases.html#release-details">Kotlin 1.5.0—1.6.*</a> </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.3.0 </b> <br/>
        发布日期: 2021/11/16
    </td>
    <td>
        <li> <a href="https://youtrack.jetbrains.com/issue/KTIJ-19367">新的 Kotlin Multiplatform Library 向导</a>. </li>
        <li> 支持 Kotlin 跨平台库的新发布类型: <a href="../multiplatform/multiplatform-build-native-binaries.html#build-xcframeworks">XCFramework</a>. </li>
        <li> 对新跨平台移动项目启用 <a href="../multiplatform/multiplatform-hierarchy.html#manual-configuration">层级项目结构</a>. </li>
        <li> 支持 <a href="https://youtrack.jetbrains.com/issue/KT-46861">iOS 编译目标的明确声明</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-48614">在非 Mac 机器上启用 Kotlin Multiplatform Mobile plugin 向导</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-47923">在 Kotlin Multiplatform 模块向导中支持子文件夹</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-49571">支持 Xcode <code>Assets.xcassets</code> 文件</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-48103">修正了 plugin 的类装载器异常</a>. </li>
        <li> 更新了 CocoaPods Gradle Plugin 模板. </li>
        <li> 改进了 Kotlin/Native 调试器的类型计算. </li>
        <li> 修正了使用 Xcode 13 的 iOS 设备启动功能. </li>
    </td>
    <td>
        <li> <a href="../releases.html#release-details">Kotlin 1.6.0</a> </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.2.7 </b> <br/>
        发布日期: 2021/08/02
    </td>
    <td>
        <li> <a href="https://youtrack.jetbrains.com/issue/KTIJ-19054">为 AppleRunConfiguration 添加了 Xcode 配置选项</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-47618">添加了 Apple M1 模拟器支持</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-47466">在项目向导中添加了关于 Xcode 集成选项的信息</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-47329">当一个使用 CocoaPods 的项目生成后, 但 CocoaPods gem 没有安装时, 添加了错误通知</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-47631">在使用 Kotlin 1.5.30 生成的共用模块中, 添加了 Apple M1 模拟器编译目标支持</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-47465">清除使用 Kotlin 1.5.20 生成的 Xcode 项目</a>. </li>
        <li> 修正了真实 iOS 设备上启动 Xcode 的发布配置. </li>
        <li> 修正了使用 Xcode 12.5 启动模拟器的功能. </li>
    </td>
    <td>
        <li> <a href="../releases.html#release-details">Kotlin 1.5.10</a> </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.2.6 </b> <br/>
        发布日期: 2021/06/10
    </td>
    <td>
        <li> 兼容 Android Studio Bumblebee Canary 1. </li>
        <li> 支持 <a href="../whatsnew1520.html">Kotlin 1.5.20</a>: 在项目向导中为 Kotlin/Native 使用新的框架打包任务. </li>
    </td>
    <td>
        <li> <a href="../releases.html#release-details">Kotlin 1.5.10</a> </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.2.5 </b> <br/>
        发布日期: 2021/05/25
    </td>
    <td>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-46834">修正了与 Android Studio Arctic Fox 2020.3.1 Beta 1 及更高版本的兼容问题</a>. </li>
    </td>
    <td>
        <li> <a href="../releases.html#release-details">Kotlin 1.5.10</a> </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.2.4 </b> <br/>
        发布日期: 2021/05/05
    </td>
    <td>
        对 Android Studio 4.2 或 Android Studio 2020.3.1 Canary 8 或 更高版本, 请使用这个 plugin 版本.
        <li> 兼容 <a href="../whatsnew15.html">Kotlin 1.5.0</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-45946">在新的 Kotlin Multiplatform 模块中能够使用 CocoaPods 依赖项管理器, 用于 iOS 集成</a>. </li>
    </td>
    <td>
        <li> <a href="../releases.html#release-details">Kotlin 1.5.10</a> </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.2.3 </b> <br/>
        发布日期: 2021/04/05
    </td>
    <td>
        <li> <a href="https://youtrack.jetbrains.com/issues?q=issue%20id:%20KT-43449,%20KT-44060,%20KT-41520,%20KT-45282">项目向导: 命名模块的改进</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-45478">在项目向导中能够使用 CocoaPods 依赖项管理器, 用于 iOS 集成</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-42908">新项目中 <code>gradle.properties</code> 文件更好的可读性</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-43441">如果不选中 "Add sample tests for Shared Module", 则不再生成示例测试</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issues?q=Subsystems:%20%7BKMM%20Plugin%7D%20Type:%20Feature,%20Bug%20State:%20-Obsolete,%20-%7BAs%20designed%7D,%20-Answered,%20-Incomplete%20resolved%20date:%202021-03-10%20..%202021-03-25">Bug 修正和其它改进</a>. </li>
    </td>
    <td>
        <li> <a href="../releases.html#release-details">Kotlin 1.4.30</a> </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.2.2 </b> <br/>
        发布日期: 2021/03/03
    </td>
    <td>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-44970">能够在 Xcode 中打开 Xcode 相关文件</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-44968">能够在 iOS 运行配置中为 Xcode 项目文件设置位置</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-45162">支持 Android Studio 2020.3.1 Canary 8</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.2%20">Bug 修正和其它改进</a>. </li>
    </td>
    <td>
        <li> <a href="../releases.html#release-details">Kotlin 1.4.30</a> </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.2.1 </b> <br/>
        发布日期: 2021/02/15
    </td>
    <td>
        对 Android Studio 4.2, 请使用这个 plugin 版本.
        <li> 基础组件改进. </li>
        <li> <a href="https://youtrack.jetbrains.com/issues?q=tag:%20KMM-0.2.1%20">Bug 修正和其它改进</a>. </li>
    </td>
    <td>
        <li> <a href="../releases.html#release-details">Kotlin 1.4.30</a> </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.2.0 </b> <br/>
        发布日期: 2020/11/23
    </td>
    <td>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-41932">支持 iPad 设备</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-41677">支持 Xcode 中配置的自定义 scheme 名称</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-41678">能够为 iOS 运行配置添加自定义构建步骤</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-40954">能够调试一个自定义 Kotlin/Native 二进制文件</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-41712">简化了 Kotlin Multiplatform Mobile 向导生成的代码</a>. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-42121">删除了对 Kotlin Android Extensions plugin 的支持</a>, 这个功能在 Kotlin 1.4.20 中已废弃. </li>
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-42390">修正了从主机断开连接之后保存物理设备配置的功能</a>. </li>
        <li> Bug 修正和其它改进. </li>
    </td>
    <td>
        <li> <a href="../releases.html#release-details">Kotlin 1.4.20</a> </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.1.3 </b> <br/>
        发布日期: 2020/10/02
    </td>
    <td>
        <li> 添加了对 iOS 14 和 Xcode 12 的兼容性. </li>
        <li> 修正了 Kotlin Multiplatform Mobile 向导创建的平台测试中的名称. </li>
    </td>
    <td>
        <li> <a href="../releases.html#release-details">Kotlin 1.4.10</a> </li>
        <li> <a href="../releases.html#release-details">Kotlin 1.4.20</a> </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.1.2 </b> <br/>
        发布日期: 2020/09/29
    </td>
    <td>
         <li> 修正了对 <a href="../eap.html#build-details">Kotlin 1.4.20-M1</a> 的兼容性. </li>
         <li> 默认启用向 JetBrains 发送错误报告. </li>
    </td>
    <td>
        <li> <a href="../releases.html#release-details">Kotlin 1.4.10</a> </li>
        <li> <a href="../releases.html#release-details">Kotlin 1.4.20</a> </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.1.1 </b> <br/>
        发布日期: 2020/09/10
    </td>
    <td>
        <li> 修正了对 Android Studio Canary 8 和更高版本的兼容性. </li>
    </td>
    <td>
        <li> <a href="../releases.html#release-details">Kotlin 1.4.10</a> </li>
        <li> <a href="../releases.html#release-details">Kotlin 1.4.20</a> </li>
    </td>
</tr>
<tr>
    <td>
        <b> 0.1.0 </b> <br/>
        发布日期: 2020/08/31
    </td>
    <td>
        <li> 这是 Kotlin Multiplatform Mobile plugin 的第 1 个版本. 详情请参见这篇 <a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-multiplatform-mobile-goes-alpha/">Blog</a>. </li>
    </td>
    <td>
        <li> <a href="../releases.html#release-details">Kotlin 1.4.10</a> </li>
        <li> <a href="../releases.html#release-details">Kotlin 1.4.20</a> </li>
    </td>
</tr>
</table>
