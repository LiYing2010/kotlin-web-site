[//]: # (title: 运行代码片段)

Kotlin 代码通常使用项目来管理, 你可以通过 IDE, 文本编辑器, 或其他工具来开发这些项目.
但是, 如果你想要快速查看一个函数如何工作, 或想要计算一个表达式的值, 就没有必要创建新的项目并构建它.
我们来看看在各种环境中直接运行 Kotlin 代码的 3 种便利方法:

* IDE 环境: [草稿(Scratch)与工作簿(Worksheet)](#ide-scratches-and-worksheets).
* 浏览器环境: [Kotlin Playground](#browser-kotlin-playground).
* 命令行环境: [ki shell](#command-line-ki-shell).

## IDE: 草稿(Scratch)与工作簿(Worksheet) {id="ide-scratches-and-worksheets"}

IntelliJ IDEA 和 Android Studio 支持 Kotlin [草稿(Scratch)文件与工作簿(Worksheet)](https://www.jetbrains.com/help/idea/kotlin-repl.html#efb8fb32).

* _草稿(Scratch)文件_ (或者直接简称 _草稿_) 可以在你的项目的同一个 IDE 窗口内创建代码草稿, 并立即运行.
  草稿不会关联到项目; 你可以从你的 OS 上的任何 IntelliJ IDEA 窗口, 访问并运行你的所有草稿.

  要创建一个 Kotlin 草稿, 请选择菜单 **File** | **New** | **Scratch File**, 然后选择 **Kotlin** 类型.

* _工作簿_ 是项目内的文件: 它们存储在项目目录内, 并属于项目的模块.
  工作簿可以用来编写那些还不能真正构成软件单元, 但仍然需要与项目一起保存的代码片段.
  比如, 教学或演示素材.

  要在项目目录内创建一个 Kotlin 工作簿, 请在项目树的目录上点击鼠标右键, 并选择菜单 **New** | **Kotlin Class/File** | **Kotlin Worksheet**.

在草稿和工作簿中, 支持语法高亮, 自动完成, 以及 IntelliJ IDEA 代码编辑器的所有其他功能.
不需要声明 `main()` 函数 - 你编写的所有代码都会被执行, 就好像它们在 `main()` 函数内一样.

你的代码在草稿或工作簿之内编写完成后, 点击 **Run**.
执行结果将会出现在你的代码行的对面.

![运行草稿](scratch-run.png){width=700}

### 交互模式 {id="interactive-mode"}

IDE 可以从草稿和工作簿自动运行代码. 要在你停止输入代码时立即得到执行结果, 请切换到 **Interactive mode**.

![草稿交互模式](scratch-interactive.png){width=700}

### 使用模块 {id="use-modules"}

在你的草稿和工作簿中, 可以使用 Kotlin 项目中的类和函数.

工作簿自动得到它所属模块中类和函数的访问权.

如果要在草稿中使用项目中的类或函数, 在草稿文件中需要和通常一样使用 `import` 语句导入它们.
然后编写你的代码, 然后在 **Use classpath of module** 中选择适当的模块来运行.

草稿和工作簿都使用相关模块编译后的版本. 因此, 如果你修改了模块的源代码文件, 要到重新构建模块之后, 变更才会反应到草稿和工作簿.
要在草稿或工作簿的每次运行之前自动重新构建模块, 请选择 **Make module before Run**.

![草稿选择模块](scratch-select-module.png){width=700}

### 以 REPL 模式运行 {id="run-as-repl"}

要计算草稿或工作簿中的每一个表达式, 请使用 **Use REPL** 模式来运行.
代码行会按顺序运行, 对每一个调用输出结果.
以后你可以在同一个文件内使用结果, 方法是引用它们自动生成的 `res*` 名称 (名称会显示在对应的行中).

![草稿 REPL](scratch-repl.png){width=700}

## 浏览器: Kotlin Playground {id="browser-kotlin-playground"}

[Kotlin Playground](https://play.kotlinlang.org/) 是一个在线应用程序, 可以在你的浏览器内编写, 运行, 以及共享 Kotlin 代码.

### 编写和编辑代码 {id="write-and-edit-code"}

在 Playground 的编辑器区域, 你可以象在一个源代码文件一样的编写代码:
* 以任意顺序添加你自己的类, 函数, 以及顶层声明.
* 在 `main()` 的函数体之内编写可执行的部分.

与通常的 Kotlin 项目一样, Playground 中的 `main()` 函数可以有 `args` 参数, 也可以完全没有参数.
要在执行时传递程序参数, 请在 **Program arguments** 栏写入这些参数.

![Playground: 代码自动完成](playground-completion.png){width=700}

Playground 会对代码高亮显示, 并为你输入的代码显示自动完成选项.
它会从自动标准库和 [`kotlinx.coroutines`](coroutines-overview.md) 导入声明.

### 选择执行环境 {id="choose-execution-environment"}

Playground 提供几种方法来定制执行环境:
* 多个 Kotlin 版本, 包括可用的 [未来版本的预览版](eap.md).
* 用来运行代码的多个后端: JVM, JS (旧编译器或 [IR 编译器](js-ir-compiler.md), 或 Canvas), 或 JUnit.

![Playground: 环境设置](playground-env-setup.png){width=700}

对于 JS 后端, 你也可以查看生成的 JS 代码.

![Playground: 生成 JS](playground-generated-js.png){width=700}

### 在线共享代码 {id="share-code-online"}

使用 Playground 与他人共享你的代码 – 请点击 **Copy link**, 然后发送给你想要展示代码的任何人.

你可以也将 Playground 中的代码片段内嵌到其他网站, 甚至还能让它们运行起来.
请点击 **Share code**, 将你的示例内嵌到任何网页, 或内嵌到 [Medium](https://medium.com/) 的一篇文章.

![Playground: 共享代码](playground-share.png){width=700}

## 命令行: ki shell {id="command-line-ki-shell"}

[ki shell](https://github.com/Kotlin/kotlin-interactive-shell) (_Kotlin Interactive Shell_)
是一个命令行工具, 用来在终端运行 Kotlin 代码. 它可以在 Linux, macOS, 和 Windows 环境运行.

ki shell 提供基本的代码计算能力, 以及一些高级功能, 比如:
* 代码自动完成
* 类型检查
* 外部依赖项
* 代码片段的粘贴模式
* 脚本支持

详情请参见 [ki shell GitHub 代码仓库](https://github.com/Kotlin/kotlin-interactive-shell).

### 安装并运行 ki shell {id="install-and-run-ki-shell"}

要安装 ki shell, 请从 [GitHub](https://github.com/Kotlin/kotlin-interactive-shell) 下载最新版本, 并解压缩到你指定的目录.

在 macOS 上, 你也可以运行以下命令, 使用 Homebrew 来安装 ki shell:

```shell
brew install ki
```

要启动 ki shell, 在 Linux 和 macOS 上请运行 `bin/ki.sh` (如果是通过 Homebrew 安装 ki shell, 可以直接输入 `ki`),
在 Windows, 请运行 `bin\ki.bat`.

shell 开始运行后, 你就可以开始在终端编写 Kotlin 代码了.
可以输入 `:help` (或 `:h`) 查看在 ki shell 中能够使用的命令.

### 代码自动完成与高亮显示 {id="code-completion-and-highlighting"}

当你按下 **Tab** 键时, ki shell 会显示代码自动完成选项. 它还为你输入的代码提供语法高亮显示.
你可以输入 `:syntax off` 来关闭这个功能.

![ki shell 语法高亮与自动完成](ki-shell-highlight-completion.png){width=700}

当你 按下 **Enter** 键时, ki shell 会计算输入的行, 并打印结果. 表达式值会作为变量打印输出, 变量使用自动生成的名称 `res*`.
以后你可以在你运行的代码中使用这些变量.
如果输入的结构不完整 (比如, 一个 `if` 有条件部分但没有代码体部分), shell 会打印 3 个点号, 等待输入剩余的部分.

![ki shell 运行结果](ki-shell-results.png){width=700}

### 检查表达式类型 {id="check-an-expression-s-type"}

对于你不熟悉的复杂的表达式或 API, ki shell 提供 `:type` (或 `:t`) 命令, 它会显示表达式的类型:

![ki shell 类型](ki-shell-type.png){width=700}

### 装载代码 {id="load-code"}

如果你需要的代码保存在别处, 有 2 种方法可以装载代码并在 ki shell 中使用:
* 使用 `:load` (或 `:l`) 命令, 装载一个源代码文件.
* 使用 `:paste` (或 `:p`) 命令, 在粘贴模式中复制粘贴代码片段.

![ki shell 装载文件](ki-shell-load.png){width=700}

`ls` 命令显示可以使用的符号 (变量和函数).

### 添加外部依赖项 {id="add-external-dependencies"}

除标准库之外, ki shell 也支持外部依赖项.
因此你可以试用第三方的库, 而不必创建完整的项目.

要在 ki shell 中添加第三方库, 请使用 `:dependsOn` 命令.
ki shell 默认使用 Maven Central, 但如果你使用 `:repository` 命令连接到其他仓库, 也可以使用其他仓库:

![ki shell 外部依赖项](ki-shell-dependency.png){width=700}
