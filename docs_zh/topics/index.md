---
layout: reference
title: "参考文档"
---

# **Kotlin 语言参考文档**

最终更新: {{ site.data.releases.latestDocDate }}

# **关于本文档**

[关于本文档](about_translation.html)

# **Kotlin 文档**

## **最新稳定版本: {{ site.data.releases.latest.version }}**

<div style="display: flex; width: 100%; padding: 5px">
    <div style="display: block; width: 50%; padding: 5px;">
        <a style="text-decoration: none;" href="getting-started.html">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='48' height='48'%3E%3Cdefs%3E%3ClinearGradient id='b' x1='27.839%25' x2='83.171%25' y1='16.174%25' y2='85.917%25'%3E%3Cstop offset='0%25' stop-color='%2363C2FF'/%3E%3Cstop offset='50.17%25' stop-color='%23A456F4'/%3E%3Cstop offset='99.95%25' stop-color='%232E34E6'/%3E%3C/linearGradient%3E%3Cpath id='a' d='M17.899 11.11L.055 28.952l12.783 12.782 17.844-17.843C39.394 15.127 41.429.362 41.429.362S26.664 2.344 17.9 11.109'/%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M5.586 29.36a.26.26 0 01-.185-.076l-5.4-5.401 7.339-7.394 13.547-1.996a.261.261 0 01.076.517L7.588 16.98.737 23.882l5.033 5.033a.26.26 0 01-.184.445m17.687 17.796l-5.402-5.403a.26.26 0 010-.368.262.262 0 01.37 0l5.032 5.033 6.902-6.903 1.97-13.323a.26.26 0 01.296-.22.26.26 0 01.22.296l-1.995 13.494-7.393 7.394z' fill='%23000'/%3E%3Cg transform='translate(5.217 .2)'%3E%3Cmask id='c' fill='%23fff'%3E%3Cuse xlink:href='%23a'/%3E%3C/mask%3E%3Cpath fill='url(%23b)' d='M17.899 11.11L.055 28.952l12.783 12.782 17.844-17.843C39.394 15.127 41.429.362 41.429.362S26.664 2.344 17.9 11.109' mask='url(%23c)'/%3E%3C/g%3E%3Cpath d='M5.794 37.552a.262.262 0 01-.184-.446l9.756-9.756a.26.26 0 11.369.369l-9.756 9.757a.265.265 0 01-.185.076m1.253 5.739a.26.26 0 01-.185-.446l9.809-9.757c.102-.1.267-.1.369.001a.262.262 0 01-.001.37l-9.808 9.756a.266.266 0 01-.185.076m24.731-31.305a3.395 3.395 0 00-3.391 3.392c0 1.87 1.52 3.391 3.39 3.391s3.392-1.521 3.392-3.391-1.521-3.392-3.391-3.392m0 7.304c-2.158 0-3.913-1.755-3.913-3.913s1.755-3.913 3.913-3.913 3.913 1.755 3.913 3.913-1.755 3.913-3.913 3.913m12.782-7.617a.256.256 0 01-.184-.076l-8.714-8.765a.263.263 0 01.001-.37.262.262 0 01.37.002l8.712 8.764a.262.262 0 010 .37.265.265 0 01-.185.075' fill='%23000'/%3E%3C/g%3E%3C/svg%3E" width="72" height="72" />

            <h3>Kotlin 入门</h3>
            <p>使用 IntelliJ IDEA 或 Android Studio IDE 为你的开发平台创建第一个 Kotlin 项目</p>
        </a>
    </div>

    <div style="display: block; width: 50%; padding: 5px">
        <a style="text-decoration: none;" href="https://play.kotlinlang.org/">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='9.551%25' x2='111.81%25' y1='27.747%25' y2='92.969%25'%3E%3Cstop offset='0%25' stop-color='%2363C2FF'/%3E%3Cstop offset='47.35%25' stop-color='%23A456F4'/%3E%3Cstop offset='99.95%25' stop-color='%232E34E6'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' x1='0%25' x2='99.95%25' y1='23.887%25' y2='79.047%25'%3E%3Cstop offset='0%25' stop-color='%2363C2FF'/%3E%3Cstop offset='47.35%25' stop-color='%23A456F4'/%3E%3Cstop offset='99.95%25' stop-color='%232E34E6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath fill='url(%23a)' d='M68.25 30L36.375 54.75 4.5 30 36.375 5.25z'/%3E%3Cpath fill='url(%23b)' d='M36 60.467L16.555 45.044l-.055 8.097L36 67.505l19.5-14.364V45z'/%3E%3Cpath fill='%23000' d='M4.875 56.774a.375.375 0 01-.375-.375V30.375a.375.375 0 01.75 0v26.024a.375.375 0 01-.375.375'/%3E%3Cpath fill='%23000' d='M.75 60l4.125-4.5L9 60z'/%3E%3C/g%3E%3C/svg%3E" width="72" height="72">

            <h3>在线试用 Kotlin</h3>
            <p>在浏览器中编写, 运行, 以及共享 Kotlin 代码</p>
        </a>
    </div>
</div>


## **第一步**

