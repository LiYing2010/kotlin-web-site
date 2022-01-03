---
type: doc
layout: reference
category:
title: "教程 - 运行代码片段"
---

# 教程 - 运行代码片段

本页面最终更新: 2022/04/19

有些时候你可能会需要在项目或应用程序之外快速的编写并运行一段代码. 
这个功能可能很有用, 比如, 学习 Kotlin 时, 或者计算一个表达式.
我们来看看一看可以快速运行 Kotlin 代码的 3 种便利方法:

* [草稿(Scratch)](#scratches-and-worksheets) 在 IDE 中, 在我们项目外的临时文件中编写并运行代码.
* [工作簿(Worksheet)](#scratches-and-worksheets) 与草稿(Scratch)类似, 但属于项目.
* [REPL](#repl) (_Read-Eval-Print-Loop_) 在交互式控制台内运行代码.

## 草稿(Scratch)与工作簿(Worksheet)

IntelliJ IDEA 的 Kotlin plugin 支持 [草稿(Scratch)与工作簿(Worksheet)](https://www.jetbrains.com/help/idea/kotlin-repl.html#efb8fb32).
 
_草稿(Scratch)_ 可以在你的项目的同一个 IDE 窗口内创建代码草稿, 并立即运行.
草稿不会关联到项目; 你可以从你的 OS 上的任何 IntelliJ IDEA 窗口, 访问并运行你的所有草稿. 

要创建一个 Kotlin 草稿, 请选择菜单 **File** \| **New** \| **Scratch File**, 然后选择 **Kotlin** 类型.

与草稿不同, _工作簿_ 是项目内的文件: 它们存储在项目目录内, 并属于项目的模块.
工作簿 可以用来编写那些还不能真正构成软件单元, 但仍然需要与项目一起保存的代码.
比如, 你可以使用工作簿作为教学或演示的素材.

要在项目目录内创建一个 Kotlin 工作簿, 请在项目树的目录上点击鼠标右键, 并选择菜单 **New** \| **Kotlin Worksheet**.

在草稿和工作簿中, 你可以编写任何有效的 Kotlin 代码. 支持语法高亮, 自动完成, 以及 IntelliJ IDEA 代码编辑器的所有其他功能.
注意, 不需要声明 `main` 函数: 
你编写的所有代码都会被执行, 就好像它们在 `main` 函数内一样.

你的代码在草稿或工作簿之内编写完成后, 点击 **Run**. 
执行结果将会出现在你的代码行的对面.

<img src="/assets/docs/images/run-code-snippets/scratch-run.png" alt="运行草稿" width="700"/>

### 交互模式

IntelliJ IDEA 可以从草稿和工作簿自动运行代码. 要在你停止输入代码自动得到执行结果, 请切换到 **Interactive mode**.

<img src="/assets/docs/images/run-code-snippets/scratch-interactive.png" alt="草稿交互模式" width="700"/>

### 使用模块

在我们的草稿和工作簿中, 可以使用 Kotlin 项目中的类和函数.

工作簿自动得到它所属模块中类和函数的访问权.

要在草稿中使用项目中的类或函数, 要在草稿文件中和通常一样使用 `import` 语句.
然后编写你的代码, 然后在 **Use classpath of module** 中选择适当的模块来运行.
 
草稿和工作簿都使用相关模块编译后的版本. 因此, 如果你修改了模块的源代码文件, 要到重新构建模块之后, 变更才会反应到草稿和工作簿.
要在草稿或工作簿的每次运行之前自动重新构建模块, 请选择 **Make module before Run**.

<img src="/assets/docs/images/run-code-snippets/scratch-select-module.png" alt="草稿选择模块" width="700"/>

### 以 REPL 模式运行 

要计算草稿或工作簿中的每一个表达式, 请使用 **Use REPL** 模式来运行.
代码会以 [REPL](#repl) 中相同的方式执行: 代码行按顺序运行, 对每一个调用输出结果. 
你可以使用对应的行中显示的 `res*` 名称来引用结果.

<img src="/assets/docs/images/run-code-snippets/scratch-repl.png" alt="草稿 REPL" width="700"/>

## REPL

_REPL_ (_Read-Eval-Print-Loop_) 是 Kotlin 代码的交互式运行工具.
REPL 允许你计算表达式和代码块, 而不必创建项目, 甚至如果你不需要, 你也可以不必创建函数. 

要在 IntelliJ IDEA 中运行 REPL, 请打开菜单项 **Tools** \| **Kotlin** \| **Kotlin REPL**.

要在 OS 的命令行中运行 REPL, 请从 Kotlin 命令行编译器的目录中打开 `/bin/kotlinc-jvm`.

REPL 的命令行接口会打开. 你可以输入任何正确的 Kotlin 代码, 并看到结果.
结果会输出为变量, 自动命名为 `res*`. 在 REPL 中运行的代码内, 你可以引用这些变量.

<img src="/assets/docs/images/run-code-snippets/repl-run.png" alt="运行 REPL" width="700"/>

REPL 也支持多行输入. 多行输入的结果将是其中最后一个表达式的值. 

<img src="/assets/docs/images/run-code-snippets/repl-multi-line.png" alt="REPL 多行运行" width="700"/>
