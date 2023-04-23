---
layout: reference
title: Kotlin 发展路线图
date: 2020-10-01
---

# Kotlin 发展路线图

最终更新: {{ site.data.releases.latestDocDate }}

<table>
    <tr>
        <td><strong>最终更新</strong></td>
        <td>2022年12月</td>
    </tr>
    <tr>
        <td><strong>下次更新</strong></td>
        <td>2023年06月</td>
    </tr>
</table>

欢迎阅读 Kotlin 发展路线图! 在这里你可以了解 Kotlin 开发组的工作重点.

## 关键优先事项

这个发展路线图的目的是为你提供一个整体图景.
下面是我们的关键项目列表 – 我们正在全力投入的最重要的开发方向:

* **K2 编译器**: 重写 Kotlin 编译器, 优化它的速度, 并行性, 以及统一性. 还可以帮助我们引入更多令人期待的语言功能特性. 
* **基于 K2 的 IntelliJ plugin**: 更加快的代码编译速度, 语法高亮显示, 搜索, 以及更加稳定的代码分析功能.
* **Kotlin Multiplatform Mobile**: 通过提升工具链的稳定性, 改进文档, 确保兼容性, 将这一技术升级到稳定版.
* **库作者的开发体验**: 一组文档和工具, 帮助开发者设置环境, 开发代码, 并发布 Kotlin 库.

## Kotlin 各子系统的发展路线图

