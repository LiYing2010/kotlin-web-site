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
        <td>2022年07月</td>
    </tr>
    <tr>
        <td><strong>下次更新</strong></td>
        <td>2022年11月</td>
    </tr>
</table>

欢迎阅读 Kotlin 发展路线图! 在这里你可以了解 Kotlin 开发组的工作重点.

## 关键优先事项

这个发展路线图的目的是为你提供一个整体图景.
下面是我们的关键优先事项列表 – 我们正在全力投入的开发方向:

* **快速周转**: 让 变更-测试-debug 更加快速的循环.
* **新编译器**: 重写 Kotlin 编译器, 优化它的速度, 并行性, 以及统一性. 之后我们还会改善对外部插件的支持(pluggability).
* **快速而且流畅的 IDE**: 改善 Kotlin plugin 的稳定性和性能.
* **用于 JVM 服务器端开发的 Kotlin**: 在整个 Kotlin 生态系统中更好的支持服务器端使用场景.
* **Kotlin Multiplatform Mobile**: 针对移动平台上的代码共用功能, 改善用户体验和功能.

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

访问 [我们 YouTrack Bug 追踪系统的 roadmap 版块](https://youtrack.jetbrains.com/agiles/153-1251/current) <img src="{{ url_for('asset', path='/docs/images/roadmap/youtrack-logo.png') }}" alt="YouTrack" width="30" style="display:inline" />

<img src="{{ url_for('asset', path='/docs/images/roadmap/roadmap-board.png') }}" alt="Roadmap board in YouTrack" width="700" />

### 发展路线图详细内容

<table>
    <tr>
        <th>子系统</th>
        <th>目前的工作重点</th>
    </tr>
    <tr>
        <td><strong>语言</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-15613" target="_blank">
                    🆕 为 <code>until</code> 操作符引入特殊语法
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-11968" target="_blank">
                    对静态成员和静态扩展(static extension), 研究基于 namespace 的解决方案, 并实现原型
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-27576" target="_blank">
                    支持内联封闭类(inline sealed class)
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-4107" target="_blank">
                    设计并实现对象的 toString 解决方案
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48872" target="_blank">
                    对 Enum.values() 提供更加现代并且性能更好的替代实现
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-10468" target="_blank">
                    对扩展函数和扩展属性支持多个接受者
                </a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>编译器内核</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42286" target="_blank">
                  维护当前的编译器
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">
                  改善 Kotlin 脚本
                </a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>K2 编译器</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52604" target="_blank">
                    🆕 发布 K2 Beta 版
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52594" target="_blank">
                    🆕 在 K2 平台对 Native 提供 Alpha 支持
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52593" target="_blank">
                    🆕 在 K2 平台对 JS 提供 Alpha 支持
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52597" target="_blank">
                    🆕 在 K2 平台支持 Multiplatform
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49508" target="_blank">
                    提供 K2 编译器 Plugin API 的稳定版
                </a></li>
            </ul>
        </td>
        <td></td>
    </tr>
    <tr>
        <td><strong>Kotlin/JVM</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49682" target="_blank">
                    在 JVM IR 中支持 kapt
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49514" target="_blank">
                    修正 JVM 平台上与内联类(inline class)相关的问题
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46767" target="_blank">
                    维护新的 JVM IR 后端
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46768" target="_blank">
                    改善新的 JVM IR 后端的编译速度
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46770" target="_blank">
                    稳定 JVM 专有的实验性功能
                </a></li>
            </ul>
         </td>
    </tr>
    <tr>
        <td><strong>Kotlin/JS</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42289" target="_blank">
                  发布新 JS IR 后端的稳定版
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42291" target="_blank">
                  维护旧的 JS 后端, 修复重大 bug
                </a></li>
            </ul>
         </td>
    </tr>
    <tr>
        <td><strong>Kotlin/Wasm</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46773" target="_blank">
                    实现 Kotlin/Wasm 编译器后端的实验性版本
                </a></li>
            </ul>
            <p>
                注意: <a href="native/native-overview.html" target="_blank">Kotlin/Native</a>
                中的 Wasm 支持功能(通过 LLVM) 将被废弃, 并删除
            </p>
         </td>
    </tr>
    <tr>
        <td><strong>Kotlin/Native</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52595" target="_blank">
                    🆕 将新的内存管理器升级到 Beta 版, 并默认启用
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42294" target="_blank">
                    改善编译时间
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42297" target="_blank">
                    改善 Kotlin 代码到 Objective-C 的导出功能
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42293" target="_blank">
                    Native: 在增量发布之间保证二进制兼容性
                </a></li>
            </ul>
         </td>
    </tr>
    <tr>
        <td><strong>Kotlin Multiplatform</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52596" target="_blank">
                    🆕 将 Kotlin Multiplatform Mobile 升级到 Beta 版
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52599" target="_blank">
                    🆕 在 Multiplatform 项目中改进对 Android 的支持
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52600" target="_blank">
                    🆕 提供 klib 的稳定版
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49525" target="_blank">
                    改进 Multiplatform 开发工具链的稳定性和健壮性
                </a></li>
            </ul>
         </td>
    </tr>
    <tr>
        <td><strong>IDE</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-21906" target="_blank">
                    🆕 提供代码分析功能的稳定版
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-20044" target="_blank">
                    提高编译器和平台的版本更新速度
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-20045" target="_blank">
                    改善对 Multiplatform 项目的支持
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-20046" target="_blank">
                    提供 Eclipse plugin 的稳定版
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-18195" target="_blank">
                    开发使用新的编译器前端的 IDE plugin 原型
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-18174" target="_blank">
                    改善 IDE 性能
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-18572" target="_blank">
                    改善调试功能的用户体验
                </a></li>
            </ul>
         </td>
    </tr>
    <tr>
        <td><strong>构建工具</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52603" target="_blank">
                    🆕 开发 Gradle 编译回避功能的稳定版
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49532" target="_blank">
                    改善 Kotlin Daemon 的使用体验
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42309" target="_blank">
                    改善 Gradle 增量编译的性能
                </a></li>
            </ul>
         </td>
    </tr>
    <tr>
        <td><strong>库</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52601" target="_blank">
                    🆕 继续开发并提高标准库的稳定性
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48011" target="_blank">
                    发布 <code>kotlinx-metadata-jvm</code> 的稳定版
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48998" target="_blank">
                    发布 Dokka 的稳定版
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49527" target="_blank">
                    启动 <code>kotlinx-kover</code> 项目, 并提高其生产性
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49528" target="_blank">
                    发布 <code>kotlinx-serialization</code> 1.4
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
            </ul>
         </td>
    </tr>
    <tr>
        <td><strong>网站</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44339" target="_blank">
                    让 Kotlin 网站更适合移动设备阅读
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46791" target="_blank">
                    让 UI 和导航保持一致性
                </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49536" target="_blank">
                    改善 Kotlin Playground
                </a></li>
            </ul>
        </td>
        <td></td>
    </tr>
</table>

> * 这个发展路线图不是开发组工作内容的完整列表, 而只列举了那些最大的开发项目.
> * 在特定的版本中, 并不保证一定会发布特定的功能, 或修复 bug.
> * 我们会根据开发进展调整优先事项, 并大约每 3 个月更新一次发展路线图.
{:.note}

## 2021年11月以后的变化

### 已完成的任务

我们 **完成** 了前一个版本的路线图中的以下任务:

* ✅ 语言: [对泛型类型参数允许明确指定非 null 类型](https://youtrack.jetbrains.com/issue/KT-26245)
* ✅ 语言: [实现接口时允许代理到内联类(inline class)的内联值(inlined value)](https://youtrack.jetbrains.com/issue/KT-27435)
* ✅ 语言: [发布 OptIn 注解](https://youtrack.jetbrains.com/issue/KT-22956)
* ✅ 语言: [发布构建器推断功能](https://youtrack.jetbrains.com/issue/KT-45618)
* ✅ 语言: [支持封闭的(穷尽式(exhaustive)) when 语句](https://youtrack.jetbrains.com/issue/KT-12380)
* ✅ 语言: [多个接受者功能的原型开发](https://youtrack.jetbrains.com/issue/KT-42435)
* ✅ 编译器内核: [对 jspecify 的最终支持](https://youtrack.jetbrains.com/issue/KT-46762)
* ✅ K2 编译器: [发布 K2/JVM compiler Alpha 版](https://youtrack.jetbrains.com/issue/KT-46756)
* ✅ K2 编译器: [实现基本的编译时计算功能](https://youtrack.jetbrains.com/issue/KT-49303)
* ✅ Kotlin/JVM: [支持对函数型接口(functional interface)的构造器的方法引用](https://youtrack.jetbrains.com/issue/KT-47939)
* ✅ Kotlin/JS: [JS IR 后端: 新增功能, 为每个模块生成单独的 JS 文件](https://youtrack.jetbrains.com/issue/KT-44319)
* ✅ Kotlin/Native: [将新的内存管理器升级到 Alpha 版](https://youtrack.jetbrains.com/issue/KT-49520)
* ✅ Multiplatform: [改善在 Kotlin 中使用 Native 库的用户体验](https://youtrack.jetbrains.com/issue/KT-44329)
* ✅ Multiplatform: [改善 Kotlin Multiplatform Mobile 项目环境设置功能的用户体验](https://youtrack.jetbrains.com/issue/KT-49523)
* ✅ Multiplatform: [改善管理 Kotlin/Native 二进制输出的 DSL](https://youtrack.jetbrains.com/issue/KT-49524)
* ✅ IDE: [改善新建项目向导](https://youtrack.jetbrains.com/issue/KTIJ-18809)
* ✅ 构建工具: [让 kapt 能够直接在最新版的 JDK 上工作](https://youtrack.jetbrains.com/issue/KT-49533)
* ✅ 构建工具: [改善 Kotlin Gradle plugin 的用户体验](https://youtrack.jetbrains.com/issue/KT-46789)
* ✅ 网站: [更新社区图片, 使用新的 Kotlin 视觉风格](https://youtrack.jetbrains.com/issue/KT-46792)

### 新增任务

我们向路线图 **新增** 了以下任务:

* 🆕 语言: [为 `until` 操作符引入特殊语法](https://youtrack.jetbrains.com/issue/KT-15613)
* 🆕 K2 编译器: [发布 K2 Beta 版](https://youtrack.jetbrains.com/issue/KT-52604)
* 🆕 K2 编译器: [在 K2 平台对 Native 提供 Alpha 支持](https://youtrack.jetbrains.com/issue/KT-52594)
* 🆕 K2 编译器: [在 K2 平台对 JS 提供 Alpha 支持](https://youtrack.jetbrains.com/issue/KT-52593)
* 🆕 K2 编译器: [在 K2 平台支持 Multiplatform](https://youtrack.jetbrains.com/issue/KT-52597)
* 🆕 Kotlin/Native: [将新的内存管理器升级到 Beta 版, 并默认启用](https://youtrack.jetbrains.com/issue/KT-52595)
* 🆕 Multiplatform: [将 Kotlin Multiplatform Mobile 升级到 Beta 版](https://youtrack.jetbrains.com/issue/KT-52596)
* 🆕 Multiplatform: [在 Multiplatform 项目中改进对 Android 的支持](https://youtrack.jetbrains.com/issue/KT-52599)
* 🆕 Multiplatform: [提供 klib 的稳定版](https://youtrack.jetbrains.com/issue/KT-52600)
* 🆕 IDE: [提供代码分析功能的稳定版](https://youtrack.jetbrains.com/issue/KTIJ-21906)
* 🆕 库: [继续开发并提高标准库的稳定性](https://youtrack.jetbrains.com/issue/KT-52601)
* 🆕 构建工具: [开发 Gradle 编译回避功能的稳定版](https://youtrack.jetbrains.com/issue/KT-52603)

### 删除的任务

我们从路线图中 **删除** 了以下任务:

* ❌ 语言: [对内联类提供带明确签名的相等操作符](https://youtrack.jetbrains.com/issue/KT-24874)
* ❌ Kotlin/JVM: [在 JVM 平台, 允许在不同的源代码文件中声明相同名称的私有顶级类(private top-level class) 或类型别名(type alias)](https://youtrack.jetbrains.com/issue/KT-17699)
* ❌ Kotlin/JVM: [允许在编译期间列举一个封闭类的所有直接子类(direct subclass)而不需要使用反射](https://youtrack.jetbrains.com/issue/KT-25871)
* ❌ Kotlin/JVM: [支持对 Java 合成属性(synthetic property)的引用](https://youtrack.jetbrains.com/issue/KT-8575)
* ❌ Kotlin/JS: [JS: 支持 ES6 编译目标](https://youtrack.jetbrains.com/issue/KT-8373)
* ❌ Kotlin/JS: [改善 Dukat 支持](https://youtrack.jetbrains.com/issue/KT-42290)
* ❌ Kotlin/Native: [支持在 Mac Catalyst (x86-64 和 arm64) 平台构建 Kotlin/Native 代码 ](https://youtrack.jetbrains.com/issue/KT-40442)
* ❌ Kotlin/Native: [支持与 Swift 直接交互](https://youtrack.jetbrains.com/issue/KT-49521)
* ❌ Kotlin/Native: [支持在 Alpine Linux 平台运行 Kotlin/Native 输出的二进制文件](https://youtrack.jetbrains.com/issue/KT-38876)
* ❌ IDE: [实现用户在 Java 中拥有但 Kotlin 中缺少的高级工具](https://youtrack.jetbrains.com/issue/KTIJ-20047)
* ❌ IDE: [改善较少使用的功能的质量](https://youtrack.jetbrains.com/issue/KTIJ-20048)
* ❌ 构建工具: [改善 the quality of Gradle import](https://youtrack.jetbrains.com/issue/KT-46788)
* ❌ 网站: [提供基础设施, 帮助开发社区翻译文档](https://youtrack.jetbrains.com/issue/KT-49537)

### 进行中的任务

路线图中所有其他项目都在进行之中. 你可以到我们的
[YouTrack Bug 追踪系统](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)
查看它们的进展.
