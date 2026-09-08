---
name: translate-page
description: 翻译一个页面
allowed-tools: Read, AskUserQuestion
---

# 需要的信息

需要知道以下信息

- 需要翻译的页面 .md 文件名
- 英文页面文件的前次翻译版本: 上一次已经翻译过的英文页面文件的 git repo commit Hash
- 需要参考的中文翻译文件

# 步骤

## Step 1: 确认需要的信息

使用 `AskUserQuestion`, 按顺序向用户提问, 获得所有需要的信息

## Step 2: 查找页面文件

根据需要翻译的页面 .md 文件名, 查找相应的英文页面文件和中文页面文件

- 英文页面文件存在于以下目录中:
  - "docs/topics" 目录
  - "other-repos/api-guidelines/docs/topics" 目录
  - "other-repos/dokka/docs/topics" 目录
  - "other-repos/kotlin-multiplatform-dev-docs/topics" 目录
  - "other-repos/kotlinx.coroutines/docs/topics" 目录
  - "other-repos/lincheck/docs/topics" 目录

- 中文页面文件以下目录中:
  - "docs_zh/topics" 目录

使用 `AskUserQuestion`, 按顺序向用户提问, 确认英文页面文件和中文页面文件的查找结果是否正确

## Step 3: 翻译

如果 "英文页面文件的前次翻译版本" 是有效的 git repo commit Hash
    -> 查找 "英文页面文件" 在这个 git repo commit 的内容, 与同一个文件的当前内容比较, 得到内容的变更差异
    -> 将这些变更差异翻译为中文, 反映到 "中文页面文件" 中.
如果 "英文页面文件的前次翻译版本" 不是有效的 git repo commit Hash
    -> 将 "英文页面文件" 的当前内容全部翻译为中文, 反映到 "中文页面文件" 中.

中文翻译时的注意事项:
- 对于类似的段落, 参考用户指定的中文翻译参考文件
- 对于使用的中文术语, 参考 "docs_zh/topics" 文件夹下所有其它 .md 文件.
- 翻译时全部使用英文标点符号, 不要使用中文标点符号.
- 示例代码中如果存在注释, 也需要翻译.
- 示例代码的缩进, 全部使用 4 个空格字符, 如果缩进不正确, 请修正.
- 示例代码中如果存在 "println" 或 "print" 语句, 对它之后注释
  - 如果是单行的输出内容, 在中文翻译对应的注释中添加 "输出结果为: "
  - 如果是多行的输出内容, 请在第一行之前, 添加 "// 输出结果为: " 作为新的一行注释, 不要对每一行注释都添加
- 对 '\u' 形式编码的 Unicode 字符, 保持原样, 不要翻译为对应的字符.
- 对数字, 保持原样, 不要翻译为中文数字.
- 对 "**foo**", "__foo__" 之类特殊格式文字, 在中文翻译页面中, 要在这些文字的前后添加空格.
- 检查示例代码的内容, 如果是 `properties` 格式, 请将示例代码明确标注为 `properties` 格式
- 中文翻译页面中的示例代码如果已经标注了 `properties` 格式, 请不要改为 `none` 格式
- 对翻译后的 "中文页面文件" 的每个章节
  - 如果章节标题是中文, 则添加 `id="xxx"` 设置, id 内容请从 "英文页面文件" 的对应的章节文字取得.
  - 如果章节标题是英文, 则忽略 `id="xxx"` 设置
- 如果页面中存在指向 multiplatform 相关 HTML 页面的链接,
  -> 检查与这个 HTML 页面同名的中文页面 .md 文件或 .topic 文件在 "docs_zh/topics/multiplatform" 目录中是否存在,
    -> 如果存在, 将链接替换为指向对应的中文页面 .md 文件或 .topic 文件.
- 删除 "中文页面文件" 中所有的行尾空格字符.
