---
layout: reference
title: Kotlin 的发布版本
---

# Kotlin 的发布版本

最终更新: {{ site.data.releases.latestDocDate }}

我们的发布版本包括几种不同的类型:

* _功能发布版(Feature release)_ (1._x_) 其中包括语言的重要变化.
* _增量发布版(Incremental release)_ (1._x_._y_) 在功能发布版之间发布, 其中包括工具更新, 性能改善, 以及 bug 修复.
* _Bug 修复发布版(Bug fix release)_ (1._x_._yz_) 其中包括针对增量发布版的 bug 修复.

比如, 对于功能发布版 1.3, 我们有几个增量发布版, 包括 1.3.10, 1.3.20, 以及 1.3.70.
对于 1.3.70, 我们有 2 个 bug 修复发布版 – 1.3.71 和 1.3.72.

对于每个增量发布版和功能发布版, 我们还会发布几个预览 (_EAP_) 版, 供开发者在正式发布之前试用新功能.
详情请参见 [早期预览(Early Access Preview)](eap.html).

关于 Kotlin 的发布版本, 详情请参见
[Kotlin 发布版的类型, 以及它们的兼容性](kotlin-evolution.html#feature-releases-and-incremental-releases).

## 更新到新的发布版

新的发布版发布之后, IntelliJ IDEA 和 Android Studio 会建议你升级.
如果你接受建议, IDE 会自动将 Kotlin 插件更新到最新版本.
在 **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates** 菜单中, 你可以选择 Kotlin 版本.

如果你的项目创建时使用了较早的 Kotlin 版本, 那么有可能需要在你的项目中改变 Kotlin 版本, 并更新 kotlinx 库 – 详情请查看 [推荐的版本](#release-details).

如果你要迁移到新的功能发布版, Kotlin 插件的迁移工具可以帮助你进行迁移.

## IDE 支持

以下版本的 IntelliJ IDEA 和 Android Studio 支持 Kotlin 语言最新版本:
* IntelliJ IDEA:
  * 最新的稳定版本 ([IntelliJ IDEA {{ site.data.releases.kotlinPluginVersion }}](https://www.jetbrains.com/idea/whatsnew/))
  * 前一个稳定版本 ([IntelliJ IDEA {{ site.data.releases.kotlinPreviousPluginVersion }}](https://www.jetbrains.com/idea/whatsnew/2022-1/))
  * [早期预览](https://www.jetbrains.com/resources/eap/) 版
* Android Studio:
  * [最新发布版](https://developer.android.com/studio)
  * [早期预览版](https://developer.android.com/studio/preview)

## 各发布版详情

下表是 Kotlin 最新发布版的详情.

你也可以使用 [Kotlin 的预览版](eap.html#build-details).

<table>
    <tr>
        <th>构建信息</th>
        <th>主要内容</th>
        <th>推荐的 kotlinx 库版本</th>
    </tr>
    <tr>
        <td><strong>1.7.10</strong>
            <p>发布日: <strong>2022/07/07</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.10" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.7.0 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">Kotlin 1.7.0</a>.</p>
            <note>
                对于 Android Studio Dolphin (213) 和 Android Studio Electric Eel (221),
                Kotlin plugin 1.7.10 会在之后的 Android Studios 更新中一同发布.
            </note>
        </td>
         <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.3" target="_blank">1.3.3</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.3" target="_blank">1.6.3</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.18.2" target="_blank">0.18.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-datetime" target="_blank"><strong>kotlinx-datetime</strong></a> 版本: <a href="https://github.com/Kotlin/kotlinx-datetime/releases/tag/v0.4.0" target="_blank">0.4.0</a></li>
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/2.0.3" target="_blank">2.0.3</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.5" target="_blank">0.7.5</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>), 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.0</strong>
            <p>发布日: <strong>2022/06/09</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>一个新功能发布版, 包含 JVM 平台的 Kotlin K2 编译器(Alpha 版), 稳定版的语言特性, 性能改善, 以及演进变化, 比如实验性 API 进入稳定状态.</p>
            <p>详情请参见:</p>
            <ul>
                <li><a href="whatsnew17.html" target="_blank">Kotlin 1.7.0 的新功能</a></li>
                <li><a href="https://youtu.be/54WEfLKtCGk" target="_blank">YouTube 视频: Kotlin 的新功能</a></li>
                <li><a href="compatibility-guide-17.html" target="_blank">Kotlin 1.7.0 兼容性指南</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.2" target="_blank">1.3.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.2" target="_blank">1.6.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.17.1" target="_blank">0.17.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-datetime" target="_blank"><strong>kotlinx-datetime</strong></a> 版本: <a href="https://github.com/Kotlin/kotlinx-datetime/releases/tag/v0.3.3" target="_blank">0.3.3</a></li>
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/2.0.2" target="_blank">2.0.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.5" target="_blank">0.7.5</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>), 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.21</strong>
            <p>发布日: <strong>2022/04/20</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.21" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.6.20 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="whatsnew1620.html" target="_blank">Kotlin 1.6.20</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.2" target="_blank">1.3.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0" target="_blank">1.6.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.17.1" target="_blank">0.17.1</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/2.0.0-beta-1" target="_blank">2.0.0-beta-1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.5" target="_blank">0.7.5</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>), 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.20</strong>
            <p>发布日: <strong>2022/04/04</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.20" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>增量发布版, 包含各种改进, 比如:</p>
            <ul>
                <li>上下文接受者(Context Receiver)的原型</li>
                <li>对函数式接口构造器的可调用引用</li>
                <li>Kotlin/Native: 新的内存管理器的性能改善</li>
                <li>Multiplatform: 默认使用层级项目结构(Hierarchical Project Structure)</li>
                <li>Kotlin/JS: IR 编译器改进</li>
                <li>Gradle: 编译器执行策略</li>
            </ul>
            <p>详情请参见 <a href="whatsnew1620.html" target="_blank">Kotlin 1.6.20</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.2" target="_blank">1.3.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0" target="_blank">1.6.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.17.1" target="_blank">0.17.1</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/2.0.0-beta-1" target="_blank">2.0.0-beta-1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.5" target="_blank">0.7.5</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>), 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.10</strong>
            <p>发布日: <strong>2021/12/14</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.10" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.6.0 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">Kotlin 1.6.0</a>.</p>
        </td>
         <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.1" target="_blank">1.3.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0" target="_blank">1.6.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.17.0" target="_blank">0.17.0</a></li>          
                <li><a href="https://ktor.io/" target="_blank"><strong>ktor</strong></a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/2.0.0-beta-1" target="_blank">2.0.0-beta-1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>), 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.0</strong>
            <p>发布日: <strong>2021/11/16</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>一个新功能发布版, 包含新的语言特性, 性能改善, 以及演进变化, 比如实验性 API 进入稳定状态.</p>
            <p>详情请参见:</p>
            <ul>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/" target="_blank">关于新版本发布的 Blog</a></li>
                <li><a href="whatsnew16.html" target="_blank">Kotlin 1.6.0 的新功能</a></li>
                <li><a href="compatibility-guide-16.html" target="_blank">Kotlin 1.6.0 兼容性指南</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0" target="_blank">1.3.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0" target="_blank">1.6.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.16.3" target="_blank">0.16.3</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.6.4" target="_blank">1.6.4</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>), 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.32</strong>
            <p>发布日: <strong>2021/11/29</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.32" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.5.31 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="whatsnew1530.html" target="_blank">Kotlin 1.5.30</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC" target="_blank">1.3.0-RC</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.2" target="_blank">1.5.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.16.3" target="_blank">0.16.3</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.6.3" target="_blank">1.6.3</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>), 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.31</strong>
            <p>发布日: <strong>2021/09/20</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.31" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.5.30 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="whatsnew1530.html" target="_blank">Kotlin 1.5.30</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC" target="_blank">1.3.0-RC</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.2" target="_blank">1.5.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.16.3" target="_blank">0.16.3</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.6.3" target="_blank">1.6.3</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>), 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.30</strong>
            <p>发布日: <strong>2021/08/23</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.30" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>增量发布版, 包含各种改进, 比如:</p>
            <ul>
                <li>JVM 平台上, 注解类的实例创建</li>
                <li>改进 opt-in 要求机制和类型推断</li>
                <li>Kotlin/JS IR 后端进入 Beta 版</li>
                <li>支持 Apple Silicon 编译目标</li>
                <li>改进对 CocoaPods 的支持</li>
                <li>Gradle: Java 工具链的支持, 并改进 daemon 配置</li>
            </ul>
            <p>详情请参见:</p>
            <ul>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/" target="_blank">关于新版本发布的 Blog</a></li>
                <li><a href="whatsnew1530.html" target="_blank">Kotlin 1.5.30 的新功能</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.3.0-RC" target="_blank">1.3.0-RC</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.1" target="_blank">1.5.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.16.2" target="_blank">0.16.2</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.6.2" target="_blank">1.6.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>), 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.21</strong>
            <p>发布日: <strong>2021/07/13</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.21" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.5.20 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="whatsnew1520.html" target="_blank">Kotlin 1.5.20</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1" target="_blank">1.2.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0" target="_blank">1.5.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.16.1" target="_blank">0.16.1</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.6.0" target="_blank">1.6.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>) 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.20</strong>
            <p>发布日: <strong>2021/06/24</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.20" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>增量发布版, 包含各种改进, 比如:</p>
            <ul>
                <li>在 JVM 平台 默认使用 <code>invokedynamic</code> 实现字符串拼接</li>
                <li>改进对 Lombok 和 JSpecify 的支持</li>
                <li>Kotlin/Native: KDoc 导出 Objective-C 头文件, 改进在同一数组内 <code>Array.copyInto()</code> 的速度</li>
                <li>Gradle: 注解处理器的类装载器缓存, 支持 Gradle 的 <code>--parallel</code> 属性</li>
                <li>标准库函数在各个平台的动作保持一致</li>
            </ul>
            <p>详情请参见:</p>
            <ul>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/" target="_blank">关于新版本发布的 Blog</a></li>
                <li><a href="whatsnew1520.html" target="_blank">Kotlin 1.5.20 的新功能</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1" target="_blank">1.2.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0" target="_blank">1.5.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.16.1" target="_blank">0.16.1</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.6.0" target="_blank">1.6.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>) 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.10</strong>
            <p>发布日: <strong>2021/05/24</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.10" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.5.0 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">Kotlin 1.5.0</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1" target="_blank">1.2.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0" target="_blank">1.5.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.16.1" target="_blank">0.16.1</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.5.4" target="_blank">1.5.4</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>) 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.0</strong>
            <p>发布日: <strong>2021/05/05</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.0" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>一个新功能发布版, 包含新的语言特性, 性能改善, 以及演进变化, 比如实验性 API 进入稳定状态.</p>
            <p>详情请参见:</p>
            <ul>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">关于新版本发布的 Blog</a></li>
                <li><a href="whatsnew15.html" target="_blank">Kotlin 1.5.0 的新功能</a></li>
                <li><a href="compatibility-guide-15.html" target="_blank">Kotlin 1.5.0 兼容性指南</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1" target="_blank">1.2.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0-RC" target="_blank">1.5.0-RC</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.16.1" target="_blank">0.16.1</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.5.3" target="_blank">1.5.3</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>) 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.32</strong>
            <p>发布日: <strong>2021/03/22</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.32" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.4.30 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="whatsnew1430.html" target="_blank">Kotlin 1.4.30</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0" target="_blank">1.1.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.4.3" target="_blank">1.4.3</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.15.2" target="_blank">0.15.2</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.5.2" target="_blank">1.5.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>) 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.31</strong>
            <p>发布日: <strong>2021/02/25</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.31" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.4.30 的 Bug 修复发布版. </p>
            <p>详情请参见 <a href="whatsnew1430.html" target="_blank">Kotlin 1.4.30</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0" target="_blank">1.1.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.4.2" target="_blank">1.4.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.15.1" target="_blank">0.15.1</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.5.1" target="_blank">1.5.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>) 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.30</strong>
            <p>发布日: <strong>2021/02/03</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.30" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>增量发布版, 包含各种改进, 比如:</p>
            <ul>
                <li>新的 JVM 后端 进入 Beta 版</li>
                <li>新语言特性的预览</li>
                <li>Kotlin/Native 的性能改进</li>
                <li>标准库 API 改进</li>
            </ul>
            <p>详情请参见:</p>
            <ul>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/01/kotlin-1-4-30-released/" target="_blank">关于新版本发布的 Blog</a></li>
                <li><a href="whatsnew1430.html" target="_blank">Kotlin 1.4.30 的新功能</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC" target="_blank">1.1.0-RC</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.4.2" target="_blank">1.4.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.15.1" target="_blank">0.15.1</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.5.1" target="_blank">1.5.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.7" target="_blank">0.0.7</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>) 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.21</strong>
            <p>发布日: <strong>2020/12/07</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.21" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.4.20 的 Bug 修复发布版</p>
            <p>详情请参见 <a href="whatsnew1420.html" target="_blank">Kotlin 1.4.20</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.0.1" target="_blank">1.0.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.4.1" target="_blank">1.4.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.4" target="_blank">0.14.4</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.4.1" target="_blank">1.4.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.6" target="_blank">0.0.6</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>) 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.20</strong>
            <p>发布日: <strong>2020/11/23</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.20" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>增量发布版, 包含各种改进, 比如:</p>
            <ul>
                <li>支持新的 JVM 功能特性, 比如通过 <code>invokedynamic</code> 拼接字符串</li>
                <li>对 KMM 项目改进性能和异常处理</li>
                <li>对 JDK 路径的扩展: <code>Path("dir") / "file.txt"</code></li>
            </ul>
            <p>详情请参见:</p>
            <ul>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/" target="_blank">关于新版本发布的 Blog</a></li>
                <li><a href="whatsnew1420.html" target="_blank">Kotlin 1.4.20</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.0.1" target="_blank">1.0.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.4.1" target="_blank">1.4.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.4" target="_blank">0.14.4</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.4.1" target="_blank">1.4.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.6" target="_blank">0.0.6</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>) 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>  
    <tr>
        <td><strong>1.4.10</strong>
            <p>发布日: <strong>2020/09/07</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.10" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.4.0 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">Kotlin 1.4.0</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization</a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/1.0.0-RC" target="_blank">1.0.0-RC</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.3.9" target="_blank">1.3.9</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.4" target="_blank">0.14.4</a></li>          
                <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.4.0" target="_blank">1.4.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.6" target="_blank">0.0.6</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>) 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>    
    <tr>
        <td><strong>1.4.0</strong>
            <p> 发布日: <strong>2020/08/17</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.0" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>一个新功能发布版, 包含很多新功能和改进, 主要集中于质量和性能.</p>
            <p>详情请参见:</p>
            <ul>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">关于新版本发布的 Blog</a></li>
                <li><a href="whatsnew14.html" target="_blank">Kotlin 1.4.0 的新功能</a></li>
                <li><a href="compatibility-guide-14.html" target="_blank">Kotlin 1.4.0 兼容性指南</a></li>
                <li><a href="whatsnew14.html#migrating-to-kotlin-140" target="_blank">迁移到 Kotlin 1.4.0</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization
                </a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/1.0.0-RC" target="_blank">1.0.0-RC</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a>
                版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.3.9" target="_blank">1.3.9
                </a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a>
                版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.4" target="_blank">0.14.4
                </a></li>          
                 <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.4.0" target="_blank">1.4.0</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.6" target="_blank">0.0.6</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>) 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>       
    <tr>
        <td><strong>1.3.72</strong>
            <p> 发布日: <strong>2020/04/15</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.3.72" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.3.70  的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/" target="_blank">Kotlin 1.3.70</a>.</p>
         </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank">kotlinx.serialization
                </a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/blob/master/CHANGELOG.md#0200--2020-03-04" target="_blank">0.20.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank">kotlinx.coroutines</a>
                版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.3.8" target="_blank">1.3.8
                </a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank">kotlinx.atomicfu</a>
                版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.2" target="_blank">0.14.2
                </a></li>          
                 <li><a href="https://ktor.io/" target="_blank">ktor</a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.3.2" target="_blank">1.3.2</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank">kotlinx.html</a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.1" target="_blank">0.7.1</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank">kotlinx-nodejs</a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.3" target="_blank">0.0.3</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>) 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>    
</table>

> 在 JVM 平台, 你通常可以使用库的版本(此处原文疑似有误), 而不是推荐的版本.
{:.note}
