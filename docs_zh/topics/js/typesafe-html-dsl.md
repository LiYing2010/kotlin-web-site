[//]: # (title: 类型安全的 HTML DSL)

[kotlinx.html 库](https://www.github.com/kotlin/kotlinx.html) 提供了使用静态类型的 HTML 构建器生成 DOM 元素的能力
(而且除 JavaScript 之外, 它甚至能在 JVM 平台使用!)
要使用这个库, 请在我们的 `build.gradle.kts` 文件中包含对应的仓库和依赖项:

```kotlin
repositories {
    // ...
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib-js"))
    implementation("org.jetbrains.kotlinx:kotlinx-html-js:0.8.0")
    // ...
}
```

依赖项添加完成后, 你可以访问其中提供的各自接口来生成 DOM.
要输出一个标题, 一些文字, 以及一个链接, 示例代码如下:

```kotlin
import kotlinx.browser.*
import kotlinx.html.*
import kotlinx.html.dom.*

fun main() {
    document.body!!.append.div {
        h1 {
            +"Welcome to Kotlin/JS!"
        }
        p {
            +"Fancy joining this year's "
            a("https://kotlinconf.com/") {
                +"KotlinConf"
            }
            +"?"
        }
    }
}
```

在浏览器中运行这个示例程序时, DOM 会被直接组装起来.
使用浏览器的开发工具查看网站的元素, 我们很容易确认结果:

![使用 kotlinx.html 输出网页](rendering-example.png){width=700}

关于 `kotlinx.html` 库, 更多详情请参见 [GitHub Wiki 页面](https://github.com/Kotlin/kotlinx.html/wiki/Getting-started),
在这里你可以找到更多信息,
关于如何 [创建元素](https://github.com/Kotlin/kotlinx.html/wiki/DOM-trees) 而不将其添加到 DOM,
如何 [绑定事件](https://github.com/Kotlin/kotlinx.html/wiki/Events), 比如 `onClick`,
以及示例程序, 演示如何 [添加 CSS 类](https://github.com/Kotlin/kotlinx.html/wiki/Elements-CSS-classes) 到你的 HTML 元素,
以及其他更多信息.