<div style="display: flex; width: 100%; padding: 5px">
    <div style="display: block; width: 50%; padding: 5px;">
        <a style="text-decoration: none;" href="basic-syntax.html">
            <h3>基本语法</h3>
            <p>关于 Kotlin 语法的概要介绍: 关键字, 操作符, 程序结构</p>
        </a>
    </div>
    
    <div style="display: block; width: 50%; padding: 5px">
        <a style="text-decoration: none;" href="tour/kotlin-tour-welcome.html">
            <h3>Kotlin 观光之旅</h3>
            <p>浏览 Kotlin 编程语言的基础知识</p>
        </a>
    </div>
</div>

<div style="display: flex; width: 100%; padding: 5px">
    <div style="display: block; width: 50%; padding: 5px;">
        <a style="text-decoration: none;" href="koans.html">
            <h3>Kotlin Koan</h3>
            <p>帮助你熟悉 Kotlin 的编程练习</p>
        </a>
    </div>

    <div style="display: block; width: 50%; padding: 5px">
        <a style="text-decoration: none;" href="command-line.html">
            <h3>命令行编译器</h3>
            <p>下载并安装 Kotlin 编译器</p>
        </a>
    </div>
</div>


## **关于 Kotlin 的各种功能**

<div style="display: flex; width: 100%; padding: 5px">
    <div style="display: block; width: 50%; padding: 5px;">
        <a style="text-decoration: none;" href="https://kotlinlang.org/api/latest/jvm/stdlib/">
            <h3>标准库 API 文档</h3>
            <p>Kotlin 日常工作必须的各种功能: IO, 文件, 线程, 集合, 等等</p>
        </a>
    </div>

    <div style="display: block; width: 50%; padding: 5px;">
        <a style="text-decoration: none;" href="gradle/gradle.html">
            <h3>Gradle</h3>
            <p>一个构建系统, 自动化并管理你的构建过程</p>
        </a>
    </div>
</div>

<div style="display: flex; width: 100%; padding: 5px">
    <div style="display: block; width: 50%; padding: 5px;">
        <a style="text-decoration: none;" href="basic-types.html">
            <h3>基本类型</h3>
            <p>Kotlin 的类型系统: 数值, 字符串, 数组, 以及其他内建的数据类型</p>
        </a>
    </div>

    <div style="display: block; width: 50%; padding: 5px;">
        <a style="text-decoration: none;" href="collections-overview.html">
            <h3>集合</h3>
            <p>集合(Collection): List, Set, 和 Map</p>
        </a>
    </div>
</div>

<div style="display: flex; width: 100%; padding: 5px">
    <div style="display: block; width: 50%; padding: 5px;">
        <a style="text-decoration: none;" href="scope-functions.html">
            <h3>作用域函数</h3>
            <p>作用域函数(Scope Function): let, with, run, apply, 以及 also</p>
        </a>
    </div>

    <div style="display: block; width: 50%; padding: 5px;">
        <a style="text-decoration: none;" href="coroutines-overview.html">
            <h3>协程</h3>
            <p>并发: 协程(Coroutine), 数据流(Flow), 通道(Channel)</p>
        </a>
    </div>
</div>


## **Kotlin 的新功能**

<div style="display: flex; width: 100%; padding: 5px">
    <div style="display: block; width: 50%; padding: 5px;">
        <a style="text-decoration: none;" href="whatsnew1920.html">
            <h3>Kotlin 1.9.20 的新功能</h3>
            <p>
                最新功能:
                Kotlin K2 已进入 Beta 版
                Kotlin Multiplatform 已进入稳定版
            </p>
        </a>
    </div>

    <div style="display: block; width: 50%; padding: 5px;">
        <a style="text-decoration: none;" href="roadmap.html">
            <h3>Kotlin 发展路线图</h3>
            <p>Kotlin 的未来开发计划</p>
        </a>
    </div>
</div>


## **Kotlin Multiplatform**

<div style="display: flex; width: 100%; padding: 5px">
    <div style="display: block; width: 50%; padding: 5px;">
        <a style="text-decoration: none;" href="https://www.jetbrains.com/kotlin-multiplatform/">
            <h3>为什么使用 Kotlin Multiplatform</h3>
            <p>学习 Kotlin Multiplatform 如何帮助你在你的应用程序中共用代码</p>
        </a>
    </div>

    <div style="display: block; width: 50%; padding: 5px;">
        <a style="text-decoration: none;" href="https://kmp.jetbrains.com/">
            <h3>Kotlin Multiplatform Wizard</h3>
            <p>快速创建并下载跨平台项目模板</p>
        </a>
    </div>
</div>

<div style="display: flex; width: 100%; padding: 5px">
    <div style="display: block; width: 50%; padding: 5px;">
        <a style="text-decoration: none;" href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html">
            <h3>Kotlin Multiplatform 入门</h3>
            <p>创建一个同时在 Android 和 iOS 上运行的移动应用程序</p>
        </a>
    </div>

    <div style="display: block; width: 50%; padding: 5px;">
        <a style="text-decoration: none;" href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-getting-started.html">
            <h3>Compose Multiplatform 入门</h3>
            <p>使用 Compose Multiplatform 实现一个在所有平台上运行的用户界面</p>
        </a>
    </div>
</div>
