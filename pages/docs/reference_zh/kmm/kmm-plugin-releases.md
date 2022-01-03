---
type: doc
layout: reference
title: "KMM plugin 的发布版本"
---

# KMM plugin 的发布版本

本页面最终更新: 2022/04/14

由于 KMM 已经进入 [Alpha 版](../kotlin-evolution.html),
我们正在努力开发 [Android Studio 的 KMM plugin](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile),
将会不断发布新的版本, 包含新的功能, 改进, 和 bug 修正. 

请确认你安装了最新版的 KMM plugin!

## 更新到新的发布版

如果出现了新的 KMM plugin 发布版, Android Studio 会建议你更新.
如果你接受建议, 它会自动更新 KMM plugin 到最新版本. 
你将会需要重新启动 Android Studio 来完成 plugin 的安装.

你可以通过菜单 **Settings/Preferences** \| **Plugins**, 查看 KMM plugin 的版本, 并手动更新 plugin.

为了让 KMM plugin 正确工作, 你需要一个兼容的 Kotlin 版本. 你可以在 [发布版本细节](#release-details) 中找到对应的兼容版本.
你可以通过菜单 **Settings/Preferences** \| **Plugins**, 或 **Tools** \| **Kotlin** \| **Configure Kotlin Plugin Updates**,
查看你的 Kotlin 版本, 并更新它.

> 如果你没有安装兼容的 Kotlin 版本, KMM plugin 将会被禁用. 你需要更新你的 Kotlin,
> 然后通过菜单 **Settings/Preferences** \| **Plugins**, 启用 KMM plugin.
{:.note}

## 发布版本细节

下表列出了 KMM plugin 最新发布版的详细信息: 

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
        <b> 0.3.0 </b> <br/>
        发布日期: 2021/11/16
    </td>
    <td>
        <li> <a href="https://youtrack.jetbrains.com/issue/KTIJ-19367">新的 KMM 库项目向导</a>. </li> 
        <li> 支持 KMM 库发布的新类型: <a href="../mpp/mpp-build-native-binaries.html#build-xcframeworks">XCFramework</a>. </li> 
        <li> 对新 KMM 项目启用 <a href="../mpp/mpp-share-on-platforms.html#configure-the-hierarchical-structure-manually">HMPP</a>. </li> 
        <li> 支持 <a href="https://youtrack.jetbrains.com/issue/KT-46861">iOS 编译目标的明确声明</a>. </li> 
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-48614">在非 Mac 机器上启用 KMM plugin 向导</a>. </li> 
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-47923">在 KMM 模块向导中支持子文件夹</a>. </li> 
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-49571">支持 Xcode `Assets.xcassets` 文件</a>. </li> 
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
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-45946">在新的 KMM 模块向导中能够使用 CocoaPods 依赖项管理器, 用于 iOS 集成</a>. </li>
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
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-42908">新项目中 `gradle.properties` 文件更好的可读性</a>. </li>
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
        <li> <a href="https://youtrack.jetbrains.com/issue/KT-41712">简化了 KMM 向导生成的代码</a>. </li>
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
        <li> 修正了 KMM 向导创建的平台测试中的名称. </li>
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
        <li> 这是 KMM plugin 的第 1 个版本. 详情请参见这篇 <a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-multiplatform-mobile-goes-alpha/">Blog</a>. </li>
    </td>
    <td>
        <li> <a href="../releases.html#release-details">Kotlin 1.4.10</a> </li>
        <li> <a href="../releases.html#release-details">Kotlin 1.4.20</a> </li>
    </td>
</tr>
</table>
