[//]: # (title: Kotlin/JS 入门)

本教程演示如何使用 Kotlin/JavaScript (Kotlin/JS) 创建一个面向浏览器的 Web 应用程序.
要创建你的应用程序, 请选择最适合你工作流程的工具:

* **[IntelliJ IDEA](#create-your-application-in-intellij-idea)**:
  从版本控制系统中克隆项目模板, 并在 IntelliJ IDEA 中使用.
* **[Gradle 构建系统](#create-your-application-using-gradle)**:
  手动创建项目的构建文件, 更好地理解底层的配置工作原理.

> 除了针对浏览器之外, Kotlin/JS 还可以编译到其他环境.
> 详情请参见 [执行环境](js-project-setup.md#execution-environments).
>
{style="tip"}

## 在 IntelliJ IDEA 中创建应用程序 {id="create-your-application-in-intellij-idea"}

要创建 Kotlin/JS Web 应用程序, 可以使用 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/).

### 设置环境 {id="set-up-the-environment"}

1. 下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/).
2. 安装 [Kotlin Multiplatform IDE Plugin](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)
  (注意不要与 Kotlin Multiplatform Gradle Plugin 混淆).

### 创建项目 {id="create-your-project"}

1. 在 IntelliJ IDEA 中, 选择 **File** | **New** | **Project from Version Control**.
2. 输入 [Kotlin/JS 模板项目](https://github.com/Kotlin/kmp-js-wizard) 的 URL:

   ```text
   https://github.com/Kotlin/kmp-js-wizard
   ```

3. 点击 **Clone**.

### 配置项目 {id="configure-your-project"}

1. 打开 `kmp-js-wizard/gradle/libs.versions.toml` 文件. 它包含项目依赖项的版本目录.
2. 确认 Kotlin 版本与 Kotlin Multiplatform Gradle Plugin 版本匹配,
   创建面向 Kotlin/JS 的 Web 应用程序需要这个 Plugin:

   ```toml
   [versions]
   kotlin = "%kotlinVersion%"

   [plugins]
   kotlin-multiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
   ```

3. 同步 Gradle 文件(如果你更新了 `libs.versions.toml` 文件).
   点击构建文件中出现的 **Load Gradle Changes** 图标.

   ![Load Gradle changes 按钮](load-gradle-changes.png){width=300}

   或者, 点击 Gradle 工具窗口中的刷新按钮.

关于跨平台项目的 Gradle 配置, 详情请参见 [Multiplatform Gradle DSL 参考](multiplatform-dsl-reference.md).

### 构建并运行应用程序 {id="build-and-run-the-application"}

1. 打开 `src/jsMain/kotlin/Main.kt` 文件.

   * `src/jsMain/kotlin/` 目录包含你的项目针对 JavaScript 目标平台的 Kotlin main 源代码文件.
   * `Main.kt` 文件包含代码, 它使用 [`kotlinx.browser`](https://github.com/Kotlin/kotlinx-browser) API, 在浏览器页面上输出 "Hello, Kotlin/JS!".

2. 点击 `main()` 函数中的 **Run** 图标, 运行代码.

   ![运行应用程序](js-run-gutter.png){width=500}

Web 应用程序会自动在浏览器中打开.
或者, 也可以在运行完成后, 在浏览器中打开以下 URL:

```text
http://localhost:8080/
```

你会看到这个 Web 应用程序:

![应用程序输出](js-output-gutter-1.png){width=600}

初次运行应用程序后, IntelliJ IDEA 会在顶部工具栏中, 创建对应的运行配置 (**jsMain [js]**):

![Gradle 运行配置](js-run-config.png){width=500}

> 在 Ultimate 订阅版的 IntelliJ IDEA 中, 你可以使用
> [JS Debugger](https://www.jetbrains.com/help/idea/configuring-javascript-debugger.html),
> 直接在 IDE 中调试代码.
>
{style="tip"}

### 启用持续构建 {id="enable-continuous-build"}

Gradle 可以在你每次进行修改时, 自动重新构建项目:

1. 在运行配置列表中选择 **jsMain [js]**, 点击 **More Actions** | **Edit**.

    ![Gradle 编辑运行配置](js-edit-run-config.png){width=500}

2. 在 **Run/Debug Configurations** 对话框中,
   在 **Run** 栏内输入 `jsBrowserDevelopmentRun --continuous`.

    ![持续运行配置](js-continuous-run-config.png){width=500}

3. 点击 **OK**.

现在, 当你运行应用程序并进行任何修改后, Gradle 会自动对项目执行增量构建,
并在你保存(<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>)或修改类文件时, 热重载浏览器.

### 修改应用程序 {id="modify-the-application"}

修改应用程序, 添加统计单词字母数的功能.

#### 添加输入元素 {id="add-an-input-element"}

1. 在 `src/jsMain/kotlin/Main.kt` 文件中,
   通过 [扩展函数](extensions.md#extension-functions) 添加一个 [HTML input 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input),
   用来读取用户输入:

   ```kotlin
   // 替换旧代码: Element.appendMessage() 函数
   fun Element.appendInput() {
       val input = document.createElement("input")
       appendChild(input)
   }
   ```

2. 在 `main()` 中调用 `appendInput()` 函数. 它会在页面上显示一个输入元素:

   ```kotlin
   fun main() {
       // 替换旧代码: document.body!!.appendMessage(message)
       document.body?.appendInput()
   }
   ```

3. [再次运行应用程序](#build-and-run-the-application).

    你的应用程序现在看起来是这样的:

   ![带有一个输入元素的应用程序](js-added-input-element.png){width=600}

#### 添加 input 事件处理 {id="add-an-input-event-handling"}

1. 在 `appendInput()` 函数内添加一个监听器, 用于读取输入值并响应变化:

    ```kotlin
   // 替换当前的 appendInput() 函数
    fun Element.appendInput(onChange: (String) -> Unit = {}) {
        val input = document.createElement("input").apply {
            addEventListener("change") { event ->
                onChange(event.target.unsafeCast<HTMLInputElement>().value)
            }
        }
        appendChild(input)
    }
    ```

2. 按照 IDE 的建议, 导入 `HTMLInputElement` 依赖项.

   ![导入依赖项](js-import-dependency.png){width=600}

3. 在 `main()` 中调用 `onChange` 回调. 它读取并处理输入值:

    ```kotlin
    fun main() {
        // 替换旧代码: document.body?.appendInput()
        document.body?.appendInput(onChange = { println(it) })
    }
   ```

#### 添加输出元素 {id="add-an-output-element"}

1. 定义一个创建段落的 [扩展函数](extensions.md#extension-functions), 添加文本元素, 用来显示输出:

   ```kotlin
    fun Element.appendTextContainer(): Element {
        return document.createElement("p").also(::appendChild)
    }
   ```

2. 在 `main()` 中调用 `appendTextContainer()` 函数. 它创建输出元素:

   ```kotlin
    fun main() {
        // 为输出创建一个文本容器
        // 替换旧代码: val message = Message(topic = "Kotlin/JS", content = "Hello!")
        val output = document.body?.appendTextContainer()

        // 读取输入值
        document.body?.appendInput(onChange = { println(it) })
    }
   ```

#### 处理输入, 统计字母数 {id="process-the-input-to-count-the-letters"}

处理输入, 删除空格, 并输出显示包含的字母数量.

在 `main()` 函数的 `appendInput()` 函数中, 添加以下代码:

```kotlin
fun main() {
    // 为输出创建一个文本容器
    val output = document.body?.appendTextContainer()

    // 读取输入值
    // 替换当前的 appendInput() 函数
    document.body?.appendInput(onChange = { name ->
        name.replace(" ", "").let {
            output?.textContent = "Your name contains ${it.length} letters"
        }
    })
}
```

在上面的代码中:

* [`replace()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) 删除名字中的空格.
* [`let{}` 作用域函数](scope-functions.md#let) 在对象上下文中运行该函数.
* [字符串模板](strings.md#string-templates) (`${it.length}`), 在字符串前加上美元符号 (`$`) 并将其包在花括号 (`{}`) 中, 插入单词的长度值.
  其中 `it` 是 [Lambda 表达式参数](coding-conventions.md#lambda-parameters) 的默认名称.

#### 运行应用程序 {id="run-the-application"}

1. [运行应用程序](#build-and-run-the-application).
2. 输入你的名字.
3. 按下 <shortcut>Enter</shortcut>.

你会看到结果:

![应用程序输出](js-output-gutter-2.png){width=600}

#### 处理输入, 统计唯一的字母数 {id="process-the-input-to-count-unique-letters"}

作为额外的练习, 我们来处理输入, 计算并显示单词中唯一字母的数量:

1. 在 `src/jsMain/kotlin/Main.kt` 文件中, 为 `String` 添加 `.countDistinctCharacters()` [扩展函数](extensions.md#extension-functions):

   ```kotlin
   fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
   ```

   在上面的代码中:

   * [`.lowercase()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 将名字转换为小写.
   * [`toList()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 将输入字符串转换为字符列表.
   * [`distinct()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) 只选择单词中的唯一字符.
   * [`count()` 函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 统计唯一字符的数量.

2. 在 `main()` 中调用 `.countDistinctCharacters()` 函数. 它统计名字中唯一字母的数量:

   ```kotlin
    fun main() {
        // 为输出创建一个文本容器
        val output = document.body?.appendTextContainer()

        // 读取输入值
        document.body?.appendInput(onChange = { name ->
            name.replace(" ", "").let {
                // 打印唯一字母的数量
                // 替换旧代码: output?.textContent = "Your name contains ${it.length} letters"
                output?.textContent = "Your name contains ${it.countDistinctCharacters()} unique letters"
            }
        })
   }
   ```

3. 按照步骤 [运行应用程序并输入你的名字](#run-the-application).

你会看到结果:

![应用程序输出](js-output-gutter-3.png){width=600}

## 使用 Gradle 创建应用程序 {id="create-your-application-using-gradle"}

在本节中, 你可以了解如何使用 [Gradle](https://gradle.org) 手动创建 Kotlin/JS 应用程序.

Gradle 是 Kotlin/JS 和 Kotlin Multiplatform 项目的默认构建系统.
它也经常在 Java, Android 和其他生态系统中使用.

### 创建项目文件 {id="create-project-files"}

1. 确认你使用的 Gradle 版本与 Kotlin Gradle Plugin(KGP)兼容.
   详情请参见 [兼容性表格](gradle-configure-project.md#apply-the-plugin).
2. 使用文件浏览器, 命令行, 或你喜欢的任何工具, 为你的项目创建一个空目录.
3. 在项目目录中, 创建一个 `build.gradle.kts` 文件, 内容如下:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   // build.gradle.kts
   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       js {
           // 使用 browser(), 在浏览器中运行, 或使用 nodejs(), 在 Node.js 中运行
           browser()
           binaries.executable()
       }
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   // build.gradle
   plugins {
       id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
   }

   repositories {
       mavenCentral()
   }

   kotlin {
       js {
           // 使用 browser(), 在浏览器中运行, 或使用 nodejs(), 在 Node.js 中运行
           browser()
           binaries.executable()
       }
   }
   ```

   </tab>
   </tabs>

   > 你可以使用不同的 [执行环境](js-project-setup.md#execution-environments),
   > 例如 `browser()` 或 `nodejs()`.
   > 每种环境定义了代码运行的位置, 并决定 Gradle 在项目中生成 task 名称的方式.
   >
   {style="note"}

4. 在项目目录中, 创建一个空的 `settings.gradle.kts` 文件.
5. 在项目目录中, 创建 `src/jsMain/kotlin` 目录.
6. 在 `src/jsMain/kotlin` 目录中, 添加一个 `hello.kt` 文件, 内容如下:

   ```kotlin
   fun main() {
       println("Hello, Kotlin/JS!")
   }
   ```

   按照惯例, 所有的源代码都放在 `src/<target name>[Main|Test]/kotlin` 目录中:
   * `Main` 是源代码所在位置.
   * `Test` 是测试所在位置.
   * `<目标名称>` 对应目标平台(本例中为 `js`).

**对于 `browser` 环境**

> 如果你使用 `browser` 环境, 请按照接下来的步骤操作.
> 如果你使用 `nodejs` 环境, 请跳到 [构建并运行项目](#build-and-run-the-project) 章节.
>
{style="note"}

1. 在项目目录中, 创建 `src/jsMain/resources` 目录.
2. 在 `src/jsMain/resources` 目录中, 创建一个 `index.html` 文件, 内容如下:

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <title>Application title</title>
   </head>
   <body>
       <script src="$NAME_OF_YOUR_PROJECT_DIRECTORY.js"></script>
   </body>
   </html>
   ```

3. 将 `<$NAME_OF_YOUR_PROJECT_DIRECTORY>` 占位符替换为你的项目目录名称.

### 构建并运行项目 {id="build-and-run-the-project"}

要构建项目, 请在项目根目录运行以下命令:

```bash
# 用于浏览器
gradle jsBrowserDevelopmentRun

# 或者

# 用于 Node.js
gradle jsNodeDevelopmentRun
```

如果你使用 `browser` 环境, 你会看到浏览器打开了 `index.html` 文件, 并在浏览器控制台中打印输出 `"Hello, Kotlin/JS!"`.
你可以使用 <shortcut>Ctrl + Shift + J</shortcut>/<shortcut>Cmd + Option + J</shortcut> 命令打开控制台.

![应用程序输出](js-output-gutter-4.png){width=600}

如果你使用 `nodejs` 环境, 你会看到终端打印输出 `"Hello, Kotlin/JS!"`.

![应用程序输出](js-output-gutter-5.png){width=500}

### 在 IDE 中打开项目 {id="open-the-project-in-an-ide"}

你可以在任何支持 Gradle 的 IDE 中打开你的项目.

如果你使用 IntelliJ IDEA:

1. 选择 **File** | **Open**.
2. 找到项目目录.
3. 点击 **Open**.

IntelliJ IDEA 会自动检测它是不是 Kotlin/JS 项目.
如果在使用项目时遇到问题, IntelliJ IDEA 会在 **Build** 面板中显示错误信息.

## 下一步做什么? {id="what-s-next"}

<!-- * Complete the [Create a multiplatform app targeting Web](native-app-with-c-and-libcurl.md) tutorial that explains how
  to share your Kotlin code with a JavaScript/TypeScript application.]: -->

* [设置你的 Kotlin/JS 项目](js-project-setup.md).
* 了解如何 [调试 Kotlin/JS 应用程序](js-debugging.md).
* 了解如何 [使用 Kotlin/JS 编写和运行测试](js-running-tests.md).
* 了解如何 [为实际的 Kotlin/JS 项目编写 Gradle 构建脚本](multiplatform-dsl-reference.md).
* 阅读 [Gradle 构建系统](gradle.md) 的更多内容.
