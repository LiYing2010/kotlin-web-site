---
layout: reference
title: Kotlin 的发布版本
---

# Kotlin 的发布版本

我们的发布版本包括几种不同的类型:

* _功能发布版(Feature release)_ (1._x_) 其中包括语言的重要变化.
* _增量发布版(Incremental release)_ (1._x_._y_) 在功能发布版之间发布, 其中包括工具更新, 性能改善, 以及 bug 修复.
* _Bug 修复发布版(Bug fix release)_ (1._x_._yz_) 其中包括针对增量发布版的 bug 修复.

比如, 对于功能发布版 1.3, 我们有几个增量发布版, 包括 1.3.10, 1.3.20, 以及 1.3.70.
对于 1.3.70, 我们有 2 个 bug 修复发布版 – 1.3.71 和 1.3.72.

对于每个增量发布版和功能发布版, 我们还会发布几个预览 (_EAP_) 版, 供开发者在正式发布之前试用新功能.
详情请参见 [早期预览(Early Access Preview)](eap/index.html).

关于 Kotlin 的发布版本, 更多详情请参见 [Kotlin 发布版的类型, 以及它们的兼容性](evolution/kotlin-evolution.html#feature-releases-and-incremental-releases).

## 更新到新的发布版

新的发布版发布之后, IntelliJ IDEA 和 Android Studio 会建议你升级.
如果你接受建议, IDE 会自动将 Kotlin 插件更新到最新版本.
在 **Tools** \| **Kotlin** \| **Configure Plugin Updates** 菜单中, 你可以选择 Kotlin 版本.

如果你的项目创建时使用了较早的 Kotlin 版本, 那么有可能需要在你的项目中改变 Kotlin 版本, 并更新 kotlinx 库 – 详情请查看 [推荐的版本](#release-details).

如果你要迁移到新的功能发布版, Kotlin 插件的迁移工具可以帮助你进行迁移.

## 各发布版详情

下表是 Kotlin 最新发布版的详情.

你也可以使用 [Kotlin 的预览版](eap/index.html#build-details).

<table>
    <tr>
        <th>构建信息</th>
        <th>主要内容</th>
        <th>推荐的 kotlinx 库版本</th>
    </tr>
    <tr>
        <td><strong>1.4.21</strong>
            <p>发布日: <strong>2020年12月07日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.21" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.4.20 的 Bug 修复发布版</p>
            <p>更多详情请参见 <a href="/docs/reference_zh/whatsnew1420.html" target="_blank">Kotlin 1.4.20</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank"><strong>kotlinx.serialization</strong></a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.0.1" target="_blank">1.0.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank"><strong>kotlinx.coroutines</strong></a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.4.1" target="_blank">1.4.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank"><strong>kotlinx.atomicfu</strong></a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.4" target="_blank">0.14.4</a></li>          
                <li><a href="https://ktor.io/" target="_blank"><strong>ktor</strong></a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.4.1" target="_blank">1.4.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank"><strong>kotlinx.html</strong></a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank"><strong>kotlinx-nodejs</strong></a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.6" target="_blank">0.0.6</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>) 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.20</strong>
            <p>发布日: <strong>2020年11月23日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.20" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>增量发布版, 包含各种改进, 比如:</p>
            <ul>
                <li>支持新的 JVM 功能特性, 比如通过 <code>invokedynamic</code> 拼接字符串</li>
                <li>对 KMM 项目改进性能和异常处理</li>
                <li>对 JDK 路径的扩展: <code>Path(“dir”) / “file.txt”</code></li>
            </ul>
            <p>更多详情请参见:</p>
            <ul>
                <li><a href="http://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/" target="_blank">关于新版本发布的 Blog</a></li>
                <li><a href="/docs/reference_zh/whatsnew1420.html" target="_blank">Kotlin 1.4.20</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank"><strong>kotlinx.serialization</strong></a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.0.1" target="_blank">1.0.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank"><strong>kotlinx.coroutines</strong></a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.4.1" target="_blank">1.4.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank"><strong>kotlinx.atomicfu</strong></a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.4" target="_blank">0.14.4</a></li>          
                <li><a href="https://ktor.io/" target="_blank"><strong>ktor</strong></a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.4.1" target="_blank">1.4.1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank"><strong>kotlinx.html</strong></a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank"><strong>kotlinx-nodejs</strong></a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.6" target="_blank">0.0.6</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>) 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>  
    <tr>
        <td><strong>1.4.10</strong>
            <p>发布日: <strong>2020年09月07日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.10" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.4.0 的 Bug 修复发布版.</p>
            <p>更多详情请参见 <a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">Kotlin 1.4.0</a>.</p>
        </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank"><strong>kotlinx.serialization</strong></a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/1.0.0-RC" target="_blank">1.0.0-RC</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank"><strong>kotlinx.coroutines</strong></a> 版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.3.9" target="_blank">1.3.9</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank"><strong>kotlinx.atomicfu</strong></a> 版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.4" target="_blank">0.14.4</a></li>          
                <li><a href="https://ktor.io/" target="_blank"><strong>ktor</strong></a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.4.0" target="_blank">1.4.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank"><strong>kotlinx.html</strong></a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank"><strong>kotlinx-nodejs</strong></a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.6" target="_blank">0.0.6</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>) 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>    
    <tr>
        <td><strong>1.4.0</strong>
            <p> 发布日: <strong>2020年08月17日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.0" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>一个新功能发布版, 包含很多新功能和改进, 主要集中于质量和性能.</p>
            <p>详情请参见:</p>
            <ul>
                <li><a href="http://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">关于新版本发布的 Blog</a></li>
                <li><a href="whatsnew14.html" target="_blank">Kotlin 1.4.0 的新功能</a></li>
                <li><a href="compatibility-guide-14.html" target="_blank">兼容性指南</a></li>
                <li><a href="whatsnew14.html#migrating-to-kotlin-140" target="_blank">迁移到 Kotlin 1.4.0</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank"><strong>kotlinx.serialization</strong>
                </a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/1.0.0-RC" target="_blank">1.0.0-RC</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank"><strong>kotlinx.coroutines</strong></a>
                版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.3.9" target="_blank">1.3.9
                </a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank"><strong>kotlinx.atomicfu</strong></a>
                版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.4" target="_blank">0.14.4
                </a></li>          
                 <li><a href="https://ktor.io/" target="_blank"><strong>ktor</strong></a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.4.0" target="_blank">1.4.0</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank"><strong>kotlinx.html</strong></a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank"><strong>kotlinx-nodejs</strong></a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.6" target="_blank">0.0.6</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>) 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>       
    <tr>
        <td><strong>1.3.72</strong>
            <p> 发布日: <strong>2020年04月15日</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.3.72" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.3.70  的 Bug 修复发布版.</p>
            <p>更多详情请参见 <a href="https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/" target="_blank">Kotlin 1.3.70</a>.</p>
         </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank"><strong>kotlinx.serialization</strong>
                </a> 版本: <a href="https://github.com/Kotlin/kotlinx.serialization/blob/master/CHANGELOG.md#0200--2020-03-04" target="_blank">0.20.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank"><strong>kotlinx.coroutines</strong></a>
                版本: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.3.8" target="_blank">1.3.8
                </a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank"><strong>kotlinx.atomicfu</strong></a>
                版本: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.2" target="_blank">0.14.2
                </a></li>          
                 <li><a href="https://ktor.io/" target="_blank"><strong>ktor</strong></a> 版本: <a href="https://github.com/ktorio/ktor/releases/tag/1.3.2" target="_blank">1.3.2</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank"><strong>kotlinx.html</strong></a> 版本: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.1" target="_blank">0.7.1</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank"><strong>kotlinx-nodejs</strong></a> 版本: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.3" target="_blank">0.0.3</a></li>
            </ul>
            <p>通过 <code>kotlin-wrappers</code> 得到的各个库的版本(比如 <code>kotlin-react</code>) 请参见 <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">相应的代码仓库</a>.</p>
        </td>
    </tr>    
</table>

> 在 JVM 平台, 你通常可以使用库的 ?? 版本(此处原文疑似有误), 而不是推荐的版本.
{:.note}
