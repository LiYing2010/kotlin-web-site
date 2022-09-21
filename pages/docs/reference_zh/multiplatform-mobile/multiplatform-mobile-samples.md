---
type: doc
layout: reference
title: "示例程序"
---

# 示例程序

最终更新: {{ site.data.releases.latestDocDate }}

这里是 Kotlin Multiplatform Mobile 示例程序的简要列表.

你有没有这个列表中未列出的优秀的示例程序?  
请 [创建一个 Pull Request](https://github.com/JetBrains/kotlin-web-site/edit/master/docs/topics/multiplatform-mobile/multiplatform-mobile-samples.md),
分享给我们!
你可以参考这个 [PR 示例](https://github.com/JetBrains/kotlin-web-site/pull/2723).

<table>
<tr>
    <td>
        示例程序名称
    </td>
    <td>
        主要演示内容
    </td>
    <td>
        用到的库
    </td>
    <td>
        UI 框架
    </td>
    <td>
        iOS 集成
    </td>
    <td>
        平台 API
    </td>
    <td>
        测试
    </td>
    <td>
        JS 编译目标
    </td>
    <td>
        功能特性
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/Kotlin/kmm-basic-sample">
                Kotlin Multiplatform Mobile Sample
            </a>
        </strong>
    </td>
    <td>
        算法
    </td>
    <td>
        -
    </td>
    <td>
        XML, <br/>
        SwiftUI
    </td>
    <td>
        Xcode build phases
    </td>
    <td>
        ✅
    </td>
    <td>
        -
    </td>
    <td>
        -
    </td>
    <td>
        <ul>
            <li>
                <code>expect</code>/<code>actual</code> 声明
            </li>
        </ul>
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/Kotlin/kmm-production-sample">
                KMM RSS Reader
            </a>
        </strong>
    </td>
    <td>
        模块, <br/>
        网络, <br/>
        数据存储, <br/>
        UI 状态
    </td>
    <td>
        SQLDelight, <br/>
        Ktor, <br/>
        DateTime, <br/>
        multiplatform-settings, <br/>
        Napier, <br/>
        kotlinx.serialization
    </td>
    <td>
        Jetpack Compose, <br/>
        SwiftUI
    </td>
    <td>
        Xcode build phases
    </td>
    <td>
        ✅
    </td>
    <td>
        -
    </td>
    <td>
        -
    </td>
    <td>
        <ul>
            <li>
                Redux, 用于共享 UI 状态
            </li>
            <li>
                发布到 Google Play 和 App Store
            </li>
        </ul>
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/touchlab/KaMPKit">KaMPKit</a>
        </strong>
    </td>
    <td>
        模块, <br/>
        网络, <br/>
        数据存储, <br/>
        视图模型(ViewModel)
    </td>
    <td>
        Koin, SQLDelight, Ktor, DateTime, multiplatform-settings, Kermit
    </td>
    <td>
        Jetpack Compose, SwiftUI
    </td>
    <td>
        CocoaPods
    </td>
    <td>
        -
    </td>
    <td>
        ✅
    </td>
    <td>
        -
    </td>
    <td>
        -
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/icerockdev/moko-template">
                moko-template
            </a>
        </strong>
    </td>
    <td>
        模块, <br/>
        网络, <br/>
        数据存储, <br/>
        视图模型(ViewModel)
    </td>
    <td>
        Moko Libraries, <br/>
        Ktor, <br/>
        multiplatform-settings
    </td>
    <td>
        -
    </td>
    <td>
        CocoaPods
    </td>
    <td>
        -
    </td>
    <td>
        ✅
    </td>
    <td>
        -
    </td>
    <td>
        <ul>
            <li>
                模块化架构
            </li>
            <li>
                共用功能: 资源管理, 运行期权限访问, 媒体访问, UI 列表管理
            </li>
            <li>
                通过 OpenAPI 生成网络层.
            </li>
        </ul>
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/joreilly/PeopleInSpace">
                PeopleInSpace
            </a>
        </strong>
    </td>
    <td>
        模块, <br/>
        网络, <br/>
        数据存储
    </td>
    <td>
        Koin, <br/>
        SQLDelight, <br/>
        Ktor
    </td>
    <td>
        Jetpack Compose, <br/>
        SwiftUI
    </td>
    <td>
        CocoaPods, <br/>
        Swift Packages
    </td>
    <td>
        -
    </td>
    <td>
        ✅
    </td>
    <td>
        ✅
    </td>
    <td>
        <ul>编译目标:
            <li>
                Android Wear OS
            </li>
            <li>
                iOS
            </li>
            <li>
                watchOS
            </li>
            <li>
                macOS Desktop (Compose for Desktop)
            </li>
            <li>
                Web (Compose for Web)
            </li>
            <li>
                Web (Kotlin/JS + React Wrapper)
            </li>
            <li>
                JVM
            </li>
        </ul>
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://gitlab.com/terrakok/gitlab-client">
                GitFox SDK
            </a>
        </strong>
    </td>
    <td>
        模块, <br/>
        网络, <br/>
        交互(Interactor)
    </td>
    <td>
        Ktor
    </td>
    <td>
        XML, <br/>
        UIKit
    </td>
    <td>
        Xcode build phases
    </td>
    <td>
        -
    </td>
    <td>
        -
    </td>
    <td>
        ✅
    </td>
    <td>
        <ul>
            <li>
                集成到 Flutter App
            </li>
        </ul>
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/dbaroncelli/D-KMP-sample">
                D-KMP-sample
            </a>
        </strong>
    </td>
    <td>
        网络, <br/>
        数据存储, <br/>
        视图模型(ViewModel), <br/>
        导航(Navigation)
    </td>
    <td>
        SQLDelight, <br/>
        Ktor, <br/>
        DateTime, <br/>
        multiplatform-settings
    </td>
    <td>
        Jetpack Compose, <br/>
        SwiftUI
    </td>
    <td>
        Xcode build phases
    </td>
    <td>
        -
    </td>
    <td>
        ✅
    </td>
    <td>
        ✅
    </td>
    <td>
        <ul>
            <li>
                实现 MVI 模式和单项数据流
            </li>
            <li>
                使用 Kotlin 的 StateFlow 触发 UI 层重组
            </li>
        </ul>
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/mitchtabian/Food2Fork-KMM">
                Food2Fork Recipe App
            </a>
        </strong>
    </td>
    <td>
        模块, <br/>
        网络, <br/>
        数据存储, <br/>
        交互(Interactor)
    </td>
    <td>
        SQLDelight, <br/>
        Ktor, <br/>
        DateTime
    </td>
    <td>
        Jetpack Compose, <br/>
        SwiftUI
    </td>
    <td>
        CocoaPods
    </td>
    <td>
        -
    </td>
    <td>
        -
    </td>
    <td>
        -
    </td>
    <td>
        -
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/KaterinaPetrova/kmm-ktor-sample">
                kmm-ktor-sample
            </a>
        </strong>
    </td>
    <td>
        网络
    </td>
    <td>
        Ktor, <br/>
        kotlinx.serialization, <br/>
        Napier
    </td>
    <td>
        XML, <br/>
        SwiftUI
    </td>
    <td>
        Xcode build phases
    </td>
    <td>
        -
    </td>
    <td>
        -
    </td>
    <td>
        -
    </td>
    <td>
        <ul>
            <li>
                <a href="https://www.youtube.com/watch?v=_Q62iJoNOfg%26list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C%26index=2">
                    视频教程
                </a>
            </li>
        </ul>
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/CurrencyConverterCalculator/CCC">
                Currency Converter Calculator
            </a>
        </strong>
    </td>
    <td>
        模块, <br/>
        网络, <br/>
        数据存储, <br/>
        算法, <br/>
        视图模型(ViewModel)
    </td>
    <td>
        Ktor, <br/>
        SQLDelight, <br/>
        koin, <br/>
        moko-resources, <br/>
        kotlinx.datetime, <br/>
        multiplatform-settings
    </td>
    <td>
        XML, <br/>
        SwiftUI
    </td>
    <td>
        CocoaPods
    </td>
    <td>
        ✅
    </td>
    <td>
        ✅
    </td>
    <td>
        -
    </td>
    <td>
        <ul>
            <li>
                与后端共用逻辑
            </li>
        </ul>
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/JetBrains/compose-jb/tree/master/examples/todoapp">
                todoapp
            </a>
        </strong>
    </td>
    <td>
        模块, <br/>
        网络, <br/>
        展现(Presentation), <br/>
        导航(Navigation), <br/>
        UI
    </td>
    <td>
        SQLDelight, <br/>
        Decompose, <br/>
        MVIKotlin, <br/>
        Reaktive
    </td>
    <td>
        Jetpack Compose, <br/>
        SwiftUI
    </td>
    <td>
        Xcode build phases
    </td>
    <td>
        -
    </td>
    <td>
        ✅
    </td>
    <td>
        ✅
    </td>
    <td>
        <ul>
            <li>
                共用了 99% 的代码
            </li>
            <li>
                MVI 架构模式
            </li>
            <li>
                使用 <a href="https://www.jetbrains.com/lp/compose-mpp/">Compose Multiplatform</a>,
                实现在 Android, Desktop 和 Web 平台共用 UI
            </li>
        </ul>
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/fededri/kmm-demo">
                kmm-arch-demo
            </a>
        </strong>
    </td>
    <td>
        模块, <br/>
        网络, <br/>
        视图模型(ViewModel), <br/>
        UI 状态
    </td>
    <td>
        Ktor, <br/>
        kotlinx.serialization
    </td>
    <td>
        XML, <br/>
        SwiftUI
    </td>
    <td>
        CocoaPods
    </td>
    <td>
        -
    </td>
    <td>
        -
    </td>
    <td>
        -
    </td>
    <td>
        <ul>
            <li>
                使用 <a href="https://github.com/fededri/Arch">Arch</a>,
                一个 Kotlin Multiplatform Mobile 库, 它基于 Spotify 的 Mobius 库,
                但使用 SharedFlow, StateFlow 以及 coroutines, 而不是 RxJava
            </li>
        </ul>
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/xorum-io/codeforces_watcher">
                Codeforces WatchR
            </a>
        </strong>
    </td>
    <td>
        模块, <br/>
        网络, <br/>
        数据存储, <br/>
        UI 状态
    </td>
    <td>
        SQLDelight, <br/>
        Ktor, <br/>
        kotlinx.serialization
    </td>
    <td>
        XML, <br/>
        UIKit
    </td>
    <td>
        CocoaPods
    </td>
    <td>
        ✅
    </td>
    <td>
        ✅
    </td>
    <td>
        -
    </td>
    <td>
        <ul>
            <li>
                使用 Redux (<a href="https://github.com/xorum-io/ReKamp">ReKamp</a>)
                实现 UI 状态共用
            </li>
            <li>
                发布到 Google Play 和 App Store
            </li>
        </ul>
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/MartinRajniak/CatViewerDemo">
                CatViewerDemo
            </a>
        </strong>
    </td>
    <td>
        模块, <br/>
        网络, <br/>
        数据存储, <br/>
        视图模型(ViewModel)
    </td>
    <td>
        Ktor, <br/>
        multiplatform-settings, <br/>
        kotlinx.serialization
    </td>
    <td>
        Jetpack Compose, <br/>
        SwiftUI
    </td>
    <td>
        Xcode build phases
    </td>
    <td>
        ✅
    </td>
    <td>
        ✅
    </td>
    <td>
        -
    </td>
    <td>
        <ul>
            <li>
                Android 架构
            </li>
            <li>
                分页(Pagination)
            </li>
            <li>
                可在 M1 平台运行
            </li>
            <li>
                GitHubActions CI
            </li>
            <li>
                Cats 🐈
            </li>
        </ul>
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/mutualmobile/praxiskmm">
                Praxis KMM
            </a>
        </strong>
    </td>
    <td>
        模块, <br/>
        网络, <br/>
        数据存储
    </td>
    <td>
        kotlinx.serialization, <br/>
        Ktor, <br/>
        Koin, <br/>
        SQLDelight
    </td>
    <td>
        Jetpack Compose, <br/>
        SwiftUI, <br/>
        ReactJS
    </td>
    <td>
        CocoaPods, <br/>
        Swift Packages
    </td>
    <td>
        ✅
    </td>
    <td>
        -
    </td>
    <td>
        ✅
    </td>
    <td>
        <ul>
        编译目标:
            <li>
                iOS
            </li>
            <li>
                Android
            </li>
            <li>
                Android Wear OS
            </li>
            <li>
                watchOS
            </li>
            <li>
                macOS Desktop (Swift UI)
            </li>
            <li>
                Web (Kotlin/JS + React Wrapper)
            </li>
        </ul>
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/realm/realm-kotlin-samples/tree/main/Bookshelf">
                Bookshelf
            </a>
        </strong>
    </td>
    <td>
        模块, <br/>
        网络, <br/>
        数据存储
    </td>
    <td>
        Realm-Kotlin, <br/>
        Ktor, <br/>
        kotlinx.serialization
    </td>
    <td>
        Jetpack Compose, <br/>
        SwiftUI
    </td>
    <td>
        CocoaPods
    </td>
    <td>
        -
    </td>
    <td>
        -
    </td>
    <td>
        -
    </td>
    <td>
        <ul>
            <li>
                使用 <a href="https://realm.io/">Realm</a> 实现数据表现
            </li>
        </ul>
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/VictorKabata/Notflix">
                Notflix
            </a>
        </strong>
    </td>
    <td>
        模块, <br/>
        网络, <br/>
        缓存, <br/>
        视图模型(ViewModel)
    </td>
    <td>
        Koin, <br/>
        Ktor, <br/>
        Multiplatform settings, <br/>
        kotlinx.coroutines, <br/>
        kotlinx.serialization, <br/>
        kotlinx.datetime, <br/>
        Napier
    </td>
    <td>
        Jetpack Compose-Android, <br/>
        Compose Multiplatform-Desktop
    </td>
    <td>
        -
    </td>
    <td>
        ✅
    </td>
    <td>
        -
    </td>
    <td>
        ✅
    </td>
    <td>
        <ul>
            <li>
                模块化架构
            </li>
            <li>
                在桌面端运行
            </li>
            <li>
                共用视图模型(ViewModel)
            </li>
        </ul>
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/halcyonmobile/MultiplatformPlayground">
                MultiplatformPlayground
            </a>
        </strong>
    </td>
    <td>
        视图模型(ViewModel), <br/>
        网络, <br/>
        数据存储
    </td>
    <td>
        SQLDelight, <br/>
        Ktor, <br/>
        Koin, <br/>
        kotlinx.serialization, <br/>
        moko-resources
    </td>
    <td>
        Jetpack Compose, <br/>
        SwiftUI
    </td>
    <td>
        CocoaPods
    </td>
    <td>
        ✅
    </td>
    <td>
        只支持 Android
    </td>
    <td>
        ✅
    </td>
    <td>
        <ul>
            <li>
                共用文件上传
            </li>
            <li>
                多模块设置
            </li>
            <li>
                在后端与移动端/前端平台 (macOS, iOS, Android) 之间共用代码
            </li>
        </ul>
    </td>
</tr>

<tr>
    <td>
        <strong>
            <a href="https://github.com/KaterinaPetrova/mpp-sample-lib">
                mpp-sample-lib
            </a>
        </strong>
    </td>
    <td>
        算法
    </td>
    <td>
        -
    </td>
    <td>
        -
    </td>
    <td>
        -
    </td>
    <td>
        ✅
    </td>
    <td>
        -
    </td>
    <td>
        ✅
    </td>
    <td>
        <ul>
            <li>
                演示如何创建跨平台的库
                (<a href="https://dev.to/kathrinpetrova/series/11926">教程</a>)
            </li>
        </ul>
    </td>
</tr>
</table>
