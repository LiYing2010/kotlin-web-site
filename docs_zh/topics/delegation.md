[//]: # (title: 委托)

[委托模式](https://en.wikipedia.org/wiki/Delegation_pattern) 已被实践证明为类继承模式之外的另一种很好的替代方案,
Kotlin 直接支持委托模式, 因此你不必再为了实现委托模式而手动编写那些无聊的样板代码(Boilerplate Code)了.

比如, `Derived` 类可以实现 `Base` 接口, 将接口所有的 public 成员委托给一个指定的对象:

```kotlin
interface Base {
    fun print()
}

class BaseImpl(val x: Int) : Base {
    override fun print() { print(x) }
}

class Derived(b: Base) : Base by b

fun main() {
    val base = BaseImpl(10)
    Derived(base).print()
}
```
{kotlin-runnable="true"}

`Derived` 类声明的基类列表中的 `by` 子句表示, `b` 将被保存在 `Derived` 的对象实例内部,
而且编译器将会生成继承自 `Base` 接口的所有方法, 并将调用转发给 `b`.

## 覆盖由委托实现的接口成员

函数和属性的 [覆盖](inheritance.md#overriding-methods) 会如你预期的那样工作:
编译器将会使用你的 `override` 实现, 而不会使用委托对象中的实现.
如果你想要在 `Derived` 中添加一段函数覆盖 `override fun printMessage() { print("abc") }`,
那么上面程序中调用 `printMessage` 时的打印结果将是 *abc*, 而不是 *10*:

```kotlin
interface Base {
    fun printMessage()
    fun printMessageLine()
}

class BaseImpl(val x: Int) : Base {
    override fun printMessage() { print(x) }
    override fun printMessageLine() { println(x) }
}

class Derived(b: Base) : Base by b {
    override fun printMessage() { print("abc") }
}

fun main() {
    val base = BaseImpl(10)
    Derived(base).printMessage()
    Derived(base).printMessageLine()
}
```
{kotlin-runnable="true"}

注意, 使用上述方式覆盖的接口成员, 在委托对象的成员函数内无法调用.
委托对象的成员函数内, 只能访问它自己的接口方法实现:

```kotlin
interface Base {
    val message: String
    fun print()
}

class BaseImpl(x: Int) : Base {
    override val message = "BaseImpl: x = $x"
    override fun print() { println(message) }
}

class Derived(b: Base) : Base by b {
    // 在 b 的 `print` 方法实现中无法访问这个属性
    override val message = "Message of Derived"
}

fun main() {
    val b = BaseImpl(10)
    val derived = Derived(b)
    derived.print()
    println(derived.message)
}
```
{kotlin-runnable="true"}

更多信息请参见 [委托属性](delegated-properties.md).
