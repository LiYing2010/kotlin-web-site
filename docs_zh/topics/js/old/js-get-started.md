[//]: # (title: Kotlin/JS for React 入门)

最终更新: %latestDocDate%

本教程演示如何在 IntelliJ IDEA 中使用 Kotlin/JS for React 创建一个前端应用程序.

开始之前, 请安装 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) 的最新版本.

## 创建一个应用程序 

安装 IntelliJ IDEA 后, 就可以创建你的第一个 Kotlin/JS with React 前端应用程序了.

1. 在 IntelliJ IDEA 中, 选择 **File** | **New** | **Project**.
2. 在左侧面板中, 选择 **Kotlin Multiplatform**.
3. 输入项目名称, 选择 **React Application** 作为项目模板, 然后点击 **Next**.

   <img src="/assets/docs/images/get-started/js-new-project-1.png" alt="创建 react 应用程序" width="700"/>


    你的项目默认会使用 Gradle 和 Kotlin DSL 作为构建系统.

4. 接受下一个画面中的默认配置, 并点击 **Finish**. 你的项目会打开.
 

    <img src="/assets/docs/images/get-started/js-new-project-2.png" alt="配置前端应用程序" width="700"/>

5. 打开 `build.gradle.kts` 文件, 这是根据你的配置默认创建的构建脚本.
   它包含你的前端应用程序所需要的 [`kotlin("js")` plugin 和依赖项](js-project-setup.html).
   请确认使用了插件的最新版本:

   ```kotlin
   plugins {
       kotlin("js") version "{{ site.data.releases.latest.version }}"
   }
   ```

## 运行应用程序

点击屏幕顶部运行配置旁边的 **Run**, 启动应用程序.

<img src="/assets/docs/images/get-started/js-run-app.png" alt="运行前端应用程序" width="500"/>

你的默认 Web 浏览器会打开你的前端应用程序 URL [http://localhost:8080/](http://localhost:8080/).

<img src="/assets/docs/images/get-started/js-output-1.png" alt="Web 浏览器打开 JS 应用程序" width="600"/>

在文本框中输入你的名字, 然后可以收到你的应用程序给你的问候!

## 更新应用程序

### 反转显示你的名字

1. 打开 `src/main/kotlin` 中的 `Welcome.kt` 文件.  
   `src` 目录包含 Kotlin 源代码文件和资源. `Welcome.kt` 文件包含示例代码, 描绘你刚才看到的Web 页面.

   ![前端应用程序的源代码]({{ url_for('asset', path='docs/images/get-started/js-welcome-kt.png') }})
   
2. 修改 `div` 代码, 反转显示你的名字.  
   
   * 使用标准库函数 `reversed()` 反转你的名字.
   * 使用 [字符串模板](../strings.html#string-templates) 表示你反转后的名字,
     添加一个 `$` 符号, 然后将表达式包在括号内 – `${state.name.reversed()}`.

   ```kotlin
   div {
        css {
            padding = 5.px
            backgroundColor = rgb(8, 97, 22)
            color = rgb(56, 246, 137)
        }
        +"Hello, $name"
        +" Your name backwards is ${name.reversed()}!"
    }
   ```

3. 将你的修改保存到文件.

4. 到浏览器查看结果.  
   只有你的前一个应用程序还在继续运行, 你才会看到修改后的结果. 如果你停止了你的应用程序, 请 [重新运行它](#run-the-application).

<img src="/assets/docs/images/get-started/js-output-2.png" alt="Web 浏览器显示反转的名字" width="600"/>

### 添加一个图片

1. 打开 `src/main/kotlin` 中的 `Welcome.kt` 文件.

2. 添加一个 `div` 容器, 其中包含一个图片子元素 `img`, 放在 `input` 代码段之后.  
   
   > 按照 IDE 的建议, 导入 `react.dom.html` 包中所有需要的元素.
> 
{style="note"}

   ```kotlin
   div {
        img {
            src = "https://placekitten.com/408/287"
        }
    }
   ```

3. 将你的修改保存到文件.

4. 到浏览器查看结果.  
   只有你的前一个应用程序还在继续运行, 你才会看到修改后的结果. 如果你停止了你的应用程序, 请 [重新运行它](#run-the-application). 

<img src="/assets/docs/images/get-started/js-output-3.png" alt="带图片的Web 页面" width="600"/>

### 添加一个按钮来修改文字

1. 打开 `src/main/kotlin` 中的 `Welcome.kt` 文件.

2. 添加一个 `button` 元素, 并加上 `onClick` 事件处理器.  
   
   > 请确认你导入了 `react.dom.html.ReactHTML`.
> 
{style="note"}

   ```kotlin
   button {
        onClick = {
            name = "Some name"
        }
        +"Change name"
    }   
   ```

3. 将你的修改保存到文件.

4. 到浏览器查看结果.  
   只有你的前一个应用程序还在继续运行, 你才会看到修改后的结果. 如果你停止了你的应用程序, 请 [重新运行它](#run-the-application).

<img src="/assets/docs/images/get-started/js-output-4.png" alt="带按钮的Web 页面" width="600"/>

## 下一步做什么?

创建过你的第一个应用程序之后, 你可以完成比较长的 Kotlin/JS 教程,
或者查看 Kotlin/JS 示例项目寻找启发. 这两种资源都包含有用的代码片段和模式, 可以用作你自己项目的一个很好的起点.

### 教程

* [教程 - 使用 React 和 Kotlin/JS 创建 Web 应用程序](js-react.html)
  指导你使用 React 框架创建一个简单的 Web 应用程序, 演示用于 HTML 的类型安全的 Kotlin DSL 如何简化 reactive DOM 元素的构建工作,
  并展示如何使用第三方 React 组件, 以及如何通过 API 获取信息 , 整个应用程序逻辑完全使用 Kotlin/JS 来编写.

* [使用 Kotlin Multiplatform 构建一个全栈 Web 应用程序](../multiplatform/multiplatform-full-stack-app.html)
  通过创建一个 Client-Server 应用程序, 教授创建针对 Kotlin/JVM 和 Kotlin/JS 的应用程序背后的概念,
  其中用到共通代码, 序列化, 以及其他跨平台范例. 它还简要介绍了如何使用 Ktor 作为 Server 端和 Client 端框架.

### 示例项目

* [Spring 全栈项目: 协作工作的待办事项列表(to-do list)](https://github.com/Kotlin/full-stack-spring-collaborative-todo-list-sample)
  介绍在 JS 和 JVM 目标平台上如何使用 `kotlin-multiplatform` 创建一个用于协作工作的待办事项列表(to-do list)
  后端开发使用 Spring, Kotlin/JS 和 React 用于前端开发和 RSocket.

* [Kotlin/JS 与 React Redux 开发的待办事项列表(to-do list)](https://github.com/Kotlin/react-redux-js-ir-todo-list-sample)
  实现 React Redux 的待办事项列表(to-do list),
  演示如何使用 npm 的 JS 库(`react`, `react-dom`, `react-router`, `redux`, 以及 `react-redux`),
  使用 Webpack 进行打包, 最小化, 并运行项目.
 
* [全栈的演示项目](https://github.com/Kotlin/full-stack-web-jetbrains-night-sample)
  指导你如何构建一个应用程序, 接受用户生成的贴文和评论.
  项目中的所有的数据都由fakeJSON 和 JSON Placeholder 服务提供.
