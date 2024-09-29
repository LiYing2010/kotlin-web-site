[//]: # (title: 运行 Kotlin/JS 代码)

最终更新: %latestDocDate%

Kotlin/JS 项目是通过 Kotlin Multiplatform Gradle plugin 管理的, 因此你可以使用适当的 Gradle 任务来运行你的项目.
如果你从一个空的项目开始, 请确认你已有一些示例代码可以运行.
创建文件 `src/jsMain/kotlin/App.kt`, 并在其内容中输入一段 "Hello, World" 式的代码:

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

根据目标平台不同, 初次运行你的代码时, 可能需要一些额外的平台相关的设置.

## 在 Node.js 平台运行

当 Kotlin/JS 项目的编译目标为 Node.js 时, 你可以直接运行 Gradle 的 `jsRun` 任务.
比如, 在命令行环境, 使用 Gradle wrapper:

```bash
./gradlew jsRun
```

如果使用 IntelliJ IDEA, 你可以在 Gradle 工具窗口找到 `jsRun` 任务:

![IntelliJ IDEA 中的 Gradle Run 任务](run-gradle-task.png){width=700}

初次运行时, `kotlin.multiplatform` Gradle plugin 会下载所有需要的依赖项, 准备运行环境.
构建完成后, 程序会被执行, 你可以在终端看到输出:

![在 IntelliJ IDEA 的 Kotlin Multiplatform 项目中执行 JS 编译目标](cli-output.png){width=700}

## 在浏览器平台运行 {id="run-the-browser-target"}

当 Kotlin/JS 项目的编译目标为浏览器时, 你的项目需要有一个 HTML 页面.
在开发你的应用程序时, 这个页面由开发服务器提供, 它应该嵌入你编译后的 Kotlin/JS 文件.
创建一个 HTML 文件 `/src/jsMain/resources/index.html`, 内容如下:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JS Client</title>
</head>
<body>
<script src="js-tutorial.js"></script>
</body>
</html>
```

我们需要引用你的项目(通过 webpack 创建)生成的 js 文件.
默认情况下, js 文件的名称就是你的项目的名称 (这个示例中是, `js-tutorial`).
如果你的项目命名为 `followAlong`, 请注意要嵌入 `followAlong.js` 而不是 `js-tutorial.js`

完成这些调整之后, 启动集成的开发服务器. 你可以在命令行, 使用 Gradle wrapper:

```bash
./gradlew jsRun
```

使用 IntelliJ IDEA 时, 你可以在 Gradle 工具窗口找到 `jsRun` 任务.

项目构建完成后, 内嵌的 `webpack-dev-server` 会开始运行, 并会打开一个 (似乎是空白的) 浏览器窗口, 指向你之前指定的 HTML 文件.
要验证你的程序是否正确运行, 打开你的浏览器的开发者工具(比如, 点击鼠标右键, 选择 _Inspect_ 菜单项).
在开发者工具中, 打开控制台, 你可以看到 JavaScript 代码的执行结果:

![浏览器的开发者工具中的控制台输出](browser-console-output.png){width=700}

通过这样的设置, 你可以在每次代码之后修改, 重新编译你的项目来查看你的修改结果.
Kotlin/JS 还支持更方便的方式, 在开发过程中自动构建应用程序.
关于这种 _持续编译模式_ 的设置方式,
请参见 [开发服务器(Development server)与持续编译(Continuous Compilation)](dev-server-continuous-compilation.md).
