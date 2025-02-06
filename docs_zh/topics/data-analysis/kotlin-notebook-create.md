[//]: # (title: 创建你的第一个 Kotlin Notebook)

<tldr>
   <p>本章是 <strong>Kotlin Notebook 入门</strong> 教程的第 2 部分. 阅读本章之前, 请确认你已完成了之前的章节.</p>
   <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env.md">设置环境</a><br/>
      <img src="icon-2.svg" width="20" alt="Second step"/> <strong>创建 Kotlin Notebook</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="Third step"/>向 Kotlin Notebook 添加依赖项<br/>
  </p>
</tldr>

在这一章中, 你将学习如何创建你的第一个 [Kotlin Notebook](kotlin-notebook-overview.md), 执行简单的操作, 并运行代码单元(code cell).

## 创建一个空项目 {id="create-an-empty-project"}

1. 在 IntelliJ IDEA 中, 选择 **File | New | Project**.
2. 在左侧面板中, 选择 **New Project**. 
3. 输入项目名称, 如果需要, 修改它的位置.

   > 选择 **Create Git repository** 选择框, 可以将新项目添加到版本管理系统.
   > 这个操作也可以在之后的任何时候进行.
   > 
   {style="tip"}

4. 在 **Language** 列表中, 选择 **Kotlin**.

   ![创建一个新的 Kotlin Notebook 项目](new-notebook-project.png){width=700}

5. 选择 **IntelliJ** 构建系统.
6. 在 **JDK** 列表中, 选择你的项目希望使用的 [JDK](https://www.oracle.com/java/technologies/downloads/).
7. 启用 **Add sample code** 选项, 创建一个文件, 其中包含 `"Hello World!"` 示例程序.

   > 你也可以启用 **Generate code with onboarding tips** 选项, 向你的示例代码添加一些有用的注释.
   > 
   {style="tip"}

8. 点击 **Create**.

## 创建一个 Kotlin Notebook {id="create-a-kotlin-notebook"}

1. 要创建一个新的 Notebook, 请选择 **File | New | Kotlin Notebook**, 或者对一个文件夹右击鼠标, 选择 **New | Kotlin Notebook**.

   ![创建一个新的 Kotlin Notebook](new-notebook.png){width=700}

2. 设置新 Notebook 的名称, 例如, **first-notebook**, 并按下 **Enter** 键.
   会打开一个新的 tab, 其中包含 Kotlin Notebook **first-notebook.ipynb**.
3. 在打开的 Tab 中, 在代码单元(code cell)内输入以下代码:

   ```kotlin
   println("Hello, this is a Kotlin Notebook!")
   ```
4. 要运行代码单元(code cell), 请点击 **Run Cell and Select Below** ![Run Cell and Select Below](run-cell-and-select-below.png){width=30}{type="joined"} 按钮,
   或按下 **Shift** + **Return** 键.
5. 点击 **Add Markdown Cell** 按钮, 添加一个 markdown 单元.
6. 在单元中输入 `# Example operations`, 并运行来渲染这个 markdown 单元, 运行方式与代码单元相同.
7. 在新的代码单元中, 输入 `10 + 10`, 并运行.
8. 在一个代码单元中定义一个变量. 例如, `val a = 100`. 

   > 在你运行了一个定义了变量的代码单元之后, 这些变量就在所有其他代码单元中都可以访问了.
   > 
   {style="tip"}

9. 创建一个新的代码单元, 添加代码 `println(a * a)`.
10. 使用 **Run All** ![Run all button](run-all-button.png){width=30}{type="joined"} 按钮, 运行 Notebook 中的所有代码单元和 markdown 单元.

    ![第一个 Notebook](first-notebook.png){width=700}

恭喜! 你已经创建了你的第一个 Kotlin Notebook.

## 创建 Kotlin Notebook 草稿 {id="create-a-scratch-kotlin-notebook"}

从 IntelliJ IDEA 2024.1.1 开始, 你还能够以草稿文件(Scratch File)的形式创建 Kotlin Notebook.

使用 [草稿文件(Scratch File)](https://www.jetbrains.com/help/idea/scratches.html#create-scratch-file), 你可以测试一小段代码, 而不必创建新的项目, 或修改已有的项目.

要创建 Kotlin Notebook 草稿:

1. 点击 **File | New | Scratch File**.
2. 在 **New Scratch File** 列表中, 选择 **Kotlin Notebook**.

   ![Notebook 草稿](kotlin-notebook-scratch-file.png){width=400}

## 下一步 {id="next-step"}

在本教程的下一部分, 你将学习如何向 Kotlin Notebook 添加依赖项.

**[进入下一章](kotlin-notebook-add-dependencies.md)**
