[//]: # (title: 示例程序)

最终更新: %latestDocDate%

这里是 Kotlin Multiplatform Mobile 示例程序的简要列表.

> 你可以在 GitHub 找到更多示例项目, 参见 [`kotlin-multiplatform-mobile` topic](https://github.com/topics/kotlin-multiplatform-mobile).
>
> 如果你想要将你的 Multiplatform Mobile 项目添加到这个 topic, 帮助社区,
> 请按照 [GitHub 文档](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics#adding-topics-to-your-repository) 中的指示进行.
>
{style="tip"}

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
        <list>
            <li>
                <code>expect</code>/<code>actual</code> 声明
            </li>
        </list>
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
        <list>
            <li>
                Redux, 用于共享 UI 状态
            </li>
            <li>
                发布到 Google Play 和 App Store
            </li>
        </list>
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
        <list>
            <li>
                <a href="https://www.youtube.com/watch?v=_Q62iJoNOfg%26list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C%26index=2">
                    视频教程
                </a>
            </li>
        </list>
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
        <list>
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
        </list>
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
        <list>
            <li>
                演示如何创建跨平台的库
                (<a href="https://dev.to/kathrinpetrova/series/11926">教程</a>)
            </li>
        </list>
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
        <p>目标平台:</p>
        <list>
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
        </list>
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
        <list>
            <li>
                实现 MVI 模式和单项数据流
            </li>
            <li>
                使用 Kotlin 的 StateFlow 触发 UI 层重组
            </li>
        </list>
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
        <list>
            <li>
                使用 <a href="https://realm.io/">Realm</a> 实现数据表现
            </li>
        </list>
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
        <list>
            <li>
                模块化架构
            </li>
            <li>
                在桌面端运行
            </li>
            <li>
                共用视图模型(ViewModel)
            </li>
        </list>
    </td>
</tr>

</table>
