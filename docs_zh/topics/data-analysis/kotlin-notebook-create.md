[//]: # (title: 创建你的第一个 Kotlin Notebook)

<tldr>
   <p>本章是 <strong>Kotlin Notebook 入门</strong> 教程的第 2 部分. 阅读本章之前, 请确认你已完成了之前的章节.</p>
   <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env.md">设置环境</a><br/>
      <img src="icon-2.svg" width="20" alt="Second step"/> <strong>创建 Kotlin Notebook</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="Third step"/>向 Kotlin Notebook 添加依赖项<br/>
  </p>
</tldr>

要开始使用 [Kotlin Notebook](kotlin-notebook-overview.md), 主要可以通过三种方式:

* [创建一个包含 Kotlin Notebook 的新项目](#create-a-new-project)
* [向既有项目添加 Kotlin Notebook](#add-a-new-kotlin-notebook-to-your-project)
* [创建 Kotlin Notebook 草稿(Scratch)](#create-a-scratch-kotlin-notebook)

## 创建一个新项目 {id="create-a-new-project"}

要创建一个包含 Kotlin Notebook 的新项目, 步骤如下:

1. 在 IntelliJ IDEA 的欢迎界面中, 在左侧面板选择 **Kotlin Notebook** | **New Notebook**.
2. 输入新 Notebook 的 **Name**, 并选择 **Type** | **In Folder**.
   * **Scratch:**: 这个选项用于创建草稿(Scratch) Notebook, 而不将其添加到项目中.
   * **In Folder:**: 这个选项用于在项目中创建 Notebook. 你需要指定项目的位置.
3. 点击 **Create**.

![从 IntelliJ IDEA 创建新的 Kotlin Notebook](create-notebook-welcome.png){width=700}

你的新 Kotlin Notebook 会在一个新项目中创建完成.

或者, 也可以先创建一个空项目, 再 [添加 Kotlin Notebook](#add-a-new-kotlin-notebook-to-your-project):

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

项目创建完成后, 添加一个新的 Kotlin Notebook (参见下一节).

## 向项目添加新的 Kotlin Notebook {id="add-a-new-kotlin-notebook-to-your-project"}

要向既有项目添加新的 Kotlin Notebook, 步骤如下:

1. 选择 **File | New | Kotlin Notebook**, 或者对一个文件夹右击鼠标, 选择 **New | Kotlin Notebook**.

   ![创建一个新的 Kotlin Notebook](new-notebook.png){width=700}

2. 设置新 Notebook 的名称, 例如, **first-notebook**.
3. 按下 **Enter** 键. 会打开一个新的 tab, 其中包含 Kotlin Notebook **first-notebook.ipynb**.

## 创建 Kotlin Notebook 草稿(Scratch) {id="create-a-scratch-kotlin-notebook"}

也可以以草稿文件(Scratch File)的形式创建 Kotlin Notebook.
使用 [草稿文件(Scratch File)](https://www.jetbrains.com/help/idea/scratches.html#create-scratch-file), 你可以测试一小段代码, 而不必创建新的项目, 或修改已有的项目.

要创建 Kotlin Notebook 草稿:

1. 点击 **File | New | Scratch File**.
2. 在 **New Scratch File** 列表中, 选择 **Kotlin Notebook**.

   ![Notebook 草稿](kotlin-notebook-scratch-file.png){width=400}

## 执行基本操作 {id="perform-basic-operations"}

1. 在新的 Kotlin Notebook 中, 在代码单元(Code Cell)内输入以下代码:

   ```kotlin
   println("Hello, this is a Kotlin Notebook!")
   ```

2. 要运行代码单元(code cell), 请点击 **Run Cell and Select Below** ![Run Cell and Select Below](run-cell-and-select-below.png){width=30}{type="joined"} 按钮,
   或按下快捷键 **Shift** + **Return**.
3. 点击 **Add Markdown Cell** 按钮, 添加一个 Markdown 单元.
4. 在单元中输入 `# Example operations`, 运行并渲染这个 Markdown 单元, 运行方式与运行代码单元相同.
5. 在新的代码单元中, 输入 `10 + 10`, 并运行.
6. 在一个代码单元中定义一个变量. 例如, `val a = 100`.

   > 在运行一个定义了变量的代码单元之后, 这些变量在所有其他代码单元中都可以访问.
   >
   {style="tip"}

7. 创建一个新的代码单元, 添加代码 `println(a * a)`.
8. 使用 **Run All** ![Run all button](run-all-button.png){width=30}{type="joined"} 按钮, 运行 Notebook 中的所有代码单元和 Markdown 单元.

   ![第一个 Notebook](first-notebook.png){width=700}

恭喜! 你已经创建并尝试了你的第一个 Kotlin Notebook.


## 下一步 {id="next-step"}

在本教程的下一部分, 你将学习如何向 Kotlin Notebook 添加依赖项.

**[进入下一章](kotlin-notebook-add-dependencies.md)**
