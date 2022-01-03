---
type: doc
layout: reference
category:
title: "Eclipse IDE"
---

# Eclipse IDE

本页面最终更新: 2022/04/07

[Eclipse IDE](https://www.eclipse.org/downloads/) 是非常著名的 IDE, 它提供了很多包, 可用于各种语言和平台上的开发.
你可以使用它来编写 Kotlin 代码.
在本文档中, 你将学会如何在 Eclipse IDE 中开发 Kotlin 的基本知识. 

## 设置环境

首先, 你需要在你的系统中安装 Eclipse IDE.
可以通过 [下载页面](https://www.eclipse.org/downloads/) 下载最新版本.
推荐使用 **Eclipse IDE for Java Developers** bundle.

要向你的 Eclipse IDE 添加 Kotlin 支持, 请安装 **Kotlin Plugin for Eclipse**.
我们推荐通过 [Eclipse Marketplace](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse) 安装 Kotlin plugin. 
打开 __Help \| Eclipse Marketplace...__ 菜单, 查找 __Kotlin Plugin for Eclipse__: 

<img src="/assets/docs/images/eclipse/eclipse-marketplace.png" alt="Eclipse Marketplace" width="500"/>

plugin 安装完毕并重新启动 Eclipse 之后, 请确认 plugin 是否正确安装: 
在菜单 __Window \| Perspective | Open Perspective \| Other...__ 中打开 __Kotlin perspective__
    
<img src="/assets/docs/images/eclipse/eclipse-open-perspective.png" alt="Kotlin Perspective" width="500"/>

## 创建一个新项目

现在你可以创建一个新的 Kotlin 项目.

首先, 选择 __File \| New \| Kotlin Project__.

<img src="/assets/docs/images/eclipse/eclipse-project-name.png" alt="新建 Kotlin 项目" width="500"/>

这样会创建一个空的 Kotlin/JVM 项目.

对于 Eclipse IDE, 项目也是一个 Java 项目, 但配置了 Kotlin nature, 也就是说它有 Kotlin Builder, 并引用 Kotlin 运行库.
这种解决方案的好处是, 你可以在同一个项目中添加 Kotlin 和 Java 代码.
   
项目结构大致如下:

<img src="/assets/docs/images/eclipse/eclipse-empty-project.png" alt="空的 Kotlin 项目" width="700"/>

现在, 在源代码目录中创建一个新的 Kotlin 文件.

<img src="/assets/docs/images/eclipse/eclipse-new-file.png" alt="从上下文菜单创建新文件" width="700"/>

你可以输入文件名, 不需要指定 `.kt` 扩展名. Eclipse 会自动添加扩展名.

<img src="/assets/docs/images/eclipse/eclipse-file-name.png" alt="新建 Kotlin 文件向导" width="500"/>

有了源代码文件之后, 可以添加 `main` 函数 - Kotlin 应用程序的入口点.
你可以直接输入 `main`, 然后按下 `Ctrl + Space` 启动代码自动完成功能.

<img src="/assets/docs/images/eclipse/eclipse-main.png" alt="Kotlin 函数示例" width="700"/>

最后, 添加一行简单的 Kotlin 代码, 输出消息:

<img src="/assets/docs/images/eclipse/eclipse-hello-world.png" alt="Hello World 示例" width="700"/>

## 运行应用程序

要运行应用程序, 请在 main 文件的某个地方点击鼠标右键, 然后选择 __Run As \| Kotlin Application__.

<img src="/assets/docs/images/eclipse/eclipse-run-as.png" alt="运行 Kotlin 应用程序" width="700"/>
   
如果一切正确, 你会在 **Console** 窗口看到输出结果.

<img src="/assets/docs/images/eclipse/eclipse-output.png" alt="程序输出视图" width="500"/>

恭喜! 你的 Kotlin 应用程序已经在 Eclipse IDE 中成功运行了.
