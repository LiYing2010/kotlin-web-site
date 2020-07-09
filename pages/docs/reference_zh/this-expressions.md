---
type: doc
layout: reference
category: "Syntax"
title: "this 表达式"
---

# this 表达式

为了表示当前函数的 _接收者(receiver)_, 我们使用 *this*{: .keyword } 表达式:

* 在 [类](classes.html#inheritance) 的成员函数中, *this*{: .keyword } 指向这个类的当前对象实例.
* 在 [扩展函数](extensions.html) 中, 或 [带接收者的函数字面值(function literal)](lambdas.html#function-literals-with-receiver) 中,
*this*{: .keyword } 代表调用函数时, 在点号左侧传递的 _接收者_ 参数.

如果 *this*{: .keyword } 没有限定符, 那么它指向 _包含当前代码的最内层范围_. 如果想要指向其他范围内的 *this*{: .keyword }, 需要使用 _标签限定符_:

## 带限定符的 *this*{: .keyword }
{:#qualified}

为了访问更外层范围(比如 [类](classes.html), 或 [扩展函数](extensions.html),
或有标签的 [带接受者的函数字面值](lambdas.html#function-literals-with-receiver))内的 *this*{: .keyword },
我们使用 `this@label`, 其中的 `@label` 是一个 [标签](returns.html), 代表我们想要访问的 *this*{: .keyword } 所属的范围:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">
```kotlin
class A { // 隐含的标签 @A
    inner class B { // 隐含的标签 @B
        fun Int.foo() { // 隐含的标签 @foo
            val a = this@A // 指向 A 的 this
            val b = this@B // 指向 B 的 this

            val c = this // 指向 foo() 函数的接受者, 一个 Int 值
            val c1 = this@foo // 指向 foo() 函数的接受者, 一个 Int 值

            val funLit = lambda@ fun String.() {
                val d = this // 指向 funLit 的接受者
            }


            val funLit2 = { s: String ->
                // 指向 foo() 函数的接受者, 因为包含当前代码的 Lambda 表达式没有接受者
                val d1 = this
            }
        }
    }
}
```
</div>
