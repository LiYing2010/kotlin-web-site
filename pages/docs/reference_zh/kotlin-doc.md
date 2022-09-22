---
type: doc
layout: reference
category: "Tools"
title: "为 Kotlin 代码编写文档: KDoc 与 Dokka"
---

# 为 Kotlin 代码编写文档: KDoc 与 Dokka

最终更新: {{ site.data.releases.latestDocDate }}

为 Kotlin 代码编写文档使用的语言 (相当于 Java 中的 Javadoc) 称为 **KDoc**.
本质上, KDoc 结合了 Javadoc 和 Markdown, 它在块标签(block tag)使用 Javadoc 语法(但做了扩展, 以便支持 Kotlin 特有的概念),
Markdown 则用来表示内联标记(inline markup).

## 生成文档

Kotlin 的文档生成工具叫做 [Dokka](https://github.com/Kotlin/dokka). 关于它的使用方法请阅读
[Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md).

Dokka 有 plugin 可用于 Gradle, Maven 以及 Ant 构建环境, 因此你可以将 Kotlin 代码的文档生成集成到你的构建过程之内.

## KDoc 语法

与 Javadoc 一样, KDoc 以 `/**` 开始, 以 `*/` 结束.
文档中的每一行以星号开始, 星号本身不会被当作文档内容.

按照通常的习惯, 文档的第一段(直到第一个空行之前的所有文字)是对象元素的概要说明,
之后的内容则是详细说明.

每个块标签(block tag) 都应该放在新的一行内, 使用 `@` 字符起始.

下面的例子是使用 KDoc 对一个类标注的文档:

```kotlin
/**
 * 由多个 *成员* 构成的一个组.
 *
 * 这个类没有任何有用的逻辑; 只是一个文档的示例.
 *
 * @param T 组内成员的类型.
 * @property name 组的名称.
 * @constructor 创建一个空的组.
 */
class Group<T>(val name: String) {
    /**
     * 向组添加一个 [成员].
     * @return 添加之后的组大小.
     */
    fun add(member: T): Int { ... }
}
```

### 块标签(Block Tag)

KDoc 目前支持以下块标签:

### @param _name_

对一个函数的参数, 或一个类, 属性, 或函数的类型参数标注文档.
如果你希望的话, 为了更好地区分参数名与描述文本, 可以将参数名放在方括号内.
所以下面两种语法是等价的:

```
@param name 描述.
@param[name] 描述.
```

### @return

对函数的返回值标注文档.

### @constructor

对类的主构造器(primary constructor)标注文档.

### @receiver

对扩展函数的接受者(receiver)标注文档.

### @property _name_

对类中指定名称的属性标注文档. 这个标签可以用来标注主构造器中定义的属性,
如果将文档放在主构造器的属性声明之前会很笨拙, 因此可以使用标签来对指定的属性标注文档.

### @throws _class_, @exception _class_

对一个方法可能抛出的异常标注文档.
由于 Kotlin 中不存在受控异常(checked exception), 因此也并不要求对所有的异常标注文档,
但如果异常信息对类的使用者很有帮助的话, 你可以使用这个标签来标注异常信息.

### @sample _identifier_

为了演示对象元素的使用方法, 可以使用这个标签将指定名称的函数体嵌入到文档内.

### @see _identifier_

这个标签会在文档的 **See also** 部分, 添加一个指向某个类或方法的链接.

### @author

标识对象元素的作者.

### @since

标识对象元素最初引入这个软件时的版本号.

### @suppress

将对象元素排除在文档之外. 有些元素, 不属于模块的正式 API 的一部分,
但站在代码的角度又需要被外界访问, 对这样的元素可以使用这个标签.

> KDoc 不支持 `@deprecated` 标签. 请使用 `@Deprecated` 注解来代替.
{:.note}


## 内联标记(Inline Markup)

对于内联标记(inline markup), KDoc 使用通常的
[Markdown](https://daringfireball.net/projects/markdown/syntax)
语法, 但添加了一种缩写语法来生成指向代码内其他元素的链接.

### 指向元素的链接

要生成指向其他元素(类, 方法, 属性, 或参数)的链接, 只需要简单地将它的名称放在方括号内:

```
请使用 [foo] 方法来实现这个目的.
```

如果你希望对链接指定一个标签, 请使用 Markdown 参照风格(reference-style)语法:

```
请使用 [这个方法][foo] 来实现这个目的.
```

在链接中也可以使用带限定符的元素名称.
注意, 与 Javadoc 不同, 限定符的元素名称永远使用点号来分隔各个部分, 包括方法名称之前的分隔符, 也是点号:

```
请使用 [kotlin.reflect.KClass.properties] 来列举一个类的属性.
```

链接中的元素名称使用的解析规则, 与这个名称出现在对象元素之内时的解析规则一样.
具体来说, 如果你在当前源代码文件中导入(import)了一个名称,
那么在 KDoc 注释内使用它时, 就不必再指定完整的限定符了.

注意, KDoc 没有任何语法可以解析链接内出现的重载函数.
由于 Kotlin 的文档生成工具会将所有重载函数的文档放在同一个页面之内,
因此不必明确指定某一个具体的重载函数, 链接也可以正常工作.

## 模块与包的文档

针对模块整体的文档, 以及针对模块内包的文档, 通过单独的 Markdown 文件的形式提供,
文件路径需要传递给 Dokka, 可以使用命令行参数 `-include` 来指定,
或者使用 Ant, Maven 以及 Gradle plugin 中的对应参数来指定.

在 Markdown 文件内, 针对模块整体的文档, 以及针对各个包的文档, 分别使用各自的顶级标题来指定.
对于模块, 标题文字必须是 **Module `<module name>`**,
对于包, 必须是 **Package `<package qualified name>`**.

下面是一个 Markdown 文件内容的示例:

```text
# Module kotlin-demo

本模块演示 Dokka 语法的使用方法.

# Package org.jetbrains.kotlin.demo

包含各种有用的东西.

## 2 级标题

这个标题之后的文字也是 `org.jetbrains.kotlin.demo` 包的文档的一部分

# Package org.jetbrains.kotlin.demo2

另一个包中的有用的东西.
```