关于我们正在开发的最大的项目, 请参见
[YouTrack 版块](https://youtrack.jetbrains.com/agiles/153-1251/current)
或
[发展路线图详细内容](#roadmap-details) 一览表.

关于 Kotlin 发展路线图或其中列举的项目, 如果你有任何问题或反馈, 欢迎提交到
[YouTrack Bug 追踪系统](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)
或
Kotlin Slack([在这里请求加入](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up))
的 [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) 讨论频道.

### YouTrack 版块

访问 [我们 YouTrack Bug 追踪系统的 roadmap 版块](https://youtrack.jetbrains.com/agiles/153-1251/current) <img src="{{ url_for('asset', path='docs/images/roadmap/youtrack-logo.png') }}" alt="YouTrack" width="30" style="display:inline" />

<img src="{{ url_for('asset', path='docs/images/roadmap/roadmap-board.png') }}" alt="YouTrack 中的 Roadmap 版块" width="700" />

### 发展路线图详细内容

<table>
    <tr>
        <th>子系统</th>
        <th>目前的工作重点</th>
    </tr>
    <tr>
        <td><strong>语言</strong></td>
        <td>
            <p><tip><a href="https://youtrack.jetbrains.com/issue/KT-54620" target="_blank">新增语言功能特性列表</a></tip></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-15613" target="_blank">
                    为 <code>until</code> 操作符引入特殊语法
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48872" target="_blank">
                    对 <code>Enum.values()</code> 提供更加现代并且性能更好的替代实现
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-1436" target="_blank">
                    支持 非 local 的 <code>break</code> 和 <code>continue</code>
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-4107" target="_blank">
                    设计并实现对象的 <code>toString</code> 解决方案
                </a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>编译器</strong></td>
        <td>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52604" target="_blank">
                    发布 K2 Beta 版
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49514" target="_blank">
                    修正 JVM 平台上内联类(inline class)的相关问题
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46770" target="_blank">
                    将 JVM 平台的实验性功能升级到稳定版
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46773" target="_blank">
                    实现 Kotlin/Wasm 编译器后端的实验性版本
                </a></li>
            </list>
        </td>
        <td></td>
    </tr>
    <tr>
        <td><strong>Multiplatform</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-55513">
                    将 Kotlin Multiplatform Mobile 升级到稳定版
                </a></li> 
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-55512">
                    改善 Kotlin/Native 新内存管理器的健壮性和性能, 并废弃旧的内存管理器
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52600" target="_blank">
                    提供 klib 的稳定版: 帮助库开发者更便利的保证二进制兼容性 
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42297" target="_blank">
                    改善 Kotlin 代码导出到 Objective-C 的功能
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42294" target="_blank">
                    改善 Kotlin/Native 的编译时间
                </a></li>
            </list>
         </td>
    </tr>
    <tr>
        <td><strong>工具</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTIJ-23988">
                    基于 K2 的 IntelliJ plugin 的第一个公开发布版 
                </a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTIJ-23989">
                    改善现在的 IDE plugin 的性能, 以及代码分析功能的稳定性
                </a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-55515">
                    将稳定的编译器参数导出到 Gradle DSL
                </a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTIJ-23990">
                    发布 Kotlin Notebooks IJ IDEA plugin 的实验性版本 
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">
                    改善 Kotlin 脚本, 以及 <code>.gradle.kts</code> 的使用体验
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49532" target="_blank">
                    改善 Kotlin Daemon 的使用体验
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42309" target="_blank">
                    改善 Gradle 增量编译的性能
                </a></li>
            </list>
         </td>
    </tr>
    <tr>
        <td><strong>库与生态系统</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-55073" target="_blank">
                    改善 KDoc 的使用体验
                </a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-55077" target="_blank">
                    为库开发者提供 Kotlin API 使用指南
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48011" target="_blank">
                    发布 <code>kotlinx-metadata-jvm</code> 的稳定版
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49527" target="_blank">
                    将 <code>kotlinx-kover</code> 升级到稳定版
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49529" target="_blank">
                    发布 <code>kotlinx-coroutines</code> 1.7
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46786" target="_blank">
                    开发 <code>atomicfu</code> 的稳定版, 并编写文档
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42315" target="_blank">
                    改善 <code>kotlinx-datetime</code> 库
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52601" target="_blank">
                    继续开发标准库, 并提升稳定性
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48998" target="_blank">
                    发布 Dokka 的稳定版
                </a></li>
            </list>
            <p><tip><a href="https://blog.jetbrains.com/ktor/2022/12/16/ktor-2023-roadmap/" target="_blank">
                Ktor 框架的开发路线图
            </a></tip></p>
         </td>
    </tr>
</table>

> * 这个发展路线图不是开发组工作内容的完整列表, 而只列举了那些最大的开发项目.
> * 在特定的版本中, 并不保证一定会发布特定的功能, 或修复 bug.
> * 我们会根据开发进展调整优先事项, 并大约每 3 个月更新一次发展路线图.
{:.note}

## 2022年05月以后的变化

### 已完成的任务

我们 **完成** 了前一个版本的路线图中的以下任务:

* ✅ 编译器内核: [维护当前的编译器](https://youtrack.jetbrains.com/issue/KT-42286)
* ✅ Kotlin/JVM: [在 JVM IR 中支持 kapt](https://youtrack.jetbrains.com/issue/KT-49682)
* ✅ Kotlin/JVM: [维护新的 JVM IR 后端](https://youtrack.jetbrains.com/issue/KT-46767)
* ✅ Kotlin/JVM: [改善新的 JVM IR 后端的编译速度](https://youtrack.jetbrains.com/issue/KT-46768)
* ✅ Kotlin/Native: [在增量发布之间保证二进制兼容性](https://youtrack.jetbrains.com/issue/KT-42293)
* ✅ Kotlin/Native: [将新的内存管理器升级到 Beta 版, 并默认启用](https://youtrack.jetbrains.com/issue/KT-52595)
* ✅ Kotlin/JS: [发布新 JS IR 后端的稳定版](https://youtrack.jetbrains.com/issue/KT-42289)
* ✅ Kotlin/JS: [维护旧的 JS 后端, 修复严重 bug](https://youtrack.jetbrains.com/issue/KT-42291)
* ✅ Multiplatform: [将 Kotlin Multiplatform Mobile 升级到 Beta 版](https://youtrack.jetbrains.com/issue/KT-52596)
* ✅ 库: [发布 `kotlinx-serialization` 1.4](https://youtrack.jetbrains.com/issue/KT-49528)
* ✅ IDE: [提供代码分析功能的稳定版](https://youtrack.jetbrains.com/issue/KTIJ-21906)
* ✅ IDE: [提高编译器和平台的版本更新速度](https://youtrack.jetbrains.com/issue/KTIJ-20044)
* ✅ IDE: [改善对 Multiplatform 项目的支持](https://youtrack.jetbrains.com/issue/KTIJ-20045)
* ✅ IDE: [改善 Eclipse plugin 的稳定版](https://youtrack.jetbrains.com/issue/KTIJ-20046)
* ✅ IDE: [开发使用新的编译器前端的 IDE plugin 原型](https://youtrack.jetbrains.com/issue/KTIJ-18195)
* ✅ IDE: [改善 IDE 性能](https://youtrack.jetbrains.com/issue/KTIJ-18174)
* ✅ IDE: [改善调试功能的用户体验](https://youtrack.jetbrains.com/issue/KTIJ-18572)
* ✅ 网站: [让 Kotlin 网站更适合移动设备阅读](https://youtrack.jetbrains.com/issue/KT-44339)
* ✅ 网站: [让 UI 和导航保持一致性](https://youtrack.jetbrains.com/issue/KT-46791)

### 新增任务

我们向路线图 **新增** 了以下任务:

* ℹ️ 语言: [所有新增语言功能特性列表](https://youtrack.jetbrains.com/issue/KT-54620)
* 🆕 Multiplatform: 将 Kotlin Multiplatform Mobile 升级到稳定版
* 🆕 Multiplatform: 改善 Kotlin/Native 新内存管理器的健壮性和性能, 并废弃旧的内存管理器
* 🆕 工具: 基于 K2 的 IntelliJ plugin 的第一个公开发布版
* 🆕 工具: 改善现在的 IDE plugin 的性能, 以及代码分析功能的稳定性
* 🆕 工具: 将稳定的编译器参数导出到 Gradle DSL
* 🆕 工具: Kotlin Notebooks IDEA plugin
* 🆕 库: [改善 KDoc 的使用体验](https://youtrack.jetbrains.com/issue/KT-55073)
* 🆕 库: [为库开发者提供 Kotlin API 使用指南](https://youtrack.jetbrains.com/issue/KT-55077)

### 删除的任务

我们从路线图中 **删除** 了以下任务:

* ❌ 语言: [对静态成员和静态扩展(static extension), 研究基于 namespace 的解决方案, 并实现原型](https://youtrack.jetbrains.com/issue/KT-11968)
* ❌ 语言: [对扩展函数和扩展属性支持多个接受者](https://youtrack.jetbrains.com/issue/KT-10468)
* ❌ 语言: [支持内联封闭类(inline sealed class)](https://youtrack.jetbrains.com/issue/KT-27576)
* ❌ K2 编译器: [提供 K2 编译器 Plugin API 的稳定版](https://youtrack.jetbrains.com/issue/KT-49508)
* ❌ K2 编译器: [在 K2 平台对 Native 提供 Alpha 支持](https://youtrack.jetbrains.com/issue/KT-52594)
* ❌ K2 编译器: [在 K2 平台对 JS 提供 Alpha 支持](https://youtrack.jetbrains.com/issue/KT-52593)
* ❌ K2 编译器: [在 K2 平台支持 Multiplatform](https://youtrack.jetbrains.com/issue/KT-52597)
* ❌ Multiplatform: [改进 Multiplatform 开发工具链的稳定性和健壮性](https://youtrack.jetbrains.com/issue/KT-49525)
* ❌ Multiplatform: [在 Multiplatform 项目中改进对 Android 的支持](https://youtrack.jetbrains.com/issue/KT-52599)
* ❌ 构建工具: [开发 Gradle 编译回避功能的稳定版](https://youtrack.jetbrains.com/issue/KT-52603)
* ❌ 网站: [改善 Kotlin Playground](https://youtrack.jetbrains.com/issue/KT-49536)

> 有些任务从开发路线图中删除了, 但没有完全放弃.
> 有些情况下, 我们将以前的路线图中的任务合并到了当前的路线图任务中.
{:.note}

### 进行中的任务

路线图中所有其他项目都在进行之中. 你可以到我们的
[YouTrack Bug 追踪系统](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)
查看它们的进展.
