[//]: # (title: this 表达式)

为了表示当前函数的 _接收者(receiver)_, 你可以使用 `this` 表达式:

* 在 [类](classes.md#inheritance) 的成员函数中, `this` 指向这个类的当前对象实例.
* 在 [扩展函数](extensions.md) 中, 或 [带接收者的函数字面值(function literal)](lambdas.md#function-literals-with-receiver) 中,
  `this` 代表调用函数时, 在点号左侧传递的 _接收者_ 参数.

如果 `this` 没有限定符, 那么它指向 _包含当前代码的最内层范围_.
如果想要指向其他范围内的 `this`, 需要使用 _标签限定符_:

## 带限定符的 this {id="qualified-this"}

为了访问更外层范围(比如 [类](classes.md), 或 [扩展函数](extensions.md),
或有标签的 [带接受者的函数字面值](lambdas.md#function-literals-with-receiver))内的 `this`,
你可以使用 `this@label`, 其中的 `@label` 是一个 [标签](returns.md),
代表你想要访问的 `this` 所属的范围:

```kotlin
class A { // 隐含的标签 @A
    inner class B { // 隐含的标签 @B
        fun Int.foo() { // 隐含的标签 @foo
            val a = this@A // 指向 A 的 this
            val b = this@B // 指向 B 的 this

            val c = this // 指向 foo() 函数的接受者, 一个 Int 值
            val c1 = this@foo // 指向 foo() 函数的接受者, 一个 Int 值

            val funLit = lambda@ fun String.() {
                val d = this // 指向 funLit 的接受者, 一个 String 值
            }

            val funLit2 = { s: String ->
                // 指向 foo() 函数的接受者, 因为包含当前代码的 Lambda 表达式没有接受者
                val d1 = this
            }
        }
    }
}
```

## 隐含的 this {id="implicit-this"}

在 `this` 上调用成员函数时, 可以省略 `this.` 部分.
如果你有一个非成员函数使用了相同的名称, 那么使用时要小心, 因为某些情况下会调用到非成员函数:

```kotlin
fun main() {
    fun printLine() { println("Local function") }

    class A {
        fun printLine() { println("Member function") }

        fun invokePrintLine(omitThis: Boolean = false) {
            if (omitThis) printLine()
            else this.printLine()
        }
    }

    A().invokePrintLine() // 输出结果为: Member function
    A().invokePrintLine(omitThis = true) // 输出结果为: Local function
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
