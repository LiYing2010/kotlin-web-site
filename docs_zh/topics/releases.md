[//]: # (title: Kotlin 的发布版本)

最终更新: %latestDocDate%

我们的发布版本包括几种不同的类型:

* _功能发布版(Feature release)_ (1._x_) 其中包括语言的重要变化.
* _增量发布版(Incremental release)_ (1._x_._y_) 在功能发布版之间发布, 其中包括工具更新, 性能改善, 以及 bug 修复.
* _Bug 修复发布版(Bug fix release)_ (1._x_._yz_) 其中包括针对增量发布版的 bug 修复.

比如, 对于功能发布版 1.3, 我们有几个增量发布版, 包括 1.3.10, 1.3.20, 以及 1.3.70.
对于 1.3.70, 我们有 2 个 bug 修复发布版 – 1.3.71 和 1.3.72.

对于每个增量发布版和功能发布版, 我们还会发布几个预览 (_EAP_) 版, 供开发者在正式发布之前试用新功能.
详情请参见 [早期预览(Early Access Preview)](eap.md).

关于 Kotlin 的发布版本, 详情请参见
[Kotlin 发布版的类型, 以及它们的兼容性](kotlin-evolution.md#feature-releases-and-incremental-releases).

## 更新到新的发布版 {id="update-to-a-new-release"}

> 从 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 开始, Kotlin plugin 会自动更新.
> 你只需要在你的项目中更新 Kotlin 版本.
>
{style="note"}

新的发布版发布之后, IntelliJ IDEA 和 Android Studio 会建议你升级.
如果你接受建议, IDE 会自动将 Kotlin 插件更新到最新版本.
在 **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates** 菜单中, 你可以选择 Kotlin 版本.

如果你的项目创建时使用了较早的 Kotlin 版本, 那么有可能需要在你的项目中改变 Kotlin 版本, 并更新 kotlinx 库.

如果你要迁移到新的功能发布版, Kotlin 插件的迁移工具可以帮助你进行迁移.

## IDE 支持 {id="ide-support"}

以下版本的 IntelliJ IDEA 和 Android Studio 支持 Kotlin 语言最新版本:
* IntelliJ IDEA:
    * 最新的稳定版本
    * 前一个稳定版本
    * [早期预览](https://www.jetbrains.com/resources/eap/) 版
* Android Studio:
    * [最新发布版](https://developer.android.com/studio)
    * [早期预览版](https://developer.android.com/studio/preview)

> 关于 IntelliJ IDEA 中 Kotlin 相关的最新更新, 
> 请参见 [IntelliJ IDEA 最新功能](https://www.jetbrains.com/idea/whatsnew/) 的 **Kotlin** 小节.
>
{style="tip"}

## 各发布版详情 {id="release-details"}

下表是 Kotlin 最新发布版的详情.

你也可以使用 [Kotlin 的预览版](eap.md#build-details).

<table>
    <tr>
        <th>构建信息</th>
        <th>主要内容</th>
    </tr>
    <tr>
        <td><strong>1.9.23</strong>
            <p>发布日期: <strong>2024/03/07</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.23" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.9.20, 1.9.21, 和 1.9.22 的 Bug 修复发布版.</p>
            <p>关于 Kotlin 1.9.20, 请参见 <a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 版中的新功能</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.22</strong>
            <p>发布日期: <strong>2023/12/21</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.22" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.9.20 和 1.9.21 的 Bug 修复发布版.</p>
            <p>关于 Kotlin 1.9.20, 请参见 <a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 版中的新功能</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.21</strong>
            <p>发布日期: <strong>2023/11/23</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.21" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.9.20 的 Bug 修复发布版.</p>
            <p>关于 Kotlin 1.9.20, 请参见 <a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 版中的新功能</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.20</strong>
            <p>发布日期: <strong>2023/11/01</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.20" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>一个新功能发布版, 包括 Kotlin K2 编译器的 Beta 版, 和 Kotlin Multiplatform 的稳定版.</p>
            <p>详情请参见:</p>
            <list>
                <li><a href="whatsnew1920.md" target="_blank">Kotlin 1.9.20 版中的新功能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.10</strong>
            <p>发布日期: <strong>2023/08/23</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.10" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.9.0 的 Bug 修复发布版.</p>
            <p>关于 Kotlin 1.9.0, 请参见 <a href="whatsnew19.md" target="_blank">Kotlin 1.9.0 版中的新功能</a>.</p>
            <note>对于 Android Studio 的 Giraffe 和 Hedgehog 版, Kotlin plugin 1.9.10 会在之后的 Android Studio 更新中发布.</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.9.0</strong>
            <p>发布日期: <strong>2023/07/06</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.9.0" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>一个新功能发布版, 包括 Kotlin K2 编译器的更新, 新的枚举类值函数, 用于终端开放(open-ended)的值范围的新的操作符,
              Kotlin Multiplatform 中的 Gradle 配置缓存功能的预览版,
              Kotlin Multiplatform 中支持的 Android target 的变更,
              Kotlin/Native 中自定义内存分配器功能的预览版.</p>
            <p>详情请参见:</p>
            <list>
                <li><a href="whatsnew19.md" target="_blank">Kotlin 1.9.0 版中的新功能</a></li>
                <li><a href="https://www.youtube.com/embed/fvwTZc-dxsM" target="_blank">YouTube 视频: Kotlin 的新功能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.22</strong>
            <p>发布日期: <strong>2023/06/08</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.22" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.8.20 的 Bug 修复发布版.</p>
            <p>关于 Kotlin 1.8.20, 请参见 <a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20 版中的新功能</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.21</strong>
            <p>发布日期: <strong>2023/04/25</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.21" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.8.20 的 Bug 修复发布版.</p>
            <p>关于 Kotlin 1.8.20, 请参见 <a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20 版中的新功能</a>.</p>
            <note>对于 Android Studio 的 Flamingo 和 Giraffe 版, Kotlin plugin 1.8.21 会在之后的 Android Studio 更新中发布.</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.20</strong>
            <p>发布日期: <strong>2023/04/03</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.20" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>一个新功能发布版, 包括 Kotlin K2 编译器的更新, 标准库中的 AutoCloseable 接口和 Base64 编码,
              默认启用新的 JVM 增量编译, 新的 Kotlin/Wasm 编译器后端.</p>
            <p>详情请参见:</p>
            <list>
                <li><a href="whatsnew1820.md" target="_blank">Kotlin 1.8.20 版中的新功能</a></li>
                <li><a href="https://youtu.be/R1JpkpPzyBU" target="_blank">YouTube 视频: Kotlin 的新功能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.10</strong>
            <p>发布日期: <strong>2023/02/02</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.10" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.8.0 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">Kotlin 1.8.0</a>.</p>
            <note>对于 Android Studio 的 Electric Eel 和 Flamingo 版, Kotlin plugin 1.8.10 会在之后的 Android Studio 更新中发布.</note>
        </td>
    </tr>
    <tr>
        <td><strong>1.8.0</strong>
            <p>发布日期: <strong>2022/12/28</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.8.0" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>
              一个新功能发布版,
              包括 kotlin-reflect 的性能改善,
              JVM 平台的新功能: 目录内容的递归复制或递归删除 (实验性功能),
              与 Objective-C/Swift 交互功能的改进.
            </p>
            <p>详情请参见:</p>
            <list>
                <li><a href="whatsnew18.md" target="_blank">Kotlin 1.8.0 版中的新功能</a></li>
                <li><a href="compatibility-guide-18.md" target="_blank">Kotlin 1.8 兼容性指南</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.21</strong>
            <p>发布日期: <strong>2022/11/09</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.21" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.7.20 的 Bug 修复发布版.</p>
            <p>关于 Kotlin 1.7.20, 请参见 <a href="whatsnew1720.md" target="_blank">Kotlin 1.7.20 版中的新功能</a>.</p>
            <note>
              对于 Android Studio 的 Dolphin, Electric Eel, 以及 Flamingo 版,
              Kotlin plugin 1.7.21 会在之后的 Android Studio 更新中发布.
            </note>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.20</strong>
            <p>发布日期: <strong>2022/09/29</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
          <p>
            增量发布版, 包含新的语言语言特性, 在 Kotlin K2 编译器中支持几种编译器插件, 默认启用新的 Kotlin/Native 内存管理器, 以及支持 Gradle 7.1.
          </p>
            <p>详情请参见:</p>
            <list>
                <li><a href="whatsnew1720.md" target="_blank">Kotlin 1.7.20 版中的新功能</a></li>
                <li><a href="https://youtu.be/OG9npowJgE8" target="_blank">YouTube 视频: Kotlin 的新功能</a></li>
                <li><a href="compatibility-guide-1720.md" target="_blank">Kotlin 1.7.20 兼容性指南</a></li>
            </list>
            <p>详情请参见 <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.20" target="_blank">Kotlin 1.7.20</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.10</strong>
            <p>发布日期: <strong>2022/07/07</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.10" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.7.0 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">Kotlin 1.7.0</a>.</p>
            <note>
                对于 Android Studio Dolphin (213) 和 Android Studio Electric Eel (221),
                Kotlin plugin 1.7.10 会在之后的 Android Studio 更新中发布.
            </note>
        </td>
    </tr>
    <tr>
        <td><strong>1.7.0</strong>
            <p>发布日期: <strong>2022/06/09</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.7.0" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>
              一个新功能发布版,
              包含 JVM 平台的 Kotlin K2 编译器(Alpha 版),
              稳定版的语言特性, 性能改善, 以及演进变化, 比如实验性 API 进入稳定状态.
            </p>
            <p>详情请参见:</p>
            <list>
                <li><a href="whatsnew17.md" target="_blank">Kotlin 1.7.0 的新功能</a></li>
                <li><a href="https://youtu.be/54WEfLKtCGk" target="_blank">YouTube 视频: Kotlin 的新功能</a></li>
                <li><a href="compatibility-guide-17.md" target="_blank">Kotlin 1.7.0 兼容性指南</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.21</strong>
            <p>发布日期: <strong>2022/04/20</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.21" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.6.20 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="whatsnew1620.md" target="_blank">Kotlin 1.6.20</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.20</strong>
            <p>发布日期: <strong>2022/04/04</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.20" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>增量发布版, 包含各种改进, 比如:</p>
            <list>
                <li>上下文接受者(Context Receiver)的原型</li>
                <li>对函数式接口构造器的可调用引用</li>
                <li>Kotlin/Native: 新的内存管理器的性能改善</li>
                <li>Multiplatform: 默认使用层级项目结构(Hierarchical Project Structure)</li>
                <li>Kotlin/JS: IR 编译器改进</li>
                <li>Gradle: 编译器执行策略</li>
            </list>
            <p>详情请参见 <a href="whatsnew1620.md" target="_blank">Kotlin 1.6.20</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.10</strong>
            <p>发布日期: <strong>2021/12/14</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.10" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.6.0 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">Kotlin 1.6.0</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.6.0</strong>
            <p>发布日期: <strong>2021/11/16</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.6.0" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>一个新功能发布版, 包含新的语言特性, 性能改善, 以及演进变化, 比如实验性 API 进入稳定状态.</p>
            <p>详情请参见:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/" target="_blank">关于新版本发布的 Blog</a></li>
                <li><a href="whatsnew16.md" target="_blank">Kotlin 1.6.0 的新功能</a></li>
                <li><a href="compatibility-guide-16.md" target="_blank">Kotlin 1.6.0 兼容性指南</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.32</strong>
            <p>发布日期: <strong>2021/11/29</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.32" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.5.31 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.31</strong>
            <p>发布日期: <strong>2021/09/20</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.31" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.5.30 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.30</strong>
            <p>发布日期: <strong>2021/08/23</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.30" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>增量发布版, 包含各种改进, 比如:</p>
            <list>
                <li>JVM 平台上, 注解类的实例创建</li>
                <li>改进 opt-in 要求机制和类型推断</li>
                <li>Kotlin/JS IR 后端进入 Beta 版</li>
                <li>支持 Apple Silicon 编译目标</li>
                <li>改进对 CocoaPods 的支持</li>
                <li>Gradle: Java 工具链的支持, 并改进 daemon 配置</li>
            </list>
            <p>详情请参见:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/08/kotlin-1-5-30-released/" target="_blank">关于新版本发布的 Blog</a></li>
                <li><a href="whatsnew1530.md" target="_blank">Kotlin 1.5.30 的新功能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.21</strong>
            <p>发布日期: <strong>2021/07/13</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.21" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.5.20 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="whatsnew1520.md" target="_blank">Kotlin 1.5.20</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.20</strong>
            <p>发布日期: <strong>2021/06/24</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.20" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>增量发布版, 包含各种改进, 比如:</p>
            <list>
                <li>在 JVM 平台 默认使用 <code>invokedynamic</code> 实现字符串拼接</li>
                <li>改进对 Lombok 和 JSpecify 的支持</li>
                <li>Kotlin/Native: KDoc 导出 Objective-C 头文件, 改进在同一数组内 <code>Array.copyInto()</code> 的速度</li>
                <li>Gradle: 注解处理器的类装载器缓存, 支持 Gradle 的 <code>--parallel</code> 属性</li>
                <li>标准库函数在各个平台的动作保持一致</li>
            </list>
            <p>详情请参见:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/" target="_blank">关于新版本发布的 Blog</a></li>
                <li><a href="whatsnew1520.md" target="_blank">Kotlin 1.5.20 的新功能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.10</strong>
            <p>发布日期: <strong>2021/05/24</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.10" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.5.0 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">Kotlin 1.5.0</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.5.0</strong>
            <p>发布日期: <strong>2021/05/05</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.5.0" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>一个新功能发布版, 包含新的语言特性, 性能改善, 以及演进变化, 比如实验性 API 进入稳定状态.</p>
            <p>详情请参见:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/" target="_blank">关于新版本发布的 Blog</a></li>
                <li><a href="whatsnew15.md" target="_blank">Kotlin 1.5.0 的新功能</a></li>
                <li><a href="compatibility-guide-15.md" target="_blank">Kotlin 1.5.0 兼容性指南</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.32</strong>
            <p>发布日期: <strong>2021/03/22</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.32" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.4.30 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.31</strong>
            <p>发布日期: <strong>2021/02/25</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.31" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.4.30 的 Bug 修复发布版. </p>
            <p>详情请参见 <a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.30</strong>
            <p>发布日期: <strong>2021/02/03</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.30" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>增量发布版, 包含各种改进, 比如:</p>
            <list>
                <li>新的 JVM 后端 进入 Beta 版</li>
                <li>新语言特性的预览</li>
                <li>Kotlin/Native 的性能改进</li>
                <li>标准库 API 改进</li>
            </list>
            <p>详情请参见:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2021/01/kotlin-1-4-30-released/" target="_blank">关于新版本发布的 Blog</a></li>
                <li><a href="whatsnew1430.md" target="_blank">Kotlin 1.4.30 的新功能</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.21</strong>
            <p>发布日期: <strong>2020/12/07</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.21" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.4.20 的 Bug 修复发布版</p>
            <p>详情请参见 <a href="whatsnew1420.md" target="_blank">Kotlin 1.4.20</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.20</strong>
            <p>发布日期: <strong>2020/11/23</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.20" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>增量发布版, 包含各种改进, 比如:</p>
            <list>
                <li>支持新的 JVM 功能特性, 比如通过 <code>invokedynamic</code> 拼接字符串</li>
                <li>对 Kotlin Multiplatform Mobile 项目改进性能和异常处理</li>
                <li>对 JDK 路径的扩展: <code>Path("dir") / "file.txt"</code></li>
            </list>
            <p>详情请参见:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/" target="_blank">关于新版本发布的 Blog</a></li>
                <li><a href="whatsnew1420.md" target="_blank">Kotlin 1.4.20</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.10</strong>
            <p>发布日期: <strong>2020/09/07</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.10" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.4.0 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">Kotlin 1.4.0</a>.</p>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.0</strong>
            <p>发布日期: <strong>2020/08/17</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.0" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>一个新功能发布版, 包含很多新功能和改进, 主要集中于质量和性能.</p>
            <p>详情请参见:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">关于新版本发布的 Blog</a></li>
                <li><a href="whatsnew14.md" target="_blank">Kotlin 1.4.0 的新功能</a></li>
                <li><a href="compatibility-guide-14.md" target="_blank">Kotlin 1.4.0 兼容性指南</a></li>
                <li><a href="whatsnew14.md#migrating-to-kotlin-1-4-0" target="_blank">迁移到 Kotlin 1.4.0</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>1.3.72</strong>
            <p>发布日期: <strong>2020/04/15</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.3.72" target="_blank">GitHub 发布链接</a></p>
        </td>
        <td>
            <p>针对 Kotlin 1.3.70 的 Bug 修复发布版.</p>
            <p>详情请参见 <a href="https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/" target="_blank">Kotlin 1.3.70</a>.</p>
        </td>
    </tr>
</table>
