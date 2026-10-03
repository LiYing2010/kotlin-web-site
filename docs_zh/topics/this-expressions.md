[//]: # (title: this 表达式)

`this` 表达式指向当前接受者(函数作用的对象). `this` 的用法取决于所处的上下文:

* 在 [类](classes.md) 的成员中, `this` 指向这个类的当前对象.

  例如, 在以下代码中, `this.name` 表示当前 `Language` 对象的 `name` 属性:

  ```kotlin
  class Language(val name: String) {
      fun printName() {
          println(this.name)
      }
  }

  fun main() {
      val language = Language("Kotlin")
      language.printName()
      // 输出结果为: Kotlin
  }
  ```
  {kotlin-runnable="true"}

* 在 [扩展函数](extensions.md) 中, 或 [带有接受者的函数字面值](lambdas.md#function-literals-with-receiver) 中, `this` 指向接受者.

  在以下示例中, 对字符串 `"Kotlin"` 调用了 `lastCharacter()`, 因此 `"Kotlin"` 是接受者.
  在扩展函数内, `this` 指向 `"Kotlin"`. 因此 `this.length` 是 `"Kotlin"` 的长度:

  ```kotlin
  fun String.lastCharacter(): Char {
      println(this.length)
      // 输出结果为: 6
      return this[this.length - 1]
  }

  fun main() {
      println("Kotlin".lastCharacter())
      // 输出结果为: n
  }
  ```
  {kotlin-runnable="true"}

> 在简单的使用场景中, 不需要明确的写出 `this`. Kotlin 会根据当前作用域解析它.
> 详情请参见 [](#implicit-this).
>
{style="tip"}

## 带限定符的 `this` {id="qualified-this"}

如果接受者的作用域出现嵌套, 代码中可能同时存在多个可访问的接受者.
Kotlin 可以隐含的使用任何可用的接受者来访问它的成员, 但内层作用域的接受者具有更高优先级.
要明确的指向某个接受者, 请使用带限定符的 `this`.
如果多个接受者具有同名的成员, 而你需要访问外层接受者的成员, 这种写法尤其有用.

要使用带限定符的 `this`, 请添加 [标签](returns.md) 限定符:

```kotlin
this@label
```

标签会告诉编译器要访问哪个接受者. 你可以使用外层类或扩展函数的名称.
例如, `this@foo` 指向名为 `foo` 的外层扩展函数的接受者.

### 从内部类访问外部类 {id="access-an-outer-class-from-an-inner-class"}

在 [内部类(Inner class)](nested-classes.md#inner-classes) 中, 无限定符的 `this` 指向内部类的实例.
要访问外部类(Outer Class)对象, 请使用带限定符的 `this`:

```kotlin
class User(val name: String) {
    inner class Age(val value: Int) {
        fun printInfo() {
            // 指向当前 Age 对象的 value 属性
            println(this.value)
            // 输出结果为: 22

            // 指向外部 User 对象的 name 属性
            println(this@User.name)
            // 输出结果为: Jane Doe
        }
    }
}

fun main() {
    val user = User("Jane Doe")
    val age = user.Age(22)
    age.printInfo()
}
```
{kotlin-runnable="true"}

> 只有内部类拥有对外部类实例的引用. 普通的 [嵌套类](nested-classes.md) 无法访问外部类的 `this`.
>
{style="note"}

### 从扩展函数访问类 {id="access-a-class-from-an-extension-function"}

如果在类内部声明扩展函数, 那么会存在两个可访问的接受者:

* 扩展接受者(Extension Receiver): 对其调用扩展函数的值.
* 派发接受者(Dispatch Receiver): 声明扩展函数的类的当前对象.

请使用带限定符的 `this` 指明你需要的接受者:

```kotlin
class User(val name: String) {
    val prefix = "Name"

    fun String.formatName(): String {
        return "${this@User.prefix}: ${this.uppercase()}"
    }

    fun printName() {
        println(name.formatName())
    }
}

fun main() {
    val user = User("Jane Doe")
    user.printName()
    // 输出结果为: Name: JANE DOE
}
```
{kotlin-runnable="true"}

在这个示例中:

* `this` 指向扩展接受者 (`String`), 因此 `this.uppercase()` 会将字符串转换为大写.
* `this@User` 指向当前 `User` 对象.
* `this@User.prefix` 访问当前 `User` 对象的 `prefix` 属性.

### 在 Lambda 表达式中访问 {id="access-from-a-lambda"}

与通常的 Lambda 表达式不同, [带接受者的 Lambda 表达式](lambdas.md#function-literals-with-receiver) 会在它的作用域中引入一个接受者.
因此, Lambda 表达式内的 `this` 指向这个 Lambda 表达式的接受者, 而不是外层作用域的接受者.
如果带接受者的 Lambda 表达式嵌套在另一个接受者的作用域之内, 请为 Lambda 表达式添加标签,
并使用带限定符的 `this`, 明确的指向 Lambda 表达式的接受者, 或指向外层作用域的接受者:

```kotlin
class User(val name: String) {
    fun printWithPrefix() {
        val printString: String.() -> Unit = stringLabel@ {
            println("${this@stringLabel}: ${this@User.name}")
        }

        printString("User")
    }
}

fun main() {
    val user = User("Jane Doe")
    user.printWithPrefix()
    // 输出结果为: User: Jane Doe
}
```
{kotlin-runnable="true"}

在这个示例中:

* `stringLabel@` 为 Lambda 表达式添加标签.
* `this@stringLabel` 指向 Lambda 表达式的字符串接受者.
* `this@User` 指向当前 `User` 对象.

标签不会调用任何内容, 也不会改变 Lambda 表达式的工作方式.
它只是帮助你引用 Lambda 表达式的接受者.

### 访问匿名对象或它的外部类 {id="access-an-anonymous-object-or-its-outer-class"}

[匿名对象](object-declarations.md#object-expressions) 有它自己的接受者作用域.
在对象体内部, 无限定符的 `this` 指向匿名对象本身.
但是, 匿名对象没有类名, 因此不能用它的类名作为 `this` 的限定符.
所以, 只能通过无限定符的 `this` 指向匿名对象:

```kotlin
interface UserPrinter {
    fun print()
}

fun main() {
    val printer = object : UserPrinter {
        val prefix = "User"

        override fun print() {
            // `this` 指向匿名对象
            // `this.prefix` 访问它的 `prefix` 属性
            println(this.prefix)
        }
    }
    printer.print()
    // 输出结果为: User
}
```
{kotlin-runnable="true"}

如果在另一个类的内部声明匿名对象, 可以使用带限定符的 `this` 访问外层对象:

```kotlin
interface UserPrinter {
    fun print()
}

class User(val name: String) {
    fun createPrinter(): UserPrinter {
        return object : UserPrinter {
            override fun print() {
                // `this@User` 指向外层 `User` 对象
                // `this@User.name` 访问它的 `name` 属性
                println(this@User.name)
            }
        }
    }
}

fun main() {
    val printer = User("Jane Doe").createPrinter()
    printer.print()
    // 输出结果为: Jane Doe
}
```
{kotlin-runnable="true"}

## 隐含的 `this` {id="implicit-this"}

在 `this` 上调用成员函数时, 可以省略 `this.` 限定符.
但是, 如果在更近的词法作用域内存在其他同名的可调用对象, Kotlin 会将无限定符的调用解析为这个对象, 而不是成员函数.
要明确的调用成员函数, 请使用 `this.` 限定符:

```kotlin
fun main() {
    class A {
        fun printLine() {
            println("Member function")
        }

        fun invokePrintLine() {
            fun printLine() {
                println("Local function")
            }

            printLine()
            // 输出结果为: Local function

            this.printLine()
            // 输出结果为: Member function
        }
    }

    A().invokePrintLine()
}
```
{kotlin-runnable="true"}
