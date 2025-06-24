[//]: # (title: 类型安全的构建器)

通过将恰当命名的函数用做构建器, 结合 [带接受者的函数字面值](lambdas.md#function-literals-with-receiver),
我们可以在 Kotlin 中创建出类型安全的, 静态类型的构建器.

类型安全的构建器(Type-safe builder) 可以用来创建基于 Kotlin 的, 特定领域专用语言(Domain-Specific Language, DSL),
这些语言适合于使用半声明的方式创建复杂的层级式数据结构.
比如, 构建器的一些应用场景包括:

* 使用 Kotlin 代码来生成标记式语言, 比如 [HTML](https://github.com/Kotlin/kotlinx.html) 或 XML
* 为 Web 服务器配置路由: [Ktor](https://ktor.io/docs/routing.html)

我们来看看以下代码:

```kotlin
import com.example.html.* // 具体的声明参见下文

fun result() =
    html {
        head {
            title {+"XML encoding with Kotlin"}
        }
        body {
            h1 {+"XML encoding with Kotlin"}
            p  {+"this format can be used as an alternative markup to XML"}

            // 一个元素, 指定了属性, 还指定了其中的文本内容
            a(href = "https://kotlinlang.org") {+"Kotlin"}

            // 混合内容
            p {
                +"This is some"
                b {+"mixed"}
                +"text. For more see the"
                a(href = "https://kotlinlang.org") {+"Kotlin"}
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
你可以 [在这个页面中在线验证这段代码(可以在浏览器中修改并运行它)](https://play.kotlinlang.org/byExample/09_Kotlin_JS/06_HtmlBuilder).

## 工作原理

假设你需要用 Kotlin 来实现一个类型安全的构建器.
首先, 要对你想要构建的东西定义一组模型. 在这个示例中, 需要对 HTML 标签建模.
这个任务很简单, 只需要定义一组对象就可以了.
比如, `HTML` 是一个类, 负责描述 `<html>` 标签, 它可以定义子标签, 比如 `<head>` 和 `<body>`.
(这个类的具体定义请参见[下文](#full-definition-of-the-com-example-html-package).)

现在, 回忆一下为什么你可以写这样的代码:

```kotlin
html {
 // ...
}
```

`html` 实际上是一个函数调用, 它接受一个 [Lambda 表达式](lambdas.md) 作为参数.
这个函数的定义如下:

```kotlin
fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()
    html.init()
    return html
}
```

这个函数只接受唯一一个参数, 名为 `init`, 这个参数本身又是一个函数.
其类型是 `HTML.() -> Unit`, 它是一个 *带接受者的函数类型*.
也就是说, 你应该向这个函数传递一个 `HTML` 的实例(一个 *接收者*)作为参数,
而且在函数内, 你可以调用这个实例的成员.

接受者可以通过 `this` 关键字来访问:

```kotlin
html {
    this.head { ... }
    this.body { ... }
}
```

(`head` 和 `body` 是 `HTML` 类的成员函数.)

现在, `this` 关键字可以省略, 通常都是如此, 省略之后你的代码就已经非常接近一个构建器了:

```kotlin
html {
    head { ... }
    body { ... }
}
```

那么, 这个函数调用做了什么? 我们来看看上面定义的 `html` 函数体.
首先它创建了一个 `HTML` 类的新实例, 然后它调用通过参数得到的函数, 来初始化这个 `HTML` 实例
(在这个示例中, 这个初始化函数对 `HTML` 实例调用了 `head` 和 `body` 方法), 然后, 这个函数返回这个 `HTML` 实例.
这正是构建器应该做的.

`HTML` 类中 `head` 和 `body` 函数的定义与 `html` 函数类似.
唯一的区别是, 这些函数会将自己创建的对象实例添加到自己所属的 `HTML` 实例的 `children` 集合中:

```kotlin
fun head(init: Head.() -> Unit): Head {
    val head = Head()
    head.init()
    children.add(head)
    return head
}

fun body(init: Body.() -> Unit): Body {
    val body = Body()
    body.init()
    children.add(body)
    return body
}
```

实际上这两个函数做的事情完全相同, 因此你可以编写一个泛型化的函数, 名为 `initTag`:

```kotlin
protected fun <T : Element> initTag(tag: T, init: T.() -> Unit): T {
    tag.init()
    children.add(tag)
    return tag
}
```

然后, 这你的函数就变得很简单了:

```kotlin
fun head(init: Head.() -> Unit) = initTag(Head(), init)

fun body(init: Body.() -> Unit) = initTag(Body(), init)
```

现在你可以使用这两个函数来构建 `<head>` 和 `<body>` 标签了.

还需要讨论的一个问题是, 你要如何在标签内部添加文本.
在上面的示例程序中, 你写了这样的代码:

```kotlin
html {
    head {
        title {+"XML encoding with Kotlin"}
    }
    // ...
}
```

你所作的, 仅仅只是将一个字符串放在一个标签之内, 但在字符串之前有一个小小的 `+`,
所以, 它是一个函数调用, 被调用的是前缀操作符函数 `unaryPlus()`.
这个操作符实际上是由扩展函数 `unaryPlus()` 定义的,
这个扩展函数是抽象类 `TagWithText` 的成员 (这个抽象类是 `Title` 类的祖先类):

```kotlin
operator fun String.unaryPlus() {
    children.add(TextElement(this))
}
```

所以, 前缀操作符 `+` 所作的, 是将一个字符串封装到 `TextElement` 的一个实例中,
然后将这个实例添加到 `children` 集合中, 然后这个字符串就会成为标签树中一个适当的部分.

以上所有类和函数都定义在 `com.example.html` 包中, 上面的构建器示例程序的最上部引入了这个包.
在最后一节中, 你可以读到这个包的完整定义.

## 控制接受者的作用范围: @DslMarker

使用 DSL 时, 可能遇到的一个问题就是, 当前上下文中存在太多可供调用的函数.
在 Lambda 表达式内, 你可以调用所有隐含接受者的所有方法,
因此造成一种不正确的结果, 比如一个 `head` 之内可以嵌套另一个 `head` 标签:

```kotlin
html {
    head {
        head {} // 应该禁止这样的调用
    }
    // ...
}
```

在这个示例中, 应该只允许调用离当前代码最近的隐含接受者 `this@head` 的成员函数;
`head()` 是更外层接受者 `this@html` 的成员函数,因此调用它应该是不允许的.

为了解决这个问题, 有一种特殊机制来控制接受者的作用范围.

要让编译器控制接受者的作用范围, 你只需要用一个相同的注解, 对 DSL 中用到的所有接受者的类型进行标注.
比如, 对 HTML 构建器你可以定义一个注解 `@HTMLTagMarker`:

```kotlin
@DslMarker
annotation class HtmlTagMarker
```

如果对一个注解类标注了 `@DslMarker` 注解, 我们将它称作一个 DSL 标记.

在我们的 DSL 中, 所有的标签类都继承自相同的超类 `Tag`.
只需要对超类标注 `@HtmlTagMarker` 注解就够了,
然后 Kotlin 编译器会将所有的派生类都看作已被标注了同样的注解:

```kotlin
@HtmlTagMarker
abstract class Tag(val name: String) { ... }
```

你不必对 `HTML` 或 `Head` 类再标注 `@HtmlTagMarker` 注解, 因为它们的超类已经标注过了这个注解:

```kotlin
class HTML() : Tag("html") { ... }

class Head() : Tag("head") { ... }
```

标注这个注解之后, Kotlin 编译器就可以知道哪些隐含的接受者属于相同的 DSL, 因此编译器只允许代码调用离当前位置最近的接受者的成员函数:

```kotlin
html {
    head {
        head { } // 编译错误: 这是外层接受者的成员函数, 因此不允许在这里调用
    }
    // ...
}
```

注意, 如果确实需要调用外层接受者的成员函数, 仍然是可以实现的, 但这时你必须明确指定具体的接受者:

```kotlin
html {
    head {
        this@html.head { } // 仍然可以调用外层接受者的成员函数
    }
    // ...
}
```

你也可以直接对 [函数类型](lambdas.md#function-types) 使用 `@DslMarker` 注解.
只需要对 `@DslMarker` 注解标注 `@Target(AnnotationTarget.TYPE)`:

```kotlin
@Target(AnnotationTarget.TYPE)
@DslMarker
annotation class HtmlTagMarker
```

这样做之后, `@DslMarker` 注解就可以被用于函数类型了, 最常见的情况是用于带接受者的 Lambda 表达式.
例如:

```kotlin
fun html(init: @HtmlTagMarker HTML.() -> Unit): HTML { ... }

fun HTML.head(init: @HtmlTagMarker Head.() -> Unit): Head { ... }

fun Head.title(init: @HtmlTagMarker Title.() -> Unit): Title { ... }
```

当你调用这些函数时, 在标注了 `@DslMarker` 注解的 Lambda 表达式的 body 部中, 这个注解会限制对外层接受者的访问,
除非你明确的指明接受者:

```kotlin
html {
    head {
        title {
            // 在这里, 会禁止访问外层接受者的 title, head 或其它函数.
        }
    }
}
```

在 Lambda 表达式内, 只有最内层的接受者的成员和扩展可以访问, 防止在嵌套的作用域之间发生意外的交互.

### com.example.html 包的完整定义 {id="full-definition-of-the-com-example-html-package"}

下面是 `com.example.html` 包的完整定义(但只包含上文示例程序使用到的元素).
它可以构建一个 HTML 树.
这段代码大量使用了 [扩展函数](extensions.md) 和 [带接受者的 Lambda 表达式](lambdas.md#function-literals-with-receiver).

```kotlin
package com.example.html

interface Element {
    fun render(builder: StringBuilder, indent: String)
}

class TextElement(val text: String) : Element {
    override fun render(builder: StringBuilder, indent: String) {
        builder.append("$indent$text\n")
    }
}

@DslMarker
annotation class HtmlTagMarker

@HtmlTagMarker
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
        for ((attr, value) in attributes) {
            builder.append(" $attr=\"$value\"")
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

class HTML : TagWithText("html") {
    fun head(init: Head.() -> Unit) = initTag(Head(), init)

    fun body(init: Body.() -> Unit) = initTag(Body(), init)
}

class Head : TagWithText("head") {
    fun title(init: Title.() -> Unit) = initTag(Title(), init)
}

class Title : TagWithText("title")

abstract class BodyTag(name: String) : TagWithText(name) {
    fun b(init: B.() -> Unit) = initTag(B(), init)
    fun p(init: P.() -> Unit) = initTag(P(), init)
    fun h1(init: H1.() -> Unit) = initTag(H1(), init)
    fun a(href: String, init: A.() -> Unit) {
        val a = initTag(A(), init)
        a.href = href
    }
}

class Body : BodyTag("body")
class B : BodyTag("b")
class P : BodyTag("p")
class H1 : BodyTag("h1")

class A : BodyTag("a") {
    var href: String
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
