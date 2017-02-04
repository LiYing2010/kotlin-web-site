---
type: doc
layout: reference
category: "Syntax"
title: "类型安全的 Groovy 风格构建器"
---

# 类型安全的构建器(Type-Safe Builder)

[构建器(builder)](http://www.groovy-lang.org/dsls.html#_nodebuilder) 的理念在 *Groovy* 开发社区非常流行.
使用构建器, 可以以一种半声明式的方式(semi-declarative way)来定义数据. 构建器非常适合于 [生成 XML](http://www.groovy-lang.org/processing-xml.html#_creating_xml), 
[控制 UI 组件布局](http://www.groovy-lang.org/swing.html), 
[描述 3D 场景](http://www.artima.com/weblogs/viewpost.jsp?thread=296081), 等等等等...

在很多的使用场景下, Kotlin 可以创建一种 *类型检查* 的构建器, 这种功能使得 kotlin 中的构建器比 Groovy 自己的动态类型构建器更具吸引力.

如果无法使用带类型检查的构建器, Kotlin 也支持动态类型的构建器.

## 类型安全的构建器的示例

我们来看看以下代码:

``` kotlin
import com.example.html.* // 具体的声明参见下文

fun result(args: Array<String>) =
    html {
        head {
            title {+"XML encoding with Kotlin"}
        }
        body {
            h1 {+"XML encoding with Kotlin"}
            p  {+"this format can be used as an alternative markup to XML"}

            // 一个元素, 指定了属性, 还指定了其中的文本内容
            a(href = "http://kotlinlang.org") {+"Kotlin"}

            // 混合内容
            p {
                +"This is some"
                b {+"mixed"}
                +"text. For more see the"
                a(href = "http://kotlinlang.org") {+"Kotlin"}
                +"project"
            }
            p {+"some text"}

            // 由程序生成的内容
            p {
                for (arg in args)
                    +arg
            }
        }
    }
```

上面是一段完全合法的 Kotlin 代码.
你可以在 [这个页面](http://try.kotlinlang.org/#/Examples/Longer examples/HTML Builder/HTML Builder.kt) 中在线验证这段代码(可以在浏览器中修改并运行它).

## 工作原理

我们来看看 Kotlin 中类型安全的构建器的实现机制.
首先, 我们要对我们想要构建的东西定义一组模型, 在这个示例中, 我们需要对 HTML 标签建模.
这个任务很简单, 只需要定义一组对象就可以了.
比如, `HTML` 是一个类, 负责描述 `<html>` 标签, 也就是说, 它可以定义子标签, 比如 `<head>` 和 `<body>`.
(这个类的具体定义请参见[下文](#declarations).)

现在, 回忆一下为什么我们可以写这样的代码:

``` kotlin
html {
 // ...
}
```

`html` 实际上是一个函数调用, 它接受一个 [Lambda 表达式](lambdas.html) 作为参数.
这个函数的定义如下:

``` kotlin
fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()
    html.init()
    return html
}
```

这个函数只接受唯一一个参数, 名为 `init`, 这个参数本身又是一个函数, 其类型是 `HTML.() -> Unit`, 它是一个 _带接受者的函数类型_.
也就是说, 我们应该向这个函数传递一个 `HTML` 的实例(一个 _接收者_)作为参数,
而且在函数内, 我们可以调用这个实例的成员.
接受者可以通过 *this*{: .keyword } 关键字来访问:

``` kotlin
html {
    this.head { /* ... */ }
    this.body { /* ... */ }
}
```

(`head` 和 `body` 是 `HTML` 类的成员函数.)

现在, *this*{: .keyword } 关键字可以省略, 通常都是如此, 省略之后我们的代码就已经非常接近一个构建器了:

``` kotlin
html {
    head { /* ... */ }
    body { /* ... */ }
}
```

那么, 这个函数调用做了什么? 我们来看看上面定义的 `html` 函数体.
首先它创建了一个 `HTML` 类的新实例, 然后它调用通过参数得到的函数, 来初始化这个 `HTML` 实例 (在我们的示例中, 这个初始化函数对 `HTML` 实例调用了 `head` 和 `body` 方法), 然后, 这个函数返回这个 `HTML` 实例. 
这正是构建器应该做的.

`HTML` 类中 `head` 和 `body` 函数的定义与 `html` 函数类似. 
唯一的区别是, 这些函数会将自己创建的对象实例添加到自己所属的 `HTML` 实例的 `children` 集合中:

``` kotlin
fun head(init: Head.() -> Unit) : Head {
    val head = Head()
    head.init()
    children.add(head)
    return head
}

fun body(init: Body.() -> Unit) : Body {
    val body = Body()
    body.init()
    children.add(body)
    return body
}
```

实际上这两个函数做的事情完全相同, 因此我们可以编写一个泛型化的函数, 名为 `initTag`:

``` kotlin
    protected fun <T : Element> initTag(tag: T, init: T.() -> Unit): T {
        tag.init()
        children.add(tag)
        return tag
    }
```

然后, 这两个函数就变得很简单了:

``` kotlin
fun head(init: Head.() -> Unit) = initTag(Head(), init)

fun body(init: Body.() -> Unit) = initTag(Body(), init)
```

现在我们可以使用这两个函数来构建 `<head>` 和 `<body>` 标签了. 


还需要讨论的一个问题是, 我们如何在标签内部添加文本. 在上面的示例程序中, 我们写了这样的代码:

``` kotlin
html {
    head {
        title {+"XML encoding with Kotlin"}
    }
    // ...
}
```

我们所作的, 仅仅只是将一个字符串放在一个标签之内, 但在字符串之前有一个小小的 `+`,
所以, 它是一个函数调用, 被调用的是前缀操作符函数 `unaryPlus()`.
这个操作符实际上是由扩展函数 `unaryPlus()` 定义的, 这个扩展函数是抽象类 `TagWithText` 的成员 (这个抽象类是 `Title` 类的祖先类):

``` kotlin
fun String.unaryPlus() {
    children.add(TextElement(this))
}
```

所以, 前缀操作符 `+` 所作的, 是将一个字符串封装到 `TextElement` 的一个实例中, 然后将这个实例添加到 `children` 集合中, 然后这个字符串就会成为标签树中一个适当的部分.

以上所有类和函数都定义在 `com.example.html` 包中, 上面的构建器示例程序的最上部引入了这个包.
在下一节中, 你可以读到这个包的完整定义.

## `com.example.html` 包的完整定义

下面是 `com.example.html` 包的完整定义(但只包含上文示例程序使用到的元素).
它可以构建一个 HTML 树. 这段代码大量使用了 [扩展函数](extensions.html) 和 [带接受者的 Lambda 表达式](lambdas.html#function-literals-with-receiver).

<a name='declarations'></a>

``` kotlin
package com.example.html

interface Element {
    fun render(builder: StringBuilder, indent: String)
}

class TextElement(val text: String) : Element {
    override fun render(builder: StringBuilder, indent: String) {
        builder.append("$indent$text\n")
    }
}

abstract class Tag(val name: String) : Element {
    val children = arrayListOf<Element>()
    val attributes = hashMapOf<String, String>()

    protected fun <T : Element> initTag(tag: T, init: T.() -> Unit): T {
        tag.init()
        children.add(tag)
        return tag
    }

    override fun render(builder: StringBuilder, indent: String) {
        builder.append("$indent<$name${renderAttributes()}>\n")
        for (c in children) {
            c.render(builder, indent + "  ")
        }
        builder.append("$indent</$name>\n")
    }

    private fun renderAttributes(): String {
        val builder = StringBuilder()
        for (a in attributes.keys) {
            builder.append(" $a=\"${attributes[a]}\"")
        }
        return builder.toString()
    }


    override fun toString(): String {
        val builder = StringBuilder()
        render(builder, "")
        return builder.toString()
    }
}

abstract class TagWithText(name: String) : Tag(name) {
    operator fun String.unaryPlus() {
        children.add(TextElement(this))
    }
}

class HTML() : TagWithText("html") {
    fun head(init: Head.() -> Unit) = initTag(Head(), init)

    fun body(init: Body.() -> Unit) = initTag(Body(), init)
}

class Head() : TagWithText("head") {
    fun title(init: Title.() -> Unit) = initTag(Title(), init)
}

class Title() : TagWithText("title")

abstract class BodyTag(name: String) : TagWithText(name) {
    fun b(init: B.() -> Unit) = initTag(B(), init)
    fun p(init: P.() -> Unit) = initTag(P(), init)
    fun h1(init: H1.() -> Unit) = initTag(H1(), init)
    fun a(href: String, init: A.() -> Unit) {
        val a = initTag(A(), init)
        a.href = href
    }
}

class Body() : BodyTag("body")
class B() : BodyTag("b")
class P() : BodyTag("p")
class H1() : BodyTag("h1")

class A() : BodyTag("a") {
    public var href: String
        get() = attributes["href"]!!
        set(value) {
            attributes["href"] = value
        }
}

fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()
    html.init()
    return html
}
```
