---
type: doc
layout: reference
title: "设置开发环境"
---

# 设置开发环境

最终更新: {{ site.data.releases.latestDocDate }}

<table style="border-style: solid; border-color: 252528">
    <tr style="border: none">
        <td>
            这是 <strong>Kotlin Multiplatform Mobile 入门</strong> 教程的第 1 部分:
        </td>
    </tr>
    <tr>
        <td>
        <div style="display: block">
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-1.svg" alt="第 1 步" width="20"/> &nbsp;
                <strong>设置开发环境</strong>
            </div>
            <br/>

            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-2-todo.svg" alt="第 2 步" width="20"/> &nbsp;
                创建你的第一个跨平台应用程序
            </div>
            <br/>
    
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-3-todo.svg" alt="第 3 步" width="20"/> &nbsp;
                添加依赖项
            </div>
            <br/>
    
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-4-todo.svg" alt="第 4 步" width="20"/> &nbsp;
                升级你的应用程序
            </div>
            <br/>
    
            <div style="vertical-align: middle; display: inline-flex">
                <img src="/assets/docs/images/icons/icon-5-todo.svg" alt="第 5 步" width="20"/> &nbsp;
                完成你的项目
            </div>
        </div>
        </td>
    </tr>
</table>

在你创建你的第一个能够同时在 iOS 和 Android 运行的应用程序之前, 你需要设置 Kotlin Multiplatform Mobile 的开发环境.

> 要编写 iOS 专有代码, 并在模拟设备或真实设备上运行 iOS 应用程序, 你需要使用运行 macOS 操作系统的 Mac 计算机.
> 这些步骤不能在其他操作系统上进行, 比如 Microsoft Windows. 这是 Apple 的限制.
{:.warning}

## 安装必要的工具

我们推荐你安装最新的稳定版本, 以保证兼容性和更好的性能.

<table>
   <tr>
      <td>工具</td>
      <td>注释</td>
   </tr>
   <tr>
      <td>
         <a href="https://developer.android.com/studio">Android Studio</a>
      </td>
      <td>
         你将使用 Android Studio 来创建你的跨平台应用程序, 并在模拟设备或硬件设备上运行这些应用程序.
      </td>
    </tr>
    <tr>
      <td>
         <a href="https://apps.apple.com/us/app/xcode/id497799835">Xcode</a>
      </td>
      <td>
         大多数情况下, Xcode 会在后台工作. 你将使用它在你的 iOS 应用程序中添加 Swift 或 Objective-C 代码.
      </td>
   </tr>
   <tr>
      <td>
         <a href="https://www.oracle.com/java/technologies/javase-downloads.html">JDK</a>
      </td>
      <td>
         <p>
            要检查是否已安装 JDK, 请在 Android Studio 的 terminal 窗口, 或你的命令行工具中, 运行以下命令: <br/>
         </p>
         <p>
            <code style="block" lang="bash">java -version</code>
         </p>
      </td>
   </tr>
   <tr>
      <td>
         <a href="multiplatform-mobile-plugin-releases.md">Kotlin Multiplatform Mobile plugin</a>
      </td>
      <td>
         在 Android Studio 中, 选择菜单 <strong>Settings/Preferences | Plugins</strong>,
         在 <strong>Marketplace</strong> 中搜索 <i>Kotlin Multiplatform Mobile</i>, 并安装它.
      </td>
   </tr>
   <tr>
      <td>
         <a href="plugin-releases.md#update-to-a-new-release">Kotlin plugin</a>
      </td>
      <td>
         <p>
            Kotlin plugin 随 Android Studio 的每个版本一起发布. 但是, 还需要将它更新到最新版本, 以免发生兼容性问题.
        </p> 
         <p>
            要更新 Kotlin plugin, 请在 Android Studio 的欢迎画面,
            选择 <strong>Plugins | Installed</strong>. 点击 Kotlin 旁边的 <strong>Update</strong> 按钮.
            你也可以通过菜单 <strong>Tools | Kotlin | Configure Kotlin Plugin Updates</strong> 检查 Kotlin 版本.
         </p>
         <p>
            Kotlin plugin 的版本应该与 Kotlin Multiplatform Mobile plugin 兼容.
            详情请参见 <a href="multiplatform-mobile-plugin-releases.html#release-details">兼容版本列表</a>.
         </p>
      </td>
   </tr>
   <tr>
      <td>
         <a href="https://cocoapods.org/">CocoaPods</a>
      </td>
      <td>
         <p>
            CocoaPods 是添加 iOS 依赖项的便利工具, 在后面的步骤中你会用到这些依赖项.
            CocoaPods 基于 Ruby 构建, 你可以使用 macOS 中默认的 Ruby 环境来安装它.
         </p>
         <p>
            在 Android Studio 的 terminal 窗口, 或你的命令行工具中, 运行以下命令:
         </p>
         <p>
            <code style="block" lang="ruby">$sudo gem install cocoapods</code>
         </p>
      </td>
   </tr>
</table>

## 检查你的环境

为了保证一切工作正常, 请安装并运行 KDoctor 工具:

> KDoctor 只能在 macOS 上工作.
{:.note}

