---
layout: reference
title: Kotlin 发展路线图
date: 2020-10-01
---

# Kotlin 发展路线图

<table>
    <tr>
        <td><strong>最终更新</strong></td>
        <td>2020年10月</td>
    </tr>
    <tr>
        <td><strong>时间跨度</strong></td>
        <td>6 个月, 到 2021 年 3 月</td>
    </tr>
    <tr>
        <td><strong>下次更新</strong></td>
        <td>2021 年 1 月</td>
    </tr>
</table>

欢迎阅读 Kotlin 发展路线图!
在这里你可以了解 Kotlin 开发组的工作重点.

关于发展路线图文档, 请注意以下几点:

1. 本文描述开发组正在投入的主要方向.
2. 本文不是开发组工作内容的完整列表, 而只列举了那些最大的开发项目.
3. 在特定的版本中, 并不保证一定会发布特定的功能, 或修复 bug.
4. 本文列举了一些被推迟, 开发组在短期内 **不会** 关注的事项.
5. 并没有任何事情是完全确定的, 我们会根据开发进展调整优先事项, 并大约每 3 个月更新一次发展路线图.

如果对发展路线图或其中列举的项目有任何问题或反馈, 欢迎提交到 [YouTrack Bug 追踪系统](https://youtrack.jetbrains.com/issues/KT?q=%23%7BRoadmap%20Item%7D%20),
或 Kotlin Slack ([需要邀请才能加入](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_ga=2.60878444.1901676095.1599823213-394965905.1588600024)) 的 [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) 讨论频道.

## 关键优先事项

这个发展路线图的目的是为你提供一个整体图景.
下面是我们的关键优先事项列表 – 我们正在全力投入的开发方向:

- **快速周转**: 让 变更-测试-debug 更加快速的循环.
- **新编译器**: 重写 Kotlin 编译器, 优化它的速度, 并行性, 以及统一性. 之后我们还会改进对外部插件的支持(pluggability).
- **快速而且流畅的 IDE**: 改进 Kotlin IDE 的稳定性和性能.
- **用于 JVM 服务器端开发的 Kotlin**: 在整个 Kotlin 生态系统中更好的支持服务器端使用场景.
- **Kotlin 跨平台移动应用程序**: 针对移动平台上的代码共用功能, 改进用户体验和功能.

## Kotlin 各子系统的发展路线图

下表描述我们目前正在开发的最大的项目.

<table>
    <tr>
        <th>子系统</th>
        <th>目前的工作重点</th>
        <th>推迟到以后版本的功能</th>
    </tr>
    <tr>
        <td><strong>语言</strong>
        </td>
        <td>
            <ul>
                <li><p>支持 JVM Record<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42430" target="_blank">KT-42430</a>)</p></li>
                <li><p>支持 JVM 封闭类(Sealed Class)<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42433" target="_blank">KT-42433</a>)</p></li>
                <li><p>发布内联类(Inline Class) 的稳定版, 确保与 Java Valhalla 项目兼容<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42434" target="_blank">KT-42434</a>)</p></li>
                <li><p>开发多接受者(multiple receivers)功能的原型<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42435" target="_blank">KT-42435</a>)</p></li>
            </ul>
        </td>
        <td>
        </td>
    </tr>
    <tr>
        <td><strong>编译器内核</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>新编译器的自我引导(Bootstrap) (让 Kotlin 新编译器能够编译自身)<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42285" target="_blank">KT-42285</a>)</p>
                </li>
                <li>
                  <p>维护当前的编译器(只进行 bug 修复)<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42286" target="_blank">KT-42286</a>)</p>
                </li>
            </ul>
        </td>
        <td>
            <ul>
                <li><p>⏸ 编译器 Plugin API 的稳定版</p></li>
                <li><p>⏸ 改进脚本功能</p></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Kotlin/JVM</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>发布新 JVM IR 后端的稳定版<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42287" target="_blank">KT-42287</a>)</p>
                </li>
                <li>
                  <p>维护旧的 JVM 后端, 修复重大 bug<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42288" target="_blank">KT-42288</a>)</p>
                </li>
            </ul>
         </td>
        <td>
        </td>
    </tr>
    <tr>
        <td><strong>Kotlin/JS</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>发布新 JS IR 后端的稳定版<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42289" target="_blank">KT-42289</a>)</p>
                </li>
                <li>
                  <p>改进 Dukat 支持<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42290" target="_blank">KT-42290</a>)</p>
                </li>
                <li>
                  <p>维护旧的 JS 后端, 修复重大 bug<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42291" target="_blank">KT-42291</a>)</p>
                </li>
            </ul>
         </td>
        <td>
            <ul><li>⏸ 支持 ES6</li></ul>
        </td>
    </tr>
    <tr>
        <td><strong>Kotlin/WASM</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>开发针对 Wasm GC 提案的编译器原型<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42292" target="_blank">KT-42292</a>)</p>
                </li>
            </ul>
         </td>
        <td>
            <p>注意: <a href="native-overview.html" target="_blank">Kotlin/Native</a> 中的 Wasm 支持功能(通过 LLVM) 将被废弃, 并删除</p>
        </td>
    </tr>
    <tr>
        <td><strong>Kotlin/Native</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>在增量发布之间提供二进制兼容性<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42293" target="_blank">KT-42293</a>)</p>
                </li>
                <li>
                  <p>改善编译时间<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42294" target="_blank">KT-42294</a>)</p>
                </li>
                <li>
                  <p>运行期性能: 改善对象分配时间<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42295" target="_blank">KT-42295</a>)</p>
                </li>
                <li>
                  <p>开发新的垃圾收集器原型<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42296" target="_blank">KT-42296</a>)</p>
                </li>
                <li>
                  <p>改进 Kotlin 代码到 Objective-C 的导出功能<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42297" target="_blank">KT-42297</a>)</p>
                </li>
            </ul>
         </td>
        <td>
            <ul>
                <li>
                  <p>⏸ 支持 ARM Mac 和 Catalyst<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-39834" target="_blank">KT-39834</a>)<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-39833" target="_blank">KT-39833</a>)<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-40442" target="_blank">KT-40442</a>)</p>
                </li>
                <li>
                  <p>⏸ 与 Swift 直接交互</p>
                </li>
                <li>
                  <p>⏸ 与 C++ 交互</p>
                </li>
                <li>
                  <p>⏸ 支持 Alpine Linux<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-38876" target="_blank">KT-38876</a>)</p>
                </li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Kotlin Multiplatform</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>KMM plugin: 修复主要 bug<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42299" target="_blank">KT-42299</a>)</p>
                </li>
                <li>
                  <p>KMM plugin: 在 Android 设备上运行共通测试代码<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42298" target="_blank">KT-42298</a>)</p>
                </li>
                <li>
                  <p>改进 iOS 依赖项管理<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42301" target="_blank">KT-42301</a>)</p>
                </li>
                <li>
                  <p>改进 Gradle 和 编译器错误信息<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42303" target="_blank">KT-42303</a>)</p>
                </li>
            </ul>
         </td>
        <td>
            <ul>
                <li>
                  <p>⏸ 在 JVM 和 Android 平台之间共用代码</p>
                </li>
                <li>
                  <p>⏸ KMM plugin: 支持 IntelliJ IDEA</p>
                </li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>IDE</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>改进 IDE 性能<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42304" target="_blank">KT-42304</a>)</p>
                </li>
                <li>
                  <p>针对 Inline Method 功能, 以及修改方法签名的代码重构功能, 改进跨语言支持<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42306" target="_blank">KT-42306</a>)</p>
                </li>
                <li>
                  <p>开发封装了新编译器的 IDE plugin 原型<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42307" target="_blank">KT-42307</a>)</p>
                </li>
                <li>
                  <p>将 Kotlin plugin 移动到 IntelliJ 平台开发的基础设置之内<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42308" target="_blank">KT-42308</a>)</p>
                </li>
            </ul>
         </td>
        <td>
            <p>注意: 在 VSCode 或其他 IDE 中支持 Kotlin, 不在 Kotlin 开发组的发展路线图中. 欢迎开发社区发起这方面的工作.</p>
        </td>
    </tr>
    <tr>
        <td><strong>构建工具</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>改善 Gradle 中的增量编译的性能<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42309" target="_blank">KT-42309</a>)</p>
                </li>
                <li>
                  <p>支持 Gradle 配置缓存<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42310" target="_blank">KT-42310</a>)</p>
                </li>
                <li>
                  <p>缩短 Gradle 项目的打开时间<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42311" target="_blank">KT-42311</a>)</p>
                </li>
            </ul>
         </td>
        <td>
            <ul>
                <li><p>⏸ 改善 Kotlin Maven 支持</p></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>库</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>在标准库中支持 <code>java.nio.Path</code> 扩展<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42436" target="_blank">KT-42436</a>)</p>
                </li>
                <li>
                  <p>让跨平台的 <code>kotlin.text</code> API 默认不依赖于 locale 设定(locale-agnostic)<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42437" target="_blank">KT-42437</a>)</p>
                </li>
                <li>
                  <p>改进 Kotlin/Native 的多线程协程库的可用性<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42314" target="_blank">KT-42314</a>)</p>
                </li>
                <li>
                  <p>改进 <code>kotlinx-datetime</code> 库<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42315" target="_blank">KT-42315</a>)</p>
                </li>
                <li>
                  <p>改进 <code>kotlinx-serialization</code> (版本 v1.1)<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42316" target="_blank">KT-42316</a>)</p>
                </li>
                <li>
                  <p>改进 <code>kotlinx-coroutines</code> (版本 v1.4)<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42317" target="_blank">KT-42317</a>)</p>
                </li>
            </ul>
         </td>
        <td>
            <ul>
                <li><p>⏸ <code>kotlinx-cli</code></p></li>
                <li><p>⏸ <code>binary-compatibility-validator</code></p></li>
                <li><p>⏸ <code>kotlinx-io</code></p></li>
                <li><p>⏸ 其他任何新的跨平台库</p></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Ktor</strong>
        </td>
        <td>
           <p><a href="https://blog.jetbrains.com/ktor/2020/08/10/ktor-roadmap-for-2020-2021/" target="_blank">Ktor 发展路线图</a></p>
         </td>
        <td>
        </td>
    </tr>
</table>
