---
type: doc
layout: reference
title: "支持的平台"
---

# 支持的平台

本页面最终更新: 2021/12/31

Kotlin 支持以下目标平台, 针对每个目标平台, 都提供了编译目标的预定义配置.
详情请参见 [使用编译目标的预定义配置](mpp-set-up-targets.html).

<table>
    <tr>
        <th>目标平台</th>
        <th>编译目标的预定义配置</th>
        <th>注释</th>
    </tr>
    <tr>
        <td>Kotlin/JVM</td>
        <td><code>jvm</code></td>
        <td></td>
    </tr>
    <tr>
        <td>Kotlin/JS</td>
        <td><code>js</code></td>
        <td>
            <p>选择执行环境:</p>
            <ul>
                <li><code>browser {}</code> 用于运行在浏览器内的应用程序.</li>
                <li><code>nodejs{}</code> 运行在 Node.js 上的应用程序.</li>
            </ul>
            <p>更多详情请参见 <a href="../js/js-project-setup.html#execution-environments">创建 Kotlin JavaScript 项目</a>.</p>
        </td>
    </tr>
    <tr>
        <td>Android 应用程序和库</td>
        <td><code>android</code></td>
        <td>
            <p>手动应用 Android Gradle plugin  – <code>com.android.application</code> 或 <code>com.android.library</code>.</p>
            <p>对每个 Gradle 子项目, 只能创建一个 Android 编译目标.</p>
        </td>
    </tr>
    <tr>
        <td>Android NDK</td>
        <td><code>androidNativeArm32</code>, <code>androidNativeArm64</code>, <code>androidNativeX86</code>, <code>androidNativeX64</code></td>
        <td>
            <p>64 位编译目标需要在 Linux 或 macOS 主机上构建.</p>
            <p>32 位编译目标可以在任何支持的主机上构建.</p>
        </td>
    </tr>
    <tr>
        <td>iOS</td>
        <td><code>iosArm32</code>, <code>iosArm64</code>, <code>iosX64</code>, <code>iosSimulatorArm64</code></td>
        <td>需要在 macOS 主机上构建.</td>
    </tr>
    <tr>
        <td>watchOS</td>
        <td><code>watchosArm32</code>, <code>watchosArm64</code>, <code>watchosX86</code>, <code>watchosX64</code>, <code>watchosSimulatorArm64</code></td>
        <td>需要在 macOS 主机上构建.</td>
    </tr>
    <tr>
        <td>tvOS</td>
        <td><code>tvosArm64</code>, <code>tvosX64</code>, <code>tvosSimulatorArm64</code></td>
        <td>需要在 macOS 主机上构建.</td>
    </tr>
    <tr>
        <td>macOS</td>
        <td><code>macosX64</code>, <code>macosArm64</code></td>
        <td>需要在 macOS 主机上构建.</td>
    </tr>
    <tr>
        <td>Linux</td>
        <td><code>linuxArm64</code>, <code>linuxArm32Hfp</code>, <code>linuxMips32</code>, <code>linuxMipsel32</code>, <code>linuxX64</code></td>
        <td>
            <p>Linux MIPS 编译目标 (<code>linuxMips32</code> 和 <code>linuxMipsel32</code>) 需要在 Linux 主机上构建.</p>
            <p>其他 Linux 编译目标可以在任何支持的主机上构建.</p>
        </td>
    </tr>
    <tr>
        <td>Windows</td>
        <td><code>mingwX64</code>, <code>mingwX86</code></td>
        <td></td>
    </tr>
    <tr>
        <td>WebAssembly</td>
        <td><code>wasm32</code></td>
        <td></td>
    </tr>
</table>

> 构建构成中会忽略当前主机不支持的编译目标, 因此这些编译目标不会被发布.
{:.note}
