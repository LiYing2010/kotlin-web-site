---
type: doc
layout: reference
category:
title: "参加 Kotlin EAP 项目"
---

# 参加 Kotlin EAP(Early Access Preview) 项目

最终更新: {{ site.data.releases.latestDocDate }}

你可以参加 参加 Kotlin 早期预览(EAP) 项目, 试用 Kotlin 还未发布的最新功能.

在每个功能发布版 (_1.x_) 和增量发布版 (_1.x.y_)之前, 我们会发布少量的 Beta (_Beta_) 和 Release Candidate (_RC_) 版本. 

如果你发现并报告 bug 到我们的问题追踪系统 [YouTrack](https://kotl.in/issue), 我们非常感谢. 
我们很可能会在最终发布版之前修正这些 bug, 因此为了解决你的问题, 不需要等到 Kotlin 的下个发布版. 

参加早期预览(EAP) 项目并报告 bug, 你可以向 Kotlin 作出贡献, 帮助我们改进它,
为 [不断增长的 Kotlin 社区](https://kotlinlang.org/community/) 每个成员带来利益.
我们非常感谢你的帮助! 

如果你有任何问题, 希望参与讨论, 欢迎加入 [Kotlin Slack 的 #eap 频道](https://app.slack.com/client/T09229ZC6/C0KLZSCHF). 
在这个频道中, 你还可以收到关于新的 EAP 版本的通知.

**[在 IDEA 和 Android Studio 中安装 Kotlin EAP Plugin](install-eap-plugin.html)**

> 参与 EAP 项目, 表示你明确了解 EAP 版本并不可靠, 可能不会象期待的那样正常工作, 并且可能包含错误.
>
> 请注意, 对于 EAP 和某些版本的最终发布版之间兼容性, 我们并不提供任何保证. 
{:.note}

如果你已经安装了 EAP 版, 并希望在之前创建的项目中使用, 
请参见 [如何针对 EAP 版配置你的构建](configure-build-for-eap.html). 

## EAP 版本

<table>
    <tr>
        <th>版本信息</th>
        <th>主要内容</th>
    </tr>
    <tr>
        <td><strong>1.7.20-RC</strong>
            <p>发布日期: <strong>{{ site.data.releases.kotlinEapReleaseDate }}</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20-RC" target="_blank">GitHub 发布页面</a></p>
        </td>
        <td>
            <ul>
                <li>
                    K2 编译器:
                        支持 <code>all-open</code>, <code>no-arg</code>, SAM-with-receiver, Lombok, Parcelize, AtomicFU, 以及 <code>jvm-abi-gen</code> 编译器插件
                </li>
                <li>
                    语言:
                        用于值范围(Range)的<code>..&lt;</code> (<code>rangeUntil</code>) 操作符(实验性功能), 值范围不包含上界值,
                        废弃了变量类型推断为一个空交叉类型(Intersection Type)的情况,
                        对潜在的空交叉类型(Intersection Type)报告警告,
                        改进了源代码根目录中的脚本处理
                </li>
                <li>
                    Kotlin/JVM:
                        泛型内联类(实验性功能),
                        对委托属性的更多优化
                </li>
                <li>
                    Kotlin/Native:
                        默认启用新的内存管理器 (废弃了冻结 API, 以及能够从 Swift 在非主线程上运行 Kotlin <code>suspend</code> 函数),
                        对生成的框架可定制 bundle 标识符,
                        改善了为 Objective-C 头文件生成的文档
                </li>
                <li>
                    Kotlin/JS IR:
                        改善了使用增量编译时初次构建的速度,
                        更快的生成 klib
                </li>
                <li>
                    Gradle:
                        简化了 JVM 工具链的配置方法,
                        修正了废弃的功能,
                        以及保证与 Gradle 7.1 的兼容性
                </li>
            </ul>
            <p>详情请参见 <a href ="whatsnew-eap.html">EAP 版中的新功能</a> 或 <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20-RC">更新日志</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.20-Beta</strong>
            <p>发布日期: <strong>2022/08/01</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20-Beta" target="_blank">GitHub 发布页面</a></p>
        </td>
        <td>
            <ul>
                <li>
                    K2 编译器:
                        支持 <code>all-open</code>, <code>no-arg</code>, Parcelize, AtomicFU, 以及 <code>jvm-abi-gen</code> 编译器插件
                </li>
                <li>
                    语言:
                        用于值范围(Range)的<code>..&lt;</code> (<code>rangeUntil</code>) 操作符(实验性功能), 值范围不包含上界值,
                        废弃了变量类型推断为一个空交叉类型(Intersection Type)的情况,
                        对潜在的空交叉类型(Intersection Type)报告警告,
                        改进了源代码根目录中的脚本处理
                </li>
                <li>
                    Kotlin/JVM:
                        泛型内联类(实验性功能),
                        对委托属性的更多优化
                </li>
                <li>
                    Kotlin/Native:
                        默认启用新的内存管理器 (废弃了冻结 API, 以及能够从 Swift 在非主线程上运行 Kotlin <code>suspend</code> 函数),
                        对生成的框架可定制 bundle 标识符,
                        改善了为 Objective-C 头文件生成的文档
                </li>
                <li>
                    Kotlin/JS IR:
                        改善了使用增量编译时初次构建的速度,
                        更快的生成 klib
                </li>
                <li>
                    Gradle:
                        简化了 JVM 工具链的配置方法,
                        修正了废弃的功能,
                        以及保证与 Gradle 7.1 的兼容性
                </li>
            </ul>
            <p>详情请参见 <a href ="whatsnew-eap.html">EAP 版中的新功能</a> or <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20-Beta">更新日志</a>.</p>
        </td>
    </tr>
</table>