1. 在 Android Studio 的 terminal 窗口, 或你的命令行工具中, 运行以下命令, 使用 Homebrew 安装 KDoctor 工具:

    ```bash
    brew install kdoctor
    ```

   如果你还没有 Homebrew, 请 [安装它](https://brew.sh/),
   或阅读 KDoctor 的 [README](https://github.com/Kotlin/kdoctor#installation) 查看其它安装方法.

2. 安装完成后, 在控制台调用 KDoctor:

    ```bash
    kdoctor
    ```

3. 如果 KDoctor 在检查你的环境时诊断出任何问题, 请查看输出, 查找发生的问题, 以及可能的解决方案:

   * 修正所有失败的检查项目 (`[x]`). 你可以在 `*` 符号之后找到问题的详细描述, 以及可能的解决方案.
   * 检查警告项目 (`[!]`) 和成功消息 (`[v]`). 这些信息也可能包含有用的信息和提示.

## 可能的问题与解决方案

### Android Studio

请确认你安装了 Android Studio. 你可以从它的 <a href="https://developer.android.com/studio">官方网站</a> 下载.

### Java 与 JDK

- 请确认你安装了 JDK. 你可以从它的 <a href="https://www.oracle.com/java/technologies/javase-downloads.html">官方网站</a> 下载.
- Android Studio 使用捆绑的 JDK 来执行 Gradle 任务.
  要在 Android Studio 中配置 Gradle 的 JDK, 请选择菜单 <strong>Settings/Preferences | Build, Execution, Deployment | Build Tools | Gradle</strong>.
- 你可能会遇到与 <code>JAVA_HOME</code> 相关的问题. 这个环境变量指定 Xcode 和 Gradle 需要的 Java 二进制文件的位置.
  如果发生这类问题, 请参见 KDoctor 的提示来解决.

### Xcode

- 请确认你安装了 Xcode. 你可以从它的 <a href="https://developer.apple.com/xcode/">官方网站</a> 下载.
- 在一个单独的窗口启动 Xcode, 接受它的许可协议, 并让它执行一些必要的初始化任务.

### Kotlin 的各种 plugin

#### Kotlin Multiplatform Mobile plugin
- 请确认 Kotlin Mobile Multiplatform 已安装并被启用.
  请在 Android Studio 的欢迎画面, 选择 <strong>Plugins | Installed</strong>, 检查这个 plugin 是否已启用.
  如果它不在 <strong>Installed</strong> 列表中, 请在 <strong>Marketplace</strong> 中搜索并安装这个 plugin.
- 如果这个 plugin 已过期, 请点击 plugin 旁边的 <strong>Update</strong> 按钮.
  也可以通过菜单 <strong>Settings/Preferences | Tools | Plugins</strong> 更新.
- 请参见 <a href="multiplatform-mobile-plugin-releases.html#release-details">发布版本详情</a> 一览表,
  检查 Kotlin Multiplatform Mobile plugin 与你的 Kotlin 版本的兼容性.

#### Kotlin plugin
- 请确认 Kotlin plugin 已经更新到了最新版本.
  要更新版本, 请在 Android Studio 的欢迎画面, 选择 <strong>Plugins | Installed</strong>. 点击 Kotlin 旁边的 <strong>Update</strong>.
- 你也可以通过菜单 <strong>Tools | Kotlin | Configure Kotlin Plugin Updates</strong> 检查 Kotlin 版本.

### CocoaPods

请确认你安装了 <a href="https://guides.cocoapods.org/using/getting-started.html#installation">CocoaPods 依赖项管理器</a>.

> 我们推荐使用最新的 Kotlin 版本. 如果你目前的版本低于 1.7.0, 在继续工作之前, 你将需要另外安装 <a href="https://github.com/square/cocoapods-generate#installation">`cocoapods-generate` plugin</a>.
{:.note}

如果你的设备上没有安装 Ruby, 或你在安装或使用 CocoaPods 时遇到的问题, 请参考以下指南:

- <a href="https://www.ruby-lang.org/en/documentation/installation/">安装 Ruby</a>.
  你可以使用 Homebrew, RVM, 或其它包管理器安装 Ruby.
- <a href="https://rubygems.org/pages/download">下载 RubyGems</a>,
  一个 Ruby 的包管理框架.

如果你安装了 Ruby 3.0.0 或更高版本, 你可能遇到 `cocoapods-generate` 的兼容性错误. 这种情况下, 请降低 Ruby 版本.

### Command line

请确认你安装了所有必须的工具:

- <code>command not found: brew</code> — <a href="https://brew.sh/">安装 Homebrew</a>.
- <code>command not found: java</code> — <a href="https://www.oracle.com/java/technologies/javase-downloads.html">安装 Java</a>.
- <p><code>command not found: gem</code> — Ruby 1.9 或更高版本会内部包含 RubyGems. 在 macOS 环境中 Ruby 应该默认可用.</p>
  <p>如果你没有 Ruby, 请遵循 <a href="https://www.ruby-lang.org/en/documentation/installation/">这篇向导</a> 安装它.
  关于 RubyGems 包管理框架, 你可以从它的 <a href="https://rubygems.org/pages/download/">官方网站</a> 下载.</p>


## 下一步

开发环境设置完成后, 你就可以开始 [创建你的第一个跨平台移动应用程序](multiplatform-mobile-create-first-app.html).

## 获取帮助

* **Kotlin Slack**.
  首先得到 [邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up),
  然后加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道.
* **Kotlin issue tracker**.
  [报告新的问题](https://youtrack.jetbrains.com/newIssue?project=KT).
