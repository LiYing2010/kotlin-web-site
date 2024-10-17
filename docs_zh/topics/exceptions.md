[//]: # (title: 异常(Exception))

## 异常类

Kotlin 中所有的异常类都继承自 `Throwable` 类.
每个异常都带有错误消息, 调用堆栈, 以及可选的错误原因.

要抛出异常, 可以使用 `throw` 表达式:

```kotlin
fun main() {
//sampleStart
    throw Exception("Hi There!")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要捕获异常, 可以使用 `try`...`catch` 表达式:

```kotlin
try {
    // 某些代码
} catch (e: SomeException) {
    // 异常处理
} finally {
    // 可选的 finally 代码段
}
```

`try` 表达式中可以有 0 个或多个 `catch` 代码段, `finally` 代码段可以省略.
但是, `catch` 或 `finally` 代码段总计至少要出现一个.

### Try 是一个表达式

`try` 是一个表达式, 也就是说, 它可以有返回值:

```kotlin
val a: Int? = try { input.toInt() } catch (e: NumberFormatException) { null }
```

`try` 表达式的返回值, 要么是 `try` 代码段内最后一个表达式的值,
要么是 `catch` 代码段内最后一个表达式的值.
`finally` 代码段的内容不会影响 `try` 表达式的结果值.

## 受控异常(Checked Exception)

Kotlin 中不存在受控异常(checked exception). 原因有很多, 我们举一个简单的例子.

下面的例子是 JDK 中 `StringBuilder` 类所实现的一个接口:

```java
Appendable append(CharSequence csq) throws IOException;
```

这个方法签名代表, 每次我想要将一个字符串追加到某个对象(比如, 一个 `StringBuilder`, 某种 log, 控制台, 等等),
我都必须要捕获 `IOException` 异常.
为什么? 因为这个方法的具体实现有可能会执行 IO 操作 (比如 `Writer` 类也会实现 `Appendable` 接口).
因此就导致我们的程序中充满了这样的代码:

```kotlin
try {
    log.append(message)
} catch (IOException e) {
    // 实际上前面的代码必然是安全的
}
```

这样的结果就很不好, 请参见 [Effective Java, 第 3 版](https://www.oracle.com/technetwork/java/effectivejava-136174.html),
第 77 条: *不要忽略异常*.

Bruce Eckel 对受控异常评论说:

> 在小程序中的试验证明, 在方法定义中要求标明异常信息, 可以提高开发者的生产性, 同时提高代码质量,
> 但在大型软件中的经验则却指向一个不同的结论 – 生产性降低, 而代码质量改善不大, 或者根本没有改善.

关于这个问题还有其他讨论:

* [Java 的受控异常是一个错误](https://radio-weblogs.com/0122027/stories/2003/04/01/JavasCheckedExceptionsWereAMistake.html) (Rod Waldhoff)
* [受控异常带来的问题](https://www.artima.com/intv/handcuffs.html) (Anders Hejlsberg)
(译注, 他是 Borland Turbo Pascal 和 Delphi 的主要作者, 微软.Net概念的发起人之一, .Net首席架构师)

从 Java, Swift, 或 Objective-C 中 调用 Kotlin 代码时, 如果你想对函数调用者提示可能发生异常, 可以使用 `@Throws` 注解.
关于这个注解 [在 Java 中如何使用](java-to-kotlin-interop.md#checked-exceptions)
以及 [在 Swift 和 Objective-C 如何使用](native-objc-interop.md#errors-and-exceptions), 请阅读这些文档.

## Nothing 类型 {id="the-nothing-type"}

在 Kotlin 中, `throw` 是一个表达式, 比如说, 你可以将它用做 Elvis 表达式的一部分:

```kotlin
val s = person.name ?: throw IllegalArgumentException("Name required")
```

`throw` 表达式的类型是 `Nothing`.
这个类型没有值, 它被用来标记那些永远无法执行到的代码位置.
在你自己的代码中, 你可以用 `Nothing` 来标记一个永远不会正常返回的函数:

```kotlin
fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
}
```

如果你调用这个函数, 编译器就会知道, 执行到这个调用时, 程序就会停止:

```kotlin
val s = person.name ?: fail("Name required")
println(s)     // 在这里可以确定地知道 's' 已被正确地初始化
```

在使用类型推断时也可能遇到这个类型. 这个类型的可为 null 的变量, `Nothing?`, 只有唯一一个可能的值, 就是 `null`.
如果对一个自动推断类型的值, 使用 `null` 来初始化, 而且又没有更多的信息可以用来推断出更加具体的类型, 编译器会将类型推断为 `Nothing?`:

```kotlin
val x = null           // 'x' 的类型是 `Nothing?`
val l = listOf(null)   // 'l' 的类型是 `List<Nothing?>
```

## 与 Java 的互操作性

关于与 Java 的互操作性问题, 请参见 [与 Java 的互操作性](java-interop.md) 中关于异常的小节.
